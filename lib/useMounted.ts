"use client";

import { useEffect, useState } from "react";

/**
 * Verdicts carry real measured engine time, so a server-rendered verdict and a
 * client-rendered one legitimately differ — React treats that as a hydration
 * mismatch and discards the server tree.
 *
 * The fix is to render engine output after mount rather than to fake the timings.
 * A synthetic millisecond figure on screen would be a fabricated number in a product
 * whose entire argument is that its numbers are traceable.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
