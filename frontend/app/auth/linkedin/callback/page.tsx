"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function LinkedInCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusMsg, setStatusMsg] = useState("Securing connection with LinkedIn...");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const getApiUrl = (path: string): string => {
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
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("error");
      setErrorMessage("Required authentication parameters (code or state) were missing from the callback URL.");
      return;
    }

    console.log("[STEP 4] Callback received");

    const processOAuth = async () => {
      try {
        setStatusMsg("Exchanging authorization token...");
        
        const apiEndpoint = getApiUrl("/auth/linkedin/callback");
        console.log("[CALLBACK] Sending code and state validation to:", apiEndpoint);
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, state }),
          credentials: "include", // CRITICAL: Ensures browser stores the HttpOnly session cookie across localhost origins
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Authentication callback request failed.");
        }

        if (data.success) {
          setStatus("success");
          setStatusMsg("Welcome! Redirecting to home page...");
          localStorage.setItem("user_session", JSON.stringify(data.user));
          
          console.log("[STEP 9] Redirecting to home");
          setTimeout(() => {
            router.push("/");
          }, 1500);
        } else {
          throw new Error("Local session establishment was unsuccessful.");
        }
      } catch (err: unknown) {
        const error = err as Error;
        console.error("LinkedIn login callback failure:", error);
        setStatus("error");
        setErrorMessage(error.message || "An unexpected error occurred during LinkedIn OAuth validation.");
      }
    };

    processOAuth();
  }, [searchParams, router]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#ffffff] via-[#f7f5ff] to-[#f3f0ff] px-6">
      {/* Blurred background aesthetic elements */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-purple-400/10 blur-[100px] top-[20%] left-[10%] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-400/10 blur-[100px] bottom-[20%] right-[10%] pointer-events-none" />

      {/* Premium Login Card */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-purple-100/50 rounded-2xl p-8 shadow-xl text-center z-10">
        
        {status === "loading" && (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-[#7C3AED] animate-spin" />
              <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-purple-200/30 scale-100" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-800">Signing in with LinkedIn</h2>
              <p className="text-sm text-slate-500 font-medium">{statusMsg}</p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center space-y-6 animate-fade-in">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-800">Login Successful!</h2>
              <p className="text-sm text-[#7C3AED] font-semibold">{statusMsg}</p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center space-y-6 animate-fade-in">
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center border border-rose-100">
              <AlertCircle className="w-7 h-7 text-rose-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-800">Sign In Failed</h2>
              <p className="text-sm text-rose-500 font-medium leading-relaxed">{errorMessage}</p>
            </div>
            <div className="pt-4 w-full">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] hover:from-[#6D28D9] hover:to-[#4338CA] text-white font-semibold rounded-xl shadow-md transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LinkedInCallbackPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#ffffff] via-[#f7f5ff] to-[#f3f0ff]">
          <Loader2 className="w-10 h-10 text-[#7C3AED] animate-spin" />
        </div>
      }
    >
      <LinkedInCallbackContent />
    </Suspense>
  );
}
