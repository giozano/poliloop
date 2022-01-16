import './Start.css';
import { useState } from 'react';
import { WebMidi } from "webmidi";

export default function Start() {

  const [midiReady, setMidi] = useState(false);
  const [notes, setNotes] = useState([]);

  function onStart() {
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

      const vmpk = WebMidi.getInputByName("out");
      vmpk.addListener("noteon", e => {
        console.log(e);
        setNotes(notes => [...notes, e.note.identifier]);
      });
    }
  }

  return (
    <div className="Start">
        <button onClick={onStart}>START</button>
        <ul className='notes'>
          {notes.map((note, index) => <li key={index}>{note}</li>)}
        </ul>
    </div>
  );
}