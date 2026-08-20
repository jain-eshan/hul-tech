import React from "react";

// Standalone build shim for next/link. Routes become hash fragments so the whole app
// runs from a single file with no server and no history API.
export default function Link({
  href, children, ...rest
}: { href: string; children: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a href={`#${href}`} {...rest}>{children}</a>;
}
