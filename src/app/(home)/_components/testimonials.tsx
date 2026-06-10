import React from "react";

import { useTranslations } from "next-intl";

import { Download, Users, Star, TrendingUp } from "lucide-react";

import { homeSections } from "@/lib/constants";

const stats = [
  {
    key: "downloads",
    icon: Download,
    value: "50K+",
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    darkIconBg: "dark:bg-emerald-900/50",
    darkIconColor: "dark:text-emerald-400",
  },
  {
    key: "users",
    icon: Users,
    value: "100K+",
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    darkIconBg: "dark:bg-blue-900/50",
    darkIconColor: "dark:text-blue-400",
  },
  {
    key: "rating",
    icon: Star,
    value: "4.9/5",
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-50 to-orange-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    darkIconBg: "dark:bg-amber-900/50",
    darkIconColor: "dark:text-amber-400",
  },
];

export function Testimonials() {
  const t = useTranslations("pages.home.testimonials");

  return (
    <section
      id={homeSections.testimonials}
      className="relative w-full scroll-mt-12 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 md:py-28 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-teal-200/20 to-emerald-200/20 blur-3xl dark:from-teal-500/10 dark:to-emerald-500/10" />
      <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-blue-200/20 to-purple-200/20 blur-3xl dark:from-blue-500/10 dark:to-purple-500/10" />

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {/* Title & Description */}
          <div className="max-w-2xl space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl dark:text-white">
              {t("title")}
            </h2>
            <p className="text-lg leading-relaxed text-slate-600 md:text-xl dark:text-slate-400">
              {t("description")}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.key}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 sm:p-8 dark:border-slate-800/80 dark:bg-slate-900/80 dark:hover:border-slate-700 dark:hover:shadow-slate-900/50"
                >
                  {/* Card Hover Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${!stat.bgGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:opacity-0`} />
                  
                  {/* Animated Counter Background */}
                  <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-5 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-10`} />
                  
                  <div className="relative flex flex-col items-center space-y-4">
                    {/* Icon */}
                    <div className={`relative rounded-2xl ${stat.iconBg} p-3 ring-1 ring-slate-200/60 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg dark:ring-slate-700/60 ${stat.darkIconBg}`}>
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10`} />
                      <Icon className={`relative h-7 w-7 ${stat.iconColor} transition-transform duration-300 group-hover:rotate-12 ${stat.darkIconColor}`} />
                    </div>

                    {/* Value with Gradient Text */}
                    <div className="space-y-1">
                      <span className={`block text-4xl font-black tracking-tight bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent sm:text-5xl`}>
                        {stat.value}
                      </span>
                      
                      {/* Animated Counter Bar */}
                      <div className="mx-auto h-1 w-12 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div className={`h-full w-full rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-500 group-hover:translate-x-0 -translate-x-full`} />
                      </div>
                    </div>

                    {/* Label */}
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {t(`stats.${stat.key}`)}
                    </span>
                  </div>

                  {/* Bottom Accent Line */}
                  <div className={`absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-300 group-hover:w-3/4`} />
                </div>
              );
            })}
          </div>

          {/* Additional Trust Indicator */}
          <div className="mt-8 flex items-center gap-2 rounded-full border border-teal-200/60 bg-teal-50/80 px-4 py-2 text-sm font-medium text-teal-700 backdrop-blur-sm dark:border-teal-800/60 dark:bg-teal-950/50 dark:text-teal-300">
            <TrendingUp className="h-4 w-4" />
            Growing every day
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent dark:from-gray-950" />
    </section>
  );
}