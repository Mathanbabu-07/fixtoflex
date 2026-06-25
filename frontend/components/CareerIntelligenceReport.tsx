"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, Code, BookOpen, User, Github, Linkedin, CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";

interface CareerIntelligenceReportProps {
  userId: string;
}

export default function CareerIntelligenceReport({ userId }: CareerIntelligenceReportProps) {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [userId]);

  const getApiUrl = (path: string): string => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) return `${apiUrl.replace(/\/$/, "")}${path}`;
    return `http://localhost:8000${path}`;
  };

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(getApiUrl("/career-intelligence/report"), {
        credentials: "include"
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to fetch AI Report");
      }
      const data = await res.json();
      setReport(data.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[#7C3AED]/20 blur-xl rounded-full" />
          <div className="w-16 h-16 bg-white border border-slate-100 rounded-3xl shadow-xl flex items-center justify-center relative">
            <Loader2 className="w-8 h-8 text-[#7C3AED] animate-spin" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Generating AI Career Intelligence...</h2>
        <p className="text-sm text-slate-500 mt-2">Aggregating your profile context and analyzing skills</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-100 rounded-3xl text-center">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-800 mb-2">Could not generate report</h3>
        <p className="text-sm text-slate-600 mb-6">{error}</p>
        <button onClick={fetchReport} className="px-6 py-2 bg-rose-500 text-white font-bold rounded-xl text-sm">
          Try Again
        </button>
      </div>
    );
  }

  if (!report) return null;

  const { skill_improvement_roadmap, project_roadmap, timeline_roadmap, progress_estimation, resume_improvement, portfolio_improvement, linkedin_improvement, github_improvement } = report;

  const PriorityBadge = ({ priority }: { priority: string }) => {
    const colors: any = {
      Critical: "bg-rose-100 text-rose-700 border-rose-200",
      Important: "bg-amber-100 text-amber-700 border-amber-200",
      Optional: "bg-emerald-100 text-emerald-700 border-emerald-200",
      Future: "bg-blue-100 text-blue-700 border-blue-200"
    };
    return (
      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${colors[priority] || "bg-slate-100 text-slate-700"}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto pb-12">
      {/* Header section */}
      <div className="bg-linear-to-r from-[#7C3AED] to-[#4F46E5] rounded-3xl p-8 lg:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <h2 className="text-3xl font-extrabold mb-3 flex items-center gap-3 relative z-10">
          <Sparkles className="w-8 h-8" /> Fix My Profile AI Coach
        </h2>
        <p className="text-white/80 font-medium max-w-2xl relative z-10">
          Your highly personalized career intelligence roadmap, generated using your aggregated LinkedIn, GitHub, Resume, and Portfolio analysis.
        </p>
        
        {progress_estimation && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-white/70 mb-1">Current Strength</p>
              <p className="text-3xl font-black">{progress_estimation.current_profile_strength}<span className="text-lg text-white/50">/100</span></p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-emerald-300 mb-1">Expected Strength</p>
              <p className="text-3xl font-black text-emerald-100">{progress_estimation.expected_profile_strength}<span className="text-lg text-emerald-400/50">/100</span></p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-white/70 mb-1">Current ATS</p>
              <p className="text-3xl font-black">{progress_estimation.current_ats_readiness}<span className="text-lg text-white/50">/100</span></p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-emerald-300 mb-1">Expected ATS</p>
              <p className="text-3xl font-black text-emerald-100">{progress_estimation.expected_ats_readiness}<span className="text-lg text-emerald-400/50">/100</span></p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Skill Roadmap */}
          {skill_improvement_roadmap && skill_improvement_roadmap.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-purple-600" /> Skill Improvement Roadmap
              </h3>
              <div className="space-y-4">
                {skill_improvement_roadmap.map((skill: any, i: number) => (
                  <div key={i} className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase">{skill.category}</span>
                        <h4 className="text-sm font-bold text-slate-800 mt-1">{skill.recommendation}</h4>
                      </div>
                      <PriorityBadge priority={skill.priority} />
                    </div>
                    <p className="text-xs text-slate-600">{skill.why_important}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Roadmap */}
          {project_roadmap && project_roadmap.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-purple-600" /> Project Roadmap
              </h3>
              <div className="space-y-4">
                {project_roadmap.map((proj: any, i: number) => (
                  <div key={i} className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-slate-800">{proj.title}</h4>
                      <PriorityBadge priority={proj.priority} />
                    </div>
                    <p className="text-xs text-slate-600"><strong>Outcomes:</strong> {proj.learning_outcomes}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {proj.technologies.map((tech: string, j: number) => (
                        <span key={j} className="px-2 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600">{tech}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Col */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Action Plan */}
          {timeline_roadmap && (
            <div className="bg-purple-50 border border-purple-100 rounded-3xl p-6">
              <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-600" /> Action Plan
              </h3>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-purple-200">
                {Object.entries(timeline_roadmap).map(([period, items]: [string, any], index) => (
                  <div key={period} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-purple-200 shadow shrink-0 z-10" />
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 bg-white border border-slate-100 rounded-xl shadow-xs">
                      <h4 className="text-xs font-bold text-slate-800 uppercase mb-2">{period.replace(/_/g, " ")}</h4>
                      <ul className="space-y-1">
                        {items.map((item: string, i: number) => (
                          <li key={i} className="text-[10px] text-slate-600 flex items-start gap-1">
                            <span className="text-purple-500 mt-0.5">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Improvements */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col gap-4">
            <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-purple-600" /> Profile Fixes
            </h3>
            
            {resume_improvement && (
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1"><BookOpen className="w-3 h-3"/> Resume</h4>
                {resume_improvement.map((item: any, i: number) => (
                  <div key={i} className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 flex justify-between gap-2">
                    <span>{item.suggestion}</span> <PriorityBadge priority={item.priority} />
                  </div>
                ))}
              </div>
            )}
            
            {linkedin_improvement && (
              <div className="flex flex-col gap-2 mt-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1"><Linkedin className="w-3 h-3"/> LinkedIn</h4>
                {linkedin_improvement.map((item: any, i: number) => (
                  <div key={i} className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 flex justify-between gap-2">
                    <span>{item.suggestion}</span> <PriorityBadge priority={item.priority} />
                  </div>
                ))}
              </div>
            )}

            {github_improvement && (
              <div className="flex flex-col gap-2 mt-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1"><Github className="w-3 h-3"/> GitHub</h4>
                {github_improvement.map((item: any, i: number) => (
                  <div key={i} className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 flex justify-between gap-2">
                    <span>{item.suggestion}</span> <PriorityBadge priority={item.priority} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
