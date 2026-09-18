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
UserProgress { xp, level, shownUpTo,    // +20 XP per homework, 100 XP per level: five to an egg
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

### The third link, which has no week at all

The first two each carry a week and a bag written into the code, because each was built for one
person whose week was known. `?p=own` is built for whoever opens it. It starts with nothing, asks
three questions once, and is the same app afterwards.

**Photograph your timetable.** Two ways in, side by side, because neither is the obvious one —
it depends whether the timetable is on the wall in front of you or already in your phone: **Take
a photo** asks the back camera, **From your photos** opens the roll. Either is optional; you can
skip straight to the grid.

The app does not read the photograph, and says so. There is no reliable way to get a grid off a
phone camera, in two languages, at whatever angle a phone is held, into rows and columns — and
bolting on an OCR engine would be megabytes of download to produce answers you would then correct
line by line, which is slower than typing them while looking at the picture. So the photo goes
where it is useful instead: above the grid, on the next screen, while you fill the grid in. That
turns looking-at-paper-then-looking-at-phone into reading one screen.

It is contained rather than cropped in the strip — a timetable photographed at arm’s length has
its corners at the corners, and cropping to fill removes exactly the part you needed. Tapping it
opens it full size.

The photo is downscaled to 1600px on its long edge and kept under a key of its own rather than
inside the saved state: the state is written out again every time you tick a piece of homework,
and dragging a couple of hundred kilobytes of photograph through that on every tap would be
felt. It also means a full storage quota loses the photo and not the homework. It never leaves
the phone; there is nowhere for it to go, because the app has no server. The same two buttons
are in the timetable editor, so all three links can keep one.

There was a paste-a-timetable box here, with a reader that worked out whether the columns were
separated by tabs, spaces, commas or pipes. It is gone: pasting a timetable on a phone turns out
to be the awkward way round, and photographing it is the natural one.

**Then it shows what it made, to be corrected.** That is the same grid the timetable editor
draws — written once, used by both — so a period can be added or taken out here too.

**Then it guesses what every lesson needs.** The rules read the lesson’s own name in either
language, because the name is the only thing the app knows about a lesson somebody has just
typed in: anything with *sport* or ספורט in it wants a kit and shoes, anything with *cod* wants a
laptop, a lesson nobody recognises gets a notebook. Every guess is meant to be wrong sometimes.
The point of guessing at all is that correcting a list is quicker than writing one, and the
screen it is guessed on is the screen you correct it on.

A first pass showed the whole catalogue against every lesson, which on a real timetable is a page
fourteen lessons long with two hundred and fifty pictures on it — not a question anybody reads to
the end of. A row is the answer instead, with the rest one tap away, per lesson.

Nothing is written to the store until the last step. A half-answered setup is worse than an
unanswered one, because it looks finished.

The eighteen things it can put in a bag are the pictures already drawn for the other two links,
which is the point: a bag you assembled yourself looks like the ones assembled by hand, not like
a list of words with a generic icon beside each. They live in two folders, so a picture is asked
for per item rather than assumed to sit under one prefix.

Two things stopped being constants for this to work. The timetable already had (`periods()`,
`schedule()`), and the button in the corner that draws the week in miniature was still drawn once
and never again — which on a link that starts with no week meant a blank circle until the app was
reloaded. It keeps a signature of what it drew now.

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

That freed a tab for **Creatures**, which had been a section of Settings and is now the
collection itself. Its icon is an open book with two antennae over it. A first attempt drew a
book with a creature behind it and read, at 22px, as a second bag.

### The collection

All fifty at once, three across, **in order of rank** — commons #001–013, uncommons #014–024,
rares #025–037, epics #038–045, legendaries #046–050. The number a creature wears is its place
in the list, so ordering the list by rank puts each rank in a block, and scrolling down the grid
goes from the ones you will find first to the five you may never. The ids did not move: a
collection made before the reorder still counts, and a creature that was #019 yesterday is the
same creature at #030 today.

**All fifty are paintings.** They arrived as 1254px squares, most already cut out and seventeen
with a ground still painted across them. Keying out “everything dark” would have eaten the dark
creatures — a smoke horse, an ink blob, a lava dragon — so the black is taken by flood filling
**inwards from the edge of the frame**: only ground you can reach from outside is background.
The ground is *measured* from the corners of the frame rather than assumed to be black — a
candle arrived on cream, and a cream candle on cream is the same problem as a black horse on
black, so both are one case. Whether a drawing still has its ground on it is decided by whether
the frame is opaque, not by the file extension: that candle was a PNG.
Then two passes of erosion, because JPEG blurs its edges and the ring just inside the cut is
half black — which on a cream page reads as an outline drawn round the drawing.

Two things went wrong on the way, and both are worth writing down.

**The fill walked into the creature.** One tolerance for all fifty is wrong for one painted the
colour of the ground it was painted on: at 60 the fill went out of the background, through a
black horse’s own shoulder and out the other side, and the erosion then widened every channel it
had cut. On a cream card that is a set of gashes across the creature — and it does not show up
in a count of leftover black, because the creature looks *cleaner*. The tolerance is measured
now: the fill runs at a ladder of tolerances and the area it takes is recorded at each. While it
is only eating background that area creeps; the step where it breaks in is a jump. The last
tolerance before the jump is used — 45 for the two that leak, 75 for everybody else.

**The pockets.** Black *shut in* by the creature — between a boar’s spines, under a stag’s belly,
through the gaps in a tree’s roots — is never reachable from the frame, so it stayed as a hard
black patch. A second sweep takes those, and the test is not how dark a pocket is on average:
measured, background trapped in a boar came out at mean 12–15 and an ink creature’s own belly at
20, far too close to call. The test is whether a pocket has a **pitch-black core**. Background is
the frame’s own nothing, dirtied at the rim by compression, so its middle is still exactly
(0,0,0); a creature’s dark interior is paint — dark, but never nothing. Trapped background runs
60–93% core, the crease between two of a boar’s back plates runs 49%, and the line goes in the
gap between them at 55%.

Two details that only turned up by looking. The pocket sweep needs a **tighter tolerance than the
fill** (30, not 45–75): the fill needs headroom to cross the compression halo round the outside,
but a pocket has no rim to cross, and at the fill’s tolerance a boar’s leaf-shadows count as dark
and the shadow comes out from between every plate on its back. And erosion goes on the frame’s
cut **only** — eroding round a pocket as well widened every crease from a shadow one pixel across
into a white gash five across.

The errors either side of 55% are deliberately unequal. A sliver of background left on a creature
is a blemish; a hole cut through one is a broken drawing. The check is automated — pure-black
pixels painted magenta, so leftover background cannot be confused with a creature that is simply
dark — and the ten hardest cut-outs have their surviving area pinned in a test, because a
creature with holes in it has *less* black, not more, and would otherwise read as an improvement.

Each one went to the creature whose page it fits rather than to the next free slot, and then
**every name and every line was rewritten to belong to the drawing**. The grey owl with a halo
and a single gold eye is Totality, and its page is about the four minutes when the birds stop
singing. The clockwork crab is Tickspring, wound in 1911, with a plan for the week that you are
in on Thursday at four. The eleven that kept the flat drawing were rewritten too; none of them
is rarer than uncommon, because the rare ones are the prize and a prize should not be the
plainest thing on the shelf.

Each also has a **story of where it came from** — a few sentences, on its own page and on the
right-hand page of the book. A rainbow came in through an open window and grew legs so it could
leave the way everyone else does. Four theatre masks listened to rehearsals through a cupboard
door for thirty years and came out one night to try the parts. A candle was put in a window to
guide somebody home on a bad night, and it worked, and it has been lit there every night since.

The ids did not change. They are what a saved collection points at and what the art files are
named after, so a collection made before any of this still counts — which is why the creature
called Totality is still `eclipse` in the code.

Every creature had a colour picked by hand, which tints its card, washes its page and patterns
the egg it hatches from. A gold phoenix on a pink wash would look wrong, so a painted creature’s
colour is now measured off its own picture — the average of its **vivid** pixels weighted by
saturation, not of all of them, or every creature would come out the same beige. A mostly-white
deer with blue markings comes out blue; a grey owl comes out grey, because it has nothing more
colourful to offer.

The ones you have not found are **their own silhouette** with a question mark — for a painted
creature, the painting itself with its colour taken out, which is a truer outline than anything
that could be drawn to stand in for it and costs nothing, since it is the same file. Fifty
identical blobs would say nothing about how different they are; a moth, a centipede and a koi
say that much and no more.

The paintings are 1.5MB between them, twice the rest of the app, so **they are not downloaded
with it** — each is kept the first time it is looked at. Two things follow. A painting nobody
has looked at yet, on a phone with no signal, would leave a hole where a creature should be:
it falls back to the flat drawing instead, which is still in the code and costs nothing to draw.
And the creatures you already own are fetched quietly once the app is up, along with whoever is
inside an egg that is about to open — so the book, the profile and the hatching all work with no
signal at all.

The roster is 13 common, 11 uncommon, 13 rare, 8 epic and 5 legendary. The weights on the tiers
moved with it — 38/27/20/11/4, from 55/26/13/5/1 — because a tier is rolled before a creature in
it, so five legendaries behind a one-in-a-hundred door would take six hundred pieces of homework
to meet. That is not a collection, it is a wall.

Rarity used to be a word under every name. At three cards across that was a lot of small print,
so it is the card's border now, and the word moved to the creature's own page and to the card's
label for a screen reader. Locked cards get no border at all below epic: gold and lavender on
the two rarest is a tease, but ranking all fifty strangers would spoil the egg.

A **search** filters by name or number — by number for anyone, by name only for creatures you
have met, since finding a stranger by name would confirm the name exists. Three chips filter
all / discovered / locked, and they stay where they are written rather than following the
scroll. Pinned, they put a slab across the middle of the grid with cards showing above and
below it — the chips came down the page with you instead of staying up where they were put.

### Your companion

One of the creatures you have found comes out of the book and sits on the profile. The point of
it is the counting: **homework finished while they are your companion is finished with them**,
and their page says how much and shows the last three. The companion is written onto the task
itself, not just counted — a task finished three companions ago still knows whose it was, which
is the only way undo can take the credit back off the right one.

Tapping a creature in the picker only moves the preview. Nothing is saved until the button at
the bottom, so a wrong tap costs nothing.

Both new screens open over the page but **under the tab bar**, so the five tabs stay put the
whole way through. That needed them to live inside the app shell: the shell is
`position: fixed`, which makes it a stacking context of its own, so a bar inside it can never
paint above a sibling of the shell no matter what z-index it is given.

One thing the move cost: the empty homework screen measures itself against what is above it,
and the switch is 69px it did not know about, so the sentence landed 13px inside the desk.
`--seg-h` is that number, and the screen subtracts it.

### The egg

The egg drops in, wobbles, cracks along its middle and the two halves go their separate ways —
and then, for a tenth of a second, **there is nothing on the stage at all**. That gap is the
whole trick. One hard flash of white arrives into it, with ten spokes and a ring going out
after it, and the creature comes up inside the light at `brightness(3.4)` and resolves into its
own colour as the flash fades. Without the gap the flash reads as part of the shell coming off
rather than as something happening.

The shell’s animation ends at the moment the shell actually disappears rather than running on
invisibly for another fifth of a second, so “gone before the light” is true of the timeline and
not only of what you can see — which is what lets a test check the order instead of a person
checking the screenshots. It is one flash, half a second, no bigger than the egg was, and
`prefers-reduced-motion` drops the burst entirely and simply fades the creature in.


## The Profile page

Four sections and nothing else: **Reminders**, **General**, **Appearance**, **History**. Above
them is who you are — the companion as the picture, the level, how close the next egg is, a
stats row, and a card for the companion. Below them, About.

**Three reminders**, each a switch and a time: write today’s homework down, pack the bag for
tomorrow, and finish what is still open. The third checks at the moment it fires rather than
when it is armed — a reminder to finish what you have already finished is worse than no
reminder, and whether you have finished it is only knowable now. The timer re-arms either way,
so tomorrow still gets its chance.

**Country** is not decoration. Three things follow from it and nothing else does: which days are
school days, whether the clock runs to 24 hours or to am/pm, and which locale writes the dates.
Israel’s week opens on Sunday and ends on Thursday; most of the rest open on Monday. The week is
*built* from `start` and `days` rather than listed, and the weekday names come from the browser,
which knows them in every language the app might be set to. Adding a country is a row in a list.

Language and country are not the same question. The language picks the script — Hebrew writes
its months in Hebrew wherever you are. The country picks the conventions. So a Hebrew speaker in
London gets Hebrew months in British order, and an English speaker in Israel gets a 24-hour
clock, which the app used to get wrong: it was showing 01:27 PM for a country that has never
written a time that way.

**Edit timetable** opens the week as a grid of fields — one row per period, one column per school
day, add or remove a period, or put it all back the way it came. That needed the timetable to
stop being a constant: `periods()` and `schedule()` answer from the store the moment anything
has been edited there, and `lessons()` and `subjects()` follow, so a lesson typed into the
editor becomes a subject you can file homework under without reloading. A copy is made when the
editor opens and nothing is written until Save, so backing out costs nothing.

**Appearance** is Light, Dark or System — the four desk swatches it replaced were really two
themes wearing four hats.

### Dark is not the light palette with the lights off

The old dark was slate: `#13171C` paper, `#1B2027` cards, blue-grey throughout, which is what
you get when you reach for “dark” and take the first neutral you find. This app is cream paper
on a wooden desk and the warmth is the whole of its character, so the dark is now **a desk lamp
in a dark room** rather than a screen in a void. Every ground is a brown with red still in it
(hue 28, not 220). The cards sit *above* the paper rather than below it. The ink is warm
off-white, never `#FFF`. The sage and the soft blue are lifted and desaturated, because the same
colours at daylight strength go muddy on a dark ground and at full saturation they glare.

Shadow needed rethinking rather than darkening: nothing is darker than the ground, so a card is
separated by its own faint light along the top edge instead of by a shadow underneath.

Three things do not simply follow the tokens and had to be handled:

- The **book cover** is painted with the ink colour, which flipped it into the brightest slab on
  a dark screen — and the least important thing on it. It has two colours of its own now, so it
  stays a dark object in both palettes.
- A **locked creature** is its painting with `brightness(0)` applied, which is black whatever the
  card is doing. At night it is inverted instead: the same silhouette in light rather than in
  shadow.
- The **colour behind the phone’s clock** was written down a second time, and was still naming
  the old dark ground after the palette changed. It reads `--paper` now.

**Completed homework** is a row with an arrow rather than a list halfway down the page — a
term’s work used to push the settings off the bottom of the screen. It opens as its own page,
grouped by the day each thing was finished.

**The creature book moved to Creatures**, where everything about the creatures should have been.

Four settings were taken out, because the page was asked to hold exactly the list above: which
page to open on (it opens on the homework), whether taking a note down asks first (it does not;
the toast puts it back), and the desk theme (Appearance replaced it).

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
