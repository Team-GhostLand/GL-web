import { createEffect, createSignal, onMount, Show } from "solid-js";
import { ClientOnly } from "~/components/ClientOnly";
import NoJsTaunter from "./NoJsTaunter";
import { Log } from "~/lib/utils";

export default function Embed(props: {website: string, class: string, height: number, width: number, fancy_scaler?:true}&({icon: string, icon_h: number, icon_w: number}|{icon?: undefined, icon_h?: undefined, icon_w?: undefined})){
    let [getIsLoaded, setIsLoaded] = createSignal(false);

    onMount(() => Log("Embed", "Ładowanie strony: "+props.website))

    createEffect(() => {
        if(getIsLoaded()){
            Log("Embed", "Strona "+props.website+" załadowana.");
        }
    })

    return(
        <div class={`grid grid-rows-1`}>
            <Show when={!getIsLoaded()}>
                <img
                    src="/a-fucking-pixel.webp"
                    width="1"
                    height="1"
                    style={`grid-row: 1; grid-column: 1;${props.fancy_scaler ? "" : " width: "+props.width+"px; height: "+props.height+"px;"}`}
                    class={`${props.class}`}
                />
                <div class="flex flex-col" style="grid-row: 1; grid-column: 1;">
                    <span class="m-auto mb-2 text-slate-500 text-2xl">Ładowanie...</span>
                    <img
                        src={props.icon}
                        height={props.icon_h}
                        width={props.icon_w}
                        class="mx-auto my-2"
                    />
                    <NoJsTaunter class="m-auto mt-2 text-slate-500 text-2xl" />
                </div>
            </Show>
            <ClientOnly>
                <iframe
                    onload={() => setIsLoaded(true)}
                    src={props.website}
                    width={props.width}
                    height={props.height}
                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                    style="grid-row: 1; grid-column: 1"
                    class={`${props.class}`}
                />
            </ClientOnly>
        </div>             
    )
}