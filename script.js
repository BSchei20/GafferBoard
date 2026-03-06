/* --- COMPLETE TACTICAL LIBRARY --- */
const tacticalMaps = {
    "11v11": {
        "4-3-3": { 1:[.5,.95], 2:[.2,.8], 3:[.4,.82], 4:[.6,.82], 5:[.8,.8], 6:[.35,.65], 8:[.5,.7], 10:[.65,.65], 7:[.85,.5], 9:[.5,.45], 11:[.15,.5] },
        "4-4-2-flat": { 1:[.5,.95], 2:[.15,.8], 3:[.38,.82], 4:[.62,.82], 5:[.85,.8], 6:[.15,.65], 8:[.4,.65], 10:[.6,.65], 7:[.85,.65], 9:[.4,.45], 11:[.6,.45] },
        "4-4-2-diamond": { 1:[.5,.95], 2:[.2,.8], 3:[.4,.82], 4:[.6,.82], 5:[.8,.8], 8:[.5,.72], 6:[.35,.62], 7:[.65,.62], 10:[.5,.55], 9:[.4,.42], 11:[.6,.42] },
        "3-5-2": { 1:[.5,.95], 3:[.3,.82], 8:[.5,.82], 4:[.7,.82], 2:[.15,.65], 6:[.35,.65], 10:[.5,.55], 5:[.65,.65], 7:[.85,.65], 9:[.4,.4], 11:[.6,.4] }
    },
    "9v9": {
        "3-2-3": { 1:[.5,.95], 2:[.25,.82], 3:[.5,.85], 4:[.75,.82], 8:[.4,.68], 10:[.6,.68], 11:[.2,.5], 7:[.8,.5], 9:[.5,.42] },
        "3-4-1-flat": { 1:[.5,.95], 2:[.25,.82], 3:[.5,.85], 4:[.75,.82], 11:[.15,.62], 8:[.38,.62], 10:[.62,.62], 7:[.85,.62], 9:[.5,.42] },
        "3-4-1-diamond": { 1:[.5,.95], 2:[.25,.82], 3:[.5,.85], 4:[.75,.82], 8:[.5,.7], 7:[.3,.6], 11:[.7,.6], 10:[.5,.52], 9:[.5,.38] },
        "3-3-2": { 1:[.5,.95], 2:[.25,.82], 3:[.5,.85], 4:[.75,.82], 8:[.3,.62], 10:[.5,.65], 7:[.7,.62], 9:[.4,.42], 11:[.6,.42] }
    },
    "6v6": {
        "2-2-1": { 1:[.5,.95], 2:[.3,.82], 4:[.7,.82], 8:[.4,.65], 10:[.6,.65], 9:[.5,.45] }
    }
};

let currentPhase = 'defense';
let redTeam = {}, blueTeam = {}, field, layer, canvas, ctx;

window.onload = () => {
    field = document.getElementById('field');
    layer = document.getElementById('pieces-layer');
    canvas = document.getElementById('drawLayer');
    ctx = canvas.getContext('2d');
    initCanvas();
    resetBoard();
};

function initCanvas() {
    canvas.width = field.clientWidth;
    canvas.height = field.clientHeight;
    ctx.lineCap = 'round'; ctx.lineWidth = 3;
}

function createPiece(num, color, x, y) {
    const p = document.createElement('div');
    p.className = `piece ${color}`;
    p.style.touchAction = 'none'; 
    if (num === 'ball') p.classList.add('ball'); else p.innerText = num;
    p.style.left = x + 'px'; p.style.top = y + 'px';
    
    p.onpointerdown = (e) => {
        e.preventDefault(); p.style.transition = 'none';
        p.setPointerCapture(e.pointerId);
        p.onpointermove = (ev) => {
            const rect = field.getBoundingClientRect();
            p.style.left = (ev.clientX - rect.left - 18) + 'px';
            p.style.top = (ev.clientY - rect.top - 18) + 'px';
        };
        p.onpointerup = () => { p.onpointermove = null; if (num === 'ball') checkBallMagnetism(p); };
    };
    layer.appendChild(p);
    return p;
}

function resetBoard() {
    layer.innerHTML = ''; redTeam = {}; blueTeam = {};
    const w = window.innerWidth, h = field.offsetHeight;
    for (let i = 1; i <= 11; i++) {
        redTeam[i] = createPiece(i, 'red', 10, 10 + (i * 40));
        blueTeam[i] = createPiece(i, 'blue', w - 50, 10 + (i * 40));
    }
    createPiece('ball', 'ball', w/2, h/2);
}

function applyTactics() {
    const formation = document.getElementById('formationSelect').value;
    if (!formation) return;
    
    // 1. Determine Team Size
    let size = "11v11";
    if (["3-2-3", "3-4-1-flat", "3-4-1-diamond", "3-3-2"].includes(formation)) size = "9v9";
    if (formation === "2-2-1") size = "6v6";

    // 2. Get the specific map (Default to Defense if Phase not toggled)
    const map = tacticalMaps[size][formation];
    const w = window.innerWidth;
    const h = field.offsetHeight;

    // 3. Update Every Player (1-11)
    for (let n = 1; n <= 11; n++) {
        const redP = redTeam[n];
        const blueP = blueTeam[n];

        if (map[n]) {
            // Show player and animate to position
            redP.style.display = 'flex';
            blueP.style.display = 'flex';
            redP.style.transition = 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)';
            blueP.style.transition = 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)';

            const [x, y] = map[n];
            // Red (Bottom half)
            redP.style.left = (x * w - 18) + 'px';
            redP.style.top = (y * h - 18) + 'px';

            // Blue (Mirror to Top half)
            blueP.style.left = ((1 - x) * w - 18) + 'px'; // Mirror Horizontal
            blueP.style.top = ((1 - y) * h - 18) + 'px';  // Mirror Vertical
        } else {
            // Hide player if not in formation
            redP.style.display = 'none';
            blueP.style.display = 'none';
        }
    }
}

// Ensure togglePhase also calls the new mirrored logic
function togglePhase() {
    // This will be expanded in Milestone 2 for full Atk/Def shifts
    applyTactics();
}

function setTool(tool, color) { currentColor = color; }
function clearCanvas() { ctx.clearRect(0, 0, canvas.width, canvas.height); }

canvas.onpointerdown = (e) => { isDrawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); };
canvas.onpointermove = (e) => { if (isDrawing) { ctx.strokeStyle = currentColor; ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); } };
canvas.onpointerup = () => { isDrawing = false; };

function checkBallMagnetism(ballPiece) {
    const ballRect = ballPiece.getBoundingClientRect();
    const players = document.querySelectorAll('.piece:not(.ball)');
    players.forEach(player => {
        if (player.style.display !== 'none') {
            const pRect = player.getBoundingClientRect();
            if (Math.hypot(ballRect.x - pRect.x, ballRect.y - pRect.y) < 40) {
                ballPiece.style.left = player.style.left;
                ballPiece.style.top = player.style.top;
            }
        }
    });
}
