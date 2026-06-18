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
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  Plus, 
  Search, 
  Menu, 
  X, 
  Settings, 
  LogOut, 
  ArrowRight,
  FileDown,
  ChevronDown,
  Loader2,
  Trash2,
  Bookmark,
  Send,
  Zap,
  TrendingUp,
  AlertCircle
} from "lucide-react";
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
}

export default function CandidateDashboard() {
  const router = useRouter();
  
  // Navigation State
  const [activeTab, setActiveTab] = useState("Fix My Profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // Auth & Session State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Profile Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    headline: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Resume Upload State
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to construct API URL
  const getApiUrl = (path: string): string => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return `http://localhost:8000${path}`;
      }
      return `http://${hostname}:8000${path}`;
    }
    return `http://localhost:8000${path}`;
  };

  // Sync session check
  const fetchSession = async () => {
    try {
      setIsLoading(true);
      const localSession = localStorage.getItem("user_session");
      if (localSession) {
        try {
          const parsed = JSON.parse(localSession);
          setUser(parsed);
          setFormData({
            full_name: parsed.full_name || parsed.name || "",
            headline: parsed.headline || "Software Engineer",
            linkedin_url: parsed.linkedin_url || `https://linkedin.com/in/${(parsed.full_name || parsed.name || "arjun-kumar").toLowerCase().replace(/\s+/g, "-")}`,
            github_url: parsed.github_url || "",
            portfolio_url: parsed.portfolio_url || "",
          });
          if (parsed.resume_url) {
            setResumeUrl(parsed.resume_url);
          }
        } catch (e) {
          console.error("Failed to parse cached user session:", e);
        }
      }

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
        });
        if (userData.resume_url) {
          setResumeUrl(userData.resume_url);
        }
        setIsDemoMode(false);
      } else {
        // Not authenticated, set demo mode
        setIsDemoMode(true);
        if (!localSession) {
          setupDemoUser();
        }
      }
    } catch (error) {
      console.warn("Error checking session, switching to demo mode:", error);
      setIsDemoMode(true);
      setupDemoUser();
    } finally {
      setIsLoading(false);
    }
  };

  const setupDemoUser = () => {
    const demoUser: UserProfile = {
      id: "demo-user-id",
      email: "arjun.kumar@gmail.com",
      full_name: "Arjun Kumar",
      name: "Arjun Kumar",
      profile_picture: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
      role: "candidate",
      headline: "Software Engineer",
      linkedin_url: "https://linkedin.com/in/arjun-kumar",
      github_url: "https://github.com/arjun-kumar",
      portfolio_url: "https://arjunkumar.dev",
    };
    setUser(demoUser);
    setFormData({
      full_name: demoUser.full_name || "",
      headline: demoUser.headline || "",
      linkedin_url: demoUser.linkedin_url || "",
      github_url: demoUser.github_url || "",
      portfolio_url: demoUser.portfolio_url || "",
    });
  };

  useEffect(() => {
    fetchSession();
  }, []);

  // Login handler
  const handleLinkedInLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const apiEndpoint = getApiUrl("/auth/linkedin/login");
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error("Failed to retrieve LinkedIn login authorization URL.");
      }
      const data = await response.json();
      if (data.auth_url) {
        window.location.href = data.auth_url;
      }
    } catch (error: any) {
      alert(`Unable to start LinkedIn login: ${error.message || error}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const apiEndpoint = getApiUrl("/auth/logout");
      const response = await fetch(apiEndpoint, {
        method: "POST",
        credentials: "include",
      });
      
      // Cleanup local state
      localStorage.removeItem("user_session");
      setUser(null);
      setShowProfileDropdown(false);
      
      // Setup demo user or redirect
      setupDemoUser();
      setIsDemoMode(true);
      router.push("/");
    } catch (err: any) {
      console.error("Logout error:", err);
      localStorage.removeItem("user_session");
      setUser(null);
      setupDemoUser();
      setIsDemoMode(true);
      router.push("/");
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

      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error saving profile details:", err);
      // Fallback update on exception
      const merged = { ...user, ...formData };
      setUser(merged);
      localStorage.setItem("user_session", JSON.stringify(merged));
      setIsEditModalOpen(false);
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
          } catch (e) {
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
        } catch (e) {
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

  return (
    <div className="relative min-h-screen bg-slate-50/50 flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* FLOATING BACKGROUND PARTICLES (Sleek Glassmorphic Environment) */}
      <div className="absolute top-[10%] left-[25%] w-32 h-32 bg-purple-400/10 rounded-full blur-3xl pointer-events-none animate-drift-slow" />
      <div className="absolute bottom-[20%] right-[15%] w-48 h-48 bg-blue-400/10 rounded-full blur-3xl pointer-events-none animate-drift-slower" />
      <div className="absolute top-[40%] right-[35%] w-24 h-24 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none animate-drift-slowest" />
      
      {/* 1. LEFT SIDEBAR (Dark Indigo Panel) */}
      <aside className="w-full lg:w-[280px] bg-[#110E34] text-white flex flex-col justify-between p-6 shrink-0 lg:min-h-screen z-30 border-r border-[#1e1b5b]/50 shadow-2xl relative">
        <div className="flex flex-col gap-8">
          
          {/* Brand Logo & Toggle */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-[48px] w-[48px] overflow-hidden rounded-xl bg-black flex items-center justify-center border border-[#2e2a7e] shadow-md">
                <Image
                  src="/logo.png"
                  alt="FixToFlex Logo"
                  width={48}
                  height={48}
                  className="h-[48px] object-contain transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
              <span className="font-extrabold text-[24px] tracking-tight bg-gradient-to-r from-[#22C55E] via-[#7C3AED] to-[#4F46E5] bg-clip-text text-transparent">
                FixToFlex
              </span>
            </Link>

            {/* Mobile Hamburger toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="lg:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
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
                    setIsMobileMenuOpen(false);
                  }}
                  variants={buttonVariants}
                  initial="initial"
                  animate={isActive ? "active" : "initial"}
                  whileHover={isActive ? "hoverActive" : "hover"}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold tracking-wide relative overflow-hidden group cursor-pointer ${
                    isActive 
                      ? "bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] text-white shadow-lg" 
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
                  <span className="truncate">{item.name}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Banner Card */}
        <div className={`mt-8 ${isMobileMenuOpen ? "block" : "hidden lg:block"}`}>
          <div className="relative rounded-2xl bg-gradient-to-tr from-[#1b174b] to-[#241e6b] border border-[#2e2a7e] p-5 overflow-hidden shadow-lg group">
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
        </div>
      </aside>

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
                {/* Demo banner indicator */}
                {isDemoMode && (
                  <span className="text-[11px] font-bold bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-1 rounded-full hidden xs:inline-block">
                    Demo Mode
                  </span>
                )}
                
                <button
                  onClick={handleLinkedInLogin}
                  disabled={isLoggingIn}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-white bg-slate-50 hover:bg-[#0A66C2] border border-slate-200 hover:border-[#0A66C2] rounded-xl transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4 fill-[#0A66C2] group-hover:fill-white shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span>{isLoggingIn ? "Connecting..." : "Login"}</span>
                </button>

                <button
                  onClick={handleLinkedInLogin}
                  className="bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Get Started
                </button>
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
                        <div className="h-[1px] bg-slate-100 w-full" />
                        <button
                          onClick={() => {
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
                  
                  {/* GLASSMORPHIC PRIMARY WRITER CARD (Centered in layout) */}
                  <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 lg:p-10 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
                    
                    {/* Floating orbs specific to this card */}
                    <div className="absolute top-[-40px] left-[10%] w-24 h-24 bg-purple-100 rounded-full blur-2xl opacity-60 pointer-events-none" />
                    <div className="absolute bottom-[-40px] right-[10%] w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

                    {/* Middle Circular User Icon decoration */}
                    <div className="w-14 h-14 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 shadow-sm">
                      <User className="w-6 h-6" />
                    </div>

                    {/* Titles */}
                    <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-800 leading-tight">
                      Welcome Back! 👋
                    </h2>
                    <p className="text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] bg-clip-text text-transparent mt-2 tracking-tight">
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
                            <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                              <User className="w-4 h-4" />
                            </div>
                            <div className="h-2 w-16 bg-slate-100 rounded-full" />
                            <div className="h-1.5 w-12 bg-slate-50/80 rounded-full" />
                          </div>
                          
                          {/* Progress bar in graphic */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[8px] font-bold text-slate-400">
                              <span>STRENGTH</span>
                              <span className="text-purple-600">82%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden w-full">
                              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full w-[82%]" />
                            </div>
                          </div>
                        </div>

                        {/* Mockup Checklist Details */}
                        <div className="bg-white rounded-xl border border-slate-100 p-3 shadow-xs flex flex-col justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                              <User className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 h-2 bg-slate-100 rounded-full" />
                          </div>
                          
                          {/* Checked lines */}
                          <div className="space-y-2 py-1">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
                                  <Check className="w-2 h-2" />
                                </span>
                                <div className="h-1.5 flex-1 bg-slate-50 rounded-full" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Small plant decoration graphic in corner */}
                      <div className="absolute bottom-2 right-2 w-10 h-10 pointer-events-none opacity-90 flex items-end justify-center">
                        <div className="w-3 h-4 bg-purple-200/80 rounded-t-full relative">
                          <div className="absolute -top-2 left-[-4px] w-2 h-3 bg-purple-400 rounded-full transform -rotate-45" />
                          <div className="absolute -top-3 right-[-4px] w-2.5 h-3.5 bg-purple-300 rounded-full transform rotate-45" />
                        </div>
                        <div className="w-5 h-3 bg-slate-200 border border-slate-300/50 rounded-b-md" />
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

                    {/* Main CTA */}
                    <button 
                      onClick={() => setIsEditModalOpen(true)}
                      className="px-8 py-3.5 bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] hover:from-[#6D28D9] hover:to-[#4338CA] text-white font-bold rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group text-sm"
                    >
                      <span>Update Profile</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    {/* Bottom Security Note */}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold mt-4">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Your data is safe and secure with us.</span>
                    </div>

                  </div>

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
                <motion.div
                  key="job-tracker"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col gap-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">Job Application Tracker</h2>
                      <p className="text-xs text-slate-400">Organize and monitor all active job submissions.</p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { name: "Applied", val: 12, color: "border-blue-100 text-blue-600 bg-blue-50/30" },
                      { name: "Interview", val: 3, color: "border-indigo-100 text-indigo-600 bg-indigo-50/30" },
                      { name: "Shortlisted", val: 2, color: "border-amber-100 text-amber-600 bg-amber-50/30" },
                      { name: "Offer", val: 1, color: "border-emerald-100 text-emerald-600 bg-emerald-50/30" },
                    ].map((stat, idx) => (
                      <div key={idx} className={`p-3 rounded-2xl border text-center ${stat.color}`}>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{stat.name}</span>
                        <span className="text-xl font-extrabold block mt-1">{stat.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Mock Jobs Table */}
                  <div className="border border-slate-100 rounded-2xl overflow-hidden mt-2">
                    <div className="bg-slate-50 border-b border-slate-100 p-3 grid grid-cols-[1.5fr_1fr_1fr] text-[10px] font-bold text-slate-400 uppercase">
                      <span>Company / Role</span>
                      <span>Date Applied</span>
                      <span>Status</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {[
                        { company: "Google", role: "Software Engineer", date: "June 12, 2026", status: "Interview", tag: "bg-indigo-50 text-indigo-600 border-indigo-100" },
                        { company: "Microsoft", role: "SDE Intern", date: "June 08, 2026", status: "Shortlisted", tag: "bg-amber-50 text-amber-600 border-amber-100" },
                        { company: "Swiggy", role: "Backend Developer", date: "June 04, 2026", status: "Applied", tag: "bg-blue-50 text-blue-600 border-blue-100" },
                      ].map((job, idx) => (
                        <div key={idx} className="p-3 grid grid-cols-[1.5fr_1fr_1fr] items-center text-xs font-semibold text-slate-600">
                          <div>
                            <span className="font-bold text-slate-800 block">{job.role}</span>
                            <span className="text-[10px] text-slate-400">{job.company}</span>
                          </div>
                          <span>{job.date}</span>
                          <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold self-start text-center max-w-[90px] ${job.tag}`}>
                            {job.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
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
                          <button className="px-3.5 py-1.5 bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] text-white text-[10px] font-bold rounded-lg transition-all shadow-sm">
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
                      <div><span className="text-slate-400">Subject:</span> Application for SWE Intern - Arjun Kumar</div>
                      <hr className="border-slate-200/50 my-2" />
                      <p>Dear Hiring Manager,</p>
                      <p>I recently upgraded my profile for Software Engineering positions, aligning my project details with Google's core stack. I would love to connect to discuss active SDE internship opportunities...</p>
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
                    {user?.full_name?.charAt(0) || "A"}
                  </div>
                )}
              </div>

              {/* Profile Name & Title */}
              <h3 className="text-md font-extrabold text-slate-800 mt-4 leading-tight">
                {user?.full_name || "Arjun Kumar"}
              </h3>
              <p className="text-xs text-slate-400 font-bold mt-1">
                {user?.headline || "Software Engineer"}
              </p>

              {/* Quick links list */}
              <div className="w-full flex flex-col gap-2 mt-6">
                
                {/* 1. Edit Profile */}
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-slate-100 hover:border-purple-200 bg-slate-50/50 hover:bg-white rounded-2xl text-xs font-bold text-slate-600 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#7C3AED]"><User className="w-4 h-4" /></span>
                    <span>Edit My Profile</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 2. LinkedIn Link */}
                <a
                  href={formData.linkedin_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-4 py-3 border border-slate-100 hover:border-purple-200 bg-slate-50/50 hover:bg-white rounded-2xl text-xs font-bold text-slate-600 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#0A66C2]"><LinkedInIcon className="w-4 h-4 fill-[#0A66C2]" /></span>
                    <span className="truncate max-w-[180px]">Add LinkedIn Profile URL</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* 3. GitHub Link */}
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-slate-100 hover:border-purple-200 bg-slate-50/50 hover:bg-white rounded-2xl text-xs font-bold text-slate-600 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-800"><GitHubIcon className="w-4 h-4 fill-slate-800" /></span>
                    <span className="truncate max-w-[180px]">
                      {formData.github_url ? "GitHub Profile Added" : "Add GitHub Profile URL"}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 4. Portfolio Link */}
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-slate-100 hover:border-purple-200 bg-slate-50/50 hover:bg-white rounded-2xl text-xs font-bold text-slate-600 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-500"><Globe className="w-4 h-4" /></span>
                    <span className="truncate max-w-[180px]">
                      {formData.portfolio_url ? "Portfolio Added" : "Add Portfolio URL"}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 5. Upload Resume Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-between px-4 py-3 border border-slate-100 hover:border-purple-200 bg-slate-50/50 hover:bg-white rounded-2xl text-xs font-bold text-slate-600 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-purple-600"><FileText className="w-4 h-4" /></span>
                    <span className="truncate max-w-[180px]">
                      {resumeUrl ? "Upload New Resume" : "Add Resume"}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
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

      {/* 5. EDIT PROFILE FORM MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 lg:p-8 max-w-lg w-full flex flex-col gap-6"
            >
              
              {/* Modal Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Edit Your Profile</h3>
                  <p className="text-xs text-slate-400">Provide details for AI scoring and outreach matchmaking.</p>
                </div>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form body */}
              <form onSubmit={handleSaveProfile} className="space-y-4">
                
                {/* 1. Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200/80 focus:border-[#7C3AED] rounded-xl px-3.5 py-2 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all"
                    placeholder="e.g. Arjun Kumar"
                  />
                </div>

                {/* 2. Headline */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Headline / Job Title</label>
                  <input
                    type="text"
                    required
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200/80 focus:border-[#7C3AED] rounded-xl px-3.5 py-2 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all"
                    placeholder="e.g. Software Engineer"
                  />
                </div>

                {/* 3. LinkedIn Link */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    required
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200/80 focus:border-[#7C3AED] rounded-xl px-3.5 py-2 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                {/* 4. GitHub Link */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">GitHub URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200/80 focus:border-[#7C3AED] rounded-xl px-3.5 py-2 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all"
                    placeholder="https://github.com/username"
                  />
                </div>

                {/* 5. Portfolio Link */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Portfolio Website URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.portfolio_url}
                    onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200/80 focus:border-[#7C3AED] rounded-xl px-3.5 py-2 text-xs font-semibold placeholder-slate-400 focus:outline-none transition-all"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                {/* Footer action buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-5 py-2 bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] hover:from-[#6D28D9] hover:to-[#4338CA] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-indigo-500/10 transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSavingProfile && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Changes</span>
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
