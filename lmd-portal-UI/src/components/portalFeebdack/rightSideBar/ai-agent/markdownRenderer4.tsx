// components/MarkdownRenderer.tsx
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // GitHub style code highlighting
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

// Type definition for code component props
interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const components: Components = {
    code({ inline, className, children, ...props }: CodeProps) {
      return !inline ? (
        <pre className={`${className || ""} p-3 rounded bg-gray-100 overflow-x-auto`}>
          <code {...props}>{children}</code>
        </pre>
      ) : (
        <code className="bg-gray-100 rounded px-1 py-0.5" {...props}>
          {children}
        </code>
      );
    },
    a({ href, children, ...props }) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
          {...props}
        >
          {children}
        </a>
      );
    },
    table({ children }) {
      return (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300">
            {children}
          </table>
        </div>
      );
    },
    th({ children }) {
      return <th className="border border-gray-300 px-3 py-2 bg-gray-100">{children}</th>;
    },
    td({ children }) {
      return <td className="border border-gray-300 px-3 py-2">{children}</td>;
    },
  };

  return (
    <div className="prose prose-slate max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;