import { Match, Switch } from "solid-js";
import { Navigate } from "@solidjs/router";
import { MapSelector } from "~/components/mapping/MapSelector";
import Error404 from "~/components/Error404";
import { ClientOnly } from "~/components/ClientOnly";
import T from "~/components/T";
import NoJsTaunter from "~/components/NoJsTaunter";
import { EmbedMap } from "~/components/mapping/Map";
import { ImageMaps } from "~/components/mapping/Map";
import { findNavTarget } from "~/lib/MapHistoryController";
import type { MapType } from "~/lib/MapType";
import { GetModule } from "~/lib/utils";

export default function MapViewer(props: {type: MapType, submap?: string}) {
    
    return (
        <div class="flex mt-20 md:mt-28 flex-col">
            <MapSelector type={props.type}/>
            <main class="m-auto">
                <Switch fallback={<Error404/>}>
                    <Match when={props.type === "gra"}>
                        <ImageMaps src="railways" title="Mapa Kolejowa" throbber="/train.gif" submap={props.submap}/>
                    </Match>
                    <Match when={props.type === "gra-dynmap"}>
                        <EmbedMap title="Mapa Kolejowa" src={GetModule("railwaymap")} throbber="/train.gif"/>
                    </Match>
                    <Match when={props.type === "regions"}>
                        <ImageMaps src="screenshots" title="Mapa Regionu(-ów)" throbber={"/discord.gif" /*Maps would be pulled from Discord, so this TECHNICALLY fits (but I'll likely later change it to someting better)*/} submap={props.submap}/>
                    </Match>
                    <Match when={props.type === "home"}>
                        <T t="Ładowanie mapy..."/>
                        <NoJsTaunter class="text-center m-auto text-amber-200 p-4 max-6-xs text-6xl font-fancy uppercase"/>
                        <ClientOnly><Navigate href={findNavTarget()}/></ClientOnly>
                    </Match>
                </Switch>
            </main>
        </div>
    );
}