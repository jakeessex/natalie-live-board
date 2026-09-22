# Board UI lock

The live board is **four files**:

| File | What it is | Who may write it |
|---|---|---|
| `index.html` | Thin Board v42 shell. Gate label `Board v42`. | Humans restoring the UI only |
| `board.css` | v42 visual system | Humans restoring the UI only |
| `board.js` | v42 sales desk | Humans restoring the UI only |
| `venues.json` | Threads, fees, locks | Ingest / data syncs |

**Data syncs write `venues.json` only.** Never `index.html`. Never `board.js`. Never `board.css`.

If a Bardswell / MASTER / embed job rewrites `index.html`, GitHub Pages will ship the old fat Board v15 (~631KB) again.

## Checks

```
node guard-ui.mjs
```

Fails if:

- `index.html` does not say `Board v42`
- `index.html` is over 40KB (fat embed) or under 2KB (empty push)
- `board.js` is not `BOARD_VERSION = "v42"`

`ingest.mjs` will not write UI files. The ingest Action only `git add venues.json processed inbox`.

Live URL stays https://jakeessex.co.uk/natalie-live-board/
Password stays `natbooksjake`.
