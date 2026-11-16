import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { reveal } from './fx';
import SectionHead from './SectionHead';
import { ArrowIcon } from './shared';
import {
  profile,
  experience,
  education,
  certifications,
  contactTopics,
} from './portfolioData';

/* ─── EXPERIENCE + EDUCATION + CERTS ─── */
export function Journey() {
  const railRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: railRef, offset: ['start 75%', 'end 55%'] });
  const drawn = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <section id="journey" className="scroll-mt-20 pb-24 md:pb-32">
      <SectionHead index="04" title="Experience" line="Where I have worked, what I studied, and the certifications behind the work." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* experience: a rail that draws itself as you scroll */}
        <div ref={railRef} className="lg:col-span-7 relative pl-8 md:pl-10">
          <div className="absolute left-[5px] top-3 bottom-3 w-px bg-[var(--line-strong)]" aria-hidden="true" />
          <motion.div
            className="absolute left-[5px] top-3 bottom-3 w-px origin-top bg-[var(--line-strong)]"
            style={{ scaleY: drawn }}
            aria-hidden="true"
          />

          {experience.map((item, i) => (
            <motion.div key={item.role} {...reveal(Math.min(i * 0.06, 0.2))} className="group relative pb-8 last:pb-0">
              <span className={`rail-dot -left-8 md:-left-10 ${item.current ? 'is-now' : ''}`} aria-hidden="true" />

              {item.featured ? (
                <div className="now-card card relative overflow-hidden p-6 md:p-7">
                  <div className="now-card-perf" aria-hidden="true" />
                  <div className="relative flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 mono text-[10px] tracking-[0.2em] text-[var(--accent)]">
                      <span className="relative flex h-2 w-2">
                        <span className="relative inline-flex h-2 w-2 bg-[var(--accent)]" />
                      </span>
                      CURRENT ROLE
                    </span>
                    <span className="mono text-[11px] text-[var(--text-dim)]">{item.period}</span>
                  </div>
                  <h3 className="relative display text-4xl md:text-5xl text-[var(--text)] mt-5">
                    {item.role} <span className="font-medium text-[var(--text-dim)]">at</span> {item.org}
                  </h3>
                </div>
              ) : (
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mono text-[11px] text-[var(--text-faint)]">
                    {item.current && <span className="text-[var(--accent)]">NOW</span>}
                    <span>{item.period}</span>
                  </div>
                  <h3 className="display text-2xl text-[var(--text)] mt-2 group-hover:text-[var(--accent)] transition-colors">{item.role}</h3>
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
                    <p className="text-[var(--text)] font-semibold text-[15px]">{e.name}</p>
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
                  <span className={`text-sm ${c.pending ? 'text-[var(--text-faint)]' : 'text-[var(--text)]'}`}>{c.name}</span>
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
      <motion.div {...reveal()} className="card relative overflow-hidden p-7 md:p-14 rounded-[2px]">

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <p className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--text-faint)]">05 · Contact</p>
            <h2 className="display text-5xl md:text-7xl mt-5 text-[var(--text)]">Have something in mind?</h2>
            <p className="lede mt-6 max-w-md">
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
                        className={`inline-block text-sm px-3.5 py-2 rounded-[2px] border transition-all duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent)] ${
                          on
                            ? 'bg-[var(--accent)] text-[var(--accent-ink)] border-transparent font-semibold'
                            : 'border-[var(--line-strong)] text-[var(--text-dim)] hover:text-[var(--text)] hover:border-[var(--line-strong)]'
                        }`}
                      >
                        {t.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

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
