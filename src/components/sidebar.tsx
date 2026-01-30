import { SheetContent, SheetTrigger } from "./ui/sheet";

import SideNavigation from "@/components/side-navigation";
import { MobileMenuSheet } from "./mobile-menu-sheet";
import { ThemeSwitcherDropdown } from "./theme-switcher-dropdown";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

export function Sidebar() {
  return (
    <>
      <div className="bg-background fixed top-0 right-0 left-0 z-50 flex justify-between items-center px-8 py-3 border-b md:hidden">
        <MobileMenuSheet>
          <SheetTrigger asChild>
            <Button variant="outline" />
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <ScrollArea className="h-full">
              <SideNavigation />
            </ScrollArea>
          </SheetContent>
        </MobileMenuSheet>
        <ThemeSwitcherDropdown />
      </div>

      <aside className="bg-200 border-muted/50 w-full h-screen fixed top-0 z-30 hidden shrink-0 border-r md:sticky md:block">
        <ScrollArea className="h-full">
          <SideNavigation />
        </ScrollArea>
      </aside>
    </>
  );
}
