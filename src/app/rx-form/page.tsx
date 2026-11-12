import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getActiveRxFormUrl } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Online RX Form | Dental Concepts San Francisco",
  description:
    "Fill in the Dental Concepts SF laboratory prescription (RX) form online, or download the two-page PDF to print and send with your case.",
};

export const dynamic = "force-dynamic";

const ENCLOSED_ITEMS = [
  "Impression", "Bite", "Bite with stick", "Opposing", "Articulator", "Study model",
  "Face bow", "Trip tray", "Old impression", "Old crown", "Old model", "Old implant parts",
  "Analog", "Implant coping", "Abutment", "Photos / flashcard", "Night guard / partial", "Other",
];

const VITA_SHADES = ["A1", "A2", "A3", "A3.5", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4", "D2", "D3", "D4"];

export default async function RxFormPage() {
  const rxFormUrl = await getActiveRxFormUrl().catch(() => "/assets/digital-rx.pdf");
  return (
    <>
      <Header />
      <main id="main">
        <section className="page-head"><div className="wrap">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li><Link href="/send-case">Send a case</Link></li><li aria-current="page">RX form</li></ol></nav>
          <div className="page-head-grid"><h1>Laboratory prescription (RX) form</h1><div><p className="lead">Fill the RX in online and we&rsquo;ll have it before your case arrives, or download the two-page PDF and pack a printed copy with the case. Both go to the same technician. Every field below is required.</p></div></div>
          <div className="rxf-paths">
            <a className="rxf-path" href="#rx-form">
              <span className="rxf-path__icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#005cdf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg></span>
              <span><span className="rxf-path__title !text-white">Fill it in online</span><span className="rxf-path__text !text-white">About 5 minutes. Live turnaround estimate, rush check and a reference number when you&rsquo;re done.</span><span className="rxf-path__cta">START THE FORM ↓</span></span>
            </a>
            <a className="rxf-path" href={rxFormUrl} download>
              <span className="rxf-path__icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#005cdf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg></span>
              <span><span className="rxf-path__title !text-white">Download the PDF</span><span className="rxf-path__text !text-white">PDF, 2 pages. Print it, fill it by hand and pack it with the impression or models.</span><span className="rxf-path__cta">DOWNLOAD RX FORM (PDF)</span></span>
            </a>
          </div>
        </div></section>

        <section className="section flush-top" id="rx-form"><div className="wrap rxf-layout">
          <div className="rxf-form">

            <section className="rxf-success" id="rxf-success" aria-labelledby="rxf-success-h" tabIndex={-1} hidden>
              <div className="rxf-success__tick"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1b7a3d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg></div>
              <div>
                <h2 id="rxf-success-h">RX received</h2>
                <p className="lead" style={{ marginTop: 8 }}>Reference <strong id="rxf-ref" style={{ color: "var(--navy)" }}></strong>. An email draft addressed to the lab should now be open &mdash; review it and press send.</p>
              </div>
              <ol>
                <li>Write the reference on the box, or print the PDF copy and pack it with the case.</li>
                <li>We&rsquo;ll call <span id="rxf-ref-phone"></span> to confirm shipping or a secure channel for scans. Please don&rsquo;t email scans or patient records before that call.</li>
                <li>Turnaround is counted in in-lab working days from the day the case reaches the lab.</li>
              </ol>
              <div className="rxf-btn-row">
                <Link className="button button-small" href="/shipping-label">REQUEST A SHIPPING LABEL</Link>
                <button type="button" className="rxf-btn-link" id="rxf-restart">Start another RX</button>
              </div>
            </section>

            <form id="rxf" action="#" method="post" noValidate>
              <div className="rxf-error-summary" id="rxf-error-summary" role="alert" tabIndex={-1} hidden>
                <h2 id="rxf-error-title">Fix these before sending</h2>
                <ul id="rxf-error-list"></ul>
              </div>

              {/* 1 */}
              <section className="rxf-card" id="rxf-s1" aria-labelledby="rxf-s1-h">
                <div className="rxf-card-head">
                  <span className="rxf-num" aria-hidden="true">01</span>
                  <h2 id="rxf-s1-h">Doctor and patient</h2>
                  <span className="rxf-hint rxf-push">Today: <span id="rxf-today"></span></span>
                </div>
                <input type="hidden" name="todays_date" id="rxf-todays-date" />
                <div className="rxf-grid">
                  <label className="rxf-field">Doctor&rsquo;s name <span className="rxf-req">*</span>
                    <input type="text" name="doctor_name" id="rxf-doctor-name" autoComplete="name" placeholder="Dr. First Last" required />
                  </label>
                  <label className="rxf-field">License number <span className="rxf-req">*</span>
                    <input type="text" name="license_number" id="rxf-license-number" placeholder="e.g. 54321" required />
                  </label>
                  <label className="rxf-field">Doctor&rsquo;s phone <span className="rxf-req">*</span>
                    <input type="tel" name="doctor_phone" id="rxf-doctor-phone" autoComplete="tel" placeholder="(415) 555-0123" required />
                  </label>
                  <label className="rxf-field">Practice email <span className="rxf-req">*</span>
                    <input type="email" name="practice_email" id="rxf-practice-email" autoComplete="email" placeholder="frontdesk@yourpractice.com" required />
                  </label>
                  <label className="rxf-field">Patient&rsquo;s name <span className="rxf-req">*</span>
                    <input type="text" name="patient_name" id="rxf-patient-name" autoComplete="off" placeholder="First Last" required />
                  </label>
                  <label className="rxf-field">Patient&rsquo;s phone <span className="rxf-req">*</span>
                    <input type="tel" name="patient_phone" id="rxf-patient-phone" autoComplete="off" placeholder="(415) 555-0199" required />
                  </label>
                  <label className="rxf-field">Patient appointment date <span className="rxf-req">*</span>
                    <input type="date" name="appointment_date" id="rxf-appointment-date" className="rxf-date-min" required />
                  </label>
                </div>
              </section>

              {/* 2 */}
              <section className="rxf-card" id="rxf-s2" aria-labelledby="rxf-s2-h">
                <div className="rxf-card-head">
                  <span className="rxf-num" aria-hidden="true">02</span>
                  <h2 id="rxf-s2-h">What are we making?</h2>
                  <span className="rxf-hint">Pick a category, then everything that applies.</span>
                </div>

                <input type="hidden" name="category" id="rxf-category" value="crown" />
                <div className="rxf-tabs" role="tablist" aria-label="Case category">
                  <button type="button" className="rxf-tab" role="tab" id="rxf-tab-crown" aria-controls="rxf-panel-crown" aria-selected="true">Crowns &amp; restorations <span className="rxf-tab__count" data-count="crown"></span></button>
                  <button type="button" className="rxf-tab" role="tab" id="rxf-tab-impl" aria-controls="rxf-panel-impl" aria-selected="false" tabIndex={-1}>Implants <span className="rxf-tab__count" data-count="impl"></span></button>
                  <button type="button" className="rxf-tab" role="tab" id="rxf-tab-other" aria-controls="rxf-panel-other" aria-selected="false" tabIndex={-1}>Other services <span className="rxf-tab__count" data-count="other"></span></button>
                </div>

                <div className="rxf-tabpanel" id="rxf-panel-crown" role="tabpanel" aria-labelledby="rxf-tab-crown">
                  <p className="lead" style={{ fontSize: "1rem" }}>Crowns and restorations: <strong style={{ color: "var(--ink)" }}>10 to 15 in-lab days</strong> for most cases.</p>
                  <fieldset>
                    <legend className="sr-only">Restorations</legend>
                    <div className="rxf-choices" data-group="crown">
                      <label className="rxf-chip"><input type="checkbox" name="restoration[]" value="Zirconia (layered)" data-cat="allc" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Zirconia (layered)</span></span></label>
                      <label className="rxf-chip"><input type="checkbox" name="restoration[]" value="Full contour zirconia" data-cat="fcz" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Full contour zirconia</span></span></label>
                      <label className="rxf-chip"><input type="checkbox" name="restoration[]" value="Lithium disilicate" data-cat="allc" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Lithium disilicate</span><span className="rxf-chip__sub">Veneer, onlay or inlay (E.max)</span></span></label>
                      <label className="rxf-chip"><input type="checkbox" name="restoration[]" value="Gold crown" data-cat="gold" id="rxf-gold" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Gold crown</span></span></label>
                      <label className="rxf-chip"><input type="checkbox" name="restoration[]" value="Provisional" data-cat="prov" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Provisional</span></span></label>
                      <label className="rxf-chip"><input type="checkbox" name="restoration[]" value="Digital diagnostic wax-up" data-cat="wax" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Digital diagnostic wax-up</span></span></label>
                    </div>
                  </fieldset>
                  <fieldset className="rxf-subgroup" id="rxf-gold-alloy" hidden>
                    <legend>Gold alloy <span className="rxf-req">*</span></legend>
                    <div className="rxf-choices">
                      <label className="rxf-chip"><input type="radio" name="gold_alloy" value="High noble yellow" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">High noble yellow</span></span></label>
                      <label className="rxf-chip"><input type="radio" name="gold_alloy" value="High noble white" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">High noble white</span></span></label>
                      <label className="rxf-chip"><input type="radio" name="gold_alloy" value="Noble white" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Noble white</span></span></label>
                    </div>
                  </fieldset>
                </div>

                <div className="rxf-tabpanel" id="rxf-panel-impl" role="tabpanel" aria-labelledby="rxf-tab-impl" hidden>
                  <p className="lead" style={{ fontSize: "1rem" }}>Implant cases: <strong style={{ color: "var(--ink)" }}>3 to 4 weeks</strong>.</p>
                  <fieldset>
                    <legend className="sr-only">Implant components</legend>
                    <div className="rxf-choices" data-group="impl">
                      <label className="rxf-chip"><input type="checkbox" name="implant[]" value="Placement jig" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Placement jig</span></span></label>
                      <label className="rxf-chip"><input type="checkbox" name="implant[]" value="Gold hue" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Gold hue</span></span></label>
                      <label className="rxf-chip"><input type="checkbox" name="implant[]" value="Titanium" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Titanium</span></span></label>
                      <label className="rxf-chip"><input type="checkbox" name="implant[]" value="Zirconia (if possible)" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Zirconia</span><span className="rxf-chip__sub">If possible</span></span></label>
                      <label className="rxf-chip"><input type="checkbox" name="implant[]" value="Angulated screw access (if possible)" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Angulated screw access</span><span className="rxf-chip__sub">If possible</span></span></label>
                    </div>
                  </fieldset>
                  <div className="rxf-grid">
                    <fieldset className="rxf-subgroup">
                      <legend>Cementation <span className="rxf-req">*</span></legend>
                      <div className="rxf-choices">
                        <label className="rxf-chip"><input type="radio" name="implant_cementation" value="Lab cemented (1 piece with whole)" data-impl /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Lab cemented</span><span className="rxf-chip__sub">1 piece with whole</span></span></label>
                        <label className="rxf-chip"><input type="radio" name="implant_cementation" value="Uncemented (2 pieces)" data-impl /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Uncemented</span><span className="rxf-chip__sub">2 pieces</span></span></label>
                      </div>
                    </fieldset>
                    <fieldset className="rxf-subgroup">
                      <legend>Screw access <span className="rxf-req">*</span></legend>
                      <div className="rxf-choices">
                        <label className="rxf-chip"><input type="radio" name="implant_hole" value="Hole" data-impl /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Hole</span></span></label>
                        <label className="rxf-chip"><input type="radio" name="implant_hole" value="No hole" data-impl /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">No hole</span></span></label>
                      </div>
                    </fieldset>
                  </div>
                  <div className="rxf-grid">
                    <label className="rxf-field">Implant system and size <span className="rxf-req">*</span>
                      <input type="text" name="implant_system" id="rxf-implant-system" placeholder="e.g. Nobel Biocare NobelActive RP 4.3" data-impl />
                    </label>
                    <div className="rxf-choices" style={{ gridTemplateColumns: "1fr" }}>
                      <label className="rxf-chip"><input type="checkbox" name="implant[]" value="Lab to provide parts" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Lab to provide parts</span></span></label>
                    </div>
                  </div>
                </div>

                <div className="rxf-tabpanel" id="rxf-panel-other" role="tabpanel" aria-labelledby="rxf-tab-other" hidden>
                  <fieldset>
                    <legend className="sr-only">Other services</legend>
                    <div className="rxf-choices" data-group="other">
                      <label className="rxf-chip"><input type="checkbox" name="other_service[]" value="Diagnostic wax-up" data-cat="wax" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Diagnostic wax-up</span></span></label>
                      <label className="rxf-chip"><input type="checkbox" name="other_service[]" value="Bite" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Bite</span></span></label>
                      <label className="rxf-chip"><input type="checkbox" name="other_service[]" value="Custom tray" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Custom tray</span></span></label>
                      <label className="rxf-chip"><input type="checkbox" name="other_service[]" value="Fit night guard" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Fit night guard</span></span></label>
                    </div>
                  </fieldset>
                </div>
                <p className="rxf-field-error" id="rxf-err-resto" hidden>Choose at least one restoration or service.</p>
              </section>

              {/* 3 */}
              <section className="rxf-card" id="rxf-s3" aria-labelledby="rxf-s3-h">
                <div className="rxf-card-head">
                  <span className="rxf-num" aria-hidden="true">03</span>
                  <h2 id="rxf-s3-h">Teeth, shade and instructions</h2>
                  <span className="rxf-hint">Universal numbering. Select every tooth in the case.</span>
                </div>

                <fieldset className="rxf-chart" id="rxf-chart">
                  <legend className="sr-only">Tooth chart</legend>
                  <div className="rxf-chart__bar">
                    <p id="rxf-teeth-summary" aria-live="polite">No teeth selected</p>
                    <button type="button" className="rxf-btn-soft" data-arch="upper">Full upper arch</button>
                    <button type="button" className="rxf-btn-soft" data-arch="lower">Full lower arch</button>
                    <button type="button" className="rxf-btn-link" data-arch="clear">Clear</button>
                  </div>
                  <div className="rxf-chart__scroll">
                    <div className="rxf-chart__inner">
                      <div className="rxf-chart__labels"><span>PATIENT&rsquo;S RIGHT</span><span>UPPER</span><span>PATIENT&rsquo;S LEFT</span></div>
                      <div className="rxf-arch rxf-arch--upper" id="rxf-arch-upper"></div>
                      <div className="rxf-arch__divider"></div>
                      <div className="rxf-arch rxf-arch--lower" id="rxf-arch-lower"></div>
                      <div className="rxf-chart__labels rxf-chart__labels--center"><span>LOWER</span></div>
                    </div>
                  </div>
                  <p className="rxf-field-error" id="rxf-err-teeth" hidden>Select at least one tooth for this case.</p>
                </fieldset>

                <div className="rxf-notice rxf-notice--warn" id="rxf-notice-anterior" role="status" hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a5a00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
                  <span><strong>Anterior case:</strong> include a pre-op or study model with the case.</span>
                </div>
                <div className="rxf-notice rxf-notice--warn" id="rxf-notice-implant-scan" role="status" hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a5a00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
                  <span><strong>Digital implant case:</strong> we need a full-arch gingival scan taken without the healing abutment.</span>
                </div>

                <div className="rxf-grid">
                  <label className="rxf-field">Shade <span className="rxf-req">*</span>
                    <input type="text" name="shade" id="rxf-shade" list="rxf-vita-shades" placeholder="e.g. A2" required />
                  </label>
                  <label className="rxf-field">Stump shade <span className="rxf-req">*</span>
                    <input type="text" name="stump_shade" id="rxf-stump-shade" list="rxf-vita-shades" placeholder="e.g. ND3" required />
                  </label>
                  <datalist id="rxf-vita-shades">
                    {VITA_SHADES.map((s) => <option key={s} value={s} />)}
                  </datalist>
                </div>

                <div className="rxf-choices">
                  <label className="rxf-chip"><input type="checkbox" name="digital_scan" value="yes" id="rxf-digital-scan" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Digital impression scan</span><span className="rxf-chip__sub">iTero, Trios or similar</span></span></label>
                  <label className="rxf-chip"><input type="checkbox" name="custom_shade" value="yes" id="rxf-custom-shade" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Custom shade</span><span className="rxf-chip__sub">15 to 20 minute visit at the lab</span></span></label>
                  <label className="rxf-chip"><input type="checkbox" name="photos_sent" value="yes" id="rxf-photos-sent" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Shade photos emailed</span><span className="rxf-chip__sub">To photos@dentalconceptssf.com</span></span></label>
                </div>
                <p className="rxf-notice rxf-notice--info" id="rxf-notice-custom" hidden>Custom shade visits take 15 to 20 minutes at 244 9th Street, Monday to Friday, 9 AM to 5 PM. Call <a href="tel:4155589716">(415) 558-9716</a> to book, or email shade photos to <a href="mailto:photos@dentalconceptssf.com">photos@dentalconceptssf.com</a>.</p>

                <label className="rxf-field">Instructions for the technician <span className="rxf-req">*</span>
                  <span style={{ fontWeight: 400, color: "var(--body)" }}>Margins, contacts, occlusion, contours, anything the chart can&rsquo;t show.</span>
                  <textarea name="instructions" id="rxf-instructions" rows={5} placeholder="e.g. #8 and #9: match incisal translucency of #7. Light occlusal contact." required></textarea>
                </label>
              </section>

              {/* 4 */}
              <section className="rxf-card" id="rxf-s4" aria-labelledby="rxf-s4-h">
                <div className="rxf-card-head">
                  <span className="rxf-num" aria-hidden="true">04</span>
                  <h2 id="rxf-s4-h">Enclosed with the case and timing</h2>
                </div>

                <fieldset style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <legend><h3>What&rsquo;s in the box? <span className="rxf-req">*</span></h3></legend>
                  <div className="rxf-choices rxf-choices--sm" id="rxf-enclosed">
                    {ENCLOSED_ITEMS.map((label) => (
                      <label className="rxf-chip" key={label}><input type="checkbox" name="enclosed[]" value={label} /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">{label}</span></span></label>
                    ))}
                  </div>
                  <p className="rxf-field-error" id="rxf-err-enclosed" hidden>Choose at least one item enclosed with the case.</p>
                </fieldset>

                <fieldset style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <legend><h3>How will the case reach us? <span className="rxf-req">*</span></h3></legend>
                  <div className="rxf-choices" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))" }}>
                    <label className="rxf-chip"><input type="radio" name="delivery" value="Shipping" id="rxf-deliv-ship" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Shipping it</span><span className="rxf-chip__sub">UPS or courier</span></span></label>
                    <label className="rxf-chip"><input type="radio" name="delivery" value="Drop-off" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Dropping it off</span><span className="rxf-chip__sub">244 9th Street, SF</span></span></label>
                    <label className="rxf-chip"><input type="radio" name="delivery" value="Digital scan only" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label">Digital scan only</span><span className="rxf-chip__sub">We&rsquo;ll call to set up transfer</span></span></label>
                  </div>
                  <p className="rxf-field-error" id="rxf-err-delivery" hidden>Choose how the case will reach the lab.</p>
                  <p className="lead" style={{ fontSize: ".9rem" }} id="rxf-ship-hint" hidden>Need a prepaid label? <Link href="/shipping-label">Request a shipping label</Link>.</p>
                </fieldset>

                <div className="rxf-grid">
                  <label className="rxf-field">Date you need it back <span className="rxf-req">*</span>
                    <span style={{ fontWeight: 400, color: "var(--body)" }}>We&rsquo;ll check it against the turnaround.</span>
                    <input type="date" name="due_date" id="rxf-due-date" className="rxf-date-min" required />
                  </label>
                  <div className="rxf-status" id="rxf-due-status" aria-live="polite">
                    <strong id="rxf-due-title">No date set</strong>
                    <span id="rxf-due-text">Add a date and we&rsquo;ll check it against the turnaround.</span>
                  </div>
                </div>

                <details>
                  <summary>Rush service and in-lab working days</summary>
                  <p>Working days don&rsquo;t include weekends, holidays, pick-up or delivery days. Rush is available on most products for up to 4 units and must be pre-scheduled with the Lab Manager or Implant Coordinator at <a href="tel:4155589716">(415) 558-9716</a>.</p>
                  <ul style={{ listStyle: "disc", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
                    <li>Needed within 7 business days: $100 per unit</li>
                    <li>Within 5 business days: an extra $100 per unit</li>
                    <li>Under 3 business days: management approval and a quote</li>
                  </ul>
                  <p className="lead" style={{ fontSize: ".88rem", marginTop: 8 }}>Rush surcharges may change during holidays.</p>
                </details>
              </section>

              {/* 5 */}
              <section className="rxf-card" id="rxf-s5" aria-labelledby="rxf-s5-h">
                <div className="rxf-card-head">
                  <span className="rxf-num" aria-hidden="true">05</span>
                  <h2 id="rxf-s5-h">Sign and send</h2>
                </div>
                <label className="rxf-field rxf-field--sign" style={{ maxWidth: 480 }}>Doctor&rsquo;s signature <span className="rxf-req">*</span>
                  <span style={{ fontWeight: 400, color: "var(--body)" }}>Type your full name. It counts as your signature on this RX.</span>
                  <input type="text" name="signature" id="rxf-signature" placeholder="Dr. First Last" required />
                </label>
                <div className="rxf-choices" style={{ gridTemplateColumns: "1fr" }}>
                  <label className="rxf-chip" id="rxf-agree-chip"><input type="checkbox" name="agree_warranty" value="yes" id="rxf-agree" /><span className="rxf-chip__mark"></span><span className="rxf-chip__text"><span className="rxf-chip__label" style={{ fontWeight: 500 }}>I&rsquo;ve read the lab&rsquo;s limited warranty and agree to its terms.</span></span></label>
                </div>
                <details>
                  <summary>Read the limited warranty</summary>
                  <p>Restorations are made to the dentist&rsquo;s specifications and will fit the die or cast model, provided the tooth was prepared to the manufacturer&rsquo;s recommendations. If a seated restoration or implant abutment fails, the lab repairs or replaces it for materials and workmanship (restrictions apply): fixed restorations for one year, implant abutments as set by the implant company, and provisionals and other auxiliary services for six months. The doctor pays all other costs of adjustment, repair and replacement. Where a disclaimer isn&rsquo;t permitted by law, implied warranties last 90 days from delivery.</p>
                </details>
                <div className="rxf-submit-row">
                  <button type="submit" className="button" id="rxf-submit">SEND RX TO THE LAB</button>
                  <a href={rxFormUrl} download style={{ fontWeight: 600 }}>Or download the PDF instead</a>
                </div>
                <p className="rxf-secure"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#55606e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg><span>Don&rsquo;t attach scans or X-rays here: we&rsquo;ll call to confirm a secure channel for them.</span></p>
                <p className="rxf-field-error" id="rxf-status" role="status" aria-live="polite" style={{ color: "var(--blue)", fontWeight: 600 }}></p>
              </section>
            </form>
          </div>

          <aside className="rxf-sidebar" aria-label="Case summary">
            <div className="rxf-paper">
              <div className="rxf-paper__head">
                <span className="rxf-paper__doc" aria-hidden="true">PDF</span>
                <div><h2 style={{ fontSize: "1.15rem", color: "#fff" }}>Prefer paper?</h2><span style={{ fontSize: ".86rem", color: "#fff" }}>RX form, 2 pages</span></div>
              </div>
              <p style={{ fontSize: ".92rem", color: "#fff" }}>Print it, fill it by hand and pack it with the case. Same fields as this page.</p>
              <a className="button button-light button-small" href={rxFormUrl} download>DOWNLOAD RX FORM</a>
            </div>

            <div className="rxf-help">
              <h2>Questions about a case?</h2>
              <a href="tel:18007005227" style={{ fontWeight: 600 }}>1-800-700-LABS (5227)</a>
              <span className="lead" style={{ fontSize: ".9rem" }}>Rush scheduling: <a href="tel:4155589716">(415) 558-9716</a>, Lab Manager or Implant Coordinator</span>
              <span className="lead" style={{ fontSize: ".9rem" }}>Monday to Friday, 9 AM to 5 PM</span>
            </div>
          </aside>
        </div></section>

        <section className="section faq" aria-labelledby="faq-heading"><div className="wrap faq-grid">
          <div className="faq-head"><span className="eyebrow">FAQ</span><h2 id="faq-heading">Frequently asked questions</h2><p>Need a specific answer? Contact the lab team directly.</p><Link className="text-link" href="/contact">Talk with the lab</Link></div>
          <div className="faq-list">
            <details><summary>Does this website send or save my message?</summary><div className="faq-answer"><p>Submitting the form opens an email draft addressed to the lab for you to review and send, and saves a copy of the details you entered so the lab can follow up. The site never sends the email itself.</p></div></details>
            <details><summary>Why is every field required?</summary><div className="faq-answer"><p>A complete RX helps the lab plan the case correctly the first time. If a field doesn&rsquo;t apply, call <a href="tel:4155589716">(415) 558-9716</a> and we&rsquo;ll help you fill it in.</p></div></details>
            <details><summary>What about digital implant cases?</summary><div className="faq-answer"><p>Write the implant system and size on the RX, and send a full-arch gingival scan taken without the healing abutment.</p></div></details>
            <details><summary>I&rsquo;m sending a physical impression. What do I do?</summary><div className="faq-answer"><p>Request a <Link href="/shipping-label">shipping label</Link>, and we&rsquo;ll reply with the label and carrier details.</p></div></details>
          </div></div></section>
      </main>
      <Script src="/rx-form.js" strategy="afterInteractive" />
      <Footer />
    </>
  );
}
