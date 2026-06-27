"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  BrainCircuit, 
  Play, 
  Clock, 
  Video, 
  Award,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
  UserCheck,
  Mic,
  Square,
  Loader2,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import InterviewReportViewer from "./InterviewReportViewer";

// Helper for API URL
const getApiUrl = (path: string): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) return `${apiUrl.replace(/\/$/, "")}${path}`;
  return `http://localhost:8000${path}`;
};

export default function InterviewPlacementPanel() {
  // App State
  const [appState, setAppState] = useState<"config" | "loading" | "question" | "evaluating" | "report">("config");
  
  // Configuration State
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Easy");
  const [totalQuestions, setTotalQuestions] = useState<number>(5);
  
  // Interview Session State
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [finalReport, setFinalReport] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Recording & Transcription State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(60);
  
  // Speech Recognition setup
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize SpeechRecognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
             currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
        };
      }
    }
    
    // Fetch History
    fetchHistory();
    
    return () => {
      stopRecordingAndTimer();
    };
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(getApiUrl("/interview/history"), { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.error("Failed to fetch history:", e);
    }
  };

  const startRecordingAndTimer = () => {
    setTranscript("");
    setTimeLeft(60);
    setIsRecording(true);
    
    if (recognitionRef.current) {
       try {
         recognitionRef.current.start();
       } catch (e) {
         console.error("Recognition already started", e);
       }
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopRecordingAndTimer();
          submitAnswer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRecordingAndTimer = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
  };

  const handleStartInterview = async () => {
    setAppState("loading");
    try {
      const res = await fetch(getApiUrl("/interview/start"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ difficulty: selectedDifficulty, total_questions: totalQuestions })
      });
      if (!res.ok) throw new Error("Failed to start");
      const data = await res.json();
      setSessionId(data.session_id);
      setCurrentQuestion(data.question);
      setQuestionNumber(data.question_number);
      setAppState("question");
    } catch (e) {
      console.error(e);
      setAppState("config");
      alert("Error starting interview. Please check console.");
    }
  };

  const submitAnswer = async () => {
    stopRecordingAndTimer();
    setAppState("evaluating");
    
    try {
      const res = await fetch(getApiUrl("/interview/evaluate-and-next"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
           session_id: sessionId,
           question_text: currentQuestion,
           transcript: transcript || "No answer provided."
        })
      });
      
      if (!res.ok) throw new Error("Failed to evaluate");
      const data = await res.json();
      
      if (data.status === "completed") {
         setFinalReport(data.report);
         setAppState("report");
         fetchHistory(); // Refresh history
      } else {
         setCurrentQuestion(data.question);
         setQuestionNumber(data.question_number);
         setTranscript("");
         setAppState("question");
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting answer.");
      setAppState("question"); // Revert back to allow retry maybe
    }
  };

  // Upcoming placement resources/drives (Static Mock)
  const placementDrives = [
    { company: "TCS Ninja / Digital", date: "July 12, 2026", status: "Applications Open", type: "On-Campus" },
    { company: "Accenture HackDivas", date: "July 20, 2026", status: "Coding Round", type: "National Challenge" },
    { company: "Cognizant GenC", date: "August 05, 2026", status: "Registration Closed", type: "Off-Campus" }
  ];

  return (
    <motion.div
      key="interview-placement"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[700px] p-6 lg:p-8 gap-6 relative"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shadow-sm">
            <BrainCircuit className="w-5 h-5 animate-pulse-slow" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">AI Voice Interview Simulator</h2>
            <p className="text-xs text-slate-400">Practice a realistic software company interview with personalized AI questions.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 flex-1">
        
        {/* Left Side: Mock Interview Simulator */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden min-h-[350px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/30 rounded-full blur-2xl pointer-events-none" />
            
            <AnimatePresence mode="wait">
              
              {/* STATE: CONFIG */}
              {appState === "config" && (
                <motion.div key="config" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="p-1.5 rounded-lg bg-purple-50 text-[#7C3AED]"><Video className="w-4 h-4" /></span>
                    <h3 className="text-sm font-extrabold text-slate-800">Configure Interview</h3>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed mb-6">
                    Launch a live voice-based mock interview. Gemini AI acts as a senior recruiter, generating questions solely from your cached profile and grading your spoken responses in real-time.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    {/* Difficulty Selector */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Interview Difficulty</label>
                      <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl p-3 outline-hidden cursor-pointer focus:ring-2 focus:ring-purple-500/50"
                      >
                        <option value="Easy">Easy (Basic / Moderate)</option>
                        <option value="Hard">Hard (Deep Technical)</option>
                      </select>
                    </div>

                    {/* Question Count Selector */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Number of Questions</label>
                      <select
                        value={totalQuestions}
                        onChange={(e) => setTotalQuestions(Number(e.target.value))}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl p-3 outline-hidden cursor-pointer focus:ring-2 focus:ring-purple-500/50"
                      >
                        {[5,6,7,8,9,10,11,12,13,14,15].map(num => (
                           <option key={num} value={num}>{num} Questions</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-purple-50/50 border border-purple-100 rounded-xl flex items-center justify-between">
                     <span className="text-xs font-bold text-purple-700">Interview Mode: <span className="font-extrabold text-purple-900">Voice Only</span></span>
                     <span className="text-xs font-bold text-purple-700 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> Est. Time: {totalQuestions} Minutes</span>
                  </div>

                  <div className="flex justify-end gap-3 mt-8">
                    <button 
                      onClick={handleStartInterview}
                      className="px-6 py-3 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white text-sm font-black tracking-wide rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" /> Start Interview
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STATE: LOADING */}
              {appState === "loading" && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full min-h-[250px] gap-4">
                   <div className="relative">
                     <div className="absolute inset-0 bg-[#7C3AED]/20 blur-xl rounded-full animate-pulse" />
                     <div className="w-16 h-16 bg-white border border-slate-100 rounded-3xl shadow-xl flex items-center justify-center relative">
                       <Loader2 className="w-8 h-8 text-[#7C3AED] animate-spin" />
                     </div>
                   </div>
                   <div className="text-center">
                     <h3 className="text-sm font-extrabold text-slate-800">Initializing Environment</h3>
                     <p className="text-xs text-slate-500 mt-1">Loading profile cache and generating first question...</p>
                   </div>
                </motion.div>
              )}

              {/* STATE: QUESTION */}
              {appState === "question" && (
                <motion.div key="question" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">
                      Question {questionNumber} / {totalQuestions}
                    </span>
                    
                    {/* Circular Countdown Timer */}
                    {isRecording && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">Timer</span>
                        <div className="relative w-8 h-8 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                            <circle cx="16" cy="16" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                            <circle cx="16" cy="16" r="14" fill="none" stroke="#7C3AED" strokeWidth="4" 
                                    strokeDasharray={`${(timeLeft / 60) * 88} 88`} />
                          </svg>
                          <span className="absolute text-[10px] font-black text-[#7C3AED]">{timeLeft}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-base font-extrabold text-slate-800 leading-relaxed mb-6">
                      {currentQuestion}
                    </p>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-[100px] mb-4">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Live Transcript</span>
                       <p className="text-sm font-medium text-slate-700 italic">
                         {transcript || (isRecording ? "Listening..." : "Click microphone to start answering.")}
                       </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    {!isRecording ? (
                      <button 
                        onClick={startRecordingAndTimer}
                        className="flex-1 max-w-[200px] px-4 py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Mic className="w-4 h-4" /> Start Answering
                      </button>
                    ) : (
                      <div className="flex gap-3 w-full justify-between items-center">
                        <button 
                          onClick={() => { stopRecordingAndTimer(); submitAnswer(); }}
                          className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <Square className="w-4 h-4" /> Stop Recording
                        </button>
                        
                        <button 
                          onClick={() => { stopRecordingAndTimer(); submitAnswer(); }}
                          className="px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                        >
                          {questionNumber < totalQuestions ? "Next Question" : "Submit Interview"} <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STATE: EVALUATING */}
              {appState === "evaluating" && (
                <motion.div key="evaluating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full min-h-[250px] gap-4">
                   <div className="relative">
                     <div className="absolute inset-0 bg-[#7C3AED]/20 blur-xl rounded-full animate-pulse" />
                     <div className="w-16 h-16 bg-white border border-slate-100 rounded-3xl shadow-xl flex items-center justify-center relative">
                       <BrainCircuit className="w-8 h-8 text-[#7C3AED] animate-pulse" />
                     </div>
                   </div>
                   <div className="text-center">
                     <h3 className="text-sm font-extrabold text-slate-800">Evaluating Answer</h3>
                     <p className="text-xs text-slate-500 mt-1">Gemini AI is analyzing your response and generating feedback...</p>
                   </div>
                </motion.div>
              )}

              {/* STATE: REPORT */}
              {appState === "report" && (
                <motion.div key="report-preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full min-h-[250px] gap-5 text-center">
                   <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-2">
                     <Award className="w-10 h-10" />
                   </div>
                   <div>
                     <h3 className="text-xl font-black text-slate-800">Interview Completed!</h3>
                     <p className="text-sm text-slate-500 mt-1 font-medium">Your score: <span className="font-extrabold text-emerald-600">{finalReport?.overall_score}/100</span></p>
                   </div>
                   <div className="flex gap-3">
                     <button 
                       onClick={() => setAppState("config")}
                       className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                     >
                       Take Another
                     </button>
                     <button 
                       onClick={() => { /* ReportViewer handled by overlay */ }}
                       className="px-5 py-2.5 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                     >
                       View Full Report
                     </button>
                   </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Past Sessions History */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600"><Clock className="w-4 h-4" /></span>
              <h3 className="text-sm font-extrabold text-slate-800">Preparation & Feedback History</h3>
            </div>
            
            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-2">
              {history.length > 0 ? history.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-2 hover:border-purple-200 transition-colors cursor-pointer"
                     onClick={() => { setFinalReport(item.final_report_json); setAppState("report"); }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">AI Voice Interview</h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="px-2 py-0.5 bg-purple-50 border border-purple-100 text-[#7C3AED] text-[9px] font-bold rounded-full">{item.difficulty}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-sm font-black ${item.overall_score >= 80 ? 'text-emerald-600' : item.overall_score >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                        {item.overall_score}%
                      </span>
                      <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wide">Overall Score</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center p-4 text-xs text-slate-400 font-semibold">No interviews completed yet.</div>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Active Placement Drives & Prep Checklist */}
        <div className="flex flex-col gap-6">
          
          {/* Active Placements Drives Tracker */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600"><Award className="w-4 h-4" /></span>
              <h3 className="text-sm font-extrabold text-slate-800">Campus Placement Drives</h3>
            </div>
            
            <div className="space-y-3">
              {placementDrives.map((drive, idx) => (
                <div key={idx} className="flex justify-between items-center p-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl group hover:border-emerald-200 transition-all">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-xs font-extrabold text-slate-800 truncate">{drive.company}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-slate-400 font-bold">{drive.date}</span>
                      <span className="text-[9px] text-indigo-500 font-extrabold">{drive.type}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                    drive.status.includes("Open") 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : drive.status.includes("Coding")
                      ? "bg-amber-50 text-amber-600 border-amber-100"
                      : "bg-slate-100 text-slate-400 border-slate-200"
                  }`}>
                    {drive.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Placement Prep Checklist */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-50 text-[#7C3AED]"><UserCheck className="w-4 h-4" /></span>
              <h3 className="text-sm font-extrabold text-slate-800">Placement Prep Checklist</h3>
            </div>
            
            <div className="space-y-3 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2 bg-slate-50/50 border border-slate-100 p-2.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>AI GitHub Profile Analysis (Completed)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50/50 border border-slate-100 p-2.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>ATS Resume Review (Completed)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50/50 border border-slate-100 p-2.5 rounded-xl opacity-60">
                <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Solve 5 Aptitude Practice Tests</span>
              </div>
              <div className={`flex items-center gap-2 bg-slate-50/50 border border-slate-100 p-2.5 rounded-xl ${history.length > 0 ? '' : 'opacity-60'}`}>
                {history.length > 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />}
                <span>Perform a Voice AI Interview Session</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Report Overlay */}
      <AnimatePresence>
        {appState === "report" && finalReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 lg:p-10"
          >
            <div className="w-full max-w-4xl max-h-full" onClick={e => e.stopPropagation()}>
               <InterviewReportViewer report={finalReport} onClose={() => setAppState("config")} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
