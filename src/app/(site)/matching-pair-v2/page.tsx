"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProgress } from "@/hooks/useProgress";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Home,
  Trophy,
  Layers
} from "lucide-react";

interface KanaItem {
  character: string;
  romaji: string;
}

export default function MatchingPairPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const { recordAnswer } = useProgress();

  const pairsPerPage = parseInt(searchParams.get("pairs") || "5");
  
  const [allKana, setAllKana] = useState<KanaItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedKana, setSelectedKana] = useState<string | null>(null);
  const [selectedRomaji, setSelectedRomaji] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [wrongMatch, setWrongMatch] = useState<{ kana: string; romaji: string } | null>(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // States for shuffled items on current page
  const [shuffledKana, setShuffledKana] = useState<KanaItem[]>([]);
  const [shuffledRomaji, setShuffledRomaji] = useState<KanaItem[]>([]);

  // Load session
  useEffect(() => {
    const saved = localStorage.getItem("active_session_kana");
    if (saved) {
      const parsed = JSON.parse(saved);
      const shuffled = [...parsed].sort(() => Math.random() - 0.5);
      setAllKana(shuffled);
    } else {
      router.push("/");
    }
  }, [router]);

  // Current page data
  const pageKana = useMemo(() => {
    const start = currentPage * pairsPerPage;
    return allKana.slice(start, start + pairsPerPage);
  }, [allKana, currentPage, pairsPerPage]);

  const totalPages = Math.ceil(allKana.length / pairsPerPage);

  // Update shuffled lists when pageKana changes
  useEffect(() => {
    if (pageKana.length > 0) {
      setShuffledKana([...pageKana].sort(() => Math.random() - 0.5));
      setShuffledRomaji([...pageKana].sort(() => Math.random() - 0.5));
    }
  }, [pageKana]);

  const checkMatch = useCallback((kana: string | null, romaji: string | null) => {
    if (!kana || !romaji) return;

    const kanaItem = pageKana.find(k => k.character === kana);
    
    if (kanaItem && kanaItem.romaji === romaji) {
      // Correct match
      const newMatched = [...matchedPairs, kana];
      setMatchedPairs(newMatched);
      setScore(prev => prev + 1);
      recordAnswer(kana, true);
      setSelectedKana(null);
      setSelectedRomaji(null);

      // Check if page complete
      if (newMatched.length === pageKana.length) {
        if (currentPage + 1 < totalPages) {
          setTimeout(() => {
            setCurrentPage(prev => prev + 1);
            setMatchedPairs([]);
          }, 1000);
        } else {
          setTimeout(() => setIsComplete(true), 1000);
        }
      }
    } else {
      // Wrong match
      setWrongMatch({ kana, romaji });
      recordAnswer(kana, false);
      setTimeout(() => {
        setWrongMatch(null);
        setSelectedKana(null);
        setSelectedRomaji(null);
      }, 1000);
    }
  }, [pageKana, matchedPairs, recordAnswer, currentPage, totalPages]);

  const handleSelectKana = (kana: string) => {
    if (wrongMatch || matchedPairs.includes(kana)) return;
    if (selectedRomaji) {
      checkMatch(kana, selectedRomaji);
    } else {
      setSelectedKana(kana);
    }
  };

  const handleSelectRomaji = (romaji: string) => {
    if (wrongMatch || matchedPairs.some(k => pageKana.find(pk => pk.character === k)?.romaji === romaji)) return;
    if (selectedKana) {
      checkMatch(selectedKana, romaji);
    } else {
      setSelectedRomaji(romaji);
    }
  };

  if (allKana.length === 0) return null;

  if (isComplete) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex p-6 rounded-full bg-warning/10 border border-warning/20 mb-4"
        >
          <Trophy className="w-16 h-16 text-warning" />
        </motion.div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white">{t("matching_complete")}</h1>
          <p className="text-muted">{t("matching_complete_desc")} {allKana.length} {t("matching_pairs")}</p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 flex justify-center gap-12">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">{t("matching_score")}</p>
            <p className="text-3xl font-extrabold text-white">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">{t("kana").toUpperCase()}</p>
            <p className="text-3xl font-extrabold text-white">{allKana.length}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 flex items-center justify-center space-x-2 py-4 bg-primary text-white rounded-2xl font-bold hover:brightness-110 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{t("matching_try_again")}</span>
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex-1 flex items-center justify-center space-x-2 py-4 bg-card border border-border text-white rounded-2xl font-bold hover:bg-background transition-all"
          >
            <Home className="w-5 h-5" />
            <span>{t("return_home")}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Layers className="w-6 h-6 text-primary" />
            {t("matching_title")}
          </h1>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-muted uppercase tracking-widest">
              {t("matching_page")} {currentPage + 1} {t("matching_page_of")} {totalPages}
            </span>
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 w-4 rounded-full transition-all ${
                    i === currentPage ? "bg-primary w-8" : i < currentPage ? "bg-success" : "bg-border"
                  }`} 
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border px-4 py-2 rounded-xl">
          <span className="text-xs font-bold text-muted mr-2">{t("matching_score")}:</span>
          <span className="text-lg font-extrabold text-white">{score}</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-2 gap-8 md:gap-16">
        {/* Left: Kana */}
        <div className="space-y-4">
          <h3 className="text-[10px] uppercase tracking-widest text-muted font-bold ml-2">{t("kana").toUpperCase()}</h3>
          {shuffledKana.map((item) => {
            const isMatched = matchedPairs.includes(item.character);
            const isSelected = selectedKana === item.character;
            const isWrong = wrongMatch?.kana === item.character;

            return (
              <motion.button
                key={item.character}
                disabled={isMatched}
                onClick={() => handleSelectKana(item.character)}
                whileHover={!isMatched ? { scale: 1.02, x: 5 } : {}}
                whileTap={!isMatched ? { scale: 0.98 } : {}}
                className={`w-full p-6 rounded-3xl text-3xl font-bold border-2 transition-all flex items-center justify-between ${
                  isMatched 
                    ? "bg-success/10 border-success/30 text-success opacity-50 cursor-default" 
                    : isWrong
                    ? "bg-danger/10 border-danger/50 text-danger animate-shake"
                    : isSelected
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                    : "bg-card border-border text-white hover:border-primary/40"
                }`}
              >
                <span>{item.character}</span>
                {isMatched && <CheckCircle2 className="w-5 h-5" />}
                {isWrong && <XCircle className="w-5 h-5" />}
              </motion.button>
            );
          })}
        </div>

        {/* Right: Romaji */}
        <div className="space-y-4">
          <h3 className="text-[10px] uppercase tracking-widest text-muted font-bold ml-2 text-right">Romaji</h3>
          {shuffledRomaji.map((item) => {
            const isMatched = matchedPairs.some(k => pageKana.find(pk => pk.character === k)?.romaji === item.romaji);
            const isSelected = selectedRomaji === item.romaji;
            const isWrong = wrongMatch?.romaji === item.romaji;

            return (
              <motion.button
                key={item.romaji}
                disabled={isMatched}
                onClick={() => handleSelectRomaji(item.romaji)}
                whileHover={!isMatched ? { scale: 1.02, x: -5 } : {}}
                whileTap={!isMatched ? { scale: 0.98 } : {}}
                className={`w-full p-6 rounded-3xl text-xl font-bold border-2 transition-all flex items-center justify-between ${
                  isMatched 
                    ? "bg-success/10 border-success/30 text-success opacity-50 cursor-default" 
                    : isWrong
                    ? "bg-danger/10 border-danger/50 text-danger animate-shake"
                    : isSelected
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                    : "bg-card border-border text-white hover:border-primary/40"
                }`}
              >
                {isMatched && <CheckCircle2 className="w-5 h-5" />}
                {isWrong && <XCircle className="w-5 h-5" />}
                <span className="font-mono">{item.romaji}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-center pt-10">
        <button
          onClick={() => router.push("/")}
          className="text-muted hover:text-white flex items-center space-x-2 text-sm font-bold transition-colors"
        >
          <XCircle className="w-4 h-4" />
          <span>{t("matching_cancel_session")}</span>
        </button>
      </div>
    </div>
  );
}
