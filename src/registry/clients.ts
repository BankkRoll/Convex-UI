import type { RegistryItem } from "shadcn/schema";
import nextjs from "./convex/clients/nextjs/registry-item.json" with { type: "json" };
import reactRouter from "./convex/clients/react-router/registry-item.json" with { type: "json" };
import react from "./convex/clients/react/registry-item.json" with { type: "json" };
import tanstack from "./convex/clients/tanstack/registry-item.json" with { type: "json" };

export const clients = [nextjs, react, tanstack, reactRouter] as RegistryItem[];

// Alias for use in blocks.ts
export const convexClients = clients;
