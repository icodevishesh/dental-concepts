import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Events | Dental Concepts",
  description: "Events from the Dental Concepts dental laboratory in San Francisco.",
  robots: "noindex,follow,max-image-preview:large",
};

export default function EventsPage() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="page-head"><div className="wrap"><nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">Events</li></ol></nav><div className="page-head-grid"><h1>Events</h1><div><p className="lead">Open days, lunch-and-learns, and other events at the lab.</p></div></div></div></section>
        <section className="section flush-top"><div className="wrap">
          <div className="empty-state"><h2>No events are scheduled right now</h2><p>When we have a date to share, it will be listed here. To arrange a visit to the lab or a custom shade appointment, get in touch.</p><a className="button" href="/contact">Contact the lab</a></div>
        </div></section>
        <section className="visit"><div className="wrap visit-grid">
          <div className="visit-lead"><h2>Have a case in mind?</h2><p>Talk it through with the lab before you send anything.</p><a className="button button-light" href="/send-case">Contact the lab about a case</a></div></div></section>
      </main>
      <Footer />
    </>
  );
}
