#!/bin/bash
# launch-deploy.sh — 人間の visible terminal から実行すること。
# guard が初回デプロイで /dev/tty による案件名入力(otabeya)を求めるため、
# Hermes のバックグラウンド実行ではなく、ユーザーがこのスクリプトを直接打鍵して実行する。
set -e
cd "/Users/ust/Desktop/オタ部屋投稿掲示板"

echo "== [0/3] ビルド成果の _headers をサブパス配下へ修正 =="
# vinext は basePath を _headers に反映しないため、手動で合わせる
# /assets/*  ->  /advisor/1kh/otby/77/assets/*
if grep -q '^/assets/\*' dist/client/_headers; then
  sed -i '' 's#^/assets/\*#/advisor/1kh/otby/77/assets/*#' dist/client/_headers
  echo "  修正済: $(grep 'assets' dist/client/_headers)"
else
  echo "  すでにサブパス形式 or 該当なし"
fi

echo ""
echo "== [1/3] GitHub push (otabeya) =="
echo "   ※ guard が案件名 'otabeya' の入力を求めるのでタイプして Enter"
guard -- git push -u origin main

echo ""
echo "== [2/3] Cloudflare Worker deploy (otabeya-api) =="
echo "   ※ guard が案件名 'otabeya' の入力を求めるのでタイプして Enter"
guard -- npx wrangler deploy

echo ""
echo "✅ デプロイ完了。ブラウザで確認:"
echo "   https://labs-88.com/advisor/1kh/otby/77/"
echo ""
echo "確認項目:"
echo "  - トップページが表示される"
echo "  - /advisor/1kh/otby/77/assets/* が 200"
echo "  - /advisor/1kh/otby/77/api/posts が JSON を返す"
echo "  - ルート / は既存 photo-web のまま（404ではなく200）"
