import react from "react"
import { stocazzo } from "./action"

export default function reducer(state, action) {
    switch(action.type){

        case 'STOCAZZO':
            return {...state, poverini: [...state.poverini, 'STOCAZZO'+action.nome]}
        case 'SET NOTE':
            console.log(action.note)
            return {...state, looptemp: [...state.looptemp, action.note]}
        case 'LOOP':
             const loop=state.looptemp;
            return {...state, loop: [...state.loop, loop], looptemp:[]}
        case 'SET START':
            console.log(action.time)
            return {...state, start: action.time}

        default: return state
    }
}