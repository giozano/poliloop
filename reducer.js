export default function reducer(state, action) {
    switch(action.type){
        case 'ADD NOTE':
            return {...state, currentLoop: [...state.currentLoop, action.note]}
        case 'ADD LOOP':
            const loop = state.currentLoop;
            return {...state, loops: [...state.loops, loop], currentLoop:[]}
    }
}