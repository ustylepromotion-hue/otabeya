"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Room = {
  id: string;
  remoteId?: number;
  title: string;
  user: string;
  category: string;
  image: string;
  likes: number;
  views: string;
  score: number;
  tag: string;
  description: string;
  shareCopy?: string;
  archetype?: string;
  tags?: string[];
  scores?: { unity?: number; obsession?: number; livedIn?: number; reproducibility?: number };
  commentCount?: number;
  llm?: boolean;
  products: { name: string; price?: string; query: string; reason?: string }[];
};

type ApiRoom = {
  id: number;
  title: string;
  handle: string;
  category: string;
  description: string;
  image: string;
  likes: number;
  commentCount: number;
  analysis: {
    score: number;
    caption: string;
    shareCopy: string;
    archetype: string;
    tags: string[];
    scores: { unity?: number; obsession?: number; livedIn?: number; reproducibility?: number };
    products: { name: string; query: string; reason: string }[];
    llm: boolean;
  };
};

type RoomComment = { id: number; handle: string; body: string; createdAt: string };

function fromApi(room: ApiRoom): Room {
  return {
    id: `db-${room.id}`,
    remoteId: room.id,
    title: room.title,
    user: room.handle,
    category: room.category,
    image: room.image,
    likes: room.likes,
    views: "NEW",
    score: room.analysis.score,
    tag: "COMMUNITY",
    description: room.analysis.caption || room.description,
    shareCopy: room.analysis.shareCopy,
    archetype: room.analysis.archetype,
    tags: room.analysis.tags,
    scores: room.analysis.scores,
    commentCount: room.commentCount,
    llm: room.analysis.llm,
    products: room.analysis.products,
  };
}

const rooms: Room[] = [
  {
    id: "sample-1",
    title: "仕事とゲームを、1.8畳に詰め込んだ。",
    user: "@shiro_setup",
    category: "デスク",
    image: "/rooms/room-6.jpg",
    likes: 1284,
    views: "18.2K",
    score: 92,
    tag: "AI PICK",
    description: "木目と白だけで整えた、PS5共存型ワークスペース。配線を見せないことに全振りしました。",
    products: [
      { name: "電動昇降デスク 120cm", price: "¥39,800〜", query: "電動昇降デスク 120cm 木目" },
      { name: "モニターライト", price: "¥6,980〜", query: "モニターライト デスク" },
      { name: "メッシュワークチェア", price: "¥29,800〜", query: "メッシュ ワークチェア 白" },
    ],
  },
  {
    id: "sample-2",
    title: "紫しか勝たん、深夜2時の没入基地。",
    user: "@yoru_no_gamer",
    category: "ゲーミング",
    image: "/rooms/room-7.jpg",
    likes: 2461,
    views: "31.8K",
    score: 97,
    tag: "BUZZING",
    description: "RGBは紫に固定。吸音材と間接照明で、配信の声も画も一段上に。",
    products: [
      { name: "RGBライトバー 2本組", price: "¥8,480〜", query: "RGB ライトバー ゲーミング" },
      { name: "吸音パネル", price: "¥4,999〜", query: "吸音パネル 黒 デスク" },
      { name: "75%メカニカルキーボード", price: "¥12,800〜", query: "75% メカニカルキーボード RGB" },
    ],
  },
  {
    id: "sample-3",
    title: "白PCに差し色オレンジ。自作勢の正解。",
    user: "@kibako_pc",
    category: "ゲーミング",
    image: "/rooms/room-8.jpg",
    likes: 891,
    views: "12.4K",
    score: 89,
    tag: "NEW",
    description: "白い自作PCとオレンジのデスクマット。機材は多くても、色数は増やさない。",
    products: [
      { name: "白色ミドルタワーケース", price: "¥18,900〜", query: "PCケース 白 ガラス ミドルタワー" },
      { name: "大型デスクマット", price: "¥3,480〜", query: "デスクマット オレンジ 大型" },
      { name: "モニターアーム", price: "¥9,980〜", query: "モニターアーム 白" },
    ],
  },
  {
    id: "sample-4",
    title: "レコードと真空管。音だけで夜を作る部屋。",
    user: "@needle_drop",
    category: "オーディオ",
    image: "/rooms/room-9.jpg",
    likes: 1742,
    views: "22.1K",
    score: 95,
    tag: "EDITOR'S",
    description: "ウォールナットの棚に、アナログだけを集めたリスニングコーナー。",
    products: [
      { name: "ベルトドライブ式ターンテーブル", price: "¥24,800〜", query: "ターンテーブル ベルトドライブ 木目" },
      { name: "プリメインアンプ", price: "¥42,000〜", query: "プリメインアンプ レトロ" },
      { name: "レコードスタンド", price: "¥2,200〜", query: "レコード ディスプレイ スタンド" },
    ],
  },
  {
    id: "sample-5",
    title: "好きなものだけ。創作オタクの昼の顔。",
    user: "@rough_and_draw",
    category: "クリエイター",
    image: "/rooms/room-10.jpg",
    likes: 664,
    views: "8.9K",
    score: 86,
    tag: "NEW",
    description: "壁のアートと植物、液タブ。散らかって見えない“作業中”を目指しました。",
    products: [
      { name: "デスクランプ クランプ式", price: "¥5,980〜", query: "デスクランプ クランプ 黒" },
      { name: "壁付けシェルフ", price: "¥4,400〜", query: "壁付けシェルフ 木製" },
      { name: "液晶ペンタブレット", price: "¥39,800〜", query: "液晶ペンタブレット" },
    ],
  },
  {
    id: "sample-6",
    title: "世界大会を見ながら育てた配信部屋。",
    user: "@frag_room",
    category: "ゲーミング",
    image: "/rooms/hero.jpg",
    likes: 3188,
    views: "46.7K",
    score: 99,
    tag: "HALL OF FAME",
    description: "デュアルモニターと撮影機材を常設。推しチームの歴史ごと壁に飾っています。",
    products: [
      { name: "27インチ ゲーミングモニター", price: "¥32,800〜", query: "27インチ ゲーミングモニター 165Hz" },
      { name: "USBコンデンサーマイク", price: "¥13,800〜", query: "USB コンデンサーマイク 配信" },
      { name: "RGBミドルタワーPCケース", price: "¥16,500〜", query: "RGB PCケース ミドルタワー" },
    ],
  },
];

const categories = ["すべて", "ゲーミング", "デスク", "オーディオ", "クリエイター"];

export default function Home() {
  const [category, setCategory] = useState("すべて");
  const [sort, setSort] = useState<"人気" | "新着">("人気");
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [likedRooms, setLikedRooms] = useState<Set<string>>(() => new Set());
  const [remoteRooms, setRemoteRooms] = useState<Room[]>([]);
  const [roomsLoaded, setRoomsLoaded] = useState(false);
  const [selected, setSelected] = useState<Room | null>(null);
  const [comments, setComments] = useState<RoomComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [reportRoom, setReportRoom] = useState<Room | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<"idle" | "analyzing" | "done">("idle");
  const [submittedRoom, setSubmittedRoom] = useState<Room | null>(null);
  const [toast, setToast] = useState("");
  const deepLinkHandled = useRef(false);

  const allRooms = useMemo(() => [...remoteRooms, ...rooms], [remoteRooms]);

  const filtered = useMemo(() => {
    const list = category === "すべて" ? [...allRooms] : allRooms.filter((room) => room.category === category);
    if (sort === "人気") list.sort((a, b) => b.likes - a.likes);
    return list;
  }, [allRooms, category, sort]);

  useEffect(() => {
    let active = true;
    fetch("/api/posts").then(async (response) => {
      if (!response.ok) return;
      const payload = await response.json() as { rooms?: ApiRoom[] };
      if (active) setRemoteRooms((payload.rooms ?? []).map(fromApi));
    }).catch(() => undefined).finally(() => active && setRoomsLoaded(true));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!roomsLoaded || deepLinkHandled.current) return;
    deepLinkHandled.current = true;
    const roomId = new URLSearchParams(window.location.search).get("room");
    const room = allRooms.find((item) => item.id === roomId);
    if (room) setSelected(room);
  }, [allRooms, roomsLoaded]);

  useEffect(() => {
    if (!selected?.remoteId) {
      setComments([]);
      return;
    }
    let active = true;
    setCommentsLoading(true);
    fetch(`/api/posts/${selected.remoteId}/comments`).then(async (response) => {
      if (!response.ok) throw new Error("comments");
      const payload = await response.json() as { comments?: RoomComment[] };
      if (active) setComments(payload.comments ?? []);
    }).catch(() => active && setComments([])).finally(() => active && setCommentsLoading(false));
    return () => { active = false; };
  }, [selected?.remoteId]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const toggleLike = async (room: Room) => {
    if (likedRooms.has(room.id)) return;
    setLikedRooms((current) => new Set(current).add(room.id));
    setLikes((current) => ({ ...current, [room.id]: 1 }));
    if (!room.remoteId) return;
    try {
      const response = await fetch(`/api/posts/${room.remoteId}/like`, { method: "POST" });
      if (!response.ok) throw new Error("like");
      const payload = await response.json() as { likes?: number };
      if (typeof payload.likes === "number") {
        setRemoteRooms((current) => current.map((item) => item.id === room.id ? { ...item, likes: payload.likes! } : item));
        setSelected((current) => current?.id === room.id ? { ...current, likes: payload.likes! } : current);
        setLikes((current) => ({ ...current, [room.id]: 0 }));
      }
    } catch {
      setLikes((current) => ({ ...current, [room.id]: 0 }));
      setLikedRooms((current) => { const next = new Set(current); next.delete(room.id); return next; });
      notify("いいねを保存できませんでした");
    }
  };

  const onImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const submitRoom = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("analyzing");
    const form = event.currentTarget;
    const started = Date.now();
    try {
      const response = await fetch("/api/posts", { method: "POST", body: new FormData(form) });
      const payload = await response.json() as { room?: ApiRoom; error?: string };
      if (!response.ok || !payload.room) throw new Error(payload.error || "post failed");
      const room = fromApi(payload.room);
      setSubmittedRoom(room);
      setRemoteRooms((current) => [room, ...current.filter((item) => item.id !== room.id)]);
      const wait = Math.max(0, 1500 - (Date.now() - started));
      window.setTimeout(() => setSubmitState("done"), wait);
    } catch (error) {
      setSubmitState("idle");
      notify(error instanceof Error ? error.message : "投稿の保存に失敗しました");
    }
  };

  const submitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected?.remoteId) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch(`/api/posts/${selected.remoteId}/comments`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ handle: data.get("handle"), body: data.get("body") }),
      });
      const payload = await response.json() as { comment?: RoomComment; error?: string };
      if (!response.ok || !payload.comment) throw new Error(payload.error || "コメントを投稿できませんでした");
      setComments((current) => [...current, payload.comment!]);
      setRemoteRooms((current) => current.map((room) => room.id === selected.id ? { ...room, commentCount: (room.commentCount ?? 0) + 1 } : room));
      form.reset();
    } catch (error) {
      notify(error instanceof Error ? error.message : "コメントを投稿できませんでした");
    }
  };

  const submitReport = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reportRoom?.remoteId) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch(`/api/posts/${reportRoom.remoteId}/report`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reason: data.get("reason"), details: data.get("details") }),
      });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error || "通報を受け付けられませんでした");
      setReportRoom(null);
      notify("通報を受け付けました。確認にご協力いただきありがとうございます");
    } catch (error) {
      notify(error instanceof Error ? error.message : "通報を受け付けられませんでした");
    }
  };

  const shareDetails = (room?: Room) => {
    const text = room ? `${room.shareCopy || `「${room.title}」推し密度 ${room.score}%`}｜OTABASE` : "あなたの“好き”は、部屋に出る。｜OTABASE";
    const url = new URL(window.location.href);
    if (room) url.searchParams.set("room", room.id);
    return { text, url: url.toString() };
  };

  const share = async (room?: Room) => {
    const details = shareDetails(room);
    try {
      if (navigator.share) await navigator.share({ title: "OTABASE", text: details.text, url: details.url });
      else {
        await navigator.clipboard.writeText(`${details.text} ${details.url}`);
        notify("シェア文をコピーしました");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      notify("シェアを開けませんでした");
    }
  };

  const shareTo = async (network: "x" | "line" | "copy", room: Room) => {
    const { text, url } = shareDetails(room);
    if (network === "copy") {
      await navigator.clipboard.writeText(`${text} ${url}`);
      notify("シェア文とリンクをコピーしました");
      return;
    }
    const target = network === "x"
      ? `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
      : `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(target, "_blank", "noopener,noreferrer,width=720,height=680");
  };

  const shareCard = async (room: Room) => {
    notify("シェアカードを生成中…");
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const next = new Image();
        next.onload = () => resolve(next);
        next.onerror = reject;
        next.src = room.image;
      });
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 630;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("canvas unavailable");

      context.fillStyle = "#0b0b0b";
      context.fillRect(0, 0, canvas.width, canvas.height);
      const targetRatio = 560 / 630;
      const sourceRatio = image.width / image.height;
      let sourceWidth = image.width;
      let sourceHeight = image.height;
      let sourceX = 0;
      let sourceY = 0;
      if (sourceRatio > targetRatio) {
        sourceWidth = image.height * targetRatio;
        sourceX = (image.width - sourceWidth) / 2;
      } else {
        sourceHeight = image.width / targetRatio;
        sourceY = (image.height - sourceHeight) / 2;
      }
      context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 640, 0, 560, 630);
      const shade = context.createLinearGradient(540, 0, 850, 0);
      shade.addColorStop(0, "#0b0b0b");
      shade.addColorStop(1, "rgba(11,11,11,0)");
      context.fillStyle = shade;
      context.fillRect(530, 0, 330, 630);

      context.fillStyle = "#d7ff35";
      context.fillRect(56, 52, 84, 7);
      context.font = "900 34px Arial, sans-serif";
      context.fillText("OTABASE", 56, 102);
      context.font = "700 16px Arial, sans-serif";
      context.fillStyle = "#a8a8a8";
      context.fillText("THE ROOM SAYS EVERYTHING.", 56, 137);

      const title = room.shareCopy || room.title;
      context.fillStyle = "#ffffff";
      context.font = "900 48px Arial, sans-serif";
      const characters = [...title];
      const lines: string[] = [];
      let line = "";
      for (const character of characters) {
        const candidate = line + character;
        if (context.measureText(candidate).width > 505 && line) {
          lines.push(line);
          line = character;
          if (lines.length === 3) break;
        } else line = candidate;
      }
      if (line && lines.length < 3) lines.push(line);
      lines.forEach((value, index) => context.fillText(value, 56, 220 + index * 64));

      context.fillStyle = "#d7ff35";
      context.font = "900 108px Arial, sans-serif";
      context.fillText(String(room.score), 56, 510);
      context.font = "800 18px Arial, sans-serif";
      context.fillText("/ 100  推し密度", 185, 505);
      context.fillStyle = "#ffffff";
      context.font = "700 18px Arial, sans-serif";
      context.fillText(room.archetype || `${room.category}没入型`, 58, 551);
      context.fillStyle = "#8a8a8a";
      context.font = "600 14px Arial, sans-serif";
      context.fillText(`${room.user}  #OTABASE`, 58, 588);

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png", 0.94));
      if (!blob) throw new Error("image unavailable");
      const file = new File([blob], `otabase-${room.id}.png`, { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        const { text, url } = shareDetails(room);
        await navigator.share({ title: "OTABASE ROOM CARD", text, url, files: [file] });
      } else {
        const download = document.createElement("a");
        download.href = URL.createObjectURL(blob);
        download.download = file.name;
        download.click();
        window.setTimeout(() => URL.revokeObjectURL(download.href), 1000);
        notify("シェアカードを保存しました");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      notify("シェアカードを生成できませんでした");
    }
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="OTABASE ホーム">
          OTA<span>BASE</span><sup>β</sup>
        </a>
        <nav className="desktop-nav" aria-label="メインナビゲーション">
          <a href="#rooms">ROOMS</a>
          <button onClick={() => setAiOpen(true)}>AI SCAN</button>
          <a href="#ranking">RANKING</a>
          <a href="#about">ABOUT</a>
        </nav>
        <button className="post-button" onClick={() => setSubmitOpen(true)}>
          <span>＋</span> 部屋を投稿
        </button>
      </header>

      <section id="top" className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow"><span /> THE ROOM SAYS EVERYTHING.</p>
          <h1>あなたの<span>“好き”</span>は、<br />部屋に出る。</h1>
          <p className="hero-lead">ゲーム、アニメ、音楽、ガジェット。<br />偏愛を詰め込んだ部屋を見せ合う、オタク部屋投稿コミュニティ。</p>
          <div className="hero-actions">
            <button className="primary-action" onClick={() => setSubmitOpen(true)}>自慢の部屋を投稿する <b>↗</b></button>
            <button className="text-action" onClick={() => document.querySelector("#rooms")?.scrollIntoView({ behavior: "smooth" })}>みんなの部屋を見る <span>↓</span></button>
          </div>
          <div className="hero-stats">
            <div><strong>12,840</strong><small>ROOMS POSTED</small></div>
            <div><strong>486K</strong><small>MONTHLY LIKES</small></div>
            <div><strong>94%</strong><small>AI SCAN RATE</small></div>
          </div>
        </div>
        <button className="hero-visual" onClick={() => setSelected(rooms[5])} aria-label="殿堂入りの部屋を見る">
          <img src="/rooms/hero.jpg" alt="デュアルモニターとゲーミングPCのある部屋" />
          <span className="vertical-label">ROOM OF THE WEEK — 047</span>
          <span className="score-stamp"><b>AI</b><strong>99</strong><small>PREFERENCE<br />DENSITY</small></span>
          <span className="hero-caption"><em>HALL OF FAME</em>世界大会を見ながら育てた配信部屋。<b>↗</b></span>
        </button>
      </section>

      <section className="ticker" aria-label="人気タグ">
        <div>RGBは正義 <b>✦</b> 4.5畳の宇宙船 <b>✦</b> 推し棚が本体 <b>✦</b> 配線消失バグ <b>✦</b> 深夜の要塞 <b>✦</b> デスク沼からの便り <b>✦</b></div>
      </section>

      <section id="rooms" className="rooms-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> DISCOVER ROOMS</p>
            <h2>偏愛の数だけ、<br />部屋がある。</h2>
          </div>
          <p>AIが写真から“推し密度”を解析。<br />気になる部屋は、使っているモノまで全部わかる。</p>
        </div>

        <div className="filter-row">
          <div className="category-tabs" role="tablist" aria-label="部屋カテゴリ">
            {categories.map((item) => (
              <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
          <div className="sort-toggle">
            {(["人気", "新着"] as const).map((item) => (
              <button key={item} className={sort === item ? "active" : ""} onClick={() => setSort(item)}>{item}</button>
            ))}
          </div>
        </div>

        <div className="room-grid">
          {filtered.map((room, index) => (
            <article className={`room-card card-${index % 3}`} key={room.id}>
              <button className="image-button" onClick={() => setSelected(room)}>
                <img src={room.image} alt={room.title} />
                <span className="card-tag">{room.tag}</span>
                <span className="card-score"><b>{room.score}</b><small>推し密度</small></span>
                <span className="view-room">ROOM TOUR ↗</span>
              </button>
              <div className="card-meta"><span>{room.category}</span><span>{room.views} VIEWS</span></div>
              <button className="card-title" onClick={() => setSelected(room)}>{room.title}</button>
              <div className="card-footer">
                <span>{room.user}</span>
                <span className="card-reactions"><small>COM {room.commentCount ?? 0}</small><button className={likedRooms.has(room.id) ? "liked" : ""} onClick={() => toggleLike(room)} aria-label="いいね">♡ {room.likes + (likes[room.id] || 0)}</button></span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ai-section" id="about">
        <div className="ai-copy">
          <p className="eyebrow light"><span /> POWERED BY ROOM INTELLIGENCE</p>
          <h2>ただ載せるだけじゃ、<br />もったいない。</h2>
          <p>OTABASE AIが写真を読み解き、あなたの部屋を“語れるコンテンツ”に変換します。</p>
          <button onClick={() => setAiOpen(true)}>AI SCANを試す <b>↗</b></button>
        </div>
        <div className="ai-console">
          <div className="console-top"><span>OTABASE / ROOM INTELLIGENCE</span><span>ANALYSIS COMPLETE ●</span></div>
          <div className="scan-layout">
            <div className="scan-image"><img src="/rooms/room-8.jpg" alt="AI解析中のPCデスク" /><i className="scan-line" /><i className="focus-box one" /><i className="focus-box two" /></div>
            <div className="scan-data">
              <span>ROOM DNA</span>
              <strong>推し密度 <b>89%</b></strong>
              <div className="bars">
                <label>統一感 <i style={{ width: "92%" }} /></label>
                <label>沼の深さ <i style={{ width: "86%" }} /></label>
                <label>生活感ゼロ <i style={{ width: "74%" }} /></label>
                <label>真似したさ <i style={{ width: "96%" }} /></label>
              </div>
              <p>「白×オレンジ」の色設計に迷いがない。自作PC勢の美学と、配線管理への執念を検出しました。</p>
            </div>
          </div>
          <div className="console-footer"><span>Detected: PC CASE / MONITOR ARM / DESK MAT / HEADSET</span><span>4 ITEMS MATCHED</span></div>
        </div>
      </section>

      <section className="viral-section">
        <div className="viral-card">
          <span className="viral-kicker">AI GENERATES YOUR ROOM CARD</span>
          <strong>わたしの部屋、<br />推し密度 <b>97%</b> でした。</strong>
          <div className="viral-tags">#紫しか勝たん　#深夜の没入基地　#OTABASE</div>
          <div className="viral-score"><small>ROOM DNA</small><em>97</em><span>/100</span></div>
        </div>
        <div className="viral-copy">
          <p className="eyebrow"><span /> SHARE &amp; GO VIRAL</p>
          <h2>診断結果まで、<br />シェアしたくなる。</h2>
          <p>AIがあなた専用のルームカードと紹介文を自動生成。X・Instagram・LINEへワンタップで。</p>
          <button className="primary-action" onClick={() => setShareOpen(true)}>シェアカードを作る <b>↗</b></button>
        </div>
      </section>

      <section id="ranking" className="ranking-section">
        <div className="ranking-head"><div><p className="eyebrow light"><span /> OTA LEAGUE</p><h2>今週、最も刺さった部屋。</h2></div><span>WEEK 29 / 2026</span></div>
        {allRooms.slice().sort((a, b) => b.likes - a.likes).slice(0, 3).map((room, index) => (
          <button className="ranking-row" key={room.id} onClick={() => setSelected(room)}>
            <b>0{index + 1}</b><img src={room.image} alt="" /><span><small>{room.category}</small><strong>{room.title}</strong><em>{room.user}</em></span><span className="rank-score">♡ {room.likes}<i>{room.score}<small>AI</small></i></span><span className="rank-arrow">↗</span>
          </button>
        ))}
      </section>

      <section className="cta-section">
        <p className="eyebrow"><span /> YOUR ROOM DESERVES THE SPOTLIGHT</p>
        <h2>見せてくれ。<br />あなたの<span>“好き”</span>の全部を。</h2>
        <button className="primary-action" onClick={() => setSubmitOpen(true)}>今すぐ部屋を投稿する <b>↗</b></button>
        <small>投稿無料・写真1枚から / AIが紹介文をサポート</small>
      </section>

      <footer>
        <div className="footer-brand"><a className="brand" href="#top">OTA<span>BASE</span><sup>β</sup></a><p>偏愛を、部屋から世界へ。</p></div>
        <div className="footer-links"><div><b>EXPLORE</b><a href="#rooms">新着の部屋</a><a href="#ranking">ランキング</a><button onClick={() => setAiOpen(true)}>AI SCAN</button></div><div><b>GUIDE</b><a href="#about">OTABASEとは</a><button onClick={() => setSubmitOpen(true)}>投稿ガイド</button><button onClick={() => setRulesOpen(true)}>コミュニティルール</button></div><div><b>FOLLOW</b><button onClick={() => share()}>X / TWITTER</button><button onClick={() => share()}>INSTAGRAM</button><button onClick={() => share()}>TIKTOK</button></div></div>
        <div className="footer-bottom"><span>© 2026 OTABASE</span><span>PRIVACY　 TERMS　 CONTACT</span><span>MADE FOR EVERY OBSESSION.</span></div>
      </footer>

      {selected && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}>
          <section className="room-modal" role="dialog" aria-modal="true" aria-label={selected.title}>
            <button className="modal-close" onClick={() => setSelected(null)}>CLOSE ×</button>
            <div className="modal-image"><img src={selected.image} alt={selected.title} /><span>AI SCORE <b>{selected.score}</b></span></div>
            <div className="modal-content">
              <p className="eyebrow"><span /> {selected.category} / {selected.user}</p>
              <h2>{selected.title}</h2>
              <p>{selected.description}</p>
              {selected.archetype && <p className="room-archetype">ROOM TYPE — {selected.archetype}</p>}
              {selected.tags && <div className="room-tags">{selected.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
              <div className="dna-row"><span><b>{selected.score}</b>推し密度</span><span><b>{selected.scores?.reproducibility ?? 88}</b>真似したさ</span><span><b>{selected.likes + (likes[selected.id] || 0)}</b>いいね</span></div>
              <h3>この部屋を再現する</h3>
              <div className="product-list">
                {selected.products.map((product, index) => (
                  <a key={`${product.name}-${product.query}`} href={`/api/out?room=${encodeURIComponent(selected.id)}&q=${encodeURIComponent(product.query)}&name=${encodeURIComponent(product.name)}&position=${index + 1}`} target="_blank" rel="noreferrer sponsored"><span>{product.name}<small>{product.price || product.reason}</small></span><b>Amazonで見る ↗</b></a>
                ))}
              </div>
              <p className="affiliate-note">商品リンクにはアフィリエイト広告が含まれます。</p>
              <div className="modal-actions"><button className="primary-action" onClick={() => share(selected)}>この部屋をシェア <b>↗</b></button><button onClick={() => toggleLike(selected)}>♡ いいね</button></div>
              <button className="share-card-action" onClick={() => shareCard(selected)}>実画像入りルームカードを共有・保存 ↗</button>
              <div className="social-share-row"><button onClick={() => shareTo("x", selected)}>Xでシェア</button><button onClick={() => shareTo("line", selected)}>LINE</button><button onClick={() => shareTo("copy", selected)}>リンクをコピー</button></div>
              {selected.remoteId && <button className="report-action" onClick={() => setReportRoom(selected)}>この投稿を通報する</button>}
              <section className="comments-section">
                <h3>ROOM TALK <span>{comments.length}</span></h3>
                {selected.remoteId ? <>
                  <div className="comment-list">
                    {commentsLoading ? <p>コメントを読み込み中…</p> : comments.length ? comments.map((comment) => <article key={comment.id}><b>{comment.handle}</b><p>{comment.body}</p></article>) : <p>最初のひとことを残してみよう。</p>}
                  </div>
                  <form onSubmit={submitComment} className="comment-form"><input name="handle" required maxLength={32} placeholder="@your_name" /><textarea name="body" required maxLength={300} placeholder="この部屋の刺さったポイントは？" /><button>コメントする ↗</button></form>
                </> : <p className="comment-preview-note">コミュニティ投稿では、ここから部屋主にコメントできます。</p>}
              </section>
            </div>
          </section>
        </div>
      )}

      {submitOpen && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setSubmitOpen(false)}>
          <section className="submit-modal" role="dialog" aria-modal="true" aria-label="部屋を投稿">
            <button className="modal-close" onClick={() => setSubmitOpen(false)}>CLOSE ×</button>
            {submitState === "done" ? (
              <div className="submit-complete"><span>{submittedRoom?.llm ? "OPENAI VISION SCAN COMPLETE" : "LOCAL PREVIEW COMPLETE"}</span><strong>推し密度<br /><b>{submittedRoom?.score ?? 94}%</b></strong><h2>{submittedRoom?.archetype || "その部屋、かなり刺さります。"}</h2><p>{submittedRoom?.description || "紹介文とシェアカードの下書きを作成しました。"}</p>{submittedRoom && !submittedRoom.llm && <small className="scan-mode-note">公開環境にAIキーを設定すると、写真そのものを解析した診断に切り替わります。</small>}<button className="primary-action" onClick={() => { setSubmitOpen(false); setSubmitState("idle"); setPreview(null); if (submittedRoom) setSelected(submittedRoom); notify("部屋を公開しました"); }}>投稿を見る ↗</button></div>
            ) : (
              <form onSubmit={submitRoom}>
                <p className="eyebrow"><span /> POST YOUR ROOM</p><h2>“好き”の全部を、<br />1枚から。</h2>
                <label className={`upload-zone ${preview ? "has-preview" : ""}`}>
                  {preview ? <img src={preview} alt="投稿写真のプレビュー" /> : <><b>＋</b><strong>部屋の写真を選ぶ</strong><small>JPG / PNG / WEBP・最大10MB</small></>}
                  <input type="file" name="image" accept="image/jpeg,image/png,image/webp" required onChange={onImage} />
                </label>
                <div className="form-grid"><label>タイトル<input name="title" required placeholder="例：4.5畳に作った深夜の要塞" /></label><label>ユーザー名<input name="handle" required placeholder="@your_name" /></label></div>
                <label>カテゴリ<select name="category" defaultValue="ゲーミング">{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
                <label>こだわりポイント<textarea name="description" required placeholder="この部屋でいちばん見てほしいところは？" /></label>
                <label>使っているアイテム（任意）<input name="items" placeholder="デスク、ライト、チェアなど" /></label>
                <button className="primary-action submit-action" disabled={submitState === "analyzing"}>{submitState === "analyzing" ? "AIが部屋を解析中…" : "AI SCANして投稿する ↗"}</button>
              </form>
            )}
          </section>
        </div>
      )}

      {aiOpen && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setAiOpen(false)}>
          <section className="simple-modal ai-demo" role="dialog" aria-modal="true" aria-label="AI SCANデモ">
            <button className="modal-close" onClick={() => setAiOpen(false)}>CLOSE ×</button>
            <p className="eyebrow light"><span /> ROOM INTELLIGENCE</p><h2>写真1枚から、<br />部屋の偏愛を言語化。</h2><div className="demo-score"><span>推し密度</span><b>94</b><em>/100</em></div><p>色設計、アイテム、配置、生活感を横断して分析。投稿タイトル、紹介文、タグ、シェアカード、買い物リストの候補まで自動生成します。</p><button className="primary-action" onClick={() => { setAiOpen(false); setSubmitOpen(true); }}>自分の部屋をスキャン ↗</button>
          </section>
        </div>
      )}

      {shareOpen && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setShareOpen(false)}>
          <section className="simple-modal share-modal" role="dialog" aria-modal="true" aria-label="シェアカード作成">
            <button className="modal-close" onClick={() => setShareOpen(false)}>CLOSE ×</button><p className="eyebrow light"><span /> VIRAL CARD GENERATOR</p><h2>あなたの部屋にも、<br />名前をつけよう。</h2><p>部屋を投稿すると、AIが“推し密度”とキャッチコピーを診断。SNSに最適なカードを自動生成します。</p><button className="primary-action" onClick={() => { setShareOpen(false); setSubmitOpen(true); }}>写真を選んで作る ↗</button><button className="ghost-action" onClick={() => share()}>OTABASEを友だちにシェア</button>
          </section>
        </div>
      )}

      {rulesOpen && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setRulesOpen(false)}>
          <section className="simple-modal rules-modal" role="dialog" aria-modal="true" aria-label="コミュニティルール">
            <button className="modal-close" onClick={() => setRulesOpen(false)}>CLOSE ×</button>
            <p className="eyebrow light"><span /> COMMUNITY RULES</p><h2>偏愛には敬意を。<br />人にはやさしく。</h2>
            <ol><li><b>自分が権利を持つ写真を投稿する。</b><span>他人の部屋・人物・作品を無断掲載しないでください。</span></li><li><b>好きの大小を競わせない。</b><span>部屋の広さ、金額、暮らし方や人の属性を嘲笑しないでください。</span></li><li><b>危険・成人向け・違法な内容を載せない。</b><span>個人情報や住所が写り込んでいないか投稿前に確認してください。</span></li><li><b>商品紹介は正直に。</b><span>広告・宣伝・提供品は投稿文で明示してください。</span></li></ol>
            <p>ルール違反が疑われる投稿は詳細画面から通報できます。複数の通報が集まった投稿は自動的に確認待ちになります。</p>
          </section>
        </div>
      )}

      {reportRoom && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setReportRoom(null)}>
          <section className="report-modal" role="dialog" aria-modal="true" aria-label="投稿を通報">
            <button className="modal-close" onClick={() => setReportRoom(null)}>CLOSE ×</button>
            <p className="eyebrow"><span /> REPORT ROOM</p><h2>この投稿を<br />確認依頼しますか？</h2><p className="report-target">{reportRoom.title}</p>
            <form onSubmit={submitReport}><label>理由<select name="reason" required defaultValue=""><option value="" disabled>選択してください</option><option>権利侵害</option><option>嫌がらせ・差別</option><option>成人向け・危険物</option><option>スパム・宣伝</option><option>その他</option></select></label><label>補足（任意）<textarea name="details" maxLength={500} placeholder="運営が確認しやすい情報を入力してください" /></label><button className="primary-action">確認を依頼する ↗</button></form>
          </section>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}
