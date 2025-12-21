import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    const uploadedFiles = [];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      // Vérifier la taille
      if (file.size > maxSize) {
        continue;
      }

      // Vérifier le type
      if (!file.type.startsWith("image/")) {
        continue;
      }

      // Générer un nom de fichier sécurisé
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name.replace(
        /[^a-zA-Z0-9.-]/g,
        "_"
      )}`;

      // Upload vers Vercel Blob
      const blob = await put(`images/${filename}`, file, {
        access: "public",
      });

      uploadedFiles.push({
        filename,
        url: blob.url,
      });
    }

    return NextResponse.json({
      success: true,
      uploaded: uploadedFiles.length,
      files: uploadedFiles,
    });
  } catch (error: any) {
    console.error("Erreur upload images:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
