import Head from 'next/head';
import Link from 'next/link';
import { profile, certifications } from '../components/portfolioData';

export default function Resume() {
  /* Relative paths so the GitHub Pages basePath resolves correctly from /resume/ */
  const pdf = '../Aryan_Walia.pdf';

  return (
    <>
      <Head>
        <title>Resume — Aryan Walia</title>
        <meta name="description" content="Resume of Aryan Walia — Cybersecurity Analyst: SOC & SIEM, VAPT, OSINT and security automation." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-[#08090c] text-white font-sans">
        <header className="sticky top-0 z-50 bg-[#08090c]/85 backdrop-blur-xl border-b border-white/[0.07]">
          <div className="max-w-5xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2.5 group min-w-0">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm text-gray-400 group-hover:text-white transition-colors truncate">Back to portfolio</span>
            </Link>

            <a
              href={pdf}
              download="Aryan_Walia_Resume.pdf"
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-white text-black hover:bg-cyan-400 transition-colors flex-shrink-0"
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
            <h1 className="text-3xl md:text-4xl font-extrabold">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Aryan Walia
              </span>
            </h1>
            <p className="text-gray-400 mt-2">
              Cybersecurity Analyst · SOC &amp; SIEM · VAPT &amp; Offensive Security · OSINT · Security Automation
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm">
              <a href={`mailto:${profile.email}`} className="text-gray-300 hover:text-cyan-400 transition-colors">
                {profile.email}
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-cyan-400 transition-colors">
                LinkedIn
              </a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-cyan-400 transition-colors">
                GitHub
              </a>
              <a href={profile.myrecon} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                myrecon.xyz
              </a>
              <span className="text-gray-500">{profile.location}</span>
            </div>

            {/* certification strip */}
            <div className="flex flex-wrap gap-2 mt-5">
              {certifications.map((c) => (
                <span
                  key={c.name}
                  className="text-xs px-3 py-1.5 rounded-full border"
                  style={{ background: `${c.accent}0f`, borderColor: `${c.accent}2e`, color: '#d1d5db' }}
                >
                  {c.icon} {c.name}
                </span>
              ))}
            </div>
          </div>

          {/* PDF viewer */}
          <div className="rounded-2xl border border-gray-800 overflow-hidden bg-[#0e1014]">
            <object data={pdf} type="application/pdf" className="w-full h-[85vh]" aria-label="Aryan Walia resume PDF">
              <div className="p-10 text-center">
                <p className="text-gray-400 mb-4">Your browser can&apos;t display the PDF inline.</p>
                <a
                  href={pdf}
                  download="Aryan_Walia_Resume.pdf"
                  className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full bg-white text-black hover:bg-cyan-400 transition-colors"
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
