/* clinical-data.js — Matriks Basis Pengetahuan Sakit Kepala (PPK 144 FKTP) Berbasis Matriks Excel */
/* Kamus Kode Gejala Sesuai Opsi Jawaban Matriks Gejala Excel */
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
  "ONS03": "Didahului gejala aura / prodromal",
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
  // 1. Evaluasi Tanda Bahaya (Red Flags) & Triase
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
        priority: "danger",
        badge: "Red flag / Trauma",
        title: "Tanda Bahaya: Riwayat Benturan / Trauma Kepala (Gate Trauma)",
        desc: "Pasien memiliki riwayat benturan atau cedera kepala dalam beberapa hari terakhir. Pasien masuk jalur trauma kepala untuk evaluasi tanda fraktur basis cranii, peningkatan TIK, atau perdarahan intrakranial."
      };
    }

    if (isRF01 || isRF02 || isRF03 || isThunderclap) {
      var details = [];
      if (isRF01) details.push("Defisit neurologis fokal (kelemahan satu sisi/bicara pelo/wajah mencong)");
      if (isRF02) details.push("Penurunan kesadaran atau kejang");
      if (isRF03) details.push("Tanda rangsang meningeal (kaku kuduk disertai demam)");
      if (isThunderclap) details.push("Nyeri kepala intensitas terhebat yang mendadak (thunderclap headache)");

      return {
        isRedFlag: true,
        priority: "danger",
        badge: "Red flag / Gawat",
        title: "Tanda Bahaya: Terdeteksi Red Flag Neurologis Akut",
        desc: "Ditemukan tanda bahaya: " + details.join(', ') + ". Diindikasikan evaluasi segera dan stabilisasi/rujukan ke fasilitas gawat darurat."
      };
    }

    return {
      isRedFlag: false,
      priority: "neutral",
      badge: "Triase Terkendali",
      title: "Status Triase Terkendali",
      desc: "Tidak terdeteksi tanda bahaya trauma akut atau kegawatan sekunder mayor pada screening awal. Pemeriksaan dapat berjalan sesuai alur rawat jalan FKTP."
    };
  },

  // 2. Daftar 15 Diagnosis Banding Sesuai Matriks Gejala Excel (SKDI Level 4A)
  daftarDiagnosis: [
    {
      id: "tth",
      name: "Tension headache",
      icd: "ICD-10 · G44.2 Tension-type headache",
      jalur: "Tanpa demam",
      kriteriaCodes: ['LOK01', 'LOK04', 'LOK05', 'LOK06', 'KUA01', 'INT01', 'INT02', 'FRE02', 'FRE03', 'FRE04', 'DUR02', 'DUR04', 'PRE06', 'RPD09', 'KEB02', 'PEN22', 'PEN09', 'PEN32', 'PEN26'],
      pxFisik: [
        "Tanda vital dalam batas normal",
        "Palpasi perikranial: nyeri tekan / ketegangan otot leher, tengkuk, dan perikranial",
        "Pemeriksaan saraf kranialis dan motorik dalam batas normal (tidak ada defisit fokal)",
        "Tanda rangsang meningeal (kaku kuduk) negatif"
      ],
      pxPenunjang: [
        "Tidak diperlukan pemeriksaan penunjang laboratorium/radiologi rutin di FKTP"
      ]
    },
    {
      id: "migren",
      name: "Migren",
      icd: "ICD-10 · G43.9 Migraine, unspecified",
      jalur: "Tanpa demam",
      kriteriaCodes: ['LOK02', 'KUA02', 'INT02', 'INT03', 'ONS03', 'FRE05', 'DUR03', 'PRE01', 'PRE02', 'PRE03', 'PRE04', 'PRE05', 'PRE07', 'KEL01', 'RPD04', 'RPD05', 'KEB05', 'PEN19', 'PEN11', 'PEN07', 'PEN12', 'PEN13'],
      pxFisik: [
        "Evaluasi tanda vital dan status kesadaran umum",
        "Pemeriksaan nervus kranialis (menyingkirkan kelumpuhan saraf okulomotor)",
        "Pemeriksaan lapang pandang sederhana & tes rangsang meningeal (negatif)"
      ],
      pxPenunjang: [
        "Tidak diperlukan penunjang laboratorium rutin untuk kasus migren tipikal tanpa komplikasi"
      ]
    },
    {
      id: "hipertensi",
      name: "Hipertensi esensial",
      icd: "ICD-10 · I10 Essential (primary) hypertension",
      jalur: "Tanpa demam",
      kriteriaCodes: ['LOK05', 'PRE10', 'KEL02', 'RPD02', 'KEB04', 'KEB05', 'PEN19', 'PEN16', 'PEN26', 'PEN30', 'PEN29', 'PEN27'],
      pxFisik: [
        "Pengukuran tekanan darah berkala (duduk tenang minimal 5 menit, konfirmasi kedua lengan)",
        "Auskultasi jantung (murmur/gallop) dan paru",
        "Palpasi pulsasi arteri perifer dan evaluasi edema tungkai",
        "Funduskopi mata bila tersedia di FKTP untuk menilai retinopati hipertensi"
      ],
      pxPenunjang: [
        "Urinalisis lengkap (proteinuria, sedimen urin)",
        "Gula darah sewaktu / puasa",
        "Profil lipid darah (kolesterol total, LDL, HDL, trigliserida)",
        "Ureum, kreatinin serum, dan eGFR"
      ]
    },
    {
      id: "vertigo",
      name: "Vertigo (BPPV / Vestibular)",
      icd: "ICD-10 · R42 Dizziness and giddiness",
      jalur: "Tanpa demam",
      kriteriaCodes: ['KUA04', 'KUA05', 'FRE05', 'DUR01', 'ONS05', 'PRE06', 'PRE08', 'RPD02', 'RPD06', 'RPD07', 'RPD08', 'PEN25', 'PEN28', 'PEN07'],
      pxFisik: [
        "Uji nistagmus posisi: Manuver Dix-Hallpike",
        "Uji fungsi serebelar dan koordinasi: Tes Romberg, Romberg dipertajam, tandem gait, past pointing",
        "Pemeriksaan otoskopi telinga (membran timpani intact/ada perforasi/serumen)"
      ],
      pxPenunjang: [
        "Tes fungsi pendengaran sederhana (penala Rinne, Weber, Schwabach) di FKTP"
      ]
    },
    {
      id: "hipermetropia",
      name: "Hipermetropia",
      icd: "ICD-10 · H52.0 Hypermetropia",
      jalur: "Tanpa demam",
      kriteriaCodes: ['LOK03', 'KUA03', 'ONS04', 'PRE11', 'RPD06', 'PEN11', 'PEN14', 'PEN17'],
      pxFisik: [
        "Pemeriksaan visus jauh dan dekat dengan kartu Snellen / Jaeger",
        "Pemeriksaan segmen anterior bola mata dengan senter loupe"
      ],
      pxPenunjang: [
        "Uji koreksi refraksi subjektif menggunakan lensa sferis positif (+)"
      ]
    },
    {
      id: "miopia",
      name: "Miopia",
      icd: "ICD-10 · H52.1 Myopia",
      jalur: "Tanpa demam",
      kriteriaCodes: ['KUA03', 'ONS04', 'PRE11', 'KEL03', 'PEN15', 'PEN17', 'PEN18'],
      pxFisik: [
        "Pemeriksaan tajam penglihatan (visus) monokular dan binokular kartu Snellen",
        "Uji pinhole: visus membaik mengonfirmasi kelainan refraksi"
      ],
      pxPenunjang: [
        "Uji koreksi refraksi dengan lensa sferis negatif (-) terkecil yang memberikan visus terbaik"
      ]
    },
    {
      id: "astigmatisme",
      name: "Astigmatisme",
      icd: "ICD-10 · H52.2 Astigmatism",
      jalur: "Tanpa demam",
      kriteriaCodes: ['KUA03', 'ONS04', 'PRE11', 'PEN16', 'PEN18'],
      pxFisik: [
        "Pemeriksaan visus kartu Snellen",
        "Tes uji jam astigmatisme (astigmatic dial test)"
      ],
      pxPenunjang: [
        "Koreksi refraksi lensa silindris (plus/minus) dengan penentuan aksis"
      ]
    },
    {
      id: "presbiopia",
      name: "Presbiopia",
      icd: "ICD-10 · H52.4 Presbyopia",
      jalur: "Tanpa demam",
      kriteriaCodes: ['KUA03', 'ONS04', 'PRE11', 'PEN14', 'PEN17'],
      pxFisik: [
        "Uji tajam penglihatan dekat menggunakan kartu Jaeger pada jarak baca 33-40 cm",
        "Pemeriksaan refraksi jauh dasar"
      ],
      pxPenunjang: [
        "Koreksi adisi lensa sferis positif (+) sesuai kelompok usia (misal +1.00D s/d +3.00D)"
      ]
    },
    {
      id: "hipoglikemi",
      name: "Hipoglikemi ringan",
      icd: "ICD-10 · E16.2 Hypoglycaemia, unspecified",
      jalur: "Tanpa demam",
      kriteriaCodes: ['KUA06', 'PRE02', 'PRE09', 'RPD01', 'KEB01', 'KEB03', 'PEN24', 'PEN25', 'PEN26', 'PEN23', 'PEN27'],
      pxFisik: [
        "Tanda vital: evaluasi takikardia, diaphoresis (keringat dingin yang nyata)",
        "Pemeriksaan kesadaran dan tremor postural pada ekstremitas atas"
      ],
      pxPenunjang: [
        "Pemeriksaan glukosa darah sewaktu (GDS) menggunakan glukometer cito (&lt; 70 mg/dL)"
      ]
    },
    {
      id: "anemia",
      name: "Anemia defisiensi besi",
      icd: "ICD-10 · D50 Iron deficiency anaemia",
      jalur: "Tanpa demam",
      kriteriaCodes: ['KUA06', 'RPD03', 'RPD04', 'KEB01', 'PEN19', 'PEN22', 'PEN28', 'PEN20', 'PEN21'],
      pxFisik: [
        "Inspeksi konjungtiva anemis, telapak tangan pucat, atrofi papil lidah, koilonikia (kuku sendok)",
        "Auskultasi murmur sistolik fungsional / takikardia kompensatorik"
      ],
      pxPenunjang: [
        "Darah perifer lengkap (Hemoglobin, Hematokrit, Indeks eritrosit: MCV, MCH, MCHC rendah/mikrositik hipokromik)",
        "Pemeriksaan apusan darah tepi (bila tersedia di FKTP)"
      ]
    },
    {
      id: "insomnia",
      name: "Insomnia",
      icd: "ICD-10 · F51 Nonorganic sleep disorders",
      jalur: "Tanpa demam",
      kriteriaCodes: ['PRE04', 'RPD09', 'KEB02', 'KEB05'],
      pxFisik: [
        "Status mental dan penampilan umum (tanda kelelahan kronis, lingkaran hitam bawah mata)",
        "Pemeriksaan fisik umum menyingkirkan etiologi organik/gangguan pernapasan obstruktif tidur"
      ],
      pxPenunjang: [
        "Pengisian kuesioner skala tidur (misal Pittsburgh Sleep Quality Index / PSQI)"
      ]
    },
    {
      id: "somatoform",
      name: "Gangguan somatoform",
      icd: "ICD-10 · F45 Somatoform disorders",
      jalur: "Tanpa demam",
      kriteriaCodes: ['FRE05', 'PRE06', 'RPD09'],
      pxFisik: [
        "Pemeriksaan fisik menyeluruh terfokus pada organ yang dikeluhkan (seluruh temuan dalam batas normal)",
        "Eksplorasi status psikologis dan stresor kehidupan"
      ],
      pxPenunjang: [
        "Pemeriksaan penunjang terarah dasar untuk menyingkirkan kelainan organik"
      ]
    },
    {
      id: "influenza",
      name: "Influenza",
      icd: "ICD-10 · J11 Influenza, virus not identified",
      jalur: "Dengan demam",
      kriteriaCodes: ['ONS01', 'KEL04', 'PEN01', 'PEN19', 'PEN03', 'PEN04', 'PEN05', 'PEN06', 'PEN02'],
      pxFisik: [
        "Tanda vital: Suhu febris (&gt; 37.8°C)",
        "Rinoskopi anterior: Mukosa konka hiperemis, sekret serosa/mukoid",
        "Faringoskopi: Faring hiperemis ringan tanpa eksudat pseudomembran",
        "Auskultasi paru: Vesikuler normal bilateral tanpa suara napas tambahan"
      ],
      pxPenunjang: [
        "Darah perifer lengkap jika diperlukan (leukosit normal atau leukopenia relatif)"
      ]
    },
    {
      id: "dengue",
      name: "Demam dengue / DHF",
      icd: "ICD-10 · A90 / A91 Dengue fever",
      jalur: "Dengan demam",
      kriteriaCodes: ['LOK07', 'INT03', 'ONS01', 'FRE04', 'DUR04', 'KEL04', 'KEB06', 'PEN01', 'PEN03', 'PEN05', 'PEN06', 'PEN07', 'PEN08', 'PEN31', 'PEN02'],
      pxFisik: [
        "Tanda vital: Suhu febris tinggi mendadak, evaluasi tekanan nadi dan tanda presyok",
        "Uji bendung / Rumple-Leede test (positif bila ≥ 10 petekie per 1 inci persegi)",
        "Inspeksi ruam petekie pada ekstremitas atau perdarahan spontan (epistaksis/perdarahan gusi)",
        "Palpasi abdomen: pembesaran hati (hepatomegali) dan nyeri tekan kuadran kanan atas"
      ],
      pxPenunjang: [
        "Darah perifer lengkap serial: Trombositopenia (&lt; 100.000/µL), hemokonsentrasi (peningkatan hematokrit ≥ 20%), leukopenia",
        "Tes serologi cepat: NS1 antigen (hari 1-3) atau IgM/IgG anti-dengue"
      ]
    },
    {
      id: "tifoid",
      name: "Demam tifoid",
      icd: "ICD-10 · A01.0 Typhoid fever",
      jalur: "Dengan demam",
      kriteriaCodes: ['LOK03', 'DUR05', 'KEL04', 'KEB02', 'KEB07', 'PEN01', 'PEN03', 'PEN07', 'PEN08', 'PEN09', 'PEN10', 'PEN32', 'PEN02'],
      pxFisik: [
        "Tanda vital: Suhu febris bertingkat (*step-ladder*) terutama sore/malam hari, bradikardia relatif",
        "Pemeriksaan mulut: *Coated tongue* / tifoid lidah (kotor di tengah, tepi hiperemis, tremor)",
        "Pemeriksaan abdomen: Distensi meteorismus, nyeri tekan abdomen, splenomegali/hepatomegali"
      ],
      pxPenunjang: [
        "Tes serologi TUBEX TF atau Widal",
        "Darah perifer lengkap (leukopenia relatif, aneosinofilia, limfositosis relatif)"
      ]
    }
  ]
};