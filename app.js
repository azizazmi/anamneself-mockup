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

  // ---------- 3. Helper Pembaca Input Form & Kode Matriks ----------
  function getRadioData(name, defLabel, defCode) {
    var el = document.querySelector('input[name="' + name + '"]:checked');
    if (!el) return { text: defLabel || '-', code: defCode || '-' };
    var lbl = el.closest('label');
    var txt = lbl ? lbl.textContent.replace('✓', '').trim() : el.value;
    var code = el.getAttribute('data-code') || el.value;
    return { text: txt, code: code };
  }

  function getCheckedDataArray(name) {
    var els = document.querySelectorAll('input[name="' + name + '"]:checked');
    var texts = [];
    var codes = [];
    Array.prototype.forEach.call(els, function (el) {
      var lbl = el.closest('label');
      var txt = lbl ? lbl.textContent.replace('✓', '').trim() : el.value;
      var code = el.getAttribute('data-code') || el.value;
      texts.push(txt);
      if (code && code !== 'NONE') codes.push(code);
    });
    return { texts: texts, codes: codes };
  }

  // ---------- 4. Wizard Self-Anamnesis (anamnesis.html) ----------
  var wiz = document.querySelector('[data-wizard]');
  if (wiz) {
    var steps = Array.prototype.slice.call(wiz.querySelectorAll('.step'));
    var bars = Array.prototype.slice.call(wiz.querySelectorAll('.stepper .s'));
    var meta = document.getElementById('step-meta');
    
    var titles = [
      'Keluhan Utama & Screening Red Flag',
      'Karakteristik Sakit Kepala',
      'Faktor Pemicu & Pemberberat',
      'Keluhan Penyerta Lainnya',
      'Riwayat Medis & Keluarga',
      'Kebiasaan & Gaya Hidup',
      'Tinjau Jawaban Anda'
    ];
    var cur = 0;

    function show(i) {
      cur = Math.max(0, Math.min(steps.length - 1, i));
      steps.forEach(function (el, k) { el.classList.toggle('active', k === cur); });
      bars.forEach(function (b, k) { b.className = 's' + (k < cur ? ' done' : k === cur ? ' cur' : ''); });
      if (meta) {
        meta.innerHTML = '<span>Langkah ' + (cur + 1) + ' dari ' + steps.length + '</span> · <b>' + (titles[cur] || '') + '</b>';
      }
      if (cur === steps.length - 1) buildReview();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    wiz.addEventListener('click', function (e) {
      var n = e.target.closest('[data-next]'), p = e.target.closest('[data-prev]');
      if (n) show(cur + 1);
      if (p) show(cur - 1);
    });

    // Logika Eksklusif (Mutual Exclusive untuk opsi "Tidak ada" / "NONE" / "PRE12")
    wiz.addEventListener('change', function (e) {
      var target = e.target;
      if (target.type !== 'checkbox') return;

      var groupName = target.name;
      var code = target.getAttribute('data-code');

      if (code === 'NONE' || code === 'PRE12') {
        if (target.checked) {
          var others = wiz.querySelectorAll('input[name="' + groupName + '"]');
          others.forEach(function (el) {
            if (el !== target) el.checked = false;
          });
        }
      } else {
        if (target.checked) {
          var noneEl = wiz.querySelector('input[name="' + groupName + '"][data-code="NONE"], input[name="' + groupName + '"][data-code="PRE12"]');
          if (noneEl) noneEl.checked = false;
        }
      }

      if (code === 'KEB03' && target.checked) {
        var keb04 = wiz.querySelector('input[name="kebiasaan"][data-code="KEB04"]');
        if (keb04) keb04.checked = false;
      } else if (code === 'KEB04' && target.checked) {
        var keb03 = wiz.querySelector('input[name="kebiasaan"][data-code="KEB03"]');
        if (keb03) keb03.checked = false;
      }
    });

    function kumpulkanDataPasien() {
      var ku = getRadioData('keluhan_utama', 'Sakit kepala', 'KU01');
      var cedera = getRadioData('cedera_kepala', 'Tidak', 'NONE');
      var redFlag = getCheckedDataArray('red_flag');

      var lokasi = getCheckedDataArray('lokasi');
      var sensasi = getCheckedDataArray('sensasi');
      var intensitas = getRadioData('intensitas', 'Sedang', 'INT02');
      var onset = getRadioData('onset', 'Pelan-pelan bertambah berat', 'ONS02');
      var frekuensi = getRadioData('frekuensi', 'Kadang-kadang, kurang dari 15 hari per bulan', 'FRE02');
      var durasi = getRadioData('durasi', '4 sampai 72 jam', 'DUR03');

      var pemicu = getCheckedDataArray('pemicu');
      var penyerta = getCheckedDataArray('penyerta');
      var rpd = getCheckedDataArray('rpd');
      var rpk = getCheckedDataArray('rpk');
      var kebiasaan = getCheckedDataArray('kebiasaan');

      var allCodes = [].concat(
        cedera.code !== 'NONE' ? [cedera.code] : [],
        redFlag.codes,
        lokasi.codes,
        sensasi.codes,
        intensitas.code !== 'NONE' ? [intensitas.code] : [],
        onset.code !== 'NONE' ? [onset.code] : [],
        frekuensi.code !== 'NONE' ? [frekuensi.code] : [],
        durasi.code !== 'NONE' ? [durasi.code] : [],
        pemicu.codes,
        penyerta.codes,
        rpd.codes,
        rpk.codes,
        kebiasaan.codes
      );

      var isRF03 = penyerta.codes.indexOf('PEN01') !== -1 && penyerta.codes.indexOf('PEN29') !== -1;
      if (isRF03 && allCodes.indexOf('RF03') === -1) {
        allCodes.push('RF03');
      }

      var isTraumaGate = cedera.code === 'ONS06';
      var isRedFlagEmergency = redFlag.codes.length > 0 || intensitas.code === 'INT04' || isRF03;

      return {
        keluhanUtama: ku.text,
        cederaKepala: cedera.text,
        redFlagGejala: redFlag.texts.length ? redFlag.texts.join('; ') : 'Tidak ada',
        lokasi: lokasi.texts.length ? lokasi.texts.join(', ') : 'Belum dipilih',
        sensasi: sensasi.texts.length ? sensasi.texts.join(', ') : 'Belum dipilih',
        intensitas: intensitas.text,
        onset: onset.text,
        frekuensi: frekuensi.text,
        durasi: durasi.text,
        pemicu: pemicu.texts.length ? pemicu.texts.join(', ') : 'Tidak ada pemicu yang jelas',
        keluhanPenyerta: penyerta.texts.length ? penyerta.texts.join(', ') : 'Tidak ada keluhan lain',
        penyakitDahulu: rpd.texts.length ? rpd.texts.join(', ') : 'Tidak ada riwayat',
        riwayatKeluarga: rpk.texts.length ? rpk.texts.join(', ') : 'Tidak ada',
        kebiasaan: kebiasaan.texts.length ? kebiasaan.texts.join(', ') : 'Tidak ada',
        codes: allCodes,
        isTraumaGate: isTraumaGate,
        isRedFlagEmergency: isRedFlagEmergency
      };
    }

    function buildReview() {
      var out = document.getElementById('review');
      if (!out) return;
      var d = kumpulkanDataPasien();
      var rows = [
        ['Keluhan Utama', d.keluhanUtama],
        ['Riwayat Benturan / Trauma', d.cederaKepala],
        ['Tanda Bahaya (Red Flag)', d.redFlagGejala],
        ['Lokasi Sakit Kepala', d.lokasi],
        ['Sensasi Nyeri', d.sensasi],
        ['Tingkat Keparahan', d.intensitas],
        ['Onset Sakit Kepala', d.onset],
        ['Frekuensi Serangan', d.frekuensi],
        ['Durasi Serangan', d.durasi],
        ['Faktor Pemicu', d.pemicu],
        ['Keluhan Penyerta Lainnya', d.keluhanPenyerta],
        ['Riwayat Penyakit Dahulu', d.penyakitDahulu],
        ['Riwayat Keluarga / Sekitar', d.riwayatKeluarga],
        ['Kebiasaan Sehari-hari', d.kebiasaan]
      ];
      out.innerHTML = rows.map(function (r) {
        return '<div class="review-item"><b>' + r[0] + '</b><span>' + (r[1] || '-').replace(/</g, '&lt;') + '</span></div>';
      }).join('');
    }

    var btnKirim = wiz.querySelector('section[data-step="7"] .btn-primary, a[href*="pasien-dashboard.html"].btn-primary');
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
      
      var elKeluhan = document.getElementById('dash-keluhan');
      if (elKeluhan) {
        var ringkas = dDash.keluhanUtama || 'Sakit kepala';
        if (dDash.lokasi && dDash.lokasi !== 'Belum dipilih') {
          ringkas += ' (' + dDash.lokasi.split(',')[0].trim() + ')';
        }
        elKeluhan.textContent = ringkas;
      }

      var elOrgan = document.getElementById('dash-organ');
      if (elOrgan) {
        elOrgan.textContent = 'Sistem Saraf';
      }

      var elPrioritas = document.getElementById('dash-prioritas');
      if (elPrioritas) {
        elPrioritas.innerHTML = (dDash.isRedFlagEmergency || dDash.isTraumaGate)
          ? '<span class="badge badge-danger">Red flag / Gawat</span>'
          : '<span class="badge badge-neutral">Rutin</span>';
      }
    }
  }

  // ---------- 6. SINKRONISASI RINGKASAN ANAMNESIS (ringkasan.html) ----------
  var currentEvaluatedDx = []; // Menyimpan list diagnosis untuk interaktivitas pemilihan

  if (window.location.pathname.indexOf('ringkasan.html') !== -1) {
    var raw = localStorage.getItem('anamneself_data');
    var d = raw ? JSON.parse(raw) : {
      keluhanUtama: "Sakit kepala",
      cederaKepala: "Tidak",
      redFlagGejala: "Tidak ada",
      lokasi: "Belakang kepala sampai tengkuk",
      sensasi: "Nyeri kepala terasa berat, pegal, kencang, atau seperti diikat",
      intensitas: "Sedang",
      onset: "Pelan-pelan bertambah berat",
      frekuensi: "Kadang-kadang, kurang dari 15 hari per bulan",
      durasi: "4 sampai 72 jam",
      pemicu: "Stres, cemas, atau konflik dalam hidup",
      keluhanPenyerta: "Lemas, lesu, atau mudah lelah",
      penyakitDahulu: "Tidak ada riwayat",
      riwayatKeluarga: "Tidak ada",
      kebiasaan: "Makan tidak teratur, sering telat, atau porsi kurang",
      codes: ["LOK05", "KUA01", "INT02", "ONS02", "FRE02", "DUR03", "PRE06", "PEN19", "KEB01"],
      isTraumaGate: false,
      isRedFlagEmergency: false
    };

    var ku = document.getElementById('dt-keluhan-utama');
    var kl = document.getElementById('dt-keluhan-lain');
    if (ku) ku.innerHTML = '<span class="badge badge-danger">' + d.keluhanUtama + '</span>';
    if (kl) {
      kl.innerHTML = '<span class="badge badge-neutral">' + d.keluhanPenyerta + '</span>';
    }

    var rps = document.getElementById('dt-rps');
    if (rps) {
      rps.innerHTML = 
        '<dt>Lokasi keluhan</dt><dd>' + d.lokasi + '</dd>' +
        '<dt>Sensasi dirasakan</dt><dd>' + d.sensasi + '</dd>' +
        '<dt>Tingkat keparahan</dt><dd>' + d.intensitas + '</dd>' +
        '<dt>Cara onset muncul</dt><dd>' + d.onset + '</dd>' +
        '<dt>Frekuensi</dt><dd>' + d.frekuensi + '</dd>' +
        '<dt>Durasi serangan</dt><dd>' + d.durasi + '</dd>' +
        '<dt>Faktor pencetus / pemicu</dt><dd>' + d.pemicu + '</dd>';
    }

    var rpd = document.getElementById('dt-rpd');
    if (rpd) {
      rpd.innerHTML = 
        '<dt>Riwayat benturan kepala</dt><dd><span class="' + (d.cederaKepala.indexOf('Ya') !== -1 ? 'badge badge-danger' : '') + '">' + d.cederaKepala + '</span></dd>' +
        '<dt>Screening Red Flag</dt><dd><span class="' + (d.redFlagGejala.indexOf('Tidak ada') === -1 ? 'badge badge-danger' : '') + '">' + d.redFlagGejala + '</span></dd>' +
        '<dt>Riwayat penyakit dahulu</dt><dd>' + d.penyakitDahulu + '</dd>';
    }

    var rpk = document.getElementById('dt-rpk');
    if (rpk) {
      rpk.innerHTML = '<dt>Riwayat penyakit keluarga/sekitar</dt><dd>' + d.riwayatKeluarga + '</dd>';
    }

    var sosial = document.getElementById('dt-sosial');
    if (sosial) {
      sosial.innerHTML = '<dt>Kebiasaan & gaya hidup</dt><dd>' + d.kebiasaan + '</dd>';
    }

    // Evaluasi CDSS Alert & Rekomendasi Diagnosis Banding
    if (typeof KNOWLEDGE_BASE_SAKIT_KEPALA !== 'undefined') {
      var rf = KNOWLEDGE_BASE_SAKIT_KEPALA.evaluasiRedFlag(d);
      var cdssAlert = document.getElementById('res-cds-alert');
      var headBadge = document.getElementById('head-triase-badge');

      if (headBadge) {
        headBadge.className = 'badge ' + (rf.isRedFlag ? 'badge-danger' : 'badge-neutral');
        headBadge.innerHTML = '<svg class="ic ic-sm"><use href="' + (rf.isRedFlag ? '#i-alert' : '#i-shield') + '"/></svg>' + rf.badge;
      }

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
        var activeCodes = d.codes || [];
        var AMBANG_SKOR_MINIMUM = 5; // Ambang batas skor minimal 5 sesuai ketentuan

        // Hitung skor total dan kriteria cocok untuk setiap diagnosis
        var evaluatedDx = dxList.map(function (item) {
          var totalScore = 0;
          var coreCount = 0;
          var matchedCodes = [];
          var weights = item.weights || {};

          // Iterasi semua gejala yang dimiliki diagnosis ini
          Object.keys(weights).forEach(function (code) {
            if (activeCodes.indexOf(code) !== -1) {
              var bobot = weights[code];
              totalScore += bobot;
              if (bobot === 3) coreCount++;
              matchedCodes.push(code);
            }
          });

          // Cek syarat wajib khusus infeksi (Demam / PEN01)
          var passRequired = true;
          if (item.requiredCode && activeCodes.indexOf(item.requiredCode) === -1) {
            passRequired = false;
          }

          var pct = item.maxScore > 0 ? Math.round((totalScore / item.maxScore) * 100) : 0;
          
          var matchedLabels = matchedCodes.map(function (c) {
            var label = (typeof KAMUS_GEJALA !== 'undefined' && KAMUS_GEJALA[c]) ? KAMUS_GEJALA[c] : c;
            var b = weights[c] ? ' (bobot ' + weights[c] + ')' : '';
            return label + b;
          });

          // Diagnosis memenuhi syarat jika: skor >= 5, syarat wajib terpenuhi, dan bukan eksklusi murni
          var isEligible = totalScore >= AMBANG_SKOR_MINIMUM && passRequired && !item.isExclusion;

          return {
            id: item.id,
            name: item.name,
            icd: item.icd,
            score: totalScore,
            coreCount: coreCount,
            maxScore: item.maxScore,
            percent: pct,
            matchedCodes: matchedCodes,
            matchedLabels: matchedLabels,
            isEligible: isEligible,
            pxFisik: item.pxFisik,
            pxPenunjang: item.pxPenunjang
          };
        }).sort(function (a, b) {
          return b.score !== a.score ? (b.score - a.score) : (b.percent - a.percent);
        });

        // Filter: Hanya tampilkan penyakit dengan skor total >= 5
        var topDxList = evaluatedDx.filter(function (x) { return x.isEligible; });
        currentEvaluatedDx = topDxList;

        if (topDxList.length === 0) {
          dxContainer.innerHTML = 
            '<div style="grid-column: 1 / -1; padding: 1.5rem; background: var(--bg-card, #f8fafc); border: 1px dashed var(--line, #cbd5e1); border-radius: 8px; text-align: center;">' +
              '<p style="color: var(--muted, #64748b); margin: 0; font-size: 0.9rem;">' +
                'Tidak ada diagnosis yang mencapai <b>ambang skor minimum (≥ 5 poin)</b> berdasarkan gejala yang dilaporkan pasien. Lakukan anamnesis langsung dan pemeriksaan fisik komprehensif.' +
              '</p>' +
            '</div>';
          
          // Kosongkan pemeriksaan fisik & penunjang bila tidak ada yang lolos
          var pxF = document.getElementById('res-px-fisik');
          if (pxF) pxF.innerHTML = '<li><svg class="ic ic-sm"><use href="#i-info"/></svg>Belum ada rekomendasi spesifik (skor di bawah ambang).</li>';
          var pxP = document.getElementById('res-px-penunjang');
          if (pxP) pxP.innerHTML = '<li><svg class="ic ic-sm"><use href="#i-info"/></svg>Belum ada rekomendasi penunjang.</li>';
        } else {
          dxContainer.innerHTML = topDxList.map(function (item, idx) {
            var isTop = idx === 0;
            var badgeClass = item.percent >= 40 ? 'badge-info' : 'badge-warn';
            var barClass = item.percent >= 40 ? '' : 'warn';

            var criteriaListHtml = item.matchedLabels.map(function (label) {
              return '<li style="font-size:0.8rem; color:#475569; margin-bottom:3px; line-height:1.35;">✓ ' + label + '</li>';
            }).join('');

            return (
              '<div class="dx ' + (isTop ? 'sel' : '') + '" data-idx="' + idx + '" style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">' +
                '<div>' +
                  '<div class="dx-top">' +
                    '<div><div class="dx-name">' + item.name + '</div><div class="dx-code">' + item.icd + '</div></div>' +
                    '<span class="badge ' + badgeClass + '">Skor: ' + item.score + ' (' + item.percent + '%)</span>' +
                  '</div>' +
                  '<div class="bar ' + barClass + '"><i style="width:' + item.percent + '%"></i></div>' +
                  
                  '<details style="margin-top:0.65rem; cursor:pointer;" ' + (isTop ? 'open' : '') + '>' +
                    '<summary style="font-size:0.8rem; font-weight:600; color:var(--primary, #0284c7); outline:none; user-select:none;">' +
                      'Lihat ' + item.matchedCodes.length + ' gejala pendukung (Skor ' + item.score + ')' +
                    '</summary>' +
                    '<ul style="margin:0.5rem 0 0.5rem 0.25rem; padding-left:0.5rem; list-style:none;">' +
                      criteriaListHtml +
                    '</ul>' +
                  '</details>' +
                '</div>' +

                '<label class="pick mt-2" style="margin-top:auto;"><input type="checkbox" ' + (isTop ? 'checked' : '') + '>Pilih sebagai diagnosis kerja</label>' +
              '</div>'
            );
          }).join('');

          // Update rekomendasi awal untuk diagnosis peringkat 1
          updateRekomendasiPemeriksaan(topDxList[0]);
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

  // ---------- 8. Checkbox Selection Delegasi & Sinkronisasi Rekomendasi ----------
  document.addEventListener('change', function (e) {
    if (e.target.matches('.dx input[type=checkbox]')) {
      var card = e.target.closest('.dx');
      card.classList.toggle('sel', e.target.checked);

      // Jika dicentang, update rekomendasi pemeriksaan sesuai kartu ini
      if (e.target.checked && typeof currentEvaluatedDx !== 'undefined') {
        var idx = parseInt(card.getAttribute('data-idx'), 10);
        if (!isNaN(idx) && currentEvaluatedDx[idx]) {
          var selectedDx = currentEvaluatedDx[idx];
          var pxFisikUl = document.getElementById('res-px-fisik');
          if (pxFisikUl && selectedDx.pxFisik) {
            pxFisikUl.innerHTML = selectedDx.pxFisik.map(function (pf) {
              return '<li><svg class="ic ic-sm"><use href="#i-check"/></svg>' + pf + '</li>';
            }).join('');
          }
          var pxPenunjangUl = document.getElementById('res-px-penunjang');
          if (pxPenunjangUl && selectedDx.pxPenunjang) {
            pxPenunjangUl.innerHTML = selectedDx.pxPenunjang.map(function (pp) {
              return '<li><svg class="ic ic-sm"><use href="#i-check"/></svg>' + pp + '</li>';
            }).join('');
          }
        }
      }
    }
  });
})();