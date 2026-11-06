const segments = 8;
const rings = 5;
const spacing = 400;

export function kaleidoscope(p, data) {
    p.push();
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.background(0, 0, 0, 30);
    p.noStroke();

    const bass = data ? data[2] : 0;
    const mid = data ? data[20] : 0;

    const rowHeight = spacing * 0.87;
    let row = 0;

    for (let y = 0; y < p.height + spacing; y += rowHeight) {
        const offset = row % 2 === 0 ? 0 : spacing / 2;
        const direction = row % 2 === 0 ? 1 : -1;

        for (let x = -spacing; x < p.width + spacing; x += spacing) {
            drawMandala(p, x + offset, y, spacing * 0.6, direction, bass, mid);
        }
        row++;
    }
    p.pop();
}

function drawMandala(p, x, y, radius, direction, bass, mid) {
    p.push();
    p.translate(x, y);
    p.rotate(p.frameCount * 0.005 * direction);

    for (let i = 0; i < segments; i++) {
        p.push();
        p.rotate((p.TWO_PI / segments) * i);
        drawSlide(p, radius, bass, mid);
        p.scale(1, -1);
        drawSlide(p, radius, bass, mid);
        p.pop()
    }

    p.pop()
}

function drawSlide(p, radius, bass, mid) {
    const t = p.frameCount * 0.01;

    for (let r = 0; r < rings; r++) {
        const distance = ((r + 1) / rings) * radius;
        const hue = (r * 45 + p.frameCount) % 360;
        const size = 15 + r * 8 + bass * 0.15;
        const direction = r % 2 === 0 ? 1 : -1;

        p.push();
        p.rotate(Math.sin(t + r) * 0.3);
        p.translate(distance, 0);
        p.rotate(t * direction);

        p.fill(hue, 90, 100);
        p.ellipse(0, size * 0.3, size, size * 0.4);

        p.fill((hue + 60) % 360, 90, 100);
        p.circle(0, 0, size * 0.4 + mid * 0.05);

        p.pop();
    }
}
