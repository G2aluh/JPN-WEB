"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { 
  PenTool, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckSquare, 
  Square, 
  Sparkles,
  Grid,
  Info,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  HIRAGANA_BASIC_GROUPS, 
  HIRAGANA_EXTENDED_GROUPS, 
  KATAKANA_BASIC_GROUPS, 
  KATAKANA_EXTENDED_GROUPS 
} from "@/data/groups";
import { getKanaStrokeInfo, CharacterStrokeInfo } from "@/data/strokeData";

// Focused Single Character Card Component (Monochrome Black & White Aesthetic)
function WritingCard({ 
  char, 
  romaji, 
  type,
  onPrev,
  onNext,
  currentIndex,
  totalCount
}: { 
  char: string; 
  romaji: string; 
  type: "hiragana" | "katakana";
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalCount: number;
}) {
  const { t } = useLanguage();
  const strokeInfo: CharacterStrokeInfo = getKanaStrokeInfo(char, romaji, type);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(strokeInfo.strokeCount);
  
  // Canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuideLines, setShowGuideLines] = useState(true);
  const [showUnderlay, setShowUnderlay] = useState(true);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Reset steps and clear canvas when character changes
  useEffect(() => {
    setIsPlaying(false);
    setActiveStep(strokeInfo.strokeCount);
    clearCanvas();
  }, [char, strokeInfo.strokeCount]);

  // Auto-play interval effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= strokeInfo.strokeCount) {
            return 1;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, strokeInfo.strokeCount]);

  // Canvas resolution & stroke setup (Monochrome White Stroke)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 7;
    ctx.strokeStyle = "#FFFFFF";
  }, [char]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  return (
    <motion.div 
      key={char}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="bg-card border border-border rounded-3xl p-5 md:p-8 space-y-6 shadow-xl relative overflow-hidden"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center text-4xl font-extrabold text-foreground shadow-inner select-none">
            {char}
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-2xl font-bold text-foreground capitalize tracking-tight">{romaji}</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-foreground bg-foreground/5 border border-border px-2.5 py-0.5 rounded-full">
                {type}
              </span>
            </div>
            <p className="text-xs text-muted font-medium mt-1">
              {strokeInfo.strokeCount} {t("strokes_total")} &bull; ({currentIndex + 1} / {totalCount})
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Quick Prev / Next Buttons */}
          <button
            onClick={onPrev}
            className="p-2.5 bg-background border border-border hover:border-white/30 text-muted hover:text-foreground rounded-xl transition-all flex items-center space-x-1 text-xs font-bold active:scale-95 shrink-0"
            title="Karakter Sebelumnya (←)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t("prev_char")}</span>
          </button>

          <button
            onClick={onNext}
            className="p-2.5 bg-background border border-border hover:border-white/30 text-muted hover:text-foreground rounded-xl transition-all flex items-center space-x-1 text-xs font-bold active:scale-95 shrink-0"
            title="Karakter Selanjutnya (→)"
          >
            <span className="hidden sm:inline">{t("next_char")}</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Animation Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all active:scale-95 shrink-0 ${
              isPlaying 
                ? "bg-foreground/10 text-foreground border border-border" 
                : "bg-white text-black hover:bg-white/90 shadow-sm"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>{t("pause_animation")}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{t("play_animation")}</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setActiveStep(strokeInfo.strokeCount);
            }}
            className="p-2.5 bg-background border border-border hover:border-white/30 text-muted hover:text-foreground rounded-xl transition-all active:scale-95 shrink-0"
            title="Reset Langkah"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Breakdown Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-foreground" />
            {t("stroke_steps")} ({strokeInfo.strokeCount} {t("step_number")})
          </h4>
          {strokeInfo.tips && (
            <span className="text-[11px] text-foreground bg-foreground/5 px-3 py-1 rounded-lg border border-border font-medium hidden md:inline-block">
              💡 {strokeInfo.tips}
            </span>
          )}
        </div>

        {/* Step-by-Step SVG Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {strokeInfo.strokes.map((step, idx) => {
            const stepNum = idx + 1;
            const isActive = isPlaying ? activeStep === stepNum : activeStep >= stepNum;

            return (
              <div
                key={stepNum}
                onClick={() => {
                  setIsPlaying(false);
                  setActiveStep(stepNum);
                }}
                className={`cursor-pointer rounded-2xl border p-3.5 transition-all duration-200 flex flex-col justify-between space-y-3 ${
                  activeStep === stepNum
                    ? "bg-white/5 border-white shadow-md scale-[1.01]"
                    : isActive
                    ? "bg-card border-border hover:border-white/30"
                    : "bg-background/40 border-border/50 opacity-60 hover:opacity-100"
                }`}
              >
                {/* Step Badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-md border ${
                    activeStep === stepNum
                      ? "bg-white text-black border-white shadow-sm"
                      : "bg-background text-muted border-border"
                  }`}>
                    {t("step_number")} {stepNum}
                  </span>
                  <span className="text-[10px] text-muted font-mono font-bold">
                    {stepNum}/{strokeInfo.strokeCount}
                  </span>
                </div>

                {/* SVG Visual Box */}
                <div className="relative w-full aspect-square bg-[#0A0A0A] rounded-xl border border-border flex items-center justify-center p-3 overflow-hidden select-none shadow-inner">
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 pointer-events-none grid grid-cols-2 grid-rows-2">
                    <div className="border-r border-b border-dashed border-white/10"></div>
                    <div className="border-b border-dashed border-white/10"></div>
                    <div className="border-r border-dashed border-white/10"></div>
                    <div></div>
                  </div>

                  {/* SVG Render */}
                  <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
                    {/* Previous strokes */}
                    {strokeInfo.strokes.slice(0, stepNum - 1).map((s) => (
                      <path
                        key={`prev-${s.strokeNumber}`}
                        d={s.d}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.25)"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}

                    {/* Active stroke in pure crisp white */}
                    <path
                      d={step.d}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                    />

                    {/* Start point marker */}
                    <circle
                      cx={step.startPoint.x}
                      cy={step.startPoint.y}
                      r="4.5"
                      fill="#FFFFFF"
                      className="animate-pulse"
                    />
                    <text
                      x={step.startPoint.x}
                      y={step.startPoint.y - 7}
                      fontSize="9"
                      fontWeight="bold"
                      fill="#FFFFFF"
                      textAnchor="middle"
                    >
                      {stepNum}
                    </text>
                  </svg>
                </div>

                {/* Instruction Text */}
                <p className="text-xs text-muted font-medium line-clamp-2 min-h-[32px]">
                  {step.instruction}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Tracing Canvas */}
      <div className="pt-4 border-t border-border space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <PenTool className="w-3.5 h-3.5 text-foreground" />
            {t("practice_canvas")}
          </h4>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowGuideLines(!showGuideLines)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
                showGuideLines 
                  ? "bg-foreground/10 text-foreground border-border" 
                  : "bg-background text-muted border-border/50"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{t("show_guide_lines")}</span>
            </button>

            <button
              onClick={() => setShowUnderlay(!showUnderlay)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
                showUnderlay 
                  ? "bg-foreground/10 text-foreground border-border" 
                  : "bg-background text-muted border-border/50"
              }`}
            >
              {showUnderlay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Bayangan</span>
            </button>

            {hasDrawn && (
              <button
                onClick={clearCanvas}
                className="px-3 py-1.5 bg-foreground/10 hover:bg-foreground/20 text-foreground border border-border rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t("clear_canvas")}</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 bg-background/60 rounded-2xl p-4 border border-border">
          {/* Canvas Box */}
          <div className="relative w-full max-w-[220px] aspect-square rounded-xl border border-border bg-[#0A0A0A] overflow-hidden touch-none select-none shadow-inner">
            {showGuideLines && (
              <div className="absolute inset-0 pointer-events-none grid grid-cols-2 grid-rows-2">
                <div className="border-r border-b border-dashed border-white/10"></div>
                <div className="border-b border-dashed border-white/10"></div>
                <div className="border-r border-dashed border-white/10"></div>
                <div></div>
              </div>
            )}

            {showUnderlay && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 select-none">
                <span className="text-[125px] font-extrabold text-foreground leading-none">
                  {char}
                </span>
              </div>
            )}

            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full cursor-crosshair relative z-10"
            />
          </div>

          <div className="space-y-2 text-center md:text-left flex-1">
            <h5 className="text-sm font-bold text-foreground flex items-center justify-center md:justify-start gap-2">
              <Info className="w-4 h-4 text-foreground" />
              Latih Memori Otot Anda
            </h5>
            <p className="text-xs text-muted leading-relaxed">
              Gunakan jari atau mouse Anda untuk meniru garis penulisan karakter <strong className="text-foreground">{char} ({romaji})</strong> pada kanvas. Ikuti urutan stroke 1 sampai {strokeInfo.strokeCount}!
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function WritingPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"hiragana" | "katakana">("hiragana");

  const basicGroups = activeTab === "hiragana" ? HIRAGANA_BASIC_GROUPS : KATAKANA_BASIC_GROUPS;
  const extendedGroups = activeTab === "hiragana" ? HIRAGANA_EXTENDED_GROUPS : KATAKANA_EXTENDED_GROUPS;

  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(["h_b_a", "k_b_a"]);
  const [activeCharIndex, setActiveCharIndex] = useState<number>(0);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Compute selected characters array
  const selectedCharacters: { char: string; romaji: string }[] = [];
  const allCurrentGroups = [...basicGroups, ...extendedGroups];

  allCurrentGroups.forEach((group) => {
    if (selectedGroupIds.includes(group.id)) {
      group.characters.forEach((char, idx) => {
        if (!selectedCharacters.some((c) => c.char === char)) {
          selectedCharacters.push({
            char,
            romaji: group.romaji[idx] || ""
          });
        }
      });
    }
  });

  // Clamp active index when selection changes
  useEffect(() => {
    if (activeCharIndex >= selectedCharacters.length) {
      setActiveCharIndex(Math.max(0, selectedCharacters.length - 1));
    }
  }, [selectedCharacters.length, activeCharIndex]);

  // Auto-scroll active pill into view when activeCharIndex changes
  useEffect(() => {
    if (pillRefs.current[activeCharIndex]) {
      pillRefs.current[activeCharIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
  }, [activeCharIndex]);

  const toggleGroup = (groupId: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const selectAllTabGroups = () => {
    const currentTabIds = [...basicGroups, ...extendedGroups].map((g) => g.id);
    setSelectedGroupIds((prev) => Array.from(new Set([...prev, ...currentTabIds])));
  };

  const clearTabGroups = () => {
    const currentTabIds = [...basicGroups, ...extendedGroups].map((g) => g.id);
    setSelectedGroupIds((prev) => prev.filter((id) => !currentTabIds.includes(id)));
  };

  const handlePrevChar = useCallback(() => {
    if (selectedCharacters.length === 0) return;
    setActiveCharIndex((prev) => (prev - 1 + selectedCharacters.length) % selectedCharacters.length);
  }, [selectedCharacters.length]);

  const handleNextChar = useCallback(() => {
    if (selectedCharacters.length === 0) return;
    setActiveCharIndex((prev) => (prev + 1) % selectedCharacters.length);
  }, [selectedCharacters.length]);

  // Keyboard navigation shortcuts (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }
      if (e.key === "ArrowLeft") {
        handlePrevChar();
      } else if (e.key === "ArrowRight") {
        handleNextChar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevChar, handleNextChar]);

  const activeCharObj = selectedCharacters[activeCharIndex];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 overflow-x-hidden">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <PenTool className="w-7 h-7 text-foreground" />
            {t("writing_learn_title")}
          </h1>
          <p className="text-muted font-medium text-xs sm:text-sm">
            {t("writing_learn_desc")}
          </p>
        </div>

        {/* Script Selector Tabs */}
        <div className="flex bg-card p-1 rounded-2xl border border-border self-start md:self-auto">
          <button
            onClick={() => {
              setActiveTab("hiragana");
              setActiveCharIndex(0);
            }}
            className={`px-6 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
              activeTab === "hiragana"
                ? "bg-white text-black shadow-md border border-white"
                : "text-muted hover:text-foreground hover:bg-white/5 font-bold"
            }`}
          >
            {t("hiragana")}
          </button>
          <button
            onClick={() => {
              setActiveTab("katakana");
              setActiveCharIndex(0);
            }}
            className={`px-6 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
              activeTab === "katakana"
                ? "bg-white text-black shadow-md border border-white"
                : "text-muted hover:text-foreground hover:bg-white/5 font-bold"
            }`}
          >
            {t("katakana")}
          </button>
        </div>
      </div>

      {/* Filter Selector Box */}
      <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 space-y-3 shadow-md">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-xs uppercase font-bold tracking-widest text-muted flex items-center gap-2">
            <Grid className="w-3.5 h-3.5 text-foreground" />
            {t("select_character_groups")} ({activeTab.toUpperCase()})
          </h3>

          <div className="flex items-center space-x-2">
            <button
              onClick={selectAllTabGroups}
              className="px-3 py-1 bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border rounded-lg text-xs font-bold transition-all"
            >
              {t("select_all")}
            </button>
            <button
              onClick={clearTabGroups}
              className="px-3 py-1 bg-foreground/5 hover:bg-foreground/10 text-muted hover:text-foreground border border-border rounded-lg text-xs font-bold transition-all"
            >
              {t("clear")}
            </button>
          </div>
        </div>

        {/* Consonant Group Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {basicGroups.map((group) => {
            const isSelected = selectedGroupIds.includes(group.id);
            return (
              <button
                key={group.id}
                onClick={() => toggleGroup(group.id)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-2 border transition-all ${
                  isSelected
                    ? "bg-white text-black border-white shadow-sm font-bold"
                    : "bg-background/60 text-muted border-border hover:border-white/20 hover:text-foreground"
                }`}
              >
                {isSelected ? (
                  <CheckSquare className="w-3.5 h-3.5 text-black" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-muted" />
                )}
                <span>{group.label}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                  isSelected ? "bg-black/10 text-black font-mono" : "bg-foreground/5 text-muted"
                }`}>
                  {group.display}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Character Picker Pills Bar (Non-clipping Horizontal Carousel) */}
      {selectedCharacters.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-2 sm:gap-3 shadow-md w-full max-w-full min-w-0 overflow-hidden">
          <button
            onClick={handlePrevChar}
            className="p-2 sm:p-2.5 rounded-xl bg-background border border-border hover:border-white/30 text-muted hover:text-foreground transition active:scale-95 shrink-0"
            title="Karakter Sebelumnya (←)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Horizontal Scrollable Pills Row */}
          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto py-1 px-1 min-w-0 max-w-full">
            {selectedCharacters.map((c, idx) => {
              const isActive = idx === activeCharIndex;
              return (
                <button
                  key={`${c.char}-${idx}`}
                  ref={(el) => { pillRefs.current[idx] = el; }}
                  onClick={() => setActiveCharIndex(idx)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center border transition-all shrink-0 ${
                    isActive
                      ? "bg-white text-black border-white shadow-lg scale-105 ring-2 ring-white/20"
                      : "bg-background text-muted border-border hover:border-white/30 hover:text-foreground"
                  }`}
                >
                  {c.char}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNextChar}
            className="p-2 sm:p-2.5 rounded-xl bg-background border border-border hover:border-white/30 text-muted hover:text-foreground transition active:scale-95 shrink-0"
            title="Karakter Selanjutnya (→)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Single Card Focused Viewer */}
      {selectedCharacters.length === 0 ? (
        <div className="bg-card border border-border rounded-3xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-foreground/5 border border-border mx-auto flex items-center justify-center text-muted">
            <Info className="w-6 h-6" />
          </div>
          <p className="text-muted text-sm font-medium max-w-md mx-auto">
            {t("no_characters_selected")}
          </p>
        </div>
      ) : activeCharObj ? (
        <WritingCard
          char={activeCharObj.char}
          romaji={activeCharObj.romaji}
          type={activeTab}
          onPrev={handlePrevChar}
          onNext={handleNextChar}
          currentIndex={activeCharIndex}
          totalCount={selectedCharacters.length}
        />
      ) : null}
    </div>
  );
}
