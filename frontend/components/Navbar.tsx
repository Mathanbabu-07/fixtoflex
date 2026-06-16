"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[80px] bg-white/70 backdrop-blur-md border-b border-purple-100/30 flex items-center justify-between px-6 md:px-12 transition-all">
      {/* Logo and Brand */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="relative h-[60px] w-[60px] overflow-hidden rounded-xl bg-black flex items-center justify-center border border-slate-200/50 shadow-md">
          <Image
            src="/logo.jpeg"
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
        <button
          className="flex items-center gap-1 text-[18px] font-medium text-slate-600 hover:text-[#4F46E5] transition-colors duration-200"
        >
          Login <ChevronDown className="w-4 h-4 mt-0.5" />
        </button>

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
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between text-[18px] font-medium text-slate-700 hover:text-[#4F46E5] py-2 border-b border-slate-100 text-left"
          >
            <span>Login</span>
            <ChevronDown className="w-4 h-4" />
          </button>
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
