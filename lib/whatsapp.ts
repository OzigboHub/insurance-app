import { siteConfig } from "@/content/site-config";

export function buildWhatsAppLink(message: string) {
  const base = `https://wa.me/${siteConfig.contact.whatsapp}`;
  return `${base}?text=${encodeURIComponent(message)}`;
}
