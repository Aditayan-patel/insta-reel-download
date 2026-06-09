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

import { Download, Loader2, X, Play, CheckCircle2 } from "lucide-react";

import { cn, getPostShortcode, isShortcodePresent } from "@/lib/utils";
import { useGetInstagramPostMutation } from "@/features/react-query/mutations/instagram";
import { HTTP_CODE_ENUM } from "@/features/api/http-codes";

// 5 minutes
const CACHE_TIME = 5 * 60 * 1000;

// ─── Types ────────────────────────────────────────────────────────────────────

interface MediaItem {
  url: string;
  type: "video";
  thumbnail?: string;
}

type CachedEntry = {
  mediaItems?: MediaItem[];
  expiresAt: number;
  invalid?: { messageKey: string };
};

// API Response type
interface APIErrorResponse {
  error?: string;
  message?: string;
  statusCode?: HTTP_CODE_ENUM;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function randomSuffix() {
  return Math.floor(100000 + Math.random() * 900000);
}

function triggerDownload(mediaUrl: string) {
  if (typeof window === "undefined") return;

  const filename = `reelsdl_${randomSuffix()}.mp4`;

  const proxyUrl = new URL("/api/download-proxy", window.location.origin);
  proxyUrl.searchParams.append("url", mediaUrl);
  proxyUrl.searchParams.append("filename", filename);

  const link = document.createElement("a");
  link.href = proxyUrl.toString();
  link.setAttribute("download", filename);
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  setTimeout(() => document.body.removeChild(link), 1000);
}

/** Normalize API response to MediaItem[] - Only videos/reels */
function normalizeMedia(data: any): MediaItem[] {
  // Shape 1: { mediaUrls: [{url, type, thumbnail?}] } - Filter only videos
  if (data?.mediaUrls?.length > 0) {
    const videos = data.mediaUrls.filter((m: any) => m.type === "video");
    return videos.map((m: any) => ({
      url: m.url,
      type: "video",
      thumbnail: m.thumbnail,
    }));
  }

  // Shape 2: { data: { xdt_shortcode_media: {...} } }
  const media = data?.data?.xdt_shortcode_media;
  if (media) {
    // Carousel — multiple videos only
    if (media.edge_sidecar_to_children?.edges?.length > 0) {
      const videos = media.edge_sidecar_to_children.edges
        .map((edge: any) => {
          const node = edge.node;
          if (node.is_video && node.video_url) {
            const imageUrl =
              node.display_resources?.slice(-1)?.[0]?.src || node.display_url;
            return {
              url: node.video_url,
              type: "video" as const,
              thumbnail: imageUrl,
            };
          }
          return null;
        })
        .filter((item: any) => item !== null);

      if (videos.length > 0) return videos;
    }

    // Single video/reel
    if (media.is_video && media.video_url) {
      return [
        {
          url: media.video_url,
          type: "video",
          thumbnail:
            media.display_resources?.slice(-1)?.[0]?.src || media.display_url,
        },
      ];
    }
  }

  // Shape 3: { downloadUrl, type } - Only videos
  if (data?.downloadUrl && data?.type === "video") {
    return [
      {
        url: data.downloadUrl,
        type: "video",
        thumbnail: data.thumbnail,
      },
    ];
  }

  return [];
}

// ─── Form Schema ──────────────────────────────────────────────────────────────

const useFormSchema = () => {
  const t = useTranslations("components.instagramForm.inputs");

  return z.object({
    url: z
      .string({ required_error: t("url.validation.required") })
      .trim()
      .min(1, { message: t("url.validation.required") })
      .startsWith("https://www.instagram.com", t("url.validation.invalid"))
      .refine((value) => isShortcodePresent(value), {
        message: t("url.validation.invalid"),
      }),
  });
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface InstagramFormProps {
  className?: string;
  pastedUrl?: string;
  onUrlConsumed?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InstagramForm(props: InstagramFormProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const cachedEntries = React.useRef(new Map<string, CachedEntry>());
  const previousPastedUrl = React.useRef<string>("");

  const t = useTranslations("components.instagramForm");
  const { pastedUrl, onUrlConsumed, className } = props;

  const {
    isError,
    isPending,
    mutateAsync: getInstagramPost,
  } = useGetInstagramPostMutation();

  const formSchema = useFormSchema();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: "" },
  });

  // Preview state
  const [mediaItems, setMediaItems] = React.useState<MediaItem[]>([]);
  const [downloadingIndex, setDownloadingIndex] = React.useState<number | null>(
    null
  );

  const errorMessage = form.formState.errors.url?.message;
  const isDisabled = isPending || !form.formState.isDirty;
  const isShowClearButton = form.watch("url").length > 0;

  // ── Cache helpers ──────────────────────────────────────────────────────────

  function setCached(
    shortcode: string,
    mediaItems?: MediaItem[],
    invalid?: CachedEntry["invalid"]
  ) {
    cachedEntries.current.set(shortcode, {
      mediaItems,
      expiresAt: Date.now() + CACHE_TIME,
      invalid,
    });
  }

  function getCached(shortcode: string): CachedEntry | null {
    const entry = cachedEntries.current.get(shortcode);
    if (!entry) return null;
    if (entry.expiresAt < Date.now()) {
      cachedEntries.current.delete(shortcode);
      return null;
    }
    return entry;
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  function clearUrlField() {
    form.setValue("url", "");
    form.clearErrors("url");
    inputRef.current?.focus();
  }

  function clearAll() {
    clearUrlField();
    setMediaItems([]);
  }

  async function handleDownloadItem(item: MediaItem, index: number) {
    setDownloadingIndex(index);
    triggerDownload(item.url);
    toast.success(" Reel is downloading...", {
      id: `dl-${index}`,
      position: "top-center",
      duration: 2000,
      icon: "⬇️",
    });
    await new Promise((r) => setTimeout(r, 1200));
    setDownloadingIndex(null);
  }

  async function handleDownloadAll() {
    for (let i = 0; i < mediaItems.length; i++) {
      await handleDownloadItem(mediaItems[i], i);
      if (i < mediaItems.length - 1) {
        await new Promise((r) => setTimeout(r, 600));
      }
    }
  }

  // Helper function to safely extract error message from API response
  function getErrorMessage(data: unknown): string {
    const errorData = data as APIErrorResponse;

    // Check for error field
    if (errorData?.error) {
      return errorData.error;
    }

    // Check for message field
    if (errorData?.message) {
      return errorData.message;
    }

    // Default error
    return "unknown_error";
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isError) toast.dismiss("toast-error");

    const shortcode = getPostShortcode(values.url);
    if (!shortcode) {
      form.setError("url", { message: t("inputs.url.validation.invalid") });
      return;
    }

    const cached = getCached(shortcode);
    if (cached?.invalid) {
      form.setError("url", { message: t(cached.invalid.messageKey) });
      return;
    }
    if (cached?.mediaItems?.length) {
      setMediaItems(cached.mediaItems);
      return;
    }

    try {
      const response = await getInstagramPost({ shortcode });
      const { data, status } = response;

      if (status === HTTP_CODE_ENUM.OK) {
        const items = normalizeMedia(data);

        if (items.length === 0) {
          toast.error("❌ No reels/videos found in this post", {
            icon: "❌",
            position: "top-center",
            duration: 3000,
          });
          return;
        }

        setCached(shortcode, items);
        setMediaItems(items);

        toast.success(" Video Fetch successful...", {
          id: "toast-success",
          position: "top-center",
          duration: 1500,
          icon: "✅",
        });
      } else if (
        [
          HTTP_CODE_ENUM.NOT_FOUND,
          HTTP_CODE_ENUM.BAD_REQUEST,
          HTTP_CODE_ENUM.TOO_MANY_REQUESTS,
          HTTP_CODE_ENUM.INTERNAL_SERVER_ERROR,
        ].includes(status)
      ) {
        // Safely get error message from response
        const errorKey = getErrorMessage(data);
        const errorMessageKey = `serverErrors.${errorKey}`;

        // Check if translation exists, fallback to generic message
        let errorMessage: string;
        try {
          errorMessage = t(errorMessageKey);
          // If the translation returns the key itself, it doesn't exist
          if (errorMessage === errorMessageKey) {
            throw new Error("Translation not found");
          }
        } catch {
          // Fallback messages based on status code
          if (status === HTTP_CODE_ENUM.NOT_FOUND) {
            errorMessage = t("serverErrors.notFound");
          } else if (status === HTTP_CODE_ENUM.TOO_MANY_REQUESTS) {
            errorMessage = t("serverErrors.tooManyRequests");
          } else if (status === HTTP_CODE_ENUM.BAD_REQUEST) {
            errorMessage = t("serverErrors.notVideo");
          } else {
            errorMessage = t("serverErrors.serverError");
          }
        }

        form.setError("url", { message: errorMessage });

        if (
          [HTTP_CODE_ENUM.BAD_REQUEST, HTTP_CODE_ENUM.NOT_FOUND].includes(
            status
          )
        ) {
          setCached(shortcode, undefined, { messageKey: errorMessageKey });
        }
      } else {
        throw new Error("Failed to fetch media");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("❌ Something went wrong, please try again.", {
        dismissible: true,
        id: "toast-error",
        position: "top-center",
        icon: "❌",
      });
    }
  }

  // If pastedUrl comes from Hero, fill and submit
  React.useEffect(() => {
    if (pastedUrl && pastedUrl !== previousPastedUrl.current) {
      previousPastedUrl.current = pastedUrl;
      setMediaItems([]);
      form.setValue("url", pastedUrl, {
        shouldDirty: true,
        shouldValidate: true,
      });
      form.clearErrors("url");
      onUrlConsumed?.();
      setTimeout(() => inputRef.current?.focus(), 100);
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
        <div className="h-2" />
      )}

      {/* Form */}
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
                      onChange={(e) => {
                        field.onChange(e);
                        // Clear preview when URL changes
                        if (mediaItems.length > 0) setMediaItems([]);
                      }}
                      className={cn(
                        "h-12 rounded-xl border-slate-200/80 bg-white/80 pr-12 text-sm backdrop-blur-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-300 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-teal-600 dark:focus:ring-teal-900/50",
                        errorMessage &&
                          "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-800 dark:focus:border-red-700 dark:focus:ring-red-900/50"
                      )}
                    />
                    {isShowClearButton && (
                      <button
                        type="button"
                        onClick={clearAll}
                        aria-label="Clear input" // ✅ Already there - good!
                        className="group absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500 dark:text-slate-500 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                      >
                        <X
                          className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90"
                          aria-hidden="true"
                        />
                      </button>
                    )}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            disabled={isDisabled}
            type="submit"
            aria-label="Download Instagram reel" // ✅ Add this
            title="Download Instagram reel" // ✅ Add this
            className="group relative h-12 overflow-hidden rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 text-sm font-medium text-white shadow-lg shadow-teal-200/50 transition-all duration-300 hover:from-teal-700 hover:to-emerald-700 hover:shadow-xl hover:shadow-teal-200/60 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-teal-900/50 dark:hover:shadow-teal-900/60"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            <span className="relative flex items-center gap-2">
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Download
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              )}
              <span className="hidden sm:inline">{t("submit")}</span>
            </span>
          </Button>
        </form>
      </Form>

      {/* Media Preview - Only for reels/videos */}
      {mediaItems.length > 0 && (
        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/60 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/60">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {mediaItems.length === 1
                  ? "1 reel ready"
                  : `${mediaItems.length} reels ready`}
              </span>
            </div>
            {mediaItems.length > 1 && (
              <button
                onClick={handleDownloadAll}
                aria-label="Download all reels" // ✅ Add this
                title="Download all reels" // ✅ Add this
                className="inline-flex items-center gap-1 rounded-lg bg-teal-500 px-2.5 py-1 text-[11px] font-medium text-white transition-colors hover:bg-teal-600"
              >
                <Download className="h-2.5 w-2.5" aria-hidden="true" />
                Download All
              </button>
            )}
          </div>

          {/* Cards grid — 1 item centered, 2+ responsive 2col/4col */}
          <div
            className={cn(
              "p-2.5",
              mediaItems.length === 1
                ? "flex justify-center"
                : "grid grid-cols-2 gap-2 sm:grid-cols-4"
            )}
          >
            {mediaItems.map((item, i) => (
              <MediaCard
                key={i}
                item={item}
                index={i}
                total={mediaItems.length}
                isDownloading={downloadingIndex === i}
                onDownload={() => handleDownloadItem(item, i)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Hint */}
      <p className="text-center text-xs text-slate-400 dark:text-slate-500">
        {t("hint")}
      </p>
    </div>
  );
}

// ─── Media Card ───────────────────────────────────────────────────────────────

function MediaCard({
  item,
  index,
  total,
  isDownloading,
  onDownload,
}: {
  item: MediaItem;
  index: number;
  total: number;
  isDownloading: boolean;
  onDownload: () => void;
}) {
  const [thumbErr, setThumbErr] = React.useState(false);

  const proxyImg = (src: string) =>
    `/api/download-proxy?url=${encodeURIComponent(src)}&filename=preview_${index}.jpg`;

  const thumbSrc = (() => {
    if (thumbErr) return null;
    if (item.thumbnail) return proxyImg(item.thumbnail);
    return null;
  })();

  // Single: centered wide card | Multiple: fill grid cell (square)
  const isAlone = total === 1;

  return (
    <button
      onClick={onDownload}
      disabled={isDownloading}
      aria-label={`Download reel ${index + 1}`}
      title={`Download reel ${index + 1}`}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 transition-all duration-200",
        "hover:border-teal-400 hover:shadow-md hover:shadow-teal-100/50",
        "disabled:cursor-wait dark:border-slate-700 dark:bg-slate-800",
        "dark:hover:border-teal-500 dark:hover:shadow-teal-900/20",
        "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2",
        isAlone ? "aspect-square w-full max-w-[220px]" : "aspect-square w-full"
      )}
    >
      {/* Thumbnail */}
      {thumbSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbSrc}
          alt={`Reel ${index + 1} thumbnail`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setThumbErr(true)}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
          <Play className="h-6 w-6 text-white/60" aria-hidden="true" />
          <span className="sr-only">Video thumbnail</span>
        </div>
      )}

      {/* Type pill — top left */}
      <div className="absolute left-1.5 top-1.5">
        <span className="inline-flex items-center gap-0.5 rounded bg-black/55 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
          <Play className="h-2 w-2" aria-hidden="true" />
          <span>MP4</span>
        </span>
      </div>

      {/* Download indicator badge */}
      {isDownloading && (
        <div className="absolute right-1.5 top-1.5">
          <span className="inline-flex items-center gap-0.5 rounded bg-teal-500 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
            <Loader2 className="h-2 w-2 animate-spin" aria-hidden="true" />
            <span>Downloading</span>
          </span>
        </div>
      )}

      {/* Hover overlay */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center gap-1 transition-all duration-200",
          isDownloading
            ? "bg-teal-500/25 backdrop-blur-[2px]"
            : "bg-transparent group-hover:bg-black/35"
        )}
        aria-hidden="true"
      >
        {!isDownloading && (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 opacity-0 shadow transition-opacity duration-200 group-hover:opacity-100 dark:bg-slate-900/90">
            <Download className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
            <span className="sr-only">Download</span>
          </div>
        )}
      </div>
    </button>
  );
}
