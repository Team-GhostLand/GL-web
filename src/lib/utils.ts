export const MODULE_PATH = "http://130.162.246.47:25575/modules/" //We can't just use the `/modules/` prefix because it would make local development cumbersome becasue you'd need to have a the GhostLand webserver running, or have weird issues - like /map/gra-dynmap embedding the GhostLand website recursievly). In theory, we could eventually set up something inside GetModule that checks whether we're running dev or prod - but even then, this const here would still be useful, in case it turns out that we are, in fact, running dev.

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