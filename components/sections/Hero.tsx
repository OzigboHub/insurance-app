import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import { siteConfig } from "@/content/site-config";
import Globe from "@/components/ui/Globe";

export function Hero() {
  return (
    <div className="relative bg-slate-950 overflow-hidden py-16 sm:py-24 lg:py-32">
      {/* Globe Background */}
      <div className="absolute inset-0 z-0 opacity-25 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] lg:w-[1000px] lg:h-[1000px] aspect-square flex items-center justify-center">
          <Globe
            speed={0.5}
            smoothing={8}
            dots={{ color: "#e2e8f0", size: 5, density: 6, allDots: false }}
            oceanColor="rgba(0,0,0,0)"
            showOutline={false}
            showGrid={false}
            scale={8}
            stopOnHover={false}
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block xl:inline">Secure your future with</span>{" "}
              <span className="block text-blue-400 xl:inline">AIICO Insurance</span>
            </h1>
            <p className="mt-3 text-base text-slate-400 sm:mt-5 sm:text-xl">
              {siteConfig.description} We offer tailored plans that give you peace of mind and protect what matters most to you.
            </p>
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    href="/contact"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 md:py-4 md:text-lg transition-all hover:scale-[1.02]"
                  >
                    Get a Quote <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
                <div>
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="w-full flex items-center justify-center px-8 py-3 border border-slate-800 text-base font-medium rounded-md text-slate-200 bg-slate-900 hover:bg-slate-850 md:py-4 md:text-lg transition-colors"
                  >
                    <Phone className="mr-2 h-5 w-5 text-blue-400" /> Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image */}
          <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[500px] aspect-square relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
              <Image
                src="/images/hero-insurance.png"
                alt="AIICO Insurance Protection"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
