import { Suspense } from "solid-js";
import { MetaProvider } from "@solidjs/meta";
import { A, Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { NavItem, LilGhost } from "~/components/Navigation";
import "./app.css";
import Background from "~/components/Background";
import { ClientOnly } from "~/components/ClientOnly";
import { GetModule } from "./lib/utils";

export default function App() {
    return (
        <Router
            root={props => (
                <MetaProvider>
                    <ClientOnly>
                        <Background />
                    </ClientOnly>
                    <nav class="backdrop-blur-lg fixed top-0 w-full overflow-x-scroll flex text-xl font-light text-gray-200 text-nowrap">
                        <ul class="flex items-center">
                            <LilGhost/>
                            <NavItem to={GetModule("ci")} target="_self">Pliki</NavItem>
                            <NavItem to="/map">Mapa</NavItem>
                            <NavItem to="/photos" last>Screenshoty</NavItem>
                        </ul>
                        <ul class="ml-auto items-center flex">
                            <NavItem nohighlight splash class="mr-1.5 md:mr-6" to="/status">🔵 {"${status}"}</NavItem>
                            <NavItem to="/account">Zaloguj się</NavItem>
                        </ul>
                    </nav>
                    <div class="grid" style="grid-template-rows: [cont] minmax(calc(100vh - 1.75rem), auto) [footer] 1.75rem">
                        <Suspense>
                            {/*Może się wydawać, że zawijanie całego core aplikacji w grid to dzwiny pomysł. I... Muszę się zgodzić!
                               Ale był to jedyny sposób, żeby footer zachowywał się tak, jak chciałem.
                               
                               A jeśli chodzi o inne zawijanie (<Suspense></Suspense>), to... Yyy...
                               Nie mam pojęcia. Tak już było. Ja tam nie widzę żadnych Suspense Boundaries
                               w swoich drogach (ani - co ważniejsze - nie było w przykładowych), ale może
                               jakaś gdzieś tam jest wewnętrznie or something.
                               
                               Finalnie, jeśli chodzi o zawijanie CAŁEJ CHOLERNEJ APLIKACJI w <MetaProvider></MetaProvider>:
                               tak kazała mi zrobić dokumentacja @solidjs/meta, więc się posłuchałem.*/
                            props.children}
                        </Suspense>
                        <footer class="w-full bottom-0 text-sm font-light text-gray-500 text-center">
                            Made with 💙 by <A href="https://github.com/Team-GhostLand/GL-web/graphs/contributors" class="border-b border-gray-500" target="_blank" rel="noopener noreferrer">Team GhostLand</A> in <A href="https://www.solidjs.com/" class="border-b border-gray-500" target="_blank" rel="noopener noreferrer">SolidJS</A>.
                        </footer>
                    </div>
                </MetaProvider> 
            )}
        >
            <FileRoutes />
        </Router>
    );
}