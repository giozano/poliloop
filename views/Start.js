import './Start.css';
import { useState } from 'react';
import { WebMidi } from "webmidi";
import LoopStation from './LoopStation';
import { useStateValue } from '../state';
import { setNote } from '../action';

export default function Start() {

  const [state, dispatch] = useStateValue();
  const [midiInput, setMidiInput] = useState(undefined);
  const [startVisible, setStartVisible]= useState(true);

  function onStart() {
    WebMidi
      .enable()
      .then(onEnabled)
      .catch(err => alert(err));
  }

  function onEnabled() {
    if (WebMidi.inputs.length < 1) {
      console.log("No device detected");
    }
    else {
      setStartVisible(false);

      /* 
      WebMidi.inputs.forEach((device, index) => {
        console.log(index + ": " + device.name);
      });

      WebMidi.outputs.forEach((device, index) => {
        console.log(index + ": " + device.name);
      });
      */

      const dummyInput = WebMidi.inputs[0];
      setMidiInput(dummyInput);
      dummyInput.addListener("noteon", e => {
        dispatch(setNote(e));
      });
    }
  }

  function onMidiInputChange() {
    midiInput.removeListener();
    var newMidiInput = WebMidi.getInputByName(document.getElementById("midiInputSelect").value);
    setMidiInput(newMidiInput);
    newMidiInput.addListener("noteon", e => {
      dispatch(setNote(e));
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
        <ul className="notes">
            {state.currentLoop.map((note, index) => <li key={index}>{note.note.identifier}</li>)}
        </ul>
        <button onClick={() => setStartVisible(true)}>Back</button>
        <LoopStation/>
      </div>
      
    );
  }
}