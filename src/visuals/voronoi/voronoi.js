// Baseret på "#WCCC_Obscure_bg_submission" af its_just_user_now
// https://openprocessing.org/sketch/2211029 (CC BY-NC-SA 3.0)

import p5 from 'p5';
import vert from './voronoi.vert?raw';
import frag from './voronoi.frag?raw';

const maxPoints = 10;
const maxSpeed = 0.2;
const proportions = [0.5, 0.3, 0.2];

let g;
let theShader;
let colors;
let points = [];
let directions = [];
let smooth = 0;

export function voronoi(p, data) {
    if (!g) setup(p);

    const bass = data ? data[2] : 0;
    const threshold = 100;
    const ceiling = 160;
    const beat = Math.min(1, Math.max(0, bass - threshold) / (ceiling - threshold));
    smooth += (beat - smooth) * 0.15;
    if (p.frameCount % 30 === 0) console.log(bass, beat.toFixed(2), smooth.toFixed(2));


    const speed = smooth * 8;
    for (let type = 0; type < 3; type++) {
        for (let i = 0; i < maxPoints; i++) {
            updatePoint(p, type, i, speed);
        }
    }

    g.shader(theShader);
    theShader.setUniform('u_resolution', [p.width, p.height]);
    theShader.setUniform('u_points', points.flat().flatMap((v) => [v.x, v.y]));
    theShader.setUniform('u_colors', colors);
    theShader.setUniform('u_size', 0.2 + smooth * 0.15);
    g.rect(0, 0, p.width, p.height);

    p.image(g, 0, 0);
}

function setup(p) {
    g = p.createGraphics(p.width, p.height, p.WEBGL);
    g.pixelDensity(1);
    g.noStroke();
    theShader = g.createShader(vert, frag);

    const [a, b, c] = proportions;
    colors = [a, b, c, c, a, b, b, c, a];

    for (let type = 0; type < 3; type++) {
        points[type] = [];
        directions[type] = [];
        for (let i = 0; i < maxPoints; i++) {
            points[type][i] = p.createVector((p.random() - 0.5) * p.width, (p.random() - 0.5) * p.height);
            directions[type][i] = p5.Vector.random2D().mult(100);
        }
    }
}

function updatePoint(p, type, index, speed) {
    const point = points[type][index];
    const force = p5.Vector.mult(point, -1).limit(maxSpeed);

    for (let i = 0; i < maxPoints; i++) {
        if (i === index) continue;
        const diff = p5.Vector.sub(points[type][i], point).limit(maxSpeed);
        force.add(diff);
    }

    directions[type][index].add(force.mult(speed / 2));
    point.add(p5.Vector.mult(directions[type][index], p.deltaTime * 0.001 * speed));
}
