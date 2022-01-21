import * as Tone from 'tone';
import { addLoop } from "../action";
import { useStateValue } from "../state";

export default function LoopStation(){
    
  const [state, dispatch] = useStateValue();

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();

  let tempo = 60.0;
  const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
  const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
  const noteDuration = 0.5;

  let currentNote = 0; // The note we are currently playing
  let nextNoteTime = 0.0; // when the next note is due
  let nextNoteFreq = 440;

  function nextNote() {
    const secondsPerBeat = 60.0 / tempo;

    nextNoteTime += secondsPerBeat; // Add beat length to last beat time

    currentNote++;
    if(currentNote % state.currentLoop.length === 0) {
      currentNote = 0;
    }

    nextNoteFreq = midiToFrequency(state.currentLoop[currentNote].data[1]);
  }

  function scheduleNote(beatNumber, time, frequency) {
    playNote(time, frequency);
  }

  function playNote(time, frequency) {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = frequency;

    var gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(1, time);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(time);

    gain.gain.setValueAtTime(gain.gain.value, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, time + noteDuration);
    osc.stop(time + noteDuration);
  }

  let timerID;
  function scheduler() {
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
        scheduleNote(currentNote, nextNoteTime, nextNoteFreq);
        nextNote();
    }
    timerID = window.setTimeout(scheduler, lookahead);
  }

  function loop() {
    if(state.currentLoop.length > 0) {
      currentNote = 0;
      nextNoteTime = audioCtx.currentTime;
      nextNoteFreq = midiToFrequency(state.currentLoop[0].data[1]);
      scheduler();
    }
  }

  function midiToFrequency(midi) {
    return(Math.pow(2, (midi-69)/12)*440);
  }

  return(
      <div>
        <ul className="notes">
          {
            state.currentLoop.map((event, index) =>
              {
                const startTime = state.startTime;
                const noteInfo = "NOTE: " + event.note.identifier + " TIMESTAMP: " + (event.timestamp - startTime);
                return <li key={index}>{ noteInfo }</li>
              }
            )
          }
        </ul>
        <button onClick={loop}>
          Loop
        </button>
        <button>Stop</button>
      </div>
  )
}