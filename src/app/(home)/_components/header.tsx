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
  const [scrolled, setScrolled] = React.useState(false);

  const t = useTranslations("layouts.home.header");

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  React.useEffect(() => {
    if (!isMobile && open) {
      setOpen(false);
    }
  }, [isMobile, open]);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80"
          : "bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
      }`}
    >
      {/* Subtle Bottom Gradient Line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />

      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        {/* Logo */}
        <div
          role="button"
          onClick={scrollUp}
          className="group flex cursor-pointer items-center gap-2.5 transition-transform duration-200 hover:scale-105"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-teal-500/20 blur-xl transition-all duration-300 group-hover:bg-teal-500/30" />
            <LogoImage className="relative h-7 w-7 text-teal-600 transition-all duration-300 group-hover:text-teal-700 dark:text-teal-400 dark:group-hover:text-teal-300" />
          </div>
          <LogoText />
        </div>

        {/* Desktop Navigation */}
        <nav className="ml-auto hidden items-center gap-1 md:flex">
          <a
            href="#tools"
            className="relative rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-all duration-200 hover:bg-teal-50/80 hover:text-teal-600 dark:hover:bg-teal-950/30 dark:hover:text-teal-400"
          >
            <span className="flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5" />
              Tools
            </span>
          </a>

          <a
            href={homeLinks.features}
            className="relative rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-all duration-200 hover:bg-teal-50/80 hover:text-teal-600 dark:hover:bg-teal-950/30 dark:hover:text-teal-400"
          >
            {t("links.features")}
          </a>
          <a
            href={homeLinks.howItWorks}
            className="relative rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-all duration-200 hover:bg-teal-50/80 hover:text-teal-600 dark:hover:bg-teal-950/30 dark:hover:text-teal-400"
          >
            {t("links.howItWorks")}
          </a>
          <a
            href={homeLinks.frequentlyAsked}
            className="relative rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-all duration-200 hover:bg-teal-50/80 hover:text-teal-600 dark:hover:bg-teal-950/30 dark:hover:text-teal-400"
          >
            {t("links.frequentlyAsked")}
          </a>

          <div className="ml-3 flex items-center gap-1 border-l border-border/50 pl-3">
            <LocaleDropdown />
            <ThemeToggleButton />
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="ml-auto flex items-center gap-1.5 md:hidden">
          <ThemeToggleButton />
          <LocaleDropdown />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-lg border border-border/50 bg-background/80 backdrop-blur-sm transition-all duration-200 hover:border-teal-300 hover:bg-teal-50/80 hover:text-teal-600 dark:hover:border-teal-700 dark:hover:bg-teal-950/30 dark:hover:text-teal-400"
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85%] border-l border-border/50 bg-gradient-to-b from-background via-background/95 to-muted/90 pr-0 sm:w-[350px]"
            >
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />

              <div className="relative flex h-full flex-col">
                <SheetHeader className="border-b border-border/50 pb-5">
                  <SheetTitle>
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-lg bg-teal-500/20 blur-xl" />
                        <LogoImage className="relative h-7 w-7 text-teal-600 dark:text-teal-400" />
                      </div>
                      <LogoText />
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-1 px-4 py-6">
                  <a
                    href="#tools"
                    className="group relative flex items-center rounded-xl px-4 py-3 text-base font-medium text-foreground/80 transition-all duration-200 hover:bg-teal-50/80 hover:text-teal-600 dark:hover:bg-teal-950/30 dark:hover:text-teal-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute left-0 top-1/2 h-0 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-teal-500 to-emerald-500 opacity-0 transition-all duration-200 group-hover:h-3/4 group-hover:opacity-100" />
                    <span className="flex items-center gap-2.5">
                      <Wrench className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      Tools
                    </span>
                  </a>

                  <a
                    href={homeLinks.features}
                    className="group relative flex items-center rounded-xl px-4 py-3 text-base font-medium text-foreground/80 transition-all duration-200 hover:bg-teal-50/80 hover:text-teal-600 dark:hover:bg-teal-950/30 dark:hover:text-teal-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute left-0 top-1/2 h-0 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-teal-500 to-emerald-500 opacity-0 transition-all duration-200 group-hover:h-3/4 group-hover:opacity-100" />
                    <span className="flex items-center gap-2.5">
                      <span className="text-teal-600 dark:text-teal-400">✦</span>
                      {t("links.features")}
                    </span>
                  </a>

                  <a
                    href={homeLinks.howItWorks}
                    className="group relative flex items-center rounded-xl px-4 py-3 text-base font-medium text-foreground/80 transition-all duration-200 hover:bg-teal-50/80 hover:text-teal-600 dark:hover:bg-teal-950/30 dark:hover:text-teal-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute left-0 top-1/2 h-0 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-teal-500 to-emerald-500 opacity-0 transition-all duration-200 group-hover:h-3/4 group-hover:opacity-100" />
                    <span className="flex items-center gap-2.5">
                      <span className="text-teal-600 dark:text-teal-400">◈</span>
                      {t("links.howItWorks")}
                    </span>
                  </a>

                  <a
                    href={homeLinks.frequentlyAsked}
                    className="group relative flex items-center rounded-xl px-4 py-3 text-base font-medium text-foreground/80 transition-all duration-200 hover:bg-teal-50/80 hover:text-teal-600 dark:hover:bg-teal-950/30 dark:hover:text-teal-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute left-0 top-1/2 h-0 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-teal-500 to-emerald-500 opacity-0 transition-all duration-200 group-hover:h-3/4 group-hover:opacity-100" />
                    <span className="flex items-center gap-2.5">
                      <span className="text-teal-600 dark:text-teal-400">◉</span>
                      {t("links.frequentlyAsked")}
                    </span>
                  </a>
                </nav>

                <div className="mt-auto border-t border-border/50 px-4 py-5">
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3 backdrop-blur-sm">
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                      <Sun className="h-4 w-4 text-amber-500 dark:hidden" />
                      <Moon className="hidden h-4 w-4 text-teal-500 dark:block" />
                      {t("themeLabel")}
                    </span>
                    <ThemeToggleButton />
                  </div>
                </div>

                <div className="absolute bottom-0 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-300 via-teal-500 to-teal-300 opacity-50 dark:from-teal-700 dark:via-teal-500 dark:to-teal-700" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}