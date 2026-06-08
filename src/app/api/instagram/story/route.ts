import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "usernameRequired", message: "Username is required" },
        { status: 400 }
      );
    }

    // Instagram story API call
    const storyResponse = await fetch(
      `https://www.instagram.com/api/v1/feed/reels_media/?reel_ids=${username}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36",
          "X-IG-App-ID": "1217981644879628",
          Cookie: `sessionid=YOUR_SESSION_ID`, // Session cookie needed
        },
      }
    );

    const data = await storyResponse.json();

    if (!data.reels || !data.reels[username]) {
      return NextResponse.json(
        { error: "storyNotFound", message: "No story found" },
        { status: 404 }
      );
    }

    const stories = data.reels[username].items.map((item: any) => ({
      id: item.id,
      url: item.video_versions?.[0]?.url || item.image_versions2?.candidates?.[0]?.url,
      type: item.video_versions ? "video" : "image",
      timestamp: item.taken_at,
    }));

    return NextResponse.json({ success: true, stories }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "serverError", message: error.message },
      { status: 500 }
    );
  }
}