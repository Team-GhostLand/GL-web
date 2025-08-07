import T from "~/components/T";
import Embed from "~/components/Embed"
import "./Map.css"

export function EmbedMap(props: {src: string, title: string}){
    return(
        <>
            <T t={props.title}/>
            <Embed
                website={props.src}
                width={1280}
                height={720}
                class="m-auto py-6 md:py-12 map-autoscaler"
                icon="/train.gif"
                icon_h={64}
                icon_w={64}
                fancy_scaler
            >
            </Embed>
        </>             
    )
}

export function ImageMap(props: {src: string, title: string, author: string}){
    return(
        <T t={props.title}/>
    )
}