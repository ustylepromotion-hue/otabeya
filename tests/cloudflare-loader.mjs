// Loader so that, under plain `node --test` (no workerd):
//  - `cloudflare:workers` resolves to a stub returning globalThis.__CLOUDFLARE_ENV__
//  - app modules that need mocking (db / room-ai / r2 / fal) resolve to stubs that
//    delegate to globals the tests populate (globalThis.__DB_MOCK__ etc).
//  - relative .ts imports without extension are resolved with a .ts suffix
//    (Node ESM does not append extensions by default).

const cloudflareStub =
  "export const env = new Proxy({}, { get: (_, p) => (globalThis.__CLOUDFLARE_ENV__ ?? {})[p], has: () => true });";

const dbStub =
  "export function getDb(){ return globalThis.__DB_MOCK__; }";

const roomAiStub =
  "export async function analyzeRoom(){ return globalThis.__ANALYZE_MOCK__; }" +
  "export class RoomSafetyError extends Error {}";

const r2Stub =
  "export async function storeRemoteImage(url, ct){ return globalThis.__STORE_REMOTE__(url, ct); }";

const falStub =
  "export async function generateImage(input){" +
  "  const env = (globalThis.__CLOUDFLARE_ENV__ ?? {});" +
  "  if (!env.FAL_KEY) { throw new FalApiError('画像生成キーが設定されていません。', 503); }" +
  "  return globalThis.__GENERATE__(input);" +
  "}" +
  "export class FalApiError extends Error { constructor(m,s=502){ super(m); this.status=s; } }" +
  "export class FalRateLimitError extends Error {}" +
  "export class FalInvalidKeyError extends Error {}";

const schemaStub = "export const rooms = {}; export const comments = {}; export const affiliateClicks = {}; export const roomLikes = {}; export const reports = {};";

function dataUrl(src) {
  return "data:text/javascript;base64," + Buffer.from(src).toString("base64");
}

export async function resolve(specifier, context, next) {
  if (specifier === "cloudflare:workers") {
    return { url: dataUrl(cloudflareStub), shortCircuit: true };
  }
  if (/([/]|^)db(\/index)?\.ts$/.test(specifier) || specifier.endsWith("/db")) {
    return { url: dataUrl(dbStub), shortCircuit: true };
  }
  if (specifier.endsWith("room-ai") || specifier.endsWith("room-ai.ts")) {
    return { url: dataUrl(roomAiStub), shortCircuit: true };
  }
  if (specifier.endsWith("lib/r2") || specifier.endsWith("lib/r2.ts")) {
    return { url: dataUrl(r2Stub), shortCircuit: true };
  }
  if (specifier.endsWith("lib/fal") || specifier.endsWith("lib/fal.ts")) {
    return { url: dataUrl(falStub), shortCircuit: true };
  }
  if (specifier.endsWith("/db/schema") || specifier.endsWith("/db/schema.ts")) {
    return { url: dataUrl(schemaStub), shortCircuit: true };
  }
  // Append .ts to relative imports that lack an extension.
  if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
    const withTs = specifier + ".ts";
    try {
      return await next(withTs, context);
    } catch {
      // fall through to default resolution
    }
  }
  return next(specifier, context);
}
