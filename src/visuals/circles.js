const thresholds = [190, 130, 130, 120, 100, 110, 110, 110, 50, 50];

export function circles(p, data) {
    p.background(0, 20);
    p.fill(255, 0, 255);

    const spacing = p.width / 10;

    for (let i = 0; i < 10; i++) {
        const x = spacing * i + spacing / 2;
        const level = data ? data[i * 3] : 0;
        const sound = Math.max(0, level - thresholds[i]);

        p.circle(x, p.height / 2, 50 + sound * 3);
    }
}
