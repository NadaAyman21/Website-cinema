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
 
    for (let i = 0; i < 5; i++) {
    const riser = new THREE.Mesh(new THREE.BoxGeometry(W - 2, 0.12, 0.3), materials.gold);
    riser.position.set(0, i * 0.3 + 0.05, -2 + i * 2.6);
    scene.add(riser);
  }

    for (let si = 0; si < 4; si++) {
    [-1, 1].forEach(side => {
      const sconce = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.6, 8), materials.gold);
      sconce.position.set(side * (W / 2 - 0.1), 3.5, -8 + si * 4);
      scene.add(sconce);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshStandardMaterial({ emissive: 0xffc060, emissiveIntensity: 2, color: 0xffc060 }));
      bulb.position.set(side * (W / 2 - 0.15), 3.7, -8 + si * 4);
      scene.add(bulb);
      const pl = new THREE.PointLight(0xffaa44, 0.6, 5);
      pl.position.copy(bulb.position);
      scene.add(pl);
    });
  }

    for (let ci = 0; ci < 6; ci++) {
    const light = new THREE.PointLight(0xffeecc, 0.4, 8);
    light.position.set(0, H - 0.3, -8 + ci * 3);
    scene.add(light);
    const fixture = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.1, 12), materials.gold);
    fixture.position.copy(light.position);
    fixture.position.y -= 0.1;
    scene.add(fixture);
  }
}

const seatMeshes = {};
const seatGroup  = new THREE.Group();
scene.add(seatGroup);
 
const SEAT_W      = 0.82;
const SEAT_H      = 0.9;
const SEAT_D      = 0.75;
const ROW_Z_START = -6.5;
const ROW_Z_STEP  = 2.5;
const SEAT_X_STEP = 1.1;
const ROW_Y_RISE  = 0.3;
 
function buildSeats() {
  ROWS.forEach((row, ri) => {
    const cfg       = ROW_CONFIGS[row];
    const seats     = cfg.seats.filter(s => s !== null);
    const totalSeats = seats.length;
    const totalWidth = (totalSeats - 1) * SEAT_X_STEP;
 
    let seatIndex = 0;
    cfg.seats.forEach(s => {
      if (s === null) { seatIndex++; return; }
      const id   = `${row}${s}`;
      const data = seatData[id];
      const x    = -totalWidth / 2 + seatIndex * SEAT_X_STEP;
      const z    = ROW_Z_START + ri * ROW_Z_STEP;
      const y    = ri * ROW_Y_RISE;
 
      const baseMat = getMat(data.status);
      const group   = new THREE.Group();
 
            const cushion = new THREE.Mesh(new THREE.BoxGeometry(SEAT_W, 0.18, SEAT_D * 0.85), baseMat.clone());
      cushion.position.set(x, y + 0.48, z - 0.04);
      cushion.castShadow = true; cushion.receiveShadow = true;
      group.add(cushion);

           const lip = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, SEAT_W, 12, 1, false, 0, Math.PI), baseMat.clone());
      lip.rotation.z = Math.PI / 2;
      lip.position.set(x, y + 0.43, z - SEAT_D * 0.85 / 2 - 0.04);
      group.add(lip);

            const back = new THREE.Mesh(new THREE.BoxGeometry(SEAT_W, SEAT_H * 1.15, 0.14), baseMat.clone());
      back.rotation.x = -0.10;
      back.position.set(x, y + 1.05, z + SEAT_D / 2 - 0.08);
      back.castShadow = true;
      group.add(back);
 
            const head = new THREE.Mesh(new THREE.BoxGeometry(SEAT_W * 0.7, 0.28, 0.16), baseMat.clone());
      head.rotation.x = -0.10;
      head.position.set(x, y + 1.68, z + SEAT_D / 2 - 0.06);
      group.add(head);

       [-1, 1].forEach(side => {
        const wing = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.14), baseMat.clone());
        wing.position.set(x + side * SEAT_W * 0.32, y + 1.68, z + SEAT_D / 2 - 0.06);
        group.add(wing);
      });
 
            const lumbar = new THREE.Mesh(new THREE.BoxGeometry(SEAT_W * 0.6, 0.18, 0.08), baseMat.clone());
      lumbar.rotation.x = -0.10;
      lumbar.position.set(x, y + 0.62, z + SEAT_D / 2 - 0.04);
      group.add(lumbar);
 