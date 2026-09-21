import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { projects, projectCategories } from './portfolioData';

/* Static imports so the GitHub Pages basePath is applied to every asset URL. */
import wakeMeLogo from '../public/logo.png';
import myreconLogo from '../public/myrecon-logo.svg';
import bugsnapsLogo from '../public/bugsnaps-logo.svg';
import endpointradarLogo from '../public/endpointradar-logo.svg';

const LOGOS = {
  myrecon: myreconLogo,
  bugsnaps: bugsnapsLogo,
  endpointradar: endpointradarLogo,
  wakeme: wakeMeLogo,
};

/* ─── icons ─── */
const GithubIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

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

/* Project logo, falling back to the emoji mark when a project has no artwork. */
export function ProjectMark({ project, size = 48, rounded = 'rounded-xl' }) {
  const logo = LOGOS[project.id];
  const pad = project.id === 'wakeme' ? 0 : Math.round(size * 0.16);

  if (logo) {
    return (
      <div
        className={`${rounded} overflow-hidden flex items-center justify-center flex-shrink-0 relative`}
        style={{
          width: size,
          height: size,
          background: project.id === 'wakeme' ? 'transparent' : `${project.accent}12`,
          border: `1px solid ${project.accent}2e`,
          padding: pad,
        }}
      >
        <Image
          src={logo}
          alt={`${project.name} logo`}
          width={size - pad * 2}
          height={size - pad * 2}
          className="object-contain w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      className={`${rounded} flex items-center justify-center flex-shrink-0`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.46,
        background: `${project.accent}12`,
        border: `1px solid ${project.accent}2e`,
      }}
    >
      {project.icon}
    </div>
  );
}

function StatusPill({ project }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 mono text-[10px] tracking-wider whitespace-nowrap"
      style={{ background: `${project.accent}12`, color: project.accent }}
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

/* ─── CARD ─── */
function ProjectCard({ project, index, onOpen }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.3), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(project);
        }
      }}
      aria-label={`${project.name} — ${project.tagline}. Open details.`}
      className={`card group relative cursor-pointer overflow-hidden ${project.featured ? 'md:col-span-2' : ''}`}
    >
      {/* accent wash on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(120% 80% at 50% 0%, ${project.accent}0f, transparent 70%)` }}
      />

      <div className="relative p-5 md:p-6 h-full flex flex-col">
        <div className="flex items-start gap-4">
          <div className="transition-transform duration-300 group-hover:scale-105">
            <ProjectMark project={project} size={project.featured ? 56 : 46} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-[17px] md:text-lg font-bold tracking-tight text-[var(--text)] truncate">{project.name}</h3>
            <p className="mono text-[11px] uppercase tracking-wider mt-1" style={{ color: project.accent }}>
              {project.tagline}
            </p>
          </div>

          <ArrowIcon className="w-4 h-4 text-[var(--text-faint)] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex-shrink-0 mt-1" />
        </div>

        <p className="text-[var(--text-dim)] text-sm leading-relaxed mt-4 flex-1">
          {project.featured ? project.blurb : `${project.blurb.slice(0, 112)}…`}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tech.slice(0, project.featured ? 5 : 3).map((t) => (
            <span key={t} className="mono text-[10px] px-2 py-1 rounded-md bg-white/[0.035] border border-[var(--line)] text-[var(--text-faint)]">
              {t}
            </span>
          ))}
          {project.tech.length > (project.featured ? 5 : 3) && (
            <span className="mono text-[10px] px-1.5 py-1 text-[var(--text-faint)]">
              +{project.tech.length - (project.featured ? 5 : 3)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-[var(--line)]">
          <StatusPill project={project} />
          {project.android && (
            <span className="mono text-[10px] text-[var(--text-faint)] inline-flex items-center gap-1">
              <PlayIcon className="w-3 h-3" /> Android beta
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* ─── MODAL ─── */
function ProjectModal({ project, onClose }) {
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

  if (!project) return null;

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
      <div className="absolute inset-0 bg-black/88 backdrop-blur-md" />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl my-auto rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)] shadow-2xl overflow-hidden"
      >
        {/* header band tinted with the project's own colour */}
        <div className="relative p-6 md:p-8 pb-6 overflow-hidden">
          <div className="absolute inset-0 opacity-90" style={{ background: `radial-gradient(120% 140% at 0% 0%, ${project.accent}1f, transparent 60%)` }} />

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
              <h3 className="display text-2xl md:text-3xl mt-2.5 text-white">{project.name}</h3>
              <p className="mono text-xs uppercase tracking-wider mt-1.5" style={{ color: project.accent }}>
                {project.tagline}
              </p>
            </div>
          </div>

          {project.motto && (
            <p className="relative mt-5 text-lg font-bold" style={{ color: project.accent }}>
              {project.motto}
            </p>
          )}

          <p className="relative text-[var(--text-dim)] text-sm md:text-[15px] leading-relaxed mt-4">{project.blurb}</p>
        </div>

        <div className="px-6 md:px-8 pb-7">
          {/* metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {project.metrics.map((m) => (
              <div key={m.k} className="rounded-xl border border-[var(--line)] bg-black/40 p-3 text-center">
                <div className="mono text-[9px] uppercase tracking-[0.15em] text-[var(--text-faint)] mb-1">{m.k}</div>
                <div className="text-[13px] font-semibold text-white break-words leading-snug">{m.v}</div>
              </div>
            ))}
          </div>

          {/* highlights */}
          <h4 className="eyebrow mt-7 mb-3" style={{ color: project.accent }}>
            What it does
          </h4>
          <ul className="space-y-2.5">
            {project.highlights.map((h, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 + i * 0.04, duration: 0.3 }}
                className="text-[var(--text-dim)] text-sm flex items-start gap-2.5 leading-relaxed"
              >
                <span className="mt-[7px] w-1 h-1 rounded-full flex-shrink-0" style={{ background: project.accent }} />
                {h}
              </motion.li>
            ))}
          </ul>

          {/* tech */}
          <div className="flex flex-wrap gap-1.5 mt-6">
            {project.tech.map((t) => (
              <span key={t} className="mono text-[11px] px-2.5 py-1.5 rounded-md bg-white/[0.035] border border-[var(--line)] text-[var(--text-dim)]">
                {t}
              </span>
            ))}
          </div>

          {/* actions */}
          <div className="flex flex-wrap gap-2.5 mt-7 pt-6 border-t border-[var(--line)]">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-full text-[#04120c] transition-transform duration-200 hover:scale-[1.03]"
                style={{ background: project.accent }}
              >
                {project.liveLabel}
                <ArrowIcon className="w-3.5 h-3.5" />
              </a>
            )}
            {project.android && (
              <a
                href={project.android}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-[var(--line-strong)] text-white transition-colors"
              >
                <PlayIcon className="w-4 h-4" />
                {project.androidLabel}
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-[var(--line-strong)] text-white transition-colors"
              >
                <GithubIcon />
                Source
              </a>
            )}
          </div>

          {project.android && (
            <p className="mono text-[11px] text-[var(--text-faint)] mt-3">
              The Android build is in closed testing — the link opens the tester sign-up page.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── MAIN ─── */
export default function ProjectExplorer() {
  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState(null);

  const visible = filter === 'all' ? projects : projects.filter((p) => p.category === filter);
  const liveCount = projects.filter((p) => p.live).length;

  return (
    <section id="projects" className="mb-28 scroll-mt-24">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
        <div>
          <span className="eyebrow">Selected work</span>
          <h2 className="display text-4xl md:text-5xl mt-3 text-white">Things I&apos;ve shipped</h2>
          <p className="text-[var(--text-dim)] text-sm mt-3 max-w-md">
            {liveCount} are live right now — open any card for the detail.
          </p>
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

      {/* filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {projectCategories.map((cat) => {
          const count = cat.id === 'all' ? projects.length : projects.filter((p) => p.category === cat.id).length;
          const isActive = filter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              aria-pressed={isActive}
              className={`relative px-3.5 py-2 rounded-full text-[13px] font-medium transition-colors duration-300 border ${
                isActive
                  ? 'text-[#04120c] border-transparent'
                  : 'text-[var(--text-dim)] border-[var(--line)] hover:text-white hover:border-[var(--line-strong)]'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-[var(--accent)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">
                {cat.label}
                <span className={`mono ml-1.5 text-[11px] ${isActive ? 'opacity-60' : 'text-[var(--text-faint)]'}`}>{count}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* grid — keyed on filter so the set remounts cleanly */}
      <div key={filter} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visible.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} onOpen={setActive} />
        ))}
      </div>

      <AnimatePresence>{active && <ProjectModal project={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </section>
  );
}
