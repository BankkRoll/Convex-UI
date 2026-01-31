import type { RegistryItem } from "shadcn/schema";
import nextjs from "./convex/clients/nextjs/registry-item.json" with { type: "json" };
import reactRouter from "./convex/clients/react-router/registry-item.json" with { type: "json" };
import react from "./convex/clients/react/registry-item.json" with { type: "json" };
import tanstack from "./convex/clients/tanstack/registry-item.json" with { type: "json" };
import vite from "./convex/clients/vite/registry-item.json" with { type: "json" };
import laravel from "./convex/clients/laravel/registry-item.json" with { type: "json" };
import astro from "./convex/clients/astro/registry-item.json" with { type: "json" };

export const clients = [
  nextjs,
  react,
  tanstack,
  reactRouter,
  vite,
  laravel,
  astro,
] as RegistryItem[];

// Alias for use in blocks.ts
export const convexClients = clients;
