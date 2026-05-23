const MAX_SEATS  = 6;
const SEAT_PRICE = 450;
let selected     = new Set();
let hoveredSeat  = null;
let currentView  = 'audience';
let isDragging   = false;
let prevMouse    = { x: 0, y: 0 };
let phi = Math.PI / 2.2, theta = Math.PI, radius = 14;
let targetPhi = phi, targetTheta = theta, targetRadius = radius;
let autoRotate      = false;
let autoRotateSpeed = 0;

const ROWS = ['A', 'B', 'C', 'D', 'E'];
const ROW_CONFIGS = {
  A: { seats: [1, 2, null, 3, 4, null, 5, 6] },
  B: { seats: [1, 2, 3, null, 4, 5, 6, null, 7] },
  C: { seats: [1, 2, 3, 4, 5, null, 6, 7, null, 8] },
  D: { seats: [1, 2, 3, null, 4, 5, 6, 7, null, 8, 9] },
  E: { seats: [1, 2, 3, 4, 5, 6, 7] },
};
const TAKEN_SEATS = new Set(['A3', 'A5', 'B2', 'B6', 'C1', 'C4', 'D3', 'D7', 'E4']);
const HOLD_SEATS  = new Set(['A1', 'C2', 'E3']);
 
// Build seat data map
const seatData = {};
ROWS.forEach((row, ri) => {
  const cfg = ROW_CONFIGS[row];
  cfg.seats.forEach(s => {
    if (s === null) return;
    const id = `${row}${s}`;
    let status = 'vip';
    if (TAKEN_SEATS.has(id)) status = 'taken';
    else if (HOLD_SEATS.has(id)) status = 'hold';
    seatData[id] = { row, num: s, status, rowIndex: ri };
  });
});

const canvas   = document.getElementById('cinema-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled  = true;
renderer.shadowMap.type     = THREE.PCFSoftShadowMap;
renderer.toneMapping        = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;
 
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080408);
scene.fog        = new THREE.FogExp2(0x0a0608, 0.028);
 
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 200);
 
const VIEWS = {
  audience: { phi: Math.PI / 2.1, theta: Math.PI,        radius: 13 },
  top:      { phi: 0.4,           theta: Math.PI,        radius: 20 },
  fly:      { phi: Math.PI / 2.5, theta: Math.PI * 0.85, radius: 16 },
};
 
function updateCamera() {
  const x = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);
  camera.position.set(x, y + 2, z);
  camera.lookAt(0, 1, -2);
}

const materials = {
  screen:       new THREE.MeshStandardMaterial({ color: 0x1a4a7a, emissive: 0x0a2a4a, roughness: 0.1, metalness: 0.05 }),
  screenGlow:   new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x8bbfe0, emissiveIntensity: 1.2, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.97 }),
  wall:         new THREE.MeshStandardMaterial({ color: 0x1a0d12, roughness: 0.9, metalness: 0.1 }),
  floor:        new THREE.MeshStandardMaterial({ color: 0x0d0810, roughness: 0.95, metalness: 0.0 }),
  ceiling:      new THREE.MeshStandardMaterial({ color: 0x120a10, roughness: 1, metalness: 0 }),
  gold:         new THREE.MeshStandardMaterial({ color: 0xc9a84c, roughness: 0.2, metalness: 0.9, emissive: 0x2a1800, emissiveIntensity: 0.3 }),
  curtain:      new THREE.MeshStandardMaterial({ color: 0x5a0a14, roughness: 0.95, metalness: 0.0 }),
  seatVip:      new THREE.MeshStandardMaterial({ color: 0x7a1a28, roughness: 0.88, metalness: 0.0, emissive: 0x2a0008, emissiveIntensity: 0.35 }),
  seatSelected: new THREE.MeshStandardMaterial({ color: 0xd4a017, roughness: 0.25, metalness: 0.5, emissive: 0x8a5000, emissiveIntensity: 0.8 }),
  seatHold:     new THREE.MeshStandardMaterial({ color: 0x3a4a1a, roughness: 0.88, metalness: 0.0, emissive: 0x0a1000, emissiveIntensity: 0.2 }),
  seatTaken:    new THREE.MeshStandardMaterial({ color: 0x110909, roughness: 0.95, metalness: 0.05 }),
  seatHover:    new THREE.MeshStandardMaterial({ color: 0xe8c060, roughness: 0.2, metalness: 0.5, emissive: 0x7a5000, emissiveIntensity: 0.7 }),
  carpet:       new THREE.MeshStandardMaterial({ color: 0x3a0a1a, roughness: 1, metalness: 0 }),
};

function buildRoom() {
  const W = 22, H = 10, D = 28;

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), materials.floor);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

    const carpet = new THREE.Mesh(new THREE.PlaneGeometry(1.2, D * 0.6), materials.carpet);
  carpet.rotation.x = -Math.PI / 2;
  carpet.position.set(0, 0.01, 2);
  scene.add(carpet);

    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), materials.ceiling);
  ceil.rotation.x = Math.PI / 2;
  ceil.position.y = H;
  scene.add(ceil);
 
    const bwall = new THREE.Mesh(new THREE.PlaneGeometry(W, H), materials.wall);
  bwall.position.set(0, H / 2, D / 2);
  bwall.rotation.y = Math.PI;
  scene.add(bwall);
 
  [-1, 1].forEach(side => {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(D, H), materials.wall);
    w.position.set(side * W / 2, H / 2, 0);
    w.rotation.y = side * -Math.PI / 2;
    scene.add(w);
  });

    const swall = new THREE.Mesh(new THREE.PlaneGeometry(W, H), materials.wall);
  swall.position.set(0, H / 2, -D / 2);
  scene.add(swall);

    const frame = new THREE.Mesh(new THREE.BoxGeometry(13, 7.5, 0.2), materials.gold);
  frame.position.set(0, 5, -D / 2 + 0.25);
  scene.add(frame);

    const screen = new THREE.Mesh(new THREE.PlaneGeometry(12.2, 6.8), materials.screenGlow);
  screen.position.set(0, 5, -D / 2 + 0.36);
  scene.add(screen);

   const stCanvas = document.createElement('canvas');
  stCanvas.width = 1024; stCanvas.height = 576;
  const ctx = stCanvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 576);
  grad.addColorStop(0, '#0a2a4a');
  grad.addColorStop(1, '#05162a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 576);
  for (let i = 0; i < 200; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5 + 0.1})`;
    ctx.beginPath();
    ctx.arc(Math.random() * 1024, Math.random() * 576, Math.random() * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#c9a84c';
  ctx.fillRect(0, 48, 1024, 3);
  ctx.fillRect(0, 525, 1024, 3);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 110px serif';
  ctx.shadowColor = '#aad4ff';
  ctx.shadowBlur = 30;
  ctx.fillText('NOW SHOWING', 512, 310);
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(200,220,255,0.7)';
  ctx.font = '300 28px serif';
  ctx.fillText('VIP EXPERIENCE', 512, 375);
  ctx.fillStyle = 'rgba(201,168,76,0.5)';
  ctx.font = '18px serif';
  ctx.fillText('• SELECT YOUR SEAT BELOW •', 512, 500);
 
  const sTex = new THREE.CanvasTexture(stCanvas);
  const screenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 6.7),
    new THREE.MeshBasicMaterial({ map: sTex })
  );
  screenMesh.position.set(0, 5, -D / 2 + 0.4);
  scene.add(screenMesh);

   const screenLight = new THREE.RectAreaLight(0x4488cc, 3, 12, 7);
  screenLight.position.set(0, 5, -D / 2 + 1);
  screenLight.lookAt(0, 3, 0);
  scene.add(screenLight);

    const rail = new THREE.Mesh(new THREE.BoxGeometry(14, 0.12, 0.3), materials.gold);
  rail.position.set(0, 1.4, -D / 2 + 0.3);
  scene.add(rail);

    [-1, 1].forEach(side => {
    const c = new THREE.Mesh(new THREE.BoxGeometry(2.5, 8, 0.3), materials.curtain);
    c.position.set(side * 7.2, 4.5, -D / 2 + 0.3);
    scene.add(c);
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.12, 8, 0.4), materials.gold);
    trim.position.set(side * 5.95, 4.5, -D / 2 + 0.3);
    scene.add(trim);
  });

   [-1, 1].forEach(side => {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, D), materials.gold);
    strip.position.set(side * (W / 2 - 0.05), 1.5, 0);
    scene.add(strip);
    const strip2 = strip.clone();
    strip2.position.y = H - 0.5;
    scene.add(strip2);
  });
 