"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, X, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import GalleryUploader, { UploadedGalleryImage } from "@/components/admin/GalleryUploader";

export default function AdminGalleryPage() {
  const [images, setImages] = useState<UploadedGalleryImage[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchImages = useCallback(async (targetPage: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/gallery?page=${targetPage}`);
      if (!res.ok) throw new Error("Failed to fetch gallery images");
      const json = await res.json();
      setImages(json.images);
      setPage(json.page);
      setTotalPages(json.totalPages);
      setTotal(json.total);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error loading gallery");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount
    fetchImages(1);
  }, [fetchImages]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      toast.success("Image deleted");
      fetchImages(page);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error deleting image");
    } finally {
      setDeletingId(null);
    }
  };

  const uploadedCountRef = useRef(0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="!text-lg font-semibold text-gray-900 !mb-2">Case Gallery</h2>
          <p className="!text-sm text-gray-500">Upload and manage photos shown on the public gallery page.</p>
        </div>
        <button
          onClick={() => {
            uploadedCountRef.current = 0;
            setIsModalOpen(true);
          }}
          className="bg-blue-default hover:bg-blue-bright !text-white font-semibold py-2 px-4 rounded-lg !text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          Upload Images
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-3 border-blue-default border-t-transparent rounded-full animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center gap-2 text-center py-20 text-gray-500">
          <ImageOff className="w-8 h-8 text-gray-300" />
          <p className="font-semibold">No images yet. Click &quot;Upload Images&quot; to add some.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img) => (
            <div key={img._id} className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50" style={{ aspectRatio: "4 / 6" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-end p-2">
                <button
                  onClick={() => handleDelete(img._id)}
                  disabled={deletingId === img._id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/90 hover:bg-red-500 text-white rounded-lg p-2 border-none cursor-pointer disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && images.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <p className="!text-xs text-gray-500">
            Page {page} of {totalPages} &middot; {total} total
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchImages(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => fetchImages(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[5000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col" style={{ maxHeight: "95vh" }}>
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-base font-semibold text-gray-900">Upload Images</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  if (uploadedCountRef.current > 0) fetchImages(1);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 border-none cursor-pointer flex items-center justify-center text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <GalleryUploader
                onUploaded={() => {
                  uploadedCountRef.current += 1;
                }}
                onAllDone={() => {
                  const count = uploadedCountRef.current;
                  if (count > 0) {
                    toast.success(`${count} image${count > 1 ? "s" : ""} uploaded`);
                    fetchImages(1);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
