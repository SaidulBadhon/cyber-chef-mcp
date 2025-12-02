import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getProviderColor(provider: string): string {
  switch (provider) {
    case "openai":
      return "text-emerald-400";
    case "anthropic":
      return "text-orange-400";
    case "gemini":
      return "text-blue-400";
    default:
      return "text-neon-500";
  }
}

export function getProviderIcon(provider: string): string {
  switch (provider) {
    case "openai":
      return "🤖";
    case "anthropic":
      return "🧠";
    case "gemini":
      return "💎";
    default:
      return "⚡";
  }
}

