import { loop } from "../action";
import { useStateValue } from "../state"

export default function LoopStation(){
    
    const [state, dispatch]=useStateValue();
    let count=0;
    function cycleArray(array) {
      let index = count % array.length;
      console.log(array[index].note.identifier);
      count++;
      
    }
    function withInterval(array){
      setInterval(cycleArray(array),400)
    }

    return(
        <div>
            <button onClick={()=>dispatch(loop())}>Loop</button>
            {console.log(state)}
            {state.loop.map(e=>withInterval(e))}
            <button>Stop</button>
        </div>
    )
}