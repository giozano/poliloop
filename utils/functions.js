import * as Tone from 'tone';
import * as Synth from '../utils/synthesizers';

const metronomeHigh = "G3";
const metronomeLow = "C3";

export function polyrhythms(bpb, maxSubdivision, metronomeLoopTime) {
    const metronomes = new Map();
    for(let i=bpb;i<=maxSubdivision;i++) {
        const metronome = new Tone.Part(((time, note) => {
            Synth.metronome.triggerAttackRelease(note, "n", time);
        }), metronomeNew(i, metronomeLoopTime)).start(0);
        metronome.loop = true;
        metronome.loopEnd = metronomeLoopTime;
        metronomes.set(i,metronome);
    }
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