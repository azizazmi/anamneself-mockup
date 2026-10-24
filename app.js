/* AnamneSelf — interaksi frontend (tanpa backend) */
(function () {
  // ---------- Sprite ikon ----------
  var P = {
    home: '<path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a7 7 0 0 1 4 6"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17.5h.01"/>',
    check: '<path d="m5 12 5 5L20 7"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    back: '<path d="M19 12H5m6-6-6 6 6 6"/>',
    activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    printer: '<path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2"/><rect x="6" y="14" width="12" height="7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
    stetho: '<path d="M6 3v6a4 4 0 0 0 8 0V3"/><path d="M10 13v2a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="11" r="2"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01"/>'
  };
  var s = '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">';
  Object.keys(P).forEach(function (k) {
    s += '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + P[k] + '</symbol>';
  });
  s += '</svg>';
  document.body.insertAdjacentHTML('afterbegin', s);

  // ---------- Login: arahkan sesuai peran ----------
  var login = document.querySelector('[data-login]');
  if (login) {
    login.addEventListener('submit', function (e) {
      e.preventDefault();
      var role = login.querySelector('input[name="role"]:checked').value;
      window.location.href = role === 'dokter' ? 'dokter-dashboard.html' : 'pasien-dashboard.html';
    });
    var hint = document.getElementById('role-hint');
    login.querySelectorAll('input[name="role"]').forEach(function (r) {
      r.addEventListener('change', function () {
        hint.textContent = r.value === 'dokter'
          ? 'Akses untuk dokter umum dan pengelola klinik/FKTP.'
          : 'Akses untuk pasien yang akan berkunjung ke klinik.';
        document.getElementById('id-label').textContent = r.value === 'dokter' ? 'Email / NIK' : 'Email / NIK';
      });
    });
  }

  // ---------- Wizard self-anamnesis ----------
  var wiz = document.querySelector('[data-wizard]');
  if (wiz) {
    var steps = Array.prototype.slice.call(wiz.querySelectorAll('.step'));
    var bars = Array.prototype.slice.call(wiz.querySelectorAll('.stepper .s'));
    var meta = document.getElementById('step-meta');
    var titles = ['Keluhan Utama', 'Riwayat Penyakit Sekarang', 'Riwayat Kesehatan', 'Alergi & Obat', 'Tinjau & Kirim'];
    var cur = 0;
    function show(i) {
      cur = Math.max(0, Math.min(steps.length - 1, i));
      steps.forEach(function (el, k) { el.classList.toggle('active', k === cur); });
      bars.forEach(function (b, k) { b.className = 's' + (k < cur ? ' done' : k === cur ? ' cur' : ''); });
      meta.innerHTML = '<span>Langkah ' + (cur + 1) + ' dari ' + steps.length + '</span><span>' + titles[cur] + '</span>';
      if (cur === steps.length - 1) buildReview();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    wiz.addEventListener('click', function (e) {
      var n = e.target.closest('[data-next]'), p = e.target.closest('[data-prev]');
      if (n) show(cur + 1);
      if (p) show(cur - 1);
    });
    var pain = document.getElementById('nyeri'), painVal = document.getElementById('nyeri-val');
    if (pain) pain.addEventListener('input', function () { painVal.textContent = pain.value + '/10'; });

    function buildReview() {
      var out = document.getElementById('review');
      var rows = [];
      var chosen = Array.prototype.map.call(wiz.querySelectorAll('input[name="gejala"]:checked'), function (x) { return x.parentNode.textContent.replace('✓', '').trim(); });
      rows.push(['Keluhan utama', (document.getElementById('keluhan').value || '—')]);
      rows.push(['Gejala dipilih', chosen.length ? chosen.join(', ') : '—']);
      rows.push(['Lama keluhan', (document.getElementById('durasi').value || '—') + ' ' + document.getElementById('satuan').value]);
      rows.push(['Tingkat keparahan', pain.value + '/10']);
      ['demam', 'sesak', 'asma', 'hipertensi', 'dm', 'kontaktb', 'alergi'].forEach(function (n) {
        var r = wiz.querySelector('input[name="' + n + '"]:checked');
        var lbl = { demam: 'Demam', sesak: 'Sesak napas', asma: 'Riwayat asma', hipertensi: 'Hipertensi', dm: 'Diabetes', kontaktb: 'Kontak pasien TB', alergi: 'Alergi obat' }[n];
        var v = r ? ({ ya: 'Ya', tidak: 'Tidak', tahu: 'Belum diketahui' }[r.value]) : 'Belum dijawab';
        rows.push([lbl, v]);
      });
      out.innerHTML = rows.map(function (r) { return '<div class="review-item"><b>' + r[0] + '</b><span>' + r[1].replace(/</g, '&lt;') + '</span></div>'; }).join('');
    }
    show(0);
  }

  // ---------- Filter tab (dashboard dokter) ----------
  document.querySelectorAll('.tabs').forEach(function (t) {
    t.addEventListener('click', function (e) {
      var b = e.target.closest('.tab'); if (!b) return;
      t.querySelectorAll('.tab').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      var f = b.getAttribute('data-filter');
      document.querySelectorAll('[data-status]').forEach(function (r) {
        r.style.display = (f === 'semua' || r.getAttribute('data-status') === f) ? '' : 'none';
      });
    });
  });

  // ---------- Pilih diagnosis (ringkasan) ----------
  document.querySelectorAll('.dx input[type=checkbox]').forEach(function (c) {
    c.addEventListener('change', function () { c.closest('.dx').classList.toggle('sel', c.checked); });
  });
})();
