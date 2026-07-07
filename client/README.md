# MediClarity

MediClarity is a privacy-first medical report explainer concept built on a Next.js client and Convex agent workflow. The product goal is to turn lab reports and medical questions into patient-friendly summaries with source-aware explanations, possible risk flags, and suggested follow-up questions for a clinician.

> **Medical disclaimer:** AI output is educational only and not a diagnosis. MediClarity is not a medical device, does not replace licensed clinical judgment, and should not be used for emergency decisions.

## Current status

This repository is an early `0.1.x` prototype. It currently includes:

- A Next.js App Router interface for submitting a topic or question.
- A `/api/research` route that starts a Convex workflow.
- A Convex agent configured to plan, research, summarize, query memory, and generate reports.
- An OpenRouter-backed language model client.
- Markdown rendering for generated report output.

The current implementation does **not** yet provide production-grade medical report ingestion, verified clinical citation retrieval, file upload storage, PHI handling controls, authentication, or compliance certification.

## Planned features

- Medical report upload and parsing for common lab report formats.
- Patient-friendly result summaries with cited references.
- Risk flag explanations and “what to ask your doctor” suggestions.
- Authenticated user accounts and report history.
- Optional vector search for source snippets and prior report context.
- Environment validation for all configured providers.
- Test fixtures for report parsing, prompt-injection resistance, and safety disclaimers.
- Threat model documentation for PHI/PII, uploads, third-party AI providers, and data retention.

## Compliance and privacy posture

MediClarity is designed with privacy-first principles, but compliance is **not certified yet**. Do not describe this app as HIPAA compliant, SOC 2 certified, ISO 27001 certified, clinically validated, or accuracy-guaranteed unless those claims are backed by completed legal, security, audit, and validation work.

During development and demos:

- Do not upload real medical reports, PHI, or PII.
- Use synthetic or fully de-identified examples only.
- Treat all model output as unverified educational content.
- Review any third-party provider terms before sending sensitive data.

## Environment variables

Copy `.env.example` to `.env.local` and fill only the providers you are actively using.

| Variable | Purpose | Required today? |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | Current LLM provider used by `convex/agents/models/modelClient.ts`. | Yes for current agent calls |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Planned Clerk browser auth key. | Planned |
| `CLERK_SECRET_KEY` | Planned Clerk server auth key. | Planned |
| `GOOGLE_API_KEY` | Planned Google AI/Gemini access. | Planned |
| `GEMINI_API_KEY` | Planned Gemini-specific key alias. | Planned |
| `PINECONE_API_KEY` | Planned vector database access. | Planned |
| `PINECONE_INDEX` | Planned Pinecone index name. | Planned |
| `MONGODB_URI` | Planned MongoDB connection string. | Planned |
| `CLOUDINARY_CLOUD_NAME` | Planned Cloudinary upload account. | Planned |
| `CLOUDINARY_API_KEY` | Planned Cloudinary API key. | Planned |
| `CLOUDINARY_API_SECRET` | Planned Cloudinary API secret. | Planned |

## Local setup

```bash
cd client
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

For Convex-backed workflow development, configure Convex according to the Convex project setup and run the relevant Convex dev command for your deployment. This prototype contains Convex functions under `client/convex` but does not yet document a production deployment process.

## Architecture

```text
src/app/page.tsx
  └─ posts a question to src/app/api/research/route.ts
       └─ starts convex/workflow.ts
            └─ uses convex/agents/mainAgent.ts
                 ├─ planTask tool
                 ├─ fetchWebResults tool
                 ├─ summarizeDoc tool
                 ├─ queryMemory tool
                 └─ generateReport tool
```

Key directories:

- `src/app` — Next.js routes, layout, and homepage.
- `src/components` — UI components for progress and report display.
- `src/lib` — shared UI and stage helpers.
- `convex` — Convex workflow and agent tools.

## AI flow

1. The user submits a medical question or synthetic report summary.
2. The API route validates that a topic was provided.
3. The Convex workflow starts a research agent run.
4. The agent plans subtasks, gathers/summarizes information, and generates a report.
5. The UI renders Markdown output with a persistent educational-use disclaimer.

Future medical-report-specific work should add structured extraction, source citation checks, clinician escalation language, and tests against unsafe diagnostic phrasing.

## Demo guidance

Use synthetic examples such as:

- “Explain what a high LDL cholesterol value can mean in general terms.”
- “Summarize these fake CBC values and list questions to ask a doctor: hemoglobin 11.2 g/dL, WBC 7.0 x10^9/L, platelets 250 x10^9/L.”

Do not demo with real patient documents.

## Test strategy

Current checks are limited to lint/build-style project commands. Before production use, add automated tests for:

- Report parsing fixtures using synthetic PDFs/text.
- Citation presence and source attribution.
- Prompt injection attempts embedded in uploaded reports.
- PHI/PII redaction and retention behavior.
- Safety language for urgent symptoms and diagnostic uncertainty.

## Known limitations

- No certified HIPAA, SOC 2, or ISO 27001 controls are implemented or audited.
- No authentication or authorization flow is wired into the current UI.
- No validated medical accuracy benchmark exists.
- No upload pipeline or malware scanning exists.
- The current web-results tool asks an LLM to produce search-like JSON and is not a verified search integration.
- The current API route starts a workflow but does not yet stream or poll completed workflow results.
