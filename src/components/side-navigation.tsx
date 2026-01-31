import { componentPages, gettingStarted } from "@/config/docs";

import NavigationItem from "@/components/side-navigation-item";
import Link from "next/link";
import { CommandMenu } from "./command-menu";
import { SidebarFrameworkSelector } from "./sidebar-framework-selector";
import { ThemeSwitcherDropdown } from "./theme-switcher-dropdown";

function SideNavigation() {
  return (
    <nav className="flex flex-col min-h-full min-w-[220px]">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <Link href="/">
            <img src="/logo.png" className="w-6 h-6" alt="logo" />
          </Link>
          <ThemeSwitcherDropdown />
        </div>
        <Link href="/" className="block mb-4">
          <h1>Convex UI Library</h1>
        </Link>
        <div className="mb-3">
          <SidebarFrameworkSelector />
        </div>
        {/* <TopNavigationSearch /> */}
        <CommandMenu />
      </div>
      <div className="pb-6 space-y-0.5">
        <div className="text-foreground-lighter/75 px-6 mb-2 font-mono text-xs tracking-widest uppercase">
          {gettingStarted.title}
        </div>
        {gettingStarted.items.map((item, i) => (
          <NavigationItem item={item} key={`${item.href}-${i}`} />
        ))}
      </div>
      <div className="pb-6">
        <div className="text-foreground-lighter/75 px-6 mb-2 font-mono text-xs tracking-widest uppercase">
          Blocks
        </div>
        <div className="space-y-0.5">
          {/* Render items based on component definitions */}
          {componentPages.items.map((component, i) => (
            <NavigationItem
              item={component}
              key={`${component.href?.toString() || component.title}-${i}`}
            />
          ))}
        </div>
      </div>

      {/* Spacer to push footer to bottom */}
      <div className="flex-1" />

      {/* Footer */}
      <div className="p-6 border-t border-muted/50 space-y-3">
        <a
          href="https://github.com/BankkRoll/Convex-UI"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors text-xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          View on GitHub
        </a>
        <div className="text-[10px] text-foreground-muted leading-relaxed space-y-1">
          <p>
            Built for{" "}
            <a
              href="https://convex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Convex
            </a>
            . Based on{" "}
            <a
              href="https://github.com/supabase/supabase/tree/master/apps/ui-library"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Supabase UI
            </a>
            .
          </p>
          <p>
            Crafted with{" "}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              shadcn/ui
            </a>
            .
          </p>
        </div>
        <p className="text-[10px] text-foreground-muted/70 leading-relaxed">
          Not affiliated with Convex, Inc.
        </p>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-foreground-muted/70">
            Made by Bankk
          </span>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/BankkRoll"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-muted/70 hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://x.com/bankkroll_eth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-muted/70 hover:text-foreground transition-colors"
              aria-label="X (Twitter)"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default SideNavigation;
