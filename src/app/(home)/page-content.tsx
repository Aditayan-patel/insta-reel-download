import { Hero } from "./_components/hero";
import { Features } from "./_components/features";
import { HowItWorks } from "./_components/how-it-works";
import { Testimonials } from "./_components/testimonials";
import { FrequentlyAsked } from "./_components/frequently-asked";

// Additional Downloaders
import { InstagramStoryDownloader } from "./_components/instagram-story-downloader";
import { InstagramProfileDownloader } from "./_components/instagram-profile-downloader";
import { InstagramBulkDownloader } from "./_components/instagram-bulk-downloader";
import { InstagramThumbnailDownloader } from "./_components/instagram-thumbnail-downloader";


export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Additional Downloaders - Hero ke niche */}
      <section
        id="tools"
        className="relative w-full scroll-mt-16 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 md:py-28 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-teal-200/20 to-emerald-200/20 blur-3xl dark:from-teal-500/10 dark:to-emerald-500/10" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-gradient-to-r from-blue-200/20 to-purple-200/20 blur-3xl dark:from-blue-500/10 dark:to-purple-500/10" />

        <div className="relative container mx-auto px-4 md:px-6">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center rounded-full border border-teal-200/60 bg-teal-50/80 px-4 py-1.5 text-sm font-medium text-teal-700 backdrop-blur-sm dark:border-teal-800/60 dark:bg-teal-950/50 dark:text-teal-300">
              <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-teal-500" />
              More Free Tools
            </div>
            <h2 className="mt-0 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl dark:text-white">
              Additional Downloaders
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl dark:text-slate-400">
              More ways to download Instagram content. Choose the tool that fits
              your needs.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
            {/* Thumbnail Downloader */}
            <InstagramThumbnailDownloader />

            {/* Story Downloader */}
            <InstagramStoryDownloader />

            {/* Profile Picture Downloader */}
            <InstagramProfileDownloader />

            {/* Bulk Downloader */}
            <InstagramBulkDownloader />

          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-slate-50 to-transparent dark:from-gray-950" />
      </section>

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <FrequentlyAsked />
    </div>
  );
}
