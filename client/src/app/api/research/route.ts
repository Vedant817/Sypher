import { NextRequest, NextResponse } from "next/server";
import { mutation } from "@/../convex/_generated/server";
import { v } from "convex/values";
import { workflow } from "@/../convex/index";
import { internal } from "@/../convex/_generated/api";

interface ResearchRouteError extends Error {
    statusCode?: number;
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const query = body.topic;

    if (!query) {
        return NextResponse.json({ error: "No topic provided" }, { status: 400 });
    }

    try {
        const startResearchWorkflowId = mutation({
            args: { query: v.string() },
            handler: async (ctx, { query }) => {
                const workflowId = await workflow.start(ctx, internal.workflow.researchWorkflow, { query });
                return workflowId;
            },
        });

        return NextResponse.json({ workflowId: startResearchWorkflowId });
    } catch (error: unknown) {
        console.error("Error in research agent:", error);

        const routeError = error instanceof Error ? error as ResearchRouteError : undefined;
        const errorMessage = routeError?.message || "Failed to decompose query";
        const statusCode = routeError?.statusCode || 500;

        return NextResponse.json({
            error: errorMessage,
            details: routeError?.name || "Unknown error type"
        }, { status: statusCode });
    }
}
