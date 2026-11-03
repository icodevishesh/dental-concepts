/* Shipping label: submits the form to the UPS integration and downloads the
   resulting label PDF directly, instead of opening a mailto draft. */
(function () {
  'use strict';
  var form = document.getElementById('ship-form');
  if (!form) return;
  var status = form.querySelector('.form-status');
  var btn = form.querySelector('button[type="submit"]');

  function base64ToBlob(base64) {
    var binary = atob(base64);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: 'application/pdf' });
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    if (btn.disabled) return;

    btn.disabled = true;
    var label = btn.textContent;
    btn.textContent = 'Generating label…';
    status.className = 'form-status';
    status.textContent = 'Contacting UPS…';

    var fd = new FormData(form);
    var payload = {
      direction: fd.get('direction'),
      doctor: fd.get('doctor'),
      practice: fd.get('practice'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      addressLine: fd.get('addressLine'),
      city: fd.get('city'),
      state: fd.get('state'),
      zip: fd.get('zip'),
      weightLbs: fd.get('weightLbs'),
      notes: fd.get('notes') || '',
    };

    try {
      var res = await fetch('/api/shipping-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      var data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not generate the label.');

      var blob = base64ToBlob(data.labelBase64);
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'ups-label-' + data.trackingNumber + '.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);

      status.className = 'form-status is-success';
      status.textContent = 'Label downloaded. Tracking number: ' + data.trackingNumber;
    } catch (err) {
      status.className = 'form-status is-error';
      status.textContent = (err && err.message) || 'Something went wrong. Please call 1-800-700-LABS.';
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  });
})();
