"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useProgress } from "@/hooks/useProgress";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Layers,
  Play,
  Sparkles,
  Info,
  AlertTriangle,
  Lock,
  Zap,
  ChevronRight,
  Globe,
  Coffee,
  X
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import kanaData from "@/data/kana.json";
import {
  HIRAGANA_BASIC_GROUPS,
  HIRAGANA_EXTENDED_GROUPS,
  KATAKANA_BASIC_GROUPS,
  KATAKANA_EXTENDED_GROUPS,
  KATAKANA_LOOKALIKE_GROUPS,
  ConsonantGroup
} from "@/data/groups";

export default function HomePage() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const {
    totalCorrect,
    totalWrong,
    masteryPercentage,
    masteredCount,
    totalCharacters,
    resetProgress,
    isLoaded,
    kanaStats
  } = useProgress();

  const [category, setCategory] = useState<"hiragana" | "katakana" | "mixed" | "lookalike" | "dakuten" | "handakuten" | "combo">("mixed");
  const [mode, setMode] = useState<"flashcard" | "choice" | "text">("flashcard");
  const [sessionLength, setSessionLength] = useState<"10" | "20" | "all">("10");
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showQrisModal, setShowQrisModal] = useState(false);

  // Custom Granular Selection States
  const [selectionMode, setSelectionMode] = useState<"automatic" | "manual">("automatic");
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(["h_b_a"]); // Precheck first row by default
  const [validationError, setValidationError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    hiragana: true,
    katakana: false,
  });
  const [isPreferencesLoaded, setIsPreferencesLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem("kana_flow_pref_mode");
      if (savedMode) setMode(savedMode as any);

      const savedCategory = localStorage.getItem("kana_flow_pref_category");
      if (savedCategory) setCategory(savedCategory as any);

      const savedSessionLength = localStorage.getItem("kana_flow_pref_session_length");
      if (savedSessionLength) setSessionLength(savedSessionLength as any);

      const savedSelectionMode = localStorage.getItem("kana_flow_pref_selection_mode");
      if (savedSelectionMode) setSelectionMode(savedSelectionMode as any);

      const savedSelectedGroupIds = localStorage.getItem("kana_flow_pref_selected_group_ids");
      if (savedSelectedGroupIds) {
        setSelectedGroupIds(JSON.parse(savedSelectedGroupIds));
      }

      const savedExpandedCategories = localStorage.getItem("kana_flow_pref_expanded_categories");
      if (savedExpandedCategories) {
        setExpandedCategories(JSON.parse(savedExpandedCategories));
      }
    } catch (e) {
      console.error("Failed to load settings from localStorage", e);
    } finally {
      setIsPreferencesLoaded(true);
    }
  }, []);

  // Save preferences to localStorage on change
  useEffect(() => {
    if (!isPreferencesLoaded) return;
    try {
      localStorage.setItem("kana_flow_pref_mode", mode);
      localStorage.setItem("kana_flow_pref_category", category);
      localStorage.setItem("kana_flow_pref_session_length", sessionLength);
      localStorage.setItem("kana_flow_pref_selection_mode", selectionMode);
      localStorage.setItem("kana_flow_pref_selected_group_ids", JSON.stringify(selectedGroupIds));
      localStorage.setItem("kana_flow_pref_expanded_categories", JSON.stringify(expandedCategories));
    } catch (e) {
      console.error("Failed to save settings to localStorage", e);
    }
  }, [mode, category, sessionLength, selectionMode, selectedGroupIds, expandedCategories, isPreferencesLoaded]);

  // Floating Start Button observer
  const startButtonRef = useRef<HTMLDivElement>(null);
  const [isStartButtonVisible, setIsStartButtonVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStartButtonVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    const currentRef = startButtonRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const toggleGroup = (groupId: string) => {
    setValidationError(null);
    setSelectedGroupIds((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const selectAllCategory = (groupsList: ConsonantGroup[]) => {
    setValidationError(null);
    const ids = groupsList.map((g) => g.id);
    setSelectedGroupIds((prev) => {
      const filtered = prev.filter((id) => !ids.includes(id));
      return [...filtered, ...ids];
    });
  };

  const selectNoneCategory = (groupsList: ConsonantGroup[]) => {
    const ids = groupsList.map((g) => g.id);
    setSelectedGroupIds((prev) => prev.filter((id) => !ids.includes(id)));
  };

  const toggleCategoryExpand = (catKey: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catKey]: !prev[catKey],
    }));
  };

  const getGroupMastery = (group: ConsonantGroup) => {
    if (!isLoaded || !kanaStats || !group.characters || group.characters.length === 0) return 0;
    let mastered = 0;
    group.characters.forEach((char) => {
      const stats = kanaStats[char];
      if (stats) {
        const total = stats.correct + stats.wrong;
        if (stats.correct >= 1 && stats.correct / total >= 0.66) {
          mastered++;
        }
      }
    });
    return Math.round((mastered / group.characters.length) * 100);
  };

  const getCategoryMastery = (categoryGroups: ConsonantGroup[]) => {
    if (!isLoaded || !kanaStats) return 0;
    let totalChars = 0;
    let mastered = 0;
    categoryGroups.forEach((group) => {
      group.characters.forEach((char) => {
        totalChars++;
        const stats = kanaStats[char];
        if (stats) {
          const total = stats.correct + stats.wrong;
          if (stats.correct >= 1 && stats.correct / total >= 0.66) {
            mastered++;
          }
        }
      });
    });
    return totalChars > 0 ? Math.round((mastered / totalChars) * 100) : 0;
  };

  const handleStart = () => {
    if (selectionMode === "manual") {
      const allSelectedChars: any[] = [];
      const allGroups = [
        ...HIRAGANA_BASIC_GROUPS,
        ...HIRAGANA_EXTENDED_GROUPS,
        ...KATAKANA_BASIC_GROUPS,
        ...KATAKANA_EXTENDED_GROUPS,
        ...KATAKANA_LOOKALIKE_GROUPS,
      ];
      allGroups.forEach((g) => {
        if (selectedGroupIds.includes(g.id)) {
          g.characters.forEach((char) => {
            const match = kanaData.find((item) => item.character === char);
            if (match && !allSelectedChars.some(c => c.character === char)) {
              allSelectedChars.push(match);
            }
          });
        }
      });

      if (allSelectedChars.length === 0) {
        setValidationError("Please select at least one character group to practice.");
        return;
      }
      setValidationError(null);

      // Save to localStorage for Custom session
      localStorage.setItem("active_session_kana", JSON.stringify(allSelectedChars));

      if (mode === "flashcard") {
        router.push(`/flashcard?type=custom&length=${sessionLength}`);
      } else {
        router.push(`/quiz?type=custom&format=${mode}&length=${sessionLength}`);
      }
      return;
    }

    if (category === "lookalike") {
      router.push("/lookalike");
      return;
    }
    if (mode === "flashcard") {
      router.push(`/flashcard?type=${category}&length=${sessionLength}`);
    } else {
      router.push(`/quiz?type=${category}&format=${mode}&length=${sessionLength}`);
    }
  };

  const handleConfirmReset = () => {
    resetProgress();
    setShowConfirmReset(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0F1117] text-[#F5F7FA] font-sans selection:bg-[#7C5CFF]/30 selection:text-white">
      {/* Header */}
      <header className="border-b border-[#171A22] bg-[#0F1117]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-[#7C5CFF] tracking-wide">
              SIKANA
            </span>
            <div className="bg-[#7C5CFF]/10 text-[#7C5CFF] text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-widest border border-[#7C5CFF]/20">
              MVP
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#9CA3AF] hover:text-[#F5F7FA] transition"
            >
              v1.0.0
            </a>
            <button
              onClick={() => setLanguage(language === "en" ? "id" : "en")}
              className="flex items-center gap-1.5 text-xs px-2 text-[#9CA3AF] hover:text-white transition bg-[#171A22] border border-[#171A22] hover:border-[#7C5CFF]/20 px-2.5 py-1.5 rounded-lg select-none"
              title={language === "en" ? "Switch to Indonesian" : "Ganti ke Bahasa Inggris"}
            >
              <Globe className="w-3.5 h-3.5 text-[#7C5CFF]" />
              <span className="font-mono uppercase font-bold text-[10px]">{language}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 md:py-12 flex flex-col justify-center gap-10">

        {/* Hero Section */}
        <section className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-[#171A22] border border-[#7C5CFF]/10 px-3 py-1.5 rounded-full text-xs text-[#7C5CFF]"
          >

            <span>{t("hero_tagline")} </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white font-sans"
            dangerouslySetInnerHTML={{ __html: t("hero_title") }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-sm md:text-base text-[#9CA3AF] max-w-lg mx-auto"
          >
            {t("hero_desc")}
          </motion.p>
        </section>

        {/* Stats Dashboard */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mastery Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-[#171A22] rounded-2xl p-6 border border-[#171A22] hover:border-[#7C5CFF]/20 card-glow flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-[#9CA3AF] font-semibold">{t("mastery_percentage")}</span>
              <Award className="w-5 h-5 text-[#7C5CFF]" />
            </div>

            <div className="flex items-end gap-3 my-2">
              <span className="text-5xl font-extrabold text-white tracking-tight">
                {isLoaded ? `${masteryPercentage}%` : "—"}
              </span>
              <span className="text-xs text-[#9CA3AF] mb-1.5">
                {isLoaded ? `(${masteredCount}/${totalCharacters} ${t("kana")})` : ""}
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-[#0F1117] h-2 rounded-full mt-3 overflow-hidden border border-[#171A22]">
              <motion.div
                className="bg-[#7C5CFF] h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: isLoaded ? `${masteryPercentage}%` : 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Correct Count */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="bg-[#171A22] rounded-2xl p-6 border border-[#171A22] hover:border-[#22C55E]/20 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-[#9CA3AF] font-semibold">{t("correct_answers")}</span>
              <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
            </div>
            <div className="my-2">
              <span className="text-5xl font-extrabold text-white tracking-tight">
                {isLoaded ? totalCorrect : "—"}
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-3">
              {t("answers_recognized")}
            </p>
          </motion.div>

          {/* Accuracy & Wrong Count */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="bg-[#171A22] rounded-2xl p-6 border border-[#171A22] hover:border-[#EF4444]/20 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-[#9CA3AF] font-semibold">{t("errors_accuracy")}</span>
              <XCircle className="w-5 h-5 text-[#EF4444]" />
            </div>
            <div className="my-2 flex flex-col gap-1">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {isLoaded && (totalCorrect + totalWrong > 0)
                  ? `${Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100)}% ${t("accuracy")}`
                  : t("no_attempts")}
              </span>
              <span className="text-xs text-[#9CA3AF]">
                {isLoaded ? `${totalWrong} ${t("incorrect_submissions")}` : "—"}
              </span>
            </div>

            {isLoaded && (totalCorrect > 0 || totalWrong > 0) ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="text-xs text-[#EF4444] hover:underline flex items-center gap-1 mt-3 text-left self-start"
              >
                <RotateCcw className="w-3 h-3" />
                {t("reset_mastery")}
              </button>
            ) : (
              <div className="text-xs text-[#9CA3AF] mt-3 flex items-center gap-1">
                <Info className="w-3 h-3" />
                {t("reset_sync")}
              </div>
            )}
          </motion.div>
        </section>

        {/* Configuration Panel */}
        <section className="bg-[#171A22] border border-[#171A22] rounded-2xl p-6 md:p-8 space-y-8">

          {/* Header with Mode Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#0F1117] pb-4 gap-3">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#7C5CFF]" /> {t("setup_session")}
            </h2>
            <div className="flex bg-[#0F1117] p-1 rounded-xl border border-[#171A22] self-start sm:self-auto select-none">
              <button
                onClick={() => {
                  setValidationError(null);
                  setSelectionMode("automatic");
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${selectionMode === "automatic"
                    ? "bg-[#7C5CFF] text-white shadow"
                    : "text-[#9CA3AF] hover:text-white"
                  }`}
              >
                {t("automatic")}
              </button>
              <button
                onClick={() => {
                  setValidationError(null);
                  setSelectionMode("manual");
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${selectionMode === "manual"
                    ? "bg-[#7C5CFF] text-white shadow"
                    : "text-[#9CA3AF] hover:text-white"
                  }`}
              >
                {t("manual")}
              </button>
            </div>
          </div>

          {/* Validation Errors */}
          {validationError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl text-[#EF4444] text-xs font-medium flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{t(validationError)}</span>
            </motion.div>
          )}

          {selectionMode === "automatic" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Left Column: Category & Length */}
              <div className="space-y-6">
                {/* Category selector */}
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-[#9CA3AF] font-bold">{t("select_category")}</label>
                  <div className="grid grid-cols-3 gap-2 bg-[#0F1117] p-1 rounded-xl border border-[#171A22]">
                    {(["hiragana", "katakana", "mixed"] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`py-2 text-sm font-medium rounded-lg capitalize transition-all ${category === cat
                            ? "bg-[#7C5CFF] text-white shadow-lg shadow-[#7C5CFF]/20"
                            : "text-[#9CA3AF] hover:text-white"
                          }`}
                      >
                        {t(cat)}
                      </button>
                    ))}
                  </div>

                  {/* Extended Set */}
                  <div className="mt-4 space-y-2">
                    <span className="text-[10px] uppercase tracking-widest text-[#9CA3AF]/60 font-bold">{t("extended_set")}</span>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Look-Alike Training - Active */}
                      <button
                        onClick={() => setCategory("lookalike")}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${category === "lookalike"
                            ? "bg-[#F59E0B]/10 border-[#F59E0B]/40 text-[#F59E0B]"
                            : "bg-[#0F1117] border-[#171A22] text-[#9CA3AF] hover:text-white hover:border-[#F59E0B]/20"
                          }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs font-semibold">{t("lookalike_title")}</span>
                      </button>
                      {/* Dakuten - Active */}
                      <button
                        onClick={() => setCategory("dakuten")}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${category === "dakuten"
                            ? "bg-[#6366F1]/10 border-[#6366F1]/40 text-[#6366F1]"
                            : "bg-[#0F1117] border-[#171A22] text-[#9CA3AF] hover:text-white hover:border-[#6366F1]/20"
                          }`}
                      >
                        <Zap className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs font-semibold">{t("dakuten")}</span>
                      </button>
                      {/* Handakuten - Active */}
                      <button
                        onClick={() => setCategory("handakuten")}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${category === "handakuten"
                            ? "bg-[#22C55E]/10 border-[#22C55E]/40 text-[#22C55E]"
                            : "bg-[#0F1117] border-[#171A22] text-[#9CA3AF] hover:text-white hover:border-[#22C55E]/20"
                          }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs font-semibold">{t("handakuten")}</span>
                      </button>
                      {/* Combination - Active */}
                      <button
                        onClick={() => setCategory("combo")}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${category === "combo"
                            ? "bg-[#EC4899]/10 border-[#EC4899]/40 text-[#EC4899]"
                            : "bg-[#0F1117] border-[#171A22] text-[#9CA3AF] hover:text-white hover:border-[#EC4899]/20"
                          }`}
                      >
                        <Layers className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs font-semibold">{t("combo")}</span>
                      </button>
                    </div>
                  </div>
                </div>
                {/* Session Length selector - hidden when lookalike is selected */}
                {category !== "lookalike" && (
                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-widest text-[#9CA3AF] font-bold">{t("select_length")}</label>
                    <div className="grid grid-cols-3 gap-2 bg-[#0F1117] p-1 rounded-xl border border-[#171A22]">
                      {(["10", "20", "all"] as const).map((len) => (
                        <button
                          key={len}
                          onClick={() => setSessionLength(len)}
                          className={`py-2 text-sm font-medium rounded-lg transition-all ${sessionLength === len
                              ? "bg-[#7C5CFF] text-white shadow-lg shadow-[#7C5CFF]/20"
                              : "text-[#9CA3AF] hover:text-white"
                            }`}
                        >
                          {len === "all" ? t("all_cards") : `${len} ${t("cards")}`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Game Mode Selection */}
              {category !== "lookalike" ? (
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-[#9CA3AF] font-bold">{t("select_mode")}</label>

                  <div className="flex flex-col gap-2.5">
                    {/* Flashcard Mode Button */}
                    <button
                      onClick={() => setMode("flashcard")}
                      className={`flex items-start text-left p-3.5 rounded-xl border transition-all ${mode === "flashcard"
                          ? "bg-[#7C5CFF]/5 border-[#7C5CFF] text-white"
                          : "bg-[#0F1117] border-[#0F1117] hover:border-[#171A22] text-[#9CA3AF] hover:text-[#F5F7FA]"
                        }`}
                    >
                      <div className="mr-3 bg-[#7C5CFF]/10 text-[#7C5CFF] p-2 rounded-lg mt-0.5">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-white">{t("flashcard_title")}</h4>
                        <p className="text-xs text-[#9CA3AF] mt-1">{t("flashcard_desc")}</p>
                      </div>
                    </button>

                    {/* Multiple Choice Mode Button */}
                    <button
                      onClick={() => setMode("choice")}
                      className={`flex items-start text-left p-3.5 rounded-xl border transition-all ${mode === "choice"
                          ? "bg-[#7C5CFF]/5 border-[#7C5CFF] text-white"
                          : "bg-[#0F1117] border-[#0F1117] hover:border-[#171A22] text-[#9CA3AF] hover:text-[#F5F7FA]"
                        }`}
                    >
                      <div className="mr-3 bg-[#7C5CFF]/10 text-[#7C5CFF] p-2 rounded-lg mt-0.5">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-white">{t("quiz_title")}</h4>
                        <p className="text-xs text-[#9CA3AF] mt-1">{t("quiz_desc")}</p>
                      </div>
                    </button>

                    {/* Text Input Mode Button */}
                    <button
                      onClick={() => setMode("text")}
                      className={`flex items-start text-left p-3.5 rounded-xl border transition-all ${mode === "text"
                          ? "bg-[#7C5CFF]/5 border-[#7C5CFF] text-white"
                          : "bg-[#0F1117] border-[#0F1117] hover:border-[#171A22] text-[#9CA3AF] hover:text-[#F5F7FA]"
                        }`}
                    >
                      <div className="mr-3 bg-[#22C55E]/10 text-[#22C55E] p-2 rounded-lg mt-0.5">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-white">{t("text_title")}</h4>
                        <p className="text-xs text-[#9CA3AF] mt-1">{t("text_desc")}</p>
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-[#9CA3AF] font-bold">{t("lookalike_desc")}</label>
                  <div className="bg-[#0F1117] border border-[#F59E0B]/10 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-[#F59E0B]">
                      <AlertTriangle className="w-5 h-5" />
                      <h4 className="font-bold text-sm">{t("lookalike_alert_title")}</h4>
                    </div>
                    <p className="text-xs text-[#9CA3AF] leading-relaxed">
                      {t("lookalike_alert_desc")}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {["シ vs ツ", "ソ vs ン", "ク vs ケ", "チ vs テ", "サ vs セ"].map((pair) => (
                        <span key={pair} className="text-[10px] font-mono bg-[#F59E0B]/10 text-[#F59E0B] px-2 py-0.5 rounded-full border border-[#F59E0B]/20">
                          {pair}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* MANUAL GRANULAR SELECTION PANEL */
            <div className="space-y-8 animate-fadeIn">

              {/* Row 1: Session practice settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0F1117] p-5 rounded-2xl border border-[#171A22]">

                {/* 1. Mode Select */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest text-[#9CA3AF] font-bold">{t("select_mode")}</label>
                  <div className="grid grid-cols-3 gap-2 bg-[#171A22] p-1 rounded-xl border border-[#0F1117] select-none">
                    {(["flashcard", "choice", "text"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`py-2 text-xs font-semibold rounded-lg capitalize transition-all ${mode === m
                            ? "bg-[#7C5CFF] text-white shadow-lg shadow-[#7C5CFF]/20"
                            : "text-[#9CA3AF] hover:text-white"
                          }`}
                      >
                        {m === "choice" ? t("choice") : m === "text" ? t("text") : t("flashcard")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Session Length */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest text-[#9CA3AF] font-bold">{t("select_length")}</label>
                  <div className="grid grid-cols-3 gap-2 bg-[#171A22] p-1 rounded-xl border border-[#0F1117] select-none">
                    {(["10", "20", "all"] as const).map((len) => (
                      <button
                        key={len}
                        onClick={() => setSessionLength(len)}
                        className={`py-2 text-xs font-semibold rounded-lg transition-all ${sessionLength === len
                            ? "bg-[#7C5CFF] text-white shadow"
                            : "text-[#9CA3AF] hover:text-white"
                          }`}
                      >
                        {len === "all" ? t("all_cards") : `${len} ${t("cards")}`}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Row 2: Category lists (granulated selectors) */}
              <div className="space-y-6">
                <label className="text-xs uppercase tracking-widest text-[#9CA3AF] font-bold block">{t("select_custom_sets")}</label>

                {/* HIRAGANA GROUP COLLAPSIBLE */}
                <div className="bg-[#0F1117] border border-[#171A22] rounded-2xl overflow-hidden shadow-inner">

                  {/* Category Header */}
                  <div className="flex items-center justify-between p-4 bg-[#171A22]/40 border-b border-[#171A22] select-none">
                    <div
                      onClick={() => toggleCategoryExpand("hiragana")}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <motion.div
                        animate={{ rotate: expandedCategories.hiragana ? 90 : 0 }}
                        className="text-[#9CA3AF] shrink-0"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="font-bold text-white text-sm">{t("hiragana")}</span>
                        <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]">
                          {getCategoryMastery([...HIRAGANA_BASIC_GROUPS, ...HIRAGANA_EXTENDED_GROUPS])}% {t("mastered")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 select-none shrink-0">
                      <button
                        onClick={() => selectAllCategory([...HIRAGANA_BASIC_GROUPS, ...HIRAGANA_EXTENDED_GROUPS])}
                        className="text-[10px] uppercase font-bold text-[#7C5CFF] hover:text-[#9175ff] px-2 py-1 transition"
                      >
                        {t("all")}
                      </button>
                      <span className="text-[#171A22] text-xs">|</span>
                      <button
                        onClick={() => selectNoneCategory([...HIRAGANA_BASIC_GROUPS, ...HIRAGANA_EXTENDED_GROUPS])}
                        className="text-[10px] uppercase font-bold text-[#9CA3AF] hover:text-white px-2 py-1 transition"
                      >
                        {t("none")}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Grid Content */}
                  <AnimatePresence initial={false}>
                    {expandedCategories.hiragana && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-5 space-y-6 overflow-hidden"
                      >
                        {/* Basic Set */}
                        <div className="space-y-3.5">
                          <h4 className="text-[10px] uppercase tracking-widest text-[#9CA3AF]/60 font-bold border-b border-[#171A22] pb-1.5">{t("basic_set_core")}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {HIRAGANA_BASIC_GROUPS.map((group) => {
                              const checked = selectedGroupIds.includes(group.id);
                              const mastery = getGroupMastery(group);
                              return (
                                <div
                                  key={group.id}
                                  onClick={() => toggleGroup(group.id)}
                                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition-all ${checked
                                      ? "bg-[#7C5CFF]/10 border-[#7C5CFF]/45 text-white"
                                      : "bg-[#171A22] border-[#171A22] text-[#9CA3AF] hover:border-[#7C5CFF]/20 hover:text-white"
                                    }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => { }} // handled by div click
                                      className="accent-[#7C5CFF] w-4 h-4 shrink-0 pointer-events-none"
                                    />
                                    <div className="truncate">
                                      <p className="text-xs font-bold font-mono tracking-wide capitalize truncate">{group.label}</p>
                                      <p className="text-[10px] text-[#9CA3AF] mt-0.5 tracking-wider truncate">{group.display}</p>
                                    </div>
                                  </div>

                                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full shrink-0 ${mastery === 100
                                      ? "bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]"
                                      : mastery > 0
                                        ? "bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B]"
                                        : "bg-[#9CA3AF]/10 border border-[#9CA3AF]/10 text-[#9CA3AF]/60"
                                    }`}>
                                    {mastery}%
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Extended Set */}
                        <div className="space-y-3.5 pt-3">
                          <h4 className="text-[10px] uppercase tracking-widest text-[#9CA3AF]/60 font-bold border-b border-[#171A22] pb-1.5">{t("extended_set_combo")}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {HIRAGANA_EXTENDED_GROUPS.map((group) => {
                              const checked = selectedGroupIds.includes(group.id);
                              const mastery = getGroupMastery(group);
                              return (
                                <div
                                  key={group.id}
                                  onClick={() => toggleGroup(group.id)}
                                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition-all ${checked
                                      ? "bg-[#7C5CFF]/10 border-[#7C5CFF]/45 text-white"
                                      : "bg-[#171A22] border-[#171A22] text-[#9CA3AF] hover:border-[#7C5CFF]/20 hover:text-white"
                                    }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => { }} // handled by div click
                                      className="accent-[#7C5CFF] w-4 h-4 shrink-0 pointer-events-none"
                                    />
                                    <div className="truncate">
                                      <p className="text-xs font-bold font-mono tracking-wide capitalize truncate">{group.label}</p>
                                      <p className="text-[10px] text-[#9CA3AF] mt-0.5 tracking-wider truncate">{group.display}</p>
                                    </div>
                                  </div>

                                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full shrink-0 ${mastery === 100
                                      ? "bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]"
                                      : mastery > 0
                                        ? "bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B]"
                                        : "bg-[#9CA3AF]/10 border border-[#9CA3AF]/10 text-[#9CA3AF]/60"
                                    }`}>
                                    {mastery}%
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* KATAKANA GROUP COLLAPSIBLE */}
                <div className="bg-[#0F1117] border border-[#171A22] rounded-2xl overflow-hidden shadow-inner">

                  {/* Category Header */}
                  <div className="flex items-center justify-between p-4 bg-[#171A22]/40 border-b border-[#171A22] select-none">
                    <div
                      onClick={() => toggleCategoryExpand("katakana")}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <motion.div
                        animate={{ rotate: expandedCategories.katakana ? 90 : 0 }}
                        className="text-[#9CA3AF] shrink-0"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="font-bold text-white text-sm">{t("katakana")}</span>
                        <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]">
                          {getCategoryMastery([...KATAKANA_BASIC_GROUPS, ...KATAKANA_EXTENDED_GROUPS])}% {t("mastered")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 select-none shrink-0">
                      <button
                        onClick={() => selectAllCategory([...KATAKANA_BASIC_GROUPS, ...KATAKANA_EXTENDED_GROUPS, ...KATAKANA_LOOKALIKE_GROUPS])}
                        className="text-[10px] uppercase font-bold text-[#7C5CFF] hover:text-[#9175ff] px-2 py-1 transition"
                      >
                        {t("all")}
                      </button>
                      <span className="text-[#171A22] text-xs">|</span>
                      <button
                        onClick={() => selectNoneCategory([...KATAKANA_BASIC_GROUPS, ...KATAKANA_EXTENDED_GROUPS, ...KATAKANA_LOOKALIKE_GROUPS])}
                        className="text-[10px] uppercase font-bold text-[#9CA3AF] hover:text-white px-2 py-1 transition"
                      >
                        {t("none")}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Grid Content */}
                  <AnimatePresence initial={false}>
                    {expandedCategories.katakana && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-5 space-y-6 overflow-hidden"
                      >
                        {/* Basic Set */}
                        <div className="space-y-3.5">
                          <h4 className="text-[10px] uppercase tracking-widest text-[#9CA3AF]/60 font-bold border-b border-[#171A22] pb-1.5">{t("basic_set_core")}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {KATAKANA_BASIC_GROUPS.map((group) => {
                              const checked = selectedGroupIds.includes(group.id);
                              const mastery = getGroupMastery(group);
                              return (
                                <div
                                  key={group.id}
                                  onClick={() => toggleGroup(group.id)}
                                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition-all ${checked
                                      ? "bg-[#7C5CFF]/10 border-[#7C5CFF]/45 text-white"
                                      : "bg-[#171A22] border-[#171A22] text-[#9CA3AF] hover:border-[#7C5CFF]/20 hover:text-white"
                                    }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => { }} // handled by div click
                                      className="accent-[#7C5CFF] w-4 h-4 shrink-0 pointer-events-none"
                                    />
                                    <div className="truncate">
                                      <p className="text-xs font-bold font-mono tracking-wide capitalize truncate">{group.label}</p>
                                      <p className="text-[10px] text-[#9CA3AF] mt-0.5 tracking-wider truncate">{group.display}</p>
                                    </div>
                                  </div>

                                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full shrink-0 ${mastery === 100
                                      ? "bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]"
                                      : mastery > 0
                                        ? "bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B]"
                                        : "bg-[#9CA3AF]/10 border border-[#9CA3AF]/10 text-[#9CA3AF]/60"
                                    }`}>
                                    {mastery}%
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Extended Set */}
                        <div className="space-y-3.5 pt-3">
                          <h4 className="text-[10px] uppercase tracking-widest text-[#9CA3AF]/60 font-bold border-b border-[#171A22] pb-1.5">{t("extended_set_combo")}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {KATAKANA_EXTENDED_GROUPS.map((group) => {
                              const checked = selectedGroupIds.includes(group.id);
                              const mastery = getGroupMastery(group);
                              return (
                                <div
                                  key={group.id}
                                  onClick={() => toggleGroup(group.id)}
                                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition-all ${checked
                                      ? "bg-[#7C5CFF]/10 border-[#7C5CFF]/45 text-white"
                                      : "bg-[#171A22] border-[#171A22] text-[#9CA3AF] hover:border-[#7C5CFF]/20 hover:text-white"
                                    }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => { }} // handled by div click
                                      className="accent-[#7C5CFF] w-4 h-4 shrink-0 pointer-events-none"
                                    />
                                    <div className="truncate">
                                      <p className="text-xs font-bold font-mono tracking-wide capitalize truncate">{group.label}</p>
                                      <p className="text-[10px] text-[#9CA3AF] mt-0.5 tracking-wider truncate">{group.display}</p>
                                    </div>
                                  </div>

                                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full shrink-0 ${mastery === 100
                                      ? "bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]"
                                      : mastery > 0
                                        ? "bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B]"
                                        : "bg-[#9CA3AF]/10 border border-[#9CA3AF]/10 text-[#9CA3AF]/60"
                                    }`}>
                                    {mastery}%
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Look-Alike Set */}
                        <div className="space-y-3.5 pt-3">
                          <h4 className="text-[10px] uppercase tracking-widest text-[#F59E0B]/70 font-bold border-b border-[#171A22] pb-1.5 flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3 text-[#F59E0B]" /> {t("katakana_lookalike_set")}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {KATAKANA_LOOKALIKE_GROUPS.map((group) => {
                              const checked = selectedGroupIds.includes(group.id);
                              const mastery = getGroupMastery(group);
                              return (
                                <div
                                  key={group.id}
                                  onClick={() => toggleGroup(group.id)}
                                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition-all ${checked
                                      ? "bg-[#F59E0B]/10 border-[#F59E0B]/40 text-white"
                                      : "bg-[#171A22] border-[#171A22] text-[#9CA3AF] hover:border-[#F59E0B]/20 hover:text-white"
                                    }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => { }} // handled by div click
                                      className="accent-[#F59E0B] w-4 h-4 shrink-0 pointer-events-none"
                                    />
                                    <div className="truncate">
                                      <p className="text-xs font-bold font-mono tracking-wide capitalize truncate">{group.label}</p>
                                      <p className="text-[10px] text-[#9CA3AF] mt-0.5 tracking-wider truncate">{group.display}</p>
                                    </div>
                                  </div>

                                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full shrink-0 ${mastery === 100
                                      ? "bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]"
                                      : mastery > 0
                                        ? "bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B]"
                                        : "bg-[#9CA3AF]/10 border border-[#9CA3AF]/10 text-[#9CA3AF]/60"
                                    }`}>
                                    {mastery}%
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

              </div>

            </div>
          )}

          {/* Buy me a Coffee */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => setShowQrisModal(true)}
              className="w-full py-3 px-6 rounded-xl font-bold flex items-center bg-red-500/50 border border-red-500 justify-center gap-2 text-sm  text-white hover:brightness-110 active:brightness-95 transition "
            >
              <span>Buy me a Coffee!</span>
            </button>
          </div>

          {/* Action Trigger Button */}
          <div ref={startButtonRef} className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.00 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              className="w-full py-4 px-8 bg-[#7C5CFF] text-white rounded-xl font-bold flex items-center justify-center space-x-2 text-base  tracking-wider hover:brightness-110 active:brightness-95 transition"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{t("start")}</span>
            </motion.button>
          </div>
        </section>

      </main>

      {/* Floating Start Button for Manual selection mode */}
      <AnimatePresence>
        {selectionMode === "manual" && !isStartButtonVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-45 w-[calc(100%-2rem)] max-w-md px-4 flex flex-col gap-2"
          >
            <button
              onClick={() => setShowQrisModal(true)}
              className="w-full py-2.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 text-sm bg-red-500/50 border border-red-500 text-white hover:brightness-110 active:brightness-95 transition "
            >
              <span>Buy me a Coffee!</span>
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              className="w-full py-4 px-8 bg-[#7C5CFF] text-white rounded-xl font-bold flex items-center justify-center space-x-2 text-base tracking-wider hover:brightness-110 active:brightness-95 shadow-2xl shadow-[#7C5CFF]/40 border border-[#7C5CFF]/20 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{t("start")}</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#171A22] border border-red-500/20 max-w-sm w-full rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <h3 className="text-lg font-bold text-white">{t("reset_progress_title")}</h3>
            <p className="text-sm text-[#9CA3AF]">
              {t("reset_progress_desc")}
            </p>
            <div className="flex items-center justify-end space-x-2.5">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 text-xs font-semibold text-[#9CA3AF] hover:text-white rounded-lg transition"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 text-xs font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              >
                {t("reset_all")}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* QRIS Modal */}
      <AnimatePresence>
        {showQrisModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={() => setShowQrisModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#171A22] border border-[#7C5CFF]/20 max-w-sm w-full rounded-2xl p-6 shadow-2xl space-y-5 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowQrisModal(false)}
                className="absolute top-4 right-4 text-[#9CA3AF] hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center space-y-1.5">
               
                <h3 className="text-lg font-bold text-white">Buy me a Coffee ☕</h3>
                <p className="text-xs text-[#9CA3AF]">
                  Scan QRIS di bawah untuk mentraktir saya kopi 
                </p>
              </div>

              {/* QRIS Placeholder */}
              <img className="w-full" src="./qrs.jpg" alt="QRIS" />

              {/* Alternative link */}
             
              <a
                href="https://link.dana.id/minta?full_url=https://qr.dana.id/v1/281012012023062413708390"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm bg-[#7C5CFF]/10 border border-[#7C5CFF]/30 text-[#7C5CFF] hover:bg-[#7C5CFF]/20 transition text-center"
              >
                Atau klik disini untuk donasi 
              </a>

              {/* Footer note */}
              <p className="text-center text-[10px] text-[#9CA3AF]">
                Jangan lupa follow instagram @2.shinnra ya... Terima kasih 
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-6 border-t border-[#171A22] text-center text-xs text-[#9CA3AF]">
        {t("footer_designed")} © {new Date().getFullYear()} SIKANA.
      </footer>
    </div>
  );
}
