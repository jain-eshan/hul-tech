# PRAMAAN Chrome Extension — design spec

Companion to `docs/PRD.md` §5.3 Surface 1 (Inline Assistant) and Surface 2 (Browser
Extension). Those surfaces were spec'd but never built — this document scopes a real,
demoable MVP of them, buildable in the time remaining before submission.

Status when written: `docs/STATUS.md` phases 0–11 done, Phase 9 (deploy) done, this is
new scope layered on top, not a revision of anything already shipped.

---

## 1. What this is, in one line

A Manifest V3 Chrome extension that watches Google Docs and Gmail compose, and shows a
docked sidebar with PRAMAAN's clause-cited findings on whatever text you're writing or
have selected — without you opening the PRAMAAN app.

## 2. Two technical constraints that shaped every decision below

1. **Google Docs renders text on `<canvas>`, not real DOM.** There is no live
   `document.body.innerText` to read. Copy/paste still works, though — Docs maintains a
   real text-selection model under the canvas — so `window.getSelection()` returns real
   text even there. That's the only reliable read path into a Doc.
2. **The sidebar cannot rewrite text inside a Google Doc.** Doing that needs the Docs
   API + OAuth, out of scope for today. The fix action is "copy the corrected wording to
   the clipboard," not "click Apply and watch the doc change" (which is what the web app
   already does on `/asset/[id]` — that mutation only works there because PRAMAAN owns
   the text in its own React state).

Both are stated on the demo/slide, not hidden. Overclaiming here is exactly the failure
mode `docs/PRD.md` §18 warns against for the rest of the pitch.

## 3. Scope

**In scope:**
- Google Docs (`docs.google.com/document/*`) — selection-triggered checking
- Gmail compose (`mail.google.com/*`, compose/reply box) — typing-triggered checking
- Docked right-edge sidebar, shadow DOM, listing findings as cards
- Calls the existing `/api/check` endpoint on the deployed app — no new compliance
  logic, no duplicate rule engine
- Manual market selector in the sidebar (defaults to `IN`)
- Silent-fallback error handling matching the existing API contract

**Out of scope (say so on stage, don't build):**
- Rewriting text inside Google Docs (needs Docs API + OAuth)
- Any host beyond Docs + Gmail (DAM, Figma, Slides, agency portals — all named in the
  PRD as future surfaces, not this build)
- Background/idle whole-document scanning in Docs (would need Docs API; MVP reacts to
  selection instead)
- Packaging/publishing to the Chrome Web Store — this is a "load unpacked" demo build

## 4. Architecture

```
extension/
  manifest.json          MV3, host_permissions for docs.google.com, mail.google.com,
                          and https://hul-tech.vercel.app
  background.js           service worker — the only thing that calls fetch()
  content/
    docs.js                content script for docs.google.com — selection listener
    gmail.js                content script for mail.google.com — MutationObserver
    sidebar.js               shared: builds and updates the shadow-DOM sidebar
    sidebar.css
  icons/
```

**Why the fetch lives in the background worker, not the content script:** MV3 service
workers with `host_permissions` declared for a target origin bypass page-level CORS.
The content script runs in the hosting page's origin (docs.google.com) and would be
blocked calling a different origin directly. Message-passing (`chrome.runtime.sendMessage`
from content script → `chrome.runtime.onMessage` in background → `fetch` → response back)
sidesteps that entirely, and **requires no change to the existing Next.js API route.**

## 5. Data flow

1. User selects text in a Doc (or pauses typing in Gmail compose).
2. Content script debounces (Docs: on `selectionchange` + 400ms settle; Gmail: on
   `MutationObserver` mutation + 2000ms settle), then reads the text (`window.
   getSelection().toString()` for Docs, `element.innerText` for Gmail).
3. If text length < 15 chars, do nothing — avoids firing on stray clicks/cursor moves.
4. Content script sends `{copy, market}` to the background worker.
5. Background worker `POST`s to `https://hul-tech.vercel.app/api/check`, same request
   shape the web app's Live Check already sends.
6. Response `{verdict, judgment?, source}` comes back. If `judgment` is present, render
   those findings (real Gemini reasoning); otherwise render `verdict.findings` from the
   deterministic fallback. This mirrors exactly how `/api/check` already behaves — the
   extension does not need its own fallback logic, only its own *rendering* of whichever
   result the API already decided to return.
7. Sidebar re-renders finding cards: quoted phrase, clause, severity color, "Copy fixed
   wording" button (writes `fixReplacement ?? suggestedFix` to the clipboard via
   `navigator.clipboard.writeText`).

## 6. Error handling

- Fetch failure, timeout, or non-200: sidebar keeps showing its last-known findings
  rather than clearing to an error state or a spinner that never resolves. Matches the
  web app's own principle (`route.ts` comment: "never surface a model failure to the
  screen").
- No debounce = no request: the debounce **is** the rate limit. There is no separate
  throttle to build.
- Empty/whitespace-only selection: no request sent.

## 7. Sidebar UI

Docked right-edge panel, ~260px wide, shadow DOM (`attachShadow({mode: "closed"})`) so
host-page CSS (Docs' or Gmail's own styles) cannot leak in or be leaked into.

- Header: "PRAMAAN" wordmark + market `<select>` (13 markets from `lib/types.ts`,
  default `IN`)
- Body: one card per finding — severity-colored left border (RED/AMBER matching the
  app's existing verdict palette), quoted span, clause + regulator, explanation,
  "Copy fixed wording" button
- Empty state: "No findings in your current selection." (Docs) or "Watching as you
  type." (Gmail) — never a blank panel with no explanation

## 8. Demo plan

Two demos, both live in the recording/on stage:

1. **Gmail compose** — type "New Rexona Clinical Protection gives you clinically proven
   72h protection" in a UK-context compose window. Sidebar reacts unprompted within
   ~2s of the typing pause. This is the strongest "ambient, ✨" proof — no click, no
   app to open.
2. **Google Docs** — select the same sentence inside a Doc. Sidebar reacts to the
   selection. Stated on camera: *"Docs renders on canvas, so this is selection-triggered
   rather than continuous — full production would use the Docs API for background
   scanning."*

## 9. What "done" means for this build

- [ ] Extension loads unpacked in Chrome without errors
- [ ] Typing a known-non-compliant claim in Gmail compose produces a sidebar finding
      citing the correct rule, within ~5s
- [ ] Selecting the same text in a Google Doc produces the same finding
- [ ] "Copy fixed wording" places the correct replacement text on the clipboard
- [ ] Switching the market selector changes which findings fire (UK vs a market where
      the claim is registered)
- [ ] No console errors on either host page
- [ ] Sidebar never shows a raw error to the user, per §6

## 10. Component-level verification done 2026-08-20

The items above need a real, signed-in Google account, which this environment doesn't
have and shouldn't be given — see `extension/HOW-TO-TEST.md` for the manual steps.
What could be verified without one:

- `manifest.json` parses as valid JSON and every file it references
  (`background.js`, `content/sidebar.js`, `content/docs.js`, `content/gmail.js`)
  exists. One correction to §4 above: there's no separate `sidebar.css` — the
  sidebar's styles are inlined as a template string inside `content/sidebar.js` and
  injected into its own shadow root.
- All four JS files pass `node --check` (syntax only, not a runtime guarantee).
- `content/sidebar.js` was exercised live in a browser via a throwaway harness
  (`extension/test-harness.html`, unreferenced by the manifest, doesn't ship) —
  confirmed: findings render with correct severity-color borders, the card without a
  literal `fixReplacement`/`suggestedFix` correctly omits the copy button, and
  **`navigator.clipboard.writeText` genuinely writes to the OS clipboard** from
  inside the closed shadow root (confirmed by observing a real clipboard change, not
  just the absence of a thrown error).
- The live endpoint was curled directly with a known-risky claim
  (`"...clinically proven 72h protection..."`, market `UK`) and returned a real
  finding citing `ASCI-I-1` via the deterministic engine — confirming the demo will
  show findings even if no Gemini key is configured on the deployment; Gemini, where
  configured, only adds judgment-tier findings on top.

Not yet verified against a real page: the Gmail `aria-label*="Message Body"` selector
and the Docs `copy`-event trigger. Both are plausible and match current Gmail/Docs
markup as of general knowledge, but neither vendor guarantees selector stability
across releases — confirm live before recording.
