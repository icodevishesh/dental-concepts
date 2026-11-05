"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UploadCloud, X, Check, AlertCircle } from "lucide-react";

export interface UploadedGalleryImage {
  _id: string;
  url: string;
  publicId: string;
  alt: string;
  createdAt: string;
}

interface QueuedFile {
  id: string;
  file: File;
  previewUrl: string;
  status: "queued" | "uploading" | "done" | "error" | "canceled";
  progress: number;
  error?: string;
}

const CONCURRENCY = 3;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function uploadFile(
  file: File,
  onProgress: (pct: number) => void,
  registerXhr: (xhr: XMLHttpRequest) => void
): Promise<UploadedGalleryImage> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    registerXhr(xhr);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt", file.name.replace(/\.[^/.]+$/, ""));

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.ok) {
          resolve(data.image as UploadedGalleryImage);
        } else {
          reject(new Error(data.error || "Upload failed"));
        }
      } catch {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.onabort = () => reject(new Error("canceled"));

    xhr.open("POST", "/api/admin/gallery");
    xhr.send(formData);
  });
}

export default function GalleryUploader({
  onUploaded,
  onAllDone,
}: {
  onUploaded: (image: UploadedGalleryImage) => void;
  onAllDone?: () => void;
}) {
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const xhrMap = useRef<Map<string, XMLHttpRequest>>(new Map());
  const itemsRef = useRef<QueuedFile[]>([]);
  const inFlightRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const pumpRef = useRef<() => void>(() => {});

  const updateFile = useCallback((id: string, patch: Partial<QueuedFile>) => {
    itemsRef.current = itemsRef.current.map((f) => (f.id === id ? { ...f, ...patch } : f));
    setQueue(itemsRef.current);
  }, []);

  const pump = useCallback(() => {
    while (inFlightRef.current < CONCURRENCY) {
      const next = itemsRef.current.find((f) => f.status === "queued");
      if (!next) break;

      inFlightRef.current += 1;
      updateFile(next.id, { status: "uploading", progress: 0 });

      uploadFile(
        next.file,
        (pct) => updateFile(next.id, { progress: pct }),
        (xhr) => xhrMap.current.set(next.id, xhr)
      )
        .then((image) => {
          updateFile(next.id, { status: "done", progress: 100 });
          onUploaded(image);
        })
        .catch((err) => {
          if (err instanceof Error && err.message === "canceled") {
            updateFile(next.id, { status: "canceled" });
          } else {
            updateFile(next.id, { status: "error", error: err instanceof Error ? err.message : "Upload failed" });
          }
        })
        .finally(() => {
          xhrMap.current.delete(next.id);
          inFlightRef.current -= 1;
          pumpRef.current();
          const stillWorking = itemsRef.current.some((f) => f.status === "queued" || f.status === "uploading");
          if (!stillWorking) onAllDone?.();
        });
    }
  }, [onUploaded, onAllDone, updateFile]);

  useEffect(() => {
    pumpRef.current = pump;
  }, [pump]);

  const addFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const accepted: QueuedFile[] = [];
      for (const file of Array.from(fileList)) {
        if (!ALLOWED_TYPES.includes(file.type)) continue;
        if (file.size > MAX_FILE_SIZE) continue;
        accepted.push({
          id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
          file,
          previewUrl: URL.createObjectURL(file),
          status: "queued",
          progress: 0,
        });
      }
      if (accepted.length === 0) return;
      itemsRef.current = [...itemsRef.current, ...accepted];
      setQueue(itemsRef.current);
      pump();
    },
    [pump]
  );

  const cancelFile = (id: string) => {
    const xhr = xhrMap.current.get(id);
    if (xhr) xhr.abort();
    else updateFile(id, { status: "canceled" });
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          isDragging ? "border-blue-default bg-blue-default/5" : "border-gray-300 hover:border-blue-default"
        }`}
      >
        <UploadCloud className="w-8 h-8 text-gray-400" />
        <p className="text-sm font-semibold text-gray-700">Drag photos here, or click to browse</p>
        <p className="text-xs text-gray-400">JPEG, PNG, WEBP or GIF, up to 10MB each</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {queue.length > 0 && (
        <ul className="mt-4 space-y-2 max-h-72 overflow-y-auto">
          {queue.map((f) => (
            <li key={f.id} className="flex items-center gap-3 rounded-lg border border-gray-200 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.previewUrl} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate">{f.file.name}</p>
                <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${f.status === "error" ? "bg-red-400" : "bg-blue-default"}`}
                    style={{ width: `${f.status === "done" ? 100 : f.progress}%` }}
                  />
                </div>
                {f.status === "error" && <p className="text-[11px] text-red-500 mt-0.5">{f.error}</p>}
              </div>
              {f.status === "done" ? (
                <Check className="w-4 h-4 text-green-500 shrink-0" />
              ) : f.status === "error" ? (
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              ) : f.status === "canceled" ? (
                <span className="text-[11px] text-gray-400 shrink-0">Canceled</span>
              ) : (
                <button
                  onClick={() => cancelFile(f.id)}
                  className="p-1 rounded hover:bg-gray-100 border-none bg-transparent cursor-pointer shrink-0"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
