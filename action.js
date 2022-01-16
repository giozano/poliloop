
export function stocazzo(nome){
    return( {type: 'STOCAZZO', nome:nome} )
}

export function setNote(note){
    return({type: 'SET NOTE', note:note})
}

export function loop(){
    return({type:'LOOP'})
}