import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { projects } from './portfolioData';

/* Static imports so the GitHub Pages basePath is applied to every asset URL. */
import wakeMeLogo from '../public/logo.png';
import myreconLogo from '../public/myrecon-logo.svg';
import bugsnapsLogo from '../public/bugsnaps-logo.svg';
import endpointradarLogo from '../public/endpointradar-logo.svg';
import mypentestLogo from '../public/mypentest-logo.svg';
import personalLogo from '../public/personal-logo.svg';
import rakshakLogo from '../public/rakshak-logo.svg';
import phishingLogo from '../public/phishing-logo.svg';

/* Screenshots of the live products, captured from the real sites. */
import shotMypentest from '../public/shots/mypentest.jpg';
import shotReport from '../public/shots/mypentest-report.jpg';
import shotMyrecon from '../public/shots/myrecon.jpg';
import shotMyreconHome from '../public/shots/myrecon-home.jpg';
import shotBugsnaps from '../public/shots/bugsnaps.jpg';
import shotPersonal from '../public/shots/personal.jpg';
import shotEndpointradar from '../public/shots/endpointradar.jpg';
import shotRakshak from '../public/shots/rakshak.jpg';

const LOGOS = {
  mypentest: mypentestLogo,
  myrecon: myreconLogo,
  bugsnaps: bugsnapsLogo,
  personal: personalLogo,
  endpointradar: endpointradarLogo,
  wakeme: wakeMeLogo,
  rakshak: rakshakLogo,
  phishing: phishingLogo,
};

const SHOTS = {
  mypentest: [
    { src: shotMypentest, url: 'bugsnaps.in/mypentest' },
    { src: shotReport, url: 'bugsnaps.in/mypentest/example-report' },
  ],
  myrecon: [
    { src: shotMyrecon, url: 'myrecon.xyz' },
    { src: shotMyreconHome, url: 'myrecon.xyz' },
  ],
  bugsnaps: [{ src: shotBugsnaps, url: 'bugsnaps.in' }],
  personal: [{ src: shotPersonal, url: 'bugsnaps.in/personal' }],
  endpointradar: [{ src: shotEndpointradar, url: '4ryanwalia.github.io/EndpointRadar' }],
  rakshak: [{ src: shotRakshak, url: '4ryanwalia.github.io/Rakshak---Car' }],
};

const byId = (id) => projects.find((p) => p.id === id);

/* ─── icons ─── */
export const GithubIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export const ArrowIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H8m9 0v9" />
  </svg>
);

const PlayIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3.609 1.814L13.792 12 3.61 22.186a2.014 2.014 0 01-.609-1.444V3.258c0-.564.234-1.073.609-1.444zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1.996 1.996 0 010 3.73l-2.808 1.626L15.31 12l2.388-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
  </svg>
);

/* Tracks the cursor inside a .spotlight element so its border glow follows it. */
export function trackSpot(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--cx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--cy', `${e.clientY - r.top}px`);
}

/* Project logo, falling back to a monogram tinted with the project's accent. */
export function ProjectMark({ project, size = 48, rounded = 'rounded-xl' }) {
  const logo = LOGOS[project.id];

  if (logo) {
    return (
      <div className={`${rounded} overflow-hidden flex items-center justify-center flex-shrink-0`} style={{ width: size, height: size }}>
        <Image src={logo} alt={`${project.name} logo`} width={size} height={size} className="object-contain w-full h-full" />
      </div>
    );
  }

  const letters = project.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);

  return (
    <div
      className={`${rounded} flex items-center justify-center flex-shrink-0 display`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        color: project.accent,
        background: `${project.accent}14`,
        border: `1px solid ${project.accent}33`,
        letterSpacing: '-0.02em',
      }}
    >
      {letters}
    </div>
  );
}

/* A screenshot dressed in minimal browser chrome. `height` crops it from the top. */
export function BrowserFrame({ shot, height, className = '', sizes = '(min-width: 1024px) 600px, 100vw' }) {
  return (
    <div
      className={`rounded-xl overflow-hidden border border-[var(--line-strong)] bg-[#0b0c0e] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.9)] ${className}`}
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--line)] bg-white/[0.03]">
        <span className="flex gap-1 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-white/15" />
        </span>
        <span className="mono text-[10px] text-[var(--text-faint)] truncate flex-1 text-center rounded-md bg-black/30 px-2 py-0.5">{shot.url}</span>
      </div>
      <div className="relative" style={height ? { height } : undefined}>
        <Image
          src={shot.src}
          alt={`Screenshot of ${shot.url}`}
          sizes={sizes}
          className={height ? 'w-full h-full object-cover object-top' : 'w-full h-auto block'}
        />
      </div>
    </div>
  );
}

function StatusPill({ project }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 mono text-[10px] tracking-wider whitespace-nowrap"
      style={{ background: `${project.accent}14`, color: project.accent }}
    >
      {project.live && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: project.accent }} />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: project.accent }} />
        </span>
      )}
      {project.status}
    </span>
  );
}

/* A card that opens the detail modal, with an optional live link that stays clickable on top. */
function Tile({ project, onOpen, className = '', children, delay = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={trackSpot}
      style={{ '--spot': `${project.accent}99` }}
      className={`card spotlight group overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(120% 90% at 100% 0%, ${project.accent}12, transparent 60%)` }}
      />
      <button
        type="button"
        onClick={() => onOpen(project)}
        aria-label={`${project.name}: ${project.tagline}. Open details.`}
        className="absolute inset-0 z-[1] cursor-pointer rounded-[inherit]"
      />
      <div className="relative h-full pointer-events-none">{children}</div>
    </motion.article>
  );
}

function LiveLink({ project, label }) {
  if (!project.live) return null;
  return (
    <a
      href={project.live}
      target="_blank"
      rel="noopener noreferrer"
      className="pointer-events-auto relative z-[2] inline-flex items-center gap-1.5 mono text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all hover:brightness-110"
      style={{ background: project.accent, color: '#0a0a0a' }}
    >
      {label || project.live.replace(/^https?:\/\//, '').replace(/\/$/, '')}
      <ArrowIcon className="w-3 h-3" />
    </a>
  );
}

/* ─── ECOSYSTEM BENTO ─── */
const CHECK_GROUPS = ['Access control', 'Injection', 'Sessions', 'SSRF', 'TLS', 'Secrets'];

export function Ecosystem({ onOpen }) {
  const mypentest = byId('mypentest');
  const myrecon = byId('myrecon');
  const bugsnaps = byId('bugsnaps');
  const personal = byId('personal');

  return (
    <section id="ecosystem" className="scroll-mt-24 py-24 md:py-32">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <span className="eyebrow">Flagship work</span>
          <h2 className="display text-5xl md:text-7xl mt-5 text-white">
            One ecosystem,
            <br />
            <span className="serif text-[var(--accent)]">built end to end.</span>
          </h2>
        </div>
        <p className="text-[var(--text-dim)] max-w-sm leading-relaxed">
          BugSnaps is my security company. I designed and wrote every product in it, from the scan engine to the website it runs on.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:auto-rows-[minmax(250px,auto)]">
        {/* MyPentest */}
        <Tile project={mypentest} onOpen={onOpen} className="md:col-span-4 p-6 md:p-8 lg:min-h-[440px]">
          <div className="flex flex-col lg:h-full lg:max-w-[44%]">
            <div className="flex items-center gap-3.5">
              <ProjectMark project={mypentest} size={48} />
              <div>
                <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">{mypentest.kind}</p>
                <h3 className="display text-3xl md:text-4xl text-white mt-1">{mypentest.name}</h3>
              </div>
            </div>
            <div className="mt-4">
              <StatusPill project={mypentest} />
            </div>
            <p className="text-[var(--text-dim)] text-sm leading-relaxed mt-4">{mypentest.blurb}</p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {CHECK_GROUPS.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
            <div className="flex gap-6 mt-6">
              {mypentest.metrics.slice(0, 3).map((m) => (
                <div key={m.k}>
                  <div className="display text-2xl text-white">{m.v}</div>
                  <div className="mono text-[10px] uppercase tracking-wider text-[var(--text-faint)] mt-1">{m.k}</div>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-6">
              <LiveLink project={mypentest} label="Scan free" />
            </div>
          </div>
          {/* the live product, bleeding off the card edge */}
          <div className="mt-8 -mb-14 lg:m-0 lg:absolute lg:top-4 lg:-right-20 lg:w-[60%] transition-transform duration-500 ease-out group-hover:-translate-x-2 group-hover:-translate-y-1">
            <BrowserFrame shot={SHOTS.mypentest[0]} sizes="(min-width: 1024px) 560px, 100vw" />
          </div>
        </Tile>

        {/* MyRecon */}
        <Tile project={myrecon} onOpen={onOpen} delay={0.08} className="md:col-span-2 md:row-span-2 p-6 md:p-7">
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between gap-3">
              <ProjectMark project={myrecon} size={44} />
              <StatusPill project={myrecon} />
            </div>
            {/* homepage behind, a real search result in front */}
            <div className="my-6">
              <BrowserFrame
                shot={SHOTS.myrecon[1]}
                className="w-[86%] opacity-80 transition-transform duration-500 ease-out group-hover:-translate-x-1"
                sizes="(min-width: 768px) 320px, 90vw"
              />
              <BrowserFrame
                shot={SHOTS.myrecon[0]}
                className="relative w-[86%] ml-auto -mt-14 transition-transform duration-500 ease-out group-hover:-translate-y-1"
                sizes="(min-width: 768px) 320px, 90vw"
              />
            </div>
            <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">{myrecon.kind}</p>
            <h3 className="display text-3xl text-white mt-1">{myrecon.name}</h3>
            <p className="text-[var(--text-dim)] text-sm leading-relaxed mt-3">{myrecon.blurb}</p>
            <div className="grid grid-cols-2 gap-2 mt-5">
              {myrecon.metrics.map((m) => (
                <div key={m.k} className="rounded-xl border border-[var(--line)] bg-black/20 px-3 py-2.5">
                  <div className="text-[13px] font-semibold text-white leading-snug">{m.v}</div>
                  <div className="mono text-[9px] uppercase tracking-wider text-[var(--text-faint)] mt-0.5">{m.k}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-auto pt-6">
              <LiveLink project={myrecon} />
              <a
                href={myrecon.android}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto relative z-[2] inline-flex items-center gap-1.5 mono text-[11px] font-semibold px-3 py-1.5 rounded-full border border-[var(--line-strong)] text-white hover:bg-white/[0.08] transition-colors"
              >
                <PlayIcon className="w-3 h-3" />
                Android beta
              </a>
            </div>
          </div>
        </Tile>

        {/* BugSnaps */}
        <Tile project={bugsnaps} onOpen={onOpen} delay={0.12} className="md:col-span-2 p-6">
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between gap-3">
              <ProjectMark project={bugsnaps} size={44} />
              <StatusPill project={bugsnaps} />
            </div>
            <h3 className="display text-2xl text-white mt-5">{bugsnaps.name}</h3>
            <p className="serif text-xl mt-0.5" style={{ color: bugsnaps.accent }}>
              {bugsnaps.tagline}
            </p>
            <p className="text-[var(--text-dim)] text-sm leading-relaxed mt-3">
              Pentesting services, products and a Next.js site I built from scratch.
            </p>
            <div className="pt-5">
              <LiveLink project={bugsnaps} />
            </div>
            <div className="mt-auto pt-6 -mb-10 transition-transform duration-500 ease-out group-hover:-translate-y-2">
              <BrowserFrame shot={SHOTS.bugsnaps[0]} height={150} sizes="(min-width: 768px) 360px, 100vw" />
            </div>
          </div>
        </Tile>

        {/* Personal */}
        <Tile project={personal} onOpen={onOpen} delay={0.16} className="md:col-span-2 p-6">
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between gap-3">
              <ProjectMark project={personal} size={44} />
              <StatusPill project={personal} />
            </div>
            <h3 className="display text-2xl text-white mt-5">{personal.name}</h3>
            <p className="serif text-xl mt-0.5" style={{ color: personal.accent }}>
              {personal.tagline}
            </p>
            <p className="text-[var(--text-dim)] text-sm leading-relaxed mt-3">{personal.blurb}</p>
            <div className="pt-5">
              <LiveLink project={personal} label="bugsnaps.in/personal" />
            </div>
            <div className="mt-auto pt-6 -mb-10 transition-transform duration-500 ease-out group-hover:-translate-y-2">
              <BrowserFrame shot={SHOTS.personal[0]} height={150} sizes="(min-width: 768px) 360px, 100vw" />
            </div>
          </div>
        </Tile>
      </div>
    </section>
  );
}

/* ─── MORE BUILDS ─── */
export function Builds({ onOpen }) {
  const builds = projects.filter((p) => !p.ecosystem);

  return (
    <section id="work" className="scroll-mt-24 pb-24 md:pb-32">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <span className="eyebrow">More builds</span>
          <h2 className="display text-4xl md:text-6xl mt-5 text-white">
            Across <span className="serif text-[var(--accent)]">every</span> layer.
          </h2>
        </div>
        <a
          href="https://github.com/4ryanwalia"
          target="_blank"
          rel="noopener noreferrer"
          className="mono inline-flex items-center gap-2 text-xs text-[var(--text-faint)] hover:text-[var(--accent)] transition-colors w-fit"
        >
          <GithubIcon className="w-3.5 h-3.5" />
          github.com/4ryanwalia
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {builds.map((p, i) => (
          <Tile key={p.id} project={p} onOpen={onOpen} delay={i * 0.06} className="p-6">
            <div className="flex flex-col h-full">
              {/* media: the live page where there is one, otherwise the logo on an accent field */}
              <div className="-mx-6 -mt-6 mb-5 h-40 relative overflow-hidden border-b border-[var(--line)]">
                {SHOTS[p.id] ? (
                  <Image
                    src={SHOTS[p.id][0].src}
                    alt={`Screenshot of ${p.name}`}
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: `radial-gradient(80% 90% at 50% 100%, ${p.accent}2e, transparent 70%), var(--surface-2)` }}
                  >
                    <div className="grid-bg opacity-60" />
                    <div className="relative transition-transform duration-500 group-hover:scale-110">
                      <ProjectMark project={p} size={72} rounded="rounded-2xl" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[var(--surface)] to-transparent" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ProjectMark project={p} size={28} rounded="rounded-lg" />
                  <span className="mono text-[10px] uppercase tracking-[0.18em]" style={{ color: p.accent }}>
                    {p.category}
                  </span>
                </div>
                <ArrowIcon className="w-4 h-4 text-[var(--text-faint)] group-hover:text-white group-hover:rotate-45 transition-all duration-300" />
              </div>
              <h3 className="display text-2xl text-white mt-4">{p.name}</h3>
              <p className="text-[var(--text-dim)] text-sm mt-1">{p.tagline}</p>
              <div className="flex flex-wrap gap-1.5 mt-auto pt-6">
                {p.tech.slice(0, 3).map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Tile>
        ))}
      </div>
    </section>
  );
}

/* ─── MODAL ─── */
export function ProjectModal({ project, onClose }) {
  const handleKey = useCallback((e) => e.key === 'Escape' && onClose(), [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prev;
    };
  }, [handleKey]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex items-start md:items-center justify-center p-4 md:p-6 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} details`}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl my-auto rounded-3xl border border-[var(--line-strong)] bg-[var(--surface)] shadow-2xl overflow-hidden"
      >
        <div className="relative p-6 md:p-9 pb-6 overflow-hidden">
          <div className="absolute inset-0" style={{ background: `radial-gradient(120% 140% at 0% 0%, ${project.accent}22, transparent 60%)` }} />

          <button
            onClick={onClose}
            aria-label="Close details"
            className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-[var(--line)] flex items-center justify-center text-[var(--text-dim)] hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative flex items-start gap-4 pr-12">
            <ProjectMark project={project} size={64} rounded="rounded-2xl" />
            <div className="min-w-0">
              <StatusPill project={project} />
              <h3 className="display text-3xl md:text-4xl mt-3 text-white">{project.name}</h3>
              <p className="serif text-xl mt-1" style={{ color: project.accent }}>
                {project.tagline}
              </p>
            </div>
          </div>

          <p className="relative text-[var(--text-dim)] text-sm md:text-[15px] leading-relaxed mt-6">{project.blurb}</p>
        </div>

        <div className="px-6 md:px-9 pb-8">
          {SHOTS[project.id] && (
            <div className={`grid gap-3 mb-6 ${SHOTS[project.id].length > 1 ? 'md:grid-cols-2' : ''}`}>
              {SHOTS[project.id].map((shot, i) => (
                <a
                  key={i}
                  href={project.live || `https://${shot.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-transform duration-300 hover:-translate-y-1"
                >
                  <BrowserFrame shot={shot} sizes="(min-width: 768px) 360px, 100vw" />
                </a>
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {project.metrics.map((m) => (
              <div key={m.k} className="rounded-2xl border border-[var(--line)] bg-black/30 p-3.5">
                <div className="mono text-[9px] uppercase tracking-[0.15em] text-[var(--text-faint)] mb-1.5">{m.k}</div>
                <div className="text-sm font-semibold text-white break-words leading-snug">{m.v}</div>
              </div>
            ))}
          </div>

          <h4 className="mono text-[11px] uppercase tracking-[0.2em] mt-8 mb-4" style={{ color: project.accent }}>
            How it works
          </h4>
          <ul className="space-y-3">
            {project.highlights.map((h, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 + i * 0.04, duration: 0.3 }}
                className="text-[var(--text-dim)] text-sm flex items-start gap-3 leading-relaxed"
              >
                <span className="mono text-[10px] mt-[3px] flex-shrink-0" style={{ color: project.accent }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {h}
              </motion.li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-1.5 mt-7">
            {project.tech.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2.5 mt-8 pt-6 border-t border-[var(--line)]">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ background: project.accent, color: '#0a0a0a' }}
              >
                {project.liveLabel}
                <ArrowIcon className="w-3.5 h-3.5" />
              </a>
            )}
            {project.android && (
              <a href={project.android} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <PlayIcon className="w-4 h-4" />
                {project.androidLabel}
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <GithubIcon />
                Source
              </a>
            )}
          </div>

          {project.android && (
            <p className="mono text-[11px] text-[var(--text-faint)] mt-3">
              The Android build is in closed testing, so the link opens the tester sign-up page.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── ALL WORK: ecosystem + builds sharing one modal ─── */
export default function Work() {
  const [active, setActive] = useState(null);

  return (
    <>
      <Ecosystem onOpen={setActive} />
      <Builds onOpen={setActive} />
      <AnimatePresence>{active && <ProjectModal project={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </>
  );
}
