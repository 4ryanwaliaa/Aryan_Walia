import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { profile, skillGroups, experience, certifications, availableRoles } from './portfolioData';

/* ─── SECTION HEADING ─── */
export function SectionHead({ eyebrow, title, sub }) {
  return (
    <div className="mb-8">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="display text-4xl md:text-5xl mt-3 text-white">{title}</h2>
      {sub && <p className="text-[var(--text-dim)] text-sm mt-3 max-w-xl leading-relaxed">{sub}</p>}
    </div>
  );
}

/* ─── ABOUT + SKILLS ─── */
export function AboutSkills() {
  const [tab, setTab] = useState(skillGroups[0].id);
  const group = skillGroups.find((g) => g.id === tab);

  const facts = [
    { k: 'Now', v: 'Network Engineer, Ogma Consulting' },
    { k: 'Also', v: 'Founder, BugSnaps — VAPT' },
    { k: 'Study', v: 'MCA Cyber Security, NMIMS' },
    { k: 'Base', v: profile.location },
  ];

  return (
    <section id="about" className="mb-28 scroll-mt-24">
      <SectionHead
        eyebrow="Who I am"
        title="Analyst who ships tools"
        sub="I work the alert queue, and I write the tooling that makes the queue manageable. The second half is what makes the first half repeatable."
      />

      <div className="grid lg:grid-cols-5 gap-4">
        {/* profile */}
        <div className="card lg:col-span-2 p-6 flex flex-col">
          <p className="text-[var(--text-dim)] text-sm leading-relaxed">{profile.summary}</p>

          <dl className="mt-6 space-y-3">
            {facts.map((f) => (
              <div key={f.k} className="flex gap-4 items-baseline">
                <dt className="mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-faint)] w-12 flex-shrink-0">{f.k}</dt>
                <dd className="text-[var(--text)] text-sm">{f.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-auto pt-6">
            <div className="rule mb-4" />
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
              </span>
              <span className="mono text-[11px] text-[var(--accent)]">{profile.availability}</span>
            </div>
          </div>
        </div>

        {/* skills */}
        <div className="card lg:col-span-3 p-6">
          <div className="flex flex-wrap gap-1.5 mb-5">
            {skillGroups.map((g) => {
              const isActive = tab === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setTab(g.id)}
                  aria-pressed={isActive}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-300"
                  style={{
                    background: isActive ? `${g.accent}16` : 'transparent',
                    borderColor: isActive ? `${g.accent}4d` : 'var(--line)',
                    color: isActive ? g.accent : 'var(--text-faint)',
                  }}
                >
                  {g.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-[var(--text-dim)] text-sm mb-4">{group.blurb}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((s, i) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.18, delay: i * 0.02 }}
                    className="mono text-[11px] px-2.5 py-1.5 rounded-md border cursor-default"
                    style={{ background: `${group.accent}0b`, borderColor: `${group.accent}26`, color: 'var(--text-dim)' }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ─── EXPERIENCE ─── */
export function Experience() {
  const tone = {
    work: '#22d3ee',
    founder: '#10b981',
    education: '#a78bfa',
  };

  return (
    <section id="experience" className="mb-28 scroll-mt-24">
      <SectionHead eyebrow="Track record" title="Where I've worked" />

      <div className="relative">
        <div className="absolute left-[5px] top-3 bottom-3 w-px bg-gradient-to-b from-[var(--accent)]/50 via-[var(--line-strong)] to-transparent" />

        <div className="space-y-4">
          {experience.map((item, i) => {
            const color = tone[item.kind];
            return (
              <motion.div
                key={`${item.role}-${i}`}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.25) }}
                className="relative pl-8"
              >
                <span className="absolute left-0 top-[22px] w-[11px] h-[11px] rounded-full ring-4 ring-[var(--bg)]" style={{ background: color }}>
                  {item.current && <span className="absolute inset-0 rounded-full animate-ping opacity-60" style={{ background: color }} />}
                </span>

                <div className="card p-5">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5 mb-3">
                    <div className="min-w-0">
                      <h3 className="text-white font-bold tracking-tight">{item.role}</h3>
                      <p className="text-sm mt-0.5" style={{ color }}>
                        {item.org}
                      </p>
                    </div>
                    <span className="mono text-[11px] text-[var(--text-faint)] whitespace-nowrap">{item.period}</span>
                  </div>

                  <ul className="space-y-2">
                    {item.points.map((p, j) => (
                      <li key={j} className="text-[var(--text-dim)] text-sm flex items-start gap-2.5 leading-relaxed">
                        <span className="mt-[7px] w-1 h-1 rounded-full flex-shrink-0" style={{ background: color }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── CERTIFICATIONS ─── */
export function Certifications() {
  return (
    <section id="certifications" className="mb-28 scroll-mt-24">
      <SectionHead eyebrow="Credentials" title="Certifications" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {certifications.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.25) }}
            className="card p-4 flex items-center gap-3.5"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: `${c.accent}14`, border: `1px solid ${c.accent}2b` }}
            >
              {c.icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-semibold text-[13px] leading-snug">{c.name}</h3>
              <p className="mono text-[10px] mt-1" style={{ color: c.pending ? 'var(--text-faint)' : c.accent }}>
                {c.issuer}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── CONTACT ─── */
export function Contact() {
  /* Internal routes go through next/link so the GitHub Pages basePath is applied —
     a bare <a href="/resume"> resolves to the domain root and 404s. */
  const externalCtas = [
    { label: 'Hire me', href: `mailto:${profile.email}?subject=Cybersecurity%20Opportunity`, primary: true },
    { label: 'LinkedIn', href: profile.linkedin },
    { label: 'Book a pentest', href: profile.bugsnaps },
  ];

  return (
    <section id="contact" className="mb-20 scroll-mt-24">
      <SectionHead
        eyebrow="What's next"
        title="Let's work together"
        sub="Open to SOC, security analyst, threat intelligence, VAPT and network security roles — plus freelance security assessments through BugSnaps."
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {availableRoles.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.2) }}
            className="card p-4"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-base mb-3"
              style={{ background: `${r.color}14`, border: `1px solid ${r.color}26` }}
            >
              {r.icon}
            </div>
            <h3 className="text-white font-semibold text-[13px]">{r.title}</h3>
            <p className="text-[var(--text-faint)] text-[11px] mt-1">{r.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="relative card p-8 md:p-12 text-center overflow-hidden"
      >
        <div className="glow w-80 h-40 -top-20 left-1/2 -translate-x-1/2" style={{ background: 'rgba(16,185,129,0.16)' }} />

        <div className="relative">
          <h3 className="display text-2xl md:text-3xl text-white">Interested in working together?</h3>
          <p className="text-[var(--text-dim)] text-sm mt-3 max-w-md mx-auto leading-relaxed">
            Whether it&apos;s a security role on your team or a penetration test for your product — I&apos;d like to hear about it.
          </p>

          <div className="flex flex-wrap justify-center gap-2.5 mt-8">
            {externalCtas.map((b) => (
              <a
                key={b.label}
                href={b.href}
                target={b.href.startsWith('http') ? '_blank' : undefined}
                rel={b.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`text-sm font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:scale-[1.03] ${
                  b.primary
                    ? 'bg-[var(--accent)] text-[#04120c]'
                    : 'bg-white/[0.06] hover:bg-white/[0.12] border border-[var(--line-strong)] text-white'
                }`}
              >
                {b.label}
              </a>
            ))}

            <Link
              href="/resume"
              className="text-sm font-semibold px-6 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-[var(--line-strong)] text-white transition-all duration-200 hover:scale-[1.03]"
            >
              Resume
            </Link>
          </div>

          <p className="mono text-[11px] text-[var(--text-faint)] mt-6">{profile.email}</p>
        </div>
      </motion.div>
    </section>
  );
}
