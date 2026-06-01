"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import kanaData from "@/data/kana.json";
import { useProgress } from "@/hooks/useProgress";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Award, 
  Sparkles,
  Trophy,
  Target,
  ArrowLeft,
  Volume2
} from "lucide-react";

interface KanaItem {
  character: string;
  romaji: string;
  type: string;
}

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { recordAnswer } = useProgress();
  const { t } = useLanguage();

  // Load URL Configurations
  const typeParam = searchParams.get("type") || "mixed";
  const formatParam = searchParams.get("format") || "choice"; // choice | text
  const lengthParam = searchParams.get("length") || "10";

  // Quiz States
  const [questions, setQuestions] = useState<KanaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  
  // Interaction States
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
   const [shaken, setShaken] = useState(false);
   const [kanaPool, setKanaPool] = useState<KanaItem[]>([]);
   
   const inputRef = useRef<HTMLInputElement>(null);

  // Normalization & alternate romaji mappings helper
  const checkAnswer = (input: string, correct: string) => {
    const userInput = input.trim().toLowerCase();
    const target = correct.trim().toLowerCase();
    if (userInput === target) return true;
    
    // Support alternate standard input mappings
    if (target === "shi" && userInput === "si") return true;
    if (target === "chi" && userInput === "ti") return true;
    if (target === "tsu" && userInput === "tu") return true;
    if (target === "fu" && userInput === "hu") return true;
    if (target === "wo" && userInput === "o") return true;
    if (target === "ji" && userInput === "di") return true;
    if (target === "zu" && userInput === "du") return true;
    if (target === "ja" && (userInput === "zya" || userInput === "jya")) return true;
    if (target === "ju" && (userInput === "zyu" || userInput === "jyu")) return true;
    if (target === "jo" && (userInput === "zyo" || userInput === "jyo")) return true;
    if (target === "sha" && userInput === "sya") return true;
    if (target === "shu" && userInput === "syu") return true;
    if (target === "sho" && userInput === "syo") return true;
    if (target === "cha" && userInput === "tya") return true;
    if (target === "chu" && userInput === "tyu") return true;
    if (target === "cho" && userInput === "tyo") return true;

    return false;
  };

  useEffect(() => {
    let filtered: KanaItem[] = [];
    if (typeParam === "custom") {
      try {
        const stored = localStorage.getItem("active_session_kana");
        filtered = stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.error("Failed to parse custom session kana", e);
      }
    } else {
      filtered = kanaData.filter((item) => {
        if (typeParam === "hiragana") return item.type === "hiragana";
        if (typeParam === "katakana") return item.type === "katakana";
        if (typeParam === "dakuten") return item.type === "dakuten";
        if (typeParam === "handakuten") return item.type === "handakuten";
        if (typeParam === "combo") return item.type === "combo";
        return item.type === "hiragana" || item.type === "katakana"; // mixed
      });
     }
     
     // Store pool for choice generation
     setKanaPool(filtered);
     
     // Shuffle questions
    filtered = [...filtered].sort(() => 0.5 - Math.random());

    // Slice to specified length
    if (lengthParam === "10") {
      filtered = filtered.slice(0, 10);
    } else if (lengthParam === "20") {
      filtered = filtered.slice(0, 20);
    }

    setQuestions(filtered);
    setCurrentIndex(0);
    setScore(0);
    setWrongCount(0);
    setFeedback(null);
    setUserAnswer("");
    setSelectedChoice(null);
    setIsFinished(false);
  }, [typeParam, lengthParam]);

  // Generate choice options for the current question
  const generateChoices = useCallback((currentQuestion: KanaItem, allKana: KanaItem[]) => {
    if (!currentQuestion) return;
    
    // Filter out correct romaji to make distractors
    const otherRomaji = Array.from(new Set(allKana
      .map(k => k.romaji)
      .filter(r => r !== currentQuestion.romaji)
    ));

    // Select 3 random distractors
    const distractors = [...otherRomaji]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    // Combine and shuffle correct choice and distractors
    const finalChoices = [currentQuestion.romaji, ...distractors]
      .sort(() => 0.5 - Math.random());

    setShuffledChoices(finalChoices);
  }, []);

  const activeQuestion = questions[currentIndex];

   // Regulate choice options when question index updates
   useEffect(() => {
     if (activeQuestion && formatParam === "choice") {
       generateChoices(activeQuestion, kanaPool);
     }
    
    // Auto-focus input on question load
    if (formatParam === "text") {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [activeQuestion, formatParam, generateChoices]);

  // Handle submissions
  const handleSubmitText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (feedback !== null || !userAnswer.trim()) return;

    const isCorrect = checkAnswer(userAnswer, activeQuestion.romaji);
    
    // Log to progress tracker
    recordAnswer(activeQuestion.character, isCorrect);

    if (isCorrect) {
      setFeedback("correct");
      setScore((prev) => prev + 1);
      
      // Auto advance on correct answer
      setTimeout(() => {
        handleAdvance();
      }, 850);
    } else {
      setFeedback("wrong");
      setWrongCount((prev) => prev + 1);
      setShaken(true);
      setTimeout(() => setShaken(false), 500);
    }
  };

  const handleChoiceSelect = (choice: string) => {
    if (feedback !== null) return;
    
    setSelectedChoice(choice);
    const isCorrect = choice === activeQuestion.romaji;
    
    // Log to progress tracker
    recordAnswer(activeQuestion.character, isCorrect);

    if (isCorrect) {
      setFeedback("correct");
      setScore((prev) => prev + 1);

      // Auto advance on choice
      setTimeout(() => {
        handleAdvance();
      }, 950);
    } else {
      setFeedback("wrong");
      setWrongCount((prev) => prev + 1);
      setShaken(true);
      setTimeout(() => setShaken(false), 500);
    }
  };

  // Move to next question or trigger results
  const handleAdvance = () => {
    setUserAnswer("");
    setSelectedChoice(null);
    setFeedback(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRetry = () => {
    // Re-trigger the mount initial state
    let filtered: KanaItem[] = [];
    if (typeParam === "custom") {
      try {
        const stored = localStorage.getItem("active_session_kana");
        filtered = stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.error("Failed to parse custom session kana", e);
      }
    } else {
      filtered = kanaData.filter((item) => {
        if (typeParam === "hiragana") return item.type === "hiragana";
        if (typeParam === "katakana") return item.type === "katakana";
        if (typeParam === "dakuten") return item.type === "dakuten";
        if (typeParam === "handakuten") return item.type === "handakuten";
        if (typeParam === "combo") return item.type === "combo";
        return item.type === "hiragana" || item.type === "katakana"; // mixed
      });
    }

    filtered = [...filtered].sort(() => 0.5 - Math.random());

    if (lengthParam === "10") {
      filtered = filtered.slice(0, 10);
    } else if (lengthParam === "20") {
      filtered = filtered.slice(0, 20);
    }

    setQuestions(filtered);
    setCurrentIndex(0);
    setScore(0);
    setWrongCount(0);
    setFeedback(null);
    setUserAnswer("");
    setSelectedChoice(null);
    setIsFinished(false);
  };

  // Compute accuracy
  const totalAttempts = score + wrongCount;
  const accuracy = totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0;

  // Render Loading Spinner
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7C5CFF]" />
      </div>
    );
  }

  // Render Finished/Result Screen
  if (isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col justify-center max-w-lg w-full mx-auto px-4 py-8 gap-8"
      >
        <div className="bg-[#171A22] border border-[#7C5CFF]/10 rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          
          {/* Confetti Glow Backdrop */}
          <div className="absolute -top-16 -left-16 w-36 h-36 bg-[#7C5CFF]/15 blur-3xl rounded-full" />
          <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-[#7C5CFF]/15 blur-3xl rounded-full" />

          {/* Trophy Header */}
          <div className="inline-flex p-4 rounded-full bg-[#7C5CFF]/20 text-[#7C5CFF] mb-2 animate-bounce">
            <Trophy className="w-10 h-10 text-[#7C5CFF]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">{t("session_complete")}</h2>
            <p className="text-xs text-[#9CA3AF] uppercase tracking-widest font-semibold">
              {typeParam} • {formatParam === "choice" ? t("multiple_choice") : t("text_typing")}
            </p>
          </div>

          {/* Scoring Visual Block */}
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="bg-[#0F1117] border border-[#171A22] p-4 rounded-2xl flex flex-col items-center justify-center">
              <Target className="w-5 h-5 text-[#7C5CFF] mb-1.5" />
              <span className="text-2xl font-black text-white">{score} / {questions.length}</span>
              <span className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-wider mt-1">{t("correct_score")}</span>
            </div>

            <div className="bg-[#0F1117] border border-[#171A22] p-4 rounded-2xl flex flex-col items-center justify-center">
              <Award className="w-5 h-5 text-[#7C5CFF] mb-1.5" />
              <span className="text-2xl font-black text-white">{accuracy}%</span>
              <span className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-wider mt-1">{t("accuracy")}</span>
            </div>
          </div>

          {/* Feedback Text */}
          <p className="text-sm text-[#9CA3AF] italic px-4">
            {accuracy === 100 
              ? t("flawless_recall")
              : accuracy >= 80 
              ? t("outstanding_work")
              : accuracy >= 50
              ? t("good_attempt")
              : t("dont_give_up")
            }
          </p>

          {/* Progress ring or summary */}
          <div className="w-full bg-[#0F1117] h-2.5 rounded-full mt-4 overflow-hidden border border-[#171A22]">
            <div 
              className="bg-[#7C5CFF] h-full rounded-full transition-all duration-500"
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleRetry}
            className="flex-1 p-3 h-14 bg-[#7C5CFF] hover:bg-[#6c4be0] text-white font-bold rounded-2xl tracking-wide shadow-lg shadow-[#7C5CFF]/15 active:scale-95 transition-all text-sm uppercase flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t("practice_again")}</span>
          </button>
          
          <button
            onClick={() => router.push("/")}
            className="flex-1 p-3 h-14 bg-[#171A22] border border-[#171A22] hover:border-[#7C5CFF]/20 text-white font-bold rounded-2xl tracking-wide shadow transition-all hover:scale-[1.02] active:scale-95 text-sm uppercase flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-[#9CA3AF]" />
            <span>{t("return_home")}</span>
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between max-w-xl w-full mx-auto px-4 py-8 md:py-12 gap-8">
      {/* Top Header stats */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white transition bg-[#171A22] border border-[#171A22] hover:border-[#7C5CFF]/20 px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{t("abandon")}</span>
        </button>

        {/* Score Counter */}
        <div className="flex items-center gap-3">
          <div className="bg-[#171A22] px-3.5 py-2 rounded-xl border border-[#171A22] flex items-center gap-1.5 text-xs text-[#9CA3AF]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
            <span className="font-mono font-bold text-white">{score}</span>
          </div>

          <div className="bg-[#171A22] px-3.5 py-2 rounded-xl border border-[#171A22] flex items-center gap-1.5 text-xs text-[#9CA3AF]">
            <XCircle className="w-3.5 h-3.5 text-[#EF4444]" />
            <span className="font-mono font-bold text-white">{wrongCount}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#9CA3AF] px-1 font-mono">
          <span>{t("progress")}</span>
          <span>{currentIndex + 1} / {questions.length}</span>
        </div>
        <div className="w-full bg-[#171A22] h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-[#7C5CFF] h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Quiz Card Visual Area */}
      <motion.div
        animate={shaken ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={`bg-[#171A22] border-2 rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-8 shadow-xl min-h-[220px] transition-all duration-300 ${
          feedback === "correct" 
            ? "border-[#22C55E]/30 bg-[#22C55E]/5" 
            : feedback === "wrong" 
            ? "border-[#EF4444]/30 bg-[#EF4444]/5" 
            : "border-[#7C5CFF]/10"
        }`}
      >
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA3AF] bg-[#0F1117] px-3 py-1 rounded-full border border-[#171A22]">
          {activeQuestion.type}
        </span>

        <h3 className="text-8xl sm:text-9xl font-bold text-white font-sans tracking-wide">
          {activeQuestion.character}
        </h3>

        {/* Context Feedback alerts */}
        <div className="min-h-[20px] text-xs font-semibold">
          {feedback === "correct" && (
            <motion.p initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-[#22C55E] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {t("correct_feedback")}
            </motion.p>
          )}
          {feedback === "wrong" && (
            <motion.p initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-[#EF4444] flex items-center justify-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" /> {t("incorrect_feedback")} <span className="font-mono text-sm bg-red-500/20 px-2 py-0.5 rounded text-white">{activeQuestion.romaji}</span>
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* User Input Interactions */}
      <div className="flex-1 flex flex-col justify-end">
        {formatParam === "text" ? (
          /* Text input field mode */
          <form onSubmit={handleSubmitText} className="space-y-4">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                disabled={feedback === "correct"}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={feedback === "correct" ? t("loading_next") : t("type_romaji_placeholder")}
                className={`w-full h-16 bg-[#171A22] border-2 rounded-2xl px-6 text-center text-lg font-mono tracking-wide focus:outline-none focus:ring-0 placeholder-[#9CA3AF]/40 transition ${
                  feedback === "correct"
                    ? "border-[#22C55E] text-[#22C55E]"
                    : feedback === "wrong"
                    ? "border-[#EF4444] text-[#EF4444]"
                    : "border-[#171A22] focus:border-[#7C5CFF] text-white"
                }`}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
            </div>

            {/* Advance triggers */}
            <div className="flex items-center gap-3">
              {feedback === "wrong" ? (
                <button
                  type="button"
                  onClick={handleAdvance}
                  className="w-full h-14 bg-[#7C5CFF] hover:bg-[#6c4be0] text-white font-bold rounded-2xl tracking-wide shadow-lg shadow-[#7C5CFF]/10 active:scale-95 transition-all text-sm uppercase flex items-center justify-center gap-2"
                >
                  <span>{t("continue")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!userAnswer.trim() || feedback === "correct"}
                  className="w-full h-14 bg-[#7C5CFF] hover:bg-[#6c4be0] disabled:bg-[#171A22] disabled:text-[#9CA3AF]/40 text-white font-bold rounded-2xl tracking-wide transition-all text-sm uppercase flex items-center justify-center gap-2"
                >
                  <span>{t("submit_answer")}</span>
                </button>
              )}
            </div>
          </form>
        ) : (
          /* Multiple choice button grid mode */
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3.5">
              {shuffledChoices.map((choice) => {
                let btnStyles = "bg-[#171A22] border-[#171A22] text-[#F5F7FA] hover:border-[#7C5CFF]/30";
                
                if (feedback !== null) {
                  const isCorrectAnswer = choice === activeQuestion.romaji;
                  const isUserSelection = choice === selectedChoice;

                  if (isCorrectAnswer) {
                    btnStyles = "bg-[#22C55E]/15 border-[#22C55E] text-[#22C55E] font-bold shadow-md shadow-[#22C55E]/10";
                  } else if (isUserSelection && !isCorrectAnswer) {
                    btnStyles = "bg-[#EF4444]/15 border-[#EF4444] text-[#EF4444] font-bold";
                  } else {
                    btnStyles = "bg-[#171A22]/50 border-[#171A22] text-[#9CA3AF] opacity-40";
                  }
                }

                return (
                  <button
                    key={choice}
                    disabled={feedback !== null}
                    onClick={() => handleChoiceSelect(choice)}
                    className={`h-16 text-lg font-mono rounded-2xl border-2 tracking-wide font-medium transition-all duration-200 active:scale-[0.98] ${btnStyles}`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>

            {/* Advance overlay for multiple choices */}
            {feedback === "wrong" && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleAdvance}
                className="w-full h-14 bg-[#7C5CFF] hover:bg-[#6c4be0] text-white font-bold rounded-2xl tracking-wide shadow-lg shadow-[#7C5CFF]/10 active:scale-95 transition-all text-sm uppercase flex items-center justify-center gap-2"
              >
                <span>{t("continue")}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuizPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-[#0F1117] text-[#F5F7FA] font-sans selection:bg-[#7C5CFF]/30 selection:text-white">
      {/* Header */}
      <header className="border-b border-[#171A22] bg-[#0F1117]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-[#7C5CFF] tracking-wide">
              {t("logo")}
            </span>
            <div className="bg-[#7C5CFF]/10 text-[#7C5CFF] text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-widest border border-[#7C5CFF]/20">
              {t("quiz_badge")}
            </div>
          </div>
          <span className="text-xs text-[#9CA3AF] font-mono">{t("challenge")}</span>
        </div>
      </header>

      {/* Main Study Container */}
      <main className="flex-1 flex flex-col justify-center">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7C5CFF]" />
          </div>
        }>
          <QuizContent />
        </Suspense>
      </main>

      <footer className="py-6 border-t border-[#171A22] text-center text-xs text-[#9CA3AF]">
        {t("quiz_footer")}
      </footer>
    </div>
  );
}
