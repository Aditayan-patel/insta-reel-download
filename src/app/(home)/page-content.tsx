"use client";  // ✅ Add this at the top

import dynamic from 'next/dynamic';
import { Hero } from "./_components/hero";
import { Features } from "./_components/features";
import { HowItWorks } from "./_components/how-it-works";
import { Testimonials } from "./_components/testimonials";
import { FrequentlyAsked } from "./_components/frequently-asked";

// ✅ Lazy load non-critical components with ssr: false (allowed in client component)
const InstagramStoryDownloader = dynamic(
  () => import("./_components/instagram-story-downloader").then(mod => mod.InstagramStoryDownloader),
  { 
    loading: () => <div className="h-64 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-2xl" />,
    ssr: false 
  }
);

const InstagramProfileDownloader = dynamic(
  () => import("./_components/instagram-profile-downloader").then(mod => mod.InstagramProfileDownloader),
  { 
    loading: () => <div className="h-64 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-2xl" />,
    ssr: false 
  }
);

const InstagramBulkDownloader = dynamic(
  () => import("./_components/instagram-bulk-downloader").then(mod => mod.InstagramBulkDownloader),
  { 
    loading: () => <div className="h-64 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-2xl" />,
    ssr: false 
  }
);

const InstagramThumbnailDownloader = dynamic(
  () => import("./_components/instagram-thumbnail-downloader").then(mod => mod.InstagramThumbnailDownloader),
  { 
    loading: () => <div className="h-64 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-2xl" />,
    ssr: false 
  }
);

export default function HomePage() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      
      <section
        id="tools"
        className="relative w-full scroll-mt-16 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 md:py-28 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-teal-200/20 to-emerald-200/20 blur-3xl dark:from-teal-500/10 dark:to-emerald-500/10" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-gradient-to-r from-blue-200/20 to-purple-200/20 blur-3xl dark:from-blue-500/10 dark:to-purple-500/10" />

        <div className="relative container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center rounded-full border border-teal-200/60 bg-teal-50/80 px-4 py-1.5 text-sm font-medium text-teal-700 backdrop-blur-sm dark:border-teal-800/60 dark:bg-teal-950/50 dark:text-teal-300">
              <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-teal-500" />
              More Free Tools
            </div>
            <h2 className="mt-0 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl dark:text-white">
              Additional Downloaders
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl dark:text-slate-400">
              More ways to download Instagram content. Choose the tool that fits your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
            <InstagramThumbnailDownloader />
            <InstagramBulkDownloader />
            <InstagramStoryDownloader />
            <InstagramProfileDownloader />
          </div>
        </div>

        <div className="absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-slate-50 to-transparent dark:from-gray-950" />
      </section>

      <Features />
      <Testimonials />
      <FrequentlyAsked />
    </div>
  );
}