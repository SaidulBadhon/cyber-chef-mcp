import type { MCPServerConfig } from "../services/mcp";

/**
 * MCP Server Configuration
 *
 * Add your MCP servers here. Each server will be connected on startup
 * and its tools will be available to the AI.
 *
 * Popular MCP servers:
 * - @modelcontextprotocol/server-filesystem - File system operations
 * - @modelcontextprotocol/server-github - GitHub API
 * - @modelcontextprotocol/server-brave-search - Brave Search API
 * - @modelcontextprotocol/server-fetch - HTTP fetch operations
 * - @modelcontextprotocol/server-memory - Persistent memory
 * - @modelcontextprotocol/server-puppeteer - Browser automation
 * - @modelcontextprotocol/server-slack - Slack integration
 */

export const mcpServersConfig: MCPServerConfig[] = [
  // Filesystem - Read/write/search files
  {
    name: "filesystem",
    command: "npx",
    args: [
      "-y",
      "@modelcontextprotocol/server-filesystem",
      "/Users/saidulbadhon", // Change this to your preferred directory
    ],
    enabled: true,
  },

  // Memory - Persistent knowledge graph
  {
    name: "memory",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-memory"],
    enabled: true,
  },

  // Sequential Thinking - Complex reasoning
  {
    name: "sequential-thinking",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
    enabled: true,
  },
];
