"use client";

import { RegistryNode } from "@/lib/process-registry";
import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ScrollArea } from "./ui/scroll-area";
import { ShikiCode } from "./shiki-code";

// --- Tree Context ---
interface TreeContextProps {
  selectedId: string | undefined;
  expandedItems: string[];
  handleExpand: (id: string) => void;
  selectItem: (id: string) => void;
}

const TreeContext = createContext<TreeContextProps | null>(null);

const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) throw new Error("useTree must be used within a TreeProvider");
  return context;
};

// --- Tree Components ---
function TreeIndicator() {
  return <div className="absolute left-1.5 h-full w-px bg-border" />;
}

function Folder({
  element,
  value,
  children,
}: {
  element: string;
  value: string;
  children: React.ReactNode;
}) {
  const { handleExpand, expandedItems } = useTree();
  const isExpanded = expandedItems.includes(value);

  return (
    <AccordionPrimitive.Item value={value} className="relative">
      <AccordionPrimitive.Trigger
        className={cn(
          "flex w-full items-center gap-1.5 rounded-md text-sm px-2 py-1",
          "hover:bg-accent hover:text-accent-foreground cursor-pointer",
          "text-muted-foreground",
        )}
        onClick={() => handleExpand(value)}
      >
        {isExpanded ? (
          <FolderOpenIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <FolderIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <span className="truncate">{element}</span>
      </AccordionPrimitive.Trigger>
      <AccordionPrimitive.Content className="relative overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <TreeIndicator />
        <div className="ml-4 flex flex-col gap-0.5 py-0.5">{children}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}

function File({
  value,
  children,
  onClick,
}: {
  value: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const { selectedId, selectItem } = useTree();
  const isSelected = selectedId === value;

  return (
    <button
      className={cn(
        "flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors cursor-pointer text-left",
        isSelected
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
      onClick={() => {
        selectItem(value);
        onClick?.();
      }}
    >
      <FileIcon className="h-4 w-4 shrink-0" />
      <span className="truncate">{children}</span>
    </button>
  );
}

interface TreeViewElement {
  id: string;
  name: string;
  children?: TreeViewElement[];
}

function Tree({
  elements,
  initialSelectedId,
  initialExpandedItems,
  children,
}: {
  elements?: TreeViewElement[];
  initialSelectedId?: string;
  initialExpandedItems?: string[];
  children: React.ReactNode;
}) {
  const [selectedId, setSelectedId] = useState<string | undefined>(
    initialSelectedId,
  );
  const [expandedItems, setExpandedItems] = useState<string[]>(
    initialExpandedItems || [],
  );

  const selectItem = useCallback((id: string) => setSelectedId(id), []);

  const handleExpand = useCallback((id: string) => {
    setExpandedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  }, []);

  // Initialize expanded items to show all folders
  useEffect(() => {
    if (elements && initialExpandedItems === undefined) {
      const getAllExpandable = (items: TreeViewElement[]): string[] => {
        const result: string[] = [];
        items.forEach((item) => {
          if (item.children?.length) {
            result.push(item.id);
            result.push(...getAllExpandable(item.children));
          }
        });
        return result;
      };
      setExpandedItems(getAllExpandable(elements));
    }
  }, [elements, initialExpandedItems]);

  return (
    <TreeContext.Provider
      value={{ selectedId, expandedItems, handleExpand, selectItem }}
    >
      <div className="w-full">
        <AccordionPrimitive.Root
          type="multiple"
          value={expandedItems}
          className="flex flex-col gap-0.5"
        >
          {children}
        </AccordionPrimitive.Root>
      </div>
    </TreeContext.Provider>
  );
}

function TreeItem({
  item,
  onFileSelect,
}: {
  item: TreeViewElement;
  onFileSelect: (id: string) => void;
}) {
  if (item.children?.length) {
    return (
      <Folder element={item.name} value={item.id}>
        {item.children.map((child) => (
          <TreeItem key={child.id} item={child} onFileSelect={onFileSelect} />
        ))}
      </Folder>
    );
  }

  return (
    <File value={item.id} onClick={() => onFileSelect(item.id)}>
      {item.name}
    </File>
  );
}

// --- Block Item Code ---
interface BlockItemCodeProps {
  files: RegistryNode[];
}

const getLanguageFromPath = (path: string): string => {
  const ext = path.split(".").pop()?.toLowerCase();
  const langMap: Record<string, string> = {
    ts: "typescript",
    tsx: "tsx",
    js: "javascript",
    jsx: "jsx",
    json: "json",
    css: "css",
    html: "html",
    md: "markdown",
    py: "python",
    sh: "bash",
    yaml: "yaml",
    yml: "yaml",
  };
  return langMap[ext || ""] || "typescript";
};

const findFirstFile = (nodes: RegistryNode[]): RegistryNode | null => {
  for (const node of nodes) {
    if (node.type === "file") {
      return node;
    }
    if (node.children) {
      const found = findFirstFile(node.children);
      if (found) return found;
    }
  }
  return null;
};

const findFileByPath = (
  nodes: RegistryNode[],
  path: string,
): RegistryNode | null => {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.children) {
      const found = findFileByPath(node.children, path);
      if (found) return found;
    }
  }
  return null;
};

export function BlockItemCode({ files }: BlockItemCodeProps) {
  const [selectedFile, setSelectedFile] = useState<RegistryNode | null>(() =>
    findFirstFile(files),
  );

  // Build tree structure for the Tree component
  const tree = useMemo((): TreeViewElement[] => {
    const convert = (nodes: RegistryNode[]): TreeViewElement[] => {
      return nodes.map((node) => ({
        id: node.path,
        name: node.name,
        children: node.children ? convert(node.children) : undefined,
      }));
    };
    return convert(files);
  }, [files]);

  const handleFileSelect = (path: string) => {
    const file = findFileByPath(files, path);
    if (file && file.type === "file") {
      setSelectedFile(file);
    }
  };

  return (
    <div className="flex mt-4 border rounded-lg overflow-hidden h-[652px] not-prose">
      {/* File browser sidebar */}
      <div className="w-64 shrink-0 border-r bg-muted/30">
        <ScrollArea className="h-full">
          <div className="p-2">
            <Tree elements={tree} initialSelectedId={selectedFile?.path}>
              {tree.map((item) => (
                <TreeItem
                  key={item.id}
                  item={item}
                  onFileSelect={handleFileSelect}
                />
              ))}
            </Tree>
          </div>
        </ScrollArea>
      </div>

      {/* Code display area */}
      {selectedFile?.content ? (
        <ShikiCode
          code={selectedFile.content}
          language={getLanguageFromPath(selectedFile.path)}
          className="flex-1"
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <p>No file selected or file content unavailable</p>
        </div>
      )}
    </div>
  );
}
