"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  FolderPlus, 
  Activity, 
  Inbox, 
  Mail 
} from "lucide-react";

interface FeatureTabsProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export default function FeatureTabs({ activeTab, setActiveTab }: FeatureTabsProps) {
  const tabs = [
    { label: "Upgrade Your Profile", icon: Sparkles },
    { label: "Portfolio Setup", icon: FolderPlus },
    { label: "Job Tracker", icon: Activity },
    { label: "My Applications", icon: Inbox },
    { label: "Draft Email", icon: Mail }
  ];

  return (
    <div className="w-full flex justify-center sticky top-24 z-40 px-6 py-2">
      {/* Centered Glassmorphic container */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="flex items-center gap-1 sm:gap-2 p-1.5 rounded-2xl bg-white/40 border border-white/20 backdrop-blur-xl shadow-[0_10px_30px_rgba(30,27,75,0.04)] max-w-full overflow-x-auto scrollbar-none"
      >
        {tabs.map((tab, idx) => (
          <TabItem
            key={idx}
            label={tab.label}
            icon={tab.icon}
            isActive={activeTab === idx}
            onClick={() => setActiveTab(idx)}
          />
        ))}
      </motion.div>
    </div>
  );
}

interface TabItemProps {
  label: string;
  icon: any;
  isActive: boolean;
  onClick: () => void;
}

function TabItem({ label, icon: Icon, isActive, onClick }: TabItemProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Local state for magnetic translations
  const [magneticPos, setMagneticPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    
    // Compute offset from middle of button
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Magnetic pull: divide offset by factor (e.g. 5) to keep it subtle
    setMagneticPos({ x: middleX * 0.18, y: middleY * 0.18 });
  };

  const handleMouseLeave = () => {
    setMagneticPos({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ 
        scale: isActive ? 1.05 : 1,
        x: magneticPos.x,
        y: magneticPos.y
      }}
      transition={{ 
        type: "spring", 
        stiffness: 150, 
        damping: 18, 
        mass: 0.1 
      }}
      className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 select-none outline-hidden cursor-pointer whitespace-nowrap transition-colors duration-300 ${
        isActive 
          ? "text-white" 
          : "text-slate-500 hover:text-[#1E1B4B]"
      }`}
    >
      {/* Sliding active pill background */}
      {isActive && (
        <motion.div
          layoutId="activeTabBackground"
          className="absolute inset-0 bg-linear-to-r from-violet-600 to-indigo-600 rounded-xl -z-10 shadow-[0_4px_18px_rgba(124,58,237,0.3)]"
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
        />
      )}

      {/* Underline accent */}
      {isActive && (
        <motion.div
          layoutId="activeTabUnderline"
          className="absolute bottom-1 left-4 right-4 h-[2px] bg-white/45 rounded-full"
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
        />
      )}

      {/* Tab Icon and Label */}
      <span className="flex items-center gap-1.5">
        <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "scale-110" : "group-hover:scale-115"}`} />
        <span>{label}</span>
      </span>
    </motion.button>
  );
}
