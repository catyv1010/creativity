export interface FontPairing {
  id: string;
  name: string;
  display: string;    // Google Font name for headings
  body: string;       // Google Font name for body text
  category: "modern" | "classic" | "creative" | "minimal" | "bold";
}

export const FONT_PAIRINGS: FontPairing[] = [
  { id: "inter-system", name: "Moderna", display: "Inter", body: "Inter", category: "modern" },
  { id: "playfair-lato", name: "Elegante", display: "Playfair Display", body: "Lato", category: "classic" },
  { id: "bebas-roboto", name: "Impacto", display: "Bebas Neue", body: "Roboto", category: "bold" },
  { id: "poppins-opensan", name: "Limpia", display: "Poppins", body: "Open Sans", category: "minimal" },
  { id: "montserrat-merri", name: "Profesional", display: "Montserrat", body: "Merriweather", category: "classic" },
  { id: "oswald-source", name: "Editorial", display: "Oswald", body: "Source Sans 3", category: "bold" },
  { id: "raleway-nunito", name: "Suave", display: "Raleway", body: "Nunito", category: "modern" },
  { id: "archivo-inter", name: "Tech", display: "Archivo Black", body: "Inter", category: "bold" },
  { id: "dmserif-dmsans", name: "Sofisticada", display: "DM Serif Display", body: "DM Sans", category: "classic" },
  { id: "spacegrotesk-syne", name: "Futurista", display: "Space Grotesk", body: "Syne", category: "creative" },
  { id: "sacramento-quicksand", name: "Artistica", display: "Sacramento", body: "Quicksand", category: "creative" },
  { id: "anton-work", name: "Dramatica", display: "Anton", body: "Work Sans", category: "bold" },
];

// All unique Google Font families used
export const ALL_FONTS: string[] = [...new Set(FONT_PAIRINGS.flatMap(p => [p.display, p.body]))];

// Generate Google Fonts URL for loading
export function getGoogleFontsUrl(fonts?: string[]): string {
  const families = (fonts || ALL_FONTS)
    .map(f => f.replace(/ /g, '+'))
    .map(f => `family=${f}:wght@300;400;500;600;700;800;900`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
