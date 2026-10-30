# Dental Concepts admin panel

Open `admin/index.html` (on the live site: `/admin/`). The sections are:

- **Overview**: new leads, new case uploads, published posts and upcoming events.
- **Blog**:
  - Posts: create, edit, preview and delete, with a rich-text editor, cover image, category and SEO fields.
  - Authors: name, role, photo and bio. Choose one or more authors on each post, and their bios appear at the end of the article.
- **Leads**: every Contact page inquiry. You can set each lead's status, add internal notes and export to CSV.
- **Digital uploads**: cases sent from the Upload a case page. Each one shows the doctor details, restoration, scan files, RX form and photos.
- **Testimonials**: dentists' quotes. Published quotes ticked "Show in the home page carousel" replace the placeholder cards on the home page.
- **Events**: published future events show on the Events page.
- **Data & backup**: download or restore everything as one JSON file.

## Files

| File | Purpose |
|---|---|
| `admin/index.html`, `admin/admin.css`, `admin/admin.js` | The admin panel |
| `data/config.js` | Chooses the backend (`local` or `supabase`). This file is public, so never put secret keys in it. |
| `data/store.js` | One data API (list, get, save, remove, files) used by the admin and the website |
| `site-data.js` | Shows admin content on the website and saves leads. It's loaded on index, blog, post, events, contact and upload-case. |
| `post.html` | Article page for posts written in the admin (`post.html?slug=...`) |
| `admin/supabase-schema.sql` | Tables, access rules and storage buckets for Supabase |

## Current mode: local (testing only)

`data/config.js` has `backend: 'local'`. In this mode:

- Data is stored in the browser's IndexedDB on one computer.
- Website visitors and other admins **do not** see it.
- The admin password is `demoPassword` in `data/config.js`. It isn't secure.
- Use **Data & backup** to save a JSON backup into the site folder (for example `_data/`).

## Going live with Supabase (development team)

1. Create a Supabase project. Then run `admin/supabase-schema.sql` in its SQL editor.
2. Create admin users under **Authentication → Users**. The panel signs in with email and password.
3. In `data/config.js`:
   - set `backend: 'supabase'`
   - set `supabaseUrl` and `supabaseAnonKey` (the public anon key, not the service key)
   - remove `demoPassword`
4. **Patient data:** case uploads contain patient health information. Before taking real cases:
   - sign Supabase's BAA (HIPAA, available on paid plans)
   - review the access rules: visitors can upload but never read case files
   - consider virus scanning for uploaded files
5. **SEO:** posts written in the admin are drawn in the browser by `site-data.js`. For search engines, build each post as static HTML at publish time (for example with a Supabase Edge Function or a static build step), and add them to the sitemap.
6. The original three articles are still static HTML pages. In the admin they are marked **Static page**.

To use a different upload service instead, put its URL in `data-endpoint` on the form in `upload-case.html`. `upload.js` then posts the files there.

**Not tested:** `data/store.js`'s Supabase adapter and `admin/supabase-schema.sql` were written but never run against a real Supabase project. Test them on a staging project before going live.
