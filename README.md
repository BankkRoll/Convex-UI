# Convex UI Registry

<img width="2152" height="1264" alt="Convex UI Registry" src="https://github.com/user-attachments/assets/0252109c-e30f-40a0-bfac-c302ff888f33" />

A collection of beautifully designed, accessible, and fully-featured UI components for building applications with [Convex](https://convex.dev). Built on top of [shadcn/ui](https://ui.shadcn.com) design patterns.

[![GitHub](https://img.shields.io/github/stars/BankkRoll/Convex-UI?style=social)](https://github.com/BankkRoll/Convex-UI)

## Attribution

**This project is based on [Supabase UI Library](https://github.com/supabase/supabase/tree/master/apps/ui-library) (OSS). Modifications have been made to replace Supabase backend integrations with Convex.**

The original work is licensed under the Apache License 2.0. See [LICENSE](./LICENSE) for details.

## Features

- **Realtime Components**: Chat, cursors, presence/avatar stacks - all powered by Convex live queries
- **Authentication**: Password-based and social (OAuth) authentication flows using Convex Auth
- **File Storage**: Drag-and-drop file uploads with Convex storage
- **Framework Support**: Next.js, React, TanStack Start, React Router v7
- **shadcn/ui Compatible**: All components follow shadcn/ui conventions and styling

## Getting Started

### Prerequisites

- A Convex project (run `npx convex dev` to create one)
- Node.js 18+
- Your favorite React framework

### Installation

1. Install the Convex client for your framework:

```bash
# Next.js
npx shadcn@latest add "https://convex-ui.vercel.app/r/convex-client-nextjs"

# React (Vite)
npx shadcn@latest add "https://convex-ui.vercel.app/r/convex-client-react"

# TanStack Start
npx shadcn@latest add "https://convex-ui.vercel.app/r/convex-client-tanstack"

# React Router v7
npx shadcn@latest add "https://convex-ui.vercel.app/r/convex-client-react-router"
```

2. Add components as needed:

```bash
# Realtime chat
npx shadcn@latest add "https://convex-ui.vercel.app/r/realtime-chat-nextjs"

# File upload dropzone
npx shadcn@latest add "https://convex-ui.vercel.app/r/dropzone-nextjs"

# Password authentication
npx shadcn@latest add "https://convex-ui.vercel.app/r/password-based-auth-nextjs"

# Social authentication (OAuth)
npx shadcn@latest add "https://convex-ui.vercel.app/r/social-auth-nextjs"
```

## Available Components

### Realtime

| Component               | Description                         |
| ----------------------- | ----------------------------------- |
| `realtime-chat`         | Real-time chat with message history |
| `realtime-cursor`       | Show other users' cursor positions  |
| `realtime-avatar-stack` | Display online users in a room      |

### Authentication

| Component             | Description                          |
| --------------------- | ------------------------------------ |
| `password-based-auth` | Login, sign-up, password reset flows |
| `social-auth`         | OAuth with GitHub, Google            |

### Storage

| Component  | Description               |
| ---------- | ------------------------- |
| `dropzone` | Drag-and-drop file upload |

### User

| Component             | Description                      |
| --------------------- | -------------------------------- |
| `current-user-avatar` | Reactive avatar for current user |

## Environment Variables

Set up your Convex URL in your environment:

```env
# Next.js
NEXT_PUBLIC_CONVEX_URL=your-convex-url

# Vite-based frameworks
VITE_CONVEX_URL=your-convex-url
```

## Documentation

Visit our [documentation](https://convex-ui.vercel.app/docs) for detailed usage guides and API references.

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Project Structure

```
├── src/
│   ├── app/               # Next.js app directory
│   ├── components/        # Shared UI components
│   └── registry/
│       └── convex/        # Convex UI components
│           ├── blocks/    # Feature blocks
│           ├── clients/   # Framework clients
│           └── examples/  # Demo components
├── content/docs/          # Documentation (MDX)
├── convex/                # Convex backend functions
│   ├── schema.ts          # Database schema
│   ├── auth.ts            # Auth configuration
│   ├── users.ts           # User queries/mutations
│   ├── messages.ts        # Chat messages
│   ├── presence.ts        # Realtime presence
│   └── files.ts           # File storage
└── public/                # Static assets
```

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](./LICENSE) file for details.

Original work Copyright 2024 Supabase.
Modifications for Convex integration.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.

## Acknowledgments

- [Supabase](https://supabase.com) for the original UI library
- [shadcn/ui](https://ui.shadcn.com) for the component design system
- [Convex](https://convex.dev) for the reactive backend platform
