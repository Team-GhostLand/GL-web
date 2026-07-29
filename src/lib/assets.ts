import ghostLogo from "@/assets/Ghostland_8.png.asset.json";
import ghostBanner from "@/assets/Ghostland_8_Banner.png.asset.json";
import groupPhoto from "@/assets/group-photo.png.asset.json";
import cozy from "@/assets/cozy-interior.png.asset.json";
import tower from "@/assets/great-tower.png.asset.json";
import lostnisko from "@/assets/screen-lostnisko.png.asset.json";
import swiat from "@/assets/screen-swiat_ghostland.png.asset.json";
import fabryka from "@/assets/screen-fabryka.png.asset.json";
import sunsetBar from "@/assets/sunset_outdoor_bar.png.asset.json";
import evilFactory from "@/assets/evil-factory.png.asset.json";

export const LOGO_URL = ghostLogo.url;
export const BANNER_URL = ghostBanner.url;

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
  { id: "swiat", url: swiat.url, title: "Świat GhostLand", category: "Krajobrazy", date: "2021-01-01", edition: 5, description: "Malowniczy krajobraz świata GhostLand z perspektywy lotu ptaka." },
  { id: "tower", url: tower.url, title: "Wielka Wieża we mgle", category: "Budowle", date: "2021-01-01", edition: 5, description: "Monumentalna wieża wyłaniająca się z gęstej mgły." },
  { id: "lostnisko", url: lostnisko.url, title: "Lotnisko GAY", category: "Budowle", date: "2021-01-01", edition: 5, description: "Główne pasy startowe i terminal węzła lotniczego." },
  { id: "fabryka", url: fabryka.url, title: "Wielka fabryka nocą", category: "Fabryki", date: "2021-01-01", edition: 5, description: "Nocne oświetlenie industrialnej części GhostLand." },
  { id: "evil", url: evilFactory.url, title: "Kotłownia zła", category: "Fabryki", date: "2021-01-01", edition: 5, description: "Serce podziemnego kompleksu technologicznego." },
  { id: "cozy", url: cozy.url, title: "Przytulne wnętrze", category: "Budowle", date: "2021-01-01", edition: 5, description: "Ciepła baza mieszkalna z kominkiem i widokiem." },
  { id: "bar", url: sunsetBar.url, title: "Bar o zachodzie", category: "Budowle", date: "2021-01-01", edition: 5, description: "Strefa relaksu na świeżym powietrzu." },
  { id: "group", url: groupPhoto.url, title: "Ekipa GhostLand", category: "Ekipa", date: "2021-01-01", edition: 5, description: "Wspólne zdjęcie graczy edycji." },
];

export const PARALLAX_BACKGROUNDS = [
  swiat.url,
  tower.url,
  lostnisko.url,
  fabryka.url,
  sunsetBar.url,
];