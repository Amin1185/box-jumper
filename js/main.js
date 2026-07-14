const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;

const BOX_WIDTH = 50;
const BOX_HEIGHT = 50;
const BOX_DIAGONAL = Math.sqrt(BOX_WIDTH ** 2, BOX_HEIGHT ** 2);

let vy = 0;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
let isOnGround = true;

let boxX = (GAME_WIDTH - BOX_WIDTH) / 2;
let boxY = GAME_HEIGHT - BOX_HEIGHT;
const MOVE_SPEED = 5;

let rotation = 0;
let isRotating = false;
const ROTATION_SPEED = 0.2;
const HEIGHT_THRESHOLD = BOX_DIAGONAL;

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

function update() {
  if (keys['a'] || keys['ArrowLeft']) {
    boxX = Math.max(0, boxX - MOVE_SPEED);
  }
  if (keys['d'] || keys['ArrowRight']) {
    boxX = Math.min(boxX + MOVE_SPEED, GAME_WIDTH - BOX_WIDTH);
  }

  if (keys[' '] || keys['Space'] || keys['ArrowUp']) {
    if (isOnGround) {
      vy = JUMP_FORCE;
      isOnGround = false;
    }
  }

  // Gravity pulls the box down each frame
  vy += GRAVITY;
  boxY += vy;

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
    rotation += ROTATION_SPEED;
    if (rotation >= 2 * Math.PI) {
      rotation = 0;
      isRotating = false;
    }
  }
}

function gameLoop() {
  update();
  drawBox();
  requestAnimationFrame(gameLoop);
}

function resizeCanvas() {
  // Use visual viewport for exact visible area; fallback to layout viewport
  const vp = window.visualViewport || { width: window.innerWidth, height: window.innerHeight };

  // Scale to fit both dimensions while preserving aspect ratio
  const scale = Math.min(
    vp.width / GAME_WIDTH,
    vp.height / GAME_HEIGHT
  );

  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;

  canvas.style.width = Math.floor(GAME_WIDTH * scale) + 'px';
  canvas.style.height = Math.floor(GAME_HEIGHT * scale) + 'px';
}

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  
  if (e.key.toLowerCase() === 'r' && !isOnGround && boxY < GAME_HEIGHT - BOX_HEIGHT - HEIGHT_THRESHOLD && !isRotating) {
    isRotating = true;
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

window.addEventListener('resize', resizeCanvas);
if (window.visualViewport) window.visualViewport.addEventListener('resize', resizeCanvas);
resizeCanvas();
gameLoop();
