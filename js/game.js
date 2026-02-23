function startTrack(t) {
    currentTrack = t; attempts = 1; paused = false; currentProg = 0; tutorialPause = false; particles = []; flash.alpha = 0;
    const activeScreen = document.querySelector('.screen:not(.hidden)');
    initGame();
    zoom = 0.2;
    if (!isTutorial) { isPreviewing = true; previewTargetIdx = 0; targetZoom = 0.4; document.getElementById('scoutingHint').classList.remove('hidden'); } else { isPreviewing = false; targetZoom = 1.0; }
    document.getElementById('langSwitcher').classList.add('hidden');

    if (activeScreen) {
        activeScreen.classList.add('fade-out');
        setTimeout(() => {
            activeScreen.classList.add('hidden');
            activeScreen.classList.remove('fade-out');
            document.getElementById('gameHud').classList.remove('hidden');
            document.getElementById('progressBarContainer').classList.remove('hidden');
            document.getElementById('pauseBtn').classList.remove('hidden');
        }, 400);
    } else {
        document.getElementById('gameHud').classList.remove('hidden');
        document.getElementById('progressBarContainer').classList.remove('hidden');
        document.getElementById('pauseBtn').classList.remove('hidden');
    }
}

function initGame() {
    alive = true; started = false; player.segIdx = 0; currentProg = 0; shake = 0; turnCombo = 0; player.trail = [];
    pState.x = pState.prevX = currentTrack.pts[0].x; pState.y = pState.prevY = currentTrack.pts[0].y; flash.alpha = 0;
    particles = particles.filter(p => p.type === 'confetti');
    cam.x = cam.prevX = pState.x; cam.y = cam.prevY = pState.y;

    isJumping = false;
    jumpTime = 0;

    updateVelocity();
    if (!isTutorial) { document.getElementById('hudTrackVal').textContent = currentTrack.id; document.getElementById('hudAttemptsVal').textContent = attempts; }
    document.getElementById('hudProgress').textContent = "0%"; document.getElementById('progressBarFill').style.width = "0%";
    document.getElementById('gameOverlay').classList.add('hidden');
}

function updateVelocity() {
    const a = currentTrack.pts[player.segIdx], b = currentTrack.pts[player.segIdx + 1];
    const ang = Math.atan2(b.y - a.y, b.x - a.x); player.vx = Math.cos(ang); player.vy = Math.sin(ang);
}

function handleInput() {
    if (!document.getElementById('gameOverlay').classList.contains('hidden')) { document.getElementById('overlayMainBtn').click(); return; }
    if (!alive || paused) return;
    if (isTutorial) {
        const t = i18n[currentLang];
        if (!started) { started = true; if (tutorialPhase === 0) tutorialPhase = 1; showTutorialText(null); return; }
        if (tutorialPhase === 2) { tutorialPause = false; player.vx = 0; player.vy = 1; fail(); return; }
        if (tutorialPhase === 3 || tutorialPhase === 4) return;
    }
    if (isPreviewing) {
        isPreviewing = false; targetZoom = 0.8; cam.x = cam.prevX = pState.x; cam.y = cam.prevY = pState.y;
        document.getElementById('scoutingHint').classList.add('hidden'); return;
    }
    if (!started) { started = true; gameStartTime = Date.now(); targetZoom = 1.0; document.getElementById('scoutingHint').classList.add('hidden'); return; }

    if (currentTrack.difficulty === 'obstacle') {
        if (!isJumping) {
            isJumping = true;
            jumpTime = 0;
            AudioSfx.play('jump');
        }
    } else {
        let next = currentTrack.pts[player.segIdx + 1]; if (!next) return;
        let isFinalSegment = (player.segIdx + 1 >= currentTrack.pts.length - 1);
        let d = Math.hypot(next.x - pState.x, next.y - pState.y);
        let speedMod = gameSettings.speed || 1;
        if (!isFinalSegment && d < (currentTrack.speed * speedMod) * currentTrack.timing) {
            player.segIdx++; pState.x = next.x; pState.y = next.y; updateVelocity();
            turnCombo++; AudioSfx.play('turn');
            if (isTutorial && tutorialPhase === 5 && player.segIdx >= 3) { win(); }
        } else if (!isFinalSegment) { fail(); }
    }
}

function togglePause() { if (!alive) return; paused = !paused; document.getElementById('pauseScreen').classList.toggle('hidden', !paused); }
function exitToMenu() {
    alive = false; started = false; paused = false; currentTrack = null; isTutorial = false;
    document.getElementById('gameHud').classList.add('hidden'); document.getElementById('progressBarContainer').classList.add('hidden');
    document.getElementById('pauseBtn').classList.add('hidden'); document.getElementById('skipTutBtn').classList.add('hidden');
    document.getElementById('gameOverlay').classList.add('hidden'); document.getElementById('pauseScreen').classList.add('hidden');
    document.getElementById('scoutingHint').classList.add('hidden'); document.getElementById('tutorialInstr').classList.add('hidden');
    showScreen('mainMenu');
}

function fail() {
    if (!alive) return; alive = false; turnCombo = 0;
    if (!isTutorial) { arcadeStats.deaths++; arcadeStats.streak = 0; localStorage.setItem('maze_arcade', JSON.stringify(arcadeStats)); }
    if (currentTrack && !isTutorial) { ghosts[currentTrack.id] = { x: pState.x, y: pState.y }; localStorage.setItem('maze_ghosts', JSON.stringify(ghosts)); }
    shake = 40; spawnExplosion(pState.x, pState.y, gameSettings.skin); flash.active = true; flash.color = '#ff0000'; flash.alpha = 0.4;
    AudioSfx.play('fail');
    const t = i18n[currentLang];

    document.getElementById('crashProgressBar').style.width = Math.round(currentProg) + "%";

    if (isTutorial) {
        document.getElementById('overlayExitBtn').classList.add('hidden'); document.getElementById('progressInfo').innerHTML = "";
        if (tutorialPhase === 2) {
            document.getElementById('msgTitle').textContent = t.tutFailEarly; document.getElementById('msgBody').textContent = "";
            document.getElementById('overlayMainBtn').textContent = t.tutNextStep;
            document.getElementById('overlayMainBtn').onclick = () => { tutorialPhase = 3; attempts = 1; initGame(); showTutorialText(null); setTimeout(() => handleInput(), 500); };
        } else if (tutorialPhase === 3 || tutorialPhase === 4) {
            document.getElementById('msgTitle').textContent = t.tutFailLate; document.getElementById('msgBody').textContent = "";
            document.getElementById('overlayMainBtn').textContent = t.tutTryReal;
            document.getElementById('overlayMainBtn').onclick = () => { tutorialPhase = 5; attempts = 1; initGame(); showTutorialText(t.tutRealTry); };
        } else {
            document.getElementById('msgTitle').textContent = t.crash; document.getElementById('msgBody').textContent = t.tryAgain;
            document.getElementById('overlayMainBtn').textContent = t.tryAgainBtn; document.getElementById('overlayMainBtn').onclick = () => { attempts++; initGame(); };
        }
        setTimeout(() => document.getElementById('gameOverlay').classList.remove('hidden'), 500); return;
    }
    document.getElementById('overlayExitBtn').classList.remove('hidden');
    let history = JSON.parse(localStorage.getItem('maze_history_pro') || "{}");
    if (!history[currentTrack.id]) history[currentTrack.id] = { attempts: 0, bestProg: 0, cleared: false };
    if (!history[currentTrack.id].cleared) history[currentTrack.id].attempts = attempts;
    let isNewPB = currentProg > (history[currentTrack.id].bestProg || 0);
    let oldPBVal = history[currentTrack.id].bestProg || 0;
    if (isNewPB) history[currentTrack.id].bestProg = currentProg;
    localStorage.setItem('maze_history_pro', JSON.stringify(history));

    document.getElementById('msgTitle').textContent = t.crash;

    let progressHtml = `<span class="progress-main">${t.hudDoneLabel}: ${Math.round(currentProg)}%</span>`;
    if (isNewPB) {
        progressHtml += `<span class="pb-text">${t.pb} (${t.oldPb}: ${Math.round(oldPBVal)}%)</span>`;
    } else {
        progressHtml += `<span class="pb-text-old">${t.pbLabel}: ${Math.round(oldPBVal)}%</span>`;
    }
    document.getElementById('progressInfo').innerHTML = progressHtml;
    document.getElementById('msgBody').textContent = getFailMessage(currentProg);
    document.getElementById('overlayMainBtn').textContent = t.tryAgainBtn;
    document.getElementById('overlayMainBtn').onclick = () => { attempts++; initGame(); };

    const popup = document.getElementById('popupBox');
    popup.classList.remove('popup-anim');
    void popup.offsetWidth;
    popup.classList.add('popup-anim');

    setTimeout(() => document.getElementById('gameOverlay').classList.remove('hidden'), 500);
}

function win() {
    alive = false; turnCombo = 0;
    let timeTaken = Date.now() - gameStartTime;
    if (!isTutorial) { arcadeStats.streak++; if (arcadeStats.streak > arcadeStats.bestStreak) arcadeStats.bestStreak = arcadeStats.streak; localStorage.setItem('maze_arcade', JSON.stringify(arcadeStats)); }
    AudioSfx.play('win'); triggerWinCelebration(pState.x, pState.y);
    flash.active = true; flash.color = '#ffffff'; flash.alpha = 0.8;
    const t = i18n[currentLang]; const overlay = document.getElementById('gameOverlay'); const popup = document.getElementById('popupBox');
    popup.classList.remove('popup-anim'); void popup.offsetWidth; popup.classList.add('popup-anim');

    if (isTutorial) {
        document.getElementById('msgTitle').textContent = t.tutWin; document.getElementById('progressInfo').innerHTML = "";
        document.getElementById('msgBody').textContent = ""; document.getElementById('overlayMainBtn').textContent = t.okBtn;
        document.getElementById('crashProgressBar').style.width = "100%";
        document.getElementById('overlayExitBtn').classList.add('hidden');
        document.getElementById('overlayMainBtn').onclick = endTutorial; overlay.classList.remove('hidden'); return;
    }
    document.getElementById('overlayExitBtn').classList.remove('hidden');
    let history = JSON.parse(localStorage.getItem('maze_history_pro') || "{}");
    if (!history[currentTrack.id]) history[currentTrack.id] = { attempts: attempts, bestAttempts: attempts, bestProg: 100, cleared: true, bestTime: timeTaken };
    else {
        if (!history[currentTrack.id].cleared || attempts < history[currentTrack.id].bestAttempts) history[currentTrack.id].bestAttempts = attempts;
        if (!history[currentTrack.id].bestTime || timeTaken < history[currentTrack.id].bestTime) history[currentTrack.id].bestTime = timeTaken;
        history[currentTrack.id].cleared = true; history[currentTrack.id].bestProg = 100;
    }
    localStorage.setItem('maze_history_pro', JSON.stringify(history));
    if (ghosts[currentTrack.id]) { delete ghosts[currentTrack.id]; localStorage.setItem('maze_ghosts', JSON.stringify(ghosts)); }

    document.getElementById('msgTitle').textContent = t.winTitle;
    let timeStr = (timeTaken / 1000).toFixed(2) + "s";
    document.getElementById('progressInfo').innerHTML = `<div style="font-size:2rem; margin-bottom:10px; text-shadow:0 0 15px var(--success)">🎉 100% ${t.hudDoneLabel}! 🎉</div><small style="color:#aaa">${t.winStats.replace('{n}', attempts)} | ${timeStr}</small>`;
    document.getElementById('msgBody').textContent = t.winBody.replace('{id}', currentTrack.id);
    document.getElementById('crashProgressBar').style.width = "100%";

    const next = tracks.find(tr => tr.num === currentTrack.num + 1);
    document.getElementById('overlayMainBtn').textContent = next ? t.nextBtn : t.menuBtn;
    document.getElementById('overlayMainBtn').onclick = next ? () => startTrack(next) : exitToMenu;
    overlay.classList.remove('hidden');
}
