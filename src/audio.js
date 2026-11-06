let audioContext;
let analyser;
let data;

let player;
let playlist = [];
let track = 0;

const picker = document.createElement('input');
picker.type = 'file';
picker.accept = 'audio/*';
picker.multiple = true;

picker.addEventListener('change', () => {
    playlist = [...picker.files];
    track = 0;
    playTrack();
});

function setup() {
    if (audioContext) return;

    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    data = new Uint8Array(analyser.frequencyBinCount);

    player = new Audio();
    const source = audioContext.createMediaElementSource(player);
    source.connect(analyser);
    source.connect(audioContext.destination);

    player.addEventListener('ended', nextTrack);
}

function playTrack() {
    setup();
    const file = playlist[track];
    if (!file) return;

    player.src = URL.createObjectURL(file);
    player.play();
    console.log(`Spiller ${track + 1}/${playlist.length}: ${file.name}`);
}

function nextTrack() {
    if (track < playlist.length - 1) {
        track++;
        playTrack();
    }
}

function togglePause() {
    if (!player) return;
    if (player.paused) {
        player.play();
    } else {
        player.pause();
    }
}

async function startInput() {
    setup();
    player.pause();

    const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
        },
    });
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
}

export function getData() {
    if (analyser) analyser.getByteFrequencyData(data);
    return data;
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'o') picker.click();
    if (e.key === ' ') togglePause();
    if (e.key === 'n') nextTrack();
    if (e.key === 'm') startInput();
});
