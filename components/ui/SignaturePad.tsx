"use client";

import React, { useRef, useState, useEffect } from "react";
import { Edit3, Upload, Trash2, CheckCircle2, RefreshCw, Image as ImageIcon } from "lucide-react";

interface SignaturePadProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export function SignaturePad({
  label = "Applicant Signature",
  value = "",
  onChange,
  error,
  required = false,
}: SignaturePadProps) {
  const [mode, setMode] = useState<"draw" | "upload">("draw");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [uploadedPreview, setUploadedPreview] = useState<string>("");

  useEffect(() => {
    if (value) {
      if (value.startsWith("data:image")) {
        setUploadedPreview(value);
        setHasDrawn(true);
      }
    }
  }, [value]);

  // Canvas drawing setup
  useEffect(() => {
    if (mode === "draw" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Set canvas resolution for crisp rendering
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        ctx.scale(2, 2);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
  }, [mode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas && hasDrawn) {
      const dataUrl = canvas.toDataURL("image/png");
      onChange(dataUrl);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setHasDrawn(false);
    setUploadedPreview("");
    onChange("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUploadedPreview(result);
      setHasDrawn(true);
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label} {required && <span className="text-blue-400">*</span>}
        </label>
        
        {/* Toggle Mode Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode("draw");
              clearCanvas();
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
              mode === "draw"
                ? "bg-blue-600 text-white font-medium shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Draw in App</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("upload");
              clearCanvas();
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
              mode === "upload"
                ? "bg-blue-600 text-white font-medium shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload Image</span>
          </button>
        </div>
      </div>

      {mode === "draw" ? (
        <div className="relative">
          <div className="relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden group">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-36 touch-none cursor-crosshair block"
            />

            {!hasDrawn && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-600 text-xs font-medium">
                Sign inside this box using mouse or touch finger
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-slate-500">
              {hasDrawn ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Signature recorded
                </span>
              ) : (
                "Draw your signature above"
              )}
            </span>

            {hasDrawn && (
              <button
                type="button"
                onClick={clearCanvas}
                className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-900 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Clear / Re-sign</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {!uploadedPreview ? (
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-xl cursor-pointer bg-slate-950/60 hover:bg-slate-900/60 transition-all p-4 text-center">
              <div className="p-3 bg-blue-500/10 rounded-full text-blue-400 mb-2">
                <ImageIcon className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-slate-300">Click to upload signature image</span>
              <span className="text-[11px] text-slate-500 mt-1">PNG, JPG, WebP up to 5MB</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-32 bg-slate-900 rounded-lg p-2 flex items-center justify-center border border-slate-800">
                  <img src={uploadedPreview} alt="Signature Preview" className="max-h-full max-w-full object-contain invert" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Signature Uploaded
                  </span>
                  <span className="text-[11px] text-slate-500 block">Attached to proposal form</span>
                </div>
              </div>

              <button
                type="button"
                onClick={clearCanvas}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors"
                title="Remove signature"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}
