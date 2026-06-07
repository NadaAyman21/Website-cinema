const backendMoviePosterPath = document.getElementById('movie-poster-data')?.value;

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

const seatData = {};
ROWS.forEach((row, ri) => {
  const cfg = ROW_CONFIGS[row];
  cfg.seats.forEach(s => {
    if (s === null) return;
    const id = `${row}${s}`;
    seatData[id] = { row, num: s, status: 'vip', rowIndex: ri };
  });
});

const canvas   = document.getElementById('cinema-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled   = true;
renderer.shadowMap.type      = THREE.PCFSoftShadowMap;
renderer.toneMapping         = THREE.ACESFilmicToneMapping;
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

const movieInfo = {
  movie:    localStorage.getItem('selectedMovie')    || 'Unknown',
  showtime: localStorage.getItem('selectedTime')     || 'Unknown',
  date:     localStorage.getItem('selectedDateText') || 'Unknown',
};

const materials = {
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

  let screenTexturingMaterial;

  if (backendMoviePosterPath && backendMoviePosterPath.trim() !== "") {
    let cleanPath = backendMoviePosterPath.trim();
    
    if (!cleanPath.startsWith('/') && !cleanPath.startsWith('http')) {
        cleanPath = '/' + cleanPath;
    }

    console.log("Three.js VIP Engine loading texture from path:", cleanPath);

    const projectTextureLoader = new THREE.TextureLoader();
    const dynamicMovieImageTexture = projectTextureLoader.load(cleanPath);
    
    dynamicMovieImageTexture.wrapS = THREE.ClampToEdgeWrapping;
    dynamicMovieImageTexture.wrapT = THREE.ClampToEdgeWrapping;
    dynamicMovieImageTexture.minFilter = THREE.LinearFilter;

    screenTexturingMaterial = new THREE.MeshBasicMaterial({ 
      map: dynamicMovieImageTexture,
      side: THREE.DoubleSide
    });
  } else {
    // Canvas Text engine fallback layout block if database field is missing
    const backupScreenCanvasTexture = new THREE.CanvasTexture(stCanvas);
    screenTexturingMaterial = new THREE.MeshBasicMaterial({ 
      map: backupScreenCanvasTexture,
      side: THREE.DoubleSide
    });
  }

  const screenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 6.7),
    screenTexturingMaterial
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
    const cfg        = ROW_CONFIGS[row];
    const seats      = cfg.seats.filter(s => s !== null);
    const totalWidth = (seats.length - 1) * SEAT_X_STEP;

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
      cushion.castShadow = true;
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

      const plinth = new THREE.Mesh(
        new THREE.BoxGeometry(SEAT_W + 0.06, 0.1, SEAT_D * 0.9),
        new THREE.MeshStandardMaterial({ color: 0x1a0e0e, roughness: 0.8, metalness: 0.2 })
      );
      plinth.position.set(x, y + 0.05, z - 0.04);
      group.add(plinth);

      const railF = new THREE.Mesh(new THREE.BoxGeometry(SEAT_W + 0.1, 0.04, 0.04), materials.gold);
      railF.position.set(x, y + 0.1, z - SEAT_D * 0.45);
      group.add(railF);
      const railB = railF.clone();
      railB.position.set(x, y + 0.1, z + SEAT_D * 0.45);
      group.add(railB);

      [-1, 1].forEach(side => {
        const armBody = new THREE.Mesh(
          new THREE.BoxGeometry(0.13, 0.52, SEAT_D * 0.88),
          new THREE.MeshStandardMaterial({ color: 0x120a0a, roughness: 0.7, metalness: 0.3 })
        );
        armBody.position.set(x + side * (SEAT_W / 2 + 0.065), y + 0.35, z - 0.04);
        group.add(armBody);

        const armTop = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.07, SEAT_D * 0.78), baseMat.clone());
        armTop.position.set(x + side * (SEAT_W / 2 + 0.065), y + 0.62, z - 0.04);
        group.add(armTop);

        const trim = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.02, SEAT_D * 0.88), materials.gold);
        trim.position.set(x + side * (SEAT_W / 2 + 0.065), y + 0.09, z - 0.04);
        group.add(trim);

        const cupRim = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.04, 16), materials.gold);
        cupRim.position.set(x + side * (SEAT_W / 2 + 0.065), y + 0.66, z + SEAT_D * 0.28);
        group.add(cupRim);

        const cupHole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.055, 0.055, 0.06, 16),
          new THREE.MeshStandardMaterial({ color: 0x080404, roughness: 1 })
        );
        cupHole.position.set(x + side * (SEAT_W / 2 + 0.065), y + 0.64, z + SEAT_D * 0.28);
        group.add(cupHole);
      });

      const foot = new THREE.Mesh(new THREE.BoxGeometry(SEAT_W - 0.1, 0.09, 0.25), baseMat.clone());
      foot.position.set(x, y + 0.27, z - SEAT_D * 0.52);
      group.add(foot);

      const footRail = new THREE.Mesh(new THREE.BoxGeometry(SEAT_W, 0.03, 0.03), materials.gold);
      footRail.position.set(x, y + 0.32, z - SEAT_D * 0.64);
      group.add(footRail);

      const badge = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.02), materials.gold);
      badge.position.set(x, y + 0.75, z + SEAT_D / 2 - 0.02);
      group.add(badge);

      group.userData = { seatId: id, status: data.status };
      seatGroup.add(group);
      seatMeshes[id] = group;
      seatIndex++;
    });
  });
}

function getMat(status) {
  if (status === 'taken') return materials.seatTaken;
  if (status === 'hold')  return materials.seatHold;
  return materials.seatVip;
}

function updateSeatVisual(id) {
  const mesh = seatMeshes[id];
  if (!mesh) return;
  const data = seatData[id];
  let mat;
  if      (data.status === 'taken') mat = materials.seatTaken;
  else if (data.status === 'hold')  mat = materials.seatHold;
  else if (selected.has(id))        mat = materials.seatSelected;
  else if (hoveredSeat === id)      mat = materials.seatHover;
  else                              mat = materials.seatVip;
  mesh.children.forEach(c => { if (c.material && c.material !== materials.gold) c.material = mat; });
}

function toggleSeat(id) {
  const data = seatData[id];
  if (!data || data.status === 'taken' || data.status === 'hold') return;
  if (selected.has(id)) {
    selected.delete(id);
  } else {
    if (selected.size >= MAX_SEATS) { flashMax(); return; }
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

function buildLights() {
  scene.add(new THREE.AmbientLight(0x1a1020, 0.8));
  scene.add(new THREE.HemisphereLight(0x1a1030, 0x0a0510, 0.5));

  const dir = new THREE.DirectionalLight(0xffe8c0, 0.6);
  dir.position.set(5, 15, 10);
  dir.castShadow = true;
  dir.shadow.mapSize.set(2048, 2048);
  scene.add(dir);

  const spot = new THREE.SpotLight(0xffd080, 1.5, 30, Math.PI / 5, 0.4);
  spot.position.set(0, 9, 2);
  spot.target.position.set(0, 4, -12);
  scene.add(spot);
  scene.add(spot.target);
}

const raycaster     = new THREE.Raycaster();
const mouse         = new THREE.Vector2(-9999, -9999);
let   mouseScreen   = { x: 0, y: 0 };
const allSeatMeshes = [];

function refreshPickable() {
  allSeatMeshes.length = 0;
  Object.values(seatMeshes).forEach(g => g.children.forEach(c => allSeatMeshes.push(c)));
}

function getSeatIdFromObject(obj) {
  if (!obj) return null;
  if (obj.parent && obj.parent.userData.seatId) return obj.parent.userData.seatId;
  if (obj.userData.seatId) return obj.userData.seatId;
  return null;
}

const cursorEl = document.getElementById('cursor');

document.addEventListener('mousemove', e => {
  mouseScreen = { x: e.clientX, y: e.clientY };
  cursorEl.style.left = e.clientX + 'px';
  cursorEl.style.top  = e.clientY + 'px';
  mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  if (isDragging) {
    const dx = e.clientX - prevMouse.x;
    const dy = e.clientY - prevMouse.y;
    targetTheta -= dx * 0.005;
    targetPhi = Math.max(0.2, Math.min(Math.PI / 1.5, targetPhi + dy * 0.005));
    prevMouse = { x: e.clientX, y: e.clientY };
  }
});

document.addEventListener('mousedown', e => {
  if (e.target.closest('#topbar') || e.target.closest('#seat-panel') || e.target.closest('#confirm-modal')) return;
  isDragging = true;
  prevMouse  = { x: e.clientX, y: e.clientY };
  autoRotate = false;
});

document.addEventListener('mouseup', e => {
  if (isDragging && Math.abs(e.clientX - prevMouse.x) < 3 && Math.abs(e.clientY - prevMouse.y) < 3) {
    if (hoveredSeat) toggleSeat(hoveredSeat);
  }
  isDragging = false;
});

document.addEventListener('wheel', e => {
  targetRadius = Math.max(5, Math.min(25, targetRadius + e.deltaY * 0.02));
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
  targetPhi = Math.max(0.2, Math.min(Math.PI / 1.5, targetPhi + dy * 0.006));
  prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
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


function updateUI() {
  const count = selected.size;
  document.getElementById('sel-count').textContent = count;
  document.getElementById('book-btn').disabled = count === 0;

  const tagsEl = document.getElementById('seat-tags');
  tagsEl.innerHTML = '';
  Array.from(selected).sort().forEach(id => {
    const tag       = document.createElement('div');
    tag.className   = 'seat-tag';
    tag.textContent = id;
    tagsEl.appendChild(tag);
  });
  fetch('/reservation/hold', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      movie:    movieInfo.movie,
      showtime: movieInfo.showtime,
      date:     movieInfo.date,
      hall:     'VIP',
      seats:    JSON.stringify(Array.from(selected))
    })
  });
}

function openConfirm() {
  if (selected.size === 0) return;
  const seatsEl = document.getElementById('modal-seats');
  const priceEl = document.getElementById('modal-price');
  seatsEl.innerHTML = '';
  Array.from(selected).sort().forEach(id => {
    const el       = document.createElement('div');
    el.className   = 'modal-seat-tag';
    el.textContent = id;
    seatsEl.appendChild(el);
  });
  priceEl.textContent = `EGP ${selected.size * SEAT_PRICE}`;
  const modalSubEl = document.getElementById('modal-sub');
  if (modalSubEl) {
    modalSubEl.textContent = `VIP Screening · ${movieInfo.date} · ${movieInfo.showtime}`;
  }
  document.getElementById('confirm-modal').classList.add('show');
  if (modal) {
    modal.classList.remove('show');
    modal.style.display = "none"; 
  }
}

function confirmBook() {
  localStorage.setItem('bookedSeats', JSON.stringify(Array.from(selected).sort()));
  localStorage.setItem('totalPrice', selected.size * SEAT_PRICE);
  localStorage.setItem('hallType', 'VIP');
  window.location.href = '/orderSum';
}

function setView(v, e) {
  currentView = v;
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  if (e && e.target) e.target.classList.add('active');
  const vd = VIEWS[v];
  autoRotate      = v === 'fly';
  autoRotateSpeed = v === 'fly' ? 0.003 : 0;
  targetPhi    = vd.phi;
  targetTheta  = vd.theta;
  targetRadius = vd.radius;
}

const tooltip = document.getElementById('tooltip');

function showTooltip(id, x, y) {
  const data = seatData[id];
  if (!data) return;
  document.getElementById('tip-seat').textContent  = `Seat ${id}`;
  document.getElementById('tip-price').textContent =
    data.status === 'taken' ? '—' : `EGP ${SEAT_PRICE}`;
  document.getElementById('tip-status').textContent =
    data.status === 'taken' ? 'Unavailable' :
    data.status === 'hold'  ? 'On Hold' :
    selected.has(id)        ? 'Selected — click to deselect' : 'Click to select';
  tooltip.style.display = 'block';
  tooltip.style.left    = x + 'px';
  tooltip.style.top     = y + 'px';
}

function hideTooltip() {
  tooltip.style.display = 'none';
}



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
      const id = getSeatIdFromObject(hits[0].object);
      if (id && id !== hoveredSeat) {
        if (hoveredSeat) updateSeatVisual(hoveredSeat);
        hoveredSeat = id;
        if (!selected.has(id) && seatData[id].status === 'vip') updateSeatVisual(id);
      }
      if (id) { cursorEl.classList.add('hover'); showTooltip(id, mouseScreen.x, mouseScreen.y); }
    } else {
      if (hoveredSeat) { updateSeatVisual(hoveredSeat); hoveredSeat = null; }
      cursorEl.classList.remove('hover');
      hideTooltip();
    }
  }

  materials.screenGlow.emissiveIntensity = 1.1 + Math.sin(animFrame * 0.02) * 0.1;
  renderer.render(scene, camera);
}

async function fetchAndApplySeats() {
  try {
    const params = new URLSearchParams({
      movie:    movieInfo.movie,
      showtime: movieInfo.showtime,
      date:     movieInfo.date,
      hall:     'VIP'
    });

    const res  = await fetch(`/reservation/seats?${params}`, { credentials: 'include' });
    const data = await res.json();

    (data.taken || []).forEach(id => {
      if (seatData[id]) seatData[id].status = 'taken';
    });
    (data.hold || []).forEach(id => {
      if (seatData[id] && seatData[id].status !== 'taken') seatData[id].status = 'hold';
    });

    Object.keys(seatMeshes).forEach(id => updateSeatVisual(id));
  } catch (err) {
    console.error('Failed to fetch VIP seat data:', err);
  }
}

async function init() {
  buildRoom();
  buildLights();
  buildSeats();
  updateCamera();
  refreshPickable();
  await fetchAndApplySeats();
  animate();
}

init();

setTimeout(() => {
  document.getElementById('loader').classList.add('hidden');
  setTimeout(() => {
    document.getElementById('instructions').style.opacity = '0.7';
  }, 500);
}, 2000);

function closeConfirm() {
    const modal = document.getElementById("confirm-modal");
    if (modal) {
      modal.classList.remove('show');
        modal.style.display = "none"; 
    }
}