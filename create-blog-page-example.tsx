'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Edit2, Trash2, Plus, X, Eye, EyeOff, Upload, ImageIcon, ChevronRight } from 'lucide-react';

/* ─── Templates ─────────────────────────────────────────────────────────── */

const TEMPLATES = {
  standard: {
    id: 'standard',
    name: 'Standard Article',
    tagline: 'General clinical or educational piece',
    icon: '📝',
    preview: 'Introduction → Core Mechanism → Clinical Practice → Conclusion',
    html: `<h2>Introduction</h2>
<p>Provide a detailed introduction here. Explain the key topic, clinical significance, or overall theme of this post.</p>

<h2>Section 1: The Core Mechanism</h2>
<p>Discuss the technical details, clinical procedures, or workflow parameters. Use formatting, bold text, or lists to structure the content.</p>

<h2>Section 2: Clinical Practice Integration</h2>
<p>Provide recommendations for integrating this process or technology into a dental practice. Explain benefits for the chairside assistant, dentist, and laboratory technicians.</p>

<blockquote>"Insert a memorable key quote or technician takeaway statement here to break up the text."</blockquote>

<h2>Conclusion</h2>
<p>Wrap up the article with summary thoughts and a call-to-action or final clinical recommendation.</p>`,
  },
  caseStudy: {
    id: 'caseStudy',
    name: 'Clinical Case Study',
    tagline: 'Step-by-step treatment case walkthrough',
    icon: '🦷',
    preview: 'Patient Presentation → Clinical Protocol → Lab Fabrication → Outcome',
    html: `<h2>Patient Presentation</h2>
<p>Describe the patient's initial condition, aesthetic or functional complaints, prep details, and the treatment planning decisions.</p>

<h2>Clinical Protocol</h2>
<p>Step-by-step description of the clinical phases: diagnostic scanning, tissue retraction, material selection criteria, prep designs, and scanning technique.</p>

<h2>Laboratory Fabrication</h2>
<p>How Synergy 3D processed the case. Detail the CAD/CAM workflow, materials utilized (e.g., monolithic zirconia grade, sinter parameters), and final glaze/stain detailing.</p>

<h2>Restorative Outcome</h2>
<p>Describe the final crown delivery, insertion protocol, occlusal verification, and final patient/dentist satisfaction results.</p>`,
  },
  technicalReview: {
    id: 'technicalReview',
    name: 'Technical Review',
    tagline: 'In-depth material or technology analysis',
    icon: '🔬',
    preview: 'Overview & Composition → Indications → Practical Tips → Lab Verdict',
    html: `<h2>Overview &amp; Composition</h2>
<p>Introduce the material or technology being reviewed, including its key technical composition, mechanical strength (MPa), and aesthetic properties.</p>

<h2>Clinical Indications</h2>
<p>List exactly where this material/technology succeeds and where it should not be utilized.</p>

<h2>Practical Tips for Success</h2>
<ul>
  <li>First technical tip or scanning guideline.</li>
  <li>Second handling, bonding, or preparation guideline.</li>
  <li>Third finishing and maintenance protocol.</li>
</ul>

<h2>Lab Verdict</h2>
<p>Provide our lab's direct feedback and overall evaluation of how this affects dental workflows.</p>`,
  },
} as const;

type TemplateId = keyof typeof TEMPLATES;

/* ─── Schema ─────────────────────────────────────────────────────────────── */

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  readDuration: z.string().min(1, 'Read duration is required'),
  writer: z.string().min(1, 'Writer is required'),
  designation: z.string().min(1, 'Designation is required'),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().optional().default(''),
  content: z.string().min(1, 'Content is required'),
  published: z.boolean().default(true),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

interface ArticleResource {
  _id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  readDuration: string;
  writer: string;
  designation: string;
  category: string;
  content: string;
  imageUrl?: string;
  published: boolean;
  createdAt: string;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticleResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleResource | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Template picker (shown before the form for new articles)
  const [step, setStep] = useState<'pick-template' | 'edit-article'>('pick-template');
  const [chosenTemplate, setChosenTemplate] = useState<TemplateId | null>(null);

  // Image upload
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema) as any,
    defaultValues: { published: true },
  });

  const watchedImageUrl = watch('imageUrl');

  /* ─── Fetch ── */
  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/articles');
      if (!res.ok) throw new Error('Failed to fetch articles');
      setArticles(await res.json());
    } catch (err: any) {
      toast.error(err.message || 'Error loading articles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchArticles(); }, []);

  /* ─── Cloudinary Upload ── */
  const handleImageUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setValue('imageUrl', data.url);
      setImagePreview(data.url);
      toast.success('Image uploaded successfully');
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  /* ─── Open modals ── */
  const openAddModal = () => {
    setEditingArticle(null);
    setStep('pick-template');
    setChosenTemplate(null);
    setImagePreview('');
    const today = new Date();
    reset({
      title: '',
      description: '',
      date: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readDuration: '6 min read',
      writer: '',
      designation: '',
      category: 'clinical',
      imageUrl: '',
      content: '',
      published: true,
    });
    setIsModalOpen(true);
  };

  const selectTemplate = (id: TemplateId) => {
    setChosenTemplate(id);
    setValue('content', TEMPLATES[id].html);
    setStep('edit-article');
  };

  const openEditModal = (article: ArticleResource) => {
    setEditingArticle(article);
    setStep('edit-article');
    setChosenTemplate(null);
    setImagePreview(article.imageUrl || '');
    setValue('title', article.title);
    setValue('description', article.description);
    setValue('date', article.date);
    setValue('readDuration', article.readDuration);
    setValue('writer', article.writer);
    setValue('designation', article.designation);
    setValue('category', article.category);
    setValue('imageUrl', article.imageUrl ?? '');
    setValue('content', article.content);
    setValue('published', article.published);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStep('pick-template');
    setChosenTemplate(null);
    setImagePreview('');
  };

  /* ─── Submit ── */
  const onSubmit = async (values: ArticleFormValues) => {
    setIsSubmitting(true);
    try {
      const url = editingArticle ? `/api/admin/articles/${editingArticle._id}` : '/api/admin/articles';
      const method = editingArticle ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save article');
      toast.success(editingArticle ? 'Article updated' : 'Article created');
      closeModal();
      fetchArticles();
    } catch (err: any) {
      toast.error(err.message || 'Error saving article');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete');
      toast.success('Article deleted');
      fetchArticles();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting article');
    }
  };

  const togglePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/articles/${id}/publish`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to toggle');
      toast.success('Publish status updated');
      fetchArticles();
    } catch (err: any) {
      toast.error(err.message || 'Error');
    }
  };

  /* ─── Render ── */
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Manage Blog Articles</h2>
          <p className="text-xs text-muted-dark">Create, edit, or delete articles and clinical insights published on the website.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-default hover:bg-blue-bright text-white font-semibold py-2 px-4 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          Write Article
        </button>
      </div>

      {/* Table */}
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
          <table className="w-full text-left border-collapse text-sm text-gray-300">
            <thead>
              <tr className="border-b border-white/10 text-white/50 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Article Details</th>
                <th className="py-3 px-4">Writer</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {articles.map(art => (
                <tr key={art._id} className="hover:bg-white/2 transition-colors">
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="flex gap-3 items-start">
                      {art.imageUrl && (
                        <img src={art.imageUrl} alt={art.title} className="w-12 h-12 rounded-lg object-cover bg-white/5 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-semibold text-white leading-tight">{art.title}</div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">{art.description}</div>
                        <div className="text-[10px] text-blue-glow font-semibold mt-1">/{art.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white/95">{art.writer}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 text-xs text-white capitalize font-medium">{art.category}</span>
                  </td>
                  {/* <td className="py-3.5 px-4">{art.views || 0}</td> */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => togglePublish(art._id)}
                      className={`inline-flex items-center gap-1 border-none bg-transparent cursor-pointer text-xs font-semibold transition-all ${art.published ? 'text-emerald-400' : 'text-gray-500'}`}
                    >
                      {art.published ? <><Eye className="w-3.5 h-3.5" /> Published</> : <><EyeOff className="w-3.5 h-3.5" /> Hidden</>}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(art)} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white border-none cursor-pointer" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(art._id)} className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border-none cursor-pointer" title="Delete">
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

      {/* ── Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[5000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy border border-white/10 rounded-2xl w-full overflow-hidden shadow-2xl relative flex flex-col"
            style={{ maxWidth: step === 'pick-template' ? '680px' : '760px', maxHeight: '95vh' }}>

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                {step === 'edit-article' && !editingArticle && (
                  <button
                    onClick={() => setStep('pick-template')}
                    className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white border-none cursor-pointer"
                  >
                    ←
                  </button>
                )}
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {editingArticle
                      ? 'Edit Article'
                      : step === 'pick-template'
                      ? 'Choose a Template'
                      : `New Article · ${chosenTemplate ? TEMPLATES[chosenTemplate].name : ''}`}
                  </h3>
                  {step === 'pick-template' && (
                    <p className="text-[11px] text-muted-dark mt-0.5">Every article starts from a predefined structure.</p>
                  )}
                </div>
              </div>
              <button onClick={closeModal} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border-none cursor-pointer flex items-center justify-center text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Step 1: Template Picker ── */}
            {step === 'pick-template' && (
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(Object.values(TEMPLATES) as typeof TEMPLATES[TemplateId][]).map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => selectTemplate(tpl.id as TemplateId)}
                    className="text-left bg-white/4 hover:bg-white/8 border border-white/10 hover:border-blue-default/50 rounded-xl p-5 transition-all group cursor-pointer flex flex-col gap-3"
                  >
                    <span className="text-3xl">{tpl.icon}</span>
                    <div>
                      <div className="font-semibold text-white text-sm leading-snug group-hover:text-blue-glow transition-colors">{tpl.name}</div>
                      <div className="text-[11px] text-muted-dark mt-1 leading-relaxed">{tpl.tagline}</div>
                    </div>
                    <div className="text-[10px] text-white/30 font-mono leading-relaxed border-t border-white/8 pt-3 mt-auto">
                      {tpl.preview}
                    </div>
                    <div className="flex items-center gap-1 text-blue-glow text-[11px] font-semibold mt-1">
                      Use this template <ChevronRight className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* ── Step 2: Article Form ── */}
            {step === 'edit-article' && (
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-4 flex-1">

                {/* Row 1: Title */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Monolithic Zirconia in 2026…"
                    {...register('title')}
                    className="w-full bg-navy-card border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm focus:border-blue-default outline-none"
                  />
                  {errors.title && <span className="text-red-400 text-xs mt-1 block">{errors.title.message}</span>}
                </div>

                {/* Row 2: Writer + Designation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Writer / Author</label>
                    <input
                      type="text"
                      placeholder="e.g. Kelli Trainor"
                      {...register('writer')}
                      className="w-full bg-navy-card border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm focus:border-blue-default outline-none"
                    />
                    {errors.writer && <span className="text-red-400 text-xs mt-1 block">{errors.writer.message}</span>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. VP of Customer Integration"
                      {...register('designation')}
                      className="w-full bg-navy-card border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm focus:border-blue-default outline-none"
                    />
                    {errors.designation && <span className="text-red-400 text-xs mt-1 block">{errors.designation.message}</span>}
                  </div>
                </div>

                {/* Row 2: Category, Date, Read Duration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Category</label>
                    <select {...register('category')} className="w-full bg-navy-card border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-default outline-none">
                      <option value="clinical">Clinical</option>
                      <option value="materials">Materials</option>
                      <option value="technology">Technology</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Date</label>
                    <input
                      type="text"
                      placeholder="May 12, 2026"
                      {...register('date')}
                      className="w-full bg-navy-card border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm focus:border-blue-default outline-none"
                    />
                    {errors.date && <span className="text-red-400 text-xs mt-1 block">{errors.date.message}</span>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Read Duration</label>
                    <input
                      type="text"
                      placeholder="6 min read"
                      {...register('readDuration')}
                      className="w-full bg-navy-card border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm focus:border-blue-default outline-none"
                    />
                    {errors.readDuration && <span className="text-red-400 text-xs mt-1 block">{errors.readDuration.message}</span>}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Brief Description</label>
                  <input
                    type="text"
                    placeholder="Short summary shown in article cards…"
                    {...register('description')}
                    className="w-full bg-navy-card border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm focus:border-blue-default outline-none"
                  />
                  {errors.description && <span className="text-red-400 text-xs mt-1 block">{errors.description.message}</span>}
                </div>

                {/* Cover Image Upload */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Cover Image <span className="normal-case font-normal text-white/25">(optional)</span></label>
                  <input type="hidden" {...register('imageUrl')} />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-full rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
                      isUploading ? 'border-blue-default/50 bg-blue-default/5' : 'border-white/15 hover:border-blue-default/50 hover:bg-white/3'
                    }`}
                  >
                    {(imagePreview || watchedImageUrl) ? (
                      <div className="relative h-32">
                        <img src={imagePreview || watchedImageUrl} alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-semibold flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" /> Replace image</span>
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
                            <ImageIcon className="w-7 h-7 text-white/25" />
                            <span className="text-xs text-white/40 font-semibold">Click to upload cover image</span>
                            <span className="text-[10px] text-white/25">PNG, JPG, WEBP · Max 10MB</span>
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
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                      e.target.value = '';
                    }}
                  />
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Article Content <span className="text-white/25 normal-case font-normal">(HTML supported)</span></label>
                    {chosenTemplate && (
                      <span className="text-[10px] text-blue-glow/70 font-semibold">{TEMPLATES[chosenTemplate].name} template</span>
                    )}
                  </div>
                  <textarea
                    rows={12}
                    placeholder="Your article HTML content…"
                    {...register('content')}
                    className="w-full bg-navy-card border border-white/10 rounded-lg px-3.5 py-2.5 text-white text-sm focus:border-blue-default outline-none resize-y font-mono"
                  />
                  {errors.content && <span className="text-red-400 text-xs mt-1 block">{errors.content.message}</span>}
                </div>

                {/* Publish toggle */}
                <div className="flex items-center gap-2 pt-1">
                  <input type="checkbox" id="published" {...register('published')} className="w-4 h-4 accent-blue-default" />
                  <label htmlFor="published" className="text-xs font-semibold text-white cursor-pointer select-none">Publish immediately</label>
                </div>

                {/* Footer buttons */}
                <div className="border-t border-white/10 pt-5 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-transparent hover:bg-white/5 border border-white/10 text-white font-semibold py-2 px-4 rounded-lg text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="bg-blue-default hover:bg-blue-bright text-white font-semibold py-2 px-5 rounded-lg text-xs cursor-pointer disabled:opacity-50 disabled:pointer-events-none transition-colors shadow"
                  >
                    {isSubmitting ? 'Saving…' : editingArticle ? 'Save Changes' : 'Publish Article'}
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
