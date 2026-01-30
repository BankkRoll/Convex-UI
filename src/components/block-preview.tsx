"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { RotateCw } from "lucide-react";

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  wide?: boolean;
  isPair?: boolean;
}

export function BlockPreview({
  name,
  wide = false,
  isPair = false,
}: ComponentPreviewProps) {
  const [refreshKey, setRefreshKey] = React.useState(0);

  const BlockPreview = React.useMemo(() => {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <React.Suspense
          fallback={
            <div className="text-muted-foreground flex items-center text-sm">
              Loading...
            </div>
          }
        >
          <iframe
            key={refreshKey}
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/example/${name}`}
            style={{
              border: "none",
              width: "100%",
              height: "100%",
              display: "block",
            }}
            name="preview-frame"
          />
        </React.Suspense>
      </div>
    );
  }, [name, refreshKey]);

  const wideClasses = wide ? "2xl:-ml-12 2xl:-mr-12" : "";

  return (
    <div className={cn("w-full mt-4", wideClasses)}>
      <div
        className={cn(
          "relative border rounded-lg overflow-hidden bg-muted min-h-[160px] h-[650px]",
          isPair && "rounded-none",
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-20 opacity-50 transition-opacity hover:opacity-100"
          onClick={() => setRefreshKey((k) => k + 1)}
        >
          <RotateCw className="w-4 h-4" />
        </Button>
        {BlockPreview}
      </div>
    </div>
  );
}
