/* Dental Concepts admin panel. Data goes through DCStore (admin/store.js). */
(() => {
  'use strict';
  const S = window.DCStore, CFG = window.DC_CONFIG || {};
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const view = $('#view');
  const DATA = { posts: [], authors: [], leads: [], uploads: [], testimonials: [], events: [] };

  /* ---------------------------------------------------------------- icons */
  const I = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/></svg>',
    del: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V9M7 14l5-5 5 5M5 4h14"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    back: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>'
  };

  /* ---------------------------------------------------------------- helpers */
  const fmtDate = (d) => { if (!d) return '—'; const x = new Date(d.length === 10 ? d + 'T12:00:00' : d); return isNaN(x) ? d : x.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); };
  const fmtDT = (d) => { const x = new Date(d); return isNaN(x) ? '—' : x.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }); };
  const today = () => new Date().toISOString().slice(0, 10);
  const initials = (n) => String(n || '?').replace(/^(dr|mr|mrs|ms)\.?\s+/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';
  const size = (b) => !b ? '' : b < 1048576 ? Math.max(1, Math.round(b / 1024)) + ' KB' : (b / 1048576).toFixed(1) + ' MB';
  const siteUrl = (u) => !u ? '' : /^(https?:|data:|blob:|\/)/.test(u) ? u : '../' + u;
  let toastT;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), 2600); }
  const pill = (s, label) => `<span class="pill is-${esc(s)}">${esc(label || (s ? s[0].toUpperCase() + s.slice(1) : ''))}</span>`;
  const byDate = (k) => (a, b) => String(b[k] || b.createdAt || '').localeCompare(String(a[k] || a.createdAt || ''));
  function sanitize(html) {
    const ok = { P: 1, H2: 1, H3: 1, STRONG: 1, B: 1, EM: 1, I: 1, UL: 1, OL: 1, LI: 1, A: 1, BLOCKQUOTE: 1, BR: 1 };
    const doc = new DOMParser().parseFromString('<div>' + html + '</div>', 'text/html');
    const walk = (n) => {
      [...n.childNodes].forEach((c) => {
        if (c.nodeType === 3) return;
        if (c.nodeType !== 1) { c.remove(); return; }
        walk(c);
        if (c.tagName === 'DIV') { const p = doc.createElement('p'); p.append(...c.childNodes); c.replaceWith(p); return; }
        if (!ok[c.tagName]) { c.replaceWith(...c.childNodes); return; }
        [...c.attributes].forEach((a) => { if (!(c.tagName === 'A' && a.name === 'href')) c.removeAttribute(a.name); });
        if (c.tagName === 'A' && !/^(https?:|mailto:|tel:|[\w-]+\.html|#)/i.test(c.getAttribute('href') || '')) c.removeAttribute('href');
      });
    };
    const root = doc.body.firstChild; walk(root);
    // wrap loose text and inline elements at the top level in paragraphs
    let p = null;
    [...root.childNodes].forEach((c) => {
      const block = c.nodeType === 1 && /^(P|H2|H3|UL|OL|BLOCKQUOTE)$/.test(c.tagName);
      if (block) { p = null; return; }
      if (c.nodeType === 3 && !c.textContent.trim()) { if (!p) c.remove(); else p.appendChild(c); return; }
      if (c.nodeType === 1 && c.tagName === 'BR' && !p) { c.remove(); return; }
      if (!p) { p = doc.createElement('p'); root.insertBefore(p, c); }
      p.appendChild(c);
    });
    return root.innerHTML.replace(/<p>(\s|<br>)*<\/p>/g, '').trim();
  }
  const textOf = (html) => { const d = document.createElement('div'); d.innerHTML = html || ''; return d.textContent || ''; };

  /* image values are {url} or {fileId}; resolve to a usable src */
  const imgCache = {};
  async function imgSrc(v) {
    if (!v) return '';
    if (v.url) return siteUrl(v.url);
    if (v.fileId) { if (!imgCache[v.fileId]) imgCache[v.fileId] = await S.fileUrl(v.fileId).catch(() => ''); return imgCache[v.fileId]; }
    return '';
  }
  async function hydrate(root) {
    for (const el of $$('[data-img]', root)) {
      const v = JSON.parse(el.dataset.img || 'null'), src = await imgSrc(v);
      if (!src) continue;
      if (el.tagName === 'IMG') el.src = src; else if (el.classList.contains('img-prev')) { el.style.backgroundImage = `url("${src}")`; el.textContent = ''; } else el.innerHTML = `<img src="${src}" alt="">`;
    }
  }
  const imgAttr = (v) => v ? ` data-img="${esc(JSON.stringify(v))}"` : '';
  const avatar = (a) => `<span class="avatar"${imgAttr(a && a.photo)}>${esc(initials(a && a.name))}</span>`;

  /* ---------------------------------------------------------------- modal */
  function modal({ title, body, foot, small }) {
    const m = document.createElement('div');
    m.className = 'modal';
    m.innerHTML = `<div class="modal-box${small ? ' is-sm' : ''}" role="dialog" aria-modal="true" aria-labelledby="m-title"><div class="modal-head"><h2 id="m-title">${esc(title)}</h2><button class="icon-btn" type="button" data-close aria-label="Close">×</button></div><div class="modal-body">${body}</div>${foot ? `<div class="modal-foot">${foot}</div>` : ''}</div>`;
    const prev = document.activeElement;
    const close = () => { m.remove(); document.removeEventListener('keydown', onKey); if (prev && prev.focus) prev.focus(); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('[data-close]')) close(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(m);
    setTimeout(() => { if (m.contains(document.activeElement)) return; const f = $('input,textarea,select,button:not([data-close])', $('.modal-body', m)) || $('[data-close]', m); f && f.focus(); }, 30);
    m.close = close;
    hydrate(m);
    return m;
  }
  function confirmBox(title, text, okLabel = 'Delete') {
    return new Promise((res) => {
      const m = modal({ small: true, title, body: `<p style="margin:0;color:var(--body)">${text}</p>`, foot: `<button class="btn btn-light" data-close type="button">Cancel</button><button class="btn btn-danger" type="button" data-ok>${esc(okLabel)}</button>` });
      $('[data-ok]', m).addEventListener('click', () => { m.close(); res(true); });
      m.addEventListener('click', (e) => { if (e.target.closest('[data-close]') || e.target === m) res(false); });
    });
  }

  /* generic form fields */
  function fieldHTML(f, v) {
    const val = v == null ? (f.def ?? '') : v, req = f.required ? ' required' : '', id = 'f-' + f.k;
    const label = `${esc(f.label)}${f.required ? ' *' : f.optional ? ' <span class="opt">(optional)</span>' : ''}`;
    const hint = f.hint ? `<span class="hint">${esc(f.hint)}</span>` : '';
    const cls = `fld${f.full ? ' full' : ''}`;
    if (f.type === 'select') return `<label class="${cls}" for="${id}">${label}<select id="${id}" name="${f.k}"${req}>${f.options.map((o) => { const [ov, ol] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(ov)}"${String(ov) === String(val) ? ' selected' : ''}>${esc(ol)}</option>`; }).join('')}</select>${hint}<span class="err"></span></label>`;
    if (f.type === 'textarea') return `<label class="${cls}" for="${id}">${label}<textarea id="${id}" name="${f.k}" rows="${f.rows || 4}"${f.max ? ` maxlength="${f.max}"` : ''}${req}>${esc(val)}</textarea>${f.max ? `<span class="counter" data-for="${id}"></span>` : ''}${hint}<span class="err"></span></label>`;
    if (f.type === 'check') return `<label class="check${f.full ? ' full' : ''}"><input type="checkbox" name="${f.k}"${val ? ' checked' : ''}> ${esc(f.label)}</label>`;
    if (f.type === 'image') return `<div class="${cls}"><span>${label}</span><div class="img-field" data-image="${f.k}"><span class="img-prev${f.round ? ' is-round' : ''}"${imgAttr(val || null)}>No image</span><div class="img-actions"><input type="file" accept="image/*" aria-label="Upload ${esc(f.label)}"><input type="url" placeholder="…or paste an image URL" value="${esc(val && val.url && /^https?:/.test(val.url) ? val.url : '')}" aria-label="${esc(f.label)} URL"><button type="button" class="btn btn-light btn-sm" data-clear-img>Remove image</button></div></div>${hint}</div>`;
    return `<label class="${cls}" for="${id}">${label}<input id="${id}" name="${f.k}" type="${f.type || 'text'}" value="${esc(val)}"${f.max ? ` maxlength="${f.max}"` : ''}${f.placeholder ? ` placeholder="${esc(f.placeholder)}"` : ''}${req}>${hint}<span class="err"></span></label>`;
  }
  function wireImages(root, state) {
    $$('[data-image]', root).forEach((box) => {
      const k = box.dataset.image, prev = $('.img-prev', box);
      const show = async () => { const src = await imgSrc(state[k]); prev.style.backgroundImage = src ? `url("${src}")` : ''; prev.textContent = src ? '' : 'No image'; };
      $('input[type=file]', box).addEventListener('change', async (e) => {
        const f = e.target.files[0]; if (!f) return;
        if (!/^image\//.test(f.type)) { toast('Please choose an image file.'); return; }
        prev.textContent = 'Saving…';
        try { const r = await S.putFile(f, 'media'); state[k] = { fileId: r.id, name: r.name }; $('input[type=url]', box).value = ''; await show(); } catch (err) { toast('Could not save the image.'); prev.textContent = 'No image'; }
      });
      $('input[type=url]', box).addEventListener('change', (e) => { const u = e.target.value.trim(); state[k] = u ? { url: u } : null; show(); });
      $('[data-clear-img]', box).addEventListener('click', () => { state[k] = null; $('input[type=url]', box).value = ''; show(); });
    });
  }
  function wireCounters(root) {
    $$('.counter', root).forEach((c) => {
      const el = document.getElementById(c.dataset.for), max = +el.getAttribute('maxlength'), soft = +(el.dataset.soft || 0);
      const up = () => { const n = el.value.length; c.textContent = soft ? `${n} / ${soft} recommended` : `${n} / ${max}`; c.classList.toggle('is-over', soft && n > soft); };
      el.addEventListener('input', up); up();
    });
  }
  function readForm(root, fields, state) {
    let bad = null;
    fields.forEach((f) => {
      if (f.type === 'image') return;
      const el = $(`[name="${f.k}"]`, root); if (!el) return;
      const v = f.type === 'check' ? el.checked : el.value.trim();
      state[f.k] = v;
      const row = el.closest('.fld'); if (!row) return;
      let msg = '';
      if (f.required && !v) msg = 'Required.'; else if (el.type === 'email' && v && !el.checkValidity()) msg = 'Enter a valid email.'; else if (el.type === 'url' && v && !el.checkValidity()) msg = 'Enter a full URL starting with https://';
      row.classList.toggle('is-bad', !!msg); $('.err', row).textContent = msg;
      if (msg && !bad) bad = el;
    });
    if (bad) { bad.focus(); return false; }
    return true;
  }
  function formModal({ title, fields, item, col, after, saveLabel = 'Save' }) {
    const state = Object.assign({}, item || {});
    const m = modal({ title, body: `<form class="form-grid" novalidate>${fields.map((f) => fieldHTML(f, state[f.k])).join('')}</form>`, foot: `<button class="btn btn-light" type="button" data-close>Cancel</button><button class="btn" type="button" data-save>${esc(saveLabel)}</button>` });
    const form = $('form', m);
    wireImages(form, state); wireCounters(form);
    form.addEventListener('input', (e) => { const row = e.target.closest('.fld'); if (row) { row.classList.remove('is-bad'); const er = $('.err', row); if (er) er.textContent = ''; } });
    const save = async () => {
      if (!readForm(form, fields, state)) return;
      try { const saved = await S.save(col, state); m.close(); await reload(col); toast('Saved.'); after && after(saved); } catch (e) { toast('Could not save: ' + (e.message || e)); }
    };
    $('[data-save]', m).addEventListener('click', save);
    form.addEventListener('submit', (e) => { e.preventDefault(); save(); });
    return m;
  }
  async function delItem(col, item, label, extra) {
    if (!(await confirmBox('Delete ' + label + '?', `“${esc(item.title || item.name || label)}” will be removed${extra ? '. ' + extra : ''}. This can’t be undone.`))) return false;
    await S.remove(col, item.id);
    const files = [].concat(item.files || [], ['cover', 'photo', 'image'].map((k) => item[k]).filter((v) => v && v.fileId).map((v) => ({ id: v.fileId })));
    for (const f of files) await S.removeFile(f.id).catch(() => {});
    await reload(col); toast('Deleted.'); return true;
  }

  /* ---------------------------------------------------------------- data */
  async function reload(col) {
    const cols = col ? [col] : S.COLS;
    for (const c of cols) DATA[c] = await S.list(c).catch(() => []);
    $$('[data-count]').forEach((el) => {
      const c = el.dataset.count, n = c === 'leads' || c === 'uploads' ? DATA[c].filter((x) => (x.status || 'new') === 'new').length : DATA[c].length;
      el.textContent = n || ''; el.hidden = !n;
    });
  }
  async function seed() {
    if (S.mode !== 'local' || (await S.getMeta('seeded'))) return;
    const a1 = await S.save('authors', { name: 'Silke Finis', role: 'German-certified dental technician, technical leadership', bio: 'Silke Finis is a German-certified dental technician who guides the lab’s restorative work. She co-founded Prestige Milling Inc. in 2006, one of the first Lava Milling Centers on the West Coast.', email: '', linkedin: '' });
    await S.save('authors', { name: 'Barry Johal', role: 'Founding partner, business leadership', bio: 'Barry Johal is an entrepreneur and founding partner of Dental Concepts, and leads the business side of the lab.', email: '', linkedin: '' });
    const st = [
      ['How to complete the Dental Concepts RX form', 'blog-how-to-complete-the-rx-form.html', 'Working with the lab', 'A walk through the two-page Dental Concepts prescription form: doctor information, restoration and implant choices, shade, and what to send with the case.', 'assets/rx-form-preview.webp'],
      ['Custom shade appointments: what to expect', 'blog-custom-shade-appointments.html', 'Custom shades', 'How custom shade appointments work at Dental Concepts in San Francisco: how to book, how long the visit takes, and where to send shade photographs.', 'assets/products/crowns-veneers.webp'],
      ['Zirconia, layered porcelain, E.max, or gold: an overview of our crown options', 'blog-crown-materials-overview.html', 'Crowns & veneers', 'An overview of the four crown and veneer options Dental Concepts makes: full contour zirconia, layered porcelain, lithium disilicate (E.max), and gold.', 'assets/products/lithium-disilicate.webp']];
    for (const [title, url, category, excerpt, img] of st) await S.save('posts', { title, slug: url.replace(/^blog-|\.html$/g, ''), staticUrl: url, category, excerpt, date: '2026-10-05', status: 'published', authors: [a1.id], cover: { url: img }, body: '' });
    await S.setMeta('seeded', true);
  }

  /* ---------------------------------------------------------------- router */
  const TABS = ['overview', 'blog', 'leads', 'uploads', 'testimonials', 'events', 'data'];
  function route() {
    const [tab, a, b] = (location.hash.slice(1) || 'overview').split('/');
    const t = TABS.includes(tab) ? tab : 'overview';
    $$('.adm-tab').forEach((x) => x.setAttribute('aria-selected', String(x.dataset.tab === t)));
    view._draw = null;
    const r = { overview: renderOverview, blog: renderBlog, leads: renderLeads, uploads: renderUploads, testimonials: renderTestimonials, events: renderEvents, data: renderData }[t];
    r(a, b);
    hydrate(view);
  }
  $$('.adm-tab').forEach((t) => t.addEventListener('click', () => { location.hash = t.dataset.tab; }));
  view.addEventListener('input', (e) => { if (view._draw && e.target.matches('[data-q]')) view._draw(); });
  view.addEventListener('change', (e) => { if (view._draw && e.target.matches('[data-f],[data-c]')) view._draw(); });
  addEventListener('hashchange', route);

  const head = (title, sub, actions = '') => `<div class="card-head"><div><h2>${title}</h2><p>${sub}</p></div><div class="head-actions">${actions}</div></div>`;
  const emptyRow = (cols, t, s) => `<tr><td colspan="${cols}"><div class="empty"><strong>${t}</strong>${s}</div></td></tr>`;
  const modeNotice = () => S.mode === 'local' ? `<div class="notice"><span>⚠</span><div><b>Local test mode.</b> Everything here is saved in this browser only, so other people and the live website won’t see it. Your development team connects the Supabase backend in <code>data/config.js</code> to make it live (see <code>admin/README.md</code>).</div></div>` : '';

  /* ---------------------------------------------------------------- overview */
  function renderOverview() {
    const newLeads = DATA.leads.filter((l) => (l.status || 'new') === 'new').length;
    const newUp = DATA.uploads.filter((l) => (l.status || 'new') === 'new').length;
    const pub = DATA.posts.filter((p) => p.status === 'published').length;
    const upcoming = DATA.events.filter((e) => e.status === 'published' && (e.date || '') >= today()).sort((a, b) => a.date.localeCompare(b.date));
    view.innerHTML = modeNotice() + `<div class="stats">
      <a class="stat" href="#leads"><b>${newLeads}</b><span>New leads</span></a>
      <a class="stat" href="#uploads"><b>${newUp}</b><span>New case uploads</span></a>
      <a class="stat" href="#blog"><b>${pub}</b><span>Published blog posts</span></a>
      <a class="stat" href="#events"><b>${upcoming.length}</b><span>Upcoming events</span></a></div>
      <div class="two"><section class="card">${head('Latest leads', 'From the website contact form.', '<a class="btn btn-light btn-sm" href="#leads">View all</a>')}
      <ul class="mini-list">${DATA.leads.slice().sort(byDate('createdAt')).slice(0, 5).map((l) => `<li><div><div class="m-t">${esc(l.name)}</div><div class="m-s">${esc(l.practice || '')} · ${esc(l.topic || '')}</div></div>${pill(l.status || 'new')}</li>`).join('') || '<li><span class="m-s">No leads yet.</span></li>'}</ul></section>
      <section class="card">${head('Latest case uploads', 'From the Upload a case page.', '<a class="btn btn-light btn-sm" href="#uploads">View all</a>')}
      <ul class="mini-list">${DATA.uploads.slice().sort(byDate('createdAt')).slice(0, 5).map((u) => `<li><div><div class="m-t">${esc(u.doctor)} · ${esc(u.patient)}</div><div class="m-s">${esc(u.optionLabel || '')} · ${fmtDate(u.createdAt)}</div></div>${pill(u.status || 'new', statusLabel(u.status))}</li>`).join('') || '<li><span class="m-s">No uploads yet.</span></li>'}</ul></section></div>`;
  }

  /* ---------------------------------------------------------------- blog */
  const authorName = (id) => (DATA.authors.find((a) => a.id === id) || {}).name;
  function renderBlog(a, b) {
    if (a === 'new' || a === 'edit') return renderPostEditor(a === 'edit' ? DATA.posts.find((p) => p.id === b) : null);
    const sub = a === 'authors' ? 'authors' : 'posts';
    const tabs = `<div class="subtabs" role="tablist"><button class="subtab" role="tab" aria-selected="${sub === 'posts'}" data-go="#blog">Posts (${DATA.posts.length})</button><button class="subtab" role="tab" aria-selected="${sub === 'authors'}" data-go="#blog/authors">Authors (${DATA.authors.length})</button></div>`;
    if (sub === 'authors') {
      const count = (id) => DATA.posts.filter((p) => (p.authors || []).includes(id)).length;
      view.innerHTML = `<section class="card">${head('Authors', 'Name, role and bio shown at the end of each blog post. Pick one or more authors when you write a post.', `<button class="btn" type="button" data-new-author>${I.plus} Add author</button>`)}${tabs}
      <div class="author-grid">${DATA.authors.map((au) => `<article class="author-card"><div class="a-top">${avatar(au)}<div><h3>${esc(au.name)}</h3><div class="a-role">${esc(au.role || '')}</div></div></div><p class="a-bio">${esc(au.bio || '')}</p><div class="a-foot"><span>${count(au.id)} post${count(au.id) === 1 ? '' : 's'}</span><span class="t-actions" style="display:flex;gap:8px"><button class="icon-btn" type="button" data-edit-author="${au.id}" aria-label="Edit ${esc(au.name)}">${I.edit}</button><button class="icon-btn is-del" type="button" data-del-author="${au.id}" aria-label="Delete ${esc(au.name)}">${I.del}</button></span></div></article>`).join('') || '<div class="empty"><strong>No authors yet</strong>Add the people who write your blog posts.</div>'}</div></section>`;
      return;
    }
    const cats = [...new Set(DATA.posts.map((p) => p.category).filter(Boolean))];
    view.innerHTML = `<section class="card">${head('Manage blog posts', 'Create, edit or remove articles shown on the Articles page.', `<a class="btn" href="#blog/new">${I.plus} New post</a>`)}${tabs}
      <div class="toolbar"><input type="search" placeholder="Search posts" data-q aria-label="Search posts"><select data-f aria-label="Filter by status"><option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option></select><select data-c aria-label="Filter by category"><option value="">All categories</option>${cats.map((c) => `<option>${esc(c)}</option>`).join('')}</select></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th></th><th>Title</th><th>Category</th><th>Authors</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody></tbody></table></div></section>`;
    const draw = () => {
      const q = $('[data-q]', view).value.toLowerCase(), f = $('[data-f]', view).value, c = $('[data-c]', view).value;
      const rows = DATA.posts.slice().sort(byDate('date')).filter((p) => (!f || p.status === f) && (!c || p.category === c) && (!q || (p.title + ' ' + p.excerpt).toLowerCase().includes(q)));
      $('tbody', view).innerHTML = rows.map((p) => `<tr>
        <td><img class="t-thumb" alt=""${imgAttr(p.cover)}></td>
        <td data-l="Title"><div class="t-title">${esc(p.title)}</div><div class="t-sub">/${esc(p.slug)}${p.staticUrl ? ' · <span class="tag is-static">Static page</span>' : ''}</div></td>
        <td data-l="Category"><span class="tag">${esc(p.category || '—')}</span></td>
        <td data-l="Authors"><div class="avatars" title="${esc((p.authors || []).map(authorName).filter(Boolean).join(', '))}">${(p.authors || []).map((id) => avatar(DATA.authors.find((x) => x.id === id))).join('') || '<span class="t-sub">—</span>'}</div></td>
        <td data-l="Date" class="t-date">${fmtDate(p.date)}</td>
        <td data-l="Status">${pill(p.status || 'draft')}</td>
        <td><div class="t-actions"><a class="icon-btn" href="${p.staticUrl ? '../' + esc(p.staticUrl) : '../post.html?slug=' + encodeURIComponent(p.slug) + '&preview=1'}" target="_blank" rel="noopener" aria-label="View ${esc(p.title)}">${I.eye}</a><a class="icon-btn" href="#blog/edit/${p.id}" aria-label="Edit ${esc(p.title)}">${I.edit}</a><button class="icon-btn is-del" type="button" data-del-post="${p.id}" aria-label="Delete ${esc(p.title)}">${I.del}</button></div></td></tr>`).join('') || emptyRow(7, 'No posts found', 'Create your first post with “New post”.');
      hydrate(view);
    };
    view._draw = draw;
    draw();
  }
  const AUTHOR_FIELDS = [
    { k: 'name', label: 'Name', required: true, max: 80 },
    { k: 'role', label: 'Role or credentials', placeholder: 'e.g. CDT, Ceramist', optional: true, max: 120 },
    { k: 'photo', label: 'Photo', type: 'image', round: true, full: true, optional: true },
    { k: 'bio', label: 'Short bio', type: 'textarea', required: true, full: true, max: 600, rows: 5, hint: 'Shown in the author box at the end of each post.' },
    { k: 'email', label: 'Email', type: 'email', optional: true },
    { k: 'linkedin', label: 'LinkedIn or website', type: 'url', optional: true, placeholder: 'https://' }];
  view.addEventListener('click', async (e) => {
    const t = e.target.closest('button,a'); if (!t) return;
    if (t.dataset.go) { location.hash = t.dataset.go; return; }
    if (t.hasAttribute('data-new-author')) formModal({ title: 'Add author', fields: AUTHOR_FIELDS, col: 'authors', after: route });
    if (t.dataset.editAuthor) formModal({ title: 'Edit author', fields: AUTHOR_FIELDS, col: 'authors', item: DATA.authors.find((x) => x.id === t.dataset.editAuthor), after: route });
    if (t.dataset.delAuthor) {
      const au = DATA.authors.find((x) => x.id === t.dataset.delAuthor), used = DATA.posts.filter((p) => (p.authors || []).includes(au.id));
      if (await delItem('authors', au, 'author', used.length ? `They will also be removed from ${used.length} post${used.length === 1 ? '' : 's'}` : '')) {
        for (const p of used) await S.save('posts', Object.assign({}, p, { authors: p.authors.filter((x) => x !== au.id) }));
        await reload('posts'); route();
      }
    }
    if (t.dataset.delPost) { const p = DATA.posts.find((x) => x.id === t.dataset.delPost); if (await delItem('posts', p, 'post', p.staticUrl ? 'The static page ' + p.staticUrl + ' stays on the site until your developer removes it' : '')) { if (location.hash.startsWith('#blog/edit')) location.hash = '#blog'; else route(); } }
  });

  function renderPostEditor(p) {
    const st = Object.assign({ title: '', slug: '', category: '', date: today(), status: 'draft', authors: [], excerpt: '', body: '', cover: null, coverAlt: '', metaTitle: '', metaDesc: '' }, p || {});
    let slugTouched = !!p;
    const cats = [...new Set(['Working with the lab', 'Custom shades', 'Crowns & veneers', 'Implants', 'Digital workflow'].concat(DATA.posts.map((x) => x.category).filter(Boolean)))];
    view.innerHTML = `<button class="back-link" type="button" data-go="#blog">${I.back} All posts</button>
    ${st.staticUrl ? `<div class="notice is-info"><span>ℹ</span><div>This article is also a static page, <b>${esc(st.staticUrl)}</b>. Changes saved here are stored in the admin, but the static page itself only changes when your developer updates it or connects it to this data.</div></div>` : ''}
    <form class="editor" novalidate>
      <div class="card">
        <label class="visually-hidden" for="p-title">Post title</label><input class="title-input" id="p-title" name="title" placeholder="Post title" value="${esc(st.title)}" maxlength="140">
        <div class="slug-row">dentalconceptssf.com/post.html?slug=<input name="slug" value="${esc(st.slug)}" aria-label="URL slug"></div>
        <div class="fld" style="margin-bottom:18px"><span>Excerpt *</span><textarea name="excerpt" id="p-excerpt" rows="3" maxlength="300" data-soft="160" placeholder="One or two sentences shown on the Articles page">${esc(st.excerpt)}</textarea><span class="counter" data-for="p-excerpt"></span><span class="err"></span></div>
        <div class="fld"><span>Article *</span>
          <div class="rte-bar" role="toolbar" aria-label="Formatting">
            <button type="button" data-cmd="formatBlock" data-v="H2" title="Heading">H2</button><button type="button" data-cmd="formatBlock" data-v="H3" title="Subheading">H3</button><button type="button" data-cmd="formatBlock" data-v="P" title="Paragraph">¶</button><span class="sep"></span>
            <button type="button" data-cmd="bold" title="Bold"><b>B</b></button><button type="button" data-cmd="italic" title="Italic"><i>I</i></button><span class="sep"></span>
            <button type="button" data-cmd="insertUnorderedList" title="Bulleted list">• List</button><button type="button" data-cmd="insertOrderedList" title="Numbered list">1. List</button><button type="button" data-cmd="formatBlock" data-v="BLOCKQUOTE" title="Quote">“ Quote</button><span class="sep"></span>
            <button type="button" data-cmd="createLink" title="Add link">Link</button><button type="button" data-cmd="unlink" title="Remove link">Unlink</button><button type="button" data-cmd="removeFormat" title="Clear formatting">Clear</button>
          </div>
          <div class="rte" id="p-body" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Article body" data-placeholder="Write the article…">${st.body || ''}</div><span class="err"></span></div>
      </div>
      <div class="editor-side">
        <div class="side-box"><h3>Publish</h3>
          <label class="fld">Status<select name="status"><option value="draft"${st.status !== 'published' ? ' selected' : ''}>Draft</option><option value="published"${st.status === 'published' ? ' selected' : ''}>Published</option></select></label>
          <label class="fld">Publish date<input type="date" name="date" value="${esc(st.date)}"></label>
          <div class="editor-actions" style="margin-top:16px"><button class="btn" type="submit">${p ? 'Update post' : 'Save post'}</button><a class="btn btn-light" target="_blank" rel="noopener" data-preview href="#">Preview</a>${p ? `<button class="btn btn-danger" type="button" data-del-post="${p.id}">Delete</button>` : ''}</div>
        </div>
        <div class="side-box"><h3>Authors</h3>
          <div class="author-pick">${DATA.authors.map((a) => `<label class="author-opt"><input type="checkbox" name="authors" value="${a.id}"${st.authors.includes(a.id) ? ' checked' : ''}>${avatar(a)}<span>${esc(a.name)}<small>${esc(a.role || '')}</small></span></label>`).join('') || '<p class="t-sub" style="margin:0">No authors yet.</p>'}</div>
          <button class="btn btn-light btn-sm" type="button" data-new-author-inline style="margin-top:12px">${I.plus} New author</button>
        </div>
        <div class="side-box"><h3>Category</h3>
          <label class="fld">Category *<input name="category" list="cat-list" value="${esc(st.category)}" placeholder="Choose or type a new one"><datalist id="cat-list">${cats.map((c) => `<option value="${esc(c)}">`).join('')}</datalist><span class="err"></span></label>
        </div>
        <div class="side-box"><h3>Cover image</h3>
          <div data-image="cover" class="img-field"><span class="img-prev"${imgAttr(st.cover)}>No image</span><div class="img-actions"><input type="file" accept="image/*" aria-label="Upload cover image"><input type="url" placeholder="…or paste an image URL" value="${esc(st.cover && st.cover.url && /^https?:/.test(st.cover.url) ? st.cover.url : '')}" aria-label="Cover image URL"><button type="button" class="btn btn-light btn-sm" data-clear-img>Remove image</button></div></div>
          <label class="fld" style="margin-top:12px">Image description (alt text)<input name="coverAlt" value="${esc(st.coverAlt)}" maxlength="140"></label>
        </div>
        <div class="side-box"><h3>Search engines</h3>
          <label class="fld">Meta title<input name="metaTitle" id="p-mt" value="${esc(st.metaTitle)}" maxlength="90" data-soft="60" placeholder="Defaults to the post title"><span class="counter" data-for="p-mt"></span></label>
          <label class="fld">Meta description<textarea name="metaDesc" id="p-md" rows="3" maxlength="300" data-soft="155" placeholder="Defaults to the excerpt">${esc(st.metaDesc)}</textarea><span class="counter" data-for="p-md"></span></label>
        </div>
      </div>
    </form>`;
    const form = $('form.editor', view), body = $('#p-body', view);
    try { document.execCommand('defaultParagraphSeparator', false, 'p'); } catch (e) { /* older browsers */ }
    form.addEventListener('input', (e) => { const row = e.target.closest('.fld'); if (row) { row.classList.remove('is-bad'); const er = $('.err', row); if (er) er.textContent = ''; } if (e.target === title) title.style.borderColor = ''; });
    wireImages(form, st); wireCounters(form);
    const title = $('[name=title]', form), slug = $('[name=slug]', form);
    title.addEventListener('input', () => { if (!slugTouched) slug.value = S.slugify(title.value); });
    slug.addEventListener('input', () => { slugTouched = true; });
    $('.rte-bar', form).addEventListener('mousedown', (e) => { if (e.target.closest('button')) e.preventDefault(); });
    $('.rte-bar', form).addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      body.focus();
      if (b.dataset.cmd === 'createLink') { const u = prompt('Link address (https://…, or a page such as custom-shades.html)'); if (u) document.execCommand('createLink', false, u.trim()); return; }
      document.execCommand(b.dataset.cmd, false, b.dataset.v ? '<' + b.dataset.v + '>' : null);
    });
    body.addEventListener('paste', (e) => { e.preventDefault(); const h = e.clipboardData.getData('text/html'), t = e.clipboardData.getData('text/plain'); document.execCommand('insertHTML', false, h ? sanitize(h) : esc(t).replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>')); });
    $('[data-new-author-inline]', form).addEventListener('click', () => formModal({ title: 'Add author', fields: AUTHOR_FIELDS, col: 'authors', after: (a) => {
      const box = $('.author-pick', form); if (!box.querySelector('label')) box.innerHTML = '';
      box.insertAdjacentHTML('beforeend', `<label class="author-opt"><input type="checkbox" name="authors" value="${a.id}" checked>${avatar(a)}<span>${esc(a.name)}<small>${esc(a.role || '')}</small></span></label>`); hydrate(box);
    } }));
    const collect = () => {
      ['title', 'slug', 'excerpt', 'status', 'date', 'category', 'coverAlt', 'metaTitle', 'metaDesc'].forEach((k) => { st[k] = $(`[name=${k}]`, form).value.trim(); });
      st.slug = S.slugify(st.slug || st.title); slug.value = st.slug;
      st.authors = $$('[name=authors]:checked', form).map((x) => x.value);
      st.body = sanitize(body.innerHTML);
      st.readMinutes = Math.max(1, Math.round(textOf(st.body).split(/\s+/).filter(Boolean).length / 220));
    };
    $('[data-preview]', form).addEventListener('click', async (e) => {
      e.preventDefault(); collect();
      if (!st.title) { toast('Add a title first.'); return; }
      st.slug = st.slug || S.slugify(st.title);
      const saved = await S.save('posts', Object.assign({}, st, { status: st.status })); Object.assign(st, saved);
      await reload('posts'); window.open('../post.html?slug=' + encodeURIComponent(st.slug) + '&preview=1', '_blank', 'noopener');
      if (!p) history.replaceState(null, '', '#blog/edit/' + saved.id);
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); collect();
      const errs = [];
      const flag = (el, msg) => { const row = el.closest('.fld'); if (row) { row.classList.toggle('is-bad', !!msg); const er = $('.err', row); if (er) er.textContent = msg || ''; } if (msg) errs.push(el); };
      if (!st.title) { title.style.borderColor = 'var(--red)'; errs.push(title); } else title.style.borderColor = '';
      flag($('[name=excerpt]', form), st.excerpt ? '' : 'Required.');
      flag(body, textOf(st.body).trim() || st.staticUrl ? '' : 'Write the article before saving.');
      flag($('[name=category]', form), st.category ? '' : 'Required.');
      if (DATA.posts.some((x) => x.slug === st.slug && x.id !== st.id)) { toast('Another post already uses this URL slug.'); slug.focus(); return; }
      if (st.status === 'published' && !st.authors.length) { toast('Choose at least one author before publishing.'); $('.author-pick', form).scrollIntoView({ block: 'center' }); return; }
      if (errs.length) { errs[0].focus(); toast('Please complete the highlighted fields.'); return; }
      try { const saved = await S.save('posts', st); Object.assign(st, saved); await reload('posts'); toast(st.status === 'published' ? 'Post published.' : 'Draft saved.'); location.hash = '#blog/edit/' + saved.id; } catch (err) { toast('Could not save: ' + (err.message || err)); }
    });
  }

  /* ---------------------------------------------------------------- leads */
  const LEAD_ST = [['new', 'New'], ['contacted', 'Contacted'], ['closed', 'Closed']];
  function renderLeads() {
    view.innerHTML = modeNotice() + `<section class="card">${head('Contact form leads', 'Every inquiry sent from the Contact page.', `<button class="btn btn-light" type="button" data-csv>${I.down} Export CSV</button><button class="btn" type="button" data-add-lead>${I.plus} Add lead</button>`)}
      <div class="toolbar"><input type="search" placeholder="Search name, practice or email" data-q aria-label="Search leads"><select data-f aria-label="Filter by status"><option value="">All statuses</option>${LEAD_ST.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Received</th><th>Name / practice</th><th>Contact</th><th>Topic</th><th>Status</th><th>Actions</th></tr></thead><tbody></tbody></table></div></section>`;
    const draw = () => {
      const q = $('[data-q]', view).value.toLowerCase(), f = $('[data-f]', view).value;
      const rows = DATA.leads.slice().sort(byDate('createdAt')).filter((l) => (!f || (l.status || 'new') === f) && (!q || [l.name, l.practice, l.email].join(' ').toLowerCase().includes(q)));
      $('tbody', view).innerHTML = rows.map((l) => `<tr><td data-l="Received" class="t-date">${fmtDT(l.createdAt)}</td>
        <td data-l="Name"><div class="t-title">${esc(l.name)}</div><div class="t-sub">${esc(l.practice || '')}</div></td>
        <td data-l="Contact"><div><a href="mailto:${esc(l.email)}">${esc(l.email)}</a></div><div class="t-sub">${esc(l.phone || '')}</div></td>
        <td data-l="Topic"><span class="tag">${esc(l.topic || '—')}</span></td>
        <td data-l="Status"><select class="status-select" data-status="leads:${l.id}" aria-label="Status">${LEAD_ST.map(([v, t]) => `<option value="${v}"${(l.status || 'new') === v ? ' selected' : ''}>${t}</option>`).join('')}</select></td>
        <td><div class="t-actions"><button class="icon-btn" type="button" data-view-lead="${l.id}" aria-label="View">${I.eye}</button><button class="icon-btn is-del" type="button" data-del="leads:${l.id}" aria-label="Delete">${I.del}</button></div></td></tr>`).join('') || emptyRow(6, 'No leads yet', 'Inquiries from the Contact page appear here.');
    };
    view._draw = draw;
    draw();
  }
  const LEAD_FIELDS = [{ k: 'name', label: 'Name', required: true }, { k: 'practice', label: 'Practice', required: true }, { k: 'email', label: 'Email', type: 'email', required: true }, { k: 'phone', label: 'Phone', optional: true },
    { k: 'topic', label: 'Topic', type: 'select', options: ['New doctor account', 'Restorative services', 'Digital workflow or case requirements', 'Custom shade appointment', 'Shade photographs', 'General question'] },
    { k: 'status', label: 'Status', type: 'select', options: LEAD_ST, def: 'new' }, { k: 'message', label: 'Message', type: 'textarea', full: true, optional: true }, { k: 'notes', label: 'Internal notes', type: 'textarea', full: true, optional: true, hint: 'Only visible in the admin.' }];
  function viewLead(l) {
    const rows = [['Received', fmtDT(l.createdAt)], ['Name', l.name], ['Practice', l.practice], ['Email', `<a href="mailto:${esc(l.email)}">${esc(l.email)}</a>`], ['Phone', l.phone ? `<a href="tel:${esc(l.phone)}">${esc(l.phone)}</a>` : '—'], ['Topic', l.topic], ['Preferred contact', l.preference], ['Heard about us', l.source], ['Message', esc(l.message || '').replace(/\n/g, '<br>')], ['Internal notes', esc(l.notes || '—').replace(/\n/g, '<br>')]];
    const m = modal({ title: 'Lead from ' + (l.name || ''), body: `<dl class="dl">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${k === 'Email' || k === 'Phone' || k === 'Message' || k === 'Internal notes' ? (v || '—') : esc(v || '—')}</dd>`).join('')}</dl>`, foot: `<button class="btn btn-light" type="button" data-close>Close</button><button class="btn" type="button" data-edit>${I.edit} Edit</button>` });
    $('[data-edit]', m).addEventListener('click', () => { m.close(); formModal({ title: 'Edit lead', fields: LEAD_FIELDS, col: 'leads', item: l, after: route }); });
  }
  function csv(rows, name) {
    const cell = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
    const blob = new Blob([rows.map((r) => r.map(cell).join(',')).join('\r\n')], { type: 'text/csv' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: name }); document.body.appendChild(a); a.click(); a.remove();
  }

  /* ---------------------------------------------------------------- uploads */
  const UP_ST = [['new', 'New'], ['received', 'Received'], ['production', 'In production'], ['shipped', 'Shipped']];
  const statusLabel = (s) => (UP_ST.find((x) => x[0] === (s || 'new')) || [, 'New'])[1];
  function renderUploads() {
    view.innerHTML = modeNotice() + `<section class="card">${head('Digital case uploads', 'Scans, RX forms and photos sent from the Upload a case page.', `<a class="btn btn-light" href="../upload-case.html" target="_blank" rel="noopener">${I.ext} Open upload page</a>`)}
      <div class="toolbar"><input type="search" placeholder="Search doctor, practice or patient ID" data-q aria-label="Search uploads"><select data-f aria-label="Filter by status"><option value="">All statuses</option>${UP_ST.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Received</th><th>Doctor / practice</th><th>Patient</th><th>Restoration</th><th>Files</th><th>Status</th><th>Actions</th></tr></thead><tbody></tbody></table></div></section>`;
    const draw = () => {
      const q = $('[data-q]', view).value.toLowerCase(), f = $('[data-f]', view).value;
      const rows = DATA.uploads.slice().sort(byDate('createdAt')).filter((u) => (!f || (u.status || 'new') === f) && (!q || [u.doctor, u.practice, u.patient].join(' ').toLowerCase().includes(q)));
      const n = (u, k) => (u.files || []).filter((x) => x.kind === k).length;
      $('tbody', view).innerHTML = rows.map((u) => `<tr><td data-l="Received" class="t-date">${fmtDT(u.createdAt)}</td>
        <td data-l="Doctor"><div class="t-title">${esc(u.doctor)}</div><div class="t-sub">${esc(u.practice || '')}</div></td>
        <td data-l="Patient">${esc(u.patient || '—')}${u.teeth ? `<div class="t-sub">Teeth ${esc(u.teeth)}</div>` : ''}</td>
        <td data-l="Restoration"><div>${esc(u.optionLabel || '—')}</div><div class="t-sub">${esc(u.typeLabel || '')}</div></td>
        <td data-l="Files"><div class="t-sub">${n(u, 'scans')} scan · ${n(u, 'rx')} RX · ${n(u, 'photos')} photo</div></td>
        <td data-l="Status"><select class="status-select" data-status="uploads:${u.id}" aria-label="Status">${UP_ST.map(([v, t]) => `<option value="${v}"${(u.status || 'new') === v ? ' selected' : ''}>${t}</option>`).join('')}</select></td>
        <td><div class="t-actions"><button class="icon-btn" type="button" data-view-upload="${u.id}" aria-label="View">${I.eye}</button><button class="icon-btn is-del" type="button" data-del="uploads:${u.id}" aria-label="Delete">${I.del}</button></div></td></tr>`).join('') || emptyRow(7, 'No case uploads yet', 'Cases sent from the Upload a case page appear here.');
    };
    view._draw = draw;
    draw();
  }
  function viewUpload(u) {
    const rows = [['Received', fmtDT(u.createdAt)], ['Doctor', u.doctor], ['Practice', u.practice], ['Email', u.email], ['Phone', u.phone], ['Patient ID', u.patient], ['Tooth numbers', u.teeth], ['Restoration', [u.typeLabel, u.optionLabel].filter(Boolean).join(' · ')], ['Shade', u.shadeLabel], ['Timing', u.timingLabel], ['Seat date', u.due ? fmtDate(u.due) : ''], ['Scanner', u.scanner], ['Notes', u.notes]];
    const m = modal({ title: 'Case from ' + (u.doctor || ''), body: `<dl class="dl">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v || '—')}</dd>`).join('')}</dl><h3 style="margin:24px 0 12px;font-size:1rem">Files</h3><ul class="file-list">${(u.files || []).map((f) => `<li><div><div class="f-kind">${{ scans: 'Scan', rx: 'RX form', photos: 'Photo' }[f.kind] || f.kind}</div>${esc(f.name)} <span class="t-sub">${size(f.size)}</span></div><button class="btn btn-light btn-sm" type="button" data-file="${esc(f.id)}" data-name="${esc(f.name)}">${I.down} Download</button></li>`).join('') || '<li>No files</li>'}</ul>`, foot: '<button class="btn btn-light" type="button" data-close>Close</button>' });
    m.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-file]'); if (!b) return;
      const url = await S.fileUrl(b.dataset.file).catch(() => ''); if (!url) { toast('File not found.'); return; }
      const a = Object.assign(document.createElement('a'), { href: url, download: b.dataset.name, target: '_blank', rel: 'noopener' }); document.body.appendChild(a); a.click(); a.remove();
    });
  }

  /* ---------------------------------------------------------------- testimonials */
  const T_FIELDS = [{ k: 'name', label: 'Dentist’s name', required: true }, { k: 'role', label: 'Practice name', optional: true }, { k: 'city', label: 'City', optional: true },
    { k: 'status', label: 'Status', type: 'select', options: [['draft', 'Draft'], ['published', 'Published']], def: 'draft' },
    { k: 'quote', label: 'Quote', type: 'textarea', full: true, required: true, max: 600, rows: 5, hint: 'Use the dentist’s own words, with their permission.' },
    { k: 'photo', label: 'Photo', type: 'image', round: true, full: true, optional: true }, { k: 'featured', label: 'Show in the home page carousel', type: 'check', full: true }];
  function renderTestimonials() {
    view.innerHTML = `<section class="card">${head('Testimonials', 'Quotes from dentists. Published ones marked for the home page replace the placeholder cards there.', `<button class="btn" type="button" data-new="testimonials">${I.plus} Add testimonial</button>`)}
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Dentist</th><th>Quote</th><th>Home page</th><th>Status</th><th>Actions</th></tr></thead><tbody>${DATA.testimonials.slice().sort(byDate('createdAt')).map((t) => `<tr>
      <td data-l="Dentist"><div style="display:flex;gap:10px;align-items:center">${avatar({ name: t.name, photo: t.photo })}<div><div class="t-title">${esc(t.name)}</div><div class="t-sub">${esc([t.role, t.city].filter(Boolean).join(', '))}</div></div></div></td>
      <td data-l="Quote"><div class="t-sub" style="max-width:420px">“${esc((t.quote || '').slice(0, 140))}${(t.quote || '').length > 140 ? '…' : ''}”</div></td>
      <td data-l="Home page">${t.featured ? '<span class="tag is-static">Featured</span>' : '<span class="t-sub">—</span>'}</td>
      <td data-l="Status">${pill(t.status || 'draft')}</td>
      <td><div class="t-actions"><button class="icon-btn" type="button" data-edit="testimonials:${t.id}" aria-label="Edit">${I.edit}</button><button class="icon-btn is-del" type="button" data-del="testimonials:${t.id}" aria-label="Delete">${I.del}</button></div></td></tr>`).join('') || emptyRow(5, 'No testimonials yet', 'Add real quotes from dentists you work with.')}</tbody></table></div></section>`;
  }

  /* ---------------------------------------------------------------- events */
  const E_FIELDS = [{ k: 'title', label: 'Event title', required: true, full: true },
    { k: 'type', label: 'Type', type: 'select', options: ['Open day', 'Lunch-and-learn', 'CE course', 'Webinar', 'Trade show', 'Other'] },
    { k: 'status', label: 'Status', type: 'select', options: [['draft', 'Draft'], ['published', 'Published']], def: 'draft' },
    { k: 'date', label: 'Date', type: 'date', required: true }, { k: 'startTime', label: 'Start time', type: 'time', optional: true }, { k: 'endTime', label: 'End time', type: 'time', optional: true },
    { k: 'location', label: 'Location', def: '244 9th Street, San Francisco, CA 94103', optional: true }, { k: 'onlineUrl', label: 'Online link', type: 'url', optional: true, placeholder: 'https://' },
    { k: 'registerUrl', label: 'Registration link', type: 'url', optional: true, placeholder: 'https://', hint: 'Leave empty to send visitors to the Contact page.' },
    { k: 'description', label: 'Description', type: 'textarea', full: true, required: true, max: 1200, rows: 5 }, { k: 'image', label: 'Image', type: 'image', full: true, optional: true }];
  function renderEvents() {
    const t = today();
    view.innerHTML = `<section class="card">${head('Events', 'Open days, lunch-and-learns and courses shown on the Events page.', `<button class="btn" type="button" data-new="events">${I.plus} Add event</button>`)}
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Date</th><th>Event</th><th>Type</th><th>Location</th><th>Status</th><th>Actions</th></tr></thead><tbody>${DATA.events.slice().sort((a, b) => String(b.date).localeCompare(String(a.date))).map((e) => `<tr>
      <td data-l="Date" class="t-date">${fmtDate(e.date)}${e.startTime ? `<div class="t-sub">${esc(e.startTime)}${e.endTime ? '–' + esc(e.endTime) : ''}</div>` : ''}${e.date < t ? '<div class="t-sub">Past</div>' : ''}</td>
      <td data-l="Event"><div class="t-title">${esc(e.title)}</div></td><td data-l="Type"><span class="tag">${esc(e.type || '')}</span></td>
      <td data-l="Location"><div class="t-sub">${esc(e.onlineUrl ? 'Online' + (e.location ? ' + ' + e.location : '') : e.location || '—')}</div></td>
      <td data-l="Status">${pill(e.status || 'draft')}</td>
      <td><div class="t-actions"><button class="icon-btn" type="button" data-edit="events:${e.id}" aria-label="Edit">${I.edit}</button><button class="icon-btn is-del" type="button" data-del="events:${e.id}" aria-label="Delete">${I.del}</button></div></td></tr>`).join('') || emptyRow(6, 'No events yet', 'Add an event and publish it to show it on the Events page.')}</tbody></table></div></section>`;
  }

  /* shared table actions */
  const FIELDS = { testimonials: T_FIELDS, events: E_FIELDS, leads: LEAD_FIELDS };
  const LABEL = { testimonials: 'testimonial', events: 'event', leads: 'lead', uploads: 'case upload' };
  view.addEventListener('click', async (e) => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.new) formModal({ title: 'Add ' + LABEL[t.dataset.new], fields: FIELDS[t.dataset.new], col: t.dataset.new, after: route });
    if (t.dataset.edit) { const [c, id] = t.dataset.edit.split(':'); formModal({ title: 'Edit ' + LABEL[c], fields: FIELDS[c], col: c, item: DATA[c].find((x) => x.id === id), after: route }); }
    if (t.dataset.del) { const [c, id] = t.dataset.del.split(':'); const it = DATA[c].find((x) => x.id === id); if (it && (await delItem(c, Object.assign({ title: it.title || it.name || it.doctor }, it), LABEL[c]))) route(); }
    if (t.hasAttribute('data-add-lead')) formModal({ title: 'Add lead', fields: LEAD_FIELDS, col: 'leads', item: { status: 'new' }, after: route });
    if (t.dataset.viewLead) viewLead(DATA.leads.find((x) => x.id === t.dataset.viewLead));
    if (t.dataset.viewUpload) viewUpload(DATA.uploads.find((x) => x.id === t.dataset.viewUpload));
    if (t.hasAttribute('data-csv')) csv([['Received', 'Name', 'Practice', 'Email', 'Phone', 'Topic', 'Preferred contact', 'Heard about us', 'Status', 'Message', 'Notes']].concat(DATA.leads.map((l) => [l.createdAt, l.name, l.practice, l.email, l.phone, l.topic, l.preference, l.source, l.status || 'new', l.message, l.notes])), 'dental-concepts-leads-' + today() + '.csv');
  });
  view.addEventListener('change', async (e) => {
    if (!e.target.dataset.status) return;
    const [c, id] = e.target.dataset.status.split(':'), it = DATA[c].find((x) => x.id === id);
    await S.save(c, Object.assign({}, it, { status: e.target.value })); await reload(c); toast('Status updated.');
  });

  /* ---------------------------------------------------------------- data & backup */
  function renderData() {
    view.innerHTML = `<section class="card">${head('Data & backup', 'Where the admin keeps its data, and how to back it up.')}
      ${S.mode === 'local' ? `<div class="notice"><span>⚠</span><div><b>Local test mode.</b> Data is stored in this browser on this computer. Clearing browser data deletes it, and it isn’t shared with other admins or shown to website visitors. Download a backup often while testing.</div></div>` : `<div class="notice is-info"><span>✓</span><div><b>Connected to Supabase.</b> Data and files are stored in your Supabase project.</div></div>`}
      <div class="two"><div class="side-box"><h3>Backup</h3><p style="margin:0 0 14px;color:var(--body)">Download everything (posts, authors, leads, uploads, testimonials, events and files) as one JSON file. Save it in your site folder under <code>_data/</code>.</p><button class="btn" type="button" data-export>${I.down} Download backup</button></div>
      <div class="side-box"><h3>Restore</h3><p style="margin:0 0 14px;color:var(--body)">Load a backup file. This replaces the data currently in the admin.</p><label class="btn btn-light">${I.up} Choose backup file<input type="file" accept="application/json,.json" data-import hidden></label></div></div>
      <div class="side-box" style="margin-top:22px"><h3>Counts</h3><ul class="mini-list">${S.COLS.map((c) => `<li><span class="m-t">${c[0].toUpperCase() + c.slice(1)}</span><span>${DATA[c].length}</span></li>`).join('')}</ul></div></section>`;
  }
  const b64 = (blob) => new Promise((r) => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(blob); });
  view.addEventListener('click', async (e) => {
    if (!e.target.closest('[data-export]')) return;
    const out = { app: 'dental-concepts-admin', version: 1, exportedAt: new Date().toISOString(), mode: S.mode, data: {}, files: {} };
    for (const c of S.COLS) out.data[c] = DATA[c];
    const ids = new Set();
    S.COLS.forEach((c) => DATA[c].forEach((x) => { (x.files || []).forEach((f) => ids.add(f.id)); ['cover', 'photo', 'image'].forEach((k) => x[k] && x[k].fileId && ids.add(x[k].fileId)); }));
    for (const id of ids) { try { const u = await S.fileUrl(id); const bl = await (await fetch(u)).blob(); out.files[id] = await b64(bl); } catch (err) { /* skip missing */ } }
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([JSON.stringify(out)], { type: 'application/json' })), download: 'dental-concepts-admin-backup-' + today() + '.json' });
    document.body.appendChild(a); a.click(); a.remove(); toast('Backup downloaded.');
  });
  view.addEventListener('change', async (e) => {
    if (!e.target.matches('[data-import]')) return;
    const f = e.target.files[0]; if (!f) return;
    let j; try { j = JSON.parse(await f.text()); } catch (err) { toast('That file isn’t a valid backup.'); return; }
    if (j.app !== 'dental-concepts-admin') { toast('That file isn’t a Dental Concepts admin backup.'); return; }
    if (!(await confirmBox('Restore this backup?', 'The data currently in the admin will be replaced with the backup from ' + esc(fmtDT(j.exportedAt)) + '.', 'Restore'))) return;
    if (S.mode !== 'local') { toast('Restore is only available in local mode. Ask your developer to import into Supabase.'); return; }
    const map = {};
    for (const [id, data] of Object.entries(j.files || {})) { const bl = await (await fetch(data)).blob(); const r = await S.putFile(new File([bl], id, { type: bl.type }), 'media'); map[id] = r.id; }
    const fix = (x) => { (x.files || []).forEach((fl) => { if (map[fl.id]) fl.id = map[fl.id]; }); ['cover', 'photo', 'image'].forEach((k) => { if (x[k] && x[k].fileId && map[x[k].fileId]) x[k].fileId = map[x[k].fileId]; }); return x; };
    for (const c of S.COLS) { for (const x of DATA[c]) await S.remove(c, x.id); for (const x of (j.data[c] || [])) await S.save(c, fix(x)); }
    await reload(); toast('Backup restored.'); route();
  });

  /* ---------------------------------------------------------------- auth + start */
  async function start() {
    $('#login').hidden = true; $('#app').hidden = false;
    const pillEl = $('#mode-pill'); pillEl.textContent = S.mode === 'local' ? 'Local test data' : 'Live data'; pillEl.classList.toggle('is-live', S.mode !== 'local');
    try { await seed(); } catch (e) { /* ignore */ }
    await reload(); route();
  }
  function showLogin() {
    $('#app').hidden = true; $('#login').hidden = false;
    if (S.mode === 'local') { $('#login-email-row').hidden = true; $('#login-hint').textContent = 'Local test mode: enter the admin password from data/config.js.'; }
    $('#login-pw').focus();
  }
  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); const err = $('#login-err'); err.textContent = '';
    const pw = $('#login-pw').value;
    if (S.mode === 'local') {
      if (pw && pw === CFG.demoPassword) { sessionStorage.setItem('dc-admin', '1'); start(); } else err.textContent = 'Incorrect password.';
      return;
    }
    try { await S.signIn($('#login-email').value.trim(), pw); start(); } catch (x) { err.textContent = 'Sign in failed: ' + (x.message || 'check your email and password.'); }
  });
  $('#logout').addEventListener('click', async () => { sessionStorage.removeItem('dc-admin'); if (S.signOut) await S.signOut().catch(() => {}); location.hash = ''; showLogin(); });
  (async () => {
    let ok = false;
    try { ok = S.mode === 'local' ? sessionStorage.getItem('dc-admin') === '1' : !!(await S.session()); } catch (e) { ok = false; }
    ok ? start() : showLogin();
  })();
})();
