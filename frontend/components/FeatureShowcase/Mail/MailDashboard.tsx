"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  ChevronDown, 
  MoreVertical, 
  Check, 
  Sparkles, 
  Send, 
  Clock, 
  Star, 
  Mail, 
  Plus,
  Trash2,
  Copy,
  Calendar,
  Share2,
  FileText,
  Bookmark,
  CheckCircle2,
  BarChart3,
  BookOpen
} from "lucide-react";

export default function MailDashboard() {
  const [selectedDraft, setSelectedDraft] = useState(0);

  // Quick Action Buttons
  const actions = [
    { label: "New Email", icon: Plus, active: true },
    { label: "Use Template", icon: BookOpen },
    { label: "AI Improve", icon: Sparkles },
    { label: "Follow-up", icon: Send },
    { label: "Email Tracker", icon: BarChart3 }
  ];

  // Draft items inside Library
  const drafts = [
    {
      company: "Gmail",
      logo: (
        <svg viewBox="0 0 24 24" className="w-4 h-4">
          <path fill="#EA4335" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
          <path fill="#FBBC05" d="M22 6v12c0 1.1-.9 2-2 2h-2V8l-6 4-6-4v12H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h4l4 4 4-4h4c1.1 0 2 .9 2 2z" />
          <path fill="#34A853" d="M2 6v12c0 1.1.9 2 2 2h2V8l6 4-10-6.67z" />
          <path fill="#4285F4" d="M22 6v12c0 1.1-.9 2-2 2h-2V8l-6 4 10-6.67z" />
        </svg>
      ),
      subject: "Application for Frontend Developer",
      companyName: "Google",
      status: "Draft",
      statusColor: "bg-purple-50 text-purple-600 border-purple-100",
      date: "10:30 AM",
      favorite: true
    },
    {
      company: "Microsoft Outlook",
      logo: (
        <svg viewBox="0 0 23 23" className="w-4 h-4">
          <rect x="0" y="0" width="10.5" height="10.5" fill="#F25022"/>
          <rect x="11.5" y="0" width="10.5" height="10.5" fill="#7FBA00"/>
          <rect x="0" y="11.5" width="10.5" height="10.5" fill="#00A4EF"/>
          <rect x="11.5" y="11.5" width="10.5" height="10.5" fill="#FFB900"/>
        </svg>
      ),
      subject: "SDE Internship Application",
      companyName: "Microsoft",
      status: "Follow-up",
      statusColor: "bg-amber-50 text-amber-600 border-amber-100",
      date: "22 May",
      favorite: false
    },
    {
      company: "Adobe",
      logo: (
        <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-[#FF0000]">
          <path d="M14.6 2h7.4v19.8l-7.4-19.8zm-5.2 0H2v19.8L9.4 2zm2.6 6.4L17.2 22h-3.2l-2-4.8H8l2.8-5.9z"/>
        </svg>
      ),
      subject: "UI/UX Designer Opportunity",
      companyName: "Adobe",
      status: "Scheduled",
      statusColor: "bg-blue-50 text-blue-600 border-blue-100",
      date: "20 May",
      favorite: false
    },
    {
      company: "LinkedIn",
      logo: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#0A66C2]">
          <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003zM7.12 20.452H3.558V9H7.12v11.452zM5.339 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm15.108 13.019h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z"/>
        </svg>
      ),
      subject: "Networking Outreach",
      companyName: "Sarah Johnson",
      status: "Sent",
      statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
      date: "18 May",
      favorite: false
    },
    {
      company: "Infosys",
      logo: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#007CC3]">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      ),
      subject: "System Engineer Role",
      companyName: "Infosys",
      status: "Draft",
      statusColor: "bg-purple-50 text-purple-600 border-purple-100",
      date: "16 May",
      favorite: false
    }
  ];

  // Automation steps
  const automationSteps = [
    { label: "Email Drafted", desc: "AI creates a personalized email", time: "10:30 AM", status: "completed" },
    { label: "Scheduled", desc: "Email scheduled to send at 10:00 AM", time: "Tomorrow", status: "pending" },
    { label: "Follow-up", desc: "AI will send follow-up if no reply in 3 days", time: "+3 Days", status: "future" },
    { label: "Track & Notify", desc: "You'll be notified on any response", time: "Active", status: "active" }
  ];

  // Templates list
  const templates = [
    { title: "Job Application", desc: "Professional job application email" },
    { title: "Follow-up Email", desc: "Polite follow-up after no response" },
    { title: "Networking", desc: "Connect with professionals" },
    { title: "Thank You Email", desc: "Thank you after an interview" }
  ];

  return (
    <div className="scale-[0.62] xs:scale-[0.72] sm:scale-[0.78] md:scale-[0.85] lg:scale-100 origin-top transition-all duration-500 w-full flex flex-col items-center justify-center overflow-visible">
      <div className="relative w-full max-w-[920px] flex flex-col gap-6 select-none z-10 pt-4 pb-14 overflow-visible">
        
        {/* ========================================================================= */}
        {/* TOP BANNER                                                                */}
        {/* ========================================================================= */}
        <div className="relative w-full bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-2xl p-4 flex items-center justify-between shadow-xs overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-xs shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-sm font-extrabold text-[#1E1B4B]">Professional emails. Better responses.</h3>
              <p className="text-[10px] text-slate-500 font-semibold leading-none">Let AI handle the words, you focus on success.</p>
            </div>
          </div>
          
          {/* AI Assistant illustration on right */}
          <div className="flex items-center gap-3 mr-4 lg:flex hidden">
            {/* Robot Head */}
            <div className="relative w-12 h-10 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center shadow-xs">
              <div className="flex gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              </div>
              <div className="w-6 h-[2px] bg-slate-300 rounded-full" />
              {/* Antenna */}
              <div className="absolute top-[-6px] w-[2px] h-2 bg-slate-300 left-1/2 -translate-x-1/2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full absolute top-[-3px] left-[-0.5px]" />
              </div>
            </div>
            {/* Sparkle badge */}
            <div className="bg-purple-100 border border-purple-200/50 text-purple-600 rounded-full px-2 py-0.5 text-[8px] font-extrabold flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> AI Online
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* QUICK ACTION BAR                                                          */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2.5 overflow-x-auto w-full pb-1 scrollbar-none">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button 
                key={act.label} 
                className={`px-4 py-2 rounded-xl text-[10px] font-extrabold flex items-center gap-1.5 cursor-pointer shadow-2xs border select-none transition-all duration-300 ${
                  act.active 
                    ? "bg-purple-50 text-purple-600 border-purple-100" 
                    : "bg-white text-slate-500 border-slate-200 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {act.label}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* MAIN WORKSPACE GRID                                                       */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-[1fr_250px] gap-5 w-full items-start">
         
          {/* LEFT: EMAIL PANELS (LIBRARY + EDITOR) */}
          <div className="grid grid-cols-[240px_1fr] gap-4 w-full bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-2xl p-4 shadow-sm min-h-[460px]">
            
            {/* Panel 1: Draft Library */}
            <div className="flex flex-col border-r border-slate-100 pr-4 gap-3">
              <div className="flex items-center justify-between select-none">
                <span className="text-[10px] font-extrabold text-[#1E1B4B] uppercase tracking-wider">Your Drafts</span>
                <Search className="w-3 h-3 text-slate-400 cursor-pointer" />
              </div>

              {/* Draft List */}
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[380px] scrollbar-none">
                {drafts.map((d, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedDraft(idx)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                      selectedDraft === idx
                        ? "bg-purple-50/60 border-purple-100/50 shadow-2xs"
                        : "bg-white hover:bg-slate-50/50 border-slate-100"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      {d.logo}
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <span className="text-[9px] font-extrabold text-[#1E1B4B] block leading-tight truncate">{d.subject}</span>
                      <span className="text-[8px] text-slate-400 font-bold block leading-none">{d.companyName}</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`px-1.5 py-0.5 rounded-full text-[6px] font-bold border ${d.statusColor}`}>{d.status}</span>
                        <span className="text-[6px] text-slate-400 font-semibold">{d.date}</span>
                      </div>
                    </div>
                    <Star className={`w-3 h-3 shrink-0 ${d.favorite ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-2">
                <button className="text-[9px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-0.5 select-none cursor-pointer">
                  View All Drafts →
                </button>
              </div>
            </div>

            {/* Panel 2: Email Editor */}
            <div className="flex flex-col gap-4 pl-1">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[11px] font-extrabold text-[#1E1B4B]">Application for Frontend Developer</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-100 text-purple-600 text-[8px] font-bold">Draft</span>
              </div>

              {/* Composer Header */}
              <div className="space-y-2 text-[10px]">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-1.5">
                  <span className="text-slate-400 font-bold w-6">To</span>
                  <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-[#1E1B4B] font-semibold">
                    <svg viewBox="0 0 24 24" className="w-3 h-3">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    </svg>
                    hr@google.com
                  </div>
                </div>
                <div className="flex items-center gap-2 border-b border-slate-50 pb-1.5">
                  <span className="text-slate-400 font-bold w-6">Subject</span>
                  <span className="text-[#1E1B4B] font-semibold">Application for Frontend Developer Position</span>
                </div>
              </div>

              {/* Rich Text Toolbar */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                <div className="flex items-center gap-2.5 text-slate-400 font-bold text-[10px]">
                  <span className="cursor-pointer hover:text-slate-600">B</span>
                  <span className="cursor-pointer hover:text-slate-600 italic">I</span>
                  <span className="cursor-pointer hover:text-slate-600 underline">U</span>
                  <span className="w-px h-3.5 bg-slate-200" />
                  <span className="cursor-pointer hover:text-slate-600">≡</span>
                  <span className="cursor-pointer hover:text-slate-600">⁝</span>
                  <span className="w-px h-3.5 bg-slate-200" />
                  <span className="cursor-pointer hover:text-slate-600">🔗</span>
                  <span className="cursor-pointer hover:text-slate-600">📎</span>
                </div>
                
                <button className="px-2 py-0.5 bg-white border border-slate-200 text-purple-600 rounded-md text-[8px] font-bold flex items-center gap-0.5 shadow-2xs hover:bg-slate-50 cursor-pointer">
                  + Insert
                </button>
              </div>

              {/* Email Body */}
              <div className="flex-1 text-[10px] text-slate-600 leading-relaxed font-medium space-y-2 overflow-y-auto max-h-[220px]">
                <p>Hi Hiring Team,</p>
                <p>I hope you&apos;re doing well.</p>
                <p>I am excited to apply for the Frontend Developer position at Google. With strong expertise in <strong>React, TypeScript,</strong> and building responsive, user-centric web applications, I am confident in contributing to impactful products.</p>
                <p>I have attached my resume for your review. Looking forward to the opportunity to connect!</p>
                <p>Best regards,<br /><span className="text-purple-600 font-bold">Mathan Babu</span></p>
              </div>

              {/* Bottom Composer Actions */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
                <div className="flex items-center gap-1.5">
                  <button className="px-4.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[9px] font-bold flex items-center gap-1 cursor-pointer select-none">
                    Send Now <Send className="w-3 h-3" />
                  </button>
                  <button className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-xl text-[9px] font-bold flex items-center gap-1 cursor-pointer select-none">
                    Schedule <ChevronDown className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button title="Save Draft" className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"><Bookmark className="w-3.5 h-3.5" /></button>
                  <button title="Copy" className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"><Copy className="w-3.5 h-3.5" /></button>
                  <button title="Delete" className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-rose-600 flex items-center justify-center cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT SIDEBAR: AUTOMATION FLOW + ANALYTICS */}
          <div className="flex flex-col gap-5">
            
            {/* 1. Automation Flow Timeline */}
            <div className="bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-4">Automation Flow</span>

              {/* Vertical timeline */}
              <div className="space-y-4 relative pl-5 border-l border-slate-100/80 ml-2 select-none">
                {automationSteps.map((step, idx) => (
                  <div key={idx} className="relative space-y-0.5">
                    {/* Circle icon on line */}
                    <div className={`absolute left-[-26px] top-0 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] border shadow-2xs ${
                      step.status === "completed" 
                        ? "bg-purple-600 text-white border-purple-500"
                        : step.status === "pending"
                        ? "bg-blue-100 text-blue-600 border-blue-200"
                        : step.status === "active"
                        ? "bg-emerald-100 text-emerald-600 border-emerald-200"
                        : "bg-slate-100 text-slate-400 border-slate-200"
                    }`}>
                      {step.status === "completed" ? "✓" : idx + 1}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold text-[#1E1B4B]">{step.label}</span>
                      <span className={`text-[7px] font-bold ${step.status === "active" ? "text-emerald-500 animate-pulse" : "text-slate-400"}`}>{step.time}</span>
                    </div>
                    <p className="text-[8px] text-slate-400 font-semibold leading-tight">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Email Performance Card */}
            <div className="bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-2xl p-4 shadow-xs space-y-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Email Performance</span>

              {/* Gauge and Stats */}
              <div className="flex items-center gap-4 border-b border-slate-50 pb-3 select-none">
                {/* Circular Response gauge */}
                <div className="relative flex items-center justify-center shrink-0 w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="25" stroke="#F8FAFC" strokeWidth="5" fill="transparent" />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="25" 
                      stroke="#7C3AED" 
                      strokeWidth="5" 
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 25}
                      strokeDashoffset={2 * Math.PI * 25 * (1 - 0.72)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center leading-none">
                    <span className="text-xs font-extrabold text-[#1E1B4B]">72%</span>
                    <span className="text-[6px] text-slate-400 font-bold mt-0.5">Response</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex-1 space-y-2 text-[9px] font-bold text-slate-500">
                  <div className="flex items-center justify-between"><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> Sent</span> <span className="text-[#1E1B4B] font-extrabold">24</span></div>
                  <div className="flex items-center justify-between"><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Replied</span> <span className="text-[#1E1B4B] font-extrabold">17</span></div>
                  <div className="flex items-center justify-between"><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> No Reply</span> <span className="text-[#1E1B4B] font-extrabold">7</span></div>
                </div>
              </div>

              <button className="w-full text-center text-[9px] font-bold text-purple-600 hover:text-purple-700 select-none cursor-pointer">
                View Detailed Analytics →
              </button>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* BOTTOM SECTION: SMART TEMPLATES                                           */}
        {/* ========================================================================= */}
        <div className="w-full bg-linear-to-r from-purple-50/60 via-indigo-50/40 to-purple-50/60 border border-purple-100/50 backdrop-blur-md rounded-2xl p-5 shadow-xs flex items-center justify-between overflow-hidden">
          <div className="space-y-1">
            <h4 className="text-[12px] font-extrabold text-[#1E1B4B] flex items-center gap-1.5">
              Start with smart templates ✨
            </h4>
            <p className="text-[10px] text-slate-500 font-medium">
              Choose a template or let AI create one for you in seconds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {templates.map((temp) => (
              <div 
                key={temp.title}
                className="bg-white border border-slate-100 hover:border-purple-200 rounded-xl p-2.5 flex flex-col gap-0.5 shadow-2xs hover:shadow-xs transition-all duration-300 w-[120px] text-left cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 mb-1">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="text-[8px] font-extrabold text-[#1E1B4B] truncate block">{temp.title}</span>
                <span className="text-[6px] text-slate-400 font-bold truncate block">{temp.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DECORATIVE OBJECTS (Mailbox + Flying paper plane)                         */}
        {/* ========================================================================= */}
        {/* 1. Flying paper plane (static, styled) */}
        <div className="absolute bottom-[20%] left-[-45px] text-purple-400 select-none opacity-60">
          <Send className="w-6 h-6 rotate-[-15deg] transform" />
        </div>

        {/* 2. Mailbox (bottom right) */}
        <div className="absolute bottom-[-50px] right-[-15px] z-20 lg:flex hidden items-end gap-2.5">
          <div className="relative flex flex-col items-center">
            {/* Mailbox base */}
            <div className="w-16 h-18 bg-linear-to-tr from-violet-600 to-indigo-600 rounded-t-2xl shadow-lg border border-white/20 relative z-10 flex flex-col items-center justify-center">
              {/* Flag */}
              <div className="absolute right-[-3px] top-4 w-1.5 h-6 bg-red-500 rounded-full origin-bottom rotate-15" />
              {/* Slot */}
              <div className="w-10 h-1.5 bg-slate-900/60 rounded-full mb-1" />
              {/* Envelopes poking out */}
              <div className="flex gap-1">
                <div className="w-4 h-3 bg-white rounded-xs -rotate-6" />
                <div className="w-4 h-3 bg-white rounded-xs rotate-[12deg]" />
              </div>
            </div>
            {/* Pedestal post */}
            <div className="w-2.5 h-6 bg-slate-300 shadow-2xs border-b border-slate-400" />
            <div className="w-10 h-1.5 bg-slate-400 rounded-full" />
          </div>
        </div>

        {/* 3. Small spheres */}
        <div className="absolute top-[80px] left-[-30px] w-2 h-2 rounded-full bg-linear-to-br from-purple-400 to-indigo-600 shadow-xs opacity-50" />
        <div className="absolute top-[320px] right-[-45px] w-2.5 h-2.5 rounded-full bg-linear-to-br from-yellow-300 to-amber-500 shadow-xs opacity-50" />

      </div>
    </div>
  );
}
