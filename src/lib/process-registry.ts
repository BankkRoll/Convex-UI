import * as fs from "fs";

export interface RegistryNode {
  name: string;
  path: string;
  originalPath: string;
  type: "directory" | "file";
  children?: RegistryNode[];
  content?: string;
}

interface RegistryFile {
  path: string;
  target?: string;
  type: string;
  content: string;
}

const DEFAULT_PATHS = {
  component: "/src/components",
  hook: "/src/hooks",
  util: "/src/lib",
} as const;

// Directories that should be inside src/ folder (Next.js convention)
const SRC_DIRS = ["app", "components", "hooks", "lib"];
// Directories that should be at root level (Convex is always at root)
const ROOT_DIRS = ["convex"];

/**
 * Converts a flat registry array into a hierarchical file tree structure
 */
export function generateRegistryTree(registryPath: string): RegistryNode[] {
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf-8")) as {
    files: RegistryFile[];
  };
  const tree: RegistryNode[] = [];

  const sortedRegistry = [...registry.files].sort((a, b) =>
    a.path.localeCompare(b.path),
  );

  for (const file of sortedRegistry) {
    const itemPath = file.target || getDefaultPath(file);
    const pathParts = itemPath.split("/").filter(Boolean);
    let currentLevel = tree;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      const isLast = i === pathParts.length - 1;
      const path = "/" + pathParts.slice(0, i + 1).join("/");

      let node = currentLevel.find((n) => n.name === part);

      // Remove any paths in the file content that point to the block directory.
      const content = file.content
        .replaceAll(/@\/registry\/convex\/blocks\/.+?\//gi, "@/")
        .replaceAll(/@\/registry\/convex\/clients\/.+?\//gi, "@/")
        .replaceAll(/@\/registry\/convex\/fixtures\//gi, "@/")
        .replaceAll(/@\/registry\/convex\//gi, "@/")
        .replaceAll(/@\/registry\/default\/blocks\/.+?\//gi, "@/")
        .replaceAll(/@\/registry\/default\/fixtures\//gi, "@/")
        .replaceAll(/@\/registry\/default\//gi, "@/")
        .replaceAll(/@\/clients\/.+?\//gi, "@/");

      if (!node) {
        node = {
          name: part,
          path,
          originalPath: file.path,
          type: isLast ? "file" : "directory",
          ...(isLast ? { content } : { children: [] }),
        };
        currentLevel.push(node);
      }

      if (!isLast) {
        node.children = node.children || [];
        currentLevel = node.children;
      }
    }
  }

  return tree;
}

/**
 * Determines the default path for an item based on its type.
 * Returns the path where the file would be installed in a user's project.
 */
function getDefaultPath(item: RegistryFile): string {
  // Strip the registry-specific prefix to get the installation path
  // e.g., "src/registry/convex/blocks/realtime-chat/components/chat-message.tsx"
  //    -> "components/chat-message.tsx"
  let filePath = item.path
    // Remove src/registry/convex/blocks/{block-name}/ prefix
    .replace(/^src\/registry\/convex\/blocks\/[^/]+\//, "")
    // Remove src/registry/convex/clients/{client-name}/ prefix
    .replace(/^src\/registry\/convex\/clients\/[^/]+\//, "")
    // Fallback patterns for registry/default structure
    .replace(/^registry\/default\/blocks\/[^/]+\//, "")
    .replace(/^registry\/default\/clients\/[^/]+\//, "")
    // Remove any src/ prefix that might remain
    .replace(/^src\//, "");

  // Determine if the path should be in src/ or at root level
  const firstDir = filePath.split("/")[0];

  // Convex files stay at root level
  if (ROOT_DIRS.includes(firstDir)) {
    return `/${filePath}`;
  }

  // Files in src directories get the src/ prefix
  if (SRC_DIRS.includes(firstDir)) {
    return `/src/${filePath}`;
  }

  // Fallback: use type-based path for files without a recognized directory structure
  const type = item.type.replace("registry:", "").toLowerCase() || "";
  const basePath = DEFAULT_PATHS[type as keyof typeof DEFAULT_PATHS] || "/src";
  return `${basePath}/${filePath}`;
}
