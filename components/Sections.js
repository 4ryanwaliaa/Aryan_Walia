import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { trackSpot, ArrowIcon } from './ProjectExplorer';
import {
  profile,
  projects,
  capabilities,
  workflow,
  experience,
  education,
  certifications,
  contactTopics,
} from './portfolioData';

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
});

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

/* ─── WHAT I BUILD ─── */
export function Capabilities() {
  return (
    <section id="capabilities" className="scroll-mt-24 pb-24 md:pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
        <div className="lg:col-span-7">
          <span className="eyebrow">What I build</span>
          <h2 className="display text-5xl md:text-7xl mt-5 text-white">
            Ideas in.
            <br />
            <span className="serif text-[var(--accent)]">Secure products</span> out.
          </h2>
        </div>
        <p className="lg:col-span-5 lg:self-end text-[var(--text-dim)] leading-relaxed">
          Most builders ship first and think about security later. I come from the attacking side, so every site, app and model I
          build is tested the way an attacker would test it, before anyone else gets the chance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {capabilities.map((c, i) => (
          <motion.div
            key={c.id}
            {...reveal(i * 0.06)}
            onMouseMove={trackSpot}
            style={{ '--spot': `${c.accent}99` }}
            className="card spotlight group p-6 md:p-8 overflow-hidden"
          >
            <div
              className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ background: `radial-gradient(circle, ${c.accent}22, transparent 70%)` }}
            />
            <div className="relative flex items-start justify-between gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
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
              {c.proof.map((id) => {
                const p = projects.find((x) => x.id === id);
                const href = p.live || p.github;
                return (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-white hover:text-[var(--accent)] transition-colors"
                  >
                    {p.name}
                    <ArrowIcon className="w-3 h-3 opacity-60" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* how a build runs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mt-4 rounded-[20px] overflow-hidden border border-[var(--line)] bg-[var(--line)]">
        {workflow.map((s, i) => (
          <motion.div key={s.n} {...reveal(i * 0.06)} className="bg-[var(--surface)] p-5 md:p-6">
            <span className="mono text-[11px] text-[var(--accent)]">{s.n}</span>
            <h4 className="display text-xl text-white mt-3">{s.t}</h4>
            <p className="text-[var(--text-faint)] text-[13px] leading-relaxed mt-1.5">{s.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── EXPERIENCE + EDUCATION + CERTS ─── */
export function Journey() {
  return (
    <section id="journey" className="scroll-mt-24 pb-24 md:pb-32">
      <span className="eyebrow">Track record</span>
      <h2 className="display text-4xl md:text-6xl mt-5 mb-12 text-white">
        Where I&apos;ve <span className="serif text-[var(--accent)]">been.</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* experience */}
        <div className="lg:col-span-7">
          {experience.map((item, i) => (
            <motion.div
              key={item.role}
              {...reveal(Math.min(i * 0.06, 0.2))}
              className="group grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-2 sm:gap-6 py-6 border-t border-[var(--line)] first:border-t-0 first:pt-0"
            >
              <div className="mono text-[11px] text-[var(--text-faint)] pt-1.5 flex items-center gap-2 sm:block">
                {item.current && (
                  <span className="inline-flex sm:mb-2 items-center gap-1.5 text-[var(--accent)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                    NOW
                  </span>
                )}
                <div>{item.period}</div>
              </div>
              <div>
                <h3 className="display text-2xl text-white group-hover:text-[var(--accent)] transition-colors">{item.role}</h3>
                <p className="text-[var(--text-dim)] text-sm mt-1">{item.org}</p>
                <ul className="mt-3 space-y-1.5">
                  {item.points.map((p, j) => (
                    <li key={j} className="text-[var(--text-faint)] text-sm leading-relaxed">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* education + certs */}
        <div className="lg:col-span-5 space-y-4">
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
      <motion.div
        {...reveal()}
        onMouseMove={trackSpot}
        className="card spotlight relative overflow-hidden p-7 md:p-14 rounded-[28px]"
      >
        <div className="glow w-[36rem] h-[18rem] -top-40 -right-40" style={{ background: 'rgba(200,245,96,0.12)' }} />
        <div className="glow w-[28rem] h-[16rem] -bottom-40 -left-32" style={{ background: 'rgba(96,165,250,0.08)' }} />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <span className="eyebrow">Get in touch</span>
            <h2 className="display text-5xl md:text-7xl mt-5 text-white">
              Have something
              <br />
              <span className="serif text-[var(--accent)]">in mind?</span>
            </h2>
            <p className="text-[var(--text-dim)] leading-relaxed mt-6 max-w-md">
              Tell me what you&apos;re working on. I usually reply within a day.
            </p>
          </div>

          <div className="lg:col-span-5">
            <p className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-faint)] mb-3">I&apos;m interested in</p>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="What are you interested in?">
              {contactTopics.map((t) => {
                const on = t.id === topic;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setTopic(t.id)}
                    className={`text-sm px-4 py-2 rounded-full border transition-all duration-200 ${
                      on
                        ? 'bg-[var(--accent)] text-[var(--accent-ink)] border-transparent font-semibold'
                        : 'border-[var(--line-strong)] text-[var(--text-dim)] hover:text-white hover:border-white/30'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            <a href={mailto} className="btn btn-primary w-full justify-center mt-6 py-4 text-[15px]">
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
