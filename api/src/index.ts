import { Hono } from "hono";
import { cors } from "hono/cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import sessionsRoutes from "./routes/sessions.js";
import { AVAILABLE_MODELS } from "./types/index.js";

const app = new Hono();

// CORS middleware
app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["X-Session-Id"],
  })
);

// Connect to MongoDB
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/neon-terminal";

let isMongoConnected = false;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    isMongoConnected = true;
  })
  .catch((err) => {
    console.error(
      "⚠️ MongoDB connection error - running without database:",
      err.message
    );
    console.log(
      "💡 To use chat history, ensure MongoDB is running or provide MONGODB_URI"
    );
  });

// Health check
app.get("/", (c) => {
  return c.json({ status: "ok", message: "Neon Terminal API" });
});

// Get available models
app.get("/api/models", (c) => {
  return c.json(AVAILABLE_MODELS);
});

// Routes
app.route("/api/chat", chatRoutes);
app.route("/api/sessions", sessionsRoutes);

const port = parseInt(process.env.PORT || "3001");

console.log(`�� Server starting on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
