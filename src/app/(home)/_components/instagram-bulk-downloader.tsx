"use client";

import React from "react";
import {
  Plus,
  Download,
  Loader2,
  Trash2,
  Zap,
  Link2,
  CheckCircle2,
  ClipboardPaste,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function InstagramBulkDownloader() {
  const [urls, setUrls] = React.useState<string[]>([""]);
  const [downloading, setDownloading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [completedCount, setCompletedCount] = React.useState(0);
  const [pasted, setPasted] = React.useState(false);

  const addUrlField = () => setUrls([...urls, ""]);

  const removeUrlField = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls.length ? newUrls : [""]);
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const extractShortcode = (url: string): string | null => {
    const trimmed = url.trim();
    const match = trimmed.match(/\/(?:p|reel|tv|reels)\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();

      // Handle multiple lines or space-separated URLs
      const extracted = text
        .split(/[\r\n\s]+/)
        .map((l) => l.trim())
        .filter((line) => line && line.includes("instagram.com"));

      if (extracted.length > 1) {
        // Create separate input field for each URL
        setUrls(extracted);
        setPasted(true);
        setTimeout(() => setPasted(false), 1800);
        toast.success(`${extracted.length} URLs pasted successfully!`);
      } else if (extracted.length === 1) {
        // Single URL — fill in existing empty field, otherwise add
        setUrls((prev) => {
          const emptyIndex = prev.findIndex((u) => !u.trim());
          if (emptyIndex !== -1) {
            const updated = [...prev];
            updated[emptyIndex] = extracted[0];
            return updated;
          }
          return [...prev, extracted[0]];
        });
        setPasted(true);
        setTimeout(() => setPasted(false), 1800);
        toast.success("URL pasted!");
      } else {
        toast.error("No valid Instagram URL found in clipboard");
      }
    } catch {
      toast.error("Could not access clipboard");
    }
  };

  /**
   * Proper programmatic download — `window.open` might be blocked by popup blocker,
   * so use `<a>` tag + `click()`.
   */
  const triggerDownload = (proxyUrl: string, filename: string) => {
    const a = document.createElement("a");
    a.href = proxyUrl;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    // Wait a bit so browser can start the download
    setTimeout(() => document.body.removeChild(a), 1000);
  };

  const handleBulkDownload = async () => {
    const validUrls = urls.filter((url) => url.trim());
    if (!validUrls.length) {
      toast.error("Please add at least one URL");
      return;
    }

    setDownloading(true);
    setProgress(0);
    setCompletedCount(0);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < validUrls.length; i++) {
      try {
        const shortcode = extractShortcode(validUrls[i]);
        if (!shortcode) {
          toast.error(`URL ${i + 1} is invalid — skipping`);
          failCount++;
          setProgress(((i + 1) / validUrls.length) * 100);
          continue;
        }

        const response = await fetch(`/api/instagram/post/${shortcode}`);

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          console.error(`Post ${shortcode} fetch failed:`, errData);
          toast.error(
            `Post ${i + 1} not found: ${errData?.message || response.statusText}`
          );
          failCount++;
          setProgress(((i + 1) / validUrls.length) * 100);
          continue;
        }

        const data = await response.json();

        // Handle multiple media (carousel)
        const mediaItems: { url: string; type: string }[] =
          data.mediaUrls && data.mediaUrls.length > 0
            ? data.mediaUrls
            : data.downloadUrl
            ? [{ url: data.downloadUrl, type: data.type || "image" }]
            : [];

        if (mediaItems.length === 0) {
          toast.error(`No media found in post ${i + 1}`);
          failCount++;
          setProgress(((i + 1) / validUrls.length) * 100);
          continue;
        }

        for (let j = 0; j < mediaItems.length; j++) {
          const { url: mediaUrl, type } = mediaItems[j];
          const ext = type === "video" ? "mp4" : "jpg";
          const randomNum = Math.floor(100000 + Math.random() * 900000);
          const filename = `reelsdl_${randomNum}.${ext}`;

          const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(
            mediaUrl
          )}&filename=${encodeURIComponent(filename)}`;

          triggerDownload(proxyUrl, filename);

          // Add small gap between multiple files
          if (j < mediaItems.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 600));
          }
        }

        successCount++;
        setCompletedCount(successCount);
        setProgress(((i + 1) / validUrls.length) * 100);

        // Pause between consecutive requests
        if (i < validUrls.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      } catch (err: any) {
        console.error(`URL ${i + 1} download failed:`, err);
        toast.error(`Error with URL ${i + 1}`);
        failCount++;
        setProgress(((i + 1) / validUrls.length) * 100);
      }
    }

    setDownloading(false);

    if (successCount > 0 && failCount === 0) {
      toast.success(
        `${successCount} ${successCount === 1 ? "post" : "posts"} downloaded successfully!`
      );
      setUrls([""]);
    } else if (successCount > 0 && failCount > 0) {
      toast.success(
        `${successCount} downloaded, ${failCount} failed`
      );
      // Remove only successful ones
      const failedUrls = validUrls.filter((url) => {
        const sc = extractShortcode(url);
        return !sc;
      });
      setUrls(failedUrls.length ? failedUrls : [""]);
    } else {
      toast.error("Could not download anything. Please check your URLs.");
    }
  };

  const validUrlCount = urls.filter((u) => u.trim()).length;

  return (
    <div className="group relative rounded-2xl border border-neutral-200 bg-teal-500/30 dark:border-neutral-800 dark:bg-black/80 p-5 shadow-sm transition-all duration-500">
      {/* Bottom shimmer line */}
      <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 transition-all duration-500 group-hover:w-3/5" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 shadow-sm">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-[13px] font-semibold text-neutral-900 dark:text-white leading-tight">
            Bulk Downloader
          </h3>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
            Download multiple video/Posts at once
          </p>
        </div>
        {validUrlCount > 0 && (
          <div className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {validUrlCount} ready
            </span>
          </div>
        )}
      </div>

      {/* URL List */}
      <div className="space-y-2 mb-4 max-h-[280px] overflow-y-auto">
        {urls.map((url, index) => (
          <div key={index} className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder={`instagram.com/p/...`}
                value={url}
                onChange={(e) => updateUrl(index, e.target.value)}
                className="h-9 pl-8 pr-3 text-[13px] rounded-xl border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus-visible:ring-teal-400/30 focus-visible:border-teal-400"
              />
            </div>
            {urls.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeUrlField(index)}
                className="h-9 w-9 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 dark:hover:text-red-400 text-neutral-500 dark:text-neutral-400 transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <Button
          onClick={addUrlField}
          variant="outline"
          size="sm"
          className="h-9 rounded-xl border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-[12px] font-medium px-3 gap-1.5 transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          Add URL
        </Button>

        <Button
          onClick={handlePaste}
          variant="outline"
          size="sm"
          className="h-9 rounded-xl border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-[12px] font-medium px-3 gap-1.5 transition-all"
        >
          {pasted ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <ClipboardPaste className="h-3.5 w-3.5" />
          )}
          Paste
        </Button>
      </div>

      {/* Progress Bar */}
      {downloading && (
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-neutral-500 dark:text-neutral-400">
              {completedCount}/{validUrlCount} complete
            </span>
            <span className="font-medium text-teal-600 dark:text-teal-400">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Download Button */}
      <Button
        onClick={handleBulkDownload}
        disabled={downloading || !validUrlCount}
        size="sm"
        className="h-9 w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-[12px] font-medium gap-1.5 shadow-sm transition-all disabled:opacity-60"
      >
        {downloading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Download className="h-3.5 w-3.5" />
            Download All ({validUrlCount})
          </>
        )}
      </Button>

      {/* Empty State */}
      {!downloading && validUrlCount === 0 && (
        <div className="flex flex-col items-center justify-center pt-4 gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900">
            <Zap className="h-5 w-5 text-neutral-300 dark:text-neutral-600" />
          </div>
          <p className="text-[12px] text-neutral-400 dark:text-neutral-600 text-center max-w-[180px]">
            Add URLs or paste multiple links for bulk download
          </p>
        </div>
      )}
    </div>
  );
}