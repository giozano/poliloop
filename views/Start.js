import './Start.css';
import { useState } from 'react';
import { WebMidi } from "webmidi";
import * as Tone from 'tone';
import Recorder from './Recorder';
import { useStateValue } from '../state';
import { addNote } from '../action';
import * as Synth from '../utils/synthesizers';
import { polyrhythms } from '../utils/functions';

export default function Start() {

  const [state, dispatch] = useStateValue();
  const [audioReady, setAudioReady] = useState(false);
  const [midiInput, setMidiInput] = useState(undefined);
  const [startVisible, setStartVisible]= useState(true);

  const latencyOffset = 0.01;
  const noteCur = new Map();
  const loopTime = (60/state.bpm)*state.bars*state.bpb;
  const metronomeLoopTime = loopTime/state.bars;

  let metronomes;
  
  function onStart() {
    if(!audioReady) startAudio();
  }

  async function startAudio() {
    try {
      await Tone.start();
    } catch(e) {
      console.log("Tone could not be started - " + e);
    }
    console.log("Tone is ready");
    try {
      await WebMidi.enable();
    } catch(e) {
      console.log("WebMidi could not be started - " + e);
    }
    onMidiEnabled();
    setStartVisible(false);
    setAudioReady(true);
    initializeMetronomes(state.bpb);
  };

  function initializeMetronomes(maxSubdivision) {
    metronomes = polyrhythms(state.bpb, maxSubdivision, metronomeLoopTime);
  }

  function onMidiEnabled() {
    console.log("WebMidi is ready");
    if (WebMidi.inputs.length < 1) {
      console.log("WebMidi: No device detected");
    }
    else {
      const dummyInput = WebMidi.inputs[0];
      setMidiInput(dummyInput);
      addMidiListener(dummyInput);
    }
  }

  // change input device
  function onMidiInputChange() {
    midiInput.removeListener();
    var newMidiInput = WebMidi.getInputByName(document.getElementById("midiInputSelect").value);
    setMidiInput(newMidiInput);
    addMidiListener(newMidiInput);
  }
  
  function addMidiListener(input) {
    input.addListener("midimessage", e => {
      // attack
      if(e.message.type==="noteon") {
        Synth.keys.triggerAttack(Tone.Frequency(e.data[1],"midi"), Tone.now());
        noteCur.set(e.data[1],[(Tone.Transport.progress-latencyOffset)*loopTime,e.timestamp]);
      }
      // release
      else if(e.message.type==="noteoff") {
        Synth.keys.triggerRelease(Tone.now());
        let duration = (e.timestamp-noteCur.get(e.data[1])[1])/1000;
        const note = {
          "time": noteCur.get(e.data[1])[0],
          "note": Tone.Frequency(e.data[1],"midi"),
          "duration": duration
        };
        noteCur.delete(e.data[1]);
        console.log(state.startRec);
        if(state.startRec) dispatch(addNote(note));
      }
    });
  }

  if(startVisible) {
    return(
      <div className="Start">
          <button onClick={onStart} id="startButton">START</button>
      </div>
    )
  }
  else {
    return (
      <div className="Start">
        <select name="midiInput" id="midiInputSelect" onChange={onMidiInputChange}>
          {WebMidi.inputs.map((device, index) => <option key={index} value={device.name}>{device.name}</option>)}
        </select>
        <button onClick={() => setStartVisible(true)}>Back</button>
        <Recorder
          loopTime={loopTime}
        />
      </div>
    );
  }
}