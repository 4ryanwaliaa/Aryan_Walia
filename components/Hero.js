import React, { useState } from 'react';
import { profile, heroBuild, credentials } from './portfolioData';
import { Magnetic, PreviewFloat, Redact } from './fx';
import { ArrowIcon, PREVIEWS, StarIcon } from './shared';

/* The opening of the page, in the order it should be read:
   what I do, what I build, then the proof that I am who I say. */
export default function Hero({ onXray }) {
  const [hover, setHover] = useState(null);

  return (
    <section id="top" className="relative pt-24 md:pt-28 pb-14 md:pb-20" data-xray="hero · identity">
      <div className="relative w-full max-w-6xl mx-auto px-5 md:px-8">
        {/* the sheet's header line */}
        <div className="flex items-center justify-between gap-4 mono text-[10px] tracking-[0.2em] uppercase text-[var(--text-faint)] pb-4 border-b border-[var(--line)]">
          <span>{profile.name}</span>
          <span className="hidden sm:inline">{profile.location}</span>
          <span className="text-[var(--accent)]">{profile.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end pt-8 md:pt-10">
          <h1 className="lg:col-span-8 display text-[3.2rem] leading-[0.9] sm:text-[4.8rem] lg:text-[6rem] text-[var(--text)]">
            <span className="block">I build and</span>
            <span className="block">
              <Redact delay={0.15} tone="flag">
                break
              </Redact>{' '}
              <Redact delay={0.32} tone="pen">
                software.
              </Redact>
            </span>
          </h1>

          <div className="lg:col-span-4 lg:pb-3">
            <p className="lede">
              I&apos;m <strong>Aryan Walia</strong>. I design, ship and secure every product myself, from the first sketch to the
              store listing.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <Magnetic>
                <a href="#work" className="btn btn-primary">
                  See the work
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6" />
                  </svg>
                </a>
              </Magnetic>
              <a href="./Aryan_Walia.pdf?v=20261028" download="Aryan_Walia_Resume.pdf" className="btn btn-ghost">
                Resume
              </a>
            </div>
          </div>
        </div>

        {/* what I build: each name is a link, and shows the thing itself while you hover it */}
        <div className="mt-10 md:mt-12 pt-5 border-t border-[var(--line-strong)]">
          <p className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--text-faint)]">Right now I build</p>
          <ul className="build-list display mt-3" onMouseLeave={() => setHover(null)}>
            {heroBuild.map((b, i) => (
              <li key={b.label}>
                <a
                  href={b.href}
                  className="build-item"
                  onMouseEnter={() => setHover(b.shot || null)}
                  onFocus={() => setHover(b.shot || null)}
                  onBlur={() => setHover(null)}
                >
                  {b.label}
                </a>
                {i < heroBuild.length - 1 ? (
                  <span className="build-sep" aria-hidden="true">
                    /
                  </span>
                ) : (
                  <span className="text-[var(--accent)]">.</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <PreviewFloat image={hover ? PREVIEWS[hover] : null} />

        {/* the credentials: each one links to where it can be checked */}
        <dl className="creds mt-10 md:mt-12">
          {credentials.map((c) => (
            <a key={c.k} href={c.href} target="_blank" rel="noopener noreferrer" className="cred group">
              <dt className="mono text-[10px] tracking-[0.16em] uppercase text-[var(--text-faint)] flex items-center justify-between gap-2">
                {c.k}
                <ArrowIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </dt>
              <dd className="display text-[1.7rem] md:text-[2.1rem] leading-none mt-3 text-[var(--text)] flex items-center gap-1.5">
                {c.v}
                {c.star && <StarIcon className="w-5 h-5 text-[var(--sev-high)]" />}
              </dd>
              {c.sub && <dd className="mono text-[10px] text-[var(--text-faint)] mt-2">{c.sub}</dd>}
            </a>
          ))}
        </dl>

        <button
          type="button"
          onClick={onXray}
          className="group mt-8 inline-flex items-center gap-2.5 mono text-[11px] text-[var(--text-faint)] hover:text-[var(--text)] transition-colors text-left"
        >
          <span className="inline-flex items-center justify-center w-6 h-6 border border-[var(--line-strong)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] transition-colors">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M11 7.5v7M7.5 11h7M20 20l-3.6-3.6" />
            </svg>
          </span>
          <span>
            X-ray this page
            <span className="hidden md:inline">
              , or press <kbd className="kbd">X</kbd> anywhere
            </span>
            <span className="md:hidden">, then drag the lens</span>
          </span>
        </button>
      </div>
    </section>
  );
}
