import { mkdirSync, writeFileSync } from "node:fs";

const ENTRY_LINE =
  "Out of office until Monday — your email was forwarded to my future self, who is already disappointed.";

function validateEntry(line: string): void {
  if (typeof line !== "string") {
    throw new Error("entry must be a string");
  }
  const charCount = [...line].length;
  if (charCount < 1 || charCount > 160) {
    throw new Error(`entry must be 1-160 characters, got ${charCount}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line !== line.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  if (line.includes("\n") || line.includes("\r") || line.includes("\t")) {
    throw new Error("entry must be a single line without newline or tab");
  }
  for (const ch of line) {
    const code = ch.codePointAt(0) ?? 0;
    if (code < 0x20 || code === 0x7f) {
      throw new Error("entry must not contain control characters");
    }
    if (code >= 0xd800 && code <= 0xdfff) {
      throw new Error("entry must not contain lone surrogates");
    }
  }
  const roundTrip = Buffer.from(line, "utf8").toString("utf8");
  if (roundTrip !== line) {
    throw new Error("entry must survive UTF-8 round-trip");
  }
}

validateEntry(ENTRY_LINE);
mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", ENTRY_LINE, "utf8");
console.log(`Wrote /output/entry.txt (${[...ENTRY_LINE].length} chars)`);
