export default function reducer(state, action) {
    switch(action.type) {
        case 'ADD NOTE':
            if(state.currentLoop.length!=0 && state.currentLoop[state.currentLoop.length-1].time>action.note.time) {
                let newState = {
                    ...state,loop:state.loop+1,
                    loops: [...state.loops, state.currentLoop.filter(e=>state.currentLoop.indexOf(e) >= state.counter)],
                    counter: state.currentLoop.length,
                    currentLoop: [...state.currentLoop, action.note],
                    instruments: {...state.instruments, [action.instrument]: {...state.instruments[action.instrument], notes: [...state.instruments[action.instrument].notes, action.note]}}
                }
                console.log("NUOVO STATO ", newState);
                return newState;
            }
            else if(state.currentLoop.length===0) {
                let newState = {
                    ...state,
                    currentLoop: [...state.currentLoop, action.note],
                    loop:1,
                    loops:[],
                    counter:0,
                    instruments: {...state.instruments, [action.instrument]: {...state.instruments[action.instrument], notes: [...state.instruments[action.instrument].notes, action.note]}}
                }
                console.log("NUOVO STATO ", newState);
                return newState;
            }
            else {
                let newState = {
                    ...state,
                    currentLoop: [...state.currentLoop, action.note],
                    instruments: {...state.instruments, [action.instrument]: {...state.instruments[action.instrument], notes: [...state.instruments[action.instrument].notes, action.note]}}
                }
                console.log("NUOVO STATO ", newState);
                return newState;
            }
        case 'ADD LOOP':
            const loop = state.currentLoop;
            return {...state, loops: [...state.loops, loop], currentLoop:[]}
        case 'SET METRONOMES':
            return {...state, metronomes: action.metronomes}
        case 'SET BPM':
            return {...state, bpm: action.bpm}
        case 'SET BARS':
            return {...state, bars: action.bars}
        case 'CHANGE INSTRUMENT':
            return {...state, currentInstrument: action.instrument}
    }
}