import assert from "node:assert/strict";
import test from "node:test";

// Load the cloudflare:workers + module stubs so route handlers can run under
// plain `node --test`. Stubs delegate to globals populated below.
await import("./register-cloudflare.mjs");

// ---------------------------------------------------------------------------
// In-memory R2 mock
// ---------------------------------------------------------------------------
const r2Objects = new Map();

function makeR2() {
  return {
    async get(key) {
      const obj = r2Objects.get(key);
      if (!obj) return null;
      const buf = typeof obj.body === "string" ? Buffer.from(obj.body) : obj.body;
      return {
        arrayBuffer: async () => buf,
        httpContentType: obj.contentType,
        httpEtag: `"${key}"`,
        writeHttpMetadata() {},
      };
    },
    async put(key, body, opts) {
      r2Objects.set(key, { body, contentType: opts?.httpMetadata?.contentType ?? "application/octet-stream" });
      return { key };
    },
    async delete(key) {
      r2Objects.delete(key);
    },
  };
}

// drizzle-orm/d1 getDb() mock.
let insertedRows = [];
let nextRoomId = 100;
const dbMock = {
  select: () => ({
    from: () => ({
      where: () => ({ orderBy: () => ({ limit: () => Promise.resolve([]) }) }),
      orderBy: () => ({ limit: () => Promise.resolve([]) }),
      groupBy: () => Promise.resolve([]),
    }),
  }),
  insert: () => ({
    values: (row) => ({
      returning: async () => {
        const created = { ...row, id: nextRoomId++, createdAt: new Date() };
        insertedRows.push(created);
        return [created];
      },
    }),
  }),
};

// room-ai analyzeRoom mock.
const analysisMock = {
  score: 88,
  caption: "分析キャプション",
  shareCopy: "シェアコピー",
  archetype: "分析タイプ",
  tags: ["#a", "#b", "#c"],
  detectedItems: ["item1"],
  scores: { unity: 80, obsession: 85, livedIn: 75, reproducibility: 78 },
  products: [{ name: "商品", query: "検索", reason: "理由" }],
  model: "mock-model",
  llm: false,
};

// r2 storeRemoteImage mock (used by /api/generate path).
const storeRemoteMock = async (url, contentType) => {
  const key = `remote-${Math.random().toString(36).slice(2)}.png`;
  r2Objects.set(key, { body: Buffer.from("fake"), contentType });
  return { key, contentType };
};

// fal generateImage mock.
const generateMock = async () => ({ url: "https://example.com/img.png", contentType: "image/png" });

// Install globals the stubs read.
globalThis.__DB_MOCK__ = dbMock;
globalThis.__ANALYZE_MOCK__ = analysisMock;
globalThis.__STORE_REMOTE__ = storeRemoteMock;
globalThis.__GENERATE__ = generateMock;

// ---------------------------------------------------------------------------
const postsRoute = await import("../app/api/posts/route.ts");
const generateRoute = await import("../app/api/generate/route.ts");

// ---------------------------------------------------------------------------
function setEnv(env) {
  globalThis.__CLOUDFLARE_ENV__ = env;
}

function jsonRequest(body, headers = {}) {
  return new Request("http://localhost/api/posts", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

function makeImageBase64(type = "image/png") {
  const b64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAMCAQDJ/3pUAAAAAElFTkSuQmCC";
  return type === "image/png" ? `data:${type};base64,${b64}` : b64;
}

// ===========================================================================
// /api/posts
// ===========================================================================
test("/api/posts GET returns JSON", async () => {
  setEnv({ DB: dbMock, ROOM_IMAGES: makeR2() });
  const res = await postsRoute.GET(new Request("http://localhost/api/posts"));
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type") ?? "", /application\/json/);
  const data = await res.json();
  assert.ok("rooms" in data);
});

test("/api/posts POST rejects malformed JSON with 400 JSON", async () => {
  setEnv({ DB: dbMock, ROOM_IMAGES: makeR2() });
  const req = new Request("http://localhost/api/posts", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{not json",
  });
  const res = await postsRoute.POST(req);
  assert.equal(res.status, 400);
  assert.match(res.headers.get("content-type") ?? "", /application\/json/);
  const data = await res.json();
  assert.ok("error" in data);
});

test("/api/posts POST missing required fields -> 400 JSON", async () => {
  setEnv({ DB: dbMock, ROOM_IMAGES: makeR2() });
  const res = await postsRoute.POST(jsonRequest({ title: "x" }));
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.ok("error" in data);
});

test("/api/posts POST no image source -> 400 JSON", async () => {
  setEnv({ DB: dbMock, ROOM_IMAGES: makeR2() });
  const res = await postsRoute.POST(jsonRequest({
    title: "部屋", handle: "@me", category: "デスク", description: "こだわり",
  }));
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.ok("error" in data);
});

test("/api/posts POST unknown generatedImageKey -> 400 JSON", async () => {
  setEnv({ DB: dbMock, ROOM_IMAGES: makeR2() });
  const res = await postsRoute.POST(jsonRequest({
    title: "部屋", handle: "@me", category: "デスク", description: "こだわり",
    generatedImageKey: "does-not-exist",
  }));
  assert.equal(res.status, 400);
  assert.match(res.headers.get("content-type") ?? "", /application\/json/);
  const data = await res.json();
  assert.ok("error" in data);
});

test("/api/posts POST with generatedImageKey succeeds -> 201 JSON + D1 row", async () => {
  const r2 = makeR2();
  setEnv({ DB: dbMock, ROOM_IMAGES: r2 });
  await r2.put("gen-key-1", Buffer.from("imgdata"), { httpMetadata: { contentType: "image/png" } });
  const before = insertedRows.length;
  const res = await postsRoute.POST(jsonRequest({
    title: "私の部屋", handle: "me", category: "ゲーミング", description: "こだわり説明",
    items: "PC, 椅子",
    generatedImageKey: "gen-key-1",
  }));
  assert.equal(res.status, 201, `expected 201, got ${res.status}`);
  assert.match(res.headers.get("content-type") ?? "", /application\/json/);
  const data = await res.json();
  assert.ok(data.room && typeof data.room.id !== "undefined");
  assert.equal(insertedRows.length, before + 1, "D1 insert should have happened");
  assert.ok(!data.room.image.includes("example.com"), "fal temp URL must not be stored");
});

test("/api/posts POST with uploaded imageBase64 succeeds -> 201 JSON", async () => {
  setEnv({ DB: dbMock, ROOM_IMAGES: makeR2() });
  const before = insertedRows.length;
  const res = await postsRoute.POST(jsonRequest({
    title: "アップロード部屋", handle: "@up", category: "デスク", description: "説明",
    imageBase64: makeImageBase64("image/png"), imageType: "image/png",
  }));
  assert.equal(res.status, 201, `expected 201, got ${res.status}`);
  const data = await res.json();
  assert.ok(data.room);
  assert.equal(insertedRows.length, before + 1);
});

test("/api/posts POST rejects disallowed image type -> 400 JSON", async () => {
  setEnv({ DB: dbMock, ROOM_IMAGES: makeR2() });
  const res = await postsRoute.POST(jsonRequest({
    title: "部屋", handle: "@me", category: "デスク", description: "説明",
    imageBase64: makeImageBase64("image/gif"), imageType: "image/gif",
  }));
  assert.equal(res.status, 400);
});

test("/api/posts POST returns JSON (never empty) on storage failure", async () => {
  const brokenR2 = {
    get: async () => null,
    put: async () => { throw new Error("r2 down"); },
    delete: async () => {},
  };
  setEnv({ DB: dbMock, ROOM_IMAGES: brokenR2 });
  r2Objects.set("gen-x", { body: Buffer.from("x"), contentType: "image/png" });
  const res = await postsRoute.POST(jsonRequest({
    title: "部屋", handle: "@me", category: "デスク", description: "説明",
    generatedImageKey: "gen-x",
  }));
  assert.ok(res.status >= 400 && res.status < 600);
  assert.match(res.headers.get("content-type") ?? "", /application\/json/);
  const text = await res.text();
  assert.ok(text.length > 0, "response body must not be empty");
});

// ===========================================================================
// /api/generate
// ===========================================================================
test("/api/generate rejects empty prompt -> 400 JSON", async () => {
  setEnv({ FAL_KEY: "test-key" });
  const res = await generateRoute.POST(jsonRequest({ prompt: "" }));
  assert.equal(res.status, 400);
  assert.match(res.headers.get("content-type") ?? "", /application\/json/);
});

test("/api/generate rejects missing prompt -> 400 JSON", async () => {
  setEnv({ FAL_KEY: "test-key" });
  const res = await generateRoute.POST(jsonRequest({}));
  assert.equal(res.status, 400);
});

test("/api/generate without FAL_KEY -> 503 JSON", async () => {
  setEnv({});
  const res = await generateRoute.POST(jsonRequest({ prompt: "部屋" }));
  assert.equal(res.status, 503);
  assert.match(res.headers.get("content-type") ?? "", /application\/json/);
  const data = await res.json();
  assert.ok("error" in data);
});

test("/api/generate success returns imageKey JSON (not temp URL)", async () => {
  setEnv({ FAL_KEY: "test-key" });
  const res = await generateRoute.POST(jsonRequest({ prompt: "こだわり部屋" }));
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.imageKey);
  assert.ok(!String(data.imageKey).includes("http"), "imageKey must be an R2 key, not a temp URL");
});
