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