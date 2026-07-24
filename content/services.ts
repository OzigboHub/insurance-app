import { CarFront, Plane, HeartPulse, Stethoscope, ShieldCheck, Briefcase } from "lucide-react";

export const services = [
  {
    id: "motor-insurance",
    title: "Motor Insurance",
    description: "Comprehensive coverage for your vehicles against accidental damage, theft, and third-party liabilities.",
    icon: CarFront,
    slug: "motor",
  },
  {
    id: "travel-insurance",
    title: "Travel Insurance",
    description: "Travel with peace of mind. Coverage for medical emergencies, trip cancellations, and lost luggage anywhere in the world.",
    icon: Plane,
    slug: "travel",
  },
  {
    id: "life-insurance",
    title: "Life Insurance",
    description: "Secure your family's future with our life insurance policies, providing financial protection and savings plans.",
    icon: HeartPulse,
    slug: "life",
  },
  {
    id: "health-insurance",
    title: "Health Insurance",
    description: "Access to the best healthcare facilities with extensive medical coverage for you and your loved ones.",
    icon: Stethoscope,
    slug: "health",
  },
  {
    id: "general-insurance",
    title: "General & Asset Protection",
    description: "Protect your home, valuable assets, and properties from unforeseen risks and damages.",
    icon: ShieldCheck,
    slug: "general",
  },
  {
    id: "corporate-insurance",
    title: "Corporate Business Insurance",
    description: "Tailored insurance solutions to protect your business assets, employees, and operations.",
    icon: Briefcase,
    slug: "corporate",
  }
];
