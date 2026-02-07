// This file is just for SEO
import type { MetadataRoute } from "next";
import seoConfig from "@/resources/seo-config.json";

export default function sitemap(): MetadataRoute.Sitemap {
  return seoConfig.sitemap.pages.map((page) => ({
    url: `${seoConfig.site.url}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency as
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never",
    priority: page.priority,
  }));
}
