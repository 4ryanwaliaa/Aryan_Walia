import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { apps, profile } from './portfolioData';
import { EASE, MaskLine, reveal } from './fx';
import { ArrowIcon, PlayIcon, ProjectMark, Stars, byId, trackSpot } from './shared';

/* Store artwork from the live Google Play listings. Static imports so the basePath applies. */
import myrecon1 from '../public/apps/myrecon-1.jpg';
import myrecon2 from '../public/apps/myrecon-2.jpg';
import myrecon3 from '../public/apps/myrecon-3.jpg';
import myrecon4 from '../public/apps/myrecon-4.jpg';
import wakeme1 from '../public/apps/wakeme-1.jpg';
import wakeme2 from '../public/apps/wakeme-2.jpg';
import wakeme3 from '../public/apps/wakeme-3.jpg';
import wakeme4 from '../public/apps/wakeme-4.jpg';

const POSTERS = {
  myrecon: [myrecon1, myrecon2, myrecon3, myrecon4],
  wakeme: [wakeme1, wakeme2, wakeme3, wakeme4],
};

/* ─── A hand of store posters. Click any card to bring it to the front. ─── */
function PosterFan({ id, name }) {
  const posters = POSTERS[id];
  const [front, setFront] = useState(0);
  const [hover, setHover] = useState(false);
  const [touched, setTouched] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-25% 0px -25% 0px' });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || hover || touched || reduce) return undefined;
    const t = window.setTimeout(() => setFront((n) => (n + 1) % posters.length), 3200);
    return () => window.clearTimeout(t);
  }, [inView, hover, touched, reduce, front, posters.length]);

  return (
    <div
      ref={ref}
      className="poster-fan"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {posters.map((src, i) => {
        /* position relative to the front card: 0 is on top, 1 and 2 peek out to the right, the last sits to the left */
        const n = posters.length;
        let slot = (i - front + n) % n;
        if (slot === n - 1) slot = -1;
        const spread = hover ? 1.35 : 1;
        return (
          <motion.button
            key={i}
            type="button"
            onClick={() => {
              setTouched(true);
              setFront(i);
            }}
            aria-label={`${name} store screenshot ${i + 1} of ${n}${slot === 0 ? ', shown in front' : ''}`}
            className="poster"
            style={{ zIndex: 10 - Math.abs(slot) * 2 - (slot < 0 ? 1 : 0) }}
            animate={{
              x: `${slot * 30 * spread}%`,
              rotate: slot * 7 * spread,
              scale: slot === 0 ? 1 : 0.88 - Math.abs(slot) * 0.03,
              filter: slot === 0 ? 'brightness(1)' : 'brightness(0.55)',
            }}
            transition={{ type: 'spring', stiffness: 170, damping: 22 }}
          >
            <Image src={src} alt="" sizes="240px" className="w-full h-full object-cover" />
          </motion.button>
        );
      })}
    </div>
  );
}

/* ─── A playable copy of Wake Me's math mission. Solve it and the alarm stops. ─── */
const LEVELS = {
  Easy: () => {
    const a = 2 + Math.floor(Math.random() * 8);
    const b = 2 + Math.floor(Math.random() * 8);
    return { q: `${a} + ${b}`, answer: a + b };
  },
  Medium: () => {
    const a = 12 + Math.floor(Math.random() * 30);
    const b = 11 + Math.floor(Math.random() * 30);
    return { q: `${a} + ${b}`, answer: a + b };
  },
  Hard: () => {
    const a = 6 + Math.floor(Math.random() * 7);
    const b = 4 + Math.floor(Math.random() * 6);
    const c = 5 + Math.floor(Math.random() * 20);
    return { q: `${a} × ${b} + ${c}`, answer: a * b + c };
  },
};

function MathMission() {
  const [level, setLevel] = useState('Easy');
  /* A fixed first problem keeps the server and client render identical; fresh ones are random. */
  const [problem, setProblem] = useState({ q: '12 + 8', answer: 20 });
  const [input, setInput] = useState('');
  const [state, setState] = useState('ringing'); // ringing | wrong | awake
  const [solved, setSolved] = useState(0);

  const next = (lvl = level) => {
    setProblem(LEVELS[lvl]());
    setInput('');
    setState('ringing');
  };

  const press = (key) => {
    if (state === 'awake') return;
    if (key === 'del') {
      setInput((v) => v.slice(0, -1));
      setState('ringing');
      return;
    }
    if (key === 'ok') {
      if (!input) return;
      if (Number(input) === problem.answer) {
        setState('awake');
        setSolved((n) => n + 1);
      } else {
        setState('wrong');
        setInput('');
      }
      return;
    }
    setState('ringing');
    setInput((v) => (v.length >= 4 ? v : v + key));
  };

  const onKeyDown = (e) => {
    /* a focused key or toggle already handles its own Enter and Space */
    if (e.target !== e.currentTarget && (e.key === 'Enter' || e.key === ' ')) return;
    if (/^[0-9]$/.test(e.key)) press(e.key);
    else if (e.key === 'Backspace') press('del');
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (state === 'awake') next();
      else press('ok');
    }
  };

  return (
    <div className="phone" role="group" aria-label="Playable Wake Me math mission demo" tabIndex={0} onKeyDown={onKeyDown}>
      <div className="phone-notch" aria-hidden="true" />
      <div className="phone-screen">
        <div className="flex items-center justify-between mono text-[9px] text-white/60 px-1">
          <span>7:00</span>
          <span>100%</span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {state === 'awake' ? (
            <motion.div
              key="awake"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="flex-1 flex flex-col items-center justify-center text-center px-3"
            >
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 12, delay: 0.05 }}
                className="w-16 h-16 rounded-full bg-[#86efac] text-[#0c1a12] flex items-center justify-center"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2.6} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </motion.div>
              <p className="display text-[26px] text-white mt-5">Good morning.</p>
              <p className="text-[12px] text-white/60 mt-1.5" aria-live="polite">
                Alarm dismissed. You are awake.
              </p>
              <p className="mono text-[10px] text-[#86efac] mt-4">
                {solved} {solved === 1 ? 'mission' : 'missions'} solved
              </p>
              <button type="button" onClick={() => next()} className="mt-5 w-full rounded-full bg-[#86efac] text-[#0c1a12] text-[13px] font-semibold py-2.5 hover:brightness-110 transition">
                Ring it again
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="ringing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mt-3">
                <p className="display text-[34px] text-white leading-none">
                  7:00 <span className="text-[15px] font-semibold text-white/70">AM</span>
                </p>
                <p className="inline-flex items-center gap-1.5 mono text-[9px] tracking-[0.18em] text-[#86efac] mt-2">
                  <span className="alarm-bell" aria-hidden="true">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0" />
                    </svg>
                  </span>
                  ALARM RINGING
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-3 mt-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white whitespace-nowrap">Math mission</span>
                  <span className="flex rounded-full bg-black/40 p-0.5" role="radiogroup" aria-label="Difficulty">
                    {Object.keys(LEVELS).map((l) => (
                      <button
                        key={l}
                        type="button"
                        role="radio"
                        aria-checked={l === level}
                        onClick={() => {
                          setLevel(l);
                          next(l);
                        }}
                        className={`text-[9px] font-semibold px-1.5 py-[3px] rounded-full transition-colors ${
                          l === level ? 'bg-[#86efac] text-[#0c1a12]' : 'text-white/55 hover:text-white'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </span>
                </div>
                <p className="display text-[24px] text-white text-center mt-2.5 tabular-nums">{problem.q} = ?</p>
                <motion.div
                  animate={state === 'wrong' ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`mt-2.5 h-9 rounded-xl border flex items-center justify-center mono text-[15px] tabular-nums ${
                    state === 'wrong' ? 'border-[#f87171] text-[#f87171]' : 'border-white/15 text-white'
                  }`}
                  aria-live="polite"
                >
                  {state === 'wrong' ? 'Not quite. Try again' : input || <span className="text-white/30">Your answer</span>}
                </motion.div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 mt-2.5">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'ok'].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => press(k)}
                    aria-label={k === 'del' ? 'Delete' : k === 'ok' ? 'Check answer' : k}
                    className={`h-9 rounded-xl text-[14px] font-semibold transition active:scale-95 ${
                      k === 'ok'
                        ? 'bg-[#86efac] text-[#0c1a12] hover:brightness-110'
                        : 'bg-white/[0.07] text-white hover:bg-white/[0.14]'
                    }`}
                  >
                    {k === 'del' ? '⌫' : k === 'ok' ? '✓' : k}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StoreButton({ url, accent }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="store-btn group" style={{ '--pc': accent }}>
      <PlayIcon className="w-5 h-5" />
      <span className="text-left leading-none">
        <span className="block mono text-[8px] tracking-[0.18em] text-[var(--text-faint)]">GET IT ON</span>
        <span className="block text-[15px] font-semibold text-white mt-1">Google Play</span>
      </span>
      <ArrowIcon className="w-3.5 h-3.5 ml-1 text-[var(--text-faint)] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
    </a>
  );
}

function AppCard({ app, index, onOpen, children }) {
  const project = byId(app.id);

  return (
    <motion.article
      {...reveal(index * 0.08)}
      onMouseMove={trackSpot}
      style={{ '--spot': `${app.accent}99` }}
      className="card spotlight relative overflow-hidden p-6 md:p-8 flex flex-col"
    >
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full"
        style={{ background: `radial-gradient(circle, ${app.accent}14, transparent 65%)` }}
        aria-hidden="true"
      />

      {/* store header */}
      <div className="relative flex items-start gap-4">
        <ProjectMark project={project} size={68} rounded="rounded-[18px]" className="shadow-[0_12px_30px_-10px_rgba(0,0,0,0.9)] ring-1 ring-white/10" />
        <div className="min-w-0 flex-1">
          <h3 className="display text-2xl md:text-[28px] text-white leading-[1.05]">{app.storeName}</h3>
          <p className="text-[13px] text-[var(--text-dim)] mt-1.5">Aryan Walia · {app.category}</p>
        </div>
      </div>

      <dl className="relative grid grid-cols-3 mt-6 rounded-2xl border border-[var(--line)] bg-black/25 divide-x divide-[var(--line)]">
        <div className="px-3 py-3 text-center">
          <dd className="flex items-center justify-center gap-1.5 text-white font-semibold">
            {app.rating}
            <Stars rating={app.rating} />
          </dd>
          <dt className="mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-faint)] mt-1">{app.reviews} reviews</dt>
        </div>
        <div className="px-3 py-3 text-center">
          <dd className="text-white font-semibold">{app.installs}</dd>
          <dt className="mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-faint)] mt-1">Installs</dt>
        </div>
        <div className="px-3 py-3 text-center">
          <dd className="text-white font-semibold whitespace-nowrap">{app.updated}</dd>
          <dt className="mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-faint)] mt-1">Updated</dt>
        </div>
      </dl>

      <p className="relative text-[var(--text-dim)] text-[15px] leading-relaxed mt-5">{app.pitch}</p>

      {/* media */}
      <div className="relative my-8 flex-1 flex items-center justify-center">{children}</div>

      <div className="relative flex flex-wrap gap-1.5">
        {app.features.map((f) => (
          <span key={f} className="chip">
            {f}
          </span>
        ))}
      </div>

      {app.review && (
        <figure className="relative mt-5 pl-4 border-l-2" style={{ borderColor: app.accent }}>
          <blockquote className="serif text-xl text-white leading-snug">&ldquo;{app.review.quote}&rdquo;</blockquote>
          <figcaption className="mono text-[10px] text-[var(--text-faint)] mt-1.5">{app.review.by}</figcaption>
        </figure>
      )}

      <div className="relative flex flex-wrap items-center gap-3 mt-7 pt-6 border-t border-[var(--line)]">
        <StoreButton url={app.url} accent={app.accent} />
        <button type="button" onClick={() => onOpen(project)} className="btn btn-ghost">
          How it works
        </button>
      </div>
    </motion.article>
  );
}

export default function Apps({ onOpen }) {
  const [myrecon, wakeme] = apps;
  const [showPosters, setShowPosters] = useState(false);

  return (
    <section id="apps" className="scroll-mt-24 pb-24 md:pb-32">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <span className="eyebrow">In your pocket</span>
          <h2 className="display text-5xl md:text-7xl mt-5 text-white">
            <MaskLine>Shipped to</MaskLine>
            <MaskLine delay={0.08}>
              <span className="serif text-[var(--accent)]">Google Play.</span>
            </MaskLine>
          </h2>
        </div>
        <motion.div {...reveal(0.1)} className="max-w-sm">
          <p className="text-[var(--text-dim)] leading-relaxed">
            Two Android apps, designed, built and published by me, with real installs and real reviews. Both were last updated
            in November 2026.
          </p>
          <a
            href={profile.playDeveloper}
            target="_blank"
            rel="noopener noreferrer"
            className="mono inline-flex items-center gap-2 text-xs text-[var(--text-faint)] hover:text-[var(--accent)] transition-colors mt-3"
          >
            <PlayIcon className="w-3.5 h-3.5" />
            My developer page
            <ArrowIcon className="w-3 h-3" />
          </a>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AppCard app={myrecon} index={0} onOpen={onOpen}>
          <PosterFan id="myrecon" name="MyRecon" />
        </AppCard>

        <AppCard app={wakeme} index={1} onOpen={onOpen}>
          <div className="w-full flex flex-col items-center">
            <AnimatePresence mode="wait" initial={false}>
              {showPosters ? (
                <motion.div key="posters" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="w-full flex justify-center">
                  <PosterFan id="wakeme" name="Wake Me" />
                </motion.div>
              ) : (
                <motion.div key="demo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <MathMission />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex rounded-full border border-[var(--line-strong)] bg-black/30 p-1 mt-6" role="group" aria-label="Choose what to show">
              {[
                [false, 'Play the demo'],
                [true, 'Store screenshots'],
              ].map(([value, label]) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={showPosters === value}
                  onClick={() => setShowPosters(value)}
                  className={`text-[12px] font-semibold px-4 py-1.5 rounded-full transition-colors ${
                    showPosters === value ? 'bg-white text-black' : 'text-[var(--text-dim)] hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mono text-[10px] text-[var(--text-faint)] mt-3 text-center">
              {showPosters ? 'Artwork from the live store listing' : 'A playable demo of the math mission. Tap the keys or type.'}
            </p>
          </div>
        </AppCard>
      </div>
    </section>
  );
}
