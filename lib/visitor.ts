const cookieName = "otabase_visitor";

export function visitorFrom(request: Request) {
  const cookies = request.headers.get("cookie") ?? "";
  const matched = cookies.match(new RegExp(`(?:^|;\\s*)${cookieName}=([a-f0-9-]{36})`));
  if (matched) return { id: matched[1], cookie: null };

  const id = crypto.randomUUID();
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return {
    id,
    cookie: `${cookieName}=${id}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax${secure}`,
  };
}

export function jsonWithVisitor(payload: unknown, visitorCookie: string | null, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  if (visitorCookie) headers.set("set-cookie", visitorCookie);
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(payload), { ...init, headers });
}
