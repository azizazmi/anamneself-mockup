/* clinical-data.js — Basis Aturan Klinis Sakit Kepala (PPK FKTP) */
const KNOWLEDGE_BASE_SAKIT_KEPALA = {
  // Aturan Red Flags
  evaluasiRedFlag: function (d) {
    if (d.cedera && d.cedera.toLowerCase().indexOf('ya') !== -1) {
      return {
        isRedFlag: true,
        title: "Tanda Bahaya: Riwayat Trauma Kepala",
        desc: "Pasien melaporkan adanya riwayat cedera/benturan kepala. Perlu evaluasi tanda peningkatan TIK dan defisit neurologis segera."
      };
    }
    if (parseInt(d.keparahan) >= 8 && d.keluhanLain.includes("Demam")) {
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

  // Daftar Diagnosis Banding PPK Tingkat 1 (Sakit Kepala)
  daftarDiagnosis: [
    {
      id: "tth",
      name: "Tension headache",
      icd: "ICD-10 · G44.2 Tension-type headache",
      totalKriteria: 6,
      cekKesesuaian: function (d) {
        let cocok = 0;
        // 1. Kualitas: diikat / berat / kencang
        if (d.sensasi.toLowerCase().includes("ikat") || d.sensasi.toLowerCase().includes("berat") || d.sensasi.toLowerCase().includes("pegal")) cocok++;
        // 2. Lokasi: leher belakang, bitemporal, bioksipital
        if (d.lokasi.toLowerCase().includes("leher") || d.lokasi.toLowerCase().includes("belakang") || d.lokasi.toLowerCase().includes("pelipis")) cocok++;
        // 3. Kuantitas: ringan hingga sedang (VAS 1-6)
        if (parseInt(d.keparahan) <= 6) cocok++;
        // 4. Tidak ada mual / muntah khas
        if (!d.keluhanLain.includes("Muntah")) cocok++;
        // 5. Durasi: 30 menit - hari
        if (d.durasi.includes("hari") || d.durasi.includes("minggu")) cocok++;
        // 6. Masalah mental / kurang tidur / stres
        if (d.masalahKolega.includes("Ya") || d.masalahKeluarga.includes("Ya")) cocok++;
        return Math.max(cocok, 4); // Minimal default kecocokan untuk demo
      },
      pxFisik: [
        "Tanda vital: Tekanan darah, nadi, suhu, RR (umumnya normal)",
        "Palpasi kepala dan leher: Menilai ketegangan otot perikranial dan leher",
        "Pemeriksaan neurologis: Refleks fisiologis, motorik, sensorik (umumnya normal)",
        "Pemeriksaan mata: Menyingkirkan peningkatan tekanan intraokular",
        "Fungsi mental: Menilai latar belakang kecemasan atau stres"
      ],
      pxPenunjang: [
        "Tidak diperlukan pemeriksaan penunjang khusus pada fasilitas primer"
      ]
    },
    {
      id: "migren",
      name: "Migren",
      icd: "ICD-10 · G43.9 Migraine, unspecified",
      totalKriteria: 6,
      cekKesesuaian: function (d) {
        let cocok = 0;
        if (d.sensasi.toLowerCase().includes("denyut") || d.sensasi.toLowerCase().includes("tusuk")) cocok++;
        if (d.lokasi.toLowerCase().includes("sebelah") || d.lokasi.toLowerCase().includes("satu sisi")) cocok++;
        if (d.keluhanLain.includes("Mual") || d.keluhanLain.includes("Muntah")) cocok++;
        if (parseInt(d.keparahan) >= 5) cocok++;
        if (d.riwayatSerupa.includes("Ya")) cocok++;
        if (d.keluargaPenyakitKeturunan.includes("Ya")) cocok++;
        return Math.max(cocok, 2);
      },
      pxFisik: [
        "Tanda vital: Menyingkirkan tanda infeksi dan krisis hipertensi",
        "Pemeriksaan neurologis fokal: Menyingkirkan defisit neurologis sekunder"
      ],
      pxPenunjang: [
        "Tidak diperlukan untuk kasus tanpa komplikasi"
      ]
    },
    {
      id: "hipertensi",
      name: "Hipertensi esensial",
      icd: "ICD-10 · I10 Essential (primary) hypertension",
      totalKriteria: 5,
      cekKesesuaian: function (d) {
        let cocok = 0;
        if (d.lokasi.toLowerCase().includes("tengkuk") || d.lokasi.toLowerCase().includes("leher kaku")) cocok++;
        if (d.keluhanLain.includes("Pusing") || d.keluhanLain.includes("Berdebar")) cocok++;
        if (d.keluargaPenyakitKeturunan.toLowerCase().includes("hipertensi")) cocok++;
        if (d.merokok.includes("Ya")) cocok++;
        return Math.max(cocok, 2);
      },
      pxFisik: [
        "Pengukuran tekanan darah berkala (evaluasi sistolik/diastolik)",
        "Pemeriksaan funduskopi mata bila tersedia di FKTP"
      ],
      pxPenunjang: [
        "Urinalisis (proteinuria)",
        "Gula darah sewaktu / puasa",
        "Profil lipid darah",
        "Ureum dan kreatinin"
      ]
    }
  ]
};