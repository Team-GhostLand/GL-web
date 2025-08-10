import { useLocation, A, Location } from "@solidjs/router";
import { createEffect, createSignal, onMount } from "solid-js";
import { Log } from "~/lib/utils";


type NavItemProps = (
    {
        to: string, children:any,                  //Use your brain
        nohighlight?:true, hamburgermode?:boolean, //Hamburger mode - whether the Hamburger Menu is open; nohighlight - stops ALL highligting (both hover and URL-matched)
        splash?:true, smallonly?:true              //Splash - a splash-screen, so something that should show in both small and big views; smallonly - will not show in big views; DEFAULT: Only shows in big views, unless currently selected or the Hamburger Menu is currently open (*this behaviour was probably supposed to override the splash screen).
    } & (
        {last?:true, class?: undefined} |
        {last?:undefined, class?: string}
        //Last is a predefined class-set (mr-6 md:mr-20), so it can't be used with class - just pass „mr-6 md:mr-20” manually, if a combination of these is needed.
    )
)

function doesAdressMatch(props: NavItemProps, loc: Location<unknown>){
    if (props.to.split("/")[0].length > 0 ) /*AKA „if it's the URL doesn't start with just a /”*/ return false; //Becasue we can't really compare those (whether they be relaitive links, like ../ (idk why you'd do that - maybe for a back button, or something) or completley external ones, like https://<...>)

    return (props.to.split("/")[1] === loc.pathname.split("/")[1]);
}

function generateClasses(props: NavItemProps, loc: Location<unknown>, winx: number|null){
    
    //I couldn't tell you, for the life of me, what purpouse does this bit of code here serve. One-year-ago me was cooking something, it seems, but never finished - and present me has no idea why is the kitchen on fire, but is too scared of breaking something to extinguish it. I know that this has to be related to the hambureger menu system and, presumably, tw_sm was supposed to be some condition used inside, but... Why keep it confined to an in-if scope? You can't do anything with it like that! Right now, all of this is little more than a digital Rube-Goldberg Machine to print a log message if the window gets tiny.
    if((props.splash || props.smallonly) && winx) {
        const tw_sm = winx < 640;
        if(tw_sm) console.log("wykryto małe okno");
    }

    return ((doesAdressMatch(props, loc) && !props.nohighlight)                         //Responsible for highligting the bottom...
        ?
        "border-sky-600 sm:border-b-2"                                                  //...if the adress matches and we're not in no-highlight mode, or...
        :
        `border-transparent border-b-2 ${props.nohighlight? "":"hover:border-sky-600"}` //...If the adress didn't match, but we're hovering over it (that latter isn't checked here; only in CSS - tho said CSS is applied here, based on whether we're in no-highlight mode). Meanwhile...
    )
    + ((doesAdressMatch(props, loc) && !props.hamburgermode)                           //...this is COMPLETELY unrelated to all of that.
        ?
        "" //When the hamburger menu is CLOSED and the adresses matched (which is what the check above does) - we do nothing. Border hiding/showing is handled above (to only show on bigger screens) and the element is SUPPOSED to be shown (so no „hidden sm:inline” needs to be set) when adresses matched, regardless of whether the screen is big or small.
        :
        " hidden-DISABLED-FOR-NOW-AND-REPLACED-WITH-EVERPRESENT-INLINE inline sm:inline border-transparent" //This happens if either: the hamburger menu is open (TODO: Add an alternative method of rendering for this occasion - neither hidden (becasue that makes it impossible to actually see the contents of the hamburger menu) nor inline (becasue the very point of a hamburger menu is to not have all the things inline, but one on top of the other)), regardless of whether the adresses matched  -  OR if the adresses didn't match and the hamburger menu is closed, in which case: a) we want all unmatched menu entries to hide (TODO: except the splash, if we're on the homescreen) on smaller screens becasue they don't have enough room to show them all anyway (NOTE: right now, this functionality is disabled becasue the Hamburger menu system isn't implemented - TODO: Implement it, and re-enable this); b) border-transparent doesn't do anything noteworthy (it's already being set in the above step, if the adresses didn't match)
    )
}


export function NavItem(props: NavItemProps) {
    const [getWindowX, setWindowX] = createSignal(null as number|null);
    const getClasses = () => generateClasses(props, useLocation(), getWindowX());
    const updateWindowX = () => setWindowX(window.innerWidth);
    
    onMount(() => {
        const name = `Navbar (to: ${props.to})`
        updateWindowX();
        Log(name, "Zamontowano nav-item do: "+props.to);
        
        if(props.splash || props.smallonly) {
            Log(name, "Ten nav-item śledzi szerokość okna - przy starcie, wynosiła ona: "+getWindowX())
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
        <img src="/icon-legacy.webp" width="64" height="64" class="mx-1.5 md:mx-6 min-w-16 sm:hover:scale-110 img-pixelated"/>
    </A>)
}