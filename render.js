/* =============================================================================
   Warrens Exit Strategy — chart + table renderers  v2  (2026-09-13)
   Reads DATA from data.js; renders into the sections below.
   ============================================================================= */
"use strict";

/* ---------- shared helpers ---------- */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const el = (tag, attrs={}, children=[]) => {
  const e = document.createElement(tag);
  for (const k in attrs) {
    if (k === "className") e.className = attrs[k];
    else if (k === "textContent") e.textContent = attrs[k];
    else if (attrs[k] !== null && attrs[k] !== undefined) e.setAttribute(k, attrs[k]);
  }
  for (const c of children) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  return e;
};

/* number formatting (matches data.js) */
const fmt = _fmt;
const pct = _pct;
const usd = _usd;
const lab = _lab;
const mon = m => _mon[m-1];

/* =============================================================================
   1. ANNUAL ARRIVALS — chart + table
   ============================================================================= */
function renderAnnual() {
  const wrap = $("#annualWrap");
  if (!wrap) return;

  // table
  const rows = DATA.arrAnnual.map(d => {
    const intlM = (d.intl/1e6).toFixed(2);
    const domM = (d.dom/1e6).toFixed(2);
    const totM = ((d.intl+d.dom)/1e6).toFixed(2);
    return `<tr class="num">
      <td class="yr">${d.year}</td>
      <td>${intlM}<span class="unit">M</span></td>
      <td>${domM}<span class="unit">M</span></td>
      <td>${totM}<span class="unit">M</span></td>
      <td class="src">${esc(d.src)}</td>
    </tr>`;
  }).join("");
  wrap.querySelector("#annualTable tbody").innerHTML = rows;

  // chart
  const ctx = $("#annualChart");
  if (ctx) {
    new Chart(ctx, {
      type:"bar",
      data:{
        labels: DATA.arrAnnual.map(d=>d.year),
        datasets:[
          { label:"International", data:DATA.arrAnnual.map(d=>d.intl), backgroundColor:"#0d4f4f", borderRadius:4 },
          { label:"Domestic", data:DATA.arrAnnual.map(d=>d.dom), backgroundColor:"#e07856", borderRadius:4 },
        ]
      },
      options:{
        responsive:true,
        plugins:{
          title:{ display:true, text:"Bali annual arrivals — international vs domestic", color:"#1a1a1a", font:{size:14, weight:"600"}, padding:{bottom:12} },
          tooltip:{ callbacks:{ label:ctx=>ctx.dataset.label+"  "+(ctx.raw/1000).toFixed(1)+"M" } }
        },
        scales:{
          y:{ beginAtZero:true, ticks:{ callback:v=>(v/1e6).toFixed(0)+"M" }, grid:{ color:"#f0ebe0" } },
          x:{ grid:{ display:false } }
        }
      }
    });
  }
}

/* =============================================================================
   2. MONTHLY ARRIVALS — chart + table (2025 + 2026)
   ============================================================================= */
function renderMonthly() {
  const wrap = $("#monthlyWrap");
  if (!wrap) return;

  // 2025 rows (Jan–Dec)
  const rows2025 = DATA.arrMonthly.filter(d=>d.y===2025).map(d=>`
    <tr${d.est?" class=\"est\"":""}>
      <td>${mon(d.m)} 2025</td>
      <td class="num">${fmt(d.intl)}</td>
      <td class="num">${fmt(d.dom)}</td>
      <td class="num">${fmt(d.intl+d.dom)}</td>
    </tr>`).join("");

  // 2026 rows (Jan–Jul)
  const rows2026 = DATA.arrMonthly.filter(d=>d.y===2026).map(d=>`
    <tr${d.est?" class=\"est\"":""}>
      <td>${mon(d.m)} 2026</td>
      <td class="num">${fmt(d.intl)}</td>
      <td class="num">${fmt(d.dom)}</td>
      <td class="num">${fmt(d.intl+d.dom)}</td>
    </tr>`).join("");

  const tbody = $("#monthlyTable tbody");
  if (tbody) {
    tbody.innerHTML = `
      <tr><th colspan="4" class="subhead">2025 (full year, BPS)</th></tr>
      ${rows2025}
      <tr><th colspan="4" class="subhead">2026 (through July; Jun–Jul estimated)</th></tr>
      ${rows2026}
      <tr class="note-row"><td colspan="4">Rows marked <span class="est-badge">EST</span> are estimates pending BPS release.</td></tr>
    `;
  }

  // chart: 2025 Jan–Dec + 2026 Jan–Jul as one series (dual color by year)
  const ctx = $("#monthlyChart");
  if (ctx) {
    const all = [...DATA.arrMonthly.filter(d=>d.y===2025), ...DATA.arrMonthly.filter(d=>d.y===2026 && d.m<=7)];
    const labels = all.map(d=>d.y===2026 ? mon(d.m)+" '"+(d.y.toString().slice(2)) : mon(d.m));
    const colors = all.map(d=> d.y===2025 ? "rgba(13,79,79,0.8)" : "rgba(224,120,86,0.85)");
    new Chart(ctx, {
      type:"line",
      data:{
        labels,
        datasets:[
          { label:"Foreign arrivals", data:all.map(d=>d.intl), borderColor:"#0d4f4f", backgroundColor:"rgba(13,79,79,0.08)", fill:true, tension:0.3, pointRadius:3, pointHoverRadius:6, borderWidth:2 },
          { label:"Domestic arrivals", data:all.map(d=>d.dom), borderColor:"#e07856", backgroundColor:"rgba(224,120,86,0.05)", fill:true, tension:0.3, pointRadius:2, pointHoverRadius:5, borderWidth:2, borderDash:[4,3] },
        ]
      },
      options:{
        responsive:true,
        plugins:{
          title:{ display:true, text:"Bali monthly arrivals — international (solid) vs domestic (dashed)", color:"#1a1a1a", font:{size:14, weight:"600"}, padding:{bottom:12} },
          tooltip:{ callbacks:{ label:ctx=>ctx.dataset.label+"  "+fmt(ctx.raw) } },
          legend:{ position:"top" }
        },
        scales:{
          y:{ beginAtZero:false, ticks:{ callback:v=>(v/1000).toFixed(0)+"k" }, grid:{ color:"#f0ebe0" } },
          x:{ grid:{ display:false }, ticks:{ maxTicksLimit:14 } }
        }
      }
    });
  }
}

/* =============================================================================
   3. GATE ARRIVALS (BPS) — chart + table
   ============================================================================= */
function renderGate() {
  const wrap = $("#gateWrap");
  if (!wrap) return;

  // table
  const rows = DATA.gate2026.map(d=>{
    const tot = d.airport + d.harbour;
    return `<tr>
      <td>${mon(d.m)} ${d.y}</td>
      <td class="num">${fmt(d.airport)}</td>
      <td class="num">${fmt(d.harbour)}</td>
      <td class="num">${fmt(tot)}</td>
      <td class="pct">${(d.harbour/tot*100).toFixed(1)}%</td>
    </tr>`;
  }).join("");
  const tbody = $("#gateTable tbody");
  if (tbody) tbody.innerHTML = rows;

  const gn = $("#gateNote");
  if (gn) gn.innerHTML = `<strong>Note:</strong> BPS gate data counts all foreign visitors passing through Bali's entry points (including transit and same-day entries). Total airport + harbour exceeds the headline "foreign tourist arrivals" figure because the gate table is broader — it captures all foreign entry, not just overnight tourists. Harbour share is small but growing with cruise traffic. Source: <a href="https://bali.bps.go.id/en/statistics-table/2/MTA2IzI=/" target="_blank" rel="noopener">BPS Bali gate table</a>.`;

  // chart
  const ctx = $("#gateChart");
  if (ctx) {
    new Chart(ctx, {
      type:"bar",
      data:{
        labels: DATA.gate2026.map(d=>mon(d.m)),
        datasets:[
          { label:"Ngurah Rai Airport", data:DATA.gate2026.map(d=>d.airport), backgroundColor:"#0d4f4f", borderRadius:4 },
          { label:"Bali Harbour", data:DATA.gate2026.map(d=>d.harbour), backgroundColor:"#e07856", borderRadius:4 },
        ]
      },
      options:{
        responsive:true,
        plugins:{
          title:{ display:true, text:"Foreign visitors by entry point — BPS Bali gate data (Jan–Jul 2026)", color:"#1a1a1a", font:{size:14, weight:"600"}, padding:{bottom:12} },
          tooltip:{ callbacks:{ label:ctx=>ctx.dataset.label+"  "+fmt(ctx.raw) } },
          legend:{ position:"top" }
        },
        scales:{
          y:{ beginAtZero:true, ticks:{ callback:v=>(v/1000).toFixed(0)+"k" }, grid:{ color:"#f0ebe0" } },
          x:{ grid:{ display:false } }
        }
      }
    });
  }
}

/* =============================================================================
   4. TOP SOURCE MARKETS — 2025 full year + March 2026 snapshot
   ============================================================================= */
function renderMarkets() {
  const wrap = $("#marketsWrap");
  if (!wrap) return;

  // 2025 table
  const rows2025 = DATA.market2025.map(d=>`
    <tr class="num">
      <td>${d.rank}</td>
      <td>${esc(d.country)}</td>
      <td class="num">${fmt(d.arrivals)}</td>
      <td class="pct">${d.share.toFixed(2)}%</td>
      <td>${esc(d.yoy)}</td>
    </tr>`).join("");
  const tbody2025 = $("#markets2025 tbody");
  if (tbody2025) tbody2025.innerHTML = rows2025;

  // chart: 2025 top 10
  const ctx2025 = $("#marketsChart2025");
  if (ctx2025) {
    new Chart(ctx2025, {
      type:"bar",
      data:{
        labels: DATA.market2025.map(d=>d.country),
        datasets:[{ label:"2025 arrivals", data:DATA.market2025.map(d=>d.arrivals), backgroundColor:DATA.market2025.map((_,i)=> i===0 ? "#0d4f4f" : "rgba(13,79,79,0.7)"), borderRadius:3 }]
      },
      options:{
        indexAxis:"y",
        responsive:true,
        plugins:{
          title:{ display:true, text:"Top 10 source markets — Bali 2025 (full year)", color:"#1a1a1a", font:{size:14, weight:"600"}, padding:{bottom:12} },
          tooltip:{ callbacks:{ label:ctx=>(ctx.raw/1000).toFixed(0)+"k arrivals  ("+DATA.market2025[ctx.dataIndex].share.toFixed(1)+"% share)" } }
        },
        scales:{
          x:{ ticks:{ callback:v=>(v/1000).toFixed(0)+"k" }, grid:{ color:"#f0ebe0" } },
          y:{ grid:{ display:false } }
        }
      }
    });
  }

  // March 2026 snapshot note
  const note = $("#marketsNote");
  if (note) note.textContent = DATA.march2026SnapshotNote;
}

/* =============================================================================
   5. HOTEL OCCUPANCY (BPS TPK) — chart + table
   ============================================================================= */
function renderHotelOccupancy() {
  const wrap = $("#hotelOccWrap");
  if (!wrap) return;

  // star table
  const starRows = DATA.tpkStar.map(d=>`
    <tr>
      <td>${mon(d.m)} ${d.y}</td>
      <td class="pct num">${d.v.toFixed(2)}%</td>
    </tr>`).join("");
  $("#tpkStarTable tbody").innerHTML = starRows;

  // non-star table
  const nsRows = DATA.tpkNonStar.map(d=>`
    <tr>
      <td>${mon(d.m)} ${d.y}</td>
      <td class="pct num">${d.v.toFixed(2)}%</td>
    </tr>`).join("");
  $("#tpkNonStarTable tbody").innerHTML = nsRows;

  // April 2026 by region
  const regRows = DATA.tpkApril2026ByRegion.map(d=>`
    <tr>
      <td>${esc(d.region)}</td>
      <td class="pct num">${d.tpk.toFixed(2)}%</td>
      <td class="note">${esc(d.note)}</td>
    </tr>`).join("");
  $("#tpkRegionTable tbody").innerHTML = regRows;

  // star chart
  const ctxStar = $("#tpkStarChart");
  if (ctxStar) {
    new Chart(ctxStar, {
      type:"line",
      data:{
        labels: DATA.tpkStar.map(d=>mon(d.m)+" '"+d.y.toString().slice(2)),
        datasets:[{ label:"Star-rated hotels (TPK)", data:DATA.tpkStar.map(d=>d.v), borderColor:"#0d4f4f", backgroundColor:"rgba(13,79,79,0.1)", fill:true, tension:0.3, pointRadius:4, pointHoverRadius:7, borderWidth:2.5 }]
      },
      options:{
        responsive:true,
        plugins:{
          title:{ display:true, text:"Bali star-rated hotel room occupancy (TPK) — BPS", color:"#1a1a1a", font:{size:14, weight:"600"}, padding:{bottom:12} },
          tooltip:{ callbacks:{ label:ctx=>ctx.raw.toFixed(2)+"% occupancy" } }
        },
        scales:{
          y:{ min:20, max:80, ticks:{ callback:v=>v+"%" }, grid:{ color:"#f0ebe0" } },
          x:{ grid:{ display:false }, ticks:{ maxTicksLimit:12 } }
        }
      }
    });
  }

  // non-star chart
  const ctxNs = $("#tpkNonStarChart");
  if (ctxNs) {
    new Chart(ctxNs, {
      type:"line",
      data:{
        labels: DATA.tpkNonStar.map(d=>mon(d.m)+" '"+d.y.toString().slice(2)),
        datasets:[{ label:"Non-star / other (TPK)", data:DATA.tpkNonStar.map(d=>d.v), borderColor:"#e07856", backgroundColor:"rgba(224,120,86,0.1)", fill:true, tension:0.3, pointRadius:3, pointHoverRadius:6, borderWidth:2, borderDash:[4,3] }]
      },
      options:{
        responsive:true,
        plugins:{
          title:{ display:true, text:"Bali non-star hotel & other accommodation TPK — BPS", color:"#1a1a1a", font:{size:14, weight:"600"}, padding:{bottom:12} },
          tooltip:{ callbacks:{ label:ctx=>ctx.raw.toFixed(2)+"% occupancy" } }
        },
        scales:{
          y:{ min:20, max:50, ticks:{ callback:v=>v+"%" }, grid:{ color:"#f0ebe0" } },
          x:{ grid:{ display:false }, ticks:{ maxTicksLimit:10 } }
        }
      }
    });
  }
}

/* =============================================================================
   6. LENGTH OF STAY — table
   ============================================================================= */
function renderLOS() {
  const wrap = $("#losWrap");
  if (!wrap) return;

  // 2026 monthly
  const rows2026 = DATA.losMonthly2026.map(d=>`
    <tr>
      <td>${mon(d.m)} ${d.y}</td>
      <td class="num">${d.foreign.toFixed(2)}</td>
      <td class="num">${d.domestic.toFixed(2)}</td>
      <td class="num">${d.total.toFixed(2)}</td>
    </tr>`).join("");
  $("#los2026 tbody").innerHTML = rows2026;

  // 2025 annual
  const a = DATA.los2025Annual;
  $("#los2025Annual tbody").innerHTML = `
    <tr><td>2025 (full year)</td><td class="num">${a.foreign.toFixed(2)}</td><td class="num">${a.domestic.toFixed(2)}</td><td class="note">${esc(a.note)}</td></tr>
  `;
}

/* =============================================================================
   7. BALI ECONOMY (GDP) — chart + table
   ============================================================================= */
function renderEconomy() {
  const wrap = $("#economyWrap");
  if (!wrap) return;

  // GDP by quarter table
  const qRows = DATA.gdpQuarterly.map(d=>`
    <tr>
      <td>${d.y} ${d.q}</td>
      <td class="pct num">${d.g.toFixed(2)}%</td>
    </tr>`).join("");
  $("#gdpQuarterTable tbody").innerHTML = qRows;

  // full year table
  const fyRows = DATA.gdpFullYear.map(d=>`
    <tr>
      <td>${d.y} (full year)</td>
      <td class="pct num">${d.g.toFixed(2)}%</td>
    </tr>`).join("");
  $("#gdpFullYearTable tbody").innerHTML = fyRows;

  // 2026 Q1
  const q1 = DATA.gdp2026Q1;
  $("#gdpQ1Table tbody").innerHTML = `
    <tr><td>${q1.y} ${q1.q} (preliminary)</td><td class="pct num">${q1.g.toFixed(2)}%</td><td class="note">${esc(q1.note)}</td></tr>
  `;

  // tourism share callout
  const ts = $("#tourismShare");
  if (ts) ts.innerHTML = `<span class="big-num">${DATA.tourismShare2024.toFixed(2)}%</span> of Bali GDP (2024) — tourism sector contribution`;

  // GDP chart
  const ctx = $("#gdpChart");
  if (ctx) {
    const labels = [...DATA.gdpQuarterly.map(d=>d.y+" "+d.q), ...DATA.gdpFullYear.map(d=>d.y+" (FY)"), DATA.gdp2026Q1.y+" "+DATA.gdp2026Q1.q];
    const values = [...DATA.gdpQuarterly.map(d=>d.g), ...DATA.gdpFullYear.map(d=>d.g), DATA.gdp2026Q1.g];
    const colors = [...DATA.gdpQuarterly.map(()=>"#0d4f4f"), ...DATA.gdpFullYear.map(()=>"#14706b"), "#e07856"];
    new Chart(ctx, {
      type:"bar",
      data:{
        labels,
        datasets:[{ label:"Bali GDP growth (YoY %)", data:values, backgroundColor:colors, borderRadius:3 }]
      },
      options:{
        responsive:true,
        plugins:{
          title:{ display:true, text:"Bali provincial GDP growth — BPS", color:"#1a1a1a", font:{size:14, weight:"600"}, padding:{bottom:12} },
          tooltip:{ callbacks:{ label:ctx=>ctx.raw.toFixed(2)+"% YoY" } },
          legend:{ display:false }
        },
        scales:{
          y:{ beginAtZero:true, ticks:{ callback:v=>v+"%" }, grid:{ color:"#f0ebe0" } },
          x:{ grid:{ display:false }, ticks:{ maxTicksLimit:10, font:{size:10} } }
        }
      }
    });
  }
}

/* =============================================================================
   8. STR / AIRBNB MARKET — summary cards
   ============================================================================= */
function renderSTR() {
  const wrap = $("#strWrap");
  if (!wrap) return;

  const a = DATA.strMarket.airbnb;
  const ad = DATA.strMarket.airdna;
  const vm = DATA.strMarket.villaMarket;
  const sgn = v => (v == null ? "" : (v >= 0 ? "+" : "")) + (v == null ? "—" : v) + "%";

  // ---- Airbnb (Airbtics) table ----
  $("#sAirbnbPeriod").textContent = a.period || "—";
  $("#sAirbnbOcc").textContent = (a.occupancy != null ? a.occupancy : "—") + "%";
  $("#sAirbnbOcc1y").textContent = sgn(a.occupancyChange1y);
  $("#sAirbnbOcc1yNote").textContent = a.occupancyChange1y != null ? (a.occupancyChange1y >= 0 ? "Up YoY" : "Down YoY") : "n/a";
  $("#sAirbnbOcc3yV").textContent = a.occupancyChange3y != null ? (a.occupancyChange3y >= 0 ? "+" : "") + a.occupancyChange3y + "%" : "—";
  $("#sAirbnbOcc3yNote").textContent = a.occupancyChange3y != null ? (a.occupancyChange3y >= 0 ? "Up vs 3yr ago" : "Down vs 3yr ago") : "n/a";

  // ---- AirDNA (all STR) table ----
  $("#sAirdnaPeriod").textContent = ad.period || "—";
  $("#sAirdnaOcc").textContent = (ad.occupancy != null ? ad.occupancy : "—") + "%";
  $("#sAirdnaOccChg").textContent = sgn(ad.occupancyChange);
  $("#sAirdnaAdr").textContent = usd(ad.adr);
  $("#sAirdnaAdrChg").textContent = sgn(ad.adrChange);
  $("#sAirdnaRevpar").textContent = usd(ad.revpar);
  $("#sAirdnaRevparChg").textContent = sgn(ad.revparChange);
  $("#sAirdnaListings").textContent = ad.activeListings != null ? ad.activeListings.toLocaleString() : "—";
  $("#sAirdnaListingsChg").textContent = sgn(ad.activeListingsChange);

  // ---- Villa / STR market table ----
  $("#sVillaPeriod").textContent = vm.period || "—";
  $("#sVillaOcc").textContent = (vm.occupancy != null ? vm.occupancy : "—") + "%";
  $("#sVillaOccNote").textContent = (vm.occupancyRange || "—");
  $("#sVillaAdr").textContent = "~" + usd(vm.adr);
  $("#sVillaAdrNote").textContent = (vm.adrRange || "—");

  // ---- Disclaimer ----
  const disc = $("#strDisclaimer");
  if (disc) disc.textContent = DATA.strMarket.disclaimer;
}

/* =============================================================================
   9. PROPERTY PRICES & ADR BY ZONE — grids
   ============================================================================= */
function renderPriceAdr() {
  const wrap = $("#priceAdrWrap");
  if (!wrap) return;

  // price grid table
  const priceHeader = `<tr><th>Area</th>${DATA.bedrooms.map(b=>`<th>${b}-BR</th>`).join("")}</tr>`;
  const priceRows = DATA.areas.map((area,i)=>`
    <tr>
      <td class="area-name">${esc(area)}</td>
      ${DATA.bedrooms.map(b=>`
        <td class="num${DATA.priceGridUsd[i][b-1]===0?" blank":""}">${DATA.priceGridUsd[i][b-1]===0?"—":usd(DATA.priceGridUsd[i][b-1])}</td>
      `).join("")}
    </tr>`).join("");
  $("#priceGridTable thead").innerHTML = priceHeader;
  $("#priceGridTable tbody").innerHTML = priceRows;

  // ADR grid table
  const adrHeader = `<tr><th>Area</th>${DATA.bedrooms.map(b=>`<th>${b}-BR</th>`).join("")}</tr>`;
  const adrRows = DATA.areas.map((area,i)=>`
    <tr>
      <td class="area-name">${esc(area)}</td>
      ${DATA.bedrooms.map(b=>`
        <td class="num">${usd(DATA.adrGridUsd[i][b-1])}</td>
      `).join("")}
    </tr>`).join("");
  $("#adrGridTable thead").innerHTML = adrHeader;
  $("#adrGridTable tbody").innerHTML = adrRows;

  // price/sqm + avg size note
  const ps = $("#priceSqmNote");
  if (ps) {
    const apt = DATA.pricePerSqm.apartment;
    const vil = DATA.pricePerSqm.villa;
    ps.innerHTML = `
      <p><strong>Price per sqm (USD, Q3 2025):</strong> Apartments — 1BR $${apt[1].toLocaleString()} / 2BR $${apt[2].toLocaleString()}. Villas — 1BR $${vil[1].toLocaleString()} / 2BR $${vil[2].toLocaleString()} / 3BR $${vil[3].toLocaleString()} / 4BR $${vil[4].toLocaleString()} / 5BR $${vil[5].toLocaleString()} / 6BR $${vil[6].toLocaleString()}.</p>
      <p><strong>Average size (sqm):</strong> 1BR ${DATA.avgSizeSqm[1]} · 2BR ${DATA.avgSizeSqm[2]} · 3BR ${DATA.avgSizeSqm[3]} · 4BR ${DATA.avgSizeSqm[4]} · 5BR ${DATA.avgSizeSqm[5]} · 6BR ${DATA.avgSizeSqm[6]}.</p>
      <p class="stat-note">Source: Reid Real Info 2025 Market Report via Investlandbali.com.</p>
    `;
  }
}

/* =============================================================================
   10. HOTEL REPORT HIGHLIGHTS
   ============================================================================= */
function renderHotelReport() {
  const wrap = $("#hotelReportWrap");
  if (!wrap) return;

  const h = DATA.hotelReport;
  $("#hotelReportTitle").textContent = h.source;
  $("#hotelReportList").innerHTML = h.highlights.map(t=>`<li>${esc(t)}</li>`).join("");
}

/* =============================================================================
   VILLA SHORTLIST — sidebar submenu
   ============================================================================= */
function renderVillaShortlist() {
  const menu = $("#villaSubmenu");
  if (!menu) return;
  const list = DATA.villaShortlist || [];
  menu.innerHTML = list.map(v => {
    const detail = (v.flag + " " + esc(v.zone)) +
      (v.br != null ? " · " + v.br + "BR" : "") +
      (v.priceUsd != null ? " · $" + v.priceUsd.toLocaleString("en-AU") : "") +
      (v.leaseTo ? " · lease to " + v.leaseTo : "");
    const statusLine = v.status.indexOf("Completed") >= 0
      ? "Available now"
      : esc(v.status);
    const zoningWarn = v.zoning && v.zoning.toLowerCase().indexOf("not stated") >= 0
      ? `<span class="x-ref">⚠ Zoning not stated — confirm</span>`
      : `<span class="x-ref">${esc(v.zoning)}</span>`;
    return `<li class="sidebar-submenu-item">
      <a class="sidebar-submenu-btn" href="${esc(v.url)}" target="_blank" rel="noopener">
        <span class="sub-icon">📌</span>
        <span class="sub-label">${esc(v.name)}</span>
        <span style="font-size:11px;color:var(--muted);line-height:1.4;">
          ${detail}<br>${statusLine}<br>${zoningWarn}
        </span>
      </a>
    </li>`;
  }).join("");
}

/* =============================================================================
   INVESTMENT SUBMENU — sidebar list of investment table rows
   ============================================================================= */
function renderInvestmentSubmenu() {
  const menu = $("#investmentTableSubmenu");
  if (!menu) return;
  const list = DATA.investmentTable || [];
  menu.innerHTML = list.map(v => {
    const beds = v.beds != null ? (typeof v.beds === "number" ? v.beds+"BR" : String(v.beds)) : "";
    const price = v.priceUsd != null ? " · $" + v.priceUsd.toLocaleString("en-AU") : "";
    return `<li class="sidebar-submenu-item">
      <a class="sidebar-submenu-btn" href="#investmentTableWrap">
        <span class="sub-icon">💰</span>
        <span class="sub-label">${esc(v.name)}</span>
        <span style="font-size:11px;color:var(--muted);line-height:1.4;">
          ${esc(v.location)}${beds}${price}<br>
          ROI: ${esc(v.roi)}<br>
          Status: ${esc(v.status)}
        </span>
      </a>
    </li>`;
  }).join("");
}

/* =============================================================================
   INVESTMENT TABLE — full comparison table in main content
   ============================================================================= */
function renderInvestmentTable() {
  const tbody = $("#investmentTable tbody");
  if (!tbody) return;
  const rows = (DATA.investmentTable || []).map(v => {
    const beds = v.beds != null ? (typeof v.beds === "number" ? v.beds+"BR" : String(v.beds)) : "—";
    const price = v.priceUsd != null ? "$"+v.priceUsd.toLocaleString("en-AU") : "—";
    const lease = v.leaseTo != null ? v.leaseTo : "—";
    return `<tr>
      <td><strong>${esc(v.name)}</strong><br><span class="muted" style="font-size:12px;">${esc(v.id)}</span></td>
      <td>${esc(v.location)}</td>
      <td class="num">${beds}</td>
      <td class="num">${price}</td>
      <td>${esc(v.roi)}</td>
      <td>${esc(v.status)}</td>
      <td class="num">${lease}</td>
      <td class="muted" style="font-size:12px;">${esc(v.operator)}</td>
      <td class="verdict-cell">${esc(v.verdict)}</td>
    </tr>`;
  }).join("");
  tbody.innerHTML = rows;
}

/* =============================================================================
   11. VILLA SHORTLIST PAGE — full-page detail table for villas.html
   ============================================================================= */
function renderVillaPage() {
  const tbody = $("#villaPageTable tbody");
  if (!tbody) return;

  const rows = (DATA.villaShortlist || []).map(v => {
    const br = v.br != null ? v.br + "BR" : "—";
    const price = v.priceUsd != null ? "$" + v.priceUsd.toLocaleString("en-AU") : "—";
    const lease = v.leaseTo != null ? v.leaseTo : "—";
    const statusLine = (v.status || "") + (v.when ? " — " + v.when : "");
    const zoning = v.zoning || "—";
    const zoningCls = zoning.toLowerCase().indexOf("not stated") >= 0 ? " color:var(--coral);font-weight:600;" : "";
    return `<tr>
      <td><strong>${esc(v.name)}</strong><br><span class="muted" style="font-size:11px;">${esc(v.id)}</span></td>
      <td>${esc(v.zone)}</td>
      <td class="num">${br}</td>
      <td class="num">${price}</td>
      <td class="num">${lease}</td>
      <td style="font-size:12px${zoningCls}">${esc(zoning)}</td>
      <td style="font-size:12px;">${esc(statusLine)}</td>
      <td style="font-size:11px;"><a href="${esc(v.url)}" target="_blank" rel="noopener" style="color:var(--teal);">${esc(v.url.split("/").pop())}</a></td>
    </tr>`;
  }).join("");
  tbody.innerHTML = rows;

  // Detail cards below the table
  const detailEl = $("#villaPageDetails");
  if (!detailEl) return;
  const cards = (DATA.villaShortlist || []).map((v, i) => {
    const price = v.priceUsd != null ? "$" + v.priceUsd.toLocaleString("en-AU") : "—";
    const br = v.br != null ? v.br + "BR" : "—";
    const lease = v.leaseTo != null ? "Lease to " + v.leaseTo : "Lease term not stated";
    const zoningNote = v.zoning && v.zoning.toLowerCase().indexOf("not stated") >= 0
      ? `<span style="color:var(--coral);">⚠ ${esc(v.zoning)} — confirm before proceeding</span>`
      : esc(v.zoning);
    const statusLine = v.status + (v.when ? " · " + v.when : "");
    return `<div class="section" style="margin-bottom:14px;">
      <h3>${esc(v.name)} <span class="badge" style="font-size:10px;">${esc(v.id)}</span></h3>
      <table class="data-table" style="margin-top:8px;font-size:13px;">
        <tr><td style="width:120px;"><strong>Zone</strong></td><td>${esc(v.zone)}</td></tr>
        <tr><td><strong>Price</strong></td><td class="num">${price}</td></tr>
        <tr><td><strong>Bedrooms</strong></td><td class="num">${br}</td></tr>
        <tr><td><strong>Lease to</strong></td><td>${lease}</td></tr>
        <tr><td><strong>Zoning</strong></td><td>${zoningNote}</td></tr>
        <tr><td><strong>Status</strong></td><td>${esc(statusLine)}</td></tr>
        <tr><td><strong>Operator</strong></td><td>${esc(v.operator || "TBC")}</td></tr>
      </table>
      <div class="note" style="font-size:12px;margin-top:6px;">${esc(v.note || "")}</div>
      <div class="note" style="font-size:12px;margin-top:4px;color:${v.verdict.indexOf("watch") >= 0 || v.verdict.indexOf("not a lead") >= 0 ? "var(--coral)" : "var(--teal)"};"><strong>Verdict:</strong> ${esc(v.verdict || "")}</div>
      ${v.projections ? renderProjectionTable(v.projections) : ""}
      <p style="font-size:11px;margin-top:6px;"><a href="${esc(v.url)}" target="_blank" rel="noopener" style="color:var(--teal);">View source listing →</a></p>
    </div>`;
  }).join("");
  detailEl.innerHTML = cards;
}

/* =============================================================================
   PROJECTION TABLE — Balitecture-stated occupancy projection (Casa Petak)
   ============================================================================= */
function renderProjectionTable(p) {
  if (!p || !p.rows || !p.scenarios) return "";
  const thead = "<tr><th>" + esc(p.caption || "Projection") + "</th>" +
    p.scenarios.map(s => "<th class=\"num\">" + esc(s) + "</th>").join("") + "</tr>";
  const tbody = p.rows.map(r => {
    const cells = r.vals.map((v, i) => {
      let txt = v == null ? "—" : String(v);
      if (r.pct) txt = (v * 100).toFixed(1) + "%";
      if (r.years) txt = v.toFixed(1) + " years";
      if (!r.pct && !r.years && typeof v === "number" && v >= 1000) txt = "$" + v.toLocaleString("en-AU");
      return "<td class=\"num\">" + esc(txt) + "</td>";
    }).join("");
    return "<tr><td>" + esc(r.label) + "</td>" + cells + "</tr>";
  }).join("");
  return "<div class=\"section\" style=\"margin-top:14px;margin-bottom:6px;\">" +
    "<h4 style=\"font-size:13px;margin:0 0 6px;color:var(--muted);\">" +
    esc(p.caption) + " <span style=\"font-weight:normal;font-size:11px;\">— " + esc(p.source) + "</span></h4>" +
    "<table class=\"data-table\" style=\"font-size:13px;\"><thead>" + thead + "</thead><tbody>" + tbody + "</tbody></table>" +
    "<div style=\"font-size:11px;color:var(--muted);margin-top:4px;\">Estimates based on operator-stated model. Confirm independently before committing.</div>" +
    "</div>";
}

/* =============================================================================
   SIDEBAR — collapse/expand groups, mobile toggle, active link highlight
   Also wires dynamically-rendered sub-menus (Villa Shortlist, Investment Table)
   ============================================================================= */
function setupSidebars() {
  var body = document.body;
  if (!body) return;

  // ---- Global error catch: any throw is visible in console, not silently killing the sidebar ----
  window.addEventListener("error", function(e) {
    var t = e && e.target;
    if (t && (t.tagName === "SCRIPT" || t.tagName === "LINK" || t.tagName === "STYLE")) return;
    console.error("[render.js] error:", e.message, e.filename, e.lineno, e.colno);
  }, true);

  function toggleChevron(chev, open) {
    if (!chev) return;
    chev.classList.toggle("rotated", !!open);
  }

  // ---- Group labels ----
  var groupLabels = body.querySelectorAll(".sidebar-group-label");
  for (var i = 0; i < groupLabels.length; i++) {
    (function(label) {
      label.addEventListener("click", function(e) {
        if (!label) return;
        var dataAttr = label.getAttribute && label.getAttribute("data-group");
        if (!dataAttr) return;
        var content = document.querySelector && document.querySelector('.sidebar-group-content[data-group="' + dataAttr + '"]') || null;
        label.classList.toggle("collapsed");
        if (content) content.classList.toggle("collapsed");
        var chev = label.querySelector && label.querySelector(".chevron") || null;
        if (chev) toggleChevron(chev, !content || !content.classList.contains("collapsed"));
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation) e.stopPropagation();
      });
    })(groupLabels[i]);
  }

  // ---- Sub-group headers (static) ----
  var subHeaders = body.querySelectorAll(".collapsible-sub-header");
  for (var j = 0; j < subHeaders.length; j++) {
    (function(header) {
      header.addEventListener("click", function(e) {
        if (!header) return;
        var dataAttr = header.getAttribute && header.getAttribute("data-sub");
        if (!dataAttr) return;
        var content = document.querySelector && document.querySelector('.collapsible-sub-content[data-sub="' + dataAttr + '"]') || null;
        header.classList.toggle("collapsed");
        if (content) content.classList.toggle("collapsed");
        var chev = header.querySelector && header.querySelector(".chevron") || null;
        if (chev) toggleChevron(chev, !content || !content.classList.contains("collapsed"));
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation) e.stopPropagation();
      });
    })(subHeaders[j]);
  }

  // ---- Event delegation: catches dynamically-injected sub-headers (Villa Shortlist, Investment Table) ----
  document.addEventListener("click", function(e) {
    if (!e || !e.target) return;
    var closest = e.target.closest ? e.target.closest(".collapsible-sub-header") : null;
    if (!closest) return;
    var dataAttr = closest.getAttribute && closest.getAttribute("data-sub");
    if (!dataAttr) return;
    var content = document.querySelector && document.querySelector('.collapsible-sub-content[data-sub="' + dataAttr + '"]') || null;
    closest.classList.toggle("collapsed");
    if (content) content.classList.toggle("collapsed");
    var chev = closest.querySelector && closest.querySelector(".chevron") || null;
    if (chev) chev.classList.toggle("rotated", !content || !content.classList.contains("collapsed"));
    // Let link clicks inside sub-headers navigate naturally
    var link = e.target.closest ? e.target.closest("a") : null;
    if (!link && e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  });

  // ---- Mobile menu toggle ----
  var sidebar = document.getElementById && document.getElementById("sidebar") || null;
  var btn = document.getElementById && document.getElementById("menuToggle") || null;
  if (sidebar && btn) {
    btn.addEventListener("click", function() {
      if (!sidebar || !sidebar.classList) return;
      var open = sidebar.classList.toggle("open");
      if (btn && btn.textContent !== undefined) btn.textContent = open ? "\u2715 Close" : "\u2630 Menu";
    });
    document.addEventListener("click", function(e) {
      if (!e || !e.target) return;
      if (sidebar && sidebar.classList && !sidebar.contains(e.target) && e.target !== btn && (!btn || !btn.contains(e.target))) {
        sidebar.classList.remove("open");
        if (btn && btn.textContent !== undefined) btn.textContent = "\u2630 Menu";
      }
    });
  }

  // ---- Bali Statistics section locking (index.html ONLY — standalone pages skip this section) ----
  var showAllBtn = document.getElementById && document.getElementById("balistatsShowAll") || null;
  if (showAllBtn) {
    var baliStatsLinks = body.querySelectorAll && body.querySelectorAll(".sidebar-group-content[data-group=\"baliStats\"] .nav-link") || [];
    var baliStatsIds = [];
    for (var i = 0; i < baliStatsLinks.length; i++) {
      var href = baliStatsLinks[i].getAttribute && baliStatsLinks[i].getAttribute("href");
      if (href && href.charAt && href.charAt(0) === "#") baliStatsIds.push(href.slice(1));
    }
    if (baliStatsIds.length > 1 && showAllBtn) {
      // "Show all" button — restore every section
      showAllBtn.addEventListener("click", function() {
        for (var k = 0; k < baliStatsIds.length; k++) {
          var el = document.getElementById(baliStatsIds[k]);
          if (el) el.classList.remove("balistats-hidden");
        }
        showAllBtn.classList.remove("visible");
        for (var l = 0; l < baliStatsLinks.length; l++) baliStatsLinks[l].classList.remove("active");
      });
      // Each nav-link hides all others and shows only itself
      for (var m = 0; m < baliStatsLinks.length; m++) {
        (function(link, id) {
          link.addEventListener("click", function(e) {
            if (!link) return;
            if (e && e.preventDefault) e.preventDefault();
            for (var n = 0; n < baliStatsIds.length; n++) {
              var sec = document.getElementById(baliStatsIds[n]);
              if (sec && sec.classList) sec.classList.add("balistats-hidden");
            }
            var target = document.getElementById(id);
            if (target && target.classList) target.classList.remove("balistats-hidden");
            if (showAllBtn && showAllBtn.classList) showAllBtn.classList.add("visible");
            for (var o = 0; o < baliStatsLinks.length; o++) { var lb = baliStatsLinks[o]; if (lb && lb.classList) lb.classList.remove("active"); }
            if (link.classList) link.classList.add("active");
            if (target && target.scrollIntoView) target.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        })(baliStatsLinks[m], baliStatsIds[m]);
      }
    }
  }
}

/* =============================================================================
   BOOT — render everything, set last-updated
   ============================================================================= */
function boot() {
  const lu = $("#lastUpdated");
  if (lu) lu.textContent = "Last updated: " + DATA.lastUpdated;
  const fl = $("#footerLastUpdated");
  if (fl) fl.textContent = DATA.lastUpdated;

  setupSidebars();
  renderVillaShortlist();
  renderInvestmentSubmenu();
  renderInvestmentTable();
  renderAnnual();
  renderMonthly();
  renderGate();
  renderMarkets();
  renderHotelOccupancy();
  renderLOS();
  renderEconomy();
  renderSTR();
  renderPriceAdr();
  renderHotelReport();
  renderVillaPage();
}

// Boot: wait for DOM fully parsed before querying
document.addEventListener("DOMContentLoaded", boot);

/* =============================================================================
   DARK MODE TOGGLE — wired by CSS variable overrides in style.css
   ============================================================================= */
(function() {
  "use strict";
  var STORAGE_KEY = "warrens-exit-darkMode";
  var html = document.documentElement;
  var toggle = document.getElementById("darkModeToggle");
  var apply = function(isDark) {
    if (isDark) { html.setAttribute("data-theme", "dark"); }
    else { html.removeAttribute("data-theme"); }
    if (toggle) {
      toggle.classList.toggle("is-dark", isDark);
      toggle.innerHTML = isDark
        ? '<span class="dm-icon">☀️</span><span class="dm-label">Light</span>'
        : '<span class="dm-icon">🌙</span><span class="dm-label">Dark</span>';
    }
  };
  var getPref = function() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch(e) {}
    if (saved === "dark" || saved === "light") return saved;
    try {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    } catch(e) {}
    return "light";
  };
  apply(getPref() === "dark");
  if (toggle) {
    toggle.addEventListener("click", function() {
      var next = html.getAttribute("data-theme") !== "dark";
      apply(next);
      try { localStorage.setItem(STORAGE_KEY, next ? "dark" : "light"); } catch(e) {}
    });
  }
})();
