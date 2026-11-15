import React from 'react';
import Image from 'next/image';
import { projects } from './portfolioData';

/* Static imports so the GitHub Pages basePath is applied to every asset URL. */
import wakeMeIcon from '../public/wakeme-icon.png';
import myreconLogo from '../public/myrecon-logo.svg';
import bugsnapsLogo from '../public/bugsnaps-logo.svg';
import endpointradarLogo from '../public/endpointradar-logo.svg';
import mypentestLogo from '../public/mypentest-logo.svg';
import personalLogo from '../public/personal-logo.svg';
import phishlensLogo from '../public/phishlens-logo.svg';
import rakshakLogo from '../public/rakshak-logo.svg';
import phishingLogo from '../public/phishing-logo.svg';

/* Screenshots of the live products, captured from the real sites. */
import shotMypentest from '../public/shots/mypentest.jpg';
import shotReport from '../public/shots/mypentest-report.jpg';
import shotMyrecon from '../public/shots/myrecon.jpg';
import shotMyreconHome from '../public/shots/myrecon-home.jpg';
import shotBugsnaps from '../public/shots/bugsnaps.jpg';
import shotPersonal from '../public/shots/personal.jpg';
import shotEndpointradar from '../public/shots/endpointradar.jpg';
import shotPhishlens from '../public/shots/phishlens.jpg';
import shotRakshak from '../public/shots/rakshak.jpg';

export const LOGOS = {
  mypentest: mypentestLogo,
  myrecon: myreconLogo,
  bugsnaps: bugsnapsLogo,
  personal: personalLogo,
  endpointradar: endpointradarLogo,
  phishlens: phishlensLogo,
  wakeme: wakeMeIcon,
  rakshak: rakshakLogo,
  phishing: phishingLogo,
};

export const SHOTS = {
  mypentest: [
    { src: shotMypentest, url: 'bugsnaps.in/mypentest' },
    { src: shotReport, url: 'bugsnaps.in/mypentest/example-report' },
  ],
  myrecon: [
    { src: shotMyreconHome, url: 'myrecon.xyz' },
    { src: shotMyrecon, url: 'myrecon.xyz' },
  ],
  endpointradar: [{ src: shotEndpointradar, url: 'bugsnaps.in/endpointradar' }],
  phishlens: [{ src: shotPhishlens, url: 'bugsnaps.in/phishing-detector' }],
  bugsnaps: [{ src: shotBugsnaps, url: 'bugsnaps.in' }],
  personal: [{ src: shotPersonal, url: 'bugsnaps.in/personal' }],
  rakshak: [{ src: shotRakshak, url: '4ryanwalia.github.io/Rakshak---Car' }],
};

export const byId = (id) => projects.find((p) => p.id === id);

/* ─── icons ─── */
export const GithubIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export const ArrowIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H8m9 0v9" />
  </svg>
);

export const PlayIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3.609 1.814L13.792 12 3.61 22.186a2.014 2.014 0 01-.609-1.444V3.258c0-.564.234-1.073.609-1.444zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1.996 1.996 0 010 3.73l-2.808 1.626L15.31 12l2.388-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
  </svg>
);

export const StarIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8L10 1.6z" />
  </svg>
);

/* Tracks the cursor inside a .spotlight element so its border glow follows it. */
export function trackSpot(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--cx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--cy', `${e.clientY - r.top}px`);
}

/* Project logo, falling back to a monogram tinted with the project's accent. */
export function ProjectMark({ project, size = 48, rounded = 'rounded-xl', className = '' }) {
  const logo = LOGOS[project.id];

  if (logo) {
    return (
      <div className={`${rounded} overflow-hidden flex items-center justify-center flex-shrink-0 ${className}`} style={{ width: size, height: size }}>
        <Image src={logo} alt={`${project.name} logo`} width={size} height={size} className="object-contain w-full h-full" />
      </div>
    );
  }

  const letters = project.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);

  return (
    <div
      className={`${rounded} flex items-center justify-center flex-shrink-0 display ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        color: project.accent,
        background: `${project.accent}14`,
        border: `1px solid ${project.accent}33`,
        letterSpacing: '-0.02em',
      }}
    >
      {letters}
    </div>
  );
}

/* A screenshot dressed in minimal browser chrome. `height` crops it from the top. */
export function BrowserFrame({ shot, height, className = '', sizes = '(min-width: 1024px) 600px, 100vw', priority = false }) {
  return (
    <div className={`rounded-xl overflow-hidden border border-[var(--line-strong)] bg-[#0b0c0e] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.9)] ${className}`}>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--line)] bg-white/[0.03]">
        <span className="flex gap-1 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-white/15" />
        </span>
        <span className="mono text-[10px] text-[var(--text-faint)] truncate flex-1 text-center rounded-md bg-black/30 px-2 py-0.5">{shot.url}</span>
      </div>
      <div className="relative" style={height ? { height } : undefined}>
        <Image
          src={shot.src}
          alt={`Screenshot of ${shot.url}`}
          sizes={sizes}
          priority={priority}
          className={height ? 'w-full h-full object-cover object-left-top' : 'w-full h-auto block'}
        />
      </div>
    </div>
  );
}

export function StatusPill({ project }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 mono text-[10px] tracking-wider whitespace-nowrap"
      style={{ background: `${project.accent}14`, color: project.accent }}
    >
      {project.live && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: project.accent }} />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: project.accent }} />
        </span>
      )}
      {project.status}
    </span>
  );
}

/* Five stars with a fractional fill, e.g. 4.7 fills 94% of the row. */
export function Stars({ rating, color = '#facc15', className = '' }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className={`relative inline-flex ${className}`} role="img" aria-label={`${rating} out of 5 stars`}>
      <span className="flex text-white/15">
        {[0, 1, 2, 3, 4].map((i) => (
          <StarIcon key={i} className="w-3.5 h-3.5" />
        ))}
      </span>
      <span className="absolute inset-0 flex overflow-hidden" style={{ width: `${pct}%`, color }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <StarIcon key={i} className="w-3.5 h-3.5 flex-shrink-0" />
        ))}
      </span>
    </span>
  );
}
