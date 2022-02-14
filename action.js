export function addNote(note, instrument) {
    return({type: 'ADD NOTE', note: note, instrument: instrument});
}

export function addLoop() {
    return({type: 'ADD LOOP'});
}

export function setMetronomes(metronomes) {
    return({type: 'SET METRONOMES', metronomes: metronomes});
}

export function setBpm(bpm) {
    return({type: 'SET BPM', bpm: bpm});
}

export function setBars(bars) {
    return({type: 'SET BARS', bars: bars});
}