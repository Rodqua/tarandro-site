import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET() {
  try {
    const { blobs } = await list({
      prefix: "images/",
    });

    const images = blobs.map((blob) => {
      const filename = blob.pathname.replace("images/", "");
      return {
        name: filename,
        path: blob.url,
        size: blob.size,
        type: blob.pathname.split(".").pop() || "",
        lastModified: blob.uploadedAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      images,
      total: images.length,
    });
  } catch (error: any) {
    console.error("Erreur lecture images:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
