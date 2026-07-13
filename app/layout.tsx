import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: "OTABASE｜偏愛を、部屋から世界へ。",
    description: "ゲーム、アニメ、音楽、ガジェット。偏愛を詰め込んだ部屋を見せ合い、AIが推し密度を診断するオタク部屋投稿コミュニティ。",
    openGraph: {
      title: "OTABASE｜あなたの“好き”は、部屋に出る。",
      description: "部屋を投稿すると、AIが推し密度・紹介文・シェアカードを生成。",
      type: "website",
      locale: "ja_JP",
      images: [{ url: new URL("/og.png", metadataBase).href, width: 1200, height: 630, alt: "OTABASE — あなたの好きは、部屋に出る。" }],
    },
    twitter: { card: "summary_large_image", title: "OTABASE｜あなたの“好き”は、部屋に出る。", description: "偏愛を詰め込んだ部屋を見せ合う、オタク部屋投稿コミュニティ。", images: [new URL("/og.png", metadataBase).href] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
