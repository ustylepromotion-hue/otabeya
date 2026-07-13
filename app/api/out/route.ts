import { env } from "cloudflare:workers";
import { getDb } from "../../../db";
import { affiliateClicks } from "../../../db/schema";

type AffiliateEnv = { AMAZON_ASSOCIATE_TAG?: string };

export async function GET(request: Request) {
  const source = new URL(request.url);
  const query = (source.searchParams.get("q") ?? "").trim().slice(0, 100);
  const productName = (source.searchParams.get("name") ?? "関連アイテム").trim().slice(0, 80);
  const roomRef = (source.searchParams.get("room") ?? "unknown").trim().slice(0, 80);
  const position = Math.max(1, Math.min(20, Number(source.searchParams.get("position")) || 1));

  if (!query) return Response.json({ error: "検索語がありません" }, { status: 400 });

  try {
    await getDb().insert(affiliateClicks).values({ roomRef, productName, query, position });
  } catch {
    // 購入導線は、計測基盤が一時停止していても利用できるようにする。
  }

  const target = new URL("https://www.amazon.co.jp/s");
  target.searchParams.set("k", query);
  const tag = (env as unknown as AffiliateEnv).AMAZON_ASSOCIATE_TAG?.trim();
  if (tag && /^[a-zA-Z0-9-]{3,40}$/.test(tag)) target.searchParams.set("tag", tag);

  return new Response(null, {
    status: 302,
    headers: { location: target.toString(), "cache-control": "no-store" },
  });
}
