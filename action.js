export function addNote(note, instrument) {
    return({type: 'ADD NOTE', note: note, instrument: instrument});
}

export function addLoop() {
    return({type: 'ADD LOOP'});
}