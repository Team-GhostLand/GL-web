import { Show } from "solid-js";

export default function NoJsTaunter(props: {class?: string}) {
    
    const debugMode = false;
    const txt = "Aktywuj JS, stoopid!"

    return (
        <div class={props.class}>
            <ThisThingIsHoldingTheWholeFuckingLayoutTogether/>
            <Show when={debugMode}>
                {txt}
            </Show>
            <noscript>
                {txt}
            </noscript>
            <ThisThingIsHoldingTheWholeFuckingLayoutTogether/>
        </div>
    );
}

function ThisThingIsHoldingTheWholeFuckingLayoutTogether(){
    return <span class="invisible text-xs">.</span>
}