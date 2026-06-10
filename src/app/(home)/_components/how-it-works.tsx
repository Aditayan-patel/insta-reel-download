import React from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import { Copy, Download, Clipboard, ArrowRight } from "lucide-react";

import { homeLinks, homeSections } from "@/lib/constants";

const steps = [
  {
    key: "copy",
    icon: Copy,
    color: "from-emerald-500 to-teal-600",
    bgLight: "from-emerald-50 to-teal-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    darkIconBg: "dark:bg-emerald-900/50",
    darkIconColor: "dark:text-emerald-400",
  },
  {
    key: "paste",
    icon: Clipboard,
    color: "from-blue-500 to-indigo-600",
    bgLight: "from-blue-50 to-indigo-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    darkIconBg: "dark:bg-blue-900/50",
    darkIconColor: "dark:text-blue-400",
  },
  {
    key: "download",
    icon: Download,
    color: "from-violet-500 to-purple-600",
    bgLight: "from-violet-50 to-purple-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    darkIconBg: "dark:bg-violet-900/50",
    darkIconColor: "dark:text-violet-400",
  },
];

export function HowItWorks() {
  const t = useTranslations("pages.home.howItWorks");

  return (
    <section
      id={homeSections.howItWorks}
      className="relative w-full scroll-mt-12 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 md:py-28"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Gradient Orbs */}
      <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-gradient-to-r from-teal-200/20 to-emerald-200/20 blur-3xl dark:from-teal-500/10 dark:to-emerald-500/10" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-blue-200/20 to-purple-200/20 blur-3xl dark:from-blue-500/10 dark:to-purple-500/10" />

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-teal-200/60 bg-teal-50/80 px-4 py-1.5 text-sm font-medium text-teal-700 backdrop-blur-sm transition-all duration-300 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-100/50 dark:border-teal-800/60 dark:bg-teal-950/50 dark:text-teal-300 dark:hover:shadow-teal-900/50">
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-teal-500" />
            {t("badge")}
          </div>

          {/* Title & Description */}
          <div className="max-w-2xl space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl">
              {t("title")}
            </h2>
            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400 md:text-xl">
              {t("description")}
            </p>
          </div>

          {/* Desktop Steps */}
          <div className="relative mx-auto mt-12 hidden w-full max-w-5xl md:block">
            {/* Connecting Line with Gradient */}
            <div className="absolute left-0 right-0 top-24 h-0.5">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 via-blue-400 to-violet-400 dark:from-emerald-700 dark:via-blue-700 dark:to-violet-700" />
              {/* Animated Dot */}
              <div className="absolute top-1/2 h-3 w-3 -translate-y-1/2 animate-[moveDot_3s_ease-in-out_infinite] rounded-full bg-teal-500" />
            </div>

            <div className="grid grid-cols-3 gap-6 lg:gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.key}
                    className="group relative flex flex-col items-center"
                  >
                    {/* Step Number Circle */}
                    <div className="relative z-10 mb-6">
                      <div
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color} opacity-0 blur-xl transition-all duration-300 group-hover:opacity-30`}
                      />
                      <div
                        className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-xl font-bold text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}
                      >
                        {index + 1}
                      </div>
                    </div>

                    {/* Card */}
                    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 dark:border-slate-800/80 dark:bg-slate-900/80 dark:hover:border-slate-700 dark:hover:shadow-slate-900/50">
                      {/* Card Hover Gradient */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${!step.bgLight} opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:opacity-0 dark:group-hover:opacity-0`}
                      />

                      <div className="relative">
                        {/* Icon */}
                        <div
                          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${step.iconBg} ring-1 ring-slate-200/60 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg dark:ring-slate-700/60 ${step.darkIconBg}`}
                        >
                          <Icon
                            className={`h-7 w-7 ${step.iconColor} ${step.darkIconColor}`}
                          />
                        </div>

                        {/* Title */}
                        <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                          {t(`steps.${step.key}.title`)}
                        </h3>

                        {/* Description */}
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {t(`steps.${step.key}.descriptionDesktop`)}
                        </p>
                      </div>

                      {/* Bottom Accent Line */}
                      <div
                        className={`absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r ${step.color} transition-all duration-300 group-hover:w-3/4`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Steps */}
          <div className="relative mx-auto w-full max-w-md space-y-6 md:hidden">
            {/* Vertical Connecting Line */}
            <div className="absolute bottom-4 left-[22px] top-4 w-0.5">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-300 via-blue-400 to-violet-400 dark:from-emerald-700 dark:via-blue-700 dark:to-violet-700" />
            </div>

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.key}
                  className="group relative flex items-start gap-5"
                >
                  {/* Step Number */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-base font-bold text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}
                    >
                      {index + 1}
                    </div>
                  </div>

                  {/* Card */}
                  <div className="relative flex-1 overflow-hidden rounded-xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900/80 dark:hover:border-slate-700">
                    <div className="mb-2 flex items-center gap-2">
                      <div
                        className={`rounded-lg ${step.iconBg} p-1.5 ${step.darkIconBg}`}
                      >
                        <Icon
                          className={`h-4 w-4 ${step.iconColor} ${step.darkIconColor}`}
                        />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {t(`steps.${step.key}.title`)}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {t(`steps.${step.key}.descriptionMobile`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <a href={homeLinks.hero}>
              <Button className="group relative overflow-hidden rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-6 text-base font-medium text-white shadow-xl shadow-teal-200/50 transition-all duration-300 hover:from-teal-700 hover:to-emerald-700 hover:shadow-2xl hover:shadow-teal-200/60 dark:shadow-teal-900/50 dark:hover:shadow-teal-900/60">
                {/* Button Shine */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                <span className="relative flex items-center gap-2">
                  {t("ctaButton")}
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent dark:from-gray-950" />
    </section>
  );
}
