// this file is just for SEO
import type { Metadata } from "next";
import seoConfig from "@/resources/seo-config.json";

export const metadata: Metadata = {
  title: seoConfig.pages.tags.title,
  description: seoConfig.pages.tags.description,
  openGraph: {
    title: seoConfig.pages.tags.title,
    description: seoConfig.pages.tags.description,
    type: "website",
  },
};

export { default } from "./page";
