export function bars(p, data) {
    p.background(0);
    p.fill(0, 200, 255);

    const count = 32;
    const w = p.width / count;

    for (let i = 0; i < count; i++) {
        const level = data ? data[i] : 0;
        const h = p.map(level, 0, 255, 0, p.height);
        p.rect(i * w, p.height - h, w - 4, h)
    }
}