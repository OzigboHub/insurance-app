"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { services } from "@/content/services";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  honeypot: z.string().max(0, "Bot detected"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { honeypot: "" }
  });

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
        throw new Error("Failed to send message. Please try again.");
      }

      setStatus("success");
      reset();
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "An error occurred");
    }
  };

  return (
    <div className="bg-slate-900/40 p-8 rounded-lg shadow-2xl border border-slate-800 backdrop-blur-sm">
      {status === "success" ? (
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-950 border border-green-800 mb-4">
            <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white">Message Sent!</h3>
          <p className="mt-2 text-sm text-slate-400">Thank you for reaching out. We will get back to you shortly.</p>
          <button 
            onClick={() => setStatus("idle")} 
            className="mt-6 text-sm text-blue-400 font-medium hover:text-blue-300"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Honeypot field - hidden from real users */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="honeypot">Don't fill this out if you're human:</label>
            <input type="text" id="honeypot" {...register("honeypot")} tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">Name</label>
              <div className="mt-1">
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className={`py-3 px-4 block w-full bg-slate-950 focus:ring-blue-500 focus:border-blue-500 border-slate-800 text-white rounded-md border ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-450">{errors.name.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-300">Phone</label>
              <div className="mt-1">
                <input
                  type="tel"
                  id="phone"
                  {...register("phone")}
                  className={`py-3 px-4 block w-full bg-slate-950 focus:ring-blue-500 focus:border-blue-500 border-slate-800 text-white rounded-md border ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-450">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label>
              <div className="mt-1">
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className={`py-3 px-4 block w-full bg-slate-950 focus:ring-blue-500 focus:border-blue-500 border-slate-800 text-white rounded-md border ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-450">{errors.email.message}</p>}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="service" className="block text-sm font-medium text-slate-300">Service of Interest</label>
              <div className="mt-1">
                <select
                  id="service"
                  {...register("service")}
                  className={`py-3 px-4 block w-full bg-slate-950 focus:ring-blue-500 focus:border-blue-500 border-slate-800 text-white rounded-md border ${errors.service ? 'border-red-500' : ''}`}
                >
                  <option value="" className="bg-slate-900">Select a service...</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.title} className="bg-slate-900">{s.title}</option>
                  ))}
                  <option value="General Inquiry" className="bg-slate-900">General Inquiry</option>
                </select>
                {errors.service && <p className="mt-1 text-sm text-red-450">{errors.service.message}</p>}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="message" className="block text-sm font-medium text-slate-300">Message</label>
              <div className="mt-1">
                <textarea
                  id="message"
                  rows={4}
                  {...register("message")}
                  className={`py-3 px-4 block w-full bg-slate-950 focus:ring-blue-500 focus:border-blue-500 border-slate-800 text-white rounded-md border ${errors.message ? 'border-red-500' : ''}`}
                ></textarea>
                {errors.message && <p className="mt-1 text-sm text-red-450">{errors.message.message}</p>}
              </div>
            </div>
          </div>

          {status === "error" && (
            <div className="text-red-400 text-sm">{errorMessage}</div>
          )}

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-lg shadow-blue-500/10 text-base font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {status === "submitting" ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
