"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Code, Briefcase, Send, Terminal } from "lucide-react";

import FeatureTabs from "./FeatureTabs";
import UpgradeProfileSection from "./Profile/UpgradeProfileSection";
import JobTrackerSection from "./JobTracker/JobTrackerSection";
import MyAppsSection from "./MyApps/MyAppsSection";
import MailSection from "./Mail/MailSection";

export default function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  // Tab info for placeholder displays
  const tabInfo = [
    { name: "Upgrade Your Profile", badge: "01 / 05" },
    { name: "Job Tracker", badge: "02 / 05" },
    { name: "My Applications", badge: "03 / 05" },
    { name: "Draft Email", badge: "04 / 05" },
    { name: "Interview and Placement", badge: "05 / 05" }
  ];

  const renderActiveSection = () => {
    switch (activeTab) {
      case 0:
        return (
          <motion.div
            key="upgrade-profile"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full overflow-visible"
          >
            <UpgradeProfileSection tabIndexStr="01 / 05" />
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            key="job-tracker"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full overflow-visible"
          >
            <JobTrackerSection tabIndexStr="02 / 05" />
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="my-applications"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full overflow-visible"
          >
            <MyAppsSection tabIndexStr="03 / 05" />
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="draft-email"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full overflow-visible"
          >
            <MailSection tabIndexStr="04 / 05" />
          </motion.div>
        );
      case 4:
      default:
        return (
          <motion.div
            key={`placeholder-${activeTab}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full"
          >
            <PlaceholderSection
              badge={tabInfo[activeTab]?.badge || "05 / 05"}
              title={tabInfo[activeTab]?.name || "Interview and Placement"}
            />
          </motion.div>
        );
    }
  };

  return (
    <section className="relative w-full pt-2 pb-16 flex flex-col items-center bg-linear-to-b from-[#f3f0ff] via-[#ffffff] to-[#f8fafc] overflow-hidden">
      
      {/* Visual Separation Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-px bg-linear-to-r from-transparent via-purple-200/50 to-transparent" />

      {/* Sticky Feature Navigation Tabs */}
      <FeatureTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Dynamic Tab Showcase Container */}
      <div className="w-full relative min-h-[600px] flex items-center justify-center overflow-visible">
        <AnimatePresence mode="wait">
          {renderActiveSection()}
        </AnimatePresence>
      </div>
    </section>
  );
}

interface PlaceholderSectionProps {
  badge: string;
  title: string;
}

function PlaceholderSection({ badge, title }: PlaceholderSectionProps) {
  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 py-20 grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 lg:gap-14 items-center overflow-visible">
      {/* Ambient background meshes */}
      <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden bg-slate-50/50 pointer-events-none">
        <div className="absolute top-[25%] left-[20%] w-[450px] h-[450px] rounded-full bg-indigo-200/15 blur-[120px] animate-pulse" />
      </div>

      {/* Left content block */}
      <div className="flex flex-col items-start text-left space-y-7 max-w-[560px] lg:max-w-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/60 shadow-xs text-slate-600 text-xs font-extrabold select-none">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
          {badge}
        </div>
        
        <h2 className="font-extrabold text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.12] tracking-tight text-[#1E1B4B]">
          {title}
        </h2>
        
        <p className="text-[15px] sm:text-[16px] leading-[1.6] text-slate-500 font-medium">
          This feature is currently under active development. FixToFlex is expanding its automated dashboard to include comprehensive toolchains for application flows.
        </p>

        <div className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-2xs flex gap-3">
          <span className="text-lg mt-0.5 shrink-0 select-none">🚀</span>
          <div className="space-y-1">
            <h4 className="text-[13px] font-bold text-[#1E1B4B]">
              Automate Your Entire Job Pipeline
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal font-medium">
              We are working hard to deliver automated mail drafting, ATS analysis, and real-time interview suggestions directly into your dashboard.
            </p>
          </div>
        </div>

        <div className="pt-4">
          <button className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
            <span>Notify Me On Release</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Column (Placeholder graphic) */}
      <div className="w-full flex justify-center lg:justify-end overflow-hidden">
        <div className="relative bg-white border border-slate-200 rounded-3xl w-full aspect-[1.36/1] max-w-[620px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex items-center justify-center overflow-hidden p-8 select-none">
          <div className="absolute inset-0 bg-linear-to-tr from-slate-50 to-indigo-50/20 -z-10" />
          
          <div className="flex flex-col items-center text-center max-w-[320px] space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-500 shadow-xs animate-bounce">
              <Terminal className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-extrabold text-[#1E1B4B]">Building the Interface</h4>
              <p className="text-xs text-slate-400 font-medium">Our engineers are designing a premium SaaS experience for {title}. Stay tuned!</p>
            </div>
            <div className="flex gap-1.5 w-full pt-2">
              <div className="h-1 bg-slate-200 rounded-full flex-1" />
              <div className="h-1 bg-slate-200 rounded-full flex-1" />
              <div className="h-1 bg-purple-500 rounded-full flex-1" />
              <div className="h-1 bg-slate-200 rounded-full flex-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
