import './App.css';
import Start from './views/Start';
import { StateProvider } from "./state";
import initialState from "./initialState";
import reducer from "./reducer"
import SimoneMarco from './views/SimoneMarco';

export default function App() {

  return (
    <div className='App'>
      <StateProvider reducer={reducer} initialState={initialState}>
        <Start/>
     </StateProvider>
    </div>
  );
}
