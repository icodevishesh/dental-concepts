import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact Dental Concepts | San Francisco Dental Lab",
  description:
    "Contact Dental Concepts in San Francisco for new doctor accounts, shade photos, custom shade appointments, and general lab inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="contact-hero"><div className="wrap contact-hero-grid">
          <div className="contact-intro"><nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">Contact</li></ol></nav>
            <h1 className="h1-contact">Let’s talk about your practice</h1>
            <p className="lead">For new accounts, shade coordination, or service questions, send an inquiry or reach the team directly.</p>
            <ul className="contact-list">
              <li><span className="ci-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.4" /><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" /></svg></span><div><span className="ci-label">New doctor accounts</span><a href="mailto:accounts@dentalconceptssf.com">accounts@dentalconceptssf.com</a></div></li>
              <li><span className="ci-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg></span><div><span className="ci-label">Shade photographs</span><a href="mailto:photos@dentalconceptssf.com">photos@dentalconceptssf.com</a></div></li>
              <li><span className="ci-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 3h3l1.5 4.5-2 1.5a12 12 0 0 0 6 6l1.5-2L21 14.5v3a2.5 2.5 0 0 1-2.5 2.5A15.5 15.5 0 0 1 4 5.5 2.5 2.5 0 0 1 6.5 3z" /></svg></span><div><span className="ci-label">Call the lab</span><a href="tel:+18007005227">1-800-700-LABS (5227)</a><a href="tel:+14155589717">Shade appointments: (415) 558-9717</a></div></li>
              <li><span className="ci-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.4" /></svg></span><div><span className="ci-label">Visit</span><address>244 9th Street, San Francisco, CA 94103</address><span>Monday to Friday, 9 AM to 5 PM</span><a className="ci-link" href="https://maps.google.com/?q=244+9th+Street+San+Francisco+CA+94103" target="_blank" rel="noopener noreferrer">Get directions</a></div></li>
            </ul></div>
          <div className="contact-card"><h2>Send an inquiry</h2><p>Share a few details about your practice and what you would like to discuss.</p><p className="required-note"><span aria-hidden="true">*</span> Required fields</p>
            <form action="mailto:accounts@dentalconceptssf.com" className="inquiry-form" encType="text/plain" id="contact-inquiry-form" method="post">
              <div className="form-row">
                <label htmlFor="contact-first-name">First name <span aria-hidden="true">*</span><input autoComplete="given-name" id="contact-first-name" name="firstName" required /></label>
                <label htmlFor="contact-last-name">Last name <span aria-hidden="true">*</span><input autoComplete="family-name" id="contact-last-name" name="lastName" required /></label>
              </div>
              <label htmlFor="contact-practice">Practice name <span aria-hidden="true">*</span><input autoComplete="organization" id="contact-practice" name="practice" required /></label>
              <div className="form-row">
                <label htmlFor="contact-email">Practice email <span aria-hidden="true">*</span><input autoComplete="email" id="contact-email" name="email" required type="email" /></label>
                <label htmlFor="contact-phone">Phone number<input autoComplete="tel" id="contact-phone" name="phone" type="tel" /></label>
              </div>
              <div className="form-row">
                <label htmlFor="contact-topic">What would you like to discuss? <span aria-hidden="true">*</span>
                  <select id="contact-topic" name="topic" required defaultValue="">
                    <option disabled value="">Select a topic</option>
                    <option>New doctor account</option>
                    <option>Restorative services</option>
                    <option>Digital workflow or case requirements</option>
                    <option>Custom shade appointment</option>
                    <option>Shade photographs</option>
                    <option>General question</option>
                  </select>
                </label>
                <label htmlFor="contact-preference">Preferred contact method
                  <select id="contact-preference" name="preference">
                    <option>Email</option>
                    <option>Phone</option>
                  </select>
                </label>
              </div>
              <fieldset className="source-set"><legend>How did you hear about us? <span className="optional">(optional)</span></legend>
                <div className="source-opts">
                  <label><input type="radio" name="source" value="A colleague" />A colleague</label>
                  <label><input type="radio" name="source" value="Google" />Google</label>
                  <label><input type="radio" name="source" value="AI assistant" />AI assistant</label>
                  <label><input type="radio" name="source" value="Social media" />Social media</label>
                  <label><input type="radio" name="source" value="Dental event" />Dental event</label>
                  <label><input type="radio" name="source" value="Other" />Other</label>
                </div>
              </fieldset>
              <label htmlFor="contact-message">How can we help? <span aria-hidden="true">*</span><textarea aria-describedby="contact-privacy-note" id="contact-message" maxLength={2500} minLength={10} name="message" required rows={5}></textarea></label>
              <p className="form-privacy" id="contact-privacy-note">Please do not include patient names, health details, images, or other confidential clinical information. Contact the lab to confirm a secure submission method for case records.</p>
              <button className="button" type="submit">Prepare email inquiry</button>
              <p aria-live="polite" className="form-status" id="contact-form-status" role="status"></p>
              <noscript><p className="form-privacy">To contact the lab without JavaScript, email <a href="mailto:accounts@dentalconceptssf.com">accounts@dentalconceptssf.com</a> or call 1-800-700-LABS.</p></noscript>
            </form>
          </div>
        </div></section>
        <section className="map-section"><div className="wrap"><div className="map"><iframe title="Map showing Dental Concepts at 244 9th Street, San Francisco" src="https://www.google.com/maps?q=244+9th+Street,+San+Francisco,+CA+94103&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe></div>
          <p className="map-note">244 9th Street, San Francisco, CA 94103. <a href="https://maps.google.com/?q=244+9th+Street+San+Francisco+CA+94103" target="_blank" rel="noopener noreferrer">Get directions</a></p></div></section>
        <section className="section faq" aria-labelledby="faq-heading"><div className="wrap faq-grid">
          <div className="faq-head"><span className="eyebrow">FAQ</span><h2 id="faq-heading">Frequently asked questions</h2><p>Need a specific answer? Contact the lab team directly.</p><a className="text-link" href="/contact">Talk with the lab</a></div>
          <div className="faq-list">
            <details><summary>How can a new doctor open an account?</summary><div className="faq-answer"><p>Email <a href="mailto:accounts@dentalconceptssf.com">accounts@dentalconceptssf.com</a> for new doctor account inquiries.</p></div></details>
            <details><summary>Where should shade photos be sent?</summary><div className="faq-answer"><p>Email shade photographs to <a href="mailto:photos@dentalconceptssf.com">photos@dentalconceptssf.com</a>.</p></div></details>
            <details><summary>How do I book a custom shade appointment?</summary><div className="faq-answer"><p>Call <a href="tel:+14155589717">(415) 558-9717</a>. Visits take approximately 15 to 20 minutes.</p></div></details>
            <details><summary>When is the lab open?</summary><div className="faq-answer"><p>Monday through Friday, 9 AM to 5 PM, at 244 9th Street, San Francisco, CA 94103.</p></div></details>
            <details><summary>Does this website send or save my message?</summary><div className="faq-answer"><p>No. The form prepares a draft in your email application for you to review and send. This website does not store submissions.</p></div></details>
          </div></div></section>
      </main>
      <Footer />
    </>
  );
}
