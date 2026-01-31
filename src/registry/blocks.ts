import { type RegistryItem } from "shadcn/schema";
import { convexClients } from "./clients";
import { registryItemAppend } from "./utils";

// Realtime blocks - 7 versions each
import realtimeChatNextjs from "./convex/blocks/realtime-chat-nextjs/registry-item.json" with { type: "json" };
import realtimeChatReact from "./convex/blocks/realtime-chat-react/registry-item.json" with { type: "json" };
import realtimeChatReactRouter from "./convex/blocks/realtime-chat-react-router/registry-item.json" with { type: "json" };
import realtimeChatTanstack from "./convex/blocks/realtime-chat-tanstack/registry-item.json" with { type: "json" };
import realtimeChatVite from "./convex/blocks/realtime-chat-vite/registry-item.json" with { type: "json" };
import realtimeChatLaravel from "./convex/blocks/realtime-chat-laravel/registry-item.json" with { type: "json" };
import realtimeChatAstro from "./convex/blocks/realtime-chat-astro/registry-item.json" with { type: "json" };

import realtimeCursorNextjs from "./convex/blocks/realtime-cursor-nextjs/registry-item.json" with { type: "json" };
import realtimeCursorReact from "./convex/blocks/realtime-cursor-react/registry-item.json" with { type: "json" };
import realtimeCursorReactRouter from "./convex/blocks/realtime-cursor-react-router/registry-item.json" with { type: "json" };
import realtimeCursorTanstack from "./convex/blocks/realtime-cursor-tanstack/registry-item.json" with { type: "json" };
import realtimeCursorVite from "./convex/blocks/realtime-cursor-vite/registry-item.json" with { type: "json" };
import realtimeCursorLaravel from "./convex/blocks/realtime-cursor-laravel/registry-item.json" with { type: "json" };
import realtimeCursorAstro from "./convex/blocks/realtime-cursor-astro/registry-item.json" with { type: "json" };

import realtimeAvatarStackNextjs from "./convex/blocks/realtime-avatar-stack-nextjs/registry-item.json" with { type: "json" };
import realtimeAvatarStackReact from "./convex/blocks/realtime-avatar-stack-react/registry-item.json" with { type: "json" };
import realtimeAvatarStackReactRouter from "./convex/blocks/realtime-avatar-stack-react-router/registry-item.json" with { type: "json" };
import realtimeAvatarStackTanstack from "./convex/blocks/realtime-avatar-stack-tanstack/registry-item.json" with { type: "json" };
import realtimeAvatarStackVite from "./convex/blocks/realtime-avatar-stack-vite/registry-item.json" with { type: "json" };
import realtimeAvatarStackLaravel from "./convex/blocks/realtime-avatar-stack-laravel/registry-item.json" with { type: "json" };
import realtimeAvatarStackAstro from "./convex/blocks/realtime-avatar-stack-astro/registry-item.json" with { type: "json" };

// Auth blocks - 7 versions each
import passwordBasedAuthNextjs from "./convex/blocks/password-based-auth-nextjs/registry-item.json" with { type: "json" };
import passwordBasedAuthReact from "./convex/blocks/password-based-auth-react/registry-item.json" with { type: "json" };
import passwordBasedAuthReactRouter from "./convex/blocks/password-based-auth-react-router/registry-item.json" with { type: "json" };
import passwordBasedAuthTanstack from "./convex/blocks/password-based-auth-tanstack/registry-item.json" with { type: "json" };
import passwordBasedAuthVite from "./convex/blocks/password-based-auth-vite/registry-item.json" with { type: "json" };
import passwordBasedAuthLaravel from "./convex/blocks/password-based-auth-laravel/registry-item.json" with { type: "json" };
import passwordBasedAuthAstro from "./convex/blocks/password-based-auth-astro/registry-item.json" with { type: "json" };

import socialAuthNextjs from "./convex/blocks/social-auth-nextjs/registry-item.json" with { type: "json" };
import socialAuthReact from "./convex/blocks/social-auth-react/registry-item.json" with { type: "json" };
import socialAuthReactRouter from "./convex/blocks/social-auth-react-router/registry-item.json" with { type: "json" };
import socialAuthTanstack from "./convex/blocks/social-auth-tanstack/registry-item.json" with { type: "json" };
import socialAuthVite from "./convex/blocks/social-auth-vite/registry-item.json" with { type: "json" };
import socialAuthLaravel from "./convex/blocks/social-auth-laravel/registry-item.json" with { type: "json" };
import socialAuthAstro from "./convex/blocks/social-auth-astro/registry-item.json" with { type: "json" };

// Storage blocks - 7 versions each
import dropzoneNextjs from "./convex/blocks/dropzone-nextjs/registry-item.json" with { type: "json" };
import dropzoneReact from "./convex/blocks/dropzone-react/registry-item.json" with { type: "json" };
import dropzoneReactRouter from "./convex/blocks/dropzone-react-router/registry-item.json" with { type: "json" };
import dropzoneTanstack from "./convex/blocks/dropzone-tanstack/registry-item.json" with { type: "json" };
import dropzoneVite from "./convex/blocks/dropzone-vite/registry-item.json" with { type: "json" };
import dropzoneLaravel from "./convex/blocks/dropzone-laravel/registry-item.json" with { type: "json" };
import dropzoneAstro from "./convex/blocks/dropzone-astro/registry-item.json" with { type: "json" };

// User blocks - 7 versions each
import currentUserAvatarNextjs from "./convex/blocks/current-user-avatar-nextjs/registry-item.json" with { type: "json" };
import currentUserAvatarReact from "./convex/blocks/current-user-avatar-react/registry-item.json" with { type: "json" };
import currentUserAvatarReactRouter from "./convex/blocks/current-user-avatar-react-router/registry-item.json" with { type: "json" };
import currentUserAvatarTanstack from "./convex/blocks/current-user-avatar-tanstack/registry-item.json" with { type: "json" };
import currentUserAvatarVite from "./convex/blocks/current-user-avatar-vite/registry-item.json" with { type: "json" };
import currentUserAvatarLaravel from "./convex/blocks/current-user-avatar-laravel/registry-item.json" with { type: "json" };
import currentUserAvatarAstro from "./convex/blocks/current-user-avatar-astro/registry-item.json" with { type: "json" };

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
const viteClient = convexClients.find(
  (client: RegistryItem) => client.name === "convex-client-vite",
);
const laravelClient = convexClients.find(
  (client: RegistryItem) => client.name === "convex-client-laravel",
);
const astroClient = convexClients.find(
  (client: RegistryItem) => client.name === "convex-client-astro",
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
  registryItemAppend(passwordBasedAuthVite as RegistryItem, [viteClient!]),
  registryItemAppend(passwordBasedAuthLaravel as RegistryItem, [
    laravelClient!,
  ]),
  registryItemAppend(passwordBasedAuthAstro as RegistryItem, [astroClient!]),

  registryItemAppend(socialAuthNextjs as RegistryItem, [nextjsClient!]),
  registryItemAppend(socialAuthReact as RegistryItem, [reactClient!]),
  registryItemAppend(socialAuthReactRouter as RegistryItem, [
    reactRouterClient!,
  ]),
  registryItemAppend(socialAuthTanstack as RegistryItem, [tanstackClient!]),
  registryItemAppend(socialAuthVite as RegistryItem, [viteClient!]),
  registryItemAppend(socialAuthLaravel as RegistryItem, [laravelClient!]),
  registryItemAppend(socialAuthAstro as RegistryItem, [astroClient!]),

  // Realtime blocks
  registryItemAppend(realtimeChatNextjs as RegistryItem, [nextjsClient!]),
  registryItemAppend(realtimeChatReact as RegistryItem, [reactClient!]),
  registryItemAppend(realtimeChatReactRouter as RegistryItem, [
    reactRouterClient!,
  ]),
  registryItemAppend(realtimeChatTanstack as RegistryItem, [tanstackClient!]),
  registryItemAppend(realtimeChatVite as RegistryItem, [viteClient!]),
  registryItemAppend(realtimeChatLaravel as RegistryItem, [laravelClient!]),
  registryItemAppend(realtimeChatAstro as RegistryItem, [astroClient!]),

  registryItemAppend(realtimeCursorNextjs as RegistryItem, [nextjsClient!]),
  registryItemAppend(realtimeCursorReact as RegistryItem, [reactClient!]),
  registryItemAppend(realtimeCursorReactRouter as RegistryItem, [
    reactRouterClient!,
  ]),
  registryItemAppend(realtimeCursorTanstack as RegistryItem, [tanstackClient!]),
  registryItemAppend(realtimeCursorVite as RegistryItem, [viteClient!]),
  registryItemAppend(realtimeCursorLaravel as RegistryItem, [laravelClient!]),
  registryItemAppend(realtimeCursorAstro as RegistryItem, [astroClient!]),

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
  registryItemAppend(realtimeAvatarStackVite as RegistryItem, [viteClient!]),
  registryItemAppend(realtimeAvatarStackLaravel as RegistryItem, [
    laravelClient!,
  ]),
  registryItemAppend(realtimeAvatarStackAstro as RegistryItem, [astroClient!]),

  // Storage blocks
  registryItemAppend(dropzoneNextjs as RegistryItem, [nextjsClient!]),
  registryItemAppend(dropzoneReact as RegistryItem, [reactClient!]),
  registryItemAppend(dropzoneReactRouter as RegistryItem, [reactRouterClient!]),
  registryItemAppend(dropzoneTanstack as RegistryItem, [tanstackClient!]),
  registryItemAppend(dropzoneVite as RegistryItem, [viteClient!]),
  registryItemAppend(dropzoneLaravel as RegistryItem, [laravelClient!]),
  registryItemAppend(dropzoneAstro as RegistryItem, [astroClient!]),

  // User blocks
  registryItemAppend(currentUserAvatarNextjs as RegistryItem, [nextjsClient!]),
  registryItemAppend(currentUserAvatarReact as RegistryItem, [reactClient!]),
  registryItemAppend(currentUserAvatarReactRouter as RegistryItem, [
    reactRouterClient!,
  ]),
  registryItemAppend(currentUserAvatarTanstack as RegistryItem, [
    tanstackClient!,
  ]),
  registryItemAppend(currentUserAvatarVite as RegistryItem, [viteClient!]),
  registryItemAppend(currentUserAvatarLaravel as RegistryItem, [
    laravelClient!,
  ]),
  registryItemAppend(currentUserAvatarAstro as RegistryItem, [astroClient!]),
] as RegistryItem[];
