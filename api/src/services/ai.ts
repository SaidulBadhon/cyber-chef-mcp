import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, type CoreMessage } from "ai";
import { AVAILABLE_MODELS, type AIProvider } from "../types";
import { weatherTool, webSearchTool } from "./tools";
import { getAllMCPTools } from "./mcp";

// Initialize providers
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export function getProviderForModel(modelId: string): AIProvider | null {
  const model = AVAILABLE_MODELS.find((m) => m.id === modelId);
  return model?.provider || null;
}

export function getModelInstance(modelId: string) {
  const provider = getProviderForModel(modelId);

  switch (provider) {
    case "openai":
      return openai(modelId);
    case "anthropic":
      return anthropic(modelId);
    case "gemini":
      return google(modelId);
    default:
      throw new Error(`Unknown model: ${modelId}`);
  }
}

export async function streamChatResponse(
  messages: CoreMessage[],
  modelId: string
) {
  const model = getModelInstance(modelId);

  // Get MCP tools from connected servers
  const mcpTools = getAllMCPTools();

  // Combine built-in tools with MCP tools
  const allTools = {
    webSearch: webSearchTool,
    weather: weatherTool,
    ...mcpTools,
  };

  const result = streamText({
    model,
    messages,
    system:
      "You are a helpful AI assistant in a hacker-themed terminal interface called Neon Terminal. Be concise, helpful, and match the cyberpunk aesthetic in your responses when appropriate. You have access to tools like web search and weather lookup - use them when relevant to get current information.",
    tools: allTools,
    maxSteps: 5, // Allow the model to call tools and continue
  });

  return result;
}

export function getAvailableModels() {
  return AVAILABLE_MODELS;
}
