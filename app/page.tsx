import { Hero } from "@/components/sections/Hero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
// import { FAQAccordion } from "@/components/sections/FAQAccordion";
import Link from "next/link";
import { Shield, ArrowRight, MessageCircle } from "lucide-react";
import { siteConfig } from "@/content/site-config";

export default function Home() {
  return (
    <div className="bg-slate-950 flex-grow text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Hero */}
      <Hero />

      {/* Services Section Header */}
      <div className="pt-16 pb-4 text-center max-w-3xl mx-auto px-4">
        {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
          <Shield className="h-3.5 w-3.5" />
          <span>Tailored AIICO Insurance Coverage</span>
        </div> */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore Our Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Policies</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
          From vehicle protection and international travel medicals to family life savings and corporate assets, we provide seamless coverage built around your life.
        </p>
      </div>

      <ServicesGrid limit={6} showFilters={true} />

      {/* Call to Action Banner */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/80 via-slate-900 to-indigo-950/80 border border-blue-500/30 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
          <div className="absolute -right-12 -top-12 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left max-w-2xl">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Ready to Secure Your Insurance Coverage Today?
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-300">
                Get an instant quote or chat directly with our accredited AIICO Insurance representative on WhatsApp with zero obligation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-500/30 transition-all"
              >
                <span>Get Instant Quote</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}?text=Hello,%20I%20want%20to%20get%20an%20insurance%20quote.`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-900/30 transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Advisor</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section Header */}
      {/* <div className="pt-12 text-center max-w-3xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Got Questions? <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">We Have Answers</span>
        </h2>
      </div>

      <FAQAccordion /> */}
    </div>
  );
}
