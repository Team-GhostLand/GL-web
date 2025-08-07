import { useParams } from "@solidjs/router";
import MapViewer from "~/components/mapping/MapViewer";

export default function MapWebsite() {
    const params = useParams() as {line: string};
    return (<MapViewer type="gra" line={params.line}/>);
}