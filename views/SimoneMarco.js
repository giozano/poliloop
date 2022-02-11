import './SimoneMarco.css'

export default function SimoneMarco(){
    return(
        <div className='body'>
            <ul>
                <li><div className="instrument">Instrument 1:</div></li>
                <li><div className="instrument">Instrument 2:</div></li>
                <li><div className="instrument">Instrument 3:</div></li>
                <li><div className="instrument">Instrument 4:</div></li>
                <li><div className="instrument">Input:</div></li>
                <li><div className="instrument">Output:</div></li>
                <li><div className="instrument">BPM:</div></li>
                <li><div className="instrument">Metric:</div></li>
            </ul>
            <div>Track</div>
            <div className="instrument">Save</div>
            <div className="instrument">Record</div>
            <div className="instrument">Play</div>
            <div className="instrument">Stop</div>
            <div className="instrument">Polyrhythm
                <select>
                    <option value="0">Select:</option>
                    <option value="1">4/4</option>
                    <option value="2">3/4</option>
                    <option value="3">6/8</option>   
                </select>  
            </div>
    </div>
    )
}