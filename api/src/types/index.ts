export type ModelProvider = "openai" | "anthropic" | "gemini";

export interface ChatMessageInput {
  role: "user" | "assistant";
  content: string;
}

export interface ChatStreamRequest {
  sessionId?: string;
  modelProvider: ModelProvider;
  modelName: string;
  messages: ChatMessageInput[];
}

export interface SessionResponse {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageResponse {
  _id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  modelProvider?: ModelProvider;
  modelName?: string;
  createdAt: string;
}

export interface ModelConfig {
  provider: ModelProvider;
  name: string;
  displayName: string;
}

export const AVAILABLE_MODELS: ModelConfig[] = [
  // { provider: "openai", name: "gpt-4.1", displayName: "OpenAI - GPT-4.1" },
  { provider: "openai", name: "o4-mini", displayName: "OpenAI - o4-mini" },
  { provider: "openai", name: "gpt-4o", displayName: "OpenAI - GPT-4o" },
  {
    provider: "anthropic",
    name: "claude-sonnet-4-20250514",
    displayName: "Anthropic - Claude Sonnet 4",
  },
  {
    provider: "anthropic",
    name: "claude-3-5-sonnet-20241022",
    displayName: "Anthropic - Claude 3.5 Sonnet",
  },
  {
    provider: "gemini",
    name: "gemini-1.5-pro",
    displayName: "Gemini - 1.5 Pro",
  },
  {
    provider: "gemini",
    name: "gemini-2.0-flash",
    displayName: "Gemini - 2.0 Flash",
  },
];
