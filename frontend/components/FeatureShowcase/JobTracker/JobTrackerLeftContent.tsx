"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

interface JobTrackerLeftContentProps {
  tabIndexStr?: string;
}

export default function JobTrackerLeftContent({ tabIndexStr = "03 / 05" }: JobTrackerLeftContentProps) {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const featureList = [
    "Track Applications in One Place",
    "Smart Status & Progress Tracking",
    "AI-Powered Insights & Recommendations",
    "Never Miss a Follow-up",
    "Interview & Task Reminders",
    "Visual Progress Dashboard",
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="flex flex-col items-start text-left space-y-7 max-w-[560px] lg:max-w-none w-full"
    >
      {/* Badge */}
      <motion.div
        variants={itemVariants}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100/60 shadow-sm text-purple-700 text-xs font-extrabold select-none"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600" />
        </span>
        {tabIndexStr}
      </motion.div>

      {/* Heading */}
      <motion.h2
        variants={itemVariants}
        className="font-extrabold text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.12] tracking-tight text-[#1E1B4B] w-full"
      >
        Track Every{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 drop-shadow-xs">
          Opportunity
        </span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        variants={itemVariants}
        className="text-[15px] sm:text-[16px] leading-[1.6] text-slate-500 font-medium"
      >
        Stay organized, never miss a follow-up, and move closer to your dream job.
      </motion.p>

      {/* AI Insight Card */}
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -3 }}
        className="w-full bg-purple-50/40 hover:bg-purple-50/60 border border-purple-100/50 backdrop-blur-md p-4 rounded-xl shadow-xs transition-all duration-300 relative group overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex gap-3">
          <span className="text-lg mt-0.5 shrink-0 select-none">✨</span>
          <div className="space-y-1">
            <h4 className="text-[13px] font-bold text-[#1E1B4B]">
              Get more personalized insights
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal font-medium">
              Our AI analyzes your applications, identifies trends, and recommends the next best action for every opportunity.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Feature Checklist */}
      <motion.ul variants={containerVariants} className="w-full space-y-3 pt-2">
        {featureList.map((feature) => (
          <motion.li
            key={feature}
            variants={itemVariants}
            whileHover={{ x: 6 }}
            className="flex items-center gap-3 text-[13px] sm:text-[14px] font-semibold text-slate-600 cursor-pointer select-none group transition-colors hover:text-slate-800"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="w-5 h-5 rounded-full bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0 shadow-xs"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </motion.div>
            <span className="transition-transform duration-300">{feature}</span>
          </motion.li>
        ))}
      </motion.ul>

      {/* CTA Button */}
      <motion.div variants={itemVariants} className="pt-4">
        <motion.button
          whileHover={{
            scale: 1.03,
            y: -2,
            boxShadow: "0 10px 25px rgba(124, 58, 237, 0.25)",
          }}
          whileTap={{ scale: 0.98 }}
          className="px-7 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 group shadow-lg transition-all duration-300 cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
