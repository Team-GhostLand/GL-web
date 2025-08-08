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
            <A href="/map/gra-dynmap" class={COMMON+" border-x-slate-600 border-x-2 " /*tylko ostatni-środkowy ma border-x - wsystkie przed nim mają mieć border-l, jeśli miałyby się pojawić*/ + ((props.type === "gra-dynmap") ? ACTIVE : INACTIVE)}>
                Kolej (dyn.)
            </A>
            <A href="/map/regions" class={COMMON+" rounded-r-md " + ((props.type === "regions") ? ACTIVE : INACTIVE)}>
                Region(y)
            </A>
        </nav>
    );
}