import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
  return (
    <div
      className={cn(
        "prose prose-gray max-w-none",
        // Headings
        "prose-headings:text-markdown-headings prose-headings:font-semibold",
        "prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-6",
        "prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-5",
        "prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4",
        "prose-h4:text-lg prose-h4:mb-2 prose-h4:mt-3",
        // Text elements
        "prose-p:text-markdown-text prose-p:leading-relaxed prose-p:mb-4",
        "prose-strong:text-markdown-headings prose-strong:font-semibold",
        "prose-em:text-markdown-text prose-em:italic",
        // Lists
        "prose-ul:text-markdown-text prose-ol:text-markdown-text",
        "prose-li:text-markdown-text prose-li:mb-1",
        // Code
        "prose-code:text-markdown-code prose-code:bg-markdown-code-bg prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono",
        "prose-pre:bg-markdown-code-bg prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4",
        "prose-pre:code:bg-transparent prose-pre:code:p-0",
        // Blockquotes
        "prose-blockquote:text-markdown-blockquote prose-blockquote:border-l-4 prose-blockquote:border-markdown-blockquote-border prose-blockquote:pl-4 prose-blockquote:italic",
        // Tables
        "prose-table:text-markdown-text prose-table:border-collapse",
        "prose-thead:bg-markdown-table-header",
        "prose-th:text-markdown-headings prose-th:font-semibold prose-th:p-2 prose-th:border prose-th:border-markdown-table-border",
        "prose-td:p-2 prose-td:border prose-td:border-markdown-table-border",
        // Links
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        // Horizontal rules
        "prose-hr:border-border prose-hr:my-6",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom table wrapper for better responsive handling
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full">{children}</table>
            </div>
          ),
          // Custom code block handling
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
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
