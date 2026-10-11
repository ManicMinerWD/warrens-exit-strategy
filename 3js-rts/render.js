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
const minimapContainer = document.getElementById('minimap-container');
const minimapCanvas = document.getElementById('minimap-canvas');
const minimapCtx = minimapCanvas.getContext('2d');

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

  // Load game data from data.js
  initData();

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
  }, 1000);

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
    const groundHit = getMouseIntersects(event);
    if (groundHit.length > 0 && groundHit[0].object === terrainMesh) {
      if (game.selected && game.selected.alive) {
        const unit = units.find(u => u.stats.id === game.selected.id);
        if (unit) {
          placeUnitAt(unit.stats.type, groundHit[0].point);
          return;
        }
      }
      // Deselect
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
function createUnitVisual(type, position) {
  const group = new THREE.Group();

  if (type === 'worker') {
    // Worker: simple worker figure
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.4, 6), new THREE.MeshStandardMaterial({ color: 0x4CAF50, roughness: 0.8 }));
    body.position.y = 0.2;
    group.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.9 }));
    head.position.y = 0.5;
    group.add(head);
    const arm1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.3, 0.05), new THREE.MeshStandardMaterial({ color: 0x4CAF50, roughness: 0.8 }));
    arm1.position.set(0.2, 0.35, 0);
    group.add(arm1);
    const arm2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.3, 0.05), new THREE.MeshStandardMaterial({ color: 0x4CAF50, roughness: 0.8 }));
    arm2.position.set(-0.2, 0.35, 0);
    group.add(arm2);
  } else if (type === 'warrior') {
    // Warrior: generic warrior figure
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.25, 0.5, 6), new THREE.MeshStandardMaterial({ color: 0x795548, roughness: 0.8 }));
    body.position.y = 0.25;
    group.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.9 }));
    head.position.y = 0.6;
    group.add(head);
    const bodyArm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.05), new THREE.MeshStandardMaterial({ color: 0x795548, roughness: 0.8 }));
    bodyArm.position.set(0, 0.35, 0);
    group.add(bodyArm);
    const arm1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.3, 0.05), new THREE.MeshStandardMaterial({ color: 0x795548, roughness: 0.8 }));
    arm1.position.set(0.25, 0.4, 0);
    group.add(arm1);
    const arm2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.3, 0.05), new THREE.MeshStandardMaterial({ color: 0x795548, roughness: 0.8 }));
    arm2.position.set(-0.25, 0.4, 0);
    group.add(arm2);
    const sword = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.4, 0.02), new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.9 }));
    sword.position.set(0.35, 0.3, 0);
    group.add(sword);
  } else if (type === 'scout') {
    // Scout: taller, leaner figure
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 0.4, 6), new THREE.MeshStandardMaterial({ color: 0x2E86AB, roughness: 0.8 }));
    body.position.y = 0.2;
    group.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.9 }));
    head.position.y = 0.5;
    group.add(head);
    const telescope = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.02, 0.3, 6), new THREE.MeshStandardMaterial({ color: 0x2E86AB, roughness: 0.8 }));
    telescope.position.set(0, 0.4, 0);
    group.add(telescope);
  } else if (type === 'archer') {
    // Archer: leaned-back figure with bow
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.22, 0.5, 6), new THREE.MeshStandardMaterial({ color: 0xC06C2B, roughness: 0.8 }));
    body.position.y = 0.25;
    group.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.9 }));
    head.position.y = 0.6;
    group.add(head);
    const bow = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.05), new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8 }));
    bow.position.set(-0.35, 0.35, 0);
    group.add(bow);
    const arrow = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.3, 6), new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.9 }));
    arrow.position.set(-0.35, 0.2, 0);
    group.add(arrow);
  } else if (type === 'engineer') {
    // Engineer: with hard hat and tool
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 0.4, 6), new THREE.MeshStandardMaterial({ color: 0x4CAF50, roughness: 0.8 }));
    body.position.y = 0.2;
    group.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.9 }));
    head.position.y = 0.5;
    group.add(head);
    const hardHat = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.1, 0.15, 8), new THREE.MeshStandardMaterial({ color: 0x2E7D32, roughness: 0.8 }));
    hardHat.position.y = 0.6;
    group.add(hardHat);
    const tool = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2, 6), new THREE.MeshStandardMaterial({ color: 0x4CAF50, roughness: 0.8 }));
    tool.position.set(0.25, 0.3, 0);
    group.add(tool);
  }

  group.position.set(position.x, position.y || 0, position.z);
  if (position.rotation) group.rotation.y = position.rotation;
  return group;
}

// ---- Main game loop ----
function gameLoop() {
  update();
  render();
  drawMinimap();
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
  updateMinimap();
}

function render() {
  renderer.render(scene, camera);
}

// ---- Minimap rendering ----
const MAP_SIZE = 140;

function drawMinimap() {
  const ctx = minimapCtx;
  const canvas = minimapCanvas;
  const w = canvas.width;
  const h = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, w, h);

  // Draw background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(0, 0, w, h);

  // Draw terrain outline (bounding box)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, w - 4, h - 4);

  // Find min/max positions for centering
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  const bounds = [game.terrainCenter];
  units.forEach(u => { if (u.stats.alive) { bounds.push(u.stats.position); } });
  buildings.forEach(b => { bounds.push(b.position); });

  bounds.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.z < minZ) minZ = p.z;
    if (p.z > maxZ) maxZ = p.z;
  });

  const rangeX = maxX - minX || 1;
  const rangeZ = maxZ - minZ || 1;

  function toMapCoords(p) {
    const x = ((p.x - minX) / rangeX) * (w - 10) + 5;
    const z = ((p.z - minZ) / rangeZ) * (h - 10) + 5;
    return { x: x - 0.5, y: z - 0.5 };
  }

  // Draw resource nodes
  resources.nodes.forEach(node => {
    const pos = toMapCoords(node.position);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(180, 140, 255, 0.6)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Draw units
  units.forEach(u => {
    if (!u.stats.alive) return;
    const pos = toMapCoords(u.stats.position);
    if (u.stats.type === 'worker') {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#8BC34A';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else if (u.stats.type === 'warrior') {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#795548';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  });

  // Draw buildings
  buildings.forEach(b => {
    const pos = toMapCoords(b.position);
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(pos.x - 4, pos.y - 4, 8, 8);
  });
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
      return 'Right-click ground to place units (Base: 300g)';
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
  const dir = new THREE.Vector3(targetPos.x - unit.stats.position.x, 0, targetPos.z - unit.stats.position.z);
  dir.normalize();
  unit.stats.position.x += dir.x * unit.stats.speed * 0.016;
  unit.stats.position.z += dir.z * unit.stats.speed * 0.016;
  unit.group.position.copy(unit.stats.position);
}

// ---- Placement ----
function buildBase() {
  if (!canAfford(300, 0)) {
    updateSelectedUI('base', 'Not enough resources');
    return;
  }
  deductResources(300, 0);
  const base = createBaseData({ x: 0, y: 0, z: 0 });
  buildings.push(base);
  const baseMesh = createUnitVisual('base', base.position);
  base.group = baseMesh;
  buildingsGroup.add(baseMesh);
  updateHUD();
  updateSelectionUI();
  updateSelectedUI('base', 'Base built! Right-click ground to place units');
}

function placeUnitAt(type, position) {
  const building = buildings.find(b => b.id === game.selected.id);
  if (!building) return;

  if (type === 'worker') {
    if (!canAfford(100, 50)) {
      updateSelectedUI('base', 'Not enough resources');
      return;
    }
    deductResources(100, 50);
    const unit = createUnitData('worker', position);
    units.push(unit);
    const unitMesh = createUnitVisual('worker', unit.position);
    unit.group = unitMesh;
    unitsGroup.add(unitMesh);
    game.workers++;
  } else if (type === 'warrior') {
    if (!canAfford(150, 100)) {
      updateSelectedUI('base', 'Not enough resources');
      return;
    }
    deductResources(150, 100);
    const unit = createUnitData('warrior', position);
    units.push(unit);
    const unitMesh = createUnitVisual('warrior', unit.position);
    unit.group = unitMesh;
    unitsGroup.add(unitMesh);
    game.warriors++;
  }
  updateHUD();
  updateSelectionUI();
  updateBuildButtons();
  updateMinimap();
  updateSelectedUI('base', 'Unit placed! Select the new unit to give it orders.');
  setTimeout(() => {
    if (game.selected && game.selected.id === building.id) {
      updateSelectedUI('base', 'Base — click a unit or building to select it');
    }
  }, 1500);
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

function collectResource(unit) {
  if (unit.stats.type !== 'worker') return;
  const node = findNearestResourceNode(unit.position);
  if (!node) return;

  const amount = unit.gatherRate * 0.1;
  node.collected = Math.min(node.maxCollected, node.collected + amount);
  resources.gold += amount;
  updateHUD();
}

// ---- Build preview ----
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
  game.workers++;

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
      position: { x: warPos.x, y: 0, z: warPos.z },
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
    game.warriors++;
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
      game.workers++;
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

// ---- HUD updates ----
function updateResourceFills() {
  if (goldFill) goldFill.style.width = (resources.gold / 1000) * 100 + '%';
  if (foodFill) foodFill.style.width = (resources.food / 1000) * 100 + '%';
  if (goldVal) goldVal.textContent = Math.floor(resources.gold);
  if (foodVal) foodVal.textContent = Math.floor(resources.food);
  if (workerVal) workerVal.textContent = game.workers;
  if (warriorVal) warriorVal.textContent = game.warriors;
}

// ---- Minimap ----
function updateMinimap() {
  const ctx = minimapCtx;
  const w = minimapCanvas.width;
  const h = minimapCanvas.height;

  // Clear
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(0, 0, w, h);

  // Draw terrain outline
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, w - 4, h - 4);

  // Find bounds
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  const bounds = [game.terrainCenter];
  units.forEach(u => { if (u.stats.alive) bounds.push(u.stats.position); });
  buildings.forEach(b => { bounds.push(b.position); });

  bounds.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.z < minZ) minZ = p.z;
    if (p.z > maxZ) maxZ = p.z;
  });

  const rangeX = maxX - minX || 1;
  const rangeZ = maxZ - minZ || 1;

  function toMapCoords(p) {
    const x = ((p.x - minX) / rangeX) * (w - 10) + 5;
    const z = ((p.z - minZ) / rangeZ) * (h - 10) + 5;
    return { x: x - 0.5, y: z - 0.5 };
  }

  // Draw resource nodes
  resources.nodes.forEach(node => {
    const pos = toMapCoords(node.position);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(180, 140, 255, 0.6)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Draw units
  units.forEach(u => {
    if (!u.stats.alive) return;
    const pos = toMapCoords(u.stats.position);
    if (u.stats.type === 'worker') {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#8BC34A';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else if (u.stats.type === 'warrior') {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#795548';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  });

  // Draw buildings
  buildings.forEach(b => {
    const pos = toMapCoords(b.position);
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(pos.x - 4, pos.y - 4, 8, 8);
  });

  // Update HUD counts
  document.getElementById('minimap-workers').textContent = 'Workers: ' + game.workers;
  document.getElementById('minimap-warriors').textContent = 'Warriors: ' + game.warriors;
}
