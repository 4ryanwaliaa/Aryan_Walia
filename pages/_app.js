import "@/styles/globals.css";
import { MotionConfig } from "framer-motion";
import { Archivo, IBM_Plex_Mono, Newsreader } from "next/font/google";

/* Fonts are downloaded at build time and served from this site, so the first paint never
   waits on a request to Google. The CSS reads them through these variables. */
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], weight: ["300", "400", "500", "600"], display: "swap" });
const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-archivo: ${archivo.style.fontFamily};
          --font-newsreader: ${newsreader.style.fontFamily};
          --font-plex: ${plex.style.fontFamily};
        }
      `}</style>
      <MotionConfig reducedMotion="user">
        <Component {...pageProps} />
      </MotionConfig>
    </>
  );
}
