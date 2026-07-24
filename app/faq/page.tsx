import { FAQAccordion } from "@/components/sections/FAQAccordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insurance Questions Answered | AIICO Insurance FAQ",
  description: "Get clarity on your coverage, claims, and policies. We've compiled answers to the questions we hear most.",
};

export default function FAQPage() {
  return (
    <div className="bg-[#0B1728] min-h-screen flex-grow text-slate-100 py-16 sm:py-24 selection:bg-blue-500 selection:text-white">
      {/* Header Container */}
      <div className="text-center max-w-3xl mx-auto px-4 mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
          Insurance questions answered
        </h1>

        <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Get clarity on your coverage, claims, and policies. We&apos;ve compiled answers to the questions we hear most.
        </p>
      </div>

      {/* Accordions & Cards matching image layout */}
      <FAQAccordion />
    </div>
  );
}
