function draw(alpha) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (particles.length > 0) updateParticles();
    if (currentTrack) {
        const lerpX = pState.prevX + (pState.x - pState.prevX) * alpha; const lerpY = pState.prevY + (pState.y - pState.prevY) * alpha;
        const lerpCamX = cam.prevX + (cam.x - cam.prevX) * alpha; const lerpCamY = cam.prevY + (cam.y - cam.prevY) * alpha; const lerpZoom = prevZoom + (zoom - prevZoom) * alpha;
        ctx.save(); let offsetX = (Math.random() - 0.5) * shake; let offsetY = (Math.random() - 0.5) * shake;
        ctx.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY); ctx.scale(lerpZoom, lerpZoom); ctx.translate(-lerpCamX, -lerpCamY);
        if (currentTrack.difficulty === 'brutal' || currentTrack.difficulty === 'hard') ctx.strokeStyle = "#ff0044";
        else if (currentTrack.difficulty === 'dynamic') ctx.strokeStyle = "#d946ef";
        else if (currentTrack.difficulty === 'mindflip') ctx.strokeStyle = "#ff8800";
        else if (currentTrack.difficulty === 'tricky') ctx.strokeStyle = "#00e5ff";
        else ctx.strokeStyle = "#fff";

        ctx.lineWidth = currentTrack.width * 2; ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.beginPath(); ctx.moveTo(currentTrack.pts[0].x, currentTrack.pts[0].y); currentTrack.pts.forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke();

        // --- RITA CYBER-BLOCK HINDER ---
        if (currentTrack.difficulty === 'obstacle' && currentTrack.obstacles) {
            currentTrack.obstacles.forEach(o => {
                let obsY = getTrackYatX(currentTrack, o.x);
                ctx.save();
                ctx.translate(o.x, obsY);
                ctx.fillStyle = "rgba(0,0,0,0.7)";
                ctx.beginPath(); ctx.ellipse(0, 0, 20, 8, 0, 0, Math.PI * 2); ctx.fill();
                const w = 30; const h = 70;
                ctx.fillStyle = "#111"; ctx.fillRect(-w / 2, -h, w, h);
                ctx.strokeStyle = "#facc15"; ctx.lineWidth = 2; ctx.shadowColor = "#facc15"; ctx.shadowBlur = 10;
                ctx.strokeRect(-w / 2, -h, w, h);
                ctx.fillStyle = "#facc15"; ctx.shadowBlur = 20; ctx.fillRect(-w / 2, -h, w, 5);
                ctx.restore();
            });
        } else if (['easy', 'medium', 'dynamic', 'mindflip', 'tricky'].includes(currentTrack.difficulty)) {
            let circleColor = "rgba(29, 43, 255, 0.25)";
            if (currentTrack.difficulty === 'dynamic') circleColor = "rgba(217, 70, 239, 0.25)";
            if (currentTrack.difficulty === 'mindflip') circleColor = "rgba(255, 136, 0, 0.25)";
            if (currentTrack.difficulty === 'tricky') circleColor = "rgba(0, 229, 255, 0.25)";
            ctx.fillStyle = circleColor;
            currentTrack.pts.forEach((p, idx) => { if (idx > 0 && idx < currentTrack.pts.length - 1) { ctx.beginPath(); ctx.arc(p.x, p.y, currentTrack.speed * currentTrack.timing, 0, Math.PI * 2); ctx.fill(); } });
        }

        ctx.shadowBlur = 15;
        if (currentTrack.difficulty === 'brutal') ctx.shadowColor = "#ff0044"; else if (currentTrack.difficulty === 'dynamic') ctx.shadowColor = "#d946ef"; else if (currentTrack.difficulty === 'mindflip') ctx.shadowColor = "#ff8800"; else if (currentTrack.difficulty === 'tricky') ctx.shadowColor = "#00e5ff"; else ctx.shadowColor = "#1d2bff";
        if (currentTrack && ghosts[currentTrack.id]) { const g = ghosts[currentTrack.id]; ctx.save(); ctx.translate(g.x, g.y); ctx.fillStyle = "#ff0000"; ctx.font = "bold 40px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 200) * 0.3; ctx.fillText("X", 0, 0); ctx.restore(); }
        if (player.trail.length > 1 && alive) {
            ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
            for (let i = 0; i < player.trail.length - 1; i++) { const pt1 = player.trail[i]; const pt2 = player.trail[i + 1]; ctx.beginPath(); ctx.moveTo(pt1.x, pt1.y); ctx.lineTo(pt2.x, pt2.y); const alpha = (i / player.trail.length); ctx.strokeStyle = gameSettings.skin; ctx.globalAlpha = alpha * 0.6; ctx.lineWidth = 10 + (alpha * 7); ctx.stroke(); }
            ctx.restore();
        }
        if (alive) {
            let drawSize = 8.5;
            let drawY = lerpY;
            if (isJumping) {
                let jumpHeight = Math.sin((jumpTime / 0.6) * Math.PI) * 100;
                drawSize = 8.5 + (jumpHeight * 0.2);
                ctx.save(); ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.beginPath(); ctx.ellipse(lerpX, lerpY, 8.5, 4, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
                drawY -= jumpHeight;
            }
            ctx.fillStyle = gameSettings.skin; ctx.beginPath(); ctx.arc(lerpX, drawY, drawSize, 0, Math.PI * 2); ctx.fill();
        }
        ctx.shadowBlur = 0;
        if (particles.length > 0) drawParticles(ctx, lerpCamX, lerpCamY, lerpZoom);
        if (gameSettings.fog && alive) { const gradient = ctx.createRadialGradient(lerpX, lerpY, 150, lerpX, lerpY, 700); gradient.addColorStop(0, "transparent"); gradient.addColorStop(0.3, "rgba(5,6,8, 0.8)"); gradient.addColorStop(1, "rgba(5,6,8, 1)"); ctx.save(); ctx.fillStyle = gradient; ctx.fillRect(lerpX - 2000, lerpY - 2000, 4000, 4000); ctx.restore(); }
        if (!started && !isPreviewing && alive) {
            ctx.fillStyle = "white"; ctx.font = "bold 30px 'Segoe UI'"; ctx.textAlign = "center";
            let txt = (currentTrack.difficulty === 'obstacle') ? "SPACE / KLICK FÖR ATT HOPPA" : (isTutorial ? i18n[currentLang].tutStart : i18n[currentLang].clickStart);
            ctx.fillText(txt, lerpX, lerpY - 80);
        }
        if (isPreviewing) {
            if (currentTrack.difficulty === 'brutal') ctx.fillStyle = "#ff0044"; else if (currentTrack.difficulty === 'dynamic') ctx.fillStyle = "#d946ef"; else if (currentTrack.difficulty === 'mindflip') ctx.fillStyle = "#ff8800"; else if (currentTrack.difficulty === 'tricky') ctx.fillStyle = "#00e5ff"; else ctx.fillStyle = "#1d2bff";
            ctx.font = "bold 50px 'Segoe UI'"; ctx.textAlign = "center"; ctx.fillText(i18n[currentLang].scouting, cam.x, cam.y - 120);
        }
        ctx.restore();
    }
    if (flash.alpha > 0.01) { ctx.fillStyle = flash.color; ctx.globalAlpha = flash.alpha; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.globalAlpha = 1.0; }
}
