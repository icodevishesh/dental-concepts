# Dental Concepts San Francisco website

Static, responsive marketing site for the Dental Concepts dental laboratory. No build step: open `index.html`, or upload the folder to any web host.

## Pages
- `index.html`: home
- `services.html`: lab services, one card grid per category
- Eleven service pages: zirconia, layered porcelain, lithium disilicate, gold, full arch, implant crowns, custom abutments, temporaries, digital wax up, model printing, custom shades
- `about.html`: about us, vision and mission, key features, history, team
- `blog.html`, `guides.html` and three `blog-*.html` articles
- `rx.html`, `send-case.html`, `contact.html`
- `gallery.html`: photo credits only (hidden from search engines)
- `events.html`, `customer-stories.html`: empty "coming soon" pages, not linked from the menu and hidden from search engines

## Files
- `style.css`: all styles. Later blocks refine earlier ones, so read from the bottom when changing a component.
- `app.js`: menu dropdowns, hero video pause, contact form (opens an email draft, sends nothing itself)
- `assets/`: logo (dark and light), fonts (Gilroy, WOFF2 with TTF fallback), RX form PDF and preview, gold crown photo, favicon, share image

## Before launch
- **Placeholders to fill or remove:** three testimonial cards on the home page, two team cards on the About page.
- **Photography:** service photos load from Unsplash and the hero video from Pexels. They are representative stock, credited on `gallery.html`. Replace with the lab's own where possible, and save copies into `assets/` so the site does not depend on other servers.
- **Facts to confirm with the lab:** turnaround times (taken from the RX form), the vision and mission wording, the three articles, and the local phone number (website says 415-558-9717, RX form says 9716).
- **Domain-dependent SEO:** canonical URLs, absolute `og:image` and `og:url`, sitemap. See `SEO-PUBLISH-CHECKLIST.md`.
- The site collects no patient information and has no case portal.
