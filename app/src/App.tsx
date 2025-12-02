import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatArea } from "@/components/ChatArea";
import { useChat } from "@/hooks/useChat";
import { useModels } from "@/hooks/useModels";
import { useSessions } from "@/hooks/useSessions";
import type { AIModel } from "@/types";

export default function App() {
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const { models } = useModels();
  const { sessions, fetchSessions, deleteSession } = useSessions();
  const {
    messages,
    isLoading,
    sessionId,
    toolCallStatus,
    sendMessage,
    stopGeneration,
    clearMessages,
    loadSession,
  } = useChat({
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  // Set default model when models are loaded
  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0]);
    }
  }, [models, selectedModel]);

  // Refresh sessions when a new message is sent
  useEffect(() => {
    if (sessionId) {
      fetchSessions();
    }
  }, [sessionId, messages.length, fetchSessions]);

  const handleNewChat = () => {
    clearMessages();
  };

  const handleSelectSession = async (id: string) => {
    await loadSession(id);
  };

  const handleDeleteSession = async (id: string) => {
    await deleteSession(id);
    if (id === sessionId) {
      clearMessages();
    }
  };

  const handleSendMessage = (message: string) => {
    if (selectedModel) {
      sendMessage(message, selectedModel);
    }
  };

  return (
    <div className="flex h-screen bg-terminal-bg">
      <Sidebar
        sessions={sessions}
        currentSessionId={sessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
      />
      <ChatArea
        messages={messages}
        models={models}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        onSendMessage={handleSendMessage}
        onStopGeneration={stopGeneration}
        isLoading={isLoading}
        toolCallStatus={toolCallStatus}
      />
    </div>
  );
}
