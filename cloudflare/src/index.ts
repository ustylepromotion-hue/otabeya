/**
 * Subpath Worker for the OTABASE (vinext) board app.
 *
 * The app is built with next.config basePath = "/advisor/1kh/otby/77".
 * Most asset URLs are emitted with the prefix (/advisor/1kh/otby/77/assets/*),
 * but vinext's font loader emits unprefixed /assets/_vinext_fonts/* paths.
 *
 * Cloudflare Workers Assets maps the route prefix (/advisor/1kh/otby/77/assets/*)
 * to dist/client/assets/* on the origin, so any asset request must arrive with
 * the prefix. This Worker therefore:
 *   1. gates requests to PREFIX (404 outside, protecting the photo-web apex)
 *   2. rewrites unprefixed /assets/* (font loader gap) to PREFIX/assets/*
 *   3. maps PREFIX/assets/* -> ASSETS binding (/assets/* on the origin)
 *   4. forwards pages, /api/*, /_vinext/* to the vinext handler (basePath-aware)
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

// Paths that live in the ASSETS binding.
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

    if (isAssetPath(url.pathname)) {
      const assetUrl = new URL(url.toString());
      // Normalize to the origin-side path the ASSETS binding expects:
      //   PREFIX/assets/* -> /assets/*   (route prefix stripped)
      //   /assets/*       -> PREFIX/assets/* (font loader gap, re-prefixed)
      if (assetUrl.pathname.startsWith(PREFIX + "/assets/")) {
        assetUrl.pathname = assetUrl.pathname.slice(PREFIX.length);
      } else if (assetUrl.pathname.startsWith("/assets/")) {
        assetUrl.pathname = PREFIX + assetUrl.pathname;
      }
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    // Pages, /api/*, /_vinext/* -> vinext handler (understands basePath)
    return appHandler.fetch(request, env, ctx);
  },
};

export default worker;
