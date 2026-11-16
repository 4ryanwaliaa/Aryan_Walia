import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Crosshair, ScrollProgress, reveal } from '../components/fx';
import { ArrowIcon, GithubIcon, videoUrl } from '../components/shared';
import SectionHead from '../components/SectionHead';
import PinSheet from '../components/PinSheet';
import { profile, socials, personal } from '../components/portfolioData';
import board from '../components/pins.json';
import social from '../components/social.json';

const SITE_URL = 'https://4ryanwaliaa.github.io/Aryan_Walia/about/';

const ICONS = {
  instagram: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3h9A4.5 4.5 0 0121 7.5v9a4.5 4.5 0 01-4.5 4.5h-9A4.5 4.5 0 013 16.5v-9A4.5 4.5 0 017.5 3zM15.8 12a3.8 3.8 0 11-7.6 0 3.8 3.8 0 017.6 0zM17 7h.01" />
  ),
  pinterest: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM10 17.5l1.8-8M9.6 12.6c-.4-1.9.9-3.6 2.7-3.6 1.6 0 2.7 1.2 2.7 2.8 0 1.9-1.2 3.4-2.8 3.4-.6 0-1.1-.3-1.4-.7" />
  ),
  spotify: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM7.5 9.8c3-.9 6.4-.6 9 .9M8.3 12.6c2.4-.7 4.9-.4 6.9.8M9.1 15.2c1.7-.5 3.4-.3 4.8.6" />
  ),
  youtube: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 8.2c.2-1.5 1.3-2.5 2.8-2.6C8 5.4 10 5.3 12 5.3s4 .1 5.7.3c1.5.1 2.6 1.1 2.8 2.6.2 1.3.2 2.5.2 3.8s0 2.5-.2 3.8c-.2 1.5-1.3 2.5-2.8 2.6-1.7.2-3.7.3-5.7.3s-4-.1-5.7-.3c-1.5-.1-2.6-1.1-2.8-2.6C3.3 14.5 3.3 13.3 3.3 12s0-2.5.2-3.8zM10.3 9.4v5.2l4.5-2.6z" />
  ),
};

function SocialIcon({ id, className = 'w-5 h-5' }) {
  if (id === 'github') return <GithubIcon className={className} />;
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24" aria-hidden="true">
      {ICONS[id]}
    </svg>
  );
}

/* ─── Music: drawn live by my own endpoint ─── */
function SpotifyLive() {
  const [stamp, setStamp] = useState(null);
  const [failed, setFailed] = useState(false);

  /* the card is rendered when it is requested, so asking again is how it stays current */
  useEffect(() => {
    setStamp(Date.now());
    const id = window.setInterval(() => {
      if (!document.hidden) setStamp(Date.now());
    }, 90000);
    return () => window.clearInterval(id);
  }, []);

  const src = `${socials.spotifyCard}${stamp ? `?t=${stamp}` : ''}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" {...reveal()}>
      <div className="lg:col-span-5">
        <span className="inline-flex items-center gap-2.5 mono text-[11px] tracking-[0.2em] text-[#0f7a3f]">
          <span className="eq" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          LIVE FROM SPOTIFY
        </span>
        <p className="lede mt-4 max-w-sm">{personal.listening}</p>
        <a href={socials.spotify} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6">
          <SocialIcon id="spotify" className="w-4 h-4" />
          Open my Spotify
        </a>
      </div>
      <div className="lg:col-span-7 flex items-center justify-center">
        <div className="vinyl hidden sm:block" aria-hidden="true" />
        <a
          href={socials.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-[1] block w-full max-w-[480px] rounded-[2px] overflow-hidden border border-[var(--text)] shadow-[6px_6px_0_0_var(--text)] transition-[translate,box-shadow] duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_0_#0f7a3f]"
        >
          {failed ? (
            <span className="flex items-center justify-center aspect-[480/170] bg-[var(--surface-2)] text-sm text-[var(--text-dim)] px-6 text-center">
              Spotify is not responding right now. Try again in a minute.
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
  );
}

/* ─── Videos: the latest uploads on my channel, fetched at build time ─── */
function Videos() {
  const seen = new Set();
  const videos = (social.youtube?.videos || []).filter((v) => {
    const key = v.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (!videos.length) return null;

  return (
    <div className="video-row no-scrollbar" role="list">
      {videos.map((v, i) => (
        <a
          key={v.id}
          role="listitem"
          href={videoUrl(v.id)}
          target="_blank"
          rel="noopener noreferrer"
          className={`video-card ${i === 0 ? 'is-first' : ''}`}
          {...reveal()}
        >
          <span className="video-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" />
            <span className="video-play" aria-hidden="true">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 4.5v15l13-7.5z" />
              </svg>
            </span>
          </span>
          <span className="block display text-xl leading-tight text-[var(--text)] mt-3">{v.title}</span>
          <span className="block mono text-[10px] text-[var(--text-faint)] mt-1.5">{v.published}</span>
        </a>
      ))}
    </div>
  );
}

/* ─── Code: my most recently pushed public repositories ─── */
function Repos() {
  const gh = social.github;
  if (!gh) return null;
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-[var(--line-strong)]">
      {gh.repos.map((r) => (
        <li key={r.name} className="border-r border-b border-[var(--line-strong)]" {...reveal()}>
          <a href={r.url} target="_blank" rel="noopener noreferrer" className="repo group">
            <span className="flex items-center justify-between gap-3">
              <span className="display text-2xl text-[var(--text)] group-hover:text-[var(--accent)] transition-colors truncate">{r.name.replace(/-+/g, ' ')}</span>
              <ArrowIcon className="w-3.5 h-3.5 text-[var(--text-faint)] flex-shrink-0" />
            </span>
            {r.desc && <span className="block text-[14px] text-[var(--text-dim)] leading-relaxed mt-2 line-clamp-2">{r.desc}</span>}
            <span className="flex items-center gap-4 mono text-[10px] tracking-[0.08em] text-[var(--text-faint)] mt-4">
              {r.lang && <span className="text-[var(--text-dim)]">{r.lang}</span>}
              {r.pushed && <span>pushed {r.pushed}</span>}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function About() {
  const gh = social.github;
  const links = socials.links;

  return (
    <>
      <Head>
        <title>hi, i&apos;m aryan · About Aryan Walia</title>
        <meta name="description" content="The personal page. What Aryan Walia is listening to, the videos he makes, the code he pushes and the photos he posts." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#eae7df" />
        <meta property="og:title" content="hi, i'm aryan." />
        <meta property="og:description" content="Music, videos, code and photos. Same handle everywhere: @4ryanwalia." />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content="https://4ryanwaliaa.github.io/Aryan_Walia/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={SITE_URL} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ScrollProgress />
      <Crosshair />
      <div className="ambient" aria-hidden="true" />

      <div className="relative z-[2] min-h-screen overflow-x-clip">
        <header className="fixed top-0 inset-x-0 z-50 bg-[var(--bg)] border-b border-[var(--line-strong)]">
          <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4 md:px-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="w-8 h-8 rounded-[2px] bg-[var(--text)] text-[var(--bg)] flex items-center justify-center mono text-[11px] font-semibold tracking-tight transition-colors duration-200 group-hover:bg-[var(--accent)]">
                AW
              </span>
              <span className="font-bold tracking-tight hidden sm:block">Aryan Walia</span>
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

        {/* ─── hello, and where to find me ─── */}
        <section className="relative pt-28 md:pt-36 pb-6">
          <div className="max-w-6xl mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <h1 className="display text-[3.6rem] leading-[0.9] sm:text-8xl lg:text-[7rem] text-[var(--text)]">
                hi, i&apos;m <span className="text-[var(--accent)]">aryan.</span>
              </h1>
              <p className="serif text-2xl md:text-3xl text-[var(--text)] mt-8 max-w-xl leading-snug">{personal.tagline}</p>
              <div className="mt-6 space-y-4 max-w-xl">
                {personal.bio.map((line) => (
                  <p key={line} className="lede">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* one handle, every platform */}
            <aside className="lg:col-span-5 handles" aria-label="Where to find me">
              <div className="flex items-center gap-4 p-5 border-b border-[var(--line-strong)]">
                {gh?.avatar && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={gh.avatar} alt="Aryan Walia" width={56} height={56} className="w-14 h-14 border border-[var(--text)] bg-[var(--surface-2)]" />
                )}
                <div className="min-w-0">
                  <p className="display text-2xl text-[var(--text)]">@{socials.handle}</p>
                  <p className="mono text-[10px] tracking-[0.12em] uppercase text-[var(--text-faint)] mt-1">same handle everywhere</p>
                </div>
              </div>
              <ul>
                {links.map((s) => (
                  <li key={s.id}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="handle-row group" style={{ '--hc': s.accent }}>
                      <span className="handle-icon">
                        <SocialIcon id={s.id} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold text-[var(--text)]">{s.name}</span>
                        <span className="block text-[13px] text-[var(--text-dim)] truncate">{s.line}</span>
                      </span>
                      <ArrowIcon className="w-4 h-4 text-[var(--text-faint)] group-hover:text-[var(--text)] transition-colors" />
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <main className="max-w-6xl mx-auto px-5 md:px-8 pb-24">
          <section id="music" className="scroll-mt-20">
            <SectionHead index="01" title="Music" />
            <SpotifyLive />
          </section>

          <section id="videos" className="scroll-mt-20">
            <SectionHead index="02" title="Videos" line="Walkthroughs of the things I build, straight from my channel.">
              <a href={socials.youtube} target="_blank" rel="noopener noreferrer" className="work-link">
                <SocialIcon id="youtube" className="w-3.5 h-3.5" />
                youtube.com/@{socials.handle}
              </a>
            </SectionHead>
            <Videos />
          </section>

          <section id="code" className="scroll-mt-20">
            <SectionHead
              index="03"
              title="Code"
              line={gh ? `${gh.publicRepos} public repositories since ${gh.since}. These are the ones I pushed to most recently.` : undefined}
            >
              <a href={socials.github} target="_blank" rel="noopener noreferrer" className="work-link">
                <GithubIcon className="w-3.5 h-3.5" />
                github.com/{socials.handle}
              </a>
            </SectionHead>
            <Repos />
          </section>

          <section id="photos" className="scroll-mt-20">
            <SectionHead index="04" title="Photos" line={personal.photos}>
              {board.fetched && (
                <span className="mono text-[10px] tracking-[0.1em] uppercase text-[var(--text-faint)]">
                  {board.pins.length} frames · updated {board.fetched}
                </span>
              )}
            </SectionHead>
            <PinSheet pins={board.pins || []} profileUrl={board.created || socials.pinterest} />
          </section>

          <div className="flex flex-wrap items-center gap-3 mt-24 pt-8 border-t border-[var(--line-strong)]">
            <Link href="/" className="btn btn-primary">
              Okay, show me the work
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
            <a href={`mailto:${profile.email}`} className="btn btn-ghost">
              Say hi
            </a>
          </div>
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
