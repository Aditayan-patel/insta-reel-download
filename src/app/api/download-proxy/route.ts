import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileUrl = searchParams.get("url");
  const filename = searchParams.get("filename") || "reelsdl_media.mp4";

  if (!fileUrl) {
    return NextResponse.json(
      { error: "missingUrl", message: "url is required" },
      { status: 400 }
    );
  }

  if (!fileUrl.startsWith("https://")) {
    return NextResponse.json(
      { error: "invalidUrl", message: "Only HTTPS URLs are allowed" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(fileUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Referer: "https://www.instagram.com/",
        Origin: "https://www.instagram.com",
        Accept: "video/mp4,video/*;q=0.9,image/webp,image/*;q=0.8,*/*;q=0.5",
        "Accept-Language": "en-US,en;q=0.9",
        "Sec-Fetch-Dest": fileUrl.endsWith(".mp4") ? "video" : "image",
        "Sec-Fetch-Mode": "no-cors",
        "Sec-Fetch-Site": "cross-site",
        Connection: "keep-alive",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      console.error(
        `Upstream fetch failed: ${response.status} ${response.statusText} for URL: ${fileUrl}`
      );
      return NextResponse.json(
        {
          error: "upstreamError",
          message: `Failed to fetch media: ${response.status} ${response.statusText}`,
        },
        { status: response.status === 403 ? 403 : 502 }
      );
    }

    const contentType =
      response.headers.get("Content-Type") ||
      (filename.endsWith(".mp4") ? "video/mp4" : "image/jpeg");

    const contentLength = response.headers.get("Content-Length");

    const stream = response.body;
    if (!stream) {
      throw new Error("Empty response body from upstream");
    }

    const headers = new Headers();
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);
    headers.set("Content-Type", contentType);

    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    headers.set("Cache-Control", "public, max-age=3600");
    headers.set("Access-Control-Allow-Origin", "*");

    return new NextResponse(stream, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("Download proxy error:", error);
    return NextResponse.json(
      {
        error: "serverError",
        message: error?.message || "Unknown server error",
      },
      { status: 500 }
    );
  }
}