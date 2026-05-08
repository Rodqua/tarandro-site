"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import EvjfAvatar from "@/components/evjf/EvjfAvatar";

type Reaction = {
  id: string;
  emoji: string;
  user: { id: string; name: string };
};

type Message = {
  id: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  author: { id: string; name: string; role: string; avatarUrl?: string | null };
  reactions: Reaction[];
};

const QUICK_EMOJIS = ["❤️", "😂", "🔥", "👏", "🥂", "💜"];

function groupReactions(reactions: Reaction[]): Record<string, { count: number; users: string[] }> {
  const groups: Record<string, { count: number; users: string[] }> = {};
  for (const r of reactions) {
    if (!groups[r.emoji]) groups[r.emoji] = { count: 0, users: [] };
    groups[r.emoji].count++;
    groups[r.emoji].users.push(r.user.name);
  }
  return groups;
}

export default function MessagesView({
  isOrganizer,
  currentUserId,
  currentUserName,
}: {
  isOrganizer: boolean;
  currentUserId: string;
  currentUserName: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [reactionTarget, setReactionTarget] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const fetchMessages = useCallback(async (silent = false) => {
    const res = await fetch("/api/evjf/messages");
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => fetchMessages(true), 10000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    const res = await fetch("/api/evjf/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input.trim() }),
    });
    if (res.ok) {
      setInput("");
      await fetchMessages(true);
    }
    setSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e as unknown as React.FormEvent);
    }
  };

  const react = async (messageId: string, emoji: string) => {
    await fetch(`/api/evjf/messages/${messageId}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emoji }),
    });
    setReactionTarget(null);
    await fetchMessages(true);
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Supprimer ce message ?")) return;
    await fetch(`/api/evjf/messages/${id}`, { method: "DELETE" });
    await fetchMessages(true);
  };

  const pinMessage = async (msg: Message) => {
    await fetch(`/api/evjf/messages/${msg.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPinned: !msg.isPinned }),
    });
    await fetchMessages(true);
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Chargement des messages...</div>;

  const pinned = messages.filter(m => m.isPinned);
  const regular = messages.filter(m => !m.isPinned);

  return (
    <div className="flex flex-col h-[calc(100vh-130px)]">
      {/* Messages épinglés */}
      {pinned.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 space-y-1 shrink-0">
          {pinned.map(msg => (
            <div key={msg.id} className="flex items-start gap-2 text-sm">
              <span>📌</span>
              <span className="text-amber-800 font-medium">{msg.author.name} :</span>
              <span className="text-amber-700 truncate">{msg.content}</span>
            </div>
          ))}
        </div>
      )}

      {/* Liste des messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {!messages.length && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">💬</div>
            <p>Aucun message pour l&apos;instant</p>
            <p className="text-sm mt-1">Soyez le premier à écrire quelque chose !</p>
          </div>
        )}

        {regular.map((msg) => {
          const isMe = msg.author.id === currentUserId;
          const grouped = groupReactions(msg.reactions);

          return (
            <div key={msg.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar */}
              <EvjfAvatar name={msg.author.name} avatarUrl={msg.author.avatarUrl} size={32} className="mt-1" />

              <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                {!isMe && (
                  <span className="text-xs text-gray-400 px-1">
                    {msg.author.name} {msg.author.role === "ORGANIZER" && "👑"}
                  </span>
                )}

                <div
                  className={`relative group rounded-2xl px-4 py-2.5 shadow-sm cursor-pointer ${
                    isMe
                      ? "bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white rounded-tr-sm"
                      : "bg-white border border-pink-100 text-gray-800 rounded-tl-sm"
                  }`}
                  onClick={() => setReactionTarget(reactionTarget === msg.id ? null : msg.id)}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                  <div className={`absolute top-1 ${isMe ? "left-0 -translate-x-full pr-1" : "right-0 translate-x-full pl-1"} hidden group-hover:flex items-center gap-1`}>
                    {isOrganizer && (
                      <button onClick={(e) => { e.stopPropagation(); pinMessage(msg); }}
                        className="text-xs bg-white border border-gray-200 rounded-lg px-1.5 py-0.5 text-gray-500 hover:text-amber-500 shadow-sm">
                        📌
                      </button>
                    )}
                    {(isMe || isOrganizer) && (
                      <button onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }}
                        className="text-xs bg-white border border-gray-200 rounded-lg px-1.5 py-0.5 text-gray-500 hover:text-red-400 shadow-sm">
                        🗑
                      </button>
                    )}
                  </div>
                </div>

                {reactionTarget === msg.id && (
                  <div className="flex gap-1 bg-white border border-pink-100 rounded-full px-2 py-1 shadow-lg">
                    {QUICK_EMOJIS.map(e => (
                      <button key={e} onClick={() => react(msg.id, e)} className="text-lg hover:scale-125 transition-transform">{e}</button>
                    ))}
                  </div>
                )}

                {Object.keys(grouped).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(grouped).map(([emoji, { count, users }]) => (
                      <button
                        key={emoji}
                        onClick={() => react(msg.id, emoji)}
                        title={users.join(", ")}
                        className="flex items-center gap-0.5 text-xs bg-white border border-pink-100 rounded-full px-2 py-0.5 hover:border-fuchsia-300 transition shadow-sm"
                      >
                        {emoji} <span className="text-gray-500">{count}</span>
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-xs text-gray-300 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Zone de saisie */}
      <div className="border-t border-pink-100 bg-white px-4 py-3 shrink-0">
        <form onSubmit={sendMessage} className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Écris un message... (Entrée pour envoyer)"
            className="flex-1 border border-pink-200 rounded-2xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-fuchsia-300 max-h-32 overflow-y-auto"
            style={{ minHeight: "44px" }}
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="w-11 h-11 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white flex items-center justify-center shadow hover:opacity-90 transition disabled:opacity-40 shrink-0"
          >
            {sending ? "…" : "→"}
          </button>
        </form>
        <p className="text-xs text-gray-300 mt-1 text-center">Cliquer sur un message pour réagir · Maj+Entrée pour nouvelle ligne</p>
      </div>
    </div>
  );
}
