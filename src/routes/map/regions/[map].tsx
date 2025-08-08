import { useParams } from "@solidjs/router";
import MapViewer from "~/components/mapping/MapViewer";

export default function MapWebsite() {
    const params = useParams() as {map: string};
    return (<MapViewer type="regions" submap={params.map}/>);
}