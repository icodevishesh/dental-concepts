"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { Edit2, Trash2, Plus, X, Upload, ImageIcon } from "lucide-react";

const guideSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  href: z.string().min(1, "Link is required"),
  coverImage: z.string(),
  coverImageAlt: z.string(),
  publishedAt: z.string().min(1, "Date is required"),
});

type GuideFormValues = z.infer<typeof guideSchema>;

interface GuideResource extends GuideFormValues {
  _id: string;
}

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<GuideResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<GuideResource | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GuideFormValues>({ resolver: zodResolver(guideSchema) });

  const watchedImageUrl = watch("coverImage");

  const fetchGuides = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/guides");
      if (!res.ok) throw new Error("Failed to fetch guides");
      setGuides(await res.json());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error loading guides");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload-image", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setValue("coverImage", data.url);
      setImagePreview(data.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const openAddModal = () => {
    setEditingGuide(null);
    setImagePreview("");
    reset({
      title: "",
      description: "",
      category: "",
      href: "",
      coverImage: "",
      coverImageAlt: "",
      publishedAt: new Date().toISOString().slice(0, 10),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (guide: GuideResource) => {
    setEditingGuide(guide);
    setImagePreview(guide.coverImage || "");
    reset(guide);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImagePreview("");
  };

  const onSubmit = async (values: GuideFormValues) => {
    setIsSubmitting(true);
    try {
      const url = editingGuide ? `/api/admin/guides/${editingGuide._id}` : "/api/admin/guides";
      const method = editingGuide ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save guide");
      toast.success(editingGuide ? "Guide updated" : "Guide added");
      closeModal();
      fetchGuides();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving guide");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this guide?")) return;
    try {
      const res = await fetch(`/api/admin/guides/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      toast.success("Guide deleted");
      fetchGuides();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error deleting guide");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 !mb-2">Manage Guides</h2>
          <p className="!text-sm text-gray-500">Add or remove practical guides shown on the Guides page.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-default hover:bg-blue-bright text-white font-semibold py-2 px-4 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          Add Guide
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-3 border-blue-default border-t-transparent rounded-full animate-spin" />
        </div>
      ) : guides.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-semibold">No guides yet. Click &quot;Add Guide&quot; to create one.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm text-gray-700">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Guide</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {guides.map((g) => (
                <tr key={g._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="flex gap-3 items-start">
                      {g.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={g.coverImage} alt={g.title} className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0" />
                      )}
                      <div>
                        <div className="font-semibold text-gray-900 leading-tight">{g.title}</div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">{g.description}</div>
                        <div className="text-[10px] text-blue-glow font-semibold mt-1">{g.href}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-gray-100 border border-gray-200 rounded-full px-2.5 py-0.5 text-xs text-gray-700 font-medium">
                      {g.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-400">{g.publishedAt}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(g)} className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 border-none cursor-pointer" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(g._id)} className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border-none cursor-pointer" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[5000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col" style={{ maxHeight: "95vh" }}>
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-base font-semibold text-gray-900">{editingGuide ? "Edit Guide" : "Add Guide"}</h3>
              <button onClick={closeModal} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 border-none cursor-pointer flex items-center justify-center text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                <input type="text" {...register("title")} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none" />
                {errors.title && <span className="text-red-400 text-xs mt-1 block">{errors.title.message}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                  <input type="text" placeholder="e.g. Working with the lab" {...register("category")} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none" />
                  {errors.category && <span className="text-red-400 text-xs mt-1 block">{errors.category.message}</span>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Date</label>
                  <input type="date" {...register("publishedAt")} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none" />
                  {errors.publishedAt && <span className="text-red-400 text-xs mt-1 block">{errors.publishedAt.message}</span>}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                <input type="text" {...register("description")} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none" />
                {errors.description && <span className="text-red-400 text-xs mt-1 block">{errors.description.message}</span>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Link <span className="normal-case font-normal text-gray-400">(internal path or external URL)</span>
                </label>
                <input type="text" placeholder="/blog/how-to-complete-the-rx-form" {...register("href")} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none" />
                {errors.href && <span className="text-red-400 text-xs mt-1 block">{errors.href.message}</span>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Cover Image <span className="normal-case font-normal text-gray-400">(optional)</span>
                </label>
                <input type="hidden" {...register("coverImage")} />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative w-full rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
                    isUploading ? "border-blue-default/50 bg-blue-default/5" : "border-gray-300 hover:border-blue-default/50 hover:bg-gray-50"
                  }`}
                >
                  {imagePreview || watchedImageUrl ? (
                    <div className="relative h-28">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview || watchedImageUrl} alt="Cover" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" /> Replace image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 gap-2">
                      {isUploading ? (
                        <span className="w-6 h-6 border-2 border-blue-default border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                          <span className="text-xs text-gray-500 font-semibold">Click to upload cover image</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                    e.target.value = "";
                  }}
                />
              </div>

              <div className="border-t border-gray-200 pt-5 flex items-center justify-end gap-3">
                <button type="button" onClick={closeModal} className="bg-transparent hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg text-xs cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="bg-blue-default hover:bg-blue-bright text-white font-semibold py-2 px-5 rounded-lg text-xs cursor-pointer disabled:opacity-50 disabled:pointer-events-none transition-colors shadow"
                >
                  {isSubmitting ? "Saving…" : editingGuide ? "Save Changes" : "Add Guide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
