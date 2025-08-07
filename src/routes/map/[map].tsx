import { useParams } from "@solidjs/router";
import MapViewer from "~/components/mapping/MapViewer";
import type { MapType } from "~/lib/MapType";

export default function MapWebsite() {
    const params = useParams() as {map: MapType}; //Zgodnie z logiką kodu MapViewer, KAŻDY string nie zadeklarowany w MapType będzie implicitly przetwarzany jakby miał wartość "unknown" (mimo tego, że TypeScript o tym nie wie - stąd potrzeba wykonać ową konwersję), więc nie trzeba robić żadnego fancy sprawdzania, czy owa konwersja ma sens - bo nawet jeśli nie ma, kod zadziała.
    return (<MapViewer type={params.map}/>);
}