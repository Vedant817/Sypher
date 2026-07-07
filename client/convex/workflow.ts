import { fetchAction } from "convex/nextjs";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { workflow } from "./index";

export const researchWorkflow = workflow.define({
  args: { query: v.string() },
  handler: async (_ctx, { query }): Promise<unknown> => {
    return await fetchAction(api.agent.runResearchAgent, { query });
  },
});
