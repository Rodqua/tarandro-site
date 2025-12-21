import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { path: imagePath } = body;

    console.log("Tentative de suppression:", imagePath);

    if (!imagePath) {
      return NextResponse.json(
        { success: false, error: "Chemin d'image manquant" },
        { status: 400 }
      );
    }

    // Supprimer depuis Vercel Blob avec l'URL complète
    await del(imagePath);

    console.log("Image supprimée avec succès:", imagePath);

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
