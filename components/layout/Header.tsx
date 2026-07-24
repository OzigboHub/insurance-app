"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Shield, Sparkles } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/content/site-config";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services & Policies", href: "/services" },
    { name: "FAQ Hub", href: "/faq" },
    { name: "Contact & Quote", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl text-slate-100">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Accredited Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform duration-200">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold text-white tracking-tight group-hover:text-blue-300 transition-colors">
                {siteConfig.name}
              </span>
              <span className="hidden sm:flex items-center gap-1 text-[10px] font-semibold text-blue-400">
                <Sparkles className="h-2.5 w-2.5 text-blue-400" /> Accredited AIICO Agent
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-md">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={`tel:${siteConfig.contact.phone}`}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-blue-400 transition-colors bg-slate-900/50 px-3 py-2 rounded-xl border border-slate-800"
          >
            <Phone className="h-3.5 w-3.5 text-blue-400" />
            <span>{siteConfig.contact.phone}</span>
          </a>

          <Link
            href="/contact"
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1.5 px-4 pb-4 pt-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="mt-4 border-t border-slate-800 pt-4 space-y-2">
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-blue-400 bg-slate-900 border border-slate-800"
              >
                <Phone className="h-4 w-4" />
                <span>Call Advisor: {siteConfig.contact.phone}</span>
              </a>
              <Link
                href="/contact"
                className="block w-full rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-500 shadow-lg shadow-blue-500/25"
                onClick={() => setIsMenuOpen(false)}
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
