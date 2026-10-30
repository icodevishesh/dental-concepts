import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dental Lab RX Form & Prescription | Dental Concepts",
  description:
    "Download the Dental Concepts laboratory prescription form. Price list information is coming soon; contact the lab for current pricing.",
};

export default function RxPage() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="page-head"><div className="wrap"><nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">RX form</li></ol></nav>
          <div className="page-head-grid"><h1>RX form and lab pricing</h1><div><p className="lead">Download the current laboratory prescription form. Complete it with the case details before following the lab’s submission instructions.</p></div></div>
        </div></section>
        <section className="section flush-top"><div className="wrap rx-page">
          <a className="rx-sheet-preview" href="/assets/digital-rx.pdf" download><img src="/assets/rx-form-preview.webp" width={900} height={693} alt="First page of the Dental Concepts RX form" fetchPriority="high" /></a>
          <div className="rx-page-copy"><span className="eyebrow">Download</span><h2>Dental Concepts prescription form</h2><p>The two-page form is provided as a PDF. Download and complete it for your case.</p>
            <a className="button" href="/assets/digital-rx.pdf" download>Download the RX form (PDF)</a>
            <div className="callout"><h3>Price list</h3><p>Our price list is coming soon. Contact Dental Concepts for current pricing.</p></div>
            <p>Need case submission instructions? <a className="text-link" href="/send-case">See how to start a case</a></p></div>
        </div></section>
        <section className="section faq" aria-labelledby="faq-heading"><div className="wrap faq-grid">
          <div className="faq-head"><span className="eyebrow">FAQ</span><h2 id="faq-heading">Frequently asked questions</h2><p>Need a specific answer? Contact the lab team directly.</p><a className="text-link" href="/contact">Talk with the lab</a></div>
          <div className="faq-list">
            <details><summary>What is the RX form for?</summary><div className="faq-answer"><p>Use the laboratory prescription form to record instructions for a Dental Concepts case.</p></div></details>
            <details><summary>Is a price list available?</summary><div className="faq-answer"><p>The price list is coming soon. Contact the lab for current pricing information.</p></div></details>
            <details><summary>How do I send a completed form?</summary><div className="faq-answer"><p>Contact the laboratory to confirm the current accepted submission route before sharing patient information.</p></div></details>
          </div></div></section>
        <section className="visit"><div className="wrap visit-grid">
          <div className="visit-lead"><h2>Have a case in mind?</h2><p>Talk it through with the lab before you send anything.</p><a className="button button-light" href="/send-case">Contact the lab about a case</a></div></div></section>
      </main>
      <Footer />
    </>
  );
}
