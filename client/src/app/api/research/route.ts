import { api } from "@/../convex/_generated/api";
import { fetchAction } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const query = body.topic;

  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "No topic provided" }, { status: 400 });
  }

  try {
    const result = await fetchAction(api.agent.runResearchAgent, { query });
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Error in research agent:", error);
    const message = error instanceof Error ? error.message : "Failed to run research";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
