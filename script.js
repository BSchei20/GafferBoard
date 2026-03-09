const tacticalMaps = {
    "11v11": {
        "4-3-3": {
            defense: { 1:[.5,.95], 2:[.2,.8], 3:[.4,.82], 4:[.6,.82], 5:[.8,.8], 6:[.35,.65], 8:[.5,.7], 10:[.65,.65], 7:[.85,.5], 9:[.5,.45], 11:[.15,.5] },
            attack: { 1:[.5,.92], 2:[.1,.55], 3:[.38,.75], 4:[.62,.75], 5:[.9,.55], 6:[.3,.5], 8:[.5,.6], 10:[.7,.5], 7:[.92,.25], 9:[.5,.15], 11:[.08,.25] }
        },
        "4-4-2-flat": {
            defense: { 1:[.5,.95], 2:[.15,.8], 3:[.38,.82], 4:[.62,.82], 5:[.85,.8], 6:[.15,.65], 8:[.4,.65], 10:[.6,.65], 7:[.85,.65], 9:[.4,.45], 11:[.6,.45] },
            attack: { 1:[.5,.92], 2:[.1,.6], 3:[.38,.75], 4:[.62,.75], 5:[.9,.6], 6:[.1,.35], 8:[.4,.55], 10:[.6,.55], 7:[.9,.35], 9:[.4,.18], 11:[.6,.18] }
        }
    },
    "9v9": {
        "3-4-1-flat": {
            defense: { 1:[.5,.95], 2:[.25,.82], 3:[.5,.85], 4:[.75,.82], 11:[.15,.62], 8:[.38,.62], 10:[.62,.62], 7:[.85,.62], 9:[.5,.42] },
            attack: { 1:[.5,.92], 2:[.2,.7], 3:[.5,.78], 4:[.8,.7], 11:[.1,.35], 8:[.38,.5], 10:[.62,.5], 7:[.9,.35], 9:[.5,.15] }
        }
    }
};

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
    loadSavedPlays();
    window.addEventListener('resize', initCanvas);

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

/* --- FORMATION ENGINE --- */
function handleFormationChange() {
    const val = document.getElementById('formationSelect').value;
    if (val.startsWith("CUSTOM_")) {
        applyCustomTactic(val.replace("CUSTOM_", ""));
    } else {
        applyTactics();
    }
}

function applyTactics() {
    const formation = document.getElementById('formationSelect').value;
    if (!formation) return;

    // Fix: Correctly identifying the map size
    let size = "11v11";
    if (formation === "3-4-1-flat") size = "9v9";

    const redMap = tacticalMaps[size][formation][currentPhase];
    const blueMap = tacticalMaps[size][formation]['defense'];
    const w = field.clientWidth, h = field.clientHeight;

    for (let n = 1; n <= 11; n++) {
        if (redMap[n]) {
            redTeam[n].style.display = 'flex';
            blueTeam[n].style.display = 'flex';
            redTeam[n].style.left = (redMap[n][0] * w - 18) + 'px';
            redTeam[n].style.top = (redMap[n][1] * h - 18) + 'px';
            blueTeam[n].style.left = ((1 - blueMap[n][0]) * w - 18) + 'px';
            blueTeam[n].style.top = ((1 - blueMap[n][1]) * h - 18) + 'px';
        } else {
            redTeam[n].style.display = 'none';
            blueTeam[n].style.display = 'none';
        }
    }
}

/* --- CUSTOM SAVE / DELETE --- */
function saveCustomTactic() {
    const name = prompt("Name your play:");
    if (!name) return;
    const w = field.clientWidth, h = field.clientHeight;
    const snap = { red: {}, blue: {}, ball: [0,0] };
    const getPos = (el) => [parseFloat(el.style.left) / w, parseFloat(el.style.top) / h];
    for (let i in redTeam) snap.red[i] = getPos(redTeam[i]);
    for (let i in blueTeam) snap.blue[i] = getPos(blueTeam[i]);
    const ball = document.querySelector('.ball');
    if (ball) snap.ball = getPos(ball);

    const saved = JSON.parse(localStorage.getItem('gafferPlays') || '{}');
    saved[name] = snap;
    localStorage.setItem('gafferPlays', JSON.stringify(saved));
    loadSavedPlays(); // Refresh dropdown
}

function deleteCustomTactic() {
    const select = document.getElementById('formationSelect');
    const val = select.value;
    if (!val.startsWith("CUSTOM_")) {
        alert("Please select a custom play to delete.");
        return;
    }
    const name = val.replace("CUSTOM_", "");
    if (confirm(`Delete '${name}'?`)) {
        const saved = JSON.parse(localStorage.getItem('gafferPlays') || '{}');
        delete saved[name];
        localStorage.setItem('gafferPlays', JSON.stringify(saved));
        loadSavedPlays();
        select.value = "";
    }
}

function loadSavedPlays() {
    const group = document.getElementById('customGroup');
    group.innerHTML = ""; // Clear existing
    const saved = JSON.parse(localStorage.getItem('gafferPlays') || '{}');
    for (let name in saved) {
        const opt = document.createElement('option');
        opt.value = "CUSTOM_" + name;
        opt.innerText = name;
        group.appendChild(opt);
    }
}

function applyCustomTactic(name) {
    const saved = JSON.parse(localStorage.getItem('gafferPlays') || '{}');
    const data = saved[name];
    const w = field.clientWidth, h = field.clientHeight;
    const move = (el, pos) => {
        el.style.left = (pos[0] * w) + 'px';
        el.style.top = (pos[1] * h) + 'px';
    };
    for (let i in data.red) move(redTeam[i], data.red[i]);
    for (let i in data.blue) move(blueTeam[i], data.blue[i]);
    const ball = document.querySelector('.ball');
    if (ball) move(ball, data.ball);
}

/* --- UTILS --- */
function createPiece(num, color, x, y) {
    const p = document.createElement('div');
    p.className = 'piece ' + color;
    if (num === 'ball') p.classList.add('ball'); else p.innerText = num;
    p.style.left = x + 'px'; p.style.top = y + 'px';
    p.onpointerdown = (e) => {
        e.preventDefault(); e.stopPropagation();
        p.style.transition = 'none';
        p.setPointerCapture(e.pointerId);
        p.onpointermove = (ev) => {
            const rect = field.getBoundingClientRect();
            p.style.left = (ev.clientX - rect.left - 18) + 'px';
            p.style.top = (ev.clientY - rect.top - 18) + 'px';
        };
        p.onpointerup = () => {
            p.onpointermove = null;
            setTimeout(() => { p.style.transition = 'left 0.6s cubic-bezier(0.25, 1, 0.5, 1), top 0.6s cubic-bezier(0.25, 1, 0.5, 1)'; }, 10);
        };
    };
    layer.appendChild(p);
    return p;
}

function togglePhase() { currentPhase = (currentPhase === 'defense') ? 'attack' : 'defense'; applyTactics(); }
function resetBoard() {
    layer.innerHTML = '';
    const w = field.clientWidth;
    for (let i = 1; i <= 11; i++) {
        redTeam[i] = createPiece(i, 'red', 10, 10 + (i * 40));
        blueTeam[i] = createPiece(i, 'blue', w - 50, 10 + (i * 40));
    }
    createPiece('ball', 'ball', w / 2, 50);
}
function setTool(tool, color) { drawMode = true; currentColor = color; }
function clearCanvas() { ctx.clearRect(0, 0, canvas.width, canvas.height); }
