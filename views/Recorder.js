import * as Tone from 'tone';
import { useState } from 'react';
import { useStateValue } from '../state';
import * as Synth from '../utils/synthesizers';
import { setStartRec, setStopRec } from '../action';
import Track from './Track';

export default function Recorder(props) {
    
    const [state, dispatch] = useStateValue();
    const [animation, setAnimation] = useState("")

    let track = undefined;

    Tone.Transport.bpm.value = state.bpm;
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = props.loopTime;

    function record() {
        //if(props.startRec) return;
        setAnimation("on");//controllare

        if (Tone.Transport.state=="stopped") {

            console.log("COUNT IN");

            // Count in
            let startCount = props.loopTime-(60/state.bpm)*state.bpb-0.001;
            Tone.Transport.position = startCount;

            Tone.Transport.scheduleOnce((time) => {
                props.recOn(true);
                props.recOff(false);
                console.log("RECORD");
            }, props.loopTime-0.01);

            Tone.Transport.start();
        }
        else if (Tone.Transport.state=="started"){
            console.log("Record transport true");
            if (props.startRec){
                console.log("Record salva");
                track = new Tone.Part(function(time,value) {
                    Synth.keys.triggerAttackRelease(value.note, value.duration, time);
                }, state.currentLoop).start(0);
        
                track.loop = true;
                track.loopEnd = props.loopTime;
                props.recOn(false);
                props.recOff(true);
            }
            else {
                console.log("Record e basta");
                props.recOn(true);
                props.recOff(false);
                console.log("RECORD");
            }
        }

    }

    function stop() {
        //if(!props.startRec) return;
        props.recOn(false);
        props.recOff(true);
        setAnimation("");//???

        Tone.Transport.stop();

        track = new Tone.Part(function(time,value) {
            Synth.keys.triggerAttackRelease(value.note, value.duration, time);
        }, state.currentLoop).start(0);

        track.loop = true;
        track.loopEnd = props.loopTime;

        console.log("STOP");
    }

    function play() {
        //setAnimation("on");
        if (Tone.Transport.state==="stopped"){
            Tone.Transport.start(); 
            console.log("PLAY");
        }
    }
    return(
        <div>
            <ul className="notes" style={{display:"flex", flexDirection:"column"}}>
                {
                    state.currentLoop.map((note, index) =>
                        {
                            return <li key={index}>[{ note.note + ", " + note.time + ", " + note.duration }]</li>
                        }
                    )
                }
            </ul>
            <button onClick={record}>Record</button>
            <button onClick={stop}>Stop</button>
            <button onClick={play}>Play</button>
            <div style={{width:"100vw", height:"150px"}}><Track play={animation}/></div>
        </div>
    )
}