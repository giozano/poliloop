import react from "react"

export default function reducer(state, action) {
    switch(action.type){
        case 'SET NOTE':
            console.log(action.note)
            return {...state, currentLoop: [...state.currentLoop, action.note]}
        case 'LOOP':
             const loop = state.currentLoop;
            return {...state, loops: [...state.loops, loop], currentLoop:[]}
        case 'SET START':
            console.log(action.time)
            return {...state, start: action.time}

        default: return state
    }
}