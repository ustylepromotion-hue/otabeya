/**
 * Subpath Worker for the OTABASE (vinext) board app.
 *
 * The app is built with next.config basePath = "/advisor/1kh/otby/77",
 * so vinext itself emits and routes every path under that prefix.
 * This Worker only needs to:
 *   1. serve the request under labs-88.com/advisor/1kh/otby/77*
 *   2. map the static ASSETS binding for /advisor/1kh/otby/77/assets/*
 *   3. 404 anything outside the prefix so the existing apex (photo-web) is safe
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

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Only handle requests under PREFIX. Anything else 404s so the existing
    // labs-88.com apex (photo-web) and other subpaths stay untouched.
    if (url.pathname !== PREFIX && !url.pathname.startsWith(PREFIX + "/")) {
      return new Response("Not Found", { status: 404 });
    }

    // Static assets live under PREFIX/assets/* and are served from the
    // ASSETS binding (which stores them at /assets/*).
    if (url.pathname.startsWith(PREFIX + "/assets/") || url.pathname === PREFIX + "/assets") {
      const assetUrl = new URL(url.toString());
      assetUrl.pathname = url.pathname.slice(PREFIX.length); // -> /assets/...
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    // Everything else (pages, /api/*, /_vinext/*) goes to the vinext handler,
    // which already understands the basePath prefix.
    return appHandler.fetch(request, env, ctx);
  },
};

export default worker;
