// Existing code mein yeh add karo
if (!data.xdt_shortcode_media.is_video) {
  // Image post hai
  const imageUrl = data.xdt_shortcode_media.display_url;
  return NextResponse.json({ 
    data,
    downloadUrl: imageUrl,
    type: "image" 
  }, { status: 200 });
}

// Video post
const videoUrl = data.xdt_shortcode_media.video_url;
return NextResponse.json({ 
  data,
  downloadUrl: videoUrl,
  type: "video" 
}, { status: 200 });