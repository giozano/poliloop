export function addNote(note) {
    return({type: 'ADD NOTE', note: note});
}

export function addLoop() {
    return({type: 'ADD LOOP'});
}

export function setStartRec(r) {
    return({type: 'START REC', value: r});
}

export function setStopRec(r) {
    return({type: 'STOP REC', value: r});
}