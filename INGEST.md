# How the Grok bot updates Nat’s board

The board places every venue itself. The bot sends facts. It does not pick a tab, and it never edits the website.

## What to push

Only data. Never `index.html`, `board.js`, or `board.css`.

Two doors, same JSON:

1. **Inbox file (best).** Commit `inbox/some-name.json` on `main`. The Action runs on that push, folds it into `venues.json`, and moves the file to `processed/`.
2. **Dweet.** POST the same JSON, with `"secret": "natbooksjake"`, to `https://dweet.cc/dweet/for/jem-natalie-ingest-door`. The Action pulls that about every 5 minutes. The phone reloads venues about once a minute.

Do not commit `venues.json` by hand if you can use the inbox. Do not send the secret inside a git file.

## One venue, one event

Match an existing row by `id`, then email, then exact name. A second send of the same email updates that row. It does not create a twin.

Messages are added. The same `side` + `at` + first 120 characters of `body` is ignored the second time. Send the new email only. Do not resend the whole thread unless you mean to.

`event` values:

| event | What it does |
|---|---|
| `new_lead` | Creates the venue, or updates it if the email already exists |
| `reply` | Appends messages. Use this for their reply or a follow-up you sent |
| `lock` | Sets the fee, date, and nights, badge `locked`, and puts each date on the map |
| `replace_thread` | Wipes the thread and uses only the messages in this event. Rare |

Leave `tab` out. The board decides Call, Wait, Silent, Booked, or No from the thread and the badge.

## What makes it land in the right place

- **No reply yet.** One `us` message. Badge can be omitted. Lands in Silent.
- **They replied.** Append a `them` message with the real body. If a phone number is on the venue and they asked the fee or a date, it lands in Call. Otherwise Wait.
- **Not interested.** `"badge": "declined"`. Lands in No.
- **Bounced.** `"badge": "bounce"`, or a `them` body that says bounced / undeliverable. Lands in No.
- **Booked.** `event: "lock"` plus `lockedFee` (number), `lockedDate` (`YYYY-MM-DD`), `lockedNights` (number). Lands in Booked and on the dates map.
- **More than one night.** Also send `dates` as an array of `YYYY-MM-DD`. Each one is written to `gigs.json` as `source: "board"`. Choice Live rows are left alone. Without `dates`, a 4-night lock only shows the one `lockedDate`.
- **Postcode.** Send it. That is how the pin finds the house.
- **Phone.** Send digits. Call cannot be the desk without a number.

## New pitch

```json
{
  "event": "new_lead",
  "venue": {
    "name": "The Bull",
    "town": "Corringham",
    "email": "holly@thebull.example",
    "phone": "01708888888",
    "postcode": "SS17 7QT",
    "contactName": "Holly"
  },
  "messages": [
    {
      "side": "us",
      "at": "2026-09-17T10:00:00Z",
      "from": "jakeessexenquiries@gmail.com",
      "subject": "Jake Essex for The Bull?",
      "body": "Full pitch, not a summary."
    }
  ]
}
```

## Their reply

```json
{
  "event": "reply",
  "venue": { "email": "holly@thebull.example", "phone": "01708888888" },
  "messages": [
    {
      "side": "them",
      "at": "2026-09-18T09:12:00Z",
      "from": "holly@thebull.example",
      "subject": "Re: Jake Essex for The Bull?",
      "body": "What is the fee for a Saturday?"
    }
  ]
}
```

## Locked night

```json
{
  "event": "lock",
  "venue": {
    "email": "holly@thebull.example",
    "lockedFee": 250,
    "lockedDate": "2026-11-01",
    "lockedNights": 1,
    "postcode": "SS17 7QT",
    "start": "20:30",
    "dates": ["2026-11-01"]
  }
}
```

## Rules that keep it clean

- `at` is ISO, `2026-09-17T10:00:00Z`. Not “17 Sept”.
- `side` is only `us` or `them`.
- `body` is the real email. The lead screen shows it.
- Empty fields are ignored. A blank phone does not wipe the number already on file.
- One venue per file if you are dropping inbox JSON. A file may also be `{ "events": [ ... ] }`.
- Do not invent a fee. If it is not in the thread, leave `lockedFee` and `quotedFee` out.
