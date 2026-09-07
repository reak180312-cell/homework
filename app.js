/* Homework — all your homework in one place.
   One file, no build step, no dependencies. Sections below:
   data → dates → store → render → add/edit → completing → onboarding → reminders → boot */

(() => {
'use strict';

/* ── Data ──────────────────────────────────────────────────── */

const PRESETS = [
  { name: 'Math',             icon: 'i-math',      color: '#3E63DD' },
  { name: 'English',          icon: 'i-pencil',    color: '#C2456A' },
  { name: 'Science',          icon: 'i-flask',     color: '#12A594' },
  { name: 'Physics',          icon: 'i-atom',      color: '#7C5CD6' },
  { name: 'Chemistry',        icon: 'i-tube',      color: '#D08A2E' },
  { name: 'Biology',          icon: 'i-leaf',      color: '#4FA83D' },
  { name: 'History',          icon: 'i-hourglass', color: '#A0704A' },
  { name: 'Geography',        icon: 'i-globe',     color: '#2F8FD0' },
  { name: 'Computer Science', icon: 'i-code',      color: '#5B6B7C' },
  { name: 'Literature',       icon: 'i-book',      color: '#B04FA0' },
  // No line icon reads as "Hebrew" at 19px, so it wears an aleph the way
  // custom subjects wear their initials.
  { name: 'Hebrew',           icon: null, glyph: 'א', color: '#C0553D' },
  { name: 'Other',            icon: 'i-bookmark',  color: '#7C7A76' },
];

/* ── Timetable ─────────────────────────────────────────────
   The weekly schedule, taken from the printed timetable. Lesson names are
   kept as the school writes them. Teacher names, room numbers and the
   school's own name are deliberately left out — this file is published,
   and none of that is needed to pack a bag. */

const SCHOOL_DAYS = [
  { js: 0, he: 'ראשון',  en: 'Sunday',    short: 'Sun' },
  { js: 1, he: 'שני',    en: 'Monday',    short: 'Mon' },
  { js: 2, he: 'שלישי',  en: 'Tuesday',   short: 'Tue' },
  { js: 3, he: 'רביעי',  en: 'Wednesday', short: 'Wed' },
  { js: 4, he: 'חמישי',  en: 'Thursday',  short: 'Thu' },
];

const PERIODS = [
  '8:20–9:00', '9:10–9:50', '10:00–10:40', '10:50–11:30',
  '11:55–12:35', '12:45–13:25', '13:35–14:15', '14:20–15:00',
];

// [day index][period index] — null is a free period.
const SCHEDULE = [
  ['מתמטיקה', 'מתמטיקה', 'אזרחות ודמוקרטיה', 'כישורי חיים', 'כישורי שפה', 'כישורי שפה', 'מעבדה', 'מעבדה'],
  ['ביולוגיה', 'חנ״ג', 'ערבית', 'ערבית', 'אנגלית', 'אנגלית', null, null],
  ['תנ״ך', 'תנ״ך', 'מתמטיקה', 'מתמטיקה', 'פיסיקה', 'הסטוריה', null, null],
  ['העשרה / מדמ״ח', 'העשרה / מדמ״ח', 'אזרחות ודמוקרטיה', 'פיסיקה', 'הסטוריה', 'ערבית', 'מתמטיקה', null],
  ['חינוך', 'ביולוגיה', 'חנ״ג', 'ספרות', 'ספרות', 'אנגלית', 'אנגלית', null],
];

// Ties a lesson to a subject you picked at setup, so the bag list can show
// its colour and any homework riding on it. Matched loosely, both languages.
const LESSON_ALIASES = {
  'מתמטיקה':           ['math', 'מתמטיקה'],
  'ביולוגיה':          ['biology', 'ביולוגיה', 'bio'],
  'פיסיקה':            ['physics', 'פיסיקה', 'פיזיקה'],
  'אנגלית':            ['english', 'אנגלית'],
  'הסטוריה':           ['history', 'הסטוריה', 'היסטוריה'],
  'ספרות':             ['literature', 'ספרות'],
  'תנ״ך':              ['tanach', 'bible', 'תנך', 'תנ״ך'],
  'ערבית':             ['arabic', 'ערבית'],
  'אזרחות ודמוקרטיה':  ['civics', 'אזרחות'],
  'חנ״ג':              ['pe', 'sport', 'חנג', 'חנ״ג'],
  'כישורי שפה':        ['hebrew', 'לשון', 'כישורי שפה'],
  'כישורי חיים':       ['כישורי חיים', 'life skills'],
  'חינוך':             ['חינוך', 'homeroom'],
  'העשרה / מדמ״ח':     ['computer', 'מדמ״ח', 'מדמח', 'העשרה'],
  'מעבדה':             ['lab', 'מעבדה', 'science'],
};

/** Every distinct lesson in the week, in the order it first appears. */
const LESSONS = (() => {
  const seen = [];
  for (const row of SCHEDULE) for (const name of row) if (name && !seen.includes(name)) seen.push(name);
  return seen;
})();

// Starting points, not rules — all of it is editable in the app.
const DEFAULT_ITEMS = {
  'מתמטיקה':          ['Notebook', 'Textbook', 'Calculator'],
  'ביולוגיה':          ['Notebook', 'Textbook'],
  'פיסיקה':            ['Notebook', 'Textbook', 'Calculator'],
  'אנגלית':            ['Notebook', 'Textbook'],
  'הסטוריה':           ['Notebook', 'Textbook'],
  'ספרות':             ['Notebook', 'Book'],
  'תנ״ך':              ['Notebook', 'Tanach'],
  'ערבית':             ['Notebook', 'Textbook'],
  'אזרחות ודמוקרטיה':  ['Notebook'],
  'חנ״ג':              ['Sports kit', 'Trainers'],
  'כישורי שפה':        ['Notebook'],
  'כישורי חיים':       ['Notebook'],
  'חינוך':             [],
  'העשרה / מדמ״ח':     ['Laptop', 'Notebook'],
  'מעבדה':             ['Lab coat', 'Notebook'],
};

const DEFAULT_EVERYDAY = ['Water bottle', 'Pencil case', 'Lunchbox'];

/* ── The journey ───────────────────────────────────────────
   Every ten levels is a place. `pin` is where it sits on the passport's
   own world map, as a percentage of that photograph; `card` is where its
   photo hangs, kept clear of the passport's printed text and joined back
   to the pin by a leader line. Both were measured off the map itself. */

/* One level, one place. Each is anchored by real latitude and longitude, so
   the photograph lands on the right country whatever size the passport is
   drawn at. `offset` only slides the photo clear of its neighbours — the pin
   and the flight path always sit on the true coordinates. */

const JOURNEY = [
  { level: 1, id: 'home',        name: 'Home',          country: '',
    lat: 31.8,   lon: 35.0,  photo: null },

  { level: 2, id: 'mountains',   name: 'Mountain Lake', country: 'The Alps',
    lat: 46.5,   lon: 8.5,   photo: 'mountains',   offset: [-10, -12] },

  { level: 3, id: 'santorini',   name: 'Santorini',     country: 'Greece',
    lat: 36.4,   lon: 25.4,  photo: 'santorini',   offset: [-9, 13] },

  { level: 4, id: 'cappadocia',  name: 'Cappadocia',    country: 'Turkey',
    lat: 38.6,   lon: 34.8,  photo: 'cappadocia',  offset: [14, -11] },

  { level: 5, id: 'machupicchu', name: 'Machu Picchu',  country: 'Peru',
    lat: -13.16, lon: -72.5, photo: 'machupicchu', offset: [0, 14], final: true },
];

const MAX_LEVEL = JOURNEY.length;

/* Where the map sits inside img/passport.jpg. Fitted against landmarks read
   off that photograph — the equator lands on 50.2%, Greenwich on 47.4%. */
const MAP = { lon0: 47.4, lonScale: 0.2661, lat0: 50.2, latScale: 0.3183 };

/** Latitude and longitude to a percentage of the passport page. */
const project = (lat, lon) => [
  MAP.lon0 + lon * MAP.lonScale,
  MAP.lat0 - lat * MAP.latScale,
];

const pinOf = (d) => project(d.lat, d.lon);

/** Where the photograph hangs: on its pin, nudged clear of its neighbours. */
function photoAt(d) {
  const [x, y] = pinOf(d);
  const [dx, dy] = d.offset || [0, 0];
  return [x + dx, y + dy];
}

const stopFor = (level) => JOURNEY[Math.min(level, MAX_LEVEL) - 1];

/** Everywhere reached at this level, in the order they were discovered. */
const discovered = (level) => JOURNEY.filter(d => d.level <= level);


// Short forms so the whole week fits one screen without scrolling sideways.
const SHORT_NAME = {
  'אזרחות ודמוקרטיה': 'אזרחות',
  'העשרה / מדמ״ח': 'מדמ״ח',
  'כישורי שפה': 'כ. שפה',
  'כישורי חיים': 'כ. חיים',
};
const shortName = (n) => SHORT_NAME[n] || n;

// Tap-to-pick options, so nobody has to type a packing list.
const ITEM_CATALOG = [
  { name: 'Notebook',     emoji: '📓' },
  { name: 'Textbook',     emoji: '📕' },
  { name: 'Workbook',     emoji: '📗' },
  { name: 'Folder',       emoji: '🗂️' },
  { name: 'Calculator',   emoji: '🧮' },
  { name: 'Ruler',        emoji: '📏' },
  { name: 'Geometry kit', emoji: '📐' },
  { name: 'Laptop',       emoji: '💻' },
  { name: 'Lab coat',     emoji: '🥼' },
  { name: 'Sports kit',   emoji: '👕' },
  { name: 'Trainers',     emoji: '👟' },
  { name: 'Tanach',       emoji: '📜' },
  { name: 'Book',         emoji: '📖' },
  { name: 'Dictionary',   emoji: '📔' },
  { name: 'Headphones',   emoji: '🎧' },
  { name: 'Charger',      emoji: '🔌' },
  { name: 'Water bottle', emoji: '💧' },
  { name: 'Pencil case',  emoji: '✏️' },
  { name: 'Lunchbox',     emoji: '🍱' },
  { name: 'Bus card',     emoji: '🎫' },
];

const EMOJI = Object.fromEntries(ITEM_CATALOG.map(i => [i.name.toLowerCase(), i.emoji]));
const emojiFor = (item) => EMOJI[String(item).toLowerCase()] || '🎒';

/** One line per thing, not one line per lesson — "Notebook" said once,
 *  with the lessons that want it. */
function packListFor(dayIndex) {
  const map = new Map();
  for (const it of state.everydayItems) {
    if (!map.has(it)) map.set(it, { item: it, lessons: [], everyday: true });
  }
  for (const l of lessonsFor(dayIndex)) {
    for (const it of itemsFor(l.name)) {
      if (!map.has(it)) map.set(it, { item: it, lessons: [], everyday: false });
      const entry = map.get(it);
      if (!entry.everyday && !entry.lessons.includes(l.name)) entry.lessons.push(l.name);
    }
  }
  return [...map.values()];
}

const itemsFor = (lesson) =>
  (state.lessonItems && state.lessonItems[lesson]) || [];

const parseItems = (text) =>
  text.split(',').map(s => s.trim()).filter(Boolean);

/** Lessons that day, in order, collapsed to one entry per subject. */
function lessonsFor(dayIndex) {
  const row = SCHEDULE[dayIndex] || [];
  const seen = new Map();
  row.forEach((name, period) => {
    if (!name) return;
    if (!seen.has(name)) seen.set(name, { name, periods: [] });
    seen.get(name).periods.push(period);
  });
  return [...seen.values()];
}

/** The subject you picked that this lesson belongs to, if any. */
function subjectForLesson(name) {
  const aliases = LESSON_ALIASES[name] || [name];
  return state.subjects.find(s => {
    const n = s.name.toLowerCase();
    return aliases.some(a => n.includes(a.toLowerCase()) || a.toLowerCase().includes(n));
  }) || null;
}

/** Weekday index into SCHOOL_DAYS, or -1 at the weekend. */
function schoolDayIndex(d = new Date()) {
  return SCHOOL_DAYS.findIndex(x => x.js === d.getDay());
}

const PALETTE = PRESETS.map(p => p.color);
const XP_PER_HOMEWORK = 10;
const XP_PER_LEVEL = 100;
const STORAGE_KEY = 'homework.v1';

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Bind an event, tolerating a missing element. A browser can serve cached
 *  markup from one version with script from another; without this, the first
 *  absent node throws and every listener after it never gets attached. */
function on(sel, type, fn) {
  const el = $(sel);
  if (el) el.addEventListener(type, fn);
  return el;
}


/* ── Dates ─────────────────────────────────────────────────── */
/* Due dates are plain YYYY-MM-DD strings so they never drift across time zones. */

function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function keyToDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function daysFromToday(key) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((keyToDate(key) - today) / 86400000);
}

function addDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return dayKey(d);
}

/** "Today", "Tomorrow", "Monday", "12 Mar" — never a raw date if we can help it. */
function dueLabel(key) {
  const diff = daysFromToday(key);
  if (diff < -1) return 'Overdue';
  if (diff === -1) return 'Yesterday';
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff <= 6) return keyToDate(key).toLocaleDateString([], { weekday: 'long' });
  return keyToDate(key).toLocaleDateString([], { day: 'numeric', month: 'short' });
}

function dayHeading(ts) {
  const key = dayKey(new Date(ts));
  const diff = daysFromToday(key);
  if (diff === 0) return 'Today';
  if (diff === -1) return 'Yesterday';
  const d = new Date(ts);
  const opts = { weekday: 'long', day: 'numeric', month: 'short' };
  if (d.getFullYear() !== new Date().getFullYear()) opts.year = 'numeric';
  return d.toLocaleDateString([], opts);
}

const timeLabel = (ts) =>
  new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


/* ── Store ─────────────────────────────────────────────────── */

const blank = () => ({
  version: 1,
  updatedAt: 0,
  onboarded: false,
  subjects: [],
  homework: [],
  notes: [],
  lessonItems: null,      // filled from DEFAULT_ITEMS on first run
  everydayItems: null,
  progress: { xp: 0, level: 1, shownUpTo: 1 },
  settings: {
    dailyReminderEnabled: false, dailyReminderTime: '15:00',
    bagReminderEnabled: false, bagReminderTime: '20:00',
  },
  lastSubjectId: null,
});

let state = blank();

/** Fold saved data onto current defaults, so data written by an older
 *  version still picks up settings added since. */
function hydrate(saved) {
  const base = blank();
  const next = Object.assign(base, saved);
  next.settings = Object.assign(blank().settings, (saved && saved.settings) || {});
  next.notes = Array.isArray(next.notes) ? next.notes : [];
  if (!next.lessonItems || typeof next.lessonItems !== 'object') {
    next.lessonItems = Object.fromEntries(LESSONS.map(l => [l, (DEFAULT_ITEMS[l] || ['Notebook']).slice()]));
  }
  for (const l of LESSONS) if (!Array.isArray(next.lessonItems[l])) next.lessonItems[l] = (DEFAULT_ITEMS[l] || ['Notebook']).slice();
  if (!Array.isArray(next.everydayItems)) next.everydayItems = DEFAULT_EVERYDAY.slice();
  next.progress = Object.assign({ xp: 0, level: 1, shownUpTo: 1 }, next.progress);
  // Anyone already part way through should not be shown a burst of arrivals.
  if (typeof next.progress.shownUpTo !== 'number') next.progress.shownUpTo = levelFor(next.progress.xp || 0);
  return next;
}

function load() {
  // Always hydrate, saved data or not: a first run needs the defaults too.
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state = hydrate(raw ? JSON.parse(raw) : {});
  } catch {
    state = hydrate({});   // corrupt or unavailable storage: start clean
  }
}

function saveLocal() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* private mode; the session still works */ }
}

function save() {
  state.updatedAt = Date.now();
  saveLocal();
  schedulePush();
}


/* ── Sync ──────────────────────────────────────────────────
   Local storage renders instantly and works with no network. Where the
   shared store is available, the same homework follows you to every
   device you open this on. One person rarely edits two devices at once,
   so the newer copy simply wins — no merge machinery. */

const SYNC_PATH = 'app/state';
let syncDoc = null;
let pushTimer = null;

function pushNow() {
  if (!syncDoc) return;
  syncDoc.set({ updatedAt: state.updatedAt || 0, payload: JSON.stringify(state) })
    .catch(() => { /* offline or refused; local storage still holds it */ });
}

function schedulePush() {
  if (!syncDoc) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(pushNow, 400);   // one write per burst of edits
}

async function connectSync() {
  if (!window.claude || typeof window.claude.use !== 'function') return;

  let db = null;
  try { db = await window.claude.use('db'); } catch { return; }
  if (!db) return;                        // not available here: local only

  syncDoc = db.doc(SYNC_PATH);
  syncDoc.onSnapshot(
    (snap) => {
      if (!snap.exists) { pushNow(); return; }        // seed the store from this device
      const data = snap.data() || {};
      if (typeof data.payload !== 'string') return;
      if (!(data.updatedAt > (state.updatedAt || 0))) return;   // ours is already current

      let incoming;
      try { incoming = JSON.parse(data.payload); }
      catch { return; }                   // keep local work rather than trust a bad copy

      state = hydrate(incoming);
      saveLocal();                        // not save(): don't bump the clock and echo back
      adoptRemoteState();
    },
    () => { syncDoc = null; }             // subscription died; carry on locally
  );
}

/** Remote data arrived — show the right screen and redraw. */
function adoptRemoteState() {
  if (state.onboarded && state.subjects.length) {
    $('#onboarding').hidden = true;
    $('#main').hidden = false;
    render();
  }
  scheduleReminder();
}

const subjectById = (id) => state.subjects.find(s => s.id === id) || null;
const activeHw = () => state.homework.filter(h => !h.completed);

/** Soonest first; undated homework sinks to the bottom. */
function sortForList(list) {
  return [...list].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return a.createdAt - b.createdAt;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    if (a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
    return a.createdAt - b.createdAt;
  });
}

const levelFor = (xp) => Math.min(MAX_LEVEL, Math.floor(xp / XP_PER_LEVEL) + 1);

function monogram(name) {
  const words = name.trim().split(/\s+/);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return name.trim().slice(0, 1).toUpperCase();
}

/** Spread custom subjects across the palette instead of repeating one colour. */
function nextColor() {
  const used = new Set(state.subjects.map(s => s.color));
  return PALETTE.find(c => !used.has(c)) || PALETTE[state.subjects.length % PALETTE.length];
}


/* ── Shared markup ─────────────────────────────────────────── */

function tile(sub, extraClass = '') {
  const body = sub.icon
    ? `<svg class="ico" aria-hidden="true"><use href="#${sub.icon}" /></svg>`
    : esc(sub.glyph || monogram(sub.name));
  return `<span class="subject-tile ${extraClass}" style="--sc:${sub.color}">${body}</span>`;
}

function hwRow(hw) {
  const sub = subjectById(hw.subjectId);
  const color = sub ? sub.color : 'var(--ink-2)';
  const diff = hw.dueDate ? daysFromToday(hw.dueDate) : null;
  const soon = diff !== null && diff <= 0;
  const late = diff !== null && diff < 0;

  return `
    <div class="hw-slot" data-id="${hw.id}">
      <div class="hw ${soon ? 'is-soon' : ''} ${late ? 'is-late' : ''}" style="--sc:${color}">
        <button class="check" data-act="complete" aria-label="Mark ${esc(hw.title)} as done">
          <span class="check-circle">
            <svg class="check-mark" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.6 9.6 17 19 7"/></svg>
          </span>
        </button>
        <button class="hw-main" data-act="edit">
          <span class="hw-subject"><span class="hw-dot"></span>${esc(sub ? sub.name : 'Subject')}</span>
          <span class="hw-title">${esc(hw.title)}</span>
          ${hw.dueDate ? `<span class="hw-due">${esc(dueLabel(hw.dueDate))}</span>` : ''}
        </button>
      </div>
    </div>`;
}

/* Each empty screen gets its own mark and its own motion, and where there
   is an obvious next move the whole block is the button for it. */
const empty = (title, line, opts = {}) => {
  const { icon = 'i-check', mood = 'done', act = '' } = opts;
  const tag = act ? 'button' : 'div';
  return `
    <${tag} class="empty empty-${mood}" ${act ? `data-act="${act}"` : ''}>
      <span class="empty-mark">
        <svg class="ico" aria-hidden="true"><use href="#${icon}" /></svg>
        ${mood === 'done' ? `
          <i class="spark-a"></i><i class="spark-b"></i><i class="spark-c"></i>` : ''}
      </span>
      <h2>${esc(title)}</h2>
      <p>${esc(line)}</p>
    </${tag}>`;
};


/* ── Render ────────────────────────────────────────────────── */

let currentTab = 'home';

function render() {
  renderTtButton();
  if (currentTab === 'home') renderHome();
  if (currentTab === 'bag') renderBag();
  if (currentTab === 'reminders') renderReminders();
  if (currentTab === 'subjects') renderSubjects();
  if (currentTab === 'profile') renderProfile();
  if (!$('#subject-page').hidden) renderSubjectPage(openSubjectId);
}

function renderHome() {
  const list = sortForList(activeHw());
  $('#home-count').textContent = list.length ? `${list.length} left` : '';

  const box = $('#home-list');
  box.classList.add('list-hw');
  box.innerHTML = list.length
    ? list.map(hwRow).join('')
    : (state.homework.length
        ? empty('All done', 'No homework left.', { mood: 'done' })
        : empty('Nothing here yet', 'Tap here to add your first homework.',
                { icon: 'i-plus', mood: 'invite', act: 'add-first' }));
}

/* ── Bag: what to bring, and your own reminders ───────────── */

let bagDay = -1;   // which weekday the Bag tab is showing

function renderBag() {
  if (bagDay < 0) {
    const today = schoolDayIndex();
    bagDay = today >= 0 ? today : 0;      // weekend: start the week on Sunday
  }
  const today = schoolDayIndex();
  const day = SCHOOL_DAYS[bagDay];

  $('#bag-sub').textContent = bagDay === today ? `${day.en} · today` : day.en;

  $('#bag-days').innerHTML = SCHOOL_DAYS.map((d, i) => `
    <button class="chip chip-day ${i === bagDay ? 'is-on' : ''}" data-day="${i}">
      ${esc(d.short)}${i === today ? '<span class="today-dot"></span>' : ''}
    </button>`).join('');

  renderTimetablePreview();

  const lessons = lessonsFor(bagDay);
  const dayNotes = state.notes.filter(n => n.day === null || n.day === bagDay);
  const loose = dayNotes.filter(n => !n.lesson);

  if (!lessons.length) {
    $('#bag-body').innerHTML =
      empty('No lessons', `Nothing to pack for ${day.en}.`, { icon: 'i-tab-bag', mood: 'rest' });
    return;
  }

  const pack = packListFor(bagDay);

  const packList = `
    <div class="bag-section">
      <div class="bag-section-head">
        <h2 class="section-title">Pack</h2>
        <button class="edit-btn" data-act="edit-everyday">
          <svg class="ico" aria-hidden="true"><use href="#i-edit" /></svg>Every day
        </button>
      </div>
      <ul class="pack-list">
        ${pack.map(p => `
          <li class="pack-line">
            <span class="pack-emoji">${p.everyday ? emojiFor(p.item) : emojiFor(p.item)}</span>
            <span class="pack-item">${esc(p.item)}</span>
            <span class="pack-for">${p.everyday ? 'Every day' : p.lessons.map(shortName).map(esc).join(' · ')}</span>
          </li>`).join('')}
      </ul>
    </div>`;

  const remember = dayNotes.length ? `
    <div class="bag-section">
      <h2 class="section-title">Remember</h2>
      <ul class="pack-list pack-list-note">
        ${dayNotes.map(n => `
          <li class="pack-line">
            <span class="pack-emoji">📌</span>
            <span class="pack-item">${esc(n.text)}</span>
            <span class="pack-for">${n.lesson ? esc(shortName(n.lesson)) : ''}</span>
          </li>`).join('')}
      </ul>
    </div>` : '';

  // Kept compact: a line per lesson, its kit shown as emoji, tap to change.
  const lessonStrip = `
    <div class="bag-section">
      <h2 class="section-title">Lessons</h2>
      <div class="list">
        ${lessons.map(l => {
          const sub = subjectForLesson(l.name);
          const items = itemsFor(l.name);
          const due = sub ? activeHw().filter(h => h.subjectId === sub.id).length : 0;
          return `
            <button class="lesson-line" data-act="edit-lesson" data-lesson="${esc(l.name)}"
                    style="--sc:${sub ? sub.color : 'var(--ink-3)'}">
              <span class="bring-dot"></span>
              <span class="lesson-name">${esc(shortName(l.name))}</span>
              <span class="lesson-kit">${items.map(i => emojiFor(i)).join('')}</span>
              ${due ? `<span class="lesson-due">${due}</span>` : ''}
              <span class="bring-time">${esc(PERIODS[l.periods[0]].split('–')[0])}</span>
            </button>`;
        }).join('')}
      </div>
    </div>`;

  $('#bag-body').innerHTML = packList + remember + lessonStrip;
}

/** The corner button is itself a tiny timetable, not a generic glyph. */
function renderTtButton() {
  const btn = $('#tt-btn');
  if (!btn) return;
  btn.innerHTML = '<span class="tt-mini">' + SCHOOL_DAYS.map((d, i) =>
    '<span class="tt-mini-col">' + SCHEDULE[i].slice(0, 6).map(name => {
      if (!name) return '<span class="tt-mini-cell is-free"></span>';
      const sub = subjectForLesson(name);
      return '<span class="tt-mini-cell" style="--sc:' + (sub ? sub.color : 'var(--ink-3)') + '"></span>';
    }).join('') + '</span>'
  ).join('') + '</span>';
}

/** A readable miniature of the week that opens the full thing. */
function renderTimetablePreview() {
  const today = schoolDayIndex();
  $('#tt-preview').innerHTML = `
    <span class="tt-preview-grid">
      ${SCHOOL_DAYS.map((d, i) => `
        <span class="tt-preview-col ${i === today ? 'is-today' : ''}">
          <span class="tt-preview-day">${esc(d.short)}</span>
          ${SCHEDULE[i].map(name => {
            if (!name) return '<span class="tt-preview-cell is-free"></span>';
            const sub = subjectForLesson(name);
            return `<span class="tt-preview-cell" style="--sc:${sub ? sub.color : 'var(--ink-3)'}"></span>`;
          }).join('')}
        </span>`).join('')}
    </span>
    <span class="tt-preview-label">Timetable · tap to open</span>`;
}


/* ── Reminders, on their own page ──────────────────────────── */

let remDay = null;         // null = every day
let remLesson = null;
let remScope = 'today';    // the list below starts on today, "All" shows the rest

/** One reminder, shared by the Today and All views. */
function reminderRow(x) {
  const sub = x.lesson ? subjectForLesson(x.lesson) : null;
  return `
    <div class="note-row" data-note="${x.id}" style="--sc:${sub ? sub.color : 'var(--ink-3)'}">
      <span class="note-main">
        <span class="note-text">${esc(x.text)}</span>
        ${x.lesson ? `<span class="note-lesson"><span class="chip-dot"></span>${esc(shortName(x.lesson))}</span>`
                   : (x.day === null ? '<span class="note-tag">Every day</span>' : '')}
      </span>
      <button class="note-del" data-act="del-note" aria-label="Delete reminder">
        <svg class="ico" aria-hidden="true"><use href="#i-close" /></svg>
      </button>
    </div>`;
}

function renderReminders() {
  const n = state.notes.length;
  $('#rem-sub').textContent = n ? `${n} saved` : '';

  $('#rem-days').innerHTML = `
    <button class="chip chip-day ${remDay === null ? 'is-on' : ''}" data-remday="all">Every day</button>
    ${SCHOOL_DAYS.map((d, i) => `
      <button class="chip chip-day ${remDay === i ? 'is-on' : ''}" data-remday="${i}">${esc(d.short)}</button>`).join('')}`;

  // A lesson can only be chosen once a specific day is.
  const lessons = remDay === null ? [] : lessonsFor(remDay);
  $('#rem-lessons').hidden = !lessons.length;
  $('#rem-lessons').innerHTML = lessons.length ? `
    <button class="chip chip-day ${remLesson === null ? 'is-on' : ''}" data-remlesson="">Whole day</button>
    ${lessons.map(l => {
      const sub = subjectForLesson(l.name);
      return `<button class="chip ${remLesson === l.name ? 'is-on' : ''}"
        data-remlesson="${esc(l.name)}" style="--sc:${sub ? sub.color : 'var(--ink-3)'}">
        <span class="chip-dot"></span>${esc(l.name)}</button>`;
    }).join('')}` : '';

  const today = schoolDayIndex();
  const todayCount = state.notes.filter(x => x.day === null || x.day === today).length;

  $('#rem-scope').innerHTML = `
    <button class="seg ${remScope === 'today' ? 'is-on' : ''}" data-scope="today">
      Today${todayCount ? ` <span class="seg-count">${todayCount}</span>` : ''}
    </button>
    <button class="seg ${remScope === 'all' ? 'is-on' : ''}" data-scope="all">
      All${n ? ` <span class="seg-count">${n}</span>` : ''}
    </button>`;
  $('#rem-scope').hidden = !n;

  if (!n) {
    $('#rem-list').innerHTML = empty('Nothing to remember',
      'Tap here and tell it what not to forget.',
      { icon: 'i-tab-bell', mood: 'ring', act: 'first-reminder' });
    return;
  }

  // Today means: pinned to today, or set for every day.
  if (remScope === 'today') {
    const mine = state.notes.filter(x => x.day === null || x.day === today);
    $('#rem-list').innerHTML = mine.length
      ? `<h3 class="day-title">${today >= 0 ? esc(SCHOOL_DAYS[today].en) : 'Today'}</h3>
         <div class="list">${mine.map(reminderRow).join('')}</div>`
      : empty('Nothing for today', 'Tap All to see the rest.', { icon: 'i-tab-bell', mood: 'ring' });
    return;
  }

  // Every day first, then Sunday through Thursday.
  const groups = [{ key: null, label: 'Every day' }]
    .concat(SCHOOL_DAYS.map((d, i) => ({ key: i, label: d.en })));

  $('#rem-list').innerHTML = groups.map(g => {
    const mine = state.notes.filter(x => x.day === g.key);
    if (!mine.length) return '';
    return `
      <h3 class="day-title">${esc(g.label)}</h3>
      <div class="list">${mine.map(reminderRow).join('')}</div>`;
  }).join('');
}

function addReminder() {
  const input = $('#rem-input');
  const text = input ? input.value.trim() : '';

  // Nothing typed yet: say so and put the cursor where it needs to go, rather
  // than sitting there greyed out doing nothing when tapped.
  if (!text) {
    if (!input) return;
    const box = $('.rem-compose');
    if (box) {
      box.classList.remove('is-nudged');
      void box.offsetWidth;
      box.classList.add('is-nudged');
    }
    input.focus();
    return;
  }

  state.notes.push({ id: uid(), text, day: remDay, lesson: remLesson, createdAt: Date.now() });
  save();
  input.value = '';
  remLesson = null;
  renderReminders();
  input.focus();
}


/* ── Timetable ─────────────────────────────────────────────── */

function renderTimetable() {
  const today = schoolDayIndex();
  const lastUsed = SCHEDULE.reduce((m, row) => {
    for (let i = row.length - 1; i >= 0; i--) if (row[i]) return Math.max(m, i);
    return m;
  }, 0);

  $('#tt-body').innerHTML = `
    <div class="tt-scroll">
      <table class="tt-grid">
        <thead>
          <tr>
            <th class="tt-corner"></th>
            ${SCHOOL_DAYS.map((d, i) => `
              <th class="${i === today ? 'is-today' : ''}">
                <span class="tt-day">${esc(d.short)}</span>
                <span class="tt-day-he">${esc(d.he)}</span>
              </th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${PERIODS.slice(0, lastUsed + 1).map((time, p) => `
            <tr>
              <th class="tt-time"><span class="tt-num">${p + 1}</span><span>${esc(time)}</span></th>
              ${SCHOOL_DAYS.map((d, i) => {
                const name = SCHEDULE[i][p];
                if (!name) return `<td class="tt-free ${i === today ? 'is-today' : ''}"></td>`;
                const sub = subjectForLesson(name);
                return `<td class="${i === today ? 'is-today' : ''}" style="--sc:${sub ? sub.color : 'var(--ink-2)'}"
                            title="${esc(name)}">
                  <span class="tt-cell">${esc(shortName(name))}</span>
                </td>`;
              }).join('')}
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

/* ── Editing what to bring ─────────────────────────────────── */

let itemsTarget = null;   // a lesson name, or 'everyday'
let itemsDraft = [];

function openItemsSheet(target) {
  itemsTarget = target;
  const everyday = target === 'everyday';
  $('#items-title').textContent = everyday ? 'Every day' : target;
  itemsDraft = (everyday ? state.everydayItems : itemsFor(target)).slice();
  drawItemChips();
  showSheet('#sheet-items');
}

/** Everything in the catalogue, plus anything you added yourself, with what
 *  you already bring switched on. Tap to change; no typing needed. */
function drawItemChips() {
  const extras = itemsDraft.filter(i => !ITEM_CATALOG.some(c => c.name === i));
  const all = ITEM_CATALOG.map(c => c.name).concat(extras);
  $('#items-chips').innerHTML = all.map(name => `
    <button class="item-chip ${itemsDraft.includes(name) ? 'is-on' : ''}" data-item="${esc(name)}">
      <span class="item-emoji">${emojiFor(name)}</span>${esc(name)}
    </button>`).join('');
}

function toggleItem(name) {
  const at = itemsDraft.indexOf(name);
  if (at >= 0) itemsDraft.splice(at, 1); else itemsDraft.push(name);
  drawItemChips();
}

function addCustomItem() {
  const input = $('#items-custom');
  const name = input ? input.value.trim() : '';
  if (!name) return;
  if (!itemsDraft.includes(name)) itemsDraft.push(name);
  input.value = '';
  drawItemChips();
}

function saveItems() {
  if (!itemsTarget) return;
  if (itemsTarget === 'everyday') state.everydayItems = itemsDraft.slice();
  else state.lessonItems[itemsTarget] = itemsDraft.slice();
  save();
  closeSheet();
  if (!$('#onboarding').hidden) renderItemsEditor();   // setup step two
  else render();
}


function openTimetable() {
  renderTimetable();
  const box = $('#timetable');
  box.hidden = false;
  box.classList.remove('is-leaving');
}

function closeTimetable() {
  const box = $('#timetable');
  if (box.hidden) return;
  box.classList.add('is-leaving');
  setTimeout(() => { box.hidden = true; box.classList.remove('is-leaving'); }, 240);
}


function renderSubjects() {
  const box = $('#subject-list');
  box.innerHTML = state.subjects.map(sub => {
    const n = activeHw().filter(h => h.subjectId === sub.id).length;
    return `
      <button class="subject-row" data-id="${sub.id}" style="--sc:${sub.color}">
        ${tile(sub)}
        <span class="subject-row-name">${esc(sub.name)}</span>
        <span class="subject-row-count">${n ? `${n} left` : ''}</span>
        <svg class="ico ico-chevron" aria-hidden="true"><use href="#i-chevron" /></svg>
      </button>`;
  }).join('');
}

let openSubjectId = null;

function renderSubjectPage(id) {
  const sub = subjectById(id);
  if (!sub) return closeSubjectPage();

  const mine = state.homework.filter(h => h.subjectId === id);
  const open = sortForList(mine.filter(h => !h.completed));
  const done = mine.filter(h => h.completed).sort((a, b) => b.completedAt - a.completedAt).slice(0, 8);

  $('#subject-page-body').innerHTML = `
    <div class="subject-hero">${tile(sub)}<h1>${esc(sub.name)}</h1></div>
    ${open.length ? `
      <h2 class="section-title" style="margin-top:0">Homework</h2>
      <div class="list list-hw">${open.map(hwRow).join('')}</div>
    ` : empty(`Nothing for ${sub.name} right now`, 'Enjoy it while it lasts.', { mood: 'done' })}
    ${done.length ? `
      <h2 class="section-title">Completed</h2>
      <div class="list">${done.map(h => doneRow(h, sub, false)).join('')}</div>
    ` : ''}`;
}

/* On a subject's own page the subject name is already the heading, so drop it. */
function doneRow(hw, sub, showSubject = true) {
  return `
    <div class="done-row" style="--sc:${sub ? sub.color : 'var(--ink-3)'}">
      <svg class="ico ico-check" aria-hidden="true"><use href="#i-check" /></svg>
      <span class="done-main">
        ${showSubject ? `<span class="done-subject">${esc(sub ? sub.name : 'Subject')}</span>` : ''}
        <span class="done-title">${esc(hw.title)}</span>
      </span>
      <span class="done-time">${esc(timeLabel(hw.completedAt))}</span>
    </div>`;
}

function renderProfile() {
  const { xp } = state.progress;
  const level = levelFor(xp);
  const into = xp % XP_PER_LEVEL;
  const doneCount = state.homework.filter(h => h.completed).length;

  const place = stopFor(level);
  const journeyDone = level >= MAX_LEVEL;

  $('#level-card').innerHTML = `
    <div class="level-top">
      <span class="level-name">Level ${level}</span>
      <span class="level-xp">${journeyDone ? 'Journey complete' : `${into} / ${XP_PER_LEVEL} XP`}</span>
    </div>
    <div class="bar"><div class="bar-fill" style="width:${journeyDone ? 100 : (into / XP_PER_LEVEL) * 100}%"></div></div>
    <p class="level-chapter">${esc(place.name)}${place.country ? ` · ${esc(place.country)}` : ''}</p>
    <p class="level-note">${journeyDone
      ? 'Every place discovered.'
      : (xp > 0
          ? `${XP_PER_LEVEL - into} XP until the next destination`
          : 'Finish some homework to start travelling.')}</p>`;

  renderPassport(level);

  // History, newest first, grouped by the day it was finished.
  const done = state.homework
    .filter(h => h.completed && h.completedAt)
    .sort((a, b) => b.completedAt - a.completedAt)
    .slice(0, 60);

  const box = $('#history-list');
  if (!done.length) {
    box.innerHTML = `<p class="foot-note">Nothing finished yet.</p>`;
  } else {
    let html = '';
    let lastDay = null;
    for (const hw of done) {
      const day = dayKey(new Date(hw.completedAt));
      if (day !== lastDay) {
        html += `<h3 class="day-title">${esc(dayHeading(hw.completedAt))}</h3>`;
        lastDay = day;
      }
      html += doneRow(hw, subjectById(hw.subjectId));
    }
    box.innerHTML = html;
  }

  $('#reminder-toggle').checked = state.settings.dailyReminderEnabled;
  $('#reminder-time').value = state.settings.dailyReminderTime;
  $('#reminder-time-row').hidden = !state.settings.dailyReminderEnabled;
  $('#bag-toggle').checked = state.settings.bagReminderEnabled;
  $('#bag-time').value = state.settings.bagReminderTime;
  $('#bag-time-row').hidden = !state.settings.bagReminderEnabled;
  $('#reminder-note').textContent = reminderNote();
}


/* ── The passport ──────────────────────────────────────────
   Built from four small pieces that the level-up journey reuses:
   worldMap() draws the page, flightPath() the route between two places,
   destinationPhoto() one travel memory, and renderPassport() puts them
   together for whatever level you have reached. */

/* The overlay's viewBox matches the passport photograph's shape, so one unit
   is the same length across as it is down. Without that, curves come out
   stretched and anything measured along a path — a plane's position, its
   heading — is measured in the wrong space. */
const PP_ASPECT = 1216 / 847;
const SVG_H = Math.round((100 / PP_ASPECT) * 1000) / 1000;

/** Percentage of the page to a point in that square-unit space, and back. */
const toSvg = ([x, y]) => [x, (y * SVG_H) / 100];
const svgYToPct = (sy) => (sy * 100) / SVG_H;

/** A gently bowed curve between two places, in square units. */
function flightPath(pa, pb) {
  const a = toSvg(pa), b = toSvg(pb);
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const bow = Math.min(9, len * 0.22);
  return `M ${a[0]} ${a[1]} Q ${mx - (dy / len) * bow} ${my + (dx / len) * bow} ${b[0]} ${b[1]}`;
}

/** One travel memory pinned to the page. */
function destinationPhoto(d, opts = {}) {
  const [px, py] = photoAt(d);
  const cls = ['stop', d.final ? 'is-final' : '', opts.hidden ? 'is-hidden' : ''].filter(Boolean).join(' ');
  return `
    <button class="${cls}" style="left:${px}%; top:${py}%" data-stop="${d.id}"
            aria-label="${esc(d.name)}">
      <span class="stop-photo">
        <img src="img/${d.photo}-thumb.jpg" alt="${esc(d.name)}" loading="lazy" />
      </span>
    </button>`;
}

/** The passport page with a route, its pins and whichever photos belong. */
function worldMap({ upTo, hidePhoto = null, legs = 'all' } = {}) {
  const stops = discovered(upTo);

  let route = '';
  for (let i = 1; i < stops.length; i++) {
    if (legs === 'exceptLast' && i === stops.length - 1) continue;
    route += `<path class="leg" d="${flightPath(pinOf(stops[i - 1]), pinOf(stops[i]))}" />`;
  }

  // A hairline from each photo back to the spot it belongs to, so the
  // geography stays legible even though the photo is nudged clear.
  const leaders = stops
    .filter(d => d.photo && d.id !== hidePhoto)
    .map(d => {
      const [px, py] = toSvg(photoAt(d)), [x, y] = toSvg(pinOf(d));
      return `<line class="leader" x1="${px}" y1="${py}" x2="${x}" y2="${y}" />`;
    }).join('');

  const pins = stops.map(d => {
    const [x, y] = pinOf(d);
    const last = d.level === upTo;
    return `<span class="pin ${last ? 'pin-here' : ''}" style="left:${x}%; top:${y}%" aria-hidden="true"></span>`;
  }).join('');

  const home = JOURNEY[0];
  const [hx, hy] = pinOf(home);
  const homeMark = `
    <button class="home-mark ${upTo === 1 ? 'is-current' : ''}"
            style="left:${hx}%; top:${hy}%" data-stop="home">
      <span class="home-dot"></span><span class="home-label">Home</span>
    </button>`;

  const photos = stops
    .filter(d => d.photo && d.id !== hidePhoto)
    .map(d => destinationPhoto(d))
    .join('');

  return `
    <div class="pp-page">
      <img class="pp-paper" src="img/passport.jpg" alt="An open passport showing a world map" />
      <svg class="pp-lines" viewBox="0 0 100 ${SVG_H}" aria-hidden="true">${route}${leaders}</svg>
      ${pins}${homeMark}${photos}
    </div>`;
}

function renderPassport(level) {
  const box = $('#passport');
  if (!box) return;
  box.innerHTML = worldMap({ upTo: level });

  const n = discovered(level).length;
  const note = $('#passport-note');
  if (note) {
    note.textContent = level >= MAX_LEVEL
      ? `${n} of ${MAX_LEVEL} places · the journey is complete`
      : `${n} of ${MAX_LEVEL} places · keep going to discover the next`;
  }
}


/* ── One destination, full size ────────────────────────────── */

function openStop(id) {
  const d = JOURNEY.find(x => x.id === id);
  if (!d) return;
  const level = levelFor(state.progress.xp);
  if (d.level > level) return;                 // not discovered, nothing to show

  const when = (state.progress.discoveredAt || {})[d.id];

  $('#dv-body').innerHTML = `
    <h2 class="dv-name">${esc(d.name)}</h2>
    ${d.country ? `<p class="dv-where">${esc(d.country)}</p>` : ''}
    ${d.photo ? `
      <div class="dv-photo ${d.final ? 'is-final' : ''}">
        <img src="img/${d.photo}.jpg" alt="${esc(d.name)}" />
        <span class="stamp stamp-mid"><b>Visited</b><i>${esc(d.name)}</i></span>
      </div>` : `
      <div class="dv-photo dv-home"><span>Where the journey starts</span></div>`}
    <p class="dv-levels">${d.level === 1 ? 'Starting point' : `Discovered at level ${d.level}`}</p>
    ${when ? `<p class="dv-hint">${esc(new Date(when).toLocaleDateString([], {
      day: 'numeric', month: 'long', year: 'numeric' }))}</p>` : ''}`;

  const view = $('#destination');
  view.hidden = false;
  view.classList.remove('is-leaving');
}

function closeStop() {
  const view = $('#destination');
  if (!view || view.hidden) return;
  view.classList.add('is-leaving');
  setTimeout(() => { view.hidden = true; view.classList.remove('is-leaving'); }, 260);
}


/* ── The journey: a full screen, a plane, a new memory ─────── */

let journeyTimers = [];
const clearJourney = () => { journeyTimers.forEach(clearTimeout); journeyTimers = []; };
const step = (fn, at) => { journeyTimers.push(setTimeout(fn, at)); };

/**
 * Flies from the place before it to the one just reached, draws the route as
 * it goes, then settles the new photograph onto the map for good.
 */
function playJourney(dest, fromLevel) {
  const box = $('#journey');
  if (!box || !dest.photo) return;

  const prev = JOURNEY[dest.level - 2] || JOURNEY[0];
  const a = pinOf(prev), b = pinOf(dest);
  const [px, py] = photoAt(dest);

  clearJourney();
  box.innerHTML = `
    <div class="jn-stage">
      <div class="jn-title">
        <span class="jn-kicker">Level up</span>
        <span class="jn-levels">${fromLevel} <i>→</i> ${dest.level}</span>
      </div>

      <div class="jn-camera">
        <div class="jn-book">
          ${worldMap({ upTo: dest.level, hidePhoto: dest.id, legs: 'exceptLast' })}
          <svg class="jn-route" viewBox="0 0 100 ${SVG_H}" aria-hidden="true">
            <path id="jn-line" class="leg jn-line" d="${flightPath(a, b)}" />
          </svg>
          <span class="jn-plane" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M21 15.5 13.5 11V4.8a1.5 1.5 0 0 0-3 0V11L3 15.5v2l7.5-2.2v4l-2.2 1.5v1.5l3.7-1 3.7 1v-1.5L13.5 19.3v-4l7.5 2.2z"/></svg>
          </span>
          <div class="jn-drop" style="left:${px}%; top:${py}%">
            <span class="stop ${dest.final ? 'is-final' : ''} jn-photo">
              <span class="stop-photo"><img src="img/${dest.photo}-thumb.jpg" alt="" /></span>
            </span>
          </div>
        </div>
      </div>

      <div class="jn-reveal">
        <p class="jn-found">You discovered</p>
        <h2 class="jn-name">${esc(dest.name)}</h2>
        ${dest.country ? `<p class="jn-country">${esc(dest.country)}</p>` : ''}
      </div>

      <button class="jn-continue btn-primary">Explore passport</button>
    </div>`;

  box.hidden = false;
  box.classList.remove('is-leaving');
  box.classList.add('is-running');

  const stage = $('.jn-stage', box);
  const camera = $('.jn-camera', box);
  const line = $('#jn-line', box);
  const plane = $('.jn-plane', box);
  const drop = $('.jn-drop', box);

  // Camera. Short hops between neighbouring countries need far more zoom than
  // an ocean crossing, or the flight reads as a twitch.
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const hop = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const travelZoom = Math.max(1.45, Math.min(2.2, 130 / (hop + 28)));
  // Land looking at both the pin and where the photograph will settle.
  const landAt = [(b[0] + px) / 2, (b[1] + py) / 2];

  const focus = (x, y, scale, ms) => {
    camera.style.transition = `transform ${ms}ms cubic-bezier(.32,.72,0,1)`;
    camera.style.transform = `scale(${scale}) translate(${(50 - x)}%, ${(50 - y)}%)`;
  };

  const len = line.getTotalLength();
  line.style.strokeDasharray = `${len}`;
  line.style.strokeDashoffset = `${len}`;

  const FLY = 2900;
  let raf = 0;

  const fly = () => {
    const t0 = performance.now();
    const tick = (now) => {
      // Ease in and out so the plane sets off and lands gently.
      const raw = Math.min(1, (now - t0) / FLY);
      const t = raw < .5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      const at = t * len;

      const p = line.getPointAtLength(at);
      // Take the heading from a span either side of the plane, so it stays
      // steady at both ends instead of snapping when the samples coincide.
      const back = line.getPointAtLength(Math.max(0, at - 0.7));
      const fwd = line.getPointAtLength(Math.min(len, at + 0.7));
      // The glyph points north, so east (0 rad) needs a quarter turn.
      const angle = Math.atan2(fwd.y - back.y, fwd.x - back.x) * 180 / Math.PI + 90;

      plane.style.left = `${p.x}%`;
      plane.style.top = `${svgYToPct(p.y)}%`;
      plane.style.transform = `translate(-50%, -50%) rotate(${angle.toFixed(2)}deg)`;
      line.style.strokeDashoffset = `${len * (1 - t)}`;
      if (raw < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };

  // 1. the announcement, 2. the passport, 3. the flight, 4. the arrival.
  step(() => stage.classList.add('show-book'), 1300);
  step(() => focus(mid[0], mid[1], travelZoom, 900), 1500);
  step(() => { plane.classList.add('is-flying'); fly(); }, 2400);
  step(() => focus(landAt[0], landAt[1], travelZoom * 1.08, 1100), 2400 + FLY * 0.55);
  step(() => { plane.classList.add('is-gone'); drop.classList.add('is-landing'); }, 2400 + FLY + 250);
  step(() => stage.classList.add('show-reveal'), 2400 + FLY + 900);
  step(() => {
    stage.classList.remove('show-reveal');
    focus(50, 50, 1, 1200);                    // pull back to the whole passport
    stage.classList.add('show-all');
  }, 2400 + FLY + 3400);
  step(() => stage.classList.add('show-continue'), 2400 + FLY + 4200);

  const finish = () => {
    cancelAnimationFrame(raf);
    clearJourney();
    box.classList.add('is-leaving');
    setTimeout(() => {
      box.hidden = true;
      box.classList.remove('is-leaving', 'is-running');
      box.innerHTML = '';
      if (currentTab === 'profile') renderProfile();
    }, 420);
  };

  $('.jn-continue', box).addEventListener('click', finish);
  // Tapping anywhere jumps to the end rather than trapping anyone in the film.
  box.addEventListener('click', (e) => {
    if (e.target.closest('.jn-continue')) return;
    if (stage.classList.contains('show-continue')) { finish(); return; }
    clearJourney();
    cancelAnimationFrame(raf);
    line.style.strokeDashoffset = '0';
    plane.classList.add('is-gone');
    drop.classList.add('is-landing');
    focus(50, 50, 1, 700);
    stage.classList.add('show-book', 'show-all', 'show-continue');
  });
}

/** Called after a level lands. Plays once per level, ever. */
function maybeJourney(level, fromLevel) {
  const seen = state.progress.shownUpTo || 1;
  if (level <= seen) return false;

  const dest = stopFor(level);
  state.progress.shownUpTo = level;
  state.progress.discoveredAt = state.progress.discoveredAt || {};
  if (dest && !state.progress.discoveredAt[dest.id]) {
    state.progress.discoveredAt[dest.id] = Date.now();
  }
  save();

  if (!dest || !dest.photo) return false;
  playJourney(dest, fromLevel);
  return true;
}

/* ── Navigation ────────────────────────────────────────────── */

function showTab(tab) {
  currentTab = tab;
  for (const view of $$('.view')) view.hidden = view.dataset.view !== tab;
  for (const btn of $$('.tab')) {
    const on = btn.dataset.tab === tab;
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-selected', String(on));
  }
  // The + adds homework, so it only belongs on the homework screens — and on
  // Bag it would sit on top of the reminder's own Add button.
  $('#fab').hidden = tab !== 'home' && tab !== 'subjects';
  render();
  window.scrollTo(0, 0);
}

function openSubjectPage(id) {
  openSubjectId = id;
  const page = $('#subject-page');
  page.hidden = false;
  page.classList.remove('is-leaving');
  renderSubjectPage(id);
  page.scrollTop = 0;
}

function closeSubjectPage() {
  const page = $('#subject-page');
  if (page.hidden) return;
  page.classList.add('is-leaving');
  setTimeout(() => {
    page.hidden = true;
    page.classList.remove('is-leaving');
    openSubjectId = null;
    render();
  }, 240);
}


/* ── Add / edit homework ───────────────────────────────────── */

let draft = null;

function openHwSheet({ id = null, subjectId = null } = {}) {
  if (!state.subjects.length) return;

  const editing = id ? state.homework.find(h => h.id === id) : null;
  draft = {
    id,
    subjectId: editing ? editing.subjectId
      : (subjectId || state.lastSubjectId || state.subjects[0].id),
    title: editing ? editing.title : '',
    dueDate: editing ? editing.dueDate : null,
  };
  if (!subjectById(draft.subjectId)) draft.subjectId = state.subjects[0].id;

  $('#hw-delete').hidden = !editing;
  const input = $('#hw-title');
  input.value = draft.title;

  drawSheetChips();
  showSheet('#sheet-hw');

  // Focus inside the gesture so mobile keyboards actually open.
  input.focus();
  if (editing) input.setSelectionRange(input.value.length, input.value.length);
  syncSaveButton();
}

function drawSheetChips() {
  $('#hw-subjects').innerHTML = state.subjects.map(s => `
    <button class="chip ${s.id === draft.subjectId ? 'is-on' : ''}" data-sub="${s.id}" style="--sc:${s.color}">
      <span class="chip-dot"></span>${esc(s.name)}
    </button>`).join('');

  const soon = [
    { key: addDays(0), label: 'Today' },
    { key: addDays(1), label: 'Tomorrow' },
    { key: addDays(2), label: keyToDate(addDays(2)).toLocaleDateString([], { weekday: 'short' }) },
  ];
  // A chosen date outside the quick picks still gets a chip of its own.
  if (draft.dueDate && !soon.some(o => o.key === draft.dueDate)) {
    soon.push({ key: draft.dueDate, label: dueLabel(draft.dueDate) });
  }

  // The date field sits transparently on top of its chip: tapping the chip is a
  // real tap on a real input, which is the only thing phones reliably open a
  // picker for.
  $('#hw-due').innerHTML = soon.map(o => `
    <button class="chip chip-due ${o.key === draft.dueDate ? 'is-on' : ''}" data-due="${o.key}">
      ${esc(o.label)}
    </button>`).join('') + `
    <label class="chip chip-due chip-date">
      <svg class="ico" aria-hidden="true"><use href="#i-calendar" /></svg>
      <span>Pick a date</span>
      <input id="hw-date" type="date" value="${draft.dueDate || ''}" aria-label="Pick a date" />
    </label>`;
}

function syncSaveButton() {
  $('#hw-save').disabled = !$('#hw-title').value.trim();
}

function saveHw() {
  const title = $('#hw-title').value.trim();
  if (!title || !draft) return;

  if (draft.id) {
    const hw = state.homework.find(h => h.id === draft.id);
    if (hw) Object.assign(hw, { title, subjectId: draft.subjectId, dueDate: draft.dueDate });
  } else {
    state.homework.push({
      id: uid(),
      subjectId: draft.subjectId,
      title,
      dueDate: draft.dueDate,
      createdAt: Date.now(),
      completed: false,
      completedAt: null,
    });
  }
  state.lastSubjectId = draft.subjectId;
  save();
  closeSheet();
  render();
}

function deleteHw() {
  if (!draft || !draft.id) return;
  state.homework = state.homework.filter(h => h.id !== draft.id);
  save();
  closeSheet();
  render();
}


/* ── Sheets ────────────────────────────────────────────────── */

let openSheetSel = null;

function showSheet(sel) {
  openSheetSel = sel;
  $('#scrim').hidden = false;
  $('#scrim').classList.remove('is-leaving');
  const sheet = $(sel);
  sheet.hidden = false;
  sheet.classList.remove('is-leaving');
}

function closeSheet() {
  if (!openSheetSel) return;
  const sheet = $(openSheetSel);
  const scrim = $('#scrim');
  sheet.classList.add('is-leaving');
  scrim.classList.add('is-leaving');
  const sel = openSheetSel;
  openSheetSel = null;
  setTimeout(() => {
    $(sel).hidden = true;
    $(sel).classList.remove('is-leaving');
    scrim.hidden = true;
    scrim.classList.remove('is-leaving');
  }, 250);
}


/* ── Completing homework ───────────────────────────────────── */

let undoTimer = null;

function completeHw(id, node) {
  const hw = state.homework.find(h => h.id === id);
  if (!hw || hw.completed) return;

  const before = levelFor(state.progress.xp);
  hw.completed = true;
  hw.completedAt = Date.now();
  state.progress.xp += XP_PER_HOMEWORK;
  state.progress.level = levelFor(state.progress.xp);
  save();

  const after = state.progress.level;
  const slot = node ? node.closest('.hw-slot') : null;

  if (slot) {
    slot.querySelector('.hw').classList.add('is-done');
    // Let the tick land before the row leaves, so it never just blinks away.
    setTimeout(() => {
      slot.style.height = `${slot.offsetHeight}px`;
      void slot.offsetHeight;
      slot.classList.add('is-leaving');
      slot.style.height = '0px';
      setTimeout(() => { render(); }, 330);
    }, 560);
  } else {
    render();
  }

  showToast(`Completed  ·  +${XP_PER_HOMEWORK} XP`, () => undoComplete(id));
  if (after > before) setTimeout(() => showLevelUp(after, before), 950);
}

function undoComplete(id) {
  const hw = state.homework.find(h => h.id === id);
  if (!hw) return;
  hw.completed = false;
  hw.completedAt = null;
  state.progress.xp = Math.max(0, state.progress.xp - XP_PER_HOMEWORK);
  state.progress.level = levelFor(state.progress.xp);
  save();
  hideToast();
  render();
}

function showToast(text, onUndo) {
  const toast = $('#toast');
  clearTimeout(undoTimer);
  $('#toast-text').textContent = text;
  $('#toast-undo').onclick = onUndo;
  toast.hidden = false;
  toast.classList.remove('is-leaving');
  undoTimer = setTimeout(hideToast, 4200);
}

function hideToast() {
  const toast = $('#toast');
  if (toast.hidden) return;
  clearTimeout(undoTimer);
  toast.classList.add('is-leaving');
  setTimeout(() => { toast.hidden = true; toast.classList.remove('is-leaving'); }, 220);
}

/** Every level reaches a new place, so every level flies there. */
function showLevelUp(level, from) {
  if (maybeJourney(level, from)) return;

  // No journey to play (already seen, or past the last place): a quiet note.
  const box = $('#levelup');
  box.innerHTML = `
    <div class="levelup-card">
      <div class="levelup-ring"><span>${level}</span></div>
      <h2>Level ${from || level - 1} → ${level}</h2>
      <p>${esc(stopFor(level).name)}</p>
    </div>`;
  box.hidden = false;
  box.classList.remove('is-leaving');
  sparks();
  const close = () => {
    box.classList.add('is-leaving');
    setTimeout(() => { box.hidden = true; box.classList.remove('is-leaving'); }, 320);
  };
  box.onclick = close;
  setTimeout(close, 2200);
}

/** A small burst — celebratory, over in a second, gone. */
function sparks() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cx = innerWidth / 2, cy = innerHeight / 2 - 70;
  for (let i = 0; i < 16; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    s.style.background = PALETTE[i % PALETTE.length];
    s.style.left = `${cx}px`;
    s.style.top = `${cy}px`;
    document.body.appendChild(s);
    const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.4;
    const dist = 90 + Math.random() * 90;
    s.animate([
      { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
      { transform: `translate(${Math.cos(angle) * dist - 4}px, ${Math.sin(angle) * dist - 4}px) scale(.4)`, opacity: 0 },
    ], { duration: 800 + Math.random() * 320, easing: 'cubic-bezier(.2,.7,.3,1)' })
      .onfinish = () => s.remove();
  }
}


/* ── Swipe right to complete ───────────────────────────────── */

function wireSwipe(root) {
  let card = null, id = null, x0 = 0, y0 = 0, dx = 0, locked = null;

  root.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    const hit = e.target.closest('.hw');
    if (!hit) return;
    card = hit;
    id = hit.closest('.hw-slot').dataset.id;
    x0 = e.clientX; y0 = e.clientY; dx = 0; locked = null;
  });

  root.addEventListener('pointermove', (e) => {
    if (!card) return;
    const mx = e.clientX - x0, my = e.clientY - y0;
    if (locked === null) {
      if (Math.abs(mx) < 8 && Math.abs(my) < 8) return;
      locked = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
      if (locked === 'y') { card = null; return; }
    }
    dx = Math.max(0, Math.min(mx, 110));
    card.style.transition = 'none';
    card.style.transform = `translateX(${dx}px)`;
    card.classList.toggle('is-swiping', dx > 20);
  });

  const end = () => {
    if (!card) return;
    const target = card, done = dx > 74, hwId = id;
    target.style.transition = '';
    target.style.transform = '';
    target.classList.remove('is-swiping');
    card = null; dx = 0;
    if (done) {
      target.dataset.swiped = '1';
      completeHw(hwId, target.querySelector('.check'));
    }
  };
  root.addEventListener('pointerup', end);
  root.addEventListener('pointercancel', end);
}


/* ── Onboarding & subject editing ──────────────────────────── */

let picked = [];      // {name, icon, color, id?}
let showingNewInput = false;

function renderPicker(container) {
  const rows = PRESETS.map(p => {
    const on = picked.find(s => s.name === p.name);
    return `
      <button class="pick ${on ? 'is-on' : ''}" data-preset="${esc(p.name)}" style="--sc:${p.color}">
        ${tile(p)}<span class="pick-name">${esc(p.name)}</span>
      </button>`;
  });

  const customs = picked.filter(s => !PRESETS.some(p => p.name === s.name));
  for (const c of customs) {
    rows.push(`
      <button class="pick is-on" data-custom="${esc(c.name)}" style="--sc:${c.color}">
        ${tile(c)}<span class="pick-name">${esc(c.name)}</span>
      </button>`);
  }

  rows.push(showingNewInput
    ? `<div class="pick-input">
         <input id="new-subject" type="text" placeholder="Subject name" autocomplete="off" enterkeyhint="done" />
         <button data-act="add-subject">Add</button>
       </div>`
    : `<button class="pick pick-new" data-act="new-subject">
         <svg class="ico" aria-hidden="true"><use href="#i-plus" /></svg><span class="pick-name">Add your own</span>
       </button>`);

  container.innerHTML = rows.join('');
  if (showingNewInput) $('#new-subject', container).focus();
}

function wirePicker(container, onChange) {
  container.addEventListener('click', (e) => {
    const preset = e.target.closest('[data-preset]');
    const custom = e.target.closest('[data-custom]');
    const act = e.target.closest('[data-act]');

    if (preset) {
      const name = preset.dataset.preset;
      const at = picked.findIndex(s => s.name === name);
      if (at >= 0) { if (!confirmRemove(picked[at])) return; picked.splice(at, 1); }
      else picked.push({ ...PRESETS.find(p => p.name === name) });
    } else if (custom) {
      const at = picked.findIndex(s => s.name === custom.dataset.custom);
      if (at >= 0) { if (!confirmRemove(picked[at])) return; picked.splice(at, 1); }
    } else if (act && act.dataset.act === 'new-subject') {
      showingNewInput = true;
    } else if (act && act.dataset.act === 'add-subject') {
      if (!addTypedSubject(container)) return;
    } else {
      return;
    }
    renderPicker(container);
    onChange();
  });

  container.addEventListener('keydown', (e) => {
    if (e.target.id === 'new-subject' && e.key === 'Enter') {
      e.preventDefault();
      if (addTypedSubject(container)) { renderPicker(container); onChange(); }
    }
  });
}

function addTypedSubject(container) {
  const input = $('#new-subject', container);
  const name = input ? input.value.trim() : '';
  if (!name) { showingNewInput = false; return true; }
  if (picked.some(s => s.name.toLowerCase() === name.toLowerCase())) { input.value = ''; return false; }
  picked.push({ name, icon: null, color: nextColorFor(picked) });
  showingNewInput = false;
  return true;
}

function nextColorFor(list) {
  const used = new Set(list.map(s => s.color));
  return PALETTE.find(c => !used.has(c)) || PALETTE[list.length % PALETTE.length];
}

/** Removing a subject takes its homework with it, so ask first. */
function confirmRemove(sub) {
  if (!sub.id) return true;
  const n = state.homework.filter(h => h.subjectId === sub.id).length;
  if (!n) return true;
  return confirm(`Remove ${sub.name}? Its ${n} homework item${n === 1 ? '' : 's'} will be deleted too.`);
}

function commitSubjects() {
  const keptIds = new Set(picked.filter(s => s.id).map(s => s.id));
  state.homework = state.homework.filter(h => keptIds.has(h.subjectId) || !state.subjects.some(s => s.id === h.subjectId));
  state.subjects = picked.map(s => s.id ? s
    : { id: uid(), name: s.name, icon: s.icon, glyph: s.glyph || null, color: s.color });
  if (!subjectById(state.lastSubjectId)) state.lastSubjectId = state.subjects[0] ? state.subjects[0].id : null;
  save();
}


/* ── Daily reminder ────────────────────────────────────────── */

const timers = { daily: null, bag: null };

const notifySupported = () => 'Notification' in window;

function reminderNote() {
  if (!notifySupported()) return 'This browser can’t show notifications.';
  if (Notification.permission === 'denied') {
    return 'Notifications are turned off for this page. Open it in its own tab, or allow notifications in your browser settings.';
  }
  if (state.settings.dailyReminderEnabled || state.settings.bagReminderEnabled) {
    return 'Add the app to your home screen so it can still reach you after school.';
  }
  return 'Optional. One nudge to write down homework, one to pack your bag.';
}

function nextOccurrence(hhmm) {
  const [h, m] = String(hhmm).split(':').map(Number);
  const next = new Date();
  next.setHours(h || 0, m || 0, 0, 0);
  if (next <= new Date()) next.setDate(next.getDate() + 1);
  return next;
}

function scheduleOne(key, enabledKey, timeKey, fire) {
  clearTimeout(timers[key]);
  if (!state.settings[enabledKey]) return;
  if (!notifySupported() || Notification.permission !== 'granted') return;
  timers[key] = setTimeout(() => {
    fire();
    // Re-arm only this one. Rescheduling the pair here would cancel the
    // other reminder's pending timer when both land on the same minute.
    scheduleOne(key, enabledKey, timeKey, fire);
  }, nextOccurrence(state.settings[timeKey]) - Date.now());
}

function scheduleReminder() {
  scheduleOne('daily', 'dailyReminderEnabled', 'dailyReminderTime', fireHomeworkReminder);
  scheduleOne('bag', 'bagReminderEnabled', 'bagReminderTime', fireBagReminder);
}

async function notify(title, body) {
  const opts = { body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: title };
  try {
    const reg = await navigator.serviceWorker?.ready;
    if (reg) reg.showNotification(title, opts);
    else new Notification(title, opts);
  } catch {
    try { new Notification(title, opts); } catch { /* nothing more to do */ }
  }
}

function fireHomeworkReminder() {
  const left = activeHw().length;
  notify('Any homework today?',
    left ? `You have ${left} left. Anything new today?` : 'Add today’s homework while it’s fresh.');
}

/** The next day that actually has school, skipping the weekend. */
function nextSchoolDay() {
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const idx = schoolDayIndex(d);
    if (idx >= 0) return idx;
  }
  return -1;
}

/** Evening nudge: tomorrow's lessons, plus anything you told it to remember. */
function fireBagReminder() {
  const idx = nextSchoolDay();
  if (idx < 0) return;
  const day = SCHOOL_DAYS[idx];
  const lessons = lessonsFor(idx).map(l => l.name);
  const notes = state.notes.filter(n => n.day === null || n.day === idx).map(n => n.text);

  const parts = [];
  if (lessons.length) parts.push(lessons.join(', '));
  if (notes.length) parts.push('Don’t forget: ' + notes.join('; '));
  notify(`Pack for ${day.en}`, parts.join(' — ') || 'Nothing scheduled.');
}

async function toggleReminder(enabledKey, on) {
  if (on) {
    if (!notifySupported()) { renderProfile(); return; }
    let perm = Notification.permission;
    if (perm === 'default') perm = await Notification.requestPermission();
    if (perm !== 'granted') { state.settings[enabledKey] = false; save(); renderProfile(); return; }
  }
  state.settings[enabledKey] = on;
  save();
  scheduleReminder();
  renderProfile();
}


/* ── Wiring ────────────────────────────────────────────────── */

function wireLists() {
  const handle = (e) => {
    const row = e.target.closest('.hw-slot');
    if (!row) return;
    const card = row.querySelector('.hw');
    if (card && card.dataset.swiped) { delete card.dataset.swiped; return; }

    const act = e.target.closest('[data-act]');
    if (!act) return;
    if (act.dataset.act === 'complete') completeHw(row.dataset.id, act);
    if (act.dataset.act === 'edit') openHwSheet({ id: row.dataset.id });
  };

  on('#home-list', 'click', handle);
  on('#subject-page-body', 'click', handle);
  wireSwipe($('#home-list'));
  wireSwipe($('#subject-page-body'));

  on('#subject-list', 'click', (e) => {
    const row = e.target.closest('.subject-row');
    if (row) openSubjectPage(row.dataset.id);
  });
}

function wireApp() {
  for (const btn of $$('.tab')) btn.addEventListener('click', () => showTab(btn.dataset.tab));

  on('#fab', 'click', () => openHwSheet());
  on('#subject-back', 'click', closeSubjectPage);
  on('#scrim', 'click', closeSheet);

  // Timetable, reachable from anywhere
  on('#tt-btn', 'click', openTimetable);
  on('#tt-close', 'click', closeTimetable);

  // Bag: day switcher, reminders
  on('#bag-days', 'click', (e) => {
    const chip = e.target.closest('[data-day]');
    if (!chip) return;
    bagDay = Number(chip.dataset.day);
    renderBag();
  });

  on('#bag-body', 'click', (e) => {
    const act = e.target.closest('[data-act]');
    if (!act) return;
    if (act.dataset.act === 'edit-everyday') openItemsSheet('everyday');
    if (act.dataset.act === 'edit-lesson') openItemsSheet(act.dataset.lesson);
  });

  on('#tt-preview', 'click', openTimetable);
  on('#items-save', 'click', saveItems);
  on('#items-chips', 'click', (e) => {
    const chip = e.target.closest('[data-item]');
    if (chip) toggleItem(chip.dataset.item);
  });
  on('#items-custom-add', 'click', addCustomItem);
  on('#items-custom', 'keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addCustomItem(); }
  });

  // Reminders page
  on('#rem-input', 'keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addReminder(); }
  });
  on('#rem-add', 'click', addReminder);

  on('#rem-scope', 'click', (e) => {
    const seg = e.target.closest('[data-scope]');
    if (!seg) return;
    remScope = seg.dataset.scope;
    renderReminders();
  });

  on('#rem-days', 'click', (e) => {
    const chip = e.target.closest('[data-remday]');
    if (!chip) return;
    remDay = chip.dataset.remday === 'all' ? null : Number(chip.dataset.remday);
    remLesson = null;                 // lessons differ from day to day
    renderReminders();
  });

  on('#rem-lessons', 'click', (e) => {
    const chip = e.target.closest('[data-remlesson]');
    if (!chip) return;
    remLesson = chip.dataset.remlesson || null;
    renderReminders();
  });

  on('#rem-list', 'click', (e) => {
    const act = e.target.closest('[data-act=\"del-note\"]');
    if (!act) return;
    const id = act.closest('[data-note]').dataset.note;
    state.notes = state.notes.filter(n => n.id !== id);
    save();
    renderReminders();
  });

  // Add / edit sheet
  on('#hw-title', 'input', syncSaveButton);
  on('#hw-title', 'keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); saveHw(); }
  });
  on('#hw-save', 'click', saveHw);
  on('#hw-delete', 'click', deleteHw);

  on('#hw-subjects', 'click', (e) => {
    const chip = e.target.closest('[data-sub]');
    if (!chip) return;
    draft.subjectId = chip.dataset.sub;
    drawSheetChips();
  });

  on('#hw-due', 'click', (e) => {
    const chip = e.target.closest('[data-due]');
    if (!chip) return;
    draft.dueDate = draft.dueDate === chip.dataset.due ? null : chip.dataset.due;  // tap again to clear
    drawSheetChips();
  });

  // Delegated: the date input is rebuilt every time the chips redraw.
  on('#hw-due', 'change', (e) => {
    if (e.target.id !== 'hw-date' || !e.target.value) return;
    draft.dueDate = e.target.value;
    drawSheetChips();
  });

  // Subject editing from the Subjects tab
  on('#edit-subjects', 'click', () => {
    picked = state.subjects.map(s => ({ ...s }));
    showingNewInput = false;
    renderPicker($('#subject-picker-2'));
    showSheet('#sheet-subjects');
  });
  on('#subjects-done', 'click', () => {
    if (!picked.length) return;
    commitSubjects();
    closeSheet();
    render();
  });
  wirePicker($('#subject-picker-2'), () => {
    $('#subjects-done').disabled = !picked.length;
  });

  // Settings
  on('#reminder-toggle', 'change', (e) => toggleReminder('dailyReminderEnabled', e.target.checked));
  on('#bag-toggle', 'change', (e) => toggleReminder('bagReminderEnabled', e.target.checked));

  on('#reminder-time', 'change', (e) => {
    state.settings.dailyReminderTime = e.target.value || '15:00';
    save();
    scheduleReminder();
  });
  on('#bag-time', 'change', (e) => {
    state.settings.bagReminderTime = e.target.value || '20:00';
    save();
    scheduleReminder();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!$('#destination').hidden) closeStop();
    else if (!$('#timetable').hidden) closeTimetable();
    else if (openSheetSel) closeSheet();
    else if (!$('#subject-page').hidden) closeSubjectPage();
  });

  on('#home-list', 'click', (e) => {
    if (e.target.closest('[data-act="add-first"]')) openHwSheet();
  });
  on('#rem-list', 'click', (e) => {
    if (!e.target.closest('[data-act="first-reminder"]')) return;
    const input = $('#rem-input');
    if (input) input.focus();
  });

  on('#passport', 'click', (e) => {
    const stop = e.target.closest('[data-stop]');
    if (stop) openStop(stop.dataset.stop);
  });
  on('#dv-close', 'click', closeStop);

  wireLists();
}

/* Second setup step: what each lesson needs. Pre-filled with sensible
   guesses so it can be skipped by anyone in a hurry. */

let obStep = 1;

/* Already answered for you — tap a row only if something is wrong. */
function itemsRow(key, label, list, color) {
  return `
    <button class="items-row" data-items="${esc(key)}" style="--sc:${color}">
      <span class="items-label"><span class="chip-dot"></span>${esc(label)}</span>
      <span class="items-preview">
        ${list.length
          ? list.map(i => `<span class="items-pill">${emojiFor(i)} ${esc(i)}</span>`).join('')
          : '<span class="items-none">Nothing</span>'}
      </span>
    </button>`;
}

function renderItemsEditor() {
  const box = $('#items-editor');
  if (!box) return;
  box.innerHTML =
    itemsRow('everyday', 'Every day', state.everydayItems, 'var(--ink-2)') +
    LESSONS.map(l => {
      const sub = subjectForLesson(l);
      return itemsRow(l, shortName(l), itemsFor(l), sub ? sub.color : 'var(--ink-3)');
    }).join('');
}

function wireOnboarding() {
  on('#items-editor', 'click', (e) => {
    const row = e.target.closest('[data-items]');
    if (row) openItemsSheet(row.dataset.items === 'everyday' ? 'everyday' : row.dataset.items);
  });

  wirePicker($('#subject-picker'), () => {
    $('#onboarding-done').disabled = !picked.length;
  });
  on('#onboarding-done', 'click', () => {
    if (obStep === 1) {
      if (!picked.length) return;
      commitSubjects();
      obStep = 2;
      renderItemsEditor();
      $('#ob-step1').hidden = true;
      $('#ob-step2').hidden = false;
      $('#onboarding-done').textContent = 'Done';
      window.scrollTo(0, 0);
      return;
    }
    state.onboarded = true;
    save();
    $('#onboarding').hidden = true;
    $('#main').hidden = false;
    showTab('home');
    setTimeout(() => openHwSheet(), 420);   // straight into the first entry
  });
}


/* ── Boot ──────────────────────────────────────────────────── */

function boot() {
  load();
  saveLocal();      // write the migrated shape back, without bumping the sync clock
  wireApp();
  wireOnboarding();

  if (state.onboarded && state.subjects.length) {
    $('#main').hidden = false;
    showTab('home');
  } else {
    picked = state.subjects.map(s => ({ ...s }));
    renderPicker($('#subject-picker'));
    $('#onboarding-done').disabled = !picked.length;
    $('#onboarding').hidden = false;
  }

  scheduleReminder();

  // Opened from the notification or the home-screen shortcut.
  if (new URLSearchParams(location.search).get('add') === '1' && state.onboarded) {
    setTimeout(() => openHwSheet(), 300);
    history.replaceState(null, '', location.pathname);
  }

  // Dates drift while the app sits open; refresh when it comes back.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') { render(); scheduleReminder(); }
  });

  connectSync();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is a bonus */ });
    navigator.serviceWorker.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'add-homework' && state.onboarded) openHwSheet();
    });
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

})();
