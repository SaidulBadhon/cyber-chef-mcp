import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-4 p-4 rounded-lg transition-all",
        isUser
          ? "bg-muted/30 border border-accent/20"
          : "bg-card/50 border border-muted"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-accent/20" : "bg-muted"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-accent" />
        ) : (
          <Bot className="h-4 w-4 text-accent" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-medium", isUser ? "text-accent" : "text-foreground")}>
            {isUser ? "You" : "Assistant"}
          </span>
          {!isUser && message.modelName && (
            <span className="text-xs px-2 py-0.5 rounded bg-accent/10 text-accent/80 border border-accent/20">
              {message.modelProvider} / {message.modelName}
            </span>
          )}
        </div>

        {/* Message content */}
        <div className="prose prose-invert prose-sm max-w-none prose-p:text-foreground prose-headings:text-accent prose-code:text-accent prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:border prose-pre:border-muted prose-a:text-accent">
          {message.content ? (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          ) : isStreaming ? (
            <span className="inline-flex items-center gap-1">
              <span className="text-muted-foreground">Generating</span>
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
              </span>
            </span>
          ) : null}
          {isStreaming && message.content && (
            <span className="inline-block w-2 h-4 bg-accent ml-0.5 animate-blink" />
          )}
        </div>
      </div>
    </div>
  );
}
