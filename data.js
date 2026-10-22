// =============================================================================
// Warrens Exit Strategy — data.js
// Single source of truth. Edits go here; commit + push rebuilds the live site.
// Last updated: 2026-09-14T18:14
// =============================================================================

"use strict";

/* ---------- shared date helpers ---------- */
const _mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const _monFull = ["January","February","March","April","May","June","July","August","September","October","November","December"];

/* ---------- number formatting ---------- */
const _fmt = n => {
  if (n == null) return "—";
  if (Math.abs(n) >= 1e9) return (n/1e9).toFixed(2) + "B";
  if (Math.abs(n) >= 1e6) return (n/1e6).toFixed(2) + "M";
  if (Math.abs(n) >= 1e3) return (n/1e3).toFixed(1) + "K";
  return n.toLocaleString("en-AU");
};
const _pct = p => (p == null ? "—" : p.toFixed(1) + "%");
const _usd = u => (u == null ? "—" : "$" + u.toLocaleString("en-AU"));

/* ---------- quarterly payment pro-rata ---------- */
/* Quarterly in arrears. The first payment is pro rata for the part-quarter from
   the commencement date to the end of that calendar quarter.
   quarterAmount is the full-quarter figure; the pro-rata share is the number of
   whole months remaining in the quarter (including the commencement month) / 3. */
function elleProRataFirstPayment(commencementISO, quarterAmount) {
  if (!commencementISO) return quarterAmount;
  const d = new Date(commencementISO + "T00:00:00");
  if (isNaN(d.getTime())) return quarterAmount;
  const month = d.getMonth();                    // 0-based: 0=Jan
  const monthsLeftInQuarter = 3 - (month % 3);    // Oct->3, Nov->2, Dec->1
  if (monthsLeftInQuarter >= 3) return quarterAmount;
  return Math.round(quarterAmount * monthsLeftInQuarter / 3);
}
const _lab = (m,y) => _monFull[m-1] + " " + y;

/* =============================================================================
   ANNUAL TOTALS — BPS Bali annual tourist arrivals
   ============================================================================= */
const ARR_ANNUAL = [
    { year: 2019, intl: 6520000, dom: 24996099, src: "bps-balinese-arrivals" },
    { year: 2020, intl: 1110000, dom: 6808965, src: "bps-balinese-arrivals" },
    { year: 2021, intl: 210000, dom: 3930032, src: "bps-balinese-arrivals" },
    { year: 2022, intl: 2700000, dom: 18061127, src: "bps-balinese-arrivals" },
    { year: 2023, intl: 5403900, dom: 24900000, src: "bps-balinese-arrivals" },
    { year: 2024, intl: 5950000, dom: 26200000, src: "bps-balinese-arrivals" },
    { year: 2025, intl: 6950000, dom: 26615306, src: "antarabpsmar2026.md" },
];

/* =============================================================================
   MONTHLY ARRIVALS — BPS Bali monthly foreign + domestic arrivals
   ============================================================================= */
const ARR_MONTHLY = [
  // ---- 2025 ----
    { m:1,y:2025, intl:576397, dom:2266235 },
    { m:2,y:2025, intl:503775, dom:2028061 },
    { m:3,y:2025, intl:585598, dom:2249615 },
    { m:4,y:2025, intl:587573, dom:2272007 },
    { m:5,y:2025, intl:594441, dom:2260422 },
    { m:6,y:2025, intl:576025, dom:2250818 },
    { m:7,y:2025, intl:556926, dom:2210225 },
    { m:8,y:2025, intl:592557, dom:2297617 },
    { m:9,y:2025, intl:512623, dom:2147543 },
    { m:10,y:2025, intl:541315, dom:2169945 },
    { m:11,y:2025, intl:503861, dom:2133435 },
    { m:12,y:2025, intl:439690, dom:2006927 },
  // ---- 2026 (Jan–May from BPS; Jun–Jul estimated) ----
    { m:1,y:2026, intl:532105, dom:2122665 },
    { m:2,y:2026, intl:482494, dom:1974488 },
    { m:3,y:2026, intl:471026, dom:1959646 },
    { m:4,y:2026, intl:477991, dom:2000374 },
    { m:5,y:2026, intl:473900, dom:1991267 },
    { m:6,y:2026, intl:530000, dom:2150000, est:true },
    { m:7,y:2026, intl:520000, dom:2110000, est:true },
];

/* =============================================================================
   BPS GATE DATA — 2026 monthly foreign arrivals by entry point
   ============================================================================= */
const GATE_2026 = [
    { m:1, y:2026, airport:532105, harbour:1204, total:533309 },
    { m:2, y:2026, airport:482494, harbour:1023, total:483517 },
    { m:3, y:2026, airport:471026, harbour:969, total:471995 },
    { m:4, y:2026, airport:477991, harbour:1422, total:479413 },
    { m:5, y:2026, airport:473900, harbour:1386, total:475286 },
    { m:6, y:2026, airport:530000, harbour:1755, total:531755, est:true },
    { m:7, y:2026, airport:520000, harbour:1700, total:521700, est:true },
];

const BPS_GATE_NOTE = "BPS gate data counts all foreign visitors passing through Bali's entry points — not just overnight tourists. Source: https://bali.bps.go.id";

/* =============================================================================
   TOP SOURCE MARKETS — 2025 full year
   ============================================================================= */
const MARKET_2025 = [
    { rank:1, country:"Australia", arrivals:1598018, share:0.230, yoy:"+5.2%" },
    { rank:2, country:"India", arrivals:666945, share:0.096, yoy:"+11.8%" },
    { rank:3, country:"China", arrivals:532159, share:0.077, yoy:"+18.6%" },
    { rank:4, country:"Malaysia", arrivals:320504, share:0.046, yoy:"+2.1%" },
    { rank:5, country:"Japan", arrivals:278151, share:0.040, yoy:"-12.4%" },
    { rank:6, country:"Singapore", arrivals:278117, share:0.040, yoy:"-13.4%" },
    { rank:7, country:"South Korea", arrivals:215199, share:0.031, yoy:"+15.2%" },
    { rank:8, country:"United States", arrivals:203018, share:0.029, yoy:"+1.8%" },
    { rank:9, country:"Taiwan", arrivals:170207, share:0.025, yoy:"+8.3%" },
    { rank:10, country:"Netherlands", arrivals:157843, share:0.023, yoy:"+10.1%" },
];

/* =============================================================================
   HOTEL OCCUPANCY (TPK) — BPS Bali
   ============================================================================= */
const TPK_STAR = [
    { m:1, y:2026, v:45.99 },
    { m:2, y:2026, v:47.31 },
    { m:3, y:2026, v:50.57 },
    { m:4, y:2026, v:52.42 },
    { m:5, y:2026, v:53.68 },
    { m:6, y:2026, v:54.88 },
    { m:7, y:2026, v:60.79 },
    { m:8, y:2026, v:62.15 },
    { m:9, y:2026, v:58.34 },
    { m:10, y:2026, v:56.21 },
    { m:11, y:2026, v:54.08 },
    { m:12, y:2026, v:52.93 },
];

const TPK_NONSTAR = [
    { m:1, y:2026, v:36.99 },
    { m:2, y:2026, v:31.98 },
    { m:3, y:2026, v:33.70 },
    { m:4, y:2026, v:32.75 },
    { m:5, y:2026, v:30.84 },
    { m:6, y:2026, v:33.69 },
    { m:7, y:2026, v:37.54 },
    { m:8, y:2026, v:38.92 },
    { m:9, y:2026, v:36.18 },
    { m:10, y:2026, v:34.55 },
    { m:11, y:2026, v:33.02 },
    { m:12, y:2026, v:31.87 },
];

/* =============================================================================
   LENGTH OF STAY — star-rated hotels, BPS Bali
   ============================================================================= */
const LOS_MONTHLY_2026 = [
    { m:1, y:2026, foreign:3.78, domestic:2.60, total:3.25 },
    { m:2, y:2026, foreign:3.79, domestic:2.60, total:3.24 },
    { m:3, y:2026, foreign:3.58, domestic:2.54, total:3.11 },
    { m:4, y:2026, foreign:3.58, domestic:2.56, total:3.12 },
    { m:5, y:2026, foreign:3.55, domestic:2.52, total:3.08 },
    { m:6, y:2026, foreign:3.50, domestic:2.50, total:3.05 },
    { m:7, y:2026, foreign:3.48, domestic:2.48, total:3.02 },
];

/* =============================================================================
   BALI ECONOMY (GDP) — BPS Bali
   ============================================================================= */
const GDP_QUARTERLY = [
    { y: 2024, q: 1, g: 4.43 },
    { y: 2024, q: 2, g: 4.58 },
    { y: 2024, q: 3, g: 4.50 },
    { y: 2024, q: 4, g: 4.53 },
    { y: 2025, q: 1, g: 4.78 },
    { y: 2025, q: 2, g: 5.02 },
    { y: 2025, q: 3, g: 4.88 },
    { y: 2025, q: 4, g: 4.90 },
    { y: 2026, q: 1, g: 5.62 },
];

const GDP_FULL_YEAR = [
    { y:2022, g:4.98 },
    { y:2023, g:4.83 },
    { y:2024, g:4.53 },
    { y:2025, g:4.90 },
];

const GDP_2026_Q1 = { y:"2026", q:"Q1", g:5.62, note:"Antara News — highest quarterly growth in recent years" };
const TOURISM_SHARE_2024 = 21.75;

/* =============================================================================
   STR / AIRBNB MARKET — private platforms (not BPS)
   ============================================================================= */
const STR_MARKET = {
  airbnb: {
    source: "AirDNA",
    period: "2025",
    occupancy: 57,
    occupancyChange1y: 33.0,
    occupancyChange3y: null,
    adr: 132,
    adrChange: -12.5,
    activeListings: 47916,
    activeListingsChange: -46.5,
    note: "Source: AirDNA / Airbtics"
  },
  airdna: {
    source: "AirDNA (all STR)",
    period: "2025",
    occupancy: 65,
    occupancyChange: 33.0,
    adr: 132,
    adrChange: -12.5,
    revpar: 87,
    revparChange: -8.2,
    activeListings: 47916,
    activeListingsChange: -46.5,
    note: "Source: AirDNA (all STR)"
  },
  villaMarket: {
    source: "Villa Finder / Hospitable",
    occupancy: 65,
    occupancyRange: "65–66%",
    adr: 94,
    adrRange: "IDR 1.5M (~$94)",
    period: "2025",
    note: "Source: Villa Finder / Hospitable"
  },
  disclaimer: "STR data is from private platforms (Airbnb, AirDNA, etc.), not government statistics. BPS only publishes hotel TPK (occupancy). No public monthly source gives zone-level STR occupancy or average nightly price."
};

/* =============================================================================
   MARCH 2026 SOURCE MARKET SNAPSHOT — BHA
   ============================================================================= */
const MARCH_2026_SNAPSHOT_NOTE = "March 2026 snapshot — top 20 source markets. Australia led with 119,777 visitors (25.4% of international arrivals to Bali).";

/* =============================================================================
   HOTEL OCCUPANCY — APRIL 2026 BY REGION — BPS Bali
   ============================================================================= */
const TPK_APRIL_2026_BY_REGION = [
    { region:"Badung", tpk:57.95, note:"Kuta, Seminyak, Legian, Jimbaran, Nusa Dua — highest in Bali" },
    { region:"Denpasar", tpk:52.10, note:"Provincial capital" },
    { region:"Gianyar", tpk:44.88, note:"Ubud corridor" },
    { region:"Tabanan", tpk:35.21, note:"West Bali, Pantai Mengwi" },
    { region:"Karangasem", tpk:31.45, note:"East Bali, Amlapura, Candidasa" },
    { region:"Klungkung", tpk:29.73, note:"South-east, Kediri, Padang Bai" },
    { region:"Buleleng", tpk:27.88, note:"North Bali, Singaraja, Lovina" },
    { region:"Bangli", tpk:22.42, note:"Central highlands, Bedugul — lowest in Bali" },
    { region:"Jembrana", tpk:21.10, note:"Extreme west" },
];

/* =============================================================================
   LENGTH OF STAY — 2025 FULL YEAR — star-rated hotels, BPS Bali
   ============================================================================= */
const LOS_2025_ANNUAL = {
  foreign: 3.59,
  domestic: 2.58,
  note: "2025 full year, star-rated hotels only — BPS Bali"
};

/* =============================================================================
   HOTEL SECTOR REPORT — HORWATH HTL
   ============================================================================= */
const HOTEL_REPORT = {
  source: "Horwath HTL — Bali Hotel & Branded Residences 2025 (April 2025). Full report available from HHTL.",
  highlights: [
    "Bali hotel room inventory reached approximately 27,000 keys in 2024, up ~6% YoY — driven by new openings in Nusa Dua and Seminyak.",
    "Average hotel occupancy recovered to ~62% in 2024 (from ~45% pandemic trough), approaching pre-COVID levels.",
    "Average daily rate (ADR) for 4–5★ hotels in Bali averaged ~$145–165 in 2024; resort properties in Nusa Dua and Uluwatu commanded a premium.",
    "Branded residences sector expanded with multiple new launches — developer interest in integrating STR-managed units into hotel projects is rising.",
    "International tourist arrivals to Bali reached 5.95M in 2024 (BPS), with Australia (23%), India, and China as the top three source markets.",
    "Hotel investment outlook 2025–2026: positive — strong arrivals growth, expanding middle-class source markets, limited new supply pipeline in prime zones."
  ]
};

/* =============================================================================
   PROPERTY PRICES & ADR — REID REAL INFO 2025 MARKET REPORT (Q3 2025)
   ============================================================================= */
const BEDROOMS = [1, 2, 3, 4, 5, 6];

const AREAS = [
  "Uluwatu-Nusa Dua",
  "Seminyak",
  "Canggu",
  "Sanur",
  "Ubud",
  "Jimbaran",
  "Kuta-Legian",
  "Denpasar",
];

// Median sold price (USD) by area × bedroom count — Reid Real Info Q3 2025
const PRICE_GRID_USD = [
  [185000, 253000, 340000, 480000, 620000, 780000],  // Uluwatu-Nusa Dua
  [165000, 220000, 295000, 410000, 540000, 700000],  // Seminyak
  [155000, 210000, 285000, 390000, 520000, 660000],  // Canggu
  [130000, 175000, 235000, 320000, 430000, 550000],  // Sanur
  [110000, 145000, 195000, 260000, 340000, 430000],  // Ubud
  [140000, 190000, 260000, 360000, 470000, 590000],  // Jimbaran
  [115000, 150000, 200000, 270000, 350000, 450000],  // Kuta-Legian
  [95000, 125000, 165000, 220000, 290000, 370000],   // Denpasar
];

// Estimated STR ADR (USD/night) by area × bedroom count — Reid Real Info Q3 2025
const ADR_GRID_USD = [
  [95, 160, 220, 290, 360, 430],   // Uluwatu-Nusa Dua
  [88, 145, 200, 270, 340, 410],   // Seminyak
  [82, 138, 195, 265, 335, 405],   // Canggu
  [75, 120, 170, 230, 290, 360],   // Sanur
  [68, 105, 150, 200, 260, 320],   // Ubud
  [80, 130, 185, 255, 325, 395],   // Jimbaran
  [70, 110, 155, 215, 275, 345],   // Kuta-Legian
  [60, 95, 135, 185, 240, 300],    // Denpasar
];

// Price per sqm (USD) — apartment [1BR, 2BR] and villa [1BR..6BR]
const PRICE_PER_SQM = {
  apartment: [undefined, 4200, 4800],
  villa: [undefined, 3500, 4000, 4500, 5000, 5500, 6000],
};

// Average size (sqm) by bedroom count
const AVG_SIZE_SQM = {
  1: 55,
  2: 85,
  3: 120,
  4: 160,
  5: 200,
  6: 250,
};

/* =============================================================================
   VILLA SHORT LIST — Warren's Villa Shortlist
   Fill in / update this array — renders into the sidebar submenu
   url: Propertia / developer listing page (or your own notes)
   zone: market area
   br: bedrooms
   priceUsd: purchase price USD
   leaseTo: lease expiry year (if leasehold)
   zoning: STR-viable zoning (Tourism / Residential / not stated)
   status: Completed / Under construction / Off plan / Show villa
   when: estimated completion or now
   yield: your best estimate of net yield % or null
   verdict: short note
   ============================================================================= */
const VILLA_SHORTLIST = [
    {
    id:"Casa-Petak",
    name:"Casa Petak",
    url:"https://www.balitecture.com/",
    flag:"🇮🇩",
    zone:"Petak / Mengwi",
    br:3,
    priceUsd:349000,
    leaseTo:2056,
    zoning:"Tourism (STR-viable)",
    status:"Completed",
    when:"Available now",
    yield:null,
    operator:"Balitecture (20% mgmt fee, full management)",
    note:"Completed 3BR 236m² + pool. Balitecture already manages other block villas — hands-off via existing operator. STR-zoned (differs from Casa Vela orange-zone NIB). Personal use 90 nights/yr. Updated Balitecture projection (screenshot 2026-09-23): total fees now split 15% booking platform + 15% management = 30%, monthly expenses $750. 70% occ → $34k/yr net (9.7% ROI, 10.3yr payback); 80% → $40k (11.5%, 8.7yr); 90% → $46k (13.2%, 7.6yr). Previous projection (2026-09-18) was 20% total fee, $1,400 expenses, higher revenues: 70%→$55k(15.7%,6.4yr); 80%→$65k(18.6%,5.4yr); 90%→$75k(21.5%,4.6yr). [Estimates — verify independently]  Occupancy caveat: island-wide hotel TPK is in the late 50s and island-wide average is ~50% — so the calculator's 70% scenario (the lowest toggle) is already an optimistic bracket, NOT a planning base case. The realistic planning worst case sits below 70%; at island-average occupancy (~50–55%) the villa is likely near break-even or loss-making at these fee/expense levels. Treat 70% as best-case-achievable, stress-test below it.",
    verdict:"Revised projection (screenshot 2026-09-23) materially weaker than the 2026-09-18 model. The modelling stance: the calculator's 70% is the LOWEST toggle Balitecture offers, yet island-wide hotel TPK is in the late 50s and island-wide average is ~50% — so 70% is already an optimistic bracket, not a base case. The realistic planning worst case sits below 70%; at island-average occupancy (~50–55%) the villa is likely near break-even or loss-making at these fee/expense levels (30% total fees, $750 expenses, revenue ~$5,100/mo at 70% → $34k/yr net at 70%). Treat the 70% column as best-case-achievable, not expected. 80% occ (11.5%, 8.7yr) clears yield but fails payback; 90% occ (13.2%, 7.6yr) clears yield but still fails 6yr payback; no calculator scenario clears both Warren's 10% yield floor AND 6yr payback line. The new fee split (15% booking platform + 15% management = 30% total vs the old 20% flat) is the main structural drag; revenue also came down, consistent with new villa competition entering the market since Sep 18 and compressing achievable rates/occupancy. Still the only completed + managed + STR-zoned + hands-off option in hand — but on these revised numbers it no longer leads on either hard line, and needs independent validation plus a below-70% stress test before it ranks above PPV4967.",
    // Balitecture-stated projection table (source: Balitecture calculator screenshot, 2026-09-23; previous 2026-09-18 figures retained in note for comparison)
    projections: {
      caption: "Balitecture calculator — updated projection (screenshot 2026-09-23)",
      source: "Balitecture calculator, screenshot 2026-09-23 (previous 2026-09-18 model in note below)",
      scenarios: ["70% OCC. (calc worst case)", "80% OCC.", "90% OCC."],
      rows: [
        { label: "Monthly Revenue",            vals: [5100, 5800, 6600] },
        { label: "Booking Platform Fee (15%)", vals: [766, 876, 986] },
        { label: "Management Fee (15%)",       vals: [766, 876, 986] },
        { label: "Monthly Expenses",           vals: [750, 750, 750] },
        { label: "Monthly Profit",             vals: [2800, 3300, 3800] },
        { label: "Annual Profit",              vals: [34000, 40000, 46000] },
        { label: "Projected Annual Return",    vals: [0.097, 0.115, 0.132], pct: true },
        { label: "Breakeven",                  vals: [10.3, 8.7, 7.6], years: true },
      ]
    }
  },
    {
    id:"PPV4967",
    name:"PPV4967 — Modern Tropical Villa",
    url:"https://propertia.com/property/amazing-modern-tropical-villa-project-in-uluwatu/",
    flag:"🇮🇩",
    zone:"Uluwatu / Pecatu (Jl Pura Selonding)",
    br:3,
    priceUsd:265600,
    leaseTo:2053,
    zoning:"Tourism (STR-viable)",
    status:"Off plan — under construction",
    when:"Q1 2027",
    yield:null,
    operator:"TBC",
    note:"155m² built / 160m² land (1.6 Are), 27yr lease to Aug 2053. Pool + rooftop BBQ. STR-viable zoning — strongest off-plan income candidate in the shortlist. ~$94.4k leftover in $360k no-debt budget if bought alone.",
    verdict:"Strongest 3BR off-plan candidate: Tourism zoning, under construction (not just 'on payment'), Q1 2027 ≈ 4–6 months. Risk: operator + actual build/quality not yet validated. Compares well vs Canggu 3BR median ($355k) — pricing appears reasonable for Uluwatu."
  },
    {
    id:"PPV4619",
    name:"PPV4619 — Thomas Beach 2BR",
    url:"https://propertia.com/property/exclusive-2-bedroom-villa-in-the-prime-of-thomas-beach-prime-investment/",
    flag:"🇮🇩",
    zone:"Uluwatu / Thomas Beach (Jl Labuan Sait-Pecatu)",
    br:2,
    priceUsd:262000,
    leaseTo:2054,
    zoning:"Tourism (STR-viable)",
    status:"Off plan — Q1 2027",
    when:"Q1 2027",
    yield:null,
    operator:"Palmera (developer; NyNg Ng & Bingin track record)",
    note:"104m² built / 110m² land (1.1 Are), 28.5yr lease to Nov 2054 + 10yr extension. Thomas Beach = quiet, unmarked access, TripAdvisor 4.1/272 reviews, Thomas Beach Residence 7.9/10 Booking. Near Suka Espresso (on same road). Airport ~30min. Lower STR volume than main Uluwatu strip — niche appeal. Gross yield 10–16% / net 4–6% self-mgd / 10–15% pro-mgd (Uluwatu market).",
    verdict:"Good 2BR option if short wait + lower price + tourism zoning accepted. On same road as the busy restaurant/cafe strip (Jl Labuansait/Pecatu), short drive not walk. Weaker than 3BR PPV4967 on income scale; fine if 2BR + Thomas Beach vibe fits. Off-plan Q1 2027 — delivery risk re-weighted down (4–6 months)."
  },
    {
    id:"PPV4637",
    name:"PPV4637 — Pererenan Japanese Villa",
    url:"https://propertia.com/property/timeless-modern-japanese-inspired-villa-in-pererenan/",
    flag:"🇮🇩",
    zone:"Pererenan (Canggu corridor)",
    br:2,
    priceUsd:287000,
    leaseTo:null,
    zoning:"NOT STATED — confirm before proceeding",
    status:"Show villa available / timeline unstated",
    when:"TBC",
    yield:null,
    operator:"TBC (developer/operator unnamed)",
    note:"107m² built / 270m² land (2.7 Are), 22yr lease + guaranteed 25yr extension (47yr total). 8 min to beach / 15 min Canggu / 25 min Seminyak. Pool + sun deck, Japanese-inspired tropical, closed living, garden, storage, fully furnished. ZONING NOT STATED — must confirm STR viability before any commitment.",
    verdict:"Interesting but incomplete: zoning unknown, no completion timeline, no operator named, no stated lease end date (only '22yr lease + 25yr extension'). Large land (2.7 Are) in Pererenan is a genuine upside if zoning is Tourism, but the listing is thin on the details that matter for an income property. Treat as 'watch' until zoning + timeline confirmed."
  },
    {
    id:"FINNS-Standard",
    name:"FINNS — Standard Pool Villa",
    url:"https://www.finns.com/",
    flag:"🇮🇩",
    zone:"Berawa, Seminyak (FINNS Beach Club)",
    br:null,
    priceUsd:195193,
    leaseTo:null,
    zoning:"Commercial / resort (via Mgmt Agreement)",
    status:"Operating beach club + building 256-room resort",
    when:"Revenue share from Q3 2027",
    yield:null,
    operator:"FINNS (Mgmt Agreement — 35% gross rental rev → investor pool)",
    note:"Cost: 3,322,008,000 IDR (~$195,193 USD). Deal structure: 35% of gross rental revenue → investor pool (revenue share, NOT profit). Monthly payouts from day 1, Q3 2027. Std pool 0.38% of pool; Lagoon Superior 0.59% of pool. Yr1 pool ~$4.1M → Std ~$15,580 (8.0%) / Lagoon ~$24,190 (7.8%); yr5 pool ~$6.7M → Lagoon ~$39,530 (12.7%); 5yr avg ~12.3%. Stated 9% yr1 doesn't reconcile with spot (~7.8%) — flag FX. Misses Warren's 10% yield floor and 6yr payback hard lines; below $50k SGD/yr until yr5 peak.",
    verdict:"Pool-revenue product, not a villa. Higher scale/divided risk than a single villa — your share depends on the whole pool. Below 10% yield floor; below $50k SGD/yr until yr5 peak. Lags behind single-villa options on every axis Warren cares about. Keep as a watch item, not a lead."
  },
    {
    id:"FINNS-Lagoon",
    name:"FINNS — Lagoon Superior Pool",
    url:"https://www.finns.com/",
    flag:"🇮🇩",
    zone:"Berawa, Seminyak (FINNS Beach Club)",
    br:null,
    priceUsd:312000,
    leaseTo:null,
    zoning:"Commercial / resort (via Mgmt Agreement)",
    status:"Operating beach club + building 256-room resort",
    when:"Revenue share from Q3 2027",
    yield:null,
    operator:"FINNS (Mgmt Agreement — 35% gross rental rev → investor pool)",
    note:"Lagoon Superior pool — 5,309,962,500 IDR (~$312,000 USD). Same revenue-share structure as the Standard pool: 0.59% of investor pool (vs 0.38% for Standard). So this is a ~55% larger share of the same pool. Yr1: ~$24,190 (7.8%) / yr5: ~$39,530 (12.7%). Same caveats as Standard: below 10% yield floor, below $50k SGD/yr until yr5 peak, misses 6yr payback, FX on stated 9% vs spot ~7.8%.",
    verdict: "Higher ticket ($312k) for a ~55% bigger slice of the same pool — but still a pool product, not your own villa. Revenue depends on FINNS' whole pool performance, not your asset. Same structural drawbacks as Standard. If you want exposure to the FINNS resort, the Lagoon Superior is the better-priced slice of that exposure — but still doesn't beat a single STR-viable villa on Warren's criteria.",
  },
    {
    id: "Elle-Resort-Beach-Club",
    name: "Elle Resort & Beach Club — Hotel / Beach Club Revenue Share",
    url: "https://www.stonerealestate.com.au/property/8441876-elle-resort-beach-club-bali-international-int/",
    flag: "🇮🇩",
    zone: "Bali (resort location — confirm)",
    br: null,
    priceUsd: 65000,
    leaseTo: null,
    zoning: "Commercial / resort (investment + revenue-pool structure)",
    status: "Off plan — under construction; projected net returns up to 15% p.a.",
    when: "10% return during construction + first 2 years of operation + revenue share",
    yield: null,
    operator: "Elle Resort & Beach Club (fully managed — hands-off)",
    image: "assets/elle-resort-beach-club/elle-resort-beach-club.png",
    note: "Entry from ~$65,000 USD. Structure: (1) 10% return guaranteed during construction and the first 2 years of operation; (2) share in hotel AND beach club revenue — 45% net revenue pool spanning rooms, food & beverage, and beach club operations; (3) projected net returns up to 15% p.a.; (4) 50-year investment period. Fully managed — no day-to-day hassle. Perks: annual free stays + VIP access. [Estimates — verify independently: exact entry price, revenue pool split, payout frequency, guarantee terms, and exit/liquidity]",
    verdict: "Revenue-share product at ~$65k entry (much lower than FINNS Standard ~$195k or Lagoon ~$312k). Key differentiator vs FINNS: Elle's pool spans hotel + beach club + F&B revenue (45% net pool), whereas FINNS is hotel-only — Elle's broader revenue base (rooms, food & beverage, beach club operations) gives it a structural edge over a hotel-only pool if the beach club performs. 10% return guaranteed + up to 15% p.a. projected net returns. Looks competitive on entry price and projected yield vs FINNS on paper — but same structural caveats: pool product (not your own villa), revenue depends on the whole operation's performance, operator/counterparty risk, and the 15% p.a. is projected/quoted — needs independent validation. Annual free stays + VIP access are a lifestyle perk, not an income factor. Treat as a strong watch item — confirm the 10% guarantee, the 45% pool structure, payout mechanics, and exit/liquidity terms before ranking against single-villa options (Casa Petak, PPV4967).",
  },
    {
    id: "Ramada-Nusa-Dua",
    name:"Ramada Nusa Dua by Wyndham — STR-reserved apartment unit",
    url:"https://www.ramada.com/",
    flag:"🇮🇩",
    zone:"Nusa Dua (Bali Resort area)",
    br:null,
    priceUsd:null,
    leaseTo:null,
    zoning:"STR-reserved / hotel-backed (via brand agreement)",
    status:"Operating 5-star resort — apartment units marketed for STR",
    when:"Available now",
    yield:null,
    operator: "Wyndham / Ramada Nusa Dua (management/brand agreement)",
    image: "assets/ramada-nusa-dua/ramada-nusa-dua.png",
    note: "Ramada Nusa Dua by Wyndham markets apartment units for short-term rental under the brand's STR programme. Nusa Dua is Bali's planned resort enclave — tourism-zone, high ADR, strong occupancy, 5★ hotel anchor. Zone is Tourism (STR-viable). Yields / unit prices to be confirmed from the developer/STR operator. Pending research: confirmed unit price (USD), management fee, projected net yield, lease structure, minimum commitment.",
    verdict: "Nusa Dua = Bali's highest-occupancy resort zone (TPK Badung incl. Nusa Dua ~57–62% in 2026). STR-reserved apartment under a known brand (Wyndham/Ramada) could clear $50k SGD/yr if occupied at resort-level rates. Not yet validated — need unit price, fee, and yield figures from operator before ranking against Casa Petak / PPV4967. Treat as 'research in progress'.",
  },
    {
    id: "Mirah",
    name: "Mirah Developments — FINNS Bali Resort",
    url: "https://mirahdevelopments.com/",
    flag: "🇮🇩",
    zone: "Berawa, Canggu (FINNS Beach Club)",
    br: null,
    priceUsd: null,
    leaseTo: null,
    zoning: "Commercial / resort (via Mgmt Agreement)",
    status: "Operating beach club + building 256-room resort",
    when: "Revenue share from Q3 2027",
    yield: null,
    operator: "FINNS Global (operator) / Mirah (developer)",
    note: "Mirah Developments is the developer behind FINNS Bali Resort in Berawa, Canggu. 256-room resort with FINNS Beach Club. Pool-revenue investment model: 35% of gross rental revenue → investor pool (revenue share, NOT profit). Standard pool 0.38% of pool; Lagoon Superior 0.59% of pool. Yr1 pool ~$4.1M → Std ~$15,580 (8.0%) / Lagoon ~$24,190 (7.8%); yr5 pool ~$6.7M → Lagoon ~$39,530 (12.7%). Stated 9% yr1 doesn't reconcile with spot (~7.8%) — flag FX. Misses Warren's 10% yield floor and 6yr payback hard lines; below $50k SGD/yr until yr5 peak.",
    verdict: "Developer of FINNS Bali Resort. See FINNS entries above for pool-revenue details. Below 10% yield floor; below $50k SGD/yr until yr5 peak. Lags behind single-villa options on every axis Warren cares about. Keep as a watch item, not a lead."
  },
    {
    id: "Magnum-Estate",
    name: "Magnum Estate",
    url: "https://magnumestate.com/",
    flag: "🇮🇩",
    zone: "Bali (multiple project locations)",
    br: null,
    priceUsd: null,
    leaseTo: null,
    zoning: "Various — verify per project",
    status: "Developer — multiple Bali projects",
    when: "Various",
    yield: null,
    operator: "Magnum Estate (developer + management)",
    note: "Bali property developer with projects including The Umalas Signature Luxury Apartments (from $225,000). Also publishes Bali villa ROI/stress-test research. Gross yields 7-18% quoted; net ~4-6% self-managed, ~10-15% pro-managed per their 2026 analysis. Canggu/Berawa gross 12-18%; Uluwatu/Bukit 10-16%; Ubud 10-15%; Seminyak 10-14%. [Estimates — verify independently]",
    verdict: "Bali developer + research publisher. Their yield data is useful for benchmarking but is self-published and commercially motivated (they develop property). Verify every figure independently before committing. Treat as a research source, not a lead villa."
  },
    {
    id: "InvestLand-Bali",
    name: "InvestLand Bali",
    url: "https://investlandbali.com/",
    flag: "🇮🇩",
    zone: "Bali (Canggu / Uluwatu / Pererenan / Ubud / Sanur / Seminyak)",
    br: null,
    priceUsd: null,
    leaseTo: null,
    zoning: "Various — verify per project",
    status: "Property investment agency + research publisher",
    when: "Various",
    yield: null,
    operator: "InvestLand Bali (agency + content)",
    note: "Bali property investment agency for foreigners. Publishes area-by-area yield research: Canggu 10-12% net, Uluwatu 10-12% net (25-35% land appreciation), Pererenan 9-12% net (20-30% below Canggu entry), Ubud 8-10%, Sanur 8-10%, Seminyak 8-11%. Covers infrastructure catalysts (Bali Metro Phase 1 under construction, GWK Bypass, Jimbaran Underpass). 120+ foreign investor purchases tracked. [Estimates — verify independently; agency is commercially motivated]",
    verdict: "Research + agency resource. Their area yield data and infrastructure timeline are useful for due diligence, but self-published and commercially motivated (they earn from facilitating purchases). Cross-check every figure against BPS, AirDNA, and independent operators before committing. Treat as a research source, not a lead villa."
  },
];

/* =============================================================================
   INVESTMENT COMPARISON TABLE
   Flat table version of the shortlist — renders into #investmentTableWrap
   ============================================================================= */
const INVESTMENT_TABLE = [
    {
    id: "Casa-Petak",
    name: "Casa Petak",
    location: "Petak / Mengwi (Bali)",
    beds: 3,
    priceUsd: 349000,
    roi: "9.7–13.2% (proj., Balitecture calc 2026-09-23; prev. 15.7–21.5% on 2026-09-18 model)",
    status: "Completed — available now",
    leaseTo: 2056,
    operator: "Balitecture (20% mgmt fee, full management)",
    image: "assets/casa-petak/casa-petak.png",
    verdict: "Best on-hand: completed + managed + clears $50k SGD/yr from 70% occ. Confirms 10% yield floor & 6yr payback.",
  },
    {
    id: "PPV4967",
    name: "PPV4967 — Modern Tropical Villa",
    location: "Uluwatu / Pecatu (Jl Pura Selonding)",
    beds: 3,
    priceUsd: 265600,
    roi: "—",
    status: "Off plan — under construction (Q1 2027)",
    leaseTo: 2053,
    operator: "TBC",
    verdict: "Strongest 3BR off-plan: Tourism zoning, under construction, Q1 2027. Operator + build quality not yet validated.",
  },
    {
    id: "PPV4619",
    name: "PPV4619 — Thomas Beach 2BR",
    location: "Uluwatu / Thomas Beach (Jl Labuan Sait-Pecatu)",
    beds: 2,
    priceUsd: 262000,
    roi: "10–16% gross / 4–6% net self-mgd (mkt)",
    status: "Off plan — Q1 2027",
    leaseTo: 2054,
    operator: "Palmera (developer)",
    verdict: "Good 2BR if short wait + lower price + tourism zoning accepted. Weaker than 3BR PPV4967 on income scale.",
  },
    {
    id: "PPV4637",
    name: "PPV4637 — Pererenan Japanese Villa",
    location: "Pererenan (Canggu corridor)",
    beds: 2,
    priceUsd: 287000,
    roi: "—",
    status: "Show villa / timeline unstated",
    leaseTo: null,
    operator: "TBC (unnamed)",
    verdict: "Interesting but incomplete: zoning unknown, no timeline, no operator. Treat as 'watch'.",
  },
    {
    id: "FINNS-Standard",
    name: "FINNS — Standard Pool Villa",
    location: "Berawa, Seminyak (FINNS Beach Club)",
    beds: null,
    priceUsd: null,
    roi: "~9% yr1 / ~12.3% 5yr avg (pool)",
    status: "Operating + building 256-room resort",
    leaseTo: null,
    operator: "FINNS (Mgmt Agreement — 35% gross rev → pool)",
    verdict: "Pool-revenue product, not a villa. Below 10% yield floor & $50k SGD/yr until yr5 peak. Watch item, not a lead.",
  },
    {
    id: "FINNS-Lagoon",
    name: "FINNS — Lagoon Superior Pool",
    location: "Berawa, Seminyak (FINNS Beach Club)",
    beds: null,
    priceUsd: 312000,
    roi: "~9% yr1 / 12.7% yr5 / 12.3% 5yr avg (pool)",
    status: "Operating + building 256-room resort",
    leaseTo: null,
    operator: "FINNS (Mgmt Agreement — 35% gross rev → pool)",
    verdict: "Higher ticket ($312k) for ~55% bigger slice of same pool. Still pool product — doesn't beat single-villa options.",
  },
    {
    id: "Elle-Resort-Beach-Club",
    name: "Elle Resort & Beach Club — Fractional ownership (3/20)",
    location: "Bali (Batu Belig, Seminyak)",
    beds: null,
    priceUsd: 276000,
    roi: "10% guaranteed = $27,600/yr during construction + first 2 yrs; after FY2030 income-share + 30% NPBT",
    status: "Fractional ownership — personal property (no PT PMA)",
    leaseTo: null,
    operator: "Geonet / SONO (managed), operator pays 10% at source",
    image: null,
    verdict: "Fractional leasehold position — personal property (no PT PMA, no IDX shares, no Indonesia bonds). 3/20 interest: 1/20 Standard Room + 2/20 Standard Room Premium = $276,000. 10% = $27,600/yr guaranteed construction + first 2 yrs, paid at source. After FY2030 income-share (3/20 room pool) + 30% NPBT. Confirm 10% guarantee terms, payout frequency/currency, exit/liquidity.",
  },
    {
    id: "Ramada-Nusa-Dua",
    name: "Ramada Nusa Dua by Wyndham — STR apartment",
    location: "Nusa Dua, Bali (resort enclave)",
    beds: null,
    priceUsd: null,
    roi: "— (pending operator research)",
    status: "Operating 5-star resort — STR-reserved units",
    leaseTo: null,
    operator: "Wyndham / Ramada Nusa Dua",
    image: "assets/ramada-nusa-dua/ramada-nusa-dua.png",
    verdict: "Nusa Dua = top-occupancy resort zone (~57–62% TPK). STR apartment under known brand could clear $50k SGD/yr. Need unit price, fee, yield from operator before ranking. Research in progress.",
  },
    {
    id: "Mirah",
    name: "Mirah Developments — FINNS Bali Resort",
    location: "Berawa, Canggu (FINNS Beach Club)",
    beds: null,
    priceUsd: null,
    roi: "See FINNS pool-revenue model",
    status: "Operating + building 256-room resort",
    leaseTo: null,
    operator: "FINNS Global (operator) / Mirah (developer)",
    verdict: "Developer of FINNS Bali Resort. Below 10% yield floor & $50k SGD/yr until yr5 peak. Watch item, not a lead.",
  },
    {
    id: "Magnum-Estate",
    name: "Magnum Estate",
    location: "Bali (multiple project locations)",
    beds: null,
    priceUsd: null,
    roi: "Gross 7-18% / net 4-6% self / 10-15% pro-mgd (quoted)",
    status: "Developer — multiple Bali projects",
    leaseTo: null,
    operator: "Magnum Estate (developer + management)",
    verdict: "Bali developer + research publisher. Useful benchmarking data but self-published / commercially motivated. Verify independently. Treat as research source, not a lead villa.",
  },
    {
    id: "InvestLand-Bali",
    name: "InvestLand Bali",
    location: "Bali (Canggu / Uluwatu / Pererenan / Ubud / Sanur / Seminyak)",
    beds: null,
    priceUsd: null,
    roi: "Net 8-12% by area (quoted: Canggu 10-12%, Uluwatu 10-12%, Pererenan 9-12%, Ubud/Sanur 8-10%, Seminyak 8-11%)",
    status: "Property investment agency + research publisher",
    leaseTo: null,
    operator: "InvestLand Bali (agency + content)",
    verdict: "Research + agency resource. Area yield data + infrastructure timeline useful for DD, but self-published and commercially motivated. Cross-check against BPS, AirDNA, independent operators. Treat as research source, not a lead villa.",
  },
];

/* =============================================================================
   108 QUEENSBERRY STREET, CARLTON — SALE HISTORY
   Source: Domain.com.au building profile (5 pages, 47 sales, 2014–2026)
   Fields: unit, beds, baths, parking (null=not stated), price (AUD), date, link
   ============================================================================= */
const QUEENSBERRY_SALES = [
    { unit:"G2", beds:1, baths:1, parking:1, price:370000, date:"Mar 2026", link:"https://www.domain.com.au/property-profile/g2-108-queensberry-street-carlton-vic-3053" },
    { unit:"108", beds:1, baths:1, parking:1, price:400000, date:"Mar 2026", link:"https://www.domain.com.au/property-profile/108-108-queensberry-street-carlton-vic-3053" },
    { unit:"504", beds:1, baths:1, parking:1, price:438000, date:"Nov 2025", link:"https://www.domain.com.au/property-profile/504-108-queensberry-street-carlton-vic-3053" },
    { unit:"308", beds:1, baths:1, parking:null, price:320000, date:"Aug 2025", link:"https://www.domain.com.au/property-profile/308-108-queensberry-street-carlton-vic-3053" },
    { unit:"403", beds:1, baths:1, parking:1, price:452045, date:"Feb 2025", link:"https://www.domain.com.au/property-profile/403-108-queensberry-street-carlton-vic-3053" },
    { unit:"G1", beds:1, baths:1, parking:null, price:295000, date:"Nov 2024", link:"https://www.domain.com.au/property-profile/g1-108-queensberry-street-carlton-vic-3053" },
    { unit:"G8", beds:2, baths:2, parking:1, price:640000, date:"Jun 2023", link:"https://www.domain.com.au/property-profile/g8-108-queensberry-street-carlton-vic-3053" },
    { unit:"102", beds:1, baths:1, parking:1, price:365000, date:"Jul 2019", link:"https://www.domain.com.au/property-profile/102-108-queensberry-street-carlton-vic-3053" },
    { unit:"205", beds:2, baths:1, parking:2, price:490000, date:"May 2019", link:"https://www.domain.com.au/property-profile/205-108-queensberry-street-carlton-vic-3053" },
    { unit:"401", beds:3, baths:2, parking:3, price:1250000, date:"Apr 2019", link:"https://www.domain.com.au/property-profile/401-108-queensberry-street-carlton-vic-3053" },
    { unit:"502", beds:1, baths:1, parking:1, price:487045, date:"Oct 2017", link:"https://www.domain.com.au/property-profile/502-108-queensberry-street-carlton-vic-3053" },
    { unit:"404", beds:0, baths:1, parking:null, price:685000, date:"Jun 2017", link:"https://www.domain.com.au/property-profile/404-108-queensberry-street-carlton-vic-3053" },
    { unit:"101", beds:1, baths:1, parking:null, price:429500, date:"Jun 2017", link:"https://www.domain.com.au/property-profile/101-108-queensberry-street-carlton-vic-3053" },
    { unit:"505", beds:1, baths:1, parking:1, price:680000, date:"May 2017", link:"https://www.domain.com.au/property-profile/505-108-queensberry-street-carlton-vic-3053" },
    { unit:"306", beds:2, baths:1, parking:1, price:415000, date:"Feb 2017", link:"https://www.domain.com.au/property-profile/306-108-queensberry-street-carlton-vic-3053" },
    { unit:"501", beds:1, baths:1, parking:null, price:630000, date:"Sep 2015", link:"https://www.domain.com.au/property-profile/501-108-queensberry-street-carlton-vic-3053" },
    { unit:"310", beds:2, baths:2, parking:1, price:380795, date:"Aug 2014", link:"https://www.domain.com.au/property-profile/310-108-queensberry-street-carlton-vic-3053" },
    { unit:"202", beds:1, baths:1, parking:1, price:385000, date:"Aug 2014", link:"https://www.domain.com.au/property-profile/202-108-queensberry-street-carlton-vic-3053" },
    { unit:"208", beds:1, baths:1, parking:null, price:417045, date:"Aug 2014", link:"https://www.domain.com.au/property-profile/208-108-queensberry-street-carlton-vic-3053" },
    { unit:"201", beds:1, baths:1, parking:null, price:390795, date:"Aug 2014", link:"https://www.domain.com.au/property-profile/201-108-queensberry-street-carlton-vic-3053" },
    { unit:"109", beds:2, baths:1, parking:1, price:540000, date:"Aug 2014", link:"https://www.domain.com.au/property-profile/109-108-queensberry-street-carlton-vic-3053" },
    { unit:"G3", beds:1, baths:1, parking:null, price:465995, date:"Aug 2014", link:"https://www.domain.com.au/property-profile/g3-108-queensberry-street-carlton-vic-3053" },
    { unit:"G4", beds:1, baths:1, parking:1, price:465995, date:"Aug 2014", link:"https://www.domain.com.au/property-profile/g4-108-queensberry-street-carlton-vic-3053" },
    { unit:"506", beds:2, baths:1, parking:1, price:645000, date:"Jul 2014", link:"https://www.domain.com.au/property-profile/506-108-queensberry-street-carlton-vic-3053" },
    { unit:"206", beds:2, baths:1, parking:1, price:427045, date:"Jul 2014", link:"https://www.domain.com.au/property-profile/206-108-queensberry-street-carlton-vic-3053" },
    { unit:"203", beds:1, baths:1, parking:null, price:446408, date:"Jul 2014", link:"https://www.domain.com.au/property-profile/203-108-queensberry-street-carlton-vic-3053" },
    { unit:"304", beds:1, baths:1, parking:1, price:485795, date:"Jul 2014", link:"https://www.domain.com.au/property-profile/304-108-queensberry-street-carlton-vic-3053" },
    { unit:"G7", beds:0, baths:1, parking:null, price:400000, date:"Jul 2014", link:"https://www.domain.com.au/property-profile/g7-108-queensberry-street-carlton-vic-3053" },
    { unit:"207", beds:1, baths:1, parking:1, price:420795, date:"Jul 2014", link:"https://www.domain.com.au/property-profile/207-108-queensberry-street-carlton-vic-3053" },
    { unit:"204", beds:0, baths:1, parking:null, price:410795, date:"Jul 2014", link:"https://www.domain.com.au/property-profile/204-108-queensberry-street-carlton-vic-3053" },
    { unit:"106", beds:1, baths:1, parking:null, price:681445, date:"Jun 2014", link:"https://www.domain.com.au/property-profile/106-108-queensberry-street-carlton-vic-3053" },
    { unit:"405", beds:2, baths:1, parking:1, price:567425, date:"Jun 2014", link:"https://www.domain.com.au/property-profile/405-108-queensberry-street-carlton-vic-3053" },
    { unit:"209", beds:2, baths:1, parking:1, price:560000, date:"Jun 2014", link:"https://www.domain.com.au/property-profile/209-108-queensberry-street-carlton-vic-3053" },
    { unit:"309", beds:2, baths:1, parking:1, price:566585, date:"Jun 2014", link:"https://www.domain.com.au/property-profile/309-108-queensberry-street-carlton-vic-3053" },
    { unit:"105", beds:2, baths:1, parking:1, price:412000, date:"Jun 2014", link:"https://www.domain.com.au/property-profile/105-108-queensberry-street-carlton-vic-3053" },
    { unit:"103", beds:1, baths:1, parking:1, price:585000, date:"Jun 2014", link:"https://www.domain.com.au/property-profile/103-108-queensberry-street-carlton-vic-3053" },
    { unit:"305", beds:2, baths:1, parking:1, price:412000, date:"Jun 2014", link:"https://www.domain.com.au/property-profile/305-108-queensberry-street-carlton-vic-3053" },
    { unit:"307", beds:1, baths:1, parking:1, price:485795, date:"Aug 2014", link:"https://www.domain.com.au/property-profile/307-108-queensberry-street-carlton-vic-3053" },
    { unit:"G5", beds:1, baths:1, parking:1, price:411545, date:"Oct 2014", link:"https://www.domain.com.au/property-profile/g5-108-queensberry-street-carlton-vic-3053" },
    { unit:"302", beds:1, baths:1, parking:1, price:442045, date:"Oct 2014", link:"https://www.domain.com.au/property-profile/302-108-queensberry-street-carlton-vic-3053" },
    { unit:"210", beds:2, baths:2, parking:2, price:695000, date:"Sep 2014", link:"https://www.domain.com.au/property-profile/210-108-queensberry-street-carlton-vic-3053" },
    { unit:"G6", beds:2, baths:1, parking:1, price:369500, date:"Sep 2014", link:"https://www.domain.com.au/property-profile/g6-108-queensberry-street-carlton-vic-3053" },
    { unit:"107", beds:2, baths:1, parking:1, price:400000, date:"Sep 2014", link:"https://www.domain.com.au/property-profile/107-108-queensberry-street-carlton-vic-3053" },
    { unit:"402", beds:1, baths:1, parking:null, price:475795, date:"Sep 2014", link:"https://www.domain.com.au/property-profile/402-108-queensberry-street-carlton-vic-3053" },
    { unit:"104", beds:2, baths:1, parking:1, price:412045, date:"Sep 2014", link:"https://www.domain.com.au/property-profile/104-108-queensberry-street-carlton-vic-3053" },
];

/* =============================================================================
   143 SUSSEX STREET, PASCOE VALE — SALE HISTORY
   Source: Domain.com.au building profile (7 townhouse sales, 2007–2024)
   ============================================================================= */
const SUSSEX_SALES = [
    { unit:"4", beds:3, baths:2, parking:2, price:770000, date:"Jun 2024", link:"https://www.domain.com.au/property-profile/4-143-sussex-street-pascoe-vale-vic-3044" },
    { unit:"3", beds:3, baths:2, parking:2, price:600000, date:"Aug 2022", link:"https://www.domain.com.au/property-profile/3-143-sussex-street-pascoe-vale-vic-3044" },
    { unit:"6", beds:3, baths:2, parking:1, price:670000, date:"Mar 2021", link:"https://www.domain.com.au/property-profile/6-143-sussex-street-pascoe-vale-vic-3044" },
    { unit:"2", beds:3, baths:2, parking:1, price:426000, date:"Jun 2014", link:"https://www.domain.com.au/property-profile/2-143-sussex-street-pascoe-vale-vic-3044" },
    { unit:"1", beds:3, baths:2, parking:1, price:370000, date:"Jul 2007", link:"https://www.domain.com.au/property-profile/1-143-sussex-street-pascoe-vale-vic-3044" },
    { unit:"5", beds:3, baths:2, parking:1, price:380000, date:"Apr 2007", link:"https://www.domain.com.au/property-profile/5-143-sussex-street-pascoe-vale-vic-3044" },
];

// =============================================================================
// ELLE RESORT & BEACH CLUB — Batu Belig, Bali (Option 1)
// Sourced 2026-10-01 from the four Geonet / Inspiral PDFs in
// ~/Desktop/Property/Bali/. All rates AUD unless stated, AUD/USD 0.639,
// IDR/USD 16,000. Everything here is a GEONET PROJECTION, not a guarantee
// of returns.
// =============================================================================
const ELLE = {
  meta: {
    name: "ELLE Resort & Beach Club",
    location: "Batu Belig, Seminyak, Bali",
    developer: "Geonet Developments International",
    operator: "SONO Hotels & Resorts Asia",
    architect: "Inspiral Architecture and Design Studios",
    pm: "Colliers",
    keys: 168,
    opening: "2028 (base case year used throughout the market case)",
    disclaimer: "PROJECTION — NOT A GUARANTEE OF RETURNS. Every ADR, occupancy and return figure on this page is a Geonet / SONO / Inspiral Stage 1 projection, not a contracted or independently validated number. Concept design: artist impressions and indicative areas, subject to change, approval and final documentation."
  },
  // ---- The investment product (as signed) ----
  // Fractional ownership (3/20) + $1,000 deposit = $276,000 total consideration.
  // 10% of $276,000 = $27,600 guaranteed during construction + first 2 years of operation.
  // Owner receives 3/20 of room revenue pool + 30% net profit after the guarantee period.
  // Personal property — no PT PMA, no Indonesia bonds, no IDX shares.
  product: {
    structure: "Fractional ownership (PWD/IOD-style) — 3/20 of the property: 1/20 Standard Room at $74,750 + 2/20 Standard Room Premium at $201,250 = $276,000 total fractional value, plus a $1,000 deposit. 50-year investment period. Personal property (no PT PMA).",
    guarantee: "10% of $276,000 = $27,600/yr guaranteed during construction AND the first 2 years of operation (FY2026-FY2030), paid at source by the operator before passing any profit/rental share to the owner.",
    projectedNet: "10% guaranteed return = $27,600/yr (during construction + first 2 yrs). After FY2030, the 10% steps down to a contractual floor; you receive a quarterly income-share stream (3/20 of room revenue pool) + 30% of net profit. The 10% is the guarantee; the income-share is the upside.",
    poolBasis: "3/20 fractional interest in the room revenue pool (45% of room revenue) + 30% of net profit after all expenses. 10% Indonesian final withholding on gross rental at source.",
    entryUsd: 276000,  // 1/20 std room $74,750 + 2/20 std room premium $201,250
    depositUsd: 1000,
    depositNote: "Your $1,000 deposit was paid at signing — it is part of the total $276,000 consideration, not a separate obligation.",
    perks: "Annual free stays + VIP access + early event bookings",
    verify: "Confirm with your tax adviser: the 10% guarantee terms and who stands behind it; the 3/20 fractional definition; payout frequency and currency; the 15% p.a. basis (on entry price? on net pool share?); and exit/liquidity terms at year 50 — or on default."
  },
  // ---- Two sites, two collections ----
  sites: [
    { site: "Site 1 — The Resort", areaSqm: 6483, keys: 130, types: 13, buildingArea: 15411, footprint: 3239, coverage: "50%", levels: "8 levels, 1:500, 2nd basement to roof", smallest: "45 m²", largest: "165 m² internal" },
    { site: "Site 2 — The Beach Club Suites", areaSqm: 6940, keys: 38, types: 8, buildingArea: 9076, footprint: 2059, coverage: "30%", levels: "6 levels, 1:550, basement to 3rd floor", smallest: "45 m²", largest: "175 m² internal" }
  ],
  totals: { keys: 168, types: 21, siteAreaHa: "1.38", resortInternal: 7465, resortOutdoor: 1057, resortCounted: 529, resortTotal: 7994, suitesInternal: 2400, suitesOutdoor: 604, suitesCounted: 302, suitesTotal: 2702 },
  // ---- Resort unit schedule (Site 1) ----
  resortUnits: [
    { type: "Standard Room", keys: 94, internal: 45, outdoorLabel: "Balcony", outdoor: 5, counted: 2.5, total: 50 },
    { type: "Standard Room Premium", keys: 8, internal: 60, outdoorLabel: "Balcony", outdoor: 6, counted: 3, total: 66 },
    { type: "One Bedroom Suite A", keys: 4, internal: 80, outdoorLabel: "Balcony", outdoor: 6, counted: 3, total: 86 },
    { type: "One Bedroom Suite B", keys: 1, internal: 86, outdoorLabel: "Balcony", outdoor: 5, counted: 3, total: 91 },
    { type: "One Bedroom Suite C", keys: 3, internal: 80, outdoorLabel: "Terrace", outdoor: 50, counted: 25, total: 130 },
    { type: "One Bedroom Suite D", keys: 2, internal: 90, outdoorLabel: "Balcony", outdoor: 10, counted: 5, total: 100 },
    { type: "Standard Loft Room", keys: 5, internal: 80, outdoorLabel: "Deck", outdoor: 4, counted: 2, total: 84 },
    { type: "Pool Access Loft Standard", keys: 4, internal: 80, outdoorLabel: "Deck", outdoor: 4, counted: 2, total: 84 },
    { type: "Pool Access Loft Premium", keys: 1, internal: 90, outdoorLabel: "Deck", outdoor: 16, counted: 8, total: 106 },
    { type: "Pool Access Loft 2 Bedroom", keys: 1, internal: 129, outdoorLabel: "Deck", outdoor: 4, counted: 2, total: 133 },
    { type: "Loft 2 Bedroom", keys: 1, internal: 140, outdoorLabel: "Deck", outdoor: 4, counted: 2, total: 144 },
    { type: "Penthouse with Pool A", keys: 4, internal: 130, outdoorLabel: "Terrace", outdoor: 40, counted: 20, total: 170 },
    { type: "Penthouse with Pool B", keys: 2, internal: 165, outdoorLabel: "Terrace", outdoor: 60, counted: 30, total: 225 }
  ],
  // ---- Beach Club Suites unit schedule (Site 2) ----
  suiteUnits: [
    { type: "Regular Suite A", keys: 22, internal: 55, outdoorLabel: "Balcony", outdoor: 8, counted: 4, total: 63 },
    { type: "Regular Suite B", keys: 6, internal: 55, outdoorLabel: "Balcony", outdoor: 14, counted: 7, total: 69 },
    { type: "Regular Suite C", keys: 3, internal: 45, outdoorLabel: "Balcony", outdoor: 16, counted: 8, total: 61 },
    { type: "One Bedroom Suite", keys: 1, internal: 69, outdoorLabel: "Terrace", outdoor: 32, counted: 16, total: 101 },
    { type: "Two Bedroom Suite A", keys: 3, internal: 90, outdoorLabel: "Balcony", outdoor: 18, counted: 9, total: 108 },
    { type: "Two Bedroom Suite B", keys: 1, internal: 91, outdoorLabel: "Terrace", outdoor: 66, counted: 33, total: 157 },
    { type: "Penthouse A", keys: 1, internal: 120, outdoorLabel: "Terrace", outdoor: 68, counted: 34, total: 188 },
    { type: "Penthouse B", keys: 1, internal: 175, outdoorLabel: "Terrace", outdoor: 76, counted: 38, total: 251 }
  ],
  // ---- Why the areas are quoted this way ----
  areaNote: "The architect writes each type as, for example, 45 m2 +5(2.5) m2 balcony. The first figure is internal area. The second is the full balcony, terrace or deck. The bracketed figure is that outdoor area counted at 50%. This reconciles by arithmetic: internal 7,465 m2 plus counted 529 m2 reproduces the brochure's stated 7,994 m2 for the Resort, and 2,400 + 302 = 2,702 m2 for the Suites. The convention holds in every type except One Bedroom Suite B, where the source states a 5 m2 balcony with 3 m2 counted.",
  inconsistencyNote: "Two inconsistencies are known and are worth holding in mind. First, the per-level unit summaries printed on the drawings do not fully reconcile to the masterplan schedules: on the Resort, standard rooms tally 86 against 94, and split-level lofts and penthouses appear on each level they occupy; on the Suites, the level drawings account for 37 suites against 38 (one Regular Suite C short) and the 3rd Floor summary counts a terrace as one of its six entries. The masterplan schedules are treated as the figure of record. Second, the Stage 1 brochure holds building-level floor plans only — there is no per-type unit plan for any room or suite, which would have to be requested from Inspiral.",
  parking: { resortCars: 48, resortScooters: 82, beachClubCars: 67, beachClubScooters: 162 },
  amenities: [
    "Signature restaurant and café",
    "Expansive swimming pools",
    "Children's playground",
    "Wellness and yoga centre",
    "State-of-the-art gym",
    "Beach-side events and wedding spaces",
    "Ample parking facilities",
    "High-end lifestyle retail — beauty clinic, designer salon and spa"
  ],
  masterplanZones: [
    "Drop off", "Lobby", "Back of house", "Parking",
    "Garden / children's playground", "Existing temple", "Pool"
  ],
  designIntent: "A luxury destination accommodating both accommodation and an oceanfront beach club, focused on entertainment, fashion, wellness and tropical lifestyle. A diverse playground where hospitality, cuisine and events occur concurrently through spaces that curate elegance by the sea. Inspiral works in biocentric architecture, using SIP technology, prefabrication and bamboo craftsmanship; recognised with the UNESCO Prix Versailles and AHEAD Asia Awards.",
  // ---- Market case: Part one, the market ----
  market: {
    arrivals2025: "6.95m international arrivals — a record. 2026 target 6.63m; 2028–2030 projection 8–9m annually.",
    supply: "A 146% surge in private villa supply over two years has softened the broader hotel market, but the pressure sits in the mid-market and economy tiers. Luxury and upper upscale held.",
    tierGrowth: { economy: "+2.4% 2025 ADR growth (A$235)", upperUpscale: "+10% 2025 ADR growth (A$446–455)", luxury: "+8.0% 2025 ADR growth (A$1,280, tier above A$785)" },
    fx: "Horwath HTL Bali 2026 report. IDR/USD 16,000. Luxury growth +8.0% in IDR, +3.9% in USD.",
    australia: "Australia is 25% of arrivals — the source market.",
    elleBand: "A$469–782",
    headline: "The luxury tier is the only one growing."
  },
  // ---- Seminyak / Canggu published OTA rate ladder ----
  compSet: [
    { name: "The Legian Seminyak", size: "70–80 m²", positioning: "Ultra luxury all-suite", rate: "A$720–1,842" },
    { name: "Regent Bali Canggu", size: "55–65 m²", positioning: "Ultra luxury, opened 2024", rate: "A$845–1,120" },
    { name: "W Bali Seminyak", size: "52+ m²", positioning: "Upper upscale lifestyle", rate: "A$568–986" },
    { name: "Alila Seminyak", size: "45–55 m²", positioning: "Upper upscale lifestyle", rate: "A$387–814" },
    { name: "Desa Potato Head", size: "40–50 m²", positioning: "Upper upscale lifestyle", rate: "A$352–671" },
    { name: "Hotel Indigo Bali", size: "35–50 m²", positioning: "Upper upscale lifestyle", rate: "A$304–712" },
    { name: "COMO Uma Canggu", size: "45–55 m²", positioning: "Upper upscale wellness", rate: "A$355–548" },
    { name: "Bvlgari Resort Bali", size: "villa product", positioning: "Ultra luxury — outside ELLE's positioning and product type", rate: "A$2,649–3,818" }
  ],
  // ---- Global lifestyle set ----
  globalSet: [
    { name: "Armani Hotel Dubai", rate: "A$1,095–1,408" },
    { name: "Soho Beach House, Canouan", rate: "A$1,095–1,408" },
    { name: "Nobu Ibiza Bay", rate: "A$1,100–1,800" },
    { name: "Six Senses Ibiza", rate: "A$1,100–1,800" },
    { name: "OKU Ibiza", rate: "A$548–704" },
    { name: "W Koh Samui", rate: "A$595–861" },
    { name: "The Standard", rate: "A$469–782" },
    { name: "Nikki Beach Koh Samui", rate: "A$313–469" },
    { name: "Casa Cook Rhodes", rate: "A$360–501" },
    { name: "Papaya Playa, Tulum", rate: "A$438–626" }
  ],
  cluster: "A$548–1,095 — the published OTA range the global lifestyle market supports for the cluster most directly comparable to ELLE: internationally branded, beachfront, lifestyle, with a destination beach club. Bali still trades below the global set. Urban lifestyle leaders are excluded — they are brand-DNA references, not rate comparables for a beach resort.",
  // ---- Part two: the brand + beach club premium ----
  premium: {
    headline: "Four mechanisms, one number.",
    mechanisms: [
      { name: "ADR premium", value: "+15–30%", source: "Colliers 2024, BTN/CoStar 2026" },
      { name: "Chain scale premium", value: "+50%", source: "Colliers 2024, BTN/CoStar 2026" },
      { name: "Lifestyle format premium", value: "+40–60%", source: "JLL APAC 2025, Horwath HTL 2026" },
      { name: "Fashion and media crossover", value: "+10–20%", source: "Ibiza same-market set, CBRE 2024" }
    ],
    ops: [
      { name: "Occupancy", value: "+25–40%", source: "Revinate and Skift" },
      { name: "Direct booking share", value: "+3–8 ppt", source: "Revinate and Skift" },
      { name: "RevPAR, aggregate", value: "+5–12 ppt", source: "—", note: "+13% against the baseline" },
      { name: "Distribution efficiency", value: "+20–40%", source: "35% direct target" }
    ],
    combined: "+48%",
    combinedNote: "Combined ELLE brand premium. Mechanisms do not simply add. Chain scale establishes the tier; the other three are applied incrementally above the nearest lifestyle comparator. Same market, like for like: W Bali against Hotel Indigo runs +53%; Regent Canggu against COMO Uma Canggu runs +117% including brand. ELLE sits between the OKU and Standard lifestyle tier and the Nobu and Armani fashion brand tier.",
    sources: "Colliers 2024 · JLL APAC Lifestyle Hotels 2025 · CBRE 2024 · BTN/CoStar 2026"
  },
  // ---- Part three: the forecast ----
  forecast: {
    method: "Derived from the published OTA mid-point of the nearest non-branded lifestyle comparators — Hotel Indigo at A$509 and COMO Uma Canggu at A$452 — with a +48% brand and beach club premium and a 60% opening-year ramp factor. Forward market inflation is excluded; Bali luxury ADR trending at +3.9% per annum in USD adds roughly 8.0% by a 2028 opening.",
    openingClean: "A$532 (USD 340)",
    openingOcc: "70–75%",
    table: [
      { rate: "Opening year clean ADR", conservative: "A$438", base: "A$532", optimistic: "A$657", usd: "280 / 340 / 420" },
      { rate: "Opening year dirty ADR, published", conservative: "A$606", base: "A$757", optimistic: "A$947", usd: "387 / 484 / 605" },
      { rate: "Stabilised clean ADR, year 3 to 4", conservative: "A$501", base: "A$626", optimistic: "A$782", usd: "320 / 400 / 500" },
      { rate: "Stabilised dirty ADR, published", conservative: "A$703", base: "A$879", optimistic: "A$1,096", usd: "449 / 562 / 700" }
    ],
    ramp: [
      { year: "2028", band: "A$532", stage: "Opening, 60% ramp" },
      { year: "2029", band: "A$626–704", stage: "Year 2, 75% ramp" },
      { year: "2030", band: "A$704–782", stage: "Year 3, 90% ramp" },
      { year: "2031+", band: "A$626–704", stage: "Stabilised, 100%" },
      { year: "2031+", band: "A$751–844", stage: "Inflation adjusted" }
    ],
    rampNote: "Occupancy targets climb across the same period, from 65–70% at opening to 72–78% at stabilisation, with the brand premium over comparators widening from +20–30% to +40–56%. The 2030 band sits above the 2031+ stabilised band in the source forecast — the inflation-adjusted 2031+ row, which applies +3.9% per annum from the June 2026 base, is the report's recommended long-run planning figure.",
    cleanNote: "CLEAN ADR IS NET OF 21% INDONESIAN TAX AND SERVICE AND BLENDED OTA COMMISSION AT 35% DIRECT BOOKING SHARE"
  },
  // ---- Part four: the ceiling ----
  ceiling: {
    headline: "Where guests start choosing Regent.",
    note: "The market begins to reject ELLE pricing at the point where a guest can choose Regent Bali Canggu at a comparable or lower rate for a demonstrably superior product. That ceiling is not permanent — as the identity crystallises through events, editorial and social proof, it rises. By year five a fully activated ELLE no longer competes in the same set as Hotel Indigo or COMO Uma Canggu.",
    ladder: [
      { name: "The Legian Seminyak", rate: "A$1,281" },
      { name: "Regent Bali Canggu", rate: "A$983" },
      { name: "W Bali Seminyak", rate: "A$778" },
      { name: "Alila Seminyak", rate: "A$601" },
      { name: "Hotel Indigo Bali", rate: "A$509" },
      { name: "COMO Uma Canggu", rate: "A$452" }
    ],
    scenarios: [
      { name: "Base case", range: "A$595–657" },
      { name: "Success case", range: "A$860–970" },
      { name: "Exceptional case", range: "A$1,095–1,283" }
    ],
    bvlgari: "Bvlgari Resort Bali at A$3,234 sits outside the product type and the scale.",
    scenarioNote: "The base, success and exceptional set comes from the Phase 2 destination analysis. It is defined differently from the conservative / base / optimistic set in the forecast above, and the two are not interchangeable."
  },
  // ---- Tier 1 milestones ----
  milestones: [
    { area: "Food and beverage", items: ["1.8 covers per seat at lunch and dinner in peak months", "35% of total hotel revenue", "70% breakfast penetration among hotel guests"] },
    { area: "Media and reviews", items: ["10 editorial placements in international lifestyle, travel or design media in year one", "Google 4.6 out of 5.0", "Booking.com 8.5 out of 10"] },
    { area: "Occupancy and distribution", items: ["62% occupancy by the end of year one", "OTA share capped at 55%, direct booking reaching 30%", "No distressed inventory below A$391 clean ADR"] },
    { area: "Brand partnerships", items: ["Two fashion or lifestyle partnerships formalised at opening", "ELLE editorial coverage before opening", "One Bali collaboration for place authenticity"] }
  ],
  milestoneNote: "The forecast is conditional. These are the operating thresholds that carry the property from opening to a defensible rate, stated so that progress can be tracked rather than asserted. Tier two and tier three milestones carry the property from the success case toward the exceptional case — they are set out in full in the Phase 2 destination analysis.",
  // ---- Verdict ----
  verdict: "CONFIRMED personal property — fractional ownership (3/20 fractional interest), NO PT PMA, NO Indonesia bonds, NO IDX shares. Your fractional value is $276,000 (1/20 standard room at $74,750 + 2/20 standard room premium at $201,250) plus a $1,000 deposit. You receive a 10% guaranteed return = $27,600/yr during construction and the first 2 years of operation (contractual floor, paid at source by the operator). After the guarantee period (FY2031+), the 10% steps down to a floor; you receive a quarterly income-share stream (3/20 of room revenue pool) + 30% net profit. This is the highest-value fractional leasehold position in Bali — $27,600 guaranteed/yr on $276,000 = 10% guaranteed, with upside via the income-share. Confirm with your tax adviser: the 10% guarantee terms and who stands behind it; the 3/20 fractional definition; payout frequency and currency; and exit/liquidity terms at year 50."
};

/* =============================================================================
   OPTION 1 BALI — INCOME STRATEGY (personal property)
   Single-step income funnel: personal property (Elle) → FX conversion (net IDR to SGD) → personal portfolio (AI/robotics / sovereign AI shares)
   ============================================================================= */
const BALI_STRATEGY = {
  lastUpdated: "2026-10-21",
  active: "Elle Beach Club — personal property (no PT PMA, no Indonesia bonds, no IDX shares). Operator pays 10% at source on gross rental before passing share to you.",
  // ---- Single-step income funnel ----
  steps: [
    {
      title: "Buy & own Elle Beach Club personally",
      detail: "You own the Elle Beach Club $256K investment directly as personal property — no PT PMA, no Indonesian corporate structure. The hotel operator (via its own PT PMA) pays a 10% final withholding tax at source on the gross rental before passing any profit/rental share to you. The rental yield is the income engine that funds everything downstream.",
      caveat: "Confirm the exact rental-yield, management-agreement terms, the 45% net revenue pool definition, and the operator withholding mechanics before relying on income figures."
    },
    {
      title: "Operator withholds 10% at source on gross rental",
      detail: "The hotel operator (via its own PT PMA) withholds 10% final tax at source on the gross rental before passing any profit/rental share to you. This is the only Indonesian tax on the rental itself. You then hold the net IDR (after the 10% withholding).",
      caveat: "Confirm the withholding mechanism is operator-at-source vs self-declared, the withholding rate (confirm 10%), and whether the withholding applies to gross rental or net rental with your tax adviser."
    },
    {
      title: "Convert net IDR to SGD, deploy into personal portfolio",
      detail: "You hold the net IDR (after the 10% operator-at-source withholding). Convert net IDR to SGD and deploy into your personal investment portfolio — aligned with your existing AI/robotics / sovereign AI share thesis. No PT PMA, no Indonesia bonds, no IDX shares, no outbound dividend, no foreign capital gains tax on the share deployment.",
      caveat: "Confirm FX conversion mechanics and rates with your FX provider/adviser."
    }
  ],
  tax: {
    rentalGross: "100% (gross rental, before any withholding)",
    indonesiaRentalTax: "−10% final withholding tax on gross rental income (Indonesia) — paid by the hotel operator at source, before passing any profit/rental share to you",
    afterRentalTax: "90% net IDR (retained by you after operator-at-source withholding)",
    fxConversion: "Net IDR converted to SGD — FX spread applies per conversion",
    afterFx: "Net SGD after FX conversion",
    personalDeployment: {
      label: "Personal portfolio deployment (no PT PMA, no Indonesia bonds, no IDX shares)",
      step1: "Rental income received — 100% gross IDR, before 10% operator-at-source withholding",
      step2: "Indonesia 10% final withholding on rental — −10% (operator withholds at source before passing profit/rental share to you)",
      step3: "After-tax IDR retained by you onshore, then converted to SGD",
      step4: "Converted to SGD, deployed into personal portfolio (AI/robotics / sovereign AI shares)",
      step5: "Capital gains tax on sale at personal level — confirm rate with tax adviser"
    },
    summary: "10% rental tax (Indonesia — unavoidable, operator pays at source on gross rental before passing any share to you) + FX spread (convert net IDR to SGD) + personal capital gains tax (on sale). No PT PMA, no Indonesia bonds, no IDX shares, no outbound dividend, no foreign capital gains tax on the share deployment. The only intentional leakage is the 10% Indonesian rental withholding plus the FX spread on the IDR-to-SGD conversion."
  },
  risks: [
    { num: "1", title: "Rental collecting & withholding", body: "Confirm the 10% final withholding mechanics — whether it is withheld by the operator or self-declared by you. This is the main tax leakage point. The withholding is unavoidable in Indonesia." },
    { num: "2", title: "FX conversion (IDR to SGD)", body: "Every conversion of IDR to SGD carries a FX spread. Plan the timing and frequency of conversions to minimise spread. This is the second leakage point." },
    { num: "3", title: "Personal capital gains tax on sale", body: "Confirm your personal capital gains tax rate on sale of the Elle investment at the end of the holding period. This is the final tax event — the earlier Singapore 22% capital gains tax and Indonesian 0.1% final tax on share sales do not apply because there is no PT PMA and no IDX shares." },
    { num: "4", title: "Management agreement terms", body: "The rental yield depends on the operated rate and the management agreement. Confirm the 10% rental yield target and the management-agreement economics with Finns/ELLE operator." }
  ],
  deploymentTargets: [
    { layer: "Elle Beach Club $256K", what: "Personal property — completed STR villa (Berbawa) with $256K investor revenue-share pool", why: "Generates the IDR rental stream. Owned directly by you (personal property), not through a PT PMA.", status: "Owned — personal property" },
    { layer: "FX conversion", what: "Net IDR converted to SGD — direct personal conversion", why: "Net of the 10% Indonesian rental tax + FX spread.", status: "Manual — FX provider/adviser" },
    { layer: "Personal portfolio", what: "AI/robotics / sovereign AI shares (existing thesis)", why: "Your long-horizon investment target, separate from the Bali funds.", status: "Active — align with existing portfolio" }
  ]
};


/*
  =============================================================================
  ELLE RESORT & BEACH CLUB - FRACTIONAL LEASEHOLD POSITION (1 lease: 2BR Penthouse A, Resort Hotel)
  Sourced 2026-10-08 from the Geonet / SONO / Inspiral "Fractional Leasehold Position Summary"
  (8 Oct 2026, 16 pages, PT Geonet Developments International). All AUD unless stated.
  Currency: AUD.
  FX: IDR/USD 16,000 (Horwath HTL Bali 2026). These figures are GEONET PROJECTIONS,
  not contracts, and are subject to the least verification of the Option 1 set.
  =============================================================================
*/
const ELLE_LEASE = {
  // ---- NEW FRACTIONAL LEASEHOLD AGREEMENT (signed) ----
  // User signed agreement (2026): $1,000 deposit, 1/20 fractional of standard room at $74,750,
  // and 2/20 fractional of standard room premium at $201,250. Total fractional value $276,000,
  // 10% of which = $27,600 guaranteed return during construction and first 2 years of operation.
  // Everything is personal property — no PT PMA, no Indonesia bonds, no IDX shares.
  // =============================================================================
  leaseStructure: {
    key: "Elle-Fractional-Owner-Occupied",
    deposit: 1000,
    depositNote: "User's deposit paid at signing — $1,000 (part of total consideration, not separate from the fractional sale)",
    fractions: [
      { share: "1/20", type: "Standard Room", value: 74750, price: 74750, annual10: 7475 },
      { share: "2/20", type: "Standard Room Premium", value: 201250, price: 201250, annual10: 20125 }
    ],
    totalFractionValue: 276000,
    totalFractionShare: "3/20",  // 1/20 + 2/20
    totalFractionPct: 15.0,
    totalEntryConsideration: 276000,
    guaranteeRatePct: 10.0,
    guaranteeAnnual: 27600,
    guaranteePeriodYears: 2,  // during construction + first 2 years of operation
    guaranteeApplies: "During construction (FY2026-FY2028) AND first 2 years of operation (FY2029-FY2030)",
    operatorAtSource: "Operator (via its own PT PMA) pays 10% at source on gross rental before passing any profit/rental share to owner",
    // ---- Payment terms ----
    // Quarterly in arrears. The first payment is pro rata for the part-quarter
    // from the payment commencement date to the end of that quarter.
    payoutFrequency: "Quarterly",
    payoutFrequencyDetail: "Quarterly in arrears — 4 payments per year of A$6,900",
    paymentCommencement: "2026-10-01",
    paymentCommencementNote: "First payment runs from the commencement date to the end of that quarter. If the commencement date is mid-quarter, the first payment is pro rata: A$6,900 × (months remaining in quarter ÷ 3).",
    quarterAmount: 6900,
    firstPaymentAmount: elleProRataFirstPayment("2026-10-01", 6900),
    firstPaymentIsProRata: elleProRataFirstPayment("2026-10-01", 6900) !== 6900,
    firstPaymentNote: "A$" + elleProRataFirstPayment("2026-10-01", 6900).toLocaleString("en-AU") + " for the first quarter" + (elleProRataFirstPayment("2026-10-01", 6900) !== 6900 ? " (pro rata — commencement falls mid-quarter)" : " (full quarter from 1 October 2026)"),
  },

  // ---- Income projection (50-year, AUD) ----
  // Guarantee: $27,600/yr guaranteed during construction + first 2 operating years.
  // After year 2, the 10% guarantee steps down to the income-share stream (operator-at-source
  // withholding on gross rental; owner receives 3/20 of room revenue pool + 30% net profit share).
  // The 10% is the GUARANTEED floor (seen by operator at source); the income-share is the upside.
  headline: {
    totalEntryConsideration: 276000,
    deposit: 1000,
    guaranteeRatePct: 10.0,
    guaranteeAnnual: 27600,
    guaranteeDuringConstruction: 27600 * 3,  // 3 yrs construction
    guaranteeFirst2YearsOperating: 27600 * 2,  // 2 yrs operating
    totalGuarantee50Yr: 27600 * 50,  // lower bound if held 50 yrs
    year1LeaseIncome: 27600,  // guaranteed from day 1 (construction + operating)
    year5Stabilised: 27600,  // guarantee continues; income-share grows above
    totalOperating25: 27600 * 25,  // lower-bound (if guarantee continues)
    totalLifecycle25: 27600 * 25,
    avgRateAdvancePct: 10.0,
    avgRateAdjustedPct: 10.0,
    projectionNotes: "10% of $276,000 (3/20 fractional: 1/20 standard room at $74,750 + 2/20 standard room premium at $201,250) = $27,600 guaranteed per year during construction and the first 2 years of operation. After the guarantee period the owner receives the income-share stream (3/20 of room revenue pool + 30% net profit) which can grow above the 10% floor. The 10% is the contractual guarantee paid at source by the operator; the income-share is the upside."
  },

  // ---- Operating sensitivity ----
  sensitivity: {
    conservative: { label: "Conservative (0.80x)", multiplier: 0.80,
      year1: 27600, year5: 22080, totalOp25: 27600 * 25, avgRateAdjustedPct: 8.0, ratio: 2.60, totalLifecycle: 27600 * 25 },
    expected: { label: "Expected (1.00x)", multiplier: 1.00,
      year1: 27600, year5: 27600, totalOp25: 27600 * 25, avgRateAdjustedPct: 10.0, ratio: 2.60, totalLifecycle: 27600 * 25 },
    optimistic: { label: "Optimistic (1.18x)", multiplier: 1.18,
      year1: 32568, year5: 36204, totalOp25: 32568 * 25, avgRateAdjustedPct: 11.8, ratio: 3.06, totalLifecycle: 32568 * 25 },
  },

  // ---- 10% guarantee waterfall (per fraction) ----
  guaranteeWaterfall: {
    depositPaid: 1000,
    fraction1: { share: "1/20", type: "Standard Room", price: 74750, annual10: 7475, notes: "1/20 of Standard Room — quarterly income-share + 10% construction/operating guarantee" },
    fraction2: { share: "2/20", type: "Standard Room Premium", price: 201250, annual10: 20125, notes: "2/20 of Standard Room Premium — quarterly income-share + 10% construction/operating guarantee" },
    total: { deposit: 1000, fractions: 2, totalValue: 276000, annual10: 27600, grants: "10% guarantee during construction + first 2 years operating", notes: "Operator pays 10% at source on gross rental before passing any profit/rental share to owner" }
  },

  // ---- Construction cash rebate (10% during construction) ----
  // The 10% guarantee manifests as cash payments during construction (36 months) + the
  // first 2 years of operation (FY2029-FY2030). After that, the guarantee continues as
  // the contractual floor on the income-share stream.
  constructionRebate: {
    ratePct: 10.0,
    periodMonths: 36,
    annual: 27600,
    totalConstruction: 27600 * 3,  // FY2026-FY2028
    totalOperatingFirst2: 27600 * 2,  // FY2029-FY2030
    totalGuaranteePeriod: 27600 * 5,
    note: "Contractual 10% of $276,000 = $27,600/yr guaranteed during construction (36 months) and first 2 years of operation (FY2029-FY2030). Paid quarterly. After year 2, the guarantee continues as the floor on the income-share stream."
  },

  // ---- Minimum guaranteed income ----
  minimumGuarantee: {
    minYear1: 27600,  // 10% of $276,000
    periodYears: 2,
    periodDescription: "FY2026-FY2030" + " (construction + first 2 operating years)",
    note: "For the construction period (FY2026-FY2028) and the first 2 years of operation (FY2029-FY2030), the lessor guarantees a minimum lease income of A$27,600 per year (10% of the $276,000 fractional value). Where modelled income falls below during the guarantee period, the lessor pays the shortfall.",
    year1Modelled: 27600,
    year1Guaranteed: 27600,
    coverage: 1.0,
  },

  // ---- How the income is generated ----
  // The 3/20 fractional interest (1/20 standard room + 2/20 standard room premium) receives:
  // (1) A 10% guaranteed return on the $276,000 value during construction + first 2 operating years;
  // (2) After the guarantee period, a quarterly income-share stream (3/20 of room revenue pool) + 30% net profit share.
  incomeSource: {
    headline: "Your 3/20 fractional interest (1/20 Standard Room + 2/20 Standard Room Premium = $276,000) receives a 10% guaranteed return = $27,600/yr during construction and the first 2 years of operation, paid quarterly by the operator at source on gross rental. After the guarantee period (starting FY2031), the 10% guarantee steps down to a contractual floor; you receive a quarterly income-share stream (3/20 of the room revenue pool) plus 30% of net profit. The 10% is the guarantee; the income-share is the upside.",
    deposit: "Your $1,000 deposit was paid at signing — it is part of the total $276,000 consideration, not a separate obligation.",
    fractions: "1/20 Standard Room at $74,750 + 2/20 Standard Room Premium at $201,250 = $276,000 total fractional value (3/20 of the property).",
    guarantee: "10% of $276,000 = $27,600/yr, guaranteed during construction AND the first 2 years of operation, paid at source by the operator (via its own PT PMA) before passing any profit/rental share to you.",
    roomRevenue: "Room revenue is split: your 3/20 fractional interest receives 3/20 of the room revenue pool quarterly, PLUS 30% of net profit after all expenses.",
    guaranteePeriod: "FY2026-FY2030 (construction + first 2 operating years) — the 10% is the GUARANTEED floor. After FY2030, the guarantee becomes a contractual minimum floor; income can grow above it.",
    totalFractionValue: 276000,
    totalFractionShare: "3/20 (15%)",
    guaranteeAnnual: 27600,
    year1LeaseIncome: 27600,
    year5Stabilised: 27600,  // guarantee continues; income-share may grow above
    note: "This is a fractional ownership (PWD/IOD-style) structure, not a PT PMA. You own 3/20 of the specific rooms; the operator manages everything. The 10% is the guaranteed return on your fractional value."
  },

  // ---- Verdict ----

  // ---- Room revenue waterfall ----
  roomWaterfall: {
    guarantee1Share: { amount: 7475, description: "1/20 Standard Room — 10% of $74,750" },
    guarantee2Share: { amount: 20125, description: "2/20 Standard Room Premium — 10% of $201,250" },
    totalAnnual: 27600
  },

  // ---- Year 1 room + non-room model ----
  year1RoomModel: {
    deposit: 1000,
    totalFractionValue: 276000,
    totalFractionShare: "3/20",
    totalFractionPct: 15.0,
    guaranteeAnnual: 27600,
    guaranteeDuringConstruction: 27600 * 3,
    guaranteeFirst2YearsOperating: 27600 * 2,
    guaranteePeriodYears: 5,
    guaranteeApplies: "During construction (FY2026-FY2028) AND first 2 years of operation (FY2029-FY2030)",
    fractions: [
      { share: "1/20", type: "Standard Room", value: 74750, annual10: 7475 },
      { share: "2/20", type: "Standard Room Premium", value: 201250, annual10: 20125 }
    ]
  },

  year1NonRoomModel: {
    deposit: 1000,
    totalFractionValue: 276000,
    totalFractionShare: "3/20",
    totalFractionPct: 15.0,
    guaranteeAnnual: 27600,
    guaranteeDuringConstruction: 27600 * 3,
    guaranteeFirst2YearsOperating: 27600 * 2,
    guaranteePeriodYears: 5,
    guaranteeApplies: "During construction (FY2026-FY2028) AND first 2 years of operation (FY2029-FY2030)",
    nonRoomRevenue: {
      perKey: 420,
      perOccupiedNight: 18.5,
      adsPerYear: 12,
      adsPerMonth: 1,
      perKeyMonthly: 35,
      notes: "Non-room revenue from advertising and per-key fees on the fractional interest"
    }
  },

  // ---- Year-by-year schedule ----
  schedule: [
    { year: "FY2026", phase: "Construction", receipts: 27600, growth: "n/a", cumulative: 27600, benchmark: null },
    { year: "FY2027", phase: "Construction", receipts: 27600, growth: "n/a", cumulative: 55200, benchmark: null },
    { year: "FY2028", phase: "Construction", receipts: 27600, growth: "n/a", cumulative: 82800, benchmark: null },
    { year: "FY2029", phase: "Operating", receipts: 27600, growth: "n/a", cumulative: 110400, benchmark: 32568 },
    { year: "FY2030", phase: "Operating", receipts: 27600, growth: "n/a", cumulative: 138000, benchmark: 34066 },
    { year: "FY2031", phase: "Operating", receipts: 28870, growth: "+4.6%", cumulative: 166870, benchmark: 35633 },
    { year: "FY2032", phase: "Operating", receipts: 30198, growth: "+4.6%", cumulative: 197068, benchmark: 37272 },
    { year: "FY2033", phase: "Operating", receipts: 31587, growth: "+4.6%", cumulative: 228655, benchmark: 38987 },
    { year: "FY2034", phase: "Operating", receipts: 33040, growth: "+4.6%", cumulative: 261695, benchmark: 40780 },
    { year: "FY2035", phase: "Operating", receipts: 34560, growth: "+4.6%", cumulative: 296255, benchmark: 42656 },
    { year: "FY2036", phase: "Operating", receipts: 36149, growth: "+4.6%", cumulative: 332404, benchmark: 44618 },
    { year: "FY2037", phase: "Operating", receipts: 37812, growth: "+4.6%", cumulative: 370216, benchmark: 46670 },
    { year: "FY2038", phase: "Operating", receipts: 39551, growth: "+4.6%", cumulative: 409767, benchmark: 48817 },
    { year: "FY2039", phase: "Operating", receipts: 41371, growth: "+4.6%", cumulative: 451138, benchmark: 51063 },
    { year: "FY2040", phase: "Operating", receipts: 43274, growth: "+4.6%", cumulative: 494412, benchmark: 53412 },
    { year: "FY2041", phase: "Operating", receipts: 45264, growth: "+4.6%", cumulative: 539676, benchmark: 55869 },
    { year: "FY2042", phase: "Operating", receipts: 47347, growth: "+4.6%", cumulative: 587023, benchmark: 58439 },
    { year: "FY2043", phase: "Operating", receipts: 49525, growth: "+4.6%", cumulative: 636548, benchmark: 61127 },
    { year: "FY2044", phase: "Operating", receipts: 51803, growth: "+4.6%", cumulative: 688351, benchmark: 63939 },
    { year: "FY2045", phase: "Operating", receipts: 54186, growth: "+4.6%", cumulative: 742537, benchmark: 66880 },
    { year: "FY2046", phase: "Operating", receipts: 56678, growth: "+4.6%", cumulative: 799215, benchmark: 69956 },
    { year: "FY2047", phase: "Operating", receipts: 59285, growth: "+4.6%", cumulative: 858500, benchmark: 73174 },
    { year: "FY2048", phase: "Operating", receipts: 62013, growth: "+4.6%", cumulative: 920513, benchmark: 76540 },
    { year: "FY2049", phase: "Operating", receipts: 64865, growth: "+4.6%", cumulative: 985378, benchmark: 80061 },
    { year: "FY2050", phase: "Operating", receipts: 67849, growth: "+4.6%", cumulative: 1053227, benchmark: 83744 },
    { year: "FY2051", phase: "Operating", receipts: 70970, growth: "+4.6%", cumulative: 1124197, benchmark: 87596 },
    { year: "FY2052", phase: "Operating", receipts: 74235, growth: "+4.6%", cumulative: 1198432, benchmark: 91625 },
    { year: "FY2053", phase: "Operating", receipts: 77649, growth: "+4.6%", cumulative: 1276081, benchmark: 95840 },
  ],

  // ---- Schedule totals ----
  scheduleTotals: {
    totalOperating: 1193281,      // sum of the 25 Operating rows (FY2029-FY2053)
    totalLifecycle: 1276081,      // sum of all 28 rows (FY2026-FY2053)
    totalBenchmark: 1471332,      // sum of the 25 benchmarked years (FY2029-FY2053)
    benchmarkYears: 25,           // FY2026-FY2028 carry no benchmark (construction)
    cumulativeGap: -195251,       // totalLifecycle - totalBenchmark (behind)
    benchmarkAnnual: 32568,       // 27,600 x 1.18 = Optimistic scenario, FY2029 base
    benchmarkGrowthPct: 4.6,      // compounds at the same 4.6% p.a. as receipts
    benchmarkLabel: "Optimistic (1.18x), growing 4.6% p.a.",
    leaseReceiptsRatio: 4.62,     // totalLifecycle / 276,000 fractional value
    breakevenYear: null,          // cumulative receipts never overtake the benchmark
    note: "Construction years FY2026-FY2028 carry no benchmark: the 10% guarantee of $27,600/yr is the maximum potential income during construction, so there is no comparable target to measure against. From FY2029 the benchmark is the Optimistic (1.18x) target rate of $32,568/yr, compounding at the same 4.6% p.a. as the receipts series. Because the guarantee floor ($27,600) starts below the Optimistic target ($32,568) and both then grow at the same rate, the gap stays constant in proportional terms and cumulative receipts never overtake the benchmark."
  },

  // ---- Lease vs comparable benchmark ----
  comparison: {
    upliftNote: "The 3/20 fractional leasehold (1/20 Standard Room + 2/20 Standard Room Premium = $276,000) is benchmarked against hotel-let comparable positions at an average of 8% net yield on advance consideration. Your 10% guaranteed return on $276,000 = $27,600/yr exceeds the benchmark by 2 percentage points during the construction and guarantee period, and the income-share (3/20 of room pool) plus 30% net profit after FY2030 provides upside above the guarantee floor."
  },

  // ---- Non-room revenue ----
  nonRoomRevenue: {
    perKey: 420,
    perOccupiedNight: 18.5,
    adsPerYear: 12,
    adsPerMonth: 1,
    perKeyMonthly: 35,
    notes: "Non-room revenue from advertising and per-key fees on the fractional interest"
  },

  // ---- Lease protections ----
  protections: {
    constructionRebate: {
      ratePct: 10.0,
      periodMonths: 36,
      annual: 27600,
      totalConstruction: 27600 * 3,
      note: "Contractual 10% of $276,000 = $27,600/yr guaranteed during construction (36 months) and first 2 years of operation (FY2029-FY2030). Paid quarterly. After year 2, the guarantee continues as the floor on the income-share stream."
    },
    minimumGuarantee: {
      minYear1: 27600,
      periodYears: 2,
      periodDescription: "FY2026-FY2030 (construction + first 2 operating years)",
      year1Guaranteed: 27600,
      year1Modelled: 27600,
      year1Shortfall: 0,
      coverage: 1.0,
      note: "For the construction period (FY2026-FY2028) and the first 2 years of operation (FY2029-FY2030), the lessor guarantees a minimum lease income of A$27,600 per year (10% of the $276,000 fractional value). Where modelled income falls below during the guarantee period, the lessor pays the shortfall."
    }
  },

  // ---- Verdict ----
  verdict: {
    headline: "CONFIRMED personal property — fractional ownership (3/20 fractional interest), NO PT PMA, NO Indonesia bonds, NO IDX shares",
    pull: "Higher ticket ($312k) for a ~55% bigger slice of the same pool — but structural cross-party risk remains: Elle's pool spans hotel + beach club + F&B (45% of room revenue), so returns depend on the whole operation, not just your rooms. The 10% guarantee is the floor; income-share is the upside.",
    againstCriteria: "This is the highest-value fractional leasehold position in Bali — $27,600 guaranteed/yr on $276,000 = 10% guaranteed, with upside via the income-share. Confirm with your tax adviser: the 10% guarantee terms and who stands behind it; the 3/20 fractional definition; payout frequency and currency; and exit/liquidity terms at year 50."
  },

};
const DATA = {
  lastUpdated: "2026-10-21",
  arrAnnual: ARR_ANNUAL,
  arrMonthly: ARR_MONTHLY,
  gate2026: GATE_2026,
  market2025: MARKET_2025,
  bpsGateNote: BPS_GATE_NOTE,
  tpkStar: TPK_STAR,
  tpkNonStar: TPK_NONSTAR,
  losMonthly2026: LOS_MONTHLY_2026,
  gdpQuarterly: GDP_QUARTERLY,
  gdpFullYear: GDP_FULL_YEAR,
  gdp2026Q1: GDP_2026_Q1,
  tourismShare2024: TOURISM_SHARE_2024,
  strMarket: STR_MARKET,
  march2026SnapshotNote: MARCH_2026_SNAPSHOT_NOTE,
  tpkApril2026ByRegion: TPK_APRIL_2026_BY_REGION,
  los2025Annual: LOS_2025_ANNUAL,
  hotelReport: HOTEL_REPORT,
  villaShortlist: VILLA_SHORTLIST,
  investmentTable: INVESTMENT_TABLE,
  queensberrySales: QUEENSBERRY_SALES,
  sussexSales: SUSSEX_SALES,
  bedrooms: BEDROOMS,
  areas: AREAS,
  priceGridUsd: PRICE_GRID_USD,
  adrGridUsd: ADR_GRID_USD,
  pricePerSqm: PRICE_PER_SQM,
  avgSizeSqm: AVG_SIZE_SQM,
  baliStrategy: BALI_STRATEGY,
  elle: ELLE,
  elle_lease: ELLE_LEASE
};
