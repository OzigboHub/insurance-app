"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/content/site-config";
import {
  FileText,
  Share2,
  Send,
  CheckCircle2,
  ArrowRight,
  Shield,
  Edit3,
  Copy,
  MessageSquare,
  Sparkles,
  Lock,
  Mail,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import { ShareEmailModal } from "@/components/ui/ShareEmailModal";
import { AgentAuthModal } from "@/components/auth/AgentAuthModal";

export default function FormsHubPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  const [copiedForm1, setCopiedForm1] = useState(false);
  const [copiedForm2, setCopiedForm2] = useState(false);
  const [emailModal, setEmailModal] = useState<{ isOpen: boolean; title: string; url: string }>({
    isOpen: false,
    title: "",
    url: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("aiico_agent_authenticated");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
      setIsCheckingAuth(false);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("aiico_agent_authenticated");
      setIsAuthenticated(false);
    }
  };

  const form1Url = typeof window !== "undefined"
    ? `${window.location.origin}/forms/corporate-savings`
    : "/forms/corporate-savings";

  const form2Url = typeof window !== "undefined"
    ? `${window.location.origin}/forms/flexible-endowment`
    : "/forms/flexible-endowment";

  const handleCopyLink1 = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(form1Url);
      setCopiedForm1(true);
      setTimeout(() => setCopiedForm1(false), 3000);
    }
  };

  const handleCopyLink2 = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(form2Url);
      setCopiedForm2(true);
      setTimeout(() => setCopiedForm2(false), 3000);
    }
  };

  const handleWhatsAppShare1 = () => {
    const message = encodeURIComponent(
      `Hello! Please fill and sign the official AIICO Corporate Savings Plan Proposal Form online:\n\n${form1Url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, "_blank");
  };

  const handleWhatsAppShare2 = () => {
    const message = encodeURIComponent(
      `Hello! Please fill and sign the official AIICO Flexible Endowment Plan Proposal Form online:\n\n${form2Url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, "_blank");
  };

  const handleEmailShare1 = () => {
    setEmailModal({
      isOpen: true,
      title: "AIICO Corporate Savings Plan Proposal Form",
      url: form1Url,
    });
  };

  const handleEmailShare2 = () => {
    setEmailModal({
      isOpen: true,
      title: "AIICO Flexible Endowment Plan Proposal Form",
      url: form2Url,
    });
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Agent Authentication PIN Modal */}
      <AgentAuthModal
        isOpen={!isAuthenticated}
        onSuccess={() => setIsAuthenticated(true)}
      />

      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Page Title Header & Logout Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3 text-left">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Accredited Agent Portal</h1>
              <p className="text-xs text-slate-400">Exclusive Link Sharing & Proposal Generator</p>
            </div>
          </div>

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-950/60 border border-red-800/60 text-red-300 hover:bg-red-900/60 transition-all cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Lock Agent Session</span>
            </button>
          )}
        </div>

        {/* Hero Banner */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Agent Link Generator & Sharing Hub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Client Insurance Proposal Forms
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Generate and share fillable proposal form links with your clients via WhatsApp, Email, or Copy Link. Clients fill their application online, draw their signature, and submit directly to your inbox.
          </p>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* FORM 1 CARD */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                  Form 1 • Active
                </span>
                <span className="text-xs font-mono text-slate-500">Ver 12 - 2019</span>
              </div>

              <div className="space-y-2">
                <div className="h-10 w-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <FileText className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  AIICO Corporate Savings Plan Proposal Form
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Includes Identity details, Address proof, Policy contribution terms, Beneficiary tables, Declaration e-signature pad, and NDPR Data Consent.
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Dual E-Signature (Draw canvas or image upload)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Passport Photograph & Document uploads</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Primary & Contingent Beneficiaries Builder</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-800">
              <Link
                href="/forms/corporate-savings"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
              >
                <Edit3 className="h-4 w-4" />
                <span>Open & Fill Form 1 Online</span>
              </Link>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink1}
                  className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Copy className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{copiedForm1 ? "Copied!" : "Copy"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppShare1}
                  className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-emerald-400 hover:bg-emerald-950/40 transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleEmailShare1}
                  className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-sky-400 hover:bg-sky-950/40 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Email</span>
                </button>
              </div>
            </div>
          </div>

          {/* FORM 2 CARD */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                  Form 2 • Active
                </span>
                <span className="text-xs font-mono text-slate-500">Ver 07-2020</span>
              </div>

              <div className="space-y-2">
                <div className="h-10 w-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <FileText className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                  AIICO Flexible Endowment Plan Proposal Form
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Features Medical & Insurance History, Plan Riders (WP / AX), Tax TIN info, Beneficiary tables, Canvas E-Signature, and NDPR Data Consent.
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Medical Evaluation & Health Questionnaire</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Plan Rider Options (Waiver of Premium / AX)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Dual E-Signature (Draw canvas or image upload)</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-800">
              <Link
                href="/forms/flexible-endowment"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
              >
                <Edit3 className="h-4 w-4" />
                <span>Open & Fill Form 2 Online</span>
              </Link>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink2}
                  className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Copy className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{copiedForm2 ? "Copied!" : "Copy"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppShare2}
                  className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-emerald-400 hover:bg-emerald-950/40 transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleEmailShare2}
                  className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-sky-400 hover:bg-sky-950/40 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Email</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Security & Instruction Footer */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>Agent Access Passcode protection enabled. Submissions generate PDF attachments and unique reference verification tags.</span>
          </div>
        </div>

      </div>

      <ShareEmailModal
        isOpen={emailModal.isOpen}
        onClose={() => setEmailModal({ isOpen: false, title: "", url: "" })}
        formTitle={emailModal.title}
        formUrl={emailModal.url}
      />
    </div>
  );
}
