import { services } from "@/content/services";
import Link from "next/link";

export function ServicesGrid({ limit }: { limit?: number }) {
  const displayServices = limit ? services.slice(0, limit) : services;

  return (
    <div className="bg-slate-950 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-400 tracking-wide uppercase">Insurance Policies</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            A better way to protect your assets
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-400 mx-auto">
            Explore our comprehensive range of insurance products tailored to your personal and business needs.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayServices.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.id} className="pt-6">
                  <div className="flow-root bg-slate-900/40 rounded-lg px-6 pb-8 h-full shadow-2xl border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-colors">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg shadow-blue-500/10">
                          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-white tracking-tight">{service.title}</h3>
                      <p className="mt-5 text-base text-slate-400 mb-6">{service.description}</p>
                      
                      <Link 
                        href={`/contact?service=${service.slug}`}
                        className="text-sm font-semibold text-blue-400 hover:text-blue-300 mt-auto inline-flex items-center transition-colors"
                      >
                        Get a Quote <span aria-hidden="true" className="ml-1">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
