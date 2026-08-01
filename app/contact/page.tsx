import { ContactForm } from "@/components/sections/ContactForm";
import { siteConfig } from "@/content/site-config";
import { Mail, Phone, MapPin, MessageCircle, Clock, ShieldCheck, Headphones, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Get a Quote | AIICO Insurance Advisor",
  description: "Get in touch with an accredited AIICO Insurance representative for instant quotes, policy renewals, claims support, and expert guidance.",
};

export default function ContactPage() {
  return (
    <div className="bg-slate-950 flex-grow text-slate-100 selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 backdrop-blur-md">
            <Headphones className="h-4 w-4" />
            <span>24/7 Agent Availability</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Let&apos;s Discuss Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">Insurance Protection</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Have a question about coverage options, premiums, or claims? Reach out directly via WhatsApp, phone, or fill out our simple consultation form below.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Contact Hub */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Highlight Box */}
            <div className="group relative bg-gradient-to-br from-emerald-950/40 to-slate-900/60 p-6 rounded-2xl border border-emerald-500/30 backdrop-blur-xl shadow-xl hover:border-emerald-500/60 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      WhatsApp Quick Chat
                    </h3>
                    <p className="text-xs text-emerald-400 font-medium">Advisor Online • &lt; 5 Min Response</p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp}?text=Hello,%20I%20want%20to%20get%20an%20insurance%20quote.`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-white transition-colors"
                  aria-label="Chat on WhatsApp"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </a>
              </div>

              <p className="mt-4 text-xs text-slate-300 leading-relaxed">
                Connect instantly with our designated AIICO insurance advisor on WhatsApp for instant quote estimations and policy inquiries.
              </p>

              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}?text=Hello,%20I%20want%20to%20get%20an%20insurance%20quote.`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/30 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Start WhatsApp Consultation</span>
              </a>
            </div>

            {/* Direct Channels List */}
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl space-y-5">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Direct Channels</h3>

              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-blue-500/40 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Direct Telephone</p>
                    <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{siteConfig.contact.phone}</p>
                    <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{siteConfig.contact.phone2}</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </a>

              {/* Email */}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-blue-500/40 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Official Email</p>
                    <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{siteConfig.contact.email}</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </a>

              {/* Address & Hours */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Office Location</p>
                    <p className="text-xs text-slate-400 mt-0.5">{siteConfig.contact.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-slate-900 pt-3">
                  <Clock className="h-4 w-4 text-slate-500 shrink-0" />
                  <span className="text-xs text-slate-400">Mon - Fri: 8:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>

            {/* Trust Assurance Card */}
            <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-900/40 text-xs text-slate-300 flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Verified AIICO Insurance Representative</p>
                <p className="mt-1 text-slate-400 leading-relaxed">
                  All requests and information submitted are handled directly by accredited AIICO agent representatives with zero broker markup.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
