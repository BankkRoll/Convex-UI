"use client";

import { useEffect, useState } from "react";
import { cn, copyToClipboard } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { codeToHtml, type ThemeRegistration } from "shiki";

// Convex dark theme
const convexDarkTheme: ThemeRegistration = {
  name: "convex-dark",
  type: "dark",
  colors: {
    "editor.background": "#121212",
    "editor.foreground": "#ffffff",
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment", "string.comment"],
      settings: { foreground: "#7e7e7e", fontStyle: "italic" },
    },
    {
      scope: [
        "constant",
        "entity.name.constant",
        "variable.other.constant",
        "constant.language",
      ],
      settings: { foreground: "#3ecf8e" },
    },
    {
      scope: [
        "entity",
        "entity.name",
        "entity.name.type",
        "support.type",
        "support.class",
      ],
      settings: { foreground: "#3ecf8e" },
    },
    {
      scope: ["variable", "support.variable", "variable.parameter"],
      settings: { foreground: "#ffffff" },
    },
    {
      scope: ["keyword", "storage.type", "storage.modifier", "keyword.control"],
      settings: { foreground: "#bda4ff" },
    },
    {
      scope: [
        "string",
        "constant.other.symbol",
        "constant.other.key",
        "string.quoted",
      ],
      settings: { foreground: "#ffcda1" },
    },
    {
      scope: ["support.function", "entity.name.function", "meta.function-call"],
      settings: { foreground: "#3ecf8e" },
    },
    {
      scope: [
        "punctuation",
        "punctuation.separator",
        "meta.brace",
        "punctuation.definition",
      ],
      settings: { foreground: "#ffffff" },
    },
    {
      scope: ["meta.tag", "entity.name.tag"],
      settings: { foreground: "#3ecf8e" },
    },
    {
      scope: [
        "entity.other.attribute-name",
        "support.type.property-name",
        "meta.object-literal.key",
      ],
      settings: { foreground: "#3ecf8e" },
    },
  ],
};

// Convex light theme
const convexLightTheme: ThemeRegistration = {
  name: "convex-light",
  type: "light",
  colors: {
    "editor.background": "#ffffff",
    "editor.foreground": "#1f1f1f",
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment", "string.comment"],
      settings: { foreground: "#7e7e7e", fontStyle: "italic" },
    },
    {
      scope: [
        "constant",
        "entity.name.constant",
        "variable.other.constant",
        "constant.language",
      ],
      settings: { foreground: "#15593b" },
    },
    {
      scope: [
        "entity",
        "entity.name",
        "entity.name.type",
        "support.type",
        "support.class",
      ],
      settings: { foreground: "#15593b" },
    },
    {
      scope: ["variable", "support.variable", "variable.parameter"],
      settings: { foreground: "#1f1f1f" },
    },
    {
      scope: ["keyword", "storage.type", "storage.modifier", "keyword.control"],
      settings: { foreground: "#6b35dc" },
    },
    {
      scope: [
        "string",
        "constant.other.symbol",
        "constant.other.key",
        "string.quoted",
      ],
      settings: { foreground: "#f1a10d" },
    },
    {
      scope: ["support.function", "entity.name.function", "meta.function-call"],
      settings: { foreground: "#15593b" },
    },
    {
      scope: [
        "punctuation",
        "punctuation.separator",
        "meta.brace",
        "punctuation.definition",
      ],
      settings: { foreground: "#1f1f1f" },
    },
    {
      scope: ["meta.tag", "entity.name.tag"],
      settings: { foreground: "#15593b" },
    },
    {
      scope: [
        "entity.other.attribute-name",
        "support.type.property-name",
        "meta.object-literal.key",
      ],
      settings: { foreground: "#15593b" },
    },
  ],
};

// Map common language aliases to valid Shiki language identifiers
const languageMap: Record<string, string> = {
  env: "dotenv",
  ".env": "dotenv",
  "env.local": "dotenv",
};

interface CodeBlockProps {
  children: string;
  language?: string;
  title?: string;
  className?: string;
}

export function CodeBlock({
  children,
  language = "typescript",
  title,
  className,
}: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const code = typeof children === "string" ? children.trim() : "";

  useEffect(() => {
    let mounted = true;

    async function highlight() {
      try {
        const resolvedLang = languageMap[language] || language;
        const result = await codeToHtml(code, {
          lang: resolvedLang,
          themes: {
            light: convexLightTheme,
            dark: convexDarkTheme,
          },
          defaultColor: false,
        });

        if (mounted) {
          setHtml(result);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Shiki highlighting error:", error);
        if (mounted) {
          // Add .shiki class to prevent double border from mdx.css rules
          setHtml(
            `<pre class="shiki"><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`,
          );
          setIsLoading(false);
        }
      }
    }

    highlight();

    return () => {
      mounted = false;
    };
  }, [code, language]);

  const handleCopy = () => {
    copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("group relative my-6", className)}>
      {title && (
        <div className="rounded-t-lg border border-b-0 border-border bg-muted px-4 py-2 text-sm font-medium text-foreground">
          {title}
        </div>
      )}
      {isLoading ? (
        <div
          className={cn(
            "h-24 w-full animate-pulse bg-muted border border-border",
            title ? "rounded-b-lg" : "rounded-lg",
          )}
        />
      ) : (
        <div
          className={cn(
            "code-block-content overflow-x-auto text-sm border border-border bg-card [&_pre]:py-4 [&_pre]:m-0 [&_code]:block [&_.line]:px-4 [&_.line]:min-h-6",
            title ? "rounded-b-lg" : "rounded-lg",
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  );
}
