/* Dental Concepts — interaction layer
   Shared shell (progress pill, menu dialog, micro-interactions) and the home page
   scroll scenes. Everything here is an enhancement: without JavaScript, or with
   reduced motion, every section renders as plain, complete content. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  root.classList.add('js');
  if (!reduce) root.classList.add('fx');

  /* ------------------------------------------------------------------ shell */
  var SERVICES = [
    ['Full contour zirconia crowns', 'full-contour-zirconia-crowns.html'],
    ['Layered porcelain crowns', 'layered-porcelain-crowns.html'],
    ['Lithium disilicate (E.max)', 'lithium-disilicate.html'],
    ['Full arch restorations', 'full-arch-restorations.html'],
    ['Implant crowns', 'implant-crowns.html'],
    ['Custom shades', 'custom-shades.html']
  ];
  var MENU = [
    ['About the lab', 'about.html'],
    ['Case planner', 'planner.html'],
    ['Articles', 'blog.html'],
    ['Guides', 'guides.html'],
    ['RX form', 'rx.html'],
    ['Track a case', 'track-case.html'],
    ['Contact', 'contact.html']
  ];
  var here = location.pathname.split('/').pop() || 'index.html';
  var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var roll = function (t) { return '<span class="roll" data-text="' + esc(t) + '"><span>' + esc(t) + '</span></span>'; };
  var cur = function (h) { return h === here ? ' aria-current="page"' : ''; };

  function buildShell() {
    var pill = doc.createElement('div');
    pill.className = 'dock';
    pill.innerHTML =
      '<a class="dock-logo" href="index.html" aria-label="Dental Concepts home"><img src="assets/favicon.png" width="28" height="28" alt=""></a>' +
      '<span class="dock-progress" aria-hidden="true"><span class="dock-num">0</span>%</span>' +
      '<span class="dock-bar" aria-hidden="true"><span></span></span>' +
      '<button class="dock-menu" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="menu-dialog"><span class="dock-menu-label">Menu</span><span class="dock-burger" aria-hidden="true"><i></i><i></i></span></button>';

    var dlg = doc.createElement('div');
    dlg.className = 'menu-dialog';
    dlg.id = 'menu-dialog';
    dlg.setAttribute('role', 'dialog');
    dlg.setAttribute('aria-modal', 'true');
    dlg.setAttribute('aria-label', 'Site menu');
    dlg.hidden = true;
    var svc = SERVICES.map(function (s) { return '<li><a href="' + s[1] + '"' + cur(s[1]) + '>' + roll(s[0]) + '</a></li>'; }).join('');
    var items = MENU.map(function (m) { return '<li><a class="menu-link" href="' + m[1] + '"' + cur(m[1]) + '>' + roll(m[0]) + '</a></li>'; }).join('');
    dlg.innerHTML =
      '<div class="menu-backdrop" data-close></div>' +
      '<div class="menu-panel">' +
        '<ul class="menu-list">' +
          '<li class="menu-svc"><button class="menu-link menu-svc-btn" type="button" aria-expanded="false" aria-controls="menu-svc-list">' + roll('Lab services') + '<span class="menu-count">11</span><svg viewBox="0 0 12 8" width="12" height="8" aria-hidden="true"><path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
            '<ul class="menu-sub" id="menu-svc-list" hidden>' + svc + '<li><a class="menu-all" href="services.html">See all lab services</a></li></ul></li>' +
          items +
        '</ul>' +
        '<a class="button menu-cta" href="send-case.html">Send a case</a>' +
        '<div class="menu-contact"><a href="tel:+18007005227">1-800-700-LABS</a><a href="mailto:accounts@dentalconceptssf.com">accounts@dentalconceptssf.com</a><span>244 9th Street, San Francisco</span></div>' +
      '</div>';
    doc.body.appendChild(dlg);
    doc.body.appendChild(pill);
    root.classList.add('has-dock');
    return { pill: pill, dlg: dlg };
  }

  var shell = buildShell();
  var menuBtn = $('.dock-menu', shell.pill), dlg = shell.dlg, panel = $('.menu-panel', dlg);
  var label = $('.dock-menu-label', shell.pill);
  var outside = function () { return [$('.site-header'), $('main'), $('.site-footer'), $('.skip')].filter(Boolean); };
  var lastFocus = null, closeTimer;

  function openMenu() {
    clearTimeout(closeTimer);
    lastFocus = doc.activeElement;
    dlg.hidden = false;
    requestAnimationFrame(function () { dlg.classList.add('is-open'); });
    root.classList.add('menu-lock');
    outside().forEach(function (el) { el.setAttribute('inert', ''); });
    menuBtn.setAttribute('aria-expanded', 'true');
    label.textContent = 'Close';
    shell.pill.classList.add('is-open');
    var first = $('a,button', panel);
    if (first) first.focus({ preventScroll: true });
  }
  function closeMenu(restore) {
    dlg.classList.remove('is-open');
    root.classList.remove('menu-lock');
    outside().forEach(function (el) { el.removeAttribute('inert'); });
    menuBtn.setAttribute('aria-expanded', 'false');
    label.textContent = 'Menu';
    shell.pill.classList.remove('is-open');
    closeTimer = setTimeout(function () { dlg.hidden = true; }, reduce ? 0 : 320);
    if (restore !== false) menuBtn.focus({ preventScroll: true });
  }
  menuBtn.addEventListener('click', function () { dlg.classList.contains('is-open') ? closeMenu() : openMenu(); });
  dlg.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) closeMenu(); });
  doc.addEventListener('keydown', function (e) {
    if (!dlg.classList.contains('is-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
    if (e.key !== 'Tab') return;
    // the dock button stays reachable so "Close" is part of the loop
    var f = $$('a[href],button', panel).filter(function (el) { return el.offsetParent !== null; }).concat(menuBtn);
    var i = f.indexOf(doc.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
  });
  var svcBtn = $('.menu-svc-btn', dlg), svcList = $('#menu-svc-list', dlg);
  svcBtn.addEventListener('click', function () {
    var open = svcBtn.getAttribute('aria-expanded') !== 'true';
    svcBtn.setAttribute('aria-expanded', String(open));
    svcList.hidden = !open;
  });
  $$('a', dlg).forEach(function (a) { a.addEventListener('click', function () { closeMenu(false); }); });

  /* progress + theme: one rAF loop driven by scroll */
  var num = $('.dock-num', shell.pill), bar = $('.dock-bar span', shell.pill);
  var darkSel = '.site-header,.hero,.feature-band,.partner,.visit,.site-footer,.page-head,.svc-hero,.svc-facts,.contact-hero,.benefits,.stack-panel.is-dark,.showreel,.tool-aside';
  var darkEls = $$(darkSel);
  var shown = 0, ticking = false;
  function paintDock() {
    ticking = false;
    var max = root.scrollHeight - innerHeight;
    var p = max > 0 ? clamp(scrollY / max, 0, 1) : 0;
    var target = Math.round(p * 100);
    shown = reduce ? target : shown + (target - shown) * 0.35;
    if (Math.abs(target - shown) < 0.5) shown = target;
    num.textContent = Math.round(shown);
    bar.style.transform = 'scaleX(' + (shown / 100) + ')';
    // pick the dock theme from the section behind its centre line
    var y = innerHeight - 40, dark = false;
    for (var i = 0; i < darkEls.length; i++) {
      var r = darkEls[i].getBoundingClientRect();
      if (r.top <= y && r.bottom >= y && r.height) { dark = true; break; }
    }
    shell.pill.classList.toggle('on-dark', dark);
    if (shown !== target) request();
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(paintDock); } }
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  request();

  /* ------------------------------------------------------- micro-interactions */
  if (finePointer && !reduce) {
    // magnetic feel on pill buttons
    $$('.button, .dock-menu').forEach(function (b) {
      b.classList.add('is-magnetic');
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width, y = (e.clientY - r.top - r.height / 2) / r.height;
        b.style.setProperty('--tx', (x * 10).toFixed(1) + 'px');
        b.style.setProperty('--ty', (y * 8).toFixed(1) + 'px');
      });
      b.addEventListener('pointerleave', function () { b.style.setProperty('--tx', '0px'); b.style.setProperty('--ty', '0px'); });
    });
    // rolling characters on footer links
    $$('.footer-column a').forEach(function (a) {
      if (a.children.length) return;
      var t = a.textContent.trim(); if (!t) return;
      a.innerHTML = roll(t);
      a.setAttribute('aria-label', t);
    });
  }

  /* FAQ: one answer open at a time within each list */
  $$('.faq-list').forEach(function (list) {
    $$('details', list).forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        $$('details', list).forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  });

  /* ------------------------------------------------------------ hero proof */
  $$('[data-proof]').forEach(function (box) {
    var slides = $$('.proof-slide', box), status = $('.proof-status', box), i = 0, timer;
    if (slides.length < 2) return;
    function go(n, announce) {
      slides[i].classList.remove('is-on'); slides[i].setAttribute('aria-hidden', 'true');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('is-on'); slides[i].removeAttribute('aria-hidden');
      if (announce) status.textContent = 'Slide ' + (i + 1) + ' of ' + slides.length + ': ' + slides[i].textContent;
    }
    $('.proof-prev', box).addEventListener('click', function () { stop(); go(i - 1, true); });
    $('.proof-next', box).addEventListener('click', function () { stop(); go(i + 1, true); });
    function start() { if (reduce) return; stop(); timer = setInterval(function () { go(i + 1, false); }, 4800); }
    function stop() { clearInterval(timer); }
    box.addEventListener('pointerenter', stop); box.addEventListener('pointerleave', start);
    box.addEventListener('focusin', stop); box.addEventListener('focusout', start);
    slides.forEach(function (s, n) { if (n) s.setAttribute('aria-hidden', 'true'); });
    start();
  });

  /* --------------------------------------------------------- scroll scenes */
  // Each [data-scene] is a tall track with a sticky child. Progress 0..1 is the
  // share of the track scrolled past while the child is pinned.
  var scenes = $$('[data-scene]');
  var sceneHandlers = {};
  function sceneProgress(el) {
    var r = el.getBoundingClientRect();
    var span = r.height - (innerHeight - headerH());
    return span > 0 ? clamp((headerH() - r.top) / span, 0, 1) : (r.top < headerH() ? 1 : 0);
  }
  var hh = null;
  function headerH() { if (hh === null) { var h = $('.site-header'); hh = h ? h.offsetHeight : 0; } return hh; }
  addEventListener('resize', function () { hh = null; });
  var sceneTick = false;
  function runScenes() {
    sceneTick = false;
    scenes.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -innerHeight || r.top > innerHeight * 2) return;
      var p = sceneProgress(el);
      el.style.setProperty('--p', p.toFixed(4));
      var h = sceneHandlers[el.dataset.scene];
      if (h) h(el, p);
    });
  }
  function reqScenes() { if (!sceneTick) { sceneTick = true; requestAnimationFrame(runScenes); } }
  if (scenes.length && !reduce) {
    addEventListener('scroll', reqScenes, { passive: true });
    addEventListener('resize', reqScenes);
    addEventListener('load', reqScenes);
  }

  /* manifesto: words darken with progress; labels enter at set points */
  $$('.manifesto-text').forEach(function (p) {
    var words = p.textContent.trim().split(/\s+/);
    var sr = doc.createElement('span'); sr.className = 'visually-hidden'; sr.textContent = p.textContent.trim();
    var vis = doc.createElement('span'); vis.setAttribute('aria-hidden', 'true');
    vis.innerHTML = words.map(function (w) { return '<span class="w">' + esc(w) + '</span>'; }).join(' ');
    p.textContent = ''; p.appendChild(sr); p.appendChild(vis);
  });
  sceneHandlers.manifesto = function (el, p) {
    var ws = el._w || (el._w = $$('.w', el));
    var lit = Math.round(clamp(p / 0.82, 0, 1) * ws.length);
    if (el._lit === lit) return; el._lit = lit;
    ws.forEach(function (w, n) { w.classList.toggle('is-lit', n < lit); });
    $$('.tag', el).forEach(function (t) { t.classList.toggle('is-in', p >= +t.dataset.at); });
  };

  /* draggable labels with elastic return */
  $$('.tag[data-drag]').forEach(function (t) {
    var sx, sy, on = false;
    t.addEventListener('pointerdown', function (e) {
      on = true; sx = e.clientX; sy = e.clientY; t.setPointerCapture(e.pointerId); t.classList.add('is-drag');
    });
    t.addEventListener('pointermove', function (e) {
      if (!on) return;
      t.style.setProperty('--dx', (e.clientX - sx) + 'px'); t.style.setProperty('--dy', (e.clientY - sy) + 'px');
    });
    var end = function () { if (!on) return; on = false; t.classList.remove('is-drag'); t.style.setProperty('--dx', '0px'); t.style.setProperty('--dy', '0px'); };
    t.addEventListener('pointerup', end); t.addEventListener('pointercancel', end);
  });

  /* benefits: vertical scroll moves a horizontal strip */
  var wideBenefits = matchMedia('(min-width: 761px)');
  sceneHandlers.benefits = function (el, p) {
    var strip = el._s || (el._s = $('.benefit-strip', el));
    if (!wideBenefits.matches) { strip.style.transform = ''; return; }
    var dist = strip.scrollWidth - strip.parentNode.clientWidth;
    strip.style.transform = 'translate3d(' + (-p * dist).toFixed(1) + 'px,0,0)';
    var cards = el._c || (el._c = $$('.benefit', el));
    var idx = Math.round(p * (cards.length - 1));
    cards.forEach(function (c, n) { c.classList.toggle('is-current', n === idx); });
    var meter = $('.benefit-meter span', el); if (meter) meter.style.transform = 'scaleX(' + p.toFixed(3) + ')';
  };

  /* process: four equal ranges select the stage; tabs jump to that range */
  function setStage(el, i) {
    if (el._stage === i) return; el._stage = i;
    el.dataset.stage = i;
    $$('.process-tab', el).forEach(function (t, n) {
      t.setAttribute('aria-selected', String(n === i)); t.tabIndex = n === i ? 0 : -1;
      if (n === i && t.parentNode.scrollWidth > t.parentNode.clientWidth) {
        t.parentNode.scrollTo({ left: t.offsetLeft - t.parentNode.clientWidth / 2 + t.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
      }
    });
    $$('.process-panel', el).forEach(function (pn, n) { pn.classList.toggle('is-on', n === i); pn.setAttribute('aria-hidden', String(n !== i)); });
  }
  sceneHandlers.process = function (el, p) {
    var n = $$('.process-panel', el).length;
    setStage(el, Math.min(n - 1, Math.floor(p * n)));
  };
  $$('[data-scene="process"]').forEach(function (el) {
    var tabs = $$('.process-tab', el), n = tabs.length;
    el.classList.add('is-enhanced');
    setStage(el, 0);
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () {
        if (reduce) { setStage(el, i); return; }
        var r = el.getBoundingClientRect();
        var span = r.height - (innerHeight - headerH());
        var top = scrollY + r.top - headerH() + span * ((i + 0.5) / n);
        scrollTo({ top: top, behavior: 'smooth' });
      });
      t.addEventListener('keydown', function (e) {
        var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!k) return; e.preventDefault();
        var j = (i + k + n) % n; tabs[j].focus(); tabs[j].click();
      });
    });
  });

  /* value scene: nothing extra beyond --p (CSS drives the tiles) */
  sceneHandlers.value = function () {};
  if (!reduce) reqScenes();

  /* -------------------------------------------------------------- showreel */
  var reel = $('#reel-dialog');
  if (reel) {
    doc.body.appendChild(reel); // keep it outside <main>, which goes inert while open
    var vid = $('video', reel), opener = null;
    var play = $('.reel-play', reel), mute = $('.reel-mute', reel);
    function openReel(btn) {
      opener = btn;
      if (!vid.src) vid.src = vid.dataset.src;
      reel.hidden = false;
      requestAnimationFrame(function () { reel.classList.add('is-open'); });
      root.classList.add('menu-lock');
      outside().forEach(function (el) { el.setAttribute('inert', ''); });
      shell.pill.setAttribute('inert', '');
      $('.reel-close', reel).focus();
      vid.play().then(sync, sync);
    }
    function closeReel() {
      vid.pause();
      reel.classList.remove('is-open');
      root.classList.remove('menu-lock');
      outside().forEach(function (el) { el.removeAttribute('inert'); });
      shell.pill.removeAttribute('inert');
      setTimeout(function () { reel.hidden = true; }, reduce ? 0 : 260);
      if (opener) opener.focus({ preventScroll: true });
    }
    function sync() {
      play.textContent = vid.paused ? 'Play' : 'Pause';
      play.setAttribute('aria-label', vid.paused ? 'Play video' : 'Pause video');
      mute.textContent = vid.muted ? 'Unmute' : 'Mute';
    }
    $$('[data-reel]').forEach(function (b) { b.addEventListener('click', function () { openReel(b); }); });
    play.addEventListener('click', function () { vid.paused ? vid.play().then(sync, sync) : (vid.pause(), sync()); });
    mute.addEventListener('click', function () { vid.muted = !vid.muted; sync(); });
    vid.addEventListener('play', sync); vid.addEventListener('pause', sync);
    $$('[data-reel-close]', reel).forEach(function (b) { b.addEventListener('click', closeReel); });
    reel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closeReel(); return; }
      if (e.key !== 'Tab') return;
      var f = $$('button', reel), i = f.indexOf(doc.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    });
  }

  /* ----------------------------------------------------------- arc gallery */
  $$('[data-arc]').forEach(function (wrap) {
    var stage = $('.arc-stage', wrap), cards = $$('.arc-card', wrap), n = cards.length;
    var live = $('.arc-status', wrap), cursor = $('.arc-cursor', wrap);
    var pos = 0, raf = null, w = 300;
    wrap.classList.add('is-enhanced');
    function measure() { w = cards[0].offsetWidth || 300; }
    function layout() {
      var gap = w * (innerWidth < 760 ? 0.86 : 0.7);
      cards.forEach(function (c, i) {
        var d = i - pos, a = Math.abs(d);
        var s = 1 - Math.min(a, 3) * 0.13;
        c.style.transform = 'translate3d(' + (d * gap).toFixed(1) + 'px,' + (Math.min(a, 4) * Math.min(a, 4) * 9).toFixed(1) + 'px,0) rotate(' + (d * 6).toFixed(2) + 'deg) scale(' + s.toFixed(3) + ')';
        c.style.opacity = a > 3.2 ? 0 : (1 - Math.min(a, 3) * 0.2).toFixed(3);
        c.style.zIndex = 100 - Math.round(a * 10);
        c.classList.toggle('is-far', a > 2.4);
        c.classList.toggle('is-center', a < 0.5);
      });
    }
    function announce() {
      var i = Math.round(pos);
      live.textContent = 'Item ' + (i + 1) + ' of ' + n + ': ' + $('strong', cards[i]).textContent;
    }
    function animateTo(target) {
      target = clamp(Math.round(target), 0, n - 1);
      cancelAnimationFrame(raf);
      var from = pos, dist = Math.abs(target - from);
      if (reduce || dist < 0.001) { pos = target; layout(); announce(); return; }
      var dur = clamp(280 + dist * 60, 280, 460), t0 = null;
      (function step(ts) {
        if (!t0) t0 = ts;
        var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        pos = from + (target - from) * e; layout();
        if (k < 1) raf = requestAnimationFrame(step); else announce();
      })(performance.now());
    }
    // pointer drag with velocity; vertical page scroll stays native (touch-action: pan-y)
    var down = false, sx = 0, sp = 0, moved = false, lastX = 0, lastT = 0, vel = 0, pid = null;
    stage.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      down = true; moved = false; sx = lastX = e.clientX; sp = pos; lastT = performance.now(); vel = 0; pid = e.pointerId;
      cancelAnimationFrame(raf);
    });
    stage.addEventListener('pointermove', function (e) {
      if (cursor) { var r = wrap.getBoundingClientRect(); cursor.style.transform = 'translate(' + (e.clientX - r.left) + 'px,' + (e.clientY - r.top) + 'px)'; }
      if (!down) return;
      var dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 6) { moved = true; stage.setPointerCapture(pid); wrap.classList.add('is-dragging'); }
      if (!moved) return;
      var now = performance.now(), dt = Math.max(1, now - lastT);
      vel = 0.8 * ((e.clientX - lastX) / dt) + 0.2 * vel; lastX = e.clientX; lastT = now;
      pos = clamp(sp - dx / (w * 0.7), -0.4, n - 0.6); layout();
    });
    function release() {
      if (!down) return; down = false; wrap.classList.remove('is-dragging');
      if (moved) animateTo(pos - vel * 0.9);
    }
    stage.addEventListener('pointerup', release); stage.addEventListener('pointercancel', release);
    stage.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; return; }
      var c = e.target.closest('.arc-card');
      if (c && !c.classList.contains('is-center')) { e.preventDefault(); animateTo(cards.indexOf(c)); }
    }, true);
    stage.addEventListener('dragstart', function (e) { e.preventDefault(); });
    $('.arc-prev', wrap).addEventListener('click', function () { animateTo(Math.round(pos) - 1); });
    $('.arc-next', wrap).addEventListener('click', function () { animateTo(Math.round(pos) + 1); });
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); animateTo(Math.round(pos) + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); animateTo(Math.round(pos) - 1); }
    });
    cards.forEach(function (c, i) { $('a', c).addEventListener('focus', function () { if (Math.round(pos) !== i) animateTo(i); }); });
    pos = Math.min(2, n - 1);
    measure(); layout();
    addEventListener('resize', function () { measure(); layout(); });
  });

  /* --------------------------------------------------- testimonial carousel */
  $$('[data-carousel]').forEach(function (box) {
    var track = $('.carousel-track', box), slides = $$('.carousel-slide', box), status = $('.carousel-status', box), i = 0;
    function go(n) {
      i = clamp(n, 0, slides.length - 1);
      track.style.transform = 'translateX(' + (-i * 100) + '%)';
      slides.forEach(function (s, k) { s.setAttribute('aria-hidden', String(k !== i)); s.toggleAttribute('inert', k !== i); });
      status.textContent = 'Slide ' + (i + 1) + ' of ' + slides.length;
      $('.carousel-prev', box).disabled = i === 0;
      $('.carousel-next', box).disabled = i === slides.length - 1;
    }
    $('.carousel-prev', box).addEventListener('click', function () { go(i - 1); });
    $('.carousel-next', box).addEventListener('click', function () { go(i + 1); });
    box.classList.add('is-enhanced');
    go(0);
  });

  /* ----------------------------------------------- mosaic + one-time reveals */
  if ('IntersectionObserver' in window && !reduce) {
    var items = $$('.mosaic-item');
    items.forEach(function (m, k) { m.style.setProperty('--d', ((k % 4) * 110 + Math.floor(k / 4) * 70) + 'ms'); m.classList.add('is-soft'); });
    var mo = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('is-soft'); mo.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    items.forEach(function (m) { mo.observe(m); });
  }
})();

/* =====================================================================
   Route features: case planner, blog filter/search, article TOC, contact form
   ===================================================================== */
(function () {
  'use strict';
  var doc = document;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };

  /* ---------------------------------------------------------- case planner */
  // Pure function: rules + selection -> plan (or null until all four answers exist)
  function planCase(R, sel) {
    var type = R.type.filter(function (t) { return t.id === sel.type; })[0];
    if (!type || !sel.option || !sel.shade || !sel.timing) return null;
    var opt = type.options.filter(function (o) { return o.id === sel.option; })[0];
    if (!opt) return null;
    var key = opt.turnaround || type.turnaround || 'confirm';
    var t = R.turnaround[key];
    var list = [];
    list.push('A completed <a href="rx.html">RX form</a>' + (opt.rx ? ' with ' + esc(opt.rx) + ' ticked' : '') + '.');
    list.push(type.id === 'waxup' ? 'Your impression or scan, the opposing arch, and the bite, plus what you want the wax up to show.' :
      type.id === 'implant' || type.id === 'arch' ? 'Implant system, platform, and component details on the RX, with your impression or scan, the opposing arch, and the bite.' :
      'Your impression or scan with the opposing arch and bite.');
    if (type.id === 'crown') list.push('For anterior cases, a pre-op or study model, as the RX form asks.');
    if (sel.shade === 'rx') list.push('The shade, and the stump shade where relevant, written on the RX.');
    if (sel.shade === 'photo') list.push('Shade photographs emailed to <a href="mailto:photos@dentalconceptssf.com">photos@dentalconceptssf.com</a>, with the photos box ticked on the RX.');
    if (sel.shade === 'visit') list.push('A custom shade visit booked on <a href="tel:+14155589717">(415) 558-9717</a>. Allow about 15 to 20 minutes, and tick "Custom shade" on the RX.');
    list.push('Confirm with the lab how to send physical records or scan files before sending anything.');
    var notes = [t.note];
    if (sel.timing === 'sooner') notes.push('You need it sooner than listed, so call the lab on 1-800-700-LABS before sending the case to ask what is possible.');
    if (sel.shade === 'visit') notes.push('Allow for the shade visit when planning the date.');
    notes.push('Confirm timing for your case with the lab before scheduling the patient. Planner rules v' + R.version + '.');
    return { title: opt.label, page: opt.page, figure: t.figure, isConfirm: key === 'confirm', checklist: list, notes: notes };
  }

  var form = $('#planner'), R = window.PLANNER_RULES;
  if (form && R) {
    var sel = {};
    var order = ['type', 'option', 'shade', 'timing'];
    var step = function (k) { return $('[data-step="' + k + '"]', form); };
    var opts = function (name, list) {
      return list.map(function (o) {
        return '<label class="pl-opt"><input type="radio" name="' + name + '" value="' + o.id + '"><span>' + esc(o.label) + (o.hint ? '<small>' + esc(o.hint) + '</small>' : '') + '</span></label>';
      }).join('');
    };
    $('[data-options="type"]', form).innerHTML = opts('type', R.type);
    $('[data-options="shade"]', form).innerHTML = opts('shade', R.shade);
    $('[data-options="timing"]', form).innerHTML = opts('timing', R.timing);
    var body = $('#pr-body');
    function render() {
      // enable each step only once the one before it is answered
      order.forEach(function (k, i) {
        var s = step(k), ready = i === 0 || !!sel[order[i - 1]];
        s.disabled = !ready;
        s.classList.toggle('is-done', !!sel[k]);
      });
      var plan = planCase(R, sel);
      if (!plan) {
        var left = order.filter(function (k) { return !sel[k]; }).length;
        body.innerHTML = '<p class="pr-empty">Your turnaround and checklist appear here once all four questions are answered. ' + left + ' to go.</p>';
        return;
      }
      body.innerHTML =
        '<p class="pr-figure">' + esc(plan.figure) + '<small>' + (plan.isConfirm ? 'Not printed on the RX form' : 'Turnaround listed on the RX form') + ' · ' + esc(plan.title) + '</small></p>' +
        '<ul class="pr-list">' + plan.checklist.map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ul>' +
        plan.notes.map(function (n) { return '<p class="pr-note">' + esc(n) + '</p>'; }).join('') +
        '<div class="actions"><a class="button" href="assets/digital-rx.pdf" download>Download the RX form</a><a class="text-link" href="' + plan.page + '">About this service</a><a class="text-link" href="contact.html">Ask the lab</a></div>';
    }
    form.addEventListener('change', function (e) {
      var k = e.target.name; if (!k) return;
      sel[k] = e.target.value;
      // changing an answer resets every answer after it
      var i = order.indexOf(k);
      order.slice(i + 1).forEach(function (d) {
        if (k === 'type' && d === 'option') return;
        if (sel[d]) { delete sel[d]; $$('input[name="' + d + '"]', form).forEach(function (r) { r.checked = false; }); }
      });
      if (k === 'type') {
        delete sel.option;
        var type = R.type.filter(function (t) { return t.id === sel.type; })[0];
        $('.pl-q', step('option')).textContent = type.q;
        $('.pl-hint', step('option')).hidden = true;
        $('[data-options="option"]', form).innerHTML = opts('option', type.options);
      }
      render();
    });
    form.addEventListener('reset', function () {
      sel = {};
      setTimeout(function () {
        $('[data-options="option"]', form).innerHTML = '';
        $('.pl-hint', step('option')).hidden = false;
        $('.pl-q', step('option')).textContent = 'Which option?';
        render();
        $('input', step('type')).focus();
      });
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    render();
    window.planCase = planCase; // exposed for testing
  }

  /* ----------------------------------------------- blog: category + search */
  var posts = $$('.blog-index .post-card');
  if (posts.length) {
    var params = new URLSearchParams(location.search);
    var q = (params.get('query') || '').trim(), cat = params.get('category') || 'all';
    var input = $('.blog-search input');
    if (input) input.value = q;
    var slug = function (s) { return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };
    var shown = 0;
    posts.forEach(function (p) {
      var meta = $('.post-meta', p), c = meta ? slug(meta.firstChild.textContent) : '';
      var text = p.textContent.toLowerCase();
      var ok = (cat === 'all' || c === cat) && (!q || q.toLowerCase().split(/\s+/).every(function (w) { return text.indexOf(w) > -1; }));
      p.hidden = !ok; if (ok) shown++;
    });
    $$('.blog-tabs a').forEach(function (a) {
      var c = new URL(a.href).searchParams.get('category') || 'all';
      a.setAttribute('aria-current', String(c === cat));
    });
    var res = $('.blog-result'), empty = $('.blog-empty');
    if (q) { res.hidden = false; res.textContent = shown + (shown === 1 ? ' result' : ' results') + ' for “' + q + '”'; }
    if (empty) empty.hidden = shown > 0;
    if (q || cat !== 'all') {
      var t = doc.title; doc.title = (q ? 'Search: ' + q : $('.blog-tabs a[aria-current="true"]').textContent) + ' | ' + t;
    }
  }

  /* --------------------------------------- article TOC: highlight the section */
  var toc = $('.toc');
  if (toc && 'IntersectionObserver' in window) {
    var links = $$('a[href^="#"]', toc), map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-active'); });
        var a = map[e.target.id]; if (a) a.classList.add('is-active');
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    Object.keys(map).forEach(function (id) { var h = doc.getElementById(id); if (h) io.observe(h); });
  }

  /* --------------------------------------------------- contact form states */
  var cf = $('#contact-inquiry-form');
  if (cf) {
    cf.noValidate = true; // inline messages below replace the browser bubbles
    var btn = $('button[type="submit"]', cf), status = $('#contact-form-status');
    var fields = $$('input[required],select[required],textarea[required]', cf);
    var touched = {};
    function msg(el) {
      if (el.validity.valid) return '';
      if (el.validity.valueMissing) return 'This field is required.';
      if (el.validity.typeMismatch) return 'Enter a valid email address.';
      if (el.validity.tooShort) return 'Please write at least ' + el.minLength + ' characters.';
      if (el.validity.patternMismatch) return el.title || 'Check this value.';
      return 'Check this value.';
    }
    function showErr(el) {
      var m = msg(el), id = el.id + '-err', e = doc.getElementById(id);
      if (!e) { e = doc.createElement('span'); e.className = 'field-error'; e.id = id; el.insertAdjacentElement('afterend', e); }
      e.textContent = m;
      el.setAttribute('aria-invalid', String(!!m));
      var d = (el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      if (m && d.indexOf(id) < 0) d.push(id);
      if (!m) d = d.filter(function (x) { return x !== id; });
      if (d.length) el.setAttribute('aria-describedby', d.join(' ')); else el.removeAttribute('aria-describedby');
    }
    var phone = $('#contact-phone', cf);
    if (phone) { phone.setAttribute('pattern', '[0-9+()\\-.\\s]{7,}'); phone.title = 'Enter a phone number with at least 7 digits.'; }
    function validAll() { return fields.concat(phone ? [phone] : []).every(function (f) { return f.checkValidity(); }); }
    function update() { btn.setAttribute('aria-disabled', String(!validAll())); }
    cf.addEventListener('input', function (e) { if (touched[e.target.id]) showErr(e.target); update(); });
    cf.addEventListener('change', function (e) { if (e.target.id) { touched[e.target.id] = 1; showErr(e.target); } update(); });
    cf.addEventListener('focusout', function (e) { if (e.target.id && (e.target.required || e.target === phone)) { touched[e.target.id] = 1; showErr(e.target); } });
    // replace app.js's handler: validation, pending state, success and failure
    cf.addEventListener('submit', function (e) {
      e.preventDefault(); e.stopImmediatePropagation();
      if (btn.classList.contains('is-pending')) return;
      var bad = fields.concat(phone ? [phone] : []).filter(function (f) { touched[f.id] = 1; showErr(f); return !f.checkValidity(); });
      if (bad.length) {
        status.className = 'form-status is-error';
        status.textContent = 'Please fix ' + bad.length + (bad.length === 1 ? ' field' : ' fields') + ' before preparing the email.';
        bad[0].focus(); return;
      }
      btn.classList.add('is-pending'); btn.setAttribute('aria-busy', 'true');
      var label = btn.textContent; btn.textContent = 'Preparing…';
      status.className = 'form-status'; status.textContent = 'Preparing your email draft…';
      var fd = new FormData(cf), topic = String(fd.get('topic') || 'General question');
      var to = topic === 'Shade photographs' ? 'photos@dentalconceptssf.com' : 'accounts@dentalconceptssf.com';
      var lines = ['Name: ' + fd.get('firstName') + ' ' + fd.get('lastName'), 'Practice: ' + fd.get('practice'), 'Practice email: ' + fd.get('email'), 'Phone: ' + (fd.get('phone') || 'Not provided'), 'Topic: ' + topic, 'Preferred contact method: ' + (fd.get('preference') || 'Email')];
      if (fd.get('source')) lines.push('Heard about us: ' + fd.get('source'));
      lines.push('', 'Message:', String(fd.get('message') || ''));
      var href = 'mailto:' + to + '?subject=' + encodeURIComponent('Dental Concepts inquiry: ' + topic) + '&body=' + encodeURIComponent(lines.join('\n'));
      var left = false;
      var onBlur = function () { left = true; };
      window.addEventListener('blur', onBlur, { once: true });
      try { window.location.href = href; } catch (err) { left = false; }
      setTimeout(function () {
        window.removeEventListener('blur', onBlur);
        btn.classList.remove('is-pending'); btn.removeAttribute('aria-busy'); btn.textContent = label;
        status.className = 'form-status is-success';
        status.innerHTML = 'Your email draft should now be open, addressed to ' + to + '. Review it and press send. Nothing was sent by this website. ' +
          'If no email app opened, <a href="' + href.replace(/"/g, '&quot;') + '">try again</a>, copy your message and email <a href="mailto:' + to + '">' + to + '</a>, or call 1-800-700-LABS. Your answers are still in the form.';
      }, 900);
    }, true);
    update();
  }
})();
