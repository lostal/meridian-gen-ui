/**
 * MERIDIAN LIVING - Chat Interface Component
 * 
 * The main conversational interface for the Generative UI.
 * Handles user input, AI responses, and tool call rendering.
 */

"use client";

import { useRef, useEffect, useCallback } from "react";
import { useChat, type Message } from "ai/react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { WidgetRenderer, getWidgetSkeleton } from "@/components/widgets/registry";

// ============================================
// Message Bubble Component
// ============================================

interface MessageBubbleProps {
  readonly message: Message;
  readonly isLatest: boolean;
}

function MessageBubble({ message, isLatest }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex gap-3 message-enter",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[--color-midnight] to-[--color-midnight-soft] flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] md:max-w-[60%]",
          isUser ? "order-first" : ""
        )}
      >
        {/* Text content */}
        {message.content && (
          <div
            className={cn(
              "px-4 py-3 rounded-2xl",
              isUser
                ? "bg-[--color-midnight] text-white rounded-br-md"
                : "bg-white border border-[--color-sand] text-[--color-midnight] rounded-bl-md shadow-subtle"
            )}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        )}

        {/* Tool invocations (widgets) */}
        {message.toolInvocations && message.toolInvocations.length > 0 && (
          <div className="mt-3 space-y-3">
            {message.toolInvocations.map((toolInvocation) => {
              const { toolCallId, toolName, state } = toolInvocation;

              if (state === "call" || state === "partial-call") {
                // Tool is being called - show skeleton
                const Skeleton = getWidgetSkeleton(toolName);
                return Skeleton ? (
                  <Skeleton key={toolCallId} />
                ) : (
                  <div
                    key={toolCallId}
                    className="flex items-center gap-2 p-4 rounded-xl bg-[--color-sand]/30"
                  >
                    <Loader2 className="h-4 w-4 animate-spin text-[--color-midnight-muted]" />
                    <span className="text-sm text-[--color-midnight-muted]">
                      Procesando...
                    </span>
                  </div>
                );
              }

              if (state === "result") {
                // Tool completed - render widget with result
                return (
                  <WidgetRenderer
                    key={toolCallId}
                    toolName={toolName}
                    data={toolInvocation.result}
                    isLoading={false}
                  />
                );
              }

              return null;
            })}
          </div>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="shrink-0 w-8 h-8 rounded-lg bg-[--color-sand] flex items-center justify-center">
          <User className="h-4 w-4 text-[--color-midnight]" />
        </div>
      )}
    </motion.div>
  );
}

// ============================================
// Typing Indicator
// ============================================

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-3"
    >
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[--color-midnight] to-[--color-midnight-soft] flex items-center justify-center">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-[--color-sand] shadow-subtle">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[--color-midnight-muted]"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// Suggestion Chips
// ============================================

interface SuggestionChipsProps {
  readonly onSelect: (suggestion: string) => void;
}

function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  const suggestions = [
    "Reservar pádel mañana",
    "¿Qué amenities hay?",
    "Piscina este fin de semana",
    "Quiero ir al spa",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-wrap gap-2 justify-center"
    >
      {suggestions.map((suggestion) => (
        <motion.button
          key={suggestion}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(suggestion)}
          className={cn(
            "px-4 py-2 rounded-full text-sm",
            "bg-white border border-[--color-sand] text-[--color-midnight]",
            "hover:border-[--color-midnight]/20 hover:shadow-subtle",
            "transition-all duration-200"
          )}
        >
          {suggestion}
        </motion.button>
      ))}
    </motion.div>
  );
}

// ============================================
// Main Chat Interface
// ============================================

export function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    error,
  } = useChat({
    api: "/api/chat",
    maxSteps: 5,
    onError: (err) => {
      console.error("[Chat] Error from useChat:", err);
    },
    onResponse: (response) => {
      console.log("[Chat] Response status:", response.status);
    },
    onFinish: (message) => {
      console.log("[Chat] Finished message:", message);
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle suggestion selection
  const handleSuggestion = useCallback(
    (suggestion: string) => {
      setInput(suggestion);
      // Submit after a brief delay for visual feedback
      setTimeout(() => {
        const form = inputRef.current?.closest("form");
        form?.requestSubmit();
      }, 100);
    },
    [setInput]
  );

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const form = e.currentTarget.closest("form");
        form?.requestSubmit();
      }
    },
    []
  );

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Empty state */}
          {!hasMessages && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[--color-midnight] to-[--color-midnight-soft] mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="font-display text-3xl text-[--color-midnight] mb-2">
                Bienvenido a Meridian
              </h2>
              <p className="text-[--color-midnight-muted] mb-8 max-w-md mx-auto">
                Dime qué necesitas y haré que suceda. Puedes reservar amenities,
                gestionar visitas, o preguntar sobre los servicios del edificio.
              </p>
              <SuggestionChips onSelect={handleSuggestion} />
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLatest={index === messages.length - 1}
              />
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          <AnimatePresence>
            {isLoading && <TypingIndicator />}
          </AnimatePresence>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-xl bg-[--color-error]/10 border border-[--color-error]/20"
            >
              <p className="text-sm text-[--color-error] font-medium mb-1">
                Error
              </p>
              <p className="text-sm text-[--color-midnight-muted]">
                {error.message || "Ha ocurrido un error. Por favor, inténtalo de nuevo."}
              </p>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-[--color-sand] bg-[--color-cream]/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto p-4">
          <form onSubmit={handleSubmit}>
            <div className="chat-input flex items-end gap-3 p-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu mensaje..."
                rows={1}
                className={cn(
                  "flex-1 resize-none bg-transparent px-3 py-2.5",
                  "text-[--color-midnight] placeholder:text-[--color-midnight-muted]/50",
                  "focus:outline-none",
                  "max-h-32"
                )}
                style={{
                  height: "auto",
                  minHeight: "44px",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                }}
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "shrink-0 p-2.5 rounded-xl",
                  "bg-[--color-midnight] text-white",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-all duration-200"
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </motion.button>
            </div>
          </form>

          <p className="text-center text-xs text-[--color-midnight-muted]/50 mt-2">
            Presiona Enter para enviar · Shift + Enter para nueva línea
          </p>
        </div>
      </div>
    </div>
  );
}
