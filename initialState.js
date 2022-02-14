import * as Synth from './utils/synthesizers';

const initialState = {
    bpm: 60,
    bpb: 4,
    bars: 4,
    minVolume: -40.0,
    metronomes: {},
    instruments: {
        'drums': {
            notes: [],
            loops:[],
            synth: Synth.drums,
        },
        'keys': {
            notes: [],
            loops: [],
            synth: Synth.keys,
        },
        'lead': {
            notes: [],
            loops: [],
            synth: Synth.lead,
        },
        'bass': {
            notes: [],
            loops: [],
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