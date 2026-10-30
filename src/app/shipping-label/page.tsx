import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getActiveRxFormUrl } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Shipping Label | Dental Concepts San Francisco",
  description:
    "Request a shipping label from Dental Concepts for a case going to the lab or work coming back, with packing guidance for dental cases.",
};

export const dynamic = "force-dynamic";

export default async function ShippingLabelPage() {
  const rxFormUrl = await getActiveRxFormUrl().catch(() => "/assets/digital-rx.pdf");
  return (
    <>
      <Header />
      <main id="main">
        <section className="page-head"><div className="wrap"><nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li>Quick links</li><li aria-current="page">Shipping label</li></ol></nav>
          <div className="page-head-grid"><h1>Shipping label</h1><div><p className="lead">Request a shipping label for a case going to the lab, or for work coming back. The lab replies by email with the label and carrier details.</p></div></div>
        </div></section>
        <section className="section tool-section"><div className="wrap tool-grid">
          <div className="tool-card"><span className="eyebrow">Label request</span><h2>Request a label</h2><p>Tell us where to collect from and how many boxes are going. This opens an email draft to the lab for you to review and send.</p>
            <form className="inquiry-form tool-form" data-mailto="accounts@dentalconceptssf.com" data-subject="Shipping label request" id="ship-form" noValidate>
              <fieldset className="choice-set"><legend>What do you need? <span aria-hidden="true">*</span></legend>
                <label className="choice"><input type="radio" name="Shipment" value="New shipment: case going to the lab" defaultChecked /><span><strong>New shipment</strong><small>A new case going from your practice to the lab.</small></span></label>
                <label className="choice"><input type="radio" name="Shipment" value="Return shipment: work coming back to the lab" /><span><strong>Return shipment</strong><small>Work coming back to the lab for an adjustment or remake.</small></span></label>
              </fieldset>
              <div className="form-row">
                <label htmlFor="sl-doctor">Doctor name <span aria-hidden="true">*</span><input id="sl-doctor" name="Doctor" type="text" required autoComplete="name" /></label>
                <label htmlFor="sl-practice">Practice name <span aria-hidden="true">*</span><input id="sl-practice" name="Practice" type="text" required autoComplete="organization" /></label>
              </div>
              <div className="form-row">
                <label htmlFor="sl-email">Practice email <span aria-hidden="true">*</span><input id="sl-email" name="Email" type="email" required autoComplete="email" /></label>
                <label htmlFor="sl-phone">Phone <span aria-hidden="true">*</span><input id="sl-phone" name="Phone" type="tel" required autoComplete="tel" /></label>
              </div>
              <label htmlFor="sl-address">Pickup address <span aria-hidden="true">*</span><textarea id="sl-address" name="Pickup address" rows={3} required autoComplete="street-address"></textarea></label>
              <div className="form-row">
                <label htmlFor="sl-boxes">Number of boxes
                  <select id="sl-boxes" name="Boxes">
                    <option>1</option><option>2</option><option>3</option><option>4</option><option>5 or more</option>
                  </select>
                </label>
                <label htmlFor="sl-date">Preferred pickup date<input id="sl-date" name="Pickup date" type="date" /></label>
              </div>
              <label htmlFor="sl-notes">Notes for the lab<textarea id="sl-notes" name="Notes" rows={3}></textarea></label>
              <p className="form-privacy">Please do not include patient names or health details. Use your RX or case reference so the lab can find the case.</p>
              <button className="button" type="submit">Prepare label request</button>
              <p className="form-status" role="status" aria-live="polite"></p>
            </form>
          </div>
          <aside className="tool-aside"><span className="eyebrow">Packing your case</span><h2>Before the box is sealed</h2>
            <ul className="tick-list">
              <li>Complete the <a href={rxFormUrl} download>RX form</a> and place it in the box with the case.</li>
              <li>Disinfect impressions and seal them in a bag.</li>
              <li>Wrap models and bite registrations so they cannot move.</li>
              <li>Pack one case per bag, labelled with the doctor and case reference.</li>
              <li>Keep the tracking number from your label until the case arrives.</li>
            </ul>
            <div className="tool-call"><p>Prefer to arrange it by phone?</p><a className="text-link" href="tel:+18007005227">Call 1-800-700-LABS</a></div></aside>
        </div></section>
        <section className="section faq" aria-labelledby="faq-heading"><div className="wrap faq-grid">
          <div className="faq-head"><span className="eyebrow">FAQ</span><h2 id="faq-heading">Frequently asked questions</h2><p>Need a specific answer? Contact the lab team directly.</p><a className="text-link" href="/contact">Talk with the lab</a></div>
          <div className="faq-list">
            <details><summary>Who pays for the shipping label?</summary><div className="faq-answer"><p>Ask the lab when you request the label. Label terms for your account are confirmed in the lab’s reply.</p></div></details>
            <details><summary>Which carrier does the lab use?</summary><div className="faq-answer"><p>The lab confirms the carrier and service when it sends your label.</p></div></details>
            <details><summary>How quickly will I receive the label?</summary><div className="faq-answer"><p>The lab replies by email during business hours, Monday to Friday, 9 AM to 5 PM.</p></div></details>
            <details><summary>Can I send a digital scan instead?</summary><div className="faq-answer"><p>Yes, if your case allows it. Contact the lab to confirm the current secure submission method for scans.</p></div></details>
          </div></div></section>
        <section className="visit"><div className="wrap visit-grid">
          <div className="visit-lead"><h2>New doctor or case question?</h2><p>Email the lab team and ask for current case submission instructions.</p><a className="button button-light" href="mailto:accounts@dentalconceptssf.com?subject=Case%20submission%20instructions">Request case instructions</a></div></div></section>
      </main>
      <Footer />
    </>
  );
}
