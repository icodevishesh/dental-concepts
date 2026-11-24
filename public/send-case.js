/* Send a case
   - Opens the online RX form in a dialog (choice page -> modal).
   - Renders the tooth chart, tab panels, conditional sub-fields, live summary.
   - Validates and submits to the form's data-endpoint (/api/upload-case) as
     multipart/form-data, matching the legacy upload-case contract. */
(function () {
  'use strict';
  var doc = document;
  var modal = doc.getElementById('sc-modal');
  var form = doc.getElementById('nc-form-el');
  if (!modal || !form) return;

  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };

  /* ---------------------------------------------------------------- dialog */
  var body = modal.querySelector('.sc-box-body');
  var last = null;
  var hdr = doc.querySelector('.site-header');
  var setH = function () { if (hdr) doc.documentElement.style.setProperty('--sc-hh', hdr.offsetHeight + 'px'); };
  setH(); addEventListener('resize', setH);
  var focusables = function () {
    return $$('button:not([disabled]),a[href],input:not([type=hidden]):not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])', modal)
      .filter(function (el) { return el.offsetParent !== null; });
  };
  function open() {
    last = doc.activeElement; modal.hidden = false; doc.documentElement.classList.add('sc-lock');
    requestAnimationFrame(function () { modal.classList.add('is-open'); var f = form.querySelector('input[name="doctor"]'); (f || body).focus({ preventScroll: true }); });
    if (location.hash !== '#digital-case') history.replaceState(null, '', '#digital-case');
  }
  function close() {
    modal.classList.remove('is-open'); doc.documentElement.classList.remove('sc-lock');
    setTimeout(function () { modal.hidden = true; }, 200);
    if (location.hash === '#digital-case') history.replaceState(null, '', location.pathname + location.search);
    if (last && last.focus) last.focus();
  }
  doc.addEventListener('click', function (e) {
    if (e.target.closest('[data-open-case]')) { e.preventDefault(); open(); }
    else if (e.target.closest('[data-close-case]')) close();
  });
  doc.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'Tab') {
      var f = focusables(); if (!f.length) return;
      if (e.shiftKey && doc.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && doc.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ------------------------------------------------------------ today date */
  var today = $('#nc-today');
  if (today) today.textContent = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  /* ---------------------------------------------------------- tooth chart */
  var toothSvg = '<svg viewBox="0 0 16 20" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M8 2C4.5 2 2.5 4 2.5 7c0 2.5 1 4 1.5 7 .3 1.8.6 3 1.3 3 .9 0 .8-2 1.2-4 .2-1 .5-1.5 1.5-1.5s1.3.5 1.5 1.5c.4 2 .3 4 1.2 4 .7 0 1-1.2 1.3-3 .5-3 1.5-4.5 1.5-7C13.5 4 11.5 2 8 2Z"/></svg>';
  var selected = {}; // toothNumber -> true
  var upperRow = $('.nc-arch[data-row="upper"]', form);
  var lowerRow = $('.nc-arch[data-row="lower"]', form);
  var teethValue = $('#nc-teeth-value', form);
  function toothBtn(n) {
    return '<button type="button" class="nc-tooth" data-tooth="' + n + '" aria-pressed="false" aria-label="Tooth ' + n + '">' + toothSvg + '<span>' + n + '</span></button>';
  }
  if (upperRow) { var u = ''; for (var i = 1; i <= 16; i++) u += toothBtn(i); upperRow.innerHTML = u; }
  if (lowerRow) { var l = ''; for (var j = 32; j >= 17; j--) l += toothBtn(j); lowerRow.innerHTML = l; }

  function teethList() {
    return Object.keys(selected).map(Number).sort(function (a, b) { return a - b; });
  }
  function syncTeeth() {
    var list = teethList();
    $$('.nc-tooth', form).forEach(function (b) {
      var on = !!selected[b.dataset.tooth];
      b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    var upperAll = true, lowerAll = true;
    for (var n = 1; n <= 16; n++) if (!selected[n]) upperAll = false;
    for (var m = 17; m <= 32; m++) if (!selected[m]) lowerAll = false;
    var up = $('[data-arch="upper"]', form), lo = $('[data-arch="lower"]', form);
    if (up) up.classList.toggle('is-on', upperAll);
    if (lo) lo.classList.toggle('is-on', lowerAll);
    var label = $('#nc-teeth-label', form);
    if (label) label.textContent = list.length ? list.length + (list.length === 1 ? ' tooth: ' : ' teeth: ') + list.join(', ') : 'No teeth selected';
    if (teethValue) teethValue.value = list.join(', ');
  }
  if (upperRow || lowerRow) {
    (upperRow && upperRow.parentNode ? upperRow.parentNode : form).addEventListener('click', function (e) {
      var t = e.target.closest('.nc-tooth'); if (!t) return;
      var n = t.dataset.tooth;
      if (selected[n]) delete selected[n]; else selected[n] = true;
      syncTeeth(); err('teeth'); refresh();
    });
  }
  $$('[data-arch]', form).forEach(function (chip) {
    chip.addEventListener('click', function () {
      var a = chip.dataset.arch;
      if (a === 'clear') { selected = {}; }
      else {
        var from = a === 'upper' ? 1 : 17, to = a === 'upper' ? 16 : 32;
        var allOn = true; for (var k = from; k <= to; k++) if (!selected[k]) allOn = false;
        for (var k2 = from; k2 <= to; k2++) { if (allOn) delete selected[k2]; else selected[k2] = true; }
      }
      syncTeeth(); err('teeth'); refresh();
    });
  });

  /* -------------------------------------------------------------- tabs */
  $$('.nc-tabs [role=tab]', form).forEach(function (tab) {
    tab.addEventListener('click', function () {
      $$('.nc-tabs [role=tab]', form).forEach(function (t) { t.setAttribute('aria-selected', t === tab ? 'true' : 'false'); });
      $$('.nc-panel', form).forEach(function (p) { p.hidden = p.dataset.panel !== tab.dataset.tab; });
    });
  });

  /* -------------------------------------------------- conditional fields */
  function syncConditionals() {
    var gold = $('input[name="items"][value="gold"]', form);
    var goldSub = $('[data-show="gold"]', form);
    if (goldSub) goldSub.hidden = !(gold && gold.checked);
    var implantItems = ['icrown', 'abutment', 'fullarch', 'itemp'];
    var anyImplant = implantItems.some(function (v) { var el = $('input[name="items"][value="' + v + '"]', form); return el && el.checked; });
    var impSub = $('[data-show-implant]', form);
    if (impSub) impSub.hidden = !anyImplant;

    var delivery = ($('input[name="delivery"]:checked', form) || {}).value || '';
    var digi = $('[data-delivery="digital"]', form), box = $('[data-delivery="box"]', form);
    if (digi) digi.hidden = delivery !== 'digital';
    if (box) box.hidden = !(delivery === 'ship' || delivery === 'dropoff');
    var shipOnly = $('[data-ship-only]', form);
    if (shipOnly) shipOnly.hidden = delivery !== 'ship';
  }

  /* -------------------------------------------------------- file drops */
  var files = { scans: [], photos: [] };
  var fmt = function (b) { return b < 1024 * 1024 ? Math.max(1, Math.round(b / 1024)) + ' KB' : (b / 1048576).toFixed(b < 10485760 ? 1 : 0) + ' MB'; };
  $$('.up-drop', form).forEach(function (zone) {
    var key = zone.dataset.drop, input = $('input[type=file]', zone), listEl = $('.up-list', zone);
    if (!files[key]) files[key] = [];
    var exts = (input.getAttribute('accept') || '').split(',').map(function (s) { return s.trim().toLowerCase(); });
    function okType(f) {
      if (exts.indexOf('image/*') > -1) return /^image\//.test(f.type) || /\.(heic|jpe?g|png|webp)$/i.test(f.name);
      var n = f.name.toLowerCase(); return exts.some(function (x) { return x && n.slice(-x.length) === x; });
    }
    function draw() {
      listEl.innerHTML = files[key].map(function (f, i) {
        return '<li><span class="up-file-ico" aria-hidden="true"></span><span class="up-file-name">' + esc(f.name) + '</span><span class="up-file-size">' + fmt(f.size) + '</span><button type="button" class="up-remove" data-i="' + i + '" aria-label="Remove ' + esc(f.name) + '">×</button></li>';
      }).join('');
      zone.classList.toggle('has-files', files[key].length > 0); refresh();
    }
    function add(fl) {
      var bad = [];
      Array.prototype.forEach.call(fl, function (f) {
        if (!okType(f)) { bad.push(f.name); return; }
        if (!files[key].some(function (g) { return g.name === f.name && g.size === f.size; })) files[key].push(f);
      });
      err(key, bad.length ? 'Not a supported file type: ' + bad.join(', ') : ''); draw();
    }
    input.addEventListener('change', function () { add(input.files); input.value = ''; });
    listEl.addEventListener('click', function (e) { var b = e.target.closest('.up-remove'); if (b) { files[key].splice(+b.dataset.i, 1); draw(); } });
    ['dragenter', 'dragover'].forEach(function (t) { zone.addEventListener(t, function (e) { e.preventDefault(); zone.classList.add('is-over'); }); });
    ['dragleave', 'drop'].forEach(function (t) { zone.addEventListener(t, function (e) { e.preventDefault(); if (t === 'dragleave' && zone.contains(e.relatedTarget)) return; zone.classList.remove('is-over'); }); });
    zone.addEventListener('drop', function (e) { if (e.dataTransfer && e.dataTransfer.files) add(e.dataTransfer.files); });
  });

  /* ------------------------------------------------------------ errors */
  function err(k, m) { var e = $('[data-err="' + k + '"]', form); if (e) e.textContent = m || ''; }

  /* ----------------------------------------------- summary / progress */
  function checkedItems() {
    return $$('input[name="items"]:checked', form).map(function (i) { return i; });
  }
  function doctorOk() {
    return ['doctor', 'practice', 'email', 'phone', 'patient'].every(function (n) {
      var el = $('[name="' + n + '"]', form); return el && el.checkValidity();
    });
  }
  function maxDays() {
    var items = checkedItems(), zero = false, max = 0;
    items.forEach(function (i) { var d = parseInt(i.dataset.days, 10); if (isNaN(d) || d === 0) zero = true; else max = Math.max(max, d); });
    if (!items.length) return null;
    if (max === 0) return { confirm: true };
    return { days: max, confirm: zero };
  }
  function refresh() {
    syncConditionals();

    var items = checkedItems();
    var labels = items.map(function (i) { return i.dataset.label || i.value; });
    var teeth = teethList();
    var shade = ($('[name="shade"]', form) || {}).value || '';
    var delivery = ($('input[name="delivery"]:checked', form) || {}).value || '';

    // summary
    var sItems = $('#sum-items'); if (sItems) sItems.textContent = labels.length ? labels.join(', ') : 'Nothing selected yet';
    var sTeeth = $('#sum-teeth'); if (sTeeth) sTeeth.textContent = teeth.length ? teeth.join(', ') : '—';
    var sShade = $('#sum-shade'); if (sShade) sShade.textContent = shade || '—';
    var sendMap = { digital: 'Digital scan' + (files.scans.length ? ' (' + files.scans.length + ')' : ''), ship: 'Shipping in', dropoff: 'Drop-off' };
    var sSend = $('#sum-send'); if (sSend) sSend.textContent = sendMap[delivery] || '—';

    var md = maxDays(), sDays = $('#sum-days'), sNote = $('#sum-days-note');
    if (sDays) {
      if (!md) { sDays.textContent = '—'; if (sNote) sNote.textContent = 'In-lab working days on our RX form, once the case arrives.'; }
      else if (md.confirm && !md.days) { sDays.textContent = 'Confirm'; if (sNote) sNote.textContent = 'Timing for this work is confirmed when the case arrives.'; }
      else { sDays.textContent = md.days + ' days'; if (sNote) sNote.textContent = (md.confirm ? 'At least ' : 'About ') + md.days + ' in-lab working days on our RX form.'; }
    }

    // need-by check
    var needBy = ($('[name="needBy"]', form) || {}).value || '';
    var dc = $('#nc-date-check');
    if (dc) {
      var ds = dc.querySelector('strong'), dn = dc.querySelector('span');
      dc.classList.remove('is-ok', 'is-warn');
      if (!needBy) { if (ds) ds.textContent = 'No date set'; if (dn) dn.textContent = 'Add a date and we’ll check it against the turnaround.'; }
      else {
        var until = Math.round((new Date(needBy) - new Date()) / 86400000);
        if (ds) ds.textContent = until < 0 ? 'Date is in the past' : 'Needed in ~' + until + ' day' + (until === 1 ? '' : 's');
        if (md && md.days && until >= 0 && until < md.days) { dc.classList.add('is-warn'); if (dn) dn.textContent = 'Tighter than the ' + md.days + '-day turnaround — call to confirm a rush.'; }
        else { dc.classList.add('is-ok'); if (dn) dn.textContent = until < 0 ? 'Please pick a future date.' : 'Looks fine against the turnaround.'; }
      }
    }

    // section state
    var boxOk = $$('input[name="box"]:checked', form).length > 0;
    var sendOk = delivery === 'digital' ? files.scans.length > 0 : (delivery === 'ship' || delivery === 'dropoff') ? boxOk : false;
    var state = {
      doctor: doctorOk(),
      making: items.length > 0,
      teeth: teeth.length > 0 && !!shade.trim(),
      send: sendOk,
      sign: !!(($('[name="signature"]', form) || {}).value || '').trim() && $('[name="warranty"]', form).checked && $('[name="consent"]', form).checked
    };
    $$('[data-chk]', form).forEach(function (li) { li.classList.toggle('is-ok', !!state[li.dataset.chk]); });
    $$('.sc-progress [data-prog]').forEach(function (li) { li.classList.toggle('is-ok', !!state[li.dataset.prog]); });
  }

  form.addEventListener('change', function () { refresh(); });
  form.addEventListener('input', function (e) {
    if (e.target.classList) e.target.classList.remove('is-bad');
    refresh();
  });

  /* ------------------------------------------------------------ submit */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var status = $('.nc-status', form), first = null;
    var fail = function (cond, k, m, el) { if (!cond) { err(k, m); first = first || el; } else err(k); };

    $$('[name="doctor"],[name="practice"],[name="email"],[name="phone"],[name="patient"]', form).forEach(function (i) {
      var ok = i.checkValidity(); i.classList.toggle('is-bad', !ok); if (!ok) first = first || i;
    });
    fail(checkedItems().length > 0, 'items', 'Pick at least one thing we’re making.', $('[data-sec="making"]', form));
    fail(teethList().length > 0, 'teeth', 'Select the teeth in this case.', $('#nc-chart', form));
    var shadeEl = $('[name="shade"]', form); var shadeOk = shadeEl.checkValidity();
    shadeEl.classList.toggle('is-bad', !shadeOk); if (!shadeOk) first = first || shadeEl;

    var delivery = ($('input[name="delivery"]:checked', form) || {}).value || '';
    fail(!!delivery, 'delivery', 'Tell us how the case will reach us.', $('[data-sec="send"]', form));
    if (delivery === 'digital') fail(files.scans.length > 0, 'scans', 'Add at least one scan file.', $('[data-drop="scans"]', form));
    else err('scans');
    if (delivery === 'ship' || delivery === 'dropoff') fail($$('input[name="box"]:checked', form).length > 0, 'box', 'Tell us what’s in the box.', $('[data-delivery="box"]', form));
    else err('box');

    var sigEl = $('[name="signature"]', form); var sigOk = sigEl.checkValidity();
    sigEl.classList.toggle('is-bad', !sigOk); if (!sigOk) first = first || sigEl;
    var signOk = sigOk && $('[name="warranty"]', form).checked && $('[name="consent"]', form).checked;
    fail(signOk, 'sign', 'Sign, agree to the warranty and confirm you can share these records.', sigOk ? $('[name="warranty"]', form) : sigEl);

    if (first) {
      status.className = 'nc-status is-bad';
      status.textContent = 'Please complete the highlighted items.';
      first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (first.focus) try { first.focus({ preventScroll: true }); } catch (x) {}
      return;
    }

    var endpoint = form.dataset.endpoint;
    if (!endpoint) {
      status.className = 'nc-status is-info';
      status.innerHTML = 'Online submission isn’t switched on yet. Please call <a href="tel:+18007005227">1-800-700-LABS</a>.';
      return;
    }

    var fd = new FormData(form);
    fd.delete('scans'); fd.delete('photos');
    files.scans.forEach(function (f) { fd.append('scans', f, f.name); });
    files.photos.forEach(function (f) { fd.append('photos', f, f.name); });

    var xhr = new XMLHttpRequest(), bar = $('.up-bar', form), btn = $('button[type=submit]', form);
    bar.hidden = false; btn.disabled = true; status.className = 'nc-status'; status.textContent = 'Sending…';
    xhr.upload.addEventListener('progress', function (ev) {
      if (ev.lengthComputable) { var p = Math.round(ev.loaded / ev.total * 100); $('span', bar).style.width = p + '%'; status.textContent = 'Sending… ' + p + '%'; }
    });
    xhr.onload = function () {
      btn.disabled = false; bar.hidden = true;
      if (xhr.status >= 200 && xhr.status < 300) {
        var ref = '';
        try { ref = (JSON.parse(xhr.responseText) || {}).caseId || ''; } catch (x) {}
        status.className = 'nc-status is-ok';
        status.innerHTML = 'Thank you — your case is with the lab, and we’ll be in touch to confirm it.' + (ref ? ' Your reference is <strong>' + esc(ref) + '</strong>.' : '');
      } else {
        status.className = 'nc-status is-bad';
        status.innerHTML = 'That didn’t go through. Please try again, or call <a href="tel:+18007005227">1-800-700-LABS</a>.';
      }
    };
    xhr.onerror = xhr.onload;
    xhr.open('POST', endpoint); xhr.send(fd);
  });

  /* ------------------------------------------------------------- init */
  syncTeeth();
  refresh();
  if (location.hash === '#digital-case') open();
})();
