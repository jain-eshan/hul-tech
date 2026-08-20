// The only thing in this extension that calls fetch(). MV3 service workers with
// host_permissions declared for a target origin bypass page-level CORS, so content
// scripts (which run in the hosting page's own origin) message this worker instead
// of fetching directly. Requires no change to the Next.js API route.

const API_URL = "https://hul-tech.vercel.app/api/check";

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type !== "PRAMAAN_CHECK") return false;

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ copy: msg.copy, market: msg.market }),
  })
    .then((res) => res.json())
    .then((data) => sendResponse({ ok: true, data }))
    .catch((err) => sendResponse({ ok: false, error: String(err) }));

  return true; // keep the message channel open for the async response
});
