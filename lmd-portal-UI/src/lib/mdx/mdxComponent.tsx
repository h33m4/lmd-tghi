import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headers
    h1: ({ children }) => (
      <h1 className="mt-6 mb-4 pb-2 text-3xl font-semibold border-b border-gray-200">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-6 mb-4 pb-2 text-2xl font-semibold border-b border-gray-200">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-4 mb-3 text-xl font-semibold">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-4 mb-2 text-lg font-semibold">{children}</h4>
    ),

    // Paragraphs and text
    p: ({ children }) => (
      <p className="mb-4 leading-7 text-gray-800">{children}</p>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,

    // Lists
    ul: ({ children }) => (
      <ul className="mb-4 pl-8 list-disc space-y-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 pl-8 list-decimal space-y-2">{children}</ol>
    ),
    li: ({ children }) => <li className="leading-7">{children}</li>,

    // Links and references
    a: ({ children, href }) => (
      <a
        href={href}
        className="text-blue-600 hover:underline"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),

    // Code blocks
    code: ({ children }) => (
      <code className="px-1.5 py-0.5 mx-0.5 rounded-md bg-gray-100 text-sm font-mono text-gray-800">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="mb-4 p-4 rounded-lg bg-gray-100 overflow-x-auto">
        {children}
      </pre>
    ),

    // Blockquotes
    blockquote: ({ children }) => (
      <blockquote className="mb-4 pl-4 border-l-4 border-gray-200 text-gray-700 italic">
        {children}
      </blockquote>
    ),

    // Tables
    table: ({ children }) => (
      <div className="mb-4 overflow-x-auto">
        <table className="min-w-full border-collapse">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
    tbody: ({ children }) => (
      <tbody className="divide-y divide-gray-200">{children}</tbody>
    ),
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => (
      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-6 py-4 text-sm text-gray-500">{children}</td>
    ),

    // Horizontal rule
    hr: () => <hr className="my-8 border-t border-gray-200" />,

    ...components,
  };
}
