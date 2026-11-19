import type { MetadataRoute } from "next";
import { getAllBlogs } from "@/lib/blog";

const SITE_URL = process.env.SITE_URL || "https://dentalconceptssf.com";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

const STATIC_ROUTES: { path: string; changeFrequency: ChangeFrequency; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/send-case", changeFrequency: "monthly", priority: 0.7 },
  { path: "/upload-case", changeFrequency: "monthly", priority: 0.6 },
  { path: "/track-case", changeFrequency: "monthly", priority: 0.5 },
  { path: "/shipping-label", changeFrequency: "monthly", priority: 0.4 },
  { path: "/rx-form", changeFrequency: "monthly", priority: 0.7 },
  { path: "/custom-abutments", changeFrequency: "monthly", priority: 0.7 },
  { path: "/custom-shades", changeFrequency: "monthly", priority: 0.7 },
  { path: "/digital-wax-up", changeFrequency: "monthly", priority: 0.7 },
  { path: "/full-arch-restorations", changeFrequency: "monthly", priority: 0.7 },
  { path: "/full-contour-zirconia-crowns", changeFrequency: "monthly", priority: 0.7 },
  { path: "/gold-crowns", changeFrequency: "monthly", priority: 0.7 },
  { path: "/implant-crowns", changeFrequency: "monthly", priority: 0.7 },
  { path: "/layered-porcelain-crowns", changeFrequency: "monthly", priority: 0.7 },
  { path: "/lithium-disilicate", changeFrequency: "monthly", priority: 0.7 },
  { path: "/model-printing", changeFrequency: "monthly", priority: 0.7 },
  { path: "/temporary-crowns-abutments", changeFrequency: "monthly", priority: 0.7 },
  { path: "/gallery", changeFrequency: "monthly", priority: 0.5 },
  { path: "/gallery/credits", changeFrequency: "yearly", priority: 0.2 },
  { path: "/guides", changeFrequency: "weekly", priority: 0.6 },
  { path: "/events", changeFrequency: "weekly", priority: 0.6 },
  { path: "/blog", changeFrequency: "daily", priority: 0.8 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
];

// Regenerated on every request, so a newly published blog post appears in
// the sitemap immediately, without waiting on a rebuild or revalidation.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const blogs = await getAllBlogs().catch(() => []);
  const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${SITE_URL}/blog/${blog.slug}`,
    lastModified: new Date(`${blog.publishedAt}T00:00:00Z`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}
