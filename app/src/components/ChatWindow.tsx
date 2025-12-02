import { useEffect, useRef } from "react";
import { Terminal } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import type { ChatMessage } from "@/types";

interface ChatWindowProps {
  messages: ChatMessage[];
  isStreaming: boolean;
}

export function ChatWindow({ messages, isStreaming }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-accent/10 border border-accent/20">
              <Terminal className="h-12 w-12 text-accent" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Welcome to Neon Terminal</h2>
            <p className="text-muted-foreground max-w-md">
              Start a conversation by typing a message below. You can switch between
              different AI models using the selector above.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {["Ask me anything", "Help me code", "Explain a concept"].map((suggestion) => (
              <span
                key={suggestion}
                className="px-3 py-1.5 text-sm rounded-full bg-muted/50 text-muted-foreground border border-muted hover:border-accent/50 hover:text-accent transition-colors cursor-default"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div ref={scrollRef} className="p-4 space-y-4 max-w-4xl mx-auto">
        {messages.map((message, index) => (
          <MessageBubble
            key={message._id || index}
            message={message}
            isStreaming={isStreaming && index === messages.length - 1 && message.role === "assistant"}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
