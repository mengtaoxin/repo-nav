// this file is just for SEO
import type { Metadata } from "next";
import seoConfig from "@/resources/seo-config.json";

export const metadata: Metadata = {
  title: seoConfig.pages.settings.title,
  description: seoConfig.pages.settings.description,
  openGraph: {
    title: seoConfig.pages.settings.title,
    description: seoConfig.pages.settings.description,
    type: "website",
  },
};

export { default } from "./page";
