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

// Client-side Summary Generators
const generateExecutiveSummary = (user: any, report: any) => {
  const title = user?.headline || "Software Professional";
  const target = user?.target_job_role || user?.interested_domain || "your target engineering role";
  
  const sources = [];
  if (report.linkedin_improvement?.length > 0) sources.push("LinkedIn");
  if (report.github_improvement?.length > 0) sources.push("GitHub");
  if (report.portfolio_improvement?.length > 0) sources.push("Portfolio");
  if (report.resume_improvement?.length > 0) sources.push("Resume");
  
  const sourceStr = sources.length > 0 
    ? `across your ${sources.slice(0, -1).join(", ")}${sources.length > 1 ? " and " : ""}${sources.slice(-1)} profiles`
    : "across your active online profiles";

  return `Based on an aggregate analysis of your professional presence ${sourceStr}, you are currently positioned as a ${title} targeting a transition or growth into a ${target} position.

Your profile shows notable technical competencies and positive attributes. However, to compete effectively for premium opportunities in this domain, several critical optimizations are recommended. By refining your profile visibility, addressing core skill gaps, and showcasing impact-driven projects, you can significantly elevate your response rate and market presence.`;
};

const generateOverallReadiness = (user: any, report: any) => {
  const currentAts = report.progress_estimation?.current_ats_readiness || 50;
  const expectedAts = report.progress_estimation?.expected_ats_readiness || 85;
  const target = user?.target_job_role || user?.interested_domain || "your target role";

  let evaluation = "";
  if (currentAts < 60) {
    evaluation = `Currently, your profile contains structural alignment gaps that may cause it to be filtered out by automated ATS software for ${target} roles. Your baseline readiness score is ${currentAts}%.`;
  } else if (currentAts < 80) {
    evaluation = `Your profile shows a moderate alignment with ${target} benchmarks, achieving a readiness score of ${currentAts}%. With standard ATS screening, you are likely to pass introductory phases but may face stiff competition during technical reviews.`;
  } else {
    evaluation = `Your profile is already well-positioned, scoring ${currentAts}% in overall readiness. You satisfy the majority of recruiter search filters for ${target} positions.`;
  }

  evaluation += ` By applying the targeted improvements in this report, your expected profile strength increases to ${report.progress_estimation?.expected_profile_strength || 90}% and your ATS match rate rises to ${expectedAts}%, positioning you as a highly competitive applicant.`;

  return evaluation;
};

const generateTargetRoleReadiness = (user: any, report: any) => {
  const target = user?.target_job_role || user?.interested_domain || "your target role";
  const score = report.progress_estimation?.expected_ats_readiness || 85;
  
  let matchLevel = "Moderate Alignment";
  let description = "";
  if (score >= 85) {
    matchLevel = "Excellent Potential Alignment";
    description = `Following the execution of this roadmap, your qualifications will closely align with the senior and mid-level requirements for ${target}. Your technical stack will demonstrate sufficient depth, and your portfolio projects will serve as solid proof of execution.`;
  } else if (score >= 70) {
    matchLevel = "Good Foundational Alignment";
    description = `Your core technical foundations match the baseline criteria for ${target}. To achieve top-tier competitiveness, you must focus on bridging the critical skill gaps and ensuring your resume highlights key metrics.`;
  } else {
    matchLevel = "Developing Alignment";
    description = `You are in the process of building qualifications for ${target}. Focus heavily on the fundamental projects in this roadmap and complete the 7-day action items to build momentum.`;
  }

  return { matchLevel, description };
};

const generateFinalObservation = (user: any, report: any) => {
  const name = user?.full_name || "Candidate";
  const target = user?.target_job_role || user?.interested_domain || "your target role";
  
  return `Coaching Assessment: ${name} possesses a clear path toward securing competitive offers as a ${target}. The primary point of leverage is not just learning new skills, but actively packaging and presenting your current expertise.

By tidying up your GitHub repository documentation, optimizing resume impact statements, and developing the recommended portfolio case studies, you will transition from a passive candidate to an active, high-signal talent. Complete the next 7 days checklist to initiate this transformation.`;
};

export default function CareerIntelligenceReport({ userId }: CareerIntelligenceReportProps) {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Animation streaming states
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
    // Attempt local storage load
    const cached = localStorage.getItem("user_session");
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch (e) {
        console.error("Local user parsing failed:", e);
      }
    }

    // Refresh user context via API
    fetch(getApiUrl("/users/me"), { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setUser(data);
          localStorage.setItem("user_session", JSON.stringify(data));
        }
      })
      .catch((err) => console.error("Error fetching profile context:", err));

    fetchReport();
  }, [userId]);

  // Handle sequential streaming animation
  useEffect(() => {
    if (!report) return;

    if (currentSectionIndex >= SECTIONS.length) {
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    const delay = currentSectionIndex === 0 ? 500 : 1000;
    
    const timer = setTimeout(() => {
      setIsTyping(false);
      const nextTimer = setTimeout(() => {
        setCurrentSectionIndex((prev) => prev + 1);
      }, 300);
      return () => clearTimeout(nextTimer);
    }, delay);

    return () => clearTimeout(timer);
  }, [report, currentSectionIndex]);

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
      setCurrentSectionIndex(0);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipAnimation = () => {
    setCurrentSectionIndex(SECTIONS.length);
    setIsTyping(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[#7C3AED]/20 blur-xl rounded-full animate-pulse" />
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
        <button onClick={fetchReport} className="px-6 py-2 bg-rose-500 text-white font-bold rounded-xl text-sm hover:bg-rose-600 transition-colors cursor-pointer">
          Try Again
        </button>
      </div>
    );
  }

  if (!report) return null;

  const PriorityBadge = ({ priority }: { priority: string }) => {
    const colors: any = {
      Critical: "bg-rose-100 text-rose-700 border-rose-200",
      Important: "bg-amber-100 text-amber-700 border-amber-200",
      Optional: "bg-emerald-100 text-emerald-700 border-emerald-200",
      Future: "bg-blue-100 text-blue-700 border-blue-200"
    };
    return (
      <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded-md border shrink-0 ${colors[priority] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
        {priority}
      </span>
    );
  };

  const TypingIndicator = () => (
    <div className="flex items-center gap-1.5 py-3 pl-2">
      <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      <span className="text-[11px] font-semibold text-slate-400 ml-1.5 animate-pulse">AI Coach is writing...</span>
    </div>
  );

  const SECTIONS = [
    {
      id: "exec-summary",
      title: "1. Executive Career Summary",
      icon: FileText,
      render: () => (
        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
          {generateExecutiveSummary(user, report)}
        </p>
      )
    },
    {
      id: "readiness",
      title: "2. Overall Career Readiness",
      icon: TrendingUp,
      render: () => (
        <div className="space-y-4">
          <p className="text-slate-600 text-sm leading-relaxed">
            {generateOverallReadiness(user, report)}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Readiness</span>
                <span className="text-2xl font-black text-slate-800">{report.progress_estimation?.current_ats_readiness || 50}%</span>
              </div>
              <div className="h-2 w-24 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${report.progress_estimation?.current_ats_readiness || 50}%` }} />
              </div>
            </div>
            <div className="bg-emerald-50/20 border border-emerald-100/50 rounded-xl p-4 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Expected Readiness</span>
                <span className="text-2xl font-black text-emerald-600">{report.progress_estimation?.expected_ats_readiness || 85}%</span>
              </div>
              <div className="h-2 w-24 bg-emerald-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${report.progress_estimation?.expected_ats_readiness || 85}%` }} />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "strength",
      title: "3. Profile Strength Analysis",
      icon: User,
      render: () => (
        <div className="space-y-6">
          <p className="text-slate-600 text-sm leading-relaxed">
            A comparison of your current profile strength and ATS match rate metrics against the targeted expected benchmark post-optimization:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Strength */}
            <div className="bg-slate-50/30 border border-slate-100 rounded-2xl p-5 shadow-xs">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Profile Strength</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-extrabold text-slate-500">{report.progress_estimation?.current_profile_strength}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-lg font-extrabold text-emerald-600">+{report.progress_estimation?.expected_profile_strength}</span>
                  <span className="text-[10px] text-slate-400">/100</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                <div className="absolute left-0 top-0 h-full bg-emerald-400 rounded-full" style={{ width: `${report.progress_estimation?.expected_profile_strength}%` }} />
                <div className="absolute left-0 top-0 h-full bg-indigo-600 rounded-full" style={{ width: `${report.progress_estimation?.current_profile_strength}%` }} />
              </div>
              <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400">
                <span>Current Status</span>
                <span className="text-emerald-600 font-bold">+{ (report.progress_estimation?.expected_profile_strength || 0) - (report.progress_estimation?.current_profile_strength || 0) } pts increase</span>
              </div>
            </div>

            {/* ATS Match Rate */}
            <div className="bg-slate-50/30 border border-slate-100 rounded-2xl p-5 shadow-xs">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">ATS Match Rate</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-extrabold text-slate-500">{report.progress_estimation?.current_ats_readiness}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-lg font-extrabold text-emerald-600">+{report.progress_estimation?.expected_ats_readiness}</span>
                  <span className="text-[10px] text-slate-400">/100</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                <div className="absolute left-0 top-0 h-full bg-emerald-400 rounded-full" style={{ width: `${report.progress_estimation?.expected_ats_readiness}%` }} />
                <div className="absolute left-0 top-0 h-full bg-indigo-600 rounded-full" style={{ width: `${report.progress_estimation?.current_ats_readiness}%` }} />
              </div>
              <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400">
                <span>Current Status</span>
                <span className="text-emerald-600 font-bold">+{ (report.progress_estimation?.expected_ats_readiness || 0) - (report.progress_estimation?.current_ats_readiness || 0) } pts increase</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "skills",
      title: "4. Skill Gap Analysis",
      icon: Code,
      render: () => {
        const roadmap = report.skill_improvement_roadmap || [];
        const priorities = ["Critical", "Important", "Optional", "Future"];
        
        return (
          <div className="space-y-6">
            <p className="text-slate-600 text-sm leading-relaxed">
              The following checklist highlights technical and domain competencies you need to strengthen for your target role, sorted by priority:
            </p>
            
            {priorities.map((prio) => {
              const filtered = roadmap.filter((item: any) => item.priority?.toLowerCase() === prio.toLowerCase());
              if (filtered.length === 0) return null;
              
              const titleColors: any = {
                Critical: "text-rose-600 bg-rose-50 border-rose-100",
                Important: "text-amber-700 bg-amber-50 border-amber-100",
                Optional: "text-emerald-700 bg-emerald-50 border-emerald-100",
                Future: "text-blue-700 bg-blue-50 border-blue-100"
              };
              
              return (
                <div key={prio} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md border ${titleColors[prio] || "text-slate-700 bg-slate-50 border-slate-200"}`}>
                      {prio} Priorities
                    </span>
                    <div className="h-px bg-slate-100 flex-1" />
                  </div>
                  <div className="grid grid-cols-1 gap-3.5">
                    {filtered.map((skill: any, idx: number) => (
                      <div key={idx} className="bg-slate-50/50 border border-slate-100/80 rounded-2xl p-4.5 hover:bg-slate-50 transition-colors shadow-xs">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded-md">
                              {skill.category || "General"}
                            </span>
                            <h4 className="text-sm font-bold text-slate-800 pt-1 leading-snug">
                              {skill.recommendation}
                            </h4>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-md shrink-0">
                            {skill.learning_difficulty || "Medium"} Difficulty
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                          <strong className="text-slate-700 font-semibold">Why it matters:</strong> {skill.why_important}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          <strong className="text-slate-700 font-semibold">Action to complete:</strong> Implement this technical competency in a test workspace, or achieve verification/certification to showcase proficiency.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      }
    },
    {
      id: "projects",
      title: "5. Project Roadmap",
      icon: BookOpen,
      render: () => (
        <div className="space-y-4">
          <p className="text-slate-600 text-sm leading-relaxed">
            Targeted projects built using relevant technologies can demonstrate capability. Consider building:
          </p>
          <div className="grid grid-cols-1 gap-4">
            {(report.project_roadmap || []).map((proj: any, idx: number) => (
              <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 shadow-xs">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{proj.title}</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 block">Difficulty: {proj.difficulty || "Intermediate"}</span>
                  </div>
                  <PriorityBadge priority={proj.priority || "Important"} />
                </div>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  <strong className="text-slate-800 font-semibold">Learning Outcomes:</strong> {proj.learning_outcomes}
                </p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3.5">
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
      )
    },
    {
      id: "resume",
      title: "6. Resume Improvements",
      icon: FileText,
      render: () => (
        <div className="space-y-3">
          <p className="text-slate-600 text-sm leading-relaxed mb-1">
            Optimizations to help your resume pass ATS screeners and highlight accomplishments:
          </p>
          <div className="grid grid-cols-1 gap-2.5">
            {(report.resume_improvement || []).map((item: any, i: number) => (
              <div key={i} className="text-xs text-slate-700 bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex items-center justify-between gap-4 shadow-xs">
                <span className="leading-relaxed">{item.suggestion}</span>
                <PriorityBadge priority={item.priority} />
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "linkedin",
      title: "7. LinkedIn Improvements",
      icon: Globe,
      render: () => (
        <div className="space-y-3">
          <p className="text-slate-600 text-sm leading-relaxed mb-1">
            Profile structural adjustments to maximize recruiter visibility and search impressions:
          </p>
          <div className="grid grid-cols-1 gap-2.5">
            {(report.linkedin_improvement || []).map((item: any, i: number) => (
              <div key={i} className="text-xs text-slate-700 bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex items-center justify-between gap-4 shadow-xs">
                <span className="leading-relaxed">{item.suggestion}</span>
                <PriorityBadge priority={item.priority} />
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "github",
      title: "8. GitHub Improvements",
      icon: Code,
      render: () => (
        <div className="space-y-3">
          <p className="text-slate-600 text-sm leading-relaxed mb-1">
            Repository structuring and documentation to demonstrate code quality to technical reviewers:
          </p>
          <div className="grid grid-cols-1 gap-2.5">
            {(report.github_improvement || []).map((item: any, i: number) => (
              <div key={i} className="text-xs text-slate-700 bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex items-center justify-between gap-4 shadow-xs">
                <span className="leading-relaxed">{item.suggestion}</span>
                <PriorityBadge priority={item.priority} />
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "portfolio",
      title: "9. Portfolio Improvements",
      icon: Globe,
      render: () => (
        <div className="space-y-3">
          <p className="text-slate-600 text-sm leading-relaxed mb-1">
            Personal branding, accessibility, and template tweaks to showcase project outcomes:
          </p>
          <div className="grid grid-cols-1 gap-2.5">
            {(report.portfolio_improvement || []).map((item: any, i: number) => (
              <div key={i} className="text-xs text-slate-700 bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex items-center justify-between gap-4 shadow-xs">
                <span className="leading-relaxed">{item.suggestion}</span>
                <PriorityBadge priority={item.priority} />
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "timeline",
      title: "10. Learning Roadmap",
      icon: TrendingUp,
      render: () => (
        <div className="space-y-4">
          <p className="text-slate-600 text-sm leading-relaxed">
            A sequential timeline for learning and execution:
          </p>
          <div className="relative pl-6 border-l-2 border-purple-100 ml-2 space-y-6">
            {Object.entries(report.timeline_roadmap || {}).map(([period, items]: [string, any]) => {
              const periodLabels: any = {
                next_7_days: "Immediate (Next 7 Days)",
                next_month: "Short-Term (Next Month)",
                next_3_months: "Mid-Term (Next 3 Months)",
                next_6_months: "Long-Term (Next 6 Months)"
              };
              const label = periodLabels[period] || period.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());

              return (
                <div key={period} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-[#7C3AED] shadow-xs" />
                  
                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-xs">
                    <h4 className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      {label}
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
      )
    },
    {
      id: "target-role",
      title: "11. Target Role Readiness",
      icon: CheckCircle2,
      render: () => {
        const { matchLevel, description } = generateTargetRoleReadiness(user, report);
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Job Role Alignment:</span>
              <span className="px-2 py-0.5 rounded bg-purple-50 text-[#7C3AED] border border-purple-100 font-extrabold text-[10px] uppercase">
                {matchLevel}
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mt-2">
              {description}
            </p>
          </div>
        );
      }
    },
    {
      id: "observation",
      title: "12. Final AI Observation",
      icon: Sparkles,
      render: () => (
        <div className="space-y-3">
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
            {generateFinalObservation(user, report)}
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto pb-16">
      
      {/* Header section */}
      <div className="bg-linear-to-r from-[#7C3AED] to-[#4F46E5] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div>
            <h2 className="text-2xl font-extrabold flex items-center gap-2.5">
              <Sparkles className="w-7 h-7" /> AI Career Coach
            </h2>
            <p className="text-white/80 text-xs font-medium mt-1">
              Optimizing your career profile for tech recruiters and ATS compliance.
            </p>
          </div>
          {currentSectionIndex < SECTIONS.length && (
            <button
              onClick={handleSkipAnimation}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold rounded-xl text-xs backdrop-blur-xs transition-colors cursor-pointer shrink-0"
            >
              Skip Animation
            </button>
          )}
        </div>
      </div>

      {/* Main Unified Document */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-8 lg:p-12 shadow-sm relative overflow-hidden">
        
        {/* Decorative corner ambient glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-8">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-[#7C3AED]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800">Career Intelligence Report</h1>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
              Consultation document powered by Gemini AI Analysis
            </p>
          </div>
        </div>

        {/* Vertical Timeline container */}
        <div className="pl-16 border-l-2 border-slate-100 relative space-y-12 ml-4">
          
          <AnimatePresence>
            {SECTIONS.map((sec, i) => {
              const isVisible = i < currentSectionIndex;
              const isActive = i === currentSectionIndex && isTyping;

              if (!isVisible && !isActive) return null;

              return (
                <motion.div
                  key={sec.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  {/* Timeline circular indicator — sits centered on the left border */}
                  <div 
                    className={`absolute -left-[calc(4rem+1px)] top-0 w-8 h-8 rounded-full border-2 shadow-sm flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? "bg-purple-50 border-purple-400 text-[#7C3AED] animate-pulse" 
                        : "bg-white border-slate-200 text-indigo-600"
                    }`}
                  >
                    {React.createElement(sec.icon, { className: "w-4 h-4" })}
                  </div>

                  <div className="w-full">
                    <h3 className="text-base font-bold text-slate-800 mb-3">
                      {sec.title}
                    </h3>
                    
                    {isActive ? <TypingIndicator /> : sec.render()}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
