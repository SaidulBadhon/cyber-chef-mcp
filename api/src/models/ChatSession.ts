import mongoose, { Schema, Document } from "mongoose";

export interface IChatSession extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSessionSchema = new Schema<IChatSession>(
  {
    title: {
      type: String,
      required: true,
      default: "New Chat",
    },
  },
  {
    timestamps: true,
  }
);

export const ChatSession = mongoose.model<IChatSession>("ChatSession", ChatSessionSchema);
