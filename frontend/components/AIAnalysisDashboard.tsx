import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import {
  Sparkles,
  Globe,
  FileText,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Code2,
  TerminalSquare,
  Network,
  Copy,
  Check,
  TrendingUp,
  AlertTriangle,
  Compass,
  MessageSquare,
  Zap,
  Star,
  ArrowRight,
  BookOpen
} from "lucide-react";

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

type AnalysisStage = "idle" | "selecting" | "initializing" | "connecting" | "extracting" | "normalizing" | "analyzing" | "generating" | "complete";

interface AIAnalysisDashboardProps {
  githubUrl: string;
  portfolioUrl?: string;
  resumeFile?: File | null;
  resumeUrl?: string | null;
  linkedinUrl?: string;
  isLinkedInLoggedIn?: boolean;
  onLinkedInLogin?: (e: React.MouseEvent) => void;
  onAnalysisComplete: (result: any) => void;
  onRequestEditProfile: (mode?: "all" | "linkedin" | "github" | "portfolio") => void;
  onCancel: () => void;
}

export default function AIAnalysisDashboard({ githubUrl, portfolioUrl, resumeFile, resumeUrl, linkedinUrl, isLinkedInLoggedIn, onLinkedInLogin, onAnalysisComplete, onRequestEditProfile, onCancel }: AIAnalysisDashboardProps) {
  const [stage, setStage] = useState<AnalysisStage>("selecting");
  const [analysisType, setAnalysisType] = useState<"github" | "portfolio" | "resume" | "linkedin" | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [portfolioError, setPortfolioError] = useState(false);
  const [linkedinValidationError, setLinkedinValidationError] = useState(false);
  const [currentLoadingStepIndex, setCurrentLoadingStepIndex] = useState(0);

  const startGithubAnalysis = async () => {
    if (!githubUrl) {
      setError("Please add a valid GitHub profile URL to your profile first.");
      onRequestEditProfile();
      return;
    }

    let finalGithubUrl = githubUrl.trim();
    if (!finalGithubUrl.includes("github.com")) {
      finalGithubUrl = `https://github.com/${finalGithubUrl.replace(/^@/, '')}`;
    } else if (!finalGithubUrl.startsWith("http")) {
      finalGithubUrl = `https://${finalGithubUrl}`;
    }

    try {
      setError(null);
      setAnalysisType("github");
      setStage("initializing");
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStage("connecting");
      await new Promise(resolve => setTimeout(resolve, 800));

      setStage("extracting");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const analysisPromise = fetch(`${apiUrl}/analysis/github`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ github_url: finalGithubUrl })
      });

      await new Promise(resolve => setTimeout(resolve, 1500));
      setStage("normalizing");

      await new Promise(resolve => setTimeout(resolve, 1500));
      setStage("analyzing");

      const response = await analysisPromise;
      if (!response.ok) {
        throw new Error("Analysis failed. Please try again later.");
      }

      setStage("generating");
      const data = await response.json();

      await new Promise(resolve => setTimeout(resolve, 1000));
      setResult(data.data);
      setStage("complete");
      onAnalysisComplete(data.data);

    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
      setStage("selecting");
    }
  };

  const startPortfolioAnalysis = async () => {
    setPortfolioError(false);
    if (!portfolioUrl || portfolioUrl.trim() === "" || !portfolioUrl.includes(".")) {
      setPortfolioError(true);
      return;
    }

    let finalUrl = portfolioUrl.trim();
    if (!finalUrl.startsWith("http")) {
      finalUrl = `https://${finalUrl}`;
    }

    // Basic URL structure check
    try {
      new URL(finalUrl);
    } catch {
      setPortfolioError(true);
      return;
    }

    const portfolioLoadingMessages = [
      "Validating Portfolio URL...",
      "Connecting to Jina AI...",
      "Reading Portfolio Website...",
      "Extracting Projects...",
      "Extracting Skills...",
      "Building Structured Profile...",
      "Analyzing with Gemini AI...",
      "Generating Portfolio Intelligence...",
      "Preparing Professional Summary..."
    ];

    let stepInterval: any;

    try {
      setError(null);
      setAnalysisType("portfolio");
      setStage("initializing");

      let currentStep = 0;
      setCurrentLoadingStepIndex(0);
      stepInterval = setInterval(() => {
        if (currentStep < portfolioLoadingMessages.length - 2) {
          currentStep += 1;
          setCurrentLoadingStepIndex(currentStep);
        }
      }, 1200);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${apiUrl}/analysis/portfolio`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio_url: finalUrl })
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Analysis failed. Please try again later.");
      }

      const data = await response.json();
      setCurrentLoadingStepIndex(portfolioLoadingMessages.length - 1);
      await new Promise(resolve => setTimeout(resolve, 600));

      setResult(data.data);
      setStage("complete");
      onAnalysisComplete(data.data);

    } catch (err: any) {
      if (stepInterval) clearInterval(stepInterval);
      setError(err.message || "An error occurred during analysis.");
      setStage("selecting");
    }
  };

  const startResumeAnalysis = async () => {
    let fileToUse = resumeFile;
    if (!fileToUse && resumeUrl) {
      const filename = resumeUrl.split("/").pop() || "resume.pdf";
      const dummyContent = "%PDF-1.4\n%...\n%%EOF";
      const blob = new Blob([dummyContent], { type: "application/pdf" });
      fileToUse = new File([blob], filename, { type: "application/pdf" });
    }

    if (!fileToUse) {
      setError("Please upload a Resume first.");
      onRequestEditProfile("all");
      return;
    }

    try {
      setError(null);
      setAnalysisType("resume");
      setStage("initializing");
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStage("connecting");
      await new Promise(resolve => setTimeout(resolve, 800));

      setStage("extracting");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const formData = new FormData();
      formData.append("file", fileToUse);

      const analysisPromise = fetch(`${apiUrl}/analysis/resume`, {
        method: "POST",
        credentials: "include",
        body: formData
      });

      await new Promise(resolve => setTimeout(resolve, 1500));
      setStage("normalizing");

      await new Promise(resolve => setTimeout(resolve, 1500));
      setStage("analyzing");

      const response = await analysisPromise;
      if (!response.ok) {
        throw new Error("Analysis failed. Please try again later.");
      }

      setStage("generating");
      const data = await response.json();

      await new Promise(resolve => setTimeout(resolve, 1000));
      setResult(data.data);
      setStage("complete");
      onAnalysisComplete(data.data);

    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
      setStage("selecting");
    }
  };

  const startLinkedinAnalysis = async () => {
    setLinkedinValidationError(false);
    
    // 1. Validation
    const hasValidUrl = linkedinUrl && linkedinUrl.trim() !== "" && linkedinUrl.includes("linkedin.com/in/");
    if (!hasValidUrl) {
      setLinkedinValidationError(true);
      return;
    }

    let finalUrl = linkedinUrl.trim();
    if (!finalUrl.startsWith("http")) {
      finalUrl = `https://${finalUrl}`;
    }

    const linkedinLoadingMessages = [
      "Validating LinkedIn Login...",
      "Validating Profile URL...",
      "Reading Profile with Jina AI...",
      "Collecting Additional Data...",
      "Merging Profile Information...",
      "Building Structured Career Profile...",
      "Analyzing with Gemini AI...",
      "Generating Career Intelligence...",
      "Preparing Professional Summary..."
    ];

    let stepInterval: any;

    try {
      setError(null);
      setAnalysisType("linkedin");
      setStage("initializing");

      let currentStep = 0;
      setCurrentLoadingStepIndex(0);
      stepInterval = setInterval(() => {
        if (currentStep < linkedinLoadingMessages.length - 2) {
          currentStep += 1;
          setCurrentLoadingStepIndex(currentStep);
        }
      }, 1200);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${apiUrl}/analysis/linkedin`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedin_url: finalUrl })
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Analysis failed. Please try again later.");
      }

      const data = await response.json();
      setCurrentLoadingStepIndex(linkedinLoadingMessages.length - 1);
      await new Promise(resolve => setTimeout(resolve, 600));

      setResult(data.data);
      setStage("complete");
      onAnalysisComplete(data.data);

    } catch (err: any) {
      if (stepInterval) clearInterval(stepInterval);
      setError(err.message || "An error occurred during analysis.");
      setStage("selecting");
    }
  };

  const handleCopySummary = () => {
    if (!result) return;
    const s = result.summary;
    const sc = result.scores;

    let text = `FixToFlex AI Career Analysis Report\n====================================\n\n`;

    if (analysisType === "portfolio") {
      text += `CAREER OVERVIEW\n${s.career_overview}\n`;
      text += `\nTECHNICAL SKILLS\n${s.technical_skills_summary || ""}\nSkills: ${(s.technical_skills || []).join(", ")}\n`;
      text += `\nPRIMARY DOMAINS\n${(s.domain_identification || []).join(", ")}\n`;
      text += `\nPROJECTS ANALYSIS\n${s.project_analysis}\n`;
      text += `\nEXPERIENCE SUMMARY\n${s.experience_summary}\n`;
      text += `\nEDUCATION SUMMARY\n${s.education_summary || ""}\n`;
      text += `\nPORTFOLIO STRENGTHS\n${s.portfolio_strength}\n`;
      text += `\nPERSONAL BRANDING\n${s.personal_branding || ""}\n`;
      text += `\nUI/UX QUALITY\n${s.ui_ux_quality || ""}\n`;
      text += `\nIMPROVEMENT SUGGESTIONS\n${(s.improvement_suggestions || []).map((item: string) => `• ${item}`).join("\n")}\n`;
      if (s.missing_sections && s.missing_sections.length > 0) {
        text += `\nMISSING SECTIONS\n${(s.missing_sections || []).map((item: string) => `• ${item}`).join("\n")}\n`;
      }
      if (s.learning_roadmap && s.learning_roadmap.length > 0) {
        text += `\nROADMAP\n${(s.learning_roadmap || []).join(", ")}\n`;
      }
      text += `\nSUGGESTED ROLES\n${(s.suggested_career_paths || []).map((p: string) => `• ${p}`).join("\n")}\n`;
      text += `\nCAREER READINESS SCORES\n`;
      text += `Portfolio Quality: ${sc.portfolio_quality_score || sc.portfolio_score}/100\n`;
      text += `Technical Skills: ${sc.technical_skills_score}/100\n`;
      text += `Project Quality: ${sc.project_quality_score}/100\n`;
      text += `Personal Branding: ${sc.personal_branding_score}/100\n`;
      text += `Recruiter Readiness: ${sc.recruiter_readiness_score}/100\n`;
      text += `Career Readiness: ${sc.career_readiness_score}/100\n`;
      text += `\nFINAL AI OBSERVATION\n${s.final_observation || ""}\n`;
    } else if (analysisType === "linkedin") {
      text += `EXECUTIVE CAREER SUMMARY\n${s.executive_career_summary}\n`;
      text += `\nPROFESSIONAL PROFILE SUMMARY\n${s.professional_profile_summary}\n`;
      if (s.skills_summary) {
        text += `\nSKILLS SUMMARY\n`;
        text += `Technical Skills: ${(s.skills_summary.technical_skills || []).join(", ")}\n`;
        text += `Soft Skills: ${(s.skills_summary.soft_skills || []).join(", ")}\n`;
        text += `Domain Expertise: ${(s.skills_summary.domain_expertise || []).join(", ")}\n`;
      }
      text += `\nEXPERIENCE SUMMARY\n${s.experience_summary}\n`;
      if (s.internship_summary && s.internship_summary !== "Not Listed") {
        text += `\nINTERNSHIP SUMMARY\n${s.internship_summary}\n`;
      }
      text += `\nEDUCATION SUMMARY\n${s.education_summary}\n`;
      if (s.projects_summary && s.projects_summary !== "Not Listed") {
        text += `\nPROJECTS SUMMARY\n${s.projects_summary}\n`;
      }
      if (s.professional_interests && s.professional_interests.length > 0) {
        text += `\nPROFESSIONAL INTERESTS\n${(s.professional_interests || []).join(", ")}\n`;
      }
      if (s.linkedin_activity_summary) {
        text += `\nLINKEDIN ACTIVITY SUMMARY\n${s.linkedin_activity_summary}\n`;
      }
      text += `\nSTRENGTHS\n${(s.strengths || []).map((item: string) => `• ${item}`).join("\n")}\n`;
      text += `\nIMPROVEMENT AREAS\n${(s.improvement_areas || []).map((item: string) => `• ${item}`).join("\n")}\n`;
      text += `\nSUGGESTED CAREER PATHS\n${(s.suggested_career_paths || []).map((p: string) => `• ${p}`).join("\n")}\n`;
      if (s.learning_roadmap && s.learning_roadmap.length > 0) {
        text += `\nLEARNING ROADMAP\n${(s.learning_roadmap || []).join(", ")}\n`;
      }
      text += `\nCAREER OPTIMIZATION SCORES\n`;
      text += `Profile Strength: ${sc.profile_strength_score}/100\n`;
      text += `LinkedIn Optimization: ${sc.linkedin_optimization_score}/100\n`;
      text += `ATS Readiness: ${sc.ats_readiness_score}/100\n`;
      text += `Recruiter Visibility: ${sc.recruiter_visibility_score}/100\n`;
      text += `Professional Branding: ${sc.professional_branding_score}/100\n`;
      text += `Career Readiness: ${sc.career_readiness_score}/100\n`;
      text += `\nFINAL AI OBSERVATION\n${s.final_observation || ""}\n`;
    } else {
      text += `CAREER OVERVIEW\n${s.professional_profile_summary || s.executive_summary || ""}\n\n${s.overall_career_summary || ""}\n`;
      if (s.repositories_list && s.repositories_list.length > 0) {
        text += `\nREPOSITORIES\n${(s.repositories_list || []).map((r: any) => `• ${r.name} — ${r.description} [${r.tech_stack.join(", ")}]`).join("\n")}\n`;
      }
      if (s.programming_languages) {
        text += `\nTECHNICAL SKILLS\nLanguages: ${(s.programming_languages || []).join(", ")}\nFrameworks: ${(s.framework_experience || []).join(", ")}\n`;
      }
      if (s.development_domains) {
        text += `\nCORE DOMAINS\n${(s.development_domains || []).map((d: string) => `• ${d}`).join("\n")}\n`;
      }
      if (s.major_projects_overview) {
        text += `\nPROJECTS ANALYSIS\n${s.major_projects_overview}\n`;
      }
      if (s.development_experience_level) {
        text += `\nDEVELOPMENT EXPERIENCE\nLevel: ${s.development_experience_level}\nOpen Source: ${s.open_source_contributions}\n`;
      }
      if (s.technical_strengths) {
        text += `\nSTRENGTHS\n${(s.technical_strengths || []).map((t: string) => `✓ ${t}`).join("\n")}\n`;
      }
      if (s.improvement_areas) {
        text += `\nIMPROVEMENT AREAS\n${(s.improvement_areas || []).map((t: string) => `→ ${t}`).join("\n")}\n`;
      }
      text += `\nCAREER READINESS SCORES\n`;
      if (sc.overall_career_readiness_score !== undefined) {
        text += `Overall: ${sc.overall_career_readiness_score}/100\n`;
        text += `GitHub Profile: ${sc.github_profile_score}/100\n`;
        text += `Project Quality: ${sc.project_quality_score}/100\n`;
        text += `Documentation: ${sc.documentation_score}/100\n`;
        text += `Technical Skills: ${sc.technical_skills_score}/100\n`;
      } else if (sc.ats_score !== undefined) {
        text += `ATS Score: ${sc.ats_score}/100\n`;
        text += `Career Readiness: ${sc.career_readiness_score}/100\n`;
      }
      if (s.suggested_career_paths) {
        text += `SUGGESTED CAREER PATHS\n${(s.suggested_career_paths || []).map((p: string) => `• ${p}`).join("\n")}\n`;
      }
      text += `\nFINAL AI OBSERVATION\n${s.final_observation || ""}\n`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#7C3AED]" />
            AI Profile Analysis
          </h2>
          <p className="text-sm font-semibold text-slate-400 mt-1">
            Supercharge your profile with recruiter-ready intelligence.
          </p>
        </div>
        {stage !== "selecting" && stage !== "complete" && (
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
        )}
        {stage === "complete" && (
          <button
            onClick={() => { setStage("selecting"); setResult(null); setAnalysisType(null); }}
            className="px-4 py-2 bg-purple-50 text-[#7C3AED] rounded-xl text-xs font-bold hover:bg-purple-100 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            New Analysis
          </button>
        )}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* ───────── PORTFOLIO VALIDATION ERROR ───────── */}
        {portfolioError && (
          <motion.div
            key="portfolio-error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl border border-purple-100 rounded-3xl p-8 lg:p-12 shadow-xl text-center max-w-lg mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-6 shadow-xs animate-bounce">
              <Globe className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-extrabold text-slate-800 mb-3">
              Portfolio URL Required
            </h3>
            
            <p className="text-sm font-semibold text-slate-500 mb-8 leading-relaxed max-w-sm">
              Please add a valid portfolio website to generate your AI Portfolio Analysis.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <button
                onClick={() => {
                  setPortfolioError(false);
                  onRequestEditProfile();
                }}
                className="px-6 py-3.5 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white font-bold rounded-xl text-xs shadow-md hover:shadow-purple-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Add Portfolio
              </button>
              <button
                onClick={() => setPortfolioError(false)}
                className="px-6 py-3.5 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold rounded-xl text-xs active:scale-95 transition-all"
              >
                Back
              </button>
            </div>
          </motion.div>
        )}

        {linkedinValidationError && (
          <motion.div
            key="linkedin-error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl border border-purple-100 rounded-3xl p-8 lg:p-12 shadow-xl text-center max-w-lg mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#0A66C2]/10 border border-[#0A66C2]/20 flex items-center justify-center text-[#0A66C2] mb-6 shadow-xs animate-bounce">
              <Network className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-extrabold text-slate-800 mb-3">
              LinkedIn Profile Required
            </h3>
            
            <p className="text-sm font-semibold text-slate-500 mb-8 leading-relaxed max-w-sm">
              Please enter your LinkedIn profile URL in your profile before generating AI Career Analysis.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <button
                onClick={() => {
                  setLinkedinValidationError(false);
                  onRequestEditProfile("linkedin");
                }}
                className="px-6 py-3.5 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white font-bold rounded-xl text-xs shadow-md hover:shadow-purple-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Add LinkedIn Profile
              </button>
              <button
                onClick={() => setLinkedinValidationError(false)}
                className="px-6 py-3.5 bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 font-bold rounded-xl text-xs active:scale-95 transition-all"
              >
                Back
              </button>
            </div>
          </motion.div>
        )}

        {/* ───────── SELECTING ───────── */}
        {stage === "selecting" && !portfolioError && !linkedinValidationError && (
          <motion.div
            key="selecting"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6"
          >
            {/* GitHub Card (Active) */}
            <div
              onClick={startGithubAnalysis}
              className="group bg-white/80 backdrop-blur-xl border-2 border-purple-100 hover:border-[#7C3AED] rounded-3xl p-6 lg:p-8 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <GithubIcon className="w-6 h-6 text-white" />
                </div>
                <div className="px-3 py-1 bg-purple-50 rounded-full text-xs font-bold text-[#7C3AED] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Ready
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Summarize My GitHub</h3>
              <p className="text-sm font-semibold text-slate-500">
                Extract repositories, calculate tech scores, and generate a recruiter-facing code summary.
              </p>
            </div>

            {/* LinkedIn Card (Active) */}
            <div
              onClick={startLinkedinAnalysis}
              className="group bg-white/80 backdrop-blur-xl border-2 border-purple-100 hover:border-[#7C3AED] rounded-3xl p-6 lg:p-8 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#0A66C2] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <div className="px-3 py-1 bg-purple-50 rounded-full text-xs font-bold text-[#7C3AED] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Ready
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Summarize My LinkedIn</h3>
              <p className="text-sm font-semibold text-slate-500">
                Generate a professional career profile from your LinkedIn, using hybrid Jina and Scrape.do extraction.
              </p>
            </div>



            {/* Portfolio Card */}
            <div
              onClick={startPortfolioAnalysis}
              className="group bg-white/80 backdrop-blur-xl border-2 border-purple-100 hover:border-[#7C3AED] rounded-3xl p-6 lg:p-8 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="px-3 py-1 bg-purple-50 rounded-full text-xs font-bold text-[#7C3AED] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Ready
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Summarize My Portfolio</h3>
              <p className="text-sm font-semibold text-slate-500">
                Analyze your personal website and extract core UI/UX and engineering capabilities.
              </p>
            </div>

            {/* Resume Card */}
            <div
              onClick={startResumeAnalysis}
              className="group bg-white/80 backdrop-blur-xl border-2 border-purple-100 hover:border-[#7C3AED] rounded-3xl p-6 lg:p-8 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="px-3 py-1 bg-purple-50 rounded-full text-xs font-bold text-[#7C3AED] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Ready
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Summarize My Resume</h3>
              <p className="text-sm font-semibold text-slate-500">
                Parse your uploaded PDF and generate dynamic tailored variants for specific job roles.
              </p>
            </div>
          </motion.div>
        )}

        {/* ───────── LOADING ───────── */}
        {stage !== "selecting" && stage !== "complete" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl py-20 shadow-xl"
          >
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-purple-100 animate-ping opacity-75" />
              <div className="absolute inset-2 rounded-full border-4 border-indigo-100 animate-pulse" />
              <div className="absolute inset-4 bg-linear-to-br from-[#7C3AED] to-[#4F46E5] rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-800 mb-2">
              {stage === "initializing" && "Initializing AI..."}
              {stage === "connecting" && "Connecting to Server..."}
              {stage === "extracting" && `Extracting ${analysisType === "github" ? "GitHub Profile" : analysisType === "portfolio" ? "Portfolio Data" : analysisType === "linkedin" ? "LinkedIn Profile" : "Resume Details"}...`}
              {stage === "normalizing" && "Normalizing Data..."}
              {stage === "analyzing" && "Analyzing with AI..."}
              {stage === "generating" && "Generating Career Summary..."}
            </h3>

            {analysisType === "portfolio" || analysisType === "linkedin" ? (
              <div className="w-full max-w-md space-y-3.5 bg-slate-50/50 rounded-2xl p-6 border border-slate-100/80 mt-8 text-left">
                {(analysisType === "portfolio" ? [
                  "Validating Portfolio URL...",
                  "Connecting to Jina AI...",
                  "Reading Portfolio Website...",
                  "Extracting Projects...",
                  "Extracting Skills...",
                  "Building Structured Profile...",
                  "Analyzing with Gemini AI...",
                  "Generating Portfolio Intelligence...",
                  "Preparing Professional Summary..."
                ] : [
                  "Validating LinkedIn Login...",
                  "Validating Profile URL...",
                  "Reading Profile with Jina AI...",
                  "Collecting Additional Data...",
                  "Merging Profile Information...",
                  "Building Structured Career Profile...",
                  "Analyzing with Gemini AI...",
                  "Generating Career Intelligence...",
                  "Preparing Professional Summary..."
                ]).map((msg, idx) => {
                  const isCompleted = idx < currentLoadingStepIndex;
                  const isActive = idx === currentLoadingStepIndex;
                  const isPending = idx > currentLoadingStepIndex;
                  
                  return (
                    <div key={idx} className="flex items-center gap-3 text-sm font-semibold transition-all duration-300">
                      {isCompleted && <span className="text-emerald-500 font-bold shrink-0">✓</span>}
                      {isActive && <Loader2 className="w-4 h-4 text-purple-600 animate-spin shrink-0" />}
                      {isPending && <span className="w-4 h-4 rounded-full border-2 border-slate-200 shrink-0" />}
                      <span className={isCompleted ? "text-slate-500 font-medium" : isActive ? "text-[#7C3AED] font-extrabold" : "text-slate-400 font-medium"}>
                        {msg}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-64 h-2 bg-slate-100 rounded-full mt-8 overflow-hidden relative">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-linear-to-r from-[#7C3AED] to-[#4F46E5] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width: stage === "initializing" ? "10%" :
                           stage === "connecting" ? "25%" :
                           stage === "extracting" ? "45%" :
                           stage === "normalizing" ? "65%" :
                           stage === "analyzing" ? "85%" :
                           stage === "generating" ? "95%" : "100%"
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </motion.div>
        )}

        {/* ───────── COMPLETE: AI CHAT-STYLE REPORT ───────── */}
        {stage === "complete" && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-[24px] border border-slate-200/80 shadow-lg shadow-slate-200/50 overflow-hidden">

              {/* ── Report Header ── */}
              <div className="px-6 lg:px-10 pt-8 pb-6 border-b border-slate-100 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg shrink-0 ${
                  analysisType === "linkedin" ? "bg-[#0A66C2] shadow-blue-500/20" :
                  analysisType === "github" ? "bg-slate-900 shadow-slate-500/20" :
                  analysisType === "portfolio" ? "bg-emerald-500 shadow-emerald-500/20" :
                  "bg-amber-500 shadow-amber-500/20"
                }`}>
                  {analysisType === "linkedin" && <LinkedinIcon className="w-5 h-5 text-white" />}
                  {analysisType === "github" && <GithubIcon className="w-5 h-5 text-white" />}
                  {analysisType === "portfolio" && <Globe className="w-5 h-5 text-white" />}
                  {analysisType === "resume" && <FileText className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 leading-tight">FixToFlex AI Career Analyst</h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    {analysisType === "github" ? "GitHub Profile" : analysisType === "portfolio" ? "Portfolio" : analysisType === "linkedin" ? "LinkedIn Profile" : "Resume"} Intelligence Report
                  </p>
                </div>

                <div className="ml-auto hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3" /> Analysis Complete
                </div>
              </div>

              {/* ── Report Body ── */}
              <div className="px-6 lg:px-10 py-8 space-y-0">

{analysisType === "github" && (
  <>
                {/* Section 1: Career Overview */}
                <ReportSection index={0} icon={<MessageSquare className="w-4 h-4" />} title="Career Overview">
                  <p className="text-sm text-slate-600 leading-relaxed">{result.summary.professional_profile_summary}</p>
                  <p className="text-sm text-slate-600 leading-relaxed mt-3">{result.summary.overall_career_summary}</p>
                </ReportSection>

                <SectionDivider />

                  <>
                    {/* Section 2: Repositories */}
                    <ReportSection index={1} icon={<GithubIcon className="w-4 h-4" />} title="Repositories">
                      {result.summary.repositories_list && result.summary.repositories_list.length > 0 && (
                        <div className="space-y-3">
                          {result.summary.repositories_list.map((repo: any, i: number) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + i * 0.1 }}
                              className="flex items-start gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 hover:border-purple-200 transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                                <GithubIcon className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-800">{repo.name}</h4>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{repo.description}</p>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {repo.tech_stack.map((tech: string, j: number) => (
                                    <motion.span
                                      key={j}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: 0.8 + i * 0.1 + j * 0.05 }}
                                      className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 shadow-sm"
                                    >
                                      {tech}
                                    </motion.span>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </ReportSection>

                    <SectionDivider />

                    {/* Section 3: Technical Skills */}
                    <ReportSection index={2} icon={<TerminalSquare className="w-4 h-4" />} title="Technical Skills">
                      <p className="text-sm text-slate-600 leading-relaxed mb-5">{result.summary.technical_skills_summary}</p>

                      <div className="space-y-5">
                        <div>
                          <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2.5">Languages</h4>
                          <div className="flex flex-wrap gap-2">
                            {(result.summary.programming_languages || []).map((lang: string, i: number) => (
                              <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.0 + i * 0.06 }}
                                className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm"
                              >
                                {lang}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2.5">Frameworks & Tools</h4>
                          <div className="flex flex-wrap gap-2">
                            {(result.summary.framework_experience || []).map((fw: string, i: number) => (
                              <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 + i * 0.06 }}
                                className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-bold"
                              >
                                {fw}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </ReportSection>

                    <SectionDivider />

                    {/* Section 4: Core Domains */}
                    <ReportSection index={3} icon={<Network className="w-4 h-4" />} title="Core Domains">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {(result.summary.development_domains || []).map((domain: string, i: number) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.4 + i * 0.08 }}
                            className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 bg-amber-50/60 p-3 rounded-xl border border-amber-100/60"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {domain}
                          </motion.div>
                        ))}
                      </div>
                    </ReportSection>
                  </>


                <SectionDivider />

                {/* Section 5: Projects Analysis */}
                <ReportSection index={4} icon={<Code2 className="w-4 h-4" />} title="Projects Analysis">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {result.summary.major_projects_overview}
                  </p>
                  
                  <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-slate-400" /> Portfolio: {result.summary.portfolio_quality}</span>
                  </div>
                </ReportSection>

                <SectionDivider />

                {/* Section 6: Development Experience */}
                <ReportSection index={5} icon={<Zap className="w-4 h-4" />} title="Development Experience">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white rounded-lg text-xs font-bold shadow-sm">
                        {result.summary.development_experience_level}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      <span className="font-semibold text-slate-700">Open Source:</span> {result.summary.open_source_contributions}
                    </p>
                  </div>
                </ReportSection>

                <SectionDivider />

                {/* Section 7: Strengths */}
                <ReportSection index={6} icon={<Star className="w-4 h-4" />} title="Strengths">
                  <ul className="space-y-2">
                    {(result.summary.technical_strengths || []).map((s: string, i: number) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2.0 + i * 0.07 }}
                        className="flex items-start gap-2.5 text-sm text-slate-700"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="font-medium">{s}</span>
                      </motion.li>
                    ))}
                  </ul>
                </ReportSection>

                <SectionDivider />

                {/* Section 8: Improvement Areas */}
                <ReportSection index={7} icon={<AlertTriangle className="w-4 h-4" />} title="Improvement Areas">
                  <ul className="space-y-2">
                    {(result.summary.improvement_areas || []).map((item: string, i: number) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2.2 + i * 0.07 }}
                        className="flex items-start gap-2.5 text-sm text-slate-700"
                      >
                        <ArrowRight className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <span className="font-medium">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </ReportSection>

                <SectionDivider />

                {/* Section 9: Career Readiness Score */}
                <ReportSection index={8} icon={<TrendingUp className="w-4 h-4" />} title="Career Readiness Score">
                  <div className="space-y-4">
                    <ScoreBar label="Overall Readiness" value={result.scores.overall_career_readiness_score} color="bg-gradient-to-r from-[#7C3AED] to-[#4F46E5]" delay={2.4} />
                    <ScoreBar label="GitHub Profile" value={result.scores.github_profile_score} color="bg-gradient-to-r from-emerald-500 to-teal-400" delay={2.5} />
                    <ScoreBar label="Project Quality" value={result.scores.project_quality_score} color="bg-gradient-to-r from-blue-500 to-cyan-400" delay={2.6} />
                    <ScoreBar label="Documentation" value={result.scores.documentation_score} color="bg-gradient-to-r from-amber-500 to-orange-400" delay={2.7} />
                    <ScoreBar label="Technical Skills" value={result.scores.technical_skills_score} color="bg-gradient-to-r from-rose-500 to-pink-500" delay={2.8} />
                    <ScoreBar label="Open Source" value={result.scores.open_source_activity_score} color="bg-gradient-to-r from-indigo-500 to-violet-400" delay={2.9} />
                  </div>
                </ReportSection>

                <SectionDivider />

                {/* Section 10: Suggested Career Paths */}
                <ReportSection index={9} icon={<Compass className="w-4 h-4" />} title="Suggested Career Paths">
                  <div className="flex flex-wrap gap-2.5">
                    {(result.summary.suggested_career_paths || []).map((path: string, i: number) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 3.0 + i * 0.08 }}
                        className="px-4 py-2 bg-purple-50 border border-purple-200 text-[#7C3AED] rounded-xl text-sm font-bold shadow-sm"
                      >
                        {path}
                      </motion.span>
                    ))}
                  </div>

                </ReportSection>

                {/* Section 11: Final AI Observation */}
                {result.summary.final_observation && (
                  <>
                    <SectionDivider />
                    <ReportSection index={12} icon={<Sparkles className="w-4 h-4" />} title="Final AI Observation">
                      <div className="bg-linear-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-4">
                        <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
                          &quot;{result.summary.final_observation}&quot;
                        </p>
                      </div>
                    </ReportSection>
                  </>
                )}

  </>
)}

                {analysisType === "linkedin" && (
                  <>
                    {/* LinkedIn Section 1: Executive Career Summary */}
                    <ReportSection index={0} icon={<MessageSquare className="w-4 h-4" />} title="Executive Career Summary">
                      <p className="text-sm text-slate-600 leading-relaxed">{result.summary.executive_career_summary}</p>
                    </ReportSection>
                    <SectionDivider />

                    {/* LinkedIn Section 2: Professional Profile Summary */}
                    <ReportSection index={1} icon={<Star className="w-4 h-4" />} title="Professional Profile Summary">
                      <p className="text-sm text-slate-600 leading-relaxed">{result.summary.professional_profile_summary}</p>
                    </ReportSection>
                    <SectionDivider />

                    {/* LinkedIn Section 3: Technical & Soft Skills */}
                    <ReportSection index={2} icon={<TerminalSquare className="w-4 h-4" />} title="Skills Summary">
                      {result.summary.skills_summary && (
                        <div className="space-y-4">
                          {result.summary.skills_summary.technical_skills && result.summary.skills_summary.technical_skills.length > 0 && (
                            <div>
                              <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Technical Skills</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {result.summary.skills_summary.technical_skills.map((skill: string, i: number) => (
                                  <span key={i} className="px-2.5 py-1 bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs">{skill}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {result.summary.skills_summary.soft_skills && result.summary.skills_summary.soft_skills.length > 0 && (
                            <div>
                              <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Soft Skills</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {result.summary.skills_summary.soft_skills.map((skill: string, i: number) => (
                                  <span key={i} className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-bold">{skill}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {result.summary.skills_summary.domain_expertise && result.summary.skills_summary.domain_expertise.length > 0 && (
                            <div>
                              <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Domain Expertise</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {result.summary.skills_summary.domain_expertise.map((domain: string, i: number) => (
                                  <span key={i} className="px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-700 rounded-lg text-xs font-bold">{domain}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </ReportSection>
                    <SectionDivider />

                    {/* LinkedIn Section 4: Experience & Internships */}
                    <ReportSection index={3} icon={<Zap className="w-4 h-4" />} title="Work & Internship Experience">
                      <p className="text-sm text-slate-600 leading-relaxed mb-3"><span className="font-bold text-slate-700">Experience:</span> {result.summary.experience_summary}</p>
                      {result.summary.internship_summary && result.summary.internship_summary !== "Not Listed" && (
                        <p className="text-sm text-slate-600 leading-relaxed"><span className="font-bold text-slate-700">Internships:</span> {result.summary.internship_summary}</p>
                      )}
                    </ReportSection>
                    <SectionDivider />

                    {/* LinkedIn Section 5: Education */}
                    <ReportSection index={4} icon={<BookOpen className="w-4 h-4" />} title="Education">
                      <p className="text-sm text-slate-600 leading-relaxed">{result.summary.education_summary}</p>
                    </ReportSection>
                    <SectionDivider />

                    {/* LinkedIn Section 6: Projects */}
                    {result.summary.projects_summary && result.summary.projects_summary !== "Not Listed" && (
                      <>
                        <ReportSection index={5} icon={<Code2 className="w-4 h-4" />} title="Projects">
                          <p className="text-sm text-slate-600 leading-relaxed">{result.summary.projects_summary}</p>
                        </ReportSection>
                        <SectionDivider />
                      </>
                    )}

                    {/* LinkedIn Section 7: Professional Interests */}
                    {result.summary.professional_interests && result.summary.professional_interests.length > 0 && (
                      <>
                        <ReportSection index={6} icon={<Compass className="w-4 h-4" />} title="Professional Interests">
                          <div className="flex flex-wrap gap-1.5">
                            {result.summary.professional_interests.map((interest: string, i: number) => (
                              <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold shadow-xs">{interest}</span>
                            ))}
                          </div>
                        </ReportSection>
                        <SectionDivider />
                      </>
                    )}

                    {/* LinkedIn Section 8: Activity */}
                    {result.summary.linkedin_activity_summary && (
                      <>
                        <ReportSection index={7} icon={<Network className="w-4 h-4" />} title="LinkedIn Activity">
                          <p className="text-sm text-slate-600 leading-relaxed">{result.summary.linkedin_activity_summary}</p>
                        </ReportSection>
                        <SectionDivider />
                      </>
                    )}

                    {/* LinkedIn Section 9: Strengths & Improvements */}
                    <ReportSection index={8} icon={<AlertTriangle className="w-4 h-4" />} title="Strengths & Improvement Areas">
                      {result.summary.strengths && result.summary.strengths.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Strengths</h4>
                          <ul className="space-y-1.5">
                            {result.summary.strengths.map((str: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <span className="font-medium">{str}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.summary.improvement_areas && result.summary.improvement_areas.length > 0 && (
                        <div>
                          <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Improvement Areas</h4>
                          <ul className="space-y-1.5">
                            {result.summary.improvement_areas.map((imp: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                <ArrowRight className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                <span className="font-medium">{imp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </ReportSection>
                    <SectionDivider />

                    {/* LinkedIn Section 10: Suggested Career Paths */}
                    {result.summary.suggested_career_paths && result.summary.suggested_career_paths.length > 0 && (
                      <>
                        <ReportSection index={9} icon={<Compass className="w-4 h-4" />} title="Suggested Career Paths">
                          <div className="flex flex-wrap gap-1.5">
                            {result.summary.suggested_career_paths.map((path: string, i: number) => (
                              <span key={i} className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold shadow-xs">{path}</span>
                            ))}
                          </div>
                        </ReportSection>
                        <SectionDivider />
                      </>
                    )}

                    {/* LinkedIn Section 11: Learning Roadmap */}
                    {result.summary.learning_roadmap && result.summary.learning_roadmap.length > 0 && (
                      <>
                        <ReportSection index={10} icon={<BookOpen className="w-4 h-4" />} title="Learning Roadmap">
                          <div className="flex flex-wrap gap-1.5">
                            {result.summary.learning_roadmap.map((item: string, i: number) => (
                              <span key={i} className="px-2.5 py-1 bg-purple-50 border border-purple-100 text-[#7C3AED] rounded-lg text-xs font-bold">{item}</span>
                            ))}
                          </div>
                        </ReportSection>
                        <SectionDivider />
                      </>
                    )}

                    {/* LinkedIn Section 12: Career Scores */}
                    <ReportSection index={11} icon={<TrendingUp className="w-4 h-4" />} title="LinkedIn Optimization Scores">
                      <div className="space-y-4">
                        <ScoreBar label="Profile Strength Score" value={result.scores.profile_strength_score || 0} color="bg-gradient-to-r from-[#7C3AED] to-[#4F46E5]" delay={2.4} />
                        <ScoreBar label="LinkedIn Optimization Score" value={result.scores.linkedin_optimization_score || 0} color="bg-gradient-to-r from-emerald-500 to-teal-400" delay={2.5} />
                        <ScoreBar label="ATS Readiness Score" value={result.scores.ats_readiness_score || 0} color="bg-gradient-to-r from-blue-500 to-cyan-400" delay={2.6} />
                        <ScoreBar label="Recruiter Visibility Score" value={result.scores.recruiter_visibility_score || 0} color="bg-gradient-to-r from-amber-500 to-orange-400" delay={2.7} />
                        <ScoreBar label="Professional Branding Score" value={result.scores.professional_branding_score || 0} color="bg-gradient-to-r from-rose-500 to-pink-500" delay={2.8} />
                        <ScoreBar label="Career Readiness Score" value={result.scores.career_readiness_score || 0} color="bg-gradient-to-r from-indigo-500 to-violet-400" delay={2.9} />
                      </div>
                    </ReportSection>

                    {/* LinkedIn Section 13: Final Recruiter Observation */}
                    {result.summary.final_observation && (
                      <>
                        <SectionDivider />
                        <ReportSection index={12} icon={<Sparkles className="w-4 h-4" />} title="Final AI Observation">
                          <div className="bg-linear-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-4">
                            <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
                              &quot;{result.summary.final_observation}&quot;
                            </p>
                          </div>
                        </ReportSection>
                      </>
                    )}
                  </>
                )}

                {analysisType === "portfolio" && (
                  <>
                    {/* Portfolio Section 1: Career Overview */}
                    <ReportSection index={0} icon={<MessageSquare className="w-4 h-4" />} title="Career Overview">
                      <p className="text-sm text-slate-600 leading-relaxed">{result.summary.career_overview}</p>
                      {result.summary.domain_identification && result.summary.domain_identification.length > 0 && (
                        <div className="mt-3.5 flex flex-wrap gap-2 items-center">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Primary Domains:</span>
                          {result.summary.domain_identification.map((domain: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-700 rounded-lg text-xs font-bold">{domain}</span>
                          ))}
                        </div>
                      )}
                    </ReportSection>
                    <SectionDivider />

                    {/* Portfolio Section 2: Technical Skills */}
                    <ReportSection index={1} icon={<TerminalSquare className="w-4 h-4" />} title="Technical Skills">
                      <p className="text-sm text-slate-600 leading-relaxed mb-3.5">{result.summary.technical_skills_summary}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(result.summary.technical_skills || []).map((skill: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm">{skill}</span>
                        ))}
                      </div>
                    </ReportSection>
                    <SectionDivider />

                    {/* Portfolio Section 3: Projects Analysis */}
                    <ReportSection index={2} icon={<Code2 className="w-4 h-4" />} title="Project Analysis">
                      <p className="text-sm text-slate-600 leading-relaxed">{result.summary.project_analysis}</p>
                    </ReportSection>
                    <SectionDivider />

                    {/* Portfolio Section 4: Experience */}
                    <ReportSection index={3} icon={<Zap className="w-4 h-4" />} title="Experience">
                      <p className="text-sm text-slate-600 leading-relaxed">{result.summary.experience_summary}</p>
                    </ReportSection>
                    <SectionDivider />

                    {/* Portfolio Section 5: Education */}
                    <ReportSection index={4} icon={<BookOpen className="w-4 h-4" />} title="Education">
                      <p className="text-sm text-slate-600 leading-relaxed">{result.summary.education_summary}</p>
                    </ReportSection>
                    <SectionDivider />

                    {/* Portfolio Section 6: Portfolio Strength */}
                    <ReportSection index={5} icon={<Star className="w-4 h-4" />} title="Portfolio Strengths">
                      <p className="text-sm text-slate-600 leading-relaxed">{result.summary.portfolio_strength}</p>
                      {result.summary.recruiter_impression && (
                        <div className="mt-3.5 p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Recruiter Impression</span>
                          <p className="text-xs text-slate-600 leading-relaxed italic">"{result.summary.recruiter_impression}"</p>
                        </div>
                      )}
                    </ReportSection>
                    <SectionDivider />

                    {/* Portfolio Section 7: Personal Branding & UI/UX */}
                    <ReportSection index={6} icon={<Network className="w-4 h-4" />} title="Personal Branding & UI/UX">
                      <p className="text-sm text-slate-600 leading-relaxed mb-3.5"><span className="font-bold text-slate-700">Branding:</span> {result.summary.personal_branding}</p>
                      <p className="text-sm text-slate-600 leading-relaxed"><span className="font-bold text-slate-700">UI/UX Quality:</span> {result.summary.ui_ux_quality}</p>
                    </ReportSection>
                    <SectionDivider />

                    {/* Portfolio Section 8: Improvement Suggestions & Learning Roadmap */}
                    <ReportSection index={7} icon={<AlertTriangle className="w-4 h-4" />} title="Improvement Suggestions & Roadmap">
                      <ul className="space-y-2 mb-4">
                        {(result.summary.improvement_suggestions || []).map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                            <ArrowRight className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                            <span className="font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {result.summary.missing_sections && result.summary.missing_sections.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Missing Sections</h4>
                          <ul className="space-y-1.5">
                            {result.summary.missing_sections.map((item: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                                <span className="font-medium">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.summary.learning_roadmap && result.summary.learning_roadmap.length > 0 && (
                        <div>
                          <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Learning Roadmap</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {result.summary.learning_roadmap.map((tech: string, i: number) => (
                              <span key={i} className="px-2.5 py-1 bg-purple-50 border border-purple-100 text-[#7C3AED] rounded-lg text-xs font-bold">{tech}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </ReportSection>
                    <SectionDivider />

                    {/* Portfolio Section 9: Suggested Career Paths */}
                    {result.summary.suggested_career_paths && result.summary.suggested_career_paths.length > 0 && (
                      <>
                        <ReportSection index={8} icon={<Compass className="w-4 h-4" />} title="Suggested Career Paths">
                          <div className="flex flex-wrap gap-1.5">
                            {result.summary.suggested_career_paths.map((path: string, i: number) => (
                              <span key={i} className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold shadow-xs">{path}</span>
                            ))}
                          </div>
                        </ReportSection>
                        <SectionDivider />
                      </>
                    )}

                    {/* Portfolio Section 10: Career Readiness Score */}
                    <ReportSection index={9} icon={<TrendingUp className="w-4 h-4" />} title="Career Readiness Score">
                      <div className="space-y-4">
                        <ScoreBar label="Portfolio Quality" value={result.scores.portfolio_quality_score || result.scores.portfolio_score || 0} color="bg-gradient-to-r from-[#7C3AED] to-[#4F46E5]" delay={2.4} />
                        <ScoreBar label="Technical Skills" value={result.scores.technical_skills_score || 0} color="bg-gradient-to-r from-emerald-500 to-teal-400" delay={2.5} />
                        <ScoreBar label="Project Quality" value={result.scores.project_quality_score || 0} color="bg-gradient-to-r from-blue-500 to-cyan-400" delay={2.6} />
                        <ScoreBar label="Personal Branding" value={result.scores.personal_branding_score || 0} color="bg-gradient-to-r from-amber-500 to-orange-400" delay={2.7} />
                        <ScoreBar label="Recruiter Readiness" value={result.scores.recruiter_readiness_score || 0} color="bg-gradient-to-r from-rose-500 to-pink-500" delay={2.8} />
                        <ScoreBar label="Career Readiness" value={result.scores.career_readiness_score || 0} color="bg-gradient-to-r from-indigo-500 to-violet-400" delay={2.9} />
                      </div>
                    </ReportSection>
                    
                    {/* Portfolio Section 11: Final Observation */}
                    {result.summary.final_observation && (
                      <>
                        <SectionDivider />
                        <ReportSection index={10} icon={<Sparkles className="w-4 h-4" />} title="Final AI Observation">
                          <div className="bg-linear-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-4">
                            <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
                              "{result.summary.final_observation}"
                            </p>
                          </div>
                        </ReportSection>
                      </>
                    )}
                  </>
                )}

                {analysisType === "resume" && (
                  <>
                    <ReportSection index={0} icon={<MessageSquare className="w-4 h-4" />} title="Executive Summary">
                      <p className="text-sm text-slate-600 leading-relaxed">{result.summary.executive_summary}</p>
                    </ReportSection>
                    <SectionDivider />
                    <ReportSection index={1} icon={<Star className="w-4 h-4" />} title="Resume Strength">
                      <p className="text-sm text-slate-600 leading-relaxed">{result.summary.resume_strength}</p>
                    </ReportSection>
                    <SectionDivider />
                    <ReportSection index={2} icon={<TerminalSquare className="w-4 h-4" />} title="Skills Analysis">
                      <p className="text-sm text-slate-600 leading-relaxed">{result.summary.skills_analysis}</p>
                    </ReportSection>
                    <SectionDivider />
                    <ReportSection index={3} icon={<Zap className="w-4 h-4" />} title="Experience & Projects">
                      <p className="text-sm text-slate-600 leading-relaxed mb-3"><span className="font-semibold text-slate-700">Experience:</span> {result.summary.experience_analysis}</p>
                      <p className="text-sm text-slate-600 leading-relaxed"><span className="font-semibold text-slate-700">Projects:</span> {result.summary.project_evaluation}</p>
                    </ReportSection>
                    <SectionDivider />
                    <ReportSection index={4} icon={<Compass className="w-4 h-4" />} title="Target Role Matching">
                      <p className="text-sm text-slate-600 leading-relaxed">{result.summary.target_role_matching}</p>
                    </ReportSection>
                    <SectionDivider />
                    <ReportSection index={5} icon={<AlertTriangle className="w-4 h-4" />} title="Improvement Areas">
                      <ul className="space-y-2">
                        {(result.summary.improvement_suggestions || []).map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                            <ArrowRight className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                            <span className="font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                      {result.summary.resume_weaknesses?.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2.5">Weaknesses</h4>
                          <ul className="space-y-2">
                            {result.summary.resume_weaknesses.map((item: string, i: number) => (
                              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                                <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                                <span className="font-medium">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </ReportSection>
                    {result.summary.missing_keywords?.length > 0 && (
                      <>
                        <SectionDivider />
                        <ReportSection index={6} icon={<Code2 className="w-4 h-4" />} title="Missing Keywords">
                          <div className="flex flex-wrap gap-2">
                            {result.summary.missing_keywords.map((kw: string, i: number) => (
                              <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-bold shadow-sm">{kw}</span>
                            ))}
                          </div>
                        </ReportSection>
                      </>
                    )}
                    <SectionDivider />
                    <ReportSection index={7} icon={<TrendingUp className="w-4 h-4" />} title="Career Readiness Score">
                      <div className="space-y-4">
                        <ScoreBar label="ATS Score" value={result.scores.ats_score} color="bg-gradient-to-r from-blue-500 to-cyan-400" delay={2.4} />
                        <ScoreBar label="Career Readiness" value={result.scores.career_readiness_score} color="bg-gradient-to-r from-emerald-500 to-teal-400" delay={2.5} />
                      </div>
                    </ReportSection>
                  </>
                )}
              </div>
              {/* ── Report Footer ── */}
              <div className="px-6 lg:px-10 py-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <p className="text-[11px] font-semibold text-slate-400">
                  Powered by FixToFlex AI · Gemini 3.1 Flash
                </p>
                <button
                  onClick={handleCopySummary}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
                >
                  {copied ? (
                    <><Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /> Copy Summary</>
                  )}
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════════ */

const ReportSection = ({
  index,
  icon,
  title,
  children,
}: {
  index: number;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => {
  const styledIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<any>, {
        className: "w-5 h-5 text-[#7C3AED] shrink-0 stroke-[2.5]"
      })
    : icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.5, ease: "easeOut" }}
      className="py-6"
    >
      <div className="flex items-center gap-2 mb-4">
        {styledIcon}
        <h3 className="text-base font-extrabold text-slate-800">{title}</h3>
      </div>
      <div className="pl-[28px]">
        {children}
      </div>
    </motion.div>
  );
};

const SectionDivider = () => (
  <div className="pl-[28px]">
    <div className="h-px bg-slate-100" />
  </div>
);

const ScoreBar = ({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  delay: number;
}) => {
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = counterRef.current;
    if (node) {
      const controls = animate(0, value, {
        duration: 1.5,
        delay: delay - 2.4,
        ease: "easeOut",
        onUpdate(v) {
          node.textContent = Math.round(v).toString();
        },
      });
      return () => controls.stop();
    }
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-slate-600">{label}</span>
        <span className="text-xs font-extrabold text-slate-800">
          <span ref={counterRef}>0</span>
          <span className="text-slate-400 font-bold">/100</span>
        </span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: "0%" }}
          animate={{ width: `${value}%` }}
          transition={{ delay, duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};
