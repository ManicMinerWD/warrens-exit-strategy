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

  // Setup UI
  setupUI();

  // State
  isFlyToMode = false;
  showFlyOrigin = false;
  buildPreviewMesh = null;

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
  updateSelectedUI('base', 'Click build buttons to place');

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
  document.querySelectorAll('.build-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'build_base') {
        buildBase();
      } else if (action === 'build_worker') {
        spawnWorker();
      } else if (action === 'build_warrior') {
        spawnWarrior();
      }
    });
  });

  // Selection
  selectedName.addEventListener('click', () => {
    if (game.selected && game.selected.alive) {
      game.selected = null;
      updateSelectionUI();
      updateSelectedUI('base', 'Click build buttons to place');
    }
  });

  renderer.domElement.addEventListener('mousemove', (event) => {
    if (game.selected) {
      const intersects = getMouseIntersects(event);
      if (intersects.length > 0) {
        const hit = intersects[0];
        if (hit.object === terrainMesh) {
          showFlyOrigin = true;
          updateBuildPreview(hit.point);
        } else {
          showFlyOrigin = false;
        }
      } else {
        showFlyOrigin = false;
      }
    }
  });

  renderer.domElement.addEventListener('click', (event) => {
    if (game.isGameOver) return;

    const intersects = getMouseIntersects(event);
    if (intersects.length > 0) {
      const hit = intersects[0];
      const unit = findUnitByObject(hit.object);
      if (unit) {
        selectUnit(unit.stats.id);
        if (unit.stats.type === 'worker') {
          assignWorkerToGather(unit);
        }
        return;
      }
    }
  });
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

  units.forEach(u => {
    if (u.group && u.stats.alive) {
      u.stats.animation = (u.stats.animation || 0) + 0.02;
      if (u.stats.type === 'worker') {
        u.group.rotation.y += 0.005;
      }
      if (!u.stats.target) {
        u.group.position.y = 0.4 + Math.sin(u.stats.animation) * 0.03;
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
}

function spawnWorker() {
  if (game.isGameOver) return;

  const cost = { gold: 100, food: 50 };
  if (!deductResources(cost.gold, cost.food)) {
    updateSelectedUI('worker', 'Not enough resources');
    return;
  }

  const pos = getNearBasePosition() || { x: -15, y: 0, z: -15 };
  const unit = createUnitVisual('worker', pos);
  const stats = {
    id: units.length,
    type: 'worker',
    position: { x: pos.x, y: pos.y, z: pos.z },
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
  };
  units.push({ stats: stats, group: unit, alive: true });

  if (unit) {
    workerGatherInterval = setInterval(() => {
      collectResource(stats);
    }, 1000);
  }

  updateHUD();
  saveState();
  updateSelectedUI('worker', 'Gathering gold');
}

function spawnWarrior() {
  if (game.isGameOver) return;

  const cost = { gold: 150, food: 100 };
  if (!deductResources(cost.gold, cost.food)) {
    updateSelectedUI('warrior', 'Not enough resources');
    return;
  }

  const pos = getNearBasePosition() || { x: 15, y: 0, z: 15 };
  const unit = createUnitVisual('warrior', pos);
  const stats = {
    id: units.length,
    type: 'warrior',
    position: { x: pos.x, y: pos.y, z: pos.z },
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
  };
  units.push({ stats: stats, group: unit, alive: true });

  if (unit) {
    highlightUnit(unit);
  }

  updateHUD();
  saveState();
  updateSelectedUI('warrior', 'Ready to attack');
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

  return null;
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
    new THREE.BoxGeometry(2.0, 1.0, 2.0),
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
  };
  units.push({ stats: aiStats, group: aiWorker, alive: true });

  // AI tick
  aiLoop();
}

let aiInterval;

function aiLoop() {
  if (game.isGameOver) return;

  const aiWorker = units.find(u => u.stats.type === 'worker' && u.stats.alive && u.stats.position.x > 10 && u.stats.target);

  if (aiWorker && !aiWorker.stats.target) {
    const node = findNearestResourceNode(aiWorker.stats.position);
    if (node) {
      aiWorker.stats.target = node;
      if (!aiWorker.aiGatherInterval) {
        aiWorker.aiGatherInterval = setInterval(() => {
          collectResource(aiWorker.stats);
        }, 1000);
      }
    }
  }

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
