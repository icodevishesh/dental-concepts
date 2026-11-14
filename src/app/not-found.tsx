import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page Not Found | Dental Concepts San Francisco",
  description: "The page you're looking for doesn't exist. Browse our dental lab services or get in touch with the team.",
  robots: "noindex,follow",
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="page-head"><div className="wrap">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">Page not found</li></ol></nav>
          <div className="page-head-grid"><h1>404 — We couldn’t find that page</h1><div><p className="lead">The page may have moved or no longer exists. Try one of the links below, or head back home.</p></div></div>
        </div></section>
        <section className="section flush-top"><div className="wrap">
          <div className="empty-state">
            <h2>Here’s where you might want to go</h2>
            <p>Browse our lab services, send a case, or contact the team directly.</p>
            <div className="actions">
              <Link className="button" href="/">Back to home</Link>
              <Link className="text-link" href="/services">Browse lab services</Link>
              <Link className="text-link" href="/contact">Contact the lab</Link>
            </div>
          </div>
        </div></section>
      </main>
      <Footer />
    </>
  );
}
