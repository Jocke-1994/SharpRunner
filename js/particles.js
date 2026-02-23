// --- PARTICLE SYSTEM ---
let particles = [];
function triggerWinCelebration(x, y) {
    particles.push({ type: 'shockwave', x: x, y: y, size: 10, maxSize: 500, alpha: 1, color: '#fff', speed: 25 });
    spawnExplosion(x, y, "#fff");
    let colors = ['#ff0044', '#00c853', '#2979ff', '#ffeb3b', '#d500f9'];
    let celebrationInterval = setInterval(() => {
        if (!document.getElementById('gameOverlay').classList.contains('hidden')) {
            for (let i = 0; i < 5; i++) {
                particles.push({ type: 'confetti', screenX: Math.random() * canvas.width, screenY: canvas.height + 10, vx: (Math.random() - 0.5) * 10, vy: -(Math.random() * 15 + 10), color: colors[Math.floor(Math.random() * colors.length)], size: Math.random() * 8 + 5, rotation: Math.random() * 360, rotSpeed: (Math.random() - 0.5) * 15, life: 1.0, gravity: 0.4 });
            }
        } else clearInterval(celebrationInterval);
    }, 50);
    setTimeout(() => clearInterval(celebrationInterval), 2000);
}
function spawnExplosion(x, y, color) {
    for (let i = 0; i < 40; i++) {
        const angle = (Math.PI * 2 * i) / 40; const speed = 5 + Math.random() * 15;
        particles.push({ x: x, y: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color: color, size: Math.random() * 6 + 3, rotation: Math.random() * 360, rotSpeed: (Math.random() - 0.5) * 20, type: 'explosion', life: 1.0, decay: 0.02 + Math.random() * 0.03 });
    }
}
function updateParticles() {
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        if (p.type === 'confetti') { p.screenX += p.vx; p.screenY += p.vy; p.rotation += p.rotSpeed; p.vy += p.gravity; p.life -= 0.005; if (p.screenY > canvas.height + 50 && p.vy > 0) p.life = 0; }
        else if (p.type === 'explosion') { p.x += p.vx; p.y += p.vy; p.vx *= 0.92; p.vy *= 0.92; p.life -= p.decay; p.size *= 0.95; }
        else if (p.type === 'shockwave') { p.size += p.speed; p.alpha -= 0.03; if (p.alpha <= 0) p.life = 0; else p.life = 1; }
        if (p.life <= 0) { particles.splice(i, 1); i--; }
    }
}
function drawParticles(ctx, camX, camY, zoom) {
    particles.forEach(p => {
        ctx.save();
        if (p.type === 'confetti') {
            ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(p.screenX, p.screenY); ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color; ctx.globalAlpha = p.life; ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else if (p.type === 'shockwave') {
            ctx.translate(p.x, p.y); ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI * 2); ctx.strokeStyle = p.color; ctx.lineWidth = 5; ctx.globalAlpha = p.alpha; ctx.stroke();
        } else {
            ctx.translate(p.x, p.y); ctx.rotate(p.rotation * Math.PI / 180); ctx.fillStyle = p.color; ctx.globalAlpha = p.life; ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }
        ctx.restore();
    });
}
