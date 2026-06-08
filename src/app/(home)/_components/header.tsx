"use client";

import React from "react";

import { useTranslations } from "next-intl";
import { useIsMobile } from "@/hooks/use-is-mobile";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { LogoImage, LogoText } from "@/components/logo";
import { LocaleDropdown } from "@/features/i18n/locale-dropdown";
import { ThemeToggleButton } from "@/features/theme/theme-toggle-button";

import { Menu, Wrench, Sun, Moon } from "lucide-react";

import { homeLinks } from "@/lib/constants";

export function Header() {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  const t = useTranslations("layouts.home.header");

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  React.useEffect(() => {
    if (!isMobile && open) {
      setOpen(false);
    }
  }, [isMobile, open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:border-slate-800/80 dark:bg-gray-950/80 dark:supports-[backdrop-filter]:bg-gray-950/60">
      {/* Subtle Bottom Gradient Line */}
      <div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-teal-300/50 to-transparent dark:via-teal-700/50" />

      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        {/* Logo */}
        <div
          role="button"
          onClick={scrollUp}
          className="group flex cursor-pointer items-center gap-2.5 transition-transform duration-200 hover:scale-105"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-teal-500/20 blur-xl transition-all duration-300 group-hover:bg-teal-500/30" />
            <LogoImage className="relative h-7 w-7 text-teal-500 transition-all duration-300 group-hover:text-teal-600" />
          </div>
          <LogoText />
        </div>

        {/* Desktop Navigation */}
        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {/* Tools Link */}
          <a
            href="#tools"
            className="relative rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-teal-50/80 hover:text-teal-600 dark:text-slate-400 dark:hover:bg-teal-950/50 dark:hover:text-teal-400"
          >
            <span className="flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5" />
              Tools
            </span>
          </a>

          <a
            href={homeLinks.features}
            className="relative rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-teal-50/80 hover:text-teal-600 dark:text-slate-400 dark:hover:bg-teal-950/50 dark:hover:text-teal-400"
          >
            {t("links.features")}
          </a>
          <a
            href={homeLinks.howItWorks}
            className="relative rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-teal-50/80 hover:text-teal-600 dark:text-slate-400 dark:hover:bg-teal-950/50 dark:hover:text-teal-400"
          >
            {t("links.howItWorks")}
          </a>
          <a
            href={homeLinks.frequentlyAsked}
            className="relative rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-teal-50/80 hover:text-teal-600 dark:text-slate-400 dark:hover:bg-teal-950/50 dark:hover:text-teal-400"
          >
            {t("links.frequentlyAsked")}
          </a>

          <div className="ml-3 flex items-center gap-1 border-l border-slate-200/80 pl-3 dark:border-slate-800/80">
            <LocaleDropdown />
            <ThemeToggleButton />
          </div>
        </nav>

        {/* Mobile: Theme & Locale Icons + Menu Button */}
        <div className="ml-auto flex items-center gap-1.5 md:hidden">
          {/* Theme Toggle - Mobile */}
          <ThemeToggleButton />

          {/* Locale Dropdown - Mobile */}
          <LocaleDropdown />

          {/* Mobile Menu Button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-lg border border-slate-200/80 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-teal-300 hover:bg-teal-50/80 hover:text-teal-600 dark:border-slate-800/80 dark:bg-slate-900/80 dark:hover:border-teal-700 dark:hover:bg-teal-950/50 dark:hover:text-teal-400"
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85%] border-l border-slate-200/80 bg-gradient-to-b from-white via-white to-slate-50 pr-0 sm:w-[350px] dark:border-slate-800/80 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900"
            >
              {/* Sheet Background Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

              {/* Sheet Top Gradient Line */}
              <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-teal-300/50 to-transparent dark:via-teal-700/50" />

              <div className="relative flex h-full flex-col">
                <SheetHeader className="border-b border-slate-200/80 pb-5 dark:border-slate-800/80">
                  <SheetTitle>
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-lg bg-teal-500/20 blur-xl" />
                        <LogoImage className="relative h-7 w-7 text-teal-500" />
                      </div>
                      <LogoText />
                    </div>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Nav Links */}
                <nav className="flex flex-col gap-1 px-4 py-6">
                  {/* Tools Link */}
                  <a
                    href="#tools"
                    className="group relative flex items-center rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition-all duration-200 hover:bg-teal-50/80 hover:text-teal-600 dark:text-slate-300 dark:hover:bg-teal-950/50 dark:hover:text-teal-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute top-1/2 left-0 h-0 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-teal-400 to-emerald-400 opacity-0 transition-all duration-200 group-hover:h-3/4 group-hover:opacity-100" />
                    <span className="flex items-center gap-2.5">
                      <Wrench className="h-4 w-4 text-teal-500" />
                      Tools
                    </span>
                  </a>

                  <a
                    href={homeLinks.features}
                    className="group relative flex items-center rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition-all duration-200 hover:bg-teal-50/80 hover:text-teal-600 dark:text-slate-300 dark:hover:bg-teal-950/50 dark:hover:text-teal-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute top-1/2 left-0 h-0 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-teal-400 to-emerald-400 opacity-0 transition-all duration-200 group-hover:h-3/4 group-hover:opacity-100" />
                    <span className="flex items-center gap-2.5">
                      <span className="text-teal-500">✦</span>
                      {t("links.features")}
                    </span>
                  </a>

                  <a
                    href={homeLinks.howItWorks}
                    className="group relative flex items-center rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition-all duration-200 hover:bg-teal-50/80 hover:text-teal-600 dark:text-slate-300 dark:hover:bg-teal-950/50 dark:hover:text-teal-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute top-1/2 left-0 h-0 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-teal-400 to-emerald-400 opacity-0 transition-all duration-200 group-hover:h-3/4 group-hover:opacity-100" />
                    <span className="flex items-center gap-2.5">
                      <span className="text-teal-500">◈</span>
                      {t("links.howItWorks")}
                    </span>
                  </a>

                  <a
                    href={homeLinks.frequentlyAsked}
                    className="group relative flex items-center rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition-all duration-200 hover:bg-teal-50/80 hover:text-teal-600 dark:text-slate-300 dark:hover:bg-teal-950/50 dark:hover:text-teal-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute top-1/2 left-0 h-0 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-teal-400 to-emerald-400 opacity-0 transition-all duration-200 group-hover:h-3/4 group-hover:opacity-100" />
                    <span className="flex items-center gap-2.5">
                      <span className="text-teal-500">◉</span>
                      {t("links.frequentlyAsked")}
                    </span>
                  </a>
                </nav>

                {/* Mobile Settings */}
                <div className="mt-auto border-t border-slate-200/80 px-4 py-5 dark:border-slate-800/80">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50/80 px-4 py-3 backdrop-blur-sm dark:bg-slate-900/50">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Sun className="h-4 w-4 text-amber-500 dark:hidden" />
                      <Moon className="hidden h-4 w-4 text-blue-400 dark:block" />
                      {t("themeLabel")}
                    </span>
                    <ThemeToggleButton />
                  </div>
                </div>

                {/* Mobile Bottom Accent */}
                <div className="absolute bottom-0 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-200 via-teal-400 to-teal-200 opacity-50 dark:from-teal-800 dark:via-teal-600 dark:to-teal-800" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
