import './Start.css';
import { useState } from 'react';
import { WebMidi } from "webmidi";
import LoopStation from './LoopStation';
import { useStateValue } from '../state';
import { setNote } from '../action';

export default function Start() {

  const [midiReady, setMidi] = useState(false);
  const [state, dispatch] = useStateValue();
  const [visible, setVisible]=useState(true);

  function onStart() {
    setVisible(false)
    if(midiReady) return;
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
      setMidi(true);

      WebMidi.inputs.forEach((device, index) => {
        console.log(index + ": " + device.name);
      });
      WebMidi.outputs.forEach((device, index) => {
        console.log(index + ": " + device.name);
      });

      const vmpk = WebMidi.getInputByName("loopMIDI Port");
      const output= WebMidi.getOutputByName('loopMIDI Port 1');
      vmpk.addListener("noteon", e => {
        dispatch(setNote(e));
        output.playNote(e.note)
      });
    }
  }
  console.log(state.looptemp)
  if(visible===true) return(
    <div className="Start">
        <button onClick={onStart} id='Start_Button'>START</button>
    </div>

  )
  else

  return (
    <div className="Start">
      <ul className='notes'>
          {console.log(state.looptemp)}
          {state.looptemp.map((note, index) => <li key={index}>{note.note.identifier}</li>)}
      </ul>
      <button onClick={()=>setVisible(true)}>Back</button>
      <LoopStation/> 
    </div>
    
  );
}