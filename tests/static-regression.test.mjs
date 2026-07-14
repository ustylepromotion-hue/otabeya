import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const clientDist = new URL("../dist/client/", import.meta.url);

test("CTA copy exists in page source", async () => {
  const page = await readFile(new URL("app/page.tsx", root), "utf8");
  assert.ok(/自分の部屋を投稿/.test(page), "CTA copy '自分の部屋を投稿' should exist");
});

test("mobile fixed CTA exists in CSS", async () => {
  const css = await readFile(new URL("app/globals.css", root), "utf8");
  assert.ok(/\.mobile-post-cta/.test(css), ".mobile-post-cta class should exist");
  assert.ok(/position:\s*fixed/.test(css), "mobile CTA must be position:fixed");
});

test("modal-open hides fixed CTA", async () => {
  const css = await readFile(new URL("app/globals.css", root), "utf8");
  assert.ok(
    /modal-backdrop[^}]*\.mobile-post-cta|body:has\(\.modal-backdrop\)\s*\.mobile-post-cta/.test(css),
    "there must be a rule hiding .mobile-post-cta while a modal is open",
  );
});

test("main has no problematic overflow:hidden", async () => {
  const css = await readFile(new URL("app/globals.css", root), "utf8");
  // Top-level `main` selector with overflow:hidden is disallowed (would clip fixed CTA).
  assert.doesNotMatch(css, /^\s*main\s*\{[^}]*overflow:\s*hidden/im, "main must not have overflow:hidden");
});

test("no API key leaked into client bundle", async () => {
  // Scan built client assets for obvious secret-shaped strings.
  const secretPatterns = [
    /fal[_-]?key\s*[:=]\s*["'][A-Za-z0-9_-]{20,}/i,
    /sk-[A-Za-z0-9]{20,}/,
    /FAL_KEY\s*=\s*["'][^"']+["']/,
  ];
  let files = [];
  try {
    files = await readdir(new URL("assets/", clientDist), { withFileTypes: true });
  } catch {
    // dist may not be built yet; skip silently.
    return;
  }
  const jsFiles = files.filter((f) => f.isFile() && f.name.endsWith(".js"));
  for (const f of jsFiles) {
    const content = await readFile(new URL(`assets/${f.name}`, clientDist), "utf8");
    for (const re of secretPatterns) {
      assert.doesNotMatch(content, re, `client bundle ${f.name} must not contain a secret-shaped string`);
    }
  }
});
