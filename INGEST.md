# Board ingest door

The live board at https://jakeessex.co.uk/natalie-live-board/ reads `venues.json`.
Call notes stay in a separate store and are never overwritten.

## Drop a file

Commit one JSON file into `inbox/` on this repo (`main`).
Build / Jake will merge it into `venues.json` and move the file to `processed/`.

Same JSON also works if you hand it to Build.

## Schema

```json
{
  "event": "new_lead",
  "venue": {
    "id": "the-sandbar",
    "name": "The Sandbar",
    "town": "Leigh-on-Sea",
    "email": "thesandbarleigh@hotmail.com",
    "phone": null,
    "badge": "awaiting",
    "tab": "call",
    "firstPitch": "7 Sep 2026",
    "subject": "Jake Essex for The Sandbar?"
  },
  "messages": [
    {
      "side": "us",
      "at": "2026-09-07T14:22:32Z",
      "from": "jakeessexenquiries@gmail.com",
      "subject": "Jake Essex for The Sandbar?",
      "body": "Full email body"
    }
  ]
}
```

`event` is `new_lead` or `reply_thread`.
Match order: `venue.id` → email → name.
Duplicate bodies are ignored.

## Proof already on the board

- The Sandbar (7 Sep send)
- East Barnet RBL / Tina quote (£275 / £250)
- Dartford tea address (Claire Tiltman Centre DA9 9FA)
- Buntingford bounce
