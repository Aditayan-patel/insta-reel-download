import { NextRequest, NextResponse } from "next/server";
import { getInstagramPostGraphQL } from "./utils";

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
      { status: 400 }
    );
  }

  try {
    const response = await getInstagramPostGraphQL({ shortcode });
    const status = response.status;

    if (status === 200) {
      const jsonData = await response.json();
      const { data } = jsonData;

      console.log("Full API Data keys:", JSON.stringify(Object.keys(data?.xdt_shortcode_media || {})));

      if (!data || !data.xdt_shortcode_media) {
        return NextResponse.json(
          { error: "notFound", message: "post not found" },
          { status: 404 }
        );
      }

      const media = data.xdt_shortcode_media;
      const allMedia: Array<{ url: string; type: string; id: string }> = [];

      // ─── CAROUSEL via carousel_media (newer API) ───────────────────────
      if (media.carousel_media && media.carousel_media.length > 0) {
        console.log("carousel_media items:", media.carousel_media.length);

        media.carousel_media.forEach((item: any, idx: number) => {
          if (item.video_versions && item.video_versions.length > 0) {
            allMedia.push({
              url: item.video_versions[0].url,
              type: "video",
              id: item.id || `carousel_${idx}`,
            });
          } else if (item.image_versions2?.candidates?.length > 0) {
            allMedia.push({
              url: item.image_versions2.candidates[0].url,
              type: "image",
              id: item.id || `carousel_${idx}`,
            });
          }
        });
      }

      // ─── CAROUSEL via edge_sidecar_to_children (older/web GraphQL API) ─
      else if (
        media.edge_sidecar_to_children?.edges &&
        media.edge_sidecar_to_children.edges.length > 0
      ) {
        console.log(
          "edge_sidecar_to_children items:",
          media.edge_sidecar_to_children.edges.length
        );

        media.edge_sidecar_to_children.edges.forEach((edge: any, idx: number) => {
          const node = edge.node;
          if (!node) return;

          if (node.is_video && node.video_url) {
            allMedia.push({
              url: node.video_url,
              type: "video",
              id: node.id || `sidecar_${idx}`,
            });
          } else if (node.display_url) {
            // Prefer highest-res from display_resources if available
            const bestRes =
              node.display_resources?.length > 0
                ? node.display_resources[node.display_resources.length - 1].src
                : node.display_url;

            allMedia.push({
              url: bestRes,
              type: "image",
              id: node.id || `sidecar_${idx}`,
            });
          }
        });
      }

      // ─── SINGLE VIDEO ──────────────────────────────────────────────────
      else if (media.is_video) {
        const videoUrl = media.video_url || media.video_versions?.[0]?.url;
        if (videoUrl) {
          allMedia.push({
            url: videoUrl,
            type: "video",
            id: media.id || shortcode,
          });
        }
      }

      // ─── SINGLE IMAGE ──────────────────────────────────────────────────
      else if (media.display_url) {
        const bestRes =
          media.display_resources?.length > 0
            ? media.display_resources[media.display_resources.length - 1].src
            : media.display_url;

        allMedia.push({
          url: bestRes,
          type: "image",
          id: media.id || shortcode,
        });
      }

      // ─── FALLBACK: thumbnail only ──────────────────────────────────────
      if (allMedia.length === 0 && media.thumbnail_src) {
        allMedia.push({
          url: media.thumbnail_src,
          type: "image",
          id: "thumbnail",
        });
      }

      console.log("Total media found:", allMedia.length);

      if (allMedia.length > 0) {
        return NextResponse.json(
          {
            success: true,
            mediaUrls: allMedia,
            totalCount: allMedia.length,
            downloadUrl: allMedia[0].url,
            type: allMedia[0].type,
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: "noMedia", message: "no downloadable media found" },
        { status: 400 }
      );
    }

    if (status === 404) {
      return NextResponse.json(
        { error: "notFound", message: "post not found" },
        { status: 404 }
      );
    }

    if (status === 429 || status === 401) {
      return NextResponse.json(
        {
          error: "tooManyRequests",
          message: "too many requests, try again later",
        },
        { status: 429 }
      );
    }

    throw new Error(`Unexpected status: ${status}`);
  } catch (error: any) {
    console.error("Instagram API Error:", error);
    return NextResponse.json(
      {
        error: "serverError",
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}