# Sypher

Sypher is a citation-first deep research agent. It shows the research plan, searches real web sources, and synthesizes evidence-backed reports instead of acting like a generic chatbot.

## Architecture

The current end-to-end slice is intentionally small and demoable:

1. **Next.js API route** accepts a research topic at `POST /api/research`.
2. **Convex action/workflow layer** runs the research workflow.
3. **Planner** uses OpenRouter to produce 3-5 validated subtasks.
4. **Search tool** calls Tavily and validates each result as `{ title, url, snippet, publishedDate? }`.
5. **Synthesizer** uses only returned search results to create a validated final report with citations.
6. **UI** displays the plan, final markdown report, and source links.

## Environment setup

Copy the example file and fill in values:

```bash
cp .env.example .env.local
```

Required variables:

```bash
OPENROUTER_API_KEY=
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
TAVILY_API_KEY=
```

`BRAVE_SEARCH_API_KEY` is listed as a future alternative, but the implemented search provider in this slice is Tavily.

## Run commands

Install dependencies:

```bash
npm install
```

Run the Next.js app:

```bash
npm run dev
```

Run Convex locally or against your configured deployment:

```bash
npx convex dev
```

Build the application:

```bash
npm run build
```

## Demo flow

1. Start Convex and Next.js.
2. Open `http://localhost:3000`.
3. Enter a research question such as “What are the major risks and opportunities for AI agents in financial services?”
4. Sypher plans subtasks, searches real sources with Tavily, synthesizes a report, and returns citations.

## Current limitations

- Research jobs are returned synchronously from the API route; persisted job state and dashboards are still future work.
- Tavily is the only wired search provider.
- There is no production-grade request rate limiting yet.
- Citation verification checks that final citations come from the retrieved URLs, but it does not yet prove every sentence is source-supported.
- Automated tests for planner output, workflow execution, and report generation are still needed.
- The default OpenRouter model is configurable, but demo quality depends on the selected model and provider availability.
