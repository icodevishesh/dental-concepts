"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { Edit2, Trash2, Plus, X } from "lucide-react";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string(),
  location: z.string(),
  link: z.string(),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventResource extends EventFormValues {
  _id: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventResource | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormValues>({ resolver: zodResolver(eventSchema) });

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      setEvents(await res.json());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error loading events");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount
    fetchEvents();
  }, []);

  const openAddModal = () => {
    setEditingEvent(null);
    reset({ title: "", description: "", date: "", time: "", location: "", link: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (event: EventResource) => {
    setEditingEvent(event);
    reset(event);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const onSubmit = async (values: EventFormValues) => {
    setIsSubmitting(true);
    try {
      const url = editingEvent ? `/api/admin/events/${editingEvent._id}` : "/api/admin/events";
      const method = editingEvent ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save event");
      toast.success(editingEvent ? "Event updated" : "Event added");
      closeModal();
      fetchEvents();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      toast.success("Event deleted");
      fetchEvents();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error deleting event");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Manage Events</h2>
          <p className="text-xs text-gray-500">Add, update, or remove events shown on the Events page.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-default hover:bg-blue-bright text-white font-semibold py-2 px-4 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-3 border-blue-default border-t-transparent rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-semibold">No events yet. Click &quot;Add Event&quot; to create one.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm text-gray-700">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((e) => (
                <tr key={e._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-gray-900 leading-tight">{e.title}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-1">{e.description}</div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-400">
                    {e.date}
                    {e.time ? ` · ${e.time}` : ""}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-400">{e.location || "—"}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(e)} className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 border-none cursor-pointer" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(e._id)} className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border-none cursor-pointer" title="Delete">
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
              <h3 className="text-base font-semibold text-gray-900">{editingEvent ? "Edit Event" : "Add Event"}</h3>
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
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Date</label>
                  <input type="date" {...register("date")} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none" />
                  {errors.date && <span className="text-red-400 text-xs mt-1 block">{errors.date.message}</span>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Time</label>
                  <input type="text" placeholder="e.g. 6:00 PM" {...register("time")} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Location</label>
                <input type="text" {...register("location")} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                <textarea rows={3} {...register("description")} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none resize-y" />
                {errors.description && <span className="text-red-400 text-xs mt-1 block">{errors.description.message}</span>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Link <span className="normal-case font-normal text-gray-400">(optional, e.g. RSVP/contact page)</span>
                </label>
                <input type="text" placeholder="/contact" {...register("link")} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none" />
              </div>

              <div className="border-t border-gray-200 pt-5 flex items-center justify-end gap-3">
                <button type="button" onClick={closeModal} className="bg-transparent hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg text-xs cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-default hover:bg-blue-bright text-white font-semibold py-2 px-5 rounded-lg text-xs cursor-pointer disabled:opacity-50 disabled:pointer-events-none transition-colors shadow"
                >
                  {isSubmitting ? "Saving…" : editingEvent ? "Save Changes" : "Add Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
