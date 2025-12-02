import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { ModelProvider, ChatMessageInput } from "../types/index.js";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export function getModel(provider: ModelProvider, modelName: string) {
  switch (provider) {
    case "openai":
      return openai(modelName);
    case "anthropic":
      return anthropic(modelName);
    case "gemini":
      return google(modelName);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export async function streamModelResponse(
  provider: ModelProvider,
  modelName: string,
  messages: ChatMessageInput[]
) {
  const model = getModel(provider, modelName);

  const result = streamText({
    model,
    messages: messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  });

  return result;
}
