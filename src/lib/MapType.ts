export type MapType = "gra"|"gra-dynmap"|"city"|"world"|"home"|"unknown";
export type MapValidityState = "real-valid"|"abstract-valid"|"implicit-unknown"|"explicit-unknown"|"missing";
export type MapValidityTier = 1 | 2 | 3;

export function getMapValidityState(map?: MapType): MapValidityState { // Tak na prawdę, to ta funkcja powinna przyjmować any, ale wtedy autocomplete w switchu nie działa.

    if (!map) return "missing";

    switch(map){
        case "gra":
        case "gra-dynmap":
        case "city":
        case "world":
            return "real-valid";
        case "home":
            return "abstract-valid";
        case "unknown":
            return "explicit-unknown";
        default:
            return "implicit-unknown";
    }
}

export function getMapValidityTier(map?: any) {
    return getStateTier(getMapValidityState(map));
}

export function getStateTier(state: MapValidityState) {
    switch (state){
        case "real-valid":
            return 1;
        case "abstract-valid":
        case "explicit-unknown":
            return 2;
        case "implicit-unknown":
        case "missing":
            return 3;
    }
}

export function isMapValid(map?: any): map is MapType {
    return (getMapValidityTier(map) === 1);
}

export function isMapSemiValid(map?: any): map is MapType {
    return (isMapValid(map) || (getMapValidityTier(map) === 2));
}