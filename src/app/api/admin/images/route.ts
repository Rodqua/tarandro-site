import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), "public", "images");
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
      return NextResponse.json({ success: true, images: [] });
    }

    const files = fs.readdirSync(imagesDir, { withFileTypes: true });
    
    const images = files
      .filter(file => file.isFile() && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name))
      .map(file => {
        const filePath = path.join(imagesDir, file.name);
        const stats = fs.statSync(filePath);
        
        return {
          name: file.name,
          path: `/images/${file.name}`,
          size: stats.size,
          type: path.extname(file.name),
          lastModified: stats.mtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());

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
