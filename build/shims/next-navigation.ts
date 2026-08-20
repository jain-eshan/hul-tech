import { useEffect, useState } from "react";

// Standalone build shim for next/navigation.

export function usePathname(): string {
  const read = () => (typeof window === "undefined" ? "/" : window.location.hash.slice(1) || "/");
  const [path, setPath] = useState(read);
  useEffect(() => {
    const on = () => setPath(read());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return path;
}

export function notFound(): never {
  throw new Error("NEXT_NOT_FOUND");
}

export function useRouter() {
  return {
    push: (href: string) => { window.location.hash = href; },
    replace: (href: string) => { window.location.replace(`#${href}`); },
    back: () => window.history.back(),
  };
}
