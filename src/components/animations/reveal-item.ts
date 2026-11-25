/**
 * Spread on an element inside a `RevealGroup` to make it a staggered reveal item.
 *
 * Lives outside the `"use client"` module on purpose: a plain value imported from a client
 * module into a Server Component becomes a client reference, so spreading it would add no
 * attribute at all.
 */
export const REVEAL_ITEM = { "data-reveal": "" } as const;

export const REVEAL_ITEM_SELECTOR = "[data-reveal]";
