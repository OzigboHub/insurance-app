import Link from "next/link";
import { siteConfig } from "@/content/site-config";
import { ShieldCheck, Award, Users, HeartHandshake, Zap, Clock, Phone, ArrowRight, CheckCircle2, Building2, FileCheck2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | AIICO Insurance Accredited Representative",
  description: "Learn about our commitment to providing tailored life, motor, health, and corporate insurance solutions through AIICO Insurance PLC.",
};

const stats = [
  { value: "50+ Yrs", label: "AIICO Corporate Legacy", icon: Building2 },
  { value: "99.4%", label: "Claims Advisory Settlement", icon: FileCheck2 },
  { value: "< 15 Mins", label: "Avg Consultation Turnaround", icon: Clock },
  { value: "1,500+", label: "Accredited Health Network", icon: Users },
];

const coreValues = [
  {
    icon: ShieldCheck,
    title: "Tailored Policy Protection",
    description: "Every individual, family, and business has unique risks. We craft bespoke insurance portfolios that eliminate coverage gaps while staying budget-friendly.",
  },
  {
    icon: Zap,
    title: "Fast-Track Claims Processing",
    description: "When incidents occur, we act as your personal advocate—assisting with documentation, verification, and pushing for prompt payout settlements.",
  },
  {
    icon: HeartHandshake,
    title: "Unwavering Integrity",
    description: "No hidden fine print or ambiguous exclusions. We break down complex policy clauses so you make fully informed decisions with complete confidence.",
  },
  {
    icon: Award,
    title: "AIICO Institutional Trust",
    description: "Backed by AIICO Insurance PLC, West Africa's leading insurer with financial strength, solvency resilience, and decades of market leadership.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-slate-950 flex-grow text-slate-100 selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Dynamic Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Hero Banner Header */}
      <div className="relative py-16 sm:py-24 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4" />
            <span>Accredited AIICO Representative</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Protecting What Matters Most <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">
              With Proven Excellence
            </span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Welcome to our agency. We are dedicated representatives of <strong className="text-white font-semibold">AIICO Insurance PLC</strong>, delivering transparent coverage, rapid claims advisory, and personalized financial security for families & businesses.
          </p>
        </div>
      </div>

      {/* Trust & Proof Metrics Grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl hover:border-slate-700 transition-all duration-300 group"
              >
                <div className="p-3 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Story & Agency Overview Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Our Vision & Philosophy
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-snug">
              Demystifying Insurance for Peace of Mind
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Navigating insurance policies shouldn&apos;t be confusing or overwhelming. Our agency was established with a singular vision: to bring clarity, speed, and personalized care to insurance representation in Nigeria.
            </p>
            <p className="text-slate-300 text-base leading-relaxed">
              Through our direct partnership with AIICO Insurance PLC, we combine top-tier institutional financial backing with boutique, client-first advisory service. Whether you are insuring your vehicle, securing a travel Schengen visa policy, building a life savings plan, or protecting corporate assets—we are here every step of the way.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Licensed Representative",
                "Direct Policy Underwriting",
                "Dedicated Claims Advocate",
                "Transparent Exclusions",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Advisor Spotlight Card */}
          <div className="mt-12 lg:mt-0 lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md relative p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl backdrop-blur-xl">
              <div className="absolute -top-4 -right-4 p-3 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 backdrop-blur-md">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-bold text-white mb-1">Emmanuel Oziegbe</h3>
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-6">Accredited AIICO Financial Advisor</p>

              <div className="space-y-4 text-sm border-t border-b border-slate-800/80 py-6 my-6">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Specialization</span>
                  <span className="font-medium text-white">Life, Motor & Travel</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Phone Contact</span>
                  <a href={`tel:${siteConfig.contact.phone}`} className="font-semibold text-blue-400 hover:underline">
                    {siteConfig.contact.phone}
                  </a>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Email Address</span>
                  <a href={`mailto:${siteConfig.contact.email}`} className="font-semibold text-blue-400 hover:underline">
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/contact"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
                >
                  <span>Request Quote</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-slate-200 bg-slate-950 hover:bg-slate-900 border border-slate-800 transition-colors"
                >
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span>Call Direct</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-slate-900/40 border-y border-slate-800/80 py-20 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Work With Our Agency?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-400">
              We stand apart through personalized advisory, transparent communication, and rapid execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-xl hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 group"
                >
                  <div className="p-3.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 w-fit mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{val.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal">{val.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-950/50 to-slate-900 border border-blue-500/30 p-8 sm:p-12 text-center overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Ready to Secure Your Future with Confidence?
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
            Get an instant insurance quote tailored to your exact needs. Our accredited advisors are ready to guide you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/25 hover:scale-[1.02]"
            >
              <span>Get Free Quote Now</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-slate-200 bg-slate-950 hover:bg-slate-900 border border-slate-800 transition-all"
            >
              <Phone className="h-5 w-5 text-blue-400" />
              <span>Call Advisor: {siteConfig.contact.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

