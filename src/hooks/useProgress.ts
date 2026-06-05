"use client";

import { useState, useEffect } from "react";

export interface KanaStats {
  correct: number;
  wrong: number;
}

export interface ProgressState {
  totalCorrect: number;
  totalWrong: number;
  kanaStats: Record<string, KanaStats>;
}

const DEFAULT_STATE: ProgressState = {
  totalCorrect: 0,
  totalWrong: 0,
  kanaStats: {},
};

export function useProgress() {
  const [state, setState] = useState<ProgressState>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("kana_progress_flow_v1");
      if (stored) return JSON.parse(stored);
    }
    return DEFAULT_STATE;
  });
  
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Save progress to localStorage whenever state changes
  const saveState = (newState: ProgressState) => {
    setState(newState);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("kana_progress_flow_v1", JSON.stringify(newState));
      } catch (e) {
        console.error("Failed to save progress to localStorage", e);
      }
    }
  };

  const recordAnswer = (character: string, isCorrect: boolean) => {
    const currentStats = state.kanaStats[character] || { correct: 0, wrong: 0 };
    
    const updatedStats = {
      correct: isCorrect ? currentStats.correct + 1 : currentStats.correct,
      wrong: !isCorrect ? currentStats.wrong + 1 : currentStats.wrong,
    };

    const newState: ProgressState = {
      totalCorrect: isCorrect ? state.totalCorrect + 1 : state.totalCorrect,
      totalWrong: !isCorrect ? state.totalWrong + 1 : state.totalWrong,
      kanaStats: {
        ...state.kanaStats,
        [character]: updatedStats,
      },
    };

    saveState(newState);
  };

  const resetProgress = () => {
    saveState(DEFAULT_STATE);
  };

  // Compute mastery percentage
  // A kana is considered "mastered" if the user has answered it correctly at least 1 time and maintains a >= 66% correct rate.
  const totalCharacters = 92;
  const masteredCount = Object.keys(state.kanaStats).filter((char) => {
    const stats = state.kanaStats[char];
    if (!stats) return false;
    const total = stats.correct + stats.wrong;
    return stats.correct >= 1 && stats.correct / total >= 0.66;
  }).length;

  const masteryPercentage = totalCharacters > 0 
    ? Math.round((masteredCount / totalCharacters) * 100) 
    : 0;

  return {
    totalCorrect: state.totalCorrect,
    totalWrong: state.totalWrong,
    kanaStats: state.kanaStats,
    masteryPercentage,
    masteredCount,
    totalCharacters,
    recordAnswer,
    resetProgress,
    isLoaded,
  };
}
