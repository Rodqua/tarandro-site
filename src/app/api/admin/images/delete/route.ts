import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { path: imagePath } = body;

    if (!imagePath) {
      return NextResponse.json(
        { success: false, error: "Chemin d'image manquant" },
        { status: 400 }
      );
    }

    // Sécurité : vérifier que le chemin est bien dans /images/
    if (!imagePath.startsWith("/images/")) {
      return NextResponse.json(
        { success: false, error: "Chemin invalide" },
        { status: 400 }
      );
    }

    const filename = path.basename(imagePath);
    const filepath = path.join(process.cwd(), "public", "images", filename);

    // Vérifier que le fichier existe
    if (!fs.existsSync(filepath)) {
      return NextResponse.json(
        { success: false, error: "Fichier introuvable" },
        { status: 404 }
      );
    }

    // Supprimer le fichier
    fs.unlinkSync(filepath);

    return NextResponse.json({
      success: true,
      message: "Image supprimée avec succès",
    });
  } catch (error: any) {
    console.error("Erreur suppression image:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
