import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { profile, projects } from './portfolioData';
import { EASE } from './fx';
import { ProjectMark } from './shared';

const SECTIONS = [
  ['top', 'Top of the page'],
  ['proof', 'Proof: the real deal'],
  ['ecosystem', 'Work: the BugSnaps orbit'],
  ['apps', 'Apps on Google Play'],
  ['case-studies', 'Case studies'],
  ['work', 'More builds'],
  ['capabilities', 'What I build'],
  ['journey', 'Track record'],
  ['contact', 'Contact'],
];

const openTab = (url) => window.open(url, '_blank', 'noopener,noreferrer');

/* A keyboard-first way around the page. Ctrl+K or / opens it. */
export default function CommandPalette({ open, setOpen }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const [note, setNote] = useState('');
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const openerRef = useRef(null);

  const commands = useMemo(
    () => [
      ...SECTIONS.map(([id, label]) => ({
        group: 'Go to',
        label,
        hint: `#${id}`,
        run: () => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.history.replaceState(null, '', `#${id}`);
        },
      })),
      ...projects
        .filter((p) => p.live)
        .map((p) => ({
          group: 'Open live',
          label: p.name,
          hint: p.live.replace(/^https?:\/\//, '').replace(/\/$/, ''),
          project: p,
          run: () => openTab(p.live),
        })),
      {
        group: 'Actions',
        label: 'Copy my email address',
        hint: profile.email,
        keep: true,
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            setNote('Email copied to your clipboard');
          } catch {
            setNote(profile.email);
          }
        },
      },
      {
        group: 'Actions',
        label: 'Download my resume',
        hint: 'PDF',
        run: () => {
          const a = document.createElement('a');
          a.href = `${router.basePath}/Aryan_Walia.pdf?v=20261028`;
          a.download = 'Aryan_Walia_Resume.pdf';
          document.body.appendChild(a);
          a.click();
          a.remove();
        },
      },
      { group: 'Actions', label: 'About me: music, moodboard, opinions', hint: '/about', run: () => router.push('/about') },
      { group: 'Actions', label: 'View my resume', hint: '/resume', run: () => router.push('/resume') },
      { group: 'Actions', label: 'Open LinkedIn', hint: 'linkedin.com/in/4ryanwalia', run: () => openTab(profile.linkedin) },
      { group: 'Actions', label: 'Open GitHub', hint: 'github.com/4ryanwalia', run: () => openTab(profile.github) },
      { group: 'Actions', label: 'Open my Google Play developer page', hint: 'play.google.com', run: () => openTab(profile.playDeveloper) },
    ],
    [router]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.group} ${c.label} ${c.hint}`.toLowerCase().includes(q));
  }, [commands, query]);

  /* global shortcuts */
  useEffect(() => {
    const onKey = (e) => {
      const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  /* focus, scroll lock and restore */
  useEffect(() => {
    if (!open) return undefined;
    openerRef.current = document.activeElement;
    setQuery('');
    setCursor(0);
    setNote('');
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
      if (openerRef.current instanceof HTMLElement && openerRef.current.isConnected) openerRef.current.focus();
    };
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [cursor, results]);

  const run = (command) => {
    if (!command) return;
    command.run();
    if (!command.keep) setOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((n) => (results.length ? (n + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((n) => (results.length ? (n - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(results[cursor]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'Tab') {
      /* keep focus in the search box; the list is driven with the arrow keys */
      e.preventDefault();
    }
  };

  let lastGroup = null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[250] flex items-start justify-center px-4 pt-[12vh]"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            initial={{ opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
            className="relative w-full max-w-xl rounded-2xl border border-[var(--line-strong)] bg-[#0d0e10]/95 backdrop-blur-xl shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 border-b border-[var(--line)]">
              <span className="mono text-[var(--accent)] text-sm" aria-hidden="true">
                &gt;
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCursor(0);
                }}
                placeholder="Jump to a section, open a product, copy my email..."
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-autocomplete="list"
                aria-label="Search commands"
                className="palette-input flex-1 bg-transparent py-4 text-[15px] text-white placeholder:text-[var(--text-faint)]"
              />
              <kbd className="kbd">Esc</kbd>
            </div>

            <ul id="palette-list" ref={listRef} role="listbox" aria-label="Commands" className="max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-[var(--text-faint)]">Nothing matches that. Try &ldquo;apps&rdquo; or &ldquo;resume&rdquo;.</li>}
              {results.map((c, i) => {
                const header = c.group !== lastGroup ? c.group : null;
                lastGroup = c.group;
                const on = i === cursor;
                return (
                  <React.Fragment key={`${c.group}-${c.label}`}>
                    {header && (
                      <li role="presentation" className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)] px-3 pt-3 pb-1.5">
                        {header}
                      </li>
                    )}
                    <li
                      role="option"
                      aria-selected={on}
                      onMouseMove={() => setCursor(i)}
                      onClick={() => run(c)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                        on ? 'bg-[var(--accent)]/[0.12] text-white' : 'text-[var(--text-dim)]'
                      }`}
                    >
                      {c.project ? (
                        <ProjectMark project={c.project} size={22} rounded="rounded-md" />
                      ) : (
                        <span className={`w-[22px] text-center mono text-xs ${on ? 'text-[var(--accent)]' : 'text-[var(--text-faint)]'}`} aria-hidden="true">
                          {c.group === 'Go to' ? '#' : '↵'}
                        </span>
                      )}
                      <span className="flex-1 text-sm truncate">{c.label}</span>
                      <span className="mono text-[10px] text-[var(--text-faint)] truncate max-w-[45%]">{c.hint}</span>
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>

            <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-[var(--line)] mono text-[10px] text-[var(--text-faint)]">
              <span aria-live="polite" className={note ? 'text-[var(--accent)]' : ''}>
                {note || 'Use the arrow keys, then Enter'}
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <kbd className="kbd">Ctrl</kbd>
                <kbd className="kbd">K</kbd>
                to toggle
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
