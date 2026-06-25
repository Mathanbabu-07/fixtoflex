"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, Code, BookOpen, User, CheckCircle2, AlertTriangle, ArrowRight, Loader2, FileText, Globe } from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 relative z-10">
            {/* Profile Strength Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-wider text-white/80 font-bold">Profile Strength</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-white">{progress_estimation.current_profile_strength}</span>
                  <ArrowRight className="w-4 h-4 text-white/60" />
                  <span className="text-2xl font-black text-emerald-300">{progress_estimation.expected_profile_strength}</span>
                  <span className="text-xs text-white/50">/100</span>
                </div>
              </div>
              <div className="w-full bg-white/25 h-3 rounded-full overflow-hidden relative">
                {/* Expected Fill */}
                <div 
                  className="absolute left-0 top-0 h-full bg-emerald-400 rounded-full" 
                  style={{ width: `${progress_estimation.expected_profile_strength}%` }}
                />
                {/* Current Fill */}
                <div 
                  className="absolute left-0 top-0 h-full bg-white rounded-full z-10" 
                  style={{ width: `${progress_estimation.current_profile_strength}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2 text-[10px] text-white/60">
                <span>Current Status</span>
                <span className="text-emerald-300 font-bold">+{progress_estimation.expected_profile_strength - progress_estimation.current_profile_strength} pts increase</span>
              </div>
            </div>

            {/* ATS Readiness Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-wider text-white/80 font-bold">ATS Match Rate</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-white">{progress_estimation.current_ats_readiness}</span>
                  <ArrowRight className="w-4 h-4 text-white/60" />
                  <span className="text-2xl font-black text-emerald-300">{progress_estimation.expected_ats_readiness}</span>
                  <span className="text-xs text-white/50">/100</span>
                </div>
              </div>
              <div className="w-full bg-white/25 h-3 rounded-full overflow-hidden relative">
                {/* Expected Fill */}
                <div 
                  className="absolute left-0 top-0 h-full bg-emerald-400 rounded-full" 
                  style={{ width: `${progress_estimation.expected_ats_readiness}%` }}
                />
                {/* Current Fill */}
                <div 
                  className="absolute left-0 top-0 h-full bg-white rounded-full z-10" 
                  style={{ width: `${progress_estimation.current_ats_readiness}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2 text-[10px] text-white/60">
                <span>Current Status</span>
                <span className="text-emerald-300 font-bold">+{progress_estimation.expected_ats_readiness - progress_estimation.current_ats_readiness} pts increase</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Col */}
        <div className="flex flex-col gap-8">
          
          {/* Skill Roadmap */}
          {skill_improvement_roadmap && skill_improvement_roadmap.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="border-b border-slate-100 pb-3 mb-6">
                <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                  <Code className="w-5 h-5 text-[#7C3AED]" /> Skill Improvement Roadmap
                </h3>
                <p className="text-xs text-slate-400 mt-1">Key conceptual and framework enhancements required for target roles.</p>
              </div>
              <div className="space-y-4">
                {skill_improvement_roadmap.map((skill: any, i: number) => (
                  <div key={i} className="group p-5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all duration-200">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-purple-600 tracking-wider uppercase bg-purple-50 px-2 py-0.5 rounded-md">
                          {skill.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 pt-1 leading-snug">
                          {skill.recommendation}
                        </h4>
                      </div>
                      <div className="shrink-0 self-start">
                        <PriorityBadge priority={skill.priority} />
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                      {skill.why_important}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Roadmap */}
          {project_roadmap && project_roadmap.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="border-b border-slate-100 pb-3 mb-6">
                <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#7C3AED]" /> Project Roadmap
                </h3>
                <p className="text-xs text-slate-400 mt-1">Recommended projects to build out and prove competency.</p>
              </div>
              <div className="space-y-4">
                {project_roadmap.map((proj: any, i: number) => (
                  <div key={i} className="group p-5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all duration-200">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase bg-indigo-50 px-2 py-0.5 rounded-md">
                          Project Recommendation
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 pt-1 leading-snug">
                          {proj.title}
                        </h4>
                      </div>
                      <div className="shrink-0 self-start">
                        <PriorityBadge priority={proj.priority} />
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                      <strong className="text-slate-800 font-semibold">Learning Outcomes:</strong> {proj.learning_outcomes}
                    </p>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {proj.technologies.map((tech: string, j: number) => (
                          <span key={j} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-500 rounded-md text-[10px] font-semibold">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Col */}
        <div className="flex flex-col gap-8">
          
          {/* Action Plan */}
          {timeline_roadmap && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="border-b border-slate-100 pb-3 mb-6">
                <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#7C3AED]" /> Action Plan
                </h3>
                <p className="text-xs text-slate-400 mt-1">Your step-by-step timeline execution roadmap.</p>
              </div>
              <div className="relative pl-6 border-l-2 border-purple-100 ml-2 space-y-6">
                {Object.entries(timeline_roadmap).map(([period, items]: [string, any], index) => {
                  const periodLabel = period
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, l => l.toUpperCase());

                  return (
                    <div key={period} className="relative">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-[#7C3AED] shadow-sm" />
                      
                      <div className="bg-slate-50/50 hover:bg-slate-50 p-4 rounded-2xl border border-slate-100 transition-colors">
                        <h4 className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          {periodLabel}
                        </h4>
                        <ul className="space-y-2">
                          {items.map((item: string, i: number) => (
                            <li key={i} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                              <span className="text-[#7C3AED] shrink-0 mt-1">✦</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Profile Improvements */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#7C3AED]" /> Profile Fixes
              </h3>
              <p className="text-xs text-slate-400 mt-1">Actionable tweaks to stand out to recruiters and pass ATS filters.</p>
            </div>
            
            <div className="space-y-6">
              {/* Resume Fixes */}
              {resume_improvement && resume_improvement.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-purple-500" /> Resume Improvements
                  </h4>
                  <div className="space-y-2.5">
                    {resume_improvement.map((item: any, i: number) => (
                      <div key={i} className="text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-55 p-3 rounded-xl border border-slate-100 flex items-start justify-between gap-4 transition-colors">
                        <span className="leading-relaxed">{item.suggestion}</span>
                        <div className="shrink-0 self-start">
                          <PriorityBadge priority={item.priority} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LinkedIn Fixes */}
              {linkedin_improvement && linkedin_improvement.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <LinkedinIcon className="w-3.5 h-3.5 text-blue-600" /> LinkedIn Improvements
                  </h4>
                  <div className="space-y-2.5">
                    {linkedin_improvement.map((item: any, i: number) => (
                      <div key={i} className="text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start justify-between gap-4 transition-colors">
                        <span className="leading-relaxed">{item.suggestion}</span>
                        <div className="shrink-0 self-start">
                          <PriorityBadge priority={item.priority} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GitHub Fixes */}
              {github_improvement && github_improvement.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <GithubIcon className="w-3.5 h-3.5 text-slate-700" /> GitHub Improvements
                  </h4>
                  <div className="space-y-2.5">
                    {github_improvement.map((item: any, i: number) => (
                      <div key={i} className="text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start justify-between gap-4 transition-colors">
                        <span className="leading-relaxed">{item.suggestion}</span>
                        <div className="shrink-0 self-start">
                          <PriorityBadge priority={item.priority} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Portfolio Fixes */}
              {portfolio_improvement && portfolio_improvement.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-600" /> Portfolio Improvements
                  </h4>
                  <div className="space-y-2.5">
                    {portfolio_improvement.map((item: any, i: number) => (
                      <div key={i} className="text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-55 p-3 rounded-xl border border-slate-100 flex items-start justify-between gap-4 transition-colors">
                        <span className="leading-relaxed">{item.suggestion}</span>
                        <div className="shrink-0 self-start">
                          <PriorityBadge priority={item.priority} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );

}
