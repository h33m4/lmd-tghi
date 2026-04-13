import React from "react";
import { getMarkdownContent } from "@/lib/mdx/markdown";

interface MDXContentProps {
  fileName: string;
  className?: string;
  showHeader?: boolean;
}

const MDXContent = async ({
  fileName,
  className = "max-w-4xl mx-auto px-4 py-8",
  showHeader = true,
}: MDXContentProps) => {
  try {
    const { content, frontmatter } = await getMarkdownContent(fileName);

    return (
      <div className={className}>
        <article className="rounded-lg">
          {/* GitHub-style header */}
          {showHeader && (frontmatter.title || frontmatter.lastUpdated) && (
            <header className="mb-8 pb-4 border-b border-border">
              {frontmatter.title && (
                <h1 className="text-3xl font-semibold ">{frontmatter.title}</h1>
              )}
              {frontmatter.lastUpdated && (
                <div className="mt-2 flex items-center text-lg ">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Last updated:{" "}
                  {new Date(frontmatter.lastUpdated).toLocaleDateString()}
                </div>
              )}
            </header>
          )}

          {/* GitHub-style markdown content */}
          <div className="markdown-content">
            <div
              className="
              prose
              max-w-none
              prose-headings:border-b
              prose-headings:border-gray-200
              prose-headings:pb-2
              prose-headings:font-semibold
              prose-headings:scroll-mt-24
              prose-h1:text-3xl
              prose-h2:text-2xl
              prose-h3:text-xl
              prose-h4:text-lg
              prose-p:text-gray-800 dark:prose-p:text-gray-300
              prose-p:leading-7
              prose-a:text-blue-600
              prose-a:no-underline
              prose-a:font-normal
              prose-a:hover:underline
              prose-blockquote:border-l-4
              prose-blockquote:border-gray-200
              prose-blockquote:pl-4
              prose-blockquote:text-gray-700
              prose-blockquote:italic
              prose-blockquote:font-normal
              prose-strong:font-semibold
              prose-code:px-1.5
              prose-code:py-0.5
              prose-code:bg-gray-100
              prose-code:rounded-md
              prose-code:text-gray-800
              prose-code:before:content-['']
              prose-code:after:content-['']
              prose-pre:bg-gray-100
              prose-pre:rounded-lg
              prose-ol:pl-8
              prose-ul:pl-8
              prose-li:mt-0
              prose-table:border-collapse
              prose-th:border
              prose-th:border-gray-200
              prose-th:bg-gray-50
              prose-th:p-2
              prose-th:text-left
              prose-td:border
              prose-td:border-gray-200
              prose-td:p-2
              prose-img:rounded-lg
              prose-hr:border-gray-200
              text-neutral-950 dark:text-gray-400/90

                
            "
            >
              {content}
            </div>
          </div>
        </article>
      </div>
    );
  } catch (error) {
    console.error(`Error loading markdown content for ${fileName}:`, error);
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-red-800 mb-4">
            Error Loading Content
          </h1>
          <p className="text-red-700">
            Sorry, there was an error loading the content.
          </p>
          {process.env.NODE_ENV === "development" && (
            <pre className="mt-4 p-4 bg-red-100 text-red-900 rounded text-sm overflow-auto">
              {error instanceof Error ? error.message : "Unknown error"}
            </pre>
          )}
        </div>
      </div>
    );
  }
};

export default MDXContent;
