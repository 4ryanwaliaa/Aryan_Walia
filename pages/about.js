import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CursorRing, MaskLine, ScrollProgress, Tilt, reveal } from '../components/fx';
import { VelocityMarquee } from '../components/ScrollFx';
import { ArrowIcon, GithubIcon, trackSpot } from '../components/shared';
import { profile, now, socials, personal } from '../components/portfolioData';
import board from '../components/pins.json';

const SITE_URL = 'https://4ryanwaliaa.github.io/Aryan_Walia/about/';

/* ─── What I am listening to, drawn live by my own endpoint (github.com/4ryanwalia) ─── */
function SpotifyLive() {
  const [stamp, setStamp] = useState(null);
  const [failed, setFailed] = useState(false);

  /* The card is rendered at request time, so re-requesting it is how it stays current. */
  useEffect(() => {
    setStamp(Date.now());
    const id = window.setInterval(() => {
      if (!document.hidden) setStamp(Date.now());
    }, 90000);
    return () => window.clearInterval(id);
  }, []);

  const src = `${socials.spotifyCard}${stamp ? `?t=${stamp}` : ''}`;

  return (
    <motion.div {...reveal()} onMouseMove={trackSpot} style={{ '--spot': '#1db95499' }} className="card spotlight relative overflow-hidden p-6 md:p-9">
      <div
        className="pointer-events-none absolute -top-40 -right-32 w-[28rem] h-[28rem] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(29,185,84,0.16), transparent 65%)' }}
        aria-hidden="true"
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5">
          <span className="inline-flex items-center gap-2.5 mono text-[11px] tracking-[0.2em] text-[#1db954]">
            <span className="eq" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            LIVE FROM SPOTIFY
          </span>
          <h2 className="display text-4xl md:text-5xl text-white mt-4">
            currently in <span className="serif text-[#1db954]">my ears.</span>
          </h2>
          <p className="text-[var(--text-dim)] leading-relaxed mt-4 max-w-sm">{personal.listening}</p>
          <a href={socials.spotify} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6">
            Open my Spotify
            <ArrowIcon className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="lg:col-span-7 flex items-center justify-center gap-0 sm:gap-2">
          {/* a record that never stops, half tucked behind the card */}
          <div className="vinyl hidden sm:block" aria-hidden="true" />
          <a
            href={socials.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-[1] block w-full max-w-[480px] rounded-[14px] overflow-hidden shadow-[0_30px_70px_-25px_rgba(0,0,0,0.95)] transition-transform duration-300 hover:-translate-y-1"
          >
            {failed ? (
              <span className="flex items-center justify-center aspect-[480/170] bg-[#111a2b] text-sm text-[var(--text-dim)] px-6 text-center">
                Spotify is not answering right now. Probably judging my playlist.
              </span>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={src}
                alt="What I am listening to on Spotify right now, or the last thing I played"
                width={480}
                height={170}
                className="block w-full h-auto"
                onError={() => setFailed(true)}
              />
            )}
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── The Pinterest board: my latest pins, pulled from the public feed at build time ─── */
function PinBoard() {
  const pins = board.pins || [];
  if (!pins.length) return null;

  return (
    <div className="pin-grid">
      {pins.map((pin, i) => (
        <motion.a
          key={pin.url}
          {...reveal(Math.min((i % 8) * 0.05, 0.35), 26)}
          href={pin.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open pin ${i + 1} on Pinterest`}
          className="pin group"
          style={{ '--tilt': `${((i * 37) % 5) - 2}deg` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pin.img}
            alt=""
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            width={pin.w || undefined}
            height={pin.h || undefined}
            style={pin.w && pin.h ? { aspectRatio: `${pin.w} / ${pin.h}` } : undefined}
          />
          <span className="pin-open">
            open on Pinterest
            <ArrowIcon className="w-3 h-3" />
          </span>
        </motion.a>
      ))}
    </div>
  );
}

const SOCIAL_ICONS = {
  instagram: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3h9A4.5 4.5 0 0121 7.5v9a4.5 4.5 0 01-4.5 4.5h-9A4.5 4.5 0 013 16.5v-9A4.5 4.5 0 017.5 3zM15.8 12a3.8 3.8 0 11-7.6 0 3.8 3.8 0 017.6 0zM17 7h.01" />
  ),
  pinterest: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM10 17.5l1.8-8M9.6 12.6c-.4-1.9.9-3.6 2.7-3.6 1.6 0 2.7 1.2 2.7 2.8 0 1.9-1.2 3.4-2.8 3.4-.6 0-1.1-.3-1.4-.7" />
  ),
  spotify: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM7.5 9.8c3-.9 6.4-.6 9 .9M8.3 12.6c2.4-.7 4.9-.4 6.9.8M9.1 15.2c1.7-.5 3.4-.3 4.8.6" />
  ),
  linkedin: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3.5h14A1.5 1.5 0 0120.5 5v14a1.5 1.5 0 01-1.5 1.5H5A1.5 1.5 0 013.5 19V5A1.5 1.5 0 015 3.5zM8 10.5V17M8 7.4v.1M11.5 10.5V17M11.5 13.2a2.3 2.3 0 014.6 0V17" />
  ),
};

export default function About() {
  return (
    <>
      <Head>
        <title>hi, i&apos;m aryan · About Aryan Walia</title>
        <meta name="description" content="The less professional page. Who Aryan Walia is when the report is filed: what he is listening to, what he pins, and a few opinions nobody asked for." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#08090a" />
        <meta property="og:title" content="hi, i'm aryan." />
        <meta property="og:description" content="The less professional page: music, moodboard and a few opinions nobody asked for." />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content="https://4ryanwaliaa.github.io/Aryan_Walia/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={SITE_URL} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ScrollProgress />
      <CursorRing />

      <div className="relative z-[2] min-h-screen overflow-x-clip">
        {/* ─── top bar ─── */}
        <header className="fixed top-0 inset-x-0 z-50 px-3 md:px-5 pt-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-3 pl-4 rounded-full bg-[#0d0e10]/80 backdrop-blur-xl border border-[var(--line-strong)]">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center display text-[13px] tracking-normal transition-transform duration-500 group-hover:rotate-[360deg]">
                AW
              </span>
              <span className="font-semibold tracking-tight hidden sm:block">Aryan Walia</span>
              <span className="mono text-[11px] text-[var(--text-faint)] hidden sm:block">/ about</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/" className="btn btn-ghost py-2 px-4 text-[13px]">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0l6 6m-6-6l6-6" />
                </svg>
                The work
              </Link>
              <Link href="/#contact" className="hidden sm:inline-flex btn btn-primary py-2 px-4 text-[13px]">
                Let&apos;s talk
              </Link>
            </div>
          </div>
        </header>

        {/* ─── hello ─── */}
        <section className="relative pt-36 md:pt-44 pb-16 overflow-hidden">
          <div className="aurora" aria-hidden="true">
            <span className="aurora-a" />
            <span className="aurora-b" />
            <span className="aurora-c" />
          </div>

          <div className="relative max-w-6xl mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <motion.p {...reveal()} className="mono text-[12px] text-[var(--text-faint)]">
                <span className="text-[var(--accent)]">$</span> cat about.txt
              </motion.p>
              <h1 className="display text-[3.6rem] leading-[0.92] sm:text-8xl lg:text-[7.5rem] text-white mt-5">
                <MaskLine>hi, i&apos;m</MaskLine>
                <MaskLine delay={0.08}>
                  <span className="serif text-[var(--accent)]">aryan.</span>
                  <span className="intro-caret" aria-hidden="true" />
                </MaskLine>
              </h1>
              <motion.p {...reveal(0.15)} className="serif text-2xl md:text-3xl text-white mt-8 max-w-xl leading-snug">
                {personal.tagline}
              </motion.p>
              <div className="mt-6 space-y-4 max-w-xl">
                {personal.bio.map((line, i) => (
                  <motion.p key={line} {...reveal(0.2 + i * 0.06)} className="text-[var(--text-dim)] text-lg leading-relaxed">
                    {line}
                  </motion.p>
                ))}
              </div>
            </div>

            {/* the badge */}
            <motion.div {...reveal(0.2)} className="lg:col-span-5">
              <Tilt max={9} className="[--tilt-r:24px]">
                <div className="badge">
                  <div className="badge-hole" aria-hidden="true" />
                  <div className="flex items-center justify-between mono text-[10px] tracking-[0.2em] text-[var(--text-faint)]">
                    <span>ACCESS BADGE</span>
                    <span className="text-[var(--accent)] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                      VERIFIED HUMAN
                    </span>
                  </div>
                  <p className="display text-4xl text-white mt-8">Aryan Walia</p>
                  <p className="mono text-[12px] text-[var(--accent)] mt-2">@{socials.handle}</p>
                  <dl className="mt-7 divide-y divide-[var(--line)]">
                    {[['day job', `${now.role}, ${now.org}`], ...personal.badge].map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-4 py-2.5">
                        <dt className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)] flex-shrink-0">{k}</dt>
                        <dd className="text-sm text-white text-right">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="barcode mt-6" aria-hidden="true" />
                </div>
              </Tilt>
            </motion.div>
          </div>
        </section>

        <VelocityMarquee baseVelocity={2.4} className="border-y border-[var(--line)] bg-[var(--surface)]/40 py-5">
          {personal.obsessions.map((t) => (
            <span key={t} className="display text-xl md:text-2xl text-[var(--text-faint)] px-6 flex items-center gap-6 whitespace-nowrap">
              {t}
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/60" />
            </span>
          ))}
        </VelocityMarquee>

        <main className="max-w-6xl mx-auto px-5 md:px-8">
          {/* ─── music ─── */}
          <section id="listening" className="scroll-mt-24 py-20 md:py-28">
            <SpotifyLive />
          </section>

          {/* ─── opinions ─── */}
          <section id="opinions" className="scroll-mt-24 pb-20 md:pb-28">
            <span className="eyebrow">Unprofessional opinions</span>
            <h2 className="display text-5xl md:text-7xl mt-5 text-white">
              <MaskLine>things i</MaskLine>
              <MaskLine delay={0.08}>
                <span className="serif text-[var(--accent)]">actually believe.</span>
              </MaskLine>
            </h2>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
              {personal.beliefs.map((line, i) => (
                <motion.li
                  key={line}
                  {...reveal((i % 2) * 0.06)}
                  onMouseMove={trackSpot}
                  className="card spotlight lift group p-6 md:p-7 flex gap-5 items-start"
                >
                  <span className="mono text-[11px] text-[var(--accent)] pt-1.5">{String(i + 1).padStart(2, '0')}</span>
                  <p className="display text-2xl md:text-[28px] leading-[1.1] text-white">{line}</p>
                </motion.li>
              ))}
            </ol>
          </section>

          {/* ─── moodboard ─── */}
          <section id="moodboard" className="scroll-mt-24 pb-20 md:pb-28">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <span className="eyebrow">The moodboard</span>
                <h2 className="display text-5xl md:text-7xl mt-5 text-white">
                  <MaskLine>straight from</MaskLine>
                  <MaskLine delay={0.08}>
                    <span className="serif text-[#ff5a66]">my Pinterest.</span>
                  </MaskLine>
                </h2>
              </div>
              <motion.div {...reveal(0.1)} className="max-w-sm">
                <p className="text-[var(--text-dim)] leading-relaxed">{personal.moodboard}</p>
                <a href={socials.pinterest} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-4">
                  Follow @{socials.handle}
                  <ArrowIcon className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            </div>
            <PinBoard />
            {board.fetched && (
              <p className="mono text-[11px] text-[var(--text-faint)] mt-5">
                {board.pins.length} latest pins, pulled from Pinterest on {board.fetched}. Tap one to open it there.
              </p>
            )}
          </section>

          {/* ─── where else ─── */}
          <section id="elsewhere" className="scroll-mt-24 pb-24">
            <span className="eyebrow">Same handle everywhere</span>
            <h2 className="display text-5xl md:text-7xl mt-5 text-white">
              <MaskLine>
                find <span className="serif text-[var(--accent)]">@{socials.handle}</span>
              </MaskLine>
            </h2>
            <motion.p {...reveal(0.08)} className="text-[var(--text-dim)] leading-relaxed mt-5 max-w-lg">
              {personal.handleJoke}
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-10">
              {socials.links.map((s, i) => (
                <motion.a
                  key={s.id}
                  {...reveal(i * 0.05)}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseMove={trackSpot}
                  style={{ '--spot': `${s.accent}99` }}
                  className="card spotlight lift group relative overflow-hidden p-6 flex flex-col justify-between min-h-[190px]"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                      style={{ background: `${s.accent}18`, border: `1px solid ${s.accent}40`, color: s.accent }}
                    >
                      {s.id === 'github' ? (
                        <GithubIcon className="w-5 h-5" />
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24" aria-hidden="true">
                          {SOCIAL_ICONS[s.id]}
                        </svg>
                      )}
                    </span>
                    <ArrowIcon className="w-4 h-4 text-[var(--text-faint)] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                  </div>
                  <div>
                    <p className="display text-2xl text-white">{s.name}</p>
                    <p className="text-[13px] text-[var(--text-dim)] leading-snug mt-1.5">{s.line}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            <motion.div {...reveal(0.1)} className="flex flex-wrap items-center gap-3 mt-12">
              <Link href="/" className="btn btn-primary btn-glow">
                Okay, show me the work
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>
              <a href={`mailto:${profile.email}`} className="btn btn-ghost">
                Say hi
              </a>
            </motion.div>
          </section>
        </main>

        <footer className="border-t border-[var(--line)]">
          <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <span className="mono text-[11px] text-[var(--text-faint)]">
              © {new Date().getFullYear()} Aryan Walia · {personal.footer}
            </span>
            <span className="text-[11px] text-[var(--text-faint)] max-w-md">
              This is a personal site. The projects and views here are my own and are not affiliated with or endorsed by my employer.
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
