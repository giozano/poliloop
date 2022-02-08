import * as Tone from 'tone';
import { WebMidi } from "webmidi";
import { useState } from 'react';
import { useStateValue } from '../state';
import { addNote } from "../action";

// SETTINGS
const noteDuration = "8n";

// METRONOME
Tone.Transport.bpm.value = 60;
const metronomeSynth = new Tone.Synth().toDestination();
const metronome = new Tone.Loop(time => {
    metronomeSynth.triggerAttackRelease("C3", "8n", time);
}, "4n").start(0);

// TRACK
let track = undefined;

// INSTRUMENTS
const keys = new Tone.PolySynth(Tone.Synth, {
    volume: -2,
    oscillator: {
        partials: [1, 2, 1],
    },
}).toDestination();

export default function Recorder(props) {

    const [state, dispatch] = useStateValue();
    const [startRec, setStartRec] = useState(0);
    const [stopRec, setStopRec] = useState(0);

    function record() {
        if(startRec) return;

        Tone.Transport.start();

        const startTime = WebMidi.time;
        setStartRec(startTime);
        setStopRec(0);

        props.midiInput.addListener("noteon", e => {
            keys.triggerAttackRelease(e.note.identifier, noteDuration, Tone.context.currentTime);
            const note = [(e.timestamp-startTime)/1000, e.note.identifier];
            dispatch(addNote(note));
        });

        console.log("RECORD");
    }

    function stop() {
        if(!startRec) return;

        Tone.Transport.stop();

        setStartRec(0);
        const stopTime = (WebMidi.time - startRec) / 1000;
        setStopRec(stopTime);

        props.midiInput.removeListener();

        track = new Tone.Part(((time, note) => {
            keys.triggerAttackRelease(note, noteDuration, time);
        }), state.currentLoop).start(0);
        track.loop = true;
        track.loopEnd = stopTime;

        console.log("STOP");
    }

    function play() {
        if(!stopRec) return;

        Tone.Transport.start();

        console.log("PLAY");
    }

    return(
        <div>
            <ul className="notes">
                {
                    state.currentLoop.map((note, index) =>
                        {
                            return <li key={index}>[{ note[0] + ", " + note[1] }]</li>
                        }
                    )
                }
            </ul>
            <button onClick={record}>Record</button>
            <button onClick={stop}>Stop</button>
            <button onClick={play}>Play</button>
        </div>
    )
}