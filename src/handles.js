const SVG_NS = 'http://www.w3.org/2000/svg';

export function createHandles(corners, onChange) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.classList.add('handles');
    document.body.appendChild(svg);

    const outline = document.createElementNS(SVG_NS, 'polygon');
    outline.classList.add('outline');
    svg.appendChild(outline);

    const dots = corners.map((corner) => {
        const dot = document.createElementNS(SVG_NS, 'circle');
        dot.setAttribute('r', 12);
        dot.classList.add('handle');
        svg.appendChild(dot);

        dot.addEventListener('pointerdown', (e) => {
            dot.setPointerCapture(e.pointerId);
        });

        dot.addEventListener('pointermove', (e) => {
            if (!dot.hasPointerCapture(e.pointerId)) return;
            corner.set(
                (e.clientX / window.innerWidth) * 2 - 1,
                -(e.clientY / window.innerHeight) * 2 + 1
            );
            onChange();
            render();
        });

        dot.addEventListener('pointerup', () => {
            console.log(JSON.stringify(corners));
        });

        return dot;
    });

    function toPixels(corner) {
        return {
            x: ((corner.x + 1) / 2) * window.innerWidth,
            y: ((1 - corner.y) / 2) * window.innerHeight,
        };
    }

    function render() {
        const points = corners.map(toPixels);
        points.forEach((point, i) => {
            dots[i].setAttribute('cx', point.x);
            dots[i].setAttribute('cy', point.y);
        });
        outline.setAttribute('points', points.map((point) => `${point.x},${point.y}`).join(' '));
    }

    render();

    window.addEventListener('keydown', (e) => {
        if (e.key === 'f') svg.classList.toggle('hidden');
    });
}
