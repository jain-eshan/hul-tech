# Testing the PRAMAAN extension

This needs your own signed-in Google account — that's deliberate, the build
environment doesn't have one and shouldn't be given one.

## 1. Load it

1. Open `chrome://extensions` in Chrome.
2. Toggle **Developer mode** on, top right.
3. Click **Load unpacked**, select this `extension/` folder.
4. It should appear as "PRAMAAN — Brand Clearance," no errors shown.

## 2. Test on Gmail (the easy, fully-ambient case)

1. Open Gmail, click **Compose**.
2. Type something like: *"New Rexona Clinical Protection gives you clinically proven
   72h protection, tested across dermatology panels in three countries."*
3. Stop typing and wait ~2 seconds. A dark sidebar should appear on the right edge
   with a finding card, quoting the claim and citing a rule.
4. Click **Copy fixed wording** on a card — the fix text should land on your
   clipboard (paste somewhere to confirm).

If the sidebar never appears: open DevTools → Console on the Gmail tab and look for
errors. Most likely cause is Gmail's `aria-label` on the compose box no longer
matching `content/gmail.js`'s selector (`div[contenteditable="true"][role="textbox"]
[aria-label*="Message Body" i]`) — Gmail's markup does shift between releases.

## 3. Test on Google Docs (the harder, canvas-rendered case)

1. Open any Google Doc, type similar risky copy.
2. Select the sentence, then press **Cmd+C** (or Ctrl+C on Windows) — this is the
   trigger, not just selecting.
3. The sidebar should update within about a second.

If nothing happens: the `copy` event listener in `content/docs.js` may need the tab
to have focus, or Docs' event handling may have changed. `window.getSelection()` is
tried as a fallback in the same file — check the console for which path fired.

## 4. Before the recording

- Confirm the market dropdown (top right of the sidebar) is set to the market you're
  demoing — it defaults to `IN`.
- The API it calls is `https://hul-tech.vercel.app/api/check` — confirm that's still
  live before recording (`curl -s -o /dev/null -w '%{http_code}' https://hul-tech.vercel.app/api/check -X POST -H 'Content-Type: application/json' -d '{"copy":"test","market":"IN"}'` should return `200`).
- Verified 2026-08-20 by curling the live endpoint directly: it already returns real
  findings via the deterministic engine even without a Gemini key configured (e.g. the
  "72h protection" claim above correctly fires `ASCI-I-1` in the UK market). So the
  demo will show findings either way — Gemini, if configured, only adds judgment-tier
  findings on top.
