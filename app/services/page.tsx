import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ShieldCheck, Award, Zap, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insurance Services & Policies | AIICO Insurance Protection",
  description: "Explore our comprehensive range of AIICO insurance policies tailored for personal, health, general property, and corporate business protection.",
};

export default function ServicesPage() {
  return (
    <div className="bg-slate-950 flex-grow text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Hero Header Section */}
      <div className="relative py-20 sm:py-28 overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950">
        {/* Glow Spheres */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-10 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner mb-6 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4" />
            <span>Comprehensive AIICO Insurance Portfolio</span>
          </div> */}

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Tailored Protection for Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">Life, Assets & Business</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 leading-relaxed font-normal">
            Whether you are securing your family&apos;s healthcare, protecting personal vehicles, or safeguarding enterprise assets, we provide seamless coverage designed around your needs.
          </p>

          {/* Stats & Highlights Bar */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 text-blue-400 mb-1">
                <Zap className="h-4 w-4" />
                <span className="text-xl font-bold text-white">Instant</span>
              </div>
              <p className="text-xs text-slate-400">Digital Certificate</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 text-indigo-400 mb-1">
                <Award className="h-4 w-4" />
                <span className="text-xl font-bold text-white">99.4%</span>
              </div>
              <p className="text-xs text-slate-400">Claims Settlement Rate</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 text-sky-400 mb-1">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xl font-bold text-white">1,500+</span>
              </div>
              <p className="text-xs text-slate-400">Partner Hospitals</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-xl font-bold text-white">24 / 7</span>
              </div>
              <p className="text-xs text-slate-400">Direct Agent Assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Services Grid */}
      <ServicesGrid />
    </div>
  );
}
