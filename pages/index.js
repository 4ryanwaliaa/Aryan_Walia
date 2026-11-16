import Head from 'next/head';
import Link from 'next/link';
import React, { useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';
import Apps from '../components/Apps';
import Work from '../components/Work';
import { Journey, Contact } from '../components/Sections';
import CommandPalette from '../components/CommandPalette';
import { Crosshair, EASE, ScrollProgress, useActiveSection } from '../components/fx';
import Xray, { XrayButton } from '../components/Xray';
import { profile, now } from '../components/portfolioData';

/* Page order: hero, apps, work, experience, contact. */
const NAV = [
  { href: '#apps', label: 'Apps', n: '02' },
  { href: '#work', label: 'Work', n: '03' },
  { href: '#journey', label: 'Experience', n: '04' },
  { href: '#contact', label: 'Contact', n: '05' },
];
const WATCHED = ['top', 'apps', 'work', 'journey', 'contact'];

const SITE_URL = 'https://4ryanwaliaa.github.io/Aryan_Walia/';
const DESCRIPTION =
  'Aryan Walia is an Analyst at Deloitte and the founder of BugSnaps. He designs, builds and secures products end to end: the MyPentest pentesting platform, the MyRecon OSINT engine on web and Google Play, EndpointRadar, PhishLens and the Wake Me Android app.';
/* What a shared link says before anyone clicks it. */
const SHARE_TITLE = "hi, i'm aryan. i build and break software.";
const SHORT = 'I build and break software: BugSnaps, MyRecon, Android apps, web platforms, security tools and AI models. Analyst at Deloitte, CEH certified.';

/* Tells search engines this page is about one real, verifiable person. */
const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url: SITE_URL,
  jobTitle: now.role,
  worksFor: { '@type': 'Organization', name: now.org },
  founder: { '@type': 'Organization', name: 'BugSnaps', url: profile.bugsnaps },
  address: { '@type': 'PostalAddress', addressRegion: 'Delhi NCR', addressCountry: 'IN' },
  sameAs: [profile.linkedin, profile.github, profile.playDeveloper, profile.bugsnaps],
};

/* The bar at the top, and the only part of the page that changes as you scroll between
   sections. Kept apart from the page body so that change re-renders the bar alone. */
function Nav({ xrayOpen, setXrayOpen, toggleXray, openPalette }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection(WATCHED);
  const activeNav = NAV.find((n) => n.href === `#${activeSection}`) || null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
        <header
          className={`fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${
            scrolled ? 'bg-[var(--bg)] border-b border-[var(--line-strong)]' : 'border-b border-transparent'
          }`}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4 md:px-8">
            <a href="#top" className="flex items-center gap-2.5 group">
              <span className="w-8 h-8 rounded-[2px] bg-[var(--text)] text-[var(--bg)] flex items-center justify-center mono text-[11px] font-semibold tracking-tight transition-colors duration-200 group-hover:bg-[var(--accent)]">
                AW
              </span>
              <span className="font-bold tracking-tight hidden sm:block">Aryan Walia</span>
              {/* where you are on the page, rolled into place as you move between sections */}
              <span className="nav-where mono" aria-hidden="true">
                <span key={activeNav ? activeNav.n : '01'} className="nav-where-roll">
                  {activeNav ? `${activeNav.n} ${activeNav.label}` : '01 Index'}
                </span>
              </span>
            </a>

            <nav className="hidden lg:flex items-center gap-1" aria-label="Sections">
              {NAV.map((n) => {
                const on = activeNav?.href === n.href;
                return (
                  <a
                    key={n.href}
                    href={n.href}
                    aria-current={on ? 'true' : undefined}
                    className={`relative text-[13px] font-medium px-3 py-2 transition-colors ${on ? 'text-[var(--text)]' : 'text-[var(--text-dim)] hover:text-[var(--text)]'}`}
                  >
                    {on && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute left-3 right-3 -bottom-px h-[2px] bg-[var(--accent)]"
                        transition={{ duration: 0.4, ease: EASE }}
                      />
                    )}
                    <span className="relative">{n.label}</span>
                  </a>
                );
              })}
              <span className="w-px h-4 bg-[var(--line-strong)] mx-1.5" aria-hidden="true" />
              <Link href="/about" className="text-[13px] font-medium px-3 py-2 text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors">
                About me
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openPalette}
                aria-label="Open the command menu"
                className="hidden md:inline-flex items-center gap-2 h-[34px] pl-2.5 pr-2 rounded-[2px] border border-[var(--line-strong)] hover:bg-[var(--tint-1)] text-[12px] text-[var(--text-faint)] hover:text-[var(--text)] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
                </svg>
                <kbd className="kbd">Ctrl K</kbd>
              </button>
              <XrayButton open={xrayOpen} setOpen={setXrayOpen} className="hidden sm:inline-flex" />
              <Link href="/resume" className="hidden md:inline-flex btn btn-ghost py-2 px-4 text-[13px]">
                Resume
              </Link>
              <a href="#contact" className="hidden sm:inline-flex btn btn-primary py-2 px-4 text-[13px]">
                Let&apos;s talk
              </a>
              <button
                type="button"
                className="lg:hidden w-10 h-10 flex items-center justify-center text-[var(--text-dim)]"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 8h16M4 16h16'} />
                </svg>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                aria-label="Sections"
                className="lg:hidden bg-[var(--bg)] border-b border-[var(--line-strong)] px-4 pb-4 pt-1"
              >
                {NAV.map((n, i) => (
                  <motion.a
                    key={n.href}
                    href={n.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * i, duration: 0.25 }}
                    className="block display text-[1.6rem] text-[var(--text)] py-2 border-b border-[var(--line)]"
                  >
                    {n.label}
                  </motion.a>
                ))}
                <Link
                  href="/about"
                  onClick={() => setMenuOpen(false)}
                  className="block display text-[1.6rem] text-[var(--accent)] py-2 border-b border-[var(--line)]"
                >
                  About me
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    toggleXray();
                  }}
                  className="flex w-full items-center justify-between py-3 border-b border-[var(--line)] mono text-[11px] font-semibold tracking-[0.16em] uppercase text-[var(--text-dim)]"
                >
                  X-ray this page
                  <span className="text-[var(--accent)]">{xrayOpen ? 'on' : 'off'}</span>
                </button>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Link href="/resume" onClick={() => setMenuOpen(false)} className="btn btn-ghost justify-center">
                    Resume
                  </Link>
                  <a href="#contact" onClick={() => setMenuOpen(false)} className="btn btn-primary justify-center">
                    Let&apos;s talk
                  </a>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </header>
  );
}

/* Everything between the bar and the footer. It takes one stable prop, so it renders once. */
const Body = React.memo(function Body({ onXray }) {
  return (
    <>
        <Hero onXray={onXray} />

        {/* ─── BODY ─── */}
        <main className="max-w-6xl mx-auto px-5 md:px-8">
          <Apps />
          <Work />
          <Journey />
          <Contact />
        </main>
    </>
  );
});

export default function Home() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [xrayOpen, setXrayOpen] = useState(false);
  const toggleXray = useCallback(() => setXrayOpen((v) => !v), []);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  return (
    <>
      <Head>
        <title>Aryan Walia · Security Engineer & Product Builder</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#eae7df" />
        <meta property="og:title" content={SHARE_TITLE} />
        <meta property="og:description" content={SHORT} />
        {/* Link previews need absolute URLs, so these point at the deployed site. */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:site_name" content="Aryan Walia" />
        <meta property="og:image" content={`${SITE_URL}og.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Aryan Walia. I build and break software. Analyst at Deloitte, founder of BugSnaps." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SHARE_TITLE} />
        <meta name="twitter:description" content={SHORT} />
        <meta name="twitter:image" content={`${SITE_URL}og.png`} />
        <link rel="canonical" href={SITE_URL} />
        <link rel="icon" href="/favicon.ico" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }} />
      </Head>

      <ScrollProgress />
      <Crosshair />
      <Xray open={xrayOpen} setOpen={setXrayOpen} />
      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} onXray={toggleXray} />
      <div className="ambient" aria-hidden="true" />

      <div className="relative z-[2] min-h-screen overflow-x-clip">

        {/* ─── NAV ─── */}
        <Nav xrayOpen={xrayOpen} setXrayOpen={setXrayOpen} toggleXray={toggleXray} openPalette={openPalette} />

        <Body onXray={toggleXray} />

        {/* ─── FOOTER ─── */}
        <footer className="relative border-t border-[var(--line-strong)] bg-[var(--bg-sunk)] overflow-hidden" data-xray="colophon">
          <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 pt-10 pb-6 flex flex-col md:flex-row items-center justify-between gap-5">
            <span className="mono text-[11px] tracking-[0.12em] uppercase text-[var(--text-faint)]">{profile.location}</span>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mono text-[12px]">
              <Link href="/about" className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors">
                About me
              </Link>
              {[
                ['GitHub', profile.github],
                ['LinkedIn', profile.linkedin],
                ['Google Play', profile.playDeveloper],
                ['bugsnaps.in', profile.bugsnaps],
                ['myrecon.xyz', profile.myrecon],
              ].map(([label, href]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors">
                  {label}
                </a>
              ))}
            </div>
            <span className="mono text-[11px] text-[var(--text-faint)]">© {new Date().getFullYear()} Aryan Walia</span>
          </div>
          <p className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 pb-4 text-center md:text-left text-[11px] leading-relaxed text-[var(--text-faint)]">
            This is a personal site. The projects and views here are my own and are not affiliated with or endorsed by my employer.
          </p>
          {/* Decorative wordmark: roomy line height so the "y" descender isn't clipped,
              and no pointer events so it can never sit on top of the links above. */}
          <div
            className="display outline-text text-[14.6vw] leading-[1.12] pb-[2vw] text-center select-none pointer-events-none whitespace-nowrap"
            aria-hidden="true"
          >
            Aryan Walia
          </div>
        </footer>
      </div>
    </>
  );
}
