"use client";

import React from "react";

import { useTranslations } from "next-intl";

import { Sparkles, Zap, Shield, Download, Wrench } from "lucide-react";

import { homeSections } from "@/lib/constants";
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
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch {
      console.log("Clipboard access denied");
    }
  };

  return (
    <section
      id={homeSections.hero}
      className="relative w-full scroll-mt-6 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-7 pb-0 md:py-17 lg:py-25 xl:py-16 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
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
        <div className="flex flex-col items-center space-y-8 text-center">
          {/* Badge */}
          <div className="group inline-flex items-center gap-2 rounded-full border border-teal-200/60 bg-teal-50/80 px-4 py-1.5 text-sm font-medium text-teal-700 backdrop-blur-sm transition-all duration-300 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-100/50 dark:border-teal-800/60 dark:bg-teal-950/50 dark:text-teal-300 dark:hover:shadow-teal-900/50">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
            </span>
            Free & Unlimited Downloads
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>

          {/* Marquee Tag - Individual Capsules */}
          <div className="w-full max-w-3xl mt-5 mb-9 overflow-hidden marquee-container">
            <div className="marquee-content whitespace-nowrap">
              <div className="inline-flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/30 px-4 py-1.5 text-sm font-medium text-teal-700 backdrop-blur-sm dark:text-teal-300">
                  📱 Reels
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/30 px-4 py-1.5 text-sm font-medium text-teal-700 backdrop-blur-sm dark:text-teal-300">
                  📷 Posts
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/30 px-4 py-1.5 text-sm font-medium text-teal-700 backdrop-blur-sm dark:text-teal-300">
                  📸 Stories
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/30 px-4 py-1.5 text-sm font-medium text-teal-700 backdrop-blur-sm dark:text-teal-300">
                  👤 Profiles
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/30 px-4 py-1.5 text-sm font-medium text-teal-700 backdrop-blur-sm dark:text-teal-300">
                  🎥 IGTV
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/30 px-4 py-1.5 text-sm font-medium text-teal-700 backdrop-blur-sm dark:text-teal-300">
                  🔄 Carousels
                </span>
              </div>
              <div className="inline-flex items-center gap-3 ml-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/30 px-4 py-1.5 text-sm font-medium text-teal-700 backdrop-blur-sm dark:text-teal-300">
                  📱 Reels
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/30 px-4 py-1.5 text-sm font-medium text-teal-700 backdrop-blur-sm dark:text-teal-300">
                  📷 Posts
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/30 px-4 py-1.5 text-sm font-medium text-teal-700 backdrop-blur-sm dark:text-teal-300">
                  📸 Stories
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/30 px-4 py-1.5 text-sm font-medium text-teal-700 backdrop-blur-sm dark:text-teal-300">
                  👤 Profiles
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/30 px-4 py-1.5 text-sm font-medium text-teal-700 backdrop-blur-sm dark:text-teal-300">
                  🎥 IGTV
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/30 px-4 py-1.5 text-sm font-medium text-teal-700 backdrop-blur-sm dark:text-teal-300">
                  🔄 Carousels
                </span>
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <div className="max-w-5xl space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl dark:text-white">
              <span className="relative inline-block">
                {t("title")}
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
            {/* Explore More Tools Button - Centered */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  const toolsSection = document.getElementById('tools');
                  if (toolsSection) {
                    toolsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 px-5 py-2.5 text-sm font-medium text-teal-600 transition-all duration-300 hover:from-teal-500 hover:via-emerald-500 hover:to-teal-500 hover:text-white hover:shadow-lg hover:shadow-teal-500/25 dark:from-teal-400/20 dark:via-emerald-400/20 dark:to-teal-400/20 dark:text-teal-400 dark:hover:from-teal-400 dark:hover:via-emerald-400 dark:hover:to-teal-400 dark:hover:text-gray-900 dark:hover:shadow-teal-400/30"
              >
                {/* Inner content container - no extra absolute elements causing glass effect issues */}
                <span className="relative flex items-center gap-2.5">
                  <span className="flex items-center justify-center rounded-full bg-teal-100 p-1 transition-all duration-300 group-hover:bg-white/20 dark:bg-teal-900/50 dark:group-hover:bg-white/20">
                    <Wrench className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12" />
                  </span>
                  <span className="relative">
                    Explore More Tools
                    <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300 group-hover:w-full" />
                  </span>
                  <svg
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </button>
            </div>

            {/* Form with Glow Effect - Fixed glass effect */}
            <div className="relative group/form">
              {/* Only one glow layer with proper blur */}
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-400 to-blue-400 opacity-20 blur-xl transition-all duration-500 group-hover/form:opacity-30 dark:from-teal-600 dark:via-emerald-600 dark:to-blue-600" />
              
              {/* Main form container with proper backdrop blur */}
              <div className="relative rounded-2xl border border-slate-200/80 bg-white/40 p-2 backdrop-blur-md transition-all duration-300 group-hover/form:border-teal-300/80 dark:border-slate-800/80 dark:bg-black/50 dark:group-hover/form:border-teal-700/80">
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
          <div className="flex flex-wrap items-center justify-center gap-7 md:gap-18">
            {[
              { icon: Shield, text: "100% Secure" },
              { icon: Zap, text: "Lightning Fast" },
              { icon: Download, text: "HD Quality" },
            ].map((item, index) => (
              <div key={index} className="flex items-center z-20 gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                <div className="rounded-lg bg-teal-100 p-1.5 dark:bg-teal-900/50">
                  <item.icon className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                </div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent dark:from-gray-950" />

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-content {
          animation: marquee 17s linear infinite;
          display: inline-block;
        }
        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  ); 
}