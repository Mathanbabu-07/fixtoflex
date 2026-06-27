"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, 
  Globe, 
  Briefcase, 
  Award, 
  FileText, 
  Mail, 
  Lock, 
  UploadCloud, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Sparkles, 
  Menu, 
  X, 
  Settings, 
  LogOut, 
  ArrowRight,
  ChevronDown,
  Loader2,
  Trash2,
  TrendingUp,
  Calendar,
  Phone,
  MapPin,
  Map,
  GraduationCap,
  Building,
  Target,
  Clock,
  Code,
  Hash,
  Users,
  BrainCircuit
} from "lucide-react";

import AIAnalysisDashboard from "@/components/AIAnalysisDashboard";
import CareerIntelligenceReport from "@/components/CareerIntelligenceReport";
import JobTrackerPanel from "@/components/JobTrackerPanel";
import MyTargetAnalysisModal from "@/components/MyTargetAnalysisModal";
import { motion, AnimatePresence, Variants } from "framer-motion";

// Custom inline SVG icons because brand icons are missing from this lucide-react version
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

// Framer Motion Animation Variants for Sidebar Menu
const buttonVariants: Variants = {
  initial: { 
    x: 0,
    boxShadow: "0px 0px 0px 0px rgba(0,0,0,0)"
  },
  hover: { 
    x: 6,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  active: {
    x: 0,
    boxShadow: [
      "0px 4px 6px -1px rgba(99, 102, 241, 0.1), 0 0 0px 0px rgba(124, 58, 237, 0)",
      "0px 10px 20px -3px rgba(99, 102, 241, 0.3), 0 0 12px 3px rgba(124, 58, 237, 0.4)",
      "0px 4px 6px -1px rgba(99, 102, 241, 0.1), 0 0 0px 0px rgba(124, 58, 237, 0)"
    ],
    transition: {
      boxShadow: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  hoverActive: {
    x: 6,
    boxShadow: [
      "0px 4px 6px -1px rgba(99, 102, 241, 0.1), 0 0 0px 0px rgba(124, 58, 237, 0)",
      "0px 10px 20px -3px rgba(99, 102, 241, 0.3), 0 0 12px 3px rgba(124, 58, 237, 0.4)",
      "0px 4px 6px -1px rgba(99, 102, 241, 0.1), 0 0 0px 0px rgba(124, 58, 237, 0)"
    ],
    transition: {
      x: { duration: 0.3, ease: "easeOut" },
      boxShadow: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
};

const iconVariants: Variants = {
  initial: { 
    scale: 1, 
    rotate: 0, 
    y: 0, 
    filter: "drop-shadow(0px 0px 0px rgba(124, 58, 237, 0))" 
  },
  hover: {
    scale: 1.15,
    rotate: [0, -12, 12, -6, 6, 0],
    y: [0, -4, 2, 0],
    filter: "drop-shadow(0px 0px 6px rgba(168, 85, 247, 0.8))",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  active: {
    scale: 1.1,
    rotate: 0,
    y: 0,
    filter: "drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.5))"
  },
  hoverActive: {
    scale: 1.15,
    rotate: [0, -12, 12, -6, 6, 0],
    y: [0, -4, 2, 0],
    filter: "drop-shadow(0px 0px 6px rgba(255, 255, 255, 0.8))",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  full_name?: string;
  profile_picture?: string;
  role?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  resume_url?: string;
  headline?: string;
  date_of_birth?: string;
  gender?: string;
  mobile_number?: string;
  state?: string;
  district?: string;
  institution_name?: string;
  institution_district?: string;
  interested_domain?: string;
  target_job_role?: string;
  experience?: string;
  skills?: string;
  language_proficiency?: string;
  certifications?: string;
}

const tabSlugs: Record<string, string> = {
  "Fix My Profile": "fix-my-profile",
  "Career Intelligence": "career-intelligence",
  "Portfolio Setup": "portfolio-setup",
  "Job Tracker": "job-tracker",
  "Internship Opportunity": "internship-opportunity",
  "My Applications": "my-applications",
  "Draft Mail": "draft-mail",
};

const slugToTabs: Record<string, string> = {
  "fix-my-profile": "Fix My Profile",
  "career-intelligence": "Career Intelligence",
  "portfolio-setup": "Portfolio Setup",
  "job-tracker": "Job Tracker",
  "internship-opportunity": "Internship Opportunity",
  "my-applications": "My Applications",
  "draft-mail": "Draft Mail",
};

export default function CandidateDashboard() {
  const router = useRouter();
  
  // Navigation State
  const [activeTab, setActiveTab] = useState("Fix My Profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // Sidebar Collapse & Viewport State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const updateUrl = (tabName: string, showAnalysis: boolean) => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const slug = tabSlugs[tabName] || "fix-my-profile";
      params.set("tab", slug);
      if (showAnalysis && tabName === "Fix My Profile") {
        params.set("analysis", "true");
      } else {
        params.delete("analysis");
      }
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState({ tab: slug, analysis: showAnalysis ? "true" : "false" }, "", newUrl);
    }
  };

  
  // Auth & Session State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);

  // Profile Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModalMode, setEditModalMode] = useState<"all" | "linkedin" | "github" | "portfolio">("all");
  
  // Target Search State
  const [targetSearch, setTargetSearch] = useState<{ company: string; role: string; location: string } | null>(null);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    headline: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
    date_of_birth: "",
    gender: "",
    email: "",
    mobile_number: "",
    state: "",
    district: "",
    institution_name: "",
    institution_district: "",
    interested_domain: "",
    target_job_role: "",
    experience: "",
    skills: "",
    language_proficiency: "",
    certifications: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [analysisResetKey, setAnalysisResetKey] = useState(0);

  // Queue Status & Scheduler State
  const [queueStatus, setQueueStatus] = useState<any>(null);
  const [schedulePref, setSchedulePref] = useState("Weekly");
  const [queueProgressPercent, setQueueProgressPercent] = useState(0);

  // Resume Upload State
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to construct API URL
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

  // Schedule Update Handler
  const handleScheduleUpdate = async (newSchedule: string) => {
    setSchedulePref(newSchedule);
    try {
      const apiEndpoint = getApiUrl("/analysis/schedule");
      await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ schedule_preference: newSchedule })
      });
    } catch (e) {
      console.error("Failed to update schedule:", e);
    }
  };

  // Auto Queue Trigger
  useEffect(() => {
    if (activeTab === "Fix My Profile" && user && !isDemoMode) {
      const initQueue = async () => {
        try {
          const statusEndpoint = getApiUrl("/analysis/status");
          const statusRes = await fetch(statusEndpoint, { credentials: "include" });
          if (statusRes.ok) {
            const data = await statusRes.json();
            const sq = data.data;
            setQueueStatus(sq);
            if (sq?.schedule_preference) {
              setSchedulePref(sq.schedule_preference);
            }
            // Trigger start-queue to let backend handle cache expiration check automatically
            if (sq?.overall_status !== "Running") {
              const startEndpoint = getApiUrl("/analysis/start-queue");
              await fetch(startEndpoint, { method: "POST", credentials: "include" });
            }
          }
        } catch (err) {
          console.error("Failed to init queue", err);
        }
      };
      initQueue();
    }
  }, [activeTab, user, isDemoMode]);

  // Polling Queue Status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTab === "Fix My Profile" && queueStatus && queueStatus.overall_status === "Running") {
      interval = setInterval(async () => {
        try {
          const statusEndpoint = getApiUrl("/analysis/status");
          const res = await fetch(statusEndpoint, { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            setQueueStatus(data.data);
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [activeTab, queueStatus?.overall_status]);

  // Calculate Progress Percent
  useEffect(() => {
    if (queueStatus) {
      let completedCount = 0;
      const total = 4; // linkedin, github, portfolio, resume
      if (queueStatus.linkedin_status === "Completed" || queueStatus.linkedin_status === "Failed" || queueStatus.linkedin_status === "Skipped") completedCount++;
      if (queueStatus.github_status === "Completed" || queueStatus.github_status === "Failed" || queueStatus.github_status === "Skipped") completedCount++;
      if (queueStatus.portfolio_status === "Completed" || queueStatus.portfolio_status === "Failed" || queueStatus.portfolio_status === "Skipped") completedCount++;
      if (queueStatus.resume_status === "Completed" || queueStatus.resume_status === "Failed" || queueStatus.resume_status === "Skipped") completedCount++;
      
      let percent = (completedCount / total) * 100;
      if (queueStatus.overall_status === "Running" && percent === 0) percent = 10;
      setQueueProgressPercent(percent);
    }
  }, [queueStatus]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      const analysisParam = params.get("analysis");
      
      if (tabParam && slugToTabs[tabParam]) {
        setActiveTab(slugToTabs[tabParam]);
      } else {
        setActiveTab("Fix My Profile");
      }
      
      setShowAIAnalysis(analysisParam === "true");
    };

    // Sync on initial load
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    const analysisParam = params.get("analysis");
    if (tabParam && slugToTabs[tabParam]) {
      setActiveTab(slugToTabs[tabParam]);
    }
    if (analysisParam === "true") {
      setShowAIAnalysis(true);
    }

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);


  // Sync session check
  const fetchSession = async () => {
    try {
      console.log("[SESSION CHECK] Checking session with backend...");
      const apiEndpoint = getApiUrl("/users/me");
      const response = await fetch(apiEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("[SESSION CHECK] Session is valid:", userData);
        const normalizedUser: UserProfile = {
          id: userData.id,
          email: userData.email,
          full_name: userData.full_name,
          name: userData.full_name,
          profile_picture: userData.profile_picture,
          role: userData.role,
          linkedin_url: userData.linkedin_url,
          github_url: userData.github_url,
          portfolio_url: userData.portfolio_url,
          resume_url: userData.resume_url,
          headline: userData.headline,
          date_of_birth: userData.date_of_birth,
          gender: userData.gender,
          mobile_number: userData.mobile_number,
          state: userData.state,
          district: userData.district,
          institution_name: userData.institution_name,
          institution_district: userData.institution_district,
          interested_domain: userData.interested_domain,
          target_job_role: userData.target_job_role,
          experience: userData.experience,
          skills: userData.skills,
          language_proficiency: userData.language_proficiency,
          certifications: userData.certifications,
        };
        setUser(normalizedUser);
        localStorage.setItem("user_session", JSON.stringify(normalizedUser));
        
        // Update edit form fields
        setFormData({
          full_name: userData.full_name || "",
          headline: userData.headline || "Software Engineer",
          linkedin_url: userData.linkedin_url || `https://linkedin.com/in/${(userData.full_name || "").toLowerCase().replace(/\s+/g, "-")}`,
          github_url: userData.github_url || "",
          portfolio_url: userData.portfolio_url || "",
          date_of_birth: userData.date_of_birth || "",
          gender: userData.gender || "",
          email: userData.email || "",
          mobile_number: userData.mobile_number || "",
          state: userData.state || "",
          district: userData.district || "",
          institution_name: userData.institution_name || "",
          institution_district: userData.institution_district || "",
          interested_domain: userData.interested_domain || "",
          target_job_role: userData.target_job_role || "",
          experience: userData.experience || "",
          skills: userData.skills || "",
          language_proficiency: userData.language_proficiency || "",
          certifications: userData.certifications || "",
        });
        if (userData.resume_url) {
          setResumeUrl(userData.resume_url);
        }
        setIsDemoMode(false);
        setSessionLoading(false);
      } else {
        console.log("[SESSION CHECK] Session invalid, switching to guest mode...");
        localStorage.clear();
        sessionStorage.clear();
        document.cookie = "access_token=; Max-Age=0; path=/;";
        setIsDemoMode(true);
        setupGuestUser();
        setSessionLoading(false);
      }
    } catch (error) {
      console.warn("[SESSION CHECK ERROR] Exception caught, switching to guest mode:", error);
      localStorage.clear();
      sessionStorage.clear();
      document.cookie = "access_token=; Max-Age=0; path=/;";
      setIsDemoMode(true);
      setupGuestUser();
      setSessionLoading(false);
    }
  };

  const setupGuestUser = () => {
    const guestUser: UserProfile = {
      id: "guest-user-id",
      email: "",
      full_name: "Guest User",
      name: "Guest User",
      profile_picture: undefined,
      role: "candidate",
      headline: "Software Engineer",
      linkedin_url: "",
      github_url: "",
      portfolio_url: "",
      date_of_birth: "",
      gender: "",
      mobile_number: "",
      state: "",
      district: "",
      institution_name: "",
      institution_district: "",
      interested_domain: "",
      target_job_role: "",
      experience: "",
      skills: "",
      language_proficiency: "",
      certifications: "",
    };
    setUser(guestUser);
    setFormData({
      full_name: "Guest User",
      headline: "Software Engineer",
      linkedin_url: "",
      github_url: "",
      portfolio_url: "",
      date_of_birth: "",
      gender: "",
      email: "",
      mobile_number: "",
      state: "",
      district: "",
      institution_name: "",
      institution_district: "",
      interested_domain: "",
      target_job_role: "",
      experience: "",
      skills: "",
      language_proficiency: "",
      certifications: "",
    });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for global auth changes (login/logout) to update UI instantly without refresh
  useEffect(() => {
    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newUser = customEvent.detail;
      console.log("[CANDIDATE AUTH CHANGE] Received auth-change event:", newUser);
      if (newUser) {
        setUser(newUser);
        setIsDemoMode(false);
      } else {
        setIsDemoMode(true);
        setupGuestUser();
      }
    };
    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);

  useEffect(() => {
    if (user && !isDemoMode) {
      const isBlank = !user.mobile_number && !user.skills && !user.linkedin_url && !user.github_url && !user.portfolio_url && !user.resume_url;
      if (isBlank) {
        setShowFirstTimeModal(true);
      }
    }
  }, [user, isDemoMode]);

  // Login handler
  const handleLinkedInLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("[STEP 1] Login button clicked - Redirecting to LinkedIn Login Endpoint");
    const loginUrl = getApiUrl("/auth/linkedin/login");
    window.location.href = loginUrl;
  };

  // Logout handler
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const apiEndpoint = getApiUrl("/auth/logout");
      await fetch(apiEndpoint, {
        method: "POST",
        credentials: "include",
      });
      
      // Perform complete local clear
      localStorage.clear();
      sessionStorage.clear();
      document.cookie = "access_token=; Max-Age=0; path=/;";
      
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth-change", { detail: null }));
      }
      
      setUser(null);
      setShowProfileDropdown(false);
      setIsDemoMode(true);
      setupGuestUser();
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Logout error:", error);
      
      // Fallback complete clear
      localStorage.clear();
      sessionStorage.clear();
      document.cookie = "access_token=; Max-Age=0; path=/;";
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth-change", { detail: null }));
      }
      setUser(null);
      setIsDemoMode(true);
      setupGuestUser();
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Profile Save handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingProfile || !user) return;
    setIsSavingProfile(true);

    try {
      // 1. Prepare updates payload
      const updates = {
        full_name: formData.full_name,
        headline: formData.headline,
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url,
        portfolio_url: formData.portfolio_url,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        email: formData.email,
        mobile_number: formData.mobile_number,
        state: formData.state,
        district: formData.district,
        institution_name: formData.institution_name,
        institution_district: formData.institution_district,
        interested_domain: formData.interested_domain,
        target_job_role: formData.target_job_role,
        experience: formData.experience,
        skills: formData.skills,
        language_proficiency: formData.language_proficiency,
        certifications: formData.certifications,
      };

      if (!isDemoMode) {
        const apiEndpoint = getApiUrl("/users/me");
        const response = await fetch(apiEndpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
          credentials: "include",
        });

        if (response.ok) {
          const updatedUser = await response.json();
          const merged = { ...user, ...updatedUser };
          setUser(merged);
          localStorage.setItem("user_session", JSON.stringify(merged));
        } else {
          // If server fails (e.g. Supabase connection issue)
          const merged = { ...user, ...updates };
          setUser(merged);
          localStorage.setItem("user_session", JSON.stringify(merged));
        }
      } else {
        // Sandbox update
        const merged = { ...user, ...updates };
        setUser(merged);
        localStorage.setItem("user_session", JSON.stringify(merged));
      }

      // Detect available sources and auto-start background analysis if at least 2 sources are added
      const availableSources = [];
      if (updates.linkedin_url && updates.linkedin_url.trim() !== "") availableSources.push("linkedin");
      if (updates.github_url && updates.github_url.trim() !== "") availableSources.push("github");
      if (updates.portfolio_url && updates.portfolio_url.trim() !== "") availableSources.push("portfolio");
      if (resumeUrl && resumeUrl.trim() !== "") availableSources.push("resume");

      setIsEditModalOpen(false);
      setShowSuccessMessage(true);

      if (availableSources.length >= 2) {
        setAnalysisResetKey(prev => prev + 1);
        setShowAIAnalysis(true);
        updateUrl("Fix My Profile", true);
      }
      
      setTimeout(() => setShowSuccessMessage(false), 3500);
    } catch (err) {
      console.error("Error saving profile details:", err);
      // Fallback update on exception
      const merged = { ...user, ...formData };
      setUser(merged);
      localStorage.setItem("user_session", JSON.stringify(merged));
      setIsEditModalOpen(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3500);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Drag and drop / select file handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadResume(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadResume(e.dataTransfer.files[0]);
    }
  };

  const uploadResume = async (file: File) => {
    setResumeFile(file);
    setIsUploadingResume(true);
    
    // Simulate upload progress
    setTimeout(async () => {
      const simulatedUrl = `/resumes/${file.name}`;
      setResumeUrl(simulatedUrl);
      setIsUploadingResume(false);

      if (user) {
        const updatedUser = { ...user, resume_url: simulatedUrl };
        setUser(updatedUser);
        localStorage.setItem("user_session", JSON.stringify(updatedUser));

        if (!isDemoMode) {
          try {
            await fetch(getApiUrl("/users/me"), {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ resume_url: simulatedUrl }),
              credentials: "include",
            });
          } catch {
            console.warn("Could not save resume to db, cached locally instead.");
          }
        }
      }
    }, 1500);
  };

  const removeResume = async () => {
    setResumeFile(null);
    setResumeUrl(null);
    if (user) {
      const updatedUser = { ...user };
      delete updatedUser.resume_url;
      setUser(updatedUser);
      localStorage.setItem("user_session", JSON.stringify(updatedUser));

      if (!isDemoMode) {
        try {
          await fetch(getApiUrl("/users/me"), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resume_url: null }),
            credentials: "include",
          });
        } catch {
          console.warn("Could not update resume deletion in database.");
        }
      }
    }
  };

  // Sidebar Tabs Config
  const sidebarItems = [
    { name: "Fix My Profile", icon: User },
    { name: "Portfolio Setup", icon: Globe },
    { name: "Job Tracker", icon: Briefcase },
    { name: "Internship Opportunity", icon: Award },
    { name: "My Applications", icon: FileText },
    { name: "Draft Mail", icon: Mail },
  ];

  // Calculate dynamic Profile Strength
  const getProfileStrength = () => {
    if (!user) return 40;
    let score = 40;
    if (user.full_name && user.full_name !== "Temporary Sandbox User") score += 10;
    if (user.headline && user.headline !== "") score += 10;
    if (user.linkedin_url && user.linkedin_url.includes("linkedin.com/in/")) score += 10;
    if (user.github_url && user.github_url !== "") score += 10;
    if (user.portfolio_url && user.portfolio_url !== "") score += 12;
    if (resumeUrl) score += 10; // Maximizes to 92% or 82% baseline if standard fields populated
    return Math.min(score, 100);
  };

  const currentStrength = getProfileStrength();

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
    <div className="relative min-h-screen bg-slate-50/50 flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* FLOATING BACKGROUND PARTICLES (Sleek Glassmorphic Environment) */}
      <div className="absolute top-[10%] left-[25%] w-32 h-32 bg-purple-400/10 rounded-full blur-3xl pointer-events-none animate-drift-slow" />
      <div className="absolute bottom-[20%] right-[15%] w-48 h-48 bg-blue-400/10 rounded-full blur-3xl pointer-events-none animate-drift-slower" />
      <div className="absolute top-[40%] right-[35%] w-24 h-24 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none animate-drift-slowest" />
      
      {/* 1. LEFT SIDEBAR (Dark Indigo Panel) */}
      <motion.aside
        initial={false}
        animate={{
          width: isDesktop ? (isSidebarCollapsed ? 80 : 280) : "100%",
          paddingLeft: isDesktop ? (isSidebarCollapsed ? 12 : 24) : 24,
          paddingRight: isDesktop ? (isSidebarCollapsed ? 12 : 24) : 24,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full lg:w-[280px] bg-[#110E34] text-white flex flex-col justify-between p-6 shrink-0 lg:min-h-screen z-30 border-r border-[#1e1b5b]/50 shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-col gap-8">
          
          {/* Brand Logo & Toggle */}
          <div className={`flex ${isSidebarCollapsed && isDesktop ? "flex-col items-center gap-4" : "items-center justify-between"} w-full`}>
            <Link href="/" className={`flex ${isSidebarCollapsed && isDesktop ? "flex-col justify-center" : "items-center gap-3"} group shrink-0`}>
              <div className={`relative ${isSidebarCollapsed && isDesktop ? "h-[36px] w-[36px]" : "h-[44px] w-[44px]"} overflow-hidden rounded-xl bg-black flex items-center justify-center border border-[#2e2a7e] shadow-md shrink-0 transition-all duration-300`}>
                <Image
                  src="/logo.png"
                  alt="FixToFlex Logo"
                  width={isSidebarCollapsed && isDesktop ? 36 : 44}
                  height={isSidebarCollapsed && isDesktop ? 36 : 44}
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
              {!isSidebarCollapsed && (
                <span className="font-extrabold text-[24px] tracking-tight bg-linear-to-r from-[#22C55E] via-[#7C3AED] to-[#4F46E5] bg-clip-text text-transparent truncate select-none">
                  FixToFlex
                </span>
              )}
            </Link>

            {/* Sidebar collapse toggle (desktop only) */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-white bg-[#1b174b]/60 border border-[#2e2a7e]/50 hover:bg-[#241e6b] transition-all cursor-pointer shrink-0"
            >
              <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isSidebarCollapsed ? "rotate-180" : ""}`} />
            </button>

            {/* Mobile Hamburger toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="lg:hidden p-2 text-slate-300 hover:text-white focus:outline-none shrink-0"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop/Collapsible Navigation List */}
          <nav className={`flex-col gap-2 ${isMobileMenuOpen ? "flex" : "hidden lg:flex"}`}>
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.name;
              return (
                <motion.button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    setShowAIAnalysis(false);
                    setIsMobileMenuOpen(false);
                    updateUrl(item.name, false);
                  }}
                  variants={buttonVariants}
                  initial="initial"
                  animate={isActive ? "active" : "initial"}
                  whileHover={isActive ? "hoverActive" : "hover"}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed && isDesktop ? "justify-center px-0 py-3.5" : "gap-3.5 px-4 py-3.5"
                  } rounded-xl text-sm font-semibold tracking-wide relative overflow-hidden group cursor-pointer ${
                    isActive 
                      ? "bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white shadow-lg" 
                      : "text-slate-400 hover:text-white hover:bg-white/5 transition-colors duration-300"
                  }`}
                >
                  {/* Left indicator line for active item */}
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#22C55E] rounded-r-md" />
                  )}
                  <motion.div
                    variants={iconVariants}
                    className="shrink-0 flex items-center justify-center"
                  >
                    <IconComponent className="w-5 h-5 shrink-0" />
                  </motion.div>
                  {!isSidebarCollapsed && (
                    <span className="truncate whitespace-nowrap">{item.name}</span>
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Banner Card */}
        <AnimatePresence>
          {(isMobileMenuOpen || !isSidebarCollapsed) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, height: 0 }}
              animate={{ opacity: 1, scale: 1, height: "auto" }}
              exit={{ opacity: 0, scale: 0.95, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`mt-8 ${isMobileMenuOpen ? "block" : "hidden lg:block"} overflow-hidden`}
            >
              <div className="relative rounded-2xl bg-linear-to-tr from-[#1b174b] to-[#241e6b] border border-[#2e2a7e] p-5 overflow-hidden shadow-lg group">
                {/* Background elements */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="absolute top-[20%] left-[10%] w-3 h-3 bg-purple-500/30 rounded-full blur-[1px] animate-pulse pointer-events-none" />
                
                <div className="flex flex-col gap-3">
                  {/* Rocket & Stars */}
                  <div className="relative flex items-center gap-2">
                    <span className="relative inline-flex text-indigo-400 text-lg">
                      🚀
                    </span>
                    <span className="absolute top-[-2px] right-[10px] text-xs text-yellow-400 animate-pulse">✦</span>
                    <span className="absolute top-[8px] right-[-4px] text-[10px] text-purple-400 animate-pulse">✦</span>
                  </div>
                  <h5 className="text-sm font-extrabold text-white leading-tight">
                    Unlock Your Career Potential
                  </h5>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    AI tools to build, track and grow your career.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* MAIN LAYOUT BODY WRAPPER (Includes Top Navigation and splits into center content + right sidebar) */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        
        {/* 2. TOP NAVIGATION BAR */}
        <nav className="h-[80px] bg-white/75 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 shrink-0 sticky top-0 z-20">
          
          {/* Active Navigation Marker / Headline */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-slate-800 hidden sm:inline-block">
              Candidate Command Centre
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-[#7C3AED] text-xs font-bold capitalize">
              {user?.role || "Candidate"}
            </span>
            <button 
              onClick={() => {
                setActiveTab("Fix My Profile");
                setShowAIAnalysis(true);
                setAnalysisResetKey(prev => prev + 1);
                updateUrl("Fix My Profile", true);
              }}
              className="ml-4 px-4 py-1.5 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Analyze
            </button>
          </div>

          {/* Desktop Top Links & Authenticated state */}
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/candidate"
                className="text-sm font-bold text-[#7C3AED] relative py-1"
              >
                Candidate
                <span className="absolute bottom-[-4px] left-0 right-0 h-[2.5px] bg-[#7C3AED] rounded-full" />
              </Link>
              <Link
                href="/#recruiter"
                className="text-sm font-semibold text-slate-600 hover:text-[#7C3AED] transition-colors"
              >
                Recruiter
              </Link>
              <Link
                href="/#about"
                className="text-sm font-semibold text-slate-600 hover:text-[#7C3AED] transition-colors"
              >
                About Us
              </Link>
            </div>

            {/* Profile Avatar / Login trigger */}
            {!user || isDemoMode ? (
              <div className="flex items-center gap-3">
                {/* Guest banner indicator */}
                {isDemoMode && (
                  <span className="text-[11px] font-bold bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-1 rounded-full hidden xs:inline-block">
                    Guest Mode
                  </span>
                )}
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLinkedInLogin}
                    className="bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Login with LinkedIn
                  </button>
                </div>
              </div>
            ) : (
              /* REAL Authenticated Dropdown trigger */
              <div 
                className="relative"
                onMouseEnter={() => setShowProfileDropdown(true)}
                onMouseLeave={() => setShowProfileDropdown(false)}
              >
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2.5 py-1.5 px-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200 cursor-pointer focus:outline-none"
                >
                  {user.profile_picture ? (
                    <div className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-purple-200 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={user.profile_picture}
                        alt={user.full_name || "LinkedIn Profile"}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 text-purple-700 font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <span className="font-semibold text-slate-700 text-xs hidden lg:inline-block">
                    {user.full_name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-1.5 w-[320px] rounded-2xl bg-white border border-slate-100 shadow-xl p-4 z-50 origin-top-right"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          {user.profile_picture ? (
                            <div className="relative h-11 w-11 rounded-full overflow-hidden border border-purple-100 shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={user.profile_picture}
                                alt={user.full_name}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ) : (
                            <div className="h-11 w-11 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 text-purple-700 font-bold text-sm shrink-0">
                              <User className="w-5 h-5" />
                            </div>
                          )}
                          <div className="text-left truncate">
                            <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                              {user.full_name}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="h-px bg-slate-100 w-full" />
                        <button
                          onClick={() => {
                            setEditModalMode("all");
                            setIsEditModalOpen(true);
                            setShowProfileDropdown(false);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 text-left transition-all"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>My Profile & Settings</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 transition-all text-left disabled:opacity-50"
                        >
                          {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                          <span>Logout Session</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </nav>

        {/* CONTENT SPLIT GRID (Center main area + Right Profile sidebar) */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_380px] p-6 lg:p-10 gap-6 lg:gap-10 overflow-y-auto max-h-[calc(100vh-80px)]">
          
          {/* 3. MAIN DASHBOARD CONTENT AREA */}
          <main className="flex-col gap-6 flex">
            
            <AnimatePresence mode="wait">
              {activeTab === "Fix My Profile" && (
                <motion.div
                  key="fix-my-profile"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6"
                >
                  {showAIAnalysis ? (
                    <AIAnalysisDashboard 
                      key={analysisResetKey}
                      githubUrl={formData.github_url}
                      portfolioUrl={formData.portfolio_url}
                      resumeFile={resumeFile}
                      resumeUrl={resumeUrl}
                      linkedinUrl={formData.linkedin_url}
                      isLinkedInLoggedIn={user !== null && !isDemoMode}
                      onLinkedInLogin={handleLinkedInLogin}
                      onAnalysisComplete={(res) => {
                        console.log("Analysis Complete", res);
                      }}
                      onNavigateToCareerIntelligence={() => {
                        setActiveTab("Career Intelligence");
                        setShowAIAnalysis(false);
                      }}
                      onRequestEditProfile={(mode) => {
                        setEditModalMode(mode || "all");
                        setIsEditModalOpen(true);
                      }}
                      onCancel={() => {
                        setShowAIAnalysis(false);
                        updateUrl(activeTab, false);
                      }}
                    />
                  ) : (
                    <>
                      {/* GLASSMORPHIC PRIMARY WRITER CARD (Centered in layout) */}
                      <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 lg:p-10 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
                        
                        {/* Floating orbs specific to this card */}
                        <div className="absolute top-[-40px] left-[10%] w-24 h-24 bg-purple-100 rounded-full blur-2xl opacity-60 pointer-events-none" />
                        <div className="absolute bottom-[-40px] right-[10%] w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

                        {/* Scheduler Dropdown at Top-Left */}
                        <div className="absolute top-4 left-6 z-10 flex flex-col items-start gap-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-1">Auto Analysis</span>
                          <select
                            value={schedulePref}
                            onChange={(e) => handleScheduleUpdate(e.target.value)}
                            className="bg-white/90 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg px-2 py-1.5 shadow-xs outline-hidden focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
                          >
                            <option value="Analyze Now">Analyze Now</option>
                            <option value="Every 6 Hours">Every 6 Hours</option>
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly (Default)</option>
                            <option value="Monthly">Monthly</option>
                          </select>
                        </div>

                        {/* My Target Button at Top-Right */}
                        <div className="absolute top-4 right-6 z-10">
                          <button
                            onClick={() => setIsTargetModalOpen(true)}
                            className="px-4 py-2 bg-purple-50 text-[#7C3AED] hover:bg-purple-100 border border-purple-200/50 text-xs font-bold rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer animate-pulse-slow"
                          >
                            <Target className="w-4 h-4" /> My Target
                          </button>
                        </div>

                        {/* Middle Circular User Icon decoration */}
                        <div className="w-14 h-14 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 shadow-sm">
                          <User className="w-6 h-6" />
                        </div>

                        {/* Titles */}
                        <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-800 leading-tight">
                          Welcome Back! 👋
                        </h2>
                        <p className="text-xl lg:text-2xl font-extrabold bg-linear-to-r from-[#7C3AED] to-[#4F46E5] bg-clip-text text-transparent mt-2 tracking-tight">
                          Let&apos;s build a recruiter-ready profile.
                        </p>

                        {/* ILLUSTRATION COMPONENT (Visual representation of dashboard preview) */}
                        <div className="w-full max-w-[420px] aspect-[1.4/1] bg-slate-50/50 rounded-2xl border border-slate-200/40 p-4 shadow-sm my-8 relative flex flex-col overflow-hidden">
                          {/* Top bar */}
                          <div className="flex items-center justify-between mb-3 border-b border-slate-200/30 pb-2">
                            <div className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                            </div>
                            <span className="text-[9px] font-bold text-slate-400 tracking-wider">PROFILE_PREVIEW</span>
                          </div>

                          {/* Mockup layout */}
                          <div className="flex-1 grid grid-cols-[1fr_1.1fr] gap-3">
                            {/* Mockup Left Details */}
                            <div className="bg-white rounded-xl border border-slate-100 p-3 shadow-xs flex flex-col justify-between">
                              <div className="flex flex-col gap-2">
                                {/* Avatar placeholder circle */}
                                <div className="w-8 h-8 bg-purple-100 rounded-full animate-pulse" />
                                <div className="w-24 h-2.5 bg-slate-200 rounded-full mt-1" />
                                <div className="w-16 h-2 bg-slate-100 rounded-full" />
                              </div>
                              <div className="space-y-1.5 mt-4">
                                <div className="w-full h-1.5 bg-slate-100 rounded-full" />
                                <div className="w-[80%] h-1.5 bg-slate-100 rounded-full" />
                                <div className="w-[90%] h-1.5 bg-slate-100 rounded-full" />
                              </div>
                            </div>
                            
                            {/* Mockup Right Stats/Graph */}
                            <div className="flex flex-col gap-3">
                              <div className="flex-1 bg-white rounded-xl border border-slate-100 shadow-xs p-3 flex flex-col justify-center gap-2">
                                <div className="flex justify-between items-end">
                                  <div className="w-2 h-8 bg-indigo-200 rounded-t-sm" />
                                  <div className="w-2 h-12 bg-purple-400 rounded-t-sm" />
                                  <div className="w-2 h-6 bg-slate-200 rounded-t-sm" />
                                  <div className="w-2 h-10 bg-indigo-300 rounded-t-sm" />
                                  <div className="w-2 h-14 bg-purple-500 rounded-t-sm" />
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2" />
                              </div>
                              <div className="h-10 bg-white rounded-xl border border-slate-100 shadow-xs flex items-center px-3 gap-2">
                                <div className="w-4 h-4 rounded-md bg-emerald-100 flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5 text-emerald-500" />
                                </div>
                                <div className="w-16 h-2 bg-slate-200 rounded-full" />
                              </div>
                            </div>
                          </div>

                          {/* Drawn Pen overlay */}
                          <div className="absolute bottom-[20px] left-[20px] w-24 h-4 bg-purple-600 rounded-full shadow-md transform rotate-[-40deg] border border-purple-500 flex items-center justify-end px-1.5 pointer-events-none animate-bounce">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                          </div>
                        </div>

                        {/* Invitation Header */}
                        <div className="space-y-1">
                          <h3 className="text-md font-bold text-slate-800">
                            Please update your profile details.
                          </h3>
                          <p className="text-xs text-slate-400 font-semibold">
                            Complete your profile to unlock
                          </p>
                        </div>

                        {/* Features cards grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full my-8">
                          {[
                            { title: "Better ATS Score", icon: TrendingUp, color: "bg-blue-50 text-blue-600 border-blue-100/50" },
                            { title: "Better Job Matching", icon: Briefcase, color: "bg-indigo-50 text-indigo-600 border-indigo-100/50" },
                            { title: "AI Resume Analysis", icon: Sparkles, color: "bg-purple-50 text-purple-600 border-purple-100/50" },
                            { title: "Portfolio Generation", icon: Globe, color: "bg-emerald-50 text-emerald-600 border-emerald-100/50" },
                          ].map((card, idx) => {
                            const CardIcon = card.icon;
                            return (
                              <div 
                                key={idx} 
                                className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center gap-2 shadow-xs transition-all duration-300 hover:scale-[1.03] ${card.color}`}
                              >
                                <CardIcon className="w-5 h-5 shrink-0" />
                                <span className="text-[10px] font-extrabold uppercase tracking-wide leading-tight">
                                  {card.title}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Only show progress button if it's running or completed */}
                        {(queueProgressPercent > 0 || queueStatus?.overall_status === "Running" || queueStatus?.overall_status === "Completed") && (
                          <div className="w-full max-w-sm mt-4">
                            <button 
                              onClick={() => {
                                if (queueStatus?.cache_valid) {
                                  setActiveTab("Career Intelligence");
                                  setShowAIAnalysis(false);
                                  updateUrl("Career Intelligence", false);
                                } else {
                                  setShowAIAnalysis(true);
                                  updateUrl(activeTab, true);
                                }
                              }}
                              disabled={queueProgressPercent < 100}
                              className={`relative w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 ${
                                queueProgressPercent >= 100 
                                  ? "bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] cursor-pointer group" 
                                  : "bg-slate-100 text-slate-500 cursor-not-allowed"
                              }`}
                            >
                              {/* Animated Background Fill */}
                              {queueProgressPercent < 100 && (
                                <div 
                                  className="absolute top-0 left-0 h-full bg-linear-to-r from-purple-200 to-indigo-200 transition-all duration-1000 ease-in-out"
                                  style={{ width: `${queueProgressPercent}%` }}
                                />
                              )}
                              
                              {/* Subtle Glow Animation when 100% */}
                              {queueProgressPercent >= 100 && (
                                <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              )}

                              {/* Button Text & Icon */}
                              <div className="relative z-10 flex items-center gap-2">
                                {queueProgressPercent < 25 ? (
                                  <><Loader2 className="w-4 h-4 animate-spin text-purple-600" /> Initializing...</>
                                ) : queueProgressPercent < 50 ? (
                                  <><Loader2 className="w-4 h-4 animate-spin text-purple-600" /> Analyzing...</>
                                ) : queueProgressPercent < 75 ? (
                                  <><Loader2 className="w-4 h-4 animate-spin text-purple-600" /> Processing...</>
                                ) : queueProgressPercent < 100 ? (
                                  <><Loader2 className="w-4 h-4 animate-spin text-purple-600" /> Finalizing...</>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4" /> Ready for AI Insight
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                  </>
                                )}
                              </div>
                            </button>
                          </div>
                        )}

                        {/* Bottom Security Note */}
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold mt-4">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Your data is safe and secure with us.</span>
                        </div>

                      </div>

                      <MyTargetAnalysisModal
                        isOpen={isTargetModalOpen}
                        onClose={() => setIsTargetModalOpen(false)}
                        onSearchAnalyze={(company, role, location) => {
                          setTargetSearch({ company, role, location });
                          setIsTargetModalOpen(false);
                          setActiveTab("Career Intelligence");
                          updateUrl("Career Intelligence", false);
                        }}
                      />
                    </>
                  )}
                </motion.div>
              )}

              {activeTab === "Career Intelligence" && (
                <motion.div
                  key="career-intelligence"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <CareerIntelligenceReport
                    userId={user?.id || "00000000-0000-0000-0000-000000000000"}
                    initialTargetSearch={targetSearch}
                    onClearTargetSearch={() => setTargetSearch(null)}
                  />
                </motion.div>
              )}

              {/* Dynamic Views for other tabs */}
              {activeTab === "Portfolio Setup" && (
                <motion.div
                  key="portfolio-setup"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col gap-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">Portfolio Setup</h2>
                      <p className="text-xs text-slate-400">Deploy your professional recruiter-facing portfolio site.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Selected Template</span>
                        <h4 className="text-md font-bold text-slate-700 mt-1">Minimalist Developer Template</h4>
                        <p className="text-xs text-slate-400 mt-2">Clean, glassmorphic dark-mode configuration optimized for software engineer roles.</p>
                      </div>
                      <button className="mt-4 px-4 py-2 border border-[#7C3AED] hover:bg-purple-50 text-[#7C3AED] text-xs font-semibold rounded-xl transition-all self-start">
                        Change Theme
                      </button>
                    </div>

                    <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#7C3AED] uppercase">Custom Domain</span>
                        <h4 className="text-md font-bold text-slate-700 mt-1">
                          {user?.full_name ? `${user.full_name.toLowerCase().replace(/\s+/g, "")}.fixtoflex.dev` : "yourname.fixtoflex.dev"}
                        </h4>
                        <p className="text-xs text-slate-400 mt-2">Get a clean free subdomain to show to recruiters, or connect a custom one.</p>
                      </div>
                      <button className="mt-4 px-4 py-2 bg-[#7C3AED] text-white text-xs font-semibold rounded-xl hover:bg-purple-700 transition-all self-start flex items-center gap-1">
                        <span>Deploy Portfolio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "Job Tracker" && (
                <JobTrackerPanel getApiUrl={getApiUrl} />
              )}

              {activeTab === "Internship Opportunity" && (
                <motion.div
                  key="internships"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col gap-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">Internship Opportunities</h2>
                      <p className="text-xs text-slate-400">Explore matched roles aligned with your experience.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { company: "Google", role: "Software Engineer Intern", match: "87%", type: "Remote", skills: "React, TypeScript, Go" },
                      { company: "Microsoft", role: "SDE Intern", match: "82%", type: "Bengaluru", skills: "C#, Azure, SQL" },
                      { company: "Swiggy", role: "Backend Development Intern", match: "78%", type: "Hybrid", skills: "Node.js, Postgres, Redis" },
                    ].map((opp, idx) => (
                      <div key={idx} className="p-4 border border-slate-100 bg-slate-50/50 rounded-2xl flex items-center justify-between gap-4 transition-all hover:border-[#7C3AED]/30">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-800">{opp.role}</h4>
                            <span className="text-[10px] text-slate-400 font-bold">• {opp.company}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium">Location: {opp.type} | Skills: {opp.skills}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-[9px] text-slate-400 font-bold block">MATCH</span>
                            <span className="text-xs font-extrabold text-emerald-500">{opp.match}</span>
                          </div>
                          <button className="px-3.5 py-1.5 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white text-[10px] font-bold rounded-lg transition-all shadow-sm">
                            Apply
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "My Applications" && (
                <motion.div
                  key="my-apps"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col gap-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">My Applications</h2>
                      <p className="text-xs text-slate-400">Monitor submissions status and next steps.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { role: "Software Engineer", company: "Google", status: "Interview Scheduled", note: "Technical Round on June 22 at 10 AM" },
                      { role: "SDE Intern", company: "Microsoft", status: "Reviewing Qualifications", note: "Resume successfully parsed" },
                    ].map((app, idx) => (
                      <div key={idx} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-extrabold text-slate-800">{app.role}</h4>
                            <span className="text-[10px] text-slate-400 font-bold">{app.company}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-bold">
                            {app.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold">{app.note}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "Draft Mail" && (
                <motion.div
                  key="draft-mail"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col gap-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">AI Outreach Draft</h2>
                      <p className="text-xs text-slate-400">Generate high-impact cold emails targeted at recruiters.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl text-[11px] font-mono text-slate-600 space-y-2">
                      <div><span className="text-slate-400">To:</span> recruiter@google.com</div>
                      <div><span className="text-slate-400">Subject:</span> Application for SWE Intern - {user?.full_name || "Guest User"}</div>
                      <hr className="border-slate-200/50 my-2" />
                      <p>Dear Hiring Manager,</p>
                      <p>I recently upgraded my profile for Software Engineering positions, aligning my project details with Google&apos;s core stack. I would love to connect to discuss active SDE internship opportunities...</p>
                    </div>
                    <button className="px-4 py-2 bg-[#7C3AED] text-white text-xs font-semibold rounded-xl hover:bg-purple-700 transition-all flex items-center gap-1.5">
                      <span>Copy Outreach Template</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </main>

          {/* 4. RIGHT PROFILE SIDEBAR */}
          <aside className="flex flex-col gap-6">
            
            {/* PROFILE HEAD CARD */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl flex flex-col items-center text-center">
              
              {/* Profile Avatar Grid */}
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-purple-100 shadow-md">
                {user?.profile_picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.profile_picture}
                    alt={user.full_name || "User Photo"}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="h-full w-full bg-purple-50 flex items-center justify-center text-purple-700 text-3xl font-bold">
                    {user?.full_name?.charAt(0) || "G"}
                  </div>
                )}
              </div>

              {/* Profile Name & Title */}
              <h3 className="text-md font-extrabold text-slate-800 mt-4 leading-tight">
                {user?.full_name || "Guest User"}
              </h3>
              <p className="text-xs text-slate-400 font-bold mt-1">
                {user?.headline || "Software Engineer"}
              </p>

              {/* Quick links list */}
              <div className="w-full flex flex-col gap-2 mt-6">
                
                {/* 1. Edit Profile */}
                <button
                  onClick={() => {
                    setEditModalMode("all");
                    setIsEditModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 border border-slate-100 hover:border-purple-200 bg-slate-50/50 hover:bg-white rounded-2xl text-xs font-bold text-slate-600 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#7C3AED]"><User className="w-4 h-4" /></span>
                    <span>Edit My Profile</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 2. LinkedIn Link */}
                <button
                  onClick={() => {
                    setEditModalMode("linkedin");
                    setIsEditModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 border border-slate-100 hover:border-purple-200 bg-slate-50/50 hover:bg-white rounded-2xl text-xs font-bold text-slate-600 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#0A66C2]"><LinkedInIcon className="w-4 h-4 fill-[#0A66C2]" /></span>
                    <span className="truncate max-w-[180px]">
                      {formData.linkedin_url ? "LinkedIn Profile Added" : "Add LinkedIn Profile URL"}
                    </span>
                  </div>
                  {formData.linkedin_url ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  )}
                </button>

                {/* 3. GitHub Link */}
                <button
                  onClick={() => {
                    setEditModalMode("github");
                    setIsEditModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 border border-slate-100 hover:border-purple-200 bg-slate-50/50 hover:bg-white rounded-2xl text-xs font-bold text-slate-600 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-800"><GitHubIcon className="w-4 h-4 fill-slate-800" /></span>
                    <span className="truncate max-w-[180px]">
                      {formData.github_url ? "GitHub Profile Added" : "Add GitHub Profile URL"}
                    </span>
                  </div>
                  {formData.github_url ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  )}
                </button>

                {/* 4. Portfolio Link */}
                <button
                  onClick={() => {
                    setEditModalMode("portfolio");
                    setIsEditModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 border border-slate-100 hover:border-purple-200 bg-slate-50/50 hover:bg-white rounded-2xl text-xs font-bold text-slate-600 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-500"><Globe className="w-4 h-4" /></span>
                    <span className="truncate max-w-[180px]">
                      {formData.portfolio_url ? "Portfolio Added" : "Add Portfolio URL"}
                    </span>
                  </div>
                  {formData.portfolio_url ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  )}
                </button>

                {/* 5. Upload Resume Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-between px-4 py-3 border border-slate-100 hover:border-purple-200 bg-slate-50/50 hover:bg-white rounded-2xl text-xs font-bold text-slate-600 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-purple-600"><FileText className="w-4 h-4" /></span>
                    <span className="truncate max-w-[180px]">
                      {resumeUrl ? "Resume Uploaded" : "Add Resume"}
                    </span>
                  </div>
                  {resumeUrl ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  )}
                </button>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />

              {/* DRAG & DROP ZONE */}
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="w-full mt-4 border-2 border-dashed border-purple-200/60 hover:border-[#7C3AED]/50 bg-purple-50/10 hover:bg-purple-50/20 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300"
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploadingResume ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 text-[#7C3AED] animate-spin" />
                    <span className="text-[10px] font-bold text-slate-400">Analyzing Resume...</span>
                  </div>
                ) : resumeUrl ? (
                  <div className="flex flex-col items-center gap-2 w-full">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 truncate max-w-[200px]">{resumeFile?.name || "resume.pdf"}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeResume();
                      }}
                      className="text-[9px] text-rose-500 hover:text-rose-700 font-extrabold flex items-center gap-0.5 mt-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove File</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-6 h-6 text-purple-400/80" />
                    <p className="text-[10px] font-semibold text-slate-500 text-center leading-normal">
                      Drag & Drop your resume here or <br />
                      <span className="text-[#7C3AED] font-bold hover:underline">Choose File</span>
                    </p>
                  </>
                )}
              </div>

            </div>

            {/* PROFILE STRENGTH METER CARD */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-5 shadow-xl flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800">Profile Strength</span>
                <span className="text-sm font-extrabold text-[#10B981]">{currentStrength}%</span>
              </div>
              
              {/* Green Progress Bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${currentStrength}%` }}
                />
              </div>

              {/* Stats Footer Text */}
              <div className="flex items-center gap-2 mt-1">
                <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-[10px] text-slate-500 font-semibold leading-normal">
                  {currentStrength >= 80 
                    ? "Great! Keep filling to make it stronger." 
                    : "Update your profile to unlock all recruitment match metrics!"}
                </span>
              </div>
            </div>

          </aside>
          
        </div>

      </div>

      {/* SUCCESS MESSAGE TOAST */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-100 flex items-center gap-3 bg-white/90 backdrop-blur-xl border border-emerald-100 shadow-[0_12px_32px_-8px_rgba(16,185,129,0.3)] px-5 py-3.5 rounded-2xl"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center">
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-800 tracking-tight">Profile Saved Successfully!</p>
              <p className="text-[11px] text-slate-500 font-medium">Your matchmaking metrics have been updated.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. PREMIUM EDIT PROFILE MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setIsEditModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 backdrop-blur-xl rounded-[24px] border border-white/60 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden relative"
            >
              {/* Decorative gradient orbs */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

              {/* Modal Header - Sticky */}
              <div className="flex items-center justify-between px-6 lg:px-8 py-5 border-b border-slate-100/80 bg-white/80 backdrop-blur-md shrink-0 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#7C3AED] to-[#4F46E5] flex items-center justify-center shadow-lg shadow-purple-500/20">
                    {editModalMode === "linkedin" ? (
                      <LinkedInIcon className="w-5 h-5 fill-white" />
                    ) : editModalMode === "github" ? (
                      <GitHubIcon className="w-5 h-5 fill-white" />
                    ) : editModalMode === "portfolio" ? (
                      <Globe className="w-5 h-5 text-white" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                      {editModalMode === "linkedin" && "Edit LinkedIn Profile URL"}
                      {editModalMode === "github" && "Edit GitHub Profile URL"}
                      {editModalMode === "portfolio" && "Edit Portfolio Website URL"}
                      {editModalMode === "all" && "Edit My Profile"}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {editModalMode === "linkedin" && "Provide your LinkedIn profile URL for career analysis"}
                      {editModalMode === "github" && "Provide your GitHub profile URL to check code repositories"}
                      {editModalMode === "portfolio" && "Provide your portfolio website URL to scan projects"}
                      {editModalMode === "all" && "Complete your profile for AI scoring & job matching"}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-600 transition-all duration-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form id="edit-profile-form" onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto px-6 lg:px-8 py-6 space-y-7 custom-scrollbar">
                
                {editModalMode === "all" && (
                  <>
                    {/* ══════════ SECTION 1: Personal Information ══════════ */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                          <span className="text-sm">👤</span>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-700 tracking-tight">Personal Information</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <User className="w-3 h-3 text-purple-400" />
                            Full Name
                          </label>
                          <input
                            type="text"
                            required
                            id="edit-full-name"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="w-full bg-slate-50/80 border border-slate-200/80 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all duration-200"
                            placeholder="e.g. Arjun Kumar"
                          />
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-purple-400" />
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            id="edit-dob"
                            value={formData.date_of_birth}
                            onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                            className="w-full bg-slate-50/80 border border-slate-200/80 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all duration-200"
                          />
                        </div>

                        {/* Gender */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Users className="w-3 h-3 text-purple-400" />
                            Gender
                          </label>
                          <select
                            id="edit-gender"
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="w-full bg-slate-50/80 border border-slate-200/80 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-binary">Non-binary</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                          </select>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-purple-400" />
                            Email ID
                          </label>
                          <input
                            type="email"
                            id="edit-email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-slate-50/80 border border-slate-200/80 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all duration-200"
                            placeholder="e.g. arjun@gmail.com"
                          />
                        </div>

                        {/* Mobile Number */}
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-purple-400" />
                            Mobile Number
                          </label>
                          <input
                            type="tel"
                            id="edit-mobile"
                            value={formData.mobile_number}
                            onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                            className="w-full bg-slate-50/80 border border-slate-200/80 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all duration-200"
                            placeholder="e.g. +91 98765 43210"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

                    {/* ══════════ SECTION 2: Location ══════════ */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                          <span className="text-sm">📍</span>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-700 tracking-tight">Location</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* State */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            State
                          </label>
                          <input
                            type="text"
                            id="edit-state"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className="w-full bg-slate-50/80 border border-slate-200/80 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all duration-200"
                            placeholder="e.g. Tamil Nadu"
                          />
                        </div>

                        {/* District */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Map className="w-3 h-3 text-emerald-400" />
                            District
                          </label>
                          <input
                            type="text"
                            id="edit-district"
                            value={formData.district}
                            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                            className="w-full bg-slate-50/80 border border-slate-200/80 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all duration-200"
                            placeholder="e.g. Chennai"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

                    {/* ══════════ SECTION 3: Education ══════════ */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                          <span className="text-sm">🎓</span>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-700 tracking-tight">Education</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Institution Name */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <GraduationCap className="w-3 h-3 text-amber-500" />
                            Institution Name
                          </label>
                          <input
                            type="text"
                            id="edit-institution"
                            value={formData.institution_name}
                            onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })}
                            className="w-full bg-slate-50/80 border border-slate-200/80 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all duration-200"
                            placeholder="e.g. Anna University"
                          />
                        </div>

                        {/* Institution District */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Building className="w-3 h-3 text-amber-500" />
                            Institution District
                          </label>
                          <input
                            type="text"
                            id="edit-institution-district"
                            value={formData.institution_district}
                            onChange={(e) => setFormData({ ...formData, institution_district: e.target.value })}
                            className="w-full bg-slate-50/80 border border-slate-200/80 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all duration-200"
                            placeholder="e.g. Chennai"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

                    {/* ══════════ SECTION 4: Career Preferences ══════════ */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                          <span className="text-sm">💼</span>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-700 tracking-tight">Career Preferences</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Headline / Job Title */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Briefcase className="w-3 h-3 text-indigo-400" />
                            Headline / Job Title
                          </label>
                          <input
                            type="text"
                            id="edit-headline"
                            value={formData.headline}
                            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                            className="w-full bg-slate-50/80 border border-slate-200/80 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all duration-200"
                            placeholder="e.g. Software Engineer"
                          />
                        </div>

                        {/* Interested Domain */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Briefcase className="w-3 h-3 text-indigo-400" />
                            Interested Domain
                          </label>
                          <input
                            type="text"
                            id="edit-domain"
                            value={formData.interested_domain}
                            onChange={(e) => setFormData({ ...formData, interested_domain: e.target.value })}
                            className="w-full bg-slate-50/80 border border-slate-200/80 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all duration-200"
                            placeholder="e.g. Full Stack Development"
                          />
                        </div>

                        {/* Target Job Role */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Target className="w-3 h-3 text-indigo-400" />
                            Target Job Role
                          </label>
                          <input
                            type="text"
                            id="edit-target-role"
                            value={formData.target_job_role}
                            onChange={(e) => setFormData({ ...formData, target_job_role: e.target.value })}
                            className="w-full bg-slate-50/80 border border-slate-200/80 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all duration-200"
                            placeholder="e.g. Software Engineer"
                          />
                        </div>

                        {/* Experience */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-indigo-400" />
                            Experience
                          </label>
                          <select
                            id="edit-experience"
                            value={formData.experience}
                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                            className="w-full bg-slate-50/80 border border-slate-200/80 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
                          >
                            <option value="">Select Experience</option>
                            <option value="Fresher">Fresher</option>
                            <option value="0-1 years">0-1 years</option>
                            <option value="1-2 years">1-2 years</option>
                            <option value="2-3 years">2-3 years</option>
                            <option value="3-5 years">3-5 years</option>
                            <option value="5+ years">5+ years</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

                    {/* ══════════ SECTION 5: Technical Skills ══════════ */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center">
                          <span className="text-sm">🛠</span>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-700 tracking-tight">Technical Skills</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Skills */}
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Code className="w-3 h-3 text-purple-400" />
                            Skills
                          </label>
                          <input
                            type="text"
                            id="edit-skills"
                            value={formData.skills}
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                            className="w-full bg-slate-50/80 border border-slate-200/80 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all duration-200"
                            placeholder="e.g. React, TypeScript, Node.js, Python (comma separated)"
                          />
                        </div>

                        {/* Language Proficiency */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Hash className="w-3 h-3 text-purple-400" />
                            Language Proficiency
                          </label>
                          <input
                            type="text"
                            id="edit-languages"
                            value={formData.language_proficiency}
                            onChange={(e) => setFormData({ ...formData, language_proficiency: e.target.value })}
                            className="w-full bg-slate-50/80 border border-slate-200/80 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all duration-200"
                            placeholder="e.g. English, Tamil, Hindi"
                          />
                        </div>

                        {/* Certifications */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Award className="w-3 h-3 text-purple-400" />
                            Certifications
                          </label>
                          <input
                            type="text"
                            id="edit-certifications"
                            value={formData.certifications}
                            onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                            className="w-full bg-slate-50/80 border border-slate-200/80 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all duration-200"
                            placeholder="e.g. AWS Cloud Practitioner"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
                  </>
                )}

                {/* ══════════ SECTION 6: Social & Portfolio Links ══════════ */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center">
                      <span className="text-sm">🔗</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-700 tracking-tight">
                      {editModalMode === "all" ? "Social & Portfolio Links" : "Profile Link"}
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* LinkedIn URL */}
                    {(editModalMode === "all" || editModalMode === "linkedin") && (
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <LinkedInIcon className="w-3 h-3 fill-[#0A66C2]" />
                          LinkedIn Profile URL
                        </label>
                        <input
                          type="url"
                          id="edit-linkedin"
                          value={formData.linkedin_url}
                          onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                          className="w-full bg-slate-50/80 border border-slate-200/80 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all duration-200"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                    )}

                    {/* GitHub URL */}
                    {(editModalMode === "all" || editModalMode === "github") && (
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <GitHubIcon className="w-3 h-3 fill-slate-600" />
                          GitHub Profile URL
                        </label>
                        <input
                          type="url"
                          id="edit-github"
                          value={formData.github_url}
                          onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                          className="w-full bg-slate-50/80 border border-slate-200/80 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all duration-200"
                          placeholder="https://github.com/username"
                        />
                      </div>
                    )}

                    {/* Portfolio URL */}
                    {(editModalMode === "all" || editModalMode === "portfolio") && (
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Globe className="w-3 h-3 text-emerald-500" />
                          Portfolio Website URL
                        </label>
                        <input
                          type="url"
                          id="edit-portfolio"
                          value={formData.portfolio_url}
                          onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                          className="w-full bg-slate-50/80 border border-slate-200/80 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all duration-200"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom spacer for sticky footer */}
                <div className="h-2" />

              </form>

              {/* Sticky Footer - Save/Cancel */}
              <div className="flex items-center justify-between gap-3 px-6 lg:px-8 py-4 border-t border-slate-100/80 bg-white/90 backdrop-blur-md shrink-0 relative z-10">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] text-slate-400 font-semibold">Your data is encrypted & secure</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="edit-profile-form"
                    disabled={isSavingProfile}
                    className="px-6 py-2.5 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] hover:from-[#6D28D9] hover:to-[#4338CA] text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingProfile && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Save Profile</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* First-Time User Onboarding Modal */}
      {showFirstTimeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-100 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/95 backdrop-blur-xl border border-slate-100/80 rounded-3xl p-6 lg:p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center gap-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-[#7C3AED] to-[#4F46E5]" />
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-xs border border-purple-100">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-slate-800 leading-tight">Welcome to FixToFlex</h3>
              <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                Complete your profile and add your public profiles to receive personalized AI career guidance.
              </p>
            </div>
            <button
              onClick={() => {
                setShowFirstTimeModal(false);
                setActiveTab("Fix My Profile");
                setEditModalMode("all");
                setIsEditModalOpen(true);
              }}
              className="w-full py-3 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white text-sm font-bold rounded-2xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              Complete Profile
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
}
