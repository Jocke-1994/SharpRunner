// --- GAME STATE ---
let currentTrack = null, pState = { x: 0, y: 0, prevX: 0, prevY: 0 }, player = { vx: 0, vy: 0, segIdx: 0, trail: [] };
let cam = { x: 0, y: 0, prevX: 0, prevY: 0 }, alive = false, started = false, paused = false, attempts = 1;
let lastTime = 0, accumulator = 0, dt = 1 / 144, currentProg = 0;
let zoom = 1, targetZoom = 1, prevZoom = 1;
let isPreviewing = false, previewTargetIdx = 0;
let shake = 0;
let gameStartTime = 0;
let flash = { active: false, color: '#fff', alpha: 0 };
let isTutorial = false;
let tutorialPhase = 0;
let tutorialPause = false;

let isJumping = false;
let jumpTime = 0;

const canvas = document.getElementById("c"), ctx = canvas.getContext("2d");

// --- EVENT LISTENERS ---
window.addEventListener("keydown", e => {
    if (document.getElementById('supportModal').style.display !== 'none') return;
    if (document.getElementById('authModal').style.display !== 'none') return;
    if (e.code === "Space") { e.preventDefault(); handleInput(); }
    if (e.code === "KeyP") togglePause();
});
canvas.addEventListener("pointerdown", e => { e.preventDefault(); AudioSfx.init(); handleInput(); });
canvas.addEventListener('contextmenu', e => { e.preventDefault(); return false; });
window.onresize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
window.onresize(); updateTexts(); updateLangUI();
initAuth();

// --- GAME LOOP ---
requestAnimationFrame(loop);
function loop(timestamp) {
    let frameTime = (timestamp - lastTime) / 1000; if (frameTime > 0.1) frameTime = 0.1; lastTime = timestamp;
    if (!paused) accumulator += frameTime; while (accumulator >= dt) { updatePhysics(); accumulator -= dt; }
    draw(accumulator / dt); requestAnimationFrame(loop);
}
