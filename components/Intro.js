import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* The first thing a new visitor sees: a few typed lines in my own voice, then the curtain lifts.
   Shown once per browser session. Any key, click or tap skips it. Visitors who prefer reduced
   motion never see it, and neither does anyone without JavaScript (see _document.js). */

export const INTRO_KEY = 'aw-intro-seen';

const LINES = [
  { text: "hi, i'm aryan.", tone: 'big' },
  { text: "i break into things for a living. legally. there's paperwork.", tone: 'dim' },
  { text: 'then i build the tools that do it for me.', tone: 'dim' },
  { text: 'laziness, but make it engineering.', tone: 'accent' },
];
const TYPE_MS = 15;
const PAUSE_MS = 230;
const HOLD_MS = 1100;

export default function Intro({ onDone }) {
  const [show, setShow] = useState(true);
  const [typed, setTyped] = useState(['', '', '', '']);
  const [ready, setReady] = useState(false);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    try {
      window.sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* private mode: the intro just shows again next time */
    }
    setShow(false);
    onDoneRef.current?.();
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(INTRO_KEY) === '1';
    } catch {
      seen = false;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (seen || reduce) {
      finish();
      return undefined;
    }

    document.body.style.overflow = 'hidden';
    const timers = [];
    let at = 350;
    LINES.forEach((line, i) => {
      for (let c = 1; c <= line.text.length; c += 1) {
        timers.push(
          window.setTimeout(() => {
            setTyped((prev) => {
              const next = [...prev];
              next[i] = line.text.slice(0, c);
              return next;
            });
          }, at + c * TYPE_MS)
        );
      }
      at += line.text.length * TYPE_MS + PAUSE_MS;
    });
    timers.push(window.setTimeout(() => setReady(true), at));
    timers.push(window.setTimeout(finish, at + HOLD_MS));

    const skip = () => finish();
    window.addEventListener('keydown', skip);
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener('keydown', skip);
      document.body.style.overflow = '';
    };
  }, [finish]);

  /* once the curtain starts lifting, let the page scroll again */
  useEffect(() => {
    if (!show) document.body.style.overflow = '';
  }, [show]);

  const active = typed.findIndex((t, i) => t.length < LINES[i].text.length);

  return (
    <AnimatePresence initial={false} onExitComplete={() => document.documentElement.classList.add('intro-seen')}>
      {show && (
        <motion.div
          key="intro"
          className="intro"
          role="dialog"
          aria-label="Introduction"
          onClick={finish}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="intro-grid" aria-hidden="true" />
          <div className="relative w-full max-w-3xl px-6">
            <p className="mono text-[12px] text-[var(--text-faint)] mb-6">
              <span className="text-[var(--accent)]">$</span> whoami
            </p>

            {/* the full text is there for screen readers straight away; the typed copy is decorative */}
            <p className="sr-only">{LINES.map((l) => l.text).join(' ')}</p>
            <div aria-hidden="true" className="space-y-3 min-h-[230px] sm:min-h-[250px]">
              {LINES.map((line, i) => (
                <p
                  key={line.text}
                  className={
                    line.tone === 'big'
                      ? 'display text-5xl sm:text-7xl text-white'
                      : line.tone === 'accent'
                        ? 'serif text-2xl sm:text-4xl text-[var(--accent)]'
                        : 'text-lg sm:text-2xl text-[var(--text-dim)] leading-snug'
                  }
                >
                  {typed[i]}
                  {(active === i || (active === -1 && i === LINES.length - 1)) && <span className="intro-caret" />}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <button
                type="button"
                onClick={finish}
                className={`btn btn-primary transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-60'}`}
              >
                let me in
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0l-6-6m6 6l-6 6" />
                </svg>
              </button>
              <span className="mono text-[11px] text-[var(--text-faint)]">press any key to skip</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
