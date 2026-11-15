/* Effects that are driven by the visitor's scroll position, direction and speed. */
import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';

const wrapRange = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/* A band of text that drifts on its own, speeds up with the scroll wheel and reverses when you
   scroll back up. The content is repeated so the loop never shows a gap. */
export function VelocityMarquee({ children, baseVelocity = 2.2, className = '' }) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const skew = useTransform(smooth, [-2500, 2500], [-7, 7]);
  const x = useTransform(baseX, (v) => `${wrapRange(-25, 0, v)}%`);
  const direction = useRef(baseVelocity < 0 ? -1 : 1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const speed = Math.abs(baseVelocity);
    const b = boost.get();
    if (b < 0) direction.current = baseVelocity < 0 ? 1 : -1;
    else if (b > 0) direction.current = baseVelocity < 0 ? -1 : 1;
    const step = direction.current * speed * (Math.min(delta, 50) / 1000) * (1 + Math.min(Math.abs(b), 12));
    baseX.set(baseX.get() - step);
  });

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <motion.div className="flex w-max" style={{ x, skewX: reduce ? 0 : skew }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-shrink-0">
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/*
 * A circuit trace that runs the whole length of the page, down the gutters and across the gaps
 * between sections. As you scroll, the trace lights up behind a glowing probe that keeps pace with
 * you, and each section's checkpoint switches on as the probe reaches it. It reads as the page
 * being scanned.
 *
 * Mount it as the first child of a positioned wrapper that contains every section. It sits behind
 * the content (z-index -1 inside the wrapper's stacking context), so it only ever shows in the
 * gutters and gaps, never over text.
 */
export function ScrollTrace({ sections }) {
  const rootRef = useRef(null);
  const basePathRef = useRef(null);
  const litPathRef = useRef(null);
  const glowPathRef = useRef(null);
  const headRef = useRef(null);
  const labelRef = useRef(null);
  const nodeRefs = useRef([]);
  const [geo, setGeo] = useState(null);
  const key = sections.map((s) => s.id).join(',');

  /* 1. Measure the page and lay the trace out. Re-run whenever the page changes height. */
  useEffect(() => {
    const root = rootRef.current;
    const host = root?.parentElement;
    if (!root || !host) return undefined;
    let raf = 0;

    const measure = () => {
      const hostBox = host.getBoundingClientRect();
      const W = host.clientWidth;
      const H = host.scrollHeight;
      const gutter = W >= 1240 ? 44 : W >= 768 ? 16 : 8;
      const r = W >= 768 ? 22 : 10;
      const xs = [gutter, W - gutter];

      const stops = sections
        .map((s) => {
          const el = document.getElementById(s.id);
          return el ? { ...s, top: el.getBoundingClientRect().top - hostBox.top } : null;
        })
        .filter(Boolean);
      if (stops.length < 2) return;

      // The trace starts in the left gutter a little above the first stop, then swaps sides in
      // the empty band just above each following section.
      let side = 0;
      const startY = Math.max(0, stops[0].top - 160);
      let d = `M ${xs[0]} ${startY}`;
      const nodes = [{ id: stops[0].id, label: stops[0].label, x: xs[0], y: stops[0].top + 6 }];
      for (let i = 1; i < stops.length; i += 1) {
        const yc = Math.round(stops[i].top - 46);
        const from = xs[side];
        const to = xs[1 - side];
        const dir = to > from ? 1 : -1;
        d += ` L ${from} ${yc - r} Q ${from} ${yc} ${from + dir * r} ${yc} L ${to - dir * r} ${yc} Q ${to} ${yc} ${to} ${yc + r}`;
        side = 1 - side;
        nodes.push({ id: stops[i].id, label: stops[i].label, x: to, y: yc + r + 30 });
      }
      const last = stops[stops.length - 1];
      const lastEl = document.getElementById(last.id);
      const endY = Math.min(H - 20, last.top + (lastEl ? lastEl.offsetHeight : 400) - 40);
      d += ` L ${xs[side]} ${endY}`;

      setGeo((prev) => (prev && prev.d === d && prev.W === W && prev.H === H ? prev : { d, W, H, nodes, right: xs[1] }));
    };

    const schedule = () => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(measure);
    };
    measure();
    const ro = new ResizeObserver(schedule);
    ro.observe(host);
    window.addEventListener('resize', schedule);
    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', schedule);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  /* 2. Keep the probe level with the middle of the screen. */
  useEffect(() => {
    const root = rootRef.current;
    const host = root?.parentElement;
    const path = litPathRef.current;
    if (!geo || !root || !host || !path) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const total = path.getTotalLength();
    [litPathRef.current, glowPathRef.current].forEach((p) => {
      p.style.strokeDasharray = `${total}`;
      p.style.strokeDashoffset = `${total}`;
    });

    // Sample the path so a page offset can be turned into a distance along it. y never
    // decreases along the trace, so the table can be binary searched.
    const STEP = 10;
    const count = Math.ceil(total / STEP) + 1;
    const ys = new Float32Array(count);
    for (let i = 0; i < count; i += 1) ys[i] = path.getPointAtLength(Math.min(total, i * STEP)).y;
    const lengthAt = (y) => {
      let lo = 0;
      let hi = count - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (ys[mid] <= y) lo = mid;
        else hi = mid - 1;
      }
      return Math.min(total, lo * STEP);
    };
    const nodeLengths = geo.nodes.map((n) => lengthAt(n.y));

    let current = 0;
    let target = 0;
    let raf = 0;
    let running = false;
    let lastLabel = -1;
    let lastTime = 0;

    const paint = () => {
      const offset = `${total - current}`;
      litPathRef.current.style.strokeDashoffset = offset;
      glowPathRef.current.style.strokeDashoffset = offset;
      const pt = path.getPointAtLength(current);
      const head = headRef.current;
      head.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0)`;
      head.style.opacity = current > 4 && current < total - 4 ? '1' : '0';
      head.dataset.side = pt.x > geo.W / 2 ? 'right' : 'left';

      let active = -1;
      nodeLengths.forEach((len, i) => {
        const hit = current >= len - 2;
        if (hit) active = i;
        const el = nodeRefs.current[i];
        if (el) el.dataset.hit = hit ? 'true' : 'false';
      });
      if (active !== lastLabel && labelRef.current) {
        lastLabel = active;
        labelRef.current.textContent = active >= 0 ? `${String(active + 1).padStart(2, '0')} ${geo.nodes[active].label}` : 'ready';
      }
    };

    const tick = (now) => {
      // Time-based easing, so the probe keeps pace at any frame rate.
      const dt = lastTime ? Math.min(100, now - lastTime) : 16;
      lastTime = now;
      const diff = target - current;
      current = reduce || Math.abs(diff) < 0.6 ? target : current + diff * (1 - Math.exp(-dt / 110));
      paint();
      if (current !== target) raf = window.requestAnimationFrame(tick);
      else {
        running = false;
        lastTime = 0;
      }
    };
    const onScroll = () => {
      // how far down the wrapper the middle of the screen currently is
      const y = window.innerHeight * 0.55 - host.getBoundingClientRect().top;
      target = lengthAt(y);
      if (!running) {
        running = true;
        raf = window.requestAnimationFrame(tick);
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [geo]);

  return (
    <div ref={rootRef} className="scroll-trace" aria-hidden="true">
      {geo && (
        <>
          <svg width={geo.W} height={geo.H} viewBox={`0 0 ${geo.W} ${geo.H}`} fill="none">
            <path ref={basePathRef} d={geo.d} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2 7" strokeLinecap="round" />
            <path ref={glowPathRef} d={geo.d} stroke="rgba(200,245,96,0.14)" strokeWidth="7" strokeLinecap="round" />
            <path ref={litPathRef} d={geo.d} stroke="rgba(200,245,96,0.85)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>

          {geo.nodes.map((n, i) => (
            <span
              key={n.id}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              className="trace-node"
              data-hit="false"
              data-side={n.x > geo.W / 2 ? 'right' : 'left'}
              style={{ left: n.x, top: n.y }}
            />
          ))}

          <span ref={headRef} className="trace-head" data-side="left" style={{ opacity: 0 }}>
            <span className="trace-head-ping" />
            <span className="trace-head-chip">
              scanning <b ref={labelRef}>ready</b>
            </span>
          </span>
        </>
      )}
    </div>
  );
}
