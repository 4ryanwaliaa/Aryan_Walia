import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { scan } from './scanData';
import { EASE } from './fx';
import { ArrowIcon } from './shared';

/*
 * The MyPentest scan replay from bugsnaps.in, rebuilt so the visitor's scroll is the clock.
 * The section pins to the screen and scrolling walks the scan through its four phases:
 * ownership verified, surface mapped under a radar sweep, probes sent down every branch,
 * findings lighting up by severity, then the report.
 *
 * One canvas and one rAF loop; counters and phase bars are written straight to the DOM.
 * The loop only runs while the section is on screen.
 */

// Timeline, in milliseconds of "scan time". Scroll progress 0..1 maps onto 0..T_END.
const T_MAP = 1600;
const T_TEST = 6000;
const T_REPORT = 11600;
const T_END = 14400;
const PHASE_STARTS = [0, T_MAP, T_TEST, T_REPORT, T_END];
const TRAVEL = 620;

const SEV_COLOR = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#60a5fa',
  info: '#71717a',
};
const LOUD = ['critical', 'high', 'medium'];
const ACCENT = '200,245,96';

const PHASES = [
  { name: 'Verify', title: 'Prove you own it.', text: 'Nothing is sent until a DNS TXT record proves the domain is yours. No proof, no scan.' },
  { name: 'Map', title: 'Map the attack surface.', text: 'The crawler reads pages, forms and JavaScript to find every endpoint in scope, including the ones nobody remembers shipping.' },
  { name: 'Test', title: 'Test it like an attacker.', text: '56 checks go down every branch, signed in as three test accounts, asking who can read whose data.' },
  { name: 'Report', title: 'Hand over the fixes.', text: `${scan.findings} findings in ${scan.groups} groups. Every one comes with a CVSS score, the evidence and the exact fix.` },
];

const ease = (t) => {
  const c = Math.min(1, Math.max(0, t));
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

const hexA = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/* Deterministic shuffle, so the replay is the same on every visit. */
function scramble(items) {
  const out = [...items];
  let seed = 7;
  for (let i = out.length - 1; i > 0; i -= 1) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/* Places every discovered path around the target, grouped by its top-level folder. */
function layout() {
  const root = scan.nodes.find((n) => n.path === '/');
  const leaves = scan.nodes.filter((n) => n.path !== '/');
  const branches = [...new Set(leaves.map((n) => n.branch))];
  const total = leaves.length || 1;

  const nodes = [];
  let cursor = -Math.PI / 2;
  branches.forEach((branch) => {
    const members = leaves.filter((n) => n.branch === branch);
    const span = (members.length / total) * Math.PI * 2;
    const hub = members.length > 1 ? { angle: cursor + span / 2, radius: 0.46 } : null;
    members.forEach((node, i) => {
      const angle = cursor + (span * (i + 0.5)) / members.length;
      const sweep = (angle + Math.PI / 2) / (Math.PI * 2);
      nodes.push({
        path: node.path,
        severity: node.severity,
        angle,
        radius: members.length > 1 ? (i % 2 ? 0.8 : 0.95) : 0.72,
        hub,
        appearAt: T_MAP + sweep * (T_TEST - T_MAP - 400),
        testAt: 0,
        labelled: node.severity === 'critical' || node.severity === 'high',
      });
    });
    cursor += span;
  });

  const order = scramble(nodes);
  const testSpan = T_REPORT - T_TEST - TRAVEL - 300;
  order.forEach((node, i) => {
    node.testAt = T_TEST + (testSpan * i) / Math.max(1, order.length - 1);
  });
  return { center: root ? root.severity : null, nodes };
}

/* The log that scrolls beside the radar. */
function script(nodes) {
  const lines = [
    { at: 250, text: `target ${scan.asset}`, tone: 'muted' },
    { at: 900, text: 'DNS TXT record found · ownership verified', tone: 'ok' },
    { at: T_MAP + 150, text: 'mapping pages, forms, scripts and APIs', tone: 'muted' },
  ];
  const discovered = [...nodes].sort((a, b) => a.appearAt - b.appearAt);
  [0.2, 0.5, 0.8]
    .map((f) => discovered[Math.floor(f * (discovered.length - 1))])
    .filter(Boolean)
    .forEach((node) => lines.push({ at: node.appearAt, text: `found ${node.path}`, tone: 'muted' }));
  lines.push({ at: T_TEST + 100, text: `signed in as ${scan.identities} test accounts`, tone: 'ok' });

  const used = new Set();
  scan.headlines.forEach((headline) => {
    if (used.size >= 4) return;
    const node = nodes.find((n) => n.path === headline.path);
    if (!node || used.has(headline.title)) return;
    used.add(headline.title);
    lines.push({ at: node.testAt + TRAVEL, text: headline.title, tone: headline.severity });
  });
  lines.push({ at: T_REPORT + 300, text: `report · ${scan.findings} findings · ${scan.urgent} critical or high`, tone: 'ok' });
  return lines.sort((a, b) => a.at - b.at);
}

const TONE_CLASS = {
  muted: 'text-[var(--text-dim)]',
  ok: 'text-[var(--accent)]',
  critical: 'text-[#f87171]',
  high: 'text-[#fb923c]',
  medium: 'text-[#facc15]',
};
const TONE_MARK = { muted: '›', ok: '✓', critical: '!', high: '!', medium: '!' };

export default function ScanTheatre() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const barRefs = useRef([]);
  const statRefs = useRef([]);
  const targetRef = useRef(0);
  const { center, nodes } = useMemo(() => layout(), []);
  const lines = useMemo(() => script(nodes), [nodes]);
  const [phase, setPhase] = useState(0);
  const [shown, setShown] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    targetRef.current = Math.min(1, Math.max(0, p)) * T_END;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const section = sectionRef.current;
    if (!canvas || !stage || !section) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mono = '"JetBrains Mono", ui-monospace, monospace';
    let width = 0;
    let height = 0;
    let dpr = 1;
    let t = targetRef.current;
    let frame = 0;
    let running = false;
    let lastShown = -1;
    let lastPhase = -1;
    let lastTime = 0;

    // Pointer parallax: the outer ring drifts further than the centre.
    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;
    const onPointer = (event) => {
      if (event.pointerType !== 'mouse') return;
      const box = stage.getBoundingClientRect();
      tx = ((event.clientX - box.left) / box.width - 0.5) * 2;
      ty = ((event.clientY - box.top) / box.height - 0.5) * 2;
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };

    const hud = () => {
      const active = Math.min(3, Math.max(0, PHASE_STARTS.findIndex((start, i) => t >= start && t < PHASE_STARTS[i + 1])));
      const current = t >= T_END ? 3 : active;
      if (current !== lastPhase) {
        lastPhase = current;
        setPhase(current);
      }
      barRefs.current.forEach((bar, i) => {
        if (!bar) return;
        const start = PHASE_STARTS[i];
        const end = PHASE_STARTS[i + 1];
        const p = t >= end ? 1 : t <= start ? 0 : (t - start) / (end - start);
        bar.style.transform = `scaleX(${p})`;
      });
      const mapped = nodes.filter((n) => t >= n.appearAt).length + (t >= T_MAP ? 1 : 0);
      const requests = Math.round(scan.requests * ease((t - T_TEST) / (T_REPORT - T_TEST)));
      const flashed = nodes.filter((n) => t >= n.testAt + TRAVEL).length;
      const findings = t >= T_REPORT ? scan.findings : Math.round((scan.findings * flashed) / Math.max(1, nodes.length));
      [mapped, requests, findings].forEach((value, i) => {
        const el = statRefs.current[i];
        if (el) el.textContent = value.toLocaleString('en-IN');
      });
      const count = lines.filter((line) => line.at <= t).length;
      if (count !== lastShown) {
        lastShown = count;
        setShown(count);
      }
    };

    const draw = (now) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      px += (tx - px) * 0.06;
      py += (ty - py) * 0.06;

      const cx = width / 2;
      const cy = height / 2;
      const narrow = width < 480;
      const R = Math.min(width * (narrow ? 0.31 : 0.36), height * 0.43);
      const at = (angle, radius) => {
        const depth = radius * 12;
        return {
          x: cx + Math.cos(angle) * radius * R + px * depth,
          y: cy + Math.sin(angle) * radius * R + py * depth,
        };
      };

      // Scope rings and crosshair.
      ctx.lineWidth = 1;
      [0.33, 0.66, 1].forEach((f) => {
        ctx.strokeStyle = `rgba(255,255,255,${f === 1 ? 0.1 : 0.06})`;
        ctx.beginPath();
        ctx.arc(cx + px * f * 6, cy + py * f * 6, R * f * 1.02, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.strokeStyle = 'rgba(255,255,255,0.045)';
      ctx.beginPath();
      ctx.moveTo(cx - R * 1.08, cy);
      ctx.lineTo(cx + R * 1.08, cy);
      ctx.moveTo(cx, cy - R * 1.08);
      ctx.lineTo(cx, cy + R * 1.08);
      ctx.stroke();

      // Radar sweep: bright while mapping, a slow ghost that keeps turning afterwards.
      const mapping = t >= T_MAP && t < T_TEST;
      const sweepAngle = mapping
        ? -Math.PI / 2 + ((t - T_MAP) / (T_TEST - T_MAP - 400)) * Math.PI * 2
        : -Math.PI / 2 + (now / 5200) * Math.PI * 2;
      const strength = mapping ? 1 : t < T_MAP ? 0 : 0.28;
      if (strength > 0) {
        const slices = 16;
        const trail = 0.7;
        for (let i = 0; i < slices; i += 1) {
          const a0 = sweepAngle - (trail * (i + 1)) / slices;
          const a1 = sweepAngle - (trail * i) / slices;
          ctx.fillStyle = `rgba(${ACCENT},${0.15 * strength * (1 - i / slices)})`;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, R * 1.02, a0, a1);
          ctx.closePath();
          ctx.fill();
        }
        ctx.strokeStyle = `rgba(${ACCENT},${0.8 * strength})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(sweepAngle) * R * 1.02, cy + Math.sin(sweepAngle) * R * 1.02);
        ctx.stroke();
      }

      const reporting = t >= T_REPORT;

      // Edges, grown as each node is discovered.
      nodes.forEach((node) => {
        if (t < node.appearAt) return;
        const grow = ease((t - node.appearAt) / 420);
        const tested = t >= node.testAt + TRAVEL;
        const p = at(node.angle, node.radius);
        const loud = node.severity && LOUD.includes(node.severity);
        const alpha = reporting && !node.labelled ? 0.1 : tested && loud ? 0.42 : 0.18;
        ctx.strokeStyle = tested && node.severity ? hexA(SEV_COLOR[node.severity], alpha) : `rgba(148,163,184,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (node.hub) {
          const hub = at(node.hub.angle, node.hub.radius);
          const g1 = Math.min(1, grow * 2);
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + (hub.x - cx) * g1, cy + (hub.y - cy) * g1);
          if (grow > 0.5) {
            const g2 = (grow - 0.5) * 2;
            ctx.moveTo(hub.x, hub.y);
            ctx.lineTo(hub.x + (p.x - hub.x) * g2, hub.y + (p.y - hub.y) * g2);
          }
        } else {
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + (p.x - cx) * grow, cy + (p.y - cy) * grow);
        }
        ctx.stroke();
      });

      // Branch hubs.
      const hubsDrawn = new Set();
      nodes.forEach((node) => {
        if (!node.hub || t < node.appearAt || hubsDrawn.has(node.hub.angle)) return;
        hubsDrawn.add(node.hub.angle);
        const h = at(node.hub.angle, node.hub.radius);
        ctx.fillStyle = reporting ? 'rgba(148,163,184,0.35)' : 'rgba(148,163,184,0.7)';
        ctx.fillRect(h.x - 2, h.y - 2, 4, 4);
      });

      // Probe packets: three per node, the first one is the one that lands.
      if (t >= T_TEST && t < T_REPORT + TRAVEL) {
        nodes.forEach((node) => {
          for (let k = 0; k < 3; k += 1) {
            const start = node.testAt + k * 1300;
            if (t < start || t > start + TRAVEL || start > T_REPORT) continue;
            const q = ease((t - start) / TRAVEL);
            const p = at(node.angle, node.radius);
            let x;
            let y;
            if (node.hub) {
              const h = at(node.hub.angle, node.hub.radius);
              if (q < 0.5) {
                x = cx + (h.x - cx) * q * 2;
                y = cy + (h.y - cy) * q * 2;
              } else {
                x = h.x + (p.x - h.x) * (q - 0.5) * 2;
                y = h.y + (p.y - h.y) * (q - 0.5) * 2;
              }
            } else {
              x = cx + (p.x - cx) * q;
              y = cy + (p.y - cy) * q;
            }
            ctx.fillStyle = k === 0 ? `rgba(${ACCENT},0.95)` : `rgba(${ACCENT},0.45)`;
            ctx.beginPath();
            ctx.arc(x, y, k === 0 ? 2.2 : 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      // Nodes, their flash rings, and report labels.
      ctx.font = `10px ${mono}`;
      ctx.textBaseline = 'middle';
      nodes.forEach((node) => {
        if (t < node.appearAt) return;
        const pop = ease((t - node.appearAt) / 300);
        const p = at(node.angle, node.radius);
        const hit = node.testAt + TRAVEL;
        const tested = t >= hit;
        const color = tested && node.severity ? SEV_COLOR[node.severity] : '#94a3b8';
        const dim = reporting && !node.labelled ? 0.35 : 1;
        const loud = node.severity && LOUD.includes(node.severity);

        if (tested && loud) {
          ctx.fillStyle = hexA(color, 0.18 * dim);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 9, 0, Math.PI * 2);
          ctx.fill();
          const ring = (t - hit) / 900;
          if (ring < 1) {
            ctx.strokeStyle = hexA(color, (1 - ring) * 0.8);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4 + ring * 26, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        ctx.fillStyle = hexA(color, dim);
        ctx.beginPath();
        ctx.arc(p.x, p.y, (tested && loud ? 3.8 : 2.8) * pop, 0, Math.PI * 2);
        ctx.fill();

        // A phone has no room for every label, so only the critical paths are named there.
        if (reporting && node.labelled && (!narrow || node.severity === 'critical')) {
          const show = ease((t - T_REPORT - 200) / 500);
          const right = Math.cos(node.angle) >= 0;
          const lx = p.x + (right ? 12 : -12);
          ctx.globalAlpha = Math.max(0, show);
          ctx.fillStyle = 'rgba(9,9,11,0.85)';
          const max = narrow ? 12 : 20;
          const text = node.path.length > max ? `${node.path.slice(0, max - 1)}…` : node.path;
          const w = ctx.measureText(text).width + 10;
          ctx.fillRect(right ? lx - 3 : lx - w + 3, p.y - 8, w, 16);
          ctx.fillStyle = color;
          ctx.textAlign = right ? 'left' : 'right';
          ctx.fillText(text, lx + (right ? 2 : -2), p.y + 0.5);
          ctx.globalAlpha = 1;
        }
      });

      // The target at the centre.
      const beat = reduce ? 0.5 : (Math.sin(now / 260) + 1) / 2;
      const verified = t >= 900;
      const centreColor = reporting && center ? SEV_COLOR[center] : verified ? '#c8f560' : '#94a3b8';
      ctx.strokeStyle = hexA(centreColor, 0.25 + beat * 0.3);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 13 + beat * 3, 0, Math.PI * 2);
      ctx.stroke();
      if (t < T_MAP) {
        const lock = ease(t / 900);
        ctx.strokeStyle = `rgba(${ACCENT},${0.8 * (1 - lock) + 0.2})`;
        ctx.beginPath();
        ctx.arc(cx, cy, 60 - lock * 40, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = centreColor;
      ctx.beginPath();
      ctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
      ctx.fill();
    };

    const resize = () => {
      const box = stage.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = box.width;
      height = box.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };

    const tick = (now) => {
      // Glide toward wherever the scroll has put the clock, so a jumpy wheel still reads as smooth.
      const target = targetRef.current;
      const dt = lastTime ? Math.min(100, now - lastTime) : 16;
      lastTime = now;
      t = reduce ? target : t + (target - t) * (1 - Math.exp(-dt / 95));
      if (Math.abs(target - t) < 0.5) t = target;
      draw(now);
      hud();
      frame = window.requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      frame = window.requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      lastTime = 0;
      window.cancelAnimationFrame(frame);
    };

    resize();
    draw(0);
    hud();

    const observer = new ResizeObserver(() => {
      resize();
      if (!running) draw(window.performance.now());
    });
    observer.observe(stage);
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { rootMargin: '100px' });
    io.observe(section);
    stage.addEventListener('pointermove', onPointer, { passive: true });
    stage.addEventListener('pointerleave', onLeave);

    return () => {
      stop();
      observer.disconnect();
      io.disconnect();
      stage.removeEventListener('pointermove', onPointer);
      stage.removeEventListener('pointerleave', onLeave);
    };
  }, [center, nodes, lines]);

  const current = PHASES[phase];
  const done = phase === 3;

  return (
    <section id="scan" ref={sectionRef} className="relative h-[430vh]" aria-label="MyPentest scan replay">
      <div className="sticky top-0 h-[100svh] flex flex-col justify-center pt-20 pb-5 lg:pt-24 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-12 items-center">
          {/* what is happening, in words */}
          <div className="lg:col-span-5">
            <span className="eyebrow">MyPentest · live replay</span>
            <h2 className="display text-[2.1rem] sm:text-5xl lg:text-6xl mt-3 lg:mt-5 text-white">
              Scroll to run a <span className="serif text-[var(--accent)]">real scan.</span>
            </h2>

            <div className="relative mt-4 lg:mt-8 min-h-[92px] sm:min-h-[104px] lg:min-h-[150px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <p className="mono text-[11px] tracking-[0.2em] text-[var(--accent)]">
                    PHASE 0{phase + 1} / 04 · {current.name.toUpperCase()}
                  </p>
                  <p className="display text-2xl lg:text-4xl text-white mt-2">{current.title}</p>
                  <p className="text-[var(--text-dim)] text-sm lg:text-base leading-relaxed mt-2 max-w-md">{current.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* the scan log: newest line at the bottom */}
            <ol className="hidden lg:block mono text-[11.5px] leading-[1.9] mt-6 h-[112px] overflow-hidden" aria-hidden="true">
              {lines.slice(Math.max(0, shown - 5), shown).map((line) => (
                <motion.li
                  key={line.at}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2.5 truncate ${TONE_CLASS[line.tone] || TONE_CLASS.muted}`}
                >
                  <span className="w-3 flex-shrink-0 text-center">{TONE_MARK[line.tone] || '›'}</span>
                  <span className="truncate">{line.text}</span>
                </motion.li>
              ))}
            </ol>

            <div className="hidden lg:flex flex-wrap items-center gap-3 mt-6 h-12">
              {done ? (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex flex-wrap gap-3">
                  <a href="https://bugsnaps.in/mypentest" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    Run it on your own app
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </a>
                  <a href="https://bugsnaps.in/mypentest/example-report" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    Open the full report
                  </a>
                </motion.div>
              ) : (
                <span className="mono text-[11px] tracking-[0.16em] text-[var(--text-faint)] flex items-center gap-2">
                  <span className="scroll-cue !h-6" aria-hidden="true" />
                  KEEP SCROLLING. YOUR WHEEL IS THE CLOCK.
                </span>
              )}
            </div>
          </div>

          {/* the radar */}
          <div className="lg:col-span-7 min-w-0">
            <div className="rounded-3xl border border-[var(--line-strong)] bg-[#0b0c0d]/90 backdrop-blur-md shadow-[0_50px_140px_-50px_rgba(200,245,96,0.35)] overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-[var(--line)]">
                <span className="mono text-[10px] text-[var(--text-faint)] truncate">mypentest · {scan.asset}</span>
                <span className="mono text-[10px] text-[var(--accent)] flex items-center gap-1.5 flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                  REPLAY
                </span>
              </div>

              <ol className="grid grid-cols-4 gap-2 px-4 pt-3">
                {PHASES.map((p, i) => (
                  <li
                    key={p.name}
                    className={`mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                      i === phase ? 'text-white' : i < phase ? 'text-[var(--accent)]' : 'text-[var(--text-faint)]'
                    }`}
                  >
                    {p.name}
                    <span className="block h-[2px] mt-1.5 rounded bg-white/10 overflow-hidden">
                      <span
                        ref={(el) => {
                          barRefs.current[i] = el;
                        }}
                        className="block h-full origin-left bg-[var(--accent)]"
                        style={{ transform: 'scaleX(0)' }}
                      />
                    </span>
                  </li>
                ))}
              </ol>

              <div ref={stageRef} className="relative h-[36svh] min-h-[220px] sm:h-[40svh] lg:h-[52svh] lg:max-h-[520px]">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
              </div>

              <dl className="grid grid-cols-3 border-t border-[var(--line)]">
                {['Paths mapped', 'Requests', 'Findings'].map((label, i) => (
                  <div key={label} className="px-4 py-2.5 lg:py-3 border-l first:border-l-0 border-[var(--line)]">
                    <dt className="mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-faint)]">{label}</dt>
                    <dd
                      ref={(el) => {
                        statRefs.current[i] = el;
                      }}
                      className="display text-xl lg:text-2xl text-white mt-0.5 tabular-nums"
                    >
                      0
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="mono text-[10px] text-[var(--text-faint)] mt-3 text-center">
              Replay of a real MyPentest scan of our own deliberately vulnerable test app
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
