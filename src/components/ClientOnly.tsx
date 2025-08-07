import {clientOnly} from "@solidjs/start";
const ClientOnly_INTERNAL_IMPORT = clientOnly(() => import("~/components/ClientOnly"));

export function ClientOnly(props: {children: any}) {
    return (
        <ClientOnly_INTERNAL_IMPORT>
            {props.children}
        </ClientOnly_INTERNAL_IMPORT>
    );
}

/** DO NOT USE!!! DO NOT USE!!! DO NOT USE!!! This has to be a default export to work internally, but DO NOT ACTUALLY USE IT! */
export default function ClientOnly_INTERNAL_DONTUSE(props: {children: any}) {
    return (
        <>
            {props.children}
        </>
    );
}