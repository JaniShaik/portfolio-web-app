import type { MDXComponents } from "mdx/types";

/**
 * Global MDX component mapping (required by @next/mdx with the App Router).
 * Map markdown elements to design-system components here, e.g. `h2`, `a`, `img`.
 */
const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
