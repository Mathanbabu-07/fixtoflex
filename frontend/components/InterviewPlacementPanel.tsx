"use client";

import React, { useState } from "react";
import { 
  BrainCircuit, 
  Sparkles, 
  Play, 
  BookOpen, 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Video, 
  HelpCircle,
  FileText,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InterviewPlacementPanel() {
  const [activeSession, setActiveSession] = useState<boolean>(false);
  const [selectedDomain, setSelectedDomain] = useState<string>("Full Stack Web Development");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Entry-level");
  const [interviewType, setInterviewType] = useState<string>("Technical & Coding");
  
  // Static Mock Data for Prep History
  const prepHistory = [
    {
      role: "React & Next.js Developer",
      date: "2 days ago",
      type: "Technical",
      score: 85,
      feedback: "Strong core JavaScript knowledge. Needs optimization in Server Components data-fetching explanations.",
    },
    {
      role: "Python Backend Engineer",
      date: "1 week ago",
      type: "System Design",
      score: 72,
      feedback: "Great database normalization explanation. Improve scalability discussions around Redis caching.",
    }
  ];

  // Upcoming placement resources/drives
  const placementDrives = [
    { company: "TCS Ninja / Digital", date: "July 12, 2026", status: "Applications Open", type: "On-Campus" },
    { company: "Accenture HackDivas", date: "July 20, 2026", status: "Coding Round", type: "National Challenge" },
    { company: "Cognizant GenC", date: "August 05, 2026", status: "Registration Closed", type: "Off-Campus" }
  ];

  return (
    <motion.div
      key="interview-placement"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[700px] p-6 lg:p-8 gap-6"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shadow-sm">
            <BrainCircuit className="w-5 h-5 animate-pulse-slow" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Interview & Placement Prep</h2>
            <p className="text-xs text-slate-400">Gemini-powered mock interviews and active campus drive trackers.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 flex-1">
        
        {/* Left Side: Mock Interview Simulator */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/30 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-50 text-[#7C3AED]"><Video className="w-4 h-4" /></span>
              <h3 className="text-sm font-extrabold text-slate-800">AI Mock Interview Simulator</h3>
            </div>
            
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
              Launch a live chat-based mock interview. Gemini AI acts as a senior recruiter, asks role-specific technical/behavioral questions, and grades your response instantly.
            </p>

            {!activeSession ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-2">
                
                {/* Domain Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Domain</label>
                  <select 
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl p-3 outline-hidden cursor-pointer focus:ring-2 focus:ring-purple-500/50"
                  >
                    <option value="Full Stack Web Development">Full Stack Web Dev</option>
                    <option value="Frontend Engineering">Frontend Eng</option>
                    <option value="Backend Engineering">Backend Eng</option>
                    <option value="Data Science & ML">Data Science & ML</option>
                    <option value="Generative AI & LLMs">Generative AI / LLMs</option>
                  </select>
                </div>

                {/* Difficulty Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Difficulty Level</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl p-3 outline-hidden cursor-pointer focus:ring-2 focus:ring-purple-500/50"
                  >
                    <option value="Entry-level">Entry-level (Student)</option>
                    <option value="Mid-level">Mid-level (1-3 Yrs)</option>
                    <option value="Senior">Senior (5+ Yrs)</option>
                  </select>
                </div>

                {/* Interview Type Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Interview Type</label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl p-3 outline-hidden cursor-pointer focus:ring-2 focus:ring-purple-500/50"
                  >
                    <option value="Technical & Coding">Technical & Coding</option>
                    <option value="System Design">System Design</option>
                    <option value="Behavioral / HR">Behavioral / HR</option>
                  </select>
                </div>

              </div>
            ) : (
              <div className="p-4 bg-slate-950 text-emerald-400 rounded-2xl font-mono text-xs border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                  <span>AI_INTERVIEW_BOT_ACTIVE</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" /> Live</span>
                </div>
                <p className="text-slate-200">
                  <span className="text-purple-400">[Analyst]:</span> &quot;Hi! Thanks for joining. Let's begin the technical screening for the {selectedDomain} ({selectedDifficulty}) position. Can you explain the main difference between Client and Server Components in Next.js?&quot;
                </p>
                <div className="w-full flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type your response here..." 
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-purple-500 font-sans"
                  />
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold font-sans">
                    Send
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-2">
              {activeSession ? (
                <button 
                  onClick={() => setActiveSession(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  End Interview
                </button>
              ) : (
                <button 
                  onClick={() => setActiveSession(true)}
                  className="px-5 py-2.5 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Start AI Interview
                </button>
              )}
            </div>
          </div>

          {/* Past Sessions History */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600"><Clock className="w-4 h-4" /></span>
              <h3 className="text-sm font-extrabold text-slate-800">Preparation & Feedback History</h3>
            </div>
            
            <div className="space-y-3.5">
              {prepHistory.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-2 hover:border-purple-200 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">{item.role}</h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="px-2 py-0.5 bg-purple-50 border border-purple-100 text-[#7C3AED] text-[9px] font-bold rounded-full">{item.type}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{item.date}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-black text-emerald-600">{item.score}%</span>
                      <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wide">Gemini Score</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal font-medium mt-1.5 bg-white border border-slate-100 p-2.5 rounded-xl italic">
                    &quot;{item.feedback}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Active Placement Drives & Prep Checklist */}
        <div className="flex flex-col gap-6">
          
          {/* Active Placements Drives Tracker */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600"><Award className="w-4 h-4" /></span>
              <h3 className="text-sm font-extrabold text-slate-800">Campus Placement Drives</h3>
            </div>
            
            <div className="space-y-3">
              {placementDrives.map((drive, idx) => (
                <div key={idx} className="flex justify-between items-center p-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl group hover:border-emerald-200 transition-all">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-xs font-extrabold text-slate-800 truncate">{drive.company}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-slate-400 font-bold">{drive.date}</span>
                      <span className="text-[9px] text-indigo-500 font-extrabold">{drive.type}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                    drive.status.includes("Open") 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : drive.status.includes("Coding")
                      ? "bg-amber-50 text-amber-600 border-amber-100"
                      : "bg-slate-100 text-slate-400 border-slate-200"
                  }`}>
                    {drive.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Placement Prep Checklist */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-50 text-[#7C3AED]"><UserCheck className="w-4 h-4" /></span>
              <h3 className="text-sm font-extrabold text-slate-800">Placement Prep Checklist</h3>
            </div>
            
            <div className="space-y-3 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2 bg-slate-50/50 border border-slate-100 p-2.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>AI GitHub Profile Analysis (Completed)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50/50 border border-slate-100 p-2.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>ATS Resume Review (Completed)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50/50 border border-slate-100 p-2.5 rounded-xl opacity-60">
                <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Solve 5 Aptitude Practice Tests</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50/50 border border-slate-100 p-2.5 rounded-xl opacity-60">
                <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Perform a Behavioral AI Interview Session</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
