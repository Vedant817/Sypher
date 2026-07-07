import { generateText } from "ai";
import { tool } from "ai";
import { z } from "zod";
import { llmChat } from "../models/modelClient";
import { searchResultsSchema } from "./fetchWebResults";

export const citationSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
});

export const finalReportSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  report: z.string().min(1),
  citations: z.array(citationSchema).min(1),
});

export type FinalReport = z.infer<typeof finalReportSchema>;

function extractJson(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const candidate = fenced ?? text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  return start >= 0 && end > start ? candidate.slice(start, end + 1) : candidate;
}

export async function generateReport(input: {
  query: string;
  findings: Array<{ subtask: string; results: z.infer<typeof searchResultsSchema> }>;
}): Promise<FinalReport> {
  const response = await generateText({
    model: llmChat,
    messages: [
      {
        role: "system",
        content:
          "You synthesize citation-first research reports. Use only supplied sources. Return valid JSON matching { title, summary, report, citations: [{ title, url }] }.",
      },
      {
        role: "user",
        content: JSON.stringify(input, null, 2),
      },
    ],
  });

  const report = finalReportSchema.parse(JSON.parse(extractJson(response.text)));
  const sourceUrls = new Set(input.findings.flatMap((finding) => finding.results.map((result) => result.url)));

  return {
    ...report,
    citations: report.citations.filter((citation) => sourceUrls.has(citation.url)),
  };
}

export const generateReportTool = tool({
  description: "Generates a final evidence-backed report from search findings.",
  parameters: z.object({
    query: z.string(),
    findings: z.array(
      z.object({
        subtask: z.string(),
        results: searchResultsSchema,
      }),
    ),
  }),
  async execute(input) {
    return generateReport(input);
  },
});
