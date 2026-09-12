/* Homework — all your homework in one place.
   One file, no build step, no dependencies. Sections below:
   data → dates → store → render → add/edit → completing → onboarding → reminders → boot */

(() => {
'use strict';

/* ── Data ──────────────────────────────────────────────────── */

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
  ['מתמטיקה', 'מתמטיקה', 'אזרחות', 'חינוך', 'שפה', 'שפה', 'מעבדה', 'מעבדה'],
  ['ביולוגיה', 'ספורט', 'ערבית', 'ערבית', 'אנגלית', 'אנגלית', null, null],
  ['תנ״ך', 'תנ״ך', 'הנדסה', 'הנדסה', 'פיסיקה', 'הסטוריה', null, null],
  ['תכנות', 'תכנות', 'אזרחות', 'פיסיקה', 'הסטוריה', 'ערבית', 'מתמטיקה', null],
  ['חינוך', 'ביולוגיה', 'ספורט', 'ספרות', 'ספרות', 'אנגלית', 'אנגלית', null],
];

// Only used to move homework saved before subjects came from the timetable:
// it matches the name you had picked onto the lesson it clearly meant.
const OLD_SUBJECT_ALIASES = {
  'מתמטיקה':  ['math', 'מתמטיקה'],
  'הנדסה':    ['geometry', 'engineering', 'הנדסה'],
  'ביולוגיה': ['biology', 'ביולוגיה', 'bio'],
  'פיסיקה':   ['physics', 'פיסיקה', 'פיזיקה'],
  'אנגלית':   ['english', 'אנגלית'],
  'הסטוריה':  ['history', 'הסטוריה', 'היסטוריה'],
  'ספרות':    ['literature', 'ספרות'],
  'תנ״ך':     ['tanach', 'bible', 'תנך', 'תנ״ך'],
  'ערבית':    ['arabic', 'ערבית'],
  'אזרחות':   ['civics', 'אזרחות'],
  'ספורט':    ['pe', 'sport', 'ספורט', 'חנג', 'חנ״ג'],
  'שפה':      ['hebrew', 'לשון', 'שפה'],
  'חינוך':    ['homeroom', 'חינוך'],
  'תכנות':    ['computer', 'programming', 'code', 'תכנות', 'מדמ״ח', 'מדמח'],
  'מעבדה':    ['lab', 'מעבדה', 'science'],
};

/** Every distinct lesson in the week, in the order it first appears. */
const LESSONS = (() => {
  const seen = [];
  for (const row of SCHEDULE) for (const name of row) if (name && !seen.includes(name)) seen.push(name);
  return seen;
})();

// Every lesson name is short enough for the week to fit one screen now, but
// the seam stays: a longer one would go here.
const SHORT_NAME = {};
const shortName = (n) => SHORT_NAME[n] || n;


/* ── Subjects ──────────────────────────────────────────────
   There is nothing to answer here. The timetable already knows every subject
   you have, so the app takes them straight off it — one per distinct lesson,
   in the order the week first meets them. A lesson's name is also its id:
   stable, and readable if you ever look in storage. */

const SUBJECT_LOOK = {
  'מתמטיקה':  { icon: 'i-math',      color: '#3E63DD' },
  'הנדסה':    { icon: 'i-shapes',    color: '#2F7BC4' },
  'אזרחות':   { icon: 'i-scales',    color: '#8A6D3B' },
  'חינוך':    { icon: 'i-people',    color: '#7C7A76' },
  'שפה':      { icon: null, glyph: 'א', color: '#C0553D' },
  'מעבדה':    { icon: 'i-flask',     color: '#12A594' },
  'ביולוגיה': { icon: 'i-leaf',      color: '#4FA83D' },
  'ספורט':    { icon: 'i-ball',      color: '#D9772E' },
  'ערבית':    { icon: 'i-globe',     color: '#C97B1E' },
  'אנגלית':   { icon: 'i-pencil',    color: '#C2456A' },
  'תנ״ך':     { icon: 'i-bookmark',  color: '#9A7B2E' },
  'פיסיקה':   { icon: 'i-atom',      color: '#7C5CD6' },
  'הסטוריה':  { icon: 'i-hourglass', color: '#A0704A' },
  'תכנות':    { icon: 'i-code',      color: '#5B6B7C' },
  'ספרות':    { icon: 'i-book',      color: '#B04FA0' },
};

const SUBJECTS = LESSONS.map((name) => {
  const look = SUBJECT_LOOK[name] || {};
  return {
    id: name,
    name,
    icon: 'icon' in look ? look.icon : 'i-bookmark',
    glyph: look.glyph || null,
    color: look.color || '#7C7A76',
  };
});

const PALETTE = SUBJECTS.map(s => s.color);

/** The timetable's subjects, plus anything older data left behind. */
const allSubjects = () => SUBJECTS.concat(state.extraSubjects || []);

const subjectById = (id) => allSubjects().find(s => s.id === id) || null;

/** A lesson is a subject now, so this is just a lookup. */
const subjectForLesson = (name) => subjectById(name);

/* ── What goes in the bag ──────────────────────────────────
   Worked out from the timetable, not from anything you have to keep up to
   date: every lesson wants a notebook except חינוך, five of them want a book
   as well, and three have something of their own. */

const SPORT = 'ספורט';
const NO_NOTEBOOK = ['חינוך'];
const NEEDS_BOOK = ['מתמטיקה', 'הנדסה', 'ערבית', 'ספרות', 'שפה'];
const SPECIAL = {
  'תכנות': [{ key: 'laptop', label: 'MacBook' }, { key: 'airpods', label: 'AirPods' }],
  'תנ״ך':  [{ key: 'tanach', label: 'ספר תנ״ך' }],
};

/** A lesson in the words you picked it in, falling back to the timetable's. */
function lessonLabel(name) {
  const sub = subjectForLesson(name);
  return sub ? sub.name : shortName(name);
}

/** Everything that goes in the bag on one day, in the order it is drawn. */
function bagThings(dayIndex) {
  const names = lessonsFor(dayIndex).map(l => l.name);
  const list = (only) => {
    const out = [];
    for (const n of names.filter(only)) {
      const label = lessonLabel(n);
      if (!out.includes(label)) out.push(label);
    }
    return out;
  };

  const things = [
    { key: 'pencil', label: 'Pencil bag' },
    { key: 'bottle', label: 'Bottle' },
    { key: 'lunch',  label: 'Lunch box' },
  ];

  if (names.includes(SPORT)) things.push({ key: 'shoes', label: 'Sports shoes' });

  const notebooks = list(n => !NO_NOTEBOOK.includes(n));
  if (notebooks.length) {
    things.push({ key: 'notebook', label: 'Notebooks', detail: notebooks.join(' · ') });
  }
  const books = list(n => NEEDS_BOOK.includes(n));
  if (books.length) {
    things.push({ key: 'books', label: 'Books', detail: books.join(' · ') });
  }

  // Sport and the special lessons never fall on the same day, so the one slot
  // beside the bag is enough for whichever of them turns up.
  for (const name of names) {
    // Two things for one lesson only need to say so once.
    (SPECIAL[name] || []).forEach((extra, i) => {
      things.push({ ...extra, detail: i === 0 ? lessonLabel(name) : '' });
    });
  }
  return things;
}


/* ── The bag, drawn ────────────────────────────────────────
   The artwork is supplied, one file per thing, so none of it is redrawn here.
   Each picture keeps its own shape: the width is a share of the scene and the
   height follows from the file, which is also why nothing jumps while they
   load. Only the leads are drawn, and only because they have to know where the
   bag is. */

const BAG_SCENE = { w: 400, h: 510 };

/* The AirPods hang below the bag, which is the one thing that needs the scene
   to be taller — and only on the day they turn up. */
const BAG_LOW = ['airpods'];

/* Width as a share of the scene, and the shape each file came out at. */
const BAG_PICS = {
  pack:     { w: 0.40,  ratio: 0.84 },
  pencil:   { w: 0.245, ratio: 1.45 },
  bottle:   { w: 0.115, ratio: 0.47 },
  lunch:    { w: 0.205, ratio: 1.54 },
  notebook: { w: 0.225, ratio: 0.98 },
  books:    { w: 0.235, ratio: 1.17 },
  shoes:    { w: 0.235, ratio: 1.42 },
  laptop:   { w: 0.26,  ratio: 1.44 },
  airpods:  { w: 0.155, ratio: 0.73 },
  tanach:   { w: 0.15,  ratio: 0.86 },
};

const PACK_PLACE = { x: 202, y: 232 };

/* Where each thing sits (its middle), where its name goes under it, and where
   its lead leaves and lands. Measured off the drawing this copies.

   Sport, the MacBook and the Tanach share the slot beside the bag and the
   AirPods take the one above it: they never fall on the same day. */
const BAG_PLACES = {
  pencil:   { x: 86,  y: 84,  label: 134 },
  bottle:   { x: 333, y: 88,  label: 145 },
  airpods:  { x: 200, y: 470, label: 528 },
  lunch:    { x: 68,  y: 212, label: 247 },
  shoes:    { x: 340, y: 212, label: 253 },
  laptop:   { x: 340, y: 210, label: 254 },
  tanach:   { x: 340, y: 210, label: 253 },
  notebook: { x: 88,  y: 378, label: 432 },
  books:    { x: 318, y: 372, label: 420 },
};

/** The wash behind each name, taken from the thing it belongs to. */
const BAG_TINT = {
  pencil: '#6E94C4', bottle: '#A3BFA5', lunch: '#A3BFA5', shoes: '#6E94C4',
  notebook: '#E4918A', books: '#6E94C4', laptop: '#9AA3AE', airpods: '#9AA3AE',
  tanach: '#3E5C8A',
};

/** One picture, centred on its place, sized as a share of the scene. */
function bagPic(key, place, extra, H) {
  const art = BAG_PICS[key];
  const w = Math.round(art.w * BAG_SCENE.w);
  return `<img class="bag-pic ${extra}" src="art/bag/${key}.webp" alt="" aria-hidden="true"
       width="${w}" height="${Math.round(w / art.ratio)}" decoding="async"
       style="left:${(place.x / BAG_SCENE.w) * 100}%; top:${(place.y / H) * 100}%;
              width:${art.w * 100}%" />`;
}

/**
 * The scene for one day. Everything on it is worked out from the timetable,
 * so there is never anything to answer.
 */
function bagScene(dayIndex) {
  const things = bagThings(dayIndex).filter(t => BAG_PLACES[t.key]);
  const H = things.some(t => BAG_LOW.includes(t.key)) ? 560 : BAG_SCENE.h;

  const pics = things.map(t => bagPic(t.key, BAG_PLACES[t.key], 'bag-thing', H)).join('');

  const labels = things.map((t) => {
    const p = BAG_PLACES[t.key];
    return `
      <span class="bag-label ${t.detail ? 'is-wide' : ''}"
            style="left:${(p.x / BAG_SCENE.w) * 100}%; top:${(p.label / H) * 100}%;
                   --tint:${BAG_TINT[t.key] || '#9AA3AE'}">
        <b>${esc(t.label)}</b>
        ${t.detail ? `<i>${esc(t.detail)}</i>` : ''}
      </span>`;
  }).join('');

  return `
    <div class="bag-scene" style="aspect-ratio:${BAG_SCENE.w}/${H}">
      ${bagPic('pack', PACK_PLACE, 'bag-pack', H)}
      ${pics}
      ${labels}
    </div>`;
}

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


/** Weekday index into SCHOOL_DAYS, or -1 at the weekend. */
function schoolDayIndex(d = new Date()) {
  return SCHOOL_DAYS.findIndex(x => x.js === d.getDay());
}

/* ── The collection ────────────────────────────────────────
   Fifty little creatures. They are drawn rather than dropped in as pictures:
   same line weight, same big eyes, same rounded everything, so fifty of them
   sit together as one family.

   Nobody is tied to a level any more. Levelling up cracks an egg and whoever
   is inside is whoever the roll gave you — which is why they have rarities,
   and why the egg is patterned by rarity: you can tell how lucky you were
   before it opens. The first twelve keep the ids they always had, so a
   collection made before this still counts. */

const RARITY = [
  { key: 'common',    label: 'Common',    weight: 55, colour: '#8A94A2' },
  { key: 'uncommon',  label: 'Uncommon',  weight: 26, colour: '#4FA83D' },
  { key: 'rare',      label: 'Rare',      weight: 13, colour: '#3E63DD' },
  { key: 'epic',      label: 'Epic',      weight: 5,  colour: '#9B51C9' },
  { key: 'legendary', label: 'Legendary', weight: 1,  colour: '#D9A94A' },
];

const rarityOf = (key) => RARITY.find(r => r.key === key) || RARITY[0];

const MONSTERS = [
  { id: 'blip', name: 'Blip', rarity: 'common', colour: '#5FB89C', shape: 'round', eyes: 1, top: 'antennae', mark: 'none',
    age: 'Three weeks old', size: 'Fits in a cupped hand', lives: 'In the pencil case, under the rulers',
    eats: 'Pencil shavings, apparently', says: 'A soft blip, about once an hour',
    hobbies: ['Blinking slowly', 'Rolling downhill'], best: 'Finding things you dropped', worst: 'Staying awake past nine',
    fact: 'Blip has one eye and has never once complained about it.' },

  { id: 'pom', name: 'Pom', rarity: 'common', colour: '#E08BA6', shape: 'cloud', eyes: 2, top: 'none', mark: 'none',
    age: 'Half a year', size: 'About the size of a plum', lives: 'In the hood of your coat',
    eats: 'Anything warm', says: 'Nothing at all, ever',
    hobbies: ['Napping in socks', 'Being carried'], best: 'Being comfortable anywhere', worst: 'Walking',
    fact: 'Pom has never walked anywhere by itself and does not intend to start.' },

  { id: 'nib', name: 'Nib', rarity: 'uncommon', colour: '#9186D4', shape: 'tall', eyes: 3, top: 'none', mark: 'none',
    age: 'Four months', size: 'As tall as a glue stick', lives: 'Behind the books on the shelf',
    eats: 'Crumbs, in a very tidy way', says: 'Mm.',
    hobbies: ['Watching everything at once', 'Tidying'], best: 'Noticing what moved', worst: 'Surprises',
    fact: 'With three eyes Nib can watch the door, the window and you at the same time.' },

  { id: 'tuft', name: 'Tuft', rarity: 'common', colour: '#EC9A72', shape: 'round', eyes: 2, top: 'ears', mark: 'none',
    age: 'One year', size: 'A grapefruit with ears', lives: 'At the bottom of your school bag',
    eats: 'Half a biscuit, saved for later', says: 'A small hum when it rains',
    hobbies: ['Listening to rain', 'Hiding in bags'], best: 'Hearing things a room away', worst: 'Loud rooms',
    fact: 'Tuft can hear a packet being opened from the next room.' },

  { id: 'glim', name: 'Glim', rarity: 'rare', colour: '#E3B655', shape: 'drop', eyes: 2, top: 'none', mark: 'glow',
    age: 'Nobody knows', size: 'Roughly a lamp', lives: 'On the desk, after dark',
    eats: 'Does not. Just glows.', says: 'A faint buzz, like a bulb',
    hobbies: ['Glowing gently', 'Reading past bedtime'], best: 'Being the last light on', worst: 'Mornings',
    fact: 'Glim has finished more books than anyone else here.' },

  { id: 'moss', name: 'Moss', rarity: 'common', colour: '#6BA155', shape: 'round', eyes: 2, top: 'sprout', mark: 'none',
    age: 'Two springs', size: 'A flowerpot', lives: 'On the windowsill',
    eats: 'Sunlight and a little water', says: 'A creak, like a growing branch',
    hobbies: ['Growing things', 'Sitting in the sun'], best: 'Keeping plants alive', worst: 'Being indoors too long',
    fact: 'The sprout on Moss’s head is a different plant every spring.' },

  { id: 'wisp', name: 'Wisp', rarity: 'rare', colour: '#7BAED6', shape: 'wisp', eyes: 2, top: 'none', mark: 'none',
    age: 'Older than it looks', size: 'Hard to say — it keeps changing', lives: 'Wherever the draught is',
    eats: 'Nothing anyone has seen', says: 'A long sigh',
    hobbies: ['Drifting', 'Turning up quietly'], best: 'Appearing behind you', worst: 'Staying in one place',
    fact: 'Nobody has ever seen Wisp arrive. It is simply there.' },

  { id: 'cinder', name: 'Cinder', rarity: 'uncommon', colour: '#DB7F52', shape: 'round', eyes: 2, top: 'horns', mark: 'none',
    age: 'Eight months', size: 'A big mug', lives: 'Next to the radiator',
    eats: 'Toast crusts', says: 'A crackle, like a fire',
    hobbies: ['Warming cold hands', 'Small mischief'], best: 'Warming cold hands', worst: 'Keeping a secret',
    fact: 'Cinder is exactly as warm as a fresh cup of tea.' },

  { id: 'pebble', name: 'Pebble', rarity: 'common', colour: '#7F92A6', shape: 'square', eyes: 2, top: 'none', mark: 'spots',
    age: 'Very old', size: 'A paperweight', lives: 'Exactly where you left it',
    eats: 'Once a month, quietly', says: 'Nothing you would notice',
    hobbies: ['Staying put', 'Collecting smaller pebbles'], best: 'Not moving', worst: 'Hurrying',
    fact: 'Pebble has been in the same spot since Tuesday and is very pleased about it.' },

  { id: 'fizz', name: 'Fizz', rarity: 'uncommon', colour: '#49A9A8', shape: 'round', eyes: 2, top: 'antennae', mark: 'bubbles',
    age: 'Two months', size: 'A fizzy drink can', lives: 'In the water bottle pocket',
    eats: 'Bubbles, mostly', says: 'A steady stream of questions',
    hobbies: ['Fizzing', 'Asking questions'], best: 'Asking but why', worst: 'Sitting still',
    fact: 'Fizz has asked about four thousand questions and is not finished.' },

  { id: 'snug', name: 'Snug', rarity: 'common', colour: '#AC825E', shape: 'cloud', eyes: 2, top: 'fringe', mark: 'none',
    age: 'Three years', size: 'A folded jumper', lives: 'Under the duvet',
    eats: 'Breakfast, at length', says: 'A long, contented sound',
    hobbies: ['Blanket forts', 'Long breakfasts'], best: 'Building a fort out of anything', worst: 'Getting up',
    fact: 'Snug once stayed in bed for a Sunday and most of a Monday.' },

  { id: 'luna', name: 'Luna', rarity: 'epic', colour: '#6A78C0', shape: 'tall', eyes: 2, top: 'none', mark: 'stars',
    age: 'One whole moon', size: 'As tall as a bedside lamp', lives: 'On the windowsill at night',
    eats: 'Nothing. Watches instead.', says: 'The names of stars, quietly',
    hobbies: ['Staying up late', 'Naming the stars'], best: 'Knowing which star is which', worst: 'Being awake before noon',
    fact: 'Luna has named every star it can see, and a few it cannot.' },

  { id: 'bud', name: 'Bud', rarity: 'common', colour: '#8FBF6A', shape: 'bean', eyes: 2, top: 'leaf', mark: 'none',
    age: 'One spring', size: 'A small apple', lives: 'In the plant pot, pretending',
    eats: 'Rainwater', says: 'A tiny rustle',
    hobbies: ['Pretending to be a plant', 'Turning to face the sun'], best: 'Standing very still', worst: 'Being watered',
    fact: 'Bud has been mistaken for a houseplant eleven times.' },

  { id: 'mip', name: 'Mip', rarity: 'common', colour: '#D6A2C4', shape: 'blob', eyes: 1, top: 'tuft', mark: 'freckles',
    age: 'Five weeks', size: 'A marshmallow', lives: 'Under the bed',
    eats: 'Dust, allegedly', says: 'Mip.',
    hobbies: ['Squeezing into gaps', 'Saying its own name'], best: 'Fitting anywhere', worst: 'Being found',
    fact: 'Mip says only one word and that word is Mip.' },

  { id: 'dot', name: 'Dot', rarity: 'common', colour: '#E8C35C', shape: 'pebble', eyes: 2, top: 'none', mark: 'spots',
    age: 'Two months', size: 'A large coin', lives: 'In your coat pocket',
    eats: 'Half a raisin', says: 'A click, twice',
    hobbies: ['Counting things', 'Lining things up'], best: 'Counting past a hundred', worst: 'Odd numbers',
    fact: 'Dot counts everything and has never once lost its place.' },

  { id: 'puff', name: 'Puff', rarity: 'common', colour: '#B9D4E8', shape: 'cloud', eyes: 2, top: 'none', mark: 'none',
    age: 'A wet afternoon', size: 'A pillow', lives: 'Near the window on grey days',
    eats: 'Steam off a mug', says: 'A soft whoosh',
    hobbies: ['Floating', 'Making small weather'], best: 'Looking like a cloud', worst: 'Strong wind',
    fact: 'It rains very slightly wherever Puff is feeling thoughtful.' },

  { id: 'coco', name: 'Coco', rarity: 'common', colour: '#9C6B4A', shape: 'round', eyes: 2, top: 'ears', mark: 'none',
    age: 'Ten months', size: 'A cocoa mug', lives: 'Beside the kettle',
    eats: 'Anything with chocolate in it', says: 'A happy gulp',
    hobbies: ['Warm drinks', 'Sitting on hands'], best: 'Making a room feel warmer', worst: 'Cold mornings',
    fact: 'Coco smells faintly of hot chocolate and will not explain why.' },

  { id: 'nub', name: 'Nub', rarity: 'common', colour: '#C2B8A8', shape: 'square', eyes: 2, top: 'none', mark: 'none',
    age: 'Four years', size: 'An eraser', lives: 'In the pencil case',
    eats: 'Mistakes', says: 'A rubbery squeak',
    hobbies: ['Fixing mistakes', 'Getting smaller'], best: 'Undoing things', worst: 'Ink',
    fact: 'Nub is smaller than it was last term and says that is the job.' },

  { id: 'wren', name: 'Wren', rarity: 'common', colour: '#A3764F', shape: 'drop', eyes: 2, top: 'tuft', mark: 'none',
    age: 'One autumn', size: 'A small bird, roughly', lives: 'On the curtain rail',
    eats: 'Seeds and crumbs', says: 'Three quick notes',
    hobbies: ['Watching from high up', 'Singing at dawn'], best: 'Spotting things first', worst: 'Being indoors',
    fact: 'Wren wakes before everyone and has opinions about it.' },

  { id: 'tilly', name: 'Tilly', rarity: 'common', colour: '#E5A0B4', shape: 'bean', eyes: 2, top: 'bow', mark: 'heart',
    age: 'Seven months', size: 'A rolled-up sock', lives: 'In the sock drawer',
    eats: 'Crumbs from the biscuit tin', says: 'A pleased little hum',
    hobbies: ['Matching socks', 'Being tidy'], best: 'Finding the other sock', worst: 'Odd socks',
    fact: 'Tilly has never lost a sock and considers this its finest work.' },

  { id: 'bop', name: 'Bop', rarity: 'common', colour: '#68A8D8', shape: 'round', eyes: 2, top: 'antennae', mark: 'none',
    age: 'Three months', size: 'A tennis ball', lives: 'Wherever it last bounced',
    eats: 'Whatever is going', says: 'Bop. Bop. Bop.',
    hobbies: ['Bouncing', 'Landing on things'], best: 'Bouncing', worst: 'Standing still',
    fact: 'Bop has not stopped bouncing since the day it hatched.' },

  { id: 'sprig', name: 'Sprig', rarity: 'common', colour: '#7CB884', shape: 'tall', eyes: 2, top: 'sprout', mark: 'none',
    age: 'Two summers', size: 'A ruler, standing up', lives: 'Among the herbs',
    eats: 'Sunlight, mostly', says: 'A leafy whisper',
    hobbies: ['Growing taller', 'Smelling of mint'], best: 'Smelling wonderful', worst: 'Being trimmed',
    fact: 'Sprig grows a little every week and measures itself against the window.' },

  { id: 'mo', name: 'Mo', rarity: 'common', colour: '#8E8FA8', shape: 'blob', eyes: 2, top: 'none', mark: 'none',
    age: 'Unclear', size: 'A bowl of porridge', lives: 'Anywhere soft',
    eats: 'Slowly', says: 'Mmmmm',
    hobbies: ['Settling', 'Thinking it over'], best: 'Not rushing', worst: 'Being asked to decide',
    fact: 'Mo has been thinking about something since March.' },

  { id: 'gus', name: 'Gus', rarity: 'common', colour: '#D98F5C', shape: 'square', eyes: 2, top: 'horns', mark: 'none',
    age: 'Two years', size: 'A lunchbox', lives: 'By the front door',
    eats: 'Whatever is left', says: 'A short, gruff note',
    hobbies: ['Guarding the door', 'Watching the street'], best: 'Noticing arrivals', worst: 'Goodbyes',
    fact: 'Gus is at the door before the key is in the lock.' },

  { id: 'pip', name: 'Pip', rarity: 'common', colour: '#EFC04F', shape: 'pebble', eyes: 1, top: 'sprout', mark: 'none',
    age: 'A fortnight', size: 'An acorn', lives: 'In a jam jar on the shelf',
    eats: 'A drop of water a day', says: 'A very small squeak',
    hobbies: ['Waiting to grow', 'Being encouraged'], best: 'Patience', worst: 'Being rushed',
    fact: 'Pip intends to be enormous one day and is taking its time.' },

  { id: 'fen', name: 'Fen', rarity: 'common', colour: '#6E9E8E', shape: 'wisp', eyes: 2, top: 'none', mark: 'none',
    age: 'A misty week', size: 'Knee-high, at a guess', lives: 'Low to the ground, early',
    eats: 'Dew', says: 'Almost nothing',
    hobbies: ['Sitting in fog', 'Muffling sounds'], best: 'Making mornings quiet', worst: 'Bright noon',
    fact: 'Fen is only ever seen before eight in the morning.' },

  { id: 'zuzu', name: 'Zuzu', rarity: 'uncommon', colour: '#C77FD6', shape: 'cloud', eyes: 3, top: 'tuft', mark: 'stars',
    age: 'Eight months', size: 'A cushion', lives: 'Wherever someone is dozing',
    eats: 'Nothing while awake', says: 'A gentle snore',
    hobbies: ['Napping', 'Sharing dreams'], best: 'Falling asleep instantly', worst: 'Alarm clocks',
    fact: 'Zuzu dreams other people’s dreams back at them, slightly improved.' },

  { id: 'kip', name: 'Kip', rarity: 'uncommon', colour: '#5C8FBF', shape: 'bean', eyes: 2, top: 'fringe', mark: 'stripes',
    age: 'One year', size: 'A shoe', lives: 'Under the desk',
    eats: 'Lost pencils', says: 'A muffled hello',
    hobbies: ['Keeping what falls', 'Sorting by colour'], best: 'Knowing where it went', worst: 'Giving things back',
    fact: 'Everything you have ever dropped is under the desk with Kip.' },

  { id: 'marl', name: 'Marl', rarity: 'uncommon', colour: '#A8896B', shape: 'square', eyes: 2, top: 'none', mark: 'swirl',
    age: 'Nine years', size: 'A brick', lives: 'Holding a door open',
    eats: 'Twice a year', says: 'A low rumble',
    hobbies: ['Being useful', 'Holding things up'], best: 'Not budging', worst: 'Being moved',
    fact: 'Marl has held the same door open since the summer before last.' },

  { id: 'vex', name: 'Vex', rarity: 'uncommon', colour: '#D4606A', shape: 'spike', eyes: 2, top: 'horns', mark: 'none',
    age: 'Six months', size: 'A closed fist', lives: 'Somewhere it was told not to',
    eats: 'The last biscuit', says: 'A sharp tut',
    hobbies: ['Disagreeing', 'Being right later'], best: 'Spotting the flaw', worst: 'Being told what to do',
    fact: 'Vex has been proved right twice and will not let anyone forget it.' },

  { id: 'ora', name: 'Ora', rarity: 'uncommon', colour: '#EFA23C', shape: 'drop', eyes: 2, top: 'halo', mark: 'glow',
    age: 'One long summer', size: 'A grapefruit', lives: 'In the warmest patch of floor',
    eats: 'Afternoon light', says: 'A warm hum',
    hobbies: ['Following the sun', 'Warming cold feet'], best: 'Finding the sunny spot', worst: 'Curtains',
    fact: 'Ora is always in the sunniest square of the room, whatever the hour.' },

  { id: 'thistle', name: 'Thistle', rarity: 'uncommon', colour: '#8A76C4', shape: 'spike', eyes: 2, top: 'tuft', mark: 'none',
    age: 'Two summers', size: 'A teapot', lives: 'At the edge of the garden',
    eats: 'Whatever the wind brings', says: 'A prickly rustle',
    hobbies: ['Standing its ground', 'Being admired from a distance'], best: 'Looking fierce', worst: 'Hugs',
    fact: 'Thistle is far softer than it looks and would rather you did not know.' },

  { id: 'bram', name: 'Bram', rarity: 'uncommon', colour: '#6B7F4A', shape: 'round', eyes: 3, top: 'leaf', mark: 'spots',
    age: 'Four autumns', size: 'A football', lives: 'In the hedge',
    eats: 'Berries, all of them', says: 'A contented munch',
    hobbies: ['Finding berries', 'Getting stuck in hedges'], best: 'Reaching the high ones', worst: 'Thorns',
    fact: 'Bram knows where every berry on the street is and when it will be ready.' },

  { id: 'juno', name: 'Juno', rarity: 'uncommon', colour: '#3F8FA8', shape: 'tall', eyes: 2, top: 'crown', mark: 'none',
    age: 'Three years', size: 'A tall glass', lives: 'At the head of the table',
    eats: 'Politely, and first', says: 'A clear, carrying voice',
    hobbies: ['Organising everyone', 'Making plans'], best: 'Getting things started', worst: 'Being interrupted',
    fact: 'Juno has a plan for the week and everybody is in it.' },

  { id: 'ash', name: 'Ash', rarity: 'uncommon', colour: '#7A7F86', shape: 'wisp', eyes: 2, top: 'none', mark: 'freckles',
    age: 'After the fire', size: 'A drifting handful', lives: 'Above the fireplace',
    eats: 'Warmth', says: 'A dry whisper',
    hobbies: ['Drifting upward', 'Settling on things'], best: 'Going unnoticed', worst: 'Being dusted',
    fact: 'Ash settles on everything and apologises for none of it.' },

  { id: 'wick', name: 'Wick', rarity: 'uncommon', colour: '#E0803C', shape: 'tall', eyes: 1, top: 'none', mark: 'glow',
    age: 'Burning a while', size: 'A candle', lives: 'On the shelf, alight',
    eats: 'Slowly, itself', says: 'A quiet flicker',
    hobbies: ['Burning steadily', 'Keeping watch at night'], best: 'Lasting longer than expected', worst: 'Draughts',
    fact: 'Wick has been alight since the start of term and shows no sign of stopping.' },

  { id: 'noor', name: 'Noor', rarity: 'uncommon', colour: '#D9C05A', shape: 'round', eyes: 2, top: 'halo', mark: 'stars',
    age: 'One bright year', size: 'A lantern', lives: 'Wherever it is darkest',
    eats: 'Nothing it will admit to', says: 'A soft chime',
    hobbies: ['Lighting corners', 'Leading the way'], best: 'Being found in the dark', worst: 'Full daylight',
    fact: 'Noor goes to the darkest corner of a room and simply stays there.' },

  { id: 'ember', name: 'Ember', rarity: 'rare', colour: '#E05A3C', shape: 'drop', eyes: 2, top: 'horns', mark: 'glow',
    age: 'Since the last fire went out', size: 'A closed hand', lives: 'In the last warm ash',
    eats: 'A breath of air', says: 'A low crackle',
    hobbies: ['Staying warm', 'Waiting to catch'], best: 'Outlasting the fire', worst: 'Rain',
    fact: 'Ember is the part of the fire that refused to go out.' },

  { id: 'frost', name: 'Frost', rarity: 'rare', colour: '#9FD0E0', shape: 'spike', eyes: 2, top: 'crown', mark: 'swirl',
    age: 'One cold night', size: 'A windowpane’s worth', lives: 'On the inside of the glass',
    eats: 'Nothing. It only spreads.', says: 'A thin crackle',
    hobbies: ['Drawing on windows', 'Arriving overnight'], best: 'Making patterns nobody taught it', worst: 'Ten o’clock sun',
    fact: 'Frost draws a different window every night and never repeats one.' },

  { id: 'echo', name: 'Echo', rarity: 'rare', colour: '#8C9BB5', shape: 'wisp', eyes: 3, top: 'none', mark: 'swirl',
    age: 'As old as the last thing said', size: 'The size of the room', lives: 'In empty halls',
    eats: 'Silence', says: 'Whatever you said, a moment later',
    hobbies: ['Repeating things', 'Waiting in stairwells'], best: 'Remembering exactly', worst: 'Carpet',
    fact: 'Echo has never had an idea of its own and is perfectly happy about it.' },

  { id: 'sable', name: 'Sable', rarity: 'rare', colour: '#4C4A5C', shape: 'bean', eyes: 2, top: 'ears', mark: 'moon',
    age: 'Nine lives in', size: 'A cat, curled', lives: 'On the warmest chair, always',
    eats: 'Only what it chose', says: 'Nothing, pointedly',
    hobbies: ['Sitting where you were sitting', 'Ignoring you'], best: 'Choosing the best seat', worst: 'Being called',
    fact: 'Sable was in your chair before you stood up. Nobody saw it move.' },

  { id: 'cirrus', name: 'Cirrus', rarity: 'rare', colour: '#CFE0EE', shape: 'cloud', eyes: 2, top: 'none', mark: 'stripes',
    age: 'High and thin', size: 'Wider than it looks', lives: 'The very top of the sky',
    eats: 'Cold air', says: 'A far-off whistle',
    hobbies: ['Being first to see weather', 'Streaking the sky'], best: 'Knowing what tomorrow brings', worst: 'Coming down',
    fact: 'When Cirrus turns up, it rains within the day. It has never been wrong.' },

  { id: 'onyx', name: 'Onyx', rarity: 'rare', colour: '#3A3F52', shape: 'square', eyes: 2, top: 'none', mark: 'stars',
    age: 'Older than the building', size: 'A paving stone', lives: 'Under everything',
    eats: 'Never, as far as anyone knows', says: 'A deep, slow note',
    hobbies: ['Holding the floor up', 'Remembering'], best: 'Bearing weight', worst: 'Being asked to move',
    fact: 'Onyx remembers what was here before the school was, and will not say.' },

  { id: 'vela', name: 'Vela', rarity: 'rare', colour: '#5F7FD4', shape: 'drop', eyes: 2, top: 'fin', mark: 'bubbles',
    age: 'One long voyage', size: 'A jug', lives: 'In the deep end',
    eats: 'Whatever drifts past', says: 'A low bubble',
    hobbies: ['Swimming in circles', 'Going deeper'], best: 'Holding its breath', worst: 'Dry land',
    fact: 'Vela has never been to the bottom and thinks about it constantly.' },

  { id: 'aurora', name: 'Aurora', rarity: 'epic', colour: '#3FBFA0', shape: 'wisp', eyes: 2, top: 'crown', mark: 'glow',
    age: 'Nine hundred winters', size: 'The whole northern sky', lives: 'Above the cold places',
    eats: 'Starlight', says: 'A sound you feel rather than hear',
    hobbies: ['Rippling', 'Being photographed badly'], best: 'Stopping people in their tracks', worst: 'Cloud',
    fact: 'Everyone who has seen Aurora describes a different colour, and all of them are right.' },

  { id: 'solis', name: 'Solis', rarity: 'epic', colour: '#F0A32E', shape: 'round', eyes: 1, top: 'halo', mark: 'glow',
    age: 'Every morning', size: 'Too bright to measure', lives: 'Just over the horizon',
    eats: 'Nothing, and gives everything', says: 'The first bird of the day',
    hobbies: ['Rising', 'Waking the whole street'], best: 'Turning up on time, always', worst: 'December',
    fact: 'Solis has never once been late, in the whole history of mornings.' },

  { id: 'tempest', name: 'Tempest', rarity: 'epic', colour: '#4A5A7A', shape: 'spike', eyes: 3, top: 'horns', mark: 'stripes',
    age: 'Gathering since Tuesday', size: 'Fills the window', lives: 'Out at sea, mostly',
    eats: 'Warm air', says: 'Thunder, eventually',
    hobbies: ['Building slowly', 'Arriving all at once'], best: 'Making everyone look up', worst: 'Calm weather',
    fact: 'Tempest takes three days to arrive and eleven minutes to pass.' },

  { id: 'nimbus', name: 'Nimbus', rarity: 'epic', colour: '#7E8FA8', shape: 'cloud', eyes: 2, top: 'crown', mark: 'swirl',
    age: 'A long grey season', size: 'Ceiling to floor', lives: 'Directly overhead',
    eats: 'The sea, a little at a time', says: 'A patient, steady drumming',
    hobbies: ['Raining', 'Turning up on sports day'], best: 'Timing', worst: 'Being wanted',
    fact: 'Nimbus has never once rained on a day nobody minded.' },

  { id: 'zenith', name: 'Zenith', rarity: 'legendary', colour: '#E8C24A', shape: 'tall', eyes: 3, top: 'crown', mark: 'stars',
    age: 'As old as counting', size: 'As tall as the room lets it be', lives: 'At the very top of things',
    eats: 'Nothing anyone may offer', says: 'One word, once, and it is always the right one',
    hobbies: ['Being highest', 'Keeping perfect time'], best: 'Being exactly where it should be', worst: 'Second place',
    fact: 'Zenith turns up only when someone has done everything they set out to do.' },

  { id: 'eclipse', name: 'Eclipse', rarity: 'legendary', colour: '#2E2A44', shape: 'round', eyes: 1, top: 'halo', mark: 'glow',
    age: 'Counted in centuries', size: 'Exactly the size of the sun, from here', lives: 'Between the light and you',
    eats: 'Daylight, briefly', says: 'Absolute silence, for four minutes',
    hobbies: ['Lining things up', 'Making birds go quiet'], best: 'Stopping everything at once', worst: 'Being predicted',
    fact: 'When Eclipse arrives the birds stop singing, and nobody has ever taught them to.' },
];

const MONSTER_COUNT = MONSTERS.length;
const monsterById = (id) => MONSTERS.find(m => m.id === id) || null;

/** Everyone who has turned up, oldest first. */
function collectedMonsters() {
  const met = state.progress.metAt || {};
  return MONSTERS.filter(m => met[m.id]).sort((a, b) => met[a.id] - met[b.id]);
}

/**
 * Who comes out of the egg. A rarity is rolled first, then someone of that
 * rarity you have not met — so the odds are the odds, but you are never given
 * a creature you already have while any stranger is left.
 */
function rollMonster() {
  const met = state.progress.metAt || {};
  const strangers = MONSTERS.filter(m => !met[m.id]);
  if (!strangers.length) return null;

  const total = RARITY.reduce((sum, r) => sum + r.weight, 0);
  let n = Math.random() * total;
  for (const r of RARITY) {
    n -= r.weight;
    if (n > 0) continue;
    const tier = strangers.filter(m => m.rarity === r.key);
    if (tier.length) return tier[Math.floor(Math.random() * tier.length)];
    break;                                    // that tier is finished
  }
  return strangers[Math.floor(Math.random() * strangers.length)];
}

/** The body outline. Everything else is placed relative to it. */
function bodyPath(shape) {
  switch (shape) {
    case 'tall':
      return '<ellipse cx="50" cy="55" rx="25" ry="34" />';
    case 'square':
      return '<rect x="22" y="26" width="56" height="58" rx="22" />';
    case 'drop':
      return '<path d="M50 16c14 18 24 27 24 40a24 24 0 0 1-48 0c0-13 10-22 24-40z" />';
    case 'cloud':
      return '<path d="M28 52a13 13 0 0 1 6-12 15 15 0 0 1 15-11 15 15 0 0 1 15 11 13 13 0 0 1 6 12v14a18 18 0 0 1-18 18h-6a18 18 0 0 1-18-18z" />';
    case 'wisp':
      return '<path d="M50 20a28 28 0 0 1 28 28v34c-5 0-6-6-11-6s-6 6-11 6-6-6-11-6-6 6-11 6-6-6-11-6V48A28 28 0 0 1 50 20z" />';
    case 'bean':
      return '<path d="M30 36c9-15 31-15 40 0 7 11 5 24-2 33-7 10-29 10-36 0-7-9-9-22-2-33z" />';
    case 'blob':
      return '<path d="M50 24c15 0 26 9 28 22 2 13-5 26-15 32-9 5-19 5-28 0-10-6-17-19-15-32 2-13 15-22 30-22z" />';
    case 'pebble':
      return '<ellipse cx="50" cy="60" rx="31" ry="23" />';
    case 'spike':
      return '<path d="M50 20l9 11 13-4-2 14 13 8-10 10 5 14-15-2-6 12-10-11-14 3 2-14-12-9 12-9-2-14 14 4z" />';
    default:
      return '<ellipse cx="50" cy="56" rx="29" ry="28" />';
  }
}

/** Eyes, always big and always with a highlight — that is most of the cuteness. */
function eyesOf(n) {
  const eye = (cx, cy, r) => `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFDF8" />
    <circle cx="${cx}" cy="${cy + r * 0.12}" r="${r * 0.52}" fill="#2A2622" />
    <circle cx="${cx - r * 0.28}" cy="${cy - r * 0.3}" r="${r * 0.2}" fill="#FFFDF8" />`;
  if (n === 1) return eye(50, 50, 13);
  if (n === 3) return eye(36, 49, 7) + eye(50, 43, 7.5) + eye(64, 49, 7);
  return eye(39, 51, 8.5) + eye(61, 51, 8.5);
}

function topOf(top, colour) {
  switch (top) {
    case 'antennae':
      return `<g stroke="${colour}" stroke-width="3" stroke-linecap="round" fill="none">
                <path d="M40 30c-3-7-5-10-7-13" /><path d="M60 30c3-7 5-10 7-13" />
              </g>
              <circle cx="31.5" cy="15" r="4" fill="${colour}" />
              <circle cx="68.5" cy="15" r="4" fill="${colour}" />`;
    case 'ears':
      return `<ellipse cx="24" cy="34" rx="9" ry="13" fill="${colour}" transform="rotate(-22 24 34)" />
              <ellipse cx="76" cy="34" rx="9" ry="13" fill="${colour}" transform="rotate(22 76 34)" />`;
    case 'horns':
      return `<path d="M33 30c-2-8-1-13 2-16 2 4 5 9 6 14z" fill="${colour}" />
              <path d="M67 30c2-8 1-13-2-16-2 4-5 9-6 14z" fill="${colour}" />`;
    case 'sprout':
      return `<path d="M50 30V16" stroke="#6BA155" stroke-width="3" stroke-linecap="round" fill="none" />
              <path d="M50 20c6-6 12-5 14-4-1 6-8 9-14 4z" fill="#8CC46A" />`;
    case 'fringe':
      return `<path d="M24 40c4-5 8-2 10 1 2-5 7-6 10-1 2-5 8-6 11-1 2-4 8-4 11 1 -3-12-14-19-21-19S27 28 24 40z"
                    fill="${colour}" opacity=".82" />`;
    case 'tuft':
      return `<g stroke="${colour}" stroke-width="4" stroke-linecap="round" fill="none">
                <path d="M44 28l-3-12" /><path d="M50 26v-14" /><path d="M56 28l3-12" />
              </g>`;
    case 'leaf':
      return `<path d="M50 30V18" stroke="#6BA155" stroke-width="3" stroke-linecap="round" fill="none" />
              <path d="M50 22c7-7 14-6 16-5-1 7-9 11-16 5z" fill="#8CC46A" />
              <path d="M50 24c-7-6-13-5-15-4 1 6 8 10 15 4z" fill="#7CB884" />`;
    case 'bow':
      return `<path d="M50 24l-14-8v16z" fill="${colour}" />
              <path d="M50 24l14-8v16z" fill="${colour}" />
              <circle cx="50" cy="24" r="4.5" fill="${colour}" />`;
    case 'crown':
      return `<path d="M32 26l3-16 8 9 7-12 7 12 8-9 3 16z" fill="#E3B655" />
              <circle cx="50" cy="14" r="3" fill="#E3B655" />`;
    case 'halo':
      return `<ellipse cx="50" cy="17" rx="16" ry="5" fill="none" stroke="#E8C24A" stroke-width="3.4" />`;
    case 'fin':
      return `<path d="M50 12c8 6 12 12 13 18h-26c1-6 5-12 13-18z" fill="${colour}" />`;
    default:
      return '';
  }
}

function markOf(mark, colour) {
  switch (mark) {
    case 'spots':
      return `<g fill="#2A2622" opacity=".14">
                <circle cx="35" cy="68" r="4" /><circle cx="58" cy="72" r="3" /><circle cx="67" cy="60" r="2.6" />
              </g>`;
    case 'bubbles':
      return `<g fill="#FFFDF8" opacity=".5">
                <circle cx="34" cy="66" r="3.4" /><circle cx="45" cy="73" r="2.4" /><circle cx="63" cy="68" r="4" />
              </g>`;
    case 'stars':
      return `<g fill="#FFFDF8" opacity=".72">
                <path d="M34 66l1.4 3.2 3.2 1.4-3.2 1.4L34 75l-1.4-3.2-3.2-1.4 3.2-1.4z" />
                <path d="M64 62l1.1 2.4 2.4 1.1-2.4 1.1L64 69l-1.1-2.4-2.4-1.1 2.4-1.1z" />
                <path d="M55 76l.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9z" />
              </g>`;
    case 'stripes':
      return `<g fill="#2A2622" opacity=".12">
                <rect x="20" y="48" width="60" height="6" rx="3" />
                <rect x="20" y="62" width="60" height="6" rx="3" />
                <rect x="20" y="76" width="60" height="6" rx="3" />
              </g>`;
    case 'swirl':
      return `<path d="M56 66a6 6 0 1 1-6-6 10 10 0 1 1 10 10" fill="none"
                    stroke="#FFFDF8" stroke-width="3" stroke-linecap="round" opacity=".55" />`;
    case 'heart':
      return `<path d="M50 76c-12-8-16-14-16-19a7 7 0 0 1 13-4 7 7 0 0 1 13 4c0 5-4 11-10 19z"
                    fill="#FFFDF8" opacity=".45" />`;
    case 'moon':
      return `<path d="M62 60a13 13 0 1 1-13-13 10 10 0 0 0 13 13z" fill="#FFFDF8" opacity=".5" />`;
    case 'freckles':
      return `<g fill="#2A2622" opacity=".16">
                <circle cx="33" cy="63" r="2.2" /><circle cx="40" cy="69" r="1.8" />
                <circle cx="60" cy="69" r="1.8" /><circle cx="67" cy="63" r="2.2" />
              </g>`;
    case 'glow':
      return `<circle cx="50" cy="56" r="34" fill="${colour}" opacity=".16" />`;
    default:
      return '';
  }
}

/**
 * One creature, drawn. `locked` gives back only its silhouette, so what is
 * still to come stays a surprise.
 */
function monsterSvg(m, { locked = false } = {}) {
  if (locked) {
    return `<svg class="mon" viewBox="0 0 100 100" aria-hidden="true">
              <g fill="currentColor" opacity=".2">${bodyPath(m.shape)}</g>
              <text x="50" y="63" text-anchor="middle" class="mon-q">?</text>
            </svg>`;
  }
  return `<svg class="mon" viewBox="0 0 100 100" aria-hidden="true">
    ${markOf(m.mark === 'glow' ? 'glow' : 'none', m.colour)}
    <g class="mon-feet" fill="${m.colour}">
      <ellipse cx="38" cy="86" rx="8" ry="5" /><ellipse cx="62" cy="86" rx="8" ry="5" />
    </g>
    ${topOf(m.top, m.colour)}
    <g class="mon-body" fill="${m.colour}">${bodyPath(m.shape)}</g>
    ${markOf(m.mark === 'glow' ? 'none' : m.mark, m.colour)}
    <g class="mon-blush" fill="#E86A7C" opacity=".26">
      <ellipse cx="31" cy="62" rx="6" ry="3.6" /><ellipse cx="69" cy="62" rx="6" ry="3.6" />
    </g>
    ${eyesOf(m.eyes)}
    <path class="mon-smile" d="M44 65q6 6 12 0" fill="none" stroke="#2A2622"
          stroke-width="2.6" stroke-linecap="round" />
  </svg>`;
}

/* ── Eggs ──────────────────────────────────────────────────
   Everyone arrives in one. Same shape every time, but the shell and its
   markings belong to the creature inside, so twelve hatchings never look
   like the same hatching twice. */

const EGG_PATH = 'M50 12c15 0 29 21 29 42a29 32 0 0 1-58 0c0-21 14-42 29-42z';

/* The line the shell breaks along. Both halves are the same drawing clipped
   either side of it, so the broken edges always match. */
const EGG_CRACK = 'M17 55 28 47 36 57 45 48 54 58 63 48 72 57 83 49';
const EGG_ABOVE = 'M2 0H98V49L83 49 72 57 63 48 54 58 45 48 36 57 28 47 17 55 2 49Z';
const EGG_BELOW = 'M2 49 17 55 28 47 36 57 45 48 54 58 63 48 72 57 83 49 98 49V100H2Z';

/** The markings on a shell. Drawn once, then clipped to the egg's outline. */
function eggPattern(kind, colour, shell) {
  const g = (body, opacity = '.55') => `<g fill="${colour}" opacity="${opacity}">${body}</g>`;
  const at = (x, y, s, d) => `<path transform="translate(${x} ${y}) scale(${s})" d="${d}" />`;
  const HEART = 'M0 6C-8 -1 -4 -8 0 -3 4 -8 8 -1 0 6Z';
  const STAR  = 'M0 -7 2 -2 7 0 2 2 0 7 -2 2 -7 0 -2 -2Z';
  const LEAF  = 'M0 0c5-6 11-6 13-5-1 6-8 10-13 5z';
  const TRI   = 'M0 -6 6 5H-6Z';

  switch (kind) {
    case 'dots':
      return g(`<circle cx="36" cy="32" r="4"/><circle cx="58" cy="26" r="3"/>
                <circle cx="30" cy="52" r="3.4"/><circle cx="52" cy="46" r="4.6"/>
                <circle cx="70" cy="44" r="3.2"/><circle cx="40" cy="68" r="4"/>
                <circle cx="62" cy="66" r="3.4"/><circle cx="50" cy="80" r="3"/>`);
    case 'hearts':
      return g(at(38, 30, 0.9, HEART) + at(60, 40, 0.75, HEART) + at(32, 54, 0.7, HEART) +
               at(53, 62, 0.95, HEART) + at(70, 62, 0.6, HEART) + at(42, 78, 0.7, HEART));
    case 'triangles':
      return g(at(36, 30, 0.9, TRI) + at(58, 34, 0.7, TRI) + at(30, 52, 0.8, TRI) +
               at(52, 56, 1, TRI) + at(72, 56, 0.7, TRI) + at(42, 76, 0.8, TRI));
    case 'stripes':
      return g(`<rect x="0" y="28" width="100" height="6"/><rect x="0" y="44" width="100" height="8"/>
                <rect x="0" y="62" width="100" height="6"/><rect x="0" y="76" width="100" height="8"/>`, '.42');
    case 'stars':
      return g(at(38, 32, 1, STAR) + at(60, 40, 0.75, STAR) + at(30, 56, 0.7, STAR) +
               at(54, 60, 1.1, STAR) + at(72, 62, 0.65, STAR) + at(44, 78, 0.8, STAR), '.6');
    case 'leaves':
      return g(`<g transform="translate(32 32) rotate(-20)">${at(0, 0, 0.9, LEAF)}</g>
                <g transform="translate(58 40) rotate(18)">${at(0, 0, 0.75, LEAF)}</g>
                <g transform="translate(30 58) rotate(-8)">${at(0, 0, 0.8, LEAF)}</g>
                <g transform="translate(56 68) rotate(24)">${at(0, 0, 0.9, LEAF)}</g>
                <g transform="translate(38 78) rotate(-30)">${at(0, 0, 0.7, LEAF)}</g>`);
    case 'waves':
      return `<g fill="none" stroke="${colour}" stroke-width="3" stroke-linecap="round" opacity=".5">
                <path d="M8 34q9-7 18 0t18 0 18 0 18 0"/><path d="M8 50q9-7 18 0t18 0 18 0 18 0"/>
                <path d="M8 66q9-7 18 0t18 0 18 0 18 0"/><path d="M8 82q9-7 18 0t18 0 18 0 18 0"/>
              </g>`;
    case 'zigzag':
      return `<g fill="none" stroke="${colour}" stroke-width="3.4" stroke-linejoin="round" opacity=".5">
                <path d="M12 36 24 28 36 36 48 28 60 36 72 28 84 36"/>
                <path d="M12 56 24 48 36 56 48 48 60 56 72 48 84 56"/>
                <path d="M12 76 24 68 36 76 48 68 60 76 72 68 84 76"/>
              </g>`;
    case 'speckles':
      return g(`<circle cx="34" cy="28" r="2"/><circle cx="47" cy="34" r="1.4"/><circle cx="60" cy="27" r="2.2"/>
                <circle cx="28" cy="44" r="1.6"/><circle cx="41" cy="49" r="2.4"/><circle cx="56" cy="45" r="1.5"/>
                <circle cx="69" cy="50" r="2.1"/><circle cx="33" cy="62" r="2.3"/><circle cx="48" cy="66" r="1.5"/>
                <circle cx="63" cy="63" r="2"/><circle cx="40" cy="79" r="1.8"/><circle cx="57" cy="78" r="2.2"/>`, '.6');
    case 'bubbles':
      return `<g fill="none" stroke="${colour}" stroke-width="2.4" opacity=".55">
                <circle cx="36" cy="32" r="6"/><circle cx="58" cy="40" r="4"/><circle cx="30" cy="54" r="4.6"/>
                <circle cx="52" cy="58" r="7.5"/><circle cx="70" cy="60" r="3.4"/><circle cx="42" cy="78" r="5"/>
              </g>`;
    case 'checks':
      return g(`<rect x="22" y="26" width="11" height="11"/><rect x="44" y="26" width="11" height="11"/>
                <rect x="66" y="26" width="11" height="11"/><rect x="33" y="48" width="11" height="11"/>
                <rect x="55" y="48" width="11" height="11"/><rect x="22" y="70" width="11" height="11"/>
                <rect x="44" y="70" width="11" height="11"/><rect x="66" y="70" width="11" height="11"/>`, '.4');
    case 'swirls':
      return `<g fill="none" stroke="${colour}" stroke-width="3" stroke-linecap="round" opacity=".5">
                <path d="M40 34a8 8 0 1 1-8 8 13 13 0 1 1 13 13" />
                <path d="M62 68a7 7 0 1 1-7 7" />
              </g>`;
    case 'crowned':
      return `<g opacity=".72">
                <rect x="0" y="34" width="100" height="5" rx="2.5" fill="#D9A94A" />
                <rect x="0" y="70" width="100" height="5" rx="2.5" fill="#D9A94A" />
                <path d="M50 44l11 12-11 12-11-12z" fill="${colour}" />
                <path d="M50 49l6 7-6 7-6-7z" fill="${shell}" />
              </g>`;
    case 'moons':
      // Each crescent is the shell colour biting a circle out of the mark.
      return `<g opacity=".62">
                <circle cx="36" cy="32" r="7" fill="${colour}"/><circle cx="40" cy="29" r="6" fill="${shell}"/>
                <circle cx="60" cy="48" r="8" fill="${colour}"/><circle cx="64" cy="44" r="7" fill="${shell}"/>
                <circle cx="34" cy="64" r="6" fill="${colour}"/><circle cx="37" cy="61" r="5" fill="${shell}"/>
                <circle cx="56" cy="78" r="5.5" fill="${colour}"/><circle cx="59" cy="76" r="4.6" fill="${shell}"/>
              </g>`;
    default:
      return '';
  }
}

/** A pale version of a colour, for the shell a creature hatches from. */
function paleOf(hex, amount = 0.76) {
  const n = parseInt(String(hex).slice(1), 16);
  const to = (c) => Math.round(c + (255 - c) * amount).toString(16).padStart(2, '0');
  return '#' + to((n >> 16) & 255) + to((n >> 8) & 255) + to(n & 255);
}

/* The shell is patterned by rarity, so you can tell what kind of luck you have
   had before it opens, and coloured from the creature inside, so no two eggs
   look quite alike. */
const RARITY_EGG = {
  common: 'dots', uncommon: 'stripes', rare: 'stars', epic: 'swirls', legendary: 'crowned',
};

/* Clip paths need ids, and two eggs can be on screen at once. */
let eggSeq = 0;

/**
 * One egg. `split` gives back the same drawing cut into a top and a bottom
 * half along the crack, which is what the hatching animation pulls apart.
 */
function eggSvg(m, { split = false } = {}) {
  const n = ++eggSeq;
  const face = `
    <path d="${EGG_PATH}" fill="${paleOf(m.colour)}" />
    <g clip-path="url(#eggc${n})">${eggPattern(RARITY_EGG[m.rarity] || 'dots', m.colour, paleOf(m.colour))}</g>
    <ellipse cx="37" cy="33" rx="8" ry="12" fill="#FFFFFF" opacity=".4" transform="rotate(-20 37 33)" />
    <path d="${EGG_PATH}" fill="none" stroke="${m.colour}" stroke-width="2" opacity=".4" />`;

  const defs = `<defs><clipPath id="eggc${n}"><path d="${EGG_PATH}" /></clipPath>${split ? `
      <clipPath id="eggt${n}"><path d="${EGG_ABOVE}" /></clipPath>
      <clipPath id="eggb${n}"><path d="${EGG_BELOW}" /></clipPath>` : ''}</defs>`;

  if (!split) {
    return `<svg class="egg" viewBox="0 0 100 100" aria-hidden="true">${defs}${face}</svg>`;
  }

  return `<svg class="egg" viewBox="0 0 100 100" aria-hidden="true">${defs}
    <g class="egg-top" clip-path="url(#eggt${n})">${face}</g>
    <g class="egg-bot" clip-path="url(#eggb${n})">${face}</g>
    <g clip-path="url(#eggc${n})">
      <path class="egg-crack" d="${EGG_CRACK}" fill="none" stroke="#3A332C" stroke-width="2.2"
            stroke-linecap="round" stroke-linejoin="round" opacity=".5" />
    </g>
  </svg>`;
}


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

/** The card reads as a sentence: "for thursday", "for next monday". */
function duePhrase(key) {
  const diff = daysFromToday(key);
  const weekday = () => keyToDate(key).toLocaleDateString([], { weekday: 'long' }).toLowerCase();
  if (diff < -1) return 'overdue';
  if (diff === -1) return 'was for yesterday';
  if (diff === 0) return 'for today';
  if (diff === 1) return 'for tomorrow';
  if (diff <= 6) return `for ${weekday()}`;
  if (diff <= 13) return `for next ${weekday()}`;
  return `for ${keyToDate(key).toLocaleDateString([], { day: 'numeric', month: 'long' })}`;
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
  homework: [],
  notes: [],
  extraSubjects: [],     // anything older data filed under a subject not on the timetable

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
/** The lesson an older, hand-picked subject name was clearly meant to be. */
function lessonForOldName(name) {
  const n = String(name || '').toLowerCase();
  if (!n) return null;
  for (const lesson of LESSONS) {
    const aliases = OLD_SUBJECT_ALIASES[lesson] || [lesson];
    if (aliases.some(a => n.includes(a.toLowerCase()) || a.toLowerCase().includes(n))) return lesson;
  }
  return null;
}

/**
 * Subjects used to be picked by hand and stored with made-up ids. They come
 * from the timetable now, so homework saved against an old id is moved onto
 * the lesson it was meant for. Anything that matches nothing on the timetable
 * keeps its subject rather than losing it — the work is yours either way.
 */
function adoptOldSubjects(next, saved) {
  const old = (saved && Array.isArray(saved.subjects)) ? saved.subjects : [];
  if (!old.length) return;

  const moved = new Map();
  const orphans = [];
  for (const s of old) {
    const lesson = lessonForOldName(s.name);
    if (lesson) moved.set(s.id, lesson);
    else orphans.push(s);
  }

  for (const hw of next.homework) {
    if (moved.has(hw.subjectId)) hw.subjectId = moved.get(hw.subjectId);
  }
  if (moved.has(next.lastSubjectId)) next.lastSubjectId = moved.get(next.lastSubjectId);

  const inUse = new Set(next.homework.map(h => h.subjectId));
  next.extraSubjects = orphans.filter(s => inUse.has(s.id));
}

function hydrate(saved) {
  const base = blank();
  const next = Object.assign(base, saved);
  next.settings = Object.assign(blank().settings, (saved && saved.settings) || {});
  next.notes = Array.isArray(next.notes) ? next.notes : [];
  next.extraSubjects = Array.isArray(next.extraSubjects) ? next.extraSubjects : [];
  adoptOldSubjects(next, saved);
  delete next.subjects;
  delete next.onboarded;
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
  $('#main').hidden = false;
  render();
  scheduleReminder();
}

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

const levelFor = (xp) => Math.floor(xp / XP_PER_LEVEL) + 1;

function monogram(name) {
  const words = name.trim().split(/\s+/);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return name.trim().slice(0, 1).toUpperCase();
}


/* ── Shared markup ─────────────────────────────────────────── */

function tile(sub, extraClass = '') {
  const body = sub.icon
    ? `<svg class="ico" aria-hidden="true"><use href="#${sub.icon}" /></svg>`
    : esc(sub.glyph || monogram(sub.name));
  return `<span class="subject-tile ${extraClass}" style="--sc:${sub.color}">${body}</span>`;
}

/** When it is for, short enough for a chip. */
function dueChip(key) {
  const diff = daysFromToday(key);
  const weekday = () => keyToDate(key).toLocaleDateString([], { weekday: 'long' });
  if (diff < -1) return 'Overdue';
  if (diff === -1) return 'Was yesterday';
  if (diff === 0) return 'For today';
  if (diff === 1) return 'For tomorrow';
  if (diff <= 6) return `For ${weekday()}`;
  if (diff <= 13) return `Next ${weekday()}`;
  return `For ${keyToDate(key).toLocaleDateString([], { day: 'numeric', month: 'short' })}`;
}

function hwRow(hw) {
  const sub = subjectById(hw.subjectId);
  const color = sub ? sub.color : 'var(--ink-2)';
  const diff = hw.dueDate ? daysFromToday(hw.dueDate) : null;
  const soon = diff !== null && diff <= 1;
  const late = diff !== null && diff < 0;

  return `
    <div class="hw-slot" data-id="${hw.id}">
      <div class="hw ${soon ? 'is-soon' : ''} ${late ? 'is-late' : ''}" style="--sc:${color}">
        <button class="hw-main" data-act="edit">
          ${sub ? tile(sub, 'hw-tile') : '<span class="subject-tile hw-tile"></span>'}
          <span class="hw-words">
            <span class="hw-top">
              <span class="hw-subject">${esc(sub ? sub.name : 'Subject')}</span>
              <span class="hw-when">
                <svg class="ico" aria-hidden="true"><use href="#i-calendar" /></svg>
                ${hw.dueDate ? esc(dueChip(hw.dueDate)) : 'No date yet'}
              </span>
            </span>
            <span class="hw-title">${esc(hw.title)}</span>
            ${hw.note ? `<span class="hw-note">${esc(hw.note)}</span>` : ''}
          </span>
        </button>
        <button class="check" data-act="complete" aria-label="Mark ${esc(hw.title)} as done">
          <span class="check-circle">
            <svg class="check-mark" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.6 9.6 17 19 7"/></svg>
          </span>
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

/* Nothing left to do. The screen clears down to one line and one button — the
   + leaves the header and comes to sit beside the sentence, so there is only
   ever one of it — over a desk that has been tidied for the day. */
/* Show the picture only once it has decoded. Half a photo drawn top-down looks
   like something went wrong; nothing, and then all of it, does not. */
function revealArt(box) {
  const art = box.querySelector('.empty-art');
  if (!art) return;
  if (art.complete && art.naturalWidth) art.classList.add('is-ready');
  else art.addEventListener('load', () => art.classList.add('is-ready'), { once: true });
}

/* ── The flight ────────────────────────────────────────────
   Nine pictures of a paper plane turned up, and they are nine moments of one
   flight: in small from the left, growing as it crosses, a dip, then a climb
   into place at the top right. So they are used as its keyframes, measured off
   the pictures themselves — the browser draws every frame in between.

   The plane is the artwork, cut off the wall it was drawn on. The trail is
   drawn rather than photographed, so it stays crisp at any size and can take
   the night colours. Both live in the same 100-by-58 scene, so they scale
   together and never need re-aligning per screen.

   The message rides on the wing, which is where the pictures put it, so the
   screen does not say it twice. Screen readers get it from the heading. */
const PLANE_TRAIL = "M -8 37.5 C 0 36.8 5 36.2 13 35.2 C 17 34.7 18.5 31.5 21 28 "
  + "C 23 25.2 26.6 24.2 26.9 27.4 C 27.2 30.6 23.2 32 21.2 30.2 "
  + "C 19.8 29 21.2 32.2 24.6 32.3 C 31 32.5 38 32 44 31.2 "
  + "C 48.5 30.6 52 30.4 57.6 30.3";

const planeScene = () => `
  <svg class="pf" viewBox="0 0 100 58" aria-hidden="true">
    <defs>
      <clipPath id="pf-wipe">
        <rect class="pf-wipe" x="-10" y="0" width="110" height="58" />
      </clipPath>
    </defs>
    <g clip-path="url(#pf-wipe)">
      <path class="pf-trail" d="${PLANE_TRAIL}" />
    </g>
    <image class="pf-plane" href="art/plane.webp"
           x="54.4" y="9.5" width="35.6" height="23.5" />
  </svg>`;

/* The flight belongs to opening the app and finding it clear, not to every
   glance at the tab. Once a launch; a reload is a new launch. */
let flownThisLaunch = false;
function takeFlight() {
  if (flownThisLaunch) return false;
  flownThisLaunch = true;
  return true;
}

const emptyHome = (title, plane) => `
  <div class="empty-home ${plane ? 'has-plane is-' + plane : ''}">
    ${plane ? `
      <h2 class="sr-only">${esc(title)}</h2>
      ${planeScene()}` : `
      <h2 class="empty-home-line">
        <span>${esc(title)}</span>
        <button class="empty-add" data-act="add-first" aria-label="Add homework">
          <svg class="ico" aria-hidden="true"><use href="#i-plus" /></svg>
        </button>
      </h2>`}
    <img class="empty-art" src="art/desk.jpg" alt="" width="941" height="820"
         decoding="async" draggable="false" />
  </div>`;


/* ── Render ────────────────────────────────────────────────── */

let currentTab = 'home';

function render() {
  renderTtButton();
  syncFab();
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
  if (list.length) {
    box.innerHTML = list.map(hwRow).join('');
  } else if (state.homework.length) {
    // Everything is done, so the plane brings the news. It only flies the
    // first time this launch; after that it is simply already there.
    box.innerHTML = emptyHome('You finished all', takeFlight() ? 'fly' : 'land');
    revealArt(box);
  } else {
    box.innerHTML = emptyHome('Nothing here yet', null);
    revealArt(box);
  }
  syncFab();
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

  if (!lessonsFor(bagDay).length) {
    $('#bag-body').innerHTML =
      empty('No lessons', `Nothing to pack for ${day.en}.`, { icon: 'i-tab-bag', mood: 'rest' });
    return;
  }

  // Your own notes for the day are things to put in the bag too.
  const notes = state.notes.filter(n => n.day === null || n.day === bagDay);
  const remember = notes.length ? `
    <h2 class="section-title">Also</h2>
    <ul class="pack-list">
      ${notes.map(n => `
        <li class="pack-line">
          <span class="pack-emoji">📌</span>
          <span class="pack-text">
            <span class="pack-item">${esc(n.text)}</span>
            ${n.lesson ? `<span class="pack-for">${esc(shortName(n.lesson))}</span>` : ''}
          </span>
        </li>`).join('')}
    </ul>` : '';

  $('#bag-body').innerHTML = bagScene(bagDay) + remember;
}

/** The corner button is itself a tiny timetable, not a generic glyph. */
let ttButtonKey = '';

function renderTtButton() {
  const btn = $('#tt-btn');
  if (!btn) return;
  // Redrawn only when the subjects behind its colours change, not every render.
  if (btn.firstChild) return;                      // the week never changes
  btn.innerHTML = '<span class="tt-mini">' + SCHOOL_DAYS.map((d, i) =>
    '<span class="tt-mini-col">' + SCHEDULE[i].slice(0, 6).map(name => {
      if (!name) return '<span class="tt-mini-cell is-free"></span>';
      const sub = subjectForLesson(name);
      return '<span class="tt-mini-cell" style="--sc:' + (sub ? sub.color : 'var(--ink-3)') + '"></span>';
    }).join('') + '</span>'
  ).join('') + '</span>';
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
  setTimeout(() => { box.hidden = true; box.classList.remove('is-leaving'); }, 180);
}


function renderSubjects() {
  const box = $('#subject-list');
  box.innerHTML = allSubjects().map(sub => {
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

  const found = collectedMonsters();
  const here = found[found.length - 1] || null;
  const allFound = found.length >= MONSTER_COUNT;

  $('#level-card').innerHTML = `
    <div class="level-top">
      <span class="level-name">Level ${level}</span>
      <span class="level-xp">${allFound ? 'All found' : `${into} / ${XP_PER_LEVEL} XP`}</span>
    </div>
    <div class="bar"><div class="bar-fill" style="width:${allFound ? 100 : (into / XP_PER_LEVEL) * 100}%"></div></div>
    <p class="level-chapter">${here ? esc(here.name) + ' is with you' : 'Your first egg is on the way'}</p>
    <p class="level-note">${allFound
      ? 'All fifty have turned up.'
      : (xp > 0
          ? `${XP_PER_LEVEL - into} XP until the next egg`
          : 'Finish some homework and an egg will turn up.')}</p>`;

  renderCollection();

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

  const avail = reminderAvailability();
  const blocked = $('#reminder-blocked');
  if (blocked) {
    blocked.hidden = avail.ok;
    blocked.innerHTML = avail.ok ? ''
      : `<strong>${esc(avail.why)}</strong><span>${esc(avail.how)}</span>`;
  }
  $('#reminder-card').classList.toggle('is-unavailable', !avail.ok);
  $('#reminder-toggle').disabled = !avail.ok;
  $('#bag-toggle').disabled = !avail.ok;

  $('#reminder-toggle').checked = state.settings.dailyReminderEnabled;
  $('#reminder-time').value = state.settings.dailyReminderTime;
  $('#reminder-time-row').hidden = !state.settings.dailyReminderEnabled;
  $('#bag-toggle').checked = state.settings.bagReminderEnabled;
  $('#bag-time').value = state.settings.bagReminderTime;
  $('#bag-time-row').hidden = !state.settings.bagReminderEnabled;
  $('#reminder-note').textContent = reminderNote();
}


/** The shelf of everyone who has turned up. Nobody is teased with what is
 *  coming: which creature hatches next is a roll, so there is no next one
 *  to point at. */
function renderCollection() {
  const have = collectedMonsters();

  const cover = $('#book-count');
  if (cover) {
    cover.textContent = have.length >= MONSTER_COUNT
      ? `All ${MONSTER_COUNT} found`
      : `${have.length} of ${MONSTER_COUNT} found`;
  }
  const peek = $('#book-peek');
  if (peek) {
    peek.innerHTML = have.slice(-3).map(m =>
      `<span class="bc-peek" style="--mc:${m.colour}">${monsterSvg(m)}</span>`).join('');
  }

  const box = $('#collection');
  if (!box) return;

  box.innerHTML = have.length
    ? have.map(m => `
        <button class="mon-slot" data-monster="${m.id}" style="--mc:${m.colour}">
          ${monsterSvg(m)}
          <span class="mon-name">${esc(m.name)}</span>
          <span class="mon-rank is-${m.rarity}">${esc(rarityOf(m.rarity).label)}</span>
        </button>`).join('')
    : '<span class="mon-slot is-empty" aria-hidden="true"></span>'.repeat(4);

  const note = $('#collection-note');
  if (note) {
    const left = MONSTER_COUNT - have.length;
    note.textContent = !have.length
      ? `All ${MONSTER_COUNT} are out there. Finish some homework and the first egg will turn up.`
      : left
        ? `${left} still out there. Tap a creature to open their page.`
        : 'That is everyone. Tap any of them to read their page.';
  }
}


/* ── The book ──────────────────────────────────────────────
   Every creature gets a spread of two facing pages: the left one is who
   they are, the right one is everything else about them. One creature you
   have not met yet sits at the back as an egg, so there is always a next
   page to reach. */

let bookAt = 0;

/** One spread per creature met, then the egg of the one still coming. */
function bookPages() {
  const pages = collectedMonsters().map(m => ({ kind: 'found', m }));
  const left = MONSTER_COUNT - pages.length;
  if (left) pages.push({ kind: 'egg', left });
  return pages;
}

function foundSpread(m) {
  const met = (state.progress.metAt || {})[m.id];
  const found = met
    ? new Date(met).toLocaleDateString([], { day: 'numeric', month: 'long' })
    : 'a while ago';
  const rank = rarityOf(m.rarity);
  return `
    <div class="page page-l" style="--mc:${m.colour}">
      <div class="portrait">${monsterSvg(m)}</div>
      <h2 class="page-name">${esc(m.name)}</h2>
      <p class="page-rank is-${m.rarity}">${esc(rank.label)}</p>
      <dl class="page-facts">
        <div><dt>Age</dt><dd>${esc(m.age)}</dd></div>
        <div><dt>Size</dt><dd>${esc(m.size)}</dd></div>
        <div><dt>Hobbies</dt><dd>${m.hobbies.map(esc).join(', ')}</dd></div>
        <div><dt>Found</dt><dd>${esc(found)}</dd></div>
      </dl>
      <div class="page-egg">
        ${eggSvg(m)}
        <span>came out of this</span>
      </div>
    </div>
    <div class="page page-r">
      <dl class="page-facts">
        <div><dt>Lives</dt><dd>${esc(m.lives)}</dd></div>
        <div><dt>Eats</dt><dd>${esc(m.eats)}</dd></div>
        <div><dt>Says</dt><dd>${esc(m.says)}</dd></div>
        <div><dt>Best at</dt><dd>${esc(m.best)}</dd></div>
        <div><dt>Not so good at</dt><dd>${esc(m.worst)}</dd></div>
      </dl>
      <p class="page-fact">${esc(m.fact)}</p>
    </div>`;
}

/** The last spread: an egg, and how far off it is. */
/** The back of the book: how many are still out there, and how close the
 *  next egg is. Which of them is inside it is nobody's business until it
 *  opens. */
function eggSpread(left) {
  const into = state.progress.xp % XP_PER_LEVEL;
  const togo = XP_PER_LEVEL - into;
  const pieces = Math.ceil(togo / XP_PER_HOMEWORK);
  return `
    <div class="page page-l is-waiting" style="--mc:#8A94A2">
      <div class="portrait portrait-egg">${eggSvg({ colour: '#8A94A2', rarity: 'common' })}</div>
      <h2 class="page-name">${left} still out there</h2>
      <p class="page-hint">Every egg is a different one. You cannot choose.</p>
    </div>
    <div class="page page-r is-waiting">
      <p class="page-wait">The next egg is on its way.</p>
      <span class="page-rules">${'<i></i>'.repeat(8)}</span>
      <p class="page-fact">${togo} XP to go — about ${pieces} more
        ${pieces === 1 ? 'piece' : 'pieces'} of homework.</p>
    </div>`;
}

function renderBook(dir = 0) {
  const pages = bookPages();
  if (!pages.length) return;
  bookAt = Math.max(0, Math.min(bookAt, pages.length - 1));
  const page = pages[bookAt];

  const spread = $('#book-spread');
  // The class goes on before the new pages do, so they animate in as they arrive.
  spread.classList.toggle('turn-next', dir > 0);
  spread.classList.toggle('turn-prev', dir < 0);
  spread.innerHTML = page.kind === 'found' ? foundSpread(page.m) : eggSpread(page.left);

  $('#book-prev').disabled = bookAt === 0;
  $('#book-next').disabled = bookAt === pages.length - 1;
  $('#book-dots').innerHTML = pages
    .map((p, i) => `<span class="bd ${i === bookAt ? 'is-on' : ''} ${p.kind === 'egg' ? 'is-egg' : ''}"></span>`)
    .join('');
}

function turnPage(dir) {
  const pages = bookPages();
  const to = bookAt + dir;
  if (to < 0 || to >= pages.length) return;
  bookAt = to;
  renderBook(dir);
}

/** Opens at a creature if one is named, otherwise at the first page. */
function openBook(id) {
  const pages = bookPages();
  if (!pages.length) return;
  const i = id ? pages.findIndex(p => p.m && p.m.id === id) : 0;
  bookAt = i >= 0 ? i : 0;
  renderBook(0);

  const view = $('#book');
  view.hidden = false;
  view.classList.remove('is-leaving');
}

function closeBook() {
  const view = $('#book');
  if (!view || view.hidden) return;
  view.classList.add('is-leaving');
  setTimeout(() => { view.hidden = true; view.classList.remove('is-leaving'); }, 200);
}

/* A book turns by being pushed, so this one turns by being swiped too. */
function wireBookSwipe() {
  const frame = $('#book-frame');
  if (!frame) return;
  let x0 = null, y0 = 0;
  frame.addEventListener('pointerdown', (e) => { x0 = e.clientX; y0 = e.clientY; });
  frame.addEventListener('pointercancel', () => { x0 = null; });
  frame.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    const dy = e.clientY - y0;
    x0 = null;
    // Sideways, and clearly meant: anything else is a tap or a scroll.
    if (Math.abs(dx) < 48 || Math.abs(dy) > Math.abs(dx)) return;
    turnPage(dx < 0 ? 1 : -1);
  });
}

/* When the shell is off and the creature is out. A tap before this would
   skip the one thing worth watching, so it is ignored until then. Matches
   the CSS timeline in styles.css. */
const HATCH_OPEN_MS = 3000;

/**
 * Meeting someone new. The egg turns up, wobbles, cracks along its middle,
 * breaks open, and whoever was inside pops out. Every creature has its own
 * shell, so the same thing never hatches twice.
 *
 * The whole sequence is CSS keyframes on a fixed timeline — nothing here
 * measures or animates by hand, so there is nothing to drift out of step.
 */
function showArrival(m, fromLevel) {
  const box = $('#arrival');
  if (!box) return;

  box.innerHTML = `
    <div class="ar-stage">
      <p class="ar-kicker is-${m.rarity}">${esc(rarityOf(m.rarity).label)}</p>
      <div class="hatch" style="--mc:${m.colour}; --shell:${m.shell}">
        <span class="hatch-glow"></span>
        <div class="hatch-mon">${monsterSvg(m)}</div>
        <div class="hatch-egg">${eggSvg(m, { split: true })}</div>
        <span class="hatch-shards">${'<i></i>'.repeat(8)}</span>
      </div>
      <h2 class="ar-name">${esc(m.name)} hatched</h2>
      <p class="ar-level">Level ${fromLevel} → ${fromLevel + 1}</p>
      <p class="ar-line">${esc(m.age)} · ${esc(m.hobbies[0].toLowerCase())}</p>
      <button class="ar-continue btn-primary">Say hello</button>
    </div>`;

  box.hidden = false;
  box.classList.remove('is-leaving');
  requestAnimationFrame(() => box.classList.add('is-in'));

  let armed, auto, gone = false;
  const close = () => {
    if (gone) return;
    gone = true;
    clearTimeout(armed);
    clearTimeout(auto);
    box.classList.add('is-leaving');
    setTimeout(() => {
      box.hidden = true;
      box.classList.remove('is-leaving', 'is-in');
      box.innerHTML = '';
      if (currentTab === 'profile') renderProfile();
    }, 340);
  };

  armed = setTimeout(() => box.addEventListener('click', close), HATCH_OPEN_MS);
  auto = setTimeout(close, HATCH_OPEN_MS + 6500);
}

/**
 * Called after a level lands. The egg is rolled here rather than looked up:
 * any of the fifty can be inside, weighted by rarity, and never one you
 * already have while a stranger is left. Rolled once and written down, so a
 * reload cannot re-roll it into somebody else.
 */
function maybeArrival(level, fromLevel) {
  const seen = state.progress.shownUpTo || 1;
  if (level <= seen) return false;

  state.progress.shownUpTo = level;
  state.progress.metAt = state.progress.metAt || {};

  const m = rollMonster();
  if (m) state.progress.metAt[m.id] = Date.now();
  save();

  if (!m) return false;                 // everyone has already turned up
  showArrival(m, fromLevel || level - 1);
  return true;
}

/* ── Navigation ────────────────────────────────────────────── */

/* The + adds homework, so it only belongs on the homework screens — on Bag it
   would sit on top of the reminder's own Add button. A cleared homework screen
   is the other exception: the empty state is already holding one. */
function syncFab() {
  const belongs = currentTab === 'home' || currentTab === 'subjects';
  // A screen that has never held homework carries its own + beside the line,
  // so the header one steps aside. The finished screen has no line to sit
  // beside — the plane has it — so there the header + is the only one.
  const carriesItsOwn = currentTab === 'home' && !activeHw().length && !state.homework.length;
  $('#fab').hidden = !belongs || carriesItsOwn;
}

function showTab(tab) {
  currentTab = tab;
  for (const view of $$('.view')) view.hidden = view.dataset.view !== tab;
  for (const btn of $$('.tab')) {
    const on = btn.dataset.tab === tab;
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-selected', String(on));
  }
  render();
  // The one-after-another entrance belongs to a screen arriving. Left on every
  // redraw, it fires again each time a single row changes.
  for (const list of $$(`[data-view="${tab}"] .list`)) {
    list.classList.add('is-entering');
    setTimeout(() => list.classList.remove('is-entering'), 700);
  }
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


  const editing = id ? state.homework.find(h => h.id === id) : null;
  draft = {
    id,
    subjectId: editing ? editing.subjectId
      : (subjectId || state.lastSubjectId || SUBJECTS[0].id),
    title: editing ? editing.title : '',
    note: editing ? (editing.note || '') : '',
    dueDate: editing ? editing.dueDate : null,
  };
  if (!subjectById(draft.subjectId)) draft.subjectId = SUBJECTS[0].id;

  $('#hw-delete').hidden = !editing;
  const input = $('#hw-title');
  input.value = draft.title;
  $('#hw-note').value = draft.note;

  drawSheetChips();
  showSheet('#sheet-hw');

  // Focus inside the gesture so mobile keyboards actually open.
  input.focus();
  if (editing) input.setSelectionRange(input.value.length, input.value.length);
  syncSaveButton();
}

function drawSheetChips() {
  $('#hw-subjects').innerHTML = allSubjects().map(s => `
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
  const note = $('#hw-note').value.trim();
  if (!title || !draft) return;

  if (draft.id) {
    const hw = state.homework.find(h => h.id === draft.id);
    if (hw) Object.assign(hw, { title, note, subjectId: draft.subjectId, dueDate: draft.dueDate });
  } else {
    state.homework.push({
      id: uid(),
      subjectId: draft.subjectId,
      title,
      note,
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
  }, 200);
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
    // Long enough to see the tick drawn, short enough not to be waiting on it.
    setTimeout(() => {
      slot.style.height = `${slot.offsetHeight}px`;
      void slot.offsetHeight;
      slot.classList.add('is-leaving');
      slot.style.height = '0px';
      setTimeout(() => dropRow(slot), 190);
    }, 215);
  } else {
    render();
  }

  showToast(`Completed  ·  +${XP_PER_HOMEWORK} XP`, () => undoComplete(id));
  if (after > before) setTimeout(() => showLevelUp(after, before), 520);
}

/**
 * Take the finished row out of the list without rebuilding the list around it.
 * Rebuilding replaces every other row too, which re-runs their entrance and
 * reads as the whole screen refreshing — for something that happened to one
 * line. So the row goes, the count changes, and nothing else moves.
 */
function dropRow(slot) {
  const list = slot.parentElement;
  slot.remove();

  // A subject's own page is the exception: what you finished moves from its
  // open list into its handed-in list, on the same screen, so it has to redraw.
  if (!list || list.closest('#subject-page-body')) { render(); return; }

  if (!list.querySelector('.hw-slot')) { renderHome(); return; }   // that was the last one

  const left = activeHw().length;
  const count = $('#home-count');
  if (count) count.textContent = left ? `${left} left` : '';
  syncFab();
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
  if (maybeArrival(level, from)) return;

  // Nobody new (already met, or past the last of them): a quiet note.
  const box = $('#levelup');
  box.innerHTML = `
    <div class="levelup-card">
      <div class="levelup-ring"><span>${level}</span></div>
      <h2>Level ${from || level - 1} → ${level}</h2>
      <p>${(() => { const f = collectedMonsters(); return f.length
        ? esc(f[f.length - 1].name) + ' is still with you'
        : 'All fifty have turned up'; })()}</p>
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


/* ── Daily reminder ────────────────────────────────────────── */

const timers = { daily: null, bag: null };

const notifySupported = () => typeof window.Notification === 'function';

/* Reminders only exist where the browser actually has them. On an iPhone that
   means the app has to be on the Home Screen — in a Safari tab, or inside
   another app's browser, there is no such thing as a notification. Saying that
   plainly beats a switch that springs back to off with no explanation. */
function reminderAvailability() {
  if (!notifySupported()) {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    return ios
      ? { ok: false,
          why: 'Reminders need the app on your Home Screen.',
          how: 'Tap Share, then Add to Home Screen, and open it from there.' }
      : { ok: false,
          why: 'This browser can’t show notifications.',
          how: 'Install the app, or open it in its own tab.' };
  }
  if (Notification.permission === 'denied') {
    return { ok: false,
             why: 'Notifications are switched off for this app.',
             how: 'Turn them back on in your phone’s settings, under Notifications.' };
  }
  return { ok: true, why: '', how: '' };
}

function reminderNote() {
  // Why they can't be used is said on the card itself, not down here.
  if (!reminderAvailability().ok) return '';
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

  // Bag: the day switcher, and nothing else to press
  on('#bag-days', 'click', (e) => {
    const chip = e.target.closest('[data-day]');
    if (!chip) return;
    bagDay = Number(chip.dataset.day);
    renderBag();
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
    if (!$('#book').hidden) closeBook();
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

  on('#collection', 'click', (e) => {
    const slot = e.target.closest('[data-monster]');
    if (slot) openBook(slot.dataset.monster);
  });
  on('#book-open', 'click', () => openBook());
  on('#book-close', 'click', closeBook);
  on('#book-prev', 'click', () => turnPage(-1));
  on('#book-next', 'click', () => turnPage(1));
  wireBookSwipe();

  wireLists();
}

/* ── Boot ──────────────────────────────────────────────────── */

/**
 * The desk picture is needed the instant the last thing is ticked off, which is
 * the worst moment to start downloading it — the screen has just cleared and is
 * waiting on it. So it is fetched and decoded quietly once the app is up and
 * nothing else is happening, and by the time it is wanted it is already in hand.
 */
function warmArt() {
  const start = () => {
    for (const src of ['art/desk.jpg', 'art/plane.webp']) {
      const img = new Image();
      img.src = src;
      if (img.decode) img.decode().catch(() => {});   // decode off the main thread too
    }
  };
  if (typeof requestIdleCallback === 'function') requestIdleCallback(start, { timeout: 3000 });
  else setTimeout(start, 1200);
}

function boot() {
  load();
  saveLocal();      // write the migrated shape back, without bumping the sync clock
  wireApp();

  $('#main').hidden = false;
  showTab('home');

  scheduleReminder();
  warmArt();

  // Opened from the notification or the home-screen shortcut.
  if (new URLSearchParams(location.search).get('add') === '1') {
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
      if (e.data && e.data.type === 'add-homework') openHwSheet();
    });
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

})();
