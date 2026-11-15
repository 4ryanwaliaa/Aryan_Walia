/* Interaction primitives shared across the page.
   Every effect here switches itself off for prefers-reduced-motion and for touch-only devices
   where it would do nothing useful. */
import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion';

export const EASE = [0.16, 1, 0.3, 1];

/* Fade-and-rise as an element scrolls into view. Spread onto any motion element. */
export const reveal = (delay = 0, y = 22) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, delay, ease: EASE },
});

/* One line of a heading that slides up from behind a mask. */
export function MaskLine({ children, delay = 0, className = '' }) {
  return (
    <span className={`block overflow-hidden py-[0.14em] -my-[0.14em] ${className}`}>
      <motion.span
        className="block"
        initial={{ y: '110%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* Pulls its child a little toward the cursor, like a magnet. */
export function Magnetic({ children, strength = 0.3, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.6 });
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.6 });

  const onMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ x, y }} className={`inline-flex ${className}`}>
      {children}
    </motion.span>
  );
}

/* Tilts its content in 3D toward the cursor, with a soft glare that follows it. */
export function Tilt({ children, max = 7, className = '', glare = true }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 160, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 160, damping: 18 });

  const onMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rotateY.set(px * max * 2);
    rotateX.set(-py * max * 2);
    ref.current.style.setProperty('--gx', `${(px + 0.5) * 100}%`);
    ref.current.style.setProperty('--gy', `${(py + 0.5) * 100}%`);
  };
  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={`tilt relative ${className}`}
    >
      {children}
      {glare && <span className="tilt-glare" aria-hidden="true" />}
    </motion.div>
  );
}

/* Counts up to `to` the first time it scrolls into view. Renders the final value on the server. */
export function CountUp({ to, decimals = 0, duration = 1.8 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(to);

  useEffect(() => {
    if (!inView || reduce) return undefined;
    const controls = animate(0, to, { duration, ease: EASE, onUpdate: setVal });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {val.toFixed(decimals)}
    </span>
  );
}

/* Thin accent bar across the top that tracks how far down the page you are. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return <motion.div aria-hidden="true" className="fixed top-0 inset-x-0 h-[2px] origin-left z-[70] bg-[var(--accent)]" style={{ scaleX }} />;
}

/* A soft ring that trails the pointer and swells over anything clickable. The native cursor stays. */
export function CursorRing() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 380, damping: 30, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 380, damping: 30, mass: 0.5 });
  const [on, setOn] = useState(false);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    setOn(true);
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target instanceof Element ? e.target.closest('a, button, [role="tab"], input, label, [data-hot]') : null;
      setHot(Boolean(target));
    };
    const leave = () => {
      x.set(-200);
      y.set(-200);
    };
    window.addEventListener('mousemove', move, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, [x, y]);

  if (!on) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="cursor-ring"
      style={{ x: sx, y: sy }}
      animate={{ scale: hot ? 1.9 : 1, opacity: hot ? 1 : 0.5 }}
      transition={{ duration: 0.25, ease: EASE }}
    />
  );
}

/* Which of the given section ids is currently crossing the middle of the viewport. */
export function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  const key = ids.join(',');

  useEffect(() => {
    const els = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!els.length || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);

  return active;
}

const GLYPHS = '01<>/\\[]{}#$%&*+=?';

/* Cycles through `words`, decoding each one out of noise like a terminal resolving a hash. */
export function ScrambleWords({ words, interval = 2600, className = '' }) {
  const reduce = useReducedMotion();
  const [text, setText] = useState(words[0]);

  useEffect(() => {
    if (reduce) return undefined;
    let index = 0;
    let frame = 0;
    let raf = 0;
    let timer = 0;

    const run = () => {
      const from = words[index];
      index = (index + 1) % words.length;
      const to = words[index];
      const total = 26;
      frame = 0;
      const step = () => {
        frame += 1;
        const progress = frame / total;
        const length = Math.round(from.length + (to.length - from.length) * progress);
        const locked = Math.floor(to.length * Math.max(0, (progress - 0.25) / 0.75));
        let out = '';
        for (let i = 0; i < length; i += 1) {
          if (i < locked) out += to[i];
          else if (to[i] === ' ') out += ' ';
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setText(frame >= total ? to : out);
        if (frame < total) raf = window.setTimeout(step, 34);
      };
      step();
      timer = window.setTimeout(run, interval);
    };

    timer = window.setTimeout(run, interval);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(raf);
    };
  }, [words, interval, reduce]);

  return (
    <span className={className}>
      <span aria-hidden="true">{text}</span>
      <span className="sr-only">{words.join(', ')}</span>
    </span>
  );
}

/* Drifting points that link up when they pass close to each other, and reach for the cursor.
   Reads as an attack-surface map. Pauses when off screen or when the tab is hidden. */
export function Constellation({ className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let points = [];
    let raf = 0;
    let running = false;
    let onScreen = true;
    const mouse = { x: -9999, y: -9999 };
    const LINK = 130;
    const REACH = 190;

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(24, Math.min(96, Math.round((w * h) / 15000)));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.3 + 0.5,
        hot: Math.random() < 0.12,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        for (let j = i + 1; j < points.length; j += 1) {
          const q = points[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const a = (1 - Math.sqrt(d2) / LINK) * 0.16;
            ctx.strokeStyle = `rgba(255,255,255,${a})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        const mx = p.x - mouse.x;
        const my = p.y - mouse.y;
        const md = Math.sqrt(mx * mx + my * my);
        if (md < REACH) {
          const a = (1 - md / REACH) * 0.55;
          ctx.strokeStyle = `rgba(200,245,96,${a})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          /* a gentle push away from the cursor */
          p.x += (mx / (md || 1)) * 0.35;
          p.y += (my / (md || 1)) * 0.35;
        }

        ctx.fillStyle = p.hot ? 'rgba(200,245,96,0.9)' : 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.hot ? p.r + 0.6 : p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      draw();
      raf = window.requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce || !onScreen || document.hidden) return;
      running = true;
      raf = window.requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      window.cancelAnimationFrame(raf);
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onResize = () => {
      seed();
      if (reduce) draw();
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    seed();
    draw();
    start();

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([entry]) => {
            onScreen = entry.isIntersecting;
            if (onScreen) start();
            else stop();
          })
        : null;
    io?.observe(canvas);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      io?.disconnect();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
