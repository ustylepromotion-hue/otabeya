import { env } from "cloudflare:workers";

export type FalEnv = {
  FAL_KEY?: string;
  FAL_MODEL?: string;
};

// テキスト→画像のデフォルトモデル（fal公式の現行モデルID）。
// FAL_MODEL 環境変数で差し替え可能にする。
const DEFAULT_FAL_MODEL = "fal-ai/flux/dev";

// 許可する出力形式とサイズ（入力検証用ホワイトリスト）。
const ALLOWED_OUTPUT_FORMATS = new Set(["png", "jpeg", "webp"]);
const ALLOWED_IMAGE_SIZES = new Set([
  "square_hd",
  "portrait_4_3",
  "landscape_4_3",
  "square",
  "portrait_16_9",
  "landscape_16_9",
]);

export class FalApiError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "FalApiError";
    this.status = status;
  }
}

export class FalRateLimitError extends FalApiError {
  constructor(message = "画像生成が一時的に混雑しています。少し待ってから再度お試しください。") {
    super(message, 429);
    this.name = "FalRateLimitError";
  }
}

export class FalInvalidKeyError extends FalApiError {
  constructor(message = "画像生成キーが無効です。運営にご連絡ください。") {
    super(message, 401);
    this.name = "FalInvalidKeyError";
  }
}

function modelEndpoint(model: string): string {
  return `https://queue.fal.run/${model}`;
}

function extractImageUrl(payload: Record<string, unknown>): string | null {
  const p = payload as { images?: unknown; image?: unknown; data?: { images?: unknown; image?: unknown } };
  const data = (p.data ?? {}) as { images?: unknown; image?: unknown };
  const images = p.images ?? p.image ?? data.images ?? data.image;
  if (Array.isArray(images)) {
    const first = images[0] as { url?: unknown } | undefined;
    return typeof first?.url === "string" ? first.url : null;
  }
  if (images && typeof images === "object") {
    const single = images as { url?: unknown };
    return typeof single.url === "string" ? single.url : null;
  }
  if (typeof p.url === "string") return p.url;
  if (typeof p.image === "string") return p.image;
  return null;
}

async function readJson(response: Response): Promise<Record<string, unknown>> {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { raw: text };
  }
}

async function submitRequest(model: string, apiKey: string, input: unknown): Promise<Record<string, unknown>> {
  const response = await fetch(modelEndpoint(model), {
    method: "POST",
    headers: { authorization: `Key ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify(input),
  });

  const payload = await readJson(response);

  if (!response.ok) {
    const detail = (payload.detail || payload.error || payload.message) as string | undefined;
    const message = typeof detail === "string" ? detail : JSON.stringify(detail ?? payload);
    if (response.status === 401 || response.status === 403) throw new FalInvalidKeyError();
    if (response.status === 429) throw new FalRateLimitError();
    if (response.status === 404) throw new FalApiError(`モデル ${model} が見つかりません。`, 404);
    throw new FalApiError(message || `fal.ai がエラーを返しました（${response.status}）。`);
  }
  return payload;
}

async function pollResult(model: string, payload: Record<string, unknown>, apiKey: string): Promise<string> {
  const immediate = extractImageUrl(payload);
  if (immediate) return immediate;

  const statusUrl = payload.status_url as string | undefined;
  const responseUrl = payload.response_url as string | undefined;

  if (responseUrl) {
    const res = await fetch(responseUrl, { headers: { authorization: `Key ${apiKey}` } });
    const result = await readJson(res);
    if (res.ok) {
      const url = extractImageUrl(result);
      if (url) return url;
    }
  }

  if (!statusUrl) throw new FalApiError("fal.ai の応答に結果URLがありません。");

  // キュー経由の非同期ポーリング（最大約60秒）。
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const statusRes = await fetch(statusUrl, { headers: { authorization: `Key ${apiKey}` } });
    const status = await readJson(statusRes);
    if (!statusRes.ok) {
      const detail = (status.detail || status.error) as string | undefined;
      throw new FalApiError(typeof detail === "string" ? detail : "fal.ai の生成状態確認に失敗しました。");
    }
    const state = status.status as string | undefined;
    if (state === "FAILED") {
      const detail = (status.error || status.detail) as string | undefined;
      throw new FalApiError(typeof detail === "string" ? detail : "fal.ai の画像生成が失敗しました。");
    }
    if (state && state !== "IN_QUEUE" && state !== "IN_PROGRESS") {
      // COMPLETED 等の終端状態なら結果を取得。
      if (responseUrl) {
        const res = await fetch(responseUrl, { headers: { authorization: `Key ${apiKey}` } });
        const result = await readJson(res);
        if (res.ok) {
          const url = extractImageUrl(result);
          if (url) return url;
        }
      }
      break;
    }
  }
  throw new FalApiError("fal.ai の画像生成がタイムアウトしました。少し待って再試行してください。");
}

export type GenerateInput = {
  prompt: string;
  imageSize?: string;
  outputFormat?: string;
  numImages?: number;
};

export type GenerateResult = {
  url: string;
  contentType: string;
};

export async function generateImage(input: GenerateInput): Promise<GenerateResult> {
  const falEnv = env as unknown as FalEnv;
  if (!falEnv.FAL_KEY) throw new FalApiError("画像生成キーが設定されていません。", 503);

  const prompt = input.prompt.trim();
  if (!prompt) throw new FalApiError("プロンプトが空です。", 400);
  if (prompt.length > 1000) throw new FalApiError("プロンプトが長すぎます（1000文字以内）。", 400);

  const outputFormat = ALLOWED_OUTPUT_FORMATS.has(input.outputFormat ?? "png")
    ? input.outputFormat ?? "png"
    : "png";
  const imageSize = ALLOWED_IMAGE_SIZES.has(input.imageSize ?? "square_hd")
    ? input.imageSize ?? "square_hd"
    : "square_hd";
  const numImages = Math.min(Math.max(Number(input.numImages) || 1, 1), 4);

  const model = falEnv.FAL_MODEL?.trim() || DEFAULT_FAL_MODEL;

  const falInput = {
    prompt,
    image_size: imageSize,
    num_images: numImages,
    output_format: outputFormat,
    guidance_scale: 3.5,
    num_inference_steps: 28,
    enable_safety_checker: true,
  };

  const submitPayload = await submitRequest(model, falEnv.FAL_KEY, falInput);
  const url = await pollResult(model, submitPayload, falEnv.FAL_KEY);
  const contentType = outputFormat === "png" ? "image/png" : outputFormat === "webp" ? "image/webp" : "image/jpeg";
  return { url, contentType };
}
