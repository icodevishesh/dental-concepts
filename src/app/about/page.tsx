import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Our Dental Lab Story & History | Dental Concepts",
  description:
    "Meet Dental Concepts and discover our history, from zirconia milling roots to restorative craftsmanship and digital workflows in San Francisco since 2006.",
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "When was Dental Concepts founded?", acceptedAnswer: { "@type": "Answer", text: "Our story began in 2006, when Barry Johal and Silke Finis founded Prestige Milling Inc., one of the first Lava Milling Centers on the West Coast. As demand for esthetic restorations grew, that milling work became Dental Concepts." } },
    { "@type": "Question", name: "Who runs Dental Concepts?", acceptedAnswer: { "@type": "Answer", text: "German-certified dental technician Silke Finis leads the lab’s technical work, and entrepreneur Barry Johal leads the business. A team of experienced, certified dental technicians works alongside them." } },
    { "@type": "Question", name: "Are your restorations made in the USA?", acceptedAnswer: { "@type": "Answer", text: "Yes. We design, make and finish restorations at our dental laboratory on 9th Street in San Francisco. Cases aren’t sent overseas." } },
    { "@type": "Question", name: "What technology does the lab use?", acceptedAnswer: { "@type": "Answer", text: "We design on 3Shape, mill on Roland equipment and accept digital impressions from iTero, Trios and similar scanners. A technician finishes every case by hand." } },
    { "@type": "Question", name: "Where is the lab, and when is it open?", acceptedAnswer: { "@type": "Answer", text: "244 9th Street, San Francisco, CA 94103. We’re open Monday to Friday, 9 AM to 5 PM." } },
    { "@type": "Question", name: "Can I schedule a custom shade visit?", acceptedAnswer: { "@type": "Answer", text: "Yes. Call (415) 558-9717 to book. Visits take about 15 to 20 minutes." } },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Header />
      <main id="main">
        <section className="svc-hero about-hero"><div className="svc-copy"><nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">About</li></ol></nav>
          <h1>Meet Dental Concepts, a dental laboratory built around people</h1><p className="lead">Since 2006, our team has paired restorative craft with digital tools, and kept every practice we work with in direct contact with the people making their cases.</p>
          <div className="actions"><a className="button" href="/contact">Contact the lab team</a></div></div>
          <figure className="svc-photo"><img src="https://images.unsplash.com/photo-1776406987595-ba14f3510c07?auto=format&fit=crop&q=72&w=1200&h=1000" srcSet="https://images.unsplash.com/photo-1776406987595-ba14f3510c07?auto=format&fit=crop&q=72&w=1200&h=1000 1200w, https://images.unsplash.com/photo-1776406987595-ba14f3510c07?auto=format&fit=crop&q=72&w=2400&h=2000 2400w" sizes="(max-width: 900px) 100vw, 52vw" width={1200} height={1000} alt="Technician working on a prosthesis at the bench" fetchPriority="high" /><figcaption>Representative photo by <a href="https://unsplash.com/@sulyok_imaging?utm_source=dental_concepts&utm_medium=referral">Adrian Sulyok</a> on <a href="https://unsplash.com/?utm_source=dental_concepts&utm_medium=referral">Unsplash</a></figcaption></figure>
        </section>

        <section className="section about-us" aria-labelledby="about-us-heading"><div className="wrap two-col">
          <div><span className="eyebrow">Our story</span><h2 id="about-us-heading">A dental laboratory history that starts with zirconia</h2>
            <blockquote className="about-pull"><p>Every crown we make carries a quiet goal: to give someone back the confidence to smile without thinking twice.</p></blockquote></div>
          <div className="about-us-copy">
            <p>Dental Concepts began with zirconia. In 2006, partners Barry Johal and Silke Finis founded Prestige Milling Inc., one of the first Lava Milling Centers on the West Coast, making zirconia crowns for other dental labs.</p>
            <p>As digital technology moved fast and dentists asked for more esthetic restorations, that milling work grew into Dental Concepts, a full restorative dental laboratory in San Francisco.</p>
            <p>Today, German-certified dental technician Silke Finis leads our technical work, and entrepreneur Barry Johal leads the business. Together they’ve built a place where technicians enjoy the work, and you can see it in what leaves the bench.</p>
            <p>The tools keep getting better, and we keep up with them. The goal has stayed the same since day one: give every patient the best restoration we can make.</p>
          </div></div></section>
        <section className="numbers-strip" aria-label="The lab in numbers"><div className="wrap">
          <dl><div><dt>45+ years</dt><dd>Combined experience</dd></div><div><dt>100K+ cases</dt><dd>Delivered to practices</dd></div><div><dt>99%+</dt><dd>Quality rate</dd></div><div><dt>85%+</dt><dd>Repeat dentists</dd></div></dl>
        </div></section>
        <section className="section vm" aria-labelledby="vm-heading"><div className="wrap">
          <div className="center-head"><span className="eyebrow">What drives us</span><h2 id="vm-heading">Our vision and mission</h2></div>
          <div className="vm-grid">
            <article className="vm-card is-vision"><h3>Our vision</h3><p>To be the first lab San Francisco dentists call when a case needs digital precision and a careful human eye.</p></article>
            <article className="vm-card"><h3>Our mission</h3><p>To make every restoration with intention: digital tools where they help, hand finishing where it shows, and a direct line to every practice we serve.</p></article>
          </div></div></section>
        <section className="section kf" aria-labelledby="kf-heading"><div className="wrap">
          <div className="section-head"><span className="eyebrow">Why Dental Concepts</span><h2 id="kf-heading">Why dentists choose Dental Concepts</h2><p>Four things the lab is built around: care for each case, the right technology, experienced people and deep roots in milling.</p></div>
          <div className="kf-grid">
            <article className="kf-card"><span className="kf-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z" /></svg></span><h3>Personalized care</h3><p>Custom shade appointments at the lab, so each restoration is matched to your patient in person.</p></article>
            <article className="kf-card"><span className="kf-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg></span><h3>Advanced technology</h3><p>3Shape scanners and Roland milling machines for restorations made accurately and efficiently.</p></article>
            <article className="kf-card"><span className="kf-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17.5" cy="9" r="2.4" /><path d="M16 14.3c2.9.2 5 2.6 5 5.7" /></svg></span><h3>An expert dental lab team</h3><p>Experienced, certified dental technicians led by German-certified technician Silke Finis, with continuing education built into the job.</p></article>
            <article className="kf-card"><span className="kf-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg></span><h3>Milling since the early days</h3><p>Our founders opened Prestige Milling Inc. in 2006, one of the first Lava Milling Centers on the West Coast.</p></article>
          </div>
        </div></section>

        <section className="section"><div className="wrap two-col">
          <div><span className="eyebrow">Our history</span><h2>How our lab grew</h2><p>Twenty years of milling, designing and finishing restorations, one step at a time.</p></div>
          <ol className="timeline">
            <li><span className="when">2006</span><div><h3>Among the West Coast’s first Lava Milling Centers</h3><p>Barry Johal and Silke Finis found Prestige Milling Inc. and mill zirconia crowns for dental laboratories, just as digital milling starts to reshape restorative dentistry.</p></div></li>
            <li><span className="when">Next</span><div><h3>Dental Concepts is born</h3><p>As demand for esthetic restorations grows, the partners turn their milling work into a full restorative lab.</p></div></li>
            <li><span className="when">Today</span><div><h3>A restorative lab in San Francisco</h3><p>Dental Concepts makes esthetic and functional restorations, implant prostheses, digital wax-ups and printed models, with custom shade appointments at 244 9th Street.</p></div></li>
          </ol></div></section>

        <section className="section tinted"><div className="wrap team">
          <div><span className="eyebrow">The people</span><h2>Meet our dental lab team</h2><p>Dental Concepts is led by German-certified dental technician Silke Finis and entrepreneur Barry Johal. Between them, they keep every restorative decision tied to the practice and the case in front of us.</p><a className="text-link" href="/contact">Talk with the team</a></div>
          <div className="people">
            <article><span className="avatar" aria-hidden="true">SF</span><h3>Silke Finis</h3><p className="role">Technical leadership</p><p>German-certified dental technician who guides the lab’s restorative work.</p></article>
            <article><span className="avatar" aria-hidden="true">BJ</span><h3>Barry Johal</h3><p className="role">Business leadership</p><p>Entrepreneur and founding partner of Dental Concepts.</p></article>
            <article className="is-placeholder"><span className="avatar" aria-hidden="true">+</span><h3>Team member name</h3><p className="role">Role</p><p>Placeholder 1: add a short line about this person.</p></article>
            <article className="is-placeholder"><span className="avatar" aria-hidden="true">+</span><h3>Team member name</h3><p className="role">Role</p><p>Placeholder 2: add a short line about this person.</p></article>
          </div></div></section>

        <section className="section faq" aria-labelledby="faq-heading"><div className="wrap faq-grid">
          <div className="faq-head"><span className="eyebrow">FAQ</span><h2 id="faq-heading">Frequently asked questions</h2><p>Need a specific answer? Contact the lab team directly.</p><a className="text-link" href="/contact">Talk with the lab</a></div>
          <div className="faq-list">
            <details><summary>When was Dental Concepts founded?</summary><div className="faq-answer"><p>Our story began in 2006, when Barry Johal and Silke Finis founded Prestige Milling Inc., one of the first Lava Milling Centers on the West Coast. As demand for esthetic restorations grew, that milling work became Dental Concepts.</p></div></details>
            <details><summary>Who runs Dental Concepts?</summary><div className="faq-answer"><p>German-certified dental technician Silke Finis leads the lab’s technical work, and entrepreneur Barry Johal leads the business. A team of experienced, certified dental technicians works alongside them.</p></div></details>
            <details><summary>Are your restorations made in the USA?</summary><div className="faq-answer"><p>Yes. We design, make and finish restorations at our dental laboratory on 9th Street in San Francisco. Cases aren’t sent overseas.</p></div></details>
            <details><summary>What technology does the lab use?</summary><div className="faq-answer"><p>We design on 3Shape, mill on Roland equipment and accept digital impressions from iTero, Trios and similar scanners. A technician finishes every case by hand.</p></div></details>
            <details><summary>Where is the lab, and when is it open?</summary><div className="faq-answer"><p>244 9th Street, San Francisco, CA 94103. We’re open Monday to Friday, 9 AM to 5 PM.</p></div></details>
            <details><summary>Can I schedule a custom shade visit?</summary><div className="faq-answer"><p>Yes. Call <a href="tel:+14155589717">(415) 558-9717</a> to book. Visits take about 15 to 20 minutes.</p></div></details>
          </div></div></section>
        <section className="visit"><div className="wrap visit-grid">
          <div className="visit-lead"><h2>Come meet the people behind your restorations</h2><p>Visit us at 244 9th Street in San Francisco, or contact the team about lab services and shade appointments.</p><a className="button button-light" href="/contact">Contact the lab</a></div></div></section>
      </main>
      <Footer />
    </>
  );
}
