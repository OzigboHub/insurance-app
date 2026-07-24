import { Hero } from "@/components/sections/Hero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { FAQAccordion } from "@/components/sections/FAQAccordion";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesGrid limit={3} />
      <FAQAccordion />
    </>
  );
}
