/* --- TACTICAL MAPS (OMITTED FOR BREVITY - KEEP YOURS) --- */

let currentPhase = 'defense';
let redTeam = {}, blueTeam = {};
let isDrawing = false;
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

    // DRAWING EVENTS - Using explicit listeners
    canvas.addEventListener('pointerdown', function(e) {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = 4;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener('pointermove', function(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    });

    canvas.addEventListener('pointerup', function(e) {
        isDrawing = false;
        canvas.releasePointerCapture(e.pointerId);
    });
};

function initCanvas() {
    canvas.width = field.clientWidth;
    canvas.height = field.clientHeight;
}

function setTool(tool, color) {
    currentColor = color;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function createPiece(num, color, x, y) {
    const p = document.createElement('div');
    p.className = 'piece ' + color;
    p.style.touchAction = 'none'; 
    if (num === 'ball') p.classList.add('ball'); else p.innerText = num;
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    
    p.onpointerdown = function(e) {
        e.preventDefault();
        e.stopPropagation(); 
        p.style.transition = 'none';
        p.setPointerCapture(e.pointerId);
        
        p.onpointermove = function(ev) {
            const rect = field.getBoundingClientRect();
            p.style.left = (ev.clientX - rect.left - 18) + 'px';
            p.style.top = (ev.clientY - rect.top - 18) + (field.scrollTop || 0) + 'px';
        };
        
        p.onpointerup = function() {
            p.onpointermove = null;
            if (num === 'ball') checkBallMagnetism(p);
        };
    };
    layer.appendChild(p);
    return p;
}

function resetBoard() {
    layer.innerHTML = '';
    redTeam = {}; blueTeam = {};
    const w = field.clientWidth;
    for (let i = 1; i <= 11; i++) {
        redTeam[i] = createPiece(i, 'red', 10, 10 + (i * 40));
        blueTeam[i] = createPiece(i, 'blue', w - 50, 10 + (i * 40));
    }
    createPiece('ball', 'ball', w / 2, 100);
}

// Keep your existing togglePhase, applyTactics, and checkBallMagnetism functions below
