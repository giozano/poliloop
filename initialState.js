import * as Synth from './utils/synthesizers';

const initialState = {
    bpm: 60,
    bpb: 4,
    bars: 4,
    instruments: {
        'drums': {
            notes: [],
            synth: Synth.drums,
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
    currentInstrument: 'keys',
    currentLoop: [],
    loop: 1,
    loops:[],
    counter:0
}

export default initialState;