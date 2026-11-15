import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { MaskLine, reveal } from './fx';
import { ArrowIcon, byId, trackSpot } from './shared';
import {
  profile,
  capabilities,
  workflow,
  experience,
  education,
  certifications,
  contactTopics,
} from './portfolioData';

/* Line icons for each capability */
const CAP_ICONS = {
  web: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5.5A1.5 1.5 0 014.5 4h15A1.5 1.5 0 0121 5.5v13a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 18.5v-13zM3 9h18M7 6.5h.01M9.5 6.5h.01M8 13l-2 2 2 2m8-4l2 2-2 2m-3.5-5l-1 6" />
  ),
  security: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7.5 3v5.5c0 4.7-3.2 8.1-7.5 9.5-4.3-1.4-7.5-4.8-7.5-9.5V6L12 3zm-3 9l2 2 4-4.5" />
  ),
  mobile: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 2.5h8A1.5 1.5 0 0117.5 4v16a1.5 1.5 0 01-1.5 1.5H8A1.5 1.5 0 016.5 20V4A1.5 1.5 0 018 2.5zM11 18.5h2" />
  ),
  ai: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2zm3 5h4v4h-4v-4z" />
  ),
};

/* A proof entry is either a project id or an explicit { label, href }. */
const proofLink = (entry) => {
  if (typeof entry !== 'string') return entry;
  const p = byId(entry);
  return { label: p.name, href: p.live || p.github };
};

/* ─── WHAT I BUILD ─── */
export function Capabilities() {
  return (
    <section id="capabilities" className="scroll-mt-24 pb-24 md:pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
        <div className="lg:col-span-7">
          <span className="eyebrow">What I build</span>
          <h2 className="display text-5xl md:text-7xl mt-5 text-white">
            <MaskLine>Ideas in.</MaskLine>
            <MaskLine delay={0.08}>
              <span className="serif text-[var(--accent)]">Secure products</span> out.
            </MaskLine>
          </h2>
        </div>
        <motion.p {...reveal(0.1)} className="lg:col-span-5 lg:self-end text-[var(--text-dim)] leading-relaxed">
          Most builders ship first and think about security later. I come from the attacking side, so every site, app and model I
          build is tested the way an attacker would test it, before anyone else gets the chance.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {capabilities.map((c, i) => (
          <motion.div
            key={c.id}
            {...reveal(i * 0.06)}
            onMouseMove={trackSpot}
            style={{ '--spot': `${c.accent}99` }}
            className="card spotlight lift group p-6 md:p-8 overflow-hidden"
          >
            <div
              className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ background: `radial-gradient(circle, ${c.accent}22, transparent 70%)` }}
            />
            <div className="relative flex items-start justify-between gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                style={{ background: `${c.accent}14`, border: `1px solid ${c.accent}30`, color: c.accent }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden="true">
                  {CAP_ICONS[c.id]}
                </svg>
              </div>
              <span className="mono text-[11px] text-[var(--text-faint)]">0{i + 1}</span>
            </div>

            <h3 className="relative display text-3xl text-white mt-6">{c.title}</h3>
            <p className="relative text-[var(--text-dim)] leading-relaxed mt-2">{c.line}</p>

            <div className="relative flex flex-wrap gap-1.5 mt-5">
              {c.stack.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>

            <div className="relative flex flex-wrap items-center gap-x-4 gap-y-2 mt-6 pt-5 border-t border-[var(--line)]">
              <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Proof</span>
              {c.proof.map(proofLink).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-white hover:text-[var(--accent)] transition-colors"
                >
                  {link.label}
                  <ArrowIcon className="w-3 h-3 opacity-60" />
                </a>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* how a build runs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mt-4 rounded-[20px] overflow-hidden border border-[var(--line)] bg-[var(--line)]">
        {workflow.map((s, i) => (
          <motion.div key={s.n} {...reveal(i * 0.06)} className="group bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors p-5 md:p-6">
            <span className="mono text-[11px] text-[var(--accent)]">{s.n}</span>
            <h4 className="display text-xl text-white mt-3">{s.t}</h4>
            <p className="text-[var(--text-faint)] group-hover:text-[var(--text-dim)] transition-colors text-[13px] leading-relaxed mt-1.5">{s.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── EXPERIENCE + EDUCATION + CERTS ─── */
export function Journey() {
  const railRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: railRef, offset: ['start 75%', 'end 55%'] });
  const drawn = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <section id="journey" className="scroll-mt-24 pb-24 md:pb-32">
      <span className="eyebrow">Track record</span>
      <h2 className="display text-4xl md:text-6xl mt-5 mb-12 text-white">
        <MaskLine>
          Where I&apos;ve <span className="serif text-[var(--accent)]">been.</span>
        </MaskLine>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* experience: a rail that draws itself as you scroll */}
        <div ref={railRef} className="lg:col-span-7 relative pl-8 md:pl-10">
          <div className="absolute left-[5px] top-3 bottom-3 w-px bg-[var(--line-strong)]" aria-hidden="true" />
          <motion.div
            className="absolute left-[5px] top-3 bottom-3 w-px origin-top bg-gradient-to-b from-[var(--accent)] via-[var(--accent)] to-transparent"
            style={{ scaleY: drawn }}
            aria-hidden="true"
          />

          {experience.map((item, i) => (
            <motion.div key={item.role} {...reveal(Math.min(i * 0.06, 0.2))} className="group relative pb-8 last:pb-0">
              <span className={`rail-dot -left-8 md:-left-10 ${item.current ? 'is-now' : ''}`} aria-hidden="true" />

              {item.featured ? (
                <div className="now-card card relative overflow-hidden p-6 md:p-7">
                  <div className="now-card-beam" aria-hidden="true" />
                  <div className="relative flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 mono text-[10px] tracking-[0.2em] text-[var(--accent)]">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
                      </span>
                      CURRENT ROLE
                    </span>
                    <span className="mono text-[11px] text-[var(--text-dim)]">{item.period}</span>
                  </div>
                  <h3 className="relative display text-4xl md:text-5xl text-white mt-5">
                    {item.role} <span className="serif text-[var(--text-dim)]">at</span> {item.org}
                  </h3>
                </div>
              ) : (
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mono text-[11px] text-[var(--text-faint)]">
                    {item.current && <span className="text-[var(--accent)]">NOW</span>}
                    <span>{item.period}</span>
                  </div>
                  <h3 className="display text-2xl text-white mt-2 group-hover:text-[var(--accent)] transition-colors">{item.role}</h3>
                  <p className="text-[var(--text-dim)] text-sm mt-1">{item.org}</p>
                  <ul className="mt-3 space-y-1.5">
                    {item.points.map((p, j) => (
                      <li key={j} className="text-[var(--text-faint)] text-sm leading-relaxed">
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* education + certs */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-28 lg:self-start">
          <motion.div {...reveal(0.05)} className="card p-6">
            <h3 className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-faint)] mb-4">Education</h3>
            <div className="space-y-4">
              {education.map((e) => (
                <div key={e.name} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white font-semibold text-[15px]">{e.name}</p>
                    <p className="text-[var(--text-faint)] text-[13px] mt-0.5">{e.org}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="mono text-[11px] text-[var(--text-dim)]">{e.period}</p>
                    <p className="mono text-[11px] text-[var(--accent)] mt-0.5">{e.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...reveal(0.1)} className="card p-6">
            <h3 className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-faint)] mb-4">Certifications</h3>
            <ul className="divide-y divide-[var(--line)]">
              {certifications.map((c) => (
                <li key={c.name} className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
                  <span className={`text-sm ${c.pending ? 'text-[var(--text-faint)]' : 'text-white'}`}>{c.name}</span>
                  <span className="mono text-[10px] text-[var(--text-faint)] text-right">{c.issuer}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ─── */
export function Contact() {
  const [topic, setTopic] = useState(contactTopics[0].id);
  const [copied, setCopied] = useState(false);
  const chosen = contactTopics.find((t) => t.id === topic);
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(chosen.subject)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the mailto button still works */
    }
  };

  return (
    <section id="contact" className="scroll-mt-24 pb-24">
      <motion.div {...reveal()} onMouseMove={trackSpot} className="card spotlight relative overflow-hidden p-7 md:p-14 rounded-[28px]">
        <div className="aurora opacity-70" aria-hidden="true">
          <span className="aurora-a" />
          <span className="aurora-b" />
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <span className="eyebrow">Get in touch</span>
            <h2 className="display text-5xl md:text-7xl mt-5 text-white">
              <MaskLine>Have something</MaskLine>
              <MaskLine delay={0.08}>
                <span className="serif text-[var(--accent)]">in mind?</span>
              </MaskLine>
            </h2>
            <p className="text-[var(--text-dim)] leading-relaxed mt-6 max-w-md">
              Tell me what you&apos;re working on, or get in touch about a role. I read everything and reply myself.
            </p>
          </div>

          <div className="lg:col-span-5">
            <fieldset>
              <legend className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-faint)] mb-3">I&apos;m interested in</legend>
              <div className="flex flex-wrap gap-2">
                {contactTopics.map((t) => {
                  const on = t.id === topic;
                  return (
                    <label key={t.id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="contact-topic"
                        value={t.id}
                        checked={on}
                        onChange={() => setTopic(t.id)}
                        className="peer sr-only"
                      />
                      <span
                        className={`inline-block text-sm px-4 py-2 rounded-full border transition-all duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent)] ${
                          on
                            ? 'bg-[var(--accent)] text-[var(--accent-ink)] border-transparent font-semibold'
                            : 'border-[var(--line-strong)] text-[var(--text-dim)] hover:text-white hover:border-white/30'
                        }`}
                      >
                        {t.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <a href={mailto} className="btn btn-primary btn-glow w-full justify-center mt-6 py-4 text-[15px]">
              Start the conversation
              <ArrowIcon className="w-4 h-4" />
            </a>

            <div className="grid grid-cols-3 gap-2 mt-2">
              <button type="button" onClick={copy} className="btn btn-ghost justify-center px-3 text-[13px]">
                {copied ? 'Copied' : 'Copy email'}
              </button>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost justify-center px-3 text-[13px]">
                LinkedIn
              </a>
              <Link href="/resume" className="btn btn-ghost justify-center px-3 text-[13px]">
                Resume
              </Link>
            </div>

            <p className="mono text-[11px] text-[var(--text-faint)] mt-4 text-center">{profile.email}</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
