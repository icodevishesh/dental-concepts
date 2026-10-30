import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllGuides } from "@/lib/guides";
import { formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Guides | Dental Concepts",
  description:
    "Practical guides from the Dental Concepts lab: completing the RX form, custom shade appointments, and crown material options.",
};

export const dynamic = "force-dynamic";

export default async function GuidesPage() {
  const guides = await getAllGuides().catch(() => []);

  return (
    <>
      <Header />
      <main id="main">
        <section className="page-head"><div className="wrap"><nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">Guides</li></ol></nav><div className="page-head-grid"><h1>Guides</h1><div><p className="lead">Step-by-step help for working with the lab, from filling in the prescription to booking a shade visit.</p></div></div></div></section>
        <section className="section flush-top"><div className="wrap">
          {guides.length === 0 ? (
            <div className="empty-state"><h2>No guides are published yet</h2><p>When the lab adds a guide, it will be listed here.</p><a className="button" href="/contact">Contact the lab</a></div>
          ) : (
            <div className="posts posts-3">
              {guides.map((guide) => (
                <article className="post-card" key={guide._id?.toString()}>
                  {guide.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <a className="post-thumb" href={guide.href} tabIndex={-1} aria-hidden="true"><img src={guide.coverImage} width={640} height={440} alt="" loading="lazy" decoding="async" /></a>
                  )}
                  <div className="post-card-text">
                    <p className="post-meta">{guide.category}<span>{formatDate(guide.publishedAt)}</span></p>
                    <h2><a href={guide.href}>{guide.title}</a></h2>
                    <p>{guide.description}</p>
                    <a className="text-link" href={guide.href}>Read the guide</a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div></section>
        <section className="visit"><div className="wrap visit-grid">
          <div className="visit-lead"><h2>Have a case in mind?</h2><p>Talk it through with the lab before you send anything.</p><a className="button button-light" href="/send-case">Contact the lab about a case</a></div></div></section>
      </main>
      <Footer />
    </>
  );
}
