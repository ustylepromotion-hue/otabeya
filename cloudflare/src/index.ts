/**
 * Subpath Worker for the OTABASE (vinext) board app.
 *
 * The app is built with next.config basePath = "/advisor/1kh/otby/77".
 * Most asset URLs are emitted with the prefix (/advisor/1kh/otby/77/assets/*),
 * but vinext's font loader emits unprefixed /assets/_vinext_fonts/* paths.
 * This Worker maps both forms to the ASSETS binding and forwards the rest
 * (pages, /api/*, /_vinext/*) to the vinext handler, which understands basePath.
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

// Paths that live in the ASSETS binding (prefixed or unprefixed font paths).
function isAssetPath(pathname: string): boolean {
  if (pathname.startsWith(PREFIX + "/assets/") || pathname === PREFIX + "/assets") return true;
  // vinext font loader emits unprefixed /assets/_vinext_fonts/* (basePath bug)
  if (pathname.startsWith("/assets/")) return true;
  return false;
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Only handle requests under PREFIX (plus unprefixed /assets fonts).
    // Anything else 404s so the existing labs-88.com apex (photo-web) is safe.
    const underPrefix = url.pathname === PREFIX || url.pathname.startsWith(PREFIX + "/");
    if (!underPrefix && !url.pathname.startsWith("/assets/")) {
      return new Response("Not Found", { status: 404 });
    }

    // Static assets -> ASSETS binding (strip PREFIX if present)
    if (isAssetPath(url.pathname)) {
      const assetUrl = new URL(url.toString());
      assetUrl.pathname = url.pathname.startsWith(PREFIX)
        ? url.pathname.slice(PREFIX.length)
        : url.pathname; // -> /assets/...
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    // Pages, /api/*, /_vinext/* -> vinext handler (understands basePath)
    return appHandler.fetch(request, env, ctx);
  },
};

export default worker;
