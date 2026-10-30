/* Shows admin-managed content on the public pages: new blog posts, the post page,
   events, home page testimonials, and saves contact-form leads. Needs data/config.js + data/store.js. */
(function () {
  'use strict';
  var S = window.DCStore; if (!S) return;
  var doc = document;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var slug = function (s) { return String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };
  var fmt = function (d) { var x = new Date(String(d).length === 10 ? d + 'T12:00:00' : d); return isNaN(x) ? '' : x.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); };
  var initials = function (n) { return String(n || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0].toUpperCase(); }).join(''); };
  function src(v) {
    if (!v) return Promise.resolve('');
    if (v.url) return Promise.resolve(v.url);
    if (v.fileId) return S.fileUrl(v.fileId).catch(function () { return ''; });
    return Promise.resolve('');
  }
  function fillImgs(root) {
    $$('[data-img]', root).forEach(function (el) {
      src(JSON.parse(el.getAttribute('data-img'))).then(function (u) { if (!u) return; if (el.tagName === 'IMG') { el.src = u; el.hidden = false; } else el.style.backgroundImage = 'url("' + u + '")'; });
    });
  }
  var imgAttr = function (v) { return v ? ' data-img="' + esc(JSON.stringify(v)) + '"' : ''; };

  /* ---------------------------------------------------------- contact form leads */
  var cf = $('#contact-inquiry-form');
  if (cf) {
    window.addEventListener('submit', function (e) {
      if (e.target !== cf || !cf.checkValidity()) return;
      var fd = new FormData(cf);
      S.submit('leads', {
        name: ((fd.get('firstName') || '') + ' ' + (fd.get('lastName') || '')).trim(), practice: fd.get('practice') || '', email: fd.get('email') || '', phone: fd.get('phone') || '',
        topic: fd.get('topic') || '', preference: fd.get('preference') || '', source: fd.get('source') || '', message: fd.get('message') || '', page: location.pathname
      }).catch(function () {});
    }, true);
  }

  var allPosts = null, allAuthors = null;
  function postsAndAuthors() {
    if (!allPosts) allPosts = Promise.all([S.list('posts').catch(function () { return []; }), S.published('authors').catch(function () { return []; }), S.list('authors').catch(function () { return []; })])
      .then(function (r) { allAuthors = r[2]; return r[0]; });
    return allPosts;
  }
  var cardHTML = function (p) {
    var href = 'post.html?slug=' + encodeURIComponent(p.slug);
    return '<article class="post-card" data-dynamic><a class="post-thumb" href="' + href + '" tabindex="-1" aria-hidden="true"><img alt="" hidden' + imgAttr(p.cover) + ' loading="lazy" decoding="async"></a>' +
      '<div class="post-card-text"><p class="post-meta">' + esc(p.category) + '<span>' + esc(fmt(p.date)) + '</span></p><h2><a href="' + href + '">' + esc(p.title) + '</a></h2><p>' + esc(p.excerpt) + '</p><a class="text-link" href="' + href + '">Read the post</a></div></article>';
  };

  /* ---------------------------------------------------------- blog index */
  var index = $('.blog-index');
  if (index) {
    postsAndAuthors().then(function (posts) {
      var fresh = posts.filter(function (p) { return p.status === 'published' && !p.staticUrl && (p.date || '') <= new Date().toISOString().slice(0, 10); })
        .sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
      if (!fresh.length) return;
      var old = $('.post-card.is-lead', index); if (old) old.classList.remove('is-lead');
      index.insertAdjacentHTML('afterbegin', fresh.map(cardHTML).join(''));
      $('.post-card', index).classList.add('is-lead');
      fillImgs(index);
      // new categories get a tab
      var tabs = $('.blog-tabs');
      if (tabs) fresh.forEach(function (p) {
        var c = slug(p.category || ''); if (!c || $('.blog-tabs a[href$="category=' + c + '"]')) return;
        tabs.insertAdjacentHTML('beforeend', '<a href="blog.html?category=' + c + '" aria-current="false">' + esc(p.category) + '</a>');
      });
      // re-apply the category / search filter to every card
      var params = new URLSearchParams(location.search), q = (params.get('query') || '').trim().toLowerCase(), cat = params.get('category') || 'all', shown = 0;
      $$('.post-card', index).forEach(function (card) {
        var meta = $('.post-meta', card), c = meta ? slug(meta.firstChild.textContent) : '', text = card.textContent.toLowerCase();
        var ok = (cat === 'all' || c === cat) && (!q || q.split(/\s+/).every(function (w) { return text.indexOf(w) > -1; }));
        card.hidden = !ok; if (ok) shown++;
      });
      var res = $('.blog-result'), empty = $('.blog-empty');
      if (q && res) res.textContent = shown + (shown === 1 ? ' result' : ' results') + ' for “' + params.get('query') + '”';
      if (empty) empty.hidden = shown > 0;
      $$('.blog-tabs a').forEach(function (a) { a.setAttribute('aria-current', String((new URL(a.href).searchParams.get('category') || 'all') === cat)); });
    });
  }

  /* ---------------------------------------------------------- single post */
  var host = $('#post-root');
  if (host) {
    var params = new URLSearchParams(location.search), want = params.get('slug'), preview = params.get('preview') === '1';
    postsAndAuthors().then(function (posts) {
      var p = posts.filter(function (x) { return x.slug === want && (x.status === 'published' || preview); })[0];
      if (p && p.staticUrl) { location.replace(p.staticUrl); return; }
      if (!p) {
        host.innerHTML = '<header class="page-head"><div class="wrap post-wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="index.html">Home</a></li><li><a href="blog.html">Articles</a></li></ol></nav><h1>Article not found</h1><p class="lead">This article may have been moved or unpublished.</p><p><a class="button" href="blog.html">Back to all articles</a></p></div></header>';
        doc.title = 'Article not found | Dental Concepts'; return;
      }
      var authors = (p.authors || []).map(function (id) { return allAuthors.filter(function (a) { return a.id === id; })[0]; }).filter(Boolean);
      var byline = authors.length ? '<span>By ' + authors.map(function (a) { return esc(a.name); }).join(', ').replace(/, ([^,]*)$/, ' and $1') + '</span>' : '';
      var body = doc.createElement('div'); body.innerHTML = p.body || '';
      var toc = [];
      $$('h2', body).forEach(function (h) { var id = slug(h.textContent) || 'section'; h.id = id; toc.push('<li><a href="#' + id + '">' + esc(h.textContent) + '</a></li>'); });
      var authorBox = authors.length ? '<section class="author-box" aria-label="About the author' + (authors.length > 1 ? 's' : '') + '"><h2 class="author-box-title">About the author' + (authors.length > 1 ? 's' : '') + '</h2>' + authors.map(function (a) {
        return '<div class="author-row"><span class="author-ava"' + imgAttr(a.photo) + '>' + (a.photo ? '' : esc(initials(a.name))) + '</span><div><p class="author-name">' + esc(a.name) + '</p>' + (a.role ? '<p class="author-role">' + esc(a.role) + '</p>' : '') + '<p class="author-bio">' + esc(a.bio || '') + '</p>' + (a.linkedin ? '<a class="text-link" href="' + esc(a.linkedin) + '" target="_blank" rel="noopener noreferrer">Connect<span class="visually-hidden"> with ' + esc(a.name) + ' (opens in a new tab)</span></a>' : '') + '</div></div>';
      }).join('') + '</section>' : '';
      host.innerHTML = (preview && p.status !== 'published' ? '<p class="post-preview-bar">Preview: this draft is not published yet.</p>' : '') +
        '<article class="post"><header class="page-head"><div class="wrap post-wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="index.html">Home</a></li><li><a href="blog.html">Articles</a></li><li aria-current="page">' + esc(p.title) + '</li></ol></nav>' +
        '<p class="post-meta">' + esc(p.category) + '<span><time datetime="' + esc(p.date) + '">' + esc(fmt(p.date)) + '</time></span>' + (p.readMinutes ? '<span>' + p.readMinutes + ' min read</span>' : '') + byline + '</p><h1>' + esc(p.title) + '</h1></div></header>' +
        '<div class="wrap post-wrap">' + (p.cover ? '<figure class="post-photo"><img alt="' + esc(p.coverAlt || '') + '" hidden' + imgAttr(p.cover) + '></figure>' : '') +
        '<div class="has-toc">' + (toc.length > 1 ? '<aside class="toc" aria-label="On this page"><p>On this page</p><ol>' + toc.join('') + '</ol></aside>' : '<div></div>') +
        '<div class="post-body">' + (p.excerpt ? '<p class="lead">' + esc(p.excerpt) + '</p>' : '') + body.innerHTML + authorBox + '</div></div></div></article>';
      fillImgs(host);
      doc.title = (p.metaTitle || p.title) + ' | Dental Concepts';
      var md = $('meta[name="description"]'); if (md) md.setAttribute('content', p.metaDesc || p.excerpt || '');
      if (preview) { var r = $('meta[name="robots"]'); if (r) r.setAttribute('content', 'noindex'); }
      // more articles
      var more = posts.filter(function (x) { return x.status === 'published' && x.id !== p.id && !x.staticUrl; }).slice(0, 3);
      var moreBox = $('#more-posts');
      if (moreBox && more.length) { moreBox.insertAdjacentHTML('afterbegin', more.map(cardHTML).join('')); $$('.post-card', moreBox).slice(3).forEach(function (c) { c.remove(); }); fillImgs(moreBox); }
    });
  }

  /* ---------------------------------------------------------- events */
  var evHost = $('[data-events]');
  if (evHost) {
    S.published('events').then(function (list) {
      var t = new Date().toISOString().slice(0, 10);
      list = list.filter(function (e) { return (e.date || '') >= t; }).sort(function (a, b) { return String(a.date + (a.startTime || '')).localeCompare(String(b.date + (b.startTime || ''))); });
      if (!list.length) return;
      evHost.innerHTML = '<ul class="event-list">' + list.map(function (e) {
        var d = new Date(e.date + 'T12:00:00'), when = [e.startTime, e.endTime].filter(Boolean).join('–');
        var reg = e.registerUrl ? '<a class="button" href="' + esc(e.registerUrl) + '" target="_blank" rel="noopener noreferrer">Register<span class="visually-hidden"> for ' + esc(e.title) + ' (opens in a new tab)</span></a>' : '<a class="button" href="contact.html">Contact us to attend</a>';
        return '<li class="event-card">' + (e.image ? '<span class="event-img"' + imgAttr(e.image) + '></span>' : '') + '<div class="event-date"><span>' + d.toLocaleDateString('en-US', { month: 'short' }) + '</span><b>' + d.getDate() + '</b></div>' +
          '<div class="event-text"><p class="post-meta">' + esc(e.type || 'Event') + '<span>' + esc(fmt(e.date)) + (when ? ', ' + esc(when) : '') + '</span></p><h2>' + esc(e.title) + '</h2><p>' + esc(e.description || '') + '</p>' +
          '<p class="event-where">' + esc(e.onlineUrl ? 'Online' + (e.location ? ' and at ' + e.location : '') : e.location || '') + '</p>' + reg + '</div></li>';
      }).join('') + '</ul>';
      fillImgs(evHost);
    });
  }

  /* ---------------------------------------------------------- home testimonials */
  var slides = $$('.quotes .carousel-slide');
  if (slides.length) {
    S.published('testimonials').then(function (list) {
      list = list.filter(function (t) { return t.featured; }).slice(0, slides.length);
      list.forEach(function (t, i) {
        var s = slides[i];
        s.classList.remove('is-placeholder');
        $('blockquote', s).innerHTML = '<p>' + esc(t.quote) + '</p>';
        $('figcaption', s).innerHTML = '<strong>' + esc(t.name) + '</strong><span>' + esc([t.role, t.city].filter(Boolean).join(', ')) + '</span>';
      });
    });
  }
})();
