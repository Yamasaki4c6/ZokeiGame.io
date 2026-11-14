# 東京造形大学ゲーム研究会 公式サイト

GitHub Pages で公開する静的サイトです(ビルド不要。HTML / CSS / JavaScript のみ)。

## ファイル構成

```
index.html              トップページ
events/                 ゲームジャム・LT会・勉強会のページ
js/events.js            ★ イベントカードのデータ
404.html                ページが見つからないとき
games/coming-soon.html  公式ページ未作成の作品用「準備中」ページ
css/style.css           デザイン(色は先頭の :root で一括変更)
js/site-config.js       ★ X・Googleフォーム・背景動画などの設定
js/games.js             ★ 作品カードのデータ
js/news.js              ★ News(トップには上から3件)
js/members.js           ★ 部員紹介(members.html)
js/main.js              動作(基本的に編集不要)
assets/video/           背景ムービーを置く場所
assets/img/             画像(favicon・OGP・サムネイル)
```

## よくある更新

### 作品を追加する
`js/games.js` の配列に1件追加するだけで、トップにカードが増えます。
公式ページができたら `url` にそのURL(例: `games/my-game/index.html`)を入れてください。空のままだと「準備中」ページに飛びます。

### X・入部フォーム・規約(Notion)のURLを設定する
`js/site-config.js` の `xUrl` / `joinFormUrl` / `termsUrl` を書き換えます。全ページのリンクに反映されます。

### トップの背景を差し替える
`js/site-config.js` の `heroSlides` に作品名・動画・画像を並べます。5秒ごとに切り替わり、左下に作品名が出ます(間隔は `heroInterval`)。
動画は音声なし・10〜30秒・5MB前後の mp4 がおすすめです。省データ設定や「視差効果を減らす」設定の閲覧者には自動再生しません。

## ローカルで確認

```sh
python3 -m http.server 8000
# → http://localhost:8000/
```

## 公開(GitHub Pages)

リポジトリの Settings → Pages → Build and deployment で
「Deploy from a branch」/ `main` / `/ (root)` を選んで保存します。
公開URLは `https://yamasaki4c6.github.io/ZokeiGame.io/` になります。
