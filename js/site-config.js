/**
 * サイト全体の設定
 * ------------------------------------------------------------
 * URL や動画など、あとで差し替える項目はここにまとめています。
 * 「TODO」と書かれた項目を本番の値に書き換えてください。
 */
window.SITE_CONFIG = {
  // サークル名
  name: "東京造形大学ゲーム研究会",

  // 公式X
  xUrl: "https://x.com/zokeigame2026",

  // TODO: 入部希望 Google フォームのURL
  joinFormUrl: "https://forms.gle/your_form_id",

  // 規約(Notion)
  termsUrl: "https://app.notion.com/p/34be29e853ee8068adf4d0d574d83266",

  // TODO: お問い合わせ用メールアドレス(不要なら空文字 "" にすると非表示)
  contactEmail: "",

  // トップの背景(5秒ごとに切り替わります)
  //   title : 左下に表示する作品名
  //   video : 動画(任意・音声なし・mp4)。無い場合や省データ設定時は image を表示
  //   image : 静止画(動画の場合は読み込み前に表示される画像)
  heroInterval: 5000,
  heroSlides: [
    { title: "布瑠の言", video: "assets/video/hurunokoto.mp4", image: "assets/img/hero-poster.jpg" },
    { title: "sara", image: "assets/img/games/sara.jpg" }
  ]
};
