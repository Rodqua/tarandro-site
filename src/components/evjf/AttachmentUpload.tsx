"use client";

import { useRef, useState } from "react";

export type Attachment = { url: string; name: string; size: number; type: string };

function fileIcon(type: string) {
  if (type === "application/pdf") return "📄";
  if (type.startsWith("image/")) return "🖼️";
  if (type.includes("word")) return "📝";
  if (type.includes("excel") || type.includes("spreadsheet")) return "📊";
  return "📎";
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

export default function AttachmentUpload({
  value,
  onChange,
  label = "Ajouter des pièces jointes",
}: {
  value: Attachment[];
  onChange: (attachments: Attachment[]) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");

    const newAttachments: Attachment[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/evjf/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Erreur upload");
        continue;
      }
      newAttachments.push(await res.json());
    }

    onChange([...value, ...newAttachments]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(url: string) {
    onChange(value.filter((a) => a.url !== url));
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-gray-500 block">{label}</label>

      {/* Liste des PJ existantes */}
      {value.length > 0 && (
        <div className="space-y-1.5">
          {value.map((att) => (
            <div key={att.url} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200 group">
              <span className="text-lg flex-shrink-0">{fileIcon(att.type)}</span>
              <div className="flex-1 min-w-0">
                <a
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-blue-600 hover:underline truncate block"
                >
                  {att.name}
                </a>
                <span className="text-xs text-gray-400">{formatSize(att.size)}</span>
              </div>
              <button
                type="button"
                onClick={() => remove(att.url)}
                className="text-gray-300 hover:text-red-500 transition-colors text-sm flex-shrink-0"
                title="Supprimer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Bouton d'ajout */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-pink-200 text-pink-500 text-sm hover:border-pink-400 hover:bg-pink-50 transition-colors disabled:opacity-60 w-full justify-center"
      >
        {uploading ? (
          <><span className="animate-spin">⏳</span> Upload en cours…</>
        ) : (
          <><span>📎</span> {value.length > 0 ? "Ajouter une autre PJ" : "Ajouter une pièce jointe"}</>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-xs text-gray-400">PDF, images, Word, Excel — max 10 Mo par fichier</p>
    </div>
  );
}
