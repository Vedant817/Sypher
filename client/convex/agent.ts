import { action } from "./_generated/server";
import { v } from "convex/values";
import { fetchWebResults } from "./agents/tools/fetchWebResults";
import { generateReport } from "./agents/tools/generateReport";
import { planQuery } from "./agents/tools/planTask";

export const runResearchAgent = action({
  args: { query: v.string() },
  handler: async (_ctx, { query }) => {
    const plan = await planQuery(query);
    const findings = await Promise.all(
      plan.subtasks.map(async (subtask) => ({
        subtask,
        results: await fetchWebResults(`${query}: ${subtask}`),
      })),
    );
    const report = await generateReport({ query, findings });

    return {
      query,
      plan: plan.subtasks,
      findings,
      report,
      citations: report.citations,
    };
  },
});

export const runSubTaskAgent = action({
  args: { query: v.string() },
  handler: async (_ctx, { query }) => {
    const plan = await planQuery(query);
    return { subtasks: plan.subtasks };
  },
});

export const searchWebAgent = action({
  args: {
    subQueries: v.array(v.string()),
  },
  handler: async (_ctx, { subQueries }) => {
    const results = await Promise.all(
      subQueries.map(async (subQuery) => ({
        subtask: subQuery,
        results: await fetchWebResults(subQuery),
      })),
    );

    return { results };
  },
});
