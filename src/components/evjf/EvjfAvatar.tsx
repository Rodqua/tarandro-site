"use client";

import Image from "next/image";

const AVATAR_COLORS = [
  "bg-fuchsia-400", "bg-pink-400", "bg-rose-400",
  "bg-purple-400", "bg-amber-400", "bg-teal-400", "bg-blue-400",
];

function getColor(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

export default function EvjfAvatar({
  name,
  avatarUrl,
  size = 32,
  className = "",
}: {
  name: string;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
}) {
  if (avatarUrl) {
    return (
      <div
        className={`relative rounded-full overflow-hidden shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={avatarUrl}
          alt={name}
          fill
          className="object-cover"
          sizes={`${size}px`}
        />
      </div>
    );
  }

  return (
    <div
      className={`${getColor(name)} text-white rounded-full flex items-center justify-center font-bold shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
    >
      {name[0].toUpperCase()}
    </div>
  );
}
