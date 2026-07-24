import { ContactForm } from "@/components/sections/ContactForm";
import { siteConfig } from "@/content/site-config";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch for your insurance quotes and inquiries.",
};

export default function ContactPage() {
  return (
    <div className="bg-slate-950 py-16 sm:py-24 text-slate-100 flex-grow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
            Get a Quote
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Fill out the form below or reach out directly via WhatsApp or phone. We're here to help you secure the best coverage.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-slate-900/40 p-6 rounded-lg shadow-2xl border border-slate-800 backdrop-blur-sm flex flex-col gap-4">
              <h3 className="text-lg font-medium text-white">Direct Contact</h3>
              
              <a href={`https://wa.me/${siteConfig.contact.whatsapp}?text=Hello,%20I%20want%20to%20get%20an%20insurance%20quote.`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-green-400 transition-colors">
                <MessageCircle className="h-6 w-6 text-green-400" />
                <span>Chat on WhatsApp</span>
              </a>
              
              <a href={`tel:${siteConfig.contact.phone}`} className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-colors">
                <Phone className="h-6 w-6 text-blue-400" />
                <span>{siteConfig.contact.phone}</span>
              </a>
              
              <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-colors">
                <Mail className="h-6 w-6 text-blue-400" />
                <span>{siteConfig.contact.email}</span>
              </a>
              
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="h-6 w-6 text-slate-500" />
                <span>{siteConfig.contact.address}</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
