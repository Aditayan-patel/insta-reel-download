"use client";

import React from "react";
import { Plus, Download, Loader2, Trash2, Zap, Link2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function InstagramBulkDownloader() {
  const [urls, setUrls] = React.useState<string[]>([""]);
  const [downloading, setDownloading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [completedCount, setCompletedCount] = React.useState(0);

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
    const match = url.match(/\/(?:p|reel|tv|reels)\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const handleBulkDownload = async () => {
    const validUrls = urls.filter(url => url.trim());
    if (!validUrls.length) { toast.error("Please add at least one URL"); return; }

    setDownloading(true);
    setProgress(0);
    setCompletedCount(0);

    for (let i = 0; i < validUrls.length; i++) {
      try {
        const shortcode = extractShortcode(validUrls[i]);
        if (!shortcode) continue;
        const response = await fetch(`/api/instagram/post/${shortcode}`);
        const data = await response.json();
        if (data.data?.xdt_shortcode_media?.video_url) {
          const videoUrl = data.data.xdt_shortcode_media.video_url;
          const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(videoUrl)}&filename=instagram_${shortcode}.mp4`;
          window.open(proxyUrl, "_blank");
          setCompletedCount(prev => prev + 1);
        }
        setProgress(((i + 1) / validUrls.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (err) { console.error(`Failed URL ${i + 1}`); }
    }
    setDownloading(false);
    toast.success(`Downloaded ${completedCount} files!`);
  };

  const validUrlCount = urls.filter(u => u.trim()).length;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white/90 p-4 backdrop-blur-xl transition-all duration-300 hover:border-slate-300 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900/90 dark:hover:border-slate-700">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 via-transparent to-emerald-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-teal-950/30 dark:to-emerald-950/30" />
      
      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-gradient-to-br from-teal-100 to-emerald-100 p-2 ring-1 ring-teal-200/60 dark:from-teal-900/50 dark:to-emerald-900/50 dark:ring-teal-700/60">
              <Zap className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Bulk Downloader</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Multiple videos at once</p>
            </div>
          </div>
          <Button onClick={addUrlField} variant="outline" size="sm" className="h-7 rounded-lg border-slate-200/80 text-[10px]">
            <Plus className="mr-1 h-3 w-3" /> Add
          </Button>
        </div>

        {/* URL List */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {urls.map((url, index) => (
            <div key={index} className="flex gap-1.5">
              <div className="relative flex-1">
                <Link2 className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder={`URL ${index + 1}`}
                  value={url}
                  onChange={(e) => updateUrl(index, e.target.value)}
                  className="h-8 rounded-lg border-slate-200/80 bg-white/80 pl-7 pr-3 text-[11px] dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-300"
                />
              </div>
              {urls.length > 1 && (
                <Button variant="ghost" size="icon" onClick={() => removeUrlField(index)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Progress */}
        {downloading && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500">{completedCount}/{validUrlCount} done</span>
              <span className="text-teal-600">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Download Button */}
        <Button onClick={handleBulkDownload} disabled={downloading || !validUrlCount} size="sm" className="w-full h-9 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 text-xs font-medium text-white shadow-md hover:from-teal-700 hover:to-emerald-700">
          {downloading ? (
            <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Downloading...</>
          ) : (
            <><Download className="mr-1.5 h-3.5 w-3.5" /> Download{validUrlCount > 0 ? ` (${validUrlCount})` : ''}</>
          )}
        </Button>

        {/* Quick Tip */}
        {!downloading && validUrlCount === 0 && (
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
            <Sparkles className="h-3 w-3" /> Paste URLs to bulk download <Sparkles className="h-3 w-3" />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 transition-all duration-300 group-hover:w-1/2" />
    </div>
  );
}