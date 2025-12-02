import { Hono } from "hono";
import { cors } from "hono/cors";
import mongoose from "mongoose";

import modelsRoute from "./routes/models";
import sessionsRoute from "./routes/sessions";
import chatRoute from "./routes/chat";

const app = new Hono();

// CORS middleware
app.use(
  "*",
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.route("/api/models", modelsRoute);
app.route("/api/sessions", sessionsRoute);
app.route("/api/chat", chatRoute);

// Health check
app.get("/api/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/neon-terminal";

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

startServer();

export default {
  port: PORT,
  fetch: app.fetch,
};

