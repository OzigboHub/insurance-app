import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/content/site-config";
import Globe from "@/components/ui/Globe";

export function Hero() {
  return (
    <div className="relative bg-slate-950 overflow-hidden py-16 sm:py-24 lg:py-32 selection:bg-blue-500 selection:text-white">
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

      {/* Glow Spheres */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            


            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl leading-tight">
              <span className="block xl:inline">Secure your future with</span>{" "}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 xl:inline">
                AIICO Insurance
              </span>
            </h1>

            <p className="mt-4 text-base text-slate-300 sm:mt-5 sm:text-xl leading-relaxed">
              {siteConfig.description} We offer tailored plans that give you complete peace of mind and protect what matters most to you.
            </p>

            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02]"
                >
                  <span>Get Instant Quote</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>

                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="inline-flex items-center justify-center px-6 py-4 rounded-xl text-base font-bold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all"
                >
                  <Phone className="mr-2.5 h-5 w-5 text-blue-400" />
                  <span>Call Advisor Now</span>
                </a>
              </div>
            </div>

            {/* Proof Metrics Bar */}
            <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">99.4%</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Claims Settled</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">1,500+</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Health Network</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">&lt; 15 Mins</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Avg Response</div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Portrait with Glassmorphic Name Tag */}
          <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[460px]">
              
              {/* Glowing aura behind portrait */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-25" />

              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl">
                <div className="aspect-[4/5] relative">
                  <Image
                    src="/images/insu.png"
                    alt="Sabinus Okpara - Unit Manager"
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 460px"
                  />
                </div>

                {/* Floating Glassmorphic Name & Position Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/85 border border-slate-800/90 backdrop-blur-md flex items-center justify-between shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-white tracking-tight">Sabinus Okpara</p>
                      <p className="text-xs text-blue-400 font-semibold">Unit Manager</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Active
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

