import React from "react";

import { useTranslations } from "next-intl";

import { CheckCircle, Shield, TvMinimalPlay, Zap } from "lucide-react";

import { homeSections } from "@/lib/constants";

const featureIcons = {
  free: Shield,
  noRegistration: CheckCircle,
  fast: Zap,
  hdQuality: TvMinimalPlay,
};

const features = [
  {
    key: "free",
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    key: "noRegistration",
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    key: "fast",
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-50 to-orange-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    key: "hdQuality",
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "from-violet-50 to-purple-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
];

export function Features() {
  const t = useTranslations("pages.home.features");

  return (
    <section
      id={homeSections.features}
      className="relative w-full scroll-mt-12 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 md:py-28 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-teal-200/20 to-emerald-200/20 blur-3xl dark:from-teal-500/10 dark:to-emerald-500/10" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-blue-200/20 to-purple-200/20 blur-3xl dark:from-blue-500/10 dark:to-purple-500/10" />

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-teal-200/60 bg-teal-50/80 px-4 py-1.5 text-sm font-medium text-teal-700 backdrop-blur-sm dark:border-teal-800/60 dark:bg-teal-950/50 dark:text-teal-300">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
            {t("badge")}
          </div>

          {/* Title & Description */}
          <div className="max-w-2xl space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl dark:text-white">
              {t("title")}
            </h2>
            <p className="text-lg leading-relaxed text-slate-600 md:text-xl dark:text-slate-400">
              {t("description")}
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = featureIcons[feature.key as keyof typeof featureIcons];
              return (
                <div
                  key={feature.key}
                  className="group relative flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 sm:p-8 dark:border-slate-800/80 dark:bg-slate-900/80 dark:hover:border-slate-700 dark:hover:shadow-slate-900/50"
                >
                  {/* Card Gradient Border Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-transparent to-slate-900/[0.02] opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-white/[0.02]" />
                  
                  {/* Icon Container */}
                  <div className={`relative mb-5 rounded-2xl ${feature.iconBg} p-3.5 ring-1 ring-slate-200/60 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg dark:ring-slate-700/60`}>
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10`} />
                    <Icon className={`relative h-6 w-6 ${feature.iconColor} sm:h-7 sm:w-7`} />
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                    {t(`cards.${feature.key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {t(`cards.${feature.key}.description`)}
                  </p>

                  {/* Bottom Accent Line */}
                  <div className={`absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r ${feature.gradient} transition-all duration-300 group-hover:w-3/4`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}