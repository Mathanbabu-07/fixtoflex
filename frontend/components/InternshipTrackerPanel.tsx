"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Loader2, RefreshCw, Star, MapPin, DollarSign, Building, ExternalLink, Calendar, CheckCircle2, AlertCircle, Award, Briefcase, Filter, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Internship {
  "Internship Title"?: string;
  "Company Name"?: string;
  Location?: string;
  Stipend?: string;
  "Work Mode"?: string;
  "Posted Date"?: string;
  "Apply Deadline"?: string;
  Duration?: string;
  "Match %"?: string;
  "Skill Tags"?: string[];
  "Missing Skills"?: string[];
  "Short Description"?: string;
  job_url?: string;
  "Company Logo"?: string;
  source?: string;
}

interface InternshipTrackerPanelProps {
  getApiUrl: (path: string) => string;
  onMakeDraft?: (internship: any) => void;
}

export default function InternshipTrackerPanel({ getApiUrl, onMakeDraft }: InternshipTrackerPanelProps) {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasTracked, setHasTracked] = useState(false);

  // Filters state
  const [stipendFilter, setStipendFilter] = useState("All");
  const [workModeFilter, setWorkModeFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");

  const fetchInternships = async (forceRefresh: boolean = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = getApiUrl(`/internship-tracker/search?force_refresh=${forceRefresh}`);
      const response = await fetch(endpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch internships");
      }

      const data = await response.json();
      if (data.status === "success" && data.data) {
        setInternships(data.data);
        if (data.data.length > 0) {
          setSelectedInternship(data.data[0]);
        }
        setHasTracked(true);
      } else {
        throw new Error(data.message || "Failed to parse internships");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while fetching internships.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInternships = useMemo(() => {
    return internships.filter((internship) => {
      // Stipend filter
      if (stipendFilter === "With Stipend") {
        if (!internship.Stipend || internship.Stipend === "Not Disclosed" || internship.Stipend.toLowerCase().includes("unpaid")) return false;
      }
      if (stipendFilter === "Without Stipend") {
        if (internship.Stipend && internship.Stipend !== "Not Disclosed" && !internship.Stipend.toLowerCase().includes("unpaid")) return false;
      }

      // Work Mode filter
      if (workModeFilter !== "All") {
        const mode = (internship["Work Mode"] || "").toLowerCase();
        if (workModeFilter === "Remote" && !mode.includes("remote") && !mode.includes("home")) return false;
        if (workModeFilter === "On-site" && !mode.includes("on-site") && !mode.includes("office")) return false;
        if (workModeFilter === "Hybrid" && !mode.includes("hybrid")) return false;
      }

      // Platform filter
      if (platformFilter !== "All") {
        if (internship.source !== platformFilter) return false;
      }

      return true;
    });
  }, [internships, stipendFilter, workModeFilter, platformFilter]);

  // Handle auto-select first filtered item if selected one disappears
  useEffect(() => {
    let shouldUpdate = false;
    if (filteredInternships.length > 0) {
      if (!selectedInternship || !filteredInternships.some(i => i["Internship Title"] === selectedInternship["Internship Title"])) {
        shouldUpdate = true;
      }
    }
    
    if (shouldUpdate) {
      // Use a small timeout to avoid synchronous cascading renders during paint
      const timer = setTimeout(() => {
        setSelectedInternship(filteredInternships[0]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [filteredInternships, selectedInternship]);

  return (
    <motion.div
      key="internship-tracker"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[800px]"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Internship Tracker</h2>
            <p className="text-xs text-slate-400">Targeted internships matched to your profile.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchInternships(true)}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2 shadow-sm shadow-indigo-200"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            <span>{hasTracked ? "Refresh Internships" : "Track Internships"}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex relative bg-slate-50/30">
        
        {/* Empty / Initial State */}
        {!hasTracked && !isLoading && internships.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10 bg-white/50 backdrop-blur-sm">
            <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-4 border border-indigo-100 shadow-inner">
              <Award className="w-10 h-10 text-indigo-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Looking for internships?</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md">
              We'll extract internships from Unstop and Internshala based exclusively on your career preferences and technical skills.
            </p>
            <button
              onClick={() => fetchInternships(false)}
              className="mt-6 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Search Internships
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-white/70 backdrop-blur-md">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-100 rounded-full animate-pulse"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-sm font-bold text-slate-600 animate-pulse">Extracting and ranking internships via Gemini AI...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center p-6 z-20">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center max-w-md">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <h3 className="font-bold text-red-800 mb-2">Error Fetching Internships</h3>
              <p className="text-xs text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => fetchInternships(true)}
                className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-bold transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Two-Pane Layout */}
        {hasTracked && !isLoading && internships.length > 0 && (
          <div className="flex w-full h-full divide-x divide-slate-100">
            
            {/* Left Pane - Job List & Filters */}
            <div className="w-[45%] h-full overflow-y-auto flex flex-col bg-slate-50/50">
              
              {/* Filters */}
              <div className="p-4 bg-white border-b border-slate-100 flex flex-col gap-3 shrink-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  <Filter className="w-3.5 h-3.5" /> Filters
                </div>
                <div className="flex flex-wrap gap-2">
                  <select 
                    value={stipendFilter}
                    onChange={(e) => setStipendFilter(e.target.value)}
                    className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="All">All Stipends</option>
                    <option value="With Stipend">With Stipend</option>
                    <option value="Without Stipend">Without Stipend</option>
                  </select>
                  <select 
                    value={workModeFilter}
                    onChange={(e) => setWorkModeFilter(e.target.value)}
                    className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="All">All Modes</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                  <select 
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="All">All Platforms</option>
                    <option value="Internshala">Internshala</option>
                    <option value="Unstop">Unstop</option>
                  </select>
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {filteredInternships.length === 0 ? (
                  <div className="text-center text-sm text-slate-500 mt-10">No internships match your filters.</div>
                ) : (
                  filteredInternships.map((internship, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedInternship(internship)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedInternship === internship 
                          ? "bg-white border-indigo-500 shadow-md shadow-indigo-100/50 ring-1 ring-indigo-500/20" 
                          : "bg-white border-slate-100 hover:border-indigo-200 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex flex-col mb-2">
                        {internship.source && (
                          <span className={`text-[9px] font-black uppercase tracking-widest mb-1.5 ${internship.source === 'Internshala' ? 'text-blue-500' : 'text-orange-500'}`}>
                            {internship.source}
                          </span>
                        )}
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 pr-2">
                            {internship["Internship Title"] || "Unknown Role"}
                          </h3>
                          <div className="flex flex-col items-end gap-1.5">
                            {internship["Match %"] && (
                              <span className="shrink-0 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-extrabold rounded-md border border-emerald-100 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                {internship["Match %"]}
                              </span>
                            )}
                            {onMakeDraft && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMakeDraft(internship);
                                }}
                                className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-md shadow-sm transition-all text-[10px] font-bold text-slate-700 z-10"
                                title="Make Draft"
                              >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Make Draft
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                        {internship["Company Name"] || "Unknown Company"}
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 mr-1.5 shrink-0" />
                          <span className="truncate">{internship.Location || "Remote"}</span>
                        </div>
                        {internship.Stipend && internship.Stipend !== "Not Disclosed" && internship.Stipend !== "" && (
                          <div className="flex items-center text-[11px] text-slate-500">
                            <DollarSign className="w-3 h-3 mr-1.5 shrink-0" />
                            <span className="truncate font-medium text-slate-600">{internship.Stipend}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {internship["Posted Date"] || "Recently"}
                        </span>
                        <span className="font-semibold text-indigo-600">{internship["Work Mode"] || "Flexible"}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Pane - Internship Details */}
            <div className="w-[55%] h-full bg-white overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                {selectedInternship && (
                  <motion.div
                    key={selectedInternship["Internship Title"] || "selected"}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="p-8"
                  >
                    {/* Header */}
                    <div className="pb-6 border-b border-slate-100">
                      {selectedInternship.source && (
                        <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest mb-3 border ${selectedInternship.source === 'Internshala' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                          {selectedInternship.source}
                        </span>
                      )}
                      <h2 className="text-2xl font-black text-slate-800 mb-2">{selectedInternship["Internship Title"]}</h2>
                      
                      <div className="flex items-center gap-3 text-sm font-semibold text-slate-600 mb-4">
                        {selectedInternship["Company Logo"] && selectedInternship["Company Logo"] !== "N/A" && selectedInternship["Company Logo"] !== "" ? (
                          <img src={selectedInternship["Company Logo"]} alt="logo" className="w-6 h-6 object-contain" />
                        ) : (
                          <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs">
                            <Building className="w-4 h-4" />
                          </div>
                        )}
                        <span className="text-lg">{selectedInternship["Company Name"]}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg font-medium flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1.5" />
                          {selectedInternship.Location || "Location N/A"}
                        </span>
                        {selectedInternship.Stipend && selectedInternship.Stipend !== "Not Disclosed" && selectedInternship.Stipend !== "" && (
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-bold flex items-center border border-emerald-100">
                            <DollarSign className="w-3.5 h-3.5 mr-1" />
                            {selectedInternship.Stipend}
                          </span>
                        )}
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium flex items-center">
                          <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                          {selectedInternship["Work Mode"] || "Standard"}
                        </span>
                        {selectedInternship.Duration && selectedInternship.Duration !== "N/A" && selectedInternship.Duration !== "" && (
                          <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg font-medium flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                            {selectedInternship.Duration}
                          </span>
                        )}
                      </div>

                      <div className="mt-6 flex gap-3">
                        <button 
                          onClick={() => {
                            if (selectedInternship.job_url) {
                              window.open(selectedInternship.job_url, "_blank", "noopener,noreferrer");
                            }
                          }}
                          disabled={!selectedInternship.job_url || selectedInternship.job_url === "N/A"}
                          className={`flex-1 py-3 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${selectedInternship.source === 'Internshala' ? 'bg-[#1266e3] hover:bg-blue-700' : 'bg-orange-500 hover:bg-orange-600'}`}
                        >
                          <span>{(!selectedInternship.job_url || selectedInternship.job_url === "N/A") ? "Application link unavailable" : `Apply on ${selectedInternship.source || 'Website'}`}</span>
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="py-6">
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Star className="w-3.5 h-3.5" />
                        </span>
                        Gemini AI Insights
                      </h3>
                      
                      <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 mb-5">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl font-black text-indigo-600">{selectedInternship["Match %"] || "N/A"}</span>
                          <span className="text-sm font-bold text-slate-700">Profile Match</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {selectedInternship["Short Description"] || "Good potential match based on your profile."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase">Matching Skills</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedInternship["Skill Tags"]?.length ? selectedInternship["Skill Tags"].map((skill, i) => (
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
                            {selectedInternship["Missing Skills"]?.length ? selectedInternship["Missing Skills"].map((skill, i) => (
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
    </motion.div>
  );
}
