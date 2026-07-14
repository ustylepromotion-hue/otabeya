// Acceptance checks for the OTABASE board's built client assets.
//
// This replaces the old vinext-starter `rendered-html` test, which asserted a
// Codex loading skeleton (`app/_sites-preview/SkeletonPreview.tsx`,
// `react-loading-skeleton`, `codex-preview` meta) that no longer exists in the
// current app. The current app is an SSR board served under the subpath
// `/otby/77`, so there is no static `index.html` in `dist/client` to assert
// against. Instead we verify the static assets that the production Worker
// serves (fonts, og image, room gallery) are present in the build output,
// because a missing asset is what previously caused 404s on
// `/otby/77/assets/_vinext_fonts/*`.
import assert from "node:assert/strict";
import { access, readdir, readFile } from "node:fs/promises";
import test from "node:test";

const clientDist = new URL("../dist/client/", import.meta.url);

test("og image is present in build output", async () => {
  await access(new URL("og.png", clientDist));
});

test("vinext fonts are bundled (no /assets/_vinext_fonts 404 at runtime)", async () => {
  const fontDir = new URL("assets/_vinext_fonts/", clientDist);
  let files = [];
  try {
    // Fonts live one level deeper (e.g. assets/_vinext_fonts/geist-xxx/geist-*.woff2),
    // so read recursively.
    files = await readdir(fontDir, { recursive: true });
  } catch {
    throw new Error("dist/client/assets/_vinext_fonts is missing; fonts will 404 in production");
  }
  const woff2 = files.filter((f) => (typeof f === "string" ? f : f.name).endsWith(".woff2"));
  assert.ok(woff2.length > 0, "expected at least one bundled woff2 font");
});

test("_headers declares an immutable asset cache rule", async () => {
  const headers = await readFile(new URL("_headers", clientDist), "utf8");
  // launch-deploy.sh rewrites `/assets/*` -> `/otby/77/assets/*` before
  // deploy, but the rule must exist in either form.
  assert.match(headers, /^\/assets\/\*|^\/otby\/77\/assets\/\*/m,
    "_headers must contain an /assets/* cache rule");
});

test("room gallery sample images are bundled", async () => {
  const roomsDir = new URL("rooms/", clientDist);
  const files = await readdir(roomsDir);
  const images = files.filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));
  assert.ok(images.length > 0, "expected at least one room gallery image in dist/client/rooms");
});
