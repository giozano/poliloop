import { loop } from "../action";
import { useStateValue } from "../state"

export default function LoopStation(){
    const [state, dispatch]=useStateValue();
    //function cycleArray() {
      //  let index = count % myArray.length;
        //console.log(myArray[index]);
      
    //    count++;
      
      
      //setInterval(cycleArray, 200);}
      function prova(){
        return(<div>pollo</div>)
      }

    return(
        <div>
            <button onClick={()=>dispatch(loop())}>Loop</button>
            {console.log(state)}
            {
              prova()
            }
            <button>Stop</button>
        </div>
    )
}