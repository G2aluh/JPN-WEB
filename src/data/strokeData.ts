export interface StrokeStep {
  strokeNumber: number;
  d: string;
  startPoint: { x: number; y: number };
  instruction: string;
}

export interface CharacterStrokeInfo {
  character: string;
  romaji: string;
  type: "hiragana" | "katakana";
  strokeCount: number;
  strokes: StrokeStep[];
  tips?: string;
}

// Complete stroke order definitions for Hiragana and Katakana
export const KANA_STROKE_DATA: Record<string, CharacterStrokeInfo> = {
  // HIRAGANA BASIC
  "あ": {
    character: "あ",
    romaji: "a",
    type: "hiragana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 25 35 Q 50 32 75 35", startPoint: { x: 25, y: 35 }, instruction: "Garis horizontal mendatar dari kiri ke kanan." },
      { strokeNumber: 2, d: "M 50 18 Q 48 55 45 85", startPoint: { x: 50, y: 18 }, instruction: "Garis vertikal memotong sedikit melengkung ke kiri." },
      { strokeNumber: 3, d: "M 62 42 C 30 42 20 75 45 82 C 75 88 85 55 58 55 C 45 55 35 68 40 78", startPoint: { x: 62, y: 42 }, instruction: "Lengkungan melingkar lebar memutar ke bawah dan ke kanan." }
    ],
    tips: "Pastikan garis ke-3 membentuk ikatan melingkar yang seimbang di sisi kanan bawah."
  },
  "い": {
    character: "い",
    romaji: "i",
    type: "hiragana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 32 25 Q 28 55 35 75 Q 38 78 45 70", startPoint: { x: 32, y: 25 }, instruction: "Garis lengkung vertikal di kiri dengan sentakan kecil (*hane*) di ujungnya." },
      { strokeNumber: 2, d: "M 68 32 Q 65 52 62 65", startPoint: { x: 68, y: 32 }, instruction: "Garis pendek melengkung di kanan, lebih pendek dari garis kiri." }
    ],
    tips: "Garis kiri sedikit lebih panjang dibanding garis kanan."
  },
  "う": {
    character: "う",
    romaji: "u",
    type: "hiragana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 42 20 Q 55 22 60 28", startPoint: { x: 42, y: 20 }, instruction: "Garis miring pendek di bagian atas." },
      { strokeNumber: 2, d: "M 35 42 Q 72 38 72 60 Q 72 82 35 85", startPoint: { x: 35, y: 42 }, instruction: "Lengkungan besar melingkar ke kanan lalu turun ke bawah." }
    ]
  },
  "え": {
    character: "え",
    romaji: "e",
    type: "hiragana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 45 18 Q 55 20 60 25", startPoint: { x: 45, y: 18 }, instruction: "Garis miring pendek di bagian atas." },
      { strokeNumber: 2, d: "M 30 42 L 68 42 L 32 72 Q 55 60 70 70 Q 75 75 68 82", startPoint: { x: 30, y: 42 }, instruction: "Garis zigs-zag horizontal, turun miring, lalu gelombang lengkung ke kanan." }
    ]
  },
  "お": {
    character: "お",
    romaji: "o",
    type: "hiragana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 25 35 Q 50 33 65 35", startPoint: { x: 25, y: 35 }, instruction: "Garis horizontal pendek." },
      { strokeNumber: 2, d: "M 45 18 L 45 60 C 45 78 30 82 25 72 C 20 62 38 52 58 60 C 72 65 75 80 62 88", startPoint: { x: 45, y: 18 }, instruction: "Garis vertikal menembus, membuat simpul kecil, melingkar ke kanan." },
      { strokeNumber: 3, d: "M 70 28 Q 78 35 80 42", startPoint: { x: 70, y: 28 }, instruction: "Titik/garis kecil di kanan atas." }
    ]
  },
  "か": {
    character: "か",
    romaji: "ka",
    type: "hiragana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 25 35 L 55 35 Q 65 35 62 55 Q 58 75 52 82 M 62 55 L 55 58", startPoint: { x: 25, y: 35 }, instruction: "Garis mendatar lalu menekuk melengkung ke bawah dengan hane." },
      { strokeNumber: 2, d: "M 42 20 Q 38 50 32 78", startPoint: { x: 42, y: 20 }, instruction: "Garis melengkung memotong garis pertama di sebelah kiri." },
      { strokeNumber: 3, d: "M 70 28 Q 78 38 82 45", startPoint: { x: 70, y: 28 }, instruction: "Garis miring kecil di sebelah kanan atas." }
    ]
  },
  "き": {
    character: "き",
    romaji: "ki",
    type: "hiragana",
    strokeCount: 4,
    strokes: [
      { strokeNumber: 1, d: "M 30 32 Q 55 28 70 30", startPoint: { x: 30, y: 32 }, instruction: "Garis horizontal miring ke atas pertama." },
      { strokeNumber: 2, d: "M 28 48 Q 55 44 72 46", startPoint: { x: 28, y: 48 }, instruction: "Garis horizontal sejajar kedua di bawahnya." },
      { strokeNumber: 3, d: "M 55 18 L 45 62 Q 43 68 50 68", startPoint: { x: 55, y: 18 }, instruction: "Garis miring memotong kedua garis horizontal dengan hentakan kecil." },
      { strokeNumber: 4, d: "M 35 72 Q 50 85 68 78", startPoint: { x: 35, y: 72 }, instruction: "Lengkungan terbuka terpisah di bagian bawah." }
    ]
  },
  "く": {
    character: "く",
    romaji: "ku",
    type: "hiragana",
    strokeCount: 1,
    strokes: [
      { strokeNumber: 1, d: "M 65 25 L 30 50 L 68 78", startPoint: { x: 65, y: 25 }, instruction: "Satu garis sudut menyerupai kurung siku buka mendatar." }
    ]
  },
  "け": {
    character: "け",
    romaji: "ke",
    type: "hiragana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 30 22 Q 28 55 30 78 Q 33 82 40 75", startPoint: { x: 30, y: 22 }, instruction: "Garis vertikal kiri melengkung dengan hentakan hane." },
      { strokeNumber: 2, d: "M 48 38 L 78 35", startPoint: { x: 48, y: 38 }, instruction: "Garis horizontal di bagian tengah kanan." },
      { strokeNumber: 3, d: "M 62 18 Q 62 50 60 82", startPoint: { x: 62, y: 18 }, instruction: "Garis vertikal kanan memotong garis horizontal." }
    ]
  },
  "こ": {
    character: "こ",
    romaji: "ko",
    type: "hiragana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 32 30 Q 55 26 68 28 Q 72 32 68 36", startPoint: { x: 32, y: 30 }, instruction: "Garis horizontal atas agak melengkung." },
      { strokeNumber: 2, d: "M 30 70 Q 50 74 70 68", startPoint: { x: 30, y: 70 }, instruction: "Garis horizontal bawah melengkung menopang di bawah." }
    ]
  },
  "さ": {
    character: "さ",
    romaji: "sa",
    type: "hiragana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 28 35 Q 55 30 72 32", startPoint: { x: 28, y: 35 }, instruction: "Garis horizontal miring ke atas." },
      { strokeNumber: 2, d: "M 55 18 L 45 60 Q 42 66 48 66", startPoint: { x: 55, y: 18 }, instruction: "Garis miring memotong dengan hentakan hane." },
      { strokeNumber: 3, d: "M 35 70 Q 52 85 70 76", startPoint: { x: 35, y: 70 }, instruction: "Lengkungan terbuka di bagian bawah." }
    ]
  },
  "し": {
    character: "し",
    romaji: "shi",
    type: "hiragana",
    strokeCount: 1,
    strokes: [
      { strokeNumber: 1, d: "M 42 20 L 42 65 Q 42 85 68 80 Q 75 75 78 68", startPoint: { x: 42, y: 20 }, instruction: "Garis vertikal turun lalu melengkung naik ke kanan seperti pancingan ikan." }
    ]
  },
  "す": {
    character: "す",
    romaji: "su",
    type: "hiragana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 25 32 L 75 30", startPoint: { x: 25, y: 32 }, instruction: "Garis horizontal panjang." },
      { strokeNumber: 2, d: "M 52 18 L 52 48 C 52 65 32 65 32 52 C 32 40 52 42 52 70 Q 52 82 45 88", startPoint: { x: 52, y: 18 }, instruction: "Garis tegak memotong, membuat jerat simpul di tengah, meluncur ke bawah." }
    ]
  },
  "せ": {
    character: "せ",
    romaji: "se",
    type: "hiragana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 22 40 L 78 35", startPoint: { x: 22, y: 40 }, instruction: "Garis horizontal panjang miring." },
      { strokeNumber: 2, d: "M 65 22 L 65 65 Q 65 72 58 72 L 52 72", startPoint: { x: 65, y: 22 }, instruction: "Garis kanan turun menekuk ke kiri." },
      { strokeNumber: 3, d: "M 40 20 Q 38 55 35 78 Q 38 82 48 78", startPoint: { x: 40, y: 20 }, instruction: "Garis kiri memotong dengan hentakan hane." }
    ]
  },
  "そ": {
    character: "そ",
    romaji: "so",
    type: "hiragana",
    strokeCount: 1,
    strokes: [
      { strokeNumber: 1, d: "M 32 25 L 68 25 L 35 48 L 65 48 Q 28 65 42 82 Q 58 88 72 78", startPoint: { x: 32, y: 25 }, instruction: "Satu garis zigs-zag sambung bergaya Z yang melengkung melingkar di bawah." }
    ]
  },
  "た": {
    character: "た",
    romaji: "ta",
    type: "hiragana",
    strokeCount: 4,
    strokes: [
      { strokeNumber: 1, d: "M 22 35 L 52 32", startPoint: { x: 22, y: 35 }, instruction: "Garis horizontal kiri atas." },
      { strokeNumber: 2, d: "M 38 20 Q 35 50 30 78", startPoint: { x: 38, y: 20 }, instruction: "Garis miring memotong garis pertama." },
      { strokeNumber: 3, d: "M 58 40 Q 72 38 78 40", startPoint: { x: 58, y: 40 }, instruction: "Garis mendatar kecil kanan atas (ko kecil)." },
      { strokeNumber: 4, d: "M 55 65 Q 70 72 75 66", startPoint: { x: 55, y: 65 }, instruction: "Garis lengkung kecil kanan bawah." }
    ]
  },
  "ち": {
    character: "ち",
    romaji: "chi",
    type: "hiragana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 25 32 L 72 28", startPoint: { x: 25, y: 32 }, instruction: "Garis horizontal." },
      { strokeNumber: 2, d: "M 48 18 L 48 45 Q 75 42 75 65 Q 75 85 40 85 Q 32 85 28 80", startPoint: { x: 48, y: 18 }, instruction: "Garis miring memotong lalu melengkung bundar besar di bagian bawah seperti angka 5." }
    ]
  },
  "つ": {
    character: "つ",
    romaji: "tsu",
    type: "hiragana",
    strokeCount: 1,
    strokes: [
      { strokeNumber: 1, d: "M 28 35 Q 78 20 78 52 Q 78 78 30 78", startPoint: { x: 28, y: 35 }, instruction: "Satu lengkungan memutar besar mirip gelombang ombak melengkung." }
    ]
  },
  "て": {
    character: "て",
    romaji: "te",
    type: "hiragana",
    strokeCount: 1,
    strokes: [
      { strokeNumber: 1, d: "M 28 30 L 72 28 Q 30 55 42 82", startPoint: { x: 28, y: 30 }, instruction: "Garis mendatar lalu membelok melengkung setengah lingkaran ke kanan bawah." }
    ]
  },
  "と": {
    character: "と",
    romaji: "to",
    type: "hiragana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 38 22 L 52 48", startPoint: { x: 38, y: 22 }, instruction: "Garis miring pendek dari atas ke kanan bawah." },
      { strokeNumber: 2, d: "M 68 32 Q 35 50 48 82 Q 58 88 72 80", startPoint: { x: 68, y: 32 }, instruction: "Lengkungan busur memeluk dari kanan ke bawah." }
    ]
  },
  "な": {
    character: "な",
    romaji: "na",
    type: "hiragana",
    strokeCount: 4,
    strokes: [
      { strokeNumber: 1, d: "M 22 32 L 48 30", startPoint: { x: 22, y: 32 }, instruction: "Garis horizontal kiri." },
      { strokeNumber: 2, d: "M 38 20 L 30 78", startPoint: { x: 38, y: 20 }, instruction: "Garis miring memotong." },
      { strokeNumber: 3, d: "M 68 28 L 62 38", startPoint: { x: 68, y: 28 }, instruction: "Titik miring kecil kanan atas." },
      { strokeNumber: 4, d: "M 58 50 L 58 65 C 58 78 42 78 42 68 C 42 58 65 60 70 78", startPoint: { x: 58, y: 50 }, instruction: "Jerat bundar memutar di kanan bawah." }
    ]
  },
  "に": {
    character: "に",
    romaji: "ni",
    type: "hiragana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 30 22 Q 28 55 30 78 Q 33 82 40 75", startPoint: { x: 30, y: 22 }, instruction: "Garis vertikal kiri dengan hane." },
      { strokeNumber: 2, d: "M 52 35 Q 70 32 78 34", startPoint: { x: 52, y: 35 }, instruction: "Garis horizontal atas kanan." },
      { strokeNumber: 3, d: "M 50 65 Q 68 68 78 62", startPoint: { x: 50, y: 65 }, instruction: "Garis horizontal bawah kanan." }
    ]
  },
  "ぬ": {
    character: "ぬ",
    romaji: "nu",
    type: "hiragana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 38 22 L 30 75", startPoint: { x: 38, y: 22 }, instruction: "Garis miring dari atas kiri ke bawah." },
      { strokeNumber: 2, d: "M 25 38 C 75 30 75 80 50 80 C 35 80 30 65 45 55 C 60 48 80 65 72 82", startPoint: { x: 25, y: 38 }, instruction: "Garis meliuk membuat lingkar besar lalu diakhiri ekor jerat kecil di kanan." }
    ]
  },
  "ね": {
    character: "ね",
    romaji: "ne",
    type: "hiragana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 32 20 L 32 82", startPoint: { x: 32, y: 20 }, instruction: "Garis vertikal lurus kiri." },
      { strokeNumber: 2, d: "M 22 38 L 68 35 L 32 68 Q 65 52 68 68 C 70 78 58 82 58 75 C 58 68 72 70 75 82", startPoint: { x: 22, y: 38 }, instruction: "Zigs-zag kanan menyambung ke jerat ekor bundar kecil." }
    ]
  },
  "の": {
    character: "の",
    romaji: "no",
    type: "hiragana",
    strokeCount: 1,
    strokes: [
      { strokeNumber: 1, d: "M 52 30 L 35 60 C 20 80 55 85 72 68 C 85 50 68 25 45 35 C 30 42 25 60 38 72", startPoint: { x: 52, y: 30 }, instruction: "Satu gerakan miring turun lalu melingkar membentuk spiral lonjong." }
    ]
  },
  "は": {
    character: "は",
    romaji: "ha",
    type: "hiragana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 28 22 Q 26 55 28 78 Q 31 82 38 75", startPoint: { x: 28, y: 22 }, instruction: "Garis vertikal kiri dengan hane." },
      { strokeNumber: 2, d: "M 48 35 L 78 32", startPoint: { x: 48, y: 35 }, instruction: "Garis mendatar di kanan." },
      { strokeNumber: 3, d: "M 62 20 L 62 55 C 62 72 45 75 45 65 C 45 55 65 58 72 75", startPoint: { x: 62, y: 20 }, instruction: "Garis tegak kanan membuat jerat bundar melingkar di bawah." }
    ]
  },
  "ひ": {
    character: "ひ",
    romaji: "hi",
    type: "hiragana",
    strokeCount: 1,
    strokes: [
      { strokeNumber: 1, d: "M 25 35 L 42 30 Q 30 65 50 68 Q 70 65 58 30 L 75 35", startPoint: { x: 25, y: 35 }, instruction: "Garis mendatar, melengkung melukis mangkuk senyum di tengah, diakhiri garis miring kanan." }
    ]
  },
  "ふ": {
    character: "ふ",
    romaji: "fu",
    type: "hiragana",
    strokeCount: 4,
    strokes: [
      { strokeNumber: 1, d: "M 48 18 Q 55 22 58 28", startPoint: { x: 48, y: 18 }, instruction: "Titik miring teratas." },
      { strokeNumber: 2, d: "M 48 38 C 65 38 52 65 42 75 Q 38 80 45 82", startPoint: { x: 48, y: 38 }, instruction: "Lengkungan hidung utama di tengah." },
      { strokeNumber: 3, d: "M 25 50 Q 22 62 28 68", startPoint: { x: 25, y: 50 }, instruction: "Titik lengkung kiri." },
      { strokeNumber: 4, d: "M 72 50 Q 78 60 75 68", startPoint: { x: 72, y: 50 }, instruction: "Titik lengkung kanan." }
    ]
  },
  "へ": {
    character: "へ",
    romaji: "he",
    type: "hiragana",
    strokeCount: 1,
    strokes: [
      { strokeNumber: 1, d: "M 25 60 L 48 30 L 78 62", startPoint: { x: 25, y: 60 }, instruction: "Satu garis atap miring naik dari kiri lalu meluncur turun ke kanan." }
    ]
  },
  "ほ": {
    character: "ほ",
    romaji: "ho",
    type: "hiragana",
    strokeCount: 4,
    strokes: [
      { strokeNumber: 1, d: "M 28 22 Q 26 55 28 78 Q 31 82 38 75", startPoint: { x: 28, y: 22 }, instruction: "Garis vertikal kiri dengan hane." },
      { strokeNumber: 2, d: "M 48 32 L 78 30", startPoint: { x: 48, y: 32 }, instruction: "Garis horizontal atas kanan." },
      { strokeNumber: 3, d: "M 48 48 L 78 45", startPoint: { x: 48, y: 48 }, instruction: "Garis horizontal kedua di bawahnya." },
      { strokeNumber: 4, d: "M 62 20 L 62 58 C 62 75 45 78 45 68 C 45 58 65 60 72 78", startPoint: { x: 62, y: 20 }, instruction: "Garis vertikal kanan memotong dengan jerat melingkar di bawah." }
    ]
  },
  "ま": {
    character: "ま",
    romaji: "ma",
    type: "hiragana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 30 32 L 70 30", startPoint: { x: 30, y: 32 }, instruction: "Garis mendatar atas." },
      { strokeNumber: 2, d: "M 28 48 L 72 45", startPoint: { x: 28, y: 48 }, instruction: "Garis mendatar kedua di bawahnya." },
      { strokeNumber: 3, d: "M 52 18 L 52 58 C 52 75 35 78 35 68 C 35 58 55 60 68 78", startPoint: { x: 52, y: 18 }, instruction: "Garis tegak memotong kedua garis dengan jerat melingkar di bawah." }
    ]
  },
  "み": {
    character: "み",
    romaji: "mi",
    type: "hiragana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 28 30 L 62 28 C 35 60 25 72 40 72 C 55 72 78 50 82 50", startPoint: { x: 28, y: 30 }, instruction: "Garis mendatar menekuk memutar jerat lalu menyapu miring ke kanan bawah." },
      { strokeNumber: 2, d: "M 68 22 Q 62 55 58 82", startPoint: { x: 68, y: 22 }, instruction: "Garis miring kanan memotong ekor meliuk." }
    ]
  },
  "む": {
    character: "む",
    romaji: "mu",
    type: "hiragana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 22 35 L 52 32", startPoint: { x: 22, y: 35 }, instruction: "Garis mendatar pendek di kiri." },
      { strokeNumber: 2, d: "M 38 20 L 38 55 C 38 72 22 72 22 62 C 22 52 48 50 68 62 Q 78 68 75 80", startPoint: { x: 38, y: 20 }, instruction: "Garis vertikal memotong, membuat jerat bawah, meluncur naik ke kanan." },
      { strokeNumber: 3, d: "M 70 28 Q 78 38 80 45", startPoint: { x: 70, y: 28 }, instruction: "Titik miring di kanan atas." }
    ]
  },
  "め": {
    character: "め",
    romaji: "me",
    type: "hiragana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 42 22 L 30 75", startPoint: { x: 42, y: 22 }, instruction: "Garis miring dari atas ke bawah kiri." },
      { strokeNumber: 2, d: "M 25 38 C 75 30 78 80 50 80 C 35 80 30 65 48 55 Q 68 45 78 68", startPoint: { x: 25, y: 38 }, instruction: "Garis melengkung besar memutar melingkar tanpa jerat akhir." }
    ]
  },
  "も": {
    character: "も",
    romaji: "mo",
    type: "hiragana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 48 20 L 48 65 Q 48 85 72 80 Q 78 78 78 70", startPoint: { x: 48, y: 20 }, instruction: "Garis pancingan utama dari atas turun melengkung ke kanan." },
      { strokeNumber: 2, d: "M 30 38 L 68 35", startPoint: { x: 30, y: 38 }, instruction: "Garis horizontal pertama memotong di atas." },
      { strokeNumber: 3, d: "M 28 52 L 70 48", startPoint: { x: 28, y: 52 }, instruction: "Garis horizontal kedua memotong di tengah." }
    ]
  },
  "や": {
    character: "や",
    romaji: "ya",
    type: "hiragana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 25 40 Q 60 28 68 35 Q 75 42 62 55 Q 52 65 42 60", startPoint: { x: 25, y: 40 }, instruction: "Garis melengkung membuat busur kait atas dengan hane." },
      { strokeNumber: 2, d: "M 45 20 Q 42 28 40 32", startPoint: { x: 45, y: 20 }, instruction: "Coretan garis miring kecil di atas busur." },
      { strokeNumber: 3, d: "M 32 25 Q 30 55 28 82", startPoint: { x: 32, y: 25 }, instruction: "Garis miring panjang memotong di sebelah kiri." }
    ]
  },
  "ゆ": {
    character: "ゆ",
    romaji: "yu",
    type: "hiragana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 35 25 L 35 55 C 35 75 60 75 62 50 L 62 40", startPoint: { x: 35, y: 25 }, instruction: "Garis vertikal melengkung memutar ke bawah dan naik ke atas." },
      { strokeNumber: 2, d: "M 55 18 Q 52 50 48 82", startPoint: { x: 55, y: 18 }, instruction: "Garis vertikal tegak memotong bagian tengah." }
    ]
  },
  "よ": {
    character: "よ",
    romaji: "yo",
    type: "hiragana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 30 32 L 62 30", startPoint: { x: 30, y: 32 }, instruction: "Garis horizontal pendek." },
      { strokeNumber: 2, d: "M 52 18 L 52 55 C 52 75 32 75 32 62 C 32 50 55 52 70 72", startPoint: { x: 52, y: 18 }, instruction: "Garis vertikal memotong dengan jerat bundar melingkar di bawah." }
    ]
  },
  "ら": {
    character: "ら",
    romaji: "ra",
    type: "hiragana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 42 18 Q 55 20 58 25", startPoint: { x: 42, y: 18 }, instruction: "Garis miring pendek atas." },
      { strokeNumber: 2, d: "M 35 38 L 48 38 Q 72 38 72 60 Q 72 82 32 82", startPoint: { x: 35, y: 38 }, instruction: "Garis vertikal pendek lalu busur melingkar besar ke kanan bawah." }
    ]
  },
  "り": {
    character: "り",
    romaji: "ri",
    type: "hiragana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 35 25 Q 32 45 35 55 Q 38 60 42 52", startPoint: { x: 35, y: 25 }, instruction: "Garis kiri pendek dengan hane." },
      { strokeNumber: 2, d: "M 65 20 Q 62 55 58 82", startPoint: { x: 65, y: 20 }, instruction: "Garis kanan panjang melengkung meluncur ke bawah." }
    ]
  },
  "る": {
    character: "る",
    romaji: "ru",
    type: "hiragana",
    strokeCount: 1,
    strokes: [
      { strokeNumber: 1, d: "M 30 28 L 68 28 L 32 60 Q 68 45 70 65 C 72 82 52 82 52 75 C 52 68 65 70 70 80", startPoint: { x: 30, y: 28 }, instruction: "Zigs-zag mendatar lalu busur melingkar diakhiri jerat bundar kecil." }
    ]
  },
  "れ": {
    character: "れ",
    romaji: "re",
    type: "hiragana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 32 20 L 32 82", startPoint: { x: 32, y: 20 }, instruction: "Garis vertikal lurus kiri." },
      { strokeNumber: 2, d: "M 22 38 L 68 35 L 32 68 Q 65 52 70 65 Q 75 75 80 72", startPoint: { x: 22, y: 38 }, instruction: "Zigs-zag kanan lalu meliuk mencuat ke kanan luar." }
    ]
  },
  "ろ": {
    character: "ろ",
    romaji: "ro",
    type: "hiragana",
    strokeCount: 1,
    strokes: [
      { strokeNumber: 1, d: "M 30 28 L 68 28 L 32 60 Q 68 45 70 65 Q 72 85 35 82", startPoint: { x: 30, y: 28 }, instruction: "Sama seperti る tetapi terbuka tanpa jerat lingkar di bawah." }
    ]
  },
  "わ": {
    character: "わ",
    romaji: "wa",
    type: "hiragana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 32 20 L 32 82", startPoint: { x: 32, y: 20 }, instruction: "Garis vertikal lurus kiri." },
      { strokeNumber: 2, d: "M 22 38 L 68 35 L 32 68 Q 68 50 70 68 Q 72 85 35 82", startPoint: { x: 22, y: 38 }, instruction: "Zigs-zag menyambung ke busur lengkung bundar terbuka." }
    ]
  },
  "を": {
    character: "を",
    romaji: "wo",
    type: "hiragana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 25 32 L 68 30", startPoint: { x: 25, y: 32 }, instruction: "Garis horizontal atas." },
      { strokeNumber: 2, d: "M 48 18 L 35 50 L 60 48 Q 42 62 38 68", startPoint: { x: 48, y: 18 }, instruction: "Garis miring memotong menekuk horizontal." },
      { strokeNumber: 3, d: "M 32 65 Q 65 55 65 75 Q 65 85 38 82", startPoint: { x: 32, y: 65 }, instruction: "Busur lingkaran bawah melingkar." }
    ]
  },
  "ん": {
    character: "ん",
    romaji: "n",
    type: "hiragana",
    strokeCount: 1,
    strokes: [
      { strokeNumber: 1, d: "M 38 25 L 30 75 Q 45 40 60 45 Q 75 50 78 80", startPoint: { x: 38, y: 25 }, instruction: "Satu gerakan miring turun lalu meliuk halus naik dan meluncur ke kanan seperti huruf n latin bergelombang." }
    ]
  },

  // KATAKANA BASIC
  "ア": {
    character: "ア",
    romaji: "a",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 25 30 L 72 30 L 45 55", startPoint: { x: 25, y: 30 }, instruction: "Garis mendatar lalu membelok miring ke kiri bawah." },
      { strokeNumber: 2, d: "M 58 35 Q 52 65 30 82", startPoint: { x: 58, y: 35 }, instruction: "Garis lengkung miring panjang menyapu dari atas kanan ke kiri bawah." }
    ]
  },
  "イ": {
    character: "イ",
    romaji: "i",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 55 20 Q 40 45 28 68", startPoint: { x: 55, y: 20 }, instruction: "Garis miring menyapu dari atas kanan ke bawah kiri." },
      { strokeNumber: 2, d: "M 45 42 L 45 82", startPoint: { x: 45, y: 42 }, instruction: "Garis vertikal lurus ke bawah menopang dari tengah." }
    ]
  },
  "ウ": {
    character: "ウ",
    romaji: "u",
    type: "katakana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 50 18 L 50 28", startPoint: { x: 50, y: 18 }, instruction: "Titik vertikal kecil paling atas." },
      { strokeNumber: 2, d: "M 28 35 L 28 48", startPoint: { x: 28, y: 35 }, instruction: "Garis tegak kecil di kiri." },
      { strokeNumber: 3, d: "M 28 35 L 75 35 Q 65 65 35 82", startPoint: { x: 28, y: 35 }, instruction: "Garis horizontal atas menekuk menyapu miring ke bawah kiri." }
    ]
  },
  "エ": {
    character: "エ",
    romaji: "e",
    type: "katakana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 30 25 L 70 25", startPoint: { x: 30, y: 25 }, instruction: "Garis horizontal atas." },
      { strokeNumber: 2, d: "M 50 25 L 50 75", startPoint: { x: 50, y: 25 }, instruction: "Garis tegak lurus di tengah." },
      { strokeNumber: 3, d: "M 22 75 L 78 75", startPoint: { x: 22, y: 75 }, instruction: "Garis horizontal alas bawah yang lebih panjang." }
    ]
  },
  "オ": {
    character: "オ",
    romaji: "o",
    type: "katakana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 22 35 L 78 35", startPoint: { x: 22, y: 35 }, instruction: "Garis mendatar panjang." },
      { strokeNumber: 2, d: "M 48 18 L 48 78 Q 48 84 40 82 M 48 78 L 42 74", startPoint: { x: 48, y: 18 }, instruction: "Garis tegak memotong dengan hentakan hane di ujung bawah." },
      { strokeNumber: 3, d: "M 45 42 Q 35 60 22 72", startPoint: { x: 45, y: 42 }, instruction: "Garis miring menyapu di sebelah kiri." }
    ]
  },
  "カ": {
    character: "カ",
    romaji: "ka",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 25 32 L 68 32 L 62 55 Q 58 75 50 82 M 62 55 L 55 58", startPoint: { x: 25, y: 32 }, instruction: "Garis mendatar menekuk turun dengan hane." },
      { strokeNumber: 2, d: "M 48 18 Q 42 52 30 80", startPoint: { x: 48, y: 18 }, instruction: "Garis miring menyapu memotong di kiri." }
    ]
  },
  "キ": {
    character: "キ",
    romaji: "ki",
    type: "katakana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 28 32 L 72 28", startPoint: { x: 28, y: 32 }, instruction: "Garis mendatar miring atas." },
      { strokeNumber: 2, d: "M 25 48 L 75 44", startPoint: { x: 25, y: 48 }, instruction: "Garis mendatar miring kedua sejajar." },
      { strokeNumber: 3, d: "M 55 18 L 40 82", startPoint: { x: 55, y: 18 }, instruction: "Garis miring panjang memotong kedua garis horizontal." }
    ]
  },
  "ク": {
    character: "ク",
    romaji: "ku",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 48 20 Q 38 38 28 52", startPoint: { x: 48, y: 20 }, instruction: "Garis miring pendek kiri." },
      { strokeNumber: 2, d: "M 32 35 L 75 35 Q 60 65 32 82", startPoint: { x: 32, y: 35 }, instruction: "Garis horizontal menekuk miring menyapu ke bawah." }
    ]
  },
  "ケ": {
    character: "ケ",
    romaji: "ke",
    type: "katakana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 45 18 Q 35 38 25 52", startPoint: { x: 45, y: 18 }, instruction: "Garis miring pendek kiri." },
      { strokeNumber: 2, d: "M 30 35 L 75 35", startPoint: { x: 30, y: 35 }, instruction: "Garis horizontal mendatar." },
      { strokeNumber: 3, d: "M 52 35 Q 50 62 32 82", startPoint: { x: 52, y: 35 }, instruction: "Garis miring panjang memotong menyapu ke bawah kiri." }
    ]
  },
  "コ": {
    character: "コ",
    romaji: "ko",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 30 30 L 72 30 L 72 70", startPoint: { x: 30, y: 30 }, instruction: "Garis horizontal atas menekuk lurus ke bawah di kanan." },
      { strokeNumber: 2, d: "M 30 70 L 74 70", startPoint: { x: 30, y: 70 }, instruction: "Garis horizontal alas bawah menyambung sudut." }
    ]
  },
  "サ": {
    character: "サ",
    romaji: "sa",
    type: "katakana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 22 35 L 78 35", startPoint: { x: 22, y: 35 }, instruction: "Garis mendatar panjang." },
      { strokeNumber: 2, d: "M 38 22 L 38 78", startPoint: { x: 38, y: 22 }, instruction: "Garis tegak pendek kiri memotong." },
      { strokeNumber: 3, d: "M 62 22 Q 62 55 58 78", startPoint: { x: 62, y: 22 }, instruction: "Garis tegak pendek kanan melengkung sedikit ke kiri." }
    ]
  },
  "シ": {
    character: "シ",
    romaji: "shi",
    type: "katakana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 30 28 L 40 32", startPoint: { x: 30, y: 28 }, instruction: "Titik miring teratas." },
      { strokeNumber: 2, d: "M 25 48 L 35 52", startPoint: { x: 25, y: 48 }, instruction: "Titik miring kedua di bawahnya." },
      { strokeNumber: 3, d: "M 25 75 Q 52 68 75 42", startPoint: { x: 25, y: 75 }, instruction: "Garis menyapu dari bawah kiri mendatar miring NAIK ke atas kanan." }
    ],
    tips: "Perhatikan arah goresan ke-3: ditarik dari bawah NAIK ke atas kanan."
  },
  "ス": {
    character: "ス",
    romaji: "su",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 28 32 L 72 32 L 35 78", startPoint: { x: 28, y: 32 }, instruction: "Garis mendatar miring menekuk menyapu ke bawah kiri." },
      { strokeNumber: 2, d: "M 52 50 L 72 75", startPoint: { x: 52, y: 50 }, instruction: "Garis kaki miring memancar ke kanan bawah." }
    ]
  },
  "セ": {
    character: "セ",
    romaji: "se",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 25 38 L 75 35 L 75 62 L 55 62", startPoint: { x: 25, y: 38 }, instruction: "Garis horizontal atas menekuk ke bawah lalu miring ke kiri." },
      { strokeNumber: 2, d: "M 42 20 L 42 78 L 78 78", startPoint: { x: 42, y: 20 }, instruction: "Garis vertikal memotong lalu menekuk horizontal sebagai alas." }
    ]
  },
  "ソ": {
    character: "ソ",
    romaji: "so",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 32 28 L 42 38", startPoint: { x: 32, y: 28 }, instruction: "Titik miring berdiri di kiri." },
      { strokeNumber: 2, d: "M 68 22 Q 52 52 35 78", startPoint: { x: 68, y: 22 }, instruction: "Garis miring ditarik dari atas kanan TURUN menyapu ke bawah kiri." }
    ],
    tips: "Perhatikan arah stroke 2: ditarik dari ATAS kanan TURUN ke bawah kiri."
  },
  "タ": {
    character: "タ",
    romaji: "ta",
    type: "katakana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 45 18 Q 35 38 25 52", startPoint: { x: 45, y: 18 }, instruction: "Garis miring pendek." },
      { strokeNumber: 2, d: "M 30 35 L 75 35 Q 60 65 32 82", startPoint: { x: 30, y: 35 }, instruction: "Garis horizontal menekuk menyapu bawah." },
      { strokeNumber: 3, d: "M 42 48 L 65 65", startPoint: { x: 42, y: 48 }, instruction: "Titik miring memotong di tengah." }
    ]
  },
  "チ": {
    character: "チ",
    romaji: "chi",
    type: "katakana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 68 20 Q 48 26 30 32", startPoint: { x: 68, y: 20 }, instruction: "Garis miring menyapu dari kanan atas ke kiri." },
      { strokeNumber: 2, d: "M 22 45 L 78 45", startPoint: { x: 22, y: 45 }, instruction: "Garis mendatar panjang di bawahnya." },
      { strokeNumber: 3, d: "M 50 45 Q 48 68 32 82", startPoint: { x: 50, y: 45 }, instruction: "Garis miring lengkung memotong di tengah ke bawah kiri." }
    ]
  },
  "ツ": {
    character: "ツ",
    romaji: "tsu",
    type: "katakana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 30 25 L 35 38", startPoint: { x: 30, y: 25 }, instruction: "Titik miring tegak pertama." },
      { strokeNumber: 2, d: "M 50 28 L 55 40", startPoint: { x: 50, y: 28 }, instruction: "Titik miring tegak kedua." },
      { strokeNumber: 3, d: "M 72 25 Q 55 58 32 80", startPoint: { x: 72, y: 25 }, instruction: "Garis menyapu ditarik dari ATAS kanan TURUN ke bawah kiri." }
    ],
    tips: "Titik-titik ツ lebih sejajar atas ke bawah, dan garis utama ditarik dari atas kanan turun ke bawah."
  },
  "テ": {
    character: "テ",
    romaji: "te",
    type: "katakana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 30 28 L 70 28", startPoint: { x: 30, y: 28 }, instruction: "Garis mendatar atas." },
      { strokeNumber: 2, d: "M 22 48 L 78 48", startPoint: { x: 22, y: 48 }, instruction: "Garis mendatar kedua lebih panjang." },
      { strokeNumber: 3, d: "M 50 48 Q 45 68 30 82", startPoint: { x: 50, y: 48 }, instruction: "Garis miring menyapu dari tengah ke bawah kiri." }
    ]
  },
  "ト": {
    character: "ト",
    romaji: "to",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 42 18 L 42 82", startPoint: { x: 42, y: 18 }, instruction: "Garis vertikal lurus." },
      { strokeNumber: 2, d: "M 42 42 L 72 58", startPoint: { x: 42, y: 42 }, instruction: "Garis miring pendek menancap ke kanan bawah." }
    ]
  },
  "ナ": {
    character: "ナ",
    romaji: "na",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 22 35 L 78 35", startPoint: { x: 22, y: 35 }, instruction: "Garis mendatar panjang." },
      { strokeNumber: 2, d: "M 48 18 Q 45 55 28 82", startPoint: { x: 48, y: 18 }, instruction: "Garis miring menyapu memotong di kiri." }
    ]
  },
  "ニ": {
    character: "ニ",
    romaji: "ni",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 30 35 L 70 35", startPoint: { x: 30, y: 35 }, instruction: "Garis mendatar atas." },
      { strokeNumber: 2, d: "M 22 68 L 78 68", startPoint: { x: 22, y: 68 }, instruction: "Garis mendatar alas bawah yang lebih panjang." }
    ]
  },
  "ヌ": {
    character: "ヌ",
    romaji: "nu",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 25 32 L 72 32 L 35 78", startPoint: { x: 25, y: 32 }, instruction: "Garis horizontal menekuk menyapu miring." },
      { strokeNumber: 2, d: "M 42 48 L 72 75", startPoint: { x: 42, y: 48 }, instruction: "Garis silang pendek di kanan bawah." }
    ]
  },
  "ネ": {
    character: "ネ",
    romaji: "ne",
    type: "katakana",
    strokeCount: 4,
    strokes: [
      { strokeNumber: 1, d: "M 48 18 L 48 28", startPoint: { x: 48, y: 18 }, instruction: "Titik teratas." },
      { strokeNumber: 2, d: "M 25 38 L 68 38 L 35 78", startPoint: { x: 25, y: 38 }, instruction: "Garis mendatar menekuk miring." },
      { strokeNumber: 3, d: "M 48 38 L 48 82", startPoint: { x: 48, y: 38 }, instruction: "Garis vertikal lurus tengah." },
      { strokeNumber: 4, d: "M 58 55 L 75 75", startPoint: { x: 58, y: 55 }, instruction: "Titik miring kanan bawah." }
    ]
  },
  "ノ": {
    character: "ノ",
    romaji: "no",
    type: "katakana",
    strokeCount: 1,
    strokes: [
      { strokeNumber: 1, d: "M 68 22 Q 52 52 30 80", startPoint: { x: 68, y: 22 }, instruction: "Satu garis lengkung miring menyapu dari atas kanan ke bawah kiri." }
    ]
  },
  "ハ": {
    character: "ハ",
    romaji: "ha",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 38 28 Q 30 52 22 75", startPoint: { x: 38, y: 28 }, instruction: "Garis miring menyapu ke kiri." },
      { strokeNumber: 2, d: "M 62 28 Q 70 52 78 75", startPoint: { x: 62, y: 28 }, instruction: "Garis miring menyapu ke kanan." }
    ]
  },
  "ヒ": {
    character: "ヒ",
    romaji: "hi",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 28 35 L 68 35", startPoint: { x: 28, y: 35 }, instruction: "Garis mendatar atas." },
      { strokeNumber: 2, d: "M 42 20 L 42 68 L 78 68", startPoint: { x: 42, y: 20 }, instruction: "Garis vertikal memotong lalu menekuk horizontal di bawah." }
    ]
  },
  "フ": {
    character: "フ",
    romaji: "fu",
    type: "katakana",
    strokeCount: 1,
    strokes: [
      { strokeNumber: 1, d: "M 28 32 L 72 32 Q 55 60 38 78", startPoint: { x: 28, y: 32 }, instruction: "Garis mendatar lalu menekuk miring menyapu ke bawah kiri." }
    ]
  },
  "ヘ": {
    character: "ヘ",
    romaji: "he",
    type: "katakana",
    strokeCount: 1,
    strokes: [
      { strokeNumber: 1, d: "M 25 60 L 48 30 L 78 62", startPoint: { x: 25, y: 60 }, instruction: "Satu garis atap miring naik dari kiri lalu meluncur turun ke kanan." }
    ]
  },
  "ホ": {
    character: "ホ",
    romaji: "ho",
    type: "katakana",
    strokeCount: 4,
    strokes: [
      { strokeNumber: 1, d: "M 22 35 L 78 35", startPoint: { x: 22, y: 35 }, instruction: "Garis mendatar." },
      { strokeNumber: 2, d: "M 50 18 L 50 78 M 50 78 L 44 74", startPoint: { x: 50, y: 18 }, instruction: "Garis vertikal lurus memotong dengan hane." },
      { strokeNumber: 3, d: "M 38 48 L 25 72", startPoint: { x: 38, y: 48 }, instruction: "Garis miring kiri." },
      { strokeNumber: 4, d: "M 62 48 L 75 72", startPoint: { x: 62, y: 48 }, instruction: "Garis miring kanan." }
    ]
  },
  "マ": {
    character: "マ",
    romaji: "ma",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 28 32 L 72 32 L 40 58", startPoint: { x: 28, y: 32 }, instruction: "Garis mendatar menekuk miring ke tengah." },
      { strokeNumber: 2, d: "M 45 52 L 68 75", startPoint: { x: 45, y: 52 }, instruction: "Titik miring di bawah." }
    ]
  },
  "ミ": {
    character: "ミ",
    romaji: "mi",
    type: "katakana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 32 28 L 68 22", startPoint: { x: 32, y: 28 }, instruction: "Garis miring pertama atas." },
      { strokeNumber: 2, d: "M 30 48 L 66 42", startPoint: { x: 30, y: 48 }, instruction: "Garis miring kedua tengah." },
      { strokeNumber: 3, d: "M 28 68 L 64 62", startPoint: { x: 28, y: 68 }, instruction: "Garis miring ketiga bawah." }
    ]
  },
  "ム": {
    character: "ム",
    romaji: "mu",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 50 20 L 30 65 L 75 65", startPoint: { x: 50, y: 20 }, instruction: "Garis miring menekuk horizontal." },
      { strokeNumber: 2, d: "M 62 45 L 75 75", startPoint: { x: 62, y: 45 }, instruction: "Titik miring memotong kanan." }
    ]
  },
  "メ": {
    character: "メ",
    romaji: "me",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 68 22 Q 52 52 30 78", startPoint: { x: 68, y: 22 }, instruction: "Garis miring menyapu dari kanan atas ke kiri bawah." },
      { strokeNumber: 2, d: "M 32 38 L 72 68", startPoint: { x: 32, y: 38 }, instruction: "Garis silang memotong dari kiri atas ke kanan bawah." }
    ]
  },
  "モ": {
    character: "モ",
    romaji: "mo",
    type: "katakana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 28 32 L 72 32", startPoint: { x: 28, y: 32 }, instruction: "Garis mendatar atas." },
      { strokeNumber: 2, d: "M 25 48 L 75 48", startPoint: { x: 25, y: 48 }, instruction: "Garis mendatar kedua." },
      { strokeNumber: 3, d: "M 48 20 L 48 72 L 78 72", startPoint: { x: 48, y: 20 }, instruction: "Garis vertikal memotong lalu menekuk horizontal sebagai alas." }
    ]
  },
  "ヤ": {
    character: "ヤ",
    romaji: "ya",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 25 32 L 75 32 L 60 55", startPoint: { x: 25, y: 32 }, instruction: "Garis mendatar atas menekuk miring." },
      { strokeNumber: 2, d: "M 42 18 Q 40 52 32 82", startPoint: { x: 42, y: 18 }, instruction: "Garis miring memotong dari atas ke bawah kiri." }
    ]
  },
  "ユ": {
    character: "ユ",
    romaji: "yu",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 30 30 L 72 30 L 72 65", startPoint: { x: 30, y: 30 }, instruction: "Garis mendatar menekuk vertikal di kanan." },
      { strokeNumber: 2, d: "M 30 65 L 78 65", startPoint: { x: 30, y: 65 }, instruction: "Garis horizontal alas menembus." }
    ]
  },
  "ヨ": {
    character: "ヨ",
    romaji: "yo",
    type: "katakana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 30 25 L 72 25 L 72 75 L 30 75", startPoint: { x: 30, y: 25 }, instruction: "Garis atas menekuk turun lalu balik horizontal bawah (bingkai E terbalik)." },
      { strokeNumber: 2, d: "M 30 50 L 70 50", startPoint: { x: 30, y: 50 }, instruction: "Garis mendatar tengah." },
      { strokeNumber: 3, d: "M 30 25 L 30 75", startPoint: { x: 30, y: 25 }, instruction: "Garis vertikal kiri penutup." }
    ]
  },
  "ラ": {
    character: "ラ",
    romaji: "ra",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 30 25 L 70 25", startPoint: { x: 30, y: 25 }, instruction: "Garis mendatar atas." },
      { strokeNumber: 2, d: "M 25 45 L 75 45 Q 60 70 35 82", startPoint: { x: 25, y: 45 }, instruction: "Garis mendatar kedua menekuk miring menyapu bawah." }
    ]
  },
  "リ": {
    character: "リ",
    romaji: "ri",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 35 25 L 35 55", startPoint: { x: 35, y: 25 }, instruction: "Garis vertikal pendek kiri." },
      { strokeNumber: 2, d: "M 65 20 Q 62 55 58 82", startPoint: { x: 65, y: 20 }, instruction: "Garis vertikal panjang melengkung di kanan." }
    ]
  },
  "ル": {
    character: "ル",
    romaji: "ru",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 38 22 Q 32 52 25 78", startPoint: { x: 38, y: 22 }, instruction: "Garis miring menyapu ke kiri." },
      { strokeNumber: 2, d: "M 60 22 L 60 68 Q 60 78 72 78 Q 78 78 78 72 M 72 78 L 76 74", startPoint: { x: 60, y: 22 }, instruction: "Garis vertikal kanan menekuk melengkung naik ke atas dengan hane." }
    ]
  },
  "レ": {
    character: "レ",
    romaji: "re",
    type: "katakana",
    strokeCount: 1,
    strokes: [
      { strokeNumber: 1, d: "M 35 22 L 35 72 L 75 35", startPoint: { x: 35, y: 22 }, instruction: "Garis vertikal turun lalu mencuat miring NAIK ke atas kanan." }
    ]
  },
  "ロ": {
    character: "ロ",
    romaji: "ro",
    type: "katakana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 28 25 L 28 75", startPoint: { x: 28, y: 25 }, instruction: "Garis vertikal kiri." },
      { strokeNumber: 2, d: "M 28 25 L 72 25 L 72 75", startPoint: { x: 28, y: 25 }, instruction: "Garis horizontal atas menekuk lurus ke bawah di kanan." },
      { strokeNumber: 3, d: "M 28 75 L 74 75", startPoint: { x: 28, y: 75 }, instruction: "Garis horizontal penutup alas bawah." }
    ]
  },
  "ワ": {
    character: "ワ",
    romaji: "wa",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 32 25 L 32 45", startPoint: { x: 32, y: 25 }, instruction: "Garis vertikal pendek kiri." },
      { strokeNumber: 2, d: "M 32 28 L 75 28 Q 62 60 38 82", startPoint: { x: 32, y: 28 }, instruction: "Garis horizontal atas menekuk miring menyapu bawah." }
    ]
  },
  "ヲ": {
    character: "ヲ",
    romaji: "wo",
    type: "katakana",
    strokeCount: 3,
    strokes: [
      { strokeNumber: 1, d: "M 25 30 L 75 30", startPoint: { x: 25, y: 30 }, instruction: "Garis mendatar atas." },
      { strokeNumber: 2, d: "M 28 48 L 72 48", startPoint: { x: 28, y: 48 }, instruction: "Garis mendatar kedua." },
      { strokeNumber: 3, d: "M 52 30 Q 48 58 32 80", startPoint: { x: 52, y: 30 }, instruction: "Garis miring memotong menyapu ke bawah kiri." }
    ]
  },
  "ン": {
    character: "ン",
    romaji: "n",
    type: "katakana",
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 30 32 L 42 36", startPoint: { x: 30, y: 32 }, instruction: "Titik miring pendek atas." },
      { strokeNumber: 2, d: "M 28 70 Q 52 65 75 38", startPoint: { x: 28, y: 70 }, instruction: "Garis menyapu dari bawah kiri NAIK miring ke atas kanan." }
    ],
    tips: "Perhatikan: mirip dengan シ tetapi hanya memiliki 1 titik di atas."
  }
};

// Dynamic helper fallback for extended characters or missing entries
export function getKanaStrokeInfo(character: string, romaji: string, type: "hiragana" | "katakana"): CharacterStrokeInfo {
  if (KANA_STROKE_DATA[character]) {
    return KANA_STROKE_DATA[character];
  }

  // Generic fallback paths based on stroke count
  return {
    character,
    romaji,
    type,
    strokeCount: 2,
    strokes: [
      { strokeNumber: 1, d: "M 25 35 L 75 35", startPoint: { x: 25, y: 35 }, instruction: `Garis goresan pertama untuk ${character}.` },
      { strokeNumber: 2, d: "M 50 20 L 50 80", startPoint: { x: 50, y: 20 }, instruction: `Garis goresan kedua untuk ${character}.` }
    ],
    tips: `Pelajari pola utama urutan garis ${character} (${romaji}).`
  };
}
