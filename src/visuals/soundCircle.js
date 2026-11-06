const segments = 12;

export function soundCircle(p, data) {
    p.push();
    p.background(0, 25);
    p.translate(p.width / 2, p.height / 2);

    const bass = data ? data[2] : 0;
    const mid = data ? data[20] : 0;

    for (let i = 0; i < segments; i++) {
        p.push();
        p.rotate((p.TWO_PI / segments) * i);
        drawSlide(p, bass, mid);
        p.scale(1, -1);
        drawSlide(p, bass, mid);
        p.pop(); 3
    }

    p.pop();
}

function drawSlide(p, bass, mid) {
    const t = p.frameCount * 0.01;
    const distance = 100 + bass;
    const x = Math.cos(t) * distance;
    const y = Math.sin(t * 1.3) * 60

    p.noStroke();
    p.fill(255, mid, 200);
    p.circle(x, y, 20 + mid * 0.3);
}