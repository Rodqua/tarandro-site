export type EmailProvider = "google" | "microsoft" | "outlook" | "zoho";

// Open type — accepts built-in names and any custom category
export type EmailCategory = string;

export interface CategoryConfig {
  id: string;
  name: string;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  isBuiltIn: boolean;
}

export interface EmailAccount {
  id: string;
  provider: EmailProvider;
  email: string;
  displayName?: string;
  createdAt: string;
  _count?: { threads: number };
}

export interface EmailThread {
  id: string;
  threadId: string;
  accountId: string;
  subject: string;
  snippet: string;
  sender: string;
  date: string;
  isUnread: boolean;
  attachmentCount?: number;
  category: EmailCategory;
  labels: string[];
  account: {
    email: string;
    provider: EmailProvider;
  };
}

// Built-in fallback config (used when DB not yet loaded)
export const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
  urgent:     { label: "Urgent",        color: "text-red-700",    bg: "bg-red-50 border-red-200",      emoji: "🔴" },
  important:  { label: "Important",     color: "text-orange-700", bg: "bg-orange-50 border-orange-200", emoji: "🟡" },
  veille:     { label: "Veille santé",  color: "text-green-700",  bg: "bg-green-50 border-green-200",   emoji: "🏥" },
  loge:       { label: "Loge",          color: "text-purple-700", bg: "bg-purple-50 border-purple-200", emoji: "🤝" },
  compta:     { label: "Comptabilité",  color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",     emoji: "💼" },
  newsletter: { label: "Newsletter",    color: "text-gray-600",   bg: "bg-gray-50 border-gray-200",     emoji: "📧" },
  events:     { label: "Événements",    color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200", emoji: "🗓️" },
}

// Build dynamic config from DB categories
export function buildCategoryConfig(cats: CategoryConfig[]): Record<string, { label: string; color: string; bg: string; emoji: string }> {
  const config: Record<string, { label: string; color: string; bg: string; emoji: string }> = { ...CATEGORY_CONFIG }
  for (const c of cats) {
    config[c.name] = { label: c.label, color: c.color, bg: c.bg, emoji: c.emoji }
  }
  return config
}
