// The API routes are not reachable in the standalone build. Nothing imports this at
// runtime; it exists so the bundler can resolve the module graph if it is ever pulled in.
export const NextResponse = { json: (body: unknown) => body };
