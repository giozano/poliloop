import * as Tone from 'tone';
import { useStateValue } from '../state';
import * as Synth from '../utils/synthesizers';
import { setStartRec, setStopRec } from '../action';
import Track from './Track';

export default function Recorder(props) {
    
    const [state, dispatch] = useStateValue();

    let track = undefined;

    Tone.Transport.bpm.value = state.bpm;
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = props.loopTime;

    function record() {
        if(state.startRec) return;
        dispatch(setStartRec(true));
        dispatch(setStopRec(false));

        Tone.Transport.start();

        console.log("RECORD");
    }

    function stop() {
        if(!state.startRec) return;
        dispatch(setStartRec(false));
        dispatch(setStopRec(true));

        Tone.Transport.stop();

        track = new Tone.Part(function(time,value) {
            Synth.keys.triggerAttackRelease(value.note, value.duration, time);
        }, state.currentLoop).start(0);

        track.loop = true;
        track.loopEnd = props.loopTime;
    }

    function play() {
        if(!state.stopRec) return;

        Tone.Transport.toggle(); 
    }
    return(
        <div>
            <ul className="notes">
                {
                    state.currentLoop.map((note, index) =>
                        {
                            return <li key={index}>[{ note.note + ", " + note.duration }]</li>
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