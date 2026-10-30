import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllBlogs, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Articles | Dental Concepts",
  description:
    "Practical notes from the Dental Concepts lab in San Francisco on prescriptions, shade matching, and restorations.",
};

export const dynamic = "force-dynamic";

export default async function BlogIndex() {
  let posts = await getAllBlogs().catch(() => []);
  if (posts.length === 0) {
    // Mongo not configured/seeded yet — fail soft with an empty state rather than crashing the page.
    posts = [];
  }
  const [lead, ...rest] = posts;

  return (
    <>
      <Header />
      <main id="main">
        <section className="page-head"><div className="wrap">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li aria-current="page">Articles</li></ol></nav>
          <div className="page-head-grid"><h1>Articles</h1><div><p className="lead">Practical notes from the lab on prescriptions, shade, and the restorations we make.</p></div></div>
        </div></section>
        <section className="section flush-top"><div className="wrap">
          <div className="blog-tools">
            <nav className="blog-tabs" aria-label="Article categories">
              <Link href="/blog" aria-current="true">All</Link>
              <Link href="/blog?category=working-with-the-lab">Working with the lab</Link>
              <Link href="/blog?category=custom-shades">Custom shades</Link>
              <Link href="/blog?category=crowns-and-veneers">Crowns &amp; veneers</Link>
            </nav>
            <form className="blog-search" action="/blog" method="get" role="search">
              <label className="visually-hidden" htmlFor="blog-q">Search articles</label>
              <input id="blog-q" name="query" type="search" placeholder="Search articles" autoComplete="off" />
              <button type="submit">Search</button>
            </form>
          </div>
          <p className="blog-result" role="status" hidden></p>
          <div className="blog-empty" hidden><h2>No matching results</h2><p>Try another word, or browse every article.</p><Link className="button" href="/blog">Back to all articles</Link></div>
        </div>
          {posts.length === 0 ? (
            <div className="wrap"><p className="note">No articles published yet.</p></div>
          ) : (
            <div className="wrap posts blog-index">
              {lead && (
                <article className="post-card is-lead">
                  <Link className="post-thumb is-doc" href={`/blog/${lead.slug}`} tabIndex={-1} aria-hidden="true"><img src={lead.coverImage} width={900} height={693} alt="" /></Link>
                  <div className="post-card-text">
                    <p className="post-meta">{lead.category}<span>{formatDate(lead.publishedAt)}</span></p>
                    <h2><Link href={`/blog/${lead.slug}`}>{lead.title}</Link></h2>
                    <p>{lead.description}</p>
                    <Link className="text-link" href={`/blog/${lead.slug}`}>Read the post</Link>
                  </div>
                </article>
              )}
              {rest.map((post) => (
                <article className="post-card" key={post.slug}>
                  <Link className="post-thumb" href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true"><img className={post.coverImage.startsWith("/assets/products") ? "product-img" : undefined} src={post.coverImage} width={640} height={440} alt="" loading="lazy" decoding="async" /></Link>
                  <div className="post-card-text">
                    <p className="post-meta">{post.category}<span>{formatDate(post.publishedAt)}</span></p>
                      <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                    <p>{post.description}</p>
                    <Link className="text-link" href={`/blog/${post.slug}`}>Read the post</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
        <section className="visit"><div className="wrap visit-grid">
          <div className="visit-lead"><h2>Have a case in mind?</h2><p>Talk it through with the lab before you send anything.</p><Link className="button button-light" href="/send-case">Contact the lab about a case</Link></div>
        </div></section>
      </main>
      <Footer />
    </>
  );
}
