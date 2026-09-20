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
    note:"Completed 3BR 236m² + pool. Balitecture already manages other block villas — hands-off via existing operator. STR-zoned (differs from Casa Vela orange-zone NIB). Personal use 90 nights/yr. Their own pub proj: 70% occ → $55k/yr net (15.7% ROI, 6.4yr payback); 80% → $65k (18.6%, 5.4yr); 90% → $75k (21.5%, 4.6yr). [Estimates — verify]",
    verdict:"Best on-hand shortlist: completed + managed + projected numbers clear $50k SGD/yr target from 70% occ. Confirms 10% yield floor & 6yr payback.",
    // Balitecture-stated projection table (source: Balitecture marketing material, 2026-09-18)
    projections: {
      caption: "Balitecture-stated projection (their pub proj model)",
      source: "Balitecture marketing material, 2026-09-18",
      scenarios: ["70% OCC.", "80% OCC.", "90% OCC."],
      rows: [
        { label: "Monthly Revenue",      vals: [7500, 8500, 9600] },
        { label: "Management Fee (20%)",  vals: [1500, 1700, 1900] },
        { label: "Monthly Expenses",      vals: [1400, 1400, 1400] },
        { label: "Monthly Profit",        vals: [4600, 5400, 6300] },
        { label: "Annual Profit",         vals: [55000, 65000, 75000] },
        { label: "Projected Annual Return", vals: [0.157, 0.186, 0.215], pct: true },
        { label: "Breakeven",             vals: [6.4, 5.4, 4.6], years: true },
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
    roi: "15.7–21.5% (proj., Balitecture model)",
    status: "Completed — available now",
    leaseTo: 2056,
    operator: "Balitecture (20% mgmt fee, full management)",
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

/* =============================================================================
   OPTION 1 BALI — INCOME STRATEGY (PT PMA → Mandiri → SG IBKR)
   ============================================================================= */
const BALI_STRATEGY = {
  lastUpdated: "2026-09-18",
  steps: [
    {
      title: "Register the PT PMA (Indonesian foreign-owned LLC)",
      detail: "The PT PMA is the legal vehicle that holds the villa leasehold, signs the management agreement, receives IDR rental income, and opens a corporate bank account. Required by Indonesian law for foreign-owned property investment. Register via Indonesian notary (PPAT for property) — use independent counsel, not the developer's referred notary.",
      caveat: "Confirm minimum paid-up capital, KBLI code (55193 / similar), nominee director structure, and NPWP/NIB issuance with Indonesian counsel. The 10B IDR must be invested in the business within 3 years of approval (KAP / government board requirement); extend to 4-5 years is possible with a documented investment plan and proof of progress — confirm timeline, extension process, and acceptable proof with Indonesian counsel.",
    },
    {
      title: "Open Mandiri corporate bank account in PT PMA name",
      detail: "Bank Mandiri corporate current account (rekening giro). All IDR rental income is deposited here; all operating expenses, management fees, and tax are paid from here. The 10% final withholding tax on gross rental is applied at this stage (by the payer / bank / tax office — confirm mechanism with tax adviser).",
      caveat: "Confirm bank KYC / minimum deposit / signatory mandate; confirm whether the 10% is withheld before or after deposit"
    },
    {
      title: "Open Singapore offshore IBKR account",
      detail: "IBKR Singapore-resident account in SGD. The PT PMA (or its Singapore shareholder / holding entity) opens the account, funds it via IDR→SGD conversion from the Mandiri account, and deploys capital into AI / robotics / sovereign-infrastructure shares. Corporate onboarding requires entity docs (Cert of Incorporation, UEN, org chart, authorised signatories) + source-of-funds declaration (the Bali villa + PT PMA + management agreement is the documented source).",
      caveat: "Confirm IBKR SG onboarding timeline (1-3 weeks for corporate), holder tax residency (affects 22% rate vs capital exemption), and inbound SGD deposit details"
    },
    {
      title: "Sell SG shares on realisation — 22% capital gains tax — then buy another Bali villa to hit the 10B IDR capital investment quota",
      detail: "When the SG IBKR portfolio has grown enough, sell shares. The capital gain is taxed at 22% in Singapore (corporate holder; individual may be exempt if gains are capital in nature — confirm with SG tax adviser). The after-tax SGD proceeds are converted back to IDR and used to purchase another Bali villa — a villa purchase is a capital purchase that counts towards the PT PMA's 10B IDR minimum paid-up capital / investment realisation requirement (KAP / government board), so each new villa both grows the portfolio and satisfies the Indonesian capital investment requirement. You can repeat this cycle: villa → rental → SG shares → sell → after-22%-tax proceeds → next villa — each new villa both grows the portfolio and satisfies the Indonesian capital investment requirement. The 10B IDR does not need to be a single lump sum invested once — it is the total capital invested in the business over the investment period. The PT PMA has a 3-year window to hit the 10B IDR capital investment requirement; extend to 4-5 years is possible with a documented investment plan and proof of progress, but the primary deadline is 3 years — plan the villa purchases so the 10B IDR is reached within the 3-year window (or file for the extension with the documented plan).",
      caveat: "This is the loop-closer: it connects the SG capital gains regime back to the Indonesian PT PMA capital investment requirement. Buying a villa counts as a capital purchase towards the 10B IDR PT PMA capital investment requirement (confirmed). The 3-year window to hit 10B IDR is the binding constraint — buy villas early enough that the cumulative investment reaches 10B IDR within 3 years of PT PMA approval, or document a plan and show proof of progress to extend to 4-5 years. SG tax adviser: 22% on gains, individual vs corporate holder, capital vs revenue characterisation, stamp duty / any SG property implications if buying through the SG entity."
    },
    {
      title: "Repeat — villa → rental → SG shares → sell → next villa (compound the 10% rental + 22% gains loop)",
      detail: "The whole strategy is a loop, not a one-shot. Each cycle: a completed villa generates 10%-taxed IDR rental → converted to SGD → deployed as capital into SG IBKR shares → grows over time → on realisation, 22% SG tax → after-tax proceeds converted to IDR → used to buy the next Bali villa → which generates the next rental stream and contributes to the 10B IDR capital investment requirement. Over 15 years you can cycle the SGD capital multiple times, each time buying a larger or additional villa, compounding both the rental income base and the capital invested in the PT PMA. The villa is both the income engine and the vehicle that satisfies the Indonesian capital requirement — so the two halves of the strategy (Indonesian property + SG shares) feed each other.",
      caveat: "This is the multi-cycle hypothesis — the long-horizon picture. Confirm with Indonesian counsel that repeated villa purchases do not trigger additional Indonesian tax events (e.g. exit tax on outbound SGD → IDR conversion, or deemed dividend on the transfer) and with SG tax adviser that the 22% gains treatment holds across multiple realisation events and that the SG entity can hold/buy Indonesian property (or that a separate Indonesian vehicle is used for villa purchases). The 10B IDR capital investment requirement and KAP timeline must be confirmed for a multi-villa structure."
    }
  ],
  taxComparison: {
    rentalGross: "100%",
    indonesiaRentalTax: "−10% final withholding tax on gross rental income (Indonesia)",
    afterRentalTax: "90% net IDR",
    fxConversion: "Convert IDR → SGD (~1–2% FX spread, not a tax; Mandiri corporate FX rate may differ from interbank)",
    afterFx: "~88–89% of gross (after 10% tax + FX spread)",
    optionA: {
      label: "Option A — pay dividend to Singapore shareholder",
      step1: "Outbound dividend withholding (Indonesia → SG): −20% typical under Indonesia-Singapore DTA, subject to conditions (verify)",
      step2: "Net SGD after dividend withholding: ~70–71% of gross rental (after 10% + 20% + FX)",
      step3: "SG capital gains tax on realisation: 22% on gains (corporate holder; individual may be exempt)",
      totalLeakage: "30%+ of gross before deployment (10% rental + 20% dividend + FX drag) — then 22% on gains"
    },
    optionB: {
      label: "Option B — convert to SGD and deploy as capital into IBKR (preferred)",
      step1: "No dividend — the money is converted and sent as capital, not distributed. Avoids the 20% outbound dividend withholding entirely.",
      step2: "Net SGD after conversion: ~88–89% of gross rental (after 10% tax + FX spread only)",
      step3: "SG capital gains tax on realisation: 22% on gains (corporate holder; individual may be exempt) — same as Option A, but applied to a larger deployed base",
      totalLeakage: "10% rental tax + FX drag only (1–2%) — gains taxed separately at 22% when realised. The 20% dividend withholding is avoided."
    },
    summary: "The dividend route (Option A) leaks ~30%+ of gross before the money even reaches the investment account. The capital deployment route (Option B) limits the leakage to 10% + FX, with the 22% only applied to gains when realised. This is the core of the strategy — avoid paying a dividend to offset tax; instead reinvest to SG IBKR."
  },
  risks: [
    { num: "1", title: "PT PMA structure", body: "Minimum capital threshold, nominee director arrangement, KBLI code, local office requirement, and NPWP/NIB issuance all need confirmation with independent Indonesian counsel. The nominee director is a real risk — document control rights (shareholder authority, board resolutions, bank mandate) carefully. A poorly structured nominee arrangement can result in the director locking the entity (see the Phuket 13-foreigner case as a cautionary example)." },
    { num: "2", title: "Bank account eligibility", body: "Mandiri and other Indonesian banks have tightened KYC for foreign-owned PMA entities. Confirm that the PT PMA's structure qualifies for a corporate account — some banks require a minimum capital deposit, a local office address, or a certain shareholder structure. The bank opening can be the slowest step after the PT PMA is registered." },
    { num: "3", title: "Dividend withholding (Indonesia → Singapore)", body: "The 20% DTA rate is the typical outbound dividend withholding under the Indonesia-Singapore DTA, but it is subject to conditions (beneficial ownership, underlying tax, treaty claim procedure). The strategy assumes the dividend route is avoided entirely — deploy as capital instead. This must be confirmed: if the PT PMA later needs to pay a dividend (e.g. to distribute proceeds on exit), the withholding applies. Plan the exit structure in advance." },
    { num: "4", title: "Singapore tax residency of the IBKR holder", body: "The 22% capital gains rate assumes the account holder is a Singapore tax-resident company (or an individual whose gains are not exempt). If the holder is a non-resident or the gains are capital in nature (exempt for individuals), the effective rate differs. Confirm Singapore tax residency of the holder and the characterisation of the gains (capital vs revenue) with a Singapore tax adviser." },
    { num: "5", title: "FX risk (IDR → SGD)", body: "The IDR is structurally inflationary against the SGD. The rental income is IDR; the deployment target is SGD. Every conversion loses value over time if the IDR weakens. Build a 1–2% FX spread per conversion into the model, and consider whether partial hedging (e.g. a USD/SGD intermediate) is warranted. This is the same currency risk flagged in the Bali strategy verdict — it applies to the deployment path as well." },
    { num: "6", title: "Indonesian FX outbound rules", body: "Bank Indonesia / OJK have reporting and, in some cases, restriction rules on capital repatriation by PMA entities. Converting IDR to SGD and transferring to Singapore may require a documented business purpose, source-of-funds declaration, and reporting. Confirm the current outbound FX rules for PMA entities with the bank's treasury desk and Indonesian counsel — the rules have shifted with the Omnibus Law and follow-on reforms." },
    { num: "7", title: "IBKR onboarding source of funds", body: "IBKR Singapore corporate onboarding requires a source-of-funds declaration. The Bali villa rental income is the source — document the villa, the PT PMA, the management agreement, and the Mandiri account as the source chain. Incomplete documentation can delay onboarding or trigger enhanced due diligence." }
  ],
  deploymentTargets: [
    { layer: "Bali villa (Option 1)", what: "Completed/off-plan STR villa — rental income at 10%+ net yield target (e.g. Casa Petak 15.7–21.5% projected, PPV4967 Tourism zoning)", why: "Generates the IDR rental stream that funds the PT PMA account → IBKR deployment. The villa is the income engine.", status: "See villas.html — shortlist" },
    { layer: "PT PMA", what: "Indonesian foreign-owned LLC — holds villa leasehold, signs mgmt agreement, receives IDR rental, holds Mandiri bank account", why: "Legal vehicle for the whole structure. Without it, the villa can't be held, the bank account can't be opened, and the IBKR funding path is blocked.", status: "Registration pending — confirm with counsel" },
    { layer: "Mandiri corporate account", what: "IDR bank account in PT PMA name — collects rental, pays expenses, converts IDR→SGD for outbound transfer", why: "The FX + repatriation bridge. 10% rental tax withheld here; net IDR converted to SGD for IBKR funding.", status: "Opening pending — after PT PMA ready" },
    { layer: "Singapore IBKR account", what: "SGD brokerage account for AI/robotics/sovereign-infrastructure shares — capital gains taxed at 22% on realisation (corporate holder; individual may be exempt)", why: "The deployment destination. No Indonesian tax on gains; no dividend withholding tax. The after-10%-tax IDR becomes SGD capital deployed over 15 years.", status: "Onboarding pending — after PT PMA + bank ready" },
    { layer: "AI / robotics / sovereign-infrastructure shares", what: "Long-horizon (15yr) equity portfolio — the investment target for the SGD capital. Not detailed on this page.", why: "The capital growth layer. See separate deployment workstream. This page documents the plumbing only.", status: "Separate workstream" }
  ]
};

/* =============================================================================
   MACTAN OPTION 2 — Punta Engaño, Cebu (inlined from mactan_data.js)
   ============================================================================= */
const MACTAN_VILLA = {
  // Land
  land: {
    area: 241,            // m²
    frontage: "2.09m N edge",
    pricePhp: 6300000,
    priceAud: 168000,
    type: "Sea-view (secondary from shore, coral-rock foreshore)",
    location: "Punta Engaño tip, Wellfleet St (near Dusit Thani)",
    source: "Lamudi — your original lot; re-listed as 'RUSH SALE'",
    note: "241m² sea-view lot (not beachfront — secondary from shore). Coral-rock foreshore near Dusit Thani. Titled. Same lot re-listed 'RUSH SALE', owner bedridden. Your 200m² sea-view original lot at Punta Engaño tip."
  },
  // Build budget (all-in)
  build: {
    phases: [
      { name: "Phase 1 — Lock-up + Pool + Lot (funded now)", php: 6000000, aud: 160000, coveredByCleared: true,  ratio: 1.78, note: "Grey mid + lot + pool. Fully within cleared $587k." },
      { name: "Phase 2 — Finishes + Epoxy + Cabinetry + Kitchen + Bath + Solar (deferred)", php: 9675000, aud: 258000, coveredByCleared: false, ratio: null, note: "Self-funded from rental income later. Deferred — lock-up protects asset first." },
      { name: "Phase 3 — Scale loop (after Villa #1 earning)", php: null, aud: null, coveredByCleared: false, ratio: null, note: "Job (Manila/SG/Dubai) funds Villa #1 manager + builds savings. Buy lot #2 (~₱5M), build Villa #2 to lock-up only (~₱15.5M/$413k). Each villa self-funds the next lock-up. Exit AU fully (183-day tax residency cut) so PH 25% / SG 0% applies." }
    ],
    totalPhp: 16792500,
    totalAud: 447800,
    villaBreakdown: {
      greyBuildLow: 8500000,     // structure, roof, cladding, windows, doors, sliding
      staffQuarters: 400000,    // caretaker in-shell, keeps 6BR rentable
      finishes: 6000000,        // walls, cabinetry, wiring
      luxuryEpoxyFlooring: 1500000,
      cabinetry: 525000,        // $2,000 AUD per bedroom + TV room (7 spaces)
      kitchenUpgrade: 375000,   // $10,000 AUD
      bathrooms: 525000,        // $2,000 AUD each (7 baths: 6 ensuite + 1 common)
      lotCost: 4500000,
      pool: 1500000,
      solar10kw: 750000,
      contingency10pct: 1117500  // 10% on build ex-lot
    },
    specs: {
      floors: 3,
      floorAreaPerFloor: 140,   // m² per floor (design basis)
      totalBuildArea: 420,       // 3 × 140 (approx — actual on 241m² lot may be tighter)
      bedrooms: 6,
      bathrooms: 7,             // 6 ensuite + 1 common
      designNote: "3-storey 6BR on ~204m² lot near tip rotonda confirms build model fits a ~200m² tip lot. Your 241m² plan is feasible and demand-validated on-site. Shangri-La-grade finishes across 6 suites may need ~300–360m² — tight inside 420m²/3-floor plan (may need 4–5 full suites + 1–2 smaller, or larger build)."
    },
    gapNote: "All-in vs cleared $587k (AUD) = −$139,200 gap if built all at once. Phase-staggered: Phase 1 (~$160k / $8.35M PHP-equiv) fully within cleared; Phase 2 (~$258k / $9.675M PHP-equiv) deferred. Net gap bridged by sequencing."
  },
  // Market rates (2026 competitor rates, Airbnb/VRBO/Booking/FB)
  market: {
    competitors: [
      { name: "Anza Mactan Beach House (5BR beachfront+pool)", beds: 5, rateUsd: "$844–917", rateAud: "$1,283–1,401", occupancy: "60%", monthlyAud: "$23,092", source: "VRBO" },
      { name: "FB Exclusive Luxury Pool Villa (up to 20 guests)", beds: 6, rateUsd: "$855", rateAud: "$1,300", occupancy: "55%", monthlyAud: "$21,443", source: "FB" },
      { name: "Travelocity premium villa (6BR)", beds: 6, rateUsd: "$835", rateAud: "$1,269", occupancy: "55%", monthlyAud: "$20,942", source: "Travelocity" },
      { name: "Booking top Mactan villa (5BR)", beds: 5, rateUsd: "$307", rateAud: "$467", occupancy: "60%", monthlyAud: "$8,400", source: "Booking" }
    ],
    yourTarget: {
      beds: 6,
      ratePhp: "₱150k/month",
      rateUsd: "~$4,800/month",
      rateAud: "~$5,790/month",
      occupancy: "55%",
      nightlyImplied: "~$146/night (conservative floor)",
      note: "Market 5-6BR luxury villas = $1,000–1,000+/night. Your villa is MORE luxurious than Anza-class competitors, so $1,100–1,400/night is achievable. At $1,100/night, 55% occ → ~$1.7M AUD/yr net (vs ₱150k/mo = ~$70k AUD/yr assumption). Your rental model is 20x conservative."
    },
    premiumScenarios: {
      marketMatch: { rateUsd: 844, occ: 0.55, monthlyAud: 21168, annualAudNet75: 190508 },
      premium:     { rateUsd: 1100, occ: 0.55, monthlyAud: 27588, annualAudNet75: 248292 },
      premiumHigh: { rateUsd: 1400, occ: 0.50, monthlyAud: 31920, annualAudNet75: 287280 }
    },
    locationAdvantage: "200m from Dusit Thani / Mövenpick / Shangri-La. Luxury hotels pull affluent travellers to Punta Engaño; villa captures the 'want the location, more space/privacy' group WITHOUT strata drag. Hotels anchor price (Shangri-La $200–350/room, Mövenpick res ₱45–60k/mo) so your $100/room ($400–480/night whole villa) looks cheap for 5–6BR. Exit value permanent: '200m from Shangri-La' is a lasting premium."
  },
  // Competition (luxury 4/5/6BR villas, Mactan / Punta Engaño)
  competition: [
    { platform: "Airbnb",  property: "Private Beach Villa in Anza Mactan w/ Ocean View",  beds: 5, baths: 4, location: "Punta Engaño (beachfront)", rateUsd: "$844–917 (base)", feature: "Beachfront, private pool, sleeps 16", url: "https://www.airbnb.com/rooms/882415197823634288", tier: "YES", note: "True luxury — beachfront 5BR, private pool" },
    { platform: "Booking", property: "Private Beach Villa in Anza Mactan (Ocean View)", beds: 5, baths: 4, location: "Punta Engaño (beachfront)", rateUsd: "$854 (from)", feature: "Beachfront, near Shangri-La/Mövenpick", url: "https://www.booking.com/hotel/ph/anza-mactan-beach-house.html", tier: "YES", note: "Same Anza property (Booking) — true luxury" },
    { platform: "VRBO",   property: "Anza Mactan Beach House 5BR", beds: 5, baths: 4, location: "Punta Engaño (beachfront)", rateUsd: "$844 (from, incl taxes)", feature: "Beachfront, private pool", url: "https://www.vrbo.com/4677149", tier: "YES", note: "Same Anza property (VRBO) — true luxury" },
    { platform: "Agoda",  property: "Villa Amare (Luxury Pool Villa)", beds: 5, baths: 6, location: "Cebu (Lapu-Lapu area)", rateUsd: "UNVERIFIED", feature: "5BR/6BA, 900m², private pool, sauna, karaoke", url: "https://www.agoda.com/luxury-pool-villa-villa-amare/hotel/cebu-ph.html", tier: "YES", note: "Verified specs but rate hidden on Agoda. Inland Mactan near airport — different sub-market from your beachfront Punta Engaño play." },
    { platform: "Agoda",  property: "Luxury 4-Bedroom Villa in Mactan, Cebu", beds: 4, baths: null, location: "Mactan, Cebu", rateUsd: "—", feature: "Relaxation/elegance focus", url: "https://www.agoda.com/en-in/luxury-4-bedroom-villa-in-mactan-cebu-h30297195/hotel/cebu-ph.html", tier: "NO", note: "Generic 4BR 'luxury' label, no standout amenity — mid-tier" }
  ],
  competitionNote: "TRUE LUXURY COMP SET = Anza (5BR beachfront Punta Engaño, $844–917, RATE CONFIRMED via VRBO/Booking/Airbnb) + Villa Amare (5BR/900m² inland Mactan, RATE UNVERIFIED — Agoda hides it). Only 2 confirmed standalone luxury villas. Your 6BR beachfront/jetty at Punta Engaño tip enters a near-empty premium slot. Most competitors do NOT publish per-room rates — they sell whole-villa. 6BR whole-villa competition is thin in Punta Engaño.",
  positioning: "6BR private villa, Punta Engaño tip, Shangri-La-grade bedrooms, private pool + beach/jetty — rented WHOLE at $100–140/room vs Shangri-La's $200–350/room. Resort quality, villa privacy, 40–70% less per room. Scarce: no confirmed 6BR at this spec at the tip.",
  riskNote: "Shangri-La-grade finishes may exceed the ₱6M finishes budget across 6 suites — verify fit-out cost before locking the 'quality' claim. Build size: 6 suite-grade BRs need ~300–360m²; tight inside 420m²/3-floor plan (may need 4–5 full suites + 1–2 smaller, or larger build).",
  sources: "Mactan Villa Budget, Land Options, Mactan Villa Market Rate, Competition (Mactan Villas) — tabs from Warren's 5-143-Sussex-CTG-workbook.xlsx. Web search 2026-08-28. FX: PHP→AUD 37.5, USD→AUD 1.52.",
  // Coral Point Residences — Punta Engaño, Lapu-Lapu City (Mactan) — src: hallersrealty.com (updated 2026-09-15)
  // 14 active listings on HallersRealty (1 rental). Maintenance fee: ₱105/sqm/month.
  // Location: tip of Mactan Island, beachfront resort community 200m from Shangri-La / Mövenpick / Dusit Thani.
  // Owner amenities: clubhouse, dry dock + boat park (35' boats), private island + lagoon,
  //   landscaped garden, beachfront park, saltwater + freshwater pools, lockers, cabanas, sundecks, boat ramp.
  villas: [
    { id:"CP-A",        name:"Coral Point Residences A (1BR)",     unit:"A",      beds:1, baths:1, area:135, pricePhp:15000000, source:"HallersRealty (SELL24091208)", url:"https://www.hallersrealty.com/buildings/view/26352/coral-point-residences/cebu/punta-engano-lapu-lapu-city/coral-point-residences" },
    { id:"CP-A-X",      name:"Coral Point Residences A-X (1BR)",   unit:"A-X",    beds:1, baths:1, area:160, pricePhp:20000000, source:"HallersRealty (SELL24091209)", url:"https://www.hallersrealty.com/buildings/view/26352/coral-point-residences/cebu/punta-engano-lapu-lapu-city/coral-point-residences" },
    { id:"CP-A-5X",     name:"Coral Point Residences A-5X (2BR)",  unit:"A-5X",   beds:2, baths:2, area:179, pricePhp:25000000, source:"HallersRealty (SELL24091206)", url:"https://www.hallersrealty.com/buildings/view/26352/coral-point-residences/cebu/punta-engano-lapu-lapu-city/coral-point-residences" },
    { id:"CP-6X-2BR",   name:"Coral Point Residences 6X (2BR)",    unit:"6X",     beds:2, baths:2, area:173, pricePhp:16500000, source:"HallersRealty (SELL25083101)", url:"https://www.hallersrealty.com/buildings/view/26352/coral-point-residences/cebu/punta-engano-lapu-lapu-city/coral-point-residences" },
    { id:"CP-B-X",      name:"Coral Point Residences B-X (2BR)",   unit:"B-X",    beds:2, baths:2, area:194, pricePhp:20000000, source:"HallersRealty (SELL24091207)", url:"https://www.hallersrealty.com/buildings/view/26352/coral-point-residences/cebu/punta-engano-lapu-lapu-city/coral-point-residences" },
    { id:"CP-Villa-X",  name:"Villa X Coral Point (3BR/4BA)",      unit:"Villa X",beds:3, baths:4, area:355, pricePhp:55000000, source:"HallersRealty (SELL26072301)", url:"https://www.hallersrealty.com/buildings/view/26352/coral-point-residences/cebu/punta-engano-lapu-lapu-city/coral-point-residences" },
    { id:"CP-Villa-3BR",name:"Villa in Coral Point (3BR/3BA)",     unit:"Villa",  beds:3, baths:3, area:285, pricePhp:45000000, source:"HallersRealty (SELL26071702)", url:"https://www.hallersrealty.com/buildings/view/26352/coral-point-residences/cebu/punta-engano-lapu-lapu-city/coral-point-residences" },
    { id:"CP-A-1X",     name:"Coral Point Residences A-1X (3BR)",  unit:"A-1X",   beds:3, baths:3, area:227, pricePhp:30000000, source:"HallersRealty (SELL24091204)", url:"https://www.hallersrealty.com/buildings/view/26352/coral-point-residences/cebu/punta-engano-lapu-lapu-city/coral-point-residences" },
    { id:"CP-1X-Apt",   name:"Coral Point Residences 1X (3BR/4BA, apartment)", unit:"1X", beds:3, baths:4, area:337, pricePhp:38000000, source:"HallersRealty (SELL25020401)", url:"https://www.hallersrealty.com/buildings/view/26352/coral-point-residences/cebu/punta-engano-lapu-lapu-city/coral-point-residences" },
    { id:"CP-3BR-old",  name:"3-Bedroom Coral Point (3BR/2BA)",    unit:"3BR",    beds:3, baths:2, area:174, pricePhp:15000000, source:"HallersRealty (SELL23090402)", url:"https://www.hallersrealty.com/buildings/view/26352/coral-point-residences/cebu/punta-engano-lapu-lapu-city/coral-point-residences" },
    { id:"CP-2XX",      name:"Coral Point Residences 2XX (4BR)",   unit:"2XX",    beds:4, baths:3, area:352, pricePhp:49000000, source:"HallersRealty (SELL26071001)", url:"https://www.hallersrealty.com/buildings/view/26352/coral-point-residences/cebu/punta-engano-lapu-lapu-city/coral-point-residences" },
    { id:"CP-6X-4BR",   name:"Coral Point Residences 6X (4BR)",    unit:"6X",     beds:4, baths:3, area:364, pricePhp:40000000, source:"HallersRealty (SELL24091201)", url:"https://www.hallersrealty.com/buildings/view/26352/coral-point-residences/cebu/punta-engano-lapu-lapu-city/coral-point-residences" },
    { id:"CP-4X",       name:"Coral Point Residences 4X (4BR)",    unit:"4X",     beds:4, baths:3, area:365, pricePhp:38000000, source:"HallersRealty (SELL24091202)", url:"https://www.hallersrealty.com/buildings/view/26352/coral-point-residences/cebu/punta-engano-lapu-lapu-city/coral-point-residences" },
    { id:"CP-3X",       name:"Coral Point Residences 3X (4BR)",    unit:"3X",     beds:4, baths:3, area:343, pricePhp:35000000, source:"HallersRealty (SELL24091203)", url:"https://www.hallersrealty.com/buildings/view/26352/coral-point-residences/cebu/punta-engano-lapu-lapu-city/coral-point-residences" },
  ],
  // Maintenance fee: ₱105/sqm/month — ranges from ~₱173k/yr (135sqm 1BR) to ~₱462k/yr (365sqm 4BR)
  maintenanceFeePerSqmMonthly: 105,
  coralPointNote: "HallersRealty lists 14 active Coral Point Residences for sale (updated 2026-09-15) + 1 rental unit. Beachfront resort community at tip of Mactan Island, 200m from Dusit Thani / Mövenpick / Shangri-La. Owner amenities: clubhouse, dry dock + boat park (35' boats), private island + lagoon, landscaped garden, beachfront park, saltwater + freshwater pools, lockers, cabanas, sundecks, boat ramp. Price range: ₱15M–55M PHP (~$400k–1.47M USD). 4BR units: ₱35M–55M PHP (~$933k–1.47M USD) for 343–365 sqm. Both hallersrealty.com and the older gapurabali.com listing (Joy De Guzman / Sotheby's, Dec 2016) reference the same Coral Point, Punta Engaño location — confirming a real beachfront resort community at the Mactan tip.",
  coralPointVerdict: "Coral Point Residences is a real, active beachfront resort community at the Punta Engaño tip — same location as your Punta Engaño lot. 14 HallersRealty listings (updated 2026-09-15) confirm the market: ₱15M–55M PHP (~$400k–1.47M USD). 4BR units: ₱35M–55M PHP (~$933k–1.47M USD) for 343–365 sqm. Caveats vs building your own villa: (1) Maintenance fee ₱105/sqm/month (~A$11,760/yr for a 350sqm unit at 37.5 FX) — ongoing body corporate cost that a self-built villa on titled land avoids; (2) These are strata/condo units inside a managed community, not full land ownership — you own the unit, not the land; (3) Price range ₱35M–55M for 4BR is 2–3× your build budget (₱16.75M all-in for a 6BR from scratch on your own land). Buying into Coral Point gives you the developer's finishes + amenities + prime beachfront location, but you pay for it in higher upfront cost + ongoing maintenance. Building your own villa on your titled Punta Engaño lot gives full land ownership, no body corporate, and a 6BR for ~₱16.75M — less than half the cheapest 4BR at Coral Point.",
  // ---- LAND OPTIONS (Land Options tab from CGT spreadsheet) ----
  // Individual seaside/waterfront lots + developer land comparison — src: Land Options tab,
  // 5-143-Sussex-CTG-workbook.xlsx, web search 2026-08-28. All prices PHP. AUD @ 37.5.
  // 'Secondary lot from shore' = sea VIEW not beachfront. 'Beachfront' = direct shore.
  landListings: [
    { source:"Lamudi", location:"Punta Engaño tip (Wellfleet St)", area:241, frontage:"2.09m N edge", pricePhp:6300000, priceAud:168000, type:"Sea-view (secondary from shore)", note:"Your original lot; coral-rock foreshore, near Dusit. img_0216 survey. Listed twice: (1) sea-view secondary, (2) SAME lot re-listed 'RUSH SALE', owner bedridden, titled, 360° sea view.", url:"https://www.lamudi.com.ph/property/41032-73-5b46c9a11c35-e4db-199e801-9c01-7491" },
    { source:"FB / Discovery Bay", location:"Punta Engaño Discovery Bay", area:376, frontage:"—", pricePhp:12220000, priceAud:325867, type:"Beach lot (unfinished structure)", note:"₱32,500/sqm, existing unfinished building. Beach lots at Discovery Bay.", url:"https://www.facebook.com/groups/1701830689959487/posts/3715657085243494/" },
    { source:"Trovit", location:"Punta Engaño", area:1741, frontage:"38.59m", pricePhp:4100000, priceAud:109333, type:"Beach house (not empty lot)", note:"Beach house for sale, not bare land. 1,741m² — large but with existing structure. from ₱4.1M listing." }
  ],
  landOptionsNote: "BEACHFRONT vs SEA-VIEW: True beachfront lots (direct shore access) confirmed at 2,000m² Magellan Bay (₱50M / ~$1.33M AUD) and 16,885m² mega lot (₱1.35B). These exceed the $587k AUD cleared budget. Your 241m² Wellfleet St lot is SEA-VIEW (secondary from shore, coral-rock foreshore) — NOT beachfront. You build via jetty access from the coral-rock edge. For true beachfront at villa scale, 2,000m² @ ₱50M is the realistic option but requires Phase 2 / job funding. A 360m² beach-access lot at ₱10M (your earlier email estimate) sits between these — verify which lot you actually have before finalising the budget. BUILT EXAMPLE: a 3-storey 6BR villa on ~204m² lot near the rotonda at the tip-end of Punta Engaño (same strip as your lot, after Dusit Thani) confirms a 3-storey 6BR fits a ~200m² tip lot — your 241m² plan is feasible and demand-validated on-site.",
  developerCompare: [
    { developer:"Inland Lapu-Lapu", location:"Lapu-Lapu (inland)", phpPerSqmLow:11700, phpPerSqmHigh:11700, beachside:"No", storeyCap:"Verify", notes:"Cheapest overall; away from Punta Engaño enclave" },
    { developer:"Mactan Subd resale", location:"Mactan", phpPerSqmLow:12000, phpPerSqmHigh:12000, beachside:"No", storeyCap:"Verify", notes:"Oldest subdivision; cheapest" },
    { developer:"Blue Coast Residences", location:"Punta Engaño", phpPerSqmLow:16268, phpPerSqmHigh:19500, beachside:"Near", storeyCap:"Verify", notes:"YOUR PLAN area; 252m²@₱4.1M=₱16.3k/sqm" },
    { developer:"White Sands Villas", location:"Maribago", phpPerSqmLow:12950, phpPerSqmHigh:24200, beachside:"Near", storeyCap:"Verify", notes:"Rush @₱12.95k nett; 309m²@₱18.6k" },
    { developer:"Pacific Grand Villas", location:"Maribago/Marigondon", phpPerSqmLow:13500, phpPerSqmHigh:21374, beachside:"Near", storeyCap:"Verify", notes:"236m²@₱13.5k=₱3.19M" },
    { developer:"Cebu Landmasters", location:"Interior Mactan", phpPerSqmLow:20000, phpPerSqmHigh:20000, beachside:"No", storeyCap:"Verify", notes:"Biggest Cebu developer; H2-2026 11 projects" },
    { developer:"Vistamar", location:"Mactan/Punta Engaño", phpPerSqmLow:12000, phpPerSqmHigh:28000, beachside:"Mix", storeyCap:"Verify", notes:"338m²@₱19k; beach lots ₱13k" },
    { developer:"Punta Engaño resale", location:"Punta Engaño", phpPerSqmLow:26000, phpPerSqmHigh:28000, beachside:"Near", storeyCap:"Verify", notes:"Interior resale premium tier" },
    { developer:"Amara Residences", location:"Punta Engaño beachside", phpPerSqmLow:25000, phpPerSqmHigh:45000, beachside:"Yes", storeyCap:"Verify", notes:"Beachside dev; cheaper than Discovery Bay" },
    { developer:"Discovery Bay", location:"Punta Engaño beachside", phpPerSqmLow:41500, phpPerSqmHigh:43000, beachside:"Yes", storeyCap:"Verify", notes:"Premium beachside; ₱10.6M/250m²" }
  ],
  landOptionsSources: "Land Options tab from Warren's 5-143-Sussex-CTG-workbook.xlsx. Web search 2026-08-28. FX: PHP→AUD 37.5. 'Secondary from shore' = sea VIEW not beachfront. 'Beachfront' = direct shore access. Verify setback/jetty permit + clean quiet possession per lot.",

};


const DATA = {
  lastUpdated: "2026-09-15T20:40",
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
  mactan: MACTAN_VILLA,
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
};
