import { ServicesGrid } from "@/components/sections/ServicesGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insurance Services",
  description: "Explore our comprehensive range of AIICO insurance policies.",
};

export default function ServicesPage() {
  return (
    <div>
      <div className="bg-blue-900 py-16 text-center">
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight">
          Our Insurance Policies
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-xl text-blue-100">
          Comprehensive coverage for every stage of your life and business.
        </p>
      </div>
      <ServicesGrid />
    </div>
  );
}
