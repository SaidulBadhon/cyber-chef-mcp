import { Hono } from "hono";
import { ChatSession } from "../models/ChatSession.js";
import { ChatMessage } from "../models/ChatMessage.js";

const sessions = new Hono();

// Get all sessions
sessions.get("/", async (c) => {
  try {
    const allSessions = await ChatSession.find()
      .sort({ updatedAt: -1 })
      .lean();
    return c.json(allSessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return c.json({ error: "Failed to fetch sessions" }, 500);
  }
});

// Get single session with messages
sessions.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const session = await ChatSession.findById(id).lean();
    
    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }
    
    const messages = await ChatMessage.find({ sessionId: id })
      .sort({ createdAt: 1 })
      .lean();
    
    return c.json({ session, messages });
  } catch (error) {
    console.error("Error fetching session:", error);
    return c.json({ error: "Failed to fetch session" }, 500);
  }
});

// Delete a session
sessions.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    await ChatMessage.deleteMany({ sessionId: id });
    await ChatSession.findByIdAndDelete(id);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting session:", error);
    return c.json({ error: "Failed to delete session" }, 500);
  }
});

export default sessions;
