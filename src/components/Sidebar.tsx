"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useProgress } from "@/hooks/useProgress";
import { 
  LayoutDashboard, 
  Grid3X3, 
  BarChart2, 
  Settings, 
  Heart, 
  Globe,
  Award
} from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const { masteryPercentage, masteredCount, totalCharacters, isLoaded } = useProgress();

  const menuItems = [
    { id: "dashboard", label: t("dashboard"), icon: LayoutDashboard, href: "/" },
    { id: "kana_chart", label: t("kana_chart"), icon: Grid3X3, href: "/practice" },
    { id: "statistics", label: t("statistics"), icon: BarChart2, href: "/statistics" },
    { id: "settings", label: t("settings"), icon: Settings, href: "/settings" },
    { id: "support", label: t("support_me"), icon: Heart, href: "/support" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[280px] bg-card border-r border-border h-screen sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-8 flex items-center space-x-3">
        <span className="text-2xl font-bold text-primary tracking-tight">
          {t("logo")}
        </span>
        <div className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-widest border border-primary/20">
          V2.0
        </div>
      </div>

      {/* Progress Summary */}
      <div className="px-6 mb-8">
        <div className="bg-background rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-widest text-muted font-bold">
              {t("mastery_percentage")}
            </span>
            <Award className="w-4 h-4 text-primary" />
          </div>
          
          <div className="flex items-baseline space-x-2 mb-3">
            <span className="text-3xl font-extrabold text-white">
              {isLoaded ? `${masteryPercentage}%` : "—"}
            </span>
          </div>

          <div className="w-full bg-card h-1.5 rounded-full overflow-hidden border border-border">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: isLoaded ? `${masteryPercentage}%` : 0 }}
              className="h-full bg-primary"
            />
          </div>

          <p className="text-[10px] text-muted mt-3 font-medium">
            {isLoaded ? `${masteredCount} / ${totalCharacters} ${t("kana")} mastered` : ""}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-muted hover:text-white hover:bg-background"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-muted group-hover:text-primary transition-colors"}`} />
              <span className="font-semibold text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-border space-y-4">
        <button
          onClick={() => setLanguage(language === "en" ? "id" : "en")}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-background border border-border rounded-xl hover:border-primary/30 transition-all text-muted hover:text-white"
        >
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider">{language === "en" ? "English" : "Indonesia"}</span>
          </div>
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{t("language")}</span>
        </button>

        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] font-bold text-muted/50 tracking-widest uppercase">Version 2.0.0</span>
          <div className="w-1.5 h-1.5 rounded-full bg-success" />
        </div>
      </div>
    </aside>
  );
}
