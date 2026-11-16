import React from 'react';

/* Every section opens the same plain way: its name, set very large on a full-width rule, with
   its number at the far end and one factual line under it. No slogans.
   As the section scrolls in, the name slides across from the right and the rule draws itself
   (see .sec-* in globals.css). */
export default function SectionHead({ index, title, line, children }) {
  return (
    <header className="sec-head">
      <div className="sec-head-row">
        <h2 className="sec-title display">{title}</h2>
        <span className="sec-index mono" aria-hidden="true">
          {index}
        </span>
      </div>
      <span className="sec-rule" aria-hidden="true" />
      {(line || children) && (
        <div className="sec-meta">
          {line && <p className="lede max-w-2xl">{line}</p>}
          {children && <div className="flex flex-wrap items-center gap-x-5 gap-y-2">{children}</div>}
        </div>
      )}
    </header>
  );
}
