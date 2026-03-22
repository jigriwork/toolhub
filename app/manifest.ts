import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "toolhubsite - Free Online Utility Tools",
    short_name: "toolhubsite",
    description:
      "Install toolhubsite for a fast app-like experience with text, image, SEO, and productivity tools.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/icons/TH%20App%20icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/TH%20App%20icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
