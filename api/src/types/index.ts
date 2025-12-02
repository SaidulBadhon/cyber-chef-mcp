export type AIProvider = "openai" | "anthropic" | "gemini";

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  createdAt: Date;
}

export interface Session {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatRequest {
  sessionId?: string;
  message: string;
  model: string;
}

export const AVAILABLE_MODELS: AIModel[] = [
  // OpenAI Models
  { id: "gpt-4.1", name: "GPT-4.1", provider: "openai" },
  { id: "gpt-4o", name: "GPT-4o", provider: "openai" },
  // Anthropic Models
  { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4", provider: "anthropic" },
  { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", provider: "anthropic" },
  // Gemini Models
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "gemini" },
  { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash", provider: "gemini" },
];

