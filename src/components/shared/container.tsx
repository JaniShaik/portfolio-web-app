import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/utils";

type ContainerProps<T extends ElementType> = {
  as?: T;
} & Omit<ComponentProps<T>, "as">;

/** Centered, responsive page container using the `container-page` design token. */
export function Container<T extends ElementType = "div">({
  as,
  className,
  ...props
}: ContainerProps<T>) {
  const Component: ElementType = as ?? "div";
  return <Component className={cn("container-page", className)} {...props} />;
}
