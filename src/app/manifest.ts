// This file is just for SEO
import type { MetadataRoute } from "next";
import seoConfig from "@/resources/seo-config.json";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seoConfig.manifest.name,
    short_name: seoConfig.manifest.shortName,
    description: seoConfig.manifest.description,
    start_url: seoConfig.manifest.startUrl,
    scope: seoConfig.manifest.scope,
    display: "standalone",
    background_color: seoConfig.manifest.backgroundColor,
    theme_color: seoConfig.manifest.themeColor,
    orientation: "portrait-primary",
    icons: seoConfig.manifest.icons.map((icon) => ({
      src: icon.src,
      sizes: icon.sizes,
      type: icon.type,
      purpose: (icon.purpose as any),
    })),
  };
}
