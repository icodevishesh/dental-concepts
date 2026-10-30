# SEO launch setup

Every HTML page includes a unique title and description, social sharing title and description, index/follow robots metadata, a single H1, semantic landmarks, and JSON-LD. Service pages include breadcrumbs and Service structured data; business identity/contact data is based on the reference lab’s published information.

Before deploying to the final host:

1. Confirm this site is authorized to represent Dental Concepts and that the public business details and contact routes are current.
2. Set the final public domain, then add a self-referencing absolute canonical URL to every page. Do not use the source reference domain as canonical unless it is the actual destination domain.
3. Add absolute `og:url` and `og:image` values using approved production URLs, and replace the local page references in JSON-LD with absolute `url` values.
4. Generate `sitemap.xml` with the final HTTPS URLs and add the sitemap location to `robots.txt`.
5. Set up Google Search Console and Bing Webmaster Tools for the final domain; submit the sitemap and validate the structured data after deployment.
6. Verify HTTPS, redirects, mobile behavior, page speed, and that no staging `noindex` rule remains on production.

The final public domain was not provided, so canonical URLs, absolute social image URLs, sitemap URLs, and production JSON-LD URLs are intentionally omitted instead of pointing search engines at a guessed address.
