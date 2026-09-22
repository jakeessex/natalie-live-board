"use strict";
var Board = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/lib/board/pipeline.ts
  var pipeline_exports = {};
  __export(pipeline_exports, {
    BOARD_FILTERS: () => BOARD_FILTERS,
    BOARD_STAMP: () => BOARD_STAMP,
    BOARD_VERSION: () => BOARD_VERSION,
    CASH_TARGET: () => CASH_TARGET,
    DESK_CHIP: () => DESK_CHIP,
    FOLLOW_CHIP: () => FOLLOW_CHIP,
    PASSWORD: () => PASSWORD,
    UNCLASSIFIED_WITHOUT_GUESSING: () => UNCLASSIFIED_WITHOUT_GUESSING,
    assignDesk: () => assignDesk,
    cashTarget: () => cashTarget,
    chaseAlarm: () => chaseAlarm,
    classifyVenue: () => classifyVenue,
    cleanThread: () => cleanThread,
    daysBetween: () => daysBetween,
    deskBanner: () => deskBanner,
    deskGroupKey: () => deskGroupKey,
    deskGroupLabel: () => deskGroupLabel,
    displayFee: () => displayFee,
    extractEmails: () => extractEmails,
    extractQuotedFee: () => extractQuotedFee,
    extractThreadFee: () => extractThreadFee,
    extractWebsite: () => extractWebsite,
    extractWho: () => extractWho,
    feeMismatch: () => feeMismatch,
    feeOnThread: () => feeOnThread,
    filterCounts: () => filterCounts,
    fmtDay: () => fmtDay,
    fmtWhen: () => fmtWhen,
    followCount: () => followCount,
    gbp: () => gbp,
    hasPhone: () => hasPhone,
    heatScore: () => heatScore,
    isAutoNoise: () => isAutoNoise,
    isLatestVenue: () => isLatestVenue,
    isLockedRecord: () => isLockedRecord,
    isRepliedRow: () => isRepliedRow,
    isStockUsCopy: () => isStockUsCopy,
    lastCalledLabel: () => lastCalledLabel,
    lastOf: () => lastOf,
    lastTouchLabel: () => lastTouchLabel,
    lockedCash: () => lockedCash,
    mailtoHref: () => mailtoHref,
    mapsHref: () => mapsHref,
    matchesQuery: () => matchesQuery,
    parseWhen: () => parseWhen,
    pepLine: () => pepLine,
    prettyPhone: () => prettyPhone,
    primaryEmail: () => primaryEmail,
    rankAll: () => rankAll,
    rankVenue: () => rankVenue,
    realInbound: () => realInbound,
    replyAction: () => replyAction,
    rowsForFilter: () => rowsForFilter,
    smsHref: () => smsHref,
    sortAll: () => sortAll,
    sortClosed: () => sortClosed,
    sortDesk: () => sortDesk,
    sortDeskAll: () => sortDeskAll,
    sortOpen: () => sortOpen,
    sortReplied: () => sortReplied,
    sortTab: () => sortTab,
    sortWorking: () => sortWorking,
    tabCounts: () => tabCounts,
    telHref: () => telHref,
    webHref: () => webHref
  });
  var BOARD_VERSION = "v21";
  var BOARD_STAMP = "22 Sep 2026";
  var PASSWORD = "natbooksjake";
  var CASH_TARGET = 1e4;
  var MONTH_IDX = {
    jan: 0,
    january: 0,
    feb: 1,
    february: 1,
    mar: 2,
    march: 2,
    apr: 3,
    april: 3,
    may: 4,
    jun: 5,
    june: 5,
    jul: 6,
    july: 6,
    aug: 7,
    august: 7,
    sep: 8,
    sept: 8,
    september: 8,
    oct: 9,
    october: 9,
    nov: 10,
    november: 10,
    dec: 11,
    december: 11
  };
  var BOARD_FILTERS = [
    { id: "call", label: "Call" },
    { id: "wait", label: "Wait" },
    { id: "silent", label: "No reply" },
    { id: "booked", label: "Booked" },
    { id: "no", label: "No" }
  ];
  var DESK_CHIP = {
    call: "CALL",
    wait: "WAITING",
    silent: "NO REPLY",
    booked: "BOOKED",
    no: "NO"
  };
  var FOLLOW_CHIP = {
    due: "FOLLOW UP DUE",
    done: "FOLLOWED UP",
    fresh: "TOO SOON",
    none: ""
  };
  var DAY = 864e5;
  var STOCK_US = [
    "lock it in",
    "lock that date",
    "reply here",
    "pa included",
    "no deposit",
    "2 \xD7 45",
    "3 \xD7 45",
    "2 x 45",
    "3 x 45",
    "www.jakeessex.co.uk",
    "instagram.com/jakeessexmusic"
  ];
  var NAME_BLOCK = new Set(
    [
      "info",
      "club",
      "secretary",
      "admin",
      "hello",
      "bookings",
      "the",
      "contact",
      "team",
      "office",
      "enquiries",
      "events",
      "best",
      "kind",
      "thanks",
      "thank",
      "thankyou",
      "regards",
      "sent",
      "chair",
      "chairman",
      "manager",
      "branch",
      "legion",
      "social",
      "booking",
      "entertainment",
      "committee",
      "member",
      "bar",
      "staff",
      "urgent",
      "enquiries",
      "many",
      "good",
      "morning",
      "evening",
      "natalie",
      "jake"
    ].map((s) => s.toLowerCase())
  );
  var AUTO_RE = /undeliver|mailer-daemon|delivery failed|mailbox unavailable|address rejected|address not found|out of office|automatic reply|auto[- ]?reply|office is now closed|i am (currently )?out of (the )?office/i;
  var HARD_NO_RE = /not interested|no thank you|no thanks\b|too expensive|price too high|we('ll| will) pass|not for us|don'?t pay (bands|artists?|out)|do not pay|no short-term requirements|keep (your )?details on file|keep it on(?:ly)? file|white suit|tribute only|impersonator only/i;
  var FULLY_BOOKED_RE = /fully booked|already booked for 2026 and 2027|bookings for the year for 2027|no dates (left|available)/i;
  var ALTERNATIVE_RE = /\b(but|however|could|squeeze|sunday|cancellation|2027|looking at|hear from me|keep him in mind)\b/i;
  var CLOSE_YES_RE = /\b(book him|put him in|that works|we('ll| will) book|you('re| are) booked|lock (it|that|the) (in|date))\b/i;
  var WAITING_RE = /\b(committee|put (it|this|your email) forward|i('m| am) away|on my return|when i.?m back|next (two|2) months|concentrating on|come to (the )?restaurant|pop in|i('ll| will) (check|get back|send|give you)|will check the diary|give you some dates|discuss with|next meeting|be in touch|meeting on (mon|tues|wednes|thurs|fri)day)\b/i;
  var DATE_ASK_RE = /\b(\d{1,2}[\/\-]\d{1,2}([\/\-]\d{2,4})?|\d{1,2}(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*|remembrance|\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b.{0,24}\d{4})\b/i;
  var FEE_ASK_RE = /\b(how much|what (would|do) you charge|what(?:'s| is) the (fee|cost|rate)|charges?|fees?|rates?|costing|quote|price|what would the fee)\b/i;
  var POSTER_RE = /\b(poster|flyers?|artwork)\b/i;
  var DATE_TALK_RE = /\b(interested in booking|discuss possible dates|send me (through )?(some )?(saturdays|dates)|a date in 20\d\d|open to getting jake booked|give you some dates|dates that you have available|possible dates)\b/i;
  var AGREE_FEE_RE = /(?:for|do|it['’]s|it is|that['’]s|that is|at)\s*£\s*(\d{2,4})|£\s*(\d{2,4})\s*(?:cash|confirmed|locked)/i;
  var WORKING_TABS = ["close", "live", "chase", "call", "locked"];
  var OPEN_TABS = ["close", "live", "chase", "call"];
  function parseWhen(raw) {
    if (!raw) return null;
    const n = Date.parse(raw);
    if (!Number.isNaN(n)) return new Date(n);
    const m = String(raw).match(
      /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/i
    );
    if (!m) return null;
    const months = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11
    };
    return new Date(+m[3], months[m[2].slice(0, 3).toLowerCase()] ?? 0, +m[1]);
  }
  function daysBetween(from, now = /* @__PURE__ */ new Date()) {
    if (!from) return null;
    return Math.floor((now.getTime() - from.getTime()) / DAY);
  }
  function cleanThread(venue) {
    return (venue.messages || []).filter((m) => {
      if (!m || m.side !== "us" && m.side !== "them") return false;
      const blob = `${m.label || ""} ${m.body || ""}`.toLowerCase();
      if (blob.includes("gate:send")) return false;
      if (blob.includes("trail") && blob.length < 40) return false;
      return true;
    });
  }
  function isAutoNoise(message) {
    const blob = `${message.body || ""} ${message.from || ""} ${message.subject || ""} ${message.label || ""}`;
    return AUTO_RE.test(blob);
  }
  function realInbound(venue) {
    return cleanThread(venue).filter((m) => m.side === "them" && !isAutoNoise(m));
  }
  function lastOf(messages, side) {
    const list = side ? messages.filter((m) => m.side === side) : messages;
    return list.length ? list[list.length - 1] : null;
  }
  function hasPhone(venue) {
    const digits = String(venue.phone || "").replace(/\D/g, "");
    return digits.length >= 10;
  }
  function isLockedRecord(venue) {
    const badge = String(venue.badge || "").toLowerCase();
    const fee = Number(venue.lockedFee || 0);
    return (badge === "locked" || badge === "booked") && fee > 0;
  }
  function parkedBadge(venue) {
    const badge = String(venue.badge || "").toLowerCase();
    return badge === "bounce" || badge === "declined" || badge === "retract-agency" || badge === "skip-do-not-email" || badge === "closed" || badge === "fully-booked-on-file";
  }
  function extractEmails(raw) {
    if (!raw) return [];
    const found = raw.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
    return [...new Set(found.map((e) => e.toLowerCase()))];
  }
  function primaryEmail(venue) {
    return extractEmails(venue.email)[0] || null;
  }
  function plausibleName(token) {
    const t = token.replace(/[^A-Za-z'-]/g, "");
    if (t.length < 3 || t.length > 14) return false;
    if (NAME_BLOCK.has(t.toLowerCase())) return false;
    if (!/^[A-Z][a-z]+(?:['-][A-Z]?[a-z]+)?$/.test(t) && !/^[A-Z][a-z]+$/.test(t)) {
      if (!/^[A-Za-z][a-z]+$/.test(t)) return false;
    }
    return true;
  }
  function titleName(token) {
    return token.charAt(0).toUpperCase() + token.slice(1);
  }
  function extractWho(venue, note) {
    if (note?.contactName && plausibleName(note.contactName.split(" ")[0] || "")) {
      return note.contactName.split(" ")[0];
    }
    if (venue.contactName && plausibleName(venue.contactName.split(" ")[0] || "")) {
      return venue.contactName.split(" ")[0];
    }
    const email = venue.email || "";
    const named = email.match(/^([A-Za-z][A-Za-z'-]+)\s+[A-Za-z][^<]*</);
    if (named && plausibleName(named[1])) return titleName(named[1]);
    const first = email.match(/^([A-Za-z][A-Za-z'-]+)\s*</);
    if (first && plausibleName(first[1])) return titleName(first[1]);
    const inbound = realInbound(venue);
    for (let i = inbound.length - 1; i >= 0; i--) {
      const body = inbound[i].body || "";
      const lines = body.split(/\n/).map((l) => l.trim()).filter(Boolean);
      for (const line of [...lines].reverse().slice(0, 10)) {
        if (/^(thanks|thank you|cheers|regards|kind regards|many thanks|sent from|best regards)\b/i.test(line)) {
          continue;
        }
        if (/^(hi|hello|good morning|good evening)\b/i.test(line)) continue;
        if (/\b(road|street|lane|hall|club|legion|avenue|close|drive|whitton|secretary|branch)\b/i.test(line)) continue;
        if (venue.name) {
          const bits = venue.name.toLowerCase().split(/[^a-z]+/).filter(Boolean);
          if (bits.includes(line.toLowerCase())) continue;
        }
        if (venue.town && venue.town.toLowerCase() === line.toLowerCase()) continue;
        if (venue.name && line.toLowerCase().includes(venue.name.split(/\s+/)[0].toLowerCase()) && line.split(/\s+/).length > 2) continue;
        const one = line.match(/^([A-Z][a-z]{2,13})$/);
        if (one && plausibleName(one[1])) return one[1];
        const two = line.match(/^([A-Z][a-z]{2,13})\s+[A-Z][a-z]+/);
        if (two && plausibleName(two[1])) return two[1];
      }
    }
    const replied = String(venue.replied || "");
    const paren = replied.match(/\(([^)]+)\)/);
    if (paren) {
      const token = paren[1].split(/[\s,]/)[0];
      if (token && plausibleName(token)) return titleName(token);
    }
    const dash = replied.match(/website\s+([A-Za-z]{3,13})/i);
    if (dash && plausibleName(dash[1])) return titleName(dash[1]);
    const tina = replied.match(/\b(Tina|Dee|Karen|Val|Valerie|Steve|Maxine|Siobhan|Christine|Alison|Ahmet|Jaela|John|Barbara|Sandra|Mick|Brian|Caron|Dayn|Keith|Rick|Eija)\b/i);
    if (tina) return titleName(tina[1]);
    return null;
  }
  function extractWebsite(venue) {
    if (venue.website && /^https?:\/\//i.test(venue.website)) return venue.website;
    const blob = `${venue.email || ""}
${(venue.messages || []).filter((m) => m.side === "them").map((m) => m.body || "").join("\n")}`;
    const urls = blob.match(/https?:\/\/[^\s<>")']+/gi) || [];
    for (const url of urls) {
      const clean = url.replace(/[.,;]+$/, "");
      if (/jakeessex\.co\.uk|instagram\.com\/jakeessex/i.test(clean)) continue;
      return clean;
    }
    return null;
  }
  function poundsIn(text) {
    const out = [];
    const re = /(?:£\s*|GBP\s*|@\s*)(\d{2,4})(?:\.00)?/gi;
    let m;
    while (m = re.exec(text)) {
      const n = Number(m[1]);
      if (n >= 50 && n <= 2e3) out.push(n);
    }
    return out;
  }
  function extractQuotedFee(venue) {
    if (typeof venue.quotedFee === "number" && venue.quotedFee > 0) return venue.quotedFee;
    const us = cleanThread(venue).filter((m) => m.side === "us");
    for (let i = us.length - 1; i >= 0; i--) {
      const found = poundsIn(us[i].body || "");
      if (found.length) return found[0];
    }
    return null;
  }
  function extractThreadFee(venue) {
    return feeOnThread(venue);
  }
  function inboundLooksHardNo(venue) {
    const inbound = realInbound(venue);
    if (!inbound.length) return false;
    const last = inbound[inbound.length - 1];
    const body = last.body || "";
    if (HARD_NO_RE.test(body)) return true;
    if (FULLY_BOOKED_RE.test(body) && !ALTERNATIVE_RE.test(body)) return true;
    return false;
  }
  function lastInboundOffersClose(message) {
    const body = message.body || "";
    if (CLOSE_YES_RE.test(body)) return true;
    if (askedFee(message)) return true;
    if (POSTER_RE.test(body)) return true;
    if (DATE_ASK_RE.test(body)) return true;
    if (WAITING_RE.test(body)) return true;
    if (DATE_TALK_RE.test(body)) return true;
    return false;
  }
  function askedFee(message) {
    return FEE_ASK_RE.test(message.body || "");
  }
  function noteIsBooked(note, now) {
    if (!note || note.outcome !== "booked") return false;
    const at = parseWhen(note.updatedAt || note.calledAt || null);
    const days = daysBetween(at, now);
    return days != null && days <= 21;
  }
  function isDropped(note) {
    if (!note) return false;
    if (note.dropped) return true;
    if (note.outcome === "dead") return true;
    return false;
  }
  function classifyVenue({ venue, note, now = /* @__PURE__ */ new Date() }) {
    const thread = cleanThread(venue);
    const inbound = realInbound(venue);
    const last = lastOf(thread);
    const lastIn = inbound[inbound.length - 1] || null;
    const lastSide = last?.side || null;
    const lastInAt = parseWhen(lastIn?.at);
    const daysSinceInbound = daysBetween(lastInAt, now);
    const lastAt = parseWhen(last?.at);
    const daysSilent = lastSide === "us" ? daysSinceInbound : daysBetween(lastAt, now);
    const stale = daysSinceInbound != null && daysSinceInbound >= 14;
    if (isLockedRecord(venue)) {
      return { tab: "locked", reason: "locked fee on file", stale: false, daysSinceInbound, daysSilent, lastSide };
    }
    if (isDropped(note) || parkedBadge(venue) || inboundLooksHardNo(venue)) {
      let reason = "parked";
      if (isDropped(note)) reason = "dropped";
      else if (String(venue.badge) === "bounce") reason = "bounce";
      else if (inboundLooksHardNo(venue)) reason = "hard no";
      else reason = String(venue.badge || "parked");
      return { tab: "parked", reason, stale: false, daysSinceInbound, daysSilent, lastSide };
    }
    const who = extractWho(venue, note);
    let closeReason = null;
    const canClose = hasPhone(venue) || Number(venue.pendingLockFee || 0) > 0;
    if (Number(venue.pendingLockFee || 0) > 0 && !inboundLooksHardNo(venue)) {
      closeReason = "fee agreed \u2014 lock a date on this call";
    }
    if (noteIsBooked(note, now) && !isLockedRecord(venue)) {
      closeReason = closeReason || "nat marked booked \u2014 not in the pot yet";
    }
    if (lastIn && !inboundLooksHardNo(venue) && canClose) {
      if (lastInboundOffersClose(lastIn) && (askedFee(lastIn) ? !!who : true)) {
        closeReason = closeReason || (askedFee(lastIn) ? "asked the fee \u2014 close it on the phone" : "asked for dates \u2014 close it on the phone");
      }
    }
    if (closeReason) {
      return { tab: "close", reason: closeReason, stale, daysSinceInbound, daysSilent, lastSide };
    }
    const quietAfterUs = lastSide === "us" && inbound.length > 0 && daysSinceInbound != null && daysSinceInbound >= 5;
    if (inbound.length && daysSinceInbound != null && daysSinceInbound <= 21 && !quietAfterUs) {
      return { tab: "live", reason: "real conversation", stale, daysSinceInbound, daysSilent, lastSide };
    }
    if (quietAfterUs) {
      return {
        tab: "chase",
        reason: `${daysSinceInbound} days quiet`,
        stale,
        daysSinceInbound,
        daysSilent: daysSinceInbound,
        lastSide
      };
    }
    if (hasPhone(venue)) {
      return { tab: "call", reason: "phone on file", stale: false, daysSinceInbound, daysSilent, lastSide };
    }
    return {
      tab: "parked",
      reason: inbound.length ? "no phone" : "no phone / not in play",
      stale: false,
      daysSinceInbound,
      daysSilent,
      lastSide
    };
  }
  function groundedSay(venue, who, tab) {
    const name = who || "the booker";
    const fee = displayFee(venue);
    const feeTalk = fee ? ` The fee on the thread is \xA3${fee} cash.` : "";
    if (venue.id === "east-barnet-rbl-club") {
      if (tab === "locked") {
        return `Already locked Sat 4 Dec 2027, \xA3275. Don\u2019t ring unless Tina calls you.`;
      }
      return `Hi Tina, Natalie for Jake Essex. You asked about 2 \xD7 60 with his PA \u2014 that's \xA3275 cash, no deposit. Have you got a Saturday in 2027?`;
    }
    if (venue.id === "corner-club-canvey") {
      return `Hi Maxine, Natalie for Jake Essex. Sunday afternoon we can do. 2 \xD7 45 is \xA3250, 3 \xD7 45 is \xA3375, own PA. Shall I hold a Sunday?`;
    }
    if (venue.id === "bird-in-hand") {
      return `Hi Alison, Natalie for Jake Essex. You said you\u2019d send dates when you were back \u2014 have you had a look?`;
    }
    if (venue.id === "sedir") {
      return `Hi Ahmet, Natalie for Jake Essex. You asked Jake to come to the restaurant. When should he pop in?`;
    }
    if (venue.id === "the-muddy-duck") {
      return `Hi Jaela, Natalie for Jake Essex. You wanted rates \u2014 2 \xD7 45 is \xA3250 cash, own PA. When those next two months clear, shall I hold a Saturday?`;
    }
    if (venue.id === "broomfield-rbl") {
      return `Hi Siobhan, Natalie for Jake Essex. Did the committee pick a Saturday?`;
    }
    if (venue.id === "st-neots-cons") {
      return `Hi Christine, Natalie for Jake Essex. Did the committee want Jake for a Saturday?`;
    }
    if (venue.id === "hounslow-rbl") {
      return `Hi Mick, Natalie for Jake Essex. Did September\u2019s committee pick a date?`;
    }
    if (venue.id === "greenford-conservative-club-john-mitchell" || venue.id === "greenford-conservative-club") {
      return `Hi John, Natalie for Jake Essex. You wanted a 2027 date \u2014 shall we pick one now?`;
    }
    if (venue.id === "aldridge-social-club") {
      return `Hi Dayn, Natalie for Jake Essex. You were looking at 2027 \u2014 have you got a Saturday?`;
    }
    if (venue.id === "berkhamsted-social-club") {
      return `Hi Keith, Natalie for Jake Essex. You asked for contact details \u2014 have you got a date in mind?`;
    }
    if (tab === "close") {
      return `Hi ${name}, Natalie for Jake Essex. Can we lock a date on this call?${feeTalk}`;
    }
    if (tab === "live") {
      return `Hi ${name}, Natalie for Jake Essex. Just picking up the thread \u2014 have you got a date for Jake?`;
    }
    if (tab === "chase") {
      return `Hi ${name}, Natalie for Jake Essex. You went quiet on me. Shall we pick a date now?`;
    }
    if (tab === "call") {
      return `Hi, Natalie for Jake Essex \u2014 live 50s to 70s, own PA. Have you got a Saturday this year or 2027?`;
    }
    if (tab === "locked") {
      return fee ? `Already locked \xA3${fee}. Don\u2019t ring unless they call you.` : `Already locked. Don\u2019t ring unless they call you.`;
    }
    return `Parked. Don\u2019t spend the night here.`;
  }
  function factLine(venue) {
    const fee = displayFee(venue);
    const known = {
      "east-barnet-rbl-club": "Locked Sat 4 Dec 2027. 2 \xD7 60, own PA, 8.30pm. \xA3275 on the thread. 38 Brookhill Rd EN4 8SL.",
      "corner-club-canvey": "Saturdays full. Sunday afternoon possible. She asked how much.",
      "bird-in-hand": "Alison is away. Said she\u2019ll send dates when she\u2019s back.",
      "sedir": "Ahmet wants Jake in the restaurant to talk.",
      "the-muddy-duck": "Jaela loves the act. Busy the next two months. Asked for rates.",
      "broomfield-rbl": "Siobhan took Saturdays to the committee.",
      "st-neots-cons": "Christine asked a Saturday costing for the committee.",
      "hounslow-rbl": "Mick put it to the September committee.",
      "greenford-conservative-club-john-mitchell": "John wants a 2027 date. Quiet since late August.",
      "aldridge-social-club": "Dayn said 2026 is full. Looking at 2027.",
      "berkhamsted-social-club": "Keith asked for contact details for later.",
      "halstead-rbl": "Locked Sat 17 Jul 2027. \xA3250 on the thread.",
      "hadleigh-cons": "Locked 13 Nov 2027, 3 \xD7 45. \xA3250 on the thread.",
      "dartford-mayor-charity-tea": "Charity tea. \xA3100 on the thread. Claire Tiltman Centre.",
      "oxhey-cons-keyser-hall": "Locked 23 Oct 2027. \xA3250 on the thread.",
      "bluehouse-farm": "Fri 30 Oct. \xA3250. Choice Live.",
      "bromley-services-club": "Two nights. \xA3400 lump on the thread \u2014 not \xA3800."
    };
    if (known[venue.id]) return known[venue.id];
    const bits = [];
    if (fee) bits.push(`\xA3${fee} on the thread`);
    if (venue.lockedDate) bits.push(String(venue.lockedDate));
    return bits.length ? bits.join(" \xB7 ") : null;
  }
  function feeOnThread(venue) {
    const thread = cleanThread(venue);
    for (let i = thread.length - 1; i >= 0; i--) {
      const m = (thread[i].body || "").match(AGREE_FEE_RE);
      if (!m) continue;
      const n = Number(m[1] || m[2]);
      if (n >= 50 && n <= 2e3) return n;
    }
    for (let i = thread.length - 1; i >= 0; i--) {
      const found = poundsIn(thread[i].body || "").filter((n) => n >= 80);
      if (found.length) return found[found.length - 1];
    }
    return null;
  }
  function displayFee(venue) {
    const thread = feeOnThread(venue);
    if (thread) return thread;
    const stored = Number(venue.lockedFee || 0);
    if (stored) return stored;
    const pending = Number(venue.pendingLockFee || 0);
    if (pending) return pending;
    return extractQuotedFee(venue);
  }
  function feeMismatch(_venue) {
    return null;
  }
  function webHref(venue, website) {
    const real = website || extractWebsite(venue);
    if (real && /^https?:\/\//i.test(real)) return real;
    const q = [venue.name, venue.town].filter(Boolean).join(" ");
    return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
  }
  function rankVenue(venue, notes = {}, now = /* @__PURE__ */ new Date()) {
    const note = notes[venue.id];
    const classified = classifyVenue({ venue, note, now });
    const who = extractWho(venue, note);
    const fee = displayFee(venue);
    const row = {
      venue,
      tab: classified.tab,
      stale: classified.stale && (classified.tab === "close" || classified.tab === "live" || classified.tab === "chase"),
      daysSilent: classified.daysSilent,
      daysSinceInbound: classified.daysSinceInbound,
      lastSide: classified.lastSide,
      lastTouchAt: lastOf(cleanThread(venue))?.at || venue.firstPitch || null,
      lastCalledAt: note?.calledAt || null,
      who,
      sayThis: groundedSay(venue, who, classified.tab),
      factLine: factLine(venue),
      fee,
      quotedFee: extractQuotedFee(venue),
      threadFee: feeOnThread(venue),
      feeMismatch: null,
      website: extractWebsite(venue),
      reason: classified.reason,
      called: !!note?.called,
      dropped: isDropped(note),
      latest: isLatestVenue(venue, classified.tab, now),
      giveTime: false,
      replyBucket: "email",
      replyWhy: "",
      desk: "silent",
      followState: "none",
      followCount: 0,
      deskWhy: ""
    };
    const action = replyAction(row, now);
    row.giveTime = !!action.wait;
    row.replyBucket = action.bucket;
    row.replyWhy = action.why || "";
    return assignDesk(row, now);
  }
  function rankAll(venues, notes = {}, now = /* @__PURE__ */ new Date()) {
    const out = [];
    for (const v of venues) {
      try {
        out.push(rankVenue(v, notes, now));
      } catch {
        out.push({
          venue: v,
          tab: "call",
          stale: false,
          daysSilent: null,
          daysSinceInbound: null,
          lastSide: null,
          lastTouchAt: v.firstPitch || null,
          lastCalledAt: null,
          who: null,
          sayThis: "Hi, Natalie for Jake Essex \u2014 live 50s to 70s, own PA. Have you got a Saturday this year or 2027?",
          factLine: null,
          fee: null,
          quotedFee: null,
          threadFee: null,
          feeMismatch: null,
          website: null,
          reason: "safe fallback",
          called: false,
          dropped: false,
          latest: false,
          giveTime: false,
          replyBucket: "email",
          replyWhy: "",
          desk: "silent",
          followState: "none",
          followCount: 0,
          deskWhy: "Safe fallback"
        });
      }
    }
    return out;
  }
  function closeScore(row) {
    if (row.giveTime) return -2e3 - (row.daysSinceInbound || 0);
    if (row.venue.pendingLockFee) return 1e4;
    if (row.stale) return -1e3 + (row.daysSinceInbound || 0) * -1;
    const recency = row.daysSinceInbound == null ? 50 : row.daysSinceInbound;
    return 500 - recency;
  }
  function sortTab(rows, tab) {
    const list = rows.filter((r) => r.tab === tab);
    if (tab === "close") {
      return list.sort((a, b) => {
        if (a.giveTime !== b.giveTime) return a.giveTime ? 1 : -1;
        if (a.stale !== b.stale) return a.stale ? 1 : -1;
        return closeScore(b) - closeScore(a);
      });
    }
    if (tab === "live") {
      return list.sort((a, b) => {
        if (a.stale !== b.stale) return a.stale ? 1 : -1;
        return (a.daysSinceInbound ?? 99) - (b.daysSinceInbound ?? 99);
      });
    }
    if (tab === "chase") {
      return list.sort((a, b) => {
        if (a.stale !== b.stale) return a.stale ? 1 : -1;
        return (b.daysSilent ?? 0) - (a.daysSilent ?? 0);
      });
    }
    if (tab === "call") {
      return list.sort((a, b) => {
        if (a.called !== b.called) return a.called ? 1 : -1;
        if (a.called && b.called) {
          return (a.lastCalledAt || "").localeCompare(b.lastCalledAt || "");
        }
        const atA = a.venue.firstPitch || a.lastTouchAt || "";
        const atB = b.venue.firstPitch || b.lastTouchAt || "";
        return atA.localeCompare(atB);
      });
    }
    if (tab === "locked") {
      return list.sort((a, b) => Number(b.fee || 0) - Number(a.fee || 0));
    }
    return list.sort((a, b) => a.venue.name.localeCompare(b.venue.name));
  }
  function sortWorking(rows) {
    const out = [];
    for (const tab of WORKING_TABS) out.push(...sortTab(rows, tab));
    return out;
  }
  function sortOpen(rows) {
    const out = [];
    for (const tab of OPEN_TABS) out.push(...sortTab(rows, tab));
    return out;
  }
  function sortClosed(rows) {
    return [...sortTab(rows, "locked"), ...sortTab(rows, "parked")];
  }
  var ON_FILE_RE = /future reference|on file|have your details|you may be hearing from me|as i have your details|keep (your|him|this|it) (details )?on file|for later/i;
  var DISTANCE_RE = /too far|a bit far|far for him to travel/i;
  var NAMED_DATE_RE = /\b\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i;
  var CASH_LOCK_RE = /will be the cash|the cash one|juggle some things/i;
  var MEET_RE = /come to (the )?restaurant|come down and (we )?talk|we talk about/i;
  var DEFINITE_RE = /definitely (be )?(interested|open)|would definitely|love the sound of jake/i;
  var SUNDAY_IN_RE = /squeeze in a sunday|sunday afternoon/i;
  var FORWARDED_RE = /forwarded your email|please contact him|onto peter/i;
  function namedDatePast(body, now) {
    const m = String(body || "").match(
      /\b(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{4})\b/i
    );
    if (!m) return false;
    const d = new Date(+m[3], MONTH_IDX[m[2].slice(0, 3).toLowerCase()] ?? 0, +m[1]);
    return d.getTime() < now.getTime() - DAY;
  }
  function heatScore(venue, daysSinceInbound, now = /* @__PURE__ */ new Date()) {
    const inbound = realInbound(venue);
    const lastBody = (inbound[inbound.length - 1]?.body || "").toLowerCase();
    const all = inbound.map((m) => m.body || "").join("\n").toLowerCase();
    let s = 40;
    const days = daysSinceInbound ?? 18;
    const lastHasDate = NAMED_DATE_RE.test(lastBody) && !namedDatePast(lastBody, now);
    if (lastHasDate && (CASH_LOCK_RE.test(lastBody) || /£\s*\d{2,4}/.test(lastBody))) {
      s += 90;
    } else if (lastHasDate || NAMED_DATE_RE.test(all) && days < 5 && !namedDatePast(all, now)) {
      s += 35;
    }
    if (CASH_LOCK_RE.test(lastBody)) s += 80;
    if (MEET_RE.test(all)) s += 55;
    if (DEFINITE_RE.test(all)) s += 38;
    if (FEE_ASK_RE.test(lastBody)) s += 40;
    if (DATE_TALK_RE.test(all) || /give you some dates|check the diary/.test(all)) s += 22;
    if (/give you some dates|check the diary on my return/.test(lastBody)) s += 16;
    if (SUNDAY_IN_RE.test(all)) s += 18;
    if (WAITING_RE.test(all) && /committee/.test(all)) s += 6;
    if (FORWARDED_RE.test(all)) s += 4;
    if (/next (two|2) months|concentrating on those/.test(lastBody)) s -= 22;
    if (/2027/.test(all) && !/\b(2026|october|november|december|this year)\b/.test(all)) s -= 14;
    if (DISTANCE_RE.test(all)) s -= 38;
    if (FULLY_BOOKED_RE.test(all)) s -= 22;
    if (ON_FILE_RE.test(all) || /future reference/.test(lastBody)) s -= 60;
    if (/^will do\b/.test(lastBody.trim())) s -= 12;
    if (namedDatePast(lastBody, now)) s -= 30;
    s -= Math.min(36, days * 2);
    return s;
  }
  function isLatestVenue(venue, tab, now) {
    if (tab === "locked") return false;
    if (realInbound(venue).length) return false;
    const us = cleanThread(venue).filter((m) => m.side === "us");
    const last = us.length ? us[us.length - 1] : null;
    const at = parseWhen(last?.at || venue.firstPitch);
    return daysBetween(at, now) === 0;
  }
  function followCount(venue) {
    const m = String(venue.followUps || "").match(/^(\d+)/);
    const listed = m ? Number(m[1]) : 0;
    const us = cleanThread(venue).filter((msg) => msg.side === "us").length;
    return Math.max(listed, Math.max(0, us - 1));
  }
  function usCount(venue) {
    return cleanThread(venue).filter((m) => m.side === "us").length;
  }
  function assignDesk(row, now = /* @__PURE__ */ new Date()) {
    const venue = row.venue;
    const inbound = realInbound(venue);
    const sent = usCount(venue);
    const follows = followCount(venue);
    row.followCount = follows;
    if (row.tab === "locked" || isLockedRecord(venue)) {
      row.desk = "booked";
      row.followState = "none";
      row.deskWhy = "Locked \u2014 don\u2019t contact";
      return row;
    }
    if (row.dropped || parkedBadge(venue) || row.reason === "hard no" || row.reason === "bounce" || row.replyBucket === "file") {
      row.desk = "no";
      row.followState = follows >= 1 || row.called ? "done" : "none";
      row.deskWhy = row.replyWhy || (row.reason === "hard no" ? "Not interested \u2014 leave" : row.reason === "bounce" ? "Bounce \u2014 dead address" : row.reason === "dropped" ? "Dropped \u2014 not interested" : /on file|file/i.test(row.reason + " " + row.replyWhy) ? "On file \u2014 leave them" : "Not in play \u2014 leave");
      return row;
    }
    if (!inbound.length) {
      if (!sent && hasPhone(venue)) {
        row.desk = "call";
        row.followState = row.called ? "done" : "none";
        row.deskWhy = "Phone on file \u2014 first contact";
        return row;
      }
      if (!sent) {
        row.desk = "no";
        row.followState = "none";
        row.deskWhy = "Not sent \u2014 not in play";
        return row;
      }
      row.desk = "silent";
      const days = row.daysSilent ?? daysBetween(parseWhen(row.lastTouchAt), now);
      if (row.latest || days === 0) {
        row.followState = "fresh";
        row.deskWhy = "Sent today \u2014 leave";
      } else if (follows >= 1 || row.called) {
        row.followState = "done";
        row.deskWhy = row.called ? `Followed up \xB7 still silent${days != null ? ` \xB7 ${days}d` : ""}` : `Followed up \xD7${follows} \xB7 still silent${days != null ? ` \xB7 ${days}d` : ""}`;
      } else if (days != null && days >= 5) {
        row.followState = "due";
        row.deskWhy = `No reply \xB7 ${days} days \xB7 follow-up due`;
      } else {
        row.followState = "fresh";
        row.deskWhy = days === 1 ? "Pitched yesterday \u2014 too soon" : `Pitched ${days ?? 0} days ago \u2014 too soon`;
      }
      return row;
    }
    if (row.giveTime || row.replyBucket === "wait") {
      row.desk = "wait";
      row.followState = row.called || follows >= 1 ? "done" : "none";
      row.deskWhy = row.replyWhy || "Waiting on them \u2014 don\u2019t chase";
      return row;
    }
    row.desk = "call";
    row.followState = row.called ? "done" : "none";
    row.deskWhy = row.replyWhy || row.reason || (hasPhone(venue) ? "Call when you\u2019re on" : "On email \u2014 no number");
    return row;
  }
  function monthToken(text) {
    const m = String(text || "").toLowerCase().match(
      /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\b/
    );
    if (!m) return null;
    const n = MONTH_IDX[m[1]];
    return n == null ? null : n;
  }
  function replyAction(row, now = /* @__PURE__ */ new Date()) {
    const venue = row.venue || {};
    const inbound = realInbound(venue);
    const last = inbound[inbound.length - 1];
    const lastBody = (last?.body || "").toLowerCase();
    const all = inbound.map((m) => m.body || "").join("\n").toLowerCase();
    const days = row.daysSinceInbound == null ? 18 : row.daysSinceInbound;
    const tel = hasPhone(venue);
    const who = row.who || extractWho(venue, null) || "them";
    if (!inbound.length) return { bucket: "wait", why: "", wait: true };
    if (ON_FILE_RE.test(all) || /future reference/.test(lastBody) || /hang on to your details|for the future/.test(lastBody) || /^will do\b/.test(lastBody.trim())) {
      return { bucket: "file", why: "On file \u2014 leave them", wait: true };
    }
    if (/email back in january|come back in january/.test(lastBody)) {
      return { bucket: "wait", why: "Told us January \u2014 don\u2019t chase", wait: true };
    }
    if (/not for us i'?m afraid|mostly bands/.test(lastBody) && /not interested|not for us|mostly bands/.test(all)) {
      return { bucket: "file", why: "Soft no \u2014 leave unless they write", wait: true };
    }
    if (/committee/.test(lastBody) || /committee/.test(all) && days < 40) {
      const mo = monthToken(lastBody);
      if (mo != null) {
        let until = new Date(now.getFullYear(), mo, 28);
        if (until.getTime() < now.getTime()) until = new Date(now.getFullYear() + 1, mo, 28);
        if (mo === now.getMonth() && days >= 21) {
          return { bucket: tel ? "call" : "email", why: "Committee window passed \u2014 call", wait: false };
        }
        if (until.getTime() > now.getTime()) {
          const label = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][mo];
          return { bucket: "wait", why: `Committee ${label} \u2014 give them time`, wait: true };
        }
      }
      if (/first tuesday of every month/.test(lastBody) && days < 28) {
        return { bucket: "wait", why: "Committee first Tuesday \u2014 wait", wait: true };
      }
      if (days >= 10) return { bucket: "call", why: "Committee window passed \u2014 call", wait: false };
      return { bucket: "wait", why: "With the committee \u2014 wait", wait: true };
    }
    if (/annual leave until|on annual leave/.test(lastBody)) {
      const dm = lastBody.match(/until\s+(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*/i);
      if (dm) {
        const until = new Date(now.getFullYear(), MONTH_IDX[dm[2].slice(0, 3).toLowerCase()] ?? 0, Number(dm[1]));
        if (until.getTime() > now.getTime()) {
          return { bucket: "wait", why: "On leave \u2014 wait until they\u2019re back", wait: true };
        }
        return { bucket: tel ? "call" : "email", why: "Leave ended \u2014 pick this up", wait: false };
      }
      if (days < 7) return { bucket: "wait", why: "On leave \u2014 wait", wait: true };
    }
    if (/i'?m away|on my return|check the diary on my return/.test(lastBody)) {
      if (days < 10) return { bucket: "wait", why: `${who} away \u2014 dates on return`, wait: true };
      return { bucket: tel ? "call" : "email", why: `${who} should be back \u2014 chase`, wait: false };
    }
    if (/will let you know|get back to you next week|i will get back|we will review/.test(lastBody)) {
      if (days < 8) return { bucket: "wait", why: "They asked for time \u2014 wait", wait: true };
      return { bucket: tel ? "call" : "email", why: `${who} said they\u2019d come back \u2014 now due`, wait: false };
    }
    if (/forwarding your email|forwarded your email|fyi/.test(lastBody) && days < 6) {
      return { bucket: "wait", why: "Passed internally \u2014 give them a few days", wait: true };
    }
    if (/area branch office|contact the clubs?/.test(lastBody)) {
      return { bucket: "wait", why: "Branch office \u2014 not a venue booker", wait: true };
    }
    if (namedDatePast(lastBody, now)) {
      return { bucket: "wait", why: "Date they named has gone \u2014 waiting on a new one", wait: true };
    }
    if (row.lastSide === "us" && days <= 1) {
      return { bucket: "wait", why: "Just wrote them \u2014 no chase today", wait: true };
    }
    const heat = heatScore(venue, row.daysSinceInbound, now);
    if (FEE_ASK_RE.test(lastBody) || DATE_ASK_RE.test(lastBody) || CASH_LOCK_RE.test(lastBody) || CLOSE_YES_RE.test(lastBody)) {
      if (tel) {
        return {
          bucket: "call",
          why: FEE_ASK_RE.test(lastBody) ? `${who} asked the fee \u2014 call` : `${who} talking dates \u2014 call`,
          wait: false
        };
      }
      return { bucket: "email", why: `${who} replied \u2014 no number, stay on email`, wait: false };
    }
    if (MEET_RE.test(all) && tel) return { bucket: "call", why: `${who} wants Jake in \u2014 call`, wait: false };
    if (tel && heat >= 48 && days >= 3) return { bucket: "call", why: `${who} gone quiet \u2014 call`, wait: false };
    if (!tel) return { bucket: "email", why: `${who} on email \u2014 no number`, wait: false };
    if (heat < 18) return { bucket: "file", why: "Cold reply \u2014 leave for now", wait: true };
    return { bucket: "call", why: `${who} \u2014 call when you\u2019re on`, wait: false };
  }
  var REPLY_BUCKET_ORDER = { call: 0, email: 1, wait: 2, file: 3 };
  function hasReplyLane(row) {
    const lane = String(row.venue.replyLane || "").toLowerCase();
    return lane === "call" || lane === "email";
  }
  function isRepliedRow(row) {
    return row.tab === "close" || row.tab === "live" || row.tab === "chase" || row.tab === "call" && hasReplyLane(row);
  }
  function sortReplied(rows) {
    return rows.filter(isRepliedRow).sort((a, b) => {
      const ba = REPLY_BUCKET_ORDER[a.replyBucket] ?? 1;
      const bb = REPLY_BUCKET_ORDER[b.replyBucket] ?? 1;
      if (ba !== bb) return ba - bb;
      const heat = heatScore(b.venue, b.daysSinceInbound) - heatScore(a.venue, a.daysSinceInbound);
      if (heat) return heat;
      return (a.daysSinceInbound ?? 99) - (b.daysSinceInbound ?? 99);
    });
  }
  var SILENT_ORDER = { due: 0, done: 1, fresh: 2, none: 3 };
  var DESK_ORDER = { call: 0, wait: 1, silent: 2, booked: 3, no: 4 };
  function sortCallDesk(rows) {
    return rows.filter((r) => r.desk === "call").sort((a, b) => {
      if (a.followState === "done" && b.followState !== "done") return 1;
      if (b.followState === "done" && a.followState !== "done") return -1;
      const heat = heatScore(b.venue, b.daysSinceInbound) - heatScore(a.venue, a.daysSinceInbound);
      if (heat) return heat;
      return (a.daysSinceInbound ?? 99) - (b.daysSinceInbound ?? 99);
    });
  }
  function sortWaitDesk(rows) {
    return rows.filter((r) => r.desk === "wait").sort((a, b) => {
      return (a.daysSinceInbound ?? 0) - (b.daysSinceInbound ?? 0);
    });
  }
  function sortSilentDesk(rows) {
    return rows.filter((r) => r.desk === "silent").sort((a, b) => {
      const oa = SILENT_ORDER[a.followState] ?? 3;
      const ob = SILENT_ORDER[b.followState] ?? 3;
      if (oa !== ob) return oa - ob;
      if (a.followState === "due") return (b.daysSilent ?? 0) - (a.daysSilent ?? 0);
      if (a.followState === "fresh") return String(b.lastTouchAt || "").localeCompare(String(a.lastTouchAt || ""));
      return (b.daysSilent ?? 0) - (a.daysSilent ?? 0);
    });
  }
  function sortBookedDesk(rows) {
    return rows.filter((r) => r.desk === "booked").sort((a, b) => Number(b.fee || 0) - Number(a.fee || 0));
  }
  function sortNoDesk(rows) {
    return rows.filter((r) => r.desk === "no").sort((a, b) => a.venue.name.localeCompare(b.venue.name));
  }
  function sortDesk(rows, filter) {
    if (filter === "call") return sortCallDesk(rows);
    if (filter === "wait") return sortWaitDesk(rows);
    if (filter === "silent") return sortSilentDesk(rows);
    if (filter === "booked") return sortBookedDesk(rows);
    return sortNoDesk(rows);
  }
  function sortDeskAll(rows) {
    const ids = Object.keys(DESK_ORDER).sort((a, b) => DESK_ORDER[a] - DESK_ORDER[b]);
    const out = [];
    for (const id of ids) out.push(...sortDesk(rows, id));
    return out;
  }
  function sortAll(rows) {
    return sortDeskAll(rows);
  }
  function rowsForFilter(rows, filter) {
    return sortDesk(rows, filter);
  }
  function tabCounts(rows) {
    const counts = {
      close: 0,
      live: 0,
      chase: 0,
      call: 0,
      locked: 0,
      parked: 0
    };
    for (const row of rows) counts[row.tab] += 1;
    return counts;
  }
  function filterCounts(rows) {
    const counts = { call: 0, wait: 0, silent: 0, booked: 0, no: 0 };
    for (const row of rows) counts[row.desk] += 1;
    return counts;
  }
  function deskGroupKey(row, filter, searching = false) {
    if (searching) return row.desk;
    if (filter === "silent") return row.followState || "none";
    if (filter === "call") {
      if (!realInbound(row.venue).length) return "cold";
      if (row.replyBucket === "email") return "email";
      return "call";
    }
    if (filter === "no") {
      if (/bounce/i.test(row.reason)) return "bounce";
      if (/hard no|not interested|dropped/i.test(row.reason + " " + row.deskWhy)) return "no";
      if (/file|on file/i.test(row.reason + " " + row.deskWhy + " " + row.replyWhy)) return "file";
      return "parked";
    }
    if (filter === "wait") return "wait";
    if (filter === "booked") return "booked";
    return row.desk;
  }
  function deskGroupLabel(key, filter, searching = false) {
    if (searching || ["call", "wait", "silent", "booked", "no"].includes(key)) {
      const labels = {
        call: "Call now",
        wait: "Waiting on them",
        silent: "No reply",
        booked: "Booked \u2014 don\u2019t contact",
        no: "Not interested"
      };
      if (labels[key]) return labels[key];
    }
    if (filter === "silent") {
      if (key === "due") return "Follow-up due";
      if (key === "done") return "Followed up \xB7 still silent";
      if (key === "fresh") return "Pitched recently \xB7 leave";
      return "No reply";
    }
    if (filter === "call") {
      if (key === "email") return "On email \u2014 no number";
      if (key === "cold") return "Phone on file \xB7 never emailed";
      return "Call now";
    }
    if (filter === "no") {
      if (key === "bounce") return "Bounce \xB7 dead address";
      if (key === "file") return "On file \xB7 leave";
      if (key === "no") return "Not interested";
      return "Parked";
    }
    if (filter === "wait") return "Waiting on them";
    if (filter === "booked") return "Locked in";
    return key;
  }
  function deskBanner(filter) {
    if (filter === "call") return "These are the ones to ring. Waiting and no-replies live on their own tabs.";
    if (filter === "wait") return "Ball is in their court. Don\u2019t chase until the why-line says they\u2019re due.";
    if (filter === "silent") return "Never wrote back. Follow-up due is the work. Followed up and too-soon sit below.";
    if (filter === "booked") return "Locked. Don\u2019t contact unless they call you.";
    return "Said no, on file, bounce, or not in play. Leave them.";
  }
  function lockedCash(venues) {
    const rows = [];
    let cash = 0;
    let nights = 0;
    for (const v of venues) {
      if (!isLockedRecord(v)) continue;
      const fee = Number(v.lockedFee || 0) || displayFee(v) || 0;
      if (!fee) continue;
      const n = Number(v.lockedNights || 1) || 1;
      cash += fee;
      nights += n;
      rows.push({
        name: v.name,
        fee,
        nights: n,
        id: v.id
      });
    }
    rows.sort((a, b) => b.fee - a.fee);
    const pending = venues.filter((v) => Number(v.pendingLockFee || 0) > 0 && !isLockedRecord(v)).map((v) => ({
      name: v.name,
      fee: Number(v.pendingLockFee),
      note: v.pendingNote
    }));
    return { cash, nights, rows, pending };
  }
  function cashTarget(stats) {
    const target = CASH_TARGET;
    const cash = Number(stats?.cash || 0);
    const pct = Math.max(0, Math.min(100, Math.round(cash / target * 1e3) / 10));
    return { target, pct, left: Math.max(0, target - cash) };
  }
  function pepLine(rows) {
    const call = sortCallDesk(rows);
    const due = rows.filter((r) => r.desk === "silent" && r.followState === "due");
    const wait = rows.filter((r) => r.desk === "wait");
    const first = call[0];
    const who = first?.who || first?.venue.name.split(" ")[0] || null;
    const n = call.length;
    const callBit = n === 0 ? "Nothing to call." : n === 1 ? "1 to call." : `${n} to call.`;
    const whoBit = who && n ? ` ${who} first.` : "";
    const dueBit = due.length === 0 ? " No follow-ups due." : due.length === 1 ? " 1 follow-up due." : ` ${due.length} follow-ups due.`;
    const waitBit = wait.length === 0 ? "" : wait.length === 1 ? " 1 waiting on them." : ` ${wait.length} waiting on them.`;
    return `${callBit}${whoBit}${dueBit}${waitBit}`.replace(/\s+/g, " ").trim();
  }
  function chaseAlarm(rows) {
    return rows.some((r) => r.tab === "chase" && (r.daysSilent ?? 0) > 7);
  }
  function matchesQuery(venue, q) {
    if (!q.trim()) return true;
    const hay = `${venue.name} ${venue.town || ""} ${venue.email || ""} ${venue.subject || ""} ${venue.contactName || ""}`.toLowerCase();
    return hay.includes(q.trim().toLowerCase());
  }
  function telHref(phone) {
    let d = String(phone || "").replace(/\D/g, "");
    if (!d) return "";
    if (d.startsWith("0")) d = "44" + d.slice(1);
    if (!d.startsWith("44")) d = "44" + d;
    return `tel:+${d}`;
  }
  function smsHref(phone) {
    const tel = telHref(phone);
    return tel ? tel.replace(/^tel:/, "sms:") : "";
  }
  function prettyPhone(phone) {
    let d = String(phone || "").replace(/\D/g, "");
    if (d.startsWith("44")) d = "0" + d.slice(2);
    if (d.length === 11) return `${d.slice(0, 5)} ${d.slice(5)}`;
    return phone || "";
  }
  function mapsHref(venue) {
    const q = [venue.name, venue.town].filter(Boolean).join(" ");
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  }
  function mailtoHref(venue) {
    const email = primaryEmail(venue);
    if (!email) return "";
    return `mailto:${email}`;
  }
  function gbp(n) {
    return "\xA3" + Number(n || 0).toLocaleString("en-GB");
  }
  function fmtWhen(iso) {
    if (!iso) return "";
    const d = parseWhen(iso);
    if (!d) return String(iso);
    return d.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }
  function fmtDay(iso) {
    if (!iso) return "";
    const d = parseWhen(iso);
    if (!d) return String(iso);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }
  function lastTouchLabel(row, now = /* @__PURE__ */ new Date()) {
    const at = row.lastTouchAt;
    const d = parseWhen(at);
    const who = row.lastSide === "them" ? "Them" : row.lastSide === "us" ? "Us" : "Touch";
    if (!d) return who;
    const days = daysBetween(d, now);
    if (days === 0) return `${who} \xB7 today`;
    if (days === 1) return `${who} \xB7 yesterday`;
    return `${who} \xB7 ${fmtDay(at)}`;
  }
  function lastCalledLabel(note, now = /* @__PURE__ */ new Date()) {
    if (!note?.called) return null;
    const d = parseWhen(note.calledAt || note.updatedAt || null);
    if (!d) return "Called";
    const days = daysBetween(d, now);
    if (days === 0) return "Called \xB7 today";
    if (days === 1) return "Called \xB7 yesterday";
    return `Called \xB7 ${fmtDay(note.calledAt || note.updatedAt)}`;
  }
  var UNCLASSIFIED_WITHOUT_GUESSING = [
    {
      id: "wilmington-private-function-barbara-morris",
      why: "Website enquiry from Barbara, Saturday 3 Jul 2027, \xA3350 quoted \u2014 inbound body is not on the thread. No phone. Parked, not Close (that would be guessing from our own reply)."
    },
    {
      id: "winchester-club",
      why: "Badge quoted / website Sandra, but the only message on file is our pitch. Has a phone so Call list, not Close."
    },
    {
      id: "california-social-ipswich",
      why: "Last inbound is an out-of-office from Kate, not a conversation. Call list."
    },
    {
      id: "greenford-conservative-club",
      why: "Duplicate of John Mitchell\u2019s thread with no phone. Same inbound lives on greenford-conservative-club-john-mitchell."
    }
  ];
  function isStockUsCopy(text) {
    const blob = text.toLowerCase();
    return STOCK_US.some((s) => blob.includes(s));
  }
  return __toCommonJS(pipeline_exports);
})();

var NatNotes = (function(exports) {
	Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
	//#region src/lib/board/notes.ts
	const NOTEKEY = "natalie-live-board-notes-v3";
	const NOTES_PUSH = "https://dweet.cc/dweet/for/jem-natalie-live-nbj-2026";
	const NOTES_PULL = "https://dweet.cc/get/latest/dweet/for/jem-natalie-live-nbj-2026";
	const NOTES_FALLBACK = "call-notes.json";
	function newer(a, b) {
		return String(a && a.updatedAt || "") > String(b && b.updatedAt || "");
	}
	function mergeStores(a, b) {
		const out = { ...a };
		for (const k of Object.keys(b)) if (!out[k] || newer(b[k], out[k])) out[k] = b[k];
		return out;
	}
	function readLocal() {
		try {
			return JSON.parse(localStorage.getItem("natalie-live-board-notes-v3") || "{}");
		} catch {
			return {};
		}
	}
	function writeLocal(store) {
		localStorage.setItem(NOTEKEY, JSON.stringify(store));
	}
	function recordOf(store, id) {
		const n = store[id] || { venueId: id };
		const entries = Array.isArray(n.entries) ? n.entries.slice() : [];
		if (!entries.length && n.note) entries.push({
			at: n.updatedAt || n.calledAt || "",
			text: n.note,
			called: !!n.called
		});
		return {
			venueId: id,
			called: !!n.called,
			calledAt: n.calledAt || null,
			note: n.note || "",
			updatedAt: n.updatedAt,
			entries,
			dropped: !!n.dropped,
			droppedAt: n.droppedAt || null,
			contactName: n.contactName,
			outcome: n.outcome,
			bookedFee: n.bookedFee ?? null,
			bookedDate: n.bookedDate ?? null
		};
	}
	function putNote(store, next) {
		return {
			...store,
			[next.venueId]: {
				...next,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			}
		};
	}
	function appendQuickNote(store, id, text) {
		const rec = recordOf(store, id);
		const entries = rec.entries || [];
		entries.push({
			at: (/* @__PURE__ */ new Date()).toISOString(),
			text,
			called: rec.called
		});
		rec.entries = entries;
		rec.note = text;
		return putNote(store, rec);
	}
	async function pullRemote() {
		try {
			const res = await fetch(`${NOTES_PULL}?t=${Date.now()}`, { cache: "no-store" });
			if (!res.ok) throw new Error("pull");
			const raw = ((await res.json())?.with?.[0]?.content)?.notes;
			let incoming = {};
			if (typeof raw === "string") try {
				incoming = JSON.parse(raw);
			} catch {
				incoming = {};
			}
			else if (raw && typeof raw === "object") incoming = raw;
			const merged = mergeStores(readLocal(), incoming);
			writeLocal(merged);
			return {
				store: merged,
				shared: true
			};
		} catch {
			try {
				const res = await fetch(`${NOTES_FALLBACK}?t=${Date.now()}`, { cache: "no-store" });
				if (!res.ok) throw new Error("file");
				const data = await res.json();
				const incoming = data && data.notes ? data.notes : data;
				const merged = mergeStores(readLocal(), incoming || {});
				writeLocal(merged);
				return {
					store: merged,
					shared: false
				};
			} catch {
				return {
					store: readLocal(),
					shared: false
				};
			}
		}
	}
	async function pushRemote(store) {
		try {
			const body = "notes=" + encodeURIComponent(JSON.stringify(store));
			const res = await fetch(NOTES_PUSH, {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body
			});
			if (!res.ok) return false;
			return (await res.json())?.this === "succeeded";
		} catch {
			return false;
		}
	}
	function applyAfterCall(store, id, outcome, extra = {}) {
		const rec = recordOf(store, id);
		const label = outcome === "booked" ? `Booked${extra.fee ? ` £${extra.fee}` : ""}${extra.date ? ` ${extra.date}` : ""}` : outcome === "confirm" ? extra.text || "They’ll confirm" : outcome === "voicemail" ? extra.text || "Voicemail" : extra.text || "Dead — don’t chase";
		const entries = rec.entries || [];
		entries.push({
			at: (/* @__PURE__ */ new Date()).toISOString(),
			text: label,
			called: outcome !== "dead",
			outcome
		});
		rec.entries = entries;
		rec.called = outcome !== "dead";
		rec.calledAt = rec.called ? (/* @__PURE__ */ new Date()).toISOString() : rec.calledAt;
		rec.outcome = outcome;
		rec.note = label;
		rec.dropped = outcome === "dead";
		rec.droppedAt = outcome === "dead" ? (/* @__PURE__ */ new Date()).toISOString() : rec.droppedAt;
		if (outcome === "booked") {
			rec.bookedFee = extra.fee ?? rec.bookedFee;
			rec.bookedDate = extra.date ?? rec.bookedDate;
		}
		return putNote(store, rec);
	}
	//#endregion
	exports.NOTEKEY = NOTEKEY;
	exports.NOTES_FALLBACK = NOTES_FALLBACK;
	exports.NOTES_PULL = NOTES_PULL;
	exports.NOTES_PUSH = NOTES_PUSH;
	exports.appendQuickNote = appendQuickNote;
	exports.applyAfterCall = applyAfterCall;
	exports.mergeStores = mergeStores;
	exports.pullRemote = pullRemote;
	exports.pushRemote = pushRemote;
	exports.putNote = putNote;
	exports.readLocal = readLocal;
	exports.recordOf = recordOf;
	exports.writeLocal = writeLocal;
	return exports;
})({});

/* Matrix rain */
(function(){
  var GLYPHS="アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789<>|*+#¥$NATJAKEV21TCB";
  var canvas=document.getElementById("rain");
  if(!canvas) return;
  try{ if(sessionStorage.getItem("natalie-ok")==="1"){ canvas.style.display="none"; return; } }catch(e){}
  var g=canvas.getContext("2d",{alpha:false});
  if(!g) return;
  var mode="idle", cols=[], colW=16, last=0, raf=0, running=true;
  var reduced=false;
  try{ reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){}
  function pal(){
    if(mode==="denied") return {fill:"#ff7a6e",head:"#ffe4e0"};
    if(mode==="granted"||mode==="egg") return {fill:"#ffd76a",head:"#fff4c8"};
    return {fill:"#3dff6a",head:"#eaffea"};
  }
  function resize(){
    var dpr=Math.min(window.devicePixelRatio||1,2);
    var w=window.innerWidth, h=window.innerHeight;
    canvas.width=Math.floor(w*dpr); canvas.height=Math.floor(h*dpr);
    canvas.style.width=w+"px"; canvas.style.height=h+"px";
    g.setTransform(dpr,0,0,dpr,0,0);
    colW=w<400?18:16;
    cols=Array.from({length:Math.max(12,Math.ceil(w/colW))}, function(){ return Math.random()*-40; });
    g.fillStyle="#140e0a"; g.fillRect(0,0,w,h);
  }
  function tick(now){
    if(!running) return;
    raf=requestAnimationFrame(tick);
    if(document.hidden) return;
    var minDt=mode==="granted"?24:32;
    if(now-last<minDt) return;
    last=now;
    var w=window.innerWidth, h=window.innerHeight;
    g.fillStyle=mode==="granted"?"rgba(20,14,10,0.18)":"rgba(20,14,10,0.10)";
    g.fillRect(0,0,w,h);
    var p=pal(), size=colW-2, step=mode==="granted"?1.85:mode==="egg"?1.15:1;
    g.font=size+"px ui-monospace,monospace"; g.textBaseline="top";
    for(var i=0;i<cols.length;i++){
      var x=i*colW, y=cols[i]*colW;
      var ch=GLYPHS[Math.floor(Math.random()*GLYPHS.length)]||"0";
      g.globalAlpha=0.95; g.fillStyle=p.head; g.fillText(ch,x,y);
      g.globalAlpha=0.55; g.fillStyle=p.fill; g.fillText(ch,x,y+colW);
      g.globalAlpha=1;
      if(y>h && Math.random()>0.96) cols[i]=Math.random()*-20; else cols[i]+=step;
    }
  }
  window.NatRain={
    set:function(m){ mode=m||"idle"; },
    stop:function(){ running=false; cancelAnimationFrame(raf); }
  };
  resize();
  if(reduced){ canvas.style.opacity=".25"; }
  window.addEventListener("resize", resize);
  raf=requestAnimationFrame(tick);
})();

/* Natalie Live Board v21 — vanilla UI. Pipeline is window.Board from the bundled module. */
(function () {
  var B = window.Board;
  var PASS = B.PASSWORD;
  var filter = "call";
  var q = "";
  var openId = null;
  var VENUES = [];
  var NOTES = {};
  var sharedOk = false;
  var cashOpen = false;
  var emailsOpen = false;
  var sheetOpen = false;
  var GIGS = [];
  var UNDATED = [];
  var diaryOpen = false;
  var diaryPick = "";
  var datesOpen = false;
  var datesPick = "";
  var datesMap = null;
  var datesMarkers = {};
  var _n = new Date();
  var diaryYear = _n.getFullYear();
  var diaryMonth = _n.getMonth();
  if (diaryYear < 2026 || (diaryYear === 2026 && diaryMonth < 8)) { diaryYear = 2026; diaryMonth = 8; }
  if (diaryYear > 2027) { diaryYear = 2027; diaryMonth = 11; }

  function $(id) { return document.getElementById(id); }

  function showErr(msg) {
    var el = $("err");
    if (el) el.textContent = msg || "";
  }

  function paintCash() {
    if (!VENUES.length) return;
    var stats = B.lockedCash(VENUES);
    if ($("cash-amt")) $("cash-amt").textContent = B.gbp(stats.cash);
    if ($("cash-meta")) $("cash-meta").textContent = stats.nights + " night" + (stats.nights === 1 ? "" : "s") + " locked";
    return stats;
  }

  function loadVenues() {
    try {
      VENUES = JSON.parse($("venues-data").textContent);
    } catch (e) {
      VENUES = [];
    }
    paintCash();
    fetch("venues.json?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("venues"); return r.json(); })
      .then(function (data) {
        if (Array.isArray(data) && data.length) {
          VENUES = data;
          paintCash();
          if ($("app").classList.contains("show") && !openId) render();
        }
      })
      .catch(function () {});
  }

  function loadGigs() {
    fetch("gigs.json?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("gigs"); return r.json(); })
      .then(function (data) {
        GIGS = (data && data.gigs) || [];
        UNDATED = (data && data.undated) || [];
        if (diaryOpen || datesOpen) render();
      })
      .catch(function () {});
  }

  function rain(mode) {
    if (window.NatRain && window.NatRain.set) window.NatRain.set(mode);
  }

  function hideRain() {
    if (window.NatRain && window.NatRain.stop) window.NatRain.stop();
    var el = $("rain");
    if (el) el.style.display = "none";
  }

  function openBoard() {
    hideRain();
    $("gate").classList.add("ok");
    $("app").classList.add("show");
    try { sessionStorage.setItem("natalie-ok", "1"); } catch (e) {}
    try { localStorage.removeItem("natalie-cash-5k-v1"); } catch (e) {}
    var party = document.getElementById("cash-5k-party");
    if (party && party.parentNode) party.parentNode.removeChild(party);
    render();
  }

  function fireEgg() {
    rain("egg");
    var box = $("egg");
    var ul = $("egg-lines");
    if (box) box.classList.add("on");
    if (ul && !ul.childNodes.length) {
      ["WAKE UP, NAT", "THE BOARD HAS YOU", "FOLLOW THE WHITE RABBIT", "v21 · YOU'RE THE ONE"].forEach(function (line) {
        var li = document.createElement("li");
        li.textContent = "› " + line;
        ul.appendChild(li);
      });
    }
    $("pw").value = "";
    showErr("");
  }

  function grantThenOpen() {
    try { sessionStorage.setItem("natalie-ok", "1"); } catch (e) {}
    var reduced = false;
    try { reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
    if (reduced) { openBoard(); return; }
    rain("granted");
    var card = $("gate-card");
    var grant = $("grant");
    if (card) card.style.display = "none";
    if (grant) grant.classList.add("on");
    var ul = $("grant-lines");
    var lines = [
      "HANDSHAKE · JEM-VAULT",
      "KEY ACCEPTED",
      "DECRYPTING VENUE BOOK · " + VENUES.length,
      "NOTES CHANNEL · LIVE",
      "ACCESS GRANTED · NATALIE",
      "WELCOME IN, NATALIE"
    ];
    var i = 0;
    function next() {
      if (ul && i < lines.length) {
        var li = document.createElement("li");
        li.textContent = "› " + lines[i];
        ul.appendChild(li);
        i += 1;
        setTimeout(next, 280);
        return;
      }
      setTimeout(openBoard, 700);
    }
    next();
  }

  function unlock() {
    showErr("");
    var raw = ($("pw").value || "").replace(/^\s+|\s+$/g, "");
    var key = raw.toLowerCase();
    if (key === "v20" || key === "v21" || key === "neo" || key === "whiterabbit" || key === "white rabbit") {
      fireEgg();
      return;
    }
    if (raw.toLowerCase() === PASS || raw === PASS) {
      grantThenOpen();
      return;
    }
    rain("denied");
    var card = $("gate-card");
    if (card) {
      card.classList.remove("shake");
      void card.offsetWidth;
      card.classList.add("shake");
    }
    showErr("ACCESS DENIED");
    setTimeout(function () { rain("idle"); }, 900);
  }

  function ranked() {
    return B.rankAll(VENUES, NOTES, new Date());
  }

  function persist(store) {
    NOTES = store;
    window.NatNotes.writeLocal(store);
    window.NatNotes.pushRemote(store).then(function (ok) {
      sharedOk = ok;
      var el = $("sync");
      if (el) el.textContent = ok ? "Notes live with Jake" : "Board live";
    });
  }

  window.natUnlock = unlock;
  window.natStamp = (function () {
    var n = 0, t = 0;
    return function () {
      n += 1;
      if (t) clearTimeout(t);
      t = setTimeout(function () { n = 0; }, 900);
      if (n >= 3) { n = 0; fireEgg(); }
    };
  })();
  window.natEye = function () {
    var el = $("pw");
    if (!el) return;
    el.type = el.type === "password" ? "text" : "password";
  };
  window.natRender = render;
  window.natOpen = function (id) { openId = id; emailsOpen = false; sheetOpen = false; render(); };
  window.natCalled = function (id) { openId = id; emailsOpen = false; sheetOpen = true; render(); };
  window.natBack = function () { openId = null; sheetOpen = false; render(); };
  window.natFilter = function (t) { filter = t; render(); };
  window.natTab = window.natFilter;
  window.natCash = function () {
    datesOpen = true;
    diaryOpen = false;
    cashOpen = false;
    render();
  };
  window.natEmails = function () { emailsOpen = !emailsOpen; render(); };
  window.natSheet = function (on) { sheetOpen = !!on; render(); };
  window.natLock = function () {
    try { sessionStorage.removeItem("natalie-ok"); } catch (e) {}
    location.reload();
  };
  window.natDiary = function () {
    diaryOpen = true;
    datesOpen = false;
    destroyDatesMap();
    render();
    var el = $("diary");
    if (el) el.scrollTop = 0;
  };
  window.natDiaryClose = function () {
    diaryOpen = false;
    render();
  };
  window.natDatesClose = function () {
    datesOpen = false;
    datesPick = "";
    destroyDatesMap();
    render();
  };
  window.natDatesPick = function (id) {
    datesPick = id || "";
    var rows = document.querySelectorAll("#dates .date-row");
    var i, row;
    for (i = 0; i < rows.length; i++) {
      row = rows[i];
      if (row.getAttribute("data-id") === datesPick) row.classList.add("on");
      else row.classList.remove("on");
    }
    flyDatesPin(datesPick);
    row = document.querySelector('#dates .date-row[data-id="' + datesPick + '"]');
    if (row && row.scrollIntoView) row.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };
  window.natDiaryMonth = function (delta) {
    var d = new Date(diaryYear, diaryMonth + delta, 1);
    diaryYear = d.getFullYear();
    diaryMonth = d.getMonth();
    if (diaryYear < 2026 || (diaryYear === 2026 && diaryMonth < 8)) { diaryYear = 2026; diaryMonth = 8; }
    if (diaryYear > 2027) { diaryYear = 2027; diaryMonth = 11; }
    render();
  };
  window.natDiaryPick = function (date) {
    diaryPick = date || "";
    var p = String(date || "").split("-");
    if (p.length === 3) {
      diaryYear = Number(p[0]);
      diaryMonth = Number(p[1]) - 1;
    }
    render();
  };
  window.natDrop = function (id, dropped) {
    var rec = window.NatNotes.recordOf(NOTES, id);
    rec.dropped = dropped;
    rec.droppedAt = dropped ? new Date().toISOString() : null;
    persist(window.NatNotes.putNote(NOTES, rec));
    if (dropped) openId = null;
    render();
  };
  window.natAfter = function (id, outcome) {
    var extra = {};
    if (outcome === "booked") {
      extra.fee = Number(($("book-fee") && $("book-fee").value) || 0) || undefined;
      extra.date = ($("book-date") && $("book-date").value) || undefined;
    }
    persist(window.NatNotes.applyAfterCall(NOTES, id, outcome, extra));
    sheetOpen = false;
    if (outcome === "dead") openId = null;
    render();
  };
  window.natSaveWho = function (id) {
    var rec = window.NatNotes.recordOf(NOTES, id);
    rec.contactName = ($("who-name") && $("who-name").value || "").trim() || undefined;
    persist(window.NatNotes.putNote(NOTES, rec));
    render();
  };
  window.natSaveNote = function (id) {
    var text = ($("detail-note") && $("detail-note").value || "").trim();
    if (!text) return;
    persist(window.NatNotes.appendQuickNote(NOTES, id, text));
    render();
  };
  window.natDelNote = function (id, idx) {
    var rec = window.NatNotes.recordOf(NOTES, id);
    rec.entries.splice(idx, 1);
    rec.note = rec.entries.length ? rec.entries[rec.entries.length - 1].text : "";
    persist(window.NatNotes.putNote(NOTES, rec));
    render();
  };

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  }

  function chip(desk) {
    return (B.DESK_CHIP && B.DESK_CHIP[desk]) || desk || "";
  }

  function followChip(state) {
    return (B.FOLLOW_CHIP && B.FOLLOW_CHIP[state]) || "";
  }

  /** Jake reply lane chips = SUGGESTION only (never hide Call tel: if phone exists).
   *  Must sit in .job-badges, not inside .job-name (ellipsis clips). */
  function laneChipHtml(venue) {
    var lane = String((venue && venue.replyLane) || "").toLowerCase();
    if (lane === "call") return '<span class="badge lane-call" title="Suggestion: phone could book from this thread">Call</span>';
    if (lane === "email") return '<span class="badge lane-email" title="Suggestion: keep on email unless you want to dial">Email</span>';
    return "";
  }

  /** One-line green sum-ups on Replied (Call + hot Email). Suggestion chips stay separate. */
  var REPLY_WHY = {
    "the-bull": "Holly Thursday quote live — call",
    "sutton-social-club": "Julie asked the fee — call",
    "the-muddy-duck": "Awaiting Jaela callback",
    "bardswell-social-club-sharon-banks": "Sharon juggling cash — call",
    sedir: "Ahmet wants Jake in the restaurant",
    "mildmay-club": "Iona £250 Saturday — call",
    "california-social-ipswich": "Peter books bands — call",
    "winchester-club": "5 Sep gone — waiting on a new date",
    "corner-club-canvey": "Maxine said next week — now due",
    "hounslow-rbl": "September committee due — call",
    "bird-in-hand": "Alison away — dates on return",
    "st-neots-cons": "Committee first Tuesday — wait",
    "iona-social-club": "Email January — don’t chase",
    "honiton-cons": "Committee end of October — wait",
    "frimley-green-club": "Soft no — leave them",
    "broomfield-rbl": "Committee window passed — call",
    "hounslow-rbl": "September committee due — call",
    "birchington-united-services-club": "Lyn back off leave today — pick up",
    "pendyffryn-club-mags": "Mags fee-ask today — quoted, wait",
    "ciu-north-east-metropolitan-branch": "Branch office — not a venue",
    "the-tenterden-club": "On file for later — leave",
    "berkhamsted-social-club": "On file — leave them",
    "aldridge-social-club": "Will do — cold, leave",
    "whitstable-social-club": "Claire Sunday fee — no number, email",
    "the-greyhound-hotel": "Annemarie asked a price list — call",
    "goldstone-ex-service-club": "Asked Saturdays / Sundays — email",
    "lower-bourne-social-club": "Forwarded to Kate — give them time",
    "herne-bay-ex-servicemen-s-club": "Debs quote sent — chase if quiet",
    "coulsdon-victoria-social-club": "Reviewing Sundays — wait",
    "shepherd-and-dog": "Will let you know — wait",
    "wraysbury-village-club": "FYI to Richard — give him a few days",
    "barrow-upon-soar-cons": "Fee ask — call",
    "the-six-in-one-club": "Saturday fee ask — no number, email"
  };

  function laneWhyHtml(venue, row) {
    if (!venue) return "";
    var why = (row && row.deskWhy) || REPLY_WHY[String(venue.id || "")] || (row && row.replyWhy) || "";
    if (!why && venue.needPhone) why = "Need better number";
    if (!why) return "";
    var wait = (row && (row.desk === "wait" || row.followState === "fresh")) ? " wait" : (row && row.followState === "due" ? " due" : "");
    return '<span class="job-lane-why' + wait + '">' + esc(why) + "</span>";
  }

  function moneyLabel(row) {
    if (!row.fee) return "";
    if (row.desk === "booked") return "Locked " + B.gbp(row.fee);
    if (row.desk === "call" || row.desk === "wait") return B.gbp(row.fee) + " on the thread";
    return "";
  }

  function actions(row) {
    var v = row.venue;
    var html = '<div class="acts">';
    // Lane chip is suggestion only — always offer tel: when a number exists (incl. Email-lane).
    if (B.telHref(v.phone)) {
      html += '<a class="btn call full" href="' + B.telHref(v.phone) + '">Call' + (row.who ? " " + esc(row.who) : "") + "</a>";
    }
    html += '<div class="acts-triple">';
    html += '<a class="btn" href="' + B.mapsHref(v) + '" target="_blank" rel="noopener">Maps</a>';
    html += '<button class="btn gold" type="button" onclick="natDiary()">Calendar</button>';
    html += '<a class="btn" href="' + esc(B.webHref(v, row.website)) + '" target="_blank" rel="noopener">Web</a>';
    html += "</div></div>";
    return html;
  }

  function todayIso() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function mergeDiary(gigs, venues) {
    var by = {};
    (gigs || []).forEach(function (g) {
      if (!g || !g.date) return;
      by[g.date] = {
        date: g.date,
        venue: g.venue || "",
        town: g.town || "",
        postcode: g.postcode || "",
        start: g.start || "",
        finish: g.finish || "",
        status: g.status === "held" ? "held" : "booked",
        source: g.source || "cl",
        note: g.note || ""
      };
    });
    (venues || []).forEach(function (v) {
      var date = String(v.lockedDate || "").slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
      var prev = by[date] || {};
      var start = prev.start && prev.start !== "00:00" && prev.start !== "00:01" ? prev.start : "";
      var finish = prev.finish && prev.finish !== "00:02" && prev.finish !== "00:00" ? prev.finish : "";
      by[date] = {
        date: date,
        venue: v.name,
        town: v.town || prev.town || "",
        postcode: prev.postcode || "",
        start: start,
        finish: finish,
        status: "booked",
        source: "board",
        note: prev.note || ""
      };
    });
    return Object.keys(by).sort().map(function (k) { return by[k]; });
  }

  function fmtGigDay(date) {
    var p = String(date || "").split("-");
    if (p.length !== 3) return date;
    var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    var dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
    var mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
    return dow + " " + d.getDate() + " " + mon + " " + d.getFullYear();
  }

  function gigLine(g) {
    if (g.status === "held") return "Held — don’t offer this date";
    var bits = [g.venue];
    if (g.town) bits.push(g.town);
    if (g.postcode) bits.push(g.postcode);
    if (g.start && g.finish) bits.push(g.start + "–" + g.finish);
    else if (g.start) bits.push(g.start);
    if (g.note) bits.push(g.note);
    return bits.filter(Boolean).join(" · ");
  }

  function renderDiary() {
    var el = $("diary");
    if (!el) return;
    if (!diaryOpen) {
      el.className = "";
      el.innerHTML = "";
      return;
    }
    el.className = "show";
    var gigs = mergeDiary(GIGS, VENUES);
    var y = diaryYear, m = diaryMonth;
    var first = new Date(y, m, 1);
    var pad = (first.getDay() + 6) % 7;
    var nDays = new Date(y, m + 1, 0).getDate();
    var today = todayIso();
    var by = {};
    gigs.forEach(function (g) { by[g.date] = g; });
    var prefix = y + "-" + String(m + 1).padStart(2, "0");
    var monthList = gigs.filter(function (g) { return g.date.slice(0, 7) === prefix; });
    var title = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][m] + " " + y;
    var cells = "";
    var i, d, date, g, cls;
    for (i = 0; i < pad; i++) cells += '<div class="cal-day empty"></div>';
    for (d = 1; d <= nDays; d++) {
      date = prefix + "-" + String(d).padStart(2, "0");
      g = by[date];
      cls = "cal-day";
      if (g && g.status === "held") cls += " held";
      else if (g) cls += " booked";
      if (date === today) cls += " today";
      if (date < today) cls += " past";
      if (diaryPick === date) cls += " pick";
      cells += '<button type="button" class="' + cls + '" onclick="natDiaryPick(\'' + date + "')\">" + d + (g ? '<i class="cal-dot"></i>' : "") + "</button>";
    }
    var pick = diaryPick && by[diaryPick];
    var check = "";
    if (diaryPick) {
      if (pick && pick.status === "held") {
        check = '<div class="diary-check held"><span>' + esc(fmtGigDay(diaryPick)) + "</span><b>HELD</b><p>" + esc(gigLine(pick)) + "</p></div>";
      } else if (pick) {
        check = '<div class="diary-check taken"><span>' + esc(fmtGigDay(diaryPick)) + "</span><b>TAKEN</b><p>" + esc(gigLine(pick)) + "</p></div>";
      } else {
        check = '<div class="diary-check free"><span>' + esc(fmtGigDay(diaryPick)) + "</span><b>FREE</b><p>Jake is free. You can offer this date.</p></div>";
      }
    }
    var list = monthList.map(function (row) {
      return '<div class="diary-gig ' + row.status + '"><span>' + esc(fmtGigDay(row.date)) + "</span><p>" + esc(gigLine(row)) + "</p></div>";
    }).join("") || '<p class="empty">Nothing this month — those dates are free.</p>';
    var undated = (UNDATED || []).map(function (u) {
      return '<p class="diary-undated">' + esc(u.venue) + (u.note ? " · " + esc(u.note) : " · date TBC") + "</p>";
    }).join("");
    var bookedN = gigs.filter(function (row) { return row.status === "booked" && row.date >= today; }).length;
    var heldN = gigs.filter(function (row) { return row.status === "held" && row.date >= today; }).length;
    el.innerHTML =
      '<header class="diary-head"><button class="back" type="button" onclick="natDiaryClose()">Close <span>Jake’s diary</span></button></header>' +
      '<div class="panel">' +
      '<p class="kicker">2026 / 2027</p>' +
      "<h1>Jake’s diary</h1>" +
      '<p class="fact">' + bookedN + " booked · " + heldN + " held · from today. Held dates are blocked — don’t offer them.</p>" +
      '<label class="kicker" for="diary-date">Check a date</label>' +
      '<input id="diary-date" type="date" min="2026-09-01" max="2027-12-31" value="' + esc(diaryPick || today) + '" onchange="natDiaryPick(this.value)"/>' +
      check +
      "</div>" +
      '<div class="panel">' +
      '<div class="diary-nav">' +
      '<button class="btn" type="button" onclick="natDiaryMonth(-1)">‹</button>' +
      "<h2>" + esc(title) + "</h2>" +
      '<button class="btn" type="button" onclick="natDiaryMonth(1)">›</button>' +
      "</div>" +
      '<div class="cal-grid">' +
      '<span class="cal-dow">Mon</span><span class="cal-dow">Tue</span><span class="cal-dow">Wed</span><span class="cal-dow">Thu</span><span class="cal-dow">Fri</span><span class="cal-dow">Sat</span><span class="cal-dow">Sun</span>' +
      cells +
      "</div>" +
      '<p class="legend"><span class="booked">Booked</span><span class="held">Held — don’t offer</span><span>Blank is free</span></p>' +
      "</div>" +
      '<div class="panel"><p class="kicker">This month</p>' + list + undated + "</div>";
  }

  var PC_LL = {
    "BH10 7AR":[50.76756,-1.89535],"BH14 0BB":[50.72927,-1.94613],"BH23 3LY":[50.72968,-1.75475],
    "BR1 3NN":[51.40827,0.01713],"BR3 4PX":[51.4077,-0.04238],"CM16 7EY":[51.67199,0.10169],
    "CO3 4SA":[51.87308,0.86255],"CO9 1HT":[51.94367,0.63477],"CO9 2ET":[51.94248,0.648],
    "CR0 2UX":[51.38183,-0.10123],"DA1 1DZ":[51.44597,0.22017],"DA3 8BS":[51.38418,0.30357],
    "DA14 6PD":[51.4265,0.1029],"CM23 3BG":[51.8683,0.1605],
    "E1 0AF":[51.51086,-0.05116],"E15 4BQ":[51.54095,0.00272],"E2 0RY":[51.52935,-0.04538],
    "EN3 4LB":[51.64402,-0.04351],"EN4 8SY":[51.64183,-0.1626],"IG11 9SF":[51.53301,0.09853],
    "IG3 9AU":[51.54966,0.09303],"IG9 5BY":[51.62511,0.04464],"IP28 7EF":[52.3433,0.51059],
    "KT12 1JP":[51.3734,-0.41526],"ME12 4QP":[51.39509,0.92253],"ME15 6JN":[51.27236,0.52437],
    "ME20 6SA":[51.31053,0.44861],"ME3 9AA":[51.41998,0.56061],"ME5 0PA":[51.34596,0.52542],
    "PO21 4SY":[50.76742,-0.73855],"RM16 2AP":[51.49762,0.3292],"RM18 7BS":[51.46291,0.35397],
    "RM8 3JP":[51.55919,0.13664],"SE12 0PS":[51.44323,0.01476],"SE6 3DD":[51.43093,-0.01699],
    "SS11 8BB":[51.61369,0.5238],"SS15 5UH":[51.57191,0.43183],"SS17 7QT":[51.52443,0.45016],
    "SS17 9AA":[51.52659,0.45969],"SS7 2RF":[51.55375,0.6096],"SS8 8QW":[51.52414,0.60923],
    "SS8 9HB":[51.52209,0.58038],"TN27 9NL":[51.16792,0.62265],"UB6 9AR":[51.52381,-0.35306],
    "WD19 4BX":[51.64664,-0.37963]
  };
  var NAME_LL = [
    ["ecta",[51.94367,0.63477]],
    ["empire theatre",[51.94367,0.63477]],
    ["halstead rbl",[51.94248,0.648]],
    ["king edward",[51.54095,0.00272]],
    ["dartford mayor",[51.44597,0.22017]],
    ["greenford",[51.52381,-0.35306]],
    ["oxhey",[51.64664,-0.37963]],
    ["keyser",[51.64664,-0.37963]],
    ["hadleigh cons",[51.55375,0.6096]],
    ["east barnet",[51.64183,-0.1626]],
    ["walton cons",[51.3734,-0.41526]],
    ["bromley services",[51.40827,0.01713]],
    ["sidcup",[51.4265,0.1029]],
    ["stortford",[51.8683,0.1605]],
    ["walderslade",[51.343,0.526]],
    ["mildenhall",[52.3433,0.51059]],
    ["theydon",[51.67199,0.10169]],
    ["parkstone",[50.72927,-1.94613]],
    ["kinson",[50.76756,-1.89535]],
    ["mudeford",[50.72968,-1.75475]],
    ["tilbury",[51.46291,0.35397]],
    ["thurrock irish",[51.46291,0.35397]],
    ["shrub end",[51.87308,0.86255]],
    ["warm and toasty",[51.87308,0.86255]]
  ];
  var NAME_STOP = { club:1, social:1, the:1, and:1, conservative:1, cons:1, events:1, community:1, association:1, royal:1, british:1, legion:1, trades:1, labour:1, centre:1, center:1, house:1, from:1, with:1, that:1, this:1, night:1, nights:1, memory:1, afternoon:1, charity:1, tea:1 };

  function pcKey(pc) {
    return String(pc || "").toUpperCase().replace(/\s+/g, " ").trim();
  }
  function nameTokens(s) {
    return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(function (t) {
      return t.length >= 4 && !NAME_STOP[t];
    });
  }
  function namesClose(a, b) {
    var na = String(a || "").toLowerCase(), nb = String(b || "").toLowerCase();
    if (!na || !nb) return false;
    if (na === nb) return true;
    if (na.indexOf(nb) !== -1 || nb.indexOf(na) !== -1) return na.length > 10 || nb.length > 10;
    var ta = nameTokens(a), tb = nameTokens(b), hit = 0, i;
    if (!ta.length || !tb.length) return false;
    for (i = 0; i < ta.length; i++) if (tb.indexOf(ta[i]) !== -1) hit += 1;
    return hit >= 1 && (hit >= 2 || ta.length === 1 || tb.length === 1);
  }
  function parseIsoDay(date) {
    var p = String(date || "").split("-");
    if (p.length !== 3) return null;
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }
  function daysBetweenIso(date, today) {
    var a = parseIsoDay(date), b = parseIsoDay(today);
    if (!a || !b) return 0;
    return Math.round((a.getTime() - b.getTime()) / 864e5);
  }
  function untilInfo(show, today) {
    var n = daysBetweenIso(show.date, today);
    var hour = 20;
    if (show.start) {
      var h = Number(String(show.start).split(":")[0]);
      if (!isNaN(h)) hour = h;
    }
    if (n === 0) return { n: 0, label: hour < 17 ? "Today" : "Tonight", cls: "now" };
    if (n === 1) return { n: 1, label: "Tomorrow", cls: "soon" };
    if (n === -1) return { n: -1, label: "Yesterday", cls: "past" };
    if (n > 1) return { n: n, label: "In " + n + " days", cls: n <= 7 ? "soon" : n <= 31 ? "mid" : "later" };
    return { n: n, label: Math.abs(n) + " days ago", cls: "past" };
  }
  function shortDay(date) {
    var d = parseIsoDay(date);
    if (!d) return date;
    var dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
    var mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
    return dow + " " + d.getDate() + " " + mon;
  }
  function readGeo() {
    try { return JSON.parse(localStorage.getItem("nat-geo-v1") || "{}"); } catch (e) { return {}; }
  }
  function writeGeo(obj) {
    try { localStorage.setItem("nat-geo-v1", JSON.stringify(obj)); } catch (e) {}
  }
  function coordsFor(show, geo) {
    var pc = pcKey(show.postcode);
    if (pc && PC_LL[pc]) return PC_LL[pc];
    if (pc && geo && geo[pc]) return geo[pc];
    var name = String(show.venue || "").toLowerCase();
    var i;
    for (i = 0; i < NAME_LL.length; i++) {
      if (name.indexOf(NAME_LL[i][0]) !== -1) return NAME_LL[i][1];
    }
    var town = String(show.town || "").toLowerCase();
    for (i = 0; i < NAME_LL.length; i++) {
      if (town.indexOf(NAME_LL[i][0]) !== -1) return NAME_LL[i][1];
    }
    return null;
  }
  function bookedShows() {
    var list = [];
    function add(row) {
      if (!row || !row.date || !/^\d{4}-\d{2}-\d{2}$/.test(row.date) || !row.venue) return;
      var i, prev;
      for (i = 0; i < list.length; i++) {
        if (list[i].date === row.date && namesClose(list[i].venue, row.venue)) {
          prev = list[i];
          if (!prev.postcode && row.postcode) prev.postcode = row.postcode;
          if (!prev.town && row.town) prev.town = row.town;
          if (!prev.start && row.start) prev.start = row.start;
          if (!prev.finish && row.finish) prev.finish = row.finish;
          if (row.fee) prev.fee = row.fee;
          if (row.locked) prev.locked = true;
          if (row.venueId) prev.venueId = row.venueId;
          return;
        }
      }
      list.push({
        date: row.date,
        venue: row.venue,
        town: row.town || "",
        postcode: row.postcode || "",
        start: row.start || "",
        finish: row.finish || "",
        note: row.note || "",
        fee: row.fee || 0,
        nights: row.nights || 1,
        locked: !!row.locked,
        venueId: row.venueId || ""
      });
    }
    // Dates booked map = locked book only (the 25 nights). Never the Choice Live calendar.
    // Extra pins for a lock (Stortford 4, Kinson 2) come from OUR dates for that venue, not CL.
    (VENUES || []).forEach(function (v) {
      if (!B.isLockedRecord(v)) return;
      var lockDate = String(v.lockedDate || "").slice(0, 10);
      var rows = [];
      (GIGS || []).forEach(function (g) {
        if (!g || !g.venue || !g.date || g.status === "held") return;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(g.date)) return;
        if (!namesClose(g.venue, v.name)) return;
        var src = String(g.source || "").toLowerCase();
        if (src === "board" || g.date === lockDate) rows.push(g);
      });
      if (!rows.length && /^\d{4}-\d{2}-\d{2}$/.test(lockDate)) {
        rows.push({ date: lockDate, venue: v.name, town: v.town, postcode: v.postcode });
      }
      var fee = Number(v.lockedFee || 0) || 0;
      var nights = Number(v.lockedNights || 1) || 1;
      var split = rows.length > 1;
      var feeEach = split ? Math.round(fee / rows.length) : fee;
      var nightsEach = split ? 1 : nights;
      rows.forEach(function (g) {
        add({
          date: g.date,
          venue: v.name,
          town: v.town || g.town || "",
          postcode: v.postcode || g.postcode || "",
          start: g.start,
          finish: g.finish,
          note: g.note,
          fee: feeEach,
          nights: nightsEach,
          locked: true,
          venueId: v.id
        });
      });
    });
    list.sort(function (a, b) {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      return String(a.venue).localeCompare(String(b.venue));
    });
    list.forEach(function (s, i) { s.id = s.date + "-" + i; });
    return list;
  }
  function fillCoords(shows, done) {
    var geo = readGeo();
    var missing = [];
    var seen = {};
    shows.forEach(function (s) {
      s.ll = coordsFor(s, geo);
      var pc = pcKey(s.postcode);
      if (!s.ll && pc && !seen[pc]) { seen[pc] = 1; missing.push(pc); }
    });
    if (!missing.length) { done(); return; }
    fetch("https://api.postcodes.io/postcodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postcodes: missing.slice(0, 100) })
    }).then(function (r) { return r.json(); }).then(function (data) {
      (data.result || []).forEach(function (row) {
        if (row && row.result) geo[row.query] = [row.result.latitude, row.result.longitude];
      });
      writeGeo(geo);
      shows.forEach(function (s) { if (!s.ll) s.ll = coordsFor(s, geo); });
      done();
    }).catch(function () { done(); });
  }
  var leafletPromise = null;
  function loadLeaflet() {
    if (window.L) return Promise.resolve(window.L);
    if (leafletPromise) return leafletPromise;
    leafletPromise = new Promise(function (resolve, reject) {
      if (!document.getElementById("leaflet-css")) {
        var link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "vendor/leaflet/leaflet.css";
        document.head.appendChild(link);
      }
      var script = document.createElement("script");
      script.src = "vendor/leaflet/leaflet.js";
      script.async = true;
      script.onload = function () { if (window.L) resolve(window.L); else reject(new Error("leaflet")); };
      script.onerror = function () { reject(new Error("leaflet")); };
      document.head.appendChild(script);
    });
    return leafletPromise;
  }
  function destroyDatesMap() {
    if (datesMap) {
      try { datesMap.remove(); } catch (e) {}
    }
    datesMap = null;
    datesMarkers = {};
  }
  function flyDatesPin(id) {
    var m = datesMarkers[id];
    var k;
    if (!datesMap || !m) return;
    datesMap.setView(m.getLatLng(), 11, { animate: true });
    for (k in datesMarkers) {
      if (!Object.prototype.hasOwnProperty.call(datesMarkers, k)) continue;
      var el = datesMarkers[k]._icon;
      if (!el) continue;
      if (k === id) el.classList.add("on");
      else el.classList.remove("on");
    }
  }
  function paintDatesMap(shows, today) {
    var hold = $("dates-map");
    var msg = $("dates-map-msg");
    if (!hold) return;
    var upcoming = shows.filter(function (s) { return s.date >= today && s.ll; });
    var pins = upcoming.length ? upcoming : shows.filter(function (s) { return s.ll; });
    if (!pins.length) {
      if (msg) msg.textContent = "No pins yet — list below still has every date.";
      return;
    }
    loadLeaflet().then(function (L) {
      if (!datesOpen || !$("dates-map")) return;
      destroyDatesMap();
      var map = L.map(hold, { scrollWheelZoom: false, attributionControl: true, zoomControl: true });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OpenStreetMap &copy; CARTO",
        subdomains: "abcd",
        maxZoom: 18
      }).addTo(map);
      var next = upcoming[0] || pins[0];
      datesMarkers = {};
      pins.forEach(function (s) {
        var isNext = next && s.id === next.id;
        var icon = L.divIcon({
          className: "pin" + (isNext ? " next" : ""),
          html: "<i></i>",
          iconSize: isNext ? [18, 18] : [18, 18],
          iconAnchor: [9, 9]
        });
        var mk = L.marker(s.ll, { icon: icon, keyboard: false });
        var until = untilInfo(s, today);
        mk.bindTooltip(s.venue + "<br>" + until.label + " · " + shortDay(s.date), {
          direction: "top",
          opacity: 1,
          className: "dates-tip"
        });
        mk.on("click", function () { window.natDatesPick(s.id); });
        mk.addTo(map);
        datesMarkers[s.id] = mk;
      });
      var bounds = L.latLngBounds(pins.map(function (s) { return s.ll; }));
      var frame = function () {
        map.invalidateSize();
        if (pins.length === 1) map.setView(pins[0].ll, 11);
        else map.fitBounds(bounds, { padding: [36, 36], maxZoom: 10 });
      };
      requestAnimationFrame(frame);
      setTimeout(frame, 160);
      datesMap = map;
      if (msg) { msg.textContent = ""; msg.style.display = "none"; }
    }).catch(function () {
      if (msg) msg.textContent = "Map needs a signal — list below still works.";
    });
  }
  function dateRowHtml(s, today) {
    var until = untilInfo(s, today);
    var bits = [];
    if (s.town) bits.push(s.town);
    if (s.postcode) bits.push(s.postcode);
    if (s.nights > 1) bits.push(s.nights + " nights");
    if (s.start && s.finish) bits.push(s.start + "–" + s.finish);
    else if (s.start) bits.push(s.start);
    var fee = s.fee ? '<span class="date-fee">' + B.gbp(s.fee) + "</span>" : "";
    var on = datesPick === s.id ? " on" : "";
    var past = until.n < 0 ? " past" : "";
    return '<button type="button" class="date-row until-' + until.cls + on + past + '" data-id="' + esc(s.id) + '" onclick="natDatesPick(\'' + esc(s.id) + "')\">" +
      '<span class="date-when"><b>' + esc(until.label) + "</b><span>" + esc(shortDay(s.date)) + "</span></span>" +
      '<span class="date-main"><span class="date-name">' + esc(s.venue) + '</span><span class="date-meta">' + esc(bits.join(" · ") || (s.locked ? "Locked" : "Booked")) + "</span></span>" +
      fee + "</button>";
  }
  function renderDates() {
    var el = $("dates");
    if (!el) return;
    if (!datesOpen) {
      destroyDatesMap();
      el.className = "";
      el.innerHTML = "";
      return;
    }
    var today = todayIso();
    var shows = bookedShows();
    var geo = readGeo();
    shows.forEach(function (s) { s.ll = coordsFor(s, geo); });
    var upcoming = shows.filter(function (s) { return s.date >= today; });
    var past = shows.filter(function (s) { return s.date < today; });
    var stats = B.lockedCash(VENUES);
    var next = upcoming[0];
    var nextCard = "";
    if (next) {
      var u = untilInfo(next, today);
      nextCard = '<button type="button" class="dates-next" onclick="natDatesPick(\'' + esc(next.id) + "')\"><span>Next up · " + esc(u.label.toLowerCase()) + "</span><b>" + esc(next.venue) + "</b><em>" +
        esc(shortDay(next.date)) + (next.town ? " · " + esc(next.town) : "") + (next.start ? " · " + esc(next.start) : "") + "</em></button>";
    }
    var heldN = (GIGS || []).filter(function (g) {
      return g && g.status === "held" && g.date >= today && !shows.some(function (s) { return s.date === g.date; });
    }).length;
    var undatedHtml = (UNDATED || []).filter(function (u) {
      return !shows.some(function (s) { return namesClose(s.venue, u.venue); });
    }).map(function (u) {
      return '<p class="dates-pend">' + esc(u.venue) + (u.note ? " · " + esc(u.note) : " · date TBC") + "</p>";
    }).join("");
    var pendingHtml = (stats.pending || []).map(function (p) {
      return '<p class="dates-pend">' + esc(p.name) + " not counted until a date is locked — " + B.gbp(p.fee) + " if she does.</p>";
    }).join("");
    var heldHtml = heldN ? '<p class="dates-held">' + heldN + " held date" + (heldN === 1 ? "" : "s") + " blocked in the diary — not on this map.</p>" : "";
    var listUp = upcoming.map(function (s) { return dateRowHtml(s, today); }).join("") ||
      '<p class="empty">No upcoming performing dates on the book.</p>';
    var listPast = past.length
      ? '<p class="dates-kicker">Already sung · ' + past.length + "</p>" + past.map(function (s) { return dateRowHtml(s, today); }).join("")
      : "";
    var onMap = upcoming.filter(function (s) { return s.ll; }).length;
    var stamp = [upcoming.length, shows.length, stats.cash, stats.nights, next && next.id].join("|");
    if (el.className === "show" && el.getAttribute("data-stamp") === stamp && datesMap) return;
    destroyDatesMap();
    el.className = "show";
    el.setAttribute("data-stamp", stamp);
    el.innerHTML =
      '<header class="dates-head"><button class="back" type="button" onclick="natDatesClose()">Close <span>Dates booked</span></button>' +
      "<h1>Dates booked</h1>" +
      '<p class="dates-sub"><b>' + B.gbp(stats.cash) + "</b> locked · " + stats.nights + " night" + (stats.nights === 1 ? "" : "s") +
      " · " + B.gbp(stats.cash) + " of £10k · " + stats.nights + " nights we’ve closed</p></header>" +
      '<div class="dates-map-wrap"><div id="dates-map"></div><p class="dates-map-msg" id="dates-map-msg">Loading the map…</p>' + nextCard + "</div>" +
      '<div class="dates-list"><p class="dates-kicker">Coming up · ' + upcoming.length + (onMap ? " · " + onMap + " on the map" : "") + "</p>" +
      listUp + heldHtml + undatedHtml + pendingHtml + listPast + "</div>";
    fillCoords(shows, function () {
      if (!datesOpen) return;
      paintDatesMap(shows, today);
    });
  }

  function searching() { return !!(q && String(q).trim()); }

  function groupKey(row, filterName) {
    return B.deskGroupKey(row, filterName, searching());
  }

  function groupLabelFor(row, filterName) {
    return B.deskGroupLabel(groupKey(row, filterName), filterName, searching());
  }

  function rowHtml(row) {
    var v = row.venue;
    var bits = [];
    if (v.town) bits.push(v.town);
    if (row.who) bits.push(row.who);
    if (row.desk === "silent" && row.daysSilent != null) bits.push(row.daysSilent + "d silent");
    else if (row.desk !== "booked" && row.desk !== "no") bits.push(B.lastTouchLabel(row));
    var called = B.lastCalledLabel(NOTES[v.id]);
    if (called) bits.push(called);
    var quiet = row.followState === "due" || row.stale;
    var fee = (row.fee && row.desk === "booked") ? '<span class="row-fee">' + B.gbp(row.fee) + "</span>" : "";
    var why = laneWhyHtml(v, row);
    var follow = followChip(row.followState);
    var followHtml = follow ? '<span class="badge follow ' + row.followState + '">' + follow + "</span>" : "";
    var rail = " desk-" + (row.desk || "no") + (row.followState === "due" ? " due" : "");
    return '<button type="button" class="job' + (quiet ? " hot" : "") + rail + '" onclick="natOpen(\'' + esc(v.id) + "')\">" +
      '<span class="job-main"><span class="job-name">' + esc(v.name) + '</span><span class="job-meta">' + esc(bits.join(" · ") || "Tap to open") + "</span>" + (why || "") + "</span>" +
      fee +
      '<span class="job-badges">' + followHtml + '<span class="badge ' + (row.desk || "") + '">' + chip(row.desk) + "</span></span>" +
      '<span class="chev">›</span></button>';
  }

  function listHtml(list) {
    if (!list.length) return '<p class="empty">Nothing in this list</p>';
    var html = '<div class="joblist">';
    var counts = {};
    list.forEach(function (r) {
      var k = groupKey(r, filter);
      counts[k] = (counts[k] || 0) + 1;
    });
    var prev = null;
    list.forEach(function (r) {
      var k = groupKey(r, filter);
      if (!prev || groupKey(prev, filter) !== k) {
        var gcls = k === "due" ? " group-due" : (k === "call" || k === "booked" ? " group-call" : (k === "fresh" ? " group-latest" : ""));
        html += '<p class="group' + gcls + '">' + groupLabelFor(r, filter) + " · " + counts[k] + "</p>";
      }
      html += rowHtml(r);
      prev = r;
    });
    html += "</div>";
    return html;
  }

  function cashHtml(stats) {
    var goal = B.cashTarget(stats);
    return '<button class="cash-ticker" type="button" onclick="natCash()" aria-label="Dates booked">' +
      '<span class="cash-amt">' + B.gbp(stats.cash) + "</span>" +
      '<span class="cash-meta">' + stats.nights + " night" + (stats.nights === 1 ? "" : "s") + " · of £10k</span></button>" +
      '<div class="cash-goal" aria-label="Ten thousand target">' +
        '<div class="cash-bar"><i style="width:' + goal.pct + '%"></i></div>' +
        '<div class="cash-goal-meta"><span>' + B.gbp(stats.cash) + " of £10k</span><span>" + B.gbp(goal.left) + " to go</span></div>" +
      "</div>";
  }

  function renderList() {
    var rowsAll = ranked();
    var counts = B.filterCounts(rowsAll);
    var stats = B.lockedCash(VENUES);
    var alarm = B.chaseAlarm(rowsAll);
    var pep = B.pepLine(rowsAll);
    var tabs = B.BOARD_FILTERS;
    var tabHtml = tabs.map(function (t) {
      var on = (filter === t.id && !searching()) ? " on desk-" + t.id : " desk-" + t.id;
      var warn = t.id === "call" && alarm ? " warn" : "";
      return '<button type="button" class="' + on + warn + '" onclick="natFilter(\'' + t.id + "')\"><b>" + counts[t.id] + "</b><span>" + t.label + "</span></button>";
    }).join("");
    var list = searching()
      ? B.sortDeskAll(rowsAll.filter(function (r) { return B.matchesQuery(r.venue, q); }))
      : B.rowsForFilter(rowsAll, filter);
    var label = searching() ? "Search" : ((tabs.find(function (t) { return t.id === filter; }) || { label: "Call" }).label);
    var banner = searching() ? "" : '<p class="desk-note">' + esc(B.deskBanner(filter)) + "</p>";
    var cards = banner + listHtml(list);
    $("cash-slot").innerHTML = cashHtml(stats);
    $("pep").textContent = pep;
    $("filters").innerHTML = tabHtml;
    $("count").textContent = list.length + " job" + (list.length === 1 ? "" : "s") + " · " + label + (filter === "call" && alarm ? " · quiet alarm" : "");
    $("list").innerHTML = cards;
    $("sync").textContent = sharedOk ? "Notes live with Jake" : "Board live";
    [["cash-amt", "cash-meta"], ["cash-amt-app", "cash-meta-app"]].forEach(function (ids) {
      if ($(ids[0])) $(ids[0]).textContent = B.gbp(stats.cash);
      if ($(ids[1])) $(ids[1]).textContent = stats.nights + " night" + (stats.nights === 1 ? "" : "s") + " locked";
    });
  }

  function renderDetail(id) {
    var row = ranked().find(function (r) { return r.venue.id === id; });
    if (!row) return;
    var v = row.venue;
    var rec = window.NatNotes.recordOf(NOTES, id);
    var thread = (v.messages || []).filter(function (m) { return m.side === "us" || m.side === "them"; });
    var notesHtml = (rec.entries || []).map(function (entry, i) {
      return '<div class="bubble note"><div class="side">Note</div><p class="meta">' + esc(B.fmtWhen(entry.at)) +
        "</p><pre>" + esc(entry.text || "") + '</pre><button class="lock" type="button" onclick="natDelNote(\'' +
        esc(id) + "', " + i + ')">Delete note</button></div>';
    }).join("") || '<p class="email">No notes yet.</p>';
    var bubbles = emailsOpen
      ? (thread.length
          ? thread.map(function (m, i) {
              return '<div class="bubble ' + (m.side === "them" ? "them" : "us") + '"><div class="side">' +
                (m.side === "them" ? "THEM · venue" : "US · Natalie / Jake") + " · " + (i + 1) + "/" + thread.length +
                '</div><p class="meta">' + esc(m.label || "") + (m.at ? " · " + esc(B.fmtWhen(m.at)) : "") + "</p>" +
                (m.from ? '<p class="meta">' + esc(m.from) + "</p>" : "") +
                (m.subject ? '<p class="replied">' + esc(m.subject) + "</p>" : "") +
                "<pre>" + esc(m.body || "") + "</pre></div>";
            }).join("")
          : '<p class="replied">No reply yet</p>')
      : "";
    var money = moneyLabel(row);
    var whoPrompt = row.who ? "" :
      '<div class="need"><p>Who’s the booker?</p><input id="who-name" placeholder="First name"/><button class="primary" type="button" onclick="natSaveWho(\'' + esc(id) + "')\">Save</button></div>";
    var sheet = sheetOpen
      ? '<div class="sheet" onclick="if(event.target===this)natSheet(false)"><div class="sheetbox">' +
        "<h2>What happened?</h2>" +
        '<div class="acts">' +
        '<button class="btn call" type="button" onclick="document.getElementById(\'book-fee\').focus()">Booked</button>' +
        '<button class="btn gold" type="button" onclick="natAfter(\'' + esc(id) + "', 'confirm')\">They’ll confirm</button>" +
        '<button class="btn" type="button" onclick="natAfter(\'' + esc(id) + "', 'voicemail')\">Voicemail</button>" +
        '<button class="btn" type="button" onclick="natAfter(\'' + esc(id) + "', 'dead')\">Dead</button></div>" +
        '<p class="meta">Booked — fee + date (not in the ticker until Jake locks the record)</p>' +
        '<div class="rowbtns"><input id="book-fee" inputmode="numeric" placeholder="£"/><input id="book-date" placeholder="Sat 17 Oct"/></div>' +
        '<button class="btn call" type="button" onclick="natAfter(\'' + esc(id) + "', 'booked')\">Save booked</button>" +
        "</div></div>"
      : "";
    $("detail").innerHTML =
      "<header class='thin'><button class='back' type='button' onclick='natBack()'>Back <span>" + esc(v.name) + "</span></button></header>" +
      '<div class="panel">' +
      "<h1>" + esc(v.name) + "</h1>" +
      (v.town ? '<p class="town">' + esc(v.town) + "</p>" : "") +
      '<span class="job-badges detail-badges">' + (followChip(row.followState) ? '<span class="badge follow ' + row.followState + '">' + followChip(row.followState) + "</span>" : "") + '<span class="badge ' + (row.desk || "") + '">' + chip(row.desk) + "</span></span>" +
      laneWhyHtml(v, row) +
      (row.who ? '<p class="who">Who · ' + esc(row.who) + "</p>" : "") +
      '<p class="say"><span>Say this</span>' + esc(row.sayThis) + "</p>" +
      (row.factLine ? '<p class="fact"><span>On file</span>' + esc(row.factLine) + "</p>" : "") +
      actions(row) +
      (money ? '<p class="money">' + esc(money) + "</p>" : "") +
      "</div>" +
      '<div class="panel"><p class="kicker">Notes first</p>' + whoPrompt + notesHtml +
      '<button class="callbtn" type="button" onclick="natSheet(true)">Called</button>' +
      '<textarea id="detail-note" rows="3" placeholder="type here"></textarea>' +
      '<button class="primary" type="button" onclick="natSaveNote(\'' + esc(id) + "')\">Save note</button>" +
      (rec.dropped
        ? '<button class="openbtn" type="button" onclick="natDrop(\'' + esc(id) + "', false)\">Put back on the list</button>"
        : '<button class="openbtn" type="button" onclick="natDrop(\'' + esc(id) + "', true)\">Drop — not interested</button>") +
      "</div>" +
      '<div class="panel"><button class="openbtn" type="button" onclick="natEmails()">Emails · ' + thread.length + " on file</button>" +
      bubbles + "</div>" + sheet;
  }

  function render() {
    try { B.lockedCash(VENUES); } catch (e) {}
    if (datesOpen) {
      if ($("detail")) $("detail").className = "";
      if ($("app")) $("app").classList.add("show");
      renderDates();
      return;
    }
    if (openId) {
      $("app").classList.remove("show");
      $("detail").className = "show";
      renderDetail(openId);
    } else {
      $("detail").className = "";
      $("app").classList.add("show");
      renderList();
    }
    renderDiary();
    renderDates();
  }

  loadVenues();
  loadGigs();
  NOTES = window.NatNotes.readLocal();
  window.NatNotes.pullRemote().then(function (res) {
    NOTES = res.store;
    sharedOk = res.shared;
    if ($("app").classList.contains("show")) render();
  });
  setInterval(function () {
    if (!$("app").classList.contains("show")) return;
    window.NatNotes.pullRemote().then(function (res) {
      NOTES = res.store;
      sharedOk = res.shared;
      if (!openId) render();
    });
  }, 20000);
  setInterval(function () {
    if (!$("app").classList.contains("show")) return;
    loadVenues();
  }, 60000);
  $("go").onclick = unlock;
  $("pw").addEventListener("keydown", function (e) { if (e.key === "Enter") unlock(); });
  $("q").addEventListener("input", function (e) { q = e.target.value; render(); });
  try { if (sessionStorage.getItem("natalie-ok") === "1") openBoard(); } catch (e) {}
})();
