import { isMapValid, type MapType } from "~/lib/MapType";

const ItemID = "last_viewed_map";
let Store: Storage|undefined;

export function findNavTarget(): MapType {
    MhcLog("Aktywowano wyszukiwanie ostatnio odwiedzonej mapy. Jeśli jest to poprawna nazwa mapy, powinna zostać otwarta mapa");

    let target = get();
    
    if(isMapValid(target)) return target;
    else return "regions"; //Nie musi być else, ale tak lepiej wygląda imo
}

export function MhcLog(message: string){
    console.log(`[MapHist Controller] ${message}: ${get()}  @  URL: ${window.location.href}`);
}

function access(){
    if(!Store){
        console.warn("[MapHist Controller] DING DING DING! Otwarto LocalStorage. W przeglądarce - olej to. Ale jeśli widzisz ten log na serwerze, coś poszło katastrofalnie nie tak.")
        Store = window.localStorage;
        MhcLog("Wartość początkowa, zaraz po otwarciu LocalStorage");
    };

    return Store;
}

export function set(to: MapType) {
    MhcLog("Ktoś, gdzieś, zastąpił wartością \""+to+"\" wartość");
    access().setItem(ItemID, to);
}

export function get() {
    return access().getItem(ItemID);
}