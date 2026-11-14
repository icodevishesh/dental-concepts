import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  alternates: {
    canonical: "/privacy-policy",
  },
  title: "Privacy Policy | Dental Concepts San Francisco",
  description:
    "How Dental Concepts collects, uses, and protects practice and patient information, including scans, RX forms, and photos submitted with a case.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="page-head"><div className="wrap">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">Privacy policy</li></ol></nav>
          <div className="page-head-grid"><h1>Privacy policy</h1><div><p className="lead">How we collect, use, and protect the information practices and patients share with us.</p></div></div>
        </div></section>

        <section className="section flush-top"><div className="wrap post-wrap">
          <div className="post-body">
            <p className="note">Last updated: November 13, 2026</p>

            <p>Dental Concepts (“we”, “us”, “the lab”) operates dentalconceptssf.com and the dental laboratory at 244 9th Street, San Francisco, CA 94103. This policy explains what information we collect through the site and our case workflow, how we use it, and how we protect it.</p>

            <h2>Information we collect</h2>
            <p><strong>Practice and contact information.</strong> When you submit the contact form, request an account, or send a case, we collect details such as your name, practice name, email address, and phone number.</p>
            <p><strong>Case and patient information.</strong> When you upload or send a case, we collect what the case requires to be made correctly: patient identifiers or initials, intraoral scans or impressions, completed RX forms, shade photographs, and any notes you provide. We ask that you use patient initials rather than a full name wherever possible, but scans, photos, and RX forms may still contain information that identifies a patient or relates to their care. We treat this information as confidential patient information.</p>
            <p><strong>Website usage.</strong> Like most sites, we use Google Tag Manager to understand how the site is used (pages visited, general location, device type). This data is aggregated and isn’t used to identify an individual patient.</p>

            <h2>How we use this information</h2>
            <p>We use practice and case information to produce and ship the restoration you’ve prescribed, communicate with you about a case, process new doctor accounts, and respond to inquiries. We use website usage data to maintain and improve the site. We do not use patient scans, photos, or RX forms for marketing, and we do not sell any information we collect.</p>

            <h2>How we handle patient information</h2>
            <p>Scans, RX forms, and photographs you submit are stored on our servers and are accessible only to the lab staff working on that case. We keep this material for as long as needed to produce the case, support any warranty on the finished restoration, and meet our recordkeeping obligations, and we delete it on request once it’s no longer needed. If your practice requires a signed Business Associate Agreement or has specific requirements for handling protected health information, contact us before sending a case so we can confirm our current arrangement meets your needs.</p>

            <h2>Sharing and disclosure</h2>
            <p>We don’t share patient or practice information with third parties except: the shipping carrier used to send or return a case, service providers who host our site or systems under confidentiality obligations, or where required by law. We don’t share case records with other dental practices or sell them to anyone.</p>

            <h2>Data retention</h2>
            <p>We keep case files and related records for as long as reasonably needed for production, quality follow-up, and the one-year restoration warranty described on our service pages, and as required by applicable recordkeeping rules. You can ask us to delete records tied to a specific case once it’s complete; contact us and we’ll confirm what we can remove.</p>

            <h2>Your choices</h2>
            <p>You can ask us what information we hold about your practice or a specific case, request a correction, or ask us to delete records that are no longer needed. Email <a href="mailto:accounts@dentalconceptssf.com">accounts@dentalconceptssf.com</a> with your request.</p>

            <h2>Changes to this policy</h2>
            <p>We may update this policy as our practices change. We’ll post the revised version here with a new “last updated” date.</p>

            <h2>Contact us</h2>
            <p>Questions about this policy or how we handle your information can go to <a href="mailto:accounts@dentalconceptssf.com">accounts@dentalconceptssf.com</a> or <a href="tel:+18007005227">1-800-700-LABS</a>.</p>
          </div>
        </div></section>

        <section className="visit"><div className="wrap visit-grid">
          <div className="visit-lead"><h2>Have a question about a case or your data?</h2><p>Talk to the lab team directly.</p><a className="button button-light" href="/contact">Contact the lab</a></div></div></section>
      </main>
      <Footer />
    </>
  );
}
