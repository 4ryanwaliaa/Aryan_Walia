/* Interaction primitives shared across the page.
 *
 * Scroll motion is done by the browser, not by JavaScript: elements carry a
 * `data-rise` attribute or a class, and globals.css binds their animation to
 * their own position in the viewport (`animation-timeline: view()`). That runs
 * off the main thread, so nothing on scroll can stutter. Browsers without
 * scroll-driven animations simply show everything in place.
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

export const EASE = [0.16, 1, 0.3, 1];

/* Marks an element to rise into place as it scrolls into view. Spread it onto any element.
   Any arguments older call sites pass are ignored: timing now comes from the scroll. */
export const reveal = () => ({ 'data-rise': '' });

/* ── Redact ────────────────────────────────────────────────────────────────
 * A word arrives under a solid bar of ink and the bar slides off, leaving the word
 * behind. Used once, on the hero headline. The real text is always in the DOM.
 */
export function Redact({ children, delay = 0, tone = 'ink', className = '' }) {
  const toneClass = tone === 'pen' ? 'is-pen' : tone === 'flag' ? 'is-flag' : '';
  /* lit from the first paint: the bar is a CSS animation, so the words are readable even
     before the page's JavaScript arrives, and without it */
  return (
    <span className={`redact is-lit ${toneClass} ${className}`} style={{ '--redact-delay': `${delay}s` }}>
      <span>{children}</span>
    </span>
  );
}

/* Pulls its child a little toward the cursor. */
export function Magnetic({ children, strength = 0.14, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 260, damping: 20, mass: 0.6 });
  const y = useSpring(0, { stiffness: 260, damping: 20, mass: 0.6 });

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

/* A hairline at the very top that tracks how far down the page you are. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return <motion.div aria-hidden="true" className="fixed top-0 inset-x-0 h-[2px] origin-left z-[70] bg-[var(--accent)]" style={{ scaleX }} />;
}

/* ── Crosshair ─────────────────────────────────────────────────────────────
 * Two hairlines across the viewport, a small open square on the pointer and a
 * live read of its position. Pointer devices only, one write per frame.
 */
export function Crosshair() {
  const ref = useRef(null);
  const readRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;
    let px = -999;
    let py = -999;
    let hot = false;

    const paint = () => {
      raf = 0;
      el.style.setProperty('--cx', `${px}px`);
      el.style.setProperty('--cy', `${py}px`);
      el.dataset.hot = hot ? 'true' : 'false';
      if (readRef.current) readRef.current.textContent = `${String(Math.round(px)).padStart(4, '0')} ${String(Math.round(py)).padStart(4, '0')}`;
    };
    const move = (e) => {
      px = e.clientX;
      py = e.clientY;
      hot = Boolean(e.target instanceof Element && e.target.closest('a, button, [role="tab"], input, label, [data-hot]'));
      if (!raf) raf = window.requestAnimationFrame(paint);
      el.dataset.on = 'true';
    };
    const leave = () => {
      el.dataset.on = 'false';
    };

    window.addEventListener('mousemove', move, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', move);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <div ref={ref} className="crosshair" data-on="false" data-hot="false" aria-hidden="true">
      <i className="h" />
      <i className="v" />
      <s />
      <b ref={readRef}>0000 0000</b>
    </div>
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

/* ── Preview ───────────────────────────────────────────────────────────────
 * A screenshot that follows the pointer while you hover a name that has one.
 * Pass the image (a static import) or null. Pointer devices only; touch users
 * get the link and the inline thumbnails instead.
 */
export function PreviewFloat({ image, alt = '' }) {
  const ref = useRef(null);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    setFine(true);
    let raf = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      raf = 0;
      if (ref.current) ref.current.style.translate = `${x + 26}px ${y - 70}px`;
    };
    const move = (e) => {
      x = Math.min(e.clientX, window.innerWidth - 360);
      y = Math.max(90, Math.min(e.clientY, window.innerHeight - 160));
      if (!raf) raf = window.requestAnimationFrame(paint);
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', move);
    };
  }, []);

  if (!fine) return null;
  return (
    <div ref={ref} className={`preview-float ${image ? 'is-on' : ''}`} aria-hidden="true">
      {image && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={image.src || image} alt={alt} width={320} height={200} />
      )}
    </div>
  );
}
