import * as Tone from 'tone';
import { WebMidi } from "webmidi";
import { useState } from 'react';
import { useStateValue } from '../state';
import { addNote } from "../action";

export default function Recorder(props) {

    const [state, dispatch] = useStateValue();
    const [rec, setRec] = useState(false);
    const [recStop, stopRec] = useState(false);

    function record() {
        if(rec) return;
        console.log("RECORD");
        const startTime = WebMidi.time;
        setRec(true);
        stopRec(false);
        props.midiInput.addListener("noteon", e => {
            const note = [(e.timestamp-startTime)/1000, e.note.identifier];
            dispatch(addNote(note));
        });
    }

    function stop() {
        if(!rec) return;
        console.log("STOP")
        stopRec(true);
        setRec(false);
        props.midiInput.removeListener();
    }

    function play() {
        if(!recStop) return;
        console.log(state.currentLoop)
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease("C4", "8n");
        const part = new Tone.Part(((time, note) => {
            synth.triggerAttackRelease(note, "8n", time);
        }), state.currentLoop);
        part.loop = true;
        part.start();
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