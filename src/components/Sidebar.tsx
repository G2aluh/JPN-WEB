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
  Award,
  PenTool
} from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const { masteryPercentage, masteredCount, totalCharacters, isLoaded } = useProgress();

  const menuItems = [
    { id: "dashboard", label: t("dashboard"), icon: LayoutDashboard, href: "/" },
    { id: "kana_chart", label: t("kana_chart"), icon: Grid3X3, href: "/practice" },
    { id: "writing", label: t("writing_guide_tab"), icon: PenTool, href: "/writing" },
    { id: "statistics", label: t("statistics"), icon: BarChart2, href: "/statistics" },
    { id: "settings", label: t("settings"), icon: Settings, href: "/settings" },
    { id: "support", label: t("support_me"), icon: Heart, href: "/support" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[280px] bg-card border-r border-border h-screen sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-8 flex items-center space-x-3">
        <span className="text-2xl font-bold text-foreground tracking-tight">
          {t("logo")}
        </span>
        <div className="bg-foreground/5 text-foreground text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-widest border border-border">
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
            <Award className="w-4 h-4 text-foreground" />
          </div>
          
          <div className="flex items-baseline space-x-2 mb-3">
            <span className="text-3xl font-extrabold text-foreground">
              {isLoaded ? `${masteryPercentage}%` : "—"}
            </span>
          </div>

          <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: isLoaded ? `${masteryPercentage}%` : 0 }}
              className="h-full bg-primary"
            />
          </div>

          <p className="text-[10px] text-muted mt-3 font-medium">
            {isLoaded ? `${masteredCount} / ${totalCharacters} ${t("kana")} dikuasai` : ""}
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
                  ? "bg-white text-black" 
                  : "text-muted hover:text-foreground hover:bg-white/5"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-black" : "text-muted group-hover:text-foreground transition-colors"}`} />
              <span className="font-semibold text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-border space-y-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] font-bold text-muted/50 tracking-widest uppercase">Version 2.0.0</span>
          <div className="w-1.5 h-1.5 rounded-full bg-success" />
        </div>
      </div>
    </aside>
  );
}
