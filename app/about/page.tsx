import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about our mission to provide the best insurance solutions.",
};

export default function AboutPage() {
  return (
    <div className="bg-slate-950 py-16 sm:py-24 text-slate-100 flex-grow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl">
            About Us
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400">
            Dedicated to securing your future with AIICO Insurance.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <p className="text-slate-300 mb-6 leading-relaxed text-lg">
            Welcome to our agency. We are a premier representative of <strong className="text-white">AIICO Insurance PLC</strong>, 
            committed to delivering top-tier life, health, motor, and corporate insurance solutions to our clients.
          </p>
          <p className="text-slate-300 mb-6 leading-relaxed text-lg">
            Our mission is to understand your unique needs and provide tailored coverage that ensures peace of mind. 
            Whether you are an individual looking to protect your family's future, or a business owner safeguarding 
            your enterprise, we are here to guide you every step of the way.
          </p>
          <h3 className="text-2xl font-bold text-white mt-8 mb-4">Why Choose Us?</h3>
          <ul className="list-disc pl-6 text-slate-300 space-y-3 text-lg">
            <li><strong className="text-white">Personalized Service:</strong> We take the time to understand your specific situation.</li>
            <li><strong className="text-white">Expert Guidance:</strong> Backed by AIICO's industry-leading products.</li>
            <li><strong className="text-white">Fast Claims:</strong> We assist you through the claims process to ensure prompt settlement.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
