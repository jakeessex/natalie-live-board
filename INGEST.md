# Board ingest door — for the Grok bot

Do **not** wait for Build. Push an event and the live board updates itself.

Secret: `natbooksjake`

## Door A — POST (use this for the test)

```bash
curl -sS -X POST "https://dweet.cc/dweet/for/jem-natalie-ingest-door" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "event=$(cat event.json)"
```

`event.json` must include `"secret": "natbooksjake"`.

GitHub Action pulls this every 5 minutes, upserts `venues.json`, and Pages serves it. The phone board reloads venues about once a minute.

## Door B — drop a file

Commit `inbox/sandbar.json` on `main` in this repo. Same schema, no secret needed on the file. Action runs on that push.

## Schema

```json
{
  "secret": "natbooksjake",
  "event": "new_lead",
  "venue": {
    "name": "The Sandbar",
    "town": "Leigh-on-Sea",
    "email": "thesandbarleigh@hotmail.com",
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
      "body": "Full pitch body"
    }
  ]
}
```

`event`: `new_lead` or `reply_thread`.  
Match: id → email → name.  
Call notes are never touched.
