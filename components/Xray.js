import React, { useCallback, useEffect, useRef, useState } from 'react';

/* ── THE X-RAY ─────────────────────────────────────────────────────────────
 *
 * The page is a report printed on paper. Hold the lens over it and you get the
 * machine's view of the same page: inverted, gridded, measured, with a live
 * read of whatever is under it.
 *
 * It is one fixed layer whose backdrop-filter inverts the pixels behind it,
 * clipped to a circle that follows the pointer. Nothing is duplicated, so it
 * works over anything on the page, screenshots and canvases included.
 *
 * Pointer: it tracks the cursor. Touch: drag it around. Keys: X toggles,
 * Escape closes, [ and ] resize it.
 */

const R_MIN = 70;
const R_MAX = 260;
const R_DEFAULT = 148;

/* What the readout calls the thing under the lens. */
function describe(x, y) {
  if (typeof document === 'undefined' || !document.elementFromPoint) return null;
  const el = document.elementFromPoint(x, y);
  if (!el) return null;
  const tagged = el.closest('[data-xray]');
  if (tagged) return tagged.getAttribute('data-xray');
  const section = el.closest('section[id], footer, header');
  if (!section) return null;
  return section.id || section.tagName.toLowerCase();
}

export default function Xray({ open, setOpen }) {
  const rootRef = useRef(null);
  const readRef = useRef(null);
  const [radius, setRadius] = useState(R_DEFAULT);
  /* Rendered once the browser has told us it can do the effect at all. */
  const [supported, setSupported] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const can =
      typeof CSS !== 'undefined' &&
      CSS.supports &&
      (CSS.supports('backdrop-filter', 'invert(1)') || CSS.supports('-webkit-backdrop-filter', 'invert(1)'));
    setSupported(Boolean(can));
    posRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  }, []);

  /* X toggles from anywhere, Escape closes, brackets resize. Typing in a field
     is never hijacked. */
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      const typing = t instanceof HTMLElement && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName));
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      } else if (open && (e.key === '[' || e.key === ']')) {
        e.preventDefault();
        setRadius((r) => Math.max(R_MIN, Math.min(R_MAX, r + (e.key === ']' ? 26 : -26))));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  const paint = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    const { x, y } = posRef.current;
    el.style.setProperty('--lx', `${x}px`);
    el.style.setProperty('--ly', `${y}px`);
    if (readRef.current) {
      const what = describe(x, y);
      readRef.current.innerHTML = `x ${String(Math.round(x)).padStart(4, '0')} · y ${String(Math.round(y)).padStart(4, '0')}<br/>surface <b>${
        what ? what.replace(/[<&]/g, '') : 'page'
      }</b><br/>lens <b>${radius * 2}px</b>`;
    }
  }, [radius]);

  /* Follow the pointer while the lens is open. One rAF per frame, and the
     listeners only exist while it is open, so a closed lens costs nothing. */
  useEffect(() => {
    if (!open) return undefined;
    let raf = 0;
    const schedule = () => {
      if (!raf) {
        raf = window.requestAnimationFrame(() => {
          raf = 0;
          paint();
        });
      }
    };
    const onPointer = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      schedule();
    };
    const onTouch = (e) => {
      const t = e.touches[0];
      if (!t) return;
      posRef.current = { x: t.clientX, y: t.clientY };
      schedule();
    };

    paint();
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [open, paint]);

  useEffect(() => {
    if (open) paint();
  }, [open, radius, paint]);

  /* While the lens is up it is the instrument: the crosshair's own label steps aside. */
  useEffect(() => {
    document.documentElement.toggleAttribute('data-xray', open);
    return () => document.documentElement.removeAttribute('data-xray');
  }, [open]);

  /* Nothing is mounted while the lens is off, so a closed lens costs nothing. */
  if (!supported || !open) return null;

  return (
    <>
      <div ref={rootRef} aria-hidden="true">
        <div className="xray-glass" style={{ '--lens-r': `${radius}px` }} />
        <div className="xray-mesh" style={{ '--lens-r': `${radius}px` }} />
        <div className="xray-ring" style={{ '--lens-r': `${radius}px` }} />
        <div className="xray-read" style={{ '--lens-r': `${radius}px` }} ref={readRef} />
      </div>

      <button type="button" className="xray-hint" onClick={() => setOpen(false)} aria-label="Turn the x-ray off">
        x-ray on
        <span className="hidden sm:inline text-[var(--text-faint)]">
          <kbd className="kbd">[</kbd> <kbd className="kbd">]</kbd> size
        </span>
        <span className="hidden sm:inline text-[var(--text-faint)]">
          <kbd className="kbd">esc</kbd> off
        </span>
        <span className="sm:hidden text-[var(--text-faint)]">drag it · tap here to close</span>
      </button>
    </>
  );
}

/* The control in the nav bar. */
export function XrayButton({ open, setOpen, className = '' }) {
  return (
    <button
      type="button"
      aria-pressed={open}
      onClick={() => setOpen((v) => !v)}
      title="See this page the way a scanner does (X)"
      className={`xray-btn ${className}`}
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="M11 7.5v7M7.5 11h7M20 20l-3.6-3.6" />
      </svg>
      X-ray
    </button>
  );
}
