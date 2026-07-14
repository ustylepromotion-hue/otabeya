import { a as require_react, o as __toESM, t as require_jsx_runtime } from "../index.js";
//#region app/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function fromApi(room) {
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
		products: room.analysis.products
	};
}
var rooms = [
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
			{
				name: "電動昇降デスク 120cm",
				price: "¥39,800〜",
				query: "電動昇降デスク 120cm 木目"
			},
			{
				name: "モニターライト",
				price: "¥6,980〜",
				query: "モニターライト デスク"
			},
			{
				name: "メッシュワークチェア",
				price: "¥29,800〜",
				query: "メッシュ ワークチェア 白"
			}
		]
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
			{
				name: "RGBライトバー 2本組",
				price: "¥8,480〜",
				query: "RGB ライトバー ゲーミング"
			},
			{
				name: "吸音パネル",
				price: "¥4,999〜",
				query: "吸音パネル 黒 デスク"
			},
			{
				name: "75%メカニカルキーボード",
				price: "¥12,800〜",
				query: "75% メカニカルキーボード RGB"
			}
		]
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
			{
				name: "白色ミドルタワーケース",
				price: "¥18,900〜",
				query: "PCケース 白 ガラス ミドルタワー"
			},
			{
				name: "大型デスクマット",
				price: "¥3,480〜",
				query: "デスクマット オレンジ 大型"
			},
			{
				name: "モニターアーム",
				price: "¥9,980〜",
				query: "モニターアーム 白"
			}
		]
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
			{
				name: "ベルトドライブ式ターンテーブル",
				price: "¥24,800〜",
				query: "ターンテーブル ベルトドライブ 木目"
			},
			{
				name: "プリメインアンプ",
				price: "¥42,000〜",
				query: "プリメインアンプ レトロ"
			},
			{
				name: "レコードスタンド",
				price: "¥2,200〜",
				query: "レコード ディスプレイ スタンド"
			}
		]
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
			{
				name: "デスクランプ クランプ式",
				price: "¥5,980〜",
				query: "デスクランプ クランプ 黒"
			},
			{
				name: "壁付けシェルフ",
				price: "¥4,400〜",
				query: "壁付けシェルフ 木製"
			},
			{
				name: "液晶ペンタブレット",
				price: "¥39,800〜",
				query: "液晶ペンタブレット"
			}
		]
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
			{
				name: "27インチ ゲーミングモニター",
				price: "¥32,800〜",
				query: "27インチ ゲーミングモニター 165Hz"
			},
			{
				name: "USBコンデンサーマイク",
				price: "¥13,800〜",
				query: "USB コンデンサーマイク 配信"
			},
			{
				name: "RGBミドルタワーPCケース",
				price: "¥16,500〜",
				query: "RGB PCケース ミドルタワー"
			}
		]
	}
];
var categories = [
	"すべて",
	"ゲーミング",
	"デスク",
	"オーディオ",
	"クリエイター"
];
function Home() {
	const [category, setCategory] = (0, import_react.useState)("すべて");
	const [sort, setSort] = (0, import_react.useState)("人気");
	const [likes, setLikes] = (0, import_react.useState)({});
	const [likedRooms, setLikedRooms] = (0, import_react.useState)(() => /* @__PURE__ */ new Set());
	const [remoteRooms, setRemoteRooms] = (0, import_react.useState)([]);
	const [roomsLoaded, setRoomsLoaded] = (0, import_react.useState)(false);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [comments, setComments] = (0, import_react.useState)([]);
	const [commentsLoading, setCommentsLoading] = (0, import_react.useState)(false);
	const [submitOpen, setSubmitOpen] = (0, import_react.useState)(false);
	const [aiOpen, setAiOpen] = (0, import_react.useState)(false);
	const [shareOpen, setShareOpen] = (0, import_react.useState)(false);
	const [rulesOpen, setRulesOpen] = (0, import_react.useState)(false);
	const [reportRoom, setReportRoom] = (0, import_react.useState)(null);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [submitState, setSubmitState] = (0, import_react.useState)("idle");
	const [submittedRoom, setSubmittedRoom] = (0, import_react.useState)(null);
	const [toast, setToast] = (0, import_react.useState)("");
	const deepLinkHandled = (0, import_react.useRef)(false);
	const allRooms = (0, import_react.useMemo)(() => [...remoteRooms, ...rooms], [remoteRooms]);
	const filtered = (0, import_react.useMemo)(() => {
		const list = category === "すべて" ? [...allRooms] : allRooms.filter((room) => room.category === category);
		if (sort === "人気") list.sort((a, b) => b.likes - a.likes);
		return list;
	}, [
		allRooms,
		category,
		sort
	]);
	(0, import_react.useEffect)(() => {
		let active = true;
		fetch("/api/posts").then(async (response) => {
			if (!response.ok) return;
			const payload = await response.json();
			if (active) setRemoteRooms((payload.rooms ?? []).map(fromApi));
		}).catch(() => void 0).finally(() => active && setRoomsLoaded(true));
		return () => {
			active = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!roomsLoaded || deepLinkHandled.current) return;
		deepLinkHandled.current = true;
		const roomId = new URLSearchParams(window.location.search).get("room");
		const room = allRooms.find((item) => item.id === roomId);
		if (room) setSelected(room);
	}, [allRooms, roomsLoaded]);
	(0, import_react.useEffect)(() => {
		if (!selected?.remoteId) {
			setComments([]);
			return;
		}
		let active = true;
		setCommentsLoading(true);
		fetch(`/api/posts/${selected.remoteId}/comments`).then(async (response) => {
			if (!response.ok) throw new Error("comments");
			const payload = await response.json();
			if (active) setComments(payload.comments ?? []);
		}).catch(() => active && setComments([])).finally(() => active && setCommentsLoading(false));
		return () => {
			active = false;
		};
	}, [selected?.remoteId]);
	const notify = (message) => {
		setToast(message);
		window.setTimeout(() => setToast(""), 2400);
	};
	const toggleLike = async (room) => {
		if (likedRooms.has(room.id)) return;
		setLikedRooms((current) => new Set(current).add(room.id));
		setLikes((current) => ({
			...current,
			[room.id]: 1
		}));
		if (!room.remoteId) return;
		try {
			const response = await fetch(`/api/posts/${room.remoteId}/like`, { method: "POST" });
			if (!response.ok) throw new Error("like");
			const payload = await response.json();
			if (typeof payload.likes === "number") {
				setRemoteRooms((current) => current.map((item) => item.id === room.id ? {
					...item,
					likes: payload.likes
				} : item));
				setSelected((current) => current?.id === room.id ? {
					...current,
					likes: payload.likes
				} : current);
				setLikes((current) => ({
					...current,
					[room.id]: 0
				}));
			}
		} catch {
			setLikes((current) => ({
				...current,
				[room.id]: 0
			}));
			setLikedRooms((current) => {
				const next = new Set(current);
				next.delete(room.id);
				return next;
			});
			notify("いいねを保存できませんでした");
		}
	};
	const onImage = (event) => {
		const file = event.target.files?.[0];
		if (file) setPreview(URL.createObjectURL(file));
	};
	const submitRoom = async (event) => {
		event.preventDefault();
		setSubmitState("analyzing");
		const form = event.currentTarget;
		const started = Date.now();
		try {
			const response = await fetch("/api/posts", {
				method: "POST",
				body: new FormData(form)
			});
			const payload = await response.json();
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
	const submitComment = async (event) => {
		event.preventDefault();
		if (!selected?.remoteId) return;
		const form = event.currentTarget;
		const data = new FormData(form);
		try {
			const response = await fetch(`/api/posts/${selected.remoteId}/comments`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					handle: data.get("handle"),
					body: data.get("body")
				})
			});
			const payload = await response.json();
			if (!response.ok || !payload.comment) throw new Error(payload.error || "コメントを投稿できませんでした");
			setComments((current) => [...current, payload.comment]);
			setRemoteRooms((current) => current.map((room) => room.id === selected.id ? {
				...room,
				commentCount: (room.commentCount ?? 0) + 1
			} : room));
			form.reset();
		} catch (error) {
			notify(error instanceof Error ? error.message : "コメントを投稿できませんでした");
		}
	};
	const submitReport = async (event) => {
		event.preventDefault();
		if (!reportRoom?.remoteId) return;
		const form = event.currentTarget;
		const data = new FormData(form);
		try {
			const response = await fetch(`/api/posts/${reportRoom.remoteId}/report`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					reason: data.get("reason"),
					details: data.get("details")
				})
			});
			const payload = await response.json();
			if (!response.ok) throw new Error(payload.error || "通報を受け付けられませんでした");
			setReportRoom(null);
			notify("通報を受け付けました。確認にご協力いただきありがとうございます");
		} catch (error) {
			notify(error instanceof Error ? error.message : "通報を受け付けられませんでした");
		}
	};
	const shareDetails = (room) => {
		const text = room ? `${room.shareCopy || `「${room.title}」推し密度 ${room.score}%`}｜OTABASE` : "あなたの“好き”は、部屋に出る。｜OTABASE";
		const url = new URL(window.location.href);
		if (room) url.searchParams.set("room", room.id);
		return {
			text,
			url: url.toString()
		};
	};
	const share = async (room) => {
		const details = shareDetails(room);
		try {
			if (navigator.share) await navigator.share({
				title: "OTABASE",
				text: details.text,
				url: details.url
			});
			else {
				await navigator.clipboard.writeText(`${details.text} ${details.url}`);
				notify("シェア文をコピーしました");
			}
		} catch (error) {
			if (error instanceof DOMException && error.name === "AbortError") return;
			notify("シェアを開けませんでした");
		}
	};
	const shareTo = async (network, room) => {
		const { text, url } = shareDetails(room);
		if (network === "copy") {
			await navigator.clipboard.writeText(`${text} ${url}`);
			notify("シェア文とリンクをコピーしました");
			return;
		}
		const target = network === "x" ? `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` : `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
		window.open(target, "_blank", "noopener,noreferrer,width=720,height=680");
	};
	const shareCard = async (room) => {
		notify("シェアカードを生成中…");
		try {
			const image = await new Promise((resolve, reject) => {
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
			const lines = [];
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
			const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", .94));
			if (!blob) throw new Error("image unavailable");
			const file = new File([blob], `otabase-${room.id}.png`, { type: "image/png" });
			if (navigator.share && navigator.canShare?.({ files: [file] })) {
				const { text, url } = shareDetails(room);
				await navigator.share({
					title: "OTABASE ROOM CARD",
					text,
					url,
					files: [file]
				});
			} else {
				const download = document.createElement("a");
				download.href = URL.createObjectURL(blob);
				download.download = file.name;
				download.click();
				window.setTimeout(() => URL.revokeObjectURL(download.href), 1e3);
				notify("シェアカードを保存しました");
			}
		} catch (error) {
			if (error instanceof DOMException && error.name === "AbortError") return;
			notify("シェアカードを生成できませんでした");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "site-header",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					className: "brand",
					href: "#top",
					"aria-label": "OTABASE ホーム",
					children: [
						"OTA",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "BASE" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sup", { children: "β" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "desktop-nav",
					"aria-label": "メインナビゲーション",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#rooms",
							children: "ROOMS"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setAiOpen(true),
							children: "AI SCAN"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#ranking",
							children: "RANKING"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#about",
							children: "ABOUT"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "post-button",
					onClick: () => setSubmitOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "＋" }), " 部屋を投稿"]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			id: "top",
			className: "hero-section",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hero-copy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "eyebrow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " THE ROOM SAYS EVERYTHING."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
						"あなたの",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "“好き”" }),
						"は、",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"部屋に出る。"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "hero-lead",
						children: [
							"ゲーム、アニメ、音楽、ガジェット。",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"偏愛を詰め込んだ部屋を見せ合う、オタク部屋投稿コミュニティ。"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hero-actions",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "primary-action",
							onClick: () => setSubmitOpen(true),
							children: ["自慢の部屋を投稿する ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "↗" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "text-action",
							onClick: () => document.querySelector("#rooms")?.scrollIntoView({ behavior: "smooth" }),
							children: ["みんなの部屋を見る ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "↓" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hero-stats",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "12,840" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "ROOMS POSTED" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "486K" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "MONTHLY LIKES" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "94%" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "AI SCAN RATE" })] })
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "hero-visual",
				onClick: () => setSelected(rooms[5]),
				"aria-label": "殿堂入りの部屋を見る",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/rooms/hero.jpg",
						alt: "デュアルモニターとゲーミングPCのある部屋"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "vertical-label",
						children: "ROOM OF THE WEEK — 047"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "score-stamp",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "AI" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "99" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
								"PREFERENCE",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"DENSITY"
							] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "hero-caption",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "HALL OF FAME" }),
							"世界大会を見ながら育てた配信部屋。",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "↗" })
						]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "ticker",
			"aria-label": "人気タグ",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				"RGBは正義 ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "✦" }),
				" 4.5畳の宇宙船 ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "✦" }),
				" 推し棚が本体 ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "✦" }),
				" 配線消失バグ ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "✦" }),
				" 深夜の要塞 ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "✦" }),
				" デスク沼からの便り ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "✦" })
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			id: "rooms",
			className: "rooms-section",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "section-heading",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "eyebrow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " DISCOVER ROOMS"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
						"偏愛の数だけ、",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"部屋がある。"
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"AIが写真から“推し密度”を解析。",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"気になる部屋は、使っているモノまで全部わかる。"
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "filter-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "category-tabs",
						role: "tablist",
						"aria-label": "部屋カテゴリ",
						children: categories.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: category === item ? "active" : "",
							onClick: () => setCategory(item),
							children: item
						}, item))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sort-toggle",
						children: ["人気", "新着"].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: sort === item ? "active" : "",
							onClick: () => setSort(item),
							children: item
						}, item))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "room-grid",
					children: filtered.map((room, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: `room-card card-${index % 3}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "image-button",
								onClick: () => setSelected(room),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: room.image,
										alt: room.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "card-tag",
										children: room.tag
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "card-score",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: room.score }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "推し密度" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "view-room",
										children: "ROOM TOUR ↗"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-meta",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: room.category }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [room.views, " VIEWS"] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "card-title",
								onClick: () => setSelected(room),
								children: room.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-footer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: room.user }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "card-reactions",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: ["COM ", room.commentCount ?? 0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: likedRooms.has(room.id) ? "liked" : "",
										onClick: () => toggleLike(room),
										"aria-label": "いいね",
										children: ["♡ ", room.likes + (likes[room.id] || 0)]
									})]
								})]
							})
						]
					}, room.id))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "ai-section",
			id: "about",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ai-copy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "eyebrow light",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " POWERED BY ROOM INTELLIGENCE"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
						"ただ載せるだけじゃ、",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"もったいない。"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "OTABASE AIが写真を読み解き、あなたの部屋を“語れるコンテンツ”に変換します。" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setAiOpen(true),
						children: ["AI SCANを試す ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "↗" })]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ai-console",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "console-top",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "OTABASE / ROOM INTELLIGENCE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ANALYSIS COMPLETE ●" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "scan-layout",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "scan-image",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/rooms/room-8.jpg",
									alt: "AI解析中のPCデスク"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "scan-line" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "focus-box one" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "focus-box two" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "scan-data",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ROOM DNA" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["推し密度 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "89%" })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bars",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["統一感 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: "92%" } })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["沼の深さ ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: "86%" } })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["生活感ゼロ ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: "74%" } })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["真似したさ ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: "96%" } })] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "「白×オレンジ」の色設計に迷いがない。自作PC勢の美学と、配線管理への執念を検出しました。" })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "console-footer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Detected: PC CASE / MONITOR ARM / DESK MAT / HEADSET" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "4 ITEMS MATCHED" })]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "viral-section",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "viral-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "viral-kicker",
						children: "AI GENERATES YOUR ROOM CARD"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
						"わたしの部屋、",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"推し密度 ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "97%" }),
						" でした。"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "viral-tags",
						children: "#紫しか勝たん　#深夜の没入基地　#OTABASE"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "viral-score",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "ROOM DNA" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "97" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/100" })
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "viral-copy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "eyebrow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " SHARE & GO VIRAL"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
						"診断結果まで、",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"シェアしたくなる。"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "AIがあなた専用のルームカードと紹介文を自動生成。X・Instagram・LINEへワンタップで。" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "primary-action",
						onClick: () => setShareOpen(true),
						children: ["シェアカードを作る ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "↗" })]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			id: "ranking",
			className: "ranking-section",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ranking-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "eyebrow light",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " OTA LEAGUE"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "今週、最も刺さった部屋。" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "WEEK 29 / 2026" })]
			}), allRooms.slice().sort((a, b) => b.likes - a.likes).slice(0, 3).map((room, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "ranking-row",
				onClick: () => setSelected(room),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["0", index + 1] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: room.image,
						alt: ""
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: room.category }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: room.title }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: room.user })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rank-score",
						children: [
							"♡ ",
							room.likes,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("i", { children: [room.score, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "AI" })] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rank-arrow",
						children: "↗"
					})
				]
			}, room.id))]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "cta-section",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "eyebrow",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " YOUR ROOM DESERVES THE SPOTLIGHT"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
					"見せてくれ。",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"あなたの",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "“好き”" }),
					"の全部を。"
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "primary-action",
					onClick: () => setSubmitOpen(true),
					children: ["今すぐ部屋を投稿する ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "↗" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "投稿無料・写真1枚から / AIが紹介文をサポート" })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "footer-brand",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					className: "brand",
					href: "#top",
					children: [
						"OTA",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "BASE" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sup", { children: "β" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "偏愛を、部屋から世界へ。" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "footer-links",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "EXPLORE" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#rooms",
							children: "新着の部屋"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#ranking",
							children: "ランキング"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setAiOpen(true),
							children: "AI SCAN"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "GUIDE" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#about",
							children: "OTABASEとは"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSubmitOpen(true),
							children: "投稿ガイド"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setRulesOpen(true),
							children: "コミュニティルール"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "FOLLOW" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => share(),
							children: "X / TWITTER"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => share(),
							children: "INSTAGRAM"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => share(),
							children: "TIKTOK"
						})
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "footer-bottom",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "© 2026 OTABASE" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PRIVACY　 TERMS　 CONTACT" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "MADE FOR EVERY OBSESSION." })
				]
			})
		] }),
		selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "modal-backdrop",
			onMouseDown: (e) => e.target === e.currentTarget && setSelected(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "room-modal",
				role: "dialog",
				"aria-modal": "true",
				"aria-label": selected.title,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "modal-close",
						onClick: () => setSelected(null),
						children: "CLOSE ×"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-image",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: selected.image,
							alt: selected.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["AI SCORE ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: selected.score })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "eyebrow",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
									" ",
									selected.category,
									" / ",
									selected.user
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: selected.title }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: selected.description }),
							selected.archetype && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "room-archetype",
								children: ["ROOM TYPE — ", selected.archetype]
							}),
							selected.tags && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "room-tags",
								children: selected.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tag }, tag))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "dna-row",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: selected.score }), "推し密度"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: selected.scores?.reproducibility ?? 88 }), "真似したさ"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: selected.likes + (likes[selected.id] || 0) }), "いいね"] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "この部屋を再現する" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "product-list",
								children: selected.products.map((product, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `/api/out?room=${encodeURIComponent(selected.id)}&q=${encodeURIComponent(product.query)}&name=${encodeURIComponent(product.name)}&position=${index + 1}`,
									target: "_blank",
									rel: "noreferrer sponsored",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [product.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: product.price || product.reason })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Amazonで見る ↗" })]
								}, `${product.name}-${product.query}`))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "affiliate-note",
								children: "商品リンクにはアフィリエイト広告が含まれます。"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-actions",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "primary-action",
									onClick: () => share(selected),
									children: ["この部屋をシェア ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "↗" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => toggleLike(selected),
									children: "♡ いいね"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "share-card-action",
								onClick: () => shareCard(selected),
								children: "実画像入りルームカードを共有・保存 ↗"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "social-share-row",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => shareTo("x", selected),
										children: "Xでシェア"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => shareTo("line", selected),
										children: "LINE"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => shareTo("copy", selected),
										children: "リンクをコピー"
									})
								]
							}),
							selected.remoteId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "report-action",
								onClick: () => setReportRoom(selected),
								children: "この投稿を通報する"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "comments-section",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: ["ROOM TALK ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: comments.length })] }), selected.remoteId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "comment-list",
									children: commentsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "コメントを読み込み中…" }) : comments.length ? comments.map((comment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: comment.handle }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: comment.body })] }, comment.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "最初のひとことを残してみよう。" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: submitComment,
									className: "comment-form",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											name: "handle",
											required: true,
											maxLength: 32,
											placeholder: "@your_name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											name: "body",
											required: true,
											maxLength: 300,
											placeholder: "この部屋の刺さったポイントは？"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { children: "コメントする ↗" })
									]
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "comment-preview-note",
									children: "コミュニティ投稿では、ここから部屋主にコメントできます。"
								})]
							})
						]
					})
				]
			})
		}),
		submitOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "modal-backdrop",
			onMouseDown: (e) => e.target === e.currentTarget && setSubmitOpen(false),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "submit-modal",
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "部屋を投稿",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "modal-close",
					onClick: () => setSubmitOpen(false),
					children: "CLOSE ×"
				}), submitState === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "submit-complete",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: submittedRoom?.llm ? "OPENAI VISION SCAN COMPLETE" : "LOCAL PREVIEW COMPLETE" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
							"推し密度",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [submittedRoom?.score ?? 94, "%"] })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: submittedRoom?.archetype || "その部屋、かなり刺さります。" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: submittedRoom?.description || "紹介文とシェアカードの下書きを作成しました。" }),
						submittedRoom && !submittedRoom.llm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
							className: "scan-mode-note",
							children: "公開環境にAIキーを設定すると、写真そのものを解析した診断に切り替わります。"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "primary-action",
							onClick: () => {
								setSubmitOpen(false);
								setSubmitState("idle");
								setPreview(null);
								if (submittedRoom) setSelected(submittedRoom);
								notify("部屋を公開しました");
							},
							children: "投稿を見る ↗"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submitRoom,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "eyebrow",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " POST YOUR ROOM"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
							"“好き”の全部を、",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"1枚から。"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: `upload-zone ${preview ? "has-preview" : ""}`,
							children: [preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: preview,
								alt: "投稿写真のプレビュー"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "＋" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "部屋の写真を選ぶ" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "JPG / PNG / WEBP・最大10MB" })
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								name: "image",
								accept: "image/jpeg,image/png,image/webp",
								required: true,
								onChange: onImage
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "form-grid",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["タイトル", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								name: "title",
								required: true,
								placeholder: "例：4.5畳に作った深夜の要塞"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["ユーザー名", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								name: "handle",
								required: true,
								placeholder: "@your_name"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["カテゴリ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							name: "category",
							defaultValue: "ゲーミング",
							children: categories.slice(1).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: item }, item))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["こだわりポイント", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							name: "description",
							required: true,
							placeholder: "この部屋でいちばん見てほしいところは？"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["使っているアイテム（任意）", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "items",
							placeholder: "デスク、ライト、チェアなど"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "primary-action submit-action",
							disabled: submitState === "analyzing",
							children: submitState === "analyzing" ? "AIが部屋を解析中…" : "AI SCANして投稿する ↗"
						})
					]
				})]
			})
		}),
		aiOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "modal-backdrop",
			onMouseDown: (e) => e.target === e.currentTarget && setAiOpen(false),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "simple-modal ai-demo",
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "AI SCANデモ",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "modal-close",
						onClick: () => setAiOpen(false),
						children: "CLOSE ×"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "eyebrow light",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " ROOM INTELLIGENCE"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
						"写真1枚から、",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"部屋の偏愛を言語化。"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "demo-score",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "推し密度" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "94" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "/100" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "色設計、アイテム、配置、生活感を横断して分析。投稿タイトル、紹介文、タグ、シェアカード、買い物リストの候補まで自動生成します。" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "primary-action",
						onClick: () => {
							setAiOpen(false);
							setSubmitOpen(true);
						},
						children: "自分の部屋をスキャン ↗"
					})
				]
			})
		}),
		shareOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "modal-backdrop",
			onMouseDown: (e) => e.target === e.currentTarget && setShareOpen(false),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "simple-modal share-modal",
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "シェアカード作成",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "modal-close",
						onClick: () => setShareOpen(false),
						children: "CLOSE ×"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "eyebrow light",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " VIRAL CARD GENERATOR"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
						"あなたの部屋にも、",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"名前をつけよう。"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "部屋を投稿すると、AIが“推し密度”とキャッチコピーを診断。SNSに最適なカードを自動生成します。" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "primary-action",
						onClick: () => {
							setShareOpen(false);
							setSubmitOpen(true);
						},
						children: "写真を選んで作る ↗"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "ghost-action",
						onClick: () => share(),
						children: "OTABASEを友だちにシェア"
					})
				]
			})
		}),
		rulesOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "modal-backdrop",
			onMouseDown: (e) => e.target === e.currentTarget && setRulesOpen(false),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "simple-modal rules-modal",
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "コミュニティルール",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "modal-close",
						onClick: () => setRulesOpen(false),
						children: "CLOSE ×"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "eyebrow light",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " COMMUNITY RULES"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
						"偏愛には敬意を。",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"人にはやさしく。"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "自分が権利を持つ写真を投稿する。" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "他人の部屋・人物・作品を無断掲載しないでください。" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "好きの大小を競わせない。" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "部屋の広さ、金額、暮らし方や人の属性を嘲笑しないでください。" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "危険・成人向け・違法な内容を載せない。" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "個人情報や住所が写り込んでいないか投稿前に確認してください。" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "商品紹介は正直に。" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "広告・宣伝・提供品は投稿文で明示してください。" })] })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "ルール違反が疑われる投稿は詳細画面から通報できます。複数の通報が集まった投稿は自動的に確認待ちになります。" })
				]
			})
		}),
		reportRoom && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "modal-backdrop",
			onMouseDown: (e) => e.target === e.currentTarget && setReportRoom(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "report-modal",
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "投稿を通報",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "modal-close",
						onClick: () => setReportRoom(null),
						children: "CLOSE ×"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "eyebrow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " REPORT ROOM"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
						"この投稿を",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"確認依頼しますか？"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "report-target",
						children: reportRoom.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submitReport,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["理由", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								name: "reason",
								required: true,
								defaultValue: "",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										disabled: true,
										children: "選択してください"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "権利侵害" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "嫌がらせ・差別" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "成人向け・危険物" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "スパム・宣伝" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "その他" })
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["補足（任意）", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								name: "details",
								maxLength: 500,
								placeholder: "運営が確認しやすい情報を入力してください"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "primary-action",
								children: "確認を依頼する ↗"
							})
						]
					})
				]
			})
		}),
		toast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "toast",
			role: "status",
			children: toast
		})
	] });
}
//#endregion
export { Home as default };
