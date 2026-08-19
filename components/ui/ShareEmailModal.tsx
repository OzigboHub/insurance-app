"use client";

import React, { useState } from "react";
import { Mail, Send, X, CheckCircle2, AlertCircle, Copy, ExternalLink } from "lucide-react";

interface ShareEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  formTitle: string;
  formUrl: string;
}

export function ShareEmailModal({
  isOpen,
  onClose,
  formTitle,
  formUrl,
}: ShareEmailModalProps) {
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [copiedText, setCopiedText] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  if (!isOpen) return null;

  const emailSubject = `AIICO Insurance Proposal Form: ${formTitle}`;
  const emailBodyText = `Hello ${clientName || "Valued Client"},\n\nPlease fill out and e-sign your official ${formTitle} online using the secure link below:\n\n${formUrl}\n\nBest regards,\nAIICO Insurance Accredited Agent`;

  // 1. Open Native Mail App / Webmail (No Resend Required)
  const handleOpenMailApp = () => {
    if (!clientEmail || !clientEmail.includes("@")) {
      alert("Please enter a valid client email address.");
      return;
    }
    const mailtoUrl = `mailto:${encodeURIComponent(clientEmail)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBodyText)}`;
    window.open(mailtoUrl, "_blank");
    setStatus("success");
    setStatusMsg(`Opened Mail composer for ${clientEmail}!`);
  };

  // 2. Copy Email Message Text to Clipboard
  const handleCopyEmailText = () => {
    const fullText = `Subject: ${emailSubject}\n\nTo: ${clientEmail || "[Client Email]"}\n\n${emailBodyText}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
    }
  };

  // 3. Send Direct Email via Server API
  const handleSendDirectEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientEmail || !clientEmail.includes("@")) {
      setStatus("error");
      setStatusMsg("Please provide a valid client email address.");
      return;
    }

    setStatus("submitting");
    setStatusMsg("");

    try {
      const res = await fetch("/api/forms/share-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientEmail,
          clientName: clientName || "Valued Client",
          formTitle,
          formUrl,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setStatusMsg(data.message || `Proposal invitation email sent to ${clientEmail}!`);
      } else {
        throw new Error(data.message || "Failed to dispatch email via server");
      }
    } catch (err: any) {
      setStatus("error");
      setStatusMsg(err.message || "Server dispatch unavailable. You can click 'Open Mail App (No Resend)' below!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Send Form via Email</h3>
              <p className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-xs">{formTitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {status === "success" ? (
          <div className="text-center py-4 space-y-4">
            <div className="h-14 w-14 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="text-sm font-semibold text-white">{statusMsg}</p>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setClientEmail("");
                onClose();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendDirectEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Client's Email Address <span className="text-sky-400">*</span>
              </label>
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="e.g. client@gmail.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Client's Full Name (Optional)
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Mr. Okonkwo"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder-slate-600"
              />
            </div>

            {status === "error" && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/80 text-xs text-red-300 space-y-2">
                <p className="flex items-center gap-1 font-semibold">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" /> {statusMsg}
                </p>
              </div>
            )}

            <div className="pt-2 space-y-2">
              {/* Option 1: Send via Server */}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 shadow-lg shadow-sky-600/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {status === "submitting" ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending Email...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Form Link via Server</span>
                  </>
                )}
              </button>

              {/* Option 2: Open Mail App (No Resend API Key Required!) */}
              <button
                type="button"
                onClick={handleOpenMailApp}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-indigo-950/70 hover:bg-indigo-900/70 border border-indigo-700/80 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 text-indigo-400" />
                <span>Open Mail App (No Resend Required)</span>
              </button>

              {/* Option 3: Copy Email Text */}
              <button
                type="button"
                onClick={handleCopyEmailText}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                <Copy className="h-3.5 w-3.5 text-sky-400" />
                <span>{copiedText ? "Email Text Copied!" : "Copy Email Text & Link to Paste Anywhere"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
