import { Caveat, Plus_Jakarta_Sans } from "next/font/google";

// Polices de la maquette : Plus Jakarta Sans (texte et titres), Caveat (signature manuscrite)
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
// Graisse unique pour les titres : un titre déclaré en 400 s'affiche tout de même en gras
const jakartaHeading = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "700", variable: "--font-jakarta-heading", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], weight: "500", variable: "--font-caveat", display: "swap", preload: false });

/** Classes à poser sur <html> : variables CSS des polices (site public et back-office). */
export const fontVariables = [jakarta, jakartaHeading, caveat].map((f) => f.variable).join(" ");
