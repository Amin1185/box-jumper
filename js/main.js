const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const BOX_WIDTH = 50;
const BOX_HEIGHT = 50;
const BOX_DIAGONAL = Math.sqrt(BOX_WIDTH ** 2, BOX_HEIGHT ** 2);

let vy = 0;
const GRAVITY = 0.6;
const JUMP_FORCE = -15;
let isOnGround = true;

let boxX = (GAME_WIDTH - BOX_WIDTH) / 2;
let boxY = GAME_HEIGHT - BOX_HEIGHT;
const MOVE_SPEED = 5;

let rotation = 0;
let isRotating = false;
let spinDirection = 1;
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
    rotation += spinDirection * ROTATION_SPEED;
    
    if ((spinDirection === 1 && rotation >= Math.PI) || (spinDirection === -1 && rotation <= -Math.PI)) {
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

gameLoop();
