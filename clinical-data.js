/* ==========================================================================
   clinical-data.js — Basis Pengetahuan Klinis & Matriks Pembobotan PPK FKTP
   Sumber: Panduan Praktik Klinis Dokter di Faskes Tingkat Pertama (PPK 144)
   ========================================================================== */

/* ---------- 1. Kamus Kode Gejala Matriks Anamnesis ---------- */
const KAMUS_GEJALA = {
  "ONS06": "Muncul setelah benturan/cedera kepala",
  "LOK01": "Seluruh kepala / terasa menyebar",
  "LOK02": "Satu sisi kepala",
  "LOK03": "Dahi / kepala bagian depan",
  "LOK04": "Kedua pelipis",
  "LOK05": "Belakang kepala sampai tengkuk",
  "LOK06": "Dari leher belakang menjalar ke kepala atau bahu",
  "LOK07": "Di belakang atau sekitar bola mata",
  "KUA01": "Nyeri kepala berat / kencang / diikat",
  "KUA02": "Nyeri kepala berdenyut / ditusuk-tusuk",
  "KUA03": "Nyeri saat membaca / melihat layar lama",
  "KUA04": "Disertai sensasi berputar (vertigo)",
  "KUA05": "Disertai sensasi melayang / bergoyang",
  "KUA06": "Kepala berkunang-kunang / mau pingsan",
  "INT01": "Nyeri intensitas ringan",
  "INT02": "Nyeri intensitas sedang",
  "INT03": "Nyeri intensitas berat",
  "INT04": "Nyeri terhebat yang pernah dirasakan",
  "ONS01": "Onset mendadak",
  "ONS02": "Onset pelan-pelan memberat",
  "ONS03": "Didahului gejala awal / prodromal",
  "FRE01": "Serangan pertama kali",
  "FRE02": "Episodik (< 15 hari/bulan)",
  "FRE03": "Kronis (≥ 15 hari/bulan selama 6 bulan)",
  "FRE04": "Terus-menerus tanpa jeda",
  "FRE05": "Berulang dalam serangan terpisah",
  "DUR01": "Durasi sangat singkat (< 30 detik)",
  "DUR02": "Durasi 30 menit sampai < 4 jam",
  "DUR03": "Durasi 4 sampai 72 jam",
  "DUR04": "Durasi beberapa hari sampai 1 minggu",
  "DUR05": "Durasi lebih dari 1 minggu",
  "ONS04": "Pemicu membaca / visual lama",
  "ONS05": "Pemicu perubahan posisi kepala/badan",
  "PRE01": "Pemicu menstruasi / hormonal",
  "PRE02": "Pemicu telat makan / puasa",
  "PRE03": "Pemicu makanan tertentu (keju/cokelat/alkohol)",
  "PRE04": "Pemicu kurang / terlalu banyak tidur",
  "PRE05": "Pemicu cahaya berkelip",
  "PRE06": "Pemicu stres pikiran / konflik",
  "PRE07": "Nyeri bertambah saat bergerak/aktivitas",
  "PRE08": "Pemicu perubahan posisi kepala",
  "PRE09": "Pemicu aktivitas fisik berat",
  "PRE10": "Konsumsi garam berlebih",
  "PRE11": "Bekerja visual dekat lama",
  "KEL01": "Keluarga riwayat sakit kepala serupa",
  "KEL02": "Keluarga riwayat hipertensi/jantung",
  "KEL03": "Keluarga rabun jauh / kacamata",
  "KEL04": "Orang sekitar demam / sakit serupa",
  "RPD01": "Diabetes / konsumsi obat gula",
  "RPD02": "Riwayat hipertensi",
  "RPD03": "Riwayat anemia / pola vegetarian",
  "RPD04": "Kondisi sedang hamil",
  "RPD05": "Kondisi sedang menyusui",
  "RPD06": "Pernah operasi mata / telinga",
  "RPD07": "Pernah cedera kepala / leher",
  "RPD08": "Riwayat obat ototoksik",
  "RPD09": "Riwayat gangguan cemas / depresi",
  "KEB01": "Pola makan tidak teratur / porsi kurang",
  "KEB02": "Insomnia / gangguan tidur rutin",
  "KEB03": "Aktivitas fisik berlebihan",
  "KEB04": "Aktivitas fisik kurang / sedenter",
  "KEB05": "Rokok / alkohol / kafein berlebih",
  "KEB06": "Lingkungan ada genangan / kasus DBD",
  "KEB07": "Higiene sanitasi makanan kurang",
  "PEN01": "Demam",
  "PEN02": "Nyeri otot atau sendi",
  "PEN03": "Batuk",
  "PEN04": "Bersin",
  "PEN05": "Pilek / hidung meler",
  "PEN06": "Sakit tenggorokan",
  "PEN07": "Mual atau muntah",
  "PEN08": "Nyeri ulu hati / perut",
  "PEN09": "Konstipasi",
  "PEN10": "Diare",
  "PEN11": "Sensitif terhadap cahaya (fotofobia)",
  "PEN12": "Sensitif terhadap suara (fonofobia)",
  "PEN13": "Gangguan visual pra-nyeri (aura)",
  "PEN14": "Penglihatan dekat kabur",
  "PEN15": "Penglihatan jauh kabur",
  "PEN16": "Penglihatan kabur / distorsi",
  "PEN17": "Mata lelah / berair / perih",
  "PEN18": "Sering memicingkan mata",
  "PEN19": "Lemas / lesu / mudah lelah",
  "PEN20": "Pucat",
  "PEN21": "Sulit berkonsentrasi",
  "PEN22": "Sesak atau napas pendek",
  "PEN23": "Gemetar (tremor)",
  "PEN24": "Rasa lapar berlebihan",
  "PEN25": "Keringat dingin",
  "PEN26": "Jantung berdebar (palpitasi)",
  "PEN27": "Gelisah",
  "PEN28": "Telinga berdenging (tinnitus)",
  "PEN29": "Leher kaku",
  "PEN30": "Nyeri dada",
  "PEN31": "Bintik merah / mimisan",
  "PEN32": "Nafsu makan menurun"
};

/* ---------- 2. Knowledge Base & 15 Diagnosis PPK FKTP ---------- */
const KNOWLEDGE_BASE_SAKIT_KEPALA = {
  // Evaluasi Triase & Red Flag
  evaluasiRedFlag: function (d) {
    var codes = d.codes || [];
    var isTrauma = d.isTraumaGate || codes.indexOf('ONS06') !== -1;
    var isRF01 = codes.indexOf('RF01') !== -1;
    var isRF02 = codes.indexOf('RF02') !== -1;
    var isRF03 = codes.indexOf('RF03') !== -1 || (codes.indexOf('PEN01') !== -1 && codes.indexOf('PEN29') !== -1);
    var isThunderclap = codes.indexOf('INT04') !== -1;

    if (isTrauma) {
      return {
        isRedFlag: true,
        badge: "Red flag / Trauma",
        title: "Tanda Bahaya: Riwayat Benturan / Trauma Kepala (Gate Trauma)",
        desc: "Pasien memiliki riwayat benturan atau cedera kepala dalam beberapa hari terakhir. Pasien masuk jalur trauma kepala untuk evaluasi tanda fraktur basis cranii, peningkatan TIK, atau perdarahan intrakranial."
      };
    }

    if (isRF01 || isRF02 || isRF03 || isThunderclap) {
      var details = [];
      if (isRF01) details.push("Defisit neurologis fokal");
      if (isRF02) details.push("Penurunan kesadaran atau kejang");
      if (isRF03) details.push("Kaku kuduk disertai demam");
      if (isThunderclap) details.push("Nyeri kepala mendadak sangat hebat");

      return {
        isRedFlag: true,
        badge: "Red flag / Gawat",
        title: "Tanda Bahaya: Terdeteksi Red Flag Neurologis Akut",
        desc: "Ditemukan tanda bahaya: " + details.join(', ') + ". Diindikasikan evaluasi segera dan stabilisasi/rujukan gawat darurat."
      };
    }

    return {
      isRedFlag: false,
      badge: "Triase Terkendali",
      title: "Status Triase Terkendali",
      desc: "Tidak terdeteksi tanda bahaya trauma akut atau kegawatan sekunder mayor pada screening awal. Pemeriksaan dapat berjalan sesuai alur rawat jalan FKTP."
    };
  },

  // Daftar 15 Diagnosis Berbobot Lengkap dengan Saran & Temuan PPK
  daftarDiagnosis: [
    {
      id: "tth",
      no: 1,
      kategori: "Neurologi / Nyeri Kepala",
      name: "Tension-Type Headache (TTH)",
      icd: "ICD-10 · G44.2",
      skdi: "4A",
      maxScore: 36,
      weights: {
        'KUA01': 3,
        'LOK01': 2, 'LOK04': 2, 'LOK05': 2, 'LOK06': 2, 'INT01': 2, 'INT02': 2, 'FRE02': 2, 'FRE03': 2, 'FRE04': 2, 'DUR02': 2, 'DUR04': 2, 'PEN22': 2, 'PEN09': 2, 'PEN32': 2, 'PEN26': 2,
        'PRE06': 1, 'RPD09': 1, 'KEB02': 1
      },
      pxFisik: [
        "Tanda Vital: TTV umumnya dalam batas normal",
        "Palpasi kepala, leher belakang, & bahu: Nyeri tekan perikranial difus, spasme/tegangan otot leher/bahu",
        "Pemeriksaan neurologis dasar: Fungsi motorik, sensorik, dan refleks normal",
        "Pemeriksaan mata dasar: Tidak ada peningkatan tekanan intraokular",
        "Evaluasi fungsi mental & psikologis: Tidak ada gangguan kognitif organik, tampak faktor stres/kecemasan"
      ],
      pxPenunjang: [
        "Tidak diindikasikan pada presentasi klasik (tidak diperlukan pemeriksaan penunjang)"
      ],
      microcopy: "Fisik: TTV DBN, palpasi leher/bahu nyeri tekan/spasme otot, status neuro normal. Penunjang: Tidak diperlukan."
    },
    {
      id: "migren",
      no: 2,
      kategori: "Neurologi / Nyeri Kepala",
      name: "Migren",
      icd: "ICD-10 · G43.9",
      skdi: "4A",
      maxScore: 39,
      weights: {
        'LOK02': 3, 'KUA02': 3, 'PEN11': 3, 'PEN12': 3, 'PEN13': 3,
        'INT02': 2, 'INT03': 2, 'ONS03': 2, 'FRE05': 2, 'DUR03': 2, 'PEN19': 2, 'PEN07': 2,
        'PRE01': 1, 'PRE02': 1, 'PRE03': 1, 'PRE04': 1, 'PRE05': 1, 'PRE07': 1, 'KEL01': 1, 'RPD04': 1, 'RPD05': 1, 'KEB05': 1
      },
      pxFisik: [
        "Tanda Vital: TTV dalam batas normal",
        "Pemeriksaan neurologis lengkap (motorik, sensorik, koordinasi, refleks, saraf kranial): Status neurologis intak tanpa defisit fokal",
        "Pemeriksaan fisik umum kepala-leher: Tidak ditemukan kelainan struktural atau sekunder"
      ],
      pxPenunjang: [
        "Tidak diindikasikan pada kasus tanpa red flags (tidak diperlukan pemeriksaan penunjang rutin)"
      ],
      microcopy: "Fisik: TTV normal, pemeriksaan neuro intak tanpa defisit fokal (eksklusi kelainan sekunder). Penunjang: Tidak diperlukan."
    },
    {
      id: "hipertensi",
      no: 3,
      kategori: "Kardiovaskular",
      name: "Hipertensi Esensial",
      icd: "ICD-10 · I10",
      skdi: "4A",
      maxScore: 20,
      weights: {
        'PEN29': 3,
        'LOK05': 2, 'PEN19': 2, 'PEN16': 2, 'PEN26': 2, 'PEN30': 2, 'PEN27': 2,
        'PRE10': 1, 'KEL02': 1, 'RPD02': 1, 'KEB04': 1, 'KEB05': 1
      },
      pxFisik: [
        "Pengukuran Tekanan Darah (TTV): Tekanan darah meningkat (JNC VII Stage 1: 140-159/90-99 mmHg, Stage 2: >=160/>=100 mmHg)",
        "Evaluasi fisik jantung: JVP tidak meningkat, batas jantung normal (tanpa kardiomegali awal)",
        "Auskultasi paru: Paru bersih, tidak ada ronkhi",
        "Pemeriksaan status neurologis: Tidak ada defisit neurologis fokal"
      ],
      pxPenunjang: [
        "Urinalisis: Evaluasi proteinuria",
        "Gula Darah Puasa/Sewaktu & Profil Lipid: Skrining komorbiditas metabolik",
        "Ureum & Kreatinin: Evaluasi fungsi ekskresi ginjal",
        "EKG 12-lead: Evaluasi hipertrofi ventrikel kiri (LVH) / iskemia",
        "Foto Toraks & Funduskopi: Evaluasi kardiomegali dan retinopati hipertensi"
      ],
      microcopy: "Fisik: TD >=140/90 mmHg, JVP & batas jantung normal, ronkhi (-). Penunjang: Urinalisis (proteinuria?), Kimia Darah (Gula/Profil Lipid/Ureum-Kreatinin), EKG 12-lead."
    },
    {
      id: "insomnia",
      no: 4,
      kategori: "Psikiatri",
      name: "Insomnia Non-Organik",
      icd: "ICD-10 · F51",
      skdi: "4A",
      maxScore: 7,
      weights: {
        'KEB02': 3,
        'PRE04': 2,
        'RPD09': 1, 'KEB05': 1
      },
      pxFisik: [
        "Pemeriksaan keadaan umum & kelelahan: Kesadaran kompos mentis, tidak tampak kelelahan ekstrem/mata cekung berat",
        "Pemeriksaan sistemik & mata: Tidak ditemukan kelainan patologi organik sistemik (eksklusi penyebab somatik)"
      ],
      pxPenunjang: [
        "Tidak diindikasikan pemeriksaan spesifik (skrining rutin tidak menemukan kelainan organik)"
      ],
      microcopy: "Fisik: Keadaan umum baik, tidak tampak kelainan organik sistemik. Penunjang: Tidak diperlukan pemeriksaan spesifik."
    },
    {
      id: "hipermetropia",
      no: 5,
      kategori: "Oftalmologi / Refraksi",
      name: "Hipermetropia Ringan",
      icd: "ICD-10 · H52.0",
      skdi: "4A",
      maxScore: 17,
      weights: {
        'KUA03': 3, 'PEN14': 3,
        'LOK03': 2, 'ONS04': 2, 'PRE11': 2, 'PEN11': 2, 'PEN17': 2,
        'RPD06': 1
      },
      pxFisik: [
        "Uji Ketajaman Penglihatan (Snellen Chart): Tajam penglihatan dekat menurun/cepat lelah (astenopia); tajam penglihatan jauh normal/sedikit turun",
        "Uji Refraksi Subjektif (Trial Lens & Frame): Penglihatan terkoreksi optimal (6/6) dengan lensa sferis positif (S+) terkuat"
      ],
      pxPenunjang: [
        "Tidak diindikasikan (tidak diperlukan pemeriksaan penunjang)"
      ],
      microcopy: "Fisik: Tajam penglihatan dekat menurun, terkoreksi maksimal 6/6 dengan lensa sferis positif (S+). Penunjang: Tidak diperlukan."
    },
    {
      id: "miopia",
      no: 6,
      kategori: "Oftalmologi / Refraksi",
      name: "Miopia",
      icd: "ICD-10 · H52.1",
      skdi: "4A",
      maxScore: 15,
      weights: {
        'KUA03': 3, 'PEN15': 3,
        'ONS04': 2, 'PRE11': 2, 'PEN17': 2, 'PEN18': 2,
        'KEL03': 1
      },
      pxFisik: [
        "Uji Ketajaman Penglihatan (Snellen Chart): Tajam penglihatan jauh menurun (<6/6); pasien kerap memicingkan mata",
        "Uji Refraksi Subjektif (Trial Lens & Frame): Penglihatan terkoreksi maksimal (6/6) dengan lensa sferis negatif (S-) terlemah"
      ],
      pxPenunjang: [
        "Tidak diindikasikan (tidak diperlukan pemeriksaan penunjang)"
      ],
      microcopy: "Fisik: Tajam penglihatan jauh <6/6, terkoreksi optimal 6/6 dengan lensa sferis negatif (S-). Penunjang: Tidak diperlukan."
    },
    {
      id: "astigmatisme",
      no: 7,
      kategori: "Oftalmologi / Refraksi",
      name: "Astigmatisme",
      icd: "ICD-10 · H52.2",
      skdi: "4A",
      maxScore: 12,
      weights: {
        'KUA03': 3, 'PEN16': 3,
        'ONS04': 2, 'PRE11': 2, 'PEN18': 2
      },
      pxFisik: [
        "Uji Ketajaman Penglihatan (Snellen Chart): Tajam penglihatan tidak maksimal (<6/6) pada jarak jauh maupun dekat, objek terlihat berbayang/distorsi",
        "Tes Pinhole: Menunjukkan perbaikan visus",
        "Uji Refraksi Subjektif (Trial Lens & Frame): Penglihatan mencapai maksimal dengan koreksi lensa silindris (C) dan aksis yang sesuai"
      ],
      pxPenunjang: [
        "Tidak diindikasikan (tidak diperlukan pemeriksaan penunjang)"
      ],
      microcopy: "Fisik: Visus <6/6, membaik dengan uji pinhole, terkoreksi maksimal dengan lensa silindris (C). Penunjang: Tidak diperlukan."
    },
    {
      id: "presbiopia",
      no: 8,
      kategori: "Oftalmologi / Refraksi",
      name: "Presbiopia",
      icd: "ICD-10 · H52.4",
      skdi: "4A",
      maxScore: 12,
      weights: {
        'KUA03': 3, 'PEN14': 3,
        'ONS04': 2, 'PRE11': 2, 'PEN17': 2
      },
      pxFisik: [
        "Refraksi jarak jauh (Snellen Chart): Tajam penglihatan jauh normal (jika emetropia) atau terkoreksi penuh",
        "Refraksi jarak dekat (Kartu Jaeger 33-40 cm): Pasien kesulitan membaca paragraf kecil pada kartu Jaeger jarak dekat",
        "Uji adisi lensa sferis positif: Tajam penglihatan dekat optimal (Jaeger 1 atau 20/30) dengan adisi lensa sferis positif (usia 40 th: +1.00 D, naik bertahap per dekade)"
      ],
      pxPenunjang: [
        "Tidak diindikasikan (tidak diperlukan pemeriksaan penunjang)"
      ],
      microcopy: "Fisik: Visus jauh normal/terkoreksi, visus dekat menurun pada kartu Jaeger, terkoreksi dengan adisi lensa sferis positif (+). Penunjang: Tidak diperlukan."
    },
    {
      id: "hipoglikemi",
      no: 9,
      kategori: "Endokrin / Metabolik",
      name: "Hipoglikemia Ringan",
      icd: "ICD-10 · E16.2",
      skdi: "4A",
      maxScore: 22,
      weights: {
        'PEN24': 3, 'PEN25': 3, 'PEN23': 3,
        'KUA06': 2, 'PRE02': 2, 'RPD01': 2, 'PEN26': 2, 'PEN27': 2,
        'PRE09': 1, 'KEB01': 1, 'KEB03': 1
      },
      pxFisik: [
        "Pemeriksaan kulit & perspirasi: Kulit pucat, diaphoresis (keringat dingin berlebih)",
        "Tanda-tanda vital (TTV): Frekuensi denyut jantung meningkat (takikardia), tekanan darah normal atau menurun",
        "Status kesadaran: Kesadaran baik/compos mentis (stadium ringan)",
        "Pemeriksaan neurologis dasar: Tidak ada defisit neurologis fokal"
      ],
      pxPenunjang: [
        "Pemeriksaan Glukosa Darah Sewaktu (GDS) / Glukometer: Kadar GDS <70 mg/dL (atau <80 mg/dL disertai gejala otonom/keringat dingin/gemetar)"
      ],
      microcopy: "Fisik: Pucat, keringat dingin, takikardia, kesadaran compos mentis, neuro fokal (-). Penunjang: GDS <70 mg/dL (atau <80 mg/dL bergejala)."
    },
    {
      id: "anemia",
      no: 10,
      kategori: "Hematologi",
      name: "Anemia Defisiensi Besi",
      icd: "ICD-10 · D50 / 280",
      skdi: "4A",
      maxScore: 16,
      weights: {
        'PEN20': 3,
        'KUA06': 2, 'PEN19': 2, 'PEN22': 2, 'PEN28': 2, 'PEN21': 2,
        'RPD03': 1, 'RPD04': 1, 'KEB01': 1
      },
      pxFisik: [
        "Inspeksi kulit, telapak tangan, bantalan kuku: Tampak pucat (pallor) pada telapak tangan dan bantalan kuku",
        "Inspeksi konjungtiva palpebra: Konjungtiva anemis/pucat",
        "Inspeksi mukosa mulut & lidah: Mukosa mulut pucat, atrofi papil lidah (glositis), stomatitis angularis",
        "Inspeksi bentuk kuku: Koilonikia (kuku sendok) pada kasus kronis",
        "Evaluasi kemampuan menelan: Disfagia bila disertai sindrom Plummer-Vinson"
      ],
      pxPenunjang: [
        "Darah Perifer Lengkap (DPL) & Indeks Eritrosit: Hb turun, Ht turun, anemia mikrositik hipokromik (MCV <80 fL, MCH <27 pg, MCHC turun)",
        "Apusan Darah Tepi (ADT): Eritrosit mikrositik hipokromik, anisopoikilositosis",
        "Urinalisis & Feses Rutin: Skrining occult blood / perdarahan saluran cerna / telur cacing",
        "Profil Besi (Layanan Sekunder): Serum Iron turun, TIBC meningkat, Saturasi Transferin <15%, Feritin serum <15-30 ng/mL"
      ],
      microcopy: "Fisik: Konjungtiva anemis, telapak tangan pucat, atrofi papil lidah, koilonikia (+/-). Penunjang: Hb/Ht turun, MCV <80 fL, MCH <27 pg, ADT mikrositik hipokromik, feses rutin."
    },
    {
      id: "vertigo",
      no: 11,
      kategori: "Neurologi / Nyeri Kepala",
      name: "Vertigo (BPPV / Vestibular Perifer)",
      icd: "ICD-10 · R42",
      skdi: "4A",
      maxScore: 27,
      weights: {
        'KUA04': 3, 'KUA05': 3, 'DUR01': 3, 'ONS05': 3,
        'FRE05': 2, 'PRE08': 2, 'PEN25': 2, 'PEN28': 2, 'PEN07': 2,
        'PRE06': 1, 'RPD02': 1, 'RPD06': 1, 'RPD07': 1, 'RPD08': 1
      },
      pxFisik: [
        "Pengukuran Tekanan Darah baring & berdiri: Perbedaan sistolik <20-30 mmHg (menyingkirkan hipotensi ortostatik)",
        "Status kesadaran & nervus kranialis: Kesadaran kompos mentis, nervus kranialis intak",
        "Motorik & sensorik ekstremitas: Normal (tidak ada hemiparesis/hemihipestesi)",
        "Tes Nistagmus: Nistagmus perifer (terdapat masa laten, fatik, membaik dengan fiksasi visual)",
        "Tes Romberg & Sharpen Romberg: Jatuh ke sisi lesi vestibular saat mata tertutup",
        "Tes Fukuda Stepping: Deviasi >30 derajat ke sisi lesi",
        "Tes Past Pointing & Manuver Dix-Hallpike: Deviasi ke arah lesi / provokasi nistagmus posisional"
      ],
      pxPenunjang: [
        "Tidak ada pemeriksaan laboratorium rutin di FKTP. Rujuk neuroimaging (CT/MRI) bila curiga vertigo sentral"
      ],
      microcopy: "Fisik: TD ortostatik normal, defisit neuro fokal (-), uji nistagmus perifer (+), uji Romberg/Fukuda deviasi ke arah lesi. Penunjang: Tidak diperlukan di FKTP."
    },
    {
      id: "somatoform",
      no: 12,
      kategori: "Psikiatri",
      name: "Gangguan Somatoform",
      icd: "ICD-10 · F45",
      skdi: "4A",
      maxScore: 5,
      isExclusion: true,
      weights: {
        'FRE05': 2, 'RPD09': 2,
        'PRE06': 1
      },
      pxFisik: [
        "Pemeriksaan fisik komprehensif seluruh sistem organ terkait keluhan pasien: Seluruh temuan dalam batas normal (tidak ditemukan kelainan organik/struktural mendasar)"
      ],
      pxPenunjang: [
        "Pemeriksaan penunjang terarah sesuai keluhan spesifik: Hasil laboratorium/radiologi dalam batas normal (menyingkirkan patologi organik)"
      ],
      microcopy: "Fisik: Pemeriksaan fisik seluruh sistem DBN / normal. Penunjang: Seluruh penunjang relevan DBN (menyingkirkan patologi organik)."
    },
    {
      id: "dengue",
      no: 13,
      kategori: "Penyakit Tropis & Infeksi",
      name: "Demam Dengue / Demam Berdarah Dengue (DBD)",
      icd: "ICD-10 · A90 / A91",
      skdi: "4A",
      maxScore: 30,
      requiredCode: "PEN01",
      weights: {
        'LOK07': 3, 'PEN31': 3,
        'INT03': 2, 'ONS01': 2, 'FRE04': 2, 'DUR04': 2, 'PEN01': 2, 'PEN03': 2, 'PEN05': 2, 'PEN06': 2, 'PEN07': 2, 'PEN08': 2, 'PEN02': 2,
        'KEL04': 1, 'KEB06': 1
      },
      pxFisik: [
        "Pengukuran Suhu Tubuh: Suhu >37.5°C s.d. >38.5°C (febris akut mendadak)",
        "Inspeksi kulit & mukosa: Ptekie, ekimosis, purpura, perdarahan mukosa (epistaksis, perdarahan gusi)",
        "Uji Bendungan (Rumple Leede Test): Positif (>=10-20 ptekie per inci kuadrat)",
        "Palpasi Abdomen (Hati & Nyeri Tekan): Hepatomegali, nyeri tekan epigastrium/hipokondrium kanan",
        "Evaluasi Tanda Syok/Perfusi Perifer: Pada DHF berat/syok akral dingin, nadi cepat-lemah, CRT >2 detik"
      ],
      pxPenunjang: [
        "Darah Perifer Lengkap (DPL): Trombositopenia (<=100.000/uL pada DHF), leukopenia, peningkatan hematokrit >=20% (hemokonsentrasi/kebocoran plasma)",
        "Serologi Dengue: Rapid NS1 Antigen positif (hari 1-3), IgM & IgG anti-Dengue positif (terdeteksi setelah hari ke-3 s.d. 5)",
        "Evaluasi Kebocoran Plasma: Hipoalbuminemia, tanda efusi pleura / asites pada DHF"
      ],
      microcopy: "Fisik: Suhu >37.5 C, ptekie/perdarahan mukosa, Rumple Leed (+), hepatomegali (+/-). Penunjang: Trombosit <=100.000/uL, Ht meningkat >=20%, leukopenia, NS1 / IgM-IgG Dengue (+)."
    },
    {
      id: "tifoid",
      no: 14,
      kategori: "Penyakit Tropis & Infeksi",
      name: "Demam Tifoid",
      icd: "ICD-10 · A01.0",
      skdi: "4A",
      maxScore: 25,
      requiredCode: "PEN01",
      weights: {
        'DUR05': 3, 'PEN08': 3,
        'LOK03': 2, 'PEN01': 2, 'PEN03': 2, 'PEN07': 2, 'PEN09': 2, 'PEN10': 2, 'PEN32': 2, 'PEN02': 2,
        'KEL04': 1, 'KEB02': 1, 'KEB07': 1
      },
      pxFisik: [
        "Keadaan umum & tingkat kesadaran: Pasien tampak sakit sedang-berat; kesadaran compos mentis hingga apatis/somnolen/delirium",
        "Pengukuran suhu tubuh & frekuensi nadi: Demam kontinyu/step-ladder, bradikardia relatif (kenaikan suhu 1°C tidak disertai kenaikan denyut nadi 8-10 denyut/menit)",
        "Pemeriksaan rongga mulut & lidah: Typhoid tongue (lidah kotor di tengah berselaput putih dengan tepi hiperemis dan tremor), halitosis",
        "Palpasi & perkusi abdomen: Meteorismus, nyeri tekan abdomen (khususnya epigastrik/ileosekal), hepatosplenomegali",
        "Inspeksi kulit: Roseola/rose spots (jarang tampak)"
      ],
      pxPenunjang: [
        "Darah Perifer Lengkap (DPL): Leukopenia atau leukosit normal, limfositosis relatif, aneosinofilia, trombositopenia ringan",
        "Serologi Cepat (Tubex-TF / Typhidot): Tubex-TF positif IgM anti-O9 S. typhi (hari 4-5); Typhidot positif IgM/IgG",
        "Tes Widal: Kenaikan titer aglutinin O >=1/320 atau kenaikan 4x lipat sepasang serum",
        "Kultur Salmonella typhi (Baku Emas): Positif pada darah (minggu 1-2), feses (minggu 2), urin (minggu 2-3)",
        "Enzim Hati (SGOT/SGPT): Dapat meningkat ringan-sedang"
      ],
      microcopy: "Fisik: Demam step-ladder, bradikardia relatif, typhoid tongue (lidah kotor), nyeri tekan abdomen/hepatomegali. Penunjang: DPL (leukopenia/limfositosis relatif), Tubex-TF (+), Widal O >=1/320, Kultur Salmonella (+)."
    },
    {
      id: "influenza",
      no: 15,
      kategori: "Respirasi & Infeksi",
      name: "Influenza",
      icd: "ICD-10 · J11",
      skdi: "4A",
      maxScore: 21,
      requiredCode: "PEN01",
      weights: {
        'PEN03': 3, 'PEN04': 3, 'PEN05': 3, 'PEN06': 3,
        'ONS01': 2, 'PEN01': 2, 'PEN19': 2, 'PEN02': 2,
        'KEL04': 1
      },
      pxFisik: [
        "Pengukuran suhu tubuh: Febris akut (>37.5°C s.d. >38°C)",
        "Pemeriksaan hidung & faring: Mukosa kavum nasi hiperemis, konka edema dengan sekret serosa/mukoid, faring hiperemis ringan",
        "Auskultasi saluran napas / paru: Suara napas vesikuler normal, tanpa ronkhi basah kasar atau wheezing (tanpa komplikasi pneumonia)"
      ],
      pxPenunjang: [
        "Tidak diindikasikan pemeriksaan laboratorium rutin di FKTP. Bila diperlukan indikasi khusus/surveilans: Rapid Antigen Influenza atau RT-PCR Swab Nasofaring"
      ],
      microcopy: "Fisik: Suhu >37.5 C, mukosa hidung hiperemis/sekret serosa, faring hiperemis, suara napas vesikuler bersih. Penunjang: Klinis murni (tidak perlu lab rutin)."
    }
  ]
};