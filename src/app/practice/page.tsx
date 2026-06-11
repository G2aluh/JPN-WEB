"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Grid3X3, BookOpen } from "lucide-react";
import { useState } from "react";
import { 
  HIRAGANA_BASIC_GROUPS, 
  KATAKANA_BASIC_GROUPS 
} from "@/data/groups";

export default function KanaChartPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveLayer] = useState<"hiragana" | "katakana">("hiragana");

  const groups = activeTab === "hiragana" ? HIRAGANA_BASIC_GROUPS : KATAKANA_BASIC_GROUPS;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Grid3X3 className="w-8 h-8 text-primary" />
            {t("kana_chart")}
          </h1>
          <p className="text-muted font-medium">{t("practice_desc")}</p>
        </div>

        <div className="flex bg-card p-1 rounded-2xl border border-border">
          <button
            onClick={() => setActiveLayer("hiragana")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === "hiragana" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted hover:text-white"
            }`}
          >
            {t("hiragana")}
          </button>
          <button
            onClick={() => setActiveLayer("katakana")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === "katakana" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted hover:text-white"
            }`}
          >
            {t("katakana")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-card border border-border rounded-3xl p-6 space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold border-b border-border pb-3">
              {group.label}
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {group.characters.map((char, idx) => (
                <div 
                  key={char} 
                  className="bg-background border border-border rounded-xl p-3 flex flex-col items-center justify-center group hover:border-primary/40 transition-all cursor-default"
                >
                  <span className="text-2xl font-bold text-white mb-1 group-hover:scale-110 transition-transform">
                    {char}
                  </span>
                  <span className="text-[10px] font-mono text-muted uppercase font-bold">
                    {group.romaji[idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-primary/5 border border-primary/10 rounded-2xl sm:rounded-[32px] flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 rounded-2xl bg-primary/10 text-primary">
          <BookOpen className="w-8 h-8" />
        </div>
        <div className="space-y-1 text-center md:text-left">
          <h4 className="text-lg font-bold text-white">{t("practice_cta_title")}</h4>
          <p className="text-sm text-muted">{t("practice_cta_desc")}</p>
        </div>
        <button 
          onClick={() => window.location.href = "/"}
          className="md:ml-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
        >
          {t("practice_go_dashboard")}
        </button>
      </div>
    </div>
  );
}
