import type { MetadataRoute } from "next";
import { tools } from "@/data/tools";
import { resources } from "@/data/resources";

const BASE_URL = "https://www.toolhubsite.in";

const staticRoutes = [
  "",
  "/about",
  "/contact",
  "/feedback",
  "/privacy-policy",
  "/request-tool",
  "/resources",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const toolEntries: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: tool.featured ? 0.9 : 0.8,
  }));

  const resourceEntries: MetadataRoute.Sitemap = resources.map((resource) => ({
    url: `${BASE_URL}/resources/${resource.slug}`,
    lastModified: new Date(resource.publishedAt),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticEntries, ...toolEntries, ...resourceEntries];
}
