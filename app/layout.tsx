import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { GoogleAnalytics } from "@/components/google-analytics";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.toolhubsite.in"),
  title: {
    default: "toolhubsite - Free Online Utility Tools",
    template: "%s | toolhubsite",
  },
  description:
    "toolhubsite offers fast, browser-based utility tools for text, image, SEO, developer, and calculator workflows.",
  keywords: [
    "toolhubsite",
    "online tools",
    "free online utility platform",
    "seo tools",
    "text tools",
    "image tools",
    "developer tools",
    "word counter",
    "password generator",
    "age calculator",
    "bmi calculator",
    "percentage calculator",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/favicon.svg",
    shortcut: "/icons/favicon.svg",
    apple: "/icons/favicon.svg",
  },
  openGraph: {
    type: "website",
    url: "https://www.toolhubsite.in",
    siteName: "toolhubsite",
    title: "toolhubsite - Free Online Utility Tools",
    description:
      "Use text, image, calculator, SEO, and developer utilities in one clean and fast experience.",
  },
  twitter: {
    card: "summary_large_image",
    title: "toolhubsite - Free Online Utility Tools",
    description:
      "All essential online tools in one hub. Fast, mobile-friendly, and privacy-first.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="google-adsense"
          strategy="beforeInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9786270531690599"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <ThemeProvider>
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          <PwaRegister />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "toolhubsite",
                url: "https://www.toolhubsite.in",
                potentialAction: {
                  "@type": "SearchAction",
                  target: "https://www.toolhubsite.in/?q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              }),
            }}
          />
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
