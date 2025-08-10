import type { JSX } from "solid-js/h/jsx-runtime"
import { A } from "@solidjs/router";


export default function Button(props: {children: any, onclick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>, class?: string, style?: string}){
    return <button
        class={"px-4 bg-sky-600 py-4 text-4xl rounded-md hover:bg-sky-800 "+props.class}
        style={props.style}
        onClick={props.onclick}
    >
        {props.children}
    </button>
}


export function LinkButton(props: {children: any, to: string, class?: string, style?: string, target?:string, rel?:string}){
    return <A href={props.to} target={props.target} rel={props.rel}>
        <Button style={props.style} class={props.class}>
            {props.children}
        </Button>
    </A>
}