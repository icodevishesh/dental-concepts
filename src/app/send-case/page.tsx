import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Send a Case | Dental Concepts San Francisco",
  description:
    "Prepare a dental laboratory case with the Dental Concepts prescription form and contact the lab for its current secure submission instructions.",
};

export default function SendCasePage() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="page-head"><div className="wrap"><nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">Send a case</li></ol></nav>
          <div className="page-head-grid"><h1>Send a case</h1><div><p className="lead">Start with our downloadable prescription form, then contact the lab to confirm current shipping or secure digital submission instructions.</p></div></div>
        </div></section>
        <section className="section flush-top"><div className="wrap start-grid">
          <div className="start-copy"><ol className="steps">
            <li><h3>Choose the restoration</h3><p>Review the available crown, veneer, implant, <span className="nb">All-on-X</span>, and digital services with your team.</p><a className="text-link" href="/services">Browse lab services</a></li>
            <li><h3>Complete the RX</h3><p>Download and complete the laboratory prescription form with case instructions.</p><a className="text-link" href="/assets/digital-rx.pdf" download>Download the RX form</a></li>
            <li><h3>Confirm how to send it</h3><p>Call the lab for accepted shipping or secure file transfer instructions before sending records.</p><a className="text-link" href="tel:+18007005227">Call 1-800-700-LABS</a></li>
          </ol>
            <div className="callout"><h3>Before you send patient records</h3><p>We do not have a case portal. Do not email patient records or scans until the laboratory confirms an approved secure channel. The email button on this page opens a message draft and sends nothing by itself.</p></div></div>
          <a className="rx-card" href="/assets/digital-rx.pdf" download><img src="/assets/rx-form-preview.webp" width={900} height={693} alt="First page of the Dental Concepts RX form" fetchPriority="high" /><span><strong>Download the RX form</strong><small>PDF, two pages</small></span></a>
        </div></section>
        <section className="section faq" aria-labelledby="faq-heading"><div className="wrap faq-grid">
          <div className="faq-head"><span className="eyebrow">FAQ</span><h2 id="faq-heading">Frequently asked questions</h2><p>Need a specific answer? Contact the lab team directly.</p><a className="text-link" href="/contact">Talk with the lab</a></div>
          <div className="faq-list">
            <details><summary>Does Dental Concepts have an online case upload portal?</summary><div className="faq-answer"><p>No. Contact the lab to confirm the current accepted submission method.</p></div></details>
            <details><summary>What should I prepare before contacting the lab?</summary><div className="faq-answer"><p>Have the RX form and case instructions ready, then ask the lab which records and submission method it currently accepts.</p></div></details>
            <details><summary>Where can I download the RX form?</summary><div className="faq-answer"><p>The two-page prescription form is on the <a href="/rx">RX form page</a>.</p></div></details>
          </div></div></section>
        <section className="visit"><div className="wrap visit-grid">
          <div className="visit-lead"><h2>New doctor or case question?</h2><p>Email the lab team and ask for current case submission instructions.</p><a className="button button-light" href="mailto:accounts@dentalconceptssf.com?subject=Case%20submission%20instructions">Request case instructions</a></div></div></section>
      </main>
      <Footer />
    </>
  );
}
