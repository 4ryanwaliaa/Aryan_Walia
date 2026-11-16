/* Single source of truth for everything the portfolio renders.
   House rule: no em or en dashes anywhere in the copy.
   Store figures and product claims are dated in PROOF_POINTS.md. Re-check them before each release. */

const PLAY_MYRECON = 'https://play.google.com/store/apps/details?id=com.Myrecon.osint';
const PLAY_WAKEME = 'https://play.google.com/store/apps/details?id=makeme.aryan.makeme';

export const profile = {
  name: 'Aryan Walia',
  title: 'Security Engineer & Product Builder',
  location: 'Delhi NCR, India',
  email: '4ryanwalia@gmail.com',
  github: 'https://github.com/4ryanwalia',
  linkedin: 'https://www.linkedin.com/in/4ryanwalia',
  playDeveloper: 'https://play.google.com/store/apps/developer?id=Aryan+Walia',
  myrecon: 'https://myrecon.xyz',
  bugsnaps: 'https://bugsnaps.in',
  mypentest: 'https://bugsnaps.in/mypentest',
  summary:
    'Analyst at Deloitte, CEH-certified security engineer and founder of BugSnaps. I design, build and secure products end to end: an automated pentesting platform, a live OSINT engine, endpoint and phishing tools, Android apps and ML models.',
};

/* What I do right now. Shown in the hero and the proof section. */
export const now = {
  role: 'Analyst',
  org: 'Deloitte',
  since: 'Nov 2026 to present',
  line: 'My full-time role. Everything else on this page is what I build around it.',
};

/* What the hero says I build, in this order. `shot` is a key in shared.js PREVIEWS (shown on hover). */
export const heroBuild = [
  { label: 'BugSnaps', href: '#work', shot: 'bugsnaps' },
  { label: 'MyRecon', href: '#apps', shot: 'myrecon' },
  { label: 'Android apps', href: '#apps', shot: 'wakeme' },
  { label: 'web platforms', href: '#work', shot: 'personal' },
  { label: 'security tools', href: '#work', shot: 'mypentest' },
  { label: 'AI models', href: '#work', shot: 'rakshak' },
  { label: 'automations', href: '#journey' },
];



/* ─── PROJECTS ───
   `app: true` marks a project that is also on the Google Play shelf (see `apps`). Work.js picks the rest by id;
   the rest go in the builds grid. `live` = a URL anyone can open right now. */
export const projects = [
  {
    id: 'mypentest',
    video: { id: 'wZM29H-GTvU', label: '60 second demo' },
    ecosystem: true,
    kind: 'Web & API security',
    name: 'MyPentest',
    tagline: 'Automated penetration testing',
    blurb:
      "A hosted pentesting platform that maps a web app's attack surface, then tests it: broken access control, injection, session flaws, exposed secrets and known CVEs, with evidence, a CVSS score and a fix for every finding.",
    accent: '#c0321b',
    live: 'https://bugsnaps.in/mypentest',
    liveLabel: 'Try MyPentest free',
    status: 'BETA · FREE PLAN',
    tech: ['Python', 'Flask', 'Next.js', 'TypeScript', 'Firebase', 'Razorpay', 'SARIF'],
    metrics: [
      { k: 'Checks', v: '56 per scan' },
      { k: 'Split', v: '32 passive · 24 safe-active' },
      { k: 'Scoring', v: 'CVSS 3.1 · KEV · EPSS' },
      { k: 'Exports', v: 'PDF · HTML · SARIF' },
    ],
    highlights: [
      'Four phases, in order: verify ownership, map the attack surface, test it, report. Nothing is sent to a site until its owner has proved control with a DNS TXT record tied to their account',
      'Surface discovery reads pages, forms and JavaScript for hidden endpoints, including OpenAPI, GraphQL and WebSocket surfaces',
      "Authorization testing that signs in as your test accounts and asks whether one can read another's data. A finding needs a 200, matching owner content, a refused anonymous control and a second reproduction",
      'Session lifecycle checks for logout invalidation, session fixation and token lifetime',
      'Safe injection checks (SQL, command, template, XXE, SSRF) on a differential engine with reflection-safe canaries',
      'Two gates on every request: scope decides what the customer authorised, a network guard pins the resolved IP so a target cannot rebind mid-scan',
      'Findings grouped with severity, confidence, evidence and the exact fix, then linked into attack paths and a remediation plan',
      'Exports to PDF, HTML, Markdown, JSON and SARIF, so a report drops straight into a tracker or CI',
    ],
  },
  {
    id: 'myrecon',
    video: { id: '9_1TIvkGKhs', label: 'Tutorial' },
    ecosystem: true,
    kind: 'Digital footprint',
    name: 'MyRecon',
    tagline: 'OSINT on web, terminal and Android',
    blurb:
      'Turns a username, email, domain or IP into a structured public footprint. It runs as a website, a terminal client and an Android app that is live on Google Play.',
    accent: '#0a6f88',
    live: 'https://myrecon.xyz',
    liveLabel: 'Open myrecon.xyz',
    android: PLAY_MYRECON,
    androidLabel: 'Get it on Google Play',
    github: 'https://github.com/4ryanwalia/Myrecon',
    status: 'LIVE · WEB + ANDROID',
    tech: ['Python', 'Flask', 'JavaScript', 'Kotlin', 'REST APIs', 'Vercel', 'Render'],
    metrics: [
      { k: 'Platforms', v: '500+ standard · 3,000+ extended' },
      { k: 'Google Play', v: '4.7 stars · 1K+ installs' },
      { k: 'Interfaces', v: 'Web · CLI · Android' },
      { k: 'Password checks', v: 'k-anonymity' },
    ],
    highlights: [
      'Username search across 500+ platforms on a standard scan and 3,000+ on an extended one, with every result labelled found, not found or unknown instead of guessing',
      'Deep Search follows the links people publish in their own profiles and bios, and explains why two profiles are connected',
      'Email breach checks with incident details, affected services and reported data types, plus opt-in breach watch notifications',
      'Password-exposure checks with k-anonymity: hashed on the device, only five hash characters ever leave it',
      'Infrastructure recon: RDAP registration, DNS records, SPF, DKIM and DMARC findings, IP context and subdomains from Certificate Transparency',
      'On Android: a QR and suspicious link checker that decodes camera frames locally, and a device privacy and security check',
      'A published benchmark against Sherlock and Maigret, with methodology, false positives and unresolved checks included',
      'The CLI calls the same service functions in process, so a terminal answer and a web answer cannot drift apart',
    ],
  },
  {
    id: 'endpointradar',
    video: { id: 'oEqp80naqvY', label: 'Watch it run' },
    ecosystem: true,
    kind: 'Endpoint security',
    name: 'EndpointRadar',
    tagline: 'Windows posture scanner',
    blurb:
      'Finds out how exposed a Windows machine really is. An open-source scanner audits it locally, then a free browser workspace scores the risk, explains each finding and tracks it across devices.',
    accent: '#5b3cc4',
    live: 'https://bugsnaps.in/endpointradar',
    liveLabel: 'Open EndpointRadar',
    github: 'https://github.com/4ryanwalia/EndpointRadar',
    status: 'BETA · FREE',
    tech: ['Python', 'PySide6', 'WinRM', 'Nmap', 'Next.js', 'NIST CSF 2.0'],
    metrics: [
      { k: 'Scanner', v: 'Open source' },
      { k: 'Deployment', v: 'Agentless' },
      { k: 'Workspace', v: 'Up to 100 scans' },
      { k: 'Framework', v: 'NIST CSF 2.0' },
    ],
    highlights: [
      'A read-only local scan of antivirus, firewall profiles, patch currency, listening ports, services and installed software',
      'Agentless remote assessment over WinRM: a temporary scanner is staged on the host and removed, with no permanent agent',
      'Risk scoring that names its top drivers as a weighted breakdown instead of an unexplained number',
      'A free browser workspace that imports up to 100 scan records, compares dated results and prints a client report. The data stays in the browser tab',
      'A managed workspace in beta: enrolled devices, scan schedules, posture change alerts and client PDFs',
      'Honest about its limits: a point-in-time posture scanner, not an EDR, and the site says so',
    ],
  },
  {
    id: 'phishlens',
    video: { id: 'Q4S0Y2LtcUA', label: 'Watch it run' },
    ecosystem: true,
    kind: 'Link safety',
    name: 'PhishLens',
    tagline: 'Check a link before you click',
    blurb:
      'A free phishing link checker that inspects a suspicious URL without ever opening it. The first review runs in your own browser, and outside checks run only when you choose them.',
    accent: '#0d7a52',
    live: 'https://bugsnaps.in/phishing-detector',
    liveLabel: 'Check a link free',
    status: 'LIVE · FREE',
    tech: ['Next.js', 'TypeScript', 'Browser-local analysis', 'Cloudflare DNS'],
    metrics: [
      { k: 'First review', v: 'In your browser' },
      { k: 'Account', v: 'Not needed' },
      { k: 'Batch', v: 'Up to 100 links' },
      { k: 'Destination', v: 'Never opened' },
    ],
    highlights: [
      'Decodes the address first: the real hostname, the domain boundary and any destination hidden inside the link',
      'Explains each warning sign in plain language, and labels them as signals to investigate rather than a verdict',
      'Optional outside checks for domain intelligence, registration and DNS filtering, each one saying what it shares before it runs',
      'Batch review for up to 100 links, and a team inbox for submitting messages and recording decisions',
      'Exports a report that leaves out the full URL and its query string, so evidence can be shared safely',
    ],
  },
  {
    id: 'bugsnaps',
    ecosystem: true,
    core: true,
    kind: 'Company · Web platform',
    name: 'BugSnaps',
    tagline: 'Find. Fix. Fortify.',
    blurb:
      'The security company I founded, and the platform I built for it: four products, expert-led pentesting services, pricing, guides and research, all on a fast, SEO-tuned Next.js site with a strict security posture.',
    accent: '#1b49c9',
    live: 'https://bugsnaps.in',
    liveLabel: 'Open bugsnaps.in',
    status: 'FOUNDER',
    tech: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Firebase', 'Vercel', 'JSON-LD'],
    metrics: [
      { k: 'Products', v: '4 live tools' },
      { k: 'Stack', v: 'Next.js · TS' },
      { k: 'Services', v: 'Web · API · Cloud' },
      { k: 'Standards', v: 'OWASP · PTES' },
    ],
    highlights: [
      'One product line wired from a single config: MyPentest, MyRecon, EndpointRadar and PhishLens, so adding a product is one entry and not a redesign',
      'Web app, API, network and cloud penetration testing to OWASP WSTG and PTES, plus source code review and hands-on remediation support',
      'A server-side proxy so the browser never holds a scanner key: it signs in with Firebase and the engine verifies the token itself',
      'Vulnerability briefings, guides, comparison pages and a public benchmark methodology, all written and shipped alongside the products',
      'Unique metadata, canonical URLs and structured data (Organization, SoftwareApplication, Service, FAQ, Article) on every indexable page',
      'Strict CSP and security headers, cookie consent, and a contact form with a honeypot and a mailto fallback',
    ],
  },
  {
    id: 'personal',
    ecosystem: true,
    kind: 'Privacy service',
    name: 'BugSnaps Personal',
    tagline: 'Digital footprint cleanup',
    blurb:
      'Helps find the accounts and listings tied to your identity, then supports their removal through official deletion flows.',
    accent: '#a3279f',
    live: 'https://bugsnaps.in/personal',
    liveLabel: 'Open BugSnaps Personal',
    status: 'LIVE',
    tech: ['MyRecon engine', 'Next.js', 'Privacy'],
    metrics: [
      { k: 'Coverage', v: 'Accounts · listings' },
      { k: 'First scan', v: 'Free' },
      { k: 'Approach', v: 'Consent-first' },
      { k: 'Method', v: 'Official flows' },
    ],
    highlights: [
      'Built on the MyRecon engine to surface forgotten accounts before someone else uses them',
      "Deletion handled through each platform's own official flow, only with the owner's consent",
    ],
  },
  {
    id: 'wakeme',
    video: { id: 'OayBdXlBpsM', label: 'Explainer' },
    app: true,
    category: 'Mobile',
    name: 'Wake Me',
    tagline: 'Loud math alarm clock on Google Play',
    blurb:
      'An Android alarm clock for heavy sleepers that I designed, built and shipped to Google Play. You pick a mission, such as solving a math problem or shaking the phone, and the alarm only stops when you finish it.',
    accent: '#15733f',
    live: PLAY_WAKEME,
    liveLabel: 'Get it on Google Play',
    status: 'ON GOOGLE PLAY',
    tech: ['Android', 'Java', 'Kotlin', 'Firebase'],
    metrics: [
      { k: 'Google Play', v: '4.3 stars · 100+ installs' },
      { k: 'Missions', v: 'Math · Shake · Tap' },
      { k: 'Core alarms', v: 'Work offline' },
      { k: 'Account', v: 'Not needed' },
    ],
    highlights: [
      'Math alarm with selectable difficulty, a shake mission for mornings that need movement, and plain tap to dismiss when you want it simple',
      'Optional Wake Check: it asks you to confirm five minutes after dismissal, and rings a backup alarm if you do not answer',
      'Quick nap alarms that never touch your regular morning alarm',
      'Roast Mode: optional spoken nudges for people who ignore polite reminders',
      'A Dream Journal and daily goals, so the app carries you from waking up into the day',
      'Reliable delivery while the phone is idle, with backup alarm sounds if the chosen tone is unavailable',
    ],
  },
  {
    id: 'rakshak',
    category: 'AI / ML',
    name: 'Rakshak',
    tagline: 'AI road accident detection',
    blurb:
      'Detects road accidents from camera images with PyTorch transfer learning, exported to ONNX so the demo runs entirely in your browser. No server, no upload.',
    accent: '#b35c06',
    live: 'https://4ryanwalia.github.io/Rakshak---Car/',
    liveLabel: 'Try the browser demo',
    github: 'https://github.com/4ryanwalia/Rakshak---Car',
    status: 'LIVE DEMO',
    tech: ['PyTorch', 'ONNX', 'onnxruntime-web', 'Computer Vision'],
    metrics: [
      { k: 'Inference', v: 'In-browser' },
      { k: 'Model', v: 'PyTorch to ONNX' },
      { k: 'Uploads', v: 'None' },
      { k: 'Use case', v: 'Road safety' },
    ],
    highlights: [
      'Image classifier trained with transfer learning to separate accident scenes from ordinary road imagery',
      "Served through onnxruntime-web so inference happens on the user's own device",
      'Designed to feed roadside camera analysis that can trigger emergency alerts',
    ],
  },
  {
    id: 'phishing',
    category: 'AI / ML',
    name: 'Phishing Detection',
    tagline: 'Malicious URL classifier',
    blurb:
      'A machine-learning classifier that extracts 30+ lexical and host-based features from a URL and scores how likely it is to be malicious.',
    accent: '#414e9e',
    github: 'https://github.com/4ryanwalia/Phishing-detection',
    status: 'OPEN SOURCE',
    tech: ['Python', 'scikit-learn', 'Random Forest', 'Pandas'],
    metrics: [
      { k: 'Features', v: '30+' },
      { k: 'Models', v: 'RF · LogReg' },
      { k: 'Dataset', v: 'Self-built' },
      { k: 'Type', v: 'Supervised' },
    ],
    highlights: [
      'Extracts 30+ lexical and host-based features from each URL',
      'Random Forest and Logistic Regression trained and compared on a self-collected dataset',
    ],
  },
];

/* ─── GOOGLE PLAY SHELF ───
   Figures come from the public listings and are dated in PROOF_POINTS.md. */
export const apps = [
  {
    id: 'myrecon',
    storeName: 'MyRecon: OSINT Username Search',
    category: 'Tools',
    rating: 4.7,
    reviews: 50,
    installs: '1K+',
    updated: 'Nov 8, 2026',
    url: PLAY_MYRECON,
    accent: '#0a6f88',
    pitch: 'Find forgotten accounts, check breaches and inspect suspicious links, from a phone, with no account or sign-up.',
    features: ['Username search', 'Deep Search', 'Email breach check', 'Password leak check', 'WHOIS and DNS', 'QR and link checker', 'Device security check', 'Breach Files'],
    review: { quote: 'the best osint app for Android it is very good', by: 'Google Play review, November 2026' },
  },
  {
    id: 'wakeme',
    storeName: 'Wake Me: Loud Math Alarm Clock',
    category: 'Productivity',
    rating: 4.3,
    reviews: 8,
    installs: '100+',
    updated: 'Nov 10, 2026',
    url: PLAY_WAKEME,
    accent: '#15733f',
    pitch: 'An alarm for heavy sleepers. Pick a mission, and the sound only stops when you finish it.',
    features: ['Math alarm', 'Shake alarm', 'Wake Check', 'Quick naps', 'Roast Mode', 'Dream Journal', 'Daily goals', 'Works offline'],
  },
];

/* ─── EXPERIENCE ─── */
export const experience = [
  {
    role: 'Analyst',
    org: 'Deloitte',
    period: '11/2026 to present',
    current: true,
    featured: true,
    points: [],
  },
  {
    role: 'Founder',
    org: 'BugSnaps · bugsnaps.in',
    period: 'Ongoing',
    current: true,
    points: [
      'Built and shipped MyPentest, MyRecon, EndpointRadar and PhishLens, plus the platform they run on.',
      'Run expert-led pentesting engagements, from scoping to retest.',
    ],
  },
  {
    role: 'Network Engineer',
    org: 'Ogma Consulting, Gurugram',
    period: '08/2026 to 10/2026',
    points: [
      'Configured and maintained enterprise network infrastructure: routing, switching and firewall policy.',
      'Supported access control, segmentation and network monitoring across client environments.',
    ],
  },
  {
    role: 'Cyber Security Engineer, Intern',
    org: 'Niveshan Technologies, Delhi',
    period: '01/2026 to 07/2026',
    points: [
      'Triaged the FortiSIEM alert queue, validating detections against raw logs and escalating confirmed incidents.',
      'Pivoted across sources in Splunk to rebuild incident timelines and map behaviour to MITRE ATT&CK.',
      'Built FortiSOAR playbooks and ran vulnerability assessments with Nessus, OpenVAS and Nmap across AWS and on-prem hosts.',
    ],
  },
  {
    role: 'Web Developer, Intern',
    org: 'Headway, Delhi',
    period: '07/2022 to 08/2022',
    points: ['Built responsive front-end components for brand websites.'],
  },
];

export const education = [
  { name: 'MCA, Cyber Security', org: 'NMIMS University, Mumbai', period: '2024 to 2026', note: 'GPA 7.87' },
  { name: 'BCA, Web Development', org: 'The NorthCap University, Gurugram', period: '2021 to 2024', note: 'GPA 7.31' },
];

/* ─── CERTIFICATIONS ─── */
export const certifications = [
  { name: 'Certified Ethical Hacker (CEH)', issuer: 'EC-Council' },
  { name: 'Fortinet NSE 1, 2 & 3', issuer: 'Fortinet' },
  { name: 'OT/ICS-SCADA Cybersecurity', issuer: 'Udemy' },
  { name: 'Cybersecurity 101', issuer: 'TryHackMe' },
  { name: 'Supervised Machine Learning', issuer: 'Coursera' },
  { name: 'CISA', issuer: 'ISACA, in preparation', pending: true },
];

/* ─── THE PERSONAL PAGE (/about) ───
   Same handle on every platform. The Spotify card is drawn live by my own endpoint
   (the spotify-live function in the 4ryanwalia GitHub profile repo). */
const HANDLE = '4ryanwalia';
export const socials = {
  handle: HANDLE,
  instagram: `https://www.instagram.com/${HANDLE}`,
  pinterest: `https://www.pinterest.com/${HANDLE}/`,
  spotify: 'https://open.spotify.com/user/31zbuvzhd6mp2cjl3zeed7x2bamu',
  spotifyCard: 'https://spotify-live-seven.vercel.app/card.svg',
  youtube: `https://www.youtube.com/@${HANDLE}`,
  github: `https://github.com/${HANDLE}`,
  links: [
    { id: 'instagram', name: 'Instagram', href: `https://www.instagram.com/${HANDLE}`, accent: '#b32b6b', line: 'Photos and everyday life.' },
    { id: 'pinterest', name: 'Pinterest', href: `https://www.pinterest.com/${HANDLE}/`, accent: '#c62828', line: 'Photos I take and post.' },
    { id: 'spotify', name: 'Spotify', href: 'https://open.spotify.com/user/31zbuvzhd6mp2cjl3zeed7x2bamu', accent: '#0f7a3f', line: 'What I am listening to.' },
    { id: 'github', name: 'GitHub', href: `https://github.com/${HANDLE}`, accent: '#16150f', line: 'My code and open source projects.' },
    { id: 'youtube', name: 'YouTube', href: `https://www.youtube.com/@${HANDLE}`, accent: '#c4302b', line: 'Product demos and tutorials.' },
  ],
};

/* Voice: plain and friendly. Keep it short. Still no em or en dashes. */
export const personal = {
  tagline: 'I like finding out how things break, then building them so they do not.',
  bio: [
    'I am an Analyst at Deloitte, and I run BugSnaps, where I build and maintain a small set of security tools.',
    'Most of my work comes down to understanding how systems fail and making them harder to break.',
    'Outside of that I build Android apps, train the occasional machine learning model and keep a few side projects going.',
  ],
  listening: 'This updates live from my Spotify. When nothing is playing, it shows the last song I played.',
  photos: 'Pictures I took and posted to Pinterest. Only my own uploads, no saves.',
  footer: 'designed and built by me',
};

/* Topics for the contact picker. `subject` becomes the email subject line. */
export const contactTopics = [
  { id: 'web', label: 'A website or web app', subject: 'Website / web app project' },
  { id: 'security', label: 'A security assessment', subject: 'Security assessment' },
  { id: 'mobile', label: 'A mobile app', subject: 'Mobile app project' },
  { id: 'ai', label: 'AI or automation', subject: 'AI / automation project' },
  { id: 'role', label: 'A full-time role', subject: 'Role opportunity' },
  { id: 'other', label: 'Something else', subject: 'Hello' },
];

/* The credentials row under the hero. The store figures are read from `apps`, so they can only
   ever say what the store cards say. */
const [storeMyrecon] = apps;
export const credentials = [
  { k: 'Day job', v: `${now.role}, ${now.org}`, href: profile.linkedin },
  { k: 'On Google Play', v: `${apps.length} apps`, sub: 'MyRecon and Wake Me', href: profile.playDeveloper },
  { k: 'Installs', v: storeMyrecon.installs, sub: 'MyRecon', href: storeMyrecon.url },
  { k: 'Store rating', v: String(storeMyrecon.rating), star: true, sub: `${storeMyrecon.reviews} reviews`, href: storeMyrecon.url },
  { k: 'Certified', v: 'CEH', sub: 'EC-Council', href: profile.linkedin },
];
