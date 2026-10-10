/* 3JS RTS — Rendering & Game Loop */
/* Requires: data.js (loaded before) */

let scene, camera, renderer, controls;
let terrainMesh;
let unitsGroup, buildingsGroup;
let gameLoopId;
let isFlyToMode;
let flyToTarget;
let showFlyOrigin;
let buildPreviewMesh;
let rightClickTarget;

// ---- DOM refs ----
const goldFill = document.getElementById('gold-fill');
const goldVal = document.getElementById('gold-val');
const foodFill = document.getElementById('food-fill');
const foodVal = document.getElementById('food-val');
const workerVal = document.getElementById('worker-val');
const warriorVal = document.getElementById('warrior-val');
const selectedName = document.getElementById('selected-name');
const selectedType = document.getElementById('selected-type');
const selectedAction = document.getElementById('selected-action');
const gameOverEl = document.getElementById('game-over');
const buildButtons = document.getElementById('build-menu');
const healthBarContainer = document.getElementById('health-bar-container');
const healthBarFill = document.getElementById('health-bar-fill');
const healthLabel = document.getElementById('health-label');
const infoPanel = document.getElementById('info-panel');

// ---- Setup scene ----
function init() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87CEEB);

  // Camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(60, 50, 60);
  camera.lookAt(0, 0, 0);

  // Controls (OrbitControls)
  controls = new THREE.OrbitControls(camera, document.getElementById('ui'));
  controls.target.set(0, 0, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 8;
  controls.maxDistance = 120;
  controls.maxPolarAngle = Math.PI / 2.1;
  controls.update();

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  document.body.prepend(renderer.domElement);

  // Lights
  const ambient = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xfff0e0, 1.2);
  dirLight.position.set(40, 60, 20);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 150;
  dirLight.shadow.camera.left = -50;
  dirLight.shadow.camera.right = 50;
  dirLight.shadow.camera.top = 50;
  dirLight.shadow.camera.bottom = -50;
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0x87CEEB, 0.4);
  fillLight.position.set(-30, 20, -30);
  scene.add(fillLight);

  // Ground
  setupTerrain();

  // Groups
  unitsGroup = new THREE.Group();
  scene.add(unitsGroup);
  buildingsGroup = new THREE.Group();
  scene.add(buildingsGroup);

  // Grid helper
  const gridHelper = new THREE.GridHelper(terrain.size, 20, 0x87CEEB, 0x4a6fa5);
  gridHelper.position.y = -0.01;
  scene.add(gridHelper);

  // UI
  buildButtons.style.display = 'none';
  healthBarContainer.style.display = 'none';

  // Setup UI
  setupUI();

  // State
  isFlyToMode = false;
  showFlyOrigin = false;
  buildPreviewMesh = null;
  rightClickTarget = null;

  // Game loop
  gameLoop();

  // Handle resize
  window.addEventListener('resize', onResize);

  // Load state
  if (loadState()) {
    console.log('Loaded saved game state');
  }

  // Initial state
  game.selected = null;
  updateSelectionUI();
  updateHUD();
  updateSelectedUI('base', 'Click a unit or building to select it');

  // Start AI
  setTimeout(() => {
    startAI();
  }, 3000);

  // Check game over
  setInterval(() => {
    checkGameOver();
  }, 1000);
}

// ---- Terrain ----
function setupTerrain() {
  const geo = new THREE.PlaneGeometry(terrain.size, terrain.size, terrain.segments, terrain.segments);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const dist = Math.sqrt(x * x + z * z);
    const height = terrain.height * Math.sin(dist * 0.04) + 0.5 * Math.sin(dist * 0.08);
    pos.setY(i, height);
  }
  geo.computeVertexNormals();

  terrainMesh = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({
      color: 0x2d5a27,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: false,
    })
  );
  terrainMesh.rotation.x = -Math.PI / 2;
  terrainMesh.receiveShadow = true;
  scene.add(terrainMesh);

  // Add trees (marbles as placeholders)
  const treeMat = new THREE.MeshStandardMaterial({ color: 0x1a5276, roughness: 0.8 });
  const lowTreeMat = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.9 });
  for (let i = 0; i < 40; i++) {
    const x = (Math.random() - 0.5) * (terrain.size - 40);
    const z = (Math.random() - 0.5) * (terrain.size - 40);
    const dist = Math.sqrt(x * x + z * z);
    if (dist < 10 || dist > terrain.size - 10) continue;

    const height = Math.sin(dist * 0.05) * 0.3 + 0.2;
    const meshGeo = new THREE.CylinderGeometry(0.05, 0.1, height, 4);
    const mesh = new THREE.Mesh(meshGeo, lowTreeMat);
    mesh.position.set(x, height / 2, z);
    mesh.castShadow = true;
    scene.add(mesh);
  }
}

// ---- Setup UI event handlers ----
function setupUI() {
  // Left-click: select units or buildings
  renderer.domElement.addEventListener('click', (event) => {
    if (game.isGameOver) return;

    const intersects = getMouseIntersects(event);
    if (intersects.length > 0) {
      const hit = intersects[0];
      const unit = findUnitByObject(hit.object);
      if (unit) {
        selectUnit(unit.stats.id);
        return;
      }

      const building = findBuildingByObject(hit.object);
      if (building) {
        selectBuilding(building);
        return;
      }
    }

    // Click on ground — deselect
    if (!event.ctrlKey && !event.shiftKey) {
      game.selected = null;
      updateSelectionUI();
      updateSelectedUI('base', 'Click a unit or building to select it');
      buildButtons.style.display = 'none';
      healthBarContainer.style.display = 'none';
    }
  });

  // Right-click: attack (if warrior selected) or place unit
  renderer.domElement.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    if (game.isGameOver) return;

    const intersects = getMouseIntersects(event);
    const hit = intersects[0];

    // Check if clicked on a unit
    if (intersects.length > 0) {
      const clickedUnit = findUnitByObject(hit.object);
      if (clickedUnit && game.selected && game.selected.type === 'warrior') {
        // Warrior selected, clicked another unit — attack
        const target = units.find(u => u.stats.id === clickedUnit.stats.id);
        if (target && target.stats.alive && target.stats.type !== 'worker') {
          attackTarget(game.selected.id, target.stats.id);
          return;
        }
      }
    }

    // Clicked on a building — select it
    const building = findBuildingByObject(hit.object);
    if (building) {
      selectBuilding(building);
      return;
    }

    // Clicked on ground — place unit or deselect
    if (hitsOnGround(intersects, event)) {
      if (game.selected && game.selected.alive) {
        const unit = units.find(u => u.stats.id === game.selected.id);
        if (unit) {
          const groundPos = intersects[0].point;
          placeUnitAt(unit.stats.type, groundPos);
          return;
        }
      }
      game.selected = null;
      updateSelectionUI();
      updateSelectedUI('base', 'Click a unit or building to select it');
      buildButtons.style.display = 'none';
      healthBarContainer.style.display = 'none';
      return;
    }

    // Clicked elsewhere — deselect
    game.selected = null;
    updateSelectionUI();
    updateSelectedUI('base', 'Click a unit or building to select it');
    buildButtons.style.display = 'none';
    healthBarContainer.style.display = 'none';
  });

  // Hover for build preview
  renderer.domElement.addEventListener('mousemove', (event) => {
    if (game.selected && game.selected.alive) {
      const intersects = getMouseIntersects(event);
      if (intersects.length > 0 && intersects[0].object === terrainMesh) {
        showFlyOrigin = true;
        updateBuildPreview(intersects[0].point);
        updateHUD();
        // Show health bar for warrior selection
        if (game.selected.type === 'warrior') {
          const unit = units.find(u => u.stats.id === game.selected.id);
          if (unit) {
            showHealthBar(unit.stats.health, unit.stats.maxHealth);
          }
        }
      } else {
        showFlyOrigin = false;
        if (buildPreviewMesh) {
          buildPreviewMesh.removeFromParent();
          buildPreviewMesh = null;
        }
      }
    }
  });
}

// ---- Check if mousedown is on ground ----
function hitsOnGround(intersects, event) {
  if (intersects.length > 0 && intersects[0].object === terrainMesh) {
    // Check if this is a left click (not right click)
    const button = event.button || 0;
    return button === 0;
  }
  return false;
}

// ---- Get mouse intersects ----
function getMouseIntersects(event) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  raycaster.setFromCamera(mouse, camera);

  const intersects = [];
  const terrainIntersects = raycaster.intersectObject(terrainMesh);
  if (terrainIntersects.length > 0) {
    intersects.push(terrainIntersects[0]);
  }

  units.forEach(u => {
    if (!u.stats.alive) return;
    u.group.traverse(child => {
      if (child.isMesh && child.material) {
        const hits = raycaster.intersectObject(child);
        hits.forEach(h => {
          if (!intersects.some(i => i.object === h.object)) {
            h.object.userData.unitId = u.stats.id;
            h.object.userData.unitType = u.stats.type;
            intersects.push(h);
          }
        });
      }
    });
  });

  buildings.forEach(b => {
    if (!b.group) return;
    b.group.traverse(child => {
      if (child.isMesh && child.material) {
        const hits = raycaster.intersectObject(child);
        hits.forEach(h => {
          if (!intersects.some(i => i.object === h.object)) {
            h.object.userData.buildingId = b.id;
            h.object.userData.buildingType = b.type;
            intersects.push(h);
          }
        });
      }
    });
  });

  intersects.sort((a, b) => a.distanceTo(camera.position) - b.distanceTo(camera.position));
  return intersects;
}

// ---- Main game loop ----
function gameLoop() {
  update();
  render();
  gameLoopId = requestAnimationFrame(gameLoop);
}

function update() {
  if (isFlyToMode && flyToTarget) {
    updateFlyTo();
  }

  // Update unit animations
  units.forEach(u => {
    if (u.group && u.stats.alive) {
      u.stats.animation = (u.stats.animation || 0) + 0.02;

      // Idle bob for units without target
      if (!u.stats.target && u.stats.type !== 'warrior') {
        u.group.position.y = 0.4 + Math.sin(u.stats.animation) * 0.03;
      }

      // Warrior animation
      if (u.stats.type === 'warrior') {
        u.group.rotation.y += 0.005;
        // Attack animation
        if (u.stats.attacking) {
          u.stats.attackingTimer += 0.02;
          u.group.position.y = 0.4 + Math.sin(u.stats.attackingTimer) * 0.08;
        }
      }
    }
  });

  if (isFlyToMode) {
    if (flyToTarget) {
      const dist = camera.position.distanceTo(flyToTarget);
      if (dist < 0.5) {
        camera.position.copy(flyToTarget);
        isFlyToMode = false;
        flyToTarget = null;
        showFlyOrigin = false;
      } else {
        camera.position.lerp(flyToTarget, 0.08);
      }
    }
  }

  controls.update();
  updateResourceFills();
}

function render() {
  renderer.render(scene, camera);
}

// ---- Selection ----
function selectUnit(id) {
  const unit = units.find(u => u.stats.id === id);
  if (unit) {
    game.selected = unit.stats;
    updateSelectionUI();
    updateSelectedUI(unit.stats.type, getUnitAction(unit.stats.type));
    updateBuildButtons();
    healthBarContainer.style.display = 'none';
    return true;
  }
  return false;
}

function selectBuilding(building) {
  const found = buildings.find(b => b.id === building.id);
  if (found) {
    game.selected = found;
    updateSelectionUI();
    updateSelectedUI('base', getBuildingAction(found));
    updateBuildButtons();
    healthBarContainer.style.display = 'none';
    return true;
  }
  return false;
}

function getUnitAction(type) {
  switch (type) {
    case 'worker':
      return 'Right-click to place  •  Gather gold';
    case 'warrior':
      return 'Right-click on enemy to attack';
    case 'base':
      return 'Right-click ground to place units';
    default:
      return 'Select a unit';
  }
}

function getBuildingAction(building) {
  if (building.type === 'base') {
    return 'Build Worker (100g/50f)  •  Build Warrior (150g/100f)  •  Build Base (300g/0f)';
  }
  return 'Right-click to place';
}

function updateSelectionUI() {
  if (game.selected && game.selected.alive) {
    const type = game.selected.type || 'unit';
    selectedName.textContent = game.selected.name || 'Unit';
    selectedType.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    selectedAction.textContent = getUnitAction(type);
    selectedName.style.color = type === 'base' ? '#4CAF50' : '#fff';
  } else {
    selectedName.textContent = 'No selection';
    selectedType.textContent = '';
    selectedAction.textContent = '';
  }
}

// ---- Combat ----
function attackTarget(attackerId, targetId) {
  const attacker = units.find(u => u.stats.id === attackerId);
  const target = units.find(u => u.stats.id === targetId);

  if (!attacker || !target) return;
  if (attacker.stats.type !== 'warrior') return;
  if (!target.stats.alive) return;
  if (target.stats.type === 'worker') {
    // Warriors attack workers too
  }

  // Start attack
  attacker.stats.attacking = true;
  attacker.stats.attackingTimer = 0;
  attacker.stats.target = target.stats.position;
  attackTargetUI(attacker.stats.id, target.stats.id);

  // Attack animation
  setTimeout(() => {
    if (attacker.stats.attacking) {
      attack(target.stats.id, target.stats.health);
      // End attack
      setTimeout(() => {
        if (attacker.stats.attacking) {
          attacker.stats.attacking = false;
        }
      }, 300);
    }
  }, 150);
}

function attack(targetId, targetHealth) {
  const attacker = units.find(u => u.stats.alive && u.stats.attacking && u.stats.target);
  const target = units.find(u => u.stats.id === targetId);

  if (!attacker || !target) return;

  // Deal damage
  const damage = attacker.stats.damage;
  target.stats.health -= damage;

  if (target.stats.health <= 0) {
    target.stats.health = 0;
    target.stats.alive = false;
    if (target.group) {
      target.group.removeFromParent();
    }
    // Update counts
    if (target.stats.type === 'warrior') {
      game.warriors--;
    } else if (target.stats.type === 'worker') {
      game.workers--;
    }
    // Check game over
    checkGameOver();
  }

  // Update health bar
  showHealthBar(target.stats.health, target.stats.maxHealth);

  // Move attacker toward target
  moveUnit(attacker, target.stats.position);

  // Reset attack after a cooldown
  setTimeout(() => {
    if (attacker.stats.alive && attacker.stats.attacking) {
      attacker.stats.attacking = false;
    }
  }, 600);
}

function moveUnit(unit, targetPos) {
  if (!unit.stats.alive) return;
  const dx = targetPos.x - unit.stats.position.x;
  const dz = targetPos.z - unit.stats.position.z;
  const dist = Math.sqrt(dx * dx + dz * dz);

  if (dist > 1.0) {
    const speed = unit.stats.speed || 2.0;
    unit.stats.position.x += (dx / dist) * speed * 0.1;
    unit.stats.position.z += (dz / dist) * speed * 0.1;
    unit.group.position.set(unit.stats.position.x, 0.4, unit.stats.position.z);
    unit.group.lookAt(targetPos.x, 0, targetPos.z);
  } else {
    unit.stats.position.x = targetPos.x;
    unit.stats.position.z = targetPos.z;
    unit.group.position.set(targetPos.x, 0.4, targetPos.z);
  }
}

// ---- Build system ----
function buildBase() {
  if (game.isGameOver) return;
  const cost = { gold: 300, food: 0 };
  if (!deductResources(cost.gold, cost.food)) {
    updateSelectedUI('base', 'Not enough resources');
    return;
  }

  const pos = getBuildPosition();
  if (!pos) {
    updateSelectedUI('base', 'Nothing to build on');
    return;
  }

  const group = createBaseVisual(pos);
  buildingsGroup.add(group);
  buildings.push({ type: 'base', position: { x: pos.x, y: pos.y, z: pos.z }, group: group, id: buildings.length });

  updateHUD();
  updateSelectedUI('base', 'Base built! Build more units.');
  saveState();
  updateBuildButtons();
  healthBarContainer.style.display = 'none';
}

function placeUnitAt(type, position) {
  if (game.isGameOver) return;

  const cost = type === 'worker' ? { gold: 100, food: 50 } : type === 'warrior' ? { gold: 150, food: 100 } : { gold: 0, food: 0 };
  if (!deductResources(cost.gold, cost.food)) {
    updateSelectedUI('base', 'Not enough resources');
    return;
  }

  const potentialConflict = buildings.find(b => {
    return Math.sqrt(Math.pow(position.x - b.position.x, 2) + Math.pow(position.z - b.position.z, 2)) < 3;
  });
  if (potentialConflict) {
    updateSelectedUI('base', 'Cannot build on a building');
    return;
  }

  const unit = createUnitVisual(type, position);
  const stats = {
    id: units.length,
    type: type,
    position: { x: position.x, y: position.y, z: position.z },
    rotation: type === 'warrior' ? Math.PI : 0,
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
    attacking: false,
    attackingTimer: 0,
  };
  units.push({ stats: stats, group: unit, alive: true });

  if (unit) {
    if (type === 'worker') {
      workerGatherInterval = setInterval(() => {
        collectResource(stats);
      }, 1000);
    }
  }

  updateHUD();
  saveState();
  updateSelectedUI('base', 'Unit placed! Select a unit to control it.');
  updateBuildButtons();
  healthBarContainer.style.display = 'none';
}

// ---- Get build position ----
function getBuildPosition() {
  if (!game.selected) {
    return null;
  }

  const unit = units.find(u => u.stats.id === game.selected.id);
  if (unit) {
    return unit.stats.position;
  }

  const building = buildings.find(b => b.id === game.selected.id);
  if (building) {
    return building.position;
  }

  return null;
}

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

// ---- Resource system ----
function findNearestResourceNode(unitPosition) {
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

let workerGatherInterval;

function collectResource(unit) {
  const node = findNearestResourceNode(unit.position);
  if (!node) return;

  const amount = unit.gatherRate * 0.1;
  node.collected = Math.min(node.maxCollected, node.collected + amount);
  resources.gold += amount;
  updateHUD();
}

// ---- Show build preview ----
function updateBuildPreview(position) {
  if (buildPreviewMesh) {
    buildPreviewMesh.removeFromParent();
    buildPreviewMesh = null;
  }

  if (!showFlyOrigin) return;

  buildPreviewMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.8, 1.5),
    new THREE.MeshStandardMaterial({
      color: 0x4CAF50,
      transparent: true,
      opacity: 0.3,
      wireframe: true,
      depthWrite: false,
    })
  );
  buildPreviewMesh.position.set(position.x, 0.01, position.z);
  buildPreviewMesh.userData.isPreview = true;
  buildingsGroup.add(buildPreviewMesh);
}

// ---- Display help ----
function updateSelectedUI(type, action) {
  const colors = {
    base: '#4CAF50',
    worker: '#8BC34A',
    warrior: '#795548',
  };
  selectedName.style.color = type === 'base' ? '#4CAF50' : '#fff';
  selectedName.textContent = action.split('—')[0].trim() || 'Unknown';
  selectedType.textContent = type;
  selectedAction.textContent = action;
}

// ---- Highlight unit ----
function highlightUnit(unit) {
  unit.group.traverse(child => {
    if (child.isMesh) {
      child.material.emissive = new THREE.Color(0x4CAF50);
      child.material.emissiveIntensity = 0.5;
    }
  });
}

// ---- Unit helpers ----
function findUnitByObject(obj) {
  for (const u of units) {
    if (!u.stats.alive) continue;
    let found = false;
    u.group.traverse(child => {
      if (child.isMesh && child.userData && child.userData.unitId === u.stats.id) {
        found = true;
      }
    });
    if (found) return u;
  }
  return null;
}

function findBuildingByObject(obj) {
  for (const b of buildings) {
    if (!b.group) continue;
    let found = false;
    b.group.traverse(child => {
      if (child.isMesh && child.userData && child.userData.buildingId === b.id) {
        found = true;
      }
    });
    if (found) return b;
  }
  return null;
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

  if (game.selected.type === 'base') {
    return [
      { type: 'worker', name: 'Worker', gold: 100, food: 50 },
      { type: 'warrior', name: 'Warrior', gold: 150, food: 100 },
      { type: 'base', name: 'Base', gold: 300, food: 0 },
    ];
  }

  return [];
}

// ---- Health bar ----
function showHealthBar(health, maxHealth) {
  if (!healthBarContainer) return;
  healthBarContainer.style.display = 'block';
  const pct = Math.max(0, Math.min(1, health / maxHealth));
  healthBarFill.style.width = (pct * 100) + '%';
  healthBarFill.style.background = pct > 0.3 ? '#4CAF50' : pct > 0.15 ? '#FF9800' : '#F44336';
  healthLabel.textContent = Math.floor(health) + ' / ' + Math.floor(maxHealth);
}

// ---- AI ----
function startAI() {
  const aiPos = { x: 20, y: 0, z: 20 };
  const aiWorker = createUnitVisual('worker', aiPos);
  const aiStats = {
    id: units.length,
    type: 'worker',
    position: { x: aiPos.x, y: aiPos.y, z: aiPos.z },
    rotation: 0,
    health: 100,
    maxHealth: 100,
    damage: 0,
    attackRange: 3.0,
    speed: 2.0,
    gatherRate: 2.0,
    buildRate: 5.0,
    goldCost: 100,
    foodCost: 50,
    alive: true,
    target: null,
    animation: 0,
    attacking: false,
    attackingTimer: 0,
  };
  units.push({ stats: aiStats, group: aiWorker, alive: true });

  // AI tick
  aiLoop();
}

let aiInterval;

function aiLoop() {
  if (game.isGameOver) return;

  // Find AI warrior (find the nearest warrior to an enemy)
  const aiWarriors = units.filter(u => u.stats.type === 'warrior' && u.stats.alive && u.stats.position.x > 10);

  for (const warrior of aiWarriors) {
    if (!warrior.stats.alive) continue;

    // Find nearest enemy (friendly worker or another warrior)
    let target = null;
    let minDist = Infinity;

    for (const unit of units) {
      if (unit === warrior) continue;
      if (!unit.stats.alive) continue;
      if (unit.stats.type === 'worker') continue; // Don't attack workers

      const dx = unit.stats.position.x - warrior.stats.position.x;
      const dz = unit.stats.position.z - warrior.stats.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < minDist) {
        minDist = dist;
        target = unit;
        if (dist < 5) break; // Close enough
      }
    }

    if (target) {
      warrior.stats.target = target.stats.position;
      warrior.stats.attacking = true;
      warrior.stats.attackingTimer = 0;

      // Move toward target
      moveUnit(warrior, target.stats.position);

      // Attack
      setTimeout(() => {
        if (warrior.stats.alive && warrior.stats.attacking) {
          attack(target.stats.id, target.stats.health);
          setTimeout(() => {
            if (warrior.stats.alive && warrior.stats.attacking) {
              warrior.stats.attacking = false;
            }
          }, 600);
        }
      }, 150);

      // Check if target is dead
      setTimeout(() => {
        if (target && !target.stats.alive) {
          target = null;
        }
      }, 800);
    } else {
      // No enemy found — return to base
      const basePos = getFirstBuildingPosition();
      moveUnit(warrior, basePos);
    }
  }

  // Spawn AI units periodically
  if (Math.random() < 0.005 && game.warriors < 15) {
    const warPos = { x: 20, y: 0, z: 20 };
    const warUnit = createUnitVisual('warrior', warPos);
    const warStats = {
      id: units.length,
      type: 'warrior',
      position: { x: warPos.x, y: warPos.y, z: warPos.z },
      rotation: Math.PI,
      health: 150,
      maxHealth: 150,
      damage: 20,
      attackRange: 3.0,
      speed: 2.0,
      gatherRate: 0,
      buildRate: 0,
      goldCost: 150,
      foodCost: 100,
      alive: true,
      target: null,
      animation: 0,
      attacking: false,
      attackingTimer: 0,
    };
    units.push({ stats: warStats, group: warUnit, alive: true });
  }

  if (aiInterval) clearInterval(aiInterval);
  aiInterval = setInterval(() => {
    if (game.warriors < 15 && Math.random() < 0.3) {
      const workerPos = { x: 20, y: 0, z: 20 };
      const workerUnit = createUnitVisual('worker', workerPos);
      const workerStats = {
        id: units.length,
        type: 'worker',
        position: { x: workerPos.x, y: 0, z: workerPos.z },
        rotation: 0,
        health: 100,
        maxHealth: 100,
        damage: 0,
        attackRange: 3.0,
        speed: 2.0,
        gatherRate: 2.0,
        buildRate: 5.0,
        goldCost: 100,
        foodCost: 50,
        alive: true,
        target: null,
        animation: 0,
        attacking: false,
        attackingTimer: 0,
      };
      units.push({ stats: workerStats, group: workerUnit, alive: true });
    }
  }, 20000);

  gameLoopId = requestAnimationFrame(aiLoop);
}

// ---- Game over check ----
setInterval(() => {
  checkGameOver();
}, 1000);

// ---- Resize ----
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ---- Build buttons ----
function updateBuildButtons() {
  const actions = getBuildingActions();
  if (!actions || actions.length === 0) {
    buildButtons.style.display = 'none';
    return;
  }

  buildButtons.style.display = 'flex';
  buildButtons.innerHTML = '';

  actions.forEach(action => {
    const btn = document.createElement('div');
    btn.className = 'build-btn';
    btn.dataset.action = 'place_' + action.type;
    btn.innerHTML = `
      <span class="build-icon">${action.type === 'worker' ? '⛏️' : action.type === 'warrior' ? '⚔️' : '🏰'}</span>
      <span class="build-text">${action.name} (${action.gold}g/${action.food}f)</span>
    `;
    btn.addEventListener('click', () => {
      placeUnitAt(action.type, getBuildingPosition());
    });
    buildButtons.appendChild(btn);
  });
}
