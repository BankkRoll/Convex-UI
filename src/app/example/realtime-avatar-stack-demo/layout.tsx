import { Metadata } from "next";
import { BaseInjector } from "../base-injector";

export const metadata: Metadata = {
  title: "Realtime Avatar Stack Example",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BaseInjector />
      <div className="flex w-full items-center justify-center p-6 md:p-10 preview bg-surface-100 h-screen relative">
        <div className="z-0 pointer-events-none absolute inset-0 bg-[radial-gradient(hsla(var(--foreground-default)/0.05)_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="w-full max-w-sm flex flex-col gap-4 justify-center items-center relative z-10">
          {children}
        </div>
      </div>
    </>
  );
}
