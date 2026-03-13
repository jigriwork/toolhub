import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://toolhub.vercel.app"),
  title: {
    default: "ToolHub - Premium Free Online Tools",
    template: "%s | ToolHub",
  },
  description:
    "ToolHub is a premium multi-tools app with fast online utilities including word counter, password generator, age calculator, QR code generator, text case converter, and image compressor.",
  keywords: [
    "toolhub",
    "online tools",
    "word counter",
    "password generator",
    "age calculator",
    "qr code generator",
    "text case converter",
    "image compressor",
  ],
  openGraph: {
    type: "website",
    url: "https://toolhub.vercel.app",
    siteName: "ToolHub",
    title: "ToolHub - Premium Free Online Tools",
    description: "Modern, fast and responsive utilities for everyday use.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolHub - Premium Free Online Tools",
    description: "Modern, fast and responsive utilities for everyday use.",
  },
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
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
