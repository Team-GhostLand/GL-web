export const MODULE_PATH = "http://130.162.246.47:25575/modules/" //We can't just use the `/modules/` prefix because: a) It would make local development cumbersome (you'd need to have a the GhostLand webserver running, or have weird issues - like /map/gra-dynmap embedding the GhostLand website recursievly) or force us to go through the hassle of setting up different envs for prod and dev (which, btw, would propably also lead us to using something like the GetModule func below - so it's not like the code would get much simpler); b) It would force us to use <a/> (instead of <A/>) whenever we want to redirect to a module (which introduces unnecessary cognitive overhead) or force us to configure Solid to somehow exclude `/modules` from its redirects (and I don't know how to do that) ; c) I'm not sure how well would this work with Caddy's reverse proxy (well, ig... Since we're redirecting from something that would - itself - be hosted on „/”, it probably wouldn't matter, but (just for future reference) I don't know how this would work the other way around (say, a module would redirect to „/” - would it have gone to http://130.162.246.47:25575/ or http://130.162.246.47:25575/modules/some_module)))

export function GetModule(name?: string) {
    
    if(!name || name === ""){
        return MODULE_PATH;
    }
    
    return MODULE_PATH+name+"/";
}

export function Log(source: string, message: string, obj?: any, level?: 'w'|'e'|'d'|'i'|"log"|"blank"){
    const l = `[${source}] ${message}`
    const c = console;
    
    switch(level){
        case "blank":
            return l+" ||| "+obj;
        case 'w':
            c.warn(l, obj);
            return l;
        case 'e':
            c.error(l, obj);
            return l;
        case 'd':
            c.debug(l, obj);
            return l;
        case 'i':
            c.info(l, obj);
            return l;
        default:
            c.log(l, obj);
            return l;
    }
}