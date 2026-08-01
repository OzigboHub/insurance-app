import Link from "next/link";
import { siteConfig } from "@/content/site-config";
import { Mail, Phone, MapPin } from "lucide-react";



export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="text-2xl font-bold text-white tracking-tight">
              {siteConfig.name}
            </Link>
            <p className="text-sm leading-6 text-slate-400">
              {siteConfig.description}
            </p>

          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-white">Services</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li><Link href="/services#motor" className="text-sm leading-6 hover:text-white">Motor Insurance</Link></li>
                  <li><Link href="/services#travel" className="text-sm leading-6 hover:text-white">Travel Insurance</Link></li>
                  <li><Link href="/services#life" className="text-sm leading-6 hover:text-white">Life Insurance</Link></li>
                  <li><Link href="/services#health" className="text-sm leading-6 hover:text-white">Health Insurance</Link></li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-white">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li><Link href="/about" className="text-sm leading-6 hover:text-white">About Us</Link></li>
                  <li><Link href="/faq" className="text-sm leading-6 hover:text-white">FAQ</Link></li>
                  <li><Link href="/contact" className="text-sm leading-6 hover:text-white">Contact</Link></li>
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Contact Info</h3>
              <ul role="list" className="mt-6 space-y-4">
                <li className="flex gap-x-3 text-sm leading-6">
                  <Phone className="h-5 w-5 text-slate-500 flex-shrink-0" />
                  <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-white">{siteConfig.contact.phone}</a>
                </li>
                <li className="flex gap-x-3 text-sm leading-6">
                  <Mail className="h-5 w-5 text-slate-500 flex-shrink-0" />
                  <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white">{siteConfig.contact.email}</a>
                </li>
                <li className="flex gap-x-3 text-sm leading-6">
                  <MapPin className="h-5 w-5 text-slate-500 flex-shrink-0" />
                  <span>{siteConfig.contact.address}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-slate-900 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-slate-500">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
