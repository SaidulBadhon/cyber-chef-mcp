import { Hono } from "hono";
import { stream } from "hono/streaming";
import { Session } from "../models/Session";
import { streamChatResponse } from "../services/ai";
import type { CoreMessage } from "ai";

const chat = new Hono();

chat.post("/stream", async (c) => {
  const body = await c.req.json();
  const { sessionId, message, model } = body;

  if (!message || !model) {
    return c.json({ error: "Message and model are required" }, 400);
  }

  try {
    // Get or create session
    let session;
    if (sessionId) {
      session = await Session.findById(sessionId);
      if (!session) {
        return c.json({ error: "Session not found" }, 404);
      }
    } else {
      session = new Session({ messages: [] });
    }

    // Add user message to session
    session.messages.push({
      role: "user",
      content: message,
      createdAt: new Date(),
    });

    // Prepare messages for AI
    const aiMessages: CoreMessage[] = session.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Get streaming response
    const result = await streamChatResponse(aiMessages, model);

    // Stream the response
    return stream(c, async (streamWriter) => {
      let fullContent = "";

      // Send session ID first
      await streamWriter.write(
        `data: ${JSON.stringify({
          type: "session",
          sessionId: session._id.toString(),
        })}\n\n`
      );

      // Use fullStream to capture tool calls and text
      for await (const part of result.fullStream) {
        switch (part.type) {
          case "tool-call":
            // Send tool call info to the client
            await streamWriter.write(
              `data: ${JSON.stringify({
                type: "tool-call",
                toolName: part.toolName,
                args: part.args,
              })}\n\n`
            );
            break;

          case "tool-result":
            // Send tool result to the client
            await streamWriter.write(
              `data: ${JSON.stringify({
                type: "tool-result",
                toolName: part.toolName,
                result: part.result,
              })}\n\n`
            );
            break;

          case "text-delta":
            // Stream text chunks
            fullContent += part.textDelta;
            await streamWriter.write(
              `data: ${JSON.stringify({
                type: "text",
                content: part.textDelta,
              })}\n\n`
            );
            break;
        }
      }

      // Save assistant message to session
      session.messages.push({
        role: "assistant",
        content: fullContent,
        model: model,
        createdAt: new Date(),
      });

      await session.save();

      // Send done signal
      await streamWriter.write(
        `data: ${JSON.stringify({
          type: "done",
          sessionId: session._id.toString(),
        })}\n\n`
      );
    });
  } catch (error) {
    console.error("Error in chat stream:", error);
    return c.json({ error: "Failed to process chat" }, 500);
  }
});

export default chat;
