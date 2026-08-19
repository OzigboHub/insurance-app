"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Smartphone, MonitorCheck, ArrowUpRight } from "lucide-react";

export function PwaInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Listen for Chrome/Android/Edge beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosGuide(!showIosGuide);
    }
  };

  if (!showBanner && !isIos) return null;

  return (
    <>
      {/* Floating PWA Install Banner */}
      <div className="fixed bottom-20 right-4 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-auto bg-slate-900/95 border border-slate-800 backdrop-blur-xl rounded-2xl p-4 shadow-2xl space-y-3 animate-in slide-in-from-bottom-5 duration-300">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-500/30 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
              <Download className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-wide">Install AIICO App</h4>
              <p className="text-[11px] text-slate-400">Add to Home Screen for quick offline access & forms hub.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowBanner(false)}
            className="p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleInstallClick}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
          >
            <MonitorCheck className="h-3.5 w-3.5" />
            <span>Install Web App</span>
          </button>
        </div>

        {/* iOS Instruction Modal Popup */}
        {showIosGuide && (
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <p className="font-semibold text-white flex items-center gap-1">
              <Smartphone className="h-3.5 w-3.5 text-blue-400" /> Safari iOS Installation:
            </p>
            <ol className="list-decimal list-inside space-y-0.5 text-slate-400">
              <li>Tap the <strong className="text-white">Share</strong> button at bottom of Safari.</li>
              <li>Scroll down and tap <strong className="text-white">'Add to Home Screen'</strong>.</li>
            </ol>
          </div>
        )}
      </div>
    </>
  );
}
