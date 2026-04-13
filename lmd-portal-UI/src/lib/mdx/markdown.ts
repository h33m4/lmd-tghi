import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX, MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

export interface MarkdownContent {
  content: React.ReactNode;
  frontmatter: {
    title?: string;
    lastUpdated?: string;
    [key: string]: any;
  };
}

// export async function getMarkdownContent(
//   filename: string
// ): Promise<MarkdownContent> {
//   try {
//     // Construct path to markdown file in mkd folder
//     const mdPath = path.join(process.cwd(), "src/app/mkd", `${filename}.md`);

//     // Debug log to see the constructed path
//     console.log("Looking for markdown file at:", mdPath);

//     // Check if file exists
//     if (!fs.existsSync(mdPath)) {
//       throw new Error(
//         `Markdown file not found: ${filename}.md at path: ${mdPath}`
//       );
//     }

//     const fileContent = fs.readFileSync(mdPath, "utf8");

//     // Extract title from first line if no frontmatter exists
//     const firstLine = fileContent.split("\n")[0];
//     const hasExplicitTitle = firstLine.startsWith("# ");

//     // Parse frontmatter
//     const { data: existingFrontmatter = {}, content } = matter(fileContent);

//     // If no explicit frontmatter title but has markdown title, use that
//     const frontmatter = {
//       ...existingFrontmatter,
//       title:
//         existingFrontmatter.title ||
//         (hasExplicitTitle ? firstLine.replace("# ", "") : undefined),
//     };

//     // Compile MDX
//     const { content: compiledContent } = await compileMDX({
//       source: content,
//       options: {
//         parseFrontmatter: true,
//       },
//     });

//     return {
//       content: compiledContent,
//       frontmatter,
//     };
//   } catch (error) {
//     console.error("Error processing markdown:", error);
//     throw error;
//   }
// }

export async function getMarkdownContent(
  filename: string
): Promise<MarkdownContent> {
  try {
    // Construct path to markdown file in mkd folder
    const mdPath = path.join(process.cwd(), "src/app/mkd", `${filename}.md`);

    // Check if file exists
    if (!fs.existsSync(mdPath)) {
      throw new Error(
        `Markdown file not found: ${filename}.md at path: ${mdPath}`
      );
    }

    const fileContent = fs.readFileSync(mdPath, "utf8");

    // Parse frontmatter and content
    const { data: frontmatter, content } = matter(fileContent);

    // Process the markdown content with MDXRemote
    const mdxContent = await MDXRemote({
      source: content,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug],
          format: "mdx",
        },
      },
    });

    return {
      content: mdxContent,
      frontmatter,
    };
  } catch (error) {
    console.error("Error processing markdown:", error);
    throw error;
  }
}
