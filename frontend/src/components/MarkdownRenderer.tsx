import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
}) => {
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
              <span className="text-2xl">{children}</span>
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-6 mb-3 flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
              <span className="text-lg">{children}</span>
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-4 mb-2 text-base font-medium text-slate-700 dark:text-slate-300">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-3 mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mb-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-1 pl-6">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-1 pl-6">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="text-slate-700 italic dark:text-slate-300">
              {children}
            </em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mb-4 rounded-r-lg border-l-4 border-blue-500 bg-blue-50 py-2 pl-4 dark:bg-blue-900/20">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-900 dark:bg-slate-800 dark:text-slate-100">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="mb-4 overflow-x-auto rounded-lg bg-slate-100 p-4 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="mb-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-slate-50 px-4 py-2 text-left text-xs font-medium tracking-wider text-slate-700 uppercase dark:bg-slate-800 dark:text-slate-300">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-slate-200 px-4 py-2 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          hr: () => (
            <hr className="my-6 border-slate-200 dark:border-slate-700" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
