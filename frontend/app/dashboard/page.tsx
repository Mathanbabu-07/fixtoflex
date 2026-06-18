"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  LogOut, 
  User, 
  Sparkles, 
  Briefcase, 
  TrendingUp, 
  BookOpen, 
  ChevronRight, 
  Loader2, 
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  profile_picture?: string;
  role: string;
  linkedin_id?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch current user details from backend using local cookie session
        const response = await fetch("http://localhost:8000/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // CRITICAL: Sends the HttpOnly JWT session cookie
        });

        if (!response.ok) {
          throw new Error("Session invalid or unauthorized.");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.warn("Unauthenticated dashboard access attempt. Redirecting back to home.", error);
        // Clear potential stale localStorage
        localStorage.removeItem("user_session");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const response = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include", // Send cookie to clear it
      });

      if (response.ok) {
        localStorage.removeItem("user_session");
        router.push("/");
      } else {
        alert("Logout failed. Please reload and try again.");
      }
    } catch (err) {
      console.error("Logout request error:", err);
      // Fallback redirect
      localStorage.removeItem("user_session");
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#7C3AED] animate-spin" />
          <p className="text-slate-500 font-medium text-sm">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Premium Dashboard Header */}
      <header className="fixed top-0 left-0 right-0 h-[80px] bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-12 z-40">
        <div className="flex items-center gap-3 group">
          <div className="relative h-[50px] w-[50px] overflow-hidden rounded-xl bg-black flex items-center justify-center border border-slate-200/50 shadow-md">
            <Image
              src="/logo.png"
              alt="FixToFlex Logo"
              width={50}
              height={50}
              style={{ width: "auto" }}
              className="h-[50px] object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-[#22C55E] via-[#7C3AED] to-[#4F46E5] bg-clip-text text-transparent transition-all duration-300 group-hover:brightness-110">
            FixToFlex
          </span>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold tracking-wide">
            WORKSPACE
          </span>
        </div>

        <div className="flex items-center gap-6">
          {/* User profile identifier */}
          <div className="flex items-center gap-3">
            {user.profile_picture ? (
              <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-purple-200 shadow-sm">
                <Image
                  src={user.profile_picture}
                  alt={user.full_name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 text-purple-700 font-bold text-sm">
                <User className="w-5 h-5" />
              </div>
            )}
            <div className="hidden md:block text-left">
              <h4 className="text-sm font-semibold text-slate-800 leading-tight">{user.full_name}</h4>
              <p className="text-xs text-slate-500 font-medium capitalize">{user.role}</p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200/60 hover:border-rose-100 rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto pt-[110px] pb-16 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[65%_35%] gap-8">
        
        {/* Left Column: Applications & AI Feedback Panels */}
        <div className="space-y-8">
          
          {/* Welcome Panel */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                AI Recommendation Engine Live
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">
                Welcome back, {user.full_name}!
              </h1>
              <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
                Your LinkedIn integration is active. FixToFlex has synced your career background. Let&apos;s close your remaining skill gaps and flex on recruiters.
              </p>
            </div>
            
            {/* Quick Profile Score Mockup */}
            <div className="bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] rounded-2xl p-5 text-white flex flex-col items-center justify-center w-full md:w-[150px] shadow-md shadow-indigo-100/50">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Profile Score</span>
              <span className="text-4xl font-extrabold mt-1">87%</span>
              <span className="text-[10px] font-semibold mt-2 px-2 py-0.5 bg-white/20 rounded-full">Good Fit</span>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Apps</p>
                <h3 className="text-xl font-bold text-slate-800 mt-0.5">5 Applications</h3>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interview Readiness</p>
                <h3 className="text-xl font-bold text-slate-800 mt-0.5">72% Completed</h3>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Closed Gaps</p>
                <h3 className="text-xl font-bold text-slate-800 mt-0.5">3 / 5 Resolved</h3>
              </div>
            </div>
          </div>

          {/* Action Hub Widget */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">Next Recommended Actions</h3>
              <span className="text-xs font-semibold text-[#7C3AED] hover:underline cursor-pointer">View All</span>
            </div>
            
            <div className="divide-y divide-slate-100">
              <div className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="h-2.5 w-2.5 rounded-full bg-purple-500 mt-2 shrink-0 animate-pulse" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Optimize your Resume for Senior Engineer Role</h4>
                    <p className="text-slate-400 text-xs mt-1">LinkedIn profile match highlights 3 missing keywords: System Architecture, Docker, and CI/CD Pipelines.</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>

              <div className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Mock Interview prep: System Design Round</h4>
                    <p className="text-slate-400 text-xs mt-1">Generated matching session for scale architectures based on target job openings in your tracker.</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Profile Information & Settings */}
        <div className="space-y-8">
          
          {/* Identity Mapping Panel */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 text-lg border-b border-slate-50 pb-3">Session Configuration</h3>
            
            <div className="space-y-4">
              {/* LinkedIn status */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/50">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 fill-[#0A66C2]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <div>
                    <p className="text-xs font-bold text-slate-700">LinkedIn Linked</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{user.linkedin_id || "Mock Authentication"}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">ACTIVE</span>
              </div>

              {/* Base user metadata details */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Registered Name</label>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{user.full_name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Account Email</label>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{user.email}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Workspace Role</label>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5 capitalize">{user.role}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">User ID (UUID)</label>
                  <p className="text-xs font-medium text-slate-500 font-mono mt-0.5 break-all select-all">{user.id}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Database Synchronization Status widget */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Supabase Linked</h4>
                <p className="text-slate-400 text-xs mt-0.5">Profiles table synchronized.</p>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
