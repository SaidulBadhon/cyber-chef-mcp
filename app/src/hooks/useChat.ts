import { useState, useCallback, useRef } from "react";
import type { ChatMessage, ModelProvider, StreamResponse } from "@/types";
import { API_URL } from "@/lib/utils";

interface UseChatOptions {
  onSessionCreated?: (sessionId: string) => void;
}

export function useChat(options?: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadSession = useCallback((id: string, sessionMessages: ChatMessage[]) => {
    setSessionId(id);
    setMessages(sessionMessages);
  }, []);

  const clearSession = useCallback(() => {
    setSessionId(null);
    setMessages([]);
  }, []);

  const sendMessage = useCallback(
    async (
      content: string,
      modelProvider: ModelProvider,
      modelName: string
    ) => {
      if (!content.trim() || isStreaming) return;

      const userMessage: ChatMessage = {
        role: "user",
        content: content.trim(),
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setIsStreaming(true);

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: "",
        modelProvider,
        modelName,
      };

      setMessages([...newMessages, assistantMessage]);

      try {
        abortControllerRef.current = new AbortController();

        const response = await fetch(`${API_URL}/api/chat/stream`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            modelProvider,
            modelName,
            messages: newMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data: StreamResponse = JSON.parse(line.slice(6));
                
                if (data.text) {
                  fullContent += data.text;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      ...updated[updated.length - 1],
                      content: fullContent,
                    };
                    return updated;
                  });
                }

                if (data.done && data.sessionId) {
                  if (!sessionId) {
                    setSessionId(data.sessionId);
                    options?.onSessionCreated?.(data.sessionId);
                  }
                }

                if (data.error) {
                  throw new Error(data.error);
                }
              } catch (e) {
                if (e instanceof SyntaxError) continue;
                throw e;
              }
            }
          }
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.log("Request aborted");
        } else {
          console.error("Error sending message:", error);
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: "Error: Failed to get response. Please try again.",
            };
            return updated;
          });
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [messages, sessionId, isStreaming, options]
  );

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    messages,
    isStreaming,
    sessionId,
    sendMessage,
    stopStreaming,
    loadSession,
    clearSession,
  };
}
