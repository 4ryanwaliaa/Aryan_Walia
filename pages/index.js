import Head from 'next/head';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';
import Proof from '../components/Proof';
import Work from '../components/ProjectExplorer';
import { Capabilities, Journey, Contact } from '../components/Sections';
import CommandPalette from '../components/CommandPalette';
import ScanTheatre from '../components/ScanTheatre';
import Intro from '../components/Intro';
import { ScrollTrace, VelocityMarquee } from '../components/ScrollFx';
import { CursorRing, EASE, ScrollProgress, useActiveSection } from '../components/fx';
import { profile, projects, capabilities, now } from '../components/portfolioData';

const NAV = [
  { href: '#ecosystem', label: 'Work' },
  { href: '#apps', label: 'Apps' },
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#journey', label: 'Journey' },
  { href: '#contact', label: 'Contact' },
];

/* Every section on the page, mapped to the nav item that should light up while it is on screen. */
const SECTION_TO_NAV = {
  scan: '#ecosystem',
  ecosystem: '#ecosystem',
  'case-studies': '#ecosystem',
  work: '#ecosystem',
  apps: '#apps',
  capabilities: '#capabilities',
  journey: '#journey',
  contact: '#contact',
};
const WATCHED = ['top', 'proof', ...Object.keys(SECTION_TO_NAV)];

/* Checkpoints for the probe that follows you down the page, in page order. */
const TRACE = [
  { id: 'proof', label: 'proof' },
  { id: 'scan', label: 'scan' },
  { id: 'ecosystem', label: 'work' },
  { id: 'apps', label: 'apps' },
  { id: 'case-studies', label: 'case studies' },
  { id: 'work', label: 'builds' },
  { id: 'capabilities', label: 'skills' },
  { id: 'journey', label: 'journey' },
  { id: 'contact', label: 'contact' },
];

/* The colour of the light behind the page shifts with the section you are in. */
const AMBIENT = {
  top: 'rgba(200, 245, 96, 0.10)',
  proof: 'rgba(200, 245, 96, 0.09)',
  scan: 'rgba(249, 115, 102, 0.10)',
  ecosystem: 'rgba(96, 165, 250, 0.11)',
  apps: 'rgba(134, 239, 172, 0.10)',
  'case-studies': 'rgba(34, 211, 238, 0.09)',
  work: 'rgba(251, 146, 60, 0.09)',
  capabilities: 'rgba(167, 139, 250, 0.11)',
  journey: 'rgba(200, 245, 96, 0.09)',
  contact: 'rgba(200, 245, 96, 0.12)',
};

const SITE_URL = 'https://4ryanwaliaa.github.io/Aryan_Walia/';
const DESCRIPTION =
  'Aryan Walia is an Analyst at Deloitte and the founder of BugSnaps. He designs, builds and secures products end to end: the MyPentest pentesting platform, the MyRecon OSINT engine on web and Google Play, EndpointRadar, PhishLens and the Wake Me Android app.';
/* What a shared link says before anyone clicks it. */
const SHARE_TITLE = "hi, i'm aryan. i build and break software.";
const SHORT = 'I break into things for a living (legally) and build the tools that do it. Analyst at Deloitte, founder of BugSnaps: MyPentest, MyRecon, EndpointRadar, PhishLens.';

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

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const activeSection = useActiveSection(WATCHED);
  const activeNav = SECTION_TO_NAV[activeSection] || null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const stack = [...new Set(capabilities.flatMap((c) => c.stack))];
  const shipped = projects.filter((p) => p.live).map((p) => p.name);

  return (
    <>
      <Head>
        <title>Aryan Walia · Security Engineer & Product Builder</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#08090a" />
        <meta property="og:title" content={SHARE_TITLE} />
        <meta property="og:description" content={SHORT} />
        {/* Link previews need absolute URLs, so these point at the deployed site. */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:site_name" content="Aryan Walia" />
        <meta property="og:image" content={`${SITE_URL}og.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="hi, i'm aryan. I break into things for a living. Legally. Analyst at Deloitte, founder of BugSnaps." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SHARE_TITLE} />
        <meta name="twitter:description" content={SHORT} />
        <meta name="twitter:image" content={`${SITE_URL}og.png`} />
        <link rel="canonical" href={SITE_URL} />
        <link rel="icon" href="/favicon.ico" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }} />
      </Head>

      <Intro onDone={() => setIntroDone(true)} />
      <ScrollProgress />
      <CursorRing />
      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
      <div className="ambient" style={{ '--amb': AMBIENT[activeSection] || AMBIENT.top }} aria-hidden="true" />

      <div className="relative z-[2] min-h-screen overflow-x-clip">
        <ScrollTrace sections={TRACE} />

        {/* ─── NAV ─── */}
        <header className="fixed top-0 inset-x-0 z-50 px-3 md:px-5 pt-3">
          <div
            className={`max-w-6xl mx-auto flex items-center justify-between h-14 px-3 pl-4 rounded-full transition-all duration-300 ${
              scrolled ? 'bg-[#0d0e10]/80 backdrop-blur-xl border border-[var(--line-strong)]' : 'border border-transparent'
            }`}
          >
            <a href="#top" className="flex items-center gap-2.5 group">
              <span className="w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center display text-[13px] tracking-normal transition-transform duration-500 group-hover:rotate-[360deg]">
                AW
              </span>
              <span className="font-semibold tracking-tight hidden sm:block">Aryan Walia</span>
            </a>

            <nav className="hidden lg:flex items-center gap-1" aria-label="Sections">
              {NAV.map((n) => {
                const on = activeNav === n.href;
                return (
                  <a
                    key={n.href}
                    href={n.href}
                    aria-current={on ? 'true' : undefined}
                    className={`relative text-[13px] px-3.5 py-2 rounded-full transition-colors ${on ? 'text-white' : 'text-[var(--text-dim)] hover:text-white'}`}
                  >
                    {on && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white/[0.08] border border-[var(--line-strong)]"
                        transition={{ duration: 0.45, ease: EASE }}
                      />
                    )}
                    <span className="relative">{n.label}</span>
                  </a>
                );
              })}
              <span className="w-px h-4 bg-[var(--line-strong)] mx-1.5" aria-hidden="true" />
              <Link href="/about" className="text-[13px] px-3.5 py-2 rounded-full text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors">
                About me
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPaletteOpen(true)}
                aria-label="Open the command menu"
                className="hidden md:inline-flex items-center gap-2 h-9 pl-3 pr-2 rounded-full border border-[var(--line-strong)] bg-white/[0.03] hover:bg-white/[0.08] text-[12px] text-[var(--text-faint)] hover:text-white transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
                </svg>
                <kbd className="kbd">Ctrl K</kbd>
              </button>
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
                className="lg:hidden max-w-6xl mx-auto mt-2 rounded-3xl bg-[#0d0e10]/95 backdrop-blur-xl border border-[var(--line-strong)] p-3"
              >
                {NAV.map((n, i) => (
                  <motion.a
                    key={n.href}
                    href={n.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * i, duration: 0.25 }}
                    className="block display text-2xl text-white px-3 py-2.5 rounded-2xl hover:bg-white/[0.05]"
                  >
                    {n.label}
                  </motion.a>
                ))}
                <Link
                  href="/about"
                  onClick={() => setMenuOpen(false)}
                  className="block display text-2xl text-[var(--accent)] px-3 py-2.5 rounded-2xl hover:bg-white/[0.05]"
                >
                  About me
                </Link>
                <div className="grid grid-cols-2 gap-2 mt-2">
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

        <Hero key={introDone ? 'live' : 'behind-intro'} onOpenPalette={() => setPaletteOpen(true)} />

        {/* ─── TWO MARQUEES: what I use, and what is live. Both speed up and flip with your scroll. ─── */}
        <div className="border-y border-[var(--line)] bg-[var(--surface)]/40 marquee-mask">
          <VelocityMarquee baseVelocity={2.2} className="py-5 border-b border-[var(--line)]">
            {stack.map((t) => (
              <span key={t} className="display text-xl md:text-2xl text-[var(--text-faint)] px-6 flex items-center gap-6 whitespace-nowrap">
                {t}
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/60" />
              </span>
            ))}
          </VelocityMarquee>
          <VelocityMarquee baseVelocity={-1.8} className="py-5">
            {shipped.map((t) => (
              <span key={t} className="serif text-2xl md:text-3xl text-white/80 px-6 flex items-center gap-6 whitespace-nowrap">
                {t}
                <span className="mono not-italic text-[10px] tracking-[0.2em] text-[var(--accent)]">LIVE</span>
              </span>
            ))}
          </VelocityMarquee>
        </div>

        {/* ─── BODY ─── */}
        <main className="max-w-6xl mx-auto px-5 md:px-8">
          <Proof />
          <ScanTheatre />
          <Work />
          <Capabilities />
          <Journey />

          {/* a full-width band of outlined type that the scroll wheel drags along */}
          <div className="relative left-1/2 -translate-x-1/2 w-screen pb-24 md:pb-32">
            <VelocityMarquee baseVelocity={3}>
              {['build it', 'break it', 'fix it', 'ship it'].map((t) => (
                <span key={t} className="display outline-stroke text-[17vw] md:text-[11vw] leading-none px-[3vw] whitespace-nowrap">
                  {t}
                  <span className="text-[var(--accent)]">.</span>
                </span>
              ))}
            </VelocityMarquee>
          </div>

          <Contact />
        </main>

        {/* ─── FOOTER ─── */}
        <footer className="relative border-t border-[var(--line)] overflow-hidden">
          <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 pt-10 pb-6 flex flex-col md:flex-row items-center justify-between gap-5">
            <span className="text-[var(--text-faint)] text-[13px]">{profile.location}</span>
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
            className="display outline-text text-[18vw] leading-[1.15] pb-[2vw] text-center select-none pointer-events-none whitespace-nowrap"
            aria-hidden="true"
          >
            Aryan Walia
          </div>
        </footer>
      </div>
    </>
  );
}
