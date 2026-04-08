'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const MONTH_IMAGES = {
  1:  'https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=700&q=80',
  2:  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=700&q=80',
  3:  'https://images.unsplash.com/photo-1490750967868-88df5691cc43?w=700&q=80',
  4:  'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=700&q=80',
  5:  'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=700&q=80',
  6:  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80',
  7:  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80',
  8:  'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=700&q=80',
  9:  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80',
  10: 'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=700&q=80',
  11: 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=700&q=80',
  12: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=700&q=80',
};

const HOLIDAYS = {
  '01-01':'New Year\'s Day','01-26':'Republic Day','02-14':'Valentine\'s Day',
  '03-17':'St. Patrick\'s Day','04-14':'Dr. Ambedkar Jayanti','04-22':'Earth Day',
  '05-01':'Labour Day','06-21':'World Music Day','07-04':'Independence Day (US)',
  '08-15':'Independence Day','09-05':'Teachers\' Day','10-02':'Gandhi Jayanti',
  '10-31':'Halloween','11-11':'Veterans Day','12-25':'Christmas Day','12-31':'New Year\'s Eve',
};

const NOTE_COLORS = ['#2a6496','#c0735a','#4a8c5c','#8b5a9e','#b5892a','#4a7a9e'];

function getDaysInMonth(y, m) { return new Date(y, m, 0).getDate(); }

function getFirstDayOfWeek(y, m) {
  const d = new Date(y, m - 1, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

function dateStr(y, m, d) {
  return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

function buildGrid(y, m) {
  const today = new Date();
  const dim = getDaysInMonth(y, m);
  const first = getFirstDayOfWeek(y, m);
  const pm = m === 1 ? 12 : m - 1;
  const py = m === 1 ? y - 1 : y;
  const dppm = getDaysInMonth(py, pm);
  const nm = m === 12 ? 1 : m + 1;
  const ny = m === 12 ? y + 1 : y;
  const cells = [];
  for (let i = first - 1; i >= 0; i--) {
    const day = dppm - i;
    cells.push({ day, month: pm, year: py, cur: false, dateStr: dateStr(py, pm, day), isToday: false });
  }
  for (let d = 1; d <= dim; d++) {
    cells.push({ day: d, month: m, year: y, cur: true, dateStr: dateStr(y, m, d), isToday: today.getFullYear() === y && today.getMonth() + 1 === m && today.getDate() === d });
  }
  const rem = 42 - cells.length;
  for (let d = 1; d <= rem; d++) {
    cells.push({ day: d, month: nm, year: ny, cur: false, dateStr: dateStr(ny, nm, d), isToday: false });
  }
  return cells;
}

function inRange(ds, s, e) {
  if (!s || !e) return false;
  const t = new Date(ds), a = new Date(s), b = new Date(e);
  const [lo, hi] = a <= b ? [a, b] : [b, a];
  return t >= lo && t <= hi;
}

function isEdge(ds, s, e) {
  if (!s) return {};
  if (!e || s === e) return { isStart: ds === s, isEnd: ds === s, isSingle: ds === s };
  const [lo, hi] = new Date(s) <= new Date(e) ? [s, e] : [e, s];
  return { isStart: ds === lo, isEnd: ds === hi, isSingle: false };
}

function fmtShort(ds) {
  if (!ds) return '';
  const [, m, d] = ds.split('-').map(Number);
  return `${MONTHS[m-1].slice(0,3)} ${d}`;
}

function fmtTime(dt) {
  return new Date(dt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function daysBetween(s, e) {
  return Math.ceil(Math.abs(new Date(e) - new Date(s)) / 86400000) + 1;
}

const now = new Date();
const Y = now.getFullYear(), M = now.getMonth() + 1;
function ds(y, m, d) { return dateStr(y, m, d); }

const MOCK_EVENTS = [
  { id: '1', title: 'Team Standup',       desc: 'Daily sync with the engineering team.',          date: ds(Y,M,3),  time: '09:00 AM – 09:30 AM', color: '#2a6496' },
  { id: '2', title: 'Design Review',      desc: 'Review new UI mockups and give feedback.',        date: ds(Y,M,5),  time: '2:00 PM – 3:00 PM',   color: '#8b5a9e' },
  { id: '3', title: 'Sprint Planning',    desc: 'Plan the upcoming 2-week sprint.',                date: ds(Y,M,7),  time: 'All day',             color: '#4a8c5c' },
  { id: '4', title: 'Product Demo',       desc: 'Showcase calendar component to stakeholders.',   date: ds(Y,M,10), time: '11:00 AM – 12:00 PM', color: '#c0735a' },
  { id: '5', title: "Lunch with Alex",    desc: 'Catch up at the new Italian place downtown.',    date: ds(Y,M,12), time: '1:00 PM – 2:00 PM',   color: '#b5892a' },
  { id: '6', title: 'Code Review',        desc: 'Deep-dive review of calendar component PRs.',    date: ds(Y,M,14), time: '3:30 PM – 4:30 PM',   color: '#2a6496' },
  { id: '7', title: 'Dentist',            desc: 'Annual checkup. Bring insurance card.',          date: ds(Y,M,16), time: '10:00 AM – 11:00 AM', color: '#c0735a' },
  { id: '8', title: 'All-Hands Meeting',  desc: 'Quarterly engineering all-hands. Q2 roadmap.',   date: ds(Y,M,18), time: 'All day',             color: '#4a7a9e' },
  { id: '9', title: 'Team Offsite',       desc: 'Two-day offsite at the mountain retreat.',       date: ds(Y,M,20), time: 'All day',             color: '#4a8c5c' },
  { id:'10', title: 'Project Deadline',   desc: 'Final submission for the calendar challenge.',    date: ds(Y,M,25), time: 'All day',             color: '#c0735a' },
  { id:'11', title: "Sarah's Birthday 🎂",desc: "Don't forget to send a card!",                  date: ds(Y,M,22), time: 'All day',             color: '#b5892a' },
  { id:'12', title: 'Weekly 1:1',         desc: 'Check-in with manager. Discuss priorities.',     date: ds(Y,M,8),  time: '10:00 AM – 10:30 AM', color: '#4a8c5c' },
];

export default function Page() {
  const today = new Date();
  const [year, setYear]       = useState(today.getFullYear());
  const [month, setMonth]     = useState(today.getMonth() + 1);
  const [rangeStart, setRS]   = useState(null);
  const [rangeEnd, setRE]     = useState(null);
  const [hover, setHover]     = useState(null);
  const [tab, setTab]         = useState('month');
  const [monthNote, setMN]    = useState('');
  const [stickyNotes, setSN]  = useState([]);
  const [noteInput, setNI]    = useState('');
  const [noteColor, setNC]    = useState(NOTE_COLORS[0]);
  const [modal, setModal]     = useState(null);
  const [imgLoaded, setIL]    = useState(false);
  const [imgErr, setIE]       = useState(false);
  const imgKey = `${year}-${month}`;

  useEffect(() => { setIL(false); setIE(false); }, [month, year]);

  useEffect(() => {
    try {
      const mn = localStorage.getItem('cal-month-notes');
      const sn = localStorage.getItem('cal-sticky-notes');
      if (mn) setMN(JSON.parse(mn)[`${year}-${month}`] || '');
      if (sn) setSN(JSON.parse(sn));
    } catch {}
  }, [year, month]);

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem('cal-month-notes') || '{}');
      existing[`${year}-${month}`] = monthNote;
      localStorage.setItem('cal-month-notes', JSON.stringify(existing));
    } catch {}
  }, [monthNote, year, month]);

  useEffect(() => {
    try { localStorage.setItem('cal-sticky-notes', JSON.stringify(stickyNotes)); } catch {}
  }, [stickyNotes]);

  const grid = buildGrid(year, month);
  const effectiveEnd = rangeStart && !rangeEnd && hover ? hover : rangeEnd;
  const selecting = !!(rangeStart && !rangeEnd);

  function prevMonth() {
    if (month === 1) { setYear(y => y-1); setMonth(12); }
    else setMonth(m => m-1);
  }
  function nextMonth() {
    if (month === 12) { setYear(y => y+1); setMonth(1); }
    else setMonth(m => m+1);
  }
  function goToday() { setYear(today.getFullYear()); setMonth(today.getMonth()+1); }

  function clickDay(cell) {
    if (!cell.cur) {
      setYear(cell.year); setMonth(cell.month); return;
    }
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRS(cell.dateStr); setRE(null);
    } else {
      setRE(cell.dateStr);
      setTab('range');
    }
  }

  function addNote() {
    if (!noteInput.trim()) return;
    const note = { id: Date.now().toString(), text: noteInput.trim(), color: noteColor, start: rangeStart || dateStr(year, month, 1), end: effectiveEnd || rangeStart || dateStr(year, month, 1), createdAt: new Date().toISOString() };
    setSN(prev => [note, ...prev]);
    setNI('');
  }

  function eventsForDay(ds) {
    return MOCK_EVENTS.filter(e => e.date === ds);
  }

  const holiday = (ds) => {
    if (!ds) return null;
    return HOLIDAYS[ds.slice(5)] || null;
  };

  const selLabel = !rangeStart ? '' : (!effectiveEnd || rangeStart === effectiveEnd) ? fmtShort(rangeStart) : `${fmtShort(rangeStart)} → ${fmtShort(effectiveEnd)} · ${daysBetween(rangeStart, effectiveEnd)} days`;

  const visibleNotes = rangeStart
    ? stickyNotes.filter(n => {
        const ns = new Date(n.start), ne = new Date(n.end || n.start);
        const rs = new Date(rangeStart), re = new Date(effectiveEnd || rangeStart);
        const [lo, hi] = rs <= re ? [rs, re] : [re, rs];
        return ns <= hi && ne >= lo;
      })
    : stickyNotes;

  return (
    <div className="page-bg">
      <div className="calendar-wrap">
        <div className="binding-bar">
          {Array.from({length: 13}).map((_,i) => <div key={i} className="binding-ring" />)}
        </div>

        <div className="calendar-card">
          <div className="cal-layout">

            <div className="hero-side">
              {!imgLoaded && !imgErr && <div style={{ position:'absolute', inset:0, background:'#2a3a4a' }} />}
              {!imgErr && (
                <Image
                  key={imgKey}
                  src={MONTH_IMAGES[month]}
                  alt={MONTHS[month-1]}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="hero-img"
                  style={{ opacity: imgLoaded ? 1 : 0, objectFit: 'cover' }}
                  onLoad={() => setIL(true)}
                  onError={() => setIE(true)}
                />
              )}
              <div className="hero-overlay" />
              <div className="hero-bottom">
                <div className="hero-month">{MONTHS[month-1]}</div>
                <div className="hero-year">{year}</div>
              </div>
            </div>

            <div className="right-side">
              <div className="cal-header">
                <div className="cal-month-label">{MONTHS[month-1]} {year}</div>
                <div className="cal-nav">
                  <button className="today-btn" onClick={goToday}>Today</button>
                  <button className="nav-btn" onClick={prevMonth}>‹</button>
                  <button className="nav-btn" onClick={nextMonth}>›</button>
                </div>
              </div>

              {rangeStart && (
                <div className="range-bar">
                  <span>{selecting ? 'Click to set end date…' : selLabel}</span>
                  <button className="range-clear" onClick={() => { setRS(null); setRE(null); }}>×</button>
                </div>
              )}

              <div>
                <div className="day-names">
                  {DAYS.map((d, i) => (
                    <div key={d} className={`day-name${i >= 5 ? ' weekend' : ''}`}>{d}</div>
                  ))}
                </div>
                <div className="divider" />
                <div className="days-grid">
                  {grid.map((cell, idx) => {
                    const inR = inRange(cell.dateStr, rangeStart, effectiveEnd);
                    const { isStart, isEnd, isSingle } = isEdge(cell.dateStr, rangeStart, effectiveEnd);
                    const dayIdx = (new Date(cell.dateStr + 'T00:00:00').getDay() + 6) % 7;
                    const isWE = dayIdx >= 5;
                    const evts = eventsForDay(cell.dateStr);
                    const hol = holiday(cell.dateStr);

                    let cellClass = 'day-cell';
                    if (isSingle) cellClass += ' single-day';
                    else if (isStart) cellClass += ' range-start-edge';
                    else if (isEnd) cellClass += ' range-end-edge';
                    else if (inR) cellClass += ' in-range';

                    let numClass = 'day-num';
                    if (!cell.cur) numClass += ' other-month';
                    else if (isSingle) numClass += ' selected-single';
                    else if (isStart) numClass += ' selected-start';
                    else if (isEnd) numClass += ' selected-end';
                    else if (cell.isToday) numClass += ' today';
                    else if (isWE && cell.cur) numClass += ' weekend-day';

                    return (
                      <div
                        key={idx}
                        className={cellClass}
                        onClick={() => { clickDay(cell); }}
                        onDoubleClick={() => cell.cur && setModal(cell.dateStr)}
                        onMouseEnter={() => selecting && setHover(cell.dateStr)}
                        onMouseLeave={() => setHover(null)}
                        title={hol || undefined}
                      >
                        <div className={numClass}>{cell.day}</div>
                        <div className="event-dots">
                          {evts.slice(0,3).map(e => (
                            <span key={e.id} className="event-dot" style={{ background: e.color }} />
                          ))}
                          {hol && cell.cur && <span className="event-dot" style={{ background: '#c0735a' }} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {!rangeStart && (
                <p className="hint-text">Click a date to start selection · Double-click to view events</p>
              )}
            </div>
          </div>

          <div className="notes-panel">
            <div className="notes-tabs">
              <button className={`notes-tab${tab === 'month' ? ' active' : ''}`} onClick={() => setTab('month')}>
                Month Notes
              </button>
              <button className={`notes-tab${tab === 'range' ? ' active' : ''}`} onClick={() => setTab('range')}>
                Sticky Notes {stickyNotes.length > 0 ? `(${stickyNotes.length})` : ''}
              </button>
            </div>

            <div className="notes-body">
              {tab === 'month' && (
                <textarea
                  className="month-note-area"
                  placeholder="Write your monthly goals, reminders, or plans here…"
                  value={monthNote}
                  onChange={e => setMN(e.target.value)}
                  rows={5}
                />
              )}

              {tab === 'range' && (
                <div>
                  <div className="add-note-row">
                    <input
                      className="note-input"
                      placeholder={rangeStart ? `Note for ${fmtShort(rangeStart)}…` : 'Select dates first, then add a note…'}
                      value={noteInput}
                      onChange={e => setNI(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addNote()}
                    />
                    <button className="add-btn" onClick={addNote} disabled={!noteInput.trim()}>+</button>
                  </div>
                  <div className="color-dots">
                    <span style={{ fontSize: 11, color: '#aaa' }}>Color:</span>
                    {NOTE_COLORS.map(c => (
                      <button
                        key={c}
                        className={`color-dot-btn${noteColor === c ? ' active' : ''}`}
                        style={{ background: c }}
                        onClick={() => setNC(c)}
                      />
                    ))}
                  </div>
                  <div className="sticky-notes-list">
                    {visibleNotes.length === 0 && (
                      <p style={{ fontSize: 12, color: '#bbb', textAlign: 'center', padding: '16px 0' }}>
                        {rangeStart ? 'No notes for this selection' : 'No notes yet'}
                      </p>
                    )}
                    {visibleNotes.map(note => (
                      <div key={note.id} className="sticky-note" style={{ borderLeftColor: note.color }}>
                        <div className="sticky-note-meta">
                          {note.start === note.end ? fmtShort(note.start) : `${fmtShort(note.start)} → ${fmtShort(note.end)}`}
                        </div>
                        {note.text}
                        <button className="note-delete" onClick={() => setSN(prev => prev.filter(n => n.id !== note.id))}>×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-subtitle">{new Date(modal + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' })}</div>
                <div className="modal-title">{fmtShort(modal)}, {modal.split('-')[0]}</div>
                {holiday(modal) && <span className="holiday-chip">🎉 {holiday(modal)}</span>}
              </div>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="modal-body">
              {eventsForDay(modal).length === 0 ? (
                <div className="no-events">No events scheduled</div>
              ) : (
                eventsForDay(modal).map(evt => (
                  <div key={evt.id} className="event-item" style={{ borderLeftColor: evt.color }}>
                    <div className="event-name">{evt.title}</div>
                    <div className="event-time">{evt.time}</div>
                    {evt.desc && <div className="event-desc">{evt.desc}</div>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}