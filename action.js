export function addNote(note) {
    return({type: 'ADD NOTE', note:note})
}

export function addLoop() {
    return({type:'ADD LOOP'})
}

export function setStartTime(time) {
    return({type:'SET START TIME', time:time})
}