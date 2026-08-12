"use client";

import { useProgress } from "@/hooks/useProgress";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Settings, 
  Trash2, 
  AlertTriangle, 
  Check,
  RotateCcw
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const { t } = useLanguage();
  const { resetProgress } = useProgress();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const handleReset = () => {
    resetProgress();
    setIsReset(true);
    setShowConfirm(false);
    setTimeout(() => setIsReset(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-foreground" />
          {t("settings")}
        </h1>
        <p className="text-muted font-medium text-sm sm:text-base">{t("settings_desc")}</p>
      </div>

      <div className="space-y-6">
        {/* Data Management Section */}
        <section className="bg-card border border-border rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3 text-danger">
            <Trash2 className="w-5 h-5" />
            <h2 className="text-xl font-bold tracking-tight">{t("settings_danger_zone")}</h2>
          </div>

          <div className="bg-background border border-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="font-bold text-foreground">{t("reset_progress_title")}</h3>
              <p className="text-xs text-muted max-w-sm leading-relaxed font-medium">
                {t("reset_progress_desc")}
              </p>
            </div>

            <button
              onClick={() => setShowConfirm(true)}
              className="px-6 py-3 bg-danger/10 text-danger border border-danger/20 rounded-xl font-bold text-sm hover:bg-danger hover:text-white transition-all active:scale-95 shrink-0"
            >
              {t("reset_mastery")}
            </button>
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-card border border-border rounded-2xl sm:rounded-3xl p-5 sm:p-8">
          <div className="flex items-start space-x-4">
            <div className="p-2.5 rounded-xl bg-foreground/5 border border-border text-foreground">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-foreground">{t("settings_cloud_sync")}</h3>
              <p className="text-xs text-muted leading-relaxed font-medium">
                {t("settings_cloud_sync_desc")}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-card border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl"
            >
              <div className="w-16 h-16 bg-danger/10 border border-danger/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="w-8 h-8 text-danger" />
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-foreground">{t("settings_confirm_title")}</h3>
                <p className="text-sm text-muted font-medium">
                  {t("settings_confirm_desc")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-4 bg-background border border-border text-foreground rounded-2xl font-bold hover:bg-white/5 transition-all"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-4 bg-danger text-white rounded-2xl font-bold hover:brightness-110 transition-all shadow-sm"
                >
                  {t("reset_all")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Success Toast */}
      <AnimatePresence>
        {isReset && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-success text-white px-6 py-3 rounded-2xl font-bold shadow-xl flex items-center space-x-3"
          >
            <Check className="w-5 h-5" />
            <span>{t("settings_reset_success")}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
