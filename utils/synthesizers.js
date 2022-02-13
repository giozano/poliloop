import * as Tone from 'tone';

const keys = new Tone.Synth().toDestination();
const metronome = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 3,
    oscillator: {type: 'sine'},
    envelope: {
        attack: 0.015,
        decay: 0.01,
        sustain: 0.001,
        release: 0.1,
        attackCurve: 'linear'
    }
}).toDestination();

export {
    keys,
    metronome
}