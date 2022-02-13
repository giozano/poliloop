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
        if(props.startRec) return;
        props.recOn(true);
        props.recOff(false);

        Tone.Transport.start();

        console.log("RECORD");
    }

    function stop() {
        if(!props.startRec) return;
        props.recOn(false);
        props.recOff(true);

        Tone.Transport.stop();

        track = new Tone.Part(function(time,value) {
            Synth.keys.triggerAttackRelease(value.note, value.duration, time);
        }, state.currentLoop).start(0);

        track.loop = true;
        track.loopEnd = props.loopTime;

        console.log("STOP");
    }

    function play() {
        if(!props.stopRec) return;

        Tone.Transport.toggle(); 

        console.log("PLAY");
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