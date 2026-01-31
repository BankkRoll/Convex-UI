"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CommandCopyButton } from "./command-copy-button";
import { useLocalStorage } from "./use-local-storage";

interface CommandCopyProps {
  name: string;
  highlight?: boolean;
  // For Vue, we need to use the `shadcn-vue` package instead of `shadcn`
  framework?: "react" | "vue";
}

// pnpm first as recommended
type PackageManager = "pnpm" | "npm" | "yarn" | "bun";
const packageManagers: PackageManager[] = ["pnpm", "npm", "yarn", "bun"];

const LOCAL_STORAGE_KEY = "package-manager-copy-command";

const getBaseUrl = () => {
  // TODO: Uncomment when namespace is registered
  // if (process.env.NEXT_PUBLIC_VERCEL_TARGET_ENV === "production") {
  //   return `@convex-ui`;
  // }
  if (process.env.NEXT_PUBLIC_VERCEL_TARGET_ENV === "preview") {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`;
  } else if (process.env.NEXT_PUBLIC_VERCEL_TARGET_ENV === "production") {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
  } else {
    return "http://localhost:3004";
  }
};

const getComponentPath = (name: string) => {
  // TODO: Uncomment when namespace is registered
  // if (process.env.NEXT_PUBLIC_VERCEL_TARGET_ENV === "production") {
  //   return `/${name}`;
  // }
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/r/${name}.json`;
};

export function Command({
  name,
  highlight,
  framework = "react",
}: CommandCopyProps) {
  const [value, setValue] = useLocalStorage(LOCAL_STORAGE_KEY, "pnpm");

  const baseUrl = getBaseUrl();
  const componentPath = getComponentPath(name);

  const commands: Record<PackageManager, string> =
    framework === "vue"
      ? {
          pnpm: `pnpm dlx shadcn-vue@latest add ${baseUrl}${componentPath}`,
          npm: `npx shadcn-vue@latest add ${baseUrl}${componentPath}`,
          yarn: `yarn dlx shadcn-vue@latest add ${baseUrl}${componentPath}`,
          bun: `bunx --bun shadcn-vue@latest add ${baseUrl}${componentPath}`,
        }
      : {
          pnpm: `pnpm dlx shadcn@latest add ${baseUrl}${componentPath}`,
          npm: `npx shadcn@latest add ${baseUrl}${componentPath}`,
          yarn: `yarn dlx shadcn@latest add ${baseUrl}${componentPath}`,
          bun: `bunx --bun shadcn@latest add ${baseUrl}${componentPath}`,
        };

  return (
    <TabsPrimitive.Root
      value={value}
      onValueChange={setValue}
      className="border-muted w-full mt-4 rounded-lg border"
    >
      <div className="bg-surface-200 w-full overflow-hidden relative px-4 py-3 rounded-lg group dark:bg-surface-100">
        {highlight && (
          <motion.div
            className="absolute inset-0 bg-linear-to-l from-transparent via-[#bbb] dark:via-white to-transparent opacity-10 z-0"
            initial={{ x: "100%" }}
            animate={{ x: "-100%" }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "linear",
              repeatType: "loop",
            }}
          />
        )}

        <div className="flex flex-col gap-3">
          {/* Clean underline tabs - no background */}
          <TabsPrimitive.List className="relative z-10 flex items-center gap-3">
            {packageManagers.map((manager) => (
              <TabsPrimitive.Trigger
                key={manager}
                value={manager}
                className={cn(
                  "relative text-xs pb-1 transition-colors",
                  "text-muted-foreground hover:text-foreground",
                  "data-[state=active]:text-foreground data-[state=active]:font-medium",
                  // Underline indicator with animation
                  "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px]",
                  "after:bg-foreground after:origin-left after:scale-x-0 after:transition-transform after:duration-200 after:ease-out",
                  "data-[state=active]:after:scale-x-100",
                )}
              >
                {manager}
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>

          {packageManagers.map((manager) => (
            <TabsPrimitive.Content
              key={manager}
              value={manager}
              className="m-0"
            >
              <div className="flex items-center">
                <div className="text-foreground overflow-x-auto relative z-10 flex-1 font-mono text-sm">
                  <span className="text-muted-foreground mr-2 select-none">
                    $
                  </span>
                  {commands[manager]}
                </div>
                <div className="shrink-0 relative z-10 ml-2">
                  <CommandCopyButton command={commands[manager]} />
                </div>
              </div>
            </TabsPrimitive.Content>
          ))}
        </div>
      </div>
    </TabsPrimitive.Root>
  );
}
