import Head from 'next/head';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectExplorer from '../components/ProjectExplorer';
import { AboutSkills, Experience, Certifications, Contact } from '../components/Sections';
import { profile, stats } from '../components/portfolioData';

/* Typewriter for the hero terminal */
function useTypewriter(lines, speed = 45, backSpeed = 25, hold = 1600) {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [sub, setSub] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = lines[index % lines.length];
    let t;
    if (!deleting && sub < current.length) {
      t = setTimeout(() => setSub(sub + 1), speed);
    } else if (deleting && sub > 0) {
      t = setTimeout(() => setSub(sub - 1), backSpeed);
    } else if (!deleting && sub === current.length) {
      t = setTimeout(() => setDeleting(true), hold);
    } else {
      setDeleting(false);
      setIndex((i) => i + 1);
    }
    setText(current.substring(0, sub));
    return () => clearTimeout(t);
  }, [sub, deleting, index, lines, speed, backSpeed, hold]);

  return text;
}

const NAV = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

/* Live things anyone can open right now */
const LIVE_LINKS = [
  { label: 'myrecon.xyz', href: 'https://myrecon.xyz', icon: '🔍', color: '#10b981' },
  { label: 'bugsnaps.in', href: 'https://bugsnaps.in', icon: '🐞', color: '#22c55e' },
  { label: 'EndpointRadar', href: 'https://4ryanwalia.github.io/EndpointRadar/', icon: '📡', color: '#5DA9E9' },
  { label: 'Wake Me', href: 'https://play.google.com/store/apps/details?id=makeme.aryan.makeme', icon: '⏰', color: '#22d3ee' },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef(null);

  const typed = useTypewriter([
    'triaging the alert queue...',
    'mapping TTPs to MITRE ATT&CK...',
    'scanning 123 platforms for one handle...',
    'scoring endpoint risk against NIST CSF...',
    'finding bugs before attackers do.',
  ]);

  /* Matrix rain — light touch, respects reduced motion */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    const fontSize = 16;
    let drops = Array(Math.floor(width / fontSize)).fill(1);
    const chars = 'アカサタナハマヤラワギジヂビピクスツヌフムユルグズヅブプABCDEF0123456789';

    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.075)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = '#1f9d6b';
      drops.forEach((d, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, d * fontSize);
        if (d * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };

    const id = setInterval(draw, 55);
    const onResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      drops = Array(Math.floor(width / fontSize)).fill(1);
    };
    window.addEventListener('resize', onResize);
    return () => {
      clearInterval(id);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  /* Sticky nav state + reading progress */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Head>
        <title>Aryan Walia — Cybersecurity Analyst | SOC · VAPT · OSINT</title>
        <meta
          name="description"
          content="CEH-certified cybersecurity analyst working across SOC operations, VAPT and OSINT. Creator of MyRecon, EndpointRadar and Wake Me; founder of BugSnaps."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* reading progress */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-[100] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="min-h-screen bg-[#08090c] text-white font-sans">
        {/* ─── NAV ─── */}
        <header
          className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-[#08090c]/85 backdrop-blur-xl border-b border-white/[0.07]' : 'bg-transparent'
          }`}
        >
          <div className="max-w-6xl mx-auto px-5 md:px-8 flex items-center justify-between h-16">
            <a href="#top" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-extrabold text-sm text-black">
                AW
              </div>
              <span className="font-bold tracking-tight hidden sm:block group-hover:text-cyan-400 transition-colors">
                Aryan Walia
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-7">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} className="text-sm text-gray-400 hover:text-white transition-colors relative group">
                  {n.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-cyan-400 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
              <Link
                href="/resume"
                className="text-sm font-semibold px-4 py-1.5 rounded-full bg-white text-black hover:bg-cyan-400 transition-colors"
              >
                Resume
              </Link>
            </nav>

            <button
              className="md:hidden p-2 text-gray-300"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="md:hidden overflow-hidden bg-[#0b0d11] border-b border-white/[0.07]"
              >
                <div className="px-5 py-4 flex flex-col gap-4">
                  {NAV.map((n) => (
                    <a
                      key={n.href}
                      href={n.href}
                      onClick={() => setMenuOpen(false)}
                      className="text-sm text-gray-300 hover:text-cyan-400 transition-colors"
                    >
                      {n.label}
                    </a>
                  ))}
                  <Link
                    href="/resume"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-semibold px-4 py-2 rounded-full bg-white text-black w-fit"
                  >
                    Resume
                  </Link>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </header>

        {/* ─── HERO ─── */}
        <section id="top" className="relative min-h-[100svh] flex items-center pt-16 overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-[0.18] pointer-events-none" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.10),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#08090c] pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-5 md:px-8 w-full py-16">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              {/* status */}
              <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 border border-emerald-500/30 bg-emerald-500/[0.07] mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-emerald-400 text-xs font-medium">Open to opportunities · Immediate joiner</span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
                Aryan{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Walia
                </span>
              </h1>

              <p className="text-lg md:text-2xl text-gray-300 mt-4 font-light max-w-2xl">
                Cybersecurity Analyst — <span className="text-white font-medium">SOC &amp; SIEM</span>,{' '}
                <span className="text-white font-medium">VAPT</span>, <span className="text-white font-medium">OSINT</span> and the
                automation that ties them together.
              </p>

              {/* terminal */}
              <div className="mt-7 max-w-xl rounded-xl border border-gray-800 bg-black/70 backdrop-blur-sm overflow-hidden font-mono text-sm">
                <div className="flex items-center gap-1.5 px-3.5 py-2 border-b border-gray-800 bg-white/[0.02]">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="text-[11px] text-gray-500 ml-2">aryan@soc — zsh</span>
                </div>
                <div className="px-3.5 py-3 text-emerald-400">
                  <span className="text-gray-600">$</span> {typed}
                  <span className="inline-block w-2 h-4 bg-emerald-400 ml-0.5 align-middle animate-pulse" />
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mt-8">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-full hover:bg-cyan-400 transition-colors"
                >
                  Explore my work
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-gray-700 hover:border-white text-gray-200 hover:text-white font-semibold px-6 py-3 rounded-full transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              </div>

              {/* live chips — proof you can click */}
              <div className="mt-9">
                <p className="text-[11px] uppercase tracking-[0.25em] text-gray-600 mb-3">Live right now</p>
                <div className="flex flex-wrap gap-2.5">
                  {LIVE_LINKS.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 rounded-full pl-3 pr-3.5 py-2 border bg-white/[0.02] hover:bg-white/[0.06] transition-colors"
                      style={{ borderColor: `${l.color}33` }}
                    >
                      <span className="text-base">{l.icon}</span>
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{l.label}</span>
                      <svg
                        className="w-3 h-3 text-gray-600 group-hover:translate-x-0.5 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7M21 12H3" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── STATS ─── */}
        <section className="relative border-y border-white/[0.07] bg-white/[0.015]">
          <div className="max-w-6xl mx-auto px-5 md:px-8 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.07]">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="py-7 px-4 text-center"
              >
                <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-sm text-gray-300 mt-1 font-medium">{s.label}</div>
                <div className="text-[11px] text-gray-600 mt-0.5">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── BODY ─── */}
        <main className="max-w-6xl mx-auto px-5 md:px-8 pt-20">
          <AboutSkills />
          <ProjectExplorer />
          <Experience />
          <Certifications />
          <Contact />
        </main>

        {/* ─── FOOTER ─── */}
        <footer className="border-t border-white/[0.07] py-8">
          <div className="max-w-6xl mx-auto px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-[11px] text-black">
                AW
              </div>
              <span className="text-gray-400">Aryan Walia · Delhi NCR, India</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                GitHub
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                LinkedIn
              </a>
              <a href={profile.myrecon} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                myrecon.xyz
              </a>
              <a href={profile.bugsnaps} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                bugsnaps.in
              </a>
              <a href={`mailto:${profile.email}`} className="text-gray-400 hover:text-white transition-colors">
                {profile.email}
              </a>
            </div>

            <span className="text-gray-600 text-xs">© {new Date().getFullYear()}</span>
          </div>
        </footer>
      </div>
    </>
  );
}
