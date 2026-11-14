import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  alternates: {
    canonical: "/terms",
  },
  title: "Terms of Service | Dental Concepts San Francisco",
  description:
    "The terms that apply to using dentalconceptssf.com and sending cases to the Dental Concepts dental laboratory.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="page-head"><div className="wrap">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">Terms of service</li></ol></nav>
          <div className="page-head-grid"><h1>Terms of service</h1><div><p className="lead">The terms that apply to using this site and sending cases to Dental Concepts.</p></div></div>
        </div></section>

        <section className="section flush-top"><div className="wrap post-wrap">
          <div className="post-body">
            <p className="note">Last updated: November 13, 2026</p>

            <p>These terms apply to your use of dentalconceptssf.com and to cases submitted to Dental Concepts (“we”, “us”, “the lab”), the dental laboratory at 244 9th Street, San Francisco, CA 94103. By using the site or sending us a case, you agree to these terms.</p>

            <h2>Who these terms are for</h2>
            <p>Our services are for licensed dental professionals and their practices. By submitting a case, you confirm you’re authorized to prescribe the restoration and to share the patient records included with it.</p>

            <h2>Case submission and accuracy</h2>
            <p>You’re responsible for the accuracy of the RX form, scans, impressions, and instructions you send us. We make each case to the prescription provided; if information is missing or unclear, we’ll contact you before proceeding, which may affect turnaround. Use patient initials rather than a full name wherever possible when identifying a case.</p>

            <h2>Turnaround times</h2>
            <p>Turnaround figures shown on our site and RX form are in-lab working days and are estimates, not guarantees. They don’t include weekends, holidays, or shipping time. Confirm current timing with the lab before scheduling a patient appointment.</p>

            <h2>Fees and payment</h2>
            <p>Pricing and payment terms are arranged directly with the lab and aren’t published on this site. Contact us to open an account or to confirm pricing for a case before you send it.</p>

            <h2>Warranty</h2>
            <p>If a placed final fixed restoration fails within one year of delivery, we’ll repair or replace it at no charge for materials and workmanship once it’s returned to us, provided the tooth was prepared to the manufacturer’s recommendations. Restrictions apply; contact us for specifics on a given case.</p>

            <h2>Shipping and risk of loss</h2>
            <p>We take reasonable care in packaging and shipping cases and finished restorations, but once a case is handed to a carrier, risk of loss or damage in transit is the carrier’s responsibility. Contact us right away if a shipment arrives damaged or doesn’t arrive.</p>

            <h2>Intellectual property</h2>
            <p>The text, images, and design on this site belong to Dental Concepts or our licensors, except where credited otherwise (see our <a href="/gallery/credits">photo credits</a>). You may not copy or republish site content without our permission.</p>

            <h2>Limitation of liability</h2>
            <p>To the extent permitted by law, Dental Concepts isn’t liable for indirect, incidental, or consequential damages arising from use of this site or a case we’ve produced, beyond the remedy described in the warranty above.</p>

            <h2>Governing law</h2>
            <p>These terms are governed by the laws of the State of California, without regard to its conflict-of-laws rules.</p>

            <h2>Changes to these terms</h2>
            <p>We may update these terms from time to time. We’ll post the revised version here with a new “last updated” date.</p>

            <h2>Contact us</h2>
            <p>Questions about these terms can go to <a href="mailto:accounts@dentalconceptssf.com">accounts@dentalconceptssf.com</a> or <a href="tel:+18007005227">1-800-700-LABS</a>.</p>
          </div>
        </div></section>

        <section className="visit"><div className="wrap visit-grid">
          <div className="visit-lead"><h2>Questions before you send a case?</h2><p>Talk to the lab team directly.</p><a className="button button-light" href="/contact">Contact the lab</a></div></div></section>
      </main>
      <Footer />
    </>
  );
}
