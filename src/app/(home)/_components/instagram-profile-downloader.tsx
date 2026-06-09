"use client";

import React from "react";
import Image from "next/image";
import { Download, Loader2, Search, User, Verified, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function InstagramProfileDownloader() {
  const [username, setUsername] = React.useState("");
  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const handleFetchProfile = async () => {
    if (!username) {
      toast.error("Please enter username");
      return;
    }

    setLoading(true);
    setProfile(null);

    try {
      const cleanUsername = username.replace("@", "").trim();
      const response = await fetch(`/api/instagram/profile-pic?username=${cleanUsername}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);
      
      setProfile(data.profile);
      toast.success("Profile found!", {
        icon: "✅",
        duration: 2000,
      });
      setUsername("");
    } catch (err: any) {
      toast.error(err.message, {
        icon: "❌",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url: string, username: string) => {
    const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(url)}&filename=${username}_profile.jpg`;
    window.open(proxyUrl, "_blank");
    toast.success("Download started!", {
      icon: "⬇️",
      duration: 2000,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleFetchProfile();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const cleaned = text.replace("@", "").trim();
      if (cleaned) {
        setUsername(cleaned);
        toast.success("Username pasted!", {
          icon: "📋",
          duration: 1500,
        });
      } else {
        toast.error("No valid username in clipboard", {
          icon: "❌",
        });
      }
    } catch {
      toast.error("Clipboard access denied", {
        icon: "❌",
      });
    }
  };

  return (
    <div className="group relative rounded-2xl border border-neutral-200 bg-teal-500/30 dark:border-neutral-800 dark:bg-black/80 p-5 shadow-sm transition-all duration-500">
      {/* Bottom shimmer line */}
      <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 transition-all duration-500 group-hover:w-3/5" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm">
          <User className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-[13px] font-semibold text-neutral-900 dark:text-white leading-tight">
            Profile Picture
          </h3>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
            Download HD profile pictures
          </p>
        </div>
        {profile && (
          <div className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              Found
            </span>
          </div>
        )}
      </div>

      {/* Input Row */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <User className="absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="instagram username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Instagram username"
            className="h-9 pl-8 pr-3 text-[13px] rounded-xl border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus-visible:ring-blue-400/30 focus-visible:border-blue-400"
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
          Paste
        </Button>

        {/* Search button */}
        <Button
          onClick={handleFetchProfile}
          disabled={loading}
          size="sm"
          aria-label="Fetch profile"
          className="h-9 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-[12px] font-medium px-4 gap-1.5 shadow-sm transition-all disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Search className="h-3.5 w-3.5" />
          )}
          {loading ? "Fetching..." : "Fetch"}
        </Button>
      </div>

      {/* Profile Result */}
      {profile && (
        <div className="space-y-3">
          <div className="border-t border-neutral-100 dark:border-neutral-800" />
          
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-4">
            <div className="flex items-center gap-4">
              {/* Profile Picture - Fixed with Next.js Image */}
              <div className="relative flex-shrink-0">
                <div className="relative h-16 w-16 rounded-full border-2 border-white shadow-md dark:border-neutral-700 overflow-hidden">
                  <Image 
                    src={profile.profilePicHD} 
                    alt={`${profile.username}'s profile picture`}
                    fill
                    className="object-cover"
                    sizes="64px"
                    priority={false}
                  />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5 shadow-md">
                  <Verified className="h-3 w-3 text-white" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
                  {profile.fullName}
                </h4>
                <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                  @{profile.username}
                </p>
                <div className="mt-2 flex gap-3 text-[10px]">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                    {profile.posts?.toLocaleString() || 0} <span className="font-normal text-neutral-500 dark:text-neutral-400">posts</span>
                  </span>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                    {profile.followers?.toLocaleString() || 0} <span className="font-normal text-neutral-500 dark:text-neutral-400">followers</span>
                  </span>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                    {profile.following?.toLocaleString() || 0} <span className="font-normal text-neutral-500 dark:text-neutral-400">following</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <Button 
              onClick={() => handleDownload(profile.profilePicHD, profile.username)} 
              size="sm"
              aria-label="Download HD profile picture"
              className="mt-4 h-9 w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-[12px] font-medium gap-2 shadow-sm transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              Download HD Profile Picture
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!profile && !loading && (
        <div className="flex flex-col items-center justify-center py-7 gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900">
            <User className="h-5 w-5 text-neutral-300 dark:text-neutral-600" />
          </div>
          <p className="text-[12px] text-neutral-400 dark:text-neutral-600 text-center max-w-[160px]">
            Enter username to find profile
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-7 gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/30">
            <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
          </div>
          <p className="text-[12px] text-neutral-400 dark:text-neutral-600">
            Fetching profile...
          </p>
        </div>
      )}
    </div>
  );
}