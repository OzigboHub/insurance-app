"use client";

import { faqs } from "@/content/faq";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function FAQAccordion() {
  const [activeCategory, setActiveCategory] = useState<string>("General");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Extract unique categories
  const categories = Array.from(new Set(faqs.map((faq) => faq.category || "General")));

  // Filter FAQs based on active category
  const filteredFaqs = faqs.filter((faq) => (faq.category || "General") === activeCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setOpenIndex(0); // Reset accordion to first item open
  };

  return (
    <div className="bg-slate-950 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white text-center mb-8">Frequently Asked Questions</h2>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 border-b border-slate-900 pb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeCategory === category
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-850"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div key={index} className="border border-slate-800/80 rounded-lg overflow-hidden bg-slate-900/25">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center bg-slate-900/40 hover:bg-slate-900/80 transition-colors focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-white">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-slate-950/40 border-t border-slate-900">
                  <p className="text-slate-300 whitespace-pre-line leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
