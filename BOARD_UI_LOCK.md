# Board UI lock

The live board is **four UI files plus data files**:

| File | What it is | Who may write it |
|---|---|---|
| `index.html` | Thin Board v43 shell. Gate label `Board v43`. | Humans restoring the UI only |
| `board.css` | v43 visual system (unchanged from v42) | Humans restoring the UI only |
| `board.js` | v43 sales desk | Humans restoring the UI only |
| `calls.js` | v43 Calls tab: swipeable call deck (full-screen cards, tap-to-call, Mark called + notes in localStorage). Behind the gate. | Humans restoring the UI only |
| `venues.json` | Threads, fees, locks | Ingest / data syncs |
| `calls.json` | Calls tab data: ranked warm call list (intro free nights + rules, one entry per venue) | Call-list refreshes only (data-only). Ingest never writes it. |

**Data syncs write `venues.json` only.** Never `index.html`. Never `board.js`. Never `board.css`. Never `calls.js`.
**Call-list refreshes write `calls.json` only** (same shape: `title`, `freeNights`, `rules`, `venues[]` with `rank`, `id`, `venue`, `town`, `contact`, `phones[]` {`number`, `tel`, `label`}, `quote`, `lastWho`, `lastDate`, `lastMsg`, `days`, `why`, `flags[]` {`type`: hold|wait|emailed|far, `text`}, `note`). No UI change needed.

v43 (28 Sep 2026): Jake asked for the Calls tab. That one deliberate UI change lifted the lock once; it is locked again.

If a Bardswell / MASTER / embed job rewrites `index.html`, GitHub Pages will ship the old fat Board v15 (~631KB) again.

## Checks

```
node guard-ui.mjs
```

Fails if:

- `index.html` does not say `Board v43`
- `index.html` is over 40KB (fat embed) or under 2KB (empty push)
- `board.js` is not `BOARD_VERSION = "v43"`
- `index.html` does not load `calls.js`, or `calls.js` is missing, or `calls.json` is missing / invalid / has no venues

`ingest.mjs` will not write UI files or `calls.json` (it refuses `index.html`, `board.js`, `board.css`, `calls.js`, `calls.json`). The ingest Action only `git add venues.json processed inbox`, so it never stages, overwrites or deletes `calls.json`.

Live URL stays https://jakeessex.co.uk/natalie-live-board/
Password stays `natbooksjake`.
