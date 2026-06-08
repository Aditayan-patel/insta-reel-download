"use client";

import React from "react";
import {
  Download,
  Loader2,
  Link2,
  Search,
  ImagePlus,
  Image,
  Video,
  ClipboardPaste,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface MediaItem {
  url: string;
  type: string;
}

export function InstagramThumbnailDownloader() {
  const [url, setUrl] = React.useState("");
  const [mediaItems, setMediaItems] = React.useState<MediaItem[]>([]);
  const [loading, setLoading] = React.useState(false);

  const extractShortcode = (url: string) => {
    let cleanUrl = url.trim().split("?")[0];
    cleanUrl = cleanUrl.replace(/\/$/, "");
    const match = cleanUrl.match(/\/(?:p|reel|tv|reels)\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const getProxyImageUrl = (originalUrl: string) => {
    return `/api/download-proxy?url=${encodeURIComponent(originalUrl)}&filename=preview.jpg`;
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.includes("instagram.com")) {
        setUrl(text);
        toast.success("URL pasted!");
      } else {
        toast.error("No valid Instagram URL in clipboard");
      }
    } catch {
      toast.error("Clipboard access denied");
    }
  };

  const handleFetchMedia = async () => {
    const shortcode = extractShortcode(url);
    if (!shortcode) {
      toast.error("Invalid Instagram URL");
      return;
    }

    setLoading(true);
    setMediaItems([]);

    try {
      const response = await fetch(`/api/instagram/post/${shortcode}`);
      const data = await response.json();

      if (data.mediaUrls && data.mediaUrls.length > 0) {
        setMediaItems(data.mediaUrls);
        toast.success(`Found ${data.mediaUrls.length} items!`);
        setUrl("");
      } else if (data.downloadUrl) {
        setMediaItems([{ url: data.downloadUrl, type: data.type || "image" }]);
        toast.success("Found 1 item!");
        setUrl("");
      } else {
        toast.error("No media found in this post");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (mediaUrl: string, index: number, type: string) => {
    const ext = type === "video" ? "mp4" : "jpg";
    const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(mediaUrl)}&filename=instagram_${index + 1}.${ext}`;
    window.open(proxyUrl, "_blank");
    toast.success(`${type === "video" ? "Video" : "Image"} ${index + 1} download started!`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleFetchMedia();
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-teal-500/30 dark:border-neutral-800 dark:bg-black/80 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 shadow-sm">
          <ImagePlus className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-[13px] font-semibold text-neutral-900 dark:text-white leading-tight">
            Post Downloader
          </h3>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
            Images & videos from any post
          </p>
        </div>
        {mediaItems.length > 0 && (
          <div className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {mediaItems.length} found
            </span>
          </div>
        )}
      </div>

      {/* Input Row */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Link2 className="absolute top-1/2 left-3 z-10 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="instagram.com/p/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-9 pl-8 pr-3 text-[13px] rounded-xl border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus-visible:ring-orange-400/30 focus-visible:border-orange-400"
          />
        </div>

        {/* Paste button */}
        <Button
          onClick={handlePaste}
          variant="outline"
          size="sm"
          className="h-9 rounded-xl border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-[12px] font-medium px-3 gap-1.5 transition-all"
        >
          <ClipboardPaste className="h-3.5 w-3.5" />
          Paste
        </Button>

        {/* Search button */}
        <Button
          onClick={handleFetchMedia}
          disabled={loading}
          size="sm"
          className="h-9 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-[12px] font-medium px-4 gap-1.5 shadow-sm transition-all disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Search className="h-3.5 w-3.5" />
          )}
          {loading ? "Fetching..." : "Fetch"}
        </Button>
      </div>

      {/* Media Grid */}
      {mediaItems.length > 0 && (
        <div className="space-y-3">
          {/* Divider */}
          <div className="border-t border-neutral-100 dark:border-neutral-800" />

          <div className="grid grid-cols-3 gap-2 max-h-[380px] overflow-y-auto pr-0.5">
            {mediaItems.map((item, index) => (
              <div
                key={index}
                className="group/card relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 cursor-pointer"
                onClick={() => handleDownload(item.url, index, item.type)}
              >
                {/* Badge */}
                <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-1 rounded-md bg-black/50 backdrop-blur-sm px-1.5 py-0.5">
                  {item.type === "video" ? (
                    <Video className="h-2.5 w-2.5 text-white" />
                  ) : (
                    <Image className="h-2.5 w-2.5 text-white" />
                  )}
                  <span className="text-[10px] font-medium text-white/90">
                    {index + 1}
                  </span>
                </div>

                {/* Image */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={getProxyImageUrl(item.url)}
                    alt={`Media ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f0f0f0' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23aaa' font-size='13' font-family='sans-serif'%3EPreview%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md">
                      <Download className="h-3.5 w-3.5 text-neutral-700" />
                    </div>
                    <span className="text-[10px] font-medium text-white">
                      Download
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && mediaItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-7 gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900">
            <Image className="h-5 w-5 text-neutral-300 dark:text-neutral-600" />
          </div>
          <p className="text-[12px] text-neutral-400 dark:text-neutral-600 text-center max-w-[160px]">
            Paste any post or reel URL to extract media
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-7 gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-950/30">
            <Loader2 className="h-5 w-5 text-orange-400 animate-spin" />
          </div>
          <p className="text-[12px] text-neutral-400 dark:text-neutral-600">
            Fetching media...
          </p>
        </div>
      )}
    </div>
  );
}