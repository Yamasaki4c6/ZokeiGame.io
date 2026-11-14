/**
 * サイト全体の設定
 * ------------------------------------------------------------
 * URL や動画など、あとで差し替える項目はここにまとめています。
 * 「TODO」と書かれた項目を本番の値に書き換えてください。
 */
window.SITE_CONFIG = {
  // サークル名
  name: "東京造形大学ゲーム研究会",

  // TODO: 公式X(旧Twitter)のURL
  xUrl: "https://x.com/your_account",

  // TODO: 入部希望 Google フォームのURL
  joinFormUrl: "https://forms.gle/your_form_id",

  // 規約(Notion)
  termsUrl: "https://app.notion.com/p/34be29e853ee8068adf4d0d574d83266",

  // TODO: お問い合わせ用メールアドレス(不要なら空文字 "" にすると非表示)
  contactEmail: "",

  // トップの背景ムービー(「布瑠の言」)
  // TODO: assets/video/hurunokoto.mp4 に動画を置いてください(音声なし・10〜30秒程度・5〜10MB推奨)
  heroVideo: {
    webm: "",                              // 例: "assets/video/hero.webm"(任意)
    mp4: "assets/video/hurunokoto.mp4",
    poster: "assets/img/hero-poster.jpg"   // 動画が読み込めない時・スマホの省データ時に出る静止画
  }
};
