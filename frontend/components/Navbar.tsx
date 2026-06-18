"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X, User, LogOut, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  full_name?: string;
  profile_picture?: string;
  role?: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [mobileLoginOpen, setMobileLoginOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

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

  useEffect(() => {
    const fetchSession = async () => {
      try {
        console.log("[SESSION CHECK] Attempting to check active session...");
        const localSession = localStorage.getItem("user_session");
        if (localSession) {
          try {
            const parsed = JSON.parse(localSession);
            console.log("[SESSION CHECK] Found cached session in localStorage:", parsed);
            setUser(parsed);
          } catch (e) {
            console.error("[SESSION CHECK ERROR] Failed to parse local user session:", e);
          }
        }

        const apiEndpoint = getApiUrl("/users/me");
        console.log("[SESSION CHECK] Fetching user profile from backend:", apiEndpoint);
        const response = await fetch(apiEndpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        console.log("[SESSION CHECK] Backend user/me status response:", response.status);
        if (response.ok) {
          const userData = await response.json();
          console.log("[SESSION CHECK] Backend session is active. User profile:", userData);
          const normalizedUser: UserProfile = {
            id: userData.id,
            email: userData.email,
            full_name: userData.full_name,
            name: userData.full_name,
            profile_picture: userData.profile_picture,
            role: userData.role,
          };
          setUser(normalizedUser);
          localStorage.setItem("user_session", JSON.stringify(normalizedUser));
        } else {
          console.log("[SESSION CHECK] Backend session is inactive/expired. Cleaning local credentials.");
          setUser(null);
          localStorage.removeItem("user_session");
        }
      } catch (error) {
        console.warn("[SESSION CHECK ERROR] Error fetching active session from backend (offline or server error):", error);
      }
    };

    fetchSession();
  }, []);

  const handleLinkedInLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("[STEP 1] Login button clicked - Triggering LinkedIn OAuth Flow");
    if (isLoggingIn) {
      console.log("[STEP 1] Blocked: Login request is already in progress");
      return;
    }
    setIsLoggingIn(true);
    try {
      const apiEndpoint = getApiUrl("/auth/linkedin/login");
      console.log("[STEP 2] Calling backend login initialization:", apiEndpoint);
      const response = await fetch(apiEndpoint);
      
      console.log("[STEP 2] Received response status from backend:", response.status);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to retrieve LinkedIn login authorization URL.");
      }
      
      const data = await response.json();
      console.log("[STEP 3] Received auth_url from backend:", data.auth_url);
      
      if (data.auth_url) {
        console.log("[STEP 4] Redirecting browser window.location.href to LinkedIn authorization page...");
        window.location.href = data.auth_url;
        console.log("[STEP 5] Redirect command successfully sent to window.location.href");
      } else {
        throw new Error("Authorization URL (auth_url) was missing from the backend response payload.");
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error("[LOGIN FLOW ERROR] Exception caught during LinkedIn OAuth initialization:", err);
      alert(`Unable to start LinkedIn login. Error: ${err.message || err}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    console.log("[LOGOUT] Logout button clicked - Triggering session destruction");
    if (isLoggingOut) {
      console.log("[LOGOUT] Blocked: Logout request is already in progress");
      return;
    }
    setIsLoggingOut(true);
    try {
      const apiEndpoint = getApiUrl("/auth/logout");
      console.log("[LOGOUT] Calling backend logout endpoint:", apiEndpoint);
      const response = await fetch(apiEndpoint, {
        method: "POST",
        credentials: "include",
      });

      console.log("[LOGOUT] Received response status from backend:", response.status);
      if (response.ok) {
        console.log("[LOGOUT] Session cleared successfully on backend. Cleaning local state...");
        localStorage.removeItem("user_session");
        setUser(null);
        setShowProfileDropdown(false);
      } else {
        const errText = await response.text();
        console.warn("[LOGOUT WARNING] Backend logout returned non-OK status. Details:", errText);
        // Fallback local cleanup even if backend reports failure
        localStorage.removeItem("user_session");
        setUser(null);
        setShowProfileDropdown(false);
        alert("Logout completed with local state cleanup (backend reported an error).");
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error("[LOGOUT ERROR] Exception caught during session logout:", error);
      // Ensure local state cleanup so the user is never stuck in logged-in state
      localStorage.removeItem("user_session");
      setUser(null);
      setShowProfileDropdown(false);
      alert(`Logout completed with local state cleanup (connection error: ${error.message || error}).`);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[80px] bg-white/70 backdrop-blur-md border-b border-purple-100/30 flex items-center justify-between px-6 md:px-12 transition-all">
      {/* Logo and Brand */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="relative h-[60px] w-[60px] overflow-hidden rounded-xl bg-black flex items-center justify-center border border-slate-200/50 shadow-md">
          <Image
            src="/logo.png"
            alt="FixToFlex Logo"
            width={60}
            height={60}
            style={{ width: "auto", height: "auto" }}
            className="h-[60px] object-contain transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </div>
        <span className="font-extrabold text-[34px] tracking-tight bg-gradient-to-r from-[#22C55E] via-[#7C3AED] to-[#4F46E5] bg-clip-text text-transparent transition-all duration-300 group-hover:brightness-110">
          FixToFlex
        </span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-10">
        <Link
          href="/candidate"
          className="text-[18px] font-medium text-slate-600 hover:text-[#4F46E5] transition-colors duration-200"
        >
          Candidate
        </Link>
        <Link
          href="#recruiter"
          className="text-[18px] font-medium text-slate-600 hover:text-[#4F46E5] transition-colors duration-200"
        >
          Recruiter
        </Link>
        <Link
          href="#about"
          className="text-[18px] font-medium text-slate-600 hover:text-[#4F46E5] transition-colors duration-200"
        >
          About Us
        </Link>

        {!user ? (
          <>
            {/* Login Dropdown Wrapper */}
            <div 
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button
                className="flex items-center gap-1 text-[18px] font-medium text-slate-600 hover:text-[#4F46E5] transition-colors duration-200 py-2 cursor-pointer focus:outline-none"
              >
                Login <ChevronDown className={`w-4 h-4 mt-0.5 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 mt-1.5 w-[230px] rounded-xl bg-white border border-slate-100 shadow-xl p-3 z-50 origin-top-right"
                  >
                    <button
                      onClick={handleLinkedInLogin}
                      disabled={isLoggingIn}
                      className="group flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-slate-700 hover:text-white bg-slate-50 hover:bg-[#0A66C2] border border-slate-200/50 hover:border-[#0A66C2] transition-all duration-300 font-semibold text-sm shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50"
                    >
                      {/* Official LinkedIn SVG logo */}
                      <svg 
                        className="w-5 h-5 shrink-0 fill-[#0A66C2] group-hover:fill-white transition-colors duration-300" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      <span>{isLoggingIn ? "Connecting..." : "Login with LinkedIn"}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Small CTA matching the dashboard */}
            <Link
              href="#get-started"
              className="bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] hover:from-[#6D28D9] hover:to-[#4338CA] text-white font-medium px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </>
        ) : (
          /* Logged In User Profile Dropdown */
          <div 
            className="relative"
            onMouseEnter={() => setShowProfileDropdown(true)}
            onMouseLeave={() => setShowProfileDropdown(false)}
          >
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-3 py-1 px-2.5 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200 cursor-pointer focus:outline-none"
            >
              {user.profile_picture ? (
                <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-purple-200/80 shadow-sm">
                  <Image
                    src={user.profile_picture}
                    alt={user.full_name || user.name || "LinkedIn Profile"}
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
              <span className="font-semibold text-slate-700 text-sm hidden lg:inline-block">
                {user.full_name || user.name}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${showProfileDropdown ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-[380px] rounded-2xl bg-white border border-slate-100/80 shadow-xl p-4 z-50 origin-top-right animate-fade-in"
                >
                  {/* Horizontal dropdown container for profile info + real logout */}
                  <div className="flex items-center justify-between gap-4">
                    {/* Left: Avatar + Details */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {user.profile_picture ? (
                        <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden border border-purple-100 shadow-sm">
                          <Image
                            src={user.profile_picture}
                            alt={user.full_name || user.name || "User Photo"}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 shrink-0 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 text-purple-700 font-bold text-sm">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                      <div className="text-left truncate">
                        <h4 className="text-sm font-bold text-slate-800 leading-tight truncate">
                          {user.full_name || user.name}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                          {user.email}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100/60 text-indigo-700 text-[10px] font-bold tracking-wide capitalize">
                          {user.role || "Candidate"}
                        </span>
                      </div>
                    </div>

                    {/* Middle divider */}
                    <div className="w-[1px] h-12 bg-slate-100 shrink-0" />

                    {/* Right: Horizontal/Side Logout Button */}
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-100 hover:border-rose-600 rounded-xl transition-all duration-200 active:scale-[0.97] shrink-0 cursor-pointer disabled:opacity-50 shadow-sm"
                    >
                      {isLoggingOut ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-slate-700 hover:text-[#4F46E5] focus:outline-none"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-[80px] left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-slate-200/50 flex flex-col py-6 px-6 gap-6 shadow-xl animate-fade-in md:hidden">
          <Link
            href="/candidate"
            onClick={() => setIsOpen(false)}
            className="text-[18px] font-medium text-slate-700 hover:text-[#4F46E5] py-2 border-b border-slate-100"
          >
            Candidate
          </Link>
          <Link
            href="#recruiter"
            onClick={() => setIsOpen(false)}
            className="text-[18px] font-medium text-slate-700 hover:text-[#4F46E5] py-2 border-b border-slate-100"
          >
            Recruiter
          </Link>
          <Link
            href="#about"
            onClick={() => setIsOpen(false)}
            className="text-[18px] font-medium text-slate-700 hover:text-[#4F46E5] py-2 border-b border-slate-100"
          >
            About Us
          </Link>
          
          {!user ? (
            <>
              <div className="w-full">
                <button
                  onClick={() => setMobileLoginOpen(!mobileLoginOpen)}
                  className="flex items-center justify-between w-full text-[18px] font-medium text-slate-700 hover:text-[#4F46E5] py-2 border-b border-slate-100 text-left cursor-pointer focus:outline-none"
                >
                  <span>Login</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileLoginOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileLoginOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden mt-2 px-2"
                    >
                      <button
                        disabled={isLoggingIn}
                        onClick={(e) => {
                          setIsOpen(false);
                          setMobileLoginOpen(false);
                          handleLinkedInLogin(e);
                        }}
                        className="group flex items-center gap-2.5 w-full px-3.5 py-3 rounded-lg text-slate-700 hover:text-white bg-slate-50 hover:bg-[#0A66C2] border border-slate-200/50 hover:border-[#0A66C2] transition-all duration-300 font-semibold text-sm shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        <svg className="w-5 h-5 shrink-0 fill-[#0A66C2] group-hover:fill-white transition-colors duration-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        <span>{isLoggingIn ? "Connecting..." : "Login with LinkedIn"}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link
                href="#get-started"
                onClick={() => setIsOpen(false)}
                className="bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] text-white text-center font-medium py-3 rounded-xl shadow-md"
              >
                Get Started
              </Link>
            </>
          ) : (
            <div className="flex flex-col gap-4 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-3">
                {user.profile_picture ? (
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border border-purple-100 shadow-sm">
                    <Image
                      src={user.profile_picture}
                      alt={user.full_name || user.name || "User Photo"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 text-purple-700 font-bold text-sm">
                    <User className="w-6 h-6" />
                  </div>
                )}
                <div className="text-left">
                  <h4 className="font-bold text-slate-800 text-sm">{user.full_name || user.name}</h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-100 hover:border-rose-600 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
