"use client";

import React from "react";
import { Download, Loader2, User, AlertCircle, Play, Image, Search, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function InstagramStoryDownloader() {
  const [username, setUsername] = React.useState("");
  const [stories, setStories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

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
      toast.success(`Found ${data.stories.length} stories!`);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (storyUrl: string, storyId: string, type: string) => {
    const ext = type === "video" ? "mp4" : "jpg";
    const filename = `story_${storyId}.${ext}`;
    
    const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(storyUrl)}&filename=${filename}`;
    window.open(proxyUrl, "_blank");
    toast.success(`Story download started!`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleFetchStories();
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-teal-500/30 p-4 backdrop-blur-xl transition-all duration-300 hover:border-slate-300 hover:shadow-lg dark:border-slate-800/80 dark:bg-black/80 dark:hover:border-slate-700">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-transparent to-purple-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-pink-950/30 dark:to-purple-950/30" />
      
      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 p-2 ring-1 ring-pink-200/60 dark:from-pink-900/50 dark:to-purple-900/50 dark:ring-pink-700/60">
            <Play className="h-4 w-4 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Story Downloader</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Download Instagram stories</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <User className="absolute left-2.5 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <Input
              placeholder="Enter username"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              className="h-9 rounded-lg border-slate-200/80 bg-white/80 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 backdrop-blur-sm focus:border-pink-400 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-300 dark:placeholder:text-slate-500"
            />
          </div>
          <Button
            onClick={handleFetchStories}
            disabled={loading}
            size="sm"
            className="h-9 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 px-3 text-xs font-medium text-white shadow-md hover:from-pink-700 hover:to-purple-700"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-1.5 rounded-lg border border-red-200/80 bg-red-50/80 px-3 py-2 text-xs text-red-600 dark:border-red-800/80 dark:bg-red-950/50 dark:text-red-400">
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stories Grid */}
        {stories.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                {stories.length} {stories.length === 1 ? "Story" : "Stories"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-pink-100 px-1.5 py-0.5 text-[10px] font-medium text-pink-600 dark:bg-pink-900/50 dark:text-pink-400">
                <Clock className="h-2.5 w-2.5" />24h
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {stories.map((story, index) => (
                <div key={story.id} className="group/story relative overflow-hidden rounded-lg border border-slate-200/80 bg-slate-100 dark:border-slate-700/80 dark:bg-slate-800">
                  <div className="absolute left-1 top-1 z-10 rounded bg-black/60 px-1 py-0.5">
                    {story.type === "video" ? <Play className="h-2.5 w-2.5 text-white" /> : <Image className="h-2.5 w-2.5 text-white" />}
                  </div>
                  <div className="relative aspect-[9/16] overflow-hidden">
                    {story.type === "video" ? (
                      <video src={story.url} className="h-full w-full object-cover transition-transform duration-500 group-hover/story:scale-110" muted loop playsInline />
                    ) : (
                      <img src={story.url} alt={`Story ${index + 1}`} className="h-full w-full object-cover transition-transform duration-500 group-hover/story:scale-110" />
                    )}
                  </div>
                  <button
                    onClick={() => handleDownload(story.url, story.id, story.type)}
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-pink-600/80 via-purple-600/50 to-transparent opacity-0 transition-all duration-300 group-hover/story:opacity-100"
                  >
                    <Download className="h-5 w-5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && stories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Play className="mb-2 h-6 w-6 text-slate-300 dark:text-slate-600" />
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Enter username to fetch stories</p>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 transition-all duration-300 group-hover:w-1/2" />
    </div>
  );
}