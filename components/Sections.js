import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { profile, skillGroups, experience, certifications, availableRoles } from './portfolioData';

/* ─── SECTION HEADING ─── */
export function SectionHead({ eyebrow, title, sub, gradient = 'from-cyan-400 via-blue-400 to-purple-400' }) {
  return (
    <div className="mb-8">
      <span className="text-[11px] uppercase tracking-[0.3em] text-cyan-400 font-semibold">{eyebrow}</span>
      <h2 className="text-3xl md:text-4xl font-extrabold mt-2">
        <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{title}</span>
      </h2>
      {sub && <p className="text-gray-400 text-sm mt-2 max-w-2xl">{sub}</p>}
    </div>
  );
}

/* ─── ABOUT + SKILLS (tabbed, replaces three long pill rows) ─── */
export function AboutSkills() {
  const [tab, setTab] = useState(skillGroups[0].id);
  const group = skillGroups.find((g) => g.id === tab);

  return (
    <section id="about" className="mb-24 scroll-mt-24">
      <SectionHead
        eyebrow="Who I am"
        title="Analyst who ships tools"
        sub="I work the alert queue and I write the tooling — the second half is what makes the first half repeatable."
      />

      <div className="grid lg:grid-cols-5 gap-5">
        {/* profile card */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-800/70 bg-[#0e1014] p-6 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500" />
          <p className="text-gray-300 text-sm leading-relaxed">{profile.summary}</p>

          <div className="mt-5 space-y-2.5">
            {[
              { k: 'Now', v: 'Network Engineer @ Ogma Consulting' },
              { k: 'Also', v: 'Founder @ BugSnaps (VAPT)' },
              { k: 'Education', v: 'MCA Cyber Security — NMIMS' },
              { k: 'Based', v: profile.location },
            ].map((row) => (
              <div key={row.k} className="flex gap-3 text-sm">
                <span className="text-gray-500 w-20 flex-shrink-0">{row.k}</span>
                <span className="text-gray-200">{row.v}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-white/[0.07] flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-green-400 text-xs font-medium">{profile.availability}</span>
          </div>
        </div>

        {/* skills tabs */}
        <div className="lg:col-span-3 rounded-2xl border border-gray-800/70 bg-[#0e1014] p-6 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2px] transition-colors duration-500" style={{ background: group.accent }} />

          <div className="flex flex-wrap gap-2 mb-5">
            {skillGroups.map((g) => {
              const isActive = tab === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setTab(g.id)}
                  aria-pressed={isActive}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-300"
                  style={{
                    background: isActive ? `${g.accent}1a` : 'transparent',
                    borderColor: isActive ? `${g.accent}55` : 'rgba(255,255,255,0.07)',
                    color: isActive ? g.accent : '#8b93a1',
                  }}
                >
                  <span className="mr-1.5">{g.icon}</span>
                  {g.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <p className="text-gray-400 text-sm mb-4">{group.blurb}</p>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((s, i) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.025 }}
                    className="text-xs px-3 py-1.5 rounded-full border transition-colors duration-300 cursor-default"
                    style={{
                      background: `${group.accent}0d`,
                      borderColor: `${group.accent}26`,
                      color: '#d1d5db',
                    }}
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

/* ─── EXPERIENCE (compact, no giant timeline) ─── */
export function Experience() {
  const kindStyle = {
    work: { color: '#06b6d4', label: 'Role' },
    founder: { color: '#10b981', label: 'Venture' },
    education: { color: '#8b5cf6', label: 'Education' },
  };

  return (
    <section id="experience" className="mb-24 scroll-mt-24">
      <SectionHead eyebrow="Track record" title="Where I've worked" gradient="from-emerald-400 via-cyan-400 to-blue-400" />

      <div className="relative">
        {/* spine */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-500/60 via-emerald-500/40 to-transparent" />

        <div className="space-y-5">
          {experience.map((item, i) => {
            const style = kindStyle[item.kind];
            return (
              <motion.div
                key={`${item.role}-${i}`}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.07, 0.3) }}
                className="relative pl-8"
              >
                {/* dot */}
                <span
                  className="absolute left-0 top-2 w-[15px] h-[15px] rounded-full border-[3px] border-[#0a0a0a]"
                  style={{ background: style.color }}
                >
                  {item.current && (
                    <span className="absolute inset-0 rounded-full animate-ping opacity-60" style={{ background: style.color }} />
                  )}
                </span>

                <div className="rounded-xl border border-gray-800/70 bg-[#0e1014] p-5 hover:border-gray-700 transition-colors duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl flex-shrink-0">{item.icon}</span>
                      <div className="min-w-0">
                        <h3 className="text-white font-bold leading-tight">{item.role}</h3>
                        <p className="text-sm truncate" style={{ color: style.color }}>
                          {item.org}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-gray-500 bg-black/50 px-2.5 py-1 rounded-full whitespace-nowrap w-fit">
                      {item.period}
                    </span>
                  </div>

                  <ul className="space-y-1.5 mt-3">
                    {item.points.map((p, j) => (
                      <li key={j} className="text-gray-400 text-sm flex items-start gap-2 leading-relaxed">
                        <span className="mt-0.5 flex-shrink-0" style={{ color: style.color }}>
                          ›
                        </span>
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
    <section id="certifications" className="mb-24 scroll-mt-24">
      <SectionHead eyebrow="Credentials" title="Certifications" gradient="from-amber-400 via-orange-400 to-rose-400" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {certifications.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.3) }}
            whileHover={{ y: -4 }}
            className="rounded-xl border border-gray-800/70 bg-[#0e1014] p-4 flex items-center gap-3.5 hover:border-gray-700 transition-colors duration-300"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${c.accent}18`, border: `1px solid ${c.accent}30` }}
            >
              {c.icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-semibold text-sm leading-tight">{c.name}</h3>
              <p className="text-xs mt-0.5" style={{ color: c.pending ? '#9ca3af' : c.accent }}>
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
  return (
    <section id="contact" className="mb-16 scroll-mt-24">
      <SectionHead
        eyebrow="What's next"
        title="Let's work together"
        sub="Open to SOC, security analyst, threat intelligence, VAPT and network security roles — plus freelance security assessments through BugSnaps."
        gradient="from-cyan-400 via-blue-400 to-purple-400"
      />

      {/* roles */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {availableRoles.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.25) }}
            whileHover={{ y: -4 }}
            className="rounded-xl border border-gray-800/70 bg-[#0e1014] p-4 hover:border-gray-700 transition-colors duration-300"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg mb-2.5"
              style={{ background: `${r.color}18`, border: `1px solid ${r.color}28` }}
            >
              {r.icon}
            </div>
            <h3 className="text-white font-semibold text-sm">{r.title}</h3>
            <p className="text-gray-500 text-xs mt-0.5">{r.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl border border-gray-800/70 p-8 md:p-10 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1117 0%, #111827 50%, #0d1117 100%)' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <h3 className="text-white text-2xl font-bold mb-2">Interested in working together?</h3>
          <p className="text-gray-400 text-sm mb-7 max-w-lg mx-auto">
            Whether it&apos;s a security role on your team or a penetration test for your product — I&apos;d like to hear about it.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: '💼 Hire Me', href: `mailto:${profile.email}?subject=Cybersecurity%20Opportunity`, bg: 'from-emerald-600 to-green-700' },
              { label: '🔗 LinkedIn', href: profile.linkedin, bg: 'from-blue-600 to-blue-800' },
              { label: '🐞 Book a Pentest', href: profile.bugsnaps, bg: 'from-emerald-600 to-teal-700' },
              { label: '📄 Resume', href: '/resume', bg: 'from-cyan-600 to-teal-700' },
            ].map((b) => (
              <motion.a
                key={b.label}
                href={b.href}
                target={b.href.startsWith('http') ? '_blank' : undefined}
                rel={b.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`bg-gradient-to-r ${b.bg} text-white font-semibold text-sm px-6 py-3 rounded-full shadow-lg`}
              >
                {b.label}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
