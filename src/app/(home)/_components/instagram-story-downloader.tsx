"use client";

import React, { useState } from "react";
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
  Info,
  LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Story {
  id: string;
  url: string;
  type: "image" | "video";
  thumbnail?: string;
  taken_at?: number;
}

export function InstagramStoryDownloader() {
  const [inputMode, setInputMode] = useState<"username" | "url">("username");
  const [username, setUsername] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pasted, setPasted] = useState(false);
  const [urlPasted, setUrlPasted] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState<string | null>(null);

  // Fetch stories by username
  const handleFetchStories = async () => {
    if (!username.trim()) {
      setError("Please enter Instagram username");
      toast.error("Username is required", { icon: "⚠️" });
      return;
    }

    setLoading(true);
    setError("");
    setStories([]);

    const cleanUsername = username.replace("@", "").trim().toLowerCase();
    
    const loadingToast = toast.loading(`Fetching stories from @${cleanUsername}...`);

    try {
      const response = await fetch("/api/instagram/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleanUsername }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch stories");
      }

      if (data.stories && data.stories.length > 0) {
        setStories(data.stories);
        toast.success(`Found ${data.stories.length} stories from @${cleanUsername}!`, {
          icon: "🎉",
          duration: 3000,
        });
        setUsername("");
      } else {
        throw new Error("No active stories found for this account");
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch stories";
      setError(errorMessage);
      toast.error(errorMessage, {
        icon: "❌",
        duration: 4000,
      });
      
      if (errorMessage.includes("No active stories")) {
        toast.info("Tip: Try a popular account like 'instagram' or 'zuck'", {
          icon: "💡",
          duration: 5000,
        });
      }
    } finally {
      toast.dismiss(loadingToast);
      setLoading(false);
    }
  };

  // Fetch story by direct URL
  const handleFetchFromUrl = async () => {
    if (!urlInput.trim()) {
      setError("Please paste Instagram story URL");
      toast.error("Story URL is required", { icon: "⚠️" });
      return;
    }

    setLoading(true);
    setError("");
    setStories([]);

    const loadingToast = toast.loading(`Fetching story from URL...`);

    try {
      const response = await fetch("/api/instagram/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch story");
      }

      if (data.stories && data.stories.length > 0) {
        setStories(data.stories);
        toast.success(`Story fetched successfully!`, {
          icon: "🎉",
          duration: 3000,
        });
        setUrlInput("");
      } else {
        throw new Error("Could not fetch story from this URL");
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch story";
      setError(errorMessage);
      toast.error(errorMessage, {
        icon: "❌",
        duration: 4000,
      });
      
      toast.info("Tip: Make sure the story is still active (within 24 hours)", {
        icon: "💡",
        duration: 5000,
      });
    } finally {
      toast.dismiss(loadingToast);
      setLoading(false);
    }
  };

  const handlePasteUsername = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const cleaned = text.replace("@", "").trim();
      if (cleaned) {
        setUsername(cleaned);
        setError("");
        setPasted(true);
        setTimeout(() => setPasted(false), 1800);
        toast.success(`Username "${cleaned}" pasted!`, {
          icon: "📋",
          duration: 1500,
        });
      } else {
        toast.error("Clipboard is empty", { icon: "📭" });
      }
    } catch {
      toast.error("Unable to access clipboard. Please paste manually.", {
        icon: "🔒",
      });
    }
  };

  const handlePasteUrl = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.includes("instagram.com/stories/")) {
        setUrlInput(text.trim());
        setError("");
        setUrlPasted(true);
        setTimeout(() => setUrlPasted(false), 1800);
        toast.success(`URL pasted!`, {
          icon: "📋",
          duration: 1500,
        });
      } else {
        toast.error("No Instagram story URL found in clipboard", {
          icon: "❌",
        });
      }
    } catch {
      toast.error("Unable to access clipboard. Please paste manually.", {
        icon: "🔒",
      });
    }
  };

  const handleDownload = async (storyUrl: string, storyId: string, type: string) => {
    setDownloadLoading(storyId);
    
    try {
      const ext = type === "video" ? "mp4" : "jpg";
      const filename = `instagram_story_${storyId}_${Date.now()}.${ext}`;
      
      const response = await fetch(storyUrl);
      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
        
        toast.success("Download started!", {
          icon: "⬇️",
          duration: 2000,
        });
      } else {
        throw new Error("Failed to download");
      }
    } catch {
      window.open(storyUrl, "_blank");
      toast.info("Media opened in new tab. Right-click to save.", {
        icon: "📎",
        duration: 3000,
      });
    } finally {
      setDownloadLoading(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      if (inputMode === "username") {
        handleFetchStories();
      } else {
        handleFetchFromUrl();
      }
    }
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "";
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return `${Math.floor(diffHours * 60)} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  return (
    <div className="group relative rounded-2xl border border-neutral-200 bg-gradient-to-br from-white via-teal-50/30 to-purple-50/30 dark:from-neutral-900 dark:via-teal-950/20 dark:to-purple-950/20 p-5 shadow-sm transition-all duration-500 hover:shadow-md">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
      
      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg animate-pulse">
            <Play className="h-4 w-4 fill-white text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white leading-tight">
              Instagram Story Saver
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Download stories anonymously
            </p>
          </div>
          {stories.length > 0 && (
            <div className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 animate-in slide-in-left">
              <CheckCheck className="h-3 w-3 text-emerald-500" />
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                {stories.length} story{stories.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex gap-2">
          <Button
            variant={inputMode === "username" ? "default" : "outline"}
            onClick={() => {
              setInputMode("username");
              setError("");
            }}
            size="sm"
            className={`flex-1 h-9 text-[12px] ${
              inputMode === "username" 
                ? "bg-gradient-to-r from-pink-500 to-purple-600" 
                : "border-neutral-200 dark:border-neutral-700"
            }`}
          >
            <User className="h-3.5 w-3.5 mr-1.5" />
            By Username
          </Button>
          <Button
            variant={inputMode === "url" ? "default" : "outline"}
            onClick={() => {
              setInputMode("url");
              setError("");
            }}
            size="sm"
            className={`flex-1 h-9 text-[12px] ${
              inputMode === "url" 
                ? "bg-gradient-to-r from-pink-500 to-purple-600" 
                : "border-neutral-200 dark:border-neutral-700"
            }`}
          >
            <LinkIcon className="h-3.5 w-3.5 mr-1.5" />
            By Story URL
          </Button>
        </div>

        {/* Info Banner */}
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 px-3 py-2">
          <div className="flex items-start gap-2">
            <Info className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-[11px] text-blue-600 dark:text-blue-400">
              {inputMode === "username" ? (
                <>
                  <p>Works for public Instagram accounts with active stories (last 24 hours)</p>
                  <p className="text-[10px] mt-0.5">Try: instagram, zuck, natgeo for testing</p>
                </>
              ) : (
                <>
                  <p>Paste any Instagram story URL to download the media directly</p>
                  <p className="text-[10px] mt-0.5">Example: instagram.com/stories/username/123456789/</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Input Row - Conditional based on mode */}
        {inputMode === "username" ? (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <User className="absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Enter Instagram username (e.g., instagram)"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                disabled={loading}
                aria-label="Instagram username"
                className="h-10 pl-8 pr-3 text-[13px] rounded-xl border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus-visible:ring-pink-400/30 focus-visible:border-pink-400 transition-all"
              />
            </div>

            <Button
              onClick={handlePasteUsername}
              variant="outline"
              size="sm"
              disabled={loading}
              className="h-10 rounded-xl border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 text-[12px] font-medium px-3 gap-1.5 transition-all"
            >
              {pasted ? (
                <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <ClipboardPaste className="h-3.5 w-3.5" />
              )}
              Paste
            </Button>

            <Button
              onClick={handleFetchStories}
              disabled={loading || !username.trim()}
              size="sm"
              className="h-10 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-[12px] font-medium px-4 gap-1.5 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Search className="h-3.5 w-3.5" />
              )}
              {loading ? "Fetching..." : "Fetch Stories"}
            </Button>
          </div>
        ) : (
          // URL Input Mode
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Paste Instagram story URL..."
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                disabled={loading}
                aria-label="Instagram story URL"
                className="h-10 pl-8 pr-3 text-[13px] rounded-xl border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus-visible:ring-pink-400/30 focus-visible:border-pink-400 transition-all"
              />
            </div>

            <Button
              onClick={handlePasteUrl}
              variant="outline"
              size="sm"
              disabled={loading}
              className="h-10 rounded-xl border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 text-[12px] font-medium px-3 gap-1.5 transition-all"
            >
              {urlPasted ? (
                <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <ClipboardPaste className="h-3.5 w-3.5" />
              )}
              Paste
            </Button>

            <Button
              onClick={handleFetchFromUrl}
              disabled={loading || !urlInput.trim()}
              size="sm"
              className="h-10 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-[12px] font-medium px-4 gap-1.5 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              {loading ? "Fetching..." : "Get Story"}
            </Button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-3 py-2.5 text-[12px] text-red-600 dark:text-red-400 animate-in slide-in-from-top-2">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Stories Grid */}
        {!loading && stories.length > 0 && (
          <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-300">
            <div className="border-t border-neutral-200 dark:border-neutral-800" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                  📸 {stories.length} {stories.length === 1 ? "Story" : "Stories"} available
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-1">
                <Clock className="h-2.5 w-2.5 text-neutral-500 dark:text-neutral-400" />
                <span className="text-[10px] font-medium text-neutral-600 dark:text-neutral-400">Expires in 24h</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
              {stories.map((story, index) => (
                <div
                  key={story.id}
                  className="group/card relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  onClick={() => handleDownload(story.url, story.id, story.type)}
                >
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-sm px-1.5 py-0.5">
                    {story.type === "video" ? (
                      <Play className="h-2.5 w-2.5 fill-white text-white" />
                    ) : (
                      <ImageIcon className="h-2.5 w-2.5 text-white" />
                    )}
                    <span className="text-[9px] font-semibold text-white">
                      #{index + 1}
                    </span>
                  </div>

                  {story.taken_at && (
                    <div className="absolute bottom-2 left-2 z-10 rounded-md bg-black/50 backdrop-blur-sm px-1.5 py-0.5">
                      <span className="text-[8px] text-white/90">{formatTime(story.taken_at)}</span>
                    </div>
                  )}

                  <div className="aspect-[9/16] overflow-hidden bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900">
                    {story.type === "video" ? (
                      <video
                        src={story.url}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                        muted
                        preload="metadata"
                        aria-label={`Story video ${index + 1}`}
                      />
                    ) : (
                      <div className="relative h-full w-full">
                        <Image
                          src={story.thumbnail || story.url}
                          alt={`Instagram story ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 200px"
                          loading="lazy"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src = "/placeholder-image.jpg";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transform transition-transform duration-200 group-hover/card:scale-110">
                        {downloadLoading === story.id ? (
                          <Loader2 className="h-4 w-4 text-neutral-700 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 text-neutral-700" />
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-white bg-black/50 px-2 py-0.5 rounded-full">
                        {downloadLoading === story.id ? "Downloading..." : "Tap to Save"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {stories.length > 1 && (
              <Button
                onClick={() => {
                  stories.forEach((story, idx) => {
                    setTimeout(() => {
                      handleDownload(story.url, story.id, story.type);
                    }, idx * 500);
                  });
                }}
                variant="outline"
                className="w-full mt-2 border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/30"
              >
                <Download className="h-3.5 w-3.5 mr-2" />
                Download All ({stories.length} stories)
              </Button>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && stories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 gap-3 animate-in fade-in duration-500">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-950/30 dark:to-purple-950/30">
              <Play className="h-6 w-6 text-pink-400 dark:text-pink-500" />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-medium text-neutral-700 dark:text-neutral-300">
                {inputMode === "username" ? "Ready to download stories" : "Paste a story URL to get started"}
              </p>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">
                {inputMode === "username" 
                  ? "Enter any public Instagram username" 
                  : "Direct URL from Instagram stories page"}
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-8 gap-3 animate-in fade-in duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg">
              <Loader2 className="h-5 w-5 text-white animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-medium text-neutral-700 dark:text-neutral-300">
                {inputMode === "username" ? "Fetching stories..." : "Processing URL..."}
              </p>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">
                This may take a few seconds
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
        @keyframes slide-in-left {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-in {
          animation: slide-in-left 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}