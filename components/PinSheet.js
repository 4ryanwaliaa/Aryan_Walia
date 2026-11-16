import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowIcon } from './shared';

/* ─── Photos as a contact sheet ───
   The pins I made, laid out as strips of film on a light table. Each frame keeps its real shape,
   carries the camera-style date stamp of the day it went up, and develops from a negative the
   first time the sheet comes into view. On a mouse, a loupe follows the pointer and magnifies
   whatever frame it is over. Click or tap a frame to open it large, then move with the arrows,
   the arrow keys or a swipe. */

const ZOOM = 2.4;
const LOUPE = 190;

/* '26 10 07, the way a film camera prints it in the corner */
const stamp = (date) => (date ? `'${date.slice(2, 4)} ${date.slice(5, 7)} ${date.slice(8, 10)}` : '');
const longDate = (date) =>
  date ? new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : '';
const ratio = (pin) => (pin.w && pin.h ? pin.w / pin.h : 16 / 9);
const label = (pin, i, total) => `Photo ${i + 1} of ${total}${pin.title ? `, ${pin.title}` : ''}${pin.date ? `, ${longDate(pin.date)}` : ''}`;

export default function PinSheet({ pins, profileUrl }) {
  const sheetRef = useRef(null);
  const loupeRef = useRef(null);
  const reduce = useReducedMotion();
  const [stage, setStage] = useState('positive');
  const [open, setOpen] = useState(null);
  const total = pins.length;

  /* Develop once. The server sends the sheet already developed, so it reads fine without
     JavaScript; the negative is only applied here, while the sheet is still off screen. */
  useEffect(() => {
    const el = sheetRef.current;
    if (!el || reduce || typeof IntersectionObserver === 'undefined') return undefined;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return undefined;
    setStage('negative');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStage('positive');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -25% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  /* The loupe: one element, one write per frame, pointer devices only. */
  useEffect(() => {
    const sheet = sheetRef.current;
    const loupe = loupeRef.current;
    if (!sheet || !loupe || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    let raf = 0;
    let state = null;

    const paint = () => {
      raf = 0;
      if (!state) {
        loupe.dataset.on = 'false';
        document.documentElement.removeAttribute('data-loupe');
        return;
      }
      const { frame, x, y } = state;
      const img = frame.querySelector('img');
      const r = img.getBoundingClientRect();
      const w = Number(frame.dataset.w) || 16;
      const h = Number(frame.dataset.h) || 9;
      /* the frame crops its picture (object-fit: cover); undo that to find the spot under the pointer */
      const s = Math.max(r.width / w, r.height / h);
      const dw = w * s;
      const dh = h * s;
      const px = x - r.left - (r.width - dw) / 2;
      const py = y - r.top - (r.height - dh) / 2;
      if (loupe.dataset.src !== frame.dataset.big) {
        loupe.dataset.src = frame.dataset.big;
        loupe.style.backgroundImage = `url("${frame.dataset.big}"), url("${img.currentSrc || img.src}")`;
      }
      loupe.style.backgroundSize = `${dw * ZOOM}px ${dh * ZOOM}px`;
      loupe.style.backgroundPosition = `${LOUPE / 2 - px * ZOOM}px ${LOUPE / 2 - py * ZOOM}px`;
      loupe.style.translate = `${x - LOUPE / 2}px ${y - LOUPE / 2}px`;
      loupe.dataset.on = 'true';
      document.documentElement.setAttribute('data-loupe', 'on');
    };
    const move = (e) => {
      const frame = e.target instanceof Element ? e.target.closest('.frame') : null;
      state = frame && sheet.dataset.stage !== 'negative' ? { frame, x: e.clientX, y: e.clientY } : null;
      if (!raf) raf = window.requestAnimationFrame(paint);
    };
    const leave = () => {
      state = null;
      if (!raf) raf = window.requestAnimationFrame(paint);
    };
    sheet.addEventListener('pointermove', move, { passive: true });
    sheet.addEventListener('pointerleave', leave);
    window.addEventListener('scroll', leave, { passive: true });
    return () => {
      window.cancelAnimationFrame(raf);
      sheet.removeEventListener('pointermove', move);
      sheet.removeEventListener('pointerleave', leave);
      window.removeEventListener('scroll', leave);
      document.documentElement.removeAttribute('data-loupe');
    };
  }, []);

  if (!total) return null;

  return (
    <>
      <div className="lighttable">
        <div ref={sheetRef} className="sheet" data-stage={stage} role="list" aria-label="Photos I posted to Pinterest">
          {pins.map((pin, i) => {
            const a = ratio(pin);
            return (
              <button
                key={pin.id || pin.url}
                type="button"
                role="listitem"
                className="frame"
                data-w={pin.w || 16}
                data-h={pin.h || 9}
                data-big={pin.big || pin.img}
                style={{ '--a': a, '--i': i }}
                onClick={() => setOpen(i)}
                aria-label={`Open ${label(pin, i, total)}`}
              >
                <span className="frame-edge" aria-hidden="true">
                  <span>{i + 1}</span>
                  <span>{i + 1}A</span>
                </span>
                <span className="frame-pic">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pin.img} alt={pin.alt || pin.title || ''} loading="lazy" decoding="async" draggable={false} referrerPolicy="no-referrer" />
                  {pin.date && (
                    <span className="frame-date" aria-hidden="true">
                      {stamp(pin.date)}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
          <span className="sheet-fill" aria-hidden="true" />
        </div>
        <div ref={loupeRef} className="loupe" data-on="false" aria-hidden="true" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-5">
        <p className="mono text-[10.5px] tracking-[0.1em] uppercase text-[var(--text-faint)]">
          <span className="hidden [@media(hover:hover)]:inline">Hover to look closer, click to open</span>
          <span className="[@media(hover:hover)]:hidden">Tap a frame to open it</span>
        </p>
        <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
          Everything I have posted
          <ArrowIcon className="w-3.5 h-3.5" />
        </a>
      </div>

      <AnimatePresence>
        {open !== null && <Viewer pins={pins} index={open} setIndex={setOpen} onClose={() => setOpen(null)} reduce={reduce} />}
      </AnimatePresence>
    </>
  );
}

/* ─── One photo, large ─── */
function Viewer({ pins, index, setIndex, onClose, reduce }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const total = pins.length;
  const pin = pins[index];
  const [dir, setDir] = useState(1);

  const go = useCallback(
    (step) => {
      setDir(step);
      setIndex((i) => (i + step + total) % total);
    },
    [setIndex, total]
  );

  const handlers = useRef({});
  handlers.current = { go, onClose };

  useEffect(() => {
    const opener = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handlers.current.onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handlers.current.go(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlers.current.go(-1);
      } else if (e.key === 'Tab' && dialogRef.current) {
        const items = [...dialogRef.current.querySelectorAll('a[href], button')].filter((el) => el.getClientRects().length);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, []);

  const onDragEnd = (_, info) => {
    if (info.offset.x < -80 || info.velocity.x < -500) go(1);
    else if (info.offset.x > 80 || info.velocity.x > 500) go(-1);
  };

  return (
    <motion.div
      ref={dialogRef}
      className="viewer"
      role="dialog"
      aria-modal="true"
      aria-label={label(pin, index, total)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <div className="viewer-top" onClick={(e) => e.stopPropagation()}>
        <p className="mono text-[11px] tracking-[0.12em] uppercase">
          Frame {String(index + 1).padStart(2, '0')} <span className="opacity-50">/ {String(total).padStart(2, '0')}</span>
        </p>
        <button ref={closeRef} type="button" onClick={onClose} className="viewer-btn" aria-label="Close">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="viewer-stage">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={pin.id || pin.url}
            className="viewer-pic"
            custom={dir}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 60, filter: 'invert(1) sepia(0.5) saturate(1.6)' }}
            animate={{ opacity: 1, x: 0, filter: 'invert(0) sepia(0) saturate(1)' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -60 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={onDragEnd}
            onClick={(e) => e.stopPropagation()}
            style={{ '--a': ratio(pin), touchAction: 'pan-y' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pin.big || pin.img}
              srcSet={pin.full ? `${pin.big} 736w, ${pin.full} 1600w` : undefined}
              sizes="(max-width: 640px) 100vw, 1100px"
              alt={pin.alt || pin.title || ''}
              draggable={false}
              referrerPolicy="no-referrer"
            />
            {pin.date && (
              <span className="frame-date is-big" aria-hidden="true">
                {stamp(pin.date)}
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="viewer-bar" onClick={(e) => e.stopPropagation()}>
        <div className="min-w-0">
          {pin.title && <p className="viewer-title">{pin.title}</p>}
          {pin.date && <p className="mono text-[10.5px] tracking-[0.1em] uppercase opacity-60 mt-1">Posted {longDate(pin.date)}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button type="button" onClick={() => go(-1)} className="viewer-btn" aria-label="Previous photo">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0l6 6m-6-6l6-6" />
            </svg>
          </button>
          <button type="button" onClick={() => go(1)} className="viewer-btn" aria-label="Next photo">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0l-6-6m6 6l-6 6" />
            </svg>
          </button>
          <a href={pin.url} target="_blank" rel="noopener noreferrer" className="viewer-open">
            On Pinterest
            <ArrowIcon className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
