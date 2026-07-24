import { CarFront, Plane, HeartPulse, Stethoscope, ShieldCheck, Briefcase } from "lucide-react";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: typeof CarFront;
  slug: string;
  category: "personal" | "health" | "business" | "general";
  badge?: string;
  features: string[];
  highlights: string[];
}

export const services: ServiceItem[] = [
  {
    id: "motor-insurance",
    title: "Motor Insurance",
    description: "Comprehensive coverage for your personal and commercial vehicles against accidental damage, theft, fire, and third-party liabilities.",
    icon: CarFront,
    slug: "motor",
    category: "personal",
    badge: "Most Popular",
    features: [
      "Third-party liability & bodily injury coverage",
      "Full accidental damage and theft protection",
      "24/7 emergency roadside assistance",
      "Instant digital certificate issuance"
    ],
    highlights: ["Instant Certificate", "Roadside Assistance", "Zero Hassle Claims"]
  },
  {
    id: "travel-insurance",
    title: "Travel Insurance",
    description: "Travel with complete peace of mind. Comprehensive coverage for emergency medical treatment, trip delays, and lost luggage worldwide.",
    icon: Plane,
    slug: "travel",
    category: "personal",
    badge: "Schengen Approved",
    features: [
      "Worldwide medical emergency coverage up to $100,000",
      "Trip cancellation, delay, & interruption reimbursement",
      "Baggage loss, theft, & delay protection",
      "Schengen & global visa compliant certification"
    ],
    highlights: ["Schengen Compliant", "Global Support", "Medical Cover"]
  },
  {
    id: "life-insurance",
    title: "Life & Savings Protection",
    description: "Secure your family's financial future with customizable life policies combining long-term wealth accumulation and lump-sum protection.",
    icon: HeartPulse,
    slug: "life",
    category: "health",
    badge: "High Growth",
    features: [
      "Guaranteed payout to designated beneficiaries",
      "High-yield disciplined savings & education plans",
      "Critical illness & permanent disability riders",
      "Flexible monthly, quarterly, or annual premiums"
    ],
    highlights: ["Family Guarantee", "Wealth Growth", "Flexible Premiums"]
  },
  {
    id: "health-insurance",
    title: "Health & HMO Coverage",
    description: "Access premium healthcare facilities, top specialists, and prescription medications for you, your family, or your workforce.",
    icon: Stethoscope,
    slug: "health",
    category: "health",
    badge: "Top Rated Network",
    features: [
      "Access to over 1,500 premium hospital networks",
      "Comprehensive inpatient, outpatient, & dental care",
      "Maternity care, wellness checks, & preventative care",
      "Telemedicine & 24/7 virtual doctor consultations"
    ],
    highlights: ["1500+ Hospitals", "Telemedicine 24/7", "Maternity Cover"]
  },
  {
    id: "general-insurance",
    title: "General & Property Protection",
    description: "Protect your residential home, real estate properties, and valuable possessions against fire, flood, burglary, and natural hazards.",
    icon: ShieldCheck,
    slug: "general",
    category: "general",
    badge: "Comprehensive",
    features: [
      "Home structure & contents replacement value",
      "Fire, storm, flood, and burglary damage coverage",
      "Personal liability coverage for property owners",
      "Fast claim processing with direct repair payout"
    ],
    highlights: ["Home & Content", "Fire & Flood", "Fast Payout"]
  },
  {
    id: "corporate-insurance",
    title: "Corporate Business Insurance",
    description: "Tailored enterprise solutions safeguarding commercial assets, liability, key personnel, group life, and business operations.",
    icon: Briefcase,
    slug: "corporate",
    category: "business",
    badge: "Enterprise Grade",
    features: [
      "Group Life & Workmen's Compensation compliance",
      "Commercial property, equipment, & cargo cover",
      "Director's liability, cyber risk, & business interruption",
      "Dedicated corporate risk advisor and manager"
    ],
    highlights: ["Group Life", "Property & Cargo", "Dedicated Manager"]
  }
];
