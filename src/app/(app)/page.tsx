import { BlockPreview } from "@/components/block-preview";
import { ComponentPreview } from "@/components/component-preview";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Horizontal grid line component
const HorizontalGridLine = () => (
  <div className="bg-border/30 h-px col-span-12" />
);

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  const roomName = `room-${Math.floor(Math.random() * 1000)}`;

  return (
    <main className="relative lg:-ml-10">
      <div className="mx-auto w-full min-w-0 flex flex-col gap-16">
        {/* Component Showcase with Grid */}
        <div className="w-full h-full overflow-y-auto overflow-x-hidden relative z-10">
          {/* Grid Container */}
          <div className="relative">
            {/* Grid Lines - Vertical (Columns) */}
            {Array.from({ length: 13 }).map((_, i) => (
              <div
                key={`col-line-${i}`}
                className="bg-border/30 w-px absolute top-0 bottom-0 z-10 first:hidden last:hidden"
                style={{
                  left: `${(i / 12) * 100}%`,
                  height: "100%",
                }}
              />
            ))}

            {/* Grid Content */}
            <div className="relative z-20 grid grid-cols-12 gap-0 pb-32">
              {/* Heading Section */}
              <div className="col-span-10 col-start-2 pt-8 pb-8 md:col-span-8 md:col-start-3">
                <div className="flex flex-col justify-start gap-8 pt-16 md:pt-32">
                  <div className="max-w-2xl">
                    <h1 className="text-foreground mb-3 text-4xl font-medium tracking-tight">
                      UI Blocks for Convex Projects
                    </h1>
                    <h2 className="text-foreground-light mb-4 text-lg">
                      A collection of React components and blocks built on the
                      shadcn/ui library that connect your front-end to your
                      Convex back-end via a single command.
                    </h2>
                    <Button variant="secondary" size="lg" className="mt-4">
                      <Link href="/docs/getting-started/quickstart">
                        Get Started
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Password-based Authentication */}
              <div className="text-foreground-light relative flex col-span-10 col-start-2 justify-between items-center pt-16 pb-6 font-mono text-xs tracking-wider uppercase md:col-span-8 md:col-start-3">
                <span>Password-based Authentication</span>
                <Link
                  className="decoration-foreground-muted text-foreground underline decoration-1 underline-offset-4 transition-colors hover:decoration-brand hover:decoration-2"
                  href="/docs/nextjs/password-based-auth"
                >
                  Go to block ➔
                </Link>
              </div>
              <HorizontalGridLine />
              <div className="relative col-span-10 col-start-2 md:col-span-8 md:col-start-3">
                <div className="-mt-4">
                  <BlockPreview name="password-based-auth/auth/sign-up" />
                </div>
              </div>
              <HorizontalGridLine />

              {/* Social Authentication */}
              <div className="text-foreground-light relative flex col-span-10 col-start-2 justify-between items-center pt-16 pb-6 font-mono text-xs tracking-wider uppercase md:col-span-8 md:col-start-3">
                <span>Social Authentication</span>
                <Link
                  className="decoration-foreground-muted text-foreground underline decoration-1 underline-offset-4 transition-colors hover:decoration-brand hover:decoration-2"
                  href="/docs/nextjs/social-auth"
                >
                  Go to block ➔
                </Link>
              </div>
              <HorizontalGridLine />
              <div className="relative col-span-10 col-start-2 md:col-span-8 md:col-start-3">
                <div className="-mt-4">
                  <BlockPreview name="social-auth/auth/login" />
                </div>
              </div>
              <HorizontalGridLine />

              {/* Realtime Cursors */}
              <div className="text-foreground-light relative flex col-span-10 col-start-2 justify-between items-center pt-16 pb-6 font-mono text-xs tracking-wider uppercase md:col-span-8 md:col-start-3">
                <span>Realtime Cursors</span>
                <Link
                  className="decoration-foreground-muted text-foreground underline decoration-1 underline-offset-4 transition-colors hover:decoration-brand hover:decoration-2"
                  href="/docs/nextjs/realtime-cursor"
                >
                  Go to block ➔
                </Link>
              </div>
              <HorizontalGridLine />
              <div className="relative col-span-10 col-start-2 md:col-span-8 md:col-start-3">
                <div className="-mt-4 overflow-hidden grid rounded-lg md:flex">
                  <BlockPreview
                    name={`realtime-cursor-demo?roomName=${roomName}&userId=left`}
                    isPair
                  />
                  <BlockPreview
                    name={`realtime-cursor-demo?roomName=${roomName}&userId=right`}
                    isPair
                  />
                </div>
              </div>
              <HorizontalGridLine />

              {/* Dropzone */}
              <div className="text-foreground-light relative flex col-span-10 col-start-2 justify-between items-center pt-16 pb-6 font-mono text-xs tracking-wider uppercase md:col-span-8 md:col-start-3">
                <span>File Upload</span>
                <Link
                  className="decoration-foreground-muted text-foreground underline decoration-1 underline-offset-4 transition-colors hover:decoration-brand hover:decoration-2"
                  href="/docs/nextjs/dropzone"
                >
                  Go to block ➔
                </Link>
              </div>
              <HorizontalGridLine />
              <div className="relative col-span-10 col-start-2 md:col-span-8 md:col-start-3">
                <div className="-mb-12 -mt-4">
                  <ComponentPreview name="dropzone-demo" showCode={false} />
                </div>
              </div>
              <HorizontalGridLine />

              {/* Current User Avatar */}
              <div className="text-foreground-light relative flex col-span-10 col-start-2 justify-between items-center pt-16 pb-6 font-mono text-xs tracking-wider uppercase md:col-span-8 md:col-start-3">
                <span>Current User Avatar</span>
                <Link
                  className="decoration-foreground-muted text-foreground underline decoration-1 underline-offset-4 transition-colors hover:decoration-brand hover:decoration-2"
                  href="/docs/nextjs/current-user-avatar"
                >
                  Go to block ➔
                </Link>
              </div>
              <HorizontalGridLine />
              <div className="relative col-span-10 col-start-2 md:col-span-8 md:col-start-3">
                <div className="-mb-12 -mt-4">
                  <ComponentPreview
                    name="current-user-avatar-demo"
                    showCode={false}
                  />
                </div>
              </div>
              <HorizontalGridLine />

              {/* Realtime Avatar Stack */}
              <div className="text-foreground-light relative flex col-span-10 col-start-2 justify-between items-center pt-16 pb-6 font-mono text-xs tracking-wider uppercase md:col-span-8 md:col-start-3">
                <span>Realtime Avatar Stack</span>
                <Link
                  className="decoration-foreground-muted text-foreground underline decoration-1 underline-offset-4 transition-colors hover:decoration-brand hover:decoration-2"
                  href="/docs/nextjs/realtime-avatar-stack"
                >
                  Go to block ➔
                </Link>
              </div>
              <HorizontalGridLine />
              <div className="relative col-span-10 col-start-2 md:col-span-8 md:col-start-3">
                <div className="-mb-12 -mt-4">
                  <ComponentPreview
                    name="realtime-avatar-stack-demo"
                    showCode={false}
                  />
                </div>
              </div>
              <HorizontalGridLine />

              {/* Realtime Chat */}
              <div className="text-foreground-light relative flex col-span-10 col-start-2 justify-between items-center pt-16 pb-6 font-mono text-xs tracking-wider uppercase md:col-span-8 md:col-start-3">
                <span>Realtime Chat</span>
                <Link
                  className="decoration-foreground-muted text-foreground underline decoration-1 underline-offset-4 transition-colors hover:decoration-brand hover:decoration-2"
                  href="/docs/nextjs/realtime-chat"
                >
                  Go to block ➔
                </Link>
              </div>
              <HorizontalGridLine />
              <div className="relative col-span-10 col-start-2 md:col-span-8 md:col-start-3">
                <div className="-mt-4 overflow-hidden grid rounded-lg md:flex">
                  <BlockPreview
                    name={`realtime-chat-demo?roomName=${roomName}`}
                    isPair
                  />
                  <BlockPreview
                    name={`realtime-chat-demo?roomName=${roomName}`}
                    isPair
                  />
                </div>
              </div>
              <HorizontalGridLine />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
