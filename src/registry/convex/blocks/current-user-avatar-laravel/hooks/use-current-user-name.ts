"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useCurrentUserName() {
  const user = useQuery(api.users.current);
  return user?.name ?? null;
}
