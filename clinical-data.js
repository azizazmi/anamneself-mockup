/* clinical-data.js — Matriks Basis Pengetahuan Sakit Kepala (PPK 144 FKTP) */
const KNOWLEDGE_BASE_SAKIT_KEPALA = {
  // 1. Evaluasi Tanda Bahaya (Red Flags) & Triase
  evaluasiRedFlag: function (d) {
    var adaCedera = d.cedera && d.cedera.toLowerCase().indexOf('ya') !== -1;
    var nyeriHebat = parseInt(d.keparahan) >= 8;
    var adaDemam = d.keluhanLain && d.keluhanLain.indexOf('Demam') !== -1;

    if (adaCedera) {
      return {
        isRedFlag: true,
        title: "Tanda Bahaya: Riwayat Trauma / Benturan Kepala",
        desc: "Pasien memiliki riwayat benturan kepala. Waspadai risiko peningkatan TIK, perdarahan intrakranial, atau cedera kepala sekunder. Prioritaskan evaluasi neurologis darurat."
      };
    }
    if (nyeriHebat && adaDemam) {
      return {
        isRedFlag: true,
        title: "Tanda Bahaya: Nyeri Kepala Akut Berat + Demam",
        desc: "Kombinasi sakit kepala intensitas tinggi (skala ≥ 8) dan demam memenuhi kriteria evaluasi infeksi susunan saraf pusat (rangsang meningeal)."
      };
    }
    return {
      isRedFlag: false,
      title: "Status Triase Terkendali",
      desc: "Tidak terdeteksi tanda bahaya trauma akut atau tanda bahaya sekunder darurat. Pemeriksaan klinis dapat berjalan sesuai urutan antrean."
    };
  },

  // 2. Daftar Diagnosis Banding Berdasarkan Spektrum Sakit Kepala PPK 144
  daftarDiagnosis: [
    {
      id: "tth",
      name: "Tension headache",
      icd: "ICD-10 · G44.2 Tension–type headache",
      totalKriteria: 6,
      cekKesesuaian: function (d) {
        var cocok = 0;
        var sensasi = (d.sensasi || '').toLowerCase();
        var lokasi = (d.lokasi || '').toLowerCase();
        var pemicu = (d.faktorPemicu || '').toLowerCase();

        // 1. Sensasi kencang / diikat / berat
        if (sensasi.indexOf('kencang') !== -1 || sensasi.indexOf('ikat') !== -1 || sensasi.indexOf('berat') !== -1) cocok++;
        // 2. Lokasi bitemporal atau leher belakang/tengkuk
        if (lokasi.indexOf('pelipis') !== -1 || lokasi.indexOf('leher') !== -1 || lokasi.indexOf('menyeluruh') !== -1) cocok++;
        // 3. Intensitas ringan - sedang (skala <= 7)
        if (parseInt(d.keparahan) <= 7) cocok++;
        // 4. Tidak ada mual/muntah hebat
        if (!d.keluhanLain || (d.keluhanLain.indexOf('Mual') === -1 && d.keluhanLain.indexOf('Muntah') === -1)) cocok++;
        // 5. Durasi serangan 30 menit hingga hari
        if ((d.durasiSerangan || '').indexOf('30 menit') !== -1 || (d.durasiSerangan || '').indexOf('Lebih dari 3 hari') !== -1) cocok++;
        // 6. Pemicu stres pikiran, kelelahan, atau kurang tidur
        if (pemicu.indexOf('stres') !== -1 || pemicu.indexOf('tidur') !== -1 || (d.stres || '').toLowerCase() === 'ya') cocok++;

        return Math.max(cocok, 2);
      },
      pxFisik: [
        "Tanda vital: Tekanan darah, nadi, suhu, RR (umumnya dalam batas normal)",
        "Pemeriksaan kepala dan leher: Palpasi ketegangan otot perikranial, tengkuk, dan bahu",
        "Pemeriksaan neurologis dasar: Refleks fisiologis, motorik, sensorik (dalam batas normal)",
        "Pemeriksaan mata: Menyingkirkan peningkatan tekanan bola mata",
        "Eksplorasi latar belakang psikososial, tingkat stres, dan insomnia"
      ],
      pxPenunjang: [
        "Tidak diperlukan pemeriksaan penunjang khusus pada fasilitas kesehatan tingkat pertama (FKTP)"
      ]
    },
    {
      id: "migren",
      name: "Migren",
      icd: "ICD-10 · G43.9 Migraine, unspecified",
      totalKriteria: 6,
      cekKesesuaian: function (d) {
        var cocok = 0;
        var sensasi = (d.sensasi || '').toLowerCase();
        var lokasi = (d.lokasi || '').toLowerCase();
        var pemicu = (d.faktorPemicu || '').toLowerCase();

        // 1. Sensasi berdenyut / menusuk
        if (sensasi.indexOf('denyut') !== -1 || sensasi.indexOf('tusuk') !== -1) cocok++;
        // 2. Lokasi satu sisi (unilateral)
        if (lokasi.indexOf('satu sisi') !== -1 || lokasi.indexOf('separuh') !== -1) cocok++;
        // 3. Gejala penyerta: mual, fotofobia, fonofobia
        if (d.keluhanLain && (d.keluhanLain.indexOf('Mual') !== -1 || d.keluhanLain.indexOf('Sensitif cahaya (silau)') !== -1 || d.keluhanLain.indexOf('Sensitif suara (bising)') !== -1)) cocok++;
        // 4. Intensitas sedang hingga berat (skala >= 5)
        if (parseInt(d.keparahan) >= 5) cocok++;
        // 5. Durasi serangan tipikal 4-72 jam
        if ((d.durasiSerangan || '').indexOf('4-72 jam') !== -1 || (d.durasiSerangan || '').indexOf('4 jam') !== -1) cocok++;
        // 6. Faktor pemicu: telat makan, menstruasi, atau riwayat keluarga migren
        if (pemicu.indexOf('lapar') !== -1 || (d.keluargaPenyakitKeturunan || '').indexOf('serupa') !== -1 || (d.kondisiKhusus || '').indexOf('haid') !== -1) cocok++;

        return Math.max(cocok, 1);
      },
      pxFisik: [
        "Tanda vital: Evaluasi stabilitas hemodinamik",
        "Pemeriksaan nervus kranialis dan tanda defisit neurologis fokal (menyingkirkan penyebab sekunder)"
      ],
      pxPenunjang: [
        "Tidak diperlukan pemeriksaan penunjang lanjutan untuk kasus tipikal tanpa defisit fokal"
      ]
    },
    {
      id: "hipertensi",
      name: "Hipertensi esensial (nyeri kepala tengkuk)",
      icd: "ICD-10 · I10 Essential (primary) hypertension",
      totalKriteria: 5,
      cekKesesuaian: function (d) {
        var cocok = 0;
        var lokasi = (d.lokasi || '').toLowerCase();

        // 1. Lokasi nyeri tengkuk / leher belakang
        if (lokasi.indexOf('leher') !== -1 || lokasi.indexOf('tengkuk') !== -1) cocok++;
        // 2. Keluhan penyerta: leher tegang, berdebar, pusing
        if (d.keluhanLain && (d.keluhanLain.indexOf('Leher tegang / kaku') !== -1 || d.keluhanLain.indexOf('Jantung berdebar') !== -1)) cocok++;
        // 3. Riwayat penyakit keluarga hipertensi
        if ((d.keluargaPenyakitKeturunan || '').toLowerCase().indexOf('hipertensi') !== -1 || (d.penyakitDahulu || '').indexOf('Hipertensi') !== -1) cocok++;
        // 4. Faktor gaya hidup: merokok atau konsumsi kopi/garam berlebih
        if ((d.merokok || '').toLowerCase().indexOf('ya') !== -1 || (d.faktorPemicu || '').toLowerCase().indexOf('kopi') !== -1) cocok++;
        // 5. Intensitas nyeri sedang
        if (parseInt(d.keparahan) >= 4) cocok++;

        return Math.max(cocok, 1);
      },
      pxFisik: [
        "Pengukuran tekanan darah berkala (duduk tenang, minimal 2 kali pengukuran)",
        "Auskultasi jantung dan evaluasi nadi perifer",
        "Funduskopi mata bila fasilitas FKTP memadai (menilai retinopati hipertensi)"
      ],
      pxPenunjang: [
        "Urinalisis rutin (evaluasi proteinuria)",
        "Gula darah sewaktu / puasa",
        "Profil lipid darah (kolesterol total, LDL, HDL, trigliserida)",
        "Ureum dan kreatinin serum"
      ]
    },
    {
      id: "astenopia",
      name: "Sakit kepala astenopia (kelainan refraksi)",
      icd: "ICD-10 · H52.0 / H52.1 Kelainan Refraksi",
      totalKriteria: 5,
      cekKesesuaian: function (d) {
        var cocok = 0;
        var lokasi = (d.lokasi || '').toLowerCase();
        var pemicu = (d.faktorPemicu || '').toLowerCase();

        // 1. Lokasi di area dahi / sekitar mata
        if (lokasi.indexOf('dahi') !== -1 || lokasi.indexOf('depan mata') !== -1) cocok++;
        // 2. Keluhan penyerta: mata lelah atau pandangan kabur
        if (d.keluhanLain && d.keluhanLain.indexOf('Mata lelah / kabur') !== -1) cocok++;
        // 3. Pemicu: melihat layar / membaca lama
        if (pemicu.indexOf('layar') !== -1 || pemicu.indexOf('membaca') !== -1) cocok++;
        // 4. Riwayat memakai kacamata / kelainan refraksi
        if ((d.penyakitDahulu || '').indexOf('kacamata') !== -1 || (d.penyakitDahulu || '').indexOf('mata') !== -1) cocok++;
        // 5. Nyeri memberat di sore/malam hari setelah aktivitas visual
        if (parseInt(d.keparahan) <= 6) cocok++;

        return Math.max(cocok, 1);
      },
      pxFisik: [
        "Pemeriksaan visus / tajam penglihatan (kartu Snellen)",
        "Pemeriksaan segmen anterior bola mata",
        "Pemeriksaan pergerakan bola mata"
      ],
      pxPenunjang: [
        "Uji koreksi refraksi / *pinhole test*"
      ]
    }
  ]
};