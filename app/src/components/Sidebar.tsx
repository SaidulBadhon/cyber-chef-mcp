import { useEffect, useState } from "react";
import { Terminal, Plus, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { cn, fetchSessions, deleteSession } from "@/lib/utils";
import type { ChatSession } from "@/types";

interface SidebarProps {
  selectedSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  refreshTrigger: number;
}

export function Sidebar({
  selectedSessionId,
  onSelectSession,
  onNewChat,
  refreshTrigger,
}: SidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, [refreshTrigger]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const data = await fetchSessions();
      setSessions(data);
    } catch (error) {
      console.error("Failed to load sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteSession(id);
      setSessions((prev) => prev.filter((s) => s._id !== id));
      if (selectedSessionId === id) {
        onNewChat();
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  return (
    <div className="w-64 h-full bg-card border-r border-muted flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-muted">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="h-6 w-6 text-accent" />
          <h1 className="text-lg font-bold text-accent text-glow">Neon Terminal</h1>
        </div>
        <Button onClick={onNewChat} className="w-full" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="text-muted-foreground text-sm animate-pulse">Loading...</div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">No chat history</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session._id}
                onClick={() => onSelectSession(session._id)}
                className={cn(
                  "group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all mb-1",
                  selectedSessionId === session._id
                    ? "bg-accent/20 border border-accent/50 shadow-glow-sm"
                    : "hover:bg-muted/50 border border-transparent"
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">
                    {session.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(session.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDelete(e, session._id)}
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-muted">
        <p className="text-xs text-muted-foreground text-center">
          Powered by AI
        </p>
      </div>
    </div>
  );
}
