import { Metadata } from "next";

export const siteConfig = {
  name: "ReelsDL",  // ✅ Changed from "Reelsdl" to "ReelsDL"
  domain: "reelsdl.vercel.app",  // ✅ Fixed domain (.com se .app)
  shortName: "ReelsDL",  // ✅ Changed
  creator: "riad-azz",
  description:
    "Download Instagram reels, videos, and stories for free. No registration, no login required. Fast and HD quality downloads.",
  ogDescription:
    "Download Instagram reels and videos instantly. Free, fast, and no login required. Get HD quality downloads.",
  url: "https://reelsdl.vercel.app",  // ✅ Fixed URL
  keywords: ["instagram downloader", "reels downloader", "video downloader", "instagram saver"],
};

export const siteMetadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  creator: siteConfig.creator,
  keywords: siteConfig.keywords,
  openGraph: {
    type: "website",
    locale: "en_US",
    title: siteConfig.name,
    description: siteConfig.ogDescription,
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.ogDescription,
    creator: siteConfig.creator,
  },
  robots: {
    index: true,  // ✅ Changed to true (SEO ke liye)
    follow: true,
    googleBot: {
      index: true,
      follow: true,  // ✅ Changed to true
      noimageindex: false,  // ✅ Changed to false
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",  // ✅ Added apple touch icon
  },
  manifest: "/site.webmanifest",  // ✅ Fixed (webmanifest.json se site.webmanifest)
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.creator }],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};