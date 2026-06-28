"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";

interface CandidateResult {
  filename: string;
  file_size: string;
  candidate_name: string;
  match_score: number;
  strengths: string[];
  weaknesses: string[];
  matched_skills: string[];
  missing_skills: string[];
  fit_summary: string;
}

export default function RecruiterDashboard() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authentication states
  const [sessionLoading, setSessionLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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

  // Matching states
  const [isMatching, setIsMatching] = useState(false);
  const [matchResults, setMatchResults] = useState<CandidateResult[]>([]);
  const [hasMatched, setHasMatched] = useState(false);
  const [matchError, setMatchError] = useState("");

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
  }, []);

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

    try {
      const apiEndpoint = getApiUrl("/recruiter/match");
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
        resumes: uploadedResumes
      };

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
        credentials: "include"
      });

      if (response.ok) {
        const matchData = await response.json();
        setMatchResults(matchData.results || []);
        setHasMatched(true);
        
        // Smooth scroll to results
        setTimeout(() => {
          const element = document.getElementById("matching-results-section");
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        const errDetail = await response.json();
        setMatchError(errDetail.detail || "Failed to match resumes.");
      }
    } catch (err: any) {
      console.error("Matching error:", err);
      setMatchError(err.message || "A network error occurred while matching resumes.");
    } finally {
      setIsMatching(false);
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
                Our AI analyzes skills, experience, and potential to find the best matching candidates for your job opening.
              </p>

              <ul className="space-y-3.5 mb-6">
                {[
                  "Semantic Skill Matching",
                  "Experience Level Analysis",
                  "Resume Intelligence",
                  "Cultural Fit Insights"
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
                  More accurate matches save you time and effort.
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
                  Upload multiple resumes (PDF/DOC/DOCX) to find the best matches.
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
        <div className="mt-12 flex flex-col items-center justify-center space-y-4 border-t border-slate-100 pt-8">
          
          {matchError && (
            <div className="px-4 py-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-2 text-xs font-bold text-rose-600">
              <AlertCircle className="w-4 h-4" />
              <span>{matchError}</span>
            </div>
          )}

          <div className="relative">
            <button
              onClick={handleFindBetterMatch}
              disabled={!isFormValid() || isMatching}
              className={`px-8 py-4 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] hover:from-[#6D28D9] hover:to-[#4338CA] text-white text-base font-extrabold rounded-2xl shadow-md hover:shadow-lg active:scale-98 transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isMatching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Matching Resumes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Find Better Match</span>
                </>
              )}
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
              <div className="mb-8 text-left">
                <h3 className="text-2xl font-extrabold text-[#1E1B4B]">
                  AI Matching Candidates <span className="text-[#7C3AED]">({matchResults.length})</span>
                </h3>
                <p className="text-xs font-medium text-slate-400 mt-1">
                  Ranked in order of compatibility against your requirements.
                </p>
              </div>

              {/* Match Results list */}
              <div className="space-y-6">
                {matchResults.map((result, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs flex flex-col md:flex-row justify-between gap-6 hover:shadow-md hover:border-purple-100/50 transition-all duration-300"
                  >
                    
                    {/* Candidate Details (Left / Main) */}
                    <div className="flex-1 space-y-4">
                      
                      {/* Name and Match Score badge */}
                      <div className="flex items-center justify-between md:justify-start gap-4">
                        <h4 className="text-lg font-extrabold text-[#1E1B4B]">
                          {result.candidate_name}
                        </h4>
                        
                        {/* Radial progress score fallback badge */}
                        <div className="px-3.5 py-1 bg-purple-50 border border-purple-100 text-[#7C3AED] text-xs font-extrabold rounded-full">
                          {result.match_score}% Match
                        </div>
                      </div>

                      {/* Brief Recruiter Summary */}
                      <p className="text-xs text-slate-500 leading-relaxed font-medium bg-slate-50/50 p-4 border border-slate-100 rounded-2xl">
                        {result.fit_summary}
                      </p>

                      {/* Skills Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
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

                      </div>

                    </div>

                    {/* Strengths & Weaknesses (Right sidebar in card) */}
                    <div className="w-full md:w-[260px] md:border-l border-slate-100 md:pl-6 space-y-4 shrink-0">
                      
                      {/* Strengths */}
                      <div className="space-y-2 text-left">
                        <span className="text-[10px] font-bold text-[#1E1B4B] uppercase tracking-wider block">
                          Key Strengths
                        </span>
                        <ul className="space-y-1.5">
                          {result.strengths.map((str, sidx) => (
                            <li key={sidx} className="text-[11px] font-semibold text-slate-600 leading-normal flex items-start gap-1.5">
                              <span className="text-emerald-500 text-xs -mt-1px">•</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Weaknesses */}
                      <div className="space-y-2 text-left">
                        <span className="text-[10px] font-bold text-[#1E1B4B] uppercase tracking-wider block">
                          Areas to Explore
                        </span>
                        <ul className="space-y-1.5">
                          {result.weaknesses.map((weak, sidx) => (
                            <li key={sidx} className="text-[11px] font-semibold text-slate-600 leading-normal flex items-start gap-1.5">
                              <span className="text-rose-500 text-xs -mt--1px">•</span>
                              <span>{weak}</span>
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