import { type Registry, type RegistryItem } from "shadcn/schema";

import { examples } from "@/registry/examples";
import { blocks } from "./blocks";
import { clients } from "./clients";

export const registry = {
  name: "Convex UI Library",
  homepage: "https://convex-ui.vercel.app",
  items: [
    ...blocks,
    ...clients,
    // Internal use only.
    ...examples,
  ],
} satisfies Registry;
