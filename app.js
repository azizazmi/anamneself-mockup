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

  // ---------- 3. Helper Pengambilan Data Form Akurat ----------
  function getRadioText(containerOrName) {
    var el = null;
    if (containerOrName.indexOf('input') !== -1 || containerOrName.indexOf('.') !== -1 || containerOrName.indexOf('#') !== -1) {
      el = document.querySelector(containerOrName + ' input:checked');
    } else {
      el = document.querySelector('input[name="' + containerOrName + '"]:checked');
    }
    if (!el) return 'Tidak';
    var lbl = el.closest('label');
    return lbl ? lbl.textContent.replace('✓', '').trim() : el.value;
  }

  function getSelectedChips(containerSelector) {
    var c = document.querySelector(containerSelector);
    if (!c) return [];
    var checked = c.querySelectorAll('input:checked');
    return Array.prototype.map.call(checked, function (el) {
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

    function kumpulkanDataPasien() {
      // 1. Keluhan Utama & Keluhan Lain (Poin 1 Fix)
      var kuChecked = document.querySelectorAll('.step[data-step="1"] .q:first-of-type input:checked');
      var ku = kuChecked.length ? kuChecked[0].closest('label').textContent.replace('✓', '').trim() : 'Sakit kepala';

      // Ambil keluhan lain HANYA dari container keluhan lain
      var klChecked = document.querySelectorAll('.step[data-step="1"] .q:nth-of-type(2) input:checked');
      var kl = Array.prototype.map.call(klChecked, function(el) {
        return el.closest('label').textContent.replace('✓', '').trim();
      }).filter(function(item) {
        return item.toLowerCase() !== ku.toLowerCase(); // Hindari duplikasi jika sama dengan keluhan utama
      });

      // 2. RPS (Sacred Seven) (Poin 2 & 3 Fix)
      var txtsStep2 = document.querySelectorAll('.step[data-step="2"] textarea');
      var numInputsStep2 = document.querySelectorAll('.step[data-step="2"] input[type="number"]');
      var selectsStep2 = document.querySelectorAll('.step[data-step="2"] select');

      var lokasi = (txtsStep2[0] && txtsStep2[0].value.trim()) ? txtsStep2[0].value.trim() : 'Leher bagian belakang';
      var sensasi = (txtsStep2[1] && txtsStep2[1].value.trim()) ? txtsStep2[1].value.trim() : 'Kepala terasa kencang dan berat';
      var keparahan = pain ? pain.value : '5';
      
      var durasiVal = (numInputsStep2[0] && numInputsStep2[0].value) ? numInputsStep2[0].value : '4';
      var durasiSat = (selectsStep2[0] && selectsStep2[0].value) ? selectsStep2[0].value : 'hari';
      var durasi = durasiVal + ' ' + durasiSat;

      var frekVal = (numInputsStep2[1] && numInputsStep2[1].value) ? numInputsStep2[1].value : '3';
      var frekuensi = frekVal + ' kali/hari';

      // Durasi serangan dengan satuan dinamis
      var durSerangVal = (numInputsStep2[2] && numInputsStep2[2].value) ? numInputsStep2[2].value : '45';
      var durSerangSat = (selectsStep2[1] && selectsStep2[1].value) ? selectsStep2[1].value : 'menit';
      var durasiSerangan = durSerangVal + ' ' + durSerangSat;

      // Evaluasi Faktor Pencetus (Poin 2)
      var radioPemicu = document.querySelector('.step[data-step="2"] .q:last-of-type input:checked');
      var teksRadioPemicu = radioPemicu ? radioPemicu.closest('label').textContent.replace('✓', '').trim() : 'Tidak';
      var inputTeksPemicu = (txtsStep2[2] && txtsStep2[2].value.trim()) ? txtsStep2[2].value.trim() : '';
      var faktorPemicu = 'Tidak';
      if (teksRadioPemicu.toLowerCase().indexOf('ya') !== -1) {
        faktorPemicu = inputTeksPemicu ? ('Ya · ' + inputTeksPemicu) : 'Ya';
      }

      // 3. RPD
      var riwSerupa = getRadioText('.step[data-step="3"] .q:nth-of-type(1)');
      var kontakTb = getRadioText('.step[data-step="3"] .q:nth-of-type(2)');
      var keturunanDiri = getSelectedChips('.step[data-step="3"] .q:nth-of-type(3)').join(', ') || 'Tidak ada';
      var operasi = getRadioText('.step[data-step="3"] .q:nth-of-type(4)');
      var cedera = getRadioText('.step[data-step="3"] .q:nth-of-type(5)');

      // 4. RPK
      var rpkSerupa = getRadioText('.step[data-step="4"] .q:nth-of-type(1)');
      var rpkKeturunan = getRadioText('.step[data-step="4"] .q:nth-of-type(2)');
      var rpkMenular = getRadioText('.step[data-step="4"] .q:nth-of-type(3)');

      // 5. Sosial & Kebiasaan
      var txtsStep5 = document.querySelectorAll('.step[data-step="5"] textarea');
      var makanan = (txtsStep5[0] && txtsStep5[0].value.trim()) ? txtsStep5[0].value.trim() : 'Nasi goreng';
      var makanTeratur = getRadioText('.step[data-step="5"] .q:nth-of-type(4)');
      var minumAir = getRadioText('.step[data-step="5"] .q:nth-of-type(5)');
      var rokokStatus = getRadioText('.step[data-step="5"] .q:nth-of-type(7)');
      var batangInput = document.querySelector('.step[data-step="5"] input[type="number"]');
      var rokokFinal = rokokStatus.indexOf('Ya') !== -1 ? ('Ya · ± ' + (batangInput ? batangInput.value : '0') + ' batang/hari') : 'Tidak';
      var alkohol = getRadioText('.step[data-step="5"] .q:nth-of-type(9)');
      var narkoba = getRadioText('.step[data-step="5"] .q:nth-of-type(10)');
      var bersih = getRadioText('.step[data-step="5"] .q:nth-of-type(11)');

      // 6. Alergi & Obat (Poin 4 Fix: Ambil spesifik per pertanyaan)
      var alergi = getRadioText('.step[data-step="6"] .q:nth-of-type(1)');
      var obat = getRadioText('.step[data-step="6"] .q:nth-of-type(2)');
      
      // Khusus kondisi khusus: hanya ambil dari q ketiga
      var kondisiKhususChips = getSelectedChips('.step[data-step="6"] .q:nth-of-type(3)');
      var kondisiKhusus = kondisiKhususChips.length ? kondisiKhususChips.join(', ') : 'Tidak ada';

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
        kontakTB: kontakTb,
        penyakitKeturunan: keturunanDiri,
        operasi: operasi,
        cedera: cedera,
        keluargaKeluhanSerupa: rpkSerupa,
        keluargaPenyakitKeturunan: rpkKeturunan,
        keluargaMenular: rpkMenular,
        makananTerakhir: makanan,
        makanTeratur: makanTeratur,
        minumAir: minumAir,
        merokok: rokokFinal,
        alkohol: alkohol,
        obatTerlarang: narkoba,
        kebersihan: bersih,
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
        ['Keluhan Lain', d.keluhanLain.length ? d.keluhanLain.join(', ') : 'Tidak ada'],
        ['Lokasi', d.lokasi],
        ['Tingkat Keparahan', d.keparahan + '/10'],
        ['Durasi Serangan', d.durasiSerangan],
        ['Faktor Pencetus', d.faktorPemicu],
        ['Riwayat Cedera', d.cedera],
        ['Kondisi Khusus', d.kondisiKhusus]
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

  // ---------- 5. SINKRONISASI DASHBOARD DOKTER (Poin 6 Fix) ----------
  if (window.location.pathname.indexOf('dokter-dashboard.html') !== -1) {
    var rawDash = localStorage.getItem('anamneself_data');
    if (rawDash) {
      var dDash = JSON.parse(rawDash);
      
      // Update Keluhan Utama Pasien A tanpa duplikasi
      var elKeluhan = document.getElementById('dash-keluhan');
      if (elKeluhan) {
        var teks = dDash.keluhanUtama || 'Sakit kepala';
        if (dDash.keluhanLain && dDash.keluhanLain.length) {
          teks += ', ' + dDash.keluhanLain.slice(0, 2).join(', ').toLowerCase();
        } else if (dDash.sensasi) {
          teks += ', ' + dDash.sensasi.toLowerCase();
        }
        elKeluhan.textContent = teks;
      }

      // Update Sistem Organ
      var elOrgan = document.getElementById('dash-organ');
      if (elOrgan) {
        elOrgan.textContent = 'Sistem Syaraf';
      }

      // Update Badge Prioritas
      var elPrioritas = document.getElementById('dash-prioritas');
      if (elPrioritas) {
        var isRf = (dDash.cedera && dDash.cedera.toLowerCase().indexOf('ya') !== -1) || (parseInt(dDash.keparahan) >= 8);
        elPrioritas.innerHTML = isRf
          ? '<span class="badge badge-danger">Red flag</span>'
          : '<span class="badge badge-neutral">Rutin</span>';
      }
    }
  }

  // ---------- 6. SINKRONISASI RINGKASAN ANAMNESIS (Poin 5 Fix) ----------
  if (window.location.pathname.indexOf('ringkasan.html') !== -1) {
    var raw = localStorage.getItem('anamneself_data');
    var d = raw ? JSON.parse(raw) : {
      keluhanUtama: "Sakit kepala",
      keluhanLain: [],
      lokasi: "Leher belakang",
      sensasi: "Kepala terasa kencang",
      keparahan: "7",
      durasi: "5 hari",
      frekuensi: "3 kali/hari",
      durasiSerangan: "1 menit",
      faktorPemicu: "Tidak",
      riwayatSerupa: "Ya",
      kontakTB: "Tidak",
      penyakitKeturunan: "Ya",
      operasi: "Tidak",
      cedera: "Tidak",
      keluargaKeluhanSerupa: "Tidak",
      keluargaPenyakitKeturunan: "Ya",
      keluargaMenular: "Tidak",
      makananTerakhir: "Nasi goreng",
      makanTeratur: "Ya",
      minumAir: "Cukup",
      merokok: "Tidak",
      alkohol: "Tidak",
      obatTerlarang: "Tidak",
      kebersihan: "Bersih",
      alergiObat: "Tidak tahu",
      obatDikonsumsi: "Tidak",
      kondisiKhusus: "Tidak ada"
    };

    // 1. Render Keluhan Utama & Lain
    var ku = document.getElementById('dt-keluhan-utama');
    var kl = document.getElementById('dt-keluhan-lain');
    if (ku) ku.innerHTML = '<span class="badge badge-danger">' + d.keluhanUtama + '</span>';
    if (kl) {
      kl.innerHTML = (d.keluhanLain && d.keluhanLain.length)
        ? d.keluhanLain.map(function (item) { return '<span class="badge badge-neutral">' + item + '</span>'; }).join(' ')
        : '<span class="badge badge-neutral">Tidak ada</span>';
    }

    // 2. Render RPS (Sacred Seven)
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

    // 3. Render RPD
    var rpd = document.getElementById('dt-rpd');
    if (rpd) {
      rpd.innerHTML = 
        '<dt>Keluhan serupa</dt><dd>' + d.riwayatSerupa + '</dd>' +
        '<dt>Kontak erat TBC</dt><dd><span class="' + (d.kontakTB.indexOf('Belum') !== -1 || d.kontakTB.indexOf('tahu') !== -1 ? 'unknown' : '') + '">' + d.kontakTB + '</span></dd>' +
        '<dt>Penyakit keturunan</dt><dd>' + d.penyakitKeturunan + '</dd>' +
        '<dt>Riwayat operasi</dt><dd>' + d.operasi + '</dd>' +
        '<dt>Cedera serius</dt><dd>' + d.cedera + '</dd>';
    }

    // 4. Render RPK
    var rpk = document.getElementById('dt-rpk');
    if (rpk) {
      rpk.innerHTML = 
        '<dt>Keluhan serupa</dt><dd>' + d.keluargaKeluhanSerupa + '</dd>' +
        '<dt>Penyakit keturunan</dt><dd>' + d.keluargaPenyakitKeturunan + '</dd>' +
        '<dt>Penyakit menular</dt><dd>' + d.keluargaMenular + '</dd>';
    }

    // 5. Render Riwayat Sosial & Kebiasaan
    var sosial = document.getElementById('dt-sosial');
    if (sosial) {
      sosial.innerHTML = 
        '<dt>Makanan terakhir</dt><dd>' + d.makananTerakhir + '</dd>' +
        '<dt>Keteraturan makan</dt><dd>' + d.makanTeratur + '</dd>' +
        '<dt>Konsumsi air</dt><dd>' + d.minumAir + '</dd>' +
        '<dt>Kebiasaan merokok</dt><dd>' + d.merokok + '</dd>' +
        '<dt>Konsumsi alkohol</dt><dd>' + d.alkohol + '</dd>' +
        '<dt>Obat terlarang</dt><dd>' + d.obatTerlarang + '</dd>' +
        '<dt>Kebersihan lingkungan</dt><dd>' + d.kebersihan + '</dd>';
    }

    // 6. Render Alergi & Obat
    var obat = document.getElementById('dt-obat');
    if (obat) {
      obat.innerHTML = 
        '<dt>Alergi obat</dt><dd><span class="' + (d.alergiObat.indexOf('Belum') !== -1 || d.alergiObat.indexOf('tahu') !== -1 ? 'unknown' : '') + '">' + d.alergiObat + '</span></dd>' +
        '<dt>Obat dikonsumsi</dt><dd>' + d.obatDikonsumsi + '</dd>' +
        '<dt>Kondisi khusus</dt><dd>' + d.kondisiKhusus + '</dd>';
    }

    // 7. Evaluasi CDSS Lengkap (Fallback Aman Jika clinical-data.js tertunda)
    var kb = (typeof KNOWLEDGE_BASE_SAKIT_KEPALA !== 'undefined') ? KNOWLEDGE_BASE_SAKIT_KEPALA : {
      evaluasiRedFlag: function(data) {
        var isRf = (data.cedera && data.cedera.toLowerCase().indexOf('ya') !== -1) || (parseInt(data.keparahan) >= 8);
        return {
          isRedFlag: isRf,
          title: isRf ? "Tanda Bahaya Terdeteksi" : "Triase Terkendali",
          desc: isRf ? "Waspada tanda kedaruratan atau peningkatan TIK." : "Tidak terdeteksi tanda kegawatdaruratan akut."
        };
      },
      daftarDiagnosis: [
        {
          name: "Tension headache",
          icd: "ICD-10 · G44.2 Tension–type headache",
          totalKriteria: 6,
          cekKesesuaian: function(data) { return 5; },
          pxFisik: [
            "Tanda vital: Tekanan darah, frekuensi nadi, suhu, RR (dalam batas normal)",
            "Pemeriksaan kepala dan leher: Palpasi ketegangan otot perikranial dan leher belakang",
            "Pemeriksaan neurologis dasar: Motorik, sensorik, dan refleks fisiologis",
            "Pemeriksaan bola mata: Menyingkirkan kelainan refraksi atau peningkatan tekanan intraokular",
            "Evaluasi fungsi mental dan daya ingat singkat"
          ],
          pxPenunjang: [
            "Tidak memerlukan pemeriksaan laboratorium khusus pada faskes tingkat pertama"
          ]
        },
        {
          name: "Migren",
          icd: "ICD-10 · G43.9 Migraine, unspecified",
          totalKriteria: 6,
          cekKesesuaian: function(data) { return 3; },
          pxFisik: [
            "Tanda vital: Evaluasi stabilitas hemodinamik",
            "Pemeriksaan nervus kranialis dan tanda defisit neurologis fokal"
          ],
          pxPenunjang: [
            "Tidak diperlukan pemeriksaan penunjang lanjutan tanpa indikasi defisit neurologis"
          ]
        },
        {
          name: "Hipertensi esensial (nyeri kepala tengkuk)",
          icd: "ICD-10 · I10 Essential (primary) hypertension",
          totalKriteria: 5,
          cekKesesuaian: function(data) { return 2; },
          pxFisik: [
            "Pengukuran tekanan darah berkala posisi duduk",
            "Auskultasi jantung dan pembuluh darah perifer"
          ],
          pxPenunjang: [
            "Urinalisis lengkap (evaluasi proteinuria)",
            "Profil lipid dan gula darah sewaktu"
          ]
        }
      ]
    };

    // Render Red Flag
    var rf = kb.evaluasiRedFlag(d);
    var cdssAlert = document.getElementById('res-cds-alert');
    if (cdssAlert) {
      cdssAlert.style.borderColor = rf.isRedFlag ? 'var(--danger-line)' : 'var(--teal)';
      cdssAlert.innerHTML = 
        '<div class="sec-title" style="color:' + (rf.isRedFlag ? 'var(--danger)' : 'var(--teal)') + '">' +
        '<svg class="ic ic-sm"><use href="' + (rf.isRedFlag ? '#i-alert' : '#i-shield') + '"/></svg>' + rf.title + '</div>' +
        '<p class="small">' + rf.desc + '</p>';
    }

    // Render Daftar Kemungkinan Diagnosis (3 Penyakit Sekaligus)
    var dxContainer = document.getElementById('res-cds-dx-list');
    if (dxContainer) {
      var evaluatedDx = kb.daftarDiagnosis.map(function (item) {
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

      // Render Rekomendasi Pemeriksaan Diagnosis Teratas
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