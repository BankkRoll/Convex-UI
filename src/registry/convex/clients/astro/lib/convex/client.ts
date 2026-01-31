import { ConvexReactClient } from "convex/react";

const convexUrl = (import.meta as any).env.PUBLIC_CONVEX_URL as string;

export const convex = new ConvexReactClient(convexUrl);
