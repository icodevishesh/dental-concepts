import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dental Laboratory in San Francisco, USA | Dental Concepts",
  description:
    "Partner with a San Francisco dental lab for ceramic crowns, implant restorations, digital planning, and custom shade matching. Connect with our dental laboratory team.",
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What does Dental Concepts make?", acceptedAnswer: { "@type": "Answer", text: "Dental Concepts is a dental lab in San Francisco that makes full contour zirconia crowns, layered porcelain crowns, lithium disilicate (E.max) veneers, inlays, onlays and crowns, and gold crowns. We also make full arch and All-on-X prostheses, implant crowns, custom abutments, temporaries, digital wax-ups, printed models and custom shades. Browse lab services." } },
    { "@type": "Question", name: "Where is your dental laboratory?", acceptedAnswer: { "@type": "Answer", text: "Our dental laboratory is at 244 9th Street, San Francisco, CA 94103, USA. We’re open Monday to Friday, 9 AM to 5 PM. Call 1-800-700-LABS (5227) to reach the team." } },
    { "@type": "Question", name: "How long does a case take?", acceptedAnswer: { "@type": "Answer", text: "Our RX form lists restorations at 10 to 15 days and implant cases at 3 to 4 weeks. Full contour zirconia is quicker, at 7 in-lab days for one to three units. Working days don’t include weekends, holidays or shipping, so confirm timing with the lab before you schedule the patient." } },
    { "@type": "Question", name: "Do you offer rush service?", acceptedAnswer: { "@type": "Answer", text: "Yes, on most products, for up to 4 units. Pre-schedule it with the Lab Manager or Implant Coordinator at (415) 558-9716. Cases needed within 7 business days carry a $100 per unit surcharge, with an additional $100 per unit within 5 days. Anything under 3 days needs management approval and a quote." } },
    { "@type": "Question", name: "Can I send a digital scan?", acceptedAnswer: { "@type": "Answer", text: "Yes. Tick “Digital imp scan” on the RX form. We work with scans from iTero, Trios and similar systems. Digital implant cases need a full arch gingival scan without the healing abutment. Contact the lab to confirm how to send your files." } },
    { "@type": "Question", name: "How do I book a custom shade appointment?", acceptedAnswer: { "@type": "Answer", text: "Call (415) 558-9717. Shade visits take about 15 to 20 minutes at our lab on 9th Street. When your patient can’t come in, email shade photos to photos@dentalconceptssf.com instead." } },
    { "@type": "Question", name: "What warranty do your restorations carry?", acceptedAnswer: { "@type": "Answer", text: "We repair or replace a failed final fixed restoration at no charge for materials and workmanship for up to one year (restrictions apply). Provisionals and auxiliary services are covered for six months, and implant abutments follow the implant company’s guidelines. The restoration needs to be returned to the lab." } },
    { "@type": "Question", name: "How can a new doctor open an account?", acceptedAnswer: { "@type": "Answer", text: "Email accounts@dentalconceptssf.com or use our contact form. Then download the RX form, and you’re ready to send your first case." } },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Header />
      <main id="main">
        <section className="hero"><div className="hero-copy">
          <div className="proof" data-proof role="group" aria-roledescription="carousel" aria-label="About the lab">
            <div className="proof-slides">
              <p className="proof-slide is-on">Restorative lab in San Francisco since 2006</p>
              <p className="proof-slide">3Shape scanning and Roland milling</p>
              <p className="proof-slide">Custom shade visits in 15 to 20 minutes</p>
            </div>
            <div className="proof-ctrl">
              <button className="proof-prev" type="button" aria-label="Previous fact"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
              <button className="proof-next" type="button" aria-label="Next fact"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            </div>
            <p className="proof-status visually-hidden" aria-live="polite"></p>
          </div>
          <h1>Your dental lab in San Francisco. <span className="hero-h1-sub">100K+ Cases Successfully Delivered.</span></h1>
          <p className="hero-lead">Dental Concepts is a dental laboratory in the USA, at 244 9th Street, San Francisco. We make crowns, veneers, implant restorations and All-on-X prostheses for dental practices, with digital design and hand finishing under one roof.</p>
          <div className="actions"><Link className="button" href="/send-case">Send a case</Link><Link className="button button-outline" href="/upload-case">Upload a case</Link></div>
          <p className="hero-meta"><span>Since 2006</span><span>3Shape design and Roland milling</span><span>244 9th Street, San Francisco</span></p>
        </div>
          <figure className="hero-photo">
            <Image
              src="https://images.unsplash.com/photo-1590424693420-634a0b0b782c?auto=format&fit=crop&q=72&w=1400&h=1050"
              sizes="(max-width: 900px) 100vw, 56vw"
              width={1400}
              height={1050}
              alt="Technician finishing a crown by hand"
              priority
            />
            <video className="hero-video" autoPlay muted loop playsInline preload="metadata" poster="https://images.unsplash.com/photo-1590424693420-634a0b0b782c?auto=format&fit=crop&q=72&w=1400&h=1050" aria-hidden="true">
              <source src="https://videos.pexels.com/video-files/8704970/8704970-hd_1280_720_30fps.mp4" type="video/mp4" />
            </video>
          </figure>
        </section>

        <section className="value" aria-labelledby="value-heading"><div className="value-sticky">
          <div className="value-tiles" aria-hidden="true">
            <span className="vt vt1"><Image src="/assets/products/full-contour-zirconia-crowns.webp" width={1254} height={1254} alt="" loading="lazy" /></span>
            <span className="vt vt2"><Image src="/assets/products/full-arch-restorations.webp" width={1254} height={1254} alt="" loading="lazy" /></span>
            <span className="vt vt3"><Image src="/assets/products/lithium-disilicate.webp" width={1254} height={1254} alt="" loading="lazy" /></span>
            <span className="vt vt4"><Image src="/assets/products/custom-abutments.webp" width={1254} height={1254} alt="" loading="lazy" /></span>
            <span className="vt vt5"><Image src="/assets/products/layered-porcelain-crowns.webp" width={1254} height={1254} alt="" loading="lazy" /></span>
            <span className="vt vt6"><Image src="/assets/products/digital-wax-up.webp" width={1254} height={1254} alt="" loading="lazy" /></span>
          </div>
          <div className="value-copy"><span className="eyebrow">What we make</span><h2 id="value-heading">One dental laboratory for the whole case</h2><p>Crowns and veneers, implant prostheses and digital planning, all made at our San Francisco dental laboratory. The technician designing your case is one phone call away.</p>
            <div className="actions"><Link className="button" href="/services">Browse lab services</Link><Link className="button button-outline" href="/upload-case">Upload a case</Link></div></div>
        </div></section>

        <section className="showreel" aria-labelledby="reel-heading"><div className="wrap">
          <div className="reel-cover"><Image src="/assets/lab-technicians.webp" width={1672} height={941} alt="" loading="lazy" decoding="async" />
            <div className="reel-copy"><h2 id="reel-heading">A quiet look at the bench</h2><p>A short, silent clip of a restoration being shaped and finished by hand.</p>
              <button className="reel-btn" type="button" data-reel><span className="reel-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" /></svg></span>Watch the film</button></div>
          </div>
        </div></section>
        <div className="reel-dialog" id="reel-dialog" role="dialog" aria-modal="true" aria-labelledby="reel-title" hidden>
          <div className="reel-backdrop" data-reel-close></div>
          <div className="reel-panel"><h2 className="visually-hidden" id="reel-title">Lab film</h2>
            <video playsInline muted loop preload="none" poster="/assets/lab-technicians.webp" data-src="https://videos.pexels.com/video-files/8704970/8704970-hd_1280_720_30fps.mp4" aria-describedby="reel-desc"></video>
            <p className="reel-desc" id="reel-desc">Silent footage: a technician shapes and finishes a dental restoration at the bench. There is no narration. Representative stock footage, credited on the <Link href="/gallery#credits">gallery page</Link>.</p>
            <div className="reel-bar"><button className="reel-play" type="button">Pause</button><button className="reel-mute" type="button">Unmute</button><button className="reel-close" type="button" data-reel-close>Close</button></div>
          </div>
        </div>

        <section className="manifesto" aria-label="How we work"><div className="manifesto-sticky"><div className="wrap">
          <p className="manifesto-text">We’re a San Francisco dental lab where the technician designing your crown is one phone call away. We go digital where it helps, finish by hand where it shows, and match the shade in person when a tab can’t tell the whole story.</p>
          <div className="manifesto-tags"><span className="tag t1">Since 2006</span><span className="tag t2">Shade matched</span><span className="tag t3">Hand finished</span></div>
        </div></div></section>

        <section className="benefits" data-scene="benefits" aria-labelledby="benefits-heading"><div className="benefits-sticky">
          <div className="wrap benefits-head"><div><span className="eyebrow">Why Dental Concepts</span><h2 id="benefits-heading">Why dentists choose Dental Concepts</h2></div><span className="benefit-meter" aria-hidden="true"><span></span></span></div>
          <div className="benefit-view"><ol className="benefit-strip">
            <li className="benefit"><div className="benefit-img"><Image src="https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?auto=format&fit=crop&q=72&w=960&h=720" width={960} height={720} alt="Gloved hand reviewing a 3D dental scan on a tablet" loading="lazy" decoding="async" /></div><div className="benefit-copy"><span className="benefit-no">01</span><h3>Digital from scan to mill</h3><p>Send intraoral scans from iTero, Trios and similar systems. We design on 3Shape, mill on Roland equipment and print models when the case needs them.</p></div></li>
            <li className="benefit is-light"><div className="benefit-img"><Image src="https://images.unsplash.com/photo-1771442873035-474765b40ac6?auto=format&fit=crop&q=72&w=960&h=720" width={960} height={720} alt="Gloved hand holding a ceramic crown on an implant abutment" loading="lazy" decoding="async" /></div><div className="benefit-copy"><span className="benefit-no">02</span><h3>Materials matched to the tooth</h3><p>Zirconia, lithium disilicate, layered porcelain, gold alloys and titanium, each chosen for strength, esthetics and how it will hold up in your patient’s mouth.</p></div></li>
            <li className="benefit"><div className="benefit-img"><Image src="https://images.unsplash.com/photo-1619691249147-c5689d88016b?auto=format&fit=crop&q=72&w=960&h=720" width={960} height={720} alt="Two people reviewing a dental scan together on a tablet" loading="lazy" decoding="async" /></div><div className="benefit-copy"><span className="benefit-no">03</span><h3>Case updates without the chasing</h3><p>Clear communication at every stage, case status updates and a direct line to the people building your case.</p></div></li>
            <li className="benefit is-light"><div className="benefit-img"><Image src="https://images.pexels.com/photos/6627599/pexels-photo-6627599.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=960&h=720" width={960} height={720} alt="Ceramist layering porcelain beside a shade guide" loading="lazy" decoding="async" /></div><div className="benefit-copy"><span className="benefit-no">04</span><h3>Shade matched in person</h3><p>Bring your patient to 244 9th Street for a 15 to 20 minute shade visit, or email shade photos before we start the case.</p></div></li>
          </ol></div>
        </div></section>

        <section className="process" data-scene="process" aria-labelledby="process-heading"><div className="process-sticky"><div className="wrap">
          <div className="process-head"><span className="eyebrow">How a case moves</span><h2 id="process-heading">Four stages, one RX form</h2></div>
          <div className="process-tabs" role="tablist" aria-label="Case stages">
            <button className="process-tab" type="button" role="tab" id="pt-0" aria-controls="pp-0" aria-selected="true">Plan &amp; prescribe</button>
            <button className="process-tab" type="button" role="tab" id="pt-1" aria-controls="pp-1" aria-selected="false">Confirm &amp; send</button>
            <button className="process-tab" type="button" role="tab" id="pt-2" aria-controls="pp-2" aria-selected="false">Design &amp; make</button>
            <button className="process-tab" type="button" role="tab" id="pt-3" aria-controls="pp-3" aria-selected="false">Finish &amp; return</button>
          </div>
          <div className="process-panels">
            <article className="process-panel is-on" id="pp-0" role="tabpanel" aria-labelledby="pt-0"><div className="pp-copy"><span className="pp-no">Stage 1 of 4</span><h3>Plan the case and fill in the RX</h3><p>Choose the restoration with your team, then complete our two-page RX form: doctor details, restoration and implant choices, shade, stump shade and everything you’re sending with the case. All anterior cases need a pre-op or study model.</p><a className="button" href="/assets/digital-rx.pdf" download>Download the RX form</a>{/* kept as <a>: file download, not a route */}</div><div className="pp-img is-doc"><Image src="/assets/rx-form-preview.webp" width={900} height={693} alt="First page of the Dental Concepts RX form" loading="lazy" /></div></article>
            <article className="process-panel" id="pp-1" role="tabpanel" aria-labelledby="pt-1"><div className="pp-copy"><span className="pp-no">Stage 2 of 4</span><h3>Confirm how to send it</h3><p>Call the lab to confirm shipping or digital submission before you send any records. Need a label? Request one, and we’ll reply with the label and carrier details.</p><Link className="button" href="/shipping-label">Shipping label</Link></div><div className="pp-img"><Image src="/assets/products/model-printing.webp" width={1254} height={1254} alt="Printed dental models" loading="lazy" /></div></article>
            <article className="process-panel" id="pp-2" role="tabpanel" aria-labelledby="pt-2"><div className="pp-copy"><span className="pp-no">Stage 3 of 4</span><h3>Designed digitally, finished by hand</h3><p>We design on 3Shape, mill on Roland equipment, and a technician finishes every case, layering ceramic by hand where the restoration calls for it. Every case goes through a final quality check before it ships.</p><Link className="button" href="/about">Meet the lab</Link></div><div className="pp-img"><Image src="/assets/lab-technicians.webp" width={1672} height={941} alt="Technicians finishing restorations and reviewing a digital design" loading="lazy" /></div></article>
            <article className="process-panel" id="pp-3" role="tabpanel" aria-labelledby="pt-3"><div className="pp-copy"><span className="pp-no">Stage 4 of 4</span><h3>Back to your practice</h3><p>Our RX form lists restorations at 10 to 15 days and implant cases at 3 to 4 weeks. These are in-lab working days, so weekends, holidays and shipping time come on top. Need it sooner? Rush service is available on most products when you pre-schedule it.</p><Link className="button" href="/upload-case">Upload a case</Link></div><div className="pp-img"><Image src="/assets/products/full-arch-restorations.webp" width={1254} height={1254} alt="Finished full arch restoration" loading="lazy" /></div></article>
          </div>
        </div></div></section>

        <section className="stack" aria-labelledby="stack-heading"><div className="wrap stack-head"><span className="eyebrow">Lab services</span><h2 id="stack-heading">Six ways we work with your practice</h2></div>
          <div className="stack-list">
            <article className="stack-panel is-dark" style={{ "--bg": "#005cdf", "--i": 0 } as React.CSSProperties}><div className="wrap stack-inner"><div className="stack-copy"><span className="stack-no">/01</span><h3>Full contour zirconia crowns</h3><p>Milled from one solid piece of zirconia, with no layered porcelain on top. We design the shape, contacts and bite digitally, then mill, sinter and hand-finish each crown. One to three units take 7 in-lab days.</p><Link className="button button-light" href="/full-contour-zirconia-crowns">Get started</Link></div><div className="stack-img"><Image src="/assets/products/full-contour-zirconia-crowns.webp" width={1254} height={1254} alt="Full contour zirconia crowns" loading="lazy" /></div></div></article>
            <article className="stack-panel is-dark" style={{ "--bg": "#06255c", "--i": 1 } as React.CSSProperties}><div className="wrap stack-inner"><div className="stack-copy"><span className="stack-no">/02</span><h3>Layered porcelain crowns</h3><p>A ceramist builds porcelain by hand over a milled zirconia core, shaping translucency for front teeth and shade-critical cases.</p><Link className="button button-light" href="/layered-porcelain-crowns">Get started</Link></div><div className="stack-img"><Image src="/assets/products/layered-porcelain-crowns.webp" width={1254} height={1254} alt="Layered porcelain crowns" loading="lazy" /></div></div></article>
            <article className="stack-panel" style={{ "--bg": "#f3eee3", "--i": 2 } as React.CSSProperties}><div className="wrap stack-inner"><div className="stack-copy"><span className="stack-no">/03</span><h3>Lithium disilicate (E.max)</h3><p>A glass ceramic for veneers, inlays, onlays and crowns, when you want strength and a lifelike look in one material.</p><Link className="button" href="/lithium-disilicate">Get started</Link></div><div className="stack-img"><Image src="/assets/products/lithium-disilicate.webp" width={1254} height={1254} alt="Lithium disilicate restorations" loading="lazy" /></div></div></article>
            <article className="stack-panel is-dark" style={{ "--bg": "#3a3a3a", "--i": 3 } as React.CSSProperties}><div className="wrap stack-inner"><div className="stack-copy"><span className="stack-no">/04</span><h3>Implants &amp; All-on-X</h3><p>Full arch prostheses, screw-retained implant crowns, custom abutments and temporaries. Our RX form lists implant cases at 3 to 4 weeks.</p><Link className="button button-light" href="/full-arch-restorations">Get started</Link></div><div className="stack-img"><Image src="/assets/products/full-arch-restorations.webp" width={1254} height={1254} alt="Full arch implant restoration" loading="lazy" /></div></div></article>
            <article className="stack-panel" style={{ "--bg": "#e8f1ff", "--i": 4 } as React.CSSProperties}><div className="wrap stack-inner"><div className="stack-copy"><span className="stack-no">/05</span><h3>Digital wax-up &amp; model printing</h3><p>Preview the planned result with a digital diagnostic wax-up, then get resin models printed from your scan.</p><Link className="button" href="/digital-wax-up">Get started</Link></div><div className="stack-img"><Image src="/assets/products/digital-wax-up.webp" width={1254} height={1254} alt="Digital wax up model" loading="lazy" /></div></div></article>
            <article className="stack-panel is-dark" style={{ "--bg": "#0049b8", "--i": 5 } as React.CSSProperties}><div className="wrap stack-inner"><div className="stack-copy"><span className="stack-no">/06</span><h3>Custom shades</h3><p>Bring your patient to 244 9th Street for a 15 to 20 minute shade visit, or email shade photos to the lab.</p><Link className="button button-light" href="/custom-shades">Get started</Link></div><div className="stack-img"><Image src="/assets/products/crowns-veneers.webp" width={1122} height={1402} alt="Crowns and veneers in natural shades" loading="lazy" /></div></div></article>
          </div></section>

        <section className="section quotes" aria-labelledby="quotes-heading"><div className="wrap">
          <div className="section-head"><span className="eyebrow">Testimonials</span><h2 id="quotes-heading">What dentists say about the lab</h2><p>In their own words, from practices that send us their cases.</p></div>
          <div className="carousel" data-carousel role="region" aria-roledescription="carousel" aria-label="Testimonials">
            <div className="carousel-view"><div className="carousel-track">
              <figure className="carousel-slide quote-card is-placeholder" role="group" aria-roledescription="slide" aria-label="1 of 3"><blockquote><p>Placeholder 1: paste a real quote from a dentist here, in their own words.</p></blockquote><figcaption><strong>Dentist’s name</strong><span>Practice name, city</span></figcaption></figure>
              <figure className="carousel-slide quote-card is-placeholder" role="group" aria-roledescription="slide" aria-label="2 of 3"><blockquote><p>Placeholder 2: paste a real quote from a dentist here, in their own words.</p></blockquote><figcaption><strong>Dentist’s name</strong><span>Practice name, city</span></figcaption></figure>
              <figure className="carousel-slide quote-card is-placeholder" role="group" aria-roledescription="slide" aria-label="3 of 3"><blockquote><p>Placeholder 3: paste a real quote from a dentist here, in their own words.</p></blockquote><figcaption><strong>Dentist’s name</strong><span>Practice name, city</span></figcaption></figure>
            </div></div>
            <div className="carousel-ctrl"><button className="carousel-prev" type="button" aria-label="Previous testimonial"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button><p className="carousel-status" aria-live="polite">Slide 1 of 3</p><button className="carousel-next" type="button" aria-label="Next testimonial"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button></div>
          </div>
        </div></section>

        <section className="section mosaic-section" aria-labelledby="mosaic-heading"><div className="wrap">
          <div className="center-head"><span className="eyebrow">From the bench</span><h2 id="mosaic-heading">Restorations we make every week</h2><p>Representative photos for now. Our own case gallery is on the way.</p></div>
          <ul className="mosaic">
            <li className="mosaic-item is-tall"><Link href="/full-contour-zirconia-crowns"><Image src="/assets/products/full-contour-zirconia-crowns.webp" width={1254} height={1254} alt="Full contour zirconia crowns" loading="lazy" /></Link></li>
            <li className="mosaic-item"><Link href="/implant-crowns"><Image src="/assets/products/implant-crowns.webp" width={1254} height={1254} alt="Implant crowns" loading="lazy" /></Link></li>
            <li className="mosaic-item"><Link href="/custom-abutments"><Image src="/assets/products/custom-abutments.webp" width={1254} height={1254} alt="Custom abutments" loading="lazy" /></Link></li>
            <li className="mosaic-item is-wide"><Link href="/about"><Image src="/assets/lab-technicians.webp" width={1672} height={941} alt="Technicians at work in the lab" loading="lazy" /></Link></li>
            <li className="mosaic-item"><Link href="/temporary-crowns-abutments"><Image src="/assets/products/temporary-crowns-abutments.webp" width={1254} height={1254} alt="Temporary crowns and abutments" loading="lazy" /></Link></li>
            <li className="mosaic-item"><Link href="/model-printing"><Image src="/assets/products/model-printing.webp" width={1254} height={1254} alt="Printed models" loading="lazy" /></Link></li>
            <li className="mosaic-item is-tall"><Link href="/lithium-disilicate"><Image src="/assets/products/lithium-disilicate.webp" width={1254} height={1254} alt="Lithium disilicate restorations" loading="lazy" /></Link></li>
            <li className="mosaic-item"><Link href="/gold-crowns" className="is-gold"><Image src="/assets/gold-crown.webp" width={478} height={454} alt="Gold crown" loading="lazy" /></Link></li>
          </ul></div></section>

        <section className="section tinted articles-preview" aria-labelledby="articles-heading"><div className="wrap">
          <div className="arc-head"><div><span className="eyebrow">From the lab</span><h2 id="articles-heading">Practical notes for your team</h2></div><Link className="text-link" href="/blog">All articles</Link></div>
          <div className="ap-grid">
            <Link className="ap-card" href="/blog/how-to-complete-the-rx-form"><span className="ap-img is-doc"><Image src="/assets/rx-form-preview.webp" width={900} height={693} alt="" loading="lazy" /></span><small>Working with the lab</small><strong>How to complete the Dental Concepts RX form</strong></Link>
            <Link className="ap-card" href="/blog/custom-shade-appointments"><span className="ap-img"><Image src="/assets/products/crowns-veneers.webp" width={1122} height={1402} alt="" loading="lazy" /></span><small>Custom shades</small><strong>Custom shade appointments: what to expect</strong></Link>
            <Link className="ap-card" href="/blog/crown-materials-overview"><span className="ap-img"><Image src="/assets/products/lithium-disilicate.webp" width={1254} height={1254} alt="" loading="lazy" /></span><small>Crowns &amp; veneers</small><strong>Zirconia, layered porcelain, E.max, or gold</strong></Link>
          </div></div></section>

        <section className="section faq" aria-labelledby="faq-heading"><div className="wrap faq-grid">
          <div className="faq-head"><span className="eyebrow">FAQ</span><h2 id="faq-heading">Before you send a case</h2><p>Need a specific answer? Call or email the lab team directly.</p><Link className="text-link" href="/contact">Talk with the lab</Link></div>
          <div className="faq-list">
            <details><summary>What does Dental Concepts make?</summary><div className="faq-answer"><p>Dental Concepts is a dental lab in San Francisco that makes full contour zirconia crowns, layered porcelain crowns, lithium disilicate (E.max) veneers, inlays, onlays and crowns, and gold crowns. We also make full arch and All-on-X prostheses, implant crowns, custom abutments, temporaries, digital wax-ups, printed models and custom shades. <Link href="/services">Browse lab services.</Link></p></div></details>
            <details><summary>Where is your dental laboratory?</summary><div className="faq-answer"><p>Our dental laboratory is at 244 9th Street, San Francisco, CA 94103, USA. We’re open Monday to Friday, 9 AM to 5 PM. Call <a href="tel:+18007005227">1-800-700-LABS</a> (5227) to reach the team.</p></div></details>
            <details><summary>How long does a case take?</summary><div className="faq-answer"><p>Our RX form lists restorations at 10 to 15 days and implant cases at 3 to 4 weeks. Full contour zirconia is quicker, at 7 in-lab days for one to three units. Working days don’t include weekends, holidays or shipping, so confirm timing with the lab before you schedule the patient.</p></div></details>
            <details><summary>Do you offer rush service?</summary><div className="faq-answer"><p>Yes, on most products, for up to 4 units. Pre-schedule it with the Lab Manager or Implant Coordinator at <a href="tel:+14155589716">(415) 558-9716</a>. Cases needed within 7 business days carry a $100 per unit surcharge, with an additional $100 per unit within 5 days. Anything under 3 days needs management approval and a quote.</p></div></details>
            <details><summary>Can I send a digital scan?</summary><div className="faq-answer"><p>Yes. Tick “Digital imp scan” on the RX form. We work with scans from iTero, Trios and similar systems. Digital implant cases need a full arch gingival scan without the healing abutment. Contact the lab to confirm how to send your files.</p></div></details>
            <details><summary>How do I book a custom shade appointment?</summary><div className="faq-answer"><p>Call <a href="tel:+14155589717">(415) 558-9717</a>. Shade visits take about 15 to 20 minutes at our lab on 9th Street. When your patient can’t come in, email shade photos to <a href="mailto:photos@dentalconceptssf.com">photos@dentalconceptssf.com</a> instead.</p></div></details>
            <details><summary>What warranty do your restorations carry?</summary><div className="faq-answer"><p>We repair or replace a failed final fixed restoration at no charge for materials and workmanship for up to one year (restrictions apply). Provisionals and auxiliary services are covered for six months, and implant abutments follow the implant company’s guidelines. The restoration needs to be returned to the lab.</p></div></details>
            <details><summary>How can a new doctor open an account?</summary><div className="faq-answer"><p>Email <a href="mailto:accounts@dentalconceptssf.com">accounts@dentalconceptssf.com</a> or use our <Link href="/contact">contact form</Link>. Then download the RX form, and you’re ready to send your first case.</p></div></details>
          </div></div></section>
      </main>
      <Footer />
    </>
  );
}
