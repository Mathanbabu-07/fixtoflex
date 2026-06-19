"use client";

import React from "react";
import { motion, useTransform } from "framer-motion";
import { ArrowUpRight, TrendingUp } from "lucide-react";

interface AISuggestionsCardProps {
  mouseX: any;
  mouseY: any;
}

export default function AISuggestionsCard({ mouseX, mouseY }: AISuggestionsCardProps) {
  // Translate cursor movement into Parallax displacement
  const px = useTransform(mouseX, (v: number) => v * 0.045);
  const py = useTransform(mouseY, (v: number) => v * 0.045);

  return (
    <motion.div
      style={{ x: px, y: py, willChange: "transform" }}
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.5, type: "spring", stiffness: 90 }}
      whileHover={{ scale: 1.04, rotateY: -3, rotateX: 3 }}
      className="absolute bottom-[16%] right-[-8%] sm:right-[-12%] lg:right-[-18%] xl:right-[-14%] p-[1px] rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-500 bg-[length:200%_auto] animate-[shimmer_4s_linear_infinite] shadow-[0_15px_35px_rgba(124,58,237,0.15)] overflow-hidden select-none"
    >
      <div className="bg-white/90 backdrop-blur-xl p-3 sm:p-4 rounded-[15px] w-[180px] sm:w-[230px] flex flex-col gap-3 relative">
        {/* Glow pulse layer */}
        <div className="absolute -inset-1 rounded-[15px] bg-purple-500/5 blur-md animate-pulse pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-800">
              AI Suggestion
            </span>
            <span className="text-[8px] font-extrabold text-white bg-purple-600 px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90">
              New
            </span>
          </div>
        </div>

        {/* Suggestion Info block */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[10px] text-slate-500 leading-normal font-medium">
              Add more skills to increase your profile visibility.
            </p>
          </div>
        </div>

        {/* Action Link */}
        <a 
          href="#view-suggestions"
          className="text-[10px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-0.5 mt-1 border-t border-slate-100/80 pt-2 transition-colors group"
        >
          View Suggestions
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </motion.div>
  );
}
