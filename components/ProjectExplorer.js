import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import wakeMeLogo from '../public/logo.png';
import { projects, projectCategories } from './portfolioData';

/* Small reusable pieces */
function LiveDot({ color = '#10b981' }) {
  return (
    <span className="relative flex h-2 w-2 flex-shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: color }} />
      <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: color }} />
    </span>
  );
}

function GithubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function ExternalIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

/* ─── CARD ─── */
function ProjectCard({ project, index, onOpen }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
      whileHover={{ y: -6 }}
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
      className={`group relative cursor-pointer rounded-2xl border border-gray-800/70 bg-[#0e1014] overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
        project.featured ? 'md:col-span-2' : ''
      }`}
      style={{ '--accent': project.accent }}
    >
      {/* accent top line */}
      <div className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${project.gradient}`} />
      {/* hover glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 0%, ${project.accent}14, transparent 70%)` }}
      />

      <div className="relative p-5 md:p-6 h-full flex flex-col">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
            style={{ background: `${project.accent}18`, border: `1px solid ${project.accent}33` }}
          >
            {project.icon}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-white truncate">{project.name}</h3>
              {project.live && <LiveDot color={project.accent} />}
            </div>
            <p className="text-xs uppercase tracking-wider mt-0.5 font-medium" style={{ color: project.accent }}>
              {project.tagline}
            </p>
          </div>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mt-4 flex-1">
          {project.featured ? project.blurb : `${project.blurb.slice(0, 120)}…`}
        </p>

        {/* tech preview */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tech.slice(0, project.featured ? 5 : 3).map((t) => (
            <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.07] text-gray-400">
              {t}
            </span>
          ))}
          {project.tech.length > (project.featured ? 5 : 3) && (
            <span className="text-[11px] px-2.5 py-1 rounded-full text-gray-500">
              +{project.tech.length - (project.featured ? 5 : 3)}
            </span>
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.06]">
          <span className="text-[10px] font-mono tracking-wider text-gray-500">{project.status}</span>
          <span
            className="text-xs font-semibold inline-flex items-center gap-1.5 transition-transform duration-300 group-hover:translate-x-1"
            style={{ color: project.accent }}
          >
            Details
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── MODAL ─── */
function ProjectModal({ project, onClose }) {
  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

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
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl my-auto rounded-2xl border border-gray-800 bg-[#0b0d11] shadow-2xl overflow-hidden"
      >
        <div className={`h-1 bg-gradient-to-r ${project.gradient}`} />

        {/* close */}
        <button
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 md:p-8">
          {/* header */}
          <div className="flex items-start gap-4 pr-10">
            {project.image ? (
              <div className="w-16 h-16 flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 relative">
                <Image src={wakeMeLogo} alt="" fill sizes="64px" className="object-cover" />
              </div>
            ) : (
              <div
                className="w-16 h-16 flex-shrink-0 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: `${project.accent}18`, border: `1px solid ${project.accent}33` }}
              >
                {project.icon}
              </div>
            )}
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-2 border" style={{ borderColor: `${project.accent}44`, background: `${project.accent}10` }}>
                {project.live && <LiveDot color={project.accent} />}
                <span className="text-[10px] font-mono tracking-wider" style={{ color: project.accent }}>
                  {project.status}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">{project.name}</h3>
              <p className="text-sm mt-1" style={{ color: project.accent }}>
                {project.tagline}
              </p>
            </div>
          </div>

          {project.motto && (
            <p className="mt-5 text-xl font-bold" style={{ color: project.accent }}>
              {project.motto}
            </p>
          )}

          <p className="text-gray-300 text-sm md:text-base leading-relaxed mt-5">{project.blurb}</p>

          {/* metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {project.metrics.map((m) => (
              <div key={m.k} className="bg-black/50 rounded-xl border border-white/[0.06] p-3 text-center">
                <div className="text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1">{m.k}</div>
                <div className="text-sm font-bold text-white break-words">{m.v}</div>
              </div>
            ))}
          </div>

          {/* highlights */}
          <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: project.accent }}>
              ▸ What it does
            </h4>
            <ul className="space-y-2.5">
              {project.highlights.map((h, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.3 }}
                  className="text-gray-300 text-sm flex items-start gap-2.5 leading-relaxed"
                >
                  <span className="mt-1 flex-shrink-0" style={{ color: project.accent }}>
                    ›
                  </span>
                  {h}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* tech */}
          <div className="flex flex-wrap gap-2 mt-6">
            {project.tech.map((t) => (
              <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-300">
                {t}
              </span>
            ))}
          </div>

          {/* actions */}
          <div className="flex flex-wrap gap-3 mt-7 pt-6 border-t border-white/[0.07]">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full text-black transition-transform duration-200 hover:scale-105"
                style={{ background: project.accent }}
              >
                <ExternalIcon />
                {project.liveLabel}
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white transition-colors"
              >
                <GithubIcon />
                Source on GitHub
              </a>
            )}
          </div>
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
    <section id="projects" className="mb-24 scroll-mt-24">
      {/* header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-cyan-400 font-semibold">Selected Work</span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-2">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Things I&apos;ve Built
            </span>
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            {liveCount} of them are live right now — click any card to look inside.
          </p>
        </div>

        <a
          href="https://github.com/4ryanwalia"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors w-fit"
        >
          <GithubIcon />
          github.com/4ryanwalia
        </a>
      </div>

      {/* filters */}
      <div className="flex flex-wrap gap-2 mb-7">
        {projectCategories.map((cat) => {
          const count = cat.id === 'all' ? projects.length : projects.filter((p) => p.category === cat.id).length;
          const isActive = filter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              aria-pressed={isActive}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 border ${
                isActive
                  ? 'text-black border-transparent'
                  : 'text-gray-400 border-gray-800 hover:text-white hover:border-gray-600'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {cat.label}
                <span className={isActive ? 'text-black/60 ml-1.5' : 'text-gray-600 ml-1.5'}>{count}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* grid — keyed on the filter so the set remounts and animates in cleanly */}
      <div key={filter} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {visible.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} onOpen={setActive} />
        ))}
      </div>

      {/* modal */}
      <AnimatePresence>{active && <ProjectModal project={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </section>
  );
}
