import { Hono } from "hono";
import { stream } from "hono/streaming";
import { ChatSession } from "../models/ChatSession.js";
import { ChatMessage } from "../models/ChatMessage.js";
import { streamModelResponse } from "../services/ai.js";
import type { ChatStreamRequest } from "../types/index.js";

const chat = new Hono();

chat.post("/stream", async (c) => {
  console.log("Streaming request - start");

  try {
    console.log("Streaming request - 0");
    const body = await c.req.json<ChatStreamRequest>();
    const { sessionId, modelProvider, modelName, messages } = body;

    console.log("Streaming request - 1:", body);

    // Create or get session
    let session;
    if (sessionId) {
      session = await ChatSession.findById(sessionId);
      if (!session) {
        return c.json({ error: "Session not found" }, 404);
      }
    } else {
      // Create new session with first user message as title
      const firstUserMessage = messages.find((m) => m.role === "user");
      const title = firstUserMessage
        ? firstUserMessage.content.slice(0, 50) +
          (firstUserMessage.content.length > 50 ? "..." : "")
        : "New Chat";
      session = await ChatSession.create({ title });
    }

    // Save user message
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage && lastUserMessage.role === "user") {
      await ChatMessage.create({
        sessionId: session._id,
        role: "user",
        content: lastUserMessage.content,
      });
    }

    // Update session timestamp
    session.updatedAt = new Date();
    await session.save();

    // Set headers for streaming
    c.header("X-Session-Id", session._id.toString());
    c.header("Content-Type", "text/event-stream");
    c.header("Cache-Control", "no-cache");
    c.header("Connection", "keep-alive");

    // Stream the response
    return stream(c, async (streamWriter) => {
      let fullResponse = "";

      try {
        const result = await streamModelResponse(
          modelProvider,
          modelName,
          messages
        );

        for await (const chunk of result.textStream) {
          fullResponse += chunk;
          await streamWriter.write(
            `data: ${JSON.stringify({ text: chunk })}\n\n`
          );
        }

        // Save assistant message after streaming completes
        await ChatMessage.create({
          sessionId: session._id,
          role: "assistant",
          content: fullResponse,
          modelProvider,
          modelName,
        });

        await streamWriter.write(
          `data: ${JSON.stringify({
            done: true,
            sessionId: session._id.toString(),
          })}\n\n`
        );
      } catch (error) {
        console.error("Streaming error:", error);
        await streamWriter.write(
          `data: ${JSON.stringify({ error: "Streaming failed" })}\n\n`
        );
      }
    });
  } catch (error) {
    console.error("Chat error:", error);
    return c.json({ error: "Failed to process chat" }, 500);
  }
});

export default chat;
