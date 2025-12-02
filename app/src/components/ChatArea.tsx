import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ModelSelector } from "./ModelSelector";
import { Terminal, Cloud, Loader2 } from "lucide-react";
import type { Message, AIModel } from "@/types";
import type { ToolCallStatus } from "@/hooks/useChat";

interface ChatAreaProps {
  messages: Message[];
  models: AIModel[];
  selectedModel: AIModel | null;
  onModelChange: (model: AIModel) => void;
  onSendMessage: (message: string) => void;
  onStopGeneration: () => void;
  isLoading: boolean;
  toolCallStatus?: ToolCallStatus | null;
}

export function ChatArea({
  messages,
  models,
  selectedModel,
  onModelChange,
  onSendMessage,
  onStopGeneration,
  isLoading,
  toolCallStatus,
}: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-terminal-border bg-terminal-surface">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-neon-500" />
          <span className="text-sm text-gray-400">
            {messages.length > 0
              ? `${messages.length} messages`
              : "Ready for input..."}
          </span>
        </div>
        <ModelSelector
          models={models}
          selectedModel={selectedModel}
          onModelChange={onModelChange}
          disabled={isLoading}
        />
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-16 h-16 mb-4 rounded-lg bg-terminal-muted border border-terminal-border flex items-center justify-center">
                <Terminal className="w-8 h-8 text-neon-500" />
              </div>
              <h2 className="text-xl font-bold text-neon-500 text-shadow-neon mb-2">
                Welcome to Neon Terminal
              </h2>
              <p className="text-gray-500 max-w-md">
                Select an AI model above and start chatting. Your conversations
                will be saved automatically.
              </p>
              <div className="mt-4 flex gap-2 text-xs text-gray-600">
                <span className="px-2 py-1 bg-terminal-muted rounded">
                  🤖 OpenAI
                </span>
                <span className="px-2 py-1 bg-terminal-muted rounded">
                  🧠 Anthropic
                </span>
                <span className="px-2 py-1 bg-terminal-muted rounded">
                  💎 Gemini
                </span>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          {isLoading && messages[messages.length - 1]?.content === "" && (
            <div className="flex items-center gap-2 text-neon-500 px-4">
              {toolCallStatus ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">
                    {toolCallStatus.status === "calling" ? (
                      <>
                        Calling{" "}
                        <span className="font-mono text-neon-400">
                          {toolCallStatus.toolName}
                        </span>
                        {toolCallStatus.args && (
                          <span className="text-gray-500 ml-1">
                            (
                            {Object.entries(toolCallStatus.args)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(", ")}
                            )
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <Cloud className="w-4 h-4 inline mr-1" />
                        Got result from{" "}
                        <span className="font-mono text-neon-400">
                          {toolCallStatus.toolName}
                        </span>
                      </>
                    )}
                  </span>
                </>
              ) : (
                <>
                  <span className="animate-blink">▊</span>
                  <span className="text-sm">Processing...</span>
                </>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <ChatInput
        onSend={onSendMessage}
        onStop={onStopGeneration}
        isLoading={isLoading}
        disabled={!selectedModel}
      />
    </div>
  );
}
