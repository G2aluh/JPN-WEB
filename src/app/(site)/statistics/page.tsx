"use client";

import { useProgress } from "@/hooks/useProgress";
import { useLanguage } from "@/context/LanguageContext";
import { 
  BarChart2, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Zap,
  TrendingDown,
  Target
} from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "@/components/StatCard";
import {
  HIRAGANA_BASIC_GROUPS,
  HIRAGANA_EXTENDED_GROUPS,
  KATAKANA_BASIC_GROUPS,
  KATAKANA_EXTENDED_GROUPS,
  ConsonantGroup
} from "@/data/groups";

export default function StatisticsPage() {
  const { t } = useLanguage();
  const { 
    totalCorrect, 
    totalWrong, 
    masteryPercentage, 
    masteredCount, 
    totalCharacters, 
    kanaStats,
    isLoaded 
  } = useProgress();

  const getAccuracy = () => {
    if (!isLoaded || totalCorrect + totalWrong === 0) return 0;
    return Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100);
  };

  const calculateTypeProgress = (groups: ConsonantGroup[]) => {
    if (!isLoaded || !kanaStats) return 0;
    let totalChars = 0;
    let mastered = 0;
    groups.forEach((group) => {
      group.characters.forEach((char: string) => {
        totalChars++;
        const stats = kanaStats[char];
        if (stats) {
          const total = stats.correct + stats.wrong;
          if (stats.correct >= 1 && stats.correct / total >= 0.66) mastered++;
        }
      });
    });
    return totalChars > 0 ? Math.round((mastered / totalChars) * 100) : 0;
  };

  const getWeakestCharacters = () => {
    if (!isLoaded || !kanaStats) return [];
    return Object.entries(kanaStats)
      .map(([char, stats]) => ({
        character: char,
        mistakes: stats.wrong,
        accuracy: stats.correct + stats.wrong > 0 
          ? Math.round((stats.correct / (stats.correct + stats.wrong)) * 100) 
          : 0
      }))
      .filter(item => item.mistakes > 0)
      .sort((a, b) => b.mistakes - a.mistakes)
      .slice(0, 10);
  };

  const hProgress = calculateTypeProgress([...HIRAGANA_BASIC_GROUPS, ...HIRAGANA_EXTENDED_GROUPS]);
  const kProgress = calculateTypeProgress([...KATAKANA_BASIC_GROUPS, ...KATAKANA_EXTENDED_GROUPS]);
  const weakest = getWeakestCharacters();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <BarChart2 className="w-8 h-8 text-primary" />
            {t("statistics")}
          </h1>
          <p className="text-muted font-medium">{t("statistics_desc")}</p>
        </div>
      </section>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label={t("mastery")} value={`${masteryPercentage}%`} subValue={`${masteredCount}/${totalCharacters}`} icon={Award} delay={0.1} />
        <StatCard label={t("statistics_accuracy_label")} value={`${getAccuracy()}%`} icon={Zap} color="text-warning" delay={0.2} />
        <StatCard label={t("correct")} value={totalCorrect} icon={CheckCircle2} color="text-success" delay={0.3} />
        <StatCard label={t("statistics_wrong")} value={totalWrong} icon={XCircle} color="text-danger" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Writing System Progress */}
        <section className="bg-card border border-border rounded-[32px] p-8 space-y-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Target className="w-5 h-5 text-primary" />
            {t("statistics_writing_systems")}
          </h2>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-white">{t("hiragana")}</span>
                <span className="text-sm font-mono font-bold text-primary">{hProgress}%</span>
              </div>
              <div className="w-full bg-background h-3 rounded-full overflow-hidden border border-border">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${hProgress}%` }}
                  className="h-full bg-primary"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-white">{t("katakana")}</span>
                <span className="text-sm font-mono font-bold text-primary">{kProgress}%</span>
              </div>
              <div className="w-full bg-background h-3 rounded-full overflow-hidden border border-border">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${kProgress}%` }}
                  className="h-full bg-primary shadow-[0_0_15px_rgba(124,92,255,0.3)]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Weakest Characters */}
        <section className="bg-card border border-border rounded-[32px] p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <TrendingDown className="w-5 h-5 text-danger" />
            {t("statistics_weakest")}
          </h2>

          <div className="space-y-3">
            {weakest.length > 0 ? (
              weakest.map((item) => (
                <div key={item.character} className="flex items-center justify-between p-4 bg-background border border-border rounded-2xl group hover:border-danger/30 transition-all">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-white w-8 text-center">{item.character}</span>
                    <div className="h-8 w-px bg-border" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted font-bold">{t("statistics_mistakes")}</p>
                      <p className="text-sm font-bold text-white">{item.mistakes}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-muted font-bold">{t("statistics_accuracy_label")}</p>
                    <p className={`text-sm font-bold ${item.accuracy < 50 ? "text-danger" : "text-warning"}`}>
                      {item.accuracy}%
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center space-y-2">
                <p className="text-muted text-sm">{t("statistics_no_mistakes")}</p>
                <p className="text-primary text-xs font-bold uppercase tracking-widest">{t("statistics_keep_up")}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
