import fs from "fs";
import path from "path";

const BASE_URL = "https://convex-ui.vercel.app/docs";

interface DocMeta {
  title: string;
  description?: string;
  path: string;
}

console.log("🤖 Building llms.txt");

// Function to extract frontmatter from MDX files
function extractFrontmatter(content: string): {
  title?: string;
  description?: string;
} {
  const frontmatterRegex = /---\r?\n([\s\S]*?)\r?\n---/;
  const match = content.match(frontmatterRegex);
  if (!match) return {};

  const frontmatter = match[1];
  const titleMatch = frontmatter.match(/title:\s*(.*)/);
  const descriptionMatch = frontmatter.match(/description:\s*(.*)/);

  return {
    title: titleMatch?.[1]?.trim(),
    description: descriptionMatch?.[1]?.trim(),
  };
}

// Function to recursively get all MDX files
function getMdxFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMdxFiles(fullPath));
    } else if (entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }

  return files;
}

// Function to get all MDX files and their metadata, grouped by section
function getDocFiles(): Map<string, DocMeta[]> {
  const docsDir = path.join(process.cwd(), "content/docs");
  const mdxFiles = getMdxFiles(docsDir).sort((a, b) => a.localeCompare(b));

  const docsBySection = new Map<string, DocMeta[]>();

  for (const fullPath of mdxFiles) {
    console.log(fullPath);
    const content = fs.readFileSync(fullPath, "utf-8");
    const { title, description } = extractFrontmatter(content);

    if (title) {
      // Get relative path and convert to URL path
      const relativePath = path.relative(docsDir, fullPath);
      const urlPath = relativePath
        .replace(/\.mdx$/, "")
        .replace(/\/index$/, "")
        .replace(/\\/g, "/");

      // Extract section from path (e.g., "getting-started", "nextjs", "react")
      const section = urlPath.split("/")[0];

      if (!docsBySection.has(section)) {
        docsBySection.set(section, []);
      }

      docsBySection.get(section)!.push({
        title,
        description,
        path: urlPath,
      });
    }
  }

  return docsBySection;
}

// Generate the llms.txt content
const docsBySection = getDocFiles();
let content = `# Convex UI Library
Last updated: ${new Date().toISOString()}

## Overview
A collection of beautifully designed, accessible, and fully-featured UI components for building applications with Convex. Built on top of shadcn/ui design patterns with realtime components, authentication flows, and file storage - all powered by Convex.

## Docs

`;

// Define section order and labels
const sectionOrder = [
  { key: "getting-started", label: "Getting Started" },
  { key: "nextjs", label: "Next.js Components" },
  { key: "react", label: "React (Vite) Components" },
  { key: "react-router", label: "React Router Components" },
  { key: "tanstack", label: "TanStack Start Components" },
];

// Add documentation links grouped by section
for (const { key, label } of sectionOrder) {
  const docs = docsBySection.get(key);
  if (docs && docs.length > 0) {
    content += `### ${label}\n\n`;
    for (const doc of docs) {
      const url = `${BASE_URL}/${doc.path}`;
      content += `- [${doc.title}](${url})`;
      if (doc.description) {
        content += ` - ${doc.description}`;
      }
      content += "\n";
    }
    content += "\n";
  }
}

// Write the file
const publicDir = path.join(process.cwd(), "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, "llms.txt"), content);
console.log("✅ Generated llms.txt in public directory");
