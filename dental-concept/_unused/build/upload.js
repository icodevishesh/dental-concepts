/* Upload a case: restoration picker + case details + file drop zones.
   Files are sent only when the form's data-endpoint is set to a secure upload service. */
(function () {
  'use strict';
  var doc = document, form = doc.getElementById('upload-form'), R = window.PLANNER_RULES;
  if (!form || !R) return;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };
  var sel = {}, order = ['type', 'option', 'shade', 'timing'], files = { scans: [], rx: [], photos: [] };
  var step = function (k) { return $('[data-step="' + k + '"]', form); };
  var opts = function (name, list) {
    return list.map(function (o) {
      return '<label class="pl-opt"><input type="radio" name="' + name + '" value="' + o.id + '"><span>' + esc(o.label) + (o.hint ? '<small>' + esc(o.hint) + '</small>' : '') + '</span></label>';
    }).join('');
  };
  $('[data-options="type"]', form).innerHTML = opts('type', R.type);
  $('[data-options="shade"]', form).innerHTML = opts('shade', R.shade);
  $('[data-options="timing"]', form).innerHTML = opts('timing', R.timing);

  function getType() { return R.type.filter(function (t) { return t.id === sel.type; })[0]; }
  function plan() {
    var type = getType();
    if (!type || !sel.option || !sel.shade || !sel.timing) return null;
    var opt = type.options.filter(function (o) { return o.id === sel.option; })[0];
    if (!opt) return null;
    var key = opt.turnaround || type.turnaround || 'confirm', t = R.turnaround[key], list = [];
    list.push('The completed RX form' + (opt.rx ? ', with ' + esc(opt.rx) + ' ticked' : '') + '.');
    list.push(type.id === 'implant' || type.id === 'arch' ? 'Implant system and size on the RX, plus a full arch gingival scan taken without the healing abutment.' :
      type.id === 'waxup' ? 'Scans of both arches and the bite, with notes on what the wax-up should show.' : 'The prepared arch, the opposing arch and the bite.');
    if (type.id === 'crown') list.push('For anterior cases, a pre-op or study model, as the RX form asks.');
    if (sel.shade === 'rx') list.push('The shade, and the stump shade where relevant, written on the RX.');
    if (sel.shade === 'photo') list.push('Shade photos, uploaded below or emailed to <a href="mailto:photos@dentalconceptssf.com">photos@dentalconceptssf.com</a>.');
    if (sel.shade === 'visit') list.push('A shade visit booked on <a href="tel:+14155589717">(415) 558-9717</a>, with “Custom Shade” ticked on the RX.');
    var notes = [t.note];
    if (sel.timing === 'sooner') notes.push('Need it sooner? Rush service is available on most products when you pre-schedule it on (415) 558-9716.');
    return { title: opt.label, page: opt.page, figure: t.figure, isConfirm: key === 'confirm', list: list, notes: notes };
  }
  function detailsOk() { return $$('.up-details [required]', form).every(function (i) { return i.checkValidity(); }); }
  function render() {
    order.forEach(function (k, i) {
      var s = step(k); s.disabled = !(i === 0 || !!sel[order[i - 1]]); s.classList.toggle('is-done', !!sel[k]);
    });
    var p = plan(), body = $('#pr-body');
    body.innerHTML = p ? '<p class="pr-figure">' + esc(p.figure) + '<small>' + (p.isConfirm ? 'Not printed on the RX form' : 'In-lab working days on the RX form') + ' · ' + esc(p.title) + '</small></p>' +
      '<p class="up-sum-label">Include with this case</p><ul class="pr-list">' + p.list.map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ul>' +
      p.notes.map(function (n) { return '<p class="pr-note">' + esc(n) + '</p>'; }).join('') + '<a class="text-link up-about" href="' + p.page + '">About this service</a>'
      : '<p class="pr-empty">Your turnaround and checklist appear here once you choose the restoration, shade and timing.</p>';
    step('details').classList.toggle('is-done', detailsOk());
    step('files').classList.toggle('is-done', files.scans.length > 0 && files.rx.length > 0 && $('#up-consent').checked);
    var st = { plan: !!p, details: detailsOk(), scans: files.scans.length > 0, rx: files.rx.length > 0 };
    $$('[data-chk]', form).forEach(function (li) { li.classList.toggle('is-ok', !!st[li.dataset.chk]); });
    var prog = $$('.up-progress li'), done = [!!(sel.type && sel.option), !!(sel.shade && sel.timing), st.details, st.scans && st.rx];
    prog.forEach(function (li, i) { li.classList.toggle('is-ok', done[i]); });
  }
  function err(k, m) { var e = $('[data-err="' + k + '"]', form); if (e) e.textContent = m || ''; }

  form.addEventListener('change', function (e) {
    var k = e.target.name;
    if (order.indexOf(k) > -1) {
      sel[k] = e.target.value; err(k);
      order.slice(order.indexOf(k) + 1).forEach(function (d) {
        if (k === 'type' && d === 'option') return;
        if (sel[d]) { delete sel[d]; $$('input[name="' + d + '"]', form).forEach(function (r) { r.checked = false; }); }
      });
      if (k === 'type') {
        delete sel.option; var type = getType();
        $('.pl-q', step('option')).textContent = type.q;
        $('.pl-hint', step('option')).hidden = true;
        $('[data-options="option"]', form).innerHTML = opts('option', type.options);
      }
    }
    if (k === 'consent') err('consent');
    render();
  });
  form.addEventListener('input', function (e) { if (e.target.closest('.up-details')) { e.target.classList.remove('is-bad'); render(); } });

  /* ---- drop zones */
  var fmt = function (b) { return b < 1024 * 1024 ? Math.max(1, Math.round(b / 1024)) + ' KB' : (b / 1048576).toFixed(b < 10485760 ? 1 : 0) + ' MB'; };
  $$('.up-drop', form).forEach(function (zone) {
    var key = zone.dataset.drop, input = $('input[type=file]', zone), list = $('.up-list', zone);
    var exts = (input.getAttribute('accept') || '').split(',').map(function (s) { return s.trim().toLowerCase(); });
    function okType(f) {
      if (exts.indexOf('image/*') > -1) return /^image\//.test(f.type) || /\.(heic|jpe?g|png)$/i.test(f.name);
      var n = f.name.toLowerCase(); return exts.some(function (x) { return n.slice(-x.length) === x; });
    }
    function draw() {
      list.innerHTML = files[key].map(function (f, i) {
        return '<li><span class="up-file-ico" aria-hidden="true"></span><span class="up-file-name">' + esc(f.name) + '</span><span class="up-file-size">' + fmt(f.size) + '</span><button type="button" class="up-remove" data-i="' + i + '" aria-label="Remove ' + esc(f.name) + '">×</button></li>';
      }).join('');
      zone.classList.toggle('has-files', files[key].length > 0); render();
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
    list.addEventListener('click', function (e) { var b = e.target.closest('.up-remove'); if (b) { files[key].splice(+b.dataset.i, 1); draw(); } });
    ['dragenter', 'dragover'].forEach(function (t) { zone.addEventListener(t, function (e) { e.preventDefault(); zone.classList.add('is-over'); }); });
    ['dragleave', 'drop'].forEach(function (t) { zone.addEventListener(t, function (e) { e.preventDefault(); if (t === 'dragleave' && zone.contains(e.relatedTarget)) return; zone.classList.remove('is-over'); }); });
    zone.addEventListener('drop', function (e) { if (e.dataTransfer && e.dataTransfer.files) add(e.dataTransfer.files); });
  });

  /* ---- reset */
  form.addEventListener('reset', function () {
    sel = {}; files = { scans: [], rx: [], photos: [] };
    setTimeout(function () {
      $('[data-options="option"]', form).innerHTML = '';
      $('.pl-hint', step('option')).hidden = false; $('.pl-q', step('option')).textContent = 'Which option?';
      $$('.up-list', form).forEach(function (l) { l.innerHTML = ''; }); $$('.up-drop', form).forEach(function (z) { z.classList.remove('has-files'); });
      $$('.up-err', form).forEach(function (e) { e.textContent = ''; }); $('.up-status', form).textContent = '';
      $$('.is-bad', form).forEach(function (e) { e.classList.remove('is-bad'); });
      render(); $('input', step('type')).focus();
    });
  });

  /* ---- submit */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var first = null, status = $('.up-status', form);
    var need = function (cond, k, m, el) { if (!cond) { err(k, m); first = first || el; } else err(k); };
    order.forEach(function (k) { need(!!sel[k], k, 'Choose an option.', step(k)); });
    $$('.up-details [required]', form).forEach(function (i) { var ok = i.checkValidity(); i.classList.toggle('is-bad', !ok); if (!ok) first = first || i; });
    need(files.scans.length > 0, 'scans', 'Add at least one scan file.', $('[data-drop="scans"]', form));
    need(files.rx.length > 0, 'rx', 'Add the completed RX form.', $('[data-drop="rx"]', form));
    need($('#up-consent').checked, 'consent', 'Please confirm you can share these records.', $('#up-consent'));
    if (first) { status.className = 'up-status is-bad'; status.textContent = 'Please complete the highlighted items.'; first.scrollIntoView({ behavior: 'smooth', block: 'center' }); if (first.focus) first.focus({ preventScroll: true }); return; }
    var endpoint = form.dataset.endpoint;
    if (!endpoint && window.DCStore) { saveToStore(status); return; }
    if (!endpoint) {
      status.className = 'up-status is-info';
      status.innerHTML = 'Online upload isn’t switched on yet. Please call <a href="tel:+18007005227">1-800-700-LABS</a> or <a href="contact.html">contact the lab</a>, and we’ll tell you how to send the files.';
      return;
    }
    var fd = new FormData();
    order.forEach(function (k) { fd.append(k, sel[k]); });
    $$('.up-details input, .up-details select, .up-details textarea', form).forEach(function (i) { fd.append(i.name, i.value); });
    Object.keys(files).forEach(function (k) { files[k].forEach(function (f) { fd.append(k, f, f.name); }); });
    var xhr = new XMLHttpRequest(), bar = $('.up-bar', form), btn = $('button[type=submit]', form);
    bar.hidden = false; btn.disabled = true; status.className = 'up-status'; status.textContent = 'Uploading…';
    xhr.upload.addEventListener('progress', function (ev) { if (ev.lengthComputable) { var p = Math.round(ev.loaded / ev.total * 100); $('span', bar).style.width = p + '%'; status.textContent = 'Uploading… ' + p + '%'; } });
    xhr.onload = function () {
      btn.disabled = false;
      if (xhr.status >= 200 && xhr.status < 300) { status.className = 'up-status is-ok'; status.textContent = 'Thank you. Your case has been uploaded, and the lab will be in touch to confirm it.'; }
      else { status.className = 'up-status is-bad'; status.innerHTML = 'The upload didn’t go through. Please try again, or call <a href="tel:+18007005227">1-800-700-LABS</a>.'; }
    };
    xhr.onerror = xhr.onload;
    xhr.open('POST', endpoint); xhr.send(fd);
  });
  function labelOf(list, id) { var x = (list || []).filter(function (o) { return o.id === id; })[0]; return x ? x.label : ''; }
  function saveToStore(status) {
    var S = window.DCStore, btn = $('button[type=submit]', form), bar = $('.up-bar', form), type = getType();
    var all = []; Object.keys(files).forEach(function (k) { files[k].forEach(function (f) { all.push([k, f]); }); });
    var rec = { type: sel.type, option: sel.option, shade: sel.shade, timing: sel.timing, typeLabel: type ? type.label : '', optionLabel: type ? labelOf(type.options, sel.option) : '', shadeLabel: labelOf(R.shade, sel.shade), timingLabel: labelOf(R.timing, sel.timing), files: [] };
    $$('.up-details input, .up-details select, .up-details textarea', form).forEach(function (i) { rec[i.name] = i.value.trim(); });
    btn.disabled = true; bar.hidden = false; status.className = 'up-status'; status.textContent = 'Uploading…';
    var done = 0;
    all.reduce(function (p, kf) {
      return p.then(function () { return S.putFile(kf[1], 'case'); }).then(function (r) {
        rec.files.push({ id: r.id, name: r.name, size: r.size, type: r.type, kind: kf[0] });
        done++; var pc = Math.round(done / all.length * 100); $('span', bar).style.width = pc + '%'; status.textContent = 'Uploading… ' + pc + '%';
      });
    }, Promise.resolve()).then(function () { return S.submit('uploads', rec); }).then(function () {
      btn.disabled = false; status.className = 'up-status is-ok';
      status.textContent = 'Thank you. Your case has been uploaded, and the lab will be in touch to confirm it.' + (S.mode === 'local' ? ' (Test mode: saved in this browser only.)' : '');
    }).catch(function () {
      btn.disabled = false; status.className = 'up-status is-bad';
      status.innerHTML = 'The upload didn’t go through. Please try again, or call <a href="tel:+18007005227">1-800-700-LABS</a>.';
    });
  }
  render();
})();
