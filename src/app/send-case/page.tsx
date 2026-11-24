import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  alternates: {
    canonical: "/send-case",
  },
  title: "Send a Case | Dental Concepts San Francisco",
  description:
    "Send a case to Dental Concepts: start a digital case with the online RX form and scan upload, or download the two-page RX form PDF.",
};

export const dynamic = "force-dynamic";

export default function SendCasePage() {
  return (
    <>
      <link rel="stylesheet" href="/send-case.css" />
      <Header />
      <main id="main" className="sc-main">
        <section className="sc-split" aria-labelledby="sc-title"><div className="wrap sc-wrap">
          <div className="sc-top">
            <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">Send a case</li></ol></nav>
            <h1 id="sc-title">Send a case</h1>
            <p className="sc-lead">Two ways to get a case to the lab. Both go to the same technician.</p>
          </div>
          <div className="sc-cards">
            <button type="button" className="sc-card is-digital" data-open-case aria-haspopup="dialog" aria-controls="sc-modal">
              <span className="sc-tag">Recommended</span>
              <span className="sc-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M7 18a4.5 4.5 0 0 1-.8-8.93A6 6 0 0 1 17.7 8.1 4 4 0 0 1 17 18" /><path d="M12 12v8M8.5 15.5 12 12l3.5 3.5" /></svg></span>
              <span className="sc-card-title">Digital case</span>
              <span className="sc-card-text">Fill in the RX online, pick the teeth and upload your scan. You get a reference number when you&rsquo;re done.</span>
              <span className="sc-points"><span>Online RX form, about 5 minutes</span><span>iTero, Trios and similar scans</span><span>Shipping or drop-off cases too</span></span>
              <span className="sc-cta">Start a digital case <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            </button>
            <a className="sc-card is-pdf" href="/assets/digital-rx.pdf" download>
              <span className="sc-sheet" aria-hidden="true"><img src="/assets/rx-form-preview.webp" width={900} height={693} alt="" fetchPriority="high" /></span>
              <span className="sc-card-title">Download RX form</span>
              <span className="sc-card-text">Print the two-page PDF, fill it in by hand and pack it with the impression or models.</span>
              <span className="sc-cta">Download PDF, 2 pages <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            </a>
          </div>
          <div className="sc-foot">
            <span>Questions? <a href="tel:+18007005227">1-800-700-LABS</a></span><span>Rush: <a href="tel:+14155589716">(415) 558-9716</a></span><span>Monday to Friday, 9 AM to 5 PM</span><a className="text-link" href="/shipping-label">Need a shipping label?</a>
          </div>
        </div></section>

        <div className="sc-modal" id="sc-modal" role="dialog" aria-modal="true" aria-labelledby="sc-modal-title" hidden>
          <div className="sc-backdrop" data-close-case></div>
          <div className="sc-box">
            <div className="sc-box-head">
              <div className="sc-box-title"><span className="sc-box-eyebrow">Digital case</span><h2 id="sc-modal-title">Online RX form</h2></div>
              <ol className="nc-progress sc-progress" aria-label="Form sections"><li data-prog="doctor"><span>1</span>Doctor</li><li data-prog="making"><span>2</span>Making</li><li data-prog="teeth"><span>3</span>Teeth</li><li data-prog="send"><span>4</span>Scan</li><li data-prog="sign"><span>5</span>Sign</li></ol>
              <button type="button" className="sc-close" data-close-case aria-label="Close the form"><svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></button>
            </div>
            <div className="sc-box-body" tabIndex={-1}>
              <form className="nc-layout" id="nc-form-el" data-endpoint="/api/upload-case" noValidate>
                <div className="nc-main">

                  <fieldset className="nc-card" data-sec="doctor"><legend className="nc-legend"><span className="nc-no">01</span>Doctor and patient<span className="nc-today" id="nc-today"></span></legend>
                    <div className="nc-grid nc-3">
                      <label className="nc-fld">Doctor&rsquo;s name <i>*</i><input name="doctor" autoComplete="name" placeholder="Dr. First Last" required /></label>
                      <label className="nc-fld">License number <em>(optional)</em><input name="license" placeholder="e.g. 54321" /></label>
                      <label className="nc-fld">Practice name <i>*</i><input name="practice" autoComplete="organization" required /></label>
                      <label className="nc-fld">Practice email <i>*</i><input name="email" type="email" autoComplete="email" placeholder="frontdesk@yourpractice.com" required /></label>
                      <label className="nc-fld">Doctor&rsquo;s phone <i>*</i><input name="phone" type="tel" autoComplete="tel" placeholder="(415) 555-0123" required /></label>
                      <label className="nc-fld">Patient name or ID <i>*</i><input name="patient" maxLength={40} required aria-describedby="nc-pt-hint" /><small id="nc-pt-hint">Initials or your chart ID are fine.</small></label>
                      <label className="nc-fld">Patient appointment (seat) date <em>(optional)</em><input name="due" type="date" /></label>
                    </div></fieldset>

                  <fieldset className="nc-card" data-sec="making"><legend className="nc-legend"><span className="nc-no">02</span>What are we making? <i>*</i><span className="nc-sub">Pick a category, then everything that applies.</span></legend>
                    <div className="nc-tabs" role="tablist" aria-label="Restoration category">
                      <button type="button" role="tab" aria-selected="true" data-tab="crowns">Crowns &amp; restorations</button><button type="button" role="tab" aria-selected="false" data-tab="implants">Implants</button><button type="button" role="tab" aria-selected="false" data-tab="other">Other services</button>
                    </div>
                    <div className="nc-panel" data-panel="crowns">
                      <p className="nc-note">Crowns and restorations: <strong>10 to 15 in-lab days</strong> for most cases. Full contour zirconia: 7 days for 1 to 3 units.</p>
                      <div className="nc-opts nc-3">
                        <label className="nc-opt"><input type="checkbox" name="items" value="layered" data-days="10" data-label="Zirconia (layered)" /><span>Zirconia (layered)</span></label>
                        <label className="nc-opt"><input type="checkbox" name="items" value="fcz" data-days="7" data-label="Full contour zirconia" /><span>Full contour zirconia</span></label>
                        <label className="nc-opt"><input type="checkbox" name="items" value="emax" data-days="10" data-label="Lithium disilicate" /><span>Lithium disilicate<small>Veneer, onlay, inlay or crown (E.max)</small></span></label>
                        <label className="nc-opt"><input type="checkbox" name="items" value="gold" data-days="10" data-label="Gold crown" /><span>Gold crown</span></label>
                        <label className="nc-opt"><input type="checkbox" name="items" value="provisional" data-days="10" data-label="Provisional" /><span>Provisional</span></label>
                        <label className="nc-opt"><input type="checkbox" name="items" value="waxup" data-days="10" data-label="Digital diagnostic wax-up" /><span>Digital diagnostic wax-up</span></label>
                      </div>
                      <div className="nc-sub-fields" data-show="gold" hidden><span className="nc-sub-title">Gold alloy</span><div className="nc-opts nc-3">
                        <label className="nc-opt is-radio"><input type="radio" name="alloy" value="High noble yellow" /><span>High noble yellow</span></label><label className="nc-opt is-radio"><input type="radio" name="alloy" value="High noble white" /><span>High noble white</span></label><label className="nc-opt is-radio"><input type="radio" name="alloy" value="Noble white" /><span>Noble white</span></label></div></div>
                    </div>
                    <div className="nc-panel" data-panel="implants" hidden>
                      <p className="nc-note">Implant cases: <strong>3 to 4 weeks</strong> on our RX form. Implant crowns and abutments: 15 in-lab days for 1 to 3 units.</p>
                      <div className="nc-opts nc-3">
                        <label className="nc-opt"><input type="checkbox" name="items" value="icrown" data-days="15" data-label="Implant crown" /><span>Implant crown</span></label>
                        <label className="nc-opt"><input type="checkbox" name="items" value="abutment" data-days="15" data-label="Custom abutment" /><span>Custom abutment</span></label>
                        <label className="nc-opt"><input type="checkbox" name="items" value="fullarch" data-days="20" data-label="Full arch / All-on-X" /><span>Full arch / All-on-X<small>Planned with you in stages</small></span></label>
                        <label className="nc-opt"><input type="checkbox" name="items" value="itemp" data-days="0" data-label="Implant temporary" /><span>Implant temporary<small>Timing confirmed by the lab</small></span></label>
                      </div>
                      <div className="nc-sub-fields" data-show-implant hidden>
                        <div className="nc-grid nc-2">
                          <label className="nc-fld">Implant system and size <i>*</i><input name="implantSystem" placeholder="e.g. Nobel Active NP 3.5" /></label>
                          <label className="nc-fld">Screw channel<select name="access"><option value="">Standard</option><option>Angulated screw access, if possible</option></select></label>
                        </div>
                        <span className="nc-sub-title">Crown</span><div className="nc-opts nc-3">
                          <label className="nc-opt is-radio"><input type="radio" name="cement" value="Lab cemented (1 piece with hole)" /><span>Lab cemented<small>1 piece with hole</small></span></label>
                          <label className="nc-opt is-radio"><input type="radio" name="cement" value="Uncemented (2 pieces)" /><span>Uncemented<small>2 pieces</small></span></label></div>
                        <span className="nc-sub-title">Abutment material</span><div className="nc-opts nc-3">
                          <label className="nc-opt is-radio"><input type="radio" name="abutMat" value="Titanium" /><span>Titanium</span></label><label className="nc-opt is-radio"><input type="radio" name="abutMat" value="Gold hue" /><span>Gold hue</span></label><label className="nc-opt is-radio"><input type="radio" name="abutMat" value="Zirconia (if possible)" /><span>Zirconia<small>If possible</small></span></label></div>
                        <label className="nc-check"><input type="checkbox" name="labParts" value="yes" /><span>Lab to provide parts</span></label>
                      </div>
                    </div>
                    <div className="nc-panel" data-panel="other" hidden>
                      <p className="nc-note">Timing for these depends on the case. We&rsquo;ll confirm it when the case arrives.</p>
                      <div className="nc-opts nc-3">
                        <label className="nc-opt"><input type="checkbox" name="items" value="models" data-days="0" data-label="Model printing" /><span>Model printing<small>Resin models from your scan</small></span></label>
                        <label className="nc-opt"><input type="checkbox" name="items" value="nightguard" data-days="0" data-label="Night guard" /><span>Night guard</span></label>
                        <label className="nc-opt"><input type="checkbox" name="items" value="tray" data-days="0" data-label="Custom tray" /><span>Custom tray</span></label>
                      </div>
                    </div>
                    <p className="nc-err" data-err="items"></p>
                  </fieldset>

                  <fieldset className="nc-card" data-sec="teeth"><legend className="nc-legend"><span className="nc-no">03</span>Teeth, shade and instructions<span className="nc-sub">Universal numbering. Select every tooth in the case.</span></legend>
                    <div className="nc-chart" id="nc-chart">
                      <div className="nc-chart-top"><strong id="nc-teeth-label">No teeth selected</strong><div><button type="button" className="nc-chip" data-arch="upper">Full upper arch</button><button type="button" className="nc-chip" data-arch="lower">Full lower arch</button><button type="button" className="nc-link" data-arch="clear">Clear</button></div></div>
                      <div className="nc-arch-labels"><span>Patient&rsquo;s right</span><span>Upper</span><span>Patient&rsquo;s left</span></div>
                      <div className="nc-arch" data-row="upper" role="group" aria-label="Upper teeth"></div>
                      <div className="nc-arch is-lower" data-row="lower" role="group" aria-label="Lower teeth"></div>
                      <div className="nc-arch-labels is-bottom"><span></span><span>Lower</span><span></span></div>
                    </div>
                    <input type="hidden" name="teeth" id="nc-teeth-value" />
                    <p className="nc-err" data-err="teeth"></p>
                    <div className="nc-grid nc-2" style={{ marginTop: 20 }}>
                      <label className="nc-fld">Shade <i>*</i><input name="shade" placeholder="e.g. A2" required /></label>
                      <label className="nc-fld">Stump shade <em>(recommended for E.max)</em><input name="stump" placeholder="e.g. ND3" /></label>
                    </div>
                    <div className="nc-opts nc-2" style={{ marginTop: 14 }}>
                      <label className="nc-opt"><input type="checkbox" name="customShade" value="yes" /><span>Custom shade visit<small>15 to 20 minutes at the lab. Book on (415) 558-9717</small></span></label>
                      <label className="nc-opt"><input type="checkbox" name="photosFlag" value="yes" /><span>I&rsquo;ll send shade photos<small>Upload them in step 04, or email photos@dentalconceptssf.com</small></span></label>
                    </div>
                    <label className="nc-fld" style={{ marginTop: 18 }}>Instructions for the technician <em>(optional)</em><textarea name="notes" rows={4} maxLength={2000} placeholder="e.g. #8 and #9: match incisal translucency of #7. Light occlusal contact."></textarea><small>Margins, contacts, occlusion, contours, anything the chart can&rsquo;t show.</small></label>
                  </fieldset>

                  <fieldset className="nc-card" data-sec="send"><legend className="nc-legend"><span className="nc-no">04</span>How will the case reach us? <i>*</i></legend>
                    <div className="nc-opts nc-3">
                      <label className="nc-opt is-radio"><input type="radio" name="delivery" value="digital" /><span>Digital scan<small>Upload it here</small></span></label>
                      <label className="nc-opt is-radio"><input type="radio" name="delivery" value="ship" /><span>Shipping it<small>UPS or courier</small></span></label>
                      <label className="nc-opt is-radio"><input type="radio" name="delivery" value="dropoff" /><span>Dropping it off<small>244 9th Street, SF</small></span></label>
                    </div>
                    <p className="nc-err" data-err="delivery"></p>

                    <div className="nc-sub-fields" data-delivery="digital" hidden>
                      <label className="nc-fld" style={{ maxWidth: 360 }}>Scanner used<select name="scanner"><option value="">Select a scanner</option><option>iTero</option><option>3Shape Trios</option><option>Medit</option><option>Primescan / CEREC</option><option>Carestream</option><option>Other</option></select></label>
                      <div className="up-drop" data-drop="scans">
                        <input type="file" id="nc-scans" multiple accept=".stl,.ply,.obj,.dcm,.3oxz,.zip,.7z,.rar" />
                        <label htmlFor="nc-scans" className="up-drop-ui"><span className="up-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M7 18a4.5 4.5 0 0 1-.8-8.93A6 6 0 0 1 17.7 8.1 4 4 0 0 1 17 18" /><path d="M12 12v8M8.5 15.5 12 12l3.5 3.5" /></svg></span><strong>Digital scan files <i>*</i></strong><span>Drag files here, or <u>browse</u></span><small>STL, PLY, OBJ, DCM, 3OXZ or a ZIP. Include the opposing arch and bite. Implant cases: a full arch gingival scan without the healing abutment.</small></label>
                        <ul className="up-list" aria-live="polite"></ul><p className="nc-err nc-drop-err" data-err="scans"></p></div>
                    </div>

                    <div className="nc-sub-fields" data-delivery="box" hidden>
                      <span className="nc-sub-title">What&rsquo;s in the box? <i>*</i></span>
                      <div className="nc-opts nc-4 is-compact">
                        <label className="nc-opt"><input type="checkbox" name="box" value="Impression" /><span>Impression</span></label><label className="nc-opt"><input type="checkbox" name="box" value="Bite" /><span>Bite</span></label><label className="nc-opt"><input type="checkbox" name="box" value="Bite with stick" /><span>Bite with stick</span></label><label className="nc-opt"><input type="checkbox" name="box" value="Opposing" /><span>Opposing</span></label>
                        <label className="nc-opt"><input type="checkbox" name="box" value="Articulator" /><span>Articulator</span></label><label className="nc-opt"><input type="checkbox" name="box" value="Study model" /><span>Study model</span></label><label className="nc-opt"><input type="checkbox" name="box" value="Face bow" /><span>Face bow</span></label><label className="nc-opt"><input type="checkbox" name="box" value="Trip tray" /><span>Trip tray</span></label>
                        <label className="nc-opt"><input type="checkbox" name="box" value="Old impression" /><span>Old impression</span></label><label className="nc-opt"><input type="checkbox" name="box" value="Old crown" /><span>Old crown</span></label><label className="nc-opt"><input type="checkbox" name="box" value="Old model" /><span>Old model</span></label><label className="nc-opt"><input type="checkbox" name="box" value="Old implant parts" /><span>Old implant parts</span></label>
                        <label className="nc-opt"><input type="checkbox" name="box" value="Analog" /><span>Analog</span></label><label className="nc-opt"><input type="checkbox" name="box" value="Implant coping" /><span>Implant coping</span></label><label className="nc-opt"><input type="checkbox" name="box" value="Abutment" /><span>Abutment</span></label><label className="nc-opt"><input type="checkbox" name="box" value="Night guard / partial" /><span>Night guard / partial</span></label>
                      </div>
                      <p className="nc-err" data-err="box"></p>
                      <p className="nc-hint" data-ship-only hidden>Need a label? <a className="text-link" href="/shipping-label">Request a shipping label</a> and pack a printed copy of your reference number in the box.</p>
                    </div>

                    <div className="up-drop is-optional" data-drop="photos" style={{ marginTop: 18 }}>
                      <input type="file" id="nc-photos" multiple accept="image/*" />
                      <label htmlFor="nc-photos" className="up-drop-ui"><span className="up-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="m21 16-5-5-8 8" /></svg></span><strong>Shade photos <em>(optional)</em></strong><span>Drag photos here, or <u>browse</u></span><small>Include a shade tab in the shot, taken in natural light.</small></label>
                      <ul className="up-list" aria-live="polite"></ul></div>

                    <div className="nc-grid nc-2 nc-when">
                      <label className="nc-fld">Date you need it back <em>(optional)</em><input name="needBy" type="date" /><small>We&rsquo;ll check it against the turnaround.</small></label>
                      <div className="nc-check-date" id="nc-date-check" aria-live="polite"><strong>No date set</strong><span>Add a date and we&rsquo;ll check it against the turnaround.</span></div>
                    </div>
                    <details className="nc-more"><summary>Rush service and in-lab working days</summary><div>
                      <p>Turnaround is in in-lab working days. Weekends, holidays, pickups and deliveries aren&rsquo;t counted.</p>
                      <p>Rush service is available on most products for up to 4 units when pre-scheduled with the Lab Manager or Implant Coordinator. Cases needed within 7 business days carry a $150 per unit surcharge. For faster turnaround options and additional pricing, please contact <a href="tel:+14155589716">(415) 558-9716</a>.</p>
                    </div></details>
                  </fieldset>

                  <fieldset className="nc-card" data-sec="sign"><legend className="nc-legend"><span className="nc-no">05</span>Sign and send</legend>
                    <label className="nc-fld" style={{ maxWidth: 440 }}>Doctor&rsquo;s signature <i>*</i><input name="signature" className="nc-sign" placeholder="Dr. First Last" required /><small>Type your full name. It counts as your signature on this RX.</small></label>
                    <label className="nc-check is-box"><input type="checkbox" name="warranty" required /><span>I&rsquo;ve read the lab&rsquo;s limited warranty and agree to its terms.</span></label>
                    <details className="nc-more"><summary>Read the limited warranty</summary><div><p>We repair or replace a failed final fixed restoration at no charge for materials and workmanship for up to one year (restrictions apply). Provisionals and auxiliary services are covered for six months, and implant abutments follow the implant company&rsquo;s guidelines. The restoration needs to be returned to the lab.</p></div></details>
                    <label className="nc-check is-box"><input type="checkbox" name="consent" required /><span>I confirm I&rsquo;m authorized to share these records with Dental Concepts for this case.</span></label>
                    <p className="nc-privacy">Scans, photos and the RX may include patient information. We use them only to make this case and don&rsquo;t share them beyond the lab team working on it.</p>
                    <p className="nc-err" data-err="sign"></p>
                    <div className="nc-submit"><button className="button" type="submit">Send the case to the lab</button></div>
                    <div className="up-bar" hidden><span></span></div>
                    <div className="nc-status" role="status" aria-live="polite"></div>
                  </fieldset>
                </div>

                <aside className="nc-side">
                  <div className="nc-summary"><h2>Your case</h2>
                    <dl className="nc-sum-list">
                      <div><dt>Making</dt><dd id="sum-items">Nothing selected yet</dd></div>
                      <div><dt>Teeth</dt><dd id="sum-teeth">&mdash;</dd></div>
                      <div><dt>Shade</dt><dd id="sum-shade">&mdash;</dd></div>
                      <div><dt>Sending</dt><dd id="sum-send">&mdash;</dd></div>
                    </dl>
                    <p className="nc-sum-days"><b id="sum-days">&mdash;</b><span id="sum-days-note">In-lab working days on our RX form, once the case arrives.</span></p>
                    <ul className="nc-checklist">
                      <li data-chk="doctor">Doctor and patient</li><li data-chk="making">What we&rsquo;re making</li><li data-chk="teeth">Teeth and shade</li><li data-chk="send">Scan or impression</li><li data-chk="sign">Signed</li>
                    </ul></div>
                  <div className="nc-paper"><strong>Prefer paper?</strong><p>Print the RX form, fill it in by hand and pack it with the case. Same fields as this page.</p><a className="button button-light" href="/assets/digital-rx.pdf" download>Download RX form</a></div>
                  <div className="nc-help"><strong>Questions about a case?</strong><p><a href="tel:+18007005227">1-800-700-LABS (5227)</a><br />Rush scheduling: <a href="tel:+14155589716">(415) 558-9716</a><br />Monday to Friday, 9 AM to 5 PM</p></div>
                </aside>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Script src="/send-case.js" strategy="afterInteractive" />
    </>
  );
}
