"use client";

import React, { useState } from "react";
import { Camera, Upload, Trash2, CheckCircle2, FileText } from "lucide-react";

interface ImageUploaderProps {
  label: string;
  sublabel?: string;
  value?: string;
  onChange: (base64Url: string) => void;
  accept?: string;
  required?: boolean;
}

export function ImageUploader({
  label,
  sublabel,
  value = "",
  onChange,
  accept = "image/*",
  required = false,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string>(value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
        {label} {required && <span className="text-blue-400">*</span>}
      </label>

      {sublabel && (
        <p className="text-[11px] text-slate-500 mb-2">{sublabel}</p>
      )}

      {!preview ? (
        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-xl cursor-pointer bg-slate-950/60 hover:bg-slate-900/60 transition-all p-4 text-center group">
          <div className="p-3 bg-slate-900 group-hover:bg-blue-600/20 text-slate-400 group-hover:text-blue-400 rounded-full transition-all mb-2 border border-slate-800">
            <Camera className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium text-slate-300">Upload {label}</span>
          <span className="text-[11px] text-slate-500 mt-1">PNG, JPG, PDF up to 10MB</span>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {preview.startsWith("data:image") ? (
              <img
                src={preview}
                alt={label}
                className="h-14 w-14 object-cover rounded-lg border border-slate-800"
              />
            ) : (
              <div className="h-14 w-14 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800 text-blue-400">
                <FileText className="h-6 w-6" />
              </div>
            )}
            <div>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> File Attached
              </span>
              <span className="text-[11px] text-slate-500 block truncate max-w-[180px] sm:max-w-xs">
                {label} uploaded
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors"
            title="Remove attachment"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
