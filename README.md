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

**Add it to the Home Screen.** In a browser tab the app is not running full screen: Safari
keeps its own bar at the top — with the white strip and the back-link to whatever app you
opened it from — and its toolbar at the bottom, which together cost about 180px of height.
That is the difference between the board having 300px to fill and having 170. Added to the
Home Screen there is no browser chrome at all, and the wall runs the whole way to the top of
the screen, under the clock and the Dynamic Island: the status bar style is
`black-translucent`, so the page is drawn behind it rather than below an opaque band, and
every screen pads itself by `env(safe-area-inset-top)` so nothing ends up under the clock.

1. Make sure your phone and this computer are on the same Wi-Fi.
2. Find this computer's LAN address (`ipconfig` → IPv4 Address, e.g. `192.168.1.20`).
3. On the phone, open `http://192.168.1.20:5173`.
4. **iPhone:** Share → Add to Home Screen. **Android:** menu → Install app.

Once installed it opens full screen, works offline, and keeps its own data.

## The loop

```
Open it → Add homework → See it all together → Finish it → Earn XP → Repeat tomorrow
```

- **Homework** — everything unfinished, soonest first. Each card leads with the subject in
  its own colour and when the work is for, then says what to do in the largest type on the
  screen, because that is the part you actually read. A note underneath is optional and only
  shows when there is one. Tap the circle on the right (or swipe the card right) to finish
  it; tap the card to edit or delete it. With nothing left the screen clears to one line —
  *You finished all* — and the + leaves the header to sit beside it, so there is only ever
  one of it.
- **Bag** — the drawing this was specified in: a backpack in the middle with everything that
  goes into it around the outside. Nothing points at anything — what is on the page is what
  you take, and the picture says so without being explained. Pick any day along the top;
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

## The desk

The homework screen sits on a desk, whether there is homework on it or not. The picture is
fixed to the foot of the screen and the list scrolls over it, so it reads as the room the
app is in rather than as one more thing in the column. Its top fades into the paper, so the
photograph never ends on an edge, and it stands a little **clear of** the tab bar rather
than running under it, so the books and the cup are whole instead of having their feet cut
off. Both ends fade: the foot needs it as much as the top now that it no longer meets the
tab bar, since the desk surface is a few shades off the paper in daylight and a good deal
lighter than it at night.

The photograph as supplied is portrait and mostly wall — the books, the cup and the plant
sit in its bottom half, and only that half is ever on screen. So only that half is shipped:
cropped from halfway down, which keeps the top of the plant and still leaves a band of plain
wall for the fade to work on. That crop is 1.68 times as wide as it is tall, so at full
width it stands 59.5vw high.

How much of it shows is one figure, `--desk-band`, and both the picture and the cleared
screen are measured from it — otherwise the two drift apart on a screen shaped differently
from a phone, which is exactly what happened when the picture was measured off the width
and the space left for the sentence off the height: they collided on a 540-wide screen. The
band is set against the **width**, because that is what decides how big the things on the
desk look, and capped against the height so a short screen is not all desk. The cap crops
rather than shrinking them: `object-position: 50% 100%` anchors the picture to its own foot,
so it is the wall above the desk that goes.

The picture is shown only once it has decoded. Half a photograph drawn top-down looks like
something has gone wrong; nothing, and then all of it, does not.

It used to be something the empty state carried, fetched quietly at idle so it would be in
hand the moment the last piece of homework was ticked off. Now that it is part of the
screen it loads with the page, and that warming step is gone.

It is kept under 60KB, which is a promise the speed tests hold the build to. Rebuild it
from a fresh photograph with `scratchpad/new-desk.js`, which crops, resizes, and then picks
the highest JPEG quality that still comes in under the limit rather than guessing at one.

## Timetable

The weekly schedule is built in. The button in the top-right corner opens the full grid from
any screen. Lessons are colour-matched to the subjects you picked at setup, and the Bag page
reads the day's subjects straight off it.

Every lesson is filled with its subject’s own colour and written on in ink — the same two
numbers as the subject tiles, so a grid of them reads as one thing rather than a wall of pale
washes that were nearly all the same colour.

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

The things themselves are not drawn in code — they are the supplied artwork, one file per
thing in [art/bag/](art/bag/), trimmed to its own edges and kept at its own shape. Only the
leads are drawn, and only because they have to know where the bag is. All ten come to about
130 KB and ride in the offline cache.

The layout is measured off that drawing rather than judged by eye: the scene is 400 by 492,
the bag spans 161 of it and sits centred, and every thing has its own place, size and lead in
`BAG_PLACES`. Sport, the MacBook and the Tanach share the slot beside the bag and the AirPods
take the one above it, so no day needs a taller picture than any other.

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

### The room

The top of the screen is part of the page, not a strip above it. Two things have to be true
for that. The status bar style is `black-translucent`, so iOS draws the page behind the clock
rather than below an opaque band of its own. And `theme-color` — which is what a browser
paints the bar *around* the status bar with — is kept in step with whatever the page is
standing on: flat paper on every other screen, and the wall's own top band, `#F0E3D6`, on
this one. Left at the paper colour it sat eleven levels off the wall behind it, and eleven
levels across a hard horizontal line is exactly a seam. `syncTopColour()` in
[app.js](app.js) does it, on every tab change and whenever the hour turns dark.


The page is a room: a cream wall with the daylight and the leaf shadows on it, the board
hung on it, and a shelf at its foot with the books, the pencil cup, the little checklist pad
and the plant.

### The shell, and why the bottom bar moved

**The document does not scroll.** It cannot: the body is pinned to the window and each screen
scrolls inside itself instead. That one rule is what the bottom bar was moving for.

The bar had always been a single `position: fixed; bottom: 0` rule that no page was allowed to
override, and measuring it on all five screens in a browser gave the same top edge, the same
height and the same line of icons every time. It still looked wrong on the phone, and it was:
a bar fixed to the bottom of a **scrolling document** is fixed to the *layout* viewport, and on
iOS — in a Home Screen app especially — the visual viewport slides against the layout one while
a flick is still carrying and at the ends of a rubber-band. A screen with nothing to scroll
never went out of step. A long list of subjects did, and settled with the bar somewhere lower
than the screen before it. Nothing about the bar differed, which is exactly why it measured the
same everywhere and still did not look it, and why it was fine in a Safari tab and wrong
installed.

With no document scroll there is no second viewport to slide, and the bar is nailed to the
window on every screen. The reminders room already worked this way — fixed to the window, the
board scrolling inside it — and was the one screen that never moved; the other four have been
brought to the same shape. `.app` is the window, each `.view` is an absolutely positioned
scroller filling it, and the 540px column is now padding on the screen rather than a width on
the shell, so a screen scrolls edge to edge while its content stays in the middle.

**The notches are read once and named once.** `--safe-t` and `--safe-b` hold
`env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`, and everything that has to clear
the clock, the island or the home indicator is measured from those two and from nothing else.
There were twenty separate `env()` calls scattered through the stylesheet, which is twenty
chances for one screen to allow for the phone differently from the next. It also makes the
thing testable: Chrome cannot be put into iOS standalone mode and will not report real insets,
but it can be *told* what an iPhone would have said — `scratchpad/test-shell.js` overrides the
two variables and lays the whole app out as though there were a 59px island above and a 34px
home indicator below, on four phone shapes and on its side.

There are no `@media (display-mode: standalone)` rules anywhere in the stylesheet, and there
should not be: a bar that needs to be told it is installed is a bar that is positioned wrongly.

What was also not shared was **the room left above it**: a list screen stopped 102px from the
bottom and the room stopped at 62px, so the band of cream under the content was forty pixels
taller on four screens out of five. There is one `--content-bottom` now and every screen uses
it, which costs the room the way its shelf used to stand directly on the bar — a little wall
shows under it instead, and it stops where a list of homework stops.

The bar is also the same cream as the pages that stand on it, so on a page made of paper it
had no edge of its own and read as part of the page, while against the room it read as a band
of its own. A hairline of light above the rule gives it the same edge on every screen.

**The bar is 60px on a phone with a home indicator and 46px on one without**, and the row that
holds the icons is 45px of that in both cases. Neither the icons nor the words got smaller to
manage it — they are the same 22px and 9.5px they always were, and the five tabs are the same
width.

The bar had been built out of **two numbers that had nothing to do with each other**:
`height: calc(var(--tabbar-h) + var(--safe-b))` with `padding-bottom: var(--safe-b)`. The first
is a row chosen against what the row holds. The second is the whole of whatever the phone
reports for its home indicator — 34pt — and all of it was empty. That padding was **43% of the
bar** and 34 of the 39.5px of blank beige under the labels; the rest was the row's own centring
slack. `scratchpad/audit-bar.js` prints the box model of everything overlapping that band, and
it says plainly that nothing else is there: no over-tall wrapper, no doubled inset, no
`height: 100%` parent. The bar's own box was the whole story.

It keeps `min(var(--safe-b), 14px)` now. iOS draws the home indicator 8pt up from the bottom
and it is 5pt tall, so the **bottom 13pt are the only part a bar has to stay out of** — and the
indicator sits mid-screen, which is exactly where *Reminders* is, so a label may not reach into
it. 14 clears 13 by a pixel. A phone with no indicator reports no inset and keeps none of it,
which is why the bar is 46px there and not padded out to match.

The bar's true total is published as `--bar-h`, and everything standing on top of it — where a
page stops scrolling, where the desk rests, where a toast sits, how tall an empty home screen
is — measures from that one value. They each used to add the raw inset back on for themselves,
which is how a bar and the things above it got out of step.

**Every screen starts its heading at the same height.** The room needs a little more air
under the status bar than a list does, so it set its heading 40px down while every other
screen set theirs at 26px — fourteen pixels, which is nothing to describe and impossible not
to see when you move between tabs. There is one `--head-top` now, at the lower of the two,
and the two buttons that float in that same top corner moved down with it.

The sticky beside the heading is half again as tall as the heading is. Left in the flow it
set the height of the whole row and pushed the heading down its middle, which put this
screen's first line 22px below every other screen's even after the padding matched. It is
lifted out of the flow and hung on the heading's own middle instead, so it still lines up
with the heading without having any say in where the heading starts.

**It is one screen, and it stays put.** The heading, the tabs, the board and the shelf share
exactly what the window gives them, and the page itself does not scroll — so the room is
always whole, and nothing can be dragged out from under anything else.

The page is `position: fixed` to the window rather than merely `100dvh` tall. A page with a
height still has a scroll position to rubber-band against, and a phone will happily drag the
whole room up and down against nothing; one fixed to the window has no page behind it to
pull. The timetable button is off this page too — that corner belongs to the sticky, and the
timetable has nothing to do with what is pinned to the board.

That is the second attempt. The first fixed the shelf to the foot of the screen and let the
board grow down the page, which is fine on a tall screen and wrong on a short one: measured
on the 390x664 a phone browser actually leaves once its own bars are in, the page came to
786px in a 664px window and the board ran **104px straight through the shelf**. Now the shelf
is the last thing in the column rather than a picture floating over it, so the two meet
exactly instead of overlapping, at every size.

The board takes what is left between the tabs and the shelf — 170px on that short screen, 303
installed — and when there are more notes than fit, they scroll **inside the board** rather
than pushing the shelf off the bottom. The foot of the cork is shaded, so a row the board
cannot fit fades into shadow instead of being sliced off mid-note.

The shelf's height comes from the picture's own shape — 1.588 times as wide as it is tall, so
at full width it stands 63vw high — capped at 30vh so a short screen gives the board its room
back. Its top fades into the wall, so the join never reads as an edge.

At night the wall and the shelf dim to the paper, and the board dims with them: left at full
daylight it looked lit from somewhere the room was not.

### The board

Reminders are pinned to a cork board rather than listed in rows: a small square of paper
each, a pin through the top, the time underlined above the words, and — when the reminder
belongs to a lesson — that subject's name written across the bottom-right corner on a slant,
rising, the way a name goes on the back of a photograph.

The corner used to hold a small icon instead. An icon can say that a note belongs to a
lesson but never which lesson: a book means maths, language and history alike, so the one
thing it was there to tell you was the one thing it could not. The name costs the same
corner and says it outright.

It is hinged at its **left-hand** end, which is not where you would first put it. Turning a
line anti-clockwise about its right-hand end — the note's own corner, the obvious anchor —
sends its left-hand end downwards, and downwards from the bottom corner of a note is off the
note: a seven-letter subject hung 13px into the cork. Hinged at the other end every part of
the line rises from that point and nothing can fall below it, so the corner stays put and
the name climbs away from it.

It is printed into the paper rather than laid on top of it: small, letter-spaced, and mixed
well back towards the ink of the page — enough of the subject's own colour left to tell one
from another, faint enough that the words above it are read first. It is out of the flow
entirely, so however long a subject is called it cannot push the reminder about.

Pin and tilt come from the reminder's own id, so a note keeps its look between redraws
instead of reshuffling every time the page is drawn. They come from **separate hashes** of
that id, not slices of one: sliced, they agreed with each other, and since the first hash
merely scaled and took a remainder, ids a character apart moved by a fixed step — a board of
eight notes came out in three colours. The hash mixes its bits now. A note that has never
been given a paper of its own falls back to the same hashes, which is how every note looked
before there was anything to choose, so an old board keeps the variety it had.

Every colour on this page was **read off the drawing** rather than matched by eye: the most
common tone in each region, which is the paper or the cork itself rather than a highlight on
it or the shadow under it. The cork is `#C89868`, the frame `#D8B084`, and the six papers
run from `#F8F0E8` through `#FBD8D0` to `#FBEBC2`. `scratchpad/mock-mode.js` is what read
them.

The cork itself is a 240px tile generated to that colour, with much finer mottling than the
board it came from — a 160px tile with patches big enough to read as a motif turned into a
visible pattern once it repeated four times across the board
— about fifteen levels — with every fleck drawn four times so the pattern meets itself at the
edges. It tiles at any size for under seven kilobytes, which a cut of the real board could
not: every clean patch of it is small, and the notes cover the rest. Rebuild it with
`scratchpad/make-cork.js`.

### The paper

There is **one arrow**, and each tap of it turns the page you are writing on into the next
made-up paper: lined cream, soft yellow, grid notebook, pastel sticky, torn edge, textured.
Keep tapping until one of them is right, then stop.

It was two rows of swatches before — a row of patterns and a row of colours. That is a parts
bin, and a parts bin asks you to design a note before you are allowed to write one. Six made
papers ask nothing.

Underneath, a paper is still **a pattern and a colour kept apart** — the colour sets `--tint`
and the pattern draws on top of it — because that is what makes six papers cost no more than
one, and because a note written before any of this existed still has to know what it is. Each
colour carries its own ruling in `--rule` as well: a blush page ruled in the cold blue that
suits cream looks like two papers at once; ruled in a warm rose of its own it looks like one.

**The page you write on becomes the paper**, rather than showing a swatch of it beside a page
that stays the same. It wears the very classes the note will wear, so there is no second
description of a paper anywhere to drift out of step with the first. What it does not take is
the fine ruling: the page already reads as ruled paper — every field sits on its own rule —
and 13px lines under those would be two rulings at once. Colour, grid, fleck and torn edge
carry the difference at that size, and the punch holes are left off a sticky and a torn scrap,
which do not have them.

The patterns themselves are drawn, not photographed, so they cost nothing to send and stay
sharp at any size. The lined paper is a leaf out of a spiral pad, punched holes and all; the
torn one is ragged down its left edge; the textured one has a few soft flecks in the pulp at
three sizes that share no factor, so the eye never finds the repeat.

To change a note already on the board, **hold it** and it turns over to the next paper where
it lies. That used to open a sheet of its own with the two rows in it, which is a settings
panel for one square of paper. There is no button for this on the note either: a note the size
of a stamp has no room for one, and a board is meant to be handled rather than operated.

Across the top: today, tomorrow, as many of the following school days **as actually fit**,
and then *More*, which opens the rest of the week and everything at once. How many fit
depends on what the days are called — Sunday and Monday fit where Wednesday and Thursday do
not — so the row is filled and then trimmed back to what the width allows, rather than
guessing at a number that is right one week and wrong the next.

**Days keep their full names.** The row used to shorten them when they would not fit, which
left it reading *Today, Tomorrow, Tue, Wed* — two naming systems in five words. A day that
will not go is dropped now rather than abbreviated, and *More* still has it. On a 390px phone
that is Today, Tomorrow, Tuesday, More; on a wider one Wednesday comes back.

A reminder set for every day shows on all of them, because that is what every day means.
Earliest first, and anything without a time after everything with one. There are no counts on
the tabs, because the drawing has none.

### Moving them

**A note can be picked up and put down anywhere on the cork**, and it stays where it was
left. The cork stopped being a grid for this: notes are placed on it rather than flowed into
it, absolutely positioned, and the board no longer scrolls because there is nowhere to scroll
to when nothing is stacked.

Where a note sits is kept as a **percentage of the board rather than a pixel count**, so
turning the phone or opening the app on a wider screen moves the whole board together instead
of scattering it. A note that has never been moved has no position at all and falls into the
next free slot — three across and four down — so a board nobody has arranged still reads in
order, and only the ones you have actually placed are pinned down.

One finger has to mean three things, and they are told apart by what it does rather than by
where it lands: a press that goes nowhere and lifts is a **tap**, which takes the note down;
a press that moves more than **8px** is a **drag**; a press that stays still for **480ms** is
a **hold**, which opens the note's paper. Eight pixels is small enough that dragging feels
immediate and large enough that a tap on a moving bus is still a tap — a thumb is never
perfectly still. The note is captured on pointerdown, so a finger that outruns it keeps
dragging it rather than dropping it, and `touch-action: none` stops the browser claiming the
gesture for a scroll it has nowhere to go.

A keyboard has no pointer to drag with, so Enter or Space on a note still takes it down: a
real click arrives with `detail` 1 and is already handled by the pointer that made it, and a
click generated by a key arrives with `detail` 0.

**An empty board says so in the middle of itself** — *Nothing pinned up yet*, and under it
*Tap to write one*; a day with none of its own says *Nothing for Tuesday* instead. The whole
of the board is the way in, not a target inside it: notes are placed on the cork rather than
flowed into a grid, so the message can have all of it.

It was taken away once, on the reasoning that a bare corkboard already says it is bare. That
is true of the board and not of the tap — nothing about bare cork suggests you can touch it —
and an empty screen with no words on it reads as much like a fault as like an invitation. The
heading did lose its second line for that reason and has not wanted it back: *Small steps. Big
progress.* was decoration on a screen that is a photograph of a room already.

A note comes off the board with **one tap**, undoably: the drawing gives a note no cross to
press, and a board covered in crosses is not the drawing. The toast offers it straight back,
which is the same bargain the homework list makes when something is ticked off.

The + that used to float in the corner is a sticky pinned to the wall beside the heading,
where the drawing puts it — and it is the drawing itself, pin, plus, handwriting and the
little lines beside the pin, cut off its background rather than a square built out of CSS.
It hangs on the heading's own middle. It used to hang above it, level with the top of a
two-line heading, and once the second line went it was left sitting high on the wall with
nothing beside it.
The first attempt at that cut came from a 5KB thumbnail and ate the note, which was only
fourteen levels from its own background; the full-size one keys cleanly. The timetable button
is fixed to that same corner, so the sticky is sized to stand clear of it — including on a
320px screen, where the button is wider and the board drops to two notes across.

Two things in the drawing are not here. Its tab bar is Home / Calendar / Stats / Profile,
which is a different app's navigation. And its doodles are chosen to match each reminder's
words — a book for the maths test, a cart for the milk — which nothing in the app can infer
from what you type. The corner they sit in carries the lesson's name instead, which is
something the app does know.

### Writing one down

The + on the Reminders page opens a page torn out of a notebook: punched down the side, a
red margin just inside the holes, and every field sitting on its own rule. The rules are the
rows' own bottom borders rather than a background of ruled lines, so nothing has to be nudged
to make the writing sit on them — the row *is* the line.

The handwriting is whatever script the phone already has: an iPhone has Snell Roundhand for
the title and Bradley Hand for the notes in the margins, which is what the design uses.
Anything else falls back to its own cursive. No font is downloaded for it.

Five fields: what to remember, a line about it, an optional time, which day, and which lesson
of that day. The five school days come first so they are all in view at once, with *Every
day* after them; a lesson can only be picked once a particular day is, because lessons differ
from day to day.

**The time is a label, not an alarm.** It is what the note says at the top and what the board
sorts by. It does not ring: the app cannot wake a closed browser at half past seven — see the
limits below — and nothing in the interface suggests it will. It is optional, and a note
without one simply sits after the ones that have them.

There is no *Repeat*: the day already is the repeat. *Every day* or *Tuesday* says everything
a weekly repeat would.

This replaced a compose box that sat at the top of the list. The + matches how homework is
added, and the list is left to be a list.

### Being reminded

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

Fifty little creatures. Every level hatches one, and which one is luck: the egg is rolled
when it cracks, and it can be any of the fifty you have not met.

They come in five kinds, from the ones you will see often to the one you may never:

| Rarity | How many | Chance per egg |
| --- | --- | --- |
| Common | 20 | 55% |
| Uncommon | 14 | 26% |
| Rare | 9 | 13% |
| Epic | 5 | 5% |
| Legendary | 2 | 1% |

The roll picks a rarity by those weights, then picks at random among the ones of that
rarity you are still missing. Once a whole tier is collected, a roll that lands on it falls
back to anyone still missing, evenly — so an egg is never wasted, and the rarer ones start
turning up faster as the common ones run out. A creature never hatches twice while a
stranger is left. Fifty levels is 500 pieces of homework, so the last of them is a long way
off — which is the point.

### Hatching

Reaching a level takes over the screen. An egg drops in, rocks, cracks along its middle,
breaks open, and whoever was inside pops out. The shell tells you something before it
opens: its pattern is the rarity — dots, stripes, stars, swirls, a gold crown — and its
colour is the creature inside, so no two eggs look quite alike and a good one is worth
watching land. The rarity is the headline when it hatches; the new level is said quietly
underneath, because by then it is the smaller news.

It happens once, the first time you reach that level, and a tap is ignored until the egg
has actually opened, so a stray touch can't skip the one thing worth watching. Which
creature it was is written down the moment it is rolled, so closing the app mid-hatch
cannot turn it into somebody else.

The whole sequence is CSS keyframes on one fixed timeline. Nothing is measured or stepped
in script, so there is nothing to drift out of step.

### The book

The collection is a book, opened from its cover on Profile. Each creature gets a spread of
two facing pages: who they are on the left — portrait, age, size, hobbies, when you found
them, and the egg they came out of — and everything else on the right: where they live,
what they eat, what they say, what they are best at, what they are not, and one line about
them at the foot of the page. Nine facts each.

Turn pages with the arrows or by swiping. Whoever is coming next sits at the back as an
egg, with how much XP is still to go — and nothing about who is inside it, because that
is not decided until it cracks. The ones after that are not in the book at all. The
shelf under the cover still shows everyone at a glance, and tapping a creature opens the
book at their page.

MONSTERS in [app.js](app.js) holds all fifty. They are drawn, not pictures: monsterSvg()
composes a body shape, one to three eyes, something on top and a marking, over a shared set
of big eyes, blush and a smile, and eggSvg() does the same for shells — so fifty of them
read as one family, the whole cast costs a few kilobytes of code, and nothing has to be
downloaded.

## Data

Stored under the `homework.v1` key in local storage:

```js
Subject      — not stored: taken from the timetable, keyed by the lesson's own name
Homework     { id, subjectId, title, dueDate, createdAt, completed, completedAt }
Note         { id, text, note, at, day, lesson, createdAt }  // day 0-4 = Sun-Thu, null = every day
             //  at is "HH:MM" or "" — a label on the note, not an alarm
UserProgress { xp, level, shownUpTo,    // +10 XP per homework, 100 XP per level, fifty of them
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
art/          the desk the homework screen sits on; the wall, shelf, cork and
              Add-reminder sticky the reminders are pinned up in; and the bag's
              ten pieces. About 290KB in all, cached by the service worker on
              the first launch and never fetched again.
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

## Language

English or Hebrew, chosen at the foot of Profile, and **every word the app says for itself**
follows — headings, buttons, empty states, the days across a week, the dates on a card, the
text of the two notifications. Nothing you typed is touched, and neither is a subject name: a
lesson is called what the school calls it in either language, because those are your words
and not the app’s.

Choosing Hebrew **turns the whole page over** — `dir="rtl"` on the root — rather than leaving
Hebrew sentences running the wrong way inside a left-handed layout. Most of the stylesheet
was already using logical properties and needed nothing; what did need changing was every
corner something was pinned to. The `+` and the timetable button were fixed to the *right* of
the screen, so in Hebrew they sat on top of a heading that now starts there — `right` became
`inset-inline-end`, and the punched holes and red margin down a notebook page went the same
way. A chevron meaning *onwards* is mirrored, because onwards is the other way.

The dictionary is one object with a key per phrase and a table per language. `tr(key, vars)`
looks one up and fills `{name}` blanks from its second argument, so a sentence can be worded
differently in each language without the caller knowing where the blank falls. Fixed words in
the markup carry `data-t` (or `data-t-ph`, `data-t-aria`) and are looked up again when the
language changes; everything drawn from data is simply drawn again. Nothing reloads — a
language is not a different app.

It is called `tr` and not `t` for a reason worth writing down: a one-letter name for something
every screen calls is a name a loop variable will shadow sooner or later, and it did. `dayTabs()`
keeps a `const t = new Date()` at the top, and every lookup inside that function was calling a
date. It failed loudly — *t is not a function* — which is the lucky version of that mistake.

**What is not translated:** the creature book. Fifty creatures with an age, a size, where they
live, what they eat, what they say, two hobbies, a best and a worst and a fact each is 849
strings of comic writing, and turning that into Hebrew is a piece of work in its own right
rather than a lookup table. The machinery is ready for it; the words are not written.


## One app, more than one timetable

Two people, two school weeks, one app. Each gets a link:

```
https://reak180312-cell.github.io/homework/            the original week
https://reak180312-cell.github.io/homework/?p=yb       a twelfth-grade week
```

Everything that belongs to a particular week — the periods, the grid, how the subjects look,
what goes in the bag — lives in a **profile**. Everything else is shared. There is one
`app.js`, one stylesheet and one page, so a change is a change to every link at once and there
is nothing to keep in step by hand. That was the requirement, and it is the whole reason the
profiles are data rather than copies.

They sit in one file rather than one each because a timetable is a couple of kilobytes and a
second request before the first paint costs more than carrying them all. Adding a third person
is one object in `PROFILES` and one manifest; nothing else moves.

**Each link installs as its own app.** Installing puts the manifest's `start_url` on the Home
Screen, so one shared manifest would have meant both installs opening the same timetable.
There is a manifest per profile in `m/`, and the page points its `<link rel="manifest">` at the
right one before anybody can ask to install.

**And each keeps its own homework.** Two of these can sit on one phone and they are two
different people; a shared `localStorage` key would have had them writing over each other. The
first keeps the plain `homework.v1` so nothing moved when profiles arrived, and every other one
is kept beside it.

**The worker is registered as `sw.js?p=<id>`**, which is how it knows which cache is its own and
which bag to keep. 150KB of somebody else's school things is not worth downloading to never
look at.

### The second week

It is ragged in a way the first is not: a seminar, an art major, two evenings, and a Monday
that does not start until 11:15. The periods are the union of every slot the week actually
uses — ten of them, ending at 20:30 — so a day that starts late simply leaves the morning
empty rather than needing a grid of its own.

Its bag is **laid out rather than placed**. Both weeks draw the same picture — a bag in the
middle, the day’s things around it — but the first gives each thing a fixed place, which works
because it has nine possible things and shows five or six. This one has eleven and a Monday
shows ten: an iPad, a pencil case, a pen, a charger, two books, sports clothes, deodorant, a
water bottle and a diplomacy book. A place each would leave a different hole in the ring every
day, so the day’s things are dealt out alternately down either side instead, and each side is
stacked by the heights things actually have.

That last part matters more than it sounds. Only the **shape** each picture came out of the
cutter as is written down; how big to draw it follows from that. Picking widths by eye gave a
pen 150px tall, because a pen is eight times taller than it is wide. Now every thing is drawn
to fit a 92px square keeping its own proportions, and the labels get their room reserved before
anything is positioned — so no label ever lands on the thing below it, on any day.
`bagStyle` on the profile picks which layout a week gets.


## Five tabs, and what is behind each

**Homework and Subjects share a page.** They are two ways of asking the same question — what
is set — so they sit behind one switch rather than taking two places in a bar that only has
five. The switch is the width of the column and splits it in two, which says *these are the
same thing, seen twice* rather than *here is a filter*. Which half is showing is deliberately
not remembered between launches: the answer you want on opening the app is almost always the
list.

That freed a tab for **Creatures**, which had been a section of Settings and is now a page: the
book, the eggs and the count, with the creature who used to peek over the card still peeking.
Its icon is an open book with two antennae over it. A first attempt drew a book with a creature
behind it and read, at 22px, as a second bag.

One thing the move cost: the empty homework screen measures itself against what is above it,
and the switch is 69px it did not know about, so the sentence landed 13px inside the desk.
`--seg-h` is that number, and the screen subtracts it.


## Settings

The last tab was *Profile* and is now **Settings**, with a line under the heading saying what
it is for and every section behind the same small capitals: profile and progress, the creature
book, reminders, language, appearance, about.

Nine pictures carry it: a **room** behind the whole screen, a **seedling** beside the level, a
**book** leaning on the creature card with *Collect them all!* beside it, a **creature** looking
over the row of **eggs**, another **waving** on the About page, and a small **tile** beside each
of the three settings — a bell for the daily nudge, a bag for the packing one, a globe for the
language. They started as SVG stand-ins drawn by hand; the drawings arrived and the stand-ins
went.

The book is a *sibling* of the card rather than a child of it: the card clips its own overflow,
and a book that leans has to lean past an edge. The same is true of the creature over the eggs.

**Cutting them out.** Eight arrived as squares on a near-white cream ground, and cutting a
subject off that ground by colour alone would have punched holes straight through the egg, the
book's pages and anything else that is itself cream. The ground is not *everything cream*, it is
*the cream you can reach from the edge of the frame* — so the cut is a flood fill inwards from
the border, and a cream belly inside a green outline survives it. The edge is then feathered by
how far each border pixel sits from the ground, so the cut is not a staircase, and the result is
trimmed to what is left. `scratchpad/set-art.js`.

The three tiles could not be cut at all — they are cream tiles on a cream page, and there is no
edge to find. They are *found* instead: a tile differs from the very corner of its page by a
hair and its shadow by more, so the bounding box of everything more than a hair from that corner
is the tile and nothing else. A first pass cropped them at a fixed fraction of the frame and
left a different ring of empty page round each one, because the tiles are not all the same size
in their frames — 83%, 87% and 96%. `scratchpad/set-art2.js`.

All nine come to **83KB** as WebP.

**The room is a wash, not a photograph.** At full strength the desk ran straight through the
sections further down, which are plain words on paper with no card under them. It sits at 40%
and is masked out by 88% of its own height, so it is gone before the page gets there — and at
18% after dark, where it is a memory of itself.

The level card used to say the same thing twice — the line under the bar and the note under
the row of egg slots were both *finish some homework and an egg turns up*. It says it once now.
The row itself is five eggs rather than four empty boxes, which is what is actually waiting.

### Desk theme

**Four desks, shown as the four colours themselves.** There is nothing to read: the row of
swatches *is* the four looks, and the one you tap is the colour the app then stands on.

Three are daylight — cream, sage, sky — and differ only in `--paper`, `--card`, `--line` and
`--line-soft`. Nothing else moves. The ink stays ink and every subject keeps its own colour,
or choosing a desk would quietly restyle the whole app rather than the surface it stands on.
The fourth is **Night**, which is the dark theme that was already in here given a face: before
this it only ever followed the phone and there was no way to ask for it.

Asking for it exposed one thing that had been hiding. `syncTopColour()` decided the colour
behind the clock from `prefers-color-scheme` alone, so choosing Night on a phone set to
daylight left the app dark inside a bright frame. A desk that has been chosen outranks what
the phone is set to. The tab bar's hairline needed the same thought: it is a catch of daylight
on a cream page, and at 55% white on a dark one it is a wire strung across the foot of the
screen. It dims to 9% after dark.

### Two more settings

**Open on** — the page the app launches into, for anyone whose first move is always the bag or
the board rather than the list. Three chips, because those are the three pages you read; the
other two you go to on purpose.

**Ask before removing** — the board takes a note down with one tap, which is quick and undoable
and is the bargain that page makes. For anyone who would rather be asked, this puts the
question in the way instead. Off by default: the undo is still the better answer for most
people.

### Help & About

A row that says which version this is, opening a page with three short answers: what the app
is, how to get it onto a phone properly, and where the work lives — on the phone, sent nowhere,
nothing to sign in to.


## The icon on the Home Screen

It went missing and the phone drew a letter **H** in its place, which is what iOS does when it
cannot get an icon at all. The file was fine — 180×180, opaque, served as `image/png` with a
`<link rel="apple-touch-icon">` in the head. The service worker was the problem, in its very
last line:

```js
return (await fresh) || caches.match('./index.html');
```

`apple-touch-icon.png` was not in the shell, so it was never pre-cached and every request for
it went to the network. When one of those did not land, **the worker handed back**
**`index.html`** — a document — as the answer to a request for a picture. The phone asked for
the icon, got markup, and fell back to the first letter of the app's name.

A page can stand in for a page; that is what makes the app open with no network. It cannot
stand in for anything else, so the fallback is now behind `req.mode === 'navigate'` and
everything else gets an honest 504. The icon is in the shell too, because it is 34KB and it is
the first thing anybody sees of this app.

**Every icon is opaque.** They had cut-away corners, which is right for a favicon and wrong for
a phone: iOS composites a transparent app icon onto black, so a rounded blue square arrives as
a blue tile inside a black box — and iOS rounds the corners itself anyway, so cutting them in
the file only gives it something to fill in. Each one is flattened onto the most common opaque
colour around its own outer ring, so the fill is the art's own background rather than a colour
picked by hand. `scratchpad/flatten.js` does it; `scratchpad/test-icon.js` checks that not one
of them is see-through anywhere, and that the worker cannot answer a picture with a page —
including for real, with the network cut.


## Design rules

Aged parchment, deep ink-blue for text and every primary action, and a red-brown where
something is being marked. A serif carries the headings; everything you operate stays in the
sans, where it reads faster. Colour otherwise belongs to the subjects and the creatures, so
those stay the things you recognise at a glance.

**A subject wears its colour; what is written on it is ink.** A tile used to be a coloured
mark on a 14% wash of the same colour, which made every tile a rumour of a colour and the
marks on the palest of them hard to make out. Now the tile is filled and the mark is black by
day and white by night.

The fill is not the palette colour itself. The palette is tuned for **ink** — deep enough to
read as text on parchment — and those colours used as a fill are dark enough that a black mark
on them disappears, worst on the browns. The fill keeps the hue and takes it to **73% lightness
at 82% saturation**, which is where black sits comfortably; after dark it goes the other way,
down to 38%, where white does. Both numbers were measured off the drawing rather than guessed:
`scratchpad/tile2.js` reads the most common colour inside each tile of it. It is derived in
`tileFill()` rather than listed, so a subject somebody adds themselves gets a tile without
anyone having to choose a second colour for it — and the same two numbers fill the timetable,
which is the same idea at grid size.

**The colour is said once.** A homework card used to write its subject in the subject colour
as well as showing the tile, which is two of the same signal and a weaker one; the name is
plain ink now. The date it is for lost the pill around it — a date is a line of writing, not a
badge — and with the pill went the colour, except for *overdue*, which keeps one because it is
the one you have to see. And the subject chips on the add-homework page lost the dot beside
each name: the ring round the chosen one carries its colour, and the dot was saying it twice
down a row of a dozen.

Before adding a button, option, or screen, the test is: *does this make entering or completing
homework easier?* If not, it doesn't go in.
