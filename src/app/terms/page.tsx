import Head from "next/head";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  const lastUpdated = "June 1, 2025";

  const sections = [
    {
      title: "Acceptance of Terms",
      content:
        "By accessing or using ReelsDL (reelsdl.online), you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.",
    },
    {
      title: "Description of Service",
      content:
        "ReelsDL is a free tool that allows users to download publicly available Instagram photos, videos, and reels for personal use. We do not host any media — all content is fetched directly from Instagram's servers.",
    },
    {
      title: "Permitted Use",
      content:
        "You may use ReelsDL only for lawful purposes. You agree not to download content that you do not have the right to access, redistribute content without the original creator's permission, or use this service for any commercial purpose.",
    },
    {
      title: "Intellectual Property",
      content:
        "All media downloaded through ReelsDL remains the intellectual property of the original content creators. ReelsDL makes no claim of ownership over any downloaded content. Respect copyright laws in your jurisdiction.",
    },
    {
      title: "Disclaimer of Warranties",
      content:
        "ReelsDL is provided \"as is\" without warranties of any kind. We do not guarantee uninterrupted access, as Instagram may change their platform at any time. Use the service at your own risk.",
    },
    {
      title: "Limitation of Liability",
      content:
        "ReelsDL and its operators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service, including loss of data or unauthorized access.",
    },
    {
      title: "Changes to Terms",
      content:
        "We reserve the right to update these terms at any time. Continued use of the service after changes constitutes your acceptance of the new terms. Check this page periodically for updates.",
    },
    {
      title: "Contact",
      content:
        "For questions about these terms, contact us at legal@reelsdl.online or visit our contact page.",
    },
  ];

  return (
    <>
      <Head>
        <title>Terms of Service — ReelsDL</title>
        <meta
          name="description"
          content="Terms of Service for ReelsDL — Instagram media downloader."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900">
        {/* Background grid pattern */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative container mx-auto max-w-3xl px-4 py-16 md:px-6">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors mb-10 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to ReelsDL
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-400 mb-4">
              Legal
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Terms of Service
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, i) => (
              <div
                key={i}
                className="border-l-2 border-teal-200 dark:border-teal-800 pl-6"
              >
                <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  {section.title}
                </h2>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Footer nav */}
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
            <Link href="/privacy" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              Contact Us
            </Link>
            <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors ml-auto">
              reelsdl.online
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}