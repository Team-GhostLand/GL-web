import { Match, Switch } from "solid-js";
import { Navigate } from "@solidjs/router";
import { MapSelector } from "~/components/mapping/MapSelector";
import Error404 from "~/components/Error404";
import { ClientOnly } from "~/components/ClientOnly";
import T from "~/components/T";
import NoJsTaunter from "~/components/NoJsTaunter";
import { EmbedMap } from "~/components/mapping/Map";
import { RailwayMap } from "~/components/mapping/RailwayMap";
import { ImageMap } from "~/components/mapping/Map";
import { findNavTarget } from "~/lib/MapHistoryController";
import type { MapType } from "~/lib/MapType";

export default function MapViewer(props: {type: MapType, line?: string}) {
    return (
        <div class="flex mt-20 md:mt-28 flex-col">
            <MapSelector type={props.type}/>
            <main class="m-auto">
                <Switch fallback={<Error404/>}>
                    <Match when={props.type === "gra"}>
                        <RailwayMap line={props.line}/>
                    </Match>
                    <Match when={props.type === "gra-dynmap"}>
                        <EmbedMap title="Mapa Kolejowa" src="http://130.61.60.187:3876"/>
                    </Match>
                    <Match when={props.type === "city"}>
                        <ImageMap src="" author="" title="Mapa Miejska"/>
                    </Match>
                    <Match when={props.type === "world"}>
                        <ImageMap src="" author="" title="Mapa Świata"/>
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