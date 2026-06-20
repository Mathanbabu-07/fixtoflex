"use client";

import React, { useEffect, useState } from "react";
import { motion, useTransform } from "framer-motion";
import {
  Briefcase,
  Users,
  ClipboardCheck,
  Award,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Bell,
  TrendingUp,
  Send,
  Star,
  Clock,
  BarChart3,
  Trophy,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  ANIMATED COUNTER HOOK                                              */
/* ------------------------------------------------------------------ */
function useCountUp(target: number, duration = 1.8, delay = 0.3) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / ((duration * 1000) / 16);
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        start += step;
        if (start >= target) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [started, target, duration, delay]);

  return { count, trigger: () => setStarted(true) };
}

/* ------------------------------------------------------------------ */
/*  STATUS BADGE                                                       */
/* ------------------------------------------------------------------ */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Interview: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Assessment: "bg-amber-50 text-amber-600 border-amber-100",
    Applied: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Rejected: "bg-red-50 text-red-600 border-red-100",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[7px] font-bold border ${styles[status] || "bg-slate-50 text-slate-500 border-slate-100"}`}>
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  COMPANY LOGO                                                       */
/* ------------------------------------------------------------------ */
function CompanyLogo({ name, color }: { name: string; color: string }) {
  const letter = name[0];
  return (
    <motion.div
      whileHover={{ scale: 1.15, rotate: 5 }}
      className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[8px] font-extrabold shrink-0 shadow-sm"
      style={{ backgroundColor: color }}
    >
      {letter}
    </motion.div>
  );
}

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

interface JobTrackerDashboardProps {
  mouseX: any;
  mouseY: any;
}

export default function JobTrackerDashboard({ mouseX, mouseY }: JobTrackerDashboardProps) {
  const dx = useTransform(mouseX, (v: number) => v * 0.01);
  const dy = useTransform(mouseY, (v: number) => v * 0.01);

  const apps = useCountUp(24);
  const interviews = useCountUp(8, 1.8, 0.5);
  const assessments = useCountUp(5, 1.8, 0.7);
  const offers = useCountUp(3, 1.8, 0.9);

  /* Row data */
  const rows = [
    { company: "Google", color: "#4285F4", role: "Frontend Developer", status: "Interview", date: "20 May 2024", next: "Technical Round", nextDate: "24 May 2024" },
    { company: "Microsoft", color: "#00A4EF", role: "SDE Intern", status: "Assessment", date: "18 May 2024", next: "Online Assessment", nextDate: "21 May 2024" },
    { company: "Amazon", color: "#FF9900", role: "Full Stack Developer", status: "Applied", date: "15 May 2024", next: "Follow up in 3 days", nextDate: "" },
    { company: "Adobe", color: "#FF0000", role: "UI/UX Designer", status: "Interview", date: "10 May 2024", next: "HR Round", nextDate: "20 May 2024" },
    { company: "Infosys", color: "#007CC3", role: "System Engineer", status: "Rejected", date: "06 May 2024", next: "—", nextDate: "" },
  ];

  /* Draw line animation */
  const drawLine: any = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.6,
      transition: { pathLength: { duration: 2, ease: "easeInOut", delay: 0.6 }, opacity: { duration: 0.5, delay: 0.6 } },
    },
  };

  return (
    <div className="scale-[0.62] xs:scale-[0.72] sm:scale-[0.78] md:scale-[0.85] lg:scale-100 origin-center transition-all duration-500 w-full flex items-center justify-center overflow-visible">
      <div className="relative w-full aspect-1.25/1 max-w-[700px] flex items-center justify-center select-none z-10 pt-6 pb-14 overflow-visible">

        {/* ============================================================ */}
        {/* SVG WORKFLOW LINES                                            */}
        {/* ============================================================ */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 700 560">
          <motion.path
            d="M 580,60 Q 520,30 440,80"
            fill="none" stroke="#C7D2FE" strokeWidth="2" strokeDasharray="6,6"
            variants={drawLine} initial="hidden" whileInView="visible" viewport={{ once: true }}
          />
          <motion.path
            d="M 650,230 Q 600,200 540,250"
            fill="none" stroke="#C7D2FE" strokeWidth="2" strokeDasharray="6,6"
            variants={drawLine} initial="hidden" whileInView="visible" viewport={{ once: true }}
          />
          <motion.path
            d="M 350,490 Q 380,460 400,420"
            fill="none" stroke="#C7D2FE" strokeWidth="2" strokeDasharray="6,6"
            variants={drawLine} initial="hidden" whileInView="visible" viewport={{ once: true }}
          />
        </svg>

        {/* ============================================================ */}
        {/* PAPER PLANE                                                   */}
        {/* ============================================================ */}
        <motion.div
          className="absolute top-[8px] right-[100px] z-30 text-indigo-400 pointer-events-none"
          animate={{ x: [0, 70, 140], y: [0, -30, 10], rotate: [0, 15, 35], opacity: [0, 0.9, 0] }}
          transition={{ type: "tween", duration: 6, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
        >
          <Send className="w-5 h-5 fill-indigo-50/80 drop-shadow-md" />
        </motion.div>

        {/* ============================================================ */}
        {/* FLOATING BRIEFCASE (top-left)                                */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 100 }}
          className="absolute top-[-2%] left-[28%] z-30"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            whileHover={{ rotate: [0, -8, 8, 0] }}
            transition={{
              y: { type: "tween", duration: 4.5, repeat: Infinity, ease: "easeInOut" },
              rotate: { type: "tween", duration: 0.4 }
            }}
            className="w-12 h-12 bg-linear-to-tr from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(124,58,237,0.3)] border border-white/20"
          >
            <Briefcase className="w-6 h-6 text-white" />
          </motion.div>
        </motion.div>

        {/* ============================================================ */}
        {/* THREE DOTS (top-right)                                        */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="absolute top-[3%] right-[2%] flex gap-2 z-30"
        >
          {["bg-indigo-500", "bg-purple-500", "bg-violet-500"].map((c, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ type: "tween", duration: 2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
              className={`w-3 h-3 rounded-full ${c}`}
            />
          ))}
        </motion.div>

        {/* ============================================================ */}
        {/* PROGRESS CARD (top-right floating)                           */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 90 }}
          className="absolute top-[3%] right-[10%] z-30 w-[220px]"
        >
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-white/85 backdrop-blur-xl border border-white/40 rounded-2xl shadow-[0_12px_32px_rgba(124,58,237,0.1)] p-3.5 flex items-center gap-3 transition-all duration-300"
          >
            {/* Progress Ring SVG */}
            <div className="relative w-14 h-14 shrink-0">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="22" fill="none" stroke="#E5E7EB" strokeWidth="5" />
                <motion.circle
                  cx="28" cy="28" r="22" fill="none" stroke="url(#progressGrad)" strokeWidth="5"
                  strokeLinecap="round" strokeDasharray={2 * Math.PI * 22}
                  initial={{ strokeDashoffset: 2 * Math.PI * 22 }}
                  whileInView={{ strokeDashoffset: 2 * Math.PI * 22 * (1 - 0.78) }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.8, delay: 0.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#4F46E5" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold text-[#1E1B4B]">78%</span>
            </div>
            <div className="space-y-0.5 min-w-0">
              <h4 className="text-[11px] font-extrabold text-[#1E1B4B]">Great Progress! 🎉</h4>
              <p className="text-[8px] text-slate-400 font-medium leading-snug">You&apos;re on track. Keep applying and crushing it!</p>
            </div>
          </motion.div>
        </motion.div>

        {/* ============================================================ */}
        {/* MAIN DASHBOARD CARD                                          */}
        {/* ============================================================ */}
        <motion.div
          style={{ x: dx, y: dy, willChange: "transform" }}
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          onViewportEnter={() => { apps.trigger(); interviews.trigger(); assessments.trigger(); offers.trigger(); }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative bg-white/85 backdrop-blur-xl border border-slate-200/60 rounded-2xl w-[84%] shadow-[0_25px_60px_rgba(30,27,75,0.1)] flex flex-col overflow-hidden ml-4"
        >
          {/* ─── Overview Header ─── */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <h3 className="text-[13px] font-extrabold text-[#1E1B4B]">Overview</h3>
            <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">
              <Clock className="w-3 h-3" />
              This Month
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>

          {/* ─── KPI Cards ─── */}
          <div className="grid grid-cols-4 gap-2.5 px-5 pb-3">
            {[
              { icon: Briefcase, label: "Applications", value: apps.count, change: "+12%", color: "from-violet-500 to-indigo-500", bgColor: "bg-violet-50" },
              { icon: Users, label: "Interviews", value: interviews.count, change: "+25%", color: "from-amber-500 to-orange-500", bgColor: "bg-amber-50" },
              { icon: ClipboardCheck, label: "Assessments", value: assessments.count, change: "+8%", color: "from-emerald-500 to-teal-500", bgColor: "bg-emerald-50" },
              { icon: Award, label: "Offers", value: offers.count, change: "+50%", color: "from-purple-500 to-pink-500", bgColor: "bg-purple-50" },
            ].map(({ icon: Icon, label, value, change, color, bgColor }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -2, scale: 1.02 }}
                className="bg-white rounded-xl border border-slate-100 p-2.5 space-y-1.5 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-7 h-7 rounded-lg ${bgColor} flex items-center justify-center`}>
                    <Icon className={`w-3.5 h-3.5 text-${color.includes("violet") ? "violet" : color.includes("amber") ? "amber" : color.includes("emerald") ? "emerald" : "purple"}-600`} />
                  </div>
                  <span className="text-[7px] font-bold text-emerald-500">{change}</span>
                </div>
                <div className="text-[18px] font-extrabold text-[#1E1B4B] leading-none">{value}</div>
                <div className="text-[7px] font-bold text-slate-400">{label}</div>
              </motion.div>
            ))}
          </div>

          {/* ─── Application Tracker Table ─── */}
          <div className="px-5 pb-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-extrabold text-[#1E1B4B]">Application Tracker</h4>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-100">
              {/* Table Header */}
              <div className="grid grid-cols-[1.2fr_1.2fr_0.8fr_0.8fr_1.2fr] gap-1 px-3 py-1.5 bg-slate-50/80 text-[7px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Company</span>
                <span>Role</span>
                <span>Status</span>
                <span>Applied On</span>
                <span>Next Step</span>
              </div>

              {/* Table Rows */}
              {rows.map((row, i) => (
                <motion.div
                  key={row.company}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.3 + i * 0.08 }}
                  whileHover={{ backgroundColor: "rgba(124,58,237,0.03)" }}
                  className="grid grid-cols-[1.2fr_1.2fr_0.8fr_0.8fr_1.2fr] gap-1 px-3 py-2 items-center border-t border-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CompanyLogo name={row.company} color={row.color} />
                    <span className="text-[8px] font-bold text-[#1E1B4B] truncate">{row.company}</span>
                  </div>
                  <span className="text-[8px] font-medium text-slate-500 truncate">{row.role}</span>
                  <StatusBadge status={row.status} />
                  <span className="text-[7px] font-medium text-slate-400">{row.date}</span>
                  <div className="min-w-0">
                    <span className="text-[7px] font-bold text-[#1E1B4B] truncate block">{row.next}</span>
                    {row.nextDate && <span className="text-[6px] text-slate-400">{row.nextDate}</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ─── Analytics Row ─── */}
          <div className="grid grid-cols-3 gap-2.5 px-5 pb-4">
            {/* Application Trend */}
            <div className="bg-white rounded-xl border border-slate-100 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-extrabold text-[#1E1B4B]">Application Trend</span>
                <span className="text-[7px] font-bold text-slate-400 flex items-center gap-0.5">This Month <ChevronDown className="w-2.5 h-2.5" /></span>
              </div>
              {/* Mini Line Chart */}
              <svg className="w-full h-[50px]" viewBox="0 0 140 50" fill="none">
                <motion.path
                  d="M 5,40 Q 20,35 35,28 T 65,22 T 95,15 T 125,8"
                  stroke="url(#trendGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                />
                <motion.path
                  d="M 5,40 Q 20,35 35,28 T 65,22 T 95,15 T 125,8 L 125,50 L 5,50 Z"
                  fill="url(#trendFill)" opacity="0.15"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.15 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                />
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#4F46E5" />
                  </linearGradient>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-[8px] font-bold text-emerald-500">+32% more applications</span>
              </div>
              <span className="text-[6px] text-slate-400 font-medium">than last month</span>
            </div>

            {/* Top Roles Donut */}
            <div className="bg-white rounded-xl border border-slate-100 p-3 space-y-2">
              <span className="text-[9px] font-extrabold text-[#1E1B4B]">Top Roles</span>
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 shrink-0">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                    {/* Background ring */}
                    <circle cx="28" cy="28" r="20" fill="none" stroke="#F1F5F9" strokeWidth="6" />
                    {/* Frontend Dev 45% */}
                    <motion.circle
                      cx="28" cy="28" r="20" fill="none" stroke="#7C3AED" strokeWidth="6"
                      strokeLinecap="round" strokeDasharray={`${0.45 * 2 * Math.PI * 20} ${2 * Math.PI * 20}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                      whileInView={{ strokeDashoffset: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                    />
                    {/* Full Stack 25% */}
                    <motion.circle
                      cx="28" cy="28" r="20" fill="none" stroke="#818CF8" strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${0.25 * 2 * Math.PI * 20} ${2 * Math.PI * 20}`}
                      strokeDashoffset={`${-0.45 * 2 * Math.PI * 20}`}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 1 }}
                    />
                    {/* SDE Intern 15% */}
                    <motion.circle
                      cx="28" cy="28" r="20" fill="none" stroke="#C4B5FD" strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${0.15 * 2 * Math.PI * 20} ${2 * Math.PI * 20}`}
                      strokeDashoffset={`${-0.70 * 2 * Math.PI * 20}`}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 1.2 }}
                    />
                  </svg>
                </div>
                <div className="space-y-1.5 text-[7px] font-bold">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#7C3AED]" /><span className="text-slate-600">Frontend Developer</span><span className="text-slate-400 ml-auto">45%</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#818CF8]" /><span className="text-slate-600">Full Stack Developer</span><span className="text-slate-400 ml-auto">25%</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#C4B5FD]" /><span className="text-slate-600">SDE Intern</span><span className="text-slate-400 ml-auto">15%</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#E2E8F0]" /><span className="text-slate-600">Others</span><span className="text-slate-400 ml-auto">15%</span></div>
                </div>
              </div>
            </div>

            {/* Upcoming Reminders */}
            <div className="bg-white rounded-xl border border-slate-100 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-extrabold text-[#1E1B4B]">Upcoming Reminders</span>
              </div>
              {[
                { title: "Technical Interview", sub: "Google · Frontend Developer", date: "24 May", time: "10:00 AM", color: "bg-indigo-500" },
                { title: "Online Assessment", sub: "Microsoft · SDE Intern", date: "22 May", time: "11:30 AM", color: "bg-amber-500" },
              ].map((r, i) => (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.15 }}
                  className="flex items-start gap-2"
                >
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ type: "tween", duration: 2, repeat: Infinity, delay: i * 0.5 }}
                    className={`w-5 h-5 rounded-lg ${r.color} flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <Bell className="w-2.5 h-2.5 text-white" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[8px] font-bold text-[#1E1B4B] truncate">{r.title}</div>
                    <div className="text-[6px] text-slate-400 font-medium truncate">{r.sub}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[7px] font-bold text-[#1E1B4B]">{r.date}</div>
                    <div className="text-[6px] text-slate-400">{r.time}</div>
                  </div>
                </motion.div>
              ))}
              <a href="#reminders" className="text-[8px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-0.5 transition-colors group pt-1">
                View All Reminders
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* AI INSIGHT CARD (right floating)                              */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.7, type: "spring", stiffness: 90 }}
          className="absolute top-[12%] right-[-10%] sm:right-[-8%] xl:right-[-6%] w-[150px] sm:w-[165px] z-20"
        >
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-[#1E1B4B] rounded-2xl shadow-[0_12px_32px_rgba(30,27,75,0.3)] p-3.5 space-y-2.5 text-white transition-all duration-300 relative overflow-hidden"
          >
            {/* Glow sweep */}
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full"
              animate={{ translateX: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
            />
            <div className="flex items-center gap-1.5 relative z-10">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span className="text-[10px] font-bold">AI Insight</span>
            </div>
            <p className="text-[8px] text-slate-300 leading-relaxed font-medium relative z-10">
              Strong match for Frontend Developer roles.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 bg-linear-to-r from-violet-600 to-indigo-600 text-white text-[8px] font-bold rounded-lg flex items-center gap-1 cursor-pointer relative z-10"
            >
              View Suggestions
              <ArrowRight className="w-3 h-3" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ============================================================ */}
        {/* CLIPBOARD (bottom-left decoration)                           */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 100 }}
          className="absolute bottom-[-4%] left-[4%] z-20"
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ type: "tween", duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            {/* Clipboard top */}
            <div className="w-10 h-3 bg-slate-300 rounded-t-md relative z-10 flex items-center justify-center">
              <div className="w-5 h-1.5 bg-slate-400 rounded-full" />
            </div>
            {/* Clipboard body */}
            <div className="w-14 h-16 bg-white border-2 border-slate-200 rounded-lg -mt-1 p-1.5 flex flex-col gap-1 shadow-md">
              <div className="h-1 bg-purple-400 rounded-full w-full" />
              <div className="h-0.5 bg-slate-200 rounded-full w-4/5" />
              <div className="h-0.5 bg-slate-200 rounded-full w-3/5" />
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                className="mt-auto w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center self-center"
              >
                <ClipboardCheck className="w-2.5 h-2.5 text-emerald-600" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* ============================================================ */}
        {/* GROWTH BAR CHART (bottom-center-left)                        */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7, type: "spring", stiffness: 100 }}
          className="absolute bottom-[-8%] left-[22%] z-20"
        >
          <div className="flex items-end gap-1">
            {[28, 45, 35, 55, 70].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: h * 0.5 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.1, ease: "easeOut" }}
                className={`w-3 rounded-t-md ${i === 4 ? "bg-linear-to-t from-violet-600 to-indigo-500" : "bg-indigo-200"}`}
              />
            ))}
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* ALARM CLOCK (bottom-right)                                   */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8, type: "spring", stiffness: 100 }}
          className="absolute bottom-[-6%] right-[2%] z-20"
        >
          <motion.div
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ type: "tween", duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative">
              {/* Clock body */}
              <div className="w-14 h-14 bg-amber-50 border-2 border-amber-200 rounded-full flex items-center justify-center shadow-md">
                {/* Hands */}
                <div className="relative w-8 h-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute w-0.5 h-3.5 bg-[#1E1B4B] rounded-full left-1/2 bottom-1/2 origin-bottom -translate-x-1/2"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute w-0.5 h-2.5 bg-purple-500 rounded-full left-1/2 bottom-1/2 origin-bottom -translate-x-1/2"
                  />
                  <div className="absolute w-1.5 h-1.5 bg-[#1E1B4B] rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
              {/* Bells */}
              <div className="absolute -top-1.5 left-0.5 w-3 h-3 bg-amber-300 rounded-full border border-amber-400" />
              <div className="absolute -top-1.5 right-0.5 w-3 h-3 bg-amber-300 rounded-full border border-amber-400" />
            </div>
          </motion.div>
        </motion.div>

        {/* ============================================================ */}
        {/* TROPHY STAR (right side)                                     */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.9, type: "spring", stiffness: 100 }}
          className="absolute top-[50%] right-[-6%] z-20"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ type: "tween", duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="w-10 h-10 bg-linear-to-tr from-amber-400 to-yellow-300 rounded-xl flex items-center justify-center shadow-md border border-amber-300/50">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            {/* Sparkle particles */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                transition={{ type: "tween", duration: 1.5, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
                className="absolute w-1 h-1 bg-amber-400 rounded-full"
                style={{
                  top: i === 0 ? "-4px" : i === 1 ? "50%" : "110%",
                  left: i === 0 ? "50%" : i === 1 ? "110%" : "50%",
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* ============================================================ */}
        {/* NAVIGATION ARROWS                                            */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="absolute right-[-6%] sm:right-[-3%] top-[45%] z-20"
        >
          <motion.div
            whileHover={{ scale: 1.1, x: 3 }}
            className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-md flex items-center justify-center cursor-pointer text-slate-400 hover:text-purple-600 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="absolute left-[-6%] sm:left-[-3%] top-[45%] z-20"
        >
          <motion.div
            whileHover={{ scale: 1.1, x: -3 }}
            className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-md flex items-center justify-center cursor-pointer text-slate-400 hover:text-purple-600 transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
          </motion.div>
        </motion.div>

        {/* ============================================================ */}
        {/* BOTTOM BANNER                                                */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute bottom-[-14%] left-[6%] right-[6%] z-20"
        >
          <div className="bg-linear-to-r from-[#1E1B4B] via-[#2d2769] to-[#1E1B4B] rounded-2xl px-6 py-3 flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(30,27,75,0.2)]">
            <span className="text-amber-400 text-lg">⭐</span>
            <span className="text-white text-[11px] font-bold">
              Small steps today, dream job tomorrow. Keep going! 💪
            </span>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* DOT INDICATORS                                               */}
        {/* ============================================================ */}
        <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 flex items-center gap-2.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === 2 ? "w-3 h-3 bg-purple-600" : "w-2 h-2 bg-slate-300"
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
