"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useProgress } from "@/hooks/useProgress";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Award,
  CheckCircle2,
  Sparkles,
  Zap,
  Play,
  Keyboard,
  Layers,
  LucideIcon,
  ChevronDown
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

// New Components
import KanaGroupCard from "@/components/KanaGroupCard";
import Accordion from "@/components/ui/Accordion";
import Select, { SelectOption } from "@/components/ui/Select";

type Mode = "flashcard" | "choice" | "text" | "matching" | "long-typing";
type Length = "10" | "20" | "50" | "all";
type WritingSystem = "hiragana" | "katakana" | "mixed";

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const {
    totalCorrect,
    totalWrong,
    masteryPercentage,
    masteredCount,
    isLoaded,
    kanaStats
  } = useProgress();

  const mainStartRef = useRef<HTMLButtonElement>(null);
  const [showFloatingStart, setShowFloatingStart] = useState(false);

  const [mode, setMode] = useState<Mode>("flashcard");
  const [sessionLength, setSessionLength] = useState<Length>("10");
  const [writingSystem, setWritingSystem] = useState<WritingSystem>("mixed");
  const [pairsPerPage, setPairsPerPage] = useState<"5" | "10">("5");
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(["h_b_a"]);
  const [isExtHiraganaOpen, setIsExtHiraganaOpen] = useState(false);
  const [isExtKatakanaOpen, setIsExtKatakanaOpen] = useState(false);
  const [isPrefLoaded, setIsPrefLoaded] = useState(false);

  // Load saved preferences after mount
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem("sikana_pref_mode") as Mode | null;
      if (savedMode) setMode(savedMode);
      const savedLength = localStorage.getItem("sikana_pref_length") as Length | null;
      if (savedLength) setSessionLength(savedLength);
      const savedWs = localStorage.getItem("sikana_pref_ws") as WritingSystem | null;
      if (savedWs) setWritingSystem(savedWs);
      const savedPairs = localStorage.getItem("sikana_pref_pairs") as "5" | "10" | null;
      if (savedPairs) setPairsPerPage(savedPairs);
      const savedGroups = localStorage.getItem("sikana_pref_groups");
      if (savedGroups) setSelectedGroupIds(JSON.parse(savedGroups));
    } catch (e) {
      console.error("Failed to load preferences", e);
    } finally {
      setIsPrefLoaded(true);
    }
  }, []);

  // Save preferences only after loading completed
  useEffect(() => {
    if (!isPrefLoaded) return;
    try {
      localStorage.setItem("sikana_pref_mode", mode);
      localStorage.setItem("sikana_pref_length", sessionLength);
      localStorage.setItem("sikana_pref_groups", JSON.stringify(selectedGroupIds));
      localStorage.setItem("sikana_pref_ws", writingSystem);
      localStorage.setItem("sikana_pref_pairs", pairsPerPage);
    } catch (e) {
      console.error("Failed to save preferences", e);
    }
  }, [mode, sessionLength, selectedGroupIds, writingSystem, pairsPerPage, isPrefLoaded]);

  // Scroll listener for floating start button
  useEffect(() => {
    const handleScroll = () => {
      if (!mainStartRef.current) return;
      
      const rect = mainStartRef.current.getBoundingClientRect();
      const isMainStartVisible = rect.top < window.innerHeight && rect.bottom >= 0;
      
      // Show floating button only on mobile and when main start is NOT visible
      const isMobile = window.innerWidth < 1024;
      setShowFloatingStart(isMobile && !isMainStartVisible);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Mode Options
  const modesList: SelectOption[] = [
    { 
      id: "flashcard", 
      label: t("flashcard_title"), 
      description: t("flashcard_desc"), 
      icon: BookOpen,
      color: "bg-foreground/5 text-foreground"
    },
    { 
      id: "choice", 
      label: t("quiz_title"), 
      description: t("quiz_desc"), 
      icon: Award,
      color: "bg-foreground/5 text-foreground"
    },
    { 
      id: "text", 
      label: t("text_title"), 
      description: t("text_desc"), 
      icon: Sparkles,
      color: "bg-foreground/5 text-foreground"
    },
    { 
      id: "matching", 
      label: t("matching_pair_option"), 
      description: t("matching_pair_desc"), 
      icon: Layers,
      color: "bg-foreground/5 text-foreground"
    },
    { 
      id: "long-typing", 
      label: t("long_typing_title"), 
      description: t("long_typing_desc"), 
      icon: Keyboard,
      color: "bg-foreground/5 text-foreground"
    },
  ];

  // Session Length Options
  const lengthOptions: SelectOption[] = [
    { id: "10", label: "10 " + t("cards") },
    { id: "20", label: "20 " + t("cards") },
    { id: "50", label: "50 " + t("cards") },
    { id: "all", label: t("all_cards") },
  ];

  // Writing System Options
  const writingSystemOptions: SelectOption[] = [
    { id: "hiragana", label: t("hiragana") },
    { id: "katakana", label: t("katakana") },
    { id: "mixed", label: t("mixed") },
  ];

  // Pairs Per Page Options
  const pairsOptions: SelectOption[] = [
    { id: "5", label: `5 ${t("pairs")}` },
    { id: "10", label: `10 ${t("pairs")}` },
  ];

  const toggleGroup = (groupId: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const bulkSelect = (groupIds: string[]) => {
    setSelectedGroupIds((prev) => {
      const others = prev.filter(id => !groupIds.includes(id));
      return [...others, ...groupIds];
    });
  };

  const bulkClear = (groupIds: string[]) => {
    setSelectedGroupIds((prev) => prev.filter(id => !groupIds.includes(id)));
  };

  const getGroupMastery = (group: ConsonantGroup) => {
    if (!isLoaded || !kanaStats || !group.characters) return 0;
    let mastered = 0;
    group.characters.forEach((char) => {
      const stats = kanaStats[char];
      if (stats) {
        const total = stats.correct + stats.wrong;
        if (stats.correct >= 1 && stats.correct / total >= 0.66) mastered++;
      }
    });
    return Math.round((mastered / group.characters.length) * 100);
  };

  const handleStart = () => {
    if (mode === "long-typing") {
      router.push(`/long-typing?length=${sessionLength}&type=${writingSystem}`);
      return;
    }

    if (mode === "matching") {
      const allSelectedChars: typeof kanaData = [];
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

      if (allSelectedChars.length === 0) return;
      localStorage.setItem("active_session_kana", JSON.stringify(allSelectedChars));
      router.push(`/matching-pair-v2?pairs=${pairsPerPage}`);
      return;
    }

    if (mode === "text") {
      router.push(`/quiz?type=${writingSystem}&format=text&length=${sessionLength}`);
      return;
    }

    const allSelectedChars: typeof kanaData = [];
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

    if (allSelectedChars.length === 0) return;
    localStorage.setItem("active_session_kana", JSON.stringify(allSelectedChars));
    
    if (mode === "flashcard") {
      router.push(`/flashcard?type=custom&length=${sessionLength}`);
    } else {
      router.push(`/quiz?type=custom&format=${mode}&length=${sessionLength}`);
    }
  };

  const getAccuracy = () => {
    if (!isLoaded || totalCorrect + totalWrong === 0) return 0;
    return Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-12 pb-28 lg:pb-10 overflow-x-hidden">
      
      {/* Welcome Card */}
      <section className="bg-card border border-border rounded-2xl sm:rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/3 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2 lg:hidden">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {t("welcome_back")}
            </h1>
            <p className="text-muted text-sm md:text-base font-medium max-w-md">
              {t("build_muscle_memory")}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
            <StatMini label={t("mastery")} value={isLoaded ? `${masteryPercentage}%` : "—"} icon={Award} color="text-foreground" />
            <StatMini label={t("correct")} value={isLoaded ? totalCorrect : "—"} icon={CheckCircle2} color="text-foreground" />
            <StatMini label={t("accuracy")} value={isLoaded ? `${getAccuracy()}%` : "—"} icon={Zap} color="text-muted" />
            <StatMini label={t("learned")} value={isLoaded ? masteredCount : "—"} icon={BookOpen} color="text-foreground" />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Character Selection */}
        <div className={`lg:col-span-7 space-y-6 ${mode === "text" ? "opacity-30 pointer-events-none grayscale" : ""}`}>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-bold text-foreground flex items-center space-x-2">
              <Layers className="w-5 h-5 text-foreground" />
              <span>{t("characters")}</span>
            </h2>
          </div>

          <Accordion title={t("hiragana")} badge="46 Kana" defaultOpen>
            <div className="space-y-8">
              <div className="space-y-4">
                <SetHeader 
                  title={t("basic_set_core")} 
                  onSelectAll={() => bulkSelect(HIRAGANA_BASIC_GROUPS.map(g => g.id))}
                  onClear={() => bulkClear(HIRAGANA_BASIC_GROUPS.map(g => g.id))}
                  t={t}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {HIRAGANA_BASIC_GROUPS.map((group) => (
                    <KanaGroupCard
                      key={group.id}
                      group={group}
                      isSelected={selectedGroupIds.includes(group.id)}
                      mastery={getGroupMastery(group)}
                      onToggle={toggleGroup}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <SetHeader 
                  title={t("extended_set_combo")} 
                  onSelectAll={() => bulkSelect(HIRAGANA_EXTENDED_GROUPS.map(g => g.id))}
                  onClear={() => bulkClear(HIRAGANA_EXTENDED_GROUPS.map(g => g.id))}
                  t={t}
                  isCollapsible
                  isOpen={isExtHiraganaOpen}
                  onToggle={() => setIsExtHiraganaOpen(!isExtHiraganaOpen)}
                />
                <AnimatePresence initial={false}>
                  {isExtHiraganaOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                        {HIRAGANA_EXTENDED_GROUPS.map((group) => (
                          <KanaGroupCard
                            key={group.id}
                            group={group}
                            isSelected={selectedGroupIds.includes(group.id)}
                            mastery={getGroupMastery(group)}
                            onToggle={toggleGroup}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Accordion>

          <Accordion title={t("katakana")} badge="46 Kana">
            <div className="space-y-8">
              <div className="space-y-4">
                <SetHeader 
                  title={t("basic_set_core")} 
                  onSelectAll={() => bulkSelect(KATAKANA_BASIC_GROUPS.map(g => g.id))}
                  onClear={() => bulkClear(KATAKANA_BASIC_GROUPS.map(g => g.id))}
                  t={t}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {KATAKANA_BASIC_GROUPS.map((group) => (
                    <KanaGroupCard
                      key={group.id}
                      group={group}
                      isSelected={selectedGroupIds.includes(group.id)}
                      mastery={getGroupMastery(group)}
                      onToggle={toggleGroup}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <SetHeader 
                  title={t("extended_set_combo")} 
                  onSelectAll={() => bulkSelect(KATAKANA_EXTENDED_GROUPS.map(g => g.id))}
                  onClear={() => bulkClear(KATAKANA_EXTENDED_GROUPS.map(g => g.id))}
                  t={t}
                  isCollapsible
                  isOpen={isExtKatakanaOpen}
                  onToggle={() => setIsExtKatakanaOpen(!isExtKatakanaOpen)}
                />
                <AnimatePresence initial={false}>
                  {isExtKatakanaOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                        {KATAKANA_EXTENDED_GROUPS.map((group) => (
                          <KanaGroupCard
                            key={group.id}
                            group={group}
                            isSelected={selectedGroupIds.includes(group.id)}
                            mastery={getGroupMastery(group)}
                            onToggle={toggleGroup}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Accordion>
        </div>

        {/* Right: Study Settings */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-28 space-y-6">
            <div className="bg-card border border-border rounded-[24px] p-5 sm:p-8 space-y-8 shadow-sm">
              <h2 className="text-xl font-bold text-foreground flex items-center space-x-2">
                <Zap className="w-5 h-5 text-muted" />
                <span>{t("session_setup")}</span>
              </h2>

              <Select
                label={t("select_mode")}
                options={modesList}
                value={mode}
                onChange={(id) => setMode(id as Mode)}
              />

              <AnimatePresence mode="wait">
                {mode === "text" || mode === "long-typing" ? (
                  <motion.div
                    key="writing-system"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <Select
                      label={t("writing_system")}
                      options={writingSystemOptions}
                      value={writingSystem}
                      onChange={(id) => setWritingSystem(id as WritingSystem)}
                    />
                    <Select
                      label={t("session_length")}
                      options={lengthOptions.filter(o => mode === "long-typing" ? o.id !== "all" : true)}
                      value={sessionLength}
                      onChange={(id) => setSessionLength(id as Length)}
                    />
                  </motion.div>
                ) : mode === "matching" ? (
                  <motion.div
                    key="matching-options"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <Select
                      label={t("pairs_per_page")}
                      options={pairsOptions}
                      value={pairsPerPage}
                      onChange={(id) => setPairsPerPage(id as "5" | "10")}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="standard-options"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <Select
                      label={t("session_length")}
                      options={lengthOptions}
                      value={sessionLength}
                      onChange={(id) => setSessionLength(id as Length)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                ref={mainStartRef}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStart}
                className="w-full py-5 bg-white text-black rounded-2xl font-bold flex items-center justify-center space-x-3 text-lg hover:bg-white/90 transition-all"
              >
                <Play className="w-6 h-6 fill-current" />
                <span>{t("start")}</span>
              </motion.button>
            </div>

            {/* Quick Tips */}
            <div className="p-6 bg-foreground/5 border border-border rounded-2xl">
              <p className="text-xs text-muted font-medium leading-relaxed">
                <Sparkles className="w-3 h-3 inline mr-2" />
                {t("pro_tip")}: {writingSystem === "mixed" ? t("pro_tip_mixed_desc") : t("pro_tip_general_desc")}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Mobile Start Button */}
      <AnimatePresence>
        {showFloatingStart && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-0 right-0 z-50 px-4 lg:hidden"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="w-full py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center space-x-3 text-base shadow-2xl border border-white/10"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{t("start_practice")}</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SetHeaderProps {
  title: string;
  onSelectAll: () => void;
  onClear: () => void;
  t: (key: string) => string;
  isCollapsible?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

function SetHeader({ title, onSelectAll, onClear, t, isCollapsible, isOpen, onToggle }: SetHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 px-1">
      <div 
        className={`flex items-center space-x-1.5 ${isCollapsible ? "cursor-pointer select-none group" : ""}`}
        onClick={isCollapsible ? onToggle : undefined}
      >
        <h4 className="text-[10px] uppercase tracking-widest text-muted font-bold group-hover:text-foreground transition-colors">
          {title}
        </h4>
        {isCollapsible && (
          <ChevronDown 
            className={`w-3.5 h-3.5 text-muted group-hover:text-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </div>
      <div className="flex items-center space-x-4">
        <button 
          onClick={(e) => { e.stopPropagation(); onSelectAll(); }}
          className="text-[9px] uppercase font-bold text-foreground hover:text-muted transition-colors cursor-pointer"
        >
          {t("select_all")}
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onClear(); }}
          className="text-[9px] uppercase font-bold text-muted hover:text-danger transition-colors cursor-pointer"
        >
          {t("clear")}
        </button>
      </div>
    </div>
  );
}

interface StatMiniProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

function StatMini({ label, value, icon: Icon, color }: StatMiniProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-3 lg:p-5 flex flex-col items-center justify-center text-center lg:aspect-square">
      <Icon className={`w-4 h-4 lg:w-8 lg:h-8 mb-1.5 lg:mb-3.5 ${color}`} />
      <span className="text-base lg:text-2xl font-bold lg:font-extrabold text-foreground">{value}</span>
      <span className="text-[10px] lg:text-xs uppercase tracking-wider text-muted font-bold mt-0.5 lg:mt-2">{label}</span>
    </div>
  );
}
