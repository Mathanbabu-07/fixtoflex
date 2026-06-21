"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  ChevronDown, 
  LayoutGrid, 
  FileText, 
  Send, 
  Clock, 
  Award, 
  XCircle, 
  MoreVertical,
  Check,
  Sparkles,
  Bell,
  MapPin,
  Calendar,
  Briefcase,
  AlertCircle,
  ArrowRight
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  COMPANY LOGO                                                       */
/* ------------------------------------------------------------------ */
function CompanyLogo({ name, color }: { name: string; color: string }) {
  const logoName = name.toLowerCase();
  let logoContent = null;
  let bgStyle = { backgroundColor: color };

  if (logoName === "google") {
    bgStyle = { backgroundColor: "#FFFFFF" };
    logoContent = (
      <svg viewBox="0 0 24 24" className="w-4 h-4">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
      </svg>
    );
  } else if (logoName === "microsoft") {
    bgStyle = { backgroundColor: "#FFFFFF" };
    logoContent = (
      <svg viewBox="0 0 23 23" className="w-4 h-4">
        <rect x="0" y="0" width="10.5" height="10.5" fill="#F25022"/>
        <rect x="11.5" y="0" width="10.5" height="10.5" fill="#7FBA00"/>
        <rect x="0" y="11.5" width="10.5" height="10.5" fill="#00A4EF"/>
        <rect x="11.5" y="11.5" width="10.5" height="10.5" fill="#FFB900"/>
      </svg>
    );
  } else if (logoName === "amazon") {
    bgStyle = { backgroundColor: "#FFFFFF" };
    logoContent = (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]">
        <path fill="#FF9900" d="M18.8 17.85c-2.3 1.83-5.75 2.85-8.77 2.85-4.22 0-7.9-1.92-9.98-4.9-.22-.32.02-.65.36-.45 2.37 1.4 5.3 2.22 8.35 2.22 2.76 0 5.82-.68 8.16-2.04.38-.22.65.1.13.32v-.01z"/>
        <path fill="#232F3E" d="M11.95 5.56c-2.2 0-4.08 1.4-4.08 4.2 0 2.2 1.3 3.65 3.3 3.65 1.5 0 2.44-.8 2.94-1.57l.08.06c.07.28.2.4.45.4h2.2c-.15-.46-.3-.98-.3-1.78v-4.5c0-2.48-1.56-4.66-4.59-4.66zm.85 6.78c-.28.43-.83.83-1.46.83-.8 0-1.22-.64-1.22-1.63 0-1.45.86-2.15 2.68-2.15v2.95zm6.54 6.72c-.22.18-.32.32-.2.53l.42.66c.2.32.48.24.76-.05 1.25-1.28 2.03-2.9 2.03-4.75 0-3.32-2.15-5.77-5.58-5.77-2.37 0-4.23 1.2-4.94 2.8-.1.25 0 .4.22.42l.74.07c.23 0 .34-.1.45-.3.52-1.07 1.8-1.94 3.52-1.94 2.5 0 3.86 1.7 3.86 4.3 0 1.2-.55 2.63-1.28 3.56v.47z"/>
      </svg>
    );
  } else if (logoName === "adobe") {
    logoContent = (
      <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] fill-white">
        <path d="M14.6 2h7.4v19.8l-7.4-19.8zm-5.2 0H2v19.8L9.4 2zm2.6 6.4L17.2 22h-3.2l-2-4.8H8l2.8-5.9z"/>
      </svg>
    );
  } else if (logoName === "infosys") {
    logoContent = (
      <svg viewBox="0 0 24 24" className="w-4 h-4">
        <text x="12" y="17" fill="#FFFFFF" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="13" textAnchor="middle">I</text>
      </svg>
    );
  } else {
    logoContent = name[0];
  }

  return (
    <div
      className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-extrabold text-[12px] shadow-xs shrink-0 border ${
        logoName === "google" || logoName === "microsoft" || logoName === "amazon"
          ? "border-slate-200/60"
          : "border-transparent"
      }`}
      style={bgStyle}
    >
      {logoContent}
    </div>
  );
}

export default function MyAppsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("Newest First");

  // Summary statistics
  const stats = [
    { label: "Total Applications", count: 18, change: "+12%", isPositive: true, icon: FileText, bgColor: "bg-purple-100 text-purple-600" },
    { label: "Interview", count: 5, change: "+25%", isPositive: true, icon: Send, bgColor: "bg-blue-100 text-blue-600" },
    { label: "Assessment", count: 3, change: "+8%", isPositive: true, icon: Clock, bgColor: "bg-amber-100 text-amber-600" },
    { label: "Offers", count: 2, change: "+100%", isPositive: true, icon: Award, bgColor: "bg-emerald-100 text-emerald-600" },
    { label: "Rejected", count: 8, change: "-10%", isPositive: true, icon: XCircle, bgColor: "bg-rose-100 text-rose-600" }, // -10% rejected is positive (fewer rejections)
  ];

  // Applications table data
  const applications = [
    {
      company: "Google",
      role: "Frontend Developer",
      location: "Bangalore, India",
      status: "Interview",
      nextStep: "Technical Round",
      date: "24 May 2024",
      logoLetter: "G",
      logoColor: "bg-[#4285F4]",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
      dotColor: "bg-emerald-500"
    },
    {
      company: "Microsoft",
      role: "SDE Intern",
      location: "Hyderabad, India",
      status: "Assessment",
      nextStep: "Online Test",
      date: "22 May 2024",
      logoLetter: "M",
      logoColor: "bg-[#00A4EF]",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      dotColor: "bg-amber-500"
    },
    {
      company: "Amazon",
      role: "Full Stack Developer",
      location: "Bangalore, India",
      status: "Applied",
      nextStep: "Follow up in 3 days",
      date: "15 May 2024",
      logoLetter: "A",
      logoColor: "bg-[#FF9900]",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
      dotColor: "bg-blue-500"
    },
    {
      company: "Adobe",
      role: "UI/UX Designer",
      location: "Noida, India",
      status: "Interview",
      nextStep: "HR Round",
      date: "20 May 2024",
      logoLetter: "A",
      logoColor: "bg-[#FF0000]",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
      dotColor: "bg-emerald-500"
    },
    {
      company: "Infosys",
      role: "System Engineer",
      location: "Pune, India",
      status: "Rejected",
      nextStep: "—",
      date: "05 May 2024",
      logoLetter: "I",
      logoColor: "bg-[#007CC3]",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
      dotColor: "bg-rose-500"
    }
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Interview":
        return "bg-purple-50 text-purple-600 border-purple-100";
      case "Assessment":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "Applied":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Rejected":
        return "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  return (
    <div className="scale-[0.62] xs:scale-[0.72] sm:scale-[0.78] md:scale-[0.85] lg:scale-100 origin-center transition-all duration-500 w-full flex flex-col items-center justify-center overflow-visible">
      {/* Container aspect and boundaries */}
      <div className="relative w-full max-w-[980px] flex flex-col gap-6 select-none z-10 pt-4 pb-14 overflow-visible">
        
        {/* ========================================================================= */}
        {/* TOP STATISTICS CARDS                                                      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-5 gap-3.5 w-full">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label}
                className="bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-2xl p-3.5 flex flex-col justify-between shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${stat.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                    {stat.change}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-[20px] font-extrabold text-[#1E1B4B] leading-none mb-0.5">{stat.count}</div>
                  <div className="text-[9px] font-bold text-slate-400 leading-tight">{stat.label}</div>
                  <div className="text-[7px] text-slate-400/80 mt-1">vs last month</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* MAIN BODY GRID                                                            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-[1fr_290px] gap-6 w-full items-start">
          
          {/* LEFT: APPLICATIONS TABLE CARD */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            
            {/* Header controls bar */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#1E1B4B]">Applications</h3>
              
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search applications..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-7 pr-3 py-1.5 w-[140px] bg-slate-50 border border-slate-200/60 rounded-lg outline-hidden text-[9px] font-semibold text-[#1E1B4B] placeholder-slate-400 focus:border-purple-300 transition-colors"
                  />
                </div>

                {/* Status Dropdown */}
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <span>{statusFilter}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <span>{sortBy}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>

                {/* Grid toggle */}
                <div className="w-7 h-7 bg-slate-50 border border-slate-200/60 flex items-center justify-center rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <LayoutGrid className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Applications Table Rows */}
            <div className="flex flex-col border border-slate-100 rounded-xl overflow-hidden bg-white">
              {applications.map((row, idx) => (
                <div 
                  key={row.company + row.role}
                  className="flex items-center justify-between px-4 py-3.5 border-b border-slate-50 hover:bg-slate-50/50 transition-colors duration-200 cursor-pointer select-none"
                >
                  {/* Company Logo + Job details */}
                  <div className="flex items-center gap-3 w-[200px] shrink-0">
                    <CompanyLogo name={row.company} color={row.logoColor.includes("#") ? row.logoColor.match(/#\w+/)?.[0] || "#7C3AED" : "#7C3AED"} />
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-[#1E1B4B] leading-tight block truncate">{row.role}</span>
                      <span className="text-[9px] text-slate-400 font-semibold leading-tight block">{row.company}</span>
                      <div className="flex items-center gap-0.5 text-[8px] text-slate-400/80 font-medium mt-0.5">
                        <MapPin className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{row.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="w-[80px] flex justify-center shrink-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${getStatusStyle(row.status)}`}>
                      {row.status}
                    </span>
                  </div>

                  {/* Next Step / Interview Details */}
                  <div className="w-[120px] shrink-0 text-left">
                    <span className="text-[9px] font-bold text-slate-700 block leading-tight truncate">{row.nextStep}</span>
                    <span className="text-[8px] text-slate-400 font-semibold leading-none block mt-0.5">{row.date}</span>
                  </div>

                  {/* Avatar + Quick Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={row.avatar} 
                        alt="Candidate Headshot" 
                        className="w-7 h-7 rounded-full object-cover border border-slate-100 shadow-xs"
                      />
                      <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white ${row.dotColor}`} />
                    </div>
                    <div className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 px-1 pt-1 select-none">
              <span>Showing 1 to 5 of 18 applications</span>
              
              <div className="flex items-center gap-1">
                <button className="w-6 h-6 border border-slate-200/60 hover:border-slate-300 rounded-lg flex items-center justify-center transition-colors hover:text-slate-600 cursor-pointer">&lt;</button>
                <button className="w-6 h-6 bg-purple-600 text-white rounded-lg flex items-center justify-center cursor-pointer">1</button>
                <button className="w-6 h-6 border border-slate-200/60 hover:border-slate-300 rounded-lg flex items-center justify-center transition-colors hover:text-slate-600 cursor-pointer">2</button>
                <button className="w-6 h-6 border border-slate-200/60 hover:border-slate-300 rounded-lg flex items-center justify-center transition-colors hover:text-slate-600 cursor-pointer">3</button>
                <button className="w-6 h-6 border border-slate-200/60 hover:border-slate-300 rounded-lg flex items-center justify-center transition-colors hover:text-slate-600 cursor-pointer">4</button>
                <button className="w-6 h-6 border border-slate-200/60 hover:border-slate-300 rounded-lg flex items-center justify-center transition-colors hover:text-slate-600 cursor-pointer">&gt;</button>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR PANEL */}
          <div className="flex flex-col gap-5">
            
            {/* 1. Application Strength Card */}
            <div className="bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Application Strength</span>
                <span className="w-4 h-4 rounded-full border border-slate-200/60 flex items-center justify-center text-slate-400 text-[8px]">i</span>
              </div>

              {/* Circular Gauge */}
              <div className="flex items-center justify-center mb-4 relative">
                <div className="absolute w-12 h-12 rounded-full bg-purple-500/5 blur-sm" />
                <svg className="w-[66px] h-[66px] transform -rotate-90">
                  <circle cx="33" cy="33" r="26" stroke="#F8FAFC" strokeWidth="5.5" fill="transparent" />
                  <circle 
                    cx="33" 
                    cy="33" 
                    r="26" 
                    stroke="#10B981" 
                    strokeWidth="5.5" 
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 26}
                    strokeDashoffset={2 * Math.PI * 26 * (1 - 0.78)}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xs font-extrabold text-[#1E1B4B]">78%</span>
              </div>

              {/* Progress bars list */}
              <div className="space-y-2.5 border-t border-slate-100/80 pt-3">
                {[
                  { name: "Resume Match", val: 80 },
                  { name: "Skills Match", val: 70 },
                  { name: "Experience Match", val: 85 },
                  { name: "Keywords Found", val: 65 },
                ].map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-[9px] font-bold text-slate-500">
                      <span className="flex items-center gap-1.5 select-none"><Check className="w-3 h-3 text-purple-600 stroke-[2.5]" />{item.name}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: `${item.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. AI Insight Card */}
            <div className="bg-linear-to-tr from-[#1E1B4B] to-[#2d2769] rounded-2xl p-4 shadow-sm text-white space-y-3 relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-20%] w-24 h-24 bg-purple-500/10 rounded-full blur-xl" />
              
              <div className="flex items-center justify-between text-[10px] font-bold text-purple-300">
                <span className="flex items-center gap-1.5 select-none"><Sparkles className="w-3.5 h-3.5" />AI Insight</span>
                <span className="w-3.5 h-3.5 rounded-full bg-white/10 flex items-center justify-center text-white text-[8px]">!</span>
              </div>
              <p className="text-[10px] text-slate-200 leading-normal font-semibold">
                You have a high chance of hearing back from Google. Consider preparing for system design interviews.
              </p>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-[9px] py-2 rounded-lg transition-all duration-300 shadow-sm cursor-pointer select-none">
                View Suggestions →
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
