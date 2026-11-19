"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getYear = () => new Date().getFullYear();
// The static shell is prerendered once, so the server must not bake in a year.
const getServerYear = () => null;

/**
 * Current year, read in the browser on every page load. No server rendering or
 * cache revalidation is involved, so it is correct from January 1.
 */
export function CopyrightYear() {
  const year = useSyncExternalStore(subscribe, getYear, getServerYear);
  return year === null ? null : <>{year} </>;
}
