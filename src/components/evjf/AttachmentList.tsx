import { Attachment } from "./AttachmentUpload";

function fileIcon(type: string) {
  if (type === "application/pdf") return "📄";
  if (type.startsWith("image/")) return "🖼️";
  if (type.includes("word")) return "📝";
  if (type.includes("excel") || type.includes("spreadsheet")) return "📊";
  return "📎";
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

export default function AttachmentList({ attachments }: { attachments: Attachment[] }) {
  if (!attachments || attachments.length === 0) return null;
  return (
    <div className="mt-2 space-y-1">
      <p className="text-xs font-semibold text-gray-400 mb-1">📎 Pièces jointes</p>
      {attachments.map((att) => (
        <a
          key={att.url}
          href={att.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-1.5 rounded-lg bg-gray-50 border border-gray-100 hover:border-pink-200 hover:bg-pink-50 transition-colors group"
        >
          <span className="text-base">{fileIcon(att.type)}</span>
          <span className="flex-1 text-xs text-gray-700 group-hover:text-pink-600 truncate font-medium">{att.name}</span>
          <span className="text-xs text-gray-400 flex-shrink-0">{formatSize(att.size)}</span>
          <span className="text-xs text-blue-400 flex-shrink-0">↗</span>
        </a>
      ))}
    </div>
  );
}
