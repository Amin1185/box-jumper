const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;

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

window.addEventListener('resize', resizeCanvas);
if (window.visualViewport) window.visualViewport.addEventListener('resize', resizeCanvas);
resizeCanvas();
