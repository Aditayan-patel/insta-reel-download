import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — ReelsDL",
  description: "Privacy Policy for ReelsDL — we keep it simple and private.",
};

const sections = [
  {
    title: "Information We Collect",
    content:
      "ReelsDL does not require account registration. We do not collect your name, email, or personal information to use the service. We may collect anonymous usage data such as pages visited and features used, solely to improve the product.",
  },
  {
    title: "Instagram URLs You Submit",
    content:
      "When you paste an Instagram URL into ReelsDL, that URL is sent to our server to fetch the media. We do not store these URLs or associate them with any user identity. Requests are processed and discarded immediately.",
  },
  {
    title: "Cookies & Local Storage",
    content:
      "We use minimal browser storage only for functional purposes such as theme preference (dark/light mode). We do not use tracking cookies or third-party advertising cookies.",
  },
  {
    title: "Third-Party Services",
    content:
      "ReelsDL may use third-party analytics tools (such as Plausible or similar privacy-first tools) to understand aggregate usage. These tools do not track individuals and do not share data with advertisers.",
  },
  {
    title: "Data Retention",
    content:
      "Since we do not collect personal data, there is nothing to retain or delete. Server logs may be kept for up to 30 days for security and debugging purposes, after which they are purged automatically.",
  },
  {
    title: "Children's Privacy",
    content:
      "ReelsDL is not directed at children under the age of 13. We do not knowingly collect information from children. If you believe a child has submitted personal information, please contact us immediately.",
  },
  {
    title: "Your Rights",
    content:
      "Depending on your location, you may have rights under GDPR, CCPA, or other privacy regulations. Since we collect no personal data, most requests are moot — but contact us at privacy@reelsdl.online if you have concerns.",
  },
  {
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. We will note the updated date at the top of this page. Continued use of ReelsDL after changes means you accept the revised policy.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative container mx-auto max-w-3xl px-4 py-16 md:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors mb-10 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to ReelsDL
        </Link>

        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-400 mb-4">
            Legal
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Last updated: June 1, 2025
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div
              key={section.title}
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

        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/terms" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            Terms of Service
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
  );
}