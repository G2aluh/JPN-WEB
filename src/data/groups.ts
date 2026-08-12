export interface ConsonantGroup {
  id: string;
  label: string;       // e.g. "a i u e o"
  display: string;     // e.g. "あいうえお"
  romaji: string[];    // e.g. ["a", "i", "u", "e", "o"]
  characters: string[]; // e.g. ["あ", "い", "う", "え", "お"]
}

export const HIRAGANA_BASIC_GROUPS: ConsonantGroup[] = [
  {
    id: "h_b_a",
    label: "a i u e o",
    display: "あいうえお",
    romaji: ["a", "i", "u", "e", "o"],
    characters: ["あ", "い", "う", "え", "お"]
  },
  {
    id: "h_b_ka",
    label: "ka ki ku",
    display: "かきくけこ",
    romaji: ["ka", "ki", "ku", "ke", "ko"],
    characters: ["か", "き", "く", "け", "こ"]
  },
  {
    id: "h_b_sa",
    label: "sa shi su ",
    display: "さしすせそ",
    romaji: ["sa", "shi", "su", "se", "so"],
    characters: ["さ", "し", "す", "せ", "そ"]
  },
  {
    id: "h_b_ta",
    label: "ta chi tsu ",
    display: "たちつてと",
    romaji: ["ta", "chi", "tsu", "te", "to"],
    characters: ["たちつてと", "た", "ち", "つ", "て", "と"] // We keep "たちつてと" as fallback or just the single characters
  },
  {
    id: "h_b_na",
    label: "na ni nu ",
    display: "なにぬねの",
    romaji: ["na", "ni", "nu", "ne", "no"],
    characters: ["な", "に", "ぬ", "ね", "の"]
  },
  {
    id: "h_b_ha",
    label: "ha hi fu",
    display: "はひふへほ",
    romaji: ["ha", "hi", "fu", "he", "ho"],
    characters: ["は", "ひ", "ふ", "へ", "ほ"]
  },
  {
    id: "h_b_ma",
    label: "ma mi mu",
    display: "まみむめも",
    romaji: ["ma", "mi", "mu", "me", "mo"],
    characters: ["ま", "み", "む", "め", "も"]
  },
  {
    id: "h_b_ya",
    label: "ya yu yo",
    display: "やゆよ",
    romaji: ["ya", "yu", "yo"],
    characters: ["や", "ゆ", "よ"]
  },
  {
    id: "h_b_ra",
    label: "ra ri ru",
    display: "らりるれろ",
    romaji: ["ra", "ri", "ru", "re", "ro"],
    characters: ["ら", "り", "る", "れ", "ろ"]
  },
  {
    id: "h_b_wa",
    label: "wa wo n",
    display: "わをん",
    romaji: ["wa", "wo", "n"],
    characters: ["わ", "を", "ん"]
  }
];

// Correcting the 'ta' group characters to clean individual strings
HIRAGANA_BASIC_GROUPS[3].characters = ["た", "ち", "つ", "て", "と"];

export const HIRAGANA_EXTENDED_GROUPS: ConsonantGroup[] = [
  {
    id: "h_e_ga",
    label: "ga gi gu",
    display: "がぎぐげご",
    romaji: ["ga", "gi", "gu", "ge", "go"],
    characters: ["が", "ぎ", "ぐ", "げ", "ご"]
  },
  {
    id: "h_e_za",
    label: "za ji zu",
    display: "ざじずぜぞ",
    romaji: ["za", "ji", "zu", "ze", "zo"],
    characters: ["ざ", "じ", "ず", "ぜ", "ぞ"]
  },
  {
    id: "h_e_da",
    label: "da ji zu",
    display: "だぢづでど",
    romaji: ["da", "ji", "zu", "de", "do"],
    characters: ["だ", "ぢ", "づ", "で", "ど"]
  },
  {
    id: "h_e_ba",
    label: "ba bi bu",
    display: "ばびぶべぼ",
    romaji: ["ba", "bi", "bu", "be", "bo"],
    characters: ["ば", "び", "ぶ", "べ", "ぼ"]
  },
  {
    id: "h_e_pa",
    label: "pa pi pu  ",
    display: "ぱぴぷぺぽ",
    romaji: ["pa", "pi", "pu", "pe", "po"],
    characters: ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"]
  },
  {
    id: "h_e_kya",
    label: "kya kyu kyo",
    display: "きゃきゅきょ",
    romaji: ["kya", "kyu", "kyo"],
    characters: ["きゃ", "きゅ", "きょ"]
  },
  {
    id: "h_e_sha",
    label: "sha shu sho",
    display: "しゃしゅしょ",
    romaji: ["sha", "shu", "sho"],
    characters: ["しゃ", "しゅ", "しょ"]
  },
  {
    id: "h_e_cha",
    label: "cha chu cho",
    display: "ちゃちゅちょ",
    romaji: ["cha", "chu", "cho"],
    characters: ["ちゃ", "ちゅ", "ちょ"]
  },
  {
    id: "h_e_nya",
    label: "nya nyu nyo",
    display: "にゃにゅにょ",
    romaji: ["nya", "nyu", "nyo"],
    characters: ["にゃ", "にゅ", "にょ"]
  },
  {
    id: "h_e_hya",
    label: "hya hyu hyo",
    display: "ひゃひゅひょ",
    romaji: ["hya", "hyu", "hyo"],
    characters: ["ひゃ", "ひゅ", "ひょ"]
  },
  {
    id: "h_e_mya",
    label: "mya myu myo",
    display: "みゃみゅみょ",
    romaji: ["mya", "myu", "myo"],
    characters: ["みゃ", "みゅ", "みょ"]
  },
  {
    id: "h_e_rya",
    label: "rya ryu ryo",
    display: "りゃりゅりょ",
    romaji: ["rya", "ryu", "ryo"],
    characters: ["りゃ", "りゅ", "りょ"]
  },
  {
    id: "h_e_gya",
    label: "gya gyu gyo",
    display: "ぎゃぎゅぎょ",
    romaji: ["gya", "gyu", "gyo"],
    characters: ["ぎゃ", "ぎゅ", "ぎょ"]
  },
  {
    id: "h_e_ja",
    label: "ja ju jo",
    display: "じゃじゅじょ",
    romaji: ["ja", "ju", "jo"],
    characters: ["じゃ", "じゅ", "じょ"]
  },
  {
    id: "h_e_bya",
    label: "bya byu byo",
    display: "びゃびゅびょ",
    romaji: ["bya", "byu", "byo"],
    characters: ["びゃ", "びゅ", "びょ"]
  },
  {
    id: "h_e_pya",
    label: "pya pyu pyo",
    display: "ぴゃぴゅぴょ",
    romaji: ["pya", "pyu", "pyo"],
    characters: ["ぴゃ", "ぴゅ", "ぴょ"]
  }
];

export const KATAKANA_BASIC_GROUPS: ConsonantGroup[] = [
  {
    id: "k_b_a",
    label: "a i u e o",
    display: "アイウエオ",
    romaji: ["a", "i", "u", "e", "o"],
    characters: ["ア", "イ", "ウ", "エ", "オ"]
  },
  {
    id: "k_b_ka",
    label: "ka ki ku  ",
    display: "カキクケコ",
    romaji: ["ka", "ki", "ku", "ke", "ko"],
    characters: ["カ", "キ", "ク", "ケ", "コ"]
  },
  {
    id: "k_b_sa",
    label: "sa shi su   ",
    display: "サシスセソ",
    romaji: ["sa", "shi", "su", "se", "so"],
    characters: ["サ", "シ", "ス", "セ", "ソ"]
  },
  {
    id: "k_b_ta",
    label: "ta chi tsu  ",
    display: "タチツテト",
    romaji: ["ta", "chi", "tsu", "te", "to"],
    characters: ["タ", "チ", "ツ", "テ", "ト"]
  },
  {
    id: "k_b_na",
    label: "na ni nu  ",
    display: "ナニヌネノ",
    romaji: ["na", "ni", "nu", "ne", "no"],
    characters: ["ナ", "ニ", "ヌ", "ネ", "ノ"]
  },
  {
    id: "k_b_ha",
    label: "ha hi fu",
    display: "ハヒフヘホ",
    romaji: ["ha", "hi", "fu", "he", "ho"],
    characters: ["ハ", "ヒ", "フ", "ヘ", "ホ"]
  },
  {
    id: "k_b_ma",
    label: "ma mi mu  ",
    display: "マミムメモ",
    romaji: ["ma", "mi", "mu", "me", "mo"],
    characters: ["マ", "ミ", "ム", "メ", "モ"]
  },
  {
    id: "k_b_ya",
    label: "ya yu yo",
    display: "ヤユヨ",
    romaji: ["ya", "yu", "yo"],
    characters: ["ヤ", "ユ", "ヨ"]
  },
  {
    id: "k_b_ra",
    label: "ra ri ru  ",
    display: "ラリルレロ",
    romaji: ["ra", "ri", "ru", "re", "ro"],
    characters: ["ラ", "リ", "ル", "レ", "ロ"]
  },
  {
    id: "k_b_wa",
    label: "wa wo n",
    display: "ワヲン",
    romaji: ["wa", "wo", "n"],
    characters: ["ワ", "ヲ", "ン"]
  }
];

export const KATAKANA_EXTENDED_GROUPS: ConsonantGroup[] = [
  {
    id: "k_e_ga",
    label: "ga gi gu",
    display: "ガギグゲゴ",
    romaji: ["ga", "gi", "gu", "ge", "go"],
    characters: ["ガ", "ギ", "グ", "ゲ", "ゴ"]
  },
  {
    id: "k_e_za",
    label: "za ji zu ze zo",
    display: "ザジズゼゾ",
    romaji: ["za", "ji", "zu", "ze", "zo"],
    characters: ["ザ", "ジ", "ズ", "ゼ", "ゾ"]
  },
  {
    id: "k_e_da",
    label: "da ji zu  ",
    display: "ダヂヅデド",
    romaji: ["da", "ji", "zu", "de", "do"],
    characters: ["ダ", "ヂ", "ヅ", "デ", "ド"]
  },
  {
    id: "k_e_ba",
    label: "ba bi bu ",
    display: "バビブベボ",
    romaji: ["ba", "bi", "bu", "be", "bo"],
    characters: ["バ", "ビ", "ブ", "ベ", "ボ"]
  },
  {
    id: "k_e_pa",
    label: "pa pi pu  ",
    display: "パピプペポ",
    romaji: ["pa", "pi", "pu", "pe", "po"],
    characters: ["パ", "ピ", "プ", "ペ", "ポ"]
  },
  {
    id: "k_e_kya",
    label: "kya kyu kyo",
    display: "キャキュキョ",
    romaji: ["kya", "kyu", "kyo"],
    characters: ["キャ", "キュ", "キョ"]
  },
  {
    id: "k_e_sha",
    label: "sha shu sho",
    display: "シャシュショ",
    romaji: ["sha", "shu", "sho"],
    characters: ["シャ", "シュ", "ショ"]
  },
  {
    id: "k_e_cha",
    label: "cha chu cho",
    display: "チャチュチョ",
    romaji: ["cha", "chu", "cho"],
    characters: ["チャ", "チュ", "チョ"]
  },
  {
    id: "k_e_nya",
    label: "nya nyu nyo",
    display: "ニャニュニョ",
    romaji: ["nya", "nyu", "nyo"],
    characters: ["ニャ", "ニュ", "ニョ"]
  },
  {
    id: "k_e_hya",
    label: "hya hyu hyo",
    display: "ヒャヒュヒョ",
    romaji: ["hya", "hyu", "hyo"],
    characters: ["ヒャ", "ヒュ", "ヒョ"]
  },
  {
    id: "k_e_mya",
    label: "mya myu myo",
    display: "ミャミュミョ",
    romaji: ["mya", "myu", "myo"],
    characters: ["ミャ", "ミュ", "ミョ"]
  },
  {
    id: "k_e_rya",
    label: "rya ryu ryo",
    display: "リャリュリョ",
    romaji: ["rya", "ryu", "ryo"],
    characters: ["リャ", "リュ", "リョ"]
  },
  {
    id: "k_e_gya",
    label: "gya gyu gyo",
    display: "ギャギュギョ",
    romaji: ["gya", "gyu", "gyo"],
    characters: ["ギャ", "ギュ", "ギョ"]
  },
  {
    id: "k_e_ja",
    label: "ja ju jo",
    display: "ジャジュジョ",
    romaji: ["ja", "ju", "jo"],
    characters: ["ジャ", "ジュ", "ジョ"]
  },
  {
    id: "k_e_bya",
    label: "bya byu byo",
    display: "ビャビュビョ",
    romaji: ["bya", "byu", "byo"],
    characters: ["ビャ", "ビュ", "ビョ"]
  },
  {
    id: "k_e_pya",
    label: "pya pyu pyo",
    display: "ピャピュピョ",
    romaji: ["pya", "pyu", "pyo"],
    characters: ["ピャ", "ピュ", "ピョ"]
  }
];

export const KATAKANA_LOOKALIKE_GROUPS: ConsonantGroup[] = [
  {
    id: "k_l_shi_tsu",
    label: "shi vs tsu",
    display: "シ vs ツ",
    romaji: ["shi", "tsu"],
    characters: ["シ", "ツ"]
  },
  {
    id: "k_l_so_n",
    label: "so vs n",
    display: "ソ vs ン",
    romaji: ["so", "n"],
    characters: ["ソ", "ン"]
  },
  {
    id: "k_l_ku_ke",
    label: "ku vs ke",
    display: "ク vs ケ",
    romaji: ["ku", "ke"],
    characters: ["ク", "ケ"]
  },
  {
    id: "k_l_chi_te",
    label: "chi vs te",
    display: "チ vs テ",
    romaji: ["chi", "te"],
    characters: ["チ", "テ"]
  },
  {
    id: "k_l_sa_se",
    label: "sa vs se",
    display: "サ vs セ",
    romaji: ["sa", "se"],
    characters: ["サ", "セ"]
  },
  {
    id: "k_l_nu_su",
    label: "nu vs su",
    display: "ヌ vs ス",
    romaji: ["nu", "su"],
    characters: ["ヌ", "ス"]
  },
  {
    id: "k_l_wa_fu",
    label: "wa vs fu",
    display: "ワ vs フ",
    romaji: ["wa", "fu"],
    characters: ["ワ", "フ"]
  }
];
