import { useStateValue } from "../state";
import "./track.css";

const prova = [
  [1, 2],
  [3, 5],
  [7,10.5],
];

export default function Track({play}) {
  let bars = [];
  let tracks=[];
  const [state, dispatch] = useStateValue();

  let bar=state.bars
  let bpm=state.bpm
  let metric=state.bpb
  let current_note=0
  let number_loop=1

  let time_loop = (metric * bar * 60000) / bpm;
  let time_loop_ms = time_loop + "ms";

  document.documentElement.style.setProperty("--loop-time", time_loop_ms);

  let position;
  for (let i = 1; i < bar; i++) {
    position = (100 * i) / bar;
    position = position + "%";
    bars.push(
      <line x1={position} y1="0" x2={position} y2="100%" className="bars" />
    );
  }
  
  
  state.loops.map((loop) => {
    tracks.unshift(
      <div className="track">
        <svg width="100%" height="100%">
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="100%"
            className={"cursor-line " + play}
          />
          {bars}
          {loop.map((note, index) => {
            
            let x = (note.time * 1000 * 100) / time_loop + "%";
            let width = (note.duration * 1000 * 100) / time_loop + "%";
            return (
              <rect
                x={x}
                y="40%"
                rx="2px"
                id={index}
                width={width}
                height="20%"
                className="note"
              />
            );
          })}
        </svg>
      </div>
    );
  });
  

  return (
    <div className="tracks">
      
      <div className="track">
        <svg width="100%" height="100%">
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="100%"
            className={"cursor-line " + play}
          />
          {bars}
          {state.currentLoop
            .filter((e) => state.currentLoop.indexOf(e) >= state.counter)
            .map((note, index) => {
              let x = (note.time * 1000 * 100) / time_loop + "%";
              let width = (note.duration * 1000 * 100) / time_loop + "%";
              return (
                <rect
                  x={x}
                  y="40%"
                  rx="2px"
                  id={index}
                  width={width}
                  height="20%"
                  className="note"
                />
              );
            })}
        </svg>
      </div>
      {tracks}
    </div>
  );
}
