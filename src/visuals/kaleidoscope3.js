const segments = 8;
const rings = 5;
const spacing = 400;


const shardCols = 4;
const shardRows = 3;

let sharp;
let blurred;
let shards

export function kaleidoscope3(p, data) {
    if (!sharp) setupShards(p);

    const bass = data ? data[2] : 0;
    const mid = data ? data[20] : 0;

    sharp.push();
    sharp.colorMode(p.HSB, 360, 100, 100, 100);
    sharp.background(0, 0, 0, 30);
    sharp.noStroke();

    const rowHeight = spacing * 0.87;
    let row = 0;

    for (let y = 0; y < p.height + spacing; y += rowHeight) {
        const offset = 2 === 0 ? 0 : spacing / 2;
        const direction = row % 2 === 0 ? 1 : -1;

        for (let x = -spacing; x < p.width + spacing; x += spacing) {
            drawMandala(p, sharp, x + offset, y, spacing * 0.6, direction, bass, mid);
        }
        row++;
    }
    sharp.pop();

    blurred.clear();
    blurred.image(sharp, 0, 0);
    blurred.filter(p.BLUR, 6);

    p.background(0)
    const spread = 1 + bass / 255;
    for (const shard of shards) {
        drawShard(p, shard, spread);
    }
}

function setupShards(p) {
    sharp = p.createGraphics(p.width, p.height);
    blurred = p.createGraphics(p.width, p.height);

    const points = [];
    for (let row = 0; row <= shardRows; row++) {
        points[row] = [];
        for (let col = 0; col <= shardCols; col++) {
            const edge = row === 0 || row === shardRows || col === 0 || col === shardCols;
            const jitter = edge ? 0 : 0.35;
            points[row][col] = {
                x: ((col + p.random(-jitter, jitter)) / shardCols) * p.width,
                y: ((row + p.random(-jitter, jitter)) / shardRows) * p.height,
            };
        }
    }
    shards = [];
    for (let row = 0; row < shardRows; row++)
        for (let col = 0; col < shardCols; col++) {
            const a = points[row][col];
            const b = points[row][col + 1];
            const c = points[row + 1][col + 1];
            const d = points[row + 1][col];
            shards.push(makeShard(p, [a, b, c]));
            shards.push(makeShard(p, [a, c, d]));
        }
}

function makeShard(p, corners) {
    return {
        corners,
        dx: p.random(-30, 30),
        dy: p.random(-30, 30),
        blur: p.random() < 0.4,
    };
}

function drawShard(p, shard, spread) {
    const ctx = p.drawingContext;
    const [a, b, c] = shard.corners;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.closePath()
    ctx.clip();

    p.image(shard.blur ? blurred : sharp, shard.dx * spread, shard.dy * spread);

    ctx.restore(),

        p.push();
    p.noFill();
    p.stroke(255, 50);
    p.strokeWeight(2);
    p.triangle(a.x, a.y, b.x, b.y, c.x, c.y);
    p.pop();
}

function drawMandala(p, g, x, y, radius, direction, bass, mid) {
    g.push();
    g.translate(x, y);
    g.rotate(p.frameCount * 0.005 * direction);

    for (let i = 0; i < segments; i++) {
        g.push();
        g.rotate((p.TWO_PI / segments) * i);
        drawSlide(p, g, radius, bass, mid);
        g.scale(1, -1);
        drawSlide(p, g, radius, bass, mid);
        g.pop()
    }
    g.pop();
}

function drawSlide(p, g, radius, bass, mid) {
    const t = p.frameCount * 0.01;

    for (let r = 0; r < rings; r++) {
        const distance = ((r + 1) / rings) * radius;
        const hue = (r * 45 + p.frameCount) % 360;
        const size = 15 + r * 8 + bass * 0.15;
        const direction = r % 2 === 0 ? 1 : -1;

        g.push();
        g.rotate(Math.sin(t + r) * 0.3);
        g.translate(distance, 0);
        g.rotate(t * direction);

        g.fill(hue, 90, 100);
        g.ellipse(0, size * 0.3, size, size * 0.4);

        g.fill((hue + 60) % 360, 90, 100);
        g.circle(0, 0, size * 0.4 + mid * 0.05);

        g.pop()
    }
}