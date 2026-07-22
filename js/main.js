const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const BOX_WIDTH = 50;
const BOX_HEIGHT = 50;
const BOX_DIAGONAL = Math.sqrt(BOX_WIDTH ** 2 + BOX_HEIGHT ** 2);

let vy = 0;
const GRAVITY = 2160;
const JUMP_FORCE = -900;
let isOnGround = true;

let boxX = (GAME_WIDTH - BOX_WIDTH) / 2;
let boxY = GAME_HEIGHT - BOX_HEIGHT;
const MOVE_SPEED = 300;

let rotation = 0;
let isRotating = false;
let spinDirection = 1;
const ROTATION_SPEED = 12;
const HEIGHT_THRESHOLD = BOX_DIAGONAL;
let lastTime = null;

const keys = {};

function drawBox() {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  
  ctx.save();
  ctx.translate(boxX + BOX_WIDTH/2, boxY + BOX_HEIGHT/2);
  ctx.rotate(rotation);
  ctx.fillStyle = 'red';
  ctx.fillRect(-BOX_WIDTH/2, -BOX_HEIGHT/2, BOX_WIDTH, BOX_HEIGHT);
  ctx.restore();
}

function update(dt) {
  if (keys['a'] || keys['ArrowLeft']) {
    boxX = Math.max(0, boxX - (MOVE_SPEED * dt));
  }
  if (keys['d'] || keys['ArrowRight']) {
    boxX = Math.min(boxX + (MOVE_SPEED * dt), GAME_WIDTH - BOX_WIDTH);
  }

  if (keys[' '] || keys['Space'] || keys['ArrowUp']) {
    if (isOnGround) {
      vy = JUMP_FORCE;
      isOnGround = false;
    }
  }

  // Gravity pulls the box down each frame
  vy += GRAVITY * dt;
  boxY += vy * dt;

  if (boxY + BOX_HEIGHT >= GAME_HEIGHT) {
    boxY = GAME_HEIGHT - BOX_HEIGHT;
    vy = 0;
    isOnGround = true;
  }

  if (boxY < 0) {
    boxY = 0;
    vy = 0;
  }
  
  if (isRotating) {
    rotation += spinDirection * ROTATION_SPEED * dt;
    
    if ((spinDirection === 1 && rotation >= Math.PI) || (spinDirection === -1 && rotation <= -Math.PI)) {
      rotation = 0;
      isRotating = false;
    }
  }
}

function gameLoop(timestamp) {
  if (lastTime === null) lastTime = timestamp;
  let dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  update(dt);
  drawBox();
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  
  if (e.key.toLowerCase() === 'r' && !isOnGround && boxY < GAME_HEIGHT - BOX_HEIGHT - HEIGHT_THRESHOLD && !isRotating) {
    isRotating = true;

    if (keys['d'] || keys['ArrowRight']) {
      spinDirection = 1;
    } else if (keys['a'] || keys['ArrowLeft']) {
      spinDirection = -1;
    } else {
      spinDirection = 1;
    }
    e.preventDefault();
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault();
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault();
  }
});

function setKeyState(key, state) {
  keys[key] = state;
}

function triggerRotateAction() {
  if (!isOnGround && boxY < GAME_HEIGHT - BOX_HEIGHT - HEIGHT_THRESHOLD && !isRotating) {
    isRotating = true;
    if (keys['d'] || keys['ArrowRight']) {
      spinDirection = 1;
    } else if (keys['a'] || keys['ArrowLeft']) {
      spinDirection = -1;
    } else {
      spinDirection = 1;
    }
  }
}

function bindControlButton(buttonId, onActivate, onDeactivate) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  const press = (e) => {
    e.preventDefault(); 
    btn.classList.add('pressed');
    onActivate();
  };
  const release = (e) => {
    e.preventDefault();
    btn.classList.remove('pressed');
    onDeactivate();
  };

  btn.addEventListener('touchstart', press, { passive: false });
  btn.addEventListener('touchend', release, { passive: false });
  btn.addEventListener('touchcancel', release, { passive: false });

  btn.addEventListener('mousedown', press);
  btn.addEventListener('mouseup', release);
  btn.addEventListener('mouseleave', release);
}

bindControlButton('btnLeft', () => setKeyState('ArrowLeft', true), () => setKeyState('ArrowLeft', false));
bindControlButton('btnRight', () => setKeyState('ArrowRight', true), () => setKeyState('ArrowRight', false));
bindControlButton('btnJump', () => setKeyState(' ', true), () => setKeyState(' ', false));
bindControlButton('btnRotate', () => triggerRotateAction(), () => {});

requestAnimationFrame(gameLoop);