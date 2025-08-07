import { Title } from "@solidjs/meta";

export default function T(props: {t?: string}){
    if (props.t) return(
        <Title>{props.t} - GhostLand</Title>
    )
    
    return(
        <Title>GhostLand!</Title>
    )
}