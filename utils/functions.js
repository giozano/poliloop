import * as Tone from 'tone';
import * as Synth from '../utils/synthesizers';

const subdivisions = [3,4,5,7];
const metronomeHigh = "G3";
const metronomeLow = "C3";

export function polyrhythms(metronomeLoopTime) {
    const metronomes = new Map();
    subdivisions.forEach(function(subdivision, index) {
        const synth = new Tone.MembraneSynth(Synth.metronome).toDestination();
        const metronome = new Tone.Part(((time, note) => {
            synth.triggerAttackRelease(note, "n", time);
        }), metronomeNew(subdivision, metronomeLoopTime));
        metronome.loop = true;
        metronome.loopEnd = metronomeLoopTime;
        metronomes.set(
            subdivision,
            {
                synth: synth,
                part: metronome,
            }
        );
    });
    return metronomes;
}

// superimpose=state.bpb*state.bars
function metronomeNew(superimpose, metronomeLoopTime) {
    let interval = metronomeLoopTime/superimpose;
    var poly_new = new Array();
    for (let i=0;i<superimpose;i++){
        if(i===0) poly_new.push([0,metronomeHigh]);
        else poly_new.push([i*interval,metronomeLow]);
    }
    return poly_new;
}