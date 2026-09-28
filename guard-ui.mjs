#!/usr/bin/env node
/** Fail if the board shell is missing, fat, or not v25. Data syncs must never rewrite these files. */
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname);
const problems = [];

async function check() {
  const indexPath = path.join(ROOT, "index.html");
  const boardPath = path.join(ROOT, "board.js");
  const html = await readFile(indexPath, "utf8");
  const size = (await stat(indexPath)).size;
  const board = await readFile(boardPath, "utf8");
  if (!html.includes("Board v43")) problems.push("index.html missing 'Board v43'");
  if (size > 40000) problems.push(`index.html ${size} bytes — fat v15 embed, want ~9KB`);
  if (size < 2000) problems.push(`index.html ${size} bytes — empty/broken`);
  if (!html.includes('src="board.js')) problems.push("index.html must load board.js, not inline the app");
  if (!html.includes('id="venues-data"')) problems.push("index.html missing #venues-data");
  if ((html.match(/id="venues-data">\[.{200,}/s) || [])[0]) problems.push("index.html has venues embedded — use venues.json");
  if (!board.includes('BOARD_VERSION = "v43"')) problems.push("board.js is not v43");
  if (!html.includes('src="calls.js')) problems.push("index.html must load calls.js (Calls tab)");
  try {
    const calls = JSON.parse(await readFile(path.join(ROOT, "calls.json"), "utf8"));
    if (!Array.isArray(calls.venues) || !calls.venues.length) problems.push("calls.json has no venues");
  } catch (e) {
    problems.push("calls.json missing or not valid JSON: " + e.message);
  }
  try {
    await stat(path.join(ROOT, "calls.js"));
  } catch {
    problems.push("calls.js missing");
  }
  if (problems.length) {
    console.error("UI LOCK FAIL:\n - " + problems.join("\n - "));
    console.error("See BOARD_UI_LOCK.md. Restore index.html + board.js from a v25 commit. Never write them from a data sync.");
    process.exit(1);
  }
  console.log(`UI LOCK ok — index ${size} bytes, Board v43, board.js intact, calls.js + calls.json ok`);
}

await check();
