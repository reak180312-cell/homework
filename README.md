# Homework

All your homework in one place. Open it, see what's left, add something in a few seconds, tick it off.

Built as an installable web app: no build step, no dependencies, no account, no server.
Everything lives in your browser's local storage on your own device.

## Run it

```
npm start
```

Then open <http://localhost:5173>.

You can also just double-click `index.html`, but serving it is better — offline support and
reminders need a real origin.

## Put it on your phone

1. Make sure your phone and this computer are on the same Wi-Fi.
2. Find this computer's LAN address (`ipconfig` → IPv4 Address, e.g. `192.168.1.20`).
3. On the phone, open `http://192.168.1.20:5173`.
4. **iPhone:** Share → Add to Home Screen. **Android:** menu → Install app.

Once installed it opens full screen, works offline, and keeps its own data.

## The loop

```
Choose subjects → Add homework → See it all together → Finish it → Earn XP → Repeat tomorrow
```

- **Homework** — everything unfinished, soonest first. Tap the circle (or swipe a card
  right) to finish it. Tap the card to edit or delete it.
- **Bag** — what to bring each school day: your every-day things, then each lesson with its
  own kit, and any reminder pinned to that lesson.
- **Reminders** — things to remember, each set for a day and optionally a single lesson
  ("bring the geometry notebook, not the maths one" on Tuesday maths).
- **Subjects** — one page per subject: what's open, and what you've already handed in.
- **Profile** — level, XP, when you finished things, and the daily reminder.

Adding is the fast path: press **+**, type, press Enter. The subject you used last is already
selected and the due date is optional, so the shortest add is two actions.

## Timetable

The weekly schedule is built in. A miniature of the week sits on the Bag page, and the button
in the top-right corner opens the full grid from any screen. Lessons are colour-matched to
the subjects you picked at setup.

What to bring to each lesson is set during setup and editable any time — tap a lesson on the
Bag page, or Edit beside "Every day".

It lives in `SCHEDULE` in [app.js](app.js) as one row per day, Sunday to Thursday, eight
periods each — edit that array when the timetable changes. Teacher names, room numbers and
the school name are deliberately not in this repo: the repo is public, and none of them are
needed to pack a bag.

## Reminders

Two, both off by default, both set in Profile:

- **Daily reminder** (3:00 PM) asks "Any homework today?" and opens straight into the add screen.
- **Pack your bag** (8:00 PM) lists tomorrow's lessons and any reminders you saved for that day.

One honest caveat: a web app can only run its timer while it's open or installed in the
background. Adding it to your home screen makes this far more reliable — a browser tab you
closed hours ago can't wake itself up. This is a limitation of web apps, not a bug.

## Data

Stored under the `homework.v1` key in local storage:

```js
Subject      { id, name, icon, glyph, color }
Homework     { id, subjectId, title, dueDate, createdAt, completed, completedAt }
Note         { id, text, day, createdAt }   // day 0-4 = Sun-Thu, null = every day
UserProgress { xp, level }              // +10 XP per homework, 100 XP per level
Settings     { dailyReminderEnabled, dailyReminderTime,
               bagReminderEnabled, bagReminderTime }
```

`dueDate` is a plain `YYYY-MM-DD` string so it can't drift across time zones.
`completedAt` is set automatically the moment you tick something off.

Clearing your browser data for this site erases everything, and the data doesn't sync
between devices.

## Files

```
index.html    markup + the SVG icon set
styles.css    the whole visual system
app.js        all behaviour, one file, sectioned
sw.js         offline cache + notification clicks
server.js     dependency-free static server
tools/        regenerates the app icons (npm run icons)
```

## Design rules

Colour belongs to the subjects. Everything else is warm paper, near-black ink for actions,
and green only for "done". Before adding a button, option, or screen, the test is: *does this
make entering or completing homework easier?* If not, it doesn't go in.
