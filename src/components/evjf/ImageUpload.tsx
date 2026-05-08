"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function ImageUpload({
  value,
  onChange,
  label = "Ajouter une photo",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/evjf/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      onChange(url);
    } else {
      const d = await res.json();
      setError(d.error || "Erreur upload");
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-pink-200 group">
          <div className="relative w-full h-40">
            <Image src={value} alt="Photo" fill className="object-cover" sizes="400px" />
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white text-gray-800 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              Changer
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="bg-red-500 text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
            >
              Supprimer
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-pink-200 rounded-xl py-6 flex flex-col items-center gap-2 hover:border-fuchsia-300 hover:bg-fuchsia-50 transition disabled:opacity-50"
        >
          {uploading ? (
            <span className="text-sm text-gray-400">Upload en cours...</span>
          ) : (
            <>
              <span className="text-3xl">📷</span>
              <span className="text-sm font-medium text-gray-500">{label}</span>
              <span className="text-xs text-gray-400">JPG, PNG, WebP — max 5 Mo</span>
            </>
          )}
        </button>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}
