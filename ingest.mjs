#!/usr/bin/env node
import { mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname);
const VENUE_FILE = path.join(ROOT, "venues.json");
const INBOX = path.join(ROOT, "inbox");
const PROCESSED = path.join(ROOT, "processed");
const SECRET = "natbooksjake";

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

function blankVenue(event) {
  const venue = event.venue || {};
  const name = String(venue.name || venue.email || "New venue");
  const incoming = (event.messages || []).map(asMessage).filter(Boolean);
  const badge = String(venue.badge || (incoming.some((m) => m.side === "them") ? "replied-interested" : "awaiting"));
  return {
    id: slugify(String(venue.id || name)),
    name,
    town: String(venue.town || ""),
    badge,
    phone: venue.phone || null,
    needPhone: !venue.phone,
    email: String(venue.email || ""),
    replied: String(venue.replied || (incoming.some((m) => m.side === "them") ? "yes" : "no")),
    firstPitch: String(venue.firstPitch || ""),
    addedAt: String(venue.addedAt || event.at || new Date().toISOString()),
    followUps: String(venue.followUps || ""),
    subject: String(venue.subject || incoming[0]?.subject || ""),
    messages: incoming,
    hasThread: incoming.some((m) => m.side === "them"),
    tab: venue.tab || (badge === "locked" || badge === "booked" ? "booked" : "call"),
  };
}

function applyEvent(venues, event) {
  if (!event || (!event.venue && !event.messages?.length)) return { venues, action: "skip" };
  const incoming = (event.messages || []).map(asMessage).filter(Boolean);
  const idx = findIndex(venues, event);
  if (idx < 0) return { venues: [blankVenue(event), ...venues], action: "insert" };
  const current = venues[idx];
  const replaceThread = String(event.event || "") === "reply_thread" && incoming.length > 0;
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
  const next = {
    ...current,
    name: String(patch.name || current.name),
    town: patch.town ? String(patch.town) : current.town,
    email: patch.email ? String(patch.email) : current.email,
    phone: patch.phone ? String(patch.phone) : current.phone,
    needPhone: patch.phone ? false : current.needPhone,
    badge: patch.badge ? String(patch.badge) : current.badge,
    tab: patch.tab || current.tab,
    replied: patch.replied ? String(patch.replied) : current.replied,
    firstPitch: patch.firstPitch ? String(patch.firstPitch) : current.firstPitch,
    addedAt: current.addedAt || patch.addedAt || event.at || current.firstPitch,
    subject: patch.subject ? String(patch.subject) : current.subject,
    messages: merged,
    hasThread: current.hasThread || merged.some((m) => m.side === "them"),
  };
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
  let next = venues;
  for (const event of eventsFrom(payload)) {
    const result = applyEvent(next, event || {});
    next = result.venues;
    if (result.action !== "skip") applied += 1;
  }
  return { venues: next, applied };
}

async function drainInbox() {
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
    if (result.applied) dirty = true;
    await rename(from, path.join(PROCESSED, `${Date.now()}-${name}`));
    results.push({ file: name, ok: true, applied: result.applied });
  }
  if (dirty) await writeFile(VENUE_FILE, `${JSON.stringify(venues, null, 2)}\n`);
  return { results, venues: venues.length, dirty };
}

async function drainDweet() {
  const url = `https://dweet.cc/get/latest/dweet/for/jem-natalie-ingest-door?t=${Date.now()}`;
  const res = await fetch(url);
  if (!res.ok) return { pulled: false };
  const data = await res.json();
  const content = data?.with?.[0]?.content || {};
  const raw = content.event || content.payload || content.notes;
  if (!raw) return { pulled: false };
  let payload;
  try {
    payload = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return { pulled: false, error: "bad dweet json" };
  }
  if (payload.secret && payload.secret !== SECRET) return { pulled: false, error: "bad secret" };
  const venues = JSON.parse(await readFile(VENUE_FILE, "utf8"));
  const result = await applyPayload(venues, payload);
  if (result.applied) {
    await writeFile(VENUE_FILE, `${JSON.stringify(result.venues, null, 2)}\n`);
    await mkdir(PROCESSED, { recursive: true });
    await writeFile(path.join(PROCESSED, `${Date.now()}-dweet.json`), JSON.stringify(payload, null, 2));
  }
  return { pulled: true, applied: result.applied, venues: result.venues.length };
}

const mode = process.argv[2] || "inbox";
if (mode === "dweet") {
  console.log(JSON.stringify(await drainDweet(), null, 2));
} else {
  console.log(JSON.stringify(await drainInbox(), null, 2));
}
