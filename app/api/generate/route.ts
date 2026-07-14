import { generateImage, FalApiError, FalRateLimitError, FalInvalidKeyError } from "../../../lib/fal";
import { storeRemoteImage } from "../../../lib/r2";

const MAX_PROMPT = 1000;

export async function POST(request: Request) {
  let body: { prompt?: unknown; imageSize?: unknown; outputFormat?: unknown; numImages?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON 形式が正しくありません。" }, { status: 400 });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    return Response.json({ error: "画像の説明（プロンプト）を入力してください。" }, { status: 400 });
  }
  if (prompt.length > MAX_PROMPT) {
    return Response.json({ error: `プロンプトは${MAX_PROMPT}文字以内で入力してください。` }, { status: 400 });
  }

  try {
    const result = await generateImage({
      prompt,
      imageSize: typeof body.imageSize === "string" ? body.imageSize : undefined,
      outputFormat: typeof body.outputFormat === "string" ? body.outputFormat : undefined,
      numImages: typeof body.numImages === "number" ? body.numImages : undefined,
    });

    // fal の一時 URL を恒久化：R2 に保存し、参照キーのみを返す。
    const stored = await storeRemoteImage(result.url, result.contentType);
    return Response.json({ imageKey: stored.key, contentType: stored.contentType });
  } catch (error) {
    if (error instanceof FalInvalidKeyError) {
      return Response.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof FalRateLimitError) {
      return Response.json({ error: error.message }, { status: 429 });
    }
    if (error instanceof FalApiError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "画像生成中にエラーが発生しました。";
    return Response.json({ error: message }, { status: 500 });
  }
}
