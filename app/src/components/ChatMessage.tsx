import ReactMarkdown from "react-markdown";
import { Terminal, Bot } from "lucide-react";
import { cn, getProviderIcon, getProviderColor } from "@/lib/utils";
import type { Message } from "@/types";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-4 p-4 rounded-lg",
        isUser ? "bg-terminal-surface" : "bg-transparent"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center",
          isUser
            ? "bg-neon-500 text-terminal-bg"
            : "bg-terminal-muted border border-terminal-border"
        )}
      >
        {isUser ? (
          <Terminal className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4 text-neon-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={cn(
              "text-sm font-semibold",
              isUser ? "text-neon-500" : "text-neon-400"
            )}
          >
            {isUser ? "You" : "Assistant"}
          </span>
          {message.model && (
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full border border-terminal-border",
                getProviderColor(getProviderFromModel(message.model))
              )}
            >
              {getProviderIcon(getProviderFromModel(message.model))}{" "}
              {message.model}
            </span>
          )}
        </div>
        <div className="prose-neon">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown>{message.content || "..."}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}

function getProviderFromModel(modelId: string): string {
  if (modelId.includes("gpt")) return "openai";
  if (modelId.includes("claude")) return "anthropic";
  if (modelId.includes("gemini")) return "gemini";
  return "unknown";
}

