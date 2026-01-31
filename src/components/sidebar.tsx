import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

import { Button } from "./ui/button";
import Link from "next/link";
import { Menu } from "lucide-react";
import { MobileMenuSheet } from "./mobile-menu-sheet";
import { ScrollArea } from "./ui/scroll-area";
import SideNavigation from "@/components/side-navigation";

export function Sidebar() {
  return (
    <>
      {/* Mobile Header */}
      <div className="bg-background fixed top-0 right-0 left-0 z-50 flex justify-between items-center px-4 py-3 border-b md:hidden">
        {/* Logo and Name */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" className="w-6 h-6" alt="logo" />
          <span className="font-semibold text-sm">Convex UI</span>
        </Link>

        {/* Menu Button - opens sheet from right */}
        <MobileMenuSheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0 flex flex-col gap-0">
            <SheetHeader className="border-b px-4 shrink-0">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1">
              <SideNavigation />
            </ScrollArea>
          </SheetContent>
        </MobileMenuSheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="bg-background border-muted/50 h-screen sticky top-0 z-30 hidden shrink-0 border-r md:block">
        <ScrollArea className="h-full">
          <SideNavigation />
        </ScrollArea>
      </aside>
    </>
  );
}
