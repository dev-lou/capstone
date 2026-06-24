"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconUser, IconSpinner, IconPaperPlane } from "./icons";

// ── Inline chat icon (not in icons.tsx) ────────────────────
function ChatIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M216,48H40A16,16,0,0,0,24,64V224a8,8,0,0,0,13.36,5.71L69.46,200H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48Zm0,136H69.46a8,8,0,0,0-5.36,2.1L40,208.36V64H216Z" />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content: "👋 Magandang araw! Ako si RescueMind AI Assistant. Paano ako makatutulong sa inyo? Maaari akong magpaliwanag tungkol sa pag-report ng insidente, mga kategorya, at iba pa.",
};

const SUGGESTED_QUESTIONS = [
  "Paano mag-report ng insidente?",
  "Ano ang mga kategorya ng report?",
  "Ano ang tracking ID?",
  "Paano ko masusubaybayan ang report ko?",
];

// ────────────────────────────────────────────────────────────
// Motion variants
// ────────────────────────────────────────────────────────────

const panelVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
};

const messageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

// ────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: ChatMessage = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          sessionId: sessionId || undefined,
        }),
      });

      const data = await res.json();

      if (sessionId && data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
      } else if (!sessionId && data.sessionId) {
        setSessionId(data.sessionId);
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.reply || "Paumanhin, hindi ako makasagot ngayon.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Paumanhin, may naganap na error. Pakisubukan muli." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading, sessionId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggested = (question: string) => {
    sendMessage(question);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-[360px] sm:w-[400px] h-[520px] bg-[var(--color-surface)] dark:bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            role="dialog"
            aria-label="RescueMind AI Chat Assistant"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-primary)] text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <IconUser className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">RescueMind AI</p>
                  <p className="text-[0.6rem] opacity-70">Barangay Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Isara ang chat"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[var(--color-primary)] text-white rounded-br-md"
                        : "bg-[var(--color-bg-muted)] text-[var(--color-text)] rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex justify-start"
                >
                  <div className="bg-[var(--color-bg-muted)] px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[var(--color-text-muted)] rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-[var(--color-text-muted)] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <span className="w-1.5 h-1.5 bg-[var(--color-text-muted)] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions (shown only at start) */}
            {messages.length === 1 && !loading && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggested(q)}
                    className="text-[0.65rem] px-2.5 py-1 rounded-full bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-muted)] hover:text-[var(--color-primary)] transition-colors border border-[var(--color-border)]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="shrink-0 border-t border-[var(--color-border)] p-3 flex gap-2">
              <label htmlFor="chat-input" className="sr-only">Type a message</label>
              <input
                id="chat-input"
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Mag-type ng mensahe..."
                className="flex-1 px-3.5 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-accent)] focus:shadow-[var(--shadow-focus-accent)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
                disabled={loading}
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                aria-label="Send message"
              >
                {loading ? <IconSpinner className="w-4 h-4" /> : <IconPaperPlane className="w-4 h-4" />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-14 h-14 flex items-center justify-center rounded-2xl shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-[var(--color-danger)] rotate-90"
            : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
        }`}
        aria-label={isOpen ? "Isara ang chat" : "Buksan ang chat"}
      >
        {isOpen ? (
          <CloseIcon className="w-6 h-6 text-white" />
        ) : (
          <ChatIcon className="w-6 h-6 text-white" />
        )}
      </motion.button>
    </div>
  );
}
