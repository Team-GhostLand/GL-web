import { readApiRoute } from "./settings";

export const LOGO_URL = "/Ghostland_8.png";
export const BANNER_URL = "/Ghostland_8_Banner.png";
export const WORLD_SCREENSHOTS: Screenshot[] = await fetchGalleryScreenshots()

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

async function fetchGalleryScreenshots(): Promise<Screenshot[]> {
  try{
    const screenshots = await (await readApiRoute("/api/screenshots.json")).json();
    if (Array.isArray(screenshots)) return screenshots;
    else throw "TYPE ERROR!";
  }
  catch(e){
    console.error("Error fetching screenshots:", e);
    return [];
  }
}

export const PARALLAX_BACKGROUNDS = [
  "/initial_screenshots/group-photo.png",
  "/initial_screenshots/cozy-interior.png",
  "/initial_screenshots/great-tower.png",
  "/initial_screenshots/screen-lostnisko.png",
  "/initial_screenshots/screen-swiat_ghostland.png",
  "/initial_screenshots/screen-fabryka.png",
  "/initial_screenshots/sunset_outdoor_bar.png",
  "/initial_screenshots/evil-factory.png"
];