"use client";

import { useState } from "react";
import { ChevronDown, Phone, Mail } from "lucide-react";
import { siteConfig } from "@/content/site-config";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "auto" | "life" | "travel" | "claims";
}

const defaultFaqs: FAQItem[] = [
  {
    id: "1",
    category: "claims",
    question: "How do I file a claim?",
    answer: "You can file a claim online, by phone, or via email. For auto claims, contact us within 24 hours. We'll guide you through the process and handle most of the paperwork.",
  },
  {
    id: "2",
    category: "auto",
    question: "What's covered under my policy?",
    answer: "Your coverage depends on the plan you selected. Log into your account to view your policy details, or contact us and we'll explain your specific coverage in plain English.",
  },
  {
    id: "3",
    category: "auto",
    question: "Can I adjust my coverage mid-year?",
    answer: "Yes, you can adjust your coverage limits, add endorsements, or modify deductibles at any time during your policy period. Simply reach out to your agent.",
  },
  {
    id: "4",
    category: "claims",
    question: "How long does claims processing take?",
    answer: "Most standard claims are processed within 3 to 5 business days. Complex claims may take slightly longer, but we provide regular updates throughout the process.",
  },
  {
    id: "5",
    category: "life",
    question: "Do you offer discounts?",
    answer: "Yes! We offer multi-policy discounts, safe driver incentives, no-claims bonuses, and annual payment discounts.",
  },
  {
    id: "6",
    category: "auto",
    question: "How do I confirm my motor insurance is genuine?",
    answer: "You can quickly verify your car insurance certificate in Nigeria by dialing the USSD code *565*11# on your phone or by visiting the official askniid.org database website.",
  },
  {
    id: "7",
    category: "travel",
    question: "Is AIICO Travel Insurance recognized globally?",
    answer: "Yes, our travel insurance is recognized and valid globally. Our Schengen Travel Insurance meets all requirements for Schengen visa applications.",
  },
  {
    id: "8",
    category: "life",
    question: "What is an Annuity Plan and how does it work?",
    answer: "An Annuity Plan provides guaranteed regular income during retirement, protecting you against outliving your savings with optional spousal benefits.",
  },
];

export function FAQAccordion() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  // Open items set to 0 and 1 by default (matching the image where top 2 items are expanded)
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]);

  const categoryButtons = [
    { id: "auto", label: "Auto insurance" },
    { id: "life", label: "Life insurance" },
    { id: "travel", label: "Travel insurance" },
    { id: "claims", label: "Claims & servicing" },
  ];

  const filteredFaqs = defaultFaqs.filter((faq) => {
    if (activeCategory === "all") return true;
    return faq.category === activeCategory;
  });

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCategoryClick = (catId: string) => {
    if (activeCategory === catId) {
      setActiveCategory("all");
    } else {
      setActiveCategory(catId);
    }
    setOpenIndices([0]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
      
      {/* 1. Main White FAQ Accordion Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl space-y-4">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndices.includes(idx);
          return (
            <div key={faq.id} className="space-y-3">
              {/* Dark Charcoal Question Button */}
              <button
                onClick={() => toggleIndex(idx)}
                className="w-full bg-[#2A2B2A] hover:bg-[#202120] text-white font-medium text-left px-6 py-4.5 rounded-xl flex items-center justify-between shadow-sm transition-colors duration-200"
              >
                <span className="text-sm sm:text-base font-semibold pr-4">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-slate-300 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Answer Text Area inside the White Card */}
              {isOpen && (
                <div className="px-6 py-2 text-slate-500 text-sm sm:text-base leading-relaxed animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 2. White Category Buttons Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryButtons.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`py-4 px-6 rounded-xl font-semibold text-sm text-center transition-all duration-200 shadow-md ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-blue-500/30 scale-[1.02]"
                    : "bg-[#2A2B2A] hover:bg-[#202120] text-white"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Dark Navy "Didn't find what you're looking for?" Callout Card */}
      <div className="bg-[#051329] border border-slate-800 rounded-3xl p-8 sm:p-10 text-center shadow-2xl space-y-4">
        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Didn&apos;t find what you&apos;re looking for?
        </h3>
        
        <p className="text-slate-300 text-sm sm:text-base">
          Our insurance experts are here to help. Reach out anytime.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-blue-300 text-sm sm:text-base font-medium">
          <a
            href={`tel:${siteConfig.contact.phone}`}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span>{siteConfig.contact.phone}</span>
          </a>

          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>{siteConfig.contact.email}</span>
          </a>
        </div>
      </div>

      {/* 4. Sub-footer Tagline */}
      <div className="pt-6 pb-8 text-center text-slate-400 text-xs sm:text-sm space-y-1">
        <p className="font-medium">
          {siteConfig.name} — Your trusted partner for life, health, motor, and travel insurance
        </p>
        <p className="text-slate-500">
          Expert advice • Fast claims • Transparent coverage
        </p>
      </div>

    </div>
  );
}


