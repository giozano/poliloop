import * as Tone from 'tone';
import { WebMidi } from "webmidi";
import { useState } from 'react';
import { useStateValue } from '../state';
import { addNote } from "../action";

// SETTINGS
const noteDuration = "8n";

// METRONOME
Tone.Transport.bpm.value = 60;
const metronome = new Tone.Synth().toDestination();

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
    const [startRec, setStartRec] = useState(false);
    const [stopRec, setStopRec] = useState(false);

    function record() {
        if(startRec) return;

        setStartRec(true);
        setStopRec(false);

        let startTime = 0;

        Tone.Transport.scheduleRepeat((time) => {
            metronome.triggerAttackRelease("C3", "8n", time);
            console.log("Metronome time " + time);
            if(!startTime) startTime = time;
        }, "4n");

        Tone.Transport.start();

        props.midiInput.addListener("noteon", e => {
            const note = [Tone.immediate()-startTime, e.note.identifier];
            dispatch(addNote(note));
        });

        console.log("RECORD");
    }

    function stop() {
        if(!startRec) return;

        setStartRec(false);
        setStopRec(true);

        Tone.Transport.stop();

        props.midiInput.removeListener();

        track = new Tone.Part(((time, note) => {
            keys.triggerAttackRelease(note, noteDuration, time);
            console.log("Track time " + time);
        }), state.currentLoop).start(0);
        track.loop = true;
        track.loopEnd = 20;

        console.log("STOP");
    }

    function play() {
        if(!stopRec) return;

        Tone.Transport.toggle();

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