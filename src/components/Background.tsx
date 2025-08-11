import { createSignal, onMount, createEffect } from "solid-js";
import "./Background.css";
import { Log } from "~/lib/utils";


function updateMouseSignals(setX: Function, setY: Function, markMoved: Function, vec: any){
    if (window.matchMedia("(pointer: coarse)").matches) return; //Ignorowanie na telefonach (bo inaczej tło by skakało do punktów dotknięcia, co raczej nie wyglądałoby za dobrze)
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
        "/bg43.webp",
        "/bg42.webp",
        "/bg41.webp",
        "/bg40.webp",
        "/bg39.webp",
        "/bg38.webp"
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

            if(wx && wy) { //Będą nullami na telefonach - Patrz: line 7
                bg.style.transform = "translateX("+calcTransform(x, wx)+"%) translateY("+calcTransform(y, wy)+"%) scale(1.15)";
            }

            //This is so that the background doesn't render instantly when the image downloads (which looked janky), but waits for your first mose move (or screen tap on a phone)
            if (moved && !moveHandled) {
                bg.style.opacity = "100%";
                bg.style.animation = "fadeIn 2s";
                setWasFirstMouseMoveHandled(true);
            }
        }
        
        else if (!getIsFirstRun()) {
            //The first-run happens before we get to line 47 (before calling return()), instead of being triggered by the signals (which itself are triggered by mouse movements and/or window resizes). But anything subsequent should only be triggered by mouse movemet and/or window resizes - which should only be handled by the browser after the execution of the current function finished, aka return() was called, aka the <div> should exist. If it doesn't (probably becasue someone messed around with Inspect Element) - well, that's a universe violation!
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