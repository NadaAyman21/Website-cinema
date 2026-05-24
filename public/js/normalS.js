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