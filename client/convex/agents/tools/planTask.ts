import { generateText } from "ai";
import { tool } from "ai";
import { z } from "zod";
import { llmChat } from "../models/modelClient";

export const plannerSchema = z.object({
  subtasks: z.array(z.string().min(1)).min(3).max(5),
});

export type PlannerOutput = z.infer<typeof plannerSchema>;

function extractJson(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const candidate = fenced ?? text;
  const firstBrace = candidate.indexOf("{");
  const lastBrace = candidate.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return candidate.slice(firstBrace, lastBrace + 1);
  }

  const firstBracket = candidate.indexOf("[");
  const lastBracket = candidate.lastIndexOf("]");

  if (firstBracket >= 0 && lastBracket > firstBracket) {
    return JSON.stringify({ subtasks: JSON.parse(candidate.slice(firstBracket, lastBracket + 1)) });
  }

  return candidate;
}

export async function planQuery(topic: string): Promise<PlannerOutput> {
  const response = await generateText({
    model: llmChat,
    messages: [
      {
        role: "system",
        content: "You are a research planner. Return only valid JSON that matches this TypeScript type: { subtasks: string[] }.",
      },
      {
        role: "user",
        content: `Break this research query into 3-5 distinct, source-searchable subtasks: ${topic}`,
      },
    ],
  });

  const parsed = JSON.parse(extractJson(response.text));
  return plannerSchema.parse(Array.isArray(parsed) ? { subtasks: parsed } : parsed);
}

export const planQueryTool = tool({
  description: "Breaks a research query into 3-5 distinct, actionable subtasks.",
  parameters: z.object({
    topic: z.string().min(1, "Topic cannot be empty"),
  }),
  async execute({ topic }) {
    return planQuery(topic);
  },
});
