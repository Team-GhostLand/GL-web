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
    
    //I couldn't tell you, for the life of me, what purpouse does this bit of code here serve. One-year-ago me was cooking something, it seems, but never finished - and present me has no idea why is the kitchen on fire, but is too scared of breaking something to extinguish it.
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
        " hidden sm:inline border-transparent" //TODO: Implement hamburger-mode correctly (or disable it this functionality for the time being) becasue - right now - all that happens is that nav elements disappear on smaller screens (eg. mobile) becasue of that pesky „hidden” (that only gets overriden by „sm:inline” once „sm:”'s threshold is met - said threshold happens to be 640px (what's being checked on line 20), which is why this „bug” (or rather - now, knowing the context - intentional, but unfinished behaviour) took me a whoping 1,5h to locate: I kept thinking that it has something to do with that (very obviously usless, but I had no other leads) code on line 20).
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
        
        //The same deal as line 20 - no idea wtf is this. The fuck do you mean is „tracking” window size? This bitch ain't tracking shit; it only runs once on mount. [Nevermind, it does - an event handler is registered as „on resize: updateWindowX”, and getWindowX is then put as part of a computed signal (it looks like a normal func, but it's actually a signal simply becasue it references another signal - computed signals don't need explicit declaration) „getClasses”.] For that matter, it seems related to line 20 becasue it checks for the same propcheck for „splash” and „smallonly” [and also is responsible for passing window sizes into it]. So... Great! Now the whole restaurant is on fire! I have no clue what happend to this part of the codebase. WHAT WAS I COOKING???
        if(props.splash || props.smallonly) {
            console.log("[Navbar] Ten nav-item śledzi szerokość okna - przy starcie, wynosiła ona: "+getWindowX())
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