"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { mainNavigation } from "@/data/navigation";
import { cn, isActivePath } from "@/lib/utils";

/** Navigation drawer for viewports below `xl`, where the inline header navigation is hidden. */
export function MobileNavigation({ className }: { className?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("xl:hidden", className)}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon-lg"
              className="rounded-xs text-foreground"
              aria-label="Open navigation menu"
            />
          }
        >
          <MenuIcon aria-hidden="true" className="size-5" />
        </SheetTrigger>
        <SheetContent side="right" className="border-l shadow-none">
          <SheetHeader className="h-20 justify-center border-b px-5">
            <SheetTitle className="text-label-sm tracking-wider text-muted-foreground uppercase">
              Navigation
            </SheetTitle>
          </SheetHeader>
          <nav aria-label="Mobile" className="px-3">
            <ul className="flex flex-col gap-1">
              {mainNavigation.map((item) => {
                const isActive = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex min-h-11 items-center rounded-xs border-l-2 border-transparent px-3 text-body-md text-subtle-foreground focus-ring transition-colors hover:bg-muted hover:text-foreground",
                        isActive &&
                          "border-primary bg-muted font-medium text-primary hover:text-primary",
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
