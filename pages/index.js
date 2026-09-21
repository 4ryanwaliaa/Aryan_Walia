import Head from 'next/head';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectExplorer, { ProjectMark } from '../components/ProjectExplorer';
import { AboutSkills, Experience, Certifications, Contact } from '../components/Sections';
import { profile, stats, projects } from '../components/portfolioData';

/* Typewriter for the hero terminal */
function useTypewriter(lines, speed = 42, backSpeed = 22, hold = 1700) {
  const [index, setIndex] = useState(0);
  const [sub, setSub] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = lines[index % lines.length];
    let t;
    if (!deleting && sub < current.length) t = setTimeout(() => setSub(sub + 1), speed);
    else if (deleting && sub > 0) t = setTimeout(() => setSub(sub - 1), backSpeed);
    else if (!deleting && sub === current.length) t = setTimeout(() => setDeleting(true), hold);
    else {
      setDeleting(false);
      setIndex((i) => i + 1);
    }
    return () => clearTimeout(t);
  }, [sub, deleting, index, lines, speed, backSpeed, hold]);

  return lines[index % lines.length].substring(0, sub);
}

const NAV = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

const ArrowIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H8m9 0v9" />
  </svg>
);

const PlayIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3.609 1.814L13.792 12 3.61 22.186a2.014 2.014 0 01-.609-1.444V3.258c0-.564.234-1.073.609-1.444zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1.996 1.996 0 010 3.73l-2.808 1.626L15.31 12l2.388-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
  </svg>
);

/* A compact product tile for the hero bento */
function ProductTile({ id, children, className = '' }) {
  const p = projects.find((x) => x.id === id);
  return (
    <a
      href={p.live}
      target="_blank"
      rel="noopener noreferrer"
      className={`card group relative p-4 flex flex-col justify-between overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(100% 90% at 50% 0%, ${p.accent}14, transparent 70%)` }}
      />
      {children(p)}
    </a>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  const typed = useTypewriter([
    'triaging the FortiSIEM alert queue',
    'mapping TTPs to MITRE ATT&CK',
    'sweeping 123 platforms for one handle',
    'scoring endpoint risk against NIST CSF',
    'finding bugs before attackers do',
  ]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const myrecon = projects.find((p) => p.id === 'myrecon');

  return (
    <>
      <Head>
        <title>Aryan Walia — Cybersecurity Analyst | SOC · VAPT · OSINT</title>
        <meta
          name="description"
          content="CEH-certified cybersecurity analyst working across SOC operations, VAPT and OSINT. Creator of MyRecon and EndpointRadar; founder of BugSnaps."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#07080a" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* reading progress */}
      <div className="fixed top-0 inset-x-0 h-[2px] z-[100]">
        <div className="h-full bg-[var(--accent)] transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      <div className="relative z-[2] min-h-screen">
        {/* ─── NAV ─── */}
        <header
          className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--line)]' : 'border-b border-transparent'
          }`}
        >
          <div className="max-w-6xl mx-auto px-5 md:px-8 flex items-center justify-between h-16">
            <a href="#top" className="flex items-center gap-2.5 group">
              <span className="w-8 h-8 rounded-lg bg-[var(--accent)] text-[#04120c] flex items-center justify-center mono font-bold text-[13px]">
                AW
              </span>
              <span className="font-bold tracking-tight hidden sm:block group-hover:text-[var(--accent)] transition-colors">
                Aryan Walia
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-8">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} className="text-[13px] text-[var(--text-dim)] hover:text-white transition-colors relative group">
                  {n.label}
                  <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
              <Link
                href="/resume"
                className="text-[13px] font-semibold px-4 py-1.5 rounded-full bg-[var(--accent)] text-[#04120c] hover:brightness-110 transition-all"
              >
                Resume
              </Link>
            </nav>

            <button
              className="md:hidden p-2 text-[var(--text-dim)]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'} />
              </svg>
            </button>
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="md:hidden overflow-hidden bg-[var(--surface)] border-b border-[var(--line)]"
              >
                <div className="px-5 py-4 flex flex-col gap-4">
                  {NAV.map((n) => (
                    <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)} className="text-sm text-[var(--text-dim)]">
                      {n.label}
                    </a>
                  ))}
                  <Link
                    href="/resume"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-semibold px-4 py-2 rounded-full bg-[var(--accent)] text-[#04120c] w-fit"
                  >
                    Resume
                  </Link>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </header>

        {/* ─── HERO ─── */}
        <section id="top" className="relative pt-28 md:pt-32 pb-16 overflow-hidden">
          <div className="glow w-[42rem] h-[22rem] -top-40 -left-40" style={{ background: 'rgba(16,185,129,0.10)' }} />
          <div className="glow w-[34rem] h-[20rem] top-10 right-[-12rem]" style={{ background: 'rgba(34,211,238,0.07)' }} />

          <div className="relative max-w-6xl mx-auto px-5 md:px-8">
            <div className="grid lg:grid-cols-12 gap-4 lg:gap-5">
              {/* identity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-7 flex flex-col justify-center"
              >
                <div className="inline-flex items-center gap-2 w-fit rounded-full px-3 py-1.5 border border-[var(--accent)]/30 bg-[var(--accent-soft)] mb-7">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--accent)]" />
                  </span>
                  <span className="mono text-[11px] text-[var(--accent)]">Open to roles · Immediate joiner</span>
                </div>

                <h1 className="display text-[3.25rem] sm:text-7xl lg:text-[5.25rem] text-white">
                  Aryan
                  <br />
                  Walia
                </h1>

                <p className="text-[var(--text-dim)] text-lg md:text-xl mt-6 max-w-lg leading-relaxed">
                  Cybersecurity analyst across <span className="text-white font-medium">SOC &amp; SIEM</span>,{' '}
                  <span className="text-white font-medium">VAPT</span> and <span className="text-white font-medium">OSINT</span> — and the
                  automation that ties them together.
                </p>

                {/* terminal */}
                <div className="mt-8 max-w-md rounded-xl border border-[var(--line)] bg-black/60 overflow-hidden">
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--line)]">
                    <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                    <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                    <span className="w-2 h-2 rounded-full bg-[#28c840]" />
                    <span className="mono text-[10px] text-[var(--text-faint)] ml-2">aryan@soc</span>
                  </div>
                  <div className="px-3.5 py-3 mono text-[13px] text-[var(--accent)] min-h-[44px] flex items-center">
                    <span className="text-[var(--text-faint)] mr-2">$</span>
                    <span className="truncate">{typed}</span>
                    <span className="inline-block w-[7px] h-[15px] bg-[var(--accent)] ml-1 animate-blink flex-shrink-0" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 mt-8">
                  <a
                    href="#projects"
                    className="inline-flex items-center gap-2 bg-[var(--accent)] text-[#04120c] font-semibold text-sm px-6 py-3 rounded-full hover:brightness-110 transition-all"
                  >
                    See my work
                  </a>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-[var(--line-strong)] hover:bg-white/[0.06] text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                </div>
              </motion.div>

              {/* product bento */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 grid grid-cols-2 gap-3 auto-rows-[minmax(0,1fr)]"
              >
                {/* MyRecon — featured, promotes both the site and the app */}
                <div className="col-span-2 card relative p-5 overflow-hidden">
                  <div className="glow w-56 h-28 -top-14 right-0" style={{ background: 'rgba(16,185,129,0.18)' }} />

                  <div className="relative flex items-start gap-3.5">
                    <ProjectMark project={myrecon} size={52} rounded="rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-white font-bold tracking-tight">MyRecon</h2>
                        <span className="mono text-[9px] px-1.5 py-0.5 rounded bg-[var(--accent-soft)] text-[var(--accent)]">LIVE</span>
                      </div>
                      <p className="text-[var(--text-dim)] text-[13px] mt-1 leading-relaxed">
                        My OSINT platform — one identifier into a full public footprint, across 123 platforms.
                      </p>
                    </div>
                  </div>

                  <div className="relative flex flex-wrap gap-2 mt-4">
                    <a
                      href={myrecon.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mono text-[11px] font-semibold px-3 py-2 rounded-lg bg-[var(--accent)] text-[#04120c] hover:brightness-110 transition-all"
                    >
                      myrecon.xyz
                      <ArrowIcon className="w-3 h-3" />
                    </a>
                    <a
                      href={myrecon.android}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mono text-[11px] font-semibold px-3 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-[var(--line-strong)] text-white transition-colors"
                    >
                      <PlayIcon className="w-3 h-3" />
                      Android beta
                    </a>
                  </div>
                </div>

                {/* BugSnaps */}
                <ProductTile id="bugsnaps">
                  {(p) => (
                    <>
                      <div className="relative flex items-start justify-between gap-2">
                        <ProjectMark project={p} size={38} rounded="rounded-lg" />
                        <ArrowIcon className="w-3.5 h-3.5 text-[var(--text-faint)] group-hover:text-white transition-colors" />
                      </div>
                      <div className="relative mt-3">
                        <h3 className="text-white font-semibold text-sm">BugSnaps</h3>
                        <p className="text-[var(--text-faint)] text-[11px] mt-0.5 leading-snug">My VAPT venture</p>
                        <p className="mono text-[10px] mt-2" style={{ color: p.accent }}>
                          bugsnaps.in
                        </p>
                      </div>
                    </>
                  )}
                </ProductTile>

                {/* EndpointRadar */}
                <ProductTile id="endpointradar">
                  {(p) => (
                    <>
                      <div className="relative flex items-start justify-between gap-2">
                        <ProjectMark project={p} size={38} rounded="rounded-lg" />
                        <ArrowIcon className="w-3.5 h-3.5 text-[var(--text-faint)] group-hover:text-white transition-colors" />
                      </div>
                      <div className="relative mt-3">
                        <h3 className="text-white font-semibold text-sm">EndpointRadar</h3>
                        <p className="text-[var(--text-faint)] text-[11px] mt-0.5 leading-snug">Posture scanner</p>
                        <p className="mono text-[10px] mt-2" style={{ color: p.accent }}>
                          Live demo
                        </p>
                      </div>
                    </>
                  )}
                </ProductTile>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── STATS ─── */}
        <section className="relative border-y border-[var(--line)]">
          <div className="max-w-6xl mx-auto px-5 md:px-8 grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`py-7 px-4 ${i % 2 === 1 ? 'border-l' : ''} md:border-l first:border-l-0 md:first:border-l-0 border-[var(--line)] ${
                  i < 2 ? 'border-b md:border-b-0' : ''
                }`}
              >
                <div className="display text-3xl md:text-4xl text-white">{s.value}</div>
                <div className="text-[13px] text-[var(--text-dim)] mt-1.5">{s.label}</div>
                <div className="mono text-[10px] text-[var(--text-faint)] mt-0.5">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── BODY ─── */}
        <main className="max-w-6xl mx-auto px-5 md:px-8 pt-24">
          <AboutSkills />
          <ProjectExplorer />
          <Experience />
          <Certifications />
          <Contact />
        </main>

        {/* ─── FOOTER ─── */}
        <footer className="border-t border-[var(--line)] py-9">
          <div className="max-w-6xl mx-auto px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-md bg-[var(--accent)] text-[#04120c] flex items-center justify-center mono font-bold text-[11px]">
                AW
              </span>
              <span className="text-[var(--text-dim)] text-[13px]">Aryan Walia · Delhi NCR</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mono text-[12px]">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-[var(--text-dim)] hover:text-white transition-colors">
                GitHub
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--text-dim)] hover:text-white transition-colors">
                LinkedIn
              </a>
              <a href={profile.myrecon} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:brightness-125 transition-all">
                myrecon.xyz
              </a>
              <a href={profile.bugsnaps} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:brightness-125 transition-all">
                bugsnaps.in
              </a>
              <a href={`mailto:${profile.email}`} className="text-[var(--text-dim)] hover:text-white transition-colors">
                {profile.email}
              </a>
            </div>

            <span className="mono text-[11px] text-[var(--text-faint)]">© {new Date().getFullYear()}</span>
          </div>
        </footer>
      </div>
    </>
  );
}
