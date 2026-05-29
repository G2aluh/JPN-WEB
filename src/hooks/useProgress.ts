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
  const [state, setState] = useState<ProgressState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kana_progress_flow_v1");
      if (stored) {
        setState(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load progress from localStorage", e);
    }
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
  // A kana is considered "mastered" if the user has answered it correctly at least 2 times and maintains a >= 66% correct rate.
  const totalCharacters = 92;
  const masteredCount = Object.keys(state.kanaStats).filter((char) => {
    const stats = state.kanaStats[char];
    if (!stats) return false;
    const total = stats.correct + stats.wrong;
    return stats.correct >= 2 && stats.correct / total >= 0.66;
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
