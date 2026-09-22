# Board UI lock

The live board is **three files**:

| File | What it is | Who may write it |
|---|---|---|
| `index.html` | Thin Board v21 shell (~9–25KB). Gate label `Board v21`. | Humans restoring the UI only |
| `board.js` | v21 sales desk | Humans restoring the UI only |
| `venues.json` | Threads, fees, locks | Ingest / data syncs |

**Data syncs write `venues.json` only.** Never `index.html`. Never `board.js`.

If a Bardswell / MASTER / embed job rewrites `index.html`, GitHub Pages will ship the old fat Board v15 (~631KB) again.

## Checks

```
node guard-ui.mjs
```

Fails if:

- `index.html` does not say `Board v21`
- `index.html` is over 40KB (fat embed) or under 2KB (empty push)
- `board.js` is not `BOARD_VERSION = "v21"`

`ingest.mjs` will not write UI files. The ingest Action only `git add venues.json processed inbox`.

Live URL stays https://jakeessex.co.uk/natalie-live-board/
Password stays `natbooksjake`.
