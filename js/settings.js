let gameSettings = JSON.parse(localStorage.getItem('maze_settings') || '{"skin": "#1d2bff", "fog": false, "speed": 1, "sound": true}');
if (gameSettings.sound === undefined) gameSettings.sound = true;

let turnCombo = 0;
let ghosts = JSON.parse(localStorage.getItem('maze_ghosts') || "{}");
let arcadeStats = JSON.parse(localStorage.getItem('maze_arcade') || '{"deaths":0, "streak":0, "bestStreak":0}');

function saveSettings() { localStorage.setItem('maze_settings', JSON.stringify(gameSettings)); }
function resetGameData() {
    const t = i18n[currentLang];
    if (confirm(t.resetConfirm)) {
        localStorage.removeItem('maze_settings'); localStorage.removeItem('maze_ghosts');
        localStorage.removeItem('maze_arcade'); localStorage.removeItem('maze_history_pro');
        location.reload();
    }
}

function updateSpeedDisplay(val) {
    const percent = Math.round(val * 100);
    const el = document.getElementById('speedValueDisplay');
    el.textContent = percent + "%";
    if (val < 1) el.style.color = "#00c853";
    else if (val > 1) el.style.color = "#ff0044";
    else el.style.color = "#1d2bff";
}
function saveSpeedSetting(val) { gameSettings.speed = parseFloat(val); saveSettings(); }

function renderSettings() {
    const grid = document.getElementById('skinGrid'); grid.innerHTML = '';
    skins.forEach(color => {
        const d = document.createElement('div');
        d.className = `skin-option ${gameSettings.skin === color ? 'selected' : ''}`;
        d.style.backgroundColor = color;
        d.onclick = () => { gameSettings.skin = color; saveSettings(); renderSettings(); };
        grid.appendChild(d);
    });
    const slider = document.getElementById('speedRange');
    slider.value = gameSettings.speed || 1;
    updateSpeedDisplay(slider.value);
    document.getElementById('fogToggle').classList.toggle('active', gameSettings.fog);
    document.getElementById('soundToggle').classList.toggle('active', gameSettings.sound);
}
function toggleFog() { gameSettings.fog = !gameSettings.fog; saveSettings(); renderSettings(); }
function toggleSound() { gameSettings.sound = !gameSettings.sound; saveSettings(); renderSettings(); }

function updateTexts() {
    const t = i18n[currentLang];
    document.querySelectorAll('[data-t]').forEach(el => {
        const key = el.getAttribute('data-t');
        if (t[key]) el.textContent = t[key];
    });
    document.getElementById('aboutContent').innerHTML = t.aboutText;
}

function setLanguage(lang) {
    currentLang = lang; localStorage.setItem('maze_lang', currentLang);
    updateTexts(); updateLangUI();
    if (!document.getElementById('statsScreen').classList.contains('hidden')) renderStats();
}
function updateLangUI() {
    document.querySelectorAll('.lang-option').forEach(el => el.classList.remove('active'));
    document.getElementById('lang-' + currentLang).classList.add('active');
}
