import { type RegistryItem } from "shadcn/schema";
import { convexClients } from "./clients";
import { registryItemAppend } from "./utils";

// Realtime blocks - 3 versions each (nextjs, react, tanstack)
import realtimeChatNextjs from "./convex/blocks/realtime-chat-nextjs/registry-item.json" with { type: "json" };
import realtimeChatReact from "./convex/blocks/realtime-chat-react/registry-item.json" with { type: "json" };
import realtimeChatTanstack from "./convex/blocks/realtime-chat-tanstack/registry-item.json" with { type: "json" };

import realtimeCursorNextjs from "./convex/blocks/realtime-cursor-nextjs/registry-item.json" with { type: "json" };
import realtimeCursorReact from "./convex/blocks/realtime-cursor-react/registry-item.json" with { type: "json" };
import realtimeCursorTanstack from "./convex/blocks/realtime-cursor-tanstack/registry-item.json" with { type: "json" };

import realtimeAvatarStackNextjs from "./convex/blocks/realtime-avatar-stack-nextjs/registry-item.json" with { type: "json" };
import realtimeAvatarStackReact from "./convex/blocks/realtime-avatar-stack-react/registry-item.json" with { type: "json" };
import realtimeAvatarStackTanstack from "./convex/blocks/realtime-avatar-stack-tanstack/registry-item.json" with { type: "json" };

// Auth blocks - 3 versions each
import passwordBasedAuthNextjs from "./convex/blocks/password-based-auth-nextjs/registry-item.json" with { type: "json" };
import passwordBasedAuthReact from "./convex/blocks/password-based-auth-react/registry-item.json" with { type: "json" };
import passwordBasedAuthTanstack from "./convex/blocks/password-based-auth-tanstack/registry-item.json" with { type: "json" };

import socialAuthNextjs from "./convex/blocks/social-auth-nextjs/registry-item.json" with { type: "json" };
import socialAuthReact from "./convex/blocks/social-auth-react/registry-item.json" with { type: "json" };
import socialAuthTanstack from "./convex/blocks/social-auth-tanstack/registry-item.json" with { type: "json" };

// Storage blocks - 3 versions each
import dropzoneNextjs from "./convex/blocks/dropzone-nextjs/registry-item.json" with { type: "json" };
import dropzoneReact from "./convex/blocks/dropzone-react/registry-item.json" with { type: "json" };
import dropzoneTanstack from "./convex/blocks/dropzone-tanstack/registry-item.json" with { type: "json" };

// User blocks - 3 versions each
import currentUserAvatarNextjs from "./convex/blocks/current-user-avatar-nextjs/registry-item.json" with { type: "json" };
import currentUserAvatarReact from "./convex/blocks/current-user-avatar-react/registry-item.json" with { type: "json" };
import currentUserAvatarTanstack from "./convex/blocks/current-user-avatar-tanstack/registry-item.json" with { type: "json" };

// Get client references
const nextjsClient = convexClients.find(
  (client: RegistryItem) => client.name === "convex-client-nextjs",
);
const reactClient = convexClients.find(
  (client: RegistryItem) => client.name === "convex-client-react",
);
const tanstackClient = convexClients.find(
  (client: RegistryItem) => client.name === "convex-client-tanstack",
);

export const blocks = [
  // Auth blocks
  registryItemAppend(passwordBasedAuthNextjs as RegistryItem, [nextjsClient!]),
  registryItemAppend(passwordBasedAuthReact as RegistryItem, [reactClient!]),
  registryItemAppend(passwordBasedAuthTanstack as RegistryItem, [
    tanstackClient!,
  ]),

  registryItemAppend(socialAuthNextjs as RegistryItem, [nextjsClient!]),
  registryItemAppend(socialAuthReact as RegistryItem, [reactClient!]),
  registryItemAppend(socialAuthTanstack as RegistryItem, [tanstackClient!]),

  // Realtime blocks
  registryItemAppend(realtimeChatNextjs as RegistryItem, [nextjsClient!]),
  registryItemAppend(realtimeChatReact as RegistryItem, [reactClient!]),
  registryItemAppend(realtimeChatTanstack as RegistryItem, [tanstackClient!]),

  registryItemAppend(realtimeCursorNextjs as RegistryItem, [nextjsClient!]),
  registryItemAppend(realtimeCursorReact as RegistryItem, [reactClient!]),
  registryItemAppend(realtimeCursorTanstack as RegistryItem, [tanstackClient!]),

  registryItemAppend(realtimeAvatarStackNextjs as RegistryItem, [
    nextjsClient!,
  ]),
  registryItemAppend(realtimeAvatarStackReact as RegistryItem, [reactClient!]),
  registryItemAppend(realtimeAvatarStackTanstack as RegistryItem, [
    tanstackClient!,
  ]),

  // Storage blocks
  registryItemAppend(dropzoneNextjs as RegistryItem, [nextjsClient!]),
  registryItemAppend(dropzoneReact as RegistryItem, [reactClient!]),
  registryItemAppend(dropzoneTanstack as RegistryItem, [tanstackClient!]),

  // User blocks
  registryItemAppend(currentUserAvatarNextjs as RegistryItem, [nextjsClient!]),
  registryItemAppend(currentUserAvatarReact as RegistryItem, [reactClient!]),
  registryItemAppend(currentUserAvatarTanstack as RegistryItem, [
    tanstackClient!,
  ]),
] as RegistryItem[];
