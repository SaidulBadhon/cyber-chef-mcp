export type ModelProvider = "openai" | "anthropic" | "gemini";

export interface ChatMessage {
  _id?: string;
  role: "user" | "assistant";
  content: string;
  modelProvider?: ModelProvider;
  modelName?: string;
  createdAt?: string;
}

export interface ChatSession {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModelConfig {
  provider: ModelProvider;
  name: string;
  displayName: string;
}

export interface StreamResponse {
  text?: string;
  done?: boolean;
  sessionId?: string;
  error?: string;
}
