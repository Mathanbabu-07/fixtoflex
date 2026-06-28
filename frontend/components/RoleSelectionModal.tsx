"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ArrowRight, 
  Shield, 
  GraduationCap, 
  Briefcase, 
  Loader2, 
  Sparkles,
  Users
} from "lucide-react";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoleSelectionModal({ isOpen, onClose }: RoleSelectionModalProps) {
  const router = useRouter();
  const [modalStage, setModalStage] = useState<"role-select" | "recruiter-soon">("role-select");
  const [selectedRole, setSelectedRole] = useState<"candidate" | "recruiter" | null>(null);
  const [isCandidateLoading, setIsCandidateLoading] = useState(false);
  const [isRecruiterLoading, setIsRecruiterLoading] = useState(false);

  // Reset stage and states when modal closes or opens
  useEffect(() => {
    if (!isOpen) {
      // Delay reset slightly to prevent flash during close animation
      const timer = setTimeout(() => {
        setModalStage("role-select");
        setSelectedRole(null);
        setIsCandidateLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleCandidateClick = () => {
    setSelectedRole("candidate");
    setIsCandidateLoading(true);
    
    // Simulate loading/glowing for 300ms, then close and navigate
    setTimeout(() => {
      onClose();
      router.push("/candidate");
    }, 450);
  };

  const handleRecruiterClick = () => {
    setSelectedRole("recruiter");
    setIsRecruiterLoading(true);
    setTimeout(() => {
      onClose();
      router.push("/recruiter");
    }, 450);
  };

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0c0a21]/50 backdrop-blur-md"
          />

          {/* Modal Container */}
          <AnimatePresence mode="wait">
            {modalStage === "role-select" ? (
              /* ========================================== */
              /* STAGE 1: ROLE SELECTION MODAL              */
              /* ========================================== */
              <motion.div
                key="role-select-modal"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                className="relative w-full max-w-4xl bg-white rounded-3xl shadow-[0_24px_70px_rgba(124,58,237,0.15)] border border-purple-100/80 p-6 md:p-10 overflow-hidden z-10"
              >
                {/* Decorative background gradients */}
                <div className="absolute top-0 left-0 w-48 h-48 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-2xs hover:shadow-md cursor-pointer transition-all duration-300 group"
                  aria-label="Close modal"
                >
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                </button>

                {/* Modal Header */}
                <div className="flex flex-col items-center text-center space-y-4 mb-8">
                  {/* Small badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100/60 shadow-2xs text-purple-700 text-xs font-semibold select-none">
                    <Users className="w-3.5 h-3.5" />
                    <span>Let&apos;s Personalize Your Experience</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E1B4B] tracking-tight">
                    Who <span className="bg-clip-text text-transparent bg-linear-to-r from-[#7C3AED] to-[#4F46E5]">Am I?</span>
                  </h2>

                  {/* Subtitle */}
                  <p className="max-w-md text-sm md:text-base text-slate-500 font-medium leading-relaxed">
                    Choose your role to personalize your dashboard and unlock the right features for your journey.
                  </p>
                </div>

                {/* Role Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  
                  {/* Card 1: Candidate */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ y: -4 }}
                    className={`relative flex flex-col items-center text-center p-6 rounded-2xl border transition-all duration-300 bg-white/50 backdrop-blur-xs select-none ${
                      selectedRole === "candidate"
                        ? "border-[#7C3AED] shadow-[0_0_20px_rgba(124,58,237,0.25)]"
                        : "border-slate-100 hover:border-purple-200 shadow-sm hover:shadow-md"
                    }`}
                  >
                    {/* Character Avatar Container with Graduation Cap Icon */}
                    <div className="relative w-36 h-36 mb-5 flex items-center justify-center">
                      <div className="absolute inset-0 bg-linear-to-tr from-purple-100 to-indigo-50 rounded-full scale-95" />
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border border-purple-100/50 shadow-inner">
                        <Image
                          src="/candidate_avatar.png"
                          alt="Candidate Avatar"
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                      
                      {/* Graduation Cap Badge */}
                      <div className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center text-white shadow-md">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-[#1E1B4B] mb-2.5">
                      I am a Candidate
                    </h3>
                    
                    <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium mb-6 min-h-[60px] max-w-[280px]">
                      Build your profile, optimize your resume, track applications, prepare for interviews, and land your dream job.
                    </p>

                    <button
                      onClick={handleCandidateClick}
                      disabled={isCandidateLoading}
                      className="w-full mt-auto py-3 px-5 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-80"
                    >
                      {isCandidateLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Routing...</span>
                        </>
                      ) : (
                        <>
                          <span>I&apos;m a Candidate</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </motion.div>

                  {/* Card 2: Recruiter */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ y: -4 }}
                    className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-slate-100 hover:border-purple-200 bg-white/50 backdrop-blur-xs shadow-sm hover:shadow-md transition-all duration-300 select-none"
                  >
                    {/* Character Avatar Container with Briefcase Icon */}
                    <div className="relative w-36 h-36 mb-5 flex items-center justify-center">
                      <div className="absolute inset-0 bg-linear-to-tr from-purple-100 to-indigo-50 rounded-full scale-95" />
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border border-purple-100/50 shadow-inner">
                        <Image
                          src="/recruiter_avatar.png"
                          alt="Recruiter Avatar"
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                      
                      {/* Briefcase Badge */}
                      <div className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center text-white shadow-md">
                        <Briefcase className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-[#1E1B4B] mb-2.5">
                      I am a Recruiter
                    </h3>
                    
                    <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium mb-6 min-h-[60px] max-w-[280px]">
                      Discover top talent, manage applicants, and streamline your hiring process.
                    </p>

                    <button
                      onClick={handleRecruiterClick}
                      disabled={isRecruiterLoading}
                      className="w-full mt-auto py-3 px-5 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-80"
                    >
                      {isRecruiterLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Routing...</span>
                        </>
                      ) : (
                        <>
                          <span>I&apos;m a Recruiter</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </motion.div>

                </div>

                {/* Footer Banner */}
                <div className="border-t border-slate-100 pt-5 flex items-center justify-center gap-2 text-[10px] md:text-xs text-slate-400 font-semibold select-none">
                  <Shield className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>🛡️ Your data is safe with us. We never share your information with anyone.</span>
                </div>
              </motion.div>
            ) : (
              /* ========================================== */
              /* STAGE 2: RECRUITER COMING SOON MODAL       */
              /* ========================================== */
              <motion.div
                key="recruiter-soon-modal"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                className="relative w-full max-w-xl bg-white rounded-3xl shadow-[0_24px_70px_rgba(124,58,237,0.15)] border border-purple-100/80 p-6 md:p-10 overflow-hidden z-10"
              >
                {/* Sparkle effects absolute elements */}
                <div className="absolute top-12 left-10 text-yellow-400 opacity-60">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div className="absolute bottom-16 right-12 text-purple-400 opacity-50">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>

                {/* Decorative gradients */}
                <div className="absolute inset-0 bg-linear-to-b from-purple-50/10 via-transparent to-transparent pointer-events-none" />

                {/* Coming Soon Onboarding Card Graphic */}
                <div className="flex flex-col items-center text-center space-y-6">
                  
                  {/* Floating Rocket Illustration with animation */}
                  <motion.div
                    animate={{
                      y: [0, -12, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative w-44 h-44 flex items-center justify-center select-none"
                  >
                    <Image
                      src="/rocket_illustration.png"
                      alt="Rocket Launch"
                      fill
                      className="object-contain"
                      priority
                    />
                  </motion.div>

                  {/* Heading */}
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E1B4B] tracking-tight">
                    Recruiter Portal Coming Soon! 🚀
                  </h2>

                  {/* Message */}
                  <p className="max-w-md text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
                    We&apos;re building an intelligent recruitment workspace designed to help recruiters discover, evaluate, and hire top talent faster.
                    <br />
                    <span className="block mt-2 font-bold text-purple-600">Stay tuned—it&apos;s worth the wait!</span>
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-4">
                    <button
                      onClick={onClose}
                      className="w-full sm:flex-1 py-3 px-6 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-300 cursor-pointer text-center"
                    >
                      Got It
                    </button>
                    
                    <button
                      onClick={() => setModalStage("role-select")}
                      className="w-full sm:flex-1 py-3 px-6 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 hover:text-slate-800 text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer text-center"
                    >
                      Back to Role Selection
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
