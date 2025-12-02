import { experimental_createMCPClient as createMCPClient } from "ai";
import { Experimental_StdioMCPTransport as StdioMCPTransport } from "ai/mcp-stdio";

export interface MCPServerConfig {
  name: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
  enabled?: boolean;
}

interface MCPClientInstance {
  name: string;
  client: Awaited<ReturnType<typeof createMCPClient>>;
  tools: Record<string, any>;
}

// Store active MCP clients
const mcpClients: Map<string, MCPClientInstance> = new Map();

// Default MCP server configurations
const defaultServers: MCPServerConfig[] = [
  // Filesystem server - uncomment and set your path
  // {
  //   name: "filesystem",
  //   command: "npx",
  //   args: ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"],
  //   enabled: false,
  // },
  // Brave Search - requires BRAVE_API_KEY env var
  // {
  //   name: "brave-search",
  //   command: "npx",
  //   args: ["-y", "@modelcontextprotocol/server-brave-search"],
  //   env: { BRAVE_API_KEY: process.env.BRAVE_API_KEY || "" },
  //   enabled: false,
  // },
  // Fetch server - for HTTP requests
  // {
  //   name: "fetch",
  //   command: "npx",
  //   args: ["-y", "@modelcontextprotocol/server-fetch"],
  //   enabled: false,
  // },
];

export async function initializeMCPClient(
  config: MCPServerConfig
): Promise<MCPClientInstance | null> {
  if (config.enabled === false) {
    console.log(`MCP server "${config.name}" is disabled, skipping...`);
    return null;
  }

  try {
    console.log(`Initializing MCP server: ${config.name}...`);

    const transport = new StdioMCPTransport({
      command: config.command,
      args: config.args,
      env: config.env,
    });

    const client = await createMCPClient({
      transport,
    });

    const tools = await client.tools();

    const instance: MCPClientInstance = {
      name: config.name,
      client,
      tools,
    };

    mcpClients.set(config.name, instance);
    console.log(
      `MCP server "${config.name}" initialized with tools:`,
      Object.keys(tools)
    );

    return instance;
  } catch (error) {
    console.error(`Failed to initialize MCP server "${config.name}":`, error);
    return null;
  }
}

export async function initializeAllMCPServers(
  configs: MCPServerConfig[] = defaultServers
): Promise<void> {
  const enabledServers = configs.filter((c) => c.enabled !== false);

  if (enabledServers.length === 0) {
    console.log("No MCP servers enabled");
    return;
  }

  console.log(`Initializing ${enabledServers.length} MCP server(s)...`);

  await Promise.all(enabledServers.map((config) => initializeMCPClient(config)));
}

export function getAllMCPTools(): Record<string, any> {
  const allTools: Record<string, any> = {};

  for (const [serverName, instance] of mcpClients) {
    for (const [toolName, tool] of Object.entries(instance.tools)) {
      // Prefix tool name with server name to avoid conflicts
      allTools[`${serverName}_${toolName}`] = tool;
    }
  }

  return allTools;
}

export function getMCPClientStatus(): Array<{
  name: string;
  toolCount: number;
  tools: string[];
}> {
  return Array.from(mcpClients.entries()).map(([name, instance]) => ({
    name,
    toolCount: Object.keys(instance.tools).length,
    tools: Object.keys(instance.tools),
  }));
}

export async function closeMCPClient(name: string): Promise<boolean> {
  const instance = mcpClients.get(name);
  if (instance) {
    await instance.client.close();
    mcpClients.delete(name);
    console.log(`MCP server "${name}" closed`);
    return true;
  }
  return false;
}

export async function closeAllMCPClients(): Promise<void> {
  for (const [name, instance] of mcpClients) {
    await instance.client.close();
    console.log(`MCP server "${name}" closed`);
  }
  mcpClients.clear();
}

export { defaultServers };

