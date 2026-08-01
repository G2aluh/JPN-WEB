"use client";

import { ConsonantGroup } from "@/data/groups";
import { Check } from "lucide-react";

interface KanaGroupCardProps {
  group: ConsonantGroup;
  isSelected: boolean;
  mastery: number;
  onToggle: (id: string) => void;
}

export default function KanaGroupCard({
  group,
  isSelected,
  mastery,
  onToggle,
}: KanaGroupCardProps) {
  return (
    <div
      onClick={() => onToggle(group.id)}
      className={`relative flex flex-col justify-between p-4 rounded-xl border cursor-pointer select-none transition-all duration-200 group lg:aspect-square ${
        isSelected
          ? "bg-white/10 border-white/30 text-foreground"
          : "bg-card border-border text-muted hover:border-white/15 hover:text-foreground"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2 min-w-0">
          <div
            className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
              isSelected
                ? "bg-white border-white"
                : "bg-background border-border group-hover:border-white/30"
            }`}
          >
            {isSelected && <Check className="w-3 h-3 text-black" />}
          </div>
          <span className="text-[11px] font-bold font-mono tracking-tight uppercase truncate">
            {group.label}
          </span>
        </div>
        <span
          className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-full ${
            mastery === 100
              ? "bg-foreground/10 text-foreground border border-foreground/20"
              : mastery > 0
              ? "bg-muted/10 text-muted border border-muted/20"
              : "bg-muted/5 text-muted/40 border border-muted/10"
          }`}
        >
          {mastery}%
        </span>
      </div>
      <div className="flex-1 flex items-center justify-center text-xl font-bold tracking-widest text-center mt-1">
        {group.display}
      </div>
    </div>
  );
}
