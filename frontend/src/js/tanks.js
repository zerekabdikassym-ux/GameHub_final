
const arena = document.getElementById('arena');

function getWH() {
  const r = arena.getBoundingClientRect();
  return {W: Math.floor(r.width), H: Math.floor(r.height)};
}

function createTank(x, y, cls, direction) {
  const t = document.createElement('div');
  t.className = 'tank ' + (cls || '');
  t.style.left = x + 'px';
  t.style.top = y + 'px';
  
  
  const body = document.createElement('div');
  body.className = 'tank-body';
  t.appendChild(body);
  
  
  const barrel = document.createElement('div');
  barrel.className = 'tank-barrel';
  t.appendChild(barrel);
  
  arena.appendChild(t);
  return {el: t, barrel, direction: direction || 'right'};
}

let tank1, tank2;

const state = {
  t1: {x: 50, y: 0, vx: 0, vy: 0, lastShot: 0, direction: 'right'},
  t2: {x: 0, y: 0, vx: 0, vy: 0, lastShot: 0, direction: 'left'},
  bullets: [],
  walls: [],
  gameOver: false
};

const FIRE_RATE = 180; 
const TANK_SIZE = 40;

function clamp(v, a, b) { 
  return Math.max(a, Math.min(b, v)); 
}

function rectsIntersect(ax, ay, aw, ah, bx, by, bw, bh) {
  return !(ax + aw <= bx || bx + bw <= ax || ay + ah <= by || by + bh <= ay);
}

function getDirectionAngle(dir) {
  const angles = {
    'right': 0,
    'down': 90,
    'left': 180,
    'up': 270
  };
  return angles[dir] || 0;
}

function updateTankDirection(tank, state) {
  if (!tank || !tank.barrel) return;
  
  
  if (state.vx > 0) state.direction = 'right';
  else if (state.vx < 0) state.direction = 'left';
  else if (state.vy > 0) state.direction = 'down';
  else if (state.vy < 0) state.direction = 'up';
  
  
  const angle = getDirectionAngle(state.direction);
  tank.barrel.style.transform = `rotate(${angle}deg)`;
}

function spawnBullet(x, y, dx, dy) {
  const b = document.createElement('div');
  b.className = 'bullet';
  b.style.left = x + 'px';
  b.style.top = y + 'px';
  arena.appendChild(b);
  state.bullets.push({el: b, x, y, dx, dy});
}

function clearWalls() {
  state.walls.forEach(w => w.el.remove());
  state.walls = [];
}

function createWallsRandom(count) {
  clearWalls();
  const {W, H} = getWH();
  const minSize = Math.floor(Math.min(W, H) * 0.06);
  const maxSize = Math.floor(Math.min(W, H) * 0.22);

  let tries = 0;
  while (state.walls.length < count && tries < count * 50) {
    tries++;
    const w = Math.floor(Math.random() * (maxSize - minSize)) + minSize;
    const h = Math.floor(Math.random() * (maxSize - minSize)) + minSize;
    const x = Math.floor(Math.random() * (W - w - 20)) + 10;
    const y = Math.floor(Math.random() * (H - h - 20)) + 10;

    const margin = 80;
    const t1start = {x: 50, y: Math.floor(H / 2 - 20)};
    const t2start = {x: W - 90, y: Math.floor(H / 2 - 20)};
    if (rectsIntersect(x, y, w, h, t1start.x - margin, t1start.y - margin, 100 + margin * 2, 100 + margin * 2)) continue;
    if (rectsIntersect(x, y, w, h, t2start.x - margin, t2start.y - margin, 100 + margin * 2, 100 + margin * 2)) continue;

    let overlap = false;
    for (const other of state.walls) {
      if (rectsIntersect(x, y, w, h, other.x, other.y, other.w, other.h)) {
        overlap = true;
        break;
      }
    }
    if (overlap) continue;

    const el = document.createElement('div');
    el.className = 'wall';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.width = w + 'px';
    el.style.height = h + 'px';
    arena.appendChild(el);

    state.walls.push({x, y, w, h, el});
  }
}


const codes = {};
document.addEventListener('keydown', (e) => {
  codes[e.code] = true;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
    e.preventDefault();
  }
});
document.addEventListener('keyup', (e) => {
  codes[e.code] = false;
});


const mobileControls = {
  p1: {up: false, down: false, left: false, right: false, shoot: false},
  p2: {up: false, down: false, left: false, right: false, shoot: false}
};

function setupMobileControls() {
  
  ['up', 'down', 'left', 'right', 'shoot'].forEach(dir => {
    const btn = document.getElementById(`p1-${dir}`);
    if (btn) {
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        mobileControls.p1[dir] = true;
      });
      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        mobileControls.p1[dir] = false;
      });
      
      btn.addEventListener('mousedown', () => mobileControls.p1[dir] = true);
      btn.addEventListener('mouseup', () => mobileControls.p1[dir] = false);
      btn.addEventListener('mouseleave', () => mobileControls.p1[dir] = false);
    }
  });

  
  ['up', 'down', 'left', 'right', 'shoot'].forEach(dir => {
    const btn = document.getElementById(`p2-${dir}`);
    if (btn) {
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        mobileControls.p2[dir] = true;
      });
      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        mobileControls.p2[dir] = false;
      });
      btn.addEventListener('mousedown', () => mobileControls.p2[dir] = true);
      btn.addEventListener('mouseup', () => mobileControls.p2[dir] = false);
      btn.addEventListener('mouseleave', () => mobileControls.p2[dir] = false);
    }
  });
}

function processInput(now) {
  
  if (state.gameOver) return;
  
  
  state.t1.vx = 0;
  state.t1.vy = 0;
  if (codes['KeyW'] || mobileControls.p1.up) state.t1.vy = -3;
  if (codes['KeyS'] || mobileControls.p1.down) state.t1.vy = 3;
  if (codes['KeyA'] || mobileControls.p1.left) state.t1.vx = -3;
  if (codes['KeyD'] || mobileControls.p1.right) state.t1.vx = 3;

  
  state.t2.vx = 0;
  state.t2.vy = 0;
  if (codes['ArrowUp'] || mobileControls.p2.up) state.t2.vy = -3;
  if (codes['ArrowDown'] || mobileControls.p2.down) state.t2.vy = 3;
  if (codes['ArrowLeft'] || mobileControls.p2.left) state.t2.vx = -3;
  if (codes['ArrowRight'] || mobileControls.p2.right) state.t2.vx = 3;

  
  updateTankDirection(tank1, state.t1);
  updateTankDirection(tank2, state.t2);

  
  if (codes['KeyG'] || mobileControls.p1.shoot) {
    if (now - state.t1.lastShot >= FIRE_RATE) {
      const {dx, dy} = getDirectionOffset(state.t1.direction);
      
      const spawnX = state.t1.x + TANK_SIZE / 2 + dx * 30;
      const spawnY = state.t1.y + TANK_SIZE / 2 + dy * 30;
      spawnBullet(spawnX, spawnY, dx * 9, dy * 9);
      state.t1.lastShot = now;
    }
  }
  if (codes['Slash'] || codes['NumpadDivide'] || codes['Period'] || mobileControls.p2.shoot) {
    if (now - state.t2.lastShot >= FIRE_RATE) {
      const {dx, dy} = getDirectionOffset(state.t2.direction);
      
      const spawnX = state.t2.x + TANK_SIZE / 2 + dx * 30;
      const spawnY = state.t2.y + TANK_SIZE / 2 + dy * 30;
      spawnBullet(spawnX, spawnY, dx * 9, dy * 9);
      state.t2.lastShot = now;
    }
  }
}

function getDirectionOffset(direction) {
  const offsets = {
    'right': {dx: 1, dy: 0},
    'left': {dx: -1, dy: 0},
    'up': {dx: 0, dy: -1},
    'down': {dx: 0, dy: 1}
  };
  return offsets[direction] || {dx: 1, dy: 0};
}

function canMoveTo(tank, nx, ny) {
  const {W, H} = getWH();
  nx = clamp(nx, 0, W - TANK_SIZE);
  ny = clamp(ny, 0, H - TANK_SIZE);
  
  for (const w of state.walls) {
    if (rectsIntersect(nx, ny, TANK_SIZE, TANK_SIZE, w.x - 2, w.y - 2, w.w + 4, w.h + 4)) {
      return false;
    }
  }
  return true;
}

function update() {
  
  if (state.gameOver) return;
  
  const {W, H} = getWH();

  
  let newX1 = state.t1.x + state.t1.vx;
  let newY1 = state.t1.y + state.t1.vy;
  if (canMoveTo(state.t1, newX1, newY1)) {
    state.t1.x = clamp(newX1, 0, W - TANK_SIZE);
    state.t1.y = clamp(newY1, 0, H - TANK_SIZE);
  } else {
    if (canMoveTo(state.t1, state.t1.x + state.t1.vx, state.t1.y)) state.t1.x += state.t1.vx;
    if (canMoveTo(state.t1, state.t1.x, state.t1.y + state.t1.vy)) state.t1.y += state.t1.vy;
  }

  
  let newX2 = state.t2.x + state.t2.vx;
  let newY2 = state.t2.y + state.t2.vy;
  if (canMoveTo(state.t2, newX2, newY2)) {
    state.t2.x = clamp(newX2, 0, W - TANK_SIZE);
    state.t2.y = clamp(newY2, 0, H - TANK_SIZE);
  } else {
    if (canMoveTo(state.t2, state.t2.x + state.t2.vx, state.t2.y)) state.t2.x += state.t2.vx;
    if (canMoveTo(state.t2, state.t2.x, state.t2.y + state.t2.vy)) state.t2.y += state.t2.vy;
  }

  
  if (tank1 && tank1.el) {
    tank1.el.style.left = state.t1.x + 'px';
    tank1.el.style.top = state.t1.y + 'px';
  }
  if (tank2 && tank2.el) {
    tank2.el.style.left = state.t2.x + 'px';
    tank2.el.style.top = state.t2.y + 'px';
  }

  
  for (let i = state.bullets.length - 1; i >= 0; i--) {
    const b = state.bullets[i];
    b.x += b.dx;
    b.y += b.dy;
    b.el.style.left = b.x + 'px';
    b.el.style.top = b.y + 'px';

    
    if (b.x < -50 || b.x > W + 50 || b.y < -50 || b.y > H + 50) {
      b.el.remove();
      state.bullets.splice(i, 1);
      continue;
    }

    
    let hitWall = false;
    for (const w of state.walls) {
      if (rectsIntersect(b.x, b.y, 10, 10, w.x, w.y, w.w, w.h)) {
        b.el.remove();
        state.bullets.splice(i, 1);
        hitWall = true;
        break;
      }
    }
    if (hitWall) continue;

    
    if (rectsIntersect(b.x, b.y, 10, 10, state.t1.x, state.t1.y, TANK_SIZE, TANK_SIZE)) {
      state.gameOver = true;
      b.el.remove();
      state.bullets.splice(i, 1);
      setTimeout(() => {
        alert('🟢 Player 2 Wins! 🎉');
        submitScore('tanks', 50); // award winner points
        resetArena();
      }, 100);
      return;
    }
    if (rectsIntersect(b.x, b.y, 10, 10, state.t2.x, state.t2.y, TANK_SIZE, TANK_SIZE)) {
      state.gameOver = true;
      b.el.remove();
      state.bullets.splice(i, 1);
      setTimeout(() => {
        alert('🔴 Player 1 Wins! 🎉');
        submitScore('tanks', 50); // award winner points
        resetArena();
      }, 100);
      return;
    }
  }
}

function loop(ts) {
  const now = ts || Date.now();
  processInput(now);
  update();
  requestAnimationFrame(loop);
}

function resetArena() {
  
  state.gameOver = false;
  
  
  state.bullets.forEach(b => b.el.remove());
  state.bullets = [];
  
  
  arena.querySelectorAll('.tank').forEach(n => n.remove());
  clearWalls();

  const {W, H} = getWH();
  
  
  tank1 = createTank(50, Math.floor(H / 2 - 20), '', 'right');
  tank2 = createTank(Math.floor(W - 90), Math.floor(H / 2 - 20), 'player2', 'left');
  
  state.t1.x = 50;
  state.t1.y = Math.floor(H / 2 - 20);
  state.t1.vx = 0;
  state.t1.vy = 0;
  state.t1.lastShot = 0;
  state.t1.direction = 'right';
  
  state.t2.x = Math.floor(W - 90);
  state.t2.y = Math.floor(H / 2 - 20);
  state.t2.vx = 0;
  state.t2.vy = 0;
  state.t2.lastShot = 0;
  state.t2.direction = 'left';

  
  updateTankDirection(tank1, state.t1);
  updateTankDirection(tank2, state.t2);

  
  const area = W * H;
  let count = 3;
  if (area > 800 * 400) count = 4;
  if (area > 1100 * 500) count = 6;
  createWallsRandom(count);
}

const resetBtn = document.getElementById('resetTanks');
if (resetBtn) resetBtn.addEventListener('click', resetArena);


setupMobileControls();
resetArena();
requestAnimationFrame(loop);
