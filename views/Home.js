import './Home.css'

export default function Home(){
    return(
        <body>
            <div className="text">POLYLOOPER</div>  
                <ul>
                    <li data-text="BPM"><a href="#">BPM 
                        <div className="slidecontainer">
                            <input type="range" min="10" max="400" value="1" className="slider" id="myRange" onchange="rangevalue.value=value"/>
                            <output id="rangevalue">0</output>
                        </div></a>
                    </li>
                    <li data-text="instrument"><a href="#">instrument 
                        <div className="custom-select" style="width:200px;">
                            <select>
                                <option value="0">Select</option>
                                <option value="1">Instrument 1</option>
                                <option value="2">Instrument 2</option>
                                <option value="3">Instrument 3</option>
                                <option value="4">Instrument 4</option>
                            </select>
                        </div>
                    </a></li>
      
                    <li data-text="bars"><a href="#">bars 
                        <input type="number" id="name" name="name" required minlength="4" maxlength="8" size="10">     
                    </a></li>
      
                    <li data-text="input"><a href="#">input
                        <div className="custom-select" style="width:200px;">
                            <select>
                                <option value="0">Select</option>
                                <option value="1">MIDI</option>
                                <option value="2">Microphone</option>
                            </select>
                        </div>  
                    </a></li>
      
                    <li data-text="polyrhythm"><a href="#">polyrhythm
                    </a></li>
                </ul>
 
            <div className="menu">
                <h1>Polyrhythm</h1>
                     <div className="popup">4/4</div>
                     <div className="popup">3/4</div>
                     <div className="popup">6/8</div>
                     <div className="popup">7/8</div>
                <h1>Resolution</h1>
                     <div className="popup">x1</div>
                     <div className="popup">x2</div>
                     <div className="popup">x3</div>
                     <div className="popup">x4</div>
             </div> 
        </body>

    )
}