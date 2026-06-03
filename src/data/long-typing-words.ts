export interface LongTypingWord {
  id: string;
  word: string; // The Hiragana or Katakana representation, e.g. "おはよう" or "テレビ"
  translationEn: string;
  translationId: string;
  romaji: string; // The correct target, e.g. "ohayo" or "terebi"
  type: "hiragana" | "katakana";
}

export const LONG_TYPING_WORDS: LongTypingWord[] = [
  // Hiragana Words
  { id: "1", word: "おはよう", translationEn: "Good morning", translationId: "Selamat pagi", romaji: "ohayo", type: "hiragana" },
  { id: "2", word: "ありがとう", translationEn: "Thank you", translationId: "Terima kasih", romaji: "arigato", type: "hiragana" },
  { id: "3", word: "こんにちは", translationEn: "Hello", translationId: "Halo / Selamat siang", romaji: "konnichiwa", type: "hiragana" },
  { id: "4", word: "こんばんは", translationEn: "Good evening", translationId: "Selamat malam", romaji: "konbanwa", type: "hiragana" },
  { id: "5", word: "さようなら", translationEn: "Goodbye", translationId: "Selamat tinggal", romaji: "sayonara", type: "hiragana" },
  { id: "6", word: "すみません", translationEn: "Excuse me / Sorry", translationId: "Permisi / Maaf", romaji: "sumimasen", type: "hiragana" },
  { id: "7", word: "おやすみなさい", translationEn: "Good night", translationId: "Selamat tidur", romaji: "oyasuminasai", type: "hiragana" },
  { id: "8", word: "はじめまして", translationEn: "Nice to meet you", translationId: "Salam kenal", romaji: "hajimemashite", type: "hiragana" },
  { id: "9", word: "いただきます", translationEn: "Let's eat", translationId: "Selamat makan", romaji: "itadakimasu", type: "hiragana" },
  { id: "10", word: "ごちそうさまでした", translationEn: "Thank you for the meal", translationId: "Terima kasih atas makanannya", romaji: "gochisosamadeshita", type: "hiragana" },
  { id: "11", word: "もしもし", translationEn: "Hello (on phone)", translationId: "Halo (di telepon)", romaji: "moshimoshi", type: "hiragana" },
  { id: "12", word: "おねがいします", translationEn: "Please / I request", translationId: "Mohon bantuannya", romaji: "onegaishimasu", type: "hiragana" },
  { id: "13", word: "どうぞ", translationEn: "Here you go / Please", translationId: "Silakan", romaji: "dozo", type: "hiragana" },
  { id: "14", word: "どうも", translationEn: "Thanks", translationId: "Terima kasih banyak", romaji: "domo", type: "hiragana" },
  { id: "15", word: "どういたしまして", translationEn: "You're welcome", translationId: "Sama-sama", romaji: "doitashimashite", type: "hiragana" },
  { id: "16", word: "ただいま", translationEn: "I'm home", translationId: "Saya kembali / pulang", romaji: "tadaima", type: "hiragana" },
  { id: "17", word: "おかえりなさい", translationEn: "Welcome home", translationId: "Selamat datang kembali", romaji: "okaerinasai", type: "hiragana" },
  { id: "18", word: "いってらっしゃい", translationEn: "Take care / See you", translationId: "Hati-hati di jalan", romaji: "itterasshai", type: "hiragana" },
  { id: "19", word: "いってきます", translationEn: "I'm leaving", translationId: "Saya pergi dulu", romaji: "ittekimasu", type: "hiragana" },
  { id: "20", word: "おげんきですか", translationEn: "How are you?", translationId: "Apa kabar?", romaji: "ogenkidesuka", type: "hiragana" },

  // Katakana Words
  { id: "21", word: "テレビ", translationEn: "TV", translationId: "Televisi", romaji: "terebi", type: "katakana" },
  { id: "22", word: "カメラ", translationEn: "Camera", translationId: "Kamera", romaji: "kamera", type: "katakana" },
  { id: "23", word: "パソコン", translationEn: "PC / Laptop", translationId: "Komputer / Laptop", romaji: "pasokon", type: "katakana" },
  { id: "24", word: "ホテル", translationEn: "Hotel", translationId: "Hotel", romaji: "hoteru", type: "katakana" },
  { id: "25", word: "レストラン", translationEn: "Restaurant", translationId: "Restoran", romaji: "resutoran", type: "katakana" },
  { id: "26", word: "タクシー", translationEn: "Taxi", translationId: "Taksi", romaji: "takushi", type: "katakana" },
  { id: "27", word: "トイレ", translationEn: "Toilet", translationId: "Toilet / Kamar mandi", romaji: "toire", type: "katakana" },
  { id: "28", word: "ニュース", translationEn: "News", translationId: "Berita", romaji: "nyusu", type: "katakana" },
  { id: "29", word: "ビール", translationEn: "Beer", translationId: "Bir", romaji: "biru", type: "katakana" },
  { id: "30", word: "シャツ", translationEn: "Shirt", translationId: "Kemeja / Kaos", romaji: "shatsu", type: "katakana" },
  { id: "31", word: "プレゼント", translationEn: "Present / Gift", translationId: "Hadiah / Kado", romaji: "purezento", type: "katakana" },
  { id: "32", word: "ケーキ", translationEn: "Cake", translationId: "Kue", romaji: "keki", type: "katakana" },
  { id: "33", word: "デパート", translationEn: "Department store", translationId: "Toko serba ada / Mal", romaji: "depato", type: "katakana" },
  { id: "34", word: "エアコン", translationEn: "Air conditioner", translationId: "AC / Pendingin ruangan", romaji: "eakon", type: "katakana" },
  { id: "35", word: "アパート", translationEn: "Apartment", translationId: "Apartemen", romaji: "apato", type: "katakana" },
  { id: "36", word: "コーヒー", translationEn: "Coffee", translationId: "Kopi", romaji: "kohi", type: "katakana" },
  { id: "37", word: "パン", translationEn: "Bread", translationId: "Roti", romaji: "pan", type: "katakana" },
  { id: "38", word: "サッカー", translationEn: "Soccer", translationId: "Sepak bola", romaji: "sakka", type: "katakana" },
  { id: "39", word: "ジュース", translationEn: "Juice", translationId: "Jus", romaji: "jusu", type: "katakana" },
  { id: "40", word: "アメリカ", translationEn: "America", translationId: "Amerika", romaji: "amerika", type: "katakana" }
];
