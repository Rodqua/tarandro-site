import { NextRequest, NextResponse } from "next/server";
import { copy, del } from "@vercel/blob";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, newCategory } = body;

    if (!url || !newCategory) {
      return NextResponse.json(
        { success: false, error: "URL et catégorie requis" },
        { status: 400 }
      );
    }

    // Extraire le nom du fichier de l'URL
    const urlParts = url.split("/");
    const filename = urlParts[urlParts.length - 1];

    // Copier le blob vers le nouveau chemin
    const newBlob = await copy(url, `images/${newCategory}/${filename}`, {
      access: "public",
    });

    // Supprimer l'ancien blob
    await del(url);

    return NextResponse.json({
      success: true,
      newUrl: newBlob.url,
      category: newCategory,
    });
  } catch (error: any) {
    console.error("Erreur changement catégorie:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
