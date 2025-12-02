import mongoose, { Schema, Document } from "mongoose";
import type { ModelProvider } from "../types/index.js";

export interface IChatMessage extends Document {
  _id: mongoose.Types.ObjectId;
  sessionId: mongoose.Types.ObjectId;
  role: "user" | "assistant";
  content: string;
  modelProvider?: ModelProvider;
  modelName?: string;
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "ChatSession",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    modelProvider: {
      type: String,
      enum: ["openai", "anthropic", "gemini"],
    },
    modelName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const ChatMessage = mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
