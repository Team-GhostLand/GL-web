import { createEffect } from "solid-js";
import { A } from "@solidjs/router";
import { isMapValid, type MapType } from "~/lib/MapType";
import { MhcLog, set } from "~/lib/MapHistoryController";


export function MapSelector(props: {type: MapType}) {
    const ACTIVE = "bg-sky-600 text-slate-300";
    const INACTIVE = "bg-slate-300 text-sky-600 hover:bg-slate-400 hover:text-sky-400";
    const COMMON = "p-2 md:p-4 inline"
    
    createEffect(() => {
        if (isMapValid(props.type)){
            MhcLog("Ostatnio otwarta mapa");
            set(props.type);
            MhcLog("Teraz otwarta mapa");
        }
    })

    return (
        <nav class="block text-lg md:text-3xl mx-auto">
            <A href="/map/gra" class={COMMON+" rounded-l-md " + ((props.type === "gra") ? ACTIVE : INACTIVE)}>
                Kolej
            </A>
            <A href="/map/gra-dynmap" class={COMMON+" border-l-slate-600 border-l-2 " + ((props.type === "gra-dynmap") ? ACTIVE : INACTIVE)}>
                Kolej (dyn.)
            </A>
            <A href="/map/city" class={COMMON+" border-x-slate-600 border-x-2 " + ((props.type === "city") ? ACTIVE : INACTIVE)}>
                Miasto
            </A>
            <A href="/map/world" class={COMMON+" rounded-r-md " + ((props.type === "world") ? ACTIVE : INACTIVE)}>
                Świat
            </A>
        </nav>
    );
}