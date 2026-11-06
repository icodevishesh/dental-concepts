const aiQuery =
  'Tell me about Dental Concepts, the dental laboratory at 244 9th Street, San Francisco (dentalconceptssf.com): what restorations it makes, how to send a case, and typical turnaround.';
const aiQ = encodeURIComponent(aiQuery);

export default function Footer({ photoCredits = false }: { photoCredits?: boolean }) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-main">
          <div className="footer-about">
            <a className="footer-logo" href="/">
              <img src="/assets/dental-concepts-logo-dc.png" width={463} height={194} alt="Dental Concepts home" loading="lazy" />
            </a>
            <p>A San Francisco dental laboratory for restorative work, digital services, and personal collaboration with dental practices.</p>
          </div>
          <div className="footer-column">
            <h2>Lab services</h2>
            <a href="/services">All lab services</a>
            <a href="/services#crowns">Crowns &amp; veneers</a>
            <a href="/services#implants">Implants &amp; All-on-X</a>
            <a href="/digital-wax-up">Digital wax up</a>
            <a href="/custom-shades">Custom shades</a>
          </div>
          <div className="footer-column">
            <h2>The lab</h2>
            <a href="/about">About</a>
            <a href="/gallery">Gallery</a>
            <a href="/blog">Articles</a>
            <a href="/guides">Guides</a>
            <a href="/contact">Contact</a>
          </div>
          <div className="footer-column">
            <h2>Reach us</h2>
            <a href="tel:+18007005227">1-800-700-LABS (5227)</a>
            <a href="mailto:accounts@dentalconceptssf.com">New doctor accounts</a>
            <a href="mailto:photos@dentalconceptssf.com">Shade photographs</a>
            <a href="https://maps.google.com/?q=244+9th+Street+San+Francisco+CA+94103" target="_blank" rel="noopener noreferrer">244 9th Street<br />San Francisco, CA 94103</a>
            <span>Monday to Friday, 9 AM to 5 PM</span>
          </div>
        </div>
        <div className="footer-ai">
          <span>Ask AI about the lab</span>
          <a href={`https://chatgpt.com/?q=${aiQ}`} target="_blank" rel="noopener noreferrer">ChatGPT<span className="visually-hidden"> (opens in a new tab)</span></a>
          <a href={`https://www.perplexity.ai/search?q=${aiQ}`} target="_blank" rel="noopener noreferrer">Perplexity<span className="visually-hidden"> (opens in a new tab)</span></a>
          <a href={`https://claude.ai/new?q=${aiQ}`} target="_blank" rel="noopener noreferrer">Claude<span className="visually-hidden"> (opens in a new tab)</span></a>
          <a href={`https://grok.com/?q=${aiQ}`} target="_blank" rel="noopener noreferrer">Grok<span className="visually-hidden"> (opens in a new tab)</span></a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Dental Concepts, San Francisco, California</span>
          {photoCredits ? (
            <a href="/gallery/credits">Photo credits</a>
          ) : (
            <span className="footer-partner">Digital Partner <a href="https://www.vuilive.com" target="_blank" rel="noopener">VUILIVE</a></span>
          )}
          <a href="#main">Back to top</a>
        </div>
      </div>
    </footer>
  );
}
