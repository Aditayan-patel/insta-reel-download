"use client";

import React from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Download, Loader2, X } from "lucide-react";

import { cn, getPostShortcode, isShortcodePresent } from "@/lib/utils";
import { useGetInstagramPostMutation } from "@/features/react-query/mutations/instagram";
import { HTTP_CODE_ENUM } from "@/features/api/http-codes";

// 5 minutes
const CACHE_TIME = 5 * 60 * 1000;

const useFormSchema = () => {
  const t = useTranslations("components.instagramForm.inputs");

  return z.object({
    url: z
      .string({ required_error: t("url.validation.required") })
      .trim()
      .min(1, {
        message: t("url.validation.required"),
      })
      .startsWith("https://www.instagram.com", t("url.validation.invalid"))
      .refine(
        (value) => {
          return isShortcodePresent(value);
        },
        { message: t("url.validation.invalid") }
      ),
  });
};

function triggerDownload(videoUrl: string) {
  if (typeof window === "undefined") return;

  const randomTime = new Date().getTime().toString().slice(-8);
  const filename = `gram-grabberz-${randomTime}.mp4`;

  const proxyUrl = new URL("/api/download-proxy", window.location.origin);
  proxyUrl.searchParams.append("url", videoUrl);
  proxyUrl.searchParams.append("filename", filename);

  const link = document.createElement("a");
  link.href = proxyUrl.toString();
  link.target = "_blank";
  link.setAttribute("download", filename);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

type CachedUrl = {
  videoUrl?: string;
  expiresAt: number;
  invalid?: {
    messageKey: string;
  };
};

interface InstagramFormProps {
  className?: string;
  pastedUrl?: string;
  onUrlConsumed?: () => void;
}

export function InstagramForm(props: InstagramFormProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const cachedUrls = React.useRef(new Map<string, CachedUrl>());
  const previousPastedUrl = React.useRef<string>("");

  const t = useTranslations("components.instagramForm");

  // Destructure props for useEffect dependency
  const { pastedUrl, onUrlConsumed, className } = props;

  const {
    isError,
    isPending,
    mutateAsync: getInstagramPost,
  } = useGetInstagramPostMutation();

  const formSchema = useFormSchema();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const errorMessage = form.formState.errors.url?.message;
  const isDisabled = isPending || !form.formState.isDirty;
  const isShowClearButton = form.watch("url").length > 0;

  function clearUrlField() {
    form.setValue("url", "");
    form.clearErrors("url");
    inputRef.current?.focus();
  }

  function setCachedUrl(
    shortcode: string,
    videoUrl?: string,
    invalid?: CachedUrl["invalid"]
  ) {
    cachedUrls.current?.set(shortcode, {
      videoUrl,
      expiresAt: Date.now() + CACHE_TIME,
      invalid,
    });
  }

  function getCachedUrl(shortcode: string) {
    const cachedUrl = cachedUrls.current?.get(shortcode);

    if (!cachedUrl) {
      return null;
    }

    if (cachedUrl.expiresAt < Date.now()) {
      cachedUrls.current.delete(shortcode);
      return null;
    }

    return cachedUrl;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isError) {
      toast.dismiss("toast-error");
    }

    const shortcode = getPostShortcode(values.url);

    if (!shortcode) {
      form.setError("url", { message: t("inputs.url.validation.invalid") });
      return;
    }

    const cachedUrl = getCachedUrl(shortcode);
    if (cachedUrl?.invalid) {
      form.setError("url", { message: t(cachedUrl.invalid.messageKey) });
      return;
    }

    if (cachedUrl?.videoUrl) {
      triggerDownload(cachedUrl.videoUrl);
      return;
    }

    try {
      const { data, status } = await getInstagramPost({ shortcode });

      if (status === HTTP_CODE_ENUM.OK) {
        const downloadUrl = data.data.xdt_shortcode_media.video_url;
        if (downloadUrl) {
          triggerDownload(downloadUrl);
          setCachedUrl(shortcode, downloadUrl);
          toast.success(t("toasts.success"), {
            id: "toast-success",
            position: "top-center",
            duration: 1500,
          });
        } else {
          throw new Error("Video URL not found");
        }
      } else if (
        status === HTTP_CODE_ENUM.NOT_FOUND ||
        status === HTTP_CODE_ENUM.BAD_REQUEST ||
        status === HTTP_CODE_ENUM.TOO_MANY_REQUESTS ||
        status === HTTP_CODE_ENUM.INTERNAL_SERVER_ERROR
      ) {
        const errorMessageKey = `serverErrors.${data.error}`;
        form.setError("url", { message: t(errorMessageKey) });
        if (
          status === HTTP_CODE_ENUM.BAD_REQUEST ||
          status === HTTP_CODE_ENUM.NOT_FOUND
        ) {
          setCachedUrl(shortcode, undefined, {
            messageKey: errorMessageKey,
          });
        }
      } else {
        throw new Error("Failed to fetch video");
      }
    } catch (error) {
      console.error(error);
      toast.error(t("toasts.error"), {
        dismissible: true,
        id: "toast-error",
        position: "top-center",
      });
    }
  }

  // Jab Hero se pastedUrl aaye to input mein set karo with shouldDirty
  React.useEffect(() => {
    if (pastedUrl && pastedUrl !== previousPastedUrl.current) {
      previousPastedUrl.current = pastedUrl;
      
      form.setValue("url", pastedUrl, { 
        shouldDirty: true,
        shouldValidate: true,
      });
      form.clearErrors("url");
      
      onUrlConsumed?.();
      
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pastedUrl]);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className={cn("w-full space-y-2", className)}>
      {/* Error Message */}
      {errorMessage ? (
        <div className="flex items-center gap-2 rounded-lg border border-red-200/80 bg-red-50/80 px-3 py-2 text-sm text-red-600 backdrop-blur-sm dark:border-red-800/80 dark:bg-red-950/50 dark:text-red-400">
          <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
            <X className="h-3 w-3 text-red-500" />
          </div>
          <span>{errorMessage}</span>
        </div>
      ) : (
        <div className="h-2"></div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full items-end gap-2"
        >
          <FormField
            control={form.control}
            name="url"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="sr-only">
                  {t("inputs.url.label")}
                </FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      {...field}
                      type="url"
                      ref={inputRef}
                      minLength={1}
                      maxLength={255}
                      placeholder={t("inputs.url.placeholder")}
                      className={cn(
                        "h-12 rounded-xl border-slate-200/80 bg-white/80 pr-12 text-sm backdrop-blur-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-300 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-teal-600 dark:focus:ring-teal-900/50",
                        errorMessage && "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-800 dark:focus:border-red-700 dark:focus:ring-red-900/50"
                      )}
                    />
                    
                    {/* Modern Clear Button */}
                    {isShowClearButton && (
                      <button
                        type="button"
                        onClick={clearUrlField}
                        className="group absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500 dark:text-slate-500 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                        aria-label="Clear input"
                      >
                        <X className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
                      </button>
                    )}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Download Button */}
          <Button
            disabled={isDisabled}
            type="submit"
            className="group relative h-12 overflow-hidden rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 text-sm font-medium text-white shadow-lg shadow-teal-200/50 transition-all duration-300 hover:from-teal-700 hover:to-emerald-700 hover:shadow-xl hover:shadow-teal-200/60 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-teal-900/50 dark:hover:shadow-teal-900/60"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            
            <span className="relative flex items-center gap-2">
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
              )}
              <span className="hidden sm:inline">{t("submit")}</span>
            </span>
          </Button>
        </form>
      </Form>

      {/* Hint Text */}
      <p className="text-center text-xs text-slate-400 dark:text-slate-500">
        {t("hint")}
      </p>
    </div>
  );
}