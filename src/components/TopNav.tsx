"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Grid3X3, 
  BarChart2, 
  Settings, 
  Heart,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TopNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();

  const menuItems = [
    { id: "dashboard", label: t("dashboard"), icon: LayoutDashboard, href: "/" },
    { id: "kana_chart", label: t("kana_chart"), icon: Grid3X3, href: "/practice" },
    { id: "statistics", label: t("statistics"), icon: BarChart2, href: "/statistics" },
    { id: "settings", label: t("settings"), icon: Settings, href: "/settings" },
    { id: "support", label: t("support_me"), icon: Heart, href: "/support" },
  ];

  return (
    <>
      <header className="lg:hidden sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">{t("logo")}</span>
            <div className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-primary/20">
              V2.0
            </div>
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="p-2 text-muted hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[60] w-full max-w-[300px] bg-card border-r border-border shadow-2xl flex flex-col lg:hidden"
            >
              <div className="p-6 flex items-center justify-between border-b border-border">
                <span className="text-xl font-bold text-primary">{t("logo")}</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-muted hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-2 mt-4">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "text-muted hover:text-white hover:bg-background"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-muted"}`} />
                      <span className="font-semibold text-base">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-6 border-t border-border space-y-4">
                <button
                  onClick={() => setLanguage(language === "en" ? "id" : "en")}
                  className="w-full flex items-center justify-between px-4 py-3 bg-background border border-border rounded-xl text-muted"
                >
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold uppercase tracking-wider">
                      {language === "en" ? "English" : "Indonesia"}
                    </span>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
