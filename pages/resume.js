import Head from 'next/head';
import Link from 'next/link';
import { profile, certifications } from '../components/portfolioData';

export default function Resume() {
  /* Relative paths so the GitHub Pages basePath resolves correctly from /resume/ */
  const pdf = '../Aryan_Walia.pdf?v=20261028';

  return (
    <>
      <Head>
        <title>Resume · Aryan Walia</title>
        <meta name="description" content="Resume of Aryan Walia, security engineer and product builder: SOC & SIEM, VAPT, OSINT and security automation." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#eae7df" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans">
        <header className="sticky top-0 z-50 bg-[var(--bg)] border-b border-[var(--line-strong)]">
          <div className="max-w-5xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2.5 group min-w-0">
              <svg className="w-4 h-4 text-[var(--text-dim)] group-hover:text-[var(--accent)] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm text-[var(--text-dim)] group-hover:text-[var(--text)] transition-colors truncate">Back to portfolio</span>
            </Link>

            <a
              href={pdf}
              download="Aryan_Walia_Resume.pdf"
              className="btn btn-primary py-2 px-4 text-[13px] flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </a>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-5 md:px-8 py-8">
          {/* summary header */}
          <div className="mb-6">
            <h1 className="display text-4xl md:text-5xl text-[var(--text)]">
              Aryan <span className="text-[var(--accent)]">Walia</span>
            </h1>
            <p className="lede mt-3">
              Analyst at Deloitte · Founder of BugSnaps · Security, OSINT, web and mobile builds
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm">
              <a href={`mailto:${profile.email}`} className="text-[var(--text)] hover:text-[var(--accent)] transition-colors">
                {profile.email}
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors">
                LinkedIn
              </a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors">
                GitHub
              </a>
              <a href={profile.myrecon} target="_blank" rel="noopener noreferrer" className="penned">
                myrecon.xyz
              </a>
              <span className="text-[var(--text-faint)]">{profile.location}</span>
            </div>

            {/* certification strip */}
            <div className="flex flex-wrap gap-2 mt-5">
              {certifications.map((c) => (
                <span
                  key={c.name}
                  className={`chip ${c.pending ? 'opacity-60' : ''}`}
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>

          {/* PDF viewer */}
          <div className="rounded-[2px] border border-[var(--text)] overflow-hidden bg-[var(--surface)] shadow-[8px_8px_0_0_rgba(22,21,15,0.16)]">
            <object data={pdf} type="application/pdf" className="w-full h-[85vh]" aria-label="Aryan Walia resume PDF">
              <div className="p-10 text-center">
                <p className="text-[var(--text-dim)] mb-4">Your browser can&apos;t display the PDF inline.</p>
                <a
                  href={pdf}
                  download="Aryan_Walia_Resume.pdf"
                  className="btn btn-primary"
                >
                  Download the resume
                </a>
              </div>
            </object>
          </div>
        </main>
      </div>
    </>
  );
}
