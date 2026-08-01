"use client";

import { services, ServiceItem } from "@/content/services";
import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, ArrowRight, X, Shield, Info } from "lucide-react";

interface ServicesGridProps {
  limit?: number;
  showFilters?: boolean;
}

export function ServicesGrid({ limit, showFilters = true }: ServicesGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);

  const categories = [
    { id: "all", label: "All Policies" },
    { id: "personal", label: "Motor & Travel" },
    { id: "health", label: "Health & Life" },
    { id: "general", label: "Property & Asset" },
    { id: "business", label: "Corporate Business" },
  ];

  const filteredServices = services.filter((service) => {
    if (selectedCategory === "all") return true;
    return service.category === selectedCategory;
  });

  const displayServices = limit ? filteredServices.slice(0, limit) : filteredServices;

  return (
    <div className="relative py-12 sm:py-20 overflow-hidden">
      {/* Subtle ambient lighting spot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Category Filters */}
        {showFilters && (
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-12 sm:mb-16">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 backdrop-blur-md border ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400/30 shadow-lg shadow-blue-500/25 scale-[1.02]"
                      : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between bg-slate-900/50 hover:bg-slate-900/80 rounded-2xl p-7 border border-slate-800/90 hover:border-blue-500/40 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1 overflow-hidden"
              >
                {/* Background Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div>
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="relative">
                      <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="absolute -inset-1 rounded-xl bg-blue-500/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>

                    {service.badge && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20 backdrop-blur-md">
                        <CheckCircle2 className="h-3 w-3 text-blue-400" />
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-white tracking-tight mb-3 group-hover:text-blue-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Highlight Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {service.highlights.map((h, i) => (
                      <span key={i} className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 mb-8 border-t border-slate-800/80 pt-5">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 mt-auto gap-3">
                  <button
                    onClick={() => setActiveModalService(service)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Info className="h-3.5 w-3.5 text-blue-400" />
                    <span>Quick Info</span>
                  </button>

                  <Link
                    href={`/contact?service=${service.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200"
                  >
                    <span>Get Quote</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Info Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{activeModalService.title}</h3>
                  <span className="text-xs text-blue-400 font-medium">{activeModalService.badge || "Verified AIICO Policy"}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveModalService(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {activeModalService.description}
            </p>

            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 mb-6">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Key Policy Coverage</h4>
              <ul className="space-y-2">
                {activeModalService.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveModalService(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
              <Link
                href={`/contact?service=${activeModalService.slug}`}
                onClick={() => setActiveModalService(null)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-colors"
              >
                <span>Proceed to Quote Request</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
