import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const { blobs } = await list({
      prefix: category ? `images/${category}/` : "images/",
    });

    const images = blobs.map((blob) => {
      const pathParts = blob.pathname.split("/");
      const filename = pathParts[pathParts.length - 1];
      const categoryFromPath = pathParts.length > 2 ? pathParts[1] : "general";

      return {
        name: filename,
        path: blob.url,
        size: blob.size,
        type: blob.pathname.split(".").pop() || "",
        lastModified: blob.uploadedAt.toISOString(),
        category: categoryFromPath,
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
