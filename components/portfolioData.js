/* Single source of truth for everything the portfolio renders. */

export const profile = {
  name: 'Aryan Walia',
  title: 'Cybersecurity Analyst',
  specialisms: ['SOC & SIEM', 'VAPT & Offensive Security', 'OSINT', 'Security Automation'],
  location: 'Delhi NCR, India',
  email: '4ryanwalia@gmail.com',
  phone: '+91 8130058689',
  github: 'https://github.com/4ryanwalia',
  linkedin: 'https://www.linkedin.com/in/4ryanwalia',
  myrecon: 'https://myrecon.xyz',
  bugsnaps: 'https://bugsnaps.in',
  summary:
    'CEH-certified cybersecurity practitioner and MCA (Cyber Security) graduate with hands-on experience in SOC operations, SIEM monitoring and incident response, and vulnerability assessment. I build working security tooling — including MyRecon, a live OSINT intelligence platform — pairing Python automation with investigative tradecraft.',
  availability: 'Immediate joiner · Open to relocation across India',
};

export const stats = [
  { value: '123', label: 'Platforms swept', sub: 'by MyRecon' },
  { value: '6', label: 'Shipped products', sub: 'live & in production' },
  { value: 'CEH', label: 'Certified', sub: '+ Fortinet NSE 1–3' },
  { value: '2+', label: 'Years hands-on', sub: 'SOC · VAPT · networks' },
];

/* ─── PROJECTS ───
   category drives the filter tabs. `live` = a URL anyone can open right now. */
export const projectCategories = [
  { id: 'all', label: 'All Work' },
  { id: 'security', label: 'Security Tools' },
  { id: 'service', label: 'Venture' },
  { id: 'ai', label: 'AI / ML' },
  { id: 'app', label: 'Apps' },
];

export const projects = [
  {
    id: 'myrecon',
    category: 'security',
    featured: true,
    icon: '🔍',
    name: 'MyRecon',
    tagline: 'OSINT Intelligence Platform',
    blurb:
      'A live OSINT platform that turns a single identifier — username, email, domain or IP — into a structured public footprint, scoring every finding for confidence so false positives get filtered out.',
    accent: '#10b981',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    logo: '/myrecon-logo.svg',
    live: 'https://myrecon.xyz',
    liveLabel: 'Open myrecon.xyz',
    android: 'https://play.google.com/apps/testing/com.Myrecon.osint',
    androidLabel: 'Android app (closed beta)',
    github: 'https://github.com/4ryanwalia/Myrecon',
    status: 'LIVE IN PRODUCTION',
    tech: ['Python', 'Flask', 'JavaScript', 'REST APIs', 'Vercel', 'Render', 'Kotlin'],
    metrics: [
      { k: 'Platforms', v: '123' },
      { k: 'Front doors', v: 'Web · CLI · Android' },
      { k: 'API keys needed', v: 'None' },
      { k: 'Server storage', v: 'Zero' },
    ],
    highlights: [
      'Username enumeration across 123 platforms in parallel, with per-platform validators that report what was checked and rejected — and why',
      'Email intelligence: provider and deliverability analysis, disposable detection, Gravatar and linked accounts, and named breach exposure',
      'Privacy-preserving password-exposure checks against 900M+ breached credentials using k-anonymity — hashed client-side, only five hash characters ever leave the browser',
      'Infrastructure recon: RDAP/WHOIS, full DNS over DNS-over-HTTPS, IP geolocation with ASN ownership, and subdomains from Certificate Transparency logs',
      'Image forensics reading EXIF, GPS and perceptual hashes entirely offline, plus keyless coordinate-to-place resolution',
      'Breach Files archive rebuilt from Have I Been Pwned every six hours by a scheduled GitHub Action, alongside 20+ written OSINT guides',
      'One engine behind three front doors — the myrecon.xyz web app, a terminal client, and an Android app currently in closed beta — so a CLI answer and a web answer can never drift apart',
    ],
  },
  {
    id: 'endpointradar',
    category: 'security',
    featured: true,
    icon: '📡',
    name: 'EndpointRadar',
    tagline: 'Agentless Endpoint Posture Scanner',
    blurb:
      'Finds out how exposed a Windows machine really is — antivirus, firewall, patching, open ports, running services and installed software — then scores the risk, explains it in plain English, and maps it to NIST CSF 2.0.',
    accent: '#5DA9E9',
    gradient: 'from-sky-500 via-blue-500 to-indigo-600',
    logo: '/endpointradar-logo.svg',
    live: 'https://4ryanwalia.github.io/EndpointRadar/',
    liveLabel: 'Live demo & docs',
    github: 'https://github.com/4ryanwalia/EndpointRadar',
    status: 'OPEN SOURCE · MIT',
    tech: ['Python', 'Flask', 'PySide6', 'WinRM', 'Nmap', 'NIST CSF 2.0'],
    metrics: [
      { k: 'Deployment', v: 'Agentless' },
      { k: 'Interfaces', v: 'CLI · Desktop · API' },
      { k: 'Framework', v: 'NIST CSF 2.0' },
      { k: 'CI', v: 'Automated' },
    ],
    highlights: [
      'Agentless multi-device assessment over WinRM — no software to install on the target host',
      'Audits antivirus state, firewall rules, patch currency, listening ports, running services and installed applications',
      'Risk scoring that names its top drivers as a weighted breakdown instead of an unexplained number',
      'Findings mapped to NIST CSF 2.0 with plain-English remediation guidance',
      'Three interfaces off one engine: a CLI, a PySide6 desktop dashboard, and a web API streaming live progress over Server-Sent Events',
    ],
  },
  {
    id: 'bugsnaps',
    category: 'service',
    featured: true,
    icon: '🐞',
    name: 'BugSnaps',
    tagline: 'VAPT & Security Audits — my venture',
    blurb:
      'I founded BugSnaps to help growing businesses find vulnerabilities before attackers do: penetration testing and security audits run to OWASP WSTG and PTES, with fixed pricing and a free retest built into every engagement.',
    accent: '#22c55e',
    gradient: 'from-emerald-500 via-green-500 to-teal-600',
    logo: '/bugsnaps-logo.svg',
    live: 'https://bugsnaps.in',
    liveLabel: 'Open bugsnaps.in',
    status: 'FOUNDER · ACCEPTING CLIENTS',
    motto: 'Find. Fix. Fortify.',
    tech: ['OWASP WSTG', 'PTES', 'Burp Suite', 'Nessus', 'Metasploit', 'OWASP ZAP'],
    metrics: [
      { k: 'Report turnaround', v: '5 business days' },
      { k: 'Retest', v: 'Free, included' },
      { k: 'Pricing', v: 'Fixed after scoping' },
      { k: 'Scoping call', v: 'Free' },
    ],
    highlights: [
      'Web application penetration testing — manual, in-depth, against OWASP Top 10 and business-logic flaws',
      'API security testing across REST and GraphQL, focused on authorization and data exposure',
      'External and internal network assessments that map the real attack surface',
      'Cloud security review — configuration and identity across AWS, GCP and Azure',
      'Security-focused source code review of critical paths',
      'Hands-on fix and remediation support, then a free retest to prove the fix holds',
    ],
  },
  {
    id: 'rakshak',
    category: 'ai',
    icon: '🚨',
    name: 'Rakshak',
    tagline: 'AI Road Accident Detection',
    blurb:
      'Detects road accidents from camera images using PyTorch transfer learning, exported to ONNX so the live demo runs entirely inside your browser — no server, no upload, nothing leaves the machine.',
    accent: '#f97316',
    gradient: 'from-orange-500 via-red-500 to-rose-600',
    live: 'https://4ryanwalia.github.io/Rakshak---Car/',
    liveLabel: 'Try the browser demo',
    github: 'https://github.com/4ryanwalia/Rakshak---Car',
    status: 'LIVE DEMO',
    tech: ['PyTorch', 'ONNX', 'onnxruntime-web', 'Computer Vision', 'Transfer Learning'],
    metrics: [
      { k: 'Inference', v: 'In-browser' },
      { k: 'Model', v: 'PyTorch → ONNX' },
      { k: 'Uploads', v: 'None' },
      { k: 'Use case', v: 'Road safety' },
    ],
    highlights: [
      'Image classifier trained with transfer learning to separate accident scenes from ordinary road imagery',
      'Exported to ONNX and served through onnxruntime-web, so inference happens client-side',
      'Designed to feed roadside camera analysis that can trigger emergency alerts',
      'Zero-upload architecture keeps every image on the user’s own device',
    ],
  },
  {
    id: 'phishing',
    category: 'ai',
    icon: '🎣',
    name: 'Phishing Detection System',
    tagline: 'Malicious URL Classifier',
    blurb:
      'A machine-learning classifier that extracts 30+ lexical and host-based features from a URL and scores how likely it is to be malicious, trained on a dataset I assembled myself.',
    accent: '#06b6d4',
    gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
    github: 'https://github.com/4ryanwalia/Phishing-detection',
    status: 'ACADEMIC PROJECT',
    tech: ['Python', 'scikit-learn', 'Random Forest', 'Logistic Regression', 'Pandas'],
    metrics: [
      { k: 'Features', v: '30+' },
      { k: 'Models', v: 'RF · LogReg' },
      { k: 'Dataset', v: 'Self-built' },
      { k: 'Type', v: 'Supervised' },
    ],
    highlights: [
      'Extracts 30+ lexical and host-based features from each URL',
      'Random Forest and Logistic Regression trained and compared on a self-collected dataset',
      'Feature engineering aimed at the signals phishing URLs actually leak',
    ],
  },
  {
    id: 'wakeme',
    category: 'app',
    icon: '⏰',
    name: 'Wake Me',
    tagline: 'Smart Alarm Clock — on Google Play',
    blurb:
      'A smart alarm app I designed, built and shipped to the Play Store: sleep detection, one-tap quick alarms and hardened security, with Firebase Realtime Database keeping state in sync across devices.',
    accent: '#22d3ee',
    gradient: 'from-cyan-400 via-teal-500 to-blue-600',
    live: 'https://play.google.com/store/apps/details?id=makeme.aryan.makeme',
    liveLabel: 'Get it on Google Play',
    status: 'PUBLISHED ON GOOGLE PLAY',
    image: true,
    tech: ['Android', 'Java', 'Kotlin', 'Firebase', 'Realtime Database'],
    metrics: [
      { k: 'Platform', v: 'Android' },
      { k: 'Backend', v: 'Firebase' },
      { k: 'Status', v: 'Published' },
      { k: 'Sync', v: 'Real-time' },
    ],
    highlights: [
      'Smart sleep detection that monitors phone activity to learn sleep patterns',
      'One-tap quick alarms for the common case',
      'Hardened handling of user data',
      'Firebase Realtime Database syncing alarms across a user’s devices',
    ],
  },
];

/* ─── SKILLS ─── */
export const skillGroups = [
  {
    id: 'soc',
    label: 'SOC & SIEM',
    icon: '🖥️',
    accent: '#10b981',
    blurb: 'Monitoring, triage and incident investigation.',
    skills: ['FortiSIEM', 'Splunk', 'Log analysis', 'Alert triage', 'Security event monitoring', 'Incident investigation', 'Escalation', 'MITRE ATT&CK mapping', 'FortiSOAR playbooks', 'Incident documentation'],
  },
  {
    id: 'offensive',
    label: 'VAPT & Offensive',
    icon: '🎯',
    accent: '#ef4444',
    blurb: 'Finding the gaps before somebody else does.',
    skills: ['Nmap', 'Nessus', 'OpenVAS / Greenbone', 'Burp Suite', 'Metasploit', 'OWASP ZAP', 'GoPhish', 'Wireshark', 'OWASP Top 10', 'Vulnerability assessment'],
  },
  {
    id: 'osint',
    label: 'OSINT & Threat Intel',
    icon: '🔍',
    accent: '#8b5cf6',
    blurb: 'Turning public signal into attributable intelligence.',
    skills: ['Username footprinting', 'Email footprinting', 'Breach-exposure analysis', 'RDAP / WHOIS', 'DNS-over-HTTPS enumeration', 'IP / ASN attribution', 'Certificate Transparency', 'Image forensics'],
  },
  {
    id: 'infra',
    label: 'Endpoint & Network',
    icon: '🛡️',
    accent: '#0ea5e9',
    blurb: 'Hardening the things that hold everything up.',
    skills: ['Firewall rule review', 'Open-port review', 'Endpoint configuration', 'AV / EDR assessment', 'Hardening', 'Segmentation', 'Routing & switching', 'Access control', 'Network monitoring'],
  },
  {
    id: 'code',
    label: 'Automation & Code',
    icon: '⚙️',
    accent: '#f59e0b',
    blurb: 'The tooling that makes the rest repeatable.',
    skills: ['Python', 'Flask', 'PySide6', 'REST APIs', 'Server-Sent Events', 'WinRM', 'JavaScript', 'SQL (MySQL / PostgreSQL)', 'Bash', 'Git', 'scikit-learn'],
  },
  {
    id: 'standards',
    label: 'Frameworks & Cloud',
    icon: '📋',
    accent: '#14b8a6',
    blurb: 'The standards the work gets measured against.',
    skills: ['MITRE ATT&CK', 'NIST', 'NIST CSF 2.0', 'ISO 27001', 'OWASP Top 10', 'ITGC', 'AWS', 'Azure', 'Windows', 'Linux (Ubuntu, Kali)'],
  },
];

/* ─── EXPERIENCE ─── */
export const experience = [
  {
    kind: 'work',
    icon: '🌐',
    role: 'Network Engineer',
    org: 'Ogma Consulting, Gurugram',
    period: '08/2026 — Present',
    current: true,
    points: [
      'Configure and maintain enterprise network infrastructure — routing, switching and firewall policies.',
      'Support network security controls including access control, segmentation and network monitoring across client environments.',
    ],
  },
  {
    kind: 'work',
    icon: '🛡️',
    role: 'Cyber Security Engineer — Intern',
    org: 'Niveshan Technologies India Pvt. Ltd., Delhi',
    period: '01/2026 — 07/2026',
    points: [
      'Monitored and triaged the FortiSIEM alert queue — validating detections against raw log evidence, separating true positives from noise, and escalating confirmed incidents with a written investigation trail.',
      'Onboarded devices and log sources, and monitored collector health to keep detection coverage intact.',
      'Used Splunk to pivot across endpoint, firewall and authentication sources, reconstructing incident timelines and mapping adversary behaviour to MITRE ATT&CK.',
      'Ran authenticated configuration reviews over WinRM against Windows and Linux hosts, reporting risk-rated gaps and tracking remediation through to firewall port closure.',
      'Built and tuned FortiSOAR playbooks, and ran vulnerability assessments across AWS-hosted and on-premises hosts with Nessus, OpenVAS and Nmap.',
      'Conducted phishing analysis and internal awareness testing with GoPhish, reporting click and credential-submission metrics to leadership.',
    ],
  },
  {
    kind: 'founder',
    icon: '🐞',
    role: 'Founder',
    org: 'BugSnaps · bugsnaps.in',
    period: 'Ongoing',
    current: true,
    points: [
      'Founded a VAPT and security-audit practice for growing businesses.',
      'Web app, API, network and cloud penetration testing to OWASP WSTG and PTES, with clear reporting and a free retest in every engagement.',
    ],
  },
  {
    kind: 'education',
    icon: '🎓',
    role: 'MCA — Cyber Security',
    org: 'NMIMS University, Mumbai',
    period: '07/2024 — 06/2026',
    points: ['GPA 7.87 / 10'],
  },
  {
    kind: 'work',
    icon: '💻',
    role: 'Web Developer — Intern',
    org: 'Headway, Delhi',
    period: '07/2022 — 08/2022',
    points: ['Built responsive front-end components for brand websites using HTML, CSS and JavaScript.'],
  },
  {
    kind: 'education',
    icon: '🎓',
    role: 'BCA — Web Development',
    org: 'The NorthCap University, Gurugram',
    period: '06/2021 — 04/2024',
    points: ['GPA 7.31 / 10'],
  },
];

/* ─── CERTIFICATIONS ─── */
export const certifications = [
  { name: 'Certified Ethical Hacker (CEH)', issuer: 'EC-Council', icon: '🛡️', accent: '#10b981' },
  { name: 'Fortinet NSE 1, NSE 2 & NSE 3', issuer: 'Fortinet', icon: '🔐', accent: '#ef4444' },
  { name: 'CISA', issuer: 'ISACA — in preparation', icon: '📊', accent: '#f59e0b', pending: true },
  { name: 'OT/ICS-SCADA Cybersecurity', issuer: 'Udemy', icon: '🏭', accent: '#8b5cf6' },
  { name: 'Cybersecurity 101', issuer: 'TryHackMe', icon: '🎯', accent: '#06b6d4' },
  { name: 'Supervised Machine Learning', issuer: 'Coursera', icon: '🤖', accent: '#3b82f6' },
];

/* ─── ROLES ─── */
export const availableRoles = [
  { icon: '🖥️', title: 'SOC Analyst', desc: 'Monitoring & incident response', color: '#10b981' },
  { icon: '🔍', title: 'Security Analyst', desc: 'Threat analysis & operations', color: '#06b6d4' },
  { icon: '🧠', title: 'Threat Intelligence', desc: 'Hunting & OSINT', color: '#8b5cf6' },
  { icon: '🎯', title: 'VAPT / Pentest', desc: 'Offensive assessment', color: '#ef4444' },
  { icon: '🌐', title: 'Network Security', desc: 'Firewalls & segmentation', color: '#0ea5e9' },
  { icon: '⚙️', title: 'Security Automation', desc: 'Python tooling & SOAR', color: '#f59e0b' },
];
