import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AIICO Insurance Expert Portal",
    short_name: "AIICO Insurance",
    description: "Official Digital Proposal Forms, E-Signature, and Policy Portal for AIICO Insurance PLC.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#1e40af",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
