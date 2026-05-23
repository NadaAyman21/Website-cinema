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