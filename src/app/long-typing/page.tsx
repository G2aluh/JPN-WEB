"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LONG_TYPING_WORDS, LongTypingWord } from "@/data/long-typing-words";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Award,
  Trophy,
  Target,
  ArrowLeft,
  Keyboard
} from "lucide-react";

function LongTypingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();

  // Load URL Configurations
  const lengthParam = searchParams.get("length") || "10";
  const typeParam = searchParams.get("type") || "mixed";

  // States
  const [questions, setQuestions] = useState<LongTypingWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Interaction States
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [shaken, setShaken] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Load and shuffle questions on mount/lengthParam change
  useEffect(() => {
    let filtered = [...LONG_TYPING_WORDS];

    // Filter by category type
    if (typeParam === "hiragana") {
      filtered = filtered.filter((w) => w.type === "hiragana");
    } else if (typeParam === "katakana") {
      filtered = filtered.filter((w) => w.type === "katakana");
    }

    filtered = filtered.sort(() => 0.5 - Math.random());

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
    setIsFinished(false);
  }, [lengthParam, typeParam]);

  // Focus input automatically on question change
  useEffect(() => {
    if (questions.length > 0 && !isFinished) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [currentIndex, questions, isFinished]);

  const activeQuestion = questions[currentIndex];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (feedback !== null || !userAnswer.trim()) return;

    const userInputClean = userAnswer.trim().toLowerCase();
    const correctRomaji = activeQuestion.romaji.trim().toLowerCase();

    const isCorrect = userInputClean === correctRomaji;

    if (isCorrect) {
      setFeedback("correct");
      setScore((prev) => prev + 1);

      // Auto-advance to next question after successful answer
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

  const handleAdvance = () => {
    setUserAnswer("");
    setFeedback(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRetry = () => {
    let filtered = [...LONG_TYPING_WORDS];

    if (typeParam === "hiragana") {
      filtered = filtered.filter((w) => w.type === "hiragana");
    } else if (typeParam === "katakana") {
      filtered = filtered.filter((w) => w.type === "katakana");
    }

    filtered = filtered.sort(() => 0.5 - Math.random());

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
    setIsFinished(false);
  };

  // Compute accuracy
  const totalAttempts = score + wrongCount;
  const accuracy = totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0;

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7C5CFF]" />
      </div>
    );
  }

  // Session Completed Screen
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
              {t("long_typing")} ({t(typeParam)}) • {lengthParam} {t("cards")}
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
              : t("dont_give_up")}
          </p>

          <div className="w-full bg-[#0F1117] h-2.5 rounded-full mt-4 overflow-hidden border border-[#171A22]">
            <div
              className="bg-[#7C5CFF] h-full rounded-full transition-all duration-500"
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
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
          className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white transition bg-[#171A22] border border-[#171A22] hover:border-[#7C5CFF]/20 px-3.5 py-2 rounded-xl select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{t("abandon")}</span>
        </button>

        {/* Score Counter */}
        <div className="flex items-center gap-3 select-none">
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
      <div className="space-y-2 select-none">
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

      {/* Word Card Visual Area */}
      <motion.div
        animate={shaken ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={`bg-[#171A22] border-2 rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-5 shadow-xl min-h-[220px] transition-all duration-300 relative ${
          feedback === "correct"
            ? "border-[#22C55E]/30 bg-[#22C55E]/5"
            : feedback === "wrong"
            ? "border-[#EF4444]/30 bg-[#EF4444]/5"
            : "border-[#7C5CFF]/10"
        }`}
      >
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#EC4899] bg-[#EC4899]/10 px-3 py-1 rounded-full border border-[#EC4899]/20 select-none">
          {t("long_typing")}
        </span>

        <h3 className="text-4xl sm:text-5xl font-bold text-white font-sans tracking-wide">
          {activeQuestion.word}
        </h3>

        {/* Translation under the word */}
        <p className="text-base text-[#9CA3AF] font-medium leading-relaxed max-w-[280px]">
          {activeQuestion.translationId}
        </p>

        {/* Context Feedback alerts */}
        <div className="min-h-[20px] text-xs font-semibold select-none">
          {feedback === "correct" && (
            <motion.p initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-[#22C55E] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {t("correct_feedback")}
            </motion.p>
          )}
          {feedback === "wrong" && (
            <motion.p initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-[#EF4444] flex items-center justify-center gap-1.5 flex-wrap">
              <XCircle className="w-3.5 h-3.5" /> {t("incorrect_feedback")}{" "}
              <span className="font-mono text-sm bg-red-500/20 px-2 py-0.5 rounded text-white">{activeQuestion.romaji}</span>
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* User Input Interactions */}
      <div className="flex-1 flex flex-col justify-end">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              disabled={feedback === "correct"}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={feedback === "correct" ? t("loading_next") : t("type_romaji_word_placeholder")}
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

          {/* Advance trigger buttons */}
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
      </div>
    </div>
  );
}

export default function LongTypingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Study Container */}
      <main className="flex-1 flex flex-col justify-center">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7C5CFF]" />
          </div>
        }>
          <LongTypingContent />
        </Suspense>
      </main>
    </div>
  );
}
