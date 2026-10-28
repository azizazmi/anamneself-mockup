/* clinical-data.js — Basis Aturan Sakit Kepala (PPK FKTP) */
const KNOWLEDGE_BASE_SAKIT_KEPALA = {
  // Evaluasi Red Flags Triase
  evaluasiRedFlag: function (d) {
    var adaCedera = d.cedera && d.cedera.toLowerCase().indexOf('ya') !== -1;
    var nyeriHebat = parseInt(d.keparahan) >= 8;
    var adaDemam = d.keluhanLain && d.keluhanLain.indexOf('Demam') !== -1;

    if (adaCedera) {
      return {
        isRedFlag: true,
        title: "Tanda Bahaya: Riwayat Trauma Kepala",
        desc: "Pasien melaporkan adanya riwayat cedera/benturan kepala. Perlu evaluasi tanda peningkatan TIK dan defisit neurologis segera."
      };
    }
    if (nyeriHebat && adaDemam) {
      return {
        isRedFlag: true,
        title: "Tanda Bahaya: Nyeri Kepala Akut Berat + Demam",
        desc: "Kombinasi nyeri kepala hebat dan demam memenuhi kriteria evaluasi infeksi SSP / tanda rangsang meningeal."
      };
    }
    return {
      isRedFlag: false,
      title: "Triase Terkendali",
      desc: "Tidak terdeteksi tanda bahaya trauma atau kedaruratan neurologis akut. Konsultasi berjalan sesuai antrean."
    };
  },

  // Daftar Diagnosis Banding
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
        if (sensasi.indexOf('ikat') !== -1 || sensasi.indexOf('kencang') !== -1 || sensasi.indexOf('berat') !== -1 || sensasi.indexOf('pegal') !== -1) cocok++;
        if (lokasi.indexOf('leher') !== -1 || lokasi.indexOf('belakang') !== -1 || lokasi.indexOf('pelipis') !== -1) cocok++;
        if (parseInt(d.keparahan) <= 7) cocok++;
        if (!d.keluhanLain || d.keluhanLain.indexOf('Muntah') === -1) cocok++;
        if ((d.durasi || '').indexOf('hari') !== -1 || (d.durasi || '').indexOf('minggu') !== -1) cocok++;
        if ((d.faktorPemicu || '').toLowerCase().indexOf('tidur') !== -1 || (d.faktorPemicu || '').toLowerCase().indexOf('kerja') !== -1) cocok++;
        return Math.max(cocok, 4); // Nilai dasar untuk kasus klinis aktif
      },
      pxFisik: [
        "Tanda vital: Tekanan darah, nadi, suhu, RR (umumnya dalam batas normal)",
        "Pemeriksaan kepala dan leher: Palpasi ketegangan otot perikranial, tengkuk, dan bahu",
        "Pemeriksaan neurologis: Refleks fisiologis, fungsi sensorik dan motorik normal",
        "Pemeriksaan mata: Menyingkirkan peningkatan tekanan bola mata",
        "Fungsi mental dan memori: Eksplorasi pemicu stres, kecemasan, atau insomnia"
      ],
      pxPenunjang: [
        "Tidak diperlukan pemeriksaan penunjang khusus pada fasilitas kesehatan tingkat pertama"
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
        if (sensasi.indexOf('denyut') !== -1 || sensasi.indexOf('tusuk') !== -1) cocok++;
        if (lokasi.indexOf('sebelah') !== -1 || lokasi.indexOf('satu sisi') !== -1) cocok++;
        if (d.keluhanLain && (d.keluhanLain.indexOf('Mual') !== -1 || d.keluhanLain.indexOf('Muntah') !== -1)) cocok++;
        if (parseInt(d.keparahan) >= 5) cocok++;
        if ((d.riwayatSerupa || '').toLowerCase().indexOf('ya') !== -1) cocok++;
        if ((d.keluargaPenyakitKeturunan || '').toLowerCase().indexOf('ya') !== -1) cocok++;
        return Math.max(cocok, 2); // Tetap muncul sebagai diagnosis banding alternatif (2/6)
      },
      pxFisik: [
        "Tanda vital: Tekanan darah dan frekuensi nadi",
        "Pemeriksaan neurologis fokal: Menyingkirkan defisit neurologis sekunder"
      ],
      pxPenunjang: [
        "Tidak diperlukan untuk kasus tanpa komplikasi neurologis"
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
        if (lokasi.indexOf('tengkuk') !== -1 || lokasi.indexOf('belakang') !== -1) cocok++;
        if (d.keluhanLain && (d.keluhanLain.indexOf('Pusing') !== -1 || d.keluhanLain.indexOf('Berdebar') !== -1)) cocok++;
        if ((d.keluargaPenyakitKeturunan || '').toLowerCase().indexOf('hipertensi') !== -1) cocok++;
        if (parseInt(d.keparahan) >= 5) cocok++;
        if ((d.merokok || '').toLowerCase().indexOf('ya') !== -1) cocok++;
        return Math.max(cocok, 2); // Tetap muncul sebagai diagnosis banding (2/5)
      },
      pxFisik: [
        "Pengukuran tekanan darah berulang (posisi duduk dan istirahat 5 menit)",
        "Pemeriksaan auskultasi jantung dan funduskopi mata"
      ],
      pxPenunjang: [
        "Urinalisis rutin (proteinuria)",
        "Gula darah sewaktu / puasa",
        "Profil lipid darah (kolesterol total, HDL, LDL, trigliserida)",
        "Ureum dan kreatinin serum"
      ]
    }
  ]
};