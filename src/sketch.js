import { getData } from './audio.js';
import p5 from 'p5'
import { circles } from './visuals/circles.js';
import { bars } from './visuals/bars.js';
import { soundCircle } from './visuals/soundCircle.js';
import { kaleidoscope } from './visuals/kaleidoscope.js';
import { kaleidoscope3 } from './visuals/kaleidoscope3.js';
import { kaleidoscope4 } from './visuals/kaleidoscope4.js';



const visuals = [circles, bars, kaleidoscope, soundCircle, kaleidoscope3, kaleidoscope4];
let current = 0

// STYRING UNDER KONCERTEN
// O         Åbn lydfiler (vælg flere for en setliste)
// Mellemrum Pause / afspil
// N         Næste nummer
// M         Brug lydindgangen (line-in fra DJ-mixeren)
// F         Vis eller skjul rammen
// 1         Cirkler
// 2         Søjler
// 3         Kaleidoscope
// 4         SoundCircle
// 5         Kaleidoscope3
// 6         Kaleidoscope4
// Træk i et hjørne af fladen for at mappe til lærredet
window.addEventListener('keydown', (e) => {
    const number = Number(e.key);
    if (number >= 1 && number <= visuals.length) {
        current = number - 1;
    }
});

export function createSketch(onReady) {

    new p5((p) => {
        p.setup = () => {
            const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.hide()
            onReady(canvas.elt)
        };

        p.draw = () => {
            const data = getData();
            visuals[current](p, data);
        };



    })
};