"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { Edit2, Trash2, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";

const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  practice: z.string().min(1, "Practice is required"),
  quote: z.string().min(1, "Quote is required"),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

interface TestimonialResource extends TestimonialFormValues {
  _id: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialResource[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialResource | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TestimonialFormValues>({ resolver: zodResolver(testimonialSchema) });

  const fetchTestimonials = useCallback(async (targetPage: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/testimonials?page=${targetPage}`);
      if (!res.ok) throw new Error("Failed to fetch testimonials");
      const json = await res.json();
      setTestimonials(json.testimonials);
      setPage(json.page);
      setTotalPages(json.totalPages);
      setTotal(json.total);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error loading testimonials");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount
    fetchTestimonials(1);
  }, [fetchTestimonials]);

  const openAddModal = () => {
    setEditingTestimonial(null);
    reset({ name: "", practice: "", quote: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (testimonial: TestimonialResource) => {
    setEditingTestimonial(testimonial);
    reset(testimonial);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const onSubmit = async (values: TestimonialFormValues) => {
    setIsSubmitting(true);
    try {
      const url = editingTestimonial ? `/api/admin/testimonials/${editingTestimonial._id}` : "/api/admin/testimonials";
      const method = editingTestimonial ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save testimonial");
      toast.success(editingTestimonial ? "Testimonial updated" : "Testimonial added");
      closeModal();
      fetchTestimonials(page);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      toast.success("Testimonial deleted");
      fetchTestimonials(page);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error deleting testimonial");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="!text-lg font-semibold text-gray-900 !mb-2">Manage Testimonials</h2>
          <p className="!text-sm text-gray-500">Add, update, or remove testimonials shown on the site.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-default hover:bg-blue-bright !text-white font-semibold py-2 px-4 rounded-lg !text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-3 border-blue-default border-t-transparent rounded-full animate-spin" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-semibold">No testimonials yet. Click &quot;Add Testimonial&quot; to create one.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm text-gray-700">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Quote</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Practice</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {testimonials.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4 max-w-md">
                    <div className="text-gray-700 line-clamp-2">&ldquo;{t.quote}&rdquo;</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-gray-900 whitespace-nowrap">{t.name}</td>
                  <td className="py-3.5 px-4 text-xs text-gray-400 whitespace-nowrap">{t.practice}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(t)} className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 border-none cursor-pointer" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(t._id)} className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border-none cursor-pointer" title="Delete">
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

      {!isLoading && testimonials.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <p className="!text-xs text-gray-500">
            Page {page} of {totalPages} &middot; {total} total
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchTestimonials(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => fetchTestimonials(page + 1)}
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
              <h3 className="text-base font-semibold text-gray-900">{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</h3>
              <button onClick={closeModal} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 border-none cursor-pointer flex items-center justify-center text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Dentist&apos;s name</label>
                <input type="text" {...register("name")} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none" />
                {errors.name && <span className="text-red-400 text-xs mt-1 block">{errors.name.message}</span>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Practice name, city</label>
                <input type="text" {...register("practice")} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none" />
                {errors.practice && <span className="text-red-400 text-xs mt-1 block">{errors.practice.message}</span>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Quote</label>
                <textarea rows={4} {...register("quote")} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none resize-y" />
                {errors.quote && <span className="text-red-400 text-xs mt-1 block">{errors.quote.message}</span>}
              </div>

              <div className="border-t border-gray-200 pt-5 flex items-center justify-end gap-3">
                <button type="button" onClick={closeModal} className="bg-transparent hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg !text-xs cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-default hover:bg-blue-bright !text-white font-semibold py-2 px-5 rounded-lg !text-xs cursor-pointer disabled:opacity-50 disabled:pointer-events-none transition-colors shadow"
                >
                  {isSubmitting ? "Saving…" : editingTestimonial ? "Save Changes" : "Add Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
