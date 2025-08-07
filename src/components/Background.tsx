import { createSignal, onMount, createEffect } from "solid-js";
import "./Background.css";
import { Log } from "~/lib/utils";


function updateMouseSignals(setX: Function, setY: Function, markMoved: Function, vec: any){
    if (window.matchMedia("(pointer: coarse)").matches) return; //Ignorowanie na telefonach
    markMoved(true);
    setX(vec.clientX);
    setY(vec.clientY);
}

function updateWindowSizeSignals(setX: Function, setY: Function){
    setX(window.innerWidth);
    setY(window.innerHeight);
}

function calcTransform(mouse: number|null, window: number): number{
    mouse = ((mouse == null) ? (window/2) : mouse); //Centruje wirtualną mysz, jeśli prawdziwa mysz jest NULLem
    return -((mouse / window*13)-6.5);
}


function randomWallpaper(): string{
    const options = [
        //"https://media.discordapp.net/attachments/1079471622232211526/1267859704571363438/2024-07-25_23.03.12.png?ex=66aeef1d&is=66ad9d9d&hm=c97aa0787d449f5e7bfb42f0d31e4e793c001491accfe8f817c40495f7103483&=&format=webp",
        "https://images.hdqwalls.com/wallpapers/bthumb/landscape-alpine-mountains-landscape-5k-1k.jpg"
    ]
    const index = Math.floor(Math.random()*options.length);
    return options[index];
}



export default function Background() {
    const [getMouseX, setMouseX] = createSignal(null as number|null);
    const [getMouseY, setMouseY] = createSignal(null as number|null);
    const [getWindowX, setWindowX] = createSignal(null as number|null);
    const [getWindowY, setWindowY] = createSignal(null as number|null);
    const [getHasMouseMovedAtLeastOnce, setHasMouseMovedAtLeastOnce] = createSignal(false);
    const [getWasFirstMouseMoveHandled, setWasFirstMouseMoveHandled] = createSignal(false);
    const [getIsFirstRun, setIsFirstRun] = createSignal(true);
    const img = randomWallpaper();
    let bg: HTMLDivElement|null = null;


    createEffect(() => {
        const wx = getWindowX();
        const wy = getWindowY();
        const x = getMouseX();
        const y = getMouseY();
        const moved = getHasMouseMovedAtLeastOnce();
        const moveHandled = getWasFirstMouseMoveHandled();

        if (bg) {

            if(wx && wy) { //Będą nullami na telefonach - Patrz: line 6
                bg.style.transform = "translateX("+calcTransform(x, wx)+"%) translateY("+calcTransform(y, wy)+"%) scale(1.15)";
            }

            if (moved && !moveHandled) {
                bg.style.opacity = "100%";
                bg.style.animation = "fadeIn 2s";
                setWasFirstMouseMoveHandled(true);
            }
        }
        
        else if (!getIsFirstRun()) {
            Log("Background", "UNIVERSE VIOLATION DETECTED: BACKGROUND DIV MISSING ON NON-FIRST RUN!", null, "e");
        }

        setIsFirstRun(false);
    })


    onMount(() => {
        bg = document.getElementById("background-viewer") as HTMLDivElement|null;

        document.onmousemove = (e) => updateMouseSignals(setMouseX, setMouseY, setHasMouseMovedAtLeastOnce, e);
        window.onresize = () => updateWindowSizeSignals(setWindowX, setWindowY);
        
        updateWindowSizeSignals(setWindowX, setWindowY);
    })
    

    return (
        <div
            id="background-viewer"
            class="fixed left-0 top-0 h-full w-full -z-50 bg-cover bg-center opacity-0"
            style={"background-image: url(\""+img+"\")"}
        />
    );
}