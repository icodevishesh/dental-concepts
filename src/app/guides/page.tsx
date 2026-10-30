import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Guides | Dental Concepts",
  description:
    "Practical guides from the Dental Concepts lab: completing the RX form, custom shade appointments, and crown material options.",
};

export default function GuidesPage() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="page-head"><div className="wrap"><nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">Guides</li></ol></nav><div className="page-head-grid"><h1>Guides</h1><div><p className="lead">Step-by-step help for working with the lab, from filling in the prescription to booking a shade visit.</p></div></div></div></section>
        <section className="section flush-top"><div className="wrap"><div className="posts posts-3">
          <article className="post-card"><a className="post-thumb is-doc" href="/blog/how-to-complete-the-rx-form" tabIndex={-1} aria-hidden="true"><img src="/assets/rx-form-preview.webp" width={900} height={693} alt="" fetchPriority="high" /></a><div className="post-card-text"><p className="post-meta">Working with the lab<span>October 5, 2026</span></p><h2><a href="/blog/how-to-complete-the-rx-form">How to complete the Dental Concepts RX form</a></h2><p>A walk through the two-page Dental Concepts prescription form: doctor information, restoration and implant choices, shade, and what to send with the case.</p><a className="text-link" href="/blog/how-to-complete-the-rx-form">Read the guide</a></div></article>
          <article className="post-card"><a className="post-thumb" href="/blog/custom-shade-appointments" tabIndex={-1} aria-hidden="true"><img src="https://images.pexels.com/photos/6627599/pexels-photo-6627599.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=640&h=440" srcSet="https://images.pexels.com/photos/6627599/pexels-photo-6627599.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=640&h=440 640w, https://images.pexels.com/photos/6627599/pexels-photo-6627599.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1280&h=880 1280w" sizes="(max-width: 980px) 100vw, 60vw" width={640} height={440} alt="" loading="lazy" decoding="async" /></a><div className="post-card-text"><p className="post-meta">Custom shades<span>October 5, 2026</span></p><h2><a href="/blog/custom-shade-appointments">Custom shade appointments: what to expect</a></h2><p>How custom shade appointments work at Dental Concepts in San Francisco: how to book, how long the visit takes, and where to send shade photographs.</p><a className="text-link" href="/blog/custom-shade-appointments">Read the guide</a></div></article>
          <article className="post-card"><a className="post-thumb" href="/blog/crown-materials-overview" tabIndex={-1} aria-hidden="true"><img className="product-img" src="/assets/products/lithium-disilicate.webp" width={1254} height={1254} alt="" loading="lazy" decoding="async" /></a><div className="post-card-text"><p className="post-meta">Crowns &amp; veneers<span>October 5, 2026</span></p><h2><a href="/blog/crown-materials-overview">Zirconia, layered porcelain, E.max, or gold: an overview of our crown options</a></h2><p>An overview of the four crown and veneer options Dental Concepts makes: full contour zirconia, layered porcelain, lithium disilicate (E.max), and gold.</p><a className="text-link" href="/blog/crown-materials-overview">Read the guide</a></div></article>
        </div></div></section>
        <section className="visit"><div className="wrap visit-grid">
          <div className="visit-lead"><h2>Have a case in mind?</h2><p>Talk it through with the lab before you send anything.</p><a className="button button-light" href="/send-case">Contact the lab about a case</a></div></div></section>
      </main>
      <Footer />
    </>
  );
}
