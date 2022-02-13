export default function reducer(state, action) {
    switch(action.type){
        case 'ADD NOTE':
            console.log(state.loop)
            if(state.currentLoop.length!=0 && state.currentLoop[state.currentLoop.length-1].time>action.note.time)
                return {...state,currentLoop:[...state.currentLoop,action.note],loop:state.loop+1}
            
            else if(state.currentLoop.length===0) 
                return {...state, currentLoop: [...state.currentLoop, action.note], loop:0}
            
            else return {...state, currentLoop: [...state.currentLoop, action.note]}
        case 'ADD LOOP':
            const loop = state.currentLoop;
            return {...state, loops: [...state.loops, loop], currentLoop:[]}
    }
}