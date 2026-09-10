#!/usr/bin/env node
/** Fail if the board shell is missing, fat, or not v19. Data syncs must never rewrite these files. */
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
  if (!html.includes("Board v19")) problems.push("index.html missing 'Board v19'");
  if (size > 40000) problems.push(`index.html ${size} bytes — fat v15 embed, want ~9KB`);
  if (size < 2000) problems.push(`index.html ${size} bytes — empty/broken`);
  if (!html.includes('src="board.js"')) problems.push("index.html must load board.js, not inline the app");
  if (!html.includes('id="venues-data"')) problems.push("index.html missing #venues-data");
  if ((html.match(/id="venues-data">\[.{200,}/s) || [])[0]) problems.push("index.html has venues embedded — use venues.json");
  if (!board.includes('BOARD_VERSION = "v19"')) problems.push("board.js is not v19");
  if (problems.length) {
    console.error("UI LOCK FAIL:\n - " + problems.join("\n - "));
    console.error("See BOARD_UI_LOCK.md. Restore index.html + board.js from a v19 commit. Never write them from a data sync.");
    process.exit(1);
  }
  console.log(`UI LOCK ok — index ${size} bytes, Board v19, board.js intact`);
}

await check();
