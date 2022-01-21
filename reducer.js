import react from "react";

export default function reducer(state, action) {
    switch(action.type){
        case 'ADD NOTE':
            return {...state, currentLoop: [...state.currentLoop, action.note]}
        case 'ADD LOOP':
            const loop = state.currentLoop;
            return {...state, loops: [...state.loops, loop], currentLoop:[]}
        case 'SET START TIME':
            console.log("START TIME: " + action.time)
            return {...state, startTime: action.time}

        default: return state
    }
}