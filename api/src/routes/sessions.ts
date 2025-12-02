import { Hono } from "hono";
import { Session } from "../models/Session";

const sessions = new Hono();

// Get all sessions
sessions.get("/", async (c) => {
  try {
    const allSessions = await Session.find()
      .select("_id title createdAt updatedAt")
      .sort({ updatedAt: -1 });

    return c.json(
      allSessions.map((s) => ({
        id: s._id.toString(),
        title: s.title,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      }))
    );
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return c.json({ error: "Failed to fetch sessions" }, 500);
  }
});

// Get single session with messages
sessions.get("/:id", async (c) => {
  try {
    const session = await Session.findById(c.req.param("id"));
    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }

    return c.json({
      id: session._id.toString(),
      title: session.title,
      messages: session.messages.map((m) => ({
        id: m._id?.toString(),
        role: m.role,
        content: m.content,
        model: m.model,
        createdAt: m.createdAt,
      })),
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    return c.json({ error: "Failed to fetch session" }, 500);
  }
});

// Delete session
sessions.delete("/:id", async (c) => {
  try {
    await Session.findByIdAndDelete(c.req.param("id"));
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting session:", error);
    return c.json({ error: "Failed to delete session" }, 500);
  }
});

export default sessions;

