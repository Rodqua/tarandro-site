"use client";

import { useState, useEffect } from "react";
import { FaImage, FaUpload, FaTrash, FaEye, FaTimes } from "react-icons/fa";
import Link from "next/link";

interface ImageFile {
  name: string;
  path: string;
  size: number;
  type: string;
  lastModified: string;
}

export default function ImagesManager() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const response = await fetch("/api/admin/images");
      const data = await response.json();
      console.log("Images chargées:", data);
      if (data.success) {
        setImages(data.images);
      }
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement images:", error);
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    setUploadStatus("Upload en cours...");

    try {
      const response = await fetch("/api/admin/images/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Réponse upload:", data);

      if (data.success) {
        setUploadStatus(`${data.uploaded} image(s) uploadée(s) avec succès !`);
        await loadImages();
        setTimeout(() => setUploadStatus(""), 3000);
      } else {
        setUploadStatus("Erreur lors de l'upload: " + (data.error || "Inconnue"));
      }
    } catch (error) {
      setUploadStatus("Erreur lors de l'upload");
      console.error("Erreur upload:", error);
    }
  };

  const handleDelete = async (imagePath: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) return;

    try {
      const response = await fetch("/api/admin/images/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: imagePath }),
      });

      const data = await response.json();

      if (data.success) {
        loadImages();
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des images
            </h1>
            <p className="text-gray-600 mt-2">
              Téléchargez et gérez les images du site
            </p>
          </div>
          <Link
            href="/admin"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Retour au dashboard
          </Link>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaUpload className="text-primary-600 text-2xl mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Télécharger des images
                </h2>
                <p className="text-sm text-gray-600">
                  PNG, JPG, WebP, SVG (max 5MB par fichier)
                </p>
              </div>
            </div>
            <label className="cursor-pointer bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center">
              <FaUpload className="mr-2" />
              Sélectionner des fichiers
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          </div>
          {uploadStatus && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
              {uploadStatus}
            </div>
          )}
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
            <FaImage className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Aucune image pour le moment</p>
            <p className="text-gray-400 text-sm mt-2">
              Téléchargez vos premières images ci-dessus
            </p>
          </div>
        ) : (
          images.map((image, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={image.path}
                  alt={image.name}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedImage(image.path)}
                />
              </div>
              <div className="p-4">
                <p className="font-medium text-gray-900 truncate mb-1">
                  {image.name}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  {formatFileSize(image.size)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedImage(image.path)}
                    className="flex-1 bg-primary-50 text-primary-600 px-3 py-2 rounded hover:bg-primary-100 transition-colors text-sm font-medium inline-flex items-center justify-center"
                  >
                    <FaEye className="mr-1" />
                    Voir
                  </button>
                  <button
                    onClick={() => handleDelete(image.path)}
                    className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100 transition-colors text-sm font-medium inline-flex items-center justify-center"
                  >
                    <FaTrash className="mr-1" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <FaTimes size={32} />
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-white text-center mt-4 text-sm">
              {selectedImage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
