"use client";

import React, { useEffect, useState } from "react";
import { motion, useTransform } from "framer-motion";
import { Plus } from "lucide-react";

interface SkillsCardProps {
  mouseX: any;
  mouseY: any;
}

export default function SkillsCard({ mouseX, mouseY }: SkillsCardProps) {
  // Parallax transforms
  const px = useTransform(mouseX, (v: number) => v * 0.02);
  const py = useTransform(mouseY, (v: number) => v * 0.02);

  const [fillWidth, setFillWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFillWidth(75);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Tech Icons SVG Paths or simplified vectors
  const skillsList = [
    {
      name: "React",
      color: "bg-blue-50 text-blue-500 border-blue-100",
      icon: (
        <svg className="w-5 h-5 animate-[spin_8s_linear_infinite]" viewBox="-11.5 -10.23174 23 20.46348" xmlns="http://www.w3.org/2000/svg">
          <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
          <g stroke="currentColor" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2"/>
            <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
            <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
          </g>
        </svg>
      )
    },
    {
      name: "TypeScript",
      color: "bg-sky-50 text-sky-600 border-sky-100",
      icon: (
        <span className="font-extrabold text-[10px] tracking-tighter leading-none select-none">TS</span>
      )
    },
    {
      name: "Python",
      color: "bg-amber-50 text-amber-500 border-amber-100",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 110 110" fill="currentColor">
          <path d="M55 2C25.7 2 27.6 14.6 27.6 14.6l.1 13h27.8v3.9H17.4S2 29.8 2 59.2s13.4 29.8 13.4 29.8h8v-11.2c0-8.3 6.7-15 15-15h27.8v-8c0-8.3-6.7-15-15-15H27.7v-7.8c0-8.3 6.7-15 15-15H55V2z"/>
          <path d="M55 108c29.3 0 27.4-12.6 27.4-12.6l-.1-13H54.5v-3.9h38.1S108 80.2 108 50.8s-13.4-29.8-13.4-29.8h-8v11.2c0 8.3-6.7 15-15 15H43.8v8c0 8.3 6.7 15 15 15h23.8v7.8c0 8.3-6.7 15-15 15H55v10z" opacity="0.8"/>
        </svg>
      )
    },
    {
      name: "Node.js",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      )
    }
  ];

  return (
    <motion.div
      style={{ x: px, y: py, willChange: "transform" }}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.04, rotateY: 5, rotateX: 5 }}
      className="absolute bottom-[-10%] left-[-2%] sm:left-[-4%] xl:left-[-2%] w-[180px] sm:w-[210px] bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_10px_30px_rgba(124,58,237,0.1)] p-3 sm:p-4 flex flex-col gap-3 select-none z-20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-40 -z-10" />

      {/* Label */}
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        Top Skills
      </span>

      {/* Tech icon row */}
      <div className="flex items-center gap-1.5">
        {skillsList.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.4,
              delay: 0.5 + index * 0.1,
              type: "spring",
              stiffness: 150
            }}
            whileHover={{ scale: 1.15, y: -2 }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center border ${skill.color} shadow-sm shrink-0 cursor-pointer transition-all duration-300`}
          >
            {skill.icon}
          </motion.div>
        ))}

        {/* Plus Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.9 }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          className="w-8 h-8 rounded-lg flex items-center justify-center border border-dashed border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-400 transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Dynamic Progress indicator */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold">
          <span>MATCH STRENGTH</span>
          <span className="text-purple-600">{fillWidth}%</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${fillWidth}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 1 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
