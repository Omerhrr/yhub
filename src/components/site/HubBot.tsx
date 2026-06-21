"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNav } from "@/store/nav";

type Role = "user" | "assistant";
type Action = { label: string; view: string; id?: string };
type Message = { role: Role; content: string; actions?: Action[] };

const GREETING: Message = {
  role: "assistant",
  content: "Hi! I'm Hubbot, your Yahya Hub assistant. I can help you find a workspace, sign up for a course or event, or answer any questions about us. What can I help you with?",
  actions: [
    { label: "Browse Workspaces", view: "workspaces" },
    { label: "View Courses", view: "courses" },
    { label: "Upcoming Events", view: "events" },
  ],
};

export function HubBot() {
  const { navigate, navigateToDetail } = useNav();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const handleAction = (action: Action) => {
    setOpen(false);
    if (action.view === "workspace-detail" || action.view === "course-detail" || action.view === "event-detail") {
      navigateToDetail(action.view as any, action.id ?? "");
    } else {
      navigate(action.view as any);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history
            .filter(m => m.role === "user" || m.role === "assistant")
            .map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const botMsg: Message = {
        role: "assistant",
        content: data.reply ?? data.error ?? "Sorry, I couldn't understand that. Please try again.",
        actions: data.actions ?? [],
      };
      setMessages(prev => [...prev, botMsg]);
      if (!open) setUnread(u => u + 1);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment, or reach us on WhatsApp at 07043925169.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className={cn(
          "fixed bottom-20 right-4 z-50 flex flex-col w-[340px] max-w-[calc(100vw-2rem)]",
          "rounded-2xl border border-border bg-background shadow-2xl shadow-black/20",
          "overflow-hidden transition-all duration-300",
        )}>
          {/* Header */}
          <div className="flex items-center gap-3 bg-primary px-4 py-3 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-tight">Hubbot</p>
              <p className="text-[10px] text-white/60">Yahya Hub Assistant · Always online</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px] min-h-[240px] bg-muted/20">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex flex-col gap-1.5", msg.role === "user" ? "items-end" : "items-start")}>
                <div className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-primary text-white rounded-tr-sm"
                    : "bg-background text-foreground border border-border/60 rounded-tl-sm shadow-sm",
                )}>
                  {msg.content}
                </div>
                {/* Action buttons */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 max-w-[90%]">
                    {msg.actions.map((action, j) => (
                      <button
                        key={j}
                        onClick={() => handleAction(action)}
                        className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-border/60 bg-background px-3.5 py-2.5 text-sm text-muted-foreground shadow-sm">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Hubbot is typing…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-border bg-background px-3 py-2.5">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask me anything…"
              maxLength={600}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white disabled:opacity-40 hover:bg-primary/90 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-black/20 transition-all duration-300",
          "bg-primary text-white hover:scale-105 active:scale-95",
        )}
        aria-label={open ? "Close chat" : "Open Hubbot chat"}
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </>
        )}
      </button>
    </>
  );
}
