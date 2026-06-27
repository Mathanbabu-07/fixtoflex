"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Building, Briefcase, MapPin, Search } from "lucide-react";

interface MyTargetAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchAnalyze: (company: string, role: string, location: string) => void;
}

const INDIAN_LOCATIONS = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Chandigarh",
  "Bengaluru", "Hyderabad", "Chennai", "Mumbai", "Pune", "Noida", "Gurugram", "Kolkata", "Ahmedabad", "Jaipur", "Kochi", "Coimbatore", "Indore", "Thiruvananthapuram"
];

const POPULAR_COMPANIES = [
  "Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Zoho", "TCS", "Infosys", "Wipro",
  "HCL", "Cognizant", "Accenture", "IBM", "Oracle", "SAP", "Salesforce", "Adobe", "Uber", "Flipkart",
  "Razorpay", "PhonePe", "Paytm", "Swiggy", "Zomato", "CRED", "Freshworks", "Atlassian", "Stripe", "Shopify"
];

const POPULAR_ROLES = [
  "Software Engineer", "AI Engineer", "Data Scientist", "Data Analyst", "Frontend Developer",
  "Backend Developer", "Full Stack Developer", "DevOps Engineer", "Cloud Engineer", "ML Engineer",
  "Product Manager", "UI/UX Designer", "Mobile Developer", "QA Engineer", "Cybersecurity Analyst",
  "System Administrator", "Database Administrator", "Business Analyst", "Embedded Engineer", "Blockchain Developer"
];

export default function MyTargetAnalysisModal({ isOpen, onClose, onSearchAnalyze }: MyTargetAnalysisModalProps) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");

  const [companyDropOpen, setCompanyDropOpen] = useState(false);
  const [roleDropOpen, setRoleDropOpen] = useState(false);
  const [locationDropOpen, setLocationDropOpen] = useState(false);

  const companyRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (companyRef.current && !companyRef.current.contains(e.target as Node)) setCompanyDropOpen(false);
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setRoleDropOpen(false);
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) setLocationDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isFormValid = company.trim().length > 0 && role.trim().length > 0;

  const handleSubmit = () => {
    if (!isFormValid) return;
    onSearchAnalyze(company.trim(), role.trim(), location.trim());
  };

  const filteredCompanies = POPULAR_COMPANIES.filter(c =>
    c.toLowerCase().includes(company.toLowerCase()) && c.toLowerCase() !== company.toLowerCase()
  );

  const filteredRoles = POPULAR_ROLES.filter(r =>
    r.toLowerCase().includes(role.toLowerCase()) && r.toLowerCase() !== role.toLowerCase()
  );

  const filteredLocations = INDIAN_LOCATIONS.filter(l =>
    l.toLowerCase().includes(location.toLowerCase()) && l.toLowerCase() !== location.toLowerCase()
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">My Target Analysis</h2>
                <p className="text-xs text-slate-500">Get a company-specific career improvement report.</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">

            {/* Target Company */}
            <div ref={companyRef} className="relative">
              <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                <Building className="w-4 h-4 mr-2 text-indigo-500" />
                Target Company <span className="text-rose-500 ml-1">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => { setCompany(e.target.value); setCompanyDropOpen(true); }}
                  onFocus={() => setCompanyDropOpen(true)}
                  placeholder="E.g., Google, Zoho, Microsoft..."
                  className="w-full pl-9 pr-3 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-white"
                />
              </div>
              {companyDropOpen && filteredCompanies.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 shadow-xl rounded-xl max-h-[150px] overflow-y-auto z-20 p-1">
                  {filteredCompanies.slice(0, 8).map(c => (
                    <div
                      key={c}
                      onClick={() => { setCompany(c); setCompanyDropOpen(false); }}
                      className="px-3 py-2 hover:bg-indigo-50 text-sm text-slate-700 rounded-lg cursor-pointer"
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Target Role */}
            <div ref={roleRef} className="relative">
              <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                <Briefcase className="w-4 h-4 mr-2 text-indigo-500" />
                Target Job Role <span className="text-rose-500 ml-1">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => { setRole(e.target.value); setRoleDropOpen(true); }}
                  onFocus={() => setRoleDropOpen(true)}
                  placeholder="E.g., AI Engineer, Full Stack Developer..."
                  className="w-full pl-9 pr-3 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-white"
                />
              </div>
              {roleDropOpen && filteredRoles.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 shadow-xl rounded-xl max-h-[150px] overflow-y-auto z-20 p-1">
                  {filteredRoles.slice(0, 8).map(r => (
                    <div
                      key={r}
                      onClick={() => { setRole(r); setRoleDropOpen(false); }}
                      className="px-3 py-2 hover:bg-indigo-50 text-sm text-slate-700 rounded-lg cursor-pointer"
                    >
                      {r}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preferred Location */}
            <div ref={locationRef} className="relative">
              <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                Preferred Location <span className="text-xs font-normal text-slate-400 ml-2">(Optional)</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setLocationDropOpen(true); }}
                  onFocus={() => setLocationDropOpen(true)}
                  placeholder="Search Indian States/Cities..."
                  className="w-full pl-9 pr-3 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-white"
                />
              </div>
              {locationDropOpen && filteredLocations.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 shadow-xl rounded-xl max-h-[150px] overflow-y-auto z-20 p-1">
                  {filteredLocations.slice(0, 8).map(l => (
                    <div
                      key={l}
                      onClick={() => { setLocation(l); setLocationDropOpen(false); }}
                      className="px-3 py-2 hover:bg-indigo-50 text-sm text-slate-700 rounded-lg cursor-pointer"
                    >
                      {l}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="w-full py-3.5 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white font-bold rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Target className="w-5 h-5" />
              Search & Analyze
            </button>
            {!isFormValid && (
              <p className="text-center text-[10px] text-slate-400 mt-3">
                Please select a target company and job role to begin.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
