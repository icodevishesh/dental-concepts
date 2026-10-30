"use client";

import { useState } from "react";

export default function AdminBlogPage() {
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Working with the lab");
  const [readTime, setReadTime] = useState("3 min read");
  const [html, setHtml] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverImageAlt, setCoverImageAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message: string }>({
    kind: "idle",
    message: "",
  });

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus({ kind: "idle", message: "" });
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload-image", {
        method: "POST",
        headers: { "x-admin-password": password },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setCoverImage(data.url);
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Upload failed" });
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "idle", message: "" });
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ title, description, category, readTime, coverImage, coverImageAlt, html }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save post");
      setStatus({ kind: "ok", message: `Published: /blog/${data.slug}` });
      setTitle("");
      setDescription("");
      setHtml("");
      setCoverImage("");
      setCoverImageAlt("");
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Failed to save post" });
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>New blog post</h1>
      <p style={{ color: "#555", marginBottom: 24 }}>
        Minimal admin form. Posts are stored in MongoDB (<code>dental-concepts.blogs</code>) and cover images
        upload to Cloudinary.
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Admin password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Description (used for SEO + card preview)
          <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Working with the lab</option>
            <option>Custom shades</option>
            <option>Crowns &amp; veneers</option>
          </select>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Read time
          <input value={readTime} onChange={(e) => setReadTime(e.target.value)} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Cover image
          <input type="file" accept="image/*" onChange={handleImageChange} disabled={uploading} />
          {uploading && <span>Uploading…</span>}
          {coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImage} alt="" style={{ maxWidth: 240, marginTop: 8, borderRadius: 8 }} />
          )}
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Cover image alt text
          <input value={coverImageAlt} onChange={(e) => setCoverImageAlt(e.target.value)} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Body (HTML — use &lt;h2 id=&quot;...&quot;&gt; for section headings so the table of contents works)
          <textarea rows={14} value={html} onChange={(e) => setHtml(e.target.value)} required style={{ fontFamily: "monospace" }} />
        </label>
        <button type="submit" style={{ padding: "10px 18px", background: "#005cdf", color: "#fff", border: 0, borderRadius: 6, cursor: "pointer" }}>
          Publish
        </button>
        {status.kind !== "idle" && (
          <p style={{ color: status.kind === "ok" ? "#0a7a2f" : "#b00020" }}>{status.message}</p>
        )}
      </form>
    </main>
  );
}
