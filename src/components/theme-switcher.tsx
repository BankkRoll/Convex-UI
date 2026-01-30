"use client";

import { Moon, Sun, Monitor, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type ThemeOption = {
  value: string;
  icon: React.ReactNode;
  label: string;
};

const themes: ThemeOption[] = [
  { value: "light", icon: <Sun className="h-4 w-4" />, label: "Light" },
  { value: "dark", icon: <Moon className="h-4 w-4" />, label: "Dark" },
  {
    value: "classic-dark",
    icon: <Sparkles className="h-4 w-4" />,
    label: "Classic",
  },
  { value: "system", icon: <Monitor className="h-4 w-4" />, label: "System" },
];

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
        {themes.map((t) => (
          <div key={t.value} className="h-8 w-8 rounded-md bg-transparent" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={cn(
            "relative flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            theme === t.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground",
          )}
          title={t.label}
          aria-label={`Switch to ${t.label} theme`}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}

// Compact version for tight spaces
export function ThemeSwitcherCompact() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    const currentIndex = themes.findIndex((t) => t.value === theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex].value);
  };

  if (!mounted) {
    return (
      <button className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background">
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md border border-border",
        "bg-background text-foreground",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "transition-all duration-200",
      )}
      title={`Current: ${currentTheme.label}. Click to cycle themes.`}
      aria-label={`Current theme: ${currentTheme.label}. Click to switch theme.`}
    >
      {currentTheme.icon}
    </button>
  );
}
