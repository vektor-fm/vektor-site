#!/usr/bin/env node
/**
 * Auto-Markdown for Claude Code — PreToolUse hook on the Read tool.
 *
 * When Claude Code is about to Read a .pdf file, this hook converts it to
 * Markdown with Microsoft's `markitdown` CLI first and rewrites the tool
 * call to read the .md instead. Why: per Anthropic's PDF-support docs
 * (platform.claude.com/docs/en/build-with-claude/pdf-support, read
 * 2026-10-01), a PDF handed to Claude is converted to an image per page
 * AND has its text extracted — both go into context. A Markdown file only
 * carries the text, so the page images are never made.
 *
 * Zero npm dependencies. Node built-ins only (fs, path, crypto,
 * child_process). Works on macOS, Linux and Windows.
 *
 * Fallbacks — the hook lets the ORIGINAL Read through untouched, unchanged,
 * whenever it cannot be confident converting helps:
 *   1. `markitdown` is not on PATH.
 *   2. The converted .md is near-empty (a scanned PDF has no text layer —
 *      markitdown's base install does not OCR; see README §"When NOT to use this").
 *   3. A cheap image-count heuristic flags the PDF as figure-heavy (so the
 *      page images Claude would lose by converting probably matter: charts,
 *      diagrams, screenshots). This heuristic is approximate — override it
 *      with MARKITDOWN_FORCE=1, or just read the PDF unconverted.
 *   4. The caller opted out (see "Bypass" below).
 * Every fallback prints ONE line to stderr and appends one JSON line to
 * the log file, and never blocks or alters the Read call.
 *
 * Bypass (when you want the page IMAGES — e.g. the PDF is charts/scans and
 * you want Claude to see them):
 *   - Per-file: name the file `*.images.pdf` (e.g. `deck.images.pdf`). The
 *     hook skips conversion for any path matching that suffix.
 *   - Global, this session: set MARKITDOWN_SKIP=1 before starting Claude
 *     Code, or export it in your shell. The hook becomes a no-op.
 *
 * Cache: converted Markdown is cached at
 * .claude/markitdown-cache/<hash>.md, keyed on the PDF's absolute path,
 * byte size and mtime — so editing the PDF invalidates the cache, and
 * re-reading the same unchanged PDF is instant (no re-conversion).
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, statSync, appendFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";

// ---- tunables (env-overridable) -------------------------------------------------
const MIN_MD_CHARS = Number(process.env.MARKITDOWN_MIN_CHARS ?? 40); // below this: treat as "no text layer"
const FIGURE_IMAGES_PER_PAGE = Number(process.env.MARKITDOWN_FIGURE_THRESHOLD ?? 0.5); // images/page ratio that trips the figure-heavy fallback
const TIMEOUT_MS = Number(process.env.MARKITDOWN_TIMEOUT_MS ?? 120_000);
const FORCE = process.env.MARKITDOWN_FORCE === "1"; // override the figure-heavy heuristic only
const SKIP = process.env.MARKITDOWN_SKIP === "1"; // disable the hook entirely

function note(msg) {
  // One line, stderr only — PreToolUse hooks must keep stdout pure JSON.
  process.stderr.write(`[markitdown-hook] ${msg}\n`);
}

function log(projectDir, entry) {
  try {
    const dir = path.join(projectDir, ".claude", "markitdown-cache");
    mkdirSync(dir, { recursive: true });
    appendFileSync(path.join(dir, "log.jsonl"), JSON.stringify({ ts: new Date().toISOString(), ...entry }) + "\n");
  } catch {
    // logging is best-effort, never fatal
  }
}

function allowUnchanged() {
  // No hookSpecificOutput at all = Read proceeds with its original input.
  process.stdout.write(JSON.stringify({}) + "\n");
  process.exit(0);
}

function allowWithUpdatedInput(mdPath, extraContext) {
  const out = {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "allow",
      updatedInput: { file_path: mdPath },
    },
  };
  if (extraContext) out.hookSpecificOutput.additionalContext = extraContext;
  process.stdout.write(JSON.stringify(out) + "\n");
  process.exit(0);
}

function hasMarkitdown() {
  const r = spawnSync("markitdown", ["--version"], { shell: process.platform === "win32", timeout: 10_000 });
  return !r.error && r.status === 0;
}

// Best-effort, dependency-free estimate of page count and embedded-image
// count straight from the PDF's raw bytes. This is NOT a real PDF parser —
// it under/over-counts on PDFs that use compressed object streams or odd
// structures — but it costs nothing and is good enough to flag the
// obviously figure-heavy case. The bypass flags exist for when it's wrong.
function estimatePagesAndImages(pdfBuf) {
  const text = pdfBuf.toString("latin1");
  const pageMatches = text.match(/\/Type\s*\/Page(?!s)/g) || [];
  const imageMatches = text.match(/\/Subtype\s*\/Image/g) || [];
  return { pages: pageMatches.length, images: imageMatches.length };
}

function main() {
  let input = "";
  try {
    input = readFileSync(0, "utf8");
  } catch {
    allowUnchanged();
    return;
  }

  let payload;
  try {
    payload = JSON.parse(input);
  } catch {
    allowUnchanged();
    return;
  }

  const projectDir = process.env.CLAUDE_PROJECT_DIR || payload.cwd || process.cwd();

  if (payload.tool_name !== "Read") {
    allowUnchanged();
    return;
  }
  const filePath = payload.tool_input && payload.tool_input.file_path;
  if (!filePath || !/\.pdf$/i.test(filePath)) {
    allowUnchanged();
    return;
  }

  if (SKIP) {
    note(`MARKITDOWN_SKIP=1 — leaving ${path.basename(filePath)} as PDF.`);
    log(projectDir, { file: filePath, action: "skip", reason: "MARKITDOWN_SKIP=1" });
    allowUnchanged();
    return;
  }

  if (/\.images\.pdf$/i.test(filePath)) {
    note(`${path.basename(filePath)} matches *.images.pdf — leaving as PDF so Claude sees the page images.`);
    log(projectDir, { file: filePath, action: "skip", reason: "*.images.pdf bypass suffix" });
    allowUnchanged();
    return;
  }

  if (!existsSync(filePath)) {
    // Let Read handle the not-found error itself.
    allowUnchanged();
    return;
  }

  if (!hasMarkitdown()) {
    note(`markitdown not found on PATH — leaving ${path.basename(filePath)} as PDF. Install: see README "Install".`);
    log(projectDir, { file: filePath, action: "fallback", reason: "markitdown not on PATH" });
    allowUnchanged();
    return;
  }

  let stat;
  try {
    stat = statSync(filePath);
  } catch {
    allowUnchanged();
    return;
  }

  // Figure-heavy heuristic runs on the ORIGINAL PDF bytes, before conversion,
  // so a figure-heavy PDF never even pays the conversion cost unless forced.
  if (!FORCE) {
    try {
      const pdfBuf = readFileSync(filePath);
      const { pages, images } = estimatePagesAndImages(pdfBuf);
      if (pages > 0) {
        const ratio = images / pages;
        if (ratio >= FIGURE_IMAGES_PER_PAGE) {
          note(
            `${path.basename(filePath)} looks figure-heavy (~${images} images / ~${pages} pages ≈ ${ratio.toFixed(
              2
            )}/page, heuristic) — leaving as PDF so Claude sees the images. Set MARKITDOWN_FORCE=1 to convert anyway.`
          );
          log(projectDir, {
            file: filePath,
            action: "fallback",
            reason: "figure-heavy heuristic",
            estPages: pages,
            estImages: images,
            ratio,
          });
          allowUnchanged();
          return;
        }
      }
    } catch {
      // If the heuristic itself fails, don't let that block conversion — fall through.
    }
  }

  const absPath = path.resolve(filePath);
  const key = createHash("sha1").update(`${absPath}|${stat.size}|${stat.mtimeMs}`).digest("hex").slice(0, 20);
  const cacheDir = path.join(projectDir, ".claude", "markitdown-cache");
  const mdPath = path.join(cacheDir, `${key}.md`);

  if (existsSync(mdPath)) {
    const cached = readFileSync(mdPath, "utf8");
    if (cached.trim().length >= MIN_MD_CHARS) {
      log(projectDir, { file: filePath, action: "cache-hit", mdPath });
      allowWithUpdatedInput(mdPath, `markitdown-hook: served cached conversion of ${path.basename(filePath)} (${mdPath}).`);
      return;
    }
    // stale/empty cache entry — fall through and re-run
  }

  mkdirSync(cacheDir, { recursive: true });

  const result = spawnSync("markitdown", [absPath, "-o", mdPath], {
    shell: process.platform === "win32",
    timeout: TIMEOUT_MS,
  });

  if (result.error || result.status !== 0 || !existsSync(mdPath)) {
    const errMsg = result.error ? result.error.message : `exit ${result.status}: ${String(result.stderr || "").slice(0, 200)}`;
    note(`markitdown failed on ${path.basename(filePath)} (${errMsg}) — leaving as PDF.`);
    log(projectDir, { file: filePath, action: "fallback", reason: `markitdown error: ${errMsg}` });
    allowUnchanged();
    return;
  }

  const mdText = readFileSync(mdPath, "utf8");
  if (mdText.trim().length < MIN_MD_CHARS) {
    note(
      `${path.basename(
        filePath
      )} converted to near-empty Markdown (${mdText.trim().length} chars) — probably a scanned PDF with no text layer. Leaving as PDF.`
    );
    log(projectDir, { file: filePath, action: "fallback", reason: "near-empty conversion (no text layer)", mdChars: mdText.trim().length });
    allowUnchanged();
    return;
  }

  note(`Converted ${path.basename(filePath)} -> ${path.basename(mdPath)} (${mdText.length} chars). Reading the Markdown instead.`);
  log(projectDir, { file: filePath, action: "convert", mdPath, pdfBytes: stat.size, mdChars: mdText.length });
  allowWithUpdatedInput(mdPath, `markitdown-hook: converted ${path.basename(filePath)} to Markdown before reading (page images were not generated).`);
}

main();
