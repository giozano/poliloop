import * as Synth from './utils/synthesizers';

const initialState = {
    bpm: 60.0,
    bpb: 4,
    bars: 4,
    minVolume: -40.0,
    metronomes: {},
    instruments: {
        'kick': {
            notes: [],
            synth: Synth.kick,
        },
        'keys': {
            notes: [],
            synth: Synth.keys,
        },
        'lead': {
            notes: [],
            synth: Synth.lead,
        },
        'bass': {
            notes: [],
            synth: Synth.bass,
        }
    },
    currentLoop: [],
    loop: 1,
    loops:[],
    counter:0
}

export default initialState;