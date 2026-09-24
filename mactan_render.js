/* =============================================================================
   MACTAN OPTION 2 — Punta Engaño, Cebu
   Renders MACTAN data from data.js into mactan.html
   ============================================================================= */
function renderMactan() {
  const d = DATA.mactan;
  if (!d) return;

  // ---- Land section ----
  const land = d.land;
  $("#mactanLandRow").innerHTML = `
    <div class="total-card"><div class="label">Lot area</div><div class="value">${land.area} m²</div><div class="sub">${land.frontage || ''}</div></div>
    <div class="total-card" style="background:var(--teal);color:#fff;"><div class="label" style="color:#fff;opacity:0.85;">Price (PHP)</div><div class="value">₱${land.pricePhp.toLocaleString()}</div><div class="sub" style="color:#fff;opacity:0.9;">≈ ${land.priceAud.toLocaleString()} AUD</div></div>
    <div class="total-card"><div class="label">Type</div><div class="value" style="font-size:14px;">${land.type}</div><div class="sub">${land.location}</div></div>
  `;

  // ---- Build budget phases table ----
  const phaseRows = d.build.phases.map(p => `
    <tr${p.coveredByCleared ? ' style="background:var(--sand);"':''}>
      <td><strong>${esc(p.name)}</strong></td>
      <td class="num">${p.php != null ? '₱' + p.php.toLocaleString() : '—'}</td>
      <td class="num">${p.aud != null ? '$' + p.aud.toLocaleString() : '—'}</td>
      <td>${p.coveredByCleared ? '✅ Within cleared $587k' : (p.ratio != null ? '📊 ' + p.ratio.toFixed(2) + '× covered' : 'deferred')}</td>
      <td class="muted" style="font-size:11px;">${esc(p.note || '')}</td>
    </tr>
  `).join('');
  $("#mactanPhaseTable tbody").innerHTML = phaseRows;

  // ---- Build breakdown table ----
  const bd = d.build.villaBreakdown;
  const breakdownRows = [
    ["Grey build — low (structure, roof, cladding, windows, doors, sliding)", bd.greyBuildLow],
    ["Staff quarters (caretaker, in-shell — keeps 6BR rentable)", bd.staffQuarters],
    ["Finishes (walls, cabinetry, wiring)", bd.finishes],
    ["Luxury metallic epoxy flooring", bd.luxuryEpoxyFlooring],
    ["Cabinetry — $2,000 AUD per bedroom + TV room (7 spaces)", bd.cabinetry],
    ["Kitchen upgrade — $10,000 AUD", bd.kitchenUpgrade],
    ["Bathrooms — $2,000 AUD each (7 baths: 6 ensuite + 1 common)", bd.bathrooms],
    ["Lot cost", bd.lotCost],
    ["Pool", bd.pool],
    ["Solar 10kW", bd.solar10kw],
    ["Contingency 10% (on build ex-lot)", bd.contingency10pct]
  ].map(r => `
    <tr><td>${esc(r[0])}</td><td class="num">₱${r[1].toLocaleString()}</td><td class="num">$${(r[1]/37.5).toLocaleString(undefined,{maximumFractionDigits:0})}</td></tr>
  `).join('');
  $("#mactanBreakdownTable tbody").innerHTML = breakdownRows;
  $("#mactanTotalPhp").textContent = '₱' + d.build.totalPhp.toLocaleString();
  $("#mactanTotalAud").textContent = '$' + d.build.totalAud.toLocaleString();
  $("#mactanGap").textContent = (d.build.totalAud - 587000) >= 0 ? '+' : '';
  $("#mactanGap").textContent += '$' + (d.build.totalAud - 587000).toLocaleString();
  $("#mactanGap").className = (d.build.totalAud - 587000) > 0 ? 'num' : 'num';
  $("#mactanGapNote").textContent = d.build.gapNote;

  // ---- Specs ----
  const s = d.build.specs;
  $("#mactanSpecsTable").innerHTML = `
    <tr><td style="width:140px;">Floors</td><td>${s.floors}-storey</td></tr>
    <tr><td>Floor area (per floor)</td><td>${s.floorAreaPerFloor} m²</td></tr>
    <tr><td>Total build area (approx)</td><td>${s.totalBuildArea} m²</td></tr>
    <tr><td>Bedrooms</td><td>${s.bedrooms}BR</td></tr>
    <tr><td>Bathrooms</td><td>${s.bathrooms} (6 ensuite + 1 common)</td></tr>
  `;
  $("#mactanSpecsNote").textContent = s.designNote;

  // ---- Market competitors ----
  const compRows = d.market.competitors.map(c => `
    <tr>
      <td><strong>${esc(c.name)}</strong></td>
      <td class="num">${c.beds}BR</td>
      <td class="num">${esc(c.rateUsd)}</td>
      <td class="num">${esc(c.rateAud)}</td>
      <td class="num">${esc(c.occupancy)}</td>
      <td class="num">${esc(c.monthlyAud)}</td>
      <td class="muted" style="font-size:11px;">${esc(c.source)}</td>
    </tr>
  `).join('');
  $("#mactanMarketTable tbody").innerHTML = compRows;

  // ---- Your target ----
  const t = d.market.yourTarget;
  $("#mactanYourTarget").innerHTML = `
    <td class="num" style="font-size:16px;font-weight:700;color:var(--teal);">${esc(t.rateUsd)}</td>
    <td class="num" style="font-size:16px;font-weight:700;color:var(--teal);">${esc(t.rateAud)}</td>
    <td class="num">${esc(t.occupancy)}</td>
    <td class="num" style="font-size:14px;">${esc(t.nightlyImplied)}</td>
  `;

  // ---- Premium scenarios ----
  const sc = d.market.premiumScenarios;
  const scenarioRows = [
    ["Market match (Anza $844/night)", sc.marketMatch.rateUsd, sc.marketMatch.occ, sc.marketMatch.monthlyAud, sc.marketMatch.annualAudNet75],
    ["Premium (superior styling, $1,100/night)", sc.premium.rateUsd, sc.premium.occ, sc.premium.monthlyAud, sc.premium.annualAudNet75],
    ["Premium high season ($1,400/night)", sc.premiumHigh.rateUsd, sc.premiumHigh.occ, sc.premiumHigh.monthlyAud, sc.premiumHigh.annualAudNet75]
  ].map(r => `
    <tr><td>${esc(r[0])}</td><td class="num">$${r[1]}/night</td><td class="num">${(r[2]*100).toFixed(0)}%</td><td class="num">$${r[3].toLocaleString()}</td><td class="num" style="font-weight:600;color:var(--teal);">$${r[4].toLocaleString()}</td></tr>
  `).join('');
  $("#mactanScenarioTable tbody").innerHTML = scenarioRows;

  // ---- Competition table (full) ----
  const fullCompRows = d.competition.map(c => `
    <tr>
      <td><a href="${esc(c.url)}" target="_blank" rel="noopener" style="color:var(--teal);font-size:11px;">${esc(c.platform)}</a></td>
      <td><strong>${esc(c.property)}</strong></td>
      <td class="num">${c.beds}BR</td>
      <td class="num">${c.baths != null ? c.baths + 'BA' : '—'}</td>
      <td>${esc(c.location)}</td>
      <td class="num">${esc(c.rateUsd)}</td>
      <td class="muted" style="font-size:11px;">${esc(c.feature)}</td>
      <td style="font-size:10px;color:${c.tier === 'YES' ? 'var(--teal)' : 'var(--muted)'};">${esc(c.tier)}</td>
      <td class="muted" style="font-size:10px;">${esc(c.note)}</td>
    </tr>
  `).join('');
  $("#mactanFullCompTable tbody").innerHTML = fullCompRows;

  // ---- Coral Point Residences villas (HallersRealty) ----
  if (d.villas && d.villas.length > 0) {
    const mfee = d.maintenanceFeePerSqmMonthly || 105;
    const villaRows = d.villas.filter(v => v.pricePhp != null && v.pricePhp <= 26000000).map(v => {
      const priceAud = v.pricePhp != null ? Math.round(v.pricePhp / 37.5) : null;
      const priceAudStr = priceAud != null ? '$' + priceAud.toLocaleString() : '—';
      const pricePhpStr = v.pricePhp != null ? '₱' + v.pricePhp.toLocaleString() : '—';
      const mfeePerYear = v.area != null ? mfee * v.area * 12 : null;
      const mfeeStr = mfeePerYear != null ? '₱' + mfeePerYear.toLocaleString() + '/yr' : '—';
      const typeLabel = v.unit && v.unit.toLowerCase().includes('villa') ? 'Villa' :
                        v.unit && (v.unit.toLowerCase().includes('x') || v.unit.toLowerCase().includes('1x') || v.unit.toLowerCase().includes('2x') || v.unit.toLowerCase().includes('3x') || v.unit.toLowerCase().includes('4x') || v.unit.toLowerCase().includes('5x') || v.unit.toLowerCase().includes('6x')) ? 'Strata' :
                        'Unit';
      return `
        <tr>
          <td><strong>${esc(v.name)}</strong><br><span class="muted" style="font-size:10px;">${esc(v.unit)} · ${typeLabel}</span></td>
          <td class="num">${v.beds}BR / ${v.baths}BA</td>
          <td class="num">${v.area} m²</td>
          <td class="num">${pricePhpStr}</td>
          <td class="num">${priceAudStr}</td>
          <td class="num">₱${mfeePerYear != null ? Math.round(mfeePerYear/1000)*1000 : '—'}/yr</td>
          <td class="muted" style="font-size:10px;">${esc(v.source)}</td>
        </tr>`;
    }).join('');
    $("#mactanCoralPointTable tbody").innerHTML = villaRows;
    // Summary rows: price range + maintenance fee
    const prices = d.villas.map(v => v.pricePhp).filter(p => p != null);
    const minP = prices.length > 0 ? Math.min(...prices) : null;
    const maxP = prices.length > 0 ? Math.max(...prices) : null;
    const minAud = minP != null ? Math.round(minP / 37.5 / 1e6 * 1000) : null;
    const maxAud = maxP != null ? Math.round(maxP / 37.5 / 1e6 * 1000) : null;
    $("#mactanCoralPointRange").textContent =
      minP != null && maxP != null
        ? `Price range: ₱${minP.toLocaleString()} – ₱${maxP.toLocaleString()} ($${minAud}k – $${maxAud}k USD)`
        : '—';
    $("#mactanCoralPointMfee").textContent =
      `Maintenance fee: ₱${mfee}/sqm/month (≈ ₱${(mfee*135*12).toLocaleString()}–₱${(mfee*365*12).toLocaleString()}/yr for 135–365 m² units)`;
    $("#mactanCoralPointVerdict").textContent = d.coralPointVerdict;
  }

  // ---- Individual land listings (Land Options tab) ----
  if (d.landListings && d.landListings.length > 0) {
    const landRows = d.landListings.map(l => `
      <tr>
        <td><strong>${esc(l.source)}</strong></td>
        <td>${esc(l.location)}</td>
        <td class="num">${l.area} m²</td>
        <td class="muted" style="font-size:11px;">${esc(l.frontage)}</td>
        <td class="num">₱${l.pricePhp.toLocaleString()}</td>
        <td class="num">$${l.priceAud.toLocaleString()}</td>
        <td class="muted" style="font-size:11px;">${esc(l.type)}</td>
        <td class="muted" style="font-size:10px;">${esc(l.note)}</td>
      </tr>`).join('');
    $("#mactanLandListingsTable tbody").innerHTML = landRows;
    $("#mactanLandListingsNote").textContent = d.landOptionsNote;
    $("#mactanLandListingsSources").textContent = d.landOptionsSources;
  }

  // ---- Notes ----
  $("#mactanCompNote").textContent = d.competitionNote;
  $("#mactanPositioning").textContent = d.positioning;
  $("#mactanRiskNote").textContent = d.riskNote;
  $("#mactanSources").textContent = d.sources;

  // Render land developer compare (separate section below)
  renderLandDeveloperCompare();
}

// ---- Land Developer Compare section ----
function renderLandDeveloperCompare() {
  const d = DATA.mactan;
  if (!d || !d.developerCompare || d.developerCompare.length === 0) return;

  const rows = d.developerCompare.map(dev => {
    const mid = dev.phpPerSqmLow != null && dev.phpPerSqmHigh != null
      ? Math.round((dev.phpPerSqmLow + dev.phpPerSqmHigh) / 2) : null;
    const midAud = mid != null ? '$' + Math.round(mid / 37.5).toLocaleString() : '—';
    const midPhp = mid != null ? '₱' + mid.toLocaleString() : '—';
    const lowPhp = dev.phpPerSqmLow != null ? '₱' + dev.phpPerSqmLow.toLocaleString() : '—';
    const hiPhp = dev.phpPerSqmHigh != null ? '₱' + dev.phpPerSqmHigh.toLocaleString() : '—';
    const beachLabel = dev.beachside === 'Yes' ? '✅ Beachside' :
                      dev.beachside === 'Near' ? '📍 Near beach' :
                      dev.beachside === 'Mix' ? '🏖️ Mix' : '—';
    return `
      <tr>
        <td><strong>${esc(dev.developer)}</strong></td>
        <td>${esc(dev.location)}</td>
        <td class="num">${lowPhp}</td>
        <td class="num">${hiPhp}</td>
        <td class="num">${midPhp}</td>
        <td class="num">${midAud}</td>
        <td style="font-size:12px;color:${dev.beachside === 'Yes' ? 'var(--teal)' : 'var(--muted)'}">${beachLabel}</td>
        <td class="muted" style="font-size:10px;">${esc(dev.notes)}</td>
      </tr>`;
  }).join('');
  $("#mactanLandDeveloperTable tbody").innerHTML = rows;
  $("#mactanLandDeveloperNote").textContent = d.landOptionsNote;
  $("#mactanLandDeveloperSources").textContent = d.landOptionsSources;
}
