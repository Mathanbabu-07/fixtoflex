"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Briefcase, Loader2, RefreshCw, Star, MapPin, DollarSign, Building, ExternalLink, Calendar, CheckCircle2, AlertCircle, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MyTargetModal, { TargetPreferences } from "./MyTargetModal";

interface Job {
  "Job Title"?: string;
  Company?: string;
  Location?: string;
  Salary?: string;
  "Work Mode"?: string;
  "Posted Date"?: string;
  "Match %"?: string;
  "Skill Tags"?: string[];
  "Missing Skills"?: string[];
  "Short Description"?: string;
  apply_url?: string;
  job_url?: string;
  "Company Logo"?: string;
  Rating?: string;
  source?: string;
}

interface JobTrackerPanelProps {
  getApiUrl: (path: string) => string;
}

export default function JobTrackerPanel({ getApiUrl }: JobTrackerPanelProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasTracked, setHasTracked] = useState(false);
  const [isMyTargetModalOpen, setIsMyTargetModalOpen] = useState(false);

  const fetchTargetJobs = async (preferences: TargetPreferences, forceRefresh: boolean = false) => {
    setIsMyTargetModalOpen(false);
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = getApiUrl(`/job-tracker/target-jobs?force_refresh=${forceRefresh}`);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch target jobs");
      }

      const data = await response.json();
      if (data.status === "success" && data.data) {
        setJobs(data.data);
        if (data.data.length > 0) {
          setSelectedJob(data.data[0]);
        }
        setHasTracked(true);
      } else {
        throw new Error(data.message || "No matching jobs found for your selected targets. Try changing your company, role, salary, or location preferences.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred while fetching target jobs.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJobs = async (forceRefresh: boolean = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = getApiUrl(`/job-tracker/jobs?force_refresh=${forceRefresh}`);
      const response = await fetch(endpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      if (data.status === "success" && data.data) {
        setJobs(data.data);
        if (data.data.length > 0) {
          setSelectedJob(data.data[0]);
        }
        setHasTracked(true);
      } else {
        throw new Error(data.message || "Failed to parse jobs");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred while fetching jobs.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      key="job-tracker"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[800px]"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Job Application Tracker</h2>
            <p className="text-xs text-slate-400">Live AI-ranked jobs tailored to your profile.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMyTargetModalOpen(true)}
            disabled={isLoading}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm"
          >
            <Target className="w-4 h-4 text-indigo-500" />
            <span>My Target</span>
          </button>
          <button
            onClick={() => fetchJobs(true)}
            disabled={isLoading}
            className="px-4 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2 shadow-sm shadow-purple-200"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            <span>{hasTracked ? "Refresh Jobs" : "Track My Jobs"}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex relative bg-slate-50/30">
        
        {/* Empty / Initial State */}
        {!hasTracked && !isLoading && jobs.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10 bg-white/50 backdrop-blur-sm">
            <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mb-4 border border-purple-100 shadow-inner">
              <Briefcase className="w-10 h-10 text-purple-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Ready to find your next role?</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md">
              We&apos;ll automatically extract the best roles from Indeed and rank them according to your candidate profile, skills, and experience.
            </p>
            <button
              onClick={() => fetchJobs(false)}
              className="mt-6 px-6 py-3 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Start Tracking
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-white/70 backdrop-blur-md">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-100 rounded-full animate-pulse"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-[#7C3AED] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-sm font-bold text-slate-600 animate-pulse">Extracting and ranking jobs via Gemini AI...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center p-6 z-20">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center max-w-md">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <h3 className="font-bold text-red-800 mb-2">Error Fetching Jobs</h3>
              <p className="text-xs text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => fetchJobs(true)}
                className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-bold transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Two-Pane Layout */}
        {hasTracked && !isLoading && jobs.length > 0 && (
          <div className="flex w-full h-full divide-x divide-slate-100">
            
            {/* Left Pane - Job List */}
            <div className="w-[45%] h-full overflow-y-auto p-4 space-y-3 bg-slate-50/50 custom-scrollbar">
              {jobs.map((job, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedJob(job)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedJob === job 
                      ? "bg-white border-[#7C3AED] shadow-md shadow-purple-100/50 ring-1 ring-[#7C3AED]/20" 
                      : "bg-white border-slate-100 hover:border-purple-200 hover:shadow-sm"
                  }`}
                >
                  <div className="flex flex-col mb-2">
                    {job.source && (
                      <span className={`text-[9px] font-black uppercase tracking-widest mb-1.5 ${job.source === 'Internshala' ? 'text-blue-500' : 'text-indigo-600'}`}>
                        {job.source}
                      </span>
                    )}
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 pr-2">
                        {job["Job Title"] || "Unknown Role"}
                      </h3>
                      {job["Match %"] && (
                        <span className="shrink-0 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-extrabold rounded-md border border-emerald-100 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {job["Match %"]}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                    {job.Company || "Unknown Company"}
                    {job.Rating && job.Rating !== "N/A" && (
                      <span className="flex items-center text-slate-400 text-[10px] bg-slate-100 px-1.5 rounded">
                        <Star className="w-3 h-3 text-amber-400 mr-0.5 fill-amber-400" />
                        {job.Rating}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center text-[11px] text-slate-500">
                      <MapPin className="w-3 h-3 mr-1.5 shrink-0" />
                      <span className="truncate">{job.Location || "Remote"}</span>
                    </div>
                    {job.Salary && job.Salary !== "Not Disclosed" && (
                      <div className="flex items-center text-[11px] text-slate-500">
                        <DollarSign className="w-3 h-3 mr-1.5 shrink-0" />
                        <span className="truncate font-medium text-slate-600">{job.Salary}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {job["Posted Date"] || "Recently"}
                    </span>
                    <span className="font-semibold text-[#7C3AED]">{job["Work Mode"] || "Flexible"}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Pane - Job Details */}
            <div className="w-[55%] h-full bg-white overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                {selectedJob && (
                  <motion.div
                    key={selectedJob["Job Title"] || "selected"}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="p-8"
                  >
                    {/* Header */}
                    <div className="pb-6 border-b border-slate-100">
                      {selectedJob.source && (
                        <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest mb-3 border ${selectedJob.source === 'Internshala' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                          {selectedJob.source}
                        </span>
                      )}
                      <h2 className="text-2xl font-black text-slate-800 mb-2">{selectedJob["Job Title"]}</h2>
                      
                      <div className="flex items-center gap-3 text-sm font-semibold text-slate-600 mb-4">
                        {selectedJob["Company Logo"] && selectedJob["Company Logo"] !== "N/A" ? (
                          <Image src={selectedJob["Company Logo"]} alt="logo" width={24} height={24} className="w-6 h-6 object-contain" />
                        ) : (
                          <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs">
                            <Building className="w-4 h-4" />
                          </div>
                        )}
                        <span className="text-lg">{selectedJob.Company}</span>
                        {selectedJob.Rating && selectedJob.Rating !== "N/A" && (
                          <span className="flex items-center text-amber-500 text-sm">
                            <Star className="w-4 h-4 fill-amber-400 mr-1" />
                            {selectedJob.Rating}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg font-medium flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1.5" />
                          {selectedJob.Location}
                        </span>
                        {selectedJob.Salary && selectedJob.Salary !== "Not Disclosed" && (
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-bold flex items-center border border-emerald-100">
                            <DollarSign className="w-3.5 h-3.5 mr-1" />
                            {selectedJob.Salary}
                          </span>
                        )}
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium flex items-center">
                          <Building className="w-3.5 h-3.5 mr-1.5" />
                          {selectedJob["Work Mode"] || "Standard"}
                        </span>
                      </div>

                      <div className="mt-6 flex gap-3">
                        <button 
                          onClick={() => {
                            const url = (selectedJob.apply_url && selectedJob.apply_url !== "N/A" && selectedJob.apply_url !== "") 
                              ? selectedJob.apply_url 
                              : ((selectedJob.job_url && selectedJob.job_url !== "N/A" && selectedJob.job_url !== "") ? selectedJob.job_url : null);
                            if (url) {
                              window.open(url, "_blank", "noopener,noreferrer");
                            }
                          }}
                          disabled={!(selectedJob.apply_url && selectedJob.apply_url !== "N/A" && selectedJob.apply_url !== "") && !(selectedJob.job_url && selectedJob.job_url !== "N/A" && selectedJob.job_url !== "")}
                          className={`flex-1 py-3 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${selectedJob.source === 'Internshala' ? 'bg-[#1266e3] hover:bg-blue-700' : 'bg-[#7C3AED] hover:bg-purple-700'}`}
                        >
                          <span>{!(selectedJob.apply_url && selectedJob.apply_url !== "N/A" && selectedJob.apply_url !== "") && !(selectedJob.job_url && selectedJob.job_url !== "N/A" && selectedJob.job_url !== "") ? "Application link unavailable" : `Apply on ${selectedJob.source || 'Indeed'}`}</span>
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="py-6 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
                          <Star className="w-3.5 h-3.5" />
                        </span>
                        Gemini AI Insights
                      </h3>
                      
                      <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-5 mb-5">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl font-black text-[#7C3AED]">{selectedJob["Match %"] || "N/A"}</span>
                          <span className="text-sm font-bold text-slate-700">Profile Match</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {selectedJob["Short Description"] || "Good potential match based on your profile."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase">Matching Skills</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedJob["Skill Tags"]?.length ? selectedJob["Skill Tags"].map((skill, i) => (
                              <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-md border border-emerald-100 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                {skill}
                              </span>
                            )) : (
                              <span className="text-xs text-slate-400">Not specified</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase">Missing Skills</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedJob["Missing Skills"]?.length ? selectedJob["Missing Skills"].map((skill, i) => (
                              <span key={i} className="px-2 py-1 bg-red-50 text-red-600 text-[11px] font-bold rounded-md border border-red-100 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {skill}
                              </span>
                            )) : (
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                You match all requirements!
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      <MyTargetModal 
        isOpen={isMyTargetModalOpen} 
        onClose={() => setIsMyTargetModalOpen(false)} 
        onFetchResults={(prefs) => fetchTargetJobs(prefs, false)}
      />
    </motion.div>
  );
}
