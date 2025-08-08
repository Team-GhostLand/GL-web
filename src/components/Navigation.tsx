import { useLocation, A, Location } from "@solidjs/router";
import { createEffect, createSignal, onMount } from "solid-js";
import { Log } from "~/lib/utils";


type NavItemProps = (
    {
        to: string, children:any,               //Use your brain
        nohighlight?:true, hamburgermode?:true, //Hamburger mode - whether the Hamburger Menu is open; nohighlight - stops ALL highligting (both hover and URL-matched)
        splash?:true, smallonly?:true           //Splash - a splash-screen, so something that should show in both small and big views; smallonly - will not show in big views; DEFAULT: Only shows in big views, unless currently selected (*this behaviour was probably supposed to override the splash screen).
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
    + (!(doesAdressMatch(props, loc) && !props.hamburgermode)                           //...this is COMPLETELY unrelated to that.
        ?
        " hidden sm:inline border-transparent" //TODO: Implement the hamburger menu (or disable it this functionality for the time being) becasue - right now - all that happens is that nav elements disappear on smaller screens (eg. mobile) becasue of that pesky „hidden” (that only gets overriden by „sm:inline” once „sm:”'s threshold is met - said threshold happens to be 640px (what's being checked on line 20), which is why this „bug” (or rather - now, knowing the context - intentional, but unfinished behaviour) took me a whoping 1,5h to locate: I kept thinking that it has something to do with that (very obviously usless, but I had no other leads) code on line 20).
        :
        ""
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