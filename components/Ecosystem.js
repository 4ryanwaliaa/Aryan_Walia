import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { projects } from './portfolioData';
import { EASE, MaskLine, Tilt, reveal } from './fx';
import { ArrowIcon, BrowserFrame, GithubIcon, PlayIcon, ProjectMark, SHOTS, StatusPill, byId } from './shared';

/* Two orbits around the BugSnaps core. `size` is the ring diameter as a share of the stage,
   `offset` rotates the whole ring so planets on different rings never start lined up. */
const RINGS = [
  { size: 50, dur: 48, ids: ['mypentest', 'myrecon'], offset: -35 },
  { size: 86, dur: 84, ids: ['endpointradar', 'phishlens', 'personal'], offset: 70, reverse: true },
];

const ROTATE_MS = 6500;
const ITEMS = projects.filter((p) => p.ecosystem);
const CORE = ITEMS.find((p) => p.core);

function Orbit({ core, activeId, onSelect }) {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className={`orbit ${paused ? 'paused' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="orbit-halo" aria-hidden="true" />
      <div className="orbit-sweep" aria-hidden="true" />

      {RINGS.map((ring) => (
        <div
          key={ring.size}
          className={`orbit-ring ${ring.reverse ? 'rev' : ''}`}
          style={{ width: `${ring.size}%`, height: `${ring.size}%`, '--dur': `${ring.dur}s` }}
        >
          {ring.ids.map((id, i) => {
            const p = byId(id);
            const angle = (((360 / ring.ids.length) * i + ring.offset) * Math.PI) / 180;
            const on = id === activeId;
            return (
              <div
                key={id}
                className="orbit-slot"
                style={{ left: `${(50 + 50 * Math.cos(angle)).toFixed(3)}%`, top: `${(50 + 50 * Math.sin(angle)).toFixed(3)}%` }}
              >
                <div className="orbit-upright">
                  <button
                    type="button"
                    onClick={() => onSelect(id)}
                    aria-label={`Show ${p.name}: ${p.tagline}`}
                    aria-pressed={on}
                    className={`planet ${on ? 'is-on' : ''}`}
                    style={{ '--pc': p.accent }}
                  >
                    <ProjectMark project={p} size={34} rounded="rounded-[10px]" />
                    <span className="planet-label">{p.name}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <button
        type="button"
        onClick={() => onSelect(core.id)}
        aria-label={`Show ${core.name}: ${core.tagline}`}
        aria-pressed={activeId === core.id}
        className={`orbit-core ${activeId === core.id ? 'is-on' : ''}`}
        style={{ '--pc': core.accent }}
      >
        <span className="orbit-core-ping" aria-hidden="true" />
        <ProjectMark project={core} size={58} rounded="rounded-2xl" />
      </button>
    </div>
  );
}

function Panel({ project, onOpen }) {
  const shot = SHOTS[project.id]?.[0];

  return (
    <motion.div
      key={project.id}
      role="tabpanel"
      id={`eco-panel-${project.id}`}
      aria-labelledby={`eco-tab-${project.id}`}
      initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
      transition={{ duration: 0.38, ease: EASE }}
      className="relative"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <ProjectMark project={project} size={54} rounded="rounded-2xl" />
          <div className="min-w-0">
            <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">{project.kind}</p>
            <h3 className="display text-4xl md:text-5xl text-white mt-1">{project.name}</h3>
          </div>
        </div>
        <div className="hidden sm:block flex-shrink-0 pt-1">
          <StatusPill project={project} />
        </div>
      </div>

      <p className="serif text-2xl mt-4" style={{ color: project.accent }}>
        {project.tagline}
      </p>
      <div className="sm:hidden mt-3">
        <StatusPill project={project} />
      </div>
      <p className="text-[var(--text-dim)] text-[15px] leading-relaxed mt-3 lg:min-h-[6.2rem]">{project.blurb}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-5">
        {project.metrics.map((m) => (
          <div key={m.k} className="rounded-xl border border-[var(--line)] bg-black/25 px-3 py-2.5">
            <div className="mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-faint)]">{m.k}</div>
            <div className="text-[13px] font-semibold text-white leading-snug mt-1">{m.v}</div>
          </div>
        ))}
      </div>

      {shot && (
        <Tilt max={4} className="mt-6">
          <a href={project.live} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.name}`} className="block">
            <BrowserFrame shot={shot} height={230} sizes="(min-width: 1024px) 620px, 100vw" />
          </a>
        </Tilt>
      )}

      <div className="flex flex-wrap gap-2.5 mt-6">
        {project.live && (
          <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: project.accent, color: '#0a0a0a' }}>
            {project.liveLabel}
            <ArrowIcon className="w-3.5 h-3.5" />
          </a>
        )}
        {project.android && (
          <a href={project.android} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <PlayIcon className="w-4 h-4" />
            Google Play
          </a>
        )}
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <GithubIcon />
            Source
          </a>
        )}
        <button type="button" onClick={() => onOpen(project)} className="btn btn-ghost">
          How it works
        </button>
      </div>
    </motion.div>
  );
}

export default function Ecosystem({ onOpen }) {
  const items = ITEMS;
  const core = CORE;
  const [activeId, setActiveId] = useState(items[0].id);
  const [touched, setTouched] = useState(false);
  const [hovering, setHovering] = useState(false);
  const sectionRef = useRef(null);
  const tabsRef = useRef(null);
  const inView = useInView(sectionRef, { margin: '-30% 0px -30% 0px' });
  const reduce = useReducedMotion();
  const active = byId(activeId);
  const autoplay = inView && !touched && !hovering && !reduce;

  /* Tour the products on wide screens until the visitor takes over. */
  useEffect(() => {
    if (!autoplay) return undefined;
    if (!window.matchMedia('(min-width: 1024px)').matches) return undefined;
    const t = window.setTimeout(() => {
      const i = items.findIndex((p) => p.id === activeId);
      setActiveId(items[(i + 1) % items.length].id);
    }, ROTATE_MS);
    return () => window.clearTimeout(t);
  }, [autoplay, activeId, items]);

  const select = (id) => {
    setTouched(true);
    setActiveId(id);
  };

  const onTabKey = (e) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const i = items.findIndex((p) => p.id === activeId);
    const next = items[(i + delta + items.length) % items.length];
    select(next.id);
    tabsRef.current?.querySelector(`#eco-tab-${next.id}`)?.focus();
  };

  return (
    <section id="ecosystem" ref={sectionRef} className="scroll-mt-24 py-24 md:py-32">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <span className="eyebrow">Flagship work · The BugSnaps system</span>
          <h2 className="display text-5xl md:text-7xl mt-5 text-white">
            <MaskLine>One ecosystem,</MaskLine>
            <MaskLine delay={0.08}>
              <span className="serif text-[var(--accent)]">built end to end.</span>
            </MaskLine>
          </h2>
        </div>
        <motion.p {...reveal(0.1)} className="text-[var(--text-dim)] max-w-sm leading-relaxed">
          BugSnaps is my security company. I designed and wrote every product in its orbit, from the scan engine to the site it
          runs on. All of them are live.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        <motion.div {...reveal()} className="lg:col-span-5 lg:sticky lg:top-28">
          <Orbit core={core} activeId={activeId} onSelect={select} />
          <p className="mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-faint)] text-center mt-6">
            Pick a planet · hover to hold the orbit
          </p>
        </motion.div>

        <motion.div
          {...reveal(0.1)}
          className="lg:col-span-7 min-w-0"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <div
            ref={tabsRef}
            role="tablist"
            aria-label="BugSnaps products"
            onKeyDown={onTabKey}
            className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 md:mx-0 md:px-0 md:flex-wrap pb-1"
          >
            {items.map((p) => {
              const on = p.id === activeId;
              return (
                <button
                  key={p.id}
                  id={`eco-tab-${p.id}`}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls={`eco-panel-${p.id}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(p.id)}
                  className={`eco-tab ${on ? 'is-on' : ''}`}
                  style={{ '--pc': p.accent }}
                >
                  {on && <motion.span layoutId="eco-tab-pill" className="eco-tab-pill" transition={{ duration: 0.45, ease: EASE }} />}
                  <span className="relative flex items-center gap-2">
                    <ProjectMark project={p} size={20} rounded="rounded-md" />
                    {p.name}
                  </span>
                  {on && autoplay && <span key={p.id} className="eco-tab-timer" style={{ animationDuration: `${ROTATE_MS}ms` }} aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          <div
            className="card relative overflow-hidden mt-4 p-6 md:p-8 transition-colors duration-500"
            style={{ borderColor: `${active.accent}33` }}
          >
            <div
              className="pointer-events-none absolute -top-40 -right-40 w-[30rem] h-[30rem] rounded-full transition-colors duration-700"
              style={{ background: `radial-gradient(circle, ${active.accent}1c, transparent 65%)` }}
              aria-hidden="true"
            />
            <AnimatePresence mode="wait" initial={false}>
              <Panel key={active.id} project={active} onOpen={onOpen} />
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
