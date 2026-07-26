# Redesign GhostLand 8.0

Nowa strona w stylu mrocznego, immersyjnego świata Minecraft GhostLand — z bursztynowo-fioletowo-błękitną paletą pasującą do logo, płynnymi animacjami i ukrytym panelem admina.

## Stack i decyzje
- **React + TS + Tailwind v4** (istniejący TanStack Start)
- **framer-motion** — animacje licznika, hero, przejść
- **lucide-react** — ikony
- **Persystencja: localStorage** (mock) — hook `useAdminSettings` z Context/event bus, zmiany w `/admin` natychmiast widoczne w danej sesji
- **Status serwera: mcsrvstat.us API** (`https://api.mcsrvstat.us/3/{host}`), z override z panelu
- **Język: PL + EN toggle** — lekki słownik i18n w kontekście (bez i18next)
- **Screeny: upload z panelu admina** — pliki jako base64 do localStorage (limit ~5MB/screen z ostrzeżeniem)
- **Logo**: uploady użytkownika → `lovable-assets` (Ghostland_8.png favicon/nav, Ghostland_8_Banner.png hero)
- **Screeny world** (great-tower, screen-lostnisko, screen-swiat_ghostland, screen-fabryka, cozy-interior, sunset_outdoor_bar, evil-factory, group-photo) → assets, użyte jako tła paralaksy i seed galerii

## Design system (styles.css)
Ciemna paleta oparta o logo:
- `--background`: głęboka noc `oklch(0.14 0.04 275)`
- `--foreground`: mgła `oklch(0.95 0.01 275)`
- `--primary` (amber/ember z „8.0"): `oklch(0.72 0.17 55)`
- `--accent` (fiolet ducha): `oklch(0.55 0.20 285)`
- `--secondary` (błękit oczek): `oklch(0.68 0.18 240)`
- `--card`: `oklch(0.18 0.04 275) / 60%` + `backdrop-blur-md`
- Gradients: `--gradient-ember`, `--gradient-ghost`, `--gradient-fog`
- Shadows: `--glow-ember`, `--glow-ghost`
- Fonts przez `<link>` w `__root.tsx`:
  - Nagłówki: **Cinzel** (fantasy) + display **Uncial Antiqua** dla „GHOSTLAND"
  - UI: **Inter**

## Struktura routingu
```
src/routes/
  __root.tsx          layout: navbar szklany + tło paralaksy + Providers
  index.tsx           strona główna
  lore.tsx            historia projektu, edycje, organizacje, ekipa
  screenshots.tsx     galeria (masonry + lightbox)
  download.tsx        instrukcje + whitelist bot
  login.tsx           ukryty, brak w nav
  _admin/route.tsx    guard (localStorage token) + shell
  _admin/index.tsx    dashboard
```

## Navbar
Szklany, sticky, `backdrop-blur-md`:
- Logo GhostLand (Ghostland_8.png) z lekką animacją glitch/flicker → `/`
- „Pobierz Paczkę" — CTA link do `/download` (ember glow gdy edycja wystartowała)
- Status serwera — dynamiczny badge (🟢 X/Y • 🟡 Przerwa • 🔴 Offline) z tooltipem
- Discord — external link
- Zrzuty Ekranu → `/screenshots`
- Lore → `/lore`
- Language toggle PL/EN (mały)
- **Brak** loginu/konta/mapy kolejowej

## Strona główna `/`
1. **Interactive parallax background** — losowo wybrane tło z 8 screenów świata, `<Parallax>` reagujący na mouse (translate ~20px), 2s fade-in, ciemna vignetta + gradient overlay
2. **HERO** — „GHOSTLAND" wielki, ember gradient text z lekkim shimmerem; podtytuł „Edycja 8.0 · Fabric 1.20.1 · immersja, przygoda, technologia, wspólne gotowanie"
3. **Live Countdown** — 4 kafle (dni/godz/min/sek) z flip-animation (framer-motion). Po 00:00:00: fade w komunikat „EDYCJA 8 OFICJALNIE WYSTARTOWAŁA!" (particles), CTA „Pobierz Paczkę Modyfikacji" pulsuje w emberze
4. **Quick Download** — karta z przyciskiem `.mrpack` + krok-po-kroku (whitelistuj przez bota Discord `/whitelistuj <nick>`)
5. **Ciekawostki strip** — 4 statystyki (8 edycji · 100+ graczy · 5 lat · tysiące godzin)
6. **Community widget** — ciemny `<iframe>` Discord widget z szkieletowym loaderem
7. **Zaproszenie do lore** — teaser kart edycji + link do `/lore`

## `/lore`
- Nagłówek z lore genezy (Iwo/JIFO, sukcesor szkolnego serwera → 5 lat projektu)
- Timeline edycji 1–8 z krótkim opisem, wyróżniona 5. („najbardziej pamiętna") i 8. („nadchodząca — jeszcze lepsza")
- Sekcja **Special Mentions** (karty): JIFO, Guzio, Midnight, Kanapkos, DjPalemkow — każda z rolą
- Sekcja **Organizacje**: GRA, GAY, GTA, MAGA + easter-egg card „GeistWelt" (nielegalna, z żartobliwą etykietą)
- Sekcja o zamkniętej whiteliście i etosie („dobra atmosfera")

## `/screenshots`
- Masonry grid (Tailwind columns) ze screenów z assetów + tych wgranych w panelu
- Lightbox (framer-motion modal, esc/klik zamyka)
- Filtry kategorii (Budowle · Krajobrazy · Fabryki · Ekipa)

## `/download`
- Duży CTA `.mrpack` (URL z admin settings)
- Instrukcja: Prism Launcher / Modrinth App import + whitelist step
- FAQ (skrócone)

## Ukryty `/login`
- Prosty formularz (login + hasło). Weryfikacja lokalna (domyślnie `admin` / `ghostland8`, konfigurowalne w `src/lib/admin-config.ts`)
- Po sukcesie: `localStorage.setItem('gl_admin_token', ...)` + redirect `/admin`
- Guard w `_admin/route.tsx`: brak tokena → redirect `/login`

## `/admin` — Dashboard
Zakładki (Tabs):
1. **Modpack** — input URL pliku, wersja, przycisk „Zapisz i Opublikuj" → aktualizuje link w Quick Download
2. **Countdown** — date-time picker (shadcn), przyciski „Resetuj", „Pauzuj", „Wymuś Start (00:00:00)"
3. **Status serwera** — radio: Auto (mcsrvstat.us) / Wymuś ONLINE / Przerwa / Offline / Start Edycji; input hosta serwera
4. **Discord** — link zaproszenia, ID widgetu, opcjonalny webhook URL + formularz „Wyślij ogłoszenie" (POST na webhook)
5. **Screeny** — upload multi-file (base64), lista z podglądem + delete, kategoria

Wszystkie zmiany trzymane w jednym `AdminSettings` w localStorage; `AdminSettingsProvider` w root nasłuchuje `storage` event → cała strona reaguje natychmiast.

## Animacje
- Hero title: shimmer + subtle glitch (keyframes)
- Countdown digits: flip on change
- Nav status badge: pulsujący dot
- Karty lore: `whileHover scale-102` + glow
- Screenshots: fade + zoom on hover, lightbox spring
- Parallax bg: `useMotionValue` + `useTransform` na mouseX/Y

## Techniczne detale
- `src/lib/admin-settings.tsx` — Context + hook
- `src/lib/i18n.tsx` — PL/EN provider + `useT()`
- `src/lib/mc-status.ts` — fetch mcsrvstat + cache 30s
- `src/components/ParallaxBackground.tsx`
- `src/components/CountdownTimer.tsx`
- `src/components/StatusBadge.tsx`
- `src/components/Navbar.tsx`, `Footer.tsx`
- `src/routes/__root.tsx` — inject fonts + providers + head meta per route
- Head meta per route: unikalne title/description/og

## Out of scope (na później)
- Prawdziwy backend/DB (Lovable Cloud)
- Auto-pull screenów z Discord webhooka
- Prawdziwa autoryzacja admina (obecnie tylko mock — hasło w kodzie klienckim = tylko obfuskacja, nie bezpieczeństwo; wystarczy do ukrycia UI)
