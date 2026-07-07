import { tool } from "ai";
import { z } from "zod";

export const searchResultSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  snippet: z.string().min(1),
  publishedDate: z.string().optional(),
});

export const searchResultsSchema = z.array(searchResultSchema);

export type SearchResult = z.infer<typeof searchResultSchema>;

const tavilyResultSchema = z.object({
  title: z.string().optional(),
  url: z.string().url().optional(),
  content: z.string().optional(),
  snippet: z.string().optional(),
  published_date: z.string().optional(),
  publishedDate: z.string().optional(),
});

const tavilyResponseSchema = z.object({
  results: z.array(tavilyResultSchema).default([]),
});

async function searchTavily(topic: string): Promise<SearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is not set");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query: topic,
        max_results: 5,
        search_depth: "basic",
        include_answer: false,
        include_raw_content: false,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Tavily search failed with ${response.status}`);
    }

    const payload = tavilyResponseSchema.parse(await response.json());

    return searchResultsSchema.parse(
      payload.results
        .filter((result) => result.title && result.url)
        .map((result) => ({
          title: result.title ?? "Untitled source",
          url: result.url ?? "",
          snippet: result.content ?? result.snippet ?? "No snippet returned.",
          publishedDate: result.published_date ?? result.publishedDate,
        })),
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchWebResults(topic: string): Promise<SearchResult[]> {
  return searchTavily(topic);
}

export const fetchWebResultsTool = tool({
  description: "Fetches real web search results for a research topic via Tavily.",
  parameters: z.object({
    topic: z.string().min(1, "Topic cannot be empty"),
  }),
  async execute({ topic }) {
    return fetchWebResults(topic);
  },
});
