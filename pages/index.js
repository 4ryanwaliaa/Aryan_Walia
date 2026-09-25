import Head from 'next/head';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Work, { GithubIcon } from '../components/ProjectExplorer';
import { Capabilities, Journey, Contact } from '../components/Sections';
import { profile, stats, heroWords, capabilities } from '../components/portfolioData';

const NAV = [
  { href: '#ecosystem', label: 'Work' },
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#journey', label: 'Journey' },
  { href: '#contact', label: 'Contact' },
];

const EASE = [0.16, 1, 0.3, 1];
const SITE_URL = 'https://4ryanwaliaa.github.io/Aryan_Walia/';

/* A demo MyPentest run against a practice target, replayed line by line. */
const CONSOLE = [
  { t: 'cmd', s: 'mypentest scan practice-lab.test' },
  { t: 'ok', s: 'scope verified · DNS proof of control' },
  { t: 'ok', s: 'network guard pinned to approved IP' },
  { t: 'run', s: 'mapping attack surface', r: '148 endpoints' },
  { t: 'run', s: 'signing in as 2 test identities', r: 'isolated' },
  { t: 'run', s: 'running 56 checks', r: 'passive + safe-active' },
  { t: 'crit', s: 'IDOR  bob can read alice\'s /api/orders/{id}', r: 'CVSS 8.1' },
  { t: 'high', s: 'session survives logout', r: 'CVSS 6.5' },
  { t: 'med', s: 'CORS reflects arbitrary origin', r: 'CVSS 5.3' },
  { t: 'ok', s: 'report ready · PDF · SARIF · HTML' },
];

const TONE = {
  cmd: 'text-white',
  ok: 'text-[var(--accent)]',
  run: 'text-[var(--text-dim)]',
  crit: 'text-[#f87171]',
  high: 'text-[#fb923c]',
  med: 'text-[#facc15]',
};
const MARK = { cmd: '$', ok: '✓', run: '›', crit: '●', high: '●', med: '●' };

function ScanConsole() {
  /* Starts part-way through the run so the first thing a visitor sees is a working scan, not an empty box. */
  const [shown, setShown] = useState(6);

  useEffect(() => {
    const t = setTimeout(
      () => setShown((n) => (n >= CONSOLE.length + 3 ? 6 : n + 1)),
      shown >= CONSOLE.length ? 1400 : 650
    );
    return () => clearTimeout(t);
  }, [shown]);

  return (
    <div className="relative rounded-3xl border border-[var(--line-strong)] bg-[#0b0c0d]/90 backdrop-blur-xl shadow-[0_40px_120px_-40px_rgba(200,245,96,0.25)] overflow-hidden">
      <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[var(--accent)]/[0.05] to-transparent animate-scan pointer-events-none" />

      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--line)]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
        </div>
        <span className="mono text-[10px] text-[var(--text-faint)]">mypentest · demo run</span>
        <span className="mono text-[10px] text-[var(--accent)] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          LIVE
        </span>
      </div>

      <div className="p-4 md:p-5 mono text-[11.5px] md:text-[12.5px] leading-[1.9] min-h-[300px]">
        {CONSOLE.slice(0, Math.min(shown, CONSOLE.length)).map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex items-baseline gap-2.5 ${TONE[l.t]}`}
          >
            <span className="w-3 flex-shrink-0 text-center opacity-80">{MARK[l.t]}</span>
            <span className="truncate flex-1">{l.s}</span>
            {l.r && <span className="text-[var(--text-faint)] flex-shrink-0 hidden sm:inline">{l.r}</span>}
          </motion.div>
        ))}
        {shown < CONSOLE.length && (
          <div className="flex items-center gap-2.5">
            <span className="w-3" />
            <span className="inline-block w-[7px] h-[14px] bg-[var(--accent)] animate-blink" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 border-t border-[var(--line)] mono text-[10px]">
        {[
          ['critical', '#f87171', shown > 6 ? 1 : 0],
          ['high', '#fb923c', shown > 7 ? 1 : 0],
          ['medium', '#facc15', shown > 8 ? 1 : 0],
        ].map(([k, c, v]) => (
          <div key={k} className="px-4 py-3 border-l first:border-l-0 border-[var(--line)] flex items-center justify-between">
            <span className="text-[var(--text-faint)] uppercase tracking-wider">{k}</span>
            <span style={{ color: c }} className="text-sm font-semibold">
              {v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % heroWords.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <span className="relative inline-flex h-[1.35em] overflow-hidden align-bottom -mb-[0.2em]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={heroWords[i]}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="serif text-[var(--accent)] whitespace-nowrap"
        >
          {heroWords[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1400;
    let raf;
    const step = (now) => {
      const p = Math.max(0, Math.min((now - start) / dur, 1));
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {n.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Cursor-lit grid behind the hero */
  const onHeroMove = (e) => {
    const r = heroRef.current.getBoundingClientRect();
    heroRef.current.style.setProperty('--mx', `${e.clientX - r.left}px`);
    heroRef.current.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  const marquee = [...new Set(capabilities.flatMap((c) => c.stack))];

  return (
    <>
      <Head>
        <title>Aryan Walia · Security Engineer & Product Builder</title>
        <meta
          name="description"
          content="Aryan Walia designs, builds and secures products end to end: the MyPentest automated pentesting platform, the MyRecon OSINT engine, web platforms, Android apps and ML models. Founder of BugSnaps."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#08090a" />
        <meta property="og:title" content="Aryan Walia · Security Engineer & Product Builder" />
        <meta property="og:description" content="I build and break software. Founder of BugSnaps, creator of MyPentest and MyRecon." />
        {/* Link previews need absolute URLs, so these point at the deployed site. */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:site_name" content="Aryan Walia" />
        <meta property="og:image" content={`${SITE_URL}og.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Aryan Walia: I build and break software. MyPentest, MyRecon, BugSnaps, Wake Me." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Aryan Walia · Security Engineer & Product Builder" />
        <meta name="twitter:description" content="I build and break software. Founder of BugSnaps, creator of MyPentest and MyRecon." />
        <meta name="twitter:image" content={`${SITE_URL}og.png`} />
        <link rel="canonical" href={SITE_URL} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative z-[2] min-h-screen">
        {/* ─── NAV ─── */}
        <header className="fixed top-0 inset-x-0 z-50 px-3 md:px-5 pt-3">
          <div
            className={`max-w-6xl mx-auto flex items-center justify-between h-14 px-3 pl-4 rounded-full transition-all duration-300 ${
              scrolled ? 'bg-[#0d0e10]/80 backdrop-blur-xl border border-[var(--line-strong)]' : 'border border-transparent'
            }`}
          >
            <a href="#top" className="flex items-center gap-2.5 group">
              <span className="w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center display text-[13px] tracking-normal">
                AW
              </span>
              <span className="font-semibold tracking-tight hidden sm:block">Aryan Walia</span>
            </a>

            <nav className="hidden md:flex items-center gap-1">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  className="text-[13px] text-[var(--text-dim)] hover:text-white hover:bg-white/[0.06] px-3.5 py-2 rounded-full transition-colors"
                >
                  {n.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link href="/resume" className="hidden md:inline-flex btn btn-ghost py-2 px-4 text-[13px]">
                Resume
              </Link>
              <a href="#contact" className="hidden sm:inline-flex btn btn-primary py-2 px-4 text-[13px]">
                Let&apos;s talk
              </a>
              <button
                className="md:hidden w-10 h-10 flex items-center justify-center text-[var(--text-dim)]"
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
                className="md:hidden mt-2 rounded-3xl bg-[#0d0e10]/95 backdrop-blur-xl border border-[var(--line-strong)] p-3"
              >
                {NAV.map((n) => (
                  <a
                    key={n.href}
                    href={n.href}
                    onClick={() => setMenuOpen(false)}
                    className="block display text-2xl text-white px-3 py-2.5 rounded-2xl hover:bg-white/[0.05]"
                  >
                    {n.label}
                  </a>
                ))}
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

        {/* ─── HERO ─── */}
        <section id="top" ref={heroRef} onMouseMove={onHeroMove} className="relative pt-32 md:pt-40 pb-20 overflow-hidden">
          <div className="grid-bg" />
          <div className="grid-glow hidden md:block" />
          <div className="glow w-[46rem] h-[26rem] -top-56 left-1/2 -translate-x-1/2" style={{ background: 'rgba(200,245,96,0.10)' }} />

          <div className="relative max-w-6xl mx-auto px-5 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
              <div className="lg:col-span-7">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="inline-flex items-center gap-2.5 rounded-full pl-2 pr-4 py-1.5 border border-[var(--line-strong)] bg-white/[0.03] mb-8"
                >
                  <span className="relative flex h-2 w-2 ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
                  </span>
                  <span className="text-[13px] text-[var(--text-dim)]">Available for new work</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
                  className="display text-[3.4rem] leading-[0.92] sm:text-7xl lg:text-[6.2rem] text-white"
                >
                  I build and
                  <br />
                  break <span className="serif text-[var(--accent)]">software.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
                  className="text-[var(--text-dim)] text-lg md:text-xl mt-8 max-w-xl leading-relaxed"
                >
                  I&apos;m <span className="text-white font-medium">Aryan Walia</span>, a security engineer and the founder of{' '}
                  <a href={profile.bugsnaps} target="_blank" rel="noopener noreferrer" className="text-white underline decoration-[var(--accent)] underline-offset-4 hover:text-[var(--accent)] transition-colors">
                    BugSnaps
                  </a>
                  . I design, ship and secure products end to end.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="display text-2xl md:text-3xl text-white mt-6 tracking-tight"
                >
                  Right now I build <RotatingWord />
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
                  className="flex flex-wrap gap-3 mt-10"
                >
                  <a href="#contact" className="btn btn-primary">
                    Start a conversation
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
                    </svg>
                  </a>
                  <a href="#ecosystem" className="btn btn-ghost">
                    See the work
                  </a>
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-3.5" aria-label="GitHub">
                    <GithubIcon />
                  </a>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30, rotate: 1.5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
                className="lg:col-span-5"
              >
                <div className="animate-float">
                  <ScanConsole />
                </div>
                <p className="mono text-[10px] text-[var(--text-faint)] mt-3 text-center">
                  A MyPentest run replayed against a practice target
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── STATS ─── */}
        <section className="relative border-y border-[var(--line)] bg-[var(--surface)]/40">
          <div className="max-w-6xl mx-auto px-5 md:px-8 grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`py-8 md:py-10 px-2 md:px-6 ${i % 2 === 1 ? 'border-l' : ''} md:border-l md:first:border-l-0 border-[var(--line)] ${
                  i < 2 ? 'border-b md:border-b-0' : ''
                } ${i % 2 === 1 ? 'pl-5' : ''}`}
              >
                <div className="display text-4xl md:text-5xl text-white">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="text-sm text-white mt-2">{s.label}</div>
                <div className="mono text-[10px] text-[var(--text-faint)] mt-1">{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── STACK MARQUEE ─── */}
        <div className="py-7 border-b border-[var(--line)] marquee-mask overflow-hidden" aria-hidden="true">
          <div className="flex w-max animate-marquee">
            {[...marquee, ...marquee].map((t, i) => (
              <span key={i} className="display text-xl md:text-2xl text-[var(--text-faint)] px-6 flex items-center gap-6 whitespace-nowrap">
                {t}
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/60" />
              </span>
            ))}
          </div>
        </div>

        {/* ─── BODY ─── */}
        <main className="max-w-6xl mx-auto px-5 md:px-8">
          <Work />
          <Capabilities />
          <Journey />
          <Contact />
        </main>

        {/* ─── FOOTER ─── */}
        <footer className="relative border-t border-[var(--line)] overflow-hidden">
          <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 pt-10 pb-6 flex flex-col md:flex-row items-center justify-between gap-5">
            <span className="text-[var(--text-faint)] text-[13px]">{profile.location}</span>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mono text-[12px]">
              {[
                ['GitHub', profile.github],
                ['LinkedIn', profile.linkedin],
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
