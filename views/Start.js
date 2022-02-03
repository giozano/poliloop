import './Start.css';
import { useState } from 'react';
import { WebMidi } from "webmidi";
import * as Tone from 'tone';
import Recorder from './Recorder';
import { useStateValue } from '../state';
import { addNote } from '../action';

export default function Start() {

  const [state, dispatch] = useStateValue();
  const [audioReady, setAudioReady] = useState(false);
  const [midiInput, setMidiInput] = useState(undefined);
  const [startVisible, setStartVisible]= useState(true);

  function onStart() {
    if(!audioReady) {
      Tone.start();
      WebMidi
      .enable()
      .then(onEnabled)
      .catch(err => alert(err));
    }
  }

  function onEnabled() {
    if (WebMidi.inputs.length < 1) {
      console.log("No device detected");
    }
    else {
      const dummyInput = WebMidi.inputs[0];

      setMidiInput(dummyInput);

      setStartVisible(false);
      setAudioReady(true);
    }
  }

  // Change input device
  function onMidiInputChange() {
    midiInput.removeListener();
    var newMidiInput = WebMidi.getInputByName(document.getElementById("midiInputSelect").value);
    setMidiInput(newMidiInput);
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
        <Recorder midiInput={midiInput}/>
      </div>
    );
  }
}