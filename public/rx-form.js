(function () {
  'use strict';

  var form = document.getElementById('rxf');
  if (!form) return;

  var $ = function (id) { return document.getElementById(id); };
  var all = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var checked = function (sel) { return all(sel + ':checked'); };

  var RECIPIENT = 'accounts@dentalconceptssf.com';

  // ---- Dates ----
  var now = new Date();
  var todayIso = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
  $('rxf-today').textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  $('rxf-todays-date').value = todayIso;
  all('.rxf-date-min').forEach(function (i) { i.min = todayIso; });

  // ---- Tooth chart (Universal numbering) ----
  function buildArch(el, upper) {
    for (var i = 0; i < 16; i++) {
      var n = upper ? i + 1 : 32 - i;
      var d = Math.abs(i - 7.5), y = Math.round(d * d * 1.1);
      var lab = document.createElement('label');
      lab.className = 'rxf-tooth';
      lab.style.transform = 'translateY(' + (upper ? y : 62 - y) + 'px)';
      lab.innerHTML = '<input type="checkbox" name="teeth[]"><span aria-hidden="true"></span>';
      var inp = lab.querySelector('input');
      inp.value = n; inp.setAttribute('aria-label', 'Tooth ' + n);
      lab.querySelector('span').textContent = n;
      el.appendChild(lab);
    }
  }
  buildArch($('rxf-arch-upper'), true);
  buildArch($('rxf-arch-lower'), false);
  all('[data-arch]').forEach(function (b) {
    b.addEventListener('click', function () {
      var which = b.getAttribute('data-arch');
      all('input[name="teeth[]"]').forEach(function (t) {
        var n = +t.value;
        if (which === 'clear') t.checked = false;
        else if (which === 'upper' && n <= 16) t.checked = true;
        else if (which === 'lower' && n >= 17) t.checked = true;
      });
      update();
    });
  });

  // ---- Tabs ----
  var tabs = all('[role=tab]', form);
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      $(t.getAttribute('aria-controls')).hidden = !on;
    });
    var category = tab.id === 'rxf-tab-impl' ? 'impl' : tab.id === 'rxf-tab-other' ? 'other' : 'crown';
    $('rxf-category').value = category;
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t); update(); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, j = null;
      if (k === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (k === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (k === 'Home') j = 0;
      else if (k === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); selectTab(tabs[j], true); update(); }
    });
  });

  // ---- Turnaround table: in-lab days for 1-3 / 4+ / 8+ units; 0 = please call ----
  var TABLE = { allc: [10, 10, 0], fcz: [7, 7, 0], gold: [10, 7, 0], prov: [10, 10, 0], wax: [10, 7, 0], impl: [15, 0, 0], custom: [15, 15, 0] };

  function bizDaysUntil(iso) {
    var d = new Date(); d.setHours(0, 0, 0, 0);
    var t = new Date(iso + 'T00:00:00'), n = 0;
    while (d < t && n < 400) { d.setDate(d.getDate() + 1); var w = d.getDay(); if (w !== 0 && w !== 6) n++; }
    return n;
  }

  var state = {};
  function read() {
    var teeth = checked('input[name="teeth[]"]').map(function (i) { return +i.value; }).sort(function (a, b) { return a - b; });
    var crown = checked('[data-group=crown] input');
    var impl = checked('[data-group=impl] input').concat(checked('[data-impl]'));
    var other = checked('[data-group=other] input');
    return {
      teeth: teeth, units: teeth.length, crown: crown, impl: impl, other: other,
      anyResto: crown.length + impl.length + other.length > 0,
      custom: $('rxf-custom-shade').checked, scan: $('rxf-digital-scan').checked,
    };
  }

  function estimate(s) {
    var cats = [];
    s.crown.forEach(function (i) { if (i.getAttribute('data-cat')) cats.push(i.getAttribute('data-cat')); });
    if (s.impl.length) cats.push('impl');
    s.other.forEach(function (i) { if (i.getAttribute('data-cat')) cats.push(i.getAttribute('data-cat')); });
    if (s.custom) cats.push('custom');
    var band = s.units >= 8 ? 2 : s.units >= 4 ? 1 : 0;
    if (!cats.length) {
      if (s.other.length) return { days: null, call: true, big: 'Lab will confirm', note: 'We’ll confirm timing for this service when we call.' };
      return { days: null, call: false, big: 'Not set yet', note: 'Pick a restoration and teeth to see an estimate.' };
    }
    var vals = cats.map(function (c) { return TABLE[c] ? TABLE[c][band] : 0; });
    if (vals.indexOf(0) >= 0) {
      return { days: null, call: true, big: 'Call to schedule', note: band === 2 ? 'Cases of 8 or more units are scheduled with the lab by phone.' : 'Implant cases of 4 or more units are scheduled with the lab by phone.' };
    }
    var days = Math.max.apply(null, vals);
    return { days: days, call: false, big: days + ' in-lab days', note: (s.units ? s.units + (s.units === 1 ? ' unit' : ' units') : 'Based on 1 to 3 units') + '. Working days exclude weekends, holidays, pick-up and delivery.' };
  }

  function update() {
    var s = read(); state = s;
    var est = estimate(s); state.est = est;

    var crownCount = document.querySelector('[data-count=crown]');
    var implCount = document.querySelector('[data-count=impl]');
    var otherCount = document.querySelector('[data-count=other]');
    if (crownCount) crownCount.textContent = s.crown.length || '';
    if (implCount) implCount.textContent = s.impl.length || '';
    if (otherCount) otherCount.textContent = s.other.length || '';

    var goldOn = $('rxf-gold').checked;
    $('rxf-gold-alloy').hidden = !goldOn;
    if (!goldOn) all('input[name=gold_alloy]').forEach(function (r) { r.checked = false; });

    var implOn = s.impl.length > 0;
    $('rxf-implant-system').required = implOn;

    $('rxf-notice-custom').hidden = !s.custom;
    $('rxf-ship-hint').hidden = !$('rxf-deliv-ship').checked;
    $('rxf-notice-anterior').hidden = !s.teeth.some(function (t) { return (t >= 6 && t <= 11) || (t >= 22 && t <= 27); });
    $('rxf-notice-implant-scan').hidden = !(s.impl.length && s.scan);
    $('rxf-teeth-summary').textContent = s.units ? s.units + (s.units === 1 ? ' tooth' : ' teeth') + ' selected: #' + s.teeth.join(', #') : 'No teeth selected';

    var due = $('rxf-due-date').value, box = $('rxf-due-status'), title = 'No date set', text = 'Add a date and we’ll check it against the turnaround.', tone = '';
    if (due) {
      var bd = bizDaysUntil(due);
      if (est.days === null) { title = bd + ' business days away'; text = 'We’ll confirm this date when we call.'; }
      else if (bd >= est.days) { title = 'Fits the turnaround'; text = bd + ' business days away; this case needs about ' + est.days + '.'; tone = 'ok'; }
      else if (s.units > 4) { title = 'Too soon for rush'; text = 'Rush is limited to 4 units. Call (415) 558-9716 to talk it through.'; tone = 'warn'; }
      else if (bd < 3) { title = 'Needs management approval'; text = 'Under 3 business days needs approval and a quote. Call (415) 558-9716.'; tone = 'warn'; }
      else {
        var per = bd <= 5 ? 200 : 100, u = Math.max(s.units, 1);
        title = 'Rush: $' + per + ' per unit';
        text = 'About $' + (per * u) + ' for ' + u + (u === 1 ? ' unit' : ' units') + '. Pre-schedule with the Lab Manager at (415) 558-9716.';
        tone = 'warn';
      }
    }
    box.className = 'rxf-status' + (tone ? ' rxf-status--' + tone : '');
    $('rxf-due-title').textContent = title; $('rxf-due-text').textContent = text;

    if (showingErrors) validate(false);
  }

  // ---- Validation ----
  var showingErrors = false;
  function validate(focusSummary) {
    var s = state, errs = [];
    all('[required]', form).forEach(function (i) {
      var bad = !i.value || !i.value.trim();
      i.setAttribute('aria-invalid', bad && showingErrors ? 'true' : 'false');
      var fieldLabel = i.name;
      if (i.labels && i.labels[0]) {
        var textNodes = Array.prototype.slice.call(i.labels[0].childNodes).filter(function (n) { return n.nodeType === 3; }).map(function (n) { return n.textContent.trim(); }).filter(Boolean);
        if (textNodes.length) fieldLabel = textNodes.join(' ');
      }
      if (bad) errs.push({ label: fieldLabel, target: i.id });
    });
    var restoBad = !s.anyResto, teethBad = !s.units;
    var enclosedBad = checked('input[name="enclosed[]"]').length === 0;
    var deliveryBad = !form.querySelector('input[name=delivery]:checked');
    var agreeBad = !$('rxf-agree').checked;
    var goldOn = $('rxf-gold').checked;
    var goldAlloyBad = goldOn && !form.querySelector('input[name=gold_alloy]:checked');
    var implOn = s.impl.length > 0;
    var implCementationBad = implOn && !form.querySelector('input[name=implant_cementation]:checked');
    var implHoleBad = implOn && !form.querySelector('input[name=implant_hole]:checked');

    if (restoBad) errs.push({ label: 'A restoration or service', target: 'rxf-s2' });
    if (teethBad) errs.push({ label: 'Teeth on the chart', target: 'rxf-chart' });
    if (enclosedBad) errs.push({ label: 'What’s in the box', target: 'rxf-enclosed' });
    if (deliveryBad) errs.push({ label: 'How the case will reach us', target: 'rxf-deliv-ship' });
    if (goldAlloyBad) errs.push({ label: 'Gold alloy', target: 'rxf-gold-alloy' });
    if (implCementationBad) errs.push({ label: 'Implant cementation', target: 'rxf-panel-impl' });
    if (implHoleBad) errs.push({ label: 'Implant screw access', target: 'rxf-panel-impl' });
    if (agreeBad) errs.push({ label: 'Agreement to the warranty terms', target: 'rxf-agree' });

    $('rxf-err-resto').hidden = !(showingErrors && restoBad);
    $('rxf-err-teeth').hidden = !(showingErrors && teethBad);
    $('rxf-err-enclosed').hidden = !(showingErrors && enclosedBad);
    $('rxf-err-delivery').hidden = !(showingErrors && deliveryBad);
    $('rxf-agree-chip').style.borderColor = showingErrors && agreeBad ? '#b42318' : '';

    var box = $('rxf-error-summary');
    if (showingErrors && errs.length) {
      $('rxf-error-title').textContent = 'Fix ' + errs.length + (errs.length === 1 ? ' thing' : ' things') + ' before sending';
      var ul = $('rxf-error-list'); ul.innerHTML = '';
      errs.forEach(function (e) {
        var li = document.createElement('li'), a = document.createElement('a');
        a.href = '#' + e.target; a.textContent = e.label;
        a.addEventListener('click', function (ev) {
          ev.preventDefault();
          var t = $(e.target);
          t.scrollIntoView({ block: 'center' });
          var f = t.matches('input,textarea') ? t : t.querySelector('input,textarea');
          if (f) f.focus({ preventScroll: true });
        });
        li.appendChild(a); ul.appendChild(li);
      });
      box.hidden = false;
      if (focusSummary) { box.scrollIntoView({ block: 'start' }); box.focus({ preventScroll: true }); }
    } else {
      box.hidden = true;
      if (!errs.length) showingErrors = false;
    }
    return errs.length === 0;
  }

  function fieldValue(name) {
    var el = form.querySelector('[name="' + name + '"]');
    if (!el) return '';
    if (el.type === 'radio') { var picked = form.querySelector('[name="' + name + '"]:checked'); return picked ? picked.value.trim() : ''; }
    return el.value.trim();
  }
  function listValues(sel) { return checked(sel).map(function (i) { return i.value; }); }

  function buildEmailBody() {
    var s = state;
    var lines = [
      'Doctor: ' + fieldValue('doctor_name') + ' (license ' + fieldValue('license_number') + ')',
      'Doctor phone: ' + fieldValue('doctor_phone'),
      'Practice email: ' + fieldValue('practice_email'),
      'Patient: ' + fieldValue('patient_name') + ', phone ' + fieldValue('patient_phone'),
      'Appointment date: ' + fieldValue('appointment_date'),
      '',
      'Category: ' + $('rxf-category').value,
    ];
    var restorations = listValues('input[name="restoration[]"]');
    if (restorations.length) lines.push('Restorations: ' + restorations.join(', '));
    var goldAlloy = fieldValue('gold_alloy');
    if (goldAlloy) lines.push('Gold alloy: ' + goldAlloy);
    var implants = listValues('input[name="implant[]"]');
    if (implants.length) {
      lines.push('Implant components: ' + implants.join(', '));
      lines.push('Cementation: ' + fieldValue('implant_cementation') + ', screw access: ' + fieldValue('implant_hole'));
      lines.push('Implant system: ' + fieldValue('implant_system'));
    }
    var otherServices = listValues('input[name="other_service[]"]');
    if (otherServices.length) lines.push('Other services: ' + otherServices.join(', '));
    lines.push('Teeth: #' + s.teeth.join(', #'));
    lines.push('Shade: ' + fieldValue('shade') + ', stump shade: ' + fieldValue('stump_shade'));
    lines.push('Digital scan: ' + ($('rxf-digital-scan').checked ? 'Yes' : 'No'));
    lines.push('Custom shade visit: ' + ($('rxf-custom-shade').checked ? 'Yes' : 'No'));
    lines.push('Shade photos emailed: ' + ($('rxf-photos-sent').checked ? 'Yes' : 'No'));
    lines.push('', 'Instructions for the technician:', fieldValue('instructions'));
    lines.push('', 'Enclosed with the case: ' + listValues('input[name="enclosed[]"]').join(', '));
    lines.push('Delivery: ' + fieldValue('delivery'));
    lines.push('Due date: ' + fieldValue('due_date'));
    lines.push('', 'Signed: ' + fieldValue('signature'));
    return lines.join('\n');
  }

  function buildPayload() {
    var s = state;
    return {
      doctorName: fieldValue('doctor_name'),
      licenseNumber: fieldValue('license_number'),
      doctorPhone: fieldValue('doctor_phone'),
      practiceEmail: fieldValue('practice_email'),
      patientName: fieldValue('patient_name'),
      patientPhone: fieldValue('patient_phone'),
      appointmentDate: fieldValue('appointment_date'),
      category: $('rxf-category').value,
      restorations: listValues('input[name="restoration[]"]'),
      goldAlloy: fieldValue('gold_alloy'),
      implants: listValues('input[name="implant[]"]'),
      implantCementation: fieldValue('implant_cementation'),
      implantHole: fieldValue('implant_hole'),
      implantSystem: fieldValue('implant_system'),
      otherServices: listValues('input[name="other_service[]"]'),
      teeth: s.teeth,
      shade: fieldValue('shade'),
      stumpShade: fieldValue('stump_shade'),
      digitalScan: $('rxf-digital-scan').checked,
      customShade: $('rxf-custom-shade').checked,
      photosSent: $('rxf-photos-sent').checked,
      instructions: fieldValue('instructions'),
      enclosed: listValues('input[name="enclosed[]"]'),
      delivery: fieldValue('delivery'),
      dueDate: fieldValue('due_date'),
      signature: fieldValue('signature'),
      agreeWarranty: $('rxf-agree').checked,
      recipient: RECIPIENT,
    };
  }

  // ---- Submit: save to the database, then hand off to mailto (same pattern as the contact form) ----
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    update();
    showingErrors = true;
    if (!validate(true)) return;

    var btn = $('rxf-submit'), status = $('rxf-status');
    if (btn.classList.contains('is-pending')) return;
    btn.classList.add('is-pending'); btn.disabled = true;
    var label = btn.textContent; btn.textContent = 'Preparing…';
    status.textContent = 'Preparing your email draft…';

    var payload = buildPayload();
    var save = fetch('/api/rx-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(function (err) { console.error('[rx-form] save failed', err); });
    await Promise.race([save, new Promise(function (resolve) { setTimeout(resolve, 2500); })]);

    var ref = 'RX-' + String(now.getFullYear()).slice(2) + pad(now.getMonth() + 1) + pad(now.getDate()) + '-' + Math.floor(100 + Math.random() * 900);
    var subject = 'Dental Concepts RX form: ' + fieldValue('doctor_name') + ' / ' + fieldValue('patient_name') + ' (' + ref + ')';
    var href = 'mailto:' + RECIPIENT + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(buildEmailBody());

    $('rxf-ref').textContent = ref;
    $('rxf-ref-phone').textContent = fieldValue('doctor_phone') || 'your practice';

    try { window.location.href = href; } catch (err) { /* ignore */ }

    setTimeout(function () {
      btn.classList.remove('is-pending'); btn.disabled = false; btn.textContent = label;
      status.textContent = 'Your email draft should now be open, addressed to ' + RECIPIENT + '. Review it and press send. If no email app opened, copy your message and email ' + RECIPIENT + ', or call 1-800-700-LABS.';
      form.hidden = true;
      var success = $('rxf-success');
      success.hidden = false;
      success.scrollIntoView({ block: 'start' });
      success.focus({ preventScroll: true });
    }, 900);
  });

  $('rxf-restart').addEventListener('click', function () {
    form.reset(); showingErrors = false;
    all('[aria-invalid]', form).forEach(function (i) { i.setAttribute('aria-invalid', 'false'); });
    $('rxf-error-summary').hidden = true;
    $('rxf-success').hidden = true; form.hidden = false;
    $('rxf-todays-date').value = todayIso;
    selectTab(tabs[0]); update();
    $('rx-form').scrollIntoView({ block: 'start' });
  });

  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();
})();
