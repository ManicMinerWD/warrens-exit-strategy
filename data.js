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
   PHASE 1 COMPETITION TRACKER — properties potential buyers are looking at
   ============================================================================= */
const COMPETITION_TRACKER = [
  {
    id: "rea-stkildaroad-730-539",
    title: "730/539 St Kilda Road — REA listing #151850872",
    url: "https://www.realestate.com.au/property-apartment-vic-melbourne-151850872",
    source: "realestate.com.au",
    type: "Apartment",
    location: "St Kilda Road VIC",
    beds: 1,
    price: "$360,000 - $395,000",
    lastSeen: "2026-09-20",
    buyerContext: "Reported by potential buyer — tracking what else they're looking at alongside G05/108 + 302/108",
    notes: "1 bed, 1 car. Asking $360,000 - $395,000. St Kilda Road — central Melbourne CBD fringe; comparable to G05/108 + 302/108 (Carlton) as another inner-Melbourne apartment exit option.",
    status: "logged",
    action: "1 bed, 1 car, $360k-$395k asking. Compare to G05/108 ($420k est.) and 302/108 ($420k est.) — this is priced below our Carlton apartments; check why (floor level, building quality, condition, BSV)."
  },
  {
    id: "rea-spencerstreet-1711-200",
    title: "1711/200 Spencer Street — REA listing #151710008",
    url: "https://www.realestate.com.au/property-apartment-vic-melbourne-151710008",
    source: "realestate.com.au",
    type: "Apartment",
    location: "Spencer Street VIC",
    beds: 1,
    price: "$345,000",
    lastSeen: "2026-09-22",
    buyerContext: "Reported by potential buyer — tracking alongside other Melbourne apartments they're considering",
    notes: "1 bed. Asking $345,000. Spencer Street — inner Melbourne, near Southern Cross Station; another inner-Melbourne apartment exit option alongside 730/539 St Kilda Road and our Carlton apartments.",
    status: "logged",
    action: "1 bed, $345,000 asking. Compare to 730/539 St Kilda Road ($360k-$395k) and G05/108 ($420k est.) and 302/108 ($420k est.) — lowest asking price in the tracker so far."
  },
  {
    id: "rea-carlton-apartment-150593592",
    title: "112A/640 Swanston Street — REA listing #150593592",
    url: "https://www.realestate.com.au/property-apartment-vic-carlton-150593592",
    source: "realestate.com.au",
    type: "Apartment",
    location: "Swanston Street VIC",
    beds: 1,
    price: "$399,000 - $430,000",
    lastSeen: "2026-09-21",
    buyerContext: "Reported by potential buyer — Carlton is the same suburb as G05/108 and 302/108, so this is a direct same-suburb comparison",
    notes: "1 bed, 1 carpark. Asking $399,000 - $430,000. Swanston Street — inner Melbourne, same suburb (Carlton 3053) as G05/108 and 302/108; direct same-suburb comparison.",
    status: "logged",
    action: "1 bed, 1 carpark, $399k-$430k asking. Compare to G05/108 ($420k est.) and 302/108 ($420k est.) — same suburb (Carlton), similar price range; check floor level, building quality, condition, BSV."
  },
  {
    id: "rea-carlton-apartment-151054624",
    title: "101/94 Canning Street — REA listing #151054624",
    url: "https://www.realestate.com.au/property-apartment-vic-carlton-151054624",
    source: "realestate.com.au",
    type: "Apartment",
    location: "Canning Street VIC",
    beds: 1,
    price: "$380,000 - $410,000",
    lastSeen: "2026-09-22",
    buyerContext: "Reported by potential buyer — Carlton is the same suburb as G05/108 and 302/108, so this is another direct same-suburb comparison",
    notes: "1 bed, 1 carpark. Asking $380,000 - $410,000. Canning Street — inner Melbourne, same suburb (Carlton 3053) as G05/108 and 302/108; direct same-suburb comparison.",
    status: "logged",
    action: "1 bed, 1 carpark, $380k-$410k asking. Compare to G05/108 ($420k est.) and 302/108 ($420k est.) — same suburb (Carlton), similar price range; check floor level, building quality, condition, BSV."
  }
];

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
    when: "8% guaranteed capital repayment during construction + revenue share",
    yield: null,
    operator: "Elle Resort & Beach Club (fully managed — hands-off)",
    image: "assets/elle-resort-beach-club/elle-resort-beach-club.png",
    note: "Entry from ~$65,000 USD. Structure: (1) 8% guaranteed capital repayment during construction; (2) share in hotel AND beach club revenue — 45% net revenue pool spanning rooms, food & beverage, and beach club operations; (3) projected net returns up to 15% p.a.; (4) 50-year investment period. Fully managed — no day-to-day hassle. Perks: annual free stays + VIP access. [Estimates — verify independently: exact entry price, revenue pool split, payout frequency, guarantee terms, and exit/liquidity]",
    verdict: "Revenue-share product at ~$65k entry (much lower than FINNS Standard ~$195k or Lagoon ~$312k). Key differentiator vs FINNS: Elle's pool spans hotel + beach club + F&B revenue (45% net pool), whereas FINNS is hotel-only — Elle's broader revenue base (rooms, food & beverage, beach club operations) gives it a structural edge over a hotel-only pool if the beach club performs. 8% guaranteed capital repayment during construction + up to 15% p.a. projected net returns. Looks competitive on entry price and projected yield vs FINNS on paper — but same structural caveats: pool product (not your own villa), revenue depends on the whole operation's performance, operator/counterparty risk, and the 15% p.a. is projected/quoted — needs independent validation. Annual free stays + VIP access are a lifestyle perk, not an income factor. Treat as a strong watch item — confirm the 8% guarantee, the 45% pool structure, payout mechanics, and exit/liquidity terms before ranking against single-villa options (Casa Petak, PPV4967).",
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
    name: "Elle Resort & Beach Club — Hotel / Beach Club Revenue Share",
    location: "Bali (resort location — confirm)",
    beds: null,
    priceUsd: 65000,
    roi: "Projected up to 15% p.a. net (quoted — verify independently)",
    status: "Off plan — under construction; 8% guaranteed capital repayment during construction",
    leaseTo: null,
    operator: "Elle Resort & Beach Club (fully managed — hands-off)",
    verdict: "Hotel/beach club revenue-share product at ~$65k entry (much lower than FINNS Standard ~$195k / Lagoon ~$312k). 8% guaranteed capital repayment during construction + up to 15% p.a. projected from a 45% net revenue pool (rooms, F&B, beach club). Same structural caveats as FINNS: pool product, operator/counterparty risk, projected yield needs validation. Annual free stays + VIP access are lifestyle perks. Treat as a strong watch item — confirm guarantee, pool structure, payout, exit/liquidity before ranking against single-villa options.",
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

/* =============================================================================
   OPTION 1 BALI — INCOME STRATEGY (PT PMA → Mandiri → IDX domestic shares)
   ============================================================================= */
const BALI_STRATEGY = {
  lastUpdated: "2026-09-25",
  steps: [
    {
      title: "Register the PT PMA (Indonesian foreign-owned LLC)",
      detail: "The PT PMA is the legal vehicle that holds the villa leasehold, signs the management agreement, receives IDR rental income, and opens a corporate bank account. Required by Indonesian law for foreign-owned property investment. Register via Indonesian notary (PPAT for property) — use independent counsel, not the developer's referred notary.",
      caveat: "Confirm minimum paid-up capital, KBLI code (55193 / similar), nominee director structure, and NPWP/NIB issuance with Indonesian counsel. The 10B IDR must be invested in the business within 3 years of approval (KAP / government board requirement); extend to 4-5 years is possible with a documented investment plan and proof of progress — confirm timeline, extension process, and acceptable proof with Indonesian counsel."
    },
    {
      title: "Open Mandiri corporate bank account in PT PMA name",
      detail: "Bank Mandiri corporate current account (rekening giro). All IDR rental income is deposited here; all operating expenses, management fees, and tax are paid from here. The 10% final withholding tax on gross rental is applied at this stage (by the payer / bank / tax office — confirm mechanism with tax adviser).",
      caveat: "Confirm bank KYC / minimum deposit / signatory mandate; confirm whether the 10% is withheld before or after deposit"
    },
    {
      title: "Open an Indonesia Stock Exchange (IDX / BEI) participant stock account in the PT PMA's name — for Indonesian-listed DOMESTIC SHARES (e.g. Mandiri shares / Mandiri stock)",
      detail: "The PT PMA opens a stock account (rekening saham / participant account) at the Indonesia Stock Exchange through the Mandiri corporate-banking relationship — in the PT PMA's name, in IDR, funded directly from the Mandiri corporate account. The PT PMA then deploys the after-tax IDR into Indonesian-listed DOMESTIC SHARES on the IDX — for example Bank Mandiri (Mandiri shares / Mandiri stock), or another Indonesian-listed financial / infrastructure stock that fits the long-horizon sovereign / financial-infrastructure theme. The shares are held in the PT PMA's name, in IDR, on the IDX. When the shares are sold, the capital gain is subject to a 0.1% final tax (PPh Final Pasar Modal) on the GROSS sale proceeds — the standard final withholding tax on share transactions on the Indonesia Stock Exchange, applied to the gross proceeds (not the net gain) and final (no additional income tax on the gain). This onshore, in-IDR deployment replaces the earlier Singapore-IBKR / SGD / 22%-capital-gains version of this strategy — and because the deployment is onshore and in IDR, there is no FX risk, no outbound dividend withholding, and no foreign jurisdiction tax to confirm. (Earlier version: convert IDR to SGD via Mandiri corporate FX, send to Singapore IBKR brokerage account, buy global AI/robotics/shares, pay 22% SG capital gains on sale, convert back to IDR to buy a villa.) No Singapore tax adviser is needed for the onshore version (no SG account, no SG holder, no SG tax — the sale is on the IDX in IDR in the PT PMA's name).",
      caveat: "Confirm the IDX participant account onboarding (rekening saham / participant account at the Indonesia Stock Exchange), the exact share instrument (e.g. Mandiri shares vs another Indonesian-listed DOMESTIC stock), the 0.1% final tax treatment (PPh Final Pasar Modal on gross sale proceeds — confirm the taxpayer — the PT PMA — and that it is indeed final, no additional income tax on the gain), and any dividend tax on share dividends (if the Indonesian-listed domestic shares pay dividends, those dividends may be subject to a separate final tax under PPh Final Pasal 4 ayat 2 — typically 10% for corporate recipients — confirm with Indonesian counsel and the Mandiri relationship manager)."
    },
    {
      title: "Deploy into Indonesian-listed DOMESTIC SHARES (e.g. Bank Mandiri / Mandiri shares, or another Indonesian-listed financial / infrastructure stock) — primary path: IDX domestic shares, onshore, in IDR, 0.1% final tax on sale",
      detail: "The after-10%-tax IDR is deployed directly into Indonesian-listed DOMESTIC SHARES on the IDX — for example Bank Mandiri (Mandiri shares / Mandiri stock), or another Indonesian-listed financial / infrastructure stock — via the PT PMA's IDX participant stock account, in the PT PMA's name, in IDR, onshore. This is the primary deployment path (the onshore IDR to IDX DOMESTIC SHARES to IDR cash loop). When the Indonesian-listed DOMESTIC SHARES are sold, the capital gain is subject to a 0.1% final tax (PPh Final Pasar Modal) on the gross sale proceeds — the standard final withholding tax on share transactions on the Indonesia Stock Exchange, applied to the gross proceeds (not the net gain) and final (no additional income tax on the gain). No FX (no IDR to SGD conversion), no outbound dividend withholding (no dividend paid to a Singapore shareholder — the money is deployed as onshore equity, not paid out as a dividend), no foreign capital gains tax (no SG account, no SG holder, no SG tax — the sale is on the IDX in IDR in the PT PMA's name). This onshore IDR to IDX DOMESTIC SHARES version replaces the earlier Singapore-IBKR / SGD / 22%-capital-gains version: the earlier version converted IDR to SGD (FX spread ~1 to 2%), sent it to a Singapore IBKR brokerage account, bought global AI/robotics/shares, paid 22% SG capital gains on sale, converted back to IDR to buy a villa. The onshore version is cleaner (no FX, no 20% dividend withholding, no 22% SG tax — only 0.1% final tax on sale), but the deployment is into Indonesian-listed DOMESTIC SHARES (IDR-denominated, Indonesia-listed) rather than a global SGD portfolio — confirm the exact share instrument, the long-horizon growth profile (vs the earlier global share portfolio), and the tax treatment (0.1% final tax on sale; any separate dividend tax on share dividends) with the Mandiri relationship manager and Indonesian counsel.",
      caveat: "Confirm the exact Indonesian-listed DOMESTIC share instrument (e.g. Mandiri shares vs another Indonesian-listed financial / infrastructure stock), the 0.1% final tax (PPh Final Pasar Modal) on sale (confirm the taxpayer — the PT PMA — and the tax base — gross sale proceeds — and that it is indeed final, no additional income tax on the gain), any dividend tax on share dividends (PPh Final Pasal 4 ayat 2 — typically 10% for corporate recipients — confirm with Indonesian counsel and the Mandiri relationship manager), and the long-horizon growth profile of the chosen Indonesian-listed shares relative to the earlier global share portfolio. The 10B IDR capital investment requirement is still met by villa purchases — the IDX domestic-share deployment is the income-deployment vehicle, not the capital-investment vehicle (the villa purchases are the capital investment toward the 10B IDR PT PMA requirement)."
    },
    {
      title: "Sell IDX DOMESTIC SHARES on realisation — 0.1% final tax (PPh Final Pasar Modal) on gross sale proceeds — then buy another Bali villa to hit the 10B IDR capital investment quota",
      detail: "When the IDX DOMESTIC SHARE portfolio has grown enough, sell the Indonesian-listed DOMESTIC SHARES (e.g. Mandiri shares). The capital gain is subject to a 0.1% final tax (PPh Final Pasar Modal) on the gross sale proceeds — the standard final withholding tax on share transactions on the Indonesia Stock Exchange, applied to the gross proceeds (not the net gain) and final (no additional income tax on the gain). The after-tax IDR proceeds are used to purchase another Bali villa — a villa purchase is a capital purchase that counts towards the PT PMA's 10B IDR minimum paid-up capital / investment realisation requirement (KAP / government board), so each new villa both grows the portfolio and satisfies the Indonesian capital investment requirement. You can repeat this cycle: villa to rental to IDX DOMESTIC SHARES (e.g. Mandiri shares) to sell to 0.1%-taxed-after-tax IDR proceeds to next villa — each new villa both grows the portfolio and satisfies the Indonesian capital investment requirement. The 10B IDR does not need to be a single lump sum invested once — it is the total capital invested in the business over the investment period. The PT PMA has a 3-year window to hit the 10B IDR capital investment requirement; extend to 4-5 years is possible with a documented investment plan and proof of progress, but the primary deadline is 3 years — plan the villa purchases so the 10B IDR is reached within the 3-year window (or file for the extension with the documented plan).",
      caveat: "This is the loop-closer: it connects the IDX DOMESTIC SHARE regime (0.1% final tax on sale) back to the Indonesian PT PMA capital investment requirement. Buying a villa counts as a capital purchase towards the 10B IDR PT PMA capital investment requirement (confirmed). The 3-year window to hit 10B IDR is the binding constraint — buy villas early enough that the cumulative investment reaches 10B IDR within 3 years of PT PMA approval, or document a plan and show proof of progress to extend to 4-5 years. Confirm with Indonesian counsel: the 0.1% final tax treatment on sale of Indonesian-listed DOMESTIC SHARES by the PT PMA (confirm the taxpayer — the PT PMA — and the tax base — gross sale proceeds — and that it is indeed final), any dividend tax on share dividends (PPh Final Pasal 4 ayat 2 — typically 10% for corporate recipients). Note: earlier Singapore-IBKR / SGD / 22%-capital-gains version had 22% SG tax on every sale — the 0.1% final tax on the IDX is far lower, enabling shorter holding periods on the equity side. No Singapore tax adviser is needed for the onshore version (no SG account, no SG holder, no SG tax)."
    },
    {
      title: "Repeat — villa to rental to IDX DOMESTIC SHARES (e.g. Mandiri shares) to sell to next villa (compound the 10% rental + 0.1% final-tax loop)",
      detail: "The whole strategy is a loop, not a one-shot. Each cycle: a completed villa generates 10%-taxed IDR rental to deployed as capital into Indonesian-listed DOMESTIC SHARES (e.g. Mandiri shares / Mandiri stock, or another Indonesian-listed financial / infrastructure stock) on the IDX to grows over time to on realisation, 0.1% final tax on gross sale proceeds (PPh Final Pasar Modal) to after-tax IDR proceeds converted ... (stay in IDR) to used to buy the next Bali villa to which generates the next rental stream and contributes to the 10B IDR capital investment requirement. Over 15 years you can cycle the IDR capital multiple times, each time buying a larger or additional villa, compounding both the rental income base and the capital invested in the PT PMA. The villa is both the income engine and the vehicle that satisfies the Indonesian capital requirement — so the two halves of the strategy (Indonesian property + IDX DOMESTIC SHARES) feed each other. The equity friction is just the 0.1% final tax on sale (not 22%), so shorter holding periods on the equity side are viable — you can rotate into the next tranche of IDX DOMESTIC SHARES without waiting for a new villa, as long as you have IDR in the PT PMA's account (the villa is still the engine — it generates the IDR — but the equity side can churn on its own).",
      caveat: "This is the multi-cycle hypothesis — the long-horizon picture. Confirm with Indonesian counsel that repeated villa purchases do not trigger additional Indonesian tax events (e.g. exit tax on IDR repatriation, or deemed dividend on the transfer) and that the 0.1% final tax (PPh Final Pasar Modal) on sale of Indonesian-listed DOMESTIC SHARES holds across multiple realisation events (confirm the taxpayer — the PT PMA — and the tax base — gross sale proceeds — and that it is indeed final, no additional income tax on the gain, and that the onshore deployment does not trigger any Indonesian tax event beyond the 0.1% final tax on sale). The 10B IDR capital investment requirement and KAP timeline must be confirmed for a multi-villa structure. Earlier Singapore-IBKR / SGD / 22%-capital-gains version had 22% SG tax on every sale + FX risk — the onshore IDR / IDX DOMESTIC SHARES version with 0.1% final tax is far more favourable for a compounding loop (the equity side can churn faster because the friction is just 0.1% final, not 22% + FX)."
    }
  ],
  taxComparison: {
    rentalGross: "100%",
    indonesiaRentalTax: "−10% final withholding tax on gross rental income (Indonesia)",
    afterRentalTax: "90% net IDR",
    fxConversion: "Not applicable to the onshore IDX DOMESTIC SHARES version (the after-tax IDR stays in IDR and is deployed directly into Indonesian-listed DOMESTIC SHARES on the IDX — e.g. Mandiri shares — no IDR to SGD conversion, no FX spread, no cross-border transfer). Earlier Singapore-IBKR / SGD / 22%-capital-gains cross-border version: Convert IDR to SGD (~1 to 2% FX spread, not a tax; Mandiri corporate FX rate may differ from interbank).",
    afterFx: "Onshore IDX version: 90% stays in IDR (after 10% rental tax) — no FX, no conversion. Earlier SG IBKR version: ~88 to 89% of gross (after 10% tax + FX spread).",
    onshoreIdxVersion: {
      label: "Onshore IDR / IDX DOMESTIC SHARES version (current, recommended) — IDR to IDX DOMESTIC SHARES (e.g. Mandiri shares) to IDR cash, 0.1% final tax on sale",
      step1: "Indonesia 10% final withholding tax on gross rental income (Indonesia) — unavoidable",
      step2: "After-tax IDR: 90% of gross rental stays in IDR (after 10% rental tax) — no FX conversion, no outbound dividend withholding, no cross-border transfer",
      step3: "Deploy into Indonesian-listed DOMESTIC SHARES on the IDX (e.g. Bank Mandiri / Mandiri shares, or another Indonesian-listed financial / infrastructure stock) — in the PT PMA's name, in IDR, onshore, via the IDX participant stock account funded from the Mandiri corporate account",
      step4: "Capital gains tax on sale: 0.1% final tax (PPh Final Pasar Modal) on GROSS sale proceeds — the standard final withholding tax on share transactions on the Indonesia Stock Exchange, applied to the gross proceeds (not the net gain), final (no additional income tax on the gain). Onshore, in IDR, in the PT PMA's name. No FX, no outbound dividend withholding, no foreign capital gains tax — the only tax on the share sale is the 0.1% final tax on the IDX.",
      totalLeakage: "10% rental tax only (on the villa rental, in Indonesia) + 0.1% final tax on gross sale proceeds (PPh Final Pasar Modal) when the IDX DOMESTIC SHARES are sold — the only two Indonesian taxes, both onshore. No FX (no IDR to SGD conversion), no outbound dividend withholding (no dividend paid to a Singapore shareholder — the money is deployed as onshore equity, not paid out), no foreign capital gains tax (no SG account, no SG holder, no SG tax — the sale is on the IDX in IDR in the PT PMA's name)."
    },
    earlierSgIbkVersion: {
      label: "Earlier Singapore IBKR / SGD / 22%-capital-gains version (cross-border — for reference only, NOT the recommended path)",
      step1: "Outbound dividend withholding (Indonesia to SG): −20% typical under Indonesia-Singapore DTA, subject to conditions (verify)",
      step2: "Net SGD after dividend withholding: ~70 to 71% of gross rental (after 10% + 20% + FX)",
      step3: "SG capital gains tax on realisation: 22% on gains (corporate holder; individual may be exempt)",
      totalLeakage: "30%+ of gross before deployment (10% rental + 20% dividend + FX drag) — then 22% on gains"
    },
    summary: "The Bali villa rental IDR is deployed onshore — after the 10% Indonesia final rental withholding, the after-tax IDR stays in Indonesia and is deployed into Indonesian-listed DOMESTIC SHARES on the Indonesia Stock Exchange (IDX / Bursa Efek Indonesia — BEI) — for example Bank Mandiri (Mandiri shares / Mandiri stock), or another Indonesian-listed financial / infrastructure stock that fits the long-horizon sovereign / financial-infrastructure theme — via the PT PMA's IDX participant stock account (rekening saham / participant account), in the PT PMA's name, in IDR, onshore, funded directly from the Mandiri corporate account. This onshore IDR to IDX DOMESTIC SHARES to IDR cash loop replaces the earlier Singapore-IBKR / SGD / 22%-capital-gains version of this strategy: the earlier version converted IDR to SGD (FX spread ~1 to 2%), sent it to a Singapore IBKR brokerage account, bought global AI/robotics/shares, paid 22% Singapore capital gains tax on realisation (corporate holder; individual may be exempt), then converted back to IDR to buy a villa. The onshore version is cleaner: no FX (no IDR to SGD conversion), no outbound dividend withholding (no dividend paid to a Singapore shareholder — the money is deployed as onshore equity, not paid out as a dividend), no foreign capital gains tax — the only tax on the share sale is the 0.1% final tax (PPh Final Pasar Modal) on the GROSS sale proceeds on the IDX, applied to the gross proceeds (not the net gain), final (no additional income tax on the gain). No Singapore tax adviser is needed for the onshore version (no SG account, no SG holder, no SG tax — the sale is on the IDX in IDR in the PT PMA's name). The trade-off vs the earlier global-share portfolio version: the onshore deployment is into Indonesian-listed DOMESTIC SHARES (e.g. Mandiri shares / Mandiri stock, or another Indonesian-listed financial / infrastructure stock) — an IDR-denominated, Indonesia-listed asset — rather than a globally diversified SGD-denominated AI/robotics share portfolio, so the growth ceiling and the currency framing are different (IDR vs SGD, Indonesia-listed vs global). This is an onshore, in-IDR, Indonesian DOMESTIC-share deployment, not a global cross-border one. Confirm the exact Indonesian-listed DOMESTIC share instrument (e.g. Mandiri shares vs another Indonesian-listed financial / infrastructure stock), the long-horizon growth profile (vs the earlier global share portfolio), the 0.1% final tax treatment (PPh Final Pasar Modal on gross sale proceeds — confirm the taxpayer — the PT PMA — and the tax base — gross sale proceeds — and that it is indeed final, no additional income tax on the gain), and any dividend tax on share dividends (PPh Final Pasal 4 ayat 2 — typically 10% for corporate recipients — confirm with Indonesian counsel and the Mandiri relationship manager) with the Mandiri relationship manager and Indonesian counsel. The earlier Singapore-IBKR / SGD / 22%-capital-gains version is shown for reference only — the onshore IDR / IDX DOMESTIC SHARES version with the 0.1% final tax is the recommended path."
  },
  risks: [
    { num: "1", title: "PT PMA structure", body: "Minimum capital threshold, nominee director arrangement, KBLI code, local office requirement, and NPWP/NIB issuance all need confirmation with independent Indonesian counsel. The nominee director is a real risk — document control rights (shareholder authority, board resolutions, bank mandate) carefully. A poorly structured nominee arrangement can result in the director locking the entity (see the Phuket 13-foreigner case as a cautionary example)." },
    { num: "2", title: "Bank account eligibility", body: "Mandiri and other Indonesian banks have tightened KYC for foreign-owned PMA entities. Confirm that the PT PMA's structure qualifies for a corporate account — some banks require a minimum capital deposit, a local office address, or a certain shareholder structure. The bank opening can be the slowest step after the PT PMA is registered." },
    { num: "3", title: "Dividend withholding (Indonesia to Singapore) — AVOIDED on the onshore IDR / IDX DOMESTIC SHARES version; only applies to the earlier SG IBKR cross-border version (reference)", body: "The 20% DTA rate is the typical outbound dividend withholding under the Indonesia-Singapore DTA, but it is subject to conditions (beneficial ownership, underlying tax, treaty claim procedure). On the current onshore IDR / IDX DOMESTIC SHARES version (the recommended path), the dividend route is avoided entirely — the after-tax IDR is deployed directly into Indonesian-listed DOMESTIC SHARES (e.g. Mandiri shares) on the IDX, in the PT PMA's name, in IDR, onshore — no dividend is paid to a Singapore shareholder, so no 20% outbound dividend withholding applies (there is no cross-border dividend, no dividend paid offshore). On the earlier Singapore-IBKR / SGD / 22%-capital-gains cross-border version (for reference only), if the PT PMA later needs to pay a dividend (e.g. to distribute proceeds on exit), the withholding applies. Plan the exit structure in advance." },
    { num: "4", title: "Singapore tax residency of the IBKR holder — DOES NOT APPLY on the onshore IDR / IDX DOMESTIC SHARES version (no SG account, no SG holder, no SG tax); only applies to the earlier SG IBKR cross-border version (reference)", body: "The 22% capital gains rate assumes the account holder is a Singapore tax-resident company (or an individual whose gains are not exempt). This does NOT apply to the current onshore IDR / IDX DOMESTIC SHARES version: there is no Singapore account, no Singapore holder, no Singapore tax — the sale of the Indonesian-listed DOMESTIC SHARES happens on the IDX in IDR in the PT PMA's name, with the 0.1% final tax (PPh Final Pasar Modal) on gross sale proceeds — the only tax on the share sale. This risk only applies to the earlier Singapore-IBKR / SGD / 22%-capital-gains cross-border version (for reference only): if the holder is a non-resident or the gains are capital in nature (exempt for individuals), the effective rate differs. Confirm Singapore tax residency of the holder and the characterisation of the gains (capital vs revenue) with a Singapore tax adviser (for the earlier cross-border version only)." },
    { num: "5", title: "FX risk (IDR to SGD) — DOES NOT APPLY on the onshore IDR / IDX DOMESTIC SHARES version (no FX conversion, no IDR to SGD step); only applies to the earlier SG IBKR cross-border version (reference)", body: "The IDR is structurally inflationary against the SGD. The rental income is IDR; the deployment target is SGD. Every conversion loses value over time if the IDR weakens. On the current onshore IDR / IDX DOMESTIC SHARES version, there is NO FX conversion — the after-tax IDR stays in IDR and is deployed directly into Indonesian-listed DOMESTIC SHARES (e.g. Mandiri shares) on the IDX, all in IDR, all onshore. Build a 1 to 2% FX spread per conversion into the model only for the earlier SG IBKR cross-border version (for reference only), and consider whether partial hedging (e.g. a USD/SGD intermediate) is warranted. This is the same currency risk flagged in the Bali strategy verdict — it applies to the deployment path only on the earlier cross-border version, not on the onshore IDR / IDX DOMESTIC SHARES version." },
    { num: "6", title: "Indonesian FX outbound rules — DOES NOT APPLY on the onshore IDR / IDX DOMESTIC SHARES version (no outbound transfer, no IDR to SGD); only applies to the earlier SG IBKR cross-border version (reference)", body: "Bank Indonesia / OJK have reporting and, in some cases, restriction rules on capital repatriation by PMA entities. Converting IDR to SGD and transferring to Singapore may require a documented business purpose, source-of-funds declaration, and reporting. On the current onshore IDR / IDX DOMESTIC SHARES version, there is no FX conversion (no IDR to SGD step) and no cross-border transfer — the money stays in IDR and in Indonesia throughout (IDR cash to IDX DOMESTIC SHARES to IDR cash). These outbound FX rules only apply to the earlier Singapore-IBKR / SGD / 22%-capital-gains cross-border version (for reference only): converting IDR to SGD and transferring to Singapore may require a documented business purpose, source-of-funds declaration, and reporting. Confirm the current outbound FX rules for PMA entities with the bank's treasury desk and Indonesian counsel — the rules have shifted with the Omnibus Law and follow-on reforms (for the earlier cross-border version only)." },
    { num: "7", title: "PT PMA 10B IDR capital investment realisation deadline — the binding constraint", body: "The PT PMA's minimum paid-up capital (10B IDR) must be invested in the business within 3 years of approval, per the KAP / government board requirement. If you cannot meet the 3-year deadline, you can apply to extend to 4 to 5 years — but you must document an investment plan and show proof of progress (e.g. villa leasehold signed, Mandiri corporate account opened, rental income starting). Buying a villa is a capital purchase that counts towards the 10B IDR PT PMA capital investment requirement. The practical implication: plan your villa purchases so the cumulative investment reaches 10B IDR within the 3-year window (or file for the extension with a documented plan and proof of progress). Do not leave the 3-year clock running without a villa purchase plan — the deadline is the binding constraint of the whole structure, not an afterthought. Confirm the exact deadline, extension process, and acceptable proof-of-progress evidence with Indonesian counsel." },
    { num: "8", title: "IDX DOMESTIC SHARE instrument — which share, on which exchange, on which terms — confirm with Indonesian counsel and Mandiri relationship manager", body: "The strategy names Bank Mandiri (Mandiri shares / Mandiri stock) as the example Indonesian-listed DOMESTIC share — a domestic Indonesian bank stock, IDR-denominated, listed on the Indonesia Stock Exchange (IDX / Bursa Efek Indonesia — BEI). On the onshore IDR / IDX DOMESTIC SHARES version (the recommended path), confirm with the Mandiri relationship manager and Indonesian counsel: (a) the exact share instrument (Mandiri shares vs another Indonesian-listed financial / infrastructure stock — confirm the specific stock, its listing, its long-horizon growth profile relative to the Indonesian sovereign / financial-infrastructure theme); (b) the account type and the participant-stock-account onboarding (rekening saham / participant account at the Indonesia Stock Exchange — confirm the sponsor / participant relationship through Mandiri, the account agreement, the Mandiri-IDX linkage, and any minimum-balance / trading requirements); (c) the 0.1% final tax (PPh Final Pasar Modal) on the sale of the shares — confirm the rate, that it is indeed final (no additional income tax on the gain), the taxpayer (the PT PMA), and the tax base (gross sale proceeds); (d) any dividend tax on share dividends (if the shares pay dividends, those dividends may be subject to a separate final tax under PPh Final Pasal 4 ayat 2 — typically 10% for corporate recipients — confirm with Indonesian counsel and the Mandiri relationship manager; this is in addition to the 0.1% final tax on sale and the 10% rental tax already paid — do not assume the dividend is also 10% final without confirmation); and (e) any other Indonesian tax on the onshore share deployment (e.g. any tax on the share purchase itself — confirm whether there is any tax on buying shares on the IDX, in addition to the 0.1% final tax on sale). The earlier Singapore-IBKR / SGD / 22%-capital-gains cross-border version (for reference only) had no Indonesian-listed DOMESTIC share instrument — it used a Singapore IBKR account holding global shares — so this risk does not apply to that version (the earlier version's risks are the SG tax residency, FX, and outbound-FX risks above)." }
  ],
  deploymentTargets: [
    { layer: "Bali villa (Option 1)", what: "Completed/off-plan STR villa — rental income at 10%+ net yield target (e.g. Casa Petak 15.7 to 21.5% projected, PPV4967 Tourism zoning)", why: "Generates the IDR rental stream that funds the PT PMA's Mandiri corporate account to IDX DOMESTIC SHARES deployment. The villa is the income engine.", status: "See villas.html — shortlist" },
    { layer: "PT PMA", what: "Indonesian foreign-owned LLC — holds villa leasehold, signs mgmt agreement, receives IDR rental, holds Mandiri bank account", why: "Legal vehicle for the whole structure. Without it, the villa can't be held, the bank account can't be opened, and the IDX DOMESTIC SHARES funding path is blocked.", status: "Registration pending — confirm with counsel" },
    { layer: "Mandiri corporate account", what: "IDR bank account in PT PMA name — collects rental, pays expenses; funds the PT PMA's IDX participant stock account (IDR) to Indonesian-listed DOMESTIC SHARES (e.g. Mandiri shares) on the IDX — no FX, no cross-border transfer, no outbound dividend withholding", why: "The onshore deployment vehicle (PRIMARY). 10% rental tax withheld here; net IDR deployed directly into IDX DOMESTIC SHARES (e.g. Mandiri shares) — no FX, no cross-border transfer, no outbound dividend withholding. (Earlier SG IBKR version: the Mandiri account was the FX bridge to the Singapore IBKR account — convert IDR to SGD, send to SG IBKR, buy global shares — reference only.)", status: "Opening pending — after PT PMA ready" },
    { layer: "IDX participant stock account (in-country, in IDR, PT PMA name) — holds Indonesian-listed DOMESTIC SHARES (e.g. Mandiri shares)", what: "Indonesia Stock Exchange (IDX / BEI) participant stock account (rekening saham / participant account) in the PT PMA's name — holds Indonesian-listed DOMESTIC SHARES (e.g. Bank Mandiri / Mandiri shares, or another Indonesian-listed financial / infrastructure stock). Capital gains on sale subject to 0.1% final tax (PPh Final Pasar Modal) on gross sale proceeds — the standard final withholding tax on share transactions on the Indonesia Stock Exchange, applied to the gross proceeds (not the net gain), final (no additional income tax on the gain). No FX, no cross-border transfer, no outbound dividend withholding, no foreign capital gains tax. The 0.1% final tax replaces the 22% Singapore capital gains tax from the earlier Singapore-IBKR version.", why: "The PRIMARY deployment destination — Indonesian-listed DOMESTIC SHARES (e.g. Mandiri shares) held in the PT PMA's name on the IDX, in IDR, onshore. Capital gains on sale subject to 0.1% final tax (PPh Final Pasar Modal) on gross sale proceeds. No Indonesian tax on the deployment itself (the purchase of shares is not a taxable event — only the sale triggers the 0.1% final tax). No dividend withholding tax (the deployment is onshore equity, not a dividend). The after-10%-tax IDR becomes IDR capital deployed into Indonesian-listed DOMESTIC SHARES over 15 years. (Earlier SG IBKR version: the deployment destination was a Singapore IBKR SGD brokerage account holding global AI/robotics/shares — 22% SG capital gains tax on sale — reference only.)", status: "Onboarding pending — after PT PMA + bank ready" },
    { layer: "Indonesian-listed DOMESTIC SHARES (e.g. Bank Mandiri / Mandiri shares, or another Indonesian-listed financial / infrastructure stock) — PRIMARY deployment path (vs earlier global AI/robotics/SG IBKR shares — reference only)", what: "Long-horizon (15yr) Indonesian-listed DOMESTIC equity portfolio — the PRIMARY investment target for the onshore IDR capital. Expressed through Indonesian-listed financial / infrastructure stock (e.g. Bank Mandiri / Mandiri shares, or another Indonesian-listed financial / infrastructure stock that fits the sovereign / financial-infrastructure theme). The specific share allocations (which Indonesian-listed financial / infrastructure stock, the allocation, the long-horizon growth profile) are a separate workstream — not detailed on this page. Capital gains on sale subject to 0.1% final tax (PPh Final Pasar Modal) on gross sale proceeds.", why: "The capital growth layer (PRIMARY, onshore, IDR-denominated, Indonesia-listed). See separate deployment workstream. This page documents the plumbing only. (Earlier SG IBKR version: the investment target was global AI/robotics/sovereign-infrastructure shares held in a Singapore IBKR SGD brokerage account — SGD-denominated, global, cross-border, 22% SG capital gains tax on sale — reference only, NOT the recommended path.)", status: "Separate workstream — confirm exact Indonesian-listed DOMESTIC share instrument, 0.1% final tax treatment, and any dividend tax on share dividends with Mandiri relationship manager and Indonesian counsel" }
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
  coralPointNote: "HallersRealty lists 14 active Coral Point Residences for sale (updated 2026-09-15) + 1 rental unit. Beachfront resort community at tip of Mactan Island, 200m from Dusit Thani / Mövenpick / Shangri-La. Owner amenities: clubhouse, dry dock + boat park (35' boats), private island + lagoon, landscaped garden, beachfront park, saltwater + freshwater pools, lockers, cabanas, sundecks, boat ramp. Price range (displayed units, ₱26M cap): ₱15M–25M PHP (~$400k–667k USD). Higher-value 4BR villas and 3BR+ units above ₱26M (₱30M–55M) are excluded from this view by the cap. Full market range across all 14 HallersRealty listings: ₱15M–55M PHP (~$400k–1.47M USD). 4BR units: ₱35M–55M PHP (~$933k–1.47M USD) for 343–365 sqm. Both hallersrealty.com and the older gapurabali.com listing (Joy De Guzman / Sotheby's, Dec 2016) reference the same Coral Point, Punta Engaño location — confirming a real beachfront resort community at the Mactan tip.",
  coralPointVerdict: "Coral Point Residences is a real, active beachfront resort community at the Punta Engaño tip — same location as your Punta Engaño lot. 6 HallersRealty listings ≤₱26M (updated 2026-09-15) shown on this page confirm the entry-level market: ₱15M–25M PHP (~$400k–667k USD). 8 higher-priced units above ₱26M (₱30M–55M PHP: 4BR villas and 3BR+ strata/apt) are excluded by the cap on this page. Full market range across all 14 listings: ₱15M–55M PHP (~$400k–1.47M USD). 4BR units: ₱35M–55M PHP (~$933k–1.47M USD) for 343–365 sqm. Caveats vs building your own villa: (1) Maintenance fee ₱105/sqm/month (~A$11,760/yr for a 350sqm unit at 37.5 FX) — ongoing body corporate cost that a self-built villa on titled land avoids; (2) These are strata/condo units inside a managed community, not full land ownership — you own the unit, not the land; (3) Price range ₱30M–55M for 4BR and higher-value units is 2–3× your build budget (₱16.75M all-in for a 6BR from scratch on your own land) — these higher-priced units are excluded by the ₱26M cap on this page. Buying into Coral Point gives you the developer's finishes + amenities + prime beachfront location, but you pay for it in higher upfront cost + ongoing maintenance. Building your own villa on your titled Punta Engaño lot gives full land ownership, no body corporate, and a 6BR for ~₱16.75M — less than half the cheapest 4BR at Coral Point.",
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
  lastUpdated: "2026-09-25",
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
  competitionTracker: COMPETITION_TRACKER,
};
