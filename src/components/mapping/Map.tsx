import T from "~/components/T";
import Embed from "~/components/Embed"
import "./Map.css"
import { GetModule } from "~/lib/utils";

export function EmbedMap(props: {src: string, title: string, throbber?:string}){
    return(
        <>
            <T t={props.title}/>
            <Embed
                website={props.src}
                width={1280}
                height={720}
                class="m-auto py-6 md:py-12 map-autoscaler"
                throbber={props.throbber}
                icon_h={64}
                icon_w={64}
                fancy_scaler
            >
            </Embed>
        </>
    )
}

export function ImageMaps(props: {src: string, title: string, submap?: string, throbber?: string}){
    
    const submap = (props.submap && props.submap !== "") ? "/"+props.submap : ""
    
    return(
        <EmbedMap title={props.title} src={GetModule(`discordmaps/${props.src}${submap}`)} throbber={props.throbber}/>
    )
}