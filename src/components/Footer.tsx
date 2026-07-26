import { Link } from "@tanstack/react-router";
import { LOGO_URL } from "@/lib/assets";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/40 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 text-center text-xs text-muted-foreground">
        <img src={LOGO_URL} alt="" className="h-8 w-8 opacity-70" />
        <p>
          © {new Date().getFullYear()} GhostLand · projekt niekomercyjny · Minecraft to znak towarowy Mojang / Microsoft.
        </p>
        <p className="opacity-60">
          Zamknięta whitelista · dołączenie tylko z polecenia lub przez JIFO.{" "}
          <Link to="/lore" className="underline underline-offset-2 hover:text-foreground">
            Poznaj lore
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}