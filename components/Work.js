import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { projects, profile } from './portfolioData';
import { PreviewFloat } from './fx';
import { ArrowIcon, GithubIcon, PREVIEWS, ProjectMark, byId, videoUrl } from './shared';
import SectionHead from './SectionHead';
import ProjectModal, { PlayGlyph } from './ProjectModal';

/* ─── The MyPentest replay ───
   A real run against a practice target, replayed line by line on a timer. It only runs while it
   is on screen, and it is a few lines of text: nothing here is tied to the scroll position. */
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
  cmd: 'text-[var(--text)]',
  ok: 'text-[var(--sev-ok)]',
  run: 'text-[var(--text-dim)]',
  crit: 'text-[var(--sev-crit)]',
  high: 'text-[var(--sev-high)]',
  med: 'text-[var(--sev-med)]',
};
const MARK = { cmd: '$', ok: '+', run: '·', crit: '!', high: '!', med: '·' };

function ScanReplay() {
  const ref = useRef(null);
  const onScreen = useInView(ref, { margin: '-10% 0px' });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? CONSOLE.length : 1);

  useEffect(() => {
    if (reduce || !onScreen) return undefined;
    const t = window.setTimeout(
      () => setShown((n) => (n >= CONSOLE.length + 3 ? 1 : n + 1)),
      shown >= CONSOLE.length ? 1600 : 520
    );
    return () => window.clearTimeout(t);
  }, [shown, onScreen, reduce]);

  const visible = reduce ? CONSOLE.length : shown;
  const count = (t) => (visible > CONSOLE.findIndex((l) => l.t === t) ? 1 : 0);

  return (
    <div ref={ref} className="plate rounded-[3px] border border-[var(--text)] shadow-[10px_10px_0_0_rgba(22,21,15,0.16)] overflow-hidden" data-xray="mypentest replay">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--line)] mono text-[10px] tracking-[0.14em] uppercase">
        <span className="text-[var(--text-faint)]">mypentest · practice-lab.test</span>
        <span className="text-[var(--accent)] flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[var(--accent)]" />
          replay
        </span>
      </div>
      <div className="p-4 md:p-5 mono text-[11.5px] md:text-[12.5px] leading-[1.95] min-h-[292px]">
        {CONSOLE.slice(0, Math.min(visible, CONSOLE.length)).map((l, i) => (
          <div key={i} className={`flex items-baseline gap-3 ${TONE[l.t]} replay-line`}>
            <span className="w-2.5 flex-shrink-0 text-center font-semibold">{MARK[l.t]}</span>
            <span className="truncate flex-1">{l.s}</span>
            {l.r && <span className="text-[var(--text-faint)] flex-shrink-0 hidden sm:inline">{l.r}</span>}
          </div>
        ))}
        {visible < CONSOLE.length && (
          <div className="flex items-center gap-3">
            <span className="w-2.5" />
            <span className="inline-block w-[8px] h-[2px] bg-[var(--accent)] animate-blink" />
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 border-t border-[var(--line)] mono text-[10px]">
        {[
          ['critical', 'var(--sev-crit)', count('crit')],
          ['high', 'var(--sev-high)', count('high')],
          ['medium', 'var(--sev-med)', count('med')],
        ].map(([k, c, v]) => (
          <div key={k} className="px-4 py-3 border-l first:border-l-0 border-[var(--line)] flex items-center justify-between">
            <span className="text-[var(--text-faint)] uppercase tracking-[0.14em]">{k}</span>
            <span style={{ color: c }} className="text-sm font-semibold tabular-nums">
              {v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── The featured product ─── */
function Featured({ onOpen }) {
  const p = byId('mypentest');
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center" data-rise="">
      <div className="lg:col-span-5">
        <div className="flex items-center gap-3">
          <ProjectMark project={p} size={44} rounded="rounded-[10px]" />
          <span className="mono text-[10px] tracking-[0.16em] uppercase" style={{ color: p.accent }}>
            Flagship · {p.status}
          </span>
        </div>
        <h3 className="display text-5xl md:text-6xl text-[var(--text)] mt-5">{p.name}</h3>
        <p className="text-lg font-semibold mt-2" style={{ color: p.accent }}>
          {p.tagline}
        </p>
        <p className="lede mt-4">{p.blurb}</p>
        <div className="flex flex-wrap gap-3 mt-7">
          <a href={p.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            {p.liveLabel}
            <ArrowIcon className="w-3.5 h-3.5" />
          </a>
          {p.video && (
            <a href={videoUrl(p.video.id)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <PlayGlyph />
              {p.video.label}
            </a>
          )}
          <button type="button" onClick={() => onOpen(p)} className="btn btn-ghost">
            How it works
          </button>
        </div>
      </div>
      <div className="lg:col-span-7 min-w-0">
        <ScanReplay />
        <p className="mono text-[10px] tracking-[0.12em] uppercase text-[var(--text-faint)] mt-5">
          A real MyPentest run, replayed against a practice target
        </p>
      </div>
    </div>
  );
}

/* ─── Everything else, as one index ─── */
const GROUPS = [
  {
    label: 'BugSnaps, the platform and its tools',
    ids: ['bugsnaps', 'endpointradar', 'phishlens', 'personal'],
  },
  {
    label: 'Research and machine learning',
    ids: ['rakshak', 'phishing'],
  },
];

function Row({ p, n, onOpen, onHover }) {
  const thumb = PREVIEWS[p.id];
  return (
    <li className="work-row" data-rise="">
      <button
        type="button"
        className="work-hit"
        onClick={() => onOpen(p)}
        onMouseEnter={() => onHover(p.id)}
        onFocus={() => onHover(p.id)}
        onMouseLeave={() => onHover(null)}
        onBlur={() => onHover(null)}
        aria-label={`${p.name}: ${p.tagline}. Open details.`}
      />
      <span className="mono text-[11px] text-[var(--text-faint)] tabular-nums">{String(n).padStart(2, '0')}</span>
      <div className="min-w-0 flex items-center gap-4">
        {thumb && (
          <span className="work-thumb md:hidden" aria-hidden="true">
            <Image src={thumb} alt="" sizes="96px" className="w-full h-full object-cover object-top" />
          </span>
        )}
        <div className="min-w-0">
          <p className="display text-2xl md:text-[2rem] leading-none text-[var(--text)] work-name">{p.name}</p>
          <p className="text-[14px] text-[var(--text-dim)] mt-1.5">{p.tagline}</p>
        </div>
      </div>
      <span className="hidden md:block mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-faint)]">{p.status}</span>
      <div className="work-links">
        {p.live && (
          <a href={p.live} target="_blank" rel="noopener noreferrer" className="work-link">
            Open
            <ArrowIcon className="w-3 h-3" />
          </a>
        )}
        {p.video && (
          <a href={videoUrl(p.video.id)} target="_blank" rel="noopener noreferrer" className="work-link">
            <PlayGlyph />
            Video
          </a>
        )}
        {p.github && (
          <a href={p.github} target="_blank" rel="noopener noreferrer" className="work-link" aria-label={`${p.name} source on GitHub`}>
            <GithubIcon className="w-3.5 h-3.5" />
            Code
          </a>
        )}
      </div>
    </li>
  );
}

export default function Work() {
  const [active, setActive] = useState(null);
  const [hover, setHover] = useState(null);
  let n = 1;

  return (
    <section id="work" className="scroll-mt-20 pb-24 md:pb-32">
      <SectionHead
        index="03"
        title="Work"
        line="BugSnaps is my security company. I designed and wrote every product in it, from the scan engine to the site it runs on. Pick any row for the full write-up."
      >
        <a href={profile.bugsnaps} target="_blank" rel="noopener noreferrer" className="work-link">
          bugsnaps.in
          <ArrowIcon className="w-3 h-3" />
        </a>
        <a href={profile.github} target="_blank" rel="noopener noreferrer" className="work-link">
          <GithubIcon className="w-3.5 h-3.5" />
          github.com/4ryanwalia
        </a>
      </SectionHead>

      <Featured onOpen={setActive} />

      <div className="mt-20 md:mt-24 space-y-14">
        {GROUPS.map((g) => (
          <div key={g.label}>
            <p className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--text-faint)] pb-3 border-b border-[var(--line-strong)]">{g.label}</p>
            <ul onMouseLeave={() => setHover(null)}>
              {g.ids
                .map((id) => projects.find((p) => p.id === id))
                .filter(Boolean)
                .map((p) => (
                  <Row key={p.id} p={p} n={n++} onOpen={setActive} onHover={setHover} />
                ))}
            </ul>
          </div>
        ))}
      </div>

      <PreviewFloat image={hover ? PREVIEWS[hover] : null} />
      <AnimatePresence>{active && <ProjectModal project={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </section>
  );
}
