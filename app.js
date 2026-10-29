/* AnamneSelf — Rule Engine, Precise Form Reader & Dashboard Sync */
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

  // ---------- 2. Login Redirect ----------
  var login = document.querySelector('[data-login]');
  if (login) {
    login.addEventListener('submit', function (e) {
      e.preventDefault();
      var roleEl = login.querySelector('input[name="role"]:checked');
      var role = roleEl ? roleEl.value : 'pasien';
      window.location.href = role === 'dokter' ? 'dokter-dashboard.html' : 'pasien-dashboard.html';
    });
    var hint = document.getElementById('role-hint');
    login.querySelectorAll('input[name="role"]').forEach(function (r) {
      r.addEventListener('change', function () {
        if (hint) {
          hint.textContent = r.value === 'dokter'
            ? 'Akses untuk dokter umum dan pengelola klinik/FKTP.'
            : 'Akses untuk pasien yang akan berkunjung ke klinik.';
        }
      });
    });
  }

  // ---------- 3. Helper Pembaca Input Form ----------
  function getRadioByName(name, def) {
    var el = document.querySelector('input[name="' + name + '"]:checked');
    if (!el) return def || 'Tidak';
    var lbl = el.closest('label');
    return lbl ? lbl.textContent.replace('✓', '').trim() : el.value;
  }

  function getCheckedArrayByName(name) {
    var els = document.querySelectorAll('input[name="' + name + '"]:checked');
    return Array.prototype.map.call(els, function (el) {
      var lbl = el.closest('label');
      return lbl ? lbl.textContent.replace('✓', '').trim() : el.value;
    });
  }

  // ---------- 4. Wizard Self-Anamnesis (anamnesis.html) ----------
  var wiz = document.querySelector('[data-wizard]');
  if (wiz) {
    var steps = Array.prototype.slice.call(wiz.querySelectorAll('.step'));
    var bars = Array.prototype.slice.call(wiz.querySelectorAll('.stepper .s'));
    var meta = document.getElementById('step-meta');
    var titles = [
      'Keluhan Utama & Lain',
      'Karakteristik Sakit Kepala',
      'Riwayat Penyakit Dahulu',
      'Riwayat Penyakit Keluarga',
      'Riwayat Sosial & Gaya Hidup',
      'Alergi & Obat-obatan',
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

    function kumpulkanDataPasien() {
      // 1. Keluhan Utama & Keluhan Lain
      var ku = getRadioByName('keluhan_utama', 'Sakit kepala');
      var kl = getCheckedArrayByName('gejala_lain');

      // 2. RPS (Sacred Seven)
      var lokasi = getRadioByName('lokasi', 'Leher belakang & tengkuk');
      var sensasi = getRadioByName('sensasi', 'Terasa kencang / berat seperti diikat');
      var keparahan = pain ? pain.value : '5';
      
      var durasiVal = document.getElementById('durasi') ? document.getElementById('durasi').value : '3';
      var durasiSat = document.getElementById('satuan') ? document.getElementById('satuan').value : 'hari';
      var durasi = (durasiVal || '3') + ' ' + durasiSat;

      var frekVal = document.getElementById('frekuensi') ? document.getElementById('frekuensi').value : '2';
      var frekSat = document.getElementById('satuan-frekuensi') ? document.getElementById('satuan-frekuensi').value : 'kali/hari';
      var frekuensi = (frekSat.indexOf('terus') !== -1) ? 'Terus-menerus sepanjang hari' : ((frekVal || '2') + ' kali/hari');

      var durasiSerangan = getRadioByName('durasi_serangan', '30 menit - 4 jam');

      var pemicuList = getCheckedArrayByName('pemicu');
      var faktorPemicu = pemicuList.length ? pemicuList.join(', ') : 'Tidak ada faktor pemicu khusus';

      // 3. RPD
      var riwSerupa = getRadioByName('keluhan_lalu', 'Ya');
      var cedera = getRadioByName('cedera', 'Tidak');
      var rpdList = getCheckedArrayByName('rpd_list');
      var penyakitDahulu = rpdList.length ? rpdList.join(', ') : 'Tidak ada';
      var kontakTb = getRadioByName('kontaktb', 'Tidak');
      var operasi = getRadioByName('operasi', 'Tidak');

      // 4. RPK
      var rpkSerupa = getRadioByName('rpk_serupa', 'Tidak');
      var rpkHipertensi = getRadioByName('rpk_hipertensi', 'Ya');
      var rpkMenular = getRadioByName('rpk_menular', 'Tidak');

      var rpkGabungan = [];
      if (rpkSerupa.indexOf('Ya') !== -1) rpkGabungan.push('Sakit kepala serupa/migren');
      if (rpkHipertensi.indexOf('Ya') !== -1) rpkGabungan.push('Hipertensi/Stroke');
      var teksRPK = rpkGabungan.length ? rpkGabungan.join(', ') : 'Tidak ada';

      // 5. Sosial & Gaya Hidup
      var stres = getRadioByName('stres', 'Ya');
      var tidur = getRadioByName('tidur', 'Kurang tidur / Insomnia');
      var makan = getRadioByName('makan', 'Teratur');
      var air = getRadioByName('air', 'Cukup (≥ 2 liter)');
      var rokok = getRadioByName('rokok', 'Tidak');
      var alkohol = getRadioByName('alkohol', 'Tidak');

      // 6. Alergi & Obat
      var alergi = getRadioByName('alergi', 'Tidak tahu');
      var obat = getRadioByName('obat', 'Tidak');
      var kondisiKhususList = getCheckedArrayByName('kondisi_khusus');
      var kondisiKhusus = kondisiKhususList.length ? kondisiKhususList.join(', ') : 'Tidak ada';

      return {
        keluhanUtama: ku,
        keluhanLain: kl,
        lokasi: lokasi,
        sensasi: sensasi,
        keparahan: keparahan,
        durasi: durasi,
        frekuensi: frekuensi,
        durasiSerangan: durasiSerangan,
        faktorPemicu: faktorPemicu,
        riwayatSerupa: riwSerupa,
        cedera: cedera,
        penyakitDahulu: penyakitDahulu,
        kontakTB: kontakTb,
        operasi: operasi,
        keluargaKeluhanSerupa: rpkSerupa,
        keluargaPenyakitKeturunan: teksRPK,
        keluargaMenular: rpkMenular,
        stres: stres,
        tidur: tidur,
        makanTeratur: makan,
        minumAir: air,
        merokok: rokok,
        alkohol: alkohol,
        alergiObat: alergi,
        obatDikonsumsi: obat,
        kondisiKhusus: kondisiKhusus
      };
    }

    function buildReview() {
      var out = document.getElementById('review');
      if (!out) return;
      var d = kumpulkanDataPasien();
      var rows = [
        ['Keluhan Utama', d.keluhanUtama],
        ['Gejala Penyerta', d.keluhanLain.length ? d.keluhanLain.join(', ') : 'Tidak ada'],
        ['Lokasi Nyeri', d.lokasi],
        ['Sensasi Nyeri', d.sensasi],
        ['Skala Nyeri', d.keparahan + '/10'],
        ['Lama Berlangsung', d.durasi],
        ['Durasi Tiap Kambuh', d.durasiSerangan],
        ['Faktor Pemicu', d.faktorPemicu],
        ['Riwayat Cedera Kepala', d.cedera],
        ['Riwayat Penyakit Dahulu', d.penyakitDahulu],
        ['Riwayat Keluarga', d.keluargaPenyakitKeturunan],
        ['Tingkat Stres / Tidur', 'Stres: ' + d.stres + ' · ' + d.tidur],
        ['Alergi Obat', d.alergiObat]
      ];
      out.innerHTML = rows.map(function (r) {
        return '<div class="review-item"><b>' + r[0] + '</b><span>' + r[1].replace(/</g, '&lt;') + '</span></div>';
      }).join('');
    }

    var btnKirim = wiz.querySelector('section[data-step="7"] .btn-primary, section[data-step="6"] .btn-primary, a[href*="pasien-dashboard.html"].btn-primary');
    if (btnKirim) {
      btnKirim.addEventListener('click', function () {
        var dataPasien = kumpulkanDataPasien();
        localStorage.setItem('anamneself_data', JSON.stringify(dataPasien));
      });
    }

    show(0);
  }

  // ---------- 5. SINKRONISASI DASHBOARD DOKTER (dokter-dashboard.html) ----------
  if (window.location.pathname.indexOf('dokter-dashboard.html') !== -1) {
    var rawDash = localStorage.getItem('anamneself_data');
    if (rawDash) {
      var dDash = JSON.parse(rawDash);
      
      // Update Keluhan Pasien A
      var elKeluhan = document.getElementById('dash-keluhan');
      if (elKeluhan) {
        var ringkas = dDash.keluhanUtama || 'Sakit kepala';
        if (dDash.keluhanLain && dDash.keluhanLain.length) {
          ringkas += ', ' + dDash.keluhanLain.slice(0, 2).join(', ').toLowerCase();
        } else if (dDash.sensasi) {
          ringkas += ', ' + dDash.sensasi.toLowerCase();
        }
        elKeluhan.textContent = ringkas;
      }

      // Update Sistem Organ
      var elOrgan = document.getElementById('dash-organ');
      if (elOrgan) {
        elOrgan.textContent = 'Sistem Syaraf';
      }

      // Update Status Red Flag / Prioritas
      var elPrioritas = document.getElementById('dash-prioritas');
      if (elPrioritas && typeof KNOWLEDGE_BASE_SAKIT_KEPALA !== 'undefined') {
        var rfCheck = KNOWLEDGE_BASE_SAKIT_KEPALA.evaluasiRedFlag(dDash);
        elPrioritas.innerHTML = rfCheck.isRedFlag
          ? '<span class="badge badge-danger">Red flag</span>'
          : '<span class="badge badge-neutral">Rutin</span>';
      }
    }
  }

  // ---------- 6. SINKRONISASI RINGKASAN ANAMNESIS (ringkasan.html) ----------
  if (window.location.pathname.indexOf('ringkasan.html') !== -1) {
    var raw = localStorage.getItem('anamneself_data');
    var d = raw ? JSON.parse(raw) : {
      keluhanUtama: "Sakit kepala",
      keluhanLain: ["Sensitif cahaya (silau)", "Leher tegang / kaku"],
      lokasi: "Leher belakang & tengkuk",
      sensasi: "Terasa kencang / berat seperti diikat",
      keparahan: "5",
      durasi: "3 hari",
      frekuensi: "2 kali/hari",
      durasiSerangan: "30 menit - 4 jam",
      faktorPemicu: "Kurang tidur / kelelahan, Stres pikiran / beban kerja",
      riwayatSerupa: "Ya",
      cedera: "Tidak",
      penyakitDahulu: "Tidak ada",
      kontakTB: "Tidak",
      operasi: "Tidak",
      keluargaKeluhanSerupa: "Tidak",
      keluargaPenyakitKeturunan: "Hipertensi/Stroke",
      keluargaMenular: "Tidak",
      stres: "Ya",
      tidur: "Kurang tidur / Insomnia",
      makanTeratur: "Teratur",
      minumAir: "Cukup (≥ 2 liter)",
      merokok: "Tidak",
      alkohol: "Tidak",
      alergiObat: "Tidak tahu",
      obatDikonsumsi: "Tidak",
      kondisiKhusus: "Tidak ada"
    };

    // 1. Render Keluhan Utama & Keluhan Lain
    var ku = document.getElementById('dt-keluhan-utama');
    var kl = document.getElementById('dt-keluhan-lain');
    if (ku) ku.innerHTML = '<span class="badge badge-danger">' + d.keluhanUtama + '</span>';
    if (kl) {
      kl.innerHTML = (d.keluhanLain && d.keluhanLain.length)
        ? d.keluhanLain.map(function (item) { return '<span class="badge badge-neutral">' + item + '</span>'; }).join(' ')
        : '<span class="badge badge-neutral">Tidak ada keluhan lain</span>';
    }

    // 2. Render RPS (Sacred Seven)
    var rps = document.getElementById('dt-rps');
    if (rps) {
      rps.innerHTML = 
        '<dt>Lokasi keluhan</dt><dd>' + d.lokasi + '</dd>' +
        '<dt>Sensasi dirasakan</dt><dd>' + d.sensasi + '</dd>' +
        '<dt>Tingkat keparahan</dt><dd>' + d.keparahan + '/10 (VAS)</dd>' +
        '<dt>Lama keluhan</dt><dd>' + d.durasi + '</dd>' +
        '<dt>Frekuensi</dt><dd>' + d.frekuensi + '</dd>' +
        '<dt>Durasi serangan</dt><dd>' + d.durasiSerangan + '</dd>' +
        '<dt>Faktor pencetus</dt><dd>' + d.faktorPemicu + '</dd>';
    }

    // 3. Render RPD
    var rpd = document.getElementById('dt-rpd');
    if (rpd) {
      rpd.innerHTML = 
        '<dt>Keluhan serupa</dt><dd>' + d.riwayatSerupa + '</dd>' +
        '<dt>Riwayat benturan kepala</dt><dd><span class="' + (d.cedera.indexOf('Ya') !== -1 ? 'badge badge-danger' : '') + '">' + d.cedera + '</span></dd>' +
        '<dt>Riwayat penyakit dahulu</dt><dd>' + d.penyakitDahulu + '</dd>' +
        '<dt>Kontak erat TBC</dt><dd><span class="' + (d.kontakTB.indexOf('Belum') !== -1 || d.kontakTB.indexOf('tahu') !== -1 ? 'unknown' : '') + '">' + d.kontakTB + '</span></dd>' +
        '<dt>Riwayat operasi</dt><dd>' + d.operasi + '</dd>';
    }

    // 4. Render RPK
    var rpk = document.getElementById('dt-rpk');
    if (rpk) {
      rpk.innerHTML = 
        '<dt>Keluhan serupa di keluarga</dt><dd>' + d.keluargaKeluhanSerupa + '</dd>' +
        '<dt>Penyakit keturunan keluarga</dt><dd>' + d.keluargaPenyakitKeturunan + '</dd>' +
        '<dt>Penyakit infeksi menular</dt><dd>' + d.keluargaMenular + '</dd>';
    }

    // 5. Render Sosial & Gaya Hidup
    var sosial = document.getElementById('dt-sosial');
    if (sosial) {
      sosial.innerHTML = 
        '<dt>Stres pikiran / kerja</dt><dd>' + d.stres + '</dd>' +
        '<dt>Kualitas tidur</dt><dd>' + d.tidur + '</dd>' +
        '<dt>Pola makan</dt><dd>' + d.makanTeratur + '</dd>' +
        '<dt>Konsumsi air</dt><dd>' + d.minumAir + '</dd>' +
        '<dt>Kebiasaan merokok</dt><dd>' + d.merokok + '</dd>' +
        '<dt>Konsumsi alkohol</dt><dd>' + d.alkohol + '</dd>';
    }

    // 6. Render Alergi & Obat
    var obat = document.getElementById('dt-obat');
    if (obat) {
      obat.innerHTML = 
        '<dt>Alergi obat</dt><dd><span class="' + (d.alergiObat.indexOf('Belum') !== -1 || d.alergiObat.indexOf('tahu') !== -1 ? 'unknown' : '') + '">' + d.alergiObat + '</span></dd>' +
        '<dt>Obat dikonsumsi</dt><dd>' + d.obatDikonsumsi + '</dd>' +
        '<dt>Kondisi khusus</dt><dd>' + d.kondisiKhusus + '</dd>';
    }

    // 7. Evaluasi CDSS
    if (typeof KNOWLEDGE_BASE_SAKIT_KEPALA !== 'undefined') {
      var rf = KNOWLEDGE_BASE_SAKIT_KEPALA.evaluasiRedFlag(d);
      var cdssAlert = document.getElementById('res-cds-alert');
      if (cdssAlert) {
        cdssAlert.style.borderColor = rf.isRedFlag ? 'var(--danger-line)' : 'var(--teal)';
        cdssAlert.innerHTML = 
          '<div class="sec-title" style="color:' + (rf.isRedFlag ? 'var(--danger)' : 'var(--teal)') + '">' +
          '<svg class="ic ic-sm"><use href="' + (rf.isRedFlag ? '#i-alert' : '#i-shield') + '"/></svg>' + rf.title + '</div>' +
          '<p class="small">' + rf.desc + '</p>';
      }

      var dxContainer = document.getElementById('res-cds-dx-list');
      if (dxContainer) {
        var dxList = KNOWLEDGE_BASE_SAKIT_KEPALA.daftarDiagnosis;
        
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
          return b.percent - a.percent;
        });

        dxContainer.innerHTML = evaluatedDx.map(function (item, idx) {
          var isTop = idx === 0;
          var badgeClass = item.percent >= 65 ? 'badge-info' : 'badge-warn';
          var barClass = item.percent >= 65 ? '' : 'warn';

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

  // ---------- 7. Filter Tab Dashboard Dokter ----------
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

  // ---------- 8. Checkbox Selection Delegasi ----------
  document.addEventListener('change', function (e) {
    if (e.target.matches('.dx input[type=checkbox]')) {
      e.target.closest('.dx').classList.toggle('sel', e.target.checked);
    }
  });
})();