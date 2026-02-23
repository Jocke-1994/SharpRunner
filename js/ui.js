function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    document.getElementById('langSwitcher').classList.toggle('hidden', id !== 'mainMenu');
    if (id === 'levelSelect') renderGrids();
    if (id === 'statsScreen') renderStats();
    if (id === 'settingsScreen') renderSettings();
}

function renderGrids() {
    const history = JSON.parse(localStorage.getItem('maze_history_pro') || "{}");
    const difficulties = ['easy', 'medium', 'obstacle', 'dynamic', 'mindflip', 'tricky', 'hard', 'brutal'];
    difficulties.forEach(diff => {
        const grid = document.getElementById('grid-' + diff); if (!grid) return;
        const header = grid.previousElementSibling;
        if (header.querySelector('.medal-icon')) header.removeChild(header.querySelector('.medal-icon'));
        const tracksInDiff = tracks.filter(t => t.difficulty === diff);
        const clearedCount = tracksInDiff.filter(t => history[t.id]?.cleared).length;
        if (tracksInDiff.length > 0 && clearedCount === tracksInDiff.length) {
            const span = document.createElement('span'); span.innerHTML = iconStar; span.className = 'medal-icon'; header.appendChild(span);
        }
        grid.innerHTML = '';
        tracksInDiff.forEach(t => {
            const d = document.createElement('div'); d.className = `level-card ${history[t.id]?.cleared ? 'cleared' : ''}`;
            d.innerHTML = `<strong>${t.id}</strong>`; d.onclick = () => startTrack(t); grid.appendChild(d);
        });
    });
}

function renderStats() {
    const history = JSON.parse(localStorage.getItem('maze_history_pro') || "{}"); const t = i18n[currentLang];
    document.getElementById('stWinStreak').textContent = arcadeStats.streak;
    document.getElementById('stBestStreak').textContent = arcadeStats.bestStreak;
    document.getElementById('stDeaths').textContent = arcadeStats.deaths;
    const diffBreakdown = document.getElementById('diffBreakdown'); diffBreakdown.innerHTML = '';
    const difficulties = ['easy', 'medium', 'obstacle', 'dynamic', 'mindflip', 'tricky', 'hard', 'brutal'];
    const diffColors = { easy: '#4caf50', medium: '#ff9800', obstacle: '#facc15', dynamic: '#d946ef', mindflip: '#ff8800', tricky: '#00e5ff', hard: '#f44336', brutal: '#ff0044' };
    difficulties.forEach(diff => {
        const totalTracks = tracks.filter(t => t.difficulty === diff).length; if (totalTracks === 0) return;
        const clearedTracks = tracks.filter(t => t.difficulty === diff && history[t.id]?.cleared).length;
        const percentage = Math.round((clearedTracks / totalTracks) * 100); const color = diffColors[diff];
        const row = document.createElement('div'); row.className = 'diff-row';
        row.innerHTML = `<div class="diff-name"><div class="diff-dot" style="background:${color}"></div>${diff.toUpperCase()}</div><div class="diff-bar-bg"><div class="diff-bar-fill" style="width:${percentage}%; background:${color}; box-shadow: 0 0 10px ${color}"></div></div><div class="diff-perc">${percentage}%</div>`;
        diffBreakdown.appendChild(row);
    });
    const list = document.getElementById('statsList'); list.innerHTML = '';
    Object.keys(history).sort((a, b) => a - b).forEach(id => {
        const track = tracks.find(tr => tr.id === id);
        if (track) {
            let pbVal = history[id].bestProg ? Math.round(history[id].bestProg) : 0;
            let atts = history[id].cleared ? history[id].bestAttempts : history[id].attempts;
            let line = t.statsBest.replace('{p}', pbVal).replace('{a}', atts);
            if (history[id].cleared && history[id].bestTime) line += ` | ${t.statsTime.replace('{t}', (history[id].bestTime / 1000).toFixed(2))}`;
            list.innerHTML += `<div class="stats-item"><span>${t.hudTrack} ${id} <span class="tag ${track.difficulty}">${track.difficulty.toUpperCase()}</span></span> <span>${line}</span></div>`;
        }
    });
}

function startTutorial() {
    isTutorial = true; tutorialPhase = 0; const t = i18n[currentLang];
    const tutTrack = { id: 'TUT', difficulty: 'easy', speed: 200, width: 60, timing: 0.5, pts: [{ x: 0, y: 0 }, { x: 500, y: 0 }, { x: 500, y: 400 }, { x: 0, y: 400 }, { x: 0, y: 800 }] };
    document.getElementById('skipTutBtn').classList.remove('hidden');
    startTrack(tutTrack);
    document.getElementById('scoutingHint').classList.add('hidden'); isPreviewing = false; targetZoom = 1.0;
    document.getElementById('hudTrackVal').textContent = "TUT"; showTutorialText(t.tutStart);
}
function endTutorial() { isTutorial = false; document.getElementById('skipTutBtn').classList.add('hidden'); document.getElementById('tutorialInstr').classList.add('hidden'); exitToMenu(); }
function showTutorialText(txt) {
    const el = document.getElementById('tutorialInstr'); const txtEl = document.getElementById('tutText');
    if (!txt) el.classList.add('hidden'); else { txtEl.textContent = txt; el.classList.remove('hidden'); }
}
