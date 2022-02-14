import * as Tone from 'tone';
import { useState } from 'react';
import { useStateValue } from '../state';
import Track from './Track';
import './SimoneMarco.css';
import './whell.css';

export default function Recorder(props) {
    
    const [state, dispatch] = useStateValue();
    const [animation, setAnimation] = useState("")
    //per la visibilità dei bottoni record and play
    const [onRecording, setOnRecording] = useState(false)
    const [onPlay, setOnPlay] = useState(false)

    let tracks = [];

    Tone.Transport.bpm.value = state.bpm;
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = props.loopTime;

    function record() {
        //if(props.startRec) return;
        setAnimation("on");//controllare
        setOnRecording(true)//per il bottone record
        setOnPlay(true);//per il bottone play

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
        else if (Tone.Transport.state=="started") {
            console.log("Record transport true");
            if (props.startRec){
                console.log("Record salva");

                for(var key in state.instruments) {
                    var instrument = state.instruments[key];
                    
                    const track = new Tone.Part(function(time,value) {
                        instrument.synth.triggerAttackRelease(value.note, value.duration, time);
                    }, instrument.notes).start(0);

                    track.loop = true;
                    track.loopEnd = props.loopTime;

                    tracks.push(track);
                }

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
        setOnPlay(false);
        setOnRecording(false);

        Tone.Transport.stop();

        for(var key in state.instruments) {
            var instrument = state.instruments[key];
            
            const track = new Tone.Part(function(time,value) {
                instrument.synth.triggerAttackRelease(value.note, value.duration, time);
            }, instrument.notes).start(0);

            track.loop = true;
            track.loopEnd = props.loopTime;

            tracks.push(track);
        }

        console.log("STOP");
    }

    function play() {
        setOnPlay(true);
        //setAnimation("on");
        if (Tone.Transport.state==="stopped"){
            Tone.Transport.start(); 
            console.log("PLAY");
        }
    }
    function visibilityRec(){
        if(onRecording) return(<button onClick={stop} className="instrument">Record</button>)
        else return(<button onClick={record} className="instrument">Record</button>)
    }
    function visibilityPlay(){
        if(onPlay) return(<button onClick={stop} className="instrument">Stop</button>)
        else return(<button onClick={play} className="instrument">Play</button>)
    }

    return (
      <div className="body">
        <ul>
          <li>
            <div className="instrument">Instrument 1:</div>
          </li>
          <li>
            <div className="instrument">Instrument 2:</div>
          </li>
          <li>
            <div className="instrument">Instrument 3:</div>
          </li>
          <li>
            <div className="instrument">Instrument 4:</div>
          </li>
          <li>
            <div className="uneditable">Input:</div>
          </li>
          <li>
            <div className="uneditable">Output:</div>
          </li>
          <li>
            <div className="uneditable">BPM:</div>
          </li>
          <li>
            <div className="uneditable">Metric:</div>
          </li>
          <div className="instrument">Save</div>
        </ul>
        <div id="track">
          <ul
            className="notes"
            style={{ display: "flex", flexDirection: "column" }}
          >
            {state.currentLoop.map((note, index) => {
              return (
                <li key={index}>
                  [{note.note + ", " + note.time + ", " + note.duration}]
                </li>
              );
            })}
          </ul>
          <div style={{ width: "100vw", height: "150px" }}>
            <Track play={animation} />
          </div>
        </div>
        <ul>
          {visibilityRec()}
          <div style={{ display: "flex", width: "100%" }}>
            <div style={{ flex: "1" }}>
              <div>
                <button onClick={()=>document.getElementById('g3').style.visibility='visible'}>
                  3 on
                </button>
                <button onclick={()=>document.getElementById('g4').style.visibility='visible'}>
                  4 on
                </button>
                <button onclick={()=>document.getElementById('g5').style.visibility='visible'}>
                  5 on
                </button>
                <button onclick={()=>document.getElementById('g7').style.visibility='visible'}>
                  7 on
                </button>
              </div>
              <div>
                <button onclick={()=>document.getElementById('g3').style.visibility='hidden'}>
                  3 off
                </button>
                <button onclick={()=>document.getElementById('g4').style.visibility='hidden'}>
                  4 off
                </button>
                <button onclick={()=>document.getElementById('g5').style.visibility='hidden'}>
                  5 off
                </button>
                <button onclick={()=>document.getElementById('g7').style.visibility='hidden'}>
                  7 off
                </button>
              </div>
            </div>
            <div style={{ flex: "1" }}>
              <div class="circle">
                <svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="black" />
                  <circle cx="60" cy="10" r="3" class="circle-looped" />

                  <g id="g3" class="poly3">
                    <circle cx="60" cy="10" r="3" class="poly3-1" />
                    <circle cx="60" cy="10" r="3" class="poly3-2" />
                    <circle cx="60" cy="10" r="3" class="poly3-3" />
                  </g>

                  <g id="g4" class="poly4">
                    <circle cx="60" cy="10" r="3" class="poly4-1" />
                    <circle cx="60" cy="10" r="3" class="poly4-2" />
                    <circle cx="60" cy="10" r="3" class="poly4-3" />
                    <circle cx="60" cy="10" r="3" class="poly4-4" />
                  </g>

                  <g id="g5" class="poly5">
                    <circle cx="60" cy="10" r="3" class="poly5-1" />
                    <circle cx="60" cy="10" r="3" class="poly5-2" />
                    <circle cx="60" cy="10" r="3" class="poly5-3" />
                    <circle cx="60" cy="10" r="3" class="poly5-4" />
                    <circle cx="60" cy="10" r="3" class="poly5-5" />
                  </g>

                  <g id="g7" class="poly7">
                    <circle cx="60" cy="10" r="3" class="poly7-1" />
                    <circle cx="60" cy="10" r="3" class="poly7-2" />
                    <circle cx="60" cy="10" r="3" class="poly7-3" />
                    <circle cx="60" cy="10" r="3" class="poly7-4" />
                    <circle cx="60" cy="10" r="3" class="poly7-5" />
                    <circle cx="60" cy="10" r="3" class="poly7-6" />
                    <circle cx="60" cy="10" r="3" class="poly7-7" />
                  </g>
                </svg>
              </div>
            </div>
            <div style={{ flex: "1" }}></div>
          </div>
          {visibilityPlay()}
        </ul>
      </div>
    );
}