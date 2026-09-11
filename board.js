var Board = (function(exports) {
	Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
	//#region src/lib/board/pipeline.ts
	const BOARD_VERSION = "v20";
	const BOARD_STAMP = "10 Sep 2026";
	const PASSWORD = "natbooksjake";
	const BOARD_FILTERS = [
		{
			id: "all",
			label: "All"
		},
		{
			id: "replied",
			label: "Replied"
		},
		{
			id: "closed",
			label: "Closed"
		},
		{
			id: "inactive",
			label: "Inactive"
		}
	];
	const DAY = 864e5;
	const STOCK_US = [
		"lock it in",
		"lock that date",
		"reply here",
		"pa included",
		"no deposit",
		"2 × 45",
		"3 × 45",
		"2 x 45",
		"3 x 45",
		"www.jakeessex.co.uk",
		"instagram.com/jakeessexmusic"
	];
	const NAME_BLOCK = new Set([
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
	].map((s) => s.toLowerCase()));
	const AUTO_RE = /undeliver|mailer-daemon|delivery failed|mailbox unavailable|address rejected|address not found|out of office|automatic reply|auto[- ]?reply|office is now closed|i am (currently )?out of (the )?office/i;
	const HARD_NO_RE = /not interested|no thank you|no thanks\b|too expensive|price too high|we('ll| will) pass|not for us|don'?t pay (bands|artists?|out)|do not pay|no short-term requirements|keep (your )?details on file|keep it on(?:ly)? file|white suit|tribute only|impersonator only/i;
	const FULLY_BOOKED_RE = /fully booked|already booked for 2026 and 2027|bookings for the year for 2027|no dates (left|available)/i;
	const ALTERNATIVE_RE = /\b(but|however|could|squeeze|sunday|cancellation|2027|looking at|hear from me|keep him in mind)\b/i;
	const CLOSE_YES_RE = /\b(book him|put him in|that works|we('ll| will) book|you('re| are) booked|lock (it|that|the) (in|date))\b/i;
	const WAITING_RE = /\b(committee|put (it|this|your email) forward|i('m| am) away|on my return|when i.?m back|next (two|2) months|concentrating on|come to (the )?restaurant|pop in|i('ll| will) (check|get back|send|give you)|will check the diary|give you some dates|discuss with|next meeting|be in touch|meeting on (mon|tues|wednes|thurs|fri)day)\b/i;
	const DATE_ASK_RE = /\b(\d{1,2}[\/\-]\d{1,2}([\/\-]\d{2,4})?|\d{1,2}(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*|remembrance|\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b.{0,24}\d{4})\b/i;
	const FEE_ASK_RE = /\b(how much|what (would|do) you charge|what(?:'s| is) the (fee|cost|rate)|charges?|fees?|rates?|costing|quote|price|what would the fee)\b/i;
	const POSTER_RE = /\b(poster|flyers?|artwork)\b/i;
	/** They asked for dates / want to book — Close, even if a committee or “I’ll send dates” is in the way. */
	const DATE_TALK_RE = /\b(interested in booking|discuss possible dates|send me (through )?(some )?(saturdays|dates)|a date in 20\d\d|open to getting jake booked|give you some dates|dates that you have available|possible dates)\b/i;
	const AGREE_FEE_RE = /(?:for|do|it['’]s|it is|that['’]s|that is|at)\s*£\s*(\d{2,4})|£\s*(\d{2,4})\s*(?:cash|confirmed|locked)/i;
	const ON_FILE_RE = /future reference|on file|have your details|you may be hearing from me|as i have your details|keep (your|him|this|it) (details )?on file|for later/i;
	const DISTANCE_RE = /too far|a bit far|far for him to travel/i;
	const NAMED_DATE_RE = /\b\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i;
	const CASH_LOCK_RE = /will be the cash|the cash one|juggle some things/i;
	const MEET_RE = /come to (the )?restaurant|come down and (we )?talk|we talk about/i;
	const DEFINITE_RE = /definitely (be )?(interested|open)|would definitely|love the sound of jake/i;
	const SUNDAY_IN_RE = /squeeze in a sunday|sunday afternoon/i;
	const FORWARDED_RE = /forwarded your email|please contact him|onto peter/i;
	const WORKING_TABS = [
		"close",
		"live",
		"chase",
		"call",
		"locked"
	];
	const OPEN_TABS = [
		"close",
		"live",
		"chase",
		"call"
	];
	function parseWhen(raw) {
		if (!raw) return null;
		const n = Date.parse(raw);
		if (!Number.isNaN(n)) return new Date(n);
		const m = String(raw).match(/(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/i);
		if (!m) return null;
		return new Date(+m[3], {
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
		}[m[2].slice(0, 3).toLowerCase()] ?? 0, +m[1]);
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
		return String(venue.phone || "").replace(/\D/g, "").length >= 10;
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
		if (note?.contactName && plausibleName(note.contactName.split(" ")[0] || "")) return note.contactName.split(" ")[0];
		if (venue.contactName && plausibleName(venue.contactName.split(" ")[0] || "")) return venue.contactName.split(" ")[0];
		const email = venue.email || "";
		const named = email.match(/^([A-Za-z][A-Za-z'-]+)\s+[A-Za-z][^<]*</);
		if (named && plausibleName(named[1])) return titleName(named[1]);
		const first = email.match(/^([A-Za-z][A-Za-z'-]+)\s*</);
		if (first && plausibleName(first[1])) return titleName(first[1]);
		const inbound = realInbound(venue);
		for (let i = inbound.length - 1; i >= 0; i--) {
			const lines = (inbound[i].body || "").split(/\n/).map((l) => l.trim()).filter(Boolean);
			for (const line of [...lines].reverse().slice(0, 10)) {
				if (/^(thanks|thank you|cheers|regards|kind regards|many thanks|sent from|best regards)\b/i.test(line)) continue;
				if (/^(hi|hello|good morning|good evening)\b/i.test(line)) continue;
				if (/\b(road|street|lane|hall|club|legion|avenue|close|drive|whitton|secretary|branch)\b/i.test(line)) continue;
				if (venue.name) {
					if (venue.name.toLowerCase().split(/[^a-z]+/).filter(Boolean).includes(line.toLowerCase())) continue;
				}
				if (venue.town && venue.town.toLowerCase() === line.toLowerCase()) continue;
				if (venue.name && line.toLowerCase().includes(venue.name.split(/\s+/)[0].toLowerCase()) && line.split(/\s+/).length > 2) continue;
				const one = line.match(/^([A-Z][a-z]{2,13})$/);
				if (one && plausibleName(one[1])) return one[1];
				const two = line.match(/^([A-Z][a-z]{2,13})\s+[A-Z][a-z]+/);
				if (two && plausibleName(two[1])) return two[1];
			}
		}
		const replied = venue.replied || "";
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
		const urls = `${venue.email || ""}\n${(venue.messages || []).filter((m) => m.side === "them").map((m) => m.body || "").join("\n")}`.match(/https?:\/\/[^\s<>")']+/gi) || [];
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
		const body = inbound[inbound.length - 1].body || "";
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
		const days = daysBetween(parseWhen(note.updatedAt || note.calledAt || null), now);
		return days != null && days <= 21;
	}
	function isDropped(note) {
		if (!note) return false;
		if (note.dropped) return true;
		if (note.outcome === "dead") return true;
		return false;
	}
	const DUPLICATE_PARK_IDS = new Set([
		"greenford-conservative-club" // same thread as greenford-conservative-club-john-mitchell
	]);
	function classifyVenue({ venue, note, now = /* @__PURE__ */ new Date() }) {
		const thread = cleanThread(venue);
		const inbound = realInbound(venue);
		const last = lastOf(thread);
		const lastIn = inbound[inbound.length - 1] || null;
		const lastSide = last?.side || null;
		const daysSinceInbound = daysBetween(parseWhen(lastIn?.at), now);
		const lastAt = parseWhen(last?.at);
		const daysSilent = lastSide === "us" ? daysSinceInbound : daysBetween(lastAt, now);
		const stale = daysSinceInbound != null && daysSinceInbound >= 14;
		if (DUPLICATE_PARK_IDS.has(String(venue.id || ""))) return {
			tab: "parked",
			reason: "duplicate thread",
			stale: false,
			daysSinceInbound,
			daysSilent,
			lastSide
		};
		if (isLockedRecord(venue)) return {
			tab: "locked",
			reason: "locked fee on file",
			stale: false,
			daysSinceInbound,
			daysSilent,
			lastSide
		};
		if (isDropped(note) || parkedBadge(venue) || inboundLooksHardNo(venue)) {
			let reason = "parked";
			if (isDropped(note)) reason = "dropped";
			else if (String(venue.badge) === "bounce") reason = "bounce";
			else if (inboundLooksHardNo(venue)) reason = "hard no";
			else reason = String(venue.badge || "parked");
			return {
				tab: "parked",
				reason,
				stale: false,
				daysSinceInbound,
				daysSilent,
				lastSide
			};
		}
		const who = extractWho(venue, note);
		let closeReason = null;
		const canClose = hasPhone(venue) || Number(venue.pendingLockFee || 0) > 0;
		if (Number(venue.pendingLockFee || 0) > 0 && !inboundLooksHardNo(venue)) closeReason = "fee agreed — lock a date on this call";
		if (noteIsBooked(note, now) && !isLockedRecord(venue)) closeReason = closeReason || "nat marked booked — not in the pot yet";
		if (lastIn && !inboundLooksHardNo(venue) && canClose) {
			if (lastInboundOffersClose(lastIn) && (askedFee(lastIn) ? !!who : true)) closeReason = closeReason || (askedFee(lastIn) ? "asked the fee — close it on the phone" : "asked for dates — close it on the phone");
		}
		if (closeReason) return {
			tab: "close",
			reason: closeReason,
			stale,
			daysSinceInbound,
			daysSilent,
			lastSide
		};
		const quietAfterUs = lastSide === "us" && inbound.length > 0 && daysSinceInbound != null && daysSinceInbound >= 5;
		if (inbound.length && daysSinceInbound != null && daysSinceInbound <= 21 && !quietAfterUs) return {
			tab: "live",
			reason: "real conversation",
			stale,
			daysSinceInbound,
			daysSilent,
			lastSide
		};
		if (quietAfterUs) return {
			tab: "chase",
			reason: `${daysSinceInbound} days quiet`,
			stale,
			daysSinceInbound,
			daysSilent: daysSinceInbound,
			lastSide
		};
		if (hasPhone(venue)) return {
			tab: "call",
			reason: "phone on file",
			stale: false,
			daysSinceInbound,
			daysSilent,
			lastSide
		};
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
		const feeTalk = fee ? ` The fee on the thread is £${fee} cash.` : "";
		if (venue.id === "east-barnet-rbl-club") {
			if (tab === "locked") return `Already locked Sat 4 Dec 2027, £275. Don’t ring unless Tina calls you.`;
			return `Hi Tina, Natalie for Jake Essex. You asked about 2 × 60 with his PA — that's £275 cash, no deposit. Have you got a Saturday in 2027?`;
		}
		if (venue.id === "corner-club-canvey") return `Hi Maxine, Natalie for Jake Essex. Sunday afternoon we can do. 2 × 45 is £250, 3 × 45 is £375, own PA. Shall I hold a Sunday?`;
		if (venue.id === "bird-in-hand") return `Hi Alison, Natalie for Jake Essex. You said you’d send dates when you were back — have you had a look?`;
		if (venue.id === "sedir") return `Hi Ahmet, Natalie for Jake Essex. You asked Jake to come to the restaurant. When should he pop in?`;
		if (venue.id === "the-muddy-duck") return `Hi Jaela, Natalie for Jake Essex. You wanted rates — 2 × 45 is £250 cash, own PA. When those next two months clear, shall I hold a Saturday?`;
		if (venue.id === "broomfield-rbl") return `Hi Siobhan, Natalie for Jake Essex. Did the committee pick a Saturday?`;
		if (venue.id === "st-neots-cons") return `Hi Christine, Natalie for Jake Essex. Did the committee want Jake for a Saturday?`;
		if (venue.id === "hounslow-rbl") return `Hi Mick, Natalie for Jake Essex. Did September’s committee pick a date?`;
		if (venue.id === "greenford-conservative-club-john-mitchell" || venue.id === "greenford-conservative-club") return `Hi John, Natalie for Jake Essex. You wanted a 2027 date — shall we pick one now?`;
		if (venue.id === "aldridge-social-club") return `Hi Dayn, Natalie for Jake Essex. You were looking at 2027 — have you got a Saturday?`;
		if (venue.id === "berkhamsted-social-club") return `Hi Keith, Natalie for Jake Essex. You asked for contact details — have you got a date in mind?`;
		if (tab === "close") return `Hi ${name}, Natalie for Jake Essex. Can we lock a date on this call?${feeTalk}`;
		if (tab === "live") return `Hi ${name}, Natalie for Jake Essex. Just picking up the thread — have you got a date for Jake?`;
		if (tab === "chase") return `Hi ${name}, Natalie for Jake Essex. You went quiet on me. Shall we pick a date now?`;
		if (tab === "call") return `Hi, Natalie for Jake Essex — live 50s to 70s, own PA. Have you got a Saturday this year or 2027?`;
		if (tab === "locked") return fee ? `Already locked £${fee}. Don’t ring unless they call you.` : `Already locked. Don’t ring unless they call you.`;
		return `Parked. Don’t spend the night here.`;
	}
	function factLine(venue) {
		const fee = displayFee(venue);
		const known = {
			"east-barnet-rbl-club": "Locked Sat 4 Dec 2027. 2 × 60, own PA, 8.30pm. £275 on the thread. 38 Brookhill Rd EN4 8SL.",
			"corner-club-canvey": "Saturdays full. Sunday afternoon possible. She asked how much.",
			"bird-in-hand": "Alison is away. Said she’ll send dates when she’s back.",
			"sedir": "Ahmet wants Jake in the restaurant to talk.",
			"the-muddy-duck": "Jaela loves the act. Busy the next two months. Asked for rates.",
			"broomfield-rbl": "Siobhan took Saturdays to the committee.",
			"st-neots-cons": "Christine asked a Saturday costing for the committee.",
			"hounslow-rbl": "Mick put it to the September committee.",
			"greenford-conservative-club-john-mitchell": "John wants a 2027 date. Quiet since late August.",
			"aldridge-social-club": "Dayn said 2026 is full. Looking at 2027.",
			"berkhamsted-social-club": "Keith asked for contact details for later.",
			"halstead-rbl": "Locked Sat 17 Jul 2027. £250 on the thread.",
			"hadleigh-cons": "Locked 13 Nov 2027, 3 × 45. £250 on the thread.",
			"dartford-mayor-charity-tea": "Charity tea. £100 on the thread. Claire Tiltman Centre.",
			"oxhey-cons-keyser-hall": "Locked 23 Oct 2027. £250 on the thread.",
			"bluehouse-farm": "Fri 30 Oct. £250. Choice Live.",
			"bromley-services-club": "Two nights. £400 lump on the thread — not £800."
		};
		if (known[venue.id]) return known[venue.id];
		const bits = [];
		if (fee) bits.push(`£${fee} on the thread`);
		if (venue.lockedDate) bits.push(String(venue.lockedDate));
		return bits.length ? bits.join(" · ") : null;
	}
	/** Newest agreed fee in the emails. Stored lockedFee is only a fallback. */
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
		const classified = classifyVenue({
			venue,
			note,
			now
		});
		const who = extractWho(venue, note);
		const fee = displayFee(venue);
		return {
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
			dropped: isDropped(note)
		};
	}
	function rankAll(venues, notes = {}, now = /* @__PURE__ */ new Date()) {
		return venues.map((v) => rankVenue(v, notes, now));
	}
	function closeScore(row) {
		if (row.venue.pendingLockFee) return 1e4;
		if (row.stale) return -1e3 + (row.daysSinceInbound || 0) * -1;
		return 500 - (row.daysSinceInbound == null ? 50 : row.daysSinceInbound);
	}
	function sortTab(rows, tab) {
		const list = rows.filter((r) => r.tab === tab);
		if (tab === "close") return list.sort((a, b) => {
			if (a.stale !== b.stale) return a.stale ? 1 : -1;
			return closeScore(b) - closeScore(a);
		});
		if (tab === "live") return list.sort((a, b) => {
			if (a.stale !== b.stale) return a.stale ? 1 : -1;
			return (a.daysSinceInbound ?? 99) - (b.daysSinceInbound ?? 99);
		});
		if (tab === "chase") return list.sort((a, b) => {
			if (a.stale !== b.stale) return a.stale ? 1 : -1;
			return (b.daysSilent ?? 0) - (a.daysSilent ?? 0);
		});
		if (tab === "call") return list.sort((a, b) => {
			if (a.called !== b.called) return a.called ? 1 : -1;
			if (a.called && b.called) return (a.lastCalledAt || "").localeCompare(b.lastCalledAt || "");
			const atA = a.venue.firstPitch || a.lastTouchAt || "";
			const atB = b.venue.firstPitch || b.lastTouchAt || "";
			return atA.localeCompare(atB);
		});
		if (tab === "locked") return list.sort((a, b) => Number(b.fee || 0) - Number(a.fee || 0));
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
	function sortAll(rows) {
		return [...sortWorking(rows), ...sortTab(rows, "parked")];
	}
	function heatScore(venue, daysSinceInbound) {
		const inbound = realInbound(venue);
		const lastBody = ((inbound[inbound.length - 1] && inbound[inbound.length - 1].body) || "").toLowerCase();
		const all = inbound.map((m) => m.body || "").join("\n").toLowerCase();
		let s = 40;
		const days = daysSinceInbound == null ? 18 : daysSinceInbound;
		const lastHasDate = NAMED_DATE_RE.test(lastBody);
		if (lastHasDate && (CASH_LOCK_RE.test(lastBody) || /£\s*\d{2,4}/.test(lastBody))) s += 90;
		else if (lastHasDate || NAMED_DATE_RE.test(all) && days < 5) s += 35;
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
		s -= Math.min(36, days * 2);
		return s;
	}
	function replyLaneOf(row) {
		return String((row && row.venue && row.venue.replyLane) || "").toLowerCase();
	}
	function hasReplyLane(row) {
		const lane = replyLaneOf(row);
		return lane === "call" || lane === "email";
	}
	function isRepliedRow(row) {
		// Engaged thread tabs + call-tab rows Jake tagged Call/Email (otherwise Replied hid Jaela/Ahmet/Jodie/John).
		return row.tab === "close" || row.tab === "live" || row.tab === "chase" || (row.tab === "call" && hasReplyLane(row));
	}
	/** Jake 11 Sep: Call-lane (phone close from thread) at top of Replied; named heat order. */
	/** Jake call attempts 11 Sep (JEM update) — Call heat only.
	 *  1 Walderslade (no attempt — still hot)
	 *  2 California (Peter Mon before 12)
	 *  3 Muddy Duck (awaiting Jaela callback)
	 *  Sedir + Greenford John → replyLane email (already called / broken mobile).
	 */
	const CALL_LANE_RANK = {
		"walderslade-social-club": 1,
		"california-social-ipswich": 2,
		"the-muddy-duck": 3
	};
	function callLaneRank(row) {
		const id = String((row && row.venue && row.venue.id) || "");
		if (Object.prototype.hasOwnProperty.call(CALL_LANE_RANK, id)) return CALL_LANE_RANK[id];
		return 50;
	}
	function sortReplied(rows) {
		return rows.filter(isRepliedRow).sort((a, b) => {
			const laneA = replyLaneOf(a) === "call" ? 0 : 1;
			const laneB = replyLaneOf(b) === "call" ? 0 : 1;
			if (laneA !== laneB) return laneA - laneB;
			if (laneA === 0) {
				const rank = callLaneRank(a) - callLaneRank(b);
				if (rank) return rank;
			}
			const heat = heatScore(b.venue, b.daysSinceInbound) - heatScore(a.venue, a.daysSinceInbound);
			if (heat) return heat;
			return (a.daysSinceInbound ?? 99) - (b.daysSinceInbound ?? 99);
		});
	}
	function rowsForFilter(rows, filter) {
		if (filter === "all") return sortAll(rows);
		if (filter === "replied") return sortReplied(rows);
		if (filter === "closed") return sortTab(rows, "locked");
		return sortTab(rows, "parked");
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
		const t = tabCounts(rows);
		const callLane = rows.filter((r) => r.tab === "call" && hasReplyLane(r)).length;
		return {
			all: rows.length,
			replied: t.close + t.live + t.chase + callLane,
			closed: t.locked,
			inactive: t.parked
		};
	}
	function lockedCash(venues) {
		const rows = [];
		let cash = 0;
		let nights = 0;
		for (const v of venues) {
			if (!isLockedRecord(v)) continue;
			const fee = displayFee(v) || 0;
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
		return {
			cash,
			nights,
			rows,
			pending
		};
	}
	function pepLine(rows) {
		const close = sortTab(rows, "close");
		const quiet = rows.filter((r) => r.tab === "chase").filter((r) => (r.daysSilent ?? 0) > 5);
		const first = close[0];
		const who = first?.who || first?.venue.name.split(" ")[0] || null;
		const n = close.length;
		const closeBit = n === 0 ? "Nothing to close tonight." : n === 1 ? "1 to close tonight." : `${n} to close tonight.`;
		const whoBit = who && n ? ` ${who} first.` : "";
		const qn = quiet.length;
		return `${closeBit}${whoBit}${qn === 0 ? " None gone quiet." : qn === 1 ? " 1 gone quiet >5 days." : ` ${qn} gone quiet >5 days.`}`.replace(/\s+/g, " ").trim();
	}
	function chaseAlarm(rows) {
		return rows.some((r) => r.tab === "chase" && (r.daysSilent ?? 0) > 7);
	}
	function matchesQuery(venue, q) {
		if (!q.trim()) return true;
		return `${venue.name} ${venue.town || ""} ${venue.email || ""} ${venue.subject || ""} ${venue.contactName || ""}`.toLowerCase().includes(q.trim().toLowerCase());
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
		return "£" + Number(n || 0).toLocaleString("en-GB");
	}
	function fmtWhen(iso) {
		if (!iso) return "";
		const d = parseWhen(iso);
		if (!d) return String(iso);
		return d.toLocaleString("en-GB", {
			day: "numeric",
			month: "short",
			hour: "2-digit",
			minute: "2-digit"
		});
	}
	function fmtDay(iso) {
		if (!iso) return "";
		const d = parseWhen(iso);
		if (!d) return String(iso);
		return d.toLocaleDateString("en-GB", {
			day: "numeric",
			month: "short"
		});
	}
	function lastTouchLabel(row, now = /* @__PURE__ */ new Date()) {
		const at = row.lastTouchAt;
		const d = parseWhen(at);
		const who = row.lastSide === "them" ? "Them" : row.lastSide === "us" ? "Us" : "Touch";
		if (!d) return who;
		const days = daysBetween(d, now);
		if (days === 0) return `${who} · today`;
		if (days === 1) return `${who} · yesterday`;
		return `${who} · ${fmtDay(at)}`;
	}
	function lastCalledLabel(note, now = /* @__PURE__ */ new Date()) {
		if (!note?.called) return null;
		const d = parseWhen(note.calledAt || note.updatedAt || null);
		if (!d) return "Called";
		const days = daysBetween(d, now);
		if (days === 0) return "Called · today";
		if (days === 1) return "Called · yesterday";
		return `Called · ${fmtDay(note.calledAt || note.updatedAt)}`;
	}
	/** Venues we would not put in Close/Live without guessing. */
	const UNCLASSIFIED_WITHOUT_GUESSING = [
		{
			id: "wilmington-private-function-barbara-morris",
			why: "Website enquiry from Barbara, Saturday 3 Jul 2027, £350 quoted — inbound body is not on the thread. No phone. Parked, not Close (that would be guessing from our own reply)."
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
			why: "Duplicate of John Mitchell’s thread with no phone. Same inbound lives on greenford-conservative-club-john-mitchell."
		}
	];
	function isStockUsCopy(text) {
		const blob = text.toLowerCase();
		return STOCK_US.some((s) => blob.includes(s));
	}
	//#endregion
	exports.BOARD_FILTERS = BOARD_FILTERS;
	exports.BOARD_STAMP = BOARD_STAMP;
	exports.BOARD_VERSION = BOARD_VERSION;
	exports.PASSWORD = PASSWORD;
	exports.UNCLASSIFIED_WITHOUT_GUESSING = UNCLASSIFIED_WITHOUT_GUESSING;
	exports.chaseAlarm = chaseAlarm;
	exports.classifyVenue = classifyVenue;
	exports.cleanThread = cleanThread;
	exports.daysBetween = daysBetween;
	exports.displayFee = displayFee;
	exports.extractEmails = extractEmails;
	exports.extractQuotedFee = extractQuotedFee;
	exports.extractThreadFee = extractThreadFee;
	exports.extractWebsite = extractWebsite;
	exports.extractWho = extractWho;
	exports.feeMismatch = feeMismatch;
	exports.feeOnThread = feeOnThread;
	exports.filterCounts = filterCounts;
	exports.fmtDay = fmtDay;
	exports.fmtWhen = fmtWhen;
	exports.gbp = gbp;
	exports.hasPhone = hasPhone;
	exports.isAutoNoise = isAutoNoise;
	exports.isLockedRecord = isLockedRecord;
	exports.isStockUsCopy = isStockUsCopy;
	exports.lastCalledLabel = lastCalledLabel;
	exports.lastOf = lastOf;
	exports.lastTouchLabel = lastTouchLabel;
	exports.lockedCash = lockedCash;
	exports.mailtoHref = mailtoHref;
	exports.mapsHref = mapsHref;
	exports.matchesQuery = matchesQuery;
	exports.parseWhen = parseWhen;
	exports.pepLine = pepLine;
	exports.prettyPhone = prettyPhone;
	exports.primaryEmail = primaryEmail;
	exports.rankAll = rankAll;
	exports.rankVenue = rankVenue;
	exports.realInbound = realInbound;
	exports.heatScore = heatScore;
	exports.rowsForFilter = rowsForFilter;
	exports.smsHref = smsHref;
	exports.sortAll = sortAll;
	exports.sortTab = sortTab;
	exports.sortWorking = sortWorking;
	exports.tabCounts = tabCounts;
	exports.telHref = telHref;
	exports.webHref = webHref;
	return exports;
})({});

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
  var GLYPHS="アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789<>|*+#¥$NATJAKEV20TCB";
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

/* Natalie Live Board v19 — vanilla UI. Pipeline is window.Board from the bundled module. */
(function () {
  var B = window.Board;
  var PASS = B.PASSWORD;
  var filter = "all";
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
        if (diaryOpen) render();
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
    render();
  }

  function fireEgg() {
    rain("egg");
    var box = $("egg");
    var ul = $("egg-lines");
    if (box) box.classList.add("on");
    if (ul && !ul.childNodes.length) {
      ["WAKE UP, NAT", "THE BOARD HAS YOU", "FOLLOW THE WHITE RABBIT", "v20 · YOU'RE THE ONE"].forEach(function (line) {
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
    if (key === "v20" || key === "neo" || key === "whiterabbit" || key === "white rabbit") {
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
  window.natCash = function () { cashOpen = !cashOpen; render(); };
  window.natEmails = function () { emailsOpen = !emailsOpen; render(); };
  window.natSheet = function (on) { sheetOpen = !!on; render(); };
  window.natLock = function () {
    try { sessionStorage.removeItem("natalie-ok"); } catch (e) {}
    location.reload();
  };
  window.natDiary = function () {
    diaryOpen = true;
    render();
    var el = $("diary");
    if (el) el.scrollTop = 0;
  };
  window.natDiaryClose = function () {
    diaryOpen = false;
    render();
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

  function chip(tabName) {
    var map = { close: "CLOSE", live: "LIVE", chase: "CHASE", call: "CALL", locked: "LOCKED", parked: "INACTIVE" };
    return map[tabName] || tabName;
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
    "walderslade-social-club": "Xmas Eve quote live · hot host",
    "california-social-ipswich": "Peter Mon before 12",
    "the-muddy-duck": "Awaiting Jaela callback",
    sedir: "Called + dates sent · waiting reply",
    "greenford-conservative-club-john-mitchell": "Mobile digit missing · main no answer",
    "corner-club-canvey": "Chase sent · Sunday £250/£375 hold",
    "bird-in-hand": "Alison away · dates on return",
    "st-neots-cons": "Dates offered · awaiting pick",
    "the-bull": "Quote live · awaiting dates",
    "iona-social-club": "Quote live · awaiting dates",
    "honiton-cons": "£400 quoted · works/spend tight",
    "frimley-green-club": "Soft-no push sent · awaiting reply",
    "broomfield-rbl": "Chase sent · waiting committee",
    "imperial-cheshunt-and-waltham-cross-cons": "Chase sent · waiting date",
    "winchester-club": "£325 quoted · she sends Sat/Sun"
  };

  function laneWhyHtml(venue) {
    if (!venue) return "";
    var why = REPLY_WHY[String(venue.id || "")] || "";
    if (!why && venue.needPhone) why = "Need better number";
    if (!why) return "";
    return '<span class="job-lane-why">' + esc(why) + "</span>";
  }

  function moneyLabel(row) {
    if (!row.fee) return "";
    if (row.tab === "locked") return "Locked " + B.gbp(row.fee);
    if (row.tab === "call" || row.tab === "parked") return "";
    return B.gbp(row.fee) + " on the thread";
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

  function groupLabel(tab) {
    if (tab === "close") return "Close tonight";
    if (tab === "live") return "Live threads";
    if (tab === "chase") return "Chase";
    if (tab === "call") return "To call";
    if (tab === "locked") return "Locked in";
    return "Inactive";
  }

  function rowHtml(row) {
    var v = row.venue;
    var bits = [];
    if (v.town) bits.push(v.town);
    if (row.who) bits.push(row.who);
    if (row.tab === "chase" && row.daysSilent != null) bits.push(row.daysSilent + " days quiet");
    else if (row.tab !== "locked" && row.tab !== "parked") bits.push(B.lastTouchLabel(row));
    var called = B.lastCalledLabel(NOTES[v.id]);
    if (called) bits.push(called);
    var quiet = row.stale || (row.tab === "chase" && (row.daysSilent || 0) >= 7);
    var fee = (row.fee && row.tab === "locked") ? '<span class="row-fee">' + B.gbp(row.fee) + "</span>" : "";
    var lane = laneChipHtml(v);
    var why = laneWhyHtml(v);
    return '<button type="button" class="job' + (quiet ? " hot" : "") + '" onclick="natOpen(\'' + esc(v.id) + "')\">" +
      '<span class="job-main"><span class="job-name">' + esc(v.name) + '</span><span class="job-meta">' + esc(bits.join(" · ") || "Tap to open") + "</span>" + (why || "") + "</span>" +
      fee +
      '<span class="job-badges">' + (lane || "") + '<span class="badge ' + row.tab + '">' + chip(row.tab) + "</span></span>" +
      '<span class="chev">›</span></button>';
  }

  function listHtml(list) {
    if (!list.length) return '<p class="empty">Nothing in this list</p>';
    var html = '<div class="joblist">';
    var counts = {};
    list.forEach(function (r) { counts[r.tab] = (counts[r.tab] || 0) + 1; });
    var prev = null;
    list.forEach(function (r) {
      if (filter !== "replied" && (!prev || prev.tab !== r.tab)) {
        html += '<p class="group">' + groupLabel(r.tab) + " · " + counts[r.tab] + "</p>";
      }
      html += rowHtml(r);
      prev = r;
    });
    html += "</div>";
    return html;
  }

  function cashHtml(stats) {
    var html = '<button class="cash-ticker" type="button" onclick="natCash()">' +
      '<span class="cash-amt">' + B.gbp(stats.cash) + "</span>" +
      '<span class="cash-meta">' + stats.nights + " night" + (stats.nights === 1 ? "" : "s") + " locked</span></button>";
    if (!cashOpen) return html;
    html += '<div class="cash-break"><b>Confirmed bookings</b>';
    stats.rows.forEach(function (r) {
      html += '<div class="row"><span>' + esc(r.name) + (r.nights > 1 ? " · " + r.nights + " nights" : "") +
        "</span><span>" + B.gbp(r.fee) + "</span></div>";
    });
    html += '<div class="sum"><span>Total locked</span><span>' + B.gbp(stats.cash) + "</span></div>";
    stats.pending.forEach(function (p) {
      html += '<div class="pend">' + esc(p.name) + " not counted until a date is locked — " + B.gbp(p.fee) + " if she does.</div>";
    });
    html += "</div>";
    return html;
  }

  function renderList() {
    var rowsAll = ranked();
    var counts = B.filterCounts(rowsAll);
    var stats = B.lockedCash(VENUES);
    var alarm = B.chaseAlarm(rowsAll);
    var pep = B.pepLine(rowsAll);
    var tabs = B.BOARD_FILTERS;
    var tabHtml = tabs.map(function (t) {
      var on = filter === t.id ? " on" : "";
      var warn = t.id === "replied" && alarm ? " warn" : "";
      return '<button type="button" class="' + on + warn + '" onclick="natFilter(\'' + t.id + "')\"><b>" + counts[t.id] + "</b><span>" + t.label + "</span></button>";
    }).join("");
    var list = B.rowsForFilter(rowsAll, filter).filter(function (r) { return B.matchesQuery(r.venue, q); });
    var label = (tabs.find(function (t) { return t.id === filter; }) || { label: "All" }).label;
    var cards = listHtml(list);
    $("cash-slot").innerHTML = cashHtml(stats);
    $("pep").textContent = pep;
    $("filters").innerHTML = tabHtml;
    $("count").textContent = list.length + " job" + (list.length === 1 ? "" : "s") + " · " + label + ((filter === "all" || filter === "replied") && alarm ? " · quiet alarm" : "");
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
      '<span class="job-badges detail-badges">' + laneChipHtml(v) + '<span class="badge ' + row.tab + '">' + chip(row.tab) + "</span></span>" +
      laneWhyHtml(v) +
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
