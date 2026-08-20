// Gmail compose content script. Gmail's compose body is a real contenteditable div
// (no canvas involved), so this is the straightforward, fully-ambient path: watch for
// compose boxes as they open (Gmail is a SPA, they appear dynamically), debounce on
// typing pauses, and check automatically — no click required.
//
// Gmail's own class names are obfuscated and change across releases, so this matches
// on the stable, semantic selector: a contenteditable with role="textbox" and an
// aria-label containing "Message Body" (Gmail's actual current label — verify this
// still matches if Gmail changes its UI; aria-label is far more stable than class
// names but not guaranteed forever).

(function () {
  const sidebar = window.PRAMAAN_SIDEBAR;
  if (!sidebar) return;

  sidebar.ensure("Start typing in a compose window.");
  sidebar.setStatus("Watching for a compose window…");
  sidebar.setOnMarketChange(() => recheck());

  const SELECTOR = 'div[contenteditable="true"][role="textbox"][aria-label*="Message Body" i]';
  const attached = new WeakSet();
  let lastText = "";
  let debounceTimer = null;

  function attach(el) {
    if (attached.has(el)) return;
    attached.add(el);
    sidebar.setStatus("Watching this compose window");
    el.addEventListener("input", () => onEdit(el));
  }

  function onEdit(el) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const text = (el.innerText || "").trim();
      if (text.length < 15 || text === lastText) return;
      lastText = text;
      runCheck(text);
    }, 2000);
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
          sidebar.setStatus("Watching this compose window");
          return; // silent fallback
        }
        const data = res.data;
        const findings = data.judgment || data.verdict?.findings || [];
        sidebar.setStatus(`Watching this compose window · last checked ${new Date().toLocaleTimeString()}`);
        sidebar.renderFindings(findings, "No findings so far.");
      },
    );
  }

  function scan(root) {
    root.querySelectorAll?.(SELECTOR).forEach(attach);
  }

  scan(document);

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (node.matches?.(SELECTOR)) attach(node);
        scan(node);
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
