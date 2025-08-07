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