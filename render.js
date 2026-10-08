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
      ${v.image ? `<img src="${esc(v.image)}" alt="${esc(v.name)}" style="width:100%;max-width:720px;border:1px solid var(--line);border-radius:6px;margin-bottom:8px;">` : ""}
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

  // ---- Mobile menu toggle (runs inside setupSidebars on DOMContentLoaded — safe on every page regardless of where render.js is loaded) ----
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
  renderCompetition();
  renderVillaPage();
  renderElle();
  renderElleLease();
}

// ---- Competition tracker renderer ----
function renderCompetition() {
  const wrap = $("#competitionWrap");
  if (!wrap) return;
  const list = DATA.competitionTracker || [];
  const tbody = $("#competitionTable tbody");
  if (tbody) {
    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="padding:20px;text-align:center;color:var(--muted);">No competition tracked yet. Add entries to <code>data.js</code> COMPETITION_TRACKER array.</td></tr>`;
    } else {
      tbody.innerHTML = list.map(c => `
        <tr>
          <td><strong>${esc(c.title)}</strong><br><span class="muted" style="font-size:11px;">${esc(c.id)}</span></td>
          <td><a href="${esc(c.url)}" target="_blank" rel="noopener" style="color:var(--teal);font-size:12px;">${esc(c.source)} ↗</a></td>
          <td class="num">${esc(c.type || "—")}</td>
          <td>${esc(c.location || "—")}</td>
          <td class="num">${c.price != null ? esc(c.price) : "—"}</td>
          <td class="num">${c.beds != null ? c.beds + "BR" : "—"}</td>
          <td class="num">${esc(c.lastSeen || "—")}</td>
          <td style="font-size:12px;">${esc(c.notes || "")}</td>
          <td style="font-size:11px;color:var(--muted);">${esc(c.status || "")}</td>
          <td style="font-size:11px;color:var(--muted);max-width:200px;">${esc(c.buyerContext || "")}</td>
        </tr>`).join("");
    }
  }
  const empty = $("#competitionEmpty");
  if (empty) empty.style.display = (list.length > 0) ? "none" : "";
  const actionTable = $("#competitionActionTable tbody");
  if (actionTable) {
    actionTable.innerHTML = list.map(c => `
      <tr>
        <td><strong>${esc(c.title)}</strong></td>
        <td style="font-size:12px;">${esc(c.action || "")}</td>
        <td class="num">${esc(c.lastSeen || "—")}</td>
      </tr>`).join("");
  }
  const note = $("#competitionNote");
  if (note) note.textContent = "Track every property a potential buyer mentions — log the URL, extract price/beds/location, and compare to the Phase 1 exit properties (G05/108, 302/108, 5/143 Sussex). Update data.js COMPETITION_TRACKER array and push.";
}

// Boot: wait for DOM fully parsed before querying


/* =============================================================================
   ELLE LEASE INCOME — renders the fractional leasehold position summary data
   from DATA.elle_lease (added 2026-10-08 from the Geonet/SONO/Inspiral lease PDF).
   ============================================================================= */
function renderElleLease() {
  const d = DATA.elle_lease;
  if (!d) return;
  const root = document.getElementById("elleRoot");
  if (!root) return;

  const put = (sel, html) => {
    const w = root.querySelector(sel);
    if (w) w.innerHTML = html;
  };

  // ---------- headline cards ----------
  put("#elleLeaseHeadline", `
    <div class="total-card"><div class="label">Year 1 lease income</div><div class="value">A$${d.headline.year1LeaseIncome.toLocaleString()}</div><div class="sub">guaranteed minimum active (FY2029)</div></div>
    <div class="total-card"><div class="label">Stabilised lease income (Year 5)</div><div class="value">A$${d.headline.year5Stabilised.toLocaleString()}</div><div class="sub">+4.6% p.a. to Year 5</div></div>
    <div class="total-card" style="background:var(--teal);color:#fff;"><div class="label" style="color:#fff;opacity:0.85;">Total operating lease receipts (25 yrs)</div><div class="value" style="color:#fff;">A$${d.headline.totalOperating25.toLocaleString()}</div><div class="sub" style="color:#fff;">15.78% avg rate on advance consideration</div></div>
    <div class="total-card"><div class="label">Lease receipts to consideration ratio</div><div class="value">${d.headline.ratio.toFixed(2)}x</div><div class="sub">lifecycle receipts / advance consideration</div></div>
  `);

  // ---------- investment product ----------
  put("#elleLeaseProduct", `
    <table class="data-table">
      <tbody>
        <tr><td style="width:30%;"><strong>Room type</strong></td><td>${esc(d.leaseStructure.roomType)}</td></tr>
        <tr><td><strong>Precinct / tower</strong></td><td>${esc(d.leaseStructure.precinct)}${d.leaseStructure.tower ? " / " + esc(d.leaseStructure.tower) : ""}</td></tr>
        <tr><td><strong>Fractions</strong></td><td>${d.leaseStructure.fractions}</td></tr>
        <tr><td><strong>Price per fraction</strong></td><td>A$${d.leaseStructure.pricePerFraction.toLocaleString()}</td></tr>
        <tr><td><strong>Key ownership %</strong></td><td>${d.leaseStructure.keyOwnershipPct}%</td></tr>
        <tr><td><strong>Share of lease allocation</strong></td><td>${d.leaseStructure.shareOfLeaseAllocationPct}%</td></tr>
        <tr><td><strong>Advance consideration</strong></td><td>A$${d.leaseStructure.advanceConsideration.toLocaleString()}</td></tr>
        <tr><td><strong>Construction cash rebate</strong></td><td>${d.leaseStructure.constructionRebateRatePct}% p.a. (${d.leaseStructure.constructionRebateAnnual.toLocaleString()}/yr, ${d.leaseStructure.constructionRebateTotal.toLocaleString()} total)</td></tr>
        <tr><td><strong>Adjusted lease price</strong></td><td>A$${d.leaseStructure.adjustedLeasePrice.toLocaleString()}</td></tr>
        <tr><td><strong>Guarantee period</strong></td><td>FY2029–FY2030 (${d.leaseStructure.guaranteeMinYear1.toLocaleString()}/yr minimum)</td></tr>
      </tbody>
    </table>
    <div class="lease-notes">${esc(d.leaseStructure.note || "")}</div>
  `);

  // ---------- room revenue waterfall ----------
  const wf = d.roomWaterfall;
  put("#elleLeaseWaterfall", `
    <div class="waterfall">
      <div class="row"><div class="label">Gross ADR (dirty)</div><div class="val">A$${wf.grossAdr.toLocaleString()}</div><div class="pct">per room night</div></div>
      <div class="row"><div class="label">Less 21% tax &amp; service fee</div><div class="val">A$${wf.taxService.toLocaleString()}</div><div class="pct">statutory deduction</div></div>
      <div class="row"><div class="label">Net (tax &amp; service)</div><div class="val">A$${wf.netTaxService.toLocaleString()}</div></div>
      <div class="row"><div class="label">Less 10% OTA commission</div><div class="val">A$${wf.ota.toLocaleString()}</div></div>
      <div class="row"><div class="label">Net after OTA (clean)</div><div class="val">A$${wf.netAfterOTA.toLocaleString()}</div></div>
      <div class="row"><div class="label">Less 5% sinking fund</div><div class="val">A$${wf.sinkingFund.toLocaleString()}</div></div>
      <div class="row"><div class="label">Net distributable revenue</div><div class="val">A$${wf.netDistributable.toLocaleString()}</div></div>
      <div class="row"><div class="label">Allocation to investor pool (45%)</div><div class="val">A$${wf.investorPool.toLocaleString()}</div></div>
    </div>
  `);

  // ---------- year 1 room + non-room model ----------
  const nm = d.year1RoomModel;
  const nrm = d.year1NonRoomModel;
  put("#elleLeaseRoomModel", `
    <div class="two-col" style="align-items:flex-start;">
      <div>
        <table class="data-table" style="font-size:11px;">
          <tbody>
            <tr><td><strong>ADR (gross, dirty)</strong></td><td class="num">A$${nm.adr.toLocaleString()}</td></tr>
            <tr><td><strong>Net ADR (clean)</strong></td><td class="num">A$${nm.cleanAdr.toLocaleString()}</td></tr>
            <tr><td><strong>Occupancy</strong></td><td class="num">${(nm.occupancy*100).toFixed(0)}%</td></tr>
            <tr><td><strong>Available room nights</strong></td><td class="num">${nm.availableNights.toLocaleString()}</td></tr>
            <tr><td><strong>Occupied room nights (75%)</strong></td><td class="num">${nm.occupiedNights.toLocaleString()}</td></tr>
            <tr><td><strong>Gross room revenue</strong></td><td class="num">A$${nm.grossRoomRevenue.toLocaleString()}</td></tr>
            <tr><td><strong>Investor room pool (45%)</strong></td><td class="num">A$${nm.investorRoomPool45.toLocaleString()}</td></tr>
          </tbody>
        </table>
        <div class="lease-notes" style="margin-top:10px;">
          <b>Non-room / total Year 1 model:</b> Total revenue A$${nrm.totalRevenue.toLocaleString()} (${(nrm.roomsShare*100).toFixed(0)}% rooms / ${(nrm.nonRoomShare*100).toFixed(0)}% non-room). EBITDA margin ${(nrm.ebitdaMargin*100).toFixed(1)}%. NPBT A$${nrm.npbt.toLocaleString()} (${(nrm.npbtMargin*100).toFixed(1)}%). Investor shares: A$${nrm.investorRoomPool.toLocaleString()} room + A$${nrm.investorNonRoomPool.toLocaleString()} non-room = A$${(nrm.investorRoomPool+nrm.investorNonRoomPool).toLocaleString()} total.
        </div>
      </div>
      <div>
        <table class="data-table" style="font-size:11px;">
          <tbody>
            <tr><td><strong>CoGS</strong></td><td class="num">A$${nrm.cogs.toLocaleString()} (${(nrm.cogs/1e6).toFixed(1)}M)</td></tr>
            <tr><td><strong>GOP</strong></td><td class="num">A$${nrm.gop.toLocaleString()} (${(nrm.gop/1e6).toFixed(1)}M, ${(nrm.gop/nrm.totalRevenue*100).toFixed(1)}%)</td></tr>
            <tr><td><strong>EBITDA</strong></td><td class="num">A$${nrm.ebitda.toLocaleString()} (${(nrm.ebitda/1e6).toFixed(1)}M, ${(nrm.ebitda/nrm.totalRevenue*100).toFixed(1)}%)</td></tr>
            <tr><td><strong>NPBT</strong></td><td class="num">A$${nrm.npbt.toLocaleString()} (${(nrm.npbt/1e6).toFixed(1)}M, ${(nrm.npbt/nrm.totalRevenue*100).toFixed(1)}%)</td></tr>
            <tr><td><strong>NPR after distribution</strong></td><td class="num">A$${(nrm.npbt-nrm.investorNonRoomPool).toLocaleString()}</td></tr>
            <tr><td><strong>Profit tax (22%)</strong></td><td class="num">A$${(4000000).toLocaleString()}</td></tr>
            <tr><td><strong>Net profit after tax</strong></td><td class="num">A$${nrm.npat.toLocaleString()} (${(nrm.npatMargin*100).toFixed(1)}%)</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `);

  // ---------- year-by-year schedule ----------
  const rows = d.schedule.map((r, idx) => {
    const isLanding = r.year === "FY2029";
    const isC = r.growth === "n/a";
    const cls = (isLanding ? "landing" : "") + (isC ? " phase-c" : " phase-2");
    const growth = r.growth === "n/a" ? "—" : r.growth;
    return `<tr class="${cls}">
      <td class="num">${r.year}</td>
      <td class="num">${r.phase}</td>
      <td class="num">A$${r.receipts.toLocaleString()}</td>
      <td class="num">${growth}</td>
      <td class="num">A$${r.cumulative.toLocaleString()}</td>
      <td class="num">A$${r.benchmark.toLocaleString()}</td>
      <td class="num">A$${r.gap.toLocaleString()}</td>
    </tr>`;
  }).join("");
  put("#elleLeaseSchedule", `
    <table>
      <thead><tr>
        <th>Year</th><th>Phase</th><th>Leasehold receipts</th><th>Growth</th><th>Cumulative receipts</th><th>Benchmark income</th><th>Cumulative gap</th>
      </tr></thead>
      <tbody>${rows}
        <tr style="background:var(--sand);font-weight:700;">
          <td colspan="3" class="num">Total operating lease receipts</td><td colspan="2" class="num">A$${d.scheduleTotals.totalOperating.toLocaleString()}</td><td colspan="2"></td>
        </tr>
        <tr style="background:var(--sand);font-weight:700;">
          <td colspan="3" class="num">Total construction cash rebates</td><td colspan="2" class="num">A$${d.scheduleTotals.totalConstructionRebates.toLocaleString()}</td><td colspan="2"></td>
        </tr>
        <tr style="background:var(--sand);font-weight:700;">
          <td colspan="3" class="num">Total lifecycle lease receipts</td><td colspan="2" class="num">A$${d.scheduleTotals.totalLifecycle.toLocaleString()}</td><td colspan="2"></td>
        </tr>
        <tr style="background:var(--sand);font-weight:700;">
          <td colspan="3" class="num">Lease receipts to consideration ratio</td><td colspan="2" class="num">${d.scheduleTotals.leaseReceiptsRatio.toFixed(2)}x</td><td colspan="2">Breakeven: ${d.scheduleTotals.breakevenYear}</td>
        </tr>
      </tbody>
    </table>
    <div class="lease-notes">${esc(d.scheduleTotals.note || "")}</div>
  `);

  // ---------- operating sensitivity ----------
  const sens = d.sensitivity;
  const sensRows = Object.values(sens).map(r => `
    <tr>
      <td><strong>${r.label}</strong></td>
      <td class="num">${r.multiplier.toFixed(2)}x</td>
      <td class="num">A$${r.year1.toLocaleString()}</td>
      <td class="num">A$${r.year5.toLocaleString()}</td>
      <td class="num">A$${r.totalOp25.toLocaleString()}</td>
      <td class="num">${r.avgRateAdjustedPct.toFixed(2)}%</td>
      <td class="num">${r.ratio.toFixed(2)}x</td>
      <td class="num">A$${r.totalLifecycle.toLocaleString()}</td>
    </tr>`).join("");
  put("#elleLeaseSensitivity", `
    <table class="scenario-table">
      <thead><tr>
        <th>Scenario</th><th>Multiplier</th><th>Year 1 lease income</th><th>Year 5 stabilised</th><th>Total operating (25 yrs)</th><th>Avg rate on adjusted price</th><th>Receipts ratio</th><th>Total lifecycle</th>
      </tr></thead>
      <tbody>${sensRows}</tbody>
    </table>
  `);

  // ---------- how income is generated ----------
  const inc = d.incomeSource;
  const nonRoom = d.nonRoomRevenue;
  const perKey = nonRoom.perKey;
  const perNight = nonRoom.perOccupiedNight;
  put("#elleLeaseIncomeSource", `
    <div class="two-col" style="align-items:flex-start;">
      <div>
        <p style="font-size:12px;">${esc(inc.headline)}</p>
        <table class="data-table" style="font-size:11px;">
          <tbody>
            <tr><td><strong>Total resort revenue</strong></td><td class="num">A$${nonRoom.totalResort.toLocaleString()}</td></tr>
            <tr><td><strong>Room revenue</strong></td><td class="num">A$${nonRoom.rooms.toLocaleString()} (${(nonRoom.roomsPct).toFixed(1)}%)</td></tr>
            <tr><td><strong>Beach club</strong></td><td class="num">A$${nonRoom.beachClub.toLocaleString()} (${(nonRoom.beachClubPct).toFixed(1)}%)</td></tr>
            <tr><td><strong>Resort F&amp;B</strong></td><td class="num">A$${nonRoom.resortFood.toLocaleString()} (${(nonRoom.resortFoodPct).toFixed(1)}%)</td></tr>
            <tr><td><strong>Events</strong></td><td class="num">A$${nonRoom.events.toLocaleString()} (${(nonRoom.eventsPct).toFixed(1)}%)</td></tr>
            <tr><td><strong>Wellness</strong></td><td class="num">A$${nonRoom.wellness.toLocaleString()} (${(nonRoom.wellnessPct).toFixed(1)}%)</td></tr>
            <tr><td><strong>Other departments</strong></td><td class="num">A$${nonRoom.other.toLocaleString()} (${(nonRoom.otherPct).toFixed(1)}%)</td></tr>
            <tr><td><strong>Room lease pool (45% of rooms)</strong></td><td class="num">A$${inc.roomLeasePool.toLocaleString()}</td></tr>
            <tr><td><strong>Facilities lease pool (30% of NPBT)</strong></td><td class="num">A$${inc.facilitiesLeasePool.toLocaleString()}</td></tr>
            <tr><td><strong>Total lease allocation</strong></td><td class="num"><strong>A$${inc.totalLeasePool.toLocaleString()}</strong></td></tr>
            <tr><td><strong>Your 0.0755% of the total</strong></td><td class="num"><b>A$${inc.blendedYourShare.toLocaleString()} blended lease income/yr</b></td></tr>
            <tr><td><strong>Year 1 lease income (modelled)</strong></td><td class="num"><b>A$${inc.year1LeaseIncome.toLocaleString()}</b></td></tr>
            <tr><td><strong>Year 1 lease income (guaranteed floor)</strong></td><td class="num"><b>A$${inc.year1Guaranteed.toLocaleString()}</b></td></tr>
            <tr><td><strong>Year 5 stabilised lease income</strong></td><td class="num"><b>A$${inc.year5Stabilised.toLocaleString()}</b></td></tr>
          </tbody>
        </table>
        <div class="lease-notes" style="margin-top:10px;">
          <b>How the income is generated:</b> your lease is ONE blended stream. The <b>45% pool is the ROOM revenue pool</b> — 45% of A$${nonRoom.rooms.toLocaleString()} in room revenue goes to the investor room lease pool (A$${inc.roomLeasePool.toLocaleString()}). <b>Non-room revenue does NOT flow at 45%</b> — it consolidates into the P&L, and investors receive <b>30% of Net Profit Before Tax</b> (the A$${inc.facilitiesLeasePool.toLocaleString()} facilities lease pool). Your 0.0755% is of the <b>total lease allocation</b> (A$${inc.totalLeasePool.toLocaleString()}), giving a blended A$${inc.blendedYourShare.toLocaleString()}/yr on the pool — which the model maps to A$${inc.year1LeaseIncome.toLocaleString()} in Year 1 (A$${inc.year1Guaranteed.toLocaleString()} guaranteed floor in FY2029, A$${inc.year5Stabilised.toLocaleString()} stabilised by Year 5).
        </div>
      </div>
      <div>
        <table class="scenario-table" style="font-size:10px;">
          <thead><tr><th>By venue</th><th class="num">Revenue</th><th class="num">Share of resort revenue</th><th class="num">Per key</th><th class="num">Per occupied night</th></tr></thead>
          <tbody>
            <tr><td><strong>Rooms</strong></td><td class="num">A$${nonRoom.rooms.toLocaleString()}</td><td class="num">33.6%</td><td class="num">A$${perKey.rooms.toLocaleString()}</td><td class="num">A$${perNight.rooms.toLocaleString()}</td></tr>
            <tr><td><strong>Beach club</strong></td><td class="num">A$${nonRoom.beachClub.toLocaleString()}</td><td class="num">48.5%</td><td class="num">A$${perKey.beachClub.toLocaleString()}</td><td class="num">A$${perNight.beachClub.toLocaleString()}</td></tr>
            <tr><td><strong>Resort F&amp;B</strong></td><td class="num">A$${nonRoom.resortFood.toLocaleString()}</td><td class="num">7.0%</td><td class="num">A$${perKey.resortFood.toLocaleString()}</td><td class="num">A$${perNight.resortFood.toLocaleString()}</td></tr>
            <tr><td><strong>Events</strong></td><td class="num">A$${nonRoom.events.toLocaleString()}</td><td class="num">1.1%</td><td class="num">A$${perKey.events.toLocaleString()}</td><td class="num">A$${perNight.events.toLocaleString()}</td></tr>
            <tr><td><strong>Wellness</strong></td><td class="num">A$${nonRoom.wellness.toLocaleString()}</td><td class="num">6.6%</td><td class="num">A$${perKey.wellness.toLocaleString()}</td><td class="num">A$${perNight.wellness.toLocaleString()}</td></tr>
            <tr><td><strong>Other departments</strong></td><td class="num">A$${nonRoom.other.toLocaleString()}</td><td class="num">3.3%</td><td class="num">A$${perKey.other.toLocaleString()}</td><td class="num">A$${perNight.other.toLocaleString()}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `);

  // ---------- comparison ----------
  const cmp = d.comparison;
  put("#elleLeaseComparison", `
    <div class="two-col" style="align-items:flex-start;">
      <div>
        <table class="data-table" style="font-size:11px;">
          <tbody>
            <tr><td><strong>Comparable starting lease income rate</strong></td><td class="num">${(cmp.comparableRate*100).toFixed(2)}%</td></tr>
            <tr><td><strong>Comparable annual growth</strong></td><td class="num">${(cmp.comparableGrowth*100).toFixed(2)}%</td></tr>
            <tr><td><strong>Total comparable income (25 yrs)</strong></td><td class="num">A$${cmp.totalComparable25.toLocaleString()}</td></tr>
            <tr><td><strong>Total operating lease receipts (ELLE)</strong></td><td class="num">A$${d.headline.totalOperating25.toLocaleString()}</td></tr>
            <tr><td><strong>Lease income uplift</strong></td><td class="num">A$${(d.headline.totalOperating25 - cmp.totalComparable25).toLocaleString()}</td></tr>
            <tr><td><strong>Uplift %</strong></td><td class="num">${(cmp.upliftPct*100).toFixed(2)}%</td></tr>
            <tr><td><strong>Recovery period</strong></td><td class="num">${cmp.recoveryPeriod}</td></tr>
          </tbody>
        </table>
        <div class="lease-notes" style="margin-top:10px;">${esc(cmp.upliftNote)}</div>
      </div>
      <div>
        <table class="scenario-table" style="font-size:11px;">
          <thead><tr><th>Comparison basis</th><th>Income (25 yrs)</th><th>Uplift / (gap)</th><th>% uplift</th></tr></thead>
          <tbody>
            <tr><td><b>ELLE fractional leasehold</b></td><td class="num">A$${d.headline.totalOperating25.toLocaleString()}</td><td class="num">—</td><td class="num">—</td></tr>
            <tr><td><b>Comparable property (10.50% + 4.50% growth)</b></td><td class="num">A$${cmp.totalComparable25.toLocaleString()}</td><td class="num">${cmp.totalUplift.toLocaleString()}</td><td class="num">${(cmp.upliftPct*100).toFixed(2)}%</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `);

  // ---------- protection features ----------
  const prot = d.protections;
  const c = prot.constructionRebate;
  const g = prot.minimumGuarantee;
  put("#elleLeaseProtections", `
    <div class="two-col" style="align-items:flex-start;">
      <div>
        <table class="data-table" style="font-size:11px;">
          <tbody>
            <tr><td><strong>Construction cash rebate</strong></td><td>${esc(c.note)}</td></tr>
            <tr><td>Rebate rate</td><td class="num">${c.ratePct}% p.a.</td></tr>
            <tr><td>Rebate period</td><td class="num">${c.periodMonths} months (36 months)</td></tr>
            <tr><td>Annual rebate</td><td class="num">A$${c.annual.toLocaleString()}</td></tr>
            <tr><td>Total construction rebate</td><td class="num">A$${c.total.toLocaleString()}</td></tr>
          </tbody>
        </table>
      </div>
      <div>
        <table class="data-table" style="font-size:11px;">
          <tbody>
            <tr><td><b>Minimum lease income guarantee</b></td><td>${esc(g.note)}</td></tr>
            <tr><td>Guarantee period</td><td class="num">FY2029–FY2030 (2 operating years)</td></tr>
            <tr><td>Minimum guaranteed income</td><td class="num">A$${g.minYear1.toLocaleString()}/yr</td></tr>
            <tr><td>Year 1 modelled income</td><td class="num">A$${g.year1Modelled.toLocaleString()}</td></tr>
            <tr><td>Year 1 shortfall payment</td><td class="num">A$${g.year1Shortfall.toLocaleString()}</td></tr>
            <tr><td>Year 1 coverage (modelled / floor)</td><td class="num">${g.coverage.toFixed(2)}x</td></tr>
            <tr><td>Evaluation basis</td><td class="num">Max of modelled income or guaranteed minimum, evaluated independently per year</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `);
}

document.addEventListener("DOMContentLoaded", boot);

/* =============================================================================
   DARK MODE TOGGLE — wired by CSS variable overrides in style.css
   ============================================================================= */
(function() {
  "use strict";
  var STORAGE_KEY = "warrens-exit-darkMode";
  var html = document.documentElement;
  var toggle = null;
  var wired = false;
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
  var wire = function() {
    if (wired) return;
    toggle = document.getElementById("darkModeToggle");
    if (!toggle) return;
    wired = true;
    apply(getPref() === "dark");
    toggle.addEventListener("click", function() {
      var next = html.getAttribute("data-theme") !== "dark";
      apply(next);
      try { localStorage.setItem(STORAGE_KEY, next ? "dark" : "light"); } catch(e) {}
    });
  };
  function maybeApply() {
    if (wired) return;
    toggle = document.getElementById("darkModeToggle");
    if (!toggle) return;
    wired = true;
    // Add click handler FIRST (so button always responds, even if apply fails)
    try {
      toggle.addEventListener("click", function() {
        var next = html.getAttribute("data-theme") !== "dark";
        apply(next);
        try { localStorage.setItem(STORAGE_KEY, next ? "dark" : "light"); } catch(e2) {}
      });
    } catch(e2) {
      // Fallback: inline onclick
      try { toggle.setAttribute("onclick", "var t=document.documentElement;var d=t.getAttribute('data-theme')!=='dark';t.setAttribute('data-theme',d?'dark':null);try{localStorage.setItem('warrens-exit-darkMode',d?'dark':'light');}catch(e){}if(this.classList)try{this.classList.toggle('is-dark',d);}catch(e){}var ic=this.querySelector('.dm-icon');if(ic)ic.textContent=d?'☀️':'🌙';var lb=this.querySelector('.dm-label');if(lb)lb.textContent=d?'Light':'Dark';"); } catch(e3) {}
    }
    // Apply initial preference AFTER handler is wired
    try { apply(getPref() === "dark"); } catch(e2) {}
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
  // MutationObserver: catch the button if render.js loaded before body existed
  var observer = null;
  try {
    observer = new MutationObserver(function() {
      maybeApply();
      if (wired) observer.disconnect();
    });
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
  } catch(e) {}
  var poller = setInterval(function() {
    if (wired || document.readyState === "complete") { clearInterval(poller); return; }
    maybeApply();
  }, 100);
  setTimeout(function() { clearInterval(poller); if (observer) observer.disconnect(); }, 8000);
})();

// =============================================================================
// ELLE RESORT & BEACH CLUB — dedicated page renderer (elle.html)
// Reads DATA.elle. Every element is guarded so render.js stays safe on the
// other pages that share this bundle.
// =============================================================================
function renderElle() {
  const d = DATA.elle ? DATA.elle : DATA.elle_lease;
  if (!d) return;
  const root = $("#elleRoot");
  if (!root) return;

  const put = (sel, html) => {
    const w = $(sel, root);
    if (w) w.innerHTML = html;
  };

  // ---- headline cards ----
  put("#elleKeyCards", `
    <div class="total-card"><div class="label">Keys</div><div class="value">${d.totals.keys}</div><div class="sub">${d.totals.types} room &amp; suite types</div></div>
    <div class="total-card"><div class="label">Entry (USD)</div><div class="value">$${d.product.entryUsd.toLocaleString()}</div><div class="sub">per suite, 50-year term</div></div>
    <div class="total-card" style="background:var(--teal);color:#fff;"><div class="label" style="color:#fff;opacity:0.85;">Projected net (quoted)</div><div class="value">up to 15% p.a.</div><div class="sub" style="color:#fff;opacity:0.9;">+ 8% guaranteed capital repayment in construction</div></div>
    <div class="total-card"><div class="label">Opening clean ADR</div><div class="value" style="font-size:18px;">${esc(d.forecast.openingClean)}</div><div class="sub">${esc(d.forecast.openingOcc)} occupancy · 2028</div></div>
  `);

  // ---- investment product ----
  put("#elleProduct", `
    <table class="data-table">
      <tbody>
        <tr><td style="width:26%;"><strong>Structure</strong></td><td>${esc(d.product.structure)}</td></tr>
        <tr><td><strong>Construction</strong></td><td>${esc(d.product.guarantee)}</td></tr>
        <tr><td><strong>Return</strong></td><td>${esc(d.product.projectedNet)}</td></tr>
        <tr><td><strong>Revenue basis</strong></td><td>${esc(d.product.poolBasis)}</td></tr>
        <tr><td><strong>Perks</strong></td><td>${esc(d.product.perks)}</td></tr>
      </tbody>
    </table>
    <div class="note" style="font-size:12px;color:var(--coral);margin-top:10px;"><strong>Verify before ranking:</strong> ${esc(d.product.verify)}</div>
  `);

  // ---- the two sites ----
  const siteRows = d.sites.map(s => `
    <tr>
      <td><strong>${esc(s.site)}</strong></td>
      <td class="num">${s.areaSqm.toLocaleString()} m²</td>
      <td class="num">${s.keys}</td>
      <td class="num">${s.types}</td>
      <td class="num">${s.buildingArea.toLocaleString()} m²</td>
      <td class="num">${s.footprint.toLocaleString()} m²</td>
      <td class="num">${esc(s.coverage)}</td>
      <td class="muted" style="font-size:11px;">${esc(s.levels)}</td>
    </tr>`).join("");
  put("#elleSiteTable", `
    <table class="data-table">
      <thead><tr><th>Site</th><th class="num">Land</th><th class="num">Keys</th><th class="num">Types</th><th class="num">Building area</th><th class="num">Footprint</th><th class="num">Coverage</th><th>Levels</th></tr></thead>
      <tbody>${siteRows}</tbody>
    </table>
    <div class="note" style="font-size:12px;margin-top:8px;">Two consolidated sites totalling ${esc(d.totals.siteAreaHa)} ha, separated by a small road. The suites join the beach club by tunnel and sky bridge. Land is relatively flat with compact soil and strong ground. Parking: ${d.parking.resortCars} car / ${d.parking.resortScooters} scooter lots at the Resort, ${d.parking.beachClubCars} car / ${d.parking.beachClubScooters} scooter lots at the Beach Club.</div>
  `);

  // ---- unit schedules ----
  const unitRows = list => list.map(u => `
    <tr>
      <td>${esc(u.type)}</td>
      <td class="num">${u.keys}</td>
      <td class="num">${u.internal} m²</td>
      <td>${esc(u.outdoorLabel)} ${u.outdoor} m² <span class="muted">(${u.counted})</span></td>
      <td class="num"><strong>${u.total} m²</strong></td>
    </tr>`).join("");

  const t = d.totals;
  put("#elleResortUnits", `
    <table class="data-table">
      <thead><tr><th>Room / suite type</th><th class="num">Keys</th><th class="num">Internal</th><th>Outdoor (counted at 50%)</th><th class="num">Total / key</th></tr></thead>
      <tbody>${unitRows(d.resortUnits)}
        <tr style="background:var(--sand);"><td><strong>Total — 13 types</strong></td><td class="num"><strong>130</strong></td><td class="num"><strong>${t.resortInternal.toLocaleString()} m²</strong></td><td><strong>${t.resortOutdoor.toLocaleString()} m² (${t.resortCounted})</strong></td><td class="num"><strong>${t.resortTotal.toLocaleString()} m²</strong></td></tr>
      </tbody>
    </table>
  `);
  put("#elleSuiteUnits", `
    <table class="data-table">
      <thead><tr><th>Room / suite type</th><th class="num">Keys</th><th class="num">Internal</th><th>Outdoor (counted at 50%)</th><th class="num">Total / key</th></tr></thead>
      <tbody>${unitRows(d.suiteUnits)}
        <tr style="background:var(--sand);"><td><strong>Total — 8 types</strong></td><td class="num"><strong>38</strong></td><td class="num"><strong>${t.suitesInternal.toLocaleString()} m²</strong></td><td><strong>${t.suitesOutdoor.toLocaleString()} m² (${t.suitesCounted})</strong></td><td class="num"><strong>${t.suitesTotal.toLocaleString()} m²</strong></td></tr>
      </tbody>
    </table>
  `);

  // ---- full 21-type size range ----
  const all = [
    ...d.resortUnits.map(u => ({ ...u, coll: "Resort" })),
    ...d.suiteUnits.map(u => ({ ...u, coll: "Suites" }))
  ].sort((a, b) => b.total - a.total);
  put("#elleSizeRange", `
    <table class="data-table" style="font-size:12px;">
      <thead><tr><th>Type</th><th>Collection</th><th class="num">Internal</th><th class="num">Outdoor</th><th class="num">Total / key</th><th style="width:34%;">Relative size</th></tr></thead>
      <tbody>${all.map(u => `
        <tr>
          <td>${esc(u.type)}</td>
          <td class="muted">${esc(u.coll)}</td>
          <td class="num">${u.internal} m²</td>
          <td class="num">${u.outdoor} m²</td>
          <td class="num"><strong>${u.total} m²</strong></td>
          <td><div style="background:var(--teal);height:9px;border-radius:2px;width:${(u.total / 251 * 100).toFixed(1)}%;opacity:0.75;"></div></td>
        </tr>`).join("")}
      </tbody>
    </table>
    <div class="note" style="font-size:12px;margin-top:8px;">Ordered by total area per key. The largest type is Beach Club Penthouse B — 175 m² internal with a 76 m² terrace. The smallest, at 45 m² internal, appears twice: as the Resort Standard Room and as Regular Suite C.</div>
  `);

  // ---- comp set ----
  put("#elleCompSet", `
    <table class="data-table" style="font-size:12px;">
      <thead><tr><th>Property</th><th class="num">Size</th><th>Positioning</th><th class="num">Published OTA range (AUD)</th></tr></thead>
      <tbody>${d.compSet.map(c => `
        <tr${c.name.indexOf("Bvlgari") === 0 ? ' style="opacity:0.6;"' : ""}>
          <td><strong>${esc(c.name)}</strong></td>
          <td class="num">${esc(c.size)}</td>
          <td class="muted">${esc(c.positioning)}</td>
          <td class="num">${esc(c.rate)}</td>
        </tr>`).join("")}
      </tbody>
    </table>
    <div class="note" style="font-size:12px;margin-top:8px;">ELLE's stated positioning band is <strong>${esc(d.market.elleBand)}</strong>. The Legian reset the AUD ceiling in 2024. Bvlgari sits off this scale entirely — a villa product outside ELLE's positioning and product type. [TripAdvisor, Booking.com, Agoda, Kayak, Google Hotels — verified June 2026]</div>
  `);

  // ---- global lifestyle set ----
  const clusterParts = d.cluster.split(" — ");
  put("#elleGlobalSet", `
    <table class="data-table" style="font-size:12px;">
      <thead><tr><th>Property</th><th class="num">Estimated annualised realised ADR (AUD)</th></tr></thead>
      <tbody>${d.globalSet.map(g => `
        <tr><td><strong>${esc(g.name)}</strong></td><td class="num">${esc(g.rate)}</td></tr>`).join("")}
      </tbody>
    </table>
    <div class="note" style="font-size:12px;margin-top:8px;"><strong>The comparable cluster: ${esc(clusterParts[0])}.</strong> ${esc(clusterParts.slice(1).join(" — "))}</div>
  `);

  // ---- premium mechanisms ----
  const mechRows = d.premium.mechanisms.map(m => `
    <tr><td><strong>${esc(m.name)}</strong></td><td class="num">${esc(m.value)}</td><td class="muted" style="font-size:11px;">${esc(m.source)}</td></tr>`).join("");
  const opRows = d.premium.ops.map(m => `
    <tr><td><strong>${esc(m.name)}</strong>${m.note ? `<br><span class="muted" style="font-size:11px;">${esc(m.note)}</span>` : ""}</td><td class="num">${esc(m.value)}</td><td class="muted" style="font-size:11px;">${esc(m.source)}</td></tr>`).join("");
  put("#ellePremium", `
    <div class="two-col">
      <div>
        <h3>The beach club, measured</h3>
        <p style="font-size:12px;">Four mechanisms of brand-driven ADR premium over a non-branded upper upscale lifestyle comparator.</p>
        <table class="data-table" style="font-size:12px;"><thead><tr><th>Mechanism</th><th class="num">Value</th><th>Source</th></tr></thead><tbody>${mechRows}</tbody></table>
      </div>
      <div>
        <h3>Operating and distribution effects</h3>
        <p style="font-size:12px;">The same premium read through operations rather than rate.</p>
        <table class="data-table" style="font-size:12px;"><thead><tr><th>Metric</th><th class="num">Value</th><th>Source</th></tr></thead><tbody>${opRows}</tbody></table>
      </div>
    </div>
    <div class="note" style="font-size:12px;margin-top:10px;">
      <strong>Combined ELLE brand premium: ${esc(d.premium.combined)}.</strong> ${esc(d.premium.combinedNote)}
    </div>
    <div class="note" style="font-size:11px;color:var(--muted);margin-top:6px;">Sources: ${esc(d.premium.sources)}</div>
  `);

  // ---- forecast table ----
  put("#elleForecast", `
    <table class="data-table">
      <thead><tr><th>Rate type</th><th class="num">Conservative</th><th class="num">Base case</th><th class="num">Optimistic</th><th class="num">USD source</th></tr></thead>
      <tbody>${d.forecast.table.map(r => `
        <tr>
          <td><strong>${esc(r.rate)}</strong></td>
          <td class="num">${esc(r.conservative)}</td>
          <td class="num" style="background:var(--sand);"><strong>${esc(r.base)}</strong></td>
          <td class="num">${esc(r.optimistic)}</td>
          <td class="num muted">${esc(r.usd)}</td>
        </tr>`).join("")}
      </tbody>
    </table>
    <div class="note" style="font-size:11px;color:var(--muted);margin-top:6px;">${esc(d.forecast.cleanNote)}</div>
  `);

  // ---- ramp trajectory ----
  put("#elleRamp", `
    <table class="data-table">
      <thead><tr><th>Year</th><th class="num">Base case clean ADR band (AUD)</th><th>Stage</th><th style="width:28%;">&nbsp;</th></tr></thead>
      <tbody>${d.forecast.ramp.map(r => {
        const digits = r.band.replace(/[^0-9]/g, "");
        const hi = parseInt(digits.length > 3 ? digits.slice(3) : digits, 10);
        const w = Math.max(6, Math.min(100, (isNaN(hi) ? 600 : hi) / 900 * 100));
        return `
        <tr>
          <td><strong>${esc(r.year)}</strong></td>
          <td class="num">${esc(r.band)}</td>
          <td class="muted">${esc(r.stage)}</td>
          <td><div style="background:var(--teal);height:11px;border-radius:2px;width:${w.toFixed(0)}%;opacity:0.75;"></div></td>
        </tr>`;
      }).join("")}
      </tbody>
    </table>
    <div class="note" style="font-size:12px;margin-top:8px;">${esc(d.forecast.rampNote)}</div>
  `);

  // ---- ceiling ladder + scenarios ----
  put("#elleCeiling", `
    <div class="two-col">
      <div>
        <h3>Hard ceiling by scenario — competitor published mid-points</h3>
        <table class="data-table" style="font-size:12px;">
          <thead><tr><th>Property</th><th class="num">Mid-point (AUD)</th></tr></thead>
          <tbody>${d.ceiling.ladder.map(c => `<tr><td>${esc(c.name)}</td><td class="num">${esc(c.rate)}</td></tr>`).join("")}</tbody>
        </table>
        <div class="note" style="font-size:11px;color:var(--muted);margin-top:6px;">${esc(d.ceiling.bvlgari)}</div>
      </div>
      <div>
        <h3>Phase 2 scenario set — published rate</h3>
        <table class="data-table" style="font-size:12px;">
          <thead><tr><th>Scenario</th><th class="num">Published rate (AUD)</th></tr></thead>
          <tbody>${d.ceiling.scenarios.map(c => `
            <tr><td><strong>${esc(c.name)}</strong></td><td class="num">${esc(c.range)}</td></tr>`).join("")}
          </tbody>
        </table>
        <div class="note" style="font-size:11px;color:var(--coral);margin-top:6px;">${esc(d.ceiling.scenarioNote)}</div>
      </div>
    </div>
  `);

  // ---- milestones ----
  put("#elleMilestones", `
    <div class="two-col" style="align-items:flex-start;">
      ${d.milestones.map(m => `
        <div>
          <h3>${esc(m.area)}</h3>
          <ul style="font-size:12px;margin:4px 0 0;padding-left:18px;">
            ${m.items.map(i => `<li style="margin-bottom:3px;">${esc(i)}</li>`).join("")}
          </ul>
        </div>`).join("")}
    </div>
    <div class="note" style="font-size:12px;margin-top:10px;">${esc(d.milestoneNote)}</div>
  `);

  // ---- amenity chips ----
  put("#elleAmenities", d.amenities.map(a => `<span class="badge" style="display:inline-block;margin:0 6px 6px 0;">${esc(a)}</span>`).join(""));

  // ---- masterplan zones ----
  put("#elleZones", d.masterplanZones.map((z, i) => `<span class="badge" style="display:inline-block;margin:0 6px 6px 0;">${i + 1}. ${esc(z)}</span>`).join(""));

  // ---- verdict ----
  put("#elleVerdict", `
    <div style="background:var(--sand);border:1px solid var(--sand-dark);padding:14px 16px;border-radius:8px;">
      <h3 style="margin:0 0 6px;font-size:14px;color:var(--teal);">${esc(d.verdict.headline)}</h3>
      <div style="font-size:13px;font-style:italic;">"${esc(d.verdict.pull)}"</div>
    </div>
    <div class="note" style="font-size:12px;margin-top:10px;">${esc(d.verdict.againstCriteria)}</div>
  `);
}
