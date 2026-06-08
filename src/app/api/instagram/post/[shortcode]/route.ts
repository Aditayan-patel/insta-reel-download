import { NextRequest, NextResponse } from "next/server";
import { IG_GraphQLResponseDto } from "@/features/api/_dto/instagram";
import { getInstagramPostGraphQL } from "./utils";
import { HTTP_CODE_ENUM } from "@/features/api/http-codes";

interface RouteContext {
  params: Promise<{
    shortcode: string;
  }>;
}

export async function GET(_: NextRequest, context: RouteContext) {
  const { shortcode } = await context.params;

  if (!shortcode) {
    return NextResponse.json(
      { error: "noShortcode", message: "shortcode is required" },
      { status: HTTP_CODE_ENUM.BAD_REQUEST }
    );
  }

  try {
    const response = await getInstagramPostGraphQL({ shortcode });
    const status = response.status;

    if (status === HTTP_CODE_ENUM.OK) {
      const jsonData = await response.json();
      const { data } = jsonData as IG_GraphQLResponseDto;
      
      if (!data || !data.xdt_shortcode_media) {
        return NextResponse.json(
          { error: "notFound", message: "post not found" },
          { status: HTTP_CODE_ENUM.NOT_FOUND }
        );
      }

      const media = data.xdt_shortcode_media;

      // Video post
      if (media.is_video && media.video_url) {
        return NextResponse.json({ 
          data,
          downloadUrl: media.video_url,
          type: "video"
        }, { status: HTTP_CODE_ENUM.OK });
      }

      // Image post
      if (media.display_url) {
        return NextResponse.json({ 
          data,
          downloadUrl: media.display_url,
          type: "image"
        }, { status: HTTP_CODE_ENUM.OK });
      }

      return NextResponse.json(
        { error: "notFound", message: "no downloadable media found" },
        { status: HTTP_CODE_ENUM.BAD_REQUEST }
      );
    }

    if (status === HTTP_CODE_ENUM.NOT_FOUND) {
      return NextResponse.json(
        { error: "notFound", message: "post not found" },
        { status: HTTP_CODE_ENUM.NOT_FOUND }
      );
    }

    if (status === HTTP_CODE_ENUM.TOO_MANY_REQUESTS || status === 401) {
      return NextResponse.json(
        { error: "tooManyRequests", message: "too many requests, try again later" },
        { status: HTTP_CODE_ENUM.TOO_MANY_REQUESTS }
      );
    }

    throw new Error(`Unexpected status: ${status}`);
  } catch (error: any) {
    console.error("Instagram API Error:", error);
    return NextResponse.json(
      { error: "serverError", message: error.message || "Internal server error" },
      { status: HTTP_CODE_ENUM.INTERNAL_SERVER_ERROR }
    );
  }
}