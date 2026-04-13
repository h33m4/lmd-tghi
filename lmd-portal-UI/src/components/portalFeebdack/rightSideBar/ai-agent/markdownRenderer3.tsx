import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  // Validate content
  if (!content || typeof content !== "string") {
    return <div className="text-gray-500">No content available</div>;
  }

  return (
    <div className={`prose prose-sm max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headers
          h1: ({ node, ...props }) => (
            <h1
              className="text-xl font-bold mt-4 mb-2 text-gray-800 dark:text-white"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-lg font-bold mt-3 mb-2 text-gray-800 dark:text-white"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-base font-bold mt-3 mb-1 text-gray-800 dark:text-white"
              {...props}
            />
          ),

          // Paragraphs
          p: ({ node, ...props }) => (
            <p
              className="mb-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
              {...props}
            />
          ),

          // Lists
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc list-inside mb-2 space-y-0.5 text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal list-inside mb-2 space-y-0.5 text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li className="text-sm ml-2" {...props} />
          ),

          // Text formatting
          strong: ({ node, ...props }) => (
            <strong
              className="font-semibold text-gray-800 dark:text-white"
              {...props}
            />
          ),
          em: ({ node, ...props }) => <em className="italic" {...props} />,

          // Code - Fixed TypeScript issue
          // code: ({ node, inline, className, children, ...props }: any) => {
          //   if (inline) {
          //     return (
          //       <code
          //         className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs font-mono"
          //         {...props}
          //       >
          //         {children}
          //       </code>
          //     );
          //   }
          //   return (
          //     <code
          //       className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono overflow-x-auto"
          //       {...props}
          //     >
          //       {children}
          //     </code>
          //   );
          // },

          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code
                className="bg-markdown-code-bg text-markdown-code px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Tables
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-3">
              <table
                className="min-w-full border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-gray-50 dark:bg-gray-700" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody
              className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700"
              {...props}
            />
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 border-r border-gray-200 dark:border-gray-600 last:border-r-0"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="px-3 py-2 text-gray-600 dark:text-gray-300 border-r border-gray-100 dark:border-gray-700 last:border-r-0"
              {...props}
            />
          ),

          // Links
          a: ({ node, ...props }) => (
            <a
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),

          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 my-2"
              {...props}
            />
          ),

          // Horizontal rules
          hr: ({ node, ...props }) => (
            <hr
              className="border-gray-300 dark:border-gray-600 my-4"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export type { MarkdownRendererProps };
