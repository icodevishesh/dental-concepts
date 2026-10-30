import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Track a Case | Dental Concepts San Francisco",
  description:
    "Ask Dental Concepts for the current status of a dental lab case, and see how a case moves from receipt to shipping.",
};

export default function TrackCasePage() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="page-head"><div className="wrap"><nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li>Quick links</li><li aria-current="page">Track case</li></ol></nav>
          <div className="page-head-grid"><h1>Track a case</h1><div><p className="lead">Ask the lab where your case is. The team replies with its current stage by email or phone during business hours.</p></div></div>
        </div></section>
        <section className="section tool-section"><div className="wrap tool-grid">
          <div className="tool-card"><span className="eyebrow">Status request</span><h2>Find my case</h2><p>Give us the case reference and practice details. This opens an email draft to the lab for you to review and send.</p>
            <form className="inquiry-form tool-form" data-mailto="accounts@dentalconceptssf.com" data-subject="Case status request" data-subject-field="Case reference" id="track-form" noValidate>
              <div className="form-row">
                <label htmlFor="tc-ref">Case reference (RX or case number) <span aria-hidden="true">*</span><input id="tc-ref" name="Case reference" type="text" required /></label>
                <label htmlFor="tc-sent">Date the case was sent<input id="tc-sent" name="Date sent" type="date" /></label>
              </div>
              <div className="form-row">
                <label htmlFor="tc-doctor">Doctor name <span aria-hidden="true">*</span><input id="tc-doctor" name="Doctor" type="text" required autoComplete="name" /></label>
                <label htmlFor="tc-practice">Practice name <span aria-hidden="true">*</span><input id="tc-practice" name="Practice" type="text" required autoComplete="organization" /></label>
              </div>
              <div className="form-row">
                <label htmlFor="tc-email">Practice email <span aria-hidden="true">*</span><input id="tc-email" name="Email" type="email" required autoComplete="email" /></label>
                <label htmlFor="tc-phone">Phone<input id="tc-phone" name="Phone" type="tel" autoComplete="tel" /></label>
              </div>
              <div className="form-row">
                <label htmlFor="tc-due">Seat date, if booked<input id="tc-due" name="Seat date" type="date" /></label>
                <label htmlFor="tc-reply">Reply by
                  <select id="tc-reply" name="Reply by">
                    <option>Email</option>
                    <option>Phone</option>
                  </select>
                </label>
              </div>
              <label htmlFor="tc-notes">Anything else the lab should know<textarea id="tc-notes" name="Notes" rows={3}></textarea></label>
              <p className="form-privacy">Please do not include patient names or health details. Use your RX or case reference so the lab can find the case.</p>
              <button className="button" type="submit">Prepare status request</button>
              <p className="form-status" role="status" aria-live="polite"></p>
            </form>
          </div>
          <aside className="tool-aside"><span className="eyebrow">Case journey</span><h2>How a case moves through the lab</h2>
            <ol className="stage-list">
              <li><strong>Received</strong><span>The case is unpacked, checked against the RX form and logged.</span></li>
              <li><strong>Design</strong><span>The restoration is planned, digitally or by hand, to your prescription.</span></li>
              <li><strong>Production</strong><span>The work is milled, printed, pressed or cast, then built up and stained.</span></li>
              <li><strong>Quality check</strong><span>Fit, contacts, occlusion and shade are checked before it leaves.</span></li>
              <li><strong>Shipped</strong><span>The case is packed and sent back to your practice.</span></li>
            </ol>
            <div className="tool-call"><p>Need an answer today?</p><a className="text-link" href="tel:+18007005227">Call 1-800-700-LABS</a></div></aside>
        </div></section>
        <section className="section faq" aria-labelledby="faq-heading"><div className="wrap faq-grid">
          <div className="faq-head"><span className="eyebrow">FAQ</span><h2 id="faq-heading">Frequently asked questions</h2><p>Need a specific answer? Contact the lab team directly.</p><a className="text-link" href="/contact">Talk with the lab</a></div>
          <div className="faq-list">
            <details><summary>Is there an online tracking portal?</summary><div className="faq-answer"><p>No. Case status comes directly from the lab team, by email or phone.</p></div></details>
            <details><summary>What should I include in a status request?</summary><div className="faq-answer"><p>The RX or case number, the doctor and practice name, and the date the case was sent. Please leave out patient names.</p></div></details>
            <details><summary>How long does a case usually take?</summary><div className="faq-answer"><p>Our RX form lists restorations at 10 to 15 days and implant cases at 3 to 4 weeks. Confirm timing for your case with the lab.</p></div></details>
            <details><summary>Can I change a case that is already in progress?</summary><div className="faq-answer"><p>Call the lab as soon as possible. What can change depends on the stage the case has reached.</p></div></details>
          </div></div></section>
        <section className="visit"><div className="wrap visit-grid">
          <div className="visit-lead"><h2>New doctor or case question?</h2><p>Email the lab team and ask for current case submission instructions.</p><a className="button button-light" href="mailto:accounts@dentalconceptssf.com?subject=Case%20submission%20instructions">Request case instructions</a></div></div></section>
      </main>
      <Footer />
    </>
  );
}
