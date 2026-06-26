"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Building, Briefcase, DollarSign, MapPin, Search } from "lucide-react";

interface MyTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFetchResults: (preferences: TargetPreferences) => void;
}

export interface TargetPreferences {
  companies: string[];
  roles: string[];
  salary: string;
  locations: string[];
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Chandigarh"
];

const SALARY_OPTIONS = [
  "3 LPA - 5 LPA",
  "6 LPA - 9 LPA",
  "10 LPA - 15 LPA",
  "15 LPA - 20 LPA",
  "More than 20 LPA"
];

export default function MyTargetModal({ isOpen, onClose, onFetchResults }: MyTargetModalProps) {
  const [companies, setCompanies] = useState<string[]>([]);
  const [companyInput, setCompanyInput] = useState("");
  
  const [roles, setRoles] = useState<string[]>([]);
  const [roleInput, setRoleInput] = useState("");
  
  const [salary, setSalary] = useState<string>("");
  
  const [locations, setLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState("");

  const handleAddCompany = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = companyInput.trim().replace(/,$/, "");
      if (val && !companies.includes(val) && companies.length < 3) {
        setCompanies([...companies, val]);
        setCompanyInput("");
      }
    }
  };

  const handleAddRole = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = roleInput.trim().replace(/,$/, "");
      if (val && !roles.includes(val) && roles.length < 2) {
        setRoles([...roles, val]);
        setRoleInput("");
      }
    }
  };

  const handleAddLocation = (val: string) => {
    if (val && !locations.includes(val) && locations.length < 3) {
      setLocations([...locations, val]);
      setLocationInput("");
    }
  };

  const isFormValid = companies.length > 0 || roles.length > 0;

  const handleSubmit = () => {
    if (!isFormValid) return;
    onFetchResults({ companies, roles, salary, locations });
  };

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
                <h2 className="text-lg font-bold text-slate-800">My Target Search</h2>
                <p className="text-xs text-slate-500">Find jobs based strictly on these targets.</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
            
            {/* Target Companies */}
            <div>
              <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                <Building className="w-4 h-4 mr-2 text-indigo-500" />
                Target Companies <span className="text-xs font-normal text-slate-400 ml-2">(Max 3)</span>
              </label>
              <div className="p-2 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all bg-white min-h-[46px] flex flex-wrap gap-2">
                {companies.map((c) => (
                  <span key={c} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg flex items-center">
                    {c}
                    <X className="w-3 h-3 ml-1.5 cursor-pointer hover:text-indigo-900" onClick={() => setCompanies(companies.filter(x => x !== c))} />
                  </span>
                ))}
                {companies.length < 3 && (
                  <input 
                    type="text" 
                    value={companyInput}
                    onChange={(e) => setCompanyInput(e.target.value)}
                    onKeyDown={handleAddCompany}
                    placeholder="E.g., Google, Microsoft (Press Enter)"
                    className="flex-1 min-w-[150px] outline-none text-sm text-slate-700 bg-transparent"
                  />
                )}
              </div>
            </div>

            {/* Target Roles */}
            <div>
              <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                <Briefcase className="w-4 h-4 mr-2 text-indigo-500" />
                Target Job Roles <span className="text-xs font-normal text-slate-400 ml-2">(Max 2)</span>
              </label>
              <div className="p-2 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all bg-white min-h-[46px] flex flex-wrap gap-2">
                {roles.map((r) => (
                  <span key={r} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg flex items-center">
                    {r}
                    <X className="w-3 h-3 ml-1.5 cursor-pointer hover:text-emerald-900" onClick={() => setRoles(roles.filter(x => x !== r))} />
                  </span>
                ))}
                {roles.length < 2 && (
                  <input 
                    type="text" 
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    onKeyDown={handleAddRole}
                    placeholder="E.g., AI Engineer (Press Enter)"
                    className="flex-1 min-w-[150px] outline-none text-sm text-slate-700 bg-transparent"
                  />
                )}
              </div>
            </div>

            {/* Target Salary */}
            <div>
              <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                <DollarSign className="w-4 h-4 mr-2 text-indigo-500" />
                Target Salary Range
              </label>
              <select 
                value={salary} 
                onChange={(e) => setSalary(e.target.value)}
                className="w-full p-3 text-sm text-slate-700 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-white appearance-none"
              >
                <option value="">Any Salary Range</option>
                {SALARY_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Target Locations */}
            <div>
              <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                Preferred Locations <span className="text-xs font-normal text-slate-400 ml-2">(Max 3)</span>
              </label>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {locations.map((loc) => (
                  <span key={loc} className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg flex items-center border border-amber-100">
                    {loc}
                    <X className="w-3 h-3 ml-1.5 cursor-pointer hover:text-amber-900" onClick={() => setLocations(locations.filter(x => x !== loc))} />
                  </span>
                ))}
              </div>
              
              {locations.length < 3 && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Search Indian States..."
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-white"
                  />
                  {locationInput.trim() && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 shadow-xl rounded-xl max-h-[150px] overflow-y-auto z-10 p-1">
                      {INDIAN_STATES.filter(s => s.toLowerCase().includes(locationInput.toLowerCase()) && !locations.includes(s)).map(s => (
                        <div 
                          key={s} 
                          onClick={() => handleAddLocation(s)}
                          className="px-3 py-2 hover:bg-indigo-50 text-sm text-slate-700 rounded-lg cursor-pointer"
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="w-full py-3.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Target className="w-5 h-5" />
              Fetch Results
            </button>
            {!isFormValid && (
              <p className="text-center text-[10px] text-slate-400 mt-3">
                Please add at least one company or one job role to search.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
