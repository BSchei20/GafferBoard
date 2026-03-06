/* --- TACTICAL DATA --- */
const tacticalMaps = {
    "11v11": {
        "4-3-3": {
            defense: { 1:[.5,.95], 2:[.2,.8], 3:[.4,.82], 4:[.6,.82], 5:[.8,.8], 6:[.35,.65], 8:[.5,.7], 10:[.65,.65], 7:[.85,.5], 9:[.5,.45], 11:[.15,.5] },
            attack: { 1:[.5,.92], 2:[.1,.55], 3:[.38,.75], 4:[.62,.75], 5:[.9,.55], 6:[.3,.5], 8:[.5,.6], 10:[.7,.5], 7:[.92,.25], 9:[.5,.15], 11:[.08,.25] }
        },
        "4-4-2-flat": {
            defense: { 1:[.5,.95], 2:[.15,.8], 3:[.38,.82], 4:[.62,.82], 5:[.85,.8], 6:[.15,.65], 8:[.4,.65], 10:[.6,.65], 7:[.85,.65], 9:[.4,.45], 11:[.6,.45] },
            attack: { 1:[.5,.92], 2:[.1,.6], 3:[.38,.75], 4:[.62,.75], 5:[.9,.6], 6:[.1,.35], 8:[.4,.55], 10:[.6,.55], 7:[.9,.35], 9:[.4,.18], 11:[.6,.18] }
        },
        "4-4-2-diamond": {
            defense: { 1:[.5,.95], 2:[.2,.8], 3:[.4,.82], 4:[.6,.82], 5:[.8,.8], 8:[.5,.72], 6:[.35,.62], 7:[.65,.62], 10:[.5,.55], 9:[.4,.42], 11:[.6,.42] },
            attack: { 1:[.5,.92], 2:[.15,.55], 3:[.4,.75], 4:[.6,.75], 5:[.85,.55], 8:[.5,.6], 6:[.3,.5], 7:[.7,.5], 10:[.5,.35], 9:[.4,.15], 11:[.6,.15] }
        },
        "3-5-2": {
            defense: { 1:[.5,.95], 3:[.3,.82], 8:[.5,.82], 4:[.7,.82], 2:[.15,.65], 6:[.35,.65], 10:[.5,.55], 5:[.65,.65], 7:[.85,.65], 9:[.4,.4], 11:[.6,.4] },
            attack: { 1:[.5,.92], 3:[.3,.75], 8:[.5,.75], 4:[.7,.75], 2:[.1,.35], 6:[.35,.5], 10:[.5,.35], 5:[.65,.5], 7:[.9,.35], 9:[.42,.15], 11:[.58,.15] }
        }
    },
    "9v9": {
        "3-2-3": {
            defense: { 1:[.5,.95], 2:[.25,.82], 3:[.5,.85], 4:[.75,.82], 8:[.4,.68], 10:[.6,.68], 11:[.2,.5], 7:[.8,.5], 9:[.5,.42] },
            attack: { 1:[.5,.92], 2:[.15,.65], 3:[.5,.75], 4:[.85,.65], 8:[.35,.5], 10:[.65,.5], 11:[.1,.25], 7:[.9,.25], 9:[.5,.15] }
        },
        "3-4-1-flat": {
            defense: { 1:[.5,.95], 2:[.25,.82], 3:[.5,.85], 4:[.75,.82], 11:[.15,.62], 8:[.38,.62], 10:[.62,.62], 7:[.85,.62], 9:[.5,.42] },
            attack: { 1:[.5,.92], 2:[.2,.7], 3:[.5,.78], 4:[.8,.7], 11:[.1,.35], 8:[.38,.5], 10:[.62,.5], 7:[.9,.35], 9:[.5,.15] }
        },
        "3-4-1-diamond": {
            defense: { 1:[.5,.95], 2:[.25,.82], 3:[.5,.85], 4:[.75,.82], 8:[.5,.7], 7:[.3,.6], 11:[.7,.6], 10:[.5,.52], 9:[.5,.38] },
            attack: { 1:[.5,.92], 2:[.2,.7], 3:[.5,.78], 4:[.8,.7], 8:[.5,.6], 7:[.25,.45], 11:[.75,.45], 10:[.5,.32], 9:[.5,.12] }
        },
        "3-3-2": {
            defense: { 1:[.5,.95], 2:[.25,.82], 3:[.5,.85], 4:[.75,.82], 8:[.3,.62], 10:[.5,.65], 7:[.7,.62], 9:[.4,.42], 11:[.6,.42] },
            attack: { 1:[.5,.92], 2:[.15,.65], 3:[.5,.75], 4:[.85,.65], 8:[.25,.45], 10:[.5,.5], 7:[.75,.45], 9:[.4,.15], 11:[.6,.15] }
        }
    },
    "6v6": {
        "2-2-1": {
            defense: { 1:[.5,.95], 2:[.3,.82], 4:[.7,.82], 8:[.4,.65], 10:[.6,.65], 9:[.5,.45] },
            attack: { 1:[.5,.92], 2:[.2,.65], 4:[.8,.65], 8:[.35,.45], 10:[.65,.45], 9:[.5,.2] }
        }
    }
};

/* --- STATE --- */
let currentPhase = 'defense';
let redTeam = {}, blueTeam = {};
let isDrawing = false;
let drawMode = false;
let currentColor = 'black';
let field, layer, canvas, ctx;

window.onload = function() {
    field = document.getElementById('field');
    layer = document.getElementById('pieces-layer');
    canvas = document.getElementById('drawLayer');
    ctx = canvas.getContext('2d');
    
    initCanvas();
    resetBoard();
    
    window.addEventListener('resize', initCanvas);

    // DRAWING LOGIC
    canvas.addEventListener('pointerdown', (e) => {
        if (!drawMode) return;
        isDrawing = true;
        ctx.beginPath();
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        const rect = canvas.getBoundingClientRect();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    });

    canvas.addEventListener('pointermove', (e) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    });

    canvas.addEventListener('pointerup', () => isDrawing = false);
};

function initCanvas() {
    canvas.width = field.clientWidth;
    canvas.height = field.clientHeight;
}

/* --- BUTTON ACTIONS --- */
function setTool(tool, color) {
    drawMode = true;
    currentColor = color;
    canvas.style.pointerEvents = 'auto'; // Enable drawing
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMode = false;
    canvas.style.pointerEvents = 'none'; // Re-enable piece dragging
}

function togglePhase() {
    currentPhase = (currentPhase === 'defense') ? 'attack' : 'defense';
    console.log("Switched to:", currentPhase);
    applyTactics();
}

function applyTactics() {
    const formation = document.getElementById('formationSelect').value;
    if (!formation) return;

    let size = "11v11";
    if (["3-2-3", "3-4-1-flat", "3-4-1-diamond", "3-3-2"].includes(formation)) size = "9v9";
    if (formation === "2-2-1") size = "6v6";

    const redMap = tacticalMaps[size][formation][currentPhase];
    const blueMap = tacticalMaps[size][formation]['defense'];
    const w = field.clientWidth;
    const h = field.clientHeight;

    for (let n = 1; n <= 11; n++) {
        const redP = redTeam[n];
        const blueP = blueTeam[n];
        if (redMap && redMap[n]) {
            redP.style.display = 'flex';
            blueP.style.display = 'flex';
            redP.style.transition = 'all 0.6s ease-out';
            blueP.style.transition = 'all 0.6s ease-out';
            
            redP.style.left = (redMap[n][0] * w - 18) + 'px';
            redP.style.top = (redMap[n][1] * h - 18) + 'px';
            
            blueP.style.left = ((1 - blueMap[n][0]) * w - 18) + 'px';
            blueP.style.top = ((1 - blueMap[n][1]) * h - 18) + 'px';
        } else {
            if (redP) redP.style.display = 'none';
            if (blueP) blueP.style.display = 'none';
        }
    }
}

function resetBoard() {
    layer.innerHTML = '';
    const w = field.clientWidth;
    for (let i = 1; i <= 11; i++) {
        redTeam[i] = createPiece(i, 'red', 10, 10 + (i * 40));
        blueTeam[i] = createPiece(i, 'blue', w - 50, 10 + (i * 40));
    }
    createPiece('ball', 'ball', w / 2, 50);
    clearCanvas();
}

function createPiece(num, color, x, y) {
    const p = document.createElement('div');
    p.className = 'piece ' + color;
    if (num === 'ball') p.classList.add('ball'); else p.innerText = num;
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    
    p.onpointerdown = function(e) {
        if (drawMode) return; // Don't drag if we are drawing
        e.preventDefault();
        p.setPointerCapture(e.pointerId);
        p.onpointermove = (ev) => {
            const rect = field.getBoundingClientRect();
            p.style.left = (ev.clientX - rect.left - 18) + 'px';
            p.style.top = (ev.clientY - rect.top - 18) + 'px';
        };
        p.onpointerup = () => p.onpointermove = null;
    };
    layer.appendChild(p);
    return p;
}
