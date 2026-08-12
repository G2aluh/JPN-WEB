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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-foreground" />
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
        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          {/* Confetti Glow Backdrop */}
          <div className="absolute -top-16 -left-16 w-36 h-36 bg-foreground/5 blur-3xl rounded-full" />
          <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-foreground/5 blur-3xl rounded-full" />

          {/* Trophy Header */}
          <div className="inline-flex p-4 rounded-full bg-foreground/10 text-foreground mb-2 animate-bounce border border-border">
            <Trophy className="w-10 h-10 text-foreground" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">{t("session_complete")}</h2>
            <p className="text-xs text-muted uppercase tracking-widest font-bold">
              {t("long_typing")} ({t(typeParam)}) • {lengthParam} {t("cards")}
            </p>
          </div>

          {/* Scoring Visual Block */}
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="bg-background border border-border p-4 rounded-2xl flex flex-col items-center justify-center">
              <Target className="w-5 h-5 text-foreground mb-1.5" />
              <span className="text-2xl font-black text-foreground">{score} / {questions.length}</span>
              <span className="text-[10px] text-muted uppercase font-bold tracking-wider mt-1">{t("correct_score")}</span>
            </div>

            <div className="bg-background border border-border p-4 rounded-2xl flex flex-col items-center justify-center">
              <Award className="w-5 h-5 text-foreground mb-1.5" />
              <span className="text-2xl font-black text-foreground">{accuracy}%</span>
              <span className="text-[10px] text-muted uppercase font-bold tracking-wider mt-1">{t("accuracy")}</span>
            </div>
          </div>

          {/* Feedback Text */}
          <p className="text-sm text-muted italic px-4">
            {accuracy === 100
              ? t("flawless_recall")
              : accuracy >= 80
              ? t("outstanding_work")
              : accuracy >= 50
              ? t("good_attempt")
              : t("dont_give_up")}
          </p>

          <div className="w-full bg-background h-2.5 rounded-full mt-4 overflow-hidden border border-border">
            <div
              className="bg-foreground h-full rounded-full transition-all duration-500"
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleRetry}
            className="flex-1 p-3 h-14 bg-white hover:bg-white/90 text-black font-bold rounded-2xl tracking-wide shadow-sm active:scale-95 transition-all text-sm uppercase flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t("practice_again")}</span>
          </button>

          <button
            onClick={() => router.push("/")}
            className="flex-1 p-3 h-14 bg-card border border-border hover:border-white/20 text-foreground font-bold rounded-2xl tracking-wide shadow transition-all active:scale-95 text-sm uppercase flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-muted" />
            <span>{t("return_home")}</span>
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between max-w-xl w-full mx-auto px-4 py-4 sm:py-10 gap-5 sm:gap-8">
      {/* Top Header stats */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-xs sm:text-sm text-muted hover:text-foreground transition bg-card border border-border hover:border-white/20 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl select-none font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{t("abandon")}</span>
        </button>

        {/* Score Counter */}
        <div className="flex items-center gap-2 sm:gap-3 select-none">
          <div className="bg-card px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-border flex items-center gap-1.5 text-xs text-muted">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
            <span className="font-mono font-bold text-foreground">{score}</span>
          </div>

          <div className="bg-card px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-border flex items-center gap-1.5 text-xs text-muted">
            <XCircle className="w-3.5 h-3.5 text-danger" />
            <span className="font-mono font-bold text-foreground">{wrongCount}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 sm:space-y-2 select-none">
        <div className="flex items-center justify-between text-xs text-muted px-1 font-mono font-medium">
          <span>{t("progress")}</span>
          <span>{currentIndex + 1} / {questions.length}</span>
        </div>
        <div className="w-full bg-card border border-border h-2 rounded-full overflow-hidden">
          <div
            className="bg-foreground h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Word Card Visual Area */}
      <motion.div
        animate={shaken ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={`bg-card border-2 rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center justify-center gap-4 sm:gap-5 shadow-xl min-h-[190px] sm:min-h-[220px] transition-all duration-300 relative ${
          feedback === "correct"
            ? "border-success/40 bg-success/5"
            : feedback === "wrong"
            ? "border-danger/40 bg-danger/5"
            : "border-border"
        }`}
      >
        <span className="text-[10px] uppercase font-bold tracking-widest text-muted bg-background px-3 py-1 rounded-full border border-border select-none">
          {t("long_typing")}
        </span>

        <h3 className="text-3xl sm:text-5xl font-bold text-foreground font-sans tracking-wide break-words max-w-full">
          {activeQuestion.word}
        </h3>

        {/* Translation under the word */}
        <p className="text-xs sm:text-base text-muted font-medium leading-relaxed max-w-[280px]">
          {activeQuestion.translationId}
        </p>

        {/* Context Feedback alerts */}
        <div className="min-h-[20px] text-xs font-semibold select-none">
          {feedback === "correct" && (
            <motion.p initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-success flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {t("correct_feedback")}
            </motion.p>
          )}
          {feedback === "wrong" && (
            <motion.p initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-danger flex items-center justify-center gap-1.5 flex-wrap">
              <XCircle className="w-3.5 h-3.5" /> {t("incorrect_feedback")}{" "}
              <span className="font-mono text-sm bg-danger/20 px-2 py-0.5 rounded text-foreground">{activeQuestion.romaji}</span>
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* User Input Interactions */}
      <div className="flex-1 flex flex-col justify-end">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              disabled={feedback === "correct"}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={feedback === "correct" ? t("loading_next") : t("type_romaji_word_placeholder")}
              className={`w-full h-14 sm:h-16 bg-card border-2 rounded-2xl px-5 sm:px-6 text-center text-base sm:text-lg font-mono tracking-wide focus:outline-none placeholder-muted/40 transition ${
                feedback === "correct"
                  ? "border-success text-success"
                  : feedback === "wrong"
                  ? "border-danger text-danger"
                  : "border-border focus:border-white text-foreground"
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
                className="w-full h-12 sm:h-14 bg-white hover:bg-white/90 text-black font-bold rounded-2xl tracking-wide shadow-sm active:scale-95 transition-all text-xs sm:text-sm uppercase flex items-center justify-center gap-2"
              >
                <span>{t("continue")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!userAnswer.trim() || feedback === "correct"}
                className="w-full h-12 sm:h-14 bg-white hover:bg-white/90 disabled:bg-card disabled:text-muted/40 text-black font-bold rounded-2xl tracking-wide transition-all text-xs sm:text-sm uppercase flex items-center justify-center gap-2"
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
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-foreground" />
          </div>
        }>
          <LongTypingContent />
        </Suspense>
      </main>
    </div>
  );
}
