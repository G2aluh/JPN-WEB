"use client";

import { useState, useEffect, useRef } from "react";
import lookalikeData from "@/data/lookalike.json";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  Zap,
  Eye,
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Trophy,
  Timer,
  ChevronRight,
} from "lucide-react";

// Types
interface LookalikeCharacter {
  kana: string;
  romaji: string;
}

interface LookalikeGroup {
  id: string;
  title: string;
  difficulty: string;
  characters: LookalikeCharacter[];
  tips: string;
  highlights: {
    left: string;
    right: string;
  };
}

interface PairProgress {
  correct: number;
  wrong: number;
  streak: number;
  bestTime: number | null;
}

type TrainingMode = "select" | "comparison" | "choice" | "speed" | "highlight";

const STORAGE_KEY = "kana_lookalike_progress_v1";

function loadProgress(): Record<string, PairProgress> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<string, PairProgress>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Failed to save lookalike progress", e);
  }
}

// Difficulty badge colors
function difficultyColor(d: string) {
  if (d === "Hard") return "bg-danger/15 text-danger border-danger/20";
  if (d === "Medium") return "bg-warning/15 text-warning border-warning/20";
  return "bg-success/15 text-success border-success/20";
}

export default function LookalikePage() {
  const groups: LookalikeGroup[] = lookalikeData as LookalikeGroup[];

  const [mode, setMode] = useState<TrainingMode>("select");
  const [activeGroup, setActiveGroup] = useState<LookalikeGroup | null>(null);
  const [progress, setProgress] = useState<Record<string, PairProgress>>({});

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const updateProgress = (groupId: string, isCorrect: boolean, reactionMs?: number) => {
    setProgress((prev) => {
      const current = prev[groupId] || { correct: 0, wrong: 0, streak: 0, bestTime: null };
      const updated: PairProgress = {
        correct: isCorrect ? current.correct + 1 : current.correct,
        wrong: !isCorrect ? current.wrong + 1 : current.wrong,
        streak: isCorrect ? current.streak + 1 : 0,
        bestTime:
          reactionMs !== undefined && isCorrect
            ? current.bestTime === null
              ? reactionMs
              : Math.min(current.bestTime, reactionMs)
            : current.bestTime,
      };
      const next = { ...prev, [groupId]: updated };
      saveProgress(next);
      return next;
    });
  };

  const getMastery = (groupId: string) => {
    const p = progress[groupId];
    if (!p || p.correct + p.wrong === 0) return 0;
    return Math.round((p.correct / (p.correct + p.wrong)) * 100);
  };

  const handleSelectGroup = (group: LookalikeGroup, trainingMode: TrainingMode) => {
    setActiveGroup(group);
    setMode(trainingMode);
  };

  const handleBack = () => {
    setMode("select");
    setActiveGroup(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 sm:py-10">
        <AnimatePresence mode="wait">
          {mode === "select" && (
            <GroupSelectView
              key="select"
              groups={groups}
              progress={progress}
              getMastery={getMastery}
              onSelect={handleSelectGroup}
            />
          )}
          {mode === "comparison" && activeGroup && (
            <ComparisonMode
              key="comparison"
              group={activeGroup}
              onBack={handleBack}
            />
          )}
          {mode === "choice" && activeGroup && (
            <ChoiceMode
              key="choice"
              group={activeGroup}
              onBack={handleBack}
              updateProgress={updateProgress}
            />
          )}
          {mode === "speed" && activeGroup && (
            <SpeedMode
              key="speed"
              group={activeGroup}
              onBack={handleBack}
              updateProgress={updateProgress}
            />
          )}
          {mode === "highlight" && activeGroup && (
            <HighlightMode
              key="highlight"
              group={activeGroup}
              onBack={handleBack}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ============================================================
   GROUP SELECT VIEW
   ============================================================ */
function GroupSelectView({
  groups,
  progress,
  getMastery,
  onSelect,
}: {
  groups: LookalikeGroup[];
  progress: Record<string, PairProgress>;
  getMastery: (id: string) => number;
  onSelect: (group: LookalikeGroup, mode: TrainingMode) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 bg-card border border-border px-3 py-1.5 rounded-full text-xs text-muted font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 text-warning" />
          <span>{t("lookalike_training")}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight" dangerouslySetInnerHTML={{ __html: t("train_your_eye") }} />
        <p className="text-sm text-muted max-w-md mx-auto font-medium">
          {t("lookalike_select_desc")}
        </p>
      </div>

      {/* Group Cards */}
      <div className="space-y-3">
        {groups.map((group) => {
          const mastery = getMastery(group.id);
          const p = progress[group.id];
          const isExpanded = expandedId === group.id;

          return (
            <motion.div
              key={group.id}
              layout
              className="bg-[#171A22] border border-[#171A22] hover:border-[#F59E0B]/15 rounded-2xl overflow-hidden transition-colors"
            >
              {/* Card Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : group.id)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[#F59E0B]/10 text-[#F59E0B] p-2 rounded-xl">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base font-mono tracking-wide">
                      {group.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${difficultyColor(
                          group.difficulty
                        )}`}
                      >
                        {group.difficulty === "Easy" ? t("difficulty_easy") : group.difficulty === "Medium" ? t("difficulty_medium") : t("difficulty_hard")}
                      </span>
                      {p && (
                        <span className="text-[10px] text-[#9CA3AF]">
                          {p.correct}✓ {p.wrong}✗ • {mastery}% {t("mastery_label")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-[#9CA3AF] transition-transform duration-200 ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
              </button>

              {/* Expanded Mode Picker */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={() => onSelect(group, "comparison")}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#0F1117] border border-[#171A22] hover:border-[#7C5CFF]/30 text-[#9CA3AF] hover:text-white transition-all"
                      >
                        <BookOpen className="w-4 h-4 text-[#7C5CFF]" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">{t("compare")}</span>
                      </button>
                      <button
                        onClick={() => onSelect(group, "choice")}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#0F1117] border border-[#171A22] hover:border-[#7C5CFF]/30 text-[#9CA3AF] hover:text-white transition-all"
                      >
                        <Award className="w-4 h-4 text-[#7C5CFF]" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">{t("choice")}</span>
                      </button>
                      <button
                        onClick={() => onSelect(group, "speed")}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#0F1117] border border-[#171A22] hover:border-[#7C5CFF]/30 text-[#9CA3AF] hover:text-white transition-all"
                      >
                        <Zap className="w-4 h-4 text-[#F59E0B]" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">{t("speed")}</span>
                      </button>
                      <button
                        onClick={() => onSelect(group, "highlight")}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#0F1117] border border-[#171A22] hover:border-[#7C5CFF]/30 text-[#9CA3AF] hover:text-white transition-all"
                      >
                        <Eye className="w-4 h-4 text-[#22C55E]" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">{t("highlight")}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ============================================================
   COMPARISON MODE (Flashcard with tips)
   ============================================================ */
function ComparisonMode({
  group,
  onBack,
}: {
  group: LookalikeGroup;
  onBack: () => void;
}) {
  const [charIndex, setCharIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const { t } = useLanguage();

  const char = group.characters[charIndex];

  const handleNext = () => {
    setFlipped(false);
    setTimeout(() => {
      setCharIndex((prev) => (prev + 1) % group.characters.length);
    }, 150);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      <ModeHeader title={t("flashcard_comparison")} subtitle={group.title} onBack={onBack} />

      {/* Card */}
      <div className="flex justify-center py-6">
        <div
          className="relative w-full max-w-[300px] sm:max-w-[320px] h-96 [perspective:1000px] select-none cursor-pointer"
          onClick={() => setFlipped(!flipped)}
        >
          <motion.div
            className="relative w-full h-full rounded-3xl shadow-2xl"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Front */}
            <div
              className={`absolute inset-0 w-full h-full bg-[#171A22] border-2 rounded-3xl flex flex-col items-center justify-between p-8 [backface-visibility:hidden] transition-all duration-300 ${
                flipped ? "border-[#7C5CFF]/10" : "border-[#F59E0B]/30"
              }`}
            >
              <div className="w-full flex justify-between items-center text-xs text-[#9CA3AF] tracking-wide font-medium">
                <span className="uppercase">{t("katakana").toLowerCase()}</span>
                <span className="opacity-40">{t("front")}</span>
              </div>
              <div className="text-8xl sm:text-9xl font-bold text-white tracking-wide font-sans">
                {char.kana}
              </div>
              <div className="text-xs text-[#9CA3AF] bg-[#0F1117] border border-[#171A22] px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>{t("tap_reveal_difference")}</span>
              </div>
            </div>

            {/* Back */}
            <div
              className={`absolute inset-0 w-full h-full bg-[#171A22] border-2 rounded-3xl flex flex-col items-center justify-between p-8 [backface-visibility:hidden] [transform:rotateY(180deg)] transition-all duration-300 ${
                flipped ? "border-[#7C5CFF]/30" : "border-[#7C5CFF]/10"
              }`}
            >
              <div className="w-full flex justify-between items-center text-xs text-[#9CA3AF] tracking-wide font-medium">
                <span className="uppercase">{char.romaji}</span>
                <span className="opacity-40">{t("back")}</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="text-6xl font-bold text-[#7C5CFF] font-mono">
                  {char.romaji}
                </div>
                <div className="text-3xl font-semibold text-white">{char.kana}</div>
              </div>
              <div className="text-xs text-[#9CA3AF] text-center leading-relaxed px-2 bg-[#0F1117] border border-[#171A22] rounded-xl p-3">
                {group.tips}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => {
            setFlipped(false);
            setTimeout(() => setCharIndex((prev) => (prev - 1 + group.characters.length) % group.characters.length), 150);
          }}
          className="flex items-center justify-center w-14 h-14 bg-[#171A22] border border-[#171A22] hover:border-[#7C5CFF]/20 text-[#9CA3AF] hover:text-white rounded-2xl transition-all active:scale-95"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setFlipped(!flipped)}
          className="flex-1 max-w-[200px] h-14 bg-[#7C5CFF] hover:bg-[#6c4be0] text-white font-bold rounded-2xl tracking-wide shadow-lg shadow-[#7C5CFF]/10 transition-all active:scale-95 text-sm uppercase flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{flipped ? t("show_kana") : t("flip")}</span>
        </button>
        <button
          onClick={handleNext}
          className="flex items-center justify-center w-14 h-14 bg-[#171A22] border border-[#171A22] hover:border-[#7C5CFF]/20 text-[#9CA3AF] hover:text-white rounded-2xl transition-all active:scale-95"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  );
}

/* ============================================================
   CHOICE MODE (Multiple Choice)
   ============================================================ */
function ChoiceMode({
  group,
  onBack,
  updateProgress,
}: {
  group: LookalikeGroup;
  onBack: () => void;
  updateProgress: (groupId: string, isCorrect: boolean) => void;
}) {
  const TOTAL_ROUNDS = 10;
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [selectedKana, setSelectedKana] = useState<string | null>(null);
  const [shaken, setShaken] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const { t } = useLanguage();

  // Build a question: pick a random character from the group, ask "Which is {romaji}?"
  const [question, setQuestion] = useState(() => buildQuestion());

  function buildQuestion() {
    const targetIdx = Math.floor(Math.random() * group.characters.length);
    const target = group.characters[targetIdx];
    // Options: all characters from this group (pair), shuffled
    const options = [...group.characters].sort(() => Math.random() - 0.5);
    return { target, options };
  }

  const handleSelect = (kana: string) => {
    if (feedback !== null) return;
    setSelectedKana(kana);
    const isCorrect = kana === question.target.kana;
    updateProgress(group.id, isCorrect);

    if (isCorrect) {
      setFeedback("correct");
      setScore((p) => p + 1);
      setTimeout(() => advance(), 850);
    } else {
      setFeedback("wrong");
      setWrongCount((p) => p + 1);
      setShaken(true);
      setTimeout(() => setShaken(false), 500);
    }
  };

  const advance = () => {
    if (round + 1 >= TOTAL_ROUNDS) {
      setIsFinished(true);
    } else {
      setRound((p) => p + 1);
      setFeedback(null);
      setSelectedKana(null);
      setQuestion(buildQuestion());
    }
  };

  if (isFinished) {
    const accuracy = Math.round((score / TOTAL_ROUNDS) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        <ModeHeader title={t("multiple_choice")} subtitle={group.title} onBack={onBack} />
        <div className="bg-[#171A22] border border-[#7C5CFF]/10 rounded-3xl p-6 md:p-8 text-center space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-36 h-36 bg-[#7C5CFF]/15 blur-3xl rounded-full" />
          <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-[#7C5CFF]/15 blur-3xl rounded-full" />
          <div className="inline-flex p-4 rounded-full bg-[#7C5CFF]/20 text-[#7C5CFF] mb-2 animate-bounce">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">{t("round_complete")}</h2>
          <p className="text-xs text-[#9CA3AF] uppercase tracking-widest font-semibold">{group.title}</p>
          <div className="grid grid-cols-2 gap-4 py-3">
            <div className="bg-[#0F1117] border border-[#171A22] p-4 rounded-2xl">
              <span className="text-2xl font-black text-white">{score}/{TOTAL_ROUNDS}</span>
              <p className="text-[10px] text-[#9CA3AF] uppercase font-bold mt-1">{t("correct_label")}</p>
            </div>
            <div className="bg-[#0F1117] border border-[#171A22] p-4 rounded-2xl">
              <span className="text-2xl font-black text-white">{accuracy}%</span>
              <p className="text-[10px] text-[#9CA3AF] uppercase font-bold mt-1">{t("accuracy")}</p>
            </div>
          </div>
          <div className="w-full bg-[#0F1117] h-2.5 rounded-full overflow-hidden border border-[#171A22]">
            <div className="bg-[#7C5CFF] h-full rounded-full transition-all duration-500" style={{ width: `${accuracy}%` }} />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setRound(0); setScore(0); setWrongCount(0); setFeedback(null); setSelectedKana(null); setIsFinished(false); setQuestion(buildQuestion()); }}
            className="flex-1 h-14 bg-[#7C5CFF] hover:bg-[#6c4be0] text-white font-bold rounded-2xl text-sm uppercase flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" /> {t("again")}
          </button>
          <button
            onClick={onBack}
            className="flex-1 h-14 bg-[#171A22] border border-[#171A22] hover:border-[#7C5CFF]/20 text-white font-bold rounded-2xl text-sm uppercase flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-[#9CA3AF]" /> {t("back_button")}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      <ModeHeader title={t("multiple_choice")} subtitle={group.title} onBack={onBack} />

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#9CA3AF] px-1 font-mono">
          <span>{t("round")}</span>
          <span>{round + 1} / {TOTAL_ROUNDS}</span>
        </div>
        <div className="w-full bg-[#171A22] h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#7C5CFF] h-full rounded-full transition-all duration-300" style={{ width: `${((round + 1) / TOTAL_ROUNDS) * 100}%` }} />
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        animate={shaken ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={`bg-[#171A22] border-2 rounded-3xl p-8 text-center flex flex-col items-center gap-6 min-h-[180px] transition-all duration-300 ${
          feedback === "correct"
            ? "border-[#22C55E]/30 bg-[#22C55E]/5"
            : feedback === "wrong"
            ? "border-[#EF4444]/30 bg-[#EF4444]/5"
            : "border-[#F59E0B]/10"
        }`}
      >
        <p className="text-sm text-[#9CA3AF]">
          {t("which_one_is")} <span className="text-white font-bold font-mono">&quot;{question.target.romaji}&quot;</span>?
        </p>
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
          {question.options.map((opt) => {
            let btnStyle = "bg-[#0F1117] border-[#171A22] text-white hover:border-[#7C5CFF]/30";
            if (feedback !== null) {
              if (opt.kana === question.target.kana) {
                btnStyle = "bg-[#22C55E]/15 border-[#22C55E] text-[#22C55E] font-bold";
              } else if (opt.kana === selectedKana) {
                btnStyle = "bg-[#EF4444]/15 border-[#EF4444] text-[#EF4444] font-bold";
              } else {
                btnStyle = "bg-[#171A22]/50 border-[#171A22] text-[#9CA3AF] opacity-40";
              }
            }
            return (
              <button
                key={opt.kana}
                disabled={feedback !== null}
                onClick={() => handleSelect(opt.kana)}
                className={`h-20 sm:h-24 text-4xl sm:text-5xl font-bold rounded-2xl border-2 transition-all duration-200 active:scale-[0.97] ${btnStyle}`}
              >
                {opt.kana}
              </button>
            );
          })}
        </div>
        {/* Feedback text */}
        <div className="min-h-[20px] text-xs font-semibold">
          {feedback === "correct" && (
            <motion.p initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-[#22C55E] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {t("correct_excl")}
            </motion.p>
          )}
          {feedback === "wrong" && (
            <motion.p initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-[#EF4444] flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> {t("wrong_its")} {question.target.kana}
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Continue button on wrong answer */}
      {feedback === "wrong" && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={advance}
          className="w-full h-14 bg-[#7C5CFF] hover:bg-[#6c4be0] text-white font-bold rounded-2xl text-sm uppercase flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          {t("continue")} <ArrowRight className="w-4 h-4" />
        </motion.button>
      )}

      {/* Score bar */}
      <div className="flex items-center justify-center gap-3">
        <div className="bg-[#171A22] px-3.5 py-2 rounded-xl border border-[#171A22] flex items-center gap-1.5 text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
          <span className="font-mono font-bold text-white">{score}</span>
        </div>
        <div className="bg-[#171A22] px-3.5 py-2 rounded-xl border border-[#171A22] flex items-center gap-1.5 text-xs">
          <XCircle className="w-3.5 h-3.5 text-[#EF4444]" />
          <span className="font-mono font-bold text-white">{wrongCount}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   SPEED MODE
   ============================================================ */
function SpeedMode({
  group,
  onBack,
  updateProgress,
}: {
  group: LookalikeGroup;
  onBack: () => void;
  updateProgress: (groupId: string, isCorrect: boolean, reactionMs?: number) => void;
}) {
  const TOTAL_ROUNDS = 10;
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [times, setTimes] = useState<number[]>([]);
  const roundStart = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Pick a random character from the group for each round
  const [currentChar, setCurrentChar] = useState(() =>
    group.characters[Math.floor(Math.random() * group.characters.length)]
  );

  useEffect(() => {
    roundStart.current = Date.now();
    inputRef.current?.focus();
  }, [round]);

  const checkAnswer = (input: string, correct: string) => {
    const u = input.trim().toLowerCase();
    const target = correct.trim().toLowerCase();
    if (u === target) return true;
    if (target === "shi" && u === "si") return true;
    if (target === "chi" && u === "ti") return true;
    if (target === "tsu" && u === "tu") return true;
    if (target === "fu" && u === "hu") return true;
    return false;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (feedback !== null || !userAnswer.trim()) return;

    const now = Date.now();
    const reactionMs = roundStart.current ? now - roundStart.current : 0;
    const isCorrect = checkAnswer(userAnswer, currentChar.romaji);
    updateProgress(group.id, isCorrect, reactionMs);

    if (isCorrect) {
      setFeedback("correct");
      setScore((p) => p + 1);
      setTimes((prev) => [...prev, reactionMs]);
      setTimeout(() => advance(), 600);
    } else {
      setFeedback("wrong");
    }
  };

  const advance = () => {
    if (round + 1 >= TOTAL_ROUNDS) {
      setIsFinished(true);
    } else {
      setRound((p) => p + 1);
      setFeedback(null);
      setUserAnswer("");
      setCurrentChar(group.characters[Math.floor(Math.random() * group.characters.length)]);
    }
  };

  if (isFinished) {
    const avgTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
    const bestTime = times.length > 0 ? Math.min(...times) : 0;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        <ModeHeader title={t("speed_recognition")} subtitle={group.title} onBack={onBack} />
        <div className="bg-[#171A22] border border-[#7C5CFF]/10 rounded-3xl p-6 md:p-8 text-center space-y-5 shadow-2xl">
          <div className="inline-flex p-4 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] mb-2 animate-bounce">
            <Zap className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">{t("speed_results")}</h2>
          <div className="grid grid-cols-3 gap-3 py-3">
            <div className="bg-[#0F1117] border border-[#171A22] p-3 rounded-2xl">
              <span className="text-xl font-black text-white">{score}/{TOTAL_ROUNDS}</span>
              <p className="text-[10px] text-[#9CA3AF] uppercase font-bold mt-1">{t("correct_label")}</p>
            </div>
            <div className="bg-[#0F1117] border border-[#171A22] p-3 rounded-2xl">
              <span className="text-xl font-black text-[#F59E0B]">{avgTime}ms</span>
              <p className="text-[10px] text-[#9CA3AF] uppercase font-bold mt-1">{t("avg_time")}</p>
            </div>
            <div className="bg-[#0F1117] border border-[#171A22] p-3 rounded-2xl">
              <span className="text-xl font-black text-[#22C55E]">{bestTime}ms</span>
              <p className="text-[10px] text-[#9CA3AF] uppercase font-bold mt-1">{t("best")}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setRound(0); setScore(0); setTimes([]); setFeedback(null); setUserAnswer(""); setIsFinished(false); setCurrentChar(group.characters[Math.floor(Math.random() * group.characters.length)]); }}
            className="flex-1 h-14 bg-[#7C5CFF] hover:bg-[#6c4be0] text-white font-bold rounded-2xl text-sm uppercase flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" /> {t("again")}
          </button>
          <button onClick={onBack} className="flex-1 h-14 bg-[#171A22] border border-[#171A22] hover:border-[#7C5CFF]/20 text-white font-bold rounded-2xl text-sm uppercase flex items-center justify-center gap-2 transition-all active:scale-95">
            <ArrowLeft className="w-4 h-4 text-[#9CA3AF]" /> {t("back_button")}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      <ModeHeader title={t("speed_recognition")} subtitle={group.title} onBack={onBack} />

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#9CA3AF] px-1 font-mono">
          <div className="flex items-center gap-1.5"><Timer className="w-3.5 h-3.5 text-[#F59E0B]" /> {t("speed_label")}</div>
          <span>{round + 1} / {TOTAL_ROUNDS}</span>
        </div>
        <div className="w-full bg-[#171A22] h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#F59E0B] h-full rounded-full transition-all duration-300" style={{ width: `${((round + 1) / TOTAL_ROUNDS) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className={`bg-[#171A22] border-2 rounded-3xl p-8 text-center flex flex-col items-center gap-6 transition-all duration-300 ${
        feedback === "correct" ? "border-[#22C55E]/30 bg-[#22C55E]/5"
        : feedback === "wrong" ? "border-[#EF4444]/30 bg-[#EF4444]/5"
        : "border-[#F59E0B]/10"
      }`}>
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA3AF] bg-[#0F1117] px-3 py-1 rounded-full border border-[#171A22]">{t("type_the_romaji")}</span>
        <h3 className="text-8xl sm:text-9xl font-bold text-white">{currentChar.kana}</h3>
        {feedback === "wrong" && (
          <motion.p initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-[#EF4444] text-xs flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> {t("answer_label")} <span className="font-mono bg-red-500/20 px-2 py-0.5 rounded text-white">{currentChar.romaji}</span>
          </motion.p>
        )}
        {feedback === "correct" && (
          <motion.p initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-[#22C55E] text-xs flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> {t("correct_excl")}
          </motion.p>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          ref={inputRef}
          type="text"
          disabled={feedback === "correct"}
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder={t("type_romaji_short")}
          className={`w-full h-16 bg-[#171A22] border-2 rounded-2xl px-6 text-center text-lg font-mono tracking-wide focus:outline-none placeholder-[#9CA3AF]/40 transition ${
            feedback === "correct" ? "border-[#22C55E] text-[#22C55E]"
            : feedback === "wrong" ? "border-[#EF4444] text-[#EF4444]"
            : "border-[#171A22] focus:border-[#F59E0B] text-white"
          }`}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        {feedback === "wrong" ? (
          <button
            type="button"
            onClick={advance}
            className="w-full h-14 bg-[#7C5CFF] hover:bg-[#6c4be0] text-white font-bold rounded-2xl text-sm uppercase flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {t("continue")} <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!userAnswer.trim() || feedback === "correct"}
            className="w-full h-14 bg-[#7C5CFF] hover:bg-[#6c4be0] disabled:bg-[#171A22] disabled:text-[#9CA3AF]/40 text-white font-bold rounded-2xl text-sm uppercase flex items-center justify-center gap-2 transition-all"
          >
            {t("submit")}
          </button>
        )}
      </form>
    </motion.div>
  );
}

/* ============================================================
   HIGHLIGHT MODE (Side-by-side comparison)
   ============================================================ */
function HighlightMode({
  group,
  onBack,
}: {
  group: LookalikeGroup;
  onBack: () => void;
}) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      <ModeHeader title={t("difference_highlight")} subtitle={group.title} onBack={onBack} />

      {/* Side-by-side display */}
      <div className="bg-[#171A22] border border-[#F59E0B]/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {group.characters.map((char, i) => (
            <div key={char.kana} className="flex flex-col items-center gap-3">
              <div className={`w-full aspect-square max-w-[180px] flex items-center justify-center bg-[#0F1117] border-2 rounded-3xl transition-all ${
                i === 0 ? "border-[#7C5CFF]/30" : "border-[#F59E0B]/30"
              }`}>
                <span className="text-7xl sm:text-8xl font-bold text-white">{char.kana}</span>
              </div>
              <div className="text-center">
                <span className={`text-lg font-bold font-mono ${i === 0 ? "text-[#7C5CFF]" : "text-[#F59E0B]"}`}>
                  {char.romaji}
                </span>
              </div>
              <div className={`text-xs text-center leading-relaxed p-3 rounded-xl border ${
                i === 0
                  ? "bg-[#7C5CFF]/5 border-[#7C5CFF]/10 text-[#9CA3AF]"
                  : "bg-[#F59E0B]/5 border-[#F59E0B]/10 text-[#9CA3AF]"
              }`}>
                {i === 0 ? group.highlights.left : group.highlights.right}
              </div>
            </div>
          ))}
        </div>

        {/* Tips section */}
        <div className="bg-[#0F1117] border border-[#171A22] rounded-2xl p-4 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            {group.tips}
          </p>
        </div>

        {/* VS Badge */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-4 bg-[#0F1117] border border-[#171A22] px-6 py-3 rounded-2xl">
            <span className="text-4xl font-bold text-[#7C5CFF]">{group.characters[0].kana}</span>
            <span className="text-sm font-bold text-[#9CA3AF] uppercase tracking-widest">vs</span>
            <span className="text-4xl font-bold text-[#F59E0B]">{group.characters[1].kana}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onBack}
        className="w-full h-14 bg-[#171A22] border border-[#171A22] hover:border-[#7C5CFF]/20 text-white font-bold rounded-2xl text-sm uppercase flex items-center justify-center gap-2 transition-all active:scale-95"
      >
        <ArrowLeft className="w-4 h-4 text-[#9CA3AF]" /> {t("back_to_groups")}
      </button>
    </motion.div>
  );
}

/* ============================================================
   SHARED: Mode Header
   ============================================================ */
function ModeHeader({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition bg-card border border-border hover:border-white/20 px-3.5 py-2 rounded-xl font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">{t("back_button")}</span>
      </button>
      <div className="text-right">
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
        <p className="text-xs text-muted font-mono font-medium">{subtitle}</p>
      </div>
    </div>
  );
}
