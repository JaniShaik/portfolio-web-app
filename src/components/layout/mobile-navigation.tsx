"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type MouseEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { mainNavigation } from "@/data/navigation";
import { cn, isActivePath } from "@/lib/utils";

/** Navigation drawer for viewports below `xl`, where the inline header navigation is hidden. */
export function MobileNavigation({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  /** Anchor link (e.g. `/#philosophy`) to follow once the drawer has fully closed. */
  const pendingAnchorHref = useRef<string | null>(null);

  function handleLinkClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    // The modal drawer locks page scroll until it closes; on platforms with classic scrollbars the
    // lock's release restores the old scroll position, undoing a hash scroll made while it was
    // held. Defer anchor navigation until the close transition (and the lock) has finished.
    if (href.includes("#")) {
      event.preventDefault();
      pendingAnchorHref.current = href;
    }
    setOpen(false);
  }

  function handleOpenChangeComplete(isOpen: boolean) {
    const href = pendingAnchorHref.current;
    if (isOpen || !href) return;
    pendingAnchorHref.current = null;
    router.push(href);
  }

  return (
    <div className={cn("xl:hidden", className)}>
      <Sheet open={open} onOpenChange={setOpen} onOpenChangeComplete={handleOpenChangeComplete}>
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
                      onClick={(event) => handleLinkClick(event, item.href)}
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
