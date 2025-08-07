import { useLocation, A, Location } from "@solidjs/router";
import { createEffect, createSignal, onMount } from "solid-js";
import { Log } from "~/lib/utils";


type NavItemProps = (
    {
        to: string, children:any,
        nohighlight?:true, hamburgermode?:true, splash?:true, smallonly?:true
    } & (
        {last?:true, class?: undefined} |
        {last?:undefined, class?: string}
    )
)


function generateClasses(props: NavItemProps, loc: Location<unknown>, winx: number|null){
    if((props.splash || props.smallonly) && winx) {
        const tw_sm = winx < 640;
        if(tw_sm) console.log("wykryto małe okno");
    }

    return (((props.to.split("/")[1] === loc.pathname.split("/")[1]) && !props.nohighlight)
        ?
        "border-sky-600 sm:border-b-2"
        :
        `border-transparent border-b-2 ${props.nohighlight? "":"hover:border-sky-600"}`
    )
    + ((!(props.to.split("/")[1] === loc.pathname.split("/")[1]) && !props.hamburgermode)
        ?
        " hidden sm:inline border-transparent"
        :
        ""
    )
}


export function NavItem(props: NavItemProps) {
    const [getWindowX, setWindowX] = createSignal(null as number|null);
    const getClasses = () => generateClasses(props, useLocation(), getWindowX());
    const updateWindowX = () => setWindowX(window.innerWidth);
    
    onMount(() => {
        updateWindowX();
        Log("Navbar", "Zamontowano nav-item do: "+props.to);
        if(props.splash || props.smallonly) {
            console.log("[Navbar] Ten nav-item śledzi szerokość okna - obecnie: "+getWindowX())
            window.onresize = () => updateWindowX();
        }
    })
    
    const margins = props.class ? props.class : `mx-1.5 md:mx-6 ${props.last ? "mr-6 md:mr-20":""}`;
    return (
        <li class={`${getClasses()} ${margins} ${props.nohighlight ? "" : "sm:hover:pb-px"}`}>
            <A href={props.to}>{props.children}</A>
        </li>
    );
}


export function LilGhost(){
    return(<A href="/">
        <img src="/icon-modern.png" width="64" height="64" class="mx-1.5 md:mx-6 min-w-16 sm:hover:scale-110"/>
    </A>)
}