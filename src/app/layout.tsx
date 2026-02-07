import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import seoConfig from "@/resources/seo-config.json";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: seoConfig.site.title,
  description: seoConfig.site.description,
  keywords: seoConfig.site.keywords,
  authors: [{ name: seoConfig.authors.name }],
  creator: seoConfig.authors.creator,
  publisher: seoConfig.authors.publisher,
  viewport: seoConfig.viewport,
  openGraph: {
    type: "website" as const,
    locale: seoConfig.openGraph.locale,
    url: seoConfig.site.url,
    siteName: seoConfig.openGraph.siteName,
    title: seoConfig.site.title,
    description: seoConfig.site.description,
    images: [
      {
        url: seoConfig.openGraph.imageUrl,
        width: seoConfig.openGraph.imageWidth,
        height: seoConfig.openGraph.imageHeight,
        alt: seoConfig.openGraph.imageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: seoConfig.site.title,
    description: seoConfig.site.shortDescription,
    images: [seoConfig.twitter.imageUrl],
  },
  robots: {
    index: seoConfig.robots.index,
    follow: seoConfig.robots.follow,
    "max-image-preview": (seoConfig.robots.maxImagePreview as any),
    "max-snippet": seoConfig.robots.maxSnippet,
    "max-video-preview": seoConfig.robots.maxVideoPreview,
  },
  alternates: {
    canonical: seoConfig.site.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaData = {
    ...seoConfig.schema,
    "name": seoConfig.site.name,
    "description": seoConfig.site.description,
    "url": seoConfig.site.url,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <header className="border-b">
              <div className="flex w-full items-center justify-between px-4 py-3">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                    RN
                  </div>
                  <span className="text-sm font-semibold tracking-tight">Repo Nav</span>
                </Link>
                <nav className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Link href="/tags" className="hover:text-foreground transition-colors">
                    Tags
                  </Link>
                  <Link href="/settings" className="hover:text-foreground transition-colors">
                    Settings
                  </Link>
                </nav>
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
