/* Basis Data Kunci Jawaban & Kasus Klinis Prototipe */
const CLINICAL_PRESETS = {
  // Skenario 1: Kasus Respirasi (Bronkitis Akut / Suspek Pneumonia)
  respirasi: {
    label: "Kasus Respirasi (Batuk & Sesak)",
    dataPasien: {
      keluhanUtama: "Batuk",
      keluhanLain: ["Demam", "Sesak napas", "Berdahak", "Nyeri tenggorokan"],
      lokasi: "Dada tengah dan tenggorokan",
      sensasi: "Batuk berdahak kental kekuningan, dada terasa berat saat menarik napas",
      keparahan: "6",
      durasi: "5 hari",
      frekuensi: "5 kali",
      durasiSerangan: "10-15 menit",
      faktorPemicu: "Ya · Terpapar udara malam dingin dan asap rokok",
      riwayatSerupa: "Ya (sekitar 6 bulan lalu)",
      kontakTB: "Belum diketahui",
      penyakitKeturunan: "Asma",
      operasi: "Tidak",
      cedera: "Tidak",
      keluargaKeluhanSerupa: "Ya (anak batuk dan pilek 3 hari lalu)",
      keluargaPenyakitKeturunan: "Ya (ibu riwayat asma)",
      keluargaMenular: "Tidak",
      masalahKeluarga: "Tidak",
      masalahKolega: "Tidak",
      makananTerakhir: "Nasi goreng pedas dan es teh",
      makanTeratur: "Ya",
      minumAir: "Cukup",
      aktivitasFisik: "2 kali per minggu",
      merokok: "Ya · ± 10 batang per hari",
      alkohol: "Tidak",
      obatTerlarang: "Tidak",
      kebersihan: "Bersih",
      alergiObat: "Belum diketahui",
      obatDikonsumsi: "Ya (Parasetamol 500 mg bila demam)",
      kondisiKhusus: "Tidak ada"
    },
    cdss: {
      isRedFlag: true,
      redFlagText: "Kombinasi <b>demam > 3 hari</b> dan <b>sesak napas</b> memenuhi aturan penanda triase. Disarankan evaluasi SpO₂ dan frekuensi napas lebih dulu.",
      diagnosis: [
        { name: "Bronkitis akut", icd: "ICD-10 · J20.9", kriteria: "5 / 7 kriteria", percent: "71%", barClass: "" },
        { name: "Pneumonia komunitas", icd: "ICD-10 · J18.9", kriteria: "4 / 8 kriteria", percent: "50%", barClass: "warn" },
        { name: "Infeksi saluran napas atas akut", icd: "ICD-10 · J06.9", kriteria: "3 / 6 kriteria", percent: "50%", barClass: "warn" }
      ]
    }
  },

  // Skenario 2: Kasus Pencernaan (Dispepsia / Gastritis)
  dispepsia: {
    label: "Kasus Pencernaan (Nyeri Ulu Hati)",
    dataPasien: {
      keluhanUtama: "Sakit perut",
      keluhanLain: ["Mual", "Muntah", "Lemas"],
      lokasi: "Perut bagian atas / ulu hati (epigastrium)",
      sensasi: "Nyeri perih seperti terbakar, perut begah dan mual",
      keparahan: "5",
      durasi: "3 hari",
      frekuensi: "3 kali",
      durasiSerangan: "30 menit setelah makan",
      faktorPemicu: "Ya · Telat makan dan konsumsi makanan pedas/asam",
      riwayatSerupa: "Ya (sering kambuh sejak 1 tahun terakhir)",
      kontakTB: "Tidak",
      penyakitKeturunan: "Tidak ada",
      operasi: "Tidak",
      cedera: "Tidak",
      keluargaKeluhanSerupa: "Tidak",
      keluargaPenyakitKeturunan: "Hipertensi",
      keluargaMenular: "Tidak",
      masalahKeluarga: "Tidak",
      masalahKolega: "Ya · Sedang stres tugas akhir/pekerjaan",
      makananTerakhir: "Mie instan kuah pedas",
      makanTeratur: "Tidak",
      minumAir: "Kurang",
      aktivitasFisik: "1 kali per minggu",
      merokok: "Tidak",
      alkohol: "Tidak",
      obatTerlarang: "Tidak",
      kebersihan: "Bersih",
      alergiObat: "Tidak ada",
      obatDikonsumsi: "Ya (Antasida sirup sebelum makan)",
      kondisiKhusus: "Tidak ada"
    },
    cdss: {
      isRedFlag: false,
      redFlagText: "Tidak ada tanda bahaya perdarahan saluran cerna atas (hematemesis/melena) terdeteksi.",
      diagnosis: [
        { name: "Sindrom dispepsia", icd: "ICD-10 · K30", kriteria: "4 / 5 kriteria", percent: "80%", barClass: "" },
        { name: "Gastritis", icd: "ICD-10 · K29.7", kriteria: "3 / 5 kriteria", percent: "60%", barClass: "warn" },
        { name: "Gastroesophageal reflux disease", icd: "ICD-10 · K21.9", kriteria: "2 / 5 kriteria", percent: "40%", barClass: "warn" }
      ]
    }
  }
};