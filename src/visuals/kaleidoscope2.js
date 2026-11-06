const segments = 12;
const rings = 8;

export function kaleidoscope2(p, data) {
    p.push();
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.background(0, 0, 0, 30);
    p.translate(p.width / 2, p.height / 2);

    const bass = data ? data[2] : 0;
    const mid = data ? data[20] : 0;

    for (let i = 0; i < segments; i++) {
        p.push();
        p.rotate((p.TWO_PI / segments) * i);
        drawSlide(p, bass, mid);
        p.scale(1, - 1);
        drawSlide(p, bass, mid);
        p.pop();
    }

    p.pop();
}
function drawSlide(p, bass, mid) {
    const t = p.frameCount * 0.01;
    const maxRadius = Math.hypot(p.width, p.height) / 2;

    p.noStroke();

    for (let r = 0; r < rings; r++) {
        const distance = ((r + 1) / rings) * maxRadius;
        const hue = (r * 45 + p.frameCount) % 360;
        const size = 30 + r * 12 + bass * 0.3;
        const direction = r % 2 === 0 ? 1 : -1;

        p.push();
        p.rotate(Math.sin(t + r) * 0.3);
        p.translate(distance, 0);
        p.rotate(t * direction);

        p.fill(hue, 90, 100);
        p.ellipse(0, size * 0.3, size, size * 0.4);

        p.fill((hue + 60) % 360, 90, 100);
        p.circle(0, 0, size * 0.4 + mid * 0.1);

        p.pop()
    }
}