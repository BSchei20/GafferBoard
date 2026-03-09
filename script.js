/* Keep your existing tacticalMaps object at the top */

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

function setTool(tool, color) {
    drawMode = true;
    currentColor = color;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function createPiece(num, color, x, y) {
    const p = document.createElement('div');
    p.className = 'piece ' + color;
    if (num === 'ball') p.classList.add('ball'); else p.innerText = num;
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    
    p.onpointerdown = function(e) {
        e.preventDefault();
        e.stopPropagation();
        // Disable transition so dragging is instant
        p.style.transition = 'none';
        p.setPointerCapture(e.pointerId);
        
        p.onpointermove = (ev) => {
            const rect = field.getBoundingClientRect();
            p.style.left = (ev.clientX - rect.left - 18) + 'px';
            p.style.top = (ev.clientY - rect.top - 18) + 'px';
        };
        
        p.onpointerup = () => {
            p.onpointermove = null;
            // Re-enable transition for future automated movements
            setTimeout(() => {
                p.style.transition = 'left 0.6s cubic-bezier(0.25, 1, 0.5, 1), top 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
            }, 10);
            if (num === 'ball') checkBallMagnetism(p);
        };
    };
    layer.appendChild(p);
    return p;
}

function togglePhase() {
    currentPhase = (currentPhase === 'defense') ? 'attack' : 'defense';
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
            
            // Apply automated smooth movement
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
}

function checkBallMagnetism(ballPiece) {
    const ballRect = ballPiece.getBoundingClientRect();
    const players = document.querySelectorAll('.piece:not(.ball)');
    players.forEach(function(player) {
        if (player.style.display !== 'none') {
            const pRect = player.getBoundingClientRect();
            if (Math.hypot(ballRect.x - pRect.x, ballRect.y - pRect.y) < 40) {
                ballPiece.style.left = player.style.left;
                ballPiece.style.top = player.style.top;
            }
        }
    });
}
