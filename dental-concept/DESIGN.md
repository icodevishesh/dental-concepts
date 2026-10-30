# Dental Concepts San Francisco

## Intent
Marketing site for a San Francisco dental laboratory. Dentists use it to see what the lab makes, download the RX form, contact the lab, and learn how to start a case.

## Brand constants (do not change)
- Logo: `assets/dental-concepts-logo.png`
- Colour: blue `#005cdf` to `#0080ff`, charcoal `#3a3a3a`, white, pale grey `#f4f7f9`. Supporting: navy `#06255c` (dark bands), sky `#e8f1ff`, enamel `#f3eee3` (product-shot panels only).
- Type: self-hosted Gilroy 400/500/600/700 for everything. Headings 600 with tight tracking; sentence case throughout.

## Design idea
The one distinctive motif is the lab's own RX form: a blue, round-cornered frame with blue group headings and ruled rows. The home page service index is laid out that way ("Crowns & veneers", "Implants & All-on-X", "Other services"), and pointing at a row shows that service's photograph beside it. The same frame is used for the contact form. The RX form itself appears as a real preview wherever a case start is discussed. Everything else stays quiet: left-aligned, ruled lists instead of cards, pill buttons, photographs that bleed to the right edge.

Avoided on purpose: all-caps eyebrow labels, decorative 01/02/03 numbering (numbers appear only on the real three-step case process), arrows on links, auto-rotating carousel, scroll animations.

## Structure
- Header: logo, "Lab services" panel listing all 11 services in three columns, About, Gallery, RX form, Contact, phone, "Send a case".
- Home: hero, lab facts, service index, collaboration, starting a case, lab story, FAQ, visit band.
- Services: three category sections with a photograph and ruled service rows.
- Service pages (11): name, lead, photo, four facts, scope, sibling services, FAQ.
- About, Gallery (with photo credits), RX form, Contact, Send a case.

## Photography
Service photographs are hotlinked from Unsplash (`images.unsplash.com`, cropped by URL parameters) and are representative, not Dental Concepts cases. Each is credited in its caption and on `gallery.html#credits`. There was no suitable free photograph of a gold crown, so that page keeps the lab's own image, shown small on an enamel panel rather than stretched. Replace any of these with the lab's own photography when available: one `<img>` per use, crops are set by `w`/`h` in the URL.

## Content authority
Company history, team, address, phone, email, hours, shade appointments, equipment, and service categories come from dentalconceptssf.com. No prices, clinical outcomes, or submission integrations are invented. The site has no case portal and collects no patient information; the contact form only opens an email draft.
