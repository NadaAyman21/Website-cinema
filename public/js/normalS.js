const HALL_CONFIGS = {
  standard: {
    label: 'Standard',
    badge: 'STD',
    badgeClass: 'std',
    price: 120,
    maxSeats: 8,
    accentColor: 0x2a7ab8,
    seatColor: 0x0f2a45,
    seatEmissive: 0x000d1a,
    seatEmissiveIntensity: 0.3,
    wallColor: 0x0a1520,
    floorColor: 0x080d12,
    ceilingColor: 0x0a1018,
    carpetColor: 0x0a1a2a,
    fogColor: 0x06090f,
    screenText: 'STANDARD',
    screenSubText: 'HALL · SELECT YOUR SEAT',
    screenBg1: '#051525',
    screenBg2: '#020a14',
    screenGoldLine: '#3a8fc9',
    curtainColor: 0x0a1e35,
    sconce: 0x4488bb,
    ROWS: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    ROW_CONFIGS: {
      A: { seats: [1, 2, 3, 4, null, 5, 6, 7, 8] },
      B: { seats: [1, 2, 3, 4, 5, null, 6, 7, 8, 9] },
      C: { seats: [1, 2, 3, 4, 5, 6, null, 7, 8, 9, 10] },
      D: { seats: [1, 2, 3, 4, null, 5, 6, 7, 8, null, 9, 10] },
      E: { seats: [1, 2, 3, 4, 5, null, 6, 7, 8, 9, 10] },
      F: { seats: [1, 2, 3, 4, null, 5, 6, 7, 8, 9] },
      G: { seats: [1, 2, 3, 4, 5, 6, 7, 8] },
    },
    TAKEN: new Set(['A2','A6','B3','B8','C5','C9','D2','D6','D10','E3','E8','F4','F7','G3','G6']),
    HOLD:  new Set(['A4','C2','E5','G1']),
  },
 
  deluxe: {
    label: 'Deluxe',
    badge: 'DLX',
    badgeClass: 'dlx',
    price: 250,
    maxSeats: 6,
    accentColor: 0x7a3ab8,
    seatColor: 0x26104a,
    seatEmissive: 0x0d0020,
    seatEmissiveIntensity: 0.4,
    wallColor: 0x140820,
    floorColor: 0x0d0814,
    ceilingColor: 0x100816,
    carpetColor: 0x1a0a2e,
    fogColor: 0x0a0610,
    screenText: 'DELUXE',
    screenSubText: 'EXPERIENCE · CHOOSE YOUR SEAT',
    screenBg1: '#120526',
    screenBg2: '#08021a',
    screenGoldLine: '#8a4ac9',
    curtainColor: 0x28084a,
    sconce: 0x8855cc,
    ROWS: ['A', 'B', 'C', 'D', 'E'],
    ROW_CONFIGS: {
      A: { seats: [1, 2, null, 3, 4, null, 5, 6] },
      B: { seats: [1, 2, 3, null, 4, 5, 6, null, 7] },
      C: { seats: [1, 2, 3, 4, 5, null, 6, 7, null, 8] },
      D: { seats: [1, 2, 3, null, 4, 5, 6, 7, null, 8, 9] },
      E: { seats: [1, 2, 3, 4, 5, 6, 7] },
    },
    TAKEN: new Set(['A3','A5','B2','B6','C1','C4','D3','D7','E4']),
    HOLD:  new Set(['A1','C2','E3']),
  }
};
  
let currentHall    = 'standard';
let selected       = new Set();
let hoveredSeat    = null;
let isDragging     = false;
let prevMouse      = { x: 0, y: 0 };
let phi            = Math.PI / 2.2;
let theta          = Math.PI;
let radius         = 15;
let targetPhi      = phi;
let targetTheta    = theta;
let targetRadius   = radius;
let autoRotate     = false;
let autoRotateSpeed = 0;
let currentView    = 'audience';
 
const seatMeshes = {};
let   seatData   = {};
const seatGroup  = new THREE.Group();
 
const SEAT_W      = 0.82;
const SEAT_H      = 0.9;
const SEAT_D      = 0.75;
const ROW_Z_START = -7;
const ROW_Z_STEP  = 2.4;
const SEAT_X_STEP = 1.1;
const ROW_Y_RISE  = 0.3;
 
const VIEWS = {
  audience: { phi: Math.PI / 2.1,  theta: Math.PI,       radius: 14 },
  top:      { phi: 0.4,             theta: Math.PI,       radius: 22 },
  fly:      { phi: Math.PI / 2.5,   theta: Math.PI * 0.85, radius: 17 },
};

const canvas = document.getElementById('cinema-canvas');
 
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.85;
 
const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 200);
 
function updateCamera() {
  const x = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);
  camera.position.set(x, y + 2, z);
  camera.lookAt(0, 1, -2);
}
 
let roomObjects  = [];
let lightObjects = [];

function buildHall(hallKey) {
  const cfg = HALL_CONFIGS[hallKey];
 
  roomObjects.forEach(o => scene.remove(o));
  roomObjects = [];
  lightObjects.forEach(o => scene.remove(o));
  lightObjects = [];
 
  Object.keys(seatMeshes).forEach(k => {
    seatGroup.remove(seatMeshes[k]);
    delete seatMeshes[k];
  });
  seatData = {};

  scene.background = new THREE.Color(cfg.fogColor);
  scene.fog        = new THREE.FogExp2(cfg.fogColor, 0.024);
 
   cfg.ROWS.forEach((row, ri) => {
    const rowCfg = cfg.ROW_CONFIGS[row];
    rowCfg.seats.forEach(s => {
      if (s === null) return;
      const id = `${row}${s}`;
      let status = 'available';
      if (cfg.TAKEN.has(id)) status = 'taken';
      else if (cfg.HOLD.has(id)) status = 'hold';
      seatData[id] = { row, num: s, status, rowIndex: ri };
    });
  });
 
  buildRoom(cfg);
  buildLights(cfg);
  buildSeats(cfg);
  refreshPickable();
}

function makeMaterials(cfg) {
  return {
    gold: new THREE.MeshStandardMaterial({
      color: 0xc9a84c, roughness: 0.2, metalness: 0.9,
      emissive: 0x2a1800, emissiveIntensity: 0.3
    }),
    accent: new THREE.MeshStandardMaterial({
      color: cfg.accentColor, roughness: 0.2, metalness: 0.8,
      emissive: cfg.accentColor, emissiveIntensity: 0.25
    }),
    wall:      new THREE.MeshStandardMaterial({ color: cfg.wallColor,    roughness: 0.9, metalness: 0.05 }),
    floor:     new THREE.MeshStandardMaterial({ color: cfg.floorColor,   roughness: 0.95 }),
    ceiling:   new THREE.MeshStandardMaterial({ color: cfg.ceilingColor, roughness: 1 }),
    curtain:   new THREE.MeshStandardMaterial({ color: cfg.curtainColor, roughness: 0.95 }),
    carpet:    new THREE.MeshStandardMaterial({ color: cfg.carpetColor,  roughness: 1 }),
    screenGlow: new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0x6699cc, emissiveIntensity: 1.2,
      roughness: 0.05, transparent: true, opacity: 0.97
    }),
    seatAvail: new THREE.MeshStandardMaterial({
      color: cfg.seatColor, roughness: 0.88,
      emissive: cfg.seatEmissive, emissiveIntensity: cfg.seatEmissiveIntensity
    }),
    seatSelected: new THREE.MeshStandardMaterial({
      color: cfg.accentColor, roughness: 0.25, metalness: 0.4,
      emissive: cfg.accentColor, emissiveIntensity: 0.9
    }),
    seatHold:  new THREE.MeshStandardMaterial({ color: 0x3a4a1a, roughness: 0.88, emissive: 0x0a1000, emissiveIntensity: 0.2 }),
    seatTaken: new THREE.MeshStandardMaterial({ color: 0x100808, roughness: 0.95, metalness: 0.05 }),
    seatHover: new THREE.MeshStandardMaterial({
      color: cfg.accentColor, roughness: 0.2, metalness: 0.5,
      emissive: cfg.accentColor, emissiveIntensity: 1.1
    }),
    plinth:  new THREE.MeshStandardMaterial({ color: 0x0e0c14, roughness: 0.8, metalness: 0.2 }),
    armBody: new THREE.MeshStandardMaterial({ color: 0x0a0810, roughness: 0.7, metalness: 0.3 }),
  };
}
 
let mats = {};

function buildRoom(cfg) {
  mats = makeMaterials(cfg);
  const W = 22, H = 10, D = 30;
 
  function add(mesh) { scene.add(mesh); roomObjects.push(mesh); return mesh; }
 
   const floor = add(new THREE.Mesh(new THREE.PlaneGeometry(W, D), mats.floor));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
 
    const carpet = add(new THREE.Mesh(new THREE.PlaneGeometry(1.2, D * 0.6), mats.carpet));
  carpet.rotation.x = -Math.PI / 2;
  carpet.position.set(0, 0.01, 2);

   const ceil = add(new THREE.Mesh(new THREE.PlaneGeometry(W, D), mats.ceiling));
  ceil.rotation.x = Math.PI / 2;
  ceil.position.y = H;

   const bwall = add(new THREE.Mesh(new THREE.PlaneGeometry(W, H), mats.wall));
  bwall.position.set(0, H / 2, D / 2);
  bwall.rotation.y = Math.PI;

   [-1, 1].forEach(side => {
    const w = add(new THREE.Mesh(new THREE.PlaneGeometry(D, H), mats.wall));
    w.position.set(side * W / 2, H / 2, 0);
    w.rotation.y = side * -Math.PI / 2;
  });

    const swall = add(new THREE.Mesh(new THREE.PlaneGeometry(W, H), mats.wall));
  swall.position.set(0, H / 2, -D / 2);

    const frame = add(new THREE.Mesh(new THREE.BoxGeometry(13, 7.5, 0.2), mats.gold));
  frame.position.set(0, 5, -D / 2 + 0.25);

    const stCanvas = document.createElement('canvas');
  stCanvas.width = 1024;
  stCanvas.height = 576;
  const ctx = stCanvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, 576);
  grad.addColorStop(0, cfg.screenBg1);
  grad.addColorStop(1, cfg.screenBg2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 576);
 
  for (let i = 0; i < 180; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.4 + 0.08})`;
    ctx.beginPath();
    ctx.arc(Math.random() * 1024, Math.random() * 576, Math.random() * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
 
    ctx.fillStyle = cfg.screenGoldLine;
  ctx.fillRect(0, 48, 1024, 3);
  ctx.fillRect(0, 525, 1024, 3);

    ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 130px serif';
  ctx.shadowColor = '#aaccff';
  ctx.shadowBlur = 30;
  ctx.fillText(cfg.screenText, 512, 320);

    ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(200,220,255,0.6)';
  ctx.font = '300 26px serif';
  ctx.letterSpacing = '0.8em';
  ctx.fillText(cfg.screenSubText, 512, 380);

   ctx.fillStyle = `${cfg.screenGoldLine}88`;
  ctx.font = '17px serif';
  ctx.letterSpacing = '0.25em';
  ctx.fillText('• SELECT YOUR SEAT BELOW •', 512, 500);
 
  const sTex = new THREE.CanvasTexture(stCanvas);
  const screenMesh = add(new THREE.Mesh(
    new THREE.PlaneGeometry(12, 6.7),
    new THREE.MeshBasicMaterial({ map: sTex })
  ));
  screenMesh.position.set(0, 5, -D / 2 + 0.4);

    const rail = add(new THREE.Mesh(new THREE.BoxGeometry(14, 0.12, 0.3), mats.gold));
  rail.position.set(0, 1.4, -D / 2 + 0.3);
 
   [-1, 1].forEach(side => {
    const c = add(new THREE.Mesh(new THREE.BoxGeometry(2.5, 8, 0.3), mats.curtain));
    c.position.set(side * 7.2, 4.5, -D / 2 + 0.3);
    const trim = add(new THREE.Mesh(new THREE.BoxGeometry(0.12, 8, 0.4), mats.gold));
    trim.position.set(side * 5.95, 4.5, -D / 2 + 0.3);
  });
 
    for (let i = 0; i < 7; i++) {
    const riser = add(new THREE.Mesh(new THREE.BoxGeometry(W - 2, 0.12, 0.3), mats.accent));
    riser.position.set(0, i * 0.3 + 0.05, -2 + i * 2.2);
  }

   for (let si = 0; si < 4; si++) {
    [-1, 1].forEach(side => {
      const sconce = add(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.6, 8), mats.gold));
      sconce.position.set(side * (W / 2 - 0.1), 3.5, -10 + si * 5);
      const bulb = add(new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshStandardMaterial({ emissive: cfg.sconce, emissiveIntensity: 2.5, color: cfg.sconce })
      ));
      bulb.position.set(side * (W / 2 - 0.15), 3.7, -10 + si * 5);
    });
  }

    for (let ci = 0; ci < 7; ci++) {
    const fix = add(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.1, 12), mats.gold));
    fix.position.set(0, H - 0.4, -10 + ci * 3.5);
  }
}

function buildLights(cfg) {
  function addL(l) { scene.add(l); lightObjects.push(l); return l; }
 
  addL(new THREE.AmbientLight(0x10111a, 0.9));
  addL(new THREE.HemisphereLight(0x111528, 0x080510, 0.5));
 
  const dir = addL(new THREE.DirectionalLight(0xdde8ff, 0.5));
  dir.position.set(5, 15, 10);
  dir.castShadow = true;
  dir.shadow.mapSize.set(2048, 2048);
 
  const spot = addL(new THREE.SpotLight(cfg.accentColor, 1.8, 30, Math.PI / 5, 0.4));
  spot.position.set(0, 9, 2);
  spot.target.position.set(0, 4, -14);
  addL(spot.target);

    const sLight = addL(new THREE.PointLight(cfg.accentColor, 2.5, 18));
  sLight.position.set(0, 5, -13);
 
    for (let si = 0; si < 4; si++) {
    [-1, 1].forEach(side => {
      const pl = addL(new THREE.PointLight(cfg.sconce, 0.5, 6));
      pl.position.set(side * 10.5, 3.7, -10 + si * 5);
    });
  }
 
    for (let ci = 0; ci < 7; ci++) {
    const pl = addL(new THREE.PointLight(0xdde8ff, 0.35, 8));
    pl.position.set(0, 9.5, -10 + ci * 3.5);
  }
}

function buildSeats(cfg) {
  cfg.ROWS.forEach((row, ri) => {
    const rowCfg   = cfg.ROW_CONFIGS[row];
    const valid    = rowCfg.seats.filter(s => s !== null);
    const totalW   = (valid.length - 1) * SEAT_X_STEP;
    let seatIndex  = 0;
 
    rowCfg.seats.forEach(s => {
      if (s === null) { seatIndex++; return; }
 
      const id      = `${row}${s}`;
      const data    = seatData[id];
      const x       = -totalW / 2 + seatIndex * SEAT_X_STEP;
      const z       = ROW_Z_START + ri * ROW_Z_STEP;
      const y       = ri * ROW_Y_RISE;
      const baseMat = getBaseMat(data.status);
      const group   = buildSeatMesh(x, y, z, baseMat, currentHall === 'deluxe');
 
      group.userData = { seatId: id, status: data.status };
      seatGroup.add(group);
      seatMeshes[id] = group;
      seatIndex++;
    });
  });
}
 
function buildSeatMesh(x, y, z, baseMat, isDeluxe) {
  const group  = new THREE.Group();
  const bm     = () => baseMat.clone();
  const goldM  = mats.gold;
  const arm    = mats.armBody;
  const plinth = mats.plinth;

  if (isDeluxe) {
  
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(SEAT_W, 0.18, SEAT_D * 0.85), bm());
    cushion.position.set(x, y + 0.48, z - 0.04); cushion.castShadow = true; group.add(cushion);
 
    const lip = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, SEAT_W, 12, 1, false, 0, Math.PI), bm());
    lip.rotation.z = Math.PI / 2; lip.position.set(x, y + 0.43, z - SEAT_D * 0.85 / 2 - 0.04); group.add(lip);
 
    const back = new THREE.Mesh(new THREE.BoxGeometry(SEAT_W, SEAT_H * 1.15, 0.14), bm());
    back.rotation.x = -0.10; back.position.set(x, y + 1.05, z + SEAT_D / 2 - 0.08); back.castShadow = true; group.add(back);
 
    const head = new THREE.Mesh(new THREE.BoxGeometry(SEAT_W * 0.7, 0.28, 0.16), bm());
    head.rotation.x = -0.10; head.position.set(x, y + 1.68, z + SEAT_D / 2 - 0.06); group.add(head);
 
    [-1, 1].forEach(side => {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.14), bm());
      wing.position.set(x + side * SEAT_W * 0.32, y + 1.68, z + SEAT_D / 2 - 0.06); group.add(wing);
    });
 
    const lumbar = new THREE.Mesh(new THREE.BoxGeometry(SEAT_W * 0.6, 0.18, 0.08), bm());
    lumbar.rotation.x = -0.10; lumbar.position.set(x, y + 0.62, z + SEAT_D / 2 - 0.04); group.add(lumbar);
 
    const p = new THREE.Mesh(new THREE.BoxGeometry(SEAT_W + 0.06, 0.1, SEAT_D * 0.9), plinth);
    p.position.set(x, y + 0.05, z - 0.04); group.add(p);
 
    const railF = new THREE.Mesh(new THREE.BoxGeometry(SEAT_W + 0.1, 0.04, 0.04), goldM);
    railF.position.set(x, y + 0.1, z - SEAT_D * 0.45); group.add(railF);
    const railB = railF.clone(); railB.position.set(x, y + 0.1, z + SEAT_D * 0.45); group.add(railB);
 
    [-1, 1].forEach(side => {
      const ab = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.52, SEAT_D * 0.88), arm);
      ab.position.set(x + side * (SEAT_W / 2 + 0.065), y + 0.35, z - 0.04); group.add(ab);
 
      const at = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.07, SEAT_D * 0.78), bm());
      at.position.set(x + side * (SEAT_W / 2 + 0.065), y + 0.62, z - 0.04); group.add(at);
 
      const tr = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.02, SEAT_D * 0.88), goldM);
      tr.position.set(x + side * (SEAT_W / 2 + 0.065), y + 0.09, z - 0.04); group.add(tr);
 
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.04, 16), goldM);
      cup.position.set(x + side * (SEAT_W / 2 + 0.065), y + 0.66, z + SEAT_D * 0.28); group.add(cup);
    });
 
    const foot = new THREE.Mesh(new THREE.BoxGeometry(SEAT_W - 0.1, 0.09, 0.25), bm());
    foot.position.set(x, y + 0.27, z - SEAT_D * 0.52); group.add(foot);
 
    const footR = new THREE.Mesh(new THREE.BoxGeometry(SEAT_W, 0.03, 0.03), goldM);
    footR.position.set(x, y + 0.32, z - SEAT_D * 0.64); group.add(footR);
 
    const badge = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.02), goldM);
    badge.position.set(x, y + 0.75, z + SEAT_D / 2 - 0.02); group.add(badge);
 
  } else {
   
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(SEAT_W, 0.15, SEAT_D * 0.8), bm());
    cushion.position.set(x, y + 0.42, z); cushion.castShadow = true; group.add(cushion);
 
    const back = new THREE.Mesh(new THREE.BoxGeometry(SEAT_W, SEAT_H, 0.13), bm());
    back.rotation.x = -0.05; back.position.set(x, y + 0.95, z + SEAT_D / 2 - 0.08); back.castShadow = true; group.add(back);
 
    const head = new THREE.Mesh(new THREE.BoxGeometry(SEAT_W * 0.8, 0.22, 0.14), bm());
    head.position.set(x, y + 1.5, z + SEAT_D / 2 - 0.06); group.add(head);
 
    const p = new THREE.Mesh(new THREE.BoxGeometry(SEAT_W + 0.04, 0.1, SEAT_D * 0.85), plinth);
    p.position.set(x, y + 0.04, z); group.add(p);
 
    const railF = new THREE.Mesh(new THREE.BoxGeometry(SEAT_W + 0.08, 0.04, 0.04), mats.accent);
    railF.position.set(x, y + 0.09, z - SEAT_D * 0.42); group.add(railF);
    const railB = railF.clone(); railB.position.set(x, y + 0.09, z + SEAT_D * 0.42); group.add(railB);
 
    [-1, 1].forEach(side => {
      const ab = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.44, SEAT_D * 0.82), arm);
      ab.position.set(x + side * (SEAT_W / 2 + 0.055), y + 0.3, z); group.add(ab);
 
      const at = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.06, SEAT_D * 0.72), bm());
      at.position.set(x + side * (SEAT_W / 2 + 0.055), y + 0.52, z); group.add(at);
    });
  }
 
  return group;
}
 
function getBaseMat(status) {
  if (status === 'taken') return mats.seatTaken;
  if (status === 'hold')  return mats.seatHold;
  return mats.seatAvail;
}
 
function updateSeatVisual(id) {
  const mesh = seatMeshes[id];
  if (!mesh) return;
  const data = seatData[id];
  let mat;
  if      (data.status === 'taken') mat = mats.seatTaken;
  else if (data.status === 'hold')  mat = mats.seatHold;
  else if (selected.has(id))        mat = mats.seatSelected;
  else if (hoveredSeat === id)      mat = mats.seatHover;
  else                               mat = mats.seatAvail;
 
  mesh.children.forEach(c => {
    if (c.material &&
        c.material !== mats.gold &&
        c.material !== mats.accent &&
        c.material !== mats.plinth &&
        c.material !== mats.armBody) {
      c.material = mat;
    }
  });
}
 
function switchHall(hallKey) {
  if (hallKey === currentHall) return;
 
  const overlay = document.getElementById('switch-overlay');
  overlay.classList.add('visible');
 
  setTimeout(() => {
    currentHall = hallKey;
    selected.clear();
    hoveredSeat = null;
 
    buildHall(hallKey);
    updateHallUI(hallKey);
    updateUI();
 
  
    phi = Math.PI / 2.2; theta = Math.PI; radius = 15;
    targetPhi = phi; targetTheta = theta; targetRadius = radius;
    autoRotate = false;

     document.querySelectorAll('.view-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
 
    setTimeout(() => overlay.classList.remove('visible'), 50);
  }, 350);
}
 
function updateHallUI(hallKey) {
  const cfg   = HALL_CONFIGS[hallKey];
  const isStd = hallKey === 'standard';
  const cls   = isStd ? 'std' : 'dlx';

  document.querySelectorAll('.hall-tab').forEach(t => {
    t.classList.remove('active');
    if ((isStd && t.classList.contains('std')) || (!isStd && t.classList.contains('dlx'))) {
      t.classList.add('active');
    }
  });

    const badge = document.getElementById('tier-badge');
  badge.textContent = cfg.badge;
  badge.className   = `tier-badge ${cls}`;

    document.getElementById('max-label').textContent = `MAX ${cfg.maxSeats} SEATS`;
 
      document.getElementById('cursor').style.borderColor = isStd ? 'var(--std-accent)' : 'var(--dlx-accent)';
 
        const ldSeat = document.getElementById('ld-seat');
  ldSeat.className = `legend-dot ld-seat-${cls}`;
  document.getElementById('ld-seat-label').textContent = cfg.label;
  document.getElementById('ld-selected').className = `legend-dot ld-selected-${cls}`;
 
    document.getElementById('sel-count').className = `selection-count ${cls}`;
 

      const btn     = document.getElementById('book-btn');
  btn.className = cls;
  btn.disabled  = true;

    const cornerColor = isStd ? 'var(--std-accent)' : 'var(--dlx-accent)';
  ['mc-tl', 'mc-tr', 'mc-bl', 'mc-br'].forEach(id => {
    document.getElementById(id).style.borderColor = cornerColor;
  });
  document.getElementById('modal-title').style.color = isStd ? 'var(--std-accent-light)' : 'var(--dlx-accent-light)';
  document.getElementById('modal-sub').textContent   = `${cfg.label} Hall · Tonight 9:00 PM`;
  document.getElementById('modal-price').style.color = isStd ? 'var(--std-accent-light)' : 'var(--dlx-accent-light)';
  document.getElementById('btn-confirm').className   = `btn-confirm ${cls}`;
}
 
function toggleSeat(id) {
  const data = seatData[id];
  if (!data || data.status === 'taken' || data.status === 'hold') return;
 
  const cfg = HALL_CONFIGS[currentHall];
  if (selected.has(id)) {
    selected.delete(id);
  } else {
    if (selected.size >= cfg.maxSeats) { flashMax(); return; }
    selected.add(id);
  }
  updateSeatVisual(id);
  updateUI();
}
 
function flashMax() {
  const el = document.getElementById('sel-count');
  el.style.color = '#ff4444';
  setTimeout(() => { el.style.color = ''; }, 600);
}
 
function updateUI() {
  const count = selected.size;
  document.getElementById('sel-count').textContent  = count;
  document.getElementById('book-btn').disabled      = count === 0;
 
  const tagsEl = document.getElementById('seat-tags');
  tagsEl.innerHTML = '';
  const cls = currentHall === 'standard' ? 'std' : 'dlx';
 
  Array.from(selected).sort().forEach(id => {
    const tag = document.createElement('div');
    tag.className   = `seat-tag ${cls}`;
    tag.textContent = id;
    tagsEl.appendChild(tag);
  });
}

function openConfirm() {
  if (selected.size === 0) return;
  const cfg    = HALL_CONFIGS[currentHall];
  const cls    = currentHall === 'standard' ? 'std' : 'dlx';
  const seatsEl = document.getElementById('modal-seats');
  seatsEl.innerHTML = '';
 
  Array.from(selected).sort().forEach(id => {
    const el = document.createElement('div');
    el.className   = `modal-seat-tag ${cls}`;
    el.textContent = id;
    seatsEl.appendChild(el);
  });
 
  document.getElementById('modal-price').textContent = `EGP ${selected.size * cfg.price}`;
  document.getElementById('confirm-modal').classList.add('show');
}
 
function closeConfirm() {
  document.getElementById('confirm-modal').classList.remove('show');
}
 
function confirmBook() {
  closeConfirm();
  const cfg = HALL_CONFIGS[currentHall];
  alert(`🎬 Booking confirmed! Enjoy your ${cfg.label} experience.`);
  selected.clear();
  Object.keys(seatMeshes).forEach(id => updateSeatVisual(id));
  updateUI();
}
 
const tooltip = document.getElementById('tooltip');
 
function showTooltip(id, x, y) {
  const data = seatData[id];
  if (!data) return;
  const cfg = HALL_CONFIGS[currentHall];
  const cls = currentHall === 'standard' ? 'std' : 'dlx';
 
  const tipSeat = document.getElementById('tip-seat');
  tipSeat.textContent = `Seat ${id}`;
  tipSeat.className   = `tip-seat ${cls}`;
 
  document.getElementById('tip-price').textContent  = data.status === 'taken' ? '—' : `EGP ${cfg.price}`;
  document.getElementById('tip-status').textContent =
    data.status === 'taken' ? 'Unavailable' :
    data.status === 'hold'  ? 'On Hold' :
    selected.has(id) ? 'Selected — click to deselect' : 'Click to select';
 
  tooltip.style.display = 'block';
  tooltip.style.left    = x + 'px';
  tooltip.style.top     = y + 'px';
}
 
function hideTooltip() {
  tooltip.style.display = 'none';
}

function setView(v) {
  currentView = v;
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  const vd = VIEWS[v];
  autoRotate      = v === 'fly';
  autoRotateSpeed = v === 'fly' ? 0.003 : 0;
  targetPhi       = vd.phi;
  targetTheta     = vd.theta;
  targetRadius    = vd.radius;
}

// ═══════════════════════════════════════════════════════════════════════════════
const raycaster    = new THREE.Raycaster();
const mouse        = new THREE.Vector2(-9999, -9999);
let   mouseScreen  = { x: 0, y: 0 };
const allSeatMeshes = [];
 
function refreshPickable() {
  allSeatMeshes.length = 0;
  Object.values(seatMeshes).forEach(g => g.children.forEach(c => allSeatMeshes.push(c)));
}
 
function getSeatId(obj) {
  if (!obj) return null;
  if (obj.parent && obj.parent.userData.seatId) return obj.parent.userData.seatId;
  if (obj.userData.seatId) return obj.userData.seatId;
  return null;
}

const cursor = document.getElementById('cursor');
 
document.addEventListener('mousemove', e => {
  mouseScreen = { x: e.clientX, y: e.clientY };
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
  mouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
 
  if (isDragging) {
    const dx = e.clientX - prevMouse.x;
    const dy = e.clientY - prevMouse.y;
    targetTheta -= dx * 0.005;
    targetPhi    = Math.max(0.2, Math.min(Math.PI / 1.5, targetPhi + dy * 0.005));
    prevMouse    = { x: e.clientX, y: e.clientY };
  }
});
 
document.addEventListener('mousedown', e => {
  if (e.target.closest('#topbar') ||
      e.target.closest('#seat-panel') ||
      e.target.closest('#confirm-modal') ||
      e.target.closest('#hall-tabs')) return;
  isDragging = true;
  prevMouse  = { x: e.clientX, y: e.clientY };
  autoRotate = false;
});
 
document.addEventListener('mouseup', e => {
  if (isDragging &&
      Math.abs(e.clientX - prevMouse.x) < 3 &&
      Math.abs(e.clientY - prevMouse.y) < 3) {
    if (hoveredSeat) toggleSeat(hoveredSeat);
  }
  isDragging = false;
});
 
document.addEventListener('wheel', e => {
  targetRadius = Math.max(5, Math.min(27, targetRadius + e.deltaY * 0.02));
  e.preventDefault();
}, { passive: false });

let touchStart = null;
 
document.addEventListener('touchstart', e => {
  touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  prevMouse  = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  isDragging = true;
  autoRotate = false;
});
 
document.addEventListener('touchmove', e => {
  if (!isDragging) return;
  const dx = e.touches[0].clientX - prevMouse.x;
  const dy = e.touches[0].clientY - prevMouse.y;
  targetTheta -= dx * 0.006;
  targetPhi    = Math.max(0.2, Math.min(Math.PI / 1.5, targetPhi + dy * 0.006));
  prevMouse    = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  e.preventDefault();
}, { passive: false });
 
document.addEventListener('touchend', e => {
  if (touchStart) {
    const dx = Math.abs(e.changedTouches[0].clientX - touchStart.x);
    const dy = Math.abs(e.changedTouches[0].clientY - touchStart.y);
    if (dx < 5 && dy < 5 && hoveredSeat) toggleSeat(hoveredSeat);
  }
  isDragging = false;
});
 
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

let animFrame = 0;
 
function animate() {
  requestAnimationFrame(animate);
  animFrame++;

    phi    += (targetPhi    - phi)    * 0.06;
  theta  += (targetTheta  - theta)  * 0.06;
  radius += (targetRadius - radius) * 0.06;
  if (autoRotate) targetTheta += autoRotateSpeed;
  updateCamera();

  if (animFrame % 2 === 0) {
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(allSeatMeshes, false);
 
    if (hits.length > 0) {
      const id = getSeatId(hits[0].object);
      if (id && id !== hoveredSeat) {
        if (hoveredSeat) updateSeatVisual(hoveredSeat);
        hoveredSeat = id;
        if (!selected.has(id) && seatData[id] && seatData[id].status === 'available') {
          updateSeatVisual(id);
        }
      }
      if (id) { cursor.classList.add('hover'); showTooltip(id, mouseScreen.x, mouseScreen.y); }
    } else {
      if (hoveredSeat) { updateSeatVisual(hoveredSeat); hoveredSeat = null; }
      cursor.classList.remove('hover');
      hideTooltip();
    }
  }

    if (mats.screenGlow) {
    mats.screenGlow.emissiveIntensity = 1.1 + Math.sin(animFrame * 0.02) * 0.1;
  }
 
  renderer.render(scene, camera);
}