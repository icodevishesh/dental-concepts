export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="logo" href="/">
          <img src="/assets/dental-concepts-logo-dc.png" width={463} height={194} alt="Dental Concepts home" />
        </a>
        <button className="nav-toggle" type="button" aria-expanded="false" aria-controls="nav">Menu</button>
        <nav id="nav" aria-label="Main navigation">
          <div className="nav-services">
            <button className="nav-services-btn" type="button" aria-expanded="false" aria-controls="services-panel">
              Lab services{' '}
              <svg viewBox="0 0 12 8" width="12" height="8" aria-hidden="true"><path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div className="services-panel" id="services-panel">
              <div className="panel-col">
                <p className="panel-label"><a href="/services#crowns">Crowns &amp; veneers</a></p>
                <ul>
                  <li><a href="/full-contour-zirconia-crowns">Full contour zirconia crowns</a></li>
                  <li><a href="/layered-porcelain-crowns">Layered porcelain crowns</a></li>
                  <li><a href="/lithium-disilicate">Lithium disilicate (E.max)</a></li>
                  <li><a href="/gold-crowns">Gold crowns</a></li>
                </ul>
              </div>
              <div className="panel-col">
                <p className="panel-label"><a href="/services#implants">Implants &amp; All-on-X</a></p>
                <ul>
                  <li><a href="/full-arch-restorations">Full arch restorations</a></li>
                  <li><a href="/implant-crowns">Implant crowns</a></li>
                  <li><a href="/custom-abutments">Custom abutments</a></li>
                  <li><a href="/temporary-crowns-abutments">Temporary crowns &amp; abutments</a></li>
                </ul>
              </div>
              <div className="panel-col">
                <p className="panel-label"><a href="/services#other">Other services</a></p>
                <ul>
                  <li><a href="/digital-wax-up">Digital wax up</a></li>
                  <li><a href="/model-printing">Model printing</a></li>
                  <li><a href="/custom-shades">Custom shades</a></li>
                </ul>
              </div>
              <a className="panel-all" href="/services">See all lab services</a>
            </div>
          </div>
          <a href="/about">About</a>
          <div className="nav-drop">
            <button className="nav-drop-btn" type="button" aria-expanded="false" aria-controls="learning-menu">
              Learning{' '}
              <svg viewBox="0 0 12 8" width="12" height="8" aria-hidden="true"><path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div className="nav-drop-menu" id="learning-menu">
              <a href="/blog">Articles</a>
              <a href="/guides">Guides</a>
              <a href="/events">Events</a>
            </div>
          </div>
          <a href="/contact">Contact</a>
          <div className="nav-drop nav-quick">
            <button className="nav-drop-btn" type="button" aria-expanded="false" aria-controls="quick-menu">
              Quick links{' '}
              <svg viewBox="0 0 12 8" width="12" height="8" aria-hidden="true"><path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div className="nav-drop-menu quick-menu" id="quick-menu">
              <p className="quick-label">Tools</p>
              <a href="/upload-case">
                <span className="q-ico"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M7 18a4.5 4.5 0 0 1-.8-8.93A6 6 0 0 1 17.7 8.1 4 4 0 0 1 17 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 12v8M8.5 15.5 12 12l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                Upload a case
              </a>
              <a href="/assets/digital-rx.pdf" download>
                <span className="q-ico"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M14 3v5h5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg></span>
                Download RX form
              </a>
              <a href="/shipping-label">
                <span className="q-ico"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><circle cx="7" cy="17.5" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="17" cy="17.5" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg></span>
                Shipping label
              </a>
              <a href="/track-case">
                <span className="q-ico"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><circle cx="12" cy="9.8" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg></span>
                Track case
              </a>
            </div>
          </div>
        </nav>
        <a className="header-phone" href="tel:+18007005227">1-800-700-LABS</a>
        <a className="button button-small" href="/send-case">Send a case</a>
      </div>
    </header>
  );
}
