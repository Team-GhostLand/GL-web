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
  category: "Budowle" | "Krajobrazy" | "Fabryki" | "Ekipa";
};

export const WORLD_SCREENSHOTS: Screenshot[] = [
  { id: "swiat", url: swiat.url, title: "Świat GhostLand", category: "Krajobrazy" },
  { id: "tower", url: tower.url, title: "Wielka Wieża we mgle", category: "Budowle" },
  { id: "lostnisko", url: lostnisko.url, title: "Lotnisko GAY", category: "Budowle" },
  { id: "fabryka", url: fabryka.url, title: "Wielka fabryka nocą", category: "Fabryki" },
  { id: "evil", url: evilFactory.url, title: "Kotłownia zła", category: "Fabryki" },
  { id: "cozy", url: cozy.url, title: "Przytulne wnętrze", category: "Budowle" },
  { id: "bar", url: sunsetBar.url, title: "Bar o zachodzie", category: "Budowle" },
  { id: "group", url: groupPhoto.url, title: "Ekipa GhostLand", category: "Ekipa" },
];

export const PARALLAX_BACKGROUNDS = [
  swiat.url,
  tower.url,
  lostnisko.url,
  fabryka.url,
  sunsetBar.url,
];