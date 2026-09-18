/* =============================================================================
   OPTION 1 BALI — INCOME STRATEGY
   Renders strategy data from strategies_data.js into balinese.html
   ============================================================================= */

function renderBaliStrategy() {
  const d = DATA.baliStrategy;
  if (!d) return;

  // ---- Strategy flow diagram (text + steps) ----
  const overviewSection = document.getElementById("strategyOverview");
  if (overviewSection) {
    const steps = d.steps || [];
    const stepsHtml = steps.map((s, i) => {
      return `<li style="margin-bottom:6px;"><strong>Step ${i+1} — ${esc(s.title)}</strong><br><span style="font-size:12px;color:var(--muted);">${esc(s.detail || "")}</span>${s.caveat ? ` <span style="color:var(--coral);font-size:11px;">⚠ ${esc(s.caveat)}</span>` : ""}`;
    }).join("");
    const flowEl = document.getElementById("strategyFlowSteps");
    if (flowEl) flowEl.innerHTML = stepsHtml;
  }

  // ---- PT PMA section ----
  const ptPmaSection = document.getElementById("ptPmaDetails");
  if (ptPmaSection && d.ptPma) {
    ptPmaSection.innerHTML = `
      <div class="two-col" style="margin-top:12px;">
        <div>
          <h3>PT PMA — what you're building</h3>
          <p style="font-size:12.5px;color:var(--muted);">${esc(d.ptPma.description || "")}</p>
          <table class="data-table" style="font-size:12px;margin-top:10px;">
            <thead><tr><th>Attribute</th><th>Value / requirement</th></tr></thead>
            <tbody>
              ${d.ptPma.attributes.map(a => `<tr><td><strong>${esc(a.key)}</strong></td><td style="font-size:12px;">${esc(a.value)}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
        <div>
          <h3>Indonesia-Singapore links to verify</h3>
          <table class="data-table" style="font-size:12px;margin-top:10px;">
            <thead><tr><th>Topic</th><th>What to confirm</th></tr></thead>
            <tbody>
              ${d.ptPma.treatyChecks.map(t => `<tr><td><strong>${esc(t.topic)}</strong></td><td style="font-size:12px;">${esc(t.confirm)}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ---- Tax table (populated inline in HTML, but we verify data presence) ----
  // Tax comparison is static in the HTML; render.js just wires lastUpdated.
  // ---- Risks from data if present ----
  const risksSection = document.getElementById("risksList");
  if (risksSection && d.risks) {
    risksSection.innerHTML = d.risks.map(r => `
      <div class="note" style="font-size:12px;margin-bottom:10px;">
        <strong>${esc(r.num) + ". " + esc(r.title)}</strong> ${esc(r.body)}
      </div>
    `).join("");
  }
}

/* =============================================================================
   BOOT hook — called from balinese.html's own script tag
   ============================================================================= */
function bootBaliStrategy() {
  if (typeof setupSidebars === "function") setupSidebars();
  const lu = document.getElementById("lastUpdated");
  if (lu) lu.textContent = "Last updated: " + (DATA.lastUpdated || "2026-09-18");
  const fl = document.getElementById("footerLastUpdated");
  if (fl) fl.textContent = DATA.lastUpdated || "2026-09-18";
  renderBaliStrategy();
}
