const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// --- KONFIGURATION ---
const GAME_PATH = path.resolve(__dirname, '..', 'index.html');
const SCREENSHOTS_DIR = path.resolve(__dirname, '..', 'screenshots');
const GAME_URL = `file:///${GAME_PATH.replace(/\\/g, '/')}`;

// Hämta info från miljövariabler (satt av git hook)
const COMMIT_MSG = (process.env.COMMIT_MSG || '').toLowerCase();
const CHANGED_FILES = (process.env.CHANGED_FILES || '').split('\n').filter(Boolean);
const COMMIT_HASH = (process.env.COMMIT_HASH || 'manual').slice(0, 7);
const DATE_STR = new Date().toISOString().slice(0, 10);

// --- SVÅRIGHETSGRADS-MAPPNING ---
// Nyckelord i commit-meddelande → vilket spår som screenshotas
const DIFFICULTY_KEYWORDS = {
    easy:     ['lätt', 'easy', 'enkel'],
    medium:   ['medel', 'medium'],
    obstacle: ['obstacle', 'hinder', 'jump', 'hoppa'],
    dynamic:  ['dynamic', 'dynamisk'],
    mindflip: ['mindflip'],
    tricky:   ['tricky'],
    hard:     ['svår', 'hard'],
    brutal:   ['brutal'],
};

// Grid-ID i HTML per svårighetsgrad
const DIFFICULTY_GRID = {
    easy:     'grid-easy',
    medium:   'grid-medium',
    obstacle: 'grid-obstacle',
    dynamic:  'grid-dynamic',
    mindflip: 'grid-mindflip',
    tricky:   'grid-tricky',
    hard:     'grid-hard',
    brutal:   'grid-brutal',
};

// Visuella filer – trigger för screenshot
const VISUAL_FILES = [
    'css/style.css',
    'js/render.js',
    'js/ui.js',
    'js/particles.js',
    'js/levels.js',
    'js/constants.js',
    'index.html',
];

function hasVisualChanges() {
    if (CHANGED_FILES.length === 0) return true; // manuell körning
    return CHANGED_FILES.some(f => VISUAL_FILES.some(vf => f.includes(vf)));
}

function detectDifficulties() {
    const detected = new Set();

    // Kolla commit-meddelande
    for (const [diff, keywords] of Object.entries(DIFFICULTY_KEYWORDS)) {
        if (keywords.some(kw => COMMIT_MSG.includes(kw))) {
            detected.add(diff);
        }
    }

    // Om levels.js ändrades men ingen specifik svårighet nämns → ta alla fyra "bilda sig en uppfattning"-spår
    const hasLevelChange = CHANGED_FILES.some(f => f.includes('levels.js'));
    if (hasLevelChange && detected.size === 0) {
        detected.add('easy');
        detected.add('brutal');
    }

    // Om render.js eller css ändrades → easy räcker som spelvy
    const hasRenderChange = CHANGED_FILES.some(f => f.includes('render.js') || f.includes('style.css'));
    if (hasRenderChange && detected.size === 0) {
        detected.add('easy');
    }

    return [...detected];
}

async function takeScreenshot(page, name) {
    if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    const filename = `${DATE_STR}_${COMMIT_HASH}_${name}.png`;
    const filepath = path.join(SCREENSHOTS_DIR, filename);
    await page.screenshot({ path: filepath, fullPage: false });
    console.log(`  ✅ ${filename}`);
    return filepath;
}

async function waitForGame(page) {
    await page.goto(GAME_URL, { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 800)); // låt animationer starta
}

async function screenshotMenu(page) {
    // Navigera till huvudmeny (ska vara default)
    await page.evaluate(() => {
        if (typeof showScreen === 'function') showScreen('mainMenu');
    });
    await new Promise(r => setTimeout(r, 400));
    await takeScreenshot(page, 'menu');
}

async function screenshotLevelSelect(page) {
    await page.evaluate(() => {
        if (typeof showScreen === 'function') showScreen('levelSelect');
    });
    await new Promise(r => setTimeout(r, 400));
    await takeScreenshot(page, 'level-select');
}

async function screenshotTrack(page, difficulty) {
    // Öppna level select
    await page.evaluate(() => {
        if (typeof showScreen === 'function') showScreen('levelSelect');
    });
    await new Promise(r => setTimeout(r, 300));

    // Klicka på första knappen i rätt svårighetsgrid
    const gridId = DIFFICULTY_GRID[difficulty];
    const clicked = await page.evaluate((gid) => {
        const grid = document.getElementById(gid);
        if (!grid) return false;
        const card = grid.querySelector('.level-card');
        if (!card) return false;
        card.click();
        return true;
    }, gridId);

    if (!clicked) {
        console.log(`  ⚠️  Hittade ingen bana för ${difficulty}`);
        return;
    }

    // Vänta på scouting-animationen (kameran åker längs banan)
    await new Promise(r => setTimeout(r, 3500));
    await takeScreenshot(page, `track-${difficulty}`);
}

// --- HUVUDLOGIK ---
(async () => {
    if (!hasVisualChanges()) {
        console.log('Inga visuella ändringar – hoppar över screenshot.');
        process.exit(0);
    }

    const difficulties = detectDifficulties();
    const takeMenu = true; // alltid
    const takeLevelSelect = CHANGED_FILES.some(f => f.includes('ui.js') || f.includes('index.html'));

    console.log(`\nSharpRunner Screenshot Tool`);
    console.log(`Commit: ${COMMIT_HASH}  |  ${DATE_STR}`);
    console.log(`Commit-meddelande: "${process.env.COMMIT_MSG || '(manuell)'}"`);
    console.log(`Detekterade svårigheter: ${difficulties.length > 0 ? difficulties.join(', ') : 'ingen → bara meny'}`);
    console.log(`Sparar i: screenshots/\n`);

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files'],
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 720 });

        await waitForGame(page);

        if (takeMenu) await screenshotMenu(page);
        if (takeLevelSelect) await screenshotLevelSelect(page);
        for (const diff of difficulties) {
            await screenshotTrack(page, diff);
        }

        console.log('\nKlart!');
    } finally {
        await browser.close();
    }
})();
