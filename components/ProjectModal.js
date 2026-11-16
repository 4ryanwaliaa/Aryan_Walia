import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { EASE } from './fx';
import { ArrowIcon, BrowserFrame, GithubIcon, PlayIcon, ProjectMark, SHOTS, StatusPill, videoUrl } from './shared';

/* A small filled triangle for "watch". */
export const PlayGlyph = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7 4.5v15l13-7.5z" />
  </svg>
);

/* ─── MODAL ─── */
export default function ProjectModal({ project, onClose }) {
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
      <div className="absolute inset-0 bg-[var(--scrim)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        transition={{ duration: 0.35, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl my-auto rounded-[2px] border border-[var(--text)] bg-[var(--surface)] shadow-[12px_12px_0_0_var(--text)] overflow-hidden"
      >
        <div className="relative p-6 md:p-9 pb-6 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[5px]" style={{ background: project.accent }} />

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="absolute top-5 right-5 z-10 w-9 h-9 rounded-[2px] bg-[var(--surface)] hover:bg-[var(--tint-3)] border border-[var(--line)] flex items-center justify-center text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative flex items-start gap-4 pr-12">
            <ProjectMark project={project} size={64} rounded="rounded-2xl" />
            <div className="min-w-0">
              <StatusPill project={project} />
              <h3 className="display text-3xl md:text-4xl mt-3 text-[var(--text)]">{project.name}</h3>
              <p className="text-lg font-semibold mt-1" style={{ color: project.accent }}>
                {project.tagline}
              </p>
            </div>
          </div>

          <p className="relative lede mt-6">{project.blurb}</p>
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
              <div key={m.k} className="rounded-[2px] border border-[var(--line)] bg-[var(--tint-2)] p-3.5">
                <div className="mono text-[9px] uppercase tracking-[0.15em] text-[var(--text-faint)] mb-1.5">{m.k}</div>
                <div className="text-sm font-semibold text-[var(--text)] break-words leading-snug">{m.v}</div>
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
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: project.accent, color: '#fff' }}>
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
            {project.video && (
              <a href={videoUrl(project.video.id)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <PlayGlyph />
                {project.video.label}
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

