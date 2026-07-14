/**
 * Subpath-proxy Worker for the OTABASE (vinext) full-stack board app.
 *
 * Serves the app under https://labs-88.com/advisor/1kh/otby/77/
 * without modifying the vinext build output. The build assumes it runs at
 * the domain root ("/assets/*", "/api/*", "/_vinext/*"), so this Worker:
 *   1. strips PREFIX from incoming requests before calling the app handler
 *   2. rewrites absolute paths in HTML/JS/CSS responses to include PREFIX
 *   3. maps PREFIX/assets/* to the static ASSETS binding
 */

import appHandler from "../../dist/server/index.js";

const PREFIX = "/advisor/1kh/otby/77";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  ROOM_IMAGES?: R2Bucket;
  IMAGES?: unknown;
  OPENAI_API_KEY?: string;
  AMAZON_ASSOCIATE_TAG?: string;
  [key: string]: unknown;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Absolute paths the vinext client emits at the domain root.
const REWRITE_PATTERNS = [
  '"/assets/',
  '"/_vinext/',
  '"/api/',
  '"/rooms/',
  '"/og.png"',
  '"/favicon',
];

function rewriteBody(body: string): string {
  let out = body;
  for (const p of REWRITE_PATTERNS) {
    const needle = p;
    // Replace "PREFIX/assets/" collisions first by normalizing, then add prefix.
    const already = needle.replace('"', `"${PREFIX}`);
    // Avoid double-prefixing: strip any existing PREFIX then re-add.
    const stripped = needle;
    out = out.split(already).join(stripped); // remove accidental double prefix
    out = out.split(stripped).join(already);
  }
  return out;
}

function shouldRewrite(contentType: string | null): boolean {
  if (!contentType) return false;
  return (
    contentType.includes("text/html") ||
    contentType.includes("application/javascript") ||
    contentType.includes("text/javascript") ||
    contentType.includes("text/css")
  );
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Only handle requests under PREFIX. Anything else 404s so the existing
    // labs-88.com apex (photo-web) and other subpaths stay untouched.
    if (url.pathname !== PREFIX && !url.pathname.startsWith(PREFIX + "/")) {
      return new Response("Not Found", { status: 404 });
    }

    // Normalize PREFIX (no trailing slash) -> internal root path.
    let internalPath = url.pathname.slice(PREFIX.length);
    if (internalPath === "") internalPath = "/";

    // Static assets: PREFIX/assets/* -> ASSETS /assets/*
    if (internalPath.startsWith("/assets/") || internalPath === "/assets") {
      const assetUrl = new URL(url.toString());
      assetUrl.pathname = internalPath;
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    // Build the internal request the app sees (path without PREFIX).
    const internalUrl = new URL(url.toString());
    internalUrl.pathname = internalPath;
    const internalRequest = new Request(internalUrl.toString(), request);

    const response = await appHandler.fetch(internalRequest, env, ctx);

    const contentType = response.headers.get("content-type");
    if (!shouldRewrite(contentType)) {
      return response;
    }

    const original = await response.text();
    const rewritten = rewriteBody(original);

    const headers = new Headers(response.headers);
    headers.delete("content-length");
    return new Response(rewritten, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

export default worker;
