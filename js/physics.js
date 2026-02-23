// Interpolerar exakt Y-position på banan för given X (används i obstacle-läge)
function getTrackYatX(track, targetX) {
    for (let i = 0; i < track.pts.length - 1; i++) {
        let p1 = track.pts[i];
        let p2 = track.pts[i + 1];
        if (targetX >= p1.x && targetX <= p2.x) {
            let t = (targetX - p1.x) / (p2.x - p1.x);
            return p1.y + t * (p2.y - p1.y);
        }
    }
    return track.pts[0].y;
}

function updatePhysics() {
    if (paused || tutorialPause) return;
    prevZoom = zoom; zoom += (targetZoom - zoom) * 0.05;
    if (shake > 0) shake *= 0.9; if (flash.alpha > 0) flash.alpha *= 0.9;
    if (isPreviewing) {
        let target = currentTrack.pts[previewTargetIdx]; let dx = target.x - cam.x; let dy = target.y - cam.y; let dist = Math.hypot(dx, dy);
        cam.prevX = cam.x; cam.prevY = cam.y; cam.x += dx * 0.08; cam.y += dy * 0.08;
        if (dist < 50) { previewTargetIdx++; if (previewTargetIdx >= currentTrack.pts.length) { isPreviewing = false; targetZoom = 0.8; document.getElementById('scoutingHint').classList.add('hidden'); } }
        return;
    }
    if (alive && started) {
        pState.prevX = pState.x; pState.prevY = pState.y; cam.prevX = cam.x; cam.prevY = cam.y;
        player.trail.push({ x: pState.x, y: pState.y }); if (player.trail.length > 20) player.trail.shift();
        if (isTutorial && tutorialPhase === 1) {
            let turnPt = currentTrack.pts[1]; let dist = Math.hypot(turnPt.x - pState.x, turnPt.y - pState.y);
            if (dist < 100) { tutorialPause = true; tutorialPhase = 2; showTutorialText(i18n[currentLang].tutTurnNow); return; }
        }
        let speedMod = gameSettings.speed || 1;

        // --- SNAP-TO-RAIL FÖR OBSTACLE ---
        if (currentTrack.difficulty === 'obstacle') {
            pState.x += currentTrack.speed * speedMod * dt;
            pState.y = getTrackYatX(currentTrack, pState.x);

            cam.x += (pState.x - cam.x) * (dt * 12);
            cam.y += (pState.y - cam.y) * (dt * 12);

            if (isJumping) {
                jumpTime += dt;
                if (jumpTime > 0.6) isJumping = false;
            }

            if (currentTrack.obstacles) {
                currentTrack.obstacles.forEach(o => {
                    if (Math.abs(pState.x - o.x) < 20 && !isJumping) {
                        fail();
                    }
                });
            }

            let totalDist = currentTrack.pts[currentTrack.pts.length - 1].x;
            currentProg = Math.min(100, (pState.x / totalDist) * 100);
            document.getElementById('hudProgress').textContent = Math.floor(currentProg) + "%";
            document.getElementById('progressBarFill').style.width = currentProg + "%";
            if (pState.x >= currentTrack.pts[currentTrack.pts.length - 2].x) win();

        } else {
            pState.x += player.vx * currentTrack.speed * speedMod * dt;
            pState.y += player.vy * currentTrack.speed * speedMod * dt;

            cam.x += (pState.x - cam.x) * (dt * 12);
            cam.y += (pState.y - cam.y) * (dt * 12);

            let p1 = currentTrack.pts[player.segIdx], p2 = currentTrack.pts[player.segIdx + 1];
            let dx = p2.x - p1.x, dy = p2.y - p1.y; let segmentLenSq = dx * dx + dy * dy;
            let progressT = ((pState.x - p1.x) * dx + (pState.y - p1.y) * dy) / segmentLenSq;
            let totalSegments = currentTrack.pts.length - 1;
            let progress = ((player.segIdx + Math.max(0, Math.min(1, progressT))) / totalSegments) * 100;
            currentProg = Math.max(currentProg, progress);
            document.getElementById('hudProgress').textContent = Math.floor(currentProg) + "%"; document.getElementById('progressBarFill').style.width = currentProg + "%";
            if (player.segIdx === currentTrack.pts.length - 2 && progressT >= 1) { win(); return; }
            let cx = p1.x + Math.max(0, Math.min(1, progressT)) * dx, cy = p1.y + Math.max(0, Math.min(1, progressT)) * dy;
            if (Math.hypot(pState.x - cx, pState.y - cy) > currentTrack.width) { if (isTutorial && tutorialPhase === 3) { tutorialPhase = 4; fail(); return; } fail(); }
        }

    } else if (!isPreviewing) { cam.prevX = cam.x; cam.prevY = cam.y; cam.x += (pState.x - cam.x) * 0.1; cam.y += (pState.y - cam.y) * 0.1; }
}
