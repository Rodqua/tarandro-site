import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

// Image generation
export default async function AppleIcon() {
  // Fetch the logo image
  const imageData = await fetch(
    "https://8vsrlofryyepkmou.public.blob.vercel-storage.com/images/partenaire/1766341574545-Logo_miniatureweb.png"
  ).then((res) => res.arrayBuffer());

  return new Response(imageData, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
