/* 3JS RTS — Data & Game State */
/* Pure game logic. No 3JS dependencies. */

// ---- Terrain config ----
const terrain = {
  size: 200,
  height: 4,
  segments: 60,
};

// ---- Game state ----
const game = {
  selected: null,        // currently selected unit or 'base'
  isGameOver: false,
  workers: 0,
  warriors: 0,
  units: [],             // all units
  buildings: [],         // all buildings
};

// ---- Resources ----
const resources = {
  gold: 100,
  food: 100,
  nodes: [],             // resource nodes
};

// ---- Units ----
const units = [];

// ---- Buildings ----
const buildings = [];

// ---- Initialize game state ----
function initData() {
  // Generate resource nodes
  for (let i = 0; i < 6; i++) {
    const pos = {
      x: (Math.random() - 0.5) * (terrain.size - 20),
      z: (Math.random() - 0.5) * (terrain.size - 20),
    };
    resources.nodes.push({
      position: pos,
      radius: 1.0,
      capacity: 50,
      collected: 0,
      maxCollected: 50,
    });
  }

  // Place initial base
  buildings.push({
    id: 0,
    type: 'base',
    position: { x: -10, y: 0, z: -10 },
    group: null,
  });

  // Set terrain center for minimap
  game.terrainCenter = { x: 0, y: 0, z: 0 };

  // Start with nothing selected
  game.selected = null;
}

// ---- Unit creation (pure data) ----
function createUnitData(type, position, rotation = 0) {
  const baseStats = {
    id: units.length,
    type: type,
    position: { x: position.x, y: position.y, z: position.z },
    rotation: rotation,
    health: type === 'worker' ? 100 : type === 'scout' ? 80 : type === 'archer' ? 50 : type === 'engineer' ? 120 : 150,
    maxHealth: type === 'worker' ? 100 : type === 'scout' ? 80 : type === 'archer' ? 50 : type === 'engineer' ? 120 : 150,
    damage: type === 'warrior' || type === 'archer' ? 20 : 0,
    attackRange: type === 'archer' ? 5.0 : type === 'scout' ? 4.0 : type === 'engineer' ? 1.0 : 3.0,
    speed: type === 'scout' ? 3.5 : type === 'archer' ? 3.0 : type === 'engineer' ? 1.5 : 2.0,
    gatherRate: type === 'worker' ? 2.0 : 0,
    buildRate: type === 'worker' ? 5.0 : 0,
    goldCost: type === 'worker' ? 100 : type === 'scout' ? 120 : type === 'archer' ? 140 : type === 'engineer' ? 200 : 150,
    foodCost: type === 'worker' ? 50 : type === 'scout' ? 30 : type === 'archer' ? 60 : type === 'engineer' ? 80 : 100,
    alive: true,
    target: null,
    animation: 0,
  };

  return {
    stats: baseStats,
    alive: true,
  };
}

// ---- Building creation (pure data) ----
function createBaseData(position) {
  return {
    id: buildings.length,
    type: 'base',
    position: { x: position.x, y: position.y, z: position.z },
  };
}

// ---- Resource node helpers ----
function getNearestResourceNode(unitPosition) {
  if (resources.nodes.length === 0) return null;

  let nearest = null;
  let minDist = Infinity;
  for (const node of resources.nodes) {
    const dist = Math.sqrt(
      Math.pow(unitPosition.x - node.position.x, 2) +
      Math.pow(unitPosition.z - node.position.z, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = node;
    }
  }
  return nearest;
}

// ---- Game state getters ----
function getGameState() {
  return {
    gold: resources.gold,
    food: resources.food,
    workers: game.workers,
    warriors: game.warriors,
    units: units.length,
    buildings: buildings.length,
    selected: game.selected ? game.selected.id : null,
    isGameOver: game.isGameOver,
  };
}

// ---- Resource checks ----
function canAfford(goldCost, foodCost) {
  return resources.gold >= goldCost && resources.food >= foodCost;
}

// ---- Resource deduction ----
function deductResources(goldCost, foodCost) {
  if (!canAfford(goldCost, foodCost)) {
    return false;
  }
  resources.gold -= goldCost;
  resources.food -= foodCost;
  return true;
}

// ---- Game over ----
function checkGameOver() {
  if (game.warriors >= 20) {
    game.isGameOver = true;
    document.getElementById('gameover-count').textContent = game.warriors;
    const el = document.getElementById('game-over');
    if (el) el.style.display = 'flex';
  }
}

// ---- Persist state ----
function saveState() {
  localStorage.setItem('rts_state', JSON.stringify({
    gold: resources.gold,
    food: resources.food,
    workers: game.workers,
    warriors: game.warriors,
    units: units.filter(u => u.stats.alive).map(u => u.stats),
    buildings: buildings.map(b => ({
      type: b.type,
      position: b.position,
    })),
  }));
}

// ---- Load state ----
function loadState() {
  const saved = localStorage.getItem('rts_state');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      resources.gold = data.gold || 100;
      resources.food = data.food || 100;
      game.workers = data.workers || 0;
      game.warriors = data.warriors || 0;
      if (data.units) {
        data.units.forEach(u => {
          u.alive = true;
          const unit = {
            stats: u,
            alive: true,
            group: null,
          };
          units.push(unit);
        });
      }
      if (data.buildings) {
        data.buildings.forEach(b => {
          const building = {
            type: b.type,
            position: b.position,
            group: null,
            id: buildings.length,
          };
          buildings.push(building);
        });
      }
      return true;
    } catch (e) {
      console.log('Failed to load state:', e);
    }
  }
  return false;
}

// ---- Resource collection ----
function collectResource(unit) {
  const node = getNearestResourceNode(unit.position);
  if (!node) return;

  const amount = unit.gatherRate * 0.1;
  node.collected = Math.min(node.maxCollected, node.collected + amount);
  resources.gold += amount;
}

// ---- Game state updates ----
function updateGameCounts() {
  game.workers = units.filter(u => u.stats.type === 'worker' && u.stats.alive).length;
  game.warriors = units.filter(u => u.stats.type === 'warrior' && u.stats.alive).length;
}

// ---- Helper: get first building position ----
function getFirstBuildingPosition() {
  if (buildings.length === 0) {
    return { x: -15, y: 0, z: -15 };
  }
  return buildings[0].position;
}

// ---- Helper: get position near base ----
function getNearBasePosition() {
  const base = getFirstBuildingPosition();
  const offsets = [
    { x: 10, z: 0 },
    { x: -10, z: 0 },
    { x: 0, z: 10 },
    { x: 0, z: -10 },
  ];

  for (const offset of offsets) {
    const pos = { x: base.x + offset.x, y: 0, z: base.z + offset.z };
    const overlap = buildings.find(b => {
      return Math.sqrt(Math.pow(pos.x - b.position.x, 2) + Math.pow(pos.z - b.position.z, 2)) < 3;
    });
    if (!overlap) {
      return pos;
    }
  }

  return { x: base.x + offsets[0].x, y: 0, z: base.z + offsets[0].z };
}

// ---- Get available actions for a building ----
function getBuildingActions() {
  if (!game.selected || !game.selected.alive) return [];

  const unit = units.find(u => u.stats.id === game.selected.id);
  if (unit && unit.stats.type === 'worker') {
    return [{ type: 'worker', name: 'Worker', gold: 100, food: 50 }];
  }
  if (unit && unit.stats.type === 'warrior') {
    return [{ type: 'warrior', name: 'Warrior', gold: 150, food: 100 }];
  }

  // Building actions
  if (game.selected.type === 'base') {
    return [
      { type: 'worker', name: 'Worker', gold: 100, food: 50 },
      { type: 'warrior', name: 'Warrior', gold: 150, food: 100 },
      { type: 'base', name: 'Base', gold: 300, food: 0 },
    ];
  }

  return [];
}

// ---- Check if enough resources ----
function checkAfford(goldCost, foodCost) {
  return resources.gold >= goldCost && resources.food >= foodCost;
}


// ---- Elle fractional ownership model (signed lease) ----
// $1,000 deposit + 1/20 standard room at $74,750 + 2/20 standard room premium at $201,250
// = $276,000 total; 10% = $27,600/yr guaranteed during construction + first 2 years operating.
// Personal property, no PT PMA.
const ELLE_LEASE = {
  leaseStructure: {
    key: "Elle-Fractional-Owner-Occupied",
    deposit: 1000,
    depositNote: "User's deposit paid at signing -- $1,000 (part of total consideration)",
    fractions: [
      { share: "1/20", type: "Standard Room", value: 74750, price: 74750, annual10: 7475 },
      { share: "2/20", type: "Standard Room Premium", value: 201250, price: 201250, annual10: 20125 }
    ],
    totalFractionValue: 276000,
    totalFractionShare: "3/20",
    totalFractionPct: 15.0,
    totalEntryConsideration: 276000,
    guaranteeRatePct: 10.0,
    guaranteeAnnual: 27600,
    guaranteeApplies: "During construction (FY2026-FY2028) AND first 2 years of operation (FY2029-FY2030)",
    operatorAtSource: "Operator (via its own PT PMA) pays 10% at source on gross rental"
  },
  headline: {
    totalEntryConsideration: 276000,
    deposit: 1000,
    guaranteeRatePct: 10.0,
    guaranteeAnnual: 27600,
    guaranteeDuringConstruction: 27600 * 3,
    guaranteeFirst2YearsOperating: 27600 * 2,
    totalGuarantee50Yr: 27600 * 50,
    year1LeaseIncome: 27600,
    year5Stabilised: 27600,
    totalOperating25: 27600 * 25,
    totalLifecycle25: 27600 * 25,
    avgRateAdvancePct: 10.0,
    avgRateAdjustedPct: 10.0,
    projectionNotes: "10% of $276,000 (3/20 fractional: 1/20 standard room at $74,750 + 2/20 standard room premium at $201,250) = $27,600 guaranteed per year during construction and the first 2 years of operation."
  },
  sensitivity: {
    conservative: { label: "Conservative (0.80x)", multiplier: 0.80, year1: 27600, year5: 22080, totalOp25: 27600 * 25, avgRateAdjustedPct: 8.0, ratio: 2.60, totalLifecycle: 27600 * 25 },
    expected: { label: "Expected (1.00x)", multiplier: 1.00, year1: 27600, year5: 27600, totalOp25: 27600 * 25, avgRateAdjustedPct: 10.0, ratio: 2.60, totalLifecycle: 27600 * 25 },
    optimistic: { label: "Optimistic (1.18x)", multiplier: 1.18, year1: 32568, year5: 36204, totalOp25: 32568 * 25, avgRateAdjustedPct: 11.8, ratio: 3.06, totalLifecycle: 32568 * 25 }
  },
  guaranteeWaterfall: {
    depositPaid: 1000,
    fraction1: { share: "1/20", type: "Standard Room", price: 74750, annual10: 7475 },
    fraction2: { share: "2/20", type: "Standard Room Premium", price: 201250, annual10: 20125 },
    total: { deposit: 1000, fractions: 2, totalValue: 276000, annual10: 27600 }
  },
  constructionRebate: {
    ratePct: 10.0,
    periodMonths: 36,
    annual: 27600,
    totalConstruction: 27600 * 3,
    totalOperatingFirst2: 27600 * 2,
    totalGuaranteePeriod: 27600 * 5,
    note: "10% of $276,000 = $27,600/yr guaranteed during construction (36 months) and first 2 years of operation (FY2029-FY2030). Paid quarterly."
  },
  minimumGuarantee: {
    minYear1: 27600,
    periodYears: 2,
    periodDescription: "FY2026-FY2030 (construction + first 2 operating years)",
    year1Modelled: 27600,
    year1Guaranteed: 27600,
    coverage: 1.0,
    note: "10% of $276,000 = $27,600/yr guaranteed during construction and first 2 operating years."
  },
  incomeSource: {
    headline: "Your 3/20 fractional interest (1/20 Standard Room + 2/20 Standard Room Premium = $276,000) receives a 10% guaranteed return = $27,600/yr during construction and the first 2 years of operation, paid monthly by the operator at source on gross rental.",
    deposit: "$1,000 deposit was paid at signing -- part of the total $276,000 consideration.",
    fractions: "1/20 Standard Room at $74,750 + 2/20 Standard Room Premium at $201,250 = $276,000 total fractional value (3/20 of the property).",
    guarantee: "10% of $276,000 = $27,600/yr, guaranteed during construction AND the first 2 years of operation, paid at source by the operator.",
    roomRevenue: "Room revenue is split: your 3/20 fractional interest receives 3/20 of the room revenue pool monthly, PLUS 30% of net profit after all expenses.",
    guaranteePeriod: "FY2026-FY2030 (construction + first 2 operating years) -- the 10% is the GUARANTEED floor.",
    totalFractionValue: 276000,
    totalFractionShare: "3/20 (15%)",
    guaranteeAnnual: 27600,
    year1LeaseIncome: 27600,
    year5Stabilised: 27600,
    note: "Fractional ownership (PWD/IOD-style) structure, not a PT PMA. You own 3/20 of the specific rooms; the operator manages everything."
  },
  roomWaterfall: {
    guarantee1Share: { amount: 7475, description: "1/20 Standard Room -- 10% of $74,750" },
    guarantee2Share: { amount: 20125, description: "2/20 Standard Room Premium -- 10% of $201,250" },
    totalAnnual: 27600
  },
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
  schedule: [
    { year: "FY2026", phase: "Construction", receipts: 27600, growth: "n/a", cumulative: 27600, benchmark: 27600, gap: 0 },,
    { year: "FY2027", phase: "Construction", receipts: 27600, growth: "n/a", cumulative: 55200, benchmark: 27600, gap: 0 },,
    { year: "FY2028", phase: "Construction", receipts: 27600, growth: "n/a", cumulative: 82800, benchmark: 27600, gap: 0 },,
    { year: "FY2029", phase: "Operating", receipts: 27600, growth: "n/a", cumulative: 110400, benchmark: 27600, gap: 0 },,
    { year: "FY2030", phase: "Operating", receipts: 27600, growth: "n/a", cumulative: 138000, benchmark: 27600, gap: 0 },,
    { year: "FY2031", phase: "Operating", receipts: 28870, growth: "+4.6%", cumulative: 193200, benchmark: 27600, gap: 1270 },,
    { year: "FY2032", phase: "Operating", receipts: 30198, growth: "+4.6%", cumulative: 249670, benchmark: 27600, gap: 2598 },,
    { year: "FY2033", phase: "Operating", receipts: 31587, growth: "+4.6%", cumulative: 307468, benchmark: 27600, gap: 3987 },
    { year: "FY2034", phase: "Operating", receipts: 33040, growth: "+4.6%", cumulative: 366655, benchmark: 27600, gap: 5440 },
    { year: "FY2035", phase: "Operating", receipts: 34560, growth: "+4.6%", cumulative: 427295, benchmark: 27600, gap: 6960 },
    { year: "FY2036", phase: "Operating", receipts: 36149, growth: "+4.6%", cumulative: 489455, benchmark: 27600, gap: 8549 },
    { year: "FY2037", phase: "Operating", receipts: 37812, growth: "+4.6%", cumulative: 553204, benchmark: 27600, gap: 10212 },
    { year: "FY2038", phase: "Operating", receipts: 39551, growth: "+4.6%", cumulative: 618616, benchmark: 27600, gap: 11951 },
    { year: "FY2039", phase: "Operating", receipts: 41371, growth: "+4.6%", cumulative: 685767, benchmark: 27600, gap: 13771 },
    { year: "FY2040", phase: "Operating", receipts: 43274, growth: "+4.6%", cumulative: 754738, benchmark: 27600, gap: 15674 },
    { year: "FY2041", phase: "Operating", receipts: 45264, growth: "+4.6%", cumulative: 825612, benchmark: 27600, gap: 17664 },
    { year: "FY2042", phase: "Operating", receipts: 47347, growth: "+4.6%", cumulative: 898476, benchmark: 27600, gap: 19747 },
    { year: "FY2043", phase: "Operating", receipts: 49525, growth: "+4.6%", cumulative: 973423, benchmark: 27600, gap: 21925 },
    { year: "FY2044", phase: "Operating", receipts: 51803, growth: "+4.6%", cumulative: 1050548, benchmark: 27600, gap: 24203 },
    { year: "FY2045", phase: "Operating", receipts: 54186, growth: "+4.6%", cumulative: 1129951, benchmark: 27600, gap: 26586 },
    { year: "FY2046", phase: "Operating", receipts: 56678, growth: "+4.6%", cumulative: 1211737, benchmark: 27600, gap: 29078 },
    { year: "FY2047", phase: "Operating", receipts: 59285, growth: "+4.6%", cumulative: 1296015, benchmark: 27600, gap: 31685 },
    { year: "FY2048", phase: "Operating", receipts: 62013, growth: "+4.6%", cumulative: 1382900, benchmark: 27600, gap: 34413 },
    { year: "FY2049", phase: "Operating", receipts: 64865, growth: "+4.6%", cumulative: 1472513, benchmark: 27600, gap: 37265 },
    { year: "FY2050", phase: "Operating", receipts: 67849, growth: "+4.6%", cumulative: 1564978, benchmark: 27600, gap: 40249 },
    { year: "FY2051", phase: "Operating", receipts: 70970, growth: "+4.6%", cumulative: 1660427, benchmark: 27600, gap: 43370 },
    { year: "FY2052", phase: "Operating", receipts: 74235, growth: "+4.6%", cumulative: 1758997, benchmark: 27600, gap: 46635 },
    { year: "FY2053", phase: "Operating", receipts: 77649, growth: "+4.6%", cumulative: 1860832, benchmark: 27600, gap: 50049 }
  ],
  scheduleTotals: {
    totalOperating: 1192067,
    totalLifecycle: 1274867,
    leaseReceiptsRatio: 4.32,
    breakevenYear: 10,
    note: "Lower-bound projection: the 10% guarantee is the contractual floor paid during construction and the first 2 years of operation. After FY2030 the income-share stream grows at 4.6% p.a. above the 10% floor."
  },
  comparison: {
    upliftNote: "The 3/20 fractional leasehold (1/20 Standard Room + 2/20 Standard Room Premium = $276,000) is benchmarked against hotel-let comparable positions at an average of 8% net yield on advance consideration. Your 10% guaranteed return on $276,000 = $27,600/yr exceeds the benchmark by 2 percentage points during the construction and guarantee period."
  },
  nonRoomRevenue: {
    perKey: 420,
    perOccupiedNight: 18.5,
    adsPerYear: 12,
    adsPerMonth: 1,
    perKeyMonthly: 35,
    notes: "Non-room revenue from advertising and per-key fees on the fractional interest"
  },
  protections: {
    constructionRebate: {
      ratePct: 10.0,
      periodMonths: 36,
      annual: 27600,
      totalConstruction: 27600 * 3,
      note: "10% of $276,000 = $27,600/yr guaranteed during construction (36 months) and first 2 years of operation (FY2029-FY2030). Paid quarterly."
    },
    minimumGuarantee: {
      minYear1: 27600,
      periodYears: 2,
      periodDescription: "FY2026-FY2030 (construction + first 2 operating years)",
      year1Guaranteed: 27600,
      year1Modelled: 27600,
      year1Shortfall: 0,
      coverage: 1.0,
      note: "10% of $276,000 = $27,600/yr guaranteed during construction and first 2 operating years."
    }
  },
  verdict: {
    headline: "CONFIRMED personal property -- fractional ownership (3/20 fractional interest), NO PT PMA, NO Indonesia bonds, NO IDX shares",
    pull: "Higher ticket ($312k) for a ~55% bigger slice of the same pool. The 10% guarantee is the floor; income-share is the upside.",
    againstCriteria: "This is the highest-value fractional leasehold position in Bali -- $27,600 guaranteed/yr on $276,000 = 10% guaranteed, with upside via the income-share. Confirm with your tax adviser: the 10% guarantee terms and who stands behind it; the 3/20 fractional definition; payout frequency and currency; and exit/liquidity terms at year 50."
  }
};

// ---- DATA object (combined: game data + Elle financial model) ----
const DATA = {
  lastUpdated: "2026-10-21",
  elle_lease: ELLE_LEASE
};
