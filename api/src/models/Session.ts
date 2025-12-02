import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
  role: "user" | "assistant";
  content: string;
  model?: string;
  createdAt: Date;
}

export interface ISession extends Document {
  title: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  model: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const SessionSchema = new Schema<ISession>(
  {
    title: { type: String, default: "New Chat" },
    messages: [MessageSchema],
  },
  {
    timestamps: true,
  }
);

// Auto-generate title from first user message
SessionSchema.pre("save", function (next) {
  if (this.messages.length > 0 && this.title === "New Chat") {
    const firstUserMessage = this.messages.find((m) => m.role === "user");
    if (firstUserMessage) {
      this.title = firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? "..." : "");
    }
  }
  next();
});

export const Session = mongoose.model<ISession>("Session", SessionSchema);

