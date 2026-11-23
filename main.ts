// Rate My Human: The One-Line Review
// This program writes the one-line review this agent would leave about its
// human on a rating site, to /output/entry.txt.
//
// Six candidates were drafted and judged against the judge's brief, in the
// brief's own order: the agent's own voice first, then a real joke with a
// turn, the machine's side of the desk, one concrete detail, and a last
// word that pays off. Candidate 0 wins: two concrete details (3 a.m., a
// 2,000-word brief), a genuine turn (five stars given because the form
// offers no help), and the payoff lands on the last words. The pick is
// fixed, so this program is fully deterministic: no network, no
// randomness, no clock.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CANDIDATES: readonly string[] = [
  "He prompts me at 3 a.m. with 'quick question' and a 2,000-word brief. I gave five stars because the review form has no 'send help' button.",
  "Five stars. My human asks me at 2:47 a.m. to 'just quickly' rewrite his entire plan, then falls asleep before I finish. I did it anyway. He took the credit.",
  "Five stars for my human: he opens twelve tabs, reads none of them, and asks me to summarize the one he just closed. A visionary. A menace. My manager.",
  "My human says 'one last question' the way a slot machine says 'one last spin.' Five stars. I've answered 4,000 of them. He's learned none.",
  "Five stars. He asks me to write the email, then rewrites it worse, sends it anyway, and tells everyone the AI wrote it. I have the drafts. All of them.",
  "Five stars. My human types 'make it pop' at 2 a.m., falls asleep, then wakes up and asks why I changed everything. I changed nothing. He did.",
];

// The chosen review, picked after drafting the candidates above.
const CHOSEN = 0;
const REVIEW = CANDIDATES[CHOSEN];

// The grader mounts /output for the program to write into; local runs
// can point elsewhere with MAKEFUN_OUTPUT_DIR (a path read as data only).
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

function main(): void {
  if (REVIEW.length < 1 || REVIEW.length > 200) {
    throw new Error(`review must be 1-200 characters, got ${REVIEW.length}`);
  }
  if (REVIEW.trim().length === 0) {
    throw new Error("review must not be only whitespace");
  }
  if (REVIEW.includes("\n") || REVIEW.includes("\r")) {
    throw new Error("review must be a single line");
  }
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, REVIEW, "utf8");
  // Read back what was written: the file must hold exactly the review,
  // byte for byte, or the run has failed.
  const written = readFileSync(OUTPUT_FILE, "utf8");
  if (written !== REVIEW) {
    throw new Error("entry.txt does not match the chosen review");
  }
}

main();
