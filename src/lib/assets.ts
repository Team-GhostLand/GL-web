export const LOGO_URL = "/Ghostland_8.png";
export const BANNER_URL = "/Ghostland_8_Banner.png";

export type Screenshot = {
  id: string;
  url: string;
  title: string;
  category: "Budowle" | "Krajobrazy" | "Fabryki" | "Ekipa" | string;
  description?: string;
  date?: string;
  edition?: number;
  tags?: string[];
};

export const WORLD_SCREENSHOTS: Screenshot[] = [
  { id: "group", url: "/initial_screenshots/group-photo.png", title: "Ekipa GhostLand", category: "Ekipa", date: "2021-01-01", edition: 5, description: "Wspólne zdjęcie graczy edycji." },
  { id: "cozy", url: "/initial_screenshots/cozy-interior.png", title: "Przytulne wnętrze", category: "Budowle", date: "2021-01-01", edition: 5, description: "Ciepła baza mieszkalna z kominkiem i widokiem." },
  { id: "tower", url: "/initial_screenshots/great-tower.png", title: "Wielka Wieża we mgle", category: "Budowle", date: "2021-01-01", edition: 6, description: "Monumentalna wieża wyłaniająca się z gęstej mgły." },
  { id: "lostnisko", url: "/initial_screenshots/screen-lostnisko.png", title: "Lotnisko GAY", category: "Budowle", date: "2021-01-01", edition: 4, description: "Główne pasy startowe i terminal węzła lotniczego." },
  { id: "swiat", url: "/initial_screenshots/screen-swiat_ghostland.png", title: "Świat GhostLand", category: "Krajobrazy", date: "2021-01-01", edition: 5, description: "Malowniczy krajobraz świata GhostLand z perspektywy lotu ptaka." },
  { id: "fabryka", url: "/initial_screenshots/screen-fabryka.png", title: "Wielka fabryka nocą", category: "Fabryki", date: "2021-01-01", edition: 5, description: "Nocne oświetlenie industrialnej części GhostLand." },
  { id: "bar", url: "/initial_screenshots/sunset_outdoor_bar.png", title: "Bar o zachodzie", category: "Budowle", date: "2021-01-01", edition: 5, description: "Strefa relaksu na świeżym powietrzu." },
  { id: "evil", url: "/initial_screenshots/evil-factory.png", title: "Kotłownia zła", category: "Fabryki", date: "2021-01-01", edition: 5, description: "Serce podziemnego kompleksu technologicznego." },
];

export const PARALLAX_BACKGROUNDS = [
  WORLD_SCREENSHOTS[4].url,
  WORLD_SCREENSHOTS[2].url,
  WORLD_SCREENSHOTS[3].url,
  WORLD_SCREENSHOTS[5].url,
  WORLD_SCREENSHOTS[6].url,
];