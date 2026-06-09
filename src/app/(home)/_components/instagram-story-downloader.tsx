"use client";

import React from "react";
import Image from "next/image";
import {
  Download,
  Loader2,
  User,
  AlertCircle,
  Play,
  Image as ImageIcon,
  Search,
  Clock,
  ClipboardPaste,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function InstagramStoryDownloader() {
  const [username, setUsername] = React.useState("");
  const [stories, setStories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [pasted, setPasted] = React.useState(false);

  const handleFetchStories = async () => {
    if (!username) {
      setError("Please enter Instagram username");
      return;
    }

    setLoading(true);
    setError("");
    setStories([]);

    try {
      const response = await fetch("/api/instagram/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.replace("@", "").trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch stories");
      }

      setStories(data.stories);
      toast.success(`Found ${data.stories.length} stories!`, {
        icon: "✅",
        duration: 2000,
      });
      setUsername("");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message, {
        icon: "❌",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const cleaned = text.replace("@", "").trim();
      setUsername(cleaned);
      setError("");
      setPasted(true);
      setTimeout(() => setPasted(false), 1800);
      toast.success("Username pasted!", {
        icon: "📋",
        duration: 1500,
      });
    } catch {
      toast.error("Clipboard access denied", {
        icon: "❌",
      });
    }
  };

  const handleDownload = (storyUrl: string, storyId: string, type: string) => {
    const ext = type === "video" ? "mp4" : "jpg";
    const filename = `story_${storyId}.${ext}`;
    const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(storyUrl)}&filename=${filename}`;
    window.open(proxyUrl, "_blank");
    toast.success(`Story download started!`, {
      icon: "⬇️",
      duration: 2000,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleFetchStories();
  };

  return (
    <div className="group relative rounded-2xl border border-neutral-200 bg-teal-500/30 dark:border-neutral-800 dark:bg-black/80 p-5 shadow-sm transition-all duration-500">
      {/* Bottom shimmer line */}
      <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 transition-all duration-500 group-hover:w-3/5" />

      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-sm">
            <Play className="h-4 w-4 fill-white text-white" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-neutral-900 dark:text-white leading-tight">
              Story Downloader
            </h3>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
              Download Instagram stories instantly
            </p>
          </div>
          {stories.length > 0 && (
            <div className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1">
              <CheckCheck className="h-3 w-3 text-emerald-500" />
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                {stories.length} found
              </span>
            </div>
          )}
        </div>

        {/* Input Row */}
        <div className="flex gap-2">
          {/* Username input */}
          <div className="relative flex-1">
            <User className="absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <Input
              placeholder="instagram username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              aria-label="Instagram username"
              className="h-9 pl-8 pr-3 text-[13px] rounded-xl border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus-visible:ring-pink-400/30 focus-visible:border-pink-400"
            />
          </div>

          {/* Paste button */}
          <Button
            onClick={handlePaste}
            variant="outline"
            size="sm"
            aria-label="Paste username from clipboard"
            className="h-9 rounded-xl border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-[12px] font-medium px-3 gap-1.5 transition-all"
          >
            {pasted ? (
              <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <ClipboardPaste className="h-3.5 w-3.5" />
            )}
            Paste
          </Button>

          {/* Search button */}
          <Button
            onClick={handleFetchStories}
            disabled={loading}
            size="sm"
            aria-label="Fetch stories"
            className="h-9 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-[12px] font-medium px-4 gap-1.5 shadow-sm transition-all disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Search className="h-3.5 w-3.5" />
            )}
            {loading ? "Fetching..." : "Fetch"}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-3 py-2 text-[12px] text-red-600 dark:text-red-400">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stories Grid */}
        {!loading && stories.length > 0 && (
          <div className="space-y-3">
            <div className="border-t border-neutral-100 dark:border-neutral-800" />
            
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                {stories.length} {stories.length === 1 ? "Story" : "Stories"} available
              </span>
              <div className="flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5">
                <Clock className="h-2.5 w-2.5 text-neutral-400 dark:text-neutral-500" />
                <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400">24h</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 max-h-[380px] overflow-y-auto pr-0.5">
              {stories.map((story, index) => (
                <div
                  key={story.id}
                  className="group/card relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 cursor-pointer"
                  onClick={() => handleDownload(story.url, story.id, story.type)}
                >
                  {/* Type badge */}
                  <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-1 rounded-md bg-black/50 backdrop-blur-sm px-1.5 py-0.5">
                    {story.type === "video" ? (
                      <Play className="h-2.5 w-2.5 fill-white text-white" />
                    ) : (
                      <ImageIcon className="h-2.5 w-2.5 text-white" />
                    )}
                    <span className="text-[10px] font-medium text-white/90">
                      {index + 1}
                    </span>
                  </div>

                  {/* Media */}
                  <div className="aspect-[9/16] overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                    {story.type === "video" ? (
                      <video
                        src={story.url}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                        muted
                        loop
                        playsInline
                        aria-label={`Story video ${index + 1}`}
                      />
                    ) : (
                      <div className="relative h-full w-full">
                        <Image
                          src={`/api/download-proxy?url=${encodeURIComponent(story.url)}&filename=preview.jpg`}
                          alt={`Story ${index + 1} from ${username}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                          sizes="(max-width: 768px) 33vw, 200px"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.classList.add('bg-gradient-to-br', 'from-pink-100', 'to-purple-100', 'dark:from-pink-950/30', 'dark:to-purple-950/30');
                            }
                          }}
                        />
                        {/* Fallback for failed images */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-950/30 dark:to-purple-950/30 opacity-0 group-hover/card:opacity-100 transition-opacity">
                          <ImageIcon className="h-8 w-8 text-pink-400 dark:text-pink-600" />
                        </div>
                      </div>
                    )}
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
        {!loading && !error && stories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-7 gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900">
              <Play className="h-5 w-5 text-neutral-300 dark:text-neutral-600" />
            </div>
            <p className="text-[12px] text-neutral-400 dark:text-neutral-600 text-center max-w-[160px]">
              Enter a username to fetch active stories
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-7 gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-50 dark:bg-pink-950/30">
              <Loader2 className="h-5 w-5 text-pink-400 animate-spin" />
            </div>
            <p className="text-[12px] text-neutral-400 dark:text-neutral-600">
              Fetching stories...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}