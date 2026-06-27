"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, BrainCircuit, CheckCircle2, ChevronRight, FileText, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

interface InterviewReportViewerProps {
  report: any;
  onClose: () => void;
}

export default function InterviewReportViewer({ report, onClose }: InterviewReportViewerProps) {
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null>(0);

  if (!report) return null;

  const scoreColor = report.overall_score >= 80 ? "text-emerald-500" : report.overall_score >= 60 ? "text-amber-500" : "text-rose-500";
  const progressBg = report.overall_score >= 80 ? "bg-emerald-500" : report.overall_score >= 60 ? "bg-amber-500" : "bg-rose-500";
  const progressBgTrack = report.overall_score >= 80 ? "bg-emerald-100" : report.overall_score >= 60 ? "bg-amber-100" : "bg-rose-100";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-6 lg:p-8 flex flex-col gap-6 max-h-[80vh] overflow-y-auto"
    >
      <div className="flex justify-between items-start border-b border-slate-100 pb-5 sticky top-0 bg-white/90 z-10 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shadow-sm">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">Final Interview Report</h2>
            <p className="text-xs font-semibold text-slate-500">{report.hiring_recommendation}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all"
        >
          Close Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Score */}
        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Overall Score</span>
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Simple circular progress visualization */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" className={progressBgTrack} />
              <circle 
                cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" 
                strokeDasharray={`${report.overall_score * 2.82} 282`}
                className={scoreColor}
              />
            </svg>
            <span className={`absolute text-3xl font-black ${scoreColor}`}>{report.overall_score}</span>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">Performance Breakdown</h3>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(report.performance_breakdown || {}).map(([category, score]: [string, any], idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>{category}</span>
                  <span>{score}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Feedback per Question */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-200 pb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#7C3AED]" /> Question-by-Question Feedback
        </h3>
        <div className="space-y-3">
          {(report.detailed_feedback || []).map((q: any, idx: number) => {
            const isExpanded = expandedQuestionIndex === idx;
            const qScore = q.evaluation_score || 0;
            const fb = q.feedback_json || {};
            
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all">
                <button
                  onClick={() => setExpandedQuestionIndex(isExpanded ? null : idx)}
                  className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex flex-col items-start text-left gap-1 pr-4">
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">Question {idx + 1}</span>
                    <span className="text-xs font-bold text-slate-800 line-clamp-2">{q.question_text}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-sm font-black ${qScore >= 80 ? 'text-emerald-500' : qScore >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                      {qScore}%
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100 bg-slate-50/30"
                    >
                      <div className="p-4 space-y-4">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Your Answer</span>
                          <p className="text-xs text-slate-700 italic bg-white p-3 rounded-xl border border-slate-100">
                            "{q.transcript || "No answer recorded."}"
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
                            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <AlertTriangle className="w-3 h-3" /> HR Feedback
                            </span>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                              {fb.hr_perspective || fb.feedback || "No feedback available."}
                            </p>
                          </div>
                          
                          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 shadow-xs">
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3" /> Preferred Answer Style
                            </span>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                              {fb.preferred_answer_style || "Consider using the STAR method."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
