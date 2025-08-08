import { A } from "@solidjs/router";
import {LinkButton} from "~/components/Buttons";
import Embed from "~/components/Embed";
import GlitchyGhost from "~/components/GlitchyGhost";
import T from "~/components/T";

export default function Index() {
    return (
        <div class="p-4 flex flex-wrap">
            <T/>
            <div class="text-center block m-auto">
                <header class="max-6-xs text-6xl sm:text-9xl text-amber-200 font-fancy uppercase mt-12  md:mt-16 mb-5 md:mb-10">
                    GhostLand
                </header>
                {/* S: [5]+4=9 // B: [10]+4=14 */}
                <main class="max-w-xl mb-5 md:mb-10 mx-auto text-justify">
                    Pół-prywatny, współczesny modpack i serwer do Minecrafta 1.20.1, oparty na Fabric i celujący w zapewnienie <strong>pełnej immersji</strong> i dobrej zabawy, niezależnie do preferowanego stylu rozgrywki. <em>Dla każdego coś dobrego!</em> Od modów technicznych, przez <span class="text-nowrap">eksploracyjno-przygodowe</span>, po gotowanie.
                </main>
                {/* S:8 // B:8 */}
                <GlitchyGhost/>
                {/* S:4 // B:4 */}
                <LinkButton to="download" class="my-5 md:my-10">
                    <svg class="inline" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#ffffff"><path d="m733.33-77.33 115.34-115.34L825.33-216 750-140.67v-168.66h-33.33v168.66L641.33-216 618-192.67 733.33-77.33ZM480-815.33 223-667l257 149 256.33-149L480-815.33ZM120-313.67v-332.66q0-18 8.75-33.19 8.75-15.2 24.58-24.48l293.34-169q8.66-5 16.46-7 7.81-2 16.84-2 9.03 0 17.36 2 8.34 2 16 7l293.34 169q15.83 9.28 24.58 24.48 8.75 15.19 8.75 33.19v193h-66.67V-612l-293 170.67-293.66-170V-314l280 161.67v76.66L153.33-256q-15.83-9.28-24.58-24.48-8.75-15.19-8.75-33.19ZM726.67 0Q647 0 590.17-56.43q-56.84-56.44-56.84-136.5 0-80.07 56.84-136.9 56.83-56.84 136.5-56.84 79.66 0 136.5 56.75Q920-273.18 920-192.67q0 79.96-56.83 136.32Q806.33 0 726.67 0ZM480-482.33Z"/>
                    </svg> Pobierz
                </LinkButton>
            </div>
            {/* S:4+5=[9] // B:4+5=[9] */}
            <div class="block m-auto">
                <Embed
                    website="https://discord.com/widget?id=966397518445412413&theme=dark"
                    width={300}
                    height={500}
                    class="mb-5 md:mb-10"
                    throbber="/discord.gif"
                    icon_h={100}
                    icon_w={100}
                />
                {/* S:[5]+[5]=10 // B:[5]+[5]=10 */}
                <A href="https://github.com/Team-GhostLand/GhostLand7" target="_blank" rel="noopener noreferrer">
                    <img src="/github_badge.png" height="80" width="300" class="mb-5 md:mb-10"></img>
                </A>
            </div>
        </div>
    );
}