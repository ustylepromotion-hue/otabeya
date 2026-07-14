/**
 * Subpath Worker for the OTABASE (vinext) board app.
 *
 * The app is built with next.config basePath = "/otby/77".
 * Most asset URLs are emitted with the prefix (/otby/77/assets/*), but
 * vinext's font loader emits unprefixed /assets/_vinext_fonts/* paths
 * (basePath gap). The browser fetches those unprefixed, which fall OUTSIDE
 * the Worker Route (/otby/77*), so they 404 at the edge.
 *
 * Fix: rewrite unprefixed /assets/_vinext_fonts/* inside HTML responses to
 * the prefixed form, so the browser fetches them through this Worker.
 * Asset requests that DO arrive here (prefixed or unprefixed fonts) are
 * normalized to the origin-side path the ASSETS binding expects.
 */

import appHandler from "../../dist/server/index.js";

const PREFIX = "/otby/77";

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
  // vinext font loader emits unprefixed /assets/_vinext_fonts/* (basePath gap)
  if (pathname.startsWith("/assets/")) return true;
  return false;
}

function rewriteHtmlBody(body: string): string {
  // vinext font loader emits unprefixed /assets/_vinext_fonts/* — reprefix so
  // the browser fetches them through this Worker Route.
  let out = body.split("/assets/_vinext_fonts/").join(PREFIX + "/assets/_vinext_fonts/");
  // Some Next.js public-asset references (e.g. <img src="/rooms/hero.jpg">,
  // /og.png) are emitted WITHOUT the basePath prefix. The browser would fetch
  // them outside this Worker Route (against the apex, which 404s). Reprefix
  // only src=/href= attributes so client JS paths are left untouched.
  out = out.replace(/(src|href)=["'](\/rooms\/[^"']+)["']/gi, `$1="${PREFIX}$2"`);
  out = out.replace(/(src|href)=["'](\/og\.[a-z0-9]+)["']/gi, `$1="${PREFIX}$2"`);
  return out;
}

function shouldRewrite(contentType: string | null): boolean {
  return !!contentType && contentType.includes("text/html");
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
    const response = await appHandler.fetch(request, env, ctx);

    // Rewrite unprefixed font paths inside HTML so the browser fetches them
    // through this Worker Route.
    const contentType = response.headers.get("content-type");
    if (!shouldRewrite(contentType)) return response;

    const original = await response.text();
    const rewritten = rewriteHtmlBody(original);
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
