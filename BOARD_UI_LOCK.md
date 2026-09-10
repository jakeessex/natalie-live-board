# Board UI lock

The live board is **three files**:

| File | What it is | Who may write it |
|---|---|---|
| `index.html` | Thin Board v20 shell (~9KB). Gate label `Board v20`. | Humans restoring the UI only |
| `board.js` | v20 sales pipeline | Humans restoring the UI only |
| `venues.json` | Threads, fees, locks | Ingest / data syncs |

**Data syncs write `venues.json` only.** Never `index.html`. Never `board.js`.

If a Bardswell / MASTER / embed job rewrites `index.html`, GitHub Pages will ship the old fat Board v15 (~631KB) again.

## Checks

```
node guard-ui.mjs
```

Fails if:

- `index.html` does not say `Board v20`
- `index.html` is over 40KB (fat embed) or under 2KB (empty push)
- `board.js` is not `BOARD_VERSION = "v20"`

`ingest.mjs` will not write UI files. The ingest Action only `git add venues.json processed inbox`.

## Restore

```
git checkout 20c5d2a -- index.html board.js
```

Live URL stays https://jakeessex.co.uk/natalie-live-board/
Password stays `natbooksjake`.
