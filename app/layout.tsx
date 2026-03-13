import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { GoogleAnalytics } from "@/components/google-analytics";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  metadataBase: new URL("https://toolhub.vercel.app"),
  title: {
    default: "ToolHub - Premium Online Utility Platform",
    template: "%s | ToolHub",
  },
  description:
    "ToolHub is a fast, premium utility platform with text, image, SEO, developer, and calculator tools for modern workflows.",
  keywords: [
    "toolhub",
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
  openGraph: {
    type: "website",
    url: "https://toolhub.vercel.app",
    siteName: "ToolHub",
    title: "ToolHub - Premium Online Utility Platform",
    description:
      "Use premium text, image, calculator, SEO, and developer utilities in one clean and fast experience.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolHub - Premium Online Utility Platform",
    description:
      "All essential online tools in one premium hub. Fast, mobile-friendly and privacy-first.",
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
                name: "ToolHub",
                url: "https://toolhub.vercel.app",
                potentialAction: {
                  "@type": "SearchAction",
                  target: "https://toolhub.vercel.app/?q={search_term_string}",
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
