"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Home, 
  Building, 
  Users, 
  UploadCloud, 
  Check, 
  Trash2, 
  Sparkles, 
  Loader2, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  Info,
  Lock,
  Plus,
  X,
  Mail,
  Phone,
  ExternalLink,
  Globe,
  GraduationCap,
  Eye,
  Hash,
  RefreshCw,
  ChevronRight,
  Award,
  Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CandidateResult {
  filename: string;
  file_size: string;
  text_content: string;
  candidate_name: string;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  college_name: string | null;
  degree: string | null;
  experience_summary: string;
  skills_found: string[];
  projects_found: string[];
  certifications_found: string[];
  match_score: number;
  strengths: string[];
  weaknesses: string[];
  matched_skills: string[];
  missing_skills: string[];
  fit_summary: string;
}

// ---------------------------------------------------------------------------
// Loading Stages
// ---------------------------------------------------------------------------

const LOADING_STAGES = [
  "Reading uploaded resumes...",
  "Extracting candidate information...",
  "Understanding job requirements...",
  "Comparing candidate profiles...",
  "Ranking the strongest matches...",
  "Preparing recruiter insights...",
];

// ---------------------------------------------------------------------------
// Resume Preview Modal
// ---------------------------------------------------------------------------

function ResumePreviewModal({ 
  isOpen, 
  onClose, 
  candidateName, 
  resumeText 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  candidateName: string; 
  resumeText: string;
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <div>
              <h3 className="font-bold text-[#1E1B4B] text-lg">{candidateName}</h3>
              <p className="text-xs text-slate-400 font-medium">Resume Preview</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <pre className="text-sm text-slate-700 font-family-name:var(--font-sans)] whitespace-pre-wrap leading-relaxed">
            {resumeText || "No resume text available."}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Draft Mail Loading Overlay
// ---------------------------------------------------------------------------

function DraftMailLoadingOverlay({ 
  candidateName, 
  onClose,
  isComplete
}: { 
  candidateName: string; 
  onClose?: () => void;
  isComplete?: boolean;
}) {
  const [currentStage, setCurrentStage] = useState(0);
  const stages = [
    "Preparing candidate profile...",
    "Reviewing job requirements...",
    "Writing personalized invitation...",
    "Creating Gmail draft..."
  ];

  useEffect(() => {
    if (isComplete) {
      setCurrentStage(stages.length - 1);
      return;
    }
    const interval = setInterval(() => {
      setCurrentStage(prev => {
        if (prev >= stages.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [isComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 flex items-center justify-center bg-[#0F0A2A]/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
      >
        <div className="p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#7C3AED] to-[#4F46E5] flex items-center justify-center mb-5 shadow-lg shadow-purple-200">
              {isComplete ? (
                <CheckCircle2 className="w-8 h-8 text-white" />
              ) : (
                <Mail className="w-8 h-8 text-white animate-pulse" />
              )}
            </div>
            <h3 className="text-xl font-extrabold text-[#1E1B4B] mb-1">
              {isComplete ? "Draft Created!" : "Drafting Email"}
            </h3>
            <p className="text-xs text-slate-400 font-medium text-center">
              {isComplete 
                ? `Successfully drafted for ${candidateName}. Check your Gmail Drafts folder.` 
                : `Using Gemini to write a personalized email to ${candidateName}`}
            </p>
          </div>

          <div className="space-y-3">
            {stages.map((stage, idx) => {
              const isCompleted = isComplete ? true : idx < currentStage;
              const isCurrent = !isComplete && idx === currentStage;
              return (
                <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${isCurrent ? "bg-purple-50/70 border border-purple-100" : isCompleted ? "bg-emerald-50/50" : "bg-slate-50/50"}`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4.5 h-4.5 text-[#7C3AED] animate-spin shrink-0" />
                  ) : (
                    <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-200 shrink-0" />
                  )}
                  <span className={`text-xs font-bold ${isCompleted ? "text-emerald-700" : isCurrent ? "text-[#7C3AED]" : "text-slate-400"}`}>
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>

          {isComplete && (
            <button
              onClick={onClose}
              className="mt-6 w-full py-3 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Done
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Send Mail Loading Overlay
// ---------------------------------------------------------------------------

function SendMailLoadingOverlay({ 
  candidateName, 
  onClose,
  isComplete
}: { 
  candidateName: string; 
  onClose?: () => void;
  isComplete?: boolean;
}) {
  const [currentStage, setCurrentStage] = useState(0);
  const stages = [
    "Preparing email...",
    "Sending invitation...",
    "Delivering..."
  ];

  useEffect(() => {
    if (isComplete) {
      setCurrentStage(stages.length - 1);
      return;
    }
    const interval = setInterval(() => {
      setCurrentStage(prev => {
        if (prev >= stages.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [isComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0F0A2A]/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
      >
        <div className="p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#10B981] to-[#059669] flex items-center justify-center mb-5 shadow-lg shadow-emerald-200">
              {isComplete ? (
                <CheckCircle2 className="w-8 h-8 text-white" />
              ) : (
                <Send className="w-8 h-8 text-white animate-pulse translate-x-0.5" />
              )}
            </div>
            <h3 className="text-xl font-extrabold text-[#1E1B4B] mb-1">
              {isComplete ? "Mail Sent!" : "Sending Email"}
            </h3>
            <p className="text-xs text-slate-400 font-medium text-center">
              {isComplete 
                ? `Successfully sent to ${candidateName}.` 
                : `Using Gemini to write and send a personalized email to ${candidateName}`}
            </p>
          </div>

          <div className="space-y-3">
            {stages.map((stage, idx) => {
              const isCompleted = isComplete ? true : idx < currentStage;
              const isCurrent = !isComplete && idx === currentStage;
              return (
                <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${isCurrent ? "bg-emerald-50/70 border border-emerald-100" : isCompleted ? "bg-emerald-50/50" : "bg-slate-50/50"}`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4.5 h-4.5 text-[#10B981] animate-spin shrink-0" />
                  ) : (
                    <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-200 shrink-0" />
                  )}
                  <span className={`text-xs font-bold ${isCompleted ? "text-emerald-700" : isCurrent ? "text-[#10B981]" : "text-slate-400"}`}>
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>

          {isComplete && (
            <button
              onClick={onClose}
              className="mt-6 w-full py-3 bg-linear-to-r from-[#10B981] to-[#059669] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Done
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}


// ---------------------------------------------------------------------------
// Multi-Stage Loading Overlay
// ---------------------------------------------------------------------------

function MatchingLoadingOverlay({ 
  totalResumes, 
  processedCount 
}: { 
  totalResumes: number; 
  processedCount: number;
}) {
  const [currentStage, setCurrentStage] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage(prev => {
        const next = prev + 1;
        if (next >= LOADING_STAGES.length) {
          clearInterval(interval);
          return prev;
        }
        setCompletedStages(cs => [...cs, prev]);
        return next;
      });
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const progressPercent = totalResumes > 0 
    ? Math.min(Math.round((processedCount / totalResumes) * 100), 100) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F0A2A]/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
      >
        {/* Top gradient strip */}
        <div className="h-1.5 bg-linear-to-r from-[#7C3AED] via-[#6366F1] to-[#4F46E5] relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="p-8">
          {/* Rotating icon + Title */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#7C3AED] to-[#4F46E5] flex items-center justify-center mb-5 shadow-lg shadow-purple-200"
            >
              <RefreshCw className="w-7 h-7 text-white" />
            </motion.div>
            <h3 className="text-xl font-extrabold text-[#1E1B4B] mb-1">Analyzing Resumes</h3>
            <p className="text-xs text-slate-400 font-medium">Finding the strongest matches for your role</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">Processing resumes...</span>
              <span className="text-xs font-extrabold text-[#7C3AED]">
                {processedCount} / {totalResumes} Completed
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-[#7C3AED] to-[#4F46E5] rounded-full relative"
                initial={{ width: "5%" }}
                animate={{ width: `${Math.max(progressPercent, 5)}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
          </div>

          {/* Stage List */}
          <div className="space-y-3">
            {LOADING_STAGES.map((stage, idx) => {
              const isCompleted = completedStages.includes(idx);
              const isCurrent = currentStage === idx;
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: idx <= currentStage ? 1 : 0.3, x: 0 }}
                  transition={{ delay: idx * 0.15, duration: 0.3 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                    isCurrent 
                      ? "bg-purple-50/70 border border-purple-100" 
                      : isCompleted 
                        ? "bg-emerald-50/50" 
                        : "bg-slate-50/50"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4.5 h-4.5 text-[#7C3AED] animate-spin shrink-0" />
                  ) : (
                    <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-200 shrink-0" />
                  )}
                  <span className={`text-xs font-bold ${
                    isCompleted 
                      ? "text-emerald-700" 
                      : isCurrent 
                        ? "text-[#7C3AED]" 
                        : "text-slate-400"
                  }`}>
                    {stage}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Shimmer cards */}
          <div className="mt-6 space-y-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-3 rounded-full bg-slate-100 overflow-hidden"
                style={{ width: `${100 - i * 20}%` }}
              >
                <motion.div
                  className="h-full bg-linear-to-r from-transparent via-slate-200/80 to-transparent w-full"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: "linear" }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}


// ---------------------------------------------------------------------------
// Score Badge Component
// ---------------------------------------------------------------------------

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 85 
    ? "from-emerald-500 to-emerald-600" 
    : score >= 70 
      ? "from-[#7C3AED] to-[#4F46E5]" 
      : score >= 50 
        ? "from-amber-500 to-orange-500" 
        : "from-rose-500 to-rose-600";

  return (
    <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 bg-linear-to-r ${color} text-white text-sm font-extrabold rounded-full shadow-sm`}>
      <span>{score}%</span>
      <span className="text-white/80 text-xs font-bold">Match</span>
    </div>
  );
}


// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

function RecruiterDashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authentication states
  const [sessionLoading, setSessionLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Global toasts
  const [toastMessage, setToastMessage] = useState<{title: string, message: string, type: "success"|"error"} | null>(null);

  // Draft Mail states
  const [draftingFor, setDraftingFor] = useState<{name: string, isComplete: boolean} | null>(null);

  // Send Mail states
  const [sendingMailFor, setSendingMailFor] = useState<{name: string, isComplete: boolean} | null>(null);

  // Form inputs states
  const [jobRole, setJobRole] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [workMode, setWorkMode] = useState<"Work From Home" | "Onsite" | "Hybrid" | "">("Hybrid");
  const [jobDescription, setJobDescription] = useState("");

  // Requirements states
  const [skills, setSkills] = useState<string[]>(["Python", "React.js", "Node.js", "AWS"]);
  const [skillInput, setSkillInput] = useState("");
  const [qualification, setQualification] = useState<string[]>(["PG (Master's)"]);
  const [minExperience, setMinExperience] = useState("2 Years");
  const [maxExperience, setMaxExperience] = useState("5 Years");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [certInput, setCertInput] = useState("");
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [softSkillInput, setSoftSkillInput] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [langInput, setLangInput] = useState("");
  const [toolsFrameworks, setToolsFrameworks] = useState<string[]>([]);
  const [toolsInput, setToolsInput] = useState("");

  // Resume upload states
  const [uploadedResumes, setUploadedResumes] = useState<Array<{ filename: string; file_size: string; text_content: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // Top N selection
  const [topNOption, setTopNOption] = useState<"Top 1" | "Top 2" | "Top 5" | "All" | "Custom">("All");
  const [customTopN, setCustomTopN] = useState<number>(1);
  const [showTopNDropdown, setShowTopNDropdown] = useState(false);

  // Matching states
  const [isMatching, setIsMatching] = useState(false);
  const [matchResults, setMatchResults] = useState<CandidateResult[]>([]);
  const [hasMatched, setHasMatched] = useState(false);
  const [matchError, setMatchError] = useState("");
  const [totalAnalyzed, setTotalAnalyzed] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);

  // Resume preview modal
  const [previewResume, setPreviewResume] = useState<{ name: string; text: string } | null>(null);

  // Top N dropdown ref for click-outside
  const topNRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (topNRef.current && !topNRef.current.contains(e.target as Node)) {
        setShowTopNDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load session
  const getApiUrl = (path: string): string => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      const cleanApiUrl = apiUrl.replace(/\/$/, "");
      return `${cleanApiUrl}${path}`;
    }
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return `http://localhost:8000${path}`;
      }
      return `http://${hostname}:8000${path}`;
    }
    return `http://localhost:8000${path}`;
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(getApiUrl("/users/me"), {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (err) {
        console.warn("Session check failed, proceeding in sandbox mode:", err);
      } finally {
        setSessionLoading(false);
      }
    };
    checkSession();

    // Check URL for OAuth success
    const successParam = searchParams.get("success");
    if (successParam === "gmail_auth_success") {
      setToastMessage({
        title: "Gmail Connected",
        message: "Your Gmail account was successfully connected.",
        type: "success"
      });
      // Remove query param without refresh
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => setToastMessage(null), 5000);
    }
  }, [searchParams]);

  // Validation helpers
  const isFormValid = () => {
    return (
      jobRole.trim() !== "" &&
      companyLocation.trim() !== "" &&
      jobDescription.trim() !== "" &&
      skills.length > 0 &&
      qualification.length > 0 &&
      uploadedResumes.length > 0
    );
  };

  // Compute actual top_n value to send
  const getTopNValue = (): number | null => {
    switch (topNOption) {
      case "Top 1": return 1;
      case "Top 2": return 2;
      case "Top 5": return 5;
      case "Custom": return Math.min(customTopN, uploadedResumes.length);
      case "All": return null;
      default: return null;
    }
  };

  // Tag helpers
  const addTag = (value: string, setValues: React.Dispatch<React.SetStateAction<string[]>>, setInput: React.Dispatch<React.SetStateAction<string>>) => {
    const trimmed = value.trim();
    if (trimmed) {
      setValues(prev => [...new Set([...prev, trimmed])]);
      setInput("");
    }
  };

  const removeTag = (indexToRemove: number, setValues: React.Dispatch<React.SetStateAction<string[]>>) => {
    setValues(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Qualifications checkbox helper
  const handleQualChange = (val: string) => {
    setQualification(prev => {
      if (prev.includes(val)) {
        return prev.filter(q => q !== val);
      } else {
        return [...prev, val];
      }
    });
  };

  // File Upload Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(e.target.files);
    }
  };

  const processFiles = async (files: FileList) => {
    if (uploadedResumes.length + files.length > 50) {
      alert("Maximum 50 resumes can be uploaded at a time.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    const apiEndpoint = getApiUrl("/recruiter/upload");
    const newUploads: Array<{ filename: string; file_size: string; text_content: string }> = [];

    // Simulate progress while uploading
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 15;
      });
    }, 200);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.name.endsWith(".pdf") && !file.name.endsWith(".docx")) {
          alert(`File format not supported: ${file.name}`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(apiEndpoint, {
          method: "POST",
          body: formData,
          credentials: "include"
        });

        if (response.ok) {
          const resData = await response.json();
          newUploads.push({
            filename: resData.filename,
            file_size: resData.file_size,
            text_content: resData.text_content
          });
        } else {
          const errorData = await response.json();
          alert(`Failed to upload ${file.name}: ${errorData.detail || "Error occurred"}`);
        }
      }

      setUploadedResumes(prev => [...prev, ...newUploads]);
    } catch (err) {
      console.error("Upload error:", err);
      alert("An error occurred during resume upload.");
    } finally {
      clearInterval(progressInterval);
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const removeResume = (index: number) => {
    setUploadedResumes(prev => prev.filter((_, idx) => idx !== index));
  };

  // Find Matches CTA Handler
  const handleFindBetterMatch = async () => {
    if (!isFormValid()) return;

    setIsMatching(true);
    setMatchError("");
    setHasMatched(false);
    setProcessedCount(0);

    // Simulate progressive count for UX
    const total = uploadedResumes.length;
    const countInterval = setInterval(() => {
      setProcessedCount(prev => {
        if (prev >= total) {
          clearInterval(countInterval);
          return total;
        }
        return prev + 1;
      });
    }, Math.max(800, 12000 / total));

    try {
      const apiEndpoint = getApiUrl("/recruiter/match");
      const topNValue = getTopNValue();

      const requestPayload = {
        job_role: jobRole,
        company_location: companyLocation,
        salary_range: salaryRange || null,
        work_mode: workMode,
        job_description: jobDescription,
        skills: skills,
        qualification: qualification,
        min_experience: minExperience,
        max_experience: maxExperience,
        certifications: certifications.length > 0 ? certifications : null,
        soft_skills: softSkills.length > 0 ? softSkills : null,
        languages: languages.length > 0 ? languages : null,
        tools_frameworks: toolsFrameworks.length > 0 ? toolsFrameworks : null,
        resumes: uploadedResumes,
        top_n: topNValue
      };

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
        credentials: "include"
      });

      if (response.ok) {
        const matchData = await response.json();
        setProcessedCount(matchData.total_analyzed || total);
        setTotalAnalyzed(matchData.total_analyzed || total);
        setMatchResults(matchData.results || []);
        
        // Small delay to let loading animation finish gracefully
        setTimeout(() => {
          setHasMatched(true);
          setIsMatching(false);
          clearInterval(countInterval);

          // Smooth scroll to results
          setTimeout(() => {
            const element = document.getElementById("matching-results-section");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }, 200);
        }, 1500);
      } else {
        const errDetail = await response.json();
        setMatchError(errDetail.detail || "Failed to match resumes.");
        setIsMatching(false);
        clearInterval(countInterval);
      }
    } catch (err: any) {
      console.error("Matching error:", err);
      setMatchError(err.message || "A network error occurred while matching resumes.");
      setIsMatching(false);
      clearInterval(countInterval);
    }
  };

  const handleDraftMail = async (candidate: CandidateResult) => {
    if (!user?.google_access_token) {
      alert("Please connect your Gmail account from the navigation bar first.");
      return;
    }
    
    setDraftingFor({ name: candidate.candidate_name, isComplete: false });
    
    try {
      const apiEndpoint = getApiUrl("/recruiter/draft_mail");
      const requestPayload = {
        candidate_name: candidate.candidate_name,
        candidate_email: candidate.email,
        candidate_skills: candidate.skills_found,
        match_score: candidate.match_score,
        job_role: jobRole,
        company_name: "FixToFlex", // Could be dynamic if added to form
        job_description: jobDescription,
        requirements: skills,
      };

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
        credentials: "include"
      });

      if (response.ok) {
        // Complete the animation
        setDraftingFor({ name: candidate.candidate_name, isComplete: true });
      } else {
        const errorData = await response.json();
        alert(`Failed to draft mail: ${errorData.detail}`);
        setDraftingFor(null);
      }
    } catch (err) {
      console.error("Draft mail error:", err);
      alert("A network error occurred while drafting the mail.");
      setDraftingFor(null);
    }
  };

  const handleSendMail = async (candidate: CandidateResult) => {
    if (!user?.google_access_token) {
      alert("Please connect your Gmail account from the navigation bar first.");
      return;
    }
    
    setSendingMailFor({ name: candidate.candidate_name, isComplete: false });
    
    try {
      const apiEndpoint = getApiUrl("/recruiter/send_mail");
      const requestPayload = {
        candidate_name: candidate.candidate_name,
        candidate_email: candidate.email,
        candidate_skills: candidate.skills_found,
        match_score: candidate.match_score,
        job_role: jobRole,
        company_name: "FixToFlex", // Could be dynamic if added to form
        job_description: jobDescription,
        requirements: skills,
      };

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
        credentials: "include"
      });

      if (response.ok) {
        // Complete the animation
        setSendingMailFor({ name: candidate.candidate_name, isComplete: true });
      } else {
        const errorData = await response.json();
        alert(`Failed to send mail: ${errorData.detail}`);
        setSendingMailFor(null);
      }
    } catch (err) {
      console.error("Send mail error:", err);
      alert("A network error occurred while sending the mail.");
      setSendingMailFor(null);
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-tr from-[#ffffff] via-[#f7f5ff] to-[#f3f0ff]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-[#7C3AED] animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] flex flex-col overflow-hidden font-sans">
      <Navbar />

      {/* Floating background gradient blobs */}
      <div className="absolute top-[120px] left-[5%] w-80 h-80 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Global Toast Message */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 z-70 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex items-start gap-3 min-w-[300px]"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${toastMessage.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
              {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{toastMessage.title}</h4>
              <p className="text-xs font-medium text-slate-500 mt-0.5">{toastMessage.message}</p>
            </div>
            <button onClick={() => setToastMessage(null)} className="ml-auto text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Multi-Stage Loading Overlay */}
      <AnimatePresence>
        {isMatching && (
          <MatchingLoadingOverlay 
            totalResumes={uploadedResumes.length}
            processedCount={processedCount}
          />
        )}
      </AnimatePresence>

      {/* Draft Mail Loading Overlay */}
      <AnimatePresence>
        {draftingFor && (
          <DraftMailLoadingOverlay 
            candidateName={draftingFor.name} 
            isComplete={draftingFor.isComplete}
            onClose={() => setDraftingFor(null)}
          />
        )}
      </AnimatePresence>

      {/* Send Mail Loading Overlay */}
      <AnimatePresence>
        {sendingMailFor && (
          <SendMailLoadingOverlay 
            candidateName={sendingMailFor.name} 
            isComplete={sendingMailFor.isComplete}
            onClose={() => setSendingMailFor(null)}
          />
        )}
      </AnimatePresence>

      {/* Resume Preview Modal */}
      <AnimatePresence>
        {previewResume && (
          <ResumePreviewModal
            isOpen={!!previewResume}
            onClose={() => setPreviewResume(null)}
            candidateName={previewResume.name}
            resumeText={previewResume.text}
          />
        )}
      </AnimatePresence>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pt-[120px] pb-24 z-10 relative">
        
        {/* Header */}
        <div className="mb-10 text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E1B4B] tracking-tight">
            Create Job & <span className="bg-clip-text text-transparent bg-linear-to-r from-[#7C3AED] to-[#4F46E5]">Find Better Match</span>
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-500 font-medium leading-relaxed">
            Define your job requirements and find the best matching candidates.
          </p>
        </div>

        {/* Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Job Details and Requirements (Span 2) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Card 1 — Job Details */}
            <motion.section 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-[#7C3AED] font-bold text-sm">1</span>
                <h2 className="text-xl font-bold text-[#1E1B4B]">Job Details</h2>
              </div>

              <div className="space-y-6">
                
                {/* Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Job Role */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                      Job Role / Title <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={jobRole}
                      onChange={(e) => setJobRole(e.target.value)}
                      placeholder="e.g. Full Stack Developer"
                      className="px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 text-sm font-medium placeholder:text-slate-400 focus:outline-hidden focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 focus:bg-white transition-all duration-200"
                    />
                  </div>

                  {/* Company Location */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                      Company Location <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={companyLocation}
                        onChange={(e) => setCompanyLocation(e.target.value)}
                        placeholder="e.g. Bengaluru, Karnataka"
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 text-sm font-medium placeholder:text-slate-400 focus:outline-hidden focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 focus:bg-white transition-all duration-200"
                      />
                      <MapPin className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Salary Range */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                      Salary Range (Annual)
                    </label>
                    <div className="relative">
                      <select 
                        value={salaryRange}
                        onChange={(e) => setSalaryRange(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 text-sm font-medium focus:outline-hidden focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
                      >
                        <option value="">Select Salary Range</option>
                        <option value="3 LPA – 5 LPA">3 LPA – 5 LPA</option>
                        <option value="6 LPA – 9 LPA">6 LPA – 9 LPA</option>
                        <option value="10 LPA – 15 LPA">10 LPA – 15 LPA</option>
                        <option value="15 LPA – 20 LPA">15 LPA – 20 LPA</option>
                        <option value="20+ LPA">20+ LPA</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Work Mode */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                      Work Mode <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {(["Work From Home", "Onsite", "Hybrid"] as const).map((mode) => {
                        const isSelected = workMode === mode;
                        return (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setWorkMode(mode)}
                            className={`flex items-center justify-center gap-1.5 py-3 border rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 ${
                              isSelected 
                                ? "bg-[#7C3AED]/5 border-[#7C3AED] text-[#7C3AED] shadow-2xs" 
                                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50/50"
                            }`}
                          >
                            {mode === "Work From Home" && <Home className="w-3.5 h-3.5" />}
                            {mode === "Onsite" && <Building className="w-3.5 h-3.5" />}
                            {mode === "Hybrid" && <Users className="w-3.5 h-3.5" />}
                            <span>{mode === "Work From Home" ? "WFH" : mode}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Job Description */}
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                      Job Description <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {jobDescription.length}/5000
                    </span>
                  </div>
                  <textarea
                    rows={12}
                    value={jobDescription}
                    maxLength={5000}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste complete job description including responsibilities and expectations..."
                    className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-800 text-sm font-medium placeholder:text-slate-400 focus:outline-hidden focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 focus:bg-white transition-all duration-200 resize-y"
                  />
                </div>

              </div>
            </motion.section>

            {/* Card 2 — Requirements */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-[#7C3AED] font-bold text-sm">2</span>
                <h2 className="text-xl font-bold text-[#1E1B4B]">Requirements</h2>
              </div>

              <div className="space-y-6">

                {/* Skills Tag Input */}
                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                    Skills <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border border-slate-200/80 rounded-2xl min-h-[50px] items-center">
                    {skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-1 px-3 py-1 bg-white border border-purple-100 rounded-lg text-xs font-bold text-[#7C3AED]">
                        <span>{skill}</span>
                        <button 
                          type="button" 
                          onClick={() => removeTag(index, setSkills)}
                          className="hover:text-rose-500 cursor-pointer focus:outline-hidden"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <input 
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag(skillInput, setSkills, setSkillInput))}
                      placeholder={skills.length === 0 ? "Add skills (e.g. Python, React, SQL)" : ""}
                      className="flex-1 bg-transparent px-2 py-1 text-slate-800 text-sm font-medium placeholder:text-slate-400 focus:outline-hidden min-w-[150px]"
                    />
                  </div>
                </div>

                {/* Qualification Checkboxes */}
                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                    Qualification <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {["UG (Bachelor's)", "PG (Master's)", "Students / Fresher", "Diploma"].map((qual) => {
                      const isChecked = qualification.includes(qual);
                      return (
                        <label 
                          key={qual}
                          className={`flex items-center gap-2.5 p-3.5 border rounded-xl cursor-pointer text-xs font-bold transition-all duration-200 select-none ${
                            isChecked 
                              ? "bg-purple-50/40 border-[#7C3AED] text-[#7C3AED]" 
                              : "bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                          }`}
                        >
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleQualChange(qual)}
                            className="w-4 h-4 accent-[#7C3AED] rounded-sm focus:ring-[#7C3AED] border-slate-300"
                          />
                          <span>{qual}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Experience Range & Certifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Experience Years */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                      Experience (Years)
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <select 
                          value={minExperience}
                          onChange={(e) => setMinExperience(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 text-sm font-medium focus:outline-hidden focus:border-[#7C3AED] appearance-none cursor-pointer"
                        >
                          {Array.from({ length: 11 }).map((_, idx) => (
                            <option key={idx} value={`${idx} Year${idx !== 1 ? 's' : ''}`}>{idx} Year{idx !== 1 ? 's' : ''}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                      <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">to</span>
                      <div className="relative flex-1">
                        <select 
                          value={maxExperience}
                          onChange={(e) => setMaxExperience(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 text-sm font-medium focus:outline-hidden focus:border-[#7C3AED] appearance-none cursor-pointer"
                        >
                          {Array.from({ length: 11 }).map((_, idx) => (
                            <option key={idx} value={`${idx} Year${idx !== 1 ? 's' : ''}`}>{idx} Year{idx !== 1 ? 's' : ''}</option>
                          ))}
                          <option value="10+ Years">10+ Years</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Certifications (Optional) */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                      Certifications (Optional)
                    </label>
                    <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border border-slate-200/80 rounded-2xl min-h-[50px] items-center">
                      {certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">
                          <span>{cert}</span>
                          <button 
                            type="button" 
                            onClick={() => removeTag(index, setCertifications)}
                            className="hover:text-rose-500 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <input 
                        type="text"
                        value={certInput}
                        onChange={(e) => setCertInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag(certInput, setCertifications, setCertInput))}
                        placeholder={certifications.length === 0 ? "e.g. AWS, Azure, PMP" : ""}
                        className="flex-1 bg-transparent px-2 py-1 text-slate-800 text-sm font-medium placeholder:text-slate-400 focus:outline-hidden min-w-[120px]"
                      />
                    </div>
                  </div>

                </div>

                {/* Soft Skills & Languages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Soft Skills */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                      Soft Skills
                    </label>
                    <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border border-slate-200/80 rounded-2xl min-h-[50px] items-center">
                      {softSkills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">
                          <span>{skill}</span>
                          <button 
                            type="button" 
                            onClick={() => removeTag(index, setSoftSkills)}
                            className="hover:text-rose-500 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <input 
                        type="text"
                        value={softSkillInput}
                        onChange={(e) => setSoftSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag(softSkillInput, setSoftSkills, setSoftSkillInput))}
                        placeholder={softSkills.length === 0 ? "e.g. Leadership, Communication" : ""}
                        className="flex-1 bg-transparent px-2 py-1 text-slate-800 text-sm font-medium placeholder:text-slate-400 focus:outline-hidden min-w-[120px]"
                      />
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                      Languages
                    </label>
                    <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border border-slate-200/80 rounded-2xl min-h-[50px] items-center">
                      {languages.map((lang, index) => (
                        <div key={index} className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">
                          <span>{lang}</span>
                          <button 
                            type="button" 
                            onClick={() => removeTag(index, setLanguages)}
                            className="hover:text-rose-500 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <input 
                        type="text"
                        value={langInput}
                        onChange={(e) => setLangInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag(langInput, setLanguages, setLangInput))}
                        placeholder={languages.length === 0 ? "e.g. English, Hindi, Tamil" : ""}
                        className="flex-1 bg-transparent px-2 py-1 text-slate-800 text-sm font-medium placeholder:text-slate-400 focus:outline-hidden min-w-[120px]"
                      />
                    </div>
                  </div>

                </div>

                {/* Tools & Frameworks Tag Input */}
                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                    Tools & Frameworks
                  </label>
                  <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border border-slate-200/80 rounded-2xl min-h-[50px] items-center">
                    {toolsFrameworks.map((tool, index) => (
                      <div key={index} className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">
                        <span>{tool}</span>
                        <button 
                          type="button" 
                          onClick={() => removeTag(index, setToolsFrameworks)}
                          className="hover:text-rose-500 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <input 
                      type="text"
                      value={toolsInput}
                      onChange={(e) => setToolsInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag(toolsInput, setToolsFrameworks, setToolsInput))}
                      placeholder={toolsFrameworks.length === 0 ? "e.g. Docker, Git, Kubernetes, PyTorch" : ""}
                      className="flex-1 bg-transparent px-2 py-1 text-slate-800 text-sm font-medium placeholder:text-slate-400 focus:outline-hidden min-w-[150px]"
                    />
                  </div>
                </div>

              </div>
            </motion.section>

          </div>

          {/* Right Column: AI matching info and resume uploads */}
          <div className="space-y-8">
            
            {/* Card 4 — AI-Powered Matching details */}
            <motion.section
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs relative overflow-hidden"
            >
              {/* Decorative top strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#7C3AED] to-[#4F46E5]" />

              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#7C3AED]" />
                <h3 className="font-bold text-[#1E1B4B] text-lg">AI-Powered Matching</h3>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-5 font-medium">
                Our system analyzes skills, experience, and potential to find the best matching candidates for your job opening.
              </p>

              <ul className="space-y-3.5 mb-6">
                {[
                  "Technical Skills Match",
                  "Relevant Projects Analysis",
                  "Experience & Education Fit",
                  "Certifications Verification",
                  "Tools & Framework Match",
                  "Soft Skills Assessment",
                  "Overall Role Compatibility"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs font-bold text-[#1E1B4B]">
                    <div className="w-4 h-4 rounded-full bg-purple-50 flex items-center justify-center text-[#7C3AED]">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="p-4 bg-purple-50/50 border border-purple-100/50 rounded-2xl flex items-start gap-2.5">
                <Info className="w-4.5 h-4.5 text-[#7C3AED] shrink-0 mt-0.5" />
                <p className="text-[11px] font-semibold text-[#7C3AED] leading-normal">
                  Higher quality job descriptions produce better candidate ranking.
                </p>
              </div>
            </motion.section>

            {/* Card 3 — Upload Resumes */}
            <motion.section
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs"
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-[#7C3AED] font-bold text-sm">3</span>
                <h2 className="text-xl font-bold text-[#1E1B4B]">Upload Resumes</h2>
              </div>

              {/* Drag and Drop Zone */}
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                  dragActive 
                    ? "border-[#7C3AED] bg-purple-50/30 scale-98" 
                    : "border-slate-200 hover:border-purple-200 hover:bg-slate-50/30"
                }`}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  multiple 
                  onChange={handleFileChange}
                  accept=".pdf,.docx"
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-[#7C3AED] mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#1E1B4B]">Upload Candidate Resumes</h4>
                <p className="text-[10px] text-slate-400 font-medium max-w-[200px] mt-1">
                  Upload multiple resumes (PDF/DOCX) to find the best matches.
                </p>

                <button 
                  type="button" 
                  className="mt-4 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl shadow-xs transition-colors duration-200"
                >
                  Upload Files
                </button>
              </div>

              {/* Upload Progress Animation */}
              {isUploading && (
                <div className="mt-4 space-y-1.5 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin text-[#7C3AED]" /> Extracting resume text...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-linear-to-r from-[#7C3AED] to-[#4F46E5] rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Uploaded Files List */}
              {uploadedResumes.length > 0 && (
                <div className="mt-5 space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Uploaded Resumes ({uploadedResumes.length})</span>
                  </div>
                  <div className="space-y-2">
                    {uploadedResumes.map((res, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-4 h-4 text-[#7C3AED] shrink-0" />
                          <div className="text-left truncate">
                            <p className="text-xs font-bold text-slate-700 truncate max-w-[150px]">
                              {res.filename}
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                              {res.file_size}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <button 
                            type="button" 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeResume(index);
                            }}
                            className="p-1 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload constraints detail */}
              <div className="mt-4 text-center">
                <span className="text-[9px] font-semibold text-slate-400">
                  Supported formats: PDF, DOCX | Max file size: 10MB each | Max 50 files
                </span>
              </div>
            </motion.section>

          </div>

        </div>

        {/* Form Validation Feedback & Bottom CTA */}
        <div className="mt-12 flex flex-col items-center justify-center space-y-5 border-t border-slate-100 pt-8">
          
          {matchError && (
            <div className="px-4 py-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-2 text-xs font-bold text-rose-600">
              <AlertCircle className="w-4 h-4" />
              <span>{matchError}</span>
            </div>
          )}

          {/* Top N Selection + Find Better Match Button */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            
            {/* Top N Dropdown */}
            <div ref={topNRef} className="relative">
              <button
                type="button"
                onClick={() => setShowTopNDropdown(!showTopNDropdown)}
                className="flex items-center gap-2 px-5 py-3.5 bg-white border border-slate-200 hover:border-purple-200 rounded-xl text-sm font-bold text-slate-700 cursor-pointer transition-all duration-200 shadow-xs"
              >
                <Hash className="w-4 h-4 text-[#7C3AED]" />
                <span>{topNOption === "Custom" ? `Top ${customTopN}` : topNOption === "All" ? "All Results" : topNOption}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              <AnimatePresence>
                {showTopNDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.97 }}
                    className="absolute bottom-full mb-2 left-0 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-20 min-w-[200px]"
                  >
                    {(["All", "Top 1", "Top 2", "Top 5", "Custom"] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setTopNOption(option);
                          if (option !== "Custom") {
                            setShowTopNDropdown(false);
                          }
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold transition-colors cursor-pointer ${
                          topNOption === option
                            ? "bg-purple-50 text-[#7C3AED]"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {option === "All" ? "All Results" : option === "Custom" ? "Custom Number" : option}
                      </button>
                    ))}

                    {/* Custom Number Input */}
                    {topNOption === "Custom" && (
                      <div className="p-3 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            max={uploadedResumes.length || 50}
                            value={customTopN}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              setCustomTopN(Math.min(Math.max(val, 1), uploadedResumes.length || 50));
                            }}
                            className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-hidden focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/20"
                          />
                          <span className="text-[10px] text-slate-400 font-semibold">
                            / {uploadedResumes.length} max
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowTopNDropdown(false)}
                            className="ml-auto px-3 py-1.5 bg-[#7C3AED] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-[#6D28D9] transition-colors"
                          >
                            Set
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleFindBetterMatch}
              disabled={!isFormValid() || isMatching}
              className={`px-8 py-4 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] hover:from-[#6D28D9] hover:to-[#4338CA] text-white text-base font-extrabold rounded-2xl shadow-md hover:shadow-lg active:scale-98 transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Sparkles className="w-5 h-5" />
              <span>Find Better Match</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure & Confidential</span>
          </div>

          <div className="text-[11px] font-medium text-slate-400 text-center max-w-sm leading-normal">
            Higher quality job descriptions produce better candidate ranking.
          </div>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {hasMatched && matchResults.length > 0 && (
            <motion.section 
              id="matching-results-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              className="mt-16 border-t border-slate-100 pt-16"
            >
              <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#1E1B4B]">
                    Best Matched Candidates <span className="text-[#7C3AED]">({matchResults.length})</span>
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mt-1">
                    {totalAnalyzed > matchResults.length 
                      ? `Showing top ${matchResults.length} of ${totalAnalyzed} analyzed resumes, ranked by compatibility.`
                      : "Ranked in order of compatibility against your requirements."
                    }
                  </p>
                </div>
              </div>

              {/* Match Results list */}
              <div className="space-y-6">
                {matchResults.map((result, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs hover:shadow-md hover:border-purple-100/50 transition-all duration-300"
                  >
                    {/* Top Row: Name + Score + Resume Preview */}
                    <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
                      <div className="flex items-center gap-4">
                        {/* Rank badge */}
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-50 to-indigo-50 flex items-center justify-center text-[#7C3AED] font-extrabold text-sm border border-purple-100 shrink-0">
                          #{idx + 1}
                        </div>
                        <div>
                          <h4 className="text-lg font-extrabold text-[#1E1B4B]">
                            {result.candidate_name}
                          </h4>
                          {/* Contact row */}
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            {result.email && (
                              <a href={`mailto:${result.email}`} className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#7C3AED] transition-colors">
                                <Mail className="w-3 h-3" />
                                <span>{result.email}</span>
                              </a>
                            )}
                            {result.phone && (
                              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                                <Phone className="w-3 h-3" />
                                <span>{result.phone}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <ScoreBadge score={result.match_score} />
                        {result.email && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDraftMail(result)}
                              className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-[#7C3AED] text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-sm"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Draft Mail</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSendMail(result)}
                              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#10B981] text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-sm"
                            >
                              <Send className="w-3.5 h-3.5 translate-x-0.5" />
                              <span>Send Mail</span>
                            </button>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setPreviewResume({ name: result.candidate_name, text: result.text_content })}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Resume</span>
                        </button>
                      </div>
                    </div>

                    {/* Info Pills Row — LinkedIn, GitHub, College */}
                    <div className="flex items-center gap-2.5 mb-5 flex-wrap">
                      {result.linkedin_url && (
                        <a 
                          href={result.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-[11px] font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {result.github_url && (
                        <a 
                          href={result.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <Globe className="w-3 h-3" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {result.college_name && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-lg text-[11px] font-bold text-amber-800">
                          <GraduationCap className="w-3 h-3" />
                          <span>{result.college_name}{result.degree ? ` — ${result.degree}` : ""}</span>
                        </div>
                      )}
                      {result.certifications_found && result.certifications_found.length > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-[11px] font-bold text-emerald-700">
                          <Award className="w-3 h-3" />
                          <span>{result.certifications_found.join(", ")}</span>
                        </div>
                      )}
                    </div>

                    {/* Fit Summary */}
                    <p className="text-xs text-slate-500 leading-relaxed font-medium bg-slate-50/50 p-4 border border-slate-100 rounded-2xl mb-5">
                      {result.fit_summary}
                    </p>

                    {/* Skills + Strengths Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      
                      {/* Matched Skills */}
                      <div className="space-y-1.5 text-left">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Matched Skills
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {result.matched_skills.map((s, sidx) => (
                            <span key={sidx} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold rounded-lg capitalize">
                              ✓ {s}
                            </span>
                          ))}
                          {result.matched_skills.length === 0 && (
                            <span className="text-[10px] text-slate-400 font-medium">None listed</span>
                          )}
                        </div>
                      </div>

                      {/* Missing Skills */}
                      <div className="space-y-1.5 text-left">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Missing Skills
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {result.missing_skills.map((s, sidx) => (
                            <span key={sidx} className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-bold rounded-lg capitalize">
                              ✗ {s}
                            </span>
                          ))}
                          {result.missing_skills.length === 0 && (
                            <span className="text-[10px] text-slate-400 font-medium">No critical gaps</span>
                          )}
                        </div>
                      </div>

                      {/* Key Strengths */}
                      <div className="space-y-1.5 text-left">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Key Strengths
                        </span>
                        <ul className="space-y-1">
                          {result.strengths.map((str, sidx) => (
                            <li key={sidx} className="text-[11px] font-semibold text-slate-600 leading-normal flex items-start gap-1.5">
                              <span className="text-emerald-500 text-xs">•</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

export default function RecruiterDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 text-[#7C3AED] animate-spin" /></div>}>
      <RecruiterDashboardInner />
    </Suspense>
  );
}