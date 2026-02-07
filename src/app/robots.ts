// This file is just for SEO
import type { MetadataRoute } from "next";
import seoConfig from "@/resources/seo-config.json";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [],
    },
    sitemap: `${seoConfig.site.url}/sitemap.xml`,
  };
}
