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
  Network
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
  onAnalysisComplete: (result: any) => void;
  onRequestEditProfile: () => void;
  onCancel: () => void;
}

export default function AIAnalysisDashboard({ githubUrl, onAnalysisComplete, onRequestEditProfile, onCancel }: AIAnalysisDashboardProps) {
  const [stage, setStage] = useState<AnalysisStage>("selecting");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const startGithubAnalysis = async () => {
    if (!githubUrl || !githubUrl.includes("github.com")) {
      setError("Please add a valid GitHub profile URL to your profile first.");
      onRequestEditProfile();
      return;
    }

    try {
      setError(null);
      // Simulate frontend loading progression while backend does the work
      setStage("initializing");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStage("connecting");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setStage("extracting");
      
      // Fire API call
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      // Do not await yet, let the loader run
      const analysisPromise = fetch(`${apiUrl}/analysis/github`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ github_url: githubUrl })
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStage("normalizing");
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStage("analyzing");
      
      // Now wait for API
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

  return (
    <div className="w-full flex flex-col gap-6">
      {/* HEADER SECTION */}
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
            onClick={() => setStage("selecting")}
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

      {/* STAGE: SELECTING */}
      <AnimatePresence mode="wait">
        {stage === "selecting" && (
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

            {/* LinkedIn Card (Coming Soon) */}
            <div className="bg-slate-50/50 backdrop-blur-sm border-2 border-slate-100 rounded-3xl p-6 lg:p-8 opacity-70 relative">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#0A66C2] flex items-center justify-center">
                  <LinkedinIcon className="w-6 h-6 text-white" />
                </div>
                <div className="px-3 py-1 bg-slate-200 rounded-full text-[10px] font-extrabold text-slate-500 tracking-wider">
                  COMING SOON
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Summarize My LinkedIn</h3>
              <p className="text-sm font-semibold text-slate-500">
                Extract professional history and optimize your career narrative for ATS matching.
              </p>
            </div>

            {/* Portfolio Card (Coming Soon) */}
            <div className="bg-slate-50/50 backdrop-blur-sm border-2 border-slate-100 rounded-3xl p-6 lg:p-8 opacity-70 relative">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="px-3 py-1 bg-slate-200 rounded-full text-[10px] font-extrabold text-slate-500 tracking-wider">
                  COMING SOON
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Summarize My Portfolio</h3>
              <p className="text-sm font-semibold text-slate-500">
                Analyze your personal website and extract core UI/UX and engineering capabilities.
              </p>
            </div>

            {/* Resume Card (Coming Soon) */}
            <div className="bg-slate-50/50 backdrop-blur-sm border-2 border-slate-100 rounded-3xl p-6 lg:p-8 opacity-70 relative">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="px-3 py-1 bg-slate-200 rounded-full text-[10px] font-extrabold text-slate-500 tracking-wider">
                  COMING SOON
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Summarize My Resume</h3>
              <p className="text-sm font-semibold text-slate-500">
                Parse your uploaded PDF and generate dynamic tailored variants for specific job roles.
              </p>
            </div>
          </motion.div>
        )}

        {/* LOADING STAGES */}
        {stage !== "selecting" && stage !== "complete" && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl py-20 shadow-xl"
          >
            <div className="relative w-32 h-32 mb-8">
              {/* Pulsing rings */}
              <div className="absolute inset-0 rounded-full border-4 border-purple-100 animate-ping opacity-75" />
              <div className="absolute inset-2 rounded-full border-4 border-indigo-100 animate-pulse" />
              
              {/* Center icon */}
              <div className="absolute inset-4 bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-800 mb-2">
              {stage === "initializing" && "Initializing AI..."}
              {stage === "connecting" && "Connecting to Server..."}
              {stage === "extracting" && "Extracting GitHub Profile..."}
              {stage === "normalizing" && "Normalizing Data..."}
              {stage === "analyzing" && "Analyzing with AI..."}
              {stage === "generating" && "Generating Career Summary..."}
            </h3>
            
            {/* 
            <p className="text-slate-400 font-semibold text-sm max-w-[250px] text-center">
              Please wait while our Gemini-powered engine processes your profile data.
            </p> 
            */}
            
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
          </motion.div>
        )}

        {/* COMPLETE: RESULTS DASHBOARD */}
        {stage === "complete" && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Top Stat Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ScoreCard icon={<GithubIcon className="w-5 h-5" />} title="GitHub Score" score={result.scores.github_profile_score} desc="Profile completeness" color="from-[#7C3AED] to-[#4F46E5]" />
              <ScoreCard icon={<Code2 className="w-5 h-5" />} title="Project Score" score={result.scores.project_quality_score} desc="Repo quality" color="from-emerald-500 to-teal-400" />
              <ScoreCard icon={<FileText className="w-5 h-5" />} title="Docs Score" score={result.scores.documentation_score} desc="READMEs & Comments" color="from-amber-500 to-orange-400" />
              <ScoreCard icon={<Sparkles className="w-5 h-5" />} title="Readiness" score={result.scores.overall_career_readiness_score} desc="Job market fit" color="from-rose-500 to-pink-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
              
              {/* Left Column - Summaries */}
              <div className="flex flex-col gap-6">
                <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                    <UserIcon /> Professional Summary
                  </h3>
                  <div className="space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
                    <p>{result.summary.professional_profile_summary}</p>
                    <p>{result.summary.overall_career_summary}</p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                    <Network className="w-5 h-5 text-amber-500" /> Core Domains
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {result.summary.development_domains.map((domain: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/50">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {domain}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column - Additional details */}
              <div className="flex flex-col gap-6">
                <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-emerald-500" /> Pinned Repositories
                  </h3>
                  
                  {result.summary.repositories_list && result.summary.repositories_list.length > 0 && (
                    <div className="space-y-4">
                      {result.summary.repositories_list.map((repo: any, i: number) => (
                        <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-emerald-200 transition-colors">
                          <h4 className="text-sm font-extrabold text-slate-800 mb-1 flex items-center gap-2">
                            <GithubIcon className="w-4 h-4 text-slate-400" /> {repo.name}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium mb-3">{repo.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {repo.tech_stack.map((tech: string, j: number) => (
                              <span key={j} className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                    <TerminalSquare className="w-5 h-5 text-indigo-500" /> Technical Skills
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.summary.programming_languages.map((lang: string, i: number) => (
                          <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">Frameworks</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.summary.framework_experience.map((fw: string, i: number) => (
                          <span key={i} className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-700 shadow-sm">
                            {fw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Subcomponents
const UserIcon = () => (
  <svg className="w-5 h-5 text-[#7C3AED]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ScoreCard = ({ title, score, desc, color, icon }: { title: string, score: number, desc: string, color: string, icon?: React.ReactNode }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden group hover:border-purple-200 transition-colors">
      <div className={`absolute top-0 left-0 w-full h-1 bg-linear-to-r ${color} opacity-50 group-hover:opacity-100 transition-opacity`} />
      
      {icon && (
        <div className="absolute top-3 right-3 text-slate-200 group-hover:text-slate-300 transition-colors">
          {icon}
        </div>
      )}
      
      {/* Circular Progress (Simplified UI) */}
      <div className="relative w-16 h-16 mb-3">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" className="text-slate-100" />
          <motion.circle 
            cx="32" cy="32" r="28" 
            stroke="currentColor" 
            strokeWidth="6" 
            fill="none" 
            className={`text-transparent bg-clip-text bg-linear-to-r ${color}`} 
            style={{ stroke: "url(#gradient)" }} // Note: inline SVG gradient would be better, but simplifying for UI
            strokeDasharray="175"
            initial={{ strokeDashoffset: 175 }}
            animate={{ strokeDashoffset: 175 - (175 * score) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-black text-slate-800">
            <AnimatedCounter value={score} />
            <span className="text-[10px] font-bold text-slate-400 ml-0.5">%</span>
          </span>
        </div>
      </div>
      
      <h4 className="text-sm font-extrabold text-slate-800">{title}</h4>
      <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">{desc}</p>
    </div>
  );
};

const AnimatedCounter = ({ value }: { value: number }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (node) {
      const controls = animate(0, value, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate(v) {
          node.textContent = Math.round(v).toString();
        }
      });
      return () => controls.stop();
    }
  }, [value]);

  return <span ref={nodeRef}>0</span>;
};
