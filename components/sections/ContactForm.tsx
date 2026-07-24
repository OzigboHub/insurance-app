"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { services } from "@/content/services";
import { Send, CheckCircle2, Sparkles, AlertCircle, HelpCircle, FileText, User, Mail, Phone, MessageSquare } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  service: z.string().min(1, "Please select a policy of interest"),
  message: z.string().min(10, "Please provide a message with at least 10 characters"),
  inquiryType: z.enum(["quote", "general", "claim"]),
  honeypot: z.string().max(0, "Bot detected"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [inquiryType, setInquiryType] = useState<"quote" | "general" | "claim">("quote");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      honeypot: "",
      inquiryType: "quote",
      service: services[0]?.title || "Motor Insurance",
    },
  });

  const selectedService = watch("service");

  const onSubmit = async (data: ContactFormValues) => {
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to send message. Please try again.");
      }

      setStatus("success");
      reset();
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "An error occurred while submitting your request.");
    }
  };

  return (
    <div className="relative bg-slate-900/60 p-6 sm:p-10 rounded-2xl shadow-2xl border border-slate-800 backdrop-blur-xl overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Form Mode Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">Direct Consultation</h2>
        </div>

        <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setInquiryType("quote");
              setValue("inquiryType", "quote");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inquiryType === "quote"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Get Quote
          </button>
          <button
            type="button"
            onClick={() => {
              setInquiryType("general");
              setValue("inquiryType", "general");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inquiryType === "general"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            General Inquiry
          </button>
        </div>
      </div>

      {status === "success" ? (
        <div className="text-center py-12 animate-in zoom-in-95 duration-300">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 mb-6 shadow-xl shadow-emerald-900/30">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Request Submitted Successfully!</h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed mb-6">
            Thank you for reaching out to AIICO Insurance. An accredited agent will review your inquiry and contact you within 15 minutes.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 mb-8">
            <span>Reference Tag:</span>
            <span className="font-mono font-bold text-blue-400">#AIC-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
          <div>
            <button
              onClick={() => setStatus("idle")}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
            >
              Send Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Honeypot */}
          <div className="hidden" aria-hidden="true">
            <input type="text" id="honeypot" {...register("honeypot")} tabIndex={-1} autoComplete="off" />
          </div>

          {/* Visual Policy Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Select Policy / Coverage Area <span className="text-blue-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {services.map((srv) => {
                const Icon = srv.icon;
                const isSelected = selectedService === srv.title;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => setValue("service", srv.title, { shouldValidate: true })}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10 ring-1 ring-blue-500/50"
                        : "bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium truncate">{srv.title}</span>
                  </button>
                );
              })}
            </div>
            {errors.service && <p className="mt-2 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" />{errors.service.message}</p>}
          </div>

          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 gap-y-5 sm:grid-cols-2 sm:gap-x-6">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  id="name"
                  placeholder="e.g. John Doe"
                  {...register("name")}
                  className={`pl-10 pr-4 py-3 block w-full bg-slate-950/80 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-slate-800 text-white placeholder-slate-600 rounded-xl text-sm transition-all border ${
                    errors.name ? 'border-red-500/80 ring-1 ring-red-500/50' : ''
                  }`}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-medium text-slate-300 mb-1.5">
                Phone Number <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  placeholder="+234 800 000 0000"
                  {...register("phone")}
                  className={`pl-10 pr-4 py-3 block w-full bg-slate-950/80 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-slate-800 text-white placeholder-slate-600 rounded-xl text-sm transition-all border ${
                    errors.phone ? 'border-red-500/80 ring-1 ring-red-500/50' : ''
                  }`}
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  id="email"
                  placeholder="john@example.com"
                  {...register("email")}
                  className={`pl-10 pr-4 py-3 block w-full bg-slate-950/80 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-slate-800 text-white placeholder-slate-600 rounded-xl text-sm transition-all border ${
                    errors.email ? 'border-red-500/80 ring-1 ring-red-500/50' : ''
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="message" className="block text-xs font-medium text-slate-300 mb-1.5">
                Message / Policy Details <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-3.5 pointer-events-none text-slate-500">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Describe your coverage requirements, vehicle make/model, or specific question..."
                  {...register("message")}
                  className={`pl-10 pr-4 py-3 block w-full bg-slate-950/80 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-slate-800 text-white placeholder-slate-600 rounded-xl text-sm transition-all border ${
                    errors.message ? 'border-red-500/80 ring-1 ring-red-500/50' : ''
                  }`}
                ></textarea>
              </div>
              {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
            </div>
          </div>

          {status === "error" && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl shadow-blue-600/25 disabled:opacity-50 transition-all cursor-pointer"
            >
              {status === "submitting" ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Inquiry...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Inquiry Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

