import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

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

    const imagesDir = path.join(process.cwd(), "public", "images");
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
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
      const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filepath = path.join(imagesDir, filename);

      // Convertir le fichier en buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Écrire le fichier
      await writeFile(filepath, buffer);
      uploadedFiles.push(filename);
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
