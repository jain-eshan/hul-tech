// Google Docs content script.
//
// IMPORTANT — this was revised from the original design during implementation. The
// spec assumed window.getSelection() reliably returns real text under Docs' canvas
// rendering. That could not be verified live (would need a signed-in Google account,
// which this build environment doesn't have and shouldn't be given). What IS well
// established: copy/paste works correctly in Docs, which means Docs populates real
// text into the native clipboard on Ctrl+C via its own 'copy' handler — regardless of
// what the canvas visually shows. So this listens for the 'copy' event and reads
// event.clipboardData, which is the robust path. window.getSelection() is also tried,
// opportunistically, in case it turns out to work too — costs nothing to keep both.
//
// Practical effect: select text, press Ctrl+C (or Cmd+C) — same gesture most people
// already use when they're double-checking a line. Confirm this works with a real,
// signed-in Google Doc before recording the demo.

(function () {
  const sidebar = window.PRAMAAN_SIDEBAR;
  if (!sidebar) return;

  sidebar.ensure("Select some text and press Ctrl+C (or Cmd+C) to check it.");
  sidebar.setStatus("Watching this document");
  sidebar.setOnMarketChange(() => recheck());

  let lastText = "";
  let debounceTimer = null;

  function handleText(text) {
    text = (text || "").trim();
    if (text.length < 15 || text === lastText) return;
    lastText = text;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => runCheck(text), 200);
  }

  function recheck() {
    if (lastText) runCheck(lastText);
  }

  function runCheck(text) {
    sidebar.setStatus("Checking…");
    chrome.runtime.sendMessage(
      { type: "PRAMAAN_CHECK", copy: text, market: sidebar.getMarket() },
      (res) => {
        if (chrome.runtime.lastError || !res?.ok) {
          sidebar.setStatus("Watching this document");
          return; // silent fallback — never surface a network failure to the user
        }
        const data = res.data;
        const findings = data.judgment || data.verdict?.findings || [];
        sidebar.setStatus(`Watching this document · last checked ${new Date().toLocaleTimeString()}`);
        sidebar.renderFindings(findings, "No findings in your selection.");
      },
    );
  }

  document.addEventListener("copy", (e) => {
    const text = e.clipboardData?.getData("text/plain");
    if (text) handleText(text);
  });

  document.addEventListener("selectionchange", () => {
    const sel = window.getSelection ? window.getSelection().toString() : "";
    if (sel) handleText(sel);
  });
})();
