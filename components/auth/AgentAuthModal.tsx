"use client";

import React, { useState } from "react";
import { Lock, ShieldCheck, KeyRound, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import { siteConfig } from "@/content/site-config";

interface AgentAuthModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export function AgentAuthModal({ isOpen, onSuccess }: AgentAuthModalProps) {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!pin.trim()) {
      setError("Please enter your Agent Passcode.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const expectedPin = siteConfig.agentPin || "2026";

      if (pin.trim() === expectedPin) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("aiico_agent_authenticated", "true");
        }
        setIsSubmitting(false);
        onSuccess();
      } else {
        setIsSubmitting(false);
        setError("Invalid Agent Passcode. Please try again.");
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="h-16 w-16 bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-500/30 text-white rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-blue-600/20">
            <Lock className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Accredited Agent Portal</h2>
            <p className="text-xs text-slate-400 mt-1">
              Restricted Access • Enter your Agent Passcode to unlock proposal link sharing.
            </p>
          </div>
        </div>

        {/* PIN Entry Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Agent Passcode (PIN) <span className="text-blue-400">*</span>
            </label>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="h-4 w-4" />
              </div>

              <input
                type={showPin ? "text" : "password"}
                required
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError("");
                }}
                placeholder="Enter 4-digit PIN (Default: 2026)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-600 tracking-wider font-mono"
              />

              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying Passcode...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>Unlock Agent Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center border-t border-slate-800/80 pt-4">
          <p className="text-[11px] text-slate-500">
            AIICO Insurance PLC • Authorized Agent Link Generator
          </p>
        </div>
      </div>
    </div>
  );
}
