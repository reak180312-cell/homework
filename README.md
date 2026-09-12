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
Open it → Add homework → See it all together → Finish it → Earn XP → Repeat tomorrow
```

- **Homework** — everything unfinished, soonest first. Each card wears its subject's colour
  with the name down its spine, when it is for, and what to do. Tap the circle on the right
  (or swipe the card right) to finish it; tap the card to edit or delete it. With nothing
  left the screen clears to one line — *You finished all* — and the + leaves the header to
  sit beside it, over a desk that has been tidied for the day.
- **Bag** — the drawing this was specified in: a backpack in the middle with everything that
  goes into it around the outside, an arrow from each one in. Pick any day along the top;
  everything changes with it. Your own reminders for that day sit underneath, because those
  are things to put in the bag too.
- **Reminders** — things to remember, each set for a day and optionally a single lesson.
  Opens on today; tap **All** to see the rest.
- **Subjects** — one page per subject: what's open, and what you've already handed in. The
  subjects are the timetable's own lessons, so there is no list to keep and nothing to pick.
- **Profile** — level, XP, and the book of creatures you have collected.

Adding is the fast path: press **+**, type, press Enter. The subject you used last is already
selected and the due date is optional, so the shortest add is two actions.

**There is no setup.** The app opens straight onto your homework the first time, because the
timetable already knows every subject you have — one per distinct lesson, in the order the week
first meets them, each with its own colour and mark. `SUBJECT_LOOK` in [app.js](app.js) is only
how they look; which ones exist comes from `SCHEDULE`.

Homework saved by an older version, when subjects were picked by hand, is moved onto the lesson
it was meant for — Math onto מתמטיקה, Hebrew onto שפה. Anything that matches no lesson keeps the
subject it had rather than losing it.

## Timetable

The weekly schedule is built in. The button in the top-right corner opens the full grid from
any screen. Lessons are colour-matched to the subjects you picked at setup, and the Bag page
reads the day's subjects straight off it.

What goes in the bag is worked out from the timetable, and there is nothing to answer:

- pencil bag, bottle and lunch box, every day
- sports shoes on the days there is ספורט
- a notebook for every lesson that day **except חינוך**
- a book only for מתמטיקה, הנדסה, ערבית, ספרות and שפה
- a MacBook and AirPods for תכנות, and a ספר תנ״ך for תנ״ך

Sport, תכנות and תנ״ך never fall on the same day, so the one slot beside the bag holds
whichever of them turns up; a second special item drops in below. `NO_NOTEBOOK`,
`NEEDS_BOOK` and `SPECIAL` in [app.js](app.js) are the whole of it — change a rule there and
every day follows.

The scene is one SVG — the pictures and the leads together, so they scale as a unit and each
lead can be aimed exactly at the bag — with the words laid over it in HTML, so they stay real
text at a real size and wrap when a day has six subjects. `BAG_ART` holds the drawings, each one
around its own origin, and `BAG_PLACES` says where each sits and where its lead leaves and
lands: moving something is changing one pair of numbers.

Nothing is outlined. Every shape is a fill, depth comes from a darker tone beside a lighter one,
and each thing stands on a soft shadow. Each name sits in a pill washed with its own thing's
colour — `BAG_TINT` — mixed against the card, so it is a pale tint on parchment and a deep one
at night. The lead to the bag is dotted and stops at a small open ring rather than an arrowhead:
it points without jabbing. The subjects under a name are the timetable's own, so they read in
Hebrew.

It lives in `SCHEDULE` in [app.js](app.js) as one row per day, Sunday to Thursday, eight
periods each — edit that array when the timetable changes. Teacher names, room numbers and
the school name are deliberately not in this repo: the repo is public, and none of them are
needed to pack a bag.

## Reminders

Two, both off by default, both set in Profile:

- **Daily reminder** (3:00 PM) asks "Any homework today?" and opens straight into the add screen.
- **Pack your bag** (8:00 PM) lists tomorrow's lessons and any reminders you saved for that day.

**On an iPhone, reminders need the app on the Home Screen.** In a Safari tab — or inside
another app's browser, which is where a link from WhatsApp opens — notifications do not
exist at all, and the switches say so and stay off rather than springing back with no
explanation. Share → Add to Home Screen, then open it from there.

One honest caveat even then: a web app can only run its timer while it's open or installed
in the background. A browser tab you closed hours ago can't wake itself up. This is a
limitation of web apps, not a bug.

## The collection

Twelve little creatures, one per level. Blip turns up at level 1, Luna at level 12.

### Hatching

Reaching a level takes over the screen. An egg drops in, rocks, cracks along its middle,
breaks open, and whoever was inside pops out. Every creature has its own shell — twelve
patterns and twelve colours — so the same thing never hatches twice. It happens once, the
first time you reach that level, and a tap is ignored until the egg has actually opened,
so a stray touch can't skip the one thing worth watching.

The whole sequence is CSS keyframes on one fixed timeline. Nothing is measured or stepped
in script, so there is nothing to drift out of step.

### The book

The collection is a book, opened from its cover on Profile. Each creature gets a spread of
two facing pages: who they are on the left — portrait, age, size, hobbies, when you found
them, and the egg they came out of — and everything else on the right: where they live,
what they eat, what they say, what they are best at, what they are not, and one line about
them at the foot of the page. Nine facts each.

Turn pages with the arrows or by swiping. Whoever is coming next sits at the back as an
egg, with how much XP is still to go; the ones after that are not in the book yet. The
shelf under the cover still shows everyone at a glance, and tapping a creature opens the
book at their page.

MONSTERS in [app.js](app.js) holds all twelve. They are drawn, not pictures: monsterSvg()
composes a body shape, one to three eyes, something on top and a marking, over a shared set
of big eyes, blush and a smile, and eggSvg() does the same for shells — so twelve of them
read as one family and nothing has to be downloaded.

## Data

Stored under the `homework.v1` key in local storage:

```js
Subject      — not stored: taken from the timetable, keyed by the lesson's own name
Homework     { id, subjectId, title, dueDate, createdAt, completed, completedAt }
Note         { id, text, day, lesson, createdAt }  // day 0-4 = Sun-Thu, null = every day
UserProgress { xp, level, shownUpTo,    // +10 XP per homework, 100 XP per level, twelve levels
               metAt }                  // shownUpTo stops a hatching replaying
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
art/          the desk the homework screen clears to when nothing is left
icons/        app icons, built from the supplied logo. The tab, launcher and 512px
              icons keep the artwork’s rounded tile and its transparent corners; the
              iOS one is opaque edge to edge, because iOS fills transparency with
              black before rounding the corners itself; the maskable one sits on a
              matching blue so Android can crop it to a circle without losing the
              cards. Rebuild them with scratchpad/make-icons.js.
```

## Speed

The whole app is meant to answer immediately, because the thing it is for —
writing down homework and ticking it off — is worth about four seconds of anyone's
attention.

- The service worker serves the shell **from its own cache first** and fetches a
  fresh copy behind it for next time. A launch does not wait on the network, which
  is what made it stall inside other apps' browsers. A new version is still never
  more than one launch away, because the cache name changes with every release.
- Ticking something off clears the row in about **0.4s**, down from 0.9s. The tick
  is still drawn; it just isn't admired for half a second first.
- Finishing a row **removes that row** rather than rebuilding the list around it. Rebuilding
  replaced every other row too, which re-ran their entrance animation and read as the whole
  screen refreshing because one line changed. The one-at-a-time entrance now belongs to a
  screen arriving, not to every redraw inside it.
- **No frosted panels.** The tab bar and the timetable button used to blur whatever was
  behind them. A phone recomputes that blur every frame that anything underneath moves, and
  those two are on screen permanently — so every row that collapsed and every scroll paid for
  two full-width blurs. On parchment the difference was barely visible.
- The desk picture is fetched and decoded **while the app is idle just after opening**, not at
  the moment the last thing is ticked off, which is when it is wanted and the worst time to
  start downloading it.
- The tab icon is a 8 KB file rather than the 51 KB app icon, which the browser
  used to fetch twice on every load.
- The desk picture waits until it has decoded and then fades in, instead of
  painting itself in halfway down the screen, and it reserves its space so nothing
  jumps when it lands.

`test-speed.js` holds these to account: finishing inside 600ms on a four-times
slowed-down phone, the shell served with no network request, and the picture
ending up actually visible.

## Design rules

Aged parchment, deep ink-blue for text and every primary action, and a red-brown where
something is being marked. A serif carries the headings; everything you operate stays in the
sans, where it reads faster. Colour otherwise belongs to the subjects and the creatures, so
those stay the things you recognise at a glance.

Before adding a button, option, or screen, the test is: *does this make entering or completing
homework easier?* If not, it doesn't go in.
