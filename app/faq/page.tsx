import { FAQAccordion } from "@/components/sections/FAQAccordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Got questions? Find answers to frequently asked questions about our AIICO insurance policies, claims, annuities, and more.",
};

export default function FAQPage() {
  return (
    <div className="bg-slate-950 flex-grow text-slate-100">
      <div className="bg-slate-900/50 py-16 text-center border-b border-slate-900">
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight">
          FAQ
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-xl text-slate-300">
          Everything you need to know about our insurance plans, claims, and services.
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FAQAccordion />
      </div>
    </div>
  );
}
