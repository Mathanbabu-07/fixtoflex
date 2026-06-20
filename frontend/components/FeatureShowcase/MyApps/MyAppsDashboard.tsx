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
  AlertCircle
} from "lucide-react";

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
                    <div className={`w-8 h-8 rounded-xl ${row.logoColor} text-white flex items-center justify-center font-extrabold text-[12px] shadow-xs shrink-0`}>
                      {row.logoLetter}
                    </div>
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
            <div className="bg-gradient-to-tr from-[#1E1B4B] to-[#2d2769] rounded-2xl p-4 shadow-sm text-white space-y-3 relative overflow-hidden">
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

            {/* 3. Upcoming Reminders */}
            <div className="bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-2xl p-4 shadow-xs flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 select-none pb-1.5 border-b border-slate-100">
                <Bell className="w-3.5 h-3.5 text-purple-500" />
                <span>Upcoming Reminders</span>
              </div>
              
              <div className="space-y-2">
                {[
                  { title: "Technical Round", company: "Google", date: "24 May", time: "10:00 AM", color: "bg-purple-500" },
                  { title: "Online Assessment", company: "Microsoft", date: "22 May", time: "11:30 AM", color: "bg-blue-500" }
                ].map((r) => (
                  <div key={r.title} className="flex items-start gap-2.5">
                    <div className={`w-5 h-5 rounded-lg ${r.color} flex items-center justify-center shrink-0 mt-0.5 shadow-xs`}>
                      <Bell className="w-2.5 h-2.5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] font-bold text-[#1E1B4B] truncate">{r.title}</div>
                      <div className="text-[8px] text-slate-400 font-semibold truncate">{r.company}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[9px] font-bold text-[#1E1B4B]">{r.date}</div>
                      <div className="text-[7px] text-slate-400 font-semibold">{r.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <a href="#reminders" className="text-[8px] font-extrabold text-purple-600 hover:text-purple-700 flex items-center gap-0.5 transition-colors group pt-1 border-t border-slate-50 mt-1 select-none">
                View All Reminders
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* BOTTOM MOTIVATION BANNER                                                  */}
        {/* ========================================================================= */}
        <div className="relative bg-gradient-to-r from-purple-50/60 via-indigo-50/40 to-purple-50/60 border border-purple-100/50 backdrop-blur-md rounded-2xl p-5 shadow-xs flex items-center justify-between w-full overflow-hidden mt-2 select-none">
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-purple-300/10 rounded-full blur-2xl pointer-events-none" />
          
          {/* Motivation Text */}
          <div className="space-y-1">
            <h4 className="text-[12px] font-bold text-[#1E1B4B] flex items-center gap-1.5">
              Stay Ahead of the Competition! 🚀
            </h4>
            <p className="text-[10px] text-slate-500 font-medium">
              Timely follow-ups can 2X your chances of getting a response.
            </p>
            
            {/* Quick Actions indicators */}
            <div className="flex items-center gap-4 pt-2 text-[9px] font-bold text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-[8px]">✓</span> Personalize your follow-ups</span>
              <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-[8px]">✓</span> Highlight your achievements</span>
              <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-[8px]">✓</span> Keep it short & professional</span>
            </div>
          </div>

          {/* Action templates CTA */}
          <button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-[9px] px-4.5 py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:scale-102 cursor-pointer select-none">
            View Follow-up Templates →
          </button>
        </div>

        {/* ========================================================================= */}
        {/* DECORATIVE OBJECTS (Folder, Clipboard, Clock, Trophy, Plant, Orbs)          */}
        {/* ========================================================================= */}
        
        {/* 1. Paper Airplane (Top Left path trail) */}
        <div className="absolute top-[-30px] left-[260px] text-purple-400 select-none opacity-60">
          <Send className="w-6 h-6 rotate-15 transform" />
        </div>

        {/* 2. Folder with resumes (Bottom Left) */}
        <div className="absolute bottom-[-45px] left-[-35px] z-20">
          <div className="relative">
            {/* Papers behind */}
            <div className="absolute top-[-10px] left-[6px] w-[54px] h-[58px] bg-slate-50 border border-slate-200 rounded-md rotate-[4] shadow-xs flex flex-col p-1.5 gap-1.5">
              <div className="h-1 bg-purple-300 rounded-full w-4/5" />
              <div className="h-0.5 bg-slate-200 rounded-full w-full" />
              <div className="h-0.5 bg-slate-200 rounded-full w-5/6" />
              <div className="h-0.5 bg-slate-200 rounded-full w-4/5" />
            </div>
            {/* Folder Front */}
            <div className="w-[66px] h-[52px] bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-lg shadow-md relative z-10 flex flex-col p-2">
              <div className="w-6 h-2 bg-violet-600 rounded-t-md absolute top-[-6px] left-[8px] z-0" />
              {/* Folder tab logo mock */}
              <div className="mt-auto w-3 h-3 rounded bg-white/20 flex items-center justify-center">
                <FileText className="w-1.5 h-1.5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Clipboard with checkboxes & Stopwatch (Bottom Center Left) */}
        <div className="absolute bottom-[-55px] left-[45px] z-20 flex items-end gap-2.5">
          {/* Clipboard */}
          <div className="relative w-[60px] h-[72px] bg-white border border-slate-200/80 rounded-lg p-2 flex flex-col gap-1.5 shadow-md">
            <div className="w-5 h-2 bg-slate-300 rounded-t-sm absolute top-[-5px] left-1/2 -translate-x-1/2 flex items-center justify-center">
              <div className="w-2.5 h-0.5 bg-slate-400 rounded-full" />
            </div>
            <div className="h-1 bg-purple-400 rounded-full w-3/4 mt-1" />
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-[8px]"><Check className="w-2 h-2 text-emerald-500 stroke-[3]" /> <span className="h-0.5 bg-slate-200 w-6" /></div>
              <div className="flex items-center gap-1 text-[8px]"><Check className="w-2 h-2 text-emerald-500 stroke-[3]" /> <span className="h-0.5 bg-slate-200 w-8" /></div>
              <div className="flex items-center gap-1 text-[8px]"><div className="w-2 h-2 rounded-full border border-slate-200" /> <span className="h-0.5 bg-slate-200 w-5" /></div>
            </div>
          </div>

          {/* Stopwatch */}
          <div className="relative w-9 h-9 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center shadow-md pb-0.5">
            <div className="relative w-6 h-6 border-2 border-slate-400 rounded-full flex items-center justify-center">
              <div className="w-0.5 h-2.5 bg-slate-800 rounded-full absolute bottom-1/2 origin-bottom left-1/2 -translate-x-1/2" />
              <div className="w-0.5 h-2.5 bg-purple-500 rounded-full absolute bottom-1/2 origin-bottom left-1/2 -translate-x-1/2 rotate-90" />
              <div className="w-1 h-1 bg-slate-800 rounded-full" />
            </div>
            <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-1.5 h-1 bg-slate-400 border border-slate-500 rounded-t-sm" />
          </div>
        </div>

        {/* 4. Trophy (Bottom Right) */}
        <div className="absolute bottom-[-50px] right-[-15px] z-20">
          <div className="relative flex flex-col items-center">
            {/* Trophy shape in SVGs */}
            <div className="w-12 h-12 bg-linear-to-tr from-violet-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg border border-white/20">
              <Award className="w-6 h-6 text-white" />
            </div>
            {/* Pedestal */}
            <div className="w-10 h-3 bg-slate-200 rounded-t-md -mt-1 shadow-xs border-b border-slate-300" />
            <div className="w-14 h-1.5 bg-slate-300 rounded-full" />
          </div>
        </div>

        {/* 5. Small potted plant (Bottom Left-ish) */}
        <div className="absolute bottom-[-45px] left-[150px] z-20 flex flex-col items-center">
          <div className="relative w-9 h-9 flex items-center justify-center mb-[-2px]">
            <div className="absolute w-4 h-4 bg-purple-400/80 rounded-tl-full rounded-br-full rotate-[-45deg] origin-bottom-right bottom-0 right-1/2" />
            <div className="absolute w-4 h-4 bg-indigo-500/80 rounded-tr-full rounded-bl-full rotate-[45deg] origin-bottom-left bottom-0 left-1/2" />
            <div className="absolute w-3.5 h-5 bg-indigo-600/80 rounded-t-full bottom-1" />
          </div>
          <div className="w-6 h-4 bg-slate-100 border border-slate-200 rounded-b-md rounded-t-xs" />
        </div>

        {/* 6. Gradient spheres/particles */}
        <div className="absolute top-[80px] left-[-30px] w-2.5 h-2.5 rounded-full bg-linear-to-br from-purple-400 to-indigo-600 shadow-xs opacity-50" />
        <div className="absolute top-[400px] left-[-45px] w-2 h-2 rounded-full bg-linear-to-br from-yellow-300 to-amber-500 shadow-xs opacity-50" />
        <div className="absolute top-[180px] right-[275px] w-3 h-3 rounded-full bg-linear-to-br from-purple-400 to-indigo-600 shadow-xs opacity-60" />
        <div className="absolute bottom-[10px] right-[-30px] w-2 h-2 rounded-full bg-linear-to-br from-teal-300 to-emerald-500 shadow-xs opacity-50" />

      </div>
    </div>
  );
}
