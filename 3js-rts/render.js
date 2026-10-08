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
const buildButtons = document.getElementById('build-menu');

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
  buildButtons.style.display = 'none';

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
    }
  });

  // Right-click: place unit
  renderer.domElement.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    if (game.isGameOver) return;

    if (game.selected && game.selected.alive) {
      const unit = units.find(u => u.stats.id === game.selected.id);
      if (unit) {
        const intersects = getMouseIntersects(event);
        if (intersects.length > 0 && intersects[0].object === terrainMesh) {
          const groundPos = intersects[0].point;
          placeUnitAt(unit.stats.type, groundPos);
          return;
        }
      }
    }

    const intersects = getMouseIntersects(event);
    if (intersects.length > 0) {
      const hit = intersects[0];
      const building = findBuildingByObject(hit.object);
      if (building) {
        selectBuilding(building);
        return;
      }
    }

    game.selected = null;
    updateSelectionUI();
    updateSelectedUI('base', 'Click a unit or building to select it');
    buildButtons.style.display = 'none';
  });

  // Hover for build preview
  renderer.domElement.addEventListener('mousemove', (event) => {
    if (game.selected && game.selected.alive) {
      const intersects = getMouseIntersects(event);
      if (intersects.length > 0 && intersects[0].object === terrainMesh) {
        showFlyOrigin = true;
        updateBuildPreview(intersects[0].point);
        updateHUD();
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

// ---- Selection ----
function selectUnit(id) {
  const unit = units.find(u => u.stats.id === id);
  if (unit) {
    game.selected = unit.stats;
    updateSelectionUI();
    updateSelectedUI(unit.stats.type, getUnitAction(unit.stats.type));
    updateBuildButtons();
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
    return true;
  }
  return false;
}

function getUnitAction(type) {
  switch (type) {
    case 'worker':
      return 'Gather gold & place units';
    case 'warrior':
      return 'Attack enemies';
    case 'base':
      return 'Right-click to build';
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
  };
  units.push({ stats: stats, group: unit, alive: true });

  if (unit) {
    if (type === 'worker') {
      workerGatherInterval = setInterval(() => {
        collectResource(stats);
      }, 1000);
    }
    if (type === 'warrior') {
      highlightUnit(unit);
    }
  }

  updateHUD();
  saveState();
  updateSelectedUI('base', 'Unit placed! Select a unit or building to place more.');
  updateBuildButtons();
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

