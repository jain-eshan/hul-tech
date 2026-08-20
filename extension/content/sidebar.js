// Shared sidebar UI, loaded before docs.js / gmail.js in the same isolated world so
// both content scripts can call window.PRAMAAN_SIDEBAR directly. Shadow DOM (closed
// mode) so the host page's CSS can't leak in, and the sidebar's CSS can't leak out.

(function () {
  if (window.PRAMAAN_SIDEBAR) return; // guard against double-injection

  const MARKETS = [
    "IN", "AE", "ZA", "BR", "ID", "PH", "TH", "MX", "EG", "UK", "DE", "VN", "US",
  ];

  const SEVERITY_COLOR = {
    critical: "#e0524f",
    major: "#d9a441",
    minor: "#d9a441",
  };

  const CSS = `
    :host { all: initial; }
    .panel {
      position: fixed; top: 0; right: 0; width: 280px; height: 100vh;
      background: #17181c; color: #e8e8ea; font-family: Arial, Helvetica, sans-serif;
      font-size: 13px; box-shadow: -2px 0 12px rgba(0,0,0,0.35);
      display: flex; flex-direction: column; z-index: 2147483647;
    }
    .header {
      padding: 12px 14px; border-bottom: 1px solid #2a2b30;
      display: flex; align-items: center; justify-content: space-between;
    }
    .wordmark { font-weight: 700; letter-spacing: 0.08em; font-size: 12px; color: #f0d98a; }
    select {
      background: #222327; color: #e8e8ea; border: 1px solid #35363c; border-radius: 4px;
      font-size: 11px; padding: 3px 6px;
    }
    .status { padding: 8px 14px; font-size: 11px; color: #8a8b93; border-bottom: 1px solid #2a2b30; }
    .list { flex: 1; overflow-y: auto; padding: 10px; }
    .empty { color: #8a8b93; font-size: 12px; padding: 12px 4px; line-height: 1.5; }
    .card {
      background: #1e1f24; border-radius: 6px; padding: 10px; margin-bottom: 8px;
      border-left: 3px solid #444;
    }
    .card .title { font-weight: 600; margin-bottom: 4px; line-height: 1.35; }
    .card .quote {
      color: #b9bac2; font-style: italic; margin-bottom: 6px; line-height: 1.4;
      border-left: 2px solid #35363c; padding-left: 6px;
    }
    .card .cite { color: #8a8b93; font-size: 11px; margin-bottom: 6px; }
    .card .explain { color: #c7c8ce; line-height: 1.4; margin-bottom: 8px; }
    .card .fix { color: #9fd18a; font-size: 11px; margin-bottom: 6px; line-height: 1.4; }
    button {
      background: #2a2b30; color: #e8e8ea; border: 1px solid #3a3b41; border-radius: 4px;
      padding: 4px 8px; font-size: 11px; cursor: pointer;
    }
    button:hover { background: #35363c; }
    button:active { background: #222327; }
  `;

  let shadow = null;
  let els = {};
  let onMarketChange = null;

  function ensure(emptyText) {
    if (shadow) return;
    const host = document.createElement("div");
    host.id = "pramaan-sidebar-host";
    document.documentElement.appendChild(host);
    shadow = host.attachShadow({ mode: "closed" });

    const style = document.createElement("style");
    style.textContent = CSS;
    shadow.appendChild(style);

    const panel = document.createElement("div");
    panel.className = "panel";
    panel.innerHTML = `
      <div class="header">
        <span class="wordmark">PRAMAAN</span>
        <select id="market"></select>
      </div>
      <div class="status" id="status"></div>
      <div class="list" id="list"></div>
    `;
    shadow.appendChild(panel);

    els.market = shadow.getElementById("market");
    els.status = shadow.getElementById("status");
    els.list = shadow.getElementById("list");

    MARKETS.forEach((m) => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      els.market.appendChild(opt);
    });
    els.market.value = "IN";
    els.market.addEventListener("change", () => {
      if (onMarketChange) onMarketChange(els.market.value);
    });

    setEmpty(emptyText);
  }

  function getMarket() {
    return els.market ? els.market.value : "IN";
  }

  function setOnMarketChange(fn) {
    onMarketChange = fn;
  }

  function setStatus(text) {
    if (els.status) els.status.textContent = text;
  }

  function setEmpty(text) {
    if (!els.list) return;
    els.list.innerHTML = `<div class="empty">${escapeHtml(text)}</div>`;
  }

  function renderFindings(findings, emptyText) {
    if (!els.list) return;
    if (!findings || !findings.length) {
      setEmpty(emptyText);
      return;
    }
    els.list.innerHTML = "";
    findings.forEach((f) => els.list.appendChild(buildCard(f)));
  }

  function buildCard(f) {
    const card = document.createElement("div");
    card.className = "card";
    card.style.borderLeftColor = SEVERITY_COLOR[f.severity] || "#444";

    const citeParts = [];
    if (f.regulator) citeParts.push(f.regulator);
    citeParts.push(f.clauseRef || f.ruleId || "");
    const cite = citeParts.filter(Boolean).join(" · ");

    const fixText = f.fixReplacement || f.suggestedFix || "";
    const altText = f.altFix || "";

    card.innerHTML = `
      <div class="title">${escapeHtml(f.title || f.ruleId || "Finding")}</div>
      <div class="quote">"${escapeHtml(f.quotedText || "")}"</div>
      <div class="cite">${escapeHtml(cite)}</div>
      <div class="explain">${escapeHtml(f.explanation || "")}</div>
      ${fixText ? `<div class="fix">Fix: ${escapeHtml(fixText)}</div>` : ""}
      ${altText && !fixText ? `<div class="fix">${escapeHtml(altText)}</div>` : ""}
    `;

    if (fixText) {
      const btn = document.createElement("button");
      btn.textContent = "Copy fixed wording";
      btn.addEventListener("click", () => {
        copyText(fixText).then(() => {
          btn.textContent = "Copied";
          setTimeout(() => (btn.textContent = "Copy fixed wording"), 1500);
        });
      });
      card.appendChild(btn);
    }

    return card;
  }

  function copyText(text) {
    // navigator.clipboard.writeText can silently fail inside a closed shadow root in
    // some Chrome versions; fall back to the execCommand trick, which always works
    // from a user-gesture click handler.
    return navigator.clipboard.writeText(text).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      shadow.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      shadow.removeChild(ta);
    });
  }

  function escapeHtml(s) {
    const div = document.createElement("div");
    div.textContent = String(s ?? "");
    return div.innerHTML;
  }

  window.PRAMAAN_SIDEBAR = {
    ensure,
    getMarket,
    setOnMarketChange,
    setStatus,
    setEmpty,
    renderFindings,
  };
})();
