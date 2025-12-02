import { tool } from "ai";
import { z } from "zod";

export const webSearchTool = tool({
  description:
    "Search the web for current information. Use this for questions about recent events, facts, or anything that requires up-to-date information.",
  parameters: z.object({
    query: z.string().describe("The search query"),
    count: z
      .number()
      .optional()
      .default(5)
      .describe("Number of results to return (max 10)"),
  }),
  execute: async ({ query, count }) => {
    try {
      const apiKey = process.env.BRAVE_SEARCH_API_KEY;

      if (!apiKey) {
        return {
          error:
            "Web search is not configured. Please set BRAVE_SEARCH_API_KEY environment variable.",
        };
      }

      const response = await fetch(
        `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(
          query
        )}&count=${Math.min(count, 10)}`,
        {
          headers: {
            Accept: "application/json",
            "X-Subscription-Token": apiKey,
          },
        }
      );

      if (!response.ok) {
        return { error: `Search failed with status ${response.status}` };
      }

      const data = await response.json();

      const results = data.web?.results?.map(
        (result: {
          title: string;
          url: string;
          description: string;
          age?: string;
        }) => ({
          title: result.title,
          url: result.url,
          description: result.description,
          age: result.age || null,
        })
      );

      if (!results || results.length === 0) {
        return { message: "No results found for this query", query };
      }

      return {
        query,
        resultCount: results.length,
        results,
      };
    } catch (error) {
      return { error: "Failed to perform web search" };
    }
  },
});

