import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "usernameRequired", message: "Username is required" },
      { status: 400 }
    );
  }

  try {
    // Instagram profile API
    const response = await fetch(
      `https://www.instagram.com/${username}/?__a=1&__d=1`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "profileNotFound", message: "Profile not found" },
        { status: 404 }
      );
    }

    const data = await response.json();
    const user = data.graphql?.user;

    if (!user) {
      return NextResponse.json(
        { error: "profileNotFound", message: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: {
        username: user.username,
        fullName: user.full_name,
        profilePicHD: user.profile_pic_url_hd,
        profilePic: user.profile_pic_url,
        followers: user.edge_followed_by?.count,
        following: user.edge_follow?.count,
        posts: user.edge_owner_to_timeline_media?.count,
        isPrivate: user.is_private,
        biography: user.biography,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "serverError", message: error.message },
      { status: 500 }
    );
  }
}