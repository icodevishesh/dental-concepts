import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getActiveRxFormUrl } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Upload a Case | Dental Concepts San Francisco",
  description:
    "Upload a digital case to Dental Concepts: choose the restoration, add your practice details, and upload your intraoral scan files and completed RX form.",
};

const plannerRules = {
  version: "2026-10",
  type: [
    { id: "crown", label: "Crown or veneer", q: "Which material?", options: [
      { id: "zirconia", label: "Full contour zirconia", page: "/full-contour-zirconia-crowns", rx: "Full Contour Zirconia" },
      { id: "porcelain", label: "Layered porcelain", page: "/layered-porcelain-crowns", rx: "the layered porcelain option" },
      { id: "emax", label: "Lithium disilicate (E.max)", page: "/lithium-disilicate", rx: "the E.max option" },
      { id: "gold", label: "Gold", page: "/gold-crowns", rx: "the gold option and alloy" },
    ], turnaround: "restoration" },
    { id: "implant", label: "Implant restoration", q: "Which part?", options: [
      { id: "icrown", label: "Implant crown", page: "/implant-crowns" },
      { id: "abut", label: "Custom abutment", page: "/custom-abutments" },
      { id: "both", label: "Crown and custom abutment", page: "/implant-crowns" },
    ], turnaround: "implant" },
    { id: "arch", label: "Full arch / All-on-X", q: "Which stage?", options: [
      { id: "final", label: "Final prosthesis", page: "/full-arch-restorations" },
      { id: "prov", label: "Provisional", page: "/temporary-crowns-abutments", turnaround: "confirm" },
    ], turnaround: "implant" },
    { id: "temp", label: "Temporaries", q: "On what?", options: [
      { id: "natural", label: "Natural teeth", page: "/temporary-crowns-abutments", turnaround: "restoration" },
      { id: "onimplant", label: "Implants", page: "/temporary-crowns-abutments", turnaround: "confirm" },
    ] },
    { id: "waxup", label: "Digital wax up", q: "Wax up for what?", options: [
      { id: "withresto", label: "With restorations", page: "/digital-wax-up", turnaround: "restoration" },
      { id: "only", label: "Wax up only", page: "/digital-wax-up", turnaround: "confirm" },
    ] },
  ],
  shade: [
    { id: "rx", label: "Written on the RX", hint: "Shade guide value" },
    { id: "photo", label: "Shade photographs", hint: "Emailed to the lab" },
    { id: "visit", label: "Custom shade visit", hint: "Patient visits the lab" },
  ],
  timing: [
    { id: "standard", label: "Standard turnaround" },
    { id: "sooner", label: "Sooner than listed" },
  ],
  turnaround: {
    restoration: { figure: "10 to 15 days", note: "Our RX form lists restorations at 10 to 15 days." },
    implant: { figure: "3 to 4 weeks", note: "Our RX form lists implant cases at 3 to 4 weeks." },
    confirm: { figure: "Confirm with the lab", note: "Timing for this work depends on the case and is not printed on the RX form." },
  },
};

export const dynamic = "force-dynamic";

export default async function UploadCasePage() {
  const rxFormUrl = await getActiveRxFormUrl().catch(() => "/assets/digital-rx.pdf");
  return (
    <>
      <Header />
      <main id="main" className="planner-page">
        <section className="page-head up-head"><div className="wrap">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">Upload a case</li></ol></nav>
          <div className="page-head-grid"><h1>Upload a case</h1><div><p className="lead">Choose what you’re prescribing, add your practice details, then upload the digital scan files and the completed RX form. The summary shows the turnaround our RX form lists and what to include.</p>
            <div className="actions"><a className="button button-light" href={rxFormUrl} download>Download the RX form</a><a className="text-link" href="/shipping-label">Sending a physical impression?</a></div></div></div>
          <ol className="up-progress" aria-label="Steps"><li><span>1</span>Restoration</li><li><span>2</span>Shade &amp; timing</li><li><span>3</span>Your details</li><li><span>4</span>Upload files</li></ol>
        </div></section>
        <section className="section up-section"><div className="wrap">
          <form className="planner up-form" id="upload-form" data-endpoint="/api/upload-case" noValidate>
            <div className="planner-steps">
              <fieldset className="pl-step" data-step="type"><legend><span className="pl-num">1</span>What are you prescribing?</legend>
                <div className="pl-options" data-options="type"></div><p className="up-err" data-err="type"></p></fieldset>
              <fieldset className="pl-step" data-step="option" disabled><legend><span className="pl-num">2</span><span className="pl-q">Which option?</span></legend>
                <p className="pl-hint">Choose a restoration type first.</p><div className="pl-options" data-options="option"></div><p className="up-err" data-err="option"></p></fieldset>
              <fieldset className="pl-step" data-step="shade" disabled><legend><span className="pl-num">3</span>How will you give us the shade?</legend>
                <div className="pl-options" data-options="shade"></div><p className="up-err" data-err="shade"></p></fieldset>
              <fieldset className="pl-step" data-step="timing" disabled><legend><span className="pl-num">4</span>When do you need it back?</legend>
                <div className="pl-options" data-options="timing"></div><p className="up-err" data-err="timing"></p></fieldset>

              <fieldset className="pl-step up-details" data-step="details"><legend><span className="pl-num">5</span>Doctor and case details</legend>
                <div className="up-grid">
                  <label htmlFor="up-doctor">Doctor’s name <span aria-hidden="true">*</span><input id="up-doctor" name="doctor" autoComplete="name" required /></label>
                  <label htmlFor="up-practice">Practice name <span aria-hidden="true">*</span><input id="up-practice" name="practice" autoComplete="organization" required /></label>
                  <label htmlFor="up-email">Email <span aria-hidden="true">*</span><input id="up-email" name="email" type="email" autoComplete="email" required /></label>
                  <label htmlFor="up-phone">Phone <span aria-hidden="true">*</span><input id="up-phone" name="phone" type="tel" autoComplete="tel" required /></label>
                  <label htmlFor="up-patient">Patient ID or initials <span aria-hidden="true">*</span><input id="up-patient" name="patient" required maxLength={20} aria-describedby="up-patient-hint" /><small id="up-patient-hint">Please don’t enter the patient’s full name.</small></label>
                  <label htmlFor="up-teeth">Tooth numbers <span className="optional">(optional)</span><input id="up-teeth" name="teeth" placeholder="e.g. 8, 9" /></label>
                  <label htmlFor="up-due">Seat date <span className="optional">(optional)</span><input id="up-due" name="due" type="date" /></label>
                  <label htmlFor="up-scanner">Scanner used <span className="optional">(optional)</span>
                    <select id="up-scanner" name="scanner">
                      <option value="">Select a scanner</option>
                      <option>iTero</option><option>3Shape Trios</option><option>Medit</option><option>Primescan / CEREC</option><option>Carestream</option><option>Other</option>
                    </select>
                  </label>
                  <label className="up-wide" htmlFor="up-notes">Notes for the technician <span className="optional">(optional)</span><textarea id="up-notes" name="notes" rows={4} maxLength={2000} placeholder="Anything the RX form doesn’t cover"></textarea></label>
                </div></fieldset>

              <fieldset className="pl-step up-files" data-step="files"><legend><span className="pl-num">6</span>Upload the scan and RX form</legend>
                <div className="up-drop" data-drop="scans" data-required="1">
                  <input type="file" id="up-scans" name="scans" multiple accept=".stl,.ply,.obj,.dcm,.3oxz,.zip,.7z,.rar" aria-describedby="up-scans-help" />
                  <label htmlFor="up-scans" className="up-drop-ui"><span className="up-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M7 18a4.5 4.5 0 0 1-.8-8.93A6 6 0 0 1 17.7 8.1 4 4 0 0 1 17 18" /><path d="M12 12v8M8.5 15.5 12 12l3.5 3.5" /></svg></span>
                    <strong>Digital scan files <span aria-hidden="true">*</span></strong><span>Drag files here, or <u>browse</u></span><small id="up-scans-help">STL, PLY, OBJ, DCM, 3OXZ or a ZIP of the export. Include the opposing arch and bite.</small></label>
                  <ul className="up-list" aria-live="polite"></ul><p className="up-err" data-err="scans"></p>
                </div>
                <div className="up-drop" data-drop="rx" data-required="1">
                  <input type="file" id="up-rx" name="rx" multiple accept=".pdf,.jpg,.jpeg,.png,.heic" aria-describedby="up-rx-help" />
                  <label htmlFor="up-rx" className="up-drop-ui"><span className="up-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg></span>
                    <strong>Completed RX form <span aria-hidden="true">*</span></strong><span>Drag the form here, or <u>browse</u></span><small id="up-rx-help">PDF, JPG or PNG. <a href={rxFormUrl} download>Download a blank RX form</a>.</small></label>
                  <ul className="up-list" aria-live="polite"></ul><p className="up-err" data-err="rx"></p>
                </div>
                <div className="up-drop is-optional" data-drop="photos">
                  <input type="file" id="up-photos" name="photos" multiple accept="image/*" aria-describedby="up-photos-help" />
                  <label htmlFor="up-photos" className="up-drop-ui"><span className="up-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="m21 16-5-5-8 8" /></svg></span>
                    <strong>Shade photos <span className="optional">(optional)</span></strong><span>Drag photos here, or <u>browse</u></span><small id="up-photos-help">Include a shade tab in the shot, taken in natural light.</small></label>
                  <ul className="up-list" aria-live="polite"></ul>
                </div>
                <label className="up-consent"><input type="checkbox" name="consent" id="up-consent" required /><span>I confirm I’m authorized to share these records with Dental Concepts for this case.</span></label>
                <p className="up-err" data-err="consent"></p>
                <div className="up-submit"><button className="button" type="submit">Upload case</button><button className="pl-reset" type="reset">Start over</button></div>
                <div className="up-bar" hidden><span></span></div>
                <p className="up-status" role="status" aria-live="polite"></p>
              </fieldset>
            </div>
            <aside className="planner-result up-summary" aria-labelledby="pr-heading"><h2 id="pr-heading">Your case</h2>
              <div id="pr-body" aria-live="polite"><p className="pr-empty">Your turnaround and checklist appear here once you choose the restoration, shade and timing.</p></div>
              <ul className="up-check" aria-label="Upload checklist">
                <li data-chk="plan">Restoration, shade and timing</li>
                <li data-chk="details">Doctor and case details</li>
                <li data-chk="scans">Digital scan files</li>
                <li data-chk="rx">Completed RX form</li>
              </ul>
              <p className="up-help">Questions before you upload? Call <a href="tel:+18007005227">1-800-700-LABS</a>.</p>
            </aside>
          </form>
          <noscript><p className="note">This page needs JavaScript to upload files. Call <a href="tel:+18007005227">1-800-700-LABS</a> or <a href="/contact">contact the lab</a> to arrange your case.</p></noscript>
        </div></section>
        <section className="section faq tinted" aria-labelledby="faq-heading"><div className="wrap faq-grid">
          <div className="faq-head"><span className="eyebrow">Need help?</span><h2 id="faq-heading">Uploading a case</h2><p>Need a specific answer? Contact the lab team directly.</p><a className="text-link" href="/contact">Talk with the lab</a></div>
          <div className="faq-list">
            <details><summary>Which scan files can I upload?</summary><div className="faq-answer"><p>STL, PLY, OBJ, DCM or 3OXZ exports from iTero, Trios and similar scanners. You can also zip the whole export and upload the ZIP. Include the opposing arch and the bite.</p></div></details>
            <details><summary>Do I still need the RX form?</summary><div className="faq-answer"><p>Yes. Upload a completed RX form with every case. You can <a href={rxFormUrl} download>download a blank RX form</a>, fill it in, then scan or photograph it.</p></div></details>
            <details><summary>What about digital implant cases?</summary><div className="faq-answer"><p>Write the implant system and size on the RX form, and upload a full arch gingival scan taken without the healing abutment.</p></div></details>
            <details><summary>I’m sending a physical impression. What do I do?</summary><div className="faq-answer"><p>Request a <a href="/shipping-label">shipping label</a>, and we’ll reply with the label and carrier details.</p></div></details>
            <details><summary>Is the turnaround a guarantee?</summary><div className="faq-answer"><p>No. The summary shows the in-lab working days printed on our RX form. Weekends, holidays and shipping aren’t counted, so confirm timing with the lab before you book the patient.</p></div></details>
            <details><summary>How should I name the patient?</summary><div className="faq-answer"><p>Use a patient ID or initials rather than the full name. The lab will match the case to your RX form.</p></div></details>
          </div></div></section>
        <section className="visit"><div className="wrap visit-grid">
          <div className="visit-lead"><h2>Prefer to talk it through?</h2><p>Call <a href="tel:+18007005227">1-800-700-LABS</a> before you upload, and a technician will help you plan the case.</p><a className="button button-light" href="/contact">Contact the lab</a></div>
        </div></section>
      </main>
      <script
        dangerouslySetInnerHTML={{ __html: `window.PLANNER_RULES = ${JSON.stringify(plannerRules)};` }}
      />
      <Script src="/upload.js" strategy="afterInteractive" />
      <Footer />
    </>
  );
}
