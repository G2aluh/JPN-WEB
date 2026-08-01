"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, LucideIcon } from "lucide-react";

export interface SelectOption {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  color?: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
}

export default function Select({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder = "Pilih opsi" 
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-3 w-full" ref={containerRef}>
      {label && (
        <label className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold ml-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between p-4 bg-background border rounded-2xl transition-all text-left focus:outline-none select-none group ${
            isOpen ? "border-white/30 shadow-lg shadow-white/5" : "border-border hover:border-white/20"
          }`}
        >
          <div className="flex items-center min-w-0">
            {selectedOption ? (
              <>
                {selectedOption.icon && (
                  <div className={`mr-4 p-2 rounded-xl shrink-0 ${selectedOption.color || "bg-primary/10 text-primary"}`}>
                    <selectedOption.icon className="w-5 h-5" />
                  </div>
                )}
                <div className="truncate">
                    <h4 className="font-bold text-sm text-foreground">{selectedOption.label}</h4>
                  {selectedOption.description && (
                    <p className="text-[10px] text-muted mt-0.5 truncate">{selectedOption.description}</p>
                  )}
                </div>
              </>
            ) : (
              <span className="text-muted text-sm">{placeholder}</span>
            )}
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="ml-4 text-muted group-hover:text-foreground transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 4, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
            >
              <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto">
                {options.map((option) => {
                  const isSelected = option.id === value;
                  const Icon = option.icon;
                  
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        onChange(option.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center p-3 rounded-xl transition-all text-left select-none group ${
                        isSelected
                          ? "bg-white text-black"
                          : "text-muted hover:text-foreground hover:bg-white/5"
                      }`}
                    >
                      {Icon && (
                        <div className={`mr-3 p-2 rounded-lg shrink-0 transition-colors ${
                          isSelected ? "bg-black/20 text-black" : (option.color || "bg-white/5 text-foreground group-hover:text-foreground")
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-xs">{option.label}</h5>
                        {option.description && (
                          <p className={`text-[9px] mt-0.5 truncate ${isSelected ? "text-black/60" : "text-muted"}`}>
                            {option.description}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-black shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
