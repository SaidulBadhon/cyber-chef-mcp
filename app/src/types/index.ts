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

export interface SessionSummary {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

