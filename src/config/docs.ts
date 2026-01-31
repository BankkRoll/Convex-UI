import { SidebarNavGroup } from "@/types/nav";

export const gettingStarted: SidebarNavGroup = {
  title: "Getting Started",
  items: [
    {
      title: "Introduction",
      href: "/docs/getting-started/introduction",
      items: [],
      commandItemLabel: "Introduction",
    },
    {
      title: "Quick Start",
      href: "/docs/getting-started/quickstart",
      items: [],
      commandItemLabel: "Quick Start",
    },
    {
      title: "FAQ",
      href: "/docs/getting-started/faq",
      items: [],
      commandItemLabel: "FAQ",
    },
  ],
};

// Component definitions with supported frameworks
export const componentPages: SidebarNavGroup = {
  title: "Components",
  items: [
    {
      title: "Client",
      supportedFrameworks: ["nextjs", "tanstack", "react"],
      href: "/docs/nextjs/client",
      items: [],
      new: false,
      commandItemLabel: "Convex Client",
    },
    {
      title: "Password-Based Auth",
      supportedFrameworks: ["nextjs", "tanstack", "react"],
      href: "/docs/nextjs/password-based-auth",
      items: [],
      new: false,
      commandItemLabel: "Password-Based Auth",
    },
    {
      title: "Social Auth",
      supportedFrameworks: ["nextjs", "tanstack", "react"],
      href: "/docs/nextjs/social-auth",
      items: [],
      new: false,
      commandItemLabel: "Social Auth",
    },
    {
      title: "Dropzone",
      supportedFrameworks: ["nextjs", "tanstack", "react"],
      href: "/docs/nextjs/dropzone",
      items: [],
      new: false,
      commandItemLabel: "Dropzone (File Upload)",
    },
    {
      title: "Realtime Cursor",
      supportedFrameworks: ["nextjs", "tanstack", "react"],
      href: "/docs/nextjs/realtime-cursor",
      items: [],
      new: false,
      commandItemLabel: "Realtime Cursor",
    },
    {
      title: "Current User Avatar",
      supportedFrameworks: ["nextjs", "tanstack", "react"],
      href: "/docs/nextjs/current-user-avatar",
      items: [],
      new: false,
      commandItemLabel: "Current User Avatar",
    },
    {
      title: "Realtime Avatar Stack",
      supportedFrameworks: ["nextjs", "tanstack", "react"],
      href: "/docs/nextjs/realtime-avatar-stack",
      items: [],
      new: false,
      commandItemLabel: "Realtime Avatar Stack",
    },
    {
      title: "Realtime Chat",
      supportedFrameworks: ["nextjs", "tanstack", "react"],
      href: "/docs/nextjs/realtime-chat",
      items: [],
      new: false,
      commandItemLabel: "Realtime Chat",
    },
  ],
};

export const COMMAND_ITEMS = [
  ...gettingStarted.items.map((item) => ({
    label: item.commandItemLabel,
    href: item.href,
  })),
  ...componentPages.items.map((item) => ({
    label: item.commandItemLabel,
    href: item.href,
  })),
];

// Framework titles for display
export const frameworkTitles: Record<string, string> = {
  nextjs: "Next.js",
  tanstack: "TanStack Start",
  react: "React",
};
