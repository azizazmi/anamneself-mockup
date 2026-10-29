/* clinical-data.js — Matriks Basis Pengetahuan Sakit Kepala Berbobot (PPK 144 FKTP) */

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

const KNOWLEDGE_BASE_SAKIT_KEPALA = {
  // Evaluasi Red Flag & Triase
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
        desc: "Pasien memiliki riwayat benturan kepala. Masuk jalur evaluasi trauma kepala."
      };
    }
    if (isRF01 || isRF02 || isRF03 || isThunderclap) {
      return {
        isRedFlag: true,
        badge: "Red flag / Gawat",
        title: "Tanda Bahaya: Terdeteksi Red Flag Neurologis Akut",
        desc: "Ditemukan tanda bahaya gawat darurat. Diindikasikan evaluasi prioritas / rujukan."
      };
    }
    return {
      isRedFlag: false,
      badge: "Triase Terkendali",
      title: "Status Triase Terkendali",
      desc: "Tidak terdeteksi tanda bahaya trauma akut atau kegawatan sekunder mayor."
    };
  },

  daftarDiagnosis: [
    {
      id: "tth",
      name: "Tension headache",
      icd: "ICD-10 · G44.2 Tension-type headache",
      maxScore: 36,
      weights: {
        'KUA01': 3,
        'LOK01': 2, 'LOK04': 2, 'LOK05': 2, 'LOK06': 2, 'INT01': 2, 'INT02': 2, 'FRE02': 2, 'FRE03': 2, 'FRE04': 2, 'DUR02': 2, 'DUR04': 2, 'PEN22': 2, 'PEN09': 2, 'PEN32': 2, 'PEN26': 2,
        'PRE06': 1, 'RPD09': 1, 'KEB02': 1
      },
      pxFisik: [
        "Tanda vital dalam batas normal",
        "Palpasi perikranial: nyeri tekan / ketegangan otot leher, tengkuk, dan perikranial",
        "Pemeriksaan saraf kranialis dan motorik normal"
      ],
      pxPenunjang: [
        "Tidak diperlukan pemeriksaan penunjang laboratorium/radiologi rutin di FKTP"
      ]
    },
    {
      id: "migren",
      name: "Migren",
      icd: "ICD-10 · G43.9 Migraine, unspecified",
      maxScore: 39,
      weights: {
        'LOK02': 3, 'KUA02': 3, 'PEN11': 3, 'PEN12': 3, 'PEN13': 3,
        'INT02': 2, 'INT03': 2, 'ONS03': 2, 'FRE05': 2, 'DUR03': 2, 'PEN19': 2, 'PEN07': 2,
        'PRE01': 1, 'PRE02': 1, 'PRE03': 1, 'PRE04': 1, 'PRE05': 1, 'PRE07': 1, 'KEL01': 1, 'RPD04': 1, 'RPD05': 1, 'KEB05': 1
      },
      pxFisik: [
        "Evaluasi tanda vital dan status kesadaran umum",
        "Pemeriksaan nervus kranialis dan lapang pandang sederhana (negatif)"
      ],
      pxPenunjang: [
        "Tidak diperlukan penunjang laboratorium rutin untuk kasus migren tipikal"
      ]
    },
    {
      id: "hipertensi",
      name: "Hipertensi esensial",
      icd: "ICD-10 · I10 Essential (primary) hypertension",
      maxScore: 20,
      weights: {
        'PEN29': 3,
        'LOK05': 2, 'PEN19': 2, 'PEN16': 2, 'PEN26': 2, 'PEN30': 2, 'PEN27': 2,
        'PRE10': 1, 'KEL02': 1, 'RPD02': 1, 'KEB04': 1, 'KEB05': 1
      },
      pxFisik: [
        "Pengukuran tekanan darah berkala (duduk tenang minimal 5 menit, konfirmasi kedua lengan)",
        "Auskultasi jantung (murmur/gallop) dan paru"
      ],
      pxPenunjang: [
        "Urinalisis lengkap (proteinuria)",
        "Gula darah sewaktu / puasa, profil lipid darah"
      ]
    },
    {
      id: "vertigo",
      name: "Vertigo (BPPV / Vestibular)",
      icd: "ICD-10 · R42 Dizziness and giddiness",
      maxScore: 27,
      weights: {
        'KUA04': 3, 'KUA05': 3, 'DUR01': 3, 'ONS05': 3,
        'FRE05': 2, 'PRE08': 2, 'PEN25': 2, 'PEN28': 2, 'PEN07': 2,
        'PRE06': 1, 'RPD02': 1, 'RPD06': 1, 'RPD07': 1, 'RPD08': 1
      },
      pxFisik: [
        "Uji nistagmus posisi: Manuver Dix-Hallpike",
        "Tes Romberg, Romberg dipertajam, tandem gait"
      ],
      pxPenunjang: [
        "Tes fungsi pendengaran sederhana (penala Rinne, Weber, Schwabach)"
      ]
    },
    {
      id: "hipermetropia",
      name: "Hipermetropia",
      icd: "ICD-10 · H52.0 Hypermetropia",
      maxScore: 17,
      weights: {
        'KUA03': 3, 'PEN14': 3,
        'LOK03': 2, 'ONS04': 2, 'PRE11': 2, 'PEN11': 2, 'PEN17': 2,
        'RPD06': 1
      },
      pxFisik: [
        "Pemeriksaan visus jauh dan dekat dengan kartu Snellen / Jaeger"
      ],
      pxPenunjang: [
        "Uji koreksi refraksi lensa sferis positif (+)"
      ]
    },
    {
      id: "miopia",
      name: "Miopia",
      icd: "ICD-10 · H52.1 Myopia",
      maxScore: 15,
      weights: {
        'KUA03': 3, 'PEN15': 3,
        'ONS04': 2, 'PRE11': 2, 'PEN17': 2, 'PEN18': 2,
        'KEL03': 1
      },
      pxFisik: [
        "Pemeriksaan tajam penglihatan kartu Snellen dan uji pinhole"
      ],
      pxPenunjang: [
        "Uji koreksi refraksi lensa sferis negatif (-)"
      ]
    },
    {
      id: "astigmatisme",
      name: "Astigmatisme",
      icd: "ICD-10 · H52.2 Astigmatism",
      maxScore: 12,
      weights: {
        'KUA03': 3, 'PEN16': 3,
        'ONS04': 2, 'PRE11': 2, 'PEN18': 2
      },
      pxFisik: ["Tes uji jam astigmatisme (astigmatic dial test)"],
      pxPenunjang: ["Koreksi refraksi lensa silindris"]
    },
    {
      id: "presbiopia",
      name: "Presbiopia",
      icd: "ICD-10 · H52.4 Presbyopia",
      maxScore: 12,
      weights: {
        'KUA03': 3, 'PEN14': 3,
        'ONS04': 2, 'PRE11': 2, 'PEN17': 2
      },
      pxFisik: ["Uji tajam penglihatan dekat kartu Jaeger pada jarak baca 33-40 cm"],
      pxPenunjang: ["Koreksi adisi lensa sferis positif (+) sesuai usia"]
    },
    {
      id: "hipoglikemi",
      name: "Hipoglikemi ringan",
      icd: "ICD-10 · E16.2 Hypoglycaemia, unspecified",
      maxScore: 22,
      weights: {
        'PEN24': 3, 'PEN25': 3, 'PEN23': 3,
        'KUA06': 2, 'PRE02': 2, 'RPD01': 2, 'PEN26': 2, 'PEN27': 2,
        'PRE09': 1, 'KEB01': 1, 'KEB03': 1
      },
      pxFisik: ["Tanda vital: evaluasi takikardia, diaphoresis (keringat dingin nyata)"],
      pxPenunjang: ["Pemeriksaan glukosa darah sewaktu (GDS) cito"]
    },
    {
      id: "anemia",
      name: "Anemia defisiensi besi",
      icd: "ICD-10 · D50 Iron deficiency anaemia",
      maxScore: 16,
      weights: {
        'PEN20': 3,
        'KUA06': 2, 'PEN19': 2, 'PEN22': 2, 'PEN28': 2, 'PEN21': 2,
        'RPD03': 1, 'RPD04': 1, 'KEB01': 1
      },
      pxFisik: ["Inspeksi konjungtiva anemis, telapak tangan pucat"],
      pxPenunjang: ["Darah perifer lengkap (Hb, indeks eritrosit MCV/MCH rendah)"]
    },
    {
      id: "insomnia",
      name: "Insomnia",
      icd: "ICD-10 · F51 Nonorganic sleep disorders",
      maxScore: 7,
      weights: {
        'KEB02': 3,
        'PRE04': 2,
        'RPD09': 1, 'KEB05': 1
      },
      pxFisik: ["Status mental dan penampilan umum (tanda kelelahan kronis)"],
      pxPenunjang: ["Kuesioner kualitas tidur (PSQI)"]
    },
    {
      id: "somatoform",
      name: "Gangguan somatoform",
      icd: "ICD-10 · F45 Somatoform disorders",
      maxScore: 5,
      isExclusion: true,
      weights: {
        'FRE05': 2, 'RPD09': 2,
        'PRE06': 1
      },
      pxFisik: ["Pemeriksaan fisik menyeluruh (dalam batas normal)"],
      pxPenunjang: ["Pemeriksaan penunjang dasar terarah menyingkirkan kelainan organik"]
    },
    {
      id: "influenza",
      name: "Influenza",
      icd: "ICD-10 · J11 Influenza, virus not identified",
      maxScore: 21,
      requiredCode: "PEN01",
      weights: {
        'PEN03': 3, 'PEN04': 3, 'PEN05': 3, 'PEN06': 3,
        'ONS01': 2, 'PEN01': 2, 'PEN19': 2, 'PEN02': 2,
        'KEL04': 1
      },
      pxFisik: ["Tanda vital: Suhu febris, rinoskopi mukosa hiperemis"],
      pxPenunjang: ["Darah perifer lengkap jika diperlukan"]
    },
    {
      id: "dengue",
      name: "Demam dengue / DHF",
      icd: "ICD-10 · A90 / A91 Dengue fever",
      maxScore: 30,
      requiredCode: "PEN01",
      weights: {
        'LOK07': 3, 'PEN31': 3,
        'INT03': 2, 'ONS01': 2, 'FRE04': 2, 'DUR04': 2, 'PEN01': 2, 'PEN03': 2, 'PEN05': 2, 'PEN06': 2, 'PEN07': 2, 'PEN08': 2, 'PEN02': 2,
        'KEL04': 1, 'KEB06': 1
      },
      pxFisik: ["Tanda vital: Demam tinggi mendadak, uji bendung (Rumple-Leede) positif"],
      pxPenunjang: ["Darah perifer lengkap serial (trombositopenia, hematokrit meningkat)"]
    },
    {
      id: "tifoid",
      name: "Demam tifoid",
      icd: "ICD-10 · A01.0 Typhoid fever",
      maxScore: 25,
      requiredCode: "PEN01",
      weights: {
        'DUR05': 3, 'PEN08': 3,
        'LOK03': 2, 'PEN01': 2, 'PEN03': 2, 'PEN07': 2, 'PEN09': 2, 'PEN10': 2, 'PEN32': 2, 'PEN02': 2,
        'KEL04': 1, 'KEB02': 1, 'KEB07': 1
      },
      pxFisik: ["Tanda vital: Demam bertingkat, coated tongue, distensi abdomen"],
      pxPenunjang: ["Tes TUBEX TF atau serologi Widal"]
    }
  ]
};