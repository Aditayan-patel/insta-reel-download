"use client";

import React from "react";
import {
  Download,
  Loader2,
  Link2,
  Search,
  ImagePlus,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function InstagramThumbnailDownloader() {
  const [url, setUrl] = React.useState("");
  const [thumbnails, setThumbnails] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const extractShortcode = (url: string) => {
    const match = url.match(/\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const handleFetchThumbnail = async () => {
    const shortcode = extractShortcode(url);
    if (!shortcode) {
      toast.error("Invalid Instagram URL");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/instagram/post/${shortcode}`);
      const data = await response.json();
      if (data.data?.xdt_shortcode_media) {
        const media = data.data.xdt_shortcode_media;
        const thumbnails: string[] = [];
        if (media.display_url) thumbnails.push(media.display_url);
        if (media.thumbnail_src) thumbnails.push(media.thumbnail_src);
        if (media.carousel_media) {
          media.carousel_media.forEach((item: any) => {
            if (item.image_versions2?.candidates?.[0]?.url)
              thumbnails.push(item.image_versions2.candidates[0].url);
          });
        }
        setThumbnails(thumbnails);
        toast.success(`Found ${thumbnails.length} thumbnails!`);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (thumbnailUrl: string, index: number) => {
    const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(thumbnailUrl)}&filename=thumbnail_${index + 1}.jpg`;
    window.open(proxyUrl, "_blank");
    toast.success(`Thumbnail ${index + 1} download started!`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleFetchThumbnail();
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-teal-500/30 p-4 backdrop-blur-xl transition-all duration-300 hover:border-slate-300 hover:shadow-lg dark:border-slate-800/80 dark:bg-black/80 dark:hover:border-slate-700">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-orange-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-amber-950/30 dark:to-orange-950/30" />

      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 p-2 ring-1 ring-amber-200/60 dark:from-amber-900/50 dark:to-orange-900/50 dark:ring-amber-700/60">
            <ImagePlus className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Post Downloader
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Extract HD Post
            </p>
          </div>
        </div>

        {/* URL Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute top-1/2 left-2.5 z-10 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <Input
              placeholder="Paste post/reel URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-9 rounded-lg border-slate-200/80 bg-white/80 pr-3 pl-8 text-xs text-slate-900 placeholder:text-slate-400 backdrop-blur-sm focus:border-amber-400 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-300 dark:placeholder:text-slate-500"
            />
          </div>
          <Button
            onClick={handleFetchThumbnail}
            disabled={loading}
            size="sm"
            className="h-9 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 px-3 text-xs font-medium text-white shadow-md hover:from-amber-700 hover:to-orange-700"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Search className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>

        {/* Thumbnails Grid */}
        {thumbnails.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-600 dark:text-slate-400">
                {thumbnails.length} POST
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-600 dark:bg-amber-900/50 dark:text-amber-400">
                <Image className="h-2.5 w-2.5" />
                HD
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {thumbnails.map((thumb, index) => (
                <div
                  key={index}
                  className="group/thumb relative overflow-hidden rounded-lg border border-slate-200/80 bg-slate-100 dark:border-slate-700/80 dark:bg-slate-800"
                >
                  <div className="absolute top-1 left-1 z-10 rounded bg-black/60 px-1 py-0.5 text-[10px] text-white">
                    #{index + 1}
                  </div>
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={thumb}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover/thumb:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-gradient-to-t from-amber-600/80 to-transparent opacity-0 transition-all duration-300 group-hover/thumb:opacity-100">
                    <button
                      onClick={() => handleDownload(thumb, index)}
                      className="rounded-full bg-white p-1.5 shadow-lg hover:bg-white/90"
                    >
                      <Download className="h-3.5 w-3.5 text-slate-700" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && thumbnails.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Image className="mb-2 h-6 w-6 text-slate-300 dark:text-slate-600" />
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Paste URL to extract thumbnails
            </p>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 transition-all duration-300 group-hover:w-1/2" />
    </div>
  );
}