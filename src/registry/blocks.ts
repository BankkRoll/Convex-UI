import { type RegistryItem } from "shadcn/schema";
import { convexClients } from "./clients";
import { registryItemAppend } from "./utils";

// Realtime blocks - 4 versions each
import realtimeChatNextjs from "./convex/blocks/realtime-chat-nextjs/registry-item.json" with { type: "json" };
import realtimeChatReact from "./convex/blocks/realtime-chat-react/registry-item.json" with { type: "json" };
import realtimeChatReactRouter from "./convex/blocks/realtime-chat-react-router/registry-item.json" with { type: "json" };
import realtimeChatTanstack from "./convex/blocks/realtime-chat-tanstack/registry-item.json" with { type: "json" };

import realtimeCursorNextjs from "./convex/blocks/realtime-cursor-nextjs/registry-item.json" with { type: "json" };
import realtimeCursorReact from "./convex/blocks/realtime-cursor-react/registry-item.json" with { type: "json" };
import realtimeCursorReactRouter from "./convex/blocks/realtime-cursor-react-router/registry-item.json" with { type: "json" };
import realtimeCursorTanstack from "./convex/blocks/realtime-cursor-tanstack/registry-item.json" with { type: "json" };

import realtimeAvatarStackNextjs from "./convex/blocks/realtime-avatar-stack-nextjs/registry-item.json" with { type: "json" };
import realtimeAvatarStackReact from "./convex/blocks/realtime-avatar-stack-react/registry-item.json" with { type: "json" };
import realtimeAvatarStackReactRouter from "./convex/blocks/realtime-avatar-stack-react-router/registry-item.json" with { type: "json" };
import realtimeAvatarStackTanstack from "./convex/blocks/realtime-avatar-stack-tanstack/registry-item.json" with { type: "json" };

// Auth blocks - 4 versions each
import passwordBasedAuthNextjs from "./convex/blocks/password-based-auth-nextjs/registry-item.json" with { type: "json" };
import passwordBasedAuthReact from "./convex/blocks/password-based-auth-react/registry-item.json" with { type: "json" };
import passwordBasedAuthReactRouter from "./convex/blocks/password-based-auth-react-router/registry-item.json" with { type: "json" };
import passwordBasedAuthTanstack from "./convex/blocks/password-based-auth-tanstack/registry-item.json" with { type: "json" };

import socialAuthNextjs from "./convex/blocks/social-auth-nextjs/registry-item.json" with { type: "json" };
import socialAuthReact from "./convex/blocks/social-auth-react/registry-item.json" with { type: "json" };
import socialAuthReactRouter from "./convex/blocks/social-auth-react-router/registry-item.json" with { type: "json" };
import socialAuthTanstack from "./convex/blocks/social-auth-tanstack/registry-item.json" with { type: "json" };

// Storage blocks - 4 versions each
import dropzoneNextjs from "./convex/blocks/dropzone-nextjs/registry-item.json" with { type: "json" };
import dropzoneReact from "./convex/blocks/dropzone-react/registry-item.json" with { type: "json" };
import dropzoneReactRouter from "./convex/blocks/dropzone-react-router/registry-item.json" with { type: "json" };
import dropzoneTanstack from "./convex/blocks/dropzone-tanstack/registry-item.json" with { type: "json" };

// User blocks - 4 versions each
import currentUserAvatarNextjs from "./convex/blocks/current-user-avatar-nextjs/registry-item.json" with { type: "json" };
import currentUserAvatarReact from "./convex/blocks/current-user-avatar-react/registry-item.json" with { type: "json" };
import currentUserAvatarReactRouter from "./convex/blocks/current-user-avatar-react-router/registry-item.json" with { type: "json" };
import currentUserAvatarTanstack from "./convex/blocks/current-user-avatar-tanstack/registry-item.json" with { type: "json" };

// Get client references
const nextjsClient = convexClients.find(
  (client: RegistryItem) => client.name === "convex-client-nextjs",
);
const reactClient = convexClients.find(
  (client: RegistryItem) => client.name === "convex-client-react",
);
const reactRouterClient = convexClients.find(
  (client: RegistryItem) => client.name === "convex-client-react-router",
);
const tanstackClient = convexClients.find(
  (client: RegistryItem) => client.name === "convex-client-tanstack",
);

export const blocks = [
  // Auth blocks
  registryItemAppend(passwordBasedAuthNextjs as RegistryItem, [nextjsClient!]),
  registryItemAppend(passwordBasedAuthReact as RegistryItem, [reactClient!]),
  registryItemAppend(passwordBasedAuthReactRouter as RegistryItem, [
    reactRouterClient!,
  ]),
  registryItemAppend(passwordBasedAuthTanstack as RegistryItem, [
    tanstackClient!,
  ]),

  registryItemAppend(socialAuthNextjs as RegistryItem, [nextjsClient!]),
  registryItemAppend(socialAuthReact as RegistryItem, [reactClient!]),
  registryItemAppend(socialAuthReactRouter as RegistryItem, [
    reactRouterClient!,
  ]),
  registryItemAppend(socialAuthTanstack as RegistryItem, [tanstackClient!]),

  // Realtime blocks
  registryItemAppend(realtimeChatNextjs as RegistryItem, [nextjsClient!]),
  registryItemAppend(realtimeChatReact as RegistryItem, [reactClient!]),
  registryItemAppend(realtimeChatReactRouter as RegistryItem, [
    reactRouterClient!,
  ]),
  registryItemAppend(realtimeChatTanstack as RegistryItem, [tanstackClient!]),

  registryItemAppend(realtimeCursorNextjs as RegistryItem, [nextjsClient!]),
  registryItemAppend(realtimeCursorReact as RegistryItem, [reactClient!]),
  registryItemAppend(realtimeCursorReactRouter as RegistryItem, [
    reactRouterClient!,
  ]),
  registryItemAppend(realtimeCursorTanstack as RegistryItem, [tanstackClient!]),

  registryItemAppend(realtimeAvatarStackNextjs as RegistryItem, [
    nextjsClient!,
  ]),
  registryItemAppend(realtimeAvatarStackReact as RegistryItem, [reactClient!]),
  registryItemAppend(realtimeAvatarStackReactRouter as RegistryItem, [
    reactRouterClient!,
  ]),
  registryItemAppend(realtimeAvatarStackTanstack as RegistryItem, [
    tanstackClient!,
  ]),

  // Storage blocks
  registryItemAppend(dropzoneNextjs as RegistryItem, [nextjsClient!]),
  registryItemAppend(dropzoneReact as RegistryItem, [reactClient!]),
  registryItemAppend(dropzoneReactRouter as RegistryItem, [reactRouterClient!]),
  registryItemAppend(dropzoneTanstack as RegistryItem, [tanstackClient!]),

  // User blocks
  registryItemAppend(currentUserAvatarNextjs as RegistryItem, [nextjsClient!]),
  registryItemAppend(currentUserAvatarReact as RegistryItem, [reactClient!]),
  registryItemAppend(currentUserAvatarReactRouter as RegistryItem, [
    reactRouterClient!,
  ]),
  registryItemAppend(currentUserAvatarTanstack as RegistryItem, [
    tanstackClient!,
  ]),
] as RegistryItem[];
