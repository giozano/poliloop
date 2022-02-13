import './SimoneMarco.css'

export default function SimoneMarco(){
    return(
        <div className='body'>   
            <ul>
                <li><div className="instrument">Instrument 1:</div></li>
                <li><div className="instrument">Instrument 2:</div></li>
                <li><div className="instrument">Instrument 3:</div></li>
                <li><div className="instrument">Instrument 4:</div></li>
                <li><div className="uneditable">Input:</div></li>
                <li><div className="uneditable">Output:</div></li>
                <li><div className="uneditable">BPM:</div></li>
                <li><div className="uneditable">Metric:</div></li>
                <div className="instrument">Save</div> 
            </ul>
                <div className="track">Track</div>
            <ul>
                <div className="instrument">Record</div>
                <button className="instrument"> PLAY</button>
           
            </ul>     
            
        </div>
    )
}