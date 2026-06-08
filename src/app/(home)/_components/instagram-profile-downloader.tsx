"use client";

import React from "react";
import { Download, Loader2, Search, User, Verified } from "lucide-react";
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
      toast.success("Profile found!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url: string, username: string) => {
    const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(url)}&filename=${username}_profile.jpg`;
    window.open(proxyUrl, "_blank");
    toast.success("Download started!");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleFetchProfile();
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-teal-500/30 p-4 backdrop-blur-xl transition-all duration-300 hover:border-slate-300 hover:shadow-lg dark:border-slate-800/80 dark:bg-black/80 dark:hover:border-slate-700">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-950/30 dark:to-purple-950/30" />
      
      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 p-2 ring-1 ring-blue-200/60 dark:from-blue-900/50 dark:to-purple-900/50 dark:ring-blue-700/60">
            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Profile Picture</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Download HD profile pics</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <User className="absolute left-2.5 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <Input
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-9 rounded-lg border-slate-200/80 bg-white/80 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 backdrop-blur-sm focus:border-blue-400 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-300 dark:placeholder:text-slate-500"
            />
          </div>
          <Button 
            onClick={handleFetchProfile} 
            disabled={loading} 
            size="sm" 
            className="h-9 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-3 text-xs font-medium text-white shadow-md transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Search className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>

        {/* Profile Result */}
        {profile && (
          <div className="animate-in fade-in slide-in-from-bottom-2 rounded-lg border border-slate-200/80 bg-slate-50 p-3 duration-300 dark:border-slate-700/80 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <img 
                  src={profile.profilePicHD} 
                  alt={profile.username} 
                  className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-md dark:border-slate-700" 
                />
                <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5 shadow-md">
                  <Verified className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                  {profile.fullName}
                </h4>
                <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                  @{profile.username}
                </p>
                <div className="mt-1.5 flex gap-3 text-[10px]">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {profile.posts} <span className="font-normal text-slate-500 dark:text-slate-400">Posts</span>
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {profile.followers} <span className="font-normal text-slate-500 dark:text-slate-400">Followers</span>
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {profile.following} <span className="font-normal text-slate-500 dark:text-slate-400">Following</span>
                  </span>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => handleDownload(profile.profilePicHD, profile.username)} 
              size="sm" 
              className="group/btn mt-3 h-8 w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-xs font-medium text-white shadow-md transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover/btn:translate-x-full" />
              <span className="relative flex items-center justify-center gap-1.5">
                <Download className="h-3.5 w-3.5" /> 
                Download HD
              </span>
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!profile && !loading && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-2 rounded-full bg-slate-100 p-2 dark:bg-slate-800">
              <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              Enter username to find profile
            </p>
            <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-600">
              Works with public Instagram accounts
            </p>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-all duration-300 group-hover:w-1/2" />
    </div>
  );
}