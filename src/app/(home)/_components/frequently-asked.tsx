import React from "react";

import { useTranslations } from "next-intl";
import { HelpCircle, Shield } from "lucide-react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { homeSections } from "@/lib/constants";

const sections = [
  {
    key: "general",
    icon: HelpCircle,
    gradient: "from-emerald-500 to-teal-600",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    hoverColor: "hover:text-emerald-600 dark:hover:text-emerald-400",
    questions: ["q1", "q2", "q3"],
  },
  {
    key: "technical",
    icon: Shield,
    gradient: "from-blue-500 to-indigo-600",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    hoverColor: "hover:text-blue-600 dark:hover:text-blue-400",
    questions: ["q1", "q2", "q3"],
  },
];

export function FrequentlyAsked() {
  const t = useTranslations("pages.home.frequentlyAsked");

  return (
    <section
      id={homeSections.frequentlyAsked}
      className="relative w-full scroll-mt-12 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 md:py-28 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Gradient Orbs */}
      <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-teal-200/20 to-emerald-200/20 blur-3xl dark:from-teal-500/10 dark:to-emerald-500/10" />
      <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-blue-200/20 to-purple-200/20 blur-3xl dark:from-blue-500/10 dark:to-purple-500/10" />

      <div className="relative container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-teal-200/60 bg-teal-50/80 px-4 py-1.5 text-sm font-medium text-teal-700 backdrop-blur-sm dark:border-teal-800/60 dark:bg-teal-950/50 dark:text-teal-300">
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-teal-500" />
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

          {/* FAQ Sections */}
          <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-6 lg:gap-8">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.key}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 sm:p-8 dark:border-slate-800/80 dark:bg-slate-900/80 dark:hover:border-slate-700 dark:hover:shadow-slate-900/50"
                >
                  {/* Card Gradient Border Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-transparent to-slate-900/[0.02] opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-white/[0.02]" />

                  {/* Section Header */}
                  <div className="relative mb-6 flex items-center gap-4">
                    <div
                      className={`rounded-xl ${section.iconBg} p-2.5 ring-1 ring-slate-200/60 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg dark:ring-slate-700/60`}
                    >
                      <div
                        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${section.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
                      />
                      <Icon
                        className={`relative h-5 w-5 ${section.iconColor}`}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {t(`sections.${section.key}.title`)}
                      </h3>
                      <div
                        className={`h-0.5 w-0 rounded-full bg-gradient-to-r ${section.gradient} transition-all duration-300 group-hover:w-3/4`}
                      />
                    </div>
                  </div>

                  {/* Accordion */}
                  <Accordion
                    type="single"
                    collapsible
                    className="relative w-full space-y-1"
                  >
                    {section.questions.map((question, index) => (
                      <AccordionItem
                        key={`${section.key}-${question}`}
                        value={`${section.key}-${question}`}
                        className="rounded-lg border border-transparent px-3 transition-all duration-200 hover:border-slate-200/80 hover:bg-slate-50/80 dark:hover:border-slate-700/80 dark:hover:bg-slate-800/50"
                      >
                        <AccordionTrigger
                          className={`py-4 text-left font-medium text-slate-700 transition-colors duration-200 ${section.hoverColor} hover:no-underline dark:text-slate-300`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold ${section.iconColor} opacity-50`}
                            >
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            {t(`sections.${section.key}.${question}.trigger`)}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pl-9 text-start text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {t(`sections.${section.key}.${question}.content`)}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {/* Bottom Accent Line */}
                  <div
                    className={`absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r ${section.gradient} transition-all duration-300 group-hover:w-3/4`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
