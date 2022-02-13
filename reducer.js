export default function reducer(state, action) {
    switch(action.type){
        case 'ADD NOTE':
            return {...state, currentLoop: [...state.currentLoop, action.note]}
        case 'ADD LOOP':
            const loop = state.currentLoop;
            return {...state, loops: [...state.loops, loop], currentLoop:[]}
        case 'START REC':
            return {...state, startRec: action.value}
        case 'STOP REC':
            return {...state, stopRec: action.value}
    }
}