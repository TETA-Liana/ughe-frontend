/*
 * FONT CHOICE
 * -----------
 * Preferred font: Museo Slab (the font used on ughe.org). It is a commercial font
 * (by exljbris, distributed via Adobe Fonts / MyFonts) and cannot be freely bundled,
 * so this app uses the allowed alternative: Roboto Slab.
 *
 * How it was found: searched "Roboto Slab" on Google Fonts
 *   https://fonts.google.com/specimen/Roboto+Slab  (free, Apache License 2.0).
 *
 * How it is included: through Next.js' built-in `next/font/google` module (below).
 * At build time Next.js downloads the font files from Google Fonts and serves them
 * from this app itself, then exposes the font as the CSS variable `--font-slab`,
 * which is used in app/globals.css. Rockwell and Courier are listed there as fallbacks.
 */
import { Roboto_Slab } from "next/font/google";
import "./globals.css";

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-slab",
  display: "swap",
});

export const metadata = {
  title: "UGHE Test Web App",
  description: "University of Global Health Equity - test web app (Next.js + Django)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={robotoSlab.variable}>
      <body>{children}</body>
    </html>
  );
}
