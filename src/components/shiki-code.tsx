"use client";

import { useEffect, useState } from "react";
import { cn, copyToClipboard } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { codeToHtml, type ThemeRegistration } from "shiki";

// Custom theme matching the convex theme
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

interface ShikiCodeProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export function ShikiCode({
  code,
  language = "typescript",
  className,
  showLineNumbers = true,
}: ShikiCodeProps) {
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function highlight() {
      try {
        const result = await codeToHtml(code, {
          lang: language,
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
          // Fallback to plain text
          setHtml(`<pre><code>${escapeHtml(code)}</code></pre>`);
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

  if (isLoading) {
    return (
      <div
        className={cn(
          "h-full w-full bg-card animate-pulse rounded-none",
          className,
        )}
      />
    );
  }

  return (
    <div className={cn("group relative h-full w-full", className)}>
      <div
        className="shiki-wrapper h-full w-full overflow-auto bg-card text-sm [&_pre]:bg-transparent! [&_pre]:p-4 [&_pre]:m-0 [&_code]:block [&_.line]:px-0 [&_.line]:min-h-6 [&_pre]:text-foreground"
        dangerouslySetInnerHTML={{ __html: html }}
      />
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
