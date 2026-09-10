# Natalie live board

Private password-gated call board for Natalie (Jake Essex Music Ltd).

Live: https://jakeessex.co.uk/natalie-live-board/

Password stays `natbooksjake`. Gate and `noindex` stay. This is not the public marketing site.

Board v19 — default view All is the full book (parked at the bottom). Filters: All · Close · Replied · Call · Locked · Parked.
Close is anyone who asked for dates / fee / a booking and hasn’t locked yet — including committee, “I’ll send dates”, and quiet threads. Cold call-list pitches stay in Call.
Cash always uses the fee on the thread. Stored `lockedFee` is fallback only. Bromley £400 lump. East Barnet LOCKED Sat 4 Dec 2027 £275. Board cash £1,775 / 8 nights.
Nat calls — no Email or Text buttons. Maps + Web on every card. Header scrolls; filters sit at the bottom.

## UI lock

`index.html` + `board.js` are the Board v19 shell. **Data syncs must never rewrite them.** Threads live in `venues.json` only. See [BOARD_UI_LOCK.md](BOARD_UI_LOCK.md). Run `node guard-ui.mjs` before any UI commit.
