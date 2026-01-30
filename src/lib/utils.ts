import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export async function copyToClipboard(value: string): Promise<boolean> {
  if (!navigator?.clipboard) {
    console.warn("Clipboard not supported");
    return false;
  }

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch (err) {
    console.error("Failed to copy!", err);
    return false;
  }
}
