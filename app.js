/* Homework — all your homework in one place.
   One file, no build step, no dependencies. Sections below:
   data → dates → store → render → add/edit → completing → onboarding → reminders → boot */

(() => {
'use strict';

/* ── The look of the place ─────────────────────────────────
   Four desks. Three of them are daylight with the parchment mixed a
   different way, and one is the evening. The swatch you tap is the colour
   the app actually stands on, so there is nothing to describe: the row of
   four IS the four looks.

   Night is the dark theme that was already here, given a face. Before this
   it followed the phone and there was no way to ask for it. */
const DESKS = [
  { key: 'cream', theme: 'light', swatch: '#F4EEE1' },
  { key: 'sage',  theme: 'light', swatch: '#9DB48A' },
  { key: 'night', theme: 'dark',  swatch: '#1E2A38' },
  { key: 'sky',   theme: 'light', swatch: '#A8C0DA' },
];

function applyDesk() {
  const key = state.settings.desk;
  const desk = DESKS.find(d => d.key === key);
  const root = document.documentElement;
  if (!desk) {
    // Nothing chosen: the phone decides, the way it always did.
    root.removeAttribute('data-desk');
    root.removeAttribute('data-theme');
    return;
  }
  root.setAttribute('data-desk', desk.key);
  root.setAttribute('data-theme', desk.theme);
}

function renderDeskPick() {
  const box = $('#desk-pick');
  if (!box) return;
  const on = state.settings.desk;
  box.innerHTML = DESKS.map(d => `
    <button class="desk-dot ${d.key === on ? 'is-on' : ''}" data-desk="${d.key}"
            style="--swatch:${d.swatch}"
            title="${esc(tr('desk.' + d.key))}"
            aria-label="${esc(tr('desk.' + d.key))}"
            aria-pressed="${d.key === on}"></button>`).join('');
}

function setDesk(key) {
  if (!DESKS.some(d => d.key === key)) return;
  state.settings.desk = key;
  save();
  applyDesk();
  syncTopColour();
  renderDeskPick();
}

/* ── Words ─────────────────────────────────────────────────
   The app speaks one language at a time, chosen in Profile. Every word the
   app says for itself lives here; nothing the user typed and no subject name
   is translated, because those are their words and not ours.

   Hebrew reads right to left, so choosing it turns the whole page over —
   dir="rtl" on the root — rather than leaving Hebrew sentences running the
   wrong way in a left-handed layout. */

const LANGS = [
  { key: 'en', name: 'English',  dir: 'ltr' },
  { key: 'he', name: 'עברית',    dir: 'rtl' },
];

const STRINGS = {
  en: {
    'app.name': 'Homework',

    'tab.home': 'Homework', 'tab.bag': 'Bag', 'tab.reminders': 'Reminders',
    'tab.subjects': 'Subjects', 'tab.profile': 'Profile',

    'home.left': '{n} left',
    'home.none': 'Nothing here yet',
    'home.allDone': 'You finished all',
    'home.add': 'Add homework',
    'home.fresh': 'Add today’s homework while it’s fresh.',

    'due.today': 'For today', 'due.tomorrow': 'For tomorrow',
    'due.overdue': 'Overdue', 'due.yesterday': 'Yesterday',
    'due.wasYesterday': 'Was yesterday', 'due.none': 'No date yet',
    'due.pick': 'Pick a date', 'due.todayShort': 'Today', 'due.tomorrowShort': 'Tomorrow',
    'due.forDay': 'For {day}', 'due.nextDay': 'Next {day}', 'due.forDate': 'For {date}',
    'bag.packFor': 'Pack for {day}',

    'hw.what': 'What’s the homework?',
    'hw.else': 'Anything else? (optional)',
    'hw.save': 'Save', 'hw.delete': 'Delete homework',
    'hw.title': 'Homework', 'hw.completed': 'Completed',
    'hw.nothingFinished': 'Nothing finished yet.',
    'hw.nothingFor': 'Nothing for {name} right now',
    'hw.enjoy': 'Enjoy it while it lasts.',
    'hw.done': 'Completed  ·  +{n} XP',

    'bag.title': 'Bag', 'bag.also': 'Also',
    'bag.noLessons': 'No lessons',
    'bag.nothingToPack': 'Nothing to pack for {day}.',
    'bag.pencil': 'Pencil bag', 'bag.bottle': 'Bottle', 'bag.lunch': 'Lunch box',
    'bag.shoes': 'Sports shoes', 'bag.notebooks': 'Notebooks', 'bag.books': 'Books',

    'rem.title': 'Reminders', 'rem.new': 'New reminder', 'rem.add': 'Add reminder',
    'rem.cancel': 'Cancel', 'rem.save': 'Save',
    'rem.fTitle': 'Title', 'rem.fNotes': 'Notes', 'rem.fTime': 'Time',
    'rem.optional': 'optional', 'rem.fDays': 'Days', 'rem.fLesson': 'Lesson',
    'rem.fPaper': 'Paper', 'rem.nextPaper': 'Next paper',
    'rem.everyDay': 'Every day', 'rem.wholeDay': 'Whole day',
    'rem.empty': 'Nothing pinned up yet', 'rem.emptySub': 'Tap to write one',
    'rem.nothingFor': 'Nothing for {day}',
    'rem.taken': 'Taken down',
    'rem.whatNot': 'What not to forget', 'rem.elseOpt': 'Anything else (optional)',
    'rem.marginA': 'Small steps matter ♡', 'rem.marginB': 'A brighter tomorrow',
    'rem.foot': 'You’ve got this ♡',
    'rem.more': 'More', 'rem.less': 'Less', 'rem.all': 'All',

    'paper.lined-cream': 'Lined cream', 'paper.soft-yellow': 'Soft yellow',
    'paper.grid': 'Grid notebook', 'paper.sticky': 'Pastel sticky',
    'paper.torn': 'Torn edge', 'paper.textured': 'Textured',

    'sub.title': 'Subjects', 'sub.add': 'Add subject', 'sub.back': 'Back',
    'sub.left': '{n} left',

    'tt.title': 'Timetable', 'tt.close': 'Close timetable',
    'tt.nothing': 'Nothing scheduled.',

    'pro.title': 'Profile', 'pro.book': 'Your creature book',
    'pro.creatures': 'Creatures', 'pro.open': 'Open',
    'pro.completed': 'Completed', 'pro.reminder': 'Reminder',
    'pro.daily': 'Daily reminder',
    'pro.dailyNote': 'A nudge to write down today’s homework.',
    'pro.pack': 'Pack your bag',
    'pro.packNote': 'Tomorrow’s lessons and reminders, the evening before.',
    'pro.time': 'Time', 'pro.language': 'Language',

    'set.title': 'Settings',
    'set.sub': 'Personalize your study space and reminders.',
    'set.progress': 'Profile & progress',
    'set.book': 'Creature book',
    'set.collect': 'Collect them all!',
    'set.reminders': 'Reminders',
    'set.appearance': 'Appearance',
    'set.desk': 'Desk theme',
    'set.deskNote': 'Choose a look for your study space.',
    'set.about': 'About',
    'set.help': 'Help & About',
    'set.version': 'App version {v}',
    'set.firstCreature': 'Your first creature is on the way.',

    'desk.cream': 'Cream', 'desk.sage': 'Sage',
    'desk.night': 'Night', 'desk.sky': 'Sky',

    'about.what': 'What this is',
    'about.whatNote': 'Everything you have to do, in one place. Write homework down as it is set, tick it off when it is done, and the bag packs itself from the timetable.',
    'about.install': 'On your phone',
    'about.installNote': 'Share, then Add to Home Screen. Opened from there it fills the screen and can send you reminders; in a browser tab it cannot.',
    'about.data': 'Your work',
    'about.dataNote': 'Everything stays on this phone. Nothing is sent anywhere and there is nothing to sign in to.',
    'about.done': 'Done',

    'tab.creatures': 'Creatures',
    'cre.title': 'Creatures',
    'cre.sub': 'Fifty of them, one egg at a time.',
    'cre.book': 'The book',
    'cre.found': 'Found so far',

    'set.homework': 'Homework',
    'set.startOn': 'Open on',
    'set.startOnNote': 'The page the app opens when you launch it.',
    'set.ask': 'Ask before removing',
    'set.askNote': 'A note comes off the board with one tap. This puts a question in the way.',
    'set.remove': 'Remove?',
    'set.removeCancel': 'Keep it',
    'set.removeOk': 'Remove',

    'book.title': 'Creature book', 'book.close': 'Close',
    'book.prev': 'Page back', 'book.next': 'Page on',
    'book.size': 'Size', 'book.hobbies': 'Hobbies', 'book.found': 'Found',
    'book.lives': 'Lives', 'book.eats': 'Eats', 'book.says': 'Says',
    'book.best': 'Best at', 'book.worst': 'Not so good at',
    'book.allFound': 'All found', 'book.withYou': '{name} is with you',
    'book.everyEgg': 'Every egg is a different one. You cannot choose.',
    'book.nextEgg': 'The next egg is on its way.',
    'book.hello': 'Say hello',
    'book.firstEgg': 'Your first egg is on the way',
    'book.finishSome': 'Finish some homework and an egg will turn up.',
    'book.allFifty': 'All fifty have turned up.',
    'book.everyone': 'That is everyone. Tap any of them to read their page.',

    'rarity.common': 'Common', 'rarity.uncommon': 'Uncommon', 'rarity.rare': 'Rare',
    'rarity.epic': 'Epic', 'rarity.legendary': 'Legendary',

    'notif.optional': 'Optional. One nudge to write down homework, one to pack your bag.',
    'notif.homeScreen': 'Reminders need the app on your Home Screen.',
    'notif.howTo': 'Tap Share, then Add to Home Screen, and open it from there.',
    'notif.install': 'Install the app, or open it in its own tab.',
    'notif.addHome': 'Add the app to your home screen so it can still reach you after school.',
    'notif.off': 'Notifications are switched off for this app.',
    'notif.turnBack': 'Turn them back on in your phone’s settings, under Notifications.',
    'notif.noSupport': 'This browser can’t show notifications.',
    'notif.anyHomework': 'Any homework today?',
    'notif.dontForget': 'Don’t forget: ',

    'bag.dayToday': '{day} · today',
    'sub.count': '{n} left',
    'lvl.level': 'Level {n}',
    'lvl.xp': '{into} / {of} XP',
    'lvl.untilEgg': '{n} XP until the next egg',
    'book.allOut': 'All {n} are out there. Finish some homework and the first egg will turn up.',
    'book.stillOut': '{n} still out there. Tap a creature to open their page.',
    'book.countFound': '{have} of {all} found',
    'book.allFoundOf': 'All {n} found',
    'toast.undo': 'Undo',
    'time.aWhileAgo': 'a while ago',
  },

  he: {
    'app.name': 'שיעורי בית',

    'tab.home': 'שיעורי בית', 'tab.bag': 'תיק', 'tab.reminders': 'תזכורות',
    'tab.subjects': 'מקצועות', 'tab.profile': 'פרופיל',

    'home.left': 'נשארו {n}',
    'home.none': 'אין כאן עדיין כלום',
    'home.allDone': 'סיימת הכול',
    'home.add': 'הוספת שיעורי בית',
    'home.fresh': 'כדאי לרשום את שיעורי הבית כל עוד הם טריים.',

    'due.today': 'להיום', 'due.tomorrow': 'למחר',
    'due.overdue': 'באיחור', 'due.yesterday': 'אתמול',
    'due.wasYesterday': 'היה אתמול', 'due.none': 'בלי תאריך',
    'due.pick': 'בחירת תאריך', 'due.todayShort': 'היום', 'due.tomorrowShort': 'מחר',
    'due.forDay': 'ליום {day}', 'due.nextDay': 'ליום {day} הבא', 'due.forDate': 'ל{date}',
    'bag.packFor': 'לארוז ליום {day}',

    'hw.what': 'מה שיעורי הבית?',
    'hw.else': 'עוד משהו? (רשות)',
    'hw.save': 'שמירה', 'hw.delete': 'מחיקת שיעורי בית',
    'hw.title': 'שיעורי בית', 'hw.completed': 'הושלמו',
    'hw.nothingFinished': 'עוד לא הושלם כלום.',
    'hw.nothingFor': 'אין כרגע כלום ב{name}',
    'hw.enjoy': 'תיהנו כל עוד אפשר.',
    'hw.done': 'הושלם  ·  ‎+{n}‎ נק׳',

    'bag.title': 'תיק', 'bag.also': 'בנוסף',
    'bag.noLessons': 'אין שיעורים',
    'bag.nothingToPack': 'אין מה לארוז ל{day}.',
    'bag.pencil': 'קלמר', 'bag.bottle': 'בקבוק', 'bag.lunch': 'קופסת אוכל',
    'bag.shoes': 'נעלי ספורט', 'bag.notebooks': 'מחברות', 'bag.books': 'ספרים',

    'rem.title': 'תזכורות', 'rem.new': 'תזכורת חדשה', 'rem.add': 'הוספת תזכורת',
    'rem.cancel': 'ביטול', 'rem.save': 'שמירה',
    'rem.fTitle': 'כותרת', 'rem.fNotes': 'הערות', 'rem.fTime': 'שעה',
    'rem.optional': 'רשות', 'rem.fDays': 'ימים', 'rem.fLesson': 'שיעור',
    'rem.fPaper': 'נייר', 'rem.nextPaper': 'הנייר הבא',
    'rem.everyDay': 'כל יום', 'rem.wholeDay': 'כל היום',
    'rem.empty': 'עוד לא נתלה כאן כלום', 'rem.emptySub': 'הקישו כדי לכתוב',
    'rem.nothingFor': 'אין כלום ל{day}',
    'rem.taken': 'הורד',
    'rem.whatNot': 'מה לא לשכוח', 'rem.elseOpt': 'עוד משהו (רשות)',
    'rem.marginA': 'צעדים קטנים חשובים ♡', 'rem.marginB': 'מחר יהיה מואר יותר',
    'rem.foot': 'אתם מסוגלים ♡',
    'rem.more': 'עוד', 'rem.less': 'פחות', 'rem.all': 'הכול',

    'paper.lined-cream': 'שורות על קרם', 'paper.soft-yellow': 'צהוב רך',
    'paper.grid': 'משבצות', 'paper.sticky': 'פתק פסטל',
    'paper.torn': 'קצה קרוע', 'paper.textured': 'נייר מרקם',

    'sub.title': 'מקצועות', 'sub.add': 'הוספת מקצוע', 'sub.back': 'חזרה',
    'sub.left': 'נשארו {n}',

    'tt.title': 'מערכת שעות', 'tt.close': 'סגירת מערכת השעות',
    'tt.nothing': 'אין שיעורים.',

    'pro.title': 'פרופיל', 'pro.book': 'ספר היצורים שלך',
    'pro.creatures': 'יצורים', 'pro.open': 'פתיחה',
    'pro.completed': 'הושלמו', 'pro.reminder': 'תזכורת',
    'pro.daily': 'תזכורת יומית',
    'pro.dailyNote': 'תזכורת קטנה לרשום את שיעורי הבית של היום.',
    'pro.pack': 'לארוז את התיק',
    'pro.packNote': 'השיעורים והתזכורות של מחר, בערב שלפני.',
    'pro.time': 'שעה', 'pro.language': 'שפה',

    'set.title': 'הגדרות',
    'set.sub': 'התאימו את סביבת הלמידה והתזכורות שלכם.',
    'set.progress': 'פרופיל והתקדמות',
    'set.book': 'ספר היצורים',
    'set.collect': 'אספו את כולם!',
    'set.reminders': 'תזכורות',
    'set.appearance': 'מראה',
    'set.desk': 'ערכת שולחן',
    'set.deskNote': 'בחרו מראה לסביבת הלמידה.',
    'set.about': 'אודות',
    'set.help': 'עזרה ואודות',
    'set.version': 'גרסה {v}',
    'set.firstCreature': 'היצור הראשון שלך בדרך.',

    'desk.cream': 'קרם', 'desk.sage': 'מרווה',
    'desk.night': 'לילה', 'desk.sky': 'תכלת',

    'about.what': 'מה זה',
    'about.whatNote': 'כל מה שצריך לעשות, במקום אחד. רושמים שיעורי בית ברגע שהם ניתנים, מסמנים כשסיימו, והתיק נארז לבד לפי המערכת.',
    'about.install': 'בטלפון',
    'about.installNote': 'שיתוף, ואז הוספה למסך הבית. כשפותחים משם האפליקציה ממלאת את המסך ויכולה לשלוח תזכורות; בלשונית של דפדפן היא לא יכולה.',
    'about.data': 'העבודה שלך',
    'about.dataNote': 'הכול נשאר בטלפון הזה. שום דבר לא נשלח לשום מקום ואין לאן להתחבר.',
    'about.done': 'סיום',

    'tab.creatures': 'יצורים',
    'cre.title': 'יצורים',
    'cre.sub': 'חמישים, ביצה אחת בכל פעם.',
    'cre.book': 'הספר',
    'cre.found': 'נמצאו עד כה',

    'set.homework': 'שיעורי בית',
    'set.startOn': 'פתיחה בעמוד',
    'set.startOnNote': 'העמוד שייפתח כשמפעילים את האפליקציה.',
    'set.ask': 'לשאול לפני הסרה',
    'set.askNote': 'פתק יורד מהלוח בהקשה אחת. זה שם שאלה בדרך.',
    'set.remove': 'להסיר?',
    'set.removeCancel': 'להשאיר',
    'set.removeOk': 'להסיר',

    'book.title': 'ספר היצורים', 'book.close': 'סגירה',
    'book.prev': 'עמוד אחורה', 'book.next': 'עמוד קדימה',
    'book.size': 'גודל', 'book.hobbies': 'תחביבים', 'book.found': 'נמצא',
    'book.lives': 'גר', 'book.eats': 'אוכל', 'book.says': 'אומר',
    'book.best': 'הכי טוב ב', 'book.worst': 'פחות טוב ב',
    'book.allFound': 'כולם נמצאו', 'book.withYou': '{name} אתך',
    'book.everyEgg': 'כל ביצה היא אחרת. אי אפשר לבחור.',
    'book.nextEgg': 'הביצה הבאה בדרך.',
    'book.hello': 'לומר שלום',
    'book.firstEgg': 'הביצה הראשונה שלך בדרך',
    'book.finishSome': 'סיימו כמה שיעורי בית ותגיע ביצה.',
    'book.allFifty': 'כל החמישים הגיעו.',
    'book.everyone': 'זהו כולם. הקישו על כל אחד כדי לקרוא עליו.',

    'rarity.common': 'רגיל', 'rarity.uncommon': 'לא שכיח', 'rarity.rare': 'נדיר',
    'rarity.epic': 'אגדי', 'rarity.legendary': 'אגדתי',

    'notif.optional': 'רשות. תזכורת אחת לרשום שיעורי בית, ואחת לארוז את התיק.',
    'notif.homeScreen': 'תזכורות דורשות שהאפליקציה תהיה במסך הבית.',
    'notif.howTo': 'הקישו שיתוף, ואז הוספה למסך הבית, ופתחו משם.',
    'notif.install': 'התקינו את האפליקציה, או פתחו אותה בלשונית משלה.',
    'notif.addHome': 'הוסיפו את האפליקציה למסך הבית כדי שתוכל להגיע אליכם גם אחרי הלימודים.',
    'notif.off': 'ההתראות כבויות עבור האפליקציה הזו.',
    'notif.turnBack': 'אפשר להדליק אותן שוב בהגדרות הטלפון, תחת התראות.',
    'notif.noSupport': 'הדפדפן הזה לא יודע להציג התראות.',
    'notif.anyHomework': 'יש שיעורי בית היום?',
    'notif.dontForget': 'לא לשכוח: ',

    'bag.dayToday': 'יום {day} · היום',
    'sub.count': 'נשארו {n}',
    'lvl.level': 'רמה {n}',
    'lvl.xp': '{into} / {of} נק׳',
    'lvl.untilEgg': 'עוד {n} נק׳ עד הביצה הבאה',
    'book.allOut': 'כל {n} מסתובבים שם בחוץ. סיימו כמה שיעורי בית והביצה הראשונה תגיע.',
    'book.stillOut': 'עוד {n} מסתובבים שם בחוץ. הקישו על יצור כדי לפתוח את העמוד שלו.',
    'book.countFound': 'נמצאו {have} מתוך {all}',
    'book.allFoundOf': 'כל {n} נמצאו',
    'toast.undo': 'ביטול',
    'time.aWhileAgo': 'לפני זמן מה',
  },
};

let lang = 'en';

/* One word, in the language chosen. {name} in a string is filled from the
   second argument, so a sentence can be worded differently in each language
   without the caller knowing where the blank falls. */
/* Named tr rather than t: a one-letter name for something every screen
   calls is a name a loop variable will shadow sooner or later, and it did —
   dayTabs() keeps a `const t = new Date()` and every lookup inside it was
   calling a date instead. */
function tr(key, vars) {
  const table = STRINGS[lang] || STRINGS.en;
  let out = table[key];
  if (out === undefined) out = STRINGS.en[key];
  if (out === undefined) return key;
  if (vars) {
    for (const k of Object.keys(vars)) out = out.split('{' + k + '}').join(vars[k]);
  }
  return out;
}

/* What to ask the browser for when it writes a date we have no word for. */
function locale() {
  return lang === 'he' ? 'he-IL' : 'en-GB';
}

function langDir(key) {
  const l = LANGS.find(x => x.key === key);
  return l ? l.dir : 'ltr';
}

/* A day's name in whichever language is on. The timetable already carries
   both, because the school writes one and the app says the other. */
function dayName(i) {
  const d = SCHOOL_DAYS[i];
  if (!d) return '';
  return lang === 'he' ? d.he : d.en;
}
function dayShort(i) {
  const d = SCHOOL_DAYS[i];
  if (!d) return '';
  return lang === 'he' ? d.he : d.short;
}

/* ── Data ──────────────────────────────────────────────────── */

/* ── Timetable ─────────────────────────────────────────────
   The weekly schedule, taken from the printed timetable. Lesson names are
   kept as the school writes them. Teacher names, room numbers and the
   school's own name are deliberately left out — this file is published,
   and none of that is needed to pack a bag. */

/* ── Whose app this is ─────────────────────────────────────
   One app, more than one timetable. Everything that belongs to a particular
   school week — the periods, the grid, how the subjects look, what goes in
   the bag — lives in a profile; everything else is shared. A link carries
   the profile in ?p=, so a change to the app is a change to every link at
   once and there is nothing to keep in step by hand.

   They live in one file rather than one each because a timetable is a
   couple of kilobytes and a second request before the first paint costs
   more than carrying them all. */

const PROFILES = {};

PROFILES.rea = {
  id: 'rea',
  appName: 'Homework',
  periods: [
    '8:20–9:00', '9:10–9:50', '10:00–10:40', '10:50–11:30',
    '11:55–12:35', '12:45–13:25', '13:35–14:15', '14:20–15:00',
  ],
  schedule: [
    ['מתמטיקה', 'מתמטיקה', 'אזרחות', 'חינוך', 'שפה', 'שפה', 'מעבדה', 'מעבדה'],
    ['ביולוגיה', 'ספורט', 'ערבית', 'ערבית', 'אנגלית', 'אנגלית', null, null],
    ['תנ״ך', 'תנ״ך', 'הנדסה', 'הנדסה', 'פיסיקה', 'הסטוריה', null, null],
    ['תכנות', 'תכנות', 'אזרחות', 'פיסיקה', 'הסטוריה', 'ערבית', 'מתמטיקה', null],
    ['חינוך', 'ביולוגיה', 'ספורט', 'ספרות', 'ספרות', 'אנגלית', 'אנגלית', null],
  ],
  look: {
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
  },
  bagArt: 'art/bag',
  bagStyle: 'scene',
  /* Worked out from the timetable, not from anything to keep up to date:
     every lesson wants a notebook except חינוך, five want a book as well,
     and two have something of their own. */
  bag(names, lessonLabel, tr) {
    const list = (only) => {
      const out = [];
      for (const n of names.filter(only)) {
        const label = lessonLabel(n);
        if (!out.includes(label)) out.push(label);
      }
      return out;
    };
    const NO_NOTEBOOK = ['חינוך'];
    const NEEDS_BOOK = ['מתמטיקה', 'הנדסה', 'ערבית', 'ספרות', 'שפה'];
    const SPECIAL = {
      'תכנות': [{ key: 'laptop', label: 'MacBook' }, { key: 'airpods', label: 'AirPods' }],
      'תנ״ך':  [{ key: 'tanach', label: 'ספר תנ״ך' }],
    };

    const things = [
      { key: 'pencil', label: tr('bag.pencil') },
      { key: 'bottle', label: tr('bag.bottle') },
      { key: 'lunch',  label: tr('bag.lunch') },
    ];
    if (names.includes('ספורט')) things.push({ key: 'shoes', label: tr('bag.shoes') });

    const notebooks = list(n => !NO_NOTEBOOK.includes(n));
    if (notebooks.length) {
      things.push({ key: 'notebook', label: tr('bag.notebooks'), detail: notebooks.join(' · ') });
    }
    const books = list(n => NEEDS_BOOK.includes(n));
    if (books.length) {
      things.push({ key: 'books', label: tr('bag.books'), detail: books.join(' · ') });
    }
    // Sport and the special lessons never fall on the same day, so the one
    // slot beside the bag is enough for whichever of them turns up.
    for (const name of names) {
      (SPECIAL[name] || []).forEach((extra, i) => {
        things.push({ ...extra, detail: i === 0 ? lessonLabel(name) : '' });
      });
    }
    return things;
  },
};

/* A twelfth-grade week: ragged, with a seminar, an art major and two
   evenings. The periods are the union of every slot the week actually uses,
   so a day that starts at 11:15 simply leaves the morning empty. */
PROFILES.yb = {
  id: 'yb',
  appName: 'Homework · יב',
  periods: [
    '8:00–8:45', '8:45–9:30', '9:30–10:10', '10:30–11:15', '11:15–11:55',
    '12:10–12:50', '12:50–13:30', '14:00–14:40', '17:00–19:00', '20:30',
  ],
  schedule: [
    ['תנך', 'מתמטיקה', 'מתמטיקה', 'סמינר יב', 'סמינר יב', 'מרחב פוליטי', 'מרחב פוליטי', null, null, null],
    [null, null, null, null, 'ספרות', 'אנגלית', 'אנגלית', 'חינוך גופני', 'דיפלומטיה', 'ליד'],
    ['תנך', 'אזרחות', 'אזרחות', 'מתמטיקה', 'מתמטיקה', 'ענבר', 'ענבר', null, null, null],
    [null, 'מתמטיקה', 'מתמטיקה', 'מגדר', 'מגדר', 'חינוך גופני', 'מגמת אומנות', null, 'דיפלומטיה', null],
    ['אנגלית', 'אנגלית', 'אנגלית', 'ספרות', 'ספרות', null, null, null, null, null],
  ],
  look: {
    'תנך':          { icon: 'i-bookmark',  color: '#9A7B2E' },
    'מתמטיקה':      { icon: 'i-math',      color: '#3E63DD' },
    'סמינר יב':     { icon: 'i-book',      color: '#7C5CD6' },
    'מרחב פוליטי':  { icon: 'i-globe',     color: '#2F7BC4' },
    'ספרות':        { icon: 'i-book',      color: '#B04FA0' },
    'אנגלית':       { icon: 'i-pencil',    color: '#C2456A' },
    'חינוך גופני':  { icon: 'i-ball',      color: '#D9772E' },
    'דיפלומטיה':    { icon: 'i-globe',     color: '#12A594' },
    'ליד':          { icon: 'i-people',    color: '#7C7A76' },
    'אזרחות':       { icon: 'i-scales',    color: '#8A6D3B' },
    'ענבר':         { icon: 'i-people',    color: '#4FA83D' },
    'מגדר':         { icon: 'i-people',    color: '#C0553D' },
    'מגמת אומנות':  { icon: 'i-shapes',    color: '#C97B1E' },
  },
  bagArt: 'art/bag2',
  // Ten things can land on a Monday, which is more than will place around a
  // backpack without becoming a puzzle. They are listed instead.
  bagStyle: 'list',
  bag(names, lessonLabel, tr, dayIndex) {
    const things = [
      { key: 'ipad', label: 'אייפד' },
      { key: 'case', label: 'קלמר' },
      { key: 'pen',  label: 'עט' },
    ];
    // Monday and Wednesday run into the evening.
    if (dayIndex === 1 || dayIndex === 3) things.push({ key: 'charger', label: 'מטען' });

    const perLesson = {
      'תנך':         [{ key: 'tanach', label: 'ספר תנ״ך' }],
      'דיפלומטיה':   [{ key: 'diplomacy', label: 'ספר דיפלומטיה' }],
      'ספרות':       [{ key: 'lit', label: 'ספר ספרות' }],
      'אנגלית':      [{ key: 'eng', label: 'ספר אנגלית' }],
      'חינוך גופני': [{ key: 'sportkit', label: 'בגדים מתאימים' },
                      { key: 'deo', label: 'דאודורנט' },
                      { key: 'bottle', label: 'בקבוק מים' }],
    };
    for (const name of names) {
      for (const extra of perLesson[name] || []) {
        if (!things.some(t => t.key === extra.key)) {
          things.push({ ...extra, detail: lessonLabel(name) });
        }
      }
    }
    return things;
  },
};

/* Which one this copy is. The name in ?p= is the only thing that differs
   between the links, and anything it does not recognise is the first. */
const PROFILE = (() => {
  try {
    const want = new URLSearchParams(location.search).get('p');
    if (want && PROFILES[want]) return PROFILES[want];
  } catch { /* no URL to read */ }
  return PROFILES.rea;
})();

const SCHOOL_DAYS = [
  { js: 0, he: 'ראשון',  en: 'Sunday',    short: 'Sun' },
  { js: 1, he: 'שני',    en: 'Monday',    short: 'Mon' },
  { js: 2, he: 'שלישי',  en: 'Tuesday',   short: 'Tue' },
  { js: 3, he: 'רביעי',  en: 'Wednesday', short: 'Wed' },
  { js: 4, he: 'חמישי',  en: 'Thursday',  short: 'Thu' },
];

const PERIODS = PROFILE.periods;

// [day index][period index] — null is a free period.
const SCHEDULE = PROFILE.schedule;

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

const SUBJECT_LOOK = PROFILE.look;

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



/** A lesson in the words you picked it in, falling back to the timetable's. */
function lessonLabel(name) {
  const sub = subjectForLesson(name);
  return sub ? sub.name : shortName(name);
}

/** Everything that goes in the bag on one day, in the order it is drawn. */
/* What goes in the bag is the profile's business: the lessons of the day go
   in, a list of things comes back. */
function bagThings(dayIndex) {
  const names = lessonsFor(dayIndex).map(l => l.name);
  return PROFILE.bag(names, lessonLabel, tr, dayIndex);
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
  return `<img class="bag-pic ${extra}" src="${PROFILE.bagArt}/${key}.webp" alt="" aria-hidden="true"
       width="${w}" height="${Math.round(w / art.ratio)}" decoding="async"
       style="left:${(place.x / BAG_SCENE.w) * 100}%; top:${(place.y / H) * 100}%;
              width:${art.w * 100}%" />`;
}

/**
 * The scene for one day. Everything on it is worked out from the timetable,
 * so there is never anything to answer.
 */
/* Ten things will not place around a backpack without becoming a puzzle, so
   a week that packs that many gets them in a list instead — same pictures,
   same words, read down rather than hunted for. */
function bagList(dayIndex) {
  const things = bagThings(dayIndex);
  return `
    <ul class="bag-rows">
      ${things.map(t => `
        <li class="bag-row">
          <img class="bag-row-pic" src="${PROFILE.bagArt}/${t.key}.webp" alt=""
               aria-hidden="true" decoding="async" />
          <span class="bag-row-text">
            <b>${esc(t.label)}</b>
            ${t.detail ? `<i>${esc(t.detail)}</i>` : ''}
          </span>
        </li>`).join('')}
    </ul>`;
}

function bagScene(dayIndex) {
  if (PROFILE.bagStyle === 'list') return bagList(dayIndex);
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
/* Two of these can sit on one phone, and they are two different weeks of two
   different people. The first keeps the plain key so nobody's homework moves
   when profiles arrive; every other one is kept beside it. */
const STORAGE_KEY = PROFILE.id === 'rea' ? 'homework.v1' : 'homework.v1.' + PROFILE.id;

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
  if (diff < -1) return tr('due.overdue');
  if (diff === -1) return tr('due.yesterday');
  if (diff === 0) return tr('due.todayShort');
  if (diff === 1) return tr('due.tomorrowShort');
  if (diff <= 6) return keyToDate(key).toLocaleDateString(locale(), { weekday: 'long' });
  return keyToDate(key).toLocaleDateString(locale(), { day: 'numeric', month: 'short' });
}

/** The card reads as a sentence: "for thursday", "for next monday". */
function duePhrase(key) {
  const diff = daysFromToday(key);
  const weekday = () => keyToDate(key).toLocaleDateString(locale(), { weekday: 'long' }).toLowerCase();
  if (diff < -1) return 'overdue';
  if (diff === -1) return 'was for yesterday';
  if (diff === 0) return 'for today';
  if (diff === 1) return 'for tomorrow';
  if (diff <= 6) return `for ${weekday()}`;
  if (diff <= 13) return `for next ${weekday()}`;
  return `for ${keyToDate(key).toLocaleDateString(locale(), { day: 'numeric', month: 'long' })}`;
}

function dayHeading(ts) {
  const key = dayKey(new Date(ts));
  const diff = daysFromToday(key);
  if (diff === 0) return tr('due.todayShort');
  if (diff === -1) return tr('due.yesterday');
  const d = new Date(ts);
  const opts = { weekday: 'long', day: 'numeric', month: 'short' };
  if (d.getFullYear() !== new Date().getFullYear()) opts.year = 'numeric';
  return d.toLocaleDateString(locale(), opts);
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
    // null until somebody chooses; the phone is asked the first time.
    lang: null,
    // Likewise the look of the place: null means whatever the phone is set to.
    desk: null,
    // Which page the app opens on, and whether taking a note down asks first.
    startOn: 'home',
    askBeforeRemove: false,
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
  // Anyone who was here before there was a choice gets the phone asked for them.
  if (!LANGS.some(l => l.key === next.settings.lang)) next.settings.lang = null;
  if (!DESKS.some(d => d.key === next.settings.desk)) next.settings.desk = null;
  if (!START_PAGES.some(p => p.key === next.settings.startOn)) next.settings.startOn = 'home';
  next.settings.askBeforeRemove = !!next.settings.askBeforeRemove;
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

/* The colour a subject is FILLED with, as against the colour it is written
   in. The palette is tuned for ink — deep enough to read as text on cream —
   and a deep colour used as a fill leaves a black mark on it barely legible,
   worst on the browns. Measured off the drawing, its tiles keep the hue and
   take it up to about 73% lightness at 82% saturation, which is where
   black sits comfortably. At night it goes the other way: the same hue
   darkened, so white sits comfortably instead.

   Derived rather than listed, so a subject somebody adds themselves gets a
   tile of its own without anyone having to pick a second colour for it. */
function hexToHsl(hex) {
  const n = String(hex).replace('#', '');
  const full = n.length === 3 ? n.split('').map(c => c + c).join('') : n;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (!d) return [0, 0, l];
  const sat = d / (1 - Math.abs(2 * l - 1));
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = Math.round(h * 60);
  return [h < 0 ? h + 360 : h, sat, l];
}

function tileFill(hex, dark) {
  const [h, sat] = hexToHsl(hex);
  // A grey subject has no hue worth saturating; it stays a grey.
  if (sat < 0.08) return dark ? 'hsl(0 0% 34%)' : 'hsl(0 0% 76%)';
  return dark ? `hsl(${h} ${Math.round(sat * 62)}% 38%)` : `hsl(${h} 82% 73%)`;
}

/* Both at once, so the stylesheet can pick the one the hour calls for. */
function fillVars(hex) {
  return `--sc:${hex}; --sct:${tileFill(hex, false)}; --sctd:${tileFill(hex, true)}`;
}

function tile(sub, extraClass = '') {
  const body = sub.icon
    ? `<svg class="ico" aria-hidden="true"><use href="#${sub.icon}" /></svg>`
    : esc(sub.glyph || monogram(sub.name));
  return `<span class="subject-tile ${extraClass}" style="${fillVars(sub.color)}">${body}</span>`;
}

/** When it is for, short enough for a chip. */
function dueChip(key) {
  const diff = daysFromToday(key);
  const weekday = () => keyToDate(key).toLocaleDateString(locale(), { weekday: 'long' });
  if (diff < -1) return tr('due.overdue');
  if (diff === -1) return tr('due.wasYesterday');
  if (diff === 0) return tr('due.today');
  if (diff === 1) return tr('due.tomorrow');
  if (diff <= 6) return tr('due.forDay', { day: weekday() });
  if (diff <= 13) return tr('due.nextDay', { day: weekday() });
  return tr('due.forDate',
    { date: keyToDate(key).toLocaleDateString(locale(), { day: 'numeric', month: 'short' }) });
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
                ${hw.dueDate ? esc(dueChip(hw.dueDate)) : tr('due.none')}
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
/* The desk is the homework screen's background, whether the list is full or
   empty, so it is part of the screen rather than something the empty state
   brings with it. Shown only once it has decoded: half a photograph drawn
   top-down looks like something went wrong; nothing, and then all of it,
   does not. */
function revealArt() {
  const art = $('#desk');
  if (!art) return;
  if (art.complete && art.naturalWidth) art.classList.add('is-ready');
  else art.addEventListener('load', () => art.classList.add('is-ready'), { once: true });
}

/* Nothing left to do. The screen clears to one line and one button — the +
   leaves the header and comes to sit beside the sentence, so there is only
   ever one of it — above the same desk the list sits over. */
const emptyHome = (title) => `
  <div class="empty-home">
    <h2 class="empty-home-line">
      <span>${esc(title)}</span>
      <button class="empty-add" data-act="add-first" aria-label="Add homework">
        <svg class="ico" aria-hidden="true"><use href="#i-plus" /></svg>
      </button>
    </h2>
  </div>`;


/* ── Render ────────────────────────────────────────────────── */

let currentTab = 'home';

/* What the phone is set to, if it is one of ours; English if not. */
function phoneLang() {
  const want = (navigator.languages || [navigator.language || 'en'])
    .map(x => String(x).toLowerCase().slice(0, 2));
  for (const w of want) if (LANGS.some(l => l.key === w)) return w;
  return 'en';
}

/* Put the whole app into a language: the root element says which it is and
   which way it reads, every fixed word in the markup is looked up again, and
   everything drawn from data is drawn again. Nothing is reloaded — a language
   is not a different app. */
function applyLang() {
  lang = state.settings.lang || phoneLang();
  const root = document.documentElement;
  root.setAttribute('lang', lang);
  root.setAttribute('dir', langDir(lang));

  for (const el of $$('[data-t]')) el.textContent = tr(el.dataset.t);
  for (const el of $$('[data-t-ph]')) el.setAttribute('placeholder', tr(el.dataset.tPh));
  for (const el of $$('[data-t-aria]')) el.setAttribute('aria-label', tr(el.dataset.tAria));
  document.title = tr('app.name');
}

function setLang(next) {
  if (!LANGS.some(l => l.key === next)) return;
  state.settings.lang = next;
  save();
  applyLang();
  render();
}

/* Each language names itself, so you can find your own without reading the
   one you cannot. */
const APP_VERSION = '1.0.0';

function renderAbout() {
  const v = $('#about-version');
  if (v) v.textContent = tr('set.version', { v: APP_VERSION });
  const foot = $('#about-foot');
  if (foot) foot.textContent = tr('set.version', { v: APP_VERSION });
}

/* The pages it makes sense to open on: the three you read rather than the
   two you go to on purpose. */
const START_PAGES = [
  { key: 'home', t: 'tab.home' },
  { key: 'bag', t: 'tab.bag' },
  { key: 'reminders', t: 'tab.reminders' },
];

function renderStartPick() {
  const box = $('#start-pick');
  if (!box) return;
  const on = state.settings.startOn;
  box.innerHTML = START_PAGES.map(p => `
    <button class="p-chip ${p.key === on ? 'is-on' : ''}" data-start="${p.key}"
            aria-pressed="${p.key === on}">${esc(tr(p.t))}</button>`).join('');
}

function renderLangPick() {
  const box = $('#lang-pick');
  if (!box) return;
  box.innerHTML = LANGS.map(l => `
    <button class="lang-btn ${l.key === lang ? 'is-on' : ''}" data-lang="${l.key}"
            lang="${l.key}" dir="${l.dir}" aria-pressed="${l.key === lang}">${esc(l.name)}</button>`).join('');
}

/* Homework and Subjects are two ways of asking the same question — what is
   set — so they share a page and a switch rather than two places in the bar.
   Which half is showing is not worth remembering between launches: the answer
   you want on opening the app is almost always the list. */
let homePane = 'work';

function showPane(pane) {
  homePane = pane === 'subjects' ? 'subjects' : 'work';
  const work = homePane === 'work';
  $('#home-list').hidden = !work;
  $('#subject-list').hidden = work;
  const desk = $('#desk');
  // The desk is the foot of the homework list, not of a list of subjects.
  if (desk) desk.hidden = !work;
  for (const b of $$('#home-switch [data-pane]')) {
    const on = b.dataset.pane === homePane;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-selected', String(on));
  }
  render();
}

function render() {
  renderTtButton();
  syncFab();
  if (currentTab === 'home') {
    if (homePane === 'subjects') renderSubjects(); else renderHome();
  }
  if (currentTab === 'creatures') renderCreatures();
  if (currentTab === 'bag') renderBag();
  if (currentTab === 'reminders') renderReminders();
  if (currentTab === 'profile') {
    renderProfile(); renderLangPick(); renderDeskPick(); renderAbout(); renderStartPick();
    $('#ask-toggle').checked = !!state.settings.askBeforeRemove;
    revealRoom('#set-room');
  }
  if (!$('#subject-page').hidden) renderSubjectPage(openSubjectId);
}

function renderHome() {
  const list = sortForList(activeHw());
  $('#home-count').textContent = list.length ? tr('home.left', { n: list.length }) : '';

  const box = $('#home-list');
  box.classList.add('list-hw');
  box.innerHTML = list.length
    ? list.map(hwRow).join('')
    : emptyHome(state.homework.length ? tr('home.allDone') : tr('home.none'));
  revealArt();
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

  $('#bag-sub').textContent = bagDay === today
    ? tr('bag.dayToday', { day: dayName(day.js) })
    : dayName(day.js);

  $('#bag-days').innerHTML = SCHOOL_DAYS.map((d, i) => `
    <button class="chip chip-day ${i === bagDay ? 'is-on' : ''}" data-day="${i}">
      ${esc(dayShort(i))}${i === today ? '<span class="today-dot"></span>' : ''}
    </button>`).join('');

  if (!lessonsFor(bagDay).length) {
    $('#bag-body').innerHTML =
      empty(tr('bag.noLessons'), tr('bag.nothingToPack', { day: dayName(day.js) }), { icon: 'i-tab-bag', mood: 'rest' });
    return;
  }

  // Your own notes for the day are things to put in the bag too.
  const notes = state.notes.filter(n => n.day === null || n.day === bagDay);
  const remember = notes.length ? `
    <h2 class="section-title">${tr('bag.also')}</h2>
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
  // Not on the reminders page: that corner belongs to the sticky, and the
  // timetable is nothing to do with what is pinned to the board.
  btn.hidden = currentTab === 'reminders';
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

let remScope = 'today';    // the board starts on today
let remMore = false;       // whether the rest of the week is showing

/* What is being written on the notebook page. null day means every day. */
let remDraft = null;

/** One reminder, shared by the Today and All views. */
/* ── The board ─────────────────────────────────────────────
   Reminders live pinned to a cork board, the way the drawing has them: a
   small square of coloured paper each, a pin through the top, the time
   underlined above the words.

   Paper, pin and tilt are picked from the reminder's own id rather than at
   random, so a note keeps the same look every time the page is drawn instead
   of shuffling under you on every redraw. */

/* Paper is two choices kept apart — what is printed on it, and what colour
   it was cut from — so any pattern can take any colour instead of the eight
   fixed combinations there used to be. A note that has not been given either
   falls back to its own id, which is how every note looked before there was
   anything to choose, so an existing board keeps its variety. */
const PAPER_STYLE = [
  { key: 'plain',   name: 'Plain' },
  { key: 'lined',   name: 'Lined' },
  { key: 'grid',    name: 'Grid' },
  { key: 'torn',    name: 'Torn edge' },
  { key: 'texture', name: 'Textured' },
];
const PAPER_TINT = [
  { key: 'cream',  name: 'Cream' },
  { key: 'blush',  name: 'Blush' },
  { key: 'mint',   name: 'Mint' },
  { key: 'sky',    name: 'Sky' },
  { key: 'butter', name: 'Butter' },
  { key: 'lilac',  name: 'Lilac' },
];

/* Pattern and colour are what a paper is made of; nobody wants to assemble
   one out of parts. These are the made-up papers — one tap of the arrow moves
   to the next, and the page you are writing on becomes it. The pieces above
   are still what gets stored, so a note written before there was anything to
   choose still knows what it is. */
const PAPER_LOOKS = [
  { key: 'lined-cream',  style: 'lined',   tint: 'cream'  },
  { key: 'soft-yellow',  style: 'lined',   tint: 'butter' },
  { key: 'grid',         style: 'grid',    tint: 'sky'    },
  { key: 'sticky',       style: 'plain',   tint: 'blush'  },
  { key: 'torn',         style: 'torn',    tint: 'cream'  },
  { key: 'textured',     style: 'texture', tint: 'mint'   },
];

/* Which made-up paper a note is already on, so the arrow carries on from
   there rather than starting over. */
function lookIndexOf(x) {
  const style = paperStyleOf(x);
  const tint = paperTintOf(x);
  const i = PAPER_LOOKS.findIndex(p => p.style === style && p.tint === tint);
  return i < 0 ? 0 : i;
}

/* Dress an element in a paper: the note on the board and the page you write
   on wear the same two classes, which is what keeps them the same paper. */
function wearPaper(el, look) {
  if (!el) return;
  for (const c of [...el.classList]) {
    if (c.startsWith('st-') || c.startsWith('pt-')) el.classList.remove(c);
  }
  el.classList.add('st-' + look.style, 'pt-' + look.tint);
}
const STICK_PIN = ['red', 'green', 'blue', 'yellow'];

function paperStyleOf(x) {
  if (PAPER_STYLE.some(p => p.key === x.style)) return x.style;
  return PAPER_STYLE[idHash(x.id + ':style') % PAPER_STYLE.length].key;
}
function paperTintOf(x) {
  if (PAPER_TINT.some(p => p.key === x.tint)) return x.tint;
  return PAPER_TINT[idHash(x.id + ':tint') % PAPER_TINT.length].key;
}

/* Where a note goes if it has never been moved. Positions are percentages of
   the board rather than pixels, so a note stays where it was put when the
   board changes size. Three across and four down fills the cork; past that
   they stack with a small offset, the way a real board runs out of room. */
const SLOT_X = [4, 36, 68];
const SLOT_Y = [3, 25, 47, 69];
function slotPos(i) {
  const per = SLOT_X.length * SLOT_Y.length;
  const wrap = Math.floor(i / per);
  return {
    x: SLOT_X[i % SLOT_X.length] + wrap * 2.5,
    y: SLOT_Y[Math.floor(i / SLOT_X.length) % SLOT_Y.length] + wrap * 2.5,
  };
}
function posOf(x, slot) {
  const p = x.pos;
  return p && typeof p.x === 'number' && typeof p.y === 'number' ? p : slot;
}

/* A small, stable number from a string, mixed rather than merely scaled: ids
   one character apart have to land far apart, or a board of eight notes comes
   out in three colours. */
function idHash(id) {
  let h = 0x811c9dc5;
  const s = String(id);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 15;
  h = Math.imul(h, 0x2545f491);
  h ^= h >>> 13;
  return (h >>> 0) % 100003;
}

function stickyNote(x, slot) {
  const style = paperStyleOf(x);
  const tint = paperTintOf(x);
  const pin = STICK_PIN[idHash(x.id + ':pin') % STICK_PIN.length];
  const tilt = (idHash(x.id + ':tilt') % 9) - 4;   // -4 to +4 degrees
  const sub = x.lesson ? subjectForLesson(x.lesson) : null;
  const at = posOf(x, slot);

  return `
    <button class="stick st-${style} pt-${tint}" data-note="${x.id}"
           style="--tilt:${tilt}deg; left:${at.x.toFixed(2)}%; top:${at.y.toFixed(2)}%${
             sub ? `; --sc:${sub.color}` : ''}"
           aria-label="${esc(x.text)}, ${esc(sub ? sub.name : 'no lesson')}. Tap to take down.">
      <span class="pin pin-${pin}" aria-hidden="true"></span>
      ${x.at ? `<span class="stick-at">${esc(shortTime(x.at))}</span>` : ''}
      <span class="stick-text">${esc(x.text)}</span>
      ${x.note ? `<span class="stick-note">${esc(x.note)}</span>` : ''}
      ${sub ? `<span class="stick-subject">${esc(sub.name)}</span>` : ''}
    </button>`;
}

/* The drawing writes eight o'clock as 8:00, not 08:00. */
function shortTime(at) {
  return String(at).replace(/^0/, '');
}

/* The tabs across the top: today, tomorrow, then the school days neither of
   those covers, and everything at the end. A reminder set for every day shows
   on all of them, because that is what every day means. */
function dayTabs() {
  const today = schoolDayIndex();
  const t = new Date();
  t.setDate(t.getDate() + 1);
  const tomorrow = schoolDayIndex(t);

  const tabs = [{ key: 'today', label: tr('due.todayShort'), day: today }];
  tabs.push({ key: 'tomorrow', label: tr('due.tomorrowShort'), day: tomorrow });

  // The rest of the week, starting from the day after tomorrow and wrapping,
  // so the two the drawing shows are the two that come next.
  const rest = [];
  for (let n = 1; n <= SCHOOL_DAYS.length; n++) {
    const i = ((tomorrow < 0 ? 0 : tomorrow) + n) % SCHOOL_DAYS.length;
    if (i === today || i === tomorrow) continue;
    rest.push({ key: String(i), label: dayName(i), short: dayShort(i), day: i });
  }
  rest.push({ key: 'all', label: tr('rem.all'), day: null });

  // Today, tomorrow and the two days after them, which is the shape the
  // drawing has; More opens the rest of the week and All.
  return remMore ? tabs.concat(rest) : tabs.concat(rest.slice(0, 2));
}

/* Drop day tabs off the end until the row fits. Today, tomorrow and More
   always stay: they are what the row is for. */
function trimTabs() {
  const row = $('#rem-scope');
  if (!row || remMore) return;
  const fits = () => row.scrollWidth <= row.clientWidth + 1;
  if (fits()) return;

  // Days keep their full names. Shortening some of them and not others left
  // the row reading Today, Tomorrow, Tue, Wed — two naming systems in five
  // words. A day that will not fit is dropped instead, and More still has it.
  for (let guard = 0; guard < 12; guard++) {
    if (fits()) return;
    const droppable = [...row.querySelectorAll('[data-scope]')].slice(2);
    const last = droppable[droppable.length - 1];
    if (!last) return;
    last.remove();
  }
}

/** Which reminders belong on a given tab. */
function notesFor(tab) {
  if (tab.key === 'all') return state.notes;
  // Not a school day: only the ones set for every day are due.
  if (tab.day < 0) return state.notes.filter(n => n.day === null);
  return state.notes.filter(n => n.day === null || n.day === tab.day);
}

/* The room shows only once it has arrived. Half a photograph drawn top-down
   looks like something went wrong; nothing, and then all of it, does not. */
function revealRoom(...extra) {
  for (const sel of ['#wall', '#shelf', ...extra]) {
    const img = document.querySelector(sel);
    if (!img) continue;
    if (img.complete && img.naturalWidth) img.classList.add('is-ready');
    else img.addEventListener('load', () => img.classList.add('is-ready'), { once: true });
  }
}

function renderReminders() {
  revealRoom();
  const tabs = dayTabs();
  let tab = tabs.find(t => t.key === remScope) || tabs[0];
  remScope = tab.key;

  $('#rem-scope').classList.toggle('is-open', remMore);
  $('#rem-scope').innerHTML = tabs.map(t =>
    `<button class="daytab ${t.key === tab.key ? 'is-on' : ''}" data-scope="${t.key}"`
    + (t.short ? ` data-short="${esc(t.short)}"` : '') + '>'
    + esc(t.label) + '</button>').join('')
    + `<button class="daytab daytab-more" data-more="1">
        ${remMore ? tr('rem.less') : tr('rem.more')}
        <svg class="ico" aria-hidden="true"><use href="#i-chevron" /></svg>
      </button>`;
  trimTabs();

  const mine = notesFor(tab).slice().sort(byTime);
  const board = $('#rem-board');

  // An empty board says so in the middle of itself, and the whole of it is
  // the way in — a board you have to aim at is worse than one you can tap.
  if (!mine.length) {
    const first = !state.notes.length;
    board.innerHTML = `
      <button class="board-empty" data-act="first-reminder">
        <span class="board-empty-line">${first
          ? tr('rem.empty')
          : tr('rem.nothingFor', { day: esc(tab.label.toLowerCase()) })}</span>
        <span class="board-empty-sub">${tr('rem.emptySub')}</span>
      </button>`;
    return;
  }

  // Notes that have been moved keep where they were put; the rest fall into
  // the next free slot, so a board nobody has arranged still reads in order.
  let slot = 0;
  board.innerHTML = mine
    .map(n => stickyNote(n, n.pos ? null : slotPos(slot++)))
    .join('');
}

/* Earliest first, and anything without a time after everything with one —
   a note that says when it is wanted is more use at the top of the board. */
function byTime(a, b) {
  const ta = a.at || null, tb = b.at || null;
  if (ta && tb) return ta < tb ? -1 : ta > tb ? 1 : a.createdAt - b.createdAt;
  if (ta) return -1;
  if (tb) return 1;
  return a.createdAt - b.createdAt;
}

function openRemSheet() {
  remDraft = { text: '', note: '', day: schoolDayIndex(), lesson: null, look: 0,
               style: PAPER_LOOKS[0].style, tint: PAPER_LOOKS[0].tint };
  if (remDraft.day < 0) remDraft.day = null;

  $('#rem-title').value = '';
  $('#rem-note').value = '';
  $('#rem-at').value = '';
  drawRemSheet();
  showSheet('#sheet-rem');

  // Focus inside the gesture, so the keyboard actually opens on a phone.
  $('#rem-title').focus();
}

function drawRemSheet() {
  if (!remDraft) return;

  $('#rem-sheet-days').innerHTML = `
    ${SCHOOL_DAYS.map((d, i) => `
      <button class="p-chip ${remDraft.day === i ? 'is-on' : ''}" data-remday="${i}">${esc(dayShort(i))}</button>`).join('')}
    <button class="p-chip ${remDraft.day === null ? 'is-on' : ''}" data-remday="all">${tr('rem.everyDay')}</button>`;

  // A lesson can only be chosen once a particular day is.
  const lessons = remDraft.day === null ? [] : lessonsFor(remDraft.day);
  $('#rem-sheet-lesson').hidden = !lessons.length;
  $('#rem-sheet-lessons').innerHTML = lessons.length ? `
    <button class="p-chip ${remDraft.lesson === null ? 'is-on' : ''}" data-remlesson="">${tr('rem.wholeDay')}</button>
    ${lessons.map(l => {
      const sub = subjectForLesson(l.name);
      return `<button class="p-chip ${remDraft.lesson === l.name ? 'is-on' : ''}"
        data-remlesson="${esc(l.name)}" style="--sc:${sub ? sub.color : 'var(--ink-3)'}">
        ${esc(shortName(l.name))}</button>`;
    }).join('')}` : '';

  drawRemPaper();

  $('#rem-save').disabled = !$('#rem-title').value.trim();
}

/* The page you are writing on becomes the paper you picked — not a swatch of
   it beside a page that stays the same. There is one control, an arrow, and
   it moves to the next made-up paper. */
function drawRemPaper() {
  if (!remDraft) return;
  const look = PAPER_LOOKS[remDraft.look % PAPER_LOOKS.length];
  remDraft.style = look.style;
  remDraft.tint = look.tint;
  wearPaper($('#sheet-rem'), look);
  const name = $('#rem-flip-name');
  if (name) name.textContent = tr('paper.' + look.key);
}

function flipRemPaper() {
  if (!remDraft) return;
  remDraft.look = (remDraft.look + 1) % PAPER_LOOKS.length;
  drawRemPaper();
}

/* A note comes off the board with one tap, because the drawing gives it no
   cross to press and a board covered in crosses is not the drawing. The tap
   is undoable for as long as the toast is up, which is the same bargain the
   homework list makes when something is ticked off. */
/* A note can be picked up and put down anywhere on the cork, and it stays
   where it was left. Percentages rather than pixels, so turning the phone or
   opening it on a bigger screen does not scatter the board.

   The three things a finger can mean are told apart by what it does: a press
   that goes nowhere and lifts is a tap, which takes the note down; a press
   that moves more than 8px is a drag; a press that stays still for half a
   second is a hold, which opens the note's paper. Eight pixels is small
   enough that dragging feels immediate and large enough that a tap on a
   moving bus is still a tap. */
function wireBoard() {
  const board = $('#rem-board');
  if (!board) return;

  let drag = null;
  let hold = null;
  const stopHold = () => { clearTimeout(hold); hold = null; };
  const drop = (el) => { if (el) el.classList.remove('is-lifted'); };

  board.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('[data-note]');
    if (!el || e.button > 0) return;
    const b = board.getBoundingClientRect();
    const n = el.getBoundingClientRect();
    drag = {
      el, id: el.dataset.note, b,
      dx: e.clientX - n.left, dy: e.clientY - n.top,
      x0: e.clientX, y0: e.clientY,
      w: n.width, h: n.height,
      // A note sits at a few degrees, so what you see is a little wider and
      // taller than what left and top actually place. Keeping the turned
      // corners on the cork means allowing for the difference.
      ox: (n.width - el.offsetWidth) / 2,
      oy: (n.height - el.offsetHeight) / 2,
      moved: false, x: null, y: null,
    };
    // Keeps the moves coming to this note even when the finger outruns it.
    try { el.setPointerCapture(e.pointerId); } catch { /* not supported */ }
    hold = setTimeout(() => {
      stopHold();
      if (!drag || drag.moved) return;
      const id = drag.id;
      drop(drag.el);
      drag = null;
      flipNotePaper(id);
    }, 480);
  });

  board.addEventListener('pointermove', (e) => {
    if (!drag) return;
    if (!drag.moved) {
      if (Math.abs(e.clientX - drag.x0) + Math.abs(e.clientY - drag.y0) < 8) return;
      drag.moved = true;
      stopHold();
      drag.el.classList.add('is-lifted');
    }
    e.preventDefault();
    // Clamp what is seen — the turned box — then step back in to what gets
    // written, so no corner of a note can pass the edge of the cork.
    const along = (seen, size, whole, back) =>
      (Math.max(0, Math.min(whole - size, seen)) + back) / whole * 100;
    drag.x = along(e.clientX - drag.dx - drag.b.left, drag.w, drag.b.width, drag.ox);
    drag.y = along(e.clientY - drag.dy - drag.b.top, drag.h, drag.b.height, drag.oy);
    drag.el.style.left = drag.x.toFixed(2) + '%';
    drag.el.style.top = drag.y.toFixed(2) + '%';
  });

  board.addEventListener('pointerup', () => {
    stopHold();
    if (!drag) return;
    const { el, id, moved, x, y } = drag;
    drag = null;
    drop(el);
    if (!moved) { takeDown(id); return; }
    const note = state.notes.find(n => n.id === id);
    if (note && x !== null) { note.pos = { x, y }; save(); }
  });

  board.addEventListener('pointercancel', () => {
    stopHold();
    if (!drag) return;
    drop(drag.el);
    drag = null;
  });
}

function takeDown(id) {
  const i = state.notes.findIndex(n => n.id === id);
  if (i < 0) return;
  // One tap is quick and undoable, which is the bargain the board makes. For
  // anyone who would rather be asked, the question goes in the way instead.
  if (state.settings.askBeforeRemove) {
    const note = state.notes[i];
    if (!confirm(tr('set.remove') + '\n\n' + note.text)) return;
  }
  const [gone] = state.notes.splice(i, 1);
  save();
  renderReminders();
  showToast(tr('rem.taken'), () => {
    state.notes.splice(i, 0, gone);
    save();
    renderReminders();
    hideToast();
  });
}

/* Hold a note that is already up and it turns over to the next paper where it
   lies. It used to open a sheet of its own with two rows of swatches in it,
   which is a settings panel for one square of paper. There is no button for
   this on the note either: a note the size of a stamp has no room for one,
   and a board is meant to be handled rather than operated. */
function flipNotePaper(id) {
  const note = state.notes.find(n => n.id === id);
  if (!note) return;
  const look = PAPER_LOOKS[(lookIndexOf(note) + 1) % PAPER_LOOKS.length];
  note.style = look.style;
  note.tint = look.tint;
  save();
  renderReminders();
}

function saveReminder() {
  if (!remDraft) return;
  const text = $('#rem-title').value.trim();
  if (!text) { $('#rem-title').focus(); return; }

  state.notes.push({
    id: uid(), text,
    note: $('#rem-note').value.trim(),
    at: $('#rem-at').value || '',
    day: remDraft.day, lesson: remDraft.lesson,
    style: remDraft.style, tint: remDraft.tint,
    createdAt: Date.now(),
  });
  save();
  remDraft = null;
  closeSheet();
  renderReminders();
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
                <span class="tt-day">${esc(dayShort(d.js))}</span>
                <span class="tt-day-he">${esc(lang === 'he' ? d.en : d.he)}</span>
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
                return `<td class="${i === today ? 'is-today' : ''}"
                            style="${sub ? fillVars(sub.color) : '--sc:var(--ink-2)'}"
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
        <span class="subject-row-count">${n ? tr('sub.count', { n }) : ''}</span>
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
      <h2 class="section-title" style="margin-top:0">${tr('hw.title')}</h2>
      <div class="list list-hw">${open.map(hwRow).join('')}</div>
    ` : empty(tr('hw.nothingFor', { name: sub.name }), tr('hw.enjoy'), { mood: 'done' })}
    ${done.length ? `
      <h2 class="section-title">${tr('hw.completed')}</h2>
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

/* The book, the eggs and the count, which used to be a section of Settings
   and are now the whole of their own page. */
function renderCreatures() {
  renderCollection();
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
    <span class="level-pic" aria-hidden="true">
      <img src="art/set/sprout.webp" alt="" width="300" height="266" decoding="async" />
    </span>
    <div class="level-main">
    <div class="level-top">
      <span class="level-name">${tr('lvl.level', { n: level })}</span>
      <span class="level-xp">${allFound ? tr('book.allFound') : tr('lvl.xp', { into, of: XP_PER_LEVEL })}</span>
    </div>
    <div class="bar"><div class="bar-fill" style="width:${allFound ? 100 : (into / XP_PER_LEVEL) * 100}%"></div></div>
    <p class="level-chapter">${here ? tr('book.withYou', { name: esc(here.name) }) : tr('set.firstCreature')}</p>
    ${allFound || xp > 0
      ? `<p class="level-note">${allFound ? tr('book.allFifty')
          : tr('lvl.untilEgg', { n: XP_PER_LEVEL - into })}</p>` : ''}
    </div>`;

  // History, newest first, grouped by the day it was finished.
  const done = state.homework
    .filter(h => h.completed && h.completedAt)
    .sort((a, b) => b.completedAt - a.completedAt)
    .slice(0, 60);

  const box = $('#history-list');
  if (!done.length) {
    box.innerHTML = `<p class="foot-note">${tr('hw.nothingFinished')}</p>`;
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
      ? tr('book.allFoundOf', { n: MONSTER_COUNT })
      : tr('book.countFound', { have: have.length, all: MONSTER_COUNT });
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
          <span class="mon-rank is-${m.rarity}">${esc(tr('rarity.' + m.rarity))}</span>
        </button>`).join('')
    : ('<span class="mon-slot is-empty" aria-hidden="true">'
       + '<img class="slot-egg" src="art/set/egg.webp" alt="" width="280" height="270" decoding="async" />'
       + '</span>').repeat(5);

  const note = $('#collection-note');
  if (note) {
    const left = MONSTER_COUNT - have.length;
    note.textContent = !have.length
      ? tr('book.allOut', { n: MONSTER_COUNT })
      : left
        ? tr('book.stillOut', { n: left })
        : tr('book.everyone');
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
    ? new Date(met).toLocaleDateString(locale(), { day: 'numeric', month: 'long' })
    : 'a while ago';
  const rank = rarityOf(m.rarity);
  return `
    <div class="page page-l" style="--mc:${m.colour}">
      <div class="portrait">${monsterSvg(m)}</div>
      <h2 class="page-name">${esc(m.name)}</h2>
      <p class="page-rank is-${m.rarity}">${esc(tr('rarity.' + m.rarity))}</p>
      <dl class="page-facts">
        <div><dt>Age</dt><dd>${esc(m.age)}</dd></div>
        <div><dt>${tr('book.size')}</dt><dd>${esc(m.size)}</dd></div>
        <div><dt>${tr('book.hobbies')}</dt><dd>${m.hobbies.map(esc).join(', ')}</dd></div>
        <div><dt>${tr('book.found')}</dt><dd>${esc(found)}</dd></div>
      </dl>
      <div class="page-egg">
        ${eggSvg(m)}
        <span>came out of this</span>
      </div>
    </div>
    <div class="page page-r">
      <dl class="page-facts">
        <div><dt>${tr('book.lives')}</dt><dd>${esc(m.lives)}</dd></div>
        <div><dt>${tr('book.eats')}</dt><dd>${esc(m.eats)}</dd></div>
        <div><dt>${tr('book.says')}</dt><dd>${esc(m.says)}</dd></div>
        <div><dt>${tr('book.best')}</dt><dd>${esc(m.best)}</dd></div>
        <div><dt>${tr('book.worst')}</dt><dd>${esc(m.worst)}</dd></div>
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
      <p class="page-hint">${tr('book.everyEgg')}</p>
    </div>
    <div class="page page-r is-waiting">
      <p class="page-wait">${tr('book.nextEgg')}</p>
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
      <p class="ar-kicker is-${m.rarity}">${esc(tr('rarity.' + m.rarity))}</p>
      <div class="hatch" style="--mc:${m.colour}; --shell:${m.shell}">
        <span class="hatch-glow"></span>
        <div class="hatch-mon">${monsterSvg(m)}</div>
        <div class="hatch-egg">${eggSvg(m, { split: true })}</div>
        <span class="hatch-shards">${'<i></i>'.repeat(8)}</span>
      </div>
      <h2 class="ar-name">${esc(m.name)} hatched</h2>
      <p class="ar-level">Level ${fromLevel} → ${fromLevel + 1}</p>
      <p class="ar-line">${esc(m.age)} · ${esc(m.hobbies[0].toLowerCase())}</p>
      <button class="ar-continue btn-primary">${tr('book.hello')}</button>
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
  // A cleared screen carries its own + beside the line, so the header one
  // steps aside and there is only ever one of them.
  const cleared = currentTab === 'home' && !activeHw().length;
  $('#fab').hidden = !belongs || cleared;
}

/* What the browser paints behind the status bar. Every screen but this one
   stands on flat paper; this one stands on a photograph of a wall, whose top
   band is a shade deeper. Matching it is the difference between the top of
   the screen being part of the page and being a strip above it. */
const TOP_PAPER = '#F4EEE1';
const TOP_WALL  = '#F0E3D6';   // measured off the top of art/wall.jpg
const TOP_NIGHT = '#13171C';

/* The colour the browser paints around the clock. A desk that has been chosen
   outranks what the phone is set to — picking Night on a phone in daylight
   has to darken the top of the screen too, or the app sits in a bright frame. */
const TOP_DESK = { sage: '#EDEFE3', sky: '#E9EEF4' };

function syncTopColour() {
  const meta = $('#top-colour');
  if (!meta) return;
  const asked = document.documentElement.getAttribute('data-theme');
  const dark = asked ? asked === 'dark'
                     : matchMedia('(prefers-color-scheme: dark)').matches;
  if (dark) { meta.setAttribute('content', TOP_NIGHT); return; }
  if (currentTab === 'reminders') { meta.setAttribute('content', TOP_WALL); return; }
  meta.setAttribute('content', TOP_DESK[state.settings.desk] || TOP_PAPER);
}

function showTab(tab) {
  currentTab = tab;
  syncTopColour();
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
      ${esc(s.name)}
    </button>`).join('');

  const soon = [
    { key: addDays(0), label: tr('due.todayShort') },
    { key: addDays(1), label: tr('due.tomorrowShort') },
    { key: addDays(2), label: keyToDate(addDays(2)).toLocaleDateString(locale(), { weekday: 'short' }) },
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
      <span>${tr('due.pick')}</span>
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

  showToast(tr('hw.done', { n: XP_PER_HOMEWORK }), () => undoComplete(id));
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
        : tr('book.allFifty'); })()}</p>
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
          why: tr('notif.homeScreen'),
          how: tr('notif.howTo') }
      : { ok: false,
          why: tr('notif.noSupport'),
          how: tr('notif.install') };
  }
  if (Notification.permission === 'denied') {
    return { ok: false,
             why: tr('notif.off'),
             how: tr('notif.turnBack') };
  }
  return { ok: true, why: '', how: '' };
}

function reminderNote() {
  // Why they can't be used is said on the card itself, not down here.
  if (!reminderAvailability().ok) return '';
  if (state.settings.dailyReminderEnabled || state.settings.bagReminderEnabled) {
    return tr('notif.addHome');
  }
  return tr('notif.optional');
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
  notify(tr('notif.anyHomework'),
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
  notify(tr('bag.packFor', { day: dayName(day.js) }), parts.join(' — ') || tr('tt.nothing'));
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
  on('#rem-new', 'click', openRemSheet);
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

  // The notebook page
  on('#rem-cancel', 'click', closeSheet);
  on('#rem-save', 'click', saveReminder);
  on('#rem-title', 'input', drawRemSheet);
  on('#rem-title', 'keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); $('#rem-note').focus(); }
  });
  on('#rem-note', 'keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); saveReminder(); }
  });

  on('#rem-sheet-days', 'click', (e) => {
    const chip = e.target.closest('[data-remday]');
    if (!chip || !remDraft) return;
    remDraft.day = chip.dataset.remday === 'all' ? null : Number(chip.dataset.remday);
    remDraft.lesson = null;           // lessons differ from day to day
    drawRemSheet();
  });

  on('#rem-sheet-lessons', 'click', (e) => {
    const chip = e.target.closest('[data-remlesson]');
    if (!chip || !remDraft) return;
    remDraft.lesson = chip.dataset.remlesson || null;
    drawRemSheet();
  });

  wireBoard();

  on('#rem-board', 'click', (e) => {
    if (e.target.closest('[data-act="first-reminder"]')) { openRemSheet(); return; }
    // A keyboard has no pointer to drag with, so Enter or Space on a note
    // still takes it down. A real click arrives with detail 1 and has already
    // been dealt with by the pointer that made it.
    if (e.detail !== 0) return;
    const note = e.target.closest('[data-note]');
    if (note) takeDown(note.dataset.note);
  });

  on('#rem-flip', 'click', flipRemPaper);

  on('#home-switch', 'click', (e) => {
    const btn = e.target.closest('[data-pane]');
    if (btn) showPane(btn.dataset.pane);
  });

  on('#start-pick', 'click', (e) => {
    const btn = e.target.closest('[data-start]');
    if (!btn) return;
    state.settings.startOn = btn.dataset.start;
    save();
    renderStartPick();
  });

  on('#ask-toggle', 'change', (e) => {
    state.settings.askBeforeRemove = e.target.checked;
    save();
  });

  on('#lang-pick', 'click', (e) => {
    const btn = e.target.closest('[data-lang]');
    if (btn) setLang(btn.dataset.lang);
  });

  on('#desk-pick', 'click', (e) => {
    const btn = e.target.closest('[data-desk]');
    if (btn) setDesk(btn.dataset.desk);
  });

  on('#about-open', 'click', () => { renderAbout(); showSheet('#sheet-about'); });
  on('#about-done', 'click', closeSheet);

  on('#rem-scope', 'click', (e) => {
    if (e.target.closest('[data-more]')) {
      remMore = !remMore;
      renderReminders();
      return;
    }
    const tab = e.target.closest('[data-scope]');
    if (!tab) return;
    remScope = tab.dataset.scope;
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

/* Installing puts the manifest's start_url on the Home Screen, so each link
   needs a manifest of its own or both would install as the same app and open
   the same timetable. The tag is pointed at the right one before anybody can
   ask to install. */
function pointAtManifest() {
  const link = document.querySelector('link[rel="manifest"]');
  if (link) link.setAttribute('href', `m/${PROFILE.id}.webmanifest`);
  const title = document.querySelector('meta[name="apple-mobile-web-app-title"]');
  if (title) title.setAttribute('content', PROFILE.appName);
}

function boot() {
  pointAtManifest();
  load();
  saveLocal();      // write the migrated shape back, without bumping the sync clock
  applyDesk();      // the colour of the place, before it is painted once
  applyLang();      // before anything is drawn, so nothing is drawn twice
  wireApp();

  $('#main').hidden = false;
  // The page asked for, unless something else is being opened on purpose.
  showTab(START_PAGES.some(p => p.key === state.settings.startOn)
    ? state.settings.startOn : 'home');

  scheduleReminder();

  // Opened from the notification or the home-screen shortcut.
  if (new URLSearchParams(location.search).get('add') === '1') {
    setTimeout(() => openHwSheet(), 300);
    history.replaceState(null, '', location.pathname);
  }

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncTopColour);

  // Dates drift while the app sits open; refresh when it comes back.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') { render(); scheduleReminder(); }
  });

  connectSync();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    // The profile goes in the worker's own URL so it keeps its own cache
    // and its own bag pictures.
    navigator.serviceWorker.register('sw.js?p=' + PROFILE.id)
      .catch(() => { /* offline support is a bonus */ });
    navigator.serviceWorker.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'add-homework') openHwSheet();
    });
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

})();
