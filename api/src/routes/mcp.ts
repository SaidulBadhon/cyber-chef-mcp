import { Hono } from "hono";
import {
  getMCPClientStatus,
  initializeMCPClient,
  closeMCPClient,
  type MCPServerConfig,
} from "../services/mcp";

const mcp = new Hono();

// Get status of all connected MCP servers
mcp.get("/status", (c) => {
  const status = getMCPClientStatus();
  return c.json({
    connectedServers: status.length,
    servers: status,
  });
});

// Connect to a new MCP server dynamically
mcp.post("/connect", async (c) => {
  try {
    const config = (await c.req.json()) as MCPServerConfig;

    if (!config.name || !config.command) {
      return c.json({ error: "name and command are required" }, 400);
    }

    const instance = await initializeMCPClient({ ...config, enabled: true });

    if (instance) {
      return c.json({
        success: true,
        name: instance.name,
        tools: Object.keys(instance.tools),
      });
    } else {
      return c.json({ error: "Failed to connect to MCP server" }, 500);
    }
  } catch (error) {
    console.error("Error connecting to MCP server:", error);
    return c.json({ error: "Failed to connect to MCP server" }, 500);
  }
});

// Disconnect from an MCP server
mcp.post("/disconnect/:name", async (c) => {
  const name = c.req.param("name");
  const closed = await closeMCPClient(name);

  if (closed) {
    return c.json({ success: true, message: `Disconnected from ${name}` });
  } else {
    return c.json({ error: `Server "${name}" not found` }, 404);
  }
});

export default mcp;

