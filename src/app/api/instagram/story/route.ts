// app/api/instagram/story/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, url } = await request.json();

    if (url) {
      return await handleDirectUrl(url);
    }

    if (!username) {
      return NextResponse.json(
        { error: "usernameRequired", message: "Username or URL is required" },
        { status: 400 }
      );
    }

    return await handleUsername(username);
  } catch (error: any) {
    return NextResponse.json(
      { error: "serverError", message: error.message },
      { status: 500 }
    );
  }
}

async function handleDirectUrl(storyUrl: string) {
  // Extract username and story ID from URL
  const match = storyUrl.match(/stories\/([^\/]+)\/(\d+)/);
  if (!match) {
    return NextResponse.json(
      { error: "invalidUrl", message: "Invalid Instagram story URL format" },
      { status: 400 }
    );
  }

  const [, username, storyId] = match;

  // Try multiple working services in order
  const services = [
    () => tryRapidApiInstagram(storyUrl),
    () => tryInstaDownloader(username, storyId),
    () => trySaveIG(storyUrl),
  ];

  for (const service of services) {
    try {
      const result = await service();
      if (result) return result;
    } catch  {
      continue;
    }
  }

  return NextResponse.json(
    {
      error: "fetchFailed",
      message: "Could not fetch story. Instagram blocks direct access — try using RapidAPI key.",
    },
    { status: 404 }
  );
}

// METHOD 1: RapidAPI Instagram Story Downloader (most reliable, needs API key)
async function tryRapidApiInstagram(storyUrl: string) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) return null;

  const response = await fetch(
    `https://instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com/get-media?url=${encodeURIComponent(storyUrl)}`,
    {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host":
          "instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com",
      },
    }
  );

  if (!response.ok) return null;
  const data = await response.json();

  if (data.media) {
    return NextResponse.json({
      success: true,
      stories: [
        {
          id: Date.now().toString(),
          url: data.media,
          type: data.type === "video" ? "video" : "image",
          username: data.username || "",
        },
      ],
    });
  }
  return null;
}

// METHOD 2: insta-downloader API (free, no key needed)
async function tryInstaDownloader(username: string, storyId: string) {
  const response = await fetch(
    `https://insta-downloader.app/api/story?username=${username}&story_id=${storyId}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://insta-downloader.app/",
      },
      signal: AbortSignal.timeout(8000),
    }
  );

  if (!response.ok) return null;
  const data = await response.json();
  if (!data?.url) return null;

  return NextResponse.json({
    success: true,
    stories: [
      {
        id: storyId,
        url: data.url,
        type: data.type || "image",
        username,
      },
    ],
  });
}

// METHOD 3: SaveIG scraper approach
async function trySaveIG(storyUrl: string) {
  // POST to saveig with the URL
  const formData = new URLSearchParams();
  formData.append("url", storyUrl);

  const response = await fetch("https://saveig.app/api/ajaxSearch", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Referer: "https://saveig.app/",
      Origin: "https://saveig.app",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: formData.toString(),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) return null;
  const data = await response.json();

  if (data.status === "ok" && data.data?.length > 0) {
    const stories = data.data.map((item: any, idx: number) => ({
      id: `story_${idx}`,
      url: item.url,
      type: item.type === "mp4" || item.type === "video" ? "video" : "image",
      thumbnail: item.thumbnail || null,
    }));

    return NextResponse.json({ success: true, stories });
  }
  return null;
}

// Username handler using SaveIG
async function handleUsername(username: string) {
  const cleanUsername = username.replace("@", "").trim().toLowerCase();

  // Try SaveIG for username-based story fetch
  const profileUrl = `https://www.instagram.com/${cleanUsername}/`;

  const formData = new URLSearchParams();
  formData.append("url", profileUrl);

  try {
    const response = await fetch("https://saveig.app/api/ajaxSearch", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://saveig.app/",
        Origin: "https://saveig.app",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: formData.toString(),
      signal: AbortSignal.timeout(10000),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === "ok" && data.data?.length > 0) {
        const stories = data.data.map((item: any, idx: number) => ({
          id: `story_${idx}_${Date.now()}`,
          url: item.url,
          type:
            item.type === "mp4" || item.type === "video" ? "video" : "image",
          thumbnail: item.thumbnail || null,
          taken_at: item.taken_at || null,
        }));
        return NextResponse.json({ success: true, stories });
      }
    }
  } catch {
    // fall through
  }

  return NextResponse.json(
    {
      error: "noStories",
      message:
        "No active stories found. Username-based fetch requires the story URL — please use 'By Story URL' mode instead.",
    },
    { status: 404 }
  );
}