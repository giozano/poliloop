import './Start.css';
import React, { useState } from 'react';
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

  // currentInstument
  const instrumentRef = React.useRef(state.currentInstrument);
  const changeInstrument = index => {
    instrumentRef.current = index;
    dispatch(changeInstrument(index));
  };

  // To manage startRec and stopRec
  const [startRec, setStartRec] = React.useState(false);
  const [stopRec, setStopRec] = React.useState(false);
  const startRecRef = React.useRef(startRec);
  const stopRecRef = React.useRef(stopRec);
  const recOn = on => {
    startRecRef.current = on;
    setStartRec(on);
  };
  const recOff = off => {
    stopRecRef.current = off;
    setStopRec(off);
  };

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
        console.log("note on");
        state.instruments[instrumentRef.current].synth.triggerAttack(Tone.Frequency(e.data[1],"midi"), Tone.now());
        let noteCurTime = Tone.Transport.progress*loopTime-latencyOffset;
        if (noteCurTime<0) noteCurTime=0;
        noteCur.set(e.data[1],[noteCurTime,e.timestamp]);
      }
      // release
      else if(e.message.type==="noteoff") {
        console.log("note off");
        state.instruments[instrumentRef.current].synth.triggerRelease(Tone.now());
        const key = e.data[1];
        let duration = (e.timestamp-noteCur.get(key)[1])/1000;
        const note = {
          "time": noteCur.get(key)[0],
          "note": Tone.Frequency(key,"midi"),
          "duration": duration
        };
        noteCur.delete(key);
        console.log(startRecRef.current);
        if(startRecRef.current) dispatch(addNote(note, instrumentRef.current));
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
          loopTime = {loopTime}
          startRec = {startRecRef.current}
          stopRec = {stopRecRef.current}
          recOn = {recOn}
          recOff = {recOff}
          changeInstrument = {changeInstrument}
        />
      </div>
    );
  }
}