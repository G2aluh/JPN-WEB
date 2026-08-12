"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import kanaData from "@/data/kana.json";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Home,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Keyboard
} from "lucide-react";

interface KanaItem {
  character: string;
  romaji: string;
  type: string;
}

function FlashcardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  // Load configuration from URL
  const typeParam = searchParams.get("type") || "mixed";
  const lengthParam = searchParams.get("length") || "10";

  const [cards, setCards] = useState<KanaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Initialize and filter cards
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

    // Handle session length (except if "all")
    if (lengthParam === "10") {
      filtered = filtered.sort(() => 0.5 - Math.random()).slice(0, 10);
    } else if (lengthParam === "20") {
      filtered = filtered.sort(() => 0.5 - Math.random()).slice(0, 20);
    }

    setCards(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);

    // Reset shuffling state
    setIsShuffle(false);
    setShuffledIndices([]);
  }, [typeParam, lengthParam]);

  // Handle shuffling logic
  const toggleShuffle = () => {
    if (!isShuffle) {
      // Turn shuffle ON: create a random index order
      const indices = Array.from({ length: cards.length }, (_, i) => i);
      const shuffled = indices.sort(() => Math.random() - 0.5);
      setShuffledIndices(shuffled);
      setCurrentIndex(0);
    } else {
      // Turn shuffle OFF: restore original order
      setShuffledIndices([]);
      setCurrentIndex(0);
    }
    setIsShuffle(!isShuffle);
    setIsFlipped(false);
  };

  // Get active index based on shuffle mode
  const getActiveIndex = useCallback(() => {
    if (isShuffle && shuffledIndices.length > 0) {
      return shuffledIndices[currentIndex];
    }
    return currentIndex;
  }, [isShuffle, shuffledIndices, currentIndex]);

  const activeCard = cards[getActiveIndex()];

  const handleNext = useCallback(() => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150); // slight delay to let flip reset first
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  }, [cards.length]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Keyboard Shortcuts Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleFlip();
      } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        handleNext();
      } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        handlePrev();
      } else if (e.code === "KeyS") {
        toggleShuffle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFlip, handleNext, handlePrev, isShuffle, cards.length]);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-foreground" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between max-w-2xl w-full mx-auto px-4 py-6 sm:py-10 gap-8">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition bg-card border border-border hover:border-white/20 px-3.5 py-2 rounded-xl font-medium"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">{t("home")}</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-xs uppercase font-bold text-muted tracking-widest bg-card border border-border px-3.5 py-2 rounded-xl">
            {typeParam} • {lengthParam === "all" ? t("all") : lengthParam} {t("cards")}
          </span>
        </div>

        <button
          onClick={() => setShowShortcuts(!showShortcuts)}
          className={`flex items-center justify-center p-2 rounded-xl transition ${
            showShortcuts
              ? "bg-white text-black border border-white"
              : "bg-card text-muted hover:text-foreground border border-border"
          }`}
          title="Toggle keyboard shortcuts panel"
        >
          <Keyboard className="w-4 h-4" />
        </button>
      </div>

      {/* Progress indicators */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted px-1 font-mono font-medium">
          <span>{t("progress")}</span>
          <span>{currentIndex + 1} / {cards.length}</span>
        </div>
        <div className="w-full bg-card border border-border h-2 rounded-full overflow-hidden">
          <div
            className="bg-foreground h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Shortcuts Helper Drawer */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border border-border rounded-2xl p-4 overflow-hidden"
          >
            <h4 className="text-xs uppercase tracking-widest text-foreground font-bold mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> {t("keyboard_shortcuts")}
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs text-muted font-medium">
              <div className="flex items-center justify-between">
                <span>{t("flip_card")}</span>
                <kbd className="px-2 py-0.5 bg-background border border-border rounded text-foreground font-mono text-[10px]">Space</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>{t("next_card")}</span>
                <kbd className="px-2 py-0.5 bg-background border border-border rounded text-foreground font-mono text-[10px]">Right Arrow / D</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>{t("prev_card")}</span>
                <kbd className="px-2 py-0.5 bg-background border border-border rounded text-foreground font-mono text-[10px]">Left Arrow / A</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>{t("toggle_shuffle")}</span>
                <kbd className="px-2 py-0.5 bg-background border border-border rounded text-foreground font-mono text-[10px]">S</kbd>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Flashcard Container */}
      <div className="flex-1 flex items-center justify-center py-6 min-h-[340px]">
        <div
          className="relative w-full max-w-[300px] sm:max-w-[320px] h-96 [perspective:1000px] select-none cursor-pointer"
          onClick={handleFlip}
        >
          <motion.div
            className="relative w-full h-full rounded-3xl transition-transform duration-500 shadow-2xl"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Front Side (Japanese Character) */}
            <div
              className={`absolute inset-0 w-full h-full bg-card border-2 rounded-3xl flex flex-col items-center justify-between p-8 [backface-visibility:hidden] transition-all duration-300 ${
                isFlipped ? "border-border pointer-events-none" : "border-white/20"
              }`}
            >
              <div className="w-full flex justify-between items-center text-xs text-muted tracking-wide font-medium">
                <span className="uppercase font-bold">{activeCard.type}</span>
                <span className="opacity-60">{t("front")}</span>
              </div>

              <div className="text-8xl sm:text-9xl font-bold text-foreground tracking-wide font-sans select-text">
                {activeCard.character}
              </div>

              <div className="text-xs text-muted bg-background border border-border px-3.5 py-1.5 rounded-full flex items-center gap-1.5 font-medium">
                <HelpCircle className="w-3.5 h-3.5 text-foreground" />
                <span>{t("tap_reveal")}</span>
              </div>
            </div>

            {/* Back Side (Romaji Answer) */}
            <div
              className={`absolute inset-0 w-full h-full bg-card border-2 rounded-3xl flex flex-col items-center justify-between p-8 [backface-visibility:hidden] [transform:rotateY(180deg)] transition-all duration-300 ${
                isFlipped ? "border-white/30" : "border-border pointer-events-none"
              }`}
            >
              <div className="w-full flex justify-between items-center text-xs text-muted tracking-wide font-medium">
                <span className="uppercase font-bold">{activeCard.type}</span>
                <span className="opacity-60">{t("back")}</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="text-6xl sm:text-7xl font-extrabold text-foreground font-mono tracking-tight select-text">
                  {activeCard.romaji}
                </div>
                <div className="text-3xl font-semibold text-foreground tracking-wide font-sans mt-2 select-text">
                  {activeCard.character}
                </div>
              </div>

              <div className="text-xs text-muted bg-background border border-border px-3.5 py-1.5 rounded-full flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-foreground" />
                <span>{t("standard_romaji")}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center space-x-4">
          {/* Previous Card Button */}
          <button
            onClick={handlePrev}
            className="flex items-center justify-center w-14 h-14 bg-card border border-border hover:border-white/20 text-muted hover:text-foreground rounded-2xl transition-all active:scale-95"
            title="Previous card (Left Arrow / A)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Flip / Reveal Button */}
          <button
            onClick={handleFlip}
            className="flex-1 max-w-[200px] h-14 bg-white hover:bg-white/90 text-black font-bold rounded-2xl tracking-wide shadow-sm transition-all active:scale-95 text-sm uppercase flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isFlipped ? t("show_kana") : t("flip_reveal")}</span>
          </button>

          {/* Next Card Button */}
          <button
            onClick={handleNext}
            className="flex items-center justify-center w-14 h-14 bg-card border border-border hover:border-white/20 text-muted hover:text-foreground rounded-2xl transition-all active:scale-95"
            title="Next card (Right Arrow / D)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Shuffle and Mode toggles */}
        <div className="flex items-center justify-center space-x-3.5">
          <button
            onClick={toggleShuffle}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border transition ${
              isShuffle
                ? "bg-white text-black border-white"
                : "bg-card border-border text-muted hover:text-foreground"
            }`}
            title="Toggle random shuffling (S)"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>{t("shuffle_mode")}: {isShuffle ? t("shuffle_on") : t("shuffle_off")}</span>
          </button>

          <button
            onClick={() => {
              setIsFlipped(false);
              setCurrentIndex(0);
            }}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-card border border-border text-muted hover:text-foreground transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t("reset_deck")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FlashcardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Study Container */}
      <main className="flex-1 flex flex-col justify-center">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-foreground" />
          </div>
        }>
          <FlashcardContent />
        </Suspense>
      </main>
    </div>
  );
}
