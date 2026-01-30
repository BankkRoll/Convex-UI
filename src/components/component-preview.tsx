"use client";

import * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Index } from "@/__registry__";
import { useConfig } from "@/hooks/use-config";
import { cn } from "@/lib/utils";
import { styles } from "@/registry/styles";
import { ChevronRight, RotateCw } from "lucide-react";
import { Button } from "./ui/button";

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: keyof (typeof Index)["default"];
  extractClassname?: boolean;
  extractedClassNames?: string;
  align?: "center" | "start" | "end";
  showCode?: boolean;
  wide?: boolean;
}

export function ComponentPreview({
  name,
  children,
  className,
  extractClassname,
  extractedClassNames,
  align = "center",
  showCode = true,
  wide = false,
  ...props
}: ComponentPreviewProps) {
  const [config] = useConfig();
  const [refreshKey, setRefreshKey] = React.useState(0);
  const index = styles.findIndex((style) => style.name === config.style);

  const Preview = React.useMemo(() => {
    const Component = Index["default"][name]?.component;

    if (!Component) {
      return (
        <p className="text-muted-foreground text-sm">
          Component{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {name}
          </code>{" "}
          not found in registry.
        </p>
      );
    }

    return <Component key={refreshKey} />;
  }, [name, config.style, refreshKey]);

  const Codes = React.Children.toArray(children) as React.ReactElement[];
  const Code = Codes[index];

  const ComponentPreview = React.useMemo(() => {
    return (
      <>
        <div
          className={cn(
            "preview flex min-h-[350px] w-full justify-center p-10 theme-original",
            {
              "items-center": align === "center",
              "items-start": align === "start",
              "items-end": align === "end",
            },
          )}
        >
          <React.Suspense
            fallback={
              <div className="text-muted-foreground flex items-center text-sm">
                Loading...
              </div>
            }
          >
            {Preview}
          </React.Suspense>
        </div>
      </>
    );
  }, [Preview, align]);

  const wideClasses = wide ? "2xl:-ml-12 2xl:-mr-12" : "";

  return (
    <div className={cn("mt-4 mb-12", wideClasses)}>
      <div
        className={cn(
          "bg-background relative",
          showCode
            ? "rounded-tl-md rounded-tr-md border-t border-r border-l"
            : "rounded-md border",
        )}
      >
        <div className="z-0 pointer-events-none absolute inset-0 bg-[radial-gradient(hsla(var(--foreground-default)/0.05)_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-20 opacity-50 transition-opacity hover:opacity-100"
          onClick={() => setRefreshKey((k) => k + 1)}
        >
          <RotateCw className="w-4 h-4" />
        </Button>
        <div className="relative z-10">{ComponentPreview}</div>
      </div>
      {showCode && (
        <Collapsible>
          <CollapsibleTrigger
            className={`
            flex 
            gap-3 items-center 
            w-full
            font-mono
            text-xs 
            text-foreground-light
            px-4 py-4 
            border border-r 
            group
            data-[state=closed]:rounded-bl-md data-[state=closed]:rounded-br-md
            
        `}
          >
            <ChevronRight
              className="transition-all group-data-[state=open]:rotate-90 text-foreground-lighter"
              size={14}
            />
            View code
          </CollapsibleTrigger>
          <CollapsibleContent className="transition-all">
            <div
              className={cn(
                "relative",
                "w-full rounded-md [&_pre]:my-0",
                "[&_pre]:overflow-auto",
                "[&_pre]:max-h-[320px]",
                "[&_pre]:rounded-tr-none [&_pre]:rounded-tl-none [&_pre]:border-t-transparent",
              )}
            >
              {Code}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
