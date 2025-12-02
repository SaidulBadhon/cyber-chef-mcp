import { useState, useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, onStop, isLoading, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 p-4 border-t border-terminal-border bg-terminal-bg"
    >
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Select a model to start..." : "Enter command..."}
          disabled={disabled || isLoading}
          rows={1}
          className="w-full resize-none bg-terminal-surface border border-terminal-border rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-500 focus:border-transparent disabled:opacity-50"
        />
        <span className="absolute left-4 top-3 text-neon-500 opacity-50 pointer-events-none">
          {">"}
        </span>
        <style>{`
          textarea {
            text-indent: 1rem;
          }
        `}</style>
      </div>
      {isLoading ? (
        <Button
          type="button"
          onClick={onStop}
          variant="destructive"
          size="icon"
          className="h-12 w-12"
        >
          <Square className="h-5 w-5" />
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={!input.trim() || disabled}
          size="icon"
          className="h-12 w-12"
        >
          <Send className="h-5 w-5" />
        </Button>
      )}
    </form>
  );
}

