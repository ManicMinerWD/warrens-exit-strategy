/* =============================================================================
   OPTION 1 BALI — INCOME STRATEGY
   Renders strategy data from data.js (DATA.baliStrategy) into containers.
   Safe to call from any page that loads data.js + this script.
   ============================================================================= */

function renderBaliStrategyButtons() {
  const d = DATA && DATA.baliStrategy;
  if (!d || !d.steps || !d.steps.length) return;
  const container = document.getElementById("baliStrategyButtons");
  if (!container) return;
  container.style.display = "";
  container.innerHTML = `<h2 style="font-size:14px;margin:0 0 10px;color:var(--teal);">Option 1 Bali — income strategy <span style="font-size:11px;color:var(--muted);font-weight:normal;">(PT PMA → Mandiri → IDX domestic shares)</span></h2>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;">
      ${d.steps.map((s, i) => `<a href="balinese.html#step${i+1}" class="callout" style="background:var(--sand);border-color:var(--sand-dark);padding:8px 12px;border-radius:6px;text-decoration:none;color:var(--ink);font-size:12px;display:inline-block;"><strong>Step ${i+1} — ${esc(s.title)}</strong></a>`).join("")}
    </div>`;
}

function renderBaliStrategy() {
  const d = DATA && DATA.baliStrategy;
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
  const lu = document.getElementById("lastUpdated");
  if (lu) lu.textContent = "Last updated: " + (DATA.lastUpdated || "2026-09-18");
  const fl = document.getElementById("footerLastUpdated");
  if (fl) fl.textContent = DATA.lastUpdated || "2026-09-18";
  renderBaliStrategy();
}
