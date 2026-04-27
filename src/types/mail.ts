export type EmailProvider = "google" | "microsoft" | "zoho";

export type EmailCategory =
  | "urgent"
  | "important"
  | "veille"
  | "loge"
  | "compta"
  | "newsletter"
  | "events";

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
  category: EmailCategory;
  labels: string[];
  account: {
    email: string;
    provider: EmailProvider;
  };
}

export const CATEGORY_CONFIG: Record<
  EmailCategory,
  { label: string; color: string; bg: string; emoji: string }
> = {
  urgent: {
    label: "Urgent",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    emoji: "🔴",
  },
  important: {
    label: "Important",
    color: "text-orange-700",
    bg: "bg-orange-50 border-orange-200",
    emoji: "🟡",
  },
  veille: {
    label: "Veille santé",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    emoji: "🏥",
  },
  loge: {
    label: "Loge",
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
    emoji: "🤝",
  },
  compta: {
    label: "Comptabilité",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    emoji: "💼",
  },
  newsletter: {
    label: "Newsletter",
    color: "text-gray-600",
    bg: "bg-gray-50 border-gray-200",
    emoji: "📧",
  },
  events: {
    label: "Événements",
    color: "text-indigo-700",
    bg: "bg-indigo-50 border-indigo-200",
    emoji: "🗓️",
  },
};
