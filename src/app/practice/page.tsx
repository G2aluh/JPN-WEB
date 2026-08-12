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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <Grid3X3 className="w-8 h-8 text-foreground" />
            {t("kana_chart")}
          </h1>
          <p className="text-muted font-medium text-sm sm:text-base">{t("practice_desc")}</p>
        </div>

        <div className="flex bg-card p-1.5 rounded-2xl border border-border">
          <button
            onClick={() => setActiveLayer("hiragana")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === "hiragana"
                ? "bg-white text-black shadow-sm"
                : "text-muted hover:text-foreground hover:bg-white/5"
            }`}
          >
            {t("hiragana")}
          </button>
          <button
            onClick={() => setActiveLayer("katakana")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === "katakana"
                ? "bg-white text-black shadow-sm"
                : "text-muted hover:text-foreground hover:bg-white/5"
            }`}
          >
            {t("katakana")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-card border border-border rounded-2xl sm:rounded-3xl p-6 space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold border-b border-border pb-3">
              {group.label}
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {group.characters.map((char, idx) => (
                <div 
                  key={char} 
                  className="bg-background border border-border rounded-xl p-3 flex flex-col items-center justify-center group hover:border-white/20 transition-all cursor-default"
                >
                  <span className="text-2xl font-bold text-foreground mb-1 group-hover:scale-110 transition-transform">
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

      <div className="p-6 sm:p-8 bg-card border border-border rounded-2xl sm:rounded-3xl flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 rounded-2xl bg-foreground/5 text-foreground border border-border">
          <BookOpen className="w-8 h-8" />
        </div>
        <div className="space-y-1 text-center md:text-left">
          <h4 className="text-lg font-bold text-foreground">{t("practice_cta_title")}</h4>
          <p className="text-sm text-muted font-medium">{t("practice_cta_desc")}</p>
        </div>
        <button 
          onClick={() => window.location.href = "/"}
          className="md:ml-auto px-8 py-4 bg-white text-black rounded-2xl font-bold hover:bg-white/90 transition-all shadow-sm active:scale-[0.98]"
        >
          {t("practice_go_dashboard")}
        </button>
      </div>
    </div>
  );
}
