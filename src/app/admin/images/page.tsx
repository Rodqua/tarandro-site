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
  category?: string;
}

export default function ImagesManager() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [uploadCategory, setUploadCategory] = useState<string>("general");

  const categories = [
    { value: "all", label: "Toutes les catégories" },
    { value: "general", label: "Général" },
    { value: "blog", label: "Blog" },
    { value: "partenaire", label: "Partenaires" },
    { value: "service", label: "Services" },
    { value: "team", label: "Équipe" },
    { value: "logo", label: "Logos" },
  ];

  useEffect(() => {
    loadImages();
  }, [selectedCategory]);

  const loadImages = async () => {
    try {
      // Ajouter un timestamp pour éviter le cache
      const categoryParam =
        selectedCategory !== "all" ? `&category=${selectedCategory}` : "";
      const response = await fetch(
        `/api/admin/images?t=${Date.now()}${categoryParam}`
      );
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
    formData.append("category", uploadCategory);

    setUploadStatus("Upload en cours...");

    try {
      const response = await fetch("/api/admin/images/upload", {
        method: "POST",
        body: formData,
      });

      // Gérer l'erreur 413 (fichier trop volumineux)
      if (response.status === 413) {
        setUploadStatus("Erreur: Fichier trop volumineux (max 50MB)");
        e.target.value = "";
        setTimeout(() => setUploadStatus(""), 5000);
        return;
      }

      // Gérer les autres erreurs HTTP
      if (!response.ok) {
        setUploadStatus(
          `Erreur HTTP ${response.status}: ${response.statusText}`
        );
        e.target.value = "";
        setTimeout(() => setUploadStatus(""), 5000);
        return;
      }

      const data = await response.json();
      console.log("Réponse upload:", data);

      if (data.success) {
        let message = `${data.uploaded} image(s) uploadée(s) avec succès !`;
        if (data.errors && data.errors.length > 0) {
          message += ` Avertissements: ${data.errors.join(", ")}`;
        }
        setUploadStatus(message);
        // Reset input pour permettre de réuploader le même fichier
        e.target.value = "";

        // Ajouter les nouvelles images à la liste sans tout recharger
        if (data.files && data.files.length > 0) {
          const newImages = data.files.map((file: any) => ({
            name: file.filename,
            path: file.url,
            size: 0, // Taille non disponible immédiatement
            type: file.filename.split(".").pop() || "",
            category: file.category || uploadCategory,
            lastModified: new Date().toISOString(),
          }));
          setImages((prevImages) => [...newImages, ...prevImages]);
        }

        setTimeout(() => setUploadStatus(""), 3000);
      } else {
        setUploadStatus(
          "Erreur lors de l'upload: " + (data.error || "Inconnue")
        );
        e.target.value = "";
      }
    } catch (error) {
      setUploadStatus("Erreur lors de l'upload");
      console.error("Erreur upload:", error);
      e.target.value = "";
    }
  };

  const handleDelete = async (imagePath: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) return;

    try {
      console.log("Suppression de:", imagePath);

      const response = await fetch("/api/admin/images/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: imagePath }),
      });

      const data = await response.json();
      console.log("Réponse suppression:", data);

      if (data.success) {
        // Retirer l'image immédiatement de l'UI sans recharger
        setImages((prevImages) =>
          prevImages.filter((img) => img.path !== imagePath)
        );
      } else {
        alert("Erreur lors de la suppression: " + (data.error || "Inconnue"));
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("Erreur lors de la suppression de l'image");
    }
  };

  const handleCategoryChange = async (
    imagePath: string,
    newCategory: string
  ) => {
    try {
      const response = await fetch("/api/admin/images/update-category", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imagePath, newCategory }),
      });

      const data = await response.json();

      if (data.success) {
        // Mettre à jour l'image dans la liste
        setImages((prevImages) =>
          prevImages.map((img) =>
            img.path === imagePath
              ? { ...img, path: data.newUrl, category: data.category }
              : img
          )
        );
      } else {
        alert(
          "Erreur lors du changement de catégorie: " +
            (data.error || "Inconnue")
        );
      }
    } catch (error) {
      console.error("Erreur changement catégorie:", error);
      alert("Erreur lors du changement de catégorie");
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center">
              <FaUpload className="text-primary-600 text-2xl mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Télécharger des images
                </h2>
                <p className="text-sm text-gray-600">
                  PNG, JPG, WebP, SVG (max 10MB par fichier)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              >
                {categories
                  .filter((c) => c.value !== "all")
                  .map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
              </select>
              <label className="cursor-pointer bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center">
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
          </div>
          {uploadStatus && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
              {uploadStatus}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              Filtrer par catégorie :
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat.value
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
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
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">
                    {formatFileSize(image.size)}
                  </p>
                  <select
                    value={image.category || "general"}
                    onChange={(e) =>
                      handleCategoryChange(image.path, e.target.value)
                    }
                    className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary-600 focus:border-transparent"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {categories
                      .filter((c) => c.value !== "all")
                      .map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                  </select>
                </div>
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
