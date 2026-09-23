#!/usr/bin/env node
import { mkdir, readdir, readFile, rename, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname);
const VENUE_FILE = path.join(ROOT, "venues.json");
const INBOX = path.join(ROOT, "inbox");
const PROCESSED = path.join(ROOT, "processed");
const SECRET = "natbooksjake";

/** Data-only lock. Ingest must never write the board shell. */
const UI_FILES = new Set(["index.html", "board.js"]);

function assertDataPath(file) {
  const base = path.basename(file);
  if (UI_FILES.has(base)) {
    throw new Error(`UI LOCK: ingest must never write ${base}. Data = venues.json only. See BOARD_UI_LOCK.md`);
  }
}

async function writeData(file, contents) {
  assertDataPath(file);
  await writeFile(file, contents);
}

async function warnIfUiBroken() {
  try {
    const index = path.join(ROOT, "index.html");
    const js = path.join(ROOT, "board.js");
    const html = await readFile(index, "utf8");
    const size = (await stat(index)).size;
    const board = await readFile(js, "utf8");
    const problems = [];
    if (!html.includes("Board v42")) problems.push("index.html missing 'Board v42'");
    if (size > 40000) problems.push(`index.html is fat embed (${size} bytes) — should be ~9KB`);
    if (html.includes("venues-data") && html.length > 20000) problems.push("index.html looks like a v15 venues embed");
    if (!board.includes('BOARD_VERSION = "v42"')) problems.push("board.js is not v42");
    if (problems.length) {
      console.error("UI LOCK WARNING (venues will still write):\n - " + problems.join("\n - "));
    }
  } catch (err) {
    console.error("UI LOCK WARNING: could not read board shell", err.message);
  }
}

function slugify(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function msgKey(message) {
  return [message.side, message.at || "", (message.body || "").slice(0, 120)].join("|");
}

function asMessage(raw) {
  const body = String(raw.body || "").trim();
  const subject = String(raw.subject || "");
  const label = String(raw.label || "");
  const blob = `${label} ${subject} ${body}`.toLowerCase();
  if (raw.side === "note") return null;
  if (blob.includes("gate:send") || blob.includes("trail")) return null;
  if (!body && !subject) return null;
  const side = raw.side === "them" ? "them" : "us";
  return {
    side,
    label: String(raw.label || (side === "them" ? "Their reply" : "Sent")),
    at: String(raw.at || ""),
    from: String(raw.from || ""),
    subject,
    body,
  };
}

function findIndex(venues, event) {
  const venue = event.venue || {};
  const id = venue.id ? slugify(venue.id) : "";
  const email = String(venue.email || "").trim().toLowerCase();
  const nameId = venue.name ? slugify(venue.name) : "";
  return venues.findIndex((row) => {
    if (id && row.id === id) return true;
    if (nameId && row.id === nameId) return true;
    if (email && String(row.email || "").trim().toLowerCase() === email) return true;
    if (venue.name && String(row.name || "").toLowerCase() === String(venue.name).toLowerCase()) return true;
    return false;
  });
}

function looksBounce(messages) {
  const blob = messages.filter((m) => m.side === "them").map((m) => `${m.subject} ${m.body}`).join("\n").toLowerCase();
  return /bounce|undeliverable|address not found|delivery status notification/.test(blob);
}

function deriveBadge(explicit, messages, lock) {
  if (explicit) return String(explicit);
  if (lock) return "locked";
  if (looksBounce(messages)) return "bounce";
  if (messages.some((m) => m.side === "them")) return "replied-interested";
  return "awaiting";
}

function numOr(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function isoDay(value) {
  const day = String(value || "").slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : "";
}

function blankVenue(event) {
  const venue = event.venue || {};
  const name = String(venue.name || venue.email || "New venue");
  const incoming = (event.messages || []).map(asMessage).filter(Boolean);
  const lock = event.event === "lock" || venue.badge === "locked" || venue.badge === "booked";
  const badge = deriveBadge(venue.badge, incoming, lock);
  return {
    id: slugify(String(venue.id || name)),
    name,
    town: String(venue.town || ""),
    postcode: String(venue.postcode || ""),
    website: String(venue.website || ""),
    contactName: String(venue.contactName || ""),
    badge,
    phone: venue.phone || null,
    needPhone: !venue.phone,
    email: String(venue.email || ""),
    replied: incoming.some((m) => m.side === "them") ? "yes" : "no",
    firstPitch: String(venue.firstPitch || ""),
    addedAt: String(venue.addedAt || event.at || new Date().toISOString()),
    followUps: String(venue.followUps || ""),
    subject: String(venue.subject || incoming[0]?.subject || ""),
    messages: incoming,
    hasThread: incoming.some((m) => m.side === "them"),
    quotedFee: numOr(venue.quotedFee, undefined),
    pendingLockFee: numOr(venue.pendingLockFee, undefined),
    pendingNote: venue.pendingNote ? String(venue.pendingNote) : undefined,
    lockedFee: lock ? numOr(venue.lockedFee || venue.fee, undefined) : undefined,
    lockedDate: lock ? isoDay(venue.lockedDate) || undefined : undefined,
    lockedNights: lock ? numOr(venue.lockedNights || (venue.dates || []).length, 1) : undefined,
    lockedNote: venue.lockedNote ? String(venue.lockedNote) : undefined,
  };
}

function cleanStatus(raw) {
  const s = String(raw || "").toUpperCase().replace(/[\s-]+/g, "_");
  if (s === "NEW_EMAIL" || s === "EMAIL") return "NEW_EMAIL";
  if (s === "NEED_PUBLIC" || s === "NEED_PHONE" || s === "PHONE") return "NEED_PUBLIC";
  if (s === "AGENCY_LATER" || s === "FAR" || s === "AGENCY" || s === "N") return "AGENCY_LATER";
  return "";
}

function hasUs(venue) {
  return (venue?.messages || []).some((m) => m && m.side === "us");
}

function isOpenProspectRow(venue) {
  return (venue?.prospect === true || String(venue?.badge || "").toLowerCase() === "prospect" || venue?.prospectStatus) && !hasUs(venue);
}

function emailsOf(venue) {
  const out = new Set();
  const add = (value) => {
    const key = String(value || "").trim().toLowerCase();
    if (key.includes("@")) out.add(key);
  };
  add(venue?.email);
  for (const message of venue?.messages || []) add(message?.from);
  return out;
}

function sameHouse(a, b) {
  const left = slugify(a);
  const right = slugify(b);
  if (!left || !right) return false;
  if (left === right) return true;
  if (left.length >= 12 && right.length >= 12 && (left.includes(right) || right.includes(left))) return true;
  return false;
}

function contactedTwin(venues, venue) {
  const email = String(venue.email || "").trim().toLowerCase();
  const id = slugify(venue.id || venue.name);
  for (const row of venues) {
    if (isOpenProspectRow(row)) continue;
    if (email && emailsOf(row).has(email)) return row;
    if (id && (row.id === id || slugify(row.name) === id)) return row;
    if (venue.name && sameHouse(venue.name, row.name)) return row;
  }
  return null;
}

function prospectIndex(venues, venue) {
  const email = String(venue.email || "").trim().toLowerCase();
  const id = slugify(venue.id || venue.name);
  return venues.findIndex((row) => {
    if (!isOpenProspectRow(row)) return false;
    if (id && row.id === id) return true;
    if (email && String(row.email || "").trim().toLowerCase() === email) return true;
    if (venue.name && slugify(row.name) === slugify(venue.name)) return true;
    return false;
  });
}

function prospectRecord(event, current) {
  const venue = event.venue || {};
  const name = String(venue.name || current?.name || "");
  const status = cleanStatus(venue.prospectStatus) || cleanStatus(current?.prospectStatus) || (venue.email || current?.email ? "NEW_EMAIL" : "NEED_PUBLIC");
  const lat = Number(venue.lat);
  const lng = Number(venue.lng);
  return {
    ...(current || {}),
    id: current?.id || slugify(venue.id || name),
    name,
    town: venue.town ? String(venue.town) : current?.town || "",
    postcode: venue.postcode ? String(venue.postcode) : current?.postcode || "",
    region: venue.region ? String(venue.region) : current?.region || "",
    venueType: venue.venueType || venue.type ? String(venue.venueType || venue.type) : current?.venueType || "",
    email: venue.email ? String(venue.email) : current?.email || "",
    phone: venue.phone ? String(venue.phone) : current?.phone || null,
    website: venue.website ? String(venue.website) : current?.website || "",
    contactName: venue.contactName ? String(venue.contactName) : current?.contactName || "",
    lat: Number.isFinite(lat) ? lat : current?.lat,
    lng: Number.isFinite(lng) ? lng : current?.lng,
    badge: "prospect",
    prospect: true,
    prospectStatus: status,
    replied: "no",
    messages: current?.messages || [],
    hasThread: false,
    addedAt: current?.addedAt || event.at || new Date().toISOString(),
    lockedNote: venue.note ? String(venue.note) : current?.lockedNote,
  };
}

function placeProspect(venues, event) {
  const venue = event.venue || {};
  if (!venue.name && !venue.email) return { venues, action: "skip", reason: "no name" };
  const twin = contactedTwin(venues, venue);
  if (twin) return { venues, action: "skip", reason: "contacted", matched: twin.id };
  const idx = prospectIndex(venues, venue);
  const next = prospectRecord(event, idx >= 0 ? venues[idx] : null);
  const copy = venues.slice();
  if (idx >= 0) copy[idx] = next;
  else copy.unshift(next);
  return { venues: copy, action: idx >= 0 ? "update" : "insert" };
}

function applyEvent(venues, event) {
  if (String(event?.event || "") === "prospect") return placeProspect(venues, event);
  if (!event || (!event.venue && !event.messages?.length)) return { venues, action: "skip" };
  const incoming = (event.messages || []).map(asMessage).filter(Boolean);
  const idx = findIndex(venues, event);
  if (idx < 0) return { venues: [blankVenue(event), ...venues], action: "insert" };
  const current = venues[idx];
  const replaceThread = String(event.event || "") === "replace_thread" && incoming.length > 0;
  let merged;
  if (replaceThread) {
    merged = incoming.slice();
  } else {
    merged = (current.messages || []).filter((m) => m.side === "us" || m.side === "them");
    const seen = new Set(merged.map(msgKey));
    for (const message of incoming) {
      if (!seen.has(msgKey(message))) {
        merged.push(message);
        seen.add(msgKey(message));
      }
    }
  }
  merged.sort((a, b) => String(a.at).localeCompare(String(b.at)));
  const patch = event.venue || {};
  const locking = event.event === "lock" || patch.badge === "locked" || patch.badge === "booked";
  const nextBadge = patch.badge
    ? String(patch.badge)
    : looksBounce(incoming) && current.badge !== "locked"
      ? "bounce"
      : locking
        ? "locked"
        : current.badge;
  const next = {
    ...current,
    name: String(patch.name || current.name),
    town: patch.town ? String(patch.town) : current.town,
    postcode: patch.postcode ? String(patch.postcode) : current.postcode,
    website: patch.website ? String(patch.website) : current.website,
    contactName: patch.contactName ? String(patch.contactName) : current.contactName,
    email: patch.email ? String(patch.email) : current.email,
    phone: patch.phone ? String(patch.phone) : current.phone,
    needPhone: patch.phone ? false : current.needPhone,
    badge: nextBadge,
    replied: merged.some((m) => m.side === "them") ? "yes" : current.replied || "no",
    firstPitch: patch.firstPitch ? String(patch.firstPitch) : current.firstPitch,
    addedAt: current.addedAt || patch.addedAt || event.at || current.firstPitch,
    followUps: patch.followUps ? String(patch.followUps) : current.followUps,
    subject: patch.subject ? String(patch.subject) : current.subject,
    quotedFee: numOr(patch.quotedFee, current.quotedFee),
    pendingLockFee: numOr(patch.pendingLockFee, current.pendingLockFee),
    pendingNote: patch.pendingNote ? String(patch.pendingNote) : current.pendingNote,
    lockedFee: locking ? numOr(patch.lockedFee || patch.fee, current.lockedFee) : current.lockedFee,
    lockedDate: locking ? isoDay(patch.lockedDate) || current.lockedDate : current.lockedDate,
    lockedNights: locking ? numOr(patch.lockedNights || (patch.dates || []).length, current.lockedNights || 1) : current.lockedNights,
    lockedNote: patch.lockedNote ? String(patch.lockedNote) : current.lockedNote,
    messages: merged,
    hasThread: merged.some((m) => m.side === "them"),
    prospect: merged.some((m) => m.side === "us") ? false : current.prospect,
    prospectStatus: merged.some((m) => m.side === "us") ? undefined : current.prospectStatus,
  };
  if (merged.some((m) => m.side === "us") && (current.prospect || current.badge === "prospect")) {
    next.badge = next.badge === "prospect" ? (merged.some((m) => m.side === "them") ? "replied-interested" : "awaiting") : next.badge;
  }
  const copy = venues.slice();
  copy[idx] = next;
  return { venues: copy, action: "update" };
}

function eventsFrom(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.events)) return payload.events;
  return payload ? [payload] : [];
}

async function applyPayload(venues, payload) {
  let applied = 0;
  const skipped = [];
  let next = venues;
  for (const event of eventsFrom(payload)) {
    const result = applyEvent(next, event || {});
    next = result.venues;
    if (result.action !== "skip") applied += 1;
    else if (result.reason) skipped.push({ reason: result.reason, matched: result.matched || "", name: event?.venue?.name || "" });
  }
  return { venues: next, applied, skipped };
}

const GIGS_FILE = path.join(ROOT, "gigs.json");

async function upsertBoardDates(events) {
  let file;
  try {
    file = JSON.parse(await readFile(GIGS_FILE, "utf8"));
  } catch {
    return 0;
  }
  const gigs = Array.isArray(file.gigs) ? file.gigs : [];
  let added = 0;
  for (const event of events) {
    const venue = event?.venue || {};
    const dates = Array.isArray(venue.dates) ? venue.dates : [];
    if (!dates.length || !venue.name) continue;
    for (const raw of dates) {
      const date = isoDay(raw);
      if (!date) continue;
      const row = {
        date,
        venue: String(venue.name),
        town: String(venue.town || ""),
        postcode: String(venue.postcode || ""),
        start: String(venue.start || ""),
        finish: String(venue.finish || ""),
        status: "booked",
        source: "board",
      };
      const idx = gigs.findIndex((g) => g && g.date === date && String(g.source || "") === "board" && slugify(g.venue) === slugify(venue.name));
      if (idx >= 0) gigs[idx] = { ...gigs[idx], ...row };
      else gigs.push(row);
      added += 1;
    }
  }
  if (!added) return 0;
  gigs.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  await writeData(GIGS_FILE, `${JSON.stringify({ ...file, gigs }, null, 2)}\n`);
  return added;
}

async function drainInbox() {
  await warnIfUiBroken();
  await mkdir(INBOX, { recursive: true });
  await mkdir(PROCESSED, { recursive: true });
  const names = (await readdir(INBOX)).filter((name) => name.endsWith(".json") && name !== ".keep.json");
  let venues = JSON.parse(await readFile(VENUE_FILE, "utf8"));
  const results = [];
  let dirty = false;
  for (const name of names) {
    const from = path.join(INBOX, name);
    let payload;
    try {
      payload = JSON.parse(await readFile(from, "utf8"));
    } catch {
      results.push({ file: name, ok: false, error: "invalid json" });
      continue;
    }
    const result = await applyPayload(venues, payload);
    venues = result.venues;
    if (result.applied) {
      dirty = true;
      await upsertBoardDates(eventsFrom(payload));
    }
    await rename(from, path.join(PROCESSED, `${Date.now()}-${name}`));
    results.push({ file: name, ok: true, applied: result.applied, skipped: result.skipped || [] });
  }
  if (dirty) await writeData(VENUE_FILE, `${JSON.stringify(venues, null, 2)}\n`);
  return { results, venues: venues.length, dirty };
}

async function drainDweet() {
  await warnIfUiBroken();
  // Pull up to ~50 recent dweets so a batch of sends does not collapse to one event.
  const url = `https://dweet.cc/get/dweets/for/jem-natalie-ingest-door?t=${Date.now()}`;
  const res = await fetch(url);
  if (!res.ok) return { pulled: false };
  const data = await res.json();
  const rows = Array.isArray(data?.with) ? data.with.slice().reverse() : [];
  if (!rows.length) return { pulled: false };
  let venues = JSON.parse(await readFile(VENUE_FILE, "utf8"));
  let applied = 0;
  const seen = new Set();
  for (const row of rows) {
    const content = row?.content || {};
    const raw = content.event || content.payload || content.notes;
    if (!raw) continue;
    let payload;
    try {
      payload = typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch {
      continue;
    }
    if (payload.secret && payload.secret !== SECRET) continue;
    const key = JSON.stringify({
      e: payload.event,
      email: payload.venue?.email,
      at: payload.messages?.[0]?.at,
      body: (payload.messages?.[0]?.body || "").slice(0, 80),
    });
    if (seen.has(key)) continue;
    seen.add(key);
    const result = await applyPayload(venues, payload);
    venues = result.venues;
    if (result.applied) {
      applied += result.applied;
      await upsertBoardDates(eventsFrom(payload));
      await mkdir(PROCESSED, { recursive: true });
      await writeData(path.join(PROCESSED, `${Date.now()}-dweet.json`), JSON.stringify(payload, null, 2));
    }
  }
  if (applied) {
    await writeData(VENUE_FILE, `${JSON.stringify(venues, null, 2)}\n`);
  }
  return { pulled: true, applied, venues: venues.length, scanned: rows.length };
}

const mode = process.argv[2] || "inbox";
if (mode === "dweet") {
  console.log(JSON.stringify(await drainDweet(), null, 2));
} else {
  console.log(JSON.stringify(await drainInbox(), null, 2));
}
