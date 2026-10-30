"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { Edit2, Trash2, Plus, X, Upload, ImageIcon, ChevronRight } from "lucide-react";

/* ─── Templates ─────────────────────────────────────────────────────────── */

const TEMPLATES = {
  standard: {
    id: "standard",
    name: "Standard Article",
    tagline: "General clinical or educational piece",
    icon: "📝",
    preview: "Introduction → Core Mechanism → Clinical Practice → Conclusion",
    html: `<h2 id="introduction">Introduction</h2>
<p>Provide a detailed introduction here. Explain the key topic, clinical significance, or overall theme of this post.</p>

<h2 id="core-mechanism">Section 1: The Core Mechanism</h2>
<p>Discuss the technical details, clinical procedures, or workflow parameters. Use formatting, bold text, or lists to structure the content.</p>

<h2 id="clinical-practice-integration">Section 2: Clinical Practice Integration</h2>
<p>Provide recommendations for integrating this process or technology into a dental practice. Explain benefits for the chairside assistant, dentist, and laboratory technicians.</p>

<blockquote>"Insert a memorable key quote or technician takeaway statement here to break up the text."</blockquote>

<h2 id="conclusion">Conclusion</h2>
<p>Wrap up the article with summary thoughts and a call-to-action or final clinical recommendation.</p>`,
  },
  caseStudy: {
    id: "caseStudy",
    name: "Clinical Case Study",
    tagline: "Step-by-step treatment case walkthrough",
    icon: "🦷",
    preview: "Patient Presentation → Clinical Protocol → Lab Fabrication → Outcome",
    html: `<h2 id="patient-presentation">Patient Presentation</h2>
<p>Describe the patient's initial condition, aesthetic or functional complaints, prep details, and the treatment planning decisions.</p>

<h2 id="clinical-protocol">Clinical Protocol</h2>
<p>Step-by-step description of the clinical phases: diagnostic scanning, tissue retraction, material selection criteria, prep designs, and scanning technique.</p>

<h2 id="laboratory-fabrication">Laboratory Fabrication</h2>
<p>How the lab processed the case. Detail the CAD/CAM workflow, materials utilized (e.g., monolithic zirconia grade, sinter parameters), and final glaze/stain detailing.</p>

<h2 id="restorative-outcome">Restorative Outcome</h2>
<p>Describe the final crown delivery, insertion protocol, occlusal verification, and final patient/dentist satisfaction results.</p>`,
  },
  technicalReview: {
    id: "technicalReview",
    name: "Technical Review",
    tagline: "In-depth material or technology analysis",
    icon: "🔬",
    preview: "Overview & Composition → Indications → Practical Tips → Lab Verdict",
    html: `<h2 id="overview-and-composition">Overview &amp; Composition</h2>
<p>Introduce the material or technology being reviewed, including its key technical composition, mechanical strength (MPa), and aesthetic properties.</p>

<h2 id="clinical-indications">Clinical Indications</h2>
<p>List exactly where this material/technology succeeds and where it should not be utilized.</p>

<h2 id="practical-tips">Practical Tips for Success</h2>
<ul>
  <li>First technical tip or scanning guideline.</li>
  <li>Second handling, bonding, or preparation guideline.</li>
  <li>Third finishing and maintenance protocol.</li>
</ul>

<h2 id="lab-verdict">Lab Verdict</h2>
<p>Provide our lab's direct feedback and overall evaluation of how this affects dental workflows.</p>`,
  },
} as const;

type TemplateId = keyof typeof TEMPLATES;

/* ─── Schema (matches the production `blogs` collection fields) ────────── */

const CATEGORIES = ["Working with the lab", "Custom shades", "Crowns & veneers"] as const;

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(CATEGORIES),
  coverImage: z.string(),
  coverImageAlt: z.string(),
  readTime: z.string().min(1, "Read time is required"),
  publishedAt: z.string().min(1, "Publish date is required"),
  body: z.string().min(1, "Content is required"),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

interface ArticleResource {
  _id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  coverImage: string;
  coverImageAlt: string;
  readTime: string;
  publishedAt: string;
  body: string;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticleResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleResource | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [step, setStep] = useState<"pick-template" | "edit-article">("pick-template");
  const [chosenTemplate, setChosenTemplate] = useState<TemplateId | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
  });

  const watchedImageUrl = watch("coverImage");

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/articles");
      if (!res.ok) throw new Error("Failed to fetch articles");
      setArticles(await res.json());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error loading articles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
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
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const openAddModal = () => {
    setEditingArticle(null);
    setStep("pick-template");
    setChosenTemplate(null);
    setImagePreview("");
    reset({
      title: "",
      description: "",
      category: "Working with the lab",
      coverImage: "",
      coverImageAlt: "",
      readTime: "3 min read",
      publishedAt: new Date().toISOString().slice(0, 10),
      body: "",
    });
    setIsModalOpen(true);
  };

  const selectTemplate = (id: TemplateId) => {
    setChosenTemplate(id);
    setValue("body", TEMPLATES[id].html);
    setStep("edit-article");
  };

  const openEditModal = (article: ArticleResource) => {
    setEditingArticle(article);
    setStep("edit-article");
    setChosenTemplate(null);
    setImagePreview(article.coverImage || "");
    reset({
      title: article.title,
      description: article.description,
      category: article.category as ArticleFormValues["category"],
      coverImage: article.coverImage || "",
      coverImageAlt: article.coverImageAlt || "",
      readTime: article.readTime,
      publishedAt: article.publishedAt,
      body: article.body,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStep("pick-template");
    setChosenTemplate(null);
    setImagePreview("");
  };

  const onSubmit = async (values: ArticleFormValues) => {
    setIsSubmitting(true);
    try {
      const url = editingArticle ? `/api/admin/articles/${editingArticle._id}` : "/api/admin/articles";
      const method = editingArticle ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save article");
      toast.success(editingArticle ? "Article updated" : "Article created");
      closeModal();
      fetchArticles();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving article");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      toast.success("Article deleted");
      fetchArticles();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error deleting article");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Manage Blog Articles</h2>
          <p className="text-xs text-gray-500">
            Create, edit, or delete articles and clinical insights published on the website.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-default hover:bg-blue-bright text-white font-semibold py-2 px-4 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          Write Article
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-3 border-blue-default border-t-transparent rounded-full animate-spin" />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-semibold">
          No articles yet. Click &quot;Write Article&quot; to create your first post.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm text-gray-700">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Article Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Published</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.map((art) => (
                <tr key={art._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="flex gap-3 items-start">
                      {art.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={art.coverImage}
                          alt={art.title}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0 mt-0.5"
                        />
                      )}
                      <div>
                        <div className="font-semibold text-gray-900 leading-tight">{art.title}</div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">{art.description}</div>
                        <div className="text-[10px] text-blue-glow font-semibold mt-1">/{art.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-gray-100 border border-gray-200 rounded-full px-2.5 py-0.5 text-xs text-gray-700 font-medium">
                      {art.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-400">{art.publishedAt}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(art)}
                        className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 border-none cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(art._id)}
                        className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border-none cursor-pointer"
                        title="Delete"
                      >
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
          <div
            className="bg-white border border-gray-200 rounded-2xl w-full overflow-hidden shadow-2xl relative flex flex-col"
            style={{ maxWidth: step === "pick-template" ? "680px" : "760px", maxHeight: "95vh" }}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                {step === "edit-article" && !editingArticle && (
                  <button
                    onClick={() => setStep("pick-template")}
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 border-none cursor-pointer"
                  >
                    ←
                  </button>
                )}
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {editingArticle
                      ? "Edit Article"
                      : step === "pick-template"
                      ? "Choose a Template"
                      : `New Article · ${chosenTemplate ? TEMPLATES[chosenTemplate].name : ""}`}
                  </h3>
                  {step === "pick-template" && (
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Every article starts from a predefined structure.
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 border-none cursor-pointer flex items-center justify-center text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {step === "pick-template" && (
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(Object.values(TEMPLATES) as (typeof TEMPLATES)[TemplateId][]).map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => selectTemplate(tpl.id as TemplateId)}
                    className="text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-blue-default/50 rounded-xl p-5 transition-all group cursor-pointer flex flex-col gap-3"
                  >
                    <span className="text-3xl">{tpl.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-blue-glow transition-colors">
                        {tpl.name}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1 leading-relaxed">{tpl.tagline}</div>
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono leading-relaxed border-t border-gray-200 pt-3 mt-auto">
                      {tpl.preview}
                    </div>
                    <div className="flex items-center gap-1 text-blue-glow text-[11px] font-semibold mt-1">
                      Use this template <ChevronRight className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === "edit-article" && (
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-4 flex-1">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Monolithic Zirconia in 2026…"
                    {...register("title")}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none"
                  />
                  {errors.title && <span className="text-red-400 text-xs mt-1 block">{errors.title.message}</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      {...register("category")}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:border-blue-default outline-none"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Published date
                    </label>
                    <input
                      type="date"
                      {...register("publishedAt")}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none"
                    />
                    {errors.publishedAt && (
                      <span className="text-red-400 text-xs mt-1 block">{errors.publishedAt.message}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Read time
                    </label>
                    <input
                      type="text"
                      placeholder="3 min read"
                      {...register("readTime")}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none"
                    />
                    {errors.readTime && (
                      <span className="text-red-400 text-xs mt-1 block">{errors.readTime.message}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Brief Description
                  </label>
                  <input
                    type="text"
                    placeholder="Short summary shown in article cards…"
                    {...register("description")}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none"
                  />
                  {errors.description && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.description.message}</span>
                  )}
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
                      <div className="relative h-32">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imagePreview || watchedImageUrl} alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                            <Upload className="w-3.5 h-3.5" /> Replace image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 gap-2">
                        {isUploading ? (
                          <>
                            <span className="w-6 h-6 border-2 border-blue-default border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs text-blue-glow font-semibold">Uploading to Cloudinary…</span>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-7 h-7 text-gray-400" />
                            <span className="text-xs text-gray-500 font-semibold">Click to upload cover image</span>
                            <span className="text-[10px] text-gray-400">PNG, JPG, WEBP · Max 10MB</span>
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
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 mt-3">
                    Cover image alt text
                  </label>
                  <input
                    type="text"
                    placeholder="Describe the image for accessibility"
                    {...register("coverImageAlt")}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-gray-900 text-sm focus:border-blue-default outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Article Content <span className="text-gray-400 normal-case font-normal">(HTML supported)</span>
                    </label>
                    {chosenTemplate && (
                      <span className="text-[10px] text-blue-glow/70 font-semibold">
                        {TEMPLATES[chosenTemplate].name} template
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={12}
                    placeholder="Your article HTML content…"
                    {...register("body")}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-900 text-sm focus:border-blue-default outline-none resize-y font-mono"
                  />
                  {errors.body && <span className="text-red-400 text-xs mt-1 block">{errors.body.message}</span>}
                </div>

                <div className="border-t border-gray-200 pt-5 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-transparent hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="bg-blue-default hover:bg-blue-bright text-white font-semibold py-2 px-5 rounded-lg text-xs cursor-pointer disabled:opacity-50 disabled:pointer-events-none transition-colors shadow"
                  >
                    {isSubmitting ? "Saving…" : editingArticle ? "Save Changes" : "Publish Article"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
