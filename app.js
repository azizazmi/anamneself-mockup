/* AnamneSelf — Rule Engine & Local Dynamic Sync */
(function () {
  // ---------- 1. Sprite Ikon ----------
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
  Object.keys(P).forEach(function (k) { s += '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + P[k] + '</symbol>'; });
  s += '</svg>';
  document.body.insertAdjacentHTML('afterbegin', s);

  // ---------- 2. Helper Pembaca Universal (Chip, Radio, Text) ----------
  function getCheckedText(containerSelector) {
    var c = document.querySelector(containerSelector);
    if (!c) return [];
    var checked = c.querySelectorAll('input:checked');
    return Array.prototype.map.call(checked, function (el) {
      return el.closest('label') ? el.closest('label').textContent.replace('✓', '').trim() : el.value;
    });
  }

  function getFieldValue(sectionIndex, querySelector, defaultVal) {
    var sec = document.querySelectorAll('.step')[sectionIndex];
    if (!sec) return defaultVal;
    var el = sec.querySelector(querySelector);
    if (!el) return defaultVal;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
      return el.value.trim() || defaultVal;
    }
    return defaultVal;
  }

  // ---------- 3. Wizard Self-Anamnesis ----------
  var wiz = document.querySelector('[data-wizard]');
  if (wiz) {
    var steps = Array.prototype.slice.call(wiz.querySelectorAll('.step'));
    var bars = Array.prototype.slice.call(wiz.querySelectorAll('.stepper .s'));
    var meta = document.getElementById('step-meta');
    var titles = [
      'Keluhan Utama & Lain',
      'Riwayat Penyakit Sekarang',
      'Riwayat Penyakit Dahulu',
      'Riwayat Penyakit Keluarga',
      'Riwayat Sosial & Kebiasaan',
      'Alergi & Obat',
      'Tinjau & Kirim'
    ];
    var cur = 0;

    function show(i) {
      cur = Math.max(0, Math.min(steps.length - 1, i));
      steps.forEach(function (el, k) { el.classList.toggle('active', k === cur); });
      bars.forEach(function (b, k) { b.className = 's' + (k < cur ? ' done' : k === cur ? ' cur' : ''); });
      if (meta) {
        meta.innerHTML = '<span>Langkah ' + (cur + 1) + ' dari ' + steps.length + '</span><span>' + (titles[cur] || '') + '</span>';
      }
      if (cur === steps.length - 1) buildReview();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    wiz.addEventListener('click', function (e) {
      var n = e.target.closest('[data-next]'), p = e.target.closest('[data-prev]');
      if (n) show(cur + 1);
      if (p) show(cur - 1);
    });

    var pain = document.getElementById('nyeri'), painVal = document.getElementById('nyeri-val');
    if (pain) {
      pain.addEventListener('input', function () { painVal.textContent = pain.value + '/10'; });
    }

    // Fungsi Kumpul Data Pasien (Membaca Chip Maupun Textarea)
    function kumpulkanDataPasien() {
      // 1. Keluhan Utama & Lain (Langkah 1)
      var kuChips = getCheckedText('section[data-step="1"] .q:nth-of-type(1)');
      var ku = kuChips.length ? kuChips[0] : (getFieldValue(0, 'textarea', 'Batuk'));

      var klChips = getCheckedText('section[data-step="1"] .q:nth-of-type(2)');
      var kl = klChips.length ? klChips : ['Demam', 'Sesak napas', 'Nyeri tenggorokan'];

      // 2. RPS (Langkah 2)
      var lokasi = getFieldValue(1, 'textarea:nth-of-type(1)', 'Dada tengah dan tenggorokan');
      var sensasi = getFieldValue(1, 'textarea:nth-of-type(2)', 'Batuk berdahak kental, rasa berat di dada');
      var keparahan = pain ? pain.value : '4';
      var durasi = getFieldValue(1, '#durasi', '5') + ' ' + getFieldValue(1, '#satuan', 'hari');
      var frek = getFieldValue(1, '.q:nth-of-type(5) input', '5') + ' kali/hari';
      var durSerang = getFieldValue(1, '.q:nth-of-type(6) input', '10') + ' menit';
      
      var faktorPemicuList = getCheckedText('section[data-step="2"] .q:last-of-type');
      var faktorPemicu = faktorPemicuList.length ? faktorPemicuList.join(', ') : (getFieldValue(1, 'section[data-step="2"] textarea:last-of-type', 'Udara dingin malam hari'));

      // 3. RPD (Langkah 3)
      var riwSerupa = getCheckedText('section[data-step="3"] .q:nth-of-type(1)')[0] || 'Ya (sekitar 6 bulan lalu)';
      var kontakTb = getCheckedText('section[data-step="3"] .q:nth-of-type(2)')[0] || 'Belum diketahui';
      var riwKeturunan = getCheckedText('section[data-step="3"] .q:nth-of-type(3)').join(', ') || 'Asma';
      var operasi = getCheckedText('section[data-step="3"] .q:nth-of-type(4)')[0] || 'Tidak';
      var cedera = getCheckedText('section[data-step="3"] .q:nth-of-type(5)')[0] || 'Tidak';

      // 4. RPK (Langkah 4)
      var rpkSerupa = getCheckedText('section[data-step="4"] .q:nth-of-type(1)')[0] || 'Ya (anak batuk pilek)';
      var rpkKeturunan = getCheckedText('section[data-step="4"] .q:nth-of-type(2)')[0] || 'Ya (ibu asma)';
      var rpkMenular = getCheckedText('section[data-step="4"] .q:nth-of-type(3)')[0] || 'Tidak';

      // 5. Sosial & Kebiasaan (Langkah 5)
      var makanan = getFieldValue(4, 'textarea', 'Nasi goreng dan teh');
      var rokok = getCheckedText('section[data-step="5"] .q:nth-of-type(7)')[0] || 'Ya';
      var batangRokok = getFieldValue(4, '.q:nth-of-type(8) input', '10');
      var rokokFinal = rokok.indexOf('Ya') !== -1 ? 'Ya (± ' + batangRokok + ' batang/hari)' : 'Tidak';

      // 6. Alergi & Obat (Langkah 6)
      var alergi = getCheckedText('section[data-step="6"] .q:nth-of-type(1)')[0] || 'Belum diketahui';
      var obat = getCheckedText('section[data-step="6"] .q:nth-of-type(2)')[0] || 'Ya (Parasetamol bila demam)';
      var khusus = getCheckedText('section[data-step="6"] .q:nth-of-type(3)').join(', ') || 'Tidak ada';

      return {
        keluhanUtama: ku,
        keluhanLain: kl,
        lokasi: lokasi,
        sensasi: sensasi,
        keparahan: keparahan,
        durasi: durasi,
        frekuensi: frek,
        durasiSerangan: durSerang,
        faktorPemicu: faktorPemicu,
        riwayatSerupa: riwSerupa,
        kontakTB: kontakTb,
        penyakitKeturunan: riwKeturunan,
        operasi: operasi,
        cedera: cedera,
        keluargaKeluhanSerupa: rpkSerupa,
        keluargaPenyakitKeturunan: rpkKeturunan,
        keluargaMenular: rpkMenular,
        makananTerakhir: makanan,
        merokok: rokokFinal,
        alergiObat: alergi,
        obatDikonsumsi: obat,
        kondisiKhusus: khusus
      };
    }

    function buildReview() {
      var out = document.getElementById('review');
      if (!out) return;
      var d = kumpulkanDataPasien();
      var rows = [
        ['Keluhan Utama', d.keluhanUtama],
        ['Keluhan Lain', d.keluhanLain.join(', ')],
        ['Tingkat Keparahan', d.keparahan + '/10'],
        ['Durasi Keluhan', d.durasi],
        ['Keluhan Serupa Dahulu', d.riwayatSerupa],
        ['Kontak Erat TBC', d.kontakTB],
        ['Kebiasaan Merokok', d.merokok],
        ['Alergi Obat', d.alergiObat]
      ];
      out.innerHTML = rows.map(function (r) {
        return '<div class="review-item"><b>' + r[0] + '</b><span>' + r[1].replace(/</g, '&lt;') + '</span></div>';
      }).join('');
    }

    var btnKirim = wiz.querySelector('section[data-step="7"] .btn-primary, section[data-step="6"] .btn-primary');
    if (btnKirim) {
      btnKirim.addEventListener('click', function () {
        var dataPasien = kumpulkanDataPasien();
        localStorage.setItem('anamneself_data', JSON.stringify(dataPasien));
      });
    }

    show(0);
  }

  // ---------- 4. KUNCI JAWABAN & RULE-BASED ENGINE PADA RINGKASAN DOKTER ----------
  if (window.location.pathname.indexOf('ringkasan.html') !== -1) {
    var raw = localStorage.getItem('anamneself_data');
    var d = raw ? JSON.parse(raw) : {
      keluhanUtama: "Batuk",
      keluhanLain: ["Demam", "Sesak napas", "Nyeri tenggorokan"],
      lokasi: "Dada tengah dan tenggorokan",
      sensasi: "Batuk berdahak kental, dada terasa berat saat menarik napas",
      keparahan: "6",
      durasi: "5 hari",
      frekuensi: "5 kali/hari",
      durasiSerangan: "10 menit",
      faktorPemicu: "Terpapar udara dingin malam hari",
      riwayatSerupa: "Ya (sekitar 6 bulan lalu)",
      kontakTB: "Belum diketahui",
      penyakitKeturunan: "Asma",
      operasi: "Tidak",
      cedera: "Tidak",
      keluargaKeluhanSerupa: "Ya (anak batuk pilek)",
      keluargaPenyakitKeturunan: "Ya (ibu asma)",
      keluargaMenular: "Tidak",
      makananTerakhir: "Nasi goreng pedas",
      merokok: "Ya (± 10 batang/hari)",
      alergiObat: "Belum diketahui",
      obatDikonsumsi: "Ya (Parasetamol bila demam)",
      kondisiKhusus: "Tidak ada"
    };

    // Render Data Pasien ke Kolom Kiri
    var ku = document.getElementById('dt-keluhan-utama');
    var kl = document.getElementById('dt-keluhan-lain');
    if (ku) ku.innerHTML = '<span class="badge badge-danger">' + d.keluhanUtama + '</span>';
    if (kl) kl.innerHTML = d.keluhanLain.map(function (item) { return '<span class="badge badge-neutral">' + item + '</span>'; }).join(' ');

    var rps = document.getElementById('dt-rps');
    if (rps) {
      rps.innerHTML = 
        '<dt>Lokasi keluhan</dt><dd>' + d.lokasi + '</dd>' +
        '<dt>Sensasi dirasakan</dt><dd>' + d.sensasi + '</dd>' +
        '<dt>Tingkat keparahan</dt><dd>' + d.keparahan + '/10 (sedang)</dd>' +
        '<dt>Lama keluhan</dt><dd>' + d.durasi + '</dd>' +
        '<dt>Frekuensi</dt><dd>' + d.frekuensi + '</dd>' +
        '<dt>Durasi serangan</dt><dd>' + d.durasiSerangan + '</dd>' +
        '<dt>Faktor pencetus</dt><dd>' + d.faktorPemicu + '</dd>';
    }

    var rpd = document.getElementById('dt-rpd');
    if (rpd) {
      rpd.innerHTML = 
        '<dt>Keluhan serupa</dt><dd>' + d.riwayatSerupa + '</dd>' +
        '<dt>Kontak erat TBC</dt><dd><span class="' + (d.kontakTB.indexOf('Belum') !== -1 ? 'unknown' : '') + '">' + d.kontakTB + '</span></dd>' +
        '<dt>Penyakit keturunan</dt><dd>' + d.penyakitKeturunan + '</dd>' +
        '<dt>Riwayat operasi</dt><dd>' + d.operasi + '</dd>' +
        '<dt>Cedera serius</dt><dd>' + d.cedera + '</dd>';
    }

    var rpk = document.getElementById('dt-rpk');
    if (rpk) {
      rpk.innerHTML = 
        '<dt>Keluhan serupa</dt><dd>' + d.keluargaKeluhanSerupa + '</dd>' +
        '<dt>Penyakit keturunan</dt><dd>' + d.keluargaPenyakitKeturunan + '</dd>' +
        '<dt>Penyakit menular</dt><dd>' + d.keluargaMenular + '</dd>';
    }

    var obat = document.getElementById('dt-obat');
    if (obat) {
      obat.innerHTML = 
        '<dt>Alergi obat</dt><dd><span class="' + (d.alergiObat.indexOf('Belum') !== -1 ? 'unknown' : '') + '">' + d.alergiObat + '</span></dd>' +
        '<dt>Obat dikonsumsi</dt><dd>' + d.obatDikonsumsi + '</dd>' +
        '<dt>Kondisi khusus</dt><dd>' + d.kondisiKhusus + '</dd>';
    }

    // ---------- 5. LOGIKA EVALUASI CDSS (KOLOM KANAN) ----------  
    // ---------- RENDER CDSS (KOLOM KANAN) ----------
    if (typeof KNOWLEDGE_BASE_SAKIT_KEPALA !== 'undefined') {
      // 1. Evaluasi Red Flags
      var rf = KNOWLEDGE_BASE_SAKIT_KEPALA.evaluasiRedFlag(d);
      var cdssAlert = document.getElementById('res-cds-alert');
      if (cdssAlert) {
        cdssAlert.style.borderColor = rf.isRedFlag ? 'var(--danger-line)' : 'var(--teal)';
        cdssAlert.innerHTML = 
          '<div class="sec-title" style="color:' + (rf.isRedFlag ? 'var(--danger)' : 'var(--teal)') + '">' +
          '<svg class="ic ic-sm"><use href="' + (rf.isRedFlag ? '#i-alert' : '#i-shield') + '"/></svg>' + rf.title + '</div>' +
          '<p class="small">' + rf.desc + '</p>';
      }

      // 2. Evaluasi Diagnosis Banding & Skor Kriteria
      var dxContainer = document.getElementById('res-cds-dx-list');
      if (dxContainer && typeof KNOWLEDGE_BASE_SAKIT_KEPALA !== 'undefined') {
        var dxList = KNOWLEDGE_BASE_SAKIT_KEPALA.daftarDiagnosis;

        // Hitung kecocokan tiap diagnosis dan urutkan dari kecocokan tertinggi
        var evaluatedDx = dxList.map(function (item) {
          var matched = item.cekKesesuaian(d);
          var pct = Math.round((matched / item.totalKriteria) * 100);
          return {
            name: item.name,
            icd: item.icd,
            matched: matched,
            total: item.totalKriteria,
            percent: pct,
            pxFisik: item.pxFisik,
            pxPenunjang: item.pxPenunjang
          };
        }).sort(function (a, b) {
          return b.matched - a.matched; // Diagnosis dengan kriteria tertinggi di posisi teratas
        });

        // Render elemen .dx ke dalam container
        dxContainer.innerHTML = evaluatedDx.map(function (item, idx) {
          var isTop = idx === 0;
          var badgeClass = item.percent >= 70 ? 'badge-info' : 'badge-warn';
          var barClass = item.percent >= 70 ? '' : 'warn';

          return (
            '<div class="dx ' + (isTop ? 'sel' : '') + '">' +
              '<div class="dx-top">' +
                '<div><div class="dx-name">' + item.name + '</div><div class="dx-code">' + item.icd + '</div></div>' +
                '<span class="badge ' + badgeClass + '">' + item.matched + ' / ' + item.total + ' kriteria</span>' +
              '</div>' +
              '<div class="bar ' + barClass + '"><i style="width:' + item.percent + '%"></i></div>' +
              '<label class="pick"><input type="checkbox" ' + (isTop ? 'checked' : '') + '>Pilih sebagai diagnosis kerja</label>' +
            '</div>'
          );
        }).join('');

        // Perbarui checklist Pemeriksaan Fisik & Penunjang sesuai diagnosis teratas
        var topDx = evaluatedDx[0];
        var pxFisikUl = document.getElementById('res-px-fisik');
        if (pxFisikUl && topDx.pxFisik) {
          pxFisikUl.innerHTML = topDx.pxFisik.map(function (pf) {
            return '<li><svg class="ic ic-sm"><use href="#i-check"/></svg>' + pf + '</li>';
          }).join('');
        }

        var pxPenunjangUl = document.getElementById('res-px-penunjang');
        if (pxPenunjangUl && topDx.pxPenunjang) {
          pxPenunjangUl.innerHTML = topDx.pxPenunjang.map(function (pp) {
            return '<li><svg class="ic ic-sm"><use href="#i-check"/></svg>' + pp + '</li>';
          }).join('');
        }
      }
    }
  }

  // ---------- 6. Filter Tab & Seleksi Checkbox CDSS ----------
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

  document.querySelectorAll('.dx input[type=checkbox]').forEach(function (c) {
    c.addEventListener('change', function () { c.closest('.dx').classList.toggle('sel', c.checked); });
  });
})();