import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { profile, now, heroWords } from './portfolioData';
import { EASE, Constellation, Magnetic, MaskLine, ScrambleWords, Tilt } from './fx';
import { StarIcon } from './shared';

/* A demo MyPentest run against a practice target, replayed line by line. */
const CONSOLE = [
  { t: 'cmd', s: 'mypentest scan practice-lab.test' },
  { t: 'ok', s: 'scope verified · DNS proof of control' },
  { t: 'ok', s: 'network guard pinned to approved IP' },
  { t: 'run', s: 'mapping attack surface', r: '148 endpoints' },
  { t: 'run', s: 'signing in as 2 test identities', r: 'isolated' },
  { t: 'run', s: 'running 56 checks', r: 'passive + safe-active' },
  { t: 'crit', s: "IDOR  bob can read alice's /api/orders/{id}", r: 'CVSS 8.1' },
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
  const reduceMotion = useReducedMotion();
  const visibleLines = reduceMotion ? CONSOLE.length : shown;

  useEffect(() => {
    if (reduceMotion) return undefined;
    const t = setTimeout(
      () => setShown((n) => (n >= CONSOLE.length + 3 ? 1 : n + 1)),
      shown >= CONSOLE.length ? 1400 : 650
    );
    return () => clearTimeout(t);
  }, [shown, reduceMotion]);

  return (
    <div className="relative rounded-3xl border border-[var(--line-strong)] bg-[#0b0c0d]/85 backdrop-blur-xl shadow-[0_50px_140px_-40px_rgba(200,245,96,0.3)] overflow-hidden">
      <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[var(--accent)]/[0.06] to-transparent animate-scan pointer-events-none" />

      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--line)]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f87171]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#facc15]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]/70" />
        </div>
        <span className="mono text-[10px] text-[var(--text-faint)]">mypentest · demo run</span>
        <span className="mono text-[10px] text-[var(--accent)] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          REPLAY
        </span>
      </div>

      <div className="p-4 md:p-5 mono text-[11.5px] md:text-[12.5px] leading-[1.9] min-h-[300px]">
        {CONSOLE.slice(0, Math.min(visibleLines, CONSOLE.length)).map((l, i) => (
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
        {visibleLines < CONSOLE.length && (
          <div className="flex items-center gap-2.5">
            <span className="w-3" />
            <span className="inline-block w-[7px] h-[14px] bg-[var(--accent)] animate-blink" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 border-t border-[var(--line)] mono text-[10px]">
        {[
          ['critical', '#f87171', visibleLines > 6 ? 1 : 0],
          ['high', '#fb923c', visibleLines > 7 ? 1 : 0],
          ['medium', '#facc15', visibleLines > 8 ? 1 : 0],
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

/* The word "break" fractures for a moment every few seconds, and whenever you hover it. */
function GlitchWord({ children }) {
  const [on, setOn] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return undefined;
    let off = 0;
    const fire = () => {
      setOn(true);
      off = window.setTimeout(() => setOn(false), 520);
    };
    const first = window.setTimeout(fire, 1500);
    const every = window.setInterval(fire, 5200);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(off);
      window.clearInterval(every);
    };
  }, [reduce]);

  return (
    <span className={`glitch ${on ? 'is-glitching' : ''}`} data-text={children} data-hot>
      {children}
    </span>
  );
}

export default function Hero({ onOpenPalette }) {
  const { scrollY } = useScroll();
  const lift = useTransform(scrollY, [0, 600], [0, -70]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section id="top" className="relative min-h-[100svh] flex items-center pt-28 md:pt-32 pb-20 overflow-hidden">
      <div className="aurora" aria-hidden="true">
        <span className="aurora-a" />
        <span className="aurora-b" />
        <span className="aurora-c" />
      </div>
      <Constellation className="absolute inset-0 w-full h-full hero-fade" />

      <div className="relative w-full max-w-6xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 items-center">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex flex-wrap items-center gap-2 mb-8"
            >
              <a href="#proof" className="now-pill group">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
                </span>
                <span className="mono text-[10px] tracking-[0.2em] text-[var(--accent)]">NOW</span>
                <span className="text-[13px] text-white">
                  {now.role} at <strong className="font-semibold">{now.org}</strong>
                </span>
              </a>
              <a
                href={profile.bugsnaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-4 py-[7px] border border-[var(--line-strong)] bg-white/[0.03] text-[13px] text-[var(--text-dim)] hover:text-white hover:border-white/30 transition-colors"
              >
                Founder, BugSnaps
              </a>
            </motion.div>

            <h1 className="display text-[3.4rem] leading-[0.92] sm:text-7xl lg:text-[6.2rem] text-white">
              <MaskLine delay={0.05}>I build and</MaskLine>
              <MaskLine delay={0.14}>
                <GlitchWord>break</GlitchWord> <span className="serif text-[var(--accent)]">software.</span>
              </MaskLine>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              className="text-[var(--text-dim)] text-lg md:text-xl mt-8 max-w-xl leading-relaxed"
            >
              I&apos;m <span className="text-white font-medium">Aryan Walia</span>. I work as an{' '}
              <span className="text-white font-medium">Analyst at Deloitte</span>, and I founded{' '}
              <a
                href={profile.bugsnaps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline decoration-[var(--accent)] underline-offset-4 hover:text-[var(--accent)] transition-colors"
              >
                BugSnaps
              </a>
              , where I design, ship and secure every product myself.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="display text-2xl md:text-3xl text-white mt-6 tracking-tight"
            >
              Right now I build <br className="sm:hidden" />
              <ScrambleWords words={heroWords} className="serif text-[var(--accent)] whitespace-nowrap" />
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
              className="flex flex-wrap items-center gap-3 mt-10"
            >
              <Magnetic>
                <a href="#ecosystem" className="btn btn-primary btn-glow">
                  See the work
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6" />
                  </svg>
                </a>
              </Magnetic>
              <Magnetic>
                <a href="./Aryan_Walia.pdf?v=20261028" download="Aryan_Walia_Resume.pdf" className="btn btn-ghost">
                  Download resume
                </a>
              </Magnetic>
              <button type="button" onClick={onOpenPalette} className="hidden md:inline-flex items-center gap-2 text-[13px] text-[var(--text-faint)] hover:text-white transition-colors px-2 py-2">
                or press <kbd className="kbd">Ctrl</kbd>
                <kbd className="kbd">K</kbd>
              </button>
            </motion.div>
          </div>

          {/* outer layer drifts up on scroll, inner layer handles the entrance */}
          <motion.div style={{ y: lift }} className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          >
            <div className="relative">
            <Tilt max={6} className="[--tilt-r:24px]">
              <ScanConsole />
            </Tilt>

            {/* two facts floating off the console corners */}
            <a
              href="https://play.google.com/store/apps/details?id=com.Myrecon.osint"
              target="_blank"
              rel="noopener noreferrer"
              className="float-chip hidden sm:flex -left-6 -top-5 animate-float"
            >
              <StarIcon className="w-3.5 h-3.5 text-[#facc15]" />
              <span className="text-white font-semibold">4.7</span>
              <span className="text-[var(--text-dim)]">on Google Play</span>
            </a>
            <a
              href={profile.bugsnaps}
              target="_blank"
              rel="noopener noreferrer"
              className="float-chip hidden sm:flex -right-4 -bottom-7 animate-float-slow"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              <span className="text-white font-semibold">4 tools</span>
              <span className="text-[var(--text-dim)]">live at bugsnaps.in</span>
            </a>
            </div>

            <p className="mono text-[10px] text-[var(--text-faint)] mt-8 text-center">A MyPentest run replayed against a practice target</p>
          </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#proof"
        style={{ opacity: fade }}
        className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 mono text-[10px] tracking-[0.3em] text-[var(--text-faint)] hover:text-white transition-colors"
        aria-label="Scroll to proof"
      >
        SCROLL
        <span className="scroll-cue" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
