import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllBlogs, getBlogBySlug, formatDate } from "@/lib/blog";

function extractToc(html: string): { id: string; text: string }[] {
  const matches = [...html.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)];
  return matches.map((m) => ({ id: m[1], text: m[2] }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug).catch(() => null);
  if (!post) return { title: "Article | Dental Concepts" };
  return {
    title: `${post.title} | Dental Concepts`,
    description: post.description,
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug).catch(() => null);
  if (!post) return notFound();

  const isDoc = post.coverImage.includes("rx-form-preview");
  const toc = extractToc(post.body);
  const summariseQ = encodeURIComponent(
    `Summarise the Dental Concepts article "${post.title}" for a dental practice team in five bullet points.`
  );
  const otherPosts = (await getAllBlogs().catch(() => [])).filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <Header />
      <main id="main">
        <article className="post">
          <header className="page-head"><div className="wrap post-wrap">
            <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/blog">Articles</a></li><li aria-current="page">{post.title}</li></ol></nav>
            <p className="post-meta">{post.category}<span><time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time></span><span>{post.readTime}</span></p>
            <h1>{post.title}</h1>
          </div></header>
          <div className="wrap post-wrap">
            <figure className={isDoc ? "post-photo is-doc" : "post-photo"}>
              <img className={post.coverImage.startsWith("/assets/products") ? "product-img" : undefined} src={post.coverImage} width={isDoc ? 900 : 1400} height={isDoc ? 693 : 760} alt={post.coverImageAlt} fetchPriority="high" />
            </figure>
            <div className="has-toc">
              <aside className="toc" aria-label="On this page">
                <p>On this page</p>
                <ol>
                  {toc.map((t) => (
                    <li key={t.id}><a href={`#${t.id}`}>{t.text}</a></li>
                  ))}
                </ol>
                <div className="toc-ai">
                  <span>Summarise with AI</span>
                  <a href={`https://chatgpt.com/?q=${summariseQ}`} target="_blank" rel="noopener noreferrer">ChatGPT<span className="visually-hidden"> (opens in a new tab)</span></a>
                  <a href={`https://www.perplexity.ai/search?q=${summariseQ}`} target="_blank" rel="noopener noreferrer">Perplexity<span className="visually-hidden"> (opens in a new tab)</span></a>
                  <a href={`https://claude.ai/new?q=${summariseQ}`} target="_blank" rel="noopener noreferrer">Claude<span className="visually-hidden"> (opens in a new tab)</span></a>
                </div>
              </aside>
              <div className="post-body" dangerouslySetInnerHTML={{ __html: post.body }} />
            </div>
          </div>
        </article>
        <section className="section tinted"><div className="wrap">
          <div className="section-head"><span className="eyebrow">Keep reading</span><h2>More articles</h2><p><a className="text-link" href="/blog">All posts</a></p></div>
          <div className="posts">
            {otherPosts.map((p) => (
              <article className="post-card" key={p.slug}>
                <a className="post-thumb" href={`/blog/${p.slug}`} tabIndex={-1} aria-hidden="true"><img className={p.coverImage.startsWith("/assets/products") ? "product-img" : undefined} src={p.coverImage} width={640} height={440} alt="" loading="lazy" decoding="async" /></a>
                <div className="post-card-text">
                  <p className="post-meta">{p.category}<span>{formatDate(p.publishedAt)}</span></p>
                  <h2><a href={`/blog/${p.slug}`}>{p.title}</a></h2>
                  <p>{p.description}</p>
                  <a className="text-link" href={`/blog/${p.slug}`}>Read the post</a>
                </div>
              </article>
            ))}
          </div>
        </div></section>
        <section className="visit"><div className="wrap visit-grid">
          <div className="visit-lead"><h2>Have a case in mind?</h2><p>Talk it through with the lab before you send anything.</p><a className="button button-light" href="/send-case">Contact the lab about a case</a></div>
        </div></section>
      </main>
      <Footer />
    </>
  );
}
