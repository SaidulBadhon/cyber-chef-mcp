import { useState, useCallback } from "react";
import { Sidebar } from "./components/Sidebar";
import { ChatWindow } from "./components/ChatWindow";
import { ChatInput } from "./components/ChatInput";
import { ModelSelector } from "./components/ModelSelector";
import { useChat } from "./hooks/useChat";
import { fetchSession } from "./lib/utils";
import type { ModelProvider } from "./types";

function App() {
  const [selectedModel, setSelectedModel] = useState<{
    provider: ModelProvider;
    name: string;
  } | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSessionCreated = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const {
    messages,
    isStreaming,
    sessionId,
    sendMessage,
    stopStreaming,
    loadSession,
    clearSession,
  } = useChat({ onSessionCreated: handleSessionCreated });

  const handleSelectSession = async (id: string) => {
    try {
      const data = await fetchSession(id);
      loadSession(id, data.messages);
    } catch (error) {
      console.error("Failed to load session:", error);
    }
  };

  const handleNewChat = () => {
    clearSession();
  };

  const handleSendMessage = (content: string) => {
    if (!selectedModel) return;
    sendMessage(content, selectedModel.provider, selectedModel.name);
  };

  const handleSelectModel = (provider: ModelProvider, name: string) => {
    setSelectedModel({ provider, name });
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <Sidebar
        selectedSessionId={sessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        refreshTrigger={refreshTrigger}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b border-muted bg-card/50 px-6 py-4">
          <ModelSelector
            selectedModel={selectedModel}
            onSelectModel={handleSelectModel}
          />
        </header>

        {/* Chat Area */}
        <ChatWindow messages={messages} isStreaming={isStreaming} />

        {/* Input */}
        <ChatInput
          onSend={handleSendMessage}
          onStop={stopStreaming}
          isStreaming={isStreaming}
          disabled={!selectedModel}
        />
      </div>
    </div>
  );
}

export default App;
