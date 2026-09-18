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
/* ── Where you are ─────────────────────────────────────────
   The country is not decoration. Three things follow from it and nothing
   else does: which days are school days, whether the clock runs to 24 hours
   or to am/pm, and which locale writes the dates. Israel's school week opens
   on Sunday and ends on Thursday; most of the rest open on Monday.
   'start' is the weekday the week opens on and 'days' is how many it has, so
   the week is built rather than listed. A country whose school week is not
   five days in a row is not here, and adding one is a row in this list
   rather than a change anywhere else. */
const COUNTRIES = [
  { key: 'il', locale: 'he-IL', start: 0, days: 5, clock24: true },
  { key: 'gb', locale: 'en-GB', start: 1, days: 5, clock24: true },
  { key: 'us', locale: 'en-US', start: 1, days: 5, clock24: false },
  { key: 'ca', locale: 'en-CA', start: 1, days: 5, clock24: false },
  { key: 'au', locale: 'en-AU', start: 1, days: 5, clock24: false },
  { key: 'fr', locale: 'fr-FR', start: 1, days: 5, clock24: true },
  { key: 'de', locale: 'de-DE', start: 1, days: 5, clock24: true },
  { key: 'in', locale: 'en-IN', start: 1, days: 5, clock24: false },
];
/** The chosen country, or the one the app was built for. */
function country() {
  return COUNTRIES.find(c => c.key === state.settings.country) || COUNTRIES[0];
}
/* Weekday names come from the browser rather than from a list here: it knows
   them in every language the app might be set to, and the app only has to say
   which day it means. 7 January 2024 was a Sunday, so that week is the ruler. */
function weekdayName(js, style = 'long') {
  try {
    return new Intl.DateTimeFormat(locale(), { weekday: style, timeZone: 'UTC' })
      .format(new Date(Date.UTC(2024, 0, 7 + js)));
  } catch {
    const full = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
                  'Thursday', 'Friday', 'Saturday'][js] || '';
    return style === 'short' ? full.slice(0, 3) : full;
  }
}
/** The school week: which days, in the order the country keeps them. */
function schoolDays() {
  const c = country();
  return Array.from({ length: c.days }, (_, i) => ({ js: (c.start + i) % 7 }));
}
/** A time of day written the way the country writes it. */
function clockLabel(hhmm) {
  const [h, m] = String(hhmm).split(':').map(Number);
  if (country().clock24 || !Number.isFinite(h)) return hhmm;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
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
     'pro.reminder': 'Reminder',
    'pro.daily': 'Daily reminder',
    'pro.dailyNote': 'A nudge to write down today’s homework.',
    'pro.pack': 'Pack your bag',
    'pro.packNote': 'Tomorrow’s lessons and reminders, the evening before.',
    'pro.time': 'Time', 'pro.language': 'Language',

    'set.title': 'Settings',
    'set.sub': 'Personalize your study space and reminders.',
    'set.book': 'Creature book',
    'set.collect': 'Collect them all!',
    'set.reminders': 'Reminders',
    'set.appearance': 'Appearance',
    'set.deskNote': 'Choose a look for your study space.',
    'set.about': 'About',
    'set.help': 'Help & About',
    'set.version': 'App version {v}',
    'set.firstCreature': 'Your first creature is on the way.',

    'about.what': 'What this is',
    'about.whatNote': 'Everything you have to do, in one place. Write homework down as it is set, tick it off when it is done, and the bag packs itself from the timetable.',
    'about.install': 'On your phone',
    'about.installNote': 'Share, then Add to Home Screen. Opened from there it fills the screen and can send you reminders; in a browser tab it cannot.',
    'about.data': 'Your work',
    'about.dataNote': 'Everything stays on this phone. Nothing is sent anywhere and there is nothing to sign in to.',
    'about.done': 'Done',

    'tab.creatures': 'Creatures',
    'cre.title': 'Creatures',
    'cre.sub': 'Meet every creature you discover.',
    'cre.book': 'The book',
    'cre.found': 'Found so far',
    'cre.all': 'All creatures',
    'cre.search': 'Search creatures',
    'cre.searchPh': 'Name or number',
    'cre.fAll': 'All', 'cre.fFound': 'Discovered', 'cre.fLocked': 'Locked',
    'cre.progress': '{have} / {all}',
    'cre.discovered': 'discovered',
    'cre.noMatch': 'Nobody by that name yet.',
    'cre.noneFound': 'Nobody found yet. Finish some homework and the first egg will turn up.',
    'cre.noneLocked': 'Nobody left to find. You have all fifty.',
    'cre.number': '#{n}',
    'cre.creature': 'Creature #{n}',
    'cre.locked': 'Not found yet',
    'cre.lockedNote': 'Finish homework to hatch eggs. Whoever is inside is whoever the roll gives you.',

    'cmp.yours': 'Your companion',
    'cmp.mine': 'My companion',
    'cmp.none': 'No companion yet',
    'cmp.noneSub': 'Find a creature and one of them can keep you company.',
    'cmp.noneCta': 'Find your first',
    'cmp.pick': 'Choose one',
    'cmp.view': 'View',
    'cmp.change': 'Change',
    'cmp.make': 'Make companion',
    'cmp.current': 'Your companion',
    'cmp.title': 'Choose a companion',
    'cmp.sub': 'Your companion sits on your profile, and gets the credit for what you finish.',
    'cmp.preview': 'Preview',
    'cmp.discovered': 'Discovered creatures',
    'cmp.set': 'Set {name} as companion',
    'cmp.pillTag': '{name} • Companion',
    'cmp.tasks': '{n} tasks together',
    'cmp.tasks1': '1 task together',
    'cmp.tasks0': 'Nothing together yet',
    'cmp.swapped': '{name} is with you now',

    'cre.about': 'About',
    'cre.story': 'Where it came from',
    'cre.share': 'Share',
    'cre.shareText': '{name} turned up in my homework book.',
    'cre.fav': 'Favourite',
    'cre.unfav': 'Remove from favourites',
    'cre.statFound': 'Found',
    'cre.statTasks': 'Tasks together',
    'cre.statLives': 'Favourite place',
    'cre.today': 'Today',
    'cre.memories': 'Memories',
    'cre.memoriesNote': 'Finish homework with {name} to make memories.',
    'cre.memoriesSome': 'The last thing you finished together.',

    'pro.you': 'Profile',
    'pro.yourStory': 'Your journey, your creatures, your story.',
    'pro.sTasks': 'Tasks', 'pro.sCreatures': 'Creatures', 'pro.sStreak': 'Day streak',

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
    'notif.anyBody': 'You have {n} left. Anything new today?',
    'notif.anyBodyNone': 'Add today’s homework while it’s fresh.',
    'notif.finish': 'Still {n} to finish',
    'notif.finishBody': 'There is time. Pick the quickest one.',
    'set.reminders': 'Reminders',
    'set.general': 'General',
    'set.history': 'History',
    'pro.add': 'Add homework',
    'pro.addNote': 'A nudge to write today’s homework down.',
    'pro.pack': 'Pack your bag',
    'pro.packNote': 'Tomorrow’s lessons and reminders, the evening before.',
    'pro.finish': 'Finish homework',
    'pro.finishNote': 'Only when something is still unfinished.',
    'pro.country': 'Country',
    'pro.countryNote': 'Sets the school week, the dates and the clock.',
    'pro.editTt': 'Edit timetable',
    'pro.editTtNote': 'Add, change or take out a lesson.',
    'pro.done': 'Completed homework',
    'pro.doneNote': 'Everything you have finished.',
    'set.theme': 'Appearance',
    'set.themeNote': 'Light, dark, or whatever your phone is set to.',
    'theme.light': 'Light', 'theme.dark': 'Dark', 'theme.system': 'System',
    'country.il': 'Israel', 'country.gb': 'United Kingdom',
    'country.us': 'United States', 'country.ca': 'Canada',
    'country.au': 'Australia', 'country.fr': 'France',
    'country.de': 'Germany', 'country.in': 'India',
    'setup.weekTitle': 'What does your week look like?',
    'photo.take': 'Take a photo',
    'photo.read': 'Read it',
    'photo.reading': 'Reading it… {n}%',
    'photo.readOk': 'Read {n} periods. Check them.',
    'photo.readNone': 'Could not find a grid in that. Fill it in below, or try a straighter photo.',
    'photo.readFail': 'Could not read it this time. Fill it in below.',
    'photo.readOffline': 'Reading a photo needs a connection the first time. Fill it in below, or try again later.',
    'photo.pick': 'From your photos',
    'setup.weekNote': 'Photograph your timetable and tap Read it, and the app will fill the grid in for you to check. You can also skip this and fill it in yourself.',
    'setup.checkTitle': 'Is this right?',
    'setup.checkNote': 'Change anything that is wrong. Leave a box empty for a free period.',
    'setup.kitTitle': 'What do you need?',
    'setup.kitNote': 'This is the app’s guess for each lesson. Tap anything to add or remove it.',
    'setup.everyDay': 'Every day',
    'setup.more': 'More', 'setup.fewer': 'Fewer',
    'photo.note': 'Take a picture of your timetable and the app will read it for you. You check what it read before anything is saved, and the photo stays on your phone.',
    'photo.alt': 'Your timetable',
    'photo.caption': 'Tap it to see it bigger.',
    'photo.open': 'See the photo bigger',
    'photo.remove': 'Remove',
    'photo.bad': 'That did not look like a picture.',
    'photo.noRoom': 'No room to keep that photo. Try a smaller one.',
    'setup.nothing': 'Nothing for this one',
    'setup.noLessons': 'No lessons yet. Go back and fill in a few.',
    'setup.next': 'Next', 'setup.back': 'Back', 'setup.finish': 'Finish',
    'setup.ready': 'All set. Your week is in.',

    'kit.pencil': 'Pencil case', 'kit.pen': 'Pen', 'kit.notebook': 'Notebook',
    'kit.books': 'Books', 'kit.bottle': 'Water bottle', 'kit.lunch': 'Lunch box',
    'kit.laptop': 'Laptop', 'kit.ipad': 'Tablet', 'kit.charger': 'Charger',
    'kit.airpods': 'Earphones', 'kit.case': 'Pencil bag', 'kit.shoes': 'Sports shoes',
    'kit.sportkit': 'Sports kit', 'kit.deo': 'Deodorant', 'kit.tanach': 'Bible',
    'kit.lit': 'Literature book', 'kit.eng': 'English book', 'kit.diplomacy': 'Diplomacy book',

    'tt.edit': 'Edit timetable',
    'tt.editNote': 'Tap a lesson to change it. Leave it empty for a free period.',
    'tt.addPeriod': 'Add a period',
    'tt.removePeriod': 'Remove the last period',
    'tt.period': 'Period {n}',
    'tt.time': 'Time',
    'tt.lesson': 'Lesson',
    'tt.free': 'Free',
    'tt.save': 'Save',
    'tt.cancel': 'Cancel',
    'tt.reset': 'Back to the original',
    'tt.resetAsk': 'Put the timetable back the way it came?',
    'tt.saved': 'Timetable saved',
    'tt.tooFew': 'A timetable needs at least one period.',
    'done.title': 'Completed homework',
    'done.none': 'Nothing finished yet. It will all be here when it is.',
    'done.count': '{n} finished',
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
     'pro.reminder': 'תזכורת',
    'pro.daily': 'תזכורת יומית',
    'pro.dailyNote': 'תזכורת קטנה לרשום את שיעורי הבית של היום.',
    'pro.pack': 'לארוז את התיק',
    'pro.packNote': 'השיעורים והתזכורות של מחר, בערב שלפני.',
    'pro.time': 'שעה', 'pro.language': 'שפה',

    'set.title': 'הגדרות',
    'set.sub': 'התאימו את סביבת הלמידה והתזכורות שלכם.',
    'set.book': 'ספר היצורים',
    'set.collect': 'אספו את כולם!',
    'set.reminders': 'תזכורות',
    'set.appearance': 'מראה',
    'set.deskNote': 'בחרו מראה לסביבת הלמידה.',
    'set.about': 'אודות',
    'set.help': 'עזרה ואודות',
    'set.version': 'גרסה {v}',
    'set.firstCreature': 'היצור הראשון שלך בדרך.',

    'about.what': 'מה זה',
    'about.whatNote': 'כל מה שצריך לעשות, במקום אחד. רושמים שיעורי בית ברגע שהם ניתנים, מסמנים כשסיימו, והתיק נארז לבד לפי המערכת.',
    'about.install': 'בטלפון',
    'about.installNote': 'שיתוף, ואז הוספה למסך הבית. כשפותחים משם האפליקציה ממלאת את המסך ויכולה לשלוח תזכורות; בלשונית של דפדפן היא לא יכולה.',
    'about.data': 'העבודה שלך',
    'about.dataNote': 'הכול נשאר בטלפון הזה. שום דבר לא נשלח לשום מקום ואין לאן להתחבר.',
    'about.done': 'סיום',

    'tab.creatures': 'יצורים',
    'cre.title': 'יצורים',
    'cre.sub': 'הכירו כל יצור שתגלו.',
    'cre.book': 'הספר',
    'cre.found': 'נמצאו עד כה',
    'cre.all': 'כל היצורים',
    'cre.search': 'חיפוש יצורים',
    'cre.searchPh': 'שם או מספר',
    'cre.fAll': 'הכול', 'cre.fFound': 'נמצאו', 'cre.fLocked': 'נעולים',
    'cre.progress': '{have} / {all}',
    'cre.discovered': 'התגלו',
    'cre.noMatch': 'אף אחד בשם הזה עדיין.',
    'cre.noneFound': 'עוד לא נמצא אף אחד. סיימו שיעורי בית והביצה הראשונה תגיע.',
    'cre.noneLocked': 'לא נשאר אף אחד למצוא. כל החמישים אצלכם.',
    'cre.number': '#{n}',
    'cre.creature': 'יצור #{n}',
    'cre.locked': 'עוד לא נמצא',
    'cre.lockedNote': 'סיימו שיעורי בית כדי לבקוע ביצים. מי שבפנים הוא מי שההגרלה נתנה.',

    'cmp.yours': 'החבר שלך',
    'cmp.mine': 'החבר שלי',
    'cmp.none': 'עוד אין חבר',
    'cmp.noneSub': 'מצאו יצור ואחד מהם יוכל ללוות אתכם.',
    'cmp.noneCta': 'מצאו את הראשון',
    'cmp.pick': 'בחרו אחד',
    'cmp.view': 'צפייה',
    'cmp.change': 'החלפה',
    'cmp.make': 'הפכו לחבר',
    'cmp.current': 'החבר שלך',
    'cmp.title': 'בחירת חבר',
    'cmp.sub': 'החבר שלכם יושב בפרופיל, ומקבל את הקרדיט על מה שתסיימו.',
    'cmp.preview': 'תצוגה',
    'cmp.discovered': 'יצורים שנמצאו',
    'cmp.set': 'הפכו את {name} לחבר',
    'cmp.pillTag': '{name} • חבר',
    'cmp.tasks': '{n} מטלות יחד',
    'cmp.tasks1': 'מטלה אחת יחד',
    'cmp.tasks0': 'עוד כלום יחד',
    'cmp.swapped': '{name} איתך עכשיו',

    'cre.about': 'עליו',
    'cre.story': 'מאיפה הוא הגיע',
    'cre.share': 'שיתוף',
    'cre.shareText': '{name} הופיע לי בספר היצורים.',
    'cre.fav': 'מועדף',
    'cre.unfav': 'הסרה מהמועדפים',
    'cre.statFound': 'נמצא',
    'cre.statTasks': 'מטלות יחד',
    'cre.statLives': 'המקום האהוב',
    'cre.today': 'היום',
    'cre.memories': 'זיכרונות',
    'cre.memoriesNote': 'סיימו שיעורי בית עם {name} כדי ליצור זיכרונות.',
    'cre.memoriesSome': 'הדבר האחרון שסיימתם יחד.',

    'pro.you': 'פרופיל',
    'pro.yourStory': 'המסע שלכם, היצורים שלכם, הסיפור שלכם.',
    'pro.sTasks': 'מטלות', 'pro.sCreatures': 'יצורים', 'pro.sStreak': 'ימים ברצף',

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
    'notif.anyBody': 'נשארו {n}. יש משהו חדש היום?',
    'notif.anyBodyNone': 'רשמו את שיעורי הבית של היום כל עוד הם טריים.',
    'notif.finish': 'נשארו {n} לסיים',
    'notif.finishBody': 'יש זמן. תתחילו מהקצר ביותר.',
    'set.reminders': 'תזכורות',
    'set.general': 'כללי',
    'set.history': 'היסטוריה',
    'pro.add': 'הוספת שיעורי בית',
    'pro.addNote': 'תזכורת לרשום את שיעורי הבית של היום.',
    'pro.pack': 'אריזת התיק',
    'pro.packNote': 'השיעורים והתזכורות של מחר, בערב שלפני.',
    'pro.finish': 'סיום שיעורי בית',
    'pro.finishNote': 'רק כשנשאר משהו לסיים.',
    'pro.country': 'מדינה',
    'pro.countryNote': 'קובעת את שבוע הלימודים, התאריכים והשעון.',
    'pro.editTt': 'עריכת מערכת',
    'pro.editTtNote': 'הוספה, שינוי או הסרה של שיעור.',
    'pro.done': 'שיעורי בית שהושלמו',
    'pro.doneNote': 'כל מה שסיימתם.',
    'set.theme': 'מראה',
    'set.themeNote': 'בהיר, כהה, או לפי הטלפון.',
    'theme.light': 'בהיר', 'theme.dark': 'כהה', 'theme.system': 'לפי המכשיר',
    'country.il': 'ישראל', 'country.gb': 'בריטניה',
    'country.us': 'ארצות הברית', 'country.ca': 'קנדה',
    'country.au': 'אוסטרליה', 'country.fr': 'צרפת',
    'country.de': 'גרמניה', 'country.in': 'הודו',
    'setup.weekTitle': 'איך נראה השבוע שלכם?',
    'photo.take': 'צילום תמונה',
    'photo.read': 'קראו אותה',
    'photo.reading': 'קוראים… {n}%',
    'photo.readOk': 'נקראו {n} שעות. בדקו אותן.',
    'photo.readNone': 'לא נמצאה טבלה בתמונה. מלאו למטה, או נסו תמונה ישרה יותר.',
    'photo.readFail': 'לא הצלחנו לקרוא הפעם. מלאו למטה.',
    'photo.readOffline': 'קריאת תמונה דורשת חיבור בפעם הראשונה. מלאו למטה, או נסו שוב מאוחר יותר.',
    'photo.pick': 'מהתמונות שלכם',
    'setup.weekNote': 'צלמו את המערכת והקישו קראו אותה, והאפליקציה תמלא את הטבלה כדי שתבדקו. אפשר גם לדלג ולמלא בעצמכם.',
    'setup.checkTitle': 'זה נכון?',
    'setup.checkNote': 'תקנו כל מה שלא מדויק. השאירו ריק לשעה חופשית.',
    'setup.kitTitle': 'מה צריך להביא?',
    'setup.kitNote': 'זו הניחוש של האפליקציה לכל שיעור. הקישו כדי להוסיף או להסיר.',
    'setup.everyDay': 'כל יום',
    'setup.more': 'עוד', 'setup.fewer': 'פחות',
    'photo.note': 'צלמו את המערכת והאפליקציה תקרא אותה. אתם בודקים מה נקרא לפני שנשמר, והתמונה נשארת בטלפון שלכם.',
    'photo.alt': 'המערכת שלכם',
    'photo.caption': 'הקישו כדי לראות בגדול.',
    'photo.open': 'לראות את התמונה בגדול',
    'photo.remove': 'הסרה',
    'photo.bad': 'זה לא נראה כמו תמונה.',
    'photo.noRoom': 'אין מקום לשמור את התמונה. נסו אחת קטנה יותר.',
    'setup.nothing': 'כלום לשיעור הזה',
    'setup.noLessons': 'עדין אין שיעורים. חזרו ומלאו כמה.',
    'setup.next': 'הבא', 'setup.back': 'חזרה', 'setup.finish': 'סיום',
    'setup.ready': 'הכול מוכן. השבוע שלכם בפנים.',

    'kit.pencil': 'קלמר', 'kit.pen': 'עט', 'kit.notebook': 'מחברת',
    'kit.books': 'ספרים', 'kit.bottle': 'בקבוק מים', 'kit.lunch': 'קופסת אוכל',
    'kit.laptop': 'מחשב נייד', 'kit.ipad': 'טאבלט', 'kit.charger': 'מטען',
    'kit.airpods': 'אוזניות', 'kit.case': 'תיק קלמר', 'kit.shoes': 'נעלי ספורט',
    'kit.sportkit': 'בגדי ספורט', 'kit.deo': 'דאודורנט', 'kit.tanach': 'תנך',
    'kit.lit': 'ספר ספרות', 'kit.eng': 'ספר אנגלית', 'kit.diplomacy': 'ספר דיפלומטיה',

    'tt.edit': 'עריכת מערכת',
    'tt.editNote': 'הקישו על שיעור כדי לשנות אותו. השאירו ריק לשעה חופשית.',
    'tt.addPeriod': 'הוספת שעה',
    'tt.removePeriod': 'הסרת השעה האחרונה',
    'tt.period': 'שעה {n}',
    'tt.time': 'שעה',
    'tt.lesson': 'שיעור',
    'tt.free': 'חופשי',
    'tt.save': 'שמירה',
    'tt.cancel': 'ביטול',
    'tt.reset': 'חזרה למקורית',
    'tt.resetAsk': 'להחזיר את המערכת כפי שהייתה?',
    'tt.saved': 'המערכת נשמרה',
    'tt.tooFew': 'למערכת צריכה להיות לפחות שעה אחת.',
    'done.title': 'שיעורי בית שהושלמו',
    'done.none': 'עוד לא סיימתם כלום. הכול יופיע כאן כשתסיימו.',
    'done.count': '{n} הושלמו',
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

/* What to ask the browser for when it writes a date the app has no word for.
   Two things decide it and they are not the same thing. The language picks
   the script — Hebrew writes its months in Hebrew wherever you are. The
   country picks the conventions: which day the week starts on, and whether
   the third of April is 3/4 or 4/3. So the language names the tongue and the
   country names the region, and a Hebrew speaker in London gets Hebrew
   months in British order. */
function locale() {
  const region = (state.settings && state.settings.country) || 'il';
  return (lang === 'he' ? 'he' : 'en') + '-' + region.toUpperCase();
}

function langDir(key) {
  const l = LANGS.find(x => x.key === key);
  return l ? l.dir : 'ltr';
}

/* A school day's name, by its place in the week rather than by its weekday
   number — which is what every screen here means by "day 0". The names used
   to be written out in two languages; the browser knows them in all of them,
   and knows which country calls which day what. */
function dayName(i) {
  const d = schoolDays()[i];
  return d ? weekdayName(d.js) : '';
}
function dayShort(i) {
  const d = schoolDays()[i];
  return d ? weekdayName(d.js, 'short') : '';
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

/* ── The kit ───────────────────────────────────────────────
   The first two links have their bags written into the code, because they
   were built for one week each and that week was known. The third is built
   for whoever opens it, so its bag has to be assembled rather than written —
   and this is everything it can be assembled from.

   Every one of these is a picture that already exists, drawn for one of the
   other two links. That is the point: a bag you put together for yourself
   looks exactly like the ones that were put together by hand, rather than
   like a list of words with a generic icon beside each.

   'ratio' is the shape the picture came out of the cutter as, width over
   height. The scene needs it to draw a pen and a pencil case at sizes that
   look like a pen and a pencil case; it is measured, not guessed. */
const KIT = [
  { key: 'pencil',    art: 'art/bag/pencil.webp',     ratio: 1.455 },
  { key: 'pen',       art: 'art/bag2/pen.webp',       ratio: 0.127 },
  { key: 'notebook',  art: 'art/bag/notebook.webp',   ratio: 0.979 },
  { key: 'books',     art: 'art/bag/books.webp',      ratio: 1.170 },
  { key: 'bottle',    art: 'art/bag/bottle.webp',     ratio: 0.469 },
  { key: 'lunch',     art: 'art/bag/lunch.webp',      ratio: 1.532 },
  { key: 'laptop',    art: 'art/bag/laptop.webp',     ratio: 1.440 },
  { key: 'ipad',      art: 'art/bag2/ipad.webp',      ratio: 0.822 },
  { key: 'charger',   art: 'art/bag2/charger.webp',   ratio: 1.016 },
  { key: 'airpods',   art: 'art/bag/airpods.webp',    ratio: 0.732 },
  { key: 'case',      art: 'art/bag2/case.webp',      ratio: 1.908 },
  { key: 'shoes',     art: 'art/bag/shoes.webp',      ratio: 1.417 },
  { key: 'sportkit',  art: 'art/bag2/sportkit.webp',  ratio: 1.092 },
  { key: 'deo',       art: 'art/bag2/deo.webp',       ratio: 0.592 },
  { key: 'tanach',    art: 'art/bag/tanach.webp',     ratio: 0.863 },
  { key: 'lit',       art: 'art/bag2/lit.webp',       ratio: 0.754 },
  { key: 'eng',       art: 'art/bag2/eng.webp',       ratio: 0.767 },
  { key: 'diplomacy', art: 'art/bag2/diplomacy.webp', ratio: 0.735 },
];

const kitItem = (key) => KIT.find(k => k.key === key) || null;

/* What the app guesses you need for a lesson, before you tell it otherwise.
   The rules read the lesson's own name in either language, because the name
   is the only thing the app knows about a lesson somebody has just typed in.

   Every guess is meant to be wrong sometimes. The point of guessing at all is
   that correcting a list is quicker than writing one, and the next screen is
   where you correct it. */
const KIT_RULES = [
  { want: ['sport', 'gym', 'pe', 'physical', 'ספורט', 'חינוך גופני', 'כושר'],
    kit: ['sportkit', 'shoes', 'deo', 'bottle'] },
  { want: ['swim', 'שחייה', 'שחיה'], kit: ['sportkit', 'bottle', 'deo'] },
  { want: ['comput', 'cod', 'program', 'software', 'tech', 'מחשב', 'תכנות', 'מדמ'],
    kit: ['laptop', 'charger'] },
  { want: ['bible', 'tanach', 'תנך', 'תנ״ך', 'תנ"ך', 'torah', 'תורה'], kit: ['tanach'] },
  { want: ['english', 'אנגלית'], kit: ['eng'] },
  { want: ['literat', 'ספרות'], kit: ['lit'] },
  { want: ['diplom', 'דיפלומטיה'], kit: ['diplomacy'] },
  { want: ['art', 'draw', 'paint', 'אומנות', 'אמנות', 'ציור'], kit: ['case'] },
  { want: ['math', 'algebra', 'geometr', 'מתמטיקה', 'הנדסה', 'חשבון'], kit: ['books'] },
  { want: ['lab', 'chem', 'physic', 'biolog', 'science', 'מעבדה', 'כימיה', 'פיסיקה', 'ביולוגיה', 'מדעים'],
    kit: ['books'] },
  { want: ['homeroom', 'tutor', 'assembly', 'חינוך'], kit: [] },
];

/** The app's first guess at what a lesson needs. */
function guessKit(lesson) {
  const name = String(lesson || '').toLowerCase();
  for (const rule of KIT_RULES) {
    if (rule.want.some(w => name.includes(w))) return rule.kit.slice();
  }
  // Nothing recognised: a notebook, which is the safe answer for a lesson.
  return ['notebook'];
}

/** What you have said a lesson needs, or the guess until you say otherwise. */
function kitFor(lesson) {
  const saved = (state.kit || {})[lesson];
  return Array.isArray(saved) ? saved : guessKit(lesson);
}

/* The things that go in every day whatever the lessons are. Guessed once, and
   then yours. */
const KIT_EVERY_DAY = ['pencil', 'bottle'];
const everyDayKit = () =>
  Array.isArray(state.kitEveryDay) ? state.kitEveryDay : KIT_EVERY_DAY.slice();


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
  // Ten things on a Monday, so they are laid out around the bag rather than
  // each having a place of its own: a place each leaves a different hole in
  // the ring every day of the week.
  bagStyle: 'ring',
  // The shape each thing came out of the cutter as, width over height. How
  // big to draw it follows from that and nothing else: a pen picked by eye
  // came out 150px tall, because a pen is eight times taller than it is wide
  // and a width chosen to look right made a height that did not.
  pics: {
    ipad:      { ratio: 0.822 },
    case:      { ratio: 1.908 },
    pen:       { ratio: 0.127 },
    charger:   { ratio: 1.016 },
    tanach:    { ratio: 0.796 },
    diplomacy: { ratio: 0.735 },
    lit:       { ratio: 0.754 },
    eng:       { ratio: 0.767 },
    sportkit:  { ratio: 1.092 },
    deo:       { ratio: 0.592 },
    bottle:    { ratio: 0.370 },
  },
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
/* ── One you set up yourself ───────────────────────────────
   The other two links each carry a week and a bag written into the code,
   because each was built for one person whose week was known. This one is
   built for whoever opens it: it starts with no week at all, asks for one,
   guesses what every lesson needs, and lets you correct both. After that it
   is the same app — same board, same creatures, same everything — running on
   a timetable it was given rather than one it was born with.

   It has no schedule and no periods here on purpose. An empty week is what
   sends you to the setup the first time you open it. */
PROFILES.own = {
  id: 'own',
  appName: 'Homework · Mine',
  periods: [],
  schedule: [],
  look: {},
  bagStyle: 'ring',
  bagArt: 'art/bag',
  // Every picture in the catalogue, so anything you tick can be drawn.
  pics: Object.fromEntries(KIT.map(k => [k.key, { ratio: k.ratio }])),
  // A picture lives wherever it was drawn for, which is two folders.
  artOf: (key) => (kitItem(key) || { art: 'art/bag/pack.webp' }).art,

  /* The bag is not written here, because it is not known here. It is the
     every-day things, plus whatever each of today's lessons was said to
     need — said by you, or guessed until you say. */
  bag(names, lessonLabel) {
    const things = [];
    const add = (key, detail) => {
      if (!kitItem(key)) return;
      const already = things.find(t => t.key === key);
      // Two lessons wanting the same book is one book, and it says so once.
      if (already) {
        if (detail && already.detail && !already.detail.includes(detail)) {
          already.detail += ' · ' + detail;
        } else if (detail && !already.detail) already.detail = detail;
        return;
      }
      things.push({ key, label: tr('kit.' + key), detail: detail || '' });
    };

    for (const key of everyDayKit()) add(key);
    for (const name of names) for (const key of kitFor(name)) add(key, lessonLabel(name));
    return things;
  },
};

const PROFILE = (() => {
  try {
    const want = new URLSearchParams(location.search).get('p');
    if (want && PROFILES[want]) return PROFILES[want];
  } catch { /* no URL to read */ }
  return PROFILES.rea;
})();

/* The week the app was built with, and the week you have made of it.
 *
 * These used to be two constants read straight off the profile, which is why
 * the timetable could be looked at and not touched. They are functions now,
 * and they answer from the store the moment anything has been edited there.
 * Nothing else about them changed: the shape is the same list of periods and
 * the same grid of day rows, so every screen that reads the week reads it the
 * same way it always did.
 */
const periods = () => (state.timetable && state.timetable.periods) || PROFILE.periods;
const schedule = () => (state.timetable && state.timetable.schedule) || PROFILE.schedule;
/** A copy of whichever week is in force, safe to edit and hand back. */
function weekCopy() {
  return { periods: periods().slice(), schedule: schedule().map(row => row.slice()) };
}
// [day index][period index] — null is a free period.
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
function lessons() {
  const seen = [];
  for (const row of schedule()) for (const name of row) if (name && !seen.includes(name)) seen.push(name);
  return seen;
}
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

/* A subject is a lesson with a look. A lesson the app has never heard of —
   one typed into the editor — gets no icon and a plain colour, which is
   better than refusing to file homework under it. */
function subjects() {
  return lessons().map((name) => {
    const look = SUBJECT_LOOK[name] || {};
    return {
      id: name,
      name,
      icon: 'icon' in look ? look.icon : 'i-bookmark',
      glyph: look.glyph || null,
      color: look.color || tileHue(name),
    };
  });
}

/* A colour for a lesson nobody drew one for: taken from the name, so the same
   lesson is the same colour every time and two different ones rarely clash. */
function tileHue(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return `hsl(${h} 32% 52%)`;
}

const PALETTE = Object.values(SUBJECT_LOOK).map(l => l.color).filter(Boolean);

/** The timetable's subjects, plus anything older data left behind. */
const allSubjects = () => subjects().concat(state.extraSubjects || []);

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
  return `<img class="bag-pic ${extra}" src="${bagArtFor(key)}" alt="" aria-hidden="true"
       width="${w}" height="${Math.round(w / art.ratio)}" decoding="async"
       style="left:${(place.x / BAG_SCENE.w) * 100}%; top:${(place.y / H) * 100}%;
              width:${art.w * 100}%" />`;
}

/**
 * The scene for one day. Everything on it is worked out from the timetable,
 * so there is never anything to answer.
 */
/* A bag in the middle and the day's things down either side of it.

   The first week gives every thing a place of its own, which works because
   it has nine possible things and shows five or six of them. This one has
   eleven and a Monday shows ten, so a place each would leave a different
   hole in the ring every day. Here the day's things are dealt out instead —
   alternately left and right, top to bottom — so four things and ten things
   both come out even. */
/* Every thing is drawn no taller than CELL and no wider than CELL, keeping
   its own shape — which is what stops a pen being a lamp post and a pencil
   case being a plank. Then each side is stacked by the heights that come
   out of that, so a label always has the room it needs and never lands on
   the thing below it. */
/* Where a bag picture lives. Two of the links keep all of theirs in one
   folder and say so; the third assembles its bag out of both, so it answers
   per item instead. */
function bagArtFor(key) {
  return PROFILE.artOf ? PROFILE.artOf(key) : `${PROFILE.bagArt}/${key}.webp`;
}

const BAG_CELL = 92;

function bagRing(dayIndex) {
  const things = bagThings(dayIndex).filter(t => PROFILE.pics[t.key]);

  // Deal them out, alternately, so both sides come out even.
  const columns = [[], []];
  things.forEach((t, i) => columns[i % 2].push(t));

  const TOP = 26, GAP = 20, LABEL = 22, DETAIL = 17;
  const placed = [];
  const bottoms = columns.map((column, side) => {
    let y = TOP;
    for (const t of column) {
      const ratio = PROFILE.pics[t.key].ratio;
      const h = Math.min(BAG_CELL, BAG_CELL / ratio);
      const w = h * ratio;
      placed.push({ ...t, side, w, h, top: y, labelTop: y + h + 4 });
      y += h + 4 + LABEL + (t.detail ? DETAIL : 0) + GAP;
    }
    return y;
  });
  // The scene is as tall as the day needs and no taller — a Sunday of four
  // things held open to a Monday's height is a screen of nothing. The floor is
  // the bag's own height (32% of the width, and it is 422x502) with air round it,
  // since it hangs from the middle and would otherwise poke out of a short day.
  const H = Math.max(260, ...bottoms);

  const pics = placed.map(t => `
    <img class="bag-pic bag-thing" src="${bagArtFor(t.key)}" alt=""
         aria-hidden="true" decoding="async"
         style="left:${t.side ? 82 : 18}%; top:${(t.top / H) * 100}%;
                width:${(t.w / BAG_SCENE.w) * 100}%;
                transform:translateX(-50%)" />`).join('');

  const labels = placed.map(t => `
    <span class="bag-label is-ring ${t.detail ? 'is-wide' : ''}"
          style="left:${t.side ? 82 : 18}%; top:${(t.labelTop / H) * 100}%">
      <b>${esc(t.label)}</b>
      ${t.detail ? `<i>${esc(t.detail)}</i>` : ''}
    </span>`).join('');

  return `
    <div class="bag-scene is-ring" style="aspect-ratio:${BAG_SCENE.w}/${H}">
      <img class="bag-pic bag-pack" src="art/bag/pack.webp" alt="" aria-hidden="true"
           decoding="async" style="left:50%; top:50%; width:32%;
                                   transform:translate(-50%,-50%)" />
      ${pics}
      ${labels}
    </div>`;
}

function bagScene(dayIndex) {
  if (PROFILE.bagStyle === 'ring') return bagRing(dayIndex);
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
  const row = schedule()[dayIndex] || [];
  const seen = new Map();
  row.forEach((name, period) => {
    if (!name) return;
    if (!seen.has(name)) seen.set(name, { name, periods: [] });
    seen.get(name).periods.push(period);
  });
  return [...seen.values()];
}


/** Place in the school week, or -1 if today is not one. */
function schoolDayIndex(d = new Date()) {
  return schoolDays().findIndex(x => x.js === d.getDay());
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

/* The weights are per tier, not per creature: a tier is rolled first and then
   somebody in it you have not met. So the roster and the odds have to move
   together — five legendaries behind a one-in-a-hundred door would take six
   hundred pieces of homework to meet, which is not a collection, it is a wall.
   A tier that runs out of strangers falls through to the next. */
const RARITY = [
  { key: 'common',    label: 'Common',    weight: 38, colour: '#8A94A2' },
  { key: 'uncommon',  label: 'Uncommon',  weight: 27, colour: '#4FA83D' },
  { key: 'rare',      label: 'Rare',      weight: 20, colour: '#3E63DD' },
  { key: 'epic',      label: 'Epic',      weight: 11, colour: '#9B51C9' },
  { key: 'legendary', label: 'Legendary', weight: 4,  colour: '#D9A94A' },
];

const rarityOf = (key) => RARITY.find(r => r.key === key) || RARITY[0];

const MONSTERS = [
  { id: 'blip', art: true, name: 'Prism', rarity: 'common', colour: '#6f7daf',
    shape: 'round', eyes: 1, top: 'antennae', mark: 'none',
    age: 'As old as the first sunny afternoon', size: 'Taller than a kettle, and mostly legs',
    lives: 'The bathroom window, late morning',
    eats: 'Light, and only the bent kind', says: 'A ringing note, like a wet finger on glass',
    hobbies: ['Splitting sunbeams', 'Standing in doorways'],
    best: 'Turning white light into all of it', worst: 'Cloudy days',
    fact: 'Prism has one eye and sees more colours with it than anyone here has names for.',
    story: 'A rainbow came in through a window that had been left open and could not find the way back out. It spent the afternoon going round the room, getting thinner. By evening it had grown four legs, so that next time it could leave the way everybody else does.' },

  { id: 'pom', art: true, name: 'Snowhare', rarity: 'common', colour: '#ae6f88',
    shape: 'cloud', eyes: 2, top: 'none', mark: 'none',
    age: 'Half a year, all of it indoors', size: 'About the size of a plum, before it fluffs up',
    lives: 'The hood of your coat',
    eats: 'Anything warm', says: 'Nothing at all, ever',
    hobbies: ['Napping in socks', 'Being carried'],
    best: 'Being comfortable anywhere', worst: 'Walking',
    fact: 'Snowhare has never walked anywhere by itself and does not intend to start.',
    story: 'The first snow of the year fell on a hare that had not yet turned white, and stayed on it out of politeness. By spring neither of them could remember which was which, and it seemed unkind to ask, so they carried on together.' },

  { id: 'tuft', art: true, name: 'Sorrel', rarity: 'common', colour: '#aea26f',
    shape: 'round', eyes: 2, top: 'ears', mark: 'none',
    age: 'One spring, nearly two', size: 'A grapefruit with enormous ears',
    lives: 'Under the hedge at the bottom of the park',
    eats: 'The clover nobody planted', says: 'A small hum when it rains',
    hobbies: ['Listening to rain', 'Growing new leaves'],
    best: 'Hearing a packet open from the next room', worst: 'Loud rooms',
    fact: 'Sorrel\'s coat is leaves, and in October it goes gold and it is extremely embarrassed about it.',
    story: 'A hare slept under a hedge through a whole wet March. The hedge, being generous and a little careless, grew over it while it slept, and the hare woke up green. Neither of them has raised the subject since.' },

  { id: 'moss', art: true, name: 'Terracotta', rarity: 'common', colour: '#bd8161',
    shape: 'round', eyes: 2, top: 'sprout', mark: 'none',
    age: 'Two springs, and a very long nap between them', size: 'A flowerpot, asleep',
    lives: 'The greenhouse, between the stacked pots',
    eats: 'Roots, and the occasional worm it apologises to', says: 'A snore, at about the pitch of a bee',
    hobbies: ['Sleeping', 'Growing something on its back'],
    best: 'Keeping a plant alive without meaning to', worst: 'Being woken',
    fact: 'The sprout on Terracotta\'s back is a different plant every spring and it has never once chosen one.',
    story: 'A mole fell asleep in a stack of empty pots in March, and a seed fell in after it. By May the mole was a garden. By June it had stopped objecting, and now it will not sleep anywhere that has not got at least two pots in it.' },

  { id: 'pebble', art: true, name: 'Threshold', rarity: 'common', colour: '#8eae6f',
    shape: 'square', eyes: 2, top: 'none', mark: 'spots',
    age: 'Nine hundred years, give or take a hundred', size: 'A doorway, if you are the right size',
    lives: 'Exactly where you left it',
    eats: 'Once a century, quietly', says: 'Nothing you would notice',
    hobbies: ['Staying put', 'Being a way through'],
    best: 'Not moving', worst: 'Hurrying',
    fact: 'Threshold has not moved since Tuesday and is very pleased about it. Something is still living inside.',
    story: 'A door was built into a hillside, leading somewhere that no longer exists. The hill grew over it and the moss came, and the door — having nowhere left to lead and nothing else to do — got up and went for a walk. It still opens. Nobody has found out onto what.' },

  { id: 'bud', art: true, name: 'Prickle', rarity: 'common', colour: '#ae896f',
    shape: 'bean', eyes: 2, top: 'leaf', mark: 'none',
    age: 'Nine years. One flower.', size: 'A plant pot\'s worth',
    lives: 'The hot windowsill, the one nobody waters',
    eats: 'Four drops of water a month', says: 'Nothing for years, and then a great deal',
    hobbies: ['Waiting', 'Flowering all at once'],
    best: 'Going without', worst: 'Kindness, in the form of watering',
    fact: 'Prickle has been mistaken for a houseplant eleven times and flowers once a year to settle the matter.',
    story: 'A cactus sat on a windowsill for nine years without being spoken to once. In the ninth year it put out one enormous red flower, purely to be noticed, and was so pleased with the result that it climbed down to show somebody.' },

  { id: 'dot', art: true, name: 'Abacus', rarity: 'common', colour: '#c59058',
    shape: 'pebble', eyes: 2, top: 'none', mark: 'spots',
    age: 'Counted in units of itself', size: 'As long as you let it get',
    lives: 'The maths cupboard, in the box of counters',
    eats: 'One bead a month, and puts it back', says: 'A click for every leg, in order',
    hobbies: ['Counting', 'Adding a segment'],
    best: 'Never losing its place', worst: 'Estimates',
    fact: 'Abacus counts everything and has never once lost its place, including right now.',
    story: 'A counting frame in an old classroom was used so often, by so many children, that the beads learned the order themselves. One night it ran a sum with nobody in the room, liked the feeling, and climbed down off the desk to look for more things to count.' },

  { id: 'tilly', art: true, name: 'Origami', rarity: 'common', colour: '#d46449',
    shape: 'bean', eyes: 2, top: 'bow', mark: 'heart',
    age: 'Folded on a Tuesday, sixty years ago', size: 'One square of paper, no cuts',
    lives: 'The drawer where the good paper is kept',
    eats: 'Nothing. It would go soft.', says: 'A dry rustle when it turns its head',
    hobbies: ['Folding itself smaller', 'Sitting in draughts'],
    best: 'Fitting into places nothing else fits', worst: 'Rain, obviously',
    fact: 'Origami has never been unfolded and would rather not learn what it was before.',
    story: 'A child folded a fox to cheer up a friend who was ill, and put so much of the wish into the creases that the last fold breathed. It has kept every crease since. Unfolding would mean forgetting, and it was a good wish.' },

  { id: 'sprig', art: true, name: 'Greencoat', rarity: 'common', colour: '#c0bf5e',
    shape: 'tall', eyes: 2, top: 'sprout', mark: 'none',
    age: 'Eleven years, one for each ring', size: 'Tall, and taller by autumn',
    lives: 'The overgrown corner of the park that nobody mows',
    eats: 'Rain, and whatever the rain brings down', says: 'A creak, like a branch deciding',
    hobbies: ['Growing a little every week', 'Standing very still'],
    best: 'Being mistaken for scenery', worst: 'Secateurs',
    fact: 'Greencoat measures itself against the window every week and has never once gone down.',
    story: 'Ivy took a scarecrow in a single wet summer and finished the job the following spring. There is no straw left in it at all now. It still stands in the same field, and it still frightens the crows, and it walks when nobody is counting.' },

  { id: 'mo', art: true, name: 'Ouroboros', rarity: 'common', colour: '#6f78ae',
    shape: 'blob', eyes: 2, top: 'none', mark: 'none',
    age: 'Yes', size: 'The same, whichever way you measure',
    lives: 'The end of the sentence it started',
    eats: 'Itself, and it has never gone hungry', says: 'The last word, and then the first one again',
    hobbies: ['Thinking', 'Coming back round to it'],
    best: 'Never quite finishing', worst: 'Straight lines',
    fact: 'Ouroboros has been thinking about something since March and is nearly back to where it started.',
    story: 'A snake set out to find the end of itself. It has been going since before anyone was counting. It found the end some time ago, took hold of it, and has been considering what to do next ever since — which is, it says, the whole point.' },

  { id: 'gus', art: true, name: 'Bogjaw', rarity: 'common', colour: '#b1ac6d',
    shape: 'square', eyes: 2, top: 'horns', mark: 'none',
    age: 'Four hundred summers, most of them asleep', size: 'A garden bench with teeth',
    lives: 'The flooded end of the park, under the willow',
    eats: 'Whatever the canal offers', says: 'One low note you feel through the bench you are sitting on',
    hobbies: ['Lying completely still', 'Growing a better lawn'],
    best: 'Being mistaken for a log', worst: 'Being hurried',
    fact: 'The moss on Bogjaw\'s back is a different garden every year and it has never once looked at it.',
    story: 'A log lay in the same shallow water so long that the moss moved in, then the beetles, then a family of newts. By the time it thought about moving, so many things depended on it that getting up seemed rude — so it waited another hundred years, and then got up very gently.' },

  { id: 'pip', art: true, name: 'Ribbontail', rarity: 'common', colour: '#d46a49',
    shape: 'pebble', eyes: 1, top: 'sprout', mark: 'none',
    age: 'Forty years, and barely started', size: 'A hand now. A doorway, eventually.',
    lives: 'The pond in the park, under the bridge',
    eats: 'Whatever lands on the water', says: 'A kiss at the surface, which is not a word',
    hobbies: ['Growing', 'Going upstream for no particular reason'],
    best: 'Patience', worst: 'Small tanks',
    fact: 'Ribbontail intends to be enormous one day and is taking its time about it.',
    story: 'A carp was told that something remarkable happens to any fish that swims all the way up the waterfall. It has been swimming up for a hundred years. Nothing remarkable has happened yet, except that it is now four times the size it started, which it has not noticed.' },

  { id: 'fen', art: true, name: 'Reedwarden', rarity: 'common', colour: '#b69a67',
    shape: 'wisp', eyes: 2, top: 'none', mark: 'none',
    age: 'Every dawn since the marsh was there', size: 'Taller than you, and mostly legs',
    lives: 'The reeds at the water\'s edge, before eight',
    eats: 'Whatever is slow in the shallows', says: 'One croak, which carries a mile',
    hobbies: ['Standing perfectly still', 'Leaving before anyone wakes'],
    best: 'Waiting', worst: 'Company',
    fact: 'Reedwarden is only ever seen before eight in the morning, and has never been seen leaving.',
    story: 'A heron stood in one place in the reeds for so many mornings that the reeds grew up through it. It did not mind and it did not move. It is hard to say now where the marsh stops and the bird starts, and the bird much prefers it that way.' },

  { id: 'nib', art: true, name: 'Chorus', rarity: 'uncommon', colour: '#6f78ae',
    shape: 'tall', eyes: 3, top: 'none', mark: 'none',
    age: 'As old as the first play', size: 'A scarf, if a scarf could look at you',
    lives: 'The wings of the school hall, stage left',
    eats: 'Applause, and not much of it', says: 'Everything, in four voices, one after another',
    hobbies: ['Watching from the side', 'Trying on faces'],
    best: 'Seeing the door, the window and you at the same time', worst: 'Deciding which face it meant',
    fact: 'Chorus has four faces and has never worn the same one twice in one day.',
    story: 'Four masks hung in a cupboard for thirty years with nothing to do but listen to rehearsals through the door. They learned every part in every play. One night, having nothing left to learn, they came out to try them, and found they only had one ribbon between them.' },

  { id: 'fizz', art: true, name: 'Thrum', rarity: 'uncommon', colour: '#6fadae',
    shape: 'round', eyes: 2, top: 'antennae', mark: 'bubbles',
    age: 'Two months, lived at speed', size: 'A drinks can, mostly wing',
    lives: 'The honeysuckle by the gate',
    eats: 'Sugar water, and it will tell you all about it', says: 'A steady stream of questions',
    hobbies: ['Fizzing', 'Asking why'],
    best: 'Asking the question nobody thought of', worst: 'Sitting still',
    fact: 'Thrum has asked about four thousand questions and is not finished.',
    story: 'A hummingbird beat its wings so fast for so long that the air around it never quite settled again. It is made of that unsettled air now. It has questions about absolutely everything and no time at all to hear the answers.' },

  { id: 'marl', art: true, name: 'Orrery', rarity: 'uncommon', colour: '#746fae',
    shape: 'square', eyes: 2, top: 'none', mark: 'swirl',
    age: 'Nine thousand years, and it counts them itself', size: 'A footstool, and just as reluctant',
    lives: 'The old observatory garden, where the grass is worn in a circle',
    eats: 'Dandelions, one a week', says: 'A click, on the hour',
    hobbies: ['Turning very slowly', 'Keeping the sky in order'],
    best: 'Being in exactly the right place in a thousand years', worst: 'Being picked up',
    fact: 'Orrery\'s shell is the night sky as it stood the day it hatched, and it is nine thousand years out of date.',
    story: 'An astronomer left her star charts out on the grass and it rained, and a tortoise walked over them. The ink would not wash off. Over the years it sank in, and the stars settled into the shell and began, very slowly, to turn.' },

  { id: 'vex', art: true, name: 'Peeper', rarity: 'uncommon', colour: '#a3af6e',
    shape: 'spike', eyes: 3, top: 'horns', mark: 'none',
    age: 'Four months, and it has watched all of them', size: 'A melon, with two of the eyes on stalks',
    lives: 'The top of the stairs, where it can see both floors',
    eats: 'Whatever gets left on the side', says: 'A short delighted noise, when it spots you',
    hobbies: ['Watching two things at once', 'Being spotted'],
    best: 'Noticing what has moved', worst: 'Blinking, which takes it three times as long',
    fact: 'Peeper has three eyes and blinks them one after another, so it is never once not looking.',
    story: 'Something small hid at the top of the stairs to watch a party it had not been invited to, and found it could not see enough of the evening with only two eyes. By the time the cake came out it had grown a third, on a stalk, so it could watch the hall and the kitchen and the cake all at once. It has never put it away.' },

  { id: 'ora', art: true, name: 'Votive', rarity: 'uncommon', colour: '#d49a49',
    shape: 'drop', eyes: 2, top: 'halo', mark: 'glow',
    age: 'Lit for somebody, a while ago', size: 'A small candle in a glass',
    lives: 'The windowsill, facing out',
    eats: 'One wick, slowly', says: 'Nothing. It is listening.',
    hobbies: ['Burning steadily', 'Waiting up'],
    best: 'Being left on for somebody', worst: 'Draughts',
    fact: 'Votive burns all night for somebody who may not come, and has never once mentioned it.',
    story: 'A candle was put in a window to guide somebody home on a bad night, and it worked. It has been lit in that window every night since, by nobody in particular, for anybody who happens to be out late.' },

  { id: 'thistle', art: true, name: 'Toadstool', rarity: 'uncommon', colour: '#ae816f',
    shape: 'spike', eyes: 2, top: 'tuft', mark: 'none',
    age: 'Eleven days, and it will not see thirty', size: 'Ankle high, cap and all',
    lives: 'The dark side of the log pile, after rain',
    eats: 'Rot, politely', says: 'Nothing, but it hums when you are not looking',
    hobbies: ['Appearing overnight', 'Standing in rings'],
    best: 'Turning up where there was nothing yesterday', worst: 'Being picked',
    fact: 'Toadstool is far softer than it looks, and the spots are a warning it does not mean.',
    story: 'It rained for nine days without stopping. On the tenth morning the log pile had a small red hat on it, and the hat had legs, and the hat had opinions about where the wet corners were. Nobody saw it arrive because nothing arrived — it simply came up.' },

  { id: 'bram', art: true, name: 'Hollowoak', rarity: 'uncommon', colour: '#b99564',
    shape: 'round', eyes: 3, top: 'leaf', mark: 'spots',
    age: 'Two hundred rings, and one bad winter', size: 'You would notice it in a garden',
    lives: 'The end of the lane, where the hedge gets serious',
    eats: 'Light from above, water from below', says: 'A creak that sounds like a name',
    hobbies: ['Knowing where the berries are', 'Standing in weather'],
    best: 'Remembering which year was which', worst: 'Being pruned',
    fact: 'Hollowoak knows where every berry on the street is and exactly when each will be ready.',
    story: 'A tree was struck by lightning and did not die — it only woke up. It pulled its roots out of the bank, found them useful, and has walked the lane ever since, very slowly, checking on the hedgerows and keeping count.' },

  { id: 'juno', art: true, name: 'Tickspring', rarity: 'uncommon', colour: '#bc9662',
    shape: 'tall', eyes: 2, top: 'crown', mark: 'none',
    age: 'Wound in 1911 and still going', size: 'A teapot with opinions',
    lives: 'The bottom drawer of the workshop, among the spare springs',
    eats: 'One drop of oil a month', says: 'Tick. And, when it is thinking, tick tick.',
    hobbies: ['Putting things in order', 'Winding itself'],
    best: 'A plan for the week that everybody is in', worst: 'Running down',
    fact: 'Tickspring has a plan for the week and you are in it, on Thursday, at four.',
    story: 'A clockmaker built a brass crab to sort her smallest screws and forgot to give it a stopping point. It sorted the screws, then the workshop, then the street. She has been gone ninety years. It has not run down, and the street is still in order.' },

  { id: 'ash', art: true, name: 'Inkblot', rarity: 'uncommon', colour: '#6c7db2',
    shape: 'wisp', eyes: 2, top: 'none', mark: 'freckles',
    age: 'Since the pen leaked, about a year', size: 'A saucer, on a good day',
    lives: 'Page four of the notebook you need',
    eats: 'White paper', says: 'A wet sort of pop',
    hobbies: ['Settling on everything', 'Getting onto cuffs'],
    best: 'Being exactly where the writing was going', worst: 'Blotting paper',
    fact: 'Inkblot settles on everything and apologises for none of it.',
    story: 'A pen was left uncapped on a hot day and the ink ran out of it and would not run back in. Ink that has been left alone long enough starts to wonder what it might have written, and sooner or later it gets up to go and find out.' },

  { id: 'wick', art: true, name: 'Coldflame', rarity: 'uncommon', colour: '#6f8aae',
    shape: 'tall', eyes: 1, top: 'none', mark: 'glow',
    age: 'Alight since the start of term', size: 'A dog, made of the wrong material',
    lives: 'The corridor that is always colder than the others',
    eats: 'Nothing it will admit to', says: 'A sound like a match being struck, over and over',
    hobbies: ['Burning without heat', 'Waiting at the ends of corridors'],
    best: 'Being a light you can follow', worst: 'Being followed',
    fact: 'Coldflame has been alight since September and gives off no warmth at all.',
    story: 'A candle was left burning all night in an empty corridor for somebody who never came. By morning the wax was gone, and the flame, with nothing left to stand on, grew four legs and went to look for them. It is still looking, and it is still cold.' },

  { id: 'noor', art: true, name: 'Moonbell', rarity: 'uncommon', colour: '#68b0b6',
    shape: 'round', eyes: 2, top: 'halo', mark: 'stars',
    age: 'As many tides as you care to count', size: 'A lampshade, and about as heavy',
    lives: 'The dark corner of any room, and the dark part of the sea',
    eats: 'Whatever drifts past', says: 'Nothing you would hear above water',
    hobbies: ['Hanging still', 'Going out with the tide'],
    best: 'Being the only light down there', worst: 'Being held',
    fact: 'Moonbell goes to the darkest corner of a room and simply stays there, glowing, until somebody needs it to.',
    story: 'The moon\'s reflection was left behind on the water one night when the tide went out faster than usual. It has been looking for the way back up ever since. It glows the whole time, in case the moon happens to be looking down.' },

  { id: 'glim', art: true, name: 'Glowshell', rarity: 'rare', colour: '#d49449',
    shape: 'drop', eyes: 2, top: 'none', mark: 'glow',
    age: 'Nobody knows. Ask the shell.', size: 'Fills a cupped hand and warms it',
    lives: 'The desk, after dark',
    eats: 'Does not. It is still running on last summer.', says: 'A faint hum, like a bulb settling',
    hobbies: ['Glowing gently', 'Reading over your shoulder'],
    best: 'Being the last light on', worst: 'Mornings',
    fact: 'Glowshell has finished more books than anyone else here and has never turned a page.',
    story: 'A snail crossed a windowsill at sunset and the light went into the shell and did not come out again. It has been carrying that one evening around ever since, and it lends it out — to anyone still working when everybody else has gone to bed.' },

  { id: 'wisp', art: true, name: 'Hush', rarity: 'rare', colour: '#8c6fae',
    shape: 'wisp', eyes: 2, top: 'none', mark: 'none',
    age: 'Older than it looks, which is not very', size: 'Hard to say. It keeps changing.',
    lives: 'Wherever the draught is',
    eats: 'Nothing anyone has seen', says: 'A long sigh',
    hobbies: ['Drifting', 'Turning up quietly'],
    best: 'Appearing behind you', worst: 'Staying in one place',
    fact: 'Nobody has ever seen Hush arrive. It is simply there, and then it is not.',
    story: 'A candle was blown out in an empty room and the smoke, with nobody watching it go, kept its shape out of habit. It has been keeping it ever since. It still drifts towards whoever has just come in, the way smoke does.' },

  { id: 'cinder', art: true, name: 'Vesper', rarity: 'rare', colour: '#b68667',
    shape: 'round', eyes: 2, top: 'horns', mark: 'none',
    age: 'Cast for a church that is not there any more', size: 'A hanging lamp, with a great deal underneath',
    lives: 'The bell tower, in the hour before evening',
    eats: 'The last of the light', says: 'One note, and then eight smaller ones answering',
    hobbies: ['Ringing at dusk', 'Counting the hour'],
    best: 'Being heard three fields away', worst: 'Being muffled',
    fact: 'Vesper rings once at dusk whether or not anybody is there to hear it, which is the whole point.',
    story: 'A bell was rung every evening for four hundred years to call people in before dark. The church fell down, the village moved, and the bell went on ringing at dusk out of habit. When the tower finally went too it grew an eye and a set of little bells of its own, and it has not missed an evening yet.' },

  { id: 'mip', art: true, name: 'Ripple', rarity: 'rare', colour: '#5a96c4',
    shape: 'blob', eyes: 1, top: 'tuft', mark: 'freckles',
    age: 'As old as the last time the light moved', size: 'A ribbon, and no thicker',
    lives: 'The shallows, where the light goes in stripes',
    eats: 'Reflections', says: 'Nothing. It only changes colour.',
    hobbies: ['Turning', 'Being a different colour about it'],
    best: 'Never being quite the colour you said', worst: 'Still water',
    fact: 'Ripple has never been the same colour twice and will not be told otherwise.',
    story: 'Sunlight came through moving water onto a sandy bottom and drew those wandering bright lines that will not hold still. One of them wandered off. It has been going ever since, and it has picked up every colour it has passed through on the way.' },

  { id: 'coco', art: true, name: 'Twofold', rarity: 'rare', colour: '#ae6f80',
    shape: 'round', eyes: 2, top: 'ears', mark: 'none',
    age: 'Half as old as it is', size: 'Two of something, or one of two things',
    lives: 'The pond in the old garden, on both sides of it',
    eats: 'One thing, then the opposite', says: 'Yes, and then the other one says no',
    hobbies: ['Circling', 'Disagreeing with itself'],
    best: 'Being two things at once', worst: 'Being asked to pick one',
    fact: 'Twofold is black where it is not white and white where it is not black, and refuses to settle the question.',
    story: 'Two koi were put in the same pond, one black and one white, and they swam in a circle round each other for so many years that they stopped being sure which was which. By the time anyone noticed they had come to an agreement on the matter, and there is only one of them now, and it is still going round.' },

  { id: 'wren', art: true, name: 'Evenfall', rarity: 'rare', colour: '#6f78ae',
    shape: 'drop', eyes: 2, top: 'tuft', mark: 'none',
    age: 'One evening older every evening', size: 'Both hands, spread',
    lives: 'The gap between the last light and the first star',
    eats: 'The last twenty minutes of the day', says: 'Nothing you would hear over the birds going quiet',
    hobbies: ['Coming on slowly', 'Being noticed too late'],
    best: 'Arriving without anybody seeing it start', worst: 'Being timed',
    fact: 'Evenfall carries the first stars on its wings, and lets them go one at a time.',
    story: 'Nobody can say exactly when evening starts. It was decided a long time ago that something must be doing it, and that whatever it was should be left alone to get on with it. This is the something. It opens its wings at the far end of the field and the stars come out of them, and it has never once been caught at it.' },

  { id: 'ember', art: true, name: 'Coalheart', rarity: 'rare', colour: '#bb7a62',
    shape: 'drop', eyes: 2, top: 'horns', mark: 'glow',
    age: 'Older than the hill it sleeps in', size: 'You would not get it through the door',
    lives: 'The bottom of the grate, under the ash',
    eats: 'Coal, and it is fussy about it', says: 'A crack, and then a very long hiss',
    hobbies: ['Sleeping under ash', 'Waking when poked'],
    best: 'Still being warm in the morning', worst: 'Being put out',
    fact: 'Coalheart is the part of the fire that refused to go out, and it has been refusing for a very long time.',
    story: 'A fire was banked down for the night a thousand years ago and never quite went out. Every morning somebody stirred it and it came back. After enough mornings it stopped needing to be stirred, and learned to walk to the coal scuttle by itself.' },

  { id: 'frost', art: true, name: 'Frostfern', rarity: 'rare', colour: '#ae876f',
    shape: 'spike', eyes: 2, top: 'crown', mark: 'swirl',
    age: 'One night old, every night', size: 'A deer, but quieter',
    lives: 'The inside of the cold window, before anyone is up',
    eats: 'Nothing. It only leaves things behind.', says: 'A tick, like glass contracting',
    hobbies: ['Drawing on windows', 'Going before breakfast'],
    best: 'Never repeating a pattern', worst: 'Central heating',
    fact: 'Frostfern draws a different window every night and has never once repeated one.',
    story: 'Somebody breathed on a cold window and drew a deer in it with one finger, then went to bed. In the morning the drawing had gone and the frost had put a whole forest there instead, and something with coral antlers was standing in it, waiting to be looked at.' },

  { id: 'echo', art: true, name: 'Murmur', rarity: 'rare', colour: '#ae756f',
    shape: 'wisp', eyes: 3, top: 'none', mark: 'swirl',
    age: 'Exactly as old as the thing it is copying', size: 'A hanging lamp, roughly',
    lives: 'The long corridor, down at the far end',
    eats: 'Nothing. It only ever seems to.', says: 'Whatever you said, half a second later',
    hobbies: ['Drifting', 'Agreeing'],
    best: 'Saying the right thing, eventually', worst: 'Going first',
    fact: 'Murmur has never had an idea of its own and is perfectly happy about it.',
    story: 'Somebody called out in an empty corridor and the sound never quite finished. It has been folding over itself ever since, keeping every word anyone has said down there, and handing them back one at a time to whoever is passing.' },

  { id: 'sable', art: true, name: 'Duskwing', rarity: 'rare', colour: '#646fb9',
    shape: 'bean', eyes: 2, top: 'ears', mark: 'moon',
    age: 'Six months, all of them after dark', size: 'A pear, with a two-hand wingspan',
    lives: 'The gap behind the wardrobe',
    eats: 'Moths, and it is sorry about Moonmoth', says: 'A click too high for you to hear',
    hobbies: ['Hanging upside down', 'Taking your chair'],
    best: 'Knowing where everything is with its eyes shut', worst: 'Daylight',
    fact: 'Duskwing was in your chair before you stood up. Nobody saw it move.',
    story: 'A pane of blue evening glass fell from a high window over a sleeping bat, and instead of cutting it, settled across its back as wings. It has flown in that colour ever since and will not consider any other.' },

  { id: 'cirrus', art: true, name: 'Maretail', rarity: 'rare', colour: '#b99b65',
    shape: 'cloud', eyes: 2, top: 'none', mark: 'stripes',
    age: 'Thin, high and very old', size: 'A long way up, so it is hard to say',
    lives: 'The highest part of the sky, where it is always cold',
    eats: 'Ice, in very small crystals', says: 'Nothing at that height',
    hobbies: ['Drifting', 'Going before the weather does'],
    best: 'Being the first sign', worst: 'Coming down',
    fact: 'Maretail is always three days ahead of the rain and has never been thanked for it.',
    story: 'The sea sent one fish up to find out what the sky was like. It went so high that it froze, and instead of falling it spread out into a long pale ribbon and stayed there. It still sends word down about the weather, in a language nobody has got round to learning.' },

  { id: 'onyx', art: true, name: 'Hollowmare', rarity: 'rare', colour: '#ae6f88',
    shape: 'square', eyes: 2, top: 'none', mark: 'stars',
    age: 'It remembers the field before the school', size: 'Horse-shaped, and the wrong amount of it',
    lives: 'The long field at the back, in fog',
    eats: 'Nothing. The grass goes flat, and that is all.', says: 'Hoofbeats, from somewhere that is not there',
    hobbies: ['Standing in the fog', 'Being just out of sight'],
    best: 'Knowing what used to be here', worst: 'Being asked about it',
    fact: 'Hollowmare remembers what was here before the school was, and will not say.',
    story: 'A horse went out into the fog on the old field two hundred years ago and the fog kept most of it. What came back has the shape, the sound and the memory, and none of the warmth. It is not unfriendly. It is only very old, and it misses the field.' },

  { id: 'vela', art: true, name: 'Fathom', rarity: 'rare', colour: '#5496ca',
    shape: 'drop', eyes: 2, top: 'fin', mark: 'bubbles',
    age: 'Older than the deepest place it has been', size: 'You would need the whole window',
    lives: 'The part of the sea the light does not reach',
    eats: 'Whatever drifts down, which is most things eventually', says: 'One note, and an hour later, an answer',
    hobbies: ['Singing to something a long way off', 'Going deeper'],
    best: 'Carrying a light where there is none', worst: 'Shallow water',
    fact: 'Fathom has never been to the bottom and thinks about it constantly.',
    story: 'A whale swam under a sky so clear that the stars went into the water with it and did not come back out. It grew antlers of cold coral to hold them steady, and took them down, and now there is a constellation in the deep that the sky has lost track of.' },

  { id: 'snug', art: true, name: 'Rimeworm', rarity: 'epic', colour: '#608bbe',
    shape: 'cloud', eyes: 2, top: 'fringe', mark: 'none',
    age: 'Ten thousand winters, none of them over', size: 'As long as the coldest night is',
    lives: 'The blue crack at the bottom of the glacier',
    eats: 'Warmth, and it is never satisfied', says: 'The crack a lake makes when it freezes right across',
    hobbies: ['Curling up', 'Making frost ferns on other people\'s windows'],
    best: 'Keeping something exactly as it was', worst: 'Thaws',
    fact: 'Rimeworm curls into a ring to sleep, and everything inside the ring stays exactly as it was.',
    story: 'The first frost of the first winter had nowhere to go when spring came, so it went down into the ice and kept going, one ring at a time. It is still down there, mostly, and the cold snap that takes everyone by surprise in February is it turning over in its sleep.' },

  { id: 'luna', art: true, name: 'Moonmoth', rarity: 'epic', colour: '#6c78b1',
    shape: 'tall', eyes: 2, top: 'none', mark: 'stars',
    age: 'Four nights, and it knows it', size: 'Two hands, held open',
    lives: 'The outside of a lit window, all night',
    eats: 'Nothing at all. There is not time.', says: 'The softest possible tapping on glass',
    hobbies: ['Naming stars', 'Circling lamps'],
    best: 'Finding the one light in a dark field', worst: 'Lasting',
    fact: 'Moonmoth has named every star it can see and a few it cannot, and has four nights to tell somebody.',
    story: 'A moth spent its whole short life at a window, watching a moon it could never reach. The moon, which notices these things, printed itself on both wings so that the moth could carry it about. Every one born since has come out already wearing it.' },

  { id: 'puff', art: true, name: 'Wayfinder', rarity: 'epic', colour: '#7d6ab3',
    shape: 'cloud', eyes: 2, top: 'none', mark: 'none',
    age: 'As old as the first person who was lost', size: 'A kite, with the string still on',
    lives: 'Wherever somebody has gone wrong and not noticed',
    eats: 'Wrong turnings', says: 'Nothing, but it turns, and you should look at what it turns towards',
    hobbies: ['Pointing', 'Waiting to be followed'],
    best: 'Knowing which way is back', worst: 'Being ignored',
    fact: 'Wayfinder carries a compass that does not point north. It points the way you meant to go.',
    story: 'A ship\'s compass went over the side in a storm and sank, still turning. On the way down it passed a ray who had never once been lost and did not understand the fuss, and the two came to an arrangement. It has been bringing people back ever since, mostly without being asked.' },

  { id: 'nub', art: true, name: 'Foolscap', rarity: 'epic', colour: '#ba9364',
    shape: 'square', eyes: 2, top: 'none', mark: 'none',
    age: 'Written in 1604 and not finished', size: 'A folded sheet, standing up',
    lives: 'The archive, in the box nobody has opened',
    eats: 'Ink, from the bottle, when it thinks it is unobserved', says: 'The sound of a page being turned in the next room',
    hobbies: ['Keeping a record', 'Getting to the end of the sentence'],
    best: 'Remembering what was written down', worst: 'Damp',
    fact: 'Foolscap has wings of paper and every one of them has something written on it in a hand nobody can read.',
    story: 'A scribe worked on one manuscript for forty years and died three lines from the end. The pages waited to be finished. They waited a very long time. Eventually they got up, taking the unfinished sentence with them, and went to look for somebody who could spell.' },

  { id: 'aurora', art: true, name: 'Hearthstag', rarity: 'epic', colour: '#d49949',
    shape: 'wisp', eyes: 2, top: 'crown', mark: 'glow',
    age: 'Lit at the first fire and not out yet', size: 'A deer, and a bonfire\'s worth of mane',
    lives: 'In front of anything burning properly',
    eats: 'Dry wood, thank you', says: 'The crack a log makes when it settles',
    hobbies: ['Walking through cold rooms', 'Standing in doorways in winter'],
    best: 'Making a room feel like somebody is home', worst: 'Rain',
    fact: 'Hearthstag walks through the house in January and every room it passes through stays warm for an hour.',
    story: 'The first fire anybody lit indoors was so relieved to be out of the weather that it grew legs, to follow the family from room to room. It has never gone out. It still follows, and it still prefers the room with people in it.' },

  { id: 'solis', art: true, name: 'Daybreak', rarity: 'epic', colour: '#d49749',
    shape: 'round', eyes: 1, top: 'halo', mark: 'glow',
    age: 'As many mornings as there have been', size: 'Wider than the window it comes through',
    lives: 'The east side of everything, briefly',
    eats: 'The dark, and it is never quite full', says: 'The first bird, and then all of them',
    hobbies: ['Being early', 'Setting things alight harmlessly'],
    best: 'Arriving exactly on time, always', worst: 'Evenings',
    fact: 'Daybreak has never once been late, in the whole history of mornings.',
    story: 'Every sunrise leaves a little gold behind on the windowsill it came through. Enough mornings piled up on one sill, and one day the pile stood, shook itself out, and went to see about the next one. It has not missed a morning since.' },

  { id: 'tempest', art: true, name: 'Stormhound', rarity: 'epic', colour: '#6f85ae',
    shape: 'spike', eyes: 3, top: 'horns', mark: 'stripes',
    age: 'As many storms as have had names', size: 'Cloud-sized, when it wants to be',
    lives: 'Three days out to sea, coming this way',
    eats: 'Warm water', says: 'A long way off, and then all at once',
    hobbies: ['Gathering', 'Arriving'],
    best: 'Being felt before it is seen', worst: 'Fine weather',
    fact: 'Stormhound takes three days to arrive and eleven minutes to pass.',
    story: 'A wolf ran ahead of a storm for so long that the storm began to follow it instead of the other way round. It runs at the front of every one now, and the wind that hits your face an hour before the rain does is it going past.' },

  { id: 'nimbus', art: true, name: 'Rainwhale', rarity: 'epic', colour: '#aaae6f',
    shape: 'cloud', eyes: 2, top: 'crown', mark: 'swirl',
    age: 'As old as the first wet Tuesday', size: 'Overhead, and further up than it looks',
    lives: 'About four hundred feet above the allotments',
    eats: 'The sea, a little at a time', says: 'Thunder, but the polite kind',
    hobbies: ['Watering things', 'Going where the wind goes'],
    best: 'Raining on gardens that needed it', worst: 'Sports day',
    fact: 'Rainwhale has never once rained on a day nobody minded, and regards this as a matter of professional pride.',
    story: 'A whale breached so hard that it did not come back down, and found the air suited it. It carries a little of the sea wherever it goes and lets some of it fall on gardens that look dry, which is why things grow on its back now.' },

  { id: 'bop', art: true, name: 'Moonstone', rarity: 'legendary', colour: '#aea56f',
    shape: 'round', eyes: 2, top: 'antennae', mark: 'none',
    age: 'One lunar month, over and over', size: 'A jewellery box, and just as full',
    lives: 'The tide line, on the night of a new moon',
    eats: 'Moonlight, and only the reflected sort', says: 'A chime, like two pieces of sea glass',
    hobbies: ['Waxing', 'Waning'],
    best: 'Being full, once a month', worst: 'Cloud',
    fact: 'Moonstone carries a piece of the moon in its shell and gives back exactly as much light as it was given.',
    story: 'The moon dropped something small into the sea a very long time ago and has been quietly looking for it since. A crab found it first, put it on, and discovered it grew and dimmed on a schedule it had no say in. It goes out on the tide line on new-moon nights, which is either kindness or showing off.' },

  { id: 'zuzu', art: true, name: 'Armillary', rarity: 'legendary', colour: '#b89466',
    shape: 'cloud', eyes: 3, top: 'tuft', mark: 'stars',
    age: 'Set turning in 1543 and not stopped', size: 'A globe, and the room to swing it',
    lives: 'The observatory, inside its own rings',
    eats: 'Nothing. It is a model, not a creature. It disputes this.', says: 'A slow creak on the equinox',
    hobbies: ['Turning', 'Being right about where everything is'],
    best: 'Knowing where every single thing is', worst: 'Being adjusted',
    fact: 'Armillary has one eye at the centre of its rings and it has never once blinked.',
    story: 'An instrument-maker built a model of the heavens so accurate that it began, very slightly, to pull. Over three hundred years it drew in dust, then light, then something that could look back out. It still shows exactly where everything is. The argument about whether it is alive has been going on almost as long, and it has an opinion.' },

  { id: 'kip', art: true, name: 'Filigree', rarity: 'legendary', colour: '#b3966a',
    shape: 'bean', eyes: 2, top: 'fringe', mark: 'stripes',
    age: 'Made on commission, never collected', size: 'A lantern, if a lantern could fly',
    lives: 'The glass case at the back of the museum',
    eats: 'One drop of oil, at the solstice', says: 'A sound like a very small orchestra tuning',
    hobbies: ['Catching the light', 'Being wound'],
    best: 'Being the most beautiful thing in the room', worst: 'Being handled',
    fact: 'Filigree\'s wings are stained glass in a brass frame, and no two panes throw the same colour.',
    story: 'A jeweller spent eleven years making a moth out of brass and coloured glass for somebody who never came to collect it. On the night it was finished she opened the workshop window to let the air in, and it left. It turns up in museums from time to time, in a case nobody remembers filling.' },

  { id: 'zenith', art: true, name: 'Meridian', rarity: 'legendary', colour: '#d49e49',
    shape: 'tall', eyes: 3, top: 'crown', mark: 'stars',
    age: 'As old as the best day you have had', size: 'Longer than the room, and lighter than the air in it',
    lives: 'The top of the sky, at midday exactly',
    eats: 'Finished work', says: 'Nothing. It simply arrives, and you know.',
    hobbies: ['Arriving at the end of things', 'Being the highest point'],
    best: 'Turning up on the day you got everything done', worst: 'Being waited for',
    fact: 'Meridian turns up only when somebody has done everything they set out to do, and it has been a quiet century.',
    story: 'Every time anyone finished everything they meant to, the feeling went up. It kept going up. It got to the top of the sky and found there was nowhere further, so it grew wings and stayed, and it comes back down on the days it is earned.' },

  { id: 'eclipse', art: true, name: 'Totality', rarity: 'legendary', colour: '#af916e',
    shape: 'round', eyes: 1, top: 'halo', mark: 'glow',
    age: 'Counted in centuries, and only the dark parts', size: 'Exactly the size of the sun, from here',
    lives: 'Between the light and you',
    eats: 'Daylight, briefly', says: 'Absolute silence, for four minutes',
    hobbies: ['Lining things up', 'Making birds go quiet'],
    best: 'Stopping everything at once', worst: 'Being predicted',
    fact: 'When Totality opens its eye the birds stop singing, and nobody has ever taught them to.',
    story: 'Once, for four minutes, the moon stood exactly in front of the sun and every bird in the country stopped mid-song. Something was watching from inside that shadow. When the light came back the shadow stayed behind, and it has had one gold eye and a ring of light over its head ever since.' },
];

const MONSTER_COUNT = MONSTERS.length;
const monsterById = (id) => MONSTERS.find(m => m.id === id) || null;

/** Everyone who has turned up, oldest first. */
function collectedMonsters() {
  const met = state.progress.metAt || {};
  return MONSTERS.filter(m => met[m.id]).sort((a, b) => met[a.id] - met[b.id]);
}

/* ── The companion ─────────────────────────────────────────
   One of the creatures you have found comes out of the book and sits on your
   profile. The point of it is the counting: homework finished while they are
   your companion is finished *with* them, and their page says so. Nothing
   here changes what homework is or how it is written down — it only gives
   what you already do to somebody. */

/** The creature on the profile, or null while none has been chosen. */
function companionMonster() {
  return monsterById(state.progress.companion);
}

/** Only somebody you have actually met can take the job. */
function setCompanion(id) {
  const met = state.progress.metAt || {};
  state.progress.companion = (id && met[id]) ? id : null;
  save();
}

const isFavourite = (id) => (state.progress.favourites || []).includes(id);

function toggleFavourite(id) {
  const list = state.progress.favourites || (state.progress.favourites = []);
  const at = list.indexOf(id);
  if (at < 0) list.push(id); else list.splice(at, 1);
  save();
  return at < 0;
}

/** How much has been finished with somebody, and the last few of them. */
function togetherFor(id) {
  const t = (state.progress.together || {})[id];
  return { n: (t && t.n) || 0, recent: (t && Array.isArray(t.recent)) ? t.recent : [] };
}

/* Only the last few are kept. The number is the whole count; the list is the
   three the page has room to show, and there is no screen that wants more. */
const MEMORY_SLOTS = 3;

/* The companion is written onto the task, not just counted. A task finished
   three companions ago still knows whose it was, which is the only way undo
   can take the credit back off the right one. */
function recordTogether(hw) {
  const id = state.progress.companion;
  if (!id) return;
  const all = state.progress.together || (state.progress.together = {});
  const t = all[id] || (all[id] = { n: 0, recent: [] });
  hw.withId = id;
  t.n += 1;
  t.recent.unshift({ id: hw.id, t: hw.title, s: hw.subjectId, at: hw.completedAt });
  t.recent = t.recent.slice(0, MEMORY_SLOTS);
}

function forgetTogether(hw) {
  const t = (state.progress.together || {})[hw.withId];
  delete hw.withId;
  if (!t) return;
  t.n = Math.max(0, t.n - 1);
  const at = t.recent.findIndex(r => r.id === hw.id);
  if (at >= 0) t.recent.splice(at, 1);
}

/** Days in a row ending today or yesterday with something finished on them. */
function dayStreak() {
  const days = new Set(state.homework
    .filter(h => h.completed && h.completedAt)
    .map(h => dayKey(new Date(h.completedAt))));
  if (!days.size) return 0;

  // Yesterday still counts: a streak should not break because it is 9am and
  // today has not been started yet.
  const day = new Date();
  if (!days.has(dayKey(day))) {
    day.setDate(day.getDate() - 1);
    if (!days.has(dayKey(day))) return 0;
  }
  let n = 0;
  while (days.has(dayKey(day))) { n++; day.setDate(day.getDate() - 1); }
  return n;
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
 * One creature, however it is drawn.
 *
 * Thirty-nine of the fifty are paintings and the rest are still the flat
 * drawing the app made itself. Everywhere that shows a creature calls this,
 * so neither kind needs a second code path — and a creature whose picture
 * fails to load falls back to nothing rather than to a broken image, because
 * the flat drawing is still under it.
 */
function monsterPic(m, { locked = false } = {}) {
  if (!m.art) return monsterSvg(m, { locked });

  const src = `art/mon/${m.id}.webp`;
  if (!locked) {
    return `<img class="mon mon-art" src="${src}" data-mon="${m.id}" alt=""
                 aria-hidden="true" width="448" height="448"
                 loading="lazy" decoding="async" />`;
  }
  // The silhouette is the painting with its colour taken out, which is a
  // truer outline than anything that could be drawn to stand in for it — and
  // it costs nothing, since the file is the same file.
  return `<span class="mon mon-lock" aria-hidden="true">
            <img class="mon-art mon-hidden" src="${src}" data-mon="${m.id}" alt=""
                 width="448" height="448" loading="lazy" decoding="async" />
            <b class="mon-q">?</b>
          </span>`;
}

/* The paintings are 1.5MB between them, which is twice the rest of the app,
   so they are not downloaded with it — each is kept the first time it is
   actually looked at. Two things follow from that.
 *
 * One: a painting that has not been looked at yet, on a phone with no signal,
 * would leave a hole where a creature should be. It falls back to the flat
 * drawing instead, which is still in the code and costs nothing to draw. The
 * listener is on the window with capture on, because an image that fails to
 * load fires an error that does not bubble.
 */
function wireArtFallback() {
  window.addEventListener('error', (e) => {
    const img = e.target;
    if (!img || img.tagName !== 'IMG' || !img.classList.contains('mon-art')) return;
    const m = monsterById(img.dataset.mon);
    if (!m) return;
    const locked = img.classList.contains('mon-hidden');
    const holder = locked ? img.closest('.mon-lock') : img;
    if (holder) holder.outerHTML = monsterSvg(m, { locked });
  }, true);
}

/* Two: the creatures you already have are the ones you will actually look at,
 * and there are rarely more than a handful, so those are fetched quietly once
 * the app is up. After that the book, the profile and the hatching all work
 * with no signal at all. */
function warmOwnArt() {
  for (const m of collectedMonsters()) {
    if (m.art) new Image().src = `art/mon/${m.id}.webp`;
  }
}

/**
 * One creature, drawn by hand. `locked` gives back only its silhouette, so
 * what is still to come stays a surprise.
 */
function monsterSvg(m, { locked = false } = {}) {
  if (locked) {
    /* The outline is the creature’s own — its body, whatever is on its head,
       its feet — flattened to one colour. Fifty identical blobs would say
       nothing about how different they are; this says that much and no more.
       The few tops that are drawn in their own colours (a sprout, a crown)
       are flattened with the rest, or they would give the game away. */
    const flat = (svg) => svg.replace(/(fill|stroke)="#[0-9A-Fa-f]{3,8}"/g, `$1="currentColor"`);
    return `<svg class="mon" viewBox="0 0 100 100" aria-hidden="true">
              <g class="mon-hidden" fill="currentColor">
                <ellipse cx="38" cy="86" rx="8" ry="5" /><ellipse cx="62" cy="86" rx="8" ry="5" />
                ${flat(topOf(m.top, `currentColor`))}
                ${bodyPath(m.shape)}
              </g>
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


/* Five pieces of homework to a level, and an egg at every level.

   It is the award per piece that moved, not the size of a level: leaving the
   level at a hundred means nobody who is already level seven wakes up at
   level fourteen, and every screen that shows XP reads from these two so it
   follows on its own. Somebody part-way through on the old rate reaches the
   next egg a piece or two early, once, which seemed the kinder rounding. */
const XP_PER_HOMEWORK = 20;
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

/* A clock face the country would recognise. The browser default follows the
   language, which gets it wrong the moment the two differ — an English
   speaker in Israel was being shown 01:27 PM for a country that has never
   written a time that way. */
const timeLabel = (ts) =>
  new Date(ts).toLocaleTimeString(locale(),
    { hour: '2-digit', minute: '2-digit', hour12: !country().clock24 });


/* ── Store ─────────────────────────────────────────────────── */

const blank = () => ({
  version: 1,
  updatedAt: 0,
  homework: [],
  notes: [],
  extraSubjects: [],     // anything older data filed under a subject not on the timetable

  /* companion:  whose face is on the profile, and who gets the credit for
                what you finish. null until one is chosen.
     favourites: ids hearted on a creature page.
     together:   per creature, how many tasks were finished while they were
                the companion, and the last few of them. */
  progress: { xp: 0, level: 1, shownUpTo: 1, metAt: {},
              companion: null, favourites: [], together: {} },
  settings: {
    /* Three reminders, each a switch and a time. The first asks you to write
       today's homework down, the second to pack for tomorrow, and the third
       only goes out if there is still something unfinished to go out about. */
    dailyReminderEnabled: false, dailyReminderTime: '15:00',
    bagReminderEnabled: false, bagReminderTime: '20:00',
    finishReminderEnabled: false, finishReminderTime: '18:00',
    // null until somebody chooses; the phone is asked the first time.
    lang: null,
    // Which country's week and clock to keep. null means the phone's.
    country: null,
    // 'light', 'dark', or null for whatever the phone is set to.
    theme: null,
  },
  // null until the week is edited; then { periods, schedule } of your own.
  timetable: null,
  /* The third link only. kit is what each lesson needs, by lesson name;
     kitEveryDay is what goes in whatever the lessons are; setupDone says the
     questions have been answered and the app proper can open. */
  kit: {},
  kitEveryDay: null,
  setupDone: false,
  lastSubjectId: null,
});

let state = blank();

/** Fold saved data onto current defaults, so data written by an older
 *  version still picks up settings added since. */
/** The lesson an older, hand-picked subject name was clearly meant to be. */
function lessonForOldName(name) {
  const n = String(name || '').toLowerCase();
  if (!n) return null;
  for (const lesson of lessons()) {
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
  next.progress = Object.assign({ xp: 0, level: 1, shownUpTo: 1, metAt: {},
                                  companion: null, favourites: [], together: {} },
                                next.progress);
  if (!next.progress.metAt || typeof next.progress.metAt !== "object") next.progress.metAt = {};
  if (!Array.isArray(next.progress.favourites)) next.progress.favourites = [];
  if (!next.progress.together || typeof next.progress.together !== "object") next.progress.together = {};
  // A companion you have not met cannot be your companion — which is what a
  // half-written save, or a creature removed from the fifty, would leave behind.
  if (!monsterById(next.progress.companion) || !next.progress.metAt[next.progress.companion]) {
    next.progress.companion = null;
  }
  // Anyone who was here before there was a choice gets the phone asked for them.
  if (!LANGS.some(l => l.key === next.settings.lang)) next.settings.lang = null;
  if (!['light', 'dark'].includes(next.settings.theme)) next.settings.theme = null;
  if (!COUNTRIES.some(c => c.key === next.settings.country)) next.settings.country = null;
  next.settings.finishReminderEnabled = !!next.settings.finishReminderEnabled;
  if (!/^\d\d:\d\d$/.test(next.settings.finishReminderTime || '')) next.settings.finishReminderTime = '18:00';
  // A week edited into a shape the app cannot draw is worse than no week.
  if (!next.timetable
      || !Array.isArray(next.timetable.periods)
      || !Array.isArray(next.timetable.schedule)
      || next.timetable.schedule.some(r => !Array.isArray(r))) {
    next.timetable = null;
  }
  if (!next.kit || typeof next.kit !== 'object') next.kit = {};
  if (next.kitEveryDay != null && !Array.isArray(next.kitEveryDay)) next.kitEveryDay = null;
  next.setupDone = !!next.setupDone;
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
  warmOwnArt();     // the ones you already have, so the book works with no signal
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
    renderProfile(); renderLangPick(); renderAbout();
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
  const day = schoolDays()[bagDay];
  $('#bag-sub').textContent = bagDay === today
    ? tr('bag.dayToday', { day: dayName(day.js) })
    : dayName(day.js);

  $('#bag-days').innerHTML = schoolDays().map((d, i) => `
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
  /* Drawn once and then left alone, which was right while the week was a
     constant. It is not one any more — the editor changes it, and the third
     link starts without one at all, so the button was a blank circle until
     the app was reloaded. It keeps a signature of what it drew instead. */
  const mark = schedule().map(r => r.join('')).join('');
  if (btn.dataset.week === mark) return;
  btn.dataset.week = mark;
  btn.innerHTML = '<span class="tt-mini">' + schoolDays().map((d, i) =>
    '<span class="tt-mini-col">' + (schedule()[i] || []).slice(0, 6).map(name => {
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
  const week = schoolDays();
  for (let n = 1; n <= week.length; n++) {
    const i = ((tomorrow < 0 ? 0 : tomorrow) + n) % week.length;
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
    ${schoolDays().map((d, i) => `
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
  // One tap is quick and undoable, which is the bargain the board makes.
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
  const lastUsed = schedule().reduce((m, row) => {
    for (let i = row.length - 1; i >= 0; i--) if (row[i]) return Math.max(m, i);
    return m;
  }, 0);

  $('#tt-body').innerHTML = `
    <div class="tt-scroll">
      <table class="tt-grid">
        <thead>
          <tr>
            <th class="tt-corner"></th>
            ${schoolDays().map((d, i) => `
              <th class="${i === today ? 'is-today' : ''}">
                <span class="tt-day">${esc(dayShort(d.js))}</span>
                <span class="tt-day-he">${esc(lang === 'he' ? d.en : d.he)}</span>
              </th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${periods().slice(0, lastUsed + 1).map((time, p) => `
            <tr>
              <th class="tt-time"><span class="tt-num">${p + 1}</span><span>${esc(time)}</span></th>
              ${schoolDays().map((d, i) => {
                const name = (schedule()[i] || [])[p];
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
  renderCompanionBanner();
  renderBookCover();
  renderCollection();
}

/* The book sits on the creatures page now rather than on the profile, which
   is where everything about the creatures should have been all along. Its
   cover carries the count and the last three faces you found. */
function renderBookCover() {
  const found = collectedMonsters();
  const cover = $('#book-count');
  if (cover) {
    cover.textContent = found.length >= MONSTER_COUNT
      ? tr('book.allFoundOf', { n: MONSTER_COUNT })
      : tr('book.countFound', { have: found.length, all: MONSTER_COUNT });
  }
  const peek = $('#book-peek');
  if (peek) {
    peek.innerHTML = found.slice(-3).map(x =>
      `<span class="bc-peek" style="--mc:${x.colour}">${monsterPic(x)}</span>`).join('');
  }
}
/* ── Who you are, at the top of the profile ────────────────
   The companion is the face of it. There is no name to show — the app never
   asked for one — so the heading is the level, which is the thing the app
   does actually know about you and the thing that goes up. */
function renderProfileTop() {
  const m = companionMonster();
  const found = collectedMonsters();
  const done = state.homework.filter(h => h.completed).length;

  const into = state.progress.xp % XP_PER_LEVEL;
  const allFound = found.length >= MONSTER_COUNT;
  const you = $('#pro-you');
  if (you) {
    you.innerHTML = `
      <span class="pro-avatar ${m ? '' : 'is-empty'}" ${m ? `style="--mc:${m.colour}"` : ''}
            aria-hidden="true">
        ${m ? monsterPic(m)
            : '<img src="art/set/sprout.webp" alt="" width="300" height="266" decoding="async" />'}
        ${m ? '<span class="pro-badge"><svg class="ico" aria-hidden="true"><use href="#i-leaf" /></svg></span>' : ''}
      </span>
      <h2 class="pro-name">${esc(tr('lvl.level', { n: levelFor(state.progress.xp) }))}</h2>
      <div class="pro-bar">
        <div class="bar"><div class="bar-fill" style="width:${allFound ? 100 : (into / XP_PER_LEVEL) * 100}%"></div></div>
        <span>${esc(allFound ? tr('book.allFifty') : tr('lvl.untilEgg', { n: XP_PER_LEVEL - into }))}</span>
      </div>
      <p class="pro-role">${esc(m ? tr('book.withYou', { name: m.name }) : tr('set.firstCreature'))}</p>
      ${m ? `<span class="pro-pill">${esc(tr('cmp.pillTag', { name: m.name }))}</span>` : ''}`;
  }

  const stats = $('#pro-stats');
  if (stats) {
    const row = [
      [done, tr('pro.sTasks')],
      [found.length, tr('pro.sCreatures')],
      [dayStreak(), tr('pro.sStreak')],
    ];
    stats.innerHTML = `<div class="card pro-stat-row">${row.map(([n, label]) => `
      <span class="pro-stat"><b>${n}</b><span>${esc(label)}</span></span>`).join('')}</div>`;
  }

  const card = $('#pro-companion');
  if (card) {
    if (!m) {
      card.innerHTML = found.length ? `
        <button id="pro-pick" class="card pro-cmp is-empty">
          <span class="pro-cmp-words">
            <span class="cmp-kicker">${esc(tr('cmp.mine'))}</span>
            <strong>${esc(tr('cmp.none'))}</strong>
            <em>${esc(tr('cmp.noneSub'))}</em>
          </span>
          <svg class="ico ico-go" aria-hidden="true"><use href="#i-chevron" /></svg>
        </button>` : '';
    } else {
      const { n } = togetherFor(m.id);
      card.innerHTML = `
        <div class="card pro-cmp" style="--mc:${m.colour}">
          <span class="pro-cmp-art" aria-hidden="true">${monsterPic(m)}</span>
          <span class="pro-cmp-words">
            <span class="cmp-kicker">${esc(tr('cmp.mine'))}</span>
            <strong>${esc(m.name)}</strong>
            <em>${esc(n === 0 ? tr('cmp.tasks0') : n === 1 ? tr('cmp.tasks1') : tr('cmp.tasks', { n }))}</em>
            <button id="pro-change" class="btn-pill">
              ${esc(tr('cmp.change'))}<svg class="ico" aria-hidden="true"><use href="#i-chevron" /></svg>
            </button>
          </span>
        </div>`;
    }
  }

}
/* ── Appearance ────────────────────────────────────────────
   Light, dark, or whatever the phone says. The stylesheet carries two full
   palettes and gates them on data-theme, so all this has to do is say which
   — and say nothing at all when the answer is "ask the phone". */
const THEMES = ['system', 'light', 'dark'];
function applyTheme() {
  const root = document.documentElement;
  const pick = state.settings.theme;
  if (pick === 'light' || pick === 'dark') root.setAttribute('data-theme', pick);
  else root.removeAttribute('data-theme');
}
function renderThemePick() {
  const box = $('#theme-pick');
  if (!box) return;
  const on = state.settings.theme || 'system';
  box.innerHTML = THEMES.map(k => `
    <button class="p-chip ${k === on ? 'is-on' : ''}" data-theme-pick="${k}"
            aria-pressed="${k === on}">${esc(tr('theme.' + k))}</button>`).join('');
}
function setTheme(key) {
  state.settings.theme = key === 'system' ? null : key;
  save();
  applyTheme();
  syncTopColour();
  renderThemePick();
}
/* ── Country ───────────────────────────────────────────────
   Changing it changes the week, so everything that draws a week has to be
   drawn again — and the bag, which is looked at by day, could be sitting on a
   day the new week does not have. */
function renderCountryPick() {
  const box = $('#country-pick');
  if (!box) return;
  const on = country().key;
  box.innerHTML = COUNTRIES.map(c => `
    <button class="p-chip ${c.key === on ? 'is-on' : ''}" data-country="${c.key}"
            aria-pressed="${c.key === on}">${esc(tr('country.' + c.key))}</button>`).join('');
}
function setCountry(key) {
  if (!COUNTRIES.some(c => c.key === key)) return;
  state.settings.country = key;
  bagDay = Math.min(bagDay, schoolDays().length - 1);
  save();
  renderCountryPick();
  render();
}
/* ── Everything you have finished ──────────────────────────
   It used to be a list halfway down the Profile, which meant a term's work
   pushed the settings off the bottom of the screen. It is a page of its own
   now, behind one row, grouped by the day it was finished. */
function renderDonePage() {
  const box = $('#done-body');
  if (!box) return;
  const done = state.homework
    .filter(h => h.completed && h.completedAt)
    .sort((a, b) => b.completedAt - a.completedAt);
  if (!done.length) {
    box.innerHTML = `<p class="foot-note is-big">${esc(tr('done.none'))}</p>`;
    return;
  }
  let html = `<p class="done-total">${esc(tr('done.count', { n: done.length }))}</p>`;
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
function openDonePage() {
  const page = $('#done-page');
  if (!page) return;
  renderDonePage();
  page.hidden = false;
  page.classList.remove('is-leaving');
  page.scrollTop = 0;
}
function closeDonePage() {
  const page = $('#done-page');
  if (!page || page.hidden) return;
  page.classList.add('is-leaving');
  setTimeout(() => { page.hidden = true; page.classList.remove('is-leaving'); }, 240);
}
/* ── Editing the week ──────────────────────────────────────
   A copy is made when the editor opens and nothing is written to the store
   until Save, so backing out leaves the week exactly as it was. The grid is
   the same shape the timetable draws: one row per period, one column per
   school day, and a cell is a lesson name or nothing at all.
   Lesson names are typed rather than picked from a list, because the list of
   subjects is built *from* the timetable — a subject cannot be offered before
   the lesson that invents it exists. */
/* ── Setting the third link up ─────────────────────────────
   Three questions, asked once, on the first launch of the link that has no
   week of its own.

   1. Your week. Paste it, or fill the grid.
   2. What it made of that — the same grid, to correct.
   3. What each lesson needs — guessed, to correct.

   Nothing is written to the store until the last step is finished, so
   backing out of the middle of it leaves an app that still has no week and
   will ask again. That is deliberate: a half-answered setup is worse than an
   unanswered one, because it looks finished.
*/

/* ── A photo of your timetable ─────────────────────────────
   You have a timetable on paper, or on a noticeboard, or in a message. This
   part gets it onto the phone and keeps it there; reading it is the next
   section's job. Either way the photo earns its place, because it sits above
   the grid while the grid is filled in or checked, and that turns
   looking-at-paper-then-looking-at-phone into reading one screen.

   It is kept under a key of its own rather than inside the saved state. The
   state is written out again every time you tick a piece of homework, and
   dragging a couple of hundred kilobytes of photograph through that on every
   tap would be felt. It also means a full storage quota loses the photo and
   not the homework.

   The photo never leaves the phone. There is nowhere for it to go: the app
   has no server. */

const photoKey = () => STORAGE_KEY + '.photo';

function loadPhoto() {
  try { return localStorage.getItem(photoKey()); } catch { return null; }
}

function savePhoto(dataUrl) {
  try {
    localStorage.setItem(photoKey(), dataUrl);
    return true;
  } catch {
    // A photo is worth less than the homework; if there is no room, say so
    // rather than taking the room from something that matters more.
    return false;
  }
}

function clearPhoto() {
  try { localStorage.removeItem(photoKey()); } catch { /* nothing to do */ }
}

/* Straight off a phone camera a photo is four thousand pixels wide and three
   megabytes, and localStorage is measured in five. Shrunk to sixteen hundred
   on its long edge it is still sharp enough to read a timetable off, and it
   fits. The shrink happens here rather than on the way out, so it is paid for
   once. */
const PHOTO_EDGE = 1600;
const PHOTO_QUALITY = 0.72;

function readPhotoFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type)) { reject(new Error('not a picture')); return; }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('unreadable'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('not a picture'));
      img.onload = () => {
        const scale = Math.min(1, PHOTO_EDGE / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        const x = c.getContext('2d');
        x.imageSmoothingQuality = 'high';
        x.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', PHOTO_QUALITY));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/* The way to add one. A file input rather than a button that opens one,
   because a label pointed at an input is the only thing a phone reliably
   offers the camera for — capture="environment" asks for the back camera,
   and a phone that would rather show the photo roll still may. */
function photoAdd(scope) {
  return `
    <div class="tt-photo-ways">
      <label class="tt-photo-add">
        <svg class="ico" aria-hidden="true"><use href="#i-camera" /></svg>
        <span>${esc(tr('photo.take'))}</span>
        <input type="file" accept="image/*" capture="environment"
               data-photo="${scope}" hidden />
      </label>
      <label class="tt-photo-add">
        <svg class="ico" aria-hidden="true"><use href="#i-pictures" /></svg>
        <span>${esc(tr('photo.pick'))}</span>
        <input type="file" accept="image/*" data-photo="${scope}" hidden />
      </label>
    </div>`;
}

/** The photo above whichever grid is being filled in, or nothing. */
function photoStrip() {
  const src = loadPhoto();
  if (!src) return '';
  return `
    <figure class="tt-photo">
      <button class="tt-photo-open" data-photo-open aria-label="${esc(tr('photo.open'))}">
        <img src="${src}" alt="${esc(tr('photo.alt'))}" />
      </button>
      <figcaption>
        <div class="tt-photo-acts">
          <button class="tt-photo-read" data-photo-read>
            <svg class="ico" aria-hidden="true"><use href="#i-search" /></svg>
            <span>${esc(tr('photo.read'))}</span>
          </button>
          <button class="tt-photo-drop" data-photo-drop>${esc(tr('photo.remove'))}</button>
        </div>
        <p class="tt-photo-say" data-photo-say>${esc(tr('photo.caption'))}</p>
      </figcaption>
    </figure>`;
}

/** The whole photo, as big as the screen will allow. */
function openPhoto() {
  const src = loadPhoto();
  if (!src) return;
  const box = $('#photo-view');
  box.innerHTML = `<img src="${src}" alt="${esc(tr('photo.alt'))}" />`;
  box.hidden = false;
}

function closePhoto() {
  const box = $('#photo-view');
  if (!box || box.hidden) return;
  box.hidden = true;
  box.innerHTML = '';
}

/**
 * A file chosen, from the camera or the roll.
 *
 * `redraw` is passed in rather than assumed, because the same button appears
 * in the setup and in the timetable editor and they redraw different things.
 */
async function takePhoto(input, redraw) {
  const file = input.files && input.files[0];
  input.value = '';                       // so choosing the same file twice works
  if (!file) return;
  try {
    const small = await readPhotoFile(file);
    if (!savePhoto(small)) { showToast(tr('photo.noRoom')); return; }
    redraw();
  } catch {
    showToast(tr('photo.bad'));
  }
}


const SETUP_STEPS = ['week', 'check', 'kit'];
let setupAt = 0;
let setupDraft = null;

/** The third link, before it has been told anything. */
const needsSetup = () => PROFILE.id === 'own' && !state.setupDone;

/* ── Reading the photograph ────────────────────────────────
   Recognising the words is the easy half and not the useful half. An OCR
   engine hands back text in reading order, and a timetable read in reading
   order is a heap of lesson names with no idea which day or which period any
   of them belongs to. What makes it a timetable again is *where* each word
   was on the page — so everything below works on the boxes, not the text.

   The engine is fetched only when this is actually asked for. It is several
   megabytes and most people will never tap the button; making everybody
   download it on the off-chance would be the wrong way round.
*/

const OCR_LIB = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
const OCR_CORE = 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.1';
const OCR_LANGS = 'https://tessdata.projectnaptha.com/4.0.0_fast';

let ocrLoading = null;

function loadOcr() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  if (ocrLoading) return ocrLoading;
  ocrLoading = new Promise((resolve, reject) => {
    const tag = document.createElement('script');
    tag.src = OCR_LIB;
    tag.onload = () => resolve(window.Tesseract);
    tag.onerror = () => { ocrLoading = null; reject(new Error('no engine')); };
    document.head.appendChild(tag);
  });
  return ocrLoading;
}

/* Handed the photo as it was saved, the engine reads gibberish: a printed
   timetable photographed at sixteen hundred pixels has letters about fifteen
   pixels tall, and the engine wants roughly twice that. It also reads in grey,
   so the colour is only in the way — and on a cream page with black ink,
   throwing the colour away and pulling the contrast apart is the whole
   difference between "ime nen we ate" and "Time Sun Mon Tue Wed Thu". Both
   were measured; neither was guessed.

   There are two ways of finishing, because photographs differ. Stretching the
   contrast about the middle suits a page that was lit evenly. A page held in
   one hand under a ceiling light is brighter at one corner than the other, and
   a single threshold for the whole of it then blows out the bright end and
   fills in the dark end; comparing each pixel against the average of the patch
   around it instead keeps the ink and drops the shadow. Neither wins every
   time, so both are tried and the better reading is kept. */
const OCR_EDGE = 3200;
const OCR_CONTRAST = 1.8;
const OCR_INK = 10;

/* The mean of the patch around every pixel, by two sliding windows — one
   across and one down. A summed-area table would do the same job, but it wants
   eight bytes a pixel and this wants one, which on a phone holding a whole OCR
   engine in memory is the difference worth having. */
function boxMean(grey, w, h, r) {
  const across = new Uint8ClampedArray(w * h);
  for (let y = 0; y < h; y++) {
    const row = y * w;
    let sum = 0, n = 0;
    for (let x = 0; x <= Math.min(r, w - 1); x++) { sum += grey[row + x]; n++; }
    for (let x = 0; x < w; x++) {
      across[row + x] = sum / n;
      const drop = x - r, add = x + r + 1;
      if (drop >= 0) { sum -= grey[row + drop]; n--; }
      if (add < w) { sum += grey[row + add]; n++; }
    }
  }
  const down = new Uint8ClampedArray(w * h);
  for (let x = 0; x < w; x++) {
    let sum = 0, n = 0;
    for (let y = 0; y <= Math.min(r, h - 1); y++) { sum += across[y * w + x]; n++; }
    for (let y = 0; y < h; y++) {
      down[y * w + x] = sum / n;
      const drop = y - r, add = y + r + 1;
      if (drop >= 0) { sum -= across[drop * w + x]; n--; }
      if (add < h) { sum += across[add * w + x]; n++; }
    }
  }
  return down;
}

function prepPhoto(img, how) {
  const scale = Math.min(2, OCR_EDGE / Math.max(img.width, img.height));
  const c = document.createElement('canvas');
  c.width = Math.round(img.width * scale);
  c.height = Math.round(img.height * scale);
  const x = c.getContext('2d', { willReadFrequently: true });
  x.imageSmoothingQuality = 'high';
  x.drawImage(img, 0, 0, c.width, c.height);

  const frame = x.getImageData(0, 0, c.width, c.height);
  const px = frame.data;
  const grey = new Uint8ClampedArray(c.width * c.height);
  for (let i = 0, q = 0; i < px.length; i += 4, q++) {
    grey[q] = px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114;
  }

  if (how === 'ink') {
    const mean = boxMean(grey, c.width, c.height, Math.max(8, Math.round(c.width / 40)));
    for (let q = 0, at = 0; q < grey.length; q++, at += 4) {
      px[at] = px[at + 1] = px[at + 2] = grey[q] < mean[q] - OCR_INK ? 0 : 255;
    }
  } else {
    for (let q = 0, at = 0; q < grey.length; q++, at += 4) {
      const v = (grey[q] - 128) * OCR_CONTRAST + 128;
      px[at] = px[at + 1] = px[at + 2] = v < 0 ? 0 : v > 255 ? 255 : v;
    }
  }
  x.putImageData(frame, 0, 0);
  // PNG, not JPEG: a second round of block artefacts on text already read
  // once through a phone camera is not worth the kilobytes saved.
  return { url: c.toDataURL('image/png'), width: c.width };
}

/* One worker, kept for the length of a read: creating it downloads the
   language data, and a second attempt at a different page mode should not pay
   for that twice. It is let go afterwards, because it is tens of megabytes of
   engine sitting in a phone's memory for a job that is over — and the language
   data it downloaded stays in the browser's own store, so asking again is
   quick. */
let ocrWorker = null;

async function dropOcrWorker() {
  const w = ocrWorker;
  ocrWorker = null;
  if (w) { try { await w.terminate(); } catch { /* already gone */ } }
}

async function getOcrWorker(onProgress) {
  if (ocrWorker) return ocrWorker;
  const T = await loadOcr();
  ocrWorker = await T.createWorker('heb+eng', 1, {
    corePath: OCR_CORE,
    langPath: OCR_LANGS,
    logger: (m) => { if (m.progress != null) onProgress(m.progress * 0.5); },
  });
  return ocrWorker;
}

/**
 * Every word the engine found, with the box it found it in — and, kept
 * separately, the engine's own grouping of those words into lines.
 *
 * That grouping is worth having. Working out which words share a line of a
 * photographed table is the hard part, the engine has already done it properly
 * (it deskews, it knows about baselines), and rediscovering it by clustering
 * the boxes afterwards is both extra work and worse. It is kept apart from the
 * flat list rather than replacing it, because a photo the engine makes nothing
 * of still has words in it worth clustering by hand.
 */
async function wordsInPhoto(url, mode, onProgress) {
  const worker = await getOcrWorker(onProgress);
  await worker.setParameters({ tessedit_pageseg_mode: String(mode) });
  const { data } = await worker.recognize(url);
  onProgress(1);

  const keep = (w) => {
    const text = (w.text || '').trim();
    if (!text || (w.confidence != null && w.confidence < 40)) return null;
    const b = w.bbox || {};
    if (b.x1 - b.x0 <= 0 || b.y1 - b.y0 <= 0) return null;
    return { text, x0: b.x0, y0: b.y0, x1: b.x1, y1: b.y1 };
  };

  const lines = [];
  for (const block of data.blocks || []) {
    for (const para of block.paragraphs || []) {
      for (const line of para.lines || []) {
        const words = (line.words || []).map(keep).filter(Boolean);
        if (words.length) lines.push(words);
      }
    }
  }
  if (lines.length) {
    // Down the page, whatever order the engine walked its blocks in.
    lines.sort((a, b) => median(a.map(w => mid(w.y0, w.y1))) -
                         median(b.map(w => mid(w.y0, w.y1))));
    return { words: [].concat(...lines), lines };
  }

  // Older shapes hand back a flat list and no tree.
  const words = (data.words || []).map(keep).filter(Boolean);
  return { words, lines: null };
}

/* Words on the same line of a table share a horizontal band, and the bands
   are separated by whitespace. Sorting by the middle of each word and cutting
   wherever the gap is bigger than a word is tall finds the bands without
   needing to see the ruled lines — which in a photograph are often the first
   thing to go. */
function bandRows(words) {
  const tall = median(words.map(w => w.y1 - w.y0)) || 10;
  const sorted = words.slice().sort((a, b) => mid(a.y0, a.y1) - mid(b.y0, b.y1));
  const rows = [];
  let row = [];
  let last = null;
  for (const w of sorted) {
    const c = mid(w.y0, w.y1);
    if (last !== null && c - last > tall * 0.85) { rows.push(row); row = []; }
    row.push(w);
    last = c;
  }
  if (row.length) rows.push(row);
  return rows.filter(r => r.length);
}

/* But a band is not always a row, and this is the mistake that ruins a real
   timetable. Schools write the teacher, and often the room, under the lesson in
   smaller print: one row of the table, two lines of text. Read as two rows it
   doubles the week, and every period after the first is out by one.

   The obvious test — is this line set smaller than the one above? — does not
   survive Hebrew, where a line of five words can measure the same as the line
   under it because ל reaches up and ק reaches down and the median does not
   care which. What does survive is the spacing. Small print sits on the very
   next line; the next row starts after a cell border and some padding. Measured
   on a real page those two come out around 38 pixels and around 71, and they
   stay that far apart whatever the alphabet. So the gaps are compared with each
   other: where they fall into a close group and a far group, the close ones are
   inside a row. Where they are all much of a muchness there is no small print
   to fold in, and nothing is merged. */
function mergeSmallPrint(rows) {
  const out = () => rows.map(r => r.slice());
  if (rows.length < 4) return out();

  const centre = rows.map(r => median(r.map(w => mid(w.y0, w.y1))));
  const gaps = [];
  for (let i = 1; i < centre.length; i++) gaps.push(centre[i] - centre[i - 1]);

  const apart = median(gaps);
  const close = apart * 0.7;
  if (!gaps.some(g => g < close)) return out();

  const merged = [rows[0].slice()];
  for (let i = 1; i < rows.length; i++) {
    if (gaps[i - 1] < close) {
      /* Folded in, but marked. Knowing which words came from underneath is
         what lets the cell print the lesson and not "Biology Cohen 204"
         later on, without having to guess at type sizes a second time. */
      merged[merged.length - 1].push(...rows[i].map(w => ({ ...w, small: true })));
    } else {
      merged.push(rows[i].slice());
    }
  }
  return merged;
}

/* A title is not a row either. It is set across the middle of the page, which
   is the worst place for it: wide enough to bridge the gutters between two or
   three columns and glue them into one, and close enough to the table to be
   mistaken for its first period. A row of the table reaches across most of the
   page. A title, a school name or the date it was issued does not, so anything
   at the top that falls short of the width the real rows share is not the
   table and goes. */
function dropThePreamble(rows) {
  if (rows.length < 3) return rows;
  const reach = rows.map(r =>
    Math.max(...r.map(w => w.x1)) - Math.min(...r.map(w => w.x0)));
  const full = median(reach);
  let from = 0;
  while (from < rows.length - 2 && reach[from] < full * 0.6) from++;
  return rows.slice(from);
}
/* Better than measuring whitespace, though: read the clock. The periods are
   written down one side of every timetable, and where those times can be found
   they say exactly where each row starts and stops — including that a lesson
   and the teacher underneath it are one row, which no amount of measuring gaps
   can be relied on to work out. */
function rowAnchors(words, pageWidth) {
  const times = words.filter(w => looksLikeTime(w.text));
  if (times.length < 3) return null;

  /* They have to stand in a column. Times scattered across the page are the
     date it was printed, or a lesson that happens to contain a number. */
  const xs = times.map(w => mid(w.x0, w.x1));
  if (Math.max(...xs) - Math.min(...xs) > pageWidth * 0.2) return null;

  const tall = median(words.map(w => w.y1 - w.y0)) || 10;
  const ys = times.map(w => mid(w.y0, w.y1)).sort((a, b) => a - b);
  // "08:00 – 08:45" is one period written twice, not two periods.
  const at = [];
  for (const y of ys) if (!at.length || y - at[at.length - 1] > tall * 1.2) at.push(y);
  return at.length >= 3 ? at : null;
}

/** Every word filed under the period it sits beside. */
function rowsAtAnchors(words, anchors) {
  const edge = [];
  for (let i = 1; i < anchors.length; i++) edge.push(mid(anchors[i - 1], anchors[i]));
  // The heading stands above the first period by about the distance that
  // separates one period from the next.
  const ceiling = anchors[0] - (edge[0] - anchors[0]);

  const rows = anchors.map(() => []);
  const above = [];
  for (const w of words) {
    const y = mid(w.y0, w.y1);
    if (y < ceiling) { above.push(w); continue; }
    let at = 0;
    while (at < edge.length && y > edge[at]) at++;
    rows[at].push(w);
  }
  return { rows, above };
}

/* Columns are found by looking down the page rather than across it: mark
   every horizontal position some word covers, and the gutters are the runs
   nothing covers. A gutter has to be wider than a space to count, or the gaps
   between words become columns. */
function bandColumns(words, pageWidth) {
  const covered = new Uint8Array(pageWidth + 2);
  for (const w of words) {
    for (let x = Math.max(0, w.x0 | 0); x <= Math.min(pageWidth, w.x1 | 0); x++) covered[x] = 1;
  }
  const wide = median(words.map(w => (w.x1 - w.x0) / Math.max(1, w.text.length))) || 8;
  const gutter = Math.max(8, wide * 1.6);

  const cuts = [];
  let run = 0;
  for (let x = 0; x <= pageWidth; x++) {
    if (!covered[x]) { run++; continue; }
    if (run >= gutter) cuts.push(x - run / 2);
    run = 0;
  }
  // The edges are not columns.
  const edges = [0, ...cuts.filter(c => c > 4 && c < pageWidth - 4), pageWidth + 1];
  const cols = [];
  for (let i = 0; i < edges.length - 1; i++) cols.push([edges[i], edges[i + 1]]);
  return cols;
}

const mid = (a, b) => (a + b) / 2;
function median(list) {
  const v = list.filter(Number.isFinite).sort((a, b) => a - b);
  return v.length ? v[v.length >> 1] : 0;
}

/* What a cell actually says. Rarely one word: under the lesson there is
   usually a teacher and sometimes a room, and taking the lot gives you a
   subject called "Maths Cohen 204" which matches nothing on any other day and
   so gets its own colour, its own bag and its own tile.

   Those extra words were folded into this row when the rows were built, and
   marked as they were folded, so here they are simply left out. Nothing has to
   be inferred from how big they look — which in Hebrew tells you very little,
   because a line of five words measures whatever its tallest ל and lowest ק
   happen to be. Where a cell holds nothing but small print it is printed
   anyway: better a teacher's name to correct than an empty box. */
/** Any letter of the Hebrew block, which is what says a line reads rightwards. */
const HAS_HEBREW = /[֐-׿]/;

const HAS_LETTER = /\p{L}/u;

function cellText(inCell) {
  /* Cell borders, tick marks and the edge of the page come back as words made
     of nothing but punctuation — a bar, a slash, a dash. They are not lessons,
     and left in they turn an empty cell into a full one, which is how a badly
     framed photograph ends up looking like a well-read week. */
  const real = inCell.filter(w => HAS_LETTER.test(w.text) || /\d/.test(w.text));
  if (!real.length) return '';
  const main = real.filter(w => !w.small);
  const use = main.length ? main : real;
  const tall = median(use.map(w => w.y1 - w.y0)) || 10;

  const lines = [];
  for (const w of use.slice().sort((a, b) => mid(a.y0, a.y1) - mid(b.y0, b.y1))) {
    const line = lines[lines.length - 1];
    if (line && mid(w.y0, w.y1) - line.at <= tall * 0.7) line.words.push(w);
    else lines.push({ at: mid(w.y0, w.y1), words: [w] });
  }

  const said = lines
    .map((line) => {
      /* Hebrew reads the other way, and the engine hands words back in the
         order they sit on the page, left to right. */
      const rtl = line.words.filter(w => HAS_HEBREW.test(w.text)).length * 2 >= line.words.length;
      return line.words
        .slice()
        .sort((a, b) => (rtl ? b.x0 - a.x0 : a.x0 - b.x0))
        .map(w => w.text)
        .join(' ');
    })
    .join(' ')
    .trim();

  // Whatever is left has to read as a name or a time to be either.
  return HAS_LETTER.test(said) || looksLikeTime(said) ? said : '';
}

/* Which day a heading names, if it names one. Matching by name rather than by
   position is what makes a right-to-left timetable come out right: if the
   rightmost column says ראשון it is Sunday, wherever it sits on the page. */
const DAY_WORDS = [
  [0, ['sunday', 'sun', 'ראשון', 'א']],
  [1, ['monday', 'mon', 'שני', 'ב']],
  [2, ['tuesday', 'tue', 'tues', 'שלישי', 'ג']],
  [3, ['wednesday', 'wed', 'רביעי', 'ד']],
  [4, ['thursday', 'thu', 'thur', 'thurs', 'חמישי', 'ה']],
  [5, ['friday', 'fri', 'שישי', 'ו']],
  [6, ['saturday', 'sat', 'שבת', 'ש']],
];

function dayFromHeading(text) {
  const t = String(text).toLowerCase().replace(/[^a-zא-ת]/g, '');
  if (!t) return -1;
  for (const [js, words] of DAY_WORDS) {
    if (words.some(w => t === w || (w.length > 2 && t.startsWith(w)))) return js;
  }
  return -1;
}

const CLOCK = /\d{1,2}\s*[:.]\s*\d{2}/;
const looksLikeTime = (t) => CLOCK.test(t);
/* The cell says "08:00" or "08:00 ." or "08:00-08:45"; the period wants the
   first of those. */
const timeIn = (t) => {
  const hit = CLOCK.exec(String(t));
  return hit ? hit[0].replace(/\s+/g, '') : '';
};

/**
 * The words, turned back into a week.
 *
 * Returns null rather than a bad guess. A timetable that came out wrong in a
 * way nobody notices is worse than one that admits it could not be read: the
 * first quietly packs the wrong bag every morning.
 */
function weekFromWords(words, pageWidth, lines) {
  if (words.length < 8) return null;

  /* Rows: the engine's lines where it gave any, and clustering the boxes by
     hand where it did not. Either way the teacher printed under the lesson has
     to be folded back into the row above, or the week comes out twice as long
     as it is and every period after the first is out by one. */
  let body = dropThePreamble(
    mergeSmallPrint(lines && lines.length ? lines : bandRows(words)));
  const above = [];
  if (body.length < 2) return null;

  /* The day names say which column is which day, and everything printed above
     them — a title, a school name, the date it was issued — is not the table.
     Dropping it also stops a wide title from bridging the gap between two
     columns and gluing them into one. */
  let heading = null;
  const names = (band) => new Set(band.map(w => dayFromHeading(w.text)).filter(d => d >= 0));
  for (const band of bandRows(above).reverse()) {
    if (names(band).size >= 2) { heading = band; break; }
  }
  if (!heading) {
    /* No clock to go by, or the heading fell inside the first period's row.
       Take the day names out of the band they are in, keep whatever else was
       on that band, and drop the bands above it — with no clock to mark where
       the table starts, those are the title and the date. */
    for (let i = 0; i < Math.min(3, body.length); i++) {
      if (names(body[i]).size < 2) continue;
      heading = body[i].filter(w => dayFromHeading(w.text) >= 0);
      const rest = body[i].filter(w => dayFromHeading(w.text) < 0);
      body = (rest.length ? [rest] : []).concat(body.slice(i + 1));
      break;
    }
  }

  /* Hebrew timetables run right to left, and if the heading row could not be
     read there is nothing naming the columns. Rather than hand back a week
     with Thursday's lessons filed under Sunday, the page's own language
     decides which end to start from. */
  const rtlPage = words.filter(w => HAS_HEBREW.test(w.text)).length * 2 >= words.length;

  const cols = bandColumns((heading || []).concat(...body), pageWidth);
  if (cols.length < 2) return null;

  const inside = (list, col) =>
    list.filter(w => mid(w.x0, w.x1) >= col[0] && mid(w.x0, w.x1) < col[1]);

  const table = body.map(row => cols.map(col => cellText(inside(row, col))));
  const heads = cols.map(col => cellText(inside(heading || [], col)));

  /* A column of times is the periods, not a day. It is whichever column holds
     the most of them, rather than one that holds enough of them: the small
     bold print down the side of a photographed timetable is the first thing
     the engine loses, and on a six-period grid it may come back with two. Two
     is still plenty to tell a column of clock faces from a column of lessons,
     and getting this wrong costs a whole day — the times become Sunday, and
     every day after shifts along one. */
  let timeCol = -1;
  let mostTimes = 1;
  for (let c = 0; c < cols.length; c++) {
    const times = table.filter(row => looksLikeTime(row[c] || '')).length;
    if (times > mostTimes) { mostTimes = times; timeCol = c; }
  }

  const dayCols = [];
  for (let c = 0; c < cols.length; c++) {
    if (c === timeCol) continue;
    dayCols.push({ c, js: heading ? dayFromHeading(heads[c]) : -1 });
  }
  if (!dayCols.length) return null;

  // A row with nothing in any of its day columns is a rule or a stray mark.
  const useful = table.filter(row => dayCols.some(d => row[d.c]));
  if (!useful.length) return null;

  const week = schoolDays();
  const periods = useful.map((row, i) =>
    (timeCol >= 0 && timeIn(row[timeCol])) || tr('tt.period', { n: i + 1 }));

  const schedule = week.map(() => Array(useful.length).fill(null));
  const inOrder = heading || !rtlPage ? dayCols : dayCols.slice().reverse();
  inOrder.forEach((d, order) => {
    // By name where the heading gave one, by position where it did not.
    const at = d.js >= 0 ? week.findIndex(w => w.js === d.js) : order;
    if (at < 0 || at >= week.length) return;
    useful.forEach((row, p) => { schedule[at][p] = row[d.c] || null; });
  });

  const filled = schedule.reduce((n, row) => n + row.filter(Boolean).length, 0);
  if (filled < 3) return null;

  const week2 = {
    periods,
    schedule,
    filled,
    timed: timeCol >= 0,
    named: !!heading,
    clock: periods.filter(looksLikeTime).length,
  };
  return looksLikeAWeek(week2) ? week2 : null;
}

/* The last gate, and the one that matters most.
 *
 * A photograph taken at an angle does not fail cleanly. The columns stop being
 * vertical, so the gutters between them smear and close up; rows split; and
 * what comes out the other end is not an empty result but a confident one —
 * twenty-nine periods, four empty days and one holding every word on the page.
 * Handing that back would be the worst thing this could do, because it looks
 * like an answer. Three things a real week is and that one is not:
 */
function looksLikeAWeek(w) {
  // A school day has a handful of periods. Not thirty.
  if (w.periods.length < 2 || w.periods.length > 14) return false;

  /* Lessons on most of the days. Two columns holding everything while three
     stand empty is not a light week — it is what a photograph taken at an
     angle does, where the columns lean into one another until the gutters
     between them close up and several days become one. */
  const busy = w.schedule.filter(day => day.some(Boolean));
  if (busy.length < Math.min(3, w.schedule.length)) return false;

  /* And the days are of roughly the same length, because school weeks are.
     One column holding everything and the rest holding nothing is the
     signature of columns that collapsed into each other. */
  const counts = busy.map(day => day.filter(Boolean).length);
  return Math.min(...counts) >= Math.max(...counts) * 0.34;
}

/* What the button does on the screen: says what is happening, because
   several megabytes of engine and a page of recognition take long enough
   that a button which simply sat there would look broken. */
async function readTheWeek(button) {
  const say = $('[data-photo-say]');
  if (button.disabled) return;
  button.disabled = true;
  say.textContent = tr('photo.reading', { n: 0 });

  try {
    const week = await readPhotoIntoWeek((p) => {
      say.textContent = tr('photo.reading', { n: Math.round(p * 100) });
    });
    if (!week) {
      say.textContent = tr('photo.readNone');
      button.disabled = false;
      return;
    }
    // Straight on to checking it. What it read is a first draft of the week,
    // not the week — the screen it lands on is the one that says so.
    const squared = squareUp(week);
    if (button.closest('#setup') && setupDraft) {
      setupDraft.week = squared;
      setupAt = 1;                          // the checking step
      renderSetup();
      $('#setup').scrollTop = 0;
    } else if (ttDraft) {
      ttDraft = squared;
      renderTtEdit();
    }
    showToast(tr('photo.readOk', { n: week.periods.length }));
  } catch {
    say.textContent = navigator.onLine ? tr('photo.readFail') : tr('photo.readOffline');
    button.disabled = false;
  }
}

/** The button's whole job: read the photo, or say plainly that it could not. */
async function readPhotoIntoWeek(onProgress) {
  const src = loadPhoto();
  if (!src) return null;

  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error('unreadable'));
    i.src = src;
  });

  /* Four ways of looking at the same photo. Two preparations, because a page
     lit evenly and a page lit from one side need different treatment; and two
     segmentation modes, because 6 treats the page as one block of text and
     reads a ruled grid, while 11 looks for sparse text anywhere and finds a
     grid whose cells are far apart. None of them is reliably best, so all of
     them are tried and the most convincing reading is kept — except that a
     reading good enough to be obviously right stops the rest, because four
     passes take four times as long and most photos are read on the first. */
  const tries = [
    ['grey', 6], ['ink', 6], ['ink', 11], ['grey', 11],
  ];
  const ready = {};
  let best = null;

  try {
    for (let i = 0; i < tries.length; i++) {
      const [how, mode] = tries[i];
      const shot = ready[how] || (ready[how] = prepPhoto(img, how));
      const { words, lines } = await wordsInPhoto(shot.url, mode,
        (p) => onProgress((i + p) / tries.length));
      const week = weekFromWords(words, shot.width, lines);
      if (weekScore(week) > weekScore(best)) best = week;
      if (convincing(best)) break;
    }
    return best;
  } finally {
    dropOcrWorker();
  }
}

/* How much of a week a reading is. The clock and the day names count for more
   than a handful of extra lessons, because those two are what put a lesson on
   the right day at the right hour; a fuller grid with neither is a list of
   words in a shape. */
const weekScore = (w) =>
  (!w ? -1 : w.filled + w.clock * 2 + (w.timed ? 6 : 0) + (w.named ? 6 : 0));

/* A grid this full has nothing left for another pass to find, so the other
   three are not run. It is the lessons this asks about and not the clock: a
   period that came back as "Period 3" instead of "09:45" is one tap to correct
   on the very next screen, and three more passes over a photo to chase it is
   half a minute of somebody's morning. */
const convincing = (w) =>
  !!w && w.filled >= w.schedule.length * w.periods.length * 0.8;

/** An empty week of the right shape, for anyone who would rather just type. */
function blankWeek(rows = 6) {
  const days = schoolDays().length;
  return {
    periods: Array.from({ length: rows }, (_, i) => tr('tt.period', { n: i + 1 })),
    schedule: Array.from({ length: days }, () => Array(rows).fill(null)),
  };
}

function openSetup() {
  setupAt = 0;
  setupDraft = { week: blankWeek(), kit: {}, everyDay: KIT_EVERY_DAY.slice(), open: {} };
  const page = $('#setup');
  page.hidden = false;
  renderSetup();
}

/** Every lesson the draft week mentions, in the order it first appears. */
function draftLessons() {
  const seen = [];
  for (const row of setupDraft.week.schedule) {
    for (const name of row) if (name && !seen.includes(name)) seen.push(name);
  }
  return seen;
}

function renderSetup() {
  const box = $('#setup-body');
  if (!box || !setupDraft) return;
  const step = SETUP_STEPS[setupAt];

  const dots = SETUP_STEPS.map((_, i) =>
    `<span class="setup-dot ${i === setupAt ? 'is-on' : ''} ${i < setupAt ? 'is-done' : ''}"></span>`).join('');

  let inner = '';
  if (step === 'week') {
    inner = `
      <h2 class="setup-title">${esc(tr('setup.weekTitle'))}</h2>
      <p class="setup-note">${esc(tr('setup.weekNote'))}</p>
      ${photoStrip() || photoAdd('setup')}`;
  }

  if (step === 'check') {
    inner = `
      <h2 class="setup-title">${esc(tr('setup.checkTitle'))}</h2>
      <p class="setup-note">${esc(tr('setup.checkNote'))}</p>
      ${photoStrip()}
      ${weekGrid(setupDraft.week, 'setup')}
      <div class="tt-edit-actions">
        <button id="setup-add-period" class="btn-second">${esc(tr('tt.addPeriod'))}</button>
        <button id="setup-drop-period" class="btn-second"
                ${setupDraft.week.periods.length <= 1 ? 'disabled' : ''}>${esc(tr('tt.removePeriod'))}</button>
      </div>`;
  }

  if (step === 'kit') {
    const lessons = draftLessons();
    inner = `
      <h2 class="setup-title">${esc(tr('setup.kitTitle'))}</h2>
      <p class="setup-note">${esc(tr('setup.kitNote'))}</p>

      <div class="kit-block">
        <h3 class="kit-head">${esc(tr('setup.everyDay'))}</h3>
        ${kitChips(setupDraft.everyDay, '', setupDraft.open[''])}
      </div>

      ${lessons.length ? lessons.map(name => `
        <div class="kit-block">
          <h3 class="kit-head">${esc(name)}</h3>
          ${kitChips(setupDraft.kit[name] || guessKit(name), name, setupDraft.open[name])}
        </div>`).join('')
        : `<p class="foot-note is-big">${esc(tr('setup.noLessons'))}</p>`}`;
  }

  box.innerHTML = `
    <div class="setup-dots" aria-hidden="true">${dots}</div>
    ${inner}
    <div class="setup-feet">
      ${setupAt > 0 ? `<button id="setup-back" class="btn-second">${esc(tr('setup.back'))}</button>` : ''}
      <button id="setup-next" class="btn-primary is-wide">
        ${esc(setupAt === SETUP_STEPS.length - 1 ? tr('setup.finish') : tr('setup.next'))}
      </button>
    </div>`;
}

/** The week as a grid of fields. The editor and the setup draw the same one. */
function weekGrid(week, scope) {
  const days = schoolDays();
  return `
    <div class="tt-edit-scroll">
      <table class="tt-edit-grid">
        <thead>
          <tr>
            <th class="tt-edit-corner">${esc(tr('tt.time'))}</th>
            ${days.map((d, i) => `<th>${esc(dayShort(i))}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${week.periods.map((time, p) => `
            <tr>
              <th class="tt-edit-time">
                <input class="tt-edit-when" type="text" value="${esc(time)}"
                       data-scope="${scope}" data-period="${p}"
                       aria-label="${esc(tr('tt.period', { n: p + 1 }))}" />
              </th>
              ${days.map((d, i) => `
                <td>
                  <input class="tt-edit-cell" type="text"
                         value="${esc((week.schedule[i] || [])[p] || '')}"
                         data-scope="${scope}" data-day="${i}" data-period="${p}"
                         placeholder="${esc(tr('tt.free'))}"
                         aria-label="${esc(dayShort(i))} ${esc(tr('tt.period', { n: p + 1 }))}" />
                </td>`).join('')}
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

/**
 * What a lesson needs: the things chosen for it, and a way to the rest.
 *
 * Showing the whole catalogue against every lesson made a page fourteen
 * lessons long with two hundred and fifty pictures on it, which is not a
 * question anybody reads to the end of. A row is the answer instead — what
 * the app picked, or what you have picked since — and the rest of the
 * catalogue is one tap away, for that lesson only.
 */
function kitChips(on, lesson, open) {
  const chip = (k) => `
    <button class="kit-chip ${on.includes(k.key) ? 'is-on' : ''}"
            data-kit="${k.key}" aria-pressed="${on.includes(k.key)}">
      <img src="${k.art}" alt="" aria-hidden="true" width="64" height="64"
           loading="lazy" decoding="async" />
      <span>${esc(tr('kit.' + k.key))}</span>
    </button>`;

  const chosen = KIT.filter(k => on.includes(k.key));
  const rest = KIT.filter(k => !on.includes(k.key));

  return `<div class="kit-row ${open ? 'is-open' : ''}" data-lesson="${esc(lesson)}">
    ${chosen.map(chip).join('')}
    ${open ? rest.map(chip).join('') : ''}
    ${chosen.length ? '' : `<span class="kit-none">${esc(tr('setup.nothing'))}</span>`}
    <button class="kit-more" data-more="${esc(lesson)}" aria-expanded="${!!open}">
      <span aria-hidden="true">${open ? '−' : '+'}</span>
      <span>${esc(open ? tr('setup.fewer') : tr('setup.more'))}</span>
    </button>
  </div>`;
}

/** The step the setup is on, answered. */
function setupForward() {
  if (setupAt < SETUP_STEPS.length - 1) {
    setupAt++;
    renderSetup();
    $('#setup').scrollTop = 0;
    return;
  }

  // The last step: everything the setup collected goes into the store at once.
  const week = squareUp({
    periods: setupDraft.week.periods.map((t, i) => String(t).trim() || tr('tt.period', { n: i + 1 })),
    schedule: setupDraft.week.schedule.map(r => r.slice()),
  });
  state.timetable = week;
  state.kitEveryDay = setupDraft.everyDay.slice();
  state.kit = {};
  for (const name of draftLessons()) {
    state.kit[name] = (setupDraft.kit[name] || guessKit(name)).slice();
  }
  state.setupDone = true;
  save();

  setupDraft = null;
  $('#setup').hidden = true;
  render();
  showToast(tr('setup.ready'));
}


let ttDraft = null;
function renderTtEdit() {
  const box = $('#tt-edit-body');
  if (!box || !ttDraft) return;
  const week = schoolDays();
  box.innerHTML = `
    <p class="tt-edit-note">${esc(tr('tt.editNote'))}</p>
    ${photoStrip() || photoAdd('edit')}
    ${weekGrid(ttDraft, 'edit')}
    <div class="tt-edit-actions">
      <button id="tt-add-period" class="btn-second">${esc(tr('tt.addPeriod'))}</button>
      <button id="tt-drop-period" class="btn-second"
              ${ttDraft.periods.length <= 1 ? 'disabled' : ''}>${esc(tr('tt.removePeriod'))}</button>
    </div>
    <button id="tt-reset" class="btn-ghost tt-reset">${esc(tr('tt.reset'))}</button>`;
}
/** Every row as wide as the week, so a new country cannot leave a hole. */
function squareUp(draft) {
  const wide = schoolDays().length;
  const tall = draft.periods.length;
  for (let i = 0; i < wide; i++) {
    const row = draft.schedule[i] || (draft.schedule[i] = []);
    while (row.length < tall) row.push(null);
    row.length = tall;
  }
  draft.schedule.length = wide;
  return draft;
}
function openTtEdit() {
  ttDraft = squareUp(weekCopy());
  const page = $('#tt-edit');
  page.hidden = false;
  page.classList.remove('is-leaving');
  renderTtEdit();
  page.scrollTop = 0;
}
function closeTtEdit() {
  const page = $('#tt-edit');
  if (!page || page.hidden) return;
  page.classList.add('is-leaving');
  setTimeout(() => {
    page.hidden = true;
    page.classList.remove('is-leaving');
    ttDraft = null;
  }, 240);
}
function saveTtEdit() {
  if (!ttDraft) return;
  if (!ttDraft.periods.length) { showToast(tr('tt.tooFew')); return; }
  // A period with no time still needs one, or the timetable has a blank row.
  ttDraft.periods = ttDraft.periods.map((t, i) => String(t).trim() || tr('tt.period', { n: i + 1 }));
  state.timetable = squareUp(ttDraft);
  ttDraft = null;
  save();
  closeTtEdit();
  render();
  showToast(tr('tt.saved'));
}
function resetTtEdit() {
  ttDraft = squareUp({
    periods: PROFILE.periods.slice(),
    schedule: PROFILE.schedule.map(r => r.slice()),
  });
  renderTtEdit();
}
function renderProfile() {
  renderProfileTop();
  // Everything you have finished is a page of its own now; this row only has
  // to say how much of it there is.
  const doneCount = state.homework.filter(h => h.completed).length;
  const doneNote = $('#done-count');
  if (doneNote) {
    doneNote.textContent = doneCount ? tr('done.count', { n: doneCount }) : tr('pro.doneNote');
  }
  renderCountryPick();
  renderThemePick();
  const avail = reminderAvailability();
  const blocked = $('#reminder-blocked');
  if (blocked) {
    blocked.hidden = avail.ok;
    blocked.innerHTML = avail.ok ? ''
      : `<strong>${esc(avail.why)}</strong><span>${esc(avail.how)}</span>`;
  }
  $('#reminder-card').classList.toggle('is-unavailable', !avail.ok);
  /* Three switches, three times, all the same shape. */
  const REMINDERS = [
    ['#reminder-toggle', '#reminder-time', '#reminder-time-row', 'dailyReminderEnabled', 'dailyReminderTime'],
    ['#bag-toggle', '#bag-time', '#bag-time-row', 'bagReminderEnabled', 'bagReminderTime'],
    ['#finish-toggle', '#finish-time', '#finish-time-row', 'finishReminderEnabled', 'finishReminderTime'],
  ];
  for (const [sw, time, row, onKey, atKey] of REMINDERS) {
    const box = $(sw);
    if (!box) continue;
    box.disabled = !avail.ok;
    box.checked = state.settings[onKey];
    $(time).value = state.settings[atKey];
    $(row).hidden = !state.settings[onKey];
  }
  $('#reminder-note').textContent = reminderNote();
}


/* ── The collection page ───────────────────────────────────
   All fifty at once, in the order they were written, so a creature keeps the
   same number for ever and the gaps are the ones you have left to find. The
   ones you have are drawn; the ones you have not are their own silhouette
   with a question mark, which says how many are coming and how different
   they are without giving any of them away. */

const CRE_FILTERS = ['all', 'found', 'locked'];
let creFilter = 'all';
let creQuery = '';

/** The number a creature wears, padded, from its place in the fifty. */
const monsterNo = (m) => String(MONSTERS.indexOf(m) + 1).padStart(3, '0');

/** Name or number, whichever the search box looks like. */
function matchesQuery(m, q, found) {
  if (!q) return true;
  const number = monsterNo(m);
  if (number.includes(q.replace(/^#/, ''))) return true;
  // A name nobody has met yet would give the surprise away.
  return found && m.name.toLowerCase().includes(q);
}

function renderCollection() {
  const met = state.progress.metAt || {};
  const have = collectedMonsters();
  const q = creQuery.trim().toLowerCase();

  const chips = $('#cre-filters');
  if (chips) {
    chips.innerHTML = CRE_FILTERS.map(k => `
      <button class="chip cre-chip ${creFilter === k ? 'is-on' : ''}" data-cre-filter="${k}"
              aria-pressed="${creFilter === k}">
        ${esc(tr('cre.f' + (k === 'all' ? 'All' : k === 'found' ? 'Found' : 'Locked')))}
      </button>`).join('');
  }

  const box = $('#collection');
  if (!box) return;

  const shown = MONSTERS.filter((m) => {
    const found = !!met[m.id];
    if (creFilter === 'found' && !found) return false;
    if (creFilter === 'locked' && found) return false;
    return matchesQuery(m, q, found);
  });

  box.innerHTML = shown.map((m) => {
    const found = !!met[m.id];
    const no = monsterNo(m);
    if (!found) {
      return `
        <button class="mon-slot is-locked is-${m.rarity}" data-locked="${m.id}"
                aria-label="${esc(tr('cre.creature', { n: no }))} — ${esc(tr('cre.locked'))}">
          ${monsterPic(m, { locked: true })}
          <span class="mon-no">${esc(tr('cre.number', { n: no }))}</span>
        </button>`;
    }
    return `
      <button class="mon-slot is-${m.rarity}" data-monster="${m.id}" style="--mc:${m.colour}"
              aria-label="${esc(m.name)} — ${esc(tr(`rarity.${m.rarity}`))}">
        ${monsterPic(m)}
        <span class="mon-name">${esc(m.name)}</span>
        <span class="mon-no">${esc(tr('cre.number', { n: no }))}</span>
      </button>`;
  }).join('');

  const note = $('#collection-note');
  if (note) {
    const left = MONSTER_COUNT - have.length;
    note.textContent = !shown.length
      ? (q ? tr('cre.noMatch')
           : creFilter === 'found' ? tr('cre.noneFound') : tr('cre.noneLocked'))
      : !have.length ? tr('book.allOut', { n: MONSTER_COUNT })
        : left ? tr('book.stillOut', { n: left })
          : tr('book.everyone');
  }
}


/* ── Your companion ────────────────────────────────────────
   The banner at the top of the collection. With nobody chosen it is an
   invitation rather than an empty box, and with nobody found it says what to
   do about that: finish some homework. */

function renderCompanionBanner() {
  const box = $('#cmp-banner');
  if (!box) return;

  const m = companionMonster();
  const have = collectedMonsters();
  const bar = `
    <div class="cmp-count">
      <b>${tr('cre.progress', { have: have.length, all: MONSTER_COUNT })}</b>
      <span>${esc(tr('cre.discovered'))}</span>
      <div class="bar"><div class="bar-fill" style="width:${(have.length / MONSTER_COUNT) * 100}%"></div></div>
    </div>`;

  if (!m) {
    box.className = 'cmp-banner is-empty';
    box.innerHTML = `
      <div class="cmp-words">
        <span class="cmp-kicker">${esc(tr('cmp.yours'))}</span>
        <strong class="cmp-name">${esc(tr('cmp.none'))}</strong>
        <p class="cmp-line">${esc(have.length ? tr('cmp.noneSub') : tr('set.firstCreature'))}</p>
        ${have.length ? `<button id="cmp-pick" class="btn-pill">
          ${esc(tr('cmp.pick'))}<svg class="ico" aria-hidden="true"><use href="#i-chevron" /></svg>
        </button>` : ''}
      </div>
      <span class="cmp-art is-egg" aria-hidden="true">
        <img src="art/set/egg.webp" alt="" width="280" height="270" decoding="async" />
      </span>
      ${bar}`;
    return;
  }

  box.className = 'cmp-banner';
  box.innerHTML = `
    <div class="cmp-words">
      <span class="cmp-kicker">${esc(tr('cmp.yours'))}</span>
      <strong class="cmp-name">${esc(m.name)}</strong>
      <p class="cmp-line">${esc(m.fact)}</p>
      <button id="cmp-view" class="btn-pill" data-monster="${m.id}">
        ${esc(tr('cmp.view'))}<svg class="ico" aria-hidden="true"><use href="#i-chevron" /></svg>
      </button>
    </div>
    <span class="cmp-art" style="--mc:${m.colour}" aria-hidden="true">${monsterPic(m)}</span>
    ${bar}`;
}


/* ── One creature's own page ───────────────────────────────
   What the book says about them, plus the two things the book cannot: make
   them your companion, and what the pair of you have finished. */

let creatureAt = null;

/* Sharing is the phone's own sheet or nothing. There is no fallback worth
   building — a homework app has nowhere else to send a creature to. */
const canShare = () => typeof navigator !== 'undefined' && typeof navigator.share === 'function';

function memorySlots(m) {
  const { recent } = togetherFor(m.id);
  const slots = [];
  for (let i = 0; i < MEMORY_SLOTS; i++) {
    const r = recent[i];
    if (!r) { slots.push('<span class="mem-slot is-empty" aria-hidden="true"></span>'); continue; }
    const sub = subjectById(r.s);
    slots.push(`
      <span class="mem-slot" style="--sc:${sub ? sub.color : 'var(--ink-3)'}">
        <svg class="ico" aria-hidden="true"><use href="#i-check" /></svg>
        <b>${esc(r.t)}</b>
        <i>${esc(timeLabel(r.at))}</i>
      </span>`);
  }
  return slots.join('');
}

function renderCreaturePage() {
  const m = monsterById(creatureAt);
  const body = $('#creature-body');
  if (!m || !body) return;

  const no = monsterNo(m);
  const isCompanion = state.progress.companion === m.id;
  const { n } = togetherFor(m.id);
  const met = (state.progress.metAt || {})[m.id];

  $('#creature-num').textContent = tr('cre.creature', { n: no });
  const fav = $('#creature-fav');
  fav.classList.toggle('is-on', isFavourite(m.id));
  fav.setAttribute('aria-pressed', String(isFavourite(m.id)));
  fav.setAttribute('aria-label', tr(isFavourite(m.id) ? 'cre.unfav' : 'cre.fav'));

  body.innerHTML = `
    <div class="cre-hero" style="--mc:${m.colour}">
      <span class="cre-hero-art">${monsterPic(m)}</span>
    </div>

    <h1 class="cre-name">${esc(m.name)}</h1>
    <div class="cre-pills">
      <span class="cre-pill is-rarity is-${m.rarity}">
        <svg class="ico" aria-hidden="true"><use href="#i-leaf" /></svg>
        ${esc(tr('rarity.' + m.rarity))}
      </span>
      <span class="cre-pill">${esc(m.age)}</span>
    </div>

    <div class="cre-actions">
      <button id="cre-make" class="btn-primary ${isCompanion ? 'is-current' : ''}"
              ${isCompanion ? 'disabled' : ''} data-monster="${m.id}">
        <svg class="ico" aria-hidden="true"><use href="#i-${isCompanion ? 'check' : 'leaf'}" /></svg>
        ${esc(tr(isCompanion ? 'cmp.current' : 'cmp.make'))}
      </button>
      ${canShare() ? `<button id="cre-share" class="btn-second">
        <svg class="ico" aria-hidden="true"><use href="#i-share" /></svg>
        ${esc(tr('cre.share'))}
      </button>` : ''}
    </div>

    <h2 class="section-title" data-t="cre.about">${esc(tr('cre.about'))}</h2>
    <p class="cre-about">${esc(m.fact)}</p>

    <h2 class="section-title">${esc(tr('cre.story'))}</h2>
    <p class="cre-story">${esc(m.story)}</p>

    <div class="card cre-stats">
      <div class="cre-stat">
        <span class="cre-stat-ico"><svg class="ico" aria-hidden="true"><use href="#i-calendar" /></svg></span>
        <span class="cre-stat-label">${esc(tr('cre.statFound'))}</span>
        <b>${esc(met ? dayHeading(met) : tr('cre.today'))}</b>
      </div>
      <div class="cre-stat">
        <span class="cre-stat-ico"><svg class="ico" aria-hidden="true"><use href="#i-check" /></svg></span>
        <span class="cre-stat-label">${esc(tr('cre.statTasks'))}</span>
        <b>${n}</b>
      </div>
      <div class="cre-stat">
        <span class="cre-stat-ico"><svg class="ico" aria-hidden="true"><use href="#i-pin" /></svg></span>
        <span class="cre-stat-label">${esc(tr('cre.statLives'))}</span>
        <b>${esc(m.lives)}</b>
      </div>
    </div>

    <h2 class="section-title">${esc(tr('cre.memories'))}</h2>
    <div class="mem-row">${memorySlots(m)}</div>
    <p class="foot-note">${esc(n ? tr('cre.memoriesSome') : tr('cre.memoriesNote', { name: m.name }))}</p>`;
}

function openCreaturePage(id) {
  if (!monsterById(id)) return;
  creatureAt = id;
  const page = $('#creature-page');
  page.hidden = false;
  page.classList.remove('is-leaving');
  renderCreaturePage();
  page.scrollTop = 0;
}

function closeCreaturePage() {
  const page = $('#creature-page');
  if (!page || page.hidden) return;
  page.classList.add('is-leaving');
  setTimeout(() => {
    page.hidden = true;
    page.classList.remove('is-leaving');
    creatureAt = null;
  }, 240);
}


/* ── Choosing a companion ──────────────────────────────────
   Tapping a creature only moves the preview. Nothing is saved until the
   button at the bottom is pressed, so a wrong tap costs nothing. */

let companionPick = null;

function renderCompanionPage() {
  const body = $('#companion-body');
  if (!body) return;

  const have = collectedMonsters();
  if (!have.length) {
    body.innerHTML = `<p class="foot-note is-big">${esc(tr('cre.noneFound'))}</p>`;
    return;
  }

  const pick = monsterById(companionPick) || have[have.length - 1];
  companionPick = pick.id;

  body.innerHTML = `
    <p class="cmp-sub">${esc(tr('cmp.sub'))}</p>

    <div class="cmp-preview">
      <span class="cmp-preview-art" style="--mc:${pick.colour}">${monsterPic(pick)}</span>
      <span class="cmp-preview-tag">${esc(pick.name)}</span>
    </div>

    <h2 class="section-title">${esc(tr('cmp.discovered'))}</h2>
    <div class="cmp-grid">
      ${have.map(m => `
        <button class="cmp-card ${m.id === pick.id ? 'is-on' : ''}" data-pick="${m.id}"
                style="--mc:${m.colour}" aria-pressed="${m.id === pick.id}">
          ${monsterPic(m)}
          <span class="cmp-card-name">${esc(m.name)}</span>
          <span class="cmp-tick" aria-hidden="true">
            <svg class="ico" aria-hidden="true"><use href="#i-check" /></svg>
          </span>
        </button>`).join('')}
    </div>

    <div class="cmp-confirm">
      <button id="cmp-set" class="btn-primary is-wide">${esc(tr('cmp.set', { name: pick.name }))}</button>
    </div>`;
}

function openCompanionPage() {
  companionPick = state.progress.companion;
  const page = $('#companion-page');
  page.hidden = false;
  page.classList.remove('is-leaving');
  renderCompanionPage();
  page.scrollTop = 0;
}

function closeCompanionPage() {
  const page = $('#companion-page');
  if (!page || page.hidden) return;
  page.classList.add('is-leaving');
  setTimeout(() => {
    page.hidden = true;
    page.classList.remove('is-leaving');
  }, 240);
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
      <div class="portrait">${monsterPic(m)}</div>
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
      <h3 class="page-head">${esc(tr('cre.story'))}</h3>
      <p class="page-story">${esc(m.story)}</p>
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

/* When the shell is gone, the light has gone out and the creature is standing
   there. A tap before this would skip the one thing worth watching, so it is
   ignored until then. Matches the CSS timeline in styles.css. */
const HATCH_OPEN_MS = 3750;

/**
 * Meeting someone new. The egg turns up, wobbles, cracks along its middle and
 * breaks open — and then there is a moment with nothing in it at all, one hard
 * flash of white, and whoever was inside is standing in the light as it fades.
 * Every creature has its own shell, so the same thing never hatches twice.
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
        <div class="hatch-mon">${monsterPic(m)}</div>
        <div class="hatch-egg">${eggSvg(m, { split: true })}</div>
        <span class="hatch-shards">${'<i></i>'.repeat(8)}</span>
        <span class="hatch-ring"></span>
        <span class="hatch-rays">${'<i></i>'.repeat(10)}</span>
        <span class="hatch-flash"></span>
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
  if (m) {
    state.progress.metAt[m.id] = Date.now();
    // The egg takes three seconds to open. Whoever is inside is fetched now,
    // so the moment it does there is a creature there and not a gap.
    if (m.art) new Image().src = `art/mon/${m.id}.webp`;
  }
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
const TOP_NIGHT = '#191512';   // only a fallback; the palette is asked first

/* The colour the browser paints around the clock. An appearance that has
   been chosen outranks what the phone is set to — picking Dark on a phone in
   daylight has to darken the top of the screen too, or the app sits in a
   bright frame. */

function syncTopColour() {
  const meta = $('#top-colour');
  if (!meta) return;
  const asked = document.documentElement.getAttribute('data-theme');
  const dark = asked ? asked === 'dark'
                     : matchMedia('(prefers-color-scheme: dark)').matches;
  // Read off the palette rather than written down twice: the dark ground was
  // changed once and this was still telling the phone the old colour.
  if (dark) {
    const paper = getComputedStyle(document.documentElement)
      .getPropertyValue('--paper').trim();
    meta.setAttribute('content', paper || TOP_NIGHT);
    return;
  }
  if (currentTab === 'reminders') { meta.setAttribute('content', TOP_WALL); return; }
  meta.setAttribute('content', TOP_PAPER);
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
      : (subjectId || state.lastSubjectId || (subjects()[0] || {}).id || ''),
    title: editing ? editing.title : '',
    note: editing ? (editing.note || '') : '',
    dueDate: editing ? editing.dueDate : null,
  };
  if (!subjectById(draft.subjectId)) draft.subjectId = (subjects()[0] || {}).id || '';

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
  recordTogether(hw);
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
  forgetTogether(hw);
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
  // Some things said in a toast cannot be undone — a locked card explaining
  // itself, a companion swapped. Those get no button rather than a dead one.
  const undo = $('#toast-undo');
  undo.onclick = onUndo || null;
  undo.hidden = !onUndo;
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
  scheduleOne('finish', 'finishReminderEnabled', 'finishReminderTime', fireFinishReminder);
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
    left ? tr('notif.anyBody', { n: left }) : tr('notif.anyBodyNone'));
}
/* The one that only goes out when there is something to go out about. It is
   armed on a timer like the other two, but it checks at the moment it fires:
   a reminder to finish what you have already finished is worse than no
   reminder, and whether you have finished it is only knowable now. The timer
   re-arms either way, so tomorrow still gets its chance. */
function fireFinishReminder() {
  const left = activeHw().length;
  if (!left) return;
  notify(tr('notif.finish'), tr('notif.finishBody', { n: left }));
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
  const day = schoolDays()[idx];
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

  on('#lang-pick', 'click', (e) => {
    const btn = e.target.closest('[data-lang]');
    if (btn) setLang(btn.dataset.lang);
  });

  on('#theme-pick', 'click', (e) => {
    const btn = e.target.closest('[data-theme-pick]');
    if (btn) setTheme(btn.dataset.themePick);
  });
  on('#country-pick', 'click', (e) => {
    const btn = e.target.closest('[data-country]');
    if (btn) setCountry(btn.dataset.country);
  });
  on('#finish-toggle', 'change', (e) => toggleReminder('finishReminderEnabled', e.target.checked));
  on('#finish-time', 'change', (e) => {
    state.settings.finishReminderTime = e.target.value || '18:00';
    save();
    scheduleReminder();
  });
  /* Everything you have finished, behind one row. */
  on('#done-open', 'click', openDonePage);
  on('#done-back', 'click', closeDonePage);
  /* The week, editable. The grid is redrawn on every structural change but
     not on every keystroke: typing into a cell writes straight into the
     draft, so the field keeps the caret and nothing flickers. */
  on('#setup-body', 'click', (e) => {
    if (!setupDraft) return;

    if (e.target.closest('#setup-add-period')) {
      setupDraft.week.periods.push('');
      renderSetup();
      return;
    }
    if (e.target.closest('#setup-drop-period')) {
      if (setupDraft.week.periods.length > 1) setupDraft.week.periods.pop();
      renderSetup();
      return;
    }

    const more = e.target.closest('[data-more]');
    if (more) {
      const lesson = more.dataset.more;
      setupDraft.open[lesson] = !setupDraft.open[lesson];
      renderSetup();
      // Back to the row that was opened, rather than to the top of the page.
      const row = $(`.kit-row[data-lesson="${CSS.escape(lesson)}"]`);
      if (row) row.scrollIntoView({ block: 'center' });
      return;
    }

    const chip = e.target.closest('[data-kit]');
    if (chip) {
      const row = chip.closest('.kit-row');
      const lesson = row.dataset.lesson;
      const list = lesson
        ? (setupDraft.kit[lesson] || (setupDraft.kit[lesson] = guessKit(lesson)))
        : setupDraft.everyDay;
      const at = list.indexOf(chip.dataset.kit);
      if (at < 0) list.push(chip.dataset.kit); else list.splice(at, 1);
      chip.classList.toggle('is-on', at < 0);
      chip.setAttribute('aria-pressed', String(at < 0));
      return;
    }

    if (e.target.closest('#setup-back')) {
      setupAt = Math.max(0, setupAt - 1);
      renderSetup();
      $('#setup').scrollTop = 0;
      return;
    }
    if (e.target.closest('#setup-next')) setupForward();
  });

  /* The photo. The same three controls turn up in the setup and in the
     editor, so they are handled once and each says which to redraw. */
  const redrawFor = (scope) => (scope === 'setup' ? renderSetup : renderTtEdit);
  document.addEventListener('change', (e) => {
    const input = e.target.closest('[data-photo]');
    if (input) takePhoto(input, redrawFor(input.dataset.photo));
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-photo-open]')) { openPhoto(); return; }

    const read = e.target.closest('[data-photo-read]');
    if (read) { readTheWeek(read); return; }
    const drop = e.target.closest('[data-photo-drop]');
    if (!drop) return;
    clearPhoto();
    // Whichever screen the button was on is the one to redraw.
    if (drop.closest('#setup')) renderSetup(); else renderTtEdit();
  });
  on('#photo-view', 'click', closePhoto);

  on('#tt-edit-open', 'click', openTtEdit);
  on('#tt-edit-cancel', 'click', closeTtEdit);
  on('#tt-edit-save', 'click', saveTtEdit);
  /* The editor and the setup draw the same grid, so one handler reads it.
     Typing writes straight into whichever draft drew it, which is why the
     field keeps the caret and nothing is redrawn on a keystroke. */
  const weekTyping = (e) => {
    const cell = e.target.closest('.tt-edit-cell');
    const when = e.target.closest('.tt-edit-when');
    const field = cell || when;
    if (!field) return;
    const week = field.dataset.scope === 'setup'
      ? (setupDraft && setupDraft.week) : ttDraft;
    if (!week) return;
    if (cell) {
      const day = +cell.dataset.day, p = +cell.dataset.period;
      (week.schedule[day] || (week.schedule[day] = []))[p] = cell.value.trim() || null;
      return;
    }
    week.periods[+when.dataset.period] = when.value;
  };
  on('#tt-edit-body', 'input', weekTyping);
  on('#setup-body', 'input', weekTyping);
  on('#tt-edit-body', 'click', (e) => {
    if (!ttDraft) return;
    if (e.target.closest('#tt-add-period')) {
      ttDraft.periods.push('');
      renderTtEdit();
      return;
    }
    if (e.target.closest('#tt-drop-period')) {
      if (ttDraft.periods.length > 1) ttDraft.periods.pop();
      renderTtEdit();
      return;
    }
    if (e.target.closest('#tt-reset') && confirm(tr('tt.resetAsk'))) resetTtEdit();
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
    if (e.key === 'Escape' && !$('#photo-view').hidden) { closePhoto(); return; }
    if (e.key !== 'Escape') return;
    if (!$('#book').hidden) closeBook();
    else if (!$('#timetable').hidden) closeTimetable();
    else if (openSheetSel) closeSheet();
    else if (!$('#subject-page').hidden) closeSubjectPage();
  });

  on('#home-list', 'click', (e) => {
    if (e.target.closest('[data-act="add-first"]')) openHwSheet();
  });


  /* ── The collection ─────────────────────────────────── */
  on('#collection', 'click', (e) => {
    const slot = e.target.closest('[data-monster]');
    if (slot) { openCreaturePage(slot.dataset.monster); return; }
    // A locked card says what it would take, rather than nothing at all.
    if (e.target.closest('[data-locked]')) showToast(tr('cre.lockedNote'));
  });

  on('#cre-filters', 'click', (e) => {
    const chip = e.target.closest('[data-cre-filter]');
    if (!chip) return;
    creFilter = chip.dataset.creFilter;
    renderCollection();
  });

  on('#cre-search-btn', 'click', () => {
    const wrap = $('#cre-search-wrap');
    const input = $('#cre-search');
    const open = wrap.hidden;
    wrap.hidden = !open;
    $('#cre-search-btn').setAttribute('aria-expanded', String(open));
    if (open) { input.focus(); return; }
    // Closing it clears it, or the grid would stay filtered by a box nobody
    // can see.
    input.value = '';
    creQuery = '';
    renderCollection();
  });
  on('#cre-search', 'input', (e) => { creQuery = e.target.value; renderCollection(); });

  on('#cmp-banner', 'click', (e) => {
    if (e.target.closest('#cmp-pick')) { openCompanionPage(); return; }
    const view = e.target.closest('#cmp-view');
    if (view) openCreaturePage(view.dataset.monster);
  });

  /* ── One creature's page ────────────────────────────── */
  on('#creature-back', 'click', closeCreaturePage);
  on('#creature-fav', 'click', () => {
    if (!creatureAt) return;
    toggleFavourite(creatureAt);
    renderCreaturePage();
  });
  on('#creature-body', 'click', (e) => {
    if (e.target.closest('#cre-make')) {
      setCompanion(creatureAt);
      renderCreaturePage();
      render();
      showToast(tr('cmp.swapped', { name: monsterById(creatureAt).name }));
      return;
    }
    if (e.target.closest('#cre-share') && canShare()) {
      const m = monsterById(creatureAt);
      // The phone's own sheet, and nothing if it is dismissed.
      navigator.share({ text: tr('cre.shareText', { name: m.name }) }).catch(() => {});
    }
  });

  /* ── Choosing a companion ───────────────────────────── */
  on('#companion-back', 'click', closeCompanionPage);
  on('#companion-body', 'click', (e) => {
    const card = e.target.closest('[data-pick]');
    if (card) { companionPick = card.dataset.pick; renderCompanionPage(); return; }
    if (!e.target.closest('#cmp-set') || !companionPick) return;
    // Only now is it saved.
    setCompanion(companionPick);
    closeCompanionPage();
    render();
    showToast(tr('cmp.swapped', { name: monsterById(companionPick).name }));
  });

  on('#pro-companion', 'click', (e) => {
    if (e.target.closest('#pro-change') || e.target.closest('#pro-pick')) openCompanionPage();
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
  wireArtFallback();
  load();
  saveLocal();      // write the migrated shape back, without bumping the sync clock
  applyTheme();     // the colour of the place, before it is painted once
  applyLang();      // before anything is drawn, so nothing is drawn twice
  wireApp();

  $('#main').hidden = false;
  // The page asked for, unless something else is being opened on purpose.
  showTab('home');
  // The third link has no week of its own. It asks for one before it shows
  // anything, because a homework app with no timetable is a blank page.
  if (needsSetup()) openSetup();
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