import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const category = (formData.get("category") as string) || "general";

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    const uploadedFiles = [];
    const maxSize = 50 * 1024 * 1024; // 50MB
    const errors = [];

    for (const file of files) {
      // Vérifier la taille
      if (file.size > maxSize) {
        errors.push(`${file.name}: Fichier trop volumineux (max 50MB)`);
        continue;
      }

      // Vérifier le type
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name}: Type de fichier non supporté`);
        continue;
      }

      // Générer un nom de fichier sécurisé
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name.replace(
        /[^a-zA-Z0-9.-]/g,
        "_"
      )}`;

      // Upload vers Vercel Blob avec métadonnées de catégorie
      const blob = await put(`images/${category}/${filename}`, file, {
        access: "public",
        addRandomSuffix: false,
      });

      uploadedFiles.push({
        filename,
        url: blob.url,
        category,
      });
    }

    return NextResponse.json({
      success: true,
      uploaded: uploadedFiles.length,
      files: uploadedFiles,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("Erreur upload images:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
