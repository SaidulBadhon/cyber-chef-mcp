import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_URL = import.meta.env.VITE_API_URL || "";

export async function fetchSessions() {
  const res = await fetch(`${API_URL}/api/sessions`);
  if (!res.ok) throw new Error("Failed to fetch sessions");
  return res.json();
}

export async function fetchSession(id: string) {
  const res = await fetch(`${API_URL}/api/sessions/${id}`);
  if (!res.ok) throw new Error("Failed to fetch session");
  return res.json();
}

export async function deleteSession(id: string) {
  const res = await fetch(`${API_URL}/api/sessions/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete session");
  return res.json();
}

export async function fetchModels() {
  const res = await fetch(`${API_URL}/api/models`);
  if (!res.ok) throw new Error("Failed to fetch models");
  return res.json();
}
