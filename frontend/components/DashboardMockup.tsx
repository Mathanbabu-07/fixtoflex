"use client";

import React from "react";
import { 
  Home, 
  Briefcase, 
  FileText, 
  Mail, 
  BarChart2, 
  Settings, 
  Check, 
  CheckCircle2, 
  Search, 
  ArrowRight,
  Bookmark,
  Sparkles,
  Send,
  Volume2
} from "lucide-react";
import FloatingCard from "./FloatingCard";

export default function DashboardMockup() {
  return (
    <div className="relative w-full min-h-[480px] lg:min-h-[620px] flex items-start justify-center pt-2 pb-12 select-none overflow-visible">
      
      {/* BACKGROUND FLOATING ORBS (low opacity, slow animations) */}
      <div className="absolute top-[10%] left-[20%] w-32 h-32 bg-purple-400/10 rounded-full blur-2xl animate-drift-slow" />
      <div className="absolute bottom-[20%] right-[10%] w-40 h-40 bg-blue-400/10 rounded-full blur-2xl animate-drift-slower" />
      <div className="absolute top-[40%] right-[30%] w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl animate-drift-slowest" />

      {/* SVG Dotted Connector Paths (hidden on mobile, visible on desktop) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block z-0" xmlns="http://www.w3.org/2000/svg">
        {/* Profile Enhancer to Laptop Screen */}
        <path 
          d="M 190,200 Q 250,170 320,240" 
          fill="none" 
          stroke="#C7D2FE" 
          strokeWidth="2" 
          strokeDasharray="6,6" 
        />
        {/* Resume Upgrade to Laptop Screen */}
        <path 
          d="M 190,400 Q 250,380 320,320" 
          fill="none" 
          stroke="#C7D2FE" 
          strokeWidth="2" 
          strokeDasharray="6,6" 
        />
        {/* Top Right Match Card to Laptop Screen */}
        <path 
          d="M 830,180 Q 750,120 680,220" 
          fill="none" 
          stroke="#C7D2FE" 
          strokeWidth="2" 
          strokeDasharray="6,6" 
        />
        {/* App Tracker to Laptop Screen */}
        <path 
          d="M 780,550 Q 720,570 650,480" 
          fill="none" 
          stroke="#C7D2FE" 
          strokeWidth="2" 
          strokeDasharray="6,6" 
        />
      </svg>

      {/* 3D PERSPECTIVE CONTAINER FOR THE LAPTOP AND DECORATIONS */}
      <div className="relative w-full max-w-[580px] scale-[0.55] xs:scale-[0.7] sm:scale-[0.8] md:scale-[0.85] lg:scale-[0.85] xl:scale-[0.92] transition-all duration-500 z-10">
        
        {/* MAIN LAPTOP STRUCTURE */}
        <div 
          className="relative transition-transform duration-700 hover:rotate-y-[-10deg] hover:rotate-x-12"
          style={{
            transform: "perspective(1500px) rotateX(12deg) rotateY(-16deg) rotateZ(2deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Laptop Screen Bezel */}
          <div className="relative bg-slate-900 rounded-2xl p-3 shadow-2xl border border-slate-700/50" style={{ transformStyle: "preserve-3d" }}>
            
            {/* Screen Inner Display */}
            <div className="relative bg-slate-50 w-full aspect-[1.45/1] rounded-lg overflow-hidden flex shadow-inner">
              
              {/* LAPTOP SCREEN SIDEBAR */}
              <div className="w-[60px] bg-[#1E1B4B] flex flex-col items-center py-4 justify-between border-r border-slate-200 text-slate-400">
                <div className="flex flex-col items-center gap-6 w-full">
                  {/* Logo block */}
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-extrabold text-white text-base shadow-md">
                    F
                  </div>
                  <div className="w-full h-px bg-indigo-900/40 px-2" />
                  <Home className="w-5 h-5 text-indigo-400 cursor-pointer hover:text-white transition-colors" />
                  <Briefcase className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
                  <FileText className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
                  <Mail className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
                  <BarChart2 className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
                </div>
                <div>
                  <Settings className="w-5 h-5 cursor-pointer hover:text-white transition-colors animate-spin-slow" />
                </div>
              </div>

              {/* LAPTOP SCREEN MAIN CONTENT */}
              <div className="flex-1 flex flex-col p-5 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-200">
                      {/* Premium user avatar */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80" 
                        alt="User Profile" 
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#1E1B4B]">Welcome back,</h4>
                      <p className="text-xs text-[#7C3AED] font-bold">Arjun Kumar 👋</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-medium bg-purple-50 text-purple-600 py-1 px-2.5 rounded-full border border-purple-100">
                    Let&apos;s make your next career move count!
                  </span>
                </div>

                {/* Grid Layout inside Screen */}
                <div className="grid grid-cols-2 gap-4 flex-1">
                  
                  {/* Left Column Inside Screen */}
                  <div className="space-y-4">
                    {/* Profile Strength */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Profile Strength</span>
                      <div className="flex items-center gap-4">
                        <div className="relative flex items-center justify-center">
                          <svg className="w-12 h-12 transform -rotate-90">
                            <circle cx="24" cy="24" r="20" stroke="#F1F5F9" strokeWidth="4" fill="transparent" />
                            <circle cx="24" cy="24" r="20" stroke="#22C55E" strokeWidth="4" fill="transparent"
                              strokeDasharray={125.6} strokeDashoffset={125.6 * (1 - 0.82)} strokeLinecap="round" />
                          </svg>
                          <span className="absolute text-[11px] font-extrabold text-[#1E1B4B]">82%</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800">Strong</span>
                            <span className="text-[9px] font-semibold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md">+12%</span>
                          </div>
                          <span className="text-[9px] text-slate-400">Excellent potential</span>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-[9px] text-slate-600">
                        <div className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-500" /> Skills</div>
                        <div className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-500" /> Experience</div>
                        <div className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-500" /> Projects</div>
                        <div className="flex items-center gap-1 text-slate-300"><span className="w-3 h-3 rounded-full border border-slate-200 inline-block" /> Certs</div>
                      </div>
                    </div>

                    {/* ATS Score Progress Bar */}
                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">ATS Score</span>
                        <span className="text-[10px] font-extrabold text-[#7C3AED]">92/100</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-linear-to-r from-[#7C3AED] to-[#4F46E5] h-full rounded-full w-[92%]" />
                      </div>
                    </div>
                  </div>

                  {/* Right Column Inside Screen */}
                  <div className="space-y-4">
                    {/* Resume Score Card */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Resume Score</span>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center font-bold text-[#10B981] text-xs">
                          87%
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-slate-800 block">Great Match</span>
                          <span className="text-[9px] text-slate-400">Aligned with SWE roles</span>
                        </div>
                      </div>
                      {/* Elegant SVG Mini Chart Line */}
                      <svg className="w-full h-8 mt-2 text-emerald-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <path d="M0,25 Q15,10 30,18 T60,5 T90,20 T100,8" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path d="M0,25 Q15,10 30,18 T60,5 T90,20 T100,8 L100,30 L0,30 Z" fill="url(#chart-grad)" opacity="0.1" />
                        <defs>
                          <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    {/* Top Job Matches */}
                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Top Job Matches</span>
                      <div className="space-y-2">
                        {/* Match 1 */}
                        <div className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-red-100 text-red-500 font-extrabold text-[8px] flex items-center justify-center">G</span>
                            <div>
                              <span className="text-[10px] font-bold text-slate-700 block leading-tight">Software Engineer</span>
                              <span className="text-[8px] text-slate-400 block">Google</span>
                            </div>
                          </div>
                          <span className="text-[9px] font-extrabold text-emerald-500">87%</span>
                        </div>
                        {/* Match 2 */}
                        <div className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-blue-100 text-blue-500 font-extrabold text-[8px] flex items-center justify-center">M</span>
                            <div>
                              <span className="text-[10px] font-bold text-slate-700 block leading-tight">SDE Intern</span>
                              <span className="text-[8px] text-slate-400 block">Microsoft</span>
                            </div>
                          </div>
                          <span className="text-[9px] font-extrabold text-emerald-500">82%</span>
                        </div>
                        {/* Match 3 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-orange-100 text-orange-500 font-extrabold text-[8px] flex items-center justify-center">S</span>
                            <div>
                              <span className="text-[10px] font-bold text-slate-700 block leading-tight">Backend Developer</span>
                              <span className="text-[8px] text-slate-400 block">Swiggy</span>
                            </div>
                          </div>
                          <span className="text-[9px] font-extrabold text-emerald-500">78%</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>

            </div>

            {/* Bottom Screen Notch */}
            <div className="h-2 w-16 bg-slate-950 mx-auto rounded-b-md mt-px" />
          </div>

          {/* Laptop Base and Keyboard (tilted forward) */}
          <div 
            className="relative bg-slate-300 h-6 w-[104%] left-[-2%] rounded-b-xl shadow-2xl border-t border-slate-100 flex items-center justify-center px-10"
            style={{
              transform: "rotateX(75deg) translateY(-8px)",
              transformOrigin: "top center",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
            }}
          >
            {/* Keyboard Keys Layout (simplistic layout) */}
            <div className="w-full h-2.5 bg-slate-400/80 rounded-sm flex items-center justify-between px-2 gap-1">
              <div className="flex-1 h-1 bg-slate-500/30 rounded" />
              <div className="w-8 h-1.5 bg-slate-500/40 rounded-sm" /> {/* Trackpad placeholder */}
              <div className="flex-1 h-1 bg-slate-500/30 rounded" />
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* FLOATING CARDS (Absolutely positioned around the laptop container) */}
        {/* ========================================================================= */}

        {/* 1. Profile Enhancer Card (Top Left) */}
        <FloatingCard 
          className="top-[-60px] left-[-40px] w-[210px] bg-white rounded-2xl shadow-xl border border-slate-100 p-4"
          delay={0}
          duration={4.2}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded bg-purple-50 text-purple-600">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-[12px] font-bold text-[#1E1B4B]">Profile Enhancer</span>
          </div>
          
          <div className="flex items-center gap-3 my-3">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <svg className="w-9 h-9 transform -rotate-90">
                <circle cx="18" cy="18" r="15" stroke="#F1F5F9" strokeWidth="3.5" fill="transparent" />
                <circle cx="18" cy="18" r="15" stroke="#10B981" strokeWidth="3.5" fill="transparent"
                  strokeDasharray={94.2} strokeDashoffset={94.2 * (1 - 0.82)} strokeLinecap="round" />
              </svg>
              <span className="absolute text-[9px] font-extrabold text-[#1E1B4B]">82%</span>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /><span className="text-[10px] text-slate-500 font-medium">Add Skills</span></div>
              <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /><span className="text-[10px] text-slate-500 font-medium">Add Projects</span></div>
              <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /><span className="text-[10px] text-slate-500 font-medium">Add Certificate</span></div>
            </div>
          </div>
          <button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold text-[10px] py-1.5 rounded-lg transition-colors shadow-sm">
            Improve Now
          </button>
        </FloatingCard>

        {/* 2. Resume Upgrade Card (Middle Left) */}
        <FloatingCard 
          className="top-[160px] left-[-60px] w-[190px] bg-white rounded-2xl shadow-xl border border-slate-100 p-4"
          delay={0.8}
          duration={3.8}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1 rounded bg-indigo-50 text-indigo-600">
              <FileText className="w-3.5 h-3.5" />
            </span>
            <span className="text-[12px] font-bold text-[#1E1B4B]">Resume Upgrade</span>
          </div>
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-600">
              <Check className="w-3 h-3 text-emerald-500" /> AI Suggestions
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-600">
              <Check className="w-3 h-3 text-emerald-500" /> Keyword Boost
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-600">
              <Check className="w-3 h-3 text-emerald-500" /> ATS Friendly
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-600">
              <Check className="w-3 h-3 text-emerald-500" /> Better Impact
            </div>
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[10px] py-1.5 rounded-lg transition-colors shadow-sm">
            Upgrade Resume
          </button>
        </FloatingCard>

        {/* 3. Auto Email Draft Card (Bottom Left) */}
        <FloatingCard 
          className="top-[360px] left-[-45px] w-[220px] bg-white rounded-2xl shadow-xl border border-slate-100 p-4"
          delay={1.5}
          duration={4.4}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded bg-[#EEF2F6] text-[#4F46E5]">
              <Mail className="w-3.5 h-3.5" />
            </span>
            <span className="text-[12px] font-bold text-[#1E1B4B]">Auto Email Draft</span>
          </div>
          <div className="space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-3 text-[9px] font-mono text-slate-600">
            <div><span className="text-slate-400">To:</span> recruiter@google.com</div>
            <div><span className="text-slate-400">Subject:</span> Application for SWE Intern</div>
          </div>
          <button className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-[10px] py-1.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5">
            Use This Email
          </button>
        </FloatingCard>

        {/* 4. Find Right Jobs Card (Bottom Center) */}
        <FloatingCard 
          className="bottom-[-100px] left-[176px] w-[270px] bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-20"
          delay={2.2}
          duration={4.0}
        >
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-bold text-[#1E1B4B]">Find Right Jobs</span>
          </div>
          <div className="relative mb-2">
            <input 
              type="text" 
              placeholder="Search roles, skills, companies..." 
              disabled 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[9px] placeholder-slate-400 focus:outline-none"
            />
          </div>
          <div className="text-[9px] text-slate-400 mb-1.5">Recommended for you</div>
          <div className="flex flex-wrap gap-1">
            {["React", "Node.js", "TypeScript", "Python", "AWS"].map((tag) => (
              <span key={tag} className="text-[8px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md cursor-pointer transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </FloatingCard>

        {/* 5. Great Match Card (Top Right) */}
        <FloatingCard 
          className="top-[-40px] right-[-30px] w-[180px] bg-white rounded-2xl shadow-xl border border-slate-100 p-3 flex items-center gap-3"
          delay={0.4}
          duration={4.6}
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Check className="w-4 h-4 stroke-3" />
          </div>
          <div>
            <h5 className="text-[11px] font-extrabold text-[#1E1B4B] leading-tight">Great Match!</h5>
            <p className="text-[9px] text-slate-400 leading-normal">87% match with Google SWE role</p>
          </div>
        </FloatingCard>

        {/* 6. Application Tracker Card (Bottom Right) */}
        <FloatingCard 
          className="top-[310px] right-[-50px] w-[180px] bg-white rounded-2xl shadow-xl border border-slate-100 p-4"
          delay={1.2}
          duration={4.1}
        >
          <div className="flex items-center gap-1.5 mb-3">
            <span className="p-0.5 rounded bg-emerald-50 text-emerald-600">
              <Bookmark className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] font-bold text-[#1E1B4B]">Application Tracker</span>
          </div>
          <div className="space-y-1.5 text-[9px] text-slate-600 mb-3">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Applied</span>
              <span className="font-bold">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Interview</span>
              <span className="font-bold">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Shortlisted</span>
              <span className="font-bold">2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Offer</span>
              <span className="font-bold">1</span>
            </div>
          </div>
          <button className="w-full text-center text-[9px] font-semibold text-[#7C3AED] hover:text-[#4F46E5] flex items-center justify-center gap-0.5 group">
            View All Applications <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </FloatingCard>

        {/* ========================================================================= */}
        {/* EXTRA DECORATIONS (Meganphone, Paper Airplane, Notebook with Pen, Spheres) */}
        {/* ========================================================================= */}

        {/* A. Megaphone (Bottom Right) */}
        <FloatingCard 
          className="bottom-[-110px] right-[-40px] w-20 h-20 flex items-center justify-center text-indigo-500/80 pointer-events-none"
          delay={2.5}
          duration={3.5}
        >
          <div className="relative transform rotate-[-30deg]">
            <Volume2 className="w-12 h-12 text-[#7C3AED] drop-shadow-lg" />
            <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
          </div>
        </FloatingCard>

        {/* B. Notebook with Pen (Bottom Left edge) */}
        <FloatingCard 
          className="bottom-[-130px] left-0 w-[120px] h-[90px] pointer-events-none"
          delay={1.9}
          duration={4.5}
        >
          {/* Custom SVG Notebook */}
          <div className="relative w-full h-full bg-white rounded-lg border border-slate-200 shadow-lg p-2.5 transform rotate-[-6] overflow-visible">
            {/* Spiral Binding rings */}
            <div className="absolute top-[8px] left-[-3px] flex flex-col gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-2.5 h-1.5 bg-slate-300 rounded-full border border-slate-400" />
              ))}
            </div>
            {/* Lined paper interior representation */}
            <div className="h-full w-full flex flex-col justify-between pl-2.5 py-1">
              <div className="w-full h-px bg-slate-100" />
              <div className="w-full h-px bg-slate-100" />
              <div className="w-full h-px bg-indigo-50" />
              <div className="w-full h-px bg-slate-100" />
              <div className="w-full h-px bg-slate-100" />
              <div className="w-full h-px bg-indigo-50" />
            </div>
            {/* Pen Overlay */}
            <div className="absolute bottom-[20px] right-[-10px] w-[80px] h-3 bg-purple-600 rounded-full shadow-md transform rotate-[-35deg] border border-purple-500 flex items-center justify-end px-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            </div>
          </div>
        </FloatingCard>

        {/* C. Paper Airplane (Top Right high) */}
        <FloatingCard 
          className="top-[-100px] right-[20px] pointer-events-none"
          delay={0.5}
          duration={3.0}
        >
          <div className="transform rotate-15">
            <Send className="w-8 h-8 text-indigo-400/90 fill-indigo-100 drop-shadow-md" />
          </div>
        </FloatingCard>

        {/* D. Floating Spheres (Tiny 3D dots) */}
        {/* Purple Sphere (Top Middle) */}
        <div className="absolute top-[-90px] left-[50%] w-5 h-5 rounded-full bg-linear-to-br from-purple-400 to-indigo-600 shadow-md animate-drift-slow pointer-events-none" />
        {/* Yellow Sphere (Right Center) */}
        <div className="absolute top-[200px] right-[-90px] w-4 h-4 rounded-full bg-linear-to-br from-yellow-300 to-amber-500 shadow-md animate-drift-slower pointer-events-none" />
        {/* Teal Sphere (Center Left) */}
        <div className="absolute top-[260px] left-[-90px] w-3 h-3 rounded-full bg-linear-to-br from-teal-300 to-emerald-500 shadow-md animate-drift-slowest pointer-events-none" />
        
      </div>
    </div>
  );
}
