import ReactMarkdown from "react-markdown";
import { ScrollArea } from "./ui/scroll-area";

export type ResearchContent = {
  plan?: string[];
  report?: {
    title: string;
    summary: string;
    report: string;
    citations: Array<{ title: string; url: string }>;
  };
  citations?: Array<{ title: string; url: string }>;
  message?: string;
};

export default function ResearchResult({ content }: { content: ResearchContent }) {
  if (!content) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="text-center py-8 text-gray-400">
          <h3 className="text-lg font-medium mb-2 text-gray-200">No Research Results Yet</h3>
          <p className="text-gray-400">Enter a topic and start research, or select a previous report.</p>
        </div>
      </div>
    );
  }

  const report = content.report;
  const messageContent = report?.report ?? content.message ?? "";
  const citations = content.citations ?? report?.citations ?? [];

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-2 text-gray-200">
        {report?.title ?? "Research Results"}
      </h2>
      {report?.summary && <p className="mb-4 text-sm text-gray-300">{report.summary}</p>}

      {content.plan && (
        <div className="mb-6 rounded-md border border-gray-700 p-4">
          <h3 className="mb-2 font-semibold text-indigo-300">Research Plan</h3>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-gray-300">
            {content.plan.map((subtask) => (
              <li key={subtask}>{subtask}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="prose prose-invert max-w-none text-gray-100">
        <ScrollArea className="h-[400px]">
          <ReactMarkdown>{messageContent}</ReactMarkdown>
        </ScrollArea>
      </div>

      {citations.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 font-semibold text-indigo-300">Citations</h3>
          <ul className="space-y-2 text-sm">
            {citations.map((citation) => (
              <li key={citation.url}>
                <a className="text-indigo-300 underline" href={citation.url} rel="noreferrer" target="_blank">
                  {citation.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
