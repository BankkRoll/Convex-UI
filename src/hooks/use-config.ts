import { ComponentProps } from "react";
import { Style } from "@/registry/styles";
import { Toaster } from "sonner";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

// import { Theme } from '@/registry/themes'

type Config = {
  style: Style["name"];
  radius: number;
  sonnerPosition: ComponentProps<typeof Toaster>["position"];
  sonnerExpand: boolean;
};

const configAtom = atomWithStorage<Config>("config", {
  style: "default",
  radius: 0.5,
  sonnerPosition: "bottom-right",
  sonnerExpand: false,
});

export function useConfig() {
  return useAtom(configAtom);
}
