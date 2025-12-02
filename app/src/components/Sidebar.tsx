import { Plus, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { SessionSummary } from "@/types";

interface SidebarProps {
  sessions: SessionSummary[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  isLoading?: boolean;
}

export function Sidebar({
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
}: SidebarProps) {
  return (
    <div className="w-64 h-full bg-terminal-surface border-r border-terminal-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-terminal-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-neon-500 animate-pulse-glow" />
          <h1 className="text-lg font-bold text-shadow-neon">Neon Terminal</h1>
        </div>
        <Button onClick={onNewChat} className="w-full" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Sessions list */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sessions.length === 0 ? (
            <p className="text-sm text-gray-600 text-center py-4">
              No chat history
            </p>
          ) : (
            <div className="space-y-1">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    "group flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors",
                    currentSessionId === session.id
                      ? "bg-terminal-muted border border-neon-500/30"
                      : "hover:bg-terminal-muted"
                  )}
                  onClick={() => onSelectSession(session.id)}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0 text-gray-500" />
                  <span className="flex-1 text-sm text-gray-300 truncate">
                    {session.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-terminal-border">
        <p className="text-xs text-gray-600 text-center">
          Built with AI SDK + Hono
        </p>
      </div>
    </div>
  );
}

