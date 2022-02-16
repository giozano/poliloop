import * as Tone from "tone";
import { useState } from "react";
import { useStateValue } from "../state";
import Track from "./Track";
import "./recorder.css";
import "./whell.css";
import { metronome } from "../utils/synthesizers";

export default function Recorder(props) {
  const [state, dispatch] = useStateValue();
  const [animation, setAnimation] = useState("");
  //per la visibilità dei bottoni record and play
  const [onRecording, setOnRecording] = useState(false);
  const [onPlay, setOnPlay] = useState(false);

  let tracks = [];

  // Animazione del cursore
  let transportBar = requestAnimationFrame (
    function cursorMove () {
      // 
      let cursorPosition = Tone.Transport.progress*100+"%";
      let angularPosition = (Tone.Transport.progress%(1/state.bars))*state.bars*360+"deg";
      let cursorTracks=document.getElementsByClassName("cursor-line");
      for (let i=0;i<cursorTracks.length;i++){
        cursorTracks[i].setAttribute("x1",cursorPosition);
        cursorTracks[i].setAttribute("x2",cursorPosition);
      }

      document.getElementById("circle-looped").style.transform="rotate("+angularPosition+")";
      requestAnimationFrame (cursorMove);
    }
  );

  function record() {
    if(onRecording) setOnRecording(false); //per il bottone record
    else {setOnPlay(true); setOnRecording(true)}; //per il bottone play

    // Start metronomes if stopped
    state.metronomes.forEach((value, key) => {
      value.part.start(0);
    });

    if (Tone.Transport.state == "stopped") {
      console.log("COUNT IN");

      // Count in
      let startCount = props.loopTime - (60 / state.bpm) * state.bpb - 0.001;
      Tone.Transport.position = 0;

      Tone.Transport.scheduleOnce((time) => {
        props.recOn(true);
        props.recOff(false);
      }, props.metronomeLoopTime);

      Tone.Transport.start();
    } 
    else if (Tone.Transport.state == "started") {
      if (props.startRec) {
      const strumenti = state.instruments;

      Object.keys(strumenti).forEach(function(strumento) {
        new Tone.Part(function(time, value) {
          console.log("NOTE ON");
          console.log("Key: " + strumento);
          console.log("Value: ", strumenti[strumento]);
          strumenti[strumento].synth.triggerAttackRelease(
            Tone.Frequency(value.note, "midi"),
            value.duration,
            time
          );
        }, strumenti[strumento].notes).start(0);
      });

      props.recOn(false);
      props.recOff(true);
      } 
      else {
        props.recOn(true);
        props.recOff(false);
        console.log("RECORD");
      }
    }
  }

  function stop() {
    console.log("STOP");
    props.recOn(false);
    props.recOff(true);
    setOnPlay(false);
    setOnRecording(false);

    Tone.Transport.stop();

    const strumenti = state.instruments;

    Object.keys(strumenti).forEach(function(strumento) {
      new Tone.Part(function(time, value) {
        strumenti[strumento].synth.triggerAttackRelease(
          Tone.Frequency(value.note, "midi"),
          value.duration,
          time
        );
      }, strumenti[strumento].notes).start(0);
    });
  }

  function play() {
    setOnPlay(true);
    if (Tone.Transport.state === "stopped") {
      state.metronomes.forEach((value, key) => {
        value.part.stop();
      });
      Tone.Transport.start();
      console.log("PLAY");
    }
  }

  function visibilityRec() {
    if (onRecording)
      return (
        <button onClick={record} className="instrument on">
          Record
        </button>
      );
    else
      return (
        <button onClick={record} className="instrument">
          Record
        </button>
      );
  }

  function visibilityPlay() {
    if (onPlay)
      return (
        <button onClick={stop} className="instrument">
          Stop
        </button>
      );
    else
      return (
        <button onClick={play} className="instrument">
          Play
        </button>
      );
  }

  function toggleMetronome(subdivision) {
    // If the clicked metronome is muted
    if(state.metronomes.get(subdivision).volume.mute === true) {
      state.metronomes.get(subdivision).volume.mute = false;
      state.metronomes.get(1).volume.mute = false;
    }
    // Otherwise
    else {
      state.metronomes.get(subdivision).volume.mute = true;
      let isLastOne = true;
      state.metronomes.forEach((value, key) => {
        if(key !== 1 && key !== subdivision && value.volume.mute === false) isLastOne = false;
      });
      console.log("isLastOne: " + isLastOne);
      if(isLastOne) state.metronomes.get(1).volume.mute = true;
    }

    
  }

  if (document.getElementById("kick") !== null)
    switch (props.currentInstrument) {
      case "kick":
        document.getElementById("kick").classList.add("on");
        document.getElementById("lead").classList.remove("on");
        document.getElementById("bass").classList.remove("on");
        document.getElementById("keys").classList.remove("on");
        break;
      case "keys":
        document.getElementById("kick").classList.remove("on");
        document.getElementById("lead").classList.remove("on");
        document.getElementById("bass").classList.remove("on");
        document.getElementById("keys").classList.add("on");
        break;
      case "lead":
        document.getElementById("kick").classList.remove("on");
        document.getElementById("lead").classList.add("on");
        document.getElementById("bass").classList.remove("on");
        document.getElementById("keys").classList.remove("on");
        break;
      case "bass":
        document.getElementById("kick").classList.remove("on");
        document.getElementById("lead").classList.remove("on");
        document.getElementById("bass").classList.add("on");
        document.getElementById("keys").classList.remove("on");
        break;
    }

  return (
    <div className="body">
      <div className="ul">
        <div className="li">
          <div
            id="kick"
            className="instrument"
            onClick={() => {
              props.changeInstrument("kick");
            }}
          >
            KICK
          </div>
        </div>
        <div className="li">
          <div
            id="keys"
            className="instrument on"
            onClick={() => {
              props.changeInstrument("keys");
            }}
          >
            KEYS
          </div>
        </div>
        <div className="li">
          <div
            id="lead"
            className="instrument"
            onClick={() => {
              props.changeInstrument("lead");
            }}
          >
            LEAD
          </div>
        </div>
        <div className="li">
          <div
            id="bass"
            className="instrument"
            onClick={() => {
              props.changeInstrument("bass");
            }}
          >
            BASS
          </div>
        </div>

        <div className="li">
          <div className="uneditable">BPM: {state.bpm}</div>
        </div>
        <div className="li">
          <div className="uneditable">Metric: {state.bpb + "/4"}</div>
        </div>
        <div className="instrument">Save</div>
      </div>
      <div id="track">
        <div style={{ width: "100vw", height: "150px" }}>
          <Track play={animation} />
        </div>
      </div>
      <div className="ul sud">
        <div style={{ flex: "3" }}>
          <div>
            <button
              id="4:3"
              className="instrument"
              onClick={() => {
                toggleMetronome(3);
                const visibile = document.getElementById("g3").style.visibility;
                switch (visibile) {
                  case "visible":
                    document.getElementById("g3").style.visibility = "hidden";
                    document.getElementById("4:3").classList.remove("on");
                    break;
                  case "hidden":
                    document.getElementById("g3").style.visibility = "visible";
                    document.getElementById("4:3").classList.add("on");
                    break;
                  default:
                    document.getElementById("g3").style.visibility = "visible";
                    document.getElementById("4:3").classList = "instrument on";
                }
              }}
            >
              4:3
            </button>
            <button
              id="4:4"
              className="instrument"
              onClick={() => {
                toggleMetronome(4);
                const visibile = document.getElementById("g4").style.visibility;
                switch (visibile) {
                  case "visible":
                    document.getElementById("g4").style.visibility = "hidden";
                    document.getElementById("4:4").classList.remove("on");
                    break;
                  case "hidden":
                    document.getElementById("g4").style.visibility = "visible";
                    document.getElementById("4:4").classList.add("on");
                    break;
                  default:
                    document.getElementById("g4").style.visibility = "visible";
                    document.getElementById("4:4").classList = "instrument on";
                }
              }}
            >
              4:4
            </button>
            <button
              id="4:5"
              className="instrument"
              onClick={() => {
                toggleMetronome(5);
                const visibile = document.getElementById("g5").style.visibility;
                switch (visibile) {
                  case "visible":
                    document.getElementById("g5").style.visibility = "hidden";
                    document.getElementById("4:5").classList.remove("on");
                    break;
                  case "hidden":
                    document.getElementById("g5").style.visibility = "visible";
                    document.getElementById("4:5").classList.add("on");
                    break;
                  default:
                    document.getElementById("g5").style.visibility = "visible";
                    document.getElementById("4:5").classList = "instrument on";
                }
              }}
            >
              4:5
            </button>
            <button
              id="4:7"
              className="instrument"
              onClick={() => {
                toggleMetronome(7);
                const visibile = document.getElementById("g7").style.visibility;
                switch (visibile) {
                  case "visible":
                    document.getElementById("g7").style.visibility = "hidden";
                    document.getElementById("4:7").classList.remove("on");
                    break;
                  case "hidden":
                    document.getElementById("g7").style.visibility = "visible";
                    document.getElementById("4:7").classList.add("on");
                    break;
                  default:
                    document.getElementById("g7").style.visibility = "visible";
                    document.getElementById("4:7").classList = "instrument on";
                }
              }}
            >
              4:7
            </button>
          </div>
        </div>
        <div style={{ flex: "1" }}>
          <div className="circle">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" id="wheel" />
              <circle cx="60" cy="10" r="3" id="circle-looped" />

              <g id="g3" className="poly3">
                <circle cx="60" cy="10" r="3" className="poly3-1" />
                <circle cx="60" cy="10" r="3" className="poly3-2" />
                <circle cx="60" cy="10" r="3" className="poly3-3" />
              </g>

              <g id="g4" className="poly4">
                <circle cx="60" cy="10" r="3" className="poly4-1" />
                <circle cx="60" cy="10" r="3" className="poly4-2" />
                <circle cx="60" cy="10" r="3" className="poly4-3" />
                <circle cx="60" cy="10" r="3" className="poly4-4" />
              </g>

              <g id="g5" className="poly5">
                <circle cx="60" cy="10" r="3" className="poly5-1" />
                <circle cx="60" cy="10" r="3" className="poly5-2" />
                <circle cx="60" cy="10" r="3" className="poly5-3" />
                <circle cx="60" cy="10" r="3" className="poly5-4" />
                <circle cx="60" cy="10" r="3" className="poly5-5" />
              </g>
              <g id="g7" className="poly7">
                <circle cx="60" cy="10" r="3" className="poly7-1" />
                <circle cx="60" cy="10" r="3" className="poly7-2" />
                <circle cx="60" cy="10" r="3" className="poly7-3" />
                <circle cx="60" cy="10" r="3" className="poly7-4" />
                <circle cx="60" cy="10" r="3" className="poly7-5" />
                <circle cx="60" cy="10" r="3" className="poly7-6" />
                <circle cx="60" cy="10" r="3" className="poly7-7" />
              </g>
            </svg>
          </div>
        </div>
        <div id="control-buttons">
          {visibilityRec()}
          {visibilityPlay()}
        </div>
      </div>
    </div>
  );
}
