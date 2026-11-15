import React from 'react';
import { motion } from 'framer-motion';
import { profile, now, proofs, proofsAsOf } from './portfolioData';
import { CountUp, MaskLine, reveal } from './fx';
import { ArrowIcon, StarIcon, trackSpot } from './shared';

/* Places a visitor can confirm I am who I say I am, without asking me. */
const VERIFY = [
  { label: 'LinkedIn', sub: 'Role and history', href: profile.linkedin },
  { label: 'Google Play', sub: 'Published apps', href: profile.playDeveloper },
  { label: 'GitHub', sub: 'Source code', href: profile.github },
  { label: 'bugsnaps.in', sub: 'Live products', href: profile.bugsnaps },
];

function ProofTile({ item, index }) {
  return (
    <motion.a
      {...reveal(0.05 + index * 0.05)}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={trackSpot}
      className="card spotlight group relative p-5 md:p-6 flex flex-col justify-between min-h-[150px] overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">{item.label}</span>
        <ArrowIcon className="w-3.5 h-3.5 text-[var(--text-faint)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
      </div>
      <div>
        <div className="display text-5xl md:text-6xl text-white flex items-baseline gap-1.5">
          {item.value ? (
            item.value
          ) : (
            <>
              <CountUp to={item.count} decimals={item.decimals || 0} />
              {item.suffix && <span className="text-[var(--accent)]">{item.suffix}</span>}
              {item.star && <StarIcon className="w-7 h-7 md:w-8 md:h-8 text-[#facc15] self-center" />}
            </>
          )}
        </div>
        <p className="text-[13px] text-[var(--text-dim)] mt-2 leading-snug">{item.note}</p>
      </div>
    </motion.a>
  );
}

export default function Proof() {
  return (
    <section id="proof" className="scroll-mt-24 py-24 md:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-7">
          <span className="eyebrow">Proof, not promises</span>
          <h2 className="display text-5xl md:text-7xl mt-5 text-white">
            <MaskLine>A real person.</MaskLine>
            <MaskLine delay={0.08}>
              <span className="serif text-[var(--accent)]">The real deal.</span>
            </MaskLine>
          </h2>
        </div>
        <motion.p {...reveal(0.1)} className="lg:col-span-5 lg:self-end text-[var(--text-dim)] leading-relaxed">
          Anyone can write a nice bio. So every claim on this page links to something you can open and check yourself: a store
          listing, a live product, a public repo or a profile.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* what I do right now */}
        <motion.div
          {...reveal()}
          onMouseMove={trackSpot}
          className="card spotlight now-card lg:col-span-5 relative overflow-hidden p-7 md:p-9 flex flex-col"
        >
          <div className="now-card-beam" aria-hidden="true" />
          <div className="relative flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--accent)]" />
            </span>
            <span className="mono text-[11px] tracking-[0.22em] text-[var(--accent)]">CURRENTLY</span>
          </div>

          <div className="relative mt-8">
            <p className="serif text-3xl md:text-4xl text-[var(--text-dim)]">{now.role} at</p>
            <p className="display text-6xl md:text-7xl lg:text-[5.5rem] text-white mt-1">
              {now.org}
              <span className="text-[var(--accent)]">.</span>
            </p>
            <p className="mono text-[12px] text-[var(--text-dim)] mt-4">{now.since}</p>
          </div>

          <p className="relative text-[var(--text-dim)] text-[15px] leading-relaxed mt-6 max-w-sm">{now.line}</p>

          <div className="relative mt-auto pt-8 grid grid-cols-2 gap-2">
            {VERIFY.map((v) => (
              <a
                key={v.label}
                href={v.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group/v rounded-2xl border border-[var(--line)] bg-black/25 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/[0.06] px-4 py-3 transition-colors"
              >
                <span className="flex items-center justify-between gap-2 text-sm font-semibold text-white">
                  {v.label}
                  <ArrowIcon className="w-3 h-3 text-[var(--text-faint)] group-hover/v:text-[var(--accent)] transition-colors" />
                </span>
                <span className="block mono text-[10px] text-[var(--text-faint)] mt-0.5">{v.sub}</span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* numbers anyone can verify */}
        <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-4">
          {proofs.map((item, i) => (
            <ProofTile key={item.label} item={item} index={i} />
          ))}
        </div>
      </div>

      <p className="mono text-[11px] text-[var(--text-faint)] mt-5">{proofsAsOf} Tap any tile to see the source.</p>
    </section>
  );
}
