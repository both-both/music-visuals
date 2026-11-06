const size = 160;
const h = (size * Math.sqrt(3)) / 2;
const pieceCount = 40;

const palette = [
    [220, 30, 50],   // rød
    [30, 90, 220],   // blå
    [255, 140, 20],  // orange
    [170, 200, 40],  // gulgrøn
    [20, 160, 140],  // turkis
    [140, 60, 180],  // lilla
];

let chamber;
let hexagon;
let scene;
let blurred;
let pieces;
let turn = 0;
let smooth = 0;

export function kaleidoscope4(p, data) {
    if (!chamber) setup(p);

    const bass = data ? data[2] : 0;
    const beat = Math.max(0, bass - 180) / 75; // 195 + 60 = 255. Ret begge, hvis tærsklen ændres
    smooth += (beat - smooth) * 0.15;

    turn += 0.002 + smooth * 0.03;

    drawChamber(p, smooth);
    drawHexagon();
    drawTiles(p);
    drawFocus(p);
}

function setup(p) {
    chamber = p.createGraphics(size, size);
    hexagon = p.createGraphics(size * 2, size * 2);
    scene = p.createGraphics(p.width, p.height);
    blurred = p.createGraphics(p.width, p.height);

    pieces = [];
    for (let i = 0; i < pieceCount; i++) {
        pieces.push({
            angle: p.random(p.TWO_PI),
            distance: p.random(size * 0.7),
            color: p.random(palette),
            type: p.random(['petal', 'bead', 'shard']),
            length: p.random(20, 60),
            spin: p.random(-0.02, 0.02),
        });
    }
}

function drawChamber(p, smooth) {

    chamber.blendMode(p.BLEND);
    chamber.background(250, 245, 235)
    chamber.blendMode(p.MULTIPLY);
    chamber.stroke(0, 60);
    chamber.strokeWeight(1);

    const swell = 1 + smooth * 1.5;

    for (const piece of pieces) {
        const angle = piece.angle + turn;
        const x = size / 2 + Math.cos(angle) * piece.distance;
        const y = size / 2 + Math.sin(angle) * piece.distance;
        const len = piece.length * swell;
        const [red, green, blue] = piece.color;

        chamber.push();
        chamber.translate(x, y);
        chamber.rotate(angle * 2 + p.frameCount * piece.spin);
        chamber.fill(red, green, blue, 190);

        if (piece.type === 'petal') chamber.ellipse(0, 0, len, len * 0.35);
        if (piece.type === 'bead') chamber.circle(0, 0, len * 0.5);
        if (piece.type === 'shard') chamber.triangle(-len / 2, len / 3, len / 2, len / 3, 0, -len / 2);

        chamber.pop();
    }
}

function drawHexagon() {
    const ctx = hexagon.drawingContext;
    hexagon.clear();

    for (let k = 0; k < 6; k++) {
        ctx.save();
        ctx.translate(size, size);

        if (k % 2 === 0) {
            ctx.rotate((k * Math.PI) / 3);
        } else {
            ctx.rotate((k + 1) * Math.PI / 3);
            ctx.scale(1, -1);
        }

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(size, 0);
        ctx.lineTo(size / 2, h);
        ctx.closePath();
        ctx.clip();

        hexagon.image(chamber, 0, 0);

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }
}

function drawTiles(p) {
    scene.clear();

    const stepX = size * 1.5;
    const stepY = h * 2;
    let col = 0;

    for (let x = 0; x < p.width + stepX; x += stepX) {
        const offset = col % 2 === 0 ? 0 : h;
        for (let y = -stepY; y < p.height + stepY; y += stepY) {
            scene.image(hexagon, x - size, y + offset - size);
        }
        col++;

    }
}

function drawFocus(p) {
    p.image(scene, 0, 0);

    blurred.clear();
    blurred.image(scene, 0, 0);
    blurred.filter(p.BLUR, 8);

    const cx = p.width / 2;
    const cy = p.height / 2;
    const inner = Math.min(p.width, p.height) * 0.2;
    const outer = Math.hypot(p.width, p.height) / 2;

    const bctx = blurred.drawingContext;
    const mask = bctx.createRadialGradient(cx, cy, inner, cx, cy, outer);
    mask.addColorStop(0, 'rgba(0, 0, 0, 0)');
    mask.addColorStop(1, 'rgba(0, 0, 0, 1)');
    bctx.save();
    bctx.globalCompositeOperation = 'destination-in';
    bctx.fillStyle = mask;
    bctx.fillRect(0, 0, p.width, p.height);
    bctx.restore();

    p.image(blurred, 0, 0);

    const ctx = p.drawingContext;
    const vignette = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
    ctx.save();
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, p.width, p.height);
    ctx.restore();
}




