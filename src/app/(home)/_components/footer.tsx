"use client";

import React from "react";

import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";

export function Footer() {
  const t = useTranslations("layouts.home.footer");
  const year = new Date().getFullYear();

  const links = ["terms", "privacy", "contact"];

  return (
    <footer className="relative w-full border-t border-slate-200/80 bg-gradient-to-b from-slate-50 to-white dark:border-slate-800/80 dark:from-gray-950 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Subtle Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-300/50 to-transparent dark:via-teal-700/50" />

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 py-8 md:h-20 md:flex-row md:py-0">
          {/* Copyright */}
          <div className="flex items-center gap-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t("copyright", { year })}
            </p>
            <span className="hidden items-center text-sm text-slate-400 sm:inline-flex">
              •
            </span>
            <span className="hidden items-center gap-1 text-sm text-slate-500 sm:inline-flex dark:text-slate-400">
              Made with
              <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1">
            {links.map((link, index) => (
              <React.Fragment key={link}>
                <a
                  href="#"
                  className="relative rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:text-teal-600 hover:bg-teal-50/80 dark:text-slate-400 dark:hover:text-teal-400 dark:hover:bg-teal-950/50"
                >
                  {t(`links.${link}`)}
                </a>
                {index < links.length - 1 && (
                  <span className="text-slate-300 select-none dark:text-slate-700">
                    •
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Back to Top Button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 backdrop-blur-sm transition-all duration-200 hover:border-teal-300 hover:text-teal-600 hover:shadow-md hover:shadow-teal-100/50 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-teal-700 dark:hover:text-teal-400 dark:hover:shadow-teal-900/50"
            aria-label="Back to top"
          >
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
            <span className="hidden sm:inline">Back to top</span>
          </button>
        </div>

        {/* Bottom decorative element */}
        <div className="absolute bottom-0 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-200 via-teal-400 to-teal-200 opacity-50 dark:from-teal-800 dark:via-teal-600 dark:to-teal-800" />
      </div>
    </footer>
  );
}