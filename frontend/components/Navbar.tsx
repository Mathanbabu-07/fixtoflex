"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileLoginOpen, setMobileLoginOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLinkedInLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("[STEP 1] Login button clicked");
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const response = await fetch("http://localhost:8000/auth/linkedin/login");
      if (!response.ok) {
        throw new Error("Failed to retrieve LinkedIn login authorization URL.");
      }
      const data = await response.json();
      console.log("[STEP 2] Auth URL received:", data.auth_url);
      if (data.auth_url) {
        console.log("[STEP 3] Redirecting to LinkedIn");
        window.location.href = data.auth_url;
      } else {
        throw new Error("Authorization URL was missing from backend response.");
      }
    } catch (error) {
      console.error("Error triggering LinkedIn OAuth redirect:", error);
      alert("Unable to start LinkedIn login. Check that the FastAPI server is running on localhost:8000.");
    } finally {
      setIsLoggingIn(false);
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
            style={{ width: "auto" }}
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
          href="#candidate"
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
            href="#candidate"
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
        </div>
      )}
    </nav>
  );
}
