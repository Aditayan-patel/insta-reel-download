"use client";

import React from "react";

import { useTranslations } from "next-intl";

import { ArrowDown, Sparkles, Zap, Shield, Download, ClipboardPaste } from "lucide-react";

import { homeLinks, homeSections } from "@/lib/constants";
import { InstagramForm } from "@/components/instagram-form";

export function Hero() {
  const t = useTranslations("pages.home.hero");
  const [pastedUrl, setPastedUrl] = React.useState("");
  const formRef = React.useRef<HTMLDivElement>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.includes("instagram.com")) {
        setPastedUrl(text);
        // Scroll to form smoothly
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch {
  console.log("Clipboard access denied");
}
  };

  return (
    <section
      id={homeSections.hero}
      className="relative w-full scroll-mt-16 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-12 md:py-24 lg:py-32 xl:py-40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-gradient-to-r from-teal-200/30 to-emerald-200/30 blur-3xl animate-pulse dark:from-teal-500/10 dark:to-emerald-500/10" />
      <div className="absolute top-40 right-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-blue-200/20 to-purple-200/20 blur-3xl animate-pulse dark:from-blue-500/10 dark:to-purple-500/10" />
      <div className="absolute bottom-20 left-1/3 h-64 w-64 rounded-full bg-gradient-to-r from-amber-200/20 to-orange-200/20 blur-3xl animate-pulse dark:from-amber-500/10 dark:to-orange-500/10" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-1 w-1 rounded-full bg-teal-400/40 animate-float" />
        <div className="absolute top-1/3 right-1/3 h-1.5 w-1.5 rounded-full bg-blue-400/30 animate-float" />
        <div className="absolute bottom-1/3 left-1/3 h-1 w-1 rounded-full bg-emerald-400/40 animate-float" />
        <div className="absolute top-1/2 right-1/4 h-1.5 w-1.5 rounded-full bg-purple-400/30 animate-float" />
        <div className="absolute bottom-1/4 right-1/3 h-1 w-1 rounded-full bg-teal-400/40 animate-float" />
      </div>

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center space-y-10 text-center">
          {/* Badge */}
          <div className="group inline-flex items-center gap-2 rounded-full border border-teal-200/60 bg-teal-50/80 px-4 py-1.5 text-sm font-medium text-teal-700 backdrop-blur-sm transition-all duration-300 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-100/50 dark:border-teal-800/60 dark:bg-teal-950/50 dark:text-teal-300 dark:hover:shadow-teal-900/50">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
            </span>
            Free & Unlimited Downloads
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>

          {/* Main Heading */}
          <div className="max-w-5xl space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl dark:text-white">
              <span className="relative inline-block">
                {t("title")}
                {/* Gradient underline */}
                <svg
                  className="absolute -bottom-3 left-0 w-full"
                  viewBox="0 0 400 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 6C100 12 300 0 400 6"
                    stroke="url(#underlineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="underlineGradient" x1="0" y1="0" x2="400" y2="0">
                      <stop offset="0%" stopColor="#14b8a6" />
                      <stop offset="50%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl lg:text-2xl dark:text-slate-400">
              {t("description")}
            </p>
          </div>

          {/* Instagram Form Section */}
          <div className="w-full max-w-2xl space-y-4" ref={formRef}>
            {/* Paste Button - Modern Style */}
            <div className="flex justify-center">
              <button
                onClick={handlePaste}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-slate-200/80 bg-white/80 px-5 py-2.5 text-sm font-medium text-slate-600 backdrop-blur-sm transition-all duration-300 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-600 hover:shadow-lg hover:shadow-teal-100/50 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:border-teal-700 dark:hover:bg-teal-950/50 dark:hover:text-teal-400"
              >
                <ClipboardPaste className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                <span>Paste Instagram Link</span>
                <span className="ml-1 rounded-md bg-teal-100 px-1.5 py-0.5 text-xs text-teal-600 dark:bg-teal-900/50 dark:text-teal-400">
                  Ctrl+V
                </span>
                {/* Button shine */}
                <div className="absolute inset-0 -translate-x-full rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              </button>
            </div>

            {/* Form with Glow Effect */}
            <div className="relative group/form">
              {/* Outer Glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-400 to-blue-400 opacity-20 blur-xl transition-all duration-500 group-hover/form:opacity-40 dark:from-teal-600 dark:via-emerald-600 dark:to-blue-600" />
              
              {/* Form Card */}
              <div className="relative rounded-2xl border border-slate-200/80 bg-teal-500/30 p-2 backdrop-blur-xl transition-all duration-300 group-hover/form:border-teal-300/80 dark:border-slate-800/80 dark:bg-black/80 dark:group-hover/form:border-teal-700/80">
                <InstagramForm 
                  className="w-full" 
                  pastedUrl={pastedUrl}
                  onUrlConsumed={() => setPastedUrl("")}
                />
              </div>
            </div>

            {/* Hint Text */}
            <p className="text-center text-xs text-slate-400 dark:text-slate-500">
              {t("formHint")}
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {[
              { icon: Shield, text: "100% Secure" },
              { icon: Zap, text: "Lightning Fast" },
              { icon: Download, text: "HD Quality" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                <div className="rounded-lg bg-teal-100 p-1.5 dark:bg-teal-900/50">
                  <item.icon className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                </div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Scroll Down Indicator */}
          <div className="pt-6">
            <a 
              href={homeLinks.howItWorks}
              className="group inline-flex flex-col items-center gap-3"
            >
              <span className="text-sm font-medium text-slate-500 transition-colors duration-200 group-hover:text-teal-600 dark:text-slate-400 dark:group-hover:text-teal-400">
                {t("learnMore")}
              </span>
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-teal-400/20 blur-xl transition-all duration-300 group-hover:bg-teal-400/30" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-teal-200/80 bg-white/80 backdrop-blur-sm transition-all duration-300 group-hover:border-teal-400 group-hover:shadow-lg group-hover:shadow-teal-200/50 dark:border-teal-800/80 dark:bg-slate-900/80 dark:group-hover:border-teal-600 dark:group-hover:shadow-teal-900/50">
                  <ArrowDown className="h-5 w-5 text-teal-500 transition-all duration-300 group-hover:translate-y-0.5 group-hover:text-teal-600 dark:text-teal-400 dark:group-hover:text-teal-500" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent dark:from-gray-950" />
    </section>
  );
}