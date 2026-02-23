// --- PATH GENERATORS ---
function generateTrickyPath(levelIndex) {
    const pts = [{ x: 0, y: 0 }]; let curX = 0, curY = 0;
    if (levelIndex === 1) { for (let j = 0; j < 12; j++) { curX += 250; curY += (j % 2 === 0) ? 150 : -150; pts.push({ x: curX, y: curY }); } }
    else if (levelIndex === 2) { for (let j = 0; j < 10; j++) { curX += 500; curY += (Math.random() > 0.5 ? 50 : -50); pts.push({ x: curX, y: curY }); } }
    else if (levelIndex === 3) { for (let j = 0; j < 15; j++) { let len = (j % 3 === 0) ? 400 : 150; curX += len; curY += (j % 2 === 0) ? 100 : -100; pts.push({ x: curX, y: curY }); } }
    else if (levelIndex === 4) { for (let j = 0; j < 12; j++) { if (j % 2 === 0) curX += 300; else curY += (Math.random() > 0.5 ? 300 : -300); pts.push({ x: curX, y: curY }); } }
    else if (levelIndex === 5) { for (let j = 0; j < 14; j++) { curX += 200; curY += (j % 2 === 0) ? 200 : -200; pts.push({ x: curX, y: curY }); } }
    else if (levelIndex === 6) { pts.push({ x: curX += 300, y: curY }); pts.push({ x: curX += 200, y: curY += 200 }); pts.push({ x: curX += 200, y: curY -= 200 }); pts.push({ x: curX -= 200, y: curY -= 200 }); pts.push({ x: curX += 400, y: curY -= 100 }); pts.push({ x: curX += 400, y: curY += 200 }); }
    else if (levelIndex === 7) { pts.push({ x: curX += 300, y: curY -= 250 }); pts.push({ x: curX += 100, y: curY += 50 }); pts.push({ x: curX += 300, y: curY += 250 }); pts.push({ x: curX += 200, y: curY }); pts.push({ x: curX += 300, y: curY += 250 }); pts.push({ x: curX += 100, y: curY -= 50 }); pts.push({ x: curX += 300, y: curY -= 250 }); }
    else if (levelIndex === 8) { for (let j = 0; j < 5; j++) { pts.push({ x: curX += 500, y: curY }); pts.push({ x: curX += 150, y: curY += 150 }); pts.push({ x: curX += 150, y: curY -= 150 }); } }
    else if (levelIndex === 9) { let step = 150; for (let j = 0; j < 10; j++) { if (j % 4 === 0) curX += step; if (j % 4 === 1) curY += step; if (j % 4 === 2) curX += step; if (j % 4 === 3) curY -= step; step += 50; pts.push({ x: curX, y: curY }); } }
    else { for (let j = 0; j < 12; j++) { let len = 300 + Math.random() * 200; let angle = (Math.random() - 0.5) * 1.5; curX += Math.cos(angle) * len; curY += Math.sin(angle) * len; pts.push({ x: Math.round(curX), y: Math.round(curY) }); } }
    return pts;
}
function generateComplexPath(num, diff) {
    const pts = [{ x: 0, y: 0 }]; let curX = 0, curY = 0; let segments = 10 + Math.floor(num * 1.5);
    for (let j = 0; j < segments; j++) { const len = 300 + (Math.random() * 400) + (num * 5); if (j % 2 === 0) curX += len; else { let yMult = (diff === 'brutal' || diff === 'hard') ? 1.5 : 0.8; curY += (len * yMult) * (Math.random() > 0.5 ? 1 : -1); } pts.push({ x: Math.round(curX), y: Math.round(curY) }); }
    return pts;
}
function generateDynamicPath(num) {
    const pts = [{ x: 0, y: 0 }]; let curX = 0, curY = 0; let currentAngle = 0; let segments = 12 + Math.floor(num * 1.2);
    for (let j = 0; j < segments; j++) { const len = 350 + (Math.random() * 300) + (num * 10); let turnDegrees = 10 + Math.random() * 160; let deviation = turnDegrees * (Math.PI / 180); if (Math.random() < 0.5) deviation = -deviation; currentAngle += deviation; curX += Math.cos(currentAngle) * len; curY += Math.sin(currentAngle) * len; pts.push({ x: Math.round(curX), y: Math.round(curY) }); }
    return pts;
}
function generateMindflipPath(num) {
    const pts = [{ x: 0, y: 0 }]; let curX = 0, curY = 0; let currentAngle = 0; let segments = 15 + Math.floor(num * 1.5);
    for (let j = 0; j < segments; j++) {
        const len = 350 + (Math.random() * 200); let behavior = Math.random();
        if (j > 0 && behavior > 0.7) { let reverseDir = Math.PI + (Math.random() * 0.5 - 0.25); currentAngle += reverseDir; }
        else if (behavior < 0.2) { currentAngle += (Math.PI / 2) * (Math.random() > 0.5 ? 1 : -1); }
        else { let turnDegrees = 20 + Math.random() * 100; let deviation = turnDegrees * (Math.PI / 180); if (Math.random() < 0.5) deviation = -deviation; currentAngle += deviation; }
        curX += Math.cos(currentAngle) * len; curY += Math.sin(currentAngle) * len; pts.push({ x: Math.round(curX), y: Math.round(curY) });
    } return pts;
}

function generateObstaclePath(levelIndex) {
    const pts = [{ x: 0, y: 0 }];
    const obstacles = [];
    let curX = 0;
    let curY = 0;
    let segments = 25;

    let type = Math.floor(levelIndex / 3);

    for (let i = 0; i < segments; i++) {
        let step = 400 + (levelIndex * 10);

        if (type === 1) {
            curX += step;
            curY = Math.sin(i * 0.6) * 180;
        }
        else if (type === 3) {
            curX += step;
            curY += (i % 2 === 0) ? 150 : -150;
        }
        else if (type === 4) {
            curX += step;
            curY += (Math.random() - 0.5) * 300;
        }
        else {
            curX += step;
        }

        pts.push({ x: curX, y: curY });

        if (i > 0 && i < segments - 1) {
            if (type === 2 && i % 3 === 0) {
                obstacles.push({ x: curX - step * 0.6 });
                obstacles.push({ x: curX - step * 0.3 });
            }
            else if (i % 2 === 0) {
                obstacles.push({ x: curX - step / 2 });
            }
        }
    }
    pts.push({ x: curX + 1000, y: curY });
    return { pts, obstacles };
}

// --- DIFFICULTY SETTINGS & TRACK GENERATION ---
const tracks = [];
const diffSettings = [
    { id: 'easy', count: 15, baseSpeed: 180, speedInc: 15, baseWidth: 55, widthDec: 1.5, timing: 0.52 },
    { id: 'medium', count: 15, baseSpeed: 400, speedInc: 12, baseWidth: 32, widthDec: 1.0, timing: 0.40 },
    { id: 'obstacle', count: 15, baseSpeed: 420, speedInc: 15, baseWidth: 40, widthDec: 0, timing: 0.45 },
    { id: 'dynamic', count: 10, baseSpeed: 450, speedInc: 15, baseWidth: 28, widthDec: 0.8, timing: 0.35 },
    { id: 'mindflip', count: 10, baseSpeed: 500, speedInc: 15, baseWidth: 25, widthDec: 0.5, timing: 0.30 },
    { id: 'tricky', count: 10, baseSpeed: 420, speedInc: 15, baseWidth: 40, widthDec: 0.5, timing: 0.45 },
    { id: 'hard', count: 10, baseSpeed: 580, speedInc: 15, baseWidth: 22, widthDec: 0.8, timing: 0.25 },
    { id: 'brutal', count: 10, baseSpeed: 750, speedInc: 20, baseWidth: 14, widthDec: 0.5, timing: 0.15 }
];

let globalIndex = 1;
diffSettings.forEach(setting => {
    for (let i = 0; i < setting.count; i++) {
        let speed = setting.baseSpeed + (i * setting.speedInc);
        let width = Math.max(5, setting.baseWidth - (i * setting.widthDec));
        let timing = setting.timing - (i * 0.005);
        let pathPoints;
        let obstacles = [];

        if (setting.id === 'dynamic') pathPoints = generateDynamicPath(globalIndex);
        else if (setting.id === 'mindflip') pathPoints = generateMindflipPath(globalIndex);
        else if (setting.id === 'tricky') pathPoints = generateTrickyPath(i + 1);
        else if (setting.id === 'obstacle') {
            const data = generateObstaclePath(i);
            pathPoints = data.pts;
            obstacles = data.obstacles;
        }
        else pathPoints = generateComplexPath(globalIndex, setting.id);

        tracks.push({
            id: globalIndex.toString().padStart(3, '0'),
            num: globalIndex,
            difficulty: setting.id,
            speed: speed,
            width: width,
            timing: timing,
            pts: pathPoints,
            obstacles: obstacles
        });
        globalIndex++;
    }
});
