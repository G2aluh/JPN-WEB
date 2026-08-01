"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  color?: string;
  delay?: number;
}

export default function StatCard({ 
  label, 
  value, 
  subValue, 
  icon: Icon, 
  color = "text-primary",
  delay = 0 
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-card rounded-2xl p-6 border border-border hover:border-white/15 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-[0.15em] text-muted font-bold group-hover:text-foreground transition-colors">
          {label}
        </span>
        <div className={`p-2 rounded-xl bg-background border border-border group-hover:border-white/15 transition-all`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
      </div>

      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-extrabold text-foreground tracking-tight">
          {value}
        </span>
        {subValue && (
          <span className="text-xs text-muted font-medium">
            {subValue}
          </span>
        )}
      </div>
    </motion.div>
  );
}
