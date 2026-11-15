import { Html, Head, Main, NextScript } from "next/document";

/* Runs before the first paint. Returning visitors (this session) and anyone who prefers reduced
   motion get the "intro-seen" class straight away, so the intro overlay never flashes for them.
   Must match INTRO_KEY in components/Intro.js. */
const INTRO_GATE = `try{var d=document.documentElement;if(sessionStorage.getItem('aw-intro-seen')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('intro-seen')}catch(e){}`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_GATE }} />
        {/* without JavaScript nothing could dismiss the intro, so it is never shown */}
        <noscript>
          <style>{`.intro{display:none!important}`}</style>
        </noscript>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
