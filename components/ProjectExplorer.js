import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { projects, profile } from './portfolioData';
import { EASE, MaskLine, reveal } from './fx';
import { ArrowIcon, BrowserFrame, GithubIcon, PlayIcon, ProjectMark, SHOTS, StatusPill, trackSpot } from './shared';
import Ecosystem from './Ecosystem';
import Apps from './Apps';
import CaseStudies from './CaseStudies';

/* A card that opens the detail modal. */
function Tile({ project, onOpen, className = '', children, delay = 0 }) {
  return (
    <motion.article
      {...reveal(delay, 24)}
      onMouseMove={trackSpot}
      style={{ '--spot': `${project.accent}99` }}
      className={`card spotlight lift group overflow-hidden ${className}`}
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

/* ─── MORE BUILDS ─── */
export function Builds({ onOpen }) {
  const builds = projects.filter((p) => !p.ecosystem && !p.app);

  return (
    <section id="work" className="scroll-mt-24 pb-24 md:pb-32">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <span className="eyebrow">More builds</span>
          <h2 className="display text-4xl md:text-6xl mt-5 text-white">
            <MaskLine>
              Across <span className="serif text-[var(--accent)]">every</span> layer.
            </MaskLine>
          </h2>
        </div>
        <motion.p {...reveal(0.1)} className="text-[var(--text-dim)] max-w-sm leading-relaxed">
          Research and side projects outside the BugSnaps orbit, all open to inspect.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {builds.map((p, i) => (
          <Tile key={p.id} project={p} onOpen={onOpen} delay={i * 0.06} className="p-6">
            <div className="flex flex-col h-full">
              {/* media: the live page where there is one, otherwise the logo on an accent field */}
              <div className="-mx-6 -mt-6 mb-5 h-44 relative overflow-hidden border-b border-[var(--line)]">
                {SHOTS[p.id] ? (
                  <Image
                    src={SHOTS[p.id][0].src}
                    alt={`Screenshot of ${p.name}`}
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
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

        {/* the rest lives on GitHub */}
        <motion.a
          {...reveal(builds.length * 0.06, 24)}
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          onMouseMove={trackSpot}
          className="card spotlight lift group relative overflow-hidden p-6 flex flex-col justify-between min-h-[260px] sm:col-span-2 lg:col-span-1"
        >
          <div className="grid-bg opacity-70" aria-hidden="true" />
          <div className="relative flex items-center justify-between">
            <span className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-[var(--line-strong)] flex items-center justify-center text-white">
              <GithubIcon className="w-6 h-6" />
            </span>
            <ArrowIcon className="w-5 h-5 text-[var(--text-faint)] group-hover:text-[var(--accent)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
          </div>
          <div className="relative">
            <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Open source</p>
            <h3 className="display text-3xl text-white mt-2">
              Read the <span className="serif text-[var(--accent)]">code.</span>
            </h3>
            <p className="text-[var(--text-dim)] text-sm mt-2">The MyRecon CLI, the EndpointRadar scanner and more, on github.com/4ryanwalia.</p>
          </div>
        </motion.a>
      </div>
    </section>
  );
}

/* ─── MODAL ─── */
export function ProjectModal({ project, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const opener = document.activeElement;
    const dialog = dialogRef.current;
    closeRef.current?.focus();

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
      } else if (e.key === 'Tab' && dialog) {
        const focusable = Array.from(
          dialog.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((element) => element.getClientRects().length > 0);
        if (!focusable.length) {
          e.preventDefault();
          dialog.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prev;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, []);

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
      ref={dialogRef}
      tabIndex={-1}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        transition={{ duration: 0.35, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl my-auto rounded-3xl border border-[var(--line-strong)] bg-[var(--surface)] shadow-2xl overflow-hidden"
      >
        <div className="relative p-6 md:p-9 pb-6 overflow-hidden">
          <div className="absolute inset-0" style={{ background: `radial-gradient(120% 140% at 0% 0%, ${project.accent}22, transparent 60%)` }} />

          <button
            ref={closeRef}
            type="button"
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
            <div className={`grid grid-cols-1 gap-3 mb-6 ${SHOTS[project.id].length > 1 ? 'md:grid-cols-2' : ''}`}>
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
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: project.accent, color: '#0a0a0a' }}>
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
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── ALL WORK: orbit, store shelf, case studies and builds sharing one modal ─── */
export default function Work() {
  const [active, setActive] = useState(null);

  return (
    <>
      <Ecosystem onOpen={setActive} />
      <Apps onOpen={setActive} />
      <CaseStudies />
      <Builds onOpen={setActive} />
      <AnimatePresence>{active && <ProjectModal project={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </>
  );
}
