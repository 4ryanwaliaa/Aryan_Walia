import Image from 'next/image';
import mypentestReport from '../public/shots/mypentest-report.jpg';
import myreconSearch from '../public/shots/myrecon.jpg';

const studies = [
  {
    name: 'MyPentest',
    category: 'Automated security testing',
    accent: '#f97366',
    image: mypentestReport,
    imageAlt: 'MyPentest example security report',
    caption: 'Example report from a deliberately vulnerable test application',
    problem: 'Teams need a practical way to find security issues in their own web applications and understand what to fix.',
    role: 'I built the scanning engine and the hosted product, from assessment setup through reporting.',
    decision: 'Require proof of domain control before a scan, then pair findings with evidence and remediation guidance.',
    result: 'The public example report shows an assessment of a deliberately vulnerable test app, with findings and suggested fixes.',
    links: [
      { label: 'Explore the example report', url: 'https://bugsnaps.in/mypentest/example-report' },
      { label: 'Visit MyPentest', url: 'https://bugsnaps.in/mypentest' },
    ],
  },
  {
    name: 'MyRecon',
    category: 'Open-source intelligence',
    accent: '#22d3ee',
    image: myreconSearch,
    imageAlt: 'MyRecon public footprint search results',
    caption: 'MyRecon search results',
    problem: 'A digital footprint is scattered across platforms and public sources, making it difficult to investigate in one place.',
    role: 'I built the search services and the interfaces for exploring public identity and infrastructure signals.',
    decision: 'Share lookup services between the API and CLI, and label inconclusive username checks as unknown rather than claiming a match.',
    result: 'The open-source repository includes a web interface, API and CLI, with setup instructions and code available to inspect.',
    links: [
      { label: 'Explore the source', url: 'https://github.com/4ryanwalia/Myrecon' },
      { label: 'Visit MyRecon', url: 'https://myrecon.xyz' },
    ],
  },
];

export default function CaseStudies() {
  return (
    <section id="case-studies" className="scroll-mt-24 pb-24 md:pb-32" aria-labelledby="case-studies-title">
      <div className="mb-10">
        <span className="eyebrow">A closer look</span>
        <h2 id="case-studies-title" className="display text-4xl md:text-6xl mt-5 text-white">
          From problem to <span className="serif text-[var(--accent)]">product.</span>
        </h2>
        <p className="text-[var(--text-dim)] leading-relaxed mt-5 max-w-2xl">
          Two projects, the decisions behind them, and the work you can explore for yourself.
        </p>
      </div>

      <div className="space-y-5">
        {studies.map((study) => (
          <article key={study.name} className="card overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-6 md:p-8 lg:p-10">
                <p className="mono text-[10px] uppercase tracking-[0.18em]" style={{ color: study.accent }}>{study.category}</p>
                <h3 className="display text-3xl md:text-4xl text-white mt-2">{study.name}</h3>
                <dl className="space-y-4 mt-7">
                  {[
                    ['The problem', study.problem],
                    ['My role', study.role],
                    ['Key decision', study.decision],
                    ['Result', study.result],
                  ].map(([label, detail]) => (
                    <div key={label}>
                      <dt className="mono text-[10px] uppercase tracking-[0.14em] text-white">{label}</dt>
                      <dd className="text-[var(--text-dim)] text-sm leading-relaxed mt-1">{detail}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex flex-wrap gap-3 mt-7">
                  {study.links.map((link, index) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn ${index === 0 ? '' : 'btn-ghost'} text-sm`}
                      style={index === 0 ? { background: study.accent, color: '#0a0a0a' } : undefined}
                    >
                      {link.label} <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              </div>
              <figure className="p-6 md:p-8 lg:p-10 bg-black/20 border-t lg:border-t-0 lg:border-l border-[var(--line)] flex flex-col justify-center">
                <div className="rounded-xl overflow-hidden border border-[var(--line-strong)] bg-[#0b0c0e] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.9)]">
                  <Image src={study.image} alt={study.imageAlt} sizes="(min-width: 1024px) 500px, 100vw" className="w-full h-auto block" />
                </div>
                <figcaption className="mono text-[11px] text-[var(--text-faint)] mt-3">{study.caption}</figcaption>
              </figure>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
