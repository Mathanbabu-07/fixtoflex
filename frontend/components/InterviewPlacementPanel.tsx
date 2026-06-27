"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  BrainCircuit, 
  Play, 
  Clock, 
  Video, 
  Award,
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
    
    return () => {
      stopRecordingAndTimer();
    };
  }, []);

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

  return (
    <motion.div
      key="interview-placement"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[700px] p-6 lg:p-8 gap-6 relative items-center justify-center"
    >
      <div className="w-full max-w-3xl flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center border-b border-slate-100 pb-8 text-center">
          <div className="w-16 h-16 mb-4 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shadow-sm">
            <BrainCircuit className="w-8 h-8 animate-pulse-slow" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">AI Voice Interview Simulator</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-xl">
            Practice a realistic software company interview with personalized AI questions. 
            No typing required—just speak your answers out loud.
          </p>
        </div>

        {/* Main Interface */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col gap-4 relative overflow-hidden min-h-[400px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />
          
          <AnimatePresence mode="wait">
            
            {/* STATE: CONFIG */}
            {appState === "config" && (
              <motion.div key="config" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full justify-center relative z-10">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="p-2 rounded-xl bg-purple-50 text-[#7C3AED]"><Video className="w-5 h-5" /></span>
                  <h3 className="text-lg font-extrabold text-slate-800">Configure Interview</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                  {/* Difficulty Selector */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interview Difficulty</label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-2xl p-4 outline-hidden cursor-pointer focus:ring-2 focus:ring-purple-500/50"
                    >
                      <option value="Easy">Easy (Basic / Moderate)</option>
                      <option value="Hard">Hard (Deep Technical)</option>
                    </select>
                  </div>

                  {/* Question Count Selector */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Number of Questions</label>
                    <select
                      value={totalQuestions}
                      onChange={(e) => setTotalQuestions(Number(e.target.value))}
                      className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-2xl p-4 outline-hidden cursor-pointer focus:ring-2 focus:ring-purple-500/50"
                    >
                      {[5,6,7,8,9,10,11,12,13,14,15].map(num => (
                         <option key={num} value={num}>{num} Questions</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-purple-50/50 border border-purple-100 rounded-2xl flex items-center justify-between">
                   <span className="text-sm font-bold text-purple-700">Interview Mode: <span className="font-extrabold text-purple-900">Voice Only</span></span>
                   <span className="text-sm font-bold text-purple-700 flex items-center gap-2"><Clock className="w-4 h-4"/> Est. Time: {totalQuestions} Minutes</span>
                </div>

                <div className="flex justify-center mt-10">
                  <button 
                    onClick={handleStartInterview}
                    className="px-10 py-4 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white text-lg font-black tracking-wide rounded-2xl shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-current" /> Start Interview
                  </button>
                </div>
              </motion.div>
            )}

            {/* STATE: LOADING */}
            {appState === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full min-h-[300px] gap-5 relative z-10">
                 <div className="relative">
                   <div className="absolute inset-0 bg-[#7C3AED]/20 blur-xl rounded-full animate-pulse" />
                   <div className="w-20 h-20 bg-white border border-slate-100 rounded-[2rem] shadow-xl flex items-center justify-center relative">
                     <Loader2 className="w-10 h-10 text-[#7C3AED] animate-spin" />
                   </div>
                 </div>
                 <div className="text-center">
                   <h3 className="text-lg font-extrabold text-slate-800">Initializing Environment</h3>
                   <p className="text-sm text-slate-500 mt-2">Loading profile cache and generating first question...</p>
                 </div>
              </motion.div>
            )}

            {/* STATE: QUESTION */}
            {appState === "question" && (
              <motion.div key="question" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col h-full relative z-10">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <span className="text-xs font-black text-purple-600 uppercase tracking-widest bg-purple-50 px-4 py-1.5 rounded-full">
                    Question {questionNumber} / {totalQuestions}
                  </span>
                  
                  {/* Circular Countdown Timer */}
                  {isRecording && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-500">Timer</span>
                      <div className="relative w-10 h-10 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                          <circle cx="16" cy="16" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                          <circle cx="16" cy="16" r="14" fill="none" stroke="#7C3AED" strokeWidth="4" 
                                  strokeDasharray={`${(timeLeft / 60) * 88} 88`} />
                        </svg>
                        <span className="absolute text-[11px] font-black text-[#7C3AED]">{timeLeft}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="text-xl font-extrabold text-slate-800 leading-relaxed mb-8">
                    {currentQuestion}
                  </p>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 min-h-[120px] mb-6">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Live Transcript</span>
                     <p className="text-base font-medium text-slate-700 italic">
                       {transcript || (isRecording ? "Listening..." : "Click microphone to start answering.")}
                     </p>
                  </div>
                </div>

                <div className="flex justify-center items-center mt-4">
                  {!isRecording ? (
                    <button 
                      onClick={startRecordingAndTimer}
                      className="px-8 py-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-lg font-black rounded-2xl transition-all flex items-center justify-center gap-3 cursor-pointer"
                    >
                      <Mic className="w-5 h-5" /> Start Answering
                    </button>
                  ) : (
                    <div className="flex gap-4 w-full justify-between items-center">
                      <button 
                        onClick={() => { stopRecordingAndTimer(); submitAnswer(); }}
                        className="px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-black rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Square className="w-4 h-4" /> Stop Recording
                      </button>
                      
                      <button 
                        onClick={() => { stopRecordingAndTimer(); submitAnswer(); }}
                        className="px-8 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-base font-black rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
                      >
                        {questionNumber < totalQuestions ? "Next Question" : "Submit Interview"} <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STATE: EVALUATING */}
            {appState === "evaluating" && (
              <motion.div key="evaluating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full min-h-[300px] gap-5 relative z-10">
                 <div className="relative">
                   <div className="absolute inset-0 bg-[#7C3AED]/20 blur-xl rounded-full animate-pulse" />
                   <div className="w-20 h-20 bg-white border border-slate-100 rounded-[2rem] shadow-xl flex items-center justify-center relative">
                     <BrainCircuit className="w-10 h-10 text-[#7C3AED] animate-pulse" />
                   </div>
                 </div>
                 <div className="text-center">
                   <h3 className="text-lg font-extrabold text-slate-800">Evaluating Answer</h3>
                   <p className="text-sm text-slate-500 mt-2">Gemini AI is analyzing your response and generating feedback...</p>
                 </div>
              </motion.div>
            )}

            {/* STATE: REPORT */}
            {appState === "report" && (
              <motion.div key="report-preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full min-h-[300px] gap-6 text-center relative z-10">
                 <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-2">
                   <Award className="w-12 h-12" />
                 </div>
                 <div>
                   <h3 className="text-2xl font-black text-slate-800">Interview Completed!</h3>
                   <p className="text-base text-slate-500 mt-2 font-medium">Your score: <span className="font-extrabold text-emerald-600">{finalReport?.overall_score}/100</span></p>
                 </div>
                 <div className="flex gap-4 mt-2">
                   <button 
                     onClick={() => setAppState("config")}
                     className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all"
                   >
                     Take Another
                   </button>
                   <button 
                     onClick={() => { /* ReportViewer handled by overlay */ }}
                     className="px-6 py-3 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white text-sm font-bold rounded-xl shadow-lg transition-all"
                   >
                     View Full Report
                   </button>
                 </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Report Overlay */}
      <AnimatePresence>
        {appState === "report" && finalReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 lg:p-10"
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
