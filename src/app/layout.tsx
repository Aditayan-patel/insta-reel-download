import type { Metadata, Viewport } from "next";
import { DM_Sans as RootFont } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/features/theme/theme-provider";
import { LocaleProvider } from "@/features/i18n/locale-provider";
import { ReactQueryProvider } from "@/features/react-query/react-query-provider";

import { cn } from "@/lib/utils";
import { siteMetadata } from "@/lib/site";
import { getLocale, getMessages } from "next-intl/server";

// Fix: Import CSS with proper type declaration
import "./globals.css";

const geistSans = RootFont({
  variable: "--font-root-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Arial", "sans-serif"],
});

// Viewport configuration for better mobile performance
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

// ✅ ADDED: Explicit title template for better SEO
export const metadata: Metadata = {
  ...siteMetadata,
  title: {
    default: "ReelsDL - Download Instagram Reels & Videos Free",
    template: "%s | ReelsDL"
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://reelsdl.vercel.app"),
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    ...siteMetadata.openGraph,
    title: "ReelsDL - Download Instagram Reels & Videos Free",
    description: "Download Instagram reels, videos, and stories for free. No registration, no login required. Fast and HD quality.",
    type: "website",
    locale: "en_US",
    alternateLocale: ["hi_IN"],
    siteName: "ReelsDL",
  },
  twitter: {
    ...siteMetadata.twitter,
    title: "ReelsDL - Download Instagram Reels & Videos Free",
    description: "Download Instagram reels and videos instantly. Free, fast, and no login required.",
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  category: "technology",
  keywords: ["instagram downloader", "reels downloader", "video downloader", "instagram saver", "reelsdl"],
  applicationName: "ReelsDL",
  authors: [{ name: "riad-azz" }],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html 
      lang={locale} 
      className="scroll-smooth" 
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to critical third-party domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://instagram.com" />
        <link rel="preconnect" href="https://cdninstagram.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Preload critical assets */}
        <link 
          rel="preload" 
          href="/favicon.ico" 
          as="image" 
          type="image/x-icon"
        />
        
        {/* Resource hints for better performance */}
        <link rel="preconnect" href="https://vercel.live" crossOrigin="anonymous" />
        
        {/* Security headers via meta tags */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#14b8a6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Manifest for PWA */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Title override for head */}
        <title>ReelsDL - Download Instagram Reels & Videos Free</title>
      </head>
      <body className={cn("antialiased", geistSans.className)}>
        <LocaleProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <ReactQueryProvider>
              {children}
              
              {/* Sonner Toast with better config */}
              <Toaster 
                closeButton 
                richColors
                position="top-center"
                expand={false}
                duration={3000}
                visibleToasts={3}
                toastOptions={{
                  style: {
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                  },
                }}
              />
              
              {/* Vercel Analytics (Production only) */}
              {process.env.NODE_ENV === 'production' && (
                <>
                  <SpeedInsights />
                  <Analytics />
                </>
              )}
            </ReactQueryProvider>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}