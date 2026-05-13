import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

/* ─── DATA ─── */
const securityProjects = [
  {
    id: 'inhouse', icon: '🛡️', category: 'Defensive Security',
    title: 'In-house Security Assessment & Monitoring',
    description: 'Contributed to an internal cybersecurity project focused on improving security visibility, endpoint assessment, and risk identification. Worked on security checks, vulnerability review, alert analysis, and reporting workflows.',
    highlights: [
      'Worked on internal security assessment workflows',
      'Identified endpoint and network-level security gaps',
      'Supported risk-based reporting and remediation planning',
      'Applied vulnerability assessment and defensive monitoring',
      'Improved security visibility and response readiness'
    ],
    stats: { category: 'Defensive', scope: 'Internal', status: 'Completed', risk: 'Mitigated' },
    tags: ['Vulnerability Assessment', 'Risk Scoring', 'Endpoint Security', 'Alert Analysis'],
    gradient: 'from-emerald-500 via-green-400 to-teal-500',
    glow: 'rgba(16,185,129,0.4)'
  },
  {
    id: 'phishing', icon: '🎯', category: 'Authorized Simulation',
    title: 'Internal Phishing Simulation & Awareness',
    description: 'Planned and supported an authorized phishing simulation campaign to evaluate employee awareness and improve phishing resilience. Designed for defensive awareness, not harmful activity.',
    highlights: [
      'Created controlled phishing simulation campaign',
      'Identified users who interacted with simulated emails',
      'Captured metrics: opens, clicks, visits, training completion',
      'Delivered post-campaign educational content and quizzes',
      'Improved employee phishing detection behavior'
    ],
    stats: { type: 'Authorized', objective: 'Awareness', data: 'Clicks & Opens', outcome: 'Improved' },
    tags: ['Phishing Simulation', 'Security Awareness', 'Metrics', 'Email Security'],
    gradient: 'from-cyan-500 via-blue-400 to-indigo-500',
    glow: 'rgba(6,182,212,0.4)'
  }
];

const availableRoles = [
  { icon: '🖥️', title: 'SOC Analyst', desc: 'Monitoring & incident response', color: '#10b981' },
  { icon: '🔍', title: 'Security Analyst', desc: 'Threat analysis & operations', color: '#06b6d4' },
  { icon: '🧠', title: 'Threat Intelligence', desc: 'Hunting & intelligence', color: '#8b5cf6' },
  { icon: '🛡️', title: 'Vulnerability Assessment', desc: 'Scanning & risk evaluation', color: '#f59e0b' },
  { icon: '🎯', title: 'Phishing Awareness', desc: 'Simulation & education', color: '#ef4444' },
  { icon: '⚙️', title: 'Security Automation', desc: 'Python tools & scripts', color: '#3b82f6' },
  { icon: '📄', title: 'Cyber Documentation', desc: 'Policies & compliance', color: '#14b8a6' },
  { icon: '🔧', title: 'Security Tools Dev', desc: 'Custom tool building', color: '#d946ef' }
];

const ctaButtons = [
  { label: '💼 Hire Me', href: 'mailto:4ryanwalia@gmail.com?subject=Cybersecurity%20Opportunity', bg: 'from-emerald-600 to-green-700' },
  { label: '🔗 Connect on LinkedIn', href: 'https://www.linkedin.com/in/aryan-w-96aa551bb/', bg: 'from-blue-600 to-blue-800' },
  { label: '💬 Discuss a Project', href: 'mailto:4ryanwalia@gmail.com?subject=Project%20Discussion', bg: 'from-purple-600 to-violet-700' },
  { label: '📄 View Resume', href: '/resume', bg: 'from-cyan-600 to-teal-700' }
];

/* ─── 3D TILT CARD ─── */
function TiltCard({ children, className = '', glowColor = 'rgba(0,255,136,0.15)' }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouse = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={className}
    >
      {children}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: useTransform(
            [x, y],
            ([latestX, latestY]) =>
              `radial-gradient(circle at ${(latestX + 0.5) * 100}% ${(latestY + 0.5) * 100}%, ${glowColor}, transparent 60%)`
          )
        }}
      />
    </motion.div>
  );
}

/* ─── ANIMATED COUNTER ─── */
function AnimCounter({ label, value, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, rotateX: -40 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">{label}</div>
      <div className="text-base font-bold" style={{ color }}>{value}</div>
    </motion.div>
  );
}

/* ─── HEXAGON STATUS BADGE ─── */
function HexBadge({ text, color }) {
  return (
    <div className="relative inline-flex items-center gap-2 px-3 py-1.5">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: color }}></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: color }}></span>
      </span>
      <span className="text-xs font-mono tracking-wider" style={{ color }}>{text}</span>
    </div>
  );
}

/* ─── MAIN SECURITY SECTION ─── */
export function PracticalSecuritySection() {
  return (
    <section id="security-work" className="mb-20 scroll-reveal" style={{ perspective: '1200px' }}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 text-center"
      >
        <motion.div
          initial={{ scale: 0, rotateZ: -180 }}
          whileInView={{ scale: 1, rotateZ: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl"
          style={{ boxShadow: '0 0 40px rgba(16,185,129,0.3), 0 0 80px rgba(16,185,129,0.1)' }}
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </motion.div>

        <h2 className="text-4xl md:text-5xl font-extrabold mb-3">
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Practical Cybersecurity Work
          </span>
        </h2>
        <p className="text-gray-400 text-base max-w-2xl mx-auto">
          Security Operations · Threat Detection · Defensive Security · Authorized Testing
        </p>

        {/* Status Bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-5 inline-flex items-center gap-4 bg-black/60 backdrop-blur-sm rounded-full px-6 py-2.5 border border-emerald-500/20"
        >
          <HexBadge text="SYSTEMS SECURE" color="#10b981" />
          <span className="text-gray-600">|</span>
          <span className="text-gray-400 text-xs font-mono">AUTHORIZED ACTIVITIES ONLY</span>
        </motion.div>
      </motion.div>

      {/* Project Cards - 3D Tilt */}
      <div className="space-y-8">
        {securityProjects.map((project, idx) => (
          <TiltCard
            key={project.id}
            glowColor={project.glow}
            className="relative rounded-2xl bg-gradient-to-br from-[#111318] via-[#15171c] to-[#111318] border border-gray-800/60 overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 p-6 md:p-8"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${project.gradient}`}></div>

              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6" style={{ transform: 'translateZ(20px)' }}>
                <div className="flex items-center gap-4 flex-1">
                  <motion.span
                    className="text-4xl"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.5 }}
                  >
                    {project.icon}
                  </motion.span>
                  <div>
                    <span className={`text-[10px] uppercase tracking-[0.25em] font-semibold bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
                      {project.category}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-white mt-0.5">{project.title}</h3>
                  </div>
                </div>
                <HexBadge text="VERIFIED" color="#10b981" />
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6" style={{ transform: 'translateZ(15px)' }}>
                {project.description}
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-black/40 rounded-xl border border-gray-800/40" style={{ transform: 'translateZ(25px)' }}>
                {Object.entries(project.stats).map(([key, val], i) => (
                  <AnimCounter key={key} label={key} value={val} color={project.glow.replace('0.4', '1')} delay={0.1 * i} />
                ))}
              </div>

              {/* Highlights */}
              <div className="mb-5" style={{ transform: 'translateZ(10px)' }}>
                <h4 className={`text-xs font-bold uppercase tracking-widest mb-3 bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
                  ▸ Key Highlights
                </h4>
                <ul className="space-y-2">
                  {project.highlights.map((h, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.05 * i, duration: 0.4 }}
                      className="text-gray-300 text-sm flex items-start gap-2.5"
                    >
                      <span className="text-emerald-400 mt-0.5 flex-shrink-0 text-base">›</span>
                      {h}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2" style={{ transform: 'translateZ(15px)' }}>
                {project.tags.map((tag, i) => (
                  <motion.span
                    key={i}
                    whileHover={{ scale: 1.08, y: -2 }}
                    className="bg-white/[0.04] text-gray-300 text-xs px-3.5 py-1.5 rounded-full border border-white/[0.08] hover:border-emerald-500/30 hover:text-emerald-300 transition-colors duration-300 cursor-default backdrop-blur-sm"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </TiltCard>
        ))}
      </div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex items-center gap-3 justify-center bg-emerald-500/[0.06] rounded-xl px-6 py-3.5 border border-emerald-500/10"
      >
        <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <p className="text-gray-300 text-sm">
          All security activities were conducted in an <span className="text-emerald-400 font-semibold">authorized, controlled, and defensive</span> environment.
        </p>
      </motion.div>
    </section>
  );
}

/* ─── AVAILABLE FOR SECTION ─── */
export function AvailableForSection() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section id="available" className="mb-20 scroll-reveal" style={{ perspective: '1200px' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.5 }}
          className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl relative"
          style={{ boxShadow: '0 0 40px rgba(6,182,212,0.3), 0 0 80px rgba(6,182,212,0.1)' }}
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {/* Green dot */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-[#0a0a0a]"></span>
          </span>
        </motion.div>

        <h2 className="text-4xl md:text-5xl font-extrabold mb-3">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">
            Available For
          </span>
        </h2>
        <p className="text-gray-400 text-base max-w-2xl mx-auto">
          Open to cybersecurity roles, SOC analyst opportunities, security analyst positions, 
          threat intelligence work, and freelance cybersecurity support.
        </p>
      </motion.div>

      {/* Role Cards - 3D Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
        {availableRoles.map((role, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30, rotateX: -20 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{
              y: -10,
              rotateY: 5,
              rotateX: -5,
              scale: 1.04,
              transition: { duration: 0.25 }
            }}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="relative group rounded-xl p-5 border border-gray-800/50 cursor-default overflow-hidden"
            style={{
              transformStyle: 'preserve-3d',
              background: hoveredIdx === idx
                ? `linear-gradient(135deg, ${role.color}08, ${role.color}15)`
                : 'linear-gradient(135deg, #111318, #0d0f14)',
              boxShadow: hoveredIdx === idx
                ? `0 20px 40px -10px ${role.color}25, 0 0 0 1px ${role.color}30`
                : 'none',
              transition: 'background 0.3s, box-shadow 0.3s'
            }}
          >
            {/* Glow backdrop */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
              style={{ background: `radial-gradient(circle at 50% 0%, ${role.color}15, transparent 70%)` }}
            />

            <div className="relative z-10" style={{ transform: 'translateZ(10px)' }}>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 text-xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${role.color}18`, border: `1px solid ${role.color}25` }}
              >
                {role.icon}
              </div>
              <h3 className="text-white font-bold text-sm mb-1">{role.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{role.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: -10 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative rounded-2xl p-8 md:p-10 overflow-hidden text-center border border-gray-800/40"
        style={{
          background: 'linear-gradient(135deg, #0d1117 0%, #111827 50%, #0d1117 100%)',
          boxShadow: '0 0 60px rgba(6,182,212,0.05)'
        }}
      >
        {/* Decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-b from-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <h3 className="text-white text-2xl font-bold mb-2 relative z-10">Interested in working together?</h3>
        <p className="text-gray-400 text-sm mb-8 relative z-10 max-w-lg mx-auto">
          Let&apos;s connect and discuss how I can contribute to your security goals and team.
        </p>

        <div className="flex flex-wrap justify-center gap-3 relative z-10">
          {ctaButtons.map((btn, idx) => (
            <motion.a
              key={idx}
              href={btn.href}
              target={btn.href.startsWith('http') ? '_blank' : undefined}
              rel={btn.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              whileHover={{ scale: 1.06, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className={`cta-btn bg-gradient-to-r ${btn.bg} text-white font-semibold text-sm px-7 py-3.5 rounded-full shadow-lg transition-shadow duration-300 hover:shadow-2xl`}
            >
              {btn.label}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
