import T from "~/components/T";

export function RailwayMap(props: {line?: string}){

    if(!props.line){
        return(
            <TI/>
        )
    }
    
    //TODO: Line display logic goes here
    
    return(
        <TI/>
    )
}

function TI(){ //Skród od T Internal
    return(
        <T t="Mapa Kolejowa"/>
    )
}