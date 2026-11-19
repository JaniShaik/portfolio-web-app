"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavigation } from "@/data/navigation";
import { cn, isActivePath } from "@/lib/utils";

/** Desktop primary navigation. Hidden below the `xl` breakpoint, as in the Stitch design. */
export function Navigation({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className={cn("hidden xl:block", className)}>
      <ul className="flex items-center gap-4">
        {mainNavigation.map((item) => {
          const isActive = isActivePath(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "border-b border-transparent py-1 text-label-md text-subtle-foreground focus-ring transition-colors hover:text-foreground",
                  isActive && "border-primary text-primary hover:text-primary",
                )}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
