import { Link } from "@tanstack/react-router";
import { LOGO_URL } from "@/lib/assets";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/40 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 text-center text-xs text-muted-foreground">
        <img src={LOGO_URL} alt="" className="h-8 w-8 opacity-70" />
        <p>
          © {new Date().getFullYear()} GhostLand · projekt niekomercyjny · Minecraft to znak towarowy Mojang / Microsoft. · Contact email, as requested by Mojang EULA, is iwo@laskowski.pro
        </p>
        <p className="opacity-60">
          Zamknięta whitelista · dołączenie tylko z polecenia lub przez JIFO.{" "}
          <Link to="/lore" className="underline underline-offset-2 hover:text-foreground">
            Poznaj lore
          </Link>
          .
        </p>
        <p className="inline-flex items-center gap-1.5 text-[11px] opacity-70">
          Projekt i szata graficzna strony zrobiona z <Heart className="h-3 w-3 animate-pulse text-primary" /> przez Iwo —
          <a
            href="https://jifo.dev"
            target="_blank"
            rel="noreferrer"
            className="group relative font-semibold text-foreground transition-colors hover:text-primary"
          >
            <span className="relative z-10">jifo.dev</span>
            <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
          </a>
        </p>
        <p className="inline-flex items-center gap-1.5 text-[11px] opacity-70">
          Technical execution made with 💙 by Team GhostLand (esp. jifo.dev & Guzio) —
          <a
            href="https://github.com/orgs/Team-GhostLand/people"
            target="_blank"
            rel="noreferrer"
            className="group relative font-semibold text-foreground transition-colors hover:text-primary"
          >
            <span className="relative z-10">GitHub</span>
            <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
          </a>
        </p>
      </div>
    </footer>
  );
}