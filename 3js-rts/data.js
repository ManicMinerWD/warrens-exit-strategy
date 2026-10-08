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
    health: type === 'worker' ? 100 : 150,
    maxHealth: type === 'worker' ? 100 : 150,
    damage: type === 'warrior' ? 20 : 0,
    attackRange: 3.0,
    speed: 2.0,
    gatherRate: type === 'worker' ? 2.0 : 0,
    buildRate: type === 'worker' ? 5.0 : 0,
    goldCost: type === 'worker' ? 100 : type === 'warrior' ? 150 : 0,
    foodCost: type === 'worker' ? 50 : type === 'warrior' ? 100 : 0,
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
